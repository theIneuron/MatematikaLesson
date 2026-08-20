// ============================================================================
// 4-SINF · Dars 19 · Kasrlarni taqqoslash
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 145-147-betlar.
//   145-bet: to'rtta rangli to'rtburchak — butun, yarimlar, choraklar va
//            sakkizdan birlar; "butunda nechta yarim, chorak va sakkizdan bir
//            ulush bor", "yarimda nechta chorak va sakkizdan bir ulush bor";
//   146-bet: 1/2 = 2/4 = 4/8, 1/4 = 2/8; "1/2 birdan 1/4 va 1/8 dan katta,
//            demak 1/8 < 1/4 < 1/2"; XULOSA — "bir xil suratli ikki kasrdan
//            maxraji katta bo'lgani kichik bo'ladi", misollar 3/7 < 3/5,
//            2/3 > 2/11; bir xil maxrajli kasrlarni taqqoslash mashqi;
//   147-bet: 1/2 = 2/4, 1/2 = 4/8, 2/8 = 4/16 tengliklarini tekshirish.
//
// Syujet: Lumo City taqsimlash markazi, energiya uzeli (SYUJET_4SINF.md,
// 3-blok). Ikki tuman bir xil akkumulyatordan quvvat oladi — shu sababli
// kasrlar bir xil butunning ulushlari bo'ladi va taqqoslash ma'noli bo'ladi.
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Yangi mexanika: OrderStrip — bola kasrlarni kichikdan kattaga tizadi, ya'ni
// qoidani ketma-ket ikki marta qo'llaydi va tasodifan topib qo'ya olmaydi.
// ============================================================================
import {
  ChoiceScreen, FitSvg, FractionBar, FractionGlyph, KIT_STYLES,
  OrderStrip, RevealScreen, RuleRows, SlotScreen, StepList, SummaryScreen, T,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'fraction-compare-4-19-v2',
  slug: 'dars19-kasrlarni-taqqoslash',
  lessonTitle: {
    uz: '19-dars. Kasrlarni taqqoslash',
    ru: 'Урок 19. Сравнение дробей',
    en: 'Lesson 19. Comparing fractions',
  },
  skillTags: ['fraction', 'comparison', 'same_denominator', 'same_numerator', 'benchmark_half'],
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

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3];

// Variantlar yolg'iz belgi emas, to'liq yozuv bo'ladi: keng tugma ichida
// bitta "kichik" belgisi ko'rinmay ketardi va bola nimani tanlayotganini
// yozuvdan o'qib olmasdi.
const signOptions = (a, b) => [
  { uz: `${a} < ${b}`, ru: `${a} < ${b}`, en: `${a} < ${b}` },
  { uz: `${a} > ${b}`, ru: `${a} > ${b}`, en: `${a} > ${b}` },
  { uz: `${a} = ${b}`, ru: `${a} = ${b}`, en: `${a} = ${b}` },
];

const CONTENT = {
  // -------------------------------------------------------------------------
  s0: {
    eyebrow: { uz: 'Energiya uzeli', ru: 'Энергетический узел', en: 'The energy node' },
    title: {
      uz: 'Ikkita akkumulyator, ikkalasida uchta ulush',
      ru: 'Два аккумулятора, в каждом по три доли',
      en: 'Two batteries, three shares in each',
    },
    question: {
      uz: 'Qaysi tumanda quvvat koproq?',
      ru: 'В каком районе энергии больше?',
      en: 'Which district has more energy?',
    },
    options: [
      {
        uz: "Beshta bo'lakka bo'lingan tumanda",
        ru: 'В районе, где пять частей',
        en: 'In the district split into five parts',
      },
      {
        uz: "Yettita bo'lakka bo'lingan tumanda",
        ru: 'В районе, где семь частей',
        en: 'In the district split into seven parts',
      },
      {
        uz: "Ikkalasida teng, chunki suratlari bir xil",
        ru: 'В обоих одинаково, ведь числители равны',
        en: 'Equal in both, because the numerators are the same',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Akkumulyatorlar bir xil, lekin beshta bo'lakning bittasi yettita bo'lakning bittasidan kattaroq. Shuning uchun uchta katta bo'lak uchta kichik bo'lakdan ko'p quvvat beradi.",
      ru: 'Верно. Аккумуляторы одинаковые, но одна часть из пяти больше, чем одна часть из семи. Поэтому три больших части дают больше энергии, чем три маленьких.',
      en: 'Correct. The batteries are the same, but one part out of five is bigger than one part out of seven. So three big parts hold more energy than three small ones.',
    },
    wrong: [
      null,
      {
        uz: "Yettita bo'lakka bo'linganda har bir bo'lak kichikroq bo'ladi. Uchta kichik bo'lak uchta kattadan kam quvvat beradi.",
        ru: 'Когда делят на семь частей, каждая часть становится меньше. Три маленькие части дают меньше энергии, чем три большие.',
        en: 'Splitting into seven parts makes each part smaller. Three small parts hold less energy than three big ones.',
      },
      {
        uz: "Suratlar rostdan bir xil, lekin ulushlar kattaligi har xil. Chizmaga qarang: pastdagi bo'yalgan qism qisqaroq.",
        ru: 'Числители действительно одинаковые, но величина долей разная. Посмотри на чертёж: нижняя закрашенная часть короче.',
        en: 'The numerators really are the same, but the shares differ in size. Look at the drawing: the lower shaded part is shorter.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          'Salom! Biz taqsimlash markazining energiya uzelidamiz.',
          "Ikki tuman bir xil akkumulyatordan quvvat oladi. Akkumulyatorlar aynan bir xil kattalikda.",
          "Birinchi tumanning akkumulyatori beshta teng bo'lakka bo'lingan va uchtasi quvvatlangan. Ikkinchisi yettita teng bo'lakka bo'lingan, unda ham uchtasi quvvatlangan.",
          "Uchtasi ham, uchtasi ham. Qaysi tumanda quvvat koproq? Chizmaga qarab javob bering.",
        ],
        ru: [
          'Привет! Мы на энергетическом узле распределительного центра.',
          'Два района получают энергию от одинаковых аккумуляторов. Аккумуляторы совершенно одного размера.',
          'Аккумулятор первого района разделён на пять равных частей, и три из них заряжены. Второй разделён на семь равных частей, и там тоже заряжены три.',
          'И там три, и тут три. В каком районе энергии больше? Ответь, глядя на чертёж.',
        ],
        en: [
          'Hello! We are at the energy node of the distribution centre.',
          'Two districts draw power from identical batteries. The batteries are exactly the same size.',
          "The first district's battery is split into five equal parts with three charged. The second is split into seven equal parts, also with three charged.",
          'Three there and three here. Which district has more energy? Answer by looking at the drawing.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s1: {
    eyebrow: { uz: 'Teng maxraj', ru: 'Равный знаменатель', en: 'Equal denominators' },
    title: {
      uz: 'Ulushlar bir xil bo\'lsa, sanash yetarli',
      ru: 'Если доли одинаковы, достаточно посчитать',
      en: 'When the shares are the same size, counting is enough',
    },
    lead: {
      uz: 'Maxrajlar teng, demak bo\'laklar ham teng kattalikda.',
      ru: 'Знаменатели равны, значит и части одинаковой величины.',
      en: 'The denominators are equal, so the parts have the same size.',
    },
    note: {
      uz: "Teng maxrajli kasrlardan surati katta bo'lgani katta bo'ladi.",
      ru: 'Из дробей с равными знаменателями больше та, у которой числитель больше.',
      en: 'Of two fractions with equal denominators the one with the bigger numerator is bigger.',
    },
    audio: {
      intro: {
        uz: [
          "Eng oson hol shu: maxrajlar teng bo'lsa.",
          "Ikkala akkumulyator ham sakkizta teng bo'lakka bo'lingan. Bo'laklar bir xil kattalikda.",
          "Birinchisida to'rttasi quvvatlangan, ikkinchisida oltitasi.",
          "To'rtta bo'lak oltita bo'lakdan kam. Demak sakkizdan to'rt sakkizdan oltidan kichik. Maxrajlar teng bo'lganda faqat suratlarga qaraymiz.",
        ],
        ru: [
          'Самый простой случай это когда знаменатели равны.',
          'Оба аккумулятора разделены на восемь равных частей. Части одинаковой величины.',
          'В первом заряжены четыре, во втором шесть.',
          'Четыре части меньше шести. Значит четыре восьмых меньше шести восьмых. При равных знаменателях смотрим только на числители.',
        ],
        en: [
          'The easiest case is when the denominators are equal.',
          'Both batteries are split into eight equal parts. The parts have the same size.',
          'The first has four charged, the second six.',
          'Four parts are fewer than six. So four eighths is less than six eighths. With equal denominators we look only at the numerators.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s2: {
    eyebrow: { uz: 'Tartibga soling', ru: 'Расставь по порядку', en: 'Put them in order' },
    title: {
      uz: 'Uchta kasrni kichikdan kattaga tizing',
      ru: 'Расставь три дроби от меньшей к большей',
      en: 'Order the three fractions from smallest to largest',
    },
    question: {
      uz: 'Eng kichigidan boshlab bosing.',
      ru: 'Нажимай начиная с наименьшей.',
      en: 'Tap them starting with the smallest.',
    },
    cards: [
      { num: 5, den: 9 },
      { num: 2, den: 9 },
      { num: 8, den: 9 },
    ],
    order: [1, 0, 2],
    wrongText: {
      uz: "Bu hozir eng kichigi emas. Maxrajlar bir xil, shuning uchun faqat suratlarni taqqoslang.",
      ru: 'Это сейчас не наименьшая. Знаменатели одинаковые, поэтому сравнивай только числители.',
      en: 'That is not the smallest right now. The denominators are the same, so compare only the numerators.',
    },
    correctText: {
      uz: "To'g'ri. To'qqizdan ikki, to'qqizdan besh, to'qqizdan sakkiz. Maxraj bir xil bo'lgani uchun suratlar tartibi kasrlar tartibini beradi.",
      ru: 'Верно. Две девятых, пять девятых, восемь девятых. Знаменатель одинаковый, поэтому порядок числителей задаёт порядок дробей.',
      en: 'Correct. Two ninths, five ninths, eight ninths. The denominator is the same, so the order of the numerators sets the order of the fractions.',
    },
    audio: {
      intro: {
        uz: [
          "Uzelga uchta o'lchov keldi. Hammasi to'qqizta teng bo'lakka bo'lingan akkumulyatorlardan.",
          "Ularni kichikdan kattaga tizish kerak.",
          'Eng kichigidan boshlab kartochkalarni bosing.',
        ],
        ru: [
          'На узел поступили три измерения. Все они с аккумуляторов, разделённых на девять равных частей.',
          'Их нужно расставить от меньшего к большему.',
          'Нажимай карточки начиная с наименьшей.',
        ],
        en: [
          'Three readings have arrived at the node. All of them from batteries split into nine equal parts.',
          'They have to be ordered from smallest to largest.',
          'Tap the cards starting with the smallest.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s3: {
    eyebrow: { uz: 'Teng surat', ru: 'Равный числитель', en: 'Equal numerators' },
    title: {
      uz: 'Maxraj katta bo\'lsa, ulush kichik bo\'ladi',
      ru: 'Чем больше знаменатель, тем меньше доля',
      en: 'The bigger the denominator, the smaller the share',
    },
    lead: {
      uz: 'Bitta butunni koproq bo\'lakka bo\'lsak, har bir bo\'lak kichrayadi.',
      ru: 'Если одно целое разделить на больше частей, каждая часть станет меньше.',
      en: 'Splitting one whole into more parts makes every part smaller.',
    },
    note: {
      uz: "Shuning uchun sakkizdan bir to'rtdan birdan, to'rtdan bir esa ikkidan birdan kichik.",
      ru: 'Поэтому одна восьмая меньше одной четвёртой, а одна четвёртая меньше одной второй.',
      en: 'So one eighth is less than one quarter, and one quarter is less than one half.',
    },
    audio: {
      intro: {
        uz: [
          "Endi ikkinchi hol: suratlar bir xil, maxrajlar har xil.",
          "Bitta akkumulyatorni ikkita teng bo'lakka bo'ldik. Bitta bo'lak juda katta.",
          "Xuddi shu akkumulyatorni to'rtta bo'lakka bo'lsak, bitta bo'lak ikki barobar kichrayadi.",
          "Sakkizta bo'lakka bo'lsak, yana kichrayadi. Butun o'zgarmadi, faqat bo'laklar soni ko'paydi. Shuning uchun maxraji katta kasr kichik bo'ladi.",
        ],
        ru: [
          'Теперь второй случай: числители одинаковые, а знаменатели разные.',
          'Один аккумулятор разделили на две равные части. Одна часть очень большая.',
          'Если этот же аккумулятор разделить на четыре части, одна часть станет вдвое меньше.',
          'А если на восемь частей, станет ещё меньше. Целое не изменилось, изменилось только число частей. Поэтому дробь с большим знаменателем меньше.',
        ],
        en: [
          'Now the second case: the numerators are the same and the denominators differ.',
          'One battery was split into two equal parts. One part is very big.',
          'Splitting the same battery into four parts makes one part twice as small.',
          'Splitting it into eight parts makes it smaller still. The whole did not change, only the number of parts. So a fraction with a bigger denominator is smaller.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s4: {
    eyebrow: { uz: 'Belgini qo\'ying', ru: 'Поставь знак', en: 'Place the sign' },
    title: {
      uz: 'Suratlar teng, maxrajlar har xil',
      ru: 'Числители равны, знаменатели разные',
      en: 'Equal numerators, different denominators',
    },
    question: {
      uz: '3/7 va 3/5 orasiga qaysi belgi qo\'yiladi?',
      ru: 'Какой знак поставить между 3/7 и 3/5?',
      en: 'Which sign goes between 3/7 and 3/5?',
    },
    options: signOptions('3/7', '3/5'),
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yettidan uch beshdan uchdan kichik, chunki yettita bo'lakning bittasi beshta bo'lakning bittasidan kichik.",
      ru: 'Верно. Три седьмых меньше трёх пятых, потому что одна часть из семи меньше одной части из пяти.',
      en: 'Correct. Three sevenths is less than three fifths, because one part out of seven is smaller than one part out of five.',
    },
    wrong: [
      null,
      {
        uz: "Yetti beshdan katta, lekin maxraj katta bo'lganda ulush kichrayadi. Chizmaga qarang: yuqoridagi bo'yalgan qism qisqaroq.",
        ru: 'Семь больше пяти, но при большем знаменателе доля становится меньше. Посмотри на чертёж: верхняя закрашенная часть короче.',
        en: 'Seven is more than five, but a bigger denominator makes the share smaller. Look at the drawing: the upper shaded part is shorter.',
      },
      {
        uz: "Teng emas. Suratlar bir xil, ammo ulushlar kattaligi har xil, shuning uchun kasrlar ham har xil.",
        ru: 'Не равны. Числители одинаковые, но величина долей разная, поэтому и дроби разные.',
        en: 'They are not equal. The numerators match, but the shares differ in size, so the fractions differ too.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ikkita o'lchov keldi. Yettidan uch va beshdan uch.",
          "Suratlar bir xil, maxrajlar esa har xil.",
          'Qaysi belgi mos kelishini tanlang.',
        ],
        ru: [
          'Пришли два измерения. Три седьмых и три пятых.',
          'Числители одинаковые, а знаменатели разные.',
          'Выбери подходящий знак.',
        ],
        en: [
          'Two readings have arrived. Three sevenths and three fifths.',
          'The numerators are the same and the denominators differ.',
          'Choose the matching sign.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s5: {
    eyebrow: { uz: 'Teng kasrlar', ru: 'Равные дроби', en: 'Equal fractions' },
    title: {
      uz: 'Har xil yozuv, bir xil qism',
      ru: 'Разная запись, одна и та же часть',
      en: 'Different records, the same part',
    },
    lead: {
      uz: 'Bitta joyni turlicha bo\'lish mumkin, lekin qism o\'zi o\'zgarmaydi.',
      ru: 'Одно и то же место можно разделить иначе, но сама часть не меняется.',
      en: 'The same place can be divided differently, yet the part itself stays.',
    },
    note: {
      uz: '1/2 = 2/4 = 4/8 — chizmalar ustma-ust tushadi.',
      ru: '1/2 = 2/4 = 4/8 — чертежи совпадают.',
      en: '1/2 = 2/4 = 4/8 — the drawings coincide.',
    },
    audio: {
      intro: {
        uz: [
          "Uchinchi hol qiziq: kasrlar har xil yozilgan, lekin ular teng.",
          "Akkumulyatorning yarmi quvvatlangan. Bu ikkidan bir.",
          "Xuddi shu joyni to'rtta bo'lakka bo'lsak, quvvatlangan qism ikkita bo'lakni egallaydi. Bu to'rtdan ikki.",
          "Sakkizta bo'lakka bo'lsak, to'rtta bo'lak chiqadi. Uch yozuv ham bitta qismni ko'rsatadi, demak ular teng.",
        ],
        ru: [
          'Третий случай интересный: дроби записаны по-разному, но они равны.',
          'Половина аккумулятора заряжена. Это одна вторая.',
          'Если это же место разделить на четыре части, заряженная часть займёт две части. Это две четвёртых.',
          'А при делении на восемь частей выйдет четыре части. Все три записи показывают одну и ту же часть, значит они равны.',
        ],
        en: [
          'The third case is interesting: the fractions are written differently but they are equal.',
          'Half of the battery is charged. That is one half.',
          'Dividing the same place into four parts makes the charged part take up two parts. That is two quarters.',
          'Dividing into eight parts gives four parts. All three records show the same part, so they are equal.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s6: {
    eyebrow: { uz: 'Yarimga teng', ru: 'Равно половине', en: 'Equal to a half' },
    title: {
      uz: 'Qaysi kasr yarimga teng?',
      ru: 'Какая дробь равна половине?',
      en: 'Which fraction equals a half?',
    },
    question: {
      uz: 'Chizmaga qarab mos kasrni tanlang.',
      ru: 'Посмотри на чертёж и выбери подходящую дробь.',
      en: 'Look at the drawing and choose the matching fraction.',
    },
    slots: [
      {
        label: { uz: '2/4', ru: '2/4', en: '2/4' },
        caption: { uz: "to'rtta bo'lakdan ikki", ru: 'две из четырёх', en: 'two out of four' },
      },
      {
        label: { uz: '2/8', ru: '2/8', en: '2/8' },
        caption: { uz: "sakkizta bo'lakdan ikki", ru: 'две из восьми', en: 'two out of eight' },
      },
      {
        label: { uz: '3/4', ru: '3/4', en: '3/4' },
        caption: { uz: "to'rtta bo'lakdan uch", ru: 'три из четырёх', en: 'three out of four' },
      },
    ],
    correctSlot: 0,
    correctText: {
      uz: "To'g'ri. To'rtta bo'lakning ikkitasi aynan yarmini beradi. Chizmalar ustma-ust tushadi.",
      ru: 'Верно. Две части из четырёх дают ровно половину. Чертежи совпадают.',
      en: 'Correct. Two parts out of four give exactly a half. The drawings coincide.',
    },
    wrong: [
      null,
      {
        uz: "Sakkizta bo'lakdan ikkitasi yarim emas, chorak. Yarim uchun to'rtta bo'lak kerak edi.",
        ru: 'Две части из восьми это не половина, а четверть. Для половины нужны четыре части.',
        en: 'Two parts out of eight is not a half but a quarter. A half would need four parts.',
      },
      {
        uz: "To'rtta bo'lakdan uchtasi yarimdan katta. Yarim uchun ikkitasi yetarli.",
        ru: 'Три части из четырёх больше половины. Для половины хватает двух.',
        en: 'Three parts out of four is more than a half. Two of them are enough for a half.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Chizmada akkumulyatorning aynan yarmi quvvatlangan.",
          "Uchta yozuv berilgan, ulardan bittasi shu yarimga teng.",
          'Mosini tanlang.',
        ],
        ru: [
          'На чертеже заряжена ровно половина аккумулятора.',
          'Даны три записи, одна из них равна этой половине.',
          'Выбери подходящую.',
        ],
        en: [
          'Exactly half of the battery is charged in the drawing.',
          'Three records are given and one of them equals that half.',
          'Choose the right one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s7: {
    eyebrow: { uz: 'Yarim tayanch', ru: 'Половина как опора', en: 'The half benchmark' },
    title: {
      uz: 'Yarim tez taqqoslash uchun tayanch',
      ru: 'Половина это опора для быстрого сравнения',
      en: 'A half is a handy benchmark',
    },
    lead: {
      uz: 'Surat maxrajning yarmidan ko\'p bo\'lsa, kasr yarimdan katta.',
      ru: 'Если числитель больше половины знаменателя, дробь больше половины.',
      en: 'If the numerator is more than half the denominator, the fraction is more than a half.',
    },
    note: {
      uz: 'Sakkizning yarmi to\'rt: 3/8 yarimdan kichik, 5/8 esa yarimdan katta.',
      ru: 'Половина восьми это четыре: 3/8 меньше половины, а 5/8 больше половины.',
      en: 'Half of eight is four: 3/8 is below a half and 5/8 is above it.',
    },
    audio: {
      intro: {
        uz: [
          "Ba'zan maxrajlar ham, suratlar ham har xil bo'ladi. Shunda yarim yordam beradi.",
          "Akkumulyator sakkizta bo'lakka bo'lingan. Sakkizning yarmi to'rt, demak to'rtta bo'lak aynan yarim.",
          "Sakkizdan uchda uchta bo'lak bor. Uch to'rtdan kam, demak bu kasr yarimdan kichik.",
          "Sakkizdan beshda beshta bo'lak bor. Besh to'rtdan ko'p, demak bu kasr yarimdan katta. Yarimdan kichik kasr yarimdan katta kasrdan har doim kichik.",
        ],
        ru: [
          'Иногда и знаменатели, и числители разные. Тогда помогает половина.',
          'Аккумулятор разделён на восемь частей. Половина восьми это четыре, значит четыре части это ровно половина.',
          'В трёх восьмых три части. Три меньше четырёх, значит эта дробь меньше половины.',
          'В пяти восьмых пять частей. Пять больше четырёх, значит эта дробь больше половины. Дробь меньше половины всегда меньше дроби больше половины.',
        ],
        en: [
          'Sometimes both the denominators and the numerators differ. Then a half helps.',
          'The battery is split into eight parts. Half of eight is four, so four parts make exactly a half.',
          'Three eighths has three parts. Three is fewer than four, so this fraction is below a half.',
          'Five eighths has five parts. Five is more than four, so this fraction is above a half. A fraction below a half is always smaller than one above it.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s8: {
    eyebrow: { uz: 'Uchta ulush', ru: 'Три доли', en: 'Three shares' },
    title: {
      uz: 'Bir xil suratli kasrlarni tizing',
      ru: 'Расставь дроби с одинаковым числителем',
      en: 'Order the fractions with the same numerator',
    },
    question: {
      uz: 'Eng kichigidan boshlab bosing.',
      ru: 'Нажимай начиная с наименьшей.',
      en: 'Tap them starting with the smallest.',
    },
    cards: [
      { num: 1, den: 4 },
      { num: 1, den: 2 },
      { num: 1, den: 8 },
    ],
    order: [2, 0, 1],
    wrongText: {
      uz: "Bu hozir eng kichigi emas. Suratlar bir xil, shuning uchun maxraji eng katta bo'lgan kasr eng kichik bo'ladi.",
      ru: 'Это сейчас не наименьшая. Числители одинаковые, поэтому наименьшая та, у которой знаменатель наибольший.',
      en: 'That is not the smallest right now. The numerators are the same, so the one with the biggest denominator is the smallest.',
    },
    correctText: {
      uz: "To'g'ri. Sakkizdan bir, to'rtdan bir, ikkidan bir. Maxraj kichraygani sari ulush kattalashadi.",
      ru: 'Верно. Одна восьмая, одна четвёртая, одна вторая. Чем меньше знаменатель, тем больше доля.',
      en: 'Correct. One eighth, one quarter, one half. The smaller the denominator, the bigger the share.',
    },
    audio: {
      intro: {
        uz: [
          "Uchta kartochkada suratlar bir xil, hammasi bir.",
          "Maxrajlar esa har xil: ikki, to'rt va sakkiz.",
          'Kasrlarni kichikdan kattaga tizing.',
        ],
        ru: [
          'На трёх карточках числители одинаковые, все они единицы.',
          'А знаменатели разные: два, четыре и восемь.',
          'Расставь дроби от меньшей к большей.',
        ],
        en: [
          'The three cards have the same numerator, all of them one.',
          'The denominators differ: two, four and eight.',
          'Order the fractions from smallest to largest.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s9: {
    eyebrow: { uz: 'Usulni tanlash', ru: 'Выбор способа', en: 'Choosing the method' },
    title: {
      uz: 'Qaysi usul kerakligini nima aytadi?',
      ru: 'Что подсказывает, какой способ нужен?',
      en: 'What tells you which method to use?',
    },
    lead: {
      uz: 'Avval nimasi bir xil ekaniga qaraymiz: maxrajmi, suratmi yoki hech biri.',
      ru: 'Сначала смотрим, что одинаково: знаменатель, числитель или ничего.',
      en: 'First we look at what matches: the denominator, the numerator or neither.',
    },
    note: {
      uz: 'Hech nimasi bir xil bo\'lmasa, ikkalasini yarim bilan taqqoslaymiz.',
      ru: 'Если ничего не совпадает, сравниваем обе дроби с половиной.',
      en: 'If nothing matches, we compare both fractions with a half.',
    },
    audio: {
      intro: {
        uz: [
          "Uchta usul bor va ularni aralashtirmaslik kerak.",
          "Maxrajlar bir xil bo'lsa, suratlarni taqqoslaymiz. Bu eng oson yo'l.",
          "Suratlar bir xil bo'lsa, maxrajlarga qaraymiz. Maxraji katta bo'lgani kichik bo'ladi.",
          "Hech nimasi bir xil bo'lmasa, ikkala kasrni yarim bilan solishtiramiz.",
        ],
        ru: [
          'Есть три способа, и их не надо путать.',
          'Если знаменатели одинаковые, сравниваем числители. Это самый простой путь.',
          'Если числители одинаковые, смотрим на знаменатели. Та, у которой знаменатель больше, меньше.',
          'Если ничего не совпадает, сравниваем обе дроби с половиной.',
        ],
        en: [
          'There are three methods and they must not be mixed up.',
          'If the denominators match, compare the numerators. That is the easiest route.',
          'If the numerators match, look at the denominators. The one with the bigger denominator is smaller.',
          'If nothing matches, compare both fractions with a half.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s10: {
    eyebrow: { uz: 'Katta farq', ru: 'Большая разница', en: 'A big gap' },
    title: {
      uz: 'Uchdan ikki va o\'n birdan ikki',
      ru: 'Две третьих и две одиннадцатых',
      en: 'Two thirds and two elevenths',
    },
    question: {
      uz: '2/3 va 2/11 orasiga qaysi belgi qo\'yiladi?',
      ru: 'Какой знак поставить между 2/3 и 2/11?',
      en: 'Which sign goes between 2/3 and 2/11?',
    },
    options: signOptions('2/3', '2/11'),
    correctIndex: 1,
    correctText: {
      uz: "To'g'ri. Uchdan ikki o'n birdan ikkidan katta. Uchta bo'lakning bittasi o'n birta bo'lakning bittasidan ancha katta.",
      ru: 'Верно. Две третьих больше двух одиннадцатых. Одна часть из трёх намного больше одной части из одиннадцати.',
      en: 'Correct. Two thirds is more than two elevenths. One part out of three is much bigger than one part out of eleven.',
    },
    wrong: [
      {
        uz: "O'n bir uchdan katta, lekin maxraj katta bo'lganda ulush kichrayadi. Bu qoidani teskari qo'llash oson xato.",
        ru: 'Одиннадцать больше трёх, но при большем знаменателе доля меньше. Применить правило наоборот легко ошибиться.',
        en: 'Eleven is more than three, but a bigger denominator makes a smaller share. Applying the rule backwards is an easy slip.',
      },
      null,
      {
        uz: "Teng emas. Suratlar bir xil, lekin bo'laklar kattaligi juda farq qiladi.",
        ru: 'Не равны. Числители одинаковые, но величина частей отличается очень сильно.',
        en: 'They are not equal. The numerators match, but the parts differ a great deal in size.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Uzelga yana ikkita o'lchov keldi.",
          "Uchdan ikki va o'n birdan ikki. Suratlar bir xil, maxrajlar juda farq qiladi.",
          'Qaysi belgi mos kelishini tanlang.',
        ],
        ru: [
          'На узел пришли ещё два измерения.',
          'Две третьих и две одиннадцатых. Числители одинаковые, знаменатели очень разные.',
          'Выбери подходящий знак.',
        ],
        en: [
          'Two more readings have arrived at the node.',
          'Two thirds and two elevenths. The numerators are the same, the denominators very different.',
          'Choose the matching sign.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s11: {
    eyebrow: { uz: 'Taqqoslash qoidalari', ru: 'Правила сравнения', en: 'Comparison rules' },
    title: {
      uz: 'Uchta usul, bitta shart',
      ru: 'Три способа, одно условие',
      en: 'Three methods, one condition',
    },
    lead: {
      uz: 'Taqqoslash faqat bir xil butunning ulushlari uchun ma\'noli.',
      ru: 'Сравнение имеет смысл только для долей одного и того же целого.',
      en: 'Comparison only makes sense for shares of the same whole.',
    },
    note: {
      uz: 'Butunlar har xil bo\'lsa, kasrlarni taqqoslash mumkin emas.',
      ru: 'Если целые разные, дроби сравнивать нельзя.',
      en: 'If the wholes differ, the fractions cannot be compared.',
    },
    audio: {
      intro: {
        uz: [
          "Bugungi qoidalarni bir joyga yig'amiz.",
          "Teng maxrajda surati katta bo'lgan kasr katta bo'ladi.",
          "Teng suratda maxraji katta bo'lgan kasr kichik bo'ladi.",
          "Hech nimasi teng bo'lmasa, yarim bilan solishtiramiz. Va eng muhimi: butun bir xil bo'lishi shart.",
        ],
        ru: [
          'Соберём сегодняшние правила в одно место.',
          'При равных знаменателях больше та дробь, у которой числитель больше.',
          'При равных числителях меньше та дробь, у которой знаменатель больше.',
          'Если ничего не совпадает, сравниваем с половиной. И самое важное: целое обязано быть одним и тем же.',
        ],
        en: [
          "Let us gather today's rules in one place.",
          'With equal denominators the fraction with the bigger numerator is bigger.',
          'With equal numerators the fraction with the bigger denominator is smaller.',
          'If nothing matches, compare with a half. And most important: the whole must be the same.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s12: {
    eyebrow: { uz: 'Usul tanlash', ru: 'Выбор способа', en: 'Picking the method' },
    title: {
      uz: '5/6 va 5/9 uchun qaysi usul kerak?',
      ru: 'Какой способ нужен для 5/6 и 5/9?',
      en: 'Which method fits 5/6 and 5/9?',
    },
    question: {
      uz: 'Bu ikkita kasrni qanday taqqoslaymiz?',
      ru: 'Как сравним эти две дроби?',
      en: 'How do we compare these two fractions?',
    },
    options: [
      {
        uz: "Suratlar teng, shuning uchun maxrajlarga qaraymiz",
        ru: 'Числители равны, поэтому смотрим на знаменатели',
        en: 'The numerators match, so we look at the denominators',
      },
      {
        uz: "Maxrajlar teng, shuning uchun suratlarga qaraymiz",
        ru: 'Знаменатели равны, поэтому смотрим на числители',
        en: 'The denominators match, so we look at the numerators',
      },
      {
        uz: "Hech nimasi teng emas, yarim bilan solishtiramiz",
        ru: 'Ничего не совпадает, сравниваем с половиной',
        en: 'Nothing matches, so we compare with a half',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikkala kasrda ham surat besh. Maxrajlar olti va to'qqiz, demak to'qqizdan besh kichik bo'ladi.",
      ru: 'Верно. В обеих дробях числитель пять. Знаменатели шесть и девять, значит пять девятых меньше.',
      en: 'Correct. Both fractions have five as the numerator. The denominators are six and nine, so five ninths is the smaller one.',
    },
    wrong: [
      null,
      {
        uz: "Maxrajlar teng emas: biri olti, ikkinchisi to'qqiz. Teng bo'lgani surat.",
        ru: 'Знаменатели не равны: один шесть, другой девять. Совпадают числители.',
        en: 'The denominators are not equal: one is six, the other nine. It is the numerators that match.',
      },
      {
        uz: "Yarim bilan solishtirish ishlaydi, lekin bu yerda kerak emas. Suratlar teng bo'lgani uchun oson yo'l bor.",
        ru: 'Сравнение с половиной сработает, но здесь оно не нужно. Числители равны, значит есть более простой путь.',
        en: 'Comparing with a half would work, but it is not needed here. The numerators match, so there is an easier route.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Jasur ikkita o'lchovni taqqoslamoqchi: oltidan besh va to'qqizdan besh.",
          'Uchta usuldan qaysi biri bu yerda ishlaydi?',
          'Mosini tanlang.',
        ],
        ru: [
          'Джасур хочет сравнить два измерения: пять шестых и пять девятых.',
          'Какой из трёх способов работает здесь?',
          'Выбери подходящий.',
        ],
        en: [
          'Jasur wants to compare two readings: five sixths and five ninths.',
          'Which of the three methods works here?',
          'Choose the right one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s13: {
    eyebrow: { uz: 'Bit xulosasi', ru: 'Вывод Bit', en: "Bit's conclusion" },
    title: {
      uz: 'Bit sakkiz beshdan katta dedi',
      ru: 'Bit сказал, что восемь больше пяти',
      en: 'Bit said eight is more than five',
    },
    question: {
      uz: 'Bit qayerda adashdi?',
      ru: 'Где ошибся Bit?',
      en: 'Where did Bit go wrong?',
    },
    options: [
      {
        uz: "Maxrajlarni butun sonlar kabi taqqosladi, ulushlar kattaligini hisobga olmadi",
        ru: 'Он сравнил знаменатели как обычные числа и не учёл величину долей',
        en: 'He compared the denominators like whole numbers and ignored the size of the shares',
      },
      {
        uz: 'Suratlarni noto\'g\'ri sanadi',
        ru: 'Он неверно посчитал числители',
        en: 'He counted the numerators incorrectly',
      },
      {
        uz: 'Bu yerda yarim bilan solishtirish kerak edi',
        ru: 'Здесь нужно было сравнивать с половиной',
        en: 'He should have compared with a half here',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Sakkiz beshdan katta, lekin sakkizta bo'lakning bittasi beshta bo'lakning bittasidan kichik. Shuning uchun sakkizdan uch beshdan uchdan kichik.",
      ru: 'Верно. Восемь больше пяти, но одна часть из восьми меньше одной части из пяти. Поэтому три восьмых меньше трёх пятых.',
      en: 'Correct. Eight is more than five, but one part out of eight is smaller than one part out of five. So three eighths is less than three fifths.',
    },
    wrong: [
      null,
      {
        uz: "Suratlar to'g'ri sanalgan, ikkalasida ham uch. Xato maxrajlar bilan ishlashda.",
        ru: 'Числители посчитаны верно, в обеих дробях три. Ошибка в работе со знаменателями.',
        en: 'The numerators are counted right, three in both. The mistake is in handling the denominators.',
      },
      {
        uz: "Yarim ham javob beradi, lekin bu yerda soddaroq yo'l bor: suratlar teng, demak maxrajlarga qarash kifoya.",
        ru: 'Половина тоже даст ответ, но здесь есть путь проще: числители равны, значит достаточно посмотреть на знаменатели.',
        en: 'A half would also give the answer, but there is a simpler route here: the numerators match, so looking at the denominators is enough.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit ikkita o'lchovni taqqosladi: sakkizdan uch va beshdan uch.",
          "U shunday dedi. Sakkiz beshdan katta, demak sakkizdan uch ham katta.",
          'Bit qayerda adashganini toping.',
        ],
        ru: [
          'Bit сравнил два измерения: три восьмых и три пятых.',
          'Он сказал так. Восемь больше пяти, значит и три восьмых больше.',
          'Найди, где Bit ошибся.',
        ],
        en: [
          'Bit compared two readings: three eighths and three fifths.',
          'He said this. Eight is more than five, so three eighths must be bigger.',
          'Find where Bit went wrong.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s14: {
    eyebrow: { uz: 'Tunga tayyorgarlik', ru: 'Подготовка к ночи', en: 'Getting ready for the night' },
    title: {
      uz: 'Qaysi tumanni birinchi quvvatlaymiz?',
      ru: 'Какой район заряжаем первым?',
      en: 'Which district do we charge first?',
    },
    question: {
      uz: "Bir tumanda 4/6, boshqasida 4/9 quvvat qoldi. Qaysi biri birinchi navbatda?",
      ru: 'В одном районе осталось 4/6 заряда, в другом 4/9. Какой в первую очередь?',
      en: 'One district has 4/6 of its charge left, the other 4/9. Which comes first?',
    },
    options: [
      { uz: '4/9 qolgan tuman', ru: 'Район с 4/9', en: 'The district with 4/9' },
      { uz: '4/6 qolgan tuman', ru: 'Район с 4/6', en: 'The district with 4/6' },
      { uz: 'Ikkalasi bir vaqtda', ru: 'Оба одновременно', en: 'Both at the same time' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Suratlar teng, maxraji katta bo'lgani kichik. To'qqizdan to'rt oltidan to'rtdan kichik, demak o'sha tumanda quvvat kamroq va u birinchi navbatda turadi.",
      ru: 'Верно. Числители равны, а с большим знаменателем дробь меньше. Четыре девятых меньше четырёх шестых, значит в том районе заряда меньше и он идёт первым.',
      en: 'Correct. The numerators match, and the bigger denominator gives the smaller fraction. Four ninths is less than four sixths, so that district has less charge and comes first.',
    },
    wrong: [
      null,
      {
        uz: "Oltidan to'rt kattaroq qism, ya'ni o'sha tumanda quvvat koproq. Birinchi navbat kamroq qolganga beriladi.",
        ru: 'Четыре шестых это большая часть, значит в том районе заряда больше. Первая очередь у того, где заряда меньше.',
        en: 'Four sixths is the bigger share, so that district has more charge. The first turn goes to the one with less.',
      },
      {
        uz: "Ular teng emas. Suratlar bir xil bo'lsa ham, oltiga bo'lingan ulush to'qqizga bo'lingandan katta.",
        ru: 'Они не равны. Хотя числители одинаковые, доля при делении на шесть больше, чем при делении на девять.',
        en: 'They are not equal. Even with the same numerator, a share out of six is bigger than a share out of nine.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Kun tugadi, uzel tunga tayyorgarlik ko\'ryapti.',
          "Bir tumanda akkumulyatorning oltidan to'rt qismi, boshqasida to'qqizdan to'rt qismi qoldi.",
          'Qaysi tumanni birinchi navbatda quvvatlash kerakligini toping.',
        ],
        ru: [
          'День закончился, узел готовится к ночи.',
          'В одном районе осталось четыре шестых заряда аккумулятора, в другом четыре девятых.',
          'Определи, какой район надо заряжать в первую очередь.',
        ],
        en: [
          'The day is over and the node is getting ready for the night.',
          'One district has four sixths of its battery left, the other four ninths.',
          'Work out which district must be charged first.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s15: {
    eyebrow: { uz: 'Missiya mukofoti', ru: 'Награда за миссию', en: 'Mission award' },
    stageLabel: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: 'Teng suratli kasrlarni qanday taqqoslashni ayting va unvonni oling.',
      ru: 'Скажи, как сравнивают дроби с равными числителями, и получи звание.',
      en: 'Say how fractions with equal numerators are compared and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: 'Suratlar teng bo\'lsa, qaysi kasr kichik?',
      ru: 'Если числители равны, какая дробь меньше?',
      en: 'If the numerators are equal, which fraction is smaller?',
    },
    reflectionStart: {
      uz: 'Suratlar teng bo\'lsa, kichik kasr — bu…',
      ru: 'При равных числителях меньшая дробь это…',
      en: 'With equal numerators the smaller fraction is…',
    },
    reflectionOptions: [
      {
        uz: "maxraji katta bo'lgani",
        ru: 'та, у которой знаменатель больше',
        en: 'the one with the bigger denominator',
      },
      {
        uz: "maxraji kichik bo'lgani",
        ru: 'та, у которой знаменатель меньше',
        en: 'the one with the smaller denominator',
      },
      {
        uz: "har doim birinchi yozilgani",
        ru: 'та, что записана первой',
        en: 'the one written first',
      },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Butunni koproq bo'lakka bo'lsak, har bir bo'lak kichrayadi.",
      ru: 'Верно. Если разделить целое на больше частей, каждая часть станет меньше.',
      en: 'Correct. Dividing the whole into more parts makes every part smaller.',
    },
    reflectionWrong: {
      uz: "Maxraji kichik bo'lgan kasr kattaroq bo'ladi, yozilish tartibi esa hech narsa hal qilmaydi. Ulush kattaligi maxrajga bog'liq.",
      ru: 'Дробь с меньшим знаменателем больше, а порядок записи ничего не решает. Величина доли зависит от знаменателя.',
      en: 'The fraction with the smaller denominator is the bigger one, and the writing order decides nothing. The size of a share depends on the denominator.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Energiya uzeli boshlig\'i', ru: 'Начальник энергоузла', en: 'Head of the energy node' } },
      { min: 3, title: { uz: 'Ulush nazoratchisi', ru: 'Контролёр долей', en: 'Share controller' } },
      { min: 0, title: { uz: 'Uzel kuzatuvchisi', ru: 'Наблюдатель узла', en: 'Node observer' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "Teng maxrajda surati katta bo'lgan kasr katta.",
        ru: 'При равных знаменателях больше дробь с большим числителем.',
        en: 'With equal denominators the fraction with the bigger numerator is bigger.',
      },
      {
        uz: "Teng suratda maxraji katta bo'lgan kasr kichik.",
        ru: 'При равных числителях меньше дробь с большим знаменателем.',
        en: 'With equal numerators the fraction with the bigger denominator is smaller.',
      },
      {
        uz: "Hech nimasi teng bo'lmasa, ikkalasini yarim bilan solishtiramiz.",
        ru: 'Если ничего не совпадает, сравниваем обе дроби с половиной.',
        en: 'If nothing matches, compare both fractions with a half.',
      },
      {
        uz: "Taqqoslash faqat bitta butunning ulushlari uchun ma'noli.",
        ru: 'Сравнение имеет смысл только для долей одного целого.',
        en: 'Comparison only makes sense for shares of one and the same whole.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: 'Ulushlarni birlashtirish: bir xil maxrajli kasrlarni qo\'shish.',
      ru: 'Объединить доли: сложение дробей с одинаковым знаменателем.',
      en: 'Joining shares: adding fractions with the same denominator.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Energiya uzeli endi tumanlarni adolatli navbatga qo'yadi.",
          "Bugun siz uchta taqqoslash usulini va ularni qachon ishlatishni o'rgandingiz.",
          'Unvonni ochish uchun bitta savol qoldi.',
        ],
        ru: [
          'Миссия выполнена. Энергетический узел теперь ставит районы в честную очередь.',
          'Сегодня ты умеешь применять три способа сравнения и знаешь, когда какой нужен.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The energy node now queues the districts fairly.',
          'Today you can use three comparison methods and you know when each one fits.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

// Akkumulyator: teng bo'laklarga bo'lingan korpus va uchidagi kontakt.
const Battery = ({ x, y, w, h, parts, charged, tone = T.lime }) => (
  <g>
    <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="10" fill="#EDF2F0" stroke="#B7C6C2" strokeWidth="2.4" />
    <rect x={x + w + 8} y={y + h / 2 - 11} width="12" height="22" rx="4" fill="#B7C6C2" />
    {Array.from({ length: parts }, (_, index) => (
      <rect
        key={index}
        x={x + (index * w) / parts}
        y={y}
        width={w / parts}
        height={h}
        fill={index < charged ? 'rgba(149,201,61,.58)' : '#FFFFFF'}
        stroke={index < charged ? tone : 'rgba(23,59,82,.20)'}
        strokeWidth={index < charged ? 2.4 : 1.5}
      />
    ))}
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={T.ink} strokeWidth="2.6" />
  </g>
);

// s0, s14 — energiya uzeli sahnasi.
const EnergyScene = ({ mode = 'hook', solved = false }) => {
  const t = useT();
  const rows = mode === 'hook'
    ? [{ parts: 5, charged: 3, label: '1' }, { parts: 7, charged: 3, label: '2' }]
    : [{ parts: 6, charged: 4, label: '1' }, { parts: 9, charged: 4, label: '2' }];
  return (
    <FitSvg viewBox="0 0 520 464">
      <defs>
        <linearGradient id="d19-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9F1EE" />
          <stop offset="1" stopColor="#F8FBF9" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="464" rx="22" fill="url(#d19-wall)" />

      {/* elektr shinasi */}
      <path d="M40 62 H480" stroke="#C4D3CE" strokeWidth="10" strokeLinecap="round" />
      {[120, 260, 400].map((cx) => (
        <g key={cx}>
          <path d={`M${cx} 62 V104`} stroke="#C4D3CE" strokeWidth="7" />
          <circle cx={cx} cy="62" r="11" fill="#FFFFFF" stroke="#9FB3AD" strokeWidth="3" />
        </g>
      ))}

      <text x="260" y="36" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
        {mode === 'hook'
          ? t({ uz: "Akkumulyatorlar bir xil kattalikda", ru: 'Аккумуляторы одного размера', en: 'The batteries are the same size' })
          : t({ uz: 'Tunga qolgan quvvat', ru: 'Заряд, оставшийся к ночи', en: 'The charge left for the night' })}
      </text>

      {rows.map((row, index) => (
        <g key={row.label}>
          <text x="52" y={168 + index * 150} textAnchor="middle" fill={index === 0 ? T.cyan : T.accent} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {row.label}
          </text>
          <Battery x={86} y={132 + index * 150} w={324} h={64} parts={row.parts} charged={row.charged} />
          <FractionGlyph
            num={row.charged}
            den={row.parts}
            x={464}
            y={164 + index * 150}
            size={24}
            tone={index === 0 ? T.cyan : T.accent}
          />
          <text x="248" y={222 + index * 150} textAnchor="middle" fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({
              uz: `${row.parts} ta teng bo'lak`,
              ru: `${row.parts} равных частей`,
              en: `${row.parts} equal parts`,
            })}
          </text>
        </g>
      ))}

      {mode === 'final' && (
        <g opacity={solved ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
          <rect x="104" y="392" width="312" height="52" rx="15" fill="#FFFFFF" stroke={T.success} strokeWidth="2.4" />
          <text x="260" y="425" textAnchor="middle" fill={T.success} fontSize="17" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Birinchi navbat: 2-tuman', ru: 'Первая очередь: район 2', en: 'First in line: district 2' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s1 — teng maxraj.
const SameDenFigure = ({ frame = 0 }) => (
  <FitSvg viewBox="0 0 520 200">
    {[{ num: 4, on: frame >= 2 }, { num: 6, on: frame >= 3 }].map((row, index) => (
      <g key={row.num} opacity={row.on ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={row.num} x={46} y={26 + index * 84} width={356} height={58} />
        <FractionGlyph num={row.num} den={8} x={456} y={56 + index * 84} size={24} tone={T.cyan} />
      </g>
    ))}
    <g opacity={frame >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <text x="260" y="192" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        4/8 &lt; 6/8
      </text>
    </g>
  </FitSvg>
);

// s3 — teng surat.
const SameNumFigure = ({ frame = 0 }) => (
  <FitSvg viewBox="0 0 520 210">
    {[2, 4, 8].map((den, index) => (
      <g key={den} opacity={frame >= index + 2 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={den} shaded={1} x={46} y={20 + index * 60} width={356} height={44} />
        <FractionGlyph num={1} den={den} x={456} y={44 + index * 60} size={22} tone={T.cyan} />
      </g>
    ))}
    <g opacity={frame >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <text x="224" y="202" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        1/8 &lt; 1/4 &lt; 1/2
      </text>
    </g>
  </FitSvg>
);

// s5, s6 — teng kasrlar.
const EquivFigure = ({ frame = 4, solved = false }) => (
  <FitSvg viewBox="0 0 520 210">
    {[{ den: 2, num: 1 }, { den: 4, num: 2 }, { den: 8, num: 4 }].map((row, index) => (
      <g key={row.den} opacity={frame >= index + 2 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={row.den} shaded={row.num} x={46} y={20 + index * 60} width={356} height={44} />
        <FractionGlyph num={row.num} den={row.den} x={456} y={44 + index * 60} size={22} tone={solved ? T.success : T.cyan} />
      </g>
    ))}
    <g opacity={frame >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <text x="224" y="202" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        1/2 = 2/4 = 4/8
      </text>
    </g>
  </FitSvg>
);

// s7 — yarim tayanch.
const HalfFigure = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 210">
      <g opacity={frame >= 2 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={4} x={46} y={20} width={356} height={44} />
        <FractionGlyph num={4} den={8} x={456} y={44} size={22} tone={T.navy} />
        <text x="118" y="82" textAnchor="middle" fill={T.navy} fontSize="12.5" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'aynan yarim', ru: 'ровно половина', en: 'exactly a half' })}
        </text>
      </g>
      <g opacity={frame >= 3 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={3} x={46} y={94} width={356} height={44} />
        <FractionGlyph num={3} den={8} x={456} y={118} size={22} tone={T.cyan} />
      </g>
      <g opacity={frame >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={5} x={46} y={152} width={356} height={44} />
        <FractionGlyph num={5} den={8} x={456} y={176} size={22} tone={T.accent} />
      </g>
      <line x1={46 + 356 / 2} y1="16" x2={46 + 356 / 2} y2="200" stroke={T.navy} strokeWidth="2.2" strokeDasharray="6 5" />
    </FitSvg>
  );
};

// s4, s10 — belgi qo'yish.
const SignFigure = ({ left, right, solved = false, sign }) => (
  <FitSvg viewBox="0 0 520 210">
    <FractionBar parts={left.den} shaded={left.num} x={46} y={26} width={330} height={52} />
    <FractionGlyph num={left.num} den={left.den} x={432} y={54} size={24} tone={T.cyan} />
    <FractionBar parts={right.den} shaded={right.num} x={46} y={112} width={330} height={52} />
    <FractionGlyph num={right.num} den={right.den} x={432} y={140} size={24} tone={T.accent} />
    <g opacity={solved ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <circle cx={478} cy={97} r="22" fill={solved ? T.successSoft : '#FFFFFF'} stroke={solved ? T.success : T.ink3} strokeWidth="2.4" />
      <text x={478} y={106} textAnchor="middle" fill={solved ? T.success : T.ink3} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {solved ? sign : '?'}
      </text>
    </g>
  </FitSvg>
);

// s2, s8 — tizish uchun tasmalar.
const OrderFigure = ({ cards, order, step }) => (
  <FitSvg viewBox="0 0 520 210">
    {order.map((cardIndex, slot) => {
      const card = cards[cardIndex];
      const shown = slot < step;
      return (
        <g key={slot} opacity={shown ? 1 : 0.22} style={{ transition: 'opacity .4s' }}>
          <FractionBar parts={card.den} shaded={card.num} x={46} y={22 + slot * 62} width={340} height={46} />
          <FractionGlyph num={card.num} den={card.den} x={440} y={46 + slot * 62} size={22} tone={T.success} />
        </g>
      );
    })}
    <path d="M22 22 L22 190" stroke={T.ink3} strokeWidth="2" />
    <path d="M22 190 l-5 -10 h10 z" fill={T.ink3} />
  </FitSvg>
);

// s13 — Bit ning xulosasi.
const BitCompareFigure = ({ solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 210">
      <FractionBar parts={8} shaded={3} x={46} y={26} width={330} height={52} />
      <FractionGlyph num={3} den={8} x={430} y={54} size={24} tone={T.cyan} />
      <FractionBar parts={5} shaded={3} x={46} y={104} width={330} height={52} />
      <FractionGlyph num={3} den={5} x={430} y={132} size={24} tone={T.cyan} />
      <g>
        <rect x={462} y={26} width={44} height={52} rx="12" fill="#FFF6F3" stroke={T.accent} strokeWidth="2.2" />
        <text x={484} y={60} textAnchor="middle" fill={T.accent} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          &gt;
        </text>
      </g>
      <g opacity={solved ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
        <rect x={462} y={104} width={44} height={52} rx="12" fill={T.successSoft} stroke={T.success} strokeWidth="2.2" />
        <text x={484} y={138} textAnchor="middle" fill={T.success} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          &lt;
        </text>
      </g>
      <text x="212" y="196" textAnchor="middle" fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
        {solved
          ? t({ uz: "Yuqoridagi bo'yalgan qism qisqaroq", ru: 'Верхняя закрашенная часть короче', en: 'The upper shaded part is shorter' })
          : t({ uz: 'Bit shunday belgi qo\'ydi', ru: 'Такой знак поставил Bit', en: 'That is the sign Bit placed' })}
      </text>
    </FitSvg>
  );
};

// s11 — qoida kartasi.
const RulePanel = ({ frame = 0 }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: 'Teng maxraj', ru: 'Равные знаменатели', en: 'Equal denominators' }),
          body: t({ uz: 'Surati katta bo\'lgan kasr katta', ru: 'Больше дробь с большим числителем', en: 'The bigger numerator wins' }),
          formula: '2/9 < 5/9',
        },
        {
          tone: T.navy,
          head: t({ uz: 'Teng surat', ru: 'Равные числители', en: 'Equal numerators' }),
          body: t({ uz: 'Maxraji katta bo\'lgan kasr kichik', ru: 'Меньше дробь с большим знаменателем', en: 'The bigger denominator loses' }),
          formula: '3/7 < 3/5',
        },
        {
          tone: T.accent,
          head: t({ uz: 'Yarim tayanch', ru: 'Опора на половину', en: 'The half benchmark' }),
          body: t({ uz: 'Ikkalasini yarim bilan solishtiramiz', ru: 'Сравниваем обе с половиной', en: 'Compare both with a half' }),
          formula: '3/8 < 1/2',
        },
        {
          tone: T.success,
          head: t({ uz: 'Bitta butun', ru: 'Одно целое', en: 'One whole' }),
          body: t({ uz: 'Butunlar har xil bo\'lsa, taqqoslash mumkin emas', ru: 'Если целые разные, сравнивать нельзя', en: 'Different wholes cannot be compared' }),
          formula: '=',
        },
      ]}
    />
  );
};

// s9, s12 — usul tanlash yo'riqnomasi.
const MethodPanel = ({ solved = false }) => {
  const t = useT();
  return (
    <StepList
      steps={[
        t({ uz: 'Maxrajlar tengmi deb qarayman', ru: 'Смотрю, равны ли знаменатели', en: 'I check whether the denominators are equal' }),
        t({ uz: 'Teng bo\'lsa, suratlarni taqqoslayman', ru: 'Если равны, сравниваю числители', en: 'If they are, I compare the numerators' }),
        t({ uz: 'Suratlar teng bo\'lsa, maxrajlarga qarayman', ru: 'Если равны числители, смотрю на знаменатели', en: 'If the numerators match, I look at the denominators' }),
        t({ uz: 'Hech nimasi teng bo\'lmasa, yarim bilan solishtiraman', ru: 'Если ничего не совпадает, сравниваю с половиной', en: 'If nothing matches, I compare with a half' }),
      ]}
      showHint={solved}
      hint={t({
        uz: 'Maxraji katta bo\'lgan kasr kichik — bu qoidani teskari qo\'llash eng ko\'p uchraydigan xato.',
        ru: 'Дробь с большим знаменателем меньше — применить это правило наоборот самая частая ошибка.',
        en: 'A bigger denominator means a smaller fraction — applying this backwards is the commonest slip.',
      })}
    />
  );
};

// s12 — usul tanlagich: uchta yo'nalish, faqat bittasi yonadi.
//
// Ilgari bu ekranda matn ro'yxati turardi va u javobni oldindan aytib qo'yardi.
// Endi uzelning tarmoqlanish chizmasi bor: yuqorida ikkita kasr, pastda uchta
// yo'l. Javobdan keyin mos yo'l yonadi, qolganlari so'nadi.
const RouterFigure = ({ solved = false }) => {
  const t = useT();
  const lanes = [
    {
      cx: 92,
      tone: T.cyan,
      cond: { uz: 'maxrajlar teng', ru: 'знаменатели равны', en: 'denominators match' },
      act: { uz: 'suratlarga qara', ru: 'смотри числители', en: 'look at numerators' },
    },
    {
      cx: 260,
      tone: T.accent,
      cond: { uz: 'suratlar teng', ru: 'числители равны', en: 'numerators match' },
      act: { uz: 'maxrajlarga qara', ru: 'смотри знаменатели', en: 'look at denominators' },
    },
    {
      cx: 428,
      tone: T.navy,
      cond: { uz: 'hech nimasi teng emas', ru: 'ничего не совпадает', en: 'nothing matches' },
      act: { uz: 'yarim bilan solish', ru: 'сравни с половиной', en: 'compare with a half' },
    },
  ];
  return (
    <FitSvg viewBox="0 0 520 210">
      {/* yuqoridagi juftlik */}
      <rect x="196" y="8" width="128" height="46" rx="13" fill="#FFFFFF" stroke={T.ink3} strokeWidth="1.8" />
      <FractionGlyph num={5} den={6} x={230} y={31} size={18} tone={T.ink} />
      <FractionGlyph num={5} den={9} x={290} y={31} size={18} tone={T.ink} />

      {lanes.map((lane, index) => {
        const live = solved && index === 1;
        const dim = solved && index !== 1;
        const stroke = live ? lane.tone : dim ? 'rgba(23,59,82,.14)' : 'rgba(23,59,82,.28)';
        return (
          <g key={lane.cx} opacity={dim ? 0.45 : 1} style={{ transition: 'opacity .35s' }}>
            <path
              d={`M260 54 C260 78 ${lane.cx} 74 ${lane.cx} 94`}
              fill="none"
              stroke={stroke}
              strokeWidth={live ? 3 : 1.8}
              strokeDasharray={live ? '' : '6 5'}
            />
            <circle cx={lane.cx} cy={98} r={live ? 6 : 4.5} fill={live ? lane.tone : 'rgba(23,59,82,.3)'} />
            <rect
              x={lane.cx - 82}
              y={112}
              width={164}
              height={34}
              rx="10"
              fill={live ? '#FFFFFF' : 'rgba(255,255,255,.65)'}
              stroke={live ? lane.tone : 'rgba(23,59,82,.18)'}
              strokeWidth={live ? 2.4 : 1.5}
            />
            <text
              x={lane.cx}
              y={134}
              textAnchor="middle"
              fill={live ? lane.tone : T.ink3}
              fontSize="11.5"
              fontWeight="800"
              fontFamily="Manrope, sans-serif"
            >
              {t(lane.cond)}
            </text>
            <path d={`M${lane.cx} 146 v10`} stroke={stroke} strokeWidth={live ? 2.6 : 1.6} />
            <path d={`M${lane.cx} 162 l-5 -8 h10 z`} fill={live ? lane.tone : 'rgba(23,59,82,.3)'} />
            <rect
              x={lane.cx - 82}
              y={164}
              width={164}
              height={36}
              rx="11"
              fill={live ? lane.tone : 'rgba(23,59,82,.05)'}
              opacity={live ? 0.16 : 1}
            />
            <text
              x={lane.cx}
              y={188}
              textAnchor="middle"
              fill={live ? lane.tone : T.ink3}
              fontSize="12"
              fontWeight="800"
              fontFamily="Manrope, sans-serif"
            >
              {t(lane.act)}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={() => <EnergyScene />} />
);
const Screen1 = (props) => (
  <RevealScreen {...props} ratio="520 / 200" figure={({ frame }) => <SameDenFigure frame={frame} />} />
);
const Screen2 = (props) => (
  <OrderStrip
    {...props}
    ratio="520 / 210"
    figure={({ step }) => <OrderFigure cards={CONTENT.s2.cards} order={CONTENT.s2.order} step={step} />}
  />
);
const Screen3 = (props) => (
  <RevealScreen {...props} ratio="520 / 210" figure={({ frame }) => <SameNumFigure frame={frame} />} />
);
const Screen4 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="520 / 210"
    figure={({ solved }) => (
      <SignFigure left={{ num: 3, den: 7 }} right={{ num: 3, den: 5 }} solved={solved} sign="<" />
    )}
  />
);
const Screen5 = (props) => (
  <RevealScreen {...props} ratio="520 / 210" figure={({ frame }) => <EquivFigure frame={frame} />} />
);
const Screen6 = (props) => (
  <SlotScreen
    {...props}
    ratio="520 / 210"
    figure={({ solved }) => <EquivFigure frame={solved ? 4 : 2} solved={solved} />}
  />
);
const Screen7 = (props) => (
  <RevealScreen {...props} ratio="520 / 210" figure={({ frame }) => <HalfFigure frame={frame} />} />
);
const Screen8 = (props) => (
  <OrderStrip
    {...props}
    ratio="520 / 210"
    figure={({ step }) => <OrderFigure cards={CONTENT.s8.cards} order={CONTENT.s8.order} step={step} />}
  />
);
const Screen9 = (props) => (
  <RevealScreen {...props} plain figure={() => <MethodPanel />} />
);
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="520 / 210"
    figure={({ solved }) => (
      <SignFigure left={{ num: 2, den: 3 }} right={{ num: 2, den: 11 }} solved={solved} sign=">" />
    )}
  />
);
const Screen11 = (props) => (
  <RevealScreen {...props} plain figure={({ frame }) => <RulePanel frame={frame + 1} />} />
);
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} ratio="520 / 210" figure={({ solved }) => <RouterFigure solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} stack ratio="520 / 210" figure={({ solved }) => <BitCompareFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <EnergyScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars19(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES}
    />
  );
}
