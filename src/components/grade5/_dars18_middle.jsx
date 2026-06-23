const LESSON_META = {
  lessonId: 'frac_5_10',
  lessonTitle: { ru: 'Вычитание дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni ayirish" }
};
const TOTAL_SCREENS = 10;

// Obuchayushchiy dars: proverochnye ekrany scored (pervaya popytka -> LMS), summary bez schyota.
const SCREEN_META = [
  { id: 's0', type: 'hook',        template: 'custom',  scored: false, scope: 'hook' },     // 0
  { id: 's1', type: 'exploration', template: 'custom',  scored: false, scope: null },       // 1
  { id: 's2', type: 'exploration', template: 'custom',  scored: false, scope: null },       // 2
  { id: 's3', type: 'rule',        template: 'custom',  scored: false, scope: null },       // 3
  { id: 's4', type: 'test',        template: 'SeqMC',   scored: true,  scope: 'practice' }, // 4 (5 oson savol)
  { id: 's5', type: 'rule',        template: 'custom',  scored: false, scope: null },       // 5
  { id: 's6', type: 'test',        template: 'SeqMix',  scored: true,  scope: 'practice' }, // 6 (6-8 misol, har xil tip)
  { id: 's7', type: 'case',        template: 'custom',  scored: true,  scope: 'practice' }, // 7
  { id: 's8', type: 'case',        template: 'QuestionScreen', scored: true, scope: 'final' }, // 8
  { id: 's9', type: 'summary',     template: 'custom',  scored: false, scope: null }        // 9
];

const CONTENT = {
  // ===== s0 HOOK (konseptual M1): ayirganda maxraj o'zgaradimi? =====
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    title: { ru: 'Севинч налила сок гостям', uz: "Sevinch mehmonlarga sharbat quydi" },
    lead: { ru: 'В кувшине было 7/8 сока. Севинч налила из него 3/8 в пиалы.', uz: "Idishda 7/8 sharbat bor edi. Sevinch undan 3/8 ni piyolalarga quydi." },
    question: { ru: 'Когда мы вычитаем, нижнее число — знаменатель — изменится?', uz: "Ayirganimizda pastki son — maxraj — o'zgaradimi?" },
    opt0: { ru: 'Нет, знаменатель остаётся тем же', uz: "Yo'q, maxraj o'sha bo'lib qoladi" },
    opt1: { ru: 'Да, знаменатель тоже уменьшается', uz: "Ha, maxraj ham kichrayadi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Верно. Кувшин всё так же поделён на 8 равных долей. Меняется только число долей: 7/8 − 3/8 = 4/8.', uz: "To'g'ri. Idish baribir 8 teng ulushga bo'lingan. Faqat ulushlar soni kamayadi: 7/8 − 3/8 = 4/8." },
    reveal1: { ru: 'Так думают многие, но нет. Размер доли не меняется — в кувшине всё те же 8 долей. Просто становится на 3 доли меньше.', uz: "Ko'pchilik shunday o'ylaydi, lekin yo'q. Ulush o'lchami o'zgarmaydi — idishda hamon 8 ulush. Faqat 3 ulushga kam bo'ladi." },
    reveal2: { ru: 'Давай посмотрим на кувшине — знаменатель остаётся тем же.', uz: "Keling, idishda ko'rib chiqamiz — maxraj o'sha bo'lib qoladi." },
    audio: { ru: 'В кувшине было семь восьмых сока. Севинч налила из него три восьмых в пиалы. Когда мы вычитаем, нижнее число, знаменатель, изменится или останется тем же? Как думаешь? Выбери ответ.', uz: "Idishda sakkizdan yetti sharbat bor edi. Sevinch undan sakkizdan uchini piyolalarga quydi. Ayirganimizda pastki son, ya'ni maxraj, o'zgaradimi yoki o'sha bo'lib qoladimi? Sizningcha qanday? Javobni tanlang." }
  },

  // ===== s1 EXPLORATION (step): idishdan ulush olamiz, 5/6 - 2/6 = 3/6 =====
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Вычесть — значит убрать доли', uz: "Ayirish — ulushlarni olib tashlash" },
    lead: { ru: 'В кувшине 5/6 сока. Уберём 2/6 и посмотрим, что станет со знаменателем.', uz: "Idishda 5/6 sharbat bor. 2/6 ni olib tashlaymiz va maxrajga nima bo'lishini ko'ramiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    cap1: { ru: 'Убираем две доли сверху.', uz: "Yuqoridan ikki ulushni olamiz." },
    cap2: { ru: 'Доли вылились. Размер доли не изменился.', uz: "Ulushlar quyildi. Ulush o'lchami o'zgarmadi." },
    cap3: { ru: 'Осталось 3 доли из тех же 6. 5/6 − 2/6 = 3/6.', uz: "O'sha 6 dan 3 ulush qoldi. 5/6 − 2/6 = 3/6." },
    audio: {
      ru: [
        'Кувшин поделён на шесть равных долей, в нём пять шестых сока. Нажимай кнопку дальше.',
        'Вычесть две шестых значит убрать две доли сверху.',
        'Две доли вылились из кувшина. Размер доли не изменился.',
        'Осталось три доли из тех же шести. Знаменатель остался шесть, мы убрали только число долей. Пять шестых минус две шестых равно три шестых.'
      ],
      uz: [
        "Idish olti teng ulushga bo'lingan, ichida oltidan besh sharbat bor. Davom etish tugmasini bosing.",
        "Oltidan ikkini ayirish, bu yuqoridan ikki ulushni olib tashlash.",
        "Ikki ulush idishdan quyildi. Ulush o'lchami o'zgarmadi.",
        "O'sha oltidan uch ulush qoldi. Maxraj olti bo'lib qoldi, biz faqat ulushlar sonini ayirdik. Oltidan besh minus oltidan ikki teng oltidan uch."
      ]
    }
  },

  // ===== s2 EXPLORATION (jonli slider): o'quvchi o'zi quyib yuboradi (den 8) =====
  s2: {
    eyebrow: { ru: 'Поиграй', uz: "O'ynab ko'ring" },
    title: { ru: 'Вылей сам — найди разность', uz: "O'zingiz quying — ayirmani toping" },
    lead: { ru: 'В кувшине 7/8 сока. Двигай ползунок и вылей несколько долей.', uz: "Idishda 7/8 sharbat bor. Slayderni surib, bir nechta ulushni quying." },
    slider_label: { ru: 'Вылито долей', uz: "Quyilgan ulush" },
    note: { ru: 'Знаменатель всё время 8 — доли одного размера. Разность не может стать меньше нуля.', uz: "Maxraj doim 8 — ulushlar bir o'lchamda. Ayirma noldan kichik bo'lolmaydi." },
    audio: { ru: 'Двигай ползунок и вылей несколько долей из семи восьмых. Знаменатель всё время восемь, доли одного размера, поэтому мы просто отнимаем число долей. Обрати внимание: разность не может стать меньше нуля.', uz: "Slayderni surib, yettidan sakkizdan bir nechta ulushni quying. Maxraj doim sakkiz, ulushlar bir o'lchamda, shuning uchun biz faqat ulushlar sonini ayiramiz. E'tibor bering: ayirma noldan kichik bo'lolmaydi." }
  },

  // ===== s3 RULE =====
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Вычитаем числители, знаменатель тот же', uz: "Suratlarni ayiramiz, maxraj o'sha" },
    bridge: { ru: 'Мы увидели это на кувшине. Теперь соберём в правило.', uz: "Buni idishda ko'rdik. Endi qoidaga yig'amiz." },
    rule_label: { ru: 'Запомни', uz: "Yodda tuting" },
    rule_1: { ru: 'Если знаменатели равны, вычитаем только числители.', uz: "Maxrajlar teng bo'lsa, faqat suratlarni ayiramiz." },
    rule_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    card_top: { ru: 'Числитель — сколько долей. Вычитаем: 5 − 2 = 3.', uz: "Surat — nechta ulush. Ayiramiz: 5 − 2 = 3." },
    card_bottom: { ru: 'Знаменатель — размер доли. Он один и тот же, поэтому не меняется.', uz: "Maxraj — ulush o'lchami. U bir xil, shuning uchun o'zgarmaydi." },
    ex_label: { ru: 'Как это работает', uz: "Bu qanday ishlaydi" },
    ex_caption: { ru: '5/6 − 2/6: знаменатель 6 тот же, ответ 3/6.', uz: "5/6 − 2/6: maxraj 6 o'sha, javob 3/6." },
    audio: { ru: 'Запомни правило. Когда у дробей одинаковый знаменатель, вычитаем только числители, а знаменатель оставляем тем же. Числитель показывает, сколько долей: пять минус два три. Знаменатель это размер доли, он один и тот же, поэтому не меняется. Пять шестых минус две шестых равно три шестых.', uz: "Qoidani yodda tuting. Kasrlarning maxraji bir xil bo'lganda, faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz. Surat nechta ulush ekanini ko'rsatadi: besh minus ikki uch. Maxraj ulush o'lchami, u bir xil, shuning uchun o'zgarmaydi. Oltidan besh minus oltidan ikki teng oltidan uch." }
  },

  // ===== s4 — BESHTA OSON SAVOL (SeqMC, scored) =====
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Пять быстрых примеров', uz: "Beshta tez misol" },
    lead: { ru: 'Вычитай дроби с равным знаменателем. Выбери ответ.', uz: "Teng maxrajli kasrlarni ayiring. Javobni tanlang." },
    bridge: { ru: 'Правило знаем — теперь потренируемся.', uz: "Qoidani bilamiz — endi mashq qilamiz." },
    questions: [
      {
        q: '4/5 − 1/5', say: { ru: 'Вычти из четырёх пятых одну пятую.', uz: "Beshdan to'rtdan beshdan birni ayiring." },
        opts: ['3/5', '2/5', '3/10'], correct: 0,
        ok: { ru: 'Верно: 4 − 1 = 3, знаменатель 5.', uz: "To'g'ri: 4 − 1 = 3, maxraj 5." },
        no: { ru: 'Вычитай только числители, знаменатель остаётся тем же.', uz: "Faqat suratlarni ayiring, maxraj o'sha bo'lib qoladi." }
      },
      {
        q: '7/9 − 3/9', say: { ru: 'Вычти из семи девятых три девятых.', uz: "To'qqizdan yettidan to'qqizdan uchni ayiring." },
        opts: ['4/0', '4/9', '10/9'], correct: 1,
        ok: { ru: 'Верно: 7 − 3 = 4, знаменатель 9.', uz: "To'g'ri: 7 − 3 = 4, maxraj 9." },
        no: { ru: 'Знаменатель не вычитается и не складывается, он остаётся тем же.', uz: "Maxraj ayirilmaydi ham, qo'shilmaydi ham, u o'sha bo'lib qoladi." }
      },
      {
        q: '5/6 − 2/6', say: { ru: 'Вычти из пяти шестых две шестых.', uz: "Oltidan beshdan oltidan ikkini ayiring." },
        opts: ['3/12', '7/6', '3/6'], correct: 2,
        ok: { ru: 'Верно: 5 − 2 = 3, знаменатель 6.', uz: "To'g'ri: 5 − 2 = 3, maxraj 6." },
        no: { ru: 'Это вычитание, а знаменатель не трогаем.', uz: "Bu ayirish, maxrajga esa tegmaymiz." }
      },
      {
        q: '6/8 − 2/8', say: { ru: 'Вычти из шести восьмых две восьмых.', uz: "Sakkizdan oltidan sakkizdan ikkini ayiring." },
        opts: ['4/8', '8/8', '4/16'], correct: 0,
        ok: { ru: 'Верно: 6 − 2 = 4, знаменатель 8.', uz: "To'g'ri: 6 − 2 = 4, maxraj 8." },
        no: { ru: 'Вычитаем числители, знаменатель оставляем тем же.', uz: "Suratlarni ayiramiz, maxrajni o'sha qoldiramiz." }
      },
      {
        q: '9/10 − 4/10', say: { ru: 'Вычти из девяти десятых четыре десятых.', uz: "O'ndan to'qqizdan o'ndan to'rtni ayiring." },
        opts: ['13/10', '5/10', '5/0'], correct: 1,
        ok: { ru: 'Верно: 9 − 4 = 5, знаменатель 10.', uz: "To'g'ri: 9 − 4 = 5, maxraj 10." },
        no: { ru: 'Знаменатель не может стать нулём, он остаётся тем же.', uz: "Maxraj nol bo'lolmaydi, u o'sha bo'lib qoladi." }
      }
    ],
    audio: {
      intro: { ru: 'Правило знаем, теперь потренируемся. Пять быстрых примеров.', uz: "Qoidani bilamiz, endi mashq qilamiz. Beshta tez misol." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все примеры решены.', uz: "Zo'r, hamma misol yechildi." }
    }
  },

  // ===== s5 RULE (maxsus holat): suratlar teng -> ayirma nol =====
  s5: {
    eyebrow: { ru: 'Особый случай', uz: "Maxsus holat" },
    heading: { ru: 'Когда разность равна нулю', uz: "Ayirma nolga teng bo'lganda" },
    title: { ru: 'Если числители равны — разность равна нулю.', uz: "Suratlar teng bo'lsa — ayirma nolga teng." },
    card_top: { ru: '3/7 − 3/7: убрали все три доли. Из 7 осталось 0 долей.', uz: "3/7 − 3/7: uchala ulushni oldik. 7 dan 0 ulush qoldi." },
    card_line: { ru: '3/7 − 3/7 = 0/7 = 0. Ноль долей — это просто ноль.', uz: "3/7 − 3/7 = 0/7 = 0. Nol ulush — bu shunchaki nol." },
    btn: { ru: 'Понятно', uz: "Tushunarli" },
    audio: { ru: 'Бывает, что вычитаем все доли. Три седьмых минус три седьмых: убрали все три доли, осталось ноль долей из семи. Ноль седьмых это просто ноль. Знаменатель при этом всё равно не менялся.', uz: "Ba'zan hamma ulushni ayiramiz. Yettidan uch minus yettidan uch: uchala ulushni oldik, yettidan nol ulush qoldi. Yettidan nol bu shunchaki nol. Maxraj baribir o'zgarmadi." }
  },

  // ===== s6 — OLTI-SAKKIZ MISOL, OSONDAN QIYINGA, HAR XIL TIP (SeqMix, scored) =====
  s6: {
    eyebrow: { ru: 'Смешанная тренировка', uz: "Aralash mashq" },
    title: { ru: 'Семь примеров — разного типа', uz: "Yettita misol — har xil turdagi" },
    lead: { ru: 'Каждый пример другого типа: от лёгкого к трудному.', uz: "Har misol boshqacha turdagi: osondan qiyinga." },
    bridge: { ru: 'Теперь проверим себя на разных типах вопросов.', uz: "Endi turli xil savollar bilan o'zimizni sinaymiz." },
    lvl_easy: { ru: 'Лёгкий', uz: "Oson" },
    lvl_mid: { ru: 'Средний', uz: "O'rta" },
    lvl_hard: { ru: 'Трудный', uz: "Qiyin" },
    bin_zero: { ru: 'Ноль', uz: "Nol" },
    bin_pos: { ru: 'Больше нуля', uz: "Noldan katta" },
    bin_ask: { ru: 'Перетащи в корзину или нажми', uz: "Savatga torting yoki bosing" },
    drag_num: { ru: 'Перетащи число в окошко или нажми', uz: "Sonni katakka torting yoki bosing" },
    drag_frac: { ru: 'Перетащи дробь в окошко или нажми', uz: "Kasrni katakka torting yoki bosing" },
    items: [
      // (1) DRAG: sonni katakka — 4/6 − 1/6 = [?]/6, javob 3
      { kind: 'dragnum', lvl: 'easy', a: 4, b: 1, d: 6,
        chips: [{ id: 'c0', label: '3', ok: true }, { id: 'c1', label: '5', ok: false }, { id: 'c2', label: '2', ok: false }],
        say: { ru: 'Вычти из четырёх шестых одну шестую и перетащи нужное число в окошко.', uz: "Oltidan to'rtdan oltidan birni ayiring va kerakli sonni katakka torting." },
        ok: { ru: 'Верно: 4 − 1 = 3, знаменатель 6.', uz: "To'g'ri: 4 − 1 = 3, maxraj 6." },
        no: { ru: 'Вычитай числители, знаменатель не меняется.', uz: "Suratlarni ayiring, maxraj o'zgarmaydi." } },
      // (2) MC
      { kind: 'mc', lvl: 'easy', prob: '3/5 − 2/5', opts: ['1/5', '1/0', '5/5'], correct: 0,
        say: { ru: 'Вычти из трёх пятых две пятых.', uz: "Beshdan uchdan beshdan ikkini ayiring." },
        ok: { ru: 'Верно: 3 − 2 = 1, знаменатель 5.', uz: "To'g'ri: 3 − 2 = 1, maxraj 5." },
        no: { ru: 'Знаменатель остаётся, вычитай только числители.', uz: "Maxraj o'sha qoladi, faqat suratlarni ayiring." } },
      // (3) DRAG: kasrni qutiga — 7/10 − 4/10 = [?], javob 3/10
      { kind: 'dragfrac', lvl: 'mid', a: 7, b: 4, d: 10,
        chips: [{ id: 'c0', frac: ['11', '10'], ok: false }, { id: 'c1', frac: ['3', '10'], ok: true }, { id: 'c2', frac: ['3', '0'], ok: false }],
        say: { ru: 'Вычти из семи десятых четыре десятых и перетащи правильную дробь в окошко.', uz: "O'ndan yettidan o'ndan to'rtni ayiring va to'g'ri kasrni katakka torting." },
        ok: { ru: 'Верно: 7 − 4 = 3, знаменатель 10.', uz: "To'g'ri: 7 − 4 = 3, maxraj 10." },
        no: { ru: 'Знаменатель десять остаётся, вычитай только числители.', uz: "Maxraj o'n bo'lib qoladi, faqat suratlarni ayiring." } },
      // (4) MC: noto'g'risini-top
      { kind: 'mc', lvl: 'mid', prob: 'Qaysi tenglik NOTO\'G\'RI?', probRu: 'Какое равенство НЕВЕРНО?',
        opts: ['6/7 − 2/7 = 4/7', '5/9 − 3/9 = 2/9', '8/8 − 3/8 = 5/0'], correct: 2, optSize: 'sm',
        say: { ru: 'Внимание: найди неверное равенство. Где знаменатель записан неправильно?', uz: "Diqqat: noto'g'ri tenglikni toping. Maxraj qayerda noto'g'ri yozilgan?" },
        ok: { ru: 'Верно: знаменатель нельзя превращать в ноль, он остаётся тем же.', uz: "To'g'ri: maxrajni nolga aylantirib bo'lmaydi, u o'sha bo'lib qoladi." },
        no: { ru: 'Это равенство верное. Ищи то, где тронули знаменатель.', uz: "Bu tenglik to'g'ri. Maxrajga tegilganini qidiring." } },
      // (5) MC: nol holat
      { kind: 'mc', lvl: 'mid', prob: '6/6 − 6/6', opts: ['0', '1', '6/0'], correct: 0,
        say: { ru: 'Вычти из шести шестых шесть шестых.', uz: "Oltidan oltidan oltidan oltini ayiring." },
        ok: { ru: 'Верно: убрали все доли, осталось 0.', uz: "To'g'ri: hamma ulushni oldik, 0 qoldi." },
        no: { ru: 'Числители равны, долей не остаётся, выходит ноль.', uz: "Suratlar teng, ulush qolmaydi, nol chiqadi." } },
      // (6) DRAG: ifodani savatga (klassifikatsiya) — 4/7 − 4/7 → Nol
      { kind: 'dragbin', lvl: 'hard', expr: '4/7 − 4/7', bin: 'zero',
        say: { ru: 'Разность будет ноль или больше нуля? Перетащи в нужную корзину.', uz: "Ayirma nol bo'ladimi yoki noldan kattami? Kerakli savatga torting." },
        ok: { ru: 'Верно: числители равны, значит ноль.', uz: "To'g'ri: suratlar teng, demak nol." },
        no: { ru: 'Сравни числители: если они равны, разность ноль.', uz: "Suratlarni solishtiring: ular teng bo'lsa, ayirma nol." } },
      // (7) DRAG: sonni katakka (butundan) — 7/7 − 2/7 = [?]/7, javob 5
      { kind: 'dragnum', lvl: 'hard', a: 7, b: 2, d: 7,
        chips: [{ id: 'c0', label: '9', ok: false }, { id: 'c1', label: '5', ok: true }, { id: 'c2', label: '3', ok: false }],
        say: { ru: 'Семь седьмых это целое. Вычти из него две седьмых и перетащи число в окошко.', uz: "Yettidan yetti, bu butun. Undan yettidan ikkini ayiring va sonni katakka torting." },
        ok: { ru: 'Верно: 7 − 2 = 5, знаменатель 7.', uz: "To'g'ri: 7 − 2 = 5, maxraj 7." },
        no: { ru: 'Целое это семь седьмых. Вычитай числители, знаменатель тот же.', uz: "Butun, bu yettidan yetti. Suratlarni ayiring, maxraj o'sha." } }
    ],
    fact: { ru: 'Полоса загрузки файла показывает, сколько долей из целого осталось, — это тоже дробь.', uz: "Fayl yuklanish chizig'i butundan necha ulush qolganini ko'rsatadi — bu ham aslida kasr." },
    audio: {
      intro: { ru: 'Теперь проверим себя на разных типах. Семь примеров, каждый другого типа.', uz: "Endi turli xil savollar bilan o'zimizni sinaymiz. Yettita misol, har biri boshqacha." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все типы примеров решены. Кстати, полоса загрузки файла это тоже дробь от целого.', uz: "Ajoyib, barcha turdagi misollar yechildi. Aytgancha, fayl yuklanish chizig'i ham butundan ulush, ya'ni kasr." }
    }
  },

  // ===== s7 — CASE interaktiv: Rustam suv idishi, rosa 4 ulush quyiladi (tap, scored) =====
  s7: {
    eyebrow: { ru: 'Задача · вода', uz: "Masala · suv" },
    title: { ru: 'Рустам полил цветок', uz: "Rustam gulga suv quydi" },
    lead: { ru: 'В лейке было 9/10 воды. Рустам вылил 4 доли. Убери ровно 4 доли — нажми на уровень воды.', uz: "Idishda 9/10 suv bor edi. Rustam 4 ulush quydi. Rosa 4 ulushni oling — suv darajasiga bosing." },
    hint: { ru: 'Нажми на доли в кувшине, чтобы выставить уровень. Нужно убрать ровно 4 доли. Знаменатель остаётся 10.', uz: "Darajani belgilash uchun idishdagi ulushlarga bosing. Rosa 4 ulushni olish kerak. Maxraj 10 bo'lib qoladi." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_reset: { ru: 'Сбросить', uz: "Qaytadan" },
    fb_correct: { ru: 'Верно. Из 9 долей вылили 4, осталось 5. 9/10 − 4/10 = 5/10.', uz: "To'g'ri. 9 ulushdan 4 tasi quyildi, 5 tasi qoldi. 9/10 − 4/10 = 5/10." },
    audio: {
      intro: { ru: 'В лейке было девять десятых воды. Рустам вылил четыре доли. Выставь уровень: убери ровно четыре доли. Знаменатель остаётся десять. Потом нажми проверить.', uz: "Idishda o'ndan to'qqiz suv bor edi. Rustam to'rt ulush quydi. Darajani belgilang: rosa to'rt ulushni oling. Maxraj o'n bo'lib qoladi. Keyin tekshiring." },
      on_correct: { ru: 'Верно. Осталось пять десятых.', uz: "To'g'ri. O'ndan besh qoldi." },
      on_wrong: { ru: 'Пока не то. Убрать нужно ровно четыре доли из девяти.', uz: "Hozircha emas. To'qqiz ulushdan rosa to'rttasini olish kerak." }
    }
  },

  // ===== s8 — CASE yakuniy (QuestionScreen, final): 9/10 - 4/10 = 5/10 =====
  s8: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    title: { ru: 'Посчитай оставшуюся воду', uz: "Qolgan suvni hisoblang" },
    question: { ru: '9/10 − 4/10 = ?', uz: "9/10 − 4/10 = ?" },
    opt0: { ru: '5/10', uz: '5/10' },
    opt1: { ru: '5/0', uz: '5/0' },
    opt2: { ru: '5/20', uz: '5/20' },
    opt3: { ru: '13/10', uz: '13/10' },
    correct_text: { ru: 'Правильно. 9 − 4 = 5, знаменатель 10: осталось 5/10 воды.', uz: "To'g'ri. 9 − 4 = 5, maxraj 10: 5/10 suv qoldi." },
    wrong_1: { ru: 'Знаменатель не может стать нулём. Доли остаются десятыми, вычитай только числители.', uz: "Maxraj nol bo'lolmaydi. Ulushlar o'ndan bo'lib qoladi, faqat suratlarni ayiring." },
    wrong_2: { ru: 'Знаменатель не удваивается. Доли остаются десятыми, вычитай только числители.', uz: "Maxraj ikkilanmaydi. Ulushlar o'ndan bo'lib qoladi, faqat suratlarni ayiring." },
    wrong_3: { ru: 'Это вычитание, а не сложение. Отними числители, знаменатель остаётся тем же.', uz: "Bu ayirish, qo'shish emas. Suratlarni ayiring, maxraj o'sha bo'lib qoladi." },
    wrong_default: { ru: 'Знаменатель остаётся десять, вычитай только числители.', uz: "Maxraj o'n bo'lib qoladi, faqat suratlarni ayiring." },
    fact: { ru: 'В Древнем Египте дроби записывали только как сумму долей с числителем 1.', uz: "Qadimgi Misrda kasrlar faqat surati bir bo'lgan ulushlar yig'indisi sifatida yozilgan." },
    audio: {
      intro: { ru: 'Вычти из девяти десятых четыре десятых. Сколько воды осталось? Выбери ответ.', uz: "O'ndan to'qqizdan o'ndan to'rtni ayiring. Qancha suv qoldi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Осталось пять десятых. А в Древнем Египте такие дроби писали только через доли с единицей наверху.', uz: "To'g'ri. O'ndan besh qoldi. Qadimgi Misrda esa bunday kasrlar faqat yuqorisida bir turgan ulushlar bilan yozilgan." },
      on_wrong: { ru: 'Не совсем. Знаменатель не меняется, вычитай только числители.', uz: "Unchalik emas. Maxraj o'zgarmaydi, faqat suratlarni ayiring." }
    }
  },

  // ===== s9 SUMMARY + ConnectionsBlock =====
  s9: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что мы усвоили', uz: "Nimani o'rgandik" },
    title: { ru: 'Теперь ты вычитаешь дроби с равным знаменателем.', uz: "Endi siz teng maxrajli kasrlarni ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'У дробей с равным знаменателем вычитаем только числители.', uz: "Teng maxrajli kasrlarda faqat suratlarni ayiramiz." },
    main_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    main_3: { ru: 'Если числители равны, разность равна нулю (3/7 − 3/7 = 0).', uz: "Suratlar teng bo'lsa, ayirma nolga teng (3/7 − 3/7 = 0)." },
    score_label: { ru: 'Верно с первой попытки', uz: "Birinchi urinishda to'g'ri" },
    back_to_hook: { ru: 'Кувшин Севинч: 7/8 − 3/8 = 4/8. Знаменатель не изменился.', uz: "Sevinch idishi: 7/8 − 3/8 = 4/8. Maxraj o'zgarmadi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с равным знаменателем» (тот же принцип) и «Что такое дробь».', uz: "«Teng maxrajli kasrlarni qo'shish» (o'sha tamoyil) va «Kasr nima»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni ayirish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты вычитаешь дроби с равным знаменателем. Вычитаем только числители, а знаменатель оставляем тем же, это размер доли. А если числители равны, разность равна нулю. Дальше научимся вычитать дроби с разными знаменателями.', uz: "Zo'r. Endi siz teng maxrajli kasrlarni ayirasiz. Faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz, bu ulush o'lchami. Suratlar teng bo'lsa, ayirma nol bo'ladi. Keyingi darsda har xil maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// YORDAMCHILAR (infra'da yo'q — shu yerda) + faktlar
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

const optEl = (t, node) => <span className="body" style={{ display: 'inline' }}>{mt(t(node))}</span>;
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ margin: 0 }}>{mt(t(node))}</p> : null; };

const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-harakat (fon-on-all): Stage.stage-content ichida har ekranda.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// FAKT-BLOK — ko'k karta, katta animatsiya + kam matn (to'g'ridan keyin).
const FB_IT   = { ru: 'Знаешь ли ты? · IT',      uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const AnimDrain = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '0', '0', '%'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);
const AnimEgypt = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '/', '2', '+', '1', '/', '4'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.22}s` }}>{ch}</span>
    ))}
  </div>
);
const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// ============================================================
// VIZUALIZATOR frac_5_10: LiquidJug — vertikal idish (sharbat/suv). Maxraj = bandlar soni (o'zgarmaydi),
// surat = to'lgan bandlar. Ayirish = yuqoridan ulushlarni quyib yuborish (drain animatsiya).
// FracMinus — a/d − b/d = res/d (yoki 0) formulasi.
// ============================================================
const LiquidJug = ({ den, num, ghost = 0, pour = false, h = 190, tappable = false, onTapBand }) => {
  const bandH = Math.round(h / den);
  const bands = [];
  for (let i = 0; i < den; i++) {                 // i = 0 — pastki band (column-reverse)
    const filled = i < num;
    const isGhost = filled && i >= num - ghost;
    let cls = 'lj-band';
    if (filled) cls += isGhost ? ' lj-ghost' : ' lj-fill';
    if (tappable) cls += ' lj-tap';
    bands.push(<div key={i} className={cls} style={{ height: bandH }} onClick={tappable && onTapBand ? () => onTapBand(i) : undefined}/>);
  }
  return (
    <div className="lj-wrap">
      <div className="lj-jug">
        <span className="lj-spout" aria-hidden="true"/>
        <span className="lj-handle" aria-hidden="true"/>
        <div className="lj-body">
          {bands}
          <span className="lj-shine"/>
          {pour && <span className="lj-drop"/>}
        </div>
      </div>
      <span className="lj-label"><Frac n={String(num)} d={String(den)} size="mid" color={T.accent}/></span>
    </div>
  );
};

// ExprLine — kasr ifodasini BIR XIL o'lchamda chizadi: kasrlar Frac(size) + operatorlar mos o'lchamda.
// mt() kasrlarni doim frac-sm qiladi, atrofdagi belgilar konteyner o'lchamini oladi — shu nomutanosiblikni hal qiladi.
const ExprLine = ({ s, size = 'mid' }) => {
  const str = String(s);
  const out = []; let last = 0; let m; let k = 0;
  const re = /(\d+|\?)\/(\d+)/g;   // lokal regex — render paytida shared obyekt o'zgartirilmaydi
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last, m.index)}</span>);
    out.push(<Frac key={`f${k}`} n={m[1]} d={m[2]} size={size}/>);
    k += 1; last = m.index + m[0].length;
  }
  if (last < str.length) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last)}</span>);
  return <span className={`expr-row expr-row-${size}`}>{out}</span>;
};

const FracMinus = ({ a, b, d, res, showRes = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    <Frac n={String(a)} d={String(d)} size="mid" color={T.accent}/>
    <Op>−</Op>
    <Frac n={String(b)} d={String(d)} size="mid" color={T.blue}/>
    {showRes && <><Op>=</Op>{res === 0 ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>0</span> : <Frac n={String(res)} d={String(d)} size="mid" color={T.success}/>}</>}
  </div>
);

// ============================================================
// DragDropItem — pointer-asosli drag-and-drop (sichqoncha + touch, setPointerCapture orqali).
// Uch metod: dragnum (sonni katakka), dragfrac (kasrni qutiga), dragbin (ifodani savatga).
// Веди-до-верного: noto'g'ri tashlansa chip qaytadi + maslahat; to'g'ri tashlansa onResult(true).
// ============================================================
const DragChip = ({ chip }) => (
  chip.frac ? <Frac n={chip.frac[0]} d={chip.frac[1]} size="mid"/>
    : chip.expr ? <ExprLine s={chip.expr} size="sm"/>
      : <span className="dd-num">{chip.label}</span>
);

const DragDropItem = ({ it, solved, instr, binLabels, onResult }) => {
  const t = useT();
  const [drag, setDrag] = useState(null);       // { id, x, y, sx, sy, moved }
  const [selected, setSelected] = useState(null); // tap-rejimi: tanlangan chip id
  const [landed, setLanded] = useState(null);   // to'g'ri joylangan chip id
  const [badZone, setBadZone] = useState(null);
  const isBin = it.kind === 'dragbin';
  const chips = isBin ? [{ id: 'e0', expr: it.expr, bin: it.bin }] : it.chips;
  const correctChip = isBin ? chips[0] : chips.find(x => x.ok);
  const placedChip = solved ? correctChip : (landed ? chips.find(x => x.id === landed) : null);
  const locked = solved || !!landed;

  // Joylash (drag yoki tap): to'g'ri zona bo'lsa — to'g'ri, aks holda chip qaytadi.
  const resolve = (id, zid) => {
    if (locked || !zid) return;
    const chip = chips.find(x => x.id === id);
    if (!chip) return;
    const ok = isBin ? (zid === chip.bin) : (zid === 'slot' && chip.ok);
    setSelected(null);
    if (ok) { setLanded(id); onResult(true); } else { setBadZone(zid); onResult(false); }
  };
  const start = (e, id) => {
    if (locked) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { void err; }
    setBadZone(null);
    setDrag({ id, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false });
  };
  const move = (e, id) => {
    if (!drag || drag.id !== id) return;
    const moved = drag.moved || Math.abs(e.clientX - drag.sx) > 7 || Math.abs(e.clientY - drag.sy) > 7;
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
  };
  const end = (e, id) => {
    if (!drag || drag.id !== id) return;
    const wasDrag = drag.moved;
    setDrag(null);
    if (wasDrag) {
      let zid = null;
      try { const el = document.elementFromPoint(e.clientX, e.clientY); const z = el && el.closest && el.closest('[data-zone]'); zid = z ? z.getAttribute('data-zone') : null; } catch (err) { void err; }
      if (zid) resolve(id, zid);
    } else {
      setSelected(prev => (prev === id ? null : id));   // tap = tanlash / bekor qilish
    }
  };
  const zoneTap = (zid) => { if (!locked && selected) resolve(selected, zid); };
  const handlers = (id) => ({ onPointerDown: (e) => start(e, id), onPointerMove: (e) => move(e, id), onPointerUp: (e) => end(e, id) });
  const clone = drag && drag.moved ? chips.find(x => x.id === drag.id) : null;
  const armed = selected !== null;

  // ---- BIN: ifodani savatga torting yoki bosing ----
  if (isBin) {
    return (
      <div className="dd-wrap fade-up delay-1">
        <p className="dd-instr">{mt(t(instr))}</p>
        <div className="dd-tray-row">
          {locked
            ? <span className="dd-chip dd-used"><ExprLine s={it.expr} size="sm"/></span>
            : <button className={`dd-chip dd-chip-expr${(drag && drag.moved) ? ' dd-dragging' : ''}${selected === 'e0' ? ' dd-selected' : ''}`} {...handlers('e0')}><ExprLine s={it.expr} size="sm"/></button>}
        </div>
        <div className="sort-bins">
          {binLabels.map(b => (
            <button key={b.key} type="button" data-zone={b.key} onClick={() => zoneTap(b.key)} disabled={locked}
              className={`sort-bin sort-bin-${b.key === 'zero' ? 'sq' : 'cu'}${badZone === b.key ? ' sort-bin-bad' : ''}${(placedChip && it.bin === b.key) ? ' dd-zone-on' : ''}${armed ? ' dd-zone-armed' : ''}`}>
              <span className="sort-bin-h">{mt(t(b.label))}</span>
              {(placedChip && it.bin === b.key) && <span className="sort-chip-in"><ExprLine s={it.expr} size="sm"/></span>}
            </button>
          ))}
        </div>
        {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><ExprLine s={it.expr} size="sm"/></span>}
      </div>
    );
  }

  // ---- SLOT (dragnum) / BOX (dragfrac): tenglama + kataklar ----
  const slotCls = `${it.kind === 'dragnum' ? 'dd-slot' : 'dd-box'}${placedChip ? ' dd-slot-on' : ''}${badZone === 'slot' ? ' dd-bad' : ''}${armed && !placedChip ? ' dd-zone-armed' : ''}`;
  return (
    <div className="dd-wrap fade-up delay-1">
      <p className="dd-instr">{mt(t(instr))}</p>
      <div className="dd-eq">
        <Frac n={String(it.a)} d={String(it.d)} size="mid" color={T.accent}/>
        <span className="expr-op expr-op-mid">−</span>
        <Frac n={String(it.b)} d={String(it.d)} size="mid" color={T.blue}/>
        <span className="expr-op expr-op-mid">=</span>
        {it.kind === 'dragnum' ? (
          <span className="dd-frac">
            <span data-zone="slot" onClick={() => zoneTap('slot')} className={slotCls}>{placedChip ? placedChip.label : '?'}</span>
            <span className="dd-bar"/>
            <span className="dd-den">{it.d}</span>
          </span>
        ) : (
          <span data-zone="slot" onClick={() => zoneTap('slot')} className={slotCls}>{placedChip ? <Frac n={placedChip.frac[0]} d={placedChip.frac[1]} size="mid"/> : '?'}</span>
        )}
      </div>
      <div className="dd-tray-row">
        {chips.map(ch => {
          const used = placedChip && placedChip.id === ch.id;
          return (
            <button key={ch.id} className={`dd-chip${used ? ' dd-used' : ''}${(drag && drag.moved && drag.id === ch.id) ? ' dd-dragging' : ''}${selected === ch.id ? ' dd-selected' : ''}`} disabled={locked} {...handlers(ch.id)}>
              <DragChip chip={ch}/>
            </button>
          );
        })}
      </div>
      {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><DragChip chip={clone}/></span>}
    </div>
  );
};

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (beshta oson savol). Mobil-do'st tap.
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const qs = c.questions; const n = qs.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `seq${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const q = qs[idx];
  const solvedItem = picked === q.correct;
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && qs[i].say) e.pushOneOff(qs[i].say[lang]); } };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const pick = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    const isCorrect = i === q.correct;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = isCorrect;
    if (isCorrect) {
      setPicked(i); sfx.playCorrect();
      const cur = firstTryRef.current.slice();
      advanceRef.current = setTimeout(() => {
        if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); sayItem(ni); }
        else finish(cur);
      }, 850);
    } else {
      sfx.playWrong();
      setWrong(prev => { const s = new Set(prev); s.add(i); return s; });
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(q.no ? q.no[lang] : c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <ExprLine s={tx(q.q)} size="big"/>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <ExprLine s={tx(o)} size="mid"/>
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? q.ok : q.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMix — ketma-ket HAR XIL TIPLI misollar (input / mc / classify), osondan qiyinga. Mobil-do'st.
// Веди-до-верного: noto'g'ri -> maslahat, to'g'ri -> avtomatik keyingisi. Yig'iladigan qator yo'q (no-scroll).
// ============================================================
const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev, factOnDone }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const lvlNode = { easy: c.lvl_easy, mid: c.lvl_mid, hard: c.lvl_hard };
  const audio = useAudio([{ id: `smix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);         // mc index | 'ok' (drag) | bin key
  const [wrong, setWrong] = useState(() => new Set()); // mc gashen variantlar
  const [hint, setHint] = useState(false);            // drag noto'g'ri maslahati
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];
  const solvedItem = picked !== null;
  // mc-tarmoq uchun render-vaqti qiymatlari (IIFE'siz — refs rule буzilmasligi uchun)
  const mcProb = it.prob ? ((it.probRu && lang === 'ru') ? it.probRu : it.prob) : '';
  const mcIsExpr = /\//.test(mcProb);
  const mcOptSize = it.optSize || 'mid';
  const advanceIntro = () => { if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); } };
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const wrongVoice = () => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff((it.no && it.no[lang]) || c.audio.on_wrong[lang]); } };
  const markFirst = (ok) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = ok; };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const correctNow = (firstTries) => {
    sfx.playCorrect();
    advanceRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); setHint(false); sayItem(ni); }
      else finish(firstTries);
    }, 820);
  };
  const pickMc = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    advanceIntro();
    const ok = i === it.correct; markFirst(ok);
    if (ok) { setPicked(i); correctNow(firstTryRef.current.slice()); }
    else { sfx.playWrong(); setWrong(p => { const s = new Set(p); s.add(i); return s; }); wrongVoice(); }
  };
  // drag-and-drop natijasi: DragDropItem to'g'ri/noto'g'ri tashlashni xabar qiladi (веди-до-верного).
  const dragResult = (ok) => {
    if (done || solvedItem) return;
    advanceIntro();
    markFirst(ok);
    if (ok) { setPicked('ok'); setHint(false); correctNow(firstTryRef.current.slice()); }
    else { sfx.playWrong(); setHint(true); wrongVoice(); }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const showWrong = !solvedItem && (wrong.size > 0 || hint);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <>
            <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: T.success }}><IconOk/></span>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Barcha turdagi misollar yechildi." : 'Все типы примеров решены.'}</p>
            </div>
            {factOnDone}
          </>
        ) : (
          <>
            <span className="smix-tag fade-up">{mt(tx(lvlNode[it.lvl]))}</span>

            {it.kind === 'mc' && (
              <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
                {mcIsExpr ? <ExprLine s={mcProb} size="big"/> : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontWeight: 700 }}>{mt(mcProb)}</p>}
              </div>
            )}
            {it.kind === 'mc' && (
              <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${it.opts.length >= 3 ? 3 : 2}, minmax(0, 1fr))`, gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <ExprLine s={o} size={mcOptSize}/>
                    </button>
                  );
                })}
              </div>
            )}

            {(it.kind === 'dragnum' || it.kind === 'dragfrac' || it.kind === 'dragbin') && (
              <DragDropItem key={idx} it={it} solved={solvedItem}
                instr={it.kind === 'dragbin' ? c.bin_ask : (it.kind === 'dragfrac' ? c.drag_frac : c.drag_num)}
                binLabels={[{ key: 'zero', label: c.bin_zero }, { key: 'pos', label: c.bin_pos }]}
                onResult={dragResult}/>
            )}

            <FeedbackBlock show={solvedItem || showWrong} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? <IconOk/> : <IconNo/>}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? it.ok : it.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR (fon — Stage.has-amb orqali har ekranda)
// ============================================================

// s0 — HOOK. Qaytishda picked TO'LIQ sbros.
const ScreenHook = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: screen, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px)', display: 'flex', justifyContent: 'center' }}>
          <LiquidJug den={8} num={7} pour h={190}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ margin: 0, color: T.ink2 }}>{mt(t(reveals[picked]))}</p>}
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION (step): idishdan ulush quyiladi.
const ScreenStep = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  const jugNum = step >= 2 ? 3 : 5;
  const jugGhost = step === 1 ? 2 : 0;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <LiquidJug den={6} num={jugNum} ghost={jugGhost} h={190}/>
          {step >= 1 && step < 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(step === 1 ? c.cap1 : c.cap2))}</p>}
          {step >= 3 && <FracMinus a={5} b={2} d={6} res={3}/>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION (jonli slider): o'quvchi o'zi quyadi.
const ScreenSlider = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [removed, setRemoved] = useState(0);
  const remaining = 7 - removed;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 230 }}>
          <LiquidJug den={8} num={remaining} h={190}/>
          <FracMinus a={7} b={removed} d={8} res={remaining}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {removed}</p>
          <Slider value={removed} min={0} max={7} onChange={setRemoved}/>
        </div>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.note))}</p></div>
      </div>
    </Stage>
  );
};

// s3 — RULE.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <FracMinus a={5} b={2} d={6} res={3}/>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p className="body" style={{ margin: 0, marginBottom: 4 }}>{mt(t(c.card_top))}</p>
            <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.card_bottom))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s4 — beshta oson savol.
const ScreenEasy = (props) => <SeqMC {...props} screenContent={CONTENT.s4} scored={true}/>;

// s5 — RULE (maxsus holat: nol).
const ScreenZero = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, fontWeight: 600 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <LiquidJug den={7} num={0} h={190}/>
          <FracMinus a={3} b={3} d={7} res={0}/>
        </div>
        <div className="frame-tip fade-up delay-2"><p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — olti-sakkiz misol, har xil tip.
const ScreenMix = (props) => <SeqMix {...props} screenContent={CONTENT.s6} scored={true} factOnDone={<FactCard text={CONTENT.s6.fact} badge={FB_IT} anim={<AnimDrain/>}/>}/>;

// s7 — CASE interaktiv: Rustam, idishdan rosa 4 ulush oling (tap).
const ScreenCaseDo = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7; const sfx = useSfx();
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [remaining, setRemaining] = useState(wasSolved ? 5 : 9);
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const removed = 9 - remaining;
  const tapBand = (i) => { if (solved) return; setHint(false); setRemaining(i < remaining ? i : i + 1); };
  const check = () => {
    if (solved) return;
    const ok = removed === 4;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: '5/10', studentAnswer: `${remaining}/10`, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setHint(true); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 230 }}>
          <LiquidJug den={10} num={remaining} h={210} tappable={!solved} onTapBand={tapBand}/>
          <FracMinus a={9} b={removed} d={10} res={remaining} showRes={solved}/>
        </div>
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s8 — CASE yakuniy (QuestionScreen, final).
const ScreenCaseFinal = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}
    figure={() => <LiquidJug den={10} num={9} h={150}/>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimEgypt/>}/>}/>;
};

// s9 — SUMMARY (kanonik: ball qatori + ulanishlar bloki, top-anchor).
const ScreenSummary = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const scoredTotal = SCREEN_META.filter(s => s.scored).length;
  const correctCount = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame-success fade-up delay-1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="display" style={{ fontSize: 'clamp(26px, 6vw, 38px)', color: T.success }}>{correctCount} / {scoredTotal}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2"><p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

export default function FractionSubtractLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
    const scored = SCREEN_META.filter(s => s.scored);
    const finalScreens = scored.filter(s => s.scope === 'final');
    const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
    const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && a.correct).length;
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scored.length,
      correctAnswers: correctCount,
      scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalScreens.length,
      passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    };
    safeOnFinished(payload);
  }, [answers, safeOnFinished]);

  const screens = [ScreenHook, ScreenStep, ScreenSlider, ScreenRule, ScreenEasy, ScreenZero, ScreenMix, ScreenCaseDo, ScreenCaseFinal, ScreenSummary];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
    </LangContext.Provider>
  );
}
