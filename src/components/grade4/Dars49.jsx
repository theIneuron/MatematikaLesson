// ============================================================================
// 4-SINF · Dars 49 · Mulohazalar va hukmlar
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 60-63-bet
// "Mulohazalar":
//   60-bet — ta'rif dosloven: "To'g'ri yoki noto'g'ri ekanligi haqida aytish
//     mumkin bo'lgan darak gap mulohaza deb ataladi";
//   61-bet — rost (R) va yolg'on (Y) belgilashi, (214 > 83) = R yozuvi;
//   60-61-bet ro'yxatlari: Toshkent poytaxti, fevral o'ttiz kun, o'n bir eng
//     kichik ikki xonali son, yanvar o'ttiz bir kun, 56 - 48 = 18, 569 < 612,
//     istalgan kvadrat to'g'ri to'rtburchak, 1 h = 60 min, 1 h = 100 min,
//     k harfi unli, qo'y yovvoyi hayvon, 657 + 203 = 650 + 203;
//   62-bet — "... ekani yolg'on" shaklidagi mulohazalar.
// Syujet: boshqaruv markazining QAROR MODULI (SYUJET_4SINF.md, 6-blok).
// 48-darsdan ko'prik: maydon yopildi, endi xabarlar saralanadi.
//
// YADRO. Mulohaza — rost yoki yolg'on deb baholash mumkin bo'lgan darak gap.
// Buyruq, savol va his-tuyg'u gaplari mulohaza emas. Sonli mulohazani
// tekshirish uchun hisoblash kifoya.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, RecordRow, RevealScreen,
  RuleRows, StepList, SummaryScreen, T, TheoryLessonRoot, assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'logic-4-49-v2',
  slug: 'dars49-mulohazalar-va-hukmlar',
  lessonTitle: {
    uz: '49-dars. Mulohazalar va hukmlar',
    ru: 'Урок 49. Высказывания и суждения',
    en: 'Lesson 49. Mathematical statements and judgements',
  },
  skillTags: ['statement_meaning', 'true_false_verdict', 'numeric_check', 'nested_statement', 'non_statement'],
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
    eyebrow: { uz: 'Qaror moduli', ru: 'Модуль решений', en: 'The decision module' },
    title: {
      uz: 'Modul xabarni qabul qilmadi',
      ru: 'Модуль не принял сообщение',
      en: 'The module rejected the message',
    },
    question: {
      uz: 'Nega bu xabar qabul qilinmadi?',
      ru: 'Почему это сообщение не приняли?',
      en: 'Why was this message not accepted?',
    },
    options: [
      { uz: "Unga rost yoki yolg'on deb bo'lmaydi", ru: 'О нём нельзя сказать, истинно оно или ложно', en: 'One cannot say whether it is true or false' },
      { uz: 'Gap juda qisqa', ru: 'Фраза слишком короткая', en: 'The phrase is too short' },
      { uz: 'Gapda son yo\'q', ru: 'В фразе нет чисел', en: 'The phrase has no numbers' },
      { uz: 'Modul buzilgan', ru: 'Модуль сломан', en: 'The module is broken' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Modul faqat rost yoki yolg'on deb baholanadigan gaplarni qabul qiladi.",
      ru: 'Верно. Модуль принимает только те фразы, о которых можно сказать: истинно или ложно.',
      en: 'Correct. The module accepts only phrases about which one can say true or false.',
    },
    wrong: [
      null,
      {
        uz: "Uzunlik muhim emas. Qisqa gap ham rost yoki yolg'on bo'lishi mumkin.",
        ru: 'Длина не важна. Короткая фраза тоже может быть истинной или ложной.',
        en: 'Length does not matter. A short phrase can be true or false as well.',
      },
      {
        uz: "Son ham shart emas. Toshkent poytaxt degan gapda son yo'q, lekin u rost.",
        ru: 'Числа тоже не обязательны. Во фразе о столице чисел нет, но она истинна.',
        en: 'Numbers are not required either. The phrase about the capital has no numbers, yet it is true.',
      },
      {
        uz: "Modul ishlayapti: u aynan o'z qoidasini bajardi.",
        ru: 'Модуль работает: он в точности выполнил своё правило.',
        en: 'The module works: it followed its own rule exactly.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Yig'uv maydoni yopildi va xabarlar qaror moduliga tushdi.",
          "Modul har xabarga ikkita muhrdan birini bosadi: rost yoki yolg'on.",
          "Bit unga shunday xabar yubordi: eshikni yoping. Modul uni qaytarib berdi.",
          "Nega bu xabar qabul qilinmadi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Сборочная площадка закрыта, и сообщения поступили в модуль решений.',
          'Модуль ставит на каждое сообщение одну из двух печатей: истина или ложь.',
          'Bit отправил такое сообщение: закройте дверь. Модуль вернул его обратно.',
          'Почему это сообщение не приняли? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The assembly yard is closed and the messages reached the decision module.',
          'The module stamps every message with one of two marks: true or false.',
          'Bit sent it this message: close the door. The module sent it back.',
          'Why was this message not accepted? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Mulohaza nima', ru: 'Что такое высказывание', en: 'What a statement is' },
    title: {
      uz: 'Baholash mumkin bo\'lgan gap',
      ru: 'Фраза, которую можно оценить',
      en: 'A phrase that can be judged',
    },
    lead: {
      uz: "To'g'ri yoki noto'g'ri ekanligi haqida aytish mumkin bo'lgan darak gap mulohaza deb ataladi.",
      ru: 'Повествовательное предложение, о котором можно сказать, верно оно или неверно, называют высказыванием.',
      en: 'A declarative sentence about which one can say whether it is right or wrong is called a statement.',
    },
    note: {
      uz: 'Buyruq, savol va his-tuyg\'u gaplari mulohaza bo\'lmaydi.',
      ru: 'Побудительные, вопросительные и восклицательные предложения высказываниями не являются.',
      en: 'Commands, questions and exclamations are not statements.',
    },
    audio: {
      intro: {
        uz: [
          "Modul to'rt xil gapni ko'rib chiqdi.",
          "Eshikni yoping degani buyruq: uni rost yoki yolg'on deb bo'lmaydi.",
          "Nechta kitob bor degani savol, qanday chiroyli degani esa his-tuyg'u gapi.",
          "Fevral o'ttiz kundan iborat degani esa darak gap. Uni baholash mumkin, demak bu mulohaza.",
        ],
        ru: [
          'Модуль рассмотрел четыре разные фразы.',
          'Закройте дверь это приказ: о нём нельзя сказать, истинно оно или ложно.',
          'Сколько книг это вопрос, а как красиво восклицание.',
          'А в феврале тридцать дней это повествование. Его можно оценить, значит это высказывание.',
        ],
        en: [
          'The module looked at four different phrases.',
          'Close the door is a command: one cannot call it true or false.',
          'How many books is a question, and how lovely is an exclamation.',
          'But February has thirty days is a statement of fact. It can be judged, so it is a statement.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Qaysi gap', ru: 'Какая фраза', en: 'Which phrase' },
    title: {
      uz: 'Qaysi biri mulohaza?',
      ru: 'Что из этого высказывание?',
      en: 'Which one is a statement?',
    },
    question: {
      uz: 'Modul qaysi gapni qabul qiladi?',
      ru: 'Какую фразу примет модуль?',
      en: 'Which phrase will the module accept?',
    },
    options: [
      { uz: 'Fevral 30 kundan iborat', ru: 'В феврале 30 дней', en: 'February has 30 days' },
      { uz: 'Daftaringni och', ru: 'Открой тетрадь', en: 'Open your notebook' },
      { uz: 'Nechta kitob bor?', ru: 'Сколько книг?', en: 'How many books are there?' },
      { uz: 'Qanday chiroyli!', ru: 'Как красиво!', en: 'How lovely!' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bu darak gap va uni baholash mumkin: fevralda o'ttiz kun yo'q, demak yolg'on.",
      ru: 'Верно. Это повествование, и его можно оценить: тридцати дней в феврале нет, значит ложь.',
      en: 'Correct. That is a declarative sentence and it can be judged: February has no thirty days, so it is false.',
    },
    wrong: [
      null,
      {
        uz: "Bu buyruq. Buyruqni rost yoki yolg'on deb baholab bo'lmaydi.",
        ru: 'Это приказ. Приказ нельзя оценить как истину или ложь.',
        en: 'That is a command. A command cannot be judged true or false.',
      },
      {
        uz: "Bu savol. Savol javob so'raydi, lekin o'zi hech narsa tasdiqlamaydi.",
        ru: 'Это вопрос. Вопрос просит ответа, но сам ничего не утверждает.',
        en: 'That is a question. A question asks for an answer but asserts nothing itself.',
      },
      {
        uz: "Bu his-tuyg'u gapi. Unda tekshiriladigan tasdiq yo'q.",
        ru: 'Это восклицание. В нём нет утверждения, которое можно проверить.',
        en: 'That is an exclamation. It holds no claim that could be checked.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Qaror moduliga to'rtta gap keldi.",
          "Mulohaza uchun bitta shart bor: gapni rost yoki yolg'on deb baholash mumkin bo'lsin.",
          "Modul qaysi gapni qabul qiladi? Javobni tanlang.",
        ],
        ru: [
          'В модуль решений поступили четыре фразы.',
          'Для высказывания есть одно условие: фразу можно оценить как истину или ложь.',
          'Какую фразу примет модуль? Выбери ответ.',
        ],
        en: [
          'Four phrases reached the decision module.',
          'A statement has one requirement: the phrase can be judged true or false.',
          'Which phrase will the module accept? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Rost va yolg\'on', ru: 'Истина и ложь', en: 'True and false' },
    title: {
      uz: 'Ikki muhr: R va Y',
      ru: 'Две печати: И и Л',
      en: 'Two stamps: T and F',
    },
    lead: {
      uz: "Matematikada to'g'ri mulohaza rost, noto'g'ri mulohaza yolg'on deb ataladi.",
      ru: 'В математике верное высказывание называют истинным, а неверное ложным.',
      en: 'In mathematics a right statement is called true and a wrong one false.',
    },
    note: {
      uz: 'Darslik yozuvi: mulohaza qavs ichida, natijasi esa harf bilan.',
      ru: 'Запись учебника: высказывание в скобках, а вердикт буквой.',
      en: 'The textbook record: the statement in brackets and the verdict as a letter.',
    },
    audio: {
      intro: {
        uz: [
          "Modul har mulohazaga muhr bosadi. To'g'ri bo'lsa rost, noto'g'ri bo'lsa yolg'on.",
          "Ikki yuz o'n to'rt sakson uchdan katta degan mulohaza rost.",
          "Ellik oltidan qirq sakkizni ayirsak o'n sakkiz chiqadi degan mulohaza esa yolg'on.",
          "Darslik buni qavs va harf bilan yozadi: mulohaza qavs ichida, muhr esa yonida.",
        ],
        ru: [
          'Модуль ставит печать на каждое высказывание. Верное считают истиной, неверное ложью.',
          'Высказывание двести четырнадцать больше восьмидесяти трёх истинно.',
          'А высказывание из пятидесяти шести вычесть сорок восемь будет восемнадцать ложно.',
          'Учебник пишет это скобками и буквой: высказывание в скобках, печать рядом.',
        ],
        en: [
          'The module stamps every statement. A right one is true, a wrong one is false.',
          'The statement two hundred and fourteen is greater than eighty three is true.',
          'And the statement fifty six minus forty eight equals eighteen is false.',
          'The textbook writes this with brackets and a letter: the statement in brackets and the stamp beside it.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Muhrni bosing', ru: 'Поставь печать', en: 'Put the stamp' },
    title: {
      uz: 'Qaysi mulohaza yolg\'on?',
      ru: 'Какое высказывание ложно?',
      en: 'Which statement is false?',
    },
    question: {
      uz: 'To\'rt mulohazadan qaysi biri yolg\'on?',
      ru: 'Какое из четырёх высказываний ложно?',
      en: 'Which of the four statements is false?',
    },
    options: [
      { uz: '56 - 48 = 18', ru: '56 - 48 = 18', en: '56 - 48 = 18' },
      { uz: '569 < 612', ru: '569 < 612', en: '569 < 612' },
      { uz: '214 > 83', ru: '214 > 83', en: '214 > 83' },
      { uz: '1 soat = 60 minut', ru: '1 час = 60 минут', en: '1 hour = 60 minutes' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ellik oltidan qirq sakkizni ayirsak sakkiz chiqadi, o'n sakkiz emas.",
      ru: 'Верно. Из пятидесяти шести вычесть сорок восемь будет восемь, а не восемнадцать.',
      en: 'Correct. Fifty six minus forty eight is eight, not eighteen.',
    },
    wrong: [
      null,
      {
        uz: "Bu rost: besh yuz oltmish to'qqiz olti yuz o'n ikkidan kichik.",
        ru: 'Это истина: пятьсот шестьдесят девять меньше шестисот двенадцати.',
        en: 'That is true: five hundred and sixty nine is less than six hundred and twelve.',
      },
      {
        uz: "Bu ham rost: ikki yuz o'n to'rt sakson uchdan katta.",
        ru: 'Это тоже истина: двести четырнадцать больше восьмидесяти трёх.',
        en: 'That is true as well: two hundred and fourteen is greater than eighty three.',
      },
      {
        uz: "Bu vaqt birligining to'g'ri munosabati, demak rost.",
        ru: 'Это верное соотношение единиц времени, значит истина.',
        en: 'That is a correct relation between time units, so it is true.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Modulga to'rtta mulohaza keldi. Uchtasiga rost muhri, bittasiga yolg'on muhri tushadi.",
          "Har birini hisoblab yoki eslab tekshiring.",
          "Qaysi biri yolg'on? Javobni tanlang.",
        ],
        ru: [
          'В модуль поступили четыре высказывания. Трём достанется печать истины, одному ложь.',
          'Проверь каждое вычислением или по памяти.',
          'Какое из них ложно? Выбери ответ.',
        ],
        en: [
          'Four statements reached the module. Three will get the true stamp and one the false stamp.',
          'Check each by calculating or by memory.',
          'Which one is false? Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Dunyo haqida', ru: 'О мире', en: 'About the world' },
    title: {
      uz: 'Mulohaza faqat sonlar haqida emas',
      ru: 'Высказывания не только о числах',
      en: 'Statements are not only about numbers',
    },
    lead: {
      uz: "Atrofdagi narsalar haqidagi darak gaplar ham rost yoki yolg'on bo'ladi.",
      ru: 'Повествовательные фразы об окружающем мире тоже бывают истинными или ложными.',
      en: 'Declarative phrases about the world around are true or false as well.',
    },
    note: {
      uz: 'Tekshirish usuli boshqacha: hisob emas, bilim kerak bo\'ladi.',
      ru: 'Способ проверки другой: нужны не вычисления, а знания.',
      en: 'The way of checking differs: not calculation but knowledge is needed.',
    },
    audio: {
      intro: {
        uz: [
          "Modulga dunyo haqidagi xabarlar ham keladi.",
          "Burgut qush degani rost, bir hafta yetti kun degani ham rost.",
          "Tipratikan o'simlik degani yolg'on, choynak gul degani ham yolg'on.",
          "Bunday mulohazalarni hisoblab emas, bilim bilan tekshiramiz.",
        ],
        ru: [
          'В модуль приходят и сообщения о мире.',
          'Орёл птица это истина, неделя семь дней тоже истина.',
          'Ёж растение это ложь, чайник цветок тоже ложь.',
          'Такие высказывания проверяют не вычислением, а знанием.',
        ],
        en: [
          'Messages about the world reach the module too.',
          'An eagle is a bird is true, a week is seven days is true as well.',
          'A hedgehog is a plant is false, a teapot is a flower is false too.',
          'Such statements are checked not by calculating but by knowledge.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Rostni tanlang', ru: 'Выбери истину', en: 'Choose the true one' },
    title: {
      uz: 'Qaysi mulohaza rost?',
      ru: 'Какое высказывание истинно?',
      en: 'Which statement is true?',
    },
    question: {
      uz: 'To\'rt mulohazadan qaysi biri rost?',
      ru: 'Какое из четырёх высказываний истинно?',
      en: 'Which of the four statements is true?',
    },
    options: [
      { uz: '1 hafta - 7 kun', ru: 'Неделя - 7 дней', en: 'A week is 7 days' },
      { uz: '1 soat - 100 minut', ru: 'Час - 100 минут', en: 'An hour is 100 minutes' },
      { uz: 'Tonna - uzunlik birligi', ru: 'Тонна - единица длины', en: 'A tonne is a unit of length' },
      { uz: 'k harfi - unli', ru: 'Буква k - гласная', en: 'The letter k is a vowel' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Haftada yetti kun bor, demak bu mulohazaga rost muhri tushadi.",
      ru: 'Верно. В неделе семь дней, значит на это высказывание ставится печать истины.',
      en: 'Correct. A week has seven days, so this statement gets the true stamp.',
    },
    wrong: [
      null,
      {
        uz: "Soatda oltmish minut bor, yuz emas. Bu yolg'on.",
        ru: 'В часе шестьдесят минут, а не сто. Это ложь.',
        en: 'An hour has sixty minutes, not a hundred. That is false.',
      },
      {
        uz: "Tonna massa birligi. Uzunlik birliklari boshqa: metr, kilometr.",
        ru: 'Тонна — единица массы. Единицы длины другие: метр, километр.',
        en: 'A tonne is a unit of mass. Units of length are different: metre, kilometre.',
      },
      {
        uz: "Bu harf undosh. Demak mulohaza yolg'on.",
        ru: 'Эта буква согласная. Значит высказывание ложно.',
        en: 'That letter is a consonant. So the statement is false.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Modulga yana to'rtta mulohaza keldi. Bu safar faqat bittasi rost.",
          "Har birini bilimingiz bilan tekshiring.",
          "Qaysi biri rost? Javobni tanlang.",
        ],
        ru: [
          'В модуль пришли ещё четыре высказывания. На этот раз истинно только одно.',
          'Проверь каждое своими знаниями.',
          'Какое из них истинно? Выбери ответ.',
        ],
        en: [
          'Four more statements reached the module. This time only one is true.',
          'Check each of them with your knowledge.',
          'Which one is true? Choose an answer.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Mulohaza ichida mulohaza', ru: 'Высказывание о высказывании', en: 'A statement about a statement' },
    title: {
      uz: 'Ekani yolg\'on degan gap',
      ru: 'Фраза со словами «это ложно»',
      en: 'A phrase saying that something is false',
    },
    lead: {
      uz: "Mulohaza boshqa mulohaza haqida bo'lishi mumkin. Unda ikki bosqichda tekshiriladi.",
      ru: 'Высказывание может быть о другом высказывании. Тогда его проверяют в два шага.',
      en: 'A statement can be about another statement. Then it is checked in two steps.',
    },
    note: {
      uz: 'Avval ichidagini, keyin butun gapni baholaymiz.',
      ru: 'Сначала оцениваем внутреннее, потом всю фразу.',
      en: 'First judge the inner one, then the whole phrase.',
    },
    audio: {
      intro: {
        uz: [
          "Darslik qiziq shakl beradi: besh ko'paytiriladi sakkiz qirqqa teng ekani noto'g'ri.",
          "Avval ichidagini tekshiramiz: besh marta sakkiz qirq. Bu rost.",
          "Endi butun gapni baholaymiz. U rost narsani noto'g'ri deb aytyapti.",
          "Demak butun mulohaza yolg'on. Ichi rost bo'lsa, ustidagi inkor yolg'on bo'ladi.",
        ],
        ru: [
          'Учебник даёт интересную форму: то, что пять умножить на восемь равно сорока, неверно.',
          'Сначала проверим внутреннее: пять раз по восемь сорок. Это истина.',
          'Теперь оценим всю фразу. Она называет истинное неверным.',
          'Значит всё высказывание ложно. Если внутреннее истинно, то отрицание над ним ложно.',
        ],
        en: [
          'The textbook gives an interesting form: that five times eight equals forty is wrong.',
          'First check the inner part: five times eight is forty. That is true.',
          'Now judge the whole phrase. It calls a true thing wrong.',
          'So the whole statement is false. If the inner part is true, the denial above it is false.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Ikki bosqichli', ru: 'В два шага', en: 'Two steps' },
    title: {
      uz: 'Bu mulohaza qanday?',
      ru: 'Каково это высказывание?',
      en: 'What is this statement?',
    },
    question: {
      uz: '"9 + 6 = 15 ekani noto\'g\'ri" - bu qanday mulohaza?',
      ru: '«То, что 9 + 6 = 15, неверно» — какое это высказывание?',
      en: '"That 9 + 6 = 15 is wrong" — what kind of statement is this?',
    },
    options: [
      { uz: "Yolg'on", ru: 'Ложное', en: 'False' },
      { uz: 'Rost', ru: 'Истинное', en: 'True' },
      { uz: 'Aniqlab bo\'lmaydi', ru: 'Нельзя определить', en: 'Cannot be decided' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'qqiz qo'shuv olti o'n besh, ya'ni ichidagi rost. Uni noto'g'ri deyish esa yolg'on.",
      ru: 'Верно. Девять плюс шесть пятнадцать, то есть внутреннее истинно. А назвать его неверным — ложь.',
      en: 'Correct. Nine plus six is fifteen, so the inner part is true. Calling it wrong is false.',
    },
    wrong: [
      null,
      {
        uz: "Ichidagi hisob to'g'ri, shuning uchun uni noto'g'ri deb aytish rost bo'lolmaydi.",
        ru: 'Внутренний счёт верен, поэтому назвать его неверным нельзя считать истиной.',
        en: 'The inner sum is right, so calling it wrong cannot be true.',
      },
      {
        uz: "Aniqlash mumkin: ichidagini hisoblab, keyin butun gapni baholaymiz.",
        ru: 'Определить можно: посчитать внутреннее, а потом оценить всю фразу.',
        en: 'It can be decided: calculate the inner part, then judge the whole phrase.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Modulga ikki bosqichli xabar keldi.",
          "Avval ichidagi hisobni tekshiring, keyin butun gapni baholang.",
          "Bu qanday mulohaza? Javobni tanlang.",
        ],
        ru: [
          'В модуль пришло двухступенчатое сообщение.',
          'Сначала проверь внутренний счёт, потом оцени всю фразу.',
          'Какое это высказывание? Выбери ответ.',
        ],
        en: [
          'A two step message reached the module.',
          'First check the inner sum, then judge the whole phrase.',
          'What kind of statement is this? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Hisoblab tekshirish', ru: 'Проверка вычислением', en: 'Checking by calculation' },
    title: {
      uz: 'Sonli mulohazani hisob hal qiladi',
      ru: 'Числовое высказывание решает счёт',
      en: 'A numeric statement is settled by calculation',
    },
    lead: {
      uz: "Ikki tomonni hisoblab, keyin taqqoslaymiz. Boshqa dalil kerak emas.",
      ru: 'Считаем обе стороны, затем сравниваем. Другие доводы не нужны.',
      en: 'We work out both sides and then compare. No other argument is needed.',
    },
    note: {
      uz: 'Bu tanish usul: 43-darsda tenglamani ham shunday tekshirgan edik.',
      ru: 'Способ знакомый: так же мы проверяли уравнение в сорок третьем уроке.',
      en: 'The method is familiar: we checked an equation the same way in lesson forty three.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikda shunday mulohaza bor: olti yuz ellik yetti qo'shuv ikki yuz uch teng olti yuz ellik qo'shuv ikki yuz uch.",
          "Chap tomonni hisoblaymiz: sakkiz yuz oltmish.",
          "O'ng tomonni hisoblaymiz: sakkiz yuz ellik uch.",
          "Ikki tomon teng emas, demak mulohaza yolg'on.",
        ],
        ru: [
          'В учебнике есть такое высказывание: шестьсот пятьдесят семь плюс двести три равно шестьсот пятьдесят плюс двести три.',
          'Посчитаем левую сторону: восемьсот шестьдесят.',
          'Посчитаем правую: восемьсот пятьдесят три.',
          'Стороны не равны, значит высказывание ложно.',
        ],
        en: [
          'The textbook has this statement: six hundred and fifty seven plus two hundred and three equals six hundred and fifty plus two hundred and three.',
          'Work out the left side: eight hundred and sixty.',
          'Work out the right side: eight hundred and fifty three.',
          'The sides are not equal, so the statement is false.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Eng kichigi', ru: 'Самое маленькое', en: 'The smallest one' },
    title: {
      uz: 'Bu mulohaza to\'g\'rimi?',
      ru: 'Верно ли это высказывание?',
      en: 'Is this statement right?',
    },
    question: {
      uz: '"11 - eng kichik ikki xonali son". Bu qanday mulohaza?',
      ru: '«11 — наименьшее двузначное число». Какое это высказывание?',
      en: '"11 is the smallest two-digit number". What kind of statement is this?',
    },
    options: [
      { uz: "Yolg'on: eng kichigi 10", ru: 'Ложное: наименьшее 10', en: 'False: the smallest is 10' },
      { uz: 'Rost', ru: 'Истинное', en: 'True' },
      { uz: "Yolg'on: eng kichigi 12", ru: 'Ложное: наименьшее 12', en: 'False: the smallest is 12' },
      { uz: 'Aniqlab bo\'lmaydi', ru: 'Нельзя определить', en: 'Cannot be decided' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikki xonali sonlar o'ndan boshlanadi, shuning uchun mulohaza yolg'on.",
      ru: 'Верно. Двузначные числа начинаются с десяти, поэтому высказывание ложно.',
      en: 'Correct. Two-digit numbers start at ten, so the statement is false.',
    },
    wrong: [
      null,
      {
        uz: "O'n ham ikki xonali son va u o'n birdan kichik. Demak mulohaza rost emas.",
        ru: 'Десять тоже двузначное число, и оно меньше одиннадцати. Значит высказывание не истинно.',
        en: 'Ten is a two-digit number too and it is smaller than eleven. So the statement is not true.',
      },
      {
        uz: "O'n ikki o'n birdan katta. Eng kichigini izlayotgan edik.",
        ru: 'Двенадцать больше одиннадцати. А мы искали наименьшее.',
        en: 'Twelve is greater than eleven. We were looking for the smallest.',
      },
      {
        uz: "Aniqlash mumkin: ikki xonali sonlarning eng kichigi ma'lum.",
        ru: 'Определить можно: наименьшее двузначное число известно.',
        en: 'It can be decided: the smallest two-digit number is known.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Modulga sonlar haqidagi mulohaza keldi.",
          "Ikki xonali sonlarning eng kichigini eslang.",
          "Bu qanday mulohaza? Javobni tanlang.",
        ],
        ru: [
          'В модуль пришло высказывание о числах.',
          'Вспомни наименьшее двузначное число.',
          'Какое это высказывание? Выбери ответ.',
        ],
        en: [
          'A statement about numbers reached the module.',
          'Remember the smallest two-digit number.',
          'What kind of statement is this? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Modulning uch qadami',
      ru: 'Три шага модуля',
      en: 'The three steps of the module',
    },
    lead: {
      uz: 'Har xabar shu uch qadamdan o\'tadi.',
      ru: 'Каждое сообщение проходит эти три шага.',
      en: 'Every message goes through these three steps.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Birinchi qadam: gap darak gapmi? Buyruq va savol mulohaza emas.",
          "Ikkinchi qadam: tekshirish. Sonli mulohazani hisoblaymiz, dunyo haqidagisini bilim bilan tekshiramiz.",
          "Uchinchi qadam: muhr. To'g'ri bo'lsa rost, noto'g'ri bo'lsa yolg'on.",
        ],
        ru: [
          'Соберём правило. Первый шаг: повествовательная ли это фраза? Приказ и вопрос высказываниями не бывают.',
          'Второй шаг: проверка. Числовое высказывание считаем, а о мире проверяем знанием.',
          'Третий шаг: печать. Верное считают истиной, неверное ложью.',
        ],
        en: [
          'Let us put the rule together. Step one: is the phrase declarative? Commands and questions are not statements.',
          'Step two: the check. A numeric statement is calculated, one about the world is checked by knowledge.',
          'Step three: the stamp. Right means true, wrong means false.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qanday tekshiramiz?', ru: 'Как проверим?', en: 'How do we check?' },
    title: {
      uz: 'Bu mulohazani qanday tekshiramiz?',
      ru: 'Как проверить это высказывание?',
      en: 'How do we check this statement?',
    },
    question: {
      uz: '"Istalgan kvadrat to\'g\'ri to\'rtburchakdir". Qanday tekshiramiz?',
      ru: '«Любой квадрат — прямоугольник». Как это проверить?',
      en: '"Any square is a rectangle". How do we check it?',
    },
    options: [
      { uz: "Ta'rifga qarab", ru: 'По определению', en: 'By the definition' },
      { uz: "Bir nechta kvadratni o'lchab", ru: 'Измерив несколько квадратов', en: 'By measuring several squares' },
      { uz: "Sonlarni hisoblab", ru: 'Вычислив числа', en: 'By calculating numbers' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Kvadratning to'rt burchagi to'g'ri, demak u to'g'ri to'rtburchak ta'rifiga to'liq mos keladi.",
      ru: 'Верно. У квадрата все четыре угла прямые, значит он полностью подходит под определение прямоугольника.',
      en: 'Correct. A square has four right angles, so it fully fits the definition of a rectangle.',
    },
    wrong: [
      null,
      {
        uz: "O'lchash bir nechta kvadratni tekshiradi, hammasini emas. Istalgan degani hammasi degani.",
        ru: 'Измерение проверит несколько квадратов, но не все. Любой значит все.',
        en: 'Measuring checks a few squares, not all. Any means all of them.',
      },
      {
        uz: "Bu yerda hisoblanadigan son yo'q. Gap shakllarning xossasi haqida.",
        ru: 'Здесь нет чисел для вычисления. Речь о свойстве фигур.',
        en: 'There are no numbers to calculate here. The phrase is about a property of shapes.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Modulga shakllar haqidagi mulohaza keldi.",
          "Uni tekshirishning bir necha yo'li bor, lekin faqat bittasi ishonchli.",
          "Qanday tekshiramiz? Javobni tanlang.",
        ],
        ru: [
          'В модуль пришло высказывание о фигурах.',
          'Проверить его можно по-разному, но надёжен только один путь.',
          'Как проверить? Выбери ответ.',
        ],
        en: [
          'A statement about shapes reached the module.',
          'There are several ways to check it, but only one is reliable.',
          'How do we check it? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit muhrni noto\'g\'ri bosdi',
      ru: 'Bit поставил печать не ту',
      en: 'Bit stamped it wrongly',
    },
    question: {
      uz: 'Bit to\'rt xabarga muhr bosdi. Qaysi muhr noto\'g\'ri?',
      ru: 'Bit поставил печати на четыре сообщения. Какая печать неверна?',
      en: 'Bit stamped four messages. Which stamp is wrong?',
    },
    steps: [
      { uz: 'Toshkent - poytaxt: rost', ru: 'Ташкент - столица: истина', en: 'Tashkent is the capital: true' },
      { uz: '569 < 612: rost', ru: '569 < 612: истина', en: '569 < 612: true' },
      { uz: 'Fevral 30 kundan iborat: rost', ru: 'В феврале 30 дней: истина', en: 'February has 30 days: true' },
      { uz: '1 soat = 60 minut: rost', ru: '1 час = 60 минут: истина', en: '1 hour = 60 minutes: true' },
    ],
    options: [
      { uz: 'Uchinchi: fevralda 30 kun yo\'q', ru: 'Третья: в феврале нет 30 дней', en: 'The third: February has no 30 days' },
      { uz: 'Birinchi: poytaxt boshqa shahar', ru: 'Первая: столица другой город', en: 'The first: the capital is another city' },
      { uz: 'Ikkinchi: taqqoslash noto\'g\'ri', ru: 'Вторая: сравнение неверно', en: 'The second: the comparison is wrong' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Fevralda yigirma sakkiz yoki yigirma to'qqiz kun bo'ladi, shuning uchun bu mulohaza yolg'on.",
      ru: 'Верно. В феврале двадцать восемь или двадцать девять дней, поэтому это высказывание ложно.',
      en: 'Correct. February has twenty eight or twenty nine days, so that statement is false.',
    },
    wrong: [
      null,
      {
        uz: "Birinchi mulohaza rost: Toshkent O'zbekiston poytaxti.",
        ru: 'Первое высказывание истинно: Ташкент столица Узбекистана.',
        en: 'The first statement is true: Tashkent is the capital of Uzbekistan.',
      },
      {
        uz: "Ikkinchisi ham rost: besh yuz oltmish to'qqiz olti yuz o'n ikkidan kichik.",
        ru: 'Второе тоже истинно: пятьсот шестьдесят девять меньше шестисот двенадцати.',
        en: 'The second is true as well: five hundred and sixty nine is less than six hundred and twelve.',
      },
      {
        uz: "Bitta muhr noto'g'ri: uni kalendarni eslab topish mumkin.",
        ru: 'Одна печать неверна: её можно найти, вспомнив календарь.',
        en: 'One stamp is wrong: it can be found by recalling the calendar.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit to'rtta xabarni ko'rib chiqdi va hammasiga rost muhrini bosdi.",
          "Uning ro'yxati ekranda.",
          "Qaysi muhr noto'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Bit рассмотрел четыре сообщения и на все поставил печать истины.',
          'Его список на экране.',
          'Какая печать неверна? Выбери ответ.',
        ],
        en: [
          'Bit looked at four messages and stamped them all as true.',
          'His list is on the screen.',
          'Which stamp is wrong? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi xabar modulga kiradi?',
      ru: 'Какое сообщение войдёт в модуль?',
      en: 'Which message enters the module?',
    },
    question: {
      uz: 'Modul qaysi xabarni qabul qilib, muhr bosa oladi?',
      ru: 'Какое сообщение модуль примет и сможет проштамповать?',
      en: 'Which message can the module accept and stamp?',
    },
    options: [
      { uz: '1 hafta - 7 kun', ru: 'Неделя - 7 дней', en: 'A week is 7 days' },
      { uz: 'Xaritani oching', ru: 'Откройте карту', en: 'Open the map' },
      { uz: 'Bugun qaysi kun?', ru: 'Какой сегодня день?', en: 'What day is it today?' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bu darak gap va uni baholash mumkin: modul rost muhrini bosdi.",
      ru: 'Верно. Это повествование, и его можно оценить: модуль поставил печать истины.',
      en: 'Correct. That is a declarative sentence and it can be judged: the module stamped it true.',
    },
    wrong: [
      null,
      {
        uz: "Bu buyruq. Buyruqqa muhr bosib bo'lmaydi.",
        ru: 'Это приказ. На приказ печать не поставишь.',
        en: 'That is a command. A command cannot be stamped.',
      },
      {
        uz: "Bu savol. Savol javob so'raydi, o'zi esa hech narsa tasdiqlamaydi.",
        ru: 'Это вопрос. Вопрос просит ответа, а сам ничего не утверждает.',
        en: 'That is a question. It asks for an answer and asserts nothing itself.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Qaror moduli oldida uchta xabar turibdi.",
          "Modul faqat darak gapga muhr bosa oladi.",
          "Qaysi xabar modulga kiradi? Javobni tanlang.",
        ],
        ru: [
          'Перед модулем решений три сообщения.',
          'Модуль может ставить печать только на повествование.',
          'Какое сообщение войдёт в модуль? Выбери ответ.',
        ],
        en: [
          'Three messages stand before the decision module.',
          'The module can stamp only a declarative sentence.',
          'Which message enters the module? Choose an answer.',
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
      uz: "Qoidani tanlang va mulohazani tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь высказывание.',
      en: 'Choose the rule and show that you understand a statement.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Qanday gap mulohaza bo\'ladi?',
      ru: 'Какая фраза является высказыванием?',
      en: 'Which phrase counts as a statement?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Rost yoki yolg'on deb baholash mumkin bo'lgan darak gap", ru: 'Повествование, которое можно оценить как истину или ложь', en: 'A declarative sentence that can be judged true or false' },
      { uz: 'Ichida son bo\'lgan har qanday gap', ru: 'Любая фраза, в которой есть число', en: 'Any phrase that contains a number' },
      { uz: 'Javob talab qiladigan savol', ru: 'Вопрос, требующий ответа', en: 'A question that asks for an answer' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Son bo\'lishi shart emas, baholash imkoni esa shart.',
      ru: 'Именно так. Число не обязательно, а возможность оценки обязательна.',
      en: 'Exactly. A number is not required, but the possibility of judging is.',
    },
    reflectionWrong: {
      uz: "Hali emas. Modulni eslang: u buyruq va savolni qaytarib berardi.",
      ru: 'Пока нет. Вспомни модуль: он возвращал приказы и вопросы.',
      en: 'Not yet. Remember the module: it sent commands and questions back.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning to\'rt qoidasi', ru: 'Четыре правила урока', en: 'The four rules of the lesson' },
    main: [
      { uz: "Mulohaza — rost yoki yolg'on deb baholanadigan darak gap.", ru: 'Высказывание — повествование, оцениваемое как истина или ложь.', en: 'A statement is a declarative sentence judged true or false.' },
      { uz: 'Buyruq, savol va his-tuyg\'u gapi mulohaza emas.', ru: 'Приказ, вопрос и восклицание высказываниями не являются.', en: 'Commands, questions and exclamations are not statements.' },
      { uz: "Sonli mulohaza hisob bilan, dunyo haqidagisi bilim bilan tekshiriladi.", ru: 'Числовое высказывание проверяют счётом, а о мире — знанием.', en: 'A numeric statement is checked by calculation, one about the world by knowledge.' },
      { uz: "Ichi rost bo'lsa, uning inkori yolg'on bo'ladi.", ru: 'Если внутреннее истинно, его отрицание ложно.', en: 'If the inner part is true, its denial is false.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Hukm ustasi', ru: 'Мастер суждений', en: 'Master of judgements' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Xabar saralovchi', ru: 'Сортировщик сообщений', en: 'Message sorter' },
        text: { uz: "Siz mulohazani boshqa gapdan ishonchli ajratasiz.", ru: 'Ты уверенно отличаешь высказывание от других фраз.', en: 'You tell a statement from other phrases with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Modul xodimi', ru: 'Сотрудник модуля', en: 'Module clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Xabarlar saralandi. Endi markaz ularni chizmaga aylantiradi: grafik va diagramma ishga tushadi.",
      ru: 'Сообщения отсортированы. Теперь центр превращает их в чертёж: в дело идут график и диаграмма.',
      en: 'The messages are sorted. Now the centre turns them into a drawing: graphs and charts come into play.',
    },
    audio: {
      intro: {
        uz: [
          "Qaror moduli barcha xabarlarni sarabaladi va muhrladi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Qanday gap mulohaza bo'ladi? Javobni tanlang.",
        ],
        ru: [
          'Модуль решений разобрал и проштамповал все сообщения.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Какая фраза является высказыванием? Выбери ответ.',
        ],
        en: [
          'The decision module sorted and stamped every message.',
          'One question is left. Choose the rule and claim your title.',
          'Which phrase counts as a statement? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — MUHR: gap kartochkasi va uning yonidagi rost yoki
// yolg'on belgisi. Muhr faqat baholangandan keyin tushadi, shuning uchun
// "hukm" ko'z bilan ko'rinadi.
// ---------------------------------------------------------------------------

// s0, s14: qaror moduli (to'q sahna).
const DecisionModule = ({ accepted }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d49panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d49panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'QAROR MODULI', ru: 'МОДУЛЬ РЕШЕНИЙ', en: 'DECISION MODULE' })}
      </text>

      <rect x="72" y="86" width="470" height="82" rx="14" fill="rgba(121,211,218,.12)" stroke="rgba(144,228,235,.4)" strokeWidth="1.6" />
      <text x="307" y="118" textAnchor="middle" fill="#9DE3E7" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'kelgan xabar', ru: 'входящее сообщение', en: 'incoming message' })}
      </text>
      <text x="307" y="150" textAnchor="middle" fill="#EAF9FB" fontSize="22" fontWeight="800" fontFamily="Manrope, sans-serif">
        {accepted
          ? t({ uz: '1 hafta - 7 kun', ru: 'Неделя - 7 дней', en: 'A week is 7 days' })
          : t({ uz: 'Eshikni yoping', ru: 'Закройте дверь', en: 'Close the door' })}
      </text>

      {/* ikki muhr */}
      {[0, 1].map((index) => {
        const isTrue = index === 0;
        const lit = accepted && isTrue;
        return (
          <g key={index}>
            <circle
              cx={640 + index * 130}
              cy="127"
              r="42"
              fill={lit ? 'rgba(149,201,61,.24)' : 'rgba(121,211,218,.08)'}
              stroke={lit ? T.lime : 'rgba(144,228,235,.34)'}
              strokeWidth={lit ? 3 : 1.8}
            />
            <text
              x={640 + index * 130}
              y="137"
              textAnchor="middle"
              fill={lit ? T.lime : 'rgba(157,227,231,.55)'}
              fontSize="30"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {isTrue ? 'R' : 'Y'}
            </text>
          </g>
        );
      })}

      <rect
        x="72"
        y="192"
        width="756"
        height="62"
        rx="14"
        fill="rgba(1,13,22,.5)"
        stroke={accepted ? 'rgba(149,201,61,.5)' : 'rgba(255,179,155,.45)'}
        strokeWidth="1.5"
        strokeDasharray={accepted ? undefined : '9 7'}
      />
      <text
        x="450"
        y="230"
        textAnchor="middle"
        fill={accepted ? T.lime : '#FFB39B'}
        fontSize="16"
        fontWeight="800"
        fontFamily="Manrope, sans-serif"
      >
        {accepted
          ? t({ uz: 'MUHR BOSILDI: ROST', ru: 'ПЕЧАТЬ ПОСТАВЛЕНА: ИСТИНА', en: 'STAMPED: TRUE' })
          : t({ uz: 'XABAR QAYTARILDI', ru: 'СООБЩЕНИЕ ВОЗВРАЩЕНО', en: 'MESSAGE RETURNED' })}
      </text>
    </FitSvg>
  );
};

// s1..s12: mulohazalar ro'yxati va ularning muhri.
// `items` — { text, verdict } ; verdict: 'true' | 'false' | 'none' | 'open'
const VerdictList = ({ items, frame = 9 }) => {
  const t = useT();
  const height = 24 + items.length * 52;
  return (
    <FitSvg viewBox={`0 0 660 ${height}`}>
      {items.map((item, index) => {
        const open = frame >= index + 1;
        const tone = item.verdict === 'true' ? T.success : item.verdict === 'false' ? T.accent : T.ink3;
        const fill = item.verdict === 'true' ? T.successSoft : item.verdict === 'false' ? T.accentSoft : '#FBFDF7';
        const y = 14 + index * 52;
        return (
          <g key={index} opacity={open ? 1 : 0.24}>
            <rect x={44} y={y} width={508} height={42} rx="12" fill={fill} stroke={tone} strokeWidth="1.6" />
            <text x={62} y={y + 27} fill={T.ink} fontSize="15" fontWeight="750" fontFamily="Manrope, sans-serif">
              {item.text}
            </text>
            <circle cx={584} cy={y + 21} r="19" fill={fill} stroke={tone} strokeWidth="2.2" />
            <text x={584} y={y + 28} textAnchor="middle" fill={tone} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {item.verdict === 'true' ? 'R' : item.verdict === 'false' ? 'Y' : item.verdict === 'none' ? '—' : '?'}
            </text>
          </g>
        );
      })}
      {frame >= items.length + 1 && (
        <Caption
          x={330}
          y={height - 4}
          text={t({ uz: 'R — rost, Y — yolgon', ru: 'И — истина, Л — ложь', en: 'T is true, F is false' })}
          tone={T.ink2}
        />
      )}
    </FitSvg>
  );
};

// s7, s9: ikki bosqichli tekshiruv.
const NestedCheck = ({ inner, innerVerdict, outer, outerVerdict, frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 660 200">
      <g opacity={frame >= 1 ? 1 : 0.24}>
        <rect x={90} y={26} width={480} height={48} rx="13" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
        <text x={330} y={56} textAnchor="middle" fill={T.cyan} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {inner}
        </text>
        <Caption x={330} y={90} text={t({ uz: 'ichki mulohaza', ru: 'внутреннее высказывание', en: 'the inner statement' })} />
      </g>
      {frame >= 2 && (
        <g>
          <circle cx={600} cy={50} r="20" fill={innerVerdict === 'true' ? T.successSoft : T.accentSoft} stroke={innerVerdict === 'true' ? T.success : T.accent} strokeWidth="2.4" />
          <text x={600} y={57} textAnchor="middle" fill={innerVerdict === 'true' ? T.success : T.accent} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {innerVerdict === 'true' ? 'R' : 'Y'}
          </text>
        </g>
      )}
      <g opacity={frame >= 3 ? 1 : 0.24}>
        <rect x={60} y={108} width={510} height={52} rx="14" fill={T.accentSoft} stroke={T.accent} strokeWidth="2" />
        <text x={315} y={140} textAnchor="middle" fill={T.accent} fontSize="16" fontWeight="750" fontFamily="Manrope, sans-serif">
          {outer}
        </text>
      </g>
      {frame >= 4 && (
        <g>
          <circle cx={600} cy={134} r="20" fill={outerVerdict === 'true' ? T.successSoft : T.accentSoft} stroke={outerVerdict === 'true' ? T.success : T.accent} strokeWidth="2.4" />
          <text x={600} y={141} textAnchor="middle" fill={outerVerdict === 'true' ? T.success : T.accent} fontSize="17" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {outerVerdict === 'true' ? 'R' : 'Y'}
          </text>
          <Caption x={315} y={182} text={t({ uz: 'butun mulohaza', ru: 'всё высказывание', en: 'the whole statement' })} tone={T.ink2} />
        </g>
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
          head: t({ uz: 'Darak gapmi?', ru: 'Повествование ли это?', en: 'Is it declarative?' }),
          body: t({ uz: "buyruq, savol va his-tuyg'u gapi mulohaza emas", ru: 'приказ, вопрос и восклицание высказываниями не являются', en: 'commands, questions and exclamations are not statements' }),
          formula: null,
        },
        {
          tone: T.accent,
          head: t({ uz: 'Tekshiring', ru: 'Проверьте', en: 'Check it' }),
          body: t({ uz: "sonlini hisoblab, dunyo haqidagisini bilim bilan", ru: 'числовое — счётом, о мире — знанием', en: 'a numeric one by calculating, one about the world by knowledge' }),
          formula: null,
        },
        {
          tone: T.success,
          head: t({ uz: 'Muhr bosing', ru: 'Поставьте печать', en: 'Put the stamp' }),
          body: t({ uz: "to'g'ri bo'lsa rost, noto'g'ri bo'lsa yolgon", ru: 'верное — истина, неверное — ложь', en: 'right means true, wrong means false' }),
          formula: 'R / Y',
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
          <span>LUMO CITY · BOSHQARUV MARKAZI · QAROR MODULI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'QABUL' : 'XABAR'}
          </span>
        </div>
        <div className="hero-body">
          <DecisionModule accepted={solved} />
        </div>
        <div className="d49-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 23"
      figure={({ frame }) => (
        <VerdictList
          frame={frame}
          items={[
            { text: t({ uz: 'Eshikni yoping', ru: 'Закройте дверь', en: 'Close the door' }), verdict: 'none' },
            { text: t({ uz: 'Nechta kitob bor?', ru: 'Сколько книг?', en: 'How many books?' }), verdict: 'none' },
            { text: t({ uz: 'Qanday chiroyli!', ru: 'Как красиво!', en: 'How lovely!' }), verdict: 'none' },
            { text: t({ uz: 'Fevral 30 kundan iborat', ru: 'В феврале 30 дней', en: 'February has 30 days' }), verdict: 'false' },
          ]}
        />
      )}
    />
  );
};
const Screen2 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={1}
      ratio="66 / 23"
      figure={({ solved }) => (
        <VerdictList
          frame={solved ? 9 : 4}
          items={[
            { text: t({ uz: 'Fevral 30 kundan iborat', ru: 'В феврале 30 дней', en: 'February has 30 days' }), verdict: solved ? 'false' : 'open' },
            { text: t({ uz: 'Daftaringni och', ru: 'Открой тетрадь', en: 'Open your notebook' }), verdict: solved ? 'none' : 'open' },
            { text: t({ uz: 'Nechta kitob bor?', ru: 'Сколько книг?', en: 'How many books?' }), verdict: solved ? 'none' : 'open' },
            { text: t({ uz: 'Qanday chiroyli!', ru: 'Как красиво!', en: 'How lovely!' }), verdict: solved ? 'none' : 'open' },
          ]}
        />
      )}
    />
  );
};
const Screen3 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 18"
      figure={({ frame }) => (
        <VerdictList
          frame={frame}
          items={[
            { text: '214 > 83', verdict: 'true' },
            { text: '56 - 48 = 18', verdict: 'false' },
            { text: t({ uz: 'Toshkent - poytaxt', ru: 'Ташкент - столица', en: 'Tashkent is the capital' }), verdict: 'true' },
          ]}
        />
      )}
    />
  );
};
const Screen4 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 23"
    figure={({ solved }) => (
      <VerdictList
        frame={solved ? 9 : 4}
        items={[
          { text: '56 - 48 = 18', verdict: solved ? 'false' : 'open' },
          { text: '569 < 612', verdict: solved ? 'true' : 'open' },
          { text: '214 > 83', verdict: solved ? 'true' : 'open' },
          { text: '1 h = 60 min', verdict: solved ? 'true' : 'open' },
        ]}
      />
    )}
  />
);
const Screen5 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 23"
      figure={({ frame }) => (
        <VerdictList
          frame={frame}
          items={[
            { text: t({ uz: 'Burgut - qush', ru: 'Орёл - птица', en: 'An eagle is a bird' }), verdict: 'true' },
            { text: t({ uz: '1 hafta - 7 kun', ru: 'Неделя - 7 дней', en: 'A week is 7 days' }), verdict: 'true' },
            { text: t({ uz: 'Tipratikan - o\'simlik', ru: 'Ёж - растение', en: 'A hedgehog is a plant' }), verdict: 'false' },
            { text: t({ uz: 'Choynak - gul', ru: 'Чайник - цветок', en: 'A teapot is a flower' }), verdict: 'false' },
          ]}
        />
      )}
    />
  );
};
const Screen6 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={2}
      ratio="66 / 23"
      figure={({ solved }) => (
        <VerdictList
          frame={solved ? 9 : 4}
          items={[
            { text: t({ uz: '1 hafta - 7 kun', ru: 'Неделя - 7 дней', en: 'A week is 7 days' }), verdict: solved ? 'true' : 'open' },
            { text: t({ uz: '1 soat - 100 minut', ru: 'Час - 100 минут', en: 'An hour is 100 minutes' }), verdict: solved ? 'false' : 'open' },
            { text: t({ uz: 'Tonna - uzunlik birligi', ru: 'Тонна - единица длины', en: 'A tonne is a unit of length' }), verdict: solved ? 'false' : 'open' },
            { text: t({ uz: 'k harfi - unli', ru: 'Буква k - гласная', en: 'The letter k is a vowel' }), verdict: solved ? 'false' : 'open' },
          ]}
        />
      )}
    />
  );
};
const Screen7 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <NestedCheck
          frame={frame}
          inner="5 · 8 = 40"
          innerVerdict="true"
          outer={t({ uz: '"5 · 8 = 40" ekani notogri', ru: 'То, что 5 · 8 = 40, неверно', en: 'That 5 · 8 = 40 is wrong' })}
          outerVerdict="false"
        />
      )}
    />
  );
};
const Screen8 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={2}
      ratio="66 / 20"
      figure={({ solved }) => (
        <NestedCheck
          frame={solved ? 9 : 1}
          inner="9 + 6 = 15"
          innerVerdict="true"
          outer={t({ uz: '"9 + 6 = 15" ekani notogri', ru: 'То, что 9 + 6 = 15, неверно', en: 'That 9 + 6 = 15 is wrong' })}
          outerVerdict="false"
        />
      )}
    />
  );
};
const Screen9 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 18"
      figure={({ frame }) => (
        <VerdictList
          frame={frame}
          items={[
            { text: '657 + 203 = 860', verdict: 'true' },
            { text: '650 + 203 = 853', verdict: 'true' },
            { text: t({ uz: '860 va 853 teng', ru: '860 и 853 равны', en: '860 and 853 are equal' }), verdict: 'false' },
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
      ratio="66 / 18"
      figure={({ solved }) => (
        <VerdictList
          frame={solved ? 9 : 3}
          items={[
            { text: t({ uz: '10 - ikki xonali son', ru: '10 - двузначное число', en: '10 is a two-digit number' }), verdict: solved ? 'true' : 'open' },
            { text: t({ uz: '10 kichik, 11 katta', ru: '10 меньше, 11 больше', en: '10 is smaller, 11 is greater' }), verdict: solved ? 'true' : 'open' },
            { text: t({ uz: '11 - eng kichik ikki xonali', ru: '11 - наименьшее двузначное', en: '11 is the smallest two-digit' }), verdict: solved ? 'false' : 'open' },
          ]}
        />
      )}
    />
  );
};
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={5}
      ratio="66 / 18"
      figure={({ solved }) => (
        <VerdictList
          frame={solved ? 9 : 2}
          items={[
            { text: t({ uz: 'Kvadratning 4 burchagi togri', ru: 'У квадрата 4 прямых угла', en: 'A square has 4 right angles' }), verdict: 'true' },
            { text: t({ uz: 'Togri tortburchakda ham shunday', ru: 'У прямоугольника так же', en: 'A rectangle is the same' }), verdict: 'true' },
            { text: t({ uz: 'Demak kvadrat - togri tortburchak', ru: 'Значит квадрат - прямоугольник', en: 'So a square is a rectangle' }), verdict: solved ? 'true' : 'open' },
          ]}
        />
      )}
    />
  );
};
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
          badLabel={t({ uz: 'muhr notogri', ru: 'печать неверна', en: 'wrong stamp' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Kalendarni eslang: qaysi oyda nechta kun bor?',
            ru: 'Вспомни календарь: в каком месяце сколько дней?',
            en: 'Recall the calendar: how many days does each month have?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={7}
      ratio="72 / 21"
      figure={({ solved, picked }) => (
        <RecordRow
          records={[
            t({ uz: '1 hafta - 7 kun', ru: 'Неделя - 7 дней', en: 'A week is 7 days' }),
            t({ uz: 'Xaritani oching', ru: 'Откройте карту', en: 'Open the map' }),
            t({ uz: 'Bugun qaysi kun?', ru: 'Какой сегодня день?', en: 'What day is today?' }),
          ]}
          picked={picked}
          solved={solved}
          correctIndex={0}
          width={720}
          cardW={216}
          cardH={92}
          gap={22}
          top={34}
          size={14}
        />
      )}
    />
  );
};
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
.d49-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d49-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars49(props) {
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
