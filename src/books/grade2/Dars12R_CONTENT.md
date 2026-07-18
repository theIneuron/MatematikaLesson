# Dars12R — CONTENT (Б2 «MARS» yakuni · «Takrorlash — Sayyora 2: 100 ичida amallar» · program d.14)

> **Takrorlash darsi (Б2 yakuni)** — Dars07–12 materiali: qo'shish/ayirish (o'tishsiz va o'tishli), столбik usuli, ikki amalli masala.
> Klon-baza **Dars06R** (MixStage + kengaytirilgan minilar). Kind: `calc`(SumText) · `word`(masala) · `place`(razryad). Yangi konsept YO'Q.
> Slot-mos: s0 hook=calc · s1 calc · s2 calc · s3 calc · s4 place. **regext.mjs + kirill skan majburiy.**

---

```javascript
const CONTENT = {
  // s0 — HOOK: 47−5, kimdir 52 dedi (qo'shdi). To'g'rimi? Yo'q (42).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Повторение', uz: "Mavzu: Takrorlash" },
    lead: { ru: 'Верно ли решили?', uz: "To'g'ri yechildimi?" },
    q: { ru: 'Сорок семь минус пять. Кто-то сказал: пятьдесят два. Это верно?', uz: "Qirq yetti ayirish besh. Kimdir «ellik ikki» dedi. Bu to'g'rimi?" },
    hookfig: { kind: 'calc', a: 47, op: '−', b: 5 },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на красном Марсе. Повторим вторую планету — счёт в пределах ста.',
          'Вот пример: сорок семь минус пять.',
          'Кто-то прибавил и сказал пятьдесят два. Но здесь минус — надо вычитать.',
          'Как думаешь, верно ли решили? Послушай: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Qizil Marsdamiz. Ikkinchi sayyorani takrorlaymiz — yuz ичida hisob.",
          "Mana misol: qirq yetti ayirish besh.",
          "Kimdir qo'shib, ellik ikki dedi. Ammo bu yerda ayirish — ayirish kerak.",
          "Sizningcha, to'g'ri yechildimi? Tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Сорок семь минус пять — сорок два.', uz: "To'g'ri. Qirq yetti ayirish besh — qirq ikki." },
      on_wrong: { ru: 'Здесь минус: сорок семь минус пять — сорок два. Сейчас повторим.', uz: "Bu yerda ayirish: qirq yetti ayirish besh — qirq ikki. Hozir takrorlaymiz." },
      on_unknown: { ru: 'Ничего. Сегодня повторим вторую планету.', uz: "Hechqisi yo'q. Bugun ikkinchi sayyorani takrorlaymiz." }
    }
  },

  // s1 — RECAP: qo'shish o'tishsiz (calc 34+25=59). caption edit: «ellik to'qqiz». 3 seg.
  s1: {
    eyebrow: { ru: 'Сложение', uz: "Qo'shish" },
    lead: { ru: 'Сложение по разрядам', uz: "Xonama-xona qo'shish" },
    recap: { kind: 'calc', a: 34, op: '+', b: 25 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Складываем по разрядам: десятки с десятками, единицы с единицами. Тридцать четыре плюс двадцать пять — пятьдесят девять.', uz: "Xonama-xona qo'shamiz: o'nlik o'nlik bilan, birlik birlik bilan. O'ttiz to'rt qo'shuv yigirma besh — ellik to'qqiz." },
    audio: {
      ru: ['Вспомним сложение.', 'Складываем десятки с десятками, единицы с единицами.', 'Тридцать четыре плюс двадцать пять — пятьдесят девять.'],
      uz: ["Qo'shishni eslaymiz.", "O'nlikni o'nlik bilan, birlikni birlik bilan qo'shamiz.", "O'ttiz to'rt qo'shuv yigirma besh — ellik to'qqiz."]
    }
  },

  // s2 — RECAP: ayirish o'tishsiz (calc 58−23=35). caption edit: «o'ttiz besh». 3 seg.
  s2: {
    eyebrow: { ru: 'Вычитание', uz: 'Ayirish' },
    lead: { ru: 'Вычитание по разрядам', uz: "Xonama-xona ayirish" },
    recap: { kind: 'calc', a: 58, op: '−', b: 23 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Вычитаем по разрядам: из единиц единицы, из десятков десятки. Пятьдесят восемь минус двадцать три — тридцать пять.', uz: "Xonama-xona ayiramiz: birlikdan birlik, o'nlikdan o'nlik. Ellik sakkiz ayirish yigirma uch — o'ttiz besh." },
    audio: {
      ru: ['Вспомним вычитание.', 'Из единиц вычитаем единицы, из десятков десятки.', 'Пятьдесят восемь минус двадцать три — тридцать пять.'],
      uz: ["Ayirishni eslaymiz.", "Birlikdan birlik, o'nlikdan o'nlik ayiramiz.", "Ellik sakkiz ayirish yigirma uch — o'ttiz besh."]
    }
  },

  // s3 — RECAP+check: o'tishli qo'shish (calc 28+7=35).
  s3: {
    eyebrow: { ru: 'С переходом', uz: "O'tish bilan" },
    lead: { ru: 'Сложение с переходом', uz: "O'tib qo'shish" },
    recap: { kind: 'calc', a: 28, op: '+', b: 7 },
    check_q: { ru: 'Двадцать восемь плюс семь. Сколько получится?', uz: "Yigirma sakkiz qo'shuv yetti. Nechta bo'ladi?" },
    opts: [{ ru: '35', uz: '35', ok: true }, { ru: '21', uz: '21' }, { ru: '30', uz: '30' }],
    wrong: { ru: 'Дополни до тридцати: двадцать восемь и два — тридцать, и ещё пять — тридцать пять.', uz: "O'ttizgacha to'ldiring: yigirma sakkiz va ikki — o'ttiz, yana besh — o'ttiz besh." },
    check_ok: { ru: 'Верно! Тридцать пять.', uz: "To'g'ri! O'ttiz besh." },
    audio: {
      ru: ['Сложение с переходом.', 'Сначала дополни до круглого десятка, потом прибавь остаток.', 'Проверь. Двадцать восемь плюс семь?'],
      uz: ["O'tib qo'shish.", "Avval yumaloq o'nlikkacha to'ldiring, keyin qolganini qo'shing.", "Tekshiring. Yigirma sakkiz qo'shuv yetti?"]
    }
  },

  // s4 — RECAP+check: столбik/razryad (place 3/5=35 usuli). caption edit: «uch o'nlik besh birlik».
  s4: {
    eyebrow: { ru: 'Столбик', uz: 'Столбik' },
    lead: { ru: 'Разряд под разрядом', uz: "Xona xona ostida" },
    recap: { kind: 'place', tens: 3, ones: 5 },
    check_q: { ru: 'В столбике десятки под десятками. Какой это разряд слева?', uz: "Столбikда o'nlik o'nlik ostida. Chapdagi qaysi razryad?" },
    opts: [{ ru: 'десятки', uz: 'o\'nliklar', ok: true }, { ru: 'единицы', uz: 'birliklar' }, { ru: 'сотни', uz: 'yuzliklar' }],
    wrong: { ru: 'Слева всегда десятки, справа единицы. Пиши разряд под разрядом.', uz: "Chapda doim o'nliklar, o'ngda birliklar. Xonani xona ostiga yozing." },
    check_ok: { ru: 'Верно! Слева десятки.', uz: "To'g'ri! Chapda o'nliklar." },
    audio: {
      ru: ['Столбик.', 'В столбике пиши разряд под разрядом: десятки под десятками, единицы под единицами.', 'Проверь. Какой разряд слева?'],
      uz: ["Столбik.", "Столбikда xonani xona ostiga yozing: o'nlik o'nlik ostida, birlik birlik ostida.", "Tekshiring. Chapda qaysi razryad?"]
    }
  },

  // sTBL — KALIT: Б2 nima. 3 seg.
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Что мы прошли', uz: "Nimalarni o'tdik" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'На Марсе мы прошли сложение и вычитание в пределах ста, с переходом и без, столбик и задачи в два действия.', uz: "Marsda yuz ичida qo'shish va ayirish, o'tish bilan va o'tishsiz, столбik va ikki amalli masalalarni o'tdik." },
    audio: {
      ru: ['Соберём ключ. Мы прошли много.', 'Сложение и вычитание в пределах ста, с переходом и без.', 'Столбик и задачи в два действия. Повторим всё.'],
      uz: ["Kalitni yig'amiz. Ko'p narsa o'tdik.", "Yuz ичida qo'shish va ayirish, o'tish bilan va o'tishsiz.", "Столбik va ikki amalli masala. Hammasini takrorlaymiz."]
    }
  },

  // s5 — qo'shish o'tishsiz.
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' }, label: { ru: 'Сложи', uz: "Qo'shing" },
    rounds: [
      { kind: 'calc', a: 42, op: '+', b: 36, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '78', uz: '78', ok: true }, { ru: '15', uz: '15', wrong: { ru: 'Складывай по разрядам: сорок два плюс тридцать шесть — семьдесят восемь.', uz: "Xonama-xona qo'shing: qirq ikki qo'shuv o'ttiz olti — yetmish sakkiz." } }, { ru: '72', uz: '72', wrong: { ru: 'Единицы: два и шесть — восемь. Семьдесят восемь.', uz: "Birliklar: ikki va olti — sakkiz. Yetmish sakkiz." } }],
        correct_text: { ru: 'Верно. Семьдесят восемь.', uz: "To'g'ri. Yetmish sakkiz." } },
      { kind: 'calc', a: 51, op: '+', b: 27, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '78', uz: '78', ok: true }, { ru: '68', uz: '68', wrong: { ru: 'Десятки: пять и два — семь. Семьдесят восемь.', uz: "O'nliklar: besh va ikki — yetti. Yetmish sakkiz." } }, { ru: '24', uz: '24', wrong: { ru: 'Это сложение: пятьдесят один плюс двадцать семь — семьдесят восемь.', uz: "Bu qo'shish: ellik bir qo'shuv yigirma yetti — yetmish sakkiz." } }],
        correct_text: { ru: 'Верно. Семьдесят восемь.', uz: "To'g'ri. Yetmish sakkiz." } }
    ],
    audio: { intro: { ru: 'Складывай по разрядам.', uz: "Xonama-xona qo'shing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s6 — ayirish o'tishsiz.
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' }, label: { ru: 'Вычти', uz: "Ayiring" },
    rounds: [
      { kind: 'calc', a: 76, op: '−', b: 34, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '42', uz: '42', ok: true }, { ru: '110', uz: '110', wrong: { ru: 'Здесь минус: семьдесят шесть минус тридцать четыре — сорок два.', uz: "Bu yerda ayirish: yetmish olti ayirish o'ttiz to'rt — qirq ikki." } }, { ru: '32', uz: '32', wrong: { ru: 'Единицы: шесть минус четыре — два. Сорок два.', uz: "Birliklar: olti ayirish to'rt — ikki. Qirq ikki." } }],
        correct_text: { ru: 'Верно. Сорок два.', uz: "To'g'ri. Qirq ikki." } },
      { kind: 'calc', a: 89, op: '−', b: 45, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '44', uz: '44', ok: true }, { ru: '134', uz: '134', wrong: { ru: 'Это вычитание: восемьдесят девять минус сорок пять — сорок четыре.', uz: "Bu ayirish: sakson to'qqiz ayirish qirq besh — qirq to'rt." } }, { ru: '54', uz: '54', wrong: { ru: 'Десятки: восемь минус четыре — четыре. Сорок четыре.', uz: "O'nliklar: sakkiz ayirish to'rt — to'rt. Qirq to'rt." } }],
        correct_text: { ru: 'Верно. Сорок четыре.', uz: "To'g'ri. Qirq to'rt." } }
    ],
    audio: { intro: { ru: 'Вычитай по разрядам.', uz: "Xonama-xona ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s7 — o'tishli qo'shish.
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' }, label: { ru: 'С переходом', uz: "O'tish bilan" },
    rounds: [
      { kind: 'calc', a: 46, op: '+', b: 8, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '54', uz: '54', ok: true }, { ru: '44', uz: '44', wrong: { ru: 'Дополни до пятидесяти: сорок шесть и четыре — пятьдесят, и ещё четыре — пятьдесят четыре.', uz: "Ellikgacha to'ldiring: qirq olti va to'rt — ellik, yana to'rt — ellik to'rt." } }, { ru: '52', uz: '52', wrong: { ru: 'Единиц шесть и восемь — четырнадцать. Пятьдесят четыре.', uz: "Birlik olti va sakkiz — o'n to'rt. Ellik to'rt." } }],
        correct_text: { ru: 'Верно. Пятьдесят четыре.', uz: "To'g'ri. Ellik to'rt." } },
      { kind: 'calc', a: 35, op: '+', b: 9, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '44', uz: '44', ok: true }, { ru: '43', uz: '43', wrong: { ru: 'Дополни до сорока: тридцать пять и пять — сорок, и ещё четыре — сорок четыре.', uz: "Qirqgacha to'ldiring: o'ttiz besh va besh — qirq, yana to'rt — qirq to'rt." } }, { ru: '26', uz: '26', wrong: { ru: 'Это сложение: тридцать пять плюс девять — сорок четыре.', uz: "Bu qo'shish: o'ttiz besh qo'shuv to'qqiz — qirq to'rt." } }],
        correct_text: { ru: 'Верно. Сорок четыре.', uz: "To'g'ri. Qirq to'rt." } }
    ],
    audio: { intro: { ru: 'Дополни до круглого десятка, потом прибавь остаток.', uz: "Yumaloq o'nlikkacha to'ldiring, keyin qolganini qo'shing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s8 — o'tishli ayirish.
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' }, label: { ru: 'С переходом', uz: "O'tish bilan" },
    rounds: [
      { kind: 'calc', a: 52, op: '−', b: 6, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '46', uz: '46', ok: true }, { ru: '58', uz: '58', wrong: { ru: 'Здесь минус: сначала до пятидесяти — минус два, потом ещё минус четыре — сорок шесть.', uz: "Bu yerda ayirish: avval ellikkacha — ayirish ikki, keyin yana ayirish to'rt — qirq olti." } }, { ru: '56', uz: '56', wrong: { ru: 'Пятьдесят два минус шесть — сорок шесть.', uz: "Ellik ikki ayirish olti — qirq olti." } }],
        correct_text: { ru: 'Верно. Сорок шесть.', uz: "To'g'ri. Qirq olti." } },
      { kind: 'calc', a: 43, op: '−', b: 5, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '38', uz: '38', ok: true }, { ru: '48', uz: '48', wrong: { ru: 'Здесь минус: сорок три минус пять — тридцать восемь.', uz: "Bu yerda ayirish: qirq uch ayirish besh — o'ttiz sakkiz." } }, { ru: '42', uz: '42', wrong: { ru: 'До сорока минус три, потом ещё минус два — тридцать восемь.', uz: "Qirqgacha ayirish uch, keyin yana ayirish ikki — o'ttiz sakkiz." } }],
        correct_text: { ru: 'Верно. Тридцать восемь.', uz: "To'g'ri. O'ttiz sakkiz." } }
    ],
    audio: { intro: { ru: 'Сначала до круглого десятка, потом вычти остаток.', uz: "Avval yumaloq o'nlikkacha, keyin qolganini ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s9 — masala (word).
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' }, label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'word', q: { ru: 'На базе было тридцать пять ящиков, привезли сорок. Сколько стало?', uz: "Bazada o'ttiz besh quti edi, qirqta keltirildi. Nechta bo'ldi?" },
        opts: [{ ru: '75', uz: '75', ok: true }, { ru: '5', uz: '5', wrong: { ru: 'Привезли ещё — складываем: тридцать пять плюс сорок — семьдесят пять.', uz: "Yana keltirildi — qo'shamiz: o'ttiz besh qo'shuv qirq — yetmish besh." } }, { ru: '39', uz: '39', wrong: { ru: 'Тридцать пять плюс сорок — семьдесят пять.', uz: "O'ttiz besh qo'shuv qirq — yetmish besh." } }],
        correct_text: { ru: 'Верно. Семьдесят пять.', uz: "To'g'ri. Yetmish besh." } },
      { kind: 'word', q: { ru: 'Было шестьдесят литров топлива, потратили двадцать пять. Сколько осталось?', uz: "Oltmish litr yoqilg'i edi, yigirma besh sarflandi. Qancha qoldi?" },
        opts: [{ ru: '35', uz: '35', ok: true }, { ru: '85', uz: '85', wrong: { ru: 'Потратили — вычитаем: шестьдесят минус двадцать пять — тридцать пять.', uz: "Sarflandi — ayiramiz: oltmish ayirish yigirma besh — o'ttiz besh." } }, { ru: '45', uz: '45', wrong: { ru: 'Шестьдесят минус двадцать пять — тридцать пять.', uz: "Oltmish ayirish yigirma besh — o'ttiz besh." } }],
        correct_text: { ru: 'Верно. Тридцать пять.', uz: "To'g'ri. O'ttiz besh." } }
    ],
    audio: { intro: { ru: 'Выбери действие: больше — сложи, меньше — вычти.', uz: "Amalni tanlang: ko'paysa — qo'shing, kamaysa — ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s10 — ikki amalli (word).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' }, label: { ru: 'Два действия', uz: "Ikki amal" },
    rounds: [
      { kind: 'word', q: { ru: 'Было двадцать, добавили тридцать, потом убрали десять. Сколько стало?', uz: "Yigirma edi, o'ttiz qo'shildi, keyin o'n olindi. Nechta bo'ldi?" },
        opts: [{ ru: '40', uz: '40', ok: true }, { ru: '60', uz: '60', wrong: { ru: 'Сначала двадцать плюс тридцать — пятьдесят, потом минус десять — сорок.', uz: "Avval yigirma qo'shuv o'ttiz — ellik, keyin ayirish o'n — qirq." } }, { ru: '50', uz: '50', wrong: { ru: 'Не забудь второе действие: пятьдесят минус десять — сорок.', uz: "Ikkinchi amalni unutmang: ellik ayirish o'n — qirq." } }],
        correct_text: { ru: 'Верно. Сорок.', uz: "To'g'ri. Qirq." } },
      { kind: 'word', q: { ru: 'Было пятьдесят, убрали двадцать, потом добавили пять. Сколько стало?', uz: "Ellik edi, yigirma olindi, keyin besh qo'shildi. Nechta bo'ldi?" },
        opts: [{ ru: '35', uz: '35', ok: true }, { ru: '30', uz: '30', wrong: { ru: 'Не забудь второе действие: тридцать плюс пять — тридцать пять.', uz: "Ikkinchi amalni unutmang: o'ttiz qo'shuv besh — o'ttiz besh." } }, { ru: '75', uz: '75', wrong: { ru: 'Сначала пятьдесят минус двадцать — тридцать, потом плюс пять — тридцать пять.', uz: "Avval ellik ayirish yigirma — o'ttiz, keyin qo'shuv besh — o'ttiz besh." } }],
        correct_text: { ru: 'Верно. Тридцать пять.', uz: "To'g'ri. O'ttiz besh." } }
    ],
    audio: { intro: { ru: 'В два действия: сделай первое, потом второе.', uz: "Ikki amalda: avval birinchini, keyin ikkinchini bajaring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s11 — qo'shish/ayirish aralash.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' }, label: { ru: 'Реши', uz: "Yeching" },
    rounds: [
      { kind: 'calc', a: 64, op: '+', b: 18, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '82', uz: '82', ok: true }, { ru: '72', uz: '72', wrong: { ru: 'Единиц четыре и восемь — двенадцать, переход. Восемьдесят два.', uz: "Birlik to'rt va sakkiz — o'n ikki, o'tish. Sakson ikki." } }, { ru: '46', uz: '46', wrong: { ru: 'Это сложение: шестьдесят четыре плюс восемнадцать — восемьдесят два.', uz: "Bu qo'shish: oltmish to'rt qo'shuv o'n sakkiz — sakson ikki." } }],
        correct_text: { ru: 'Верно. Восемьдесят два.', uz: "To'g'ri. Sakson ikki." } },
      { kind: 'calc', a: 70, op: '−', b: 24, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '46', uz: '46', ok: true }, { ru: '94', uz: '94', wrong: { ru: 'Это вычитание: семьдесят минус двадцать четыре — сорок шесть.', uz: "Bu ayirish: yetmish ayirish yigirma to'rt — qirq olti." } }, { ru: '54', uz: '54', wrong: { ru: 'Семьдесят минус двадцать четыре — сорок шесть.', uz: "Yetmish ayirish yigirma to'rt — qirq olti." } }],
        correct_text: { ru: 'Верно. Сорок шесть.', uz: "To'g'ri. Qirq olti." } }
    ],
    audio: { intro: { ru: 'Смотри на знак: плюс — сложи, минус — вычти.', uz: "Belgiga qarang: qo'shuv — qo'shing, ayirish — ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  s12: { eyebrow: { ru: 'Задача', uz: 'Masala' }, lead: { ru: 'Бит повторяет.', uz: "Bit takrorlaydi." }, audio: { ru: 'Бит повторяет вторую планету.', uz: "Bit ikkinchi sayyorani takrorlaydi." } },

  // s13 — MASALA: word (ikki amal).
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' }, label: { ru: 'Расчёт Бита', uz: "Bit hisobi" },
    story: { ru: 'У Бита было сорок кристаллов, он нашёл ещё пятнадцать, а восемь отдал. Сколько осталось?', uz: "Bitda qirq kristall bor edi, yana o'n beshtasini topdi, sakkiztasini berdi. Nechta qoldi?" },
    kind: 'word', q: { ru: 'Сколько кристаллов осталось?', uz: "Nechta kristall qoldi?" },
    opts: [{ ru: '47', uz: '47', ok: true }, { ru: '63', uz: '63', wrong: { ru: 'Не забудь: сорок плюс пятнадцать — пятьдесят пять, минус восемь — сорок семь.', uz: "Unutmang: qirq qo'shuv o'n besh — ellik besh, ayirish sakkiz — qirq yetti." } }, { ru: '55', uz: '55', wrong: { ru: 'Ещё второе действие: пятьдесят пять минус восемь — сорок семь.', uz: "Yana ikkinchi amal: ellik besh ayirish sakkiz — qirq yetti." } }],
    correct_text: { ru: 'Верно. Сорок семь.', uz: "To'g'ri. Qirq yetti." },
    audio: { intro: { ru: 'У Бита было сорок, нашёл пятнадцать, отдал восемь. Сколько осталось?', uz: "Bitda qirq edi, o'n besh topdi, sakkiz berdi. Nechta qoldi?" }, on_correct: { ru: 'Верно. Сорок семь.', uz: "To'g'ri. Qirq yetti." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s14 — FINAL + FactCard.
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' }, label: { ru: 'Повторение', uz: "Takrorlash" },
    rounds: [
      { kind: 'calc', a: 57, op: '+', b: 26, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '83', uz: '83', ok: true }, { ru: '73', uz: '73', wrong: { ru: 'Единиц семь и шесть — тринадцать, переход. Восемьдесят три.', uz: "Birlik yetti va olti — o'n uch, o'tish. Sakson uch." } }, { ru: '31', uz: '31', wrong: { ru: 'Это сложение: пятьдесят семь плюс двадцать шесть — восемьдесят три.', uz: "Bu qo'shish: ellik yetti qo'shuv yigirma olti — sakson uch." } }],
        correct_text: { ru: 'Верно. Восемьдесят три.', uz: "To'g'ri. Sakson uch." } },
      { kind: 'calc', a: 83, op: '−', b: 7, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '76', uz: '76', ok: true }, { ru: '90', uz: '90', wrong: { ru: 'Здесь минус: восемьдесят три минус семь — семьдесят шесть.', uz: "Bu yerda ayirish: sakson uch ayirish yetti — yetmish olti." } }, { ru: '86', uz: '86', wrong: { ru: 'До восьмидесяти минус три, потом ещё минус четыре — семьдесят шесть.', uz: "Saksongacha ayirish uch, keyin yana ayirish to'rt — yetmish olti." } }],
        correct_text: { ru: 'Верно. Семьдесят шесть.', uz: "To'g'ri. Yetmish olti." } },
      { kind: 'word', q: { ru: 'Было тридцать, добавили двадцать пять, убрали пять. Сколько стало?', uz: "O'ttiz edi, yigirma besh qo'shildi, besh olindi. Nechta bo'ldi?" },
        opts: [{ ru: '50', uz: '50', ok: true }, { ru: '55', uz: '55', wrong: { ru: 'Ещё второе действие: пятьдесят пять минус пять — пятьдесят.', uz: "Yana ikkinchi amal: ellik besh ayirish besh — ellik." } }, { ru: '60', uz: '60', wrong: { ru: 'Тридцать плюс двадцать пять — пятьдесят пять, минус пять — пятьдесят.', uz: "O'ttiz qo'shuv yigirma besh — ellik besh, ayirish besh — ellik." } }],
        correct_text: { ru: 'Верно. Пятьдесят.', uz: "To'g'ri. Ellik." } }
    ],
    fact_badge: { ru: 'Планета 2', uz: 'Sayyora 2' },
    fact_text: { ru: 'Марс позади! Считать в пределах ста мы умеем. Впереди Юпитер.', uz: "Mars orqada qoldi! Yuz ичida hisoblashni bilamiz. Oldinda Yupiter." },
    fact_audio: { ru: 'Марс пройден. Считать в пределах ста мы умеем. Впереди большой Юпитер.', uz: "Mars bosib o'tildi. Yuz ичida hisoblashni bilamiz. Oldinda katta Yupiter." },
    audio: { intro: { ru: 'Последняя проверка второй планеты.', uz: "Ikkinchi sayyoraning oxirgi tekshiruvi." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishга qarang." } }
  },

  // s15 — YAKUN.
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Планета 2 пройдена!', uz: "Sayyora 2 o'tildi!" },
    cando: { ru: 'Ты повторил весь Марс — счёт в пределах ста!', uz: "Butun Marsni takrorladingiz — yuz ичida hisob!" },
    rule_recap: { ru: 'Сложение и вычитание в пределах ста, с переходом, столбик и задачи в два действия — всё повторили.', uz: "Yuz ичida qo'shish va ayirish, o'tish bilan, столбik va ikki amalli masala — hammasini takrorladik." },
    audio: {
      ru: 'Марс пройден. Мы вспомнили сложение и вычитание в пределах ста, столбик и задачи в два действия. Дальше — большой Юпитер.',
      uz: "Mars o'tildi. Yuz ичida qo'shish va ayirish, столбik va ikki amalli masalani esladik. Keyin — katta Yupiter."
    }
  }
};
```
