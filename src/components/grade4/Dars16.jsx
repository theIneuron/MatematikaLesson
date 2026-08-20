// ============================================================================
// 4-SINF · Dars 16 · Formulalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 105-108-betlar.
//   105-bet: uzunligi 3 sm, eni 2 sm to'rtburchakning perimetri; keyin 4 sm va
//            5 sm. "Qanday amallarni bajarding?" — bir xil amallar takrorlanadi;
//            P = 2 × (a + b) formulasi; a = 2 sm, b = 5 sm uchun tekshirish;
//   106-bet: kvadrat perimetri formulasi, a = 3 sm; S = a × b jadvali;
//   107-bet: a = 6 sm, b = 11 sm uchun P; yuza jadvali 3 va 5, 7 va 3;
//   108-bet: to'rtburchak P = a + b + c + d, a = 4, b = 2, c = 3, d = 2 sm;
//            yer uchastkasi 635 m va 768 m; 13 va 8 sm tomonlar 7 sm ga oshadi.
//
// Syujet: Lumo City loyiha byurosi — Zuhra park uchastkalarining chizmasini
// tayyorlaydi (SYUJET_4SINF.md, 2-blok).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
//
// Yangi mexanika: FormulaBuild — bola formulani belgilardan o'zi yig'adi.
// Harflar shu tarzda "yodlanadigan yozuv" emas, "o'zi tuzgan qoida" bo'ladi.
// ============================================================================
import {
  Caption, ChoiceScreen, FitSvg, FormulaBuild, KIT_STYLES, NumPadScreen, Plate,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TableFill,
  TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'formulas-4-16-v2',
  slug: 'dars16-formulalar',
  lessonTitle: {
    uz: '16-dars. Formulalar',
    ru: 'Урок 16. Формулы',
    en: 'Lesson 16. Formulas',
  },
  skillTags: ['formula', 'perimeter', 'area', 'substitution', 'units'],
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

const NUM = (value) => ({ uz: String(value), ru: String(value), en: String(value) });

const CONTENT = {
  // -------------------------------------------------------------------------
  s0: {
    eyebrow: { uz: 'Loyiha byurosi', ru: 'Проектное бюро', en: 'The design bureau' },
    title: {
      uz: 'Ikki chizma, bir xil ish',
      ru: 'Два чертежа, одна и та же работа',
      en: 'Two drawings, the same work',
    },
    question: {
      uz: 'Ikkala uchastkada nima aynan bir xil qoldi?',
      ru: 'Что осталось совершенно одинаковым на обоих участках?',
      en: 'What stayed exactly the same on both plots?',
    },
    options: [
      {
        uz: 'Amallar tartibi',
        ru: 'Порядок действий',
        en: 'The order of the actions',
      },
      {
        uz: 'Tomonlarning uzunligi',
        ru: 'Длины сторон',
        en: 'The lengths of the sides',
      },
      {
        uz: 'Natija',
        ru: 'Результат',
        en: 'The result',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Sonlar boshqa, natijalar boshqa, lekin amallar aynan bir xil. Uzunlik va enni qo'shdik, so'ng ikkiga ko'paytirdik.",
      ru: 'Верно. Числа разные, результаты разные, а действия совершенно одинаковые. Сложили длину и ширину, потом умножили на два.',
      en: 'Correct. The numbers differ and the results differ, but the actions are exactly the same. Add the length and the width, then multiply by two.',
    },
    wrong: [
      null,
      {
        uz: "Birinchi uchastka uch va ikki, ikkinchisi to'rt va besh. Tomonlar boshqa. Takrorlanayotgan narsa ular emas.",
        ru: 'У первого участка три и два, у второго четыре и пять. Стороны разные. Повторяется не это.',
        en: 'The first plot is three and two, the second four and five. The sides differ. That is not what repeats.',
      },
      {
        uz: "Birinchi javob o'n, ikkinchisi o'n sakkiz. Natijalar ham har xil. Takrorlanayotgan narsa boshqa joyda.",
        ru: 'Первый ответ десять, второй восемнадцать. Результаты тоже разные. Повторяется что-то другое.',
        en: 'The first answer is ten, the second eighteen. The results differ too. What repeats is somewhere else.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          'Salom! Bugun biz Lumo City loyiha byurosidamiz.',
          "Zuhra park uchastkalarini chizyapti va har biriga panjara kerak. Panjara uzunligi to'rt tomonning yig'indisiga teng.",
          "Birinchi uchastka uch santimetr va ikki santimetr, panjara o'n santimetr. Ikkinchisi to'rt va besh, panjara o'n sakkiz santimetr.",
          'Zuhra ikkala hisobga qaradi va bir narsa takrorlanayotganini payqadi. Sizningcha, nima aynan bir xil qoldi?',
        ],
        ru: [
          'Привет! Сегодня мы в проектном бюро Lumo City.',
          'Зухра чертит участки парка, и каждому нужна ограда. Длина ограды равна сумме четырёх сторон.',
          'Первый участок три сантиметра и два сантиметра, ограда десять сантиметров. Второй четыре и пять, ограда восемнадцать сантиметров.',
          'Зухра посмотрела на оба расчёта и заметила, что кое-что повторяется. Как ты думаешь, что осталось одинаковым?',
        ],
        en: [
          'Hello! Today we are at the Lumo City design bureau.',
          'Zuhra is drawing park plots, and each one needs a fence. The length of the fence equals the sum of the four sides.',
          'The first plot is three centimetres by two centimetres, and the fence is ten centimetres. The second is four by five, and the fence is eighteen.',
          'Zuhra looked at both calculations and noticed that something repeats. What do you think stayed the same?',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s1: {
    eyebrow: { uz: 'Sondan harfga', ru: 'От числа к букве', en: 'From number to letter' },
    title: {
      uz: 'Takrorlanadigan amalni bir marta yozamiz',
      ru: 'Повторяющееся действие запишем один раз',
      en: 'A repeating action gets written down once',
    },
    lead: {
      uz: "Uzunlikni a, enni b deb belgilaymiz. Endi qoida har qanday to'rtburchakka mos keladi.",
      ru: 'Обозначим длину буквой a, ширину буквой b. Теперь правило подходит любому прямоугольнику.',
      en: 'Let the length be a and the width be b. Now the rule fits any rectangle.',
    },
    note: {
      uz: "Perimetrni P harfi bilan belgilaymiz. Perimetr — barcha tomonlarning yig'indisi.",
      ru: 'Периметр обозначим буквой P. Периметр это сумма всех сторон.',
      en: 'The perimeter is written as P. The perimeter is the sum of all the sides.',
    },
    audio: {
      intro: {
        uz: [
          "Zuhra o'n ikkita uchastka chizishi kerak. Har birida bir xil amal takrorlanadi.",
          "Uzunlikni a harfi bilan, enni b harfi bilan belgilaymiz. Harf — bu istalgan son turadigan joy.",
          "Endi amalni bir marta yozib qo'yish mumkin. Uzunlik va enni qo'shamiz, so'ng ikkiga ko'paytiramiz.",
          "Bunday yozuv formula deyiladi. Formula bir marta yoziladi va har safar ishlaydi.",
        ],
        ru: [
          'Зухре нужно начертить двенадцать участков. В каждом повторяется одно и то же действие.',
          'Обозначим длину буквой a, а ширину буквой b. Буква это место, куда встаёт любое число.',
          'Теперь действие можно записать один раз. Складываем длину и ширину, потом умножаем на два.',
          'Такая запись называется формулой. Формулу пишут один раз, а работает она всегда.',
        ],
        en: [
          'Zuhra has to draw twelve plots. The same action repeats in every one of them.',
          'Let the length be a and the width be b. A letter is a place where any number can stand.',
          'Now the action can be written down once. Add the length and the width, then multiply by two.',
          'Such a record is called a formula. A formula is written once and works every time.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s2: {
    eyebrow: { uz: 'Perimetr formulasi', ru: 'Формула периметра', en: 'The perimeter formula' },
    title: {
      uz: "To'rtburchak perimetri formulasini yig'ing",
      ru: 'Собери формулу периметра прямоугольника',
      en: 'Assemble the perimeter formula of a rectangle',
    },
    question: {
      uz: 'Belgilarni tartib bilan bosing.',
      ru: 'Нажимай знаки по порядку.',
      en: 'Tap the signs in order.',
    },
    prefix: 'P =',
    target: ['2', '×', '(', 'a', '+', 'b', ')'],
    pool: ['a', ')', '4', '2', '+', '(', 'b', '−', '×'],
    wrongText: {
      uz: "Bu belgi hozir emas. Avval nechta marta olinishini yozamiz, keyin qaysi yig'indi olinishini qavsga solamiz.",
      ru: 'Этот знак не сейчас. Сначала пишем, сколько раз берём, а потом в скобках какую сумму берём.',
      en: 'Not this sign yet. First write how many times we take it, then put the sum in brackets.',
    },
    correctText: {
      uz: "To'g'ri. P teng ikki ko'paytiriladi qavs ichida a qo'shildi b. Qavs shuning uchun kerak: avval qo'shamiz, keyin ikkilantiramiz.",
      ru: 'Верно. P равно два умножить на скобку a плюс b. Скобка нужна именно для этого: сначала складываем, потом удваиваем.',
      en: 'Correct. P equals two times the bracket a plus b. The bracket is there for a reason: add first, then double.',
    },
    audio: {
      intro: {
        uz: [
          "Formulani o'zingiz yig'asiz.",
          "Yozuv shunday o'qiladi. P teng ikki ko'paytiriladi qavs ichida a qo'shildi b.",
          'Belgilarni chapdan o\'ngga tartib bilan bosing.',
        ],
        ru: [
          'Формулу ты соберёшь сам.',
          'Запись читается так. P равно два умножить на скобку a плюс b.',
          'Нажимай знаки по порядку слева направо.',
        ],
        en: [
          'You will assemble the formula yourself.',
          'The record reads like this. P equals two times the bracket a plus b.',
          'Tap the signs in order from left to right.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s3: {
    eyebrow: { uz: 'Harf o\'rniga son', ru: 'Вместо буквы число', en: 'A number in place of a letter' },
    title: {
      uz: 'Formulaga qiymat qo\'yish',
      ru: 'Подстановка значений в формулу',
      en: 'Substituting values into a formula',
    },
    lead: {
      uz: "a = 2 sm, b = 5 sm bo'lsa, harflar o'rniga shu sonlarni qo'yamiz.",
      ru: 'Если a = 2 см, b = 5 см, то вместо букв ставим эти числа.',
      en: 'If a = 2 cm and b = 5 cm, we put these numbers in place of the letters.',
    },
    note: {
      uz: 'P = 2 × (2 + 5) = 2 × 7 = 14 sm. Qavs ichidagi amal birinchi bajariladi.',
      ru: 'P = 2 × (2 + 5) = 2 × 7 = 14 см. Действие в скобках выполняется первым.',
      en: 'P = 2 × (2 + 5) = 2 × 7 = 14 cm. The action in the brackets is done first.',
    },
    audio: {
      intro: {
        uz: [
          'Formula tayyor, endi undan foydalanamiz.',
          "Uchastkaning uzunligi ikki santimetr, eni besh santimetr.",
          "Harflar o'rniga sonlarni qo'yamiz. Qavs ichida ikki qo'shildi besh, ya'ni yetti.",
          "Endi yettini ikkiga ko'paytiramiz va o'n to'rt santimetr chiqadi. Qavs bo'lmasa tartib buzilardi.",
        ],
        ru: [
          'Формула готова, теперь ею воспользуемся.',
          'Длина участка два сантиметра, ширина пять сантиметров.',
          'Вместо букв ставим числа. В скобках два плюс пять, то есть семь.',
          'Теперь умножаем семь на два и получаем четырнадцать сантиметров. Без скобок порядок нарушился бы.',
        ],
        en: [
          'The formula is ready, so now we use it.',
          'The plot is two centimetres long and five centimetres wide.',
          'We put numbers in place of the letters. Inside the brackets two plus five, that is seven.',
          'Now multiply seven by two and get fourteen centimetres. Without the brackets the order would break.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s4: {
    eyebrow: { uz: 'Byuro buyurtmasi', ru: 'Заказ бюро', en: 'A bureau order' },
    title: {
      uz: 'Katta uchastkaning panjarasi',
      ru: 'Ограда большого участка',
      en: 'The fence of a large plot',
    },
    question: {
      uz: "a = 6 sm, b = 11 sm. Perimetrni hisoblab, javobni tering.",
      ru: 'a = 6 см, b = 11 см. Вычисли периметр и набери ответ.',
      en: 'a = 6 cm, b = 11 cm. Work out the perimeter and type the answer.',
    },
    answer: '34',
    unit: { uz: 'sm', ru: 'см', en: 'cm' },
    wrong: {
      uz: "Hozircha mos emas. Avval qavs ichini hisoblang, keyin natijani ikkiga ko'paytiring.",
      ru: 'Пока не сходится. Сначала посчитай в скобках, потом умножь результат на два.',
      en: 'Not right yet. Work out the brackets first, then multiply the result by two.',
    },
    hintAfter: {
      uz: "Qavs ichida olti qo'shildi o'n bir, ya'ni o'n yetti. Endi o'n yettini ikkiga ko'paytiring.",
      ru: 'В скобках шесть плюс одиннадцать, то есть семнадцать. Теперь умножь семнадцать на два.',
      en: 'Inside the brackets six plus eleven is seventeen. Now multiply seventeen by two.',
    },
    correctText: {
      uz: "To'g'ri. Ikki ko'paytiriladi o'n yetti, o'ttiz to'rt santimetr. Panjara shuncha uzunlikda kerak.",
      ru: 'Верно. Два умножить на семнадцать, тридцать четыре сантиметра. Ограда нужна такой длины.',
      en: 'Correct. Two times seventeen is thirty four centimetres. The fence needs to be that long.',
    },
    audio: {
      intro: {
        uz: [
          'Byuroga yangi buyurtma keldi.',
          "Uchastkaning uzunligi olti santimetr, eni o'n bir santimetr.",
          'Formuladan foydalanib perimetrni toping va raqamlarni tering.',
        ],
        ru: [
          'В бюро пришёл новый заказ.',
          'Длина участка шесть сантиметров, ширина одиннадцать сантиметров.',
          'Найди периметр по формуле и набери цифры.',
        ],
        en: [
          'A new order has arrived at the bureau.',
          'The plot is six centimetres long and eleven centimetres wide.',
          'Find the perimeter with the formula and type the digits.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s5: {
    eyebrow: { uz: 'Kvadrat', ru: 'Квадрат', en: 'The square' },
    title: {
      uz: 'Kvadratda to\'rtta teng tomon bor',
      ru: 'У квадрата четыре равные стороны',
      en: 'A square has four equal sides',
    },
    lead: {
      uz: "Bir xil qo'shiluvchini to'rt marta qo'shish — bu to'rtga ko'paytirish.",
      ru: 'Сложить одно и то же слагаемое четыре раза это умножить на четыре.',
      en: 'Adding the same addend four times is the same as multiplying by four.',
    },
    note: {
      uz: 'P = 4 × a. a = 3 sm bo\'lsa, P = 4 × 3 = 12 sm.',
      ru: 'P = 4 × a. Если a = 3 см, то P = 4 × 3 = 12 см.',
      en: 'P = 4 × a. If a = 3 cm, then P = 4 × 3 = 12 cm.',
    },
    audio: {
      intro: {
        uz: [
          "Byuroda kvadrat shaklidagi maydoncha ham bor.",
          "Kvadratning to'rtta tomoni ham bir xil. Demak bitta harf yetarli.",
          "Bir tomonni to'rt marta qo'shish o'rniga uni to'rtga ko'paytiramiz.",
          "Formula qisqaradi. P teng to'rt ko'paytiriladi a. Tomon uch santimetr bo'lsa, perimetr o'n ikki santimetr.",
        ],
        ru: [
          'В бюро есть и площадка в форме квадрата.',
          'У квадрата все четыре стороны одинаковые. Значит хватит одной буквы.',
          'Вместо того чтобы складывать сторону четыре раза, умножаем её на четыре.',
          'Формула становится короче. P равно четыре умножить на a. Если сторона три сантиметра, периметр двенадцать сантиметров.',
        ],
        en: [
          'The bureau also has a square playground.',
          'All four sides of a square are the same, so one letter is enough.',
          'Instead of adding the side four times, we multiply it by four.',
          'The formula gets shorter. P equals four times a. If the side is three centimetres, the perimeter is twelve.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s6: {
    eyebrow: { uz: 'Kvadrat formulasi', ru: 'Формула квадрата', en: 'The square formula' },
    title: {
      uz: 'Kvadratga qaysi yozuv mos keladi?',
      ru: 'Какая запись подходит квадрату?',
      en: 'Which record fits the square?',
    },
    question: {
      uz: 'Tomoni a bo\'lgan kvadratning perimetri qaysi formula bilan topiladi?',
      ru: 'По какой формуле находят периметр квадрата со стороной a?',
      en: 'Which formula gives the perimeter of a square with side a?',
    },
    options: [
      { uz: 'P = 4 × a', ru: 'P = 4 × a', en: 'P = 4 × a' },
      { uz: 'P = 2 × a', ru: 'P = 2 × a', en: 'P = 2 × a' },
      { uz: 'P = a + 4', ru: 'P = a + 4', en: 'P = a + 4' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Kvadratda to'rtta teng tomon bor, shuning uchun tomon to'rtga ko'paytiriladi.",
      ru: 'Верно. У квадрата четыре равные стороны, поэтому сторону умножают на четыре.',
      en: 'Correct. A square has four equal sides, so the side is multiplied by four.',
    },
    wrong: [
      null,
      {
        uz: "Ikkiga ko'paytirish faqat ikkita tomonni beradi. Kvadratning esa to'rtta tomoni bor.",
        ru: 'Умножение на два даёт только две стороны. А у квадрата их четыре.',
        en: 'Multiplying by two gives only two sides. A square has four of them.',
      },
      {
        uz: "Bu tomonga to'rt qo'shish. Perimetr esa tomondan to'rt marta katta, undan to'rttaga katta emas.",
        ru: 'Это прибавление четырёх к стороне. А периметр в четыре раза больше стороны, а не на четыре больше.',
        en: 'That adds four to the side. But the perimeter is four times the side, not four more than it.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Byuro arxivida uchta yozuv saqlanib qolgan.',
          'Ulardan faqat bittasi kvadratning perimetrini beradi.',
          'Chizmaga qarab mosini tanlang.',
        ],
        ru: [
          'В архиве бюро сохранились три записи.',
          'Только одна из них даёт периметр квадрата.',
          'Посмотри на чертёж и выбери подходящую.',
        ],
        en: [
          'Three records have survived in the bureau archive.',
          'Only one of them gives the perimeter of a square.',
          'Look at the drawing and choose the right one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s7: {
    eyebrow: { uz: 'Yuza', ru: 'Площадь', en: 'Area' },
    title: {
      uz: 'Yuza — ichkaridagi kataklar soni',
      ru: 'Площадь это количество клеток внутри',
      en: 'Area is the number of cells inside',
    },
    lead: {
      uz: 'Har qatorda a ta katak, qatorlar soni b ta. Demak S = a × b.',
      ru: 'В каждом ряду a клеток, рядов b. Значит S = a × b.',
      en: 'Each row has a cells and there are b rows. So S = a × b.',
    },
    note: {
      uz: 'a = 3 sm, b = 5 sm bo\'lsa, S = 3 × 5 = 15 kv. sm.',
      ru: 'Если a = 3 см, b = 5 см, то S = 3 × 5 = 15 кв. см.',
      en: 'If a = 3 cm and b = 5 cm, then S = 3 × 5 = 15 sq. cm.',
    },
    audio: {
      intro: {
        uz: [
          "Panjara uchastkaning chekkasini o'lchaydi. Endi ichkarisini o'lchaymiz.",
          "Uchastkani bir santimetrli kataklarga bo'lamiz. Har qatorda a ta katak bor.",
          "Qatorlar soni b ta. Demak barcha kataklar soni a ni b ga ko'paytirganga teng.",
          "Bu yuza formulasi. S teng a ko'paytiriladi b. Yuza kvadrat santimetrda o'lchanadi.",
        ],
        ru: [
          'Ограда измеряет край участка. Теперь измерим то, что внутри.',
          'Разобьём участок на клетки по одному сантиметру. В каждом ряду a клеток.',
          'Рядов b. Значит всего клеток столько, сколько даёт a умножить на b.',
          'Это формула площади. S равно a умножить на b. Площадь измеряют в квадратных сантиметрах.',
        ],
        en: [
          'The fence measures the edge of the plot. Now we measure what is inside.',
          'Split the plot into one centimetre cells. Each row has a cells.',
          'There are b rows. So the total number of cells is a multiplied by b.',
          'This is the area formula. S equals a times b. Area is measured in square centimetres.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s8: {
    eyebrow: { uz: 'Byuro jadvali', ru: 'Таблица бюро', en: 'The bureau table' },
    title: {
      uz: 'Yo\'qolgan tomonni tiklang',
      ru: 'Восстанови потерянную сторону',
      en: 'Restore the missing side',
    },
    question: {
      uz: "Uzunligi 7 sm, yuzasi 21 kv. sm. Eni qancha?",
      ru: 'Длина 7 см, площадь 21 кв. см. Чему равна ширина?',
      en: 'The length is 7 cm and the area is 21 sq. cm. What is the width?',
    },
    columns: [
      { uz: 'a', ru: 'a', en: 'a' },
      { uz: 'b', ru: 'b', en: 'b' },
      { uz: 'S', ru: 'S', en: 'S' },
    ],
    rows: [
      [NUM('3 sm'), NUM('5 sm'), NUM('15 kv. sm')],
      [NUM('7 sm'), null, NUM('21 kv. sm')],
    ],
    chips: [NUM('3 sm'), NUM('14 sm'), NUM('21 kv. sm')],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. Yetti ko'paytiriladi uch, yigirma bir. Noma'lum tomonni topish uchun yuzani ma'lum tomonga bo'ldingiz.",
      ru: 'Верно. Семь умножить на три, двадцать один. Чтобы найти неизвестную сторону, площадь делят на известную сторону.',
      en: 'Correct. Seven times three is twenty one. To find the unknown side you divided the area by the known side.',
    },
    wrong: [
      null,
      {
        uz: "Yetti ko'paytiriladi o'n to'rt to'qson sakkiz beradi, yigirma bir emas. Yigirma birni yettiga bo'ling.",
        ru: 'Семь умножить на четырнадцать даёт девяносто восемь, а не двадцать один. Раздели двадцать один на семь.',
        en: 'Seven times fourteen gives ninety eight, not twenty one. Divide twenty one by seven.',
      },
      {
        uz: "Bu yuza birligi. Ustunda esa tomon kerak, u oddiy santimetrda o'lchanadi.",
        ru: 'Это единица площади. А в столбце нужна сторона, она измеряется в обычных сантиметрах.',
        en: 'That is a unit of area. The column needs a side, which is measured in plain centimetres.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Byuro jadvalining bitta katagi o'chib ketgan.",
          "Uzunlik yetti santimetr, yuza yigirma bir kvadrat santimetr. Eni yozilmagan.",
          'Formuladan foydalanib mos qiymatni tanlang.',
        ],
        ru: [
          'В таблице бюро стёрлась одна клетка.',
          'Длина семь сантиметров, площадь двадцать один квадратный сантиметр. Ширина не записана.',
          'Выбери подходящее значение, опираясь на формулу.',
        ],
        en: [
          'One cell in the bureau table has been erased.',
          'The length is seven centimetres and the area is twenty one square centimetres. The width is missing.',
          'Use the formula to choose the matching value.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s9: {
    eyebrow: { uz: 'Ikki xil kattalik', ru: 'Две разные величины', en: 'Two different quantities' },
    title: {
      uz: 'Perimetr chekka, yuza ichkari',
      ru: 'Периметр это край, площадь это внутренность',
      en: 'The perimeter is the edge, the area is the inside',
    },
    lead: {
      uz: "Bir xil chizmada ikkita javob bor va ular bir-biriga aralashmasligi kerak.",
      ru: 'На одном чертеже два ответа, и путать их нельзя.',
      en: 'One drawing gives two answers, and they must not be confused.',
    },
    note: {
      uz: 'Perimetr santimetrda, yuza kvadrat santimetrda. Birlik javobning ma\'nosini ko\'rsatadi.',
      ru: 'Периметр в сантиметрах, площадь в квадратных сантиметрах. Единица показывает смысл ответа.',
      en: 'The perimeter is in centimetres, the area in square centimetres. The unit shows what the answer means.',
    },
    audio: {
      intro: {
        uz: [
          "Bitta uchastkaga ikki xil javob kerak bo'ladi.",
          "Panjara uchun perimetr kerak. Bu chekka bo'ylab yurgan chiziqning uzunligi.",
          "Maysa uchun yuza kerak. Bu ichkaridagi joyning kattaligi.",
          "Ularni birlik ajratib turadi. Perimetr santimetrda, yuza kvadrat santimetrda o'lchanadi.",
        ],
        ru: [
          'Для одного участка нужны два разных ответа.',
          'Для ограды нужен периметр. Это длина линии, идущей по краю.',
          'Для газона нужна площадь. Это величина места внутри.',
          'Их различают единицы. Периметр в сантиметрах, площадь в квадратных сантиметрах.',
        ],
        en: [
          'One plot needs two different answers.',
          'The fence needs the perimeter. That is the length of the line running along the edge.',
          'The lawn needs the area. That is how much space is inside.',
          'The units tell them apart. The perimeter is in centimetres, the area in square centimetres.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s10: {
    eyebrow: { uz: 'Notekis to\'rtburchak', ru: 'Неровный четырёхугольник', en: 'An uneven quadrilateral' },
    title: {
      uz: 'Tomonlari har xil bo\'lsa, formula ham boshqacha',
      ru: 'Если стороны разные, то и формула другая',
      en: 'If the sides differ, the formula differs too',
    },
    question: {
      uz: 'Belgilarni tartib bilan bosing.',
      ru: 'Нажимай знаки по порядку.',
      en: 'Tap the signs in order.',
    },
    prefix: 'P =',
    target: ['a', '+', 'b', '+', 'c', '+', 'd'],
    pool: ['b', '+', 'a', '+', 'd', '×', '+', 'c'],
    wrongText: {
      uz: "Bu belgi hozir emas. To'rtta tomonni ketma-ket qo'shib boramiz: a, b, c, d.",
      ru: 'Этот знак не сейчас. Складываем четыре стороны подряд: a, b, c, d.',
      en: 'Not this sign yet. We add the four sides one after another: a, b, c, d.',
    },
    correctText: {
      uz: "To'g'ri. Tomonlar teng bo'lmagani uchun ko'paytirish yordam bermaydi, har bir tomonni alohida qo'shamiz. a = 4, b = 2, c = 3, d = 2 bo'lsa, P = 11 sm.",
      ru: 'Верно. Стороны не равны, поэтому умножение не помогает, каждую сторону складываем отдельно. При a = 4, b = 2, c = 3, d = 2 получаем P = 11 см.',
      en: 'Correct. The sides are not equal, so multiplication does not help; we add each side separately. With a = 4, b = 2, c = 3, d = 2 we get P = 11 cm.',
    },
    audio: {
      intro: {
        uz: [
          "Byuroga notekis uchastka keldi. Uning to'rtta tomoni ham har xil.",
          "Bunday shaklda ko'paytirish ishlamaydi, chunki teng tomonlar yo'q.",
          "Har bir tomonni alohida qo'shadigan formulani yig'ing.",
        ],
        ru: [
          'В бюро поступил неровный участок. Все четыре стороны у него разные.',
          'Для такой фигуры умножение не работает, потому что равных сторон нет.',
          'Собери формулу, которая складывает каждую сторону отдельно.',
        ],
        en: [
          'An uneven plot has arrived at the bureau. All four of its sides are different.',
          'Multiplication does not work for such a figure, because there are no equal sides.',
          'Assemble the formula that adds every side separately.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s11: {
    eyebrow: { uz: 'Byuro qoidalari', ru: 'Правила бюро', en: 'The bureau rules' },
    title: {
      uz: 'To\'rtta formula, to\'rtta shakl',
      ru: 'Четыре формулы, четыре фигуры',
      en: 'Four formulas, four figures',
    },
    lead: {
      uz: 'Formulani shakl tanlaydi, harf esa istalgan sonni qabul qiladi.',
      ru: 'Формулу выбирает фигура, а буква принимает любое число.',
      en: 'The figure chooses the formula, and the letter accepts any number.',
    },
    note: {
      uz: 'Javobda birlik yoziladi: perimetr sm, yuza kv. sm.',
      ru: 'В ответе пишется единица: периметр в см, площадь в кв. см.',
      en: 'The unit goes into the answer: perimeter in cm, area in sq. cm.',
    },
    audio: {
      intro: {
        uz: [
          "Bugungi formulalarni bir joyga yig'amiz.",
          "To'rtburchak perimetri. P teng ikki ko'paytiriladi qavs ichida a qo'shildi b.",
          "Kvadrat perimetri. P teng to'rt ko'paytiriladi a. Notekis to'rtburchakda esa hamma tomon qo'shiladi.",
          "Yuza formulasi. S teng a ko'paytiriladi b. Javobda birlik albatta yoziladi.",
        ],
        ru: [
          'Соберём сегодняшние формулы в одно место.',
          'Периметр прямоугольника. P равно два умножить на скобку a плюс b.',
          'Периметр квадрата. P равно четыре умножить на a. А у неровного четырёхугольника складываются все стороны.',
          'Формула площади. S равно a умножить на b. В ответе обязательно пишется единица.',
        ],
        en: [
          "Let us gather today's formulas in one place.",
          'The perimeter of a rectangle. P equals two times the bracket a plus b.',
          'The perimeter of a square. P equals four times a. For an uneven quadrilateral all the sides are added.',
          'The area formula. S equals a times b. The unit is always written in the answer.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s12: {
    eyebrow: { uz: 'Ish tartibi', ru: 'Порядок работы', en: 'The working order' },
    title: {
      uz: 'Formuladan qanday foydalanamiz?',
      ru: 'Как пользуемся формулой?',
      en: 'How do we use a formula?',
    },
    question: {
      uz: 'Qaysi tartib xatoga yo\'l qo\'ymaydi?',
      ru: 'Какой порядок не даёт ошибиться?',
      en: 'Which order keeps you from making mistakes?',
    },
    options: [
      {
        uz: "Shaklni aniqlayman, formulani tanlayman, harflar o'rniga sonlarni qo'yaman",
        ru: 'Определяю фигуру, выбираю формулу, ставлю числа вместо букв',
        en: 'I identify the figure, choose the formula, and put numbers in place of the letters',
      },
      {
        uz: "Sonlarni qo'yaman, keyin qaysi shakl ekanini aniqlayman",
        ru: 'Ставлю числа, а потом определяю, какая это фигура',
        en: 'I put the numbers in first and then work out which figure it is',
      },
      {
        uz: "Har safar to'rtta tomonni qo'lda qo'shaman",
        ru: 'Каждый раз складываю четыре стороны вручную',
        en: 'I add the four sides by hand every time',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Formula shaklga bog'liq, shuning uchun avval shakl aniqlanadi. Faqat shundan keyin sonlar qo'yiladi.",
      ru: 'Верно. Формула зависит от фигуры, поэтому сначала определяют фигуру. И только потом ставят числа.',
      en: 'Correct. The formula depends on the figure, so the figure is identified first. Only then do the numbers go in.',
    },
    wrong: [
      null,
      {
        uz: "Sonlarni qayerga qo'yish kerakligi formulaga bog'liq, formula esa shaklga. Tartib teskari bo'lib qolgan.",
        ru: 'Куда ставить числа, зависит от формулы, а формула от фигуры. Порядок перевёрнут.',
        en: 'Where the numbers go depends on the formula, and the formula depends on the figure. The order is reversed.',
      },
      {
        uz: "Bu ham javob beradi, lekin formula aynan shu qo'shishni bir marta yozib qo'yish uchun kerak. O'n ikkita uchastkada qo'lda qo'shish uzoq va xatoli.",
        ru: 'Так тоже получится, но формула нужна именно затем, чтобы записать это сложение один раз. На двенадцати участках вручную долго и легко ошибиться.',
        en: 'That works too, but the formula exists precisely to write that addition down once. Doing twelve plots by hand is slow and error prone.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ra'no byuro uchun ish tartibini yozib qo'ymoqchi.",
          "Uchta tartib taklif qilindi, ulardan bittasi xatoga yo'l qo'ymaydi.",
          'Mosini tanlang.',
        ],
        ru: [
          'Рано хочет записать для бюро порядок работы.',
          'Предложено три порядка, и только один не даёт ошибиться.',
          'Выбери подходящий.',
        ],
        en: [
          'Rano wants to write down the working order for the bureau.',
          'Three orders are proposed, and only one keeps you from making mistakes.',
          'Choose the right one.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s13: {
    eyebrow: { uz: 'Bit chizmasi', ru: 'Чертёж Bit', en: "Bit's drawing" },
    title: {
      uz: 'Bit tomonlarni kattalashtirmadi',
      ru: 'Bit не увеличил стороны',
      en: 'Bit did not enlarge the sides',
    },
    question: {
      uz: 'Bit qayerda adashdi?',
      ru: 'Где ошибся Bit?',
      en: 'Where did Bit go wrong?',
    },
    options: [
      {
        uz: "Avval tomonlarni 7 sm ga oshirib, keyin formulaga qo'yish kerak edi",
        ru: 'Сначала нужно было увеличить стороны на 7 см, а потом подставить в формулу',
        en: 'The sides had to be increased by 7 cm first, and only then substituted into the formula',
      },
      {
        uz: "Formulada ikkiga emas, to'rtga ko'paytirish kerak edi",
        ru: 'В формуле нужно было умножать не на два, а на четыре',
        en: 'The formula should have multiplied by four, not by two',
      },
      {
        uz: 'Yettini qo\'shish emas, ayirish kerak edi',
        ru: 'Семь нужно было вычесть, а не прибавить',
        en: 'Seven should have been subtracted, not added',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yangi tomonlar yigirma va o'n besh santimetr. P teng ikki ko'paytiriladi qavs ichida yigirma qo'shildi o'n besh, ya'ni yetmish santimetr.",
      ru: 'Верно. Новые стороны двадцать и пятнадцать сантиметров. P равно два умножить на скобку двадцать плюс пятнадцать, то есть семьдесят сантиметров.',
      en: 'Correct. The new sides are twenty and fifteen centimetres. P equals two times the bracket twenty plus fifteen, that is seventy centimetres.',
    },
    wrong: [
      null,
      {
        uz: "Bu to'rtburchak, kvadrat emas. To'rtga faqat teng tomonli kvadratda ko'paytiriladi.",
        ru: 'Это прямоугольник, а не квадрат. На четыре умножают только у квадрата с равными сторонами.',
        en: 'This is a rectangle, not a square. Multiplying by four applies only to a square with equal sides.',
      },
      {
        uz: "Shartda tomonlar oshirilgan, demak qo'shish to'g'ri. Xato boshqa joyda: qo'shish formuladan oldin bo'lishi kerak edi.",
        ru: 'По условию стороны увеличили, значит прибавление верное. Ошибка в другом: прибавить нужно было до формулы.',
        en: 'The sides were increased, so adding is right. The mistake is elsewhere: the adding had to happen before the formula.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit uzunligi o'n uch, eni sakkiz santimetr bo'lgan uchastkani oldi. Har bir tomon yetti santimetrga oshirildi.",
          "Bit eski tomonlarni formulaga qo'ydi va oxirida yetti qo'shdi. Javobi qirq to'qqiz chiqdi.",
          'Bit qayerda adashganini toping.',
        ],
        ru: [
          'Bit взял участок длиной тринадцать и шириной восемь сантиметров. Каждую сторону увеличили на семь сантиметров.',
          'Bit подставил в формулу старые стороны, а в конце прибавил семь. У него вышло сорок девять.',
          'Найди, где Bit ошибся.',
        ],
        en: [
          'Bit took a plot thirteen centimetres long and eight wide. Each side was increased by seven centimetres.',
          'Bit substituted the old sides into the formula and added seven at the end. He got forty nine.',
          'Find where Bit went wrong.',
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  s14: {
    eyebrow: { uz: 'Haqiqiy uchastka', ru: 'Настоящий участок', en: 'A real plot' },
    title: {
      uz: 'Park atrofidagi panjara',
      ru: 'Ограда вокруг парка',
      en: 'The fence around the park',
    },
    question: {
      uz: "Uzunligi 635 m, eni 768 m. Panjara uzunligi qancha?",
      ru: 'Длина 635 м, ширина 768 м. Какова длина ограды?',
      en: 'The length is 635 m and the width is 768 m. How long is the fence?',
    },
    options: [
      { uz: '2806 m', ru: '2806 м', en: '2806 m' },
      { uz: '1403 m', ru: '1403 м', en: '1403 m' },
      { uz: '5612 m', ru: '5612 м', en: '5612 m' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Olti yuz o'ttiz besh qo'shildi yetti yuz oltmish sakkiz bir ming to'rt yuz uch beradi, uni ikkiga ko'paytirsak ikki ming sakkiz yuz olti metr chiqadi.",
      ru: 'Верно. Шестьсот тридцать пять плюс семьсот шестьдесят восемь даёт тысячу четыреста три, а умножив на два, получаем две тысячи восемьсот шесть метров.',
      en: 'Correct. Six hundred thirty five plus seven hundred sixty eight is one thousand four hundred three, and multiplied by two it gives two thousand eight hundred six metres.',
    },
    wrong: [
      null,
      {
        uz: "Bu faqat uzunlik va enning yig'indisi, ya'ni ikkita tomon. Panjara to'rtta tomon bo'ylab yuradi.",
        ru: 'Это только сумма длины и ширины, то есть две стороны. Ограда идёт по четырём сторонам.',
        en: 'That is only the sum of the length and the width, that is two sides. The fence runs along four sides.',
      },
      {
        uz: "To'rtga ko'paytirilgan. To'rtga faqat kvadratda ko'paytiriladi, bu yerda esa tomonlar har xil.",
        ru: 'Умножено на четыре. На четыре умножают только у квадрата, а здесь стороны разные.',
        en: 'That is multiplied by four. Four applies only to a square, and here the sides differ.',
      },
    ],
    audio: {
      intro: {
        uz: [
          'Byuro loyihasi tugadi, endi haqiqiy uchastka keldi.',
          "Yer uchastkasining uzunligi olti yuz o'ttiz besh metr, eni yetti yuz oltmish sakkiz metr.",
          'Panjara uchun qancha uzunlik kerakligini toping.',
        ],
        ru: [
          'Проект бюро завершён, теперь пришёл настоящий участок.',
          'Длина земельного участка шестьсот тридцать пять метров, ширина семьсот шестьдесят восемь метров.',
          'Найди, какая длина нужна для ограды.',
        ],
        en: [
          'The bureau project is finished, and now a real plot has arrived.',
          'The land plot is six hundred thirty five metres long and seven hundred sixty eight metres wide.',
          'Find how much fence length is needed.',
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
      uz: 'Formula nima uchun kerakligini ayting va unvonni oling.',
      ru: 'Скажи, зачем нужна формула, и получи звание.',
      en: 'Say what a formula is for and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: 'Formula nima?',
      ru: 'Что такое формула?',
      en: 'What is a formula?',
    },
    reflectionStart: {
      uz: 'Formula — bu…',
      ru: 'Формула это…',
      en: 'A formula is…',
    },
    reflectionOptions: [
      {
        uz: "bir marta yozilgan va har qanday sonlarda ishlaydigan qoida",
        ru: 'правило, записанное один раз и работающее с любыми числами',
        en: 'a rule written once that works with any numbers',
      },
      {
        uz: 'bitta shakl uchun tayyor javob',
        ru: 'готовый ответ для одной фигуры',
        en: 'a ready answer for one figure',
      },
      {
        uz: "harflardan tuzilgan, ma'nosi yo'q yozuv",
        ru: 'запись из букв без смысла',
        en: 'a record made of letters with no meaning',
      },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Harf istalgan sonni qabul qiladi, shuning uchun bitta formula minglab uchastkaga yetadi.",
      ru: 'Верно. Буква принимает любое число, поэтому одной формулы хватает на тысячи участков.',
      en: 'Correct. A letter accepts any number, so one formula is enough for thousands of plots.',
    },
    reflectionWrong: {
      uz: "Formula bitta shaklga bog'lanib qolmaydi va bo'sh yozuv ham emas. U takrorlanadigan amallarni harflar bilan saqlaydi.",
      ru: 'Формула не привязана к одной фигуре и не является пустой записью. Она хранит повторяющиеся действия в буквах.',
      en: 'A formula is not tied to one figure and is not an empty record. It stores repeating actions in letters.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Byuro bosh muhandisi', ru: 'Главный инженер бюро', en: 'Chief bureau engineer' } },
      { min: 3, title: { uz: 'Loyiha hisobchisi', ru: 'Расчётчик проекта', en: 'Project calculator' } },
      { min: 0, title: { uz: 'Byuro chizmachisi', ru: 'Чертёжник бюро', en: 'Bureau draughtsman' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "To'rtburchak perimetri: P = 2 × (a + b).",
        ru: 'Периметр прямоугольника: P = 2 × (a + b).',
        en: 'Perimeter of a rectangle: P = 2 × (a + b).',
      },
      {
        uz: 'Kvadrat perimetri: P = 4 × a.',
        ru: 'Периметр квадрата: P = 4 × a.',
        en: 'Perimeter of a square: P = 4 × a.',
      },
      {
        uz: "Tomonlari har xil to'rtburchak: P = a + b + c + d.",
        ru: 'Четырёхугольник с разными сторонами: P = a + b + c + d.',
        en: 'Quadrilateral with different sides: P = a + b + c + d.',
      },
      {
        uz: "Yuza: S = a × b. Perimetr sm da, yuza kv. sm da yoziladi.",
        ru: 'Площадь: S = a × b. Периметр пишут в см, площадь в кв. см.',
        en: 'Area: S = a × b. The perimeter is written in cm, the area in sq. cm.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Asboblar tilini o'qish: shkalalar va bir bo'linma qiymati.",
      ru: 'Читать язык приборов: шкалы и цена одного деления.',
      en: 'Reading the language of instruments: scales and the value of one division.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Byuro chizmalari bitta qoidaga tayanadigan bo'ldi.",
          "Bugun siz takrorlanadigan amalni harflar bilan yozishni va unga qiymat qo'yishni o'rgandingiz.",
          'Unvonni ochish uchun bitta savol qoldi.',
        ],
        ru: [
          'Миссия выполнена. Чертежи бюро теперь опираются на одно правило.',
          'Сегодня ты умеешь записывать повторяющееся действие буквами и подставлять в него значения.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The bureau drawings now rest on a single rule.',
          'Today you can write a repeating action with letters and substitute values into it.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

// s0, s14 — byuro stoli: yog'och stol, chizma qog'ozi, chizg'ich va qalam.
const BureauScene = ({ mode = 'hook', solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 464">
      <defs>
        <linearGradient id="d16-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7F0F2" />
          <stop offset="1" stopColor="#F6FAF9" />
        </linearGradient>
        <linearGradient id="d16-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C79A63" />
          <stop offset="1" stopColor="#A97C48" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="520" height="464" rx="22" fill="url(#d16-wall)" />

      {/* deraza */}
      <rect x="330" y="34" width="150" height="104" rx="10" fill="#DCEEF2" stroke="#BBD6DD" strokeWidth="2.4" />
      <line x1="405" y1="34" x2="405" y2="138" stroke="#BBD6DD" strokeWidth="2.4" />
      <line x1="330" y1="86" x2="480" y2="86" stroke="#BBD6DD" strokeWidth="2.4" />

      {/* stol chiroq */}
      <path d="M62 132 l44 -46 l22 18 l-44 46 z" fill="#2E4A5C" />
      <rect x="52" y="130" width="46" height="12" rx="5" fill="#22394A" />
      <rect x="66" y="142" width="18" height="52" rx="6" fill="#2E4A5C" />
      <rect x="52" y="190" width="46" height="10" rx="5" fill="#22394A" />

      {/* stol */}
      <path d="M12 206 L508 206 L486 424 L34 424 Z" fill="url(#d16-desk)" />
      <path d="M12 206 L508 206 L505 220 L15 220 Z" fill="rgba(255,255,255,.22)" />

      {/* chizma qog'ozi */}
      <g>
        <rect x="52" y="222" width="416" height="188" rx="8" fill="#FDFDF8" stroke="rgba(23,59,82,.16)" strokeWidth="1.8" />
        {Array.from({ length: 15 }, (_, index) => (
          <line key={`v-${index}`} x1={68 + index * 26} y1="234" x2={68 + index * 26} y2="398" stroke="rgba(22,143,163,.10)" strokeWidth="1" />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <line key={`h-${index}`} x1="60" y1={244 + index * 26} x2="460" y2={244 + index * 26} stroke="rgba(22,143,163,.10)" strokeWidth="1" />
        ))}
      </g>

      {mode === 'hook' ? (
        <g>
          <rect x="86" y="256" width="112" height="76" rx="4" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2.4" />
          <text x="142" y="250" textAnchor="middle" fill={T.cyan} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">3</text>
          <text x="74" y="300" textAnchor="middle" fill={T.cyan} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">2</text>
          <text x="142" y="360" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            2 × (3 + 2)
          </text>
          <text x="142" y="386" textAnchor="middle" fill={T.success} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            = 10
          </text>

          <rect x="288" y="248" width="136" height="92" rx="4" fill={T.accentSoft} stroke={T.accent} strokeWidth="2.4" />
          <text x="356" y="242" textAnchor="middle" fill={T.accent} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">4</text>
          <text x="274" y="300" textAnchor="middle" fill={T.accent} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">5</text>
          <text x="356" y="360" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            2 × (4 + 5)
          </text>
          <text x="356" y="386" textAnchor="middle" fill={T.success} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            = 18
          </text>
        </g>
      ) : (
        <g>
          <text x="260" y="256" textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Yer uchastkasi', ru: 'Земельный участок', en: 'The land plot' })}
          </text>
          <rect x="132" y="272" width="256" height="78" rx="4" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2.4" />
          <text x="260" y="318" textAnchor="middle" fill={T.cyan} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            768 m
          </text>
          <text x="112" y="316" textAnchor="end" fill={T.cyan} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            635 m
          </text>
          <text
            x="260"
            y="384"
            textAnchor="middle"
            fill={solved ? T.success : T.ink3}
            fontSize="20"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
          >
            {solved ? 'P = 2 × 1403 = 2806 m' : 'P = 2 × (635 + 768)'}
          </text>
        </g>
      )}

      {/* chizg'ich va qalam */}
      <rect x="66" y="416" width="196" height="14" rx="4" fill="#F2E7C8" stroke="#D8C79A" strokeWidth="1.4" transform="rotate(-3 164 423)" />
      <path d="M300 428 l106 -16 l6 10 l-106 16 z" fill="#E7A33C" transform="rotate(-2 353 425)" />
      <path d="M406 412 l14 3 l-8 8 z" fill="#3B2A21" transform="rotate(-2 413 418)" />
    </FitSvg>
  );
};

// To'rtburchak: tomonlari imzolangan, kerak bo'lsa kataklar bilan.
const RectFigure = ({
  a = 'a', b = 'b', frame = 4, cells = false, formula = null, result = null, tone = T.cyan,
}) => {
  const t = useT();
  const w = 236;
  const h = 104;
  const x0 = 142;
  const y0 = 34;
  const cols = typeof a === 'number' ? a : 3;
  const rows = typeof b === 'number' ? b : 5;
  return (
    <FitSvg viewBox="0 0 520 232">
      <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x={x0} y={y0} width={w} height={h} rx="4" fill={cells ? '#FFFFFF' : T.cyanSoft} stroke={tone} strokeWidth="2.6" />
        {cells && Array.from({ length: cols - 1 }, (_, index) => (
          <line key={`c-${index}`} x1={x0 + ((index + 1) * w) / cols} y1={y0} x2={x0 + ((index + 1) * w) / cols} y2={y0 + h} stroke="rgba(22,143,163,.35)" strokeWidth="1.2" />
        ))}
        {cells && Array.from({ length: rows - 1 }, (_, index) => (
          <line key={`r-${index}`} x1={x0} y1={y0 + ((index + 1) * h) / rows} x2={x0 + w} y2={y0 + ((index + 1) * h) / rows} stroke="rgba(22,143,163,.35)" strokeWidth="1.2" />
        ))}
      </g>
      <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <text x={x0 + w / 2} y={y0 - 12} textAnchor="middle" fill={tone} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {a}
        </text>
        <text x={x0 - 16} y={y0 + h / 2 + 7} textAnchor="end" fill={tone} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {b}
        </text>
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        {formula && (
          <>
            <rect x="118" y="160" width="284" height="42" rx="12" fill="#FFFFFF" stroke={T.ink3} strokeWidth="1.6" />
            <text x="260" y="188" textAnchor="middle" fill={T.ink} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {formula}
            </text>
          </>
        )}
        {result && (
          <text x="260" y="224" textAnchor="middle" fill={T.success} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {result}
          </text>
        )}
        {!formula && !result && (
          <Caption x={260} y={186} text={t({ uz: 'Panjara chekka bo\'ylab yuradi', ru: 'Ограда идёт по краю', en: 'The fence runs along the edge' })} />
        )}
      </g>
    </FitSvg>
  );
};

// Kvadrat.
const SquareFigure = ({ frame = 4, picked = null, solved = false }) => {
  const t = useT();
  const side = 118;
  const x0 = 92;
  const y0 = 44;
  return (
    <FitSvg viewBox="0 0 520 232">
      <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x={x0} y={y0} width={side} height={side} rx="4" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2.6" />
        {[
          { x: x0 + side / 2, y: y0 - 12 },
          { x: x0 + side / 2, y: y0 + side + 22 },
          { x: x0 - 14, y: y0 + side / 2 + 6 },
          { x: x0 + side + 14, y: y0 + side / 2 + 6 },
        ].map((point, index) => (
          <text key={index} x={point.x} y={point.y} textAnchor="middle" fill={T.cyan} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            a
          </text>
        ))}
      </g>
      <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <Plate x={258} y={54} w={216} h={44} text="a + a + a + a" kind="known" size={19} />
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <Plate x={258} y={116} w={216} h={44} text="4 × a" kind={solved || picked === null ? 'result' : 'unknown'} size={22} lit={solved} />
        <Caption x={366} y={186} text={t({ uz: 'a = 3 sm bo\'lsa, P = 12 sm', ru: 'При a = 3 см получаем P = 12 см', en: 'With a = 3 cm we get P = 12 cm' })} />
      </g>
    </FitSvg>
  );
};

// Tomonlari har xil to'rtburchak.
const QuadFigure = ({ solved = false, step = 0 }) => {
  const t = useT();
  const points = [[136, 40], [372, 62], [340, 186], [156, 168]];
  const labels = ['a', 'b', 'c', 'd'];
  return (
    <FitSvg viewBox="0 0 520 232">
      <polygon
        points={points.map((point) => point.join(',')).join(' ')}
        fill={solved ? T.successSoft : T.cyanSoft}
        stroke={solved ? T.success : T.cyan}
        strokeWidth="2.6"
      />
      {points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        const mx = (point[0] + next[0]) / 2;
        const my = (point[1] + next[1]) / 2;
        const on = step > index * 2;
        return (
          <g key={index}>
            <circle cx={mx} cy={my} r="14" fill="#FFFFFF" stroke={on ? T.accent : T.ink3} strokeWidth={on ? 2.4 : 1.6} />
            <text x={mx} y={my + 6} textAnchor="middle" fill={on ? T.accent : T.ink3} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {labels[index]}
            </text>
          </g>
        );
      })}
      <Caption
        x={260}
        y={216}
        text={solved
          ? '4 + 2 + 3 + 2 = 11'
          : t({ uz: "To'rtta tomon ham har xil", ru: 'Все четыре стороны разные', en: 'All four sides are different' })}
        tone={solved ? T.success : T.ink3}
        size={solved ? 17 : 13}
      />
    </FitSvg>
  );
};

// s9 — perimetr va yuza yonma-yon.
const CompareFigure = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 232">
      <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x="46" y="42" width="180" height="104" rx="4" fill="#FFFFFF" stroke={T.accent} strokeWidth="4" />
        <text x="136" y="176" textAnchor="middle" fill={T.accent} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          P = 2 × (a + b)
        </text>
        <Caption x={136} y={200} text={t({ uz: 'chekka, sm', ru: 'край, см', en: 'edge, cm' })} tone={T.accent} />
      </g>
      <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
        <rect x="294" y="42" width="180" height="104" rx="4" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
        {Array.from({ length: 5 }, (_, index) => (
          <line key={`v-${index}`} x1={294 + (index + 1) * 30} y1="42" x2={294 + (index + 1) * 30} y2="146" stroke="rgba(22,143,163,.35)" strokeWidth="1.2" />
        ))}
        {Array.from({ length: 2 }, (_, index) => (
          <line key={`h-${index}`} x1="294" y1={42 + (index + 1) * 34.6} x2="474" y2={42 + (index + 1) * 34.6} stroke="rgba(22,143,163,.35)" strokeWidth="1.2" />
        ))}
        <text x="384" y="176" textAnchor="middle" fill={T.cyan} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          S = a × b
        </text>
        <Caption x={384} y={200} text={t({ uz: 'ichkari, kv. sm', ru: 'внутри, кв. см', en: 'inside, sq. cm' })} tone={T.cyan} />
      </g>
    </FitSvg>
  );
};

// s13 — Bit ning yozuvi.
const BitPlanFigure = ({ solved = false }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="28" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: '13 sm va 8 sm, har bir tomon 7 sm ga oshdi', ru: '13 см и 8 см, каждая сторона выросла на 7 см', en: '13 cm and 8 cm, each side grew by 7 cm' })}
      </text>
      <rect x="76" y="48" width="368" height="52" rx="14" fill="#FFF6F3" stroke={T.accent} strokeWidth="2.2" />
      <text x="260" y="81" textAnchor="middle" fill={T.accent} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        2 × (13 + 8) + 7 = 49
      </text>
      <text x="260" y="124" textAnchor="middle" fill={T.ink3} fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: 'Bit shunday yozdi', ru: 'Так записал Bit', en: 'That is how Bit wrote it' })}
      </text>
      <rect
        x="76"
        y="140"
        width="368"
        height="52"
        rx="14"
        fill={solved ? T.successSoft : 'rgba(23,59,82,.04)'}
        stroke={solved ? T.success : T.ink3}
        strokeWidth={solved ? 2.4 : 1.4}
        strokeDasharray={solved ? '' : '5 5'}
      />
      <text
        x="260"
        y="173"
        textAnchor="middle"
        fill={solved ? T.success : T.ink3}
        fontSize="19"
        fontWeight="800"
        fontFamily="JetBrains Mono, monospace"
      >
        {solved ? '2 × (20 + 15) = 70' : '2 × ( ? + ? ) = ?'}
      </text>
      {solved && (
        <Caption x={260} y={216} text={t({ uz: '13 + 7 = 20, 8 + 7 = 15', ru: '13 + 7 = 20, 8 + 7 = 15', en: '13 + 7 = 20, 8 + 7 = 15' })} tone={T.success} />
      )}
    </FitSvg>
  );
};

// s11 — qoidalar kartasi (HTML: balandlik matnga qarab).
const RulePanel = ({ frame = 0 }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: "To'rtburchak", ru: 'Прямоугольник', en: 'Rectangle' }),
          body: t({ uz: "Ikkita uzunlik va ikkita en", ru: 'Две длины и две ширины', en: 'Two lengths and two widths' }),
          formula: 'P = 2 × (a + b)',
        },
        {
          tone: T.navy,
          head: t({ uz: 'Kvadrat', ru: 'Квадрат', en: 'Square' }),
          body: t({ uz: "To'rtta teng tomon", ru: 'Четыре равные стороны', en: 'Four equal sides' }),
          formula: 'P = 4 × a',
        },
        {
          tone: T.accent,
          head: t({ uz: "Har xil tomonli to'rtburchak", ru: 'Четырёхугольник с разными сторонами', en: 'Quadrilateral with different sides' }),
          body: t({ uz: 'Har bir tomon alohida', ru: 'Каждая сторона отдельно', en: 'Every side separately' }),
          formula: 'P = a + b + c + d',
        },
        {
          tone: T.success,
          head: t({ uz: 'Yuza', ru: 'Площадь', en: 'Area' }),
          body: t({ uz: 'Ichkaridagi kataklar soni, kv. sm', ru: 'Количество клеток внутри, кв. см', en: 'The number of cells inside, sq. cm' }),
          formula: 'S = a × b',
        },
      ]}
    />
  );
};

// s12 — ish tartibi.
const OrderPanel = ({ solved = false }) => {
  const t = useT();
  return (
    <StepList
      steps={[
        t({ uz: 'Shaklni aniqlayman', ru: 'Определяю фигуру', en: 'I identify the figure' }),
        t({ uz: 'Formulani tanlayman', ru: 'Выбираю формулу', en: 'I choose the formula' }),
        t({ uz: "Harflar o'rniga sonlarni qo'yaman", ru: 'Ставлю числа вместо букв', en: 'I put numbers in place of the letters' }),
        t({ uz: 'Javobga birlikni yozaman', ru: 'Пишу единицу в ответе', en: 'I write the unit in the answer' }),
      ]}
      showHint={solved}
      hint={t({
        uz: 'Shakl formulani tanlaydi, formula esa sonlarning joyini belgilaydi.',
        ru: 'Фигура выбирает формулу, а формула задаёт места для чисел.',
        en: 'The figure chooses the formula, and the formula sets the places for the numbers.',
      })}
    />
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={() => <BureauScene />} />
);
const Screen1 = (props) => (
  <RevealScreen {...props} figure={({ frame }) => <RectFigure frame={frame} formula={frame >= 3 ? '2 × (a + b)' : null} />} />
);
const Screen2 = (props) => (
  <FormulaBuild {...props} figure={({ step }) => <RectFigure frame={4} formula={step >= 7 ? '2 × (a + b)' : null} />} />
);
const Screen3 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <RectFigure
        a={2}
        b={5}
        frame={frame}
        formula={frame >= 3 ? '2 × (2 + 5) = 2 × 7' : null}
        result={frame >= 3 ? '14 sm' : null}
      />
    )}
  />
);
const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    figure={({ solved }) => (
      <RectFigure a={6} b={11} frame={4} formula="2 × (6 + 11)" result={solved ? '34 sm' : null} />
    )}
  />
);
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <SquareFigure frame={frame} />} />;
const Screen6 = (props) => (
  <ChoiceScreen {...props} ordinal={1} figure={({ solved }) => <SquareFigure frame={3} solved={solved} picked={solved ? null : 0} />} />
);
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <RectFigure a={3} b={5} frame={frame} cells tone={T.cyan} formula={frame >= 3 ? '3 × 5 = 15 kv. sm' : null} />
    )}
  />
);
const Screen8 = (props) => <TableFill {...props} />;
const Screen9 = (props) => <RevealScreen {...props} figure={({ frame }) => <CompareFigure frame={frame} />} />;
const Screen10 = (props) => (
  <FormulaBuild {...props} figure={({ step, solved }) => <QuadFigure step={step} solved={solved} />} />
);
const Screen11 = (props) => (
  <RevealScreen {...props} plain figure={({ frame }) => <RulePanel frame={frame + 1} />} />
);
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={3} stack plain figure={({ solved }) => <OrderPanel solved={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={4} stack figure={({ solved }) => <BitPlanFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={5} figure={({ solved }) => <BureauScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars16(props) {
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
