// ============================================================================
// 4-SINF · Dars 18 · Kasr tushunchasi
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 136-137 va
// 144-betlar.
//   136-bet: to'rtburchaklar 15, 6, 12 teng qismga bo'lingan; "Chiziq ostiga
//            predmetni necha teng qismga bo'lganini ko'rsatuvchi son yoziladi,
//            uni maxraj deyiladi. Chiziq ustidagi son shunday qismlardan
//            nechtasi olinganini ko'rsatadi, uni surat deyiladi";
//   137-bet: 2/15 va 3/15 bo'yalgan hol; "surat va maxraji bir xil bo'lgan
//            har qanday kasr birga teng" — 15/15 = 1, 6/6 = 1, 12/12 = 1;
//   144-bet: sonlar nurida A nuqta bilan belgilangan kasrni yozish.
//
// Syujet: Lumo City taqsimlash markazi, suv uzeli (SYUJET_4SINF.md, 3-blok).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Yangi mexanika: FractionEntry — bola avval maxrajni, keyin suratni o'zi
// qo'yadi. Tartib darslikdagi ta'rif tartibi bilan bir xil.
// ============================================================================
import {
  ChoiceScreen, FitSvg, FractionBar, FractionCircle, FractionEntry,
  FractionGlyph, FractionRay, KIT_STYLES, RevealScreen, RuleRows, SlotScreen,
  SummaryScreen, T, TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'fraction-idea-4-18-v2',
  slug: 'dars18-kasr-tushunchasi',
  lessonTitle: {
    uz: '18-dars. Kasr tushunchasi',
    ru: 'Урок 18. Понятие дроби',
    en: 'Lesson 18. The idea of a fraction',
  },
  skillTags: ['fraction', 'numerator', 'denominator', 'equal_parts', 'number_ray'],
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

const DEN_STEP = {
  uz: 'Chiziq ostiga: nechta teng qism bor?',
  ru: 'Под черту: на сколько равных частей разделили?',
  en: 'Below the line: how many equal parts are there?',
};
const NUM_STEP = {
  uz: 'Chiziq ustiga: nechtasi olingan?',
  ru: 'Над чертой: сколько частей взяли?',
  en: 'Above the line: how many parts were taken?',
};

const CONTENT = {
  // -------------------------------------------------------------------------
  s0: {
    eyebrow: { uz: 'Suv uzeli', ru: 'Водный узел', en: 'The water node' },
    title: {
      uz: 'Ikkita bak, ikkalasida bitta bo\'lak',
      ru: 'Два бака, в каждом по одной части',
      en: 'Two tanks, one part in each',
    },
    question: {
      uz: "Qaysi bakda bo'yalgan bo'lak butunning oltidan biri?",
      ru: 'В каком баке закрашенная часть равна одной шестой целого?',
      en: 'In which tank is the shaded part one sixth of the whole?',
    },
    options: [
      { uz: 'Birinchi bakda', ru: 'В первом баке', en: 'In the first tank' },
      { uz: 'Ikkinchi bakda', ru: 'Во втором баке', en: 'In the second tank' },
      { uz: 'Ikkalasida ham', ru: 'В обоих баках', en: 'In both tanks' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Birinchi bakda oltita bo'lak ham teng, shuning uchun bittasi rostdan oltidan bir. Ikkinchi bakda bo'laklar har xil, u yerda ulush haqida gapirib bo'lmaydi.",
      ru: 'Верно. В первом баке все шесть частей равны, поэтому одна из них действительно одна шестая. Во втором баке части разные, там о доле говорить нельзя.',
      en: 'Correct. In the first tank all six parts are equal, so one of them really is one sixth. In the second tank the parts differ, so no share can be named at all.',
    },
    wrong: [
      null,
      {
        uz: "Ikkinchi bakda ham oltita bo'lak bor, lekin ular teng emas. Katta bo'lak bilan kichik bo'lakni bitta nom bilan atab bo'lmaydi.",
        ru: 'Во втором баке тоже шесть частей, но они не равны. Большую и маленькую часть нельзя назвать одним именем.',
        en: 'The second tank also has six parts, but they are not equal. A big part and a small part cannot share one name.',
      },
      {
        uz: "Bo'laklar soni bir xil, ammo bu yetarli emas. Ulush deyish uchun bo'laklar teng bo'lishi shart.",
        ru: 'Число частей одинаковое, но этого мало. Чтобы говорить о доле, части обязаны быть равными.',
        en: 'The number of parts is the same, but that is not enough. To speak of a share the parts must be equal.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          'Salom! Biz Lumo City taqsimlash markazining suv uzelidamiz.',
          "Bu yerda suv shahar tumanlari o'rtasida bo'linadi. Ikkita bak keldi, ikkalasi ham oltita bo'lakka bo'lingan.",
          "Har ikkalasida bitta bo'lak suvga to'ldirilgan. Lekin bakning biri boshqacha bo'lingan.",
          "Qaysi bakda bo'yalgan bo'lak rostdan butunning oltidan biri? Diqqat bilan qarang.",
        ],
        ru: [
          'Привет! Мы на водном узле распределительного центра Lumo City.',
          'Здесь воду делят между районами города. Пришли два бака, и каждый разделён на шесть частей.',
          'В каждом баке водой заполнена одна часть. Но один из баков разделён иначе.',
          'В каком баке закрашенная часть действительно равна одной шестой целого? Посмотри внимательно.',
        ],
        en: [
          'Hello! We are at the water node of the Lumo City distribution centre.',
          'Water is shared between the city districts here. Two tanks have arrived, and each is split into six parts.',
          'One part is filled with water in each tank. But one of the tanks is split differently.',
          'In which tank is the shaded part really one sixth of the whole? Look carefully.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s1: {
    eyebrow: { uz: 'Kasr yozuvi', ru: 'Запись дроби', en: 'Writing a fraction' },
    title: {
      uz: 'Ikkita son va ular orasidagi chiziq',
      ru: 'Два числа и черта между ними',
      en: 'Two numbers and a line between them',
    },
    lead: {
      uz: 'Chiziq ostidagi son maxraj, chiziq ustidagi son surat deyiladi.',
      ru: 'Число под чертой называют знаменателем, число над чертой — числителем.',
      en: 'The number below the line is the denominator, the number above it is the numerator.',
    },
    note: {
      uz: 'Maxraj ulushning kattaligini, surat esa shunday ulushlar sonini aytadi.',
      ru: 'Знаменатель говорит о величине доли, а числитель — сколько таких долей взяли.',
      en: 'The denominator names the size of the share; the numerator says how many shares were taken.',
    },
    audio: {
      intro: {
        uz: [
          "Bunday bo'laklarni yozish uchun maxsus sonlar bor. Ular kasrlar deyiladi.",
          "Kasrni yozish uchun ikkita raqam va ular orasidagi chiziq ishlatiladi.",
          "Chiziq ostiga predmetni necha teng qismga bo'lganimizni yozamiz. Bu son maxraj deyiladi.",
          "Chiziq ustiga shunday qismlardan nechtasini olganimizni yozamiz. Bu son surat deyiladi. Rasmda oltidan bir yozilgan.",
        ],
        ru: [
          'Для записи таких частей есть особые числа. Их называют дробями.',
          'Чтобы записать дробь, используют две цифры и черту между ними.',
          'Под чертой пишут, на сколько равных частей разделили предмет. Это число называют знаменателем.',
          'Над чертой пишут, сколько таких частей взяли. Это число называют числителем. На рисунке записана одна шестая.',
        ],
        en: [
          'There are special numbers for writing such parts. They are called fractions.',
          'To write a fraction we use two digits and a line between them.',
          'Below the line we write into how many equal parts the object was divided. That number is the denominator.',
          'Above the line we write how many such parts were taken. That number is the numerator. The drawing shows one sixth.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s2: {
    eyebrow: { uz: 'Birinchi yozuv', ru: 'Первая запись', en: 'The first record' },
    title: {
      uz: 'Bo\'yalgan qismni kasr bilan yozing',
      ru: 'Запиши закрашенную часть дробью',
      en: 'Write the shaded part as a fraction',
    },
    question: {
      uz: 'Avval chiziq ostidagi sonni, keyin ustidagini tanlang.',
      ru: 'Сначала выбери число под чертой, потом над чертой.',
      en: 'Choose the number below the line first, then the one above it.',
    },
    den: 15,
    num: 2,
    denOptions: [13, 15, 30],
    numOptions: [2, 13, 15],
    denStep: DEN_STEP,
    numStep: NUM_STEP,
    denDone: {
      uz: "To'g'ri, tasma o'n beshta teng katakka bo'lingan. Endi nechtasi bo'yalganini tanlang.",
      ru: 'Верно, полоса разделена на пятнадцать равных клеток. Теперь выбери, сколько из них закрашено.',
      en: 'Correct, the strip is divided into fifteen equal cells. Now choose how many of them are shaded.',
    },
    wrongDen: {
      uz: "Maxrajga hamma teng kataklar soni yoziladi, faqat bo'yalmaganlari emas. Boshidan oxirigacha sanang.",
      ru: 'В знаменатель пишут число всех равных клеток, а не только незакрашенных. Посчитай от начала до конца.',
      en: 'The denominator counts every equal cell, not only the unshaded ones. Count from the start to the end.',
    },
    wrongNum: {
      uz: "Suratga bo'yalgan kataklar soni yoziladi. Rasmda ular ikkita.",
      ru: 'В числитель пишут число закрашенных клеток. На рисунке их две.',
      en: 'The numerator counts the shaded cells. There are two of them in the drawing.',
    },
    correctText: {
      uz: "To'g'ri. O'n beshdan ikki. Tasma o'n beshta teng bo'lakka bo'lingan va shundan ikkitasi olingan.",
      ru: 'Верно. Две пятнадцатых. Полосу разделили на пятнадцать равных частей и взяли две из них.',
      en: 'Correct. Two fifteenths. The strip was divided into fifteen equal parts and two of them were taken.',
    },
    audio: {
      intro: {
        uz: [
          "Suv uzelining birinchi tasmasi o'n beshta teng katakka bo'lingan.",
          "Ulardan ikkitasi to'ldirilgan.",
          'Avval chiziq ostiga qanday son turishini tanlang, keyin chiziq ustidagisini.',
        ],
        ru: [
          'Первая полоса водного узла разделена на пятнадцать равных клеток.',
          'Две из них заполнены.',
          'Сначала выбери, какое число стоит под чертой, потом над чертой.',
        ],
        en: [
          'The first strip of the water node is divided into fifteen equal cells.',
          'Two of them are filled.',
          'First choose the number below the line, then the one above it.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s3: {
    eyebrow: { uz: 'Surat sanaydi', ru: 'Числитель считает', en: 'The numerator counts' },
    title: {
      uz: 'Ulush kattaligi o\'zgarmaydi, soni o\'zgaradi',
      ru: 'Величина доли не меняется, меняется их количество',
      en: 'The size of a share stays, only how many changes',
    },
    lead: {
      uz: 'Maxraj olti bo\'lib qolaveradi, surat esa birdan uchgacha o\'sadi.',
      ru: 'Знаменатель остаётся шестью, а числитель растёт от одного до трёх.',
      en: 'The denominator stays six while the numerator grows from one to three.',
    },
    note: {
      uz: "Bir xil maxrajli kasrlarda ulushlar bir xil kattalikda bo'ladi.",
      ru: 'У дробей с одинаковым знаменателем доли одинаковой величины.',
      en: 'Fractions with the same denominator have shares of the same size.',
    },
    audio: {
      intro: {
        uz: [
          "Bitta bakni oltita teng bo'lakka bo'ldik. Har bir bo'lak oltidan bir.",
          "Bitta bo'lakni to'ldirsak, oltidan bir chiqadi.",
          "Ikkita bo'lakni to'ldirsak, oltidan ikki bo'ladi. Bo'lak kattaligi o'zgarmadi, faqat soni ko'paydi.",
          "Uchta bo'lakda esa oltidan uch. Maxraj hamma vaqt olti bo'lib turibdi.",
        ],
        ru: [
          'Один бак разделили на шесть равных частей. Каждая часть это одна шестая.',
          'Если заполнить одну часть, получится одна шестая.',
          'Если заполнить две части, будет две шестых. Величина части не изменилась, изменилось их количество.',
          'А в трёх частях будет три шестых. Знаменатель всё время остаётся шестью.',
        ],
        en: [
          'One tank was divided into six equal parts. Each part is one sixth.',
          'Filling one part gives one sixth.',
          'Filling two parts gives two sixths. The size of a part did not change, only how many there are.',
          'And three parts give three sixths. The denominator stays six the whole time.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s4: {
    eyebrow: { uz: 'Doira model', ru: 'Круговая модель', en: 'The circle model' },
    title: {
      uz: 'Doiraga qaysi yozuv mos keladi?',
      ru: 'Какая запись подходит кругу?',
      en: 'Which record fits the circle?',
    },
    question: {
      uz: "Bo'yalgan qismni qaysi kasr ko'rsatadi?",
      ru: 'Какая дробь показывает закрашенную часть?',
      en: 'Which fraction shows the shaded part?',
    },
    options: [
      { uz: '3/4', ru: '3/4', en: '3/4' },
      { uz: '4/3', ru: '4/3', en: '4/3' },
      { uz: '1/4', ru: '1/4', en: '1/4' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Doira to'rtta teng sektorga bo'lingan, shundan uchtasi bo'yalgan. To'rtdan uch.",
      ru: 'Верно. Круг разделён на четыре равных сектора, три из них закрашены. Три четвёртых.',
      en: 'Correct. The circle is divided into four equal sectors and three of them are shaded. Three quarters.',
    },
    wrong: [
      null,
      {
        uz: "Sonlar joyini almashtirib qo'ygan. Chiziq ostiga hamma qismlar soni, ustiga esa olinganlari yoziladi.",
        ru: 'Числа поменялись местами. Под чертой пишут число всех частей, над чертой — число взятых.',
        en: 'The numbers swapped places. All the parts go below the line and the taken ones above it.',
      },
      {
        uz: "Bu bitta sektor. Rasmda esa uchta sektor bo'yalgan.",
        ru: 'Это один сектор. А на рисунке закрашены три сектора.',
        en: 'That is one sector. But three sectors are shaded in the drawing.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Suv uzelida yumaloq rezervuar ham bor. U to'rtta teng sektorga bo'lingan.",
          "Ulardan uchtasi to'ldirilgan.",
          'Uchta yozuv berilgan, faqat bittasi shu rasmga mos keladi.',
        ],
        ru: [
          'На водном узле есть и круглый резервуар. Он разделён на четыре равных сектора.',
          'Три из них заполнены.',
          'Даны три записи, и только одна подходит этому рисунку.',
        ],
        en: [
          'The water node also has a round reservoir. It is divided into four equal sectors.',
          'Three of them are filled.',
          'Three records are given, and only one of them fits this drawing.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s5: {
    eyebrow: { uz: 'Butun kasr bilan', ru: 'Целое дробью', en: 'The whole as a fraction' },
    title: {
      uz: 'Surat maxrajga teng bo\'lsa, bu butun',
      ru: 'Если числитель равен знаменателю, это целое',
      en: 'When the numerator equals the denominator you get a whole',
    },
    lead: {
      uz: 'Hamma qismni olsak, butun predmet qaytadi.',
      ru: 'Если взять все части, вернётся целый предмет.',
      en: 'Taking every part brings back the whole object.',
    },
    note: {
      uz: '15/15 = 1, 6/6 = 1, 12/12 = 1 — maxraj qanday bo\'lishidan qat\'i nazar.',
      ru: '15/15 = 1, 6/6 = 1, 12/12 = 1 — при любом знаменателе.',
      en: '15/15 = 1, 6/6 = 1, 12/12 = 1 — whatever the denominator is.',
    },
    audio: {
      intro: {
        uz: [
          "Endi baklarni to'liq to'ldiramiz.",
          "Birinchi bak o'n beshta bo'lakka bo'lingan edi va hammasi to'ldi. Bu o'n beshdan o'n besh.",
          "Ikkinchisi oltita bo'lakka bo'lingan edi. Hammasi to'lganda oltidan olti chiqadi.",
          "Ikkala holda ham bitta butun bak hosil bo'ldi. Demak surat maxrajga teng bo'lgan har qanday kasr birga teng.",
        ],
        ru: [
          'Теперь заполним баки целиком.',
          'Первый бак был разделён на пятнадцать частей, и все они заполнились. Это пятнадцать пятнадцатых.',
          'Второй был разделён на шесть частей. Когда заполнятся все, получится шесть шестых.',
          'В обоих случаях вышел один целый бак. Значит любая дробь, у которой числитель равен знаменателю, равна единице.',
        ],
        en: [
          'Now let us fill the tanks completely.',
          'The first tank was split into fifteen parts and all of them filled up. That is fifteen fifteenths.',
          'The second was split into six parts. When all of them fill up we get six sixths.',
          'In both cases one whole tank appeared. So any fraction whose numerator equals its denominator is equal to one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s6: {
    eyebrow: { uz: 'Butun bilan taqqoslash', ru: 'Сравнение с целым', en: 'Comparing with the whole' },
    title: {
      uz: 'Bu kasr butundan qayerda turadi?',
      ru: 'Где эта дробь стоит по отношению к целому?',
      en: 'Where does this fraction stand next to the whole?',
    },
    question: {
      uz: 'Rasmdagi kasr uchun mos joyni tanlang.',
      ru: 'Выбери подходящее место для дроби с рисунка.',
      en: 'Choose the right place for the fraction in the drawing.',
    },
    slots: [
      {
        label: { uz: '1 dan kichik', ru: 'Меньше 1', en: 'Less than 1' },
        caption: { uz: 'surat kichik', ru: 'числитель меньше', en: 'numerator smaller' },
      },
      {
        label: { uz: '1 ga teng', ru: 'Равна 1', en: 'Equal to 1' },
        caption: { uz: 'surat maxrajga teng', ru: 'числитель равен знаменателю', en: 'numerator equals denominator' },
      },
      {
        label: { uz: 'Butun emas', ru: 'Не целое', en: 'Not a whole' },
        caption: { uz: "qismlar teng emas", ru: 'части не равны', en: 'parts are not equal' },
      },
    ],
    correctSlot: 1,
    correctText: {
      uz: "To'g'ri. Oltita bo'lakning oltitasi ham to'ldi, ya'ni oltidan olti. Bu bitta butun bak.",
      ru: 'Верно. Из шести частей заполнены все шесть, то есть шесть шестых. Это один целый бак.',
      en: 'Correct. All six of the six parts are filled, that is six sixths. This is one whole tank.',
    },
    wrong: [
      {
        uz: "Kichik bo'lishi uchun surat maxrajdan kichik bo'lishi kerak edi. Bu yerda ikkalasi ham olti.",
        ru: 'Чтобы дробь была меньше, числитель должен быть меньше знаменателя. А здесь оба числа шесть.',
        en: 'To be smaller the numerator would have to be less than the denominator. Here both numbers are six.',
      },
      null,
      {
        uz: "Bu yerda bo'laklar teng. Rasmga qarang: hamma katak bir xil kenglikda.",
        ru: 'Здесь части равны. Посмотри на рисунок: все клетки одинаковой ширины.',
        en: 'The parts here are equal. Look at the drawing: every cell has the same width.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bak oltita teng bo'lakka bo'lingan va hammasi to'ldi.",
          'Bunday kasrni butun bilan taqqoslang.',
          'Uchta javobdan mosini tanlang.',
        ],
        ru: [
          'Бак разделён на шесть равных частей, и все они заполнены.',
          'Сравни такую дробь с целым.',
          'Выбери подходящий ответ из трёх.',
        ],
        en: [
          'The tank is split into six equal parts and all of them are filled.',
          'Compare such a fraction with the whole.',
          'Choose the right answer out of the three.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s7: {
    eyebrow: { uz: 'Sonlar nurida', ru: 'На числовом луче', en: 'On the number ray' },
    title: {
      uz: 'Kasrning nurda o\'z joyi bor',
      ru: 'У дроби есть своё место на луче',
      en: 'A fraction has its own place on the ray',
    },
    lead: {
      uz: '0 dan 1 gacha bo\'lgan kesma teng ulushlarga bo\'linadi.',
      ru: 'Отрезок от 0 до 1 делят на равные доли.',
      en: 'The segment from 0 to 1 is divided into equal shares.',
    },
    note: {
      uz: 'Noldan sanaymiz: birinchi belgi 1/5, ikkinchisi 2/5 va hokazo.',
      ru: 'Считаем от нуля: первая метка это 1/5, вторая 2/5 и так далее.',
      en: 'We count from zero: the first mark is 1/5, the second 2/5 and so on.',
    },
    audio: {
      intro: {
        uz: [
          "Kasr faqat rasmda emas, sonlar nurida ham turadi.",
          "Noldan birgacha bo'lgan kesmani beshta teng ulushga bo'lamiz.",
          "Har bir belgi bitta ulushga to'g'ri keladi. Birinchi belgi beshdan bir.",
          "Keyingisi beshdan ikki, undan keyingisi beshdan uch. Maxraj ulushlar sonidan, surat esa noldan sanalgan belgilar sonidan olinadi.",
        ],
        ru: [
          'Дробь стоит не только на рисунке, но и на числовом луче.',
          'Отрезок от нуля до единицы разделим на пять равных долей.',
          'Каждая метка приходится на одну долю. Первая метка это одна пятая.',
          'Следующая две пятых, а за ней три пятых. Знаменатель берут из числа долей, а числитель из числа меток, отсчитанных от нуля.',
        ],
        en: [
          'A fraction lives not only in a drawing but also on the number ray.',
          'Divide the segment from zero to one into five equal shares.',
          'Each mark corresponds to one share. The first mark is one fifth.',
          'The next is two fifths, and after it three fifths. The denominator comes from the number of shares, the numerator from the marks counted off from zero.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s8: {
    eyebrow: { uz: 'Nurdagi nuqta', ru: 'Точка на луче', en: 'A point on the ray' },
    title: {
      uz: 'A nuqta qaysi kasrni ko\'rsatyapti?',
      ru: 'Какую дробь показывает точка A?',
      en: 'Which fraction does point A show?',
    },
    question: {
      uz: 'Avval ulushlar sonini, keyin belgilar sonini tanlang.',
      ru: 'Сначала выбери число долей, потом число меток.',
      en: 'Choose the number of shares first, then the number of marks.',
    },
    den: 5,
    num: 3,
    denOptions: [4, 5, 6],
    numOptions: [2, 3, 5],
    denStep: {
      uz: 'Chiziq ostiga: 0 dan 1 gacha nechta ulush bor?',
      ru: 'Под черту: сколько долей от 0 до 1?',
      en: 'Below the line: how many shares from 0 to 1?',
    },
    numStep: {
      uz: 'Chiziq ustiga: noldan nechta ulush sanaldi?',
      ru: 'Над чертой: сколько долей отсчитали от нуля?',
      en: 'Above the line: how many shares were counted from zero?',
    },
    denDone: {
      uz: "To'g'ri, kesma beshta teng ulushga bo'lingan. Endi noldan nechta ulush sanalganini tanlang.",
      ru: 'Верно, отрезок разделён на пять равных долей. Теперь выбери, сколько долей отсчитали от нуля.',
      en: 'Correct, the segment is divided into five equal shares. Now choose how many shares were counted from zero.',
    },
    wrongDen: {
      uz: "Ulushlarni noldan birgacha sanang, belgilarni emas. Nol va bir ulush emas, ular chegaralar.",
      ru: 'Считай доли от нуля до единицы, а не метки. Ноль и единица не доли, а границы.',
      en: 'Count the shares from zero to one, not the marks. Zero and one are boundaries, not shares.',
    },
    wrongNum: {
      uz: "Noldan A nuqtagacha bo'lgan ulushlarni sanang. Ular uchta.",
      ru: 'Посчитай доли от нуля до точки A. Их три.',
      en: 'Count the shares from zero to point A. There are three of them.',
    },
    correctText: {
      uz: "To'g'ri. Beshdan uch. Kesma beshta ulushga bo'lingan, A nuqta uchinchi belgida turibdi.",
      ru: 'Верно. Три пятых. Отрезок разделён на пять долей, а точка A стоит на третьей метке.',
      en: 'Correct. Three fifths. The segment is divided into five shares and point A stands on the third mark.',
    },
    audio: {
      intro: {
        uz: [
          'Suv uzelining shkalasida A nuqta belgilangan.',
          "Kesma noldan birgacha teng ulushlarga bo'lingan.",
          'A nuqta qaysi kasrni ko\'rsatayotganini yozing.',
        ],
        ru: [
          'На шкале водного узла отмечена точка A.',
          'Отрезок от нуля до единицы разделён на равные доли.',
          'Запиши, какую дробь показывает точка A.',
        ],
        en: [
          'Point A is marked on the water node scale.',
          'The segment from zero to one is divided into equal shares.',
          'Write down which fraction point A shows.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s9: {
    eyebrow: { uz: 'Uchta model', ru: 'Три модели', en: 'Three models' },
    title: {
      uz: 'Bitta kasr, uch xil rasm',
      ru: 'Одна дробь, три разных рисунка',
      en: 'One fraction, three different pictures',
    },
    lead: {
      uz: 'Tasma, doira va nur bir xil kasrni ko\'rsatishi mumkin.',
      ru: 'Полоса, круг и луч могут показывать одну и ту же дробь.',
      en: 'A strip, a circle and a ray can all show the same fraction.',
    },
    note: {
      uz: 'Rasm har xil bo\'lsa ham, maxraj va surat o\'zgarmaydi.',
      ru: 'Рисунок разный, а знаменатель и числитель остаются теми же.',
      en: 'The picture differs, but the denominator and the numerator stay the same.',
    },
    audio: {
      intro: {
        uz: [
          "Bitta kasrni bir necha xil ko'rsatish mumkin.",
          "Mana tasma. U to'rtta teng katakka bo'lingan, uchtasi bo'yalgan.",
          "Mana doira. U ham to'rtta teng sektorga bo'lingan, uchtasi bo'yalgan.",
          "Mana sonlar nuri. Nolddan birgacha to'rtta ulush bor, nuqta uchinchi belgida. Uchalasida ham to'rtdan uch.",
        ],
        ru: [
          'Одну и ту же дробь можно показать по-разному.',
          'Вот полоса. Она разделена на четыре равные клетки, три из них закрашены.',
          'Вот круг. Он тоже разделён на четыре равных сектора, три из них закрашены.',
          'Вот числовой луч. От нуля до единицы четыре доли, точка стоит на третьей метке. Везде три четвёртых.',
        ],
        en: [
          'The same fraction can be shown in several ways.',
          'Here is a strip. It is divided into four equal cells, three of them shaded.',
          'Here is a circle. It is also divided into four equal sectors, three of them shaded.',
          'Here is the number ray. From zero to one there are four shares and the point stands on the third mark. Three quarters everywhere.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s10: {
    eyebrow: { uz: 'Uzel hisoboti', ru: 'Отчёт узла', en: 'The node report' },
    title: {
      uz: 'Bak qanday to\'lgan?',
      ru: 'Насколько заполнен бак?',
      en: 'How full is the tank?',
    },
    question: {
      uz: "Bak 10 ta teng bo'lakka bo'lingan, 7 tasi to'lgan. Qaysi yozuv to'g'ri?",
      ru: 'Бак разделён на 10 равных частей, заполнено 7. Какая запись верна?',
      en: 'The tank is divided into 10 equal parts and 7 are filled. Which record is right?',
    },
    options: [
      { uz: '7/10', ru: '7/10', en: '7/10' },
      { uz: '10/7', ru: '10/7', en: '10/7' },
      { uz: '7/3', ru: '7/3', en: '7/3' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'ndan yetti. Chiziq ostida hamma bo'laklar soni, ustida to'lganlari.",
      ru: 'Верно. Семь десятых. Под чертой число всех частей, над чертой число заполненных.',
      en: 'Correct. Seven tenths. All the parts go below the line and the filled ones above it.',
    },
    wrong: [
      null,
      {
        uz: "Sonlar joyi almashgan. Maxraj har doim hamma teng bo'laklar soni.",
        ru: 'Числа поменялись местами. Знаменатель это всегда число всех равных частей.',
        en: 'The numbers swapped places. The denominator is always the number of all the equal parts.',
      },
      {
        uz: "Uch — bu bo'sh bo'laklar soni. Maxrajga esa hammasi, ya'ni o'n yoziladi.",
        ru: 'Три это число пустых частей. А в знаменатель пишут все части, то есть десять.',
        en: 'Three is the number of empty parts. But the denominator takes all the parts, that is ten.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Uzel kunlik hisobotni tayyorlayapti.',
          "Katta bak o'nta teng bo'lakka bo'lingan, ulardan yettitasi to'lgan.",
          'Hisobotga qaysi yozuv tushishi kerakligini tanlang.',
        ],
        ru: [
          'Узел готовит дневной отчёт.',
          'Большой бак разделён на десять равных частей, семь из них заполнены.',
          'Выбери, какая запись должна попасть в отчёт.',
        ],
        en: [
          'The node is preparing its daily report.',
          'The big tank is divided into ten equal parts and seven of them are filled.',
          'Choose which record should go into the report.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s11: {
    eyebrow: { uz: 'Kasr qoidasi', ru: 'Правило дроби', en: 'The fraction rule' },
    title: {
      uz: 'Kasrni o\'qish va yozish',
      ru: 'Как читать и записывать дробь',
      en: 'Reading and writing a fraction',
    },
    lead: {
      uz: 'Bu to\'rt qoida har qanday model uchun ishlaydi.',
      ru: 'Эти четыре правила работают для любой модели.',
      en: 'These four rules work for any model.',
    },
    note: {
      uz: 'Qismlar teng bo\'lmasa, kasr haqida gapirib bo\'lmaydi.',
      ru: 'Если части не равны, о дроби говорить нельзя.',
      en: 'If the parts are not equal, there is no fraction to speak of.',
    },
    audio: {
      intro: {
        uz: [
          "Bugungi qoidani bir joyga yig'amiz.",
          "Birinchi shart. Butun teng qismlarga bo'linishi kerak, aks holda ulush yo'q.",
          "Maxraj chiziq ostida turadi va nechta teng qism borligini aytadi.",
          "Surat chiziq ustida turadi va shulardan nechtasi olinganini aytadi. Surat maxrajga teng bo'lsa, kasr birga teng.",
        ],
        ru: [
          'Соберём сегодняшнее правило в одно место.',
          'Первое условие. Целое должно быть разделено на равные части, иначе доли нет.',
          'Знаменатель стоит под чертой и говорит, сколько всего равных частей.',
          'Числитель стоит над чертой и говорит, сколько из них взяли. Если числитель равен знаменателю, дробь равна единице.',
        ],
        en: [
          "Let us gather today's rule in one place.",
          'First condition. The whole must be divided into equal parts, otherwise there is no share at all.',
          'The denominator stands below the line and says how many equal parts there are.',
          'The numerator stands above the line and says how many of them were taken. If the numerator equals the denominator, the fraction equals one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s12: {
    eyebrow: { uz: 'Kasr xaritasi', ru: 'Карта дроби', en: 'The fraction map' },
    title: {
      uz: 'Chiziq ostiga qaysi son tushadi?',
      ru: 'Какое число встаёт под черту?',
      en: 'Which number goes below the line?',
    },
    question: {
      uz: 'Maxrajga nima yoziladi?',
      ru: 'Что пишут в знаменатель?',
      en: 'What goes into the denominator?',
    },
    options: [
      {
        uz: 'Hamma teng qismlar soni',
        ru: 'Число всех равных частей',
        en: 'The count of all the equal parts',
      },
      {
        uz: "Bo'yalgan qismlar soni",
        ru: 'Число закрашенных частей',
        en: 'The count of the shaded parts',
      },
      {
        uz: "Bo'yalmagan qismlar soni",
        ru: 'Число незакрашенных частей',
        en: 'The count of the unshaded parts',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Maxraj butun necha teng qismga bo'linganini ko'rsatadi. Doirada beshta sektor bor, demak chiziq ostiga besh yoziladi.",
      ru: 'Верно. Знаменатель показывает, на сколько равных частей разделили целое. В круге пять секторов, значит под черту пишут пять.',
      en: 'Correct. The denominator shows into how many equal parts the whole was divided. The circle has five sectors, so five goes below the line.',
    },
    wrong: [
      null,
      {
        uz: "Bo'yalgan qismlar soni suratga, ya'ni chiziq ustiga yoziladi. Bu yerda ikkita sektor bo'yalgan.",
        ru: 'Число закрашенных частей пишут в числитель, то есть над чертой. Здесь закрашены два сектора.',
        en: 'The count of the shaded parts goes into the numerator, above the line. Two sectors are shaded here.',
      },
      {
        uz: "Bo'yalmagan qismlar kasrga alohida yozilmaydi. Ular faqat hamma qismlar bilan birga, maxraj ichida hisobga olinadi.",
        ru: 'Незакрашенные части в дробь отдельно не пишут. Они учитываются только вместе со всеми частями, внутри знаменателя.',
        en: 'The unshaded parts are never written into the fraction on their own. They only count inside the denominator, together with all the parts.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Suv uzelida yumaloq rezervuar beshta teng sektorga bo'lingan, ikkitasi to'ldirilgan.",
          "Yonida bo'sh kasr ramkasi turibdi. Ikkita bog'lovchi rasmni ramka bilan tutashtiradi.",
          'Chiziq ostidagi uyaga qaysi son tushishini tanlang.',
        ],
        ru: [
          'На водном узле круглый резервуар разделён на пять равных секторов, два заполнены.',
          'Рядом стоит пустая рамка дроби. Две связи соединяют рисунок с рамкой.',
          'Выбери, какое число встанет в клетку под чертой.',
        ],
        en: [
          'At the water node a round reservoir is divided into five equal sectors, two of them filled.',
          'An empty fraction frame stands next to it. Two connectors link the drawing to the frame.',
          'Choose which number goes into the slot below the line.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s13: {
    eyebrow: { uz: 'Bit yozuvi', ru: 'Запись Bit', en: "Bit's record" },
    title: {
      uz: 'Bit 3/5 deb yozdi',
      ru: 'Bit записал 3/5',
      en: 'Bit wrote 3/5',
    },
    question: {
      uz: 'Bit qayerda adashdi?',
      ru: 'Где ошибся Bit?',
      en: 'Where did Bit go wrong?',
    },
    options: [
      {
        uz: "Bo'yalganni bo'yalmaganga taqqosladi, butunga emas",
        ru: 'Он сравнил закрашенное с незакрашенным, а не с целым',
        en: 'He compared the shaded part with the unshaded part instead of the whole',
      },
      {
        uz: 'Suratni noto\'g\'ri sanadi',
        ru: 'Он неверно посчитал числитель',
        en: 'He counted the numerator incorrectly',
      },
      {
        uz: 'Kasrni teskari yozdi',
        ru: 'Он записал дробь наоборот',
        en: 'He wrote the fraction upside down',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Doirada sakkizta sektor bor: uchtasi bo'yalgan, beshtasi bo'sh. Maxrajga sakkiz yoziladi, demak sakkizdan uch.",
      ru: 'Верно. В круге восемь секторов: три закрашены, пять пустые. В знаменатель идёт восемь, значит три восьмых.',
      en: 'Correct. The circle has eight sectors: three shaded and five empty. Eight goes into the denominator, so it is three eighths.',
    },
    wrong: [
      null,
      {
        uz: "Surat to'g'ri. Bo'yalgan sektorlar rostdan uchta. Xato pastdagi sonda.",
        ru: 'Числитель верный. Закрашенных секторов действительно три. Ошибка в нижнем числе.',
        en: 'The numerator is right. There really are three shaded sectors. The mistake is in the lower number.',
      },
      {
        uz: "Tartib to'g'ri: bo'yalgani tepada, butun pastda. Faqat pastdagi son noto'g'ri olingan.",
        ru: 'Порядок верный: закрашенное сверху, целое снизу. Просто нижнее число взято неверно.',
        en: 'The order is right: the shaded part on top, the whole below. Only the lower number was taken wrongly.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit yumaloq rezervuarni o'qidi. Unda sakkizta teng sektor bor.",
          "Uchta sektor to'ldirilgan, beshtasi bo'sh. Bit uchtani beshga qarab, uch bo'lingan besh deb yozdi.",
          'Bit qayerda adashganini toping.',
        ],
        ru: [
          'Bit прочитал круглый резервуар. В нём восемь равных секторов.',
          'Три сектора заполнены, пять пустые. Bit посмотрел на три и на пять и записал три пятых.',
          'Найди, где Bit ошибся.',
        ],
        en: [
          'Bit read the round reservoir. It has eight equal sectors.',
          'Three sectors are filled and five are empty. Bit looked at three and five and wrote three fifths.',
          'Find where Bit went wrong.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s14: {
    eyebrow: { uz: 'Kunlik sarf', ru: 'Дневной расход', en: 'The daily use' },
    title: {
      uz: 'Bakda qancha suv qoldi?',
      ru: 'Сколько воды осталось в баке?',
      en: 'How much water is left in the tank?',
    },
    question: {
      uz: "Bak 10 ta teng bo'lakka bo'lingan, 4 tasi sarflandi. Qolgan qism qaysi kasr?",
      ru: 'Бак разделён на 10 равных частей, 4 израсходованы. Какой дробью выразить остаток?',
      en: 'The tank is divided into 10 equal parts and 4 were used. Which fraction shows what is left?',
    },
    options: [
      { uz: '6/10', ru: '6/10', en: '6/10' },
      { uz: '4/10', ru: '4/10', en: '4/10' },
      { uz: '4/6', ru: '4/6', en: '4/6' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'nta bo'lakdan to'rttasi ketdi, oltitasi qoldi. Maxraj o'zgarmadi, chunki bak baribir o'nta bo'lakka bo'lingan.",
      ru: 'Верно. Из десяти частей ушли четыре, осталось шесть. Знаменатель не изменился, ведь бак по-прежнему разделён на десять частей.',
      en: 'Correct. Four of the ten parts went, six remain. The denominator did not change, because the tank is still divided into ten parts.',
    },
    wrong: [
      null,
      {
        uz: "Bu sarflangan qism. Bizga esa qolgani kerak, ya'ni o'ndan olti.",
        ru: 'Это израсходованная часть. А нам нужен остаток, то есть шесть десятых.',
        en: 'That is the part that was used. We need what is left, that is six tenths.',
      },
      {
        uz: "Maxrajga qolgan bo'laklar soni emas, hamma bo'laklar soni yoziladi. Bak o'nta bo'lakka bo'lingan.",
        ru: 'В знаменатель идёт не число оставшихся частей, а число всех частей. Бак разделён на десять частей.',
        en: 'The denominator takes all the parts, not the remaining ones. The tank is divided into ten parts.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Kun tugadi va uzel yakuniy hisobni beryapti.',
          "Katta bak o'nta teng bo'lakka bo'lingan edi. Kun davomida to'rtta bo'lak sarflandi.",
          'Bakda qolgan suvni kasr bilan yozing.',
        ],
        ru: [
          'День закончился, и узел даёт итоговый отчёт.',
          'Большой бак был разделён на десять равных частей. За день израсходовали четыре части.',
          'Запиши дробью, сколько воды осталось в баке.',
        ],
        en: [
          'The day is over and the node is filing its final report.',
          'The big tank was divided into ten equal parts. Four parts were used during the day.',
          'Write down as a fraction how much water is left in the tank.',
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
      uz: 'Maxraj nimani ko\'rsatishini ayting va unvonni oling.',
      ru: 'Скажи, что показывает знаменатель, и получи звание.',
      en: 'Say what the denominator shows and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: 'Maxraj nimani ko\'rsatadi?',
      ru: 'Что показывает знаменатель?',
      en: 'What does the denominator show?',
    },
    reflectionStart: {
      uz: 'Maxraj — bu…',
      ru: 'Знаменатель это…',
      en: 'The denominator is…',
    },
    reflectionOptions: [
      {
        uz: "butun necha teng qismga bo'lingani",
        ru: 'на сколько равных частей разделили целое',
        en: 'how many equal parts the whole was divided into',
      },
      {
        uz: "nechta qism olingani",
        ru: 'сколько частей взяли',
        en: 'how many parts were taken',
      },
      {
        uz: "nechta qism bo'sh qolgani",
        ru: 'сколько частей осталось пустыми',
        en: 'how many parts were left empty',
      },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Maxraj ulushning kattaligini beradi, olinganlar sonini esa surat aytadi.",
      ru: 'Верно. Знаменатель задаёт величину доли, а число взятых долей говорит числитель.',
      en: 'Correct. The denominator sets the size of the share, while the numerator says how many were taken.',
    },
    reflectionWrong: {
      uz: "Olinganlar soni suratda turadi, bo'sh qolganlar esa kasrga umuman yozilmaydi. Maxraj hamma teng qismlar sonini beradi.",
      ru: 'Число взятых стоит в числителе, а пустые в дробь вообще не пишут. Знаменатель даёт число всех равных частей.',
      en: 'The taken parts stand in the numerator, and the empty ones never enter the fraction at all. The denominator gives the count of all the equal parts.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Taqsimlash bosh muhandisi', ru: 'Главный инженер распределения', en: 'Chief distribution engineer' } },
      { min: 3, title: { uz: 'Ulush hisobchisi', ru: 'Счётчик долей', en: 'Share counter' } },
      { min: 0, title: { uz: 'Uzel kuzatuvchisi', ru: 'Наблюдатель узла', en: 'Node observer' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "Butun teng qismlarga bo'linishi shart, aks holda ulush yo'q.",
        ru: 'Целое обязано быть разделено на равные части, иначе доли нет.',
        en: 'The whole must be divided into equal parts, otherwise there is no share.',
      },
      {
        uz: "Maxraj chiziq ostida: nechta teng qism bor.",
        ru: 'Знаменатель под чертой: сколько всего равных частей.',
        en: 'The denominator is below the line: how many equal parts there are.',
      },
      {
        uz: "Surat chiziq ustida: shulardan nechtasi olingan.",
        ru: 'Числитель над чертой: сколько из них взяли.',
        en: 'The numerator is above the line: how many of them were taken.',
      },
      {
        uz: "Surat maxrajga teng bo'lsa, kasr birga teng.",
        ru: 'Если числитель равен знаменателю, дробь равна единице.',
        en: 'If the numerator equals the denominator, the fraction equals one.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: 'Qaysi ulush kattaroq: kasrlarni taqqoslash.',
      ru: 'Какая доля больше: сравнение дробей.',
      en: 'Which share is bigger: comparing fractions.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Suv uzeli endi har bir bakni kasr bilan yozadi.",
          "Bugun siz butunni teng ulushlarga ajratishni va ularni kasr bilan yozishni o'rgandingiz.",
          'Unvonni ochish uchun bitta savol qoldi.',
        ],
        ru: [
          'Миссия выполнена. Водный узел теперь записывает каждый бак дробью.',
          'Сегодня ты умеешь делить целое на равные доли и записывать их дробью.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The water node now records every tank as a fraction.',
          'Today you can split a whole into equal shares and write them as a fraction.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

// s0, s14 — suv uzeli sahnasi.
const WaterScene = ({ mode = 'hook', solved = false }) => {
  const t = useT();
  const tank = (x, y, w, h, cuts, filled) => {
    const edges = cuts
      ? [0, ...cuts, 1].map((value) => x + value * w)
      : null;
    const parts = cuts ? cuts.length + 1 : 6;
    const bounds = edges ?? Array.from({ length: parts + 1 }, (_, i) => x + (i * w) / parts);
    return (
      <g>
        <rect x={x - 8} y={y - 10} width={w + 16} height={h + 20} rx="12" fill="#E8F1F3" stroke="#B7CFD6" strokeWidth="2.4" />
        {Array.from({ length: parts }, (_, index) => (
          <rect
            key={index}
            x={bounds[index]}
            y={y}
            width={bounds[index + 1] - bounds[index]}
            height={h}
            fill={index < filled ? '#8FD3E4' : '#FFFFFF'}
            stroke={index < filled ? T.cyan : 'rgba(23,59,82,.20)'}
            strokeWidth={index < filled ? 2.4 : 1.5}
          />
        ))}
        <rect x={x} y={y} width={w} height={h} fill="none" stroke={T.ink} strokeWidth="2.6" />
      </g>
    );
  };

  return (
    <FitSvg viewBox="0 0 520 464">
      <defs>
        <linearGradient id="d18-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7F1F3" />
          <stop offset="1" stopColor="#F7FBFA" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="464" rx="22" fill="url(#d18-wall)" />

      {/* quvurlar */}
      <path d="M0 74 H196 V128" fill="none" stroke="#B7CFD6" strokeWidth="12" strokeLinecap="round" />
      <path d="M520 74 H324 V128" fill="none" stroke="#B7CFD6" strokeWidth="12" strokeLinecap="round" />
      <circle cx="196" cy="74" r="13" fill="#FFFFFF" stroke="#8FAAB4" strokeWidth="3" />
      <circle cx="324" cy="74" r="13" fill="#FFFFFF" stroke="#8FAAB4" strokeWidth="3" />

      {mode === 'hook' ? (
        <g>
          <text x="260" y="34" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Ikkala bak oltita bo\'lakka bo\'lingan', ru: 'Оба бака разделены на шесть частей', en: 'Both tanks are split into six parts' })}
          </text>
          <text x="70" y="176" textAnchor="middle" fill={T.cyan} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">1</text>
          {tank(104, 150, 376, 70, null, 1)}
          <text x="70" y="326" textAnchor="middle" fill={T.accent} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">2</text>
          {tank(104, 300, 376, 70, [0.06, 0.3, 0.4, 0.72, 0.82], 1)}
          <text x="292" y="256" textAnchor="middle" fill={T.ink3} fontSize="13.5" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'teng bo\'laklar', ru: 'равные части', en: 'equal parts' })}
          </text>
          <text x="292" y="406" textAnchor="middle" fill={T.ink3} fontSize="13.5" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'har xil bo\'laklar', ru: 'разные части', en: 'different parts' })}
          </text>
        </g>
      ) : (
        <g>
          <text x="260" y="34" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Kun oxiridagi bak', ru: 'Бак в конце дня', en: 'The tank at the end of the day' })}
          </text>
          {tank(70, 160, 380, 92, null, 0)}
          {Array.from({ length: 10 }, (_, index) => (
            <rect
              key={index}
              x={70 + (index * 380) / 10}
              y={160}
              width={38}
              height={92}
              fill={index < 4 ? '#F2D9CF' : '#8FD3E4'}
              stroke={index < 4 ? T.accent : T.cyan}
              strokeWidth="2.2"
            />
          ))}
          <rect x="70" y="160" width="380" height="92" fill="none" stroke={T.ink} strokeWidth="2.6" />
          <text x="146" y="288" textAnchor="middle" fill={T.accent} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: 'sarflandi', ru: 'израсходовано', en: 'used' })}
          </text>
          <text x="336" y="288" textAnchor="middle" fill={T.cyan} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: 'qoldi', ru: 'осталось', en: 'left' })}
          </text>
          <g opacity={solved ? 1 : 0.35} style={{ transition: 'opacity .4s' }}>
            <rect x="146" y="326" width="228" height="94" rx="16" fill="#FFFFFF" stroke={solved ? T.success : T.ink3} strokeWidth="2.4" />
            <FractionGlyph num={6} den={10} x={260} y={372} size={32} tone={solved ? T.success : T.ink3} />
          </g>
        </g>
      )}
    </FitSvg>
  );
};

// s1 — kasr yozuvi va uning bo'laklari.
const NotationFigure = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 164">
      <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={6} shaded={1} x={26} y={44} width={180} height={58} />
      </g>
      <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <FractionGlyph num={1} den={6} x={400} y={73} size={38} tone={T.cyan} />
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <path d="M322 47 L358 55" stroke={T.ink3} strokeWidth="1.8" />
        <text x="314" y="45" textAnchor="end" fill={T.ink2} fontSize="13.5" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'surat', ru: 'числитель', en: 'numerator' })}
        </text>
        <text x="314" y="28" textAnchor="end" fill={T.ink3} fontSize="11" fontFamily="Manrope, sans-serif">
          {t({ uz: 'nechtasi olingan', ru: 'сколько взяли', en: 'how many taken' })}
        </text>
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <path d="M322 99 L358 92" stroke={T.ink3} strokeWidth="1.8" />
        <text x="314" y="103" textAnchor="end" fill={T.ink2} fontSize="13.5" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'maxraj', ru: 'знаменатель', en: 'denominator' })}
        </text>
        <text x="314" y="120" textAnchor="end" fill={T.ink3} fontSize="11" fontFamily="Manrope, sans-serif">
          {t({ uz: 'nechta teng qism', ru: 'сколько равных частей', en: 'how many equal parts' })}
        </text>
      </g>
      <g opacity={frame >= 3 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <text x="116" y="146" textAnchor="middle" fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: 'Oltidan bir', ru: 'Одна шестая', en: 'One sixth' })}
        </text>
      </g>
    </FitSvg>
  );
};

// s3 — bir xil maxraj, o'sib boruvchi surat.
const CountUpFigure = ({ frame = 0 }) => (
  <FitSvg viewBox="0 0 520 232">
    {[1, 2, 3].map((shaded, index) => (
      <g key={shaded} opacity={frame >= index + 1 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={6} shaded={shaded} x={46} y={16 + index * 70} width={340} height={50} />
        <FractionGlyph num={shaded} den={6} x={444} y={44 + index * 70} size={26} tone={T.cyan} />
      </g>
    ))}
  </FitSvg>
);

// s5 — butunga aylangan kasrlar.
const WholeFigure = ({ frame = 0 }) => {
  const t = useT();
  const rows = [
    { parts: 15, on: frame >= 2 },
    { parts: 6, on: frame >= 3 },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {rows.map((row, index) => (
        <g key={row.parts} opacity={row.on ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
          <FractionBar parts={row.parts} shaded={row.parts} x={46} y={24 + index * 88} width={306} height={56} />
          <FractionGlyph num={row.parts} den={row.parts} x={402} y={54 + index * 88} size={24} tone={T.success} />
          <text x={452} y={62 + index * 88} fill={T.success} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            = 1
          </text>
        </g>
      ))}
      <g opacity={frame >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <text x="260" y="216" textAnchor="middle" fill={T.ink2} fontSize="13.5" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({
            uz: 'Surat maxrajga teng bo\'lgan har qanday kasr birga teng',
            ru: 'Любая дробь с равными числителем и знаменателем равна единице',
            en: 'Any fraction with equal numerator and denominator equals one',
          })}
        </text>
      </g>
    </FitSvg>
  );
};

// s7, s8 — sonlar nuri.
const RayFigure = ({ frame = 0, mark = null, showFraction = true, letter = false }) => (
  <FitSvg viewBox="0 0 520 190">
    <FractionRay parts={5} mark={frame >= 2 || mark !== null ? (mark ?? (frame >= 4 ? 3 : frame - 1)) : null} showFraction={showFraction} y={104} />
    {letter && mark !== null && (
      <text x={60 + (mark / 5) * 396} y={144} textAnchor="middle" fill={T.accent} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        A
      </text>
    )}
  </FitSvg>
);

// s9 — bitta kasr uchta modelda.
const ThreeModels = ({ frame = 0 }) => (
  <FitSvg viewBox="0 0 520 232">
    <g opacity={frame >= 1 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <FractionBar parts={4} shaded={3} x={32} y={40} width={150} height={70} />
      <FractionGlyph num={3} den={4} x={107} y={168} size={22} tone={T.cyan} />
    </g>
    <g opacity={frame >= 2 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <FractionCircle parts={4} shaded={3} cx={260} cy={74} r={44} />
      <FractionGlyph num={3} den={4} x={260} y={168} size={22} tone={T.cyan} />
    </g>
    <g opacity={frame >= 3 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <g transform="translate(230 -22) scale(0.52)">
        <FractionRay parts={4} mark={3} showFraction={false} y={190} />
      </g>
      <FractionGlyph num={3} den={4} x={412} y={168} size={22} tone={T.cyan} />
    </g>
  </FitSvg>
);

// s13 — Bit ning doirasi.
const BitCircleFigure = ({ solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 232">
      <FractionCircle parts={8} shaded={3} cx={148} cy={112} r={80} />
      <text x="148" y="216" textAnchor="middle" fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: '3 ta bo\'yalgan, 5 ta bo\'sh', ru: '3 закрашены, 5 пустые', en: '3 shaded, 5 empty' })}
      </text>
      <g>
        <rect x="268" y="42" width="212" height="66" rx="16" fill="#FFF6F3" stroke={T.accent} strokeWidth="2.4" />
        <FractionGlyph num={3} den={5} x={330} y={76} size={26} tone={T.accent} />
        <text x="410" y="82" textAnchor="middle" fill={T.accent} fontSize="15" fontWeight="750" fontFamily="Manrope, sans-serif">
          Bit
        </text>
      </g>
      <g opacity={solved ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x="268" y="128" width="212" height="66" rx="16" fill={solved ? T.successSoft : '#FFFFFF'} stroke={solved ? T.success : T.ink3} strokeWidth="2.4" strokeDasharray={solved ? '' : '5 5'} />
        <FractionGlyph num={3} den={solved ? 8 : '?'} x={330} y={162} size={26} tone={solved ? T.success : T.ink3} />
        <text x="416" y="168" textAnchor="middle" fill={solved ? T.success : T.ink3} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'to\'g\'ri', ru: 'верно', en: 'right' })}
        </text>
      </g>
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
          tone: T.accent,
          head: t({ uz: 'Teng qismlar', ru: 'Равные части', en: 'Equal parts' }),
          body: t({ uz: "Butun teng bo'linmasa, ulush yo'q", ru: 'Если целое разделено неравно, доли нет', en: 'If the whole is split unevenly there is no share' }),
          formula: '=',
        },
        {
          tone: T.cyan,
          head: t({ uz: 'Maxraj', ru: 'Знаменатель', en: 'Denominator' }),
          body: t({ uz: 'Chiziq ostida: nechta teng qism bor', ru: 'Под чертой: сколько всего равных частей', en: 'Below the line: how many equal parts' }),
          formula: '6',
        },
        {
          tone: T.navy,
          head: t({ uz: 'Surat', ru: 'Числитель', en: 'Numerator' }),
          body: t({ uz: 'Chiziq ustida: shulardan nechtasi olingan', ru: 'Над чертой: сколько из них взяли', en: 'Above the line: how many were taken' }),
          formula: '1',
        },
        {
          tone: T.success,
          head: t({ uz: 'Butun', ru: 'Целое', en: 'The whole' }),
          body: t({ uz: 'Surat maxrajga teng bo\'lsa', ru: 'Если числитель равен знаменателю', en: 'When the numerator equals the denominator' }),
          formula: '6/6 = 1',
        },
      ]}
    />
  );
};

// s12 — kasr xaritasi: rasmning qaysi qismi qaysi joyga tushadi.
//
// Ilgari bu ekranda oddiy matn ro'yxati turardi va ro'yxatning o'zi javobni
// aytib qo'yardi. Endi chizma bor: doira, bo'sh kasr ramkasi va ikkita
// bog'lovchi. Javob berilmaguncha bog'lovchilar kulrang va uyalarda savol
// belgisi turadi, javobdan keyin xarita to'liq ochiladi.
const MapFigure = ({ solved = false }) => {
  const t = useT();
  const slot = (y, value, tone) => (
    <g>
      <rect
        x={358}
        y={y}
        width={72}
        height={48}
        rx="12"
        fill={solved ? '#FFFFFF' : 'rgba(255,255,255,.7)'}
        stroke={solved ? tone : 'rgba(23,59,82,.22)'}
        strokeWidth={solved ? 2.6 : 1.8}
        strokeDasharray={solved ? '' : '5 4'}
      />
      <text
        x={394}
        y={y + 33}
        textAnchor="middle"
        fill={solved ? tone : T.ink3}
        fontSize="24"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {solved ? value : '?'}
      </text>
    </g>
  );
  return (
    <FitSvg viewBox="0 0 520 210">
      <FractionCircle parts={5} shaded={2} cx={116} cy={104} r={72} />

      {/* bo'yalgan sektorlardan yuqoridagi uyaga */}
      <path
        d="M186 62 C246 34 300 40 352 52"
        fill="none"
        stroke={solved ? T.cyan : 'rgba(23,59,82,.26)'}
        strokeWidth={solved ? 2.6 : 1.8}
        strokeDasharray={solved ? '' : '6 5'}
      />
      {/* butun doiradan pastdagi uyaga */}
      <path
        d="M188 154 C248 176 300 166 352 144"
        fill="none"
        stroke={solved ? T.navy : 'rgba(23,59,82,.26)'}
        strokeWidth={solved ? 2.6 : 1.8}
        strokeDasharray={solved ? '' : '6 5'}
      />

      {slot(30, 2, T.cyan)}
      <line x1={362} y1={90} x2={426} y2={90} stroke={solved ? T.ink : 'rgba(23,59,82,.3)'} strokeWidth="3" strokeLinecap="round" />
      {slot(102, 5, T.navy)}

      <g opacity={solved ? 1 : 0} style={{ transition: 'opacity .35s' }}>
        <text x={268} y={34} textAnchor="middle" fill={T.cyan} fontSize="12.5" fontWeight="800" fontFamily="Manrope, sans-serif">
          {t({ uz: "bo'yalganlar", ru: 'закрашенные', en: 'the shaded ones' })}
        </text>
        <text x={268} y={192} textAnchor="middle" fill={T.navy} fontSize="12.5" fontWeight="800" fontFamily="Manrope, sans-serif">
          {t({ uz: 'hamma teng qismlar', ru: 'все равные части', en: 'all the equal parts' })}
        </text>
      </g>
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={() => <WaterScene />} />
);
const Screen1 = (props) => (
  <RevealScreen {...props} ratio="520 / 164" figure={({ frame }) => <NotationFigure frame={frame} />} />
);
const Screen2 = (props) => (
  <FractionEntry
    {...props}
    figure={({ solved }) => (
      <FitSvg viewBox="0 0 520 172">
        <FractionBar parts={15} shaded={2} x={46} y={26} width={428} height={72} />
        <FractionGlyph num={solved ? 2 : '?'} den={solved ? 15 : '?'} x={260} y={140} size={24} tone={solved ? T.success : T.ink3} />
      </FitSvg>
    )}
    ratio="520 / 172"
  />
);
const Screen3 = (props) => <RevealScreen {...props} figure={({ frame }) => <CountUpFigure frame={frame} />} />;
const Screen4 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    figure={({ solved }) => (
      <FitSvg viewBox="0 0 520 232">
        <FractionCircle parts={4} shaded={3} cx={200} cy={112} r={82} />
        <g opacity={solved ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
          <FractionGlyph num={3} den={4} x={392} y={104} size={36} tone={T.success} />
        </g>
      </FitSvg>
    )}
  />
);
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <WholeFigure frame={frame} />} />;
const Screen6 = (props) => (
  <SlotScreen
    {...props}
    ratio="520 / 172"
    figure={({ solved }) => (
      <FitSvg viewBox="0 0 520 172">
        <FractionBar parts={6} shaded={6} x={46} y={26} width={428} height={72} />
        <FractionGlyph num={6} den={6} x={222} y={140} size={24} tone={solved ? T.success : T.cyan} />
        <g opacity={solved ? 1 : 0}>
          <text x={278} y={148} fill={T.success} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">= 1</text>
        </g>
      </FitSvg>
    )}
  />
);
const Screen7 = (props) => (
  <RevealScreen {...props} ratio="520 / 190" figure={({ frame }) => <RayFigure frame={frame} />} />
);
const Screen8 = (props) => (
  <FractionEntry
    {...props}
    ratio="520 / 190"
    figure={({ solved }) => <RayFigure mark={3} showFraction={solved} letter />}
  />
);
const Screen9 = (props) => <RevealScreen {...props} figure={({ frame }) => <ThreeModels frame={frame} />} />;
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="520 / 172"
    figure={({ solved }) => (
      <FitSvg viewBox="0 0 520 172">
        <FractionBar parts={10} shaded={7} x={46} y={26} width={428} height={72} />
        <FractionGlyph num={solved ? 7 : '?'} den={solved ? 10 : '?'} x={260} y={140} size={24} tone={solved ? T.success : T.ink3} />
      </FitSvg>
    )}
  />
);
const Screen11 = (props) => (
  <RevealScreen {...props} plain figure={({ frame }) => <RulePanel frame={frame + 1} />} />
);
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} ratio="520 / 210" figure={({ solved }) => <MapFigure solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} stack figure={({ solved }) => <BitCircleFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <WaterScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars18(props) {
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
