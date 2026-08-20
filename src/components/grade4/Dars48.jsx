// ============================================================================
// 4-SINF · Dars 48 · Qo'shishning o'rin almashtirish va guruhlash xossalari
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 35-36-bet:
//   35-bet 1-topshiriq — z + x = x + z va 1 457 + 23 543 = 25 000 ikki
//     tartibda; darslikning o'z xulosasi "Qo'shiluvchilarning o'rni
//     almashtirilsa ham ...";
//   35-bet 3-topshiriq — a + b + d = (a + d) + b, 500 + 800 + 500;
//   35-bet 6-topshiriq — Nodiraning xaridi (12 000, 34 500, 8 000, 5 500);
//   35-bet 7-topshiriq — guruhlab qo'shish: 14 800 + 5 000 + 200,
//     20 400 + 600 + 50 800, 73 000 + 22 300 + 700, 69 900 + 30 000 + 100;
//   36-bet 1-topshiriq — faqat qo'shish va ayirishda amallar chapdan o'ngga.
// Syujet: boshqaruv markazining YIG'UV MAYDONI (SYUJET_4SINF.md, 6-blok).
// 47-darsdan ko'prik: darvoza ochildi, endi hisobni tezlashtirish kerak.
//
// YADRO. Qo'shiluvchilarning o'rni va guruhlanishi yig'indini o'zgartirmaydi.
// Shu sababli yumaloq son beradigan juftni oldin qo'shish mumkin. Ayirish
// bunday erkinlikni bermaydi: u chapdan o'ngga bajariladi.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, Plate, RecordRow,
  RevealScreen, RuleRows, StepList, StepRows, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'addprop-4-48-v2',
  slug: 'dars48-qoshish-xossalari',
  lessonTitle: {
    uz: "48-dars. Qo'shishning o'rin almashtirish va guruhlash xossalari",
    ru: 'Урок 48. Переместительное и сочетательное свойства сложения',
    en: 'Lesson 48. Commutative and associative properties of addition',
  },
  skillTags: ['commutative_property', 'associative_property', 'round_grouping', 'operation_order', 'mental_addition'],
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
    eyebrow: { uz: "Yig'uv maydoni", ru: 'Сборочная площадка', en: 'The assembly yard' },
    title: {
      uz: 'Hisob juda uzoq ketdi',
      ru: 'Расчёт затянулся',
      en: 'The calculation dragged on',
    },
    question: {
      uz: 'Qaysi ikki sonni oldin qo\'shgan qulay?',
      ru: 'Какие два числа удобнее сложить первыми?',
      en: 'Which two numbers are convenient to add first?',
    },
    options: [
      { uz: '14800 va 200', ru: '14800 и 200', en: '14800 and 200' },
      { uz: '14800 va 5000', ru: '14800 и 5000', en: '14800 and 5000' },
      { uz: '5000 va 200', ru: '5000 и 200', en: '5000 and 200' },
      { uz: 'Tartibni o\'zgartirib bo\'lmaydi', ru: 'Порядок менять нельзя', en: 'The order cannot be changed' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ular birga o'n besh mingni beradi, yumaloq son esa keyingi qo'shishni osonlashtiradi.",
      ru: 'Верно. Вместе они дают пятнадцать тысяч, а круглое число облегчает следующее сложение.',
      en: 'Correct. Together they give fifteen thousand, and a round number makes the next addition easy.',
    },
    wrong: [
      null,
      {
        uz: "Bu juft ham qo'shiladi, lekin yumaloq son bermaydi: o'n to'qqiz ming sakkiz yuz.",
        ru: 'Эта пара тоже складывается, но круглого числа не даёт: девятнадцать тысяч восемьсот.',
        en: 'That pair adds up too, but gives no round number: nineteen thousand eight hundred.',
      },
      {
        uz: "Bu juft besh ming ikki yuz beradi. Yumaloq emas, foydasi kam.",
        ru: 'Эта пара даёт пять тысяч двести. Не круглое, пользы мало.',
        en: 'That pair gives five thousand two hundred. Not round, so little gain.',
      },
      {
        uz: "Qo'shishda tartibni o'zgartirsa bo'ladi. Bugungi dars aynan shu haqda.",
        ru: 'В сложении порядок менять можно. Сегодняшний урок как раз об этом.',
        en: 'In addition the order may be changed. Today lesson is exactly about that.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Shart darvozasi ochildi va yuklar yig'uv maydoniga keldi.",
          "Uch aravada yuk bor: o'n to'rt ming sakkiz yuz, besh ming va ikki yuz kilogramm.",
          "Bit ularni berilgan tartibda qo'sha boshladi va hisob cho'zilib ketdi.",
          "Qaysi ikki sonni oldin qo'shgan qulay? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Ворота условия открылись, и грузы прибыли на сборочную площадку.',
          'В трёх тележках груз: четырнадцать тысяч восемьсот, пять тысяч и двести килограммов.',
          'Bit начал складывать их в данном порядке, и расчёт затянулся.',
          'Какие два числа удобнее сложить первыми? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The condition gate opened and the loads arrived at the assembly yard.',
          'Three carts carry the load: fourteen thousand eight hundred, five thousand and two hundred kilograms.',
          'Bit started adding them in the given order and the calculation dragged on.',
          'Which two numbers are convenient to add first? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: "O'rin almashtirish", ru: 'Перестановка', en: 'Swapping places' },
    title: {
      uz: 'O\'rni almashsa ham yig\'indi o\'sha',
      ru: 'Поменяли местами — сумма та же',
      en: 'Swap the places, the sum stays',
    },
    lead: {
      uz: "Qo'shiluvchilarning o'rni almashtirilsa ham yig'indi o'zgarmaydi.",
      ru: 'Если поменять слагаемые местами, сумма не изменится.',
      en: 'If the addends swap places, the sum does not change.',
    },
    note: {
      uz: 'Harflar bilan: z + x = x + z.',
      ru: 'Буквами: z + x = x + z.',
      en: 'In letters: z + x = x + z.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikdan ikki yozuvni olamiz. Bir ming to'rt yuz ellik yetti va yigirma uch ming besh yuz qirq uch.",
          "Ularni qo'shsak, yigirma besh ming chiqadi.",
          "Endi o'rinlarini almashtiramiz: yigirma uch ming besh yuz qirq uch va bir ming to'rt yuz ellik yetti.",
          "Natija yana yigirma besh ming. Demak qo'shiluvchilarning o'rni yig'indini o'zgartirmaydi.",
        ],
        ru: [
          'Возьмём из учебника две записи. Тысяча четыреста пятьдесят семь и двадцать три тысячи пятьсот сорок три.',
          'Если их сложить, получится двадцать пять тысяч.',
          'Теперь поменяем местами: двадцать три тысячи пятьсот сорок три и тысяча четыреста пятьдесят семь.',
          'Результат снова двадцать пять тысяч. Значит порядок слагаемых сумму не меняет.',
        ],
        en: [
          'Let us take two records from the textbook. One thousand four hundred and fifty seven and twenty three thousand five hundred and forty three.',
          'Adding them gives twenty five thousand.',
          'Now swap the places: twenty three thousand five hundred and forty three and one thousand four hundred and fifty seven.',
          'The result is twenty five thousand again. So the order of the addends does not change the sum.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Qaysi tenglik', ru: 'Какое равенство', en: 'Which equality' },
    title: {
      uz: 'Qaysi yozuv o\'rin almashtirish?',
      ru: 'Какая запись — перестановка?',
      en: 'Which record shows the swap?',
    },
    question: {
      uz: 'Qaysi tenglik o\'rin almashtirish xossasini ko\'rsatadi?',
      ru: 'Какое равенство показывает переместительное свойство?',
      en: 'Which equality shows the commutative property?',
    },
    options: [
      { uz: 'a + b = b + a', ru: 'a + b = b + a', en: 'a + b = b + a' },
      { uz: 'a + b = a - b', ru: 'a + b = a - b', en: 'a + b = a - b' },
      { uz: 'a - b = b - a', ru: 'a - b = b - a', en: 'a - b = b - a' },
      { uz: 'a + a = 2 · a', ru: 'a + a = 2 · a', en: 'a + a = 2 · a' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikkala tomonda ham o'sha qo'shiluvchilar, faqat o'rni almashgan.",
      ru: 'Верно. С обеих сторон те же слагаемые, только их порядок другой.',
      en: 'Correct. Both sides hold the same addends, only in a different order.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda amal o'zgargan: chapda qo'shish, o'ngda ayirish.",
        ru: 'Здесь изменилось действие: слева сложение, справа вычитание.',
        en: 'Here the action changed: addition on the left, subtraction on the right.',
      },
      {
        uz: "Ayirishda o'rin almashtirib bo'lmaydi: natija boshqacha chiqadi.",
        ru: 'В вычитании менять местами нельзя: результат будет другим.',
        en: 'In subtraction you cannot swap: the result comes out different.',
      },
      {
        uz: "Bu to'g'ri tenglik, lekin u ko'paytirish haqida, o'rin almashtirish haqida emas.",
        ru: 'Это верное равенство, но оно про умножение, а не про перестановку.',
        en: 'That is a true equality, but it is about multiplication, not about swapping.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Maydon panelida to'rtta tenglik chiqdi.",
          "O'rin almashtirish xossasida ikkala tomonda o'sha qo'shiluvchilar turadi.",
          "Qaysi tenglik uni ko'rsatadi? Javobni tanlang.",
        ],
        ru: [
          'На панели площадки появились четыре равенства.',
          'В переместительном свойстве с обеих сторон стоят одни и те же слагаемые.',
          'Какое равенство его показывает? Выбери ответ.',
        ],
        en: [
          'Four equalities appeared on the yard panel.',
          'In the commutative property both sides hold the same addends.',
          'Which equality shows it? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Guruhlash', ru: 'Группировка', en: 'Grouping' },
    title: {
      uz: 'Qaysi juftni oldin qo\'shamiz?',
      ru: 'Какую пару сложим первой?',
      en: 'Which pair do we add first?',
    },
    lead: {
      uz: "Qo'shiluvchilarni istalgan tartibda guruhlash mumkin: yig'indi o'zgarmaydi.",
      ru: 'Слагаемые можно группировать в любом порядке: сумма не изменится.',
      en: 'The addends may be grouped in any order: the sum does not change.',
    },
    note: {
      uz: 'Darslik yozuvi: a + b + d = (a + d) + b.',
      ru: 'Запись учебника: a + b + d = (a + d) + b.',
      en: 'The textbook record: a + b + d = (a + d) + b.',
    },
    audio: {
      intro: {
        uz: [
          "Darslik uchta sonni oladi: besh yuz, sakkiz yuz va besh yuz.",
          "Berilgan tartibda qo'shsak ham bo'ladi, lekin birinchi va uchinchi sonni birga olsak qulayroq.",
          "Besh yuz qo'shuv besh yuz bir mingni beradi. Bu yumaloq son.",
          "Endi sakkiz yuzni qo'shamiz: bir ming sakkiz yuz. Yig'indi o'zgarmadi, yo'l esa qisqardi.",
        ],
        ru: [
          'Учебник берёт три числа: пятьсот, восемьсот и пятьсот.',
          'Можно складывать и по порядку, но удобнее взять вместе первое и третье.',
          'Пятьсот плюс пятьсот дают тысячу. Это круглое число.',
          'Теперь прибавим восемьсот: тысяча восемьсот. Сумма не изменилась, а путь стал короче.',
        ],
        en: [
          'The textbook takes three numbers: five hundred, eight hundred and five hundred.',
          'They can be added in order, but it is easier to take the first and the third together.',
          'Five hundred plus five hundred makes one thousand. That is a round number.',
          'Now add eight hundred: one thousand eight hundred. The sum did not change and the path got shorter.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Guruhni tanlang', ru: 'Выбери группу', en: 'Choose the grouping' },
    title: {
      uz: 'Qaysi guruhlash qulay?',
      ru: 'Какая группировка удобнее?',
      en: 'Which grouping is convenient?',
    },
    question: {
      uz: '20400 + 600 + 50800. Qaysi guruhlash qulay?',
      ru: '20400 + 600 + 50800. Какая группировка удобнее?',
      en: '20400 + 600 + 50800. Which grouping is convenient?',
    },
    options: [
      { uz: '(20400 + 600) + 50800', ru: '(20400 + 600) + 50800', en: '(20400 + 600) + 50800' },
      { uz: '(20400 + 50800) + 600', ru: '(20400 + 50800) + 600', en: '(20400 + 50800) + 600' },
      { uz: '(600 + 50800) + 20400', ru: '(600 + 50800) + 20400', en: '(600 + 50800) + 20400' },
      { uz: 'Guruhlash mumkin emas', ru: 'Группировать нельзя', en: 'Grouping is not allowed' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Birinchi juft yigirma bir ming beradi, keyin qo'shish oson bo'ladi.",
      ru: 'Верно. Первая пара даёт двадцать одну тысячу, и дальше складывать легко.',
      en: 'Correct. The first pair gives twenty one thousand and the rest is easy.',
    },
    wrong: [
      null,
      {
        uz: "Bu juft yetmish bir ming ikki yuz beradi. To'g'ri, lekin yumaloq emas.",
        ru: 'Эта пара даёт семьдесят одну тысячу двести. Верно, но не круглое.',
        en: 'That pair gives seventy one thousand two hundred. Correct, but not round.',
      },
      {
        uz: "Bu juft ellik bir ming to'rt yuz beradi. U ham yumaloq emas.",
        ru: 'Эта пара даёт пятьдесят одну тысячу четыреста. Тоже не круглое.',
        en: 'That pair gives fifty one thousand four hundred. Not round either.',
      },
      {
        uz: "Qo'shishda guruhlash mumkin: yig'indi baribir o'zgarmaydi.",
        ru: 'В сложении группировать можно: сумма всё равно не изменится.',
        en: 'In addition grouping is allowed: the sum stays the same anyway.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Maydonga uchta yangi arava keldi: yigirma ming to'rt yuz, olti yuz va ellik ming sakkiz yuz.",
          "Yumaloq son beradigan juftni izlang.",
          "Qaysi guruhlash qulay? Javobni tanlang.",
        ],
        ru: [
          'На площадку пришли три новые тележки: двадцать тысяч четыреста, шестьсот и пятьдесят тысяч восемьсот.',
          'Ищи пару, которая даёт круглое число.',
          'Какая группировка удобнее? Выбери ответ.',
        ],
        en: [
          'Three new carts arrived at the yard: twenty thousand four hundred, six hundred and fifty thousand eight hundred.',
          'Look for the pair that gives a round number.',
          'Which grouping is convenient? Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Yumaloq son', ru: 'Круглое число', en: 'A round number' },
    title: {
      uz: 'Nega yumaloq son qulay?',
      ru: 'Почему круглое число удобно?',
      en: 'Why is a round number handy?',
    },
    lead: {
      uz: "Yumaloq songa qo'shish og'zaki bajariladi: ustun kerak bo'lmaydi.",
      ru: 'К круглому числу прибавляют устно: столбик не нужен.',
      en: 'Adding to a round number is done in the head: no column is needed.',
    },
    note: {
      uz: 'Shu sababli avval yumaloq beradigan juft izlanadi.',
      ru: 'Поэтому сначала ищут пару, дающую круглое число.',
      en: 'That is why we first look for a pair that gives a round number.',
    },
    audio: {
      intro: {
        uz: [
          "Maydondagi birinchi hisobga qaytamiz: o'n to'rt ming sakkiz yuz, besh ming va ikki yuz.",
          "Birinchi va uchinchi sonni birga olamiz: o'n besh ming chiqadi.",
          "Endi besh mingni qo'shamiz. Yumaloq songa qo'shish og'zaki bajariladi.",
          "Yigirma ming chiqdi. Bit uzoq hisoblagan yo'l shu tariqa ikki qadamga qisqardi.",
        ],
        ru: [
          'Вернёмся к первому расчёту на площадке: четырнадцать тысяч восемьсот, пять тысяч и двести.',
          'Возьмём вместе первое и третье число: получится пятнадцать тысяч.',
          'Теперь прибавим пять тысяч. К круглому числу прибавляют устно.',
          'Получилось двадцать тысяч. Долгий путь Bit сократился до двух шагов.',
        ],
        en: [
          'Back to the first calculation in the yard: fourteen thousand eight hundred, five thousand and two hundred.',
          'Take the first and the third together: that gives fifteen thousand.',
          'Now add five thousand. Adding to a round number is done in the head.',
          'That gives twenty thousand. The long path Bit took shrank to two steps.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Guruhlab qo\'shing',
      ru: 'Сложи с группировкой',
      en: 'Add with grouping',
    },
    question: {
      uz: '73000 + 22300 + 700. Yig\'indi qancha?',
      ru: '73000 + 22300 + 700. Чему равна сумма?',
      en: '73000 + 22300 + 700. What is the sum?',
    },
    answer: 96000,
    correctText: {
      uz: "To'g'ri. Yigirma ikki ming uch yuz va yetti yuz yigirma uch mingni beradi, keyin yetmish uch ming qo'shiladi.",
      ru: 'Верно. Двадцать две тысячи триста и семьсот дают двадцать три тысячи, потом прибавляем семьдесят три тысячи.',
      en: 'Correct. Twenty two thousand three hundred and seven hundred give twenty three thousand, then seventy three thousand is added.',
    },
    wrong: {
      uz: "Hali emas. Yumaloq son beradigan juftni toping va uni oldin qo'shing.",
      ru: 'Пока нет. Найди пару, дающую круглое число, и сложи её первой.',
      en: 'Not yet. Find the pair that gives a round number and add it first.',
    },
    hintAfter: {
      uz: "Ikkinchi va uchinchi son birga yigirma uch mingni beradi.",
      ru: 'Второе и третье число вместе дают двадцать три тысячи.',
      en: 'The second and the third number together give twenty three thousand.',
    },
    audio: {
      intro: {
        uz: [
          "Yangi hisob: yetmish uch ming, yigirma ikki ming uch yuz va yetti yuz.",
          "Yumaloq son beradigan juftni toping.",
          "Yig'indi qancha? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Новый расчёт: семьдесят три тысячи, двадцать две тысячи триста и семьсот.',
          'Найди пару, дающую круглое число.',
          'Чему равна сумма? Набери ответ и подтверди.',
        ],
        en: [
          'A new calculation: seventy three thousand, twenty two thousand three hundred and seven hundred.',
          'Find the pair that gives a round number.',
          'What is the sum? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'To\'rtta qo\'shiluvchi', ru: 'Четыре слагаемых', en: 'Four addends' },
    title: {
      uz: 'Ikki juftga ajratamiz',
      ru: 'Разбиваем на две пары',
      en: 'We split into two pairs',
    },
    lead: {
      uz: "Qo'shiluvchilar ko'p bo'lsa, ularni juftlarga ajratib olish mumkin.",
      ru: 'Если слагаемых много, их можно разбить на пары.',
      en: 'When there are many addends, they can be split into pairs.',
    },
    note: {
      uz: 'Har juft yumaloq son bersa, yakuniy qo\'shish oson bo\'ladi.',
      ru: 'Если каждая пара даёт круглое число, итоговое сложение становится лёгким.',
      en: 'If each pair gives a round number, the final addition becomes easy.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikda Nodira do'konda to'rt narsa uchun to'ladi.",
          "Sabzavot uchun o'n ikki ming, go'sht uchun o'ttiz to'rt ming besh yuz.",
          "Un uchun sakkiz ming, ko'katlar uchun besh ming besh yuz so'm.",
          "Birinchi va uchinchi son yigirma mingni, ikkinchi va to'rtinchisi qirq mingni beradi. Jami oltmish ming so'm.",
        ],
        ru: [
          'В учебнике Нодира платит в магазине за четыре покупки.',
          'За овощи двенадцать тысяч, за мясо тридцать четыре тысячи пятьсот.',
          'За муку восемь тысяч, за зелень пять тысяч пятьсот сумов.',
          'Первое и третье число дают двадцать тысяч, второе и четвёртое сорок тысяч. Всего шестьдесят тысяч сумов.',
        ],
        en: [
          'In the textbook Nodira pays for four purchases at a shop.',
          'Twelve thousand for vegetables, thirty four thousand five hundred for meat.',
          'Eight thousand for flour and five thousand five hundred sums for herbs.',
          'The first and the third give twenty thousand, the second and the fourth give forty thousand. Sixty thousand sums in all.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Yumaloq songacha',
      ru: 'До круглого числа',
      en: 'Up to a round number',
    },
    question: {
      uz: '69900 + 30000 + 100. Yig\'indi qancha?',
      ru: '69900 + 30000 + 100. Чему равна сумма?',
      en: '69900 + 30000 + 100. What is the sum?',
    },
    answer: 100000,
    correctText: {
      uz: "To'g'ri. Oltmish to'qqiz ming to'qqiz yuz va yuz yetmish mingni beradi, keyin o'ttiz ming qo'shiladi.",
      ru: 'Верно. Шестьдесят девять тысяч девятьсот и сто дают семьдесят тысяч, потом прибавляем тридцать тысяч.',
      en: 'Correct. Sixty nine thousand nine hundred and one hundred give seventy thousand, then thirty thousand is added.',
    },
    wrong: {
      uz: "Hali emas. Birinchi va uchinchi sonni birga oling: ular yumaloq son beradi.",
      ru: 'Пока нет. Возьми вместе первое и третье число: они дают круглое.',
      en: 'Not yet. Take the first and the third number together: they give a round one.',
    },
    hintAfter: {
      uz: "Oltmish to'qqiz ming to'qqiz yuzga yuzni qo'shsangiz, yetmish ming chiqadi.",
      ru: 'Если к шестидесяти девяти тысячам девятистам прибавить сто, выйдет семьдесят тысяч.',
      en: 'Adding one hundred to sixty nine thousand nine hundred gives seventy thousand.',
    },
    audio: {
      intro: {
        uz: [
          "Maydonda oxirgi uch arava qoldi: oltmish to'qqiz ming to'qqiz yuz, o'ttiz ming va yuz.",
          "Qaysi juft yumaloq son berishini toping.",
          "Yig'indi qancha? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'На площадке остались последние три тележки: шестьдесят девять тысяч девятьсот, тридцать тысяч и сто.',
          'Найди, какая пара даёт круглое число.',
          'Чему равна сумма? Набери ответ и подтверди.',
        ],
        en: [
          'The last three carts remain in the yard: sixty nine thousand nine hundred, thirty thousand and one hundred.',
          'Find which pair gives a round number.',
          'What is the sum? Type the answer and confirm.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Chegara', ru: 'Ограничение', en: 'The limit' },
    title: {
      uz: 'Ayirishda erkinlik yo\'q',
      ru: 'В вычитании свободы нет',
      en: 'Subtraction gives no freedom',
    },
    lead: {
      uz: "Bu ikki xossa faqat qo'shishga tegishli. Ayirish aralashsa, tartib saqlanadi.",
      ru: 'Эти два свойства относятся только к сложению. Если есть вычитание, порядок сохраняется.',
      en: 'These two properties belong to addition only. If subtraction is present, the order is kept.',
    },
    note: {
      uz: "Darslik: faqat qo'shish va ayirishdan iborat ifoda chapdan o'ngga bajariladi.",
      ru: 'Учебник: выражение только из сложения и вычитания выполняют слева направо.',
      en: 'The textbook: an expression of only additions and subtractions is done from left to right.',
    },
    audio: {
      intro: {
        uz: [
          "Maydonga aralash yozuv keldi: uch yuz sakson minus ikki yuz ellik qo'shuv ikki yuz minus yuz.",
          "Bu yerda qo'shish ham, ayirish ham bor.",
          "Darslik qoidasi: bunday ifoda chapdan o'ngga bajariladi.",
          "Uch yuz sakson minus ikki yuz ellik bir yuz o'ttiz, qo'shuv ikki yuz uch yuz o'ttiz, minus yuz ikki yuz o'ttiz.",
        ],
        ru: [
          'На площадку пришла смешанная запись: триста восемьдесят минус двести пятьдесят плюс двести минус сто.',
          'Здесь есть и сложение, и вычитание.',
          'Правило учебника: такое выражение выполняют слева направо.',
          'Триста восемьдесят минус двести пятьдесят это сто тридцать, плюс двести триста тридцать, минус сто двести тридцать.',
        ],
        en: [
          'A mixed record arrived at the yard: three hundred and eighty minus two hundred and fifty plus two hundred minus one hundred.',
          'There is both addition and subtraction here.',
          'The textbook rule: such an expression is done from left to right.',
          'Three hundred and eighty minus two hundred and fifty is one hundred and thirty, plus two hundred is three hundred and thirty, minus one hundred is two hundred and thirty.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Tartibni tanlang', ru: 'Выбери порядок', en: 'Choose the order' },
    title: {
      uz: 'Bu ifoda qanday bajariladi?',
      ru: 'Как выполняют это выражение?',
      en: 'How is this expression done?',
    },
    question: {
      uz: '380 - 250 + 200 - 100. Amallar qanday tartibda?',
      ru: '380 - 250 + 200 - 100. В каком порядке действия?',
      en: '380 - 250 + 200 - 100. In which order are the actions done?',
    },
    options: [
      { uz: "Chapdan o'ngga ketma-ket", ru: 'Слева направо по порядку', en: 'From left to right in turn' },
      { uz: "Avval barcha qo'shishlar", ru: 'Сначала все сложения', en: 'All the additions first' },
      { uz: 'Avval barcha ayirishlar', ru: 'Сначала все вычитания', en: 'All the subtractions first' },
      { uz: "Qulay juftlarni guruhlab", ru: 'Группируя удобные пары', en: 'By grouping convenient pairs' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ifodada ayirish bor, shuning uchun tartib saqlanadi: javob ikki yuz o'ttiz.",
      ru: 'Верно. В выражении есть вычитание, поэтому порядок сохраняется: ответ двести тридцать.',
      en: 'Correct. The expression has subtraction, so the order is kept: the answer is two hundred and thirty.',
    },
    wrong: [
      null,
      {
        uz: "Qo'shishlarni oldin bajarsak, natija o'zgarib ketadi. Ayirish bunga yo'l qo'ymaydi.",
        ru: 'Если сначала выполнить сложения, результат изменится. Вычитание этого не допускает.',
        en: 'Doing the additions first changes the result. Subtraction does not allow that.',
      },
      {
        uz: "Ayirishlarni yig'ib olib bo'lmaydi: har biri o'z o'rnida ishlaydi.",
        ru: 'Вычитания нельзя собрать вместе: каждое работает на своём месте.',
        en: 'The subtractions cannot be gathered together: each works in its own place.',
      },
      {
        uz: "Guruhlash faqat qo'shishda ishlaydi. Bu yerda ayirish ham bor.",
        ru: 'Группировка работает только в сложении. Здесь есть и вычитание.',
        en: 'Grouping works in addition only. Here there is subtraction as well.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Maydon panelida aralash ifoda turibdi.",
          "Unda qo'shish ham, ayirish ham bor.",
          "Amallar qanday tartibda bajariladi? Javobni tanlang.",
        ],
        ru: [
          'На панели площадки стоит смешанное выражение.',
          'В нём есть и сложение, и вычитание.',
          'В каком порядке выполняют действия? Выбери ответ.',
        ],
        en: [
          'A mixed expression stands on the yard panel.',
          'It contains both addition and subtraction.',
          'In which order are the actions done? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Ikki xossa va bitta chegara',
      ru: 'Два свойства и одно ограничение',
      en: 'Two properties and one limit',
    },
    lead: {
      uz: 'Qo\'shishda erkinlik bor, ayirishda esa yo\'q.',
      ru: 'В сложении есть свобода, в вычитании её нет.',
      en: 'Addition gives freedom, subtraction does not.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Birinchi xossa: qo'shiluvchilarning o'rni almashtirilsa ham yig'indi o'zgarmaydi.",
          "Ikkinchi xossa: qo'shiluvchilarni istalgan tartibda guruhlash mumkin.",
          "Chegara: bu erkinlik faqat qo'shishga tegishli. Ayirish aralashsa, amallar chapdan o'ngga bajariladi.",
        ],
        ru: [
          'Соберём правило. Первое свойство: от перестановки слагаемых сумма не меняется.',
          'Второе свойство: слагаемые можно группировать в любом порядке.',
          'Ограничение: эта свобода относится только к сложению. Если есть вычитание, действия идут слева направо.',
        ],
        en: [
          'Let us put the rule together. First property: swapping the addends does not change the sum.',
          'Second property: the addends may be grouped in any order.',
          'The limit: this freedom belongs to addition only. If subtraction is present, the actions go from left to right.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi juft?', ru: 'Какая пара?', en: 'Which pair?' },
    title: {
      uz: 'Qaysi juftni oldin olamiz?',
      ru: 'Какую пару возьмём первой?',
      en: 'Which pair do we take first?',
    },
    question: {
      uz: '2800 + 320 + 200. Qaysi juft qulay?',
      ru: '2800 + 320 + 200. Какая пара удобнее?',
      en: '2800 + 320 + 200. Which pair is convenient?',
    },
    options: [
      { uz: '2800 va 200', ru: '2800 и 200', en: '2800 and 200' },
      { uz: '2800 va 320', ru: '2800 и 320', en: '2800 and 320' },
      { uz: '320 va 200', ru: '320 и 200', en: '320 and 200' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ular uch mingni beradi, keyin uch yuz yigirma qo'shiladi: uch ming uch yuz yigirma.",
      ru: 'Верно. Они дают три тысячи, потом прибавляем триста двадцать: три тысячи триста двадцать.',
      en: 'Correct. They give three thousand, then three hundred and twenty is added: three thousand three hundred and twenty.',
    },
    wrong: [
      null,
      {
        uz: "Bu juft uch ming bir yuz yigirma beradi. To'g'ri, lekin yumaloq emas.",
        ru: 'Эта пара даёт три тысячи сто двадцать. Верно, но не круглое.',
        en: 'That pair gives three thousand one hundred and twenty. Correct, but not round.',
      },
      {
        uz: "Bu juft besh yuz yigirma beradi. U ham yumaloq emas.",
        ru: 'Эта пара даёт пятьсот двадцать. Тоже не круглое.',
        en: 'That pair gives five hundred and twenty. Not round either.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Maydonda yana uch arava turibdi: ikki ming sakkiz yuz, uch yuz yigirma va ikki yuz.",
          "Yumaloq son beradigan juftni izlang.",
          "Qaysi juft qulay? Javobni tanlang.",
        ],
        ru: [
          'На площадке снова три тележки: две тысячи восемьсот, триста двадцать и двести.',
          'Ищи пару, дающую круглое число.',
          'Какая пара удобнее? Выбери ответ.',
        ],
        en: [
          'Three carts stand in the yard again: two thousand eight hundred, three hundred and twenty and two hundred.',
          'Look for the pair that gives a round number.',
          'Which pair is convenient? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit xossani noto\'g\'ri qo\'lladi',
      ru: 'Bit применил свойство не там',
      en: 'Bit applied the property in the wrong place',
    },
    question: {
      uz: 'Bit yozuvida nima noto\'g\'ri?',
      ru: 'Что неверно в записи Bit?',
      en: 'What is wrong in Bit record?',
    },
    steps: [
      { uz: '900 - 300 + 100', ru: '900 - 300 + 100', en: '900 - 300 + 100' },
      { uz: 'Bit: 300 + 100 = 400', ru: 'Bit: 300 + 100 = 400', en: 'Bit: 300 + 100 = 400' },
      { uz: 'Bit: 900 - 400 = 500', ru: 'Bit: 900 - 400 = 500', en: 'Bit: 900 - 400 = 500' },
      { uz: 'Javob: 500', ru: 'Ответ: 500', en: 'Answer: 500' },
    ],
    options: [
      { uz: 'Ayirish bor, guruhlab bo\'lmaydi', ru: 'Есть вычитание, группировать нельзя', en: 'There is subtraction, grouping is not allowed' },
      { uz: 'Qo\'shish noto\'g\'ri bajarilgan', ru: 'Сложение выполнено неверно', en: 'The addition was done wrongly' },
      { uz: 'Sonlar noto\'g\'ri ko\'chirilgan', ru: 'Числа переписаны неверно', en: 'The numbers were copied wrongly' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Chapdan o'ngga borish kerak edi: to'qqiz yuz minus uch yuz olti yuz, qo'shuv yuz yetti yuz.",
      ru: 'Верно. Нужно было идти слева направо: девятьсот минус триста шестьсот, плюс сто семьсот.',
      en: 'Correct. It had to go from left to right: nine hundred minus three hundred is six hundred, plus one hundred is seven hundred.',
    },
    wrong: [
      null,
      {
        uz: "Uch yuz qo'shuv yuz haqiqatan to'rt yuz. Xato bu juftni umuman guruhlashda.",
        ru: 'Триста плюс сто действительно четыреста. Ошибка в том, что эту пару вообще сгруппировали.',
        en: 'Three hundred plus one hundred really is four hundred. The error is in grouping that pair at all.',
      },
      {
        uz: "Sonlar to'g'ri ko'chirilgan. Xato amallarning tartibida.",
        ru: 'Числа переписаны верно. Ошибка в порядке действий.',
        en: 'The numbers were copied correctly. The error is in the order of the actions.',
      },
      {
        uz: "To'g'ri javob yetti yuz. Besh yuz esa boshqa ifodaning javobi.",
        ru: 'Верный ответ семьсот. А пятьсот это ответ другого выражения.',
        en: 'The right answer is seven hundred. Five hundred is the answer to a different expression.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit yangi ifodani hisoblab, maydonga yubordi.",
          "Uning to'rt qatori ekranda.",
          "Nima noto'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Bit посчитал новое выражение и отправил на площадку.',
          'Его четыре строки на экране.',
          'Что неверно? Выбери ответ.',
        ],
        en: [
          'Bit worked out a new expression and sent it to the yard.',
          'His four lines are on the screen.',
          'What is wrong? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi yozuv maydonni yopadi?',
      ru: 'Какая запись закроет площадку?',
      en: 'Which record closes the yard?',
    },
    question: {
      uz: '14800 + 5000 + 200. Qaysi yozuv qulay va to\'g\'ri?',
      ru: '14800 + 5000 + 200. Какая запись удобна и верна?',
      en: '14800 + 5000 + 200. Which record is convenient and right?',
    },
    options: [
      { uz: '(14800 + 200) + 5000', ru: '(14800 + 200) + 5000', en: '(14800 + 200) + 5000' },
      { uz: '(14800 + 5000) + 200', ru: '(14800 + 5000) + 200', en: '(14800 + 5000) + 200' },
      { uz: '(5000 + 200) - 14800', ru: '(5000 + 200) - 14800', en: '(5000 + 200) - 14800' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yumaloq son oldin chiqdi va maydon hisobi yigirma ming bilan yopildi.",
      ru: 'Верно. Круглое число появилось первым, и учёт площадки закрылся на двадцати тысячах.',
      en: 'Correct. The round number came first and the yard ledger closed at twenty thousand.',
    },
    wrong: [
      null,
      {
        uz: "Javob to'g'ri chiqadi, lekin oraliq son yumaloq emas: yo'l uzunroq.",
        ru: 'Ответ выйдет верным, но промежуточное число не круглое: путь длиннее.',
        en: 'The answer comes out right, but the intermediate number is not round: a longer path.',
      },
      {
        uz: "Bu yerda ayirish paydo bo'lgan. Shartda esa faqat qo'shish bor edi.",
        ru: 'Здесь появилось вычитание. А в условии было только сложение.',
        en: 'Subtraction appeared here. But the problem had only addition.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Yig'uv maydoni uchta yozuvni ko'rib chiqmoqda.",
          "Yozuv ham to'g'ri, ham qulay bo'lishi kerak.",
          "Qaysi yozuv maydonni yopadi? Javobni tanlang.",
        ],
        ru: [
          'Сборочная площадка рассматривает три записи.',
          'Запись должна быть и верной, и удобной.',
          'Какая запись закроет площадку? Выбери ответ.',
        ],
        en: [
          'The assembly yard is looking at three records.',
          'The record must be both right and convenient.',
          'Which record closes the yard? Choose an answer.',
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
      uz: "Qoidani tanlang va xossalarning chegarasini tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь границы свойств.',
      en: 'Choose the rule and show that you understand the limits of the properties.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Guruhlash xossasi qayerda ishlaydi?',
      ru: 'Где работает свойство группировки?',
      en: 'Where does the grouping property work?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Faqat qo'shishda", ru: 'Только в сложении', en: 'In addition only' },
      { uz: "Qo'shish va ayirishda", ru: 'В сложении и вычитании', en: 'In addition and subtraction' },
      { uz: 'Har qanday ifodada', ru: 'В любом выражении', en: 'In any expression' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Ayirish qatnashsa, amallar chapdan o\'ngga bajariladi.',
      ru: 'Именно так. Если участвует вычитание, действия идут слева направо.',
      en: 'Exactly. When subtraction takes part, the actions go from left to right.',
    },
    reflectionWrong: {
      uz: "Hali emas. Bitning xatosini eslang: u ayirishli ifodada juftni guruhladi.",
      ru: 'Пока нет. Вспомни ошибку Bit: он сгруппировал пару в выражении с вычитанием.',
      en: 'Not yet. Remember Bit error: he grouped a pair in an expression with subtraction.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning uch qoidasi', ru: 'Три правила урока', en: 'The three rules of the lesson' },
    main: [
      { uz: "O'rin almashtirilsa ham yig'indi o'zgarmaydi.", ru: 'От перестановки слагаемых сумма не меняется.', en: 'Swapping the addends does not change the sum.' },
      { uz: "Qo'shiluvchilarni istalgan tartibda guruhlash mumkin.", ru: 'Слагаемые можно группировать в любом порядке.', en: 'The addends may be grouped in any order.' },
      { uz: 'Yumaloq son beradigan juftni oldin qo\'shamiz.', ru: 'Пару, дающую круглое число, складываем первой.', en: 'The pair that gives a round number is added first.' },
      { uz: "Ayirish aralashsa, amallar chapdan o'ngga bajariladi.", ru: 'Если есть вычитание, действия идут слева направо.', en: 'If subtraction is present, the actions go from left to right.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Hisob tezlatuvchi', ru: 'Ускоритель расчёта', en: 'Calculation accelerator' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: "Yumaloq son ovchisi", ru: 'Охотник за круглыми числами', en: 'Round number hunter' },
        text: { uz: "Siz qulay juftni ishonchli topasiz.", ru: 'Ты уверенно находишь удобную пару.', en: 'You find the convenient pair with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Maydon xodimi', ru: 'Сотрудник площадки', en: 'Yard clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Maydon yopildi. Endi markaz xabarlarni saralaydi: qaysi biri rost, qaysi biri yolg'on.",
      ru: 'Площадка закрыта. Теперь центр сортирует сообщения: какое истинно, а какое ложно.',
      en: 'The yard is closed. Now the centre sorts the messages: which are true and which are false.',
    },
    audio: {
      intro: {
        uz: [
          "Yig'uv maydoni yopildi: barcha aravalar hisobga olindi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Guruhlash xossasi qayerda ishlaydi? Javobni tanlang.",
        ],
        ru: [
          'Сборочная площадка закрыта: все тележки учтены.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Где работает свойство группировки? Выбери ответ.',
        ],
        en: [
          'The assembly yard is closed: every cart is accounted for.',
          'One question is left. Choose the rule and claim your title.',
          'Where does the grouping property work? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — QO'SHILUVCHILAR QATORI: uchta plita va ular ustidagi
// yoy. Yoy qaysi juftni birga olayotganini ko'rsatadi, natija esa pastda
// chiqadi. Shunda "guruhlash" ko'z bilan ko'rinadi.
// ---------------------------------------------------------------------------

// s0, s14: yig'uv maydoni (to'q sahna).
const YardBoard = ({ grouped }) => {
  const t = useT();
  const values = ['14800', '5000', '200'];
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d48panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d48panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: "YIG'UV MAYDONI", ru: 'СБОРОЧНАЯ ПЛОЩАДКА', en: 'ASSEMBLY YARD' })}
      </text>

      {values.map((value, index) => {
        const lit = grouped && index !== 1;
        return (
          <g key={value}>
            <rect
              x={92 + index * 250}
              y="86"
              width="216"
              height="86"
              rx="14"
              fill={lit ? 'rgba(149,201,61,.20)' : 'rgba(121,211,218,.12)'}
              stroke={lit ? T.lime : 'rgba(144,228,235,.4)'}
              strokeWidth={lit ? 2.4 : 1.6}
            />
            <text x={200 + index * 250} y="118" textAnchor="middle" fill="#9DE3E7" fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
              {`${index + 1} ${t({ uz: 'arava', ru: 'тележка', en: 'cart' })}`}
            </text>
            <text x={200 + index * 250} y="152" textAnchor="middle" fill="#EAF9FB" fontSize="28" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {value}
            </text>
          </g>
        );
      })}

      {grouped && (
        <path d="M200 178 C200 206, 700 206, 700 178" fill="none" stroke={T.lime} strokeWidth="2.6" strokeDasharray="7 6" />
      )}

      <rect
        x="92"
        y="212"
        width="716"
        height="52"
        rx="14"
        fill="rgba(1,13,22,.5)"
        stroke={grouped ? 'rgba(149,201,61,.5)' : 'rgba(144,228,235,.22)'}
        strokeWidth="1.5"
        strokeDasharray={grouped ? undefined : '9 7'}
      />
      <text
        x="450"
        y="244"
        textAnchor="middle"
        fill={grouped ? '#EAF9FB' : 'rgba(157,227,231,.65)'}
        fontSize={grouped ? 22 : 15}
        fontWeight="800"
        fontFamily={grouped ? 'JetBrains Mono, monospace' : 'Manrope, sans-serif'}
      >
        {grouped
          ? '(14800 + 200) + 5000 = 20000'
          : t({ uz: 'qulay juft hali tanlanmagan', ru: 'удобная пара ещё не выбрана', en: 'the convenient pair is not chosen yet' })}
      </text>
    </FitSvg>
  );
};

// s1..s12: qo'shiluvchilar qatori va guruhlash yoyi.
// `pair` — birga olinadigan ikki indeks, `result` — juftning yig'indisi.
const GroupBoard = ({ values, pair = null, result = null, total = null, frame = 9 }) => {
  const t = useT();
  const width = 660;
  const cardW = 168;
  const gap = 22;
  const totalW = values.length * cardW + (values.length - 1) * gap;
  const x0 = (width - totalW) / 2;
  const centreOf = (index) => x0 + index * (cardW + gap) + cardW / 2;
  return (
    <FitSvg viewBox={`0 0 ${width} 220`}>
      {values.map((value, index) => {
        const lit = pair !== null && pair.includes(index) && frame >= 2;
        return (
          <g key={index}>
            <rect
              x={x0 + index * (cardW + gap)}
              y={40}
              width={cardW}
              height={68}
              rx="14"
              fill={lit ? 'rgba(149,201,61,.22)' : T.cyanSoft}
              stroke={lit ? T.lime : T.cyan}
              strokeWidth={lit ? 2.6 : 1.8}
            />
            <text
              x={centreOf(index)}
              y={82}
              textAnchor="middle"
              fill={lit ? '#4C6B18' : T.cyan}
              fontSize="21"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {value}
            </text>
          </g>
        );
      })}

      {pair !== null && frame >= 2 && (
        <path
          d={`M${centreOf(pair[0])} 116 C${centreOf(pair[0])} 142, ${centreOf(pair[1])} 142, ${centreOf(pair[1])} 116`}
          fill="none"
          stroke={T.lime}
          strokeWidth="2.6"
        />
      )}

      {result !== null && frame >= 3 && (
        <g>
          <rect x={(width - 300) / 2} y={148} width={300} height={40} rx="12" fill="rgba(149,201,61,.18)" stroke={T.lime} strokeWidth="1.8" />
          <text x={width / 2} y={175} textAnchor="middle" fill="#4C6B18" fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {result}
          </text>
        </g>
      )}
      {total !== null && frame >= 4 && (
        <Caption x={width / 2} y={208} text={`${t({ uz: 'jami', ru: 'всего', en: 'in all' })}: ${total}`} tone={T.success} />
      )}
    </FitSvg>
  );
};

// s1: o'rin almashtirish — ikki yozuv, bitta natija.
const SwapBoard = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 660 200">
      <g opacity={frame >= 1 ? 1 : 0.24}>
        <Plate x={60} y={30} w={200} h={56} text="1457" kind="known" size={20} />
        <Plate x={260} y={30} w={40} h={56} text="+" kind="sign" size={22} />
        <Plate x={300} y={30} w={200} h={56} text="23543" kind="known" size={20} />
        <Plate x={500} y={30} w={40} h={56} text="=" kind="sign" size={22} />
        <text x={600} y={66} textAnchor="middle" fill={T.success} fontSize="21" fontWeight="800" fontFamily="JetBrains Mono, monospace">25000</text>
      </g>
      <g opacity={frame >= 2 ? 1 : 0.24}>
        <Plate x={60} y={104} w={200} h={56} text="23543" kind="known" size={20} />
        <Plate x={260} y={104} w={40} h={56} text="+" kind="sign" size={22} />
        <Plate x={300} y={104} w={200} h={56} text="1457" kind="known" size={20} />
        <Plate x={500} y={104} w={40} h={56} text="=" kind="sign" size={22} />
        <text x={600} y={140} textAnchor="middle" fill={T.success} fontSize="21" fontWeight="800" fontFamily="JetBrains Mono, monospace">25000</text>
      </g>
      {frame >= 3 && (
        <Caption
          x={330}
          y={186}
          text={t({ uz: "o'rin almashdi, yig'indi o'sha", ru: 'места поменялись, сумма та же', en: 'the places swapped, the sum is the same' })}
          tone={T.ink2}
        />
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
          head: t({ uz: "O'rin almashtirish", ru: 'Перестановка', en: 'Swapping' }),
          body: t({ uz: "qo'shiluvchilarning o'rni yig'indini o'zgartirmaydi", ru: 'порядок слагаемых не меняет сумму', en: 'the order of the addends does not change the sum' }),
          formula: 'a + b = b + a',
        },
        {
          tone: T.accent,
          head: t({ uz: 'Guruhlash', ru: 'Группировка', en: 'Grouping' }),
          body: t({ uz: "yumaloq son beradigan juftni oldin qo'shamiz", ru: 'пару, дающую круглое число, складываем первой', en: 'the pair giving a round number is added first' }),
          formula: '(a + d) + b',
        },
        {
          tone: T.warn,
          head: t({ uz: 'Chegara', ru: 'Ограничение', en: 'The limit' }),
          body: t({ uz: "ayirish aralashsa, amallar chapdan o'ngga bajariladi", ru: 'если есть вычитание, действия идут слева направо', en: 'if subtraction is present, the actions go left to right' }),
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
          <span>LUMO CITY · BOSHQARUV MARKAZI · YIG'UV MAYDONI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'GURUHLANDI' : 'HISOB'}
          </span>
        </div>
        <div className="hero-body">
          <YardBoard grouped={solved} />
        </div>
        <div className="d48-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'think'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => <RevealScreen {...props} ratio="66 / 20" figure={({ frame }) => <SwapBoard frame={frame} />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="78 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['a + b = b + a', 'a + b = a - b', 'a - b = b - a', 'a + a = 2 · a']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={780}
        cardW={176}
        cardH={84}
        gap={16}
        top={30}
        size={17}
      />
    )}
  />
);
const Screen3 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 22"
    figure={({ frame }) => <GroupBoard values={['500', '800', '500']} pair={[0, 2]} result="500 + 500 = 1000" total="1800" frame={frame} />}
  />
);
const Screen4 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 22"
    figure={({ solved }) => (
      <GroupBoard
        values={['20400', '600', '50800']}
        pair={solved ? [0, 1] : null}
        result={solved ? '20400 + 600 = 21000' : null}
        total={solved ? '71800' : null}
        frame={solved ? 9 : 1}
      />
    )}
  />
);
const Screen5 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 22"
    figure={({ frame }) => <GroupBoard values={['14800', '5000', '200']} pair={[0, 2]} result="14800 + 200 = 15000" total="20000" frame={frame} />}
  />
);
const Screen6 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 22"
    figure={({ solved }) => (
      <GroupBoard
        values={['73000', '22300', '700']}
        pair={[1, 2]}
        result="22300 + 700 = 23000"
        total={solved ? '96000' : null}
        frame={solved ? 9 : 3}
      />
    )}
  />
);
const Screen7 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 15"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: '1-JUFT', ru: '1 ПАРА', en: 'PAIR 1' }), expr: '12000 + 8000 = 20000', kind: 'mid' },
            { label: t({ uz: '2-JUFT', ru: '2 ПАРА', en: 'PAIR 2' }), expr: '34500 + 5500 = 40000', kind: 'mid' },
            { label: t({ uz: 'JAMI', ru: 'ВСЕГО', en: 'IN ALL' }), expr: '20000 + 40000 = 60000', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen8 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 22"
    figure={({ solved }) => (
      <GroupBoard
        values={['69900', '30000', '100']}
        pair={[0, 2]}
        result="69900 + 100 = 70000"
        total={solved ? '100000' : null}
        frame={solved ? 9 : 3}
      />
    )}
  />
);
const Screen9 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 15"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: '1-AMAL', ru: '1 ДЕЙСТВИЕ', en: 'ACTION 1' }), expr: '380 - 250 = 130', kind: 'mid' },
            { label: t({ uz: '2-AMAL', ru: '2 ДЕЙСТВИЕ', en: 'ACTION 2' }), expr: '130 + 200 = 330', kind: 'mid' },
            { label: t({ uz: '3-AMAL', ru: '3 ДЕЙСТВИЕ', en: 'ACTION 3' }), expr: '330 - 100 = 230', kind: 'final' },
          ]}
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
      ratio="66 / 15"
      figure={({ solved }) => (
        <StepRows
          frame={solved ? 9 : 1}
          rows={[
            { label: t({ uz: 'IFODA', ru: 'ВЫРАЖЕНИЕ', en: 'EXPRESSION' }), expr: '380 - 250 + 200 - 100', kind: 'mid' },
            { label: t({ uz: 'TARTIB', ru: 'ПОРЯДОК', en: 'ORDER' }), expr: solved ? '130 · 330 · 230' : '?', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="66 / 22"
    figure={({ solved }) => (
      <GroupBoard
        values={['2800', '320', '200']}
        pair={solved ? [0, 2] : null}
        result={solved ? '2800 + 200 = 3000' : null}
        total={solved ? '3320' : null}
        frame={solved ? 9 : 1}
      />
    )}
  />
);
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
          badIndex={1}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Ifodada qanday amallar bor? Guruhlash ularning hammasida ishlaydimi?',
            ru: 'Какие действия в выражении? Работает ли группировка со всеми из них?',
            en: 'Which actions are in the expression? Does grouping work with all of them?',
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
        records={['(14800 + 200) + 5000', '(14800 + 5000) + 200', '(5000 + 200) - 14800']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={216}
        cardH={92}
        gap={22}
        top={34}
        size={15}
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
.d48-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d48-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars48(props) {
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
