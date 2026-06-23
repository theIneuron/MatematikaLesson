
// ============================================================
// --- POD UROK: frac_5_13 — To'g'ri, noto'g'ri va aralash sonlar / Правильные, неправильные, смешанные числа ---
// Markaziy misconception 1: "surat maxrajdan katta bo'lolmaydi" (9/4 = xato). YO'Q — bu noto'g'ri kasr.
// Markaziy misconception 2: "aralash son = butun KO'PAYTIRILGAN kasr". YO'Q — bu butun + kasr YIG'INDISI.
// Asosiy usul: noto'g'ri kasr -> aralash son: suratni maxrajga BO'L (qoldiq bilan); butun = bo'linma, qoldiq = yangi surat.
// Vizualizator: FillWholes (to'lib-toshuvchi butun-qutilar) + NumLine (son o'qiga joylash) + dnd (sudrash).
// Hook (sodda hayotiy): Madina non yopdi (har non 4 bo'lak), 9 bo'lak = 9/4; do'sti Kamol "xato" dedi (9/4 = 2 1/4).
// Case: Oybek 11/4 stakan sharbat (= 2 3/4). Yangi qahramonlar: Madina, Kamol, Oybek.
// Maxsus slaydlar: s5 = 5 ta oson savol (SeqMC); s12 = 6-8 misol oson->qiyin har xil tur (SeqMix) = YAKUNIY.
// Drag: s6 = drag-CLASSIFY (To'g'ri/Noto'g'ri/Aralash savatlariga); s11 = drag-ORDER (kichikdan kattaga).
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'frac_5_13',
  lessonTitle: { ru: 'Правильные, неправильные, смешанные числа', uz: "To'g'ri, noto'g'ri va aralash sonlar" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (spaced retrieval: 4/4 = 1)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (noto'g'ri kasr tug'iladi)
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 3  (aralash son + bo'lish-qoldiq)
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 4
  { id: 's5',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },  // 5  (5 ta oson savol)
  { id: 's6',  type: 'test',        template: 'DragClassify',   scored: true,  scope: 'practice' },  // 6  (sudrab klassifikatsiya)
  { id: 's7',  type: 'test',        template: 'MixedInput',     scored: true,  scope: 'practice' },  // 7  (7/4 -> 1 3/4)
  { id: 's8',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 8  (noto'g'risini top)
  { id: 's9',  type: 'case',        template: 'custom',         scored: false, scope: null },       // 9  (Oybek — masala konteksti)
  { id: 's10', type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 10 (11/4 = 2 3/4)
  { id: 's11', type: 'test',        template: 'DragOrder',      scored: true,  scope: 'practice' },  // 11 (kichikdan kattaga sudrash)
  { id: 's12', type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },     // 12 (6-8 misol oson->qiyin = yakuniy)
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }         // 13
];

// ============================================================
// CONTENT — ru + uz + audio (audio TTS-toza: belgisiz, kasrlar so'z bilan "maxrajdan surat")
// ============================================================
const CONTENT = {
  // s0 — HOOK: Madina non 9/4, Kamol "xato" dedi. Ekranda FAQAT sarlavha + FillWholes anim; qolgani OVOZDA.
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Jumboq" },
    title: { ru: 'Приложение показало 9/4 — это ошибка?', uz: "Ilova 9/4 ko'rsatdi — bu xatomi?" },
    lead: { ru: 'Мадина испекла лепёшки. Каждая лепёшка разделена на 4 равные доли.', uz: "Madina non yopdi. Har bir non 4 ta teng bo'lakka bo'lingan." },
    opt0: { ru: 'Да, это ошибка', uz: "Ha, bu xato" },
    opt1: { ru: 'Нет, так бывает', uz: "Yo'q, bunday bo'ladi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Проверим вместе: посмотрим, ошибка это или нет.', uz: "Birga tekshiramiz: bu xatomi yoki yo'qmi, ko'ramiz." },
    reveal1: { ru: 'Верное чутьё. Сейчас увидим, почему так бывает.', uz: "To'g'ri sezgi. Hozir nega bunday bo'lishini ko'ramiz." },
    reveal2: { ru: 'Ничего страшного — к концу урока ответишь уверенно.', uz: "Hechqisi yo'q — dars oxirida ishonch bilan javob berasiz." },
    audio: {
      ru: 'Мадина испекла лепёшки. Каждая лепёшка разделена на четыре равные доли. Она насчитала девять долей, и приложение показало девять четвёртых. Её друг Камол сказал так не бывает, верх не может быть больше низа, это ошибка. Как думаешь, Камол прав? Выбери ответ.',
      uz: "Madina non yopdi. Har bir non to'rtta teng bo'lakka bo'lingan. U to'qqizta bo'lak sanadi va ilova to'rtdan to'qqizni ko'rsatdi. Do'sti Kamol bunday bo'lmaydi, surat maxrajdan katta bo'lolmaydi, bu xato dedi. Sizningcha, Kamol haqmi? Javobni tanlang."
    }
  },

  // s1 — WARMUP (spaced retrieval): 4/4 = 1 (noto'g'ri kasrga ko'prik)
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    bridge: { ru: 'Сначала вспомним одну простую вещь.', uz: "Avval bitta oddiy narsani eslaymiz." },
    title: { ru: 'Одно целое — это сколько долей?', uz: "Bitta butun — bu necha ulush?" },
    question: { ru: 'Лепёшка разделена на 4 доли. Сколько будет 4/4?', uz: "Non 4 ulushga bo'lingan. To'rtdan to'rt nechaga teng?" },
    opt0: { ru: '1', uz: '1' },
    opt1: { ru: '4', uz: '4' },
    opt2: { ru: '1/4', uz: '1/4' },
    correct_text: { ru: 'Верно. Четыре четвёртых доли вместе дают одно целое: 4/4 = 1.', uz: "To'g'ri. To'rtta to'rtdan bir ulush birgalikda bitta butun beradi: 4/4 = 1." },
    hint_1: { ru: 'Четыре — это не доли, а сколько частей в целом. А сколько целых получается из всех четырёх долей?', uz: "To'rt — bu ulush emas, butundagi qismlar soni. Hamma to'rtta ulushdan nechta butun chiqadi?" },
    hint_2: { ru: 'Одна четвёртая это только одна доля. А тут собрали все четыре доли.', uz: "To'rtdan bir bu faqat bitta ulush. Bu yerda esa to'rtala ulush yig'ilgan." },
    wrong_default: { ru: 'Все доли целого вместе дают ровно одно целое. Значит четыре четвёртых это один.', uz: "Butunning hamma ulushi birgalikda roppa rosa bitta butun beradi. Demak to'rtta to'rtdan bir bitta." },
    audio: {
      intro: { ru: 'Сначала разминка. Одна лепёшка разделена на четыре доли. Сколько будет четыре четвёртых? Выбери ответ.', uz: "Avval mashq. Bitta non to'rtta ulushga bo'lingan. To'rtdan to'rt nechaga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Все четыре доли вместе это одно целое. Это нам сейчас пригодится.', uz: "To'g'ri. To'rtala ulush birgalikda bitta butun. Bu hozir asqotadi." },
      on_wrong: { ru: 'Не совсем. Все доли целого вместе дают одно целое.', uz: "Unchalik emas. Butunning hamma ulushi birgalikda bitta butun beradi." }
    }
  },

  // s2 — EXPLORATION (FillWholes step): noto'g'ri kasr tug'iladi (9/4, surat>maxraj)
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    bridge: { ru: 'Раз 4/4 это одно целое, посмотрим, что будет с девятью долями.', uz: "To'rtdan to'rt bitta butun ekan, to'qqizta ulushga nima bo'lishini ko'ramiz." },
    title: { ru: 'Когда долей больше, чем в одном целом', uz: "Ulush bitta butundagidan ko'p bo'lganda" },
    note: { ru: 'Долей оказалось 9, а в одной лепёшке только 4. Верх больше низа — это правильно, так и должно быть. Такую дробь называют неправильной.', uz: "Ulush 9 ta chiqdi, bitta nonda esa atigi 4 ta. Surat maxrajdan katta — bu to'g'ri, shunday bo'lishi kerak. Bunday kasr noto'g'ri kasr deyiladi." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    audio: {
      ru: [
        'Будем добавлять доли по одной лепёшке. Первая лепёшка заполнилась — четыре доли, это одно целое. Нажми кнопку дальше.',
        'Вторая лепёшка тоже заполнилась — ещё одно целое. Уже два целых, восемь долей.',
        'Добавили ещё одну долю в третью лепёшку. Всего девять долей — это девять четвёртых.',
        'Верх дроби девять, низ четыре. Верх больше низа, и это нормально. Такую дробь называют неправильной.'
      ],
      uz: [
        "Bittadan non bo'yicha ulush qo'shamiz. Birinchi non to'ldi — to'rtta ulush, bu bitta butun. Davom etish tugmasini bosing.",
        "Ikkinchi non ham to'ldi — yana bitta butun. Endi ikkita butun, sakkizta ulush.",
        "Uchinchi nonga yana bitta ulush qo'shildi. Hammasi bo'lib to'qqizta ulush — bu to'rtdan to'qqiz.",
        "Kasrning surati to'qqiz, maxraji to'rt. Surat maxrajdan katta, va bu normal. Bunday kasr noto'g'ri kasr deyiladi."
      ]
    }
  },

  // s3 — EXPLORATION (FillWholes mixed + bo'lish-qoldiq): aralash son tug'iladi
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    bridge: { ru: 'А теперь прочитаем те же девять долей по-другому.', uz: "Endi o'sha to'qqizta ulushni boshqacha o'qiymiz." },
    title: { ru: 'Рождение смешанного числа', uz: "Aralash sonning paydo bo'lishi" },
    note: { ru: 'Две лепёшки заполнены целиком — это 2 целых. В третьей одна доля — это 1/4. Вместе: 2 целых и 1/4. Это смешанное число. А найти его просто: 9 разделить на 4 — два, остаток один.', uz: "Ikkita non to'liq to'ldi — bu 2 butun. Uchinchisida bitta ulush — bu 1/4. Birgalikda: 2 butun va 1/4. Bu aralash son. Topish oson: 9 ni 4 ga bo'lsak — ikki, qoldiq bir." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    audio: {
      ru: [
        'Те же девять долей сгруппируем. Две лепёшки заполнены целиком — это два целых. Нажми кнопку дальше.',
        'В третьей лепёшке осталась одна доля из четырёх — это одна четвёртая.',
        'Вместе получается два целых и одна четвёртая. Это и есть смешанное число.',
        'Найти его можно делением. Девять разделить на четыре будет два, остаток один. Два это целые, остаток один это новый верх дроби.'
      ],
      uz: [
        "O'sha to'qqizta ulushni guruhlaymiz. Ikkita non to'liq to'ldi — bu ikkita butun. Davom etish tugmasini bosing.",
        "Uchinchi nonda to'rttadan bitta ulush qoldi — bu to'rtdan bir.",
        "Birgalikda ikki butun va to'rtdan bir bo'ladi. Mana shu aralash son.",
        "Uni bo'lish bilan topsa bo'ladi. To'qqizni to'rtga bo'lsak ikki bo'ladi, qoldiq bir. Ikki — bu butun, qoldiq bir — bu kasrning yangi surati."
      ]
    }
  },

  // s4 — RULE: 3 ta'rif + "yig'indi, ko'paytma emas" ogohlantirish + fakt
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Соберём три новых слова в одно короткое правило.', uz: "Uchta yangi so'zni bitta qisqa qoidaga yig'amiz." },
    title: { ru: 'Три вида чисел из долей', uz: "Ulushlardan uch xil son" },
    def1_h: { ru: 'Правильная дробь', uz: "To'g'ri kasr" },
    def1: { ru: 'верх меньше низа, она меньше единицы. Например 3/4.', uz: "surat maxrajdan kichik, u birdan kichik. Masalan 3/4." },
    def2_h: { ru: 'Неправильная дробь', uz: "Noto'g'ri kasr" },
    def2: { ru: 'верх больше низа или равен ему, она больше единицы или равна. Например 9/4, 4/4.', uz: "surat maxrajdan katta yoki teng, u birdan katta yoki teng. Masalan 9/4, 4/4." },
    def3_h: { ru: 'Смешанное число', uz: "Aralash son" },
    def3: { ru: 'целое и правильная дробь рядом. Например 2 1/4.', uz: "butun son va to'g'ri kasr yonma-yon. Masalan 2 1/4." },
    warn: { ru: 'Смешанное число — это сумма целого и дроби, а не произведение. 2 1/4 = 2 + 1/4.', uz: "Aralash son — bu butun va kasrning yig'indisi, ko'paytmasi emas. 2 1/4 = 2 + 1/4." },
    fact: { ru: 'Записывать смешанное число — целое рядом с дробью — начали индийские математики больше тысячи лет назад. Поэтому и мы пишем целое слева от дроби.', uz: "Aralash sonni — butunni kasr yoniga — yozishni hind matematiklari ming yildan ko'proq oldin boshlagan. Shuning uchun biz ham butunni kasrning chap tomoniga yozamiz." },
    fact_btn: { ru: 'Интересный факт', uz: "Qiziqarli fakt" },
    audio: {
      ru: [
        'Запомни три слова. Первое. Правильная дробь, у неё верх меньше низа, она меньше одного целого. Второе. Неправильная дробь, у неё верх больше низа или равен ему, она больше одного целого или равна. Третье. Смешанное число, это целое и правильная дробь рядом. И самое важное. Смешанное число это сумма целого и дроби, а не произведение. Два целых одна четвёртая это два плюс одна четвёртая.',
        'Интересный факт. Записывать смешанное число, целое рядом с дробью, начали индийские математики больше тысячи лет назад. Поэтому и мы пишем целое слева от дроби.'
      ],
      uz: [
        "Uchta so'zni eslab qoling. Birinchi. To'g'ri kasr, uning surati maxrajdan kichik, u bitta butundan kichik. Ikkinchi. Noto'g'ri kasr, uning surati maxrajdan katta yoki teng, u bitta butundan katta yoki teng. Uchinchi. Aralash son, bu butun va to'g'ri kasr yonma-yon. Va eng muhimi. Aralash son butun va kasrning yig'indisi, ko'paytmasi emas. Ikki butun to'rtdan bir bu ikki qo'shuv to'rtdan bir.",
        "Qiziqarli fakt. Aralash sonni, butunni kasr yoniga yozishni hind matematiklari ming yildan ko'proq oldin boshlagan. Shuning uchun biz ham butunni kasrning chap tomoniga yozamiz."
      ]
    }
  },

  // s5 — TEST SeqMC: 5 ta OSON savol (to'g'ri javob pozitsiyalari A/B/C/A/B bo'ylab)
  s5: {
    eyebrow: { ru: 'Разминка · 5 вопросов', uz: "Mashq · 5 ta savol" },
    bridge: { ru: 'Правило ясно — закрепим на пяти быстрых вопросах.', uz: "Qoida tushunarli — beshta tezkor savolda mustahkamlaymiz." },
    title: { ru: 'Пять быстрых вопросов', uz: "Beshta tezkor savol" },
    lead: { ru: 'Определи вид числа или ответь коротко.', uz: "Son turini aniqlang yoki qisqa javob bering." },
    questions: [
      { q: { ru: 'Какая это дробь: 3/4?', uz: '3/4 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 0,
        ok: { ru: 'Верно. Верх меньше низа — дробь правильная.', uz: "To'g'ri. Surat maxrajdan kichik — kasr to'g'ri." },
        no: { ru: 'Посмотри на верх и низ: верх меньше низа.', uz: "Surat va maxrajga qarang: surat maxrajdan kichik." },
        say: { ru: 'Какая это дробь, три четвёртых?', uz: "To'rtdan uch — qaysi kasr?" } },
      { q: { ru: 'Какая это дробь: 7/4?', uz: '7/4 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 1,
        ok: { ru: 'Верно. Верх больше низа — дробь неправильная.', uz: "To'g'ri. Surat maxrajdan katta — kasr noto'g'ri." },
        no: { ru: 'Верх больше низа, значит дробь больше целого.', uz: "Surat maxrajdan katta, demak kasr butundan katta." },
        say: { ru: 'Какая это дробь, семь четвёртых?', uz: "To'rtdan yetti — qaysi kasr?" } },
      { q: { ru: 'Какое это число: 2 1/3?', uz: '2 1/3 — qaysi son?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 2,
        ok: { ru: 'Верно. Целое и дробь рядом — смешанное число.', uz: "To'g'ri. Butun va kasr yonma-yon — aralash son." },
        no: { ru: 'Тут есть целое число рядом с дробью.', uz: "Bu yerda kasr yonida butun son bor." },
        say: { ru: 'Какое это число, два целых одна третья?', uz: "Ikki butun uchdan bir — qaysi son?" } },
      { q: { ru: 'В неправильной дроби верх...', uz: "Noto'g'ri kasrda surat..." }, opts: [{ ru: 'больше или равен', uz: "katta yoki teng" }, { ru: 'всегда меньше', uz: "doim kichik" }, { ru: 'всегда равен', uz: "doim teng" }], correct: 0,
        ok: { ru: 'Верно. Верх больше низа или равен ему.', uz: "To'g'ri. Surat maxrajdan katta yoki unga teng." },
        no: { ru: 'Вспомни 9/4 и 4/4: верх не меньше низа.', uz: "9/4 va 4/4 ni eslang: surat maxrajdan kichik emas." },
        say: { ru: 'В неправильной дроби верх какой?', uz: "Noto'g'ri kasrda surat qanday?" } },
      { q: { ru: 'Сколько целых в 5/4?', uz: "5/4 da nechta butun bor?" }, opts: [{ ru: '5', uz: '5' }, { ru: '1', uz: '1' }, { ru: '4', uz: '4' }], correct: 1,
        ok: { ru: 'Верно. 5/4 это одно целое и одна четвёртая.', uz: "To'g'ri. 5/4 bu bitta butun va to'rtdan bir." },
        no: { ru: 'Раздели 5 на 4: сколько целых лепёшек получится?', uz: "5 ni 4 ga bo'ling: nechta to'la non chiqadi?" },
        say: { ru: 'Сколько целых в пяти четвёртых?', uz: "To'rtdan beshda nechta butun bor?" } }
    ],
    audio: {
      intro: { ru: 'Разминка. Пять быстрых вопросов. Первый. Какая это дробь, три четвёртых? Выбери ответ.', uz: "Mashq. Beshta tezkor savol. Birinchi. To'rtdan uch — qaysi kasr? Javobni tanlang." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." },
      on_done: { ru: 'Все пять верно. Виды чисел ты различаешь уверенно.', uz: "Beshalasi to'g'ri. Son turlarini ishonch bilan ajratyapsiz." }
    }
  },

  // s6 — TEST DragClassify: kasrlarni To'g'ri / Noto'g'ri / Aralash savatlariga sudrash
  s6: {
    eyebrow: { ru: 'Перетащи · разбери', uz: "Sudrab ajrating" },
    bridge: { ru: 'Теперь сам разложи числа по трём корзинам.', uz: "Endi sonlarni uchta savatga o'zingiz ajrating." },
    title: { ru: 'Разложи по видам', uz: "Turlarga ajrating" },
    lead: { ru: 'Перетащи каждое число в нужную корзину (или нажми число, потом корзину).', uz: "Har bir sonni kerakli savatga suring (yoki sonni, keyin savatni bosing)." },
    bin_T: { ru: 'Правильная', uz: "To'g'ri" },
    bin_N: { ru: 'Неправильная', uz: "Noto'g'ri" },
    bin_A: { ru: 'Смешанное', uz: "Aralash" },
    tray_label: { ru: 'Числа', uz: "Sonlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Не всё на месте. Правильная — верх меньше низа; неправильная — верх не меньше низа; смешанное — есть целое рядом.', uz: "Hammasi joyida emas. To'g'ri — surat maxrajdan kichik; noto'g'ri — surat maxrajdan kichik emas; aralash — yonida butun bor." },
    fb_correct: { ru: 'Верно. Каждое число в своей корзине: вид определяется по верху, низу и наличию целого.', uz: "To'g'ri. Har bir son o'z savatida: tur surat, maxraj va butun bor-yo'qligi bilan aniqlanadi." },
    audio: {
      intro: { ru: 'Разложи шесть чисел по трём корзинам. Правильная дробь, неправильная дробь и смешанное число. Перетащи число в корзину или нажми число, потом корзину. Когда разложишь все, нажми кнопку проверить.', uz: "Olti sonni uchta savatga ajrating. To'g'ri kasr, noto'g'ri kasr va aralash son. Sonni savatga suring yoki sonni, keyin savatni bosing. Hammasini ajratgach, tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Все числа на своих местах.', uz: "To'g'ri. Hamma son o'z joyida." },
      on_wrong: { ru: 'Пока не всё на месте. Правильная меньше целого, неправильная не меньше целого, у смешанного есть целое рядом.', uz: "Hozircha hammasi joyida emas. To'g'ri kasr butundan kichik, noto'g'ri kichik emas, aralash sonda yonida butun bor." }
    }
  },

  // s7 — TEST MixedInput: 7/4 = 1 butun 3/4
  s7: {
    eyebrow: { ru: 'Переведи', uz: "O'tkazing" },
    bridge: { ru: 'Переведём неправильную дробь в смешанное число сами.', uz: "Noto'g'ri kasrni aralash songa o'zimiz o'tkazamiz." },
    title: { ru: 'Из неправильной дроби в смешанное число', uz: "Noto'g'ri kasrdan aralash songa" },
    question: { ru: 'Запиши 7/4 как смешанное число: 7/4 = ? целых ?/4', uz: "7/4 ni aralash son qilib yozing: 7/4 = ? butun ?/4" },
    label_whole: { ru: 'целых', uz: "butun" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Раздели верх на низ: семь разделить на четыре. Целая часть это сколько раз четыре уложилось, остаток это новый верх.', uz: "Suratni maxrajga bo'ling: yettini to'rtga bo'ling. Butun qism — to'rt necha marta joylashgani, qoldiq — yangi surat." },
    fb_correct: { ru: 'Верно. 7 разделить на 4 — один, остаток три. Значит 7/4 = 1 целая 3/4.', uz: "To'g'ri. 7 ni 4 ga bo'lsak — bir, qoldiq uch. Demak 7/4 = 1 butun 3/4." },
    audio: {
      intro: { ru: 'Переведи семь четвёртых в смешанное число. Сколько целых и сколько четвёртых останется? Раздели семь на четыре. Введи целую часть и верх дроби, потом нажми кнопку проверить.', uz: "To'rtdan yettini aralash songa o'tkazing. Nechta butun va to'rtdan nechta qoladi? Yettini to'rtga bo'ling. Butun qismni va kasrning suratini kiriting, keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Семь разделить на четыре будет один, остаток три. Семь четвёртых это одно целое и три четвёртых.', uz: "To'g'ri. Yettini to'rtga bo'lsak bir bo'ladi, qoldiq uch. To'rtdan yetti bu bitta butun va to'rtdan uch." },
      on_wrong: { ru: 'Не совсем. Раздели семь на четыре: целая часть один, остаток три.', uz: "Unchalik emas. Yettini to'rtga bo'ling: butun qism bir, qoldiq uch." }
    }
  },

  // s8 — TEST: noto'g'risini top (error-spotting). To'g'ri javob = XATO yozuv (opt0).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    bridge: { ru: 'А теперь поймай ошибку в чужой записи.', uz: "Endi birovning yozuvidagi xatoni toping." },
    title: { ru: 'Найди неверную запись', uz: "Noto'g'ri yozuvni toping" },
    question: { ru: 'Какая запись НЕВЕРНА?', uz: "Qaysi yozuv NOTO'G'RI?" },
    opt0: { ru: '5/4 = 5 целых 1/4', uz: '5/4 = 5 butun 1/4' },
    opt1: { ru: '9/4 = 2 целых 1/4', uz: '9/4 = 2 butun 1/4' },
    opt2: { ru: '3/4 — правильная дробь', uz: "3/4 — to'g'ri kasr" },
    correct_text: { ru: 'Верно — неверна именно эта. Целое берут не из верха, а из числа целых лепёшек: 5/4 = 1 целая 1/4, а не 5 целых.', uz: "To'g'ri — aynan shu noto'g'ri. Butun surat sonidan emas, to'la nonlar sonidan olinadi: 5/4 = 1 butun 1/4, 5 butun emas." },
    hint_1: { ru: 'Эта запись верная: девять четвёртых это две целых лепёшки и одна доля.', uz: "Bu yozuv to'g'ri: to'rtdan to'qqiz bu ikkita to'la non va bitta ulush." },
    hint_2: { ru: 'Эта запись верная: верх меньше низа, значит дробь правильная.', uz: "Bu yozuv to'g'ri: surat maxrajdan kichik, demak kasr to'g'ri." },
    wrong_default: { ru: 'Ищи запись, где целую часть взяли прямо из верха дроби. Так нельзя.', uz: "Butun qismni to'g'ridan to'g'ri kasrning suratidan olgan yozuvni qidiring. Bunday qilib bo'lmaydi." },
    fact: { ru: 'В рецептах часто пишут смешанным числом: полтора стакана муки — это 1 1/2 стакана, а дробью 3/2.', uz: "Retseptlarda ko'pincha aralash son yoziladi: bir yarim stakan un — bu 1 1/2 stakan, kasr bilan 3/2." },
    audio: {
      intro: { ru: 'Поймай ошибку. Среди трёх записей одна неверна. Найди, где целую часть взяли прямо из верха дроби. Выбери неверную запись.', uz: "Xatoni toping. Uchta yozuvdan biri noto'g'ri. Butun qismni to'g'ridan to'g'ri kasr suratidan olgan joyni toping. Noto'g'ri yozuvni tanlang." },
      on_correct: { ru: 'Верно. Целую часть берут из числа целых лепёшек, а не из верха дроби. Кстати, в рецептах полтора стакана это смешанное число.', uz: "To'g'ri. Butun qism to'la nonlar sonidan olinadi, kasr suratidan emas. Aytmoqchi, retseptdagi bir yarim stakan — bu aralash son." },
      on_wrong: { ru: 'Эта запись верная. Ищи ту, где целую часть взяли из верха дроби.', uz: "Bu yozuv to'g'ri. Butun qismni kasr suratidan olgan yozuvni qidiring." }
    }
  },

  // s9 — CASE intro (Oybek): 11/4 stakan sharbat
  s9: {
    eyebrow: { ru: 'Задача · Ойбек', uz: "Masala · Oybek" },
    bridge: { ru: 'Смешанные числа встречаются в жизни. Помоги Ойбеку.', uz: "Aralash sonlar hayotda uchraydi. Oybekka yordam bering." },
    title: { ru: 'У Ойбека 11/4 стакана сока.', uz: "Oybekda 11/4 stakan sharbat bor." },
    body: { ru: 'Каждый стакан делится на 4 равные части, и у Ойбека 11 таких частей. Сколько это полных стаканов и сколько останется? Сначала прикинь, потом проверим.', uz: "Har stakan 4 ta teng qismga bo'linadi, Oybekda esa 11 ta shunday qism bor. Bu nechta to'la stakan va qancha ortadi? Avval chamalang, keyin tekshiramiz." },
    hint_card: { ru: 'Раздели 11 на 4: целая часть и остаток.', uz: "11 ni 4 ga bo'ling: butun qism va qoldiq." },
    audio: { ru: 'У Ойбека одиннадцать четвёртых стакана сока. Каждый стакан делится на четыре части, и таких частей одиннадцать. Сколько это полных стаканов и сколько останется? Раздели одиннадцать на четыре. Прикинь ответ, на следующем шаге проверим.', uz: "Oybekda to'rtdan o'n bir stakan sharbat bor. Har stakan to'rtta qismga bo'linadi, shunday qism o'n bitta. Bu nechta to'la stakan va qancha ortadi? O'n birni to'rtga bo'ling. Javobni chamalang, keyingi qadamda tekshiramiz." }
  },

  // s10 — CASE MC: 11/4 = 2 3/4 (to'g'ri = opt0; order [2,0,3,1])
  s10: {
    eyebrow: { ru: 'Задача · Ойбек', uz: "Masala · Oybek" },
    bridge: { ru: 'Теперь посчитаем точно.', uz: "Endi aniq hisoblaymiz." },
    title: { ru: 'Сок Ойбека', uz: "Oybekning sharbati" },
    question: { ru: 'Сколько это стаканов? 11/4 = ?', uz: "Bu necha stakan? 11/4 = ?" },
    opt0: { ru: '2 целых 3/4', uz: '2 butun 3/4' },
    opt1: { ru: '2 целых 1/4', uz: '2 butun 1/4' },
    opt2: { ru: '4 целых 3/4', uz: '4 butun 3/4' },
    opt3: { ru: '11 целых 1/4', uz: '11 butun 1/4' },
    correct_text: { ru: 'Верно. 11 разделить на 4 — два, остаток три. Значит 11/4 = 2 целых 3/4 стакана.', uz: "To'g'ri. 11 ni 4 ga bo'lsak — ikki, qoldiq uch. Demak 11/4 = 2 butun 3/4 stakan." },
    hint_1: { ru: 'Раздели 11 на 4. Сколько раз четыре уложилось целиком и что в остатке?', uz: "11 ni 4 ga bo'ling. To'rt necha marta to'la joylashdi va qoldiqda nima qoldi?" },
    hint_2: { ru: 'Целых тут больше двух не получится: два целых стакана и остаток.', uz: "Bu yerda ikkitadan ortiq butun chiqmaydi: ikkita to'la stakan va qoldiq." },
    hint_3: { ru: 'Целое берут из числа полных стаканов, а не из верха дроби.', uz: "Butun to'la stakanlar sonidan olinadi, kasr suratidan emas." },
    wrong_default: { ru: 'Раздели одиннадцать на четыре: целая часть два, остаток три. Это два целых и три четвёртых.', uz: "O'n birni to'rtga bo'ling: butun qism ikki, qoldiq uch. Bu ikki butun, to'rtdan uch." },
    fact: { ru: 'Время тоже мерят смешанным числом: 1 час 30 минут — это 1 целый и 1/2 часа.', uz: "Vaqt ham aralash son bilan o'lchanadi: 1 soat 30 daqiqa — bu 1 butun va 1/2 soat." },
    audio: {
      intro: { ru: 'Теперь точный счёт. Сколько это стаканов? Одиннадцать четвёртых. Выбери ответ.', uz: "Endi aniq hisob. Bu necha stakan? To'rtdan o'n bir. Javobni tanlang." },
      on_correct: { ru: 'Верно. Одиннадцать разделить на четыре будет два, остаток три. Это два целых и три четвёртых стакана. Кстати, время тоже мерят смешанным числом, час тридцать это полтора часа.', uz: "To'g'ri. O'n birni to'rtga bo'lsak ikki bo'ladi, qoldiq uch. Bu ikki butun va to'rtdan uch stakan. Aytmoqchi, vaqt ham aralash son bilan o'lchanadi, bir soat o'ttiz daqiqa bu bir yarim soat." },
      on_wrong: { ru: 'Не совсем. Раздели одиннадцать на четыре: целых два, остаток три.', uz: "Unchalik emas. O'n birni to'rtga bo'ling: butun ikki, qoldiq uch." }
    }
  },

  // s11 — TEST DragOrder: kichikdan kattaga (1/2, 5/4, 2/3, 1 1/2)
  s11: {
    eyebrow: { ru: 'Перетащи · по порядку', uz: "Sudrab tartiblang" },
    bridge: { ru: 'Сравним правильные, неправильные и смешанные вместе.', uz: "To'g'ri, noto'g'ri va aralash sonlarni birga solishtiramiz." },
    title: { ru: 'Расставь от меньшего к большему', uz: "Kichikdan kattaga joylashtiring" },
    lead: { ru: 'Перетащи числа в слоты по возрастанию (или нажми число, потом слот).', uz: "Sonlarni o'sish tartibida kataklarga suring (yoki sonni, keyin katakni bosing)." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Не по порядку. Меньше единицы — это правильные дроби, больше единицы — неправильные и смешанные.', uz: "Tartib noto'g'ri. Birdan kichigi — to'g'ri kasrlar, birdan kattasi — noto'g'ri va aralash sonlar." },
    fb_correct: { ru: 'Верно. По возрастанию: 1/2, 2/3, 5/4, 1 1/2. Правильные дроби меньше единицы, неправильная и смешанное больше.', uz: "To'g'ri. O'sish tartibida: 1/2, 2/3, 5/4, 1 1/2. To'g'ri kasrlar birdan kichik, noto'g'ri va aralash kattaroq." },
    audio: {
      intro: { ru: 'Расставь четыре числа от меньшего к большему. Перетащи число в слот или нажми число, потом слот. Когда расставишь все, нажми кнопку проверить.', uz: "To'rtta sonni kichikdan kattaga joylashtiring. Sonni katakka suring yoki sonni, keyin katakni bosing. Hammasini joylagach, tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Порядок правильный: половина, две третьих, пять четвёртых, полтора.', uz: "To'g'ri. Tartib to'g'ri: yarim, uchdan ikki, to'rtdan besh, bir yarim." },
      on_wrong: { ru: 'Пока не по порядку. Меньше одного целого идут правильные дроби, потом больше единицы.', uz: "Hozircha tartib noto'g'ri. Bitta butundan kichigi to'g'ri kasrlar, keyin birdan kattasi keladi." }
    }
  },

  // s12 — YAKUNIY TEST (SeqMix): 7 misol oson->qiyin, har xil tur (mc/minput/place)
  s12: {
    eyebrow: { ru: 'Итоговое · 7 заданий', uz: "Yakuniy · 7 ta topshiriq" },
    bridge: { ru: 'Финал: соберём всё на семи заданиях.', uz: "Final: hammasini yettita topshiriqda birlashtiramiz." },
    title: { ru: 'Итог: от лёгкого к трудному', uz: "Yakun: oddiydan qiyinga" },
    lead: { ru: 'Семь заданий разного типа. Не торопись.', uz: "Yettita har xil turdagi topshiriq. Shoshmang." },
    done_text: { ru: 'Все семь пройдены. Ты уверенно различаешь дроби и переводишь их в смешанные числа.', uz: "Yettalasi bajarildi. Siz kasrlarni ishonch bilan ajratib, aralash songa o'tkazyapsiz." },
    items: [
      // 1 — mc-classify oson
      { type: 'mc', prompt: { ru: 'Какая это дробь: 2/5?', uz: '2/5 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 0,
        say: { ru: 'Какая это дробь, две пятых?', uz: "Beshdan ikki — qaysi kasr?" },
        ok: { ru: 'Верх меньше низа — правильная.', uz: "Surat maxrajdan kichik — to'g'ri." },
        no: { ru: 'Верх меньше низа.', uz: "Surat maxrajdan kichik." } },
      // 2 — mc-classify
      { type: 'mc', prompt: { ru: 'Какая это дробь: 8/5?', uz: '8/5 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 1,
        say: { ru: 'Какая это дробь, восемь пятых?', uz: "Beshdan sakkiz — qaysi kasr?" },
        ok: { ru: 'Верх больше низа — неправильная.', uz: "Surat maxrajdan katta — noto'g'ri." },
        no: { ru: 'Верх больше низа.', uz: "Surat maxrajdan katta." } },
      // 3 — minput oson
      { type: 'minput', prompt: { ru: 'Переведи: 5/4 = ? целых ?/4', uz: '5/4 ni o\'tkaz: 5/4 = ? butun ?/4' }, w: 1, num: 1, den: 4,
        say: { ru: 'Переведи пять четвёртых в смешанное число.', uz: "To'rtdan beshni aralash songa o'tkazing." },
        ok: { ru: '5 разделить на 4 — один, остаток один.', uz: "5 ni 4 ga bo'lsak — bir, qoldiq bir." },
        no: { ru: 'Раздели 5 на 4: целое один, остаток один.', uz: "5 ni 4 ga bo'ling: butun bir, qoldiq bir." } },
      // 4 — place oson (5/4 = 1.25 son o'qida)
      { type: 'place', prompt: { ru: 'Поставь 5/4 на числовой прямой', uz: "5/4 ni son o'qiga qo'ying" }, max: 2, den: 4, targetK: 5,
        say: { ru: 'Поставь пять четвёртых на числовой прямой. Это между одним и двумя.', uz: "To'rtdan beshni son o'qiga qo'ying. Bu bir bilan ikki orasida." },
        ok: { ru: 'Верно. 5/4 это чуть больше одного целого.', uz: "To'g'ri. 5/4 bu bitta butundan sal kattaroq." },
        no: { ru: '5/4 больше единицы, но меньше двух.', uz: "5/4 birdan katta, lekin ikkidan kichik." } },
      // 5 — mc find-wrong
      { type: 'mc', prompt: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" }, opts: [{ ru: '3/2 = 1 1/2', uz: '3/2 = 1 1/2' }, { ru: '6/6 = 1 целая 1/6', uz: '6/6 = 1 butun 1/6' }, { ru: '2/3 — правильная', uz: "2/3 — to'g'ri" }], correct: 1,
        say: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
        ok: { ru: '6/6 это ровно одно целое, без остатка.', uz: "6/6 bu roppa rosa bitta butun, qoldiqsiz." },
        no: { ru: '6/6 это один, остатка нет.', uz: "6/6 bu bir, qoldiq yo'q." } },
      // 6 — minput qiyin (11/4 = 2 3/4)
      { type: 'minput', prompt: { ru: 'Переведи: 11/4 = ? целых ?/4', uz: '11/4 ni o\'tkaz: 11/4 = ? butun ?/4' }, w: 2, num: 3, den: 4,
        say: { ru: 'Переведи одиннадцать четвёртых в смешанное число.', uz: "To'rtdan o'n birni aralash songa o'tkazing." },
        ok: { ru: '11 разделить на 4 — два, остаток три.', uz: "11 ni 4 ga bo'lsak — ikki, qoldiq uch." },
        no: { ru: 'Раздели 11 на 4: целое два, остаток три.', uz: "11 ni 4 ga bo'ling: butun ikki, qoldiq uch." } },
      // 7 — place qiyin (2 1/3 son o'qida, max 3 den 3 -> k=7)
      { type: 'place', prompt: { ru: 'Поставь 2 1/3 на числовой прямой', uz: "2 1/3 ni son o'qiga qo'ying" }, max: 3, den: 3, targetK: 7,
        say: { ru: 'Поставь два целых одну третью на числовой прямой. Это между двумя и тремя.', uz: "Ikki butun uchdan birni son o'qiga qo'ying. Bu ikki bilan uch orasida." },
        ok: { ru: 'Верно. Самое трудное — и оно сделано.', uz: "To'g'ri. Eng qiyini — u ham bajarildi." },
        no: { ru: '2 1/3 чуть больше двух целых.', uz: "2 1/3 ikki butundan sal kattaroq." } }
    ],
    audio: {
      intro: { ru: 'Итоговый тренажёр. Семь заданий от лёгкого к трудному, форматы разные. Первое. Какая это дробь, две пятых?', uz: "Yakuniy trenajyor. Yettita topshiriq oddiydan qiyinga, formatlar har xil. Birinchi. Beshdan ikki — qaysi kasr?" },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку и попробуй снова.', uz: "Unchalik emas. Maslahatga qarang va yana urinib ko'ring." },
      on_done: { ru: 'Все семь пройдены, включая самое трудное. Отличная работа.', uz: "Yettalasi, eng qiyini bilan birga, bajarildi. Ajoyib ish." }
    }
  },

  // s13 — SUMMARY (Dars09-13 kanonik): score + hookni yopadi + ConnectionsBlock
  s13: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    title: { ru: 'Девять четвёртых — не ошибка', uz: "To'rtdan to'qqiz — xato emas" },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "birinchi urinishda to'g'ri javob" },
    hook_label: { ru: 'Ответ на загадку', uz: "Jumboqqa javob" },
    hook_text: { ru: 'Мадина насчитала 9 долей. 9/4 — это неправильная дробь, а не ошибка. Она равна 2 целым и 1/4: 9/4 = 2 1/4. Камол ошибся: верх может быть больше низа.', uz: "Madina 9 ta ulush sanadi. 9/4 — bu noto'g'ri kasr, xato emas. U 2 butun va 1/4 ga teng: 9/4 = 2 1/4. Kamol xato qildi: surat maxrajdan katta bo'lishi mumkin." },
    main_label: { ru: 'Что запомнить', uz: "Nimani eslab qolish kerak" },
    main_1: { ru: '1. Правильная дробь меньше целого, неправильная больше или равна целому.', uz: "1. To'g'ri kasr butundan kichik, noto'g'ri kasr butundan katta yoki teng." },
    main_2: { ru: '2. Смешанное число — это целое плюс правильная дробь, а не произведение.', uz: "2. Aralash son — bu butun qo'shuv to'g'ri kasr, ko'paytma emas." },
    main_3: { ru: '3. Из неправильной дроби в смешанное: верх делим на низ, целое = частное, остаток = новый верх.', uz: "3. Noto'g'ri kasrdan aralashga: suratni maxrajga bo'lamiz, butun = bo'linma, qoldiq = yangi surat." },
    next_note: { ru: 'А обратный перевод — из смешанного числа в неправильную дробь — на следующем уроке.', uz: "Teskari o'tkazish — aralash sondan noto'g'ri kasrga — keyingi darsda." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Понятие дроби; сравнение дробей.', uz: "Kasr tushunchasi; kasrlarni taqqoslash." },
    conn_label_next: { ru: 'Следующий урок', uz: "Keyingi dars" },
    conn_next: { ru: 'Перевод смешанного числа в неправильную дробь и обратно.', uz: "Aralash sonni noto'g'ri kasrga va aksincha o'tkazish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: 'Подведём итог. Мадина насчитала девять долей. Девять четвёртых это неправильная дробь, а не ошибка. Она равна двум целым и одной четвёртой. Камол ошибся, ведь верх может быть больше низа. Запомни. Правильная дробь меньше целого, неправильная больше целого или равна ему. Смешанное число это целое плюс правильная дробь, а не произведение. Чтобы перевести неправильную дробь в смешанное число, делим верх на низ, целое это частное, остаток это новый верх. А обратный перевод мы изучим на следующем уроке.', uz: "Yakun qilamiz. Madina to'qqizta ulush sanadi. To'rtdan to'qqiz bu noto'g'ri kasr, xato emas. U ikki butun va to'rtdan birga teng. Kamol xato qildi, chunki surat maxrajdan katta bo'lishi mumkin. Eslab qoling. To'g'ri kasr butundan kichik, noto'g'ri kasr butundan katta yoki unga teng. Aralash son bu butun qo'shuv to'g'ri kasr, ko'paytma emas. Noto'g'ri kasrni aralash songa o'tkazish uchun suratni maxrajga bo'lamiz, butun bu bo'linma, qoldiq bu yangi surat. Teskari o'tkazishni esa keyingi darsda o'rganamiz." }
  }
};

// ============================================================
// QAYTA ISHLATILADIGAN YORDAMCHILAR (Dars28 etalonidan aynan)
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const optEl = (t, node) => <span className="body" style={{ display: 'inline' }}>{mt(t(node))}</span>;
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// FAKT-BLOK — ko'k karta (Dars28 etalonidan)
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_LIFE = { ru: 'Знаешь ли ты? · Из жизни', uz: "Bilasizmi? · Hayotdan" };
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
// Fakt-animatsiyalar (ko'k tema, CSS-only loop)
const AnimMixed = () => (
  <div className="pa-st" aria-hidden="true">
    {['2', '+', '1/4'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.4}s`, fontSize: '0.7em' }}>{mt(ch)}</span>
    ))}
  </div>
);
const AnimCup = () => (
  <div className="fa-cup" aria-hidden="true"><span className="fa-cup-fill"/><span className="fa-cup-mark"/></div>
);
const AnimClock = () => (
  <div className="fa-clock" aria-hidden="true"><span className="fa-clock-h"/><span className="fa-clock-m"/></div>
);

// ============================================================
// VIZUALIZATOR — FillWholes (to'lib-toshuvchi butun-qutilar) + NumLine (son o'qi)
// ============================================================
// FillWholes: `wholes` ta butun-quti yonma-yon, har biri `den` katak. `filled` katak chapdan to'ladi.
// mixed=false: barcha to'la katak yashil. mixed=true: to'liq to'lgan quti "1" badge + yashil; qisman quti accent.
const FillWholes = ({ den, filled, wholes, mixed = false, animate = true, max = 360 }) => {
  const boxes = [];
  for (let w = 0; w < wholes; w++) {
    const fullThisBox = Math.min(den, Math.max(0, filled - w * den));
    const boxComplete = fullThisBox === den;
    const cells = [];
    for (let i = 0; i < den; i++) {
      const on = i < fullThisBox;
      let cls = 'fw-cell';
      if (on) cls += mixed ? (boxComplete ? ' fw-on-whole' : ' fw-on-part') : ' fw-on';
      cells.push(<span key={i} className={cls} style={animate ? { transitionDelay: `${(w * den + i) * 0.05}s` } : undefined}/>);
    }
    boxes.push(
      <div key={w} className={`fw-box${boxComplete ? ' fw-box-done' : ''}`}>
        {cells}
        {mixed && boxComplete && <span className="fw-badge">1</span>}
      </div>
    );
  }
  return <div className="fw-row" aria-hidden="true" style={{ maxWidth: max }}>{boxes}</div>;
};

// NumLine — 0..max son o'qi, har k/den da nuqta; butun belgilar yorliqli. Bosib joylanadi (place test).
const NumLine = ({ max, den, picked, targetK, solved, onPick }) => {
  const total = max * den;
  const dots = [];
  for (let k = 0; k <= total; k++) {
    const left = (k / total) * 100;
    const isInt = k % den === 0;
    const isPicked = picked === k;
    const right = solved && k === targetK;
    let cls = 'nl-dot';
    if (isInt) cls += ' nl-dot-int';
    if (isPicked) cls += right ? ' nl-dot-ok' : ' nl-dot-sel';
    dots.push(
      <button key={k} className={cls} style={{ left: `${left}%` }} disabled={solved}
        onClick={() => onPick && onPick(k)} aria-label={`${k}`}>
        {isInt && <span className="nl-int-lbl">{k / den}</span>}
      </button>
    );
  }
  return (
    <div className="nl-wrap">
      <div className="nl-track"/>
      {(picked !== null && picked !== undefined) && <span className={`nl-marker${solved && picked === targetK ? ' nl-marker-ok' : ''}`} style={{ left: `${(picked / total) * 100}%` }}/>}
      {dots}
    </div>
  );
};

// ============================================================
// MixedInputScreen — noto'g'ri kasrni aralash songa: butun + surat (ikki maydon), maxraj qat'iy.
// ============================================================
const MixedInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, w, num, den, figure, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [whole, setWhole] = useState(wasSolved ? String(w) : (storedAnswer?.studentWhole ?? ''));
  const [top, setTop] = useState(wasSolved ? String(num) : (storedAnswer?.studentTop ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const wv = parseInt(whole, 10); const tv = parseInt(top, 10);
    if (isNaN(wv) || isNaN(tv)) return;
    const isCorrect = wv === w && tv === num;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: `${w} ${num}/${den}`, studentWhole: whole, studentTop: top, studentAnswer: `${whole} ${top}/${den}`, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]);
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {figure && <div className="frame fade-up delay-1" style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{figure(solved)}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={whole} placeholder="0" disabled={solved}
            onChange={e => { if (!solved) { setWhole(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(64px, 14vw, 84px)' }}/>
          <span className="small mono" style={{ color: T.ink2 }}>{t(c.label_whole)}</span>
          <div className="mix-frac">
            <input type="text" inputMode="numeric" className={`answer-input mix-top ${solved ? 'correct' : ''}`} value={top} placeholder="0" disabled={solved}
              onChange={e => { if (!solved) { setTop(e.target.value); setHintShown(false); } }}
              onKeyDown={e => e.key === 'Enter' && submit()}/>
            <span className="mix-bar"/>
            <span className="mix-den">{den}</span>
          </div>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
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

// ============================================================
// SeqMC — ketma-ket tez MC (Dars28/Dars20 etalonidan). Ovozda: say (intro) + umumiy on_wrong; per-item `no` ekranda.
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
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
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
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma savol yechildi." : 'Все вопросы решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <div className="dm-prob" style={{ fontSize: 'clamp(20px, 4vw, 30px)' }}>{mt(tx(q.q))}</div>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(13px, 1.8vw, 16px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                    {mt(tx(o))}
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
// SeqMix — ketma-ket aralash turdagi misollar (mc / minput / place). Oson->qiyin.
// Ovozda: say (intro) + umumiy on_wrong; per-item `no` faqat ekranda.
// ============================================================
const SeqMix = ({ screen, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `mix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [done, setDone] = useState(wasSolved);
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [wrongShown, setWrongShown] = useState(false);
  const [mcWrong, setMcWrong] = useState(() => new Set());
  const [whole, setWhole] = useState('');
  const [top, setTop] = useState('');
  const [placed, setPlaced] = useState(null);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const usedRetryRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null);
  const it = items[idx];

  const advanceIntro = () => { if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); } };
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const finishAll = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const resetItemState = () => { setMcWrong(new Set()); setWhole(''); setTop(''); setPlaced(null); setWrongShown(false); usedRetryRef.current = false; };
  const markFirstTry = (correct) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct && !usedRetryRef.current; };
  const goNext = () => {
    setSolvedItem(true);
    const snap = firstTryRef.current.slice();
    advRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setSolvedItem(false); resetItemState(); sayItem(ni); }
      else finishAll(snap);
    }, 820);
  };
  const onWrong = () => {
    usedRetryRef.current = true; sfx.playWrong(); setWrongShown(true);
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = false;
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
  };
  const pickMc = (i) => {
    if (done || solvedItem || mcWrong.has(i)) return;
    advanceIntro();
    if (i === it.correct) { markFirstTry(true); sfx.playCorrect(); goNext(); }
    else { setMcWrong(prev => { const s = new Set(prev); s.add(i); return s; }); onWrong(); }
  };
  const submitMinput = () => {
    if (done || solvedItem) return;
    const wv = parseInt(whole, 10); const tv = parseInt(top, 10);
    if (isNaN(wv) || isNaN(tv)) return;
    advanceIntro();
    if (wv === it.w && tv === it.num) { markFirstTry(true); sfx.playCorrect(); goNext(); } else onWrong();
  };
  const pickPlace = (k) => {
    if (done || solvedItem) return;
    advanceIntro();
    setPlaced(k);
    if (k === it.targetK) { markFirstTry(true); sfx.playCorrect(); goNext(); } else onWrong();
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); }, []);

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const typeBadge = { mc: lang === 'uz' ? 'Tanlash' : 'Выбор', minput: lang === 'uz' ? 'Yozish' : 'Ввод', place: lang === 'uz' ? "Son o'qi" : 'Прямая' }[it ? it.type : 'mc'];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.1vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(tx(c.done_text))}</p>
          </div>
        ) : (
          <>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="mix-tag">{idx + 1}/{n} · {typeBadge}</span>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(tx(it.prompt))}</p>
            </div>

            {it.type === 'mc' && (
              <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  if (solvedItem && i === it.correct) cls += ' option-correct';
                  else if (mcWrong.has(i)) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || mcWrong.has(i)} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(13px, 1.8vw, 16px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}

            {it.type === 'minput' && (
              <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <input type="text" inputMode="numeric" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={whole} placeholder="0" disabled={solvedItem}
                  onChange={e => { setWhole(e.target.value); setWrongShown(false); }} onKeyDown={e => e.key === 'Enter' && submitMinput()} style={{ width: 'clamp(60px, 13vw, 80px)' }}/>
                <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? 'butun' : 'целых'}</span>
                <div className="mix-frac">
                  <input type="text" inputMode="numeric" className={`answer-input mix-top ${solvedItem ? 'correct' : ''}`} value={top} placeholder="0" disabled={solvedItem}
                    onChange={e => { setTop(e.target.value); setWrongShown(false); }} onKeyDown={e => e.key === 'Enter' && submitMinput()}/>
                  <span className="mix-bar"/>
                  <span className="mix-den">{it.den}</span>
                </div>
                {!solvedItem && <button className="btn-white-accent" onClick={submitMinput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
              </div>
            )}

            {it.type === 'place' && (
              <div className="frame fade-up delay-1" style={{ padding: 'clamp(18px, 3vw, 26px) clamp(16px, 3vw, 24px)' }}>
                <NumLine max={it.max} den={it.den} picked={placed} targetK={it.targetK} solved={solvedItem} onPick={pickPlace}/>
              </div>
            )}

            <FeedbackBlock show={solvedItem || wrongShown} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
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
// DragClassify — kasrlarni 3 savatga sudrash (tap+drag, Dars37 modeli). Keep-visible: yechilganda savatlar yig'iladi.
// ============================================================
const S6_BINS = ['T', 'N', 'A'];
const S6_ITEMS = ['2/5', '5/8', '9/4', '3/3', '1 1/2', '2 3/4'];
const S6_OK = ['T', 'T', 'N', 'N', 'A', 'A'];
const DragClassify = ({ screen, idx, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const binLabels = { T: c.bin_T, N: c.bin_N, A: c.bin_A };
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? S6_OK.slice() : S6_ITEMS.map(() => null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const dropTo = (bin) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const nx = [...p]; nx[sel] = bin; return nx; }); setSel(null); };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const nx = [...p]; nx[i] = null; return nx; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = S6_OK.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[idx].scope, screenIdx: idx, question: t(c.lead), correctAnswer: S6_OK.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setPlace(p => p.map((v, i) => (v === S6_OK[i] ? v : null))); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const trayChips = S6_ITEMS.map((it, i) => (place[i] === null ? i : null)).filter(i => i !== null);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-bins fade-up delay-1" style={{ maxHeight: solved ? 0 : 900, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(11px, 2vw, 15px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {S6_BINS.map(bin => {
            const inBin = S6_ITEMS.map((it, i) => (place[i] === bin ? i : null)).filter(i => i !== null);
            return (
              <div key={bin} className={`dnd-bin${sel !== null ? ' dnd-bin-armed' : ''}`}
                onClick={() => dropTo(bin)} onDragOver={e => { e.preventDefault(); }} onDrop={e => { e.preventDefault(); dropTo(bin); }}>
                <span className="dnd-bin-lbl">{t(binLabels[bin])}</span>
                <div className="dnd-bin-slot">
                  {inBin.map(i => {
                    const right = solved && place[i] === S6_OK[i];
                    return (
                      <span key={i} className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`}
                        draggable={!solved} onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                        onClick={e => { e.stopPropagation(); returnChip(i); }}>{mt(S6_ITEMS[i])}</span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2">
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`}
                draggable onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => onChipClick(i)}>{mt(S6_ITEMS[i])}</span>
            ))}
          </div>
        )}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allPlaced} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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

// ============================================================
// DragOrder — sonlarni kichikdan kattaga kataklarga sudrash (tap+drag). slot[s] = item indeksi.
// ============================================================
const S11_VALS = [{ node: '1/2', val: 0.5 }, { node: '5/4', val: 1.25 }, { node: '2/3', val: 2 / 3 }, { node: '1 1/2', val: 1.5 }];
const S11_ORDER = S11_VALS.map((_, i) => i).sort((a, b) => S11_VALS[a].val - S11_VALS[b].val); // slot -> to'g'ri item
const DragOrder = ({ screen, idx, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const N = S11_VALS.length;
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [slots, setSlots] = useState(() => (wasSolved ? S11_ORDER.slice() : Array(N).fill(null))); // slots[s] = item idx
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const placedItems = slots.filter(v => v !== null);
  const dropTo = (s) => {
    if (solved || sel === null || slots[s] !== null) return;
    setChecked(false); setSlots(p => { const nx = [...p]; nx[s] = sel; return nx; }); setSel(null);
  };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(v => (v === i ? null : i)); };
  const returnSlot = (s) => { if (solved) return; setChecked(false); setSlots(p => { const nx = [...p]; nx[s] = null; return nx; }); };
  const allPlaced = slots.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = slots.every((v, s) => v === S11_ORDER[s]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[idx].scope, screenIdx: idx, question: t(c.lead), correctAnswer: S11_ORDER.join(','), studentAnswer: slots.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setSlots(p => p.map((v, s) => (v === S11_ORDER[s] ? v : null))); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const trayChips = S11_VALS.map((it, i) => (placedItems.includes(i) ? null : i)).filter(i => i !== null);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.1vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-slots fade-up delay-1">
          {slots.map((item, s) => {
            const right = solved && item === S11_ORDER[s];
            return (
              <div key={s} className={`dnd-slot${sel !== null && item === null ? ' dnd-slot-armed' : ''}${right ? ' dnd-slot-ok' : ''}`}
                onClick={() => dropTo(s)} onDragOver={e => { e.preventDefault(); }} onDrop={e => { e.preventDefault(); dropTo(s); }}>
                <span className="dnd-slot-pos">{s + 1}</span>
                {item !== null
                  ? <span className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`} draggable={!solved}
                      onDragStart={e => { setSel(item); e.dataTransfer.effectAllowed = 'move'; }}
                      onClick={e => { e.stopPropagation(); returnSlot(s); }}>{mt(S11_VALS[item].node)}</span>
                  : <span className="dnd-slot-empty">—</span>}
              </div>
            );
          })}
        </div>
        <div className="small mono fade-up delay-1" style={{ textAlign: 'center', color: T.ink3 }}>{lang === 'uz' ? "kichik  →  katta" : 'меньше  →  больше'}</div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2">
            <span className="dnd-tray-lbl">{lang === 'uz' ? 'Sonlar' : 'Числа'}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`}
                draggable onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => onChipClick(i)}>{mt(S11_VALS[i].node)}</span>
            ))}
          </div>
        )}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allPlaced} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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
