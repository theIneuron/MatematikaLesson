// ============================================================================
// 4-SINF · Dars 46 · Qism va butunni topishga doir masalalar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri:
//   138-bet "Sonning kasrini topish" — 12 cm kesma va Komilning yechimi
//     (12 : 2 = 6; 12 : 4 · 3 = 9; 12 : 3 · 2 = 8) hamda darslikning o'z
//     savoli: "Nima uchun Komilga ikkita amal bajarishga to'g'ri keldi?";
//   138-bet 2-topshiriq — 8 000 so'mning sakkizdan bir qismi;
//   139-bet 1-topshiriq — 20 km ning to'rtdan besh qismi (sxema tanlash);
//   142-bet "Sonni kasrdan topish" — 1/5 ulushi 9 cm bo'lsa butun kesma;
//     2-topshiriq (3/5 qismi 15 ga teng), 5-topshiriq (Avaz, 3/4 qismi 78 bet);
//   143-bet 5-topshiriq — chinnigullar uchdan bir qismi 30 ta.
// Syujet: boshqaruv markazining TAQSIMLASH PANELI (SYUJET_4SINF.md, 6-blok).
// 45-darsdan ko'prik: yuklar yo'lga chiqdi, endi ular taqsimlanadi.
//
// YADRO. Sonning kasrini topish IKKI amal: avval maxrajga bo'lamiz (bitta
// ulush), keyin suratga ko'paytiramiz. Teskari masalada esa aksincha: avval
// suratga bo'lamiz, keyin maxrajga ko'paytiramiz.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RecordRow,
  RevealScreen, RuleRows, StepList, StepRows, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'fracpart-4-46-v2',
  slug: 'dars46-qism-va-butunni-topish',
  lessonTitle: {
    uz: '46-dars. Qism va butunni topishga doir masalalar',
    ru: 'Урок 46. Задачи на нахождение части и целого',
    en: 'Lesson 46. Problems finding a part or a whole',
  },
  skillTags: ['unit_fraction', 'fraction_of_number', 'whole_from_part', 'two_actions', 'scheme_choice'],
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
    eyebrow: { uz: 'Taqsimlash paneli', ru: 'Панель распределения', en: 'The distribution panel' },
    title: {
      uz: 'Tumanga kam yuk ketdi',
      ru: 'В район ушло слишком мало',
      en: 'Too little went to the district',
    },
    question: {
      uz: 'Bit hisobda nimani unutdi?',
      ru: 'Что Bit забыл в расчёте?',
      en: 'What did Bit forget in the calculation?',
    },
    options: [
      { uz: 'Bitta ulushda to\'xtab qoldi', ru: 'Остановился на одной доле', en: 'He stopped at one share' },
      { uz: '12 ni 3 ga bo\'lish kerak edi', ru: 'Нужно было делить 12 на 3', en: 'He had to divide 12 by 3' },
      { uz: '12 ni 4 ga ko\'paytirish kerak edi', ru: 'Нужно было умножить 12 на 4', en: 'He had to multiply 12 by 4' },
      { uz: 'Kasr noto\'g\'ri o\'qilgan', ru: 'Дробь прочитана неверно', en: 'The fraction was read wrongly' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. U bitta chorakni topdi va to'xtadi. Kerak bo'lgani esa uchta chorak.",
      ru: 'Верно. Он нашёл одну четверть и остановился. А нужны были три четверти.',
      en: 'Correct. He found one quarter and stopped. But three quarters were needed.',
    },
    wrong: [
      null,
      {
        uz: "Maxraj to'rt, shuning uchun to'rtga bo'linadi. Uch soni surat, u boshqa qadamda ishlaydi.",
        ru: 'Знаменатель четыре, поэтому делят на четыре. Тройка — числитель, она работает на другом шаге.',
        en: 'The denominator is four, so we divide by four. The three is the numerator and works at another step.',
      },
      {
        uz: "Ko'paytirsak, javob butundan katta chiqadi. Qism butundan katta bo'lolmaydi.",
        ru: 'При умножении ответ станет больше целого. Часть не может быть больше целого.',
        en: 'Multiplying makes the answer larger than the whole. A part cannot exceed the whole.',
      },
      {
        uz: "Kasr to'g'ri o'qilgan: to'rtdan uch qism. Xato hisobning ikkinchi qadamida.",
        ru: 'Дробь прочитана верно: три четверти. Ошибка на втором шаге расчёта.',
        en: 'The fraction was read correctly: three quarters. The error is at the second step.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Yuklar yo'lga chiqdi va endi taqsimlash paneliga tushdi.",
          "Omborda o'n ikkita modul bor. Tumanga ularning to'rtdan uch qismi kerak.",
          "Bit panelga uchta modul yubordi. Tuman kam yuk keldi deb xabar berdi.",
          "Bit hisobda nimani unutdi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Грузы вышли в путь и попали на панель распределения.',
          'На складе двенадцать модулей. Району нужны три четверти из них.',
          'Bit отправил на панель три модуля. Район сообщил, что груза мало.',
          'Что Bit забыл в расчёте? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The loads have set off and reached the distribution panel.',
          'The store holds twelve modules. The district needs three quarters of them.',
          'Bit sent three modules to the panel. The district reported that the load was too small.',
          'What did Bit forget in the calculation? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Bitta ulush', ru: 'Одна доля', en: 'One share' },
    title: {
      uz: 'Avval bitta ulushni topamiz',
      ru: 'Сначала находим одну долю',
      en: 'First we find one share',
    },
    lead: {
      uz: "Butunni maxrajga bo'lsak, bitta ulush qanchaligi chiqadi.",
      ru: 'Разделив целое на знаменатель, узнаем, чему равна одна доля.',
      en: 'Dividing the whole by the denominator tells how much one share is.',
    },
    note: {
      uz: 'Maxraj butun necha teng bo\'lakka bo\'linganini bildiradi.',
      ru: 'Знаменатель показывает, на сколько равных частей разделено целое.',
      en: 'The denominator shows into how many equal parts the whole is divided.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikda o'n ikki santimetrli kesma olingan. Biz uni modul lentasi qilib olamiz.",
          "To'rtdan uch qism kerak, demak butunni to'rt teng bo'lakka ajratamiz.",
          "O'n ikkini to'rtga bo'lsak, uch chiqadi. Bitta chorak uchta modul.",
          "Bit aynan shu yerda to'xtagan edi. Lekin bu bitta ulush, uchtasi emas.",
        ],
        ru: [
          'В учебнике взят отрезок в двенадцать сантиметров. Мы возьмём его как ленту модулей.',
          'Нужны три четверти, значит делим целое на четыре равные части.',
          'Двенадцать разделить на четыре, получится три. Одна четверть это три модуля.',
          'Именно здесь Bit и остановился. Но это одна доля, а не три.',
        ],
        en: [
          'The textbook takes a segment of twelve centimetres. We take it as a strip of modules.',
          'Three quarters are needed, so we split the whole into four equal parts.',
          'Twelve divided by four gives three. One quarter is three modules.',
          'That is exactly where Bit stopped. But this is one share, not three.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Yarmi', ru: 'Половина', en: 'A half' },
    title: {
      uz: '12 ning yarmi qancha?',
      ru: 'Чему равна половина от 12?',
      en: 'How much is a half of 12?',
    },
    question: {
      uz: '12 modulning ikkidan bir qismi nechta modul?',
      ru: 'Сколько модулей составляет одна вторая от 12?',
      en: 'How many modules make one half of 12?',
    },
    options: [
      { uz: '6', ru: '6', en: '6' },
      { uz: '2', ru: '2', en: '2' },
      { uz: '24', ru: '24', en: '24' },
      { uz: '10', ru: '10', en: '10' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Maxraj ikki, shuning uchun o'n ikkini ikkiga bo'lamiz: olti modul.",
      ru: 'Верно. Знаменатель два, поэтому делим двенадцать на два: шесть модулей.',
      en: 'Correct. The denominator is two, so we divide twelve by two: six modules.',
    },
    wrong: [
      null,
      {
        uz: "Bu maxrajning o'zi. Bo'linadigan son butun, ya'ni o'n ikki.",
        ru: 'Это сам знаменатель. Делить нужно целое, то есть двенадцать.',
        en: 'That is the denominator itself. The number to divide is the whole, that is twelve.',
      },
      {
        uz: "Bu ko'paytirish natijasi. Ulush butundan kichik bo'ladi.",
        ru: 'Это результат умножения. Доля меньше целого.',
        en: 'That is the result of multiplication. A share is smaller than the whole.',
      },
      {
        uz: "Bu ayirish natijasi. Ulushni topishda bo'lish ishlaydi.",
        ru: 'Это результат вычитания. При нахождении доли работает деление.',
        en: 'That is the result of subtraction. Finding a share works by division.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Panelga birinchi buyurtma keldi: o'n ikki moduldan ikkidan bir qism.",
          "Maxrajga qarang: u butun necha bo'lakka bo'linishini aytadi.",
          "Nechta modul chiqadi? Javobni tanlang.",
        ],
        ru: [
          'На панель пришёл первый заказ: одна вторая от двенадцати модулей.',
          'Посмотри на знаменатель: он говорит, на сколько частей делят целое.',
          'Сколько модулей получится? Выбери ответ.',
        ],
        en: [
          'The first order reached the panel: one half of twelve modules.',
          'Look at the denominator: it tells into how many parts the whole is divided.',
          'How many modules is that? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Ikkinchi qadam', ru: 'Второй шаг', en: 'The second step' },
    title: {
      uz: 'Nechta ulush kerak?',
      ru: 'Сколько долей нужно?',
      en: 'How many shares are needed?',
    },
    lead: {
      uz: "Surat nechta ulush olinishini bildiradi: bitta ulushni shunga ko'paytiramiz.",
      ru: 'Числитель говорит, сколько долей берут: умножаем одну долю на него.',
      en: 'The numerator says how many shares are taken: we multiply one share by it.',
    },
    note: {
      uz: "Darslik so'raydi: nima uchun bu yerda ikkita amal kerak bo'ldi?",
      ru: 'Учебник спрашивает: почему здесь понадобились два действия?',
      en: 'The textbook asks: why were two actions needed here?',
    },
    audio: {
      intro: {
        uz: [
          "Bitta chorak uchta modul edi. Endi suratga qaraymiz: u uchga teng.",
          "Demak uchta chorak kerak. Uchni uchga ko'paytiramiz.",
          "To'qqizta modul chiqadi. Tuman aynan shuncha kutgan edi.",
          "Shuning uchun bu yerda ikkita amal bor: avval bo'lish, keyin ko'paytirish.",
        ],
        ru: [
          'Одна четверть была равна трём модулям. Теперь посмотрим на числитель: он равен трём.',
          'Значит, нужны три четверти. Умножаем три на три.',
          'Получается девять модулей. Именно столько и ждал район.',
          'Поэтому здесь два действия: сначала деление, потом умножение.',
        ],
        en: [
          'One quarter was three modules. Now look at the numerator: it equals three.',
          'So three quarters are needed. We multiply three by three.',
          'That gives nine modules. That is exactly what the district expected.',
          'That is why there are two actions here: first division, then multiplication.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Uchdan ikki qism',
      ru: 'Две трети',
      en: 'Two thirds',
    },
    question: {
      uz: '12 modulning uchdan ikki qismi nechta?',
      ru: 'Сколько модулей составляют две трети от 12?',
      en: 'How many modules make two thirds of 12?',
    },
    answer: 8,
    unit: { uz: 'modul', ru: 'мод.', en: 'modules' },
    correctText: {
      uz: "To'g'ri. O'n ikkini uchga bo'ldik, keyin ikkiga ko'paytirdik: sakkiz modul.",
      ru: 'Верно. Двенадцать разделили на три, потом умножили на два: восемь модулей.',
      en: 'Correct. We divided twelve by three, then multiplied by two: eight modules.',
    },
    wrong: {
      uz: "Hali emas. Avval maxrajga bo'ling, keyin suratga ko'paytiring.",
      ru: 'Пока нет. Сначала раздели на знаменатель, потом умножь на числитель.',
      en: 'Not yet. First divide by the denominator, then multiply by the numerator.',
    },
    hintAfter: {
      uz: "Bitta uchdan bir qism to'rt modul. Ikkitasi qancha bo'ladi?",
      ru: 'Одна треть это четыре модуля. Сколько же будут две?',
      en: 'One third is four modules. How much are two of them?',
    },
    audio: {
      intro: {
        uz: [
          "Yangi buyurtma: o'n ikki moduldan uchdan ikki qism.",
          "Ikki qadamni eslang: bo'lish, keyin ko'paytirish.",
          "Nechta modul chiqadi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Новый заказ: две трети от двенадцати модулей.',
          'Вспомни два шага: деление, потом умножение.',
          'Сколько модулей получится? Набери ответ и подтверди.',
        ],
        en: [
          'A new order: two thirds of twelve modules.',
          'Remember the two steps: division, then multiplication.',
          'How many modules is that? Type the answer and confirm.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Katta sonlar', ru: 'Большие числа', en: 'Larger numbers' },
    title: {
      uz: 'Usul sonlar kattalashsa ham',
      ru: 'Способ тот же и для больших чисел',
      en: 'The method holds for larger numbers',
    },
    lead: {
      uz: 'Ikki qadam har qanday sonda bir xil ishlaydi.',
      ru: 'Два шага работают одинаково при любых числах.',
      en: 'The two steps work the same way with any numbers.',
    },
    note: {
      uz: 'Bitta ulush topilgach, qolgani oddiy ko\'paytirish.',
      ru: 'Когда одна доля найдена, дальше идёт обычное умножение.',
      en: 'Once one share is found, the rest is plain multiplication.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikda qizchaning sakkiz ming so'm puli bor edi. U pulining sakkizdan bir qismini ishlatdi.",
          "Maxraj sakkiz, demak sakkiz mingni sakkizga bo'lamiz.",
          "Bir ming so'm chiqadi. Surat bir, shuning uchun ko'paytirish shart emas.",
          "Yigirma kilometrli yo'lda esa to'rtdan besh qismi asfaltlangan: yigirmani beshga bo'lib, to'rtga ko'paytiramiz.",
        ],
        ru: [
          'В учебнике у девочки было восемь тысяч сумов. Она потратила одну восьмую своих денег.',
          'Знаменатель восемь, значит делим восемь тысяч на восемь.',
          'Получается тысяча сумов. Числитель один, поэтому умножать не нужно.',
          'А на дороге в двадцать километров заасфальтированы четыре пятых: двадцать делим на пять и умножаем на четыре.',
        ],
        en: [
          'In the textbook a girl had eight thousand sums. She spent one eighth of her money.',
          'The denominator is eight, so we divide eight thousand by eight.',
          'That gives one thousand sums. The numerator is one, so no multiplication is needed.',
          'And on a road of twenty kilometres four fifths are paved: we divide twenty by five and multiply by four.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Asfalt yo\'l', ru: 'Асфальт', en: 'The paved road' },
    title: {
      uz: 'Necha kilometr asfaltlandi?',
      ru: 'Сколько километров заасфальтировали?',
      en: 'How many kilometres were paved?',
    },
    question: {
      uz: '20 km yo\'lning beshdan to\'rt qismi asfaltlandi. Necha km?',
      ru: 'Заасфальтировали четыре пятых дороги в 20 км. Сколько км?',
      en: 'Four fifths of a 20 km road were paved. How many km?',
    },
    options: [
      { uz: '16 km', ru: '16 км', en: '16 km' },
      { uz: '4 km', ru: '4 км', en: '4 km' },
      { uz: '25 km', ru: '25 км', en: '25 km' },
      { uz: '80 km', ru: '80 км', en: '80 km' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yigirmani beshga bo'ldik, to'rt chiqdi, keyin to'rtga ko'paytirdik: o'n olti kilometr.",
      ru: 'Верно. Двадцать разделили на пять, получилось четыре, потом умножили на четыре: шестнадцать километров.',
      en: 'Correct. Twenty divided by five is four, then multiplied by four: sixteen kilometres.',
    },
    wrong: [
      null,
      {
        uz: "Bu bitta beshdan bir qism. Bizga esa to'rtta shunday qism kerak.",
        ru: 'Это одна пятая. А нужны четыре таких части.',
        en: 'That is one fifth. But four such parts are needed.',
      },
      {
        uz: "Bu butundan katta. Yo'lning bir qismi butun yo'ldan uzun bo'lolmaydi.",
        ru: 'Это больше целого. Часть дороги не может быть длиннее всей дороги.',
        en: 'That is more than the whole. A part of the road cannot be longer than the road.',
      },
      {
        uz: "Bu ko'paytirish natijasi: yigirmani to'rtga ko'paytirgan. Avval bo'lish kerak edi.",
        ru: 'Это результат умножения: двадцать умножили на четыре. Сначала нужно было делить.',
        en: 'That is the result of multiplication: twenty times four. Division had to come first.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Shahardan qishloqqacha yigirma kilometr yo'l bor.",
          "Uning beshdan to'rt qismiga asfalt yotqizildi.",
          "Necha kilometr asfaltlandi? Javobni tanlang.",
        ],
        ru: [
          'От города до посёлка двадцать километров дороги.',
          'На четыре пятых её длины уложили асфальт.',
          'Сколько километров заасфальтировали? Выбери ответ.',
        ],
        en: [
          'From the city to the village there are twenty kilometres of road.',
          'Four fifths of its length were paved.',
          'How many kilometres were paved? Choose an answer.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Teskari masala', ru: 'Обратная задача', en: 'The reverse problem' },
    title: {
      uz: 'Qism ma\'lum, butun noma\'lum',
      ru: 'Часть известна, целое нет',
      en: 'The part is known, the whole is not',
    },
    lead: {
      uz: "Bitta ulush ma'lum bo'lsa, butun uni maxrajga ko'paytirish bilan tiklanadi.",
      ru: 'Если известна одна доля, целое восстанавливают умножением на знаменатель.',
      en: 'If one share is known, the whole is restored by multiplying by the denominator.',
    },
    note: {
      uz: 'Yo\'nalish teskari, lekin tayanch o\'sha: bitta ulush.',
      ru: 'Направление обратное, но опора та же: одна доля.',
      en: 'The direction is reversed, but the anchor is the same: one share.',
    },
    audio: {
      intro: {
        uz: [
          "Endi panel teskari masalani berdi. Kesmaning beshdan bir ulushi to'qqiz santimetr.",
          "Butun kesma qanday? Bitta ulush allaqachon ma'lum.",
          "Butunda beshta shunday ulush bor, chunki maxraj besh.",
          "To'qqizni beshga ko'paytiramiz: qirq besh santimetr. Butun kesma shu.",
        ],
        ru: [
          'Теперь панель дала обратную задачу. Одна пятая отрезка равна девяти сантиметрам.',
          'Каков весь отрезок? Одна доля уже известна.',
          'В целом пять таких долей, ведь знаменатель пять.',
          'Умножим девять на пять: сорок пять сантиметров. Это и есть весь отрезок.',
        ],
        en: [
          'Now the panel gave a reverse problem. One fifth of a segment is nine centimetres.',
          'What is the whole segment? One share is already known.',
          'The whole holds five such shares, because the denominator is five.',
          'Multiply nine by five: forty five centimetres. That is the whole segment.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Do\'kondagi gullar',
      ru: 'Цветы в магазине',
      en: 'The flowers in the shop',
    },
    question: {
      uz: 'Gullarning uchdan bir qismi 30 ta. Jami nechta gul?',
      ru: 'Одна треть цветов это 30 штук. Сколько цветов всего?',
      en: 'One third of the flowers is 30. How many flowers are there in all?',
    },
    answer: 90,
    unit: { uz: 'ta', ru: 'шт.', en: 'pcs' },
    correctText: {
      uz: "To'g'ri. Butunda uchta shunday ulush bor: o'ttizni uchga ko'paytirsak, to'qson chiqadi.",
      ru: 'Верно. В целом три такие доли: тридцать умножить на три — девяносто.',
      en: 'Correct. The whole holds three such shares: thirty times three is ninety.',
    },
    wrong: {
      uz: "Hali emas. Bitta ulush berilgan. Butunda shunday ulushlardan nechta bor?",
      ru: 'Пока нет. Дана одна доля. Сколько таких долей в целом?',
      en: 'Not yet. One share is given. How many such shares are there in the whole?',
    },
    hintAfter: {
      uz: "Maxraj uch, demak o'ttizni uchga ko'paytiring.",
      ru: 'Знаменатель три, значит умножь тридцать на три.',
      en: 'The denominator is three, so multiply thirty by three.',
    },
    audio: {
      intro: {
        uz: [
          "Gul do'koniga gullar keltirildi. Ularning uchdan bir qismi chinnigullar.",
          "Chinnigullar o'ttizta edi.",
          "Do'konga jami nechta gul keltirilgan? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'В цветочный магазин привезли цветы. Одна треть из них гвоздики.',
          'Гвоздик было тридцать штук.',
          'Сколько всего цветов привезли в магазин? Набери ответ и подтверди.',
        ],
        en: [
          'Flowers were brought to the shop. One third of them are carnations.',
          'There were thirty carnations.',
          'How many flowers were brought in all? Type the answer and confirm.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Bir necha ulush', ru: 'Несколько долей', en: 'Several shares' },
    title: {
      uz: 'Berilgani bir necha ulush bo\'lsa',
      ru: 'Когда дано несколько долей',
      en: 'When several shares are given',
    },
    lead: {
      uz: "Avval suratga bo'lib bitta ulushni topamiz, keyin maxrajga ko'paytiramiz.",
      ru: 'Сначала делим на числитель и находим одну долю, потом умножаем на знаменатель.',
      en: 'First we divide by the numerator to find one share, then multiply by the denominator.',
    },
    note: {
      uz: 'Bu ham ikki qadam, faqat tartib teskari.',
      ru: 'Это тоже два шага, только порядок обратный.',
      en: 'This is two steps as well, only in the reverse order.',
    },
    audio: {
      intro: {
        uz: [
          "Avaz kitobning to'rtdan uch qismini o'qidi. Bu yetmish sakkiz bet.",
          "Berilgani bitta ulush emas, uchta ulush. Avval bittasini topamiz.",
          "Yetmish sakkizni uchga bo'lsak, yigirma olti chiqadi. Bu bitta chorak.",
          "Butunda to'rtta chorak bor: yigirma oltini to'rtga ko'paytiramiz, bir yuz to'rt bet.",
        ],
        ru: [
          'Аваз прочитал три четверти книги. Это семьдесят восемь страниц.',
          'Дана не одна доля, а три. Сначала найдём одну.',
          'Семьдесят восемь разделить на три, получится двадцать шесть. Это одна четверть.',
          'В целом четыре четверти: умножим двадцать шесть на четыре, сто четыре страницы.',
        ],
        en: [
          'Avaz read three quarters of a book. That is seventy eight pages.',
          'What is given is not one share but three. First we find one.',
          'Seventy eight divided by three gives twenty six. That is one quarter.',
          'The whole holds four quarters: twenty six times four is one hundred and four pages.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'O\'ylangan son', ru: 'Задуманное число', en: 'The number in mind' },
    title: {
      uz: 'Qanday son o\'ylangan?',
      ru: 'Какое число задумали?',
      en: 'Which number was thought of?',
    },
    question: {
      uz: 'Sonning beshdan uch qismi 15 ga teng. Son qanday?',
      ru: 'Три пятых числа равны 15. Каково число?',
      en: 'Three fifths of a number is 15. What is the number?',
    },
    options: [
      { uz: '25', ru: '25', en: '25' },
      { uz: '9', ru: '9', en: '9' },
      { uz: '75', ru: '75', en: '75' },
      { uz: '45', ru: '45', en: '45' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'n beshni uchga bo'ldik, besh chiqdi, keyin beshga ko'paytirdik: yigirma besh.",
      ru: 'Верно. Пятнадцать разделили на три, получилось пять, потом умножили на пять: двадцать пять.',
      en: 'Correct. Fifteen divided by three is five, then multiplied by five: twenty five.',
    },
    wrong: [
      null,
      {
        uz: "Bu berilgan qismdan kichik. Butun har doim qismdan katta bo'ladi.",
        ru: 'Это меньше данной части. Целое всегда больше части.',
        en: 'That is smaller than the given part. A whole is always larger than a part.',
      },
      {
        uz: "Bu yerda faqat maxrajga ko'paytirilgan. Avval bitta ulushni topish kerak edi.",
        ru: 'Здесь только умножили на знаменатель. Сначала нужно было найти одну долю.',
        en: 'Here only the denominator was multiplied in. One share had to be found first.',
      },
      {
        uz: "Bu uchga ko'paytirishning natijasi. Suratga bo'lish tushib qolgan.",
        ru: 'Это результат умножения на три. Пропущено деление на числитель.',
        en: 'That is the result of multiplying by three. The division by the numerator is missing.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Panel jumboq berdi: men bir son o'yladim.",
          "Bu sonning beshdan uch qismi o'n beshga teng.",
          "Qanday son o'ylangan? Javobni tanlang.",
        ],
        ru: [
          'Панель загадала: я задумал одно число.',
          'Три пятых этого числа равны пятнадцати.',
          'Какое число задумали? Выбери ответ.',
        ],
        en: [
          'The panel set a puzzle: I thought of a number.',
          'Three fifths of that number equals fifteen.',
          'Which number was thought of? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Ikki yo\'nalish, bitta tayanch',
      ru: 'Два направления, одна опора',
      en: 'Two directions, one anchor',
    },
    lead: {
      uz: 'Har ikkalasida ham bitta ulush orqali o\'tiladi.',
      ru: 'В обоих случаях путь идёт через одну долю.',
      en: 'In both cases the path goes through one share.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Sonning kasrini topish uchun avval maxrajga bo'lamiz, keyin suratga ko'paytiramiz.",
          "Sonni kasridan topish uchun esa avval suratga bo'lamiz, keyin maxrajga ko'paytiramiz.",
          "Ikkala yo'lda ham o'rtada bitta ulush turadi. Javobni mantiq bilan tekshiring: qism butundan kichik, butun esa qismdan katta.",
        ],
        ru: [
          'Соберём правило. Чтобы найти дробь числа, сначала делим на знаменатель, потом умножаем на числитель.',
          'Чтобы найти число по его дроби, сначала делим на числитель, потом умножаем на знаменатель.',
          'В обоих путях посередине стоит одна доля. Проверяй ответ смыслом: часть меньше целого, а целое больше части.',
        ],
        en: [
          'Let us put the rule together. To find a fraction of a number we divide by the denominator, then multiply by the numerator.',
          'To find a number from its fraction we divide by the numerator, then multiply by the denominator.',
          'In both paths one share stands in the middle. Check the answer by sense: a part is smaller than the whole and a whole is larger than a part.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi yo\'l tez?', ru: 'Какой путь быстрее?', en: 'Which way is quicker?' },
    title: {
      uz: 'Yozish shartmi?',
      ru: 'Нужно ли записывать?',
      en: 'Is writing needed?',
    },
    question: {
      uz: '400 ning ikkidan bir qismi. Qanday hisoblagan qulay?',
      ru: 'Одна вторая от 400. Как удобнее посчитать?',
      en: 'One half of 400. What is the convenient way?',
    },
    options: [
      { uz: 'Og\'zaki: yarmi 200', ru: 'Устно: половина 200', en: 'Mentally: the half is 200' },
      { uz: 'Ustunda bo\'lish', ru: 'Делением столбиком', en: 'By a column division' },
      { uz: 'Ikki qadamni to\'liq yozish', ru: 'Записать оба шага полностью', en: 'Writing both steps in full' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Surat bir, shuning uchun ikkinchi qadam kerak emas va javob darrov ko'rinadi.",
      ru: 'Верно. Числитель один, поэтому второй шаг не нужен и ответ виден сразу.',
      en: 'Correct. The numerator is one, so the second step is unnecessary and the answer is seen at once.',
    },
    wrong: [
      null,
      {
        uz: "Ustun ham to'g'ri javob beradi, lekin bu yerda ortiqcha ish.",
        ru: 'Столбик тоже даст верный ответ, но здесь это лишняя работа.',
        en: 'A column also gives the right answer, but it is extra work here.',
      },
      {
        uz: "Ikkinchi qadam faqat surat birdan katta bo'lganda kerak bo'ladi.",
        ru: 'Второй шаг нужен только тогда, когда числитель больше единицы.',
        en: 'The second step is needed only when the numerator is greater than one.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Panelga oxirgi buyurtma keldi: to'rt yuz birlikning ikkidan bir qismi.",
          "Ba'zan yozib o'tirish shart emas: kasrning o'zi javobni ko'rsatadi.",
          "Qanday hisoblagan qulay? Javobni tanlang.",
        ],
        ru: [
          'На панель пришёл последний заказ: одна вторая от четырёхсот единиц.',
          'Иногда записывать не нужно: сама дробь показывает ответ.',
          'Как удобнее посчитать? Выбери ответ.',
        ],
        en: [
          'A last order reached the panel: one half of four hundred units.',
          'Sometimes there is no need to write: the fraction itself shows the answer.',
          'What is the convenient way? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit teskari yo\'lda adashdi',
      ru: 'Bit ошибся на обратном пути',
      en: 'Bit went wrong on the reverse path',
    },
    question: {
      uz: 'Bit butunni topmoqchi edi. Xato qayerda?',
      ru: 'Bit хотел найти целое. Где ошибка?',
      en: 'Bit wanted to find the whole. Where is the error?',
    },
    steps: [
      { uz: 'Berilgan: 3/4 qismi 78 bet', ru: 'Дано: 3/4 части это 78 страниц', en: 'Given: 3/4 is 78 pages' },
      { uz: 'Bitta chorak: 78 : 3 = 26', ru: 'Одна четверть: 78 : 3 = 26', en: 'One quarter: 78 : 3 = 26' },
      { uz: 'Butun: 26 : 4', ru: 'Целое: 26 : 4', en: 'The whole: 26 : 4' },
      { uz: 'Javob: 6 bet', ru: 'Ответ: 6 страниц', en: 'Answer: 6 pages' },
    ],
    options: [
      { uz: "Butunni topishda ko'paytirish kerak edi", ru: 'При нахождении целого нужно было умножение', en: 'Multiplication was needed to find the whole' },
      { uz: "Bitta chorakni topishda ko'paytirish kerak edi", ru: 'При нахождении четверти нужно было умножение', en: 'Multiplication was needed to find the quarter' },
      { uz: 'Berilgan son noto\'g\'ri ko\'chirilgan', ru: 'Данное число переписано неверно', en: 'The given number was copied wrongly' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Butunda to'rtta chorak bor, shuning uchun yigirma oltini to'rtga ko'paytiramiz: bir yuz to'rt bet.",
      ru: 'Верно. В целом четыре четверти, поэтому двадцать шесть умножают на четыре: сто четыре страницы.',
      en: 'Correct. The whole holds four quarters, so twenty six is multiplied by four: one hundred and four pages.',
    },
    wrong: [
      null,
      {
        uz: "Ikkinchi qadam to'g'ri: uchta ulush berilgan, shuning uchun uchga bo'linadi.",
        ru: 'Второй шаг верен: даны три доли, поэтому делят на три.',
        en: 'The second step is right: three shares are given, so we divide by three.',
      },
      {
        uz: "Sonlar to'g'ri ko'chirilgan. Xato uchinchi qatordagi amalda.",
        ru: 'Числа переписаны верно. Ошибка в действии третьей строки.',
        en: 'The numbers were copied correctly. The error is in the action of the third line.',
      },
      {
        uz: "Javob mantiqsiz: butun kitob o'qilgan qismdan kichik bo'lolmaydi.",
        ru: 'Ответ бессмыслен: вся книга не может быть меньше прочитанной части.',
        en: 'The answer makes no sense: the whole book cannot be smaller than the part read.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit teskari masalani yechdi va panelga yubordi.",
          "Uning to'rt qatori ekranda. Javob olti bet chiqqan.",
          "Xato qayerda? Javobni tanlang.",
        ],
        ru: [
          'Bit решил обратную задачу и отправил на панель.',
          'Его четыре строки на экране. Ответ вышел шесть страниц.',
          'Где ошибка? Выбери ответ.',
        ],
        en: [
          'Bit solved the reverse problem and sent it to the panel.',
          'His four lines are on the screen. The answer came out as six pages.',
          'Where is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi yozuv taqsimlaydi?',
      ru: 'Какая запись распределит груз?',
      en: 'Which record shares the load?',
    },
    question: {
      uz: '12 modulning 3/4 qismi. Qaysi yozuv to\'g\'ri?',
      ru: 'Три четверти от 12 модулей. Какая запись верна?',
      en: 'Three quarters of 12 modules. Which record is right?',
    },
    options: [
      { uz: '12 : 4 · 3 = 9', ru: '12 : 4 · 3 = 9', en: '12 : 4 · 3 = 9' },
      { uz: '12 : 4 = 3', ru: '12 : 4 = 3', en: '12 : 4 = 3' },
      { uz: '12 : 3 · 4 = 16', ru: '12 : 3 · 4 = 16', en: '12 : 3 · 4 = 16' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Panel to'qqizta modulni yubordi va tuman buyurtmasi yopildi.",
      ru: 'Верно. Панель отправила девять модулей, и заказ района закрыт.',
      en: 'Correct. The panel sent nine modules and the district order is closed.',
    },
    wrong: [
      null,
      {
        uz: "Bu bitta chorak: Bitning boshidagi xatosi. Uchta chorak kerak edi.",
        ru: 'Это одна четверть: первоначальная ошибка Bit. Нужны были три четверти.',
        en: 'That is one quarter: Bit original error. Three quarters were needed.',
      },
      {
        uz: "Bu yerda surat va maxraj o'rin almashgan. Javob butundan katta chiqdi.",
        ru: 'Здесь числитель и знаменатель поменялись местами. Ответ вышел больше целого.',
        en: 'Here the numerator and the denominator swapped places. The answer came out larger than the whole.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Taqsimlash paneli uchta yozuvni ko'rib chiqmoqda.",
          "O'n ikki moduldan to'rtdan uch qism kerak.",
          "Qaysi yozuv to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Панель распределения рассматривает три записи.',
          'Нужны три четверти от двенадцати модулей.',
          'Какая запись верна? Выбери ответ.',
        ],
        en: [
          'The distribution panel is looking at three records.',
          'Three quarters of twelve modules are needed.',
          'Which record is right? Choose an answer.',
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
      uz: "Qoidani tanlang va ikki yo'nalishni tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь оба направления.',
      en: 'Choose the rule and show that you understand both directions.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Sonning kasrini qanday topamiz?',
      ru: 'Как находят дробь числа?',
      en: 'How is a fraction of a number found?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Maxrajga bo'lib, suratga ko'paytiramiz", ru: 'Делим на знаменатель и умножаем на числитель', en: 'Divide by the denominator and multiply by the numerator' },
      { uz: "Suratga bo'lib, maxrajga ko'paytiramiz", ru: 'Делим на числитель и умножаем на знаменатель', en: 'Divide by the numerator and multiply by the denominator' },
      { uz: "Surat va maxrajni qo'shamiz", ru: 'Складываем числитель и знаменатель', en: 'Add the numerator and the denominator' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Avval bitta ulush, keyin kerakli ulushlar soni.',
      ru: 'Именно так. Сначала одна доля, потом нужное число долей.',
      en: 'Exactly. First one share, then the required number of shares.',
    },
    reflectionWrong: {
      uz: "Hali emas. Bu teskari masalaning yo'li. Modul lentasini eslang.",
      ru: 'Пока нет. Это путь обратной задачи. Вспомни ленту модулей.',
      en: 'Not yet. That is the path of the reverse problem. Remember the strip of modules.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning to\'rt qoidasi', ru: 'Четыре правила урока', en: 'The four rules of the lesson' },
    main: [
      { uz: "Maxraj butun necha bo'lakka bo'linganini bildiradi.", ru: 'Знаменатель показывает, на сколько частей делят целое.', en: 'The denominator shows into how many parts the whole is split.' },
      { uz: "Sonning kasri: maxrajga bo'lamiz, suratga ko'paytiramiz.", ru: 'Дробь числа: делим на знаменатель, умножаем на числитель.', en: 'Fraction of a number: divide by the denominator, multiply by the numerator.' },
      { uz: "Butun: suratga bo'lamiz, maxrajga ko'paytiramiz.", ru: 'Целое: делим на числитель, умножаем на знаменатель.', en: 'The whole: divide by the numerator, multiply by the denominator.' },
      { uz: 'Qism butundan kichik, butun esa qismdan katta.', ru: 'Часть меньше целого, а целое больше части.', en: 'A part is smaller than the whole, a whole is larger than a part.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Taqsimlash ustasi', ru: 'Мастер распределения', en: 'Master of sharing' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Ulush hisobchisi', ru: 'Счётчик долей', en: 'Share calculator' },
        text: { uz: "Siz ikki yo'nalishni ishonchli ajratasiz.", ru: 'Ты уверенно различаешь оба направления.', en: 'You tell the two directions apart with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Panel xodimi', ru: 'Сотрудник панели', en: 'Panel clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Taqsimlash tugadi. Endi markaz shartlarni tekshiradi: qaysi qiymatlar mos keladi.",
      ru: 'Распределение завершено. Теперь центр проверяет условия: какие значения подходят.',
      en: 'The sharing is done. Now the centre checks conditions: which values fit.',
    },
    audio: {
      intro: {
        uz: [
          "Taqsimlash paneli yopildi: har tumanga o'z ulushi yetdi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Sonning kasrini qanday topamiz? Javobni tanlang.",
        ],
        ru: [
          'Панель распределения закрыта: каждый район получил свою долю.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Как находят дробь числа? Выбери ответ.',
        ],
        en: [
          'The distribution panel is closed: every district got its share.',
          'One question is left. Choose the rule and claim your title.',
          'How is a fraction of a number found? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — ULUSHLAR LENTASI: butun teng bo'laklarga bo'linadi va
// kerakli bo'laklar bo'yaladi. Bitta ulush har doim ko'rinib turadi, chunki
// ikkala yo'nalish ham aynan shu ulush orqali o'tadi.
// ---------------------------------------------------------------------------

// s0, s14: taqsimlash paneli (to'q sahna).
const SharePanel = ({ fixed }) => {
  const t = useT();
  const cells = 12;
  const sent = fixed ? 9 : 3;
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d46panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d46panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'TAQSIMLASH PANELI', ru: 'ПАНЕЛЬ РАСПРЕДЕЛЕНИЯ', en: 'DISTRIBUTION PANEL' })}
      </text>

      {Array.from({ length: cells }, (_, index) => (
        <rect
          key={index}
          x={78 + index * 62}
          y="88"
          width="52"
          height="66"
          rx="10"
          fill={index < sent ? 'rgba(149,201,61,.28)' : 'rgba(121,211,218,.10)'}
          stroke={index < sent ? T.lime : 'rgba(144,228,235,.34)'}
          strokeWidth="1.8"
        />
      ))}
      <text x="452" y="180" textAnchor="middle" fill="#9DE3E7" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'omborda 12 modul', ru: 'на складе 12 модулей', en: '12 modules in the store' })}
      </text>

      <rect x="150" y="200" width="290" height="60" rx="14" fill="rgba(121,211,218,.12)" stroke="rgba(144,228,235,.4)" strokeWidth="1.6" />
      <text x="295" y="224" textAnchor="middle" fill="#9DE3E7" fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'tumanga kerak', ru: 'нужно району', en: 'the district needs' })}
      </text>
      <text x="295" y="248" textAnchor="middle" fill="#EAF9FB" fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        3/4
      </text>

      <rect
        x="470"
        y="200"
        width="290"
        height="60"
        rx="14"
        fill={fixed ? 'rgba(149,201,61,.18)' : 'rgba(255,91,53,.16)'}
        stroke={fixed ? 'rgba(149,201,61,.5)' : '#FFB39B'}
        strokeWidth="1.8"
      />
      <text x="615" y="224" textAnchor="middle" fill={fixed ? T.lime : '#FFB39B'} fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
        {fixed
          ? t({ uz: 'yuborildi', ru: 'отправлено', en: 'sent' })
          : t({ uz: 'Bit yuborgan', ru: 'отправил Bit', en: 'Bit sent' })}
      </text>
      <text x="615" y="248" textAnchor="middle" fill="#EAF9FB" fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {fixed ? '9' : '3'}
      </text>
    </FitSvg>
  );
};

// s1..s10: ulushlar lentasi. `parts` — maxraj, `taken` — surat.
const ShareStrip = ({ parts, taken, unitValue, totalLabel, frame = 9, showTotal = true, reverse = false }) => {
  const t = useT();
  const x0 = 60;
  const x1 = 600;
  const width = x1 - x0;
  const step = width / parts;
  return (
    <FitSvg viewBox="0 0 660 210">
      {showTotal && (
        <g opacity={frame >= 1 ? 1 : 0.24}>
          <rect x={x0} y={30} width={width} height={30} rx="9" fill={reverse ? T.accentSoft : T.cyanSoft} stroke={reverse ? T.accent : T.cyan} strokeWidth="1.6" />
          <text x={(x0 + x1) / 2} y={51} textAnchor="middle" fill={reverse ? T.accent : T.cyan} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {totalLabel}
          </text>
        </g>
      )}
      {Array.from({ length: parts }, (_, index) => {
        const on = index < taken;
        return (
          <g key={index} opacity={frame >= 2 ? 1 : 0.22}>
            <rect
              x={x0 + index * step + 3}
              y={80}
              width={step - 6}
              height={48}
              rx="9"
              fill={on ? 'rgba(149,201,61,.26)' : '#FBFDF7'}
              stroke={on ? T.lime : 'rgba(23,59,82,.16)'}
              strokeWidth={on ? 2.2 : 1.4}
            />
            {unitValue !== undefined && frame >= 3 && (
              <text x={x0 + index * step + step / 2} y={111} textAnchor="middle" fill={on ? '#4C6B18' : T.ink3} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {unitValue}
              </text>
            )}
          </g>
        );
      })}
      {frame >= 3 && (
        <Caption
          x={330}
          y={158}
          text={t({ uz: "bitta ulush", ru: 'одна доля', en: 'one share' })}
          tone={T.ink2}
        />
      )}
      {frame >= 4 && (
        <Caption
          x={330}
          y={186}
          text={reverse
            ? t({ uz: "butun ulushlardan yig'iladi", ru: 'целое собирается из долей', en: 'the whole is built from shares' })
            : t({ uz: "kerakli ulushlar bo'yaldi", ru: 'нужные доли закрашены', en: 'the needed shares are shaded' })}
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
          head: t({ uz: 'Sonning kasri', ru: 'Дробь числа', en: 'Fraction of a number' }),
          body: t({ uz: "maxrajga bo'lamiz, keyin suratga ko'paytiramiz", ru: 'делим на знаменатель, потом умножаем на числитель', en: 'divide by the denominator, then multiply by the numerator' }),
          formula: ': m · s',
        },
        {
          tone: T.accent,
          head: t({ uz: 'Butun son', ru: 'Само число', en: 'The whole number' }),
          body: t({ uz: "suratga bo'lamiz, keyin maxrajga ko'paytiramiz", ru: 'делим на числитель, потом умножаем на знаменатель', en: 'divide by the numerator, then multiply by the denominator' }),
          formula: ': s · m',
        },
        {
          tone: T.success,
          head: t({ uz: 'Tekshirish', ru: 'Проверка', en: 'The check' }),
          body: t({ uz: "qism butundan kichik, butun esa qismdan katta bo'lishi shart", ru: 'часть должна быть меньше целого, а целое больше части', en: 'a part must be smaller than the whole, a whole larger than a part' }),
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
          <span>LUMO CITY · BOSHQARUV MARKAZI · TAQSIMLASH PANELI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'TAQSIMLANDI' : 'BUYURTMA'}
          </span>
        </div>
        <div className="hero-body">
          <SharePanel fixed={solved} />
        </div>
        <div className="d46-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'think'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => (
  <RevealScreen {...props} ratio="66 / 21" figure={({ frame }) => <ShareStrip parts={4} taken={1} unitValue="3" totalLabel="12" frame={frame} />} />
);
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 21"
    figure={({ solved }) => <ShareStrip parts={2} taken={solved ? 1 : 0} unitValue={solved ? '6' : undefined} totalLabel="12" frame={solved ? 4 : 2} />}
  />
);
const Screen3 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 15"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: '1-QADAM', ru: '1 ШАГ', en: 'STEP 1' }), expr: '12 : 4 = 3', kind: 'mid' },
            { label: t({ uz: '2-QADAM', ru: '2 ШАГ', en: 'STEP 2' }), expr: '3 · 3 = 9', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 21"
    figure={({ solved }) => <ShareStrip parts={3} taken={2} unitValue={solved ? '4' : undefined} totalLabel="12" frame={solved ? 4 : 3} />}
  />
);
const Screen5 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 15"
      figure={({ frame }) => (
        <StepRows
          frame={frame}
          rows={[
            { label: t({ uz: 'PUL', ru: 'ДЕНЬГИ', en: 'MONEY' }), expr: '8000 : 8 = 1000', kind: 'mid' },
            { label: t({ uz: "YO'L", ru: 'ДОРОГА', en: 'ROAD' }), expr: '20 : 5 · 4 = 16', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen6 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="66 / 21"
    figure={({ solved }) => <ShareStrip parts={5} taken={4} unitValue={solved ? '4' : undefined} totalLabel="20 km" frame={solved ? 4 : 3} />}
  />
);
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 21"
    figure={({ frame }) => <ShareStrip parts={5} taken={1} unitValue="9" totalLabel={frame >= 4 ? '45 cm' : '?'} frame={frame} reverse />}
  />
);
const Screen8 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 21"
    figure={({ solved }) => <ShareStrip parts={3} taken={1} unitValue="30" totalLabel={solved ? '90' : '?'} frame={solved ? 4 : 3} reverse />}
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
            { label: t({ uz: '1-QADAM', ru: '1 ШАГ', en: 'STEP 1' }), expr: '78 : 3 = 26', kind: 'mid' },
            { label: t({ uz: '2-QADAM', ru: '2 ШАГ', en: 'STEP 2' }), expr: '26 · 4 = 104', kind: 'final' },
          ]}
        />
      )}
    />
  );
};
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="66 / 21"
    figure={({ solved }) => <ShareStrip parts={5} taken={3} unitValue={solved ? '5' : undefined} totalLabel={solved ? '25' : '?'} frame={solved ? 4 : 3} reverse />}
  />
);
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="66 / 21"
    figure={({ solved }) => <ShareStrip parts={2} taken={1} unitValue={solved ? '200' : undefined} totalLabel="400" frame={solved ? 4 : 3} />}
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
          badIndex={2}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Javobni shart bilan solishtiring: butun kitob qismidan kichik bo\'la oladimi?',
            ru: 'Сравни ответ с условием: может ли вся книга быть меньше её части?',
            en: 'Compare the answer with the problem: can a whole book be smaller than a part of it?',
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
        records={['12 : 4 · 3 = 9', '12 : 4 = 3', '12 : 3 · 4 = 16']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={210}
        cardH={92}
        gap={24}
        top={34}
        size={18}
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
.d46-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d46-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars46(props) {
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
