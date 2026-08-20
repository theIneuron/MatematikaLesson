// ============================================================
// 6 КЛАСС, УРОК 1 «Делители и кратные»
// Здесь только то, что принадлежит этому уроку: контент на трёх языках, его
// сцены (спортзал турнира, финальный зал) и экраны с его математикой.
// Обвязка — общий слой класса, ./screens.jsx.
// ============================================================
// `React` в этом файле не вызывается напрямую, но импорт обязателен: LMS
// компилирует jsx в КЛАССИЧЕСКОМ режиме (React.createElement), и без него урок
// падает с «React is not defined». Локальный vite этого не показывает.
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  T,
  configureLesson,
  navLocked,
  tri,
  pickL,
  rowsWord,
  mt,
  Frac,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  useRevealScroll,
  useIntroStages,
  useRecord,
  useFilmPhase,
  useFilmSteps,
  PREVIEW_START,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  FeedbackBlock,
  HintBlock,
  Floaters,
  FactCard,
  FB_SCI,
  FB_HIST,
  AnimDigits,
  AnimStars,
  WhyCard,
  MethodCard,
  NowYou,
  TaskCount,
  Unit,
  DivisorChips,
  MultiplesTrack,
  EquationLine,
  QuestionScreen,
  RevealScreen,
  RuleScreen,
  PickDivisors,
  Classify,
  DragMatch,
  HookScreen,
  FinalPanel,
  SummaryScreen,
  registerLesson,
  BASE_STYLES,
} from './screens.jsx';

// ============================================================
// --- UROK: grade6-01 — Делители и кратные / Bo'luvchilar va karrali sonlar ---
// Infra grade5/Dars01 (baytma-bayt: T/AudioEngine/useAudio/Stage/FeedbackBlock/QuestionScreen/mt/
// useMobileZoom/useRevealScroll/...). Mobil naqsh BOSHIDAN ichida (ETALON_6SINF.md §5).
// Kontekst: nonlarni teng qatorlarga terish. Qiyinlik pog'onasi 10 -> 36;
// savollarning bir qismi rasm bilan (UnitArray/UnitPile), bir qismi rasmsiz.
// UZ TERMIN (darslik «Matematika 6-sinf», 2022, 22-bet): «кратное» = KARRALI
// («N ga karrali», «N ning karralisi», «karrali sonlar»). `karra` — bu FAQAT
// ko'paytirish o'qilishi («olti karra olti»), hech qachon «кратное» emas.
// ============================================================
const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'grade6-01',
  lessonTitle: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar", en: 'Divisors and multiples' }
};

// Tartib (v3, metodist qarori 2026-08-13). Ilgari ekranlar guruhlangan edi:
// oldin ketma-ket YETTI tushuntirish, keyin ketma-ket YETTI savol — bola yarim
// darsni faqat tomosha qilardi. Endi navbat almashadi: tushuntirdik — darhol
// o'zi qildi. Ekran nomerlari (s1, s2, s3...) aynan shu tartibga mo'ljallangan.
// SARLAVHA -> XUK (nima uchun kerak) -> tushuntirish/mashq navbatma-navbat.
// BAHO YO'Q (metodist qarori): scored maydoni faqat ichki tartib uchun qoladi,
// natija platformaga yuborilmaydi va ekranda ball ko'rsatilmaydi.
const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',   scored: false, scope: 'hook' },     //  1 turnir: nimaga kerak
  { id: 's_recall', type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  2 ko'paytirish jadvali = bo'luvchilar
  { id: 's1',       type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  3 12:3=4 — ikki nom (o'zak)
  { id: 's_tool',   type: 'exploration', template: 'ToolScreen',   scored: false, scope: null },       //  4 USUL 1: ko'rsat, keyin o'zi
  { id: 's6',       type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  5 USUL 2: juftlab qidirish
  { id: 's_solve',  type: 'exploration', template: 'SolveTogether', scored: false, scope: null },      //  6 birga yechamiz: 24
  { id: 's10',      type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  7 USUL 3: karralar + langar
  { id: 's3',       type: 'rule',        template: 'RuleScreen',   scored: false, scope: null },       //  8 QOIDA (xukka qaytadi)
  { id: 's_roles',  type: 'test',        template: 'RolesPractice', scored: true,  scope: 'practice' },//  9 rollarni nomlash x3
  { id: 's_check',  type: 'test',        template: 'CheckPractice', scored: true,  scope: 'practice' },// 10 usul 1 amalda x4
  { id: 's9',       type: 'test',        template: 'PickDivisors', scored: true,  scope: 'practice' }, // 11 barcha bo'luvchilar x2
  { id: 's_error',  type: 'test',        template: 'FindError',    scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_grid',   type: 'test',        template: 'GridTask',     scored: true,  scope: 'practice' }, // 13 MASALA: suratlar to'ri
  { id: 's_final',  type: 'test',        template: 'FinalPanel',   scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null }       // 15 xulosa + uch usul
];

// Урок представляется общему слою один раз: оттуда берутся идентификатор для
// озвучки и роль экрана при записи ответа. Вызов обязателен в каждом уроке.
registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    title: {
      ru: 'Турнир: команды по 5 или по 6?',
      uz: "Turnir: beshtadan yoki oltitadan?",
      en: 'A tournament: teams of 5 or teams of 6?'
    },
    lead: {
      ru: 'В школе турнир. Записались 24 участника. Тренер должен разбить их на команды.',
      uz: "Maktabda turnir. 24 ishtirokchi yozildi. Murabbiy ularni komandalarga bo'lishi kerak.",
      en: 'There is a tournament at school. 24 players signed up. The coach has to split them into teams.'
    },
    voice_a: { ru: 'Азиз: делим по 5 в команде.', uz: "Aziz: beshtadan bo'lamiz.", en: 'Aziz: let us make teams of 5.' },
    voice_b: { ru: 'Дилноза: по 6 в команде.', uz: "Dilnoza: oltitadan bo'lamiz.", en: 'Dilnoza: teams of 6.' },
    ask: {
      ru: 'При каком размере команды никто не останется вне игры?',
      uz: "Qaysi holatda hech kim o'yindan tashqarida qolmaydi?",
      en: 'With which team size will nobody be left out of the game?'
    },
    opt_5: { ru: 'По 5 в команде', uz: 'Beshtadan', en: 'Teams of 5' },
    opt_6: { ru: 'По 6 в команде', uz: 'Oltitadan', en: 'Teams of 6' },
    // Хук ПРИНИМАЕТ прогноз и на этом заканчивается (методист 2026-08-14).
    // Обещание «ответ не открываем» — то же, что в остальных уроках класса
    // (движок FractionTheoryLesson): ребёнок должен понимать, что его выбор
    // сейчас не оценивают. Ответ он добывает сам на экране 6, где урок
    // возвращается к тому же числу 24 и спрашивает, делится ли оно на 5.
    // Одна строка, не две: на ноутбучном 1280x800 вторая строка выдавливала
    // варианты под нижнюю панель.
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.'
    },
    audio: {
      intro: {
        // Обещание «ответ проверим по ходу урока» звучит ЗДЕСЬ, до выбора.
        // Реплики на сам выбор нет: она бы прозвучала уже на следующем экране,
        // потому что после ответа хук закрывается сам.
        ru: [
          'В школе турнир. Записались двадцать четыре участника, и тренер должен разбить их на команды.',
          'Азиз предлагает команды по пять человек, Дилноза по шесть. Как ты думаешь, при каком размере никто не останется вне игры? Выбери ответ. Проверим его по ходу урока.'
        ],
        uz: [
          "Maktabda turnir. Yigirma to'rt kishi yozildi va murabbiy ularni komandalarga bo'lishi kerak.",
          "Aziz beshtadan komanda tuzishni taklif qiladi, Dilnoza esa oltitadan. Sizningcha, qaysi holatda hech kim o'yindan tashqarida qolmaydi? Javobni tanlang. Uni dars davomida tekshiramiz."
        ],
        en: [
          'There is a tournament at school. Twenty four players signed up, and the coach has to split them into teams.',
          'Aziz suggests teams of five, Dilnoza suggests teams of six. What do you think, with which size will nobody be left out? Choose an answer. We will check it during the lesson.'
        ]
      }
    }
  },

  // Ekran 07 (2026-08-13 da qo'shildi). Bu SAVOL emas, ASBOB: bola o'z sonini
  // kiritadi, bo'luvchini tanlaydi va o'z ko'zi bilan tekshiradi. To'g'ri javob
  // degan narsa yo'q — bo'linish FAKTI bor. Maket: delitsya-ili-net.html.
  // Ekran 07. Ilgari bola sonni O'ZI terardi (erkin kiritish maydoni) —
  // metodistga aynan shu yoqmadi. 2026-08-13 dan bu yerda 3-sinf, 1-dars naqshi:
  // AVVAL KO'RSATAMIZ, KEYIN O'ZI QILADI. Ko'rsatishda 24 va 6, keyin bolaning
  // navbati: son 25 qat'iy, u faqat bo'luvchini tanlaydi.
  s_tool: {
    title: { ru: 'Делится или нет', uz: "Bo'linadimi yoki yo'q", en: 'Does it divide or not' },
    demo_banner: {
      ru: 'Смотри — покажу на примере',
      uz: "Qarang — misolda ko'rsataman",
      en: 'Watch — I will show an example'
    },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    play_hint: {
      ru: 'Выбери делитель и нажми Проверить',
      uz: "Bo'luvchini tanlang va Tekshirish ni bosing",
      en: 'Choose a divisor and tap Check'
    },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    step_num: { ru: 'Число', uz: 'Son', en: 'Number' },
    step_div: { ru: 'Делитель', uz: "Bo'luvchi", en: 'Divisor' },
    go: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    empty: {
      ru: 'Участники выйдут на площадку после нажатия «Проверить»',
      uz: "Ishtirokchilar Tekshirish bosilgandan keyin maydonga chiqadi",
      en: 'The participants come out after you tap Check'
    },
    note_ok: {
      ru: 'Делится без остатка. {d} — делитель числа {n}, {n} — кратное числа {d}.',
      uz: "Qoldiqsiz bo'linadi. {d} — {n} ning bo'luvchisi, {n} — {d} ning karralisi.",
      en: 'It divides with no remainder. {d} is a divisor of {n}, and {n} is a multiple of {d}.'
    },
    note_no: {
      ru: 'Не делится без остатка. {d} не является делителем числа {n}.',
      uz: "Qoldiqsiz bo'linmaydi. {d} — {n} ning bo'luvchisi emas.",
      en: 'It does not divide without a remainder, so {d} is not a divisor of {n}.'
    },
    shape: { ru: '{a} ряда по {b} участников', uz: '{a} qator, har birida {b} ishtirokchi', en: '{a} rows of {b} participants' },
    task: {
      ru: 'Верного ответа тут нет — есть факт.',
      uz: "Bu yerda to'g'ri javob yo'q — fakt bor.",
      en: 'There is no right answer here, only a fact.'
    },
    audio: {
      intro: {
        ru: 'Сначала покажу сам. Двадцать четыре участника турнира. Проверим, встанут ли они ровно по шесть в ряд.',
        uz: "Avval o'zim ko'rsataman. Turnirning yigirma to'rt ishtirokchisi. Ular oltitadan qatorga tekis turadimi, tekshiramiz.",
        en: 'First let me show you. Twenty four tournament participants. Let us check whether they line up exactly six to a row.'
      },
      demo_done: {
        ru: 'Ряды получились ровные, никто не остался в стороне. Двадцать четыре делится на шесть без остатка. Значит шесть делитель двадцати четырёх, а двадцать четыре кратно шести.',
        uz: "Qatorlar tekis chiqdi, hech kim chetda qolmadi. Yigirma to'rt oltiga qoldiqsiz bo'linadi. Demak olti yigirma to'rtning bo'luvchisi, yigirma to'rt esa oltiga karrali.",
        en: 'The rows came out even and nobody was left aside. Twenty four divides by six with no remainder. So six is a divisor of twenty four, and twenty four is a multiple of six.'
      },
      play_start: {
        ru: 'Теперь ты. На турнир пришёл ещё один, стало двадцать пять. Выбери, по скольку ставить в ряд, и нажми проверить. Смотри не на красоту рядов, а на остаток.',
        uz: "Endi navbat sizniki. Turnirga yana bittasi keldi, yigirma besh bo'ldi. Qatorga nechtadan qo'yishni tanlang va tekshirish tugmasini bosing. Qatorlarning chiroyiga emas, qoldiqqa qarang.",
        en: 'Now it is your turn. One more came to the tournament, so there are twenty five. Choose how many to put in a row and tap check. Look at the remainder, not at how neat the rows are.'
      },
      ok: {
        ru: 'Ряды получились ровные. Значит выбранное число делитель, а двадцать пять ему кратно.',
        uz: "Qatorlar tekis chiqdi. Demak tanlangan son bo'luvchi, yigirma besh esa unga karrali.",
        en: 'The rows came out even. So the number you chose is a divisor, and twenty five is a multiple of it.'
      },
      no: {
        ru: 'Кто-то остался без ряда. Остаток не ноль, значит выбранное число не делитель двадцати пяти.',
        uz: "Kimdir qatorsiz qoldi. Qoldiq nol emas, demak tanlangan son yigirma beshning bo'luvchisi emas.",
        en: 'Someone was left without a row. The remainder is not zero, so the number you chose is not a divisor of twenty five.'
      }
    }
  },

  s1: {
    title: { ru: 'Один пример — два названия', uz: 'Bitta misol — ikkita nom', en: 'One example, two names' },
    bridge: {
      ru: '12 игроков разошлись на 3 команды: 12 : 3 = 4. Посмотри на рисунок.',
      uz: "12 o'yinchi 3 ta jamoaga bo'lindi: 12 : 3 = 4. Rasmga qarang.",
      en: '12 players split into 3 teams: 12 : 3 = 4. Study the picture.'
    },
    lbl_mult: { ru: '12 — кратное числа 3', uz: "12 — 3 ning karralisi", en: '12 is a multiple of 3' },
    cap_mult: { ru: 'Кратные числа 3:', uz: "3 ga karrali sonlar:", en: 'Multiples of 3:' },
    lbl_div: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi", en: '3 is a divisor of 12' },
    cap_div: { ru: 'Делители числа 12:', uz: "12 ning bo'luvchilari:", en: 'Divisors of 12:' },
    link: {
      ru: '12 делится на 3 без остатка: 12 — кратное числа 3, а 3 — делитель числа 12.',
      uz: "12 soni 3 ga qoldiqsiz bo'linadi: 12 — 3 ning karralisi, 3 esa 12 ning bo'luvchisi.",
      en: '12 divides by 3 with no remainder: 12 is a multiple of 3, and 3 is a divisor of 12.'
    },
    audio: {
      ru: [
        'Рассмотрим следующий пример. Двенадцать разделить на три равно четыре. Посмотри на рисунок.',
        'Двенадцать это кратное числа три. Посмотри на ряд кратных: три, шесть, девять, двенадцать, пятнадцать и дальше. Двенадцать стоит в этом ряду.',
        'А три это делитель числа двенадцать. Вот делители двенадцати: один, два, три, четыре, шесть, двенадцать. Три стоит и здесь.',
        'Двенадцать делится на три без остатка. Поэтому двенадцать кратное числа три, а три делитель числа двенадцать.'
      ],
      uz: [
        "Quyidagi misolni ko'rib chiqamiz. O'n ikkini uchga bo'lsak, to'rt chiqadi. Rasmga qarang.",
        "O'n ikki bu uchning karralisi. Uchga karrali sonlar qatoriga qarang: uch, olti, to'qqiz, o'n ikki, o'n besh va shu tariqa. O'n ikki shu qatorda turibdi.",
        "Uch esa o'n ikkining bo'luvchisi. Mana o'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti, o'n ikki. Uch bu yerda ham bor.",
        "O'n ikki soni uchga qoldiqsiz bo'linadi. Shuning uchun o'n ikki uchning karralisi, uch esa o'n ikkining bo'luvchisi."
      ],
      en: ['Look at this example. Twelve divided by three is four. Study the picture.', 'Twelve is a multiple of three. Look at the row of multiples: three, six, nine, twelve, fifteen and on. Twelve stands in that row.', 'And three is a divisor of twelve. Here are the divisors of twelve: one, two, three, four, six, twelve. Three stands here as well.', 'Twelve divides by three with no remainder. That is why twelve is a multiple of three, and three is a divisor of twelve.']
    }
  },

  s2: {
    question: { ru: 'Теперь разбери пример сам', uz: "Endi misolni o'zingiz tahlil qiling", en: 'Now work out an example yourself' },
    row_a: { ru: '20 — это … числа 5', uz: "20 — bu 5 sonining …", en: '20 is the … of 5' },
    row_b: { ru: '5 — это … числа 20', uz: "5 — bu 20 sonining …", en: '5 is the … of 20' },
    opt_mult: { ru: 'кратное', uz: 'karralisi', en: 'multiple' },
    opt_div: { ru: 'делитель', uz: "bo'luvchisi", en: 'divisor' },
    correct_text: { ru: 'Верно. 20 : 5 = 4 без остатка. Значит, 20 — кратное числа 5, а 5 — делитель числа 20.', uz: "To'g'ri. 20 : 5 = 4, qoldiq yo'q. Demak, 20 — 5 sonining karralisi, 5 esa 20 sonining bo'luvchisi.", en: 'Correct. 20 : 5 = 4 with no remainder. So 20 is a multiple of 5, and 5 is a divisor of 20.' },
    hint: { ru: 'Проверь деление: 20 делится на 5 без остатка.', uz: "Bo'lishni tekshiring: 20 soni 5 ga qoldiqsiz bo'linadi.", en: 'Check the division: 20 divides by 5 with no remainder.' },
    why: {
      ru: [
        '20 : 5 = 4 — деление вышло ровным, остатка нет.',
        '20 = 5 · 4, поэтому 20 — кратное числа 5.',
        'В том же равенстве 5 — делитель числа 20.'
      ],
      uz: [
        "20 : 5 = 4 — bo'lish teng chiqdi, qoldiq yo'q.",
        "20 = 5 · 4, shuning uchun 20 soni 5 ning karralisi.",
        "Xuddi shu tenglikda 5 soni 20 ning bo'luvchisi."
      ],
      en: ['20 : 5 = 4 — the division came out even, there is no remainder.', '20 = 5 · 4, so 20 is a multiple of 5.', 'In the same equality 5 is a divisor of 20.']
    },
    audio: {
      intro: { ru: 'Теперь разбери пример сам. Двадцать разделить на пять равно четыре. Подбери название для каждого числа.', uz: "Endi misolni o'zingiz tahlil qiling. Yigirmani beshga bo'lsak, to'rt chiqadi. Har bir songa nom tanlang.", en: 'Now work out an example yourself. Twenty divided by five is four. Choose the right name for each number.' },
      on_correct: { ru: 'Верно. Двадцать кратное пяти, а пять делитель двадцати.', uz: "To'g'ri. Yigirma soni beshning karralisi, besh esa yigirmaning bo'luvchisi.", en: 'Correct. Twenty is a multiple of five, and five is a divisor of twenty.' },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку и попробуй ещё раз.', uz: "Unchalik emas. Maslahatga qarang va yana urinib ko'ring.", en: 'Not quite. Read the hint and try again.' }
    }
  },

  s3: {
    title: { ru: 'Два названия одного деления', uz: "Bitta bo'lishning ikki nomi", en: 'Two names for one division' },
    rule_1: { ru: 'Если a делится на b без остатка, то b называют делителем числа a.', uz: "Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi.", en: 'If a divides by b with no remainder, then b is called a divisor of a.' },
    rule_2: { ru: 'В том же самом примере a называют кратным числа b.', uz: "Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi.", en: 'In the very same example a is called a multiple of b.' },
    audio: { ru: 'Запомним правило. Если a делится на b без остатка, то b называют делителем числа a. А в том же самом примере a называют кратным числа b. Одно деление, два названия.', uz: "Qoidani eslab qolamiz. Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi. Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi. Bitta bo'lish, ikkita nom.", en: 'Let us remember the rule. If a divides by b with no remainder, then b is called a divisor of a. And in the very same example a is called a multiple of b. One division, two names.' }
  },

  // Ekran 06. Ilgari bu STATIK tushuntirish edi: rasm turardi, matn gapirardi.
  // 2026-08-13 dan bu bola o'zi ishlatadigan blok: 12 plitka slayder bilan
  // qatorlarga QAYTA TIZILADI, joy topmaganlar qoldiq zonasiga tushadi.
  // Dizayn metodistning Claude Design maketidan (delimiteli-kratnye.html).
  // {v} — qator soni o'rniga qo'yiladi.
  s4: {
    title: { ru: 'А если остаётся лишнее?', uz: 'Ortib qolsa-chi?', en: 'What if something is left over?' },
    rest_label: { ru: 'остаток', uz: 'qoldiq', en: 'remainder' },
    note_ok: {
      ru: 'Разделилось без остатка. {v} — делитель числа 12, 12 — кратное числа {v}.',
      uz: "Qoldiqsiz bo'lindi. {v} — 12 ning bo'luvchisi, 12 — {v} ning karralisi.",
      en: 'It divided with no remainder. {v} is a divisor of 12, and 12 is a multiple of {v}.'
    },
    note_no: {
      ru: 'На {v} не делится без остатка. {v} не является делителем числа 12.',
      uz: "12 soni {v} ga qoldiqsiz bo'linmaydi. {v} — 12 ning bo'luvchisi emas.",
      en: '12 does not divide by {v} without a remainder, so {v} is not a divisor of 12.'
    },
    // Ekran belgilar bilan tugamaydi: ikkala holat ko'rilgach so'z bilan xulosa.
    done: {
      ru: 'Делитель — это число, при котором лишнего не остаётся.',
      uz: "Bo'luvchi — shunday son, unda ortiqcha qolmaydi.",
      en: 'A divisor is a number that leaves nothing over.'
    },
    // Kino replikalari: har qatorga o'z kadri (metodist qarori 2026-08-13).
    // Slayder olib tashlandi, vizual til qoldi: bola tomosha qiladi, keyingi
    // ekranda o'zi qiladi.
    audio: {
      ru: [
        'Возьмём двенадцать плиток. Сейчас разложим их на равные ряды.',
        'На три ряда легло ровно: по четыре в каждом, лишнего нет. Значит три делитель двенадцати.',
        'А теперь на пять рядов. По две в ряду, и две плитки остались лишними. Остаток не ноль, значит пять не делитель двенадцати.',
        'Вот и вся разница. Делитель это то число, при котором лишнего не остаётся.'
      ],
      uz: [
        "O'n ikkita plitka olamiz. Endi ularni teng qatorlarga joylaymiz.",
        "Uch qatorga tekis joylashdi: har birida to'rttadan, ortiqcha yo'q. Demak uch o'n ikkining bo'luvchisi.",
        "Endi besh qatorga. Har qatorda ikkitadan, ikkita plitka ortib qoldi. Qoldiq nolga teng emas, demak besh o'n ikkining bo'luvchisi emas.",
        "Farq shundan. Bo'luvchi bu shunday son, unda ortiqcha qolmaydi."
      ],
      en: [
        'Let us take twelve tiles. Now we will arrange them into equal rows.',
        'Three rows came out even: four in each and nothing left over. So three is a divisor of twelve.',
        'And now five rows. Two in each row, and two tiles are left over. The remainder is not zero, so five is not a divisor of twelve.',
        'That is the whole difference. A divisor is a number that leaves nothing over.'
      ]
    }
  },

  s5: {
    bridge: { ru: 'Проверим на другом числе.', uz: 'Boshqa sonda tekshiramiz.', en: 'Let us try another number.' },
    question: { ru: '14 разделили на 4 равные части. Что получится?', uz: "14 ni 4 ta teng qismga ajratdik. Nima bo'ladi?", en: '14 was split into 4 equal parts. What comes out?' },
    correctIndex: 0,
    correct_text: { ru: 'Верно. 14 = 4 · 3 + 2: по 3 в каждой части и 2 лишних. Значит, 4 не делитель числа 14.', uz: "To'g'ri. 14 = 4 · 3 + 2: har qismda 3 tadan va 2 tasi ortiqcha. Demak, 4 soni 14 ning bo'luvchisi emas.", en: 'Correct. 14 = 4 · 3 + 2: three in each part and two left over. So 4 is not a divisor of 14.' },
    // wrong_N — ko'rinadigan matn; audio_hint_N — TTS-toza variant (QuestionScreen
    // uni birinchi navbatda oladi). Indekslar shuffleMC dan OLDINGI tartibda.
    why: {
      ru: [
        '4 · 3 = 12 — это меньше 14, значит по 3 в каждую часть положить можно.',
        '4 · 4 = 16 — это уже больше 14, по 4 не хватит.',
        'Остаётся 14 − 12 = 2. Остаток не ноль — значит 4 не делитель числа 14.'
      ],
      uz: [
        "4 · 3 = 12 — bu 14 dan kichik, demak har qismga 3 tadan qo'yish mumkin.",
        "4 · 4 = 16 — bu 14 dan katta, 4 tadan yetmaydi.",
        "14 − 12 = 2 ortadi. Qoldiq nol emas — demak 4 soni 14 ning bo'luvchisi emas."
      ],
      en: ['4 · 3 = 12, which is less than 14, so three can go into each part.', '4 · 4 = 16, which is already more than 14, so four in each will not go around.', 'That leaves 14 − 12 = 2. The remainder is not zero, so 4 is not a divisor of 14.']
    },
    audio: {
      intro: { ru: 'Проверим на другом числе. Четырнадцать разложим на четыре равные части. Что получится? Выбери ответ.', uz: "Boshqa sonda tekshiramiz. O'n to'rtni to'rtta teng bo'lakka ajratamiz. Nima bo'ladi? Javobni tanlang.", en: 'Let us try another number. We split fourteen into four equal parts. What comes out? Choose an answer.' },
      on_correct: { ru: 'Верно. Две штуки остались лишними.', uz: "To'g'ri. Ikkitasi ortib qoldi.", en: 'Correct. Two are left over.' },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang.", en: 'Look at the explanation on the right.' }
    }
  },

  // Ekran 09. Ilgari bola sonni O'ZI bosardi (PairsScreen, Claude Design maketi).
  // 2026-08-13 metodist qarori: interaktiv olib tashlanadi, vizual til qoladi —
  // ekran KINOga aylanadi. Har replikaga bitta juftlik: ikki son bir-biriga
  // qarab yuradi, ko'paytmasi chiqadi, ikkalasi qatorga o'tadi. Uchinchi juftlik
  // (uch va to'rt) o'rtada UCHRASHADI — qidirish shu yerda tugaydi.
  s6: {
    title: { ru: 'Делители ищем парами', uz: "Bo'luvchilarni juftlab qidiramiz", en: 'Finding divisors in pairs' },
    cap_all: { ru: 'Делители числа 12', uz: "12 ning bo'luvchilari", en: 'Divisors of 12' },
    // Мостик к хуку: те же двенадцать игроков, что и на прошлом экране.
    bridge: {
      ru: 'Те же 12 игроков. Какими равными командами их вообще можно развести?',
      uz: "O'sha 12 o'yinchi. Ularni umuman qanday teng jamoalarga bo'lish mumkin?",
      en: 'The same 12 players. What equal teams can they be split into at all?'
    },
    wait: {
      ru: 'Сейчас пары выедут навстречу друг другу',
      uz: "Hozir juftliklar bir-biriga qarab chiqadi",
      en: 'The pairs are about to move toward each other'
    },
    meet: {
      ru: 'Слева и справа встретились. Дальше пар нет, все делители найдены.',
      uz: "Chap va o'ng uchrashdi. Boshqa juftlik yo'q, barcha bo'luvchilar topildi.",
      en: 'The left and the right have met. There are no more pairs, all divisors are found.'
    },
    // «ТЕПЕРЬ ТЫ» (методист 2026-08-14). Экран объяснения не должен кончаться
    // просмотром: один ход в конце проверяет, что кадр понят. Это НЕ практика,
    // практика идёт в блоке 9-13; тут один вопрос и разбор на каждый ответ.
    now_you: {
      head: { ru: 'Теперь ты', uz: 'Endi siz', en: 'Now you' },
      q: { ru: 'Возьмём число 20. Какое число в паре с 2?', uz: '20 sonini olaylik. 2 bilan juftlikda qaysi son?', en: 'Take the number 20. Which number pairs with 2?' },
      opts: { ru: ['10', '18', '5'], uz: ['10', '18', '5'], en: ['10', '18', '5'] },
      correct: 0,
      correct_text: { ru: 'Верно. 2 · 10 = 20, значит 2 и 10 — пара делителей.', uz: "To'g'ri. 2 · 10 = 20, demak 2 va 10 — bo'luvchilar juftligi.", en: 'Correct. 2 · 10 = 20, so 2 and 10 are a pair of divisors.' },
      correct_audio: { ru: 'Верно. Два умножить на десять двадцать, значит два и десять пара делителей.', uz: "To'g'ri. Ikki karra o'n yigirma, demak ikki va o'n bo'luvchilar juftligi.", en: 'Correct. Two times ten is twenty, so two and ten are a pair of divisors.' },
      wrong: [
        null,
        { ru: '18 — это 20 минус 2. Пара ищется умножением, а не вычитанием.', uz: "18 — bu 20 minus 2. Juftlik ko'paytirish bilan qidiriladi, ayirish bilan emas.", en: '18 is 20 minus 2. A pair is found by multiplying, not subtracting.' },
        { ru: '5 — пара четвёрки: 4 · 5 = 20. У двойки пара другая.', uz: "5 — to'rtning jufti: 4 · 5 = 20. Ikkining jufti boshqa.", en: '5 is the partner of four: 4 · 5 = 20. Two has a different partner.' }
      ],
      wrong_audio: [
        null,
        { ru: 'Восемнадцать это двадцать минус два. Пара ищется умножением, а не вычитанием.', uz: "O'n sakkiz bu yigirma minus ikki. Juftlik ko'paytirish bilan qidiriladi, ayirish bilan emas.", en: 'Eighteen is twenty minus two. A pair is found by multiplying, not subtracting.' },
        { ru: 'Пять это пара четвёрки. Четыре умножить на пять двадцать. У двойки пара другая.', uz: "Besh bu to'rtning jufti. To'rt karra besh yigirma. Ikkining jufti boshqa.", en: 'Five is the partner of four. Four times five is twenty. Two has a different partner.' }
      ]
    },
    fact: {
      ru: 'Товары часто считают дюжинами — по 12 штук. Число 12 удобно тем, что делится на 2, 3, 4 и 6, поэтому дюжину легко разделить поровну.',
      uz: "Tovarlar ko'pincha dyujina bilan — 12 tadan sanaladi. 12 soni 2, 3, 4 va 6 ga bo'lingani uchun qulay: dyujinani teng bo'lish oson.",
      en: 'Goods are often counted in dozens, 12 at a time. The number 12 is handy because it divides by 2, 3, 4 and 6, so a dozen is easy to share equally.'
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Товары часто считают дюжинами, по двенадцать штук. Двенадцать удобно тем, что делится на два, три, четыре и шесть, поэтому дюжину легко разделить поровну.',
      uz: "Bilasizmi? Tovarlar ko'pincha dyujina bilan, o'n ikkitadan sanaladi. O'n ikki soni ikki, uch, to'rt va oltiga bo'lingani uchun qulay, shuning uchun dyujinani teng bo'lish oson.",
      en: 'Did you know? Goods are often counted in dozens, twelve at a time. Twelve is handy because it divides by two, three, four and six, so a dozen is easy to share equally.'
    },
    // Kino replikalari: bitta replika — bitta juftlik (metodist qarori 2026-08-13).
    audio: {
      ru: [
        'Делители удобно искать парами. Смотри, как два числа выезжают навстречу друг другу.',
        'Первая пара. Слева один, справа двенадцать. Один умножить на двенадцать это двенадцать. Значит и один, и двенадцать делители. Оба уходят в ряд.',
        'Вторая пара. Два и шесть. Два умножить на шесть это тоже двенадцать. Значит два и шесть тоже делители.',
        'Третья пара. Три умножить на четыре снова двенадцать. Смотри, три и четыре встретились в середине. Слева и справа сошлись, дальше пар нет. Все делители двенадцати найдены.'
      ],
      uz: [
        "Bo'luvchilarni juftlab qidirish qulay. Ikkita son bir-biriga qarab qanday yurishini kuzating.",
        "Birinchi juftlik. Chapda bir, o'ngda o'n ikki. Bir karra o'n ikki bu o'n ikki. Demak bir ham, o'n ikki ham bo'luvchi. Ikkalasi qatorga o'tadi.",
        "Ikkinchi juftlik. Ikki va olti. Ikki karra olti ham o'n ikki. Demak ikki va olti ham bo'luvchi.",
        "Uchinchi juftlik. Uch karra to'rt yana o'n ikki. Qarang, uch va to'rt o'rtada uchrashdi. Chap va o'ng tutashdi, boshqa juftlik yo'q. O'n ikkining barcha bo'luvchilari topildi."
      ],
      en: [
        'Divisors are easy to find in pairs. Watch how two numbers move toward each other.',
        'The first pair. One on the left, twelve on the right. One times twelve is twelve. So both one and twelve are divisors. Both of them move into the row.',
        'The second pair. Two and six. Two times six is twelve as well. So two and six are divisors too.',
        'The third pair. Three times four is twelve again. Look, three and four met in the middle. The left and the right have come together, there are no more pairs. All divisors of twelve are found.'
      ]
    }
  },

  s9: {
    label: { ru: 'выбираем делители', uz: "bo'luvchilarni tanlaymiz", en: 'choosing divisors' },
    context: { ru: 'Нажимай на подходящие числа в ряду.', uz: "Qatordan mos sonlarni bosing.", en: 'Tap the numbers in the row that fit.' },
    question: { ru: 'Выбери все делители числа 18', uz: "18 sonining barcha bo'luvchilarini tanlang", en: 'Choose all the divisors of 18' },
    numbers: ['1', '2', '3', '4', '5', '6', '9', '12', '18'],
    divisors: ['1', '2', '3', '6', '9', '18'],
    correct_text: { ru: 'Верно: 1, 2, 3, 6, 9, 18 — всего 6 делителей.', uz: "To'g'ri: 1, 2, 3, 6, 9, 18 — jami 6 ta bo'luvchi.", en: 'Correct: 1, 2, 3, 6, 9, 18 — six divisors in all.' },
    hint: { ru: 'Иди парами: 1 и 18, 2 и 9, 3 и 6. Каждая пара даёт два делителя.', uz: "Juftlab yuring: 1 va 18, 2 va 9, 3 va 6. Har juftlik ikkita bo'luvchi beradi.", en: 'Go in pairs: 1 and 18, 2 and 9, 3 and 6. Each pair gives two divisors.' },
    why: {
      ru: [
        '1 · 18 = 18 — первая пара: 1 и 18.',
        '2 · 9 = 18 — вторая пара: 2 и 9.',
        '3 · 6 = 18 — третья пара: 3 и 6.',
        'Дальше пары начнут повторяться. Три пары дают 6 делителей.'
      ],
      uz: [
        "1 · 18 = 18 — birinchi juftlik: 1 va 18.",
        "2 · 9 = 18 — ikkinchi juftlik: 2 va 9.",
        "3 · 6 = 18 — uchinchi juftlik: 3 va 6.",
        "Bundan keyin juftliklar takrorlanadi. Uchta juftlik 6 ta bo'luvchi beradi."
      ],
      en: ['1 · 18 = 18 — the first pair: 1 and 18.', '2 · 9 = 18 — the second pair: 2 and 9.', '3 · 6 = 18 — the third pair: 3 and 6.', 'After that the pairs start repeating. Three pairs give 6 divisors.']
    },
    fact: { ru: 'Час поделили на 60 минут не случайно: у числа 60 целых 12 делителей, поэтому час удобно делить на 2, 3, 4, 5, 6 и даже 12 частей.', uz: "Soat 60 daqiqaga bejiz bo'linmagan: 60 sonining 12 ta bo'luvchisi bor, shuning uchun soatni 2, 3, 4, 5, 6 va hatto 12 bo'lakka bo'lish qulay.", en: 'An hour was split into 60 minutes for a reason: the number 60 has as many as 12 divisors, so an hour is easy to split into 2, 3, 4, 5, 6 and even 12 parts.' },
    fact_audio: { ru: 'Знаешь ли ты? Час поделили на шестьдесят минут не случайно. У числа шестьдесят целых двенадцать делителей, поэтому час удобно делить на две, три, четыре, пять, шесть и даже двенадцать частей.', uz: "Bilasizmi? Soat oltmish daqiqaga bejiz bo'linmagan. Oltmish sonining o'n ikkita bo'luvchisi bor, shuning uchun soatni ikki, uch, to'rt, besh, olti va hatto o'n ikki bo'lakka bo'lish qulay.", en: 'Did you know? An hour was split into sixty minutes for a reason. The number sixty has as many as twelve divisors, so an hour is easy to split into two, three, four, five, six and even twelve parts.' },
    audio: {
      intro: { ru: 'Выбери все делители числа восемнадцать. Нажимай на подходящие числа в ряду, потом нажми проверить.', uz: "O'n sakkiz sonining barcha bo'luvchilarini tanlang. Qatordan mos sonlarni bosing, so'ng tekshirishni bosing.", en: 'Choose all the divisors of eighteen. Tap the numbers in the row that fit, then tap check.' },
      on_correct: { ru: 'Верно, шесть делителей.', uz: "To'g'ri, oltita bo'luvchi.", en: 'Correct, six divisors.' },
      on_wrong: { ru: 'Не всё. Посмотри подсказку и продолжай.', uz: "Hammasi emas. Maslahatga qarang va davom eting.", en: 'Not all of them. Read the hint and carry on.' }
    }
  },

  // Ekran 12. Ilgari ikki qator CHIQIB kelardi va matn farqni AYTARDI.
  // 2026-08-13 dan bola belgini o'zi suradi: yuqoridagi chiziq karrali sonda
  // ushlab turadi va cheksiz davom etadi, pastdagisi bo'luvchi bo'lmagan sonda
  // CHETGA CHIQARIB TASHLAYDI va 12 dan keyin DEVORGA urilib tugaydi.
  // Dizayn metodistning maketidan (kratnye-i-deliteli.html).
  s10: {
    title: { ru: 'Бесконечно и конечно', uz: 'Cheksiz va sanoqli', en: 'Endless and countable' },
    cap_mult: { ru: 'Кратные числа 3', uz: '3 ga karrali sonlar', en: 'Multiples of 3' },
    cap_div: { ru: 'Делители числа 12', uz: "12 ning bo'luvchilari", en: 'Divisors of 12' },
    // Слово «тяни» ушло вместе с перетаскиванием: экран стал фильмом, ребёнок
    // ничего не двигает — прямая едет сама.
    cap_a_done: {
      ru: 'Как далеко ни уехать, следующее кратное всегда есть. Их бесконечно много.',
      uz: "Qancha uzoqqa borilmasin, keyingi karrali son doim bor. Ular cheksiz ko'p.",
      en: 'However far the line runs on, the next multiple is always there. There are infinitely many.'
    },
    cap_b_done: { ru: 'Делителей ровно шесть.', uz: "Bo'luvchilar roppa rosa oltita.", en: 'There are exactly six divisors.' },
    metro: { ru: 'Игры на турнире начинаются каждые 6 минут: 8:00, 8:06, 8:12 — это кратные шести.', uz: "Turnirda o'yinlar har 6 daqiqada boshlanadi: 8:00, 8:06, 8:12 — bular oltiga karrali.", en: 'Tournament games start every 6 minutes: 8:00, 8:06, 8:12 — these are multiples of six.' },
    // «ТЕПЕРЬ ТЫ» (методист 2026-08-14). Экран объяснения не должен кончаться
    // просмотром: один ход в конце проверяет, что кадр понят. Это НЕ практика,
    // практика идёт в блоке 9-13; тут один вопрос и разбор на каждый ответ.
    now_you: {
      head: { ru: 'Теперь ты', uz: 'Endi siz', en: 'Now you' },
      q: { ru: 'Кратные трёх: 3, 6, 9, 12, 15, 18. Какое следующее?', uz: "Uchning karralilari: 3, 6, 9, 12, 15, 18. Keyingisi qaysi?", en: 'Multiples of three: 3, 6, 9, 12, 15, 18. Which comes next?' },
      opts: { ru: ['20', '21', '24'], uz: ['20', '21', '24'], en: ['20', '21', '24'] },
      correct: 1,
      correct_text: { ru: 'Верно. 3 · 7 = 21. Кратные идут через три.', uz: "To'g'ri. 3 · 7 = 21. Karralilar uchtadan yuradi.", en: 'Correct. 3 · 7 = 21. The multiples go three apart.' },
      correct_audio: { ru: 'Верно. Три умножить на семь двадцать один. Кратные идут через три.', uz: "To'g'ri. Uch karra yetti yigirma bir. Karralilar uchtadan yuradi.", en: 'Correct. Three times seven is twenty one. The multiples go three apart.' },
      wrong: [
        { ru: '20 на 3 не делится: 20 : 3 = 6 и 2 в остатке.', uz: "20 soni 3 ga bo'linmaydi: 20 : 3 = 6, qoldiq 2.", en: '20 does not divide by 3: 20 : 3 = 6 with 2 left over.' },
        null,
        { ru: '24 кратно трём, но до него есть 21. Кратные идут через три.', uz: "24 uchga karrali, lekin undan oldin 21 bor. Karralilar uchtadan yuradi.", en: '24 is a multiple of three, but 21 comes before it. The multiples go three apart.' }
      ],
      wrong_audio: [
        { ru: 'Двадцать на три не делится. Двадцать разделить на три это шесть и два в остатке.', uz: "Yigirma uchga bo'linmaydi. Yigirmani uchga bo'lsak olti va ikki qoldiq.", en: 'Twenty does not divide by three. Twenty divided by three is six with two left over.' },
        null,
        { ru: 'Двадцать четыре кратно трём, но до него есть двадцать один. Кратные идут через три.', uz: "Yigirma to'rt uchga karrali, lekin undan oldin yigirma bir bor. Karralilar uchtadan yuradi.", en: 'Twenty four is a multiple of three, but twenty one comes before it. The multiples go three apart.' }
      ]
    },
    final: {
      ru: 'Кратных бесконечно много, делителей — конечное число.',
      uz: "Karrali sonlar cheksiz ko'p, bo'luvchilar esa sanoqli.",
      en: 'There are infinitely many multiples, but only a finite number of divisors.'
    },
    // Kino replikalari: bitta replika — bitta chiziq (metodist qarori 2026-08-13).
    audio: {
      ru: [
        'Здесь две прямые. На верхней стоят кратные числа три, на нижней делители числа двенадцать. Смотри, чем они отличаются.',
        'Метка идёт по кратным трёх: три, шесть, девять, двенадцать, пятнадцать, восемнадцать. Прямая едет дальше, и следующее кратное всегда находится. Кратных бесконечно много.',
        'Теперь делители двенадцати: один, два, три, четыре, шесть, двенадцать. Дальше прямая упирается в стену. Делителей ровно шесть, и новых уже не появится.',
        'Вот главное отличие. Кратных у числа бесконечно много, а делителей конечное число.'
      ],
      uz: [
        "Bu yerda ikkita chiziq. Yuqorigisida uchga karrali sonlar, pastkisida o'n ikkining bo'luvchilari turibdi. Ular nimasi bilan farq qilishini kuzating.",
        "Belgi uchning karralilari bo'ylab yuradi: uch, olti, to'qqiz, o'n ikki, o'n besh, o'n sakkiz. Chiziq oldinga suriladi va keyingi karrali son doim topiladi. Karrali sonlar cheksiz ko'p.",
        "Endi o'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti, o'n ikki. Keyin chiziq devorga urilib to'xtaydi. Bo'luvchilar roppa rosa oltita, yangisi paydo bo'lmaydi.",
        "Mana asosiy farq. Songa karrali sonlar cheksiz ko'p, bo'luvchilari esa sanoqli."
      ],
      en: [
        'Here are two lines. The top one carries the multiples of three, the bottom one the divisors of twelve. Watch how they differ.',
        'The marker walks along the multiples of three: three, six, nine, twelve, fifteen, eighteen. The line keeps rolling on, and the next multiple is always there. There are infinitely many multiples.',
        'Now the divisors of twelve: one, two, three, four, six, twelve. After that the line hits a wall. There are exactly six divisors, and no new ones will appear.',
        'Here is the main difference. A number has infinitely many multiples but only a finite number of divisors.'
      ]
    }
  },

  s11: {
    title: { ru: 'Собери делители', uz: "Bo'luvchilarni yig'ing", en: 'Collect the divisors' },
    lead: { ru: 'Для каждого числа выбери из списка полный набор его делителей.', uz: "Har bir son uchun ro'yxatdan uning to'liq bo'luvchilar to'plamini tanlang.", en: 'For each number choose the full set of its divisors from the list.' },
    pairs: [
      { number: '10', label: { ru: 'делители', uz: "bo'luvchilari", en: 'divisors' }, reading: { ru: '1, 2, 5, 10', uz: '1, 2, 5, 10', en: '1, 2, 5, 10' } },
      { number: '15', label: { ru: 'делители', uz: "bo'luvchilari", en: 'divisors' }, reading: { ru: '1, 3, 5, 15', uz: '1, 3, 5, 15', en: '1, 3, 5, 15' } },
      { number: '16', label: { ru: 'делители', uz: "bo'luvchilari", en: 'divisors' }, reading: { ru: '1, 2, 4, 8, 16', uz: '1, 2, 4, 8, 16', en: '1, 2, 4, 8, 16' } }
    ],
    correct_text: { ru: 'Верно. Обрати внимание: у 16 делителей нечётное количество, потому что 16 = 4 · 4.', uz: "To'g'ri. E'tibor bering: 16 da bo'luvchilar soni toq, chunki 16 = 4 · 4.", en: 'Correct. Notice that 16 has an odd number of divisors, because 16 = 4 · 4.' },
    hint: { ru: 'Проверяй по порядку: делится ли число на 1, на 2, на 3, на 4 и так далее?', uz: "Tartib bilan tekshiring: son 1 ga, 2 ga, 3 ga, 4 ga va hokazo bo'linadimi?", en: 'Check in order: does the number divide by 1, by 2, by 3, by 4 and so on?' },
    // hint ekranda raqam bilan turadi, ovozga esa audio_hint ketadi (DragMatch/Classify).
    audio_hint: { ru: 'Проверяй по порядку. Делится ли число на один, на два, на три, на четыре и так далее?', uz: "Tartib bilan tekshiring. Son birga, ikkiga, uchga, to'rtga va hokazo bo'linadimi?", en: 'Check in order. Does the number divide by one, by two, by three, by four and so on?' },
    why: {
      ru: [
        '10 = 1 · 10 = 2 · 5 — две пары, значит 4 делителя.',
        '15 = 1 · 15 = 3 · 5 — тоже две пары, 4 делителя.',
        '16 = 1 · 16 = 2 · 8 = 4 · 4 — здесь 4 встаёт в пару сам с собой, поэтому делителей 5, а не 6.'
      ],
      uz: [
        "10 = 1 · 10 = 2 · 5 — ikkita juftlik, demak 4 ta bo'luvchi.",
        "15 = 1 · 15 = 3 · 5 — bu ham ikkita juftlik, 4 ta bo'luvchi.",
        "16 = 1 · 16 = 2 · 8 = 4 · 4 — bu yerda 4 o'zi bilan o'zi juft bo'ladi, shuning uchun bo'luvchilar 6 ta emas, 5 ta."
      ],
      en: ['10 = 1 · 10 = 2 · 5 — two pairs, so 4 divisors.', '15 = 1 · 15 = 3 · 5 — two pairs as well, 4 divisors.', '16 = 1 · 16 = 2 · 8 = 4 · 4 — here 4 pairs with itself, so there are 5 divisors, not 6.']
    },
    audio: {
      intro: { ru: 'Для каждого числа выбери полный набор делителей. Нажми на число, потом выбери набор из списка.', uz: "Har bir son uchun to'liq bo'luvchilar to'plamini tanlang. Songa bosing, so'ng ro'yxatdan to'plamni tanlang.", en: 'For each number choose the full set of divisors. Tap a number, then choose a set from the list.' },
      on_correct: { ru: 'Верно, все наборы на местах.', uz: "To'g'ri, barcha to'plamlar o'z o'rniga tushdi.", en: 'Correct, every set is in place.' },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.', en: 'Check again.' }
    }
  },

  s12: {
    title: { ru: 'Делитель 6 или кратное 6?', uz: "6 ning bo'luvchisimi yoki 6 ga karralimi?", en: 'A divisor of 6 or a multiple of 6?' },
    lead: { ru: 'Делитель не больше самого числа, кратное — не меньше.', uz: "Bo'luvchi sondan katta emas, karrali son esa kichik emas.", en: 'A divisor is not larger than the number itself, a multiple is not smaller.' },
    bin_a: { ru: 'Делитель 6', uz: "6 ning bo'luvchisi", en: 'Divisor of 6' },
    bin_b: { ru: 'Кратное 6', uz: "6 ga karrali", en: 'Multiple of 6' },
    cards: [
      { label: '1', bin: 'a' },
      { label: '2', bin: 'a' },
      { label: '3', bin: 'a' },
      { label: '12', bin: 'b' },
      { label: '18', bin: 'b' },
      { label: '24', bin: 'b' }
    ],
    hint: { ru: 'Спроси себя: это 6 делится на данное число, или данное число делится на 6?', uz: "O'zingizdan so'rang: 6 shu songa bo'linadimi, yoki shu son 6 ga bo'linadimi?", en: 'Ask yourself: does 6 divide by this number, or does this number divide by 6?' },
    audio_hint: { ru: 'Спроси себя. Это шесть делится на данное число, или данное число делится на шесть?', uz: "O'zingizdan so'rang. Olti shu songa bo'linadimi, yoki shu son oltiga bo'linadimi?", en: 'Ask yourself. Does six divide by this number, or does this number divide by six?' },
    correct_text: { ru: 'Точно. Из данных чисел 1, 2 и 3 — делители числа 6, а 12, 18 и 24 — кратные числа 6.', uz: "Aniq. Berilgan sonlardan 1, 2 va 3 — 6 ning bo'luvchilari, 12, 18 va 24 esa 6 ga karrali sonlar.", en: 'Exactly. Of these numbers 1, 2 and 3 are divisors of 6, while 12, 18 and 24 are multiples of 6.' },
    why: {
      ru: [
        'Из данных чисел делители — это те, на которые делится 6: 6 : 1, 6 : 2, 6 : 3.',
        'Кратное — это то, что делится на 6: 12 : 6, 18 : 6, 24 : 6.',
        'Поэтому в этом задании 1, 2, 3 идут к делителям, а 12, 18, 24 — к кратным.'
      ],
      uz: [
        "Berilgan sonlardan bo'luvchilar — 6 qaysilariga bo'linsa, o'shalar: 6 : 1, 6 : 2, 6 : 3.",
        "Karrali son — bu 6 ga nima bo'linsa, o'sha: 12 : 6, 18 : 6, 24 : 6.",
        "Shuning uchun bu topshiriqda 1, 2, 3 bo'luvchilarga, 12, 18, 24 esa karrali sonlarga kiradi."
      ],
      en: ['Among these numbers the divisors are the ones 6 divides by: 6 : 1, 6 : 2, 6 : 3.', 'A multiple is a number that divides by 6: 12 : 6, 18 : 6, 24 : 6.', 'So in this task 1, 2, 3 go to the divisors, and 12, 18, 24 go to the multiples.']
    },
    audio: {
      intro: { ru: 'Разбери числа на две группы. Делитель шести или кратное шести?', uz: "Sonlarni ikki guruhga ajrating. Oltining bo'luvchisimi yoki oltiga karralimi?", en: 'Sort the numbers into two groups. A divisor of six or a multiple of six?' },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда.', uz: 'Bu yerga emas.', en: 'Not here.' }
    }
  },

  s13: {
    label: { ru: 'финальная задача', uz: 'yakuniy masala', en: 'final task' },
    context: { ru: 'Ищи парами и нажимай на подходящие числа.', uz: "Juftlab qidiring va mos sonlarni bosing.", en: 'Look in pairs and tap the numbers that fit.' },
    question: { ru: 'Выбери все делители числа 36', uz: "36 sonining barcha bo'luvchilarini tanlang", en: 'Choose all the divisors of 36' },
    numbers: ['1', '2', '3', '4', '5', '6', '8', '9', '12', '18', '24', '36'],
    divisors: ['1', '2', '3', '4', '6', '9', '12', '18', '36'],
    correct_text: { ru: 'Верно: 1, 2, 3, 4, 6, 9, 12, 18, 36 — всего 9. Число нечётное, потому что 36 = 6 · 6.', uz: "To'g'ri: 1, 2, 3, 4, 6, 9, 12, 18, 36 — jami 9 ta. Soni toq, chunki 36 = 6 · 6.", en: 'Correct: 1, 2, 3, 4, 6, 9, 12, 18, 36 — nine in all. The count is odd, because 36 = 6 · 6.' },
    hint: { ru: 'Ищи парами: 1 и 36, 2 и 18, 3 и 12, 4 и 9. А 6 идёт в паре сам с собой.', uz: "Juftlab qidiring: 1 va 36, 2 va 18, 3 va 12, 4 va 9. 6 esa o'zi bilan o'zi juft bo'ladi.", en: 'Look in pairs: 1 and 36, 2 and 18, 3 and 12, 4 and 9. And 6 pairs with itself.' },
    why: {
      ru: [
        '1 · 36, 2 · 18, 3 · 12, 4 · 9 — четыре пары, это уже 8 делителей.',
        '6 · 6 = 36 — здесь оба множителя одинаковы, поэтому 6 считается один раз.',
        'Всего 9 делителей. У квадратов число делителей всегда нечётное.'
      ],
      uz: [
        "1 · 36, 2 · 18, 3 · 12, 4 · 9 — to'rtta juftlik, bu allaqachon 8 ta bo'luvchi.",
        "6 · 6 = 36 — bu yerda ikkala ko'paytuvchi bir xil, shuning uchun 6 bir marta sanaladi.",
        "Jami 9 ta bo'luvchi. Kvadratlarda bo'luvchilar soni doim toq bo'ladi."
      ],
      en: ['1 · 36, 2 · 18, 3 · 12, 4 · 9 — four pairs, that is already 8 divisors.', '6 · 6 = 36 — both factors are the same here, so 6 counts once.', 'Nine divisors in all. Squares always have an odd number of divisors.']
    },
    fact: { ru: 'Если число — квадрат, один делитель встаёт в пару сам с собой: 6 · 6 = 36. Поэтому у квадратов делителей нечётное количество.', uz: "Agar son kvadrat bo'lsa, bitta bo'luvchi o'zi bilan o'zi juft bo'ladi: 6 · 6 = 36. Shuning uchun kvadratlarda bo'luvchilar soni toq.", en: 'If a number is a square, one divisor pairs with itself: 6 · 6 = 36. That is why squares have an odd number of divisors.' },
    fact_audio: { ru: 'Знаешь ли ты? Если число квадрат, один делитель встаёт в пару сам с собой, шесть на шесть тридцать шесть. Поэтому у квадратов количество делителей нечётное.', uz: "Bilasizmi? Agar son kvadrat bo'lsa, bitta bo'luvchi o'zi bilan o'zi juft bo'ladi, olti karra olti o'ttiz olti. Shuning uchun kvadratlarda bo'luvchilar soni toq.", en: 'Did you know? If a number is a square, one divisor pairs with itself, six times six is thirty six. That is why squares have an odd number of divisors.' },
    audio: {
      intro: { ru: 'Финальная задача. Выбери все делители числа тридцать шесть. Ищи парами и нажимай на подходящие числа.', uz: "Yakuniy masala. O'ttiz olti sonining barcha bo'luvchilarini tanlang. Juftlab qidiring va mos sonlarni bosing.", en: 'Final task. Choose all the divisors of thirty six. Look in pairs and tap the numbers that fit.' },
      on_correct: { ru: 'Верно, девять делителей.', uz: "To'g'ri, to'qqizta bo'luvchi.", en: 'Correct, nine divisors.' },
      on_wrong: { ru: 'Не всё. Посмотри подсказку и продолжай.', uz: "Hammasi emas. Maslahatga qarang va davom eting.", en: 'Not all of them. Read the hint and carry on.' }
    }
  },

  s14: {
    heading: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar", en: 'Divisors and multiples' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    banner: { ru: 'Математика · Делимость', uz: 'Matematika · Bo\'linish', en: 'Mathematics · Divisibility' },
    // Итог 2026-08-13: текста меньше, три карточки одного размера.
    // Длинные формулировки правила остаются на экране 8, тут только суть.
    brief_1: { ru: 'a : b без остатка → b делитель, a кратное', uz: "a : b qoldiqsiz → b bo'luvchi, a karrali", en: 'a : b with no remainder → b divisor, a multiple' },
    brief_2: { ru: '1 и само число — делители всегда', uz: "1 va sonning o'zi — doim bo'luvchi", en: '1 and the number itself are always divisors' },
    brief_3: { ru: 'кратных бесконечно, делителей конечно', uz: "karralilar cheksiz, bo'luvchilar sanoqli", en: 'multiples endless, divisors countable' },
    // Metodist 2026-08-13: ilgari 01 va 02 bir xil gapni so'zlari joyi
    // almashtirilgan holda takrorlardi — bola ikkinchisida YANGI fikr ko'rmasdi.
    // Endi simmetriya BITTA qatorda, keyingi ikki band esa AJRALGAN faktlar.
    // «Ikki xil o'qiladi» degan gap O'ZI ikki o'qishni KO'RSATISHI kerak edi:
    // ilgari faqat va'da qilingan, misol esa izohsiz turgan.
    read_label: { ru: 'Два прочтения одного примера', uz: "Bitta misolning ikki o'qilishi", en: 'Two readings of one example' },
    read_a: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi", en: '3 is a divisor of 12' },
    read_b: { ru: '12 — кратное числа 3', uz: '12 — 3 ning karralisi', en: '12 is a multiple of 3' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Если a делится на b без остатка, то b это делитель числа a, а a это кратное числа b. Оба названия даёт одно и то же деление.',
        'У любого числа делители это единица и оно само. Кратных бесконечно много, а делителей конечное число. Дальше разберём признаки делимости на два, пять и десять.'
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Agar a soni b ga qoldiqsiz bo'linsa, b bu a sonining bo'luvchisi, a esa b sonining karralisi. Ikkala nomni bitta bo'lishning o'zi beradi.",
        "Har qanday sonning bo'luvchilari bu bir va sonning o'zi. Karrali sonlar cheksiz ko'p, bo'luvchilar esa sanoqli. Keyin ikki, besh va o'nga bo'linish alomatlarini ko'rib chiqamiz."
      ],
      en: ['The lesson is done. Let us gather the main points.', 'If a divides by b with no remainder, then b is a divisor of a, and a is a multiple of b. One and the same division gives both names.', 'Every number has one and itself as divisors. There are infinitely many multiples, but a finite number of divisors. Next we will work through the divisibility rules for two, five and ten.']
    }
  },

  // ============================================================
  // v4 (metodist qarori 2026-08-13): dars 15 ekranga qayta yig'ildi,
  // 3-sinf 1-darsining karkasi bo'yicha. Yangi o'zak — UCHTA USUL:
  // 1) bitta sonni tekshirish, 2) barcha bo'luvchilarni juftlab topish,
  // 3) karrali sonlarni ko'paytirish orqali hosil qilish.
  // Usul ekranda NOMLANADI va QADAMLAB yoziladi: ilgari u faqat xato
  // qilgan bolaga ishora sifatida ko'rinardi, ya'ni usulga o'rgatilmasdi.
  // ============================================================

  // Ekran 2 — ESLAYMIZ. Ko'paytirish jadvali tayyor bo'luvchilar ro'yxati.
  s_recall: {
    title: { ru: 'Ты это уже знаешь', uz: 'Buni siz allaqachon bilasiz', en: 'You already know this' },
    lead: { ru: '3 команды по 4 игрока — это 12 участников.', uz: "4 nafardan 3 jamoa — bu 12 ishtirokchi.", en: '3 teams of 4 players make 12 participants.' },
    lbl_div: { ru: 'делители', uz: "bo'luvchilar", en: 'divisors' },
    lbl_mul: { ru: 'кратное', uz: 'karralisi', en: 'multiple' },
    div_a: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi", en: '3 is a divisor of 12' },
    div_b: { ru: '4 — делитель числа 12', uz: "4 — 12 ning bo'luvchisi", en: '4 is a divisor of 12' },
    mul_a: { ru: '12 — кратное числа 3', uz: "12 — 3 ning karralisi", en: '12 is a multiple of 3' },
    mul_b: { ru: '12 — кратное числа 4', uz: "12 — 4 ning karralisi", en: '12 is a multiple of 4' },
    // «ТЕПЕРЬ ТЫ» (методист 2026-08-14). Экран объяснения не должен кончаться
    // просмотром: один ход в конце проверяет, что кадр понят. Это НЕ практика,
    // практика идёт в блоке 9-13; тут один вопрос и разбор на каждый ответ.
    now_you: {
      head: { ru: 'Теперь ты', uz: 'Endi siz', en: 'Now you' },
      q: { ru: '5 · 4 = 20. Кто здесь делители?', uz: '5 · 4 = 20. Bu yerda bo\'luvchilar qaysilari?', en: '5 · 4 = 20. Which are the divisors here?' },
      opts: { ru: ['5 и 4', '20 и 4', 'только 20'], uz: ['5 va 4', '20 va 4', "faqat 20"], en: ['5 and 4', '20 and 4', 'only 20'] },
      correct: 0,
      correct_text: { ru: 'Верно. 20 получилось из 5 и 4, значит они делители, а 20 — кратное.', uz: "To'g'ri. 20 soni 5 va 4 dan chiqdi, demak ular bo'luvchi, 20 esa karrali.", en: 'Correct. 20 came from 5 and 4, so they are divisors and 20 is the multiple.' },
      correct_audio: { ru: 'Верно. Двадцать получилось из пятёрки и четвёрки, значит они делители, а двадцать кратное.', uz: "To'g'ri. Yigirma besh va to'rtdan chiqdi, demak ular bo'luvchi, yigirma esa karrali.", en: 'Correct. Twenty came from five and four, so they are divisors and twenty is the multiple.' },
      wrong: [
        null,
        { ru: '20 — это то, что получилось. Оно кратное. Делители — то, из чего оно получилось.', uz: "20 — bu chiqqan natija. U karrali. Bo'luvchilar esa nimadan chiqqani.", en: '20 is what came out. It is the multiple. The divisors are what it came from.' },
        { ru: '20 — результат. Делители стоят слева от знака равно, и их два.', uz: "20 — natija. Bo'luvchilar teng belgisidan chapda turadi va ular ikkita.", en: '20 is the result. The divisors stand left of the equals sign, and there are two.' }
      ],
      wrong_audio: [
        null,
        { ru: 'Двадцать это то, что получилось, оно кратное. Делители это то, из чего оно получилось.', uz: "Yigirma bu chiqqan natija, u karrali. Bo'luvchilar esa nimadan chiqqani.", en: 'Twenty is what came out, it is the multiple. The divisors are what it came from.' },
        { ru: 'Двадцать это результат. Делители стоят слева от знака равно, и их два.', uz: "Yigirma bu natija. Bo'luvchilar teng belgisidan chapda turadi va ular ikkita.", en: 'Twenty is the result. The divisors stand left of the equals sign, and there are two.' }
      ]
    },
    note: {
      ru: 'Таблица умножения — готовый список делителей.',
      uz: "Ko'paytirish jadvali — tayyor bo'luvchilar ro'yxati.",
      en: 'The times table is a ready list of divisors.'
    },
    audio: {
      ru: [
        'Вернёмся к турниру. Три команды по четыре игрока это двенадцать участников. Трижды четыре двенадцать, и ты это знаешь давно.',
        'А теперь новое, и только одно. Раз двенадцать получилось из тройки и четвёрки, значит тройка и четвёрка называются делителями двенадцати.',
        'И обратно. Двенадцать называется кратным тройки и кратным четвёрки.',
        'Получается, таблица умножения, которую ты давно выучил, это готовый список делителей. Новую тему ты наполовину уже знаешь.'
      ],
      uz: [
        "Turnirga qaytamiz. To'rt nafardan uchta jamoa bu o'n ikki ishtirokchi. Uch karra to'rt o'n ikki, buni siz ancha oldin bilasiz.",
        "Endi yangisi, faqat bitta. O'n ikki uch va to'rtdan chiqdi, demak uch va to'rt o'n ikkining bo'luvchilari deyiladi.",
        "Teskarisi ham shunday. O'n ikki uchning karralisi va to'rtning karralisi deyiladi.",
        "Demak, siz ancha oldin yodlagan ko'paytirish jadvali tayyor bo'luvchilar ro'yxati ekan. Yangi mavzuning yarmini siz allaqachon bilasiz."
      ],
      en: [
        'Back to the tournament. Three teams of four players make twelve participants. Three times four is twelve, and you have known that for a long time.',
        'Now the new part, and there is only one. Since twelve came from three and four, three and four are called divisors of twelve.',
        'And the other way round. Twelve is called a multiple of three and a multiple of four.',
        'So the times table you learned long ago is a ready list of divisors. You already know half of this topic.'
      ]
    }
  },

  // Uchta usulning KARTOCHKASI. Matn bitta joyda turadi: usul uch ekranda
  // eslatiladi (4, 5, 7) va yakunda takrorlanadi (15).
  s_methods: {
    m1_title: { ru: 'Способ 1. Проверить одно число', uz: '1-usul. Bitta sonni tekshirish', en: 'Method 1. Check one number' },
    m1_steps: {
      ru: ['Раздели', 'Посмотри остаток', 'Остаток 0 — делится'],
      uz: ["Bo'ling", 'Qoldiqqa qarang', "Qoldiq 0 — bo'linadi"],
      en: ['Divide', 'Look at the remainder', 'Remainder 0 means it divides']
    },
    m1_no: { ru: 'Остаток не 0 — не делится.', uz: "Qoldiq 0 emas — bo'linmaydi.", en: 'A remainder that is not 0 means it does not.' },
    m2_title: { ru: 'Способ 2. Найти все делители', uz: "2-usul. Barcha bo'luvchilarni topish", en: 'Method 2. Find every divisor' },
    m2_steps: {
      ru: [
        'Пиши 1 и само число — эта пара есть всегда',
        'Пробуй 2, 3, 4 и дальше по порядку',
        'Разделилось — пиши оба числа пары',
        'Стоп, когда левое встретило правое'
      ],
      uz: [
        "1 va sonning o'zini yozing — bu juftlik doim bor",
        '2, 3, 4 va keyingilarini tartib bilan sinang',
        "Bo'lindi — juftlikning ikkala sonini yozing",
        "Chap o'ngga yetganda to'xtang"
      ],
      en: [
        'Write 1 and the number itself, this pair is always there',
        'Try 2, 3, 4 and on in order',
        'If it divides, write both numbers of the pair',
        'Stop when the left one meets the right one'
      ]
    },
    m3_title: { ru: 'Способ 3. Получить кратные', uz: '3-usul. Karrali sonlarni hosil qilish', en: 'Method 3. Get the multiples' },
    m3_steps: {
      ru: ['Умножай число на 1, 2, 3 и дальше'],
      uz: ["Sonni 1, 2, 3 va keyingilariga ko'paytiring"],
      en: ['Multiply the number by 1, 2, 3 and on']
    },
    memo_title: { ru: 'Три способа', uz: 'Uchta usul', en: 'Three methods' },
    // Короткие имена для итоговой карточки: полные названия там не помещаются
    // и превращают памятку в стену текста.
    short_1: { ru: 'Одно число', uz: 'Bitta son', en: 'One number' },
    short_2: { ru: 'Все делители', uz: 'Barcha bo\'luvchilar', en: 'All divisors' },
    short_3: { ru: 'Кратные', uz: 'Karrali sonlar', en: 'Multiples' },
    memo_1: { ru: 'раздели, смотри остаток', uz: "bo'ling, qoldiqqa qarang", en: 'divide, look at the remainder' },
    memo_2: { ru: 'иди парами до встречи', uz: 'juftlab uchrashguncha yuring', en: 'go in pairs until they meet' },
    memo_3: { ru: 'умножай на 1, 2, 3 и дальше', uz: "1, 2, 3 va keyingilariga ko'paytiring", en: 'multiply by 1, 2, 3 and on' }
  },

  // Ekran 6 — BIRGA YECHAMIZ. To'liq yechim namunasi: 24 ning bo'luvchilari.
  // Muvaffaqiyatsiz qadam (beshlik) ham yozuvda QOLADI — bola rad javobini
  // ko'rishi kerak, hozirgi darsda faqat omadli juftliklar ko'rsatiladi.
  s_solve: {
    title: { ru: 'Найти все делители числа 24', uz: "24 sonining barcha bo'luvchilarini topish", en: 'Find every divisor of 24' },
    lead: { ru: 'То самое число, с которого начался урок. Записываю каждый шаг, ничего не стираю.', uz: "Dars shu sondan boshlangan edi. Har bir qadamni yozib boraman, hech narsani o'chirmayman.", en: 'The very number the lesson began with. I write down every step and erase nothing.' },
    rows: [
      { d: 1, q: 24, rest: 0, pair: '1 и 24' },
      { d: 2, q: 12, rest: 0, pair: '2 и 12' },
      { d: 3, q: 8, rest: 0, pair: '3 и 8' },
      { d: 4, q: 6, rest: 0, pair: '4 и 6' },
      { d: 5, q: 4, rest: 4, pair: null },
      { d: 6, q: 4, rest: 0, pair: 'stop' }
    ],
    pair_word: { ru: 'и', uz: 'va', en: 'and' },
    rest_word: { ru: 'остаток', uz: 'qoldiq', en: 'remainder' },
    no_pair: { ru: 'пары нет', uz: "juftlik yo'q", en: 'no pair' },
    stop_word: { ru: 'встретились, стоп', uz: "uchrashdi, to'xtaymiz", en: 'they met, stop' },
    answer: {
      ru: 'Ответ: 1, 2, 3, 4, 6, 8, 12, 24 — восемь делителей',
      uz: "Javob: 1, 2, 3, 4, 6, 8, 12, 24 — sakkizta bo'luvchi",
      en: 'Answer: 1, 2, 3, 4, 6, 8, 12, 24 — eight divisors'
    },
    q5: { ru: 'Делится ли 24 на 5 без остатка?', uz: '24 soni 5 ga qoldiqsiz bo\'linadimi?', en: 'Does 24 divide by 5 with no remainder?' },
    q5_yes: { ru: 'Да', uz: 'Ha', en: 'Yes' },
    q5_no: { ru: 'Нет', uz: "Yo'q", en: 'No' },
    q5_wrong: { ru: '24 : 5 = 4, и 4 в остатке. Пятёрка пары не даёт.', uz: "24 : 5 = 4, qoldiq 4. Besh juftlik bermaydi.", en: '24 : 5 = 4 with 4 left over. Five gives no pair.' },
    q5_wrong_audio: {
      ru: 'Двадцать четыре разделить на пять это четыре и четыре в остатке. Остаток не ноль, значит пятёрка делителем не будет.',
      uz: "Yigirma to'rtni beshga bo'lsak to'rt chiqadi va to'rt qoldiq qoladi. Qoldiq nol emas, demak besh bo'luvchi bo'lolmaydi.",
      en: 'Twenty four divided by five is four with a remainder of four. The remainder is not zero, so five will not be a divisor.'
    },
    q_stop: { ru: 'На числе 6 пара дала 4. Что делаем дальше?', uz: "6 da juftlik 4 ni berdi. Endi nima qilamiz?", en: 'At 6 the pair gave 4. What do we do next?' },
    stop_a: { ru: 'Останавливаемся: левое догнало правое', uz: "To'xtaymiz: chap o'ngga yetdi", en: 'Stop: the left one caught the right one' },
    stop_b: { ru: 'Продолжаем до 24', uz: '24 gacha davom etamiz', en: 'Keep going up to 24' },
    stop_c: { ru: 'Продолжаем до 12', uz: '12 gacha davom etamiz', en: 'Keep going up to 12' },
    stop_wrong_b: { ru: 'Дальше пойдут те же пары, только наоборот: 8 и 3, 12 и 2, 24 и 1. Новых делителей не будет.', uz: "Keyin o'sha juftliklar teskari tartibda keladi: 8 va 3, 12 va 2, 24 va 1. Yangi bo'luvchi chiqmaydi.", en: 'The same pairs come next, only reversed: 8 and 3, 12 and 2, 24 and 1. No new divisors appear.' },
    stop_wrong_b_audio: {
      ru: 'Дальше пойдут те же самые пары, только задом наперёд. Восемь и три, двенадцать и два. Новых делителей они не дадут, работа будет впустую.',
      uz: "Keyin o'sha juftliklarning o'zi teskari tartibda keladi. Sakkiz va uch, o'n ikki va ikki. Ular yangi bo'luvchi bermaydi, mehnat behuda ketadi.",
      en: 'The very same pairs come next, only backwards. Eight and three, twelve and two. They give no new divisors, the work would be wasted.'
    },
    stop_wrong_c: { ru: '12 уже записано в паре с 2. Пары начали повторяться на шестёрке.', uz: "12 allaqachon 2 bilan juftlikda yozilgan. Juftliklar oltida takrorlana boshladi.", en: '12 is already written in the pair with 2. The pairs started repeating at six.' },
    stop_wrong_c_audio: {
      ru: 'Двенадцать уже записано в паре с двойкой. Повторение началось на шестёрке, значит там и остановка.',
      uz: "O'n ikki allaqachon ikki bilan juftlikda yozilgan. Takrorlanish oltida boshlandi, demak to'xtash ham shu yerda.",
      en: 'Twelve is already written in the pair with two. The repeating started at six, so that is where we stop.'
    },
    audio: {
      ru: [
        'Теперь решим целиком, от начала до конца. Найдём все делители двадцати четырёх. Я записываю каждый шаг и ничего не стираю, чтобы ты видел весь путь.',
        'Начинаю с первой пары, она есть всегда. Единица и двадцать четыре.',
        'Двойка. Двадцать четыре разделить на два двенадцать. Пара есть. Тройка. Восемь. Пара есть. Четвёрка. Шесть. Пара есть.',
        'Теперь пятёрка. Как думаешь, разделится?',
        'Не разделилась, остаток четыре. Смотри, я всё равно записал эту строку. Неудачный шаг тоже часть решения, его не прячут.',
        'Шестёрка. Двадцать четыре разделить на шесть четыре. Но четвёрка уже есть в списке. Левое догнало правое.',
        'Ответ. Единица, два, три, четыре, шесть, восемь, двенадцать, двадцать четыре. Восемь делителей.'
      ],
      uz: [
        "Endi boshidan oxirigacha to'liq yechamiz. Yigirma to'rtning barcha bo'luvchilarini topamiz. Men har bir qadamni yozib boraman va hech narsani o'chirmayman, siz butun yo'lni ko'rib turing.",
        "Birinchi juftlikdan boshlayman, u doim bor. Bir va yigirma to'rt.",
        "Ikki. Yigirma to'rtni ikkiga bo'lsak o'n ikki. Juftlik bor. Uch. Sakkiz. Juftlik bor. To'rt. Olti. Juftlik bor.",
        "Endi besh. Sizningcha, bo'linadimi?",
        "Bo'linmadi, qoldiq to'rt. Qarang, men bu qatorni baribir yozdim. Muvaffaqiyatsiz qadam ham yechimning bir qismi, uni yashirmaydilar.",
        "Olti. Yigirma to'rtni oltiga bo'lsak to'rt. Lekin to'rt ro'yxatda bor. Chap o'ngga yetdi.",
        "Javob. Bir, ikki, uch, to'rt, olti, sakkiz, o'n ikki, yigirma to'rt. Sakkizta bo'luvchi."
      ],
      en: [
        'Now we solve one all the way through. We find every divisor of twenty four. I write down each step and erase nothing, so you can see the whole path.',
        'I start with the first pair, it is always there. One and twenty four.',
        'Two. Twenty four divided by two is twelve. There is a pair. Three. Eight. There is a pair. Four. Six. There is a pair.',
        'Now five. What do you think, will it divide?',
        'It did not, the remainder is four. Look, I wrote that line down anyway. A failed step is part of the solution too, we do not hide it.',
        'Six. Twenty four divided by six is four. But four is already on the list. The left one caught the right one.',
        'The answer. One, two, three, four, six, eight, twelve, twenty four. Eight divisors.'
      ]
    }
  },

  // Ekran 9 — MASHQ 1. Rollarni nomlash, uchta misol ketma-ket.
  s_roles: {
    title: { ru: 'Назови каждое число', uz: 'Har bir sonni nomlang', en: 'Name each number' },
    lead: { ru: 'Игроки расходятся по командам. Делитель не больше самого числа, кратное — не меньше.', uz: "O'yinchilar jamoalarga bo'linadi. Bo'luvchi sondan katta emas, karrali son esa kichik emas.", en: 'The players split into teams. A divisor is not larger than the number, a multiple is not smaller.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    // Подпись над примером: сколько игроков и на сколько команд.
    ctx: { ru: '{a} игроков на {b} команд', uz: "{a} o'yinchi {b} ta jamoaga", en: '{a} players into {b} teams' },
    opt_mult: { ru: 'кратное', uz: 'karralisi', en: 'multiple' },
    opt_div: { ru: 'делитель', uz: "bo'luvchisi", en: 'divisor' },
    items: [
      { a: '20', b: '5', r: '4' },
      { a: '18', b: '3', r: '6' },
      { a: '35', b: '7', r: '5' }
    ],
    row_a: { ru: '{a} — это … числа {b}', uz: "{a} — bu {b} sonining …", en: '{a} is the … of {b}' },
    row_b: { ru: '{b} — это … числа {a}', uz: "{b} — bu {a} sonining …", en: '{b} is the … of {a}' },
    correct_text: { ru: 'Верно. Меньшее делит, большее ему кратно.', uz: "To'g'ri. Kichigi bo'ladi, kattasi unga karrali.", en: 'Correct. The smaller one divides, the larger one is its multiple.' },
    wrong_swap: { ru: 'Перепутано местами. Делитель не больше самого числа: меньшее делит, большее делится.', uz: "O'rni almashib ketdi. Bo'luvchi sonning o'zidan katta bo'lmaydi: kichigi bo'ladi, kattasi bo'linadi.", en: 'They are swapped. A divisor is never larger than the number: the smaller one divides, the larger one is divided.' },
    wrong_same: { ru: 'Оба названия одинаковыми не бывают. Одно деление даёт два разных имени.', uz: "Ikkala nom bir xil bo'lmaydi. Bitta bo'lish ikkita har xil nom beradi.", en: 'The two names are never the same. One division gives two different names.' },
    audio: {
      intro: { ru: 'Три примера подряд. В каждом назови оба числа. Подсказку держи в голове. Делитель не больше самого числа, кратное не меньше.', uz: "Ketma-ket uchta misol. Har birida ikkala sonni nomlang. Yodda tuting. Bo'luvchi sondan katta emas, karrali son esa kichik emas.", en: 'Three examples in a row. Name both numbers in each. Keep the clue in mind. A divisor is not larger than the number, a multiple is not smaller.' },
      on_correct: { ru: 'Верно. Меньшее делит, большее кратно.', uz: "To'g'ri. Kichigi bo'ladi, kattasi karrali.", en: 'Correct. The smaller one divides, the larger one is a multiple.' },
      on_wrong: { ru: 'Посмотри разбор и попробуй ещё раз.', uz: "Tushuntirishga qarang va yana urinib ko'ring.", en: 'Look at the explanation and try again.' }
    }
  },

  // Ekran 10 — MASHQ 2. Birinchi usul amalda, to'rtta tekshiruv.
  s_check: {
    title: { ru: 'Делится или нет', uz: "Bo'linadimi yoki yo'q", en: 'Does it divide or not' },
    lead: { ru: 'Ответь да или нет. Смотри на остаток.', uz: "Ha yoki yo'q deb javob bering. Qoldiqqa qarang.", en: 'Answer yes or no. Look at the remainder.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    yes: { ru: 'Да', uz: 'Ha', en: 'Yes' },
    no: { ru: 'Нет', uz: "Yo'q", en: 'No' },
    items: [
      { n: 91, d: 7, ok: true },
      { n: 45, d: 6, ok: false },
      { n: 48, d: 8, ok: true },
      { n: 50, d: 4, ok: false }
    ],
    q: [
      { ru: 'На турнир привезли 91 бутылку воды на 7 команд. Раздать поровну выйдет?', uz: "Turnirga 7 ta jamoaga 91 shisha suv keltirildi. Teng bo'lib berish chiqadimi?", en: '91 bottles of water arrived for 7 teams. Can they be shared equally?' },
      { ru: 'Игры начинаются каждые 6 минут. Будет ли игра на 45-й минуте?', uz: "O'yinlar har 6 daqiqada boshlanadi. 45-daqiqada o'yin bo'ladimi?", en: 'Games start every 6 minutes. Will there be a game at minute 45?' },
      { ru: '48 тетрадей на 8 стопок. Поровну?', uz: "48 ta daftar 8 ta uyumga. Tengmi?", en: '48 notebooks into 8 stacks. Equally?' },
      { ru: '50 участников на 4 площадки поровну?', uz: "50 ishtirokchi 4 ta maydonga tengmi?", en: 'Can 50 participants be split evenly across 4 courts?' }
    ],
    correct: [
      { ru: 'Верно. 91 : 7 = 13, остаток 0. Каждой команде по 13 бутылок.', uz: "To'g'ri. 91 : 7 = 13, qoldiq 0. Har bir jamoaga 13 tadan shisha.", en: 'Correct. 91 : 7 = 13, remainder 0. Thirteen bottles per team.' },
      { ru: 'Верно. 45 : 6 = 7, остаток 3. В это время игра не начинается.', uz: "To'g'ri. 45 : 6 = 7, qoldiq 3. Bu vaqtda o'yin boshlanmaydi.", en: 'Correct. 45 : 6 = 7, remainder 3. No game starts at that time.' },
      { ru: 'Верно. 48 : 8 = 6, остаток 0. По шесть тетрадей в стопке.', uz: "To'g'ri. 48 : 8 = 6, qoldiq 0. Har uyumda oltitadan daftar.", en: 'Correct. 48 : 8 = 6, remainder 0. Six notebooks per stack.' },
      { ru: 'Верно. 50 : 4 = 12, остаток 2. Двоим площадки не хватило.', uz: "To'g'ri. 50 : 4 = 12, qoldiq 2. Ikki kishiga maydon yetmadi.", en: 'Correct. 50 : 4 = 12, remainder 2. Two had no court.' }
    ],
    wrong: [
      { ru: '91 : 7 = 13 ровно. Остаток ноль, значит поровну выходит.', uz: "91 : 7 = 13, tekis. Qoldiq nol, demak teng bo'linadi.", en: '91 : 7 = 13 exactly. The remainder is zero, so it shares equally.' },
      { ru: '45 : 6 = 7 и 3 в остатке. Три минуты лишние, игра в это время не начинается.', uz: "45 : 6 = 7, qoldiq 3. Uch daqiqa ortiqcha, bu vaqtda o'yin boshlanmaydi.", en: '45 : 6 = 7 with 3 left over. Three extra minutes, no game starts then.' },
      { ru: '48 : 8 = 6 ровно. По шесть тетрадей в стопке, лишних нет.', uz: "48 : 8 = 6, tekis. Har uyumda oltitadan daftar, ortiqchasi yo'q.", en: '48 : 8 = 6 exactly. Six notebooks per stack, none left over.' },
      { ru: '50 : 4 = 12 и 2 в остатке. Двоим площадки не хватило.', uz: "50 : 4 = 12, qoldiq 2. Ikki kishiga maydon yetmadi.", en: '50 : 4 = 12 with 2 left over. Two had no court.' }
    ],
    wrong_audio: [
      { ru: 'Девяносто один разделить на семь тринадцать. Остаток ноль, значит каждой команде достанется поровну.', uz: "To'qson birni yettiga bo'lsak o'n uch. Qoldiq nol, demak har bir jamoaga teng tegadi.", en: 'Ninety one divided by seven is thirteen. The remainder is zero, so every team gets an equal share.' },
      { ru: 'Сорок пять разделить на шесть семь и три в остатке. Три минуты лишние, игра в это время не начинается.', uz: "Qirq beshni oltiga bo'lsak yetti va uch qoldiq. Uch daqiqa ortiqcha, bu vaqtda o'yin boshlanmaydi.", en: 'Forty five divided by six is seven with three left over. Three extra minutes, no game starts then.' },
      { ru: 'Сорок восемь разделить на восемь шесть. По шесть тетрадей в стопке, лишних нет.', uz: "Qirq sakkizni sakkizga bo'lsak olti. Har uyumda oltitadan daftar, ortiqchasi yo'q.", en: 'Forty eight divided by eight is six. Six notebooks per stack, none left over.' },
      { ru: 'Пятьдесят разделить на четыре двенадцать и два в остатке. Двоим площадки не хватило.', uz: "Ellikni to'rtga bo'lsak o'n ikki va ikki qoldiq. Ikki kishiga maydon yetmadi.", en: 'Fifty divided by four is twelve with two left over. Two had no court.' }
    ],
    audio: {
      intro: { ru: 'Четыре проверки по первому способу. Каждый раз дели и смотри на остаток, а не на то, красиво ли получилось.', uz: "Birinchi usul bo'yicha to'rtta tekshiruv. Har safar bo'ling va natija chiroyli chiqdimi emas, qoldiqqa qarang.", en: 'Four checks using the first method. Each time divide and look at the remainder, not at how neat it looks.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: "Tushuntirishga qarang.", en: 'Look at the explanation.' }
    }
  },

  // Ekran 11, ikkinchi topshiriq: 20 ning bo'luvchilari (birinchisi — s9, 18).
  s9b: {
    label: { ru: 'теперь сам', uz: "endi o'zingiz", en: 'now on your own' },
    context: { ru: 'Тот же способ, но подсказок нет.', uz: "O'sha usul, lekin ishora yo'q.", en: 'The same method, but no hints.' },
    question: { ru: 'Выбери все делители числа 20', uz: "20 sonining barcha bo'luvchilarini tanlang", en: 'Choose all the divisors of 20' },
    numbers: ['1', '2', '3', '4', '5', '6', '10', '20'],
    divisors: ['1', '2', '4', '5', '10', '20'],
    correct_text: { ru: 'Верно: 1, 2, 4, 5, 10, 20 — шесть делителей. Пары: 1 и 20, 2 и 10, 4 и 5.', uz: "To'g'ri: 1, 2, 4, 5, 10, 20 — oltita bo'luvchi. Juftliklar: 1 va 20, 2 va 10, 4 va 5.", en: 'Correct: 1, 2, 4, 5, 10, 20 — six divisors. Pairs: 1 and 20, 2 and 10, 4 and 5.' },
    hint: { ru: 'Иди парами: 1 и 20, 2 и 10, 4 и 5. На пятёрке пары сходятся.', uz: "Juftlab yuring: 1 va 20, 2 va 10, 4 va 5. Beshda juftliklar tutashadi.", en: 'Go in pairs: 1 and 20, 2 and 10, 4 and 5. At five the pairs meet.' },
    why: {
      ru: ['1 и 20 — эта пара есть у любого числа.', '20 : 2 = 10, значит 2 и 10 тоже делители.', '20 : 4 = 5, пара сошлась. Дальше искать нечего.'],
      uz: ["1 va 20 — bu juftlik har qanday sonda bor.", "20 : 2 = 10, demak 2 va 10 ham bo'luvchi.", "20 : 4 = 5, juftlik tutashdi. Boshqa qidirishga hech narsa yo'q."],
      en: ['1 and 20 — every number has this pair.', '20 : 2 = 10, so 2 and 10 are divisors too.', '20 : 4 = 5, the pair has met. There is nothing more to find.']
    },
    audio: {
      intro: { ru: 'Теперь двадцать, и уже без меня. Начни с пары, которая есть всегда.', uz: "Endi yigirma, va endi mensiz. Doim bor bo'lgan juftlikdan boshlang.", en: 'Now twenty, and this time without me. Start with the pair that is always there.' },
      on_correct: { ru: 'Верно. Шесть делителей, три пары.', uz: "To'g'ri. Oltita bo'luvchi, uchta juftlik.", en: 'Correct. Six divisors, three pairs.' },
      on_wrong: { ru: 'Проверь парами: у каждого числа должна быть пара.', uz: "Juftlab tekshiring: har bir sonning jufti bo'lishi kerak.", en: 'Check in pairs: every number must have a partner.' }
    }
  },

  // Ekran 12 — MASHQ 4. XATONI TOPISH. Birinchi topshiriq TUZOQ: xato yo'q.
  s_error: {
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikini tekshirgandek tekshiring.", en: "Check someone else's work the way you would check your own." },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    t1_lead: { ru: 'Азиз выписал делители числа 20:', uz: "Aziz 20 sonining bo'luvchilarini yozdi:", en: 'Aziz wrote the divisors of 20:' },
    t1_list: ['1', '2', '4', '5', '10', '20'],
    t1_q: { ru: 'Дилноза говорит, что одного не хватает. Кто прав?', uz: "Dilnoza bittasi yetishmayapti deydi. Kim haq?", en: 'Dilnoza says one is missing. Who is right?' },
    t1_opt_aziz: { ru: 'Прав Азиз: список полный', uz: "Aziz haq: ro'yxat to'liq", en: 'Aziz is right: the list is complete' },
    t1_opt_dilnoza: { ru: 'Права Дилноза: чего-то нет', uz: "Dilnoza haq: nimadir yo'q", en: 'Dilnoza is right: something is missing' },
    t1_correct: { ru: 'Верно, прав Азиз. Пары: 1 и 20, 2 и 10, 4 и 5. Все три на месте.', uz: "To'g'ri, Aziz haq. Juftliklar: 1 va 20, 2 va 10, 4 va 5. Uchalasi ham joyida.", en: 'Correct, Aziz is right. Pairs: 1 and 20, 2 and 10, 4 and 5. All three are there.' },
    t1_wrong: { ru: 'Список полный. Проверь парами: 1 и 20, 2 и 10, 4 и 5. Все три пары на месте.', uz: "Ro'yxat to'liq. Juftlab tekshiring: 1 va 20, 2 va 10, 4 va 5. Uchala juftlik ham joyida.", en: 'The list is complete. Check in pairs: 1 and 20, 2 and 10, 4 and 5. All three pairs are there.' },
    t1_wrong_audio: { ru: 'Список полный. Проверь парами. Один и двадцать, два и десять, четыре и пять. Все три пары на месте, пропуска нет.', uz: "Ro'yxat to'liq. Juftlab tekshiring. Bir va yigirma, ikki va o'n, to'rt va besh. Uchala juftlik ham joyida, tushib qolgani yo'q.", en: 'The list is complete. Check in pairs. One and twenty, two and ten, four and five. All three pairs are there, nothing is missing.' },
    t2_lead: { ru: 'А теперь делители числа 18:', uz: "Endi 18 sonining bo'luvchilari:", en: 'And now the divisors of 18:' },
    t2_list: ['1', '2', '3', '6', '18'],
    t2_q: { ru: 'Какое число пропущено?', uz: 'Qaysi son tushib qolgan?', en: 'Which number is missing?' },
    t2_opts: ['4', '9', '12', 'ничего'],
    t2_opts_uz: ['4', '9', '12', "hech narsa"],
    t2_opts_en: ['4', '9', '12', 'nothing'],
    t2_correct: { ru: 'Верно, пропущена 9. Пара двойки — девятка: 2 · 9 = 18.', uz: "To'g'ri, 9 tushib qolgan. Ikkining jufti to'qqiz: 2 · 9 = 18.", en: 'Correct, 9 is missing. The partner of two is nine: 2 · 9 = 18.' },
    t2_wrong_4: { ru: '18 : 4 = 4 и 2 в остатке. Четвёрка делителем не является.', uz: "18 : 4 = 4, qoldiq 2. To'rt bo'luvchi emas.", en: '18 : 4 = 4 with 2 left over. Four is not a divisor.' },
    t2_wrong_4_audio: { ru: 'Восемнадцать разделить на четыре четыре и два в остатке. Четвёрка делителем не является.', uz: "O'n sakkizni to'rtga bo'lsak to'rt va ikki qoldiq. To'rt bo'luvchi emas.", en: 'Eighteen divided by four is four with two left over. Four is not a divisor.' },
    t2_wrong_12: { ru: '18 на 12 нацело не делится. Ищи пару к двойке.', uz: "18 soni 12 ga butun bo'linmaydi. Ikkiga juft qidiring.", en: '18 does not divide by 12 exactly. Look for the partner of two.' },
    t2_wrong_12_audio: { ru: 'Восемнадцать на двенадцать нацело не делится. Ищи пару к двойке.', uz: "O'n sakkiz o'n ikkiga butun bo'linmaydi. Ikkiga juft qidiring.", en: 'Eighteen does not divide by twelve exactly. Look for the partner of two.' },
    t2_wrong_none: { ru: 'Пропуск есть. У двойки пара девятка: 2 · 9 = 18, а девятки в списке нет.', uz: "Tushib qolgani bor. Ikkining jufti to'qqiz: 2 · 9 = 18, to'qqiz esa ro'yxatda yo'q.", en: 'Something is missing. The partner of two is nine: 2 · 9 = 18, and nine is not on the list.' },
    t2_wrong_none_audio: { ru: 'Пропуск есть. У двойки пара девятка. Два умножить на девять восемнадцать, а девятки в списке нет.', uz: "Tushib qolgani bor. Ikkining jufti to'qqiz. Ikki karra to'qqiz o'n sakkiz, to'qqiz esa ro'yxatda yo'q.", en: 'Something is missing. The partner of two is nine. Two times nine is eighteen, and nine is not on the list.' },
    audio: {
      intro: { ru: 'На экзамене пригодится не только решать, но и проверять. Азиз выписал два списка. В одном ошибка есть, в другом нет. Не спеши искать её там, где её нет.', uz: "Imtihonda faqat yechish emas, tekshirish ham asqotadi. Aziz ikkita ro'yxat yozdi. Birida xato bor, ikkinchisida yo'q. Xato yo'q joyda uni qidirishga shoshilmang.", en: 'On the exam you need to check as well as solve. Aziz wrote two lists. One has a mistake, the other does not. Do not rush to find one where there is none.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' }
    }
  },

  // Ekran 13 — MASALA. Suratlar to'ri. Zamonaviy syujet (metodist 2026-08-13).
  // MUHIM: chetki to'rlar (1 tadan va 24 tadan) HISOBGA OLINADI —
  // aks holda javob 6 chiqadi va imtihondagi «24 ning bo'luvchilari nechta»
  // savoliga qarama-qarshi bo'lardi.
  s_grid: {
    title: { ru: 'Фотографии с турнира', uz: 'Turnir suratlari', en: 'Photos from the tournament' },
    lead: { ru: 'Фотографии выкладывают в школьную галерею одинаковыми рядами.', uz: 'Suratlar maktab galereyasiga bir xil qatorlar qilib joylanadi.', en: 'The photos go into the school gallery in equal rows.' },
    // Условие — УТВЕРЖДЕНИЕ, а не второй вопрос. Раньше на экране стояли два
    // вопроса подряд: «по скольку можно ставить в ряд?» и «сколько раскладок?».
    // Ребёнок отвечал на первый и выбирал 6, хотя спрашивали количество.
    q1: { ru: 'Фотографий 24. Каждый ряд должен быть полным.', uz: "Suratlar 24 ta. Har bir qator to'la bo'lishi kerak.", en: 'There are 24 photos. Every row has to be full.' },
    q2: { ru: 'А если фотографий 25?', uz: "Suratlar 25 ta bo'lsa-chi?", en: 'And if there are 25 photos?' },
    // «Joylashuv» / «раскладка» ребёнку непонятны (методист 2026-08-14): это
    // отглагольное существительное, и на экране ему ничего не соответствует.
    // Считаем то, что ВИДНО на стене — сетку снимков: «6 tadan · 4 qator» это
    // одна сетка, и вопрос спрашивает, сколько разных сеток бывает. Слово `to'r`
    // на этом экране уже стояло («kvadrat to'r»), теперь экран говорит одним
    // словом вместо двух.
    ask_count: { ru: 'Сколько разных сеток получится?', uz: "Necha xil to'r chiqadi?", en: 'How many different grids come out?' },
    // Варианты и разборы идут в ОДНОМ порядке: 4 / 6 / 8 / 24 и 1 / 3 / 5 / 25.
    opts_24: { ru: ['4', '6', '8', '24'], uz: ['4', '6', '8', '24'], en: ['4', '6', '8', '24'] },
    right_24: 2,
    opts_25: { ru: ['1', '3', '5', '25'], uz: ['1', '3', '5', '25'], en: ['1', '3', '5', '25'] },
    right_25: 1,
    wrong_all: { ru: '24 — это количество фотографий, а не сеток. Сеток столько, сколько делителей.', uz: "24 — bu suratlar soni, to'rlar soni emas. To'r nechta bo'luvchi bo'lsa, shuncha.", en: '24 is the number of photos, not of grids. There are as many grids as divisors.' },
    wrong_all_audio: { ru: 'Двадцать четыре это количество фотографий, а не сеток. Сеток столько, сколько у числа делителей.', uz: "Yigirma to'rt bu suratlar soni, to'rlar soni emas. To'r sonning bo'luvchilari qancha bo'lsa, shuncha.", en: 'Twenty four is the number of photos, not of grids. There are as many grids as the number has divisors.' },
    wrong_one: { ru: 'Квадратная сетка одна, но есть ещё по 1 в ряд и по 25 в ряд. Всего три.', uz: "Kvadrat to'r bitta, lekin 1 tadan va 25 tadan ham bor. Jami uchta.", en: 'There is one square grid, but there are also one per row and twenty five per row. Three in all.' },
    wrong_one_audio: { ru: 'Квадратная сетка действительно одна. Но есть ещё по одной в ряд и по двадцать пять в ряд. Всего получается три.', uz: "Kvadrat to'r haqiqatan bitta. Lekin bittadan qator va yigirma beshtadan qator ham bor. Jami uchta chiqadi.", en: 'There really is only one square grid. But there are also one per row and twenty five per row. Three in all.' },
    wrong_five: { ru: '5 — это сколько в ряду, а не сколько сеток. Делителей у 25 три: 1, 5, 25.', uz: "5 — bu qatordagi soni, to'rlar soni emas. 25 ning bo'luvchilari uchta: 1, 5, 25.", en: '5 is how many per row, not how many grids. 25 has three divisors: 1, 5, 25.' },
    wrong_five_audio: { ru: 'Пять это сколько фотографий в ряду, а не сколько сеток. Делителей у двадцати пяти три. Один, пять и двадцать пять.', uz: "Besh bu qatordagi suratlar soni, to'rlar soni emas. Yigirma beshning bo'luvchilari uchta. Bir, besh va yigirma besh.", en: 'Five is how many photos are in a row, not how many grids. Twenty five has three divisors. One, five and twenty five.' },
    wrong_all25: { ru: '25 — это количество фотографий. Сеток столько, сколько делителей, а их три.', uz: "25 — bu suratlar soni. To'r nechta bo'luvchi bo'lsa shuncha, ular esa uchta.", en: '25 is the number of photos. There are as many grids as divisors, and there are three.' },
    wrong_all25_audio: { ru: 'Двадцать пять это количество фотографий. Сеток столько, сколько делителей, а делителей три.', uz: "Yigirma besh bu suratlar soni. To'r bo'luvchilar qancha bo'lsa shuncha, bo'luvchilar esa uchta.", en: 'Twenty five is the number of photos. There are as many grids as divisors, and there are three divisors.' },
    // Подпись под сценой НАЗЫВАЕТ то, что на ней стоит. Без этого слова вопрос
    // «сколько разных сеток» висел в воздухе: на экране сетка была, а имени у
    // неё не было.
    grid_word: { ru: 'Сетка', uz: "To'r", en: 'Grid' },
    per_row: { ru: 'по {k} в ряд', uz: '{k} tadan', en: '{k} per row' },
    // Русский требует согласования: 1 ряд, 4 ряда, 5 рядов. Формы лежат
    // тройкой, подставляет их plRu. В узбекском и английском счётное слово
    // не меняется, поэтому там обычный шаблон.
    rows_word: { ru: '{r} {w}', uz: '{r} qator', en: '{r} rows' },
    rows_forms: { ru: ['ряд', 'ряда', 'рядов'] },
    out_1: { ru: 'Восемь сеток: по 1, 2, 3, 4, 6, 8, 12, 24', uz: "Sakkizta to'r: 1, 2, 3, 4, 6, 8, 12, 24 tadan", en: 'Eight grids: 1, 2, 3, 4, 6, 8, 12, 24 per row' },
    out_2: { ru: 'Три сетки: по 1, 5, 25. Квадратная одна — 5 на 5.', uz: "Uchta to'r: 1, 5, 25 tadan. Kvadrati bittasi — 5 ga 5.", en: 'Three grids: 1, 5, 25 per row. Only one is square — 5 by 5.' },
    done: { ru: 'Сколько делителей — столько и сеток.', uz: "Nechta bo'luvchi bo'lsa, shuncha to'r bo'ladi.", en: 'As many divisors as there are, that many grids.' },
    square: { ru: 'Квадратная сетка получается, только когда число делится само на себя поровну: 5 · 5 = 25.', uz: "Kvadrat to'r faqat son o'ziga o'zi teng bo'linganda chiqadi: 5 · 5 = 25.", en: 'A square grid appears only when the number splits into two equal parts: 5 · 5 = 25.' },
    wrong_6: { ru: 'Забыты крайние. По одной в ряд и по двадцать четыре в ряд — тоже полные ряды. Единица и само число делители всегда.', uz: "Chetkilari esdan chiqdi. Bittadan qator ham, yigirma to'rttadan qator ham to'la qator. Bir va sonning o'zi doim bo'luvchi.", en: 'The edge grids were forgotten. One per row and twenty four per row are full rows too. One and the number itself are always divisors.' },
    wrong_6_audio: { ru: 'Забыты крайние сетки. По одной в ряд это длинный столбец, по двадцать четыре в ряд это одна длинная лента. Ряды в обоих случаях полные, а единица и само число делители всегда.', uz: "Chetki to'rlar esdan chiqdi. Bittadan qator uzun ustun, yigirma to'rttadan qator bitta uzun lenta. Ikkalasida ham qatorlar to'la, bir va sonning o'zi esa doim bo'luvchi.", en: 'The edge grids were forgotten. One per row is a long column, twenty four per row is one long strip. In both cases the rows are full, and one and the number itself are always divisors.' },
    wrong_pair: { ru: 'По 3 в ряд и по 8 в ряд выглядят по-разному. Пара одна, а сетки две.', uz: "3 tadan va 8 tadan qator har xil ko'rinadi. Juftlik bitta, to'r esa ikkita.", en: 'Three per row and eight per row look different. One pair, but two grids.' },
    wrong_pair_audio: { ru: 'По три в ряд и по восемь в ряд выглядят по-разному. Пара одна, а сетки получаются две.', uz: "Uchtadan qator va sakkiztadan qator har xil ko'rinadi. Juftlik bitta, to'r esa ikkita chiqadi.", en: 'Three per row and eight per row look different. One pair, but there are two grids.' },
    audio: {
      intro: { ru: 'Задача из жизни. Фотографии с турнира выкладывают в школьную галерею одинаковыми рядами. Фотографий двадцать четыре, и ни один ряд не должен остаться неполным. Сколько разных сеток может получиться?', uz: "Hayotiy masala. Turnir suratlari maktab galereyasiga bir xil qatorlar qilib joylanadi. Suratlar yigirma to'rtta va birorta qator to'la bo'lmay qolmasligi kerak. Necha xil to'r chiqishi mumkin?", en: 'A problem from life. Photos from the tournament go into the school gallery in equal rows. There are twenty four photos and no row may be left unfinished. How many different grids can come out?' },
      a1: { ru: 'Это тот же второй способ, только в другой одежде. Каждый делитель двадцати четырёх даёт свою сетку. По одной в ряд получится длинный столбец. По двадцать четыре в ряд одна длинная лента. И то и другое ряды полные. Всего восемь сеток, потому что делителей у двадцати четырёх восемь.', uz: "Bu o'sha ikkinchi usul, faqat boshqa libosda. Yigirma to'rtning har bir bo'luvchisi o'z to'rini beradi. Bittadan qo'ysak uzun ustun chiqadi. Yigirma to'rttadan qo'ysak bitta uzun lenta. Ikkalasida ham qatorlar to'la. Jami sakkizta to'r, chunki yigirma to'rtning bo'luvchilari sakkizta.", en: 'This is the second method again, just in different clothes. Every divisor of twenty four gives a grid of its own. One per row gives a long column. Twenty four per row gives one long strip. In both cases the rows are full. Eight grids in all, because twenty four has eight divisors.' },
      a2: { ru: 'А теперь двадцать пять фотографий. Здесь сеток всего три, и только одна из них квадратная. Пять на пять. Так бывает, когда пара сходится сама с собой.', uz: "Endi yigirma beshta surat. Bu yerda to'r atigi uchta va ulardan faqat bittasi kvadrat. Besh ga besh. Juftlik o'zi bilan o'zi uchrashganda shunday bo'ladi.", en: 'Now twenty five photos. Here there are only three grids, and only one of them is square. Five by five. That happens when a pair meets itself.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' }
    }
  },

  // Ekran 14 — YAKUNIY TEST. Bitta ekranda beshta topshiriq (3-sinf naqshi).
  s_final: {
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 9,
        q: { ru: 'Сколько делителей у числа 36? Набери ответ.', uz: "36 sonining nechta bo'luvchisi bor? Javobni tering.", en: 'How many divisors does 36 have? Type the answer.' },
        hint: { ru: 'Иди парами: 1 и 36, 2 и 18, 3 и 12, 4 и 9. Шестёрка идёт в паре сама с собой.', uz: "Juftlab yuring: 1 va 36, 2 va 18, 3 va 12, 4 va 9. Olti o'zi bilan o'zi juft bo'ladi.", en: 'Go in pairs: 1 and 36, 2 and 18, 3 and 12, 4 and 9. Six pairs with itself.' },
        hint_audio: { ru: 'Иди парами. Один и тридцать шесть, два и восемнадцать, три и двенадцать, четыре и девять. Шестёрка идёт в паре сама с собой.', uz: "Juftlab yuring. Bir va o'ttiz olti, ikki va o'n sakkiz, uch va o'n ikki, to'rt va to'qqiz. Olti o'zi bilan o'zi juft bo'ladi.", en: 'Go in pairs. One and thirty six, two and eighteen, three and twelve, four and nine. Six pairs with itself.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какое число кратно 7?', uz: 'Qaysi son 7 ga karrali?', en: 'Which number is a multiple of 7?' },
        opts: ['34', '42', '51', '60'],
        wrong: [
          { ru: '34 : 7 = 4 и 6 в остатке.', uz: '34 : 7 = 4, qoldiq 6.', en: '34 : 7 = 4 with 6 left over.' },
          null,
          { ru: '51 : 7 = 7 и 2 в остатке.', uz: '51 : 7 = 7, qoldiq 2.', en: '51 : 7 = 7 with 2 left over.' },
          { ru: '60 : 7 = 8 и 4 в остатке.', uz: '60 : 7 = 8, qoldiq 4.', en: '60 : 7 = 8 with 4 left over.' }
        ],
        wrong_audio: [
          { ru: 'Тридцать четыре разделить на семь четыре и шесть в остатке.', uz: "O'ttiz to'rtni yettiga bo'lsak to'rt va olti qoldiq.", en: 'Thirty four divided by seven is four with six left over.' },
          null,
          { ru: 'Пятьдесят один разделить на семь семь и два в остатке.', uz: 'Ellik birni yettiga bo\'lsak yetti va ikki qoldiq.', en: 'Fifty one divided by seven is seven with two left over.' },
          { ru: 'Шестьдесят разделить на семь восемь и четыре в остатке.', uz: "Oltmishni yettiga bo'lsak sakkiz va to'rt qoldiq.", en: 'Sixty divided by seven is eight with four left over.' }
        ],
        correct: { ru: 'Верно. 42 = 7 · 6, остаток ноль.', uz: "To'g'ri. 42 = 7 · 6, qoldiq nol.", en: 'Correct. 42 = 7 · 6, remainder zero.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Нужно узнать, делится ли 91 на 7. Что быстрее?', uz: "91 soni 7 ga bo'linadimi, bilish kerak. Qaysi biri tezroq?", en: 'You need to know whether 91 divides by 7. What is faster?' },
        opts_i18n: [
          { ru: 'Выписать все делители 91 и посмотреть', uz: "91 ning barcha bo'luvchilarini yozib chiqish", en: 'Write out all divisors of 91 and look' },
          { ru: 'Разделить 91 на 7 и посмотреть остаток', uz: "91 ni 7 ga bo'lib, qoldiqqa qarash", en: 'Divide 91 by 7 and look at the remainder' },
          { ru: 'Перечислять кратные 7, пока не дойдём до 91', uz: "91 ga yetguncha 7 ning karralilarini sanash", en: 'List multiples of 7 until we reach 91' }
        ],
        wrong: [
          { ru: 'Это работа на пять минут ради одного вопроса. Все делители нужны, когда спрашивают про все.', uz: "Bu bitta savol uchun besh daqiqalik ish. Barcha bo'luvchilar barchasi so'ralganda kerak bo'ladi.", en: 'That is five minutes of work for one question. You need all divisors when all of them are asked for.' },
          null,
          { ru: 'Это тринадцать шагов вместо одного деления.', uz: "Bu bitta bo'lish o'rniga o'n uchta qadam.", en: 'That is thirteen steps instead of one division.' }
        ],
        wrong_audio: [
          { ru: 'Это работа на пять минут ради одного вопроса. Все делители ищут тогда, когда про все и спрашивают.', uz: "Bu bitta savol uchun besh daqiqalik ish. Barcha bo'luvchilar barchasi so'ralganda qidiriladi.", en: 'That is five minutes of work for one question. You look for all divisors when all of them are asked for.' },
          null,
          { ru: 'Это тринадцать шагов вместо одного деления. Способ рабочий, но самый длинный.', uz: "Bu bitta bo'lish o'rniga o'n uchta qadam. Usul ishlaydi, lekin eng uzuni.", en: 'That is thirteen steps instead of one division. The method works, but it is the longest.' }
        ],
        correct: { ru: 'Верно. 91 : 7 = 13, остаток ноль. Один шаг вместо тринадцати.', uz: "To'g'ri. 91 : 7 = 13, qoldiq nol. O'n uchta qadam o'rniga bitta.", en: 'Correct. 91 : 7 = 13, remainder zero. One step instead of thirteen.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'У какого числа делителей нечётное количество?', uz: "Qaysi sonning bo'luvchilari toq sonda?", en: 'Which number has an odd count of divisors?' },
        opts: ['12', '16', '18', '20'],
        wrong: [
          { ru: 'У 12 все пары разные: 1 и 12, 2 и 6, 3 и 4. Делителей шесть.', uz: "12 da barcha juftliklar har xil: 1 va 12, 2 va 6, 3 va 4. Bo'luvchilar oltita.", en: 'For 12 all pairs differ: 1 and 12, 2 and 6, 3 and 4. Six divisors.' },
          null,
          { ru: 'У 18 пары 1 и 18, 2 и 9, 3 и 6 — все разные. Делителей шесть.', uz: "18 da juftliklar 1 va 18, 2 va 9, 3 va 6 — barchasi har xil. Bo'luvchilar oltita.", en: 'For 18 the pairs 1 and 18, 2 and 9, 3 and 6 all differ. Six divisors.' },
          { ru: 'У 20 пары 1 и 20, 2 и 10, 4 и 5 — все разные. Делителей шесть.', uz: "20 da juftliklar 1 va 20, 2 va 10, 4 va 5 — barchasi har xil. Bo'luvchilar oltita.", en: 'For 20 the pairs 1 and 20, 2 and 10, 4 and 5 all differ. Six divisors.' }
        ],
        wrong_audio: [
          { ru: 'У двенадцати все пары разные. Один и двенадцать, два и шесть, три и четыре. Значит делителей чётное количество.', uz: "O'n ikkida barcha juftliklar har xil. Bir va o'n ikki, ikki va olti, uch va to'rt. Demak bo'luvchilar juft sonda.", en: 'For twelve all pairs differ. One and twelve, two and six, three and four. So the divisor count is even.' },
          null,
          { ru: 'У восемнадцати пары один и восемнадцать, два и девять, три и шесть. Все разные, значит делителей чётное количество.', uz: "O'n sakkizda juftliklar bir va o'n sakkiz, ikki va to'qqiz, uch va olti. Barchasi har xil, demak bo'luvchilar juft sonda.", en: 'For eighteen the pairs are one and eighteen, two and nine, three and six. All differ, so the divisor count is even.' },
          { ru: 'У двадцати пары один и двадцать, два и десять, четыре и пять. Все разные, значит делителей чётное количество.', uz: "Yigirmada juftliklar bir va yigirma, ikki va o'n, to'rt va besh. Barchasi har xil, demak bo'luvchilar juft sonda.", en: 'For twenty the pairs are one and twenty, two and ten, four and five. All differ, so the divisor count is even.' }
        ],
        correct: { ru: 'Верно. 16 = 4 · 4, пара сходится сама с собой: 1, 2, 4, 8, 16 — пять делителей.', uz: "To'g'ri. 16 = 4 · 4, juftlik o'zi bilan o'zi tutashadi: 1, 2, 4, 8, 16 — beshta bo'luvchi.", en: 'Correct. 16 = 4 · 4, the pair meets itself: 1, 2, 4, 8, 16 — five divisors.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Игры на турнире идут каждые 6 минут, первая в 8:00. Начнётся ли игра ровно в 8:45?', uz: "Turnirdagi o'yinlar har 6 daqiqada boshlanadi, birinchisi 8:00 da. Roppa rosa 8:45 da o'yin boshlanadimi?", en: 'Tournament games run every 6 minutes, the first at 8:00. Will a game start exactly at 8:45?' },
        opts_i18n: [
          { ru: 'Да, придёт', uz: 'Ha, keladi', en: 'Yes, it will' },
          { ru: 'Нет, не придёт', uz: "Yo'q, kelmaydi", en: 'No, it will not' }
        ],
        wrong: [
          { ru: '45 на 6 нацело не делится. Кратные шести это 42 и 48, а 45 между ними.', uz: "45 soni 6 ga butun bo'linmaydi. Oltiga karralilar 42 va 48, 45 esa ular orasida.", en: '45 does not divide by 6 exactly. The multiples of six are 42 and 48, and 45 is between them.' },
          null
        ],

        wrong_audio: [
          { ru: 'Сорок пять на шесть нацело не делится. Кратные шести это сорок два и сорок восемь, а сорок пять стоит между ними.', uz: "Qirq besh oltiga butun bo'linmaydi. Oltiga karralilar qirq ikki va qirq sakkiz, qirq besh esa ular orasida.", en: 'Forty five does not divide by six exactly. The multiples of six are forty two and forty eight, and forty five is between them.' },
          null
        ],
        correct: { ru: 'Верно. 45 : 6 = 7, остаток 3. Ближайшие игры в 8:42 и 8:48.', uz: "To'g'ri. 45 : 6 = 7, qoldiq 3. Eng yaqin o'yinlar 8:42 va 8:48 da.", en: 'Correct. 45 : 6 = 7, remainder 3. The nearest games are at 8:42 and 8:48.' }
      }
    ],
    audio: {
      intro: { ru: 'Финальная проверка. Пять заданий на весь урок. Оценки не будет, но каждое задание разберём.', uz: "Yakuniy tekshiruv. Butun darsga beshta topshiriq. Baho qo'yilmaydi, lekin har bir topshiriqni tahlil qilamiz.", en: 'The final check. Five tasks covering the whole lesson. There is no mark, but we will go through each one.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' }
    }
  },
};

// Кисть-СТИКЕР (методист 2026-08-13, образец — 1 класс, урок 1).
// Было: две серые фигуры, кружок и прямоугольник. На экране это читалось как
// клякса, а не как рука. Стало: контурная кисть с белой заливкой и тенью —
// узнаётся мгновенно и выглядит наклейкой поверх сцены.
const HandSticker = () => (
  <svg className="hs" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#494550"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 9.5V4a2 2 0 0 0-4 0v10"/>
    <path d="M14 10V9a2 2 0 0 0-4 0v1"/>
    <path d="M18 11v-1a2 2 0 0 0-4 0v1"/>
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);

// HandHint удалён вместе со стикером на хуке (методист 2026-08-14). Сам
// HandSticker остался: его использует экран 4, где кисть стоит на точке нажатия.

// СЦЕНА ХУКА — школьный спортзал (методист 2026-08-14, образец 1-4 класс).
// Было: двадцать четыре одинаковые фигурки на пустом белом поле. История про
// турнир была только в тексте, глазом она не читалась.
// Стало: зал — окна, баннер турнира, табло со счётом участников, скамейка
// запасных и разметка пола. Участники стоят НА полу, а не висят в пустоте.
// Скамейка нарисована заранее: именно на неё сядут те, кому не хватит команды,
// и ребёнок видит её ещё до своего прогноза.
// СЦЕНА ХУКА — ВЗГЛЯД ОТ ТРЕНЕРА (вариант Б, методист 2026-08-14).
// Ребята стоят полукругом лицом к нам, зал за ними. Тренер как раз и делит
// их на команды, поэтому камера стоит на его месте.
//
// РАЗМЕРЫ НАСТОЯЩИЕ. Масштаб: линия пола на y = 110, и это 3,6 метра стены,
// значит один метр = 30,6 единицы. Отсюда всё остальное:
//   школьник 1,45 м = 44        кольцо 3,05 м над полом = 93 вверх
//   щит 1,05 м высотой = 32     шведская стенка 2,6 м = 80
//   окно 1,8 м, низ на 1,1 м    скамейка 0,45 м = 14      мяч 24 см = 7
// Раньше кольцо висело на уровне груди, а щит был вдвое меньше нормы — именно
// это читалось как «далеко от реальности».
//
// Ширина сцены теперь ОБЩАЯ с остальными блоками: в хуках 1-2 класса
// заголовок, рамка и кнопки одной ширины, а картинка заливает рамку целиком.
// Прежние 520 пикселей по центру я взял из `.g1-street` — это врезка внутри
// урока, а не сцена хука.
const GYM_KIDS = 9;

const GYM_FLOOR = 110;          // линия пола в единицах viewBox

const GYM_M = 30.6;             // один метр

// Полукруг: середина дуги ДАЛЬШЕ от нас, края ближе и ниже. Тот, кто ближе,
// нарисован крупнее — это и даёт глубину.
const gymSpots = () => {
  const out = [];
  for (let i = 0; i < GYM_KIDS; i += 1) {
    // Шаг по горизонтали РАВНЫЙ: по косинусу крайние сбивались в кучу.
    const x = 44 + (i * 312) / (GYM_KIDS - 1);
    const d = 1 - ((x - 200) / 156) ** 2;   // 1 в середине дуги, 0 по краям
    out.push({ x, y: GYM_FLOOR + 34 - 21 * d, k: 0.88 + 0.26 * (1 - d) });
  }
  // Ближние рисуются последними, иначе дальние перекрыли бы их.
  return out.sort((a, b) => a.y - b.y);
};

const GymKid = ({ x, y, k, i }) => {
  const h = 1.45 * GYM_M * k;                  // рост
  const head = h * 0.17;
  const body = h - head * 1.15;
  const w = body * 0.62;
  const shirt = ['#7ECBE6', '#F5C77E', '#8FD6B4'][i % 3];
  const dark = ['#019ACB', '#D89F3C', '#4FB68B'][i % 3];
  return (
    <g className="hk-kid" style={{ animationDelay: `${i * 90}ms` }}>
      <ellipse cx={x} cy={y + 1.5} rx={w * 0.62} ry={w * 0.19} fill="rgba(90,62,34,0.20)"/>
      {/* ноги */}
      <rect x={x - w * 0.26} y={y - body * 0.34} width={w * 0.2} height={body * 0.34} rx={w * 0.09} fill="#5C6B78"/>
      <rect x={x + w * 0.06} y={y - body * 0.34} width={w * 0.2} height={body * 0.34} rx={w * 0.09} fill="#5C6B78"/>
      {/* корпус: футболка с тенью сбоку */}
      <path d={`M${x - w / 2} ${y - body} q${w / 2} ${-w * 0.18} ${w} 0 v${body * 0.66} q${-w / 2} ${w * 0.12} ${-w} 0 Z`} fill={shirt}/>
      <path d={`M${x + w * 0.16} ${y - body} q${w * 0.34} ${-w * 0.1} ${w * 0.34} 0 v${body * 0.66} q${-w * 0.17} ${w * 0.05} ${-w * 0.34} 0 Z`} fill={dark} opacity="0.24"/>
      {/* руки */}
      <rect x={x - w * 0.62} y={y - body * 0.94} width={w * 0.16} height={body * 0.5} rx={w * 0.08} fill={shirt}/>
      <rect x={x + w * 0.46} y={y - body * 0.94} width={w * 0.16} height={body * 0.5} rx={w * 0.08} fill={shirt}/>
      {/* голова: ребята смотрят на тренера, поэтому лицо видно */}
      <circle cx={x} cy={y - body - head * 0.52} r={head} fill="#F1C9A5"/>
      <path d={`M${x - head} ${y - body - head * 0.72} a${head} ${head} 0 0 1 ${head * 2} 0 z`} fill="#4A3A2E"/>
      <circle cx={x - head * 0.36} cy={y - body - head * 0.5} r={head * 0.13} fill="#3C3128"/>
      <circle cx={x + head * 0.36} cy={y - body - head * 0.5} r={head * 0.13} fill="#3C3128"/>
      <path d={`M${x - head * 0.3} ${y - body - head * 0.16} q${head * 0.3} ${head * 0.24} ${head * 0.6} 0`}
        stroke="#B9805C" strokeWidth={head * 0.11} fill="none" strokeLinecap="round"/>
    </g>
  );
};

const GymBg = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="hkSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BFDDEF"/><stop offset="100%" stopColor="#E8F3FA"/>
      </linearGradient>
      <linearGradient id="hkWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F8F3EA"/><stop offset="100%" stopColor="#E7DFD0"/>
      </linearGradient>
      <linearGradient id="hkCloth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF7350"/><stop offset="100%" stopColor="#D8391A"/>
      </linearGradient>
      <linearGradient id="hkFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E7D0AE"/><stop offset="100%" stopColor="#FBF0DE"/>
      </linearGradient>
      <linearGradient id="hkBall" x1="0.3" y1="0.2" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#FFAE63"/><stop offset="100%" stopColor="#DF7A24"/>
      </linearGradient>
      <radialGradient id="hkBeam" cx="0.5" cy="0" r="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect x="0" y="0" width="400" height="154" fill="url(#hkWall)"/>

    {/* окна: низ на 1,1 м, высота 1,8 м */}
    {[96, 232].map((x) => (
      <g key={x}>
        <rect x={x - 4} y="16" width="70" height="63" rx="3" fill="#DED3BE"/>
        <rect x={x} y="20" width="62" height="55" fill="url(#hkSky)"/>
        <rect x={x + 30} y="20" width="2" height="55" fill="#C6B9A2"/>
        <rect x={x} y="46" width="62" height="2" fill="#C6B9A2"/>
        <rect x={x - 7} y="75" width="76" height="5" rx="2" fill="#D5C9B1"/>
        <path d={`M${x} 20 L${x + 62} 20 L${x + 40} 75 L${x + 14} 75 Z`} fill="#FFFFFF" opacity="0.22"/>
      </g>
    ))}

    {/* шведская стенка 2,6 м */}
    <g>
      <rect x="14" y="30" width="6" height="80" rx="2" fill="#D9A971"/>
      <rect x="70" y="30" width="6" height="80" rx="2" fill="#D9A971"/>
      <rect x="14" y="30" width="6" height="80" rx="2" fill="#FFFFFF" opacity="0.22"/>
      {[36, 48, 60, 72, 84, 96].map((y) => (
        <g key={y}>
          <rect x="14" y={y} width="62" height="5" rx="2.5" fill="#E8BE8B"/>
          <rect x="14" y={y} width="62" height="1.8" rx="0.9" fill="#F6DAB4"/>
        </g>
      ))}
    </g>

    {/* кольцо: ринг на 3,05 м, щит уходит за верхний край — как в жизни */}
    <g>
      <rect x="318" y="-16" width="60" height="36" rx="2" fill="#FDFBF7" stroke="#C9BFAE" strokeWidth="2"/>
      <rect x="335" y="-2" width="26" height="17" fill="none" stroke="#FF4F28" strokeWidth="2"/>
      <ellipse cx="348" cy="20" rx="13" ry="3.4" fill="none" stroke="#FF4F28" strokeWidth="2.6"/>
      <path d="M337 22 L341 34 M348 23 L348 36 M359 22 L355 34 M341 29 L355 29" stroke="#D8CFC0" strokeWidth="1.4" fill="none"/>
    </g>

    {/* баннер турнира над головами */}
    <g className="hk-banner">
      <rect x="199" y="0" width="2" height="10" fill="#C9BFAE"/>
      <path d="M154 10 H246 V34 l-11.5 6 -11.5 -6 -11.5 6 -11.5 -6 -11.5 6 -11.5 -6 -11.5 6 -11.5 -6 Z" fill="url(#hkCloth)"/>
      <path d="M154 10 H246 V17 H154 Z" fill="#FFFFFF" opacity="0.16"/>
      <rect x="166" y="17" width="68" height="5" rx="2.5" fill="#FFE8E1"/>
      <rect x="178" y="26" width="44" height="5" rx="2.5" fill="#FFB59F"/>
    </g>

    {/* табло под кольцом: раньше оно налезало на баннер */}
    <g>
      <rect x="312" y="46" width="72" height="32" rx="4" fill="#494550"/>
      <rect x="312" y="46" width="72" height="9" rx="4" fill="#FFFFFF" opacity="0.10"/>
      <rect x="318" y="51" width="60" height="17" rx="3" fill="#101014"/>
      <text x="348" y="64" textAnchor="middle" fill="#7ECBE6"
        fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">24</text>
      <rect x="318" y="70" width="60" height="4" rx="2" fill="#6E6A75"/>
    </g>

    {/* скамейка 0,45 м */}
    <g>
      <rect x="12" y="96" width="72" height="7" rx="3" fill="#E6BC93"/>
      <rect x="12" y="96" width="72" height="2.4" rx="1.2" fill="#F6DAB4"/>
      <rect x="12" y="104" width="72" height="4" rx="2" fill="#CE9E74"/>
      <rect x="19" y="108" width="6" height="8" rx="2" fill="#B8875D"/>
      <rect x="71" y="108" width="6" height="8" rx="2" fill="#B8875D"/>
      <ellipse cx="48" cy="118" rx="40" ry="3.4" fill="rgba(90,62,34,0.14)"/>
    </g>

    {/* плинтус, пол, свет из окон, разметка */}
    <rect x="0" y={GYM_FLOOR - 4} width="400" height="4" fill="#DCD1BD"/>
    <rect x="0" y={GYM_FLOOR} width="400" height={154 - GYM_FLOOR} fill="url(#hkFloor)"/>
    {Array.from({ length: 13 }).map((_, i) => (
      <path key={i} d={`M${i * 32 + 8} ${GYM_FLOOR} L${(i * 32 + 8 - 200) * 1.5 + 200} 154`}
        stroke="#E4CBA9" strokeWidth="1" opacity="0.55" fill="none"/>
    ))}
    <path d={`M128 ${GYM_FLOOR} L104 154 L176 154 L190 ${GYM_FLOOR} Z`} fill="url(#hkBeam)"/>
    <path d={`M236 ${GYM_FLOOR} L232 154 L304 154 L298 ${GYM_FLOOR} Z`} fill="url(#hkBeam)"/>
    <path d={`M0 ${GYM_FLOOR + 16} H400`} stroke="#E4CBA9" strokeWidth="1.6" fill="none" opacity="0.8"/>

    {/* мяч 24 см, один прокат при входе */}
    <g className="hk-ball">
      <ellipse cx="150" cy="150" rx="9" ry="2.6" fill="rgba(90,62,34,0.18)"/>
      <circle cx="150" cy="143" r="8" fill="url(#hkBall)"/>
      <path d="M142 143h16M150 135v16M145 137.5c2.6 3.4 2.6 7.6 0 11M155 137.5c-2.6 3.4-2.6 7.6 0 11"
        stroke="#A85A17" strokeWidth="1" fill="none"/>
    </g>

    {/* ребята полукругом, лицом к тренеру */}
    {gymSpots().map((sp, i) => <GymKid key={i} {...sp} i={i}/>)}
  </svg>
);

// СЦЕНА ФИНАЛА (методист 2026-08-14). Урок закрывается тем же залом, где
// начался. Хук спрашивал «по пять или по шесть» — вот ответ на площадке:
// четыре команды по шесть, и скамейка ПУСТАЯ, никто не остался без места.
// Полоса нарочно низкая (400x92): под ней на итоге ещё три карточки, и на
// 1366x768 весь экран должен уместиться без скролла.
const FIN_TEAMS = 4;

const FIN_IN_TEAM = 6;

const FIN_SHIRTS = [
  { body: '#7ECBE6', edge: '#019ACB' },
  { body: '#F5C77E', edge: '#D89F3C' },
  { body: '#8FD6B4', edge: '#4FB68B' },
  { body: '#F2A79E', edge: '#D06F5E' },
];

// Дети одного возраста, но не одного роста. Разброс фиксированный, не
// случайный: скриншот проверки должен быть повторяемым.
const FIN_DH = [0, -1.4, 0.9, -0.7, 1.3, -1.1];

const FIN_HAIR = ['#4A3A2E', '#3E3128', '#5A4636', '#4A3A2E', '#3E3128', '#54402F'];

const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <defs>
      <linearGradient id="finWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EDE6D9"/>
      </linearGradient>
      <linearGradient id="finFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAD6B8"/><stop offset="100%" stopColor="#FBF1E0"/>
      </linearGradient>
      <linearGradient id="finCloth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF7350"/><stop offset="100%" stopColor="#D8391A"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="400" height="92" fill="url(#finWall)"/>

    {/* окна зала по сторонам от баннера */}
    {[32, 314].map((x) => (
      <g key={x}>
        <rect x={x - 3} y="7" width="56" height="30" rx="3" fill="#DFD4BF"/>
        <rect x={x} y="10" width="50" height="24" fill="#DCEDF5"/>
        <rect x={x + 24} y="10" width="2" height="24" fill="#C6B9A2"/>
      </g>
    ))}

    {/* баннер: ответ на вопрос хука */}
    <g>
      <rect x="199" y="0" width="2" height="5" fill="#C9BFAE"/>
      <path d="M152 5 H248 V24 l-12 5 -12 -5 -12 5 -12 -5 -12 5 -12 -5 -12 5 -12 -5 Z" fill="url(#finCloth)"/>
      <text x="200" y="19" textAnchor="middle" fill="#FFECE6"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">4 &#215; 6 = 24</text>
    </g>

    {/* пол */}
    <rect x="0" y="58" width="400" height="3" fill="#DBD0BB"/>
    <rect x="0" y="61" width="400" height="31" fill="url(#finFloor)"/>

    {/* ПУСТАЯ скамейка: в хуке на ней сидели четверо лишних */}
    <g>
      <rect x="6" y="70" width="48" height="4" rx="2" fill="#E6BC93"/>
      <rect x="6" y="75" width="48" height="2.4" rx="1.2" fill="#CE9E74"/>
      <rect x="11" y="77" width="3.4" height="6" rx="1.4" fill="#B8875D"/>
      <rect x="45" y="77" width="3.4" height="6" rx="1.4" fill="#B8875D"/>
    </g>

    {/* четыре команды по шесть */}
    {Array.from({ length: FIN_TEAMS }).map((_, ti) => {
      const x0 = 72 + ti * 82;
      const sh = FIN_SHIRTS[ti];
      return (
        <g key={ti} className="fin-team" style={{ animationDelay: `${260 + ti * 150}ms` }}>
          <rect x={x0 - 5} y="64" width="78" height="25" rx="7" fill={sh.body} opacity="0.15"/>
          <text x={x0 + 34} y="59" textAnchor="middle" fill={sh.edge}
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">6</text>
          {Array.from({ length: FIN_IN_TEAM }).map((_, k) => {
            const cx = x0 + 6 + k * 12;
            const dh = FIN_DH[(k + ti) % FIN_DH.length];   // ростом чуть разные
            const ty = 74 + dh;                            // плечи
            const hy = 69.5 + dh;                          // голова
            return (
              <g key={k}>
                <ellipse cx={cx} cy="86.5" rx="5" ry="1.5" fill="rgba(90,62,34,0.16)"/>
                <path d={`M${cx - 4.2} ${ty} q4.2 -1.8 8.4 0 v${86 - ty} q-4.2 1.2 -8.4 0 Z`} fill={sh.body}/>
                <rect x={cx - 4.2} y={ty + 5} width="8.4" height="1.5" fill={sh.edge} opacity="0.3"/>
                <circle cx={cx} cy={hy} r="3.6" fill="#F1C9A5"/>
                <path d={`M${cx - 3.6} ${hy - 0.9} a3.6 3.6 0 0 1 7.2 0 z`} fill={FIN_HAIR[(k + ti * 2) % FIN_HAIR.length]}/>
              </g>
            );
          })}
        </g>
      );
    })}
  </svg>
);

// ============================================================
// ЭКРАН 07 — «сначала показали, потом сам» (методист 2026-08-13).
// Было: свободное поле ввода — ребёнок набирал любое число. Именно это
// методисту не понравилось: экран превращался в калькулятор без цели.
// Стало: приём 3 класса, урок 1 (TapBinDemo). Один экран, два состояния.
//   phase === 'demo'  показ: 24 плитки сами сыплются и ложатся в 4 ряда по 6,
//                    остатка нет, вывод «делится ровно». Ребёнок не нажимает
//                    ничего. Дальше кнопки «Ещё раз» и «Теперь я сам».
//   phase === 'play'  очередь ребёнка: число 25 задано, он выбирает делитель
//                    и жмёт «Проверить». На шести лишняя плитка уезжает в
//                    зону остатка — тот же ход, что он только что видел.
// Верного ответа тут нет — есть факт делимости, поэтому оценки на экране нет.
// ============================================================
const TL_H = 156;

const TL_BASE = 44;

const TL_FALL = 440;

const TL_MOVE = 620;

const TL_STAG = 30;

const TL_SIZES = [44, 38, 32, 28, 24, 20, 17, 14, 12, 10];

const TL_DEMO_N = 24;

const TL_DEMO_D = 6;

const TL_PLAY_N = 25;

const TL_DIVS = [2, 3, 4, 5, 6, 7, 8, 9];

const tlHeap = (i, n, W) => {
  // Куча выглядит случайной, но считается по номеру плитки: Math.random дёргал
  // бы её при каждом рендере.
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.678;
  const rx = (a - Math.floor(a)) - 0.5;
  const ry = (b - Math.floor(b)) - 0.5;
  const spread = Math.min(Math.max(W - 80, 80), 60 + n * 9);
  return [W / 2 - 22 + rx * spread, TL_H / 2 - 30 + ry * 46];
};

// Прямоугольник кладётся ДЛИННОЙ СТОРОНОЙ ВБОК (методист 2026-08-13).
// Было: в строке ровно `d` плиток, и при делителе 2 получался столбец шириной
// в две плитки и высотой в двенадцать — сцена пустая по бокам, а плитки не
// видно. Стало: длинная сторона всегда горизонтальна.
// На математику это не влияет: прямоугольник два на двенадцать и двенадцать
// на два — один и тот же факт, а подпись под сценой называет числа явно.
const tlFit = (n, d, W) => {
  const q = Math.floor(n / d);
  const rem = n - q * d;
  const cols = Math.max(d, q);
  const rows = Math.min(d, q);
  const availH = TL_H - 8 - (rem ? 52 : 0);
  const availW = Math.max(W - 16, 80);
  let s = 10;
  let g = 3;
  for (let i = 0; i < TL_SIZES.length; i += 1) {
    s = TL_SIZES[i];
    g = Math.max(2, Math.round(s * 0.16));
    if (rows * (s + g) - g <= availH && cols * (s + g) - g <= availW) break;
  }
  return { rows, cols, rem, s, g, placed: rows * cols };
};

const ToolScreen = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);

  const frameRef = useRef(null);
  const sceneRef = useRef(null);
  const divRowRef = useRef(null);
  const goRef = useRef(null);
  const timersRef = useRef([]);
  const demoRunRef = useRef(-1);
  const handCountRef = useRef(0);

  const [W, setW] = useState(0);
  // Куда указывает кисть, считается из offsetLeft/offsetTop живых кнопок, а не
  // из зашитых координат: на телефоне ряд делителей переносится на две строки.
  const [spots, setSpots] = useState({ divX: 0, divY: 0, goX: 0, goY: 0, ready: false });
  const [phase, setPhase] = useState('demo');
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState(null);        // { n, d } — что сейчас на сцене
  const [tilePhase, setTilePhase] = useState(0);
  const [shown, setShown] = useState(false);   // вывод виден
  const [demoDone, setDemoDone] = useState(false);
  const [div, setDiv] = useState(null);
  const [checks, setChecks] = useState(0);
  const [hintGone, setHintGone] = useState(false);
  const [handPhase, setHandPhase] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (sceneRef.current) setW(sceneRef.current.offsetWidth);
      const d = divRowRef.current;
      const g = goRef.current;
      setSpots({
        divX: d ? d.offsetLeft + 21 : 0,
        divY: d ? d.offsetTop + 22 : 0,
        goX: g ? g.offsetLeft + g.offsetWidth / 2 : 0,
        goY: g ? g.offsetTop + 22 : 0,
        ready: Boolean(d && g),
      });
    };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    // Одного resize НЕ хватает: ряд делителей переносится и кнопка уезжает вниз,
    // а кисть осталась бы указывать в пустоту.
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && frameRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(frameRef.current);
    }
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [phase]);
  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const later = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => clearTimers(), []);

  const say = (text, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(text, undefined, id);
  };

  // Один и тот же прогон и в показе, и в очереди ребёнка: плитки сыплются в
  // кучу, потом переезжают в ряды, лишние уходят в зону остатка.
  const runCheck = (n, d, onEnd) => {
    setRun({ n, d });
    setShown(false);
    setTilePhase(0);
    later(() => setTilePhase(1), 30);
    const fallEnd = (n - 1) * TL_STAG + TL_FALL + 60;
    later(() => setTilePhase(2), fallEnd);
    later(() => { setShown(true); if (onEnd) onEnd(); }, fallEnd + TL_MOVE + (n - 1) * TL_STAG + 60);
  };

  // Показ запускается сам. `demoRunRef` держит номер прогона: без него любое
  // измерение ширины (resize, ResizeObserver) перезапускало бы показ с нуля.
  useEffect(() => {
    if (phase !== 'demo' || !W || demoRunRef.current === replay) return;
    demoRunRef.current = replay;
    later(() => runCheck(TL_DEMO_N, TL_DEMO_D, () => {
      setDemoDone(true);
      say(pickL(c.audio.demo_done, lang), 's_tool_demo_done');
    }), 700);
    /* eslint-disable-next-line */
  }, [phase, W, replay]);

  const touched = () => { clearTimers(); setHandPhase(0); setHintGone(true); };

  const replayDemo = () => {
    clearTimers();
    setRun(null); setShown(false); setTilePhase(0); setDemoDone(false);
    setReplay((v) => v + 1);
  };

  const toPlay = () => {
    clearTimers();
    setPhase('play');
    setRun(null); setShown(false); setTilePhase(0); setDemoDone(false); setDiv(null);
    say(pickL(c.audio.play_start, lang), 's_tool_play');
  };

  const busy = run !== null && !shown;
  const start = () => {
    touched();
    if (run && shown) {
      // «Ещё раз» — сцена возвращается в исходное, выбор делителя сбрасывается.
      setRun(null); setShown(false); setTilePhase(0); setDiv(null);
      return;
    }
    if (div === null) return;
    runCheck(TL_PLAY_N, div, () => {
      setChecks((v) => v + 1);
      const okNow = TL_PLAY_N % div === 0;
      say(pickL(okNow ? c.audio.ok : c.audio.no, lang), okNow ? 's_tool_ok' : 's_tool_no');
    });
  };

  // Показ жеста: кисть касается ряда делителей, потом кнопки — ничего не
  // выбирая. На верный делитель (пятёрку) не указывает: первая плитка это 2.
  useEffect(() => {
    if (phase !== 'play' || hintGone || handCountRef.current >= 2 || !spots.ready) return undefined;
    const id = setTimeout(() => {
      handCountRef.current += 1;
      setHandPhase(1);
      later(() => setHandPhase(2), 760);
      later(() => setHandPhase(3), 1560);
      later(() => setHandPhase(0), 2040);
    }, handCountRef.current === 0 ? 900 : 4000);
    return () => clearTimeout(id);
    /* eslint-disable-next-line */
  }, [phase, hintGone, handPhase === 0, spots.ready, spots.goX]);

  const fit = run ? tlFit(run.n, run.d, W) : null;
  const tiles = !run ? [] : Array.from({ length: run.n }).map((_, i) => {
    const [hx, hy] = tlHeap(i, run.n, W);
    if (tilePhase === 0) return { x: hx, y: -70, s: TL_BASE, extra: false, dur: 0, delay: 0 };
    if (tilePhase === 1) return { x: hx, y: hy, s: TL_BASE, extra: false, dur: TL_FALL, delay: i * TL_STAG };
    const gw = fit.cols * (fit.s + fit.g) - fit.g;
    const gh = fit.rows * (fit.s + fit.g) - fit.g;
    const left = Math.max(4, (W - gw) / 2);
    const top = fit.rem ? 4 : Math.max(4, (TL_H - gh) / 2);
    if (i < fit.placed) {
      const r = Math.floor(i / fit.cols);
      const col = i % fit.cols;
      return { x: left + col * (fit.s + fit.g), y: top + r * (fit.s + fit.g), s: fit.s, extra: false, dur: TL_MOVE, delay: i * TL_STAG };
    }
    const k = i - fit.placed;
    const rs = fit.rem > 5 ? Math.min(fit.s, 20) : Math.min(fit.s, 28);
    return { x: 22 + k * (rs + 6), y: TL_H - 48 + 6 + (44 - rs) / 2, s: rs, extra: true, dur: TL_MOVE, delay: i * TL_STAG };
  });

  const ok = run && run.n % run.d === 0;
  const formula = !run || !shown
    ? ''
    : (ok
      ? `${run.n} : ${run.d} = ${run.n / run.d}`
      : `${run.n} : ${run.d} = ${Math.floor(run.n / run.d)}, ${t(CONTENT.s4.rest_label)} ${run.n % run.d}`);
  const note = !run || !shown
    ? ''
    : String(t(ok ? c.note_ok : c.note_no)).replace(/\{n\}/g, String(run.n)).replace(/\{d\}/g, String(run.d));
  const shapeCap = !run || !fit
    ? ''
    : String(t(c.shape)).replace('{a}', String(fit.rows)).replace('{b}', String(fit.cols));
  const goLabel = run && shown ? t(c.again) : t(c.go);
  const goOff = busy || (!run && div === null);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(checks < 1 || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const handX = handPhase >= 2 ? spots.goX : spots.divX;
  const handY = handPhase >= 2 ? spots.goY : spots.divY;

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <div className="rs-top fade-up">
          <h2 className="title h-sub" style={{ margin: 0 }}>{t(c.title)}</h2>
          {phase === 'play' && (
            <span className={'rs-hint' + (hintGone ? ' rs-gone' : ' rs-pulse')}>{t(c.play_hint)}</span>
          )}
        </div>

        {/* Баннер честно говорит, чья сейчас очередь: смотреть или делать. */}
        <div className={'tl-banner fade-up' + (phase === 'play' ? ' tl-banner-play' : '')}>
          <span aria-hidden="true">{phase === 'play' ? '✋' : '👀'}</span>
          <span>
            {phase === 'play'
              ? t(c.play_banner)
              : `${t(c.demo_banner)}: ${TL_DEMO_N} : ${TL_DEMO_D}`}
          </span>
        </div>

        <div className="frame fade-up delay-1" ref={frameRef}
          style={{ padding: 'clamp(10px, 1.8vw, 15px)', position: 'relative' }}>
          <div className="tl-ctl">
            <span className="tl-grp">
              <span className="tl-step">{t(c.step_num)}</span>
              <span className="tl-num">{phase === 'play' ? TL_PLAY_N : TL_DEMO_N}</span>
            </span>
            <span className="tl-grp">
              <span className="tl-step">{t(c.step_div)}</span>
              {phase === 'demo'
                ? <span className="tl-num">{TL_DEMO_D}</span>
                : (
                  <span className="tl-divs" ref={divRowRef}>
                    {TL_DIVS.map((d) => (
                      <button key={d} className={'tl-div' + (div === d ? ' tl-div-sel' : '')}
                        disabled={busy}
                        onClick={() => { touched(); setDiv(d); }}>{d}</button>
                    ))}
                  </span>
                )}
            </span>
            {phase === 'play' && (
              <span className="tl-grp">
                <span className="tl-step">&nbsp;</span>
                <button className="tl-go" ref={goRef} disabled={goOff} onClick={start}>{goLabel}</button>
              </span>
            )}
          </div>

          <div className={'rs-scene tl-scene' + (shown ? (ok ? ' tl-scene-ok' : ' tl-scene-no') : '')} ref={sceneRef}>
            <p className={'tl-empty' + (run || phase === 'demo' ? ' tl-empty-off' : '')}>{t(c.empty)}</p>
            <div className={'rs-zone tl-zone' + (fit && fit.rem ? ' rs-zone-on' : '')}
              style={{ left: 8, right: 8, width: 'auto', marginLeft: 0 }}>
              <span className="rs-zone-lab">{t(CONTENT.s4.rest_label)} {fit && fit.rem ? fit.rem : ''}</span>
            </div>
            {/* Участник — та же фигурка с лицом, что на экранах 2, 3 и в зале
                (методист 2026-08-14). Был кружок, и один и тот же участник
                выглядел на трёх экранах подряд по-разному. */}
            {tiles.map((p, i) => (
              <div key={i} className={'rs-tile' + (p.extra ? ' rs-tile-extra' : '')}
                style={{
                  transform: `translate(${p.x}px, ${p.y}px) scale(${p.s / TL_BASE})`,
                  // Задержка ВНУТРИ сокращённой записи: React предупреждает, если
                  // в одном стиле смешаны `transition` и `transitionDelay`.
                  transition: `transform ${p.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay}ms`,
                }}>
                <Unit s={TL_BASE} i={i} tone={p.extra ? 'rest' : 'ok'}/>
              </div>
            ))}
          </div>

          <div className="rs-out">
            <div className={'rs-formula' + (shown ? ' rs-on' : '')}>{formula}</div>
            {/* Прямоугольник кладётся длинной стороной вбок, поэтому подпись
                НАЗЫВАЕТ стороны: иначе непонятно, где делитель, а где частное. */}
            <div className={'rs-shape' + (shown && fit ? ' rs-on' : '')}>{shapeCap}</div>
            <div className={'rs-note ' + (ok ? 'rs-note-ok' : 'rs-note-no') + (shown ? ' rs-on' : '')}>{note}</div>
          </div>

          {phase === 'play' && (
            <span className="rs-hand" aria-hidden="true"
              style={{
                transform: `translate(${handX}px, ${handY + (handPhase === 0 ? 26 : 0)}px)`,
                opacity: handPhase === 0 ? 0 : 1,
                transition: 'transform 440ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 440ms linear',
              }}>
              <HandSticker/>
            </span>
          )}
        </div>

        {/* Переход из показа в свою очередь делает РЕБЁНОК, а не таймер: пока он
            не сказал «теперь я сам», показ можно смотреть сколько угодно раз. */}
        {/* Способ НАЗЫВАЕТСЯ и записывается шагами. Раньше метод жил только
            в подсказке после ошибки: тот, кто отвечал верно, его не видел. */}
        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={shown ? 2 : (run ? 1 : 0)}/>

        {phase === 'demo' && (
          <div className="tl-acts fade-up">
            <button className="tl-replay" disabled={!demoDone} onClick={replayDemo}>&#8635; {t(c.again)}</button>
            <button className="tl-next" disabled={!demoDone} onClick={toPlay}>{t(c.to_play)} &#8594;</button>
          </div>
        )}

        {phase === 'play' && <p className="small tl-task" style={{ margin: 0, color: T.ink3 }}>{t(c.task)}</p>}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// Qiyinlik pog'onasi: 12 -> 20 -> 10 -> 14 -> 12 -> 24 -> 18 -> 36.
// Rasmli (vizual model): s4, s5, s8. Qolganlari — son va qatorlar bilan.
// Ranglar tili butun dars bo'yi bitta: KARRA — aksent (to'q sariq),
// BO'LUVCHI — yashil. Misoldagi son ham, pastdagi qator/chip ham bir xil rangda.
// ============================================================
const D12 = ['1', '2', '3', '4', '6', '12'];

// Slayd 2: qator sonlari alohida audio segment. Segment id'si ekrandagi aynan
// shu sonni yoritadi; navbatdagi son boshlanganda oldingisi darhol so'nadi.
const S1_AUDIO_PLAN = {
  uz: [
    // Bo'lish KO'RSATILADI: har kadrga o'z replikasi (metodist 2026-08-13).
    [
      { id: 's1_intro', text: "Quyidagi misolni ko'rib chiqamiz. O'n ikkita non." },
      { id: 's1_split', text: "Ularni uchta teng bo'lakka ajratamiz.", pauseAfterMs: 320 },
      { id: 's1_count', text: "Har bo'lakda to'rttadan chiqdi. O'n ikkini uchga bo'lsak, to'rt chiqadi.", pauseAfterMs: 420 },
    ],
    [
      { id: 's1_mult_intro', text: "O'n ikki uchning karralisi. Uchga karrali sonlar qatoriga qarang." },
      ...["uch", "olti", "to'qqiz", "o'n ikki", "o'n besh"].map((text, i) => ({ id: `s1_mult_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_mult_tail', text: "O'n ikki shu qatorda turibdi.", pauseAfterMs: 500 },
    ],
    [
      { id: 's1_div_intro', text: "Uch esa o'n ikkining bo'luvchisi. O'n ikkining bo'luvchilarini birma-bir ko'ramiz." },
      ...["bir", "ikki", "uch", "to'rt", "olti", "o'n ikki"].map((text, i) => ({ id: `s1_div_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_div_tail', text: "Uch bu ro'yxatda ham bor.", pauseAfterMs: 500 },
    ],
    [{ id: 's1_result', text: "O'n ikki soni uchga qoldiqsiz bo'linadi. Shuning uchun o'n ikki uchning karralisi, uch esa o'n ikkining bo'luvchisi." }],
  ],
  ru: [
    [
      { id: 's1_intro', text: 'Возьмём двенадцать игроков.' },
      { id: 's1_split', text: 'Разведём их на три равные команды.', pauseAfterMs: 320 },
      { id: 's1_count', text: 'В каждой команде получилось по четыре игрока. Двенадцать разделить на три равно четыре.', pauseAfterMs: 420 },
    ],
    [
      { id: 's1_mult_intro', text: 'Двенадцать — кратное числа три. Посмотрим на ряд кратных.' },
      ...['три', 'шесть', 'девять', 'двенадцать', 'пятнадцать'].map((text, i) => ({ id: `s1_mult_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_mult_tail', text: 'Двенадцать стоит в этом ряду.', pauseAfterMs: 500 },
    ],
    [
      { id: 's1_div_intro', text: 'Три — делитель числа двенадцать. Назовём делители двенадцати по одному.' },
      ...['один', 'два', 'три', 'четыре', 'шесть', 'двенадцать'].map((text, i) => ({ id: `s1_div_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_div_tail', text: 'Три есть и в этом списке.', pauseAfterMs: 500 },
    ],
    [{ id: 's1_result', text: 'Двенадцать делится на три без остатка. Поэтому двенадцать кратное числа три, а три делитель числа двенадцать.' }],
  ],
  en: [
    [
      { id: 's1_intro', text: 'Let us take twelve players.' },
      { id: 's1_split', text: 'Let us split them into three equal teams.', pauseAfterMs: 320 },
      { id: 's1_count', text: 'Each team got four players. Twelve divided by three is four.', pauseAfterMs: 420 },
    ],
    [
      { id: 's1_mult_intro', text: 'Twelve is a multiple of three. Look at the row of multiples.' },
      ...['three', 'six', 'nine', 'twelve', 'fifteen'].map((text, i) => ({ id: `s1_mult_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_mult_tail', text: 'Twelve stands in that row.', pauseAfterMs: 500 },
    ],
    [
      { id: 's1_div_intro', text: 'Three is a divisor of twelve. Let us name the divisors of twelve one by one.' },
      ...['one', 'two', 'three', 'four', 'six', 'twelve'].map((text, i) => ({ id: `s1_div_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_div_tail', text: 'Three is in that list as well.', pauseAfterMs: 500 },
    ],
    [{ id: 's1_result', text: 'Twelve divides by three with no remainder. That is why twelve is a multiple of three, and three is a divisor of twelve.' }],
  ],
};

// ОПОРА ДЛЯ ПРАКТИКИ (методист 2026-08-14). Практика 9-13 была голым текстом:
// строка вопроса и кнопки в верхней трети, ниже четыреста пикселей пустоты.
// После насыщенного объяснения это читается как анкета, а не как урок.
// Участники, разошедшиеся по командам: делитель — сколько команд, кратное —
// сколько всего. Правило «делитель не больше самого числа» становится видимым,
// а не заучиваемым.
const TeamsFig = ({ total, teams }) => {
  const per = Math.round(total / teams);
  const s = total > 24 ? 17 : 21;   // тридцать пять фигурок должны влезть в строку
  return (
    <div className="rc-teams tf-row">
      {Array.from({ length: teams }).map((_, g) => (
        <div className="rc-team" key={g}>
          {Array.from({ length: per }).map((_, k) => <Unit key={k} s={s} i={g}/>)}
        </div>
      ))}
    </div>
  );
};

// ЭКРАН 2 — ВСПОМНИМ. Мост от таблицы умножения к теме урока.
// Зачем экран: делители целиком стоят на таблице умножения, но урок к ней
// не обращался ни разу — ребёнок учил «новое» вместо того, чтобы узнать
// старое под новым именем.
const RECALL_A = 3;

const RECALL_B = 4;

const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  const shown = useFilmSteps(step, [1600, 5200, 9000]);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>

      <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 1.8vw, 14px)', padding: 'clamp(13px, 2.4vw, 20px)' }}>
        <div className="rc-eq mono">{`${RECALL_A} · ${RECALL_B} = ${RECALL_A * RECALL_B}`}</div>
        {/* Три команды по четыре — та же пара делителей, только видимая.
            Команды в рамках (методист 2026-08-14): текст говорит «3 команды»,
            значит на экране должны быть видны три команды, а не сетка из
            двенадцати клеток. Участник — та же фигурка, что на экранах 3 и 4. */}
        <div className="rc-teams">
          {Array.from({ length: RECALL_A }).map((_, g) => (
            <div className="rc-team" key={g}>
              {Array.from({ length: RECALL_B }).map((_, k) => (
                <Unit key={k} s={30} i={g}/>
              ))}
              <span className="rc-team-n">{RECALL_B}</span>
            </div>
          ))}
        </div>
      </div>

      {shown >= 1 && (
        <div className="rv-block rv-block-b fade-up">
          <p className="rv-lbl rv-lbl-b">{t(c.lbl_div)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.div_a)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.div_b)}</p>
        </div>
      )}
      {shown >= 2 && (
        <div className="rv-block rv-block-a fade-up">
          <p className="rv-lbl rv-lbl-a">{t(c.lbl_mul)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.mul_a)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.mul_b)}</p>
        </div>
      )}
      {shown >= 3 && (
        <div className="frame-tip g6-explanation-step fade-up">
          <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
          <p className="body" style={{ margin: 0 }}>{t(c.note)}</p>
        </div>
      )}
      {shown >= 3 && <NowYou node={c.now_you}/>}
    </div>
  );
};

// ЭКРАН 6 — РЕШАЕМ ВМЕСТЕ. Образец полного решения.
// Зачем экран: между «посмотрел фильм» и «ответь сам» не было середины —
// ребёнок ни разу не видел решение записанным от начала до конца.
// Неудачный шаг (пятёрка) ОСТАЁТСЯ в записи: ученик должен узнавать отказ,
// а не только удачные пары.
const SV_ROWS = [
  { d: 1, q: 24, rest: 0 },
  { d: 2, q: 12, rest: 0 },
  { d: 3, q: 8, rest: 0 },
  { d: 4, q: 6, rest: 0 },
  { d: 5, q: 4, rest: 4 },
  { d: 6, q: 4, rest: 0 },
];

const SV_STEP_MS = 1100;

const SolveTogether = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s_solve;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_solve_intro', text: pickL(c.audio, lang)[0], trigger: 'on_mount', waits_for: null }]);

  const timersRef = useRef([]);
  const [open, setOpen] = useState(0);       // сколько строк раскрыто
  const [ask, setAsk] = useState(null);      // 'five' | 'stop' | null
  const [wrong5, setWrong5] = useState(false);
  const [wrongStop, setWrongStop] = useState(null);
  const [done, setDone] = useState(false);
  const askRef = useRevealScroll(ask !== null, 320);
  const doneRef = useRevealScroll(done, 320);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const later = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => clearTimers(), []);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };
  const line = (i) => pickL(c.audio, lang)[i];

  // Первые четыре строки раскрываются сами, потом останавливаемся и спрашиваем.
  useEffect(() => {
    later(() => { setOpen(1); say({ ru: line(1), uz: line(1), en: line(1) }, 's_solve_1'); }, 900);
    later(() => setOpen(2), 900 + SV_STEP_MS);
    later(() => setOpen(3), 900 + SV_STEP_MS * 2);
    later(() => { setOpen(4); say({ ru: line(2), uz: line(2), en: line(2) }, 's_solve_2'); }, 900 + SV_STEP_MS * 3);
    later(() => { setAsk('five'); say({ ru: line(3), uz: line(3), en: line(3) }, 's_solve_3'); }, 900 + SV_STEP_MS * 4);
    /* eslint-disable-next-line */
  }, []);

  const answerFive = (yes) => {
    if (ask !== 'five') return;
    if (yes) {
      setWrong5(true);
      say(c.q5_wrong_audio, 's_solve_q5_wrong');
      return;
    }
    setAsk(null);
    setWrong5(false);
    setOpen(5);
    say({ ru: line(4), uz: line(4), en: line(4) }, 's_solve_4');
    later(() => { setOpen(6); say({ ru: line(5), uz: line(5), en: line(5) }, 's_solve_5'); }, SV_STEP_MS);
    later(() => setAsk('stop'), SV_STEP_MS * 2);
  };

  const answerStop = (which) => {
    if (ask !== 'stop') return;
    if (which !== 'a') {
      setWrongStop(which);
      say(which === 'b' ? c.stop_wrong_b_audio : c.stop_wrong_c_audio, `s_solve_stop_${which}`);
      return;
    }
    setAsk(null);
    setWrongStop(null);
    setDone(true);
    say({ ru: line(6), uz: line(6), en: line(6) }, 's_solve_6');
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>

        <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
          {SV_ROWS.map((r, i) => {
            const on = i < open;
            const isFail = r.rest > 0;
            const isStop = i === SV_ROWS.length - 1;
            const tail = isFail
              ? `${t(c.rest_word)} ${r.rest} → ${t(c.no_pair)}`
              : (isStop ? `→ ${t(c.stop_word)}` : `→ ${r.d} ${t(c.pair_word)} ${r.q}`);
            return (
              <div key={r.d} className={'sv-row' + (on ? ' sv-on' : '') + (isFail ? ' sv-fail' : '') + (isStop ? ' sv-stop' : '')}>
                <span className="sv-eq mono">{`24 : ${r.d} = ${r.q}`}</span>
                <span className="sv-tail">{tail}</span>
              </div>
            );
          })}
          {done && <p className="sv-answer fade-up">{t(c.answer)}</p>}
        </div>

        {ask === 'five' && (
          <div ref={askRef} className="frame-tip fade-up">
            <p className="body" style={{ margin: 0, marginBottom: 10 }}>{t(c.q5)}</p>
            <div className="sv-opts">
              <button className={'option' + (wrong5 ? ' option-wrong' : '')} onClick={() => answerFive(true)}>{t(c.q5_yes)}</button>
              <button className="option" onClick={() => answerFive(false)}>{t(c.q5_no)}</button>
            </div>
            {wrong5 && <p className="sv-wrong">{mt(t(c.q5_wrong))}</p>}
          </div>
        )}

        {ask === 'stop' && (
          <div ref={askRef} className="frame-tip fade-up">
            <p className="body" style={{ margin: 0, marginBottom: 10 }}>{t(c.q_stop)}</p>
            <div className="sv-opts sv-opts-col">
              <button className="option" onClick={() => answerStop('a')}>{t(c.stop_a)}</button>
              <button className={'option' + (wrongStop === 'b' ? ' option-wrong' : '')} onClick={() => answerStop('b')}>{t(c.stop_b)}</button>
              <button className={'option' + (wrongStop === 'c' ? ' option-wrong' : '')} onClick={() => answerStop('c')}>{t(c.stop_c)}</button>
            </div>
            {wrongStop && <p className="sv-wrong">{mt(t(wrongStop === 'b' ? c.stop_wrong_b : c.stop_wrong_c))}</p>}
          </div>
        )}

        {done && (
          <div ref={doneRef} className="frame-success fade-up">
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s_methods.m2_title)}: {pickL(CONTENT.s_methods.m2_steps, lang)[3]}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ЭКРАН 9 — ПРАКТИКА 1. Назови роли, три примера подряд.
// Сознательно однотипно: называние должно стать автоматическим до того,
// как начнутся способы.
const RolesPractice = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_roles;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_roles_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const items = c.items;
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [picks, setPicks] = useState([null, null]);
  const [dead, setDead] = useState([[], []]);
  const [wrongKind, setWrongKind] = useState('swap');
  const firstAllRef = useRef(true);
  const record = useRecord(props, items.length);
  const done = round >= items.length;
  const it = items[Math.min(round, items.length - 1)];
  const fbRef = useRevealScroll(done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };
  const fill = (node) => String(t(node)).replace('{a}', it.a).replace('{b}', it.b);
  // Верхняя строка — кратное (индекс 0), нижняя — делитель (индекс 1).
  const correct = [0, 1];

  const pick = (row, i) => {
    if (done || dead[row].indexOf(i) >= 0) return;
    if (i !== correct[row]) {
      firstAllRef.current = false;
      setDead((d) => { const n = [...d]; n[row] = [...n[row], i]; return n; });
      // ДВЕ РАЗНЫЕ ОШИБКИ — два разных разбора (методист 2026-08-14).
      // Раньше в обеих ветках стоял один и тот же `wrong_swap`, а написанный
      // для второго случая `wrong_same` не выводился никогда.
      //   назвал оба числа одним словом  → «одинаковыми не бывают»
      //   поменял названия местами       → «делитель не больше самого числа»
      const other = picks[row === 0 ? 1 : 0];
      setWrongKind(other !== null && other === i ? 'same' : 'swap');
      say(other !== null && other === i ? c.wrong_same : c.wrong_swap, `s_roles_w${round}_${row}`);
      return;
    }
    const next = [...picks];
    next[row] = i;
    setPicks(next);
    if (next[0] !== null && next[1] !== null) {
      say(c.audio.on_correct, `s_roles_ok${round}`);
      setTimeout(() => {
        if (round + 1 >= items.length) {
          setRound(items.length);
          record(firstAllRef.current, t(c.title));
        } else {
          setRound((r) => r + 1);
          setPicks([null, null]);
          setDead([[], []]);
          setWrongKind('swap');
        }
      }, 900);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const rows = [c.row_a, c.row_b];
  const opts = [c.opt_mult, c.opt_div];

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
        {!done && <TaskCount node={c.counter} i={round + 1} n={items.length}/>}

        {!done && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="pn-ctx">{fill(c.ctx)}</p>
            <TeamsFig total={Number(it.a)} teams={Number(it.b)}/>
            <EquationLine a={it.a} b={it.b} r={it.r} hiA hiB/>
            {rows.map((rowNode, row) => (
              <div key={row} className="pn-row">
                <p className="pn-text">{fill(rowNode)}</p>
                <div className="pn-opts">
                  {opts.map((o, i) => {
                    const isDead = dead[row].indexOf(i) >= 0;
                    const isOk = picks[row] === i;
                    return (
                      <button key={i} disabled={picks[row] !== null}
                        className={'option pn-opt' + (isOk ? ' option-correct' : (isDead ? ' option-wrong' : ''))}
                        onClick={() => pick(row, i)}>{t(o)}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            {(dead[0].length > 0 || dead[1].length > 0) && (
              <HintBlock show>{mt(t(wrongKind === 'same' ? c.wrong_same : c.wrong_swap))}</HintBlock>
            )}
          </div>
        )}

        {done && (
          <div ref={fbRef}>
            <FeedbackBlock show isCorrect>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            </FeedbackBlock>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ЭКРАН 10 — ПРАКТИКА 2. Способ 1 на реальных числах, четыре проверки.
const CheckPractice = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_check;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_check_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const items = c.items;
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [state, setState] = useState(null);  // null | 'ok' | 'no'
  const firstAllRef = useRef(true);
  const record = useRecord(props, items.length);
  const done = round >= items.length;
  const idx = Math.min(round, items.length - 1);
  const it = items[idx];
  const fbRef = useRevealScroll(state !== null || done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  const answer = (yes) => {
    if (done || state === 'ok') return;
    if (yes !== it.ok) {
      firstAllRef.current = false;
      setState('no');
      say(c.wrong_audio[idx], `s_check_w${idx}`);
      return;
    }
    setState('ok');
    say(c.correct[idx], `s_check_ok${idx}`);
    setTimeout(() => {
      if (round + 1 >= items.length) {
        setRound(items.length);
        record(firstAllRef.current, t(c.title));
      } else {
        setRound((r) => r + 1);
        setState(null);
      }
    }, 1400);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
        {!done && <TaskCount node={c.counter} i={round + 1} n={items.length}/>}

        {!done && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="body" style={{ margin: 0, marginBottom: 12 }}>{mt(t(c.q[idx]))}</p>
            <div className="sv-opts">
              <button className={'option' + (state === 'no' && !it.ok ? ' option-wrong' : (state === 'ok' && it.ok ? ' option-correct' : ''))}
                disabled={state === 'ok'} onClick={() => answer(true)}>{t(c.yes)}</button>
              <button className={'option' + (state === 'no' && it.ok ? ' option-wrong' : (state === 'ok' && !it.ok ? ' option-correct' : ''))}
                disabled={state === 'ok'} onClick={() => answer(false)}>{t(c.no)}</button>
            </div>
            {state === 'no' && <HintBlock show>{mt(t(c.wrong[idx]))}</HintBlock>}
            {state === 'ok' && (
              <div ref={fbRef}>
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.correct[idx]))}</p>
                </FeedbackBlock>
              </div>
            )}
          </div>
        )}

        {done && (
          <div ref={fbRef}>
            <FeedbackBlock show isCorrect>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct[items.length - 1]))}</p>
            </FeedbackBlock>
          </div>
        )}

        {/* Способ, которым это задание и решается, стоит рядом с заданием
            (методист 2026-08-14). Раньше под вопросом было четыреста пустых
            пикселей, а способ остался на экране 4 и к моменту практики
            забывался. Карточка та же самая, импортированная, не копия. */}
        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no}/>
      </div>
    </Stage>
  );
};

// ЭКРАН 12 — ПРАКТИКА 4. Найди ошибку.
// Первое задание — ЛОВУШКА: ошибки нет. Ребёнок должен уметь сказать
// «всё верно», а не искать ошибку только потому, что о ней спросили.
const FindError = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_error;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_error_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [task, setTask] = useState(props.storedAnswer ? 2 : 0);
  const [dead, setDead] = useState([]);
  const [ok, setOk] = useState(false);
  const firstAllRef = useRef(true);
  const record = useRecord(props, 2);
  const done = task >= 2;
  const fbRef = useRevealScroll(ok || done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  const t2opts = tri(lang, c.t2_opts, c.t2_opts_uz, c.t2_opts_en);
  const wrongNode2 = [c.t2_wrong_4, null, c.t2_wrong_12, c.t2_wrong_none];
  const wrongAudio2 = [c.t2_wrong_4_audio, null, c.t2_wrong_12_audio, c.t2_wrong_none_audio];

  const pick = (i) => {
    if (ok || done) return;
    const right = task === 0 ? 0 : 1;
    if (i !== right) {
      firstAllRef.current = false;
      setDead((d) => (d.indexOf(i) >= 0 ? d : [...d, i]));
      say(task === 0 ? c.t1_wrong_audio : wrongAudio2[i], `s_error_w${task}_${i}`);
      return;
    }
    setOk(true);
    say(task === 0 ? c.t1_correct : c.t2_correct, `s_error_ok${task}`);
    setTimeout(() => {
      if (task === 0) { setTask(1); setDead([]); setOk(false); }
      else { setTask(2); record(firstAllRef.current, t(c.title)); }
    }, 1600);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const list = task === 0 ? c.t1_list : c.t2_list;
  const opts = task === 0 ? [t(c.t1_opt_aziz), t(c.t1_opt_dilnoza)] : t2opts;

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
        {!done && <TaskCount node={c.counter} i={task + 1} n={2}/>}

        {!done && (
          <div className="frame fade-up delay-1 d1-err-frame" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="body" style={{ margin: 0, marginBottom: 8 }}>{t(task === 0 ? c.t1_lead : c.t2_lead)}</p>
            {/* Список Азиза — листок из тетради, а не строка чипов
                (методист 2026-08-14). Экран называется «проверь чужое решение»,
                и чужое решение должно выглядеть как чужая запись. */}
            <div className="fe-sheet">
              <div className="fe-list">
                {list.map((n) => <span key={n} className="fe-chip mono">{n}</span>)}
              </div>
            </div>
            <p className="body d1-err-q" style={{ margin: '12px 0 10px' }}>{t(task === 0 ? c.t1_q : c.t2_q)}</p>
            <div className="sv-opts sv-opts-col">
              {opts.map((label, i) => {
                const isDead = dead.indexOf(i) >= 0;
                const right = task === 0 ? 0 : 1;
                return (
                  <button key={i} disabled={ok}
                    className={'option' + (ok && i === right ? ' option-correct' : (isDead ? ' option-wrong' : ''))}
                    onClick={() => pick(i)}>{label}</button>
                );
              })}
            </div>
            {dead.length > 0 && !ok && (
              <HintBlock show>{mt(t(task === 0 ? c.t1_wrong : (wrongNode2[dead[dead.length - 1]] || c.t2_wrong_none)))}</HintBlock>
            )}
            {ok && (
              <div ref={fbRef}>
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(task === 0 ? c.t1_correct : c.t2_correct))}</p>
                </FeedbackBlock>
              </div>
            )}
          </div>
        )}

        {/* Проверять чужой список нечем, если способ не под рукой. */}
        {!done && <MethodCard title={CONTENT.s_methods.m2_title} steps={CONTENT.s_methods.m2_steps}/>}

        {done && (
          <div ref={fbRef}>
            <FeedbackBlock show isCorrect>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.t2_correct))}</p>
            </FeedbackBlock>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ЭКРАН 13 — ЗАДАЧА. Сетка фотографий с турнира.
// Крайние сетки (по 1 и по 24) СЧИТАЮТСЯ. Если их выбросить ради
// «реалистичности галереи», ответ станет 6 и разойдётся с экзаменационным
// «сколько делителей у 24» — то есть урок научил бы неверному числу.
// Снимки с турнира: те же три цвета, что футболки в зале, плюс тёплый пол.
const GR_SHOTS = ['#7ECBE6', '#F5C77E', '#8FD6B4', '#9FD3EA'];

const GRID_24 = [1, 2, 3, 4, 6, 8, 12, 24];

const GRID_25 = [1, 5, 25];

const GridTask = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_grid;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_grid_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [part, setPart] = useState(props.storedAnswer ? 2 : 0);
  const [dead, setDead] = useState([]);
  const [ok, setOk] = useState(false);
  const [box, setBox] = useState({ w: 280, h: 190 });
  const boxRef = useRef(null);
  const firstAllRef = useRef(true);
  const record = useRecord(props, 2);
  const timersRef = useRef([]);

  useEffect(() => {
    const measure = () => {
      if (boxRef.current) setBox({ w: boxRef.current.offsetWidth, h: boxRef.current.offsetHeight });
    };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, []);
  const done = part >= 2;
  const fbRef = useRevealScroll(ok || done, 320);
  // Разбор неверного ответа тоже подтягивается в кадр: на ноутбуке он выходил
  // на 94 пикселя ниже нижней панели, то есть ребёнок его просто не видел.
  // В active идёт ЧИСЛО попыток, а не флаг: на второй ошибке разбор меняется, и
  // флаг остался бы true, то есть подтяжка не сработала бы второй раз.
  const hintRef = useRevealScroll(ok ? 0 : dead.length, 320);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);
  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  // АНИМАЦИЯ ОТВЕЧАЕТ НА ВОПРОС, А НЕ КРУТИТСЯ (методист 2026-08-14).
  // Было: раскладки сменяли друг друга по кругу каждые 1,7 секунды, включая
  // «по одной в ряд» — она вырождалась в ниточку из точек и наезжала на
  // подпись. Движение шло само по себе и ответа не давало.
  // Стало: пока ребёнок думает, стоит ОДНА понятная раскладка. Когда он
  // ответил, выходит строка ВСЕХ пар — их можно пересчитать и проверить себя.
  const n = part === 0 ? 24 : 25;
  const cols = part === 0 ? GRID_24 : GRID_25;
  const per = part === 0 ? 6 : 5;   // спокойная раскладка на время вопроса
  const rows = n / per;
  // Ячейка ужимается так, чтобы ЛЮБАЯ раскладка влезла в одну и ту же сцену.
  const gap = 8;
  // Потолок снимка поднят второй раз (методист 2026-08-14): на стене шириной
  // 760 пикселей снимки занимали двести и читались как крошка. Кручение
  // раскладок убрано, «по одной в ряд» больше не бывает, поэтому высота сцены
  // считается под шесть строк максимум, а не под двадцать четыре.
  const cell = Math.max(4, Math.min(
    68,
    Math.floor((box.h - gap * (rows - 1)) / rows),
    Math.floor((box.w - gap * (per - 1)) / per),
  ));

  const optsNode = part === 0 ? c.opts_24 : c.opts_25;
  const opts = pickL(optsNode, lang) || [];
  const right = part === 0 ? c.right_24 : c.right_25;
  // Порядок разборов совпадает с порядком вариантов: 4 / 6 / 8 / 24 и 1 / 3 / 5 / 25.
  const wrongNodes = part === 0
    ? [c.wrong_pair, c.wrong_6, null, c.wrong_all]
    : [c.wrong_one, null, c.wrong_five, c.wrong_all25];
  const wrongAudio = part === 0
    ? [c.wrong_pair_audio, c.wrong_6_audio, null, c.wrong_all_audio]
    : [c.wrong_one_audio, null, c.wrong_five_audio, c.wrong_all25_audio];

  const pick = (i) => {
    if (ok || done) return;
    if (i !== right) {
      firstAllRef.current = false;
      setDead((d) => (d.indexOf(i) >= 0 ? d : [...d, i]));
      say(wrongAudio[i] || c.audio.on_wrong, `s_grid_w${part}_${i}`);
      return;
    }
    setOk(true);
    say(part === 0 ? c.audio.a1 : c.audio.a2, `s_grid_ok${part}`);
    setTimeout(() => {
      if (part === 0) { setPart(1); setDead([]); setOk(false); }
      else { setPart(2); record(firstAllRef.current, t(c.title)); }
    }, 2600);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>

        <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
          <p className="body" style={{ margin: 0, marginBottom: 10 }}>{mt(t(done ? c.q2 : (part === 0 ? c.q1 : c.q2)))}</p>
          {/* СЦЕНА ГАЛЕРЕИ в языке хука (методист 2026-08-14): стена, доска
              с заголовком и снимки на ней. Раньше на белом поле лежали голые
              квадраты, и связи с турниром не читалось. */}
          <div className="gr-wrap">
            {/* Размер снимка считается от ВЫСОТЫ сцены, а не задаётся в CSS.
                Раскладка «по 1 в ряд» это 24 ряда: с фиксированной ячейкой
                сцена выросла бы вчетверо и кнопки ушли бы за нижний край. */}
            <div className="gr-wall">
              <svg className="gr-wall-bg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
                <rect x="0" y="0" width="400" height="120" fill="#F6F1E7"/>
                <rect x="0" y="0" width="400" height="9" fill="#E7DFD0"/>
                <rect x="0" y="113" width="400" height="7" fill="#E2D8C6"/>
              </svg>
              <span className="gr-pin gr-pin-l" aria-hidden="true"/>
              <span className="gr-pin gr-pin-r" aria-hidden="true"/>
              <div className="gr-box" ref={boxRef}>
                <div className="gr-grid" style={{ gridTemplateColumns: `repeat(${per}, ${cell}px)`, gap: gap }}>
                  {Array.from({ length: n }).map((_, i) => (
                    <span key={i} className="gr-ph" style={{ width: cell, height: cell, transitionDelay: `${(i % 12) * 18}ms` }}>
                      <i style={{ background: GR_SHOTS[i % GR_SHOTS.length] }}/>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="gr-cap mono">
              {t(c.grid_word)}: {String(t(c.per_row)).replace('{k}', String(per))} · {rowsWord(t(c.rows_word), c.rows_forms, lang, rows)}
            </p>
          </div>

          {!done && (
            <>
              <p className="body" style={{ margin: '10px 0 8px' }}>{t(c.ask_count)}</p>
              <div className="sv-opts gr-opts">
                {opts.map((label, i) => (
                  <button key={i} disabled={ok}
                    className={'option' + (ok && i === right ? ' option-correct' : (dead.indexOf(i) >= 0 ? ' option-wrong' : ''))}
                    onClick={() => pick(i)}>{label}</button>
                ))}
              </div>
              {dead.length > 0 && !ok && (
                <div ref={hintRef}>
                  <HintBlock show>{mt(t(wrongNodes[dead[dead.length - 1]] || c.wrong_6))}</HintBlock>
                </div>
              )}
            </>
          )}

          {ok && (
            <div ref={fbRef}>
              {/* Все раскладки СРАЗУ и парами: ребёнок пересчитывает их сам и
                  видит, что это те же пары делителей, что на экране 5. */}
              <div className="gp-row">
                {cols.map((k) => (
                  <span key={k} className={'gp-chip' + (k * k === n ? ' gp-square' : '')}>
                    {k} <i>&#215;</i> {n / k}
                  </span>
                ))}
              </div>
              <FeedbackBlock show isCorrect>
                <p className="body" style={{ margin: 0 }}>{mt(t(part === 0 ? c.out_1 : c.out_2))}</p>
              </FeedbackBlock>
            </div>
          )}
        </div>

        {done && (
          <div className="frame-success fade-up">
            <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
            <p className="small" style={{ margin: '6px 0 0', color: T.ink3 }}>{mt(t(c.square))}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// Высота сцены печений. Была 176 — экран не помещался на 71 пиксель, и это
// было ДО всех правок: сломанная проверка фолда его не показывала.
const SF_H = 126;

const SplitFilm = ({ audioPhase = 0 }) => {
  const boxRef = useRef(null);
  const [w, setW] = useState(0);
  const phase = useFilmPhase(audioPhase, [1700, 3600]);
  useEffect(() => {
    const measure = () => { if (boxRef.current) setW(boxRef.current.offsetWidth); };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, []);
  const s = w && w < 420 ? 26 : 34;
  const gap = 6;
  const rowGap = phase >= 1 ? 16 : 6;
  const cluster = (i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const gw = 6 * (s + gap) - gap;
    return { x: (w - gw) / 2 + col * (s + gap), y: SF_H / 2 - (s + 3) + row * (s + gap) };
  };
  const grouped = (i) => {
    const g = Math.floor(i / 4);
    const k = i % 4;
    const rowW = 4 * (s + gap) - gap;
    const totalH = 3 * s + 2 * rowGap;
    return { x: (w - rowW) / 2 + k * (s + gap), y: (SF_H - totalH) / 2 + g * (s + rowGap) };
  };
  const at = (i) => (phase === 0 ? cluster(i) : grouped(i));
  const rowW = 4 * (s + gap) - gap;
  const totalH = 3 * s + 2 * rowGap;
  const frames = [0, 1, 2].map((g) => ({
    x: (w - rowW) / 2 - 7,
    y: (SF_H - totalH) / 2 + g * (s + rowGap) - 5,
    w: rowW + 14,
    h: s + 10,
  }));
  return (
    <div className="sf-box" ref={boxRef} style={{ height: SF_H }}>
      {w > 0 && phase >= 1 && frames.map((f, g) => (
        <span key={'f' + g} className="sf-frame" style={{ left: f.x, top: f.y, width: f.w, height: f.h }}/>
      ))}
      {w > 0 && phase >= 2 && frames.map((f, g) => (
        <span key={'l' + g} className="sf-lab mono" style={{ left: f.x + f.w + 8, top: f.y + f.h / 2 - 11 }}>4</span>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const p = at(i);
        return (
          <span key={i} className="sf-u"
            style={{ transform: `translate(${p.x}px, ${p.y}px)`, transitionDelay: `${(i % 4) * 40}ms` }}>
            <Unit s={s} i={i}/>
          </span>
        );
      })}
    </div>
  );
};

// s1 — DARSNING O'ZAGI. Bitta misol 12 : 3 = 4 dan ikkita nom chiqadi.
// Qadamlar yig'iladi: oxirida bola ikkala nomni bir ekranda birga ko'radi.
const Screen1 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s1} totalScreens={TOTAL_SCREENS} audioPlan={S1_AUDIO_PLAN}
    renderStep={({ t, step, refs, muted, activeAudioId, lastCompletedAudioId }) => {
      const multActive = activeAudioId?.startsWith('s1_mult_') && /\d$/.test(activeAudioId)
        ? Number(activeAudioId.split('_').pop()) : -1;
      const divActive = activeAudioId?.startsWith('s1_div_') && /\d$/.test(activeAudioId)
        ? Number(activeAudioId.split('_').pop()) : -1;
      const multSettled = step >= 2 || lastCompletedAudioId === 's1_mult_tail' ? 3 : -1;
      const divSettled = step >= 3 || lastCompletedAudioId === 's1_div_tail' ? 2 : -1;
      return (
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(CONTENT.s1.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(CONTENT.s1.bridge)}</p>
        {/* Massiv modeli boshidan turadi — birinchi qadam bo'sh ko'rinmasin va
            bo'lish nimani bildirishi ko'z bilan ko'rinsin. Qadamlar ochilgach
            kichrayadi, lekin YO'QOLMAYDI: misolning ma'no langari shu. */}
        {/* Rasm misolni TUSHUNTIRADI: 12 dona uchta teng bo'lakka AJRALADI va
            har bo'lakda to'rttadan borligi yoziladi. Shundan keyin tenglik. */}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px, 1.4vw, 11px)', padding: 'clamp(11px, 2vw, 18px)' }}>
          <SplitFilm audioPhase={muted ? 0 : (
            (step >= 1 || activeAudioId === 's1_count' || lastCompletedAudioId === 's1_split' || lastCompletedAudioId === 's1_count') ? 2
              : ((activeAudioId === 's1_split' || lastCompletedAudioId === 's1_intro') ? 1 : 0)
          )}/>
          <EquationLine a="12" b="3" r="4" hiA={step === 1 || step >= 3} hiB={step === 2 || step >= 3}/>
        </div>
        {step >= 1 && (
          <div ref={refs[1]} className="rv-block rv-block-a rv-block-visual fade-up">
            <p className="rv-lbl rv-lbl-a">{t(CONTENT.s1.lbl_mult)}</p>
            <p className="small rv-cap">{t(CONTENT.s1.cap_mult)}</p>
            <MultiplesTrack base={3} count={5} active={multActive} activeOnly settled={multSettled}/>
          </div>
        )}
        {step >= 2 && (
          <div ref={refs[2]} className="rv-block rv-block-b rv-block-visual fade-up">
            <p className="rv-lbl rv-lbl-b">{t(CONTENT.s1.lbl_div)}</p>
            <p className="small rv-cap">{t(CONTENT.s1.cap_div)}</p>
            <DivisorChips list={D12} active={divActive} settled={divSettled} syncActive tone="success"/>
          </div>
        )}
        {step >= 3 && (
          <div ref={refs[3]} className="frame-tip g6-explanation-step fade-up">
            <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s1.link)}</p>
          </div>
        )}
      </div>
      );
    }}/>
);

const Screen3 = (props) => {
  const t = useT();
  return (
    <RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS}
      exampleNode={(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 1.8vw, 14px)' }}>
          <EquationLine a="12" b="3" r="4" hiA hiB labelA="a" labelB="b"/>
          <div className="rv-tags">
            <span className="rv-tag rv-tag-a">{t(CONTENT.s1.lbl_mult)}</span>
            <span className="rv-tag rv-tag-b">{t(CONTENT.s1.lbl_div)}</span>
          </div>
        </div>
      )}/>
  );
};

// Ekran 07 — ASBOB (2026-08-13 da qo'shilgan yangi ekran).
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;

// ============================================================
// ЭКРАН 09 — КИНО: делители встают парами.
// Было: ребёнок сам нажимал числа (PairsScreen из макета Claude Design).
// Стало (методист 2026-08-13): интерактив убран, визуальный язык оставлен —
// кадры идут за репликами.
//   0  пустая сцена и подписанный пустой ряд «Делители числа 12»
//   1  один и двенадцать выезжают навстречу, между ними связь, сверху
//      произведение 1 · 12 = 12, затем оба уходят в ряд
//   2  то же для двух и шести
//   3  то же для трёх и четырёх, но они ВСТРЕЧАЮТСЯ в середине: появляется
//      вертикальная черта, подпись «слева и справа встретились», ряд
//      закрывается рамкой, снизу выходит факт про дюжину
// Позиции берутся из offsetTop (layout px) — на телефоне урок масштабируется
// zoom, и getBoundingClientRect дал бы двойное умножение.
// ============================================================
const PR_PAIRS = [[1, 12], [2, 6], [3, 4]];

// Зазор между числами пары в момент сближения: у 1 и 12 он широкий, у 3 и 4
// их почти нет — на этом и держится вывод «дальше искать нечего».
const PR_GAP = { 1: 280, 2: 150, 3: 14 };

const PR_TILE = 56;

const PR_SMALL = 44;

const PR_MATH = 620;

// Внутренние кадры одной пары, миллисекунды от начала шага.
const PR_T_IN = 40;

const PR_T_PROD = PR_MATH + 140;

const PR_T_CONV = PR_MATH + 520;

const PR_T_MEET = PR_MATH * 2 + 620;

const PR_T_ROW = PR_MATH * 2 + 900;

const PR_T_ROW_MEET = PR_MATH * 2 + 2100;

// Минимальная выдержка шага: если TTS молчит, реплика «заканчивается» мгновенно,
// и без этого ребёнок увидел бы сразу готовый ряд вместо движения.
const PR_MARKS = [2800, 9400, 15800];

const PairsFilmBody = ({ step }) => {
  const c = CONTENT.s6;
  const t = useT();
  const shown = useFilmSteps(step, PR_MARKS);

  const bodyRef = useRef(null);
  const sceneRef = useRef(null);
  const rowRef = useRef(null);
  const timersRef = useRef([]);
  const playedRef = useRef(0);
  // Вся геометрия живёт в состоянии, а не читается из ссылок во время рендера:
  // ссылка в рендере — это чтение DOM в момент, когда React его ещё не отдал.
  const [geo, setGeo] = useState({ W: 0, slotY: 0, rowY: 0 });
  const [tiles, setTiles] = useState({});
  const [found, setFound] = useState([]);
  const [link, setLink] = useState({ x: 0, y: 0, w: 0, on: false, dur: 0 });
  const [prod, setProd] = useState({ text: '', x: 0, y: 0, on: false });
  const [bar, setBar] = useState({ x: 0, y: 0, h: 0, on: false });
  const [met, setMet] = useState(false);
  const [nyOk, setNyOk] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (!bodyRef.current) return;
      setGeo({
        W: bodyRef.current.offsetWidth,
        slotY: (sceneRef.current ? sceneRef.current.offsetTop : 0) + 32,
        rowY: rowRef.current ? rowRef.current.offsetTop : 0,
      });
    };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    // Одного resize НЕ хватает: на телефоне подпись переносится на две строки,
    // ряд уезжает вниз, а плитки остаются по старым координатам.
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && bodyRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(bodyRef.current);
    }
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, []);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Кадры одной пары. Ссылок на DOM тут нет — только числа из `geo`.
  useEffect(() => {
    if (!geo.W || shown < 1 || shown > PR_PAIRS.length) return;
    if (playedRef.current >= shown) return;
    const later = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)); };
    // Если шаг перепрыгнули (медленный кадр не успел), пропущенные пары просто
    // оказываются в ряду — без них ряд был бы дырявым. Через таймер, а не прямо
    // в эффекте: синхронный setState в эффекте — ошибка линта.
    const skipped = [];
    for (let k = playedRef.current; k < shown - 1; k += 1) skipped.push(...PR_PAIRS[k]);
    if (skipped.length) later(() => setFound((f) => [...f, ...skipped]), 0);
    playedRef.current = shown;

    const setTile = (n, patch) => setTiles((prev) => ({ ...prev, [n]: { ...(prev[n] || {}), ...patch } }));
    const [a, b] = PR_PAIRS[shown - 1];
    const isMeet = shown === PR_PAIRS.length;
    const leftX = 8;
    const rightX = Math.max(90, geo.W - 8 - PR_TILE);

    setTiles((prev) => ({
      ...prev,
      [a]: { x: -PR_TILE - 12, y: geo.slotY, s: 1, dur: 0 },
      [b]: { x: geo.W + 12, y: geo.slotY, s: 1, dur: 0 },
    }));
    later(() => {
      setTile(a, { x: leftX, dur: PR_MATH });
      setTile(b, { x: rightX, dur: PR_MATH });
      setLink({ x: leftX + PR_TILE, y: geo.slotY + 27, w: rightX - leftX - PR_TILE, on: true, dur: 0 });
    }, PR_T_IN);
    later(() => setProd({ text: `${a} · ${b} = 12`, x: geo.W / 2, y: geo.slotY - 32, on: true }), PR_T_PROD);
    later(() => {
      const gap = PR_GAP[a];
      const lx = geo.W / 2 - gap / 2 - PR_TILE;
      const rx = geo.W / 2 + gap / 2;
      setTile(a, { x: lx, dur: PR_MATH });
      setTile(b, { x: rx, dur: PR_MATH });
      setLink((l) => ({ ...l, x: lx + PR_TILE, w: Math.max(0, gap), dur: PR_MATH }));
    }, PR_T_CONV);
    if (isMeet) {
      later(() => { setBar({ x: geo.W / 2 - 1.5, y: geo.slotY - 6, h: 68, on: true }); setMet(true); }, PR_T_MEET);
    }
    later(() => {
      setFound((f) => [...f, a, b]);
      setLink((l) => ({ ...l, on: false }));
      setProd((p) => ({ ...p, on: false }));
      setBar((bb) => ({ ...bb, on: false }));
    }, isMeet ? PR_T_ROW_MEET : PR_T_ROW);
  }, [shown, geo.W, geo.slotY]);

  const done = found.length === 6;
  // Положение плитки в итоговом ряду ВЫЧИСЛЯЕТСЯ, а не запоминается: при смене
  // размера окна ряд перестраивается сам, без пересчёта состояния.
  const sortedFound = [...found].sort((x, y) => x - y);
  const rowStep = PR_SMALL + 8;
  const rowLeft = Math.max(4, (geo.W - (sortedFound.length * rowStep - 8)) / 2);
  const posOf = (n) => {
    const i = sortedFound.indexOf(n);
    if (i >= 0) return { x: rowLeft + i * rowStep, y: geo.rowY, s: PR_SMALL / PR_TILE, dur: PR_MATH };
    return tiles[n];
  };
  const shownTiles = Array.from(new Set([...Object.keys(tiles).map(Number), ...found]));

  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.bridge)}</p>
      <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
        <div className="pr-body" ref={bodyRef}>
          {/* Пунктирные метки стоят только до первой пары: они показывают, ОТКУДА
              приедут числа. Дальше их места занимают сами плитки.
              Когда все шесть в ряду, сцена СХЛОПЫВАЕТСЯ: иначе над результатом
              висело бы 120 пустых пикселей и экран читался бы как недоделанный. */}
          <div className={'pr-scene' + (done ? ' pr-scene-done' : '')} ref={sceneRef}>
            {shown === 0 && <div className="pr-slot pr-slot-l"/>}
            {shown === 0 && <div className="pr-slot pr-slot-r"/>}
          </div>

          {/* Одна строка на два состояния: пока пар нет — серое ожидание, после
              встречи — зелёный вывод. Две отдельные строки дёргали бы высоту. */}
          <p className={'pr-note' + (met ? ' pr-note-ok pr-on' : (shown === 0 ? ' pr-note-wait pr-on' : ''))}>
            {met ? t(c.meet) : t(c.wait)}
          </p>

          <p className="pr-over">{t(c.cap_all)}</p>
          <div className="pr-row" ref={rowRef}>
            <div className="pr-frame"
              style={{ left: rowLeft - 6, width: 6 * rowStep - 8 + 12, opacity: done ? 1 : 0 }}/>
          </div>

          {/* ПАРЫ ОСТАЮТСЯ ВИДНЫ (методист 2026-08-14). Экран называется
              «делители ищем парами», метод называется «иди парами до встречи»,
              а в конце на экране лежал плоский ряд чисел — пар в нём не было.
              Ребёнок, который отвлёкся, видел просто список. Теперь под рядом
              стоят три дуги: крайние в паре, следующие внутри, и так до встречи
              в середине. Вложенность и есть «шли навстречу друг другу». */}
          <div className={'pr-arcs' + (done ? ' pr-on' : '')}>
            <svg viewBox={`0 0 ${Math.max(geo.W, 1)} 46`} preserveAspectRatio="none" aria-hidden="true">
              {[[0, 5, 40], [1, 4, 28], [2, 3, 16]].map(([i, j, d], k) => {
                const cx = (m) => rowLeft + m * rowStep + PR_SMALL / 2;
                return (
                  <path key={k} className="pr-arc" style={{ animationDelay: `${k * 130}ms` }}
                    d={`M${cx(i)} 2 Q${(cx(i) + cx(j)) / 2} ${d * 2} ${cx(j)} 2`}/>
                );
              })}
            </svg>
          </div>
          <p className={'pr-eqs mono' + (done ? ' pr-on' : '')}>
            1 &#183; 12 = 2 &#183; 6 = 3 &#183; 4 = 12
          </p>

          <div className="pr-layer">
            <div className={'pr-link' + (link.on ? ' pr-link-on' : '')}
              style={{ left: link.x, top: link.y, width: link.w, transition: `width ${link.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1), left ${link.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 180ms linear` }}/>
            <div className={'pr-prod' + (prod.on ? ' pr-on' : '')} style={{ left: prod.x, top: prod.y }}>{prod.text}</div>
            <div className={'pr-bar' + (bar.on ? ' pr-bar-on' : '')} style={{ left: bar.x, top: bar.y, height: bar.h }}/>
            {shownTiles.map((n) => {
              const tl = posOf(n);
              if (!tl) return null;
              return (
                <div key={n} className="pr-tile"
                  style={{
                    transform: `translate(${tl.x}px, ${tl.y}px) scale(${tl.s})`,
                    transition: `transform ${tl.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
                  }}>
                  <div className="pr-tile-in">{n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Шаги загораются в такт парам: шаг 1 — единица и само число,
          шаг 4 — правило остановки, ради которого экран и существует. */}
      <MethodCard title={CONTENT.s_methods.m2_title} steps={CONTENT.s_methods.m2_steps}
        active={shown === 0 ? 0 : (shown >= 3 ? 3 : shown)}/>

      {/* Сначала ход ребёнка, факт про дюжину — наградой ПОСЛЕ ответа.
          Вместе они не помещаются, а по очереди высота экрана не растёт. */}
      {done && !nyOk && <NowYou node={c.now_you} onSolved={() => setNyOk(true)}/>}
      {nyOk && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={c.fact}/>}
    </div>
  );
};

// s6 — bo'luvchilarni juftlab qidirish. Ekran 09: KINO, bola hech narsa bosmaydi.
// Fakt oxirgi kadrda ovozlanadi (`factOnLast`) va shu paytda kartochka chiqadi.
const Screen6 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS} factOnLast
    renderStep={({ step }) => <PairsFilmBody step={step}/>}/>
);

const D18 = ['1', '2', '3', '6', '9', '18'];

// ============================================================
// ЭКРАН 13 — КИНО: бесконечные кратные против конечных делителей.
// Было: ребёнок сам таскал метку (MagnetScreen из макета Claude Design).
// Стало (методист 2026-08-13): перетаскивание убрано, обе прямые остались —
// кадры идут за репликами.
//   0  две прямые стоят пустыми
//   1  метка САМА прыгает по кратным трёх, прямая едет влево, у края
//      многоточие и стрелка: следующее кратное всегда есть
//   2  на нижней прямой по одному загораются делители 1, 2, 3, 4, 6, 12,
//      за двенадцатью стена, метка упирается в неё и отскакивает
//   3  общий вывод зелёным
// Разницу видно не словами, а расстоянием: верхняя прямая уезжает за экран,
// нижняя упирается в стену через шесть засечек.
// ============================================================
// ЭКРАН 7 — ОДНА ОБЩАЯ ОСЬ (методист 2026-08-14).
// Было: сначала пятнадцать секунд метка шагала по верхней прямой, потом
// пятнадцать по нижней. Экран про ПРОТИВОПОСТАВЛЕНИЕ, а противопоставление
// показывают рядом и одновременно: к моменту, когда нижняя упиралась в стену,
// верхняя была уже забыта. Вдобавок верхняя прямая уезжала за левый край,
// и результат приходилось дублировать рядом чипов.
// Стало: ОДНА ось. Сверху загораются кратные трёх, снизу делители двенадцати,
// оба ряда идут шаг в шаг. На двенадцати нижний обрывается стеной, верхний
// уходит за правый край со стрелкой. Разница видна в один момент.
// ============================================================
const AX_MAX = 18;                  // докуда видно ось

const AX_MULT = 3;

const AX_OF = 12;

const AX_HOP = 340;                 // шаг развёртки

const AX_DIVS = [1, 2, 3, 4, 6, 12];

// Минимальная выдержка кадра: без неё немой TTS проматывал бы ось разом.
const MG_MARKS = [2600, 11000, 16000];

const MagnetFilmBody = ({ step }) => {
  const c = CONTENT.s10;
  const t = useT();
  const shown = useFilmSteps(step, MG_MARKS);
  const [upto, setUpto] = useState(0);
  const timersRef = useRef([]);
  const playedRef = useRef(false);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Одна развёртка на весь экран: идём по числам, оба ряда заполняются вместе.
  useEffect(() => {
    if (shown < 1 || playedRef.current) return;
    playedRef.current = true;
    for (let n = 1; n <= AX_MAX; n += 1) {
      timersRef.current.push(setTimeout(() => setUpto(n), 200 + (n - 1) * AX_HOP));
    }
  }, [shown]);

  // Кадры 2 и 3 не ждут развёртку: если ребёнок дошёл до них, ось доводится.
  useEffect(() => {
    if (shown >= 2 && upto < AX_MAX) {
      const id = setTimeout(() => setUpto(AX_MAX), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [shown, upto]);

  const nums = Array.from({ length: AX_MAX }).map((_, i) => i + 1);
  const at = (n) => `${(n / (AX_MAX + 1)) * 100}%`;
  const wallOn = upto >= AX_OF + 1;
  const endOn = upto >= AX_MAX;

  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>

      <div className="frame fade-up delay-1" style={{ padding: 'clamp(11px, 1.8vw, 16px)' }}>
        <div className="ax-legend">
          <span className="ax-lg ax-lg-a"><i/>{t(c.cap_mult)}</span>
          <span className="ax-lg ax-lg-b"><i/>{t(c.cap_div)}</span>
        </div>

        <div className="ax-box">
          {/* СВЕРХУ: кратные трёх */}
          {nums.filter((n) => n % AX_MULT === 0).map((n) => (
            <span key={`m${n}`} className={'ax-dot ax-dot-a' + (n <= upto ? ' ax-on' : '')} style={{ left: at(n) }}>{n}</span>
          ))}

          {/* ОСЬ с засечками */}
          <div className="ax-line"/>
          {nums.map((n) => (
            <span key={`t${n}`} className={'ax-tick' + (n <= upto ? ' ax-on' : '')} style={{ left: at(n) }}/>
          ))}

          {/* СНИЗУ: делители двенадцати */}
          {AX_DIVS.map((n) => (
            <span key={`d${n}`} className={'ax-dot ax-dot-b' + (n <= upto ? ' ax-on' : '')} style={{ left: at(n) }}>{n}</span>
          ))}

          {/* стена сразу за двенадцатью — только для нижнего ряда */}
          <span className={'ax-wall' + (wallOn ? ' ax-on' : '')} style={{ left: at(AX_OF + 0.5) }}/>

          {/* верхний ряд уходит за правый край */}
          <span className={'ax-more' + (endOn ? ' ax-on' : '')}>&#8230;<i/></span>
        </div>

        <p className={'ax-cap ax-cap-a' + (endOn ? ' ax-on' : '')}>{t(c.cap_a_done)}</p>
        <p className={'ax-cap ax-cap-b' + (wallOn ? ' ax-on' : '')}>{t(c.cap_b_done)}</p>
      </div>

      <MethodCard title={CONTENT.s_methods.m3_title} steps={CONTENT.s_methods.m3_steps}
        note={c.metro} active={shown >= 1 ? 0 : -1}/>

      {shown >= 3 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.final)}</p>
        </div>
      )}
      {shown >= 3 && <NowYou node={c.now_you}/>}
    </div>
  );
};

// s10 — karralar cheksiz, bo'luvchilar sanoqli. Ekran 7: bitta o'q, ikkala
// qator bir vaqtda to'ladi.
const Screen10 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <MagnetFilmBody step={step}/>}/>
);

// ---- Обёртки экранов v4 (порядок совпадает с SCREEN_META) ----

// Хук и итог — типовые экраны общего слоя. Урок даёт им свой контент и СВОИ
// сцены: спортзал турнира на входе и тот же зал с ответом на выходе.
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<GymBg/>}/>
);

const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);

const ScreenSolve = (props) => <SolveTogether {...props} totalScreens={TOTAL_SCREENS}/>;

const ScreenRoles = (props) => <RolesPractice {...props} totalScreens={TOTAL_SCREENS}/>;

const ScreenCheck = (props) => <CheckPractice {...props} totalScreens={TOTAL_SCREENS}/>;

const ScreenError = (props) => <FindError {...props} totalScreens={TOTAL_SCREENS}/>;

const ScreenGrid = (props) => <GridTask {...props} totalScreens={TOTAL_SCREENS}/>;

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_HIST} anim={<AnimStars/>} text={CONTENT.s6.fact}/>}/>
);

// Итог: общая рамка (баннер, сцена, «Главное»), дальше карточки этого урока —
// два прочтения одного примера и памятка трёх способов.
const Screen14 = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14} sceneNode={<FinalScene/>}
    cards={<SummaryCards/>}/>
);

const SummaryCards = () => {
  const t = useT();
  const m = CONTENT.s_methods;
  return (
    <>
      {/* Карточка «два прочтения одного примера» СНЯТА (решение методиста
          2026-08-19): она занимала около сотни пикселей, и итог уходил в скролл
          на невысоких окнах (замер: 1366x700 — 38 px скролла). Сама мысль
          осталась на экране: она в карточке «Главное» и в памятке способов.
          Узлы `read_label`, `read_a`, `read_b` в контенте не удалены. */}
      <div className="frame sm-card">
        <p className="sm-card-h">{t(m.memo_title)}</p>
        <div className="mm-grid">
          {[[m.short_1, m.memo_1], [m.short_2, m.memo_2], [m.short_3, m.memo_3]].map((row, i) => (
            <span className="mm-row" key={i}>
              <span className="mm-q">{t(row[0])}</span>
              <span className="mm-a">{t(row[1])}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

// Экран 11 — два круга второго способа на одном экране: 18 с подсказками,
// затем 20 без них. Переход между кругами перехватывает `onNext`, поэтому
// счётчик экранов не двигается.
const ScreenFindAll = (props) => {
  const [part, setPart] = useState(0);
  // Способ 2 стоит под заданием: этот экран им и решается, а сам способ
  // объяснялся на экране 5 и к практике успевает забыться.
  const aside = (
    <MethodCard title={CONTENT.s_methods.m2_title} steps={CONTENT.s_methods.m2_steps}/>
  );
  return part === 0
    ? (
      <PickDivisors {...props} key="r18" screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} retryMode
        onNext={() => setPart(1)} asideNode={aside}
        whyNode={<WhyCard lines={CONTENT.s9.why} figure={<DivisorChips list={D18} activeSet={[0, 1, 2, 3, 4, 5]}/>}/>}
        factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s9.fact}/>}/>
    )
    : (
      <PickDivisors {...props} key="r20" screenContent={CONTENT.s9b} totalScreens={TOTAL_SCREENS} retryMode
        asideNode={aside}
        whyNode={<WhyCard lines={CONTENT.s9b.why}/>}/>
    );
};

// ============================================================
// CSS УРОКА
// Базовые правила класса лежат в BASE_STYLES общего слоя. Здесь — только то,
// что принадлежит этому уроку: сцены и экраны, которых нет у других.
// ВНИМАНИЕ: строка шаблонная, обратная кавычка и обратный слэш внутри неё
// (даже в комментарии) рвут файл и дают белый экран. Проверка стоит первой
// в scripts/grade6-dars01-smoke.mjs.
//
// ДОЛГ: правила сцен урока 1 (rs, ax, pr, tl, rc, sv, fe, gr, an) пока ещё
// лежат в BASE_STYLES — их вынесет сюда тот, кто первым соберёт второй урок на
// общем слое: тогда станет видно, что из них действительно общее.
// ============================================================
const LESSON_STYLES = `
/* ЭКРАН 03 — фильм «деление на три части». Печенья НЕ появляются на новых
   местах, они туда переезжают: transform + transition, задержка по столбцу. */
.sf-box { position: relative; width: 100%; }
.sf-u { position: absolute; left: 0; top: 0; display: block; transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.sf-frame { position: absolute; border: 1.5px dashed rgba(31, 122, 77, 0.55); border-radius: 12px; background: rgba(227, 240, 232, 0.45); animation: fade-in-up 440ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.sf-lab { position: absolute; font-size: 18px; font-weight: 700; color: #1F7A4D; animation: fade-in-up 440ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
/* Сцена финала: во всю ширину карточек, картинка заливает рамку без полей. */

.fin-bg { display: block; width: 100%; height: auto; }
.fin-team { animation: finIn 460ms cubic-bezier(0.22, 0.61, 0.36, 1) both; transform-box: fill-box; transform-origin: 50% 100%; }
@media (prefers-reduced-motion: reduce) {
  .fin-team { animation: none; }
}
.pn-row { display: flex; flex-direction: column; gap: 10px; background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 100%); border-radius: 14px; padding: clamp(11px, 2vw, 15px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.pn-lead { display: flex; align-items: center; gap: 10px; margin: 0; font-weight: 600; }
.pn-num { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #FFE8E1; color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
.pn-opts { display: flex; gap: 9px; }
/* To'rtala variant BIR XIL och sariq: rang javobga ishora bermaydi,
   ekran esa oq-oqdan chiqib, jonli ko'rinadi. */
.pn-opt { flex: 1; padding: clamp(11px, 2vw, 14px) clamp(8px, 1.6vw, 14px); font-size: clamp(14px, 2.6vw, 16px); font-weight: 600; text-align: center; background: #FBF3D6; color: #0E0E10; border: 2px solid rgba(216, 169, 58, 0.35); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pn-opt:hover:not(:disabled) { background: #F9EDC4; border-color: #D8A93A; }
.pn-sel { border-color: #D8A93A; background: #F7E7B4; transform: translateY(-2px); box-shadow: 0 10px 22px -6px rgba(180, 138, 30, 0.45); }
.pn-right { font-weight: 700; border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.4); }
/* ===== ЭКРАН 06: 12 плиток перестраиваются по рядам (rs = rows slider) =====
   Перенесено из утверждённого макета artifacts/grade6-dars01-design.
   Плитка НЕ появляется на новом месте — она туда переезжает: transform со
   стаггером 30 ms. Позиции считаются в offsetWidth (layout px), а НЕ через
   getBoundingClientRect: на телефоне урок масштабируется свойством zoom, и
   rect вернул бы уже умноженные пиксели, а translate умножил бы их второй раз. */
.rs-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.rs-hint { font-size: 15px; color: #494550; background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 0 8px 8px 0; padding: 3px 10px; transition: opacity 440ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-pulse { animation: rs-tip 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) 5; }
.rs-gone { opacity: 0; pointer-events: none; }
@keyframes rs-tip { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(216, 169, 58, 0); } 50% { box-shadow: inset 0 0 0 2px rgba(216, 169, 58, 0.95); } }
.rs-ctl { position: relative; height: 44px; margin-top: 10px; display: flex; align-items: center; gap: 14px; }
.rs-over { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; white-space: nowrap; }
.rs-slider { position: relative; flex: 1; height: 44px; min-width: 150px; touch-action: none; outline: none; cursor: pointer; }
.rs-track { position: absolute; left: 0; right: 0; top: 19px; height: 6px; border-radius: 3px; background: #e9e3d9; }
.rs-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 3px; background: #FFE8E1; transition: width 180ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-tick { position: absolute; top: 16px; width: 2px; height: 12px; border-radius: 1px; background: #e9e3d9; transform: translateX(-1px); }
.rs-handle { position: absolute; top: 0; width: 44px; height: 44px; margin-left: -22px; display: grid; place-items: center; transition: left 180ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-knob { width: 26px; height: 26px; border-radius: 50%; background: #FFFFFF; border: 2px solid #FF4F28; box-shadow: 0 2px 6px -1px rgba(58, 53, 48, 0.25); transition: transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1), background-color 180ms linear; }
.rs-slider:focus-visible .rs-knob { box-shadow: 0 0 0 4px #FFE8E1; }
.rs-grab .rs-knob { background: #FF4F28; transform: scale(1.12); }
.rs-val { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; color: #0E0E10; width: 28px; text-align: right; line-height: 1; }
.rs-dots { display: flex; gap: 8px; align-items: center; height: 8px; margin-top: 9px; }
.rs-dot { width: 8px; height: 8px; border-radius: 50%; background: #e9e3d9; transition: background-color 440ms linear; }
.rs-dot-ok { background: #1F7A4D; }
.rs-dot-no { background: #FF4F28; }
.rs-scene { position: relative; height: 230px; margin-top: 10px; }
/* Участник в строю — фигурка с лицом (методист 2026-08-14). Раньше тут стоял
   кружок «чтобы не превратился в кашу при сжатии»; методист снял это ограничение:
   один и тот же участник обязан выглядеть одинаково на всех экранах.
   Цвет футболки даёт сам компонент Unit по индексу, CSS его больше не красит. */
.rs-tile { position: absolute; left: 0; top: 0; width: 44px; height: 44px; transform-origin: 0 0; will-change: transform; transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-tile svg { width: 100%; height: 100%; }
.rs-zone { position: absolute; left: 50%; bottom: 0; width: 216px; height: 44px; margin-left: -108px; border: 2px dashed #FF4F28; border-radius: 12px; background: #FFE8E1; transform: translateY(18px); opacity: 0; pointer-events: none; transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 180ms linear; }
.rs-zone-on { transform: translateY(0); opacity: 1; }
.rs-zone-lab { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #FF4F28; }
.rs-out { min-height: 38px; margin-top: 5px; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.rs-formula { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3.4vw, 26px); line-height: 28px; font-weight: 700; color: #0E0E10; opacity: 0; transition: opacity 440ms linear; }
.rs-note { font-size: 15px; line-height: 19px; opacity: 0; transition: opacity 440ms linear; align-self: flex-start; border-radius: 8px; padding: 2px 6px; margin-left: -6px; }
.rs-note-ok { color: #1F7A4D; background: #E3F0E8; }
.rs-note-no { color: #FF4F28; background: #FFE8E1; }
.rs-on { opacity: 1; }
.rs-hand { position: absolute; left: 0; top: 0; width: 0; height: 0; opacity: 0; pointer-events: none; z-index: 5; }
@media (max-width: 639.98px) {
  .rs-ctl { flex-wrap: wrap; height: auto; row-gap: 4px; }
  .rs-over { width: 100%; }
  .rs-slider { flex: 1 1 100%; order: 3; min-width: 0; }
  .rs-val { order: 2; text-align: left; }
  .rs-hint { white-space: normal; }
}
/* ===== ЭКРАН 7: ОДНА ОБЩАЯ ОСЬ (ax = axis) =====
   Сверху кратные, снизу делители, оба ряда заполняются одновременно.
   Нижний обрывается стеной за 12, верхний уходит за правый край. */
.ax-legend { display: flex; gap: clamp(12px, 2.4vw, 22px); flex-wrap: wrap; margin-bottom: clamp(8px, 1.4vw, 12px); }
.ax-lg { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; font-weight: 700; }
.ax-lg i { width: 11px; height: 11px; border-radius: 50%; }
.ax-lg-a { color: #FF4F28; }
.ax-lg-a i { background: #FF4F28; }
.ax-lg-b { color: #1F7A4D; }
.ax-lg-b i { background: #1F7A4D; }
.ax-box { position: relative; height: clamp(96px, 15vh, 116px); }
.ax-line { position: absolute; left: 0; right: 0; top: 50%; height: 2px; margin-top: -1px; background: #e9e3d9; border-radius: 1px; }
.ax-tick { position: absolute; top: 50%; width: 2px; height: 9px; margin: -4px 0 0 -1px; background: #E4DBCA; border-radius: 1px; transition: background-color 300ms linear; }
.ax-tick.ax-on { background: #C9BFAE; }
/* Метка: число внутри кружка. Сверху кратные, снизу делители. */
.ax-dot { position: absolute; display: grid; place-items: center; width: clamp(22px, 3.4vw, 28px); height: clamp(22px, 3.4vw, 28px); margin-left: calc(clamp(22px, 3.4vw, 28px) / -2); border-radius: 50%; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.7vw, 14px); font-weight: 700; opacity: 0; transform: scale(0.6); transition: opacity 260ms linear, transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.ax-dot.ax-on { opacity: 1; transform: none; }
.ax-dot-a { bottom: calc(50% + 12px); background: #FFE8E1; color: #FF4F28; }
.ax-dot-b { top: calc(50% + 12px); background: #E3F0E8; color: #1F7A4D; }
/* Стена сразу за двенадцатью — только для нижнего ряда. */
.ax-wall { position: absolute; top: 50%; width: 4px; height: 40px; margin-left: -2px; border-radius: 2px; background: #494550; opacity: 0; transition: opacity 300ms linear; }
/* Верхний ряд уходит за правый край. */
.ax-more { position: absolute; right: -2px; bottom: calc(50% + 12px); display: flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #FF4F28; opacity: 0; transition: opacity 300ms linear; }
.ax-more i { display: block; width: 9px; height: 9px; border-top: 2px solid #FF4F28; border-right: 2px solid #FF4F28; transform: rotate(45deg); }
.ax-on.ax-wall, .ax-on.ax-more { opacity: 1; }
.ax-cap { min-height: 18px; margin: 2px 0 0; font-size: 14px; line-height: 18px; opacity: 0; transition: opacity 440ms linear; }
.ax-cap-a { color: #FF4F28; }
.ax-cap-b { color: #1F7A4D; }
.ax-cap.ax-on { opacity: 1; }
@media (max-width: 639.98px) {
  .ax-legend { gap: 10px; margin-bottom: 7px; }
  .ax-lg { font-size: 10px; letter-spacing: 0.1em; }
  .ax-box { height: 88px; }
}
/* ===== ЭКРАН 09: пары делителей идут навстречу (pr = pairs) =====
   Два числа выезжают с краёв, между ними растёт связь, потом пара СБЛИЖАЕТСЯ.
   У 3 и 4 они встречаются — дальше искать нечего. Экран стал ФИЛЬМОМ: ряд
   кнопок и кисть убраны. Из макета artifacts/grade6-dars01-design. */
.pr-body { position: relative; }
.pr-scene { position: relative; height: 120px; margin-top: 10px; transition: height 620ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.pr-slot { position: absolute; top: 32px; width: 56px; height: 56px; border-radius: 12px; border: 2px dashed #e9e3d9; transition: background-color 180ms linear, border-color 180ms linear; }
.pr-slot-l { left: 8px; }
.pr-slot-r { right: 8px; }
.pr-layer { position: absolute; inset: 0; pointer-events: none; }
.pr-tile { position: absolute; left: 0; top: 0; width: 56px; height: 56px; transform-origin: 0 0; will-change: transform; }
.pr-tile-in { width: 56px; height: 56px; border-radius: 12px; background: #7ECBE6; border: 2px solid #019ACB; display: grid; place-items: center; font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 700; color: #0E0E10; }
.pr-link { position: absolute; height: 2px; background: #019ACB; border-radius: 1px; transform-origin: 0 50%; opacity: 0; transition: opacity 180ms linear; }
.pr-link-on { opacity: 1; }
.pr-prod { position: absolute; font-family: 'JetBrains Mono', monospace; font-size: clamp(19px, 3vw, 24px); font-weight: 700; color: #0E0E10; white-space: nowrap; transform: translateX(-50%); opacity: 0; transition: opacity 440ms linear; }
.pr-bar { position: absolute; width: 3px; border-radius: 2px; background: #1F7A4D; transform: scaleY(0); transform-origin: 50% 50%; transition: transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.pr-bar-on { transform: scaleY(1); }
.pr-note { min-height: 19px; margin-top: 4px; font-size: 15px; line-height: 19px; color: #FF4F28; opacity: 0; transition: opacity 440ms linear; }
.pr-note-ok { color: #1F7A4D; }
.pr-note-wait { color: #8A8883; }
.pr-on { opacity: 1; }
.pr-over { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; margin-top: 8px; }
.pr-row { position: relative; height: 44px; margin-top: 12px; }
.pr-frame { position: absolute; top: -6px; height: 56px; border: 1px solid #1F7A4D; border-radius: 12px; opacity: 0; transition: opacity 440ms linear; }
@media (max-width: 639.98px) {
  .pr-scene { height: 108px; }
}
/* СТРОГО ПОСЛЕ медиазапроса: вес одинаковый (0,1,0), выигрывает последнее
   правило. Объявленное выше, схлопывание проиграло бы высоте 108px на телефоне. */
.pr-scene-done { height: 0; }
/* Вес указан явно: правило .pr-on объявлено ВЫШЕ и при равном весе победило бы
   оно. Порядок правил в этом файле уже съедал видимость четыре раза. */
.pr-arcs.pr-on, .pr-eqs.pr-on { opacity: 1; }
.pr-arcs { height: 46px; margin-top: 2px; opacity: 0; transition: opacity 440ms linear; }
.pr-arcs svg { display: block; width: 100%; height: 46px; overflow: visible; }
.pr-arc { fill: none; stroke: #1F7A4D; stroke-width: 2; stroke-linecap: round; opacity: 0.75; stroke-dasharray: 300; stroke-dashoffset: 300; animation: prArc 620ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }
@media (prefers-reduced-motion: reduce) {
  .pr-arc { animation: none; stroke-dashoffset: 0; }
}
.pr-eqs { margin: 0; text-align: center; font-size: clamp(15px, 2.4vw, 18px); font-weight: 700; color: #1F7A4D; opacity: 0; transition: opacity 440ms linear; }
/* Тот же приём для верхней прямой экрана 7. Объявлено ПОСЛЕ медиазапроса,
   иначе высота 92px из него перебила бы схлопывание. */
.mg-zone-done { height: 0 !important; overflow: hidden; }
/* ===== ЭКРАН 07: «показ, потом сам» (tl = tool) =====
   Плитки, зона остатка, формула и разбор берутся у экрана 06 (.rs-*):
   один визуальный движок, а не вторая копия. Своё тут только управление,
   баннер очереди и две кнопки перехода из показа в самостоятельную работу. */
.tl-ctl { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; }
.tl-grp { display: flex; flex-direction: column; gap: 4px; }
.tl-step { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; white-space: nowrap; }
.tl-divs { display: flex; gap: 4px; flex-wrap: wrap; }
.tl-div { width: 42px; height: 44px; border-radius: 12px; border: 1px solid #e9e3d9; background: #FFFFFF; color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; line-height: 1; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-div-sel { background: #FF4F28; color: #FFFFFF; }
.tl-div:disabled { color: #A7A6A2; background: #faf7f1; cursor: default; }
.tl-go { height: 44px; padding: 0 18px; border-radius: 12px; border: 1px solid #e9e3d9; background: #FFFFFF; color: #FF4F28; font-family: 'Manrope', system-ui, sans-serif; font-size: 17px; font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-go:disabled { color: #A7A6A2; background: #faf7f1; cursor: default; }
.tl-scene { height: 156px; border: 1px solid transparent; border-radius: 12px; overflow: hidden; transition: border-color 440ms linear; }
.tl-scene-ok { border-color: #1F7A4D; }
.tl-scene-no { border-color: #FF4F28; }
.tl-empty { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 0 20px; font-size: 15px; color: #8A8883; transition: opacity 180ms linear; }
.tl-empty-off { opacity: 0; }
.rs-shape { font-size: 13px; line-height: 16px; color: #8A8883; opacity: 0; transition: opacity 440ms linear; }
/* Вес выше, чем у rs-on: иначе правило rs-shape объявлено позже, вес тот же,
   и оно держит прозрачность нулём. Та же ловушка, что с pr-scene-done.
   ОБРАТНЫХ КАВЫЧЕК ЗДЕСЬ БЫТЬ НЕ МОЖЕТ: STYLES это шаблонная строка. */
.rs-shape.rs-on { opacity: 1; }
.tl-task { font-size: 13px; line-height: 16px; margin-top: -2px; }
/* ===== ЭКРАН 2: вспомним (rc = recall) ===== */
.rc-eq { font-size: clamp(22px, 3.8vw, 28px); font-weight: 700; color: #0E0E10; }
/* Три команды по четыре. Каждая в своей пунктирной рамке с числом справа —
   ровно так же, как на экране 3, чтобы ребёнок узнал ту же картинку.
   Цвет футболки внутри команды один: команда читается цветом, а не только
   рамкой. Фигурку даёт компонент Unit, CSS её не красит.
   Команды стоят В РЯД, а не столбиком: столбиком экран перерастал фолд на
   65 пикселей, а в ряд он даже ниже прежней сетки из двенадцати клеток. */
.rc-teams { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px, 1.2vw, 10px); }
.rc-team { display: flex; align-items: center; gap: clamp(2px, 0.6vw, 4px); padding: 4px clamp(5px, 1vw, 8px); border: 1px dashed #D8D2C6; border-radius: 12px; }
.rc-team-n { margin-left: 4px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #1F7A4D; }
/* ===== ЭКРАН 6: решаем вместе (sv = solve) =====
   Неудачный шаг остаётся в записи и подкрашен: ребёнок должен узнавать отказ. */
.sv-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding: 5px 0; opacity: 0; transform: translateY(6px); transition: opacity 440ms linear, transform 440ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.sv-row.sv-on { opacity: 1; transform: translateY(0); }
.sv-eq { font-size: clamp(17px, 2.8vw, 21px); font-weight: 700; color: #0E0E10; }
.sv-tail { font-size: 15px; color: #1F7A4D; }
.sv-fail .sv-tail { color: #FF4F28; }
.sv-stop .sv-tail { color: #494550; font-weight: 700; }
.sv-answer { margin: 12px 0 0; padding-top: 10px; border-top: 1px solid #e9e3d9; font-size: clamp(16px, 2.6vw, 19px); font-weight: 700; color: #1F7A4D; }

.sv-wrong { margin: 10px 0 0; font-size: 15px; line-height: 19px; color: #FF4F28; }
.pn-ctx { margin: 0 0 8px; text-align: center; font-size: 14px; color: #8A8883; }
/* Листок из тетради: линейка полей слева и линованный фон. Чужое решение
   должно выглядеть как чужая запись, иначе экран «найди ошибку» не отличается
   от обычного вопроса с числами. */
/* Экран «проверь чужое решение» НА ТЕЛЕФОНЕ. По-узбекски столбик из листка,
   вопроса, четырёх вариантов и карточки способа не влезал: содержимое уходило
   под нижнюю панель на 7px. Срезаны только отступы рамки и зазор перед
   вариантами — сам листок и его линейки не тронуты. */
@media (max-width: 639.98px) {
  .d1-err-frame { padding: 9px !important; }
  .d1-err-q { margin: 8px 0 8px !important; }
}
.fe-sheet { position: relative; padding: 12px 14px 12px 26px; border-radius: 10px; background: #FEFCF7; border: 1px solid #EAE3D5; background-image: repeating-linear-gradient(to bottom, transparent, transparent 43px, #EEF3F7 43px, #EEF3F7 44px); }
.fe-sheet::before { content: ''; position: absolute; left: 15px; top: 6px; bottom: 6px; width: 1px; background: #F3C9C2; }
.fe-list { display: flex; gap: 8px; flex-wrap: wrap; }
.fe-chip { min-width: 44px; height: 44px; padding: 0 10px; border-radius: 12px; border: 1px solid #e9e3d9; background: #faf7f1; display: grid; place-items: center; font-size: 21px; font-weight: 700; color: #0E0E10; }
/* ===== ЭКРАН 13: сетка фотографий (gr = grid) ===== */
.gr-wrap { display: flex; flex-direction: column; align-items: stretch; gap: 8px; }
/* Стена школьной галереи: снимки висят на ней, а не лежат на белом поле. */
.gr-wall { position: relative; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #E2D8C6; padding: clamp(10px, 1.8vw, 16px) 0; }
.gr-wall-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.gr-pin { position: absolute; top: 7px; width: 7px; height: 7px; border-radius: 50%; background: #C9BFAE; box-shadow: 0 1px 2px rgba(58,53,48,0.3); }
.gr-pin-l { left: 12px; }
.gr-pin-r { right: 12px; }
.gr-box { position: relative; z-index: 1; width: 100%; height: clamp(150px, 26vh, 236px); display: grid; place-items: center; }
.gr-grid { display: grid; justify-content: center; }
/* Снимок: белая рамка и цветная картинка внутри, как отпечаток на стене. */
.gr-ph { position: relative; border-radius: 2px; background: #FFFFFF; box-shadow: 0 1px 2px rgba(58,53,48,0.22); box-sizing: border-box; padding: 1px; transition: width 440ms linear, height 440ms linear; }
.gr-ph i { display: block; width: 100%; height: 100%; border-radius: 1px; }
.gr-cap { margin: 4px 0 0; font-size: 14px; color: #8A8883; }
/* Кнопки с одной цифрой растягивались на полтораста пикселей: во flex-строке
   они тянулись по высоте контейнера. Прижимаем к содержимому. */
.gr-opts .option { align-self: flex-start; padding: 11px 12px !important; }
.gp-row { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 0 0 10px; }
.gp-chip { display: inline-flex; align-items: center; gap: 3px; padding: 5px 9px; border-radius: 9px; background: #E3F0E8; color: #1F7A4D; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; animation: gpIn 300ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.gp-chip i { font-style: normal; opacity: 0.55; }
.gp-square { background: #FFE8E1; color: #FF4F28; }
/* ===== ЯКОРЬ: делители до числа, кратные после (an = anchor) ===== */
.an-box { border: 1px solid #e9e3d9; border-radius: 14px; background: #FFFFFF; padding: clamp(11px, 2vw, 15px); }
.an-line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.an-left { flex: 1; min-width: 130px; text-align: right; font-size: 14px; line-height: 18px; color: #1F7A4D; }
.an-mid { flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: #FFE8E1; color: #FF4F28; font-size: 19px; font-weight: 700; }
.an-right { flex: 1; min-width: 130px; font-size: 14px; line-height: 18px; color: #019ACB; }
.an-metro { margin: 10px 0 0; padding-top: 9px; border-top: 1px solid #e9e3d9; font-size: 14px; line-height: 18px; color: #8A8883; }
/* ===== МНОЖИТЕЛЬ НАД КРАТНЫМ ===== */
.mg-mul { position: absolute; transform: translateX(-50%); font-size: 12px; font-weight: 700; color: #019ACB; }
@media (max-width: 639.98px) {
  .an-left, .an-right { text-align: left; min-width: 0; flex-basis: 100%; }
}
.tl-num { display: grid; place-items: center; min-width: 72px; height: 44px; padding: 0 12px; border-radius: 12px; border: 1px solid #e9e3d9; background: #faf7f1; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; color: #0E0E10; }
.tl-banner { display: flex; align-items: center; gap: 8px; font-size: 15px; line-height: 19px; font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 5px 12px; }
.tl-banner-play { color: #1F7A4D; background: #E3F0E8; }
.tl-acts { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.tl-replay { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #e9e3d9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: 17px; font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-next { height: 40px; padding: 0 20px; border-radius: 12px; border: 1px solid #FF4F28; background: #FF4F28; color: #FFFFFF; font-family: 'Manrope', system-ui, sans-serif; font-size: 17px; font-weight: 700; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-replay:disabled, .tl-next:disabled { color: #A7A6A2; background: #faf7f1; border-color: #e9e3d9; cursor: default; }
@media (max-width: 639.98px) {
  /* Управление занимало 262 пикселя из 708 доступных: метка стояла НАД каждым
     контролом и блок разъезжался на четыре ряда. Метку ставим рядом, кнопки
     уменьшаем так, чтобы восемь делителей влезли в одну строку. */
  .tl-ctl { gap: 7px; }
  .tl-grp { flex-direction: row; align-items: center; gap: 8px; }
  .tl-grp:nth-child(2) { flex-direction: column; align-items: flex-start; gap: 3px; }
  .tl-step { font-size: 10px; letter-spacing: 0.1em; }
  .tl-num { width: auto; min-width: 54px; height: 38px; padding: 0 10px; font-size: 20px; }
  .tl-divs { gap: 3px; }
  .tl-div { width: 36px; height: 38px; font-size: 19px; }
  .tl-go { width: auto; height: 38px; padding: 0 16px; font-size: 15px; }
  .tl-grp:nth-child(3) .tl-step { display: none; }
  /* Строка задания повторяет баннер очереди — на телефоне места ей нет. */
  .tl-task { display: none; }
  /* Высоту .tl-scene НЕ трогаем: она обязана совпадать с константой TL_H в JS,
     иначе плитки считаются по одной высоте, а рисуются в другой. */
  .tl-banner { padding: 5px 10px; font-size: 14px; line-height: 18px; }
  .tl-replay, .tl-next { flex: 1; }
}
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (platform_contract §1)
// ============================================================
export default function DivisibilityLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  // LMS `lang` ni uzatadi. Lokal preview'da (LessonPage `<Component/>` ni propsiz
  // chaqiradi) u undefined bo'ladi — o'shanda RU/UZ tugmasi chiqadi va darsni ikkala
  // tilda prokliklab ko'rish mumkin. Naqsh grade3/Dars01 dan (isPreview + previewLang).
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || (tri(lang, 'Ученик', "O'quvchi", 'Student'));
  // navLock: false — metodist qarori 2026-08-13: 1-darsda slayd o'tishi
  // qulflanmaydi. Boshqa darslar bu qiymatni uzatmaydi, ularda qulf o'z joyida.
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm', navLock: false });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  // PREVIEW_START nolga teng, agar URL da `?screen=` bo'lmasa — LMS da shunday.
  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const nextArr = [...prev]; nextArr[screenIdx] = data; return nextArr; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    };
    safeOnFinished(payload);
  }, [answers, safeOnFinished]);

  // Navbat almashadi: tushuntirish -> darhol mashq. SCREEN_META bilan BIR XIL
  // tartibda turishi SHART: baholanadigan ekranlar o'rni bo'yicha topiladi.
  // 15 ekran, 3-sinf 1-darsining karkasi: 1 xuk / 2-7 tushuntirish / 8 qoida /
  // 9-13 mashq / 14 yakuniy test / 15 xulosa. SCREEN_META bilan BIR XIL tartib.
  const screens = [ScreenHook, ScreenRecall, Screen1, ScreenTool, Screen6, ScreenSolve, Screen10, Screen3,
    ScreenRoles, ScreenCheck, ScreenFindAll, ScreenError, ScreenGrid, ScreenFinal, Screen14];
  const CurrentScreen = screens[current];

  // Navigatsiya qulfi — telefonda ikki marta tegib ketilsa bitta ekran tashlab
  // o'tilardi (setCurrent asinxron, ikkala chaqiruv ham o'tib ketardi).
  // 350 ms — tasodifiy ikkinchi tegishni yutadi, haqiqiy bosishga xalaqit bermaydi.
  const navLockRef = useRef(0);
  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { if (navGuard()) setCurrent(s => Math.max(s - 1, 0)); };
  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root grade6-dars01">
        {isPreview && (
          /* Переключатель берётся из общего слоя (класс `g6-lang-switch`), как в
             остальных сорока пяти уроках: свой inline-стиль держал его на 10-й
             точке и накрывал кнопку звука урока. */
          <div className="g6-lang-switch">
            {['ru', 'uz', 'en'].map(l => (
              <button key={l} className={'btn-ghost' + (previewLang === l ? ' is-on' : '')}
                onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

// СОВМЕСТИМОСТЬ: уроки 2-7 импортируют обвязку ИЗ ЭТОГО ФАЙЛА (исторически он
// был единственным её держателем). Обвязка переехала в ./screens.jsx, а здесь
// остаётся сквозной проброс, чтобы шесть работающих уроков не пришлось трогать
// одним движением. Новый урок импортирует ИЗ screens.jsx напрямую.
export {
  T,
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  QuestionScreen,
  RevealScreen,
  PickDivisors,
  DragMatch,
  Classify,
  WhyCard,
  FactCard,
  Floaters,
  useIntroStages,
  Frac,
  mt,
  STYLES,
};
