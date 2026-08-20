// ============================================================================
// 4-SINF · Dars 20 · Kasrlarni qo'shish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 148-151-betlar.
//   148-bet: butun to'rtburchakda 36 katak; ko'k qism 9/36, sariq 15/36,
//            qizil 12/36; 9/36 + 15/36 = 24/36, 15/36 + 12/36 = 27/36 va
//            9/36 + 15/36 + 12/36 = 36/36 = 1;
//            QOIDA — "bir xil maxrajli kasrlarni qo'shish uchun ularning
//            suratlarini qo'shish, maxrajni esa o'zgartirmasdan qoldirish kerak";
//   149-bet: 2/8 + 4/8, 3/4 + 1/4, 3/12 + 6/12 kabi mashqlar; operator tushdan
//            oldin 2/4, tushdan keyin 1/4 ishni bajardi; Shahnoza birinchi
//            haftada 2/7, ikkinchi haftada 3/7 kitobni o'qidi;
//   151-bet: qo'shishni sonlar o'qida tushuntirish, 2/9 va 5/9.
//
// Syujet: Lumo City taqsimlash markazi, ombor saralash tasmasi
// (SYUJET_4SINF.md, 3-blok).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Yangi mexanika: CellFill — bola qo'shiluvchi ulushlarni tasmada o'zi
// bo'yaydi. Maxraj o'zgarmasligi shu yerda ko'z bilan ko'rinadi: kataklar
// soni bir xil qoladi, faqat bo'yalganlari ko'payadi.
// ============================================================================
import {
  CellFill, ChoiceScreen, FitSvg, FractionBar, FractionGlyph, FractionRay,
  KIT_STYLES, RevealScreen, RuleRows, SummaryScreen, T,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'fraction-add-4-20-v2',
  slug: 'dars20-kasrlarni-qoshish',
  lessonTitle: {
    uz: "20-dars. Kasrlarni qo'shish",
    ru: 'Урок 20. Сложение дробей',
    en: 'Lesson 20. Adding fractions',
  },
  skillTags: ['fraction', 'addition', 'same_denominator', 'whole', 'number_ray'],
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

const COUNT_LABEL = {
  uz: "Bo'yalgan katak:",
  ru: 'Закрашено клеток:',
  en: 'Cells shaded:',
};
const CONFIRM = { uz: 'Tayyor', ru: 'Готово', en: 'Done' };

const CONTENT = {
  // -------------------------------------------------------------------------
  s0: {
    eyebrow: { uz: 'Saralash tasmasi', ru: 'Сортировочная лента', en: 'The sorting belt' },
    title: {
      uz: 'Ko\'k va sariq qismlar birga',
      ru: 'Синяя и жёлтая части вместе',
      en: 'The blue and the yellow parts together',
    },
    question: {
      uz: "Butun tasmada 36 katak. Ko'k va sariq qismlar birga qanday kasr beradi?",
      ru: 'Во всей ленте 36 клеток. Какую дробь дают синяя и жёлтая части вместе?',
      en: 'The whole belt has 36 cells. Which fraction do the blue and yellow parts give together?',
    },
    options: [
      { uz: '24/36', ru: '24/36', en: '24/36' },
      { uz: '24/72', ru: '24/72', en: '24/72' },
      { uz: '36/24', ru: '36/24', en: '36/24' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'qqiz katak va o'n besh katak birga yigirma to'rtta katak beradi. Tasma esa baribir o'ttiz oltita katakdan iborat.",
      ru: 'Верно. Девять клеток и пятнадцать клеток вместе дают двадцать четыре клетки. А лента по-прежнему состоит из тридцати шести клеток.',
      en: 'Correct. Nine cells and fifteen cells together give twenty four cells. And the belt still consists of thirty six cells.',
    },
    wrong: [
      null,
      {
        uz: "Maxrajlar qo'shilgan. Lekin tasma ikki barobar uzaymadi, kataklar soni o'ttiz oltita bo'lib qoldi.",
        ru: 'Знаменатели сложили. Но лента не стала вдвое длиннее, клеток осталось тридцать шесть.',
        en: 'The denominators were added. But the belt did not get twice as long; there are still thirty six cells.',
      },
      {
        uz: "Sonlar joyi almashgan. Chiziq ostiga hamma kataklar soni, ustiga esa olinganlari yoziladi.",
        ru: 'Числа поменялись местами. Под чертой число всех клеток, над чертой число взятых.',
        en: 'The numbers swapped places. All the cells go below the line and the taken ones above it.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          'Salom! Biz taqsimlash markazining ombor tasmasidamiz.',
          "Tasma o'ttiz oltita teng katakka bo'lingan. Har katak bitta yashikni tashiydi.",
          "Ko'k zonada to'qqizta katak, sariq zonada o'n beshta, qizil zonada o'n ikkita.",
          "Boshqaruv markazi ko'k va sariq zonalar birga butunning qanday qismini egallashini bilmoqchi.",
        ],
        ru: [
          'Привет! Мы на складской ленте распределительного центра.',
          'Лента разделена на тридцать шесть равных клеток. Каждая клетка несёт один ящик.',
          'В синей зоне девять клеток, в жёлтой пятнадцать, в красной двенадцать.',
          'Центр управления хочет знать, какую часть целого занимают синяя и жёлтая зоны вместе.',
        ],
        en: [
          'Hello! We are at the warehouse belt of the distribution centre.',
          'The belt is divided into thirty six equal cells. Each cell carries one crate.',
          'The blue zone has nine cells, the yellow one fifteen and the red one twelve.',
          'The control centre wants to know what part of the whole the blue and yellow zones take together.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s1: {
    eyebrow: { uz: 'Ulushlarni birlashtirish', ru: 'Объединение долей', en: 'Joining the shares' },
    title: {
      uz: 'Kataklar qo\'shiladi, tasma o\'zgarmaydi',
      ru: 'Клетки складываются, лента не меняется',
      en: 'The cells add up, the belt stays the same',
    },
    lead: {
      uz: 'Ikkita zona qo\'shilganda kataklar soni ortadi, butun esa o\'sha butun.',
      ru: 'При объединении двух зон число клеток растёт, а целое остаётся тем же.',
      en: 'Joining two zones increases the cell count while the whole stays the whole.',
    },
    note: {
      uz: '9/36 + 15/36 = 24/36. Maxraj o\'ttiz olti bo\'lib qoldi.',
      ru: '9/36 + 15/36 = 24/36. Знаменатель остался тридцатью шестью.',
      en: '9/36 + 15/36 = 24/36. The denominator stayed thirty six.',
    },
    audio: {
      intro: {
        uz: [
          "Ko'k zona butunning o'ttiz oltidan to'qqiz qismi.",
          "Sariq zona esa o'ttiz oltidan o'n besh qismi.",
          "Ularni birlashtiramiz. To'qqiz katak va o'n besh katak birga yigirma to'rt katak bo'ladi.",
          "Natija o'ttiz oltidan yigirma to'rt. E'tibor bering: kataklar kattaligi o'zgarmadi, shuning uchun maxraj ham o'zgarmadi.",
        ],
        ru: [
          'Синяя зона это девять тридцать шестых целого.',
          'А жёлтая зона это пятнадцать тридцать шестых.',
          'Объединим их. Девять клеток и пятнадцать клеток вместе дают двадцать четыре клетки.',
          'Результат двадцать четыре тридцать шестых. Обрати внимание: величина клеток не изменилась, поэтому и знаменатель остался тем же.',
        ],
        en: [
          'The blue zone is nine thirty sixths of the whole.',
          'The yellow zone is fifteen thirty sixths.',
          'Let us join them. Nine cells and fifteen cells together make twenty four cells.',
          'The result is twenty four thirty sixths. Notice that the size of a cell did not change, so the denominator did not change either.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s2: {
    eyebrow: { uz: 'Tasmani bo\'yang', ru: 'Закрась ленту', en: 'Shade the belt' },
    title: {
      uz: 'Yetishmagan ulushlarni o\'zingiz bo\'yang',
      ru: 'Закрась недостающие доли сам',
      en: 'Shade the missing shares yourself',
    },
    question: {
      uz: "2/8 ga 4/8 qo'shiladi. Yana nechta katakni bo'yash kerak?",
      ru: 'К 2/8 прибавляют 4/8. Сколько клеток надо закрасить ещё?',
      en: '4/8 is added to 2/8. How many more cells must be shaded?',
    },
    parts: 8,
    preset: 2,
    add: 4,
    countLabel: COUNT_LABEL,
    confirm: CONFIRM,
    correctText: {
      uz: "To'g'ri. Ikki katakka to'rt katak qo'shildi, jami oltita. Sakkizdan olti. Kataklar soni sakkizta bo'lib qoldi.",
      ru: 'Верно. К двум клеткам добавили четыре, всего шесть. Шесть восьмых. Число клеток осталось восемь.',
      en: 'Correct. Four cells were added to two, six in all. Six eighths. The number of cells stayed eight.',
    },
    wrongCount: {
      uz: "Bo'yalgan kataklar soni to'g'ri kelmadi. Qo'shiluvchi sakkizdan to'rt, demak aynan to'rtta katak kerak.",
      ru: 'Число закрашенных клеток не совпало. Слагаемое четыре восьмых, значит нужны ровно четыре клетки.',
      en: 'The number of shaded cells does not match. The addend is four eighths, so exactly four cells are needed.',
    },
    audio: {
      intro: {
        uz: [
          "Tasmada sakkizta teng katak bor. Ikkitasi allaqachon to'ldirilgan.",
          "Unga sakkizdan to'rt qo'shish kerak.",
          "Kerakli kataklarni bosib bo'yang, keyin Tayyor tugmasini bosing.",
        ],
        ru: [
          'На ленте восемь равных клеток. Две уже заполнены.',
          'К ним нужно прибавить четыре восьмых.',
          'Закрась нужные клетки нажатием, потом нажми кнопку Готово.',
        ],
        en: [
          'The belt has eight equal cells. Two of them are already filled.',
          'Four eighths must be added to them.',
          'Shade the cells you need by tapping, then press the Done button.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s3: {
    eyebrow: { uz: 'Qo\'shish qoidasi', ru: 'Правило сложения', en: 'The addition rule' },
    title: {
      uz: 'Suratlar qo\'shiladi, maxraj o\'zgarmaydi',
      ru: 'Числители складываются, знаменатель не меняется',
      en: 'The numerators add up, the denominator stays',
    },
    lead: {
      uz: 'Biz bir xil kattalikdagi ulushlarni sanayapmiz, shuning uchun ulush nomi o\'zgarmaydi.',
      ru: 'Мы считаем доли одной и той же величины, поэтому название доли не меняется.',
      en: 'We are counting shares of one and the same size, so the name of the share does not change.',
    },
    note: {
      uz: "Bir xil maxrajli kasrlarni qo'shish uchun suratlarni qo'shamiz, maxrajni o'zgartirmaymiz.",
      ru: 'Чтобы сложить дроби с одинаковыми знаменателями, складываем числители, а знаменатель не меняем.',
      en: 'To add fractions with the same denominator we add the numerators and leave the denominator alone.',
    },
    audio: {
      intro: {
        uz: [
          "Nima uchun maxraj o'zgarmaydi? Sababi oddiy.",
          "Ikkita sakkizdan bir va to'rtta sakkizdan bir — bularning hammasi bir xil kattalikdagi ulushlar.",
          "Ikki dona va to'rt dona birga olti dona bo'ladi. Ulush nomi esa o'sha, sakkizdan bir.",
          "Shuning uchun qoida shunday. Suratlarni qo'shamiz, maxrajni esa o'zgartirmasdan qoldiramiz.",
        ],
        ru: [
          'Почему знаменатель не меняется? Причина простая.',
          'Две восьмых доли и четыре восьмых доли это доли одной и той же величины.',
          'Две штуки и четыре штуки вместе дают шесть штук. А название доли остаётся тем же, одна восьмая.',
          'Поэтому правило такое. Складываем числители, а знаменатель оставляем без изменений.',
        ],
        en: [
          'Why does the denominator not change? The reason is simple.',
          'Two eighth-shares and four eighth-shares are shares of one and the same size.',
          'Two items and four items together make six items. And the name of the share stays the same, one eighth.',
          'So the rule is this. Add the numerators and leave the denominator unchanged.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s4: {
    eyebrow: { uz: 'Butun hosil bo\'ldi', ru: 'Получилось целое', en: 'A whole appeared' },
    title: {
      uz: '3/4 ga 1/4 qo\'shsak nima chiqadi?',
      ru: 'Что получится, если к 3/4 прибавить 1/4?',
      en: 'What comes out if we add 1/4 to 3/4?',
    },
    question: {
      uz: 'Yig\'indini tanlang.',
      ru: 'Выбери сумму.',
      en: 'Choose the sum.',
    },
    options: [
      { uz: '4/4', ru: '4/4', en: '4/4' },
      { uz: '4/8', ru: '4/8', en: '4/8' },
      { uz: '3/8', ru: '3/8', en: '3/8' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch qo'shildi bir teng to'rt, maxraj esa to'rt bo'lib qoldi. To'rtdan to'rt bitta butunga teng.",
      ru: 'Верно. Три плюс один равно четырём, а знаменатель остался четырьмя. Четыре четвёртых равны одному целому.',
      en: 'Correct. Three plus one is four, and the denominator stayed four. Four quarters equal one whole.',
    },
    wrong: [
      null,
      {
        uz: "Maxrajlar qo'shilgan. Lekin to'rtburchak ikki barobar bo'linmadi, u baribir to'rtta katakdan iborat.",
        ru: 'Знаменатели сложили. Но прямоугольник не разделили вдвое чаще, в нём по-прежнему четыре клетки.',
        en: 'The denominators were added. But the rectangle was not split twice as finely; it still has four cells.',
      },
      {
        uz: "Bu yerda ham maxraj qo'shilgan, ham surat o'zgarmagan. Qo'shishda faqat suratlar qo'shiladi.",
        ru: 'Здесь и знаменатель сложили, и числитель не изменили. При сложении складываются только числители.',
        en: 'Here the denominator was added and the numerator left alone. In addition only the numerators are added.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ombor operatori tushdan oldin ishning to'rtdan uch qismini bajardi.",
          "Tushdan keyin yana to'rtdan bir qismini bajardi.",
          'Bir kunda qancha ish bajarilganini toping.',
        ],
        ru: [
          'Оператор склада до обеда выполнил три четвёртых работы.',
          'После обеда он выполнил ещё одну четвёртую.',
          'Найди, какой объём работы выполнен за день.',
        ],
        en: [
          'The warehouse operator did three quarters of the work before lunch.',
          'After lunch he did one more quarter.',
          'Find how much of the work was done in one day.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s5: {
    eyebrow: { uz: 'Uchta zona birga', ru: 'Три зоны вместе', en: 'Three zones together' },
    title: {
      uz: 'Hamma zonalar birga butun beradi',
      ru: 'Все зоны вместе дают целое',
      en: 'All the zones together give the whole',
    },
    lead: {
      uz: 'Surat maxrajga yetganda kasr butunga aylanadi.',
      ru: 'Когда числитель доходит до знаменателя, дробь становится целым.',
      en: 'When the numerator reaches the denominator the fraction becomes a whole.',
    },
    note: {
      uz: '9/36 + 15/36 + 12/36 = 36/36 = 1.',
      ru: '9/36 + 15/36 + 12/36 = 36/36 = 1.',
      en: '9/36 + 15/36 + 12/36 = 36/36 = 1.',
    },
    audio: {
      intro: {
        uz: [
          "Endi uchta zonani ham birlashtiramiz.",
          "To'qqiz katak, o'n besh katak va o'n ikki katak.",
          "To'qqiz qo'shildi o'n besh qo'shildi o'n ikki teng o'ttiz olti.",
          "Bu o'ttiz oltidan o'ttiz olti, ya'ni bitta butun tasma. Yig'indi maxrajga yetdi va butun hosil bo'ldi.",
        ],
        ru: [
          'Теперь объединим все три зоны.',
          'Девять клеток, пятнадцать клеток и двенадцать клеток.',
          'Девять плюс пятнадцать плюс двенадцать равно тридцати шести.',
          'Это тридцать шесть тридцать шестых, то есть одна целая лента. Сумма дошла до знаменателя, и получилось целое.',
        ],
        en: [
          'Now let us join all three zones.',
          'Nine cells, fifteen cells and twelve cells.',
          'Nine plus fifteen plus twelve is thirty six.',
          'That is thirty six thirty sixths, one whole belt. The sum reached the denominator and a whole appeared.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s6: {
    eyebrow: { uz: 'Butungacha', ru: 'До целого', en: 'Up to the whole' },
    title: {
      uz: 'Tasmani butunga to\'ldiring',
      ru: 'Дополни ленту до целого',
      en: 'Fill the belt up to the whole',
    },
    question: {
      uz: "3/12 ga 9/12 qo'shiladi. Nechta katakni bo'yash kerak?",
      ru: 'К 3/12 прибавляют 9/12. Сколько клеток надо закрасить?',
      en: '9/12 is added to 3/12. How many cells must be shaded?',
    },
    parts: 12,
    preset: 3,
    add: 9,
    countLabel: COUNT_LABEL,
    confirm: CONFIRM,
    correctText: {
      uz: "To'g'ri. Uch qo'shildi to'qqiz teng o'n ikki. O'n ikkidan o'n ikki bitta butun tasmaga teng.",
      ru: 'Верно. Три плюс девять равно двенадцати. Двенадцать двенадцатых равны одной целой ленте.',
      en: 'Correct. Three plus nine is twelve. Twelve twelfths equal one whole belt.',
    },
    wrongCount: {
      uz: "Bo'yalgan kataklar soni to'g'ri kelmadi. Qo'shiluvchi o'n ikkidan to'qqiz, demak to'qqizta katak kerak.",
      ru: 'Число закрашенных клеток не совпало. Слагаемое девять двенадцатых, значит нужны девять клеток.',
      en: 'The number of shaded cells does not match. The addend is nine twelfths, so nine cells are needed.',
    },
    audio: {
      intro: {
        uz: [
          "Tasma o'n ikkita teng katakka bo'lingan. Uchtasi to'ldirilgan.",
          "Unga o'n ikkidan to'qqiz qo'shiladi.",
          "Kerakli kataklarni bo'yang va Tayyor tugmasini bosing. Natija nima chiqishiga qarang.",
        ],
        ru: [
          'Лента разделена на двенадцать равных клеток. Три заполнены.',
          'К ним прибавляют девять двенадцатых.',
          'Закрась нужные клетки и нажми Готово. Посмотри, что получится в результате.',
        ],
        en: [
          'The belt is divided into twelve equal cells. Three are filled.',
          'Nine twelfths are added to them.',
          'Shade the cells you need and press Done. See what the result turns out to be.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s7: {
    eyebrow: { uz: 'Sonlar nurida', ru: 'На числовом луче', en: 'On the number ray' },
    title: {
      uz: 'Qo\'shish nurda qadam tashlashdir',
      ru: 'Сложение это шаг по лучу',
      en: 'Adding is a step along the ray',
    },
    lead: {
      uz: 'Ikkidan boshlab beshta ulush o\'ngga qadam tashlaymiz.',
      ru: 'Начиная с двух, делаем шаг на пять долей вправо.',
      en: 'Starting from two we step five shares to the right.',
    },
    note: {
      uz: '2/9 + 5/9 = 7/9 — nurdagi qadam va yozuv bir xil natijani beradi.',
      ru: '2/9 + 5/9 = 7/9 — шаг по луче и запись дают один и тот же результат.',
      en: '2/9 + 5/9 = 7/9 — the step on the ray and the record give the same result.',
    },
    audio: {
      intro: {
        uz: [
          "Qo'shishni sonlar nurida ham ko'rsatish mumkin.",
          "Kesma to'qqizta teng ulushga bo'lingan. To'qqizdan ikki nuqtasidan boshlaymiz.",
          "Endi beshta ulush o'ngga qadam tashlaymiz. Bu to'qqizdan besh qo'shish degani.",
          "Yettinchi belgiga keldik. Demak to'qqizdan ikki qo'shildi to'qqizdan besh teng to'qqizdan yetti.",
        ],
        ru: [
          'Сложение можно показать и на числовом луче.',
          'Отрезок разделён на девять равных долей. Начинаем с точки две девятых.',
          'Теперь делаем шаг на пять долей вправо. Это и значит прибавить пять девятых.',
          'Пришли к седьмой метке. Значит две девятых плюс пять девятых равно семи девятых.',
        ],
        en: [
          'Addition can also be shown on the number ray.',
          'The segment is divided into nine equal shares. We start at the point two ninths.',
          'Now we step five shares to the right. That is exactly what adding five ninths means.',
          'We arrived at the seventh mark. So two ninths plus five ninths is seven ninths.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s8: {
    eyebrow: { uz: 'Nurdagi yig\'indi', ru: 'Сумма на луче', en: 'The sum on the ray' },
    title: {
      uz: 'Qadam qaysi belgida tugaydi?',
      ru: 'На какой метке заканчивается шаг?',
      en: 'At which mark does the step end?',
    },
    question: {
      uz: "2/9 + 5/9 yig'indisini tanlang.",
      ru: 'Выбери сумму 2/9 + 5/9.',
      en: 'Choose the sum of 2/9 + 5/9.',
    },
    options: [
      { uz: '7/9', ru: '7/9', en: '7/9' },
      { uz: '7/18', ru: '7/18', en: '7/18' },
      { uz: '3/9', ru: '3/9', en: '3/9' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikki qo'shildi besh teng yetti, maxraj esa to'qqiz bo'lib qoldi. Nurda ham yettinchi belgi chiqdi.",
      ru: 'Верно. Два плюс пять равно семи, а знаменатель остался девятью. И на луче вышла седьмая метка.',
      en: 'Correct. Two plus five is seven, and the denominator stayed nine. The ray also landed on the seventh mark.',
    },
    wrong: [
      null,
      {
        uz: "Maxrajlar qo'shilgan. Nurda ulushlar soni o'zgarmadi, u baribir to'qqizta.",
        ru: 'Знаменатели сложили. На луче число долей не изменилось, их по-прежнему девять.',
        en: 'The denominators were added. The number of shares on the ray did not change; there are still nine.',
      },
      {
        uz: "Bu ayirma. Qo'shishda suratlar qo'shiladi, ayirilmaydi.",
        ru: 'Это разность. При сложении числители складывают, а не вычитают.',
        en: 'That is a difference. In addition the numerators are added, not subtracted.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Nurda ikkinchi belgidan boshlab beshta ulush qadam tashlandi.",
          "Yig'indi qaysi belgiga tushganini toping.",
          'Uchta javobdan mosini tanlang.',
        ],
        ru: [
          'На луче от второй метки сделали шаг на пять долей.',
          'Найди, на какую метку попала сумма.',
          'Выбери подходящий ответ из трёх.',
        ],
        en: [
          'On the ray a step of five shares was taken from the second mark.',
          'Find which mark the sum landed on.',
          'Choose the right answer out of the three.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s9: {
    eyebrow: { uz: 'Nega maxraj turadi', ru: 'Почему знаменатель стоит', en: 'Why the denominator stays' },
    title: {
      uz: 'Maxraj — ulushning nomi',
      ru: 'Знаменатель это имя доли',
      en: 'The denominator is the name of the share',
    },
    lead: {
      uz: 'Uchta olma va ikkita olma beshta olma bo\'ladi, olma olma bo\'lib qoladi.',
      ru: 'Три яблока и два яблока это пять яблок, а яблоко остаётся яблоком.',
      en: 'Three apples and two apples make five apples, and an apple stays an apple.',
    },
    note: {
      uz: 'Ulushlar bir xil bo\'lmasa, ularni shunday qo\'shib bo\'lmaydi.',
      ru: 'Если доли не одинаковые, так складывать их нельзя.',
      en: 'If the shares are not the same size, they cannot be added this way.',
    },
    audio: {
      intro: {
        uz: [
          "Maxraj nima uchun qo'shilmaydi? Bir misolga qaraymiz.",
          "Uchta olma va ikkita olma beshta olma bo'ladi. Lekin olma olma bo'lib qoladi, olmaning nomi o'zgarmaydi.",
          "Kasrda ham xuddi shunday. Uchta sakkizdan bir va ikkita sakkizdan bir beshta sakkizdan bir bo'ladi.",
          "Maxraj esa ulushning nomi. Nom o'zgarmaydi, faqat ulushlar soni ortadi.",
        ],
        ru: [
          'Почему знаменатель не складывают? Посмотрим на пример.',
          'Три яблока и два яблока это пять яблок. Но яблоко остаётся яблоком, название не меняется.',
          'С дробями точно так же. Три восьмых доли и две восьмых доли дают пять восьмых долей.',
          'А знаменатель это имя доли. Имя не меняется, растёт только количество долей.',
        ],
        en: [
          'Why is the denominator not added? Let us look at an example.',
          'Three apples and two apples make five apples. But an apple stays an apple; its name does not change.',
          'It is exactly the same with fractions. Three eighth-shares and two eighth-shares make five eighth-shares.',
          'And the denominator is the name of the share. The name does not change, only the count grows.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s10: {
    eyebrow: { uz: 'Uchinchi tasma', ru: 'Третья лента', en: 'The third belt' },
    title: {
      uz: 'Yana bir yig\'indi',
      ru: 'Ещё одна сумма',
      en: 'One more sum',
    },
    question: {
      uz: "3/12 ga 6/12 qo'shiladi. Nechta katakni bo'yash kerak?",
      ru: 'К 3/12 прибавляют 6/12. Сколько клеток надо закрасить?',
      en: '6/12 is added to 3/12. How many cells must be shaded?',
    },
    parts: 12,
    preset: 3,
    add: 6,
    countLabel: COUNT_LABEL,
    confirm: CONFIRM,
    correctText: {
      uz: "To'g'ri. Uch qo'shildi olti teng to'qqiz. O'n ikkidan to'qqiz. Butungacha yana uchta katak yetmaydi.",
      ru: 'Верно. Три плюс шесть равно девяти. Девять двенадцатых. До целого не хватает ещё трёх клеток.',
      en: 'Correct. Three plus six is nine. Nine twelfths. Three more cells are still missing to make a whole.',
    },
    wrongCount: {
      uz: "Bo'yalgan kataklar soni to'g'ri kelmadi. Qo'shiluvchi o'n ikkidan olti, demak oltita katak kerak.",
      ru: 'Число закрашенных клеток не совпало. Слагаемое шесть двенадцатых, значит нужны шесть клеток.',
      en: 'The number of shaded cells does not match. The addend is six twelfths, so six cells are needed.',
    },
    audio: {
      intro: {
        uz: [
          "Uchinchi tasma ham o'n ikkita katakka bo'lingan. Uchtasi to'ldirilgan.",
          "Unga o'n ikkidan olti qo'shiladi.",
          "Kerakli kataklarni bo'yang va Tayyor tugmasini bosing.",
        ],
        ru: [
          'Третья лента тоже разделена на двенадцать клеток. Три заполнены.',
          'К ним прибавляют шесть двенадцатых.',
          'Закрась нужные клетки и нажми Готово.',
        ],
        en: [
          'The third belt is also divided into twelve cells. Three are filled.',
          'Six twelfths are added to them.',
          'Shade the cells you need and press Done.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s11: {
    eyebrow: { uz: 'Qo\'shish qoidasi', ru: 'Правило сложения', en: 'The addition rule' },
    title: {
      uz: 'Bir xil maxrajli kasrlarni qo\'shish',
      ru: 'Сложение дробей с одинаковым знаменателем',
      en: 'Adding fractions with the same denominator',
    },
    lead: {
      uz: 'Bu qoida maxraj qanday bo\'lishidan qat\'i nazar ishlaydi.',
      ru: 'Это правило работает при любом знаменателе.',
      en: 'This rule works for any denominator.',
    },
    note: {
      uz: 'Yig\'indi maxrajga teng bo\'lsa, natija bitta butun bo\'ladi.',
      ru: 'Если сумма равна знаменателю, результат это одно целое.',
      en: 'If the sum equals the denominator, the result is one whole.',
    },
    audio: {
      intro: {
        uz: [
          "Bugungi qoidani bir joyga yig'amiz.",
          "Birinchi shart. Maxrajlar bir xil bo'lishi kerak, ya'ni ulushlar bir xil kattalikda.",
          "Suratlarni qo'shamiz. Bu ulushlar sonini sanash degani.",
          "Maxrajni o'zgartirmaymiz. Agar yig'indi maxrajga teng chiqsa, natija bitta butunga aylanadi.",
        ],
        ru: [
          'Соберём сегодняшнее правило в одно место.',
          'Первое условие. Знаменатели должны быть одинаковыми, то есть доли одной величины.',
          'Складываем числители. Это и значит посчитать количество долей.',
          'Знаменатель не меняем. А если сумма окажется равной знаменателю, результат превратится в одно целое.',
        ],
        en: [
          "Let us gather today's rule in one place.",
          'First condition. The denominators must be the same, that is the shares must be the same size.',
          'Add the numerators. That is exactly counting the shares.',
          'Leave the denominator alone. And if the sum turns out equal to the denominator, the result becomes one whole.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s12: {
    eyebrow: { uz: 'Ish tartibi', ru: 'Порядок работы', en: 'The working order' },
    title: {
      uz: 'Qo\'shishni qayerdan boshlaymiz?',
      ru: 'С чего начинаем сложение?',
      en: 'Where do we start the addition?',
    },
    question: {
      uz: 'Qaysi tartib to\'g\'ri?',
      ru: 'Какой порядок верный?',
      en: 'Which order is right?',
    },
    options: [
      {
        uz: "Maxrajlar bir xilmi deb tekshiraman, keyin suratlarni qo'shaman",
        ru: 'Проверяю, одинаковы ли знаменатели, потом складываю числители',
        en: 'I check that the denominators match, then add the numerators',
      },
      {
        uz: "Avval maxrajlarni qo'shaman, keyin suratlarni",
        ru: 'Сначала складываю знаменатели, потом числители',
        en: 'I add the denominators first and then the numerators',
      },
      {
        uz: "Kattaroq kasrni olib, kichigini tashlab yuboraman",
        ru: 'Беру большую дробь, а меньшую отбрасываю',
        en: 'I take the bigger fraction and drop the smaller one',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Maxrajlar bir xil bo'lmasa, ulushlar har xil kattalikda bo'ladi va ularni shunday qo'shib bo'lmaydi.",
      ru: 'Верно. Если знаменатели разные, доли будут разной величины, и так складывать их нельзя.',
      en: 'Correct. If the denominators differ, the shares have different sizes and cannot be added this way.',
    },
    wrong: [
      null,
      {
        uz: "Maxrajlar hech qachon qo'shilmaydi. Maxraj ulushning nomi, nom esa qo'shilmaydi.",
        ru: 'Знаменатели никогда не складывают. Знаменатель это имя доли, а имена не складывают.',
        en: 'The denominators are never added. The denominator is the name of the share, and names are not added.',
      },
      {
        uz: "Kichik qo'shiluvchini tashlab bo'lmaydi. Qo'shish ikkala qismni ham hisobga oladi.",
        ru: 'Меньшее слагаемое отбросить нельзя. Сложение учитывает обе части.',
        en: 'The smaller addend cannot be dropped. Addition takes both parts into account.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ra'no ombor uchun qisqa yo'riqnoma yozmoqchi.",
          "Uchta tartib bor, faqat bittasi to'g'ri.",
          'Mosini tanlang.',
        ],
        ru: [
          'Рано хочет написать для склада короткую инструкцию.',
          'Есть три порядка, верный только один.',
          'Выбери подходящий.',
        ],
        en: [
          'Rano wants to write a short instruction for the warehouse.',
          'There are three orders, and only one is right.',
          'Choose the right one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s13: {
    eyebrow: { uz: 'Bit hisobi', ru: 'Расчёт Bit', en: "Bit's calculation" },
    title: {
      uz: 'Bit maxrajlarni ham qo\'shdi',
      ru: 'Bit сложил и знаменатели',
      en: 'Bit added the denominators too',
    },
    question: {
      uz: "2/10 + 5/10 yig'indisi aslida nima?",
      ru: 'Чему на самом деле равна сумма 2/10 + 5/10?',
      en: 'What does 2/10 + 5/10 actually equal?',
    },
    options: [
      { uz: '7/10', ru: '7/10', en: '7/10' },
      { uz: '7/20', ru: '7/20', en: '7/20' },
      { uz: '3/10', ru: '3/10', en: '3/10' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'ndan yetti. Tasma o'nta katakka bo'lingan edi va u shunday bo'lib qoldi. Maxraj qo'shilsa, natija butundan kichrayib ketardi, bu esa qo'shishga qarama-qarshi.",
      ru: 'Верно. Семь десятых. Лента была разделена на десять клеток и такой и осталась. Если сложить знаменатели, результат станет меньше, а это противоречит сложению.',
      en: 'Correct. Seven tenths. The belt was divided into ten cells and stayed that way. Adding the denominators would make the result smaller, which contradicts addition.',
    },
    wrong: [
      null,
      {
        uz: "Bu Bit ning javobi. Yigirmata katak paydo bo'lishi uchun tasmani qayta bo'lish kerak edi, lekin uni hech kim bo'lmadi.",
        ru: 'Это ответ Bit. Чтобы появилось двадцать клеток, ленту надо было бы разделить заново, но её никто не делил.',
        en: "That is Bit's answer. For twenty cells to appear the belt would have to be re-divided, but nobody divided it.",
      },
      {
        uz: "Bu ayirma, yig'indi emas. Ikki qo'shildi besh yetti bo'ladi, uch emas.",
        ru: 'Это разность, а не сумма. Два плюс пять равно семи, а не трём.',
        en: 'That is a difference, not a sum. Two plus five is seven, not three.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit ikkita kasrni qo'shdi. O'ndan ikki va o'ndan besh.",
          "U suratlarni ham, maxrajlarni ham qo'shdi va yigirmadan yetti deb yozdi.",
          "Chizmaga qarang va yig'indi aslida nima ekanini toping.",
        ],
        ru: [
          'Bit сложил две дроби. Две десятых и пять десятых.',
          'Он сложил и числители, и знаменатели и записал семь двадцатых.',
          'Посмотри на чертёж и найди, чему на самом деле равна сумма.',
        ],
        en: [
          'Bit added two fractions. Two tenths and five tenths.',
          'He added both the numerators and the denominators and wrote seven twentieths.',
          'Look at the drawing and find what the sum actually equals.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s14: {
    eyebrow: { uz: 'Shahnozaning kitobi', ru: 'Книга Шахнозы', en: "Shahnoza's book" },
    title: {
      uz: 'Ikki haftada qancha o\'qildi?',
      ru: 'Сколько прочитано за две недели?',
      en: 'How much was read in two weeks?',
    },
    question: {
      uz: "Birinchi haftada kitobning 2/7, ikkinchi haftada 3/7 qismi o'qildi. Jami qancha?",
      ru: 'За первую неделю прочитано 2/7 книги, за вторую 3/7. Сколько всего?',
      en: 'In the first week 2/7 of the book was read and in the second 3/7. How much in total?',
    },
    options: [
      { uz: '5/7', ru: '5/7', en: '5/7' },
      { uz: '5/14', ru: '5/14', en: '5/14' },
      { uz: '1/7', ru: '1/7', en: '1/7' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikki qo'shildi uch teng besh, maxraj esa yetti bo'lib qoldi. Yettidan besh qism o'qildi, butungacha yana yettidan ikki qoldi.",
      ru: 'Верно. Два плюс три равно пяти, а знаменатель остался семью. Прочитано пять седьмых, до целого осталось ещё две седьмых.',
      en: 'Correct. Two plus three is five, and the denominator stayed seven. Five sevenths were read, and two sevenths remain to the whole.',
    },
    wrong: [
      null,
      {
        uz: "Maxrajlar qo'shilgan. Kitob ikki barobar qalinlashmadi, u baribir yettita teng qismga bo'lingan.",
        ru: 'Знаменатели сложили. Книга не стала вдвое толще, она по-прежнему разделена на семь равных частей.',
        en: 'The denominators were added. The book did not get twice as thick; it is still split into seven equal parts.',
      },
      {
        uz: "Bu ayirma. Savolda ikki hafta jami so'ralgan, demak qo'shish kerak.",
        ru: 'Это разность. В вопросе спрашивают итог за две недели, значит нужно складывать.',
        en: 'That is a difference. The question asks for the total over two weeks, so addition is needed.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Ombor kutubxonasida Shahnoza kitob o\'qiyapti.',
          "Birinchi haftada u kitobning yettidan ikki qismini o'qidi. Ikkinchi haftada yettidan uch qismini.",
          'Ikki haftada jami qancha o\'qilganini toping.',
        ],
        ru: [
          'В библиотеке склада Шахноза читает книгу.',
          'За первую неделю она прочитала две седьмых книги. За вторую неделю три седьмых.',
          'Найди, сколько всего прочитано за две недели.',
        ],
        en: [
          'Shahnoza is reading a book in the warehouse library.',
          'In the first week she read two sevenths of the book. In the second week three sevenths.',
          'Find how much was read in the two weeks altogether.',
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
      uz: 'Qo\'shishda maxraj bilan nima bo\'lishini ayting va unvonni oling.',
      ru: 'Скажи, что происходит со знаменателем при сложении, и получи звание.',
      en: 'Say what happens to the denominator in addition and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: 'Bir xil maxrajli kasrlarni qanday qo\'shamiz?',
      ru: 'Как складываем дроби с одинаковым знаменателем?',
      en: 'How do we add fractions with the same denominator?',
    },
    reflectionStart: {
      uz: 'Bir xil maxrajli kasrlarni qo\'shishda men…',
      ru: 'Складывая дроби с одинаковым знаменателем, я…',
      en: 'When adding fractions with the same denominator I…',
    },
    reflectionOptions: [
      {
        uz: "suratlarni qo'shaman, maxrajni o'zgartirmayman",
        ru: 'складываю числители, а знаменатель не меняю',
        en: 'add the numerators and leave the denominator alone',
      },
      {
        uz: "suratlarni ham, maxrajlarni ham qo'shaman",
        ru: 'складываю и числители, и знаменатели',
        en: 'add both the numerators and the denominators',
      },
      {
        uz: "maxrajlarni qo'shaman, suratni o'zgartirmayman",
        ru: 'складываю знаменатели, а числитель не меняю',
        en: 'add the denominators and leave the numerator alone',
      },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Maxraj ulushning nomi, biz esa faqat ulushlar sonini sanayapmiz.",
      ru: 'Верно. Знаменатель это имя доли, а мы считаем только количество долей.',
      en: 'Correct. The denominator is the name of the share, and we are only counting how many shares there are.',
    },
    reflectionWrong: {
      uz: "Maxraj qo'shilsa, butun qayta bo'linib ketardi va natija kichrayib qolardi. Butun esa o'zgarmaydi.",
      ru: 'Если сложить знаменатели, целое пришлось бы разделить заново и результат стал бы меньше. А целое не меняется.',
      en: 'Adding the denominators would mean re-dividing the whole and the result would get smaller. But the whole does not change.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Ombor bosh dispetcheri', ru: 'Главный диспетчер склада', en: 'Chief warehouse dispatcher' } },
      { min: 3, title: { uz: 'Ulush hisobchisi', ru: 'Счётчик долей', en: 'Share counter' } },
      { min: 0, title: { uz: 'Tasma kuzatuvchisi', ru: 'Наблюдатель ленты', en: 'Belt observer' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "Maxrajlar bir xil bo'lishi shart: ulushlar bir xil kattalikda.",
        ru: 'Знаменатели обязаны быть одинаковыми: доли одной величины.',
        en: 'The denominators must be the same: shares of one and the same size.',
      },
      {
        uz: "Suratlarni qo'shamiz — bu ulushlar sonini sanash.",
        ru: 'Складываем числители — это подсчёт количества долей.',
        en: 'Add the numerators — that is counting the shares.',
      },
      {
        uz: "Maxrajni o'zgartirmaymiz: butun o'sha butun bo'lib qoladi.",
        ru: 'Знаменатель не меняем: целое остаётся тем же целым.',
        en: 'Leave the denominator alone: the whole stays the same whole.',
      },
      {
        uz: "Yig'indi maxrajga teng bo'lsa, natija bitta butun.",
        ru: 'Если сумма равна знаменателю, результат это одно целое.',
        en: 'If the sum equals the denominator, the result is one whole.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: 'Ulushni olib tashlash: kasrlarni ayirish.',
      ru: 'Убрать доли: вычитание дробей.',
      en: 'Taking shares away: subtracting fractions.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Ombor tasmasi endi zonalarni to'g'ri qo'shadi.",
          "Bugun siz bir xil maxrajli kasrlarni qo'shishni va butun qachon hosil bo'lishini o'rgandingiz.",
          'Unvonni ochish uchun bitta savol qoldi.',
        ],
        ru: [
          'Миссия выполнена. Складская лента теперь правильно складывает зоны.',
          'Сегодня ты умеешь складывать дроби с одинаковым знаменателем и знаешь, когда получается целое.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The warehouse belt now adds its zones correctly.',
          'Today you can add fractions with the same denominator and you know when a whole appears.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

const ZONES = [
  { count: 9, fill: 'rgba(22,143,163,.42)', stroke: T.cyan },
  { count: 15, fill: 'rgba(230,178,44,.46)', stroke: '#B4861C' },
  { count: 12, fill: 'rgba(255,91,53,.34)', stroke: T.accent },
];

// 36 katak 6 ga 6 to'r bo'lib chiziladi: darslikdagi to'rtburchak shu ko'rinishda
// va bitta qatorda o'ttiz olti katak juda ingichka chiqib ketardi.
const CellGrid = ({ x, y, size, highlight = 2 }) => (
  <g>
    {Array.from({ length: 36 }, (_, index) => {
      let zone = 0;
      let acc = 0;
      for (let i = 0; i < ZONES.length; i += 1) {
        acc += ZONES[i].count;
        if (index < acc) { zone = i; break; }
      }
      const dim = zone > highlight;
      return (
        <rect
          key={index}
          x={x + (index % 6) * size}
          y={y + Math.floor(index / 6) * size}
          width={size}
          height={size}
          fill={dim ? '#FFFFFF' : ZONES[zone].fill}
          stroke={dim ? 'rgba(23,59,82,.20)' : ZONES[zone].stroke}
          strokeWidth={dim ? 1.4 : 2}
        />
      );
    })}
    <rect x={x} y={y} width={size * 6} height={size * 6} fill="none" stroke={T.ink} strokeWidth="2.6" />
  </g>
);

// s0, s14 — ombor sahnasi.
const WarehouseScene = ({ mode = 'hook', solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 464">
      <defs>
        <linearGradient id="d20-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDF0EA" />
          <stop offset="1" stopColor="#F9FBF7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="464" rx="22" fill="url(#d20-wall)" />

      {mode === 'hook' ? (
        <g>
          <text x="260" y="38" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: "Butun tasmada 36 katak", ru: 'Во всей ленте 36 клеток', en: 'The whole belt has 36 cells' })}
          </text>
          <CellGrid x={124} y={62} size={46} highlight={2} />
          {[
            { zone: 0, label: { uz: "ko'k", ru: 'синяя', en: 'blue' }, num: 9 },
            { zone: 1, label: { uz: 'sariq', ru: 'жёлтая', en: 'yellow' }, num: 15 },
            { zone: 2, label: { uz: 'qizil', ru: 'красная', en: 'red' }, num: 12 },
          ].map((row, index) => (
            <g key={row.zone}>
              <rect x={40 + index * 154} y={362} width={20} height={20} rx="5" fill={ZONES[row.zone].fill} stroke={ZONES[row.zone].stroke} strokeWidth="2" />
              <text x={68 + index * 154} y={378} fill={T.ink2} fontSize="13.5" fontWeight="750" fontFamily="Manrope, sans-serif">
                {t(row.label)}
              </text>
              <FractionGlyph num={row.num} den={36} x={70 + index * 154} y={418} size={20} tone={ZONES[row.zone].stroke} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <text x="260" y="38" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: "Kitob 7 ta teng qismga bo'lingan", ru: 'Книга разделена на 7 равных частей', en: 'The book is divided into 7 equal parts' })}
          </text>
          {/* Kitob yuqori qirrasidan ko'rsatilgan: pastda muqova, ustida
              sahifalar bloki. Blok yetti teng bandga bo'lingan — bu kitobning
              yetti teng qismi. Xatcho'p o'qilgan joyda turadi.
              Imzolar blok USTIDA turadi: ilgari ular sahifalar ustiga tushib,
              bandlarni to'sib qo'yardi. */}
          <text x="144" y="76" textAnchor="middle" fill={T.cyan} fontSize="13.5" fontWeight="800" fontFamily="Manrope, sans-serif">
            {t({ uz: '1-hafta', ru: '1 неделя', en: 'week 1' })}
          </text>
          <text x="259" y="76" textAnchor="middle" fill="#4C6B18" fontSize="13.5" fontWeight="800" fontFamily="Manrope, sans-serif">
            {t({ uz: '2-hafta', ru: '2 неделя', en: 'week 2' })}
          </text>
          <text x="374" y="76" textAnchor="middle" fill={T.ink3} fontSize="12.5" fontWeight="750" fontFamily="Manrope, sans-serif">
            {t({ uz: "o'qilmagan", ru: 'не прочитано', en: 'unread' })}
          </text>
          <path d="M100 86 H188" stroke={T.cyan} strokeWidth="3" strokeLinecap="round" />
          <path d="M192 86 H326" stroke={T.lime} strokeWidth="3" strokeLinecap="round" />
          <path d="M330 86 H418" stroke="rgba(23,59,82,.22)" strokeWidth="3" strokeLinecap="round" />

          <ellipse cx="260" cy="306" rx="200" ry="14" fill="rgba(23,59,82,.13)" />

          {/* umurtqa: bandlar ostida turadi, shuning uchun birinchi chiziladi */}
          <path d="M104 112 q-18 85 0 170 h-16 q-18 -85 0 -170 z" fill="#2E4A5C" />
          <path d="M96 130 q-13 68 0 134" fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="2" />

          {/* sahifalar bloki: yetti teng band */}
          {Array.from({ length: 7 }, (_, index) => {
            const read = index < 2 ? 'w1' : index < 5 ? 'w2' : 'no';
            return (
              <g key={index}>
                <rect
                  x={98 + index * 46}
                  y={112}
                  width={46}
                  height={170}
                  fill={read === 'w1' ? 'rgba(22,143,163,.34)' : read === 'w2' ? 'rgba(149,201,61,.44)' : '#FBF8EF'}
                  stroke={read === 'w1' ? T.cyan : read === 'w2' ? T.lime : '#D6CFBB'}
                  strokeWidth="1.8"
                />
                {Array.from({ length: 5 }, (_, line) => (
                  <line
                    key={line}
                    x1={98 + index * 46 + 5}
                    y1={132 + line * 33}
                    x2={98 + index * 46 + 41}
                    y2={132 + line * 33}
                    stroke="rgba(23,59,82,.12)"
                    strokeWidth="1"
                  />
                ))}
              </g>
            );
          })}
          <rect x="98" y="112" width="322" height="170" fill="none" stroke={T.ink} strokeWidth="2.4" />

          {/* muqova qirrasi (perspektiva) */}
          <path d="M74 282 H446 L466 306 H54 Z" fill="#22394A" />
          <path d="M74 282 H446 L450 289 H70 Z" fill="#2E4A5C" />

          {/* xatcho'p: o'qilgan yettidan besh qismdan keyin */}
          <g>
            <rect x="314" y="94" width="14" height="42" rx="3" fill={T.accent} />
            <path d="M314 136 h14 l-7 11 z" fill="#D8431F" />
          </g>

          <g opacity={solved ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
            <rect x="150" y="334" width="220" height="72" rx="16" fill="#FFFFFF" stroke={solved ? T.success : T.ink3} strokeWidth="2.4" />
            <FractionGlyph num={2} den={7} x={196} y={370} size={22} tone={T.cyan} />
            <text x={238} y={378} textAnchor="middle" fill={T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">+</text>
            <FractionGlyph num={3} den={7} x={278} y={370} size={22} tone="#4C6B18" />
            <text x={310} y={378} textAnchor="middle" fill={T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">=</text>
            <FractionGlyph num={solved ? 5 : '?'} den={7} x={344} y={370} size={22} tone={solved ? T.success : T.ink3} />
          </g>
        </g>
      )}
    </FitSvg>
  );
};

// s1, s5 — zonalarni birlashtirish.
const ZoneSumFigure = ({ frame = 0, three = false }) => (
  <FitSvg viewBox="0 0 520 232">
    <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
      <CellGrid x={40} y={16} size={32} highlight={frame >= 3 ? (three ? 2 : 1) : 0} />
    </g>
    <g opacity={frame >= 2 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <FractionGlyph num={9} den={36} x={288} y={60} size={22} tone={ZONES[0].stroke} />
      <text x={324} y={68} textAnchor="middle" fill={T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">+</text>
      <FractionGlyph num={15} den={36} x={362} y={60} size={22} tone={ZONES[1].stroke} />
      {three && (
        <>
          <text x={400} y={68} textAnchor="middle" fill={T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">+</text>
          <FractionGlyph num={12} den={36} x={440} y={60} size={22} tone={ZONES[2].stroke} />
        </>
      )}
    </g>
    <g opacity={frame >= 3 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
      <text x={288} y={148} textAnchor="middle" fill={T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">=</text>
      <FractionGlyph num={three ? 36 : 24} den={36} x={344} y={140} size={26} tone={T.success} />
      {three && (
        <text x={412} y={150} textAnchor="middle" fill={T.success} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">= 1</text>
      )}
    </g>
  </FitSvg>
);

// s3, s9 — qoidaning ma'nosi: bir xil ulushlarni sanash.
const RuleWhyFigure = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 210">
      <g opacity={frame >= 1 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={2} x={46} y={22} width={330} height={46} />
        <FractionGlyph num={2} den={8} x={430} y={46} size={22} tone={T.cyan} />
      </g>
      <g opacity={frame >= 2 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={4} x={46} y={86} width={330} height={46} shade="rgba(149,201,61,.46)" tone={T.lime} />
        <FractionGlyph num={4} den={8} x={430} y={110} size={22} tone={T.lime} />
      </g>
      <g opacity={frame >= 3 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <FractionBar parts={8} shaded={6} x={46} y={150} width={330} height={46} shade="rgba(34,122,83,.28)" tone={T.success} />
        <FractionGlyph num={6} den={8} x={430} y={174} size={22} tone={T.success} />
      </g>
      <g opacity={frame >= 4 ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
        <text x={478} y={116} textAnchor="middle" fill={T.ink3} fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'maxraj', ru: 'знам.', en: 'den.' })}
        </text>
        <path d="M478 96 L478 60 M478 132 L478 168" stroke={T.ink3} strokeWidth="1.6" />
      </g>
    </FitSvg>
  );
};

// s7, s8 — sonlar nurida qo'shish.
const RaySumFigure = ({ frame = 0, solved = false }) => (
  <FitSvg viewBox="0 0 520 200">
    <FractionRay
      parts={9}
      mark={frame >= 4 || solved ? 7 : frame >= 2 ? 2 : null}
      from={frame >= 3 || solved ? 2 : null}
      step={frame >= 3 || solved ? 5 : 0}
      y={116}
    />
    {(frame >= 4 || solved) && (
    <g>
      <FractionGlyph num={2} den={9} x={140} y={176} size={19} tone={T.cyan} />
      <text x={172} y={183} textAnchor="middle" fill={T.ink2} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">+</text>
      <FractionGlyph num={5} den={9} x={204} y={176} size={19} tone={T.accent} />
      <text x={236} y={183} textAnchor="middle" fill={T.ink2} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">=</text>
      <FractionGlyph num={7} den={9} x={270} y={176} size={19} tone={T.success} />
    </g>
    )}
  </FitSvg>
);

// s4 — butun hosil bo'lishi.
const QuarterFigure = ({ solved = false }) => (
  <FitSvg viewBox="0 0 520 210">
    <FractionBar parts={4} shaded={3} x={46} y={26} width={330} height={52} />
    <FractionGlyph num={3} den={4} x={430} y={54} size={24} tone={T.cyan} />
    <FractionBar parts={4} shaded={1} x={46} y={100} width={330} height={52} shade="rgba(149,201,61,.46)" tone={T.lime} />
    <FractionGlyph num={1} den={4} x={430} y={128} size={24} tone={T.lime} />
    <g opacity={solved ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
      <text x={140} y={192} textAnchor="middle" fill={T.success} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        3 + 1 = 4
      </text>
      <FractionGlyph num={4} den={4} x={262} y={184} size={22} tone={T.success} />
      <text x={324} y={192} textAnchor="middle" fill={T.success} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        = 1
      </text>
    </g>
  </FitSvg>
);

// s13 — Bit ning yig'indisi.
const BitSumFigure = ({ solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 210">
      <FractionBar parts={10} shaded={2} x={46} y={22} width={330} height={44} />
      <FractionGlyph num={2} den={10} x={424} y={44} size={20} tone={T.cyan} />
      <FractionBar parts={10} shaded={5} x={46} y={78} width={330} height={44} shade="rgba(149,201,61,.46)" tone={T.lime} />
      <FractionGlyph num={5} den={10} x={424} y={100} size={20} tone={T.lime} />
      <g>
        <rect x={46} y={136} width={158} height={52} rx="14" fill="#FFF6F3" stroke={T.accent} strokeWidth="2.2" />
        <FractionGlyph num={7} den={20} x={104} y={166} size={22} tone={T.accent} />
        <text x={164} y={172} textAnchor="middle" fill={T.accent} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
          Bit
        </text>
      </g>
      <g opacity={solved ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
        <rect x={222} y={136} width={158} height={52} rx="14" fill={T.successSoft} stroke={T.success} strokeWidth="2.2" />
        <FractionGlyph num={7} den={10} x={280} y={166} size={22} tone={T.success} />
        <text x={340} y={172} textAnchor="middle" fill={T.success} fontSize="14" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: "to'g'ri", ru: 'верно', en: 'right' })}
        </text>
      </g>
      <text x={452} y={168} textAnchor="middle" fill={T.ink3} fontSize="12" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: '10 katak', ru: '10 клеток', en: '10 cells' })}
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
          tone: T.accent,
          head: t({ uz: 'Bir xil maxraj', ru: 'Одинаковый знаменатель', en: 'Same denominator' }),
          body: t({ uz: "Ulushlar bir xil kattalikda bo'lishi shart", ru: 'Доли обязаны быть одной величины', en: 'The shares must be the same size' }),
          formula: '/8 + /8',
        },
        {
          tone: T.cyan,
          head: t({ uz: "Suratlarni qo'shamiz", ru: 'Складываем числители', en: 'Add the numerators' }),
          body: t({ uz: 'Bu ulushlar sonini sanash', ru: 'Это подсчёт количества долей', en: 'That is counting the shares' }),
          formula: '2 + 4 = 6',
        },
        {
          tone: T.navy,
          head: t({ uz: "Maxrajni o'zgartirmaymiz", ru: 'Знаменатель не меняем', en: 'Keep the denominator' }),
          body: t({ uz: "Butun o'sha butun bo'lib qoladi", ru: 'Целое остаётся тем же целым', en: 'The whole stays the same whole' }),
          formula: '6/8',
        },
        {
          tone: T.success,
          head: t({ uz: 'Butun hosil bo\'lishi', ru: 'Появление целого', en: 'A whole appears' }),
          body: t({ uz: "Yig'indi maxrajga teng bo'lsa", ru: 'Если сумма равна знаменателю', en: 'When the sum equals the denominator' }),
          formula: '4/4 = 1',
        },
      ]}
    />
  );
};

// s12 — uch stansiyali konveyer: ombor tasmasi qanday ishlaydi.
//
// Ilgari bu ekranda matn ro'yxati turardi va tartib javobda ham, ro'yxatda ham
// bir xil yozilgani uchun savol ma'nosini yo'qotardi. Endi stansiyalar
// nomerlanmagan holda turadi; javobdan keyin nomerlar, o'qlar va tasmada
// harakatlanayotgan yashik paydo bo'ladi.
const StationFigure = ({ solved = false }) => {
  const t = useT();
  const stations = [
    { x: 56, tone: T.accent, label: { uz: 'tekshirish', ru: 'проверка', en: 'check' } },
    { x: 200, tone: T.cyan, label: { uz: "qo'shish", ru: 'сложение', en: 'add' } },
    { x: 344, tone: T.success, label: { uz: 'yozish', ru: 'запись', en: 'write' } },
  ];
  const stroke = (tone) => (solved ? tone : 'rgba(23,59,82,.24)');
  const ink = (tone) => (solved ? tone : T.ink3);
  return (
    <FitSvg viewBox="0 0 520 210">
      {stations.map((st, index) => (
        <g key={st.x}>
          <rect
            x={st.x}
            y={30}
            width={120}
            height={96}
            rx="14"
            fill={solved ? '#FFFFFF' : 'rgba(255,255,255,.66)'}
            stroke={stroke(st.tone)}
            strokeWidth={solved ? 2.4 : 1.6}
            strokeDasharray={solved ? '' : '6 5'}
          />

          {/* stansiya belgisi */}
          {index === 0 && (
            <g>
              <rect x={st.x + 18} y={50} width={34} height={30} rx="8" fill="rgba(23,59,82,.06)" stroke={stroke(st.tone)} strokeWidth="1.6" />
              <text x={st.x + 35} y={71} textAnchor="middle" fill={ink(st.tone)} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">8</text>
              <rect x={st.x + 68} y={50} width={34} height={30} rx="8" fill="rgba(23,59,82,.06)" stroke={stroke(st.tone)} strokeWidth="1.6" />
              <text x={st.x + 85} y={71} textAnchor="middle" fill={ink(st.tone)} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">8</text>
              <path
                d={`M${st.x + 48} 96 l7 8 l14 -16`}
                fill="none"
                stroke={solved ? T.success : 'rgba(23,59,82,.3)'}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}
          {index === 1 && (
            <text x={st.x + 60} y={82} textAnchor="middle" fill={ink(st.tone)} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              2 + 4
            </text>
          )}
          {index === 2 && <FractionGlyph num={6} den={8} x={st.x + 60} y={74} size={22} tone={ink(st.tone)} />}

          <text x={st.x + 60} y={118} textAnchor="middle" fill={ink(st.tone)} fontSize="11.5" fontWeight="800" fontFamily="Manrope, sans-serif">
            {t(st.label)}
          </text>

          {/* nomer va o'qlar faqat javobdan keyin */}
          <g opacity={solved ? 1 : 0} style={{ transition: 'opacity .35s' }}>
            <circle cx={st.x + 16} cy={30} r="13" fill={st.tone} />
            <text x={st.x + 16} y={35} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {index + 1}
            </text>
            {index < 2 && (
              <g>
                <path d={`M${st.x + 124} 78 h14`} stroke={T.ink3} strokeWidth="2.4" />
                <path d={`M${st.x + 144} 78 l-8 -5 v10 z`} fill={T.ink3} />
              </g>
            )}
          </g>
        </g>
      ))}

      {/* tasma */}
      <rect x="40" y="150" width="440" height="14" rx="7" fill="#D9E3E0" stroke="rgba(23,59,82,.18)" strokeWidth="1.4" />
      {Array.from({ length: 9 }, (_, index) => (
        <circle key={index} cx={62 + index * 50} cy={176} r="9" fill="#EDF2F0" stroke="rgba(23,59,82,.2)" strokeWidth="1.6" />
      ))}
      <g opacity={solved ? 1 : 0.3} style={{ transition: 'opacity .35s' }}>
        {/* yashik tasma USTIDA turadi, stansiya qutisiga tegmaydi */}
        <rect x="392" y="132" width="42" height="18" rx="3" fill="#C79A63" stroke="#93673A" strokeWidth="1.8" />
        <path d="M392 141 h42" stroke="#93673A" strokeWidth="1.4" />
      </g>
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={() => <WarehouseScene />} />
);
const Screen1 = (props) => <RevealScreen {...props} figure={({ frame }) => <ZoneSumFigure frame={frame} />} />;
const Screen2 = (props) => <CellFill {...props} />;
const Screen3 = (props) => (
  <RevealScreen {...props} ratio="520 / 210" figure={({ frame }) => <RuleWhyFigure frame={frame} />} />
);
const Screen4 = (props) => (
  <ChoiceScreen {...props} ordinal={1} ratio="520 / 210" figure={({ solved }) => <QuarterFigure solved={solved} />} />
);
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <ZoneSumFigure frame={frame} three />} />;
const Screen6 = (props) => <CellFill {...props} />;
const Screen7 = (props) => (
  <RevealScreen {...props} ratio="520 / 200" figure={({ frame }) => <RaySumFigure frame={frame} />} />
);
const Screen8 = (props) => (
  <ChoiceScreen {...props} ordinal={2} ratio="520 / 200" figure={({ solved }) => <RaySumFigure frame={3} solved={solved} />} />
);
const Screen9 = (props) => (
  <RevealScreen {...props} ratio="520 / 210" figure={({ frame }) => <RuleWhyFigure frame={frame} />} />
);
const Screen10 = (props) => <CellFill {...props} />;
const Screen11 = (props) => (
  <RevealScreen {...props} plain figure={({ frame }) => <RulePanel frame={frame + 1} />} />
);
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} stack ratio="520 / 210" figure={({ solved }) => <StationFigure solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} ratio="520 / 210" figure={({ solved }) => <BitSumFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <WarehouseScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars20(props) {
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
