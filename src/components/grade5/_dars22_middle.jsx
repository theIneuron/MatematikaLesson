// ============================================================
// --- UROK: frac_5_14 — Aralash sonni noto'g'ri kasrga va aksincha o'tkazish
//     / Перевод смешанного числа в неправильную дробь и обратно
// Keep-visible qayta yig'ish (etalon: Dars28/Dars37/Dars09). Infra Dars28 dan bayt-aniq.
// Model: QUTI VA DONA — quti = maxraj (sig'im), to'la qutilar = butun, ochiq donalar = surat.
//   aralash -> noto'g'ri: qutilarni donaga ochamiz (butun x maxraj + surat).
//   noto'g'ri -> aralash: donalarni qutiga joylaymiz (surat : maxraj, qoldiq = yangi surat).
// Yangi personaj: Bahodir (hook — olma qutilari), Iroda (case — tuxum qutilari).
// Drag-and-drop: 3 metod (fill / classify / order), Dars37 gibrid tap+drag.
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-14-v2',
  lessonTitle: { ru: 'Перевод смешанного числа в неправильную дробь и обратно', uz: "Aralash sonni noto'g'ri kasrga va aksincha o'tkazish" }
};
const TOTAL_SCREENS = 13;
const SCREEN_META = [
  { id: 's0',     type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',     type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',     type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',     type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',     type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 'sfill',  type: 'test',        template: 'DragToSlots',    scored: true,  scope: 'practice' },  // drag: butun x maxraj + surat
  { id: 'sbins',  type: 'test',        template: 'DragToBins',     scored: true,  scope: 'practice' },  // drag: butun/aralash savatlariga
  { id: 's7',     type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },  // 5 oson savol
  { id: 's8',     type: 'test',        template: 'SeqMix',         scored: true,  scope: 'practice' },  // 6-8 misol oson->qiyin
  { id: 'sorder', type: 'test',        template: 'DragToSlots',    scored: true,  scope: 'practice' },  // drag: kichikdan kattaga
  { id: 's10',    type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's11',    type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'final' },
  { id: 's12',    type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {
  // s0 — HOOK: Bahodir 2 to'la quti (5 tadan) + 3 ochiq olma. Hammasini beshlik kasr qilib yozmoqchi:
  //      2 va 3/5 ni noto'g'ri (2+3)/5 = 5/5 deb yozdi. Lekin 5/5 — bitta quti, u esa 2 qutidan ko'p.
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    lead: { ru: 'У Баходира 2 полные коробки яблок (по 5 в каждой) и ещё 3 яблока. Это 2 целых 3/5 коробки. Он перевёл в неправильную дробь так: (2 + 3)/5 = 5/5.', uz: "Bahodirda 2 ta to'la olma qutisi bor (har birida 5 tadan) va yana 3 ta olma. Bu 2 butun 3/5 quti. U buni noto'g'ri kasrga shunday o'tkazdi: (2 + 3)/5 = 5/5." },
    question: { ru: 'Но 5/5 — это ровно 1 коробка. А у Баходира больше двух коробок. В чём ошибка?', uz: "Lekin 5/5 — bu roppa-rosa 1 quti. Bahodirda esa ikki qutidan ko'proq. Xato nimada?" },
    opt0: { ru: 'Целое нельзя просто прибавлять — сначала умножь его на знаменатель', uz: "Butunni shunchaki qo'shib bo'lmaydi — avval uni maxrajga ko'paytirish kerak" },
    opt1: { ru: 'Всё верно, ответ 5/5', uz: "Hammasi to'g'ri, javob 5/5" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'У Баходира две полные коробки яблок, по пять в каждой, и ещё три яблока сверху. Это два целых три пятых коробки. Он захотел записать всё одной неправильной дробью и сложил два и три, получил пять пятых. Но пять пятых это ровно одна коробка, а у него коробок больше двух. Значит где-то ошибка. Подумай и выбери ответ.', uz: "Bahodirda ikkita to'la olma qutisi bor, har birida beshtadan, va yana uchta olma ortiqcha. Bu ikki butun beshdan uch quti. U hammasini bitta noto'g'ri kasr qilib yozmoqchi bo'ldi va ikki bilan uchni qo'shib, beshdan besh oldi. Lekin beshdan besh roppa-rosa bitta quti, uning qutilari esa ikkitadan ko'p. Demak qayerdadir xato bor. O'ylab, javobni tanlang." }
  },

  // s1 — EXPLORATION step: aralash son nimani anglatadi (quti modeli)
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Что значит смешанное число?', uz: "Aralash son nimani anglatadi?" },
    conclusion: { ru: 'Целое — это полные коробки. Числитель — отдельные яблоки. Знаменатель — сколько яблок в одной коробке.', uz: "Butun — to'la qutilar. Surat — alohida olmalar. Maxraj — bitta qutida nechta olma." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Как перевести в дробь?', uz: "Kasrga qanday o'tkazamiz?" },
    audio: {
      ru: [
        'Разберём, что значит два целых три пятых. Нажимай кнопку дальше.',
        'Двойка это две полные коробки. В каждой по пять яблок.',
        'Три пятых это три отдельных яблока. В коробке помещается пять, поэтому знаменатель пять.',
        'Запомни. Целое это полные коробки, числитель это отдельные яблоки, знаменатель это сколько яблок в одной коробке.'
      ],
      uz: [
        "Ikki butun beshdan uch nimani anglatishini ko'ramiz. Davom etish tugmasini bosing.",
        "Ikki soni ikkita to'la quti. Har birida beshtadan olma.",
        "Beshdan uch bu uchta alohida olma. Qutiga beshta sig'adi, shuning uchun maxraj besh.",
        "Eslab qoling. Butun bu to'la qutilar, surat bu alohida olmalar, maxraj bu bitta qutida nechta olma."
      ]
    }
  },

  // s2 — EXPLORATION (mixed -> improper): qutilarni ochib donalarni sanaymiz. 2x5=10, +3=13 -> 13/5
  s2: {
    eyebrow: { ru: 'Считаем', uz: "Sanaymiz" },
    title: { ru: 'Открываем коробки: сколько всего яблок?', uz: "Qutilarni ochamiz: jami nechta olma?" },
    step_lbl: { ru: 'Всего яблок', uz: "Jami olma" },
    s1: { ru: '2 коробки по 5 — это 2 × 5 = 10 яблок.', uz: "2 ta quti 5 tadan — bu 2 × 5 = 10 olma." },
    s2: { ru: 'Плюс 3 отдельных яблока: 10 + 3 = 13.', uz: "Ustiga 3 ta alohida olma: 10 + 3 = 13." },
    s3: { ru: 'Всего 13 яблок по пятой части. Значит 2 целых 3/5 = 13/5.', uz: "Jami 13 ta olma, har biri beshdan bir. Demak 2 butun 3/5 = 13/5." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'А как обратно?', uz: "Orqaga-chi?" },
    audio: {
      ru: [
        'Откроем коробки и сосчитаем все яблоки по отдельности. Нажимай дальше.',
        'Две коробки по пять яблок. Два умножить на пять это десять яблок.',
        'Прибавим три отдельных яблока. Десять плюс три это тринадцать.',
        'Всего тринадцать яблок, и каждое это одна пятая коробки. Значит два целых три пятых равно тринадцать пятых.'
      ],
      uz: [
        "Qutilarni ochamiz va hamma olmani alohida sanaymiz. Davom etishni bosing.",
        "Ikkita quti, har birida beshtadan olma. Ikkini beshga ko'paytirsak o'n olma bo'ladi.",
        "Uchta alohida olmani qo'shamiz. O'n plyus uch o'n uch bo'ladi.",
        "Jami o'n uchta olma, har biri qutining beshdan biri. Demak ikki butun beshdan uch teng beshdan o'n uch."
      ]
    }
  },

  // s3 — EXPLORATION (improper -> mixed): 13 donani 5 talik qutilarga joylaymiz. 13:5 = 2 qoldiq 3 -> 2 3/5
  s3: {
    eyebrow: { ru: 'Раскладываем', uz: "Joylaymiz" },
    title: { ru: 'Обратно: раскладываем 13 яблок по коробкам', uz: "Orqaga: 13 olmani qutilarga joylaymiz" },
    s1: { ru: 'Заполнили первую коробку — 5 яблок. Осталось 8.', uz: "Birinchi qutini to'ldirdik — 5 olma. 8 tasi qoldi." },
    s2: { ru: 'Заполнили вторую — ещё 5. Осталось 3. Третьей коробки не хватает.', uz: "Ikkinchisini to'ldirdik — yana 5. 3 tasi qoldi. Uchinchi quti to'lmaydi." },
    s3: { ru: '2 полные коробки и 3 яблока. Это 13 : 5 = 2 остаток 3, то есть 2 целых 3/5.', uz: "2 ta to'la quti va 3 ta olma. Bu 13 : 5 = 2 qoldiq 3, ya'ni 2 butun 3/5." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно, к правилу', uz: "Tushunarli, qoidaga" },
    audio: {
      ru: [
        'Теперь наоборот. У нас тринадцать отдельных яблок, раскладываем их по коробкам на пять. Нажимай дальше.',
        'Заполнили первую коробку, в неё вошло пять яблок. Осталось восемь.',
        'Заполнили вторую коробку, ещё пять. Осталось три яблока, на целую коробку их не хватает.',
        'Получились две полные коробки и три яблока. Это тринадцать разделить на пять, будет два и остаток три. Значит тринадцать пятых равно два целых три пятых.'
      ],
      uz: [
        "Endi teskari. Bizda o'n uchta alohida olma bor, ularni beshtalik qutilarga joylaymiz. Davom etishni bosing.",
        "Birinchi qutini to'ldirdik, unga beshta olma sig'di. Sakkiztasi qoldi.",
        "Ikkinchi qutini to'ldirdik, yana beshta. Uchta olma qoldi, butun qutiga ular yetmaydi.",
        "Ikkita to'la quti va uchta olma chiqdi. Bu o'n uchni beshga bo'lish, ikki butun va qoldiq uch bo'ladi. Demak beshdan o'n uch teng ikki butun beshdan uch."
      ]
    }
  },

  // s4 — RULE: ikki yo'l
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Два направления — две короткие записи.', uz: "Ikki yo'nalish — ikkita qisqa yozuv." },
    rule1_lbl: { ru: 'Смешанное → неправильная', uz: "Aralash → noto'g'ri" },
    rule1_a: { ru: 'Целое умножь на знаменатель и прибавь числитель.', uz: "Butunni maxrajga ko'paytiring, ustiga suratni qo'shing." },
    rule1_b: { ru: 'Знаменатель не меняется.', uz: "Maxraj o'zgarmaydi." },
    rule1_eq: { ru: '2 3/5 = (2·5 + 3)/5 = 13/5', uz: "2 3/5 = (2·5 + 3)/5 = 13/5" },
    rule2_lbl: { ru: 'Неправильная → смешанное', uz: "Noto'g'ri → aralash" },
    rule2_a: { ru: 'Числитель раздели на знаменатель.', uz: "Suratni maxrajga bo'ling." },
    rule2_b: { ru: 'Частное — целое, остаток — новый числитель.', uz: "Bo'linma — butun, qoldiq — yangi surat." },
    rule2_eq: { ru: '13/5 = 13 : 5 = 2 ост. 3 = 2 3/5', uz: "13/5 = 13 : 5 = 2 qold. 3 = 2 3/5" },
    audio: { ru: 'Запомни два пути. Первый: смешанное число в неправильную дробь. Целое умножь на знаменатель и прибавь числитель, а знаменатель оставь. Два целых три пятых: два умножить на пять это десять, плюс три это тринадцать, получаем тринадцать пятых. Второй путь: неправильную дробь в смешанное число. Числитель раздели на знаменатель. Частное это целая часть, а остаток это новый числитель. Тринадцать разделить на пять это два и остаток три, значит два целых три пятых.', uz: "Ikki yo'lni eslab qoling. Birinchi: aralash sonni noto'g'ri kasrga. Butunni maxrajga ko'paytiring va ustiga suratni qo'shing, maxraj o'zgarmaydi. Ikki butun beshdan uch: ikkini beshga ko'paytirsak o'n, plyus uch o'n uch, beshdan o'n uch chiqadi. Ikkinchi yo'l: noto'g'ri kasrni aralash songa. Suratni maxrajga bo'ling. Bo'linma butun qism, qoldiq esa yangi surat. O'n uchni beshga bo'lsak ikki va qoldiq uch, demak ikki butun beshdan uch." }
  },

  // sfill — DRAG-FILL: 2 3/5 -> noto'g'ri kasr algoritmini sonlar bilan to'ldirish
  sfill: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Собери перевод перетаскиванием', uz: "O'tkazishni sudrab yig'ing" },
    lead: { ru: 'Переведи 2 3/5 в неправильную дробь за два шага. Перетащи (или нажми) числа в клетки.', uz: "2 3/5 ni noto'g'ri kasrga ikki qadamda o'tkazing. Sonlarni kataklarga sudrang yoki bosing." },
    lbl_mul: { ru: '1-шаг · целое × знаменатель', uz: "1-qadam · butun × maxraj" },
    lbl_add: { ru: '2-шаг · прибавь числитель', uz: "2-qadam · suratni qo'sh" },
    goal_lbl: { ru: 'Цель', uz: "Maqsad" },
    tray_label: { ru: 'Числа', uz: "Sonlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Сначала 2 × 5 = 10, потом 10 + 3 = 13. Знаменатель остаётся 5.', uz: "Avval 2 × 5 = 10, keyin 10 + 3 = 13. Maxraj 5 bo'lib qoladi." },
    correct_text: { ru: 'Верно! 2 × 5 = 10, 10 + 3 = 13. Значит 2 3/5 = 13/5.', uz: "To'g'ri! 2 × 5 = 10, 10 + 3 = 13. Demak 2 3/5 = 13/5." },
    fact: { ru: 'Программы для рецептов хранят такие количества как неправильные дроби — так их проще складывать.', uz: "Retsept dasturlari bunday miqdorlarni noto'g'ri kasr ko'rinishida saqlaydi — shunda qo'shish osonroq." },
    audio: {
      intro: { ru: 'Собери перевод. Перетащи или нажми числа в клетки. Сначала два умножить на пять, потом прибавь три, потом запиши числитель. Затем нажми проверить.', uz: "O'tkazishni yig'ing. Sonlarni kataklarga sudrang yoki bosing. Avval ikkini beshga ko'paytiring, keyin uchni qo'shing, keyin suratni yozing. So'ng tekshirishni bosing." },
      on_correct: { ru: 'Верно. Целое умножили на знаменатель и прибавили числитель.', uz: "To'g'ri. Butunni maxrajga ko'paytirdik va suratni qo'shdik." },
      on_wrong: { ru: 'Пока не так. Целое умножь на знаменатель, потом прибавь числитель.', uz: "Hozircha emas. Butunni maxrajga ko'paytiring, keyin suratni qo'shing." }
    }
  },

  // sbins — DRAG-CLASSIFY: noto'g'ri kasrlar — butun son chiqadi / aralash son chiqadi
  sbins: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Что получится: целое или смешанное?', uz: "Nima chiqadi: butun yoki aralash?" },
    lead: { ru: 'Раздели числитель на знаменатель. Делится без остатка — целое, есть остаток — смешанное.', uz: "Suratni maxrajga bo'ling. Qoldiqsiz bo'linsa — butun, qoldiq bo'lsa — aralash." },
    binW: { ru: 'Целое число', uz: "Butun son" },
    binM: { ru: 'Смешанное число', uz: "Aralash son" },
    it0: { ru: '10/5', uz: "10/5" },
    it1: { ru: '7/5', uz: "7/5" },
    it2: { ru: '9/3', uz: "9/3" },
    it3: { ru: '8/3', uz: "8/3" },
    tray_label: { ru: 'Дроби', uz: "Kasrlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: '10:5=2 и 9:3=3 — без остатка, целые. 7:5 и 8:3 — с остатком, смешанные.', uz: "10:5=2 va 9:3=3 — qoldiqsiz, butun. 7:5 va 8:3 — qoldiq bilan, aralash." },
    correct_text: { ru: 'Верно! 10/5 = 2 и 9/3 = 3 — целые. 7/5 = 1 2/5 и 8/3 = 2 2/3 — смешанные.', uz: "To'g'ri! 10/5 = 2 va 9/3 = 3 — butun. 7/5 = 1 2/5 va 8/3 = 2 2/3 — aralash." },
    fact: { ru: 'Дробь равна целому числу, когда числитель делится на знаменатель нацело.', uz: "Surat maxrajga to'liq bo'linsa, kasr butun songa teng bo'ladi." },
    audio: {
      intro: { ru: 'Перетащи каждую дробь в нужную корзину. Раздели числитель на знаменатель: если без остатка, получится целое, если с остатком, получится смешанное. Потом нажми проверить.', uz: "Har bir kasrni kerakli savatga sudrang. Suratni maxrajga bo'ling: qoldiqsiz bo'linsa butun, qoldiq qolsa aralash chiqadi. Keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно. Ты проверяешь, делится ли числитель на знаменатель нацело.', uz: "To'g'ri. Surat maxrajga to'liq bo'linadimi, shuni tekshiryapsiz." },
      on_wrong: { ru: 'Пока не так. Раздели числитель на знаменатель и посмотри на остаток.', uz: "Hozircha emas. Suratni maxrajga bo'ling va qoldiqqa qarang." }
    }
  },

  // s7 — 5 TA OSON SAVOL (SeqMC)
  s7: {
    eyebrow: { ru: 'Разминка', uz: "Mashq" },
    title: { ru: '5 быстрых вопросов', uz: "5 ta tez savol" },
    lead: { ru: 'Короткие шаги перевода. Жми ответ.', uz: "O'tkazishning qisqa qadamlari. Javobni bosing." },
    audio: {
      intro: { ru: 'Пять быстрых вопросов про перевод дробей. Помни два пути: умножить и прибавить, либо разделить с остатком. Нажимай ответ.', uz: "Kasrlarni o'tkazish haqida besh ta tez savol. Ikki yo'lni eslang: ko'paytirib qo'shish yoki qoldiq bilan bo'lish. Javobni bosing." },
      on_wrong: { ru: 'Не совсем. Подумай ещё.', uz: "Unchalik emas. Yana o'ylang." },
      on_done: { ru: 'Готово. Пять верных шагов.', uz: "Tayyor. Besh to'g'ri qadam." }
    },
    questions: [
      { q: { ru: '2 1/3: чему равно 2 × 3?', uz: "2 1/3: 2 × 3 nechaga teng?" }, opts: ['6', '5', '23'], correct: 0,
        say: { ru: 'В числе два целых одна третья, сколько будет два умножить на три?', uz: "Ikki butun uchdan bir sonida ikkini uchga ko'paytirsak nechta bo'ladi?" },
        ok: { ru: 'Верно, шесть. Дальше прибавим числитель.', uz: "To'g'ri, olti. Keyin suratni qo'shamiz." }, no: { ru: 'Умножь целое на знаменатель.', uz: "Butunni maxrajga ko'paytiring." } },
      { q: { ru: '2 1/3 = ?/3', uz: "2 1/3 = ?/3" }, opts: ['7', '6', '3'], correct: 0,
        say: { ru: 'Два умножить на три это шесть, плюс один. Какой числитель?', uz: "Ikkini uchga ko'paytirsak olti, plyus bir. Surat qancha?" },
        ok: { ru: 'Верно, 7/3.', uz: "To'g'ri, 7/3." }, no: { ru: 'К произведению прибавь числитель.', uz: "Ko'paytmaga suratni qo'shing." } },
      { q: { ru: '7/5 = 1 ?/5', uz: "7/5 = 1 ?/5" }, opts: ['2', '5', '7'], correct: 0,
        say: { ru: 'Семь разделить на пять это один и остаток. Какой остаток?', uz: "Yettini beshga bo'lsak bir va qoldiq. Qoldiq qancha?" },
        ok: { ru: 'Верно, остаток 2. Значит 1 2/5.', uz: "To'g'ri, qoldiq 2. Demak 1 2/5." }, no: { ru: 'Остаток это что осталось после деления.', uz: "Qoldiq — bo'lishdan keyin ortib qolgani." } },
      { q: { ru: 'Сколько целых в 11/4?', uz: "11/4 da nechta butun bor?" }, opts: ['2', '3', '11'], correct: 0,
        say: { ru: 'Сколько целых коробок по четыре в одиннадцати?', uz: "O'n bittada to'rttadan nechta to'la quti bor?" },
        ok: { ru: 'Верно, 2 целых (и 3 в остатке).', uz: "To'g'ri, 2 butun (va qoldiq 3)." }, no: { ru: 'Раздели числитель на знаменатель.', uz: "Suratni maxrajga bo'ling." } },
      { q: { ru: '3/3 = ?', uz: "3/3 = ?" }, opts: ['1', '3', '0'], correct: 0,
        say: { ru: 'Три третьих, сколько это целых?', uz: "Uchdan uch, bu nechta butun?" },
        ok: { ru: 'Верно, ровно 1 целое.', uz: "To'g'ri, roppa-rosa 1 butun." }, no: { ru: 'Числитель равен знаменателю — выходит одно целое.', uz: "Surat maxrajga teng — bitta butun chiqadi." } }
    ]
  },

  // s8 — 6-8 MISOL OSON->QIYIN (SeqMix: input / mc / multi), ikki yo'nalish aralash
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Примеры: от простого к сложному', uz: "Misollar: oddiydan murakkabga" },
    lead: { ru: 'Переводи туда и обратно. Каждый пример чуть сложнее.', uz: "U yoqdan bu yoqqa o'tkazing. Har misol biroz qiyinroq." },
    audio: {
      intro: { ru: 'Восемь примеров, от простого к сложному. Переводи смешанное в неправильное и обратно. Поехали.', uz: "Sakkiz misol, oddiydan murakkabga. Aralashni noto'g'riga va aksincha o'tkazing. Boshladik." },
      on_wrong: { ru: 'Не совсем. Вспомни: умножить и прибавить, или разделить с остатком.', uz: "Unchalik emas. Eslang: ko'paytirib qo'shish yoki qoldiq bilan bo'lish." },
      on_done: { ru: 'Отлично. Ты прошёл от простого примера до самого трудного.', uz: "Zo'r. Oson misoldan eng qiyiniga qadar yetib bordingiz." }
    },
    items: [
      { type: 'input', q: { ru: '1 1/2 = ?/2', uz: "1 1/2 = ?/2" }, answer: 3,
        say: { ru: 'Одна целая одна вторая. Один умножить на два плюс один.', uz: "Bir butun ikkidan bir. Birni ikkiga ko'paytirib bir qo'shing." },
        ok: { ru: 'Верно. 1 × 2 + 1 = 3, значит 3/2.', uz: "To'g'ri. 1 × 2 + 1 = 3, demak 3/2." },
        no: { ru: 'Целое умножь на знаменатель, потом прибавь числитель.', uz: "Butunni maxrajga ko'paytiring, keyin suratni qo'shing." } },
      { type: 'mc', q: { ru: '2 1/4 = ?', uz: "2 1/4 = ?" }, opts: ['9/4', '3/4', '7/4'], correct: 0,
        say: { ru: 'Два целых одна четвёртая в неправильную дробь.', uz: "Ikki butun to'rtdan birni noto'g'ri kasrga." },
        ok: { ru: 'Верно. 2 × 4 + 1 = 9, значит 9/4.', uz: "To'g'ri. 2 × 4 + 1 = 9, demak 9/4." },
        no: { ru: 'Два умножь на четыре и прибавь один.', uz: "Ikkini to'rtga ko'paytiring va bir qo'shing." } },
      { type: 'input', q: { ru: '7/4 = 1 ?/4', uz: "7/4 = 1 ?/4" }, answer: 3,
        say: { ru: 'Семь четвёртых в смешанное. Семь разделить на четыре, какой остаток?', uz: "To'rtdan yettini aralashga. Yettini to'rtga bo'lsak, qoldiq qancha?" },
        ok: { ru: 'Верно. 7 : 4 = 1 остаток 3, значит 1 3/4.', uz: "To'g'ri. 7 : 4 = 1 qoldiq 3, demak 1 3/4." },
        no: { ru: 'Раздели семь на четыре и посмотри остаток.', uz: "Yettini to'rtga bo'ling va qoldiqqa qarang." } },
      { type: 'mc', q: { ru: '9/2 = ?', uz: "9/2 = ?" }, opts: ['4 1/2', '4 1/4', '3 1/2'], correct: 0,
        say: { ru: 'Девять вторых в смешанное число.', uz: "Ikkidan to'qqizni aralash songa." },
        ok: { ru: 'Верно. 9 : 2 = 4 остаток 1, значит 4 1/2.', uz: "To'g'ri. 9 : 2 = 4 qoldiq 1, demak 4 1/2." },
        no: { ru: 'Раздели девять на два: частное это целое, остаток это числитель.', uz: "To'qqizni ikkiga bo'ling: bo'linma butun, qoldiq surat." } },
      { type: 'multi', q: { ru: 'Какие дроби неправильные?', uz: "Qaysi kasrlar noto'g'ri?" }, opts: ['7/5', '3/8', '9/9'], correctSet: [0, 2],
        say: { ru: 'Отметь все неправильные дроби. Неправильная это когда числитель больше или равен знаменателю.', uz: "Barcha noto'g'ri kasrlarni belgilang. Noto'g'ri — surat maxrajdan katta yoki teng bo'lganda." },
        ok: { ru: 'Верно. 7/5 и 9/9 неправильные, а 3/8 правильная.', uz: "To'g'ri. 7/5 va 9/9 noto'g'ri, 3/8 esa to'g'ri." },
        no: { ru: 'Сравни числитель и знаменатель в каждой дроби.', uz: "Har kasrda surat va maxrajni solishtiring." } },
      { type: 'input', q: { ru: '3 2/5 = ?/5', uz: "3 2/5 = ?/5" }, answer: 17,
        say: { ru: 'Три целых две пятых. Три умножить на пять плюс два.', uz: "Uch butun beshdan ikki. Uchni beshga ko'paytirib ikki qo'shing." },
        ok: { ru: 'Верно. 3 × 5 + 2 = 17, значит 17/5.', uz: "To'g'ri. 3 × 5 + 2 = 17, demak 17/5." },
        no: { ru: 'Целое умножь на знаменатель, потом прибавь числитель.', uz: "Butunni maxrajga ko'paytiring, keyin suratni qo'shing." } },
      { type: 'mc', q: { ru: '23/4 = ?', uz: "23/4 = ?" }, opts: ['5 3/4', '4 3/4', '5 1/4'], correct: 0,
        say: { ru: 'Двадцать три четвёртых в смешанное число.', uz: "To'rtdan yigirma uchni aralash songa." },
        ok: { ru: 'Верно. 23 : 4 = 5 остаток 3, значит 5 3/4.', uz: "To'g'ri. 23 : 4 = 5 qoldiq 3, demak 5 3/4." },
        no: { ru: 'Раздели двадцать три на четыре с остатком.', uz: "Yigirma uchni to'rtga qoldiq bilan bo'ling." } },
      { type: 'input', q: { ru: '4 5/6 = ?/6', uz: "4 5/6 = ?/6" }, answer: 29,
        say: { ru: 'Четыре целых пять шестых. Четыре умножить на шесть плюс пять.', uz: "To'rt butun oltidan besh. To'rtni oltiga ko'paytirib besh qo'shing." },
        ok: { ru: 'Верно. 4 × 6 + 5 = 29, значит 29/6.', uz: "To'g'ri. 4 × 6 + 5 = 29, demak 29/6." },
        no: { ru: 'Целое умножь на знаменатель, потом прибавь числитель.', uz: "Butunni maxrajga ko'paytiring, keyin suratni qo'shing." } }
    ]
  },

  // sorder — DRAG-ORDER: kichikdan kattaga. 5/4 (1 1/4) < 7/4 < 2 1/4 (9/4)
  sorder: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Расставь от меньшей к большей', uz: "Kichikdan kattaga joylashtiring" },
    lead: { ru: 'Приведи всё к четвертям и сравни. Слева — меньшая, справа — большая.', uz: "Hammasini to'rtdanlarga keltiring va solishtiring. Chapda — kichigi, o'ngda — kattasi." },
    slot0: { ru: 'Меньшая', uz: "Eng kichik" },
    slot1: { ru: 'Средняя', uz: "O'rtacha" },
    slot2: { ru: 'Большая', uz: "Eng katta" },
    tray_label: { ru: 'Числа', uz: "Sonlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Переведи в четверти: 5/4, 7/4, а 2 1/4 = 9/4. Чем больше числитель, тем больше дробь.', uz: "To'rtdanlarga o'tkazing: 5/4, 7/4, va 2 1/4 = 9/4. Surat qancha katta bo'lsa, son shuncha katta." },
    correct_text: { ru: 'Верно! 5/4 = 1 1/4, 7/4 = 1 3/4, 2 1/4 = 9/4 — по возрастанию.', uz: "To'g'ri! 5/4 = 1 1/4, 7/4 = 1 3/4, 2 1/4 = 9/4 — o'sish tartibida." },
    fact: { ru: 'Чтобы сравнить смешанные и неправильные дроби, их приводят к одному виду — как здесь к четвертям.', uz: "Aralash va noto'g'ri kasrlarni solishtirish uchun ularni bir ko'rinishga keltiriladi — bu yerda to'rtdanlarga." },
    audio: {
      intro: { ru: 'Расставь числа от меньшего к большему. Переведи всё в четверти и сравни числители. Перетащи или нажми, потом нажми проверить.', uz: "Sonlarni kichikdan kattaga joylashtiring. Hammasini to'rtdanlarga o'tkazing va suratlarni solishtiring. Sudrang yoki bosing, keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно. Пять четвёртых меньше семи четвёртых, а два целых одна четвёртая это девять четвёртых, самое большое.', uz: "To'g'ri. To'rtdan besh to'rtdan yettidan kichik, ikki butun to'rtdan bir esa to'rtdan to'qqiz, eng kattasi." },
      on_wrong: { ru: 'Пока не так. Приведи всё к четвертям и сравни числители.', uz: "Hozircha emas. Hammasini to'rtdanlarga keltiring va suratlarni solishtiring." }
    }
  },

  // s10 — CASE setup: Iroda 23 tuxumni 4 talik qutilarga joylaydi
  s10: {
    eyebrow: { ru: 'Задача · упаковка', uz: "Masala · qadoqlash" },
    title: { ru: 'Ирода раскладывает 23 яйца по коробкам.', uz: "Iroda 23 ta tuxumni qutilarga joylaydi." },
    body_p1: { ru: 'В одной коробке помещается 4 яйца. Сколько получится полных коробок и сколько яиц останется?', uz: "Bitta qutiga 4 ta tuxum sig'adi. Nechta to'la quti chiqadi va nechta tuxum ortib qoladi?" },
    cap_label: { ru: 'Всего яиц', uz: "Jami tuxum" },
    box_label: { ru: 'В коробке', uz: "Qutida" },
    outro: { ru: 'Это перевод 23/4 в смешанное число. Раздели 23 на 4 с остатком.', uz: "Bu 23/4 ni aralash songa o'tkazish. 23 ni 4 ga qoldiq bilan bo'ling." },
    btn_help: { ru: 'Помочь Ироде', uz: "Irodaga yordam berish" },
    audio: { ru: 'Ирода раскладывает двадцать три яйца по коробкам, в каждую помещается четыре яйца. Сколько выйдет полных коробок и сколько яиц останется? Это перевод двадцати трёх четвёртых в смешанное число. Раздели двадцать три на четыре с остатком. Помоги на следующем шаге.', uz: "Iroda yigirma uchta tuxumni qutilarga joylaydi, har biriga to'rttadan sig'adi. Nechta to'la quti chiqadi va nechta tuxum ortib qoladi? Bu to'rtdan yigirma uchni aralash songa o'tkazish. Yigirma uchni to'rtga qoldiq bilan bo'ling. Keyingi bosqichda yordam bering." }
  },

  // s11 — CASE final MC: 23/4 = 5 3/4 (keep-visible, scored final)
  s11: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    label: { ru: 'Сколько полных коробок и остаток?', uz: "Nechta to'la quti va qoldiq?" },
    question: { ru: '23/4 = ?', uz: "23/4 = ?" },
    correct_text: { ru: 'Правильно. 23 : 4 = 5 остаток 3. Значит 5 полных коробок и 3 яйца: 5 3/4.', uz: "To'g'ri. 23 : 4 = 5 qoldiq 3. Demak 5 ta to'la quti va 3 ta tuxum: 5 3/4." },
    wrong_1: { ru: 'Это меньше. 23 : 4 = 5 остаток 3, целых пять, а не четыре. Ответ 5 3/4.', uz: "Bu kamroq. 23 : 4 = 5 qoldiq 3, butun besh, to'rt emas. Javob 5 3/4." },
    wrong_2: { ru: 'Остаток найден неверно. 5 × 4 = 20, осталось 23 − 20 = 3. Значит 5 3/4.', uz: "Qoldiq noto'g'ri topilgan. 5 × 4 = 20, qolgani 23 − 20 = 3. Demak 5 3/4." },
    wrong_3: { ru: 'Это округление вверх. На самом деле 5 полных коробок и 3 яйца: 5 3/4.', uz: "Bu tepaga yaxlitlash. Aslida 5 ta to'la quti va 3 ta tuxum: 5 3/4." },
    wrong_default: { ru: 'Раздели 23 на 4: частное 5, остаток 3. Значит 5 3/4.', uz: "23 ni 4 ga bo'ling: bo'linma 5, qoldiq 3. Demak 5 3/4." },
    audio_hint_1: { ru: 'Целая часть это сколько раз четыре помещается в двадцати трёх. Их больше четырёх.', uz: "Butun qism — to'rt yigirma uchga necha marta sig'ishi. Ular to'rttadan ko'p." },
    audio_hint_2: { ru: 'Остаток это что осталось после деления. Умножь частное на знаменатель и вычти.', uz: "Qoldiq — bo'lishdan keyin ortib qolgani. Bo'linmani maxrajga ko'paytirib ayiring." },
    audio_hint_3: { ru: 'Не округляй вверх. Возьми целую часть и остаток отдельно.', uz: "Tepaga yaxlitlamang. Butun qism va qoldiqni alohida oling." },
    fact: { ru: 'Логистические программы так считают паллеты: целые коробки и остаток отдельно, как смешанное число.', uz: "Logistika dasturlari pallalarni shunday sanaydi: butun qutilar va qoldiq alohida, aralash sondek." },
    audio: {
      intro: { ru: 'Раздели двадцать три яйца по коробкам на четыре. Сколько полных коробок и сколько останется? Выбери ответ.', uz: "Yigirma uchta tuxumni to'rttalik qutilarga bo'ling. Nechta to'la quti va nechtasi qoladi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Двадцать три разделить на четыре это пять и остаток три. Пять целых три четвёртых. Логистика считает паллеты так же.', uz: "To'g'ri. Yigirma uchni to'rtga bo'lsak besh va qoldiq uch. Besh butun to'rtdan uch. Logistika ham pallalarni shunday sanaydi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s12 — SUMMARY (kanonik Dars09-13 layout)
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты переводишь смешанное число в неправильную дробь и обратно.', uz: "Endi siz aralash sonni noto'g'ri kasrga va aksincha o'tkazasiz." },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Целое — это полные коробки, числитель — отдельные яблоки, знаменатель — сколько в коробке.', uz: "Butun — to'la qutilar, surat — alohida olmalar, maxraj — qutida nechta." },
    main_2: { ru: 'Смешанное → неправильная: целое умножь на знаменатель и прибавь числитель (2 3/5 = 13/5).', uz: "Aralash → noto'g'ri: butunni maxrajga ko'paytirib suratni qo'shing (2 3/5 = 13/5)." },
    main_3: { ru: 'Неправильная → смешанное: числитель раздели на знаменатель, остаток — новый числитель (13/5 = 2 3/5).', uz: "Noto'g'ri → aralash: suratni maxrajga bo'ling, qoldiq — yangi surat (13/5 = 2 3/5)." },
    main_4: { ru: 'Знаменатель в обоих переводах не меняется.', uz: "Maxraj ikkala o'tkazishda ham o'zgarmaydi." },
    back_to_hook: { ru: 'Ошибка Баходира: (2+3)/5 = 5/5. Правильно: 2×5+3 = 13, то есть 13/5.', uz: "Bahodir xatosi: (2+3)/5 = 5/5. To'g'risi: 2×5+3 = 13, ya'ni 13/5." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Правильные, неправильные и смешанные числа» и деление с остатком.', uz: "«To'g'ri, noto'g'ri va aralash sonlar» va qoldiqli bo'lish." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сложение и вычитание смешанных чисел.', uz: "aralash sonlarni qo'shish va ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты переводишь смешанное число в неправильную дробь и обратно. Чтобы перевести смешанное в неправильную, умножь целое на знаменатель и прибавь числитель. Чтобы перевести обратно, раздели числитель на знаменатель с остатком. Знаменатель при этом не меняется. Ошибка Баходира была в том, что он сложил два и три. Правильно умножить два на пять и прибавить три, получится тринадцать пятых. Дальше научимся складывать и вычитать смешанные числа.', uz: "Zo'r. Endi siz aralash sonni noto'g'ri kasrga va aksincha o'tkazasiz. Aralashni noto'g'riga o'tkazish uchun butunni maxrajga ko'paytirib suratni qo'shing. Orqaga o'tkazish uchun suratni maxrajga qoldiq bilan bo'ling. Maxraj bunda o'zgarmaydi. Bahodirning xatosi ikki bilan uchni qo'shgani edi. To'g'risi ikkini beshga ko'paytirib uch qo'shish, beshdan o'n uch chiqadi. Keyin aralash sonlarni qo'shish va ayirishni o'rganamiz." }
  }
};

// ============================================================
// YORDAMCHILAR (Title/shuffleMC/ConnectionsBlock/Floaters infra'da YO'Q — shu yerda)
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };

const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

// Ikonkalar ✓ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);

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

// Aralash son inline ko'rinishi: butun + kasr
const Mixed = ({ w, n, d, color, size = 'mid' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(3px, 0.8vw, 6px)' }}>
    <span className="mono" style={{ fontWeight: 700, fontSize: size === 'lg' ? 'clamp(20px, 3.4vw, 28px)' : 'clamp(16px, 2.6vw, 22px)', color: color || T.ink }}>{w}</span>
    <Frac n={String(n)} d={String(d)} size={size} color={color}/>
  </span>
);

// ============================================================
// FAKT-BLOK (ko'k karta, to'g'ri javobdan keyin)
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const FactCard = ({ text, anim, badge = FACT_BADGE }) => {
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
// VIZUALIZATOR — QUTI VA DONA
// ============================================================
// Bitta quti: cap = sig'im (maxraj), filled = mavjud donalar. partial = qisman (ochiq quti).
const ItemBox = ({ cap, filled, color = T.accent, partial = false, anim = false }) => {
  const cols = cap <= 3 ? cap : (cap <= 4 ? 2 : (cap <= 6 ? 3 : 4));
  return (
    <div className={`qb-box${partial ? ' qb-box-part' : ''}`}>
      <div className="qb-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cap }).map((_, i) => (
          <span key={i} className={`qb-dot${i < filled ? ' qb-dot-on' : ''}${anim && i < filled ? ' qb-drop' : ''}`}
            style={{ background: i < filled ? color : undefined, animationDelay: anim ? `${i * 0.07}s` : undefined }}/>
        ))}
      </div>
    </div>
  );
};
// Bo'sh donalar (quti tashqarisida)
const LooseDots = ({ count, color = T.accent, anim = false }) => (
  <div className="qb-loose">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className={`qb-dot qb-dot-on${anim ? ' qb-drop' : ''}`} style={{ background: color, animationDelay: anim ? `${i * 0.06}s` : undefined }}/>
    ))}
  </div>
);
// Aralash son ko'rinishi: butun to'la qutilar + bitta qisman quti
const MixedBoxes = ({ whole, num, den, color = T.accent, anim = false }) => (
  <div className="qb-row">
    {Array.from({ length: whole }).map((_, i) => <ItemBox key={`f${i}`} cap={den} filled={den} color={color} anim={anim}/>)}
    {num > 0 && <ItemBox cap={den} filled={num} color={color} partial anim={anim}/>}
  </div>
);

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (mobil tap). веди-до-верного; oxirida bitta ball.
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true" style={{ position: 'relative' }}>
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma savol yechildi." : 'Все вопросы решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(16px, 2.4vw, 20px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
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
// SeqMix — ketma-ket har xil turdagi savollar (mc / input / multi). веди-до-верного; oxirida bitta ball.
// ============================================================
const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `mix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [done, setDone] = useState(wasSolved);
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [wrong, setWrong] = useState(() => new Set());
  const [sel, setSel] = useState(() => new Set());
  const [val, setVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const itemErrRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];

  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const voiceWrong = (node) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff((node && node[lang]) || c.audio.on_wrong[lang]); } };

  const finishAll = (firstTries) => {
    setDone(true);
    if (scored) {
      const ok = firstTries.filter(Boolean).length; const allOk = ok === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${ok}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect: ok, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };

  const markFirstTry = (correct) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct; };
  const advance = () => {
    setSolvedItem(true); sfx.playCorrect();
    const cur = firstTryRef.current.slice();
    advanceRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setSolvedItem(false); setWrong(new Set()); setSel(new Set()); setVal(''); setShowHint(false); itemErrRef.current = false; sayItem(ni); }
      else finishAll(cur);
    }, 850);
  };

  const pickMc = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = i === it.correct;
    if (isCorrect && !itemErrRef.current) markFirstTry(true);
    if (isCorrect) { markFirstTry(firstTryRef.current[idx] ?? !itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setWrong(prev => { const s = new Set(prev); s.add(i); return s; }); voiceWrong(it.no); }
  };
  const submitInput = () => {
    if (done || solvedItem) return;
    const v = parseInt(String(val).replace(/\s/g, ''), 10);
    if (isNaN(v)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = v === it.answer;
    if (isCorrect) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setShowHint(true); voiceWrong(it.no); }
  };
  const toggleMulti = (i) => { if (done || solvedItem) return; setShowHint(false); setSel(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const submitMulti = () => {
    if (done || solvedItem) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const want = new Set(it.correctSet);
    const ok = sel.size === want.size && [...sel].every(i => want.has(i));
    if (ok) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setShowHint(true); voiceWrong(it.no); }
  };

  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true" style={{ position: 'relative' }}>
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 'clamp(14px, 2.6vw, 20px)' }}>
              {(() => { const qStr = tx(it.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(qStr)}</p>; })()}
              {it.type === 'input' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <input type="text" inputMode="numeric" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={solvedItem ? String(it.answer) : val} placeholder="0" disabled={solvedItem}
                    onChange={e => { setVal(e.target.value); setShowHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(90px, 20vw, 120px)' }}/>
                  {!solvedItem && <button className="btn-white-accent" onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
                </div>
              )}
            </div>
            {it.type === 'mc' && (
              <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.2vw, 19px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}
            {it.type === 'multi' && (
              <>
                <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                  {it.opts.map((o, i) => {
                    const on = sel.has(i);
                    return (
                      <button key={i} className={`option${on ? ' option-correct' : ''}`} disabled={solvedItem} onClick={() => toggleMulti(i)}
                        style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 17px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 600 }}>
                        {mt(tx(o))}
                      </button>
                    );
                  })}
                </div>
                {!solvedItem && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submitMulti} disabled={sel.size === 0} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
              </>
            )}
            <FeedbackBlock show={solvedItem || showHint || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
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
// DRAG-AND-DROP — tap (mobil) + sichqoncha-drag gibridi. веди-до-верного, keep-visible, storedAnswer tiklash.
// ============================================================
const DragToSlots = ({ screen, idx, c, chips, correct, renderBoard, slotSize = 'sm', factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const N = correct.length;
  const audio = useAudio([{ id: `d${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? correct.slice() : Array(N).fill(null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const chipById = (id) => chips.find(ch => ch.id === id);
  const dropTo = (slot) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const n = [...p]; n[slot] = sel; return n; }); setSel(null); };
  const returnChip = (slot) => { if (solved) return; setChecked(false); setPlace(p => { const n = [...p]; n[slot] = null; return n; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = correct.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: correct.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setPlace(p => p.map((v, i) => (v === correct[i] ? v : null)));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const slotEl = (i) => (
    <span key={`sl${i}`} className={`dnd-slot dnd-slot-${slotSize}${sel !== null && place[i] === null ? ' dnd-slot-armed' : ''}${solved ? ' dnd-ok' : ''}`}
      onClick={() => { if (place[i] === null) dropTo(i); else returnChip(i); }}
      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); dropTo(i); }}>
      {place[i] !== null ? chipById(place[i]).node : <span className="dnd-slot-q">?</span>}
    </span>
  );
  const trayChips = chips.filter(ch => !place.includes(ch.id));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>{renderBoard(slotEl)}</div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2" style={{ position: 'relative' }}>
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(ch => (
              <span key={ch.id} className={`dnd-chip${sel === ch.id ? ' dnd-chip-sel' : ''}`} draggable onDragStart={() => setSel(ch.id)} onClick={() => setSel(s => (s === ch.id ? null : ch.id))}>{ch.node}</span>
            ))}
          </div>
        )}
        {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// DragToBins: chiplarni savatlarga (klassifikatsiya). place[itemIdx] = binId.
const DragToBins = ({ screen, idx, c, items, bins, correct, factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const audio = useAudio([{ id: `d${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? correct.slice() : items.map(() => null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const dropTo = (bin) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const n = [...p]; n[sel] = bin; return n; }); setSel(null); };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const n = [...p]; n[i] = null; return n; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = correct.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: correct.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setPlace(p => p.map((v, i) => (v === correct[i] ? v : null)));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const trayChips = items.map((it, i) => (place[i] === null ? i : null)).filter(i => i !== null);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-bins fade-up delay-1" style={{ position: 'relative', maxHeight: solved ? 0 : 900, opacity: solved ? 0 : 1, overflow: 'hidden', transition: 'opacity 0.4s, max-height 0.6s' }}>
          {bins.map(bin => {
            const inBin = items.map((it, i) => (place[i] === bin.id ? i : null)).filter(i => i !== null);
            return (
              <div key={bin.id} className={`dnd-bin${sel !== null ? ' dnd-bin-armed' : ''}`} onClick={() => dropTo(bin.id)}
                onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); dropTo(bin.id); }}>
                <span className="dnd-bin-lbl">{t(bin.label)}</span>
                <div className="dnd-bin-slot">
                  {inBin.map(i => {
                    const right = solved && place[i] === correct[i];
                    return (
                      <span key={i} className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`} draggable={!solved} onDragStart={() => setSel(i)}
                        onClick={e => { e.stopPropagation(); returnChip(i); }}>{items[i].node}</span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2" style={{ position: 'relative' }}>
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`} draggable onDragStart={() => setSel(i)} onClick={() => onChipClick(i)}>{items[i].node}</span>
            ))}
          </div>
        )}
        {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================
// s0 — HOOK: Bahodir 2 to'la quti + 3 ochiq, (2+3)/5 = 5/5 xatosi (harakatli)
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <MixedBoxes whole={2} num={3} den={5} color={T.accent} anim/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Mixed w={2} n={3} d={5} color={T.ink}/><Op>=</Op>
            <span className="qb-wrong"><Frac n="5" d="5" size="mid" color={T.ink3}/></span>
            <span className="mop hk-q" style={{ color: T.accent }}>?</span>
          </div>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)} style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span><span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: aralash son nimani anglatadi
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 180, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.4vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Mixed w={2} n={3} d={5} color={T.accent} size="lg"/>
            {step >= 1 && <span className="qb-fade"><Op>=</Op></span>}
            {step >= 1 && <div className="qb-fade"><MixedBoxes whole={step >= 1 ? 2 : 0} num={step >= 2 ? 3 : 0} den={5} color={T.accent}/></div>}
          </div>
          {step >= 1 && <p className="small qb-fade" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? '2 ta toʼla quti' : '2 полные коробки'}</p>}
          {step >= 3 && <p className="body qb-fade" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION (mixed -> improper): 2x5=10, +3=13
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const total = step >= 2 ? 13 : (step >= 1 ? 10 : 0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', minHeight: 190, justifyContent: 'center' }}>
          {step === 0 ? <MixedBoxes whole={2} num={3} den={5} color={T.accent} anim/> : <LooseDots count={total} color={T.accent} anim/>}
          {step >= 1 && <div className="qb-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="small" style={{ color: T.ink3 }}>{t(c.step_lbl)}</span>
            <span className="qb-counter mono">{total}</span>
          </div>}
          {step >= 1 && <p className="body qb-fade" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(step >= 3 ? c.s3 : (step >= 2 ? c.s2 : c.s1)))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (improper -> mixed): 13 donani 5 talik qutilarga
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const fullBoxes = Math.min(step, 2);
  const loose = 13 - fullBoxes * 5;
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', minHeight: 190, justifyContent: 'center' }}>
          <div className="qb-row" style={{ alignItems: 'center' }}>
            {Array.from({ length: fullBoxes }).map((_, i) => <ItemBox key={`b${i}`} cap={5} filled={5} color={T.blue}/>)}
            {step >= 3 && loose > 0 && <ItemBox cap={5} filled={loose} color={T.blue} partial/>}
            {step < 3 && loose > 0 && <LooseDots count={loose} color={T.accent}/>}
          </div>
          {step >= 1 && <p className="body qb-fade" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(step >= 3 ? c.s3 : (step >= 2 ? c.s2 : c.s1)))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s4 — RULE: ikki yo'l
const RuleCard = ({ lbl, a, b, eq, color }) => {
  const t = useT();
  return (
    <div className="frame" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, borderTop: `3px solid ${color}` }}>
      <p className="eyebrow" style={{ color, margin: 0 }}>{t(lbl)}</p>
      <p className="body" style={{ margin: 0 }}>{mt(t(a))}</p>
      <p className="small" style={{ margin: 0, color: T.ink2 }}>{mt(t(b))}</p>
      <p className="mono" style={{ margin: 0, marginTop: 2, fontWeight: 700, color, fontSize: 'clamp(13px, 1.8vw, 16px)' }}>{mt(t(eq))}</p>
    </div>
  );
};
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="qb-rules fade-up delay-1" style={{ position: 'relative' }}>
          <RuleCard lbl={c.rule1_lbl} a={c.rule1_a} b={c.rule1_b} eq={c.rule1_eq} color={T.accent}/>
          <RuleCard lbl={c.rule2_lbl} a={c.rule2_a} b={c.rule2_b} eq={c.rule2_eq} color={T.blue}/>
        </div>
      </div>
    </Stage>
  );
};

// sfill — DRAG-FILL: 2 3/5 = 13/5. Maqsad yuqorida, 2 ta yorliqlangan qadam pastda. Alohida qiymatlar (10, 13).
const ScreenDragFill = (props) => {
  const t = useT(); const c = CONTENT.sfill;
  const chips = [8, 10, 13, 16].map(v => ({ id: String(v), node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(15px, 2.4vw, 19px)' }}>{v}</span> }));
  const correct = ['10', '13'];
  const renderBoard = (slotEl) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 18px)', alignItems: 'stretch', width: '100%', maxWidth: 380 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span className="small" style={{ color: T.ink3 }}>{t(c.goal_lbl)}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Mixed w={2} n={3} d={5} color={T.accent}/><Op>=</Op>
          <span className="dnd-frac"><span className="dnd-frac-q">?</span><span className="dnd-frac-bar"/><span className="dnd-frac-d">5</span></span>
        </span>
      </div>
      <div className="qb-fillrow"><span className="qb-fill-lbl">{t(c.lbl_mul)}</span><span className="mono qb-fill-eq">2<Op>×</Op>5<Op>=</Op>{slotEl(0)}</span></div>
      <div className="qb-fillrow"><span className="qb-fill-lbl">{t(c.lbl_add)}</span><span className="mono qb-fill-eq">10<Op>+</Op>3<Op>=</Op>{slotEl(1)}</span></div>
    </div>
  );
  return <DragToSlots {...props} idx={5} c={c} chips={chips} correct={correct} slotSize="sm" renderBoard={renderBoard} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// sbins — DRAG-CLASSIFY: butun / aralash
const ScreenDragBins = (props) => {
  const c = CONTENT.sbins;
  const items = [c.it0, c.it1, c.it2, c.it3].map((node, i) => ({ id: i, node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(15px, 2.4vw, 19px)' }}>{mt(node.uz)}</span> }));
  const bins = [{ id: 'bw', label: c.binW }, { id: 'bm', label: c.binM }];
  const correct = ['bw', 'bm', 'bw', 'bm'];
  return <DragToBins {...props} idx={6} c={c} items={items} bins={bins} correct={correct} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s7 — 5 TA OSON SAVOL (SeqMC)
const Screen7 = (props) => <SeqMC {...props} screenContent={CONTENT.s7} scored={true}/>;

// s8 — 6-8 MISOL OSON->QIYIN (SeqMix)
const Screen8 = (props) => <SeqMix {...props} screenContent={CONTENT.s8} scored={true}/>;

// sorder — DRAG-ORDER: kichikdan kattaga (5/4 < 7/4 < 2 1/4)
const ScreenDragOrder = (props) => {
  const t = useT(); const c = CONTENT.sorder;
  const chips = [
    { id: 'a', node: <Frac n="5" d="4" size="mid" color={T.success}/> },
    { id: 'b', node: <Frac n="7" d="4" size="mid" color={T.accent}/> },
    { id: 'c', node: <Mixed w={2} n={1} d={4} color={T.blue}/> }
  ];
  const correct = ['a', 'b', 'c'];
  const labels = [c.slot0, c.slot1, c.slot2];
  const renderBoard = (slotEl) => (
    <div style={{ display: 'flex', gap: 'clamp(10px, 3.5vw, 26px)', alignItems: 'flex-end', justifyContent: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {slotEl(i)}
          <span className="mono small" style={{ color: T.ink3 }}>{t(labels[i])}</span>
        </div>
      ))}
    </div>
  );
  return <DragToSlots {...props} idx={9} c={c} chips={chips} correct={correct} slotSize="lg" renderBoard={renderBoard} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s10 — CASE setup: Iroda 23 tuxum, qutida 4
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <LooseDots count={23} color={T.accent}/>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="small" style={{ color: T.ink2 }}>{t(c.cap_label)}: <span className="mono" style={{ fontWeight: 700, color: T.ink }}>23</span></span>
            <span className="small" style={{ color: T.ink2 }}>{t(c.box_label)}: <span className="mono" style={{ fontWeight: 700, color: T.ink }}>4</span></span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Frac n="23" d="4" size="mid" color={T.accent}/><Op>=</Op><span className="mop hk-q" style={{ color: T.ink3 }}>?</span></span>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s11 — CASE final MC: 23/4 = 5 3/4 (keep-visible, scored final)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Mixed w={5} n={3} d={4}/>, <Mixed w={4} n={3} d={4}/>, <Mixed w={5} n={1} d={4}/>, <Mixed w={6} n={1} d={4}/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const titleNode = c.label;
  const question = (
    <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Frac n="23" d="4" size="mid" color={T.accent}/><Op>=</Op><span className="mop hk-q" style={{ color: T.ink3 }}>?</span></span>
    </div>
  );
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} titleNode={titleNode} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>} badge={FACT_BADGE}/>}/>;
};

// s12 — SUMMARY (kanonik Dars09-13 layout)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, [finishLesson]);
  const scoredScreens = SCREEN_META.filter(s => s.scored);
  const total = scoredScreens.length;
  const correct = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-white-accent" onClick={onReset} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.success, margin: 0 }}>{t(c.label)}</p>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 700, color: T.success }}>{correct} / {total}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.main_label)}</p>
          {mains.map((mn, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span><p className="body" style={{ margin: 0 }}>{mt(t(mn))}</p></div>))}
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.back_to_hook))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVIY KOMPONENT
// ============================================================
export default function MixedNumberLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, ScreenDragFill, ScreenDragBins, Screen7, Screen8, ScreenDragOrder, Screen10, Screen11, Screen12];
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

// ============================================================
// CSS — bazaviy (Dars28) + dars22 maxsus (quti/dona/hook/drag/fakt)
// ============================================================
const STYLES = `/*__BASE__*/

/* === Dars22 (frac_5_14) maxsus CSS === */
/* HOOK jonli animatsiya */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }
.hk-q { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(20px, 3vw, 26px); animation: hkQ 1.3s ease-in-out infinite; }
@keyframes hkQ { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 1; text-shadow: 0 0 12px rgba(255, 79, 40, 0.5); } }
.qb-wrong { position: relative; opacity: 0.85; }
.qb-wrong::after { content: ''; position: absolute; left: -4px; right: -4px; top: 50%; height: 2.5px; background: #C8503A; transform: rotate(-10deg); border-radius: 2px; }

/* === QUTI VA DONA === */
.qb-row { display: flex; flex-wrap: wrap; gap: clamp(8px, 1.8vw, 14px); justify-content: center; align-items: flex-end; }
.qb-box { background: #FDFBF7; border: 2px solid #D9C9B0; border-radius: 12px; padding: clamp(6px, 1.2vw, 9px); box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.18); }
.qb-box-part { border-style: dashed; border-color: #A7A6A2; background: #FFFFFF; }
.qb-grid { display: grid; gap: clamp(3px, 0.8vw, 5px); }
.qb-dot { width: clamp(13px, 2.6vw, 18px); height: clamp(13px, 2.6vw, 18px); border-radius: 50%; background: rgba(167, 166, 162, 0.20); box-shadow: inset 0 0 0 1.5px rgba(167, 166, 162, 0.35); }
.qb-dot-on { box-shadow: inset 0 -2px 3px rgba(0,0,0,0.12); }
.qb-loose { display: flex; flex-wrap: wrap; gap: clamp(4px, 1vw, 7px); justify-content: center; max-width: 360px; }
.qb-drop { animation: qbDrop 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) backwards; }
@keyframes qbDrop { from { opacity: 0; transform: translateY(-14px) scale(0.4); } }
.qb-counter { font-size: clamp(30px, 6vw, 46px); font-weight: 700; color: #FF4F28; line-height: 1; }
.qb-fade { animation: qbFade 0.5s ease backwards; }
@keyframes qbFade { from { opacity: 0; transform: translateY(8px); } }

/* === RULE ikki karta === */
.qb-rules { display: flex; gap: clamp(10px, 2vw, 16px); }
@media (max-width: 620px) { .qb-rules { flex-direction: column; } }

/* === drag-FILL bosqichli qatorlar === */
.qb-fillrow { display: flex; align-items: center; justify-content: space-between; gap: clamp(8px, 2vw, 16px); background: #FDFBF7; border: 1.5px solid #EDE6DA; border-radius: 12px; padding: clamp(8px, 1.5vw, 11px) clamp(11px, 2vw, 15px); }
.qb-fill-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.qb-fill-eq { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); font-weight: 700; font-size: clamp(15px, 2.2vw, 18px); }
.dnd-frac-q { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 20px); color: #A7A6A2; }

/* fakt: progress (yuklash) */
.fa-prog { position: relative; width: 66px; height: 16px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.2s ease-in-out infinite; }
@keyframes faProg { 0% { width: 6%; } 60% { width: 80%; } 100% { width: 6%; } }

/* === DRAG-AND-DROP (Dars37 dnd uslubi + katak slotlari) === */
.dnd-bins { display: flex; gap: clamp(8px, 1.8vw, 14px); }
.dnd-bin { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; background: #FDFBF7; border: 2px dashed #A7A6A2; border-radius: 14px; padding: clamp(8px, 1.5vw, 11px) clamp(6px, 1.2vw, 10px); transition: border-color 0.2s, background 0.2s; cursor: pointer; }
.dnd-bin-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-bin-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.6vw, 14px); color: #5A5A60; text-align: center; }
.dnd-bin-slot { display: flex; flex-direction: column; gap: 6px; min-height: clamp(42px, 8vw, 54px); align-items: stretch; justify-content: center; }
.dnd-tray { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: clamp(9px, 1.6vw, 12px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.dnd-tray-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #A7A6A2; text-transform: uppercase; letter-spacing: 0.06em; }
.dnd-chip { cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none; display: inline-flex; align-items: center; justify-content: center; background: #FFFFFF; border: 1.5px solid #FF4F28; border-radius: 99px; padding: clamp(8px, 1.4vw, 10px) clamp(13px, 2.1vw, 17px); font-weight: 600; color: #0E0E10; box-shadow: 0 4px 12px -4px rgba(255, 79, 40, 0.25); transition: transform 0.15s, box-shadow 0.15s, background 0.18s; }
.dnd-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(255, 79, 40, 0.38); }
.dnd-chip-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 8px 20px -5px rgba(255, 79, 40, 0.5); }
.dnd-chip-in { cursor: pointer; text-align: center; border-color: #019ACB; box-shadow: 0 4px 12px -4px rgba(1, 154, 203, 0.28); }
.dnd-ok { border-color: #1F7A4D !important; background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 4px 12px -4px rgba(31, 122, 77, 0.3) !important; }
.dnd-slot { display: inline-flex; align-items: center; justify-content: center; border: 2px dashed #A7A6A2; border-radius: 10px; background: #FDFBF7; cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.15s; vertical-align: middle; }
.dnd-slot-sm { min-width: clamp(34px, 7vw, 44px); min-height: clamp(30px, 6vw, 38px); }
.dnd-slot-lg { min-width: clamp(56px, 13vw, 76px); min-height: clamp(52px, 11vw, 66px); }
.dnd-slot-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-slot-q { color: #A7A6A2; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 20px); }
.dnd-frac { display: inline-flex; flex-direction: column; align-items: center; gap: 3px; vertical-align: middle; }
.dnd-frac-bar { width: clamp(34px, 7vw, 46px); height: 2px; background: #0E0E10; }
.dnd-frac-d { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 20px); color: #0E0E10; }

/* === Harakatni kamaytirish (accessibility) === */
@media (prefers-reduced-motion: reduce) {
  .amb-o, .hook-sheen, .hook-glow, .hk-q, .qb-drop, .fa-prog-fill { animation: none !important; }
  .qb-fade { animation: none !important; }
}
`;
