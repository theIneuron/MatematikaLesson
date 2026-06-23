// ============================================================
// --- UROK: dec_5_04 — O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish
//          Умножение и деление десятичной дроби на 10, 100, 1000
// Keep-visible noldan yig'ish (etalon: Dars28/Dars37/Dars09). Infra Dars28 dan bayt-aniq.
// Model: VergulSakraydi — raqam yo'lakchasi; vergul o'ngga (×) yoki chapga (÷) sakraydi,
//        bo'sh kataklarga nol to'ladi. Hook = konseptual "nega nol qo'shsak xato?".
// ============================================================
const LESSON_META = {
  lessonId: 'dec-5-04-v2',
  lessonTitle: { ru: 'Умножение и деление десятичной дроби на 10, 100, 1000', uz: "O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish" }
};
const TOTAL_SCREENS = 13;
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',          scored: false, scope: null },        // 1  spaced-retrieval (razryadlar)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },        // 2  ×10
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },        // 3  ×100/×1000
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },        // 4  ÷ (chapga, oldida nollar)
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },        // 5  qoida (birlashgan)
  { id: 's6',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },  // 6  5 OSON SAVOL
  { id: 's7',  type: 'test',        template: 'DragToBins',     scored: true,  scope: 'practice' },  // 7  drag-classify ×/÷
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },  // 8  vergulni qo'yish
  { id: 's9',  type: 'test',        template: 'DragToSlots',    scored: true,  scope: 'practice' },  // 9  drag-fill (nechaga?)
  { id: 's10', type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 10 masala (Nilufar)
  { id: 's11', type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },      // 11 6-8 MISOL OSON->QIYIN
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null }          // 12
];

const CONTENT = {
  // ── s0 HOOK — konseptual "nega nol qo'shsak xato?" (harakatli VergulSakraydi) ──
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    lead: { ru: 'Кто-то умножил 2,5 на 10 и просто приписал ноль справа — получил 2,50.', uz: "Kimdir 2,5 ni 10 ga ko'paytirdi va o'ngiga shunchaki nol qo'shdi — 2,50 chiqardi." },
    question: { ru: 'Почему приписать ноль (2,50) — это ошибка?', uz: "Nega oxiriga nol qo'shish (2,50) — bu xato?" },
    opt0: { ru: '2,50 это столько же, сколько 2,5. Умножение должно увеличить число — двигаем запятую, выходит 25.', uz: "2,50 bu 2,5 ning o'zi. Ko'paytirish sonni kattalashtirishi kerak — vergulni suramiz, 25 bo'ladi." },
    opt1: { ru: 'Всё верно, 2,50 — это правильный ответ.', uz: "Hammasi to'g'ri, 2,50 — to'g'ri javob." },
    opt2: { ru: 'Пока не уверен(а).', uz: "Hozircha aniq emas." },
    audio: { ru: 'Смотри: число две целых пять десятых умножили на десять и просто приписали ноль справа, получив две целых пять десятых с нулём. Но это то же самое число, оно не выросло. А умножение должно увеличивать. Значит ноль приписывать нельзя. Подумай, в чём тут секрет, и выбери ответ.', uz: "Qara: ikki butun o'ndan besh sonini o'nga ko'paytirib, o'ngiga shunchaki nol qo'shishdi, nol bilan ikki butun o'ndan besh chiqdi. Lekin bu o'sha sonning o'zi, u o'smadi. Ko'paytirish esa kattalashtirishi kerak. Demak nol qo'shib bo'lmaydi. Siri nimada ekanini o'ylab, javobni tanlang." }
  },

  // ── s1 WARM-UP — SeqMC, spaced retrieval (razryadlar, dec_5_01) ──
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    title: { ru: 'Вспомним разряды', uz: "Xonalarni eslaymiz" },
    lead: { ru: 'Три быстрых вопроса — сегодня пригодятся.', uz: "Uchta tez savol — bugun asqotadi." },
    audio: {
      intro: { ru: 'Перед новой темой вспомним разряды. Чему равна ноль целых семь десятых обыкновенной дробью? Нажми ответ.', uz: "Yangi mavzudan oldin xonalarni eslaymiz. Nol butun o'ndan yetti oddiy kasr bilan nechaga teng? Javobni bosing." },
      on_wrong: { ru: 'Не совсем. Сколько цифр после запятой, столько нулей в знаменателе.', uz: "Unchalik emas. Verguldan keyin nechta raqam, maxrajda shuncha nol." },
      on_done: { ru: 'Разряды помним. Теперь к новой теме.', uz: "Xonalarni eslaymiz. Endi yangi mavzuga." }
    },
    questions: [
      { q: { ru: '0,7 = ?', uz: "0,7 = ?" }, opts: ['7/100', '7/10', '1/7'], correct: 1,
        say: { ru: 'Сколько это обыкновенной дробью?', uz: "Bu oddiy kasr bilan nechaga teng?" },
        ok: { ru: 'Одна цифра после запятой — десятые: 7/10.', uz: "Verguldan keyin bitta raqam — o'ndan: 7/10." },
        no: { ru: 'Одна цифра после запятой, это десятые.', uz: "Verguldan keyingi bitta raqam, o'ndan." } },
      { q: { ru: '0,03 = ?', uz: "0,03 = ?" }, opts: ['3/100', '3/10', '3/1000'], correct: 0,
        say: { ru: 'А теперь сотые.', uz: "Endi yuzdan." },
        ok: { ru: 'Две цифры после запятой — сотые: 3/100.', uz: "Verguldan keyin ikki raqam — yuzdan: 3/100." },
        no: { ru: 'Две цифры после запятой, это сотые.', uz: "Verguldan keyin ikki raqam, yuzdan." } },
      { q: { ru: '1/1000 = ?', uz: "1/1000 = ?" }, opts: ['0,1', '0,01', '0,001'], correct: 2,
        say: { ru: 'И последний.', uz: "Va oxirgisi." },
        ok: { ru: 'Тысячные — три цифры после запятой: 0,001.', uz: "Mingdan — verguldan keyin uch raqam: 0,001." },
        no: { ru: 'Тысячные стоят на третьем месте после запятой.', uz: "Mingdan verguldan keyin uchinchi o'rinda turadi." } }
    ]
  },

  // ── s2 EXPLORATION: ×10 — vergul 1 o'rin o'ngga (harakatli) ──
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Умножаем на 10', uz: "10 ga ko'paytiramiz" },
    conclusion: { ru: 'Умножить на 10 — это сдвинуть запятую на одно место вправо. 2,5 стало 25 — в десять раз больше.', uz: "10 ga ko'paytirish — vergulni bir o'rin o'ngga surish. 2,5 endi 25 bo'ldi — o'n marta katta." },
    btn_step: { ru: 'Умножить на 10', uz: "10 ga ko'paytirish" },
    btn_final: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: {
      ru: [
        'Вернёмся к нашему числу две целых пять десятых. Умножим его на десять. Нажми кнопку.',
        'Запятая прыгнула на одно место вправо. Было две целых пять десятых, стало двадцать пять. Это в десять раз больше, как и должно быть при умножении. Никакого нуля приписывать не нужно.'
      ],
      uz: [
        "Sonimizga qaytamiz, ikki butun o'ndan besh. Uni o'nga ko'paytiramiz. Tugmani bosing.",
        "Vergul bir o'rin o'ngga sakradi. Ikki butun o'ndan besh edi, yigirma besh bo'ldi. Bu o'n marta katta, ko'paytirishda shunday bo'lishi kerak. Hech qanday nol qo'shish shart emas."
      ]
    }
  },

  // ── s3 EXPLORATION: ×100 — ikki sakrash, bo'sh xonaga nol ──
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'На 100 — два прыжка', uz: "100 ga — ikki sakrash" },
    conclusion: { ru: 'Сколько нулей в множителе — на столько мест прыгает запятая. На 100 — два места; не хватило цифры — встал ноль: 250. На 1000 было бы три места.', uz: "Ko'paytuvchida nechta nol — vergul shuncha o'rin sakraydi. 100 ga — ikki o'rin; raqam yetmadi — nol turdi: 250. 1000 ga uch o'rin bo'lardi." },
    btn_step: { ru: 'Умножить на 100', uz: "100 ga ko'paytirish" },
    btn_final: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: {
      ru: [
        'А если умножить на сто? У ста два нуля, значит запятая прыгнет на два места. Нажми кнопку.',
        'Запятая прыгнула на два места вправо. Цифры не хватило, и на пустой разряд встал ноль, получилось двести пятьдесят. А на тысячу запятая прыгнула бы на три места, потому что у тысячи три нуля.'
      ],
      uz: [
        "100 ga ko'paytirsak-chi? Yuzning ikkita noli bor, demak vergul ikki o'rin sakraydi. Tugmani bosing.",
        "Vergul ikki o'rin o'ngga sakradi. Raqam yetmadi va bo'sh xonaga nol turdi, ikki yuz ellik bo'ldi. Mingga esa vergul uch o'rin sakrardi, chunki mingning uchta noli bor."
      ]
    }
  },

  // ── s4 EXPLORATION: ÷100 — vergul chapga, oldida nollar ──
  s4: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Делим — запятая идёт влево', uz: "Bo'lamiz — vergul chapga boradi" },
    conclusion: { ru: 'При делении запятая идёт влево. 5 разделить на 100 — два места влево; слева цифр не хватило, поэтому впереди появились нули и ноль целых: 0,05. На 1000 было бы три места — 0,005.', uz: "Bo'lishda vergul chapga boradi. 5 ni 100 ga — ikki o'rin chapga; chapda raqam yetmadi, shuning uchun oldida nollar va nol butun paydo bo'ldi: 0,05. 1000 ga uch o'rin bo'lardi — 0,005." },
    btn_step: { ru: 'Разделить на 100', uz: "100 ga bo'lish" },
    btn_final: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: {
      ru: [
        'Теперь деление. Возьмём целое число пять и разделим на сто. У ста два нуля. Нажми кнопку.',
        'Запятая пошла влево на два места. Слева цифр не хватило, поэтому впереди появились нули и ноль целых, получилось ноль целых пять сотых. Деление уменьшает число, и это правильно.'
      ],
      uz: [
        "Endi bo'lish. Butun son beshni olamiz va yuzga bo'lamiz. Yuzning ikkita noli bor. Tugmani bosing.",
        "Vergul chapga ikki o'rin bordi. Chapda raqam yetmadi, shuning uchun oldida nollar va nol butun paydo bo'ldi, nol butun yuzdan besh chiqdi. Bo'lish sonni kichraytiradi, bu to'g'ri."
      ]
    }
  },

  // ── s5 RULE — birlashgan qoida ──
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Одно правило для всего', uz: "Hammasi uchun bitta qoida" },
    label: { ru: 'Запомни', uz: "Eslab qoling" },
    rule_mul: { ru: 'Умножаем на 10, 100, 1000 — запятая идёт ВПРАВО на столько мест, сколько нулей в множителе.', uz: "10, 100, 1000 ga ko'paytiramiz — vergul ko'paytuvchidagi nollar soni qancha bo'lsa, shuncha o'rin O'NGGA boradi." },
    rule_div: { ru: 'Делим на 10, 100, 1000 — запятая идёт ВЛЕВО на столько же мест.', uz: "10, 100, 1000 ga bo'lamiz — vergul shuncha o'rin CHAPGA boradi." },
    warn_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warn: { ru: 'Не приписывай ноль, как у целых чисел! Двигай запятую, а нули — только чтобы заполнить пустые разряды.', uz: "Butun sonlardek nol qo'shmang! Vergulni suring, nollarni esa — faqat bo'sh xonalarni to'ldirish uchun." },
    audio: { ru: 'Соберём одно правило. Чтобы умножить на десять, сто или тысячу, сдвигаем запятую вправо на столько мест, сколько нулей в множителе. Чтобы разделить — на столько же мест, но влево. И главное: не приписывай ноль, как у целых чисел. Мы двигаем запятую, а нули ставим только туда, где не хватило цифр.', uz: "Bitta qoidaga yig'amiz. O'nga, yuzga yoki mingga ko'paytirish uchun vergulni nollar soni qancha bo'lsa shuncha o'rin o'ngga suramiz. Bo'lish uchun — shuncha o'rin, lekin chapga. Eng muhimi: butun sonlardek nol qo'shmang. Biz vergulni suramiz, nollarni esa faqat raqam yetmagan joyga qo'yamiz." }
  },

  // ── s6 — 5 OSON SAVOL (SeqMC, scored practice) ──
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: '5 быстрых примеров', uz: "5 ta tez misol" },
    lead: { ru: 'Сдвигай запятую в уме. Нажми ответ.', uz: "Vergulni xayolan suring. Javobni bosing." },
    audio: {
      intro: { ru: 'Пять быстрых примеров. Считай, на сколько мест и в какую сторону идёт запятая. Нажимай ответ.', uz: "Besh ta tez misol. Vergul necha o'rin va qaysi tomonga borishini sanang. Javobni bosing." },
      on_wrong: { ru: 'Не спеши. Сколько нулей, столько мест; умножаем, вправо, делим, влево.', uz: "Shoshmang. Nechta nol, shuncha o'rin; ko'paytirsak, o'ngga, bo'lsak, chapga." },
      on_done: { ru: 'Отлично, все пять решены.', uz: "Ajoyib, beshtasi ham yechildi." }
    },
    questions: [
      { q: { ru: '1,4 × 10', uz: "1,4 × 10" }, opts: ['1,40', '14', '140'], correct: 1,
        say: { ru: 'Одна целая четыре десятых умножить на десять.', uz: "Bir butun o'ndan to'rt karra o'n." },
        ok: { ru: 'На 10 — одно место вправо: 14.', uz: "10 ga — bir o'rin o'ngga: 14." },
        no: { ru: 'Двигай запятую на одно место вправо, ноль не дописывай.', uz: "Vergulni bir o'rin o'ngga suring, nol qo'shmang." } },
      { q: { ru: '6 ÷ 10', uz: "6 ÷ 10" }, opts: ['0,6', '60', '0,06'], correct: 0,
        say: { ru: 'Шесть разделить на десять.', uz: "Olti bo'lingan o'n." },
        ok: { ru: 'На 10 — одно место влево: 0,6.', uz: "10 ga — bir o'rin chapga: 0,6." },
        no: { ru: 'При делении запятая идёт влево на одно место.', uz: "Bo'lishda vergul bir o'rin chapga boradi." } },
      { q: { ru: '0,3 × 100', uz: "0,3 × 100" }, opts: ['3', '300', '30'], correct: 2,
        say: { ru: 'Ноль целых три десятых умножить на сто.', uz: "Nol butun o'ndan uch karra yuz." },
        ok: { ru: 'На 100 — два места вправо: 30.', uz: "100 ga — ikki o'rin o'ngga: 30." },
        no: { ru: 'На сто двигай вправо на два места.', uz: "Yuzga ikki o'rin o'ngga suring." } },
      { q: { ru: '2,5 × 10', uz: "2,5 × 10" }, opts: ['2,50', '25', '250'], correct: 1,
        say: { ru: 'Две целых пять десятых умножить на десять.', uz: "Ikki butun o'ndan besh karra o'n." },
        ok: { ru: 'Верно: 25, а не 2,50. Запятую двигаем, ноль не приписываем.', uz: "To'g'ri: 25, 2,50 emas. Vergulni suramiz, nol qo'shmaymiz." },
        no: { ru: '2,50 это то же, что 2,5. Сдвинь запятую, будет 25.', uz: "2,50 bu 2,5 ning o'zi. Vergulni suring, 25 bo'ladi." } },
      { q: { ru: '45 ÷ 1000', uz: "45 ÷ 1000" }, opts: ['0,45', '0,045', '0,0045'], correct: 1,
        say: { ru: 'Сорок пять разделить на тысячу.', uz: "Qirq besh bo'lingan ming." },
        ok: { ru: 'На 1000 — три места влево: 0,045.', uz: "1000 ga — uch o'rin chapga: 0,045." },
        no: { ru: 'На тысячу запятая идёт влево на три места.', uz: "Mingga vergul uch o'rin chapga boradi." } }
    ]
  },

  // ── s7 — DRAG-CLASSIFY: ×(katta) / ÷(kichik) savatlari ──
  s7: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Станет больше или меньше?', uz: "Katta yoki kichik bo'ladi?" },
    lead: { ru: 'Перетащи каждую запись в нужную корзину: число станет больше или меньше.', uz: "Har bir yozuvni kerakli savatga sudrang: son katta yoki kichik bo'ladi." },
    bin_big: { ru: 'Станет больше (×)', uz: "Katta bo'ladi (×)" },
    bin_small: { ru: 'Станет меньше (÷)', uz: "Kichik bo'ladi (÷)" },
    it0: { ru: '2,5 × 10', uz: "2,5 × 10" },
    it1: { ru: '6 ÷ 10', uz: "6 ÷ 10" },
    it2: { ru: '0,3 × 100', uz: "0,3 × 100" },
    it3: { ru: '40 ÷ 1000', uz: "40 ÷ 1000" },
    tray_label: { ru: 'Записи', uz: "Yozuvlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Умножение увеличивает число, деление уменьшает. Смотри на знак.', uz: "Ko'paytirish sonni kattalashtiradi, bo'lish kichraytiradi. Belgiga qarang." },
    correct_text: { ru: 'Верно! Умножение на 10, 100, 1000 увеличивает, деление — уменьшает.', uz: "To'g'ri! 10, 100, 1000 ga ko'paytirish kattalashtiradi, bo'lish — kichraytiradi." },
    fact: { ru: 'Компьютер умножение на 10, 100 и 1000 делает сдвигом запятой — это одна из самых быстрых операций.', uz: "Kompyuter 10, 100, 1000 ga ko'paytirishni vergul surish bilan bajaradi — bu eng tez amallardan biri." },
    audio: {
      intro: { ru: 'Рассортируй записи. Если умножаем, число станет больше, если делим, меньше. Нажми или перетащи в корзину, потом нажми проверить.', uz: "Yozuvlarni ajrating. Ko'paytirsak, son katta, bo'lsak, kichik bo'ladi. Savatga bosing yoki sudrang, keyin tekshirishni bosing." },
      on_correct: { ru: 'Отлично. Умножение увеличивает, деление уменьшает.', uz: "Ajoyib. Ko'paytirish kattalashtiradi, bo'lish kichraytiradi." },
      on_wrong: { ru: 'Пока не так. Знак умножения увеличивает, деления, уменьшает.', uz: "Hozircha emas. Ko'paytirish belgisi kattalashtiradi, bo'lish, kichraytiradi." }
    }
  },

  // ── s8 — VERGULNI QO'YISH (custom): 475 ÷ 100 = 4,75 ──
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Поставь запятую', uz: "Vergulni qo'ying" },
    lead: { ru: '475 ÷ 100. Нажми на промежуток между цифрами, куда встанет запятая.', uz: "475 ÷ 100. Vergul turadigan, raqamlar orasidagi oraliqni bosing." },
    digits: '475',
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'На 100 запятая идёт влево на два места от правого края: между 4 и 7.', uz: "100 ga vergul o'ng chetdan chapga ikki o'rin boradi: 4 va 7 orasiga." },
    correct_text: { ru: 'Верно: 475 ÷ 100 = 4,75. Два места влево.', uz: "To'g'ri: 475 ÷ 100 = 4,75. Ikki o'rin chapga." },
    audio: {
      intro: { ru: 'Поставь запятую сам. Четыреста семьдесят пять разделить на сто. Нажми на нужный промежуток между цифрами, потом нажми проверить.', uz: "Vergulni o'zingiz qo'ying. To'rt yuz yetmish beshni yuzga bo'lamiz. Kerakli oraliqni bosing, keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно, четыре целых семьдесят пять сотых.', uz: "To'g'ri, to'rt butun yuzdan yetmish besh." },
      on_wrong: { ru: 'Пока нет. На сто, это два места влево от конца.', uz: "Hali emas. Yuzga, bu oxiridan ikki o'rin chapga." }
    }
  },

  // ── s9 — DRAG-FILL: 0,04 ni nechaga ko'paytirsak 40 chiqadi? ──
  s9: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'На что умножили?', uz: "Nechaga ko'paytirilgan?" },
    lead: { ru: 'Обратный ход. Перетащи нужный множитель в клетку, чтобы из 0,04 получилось 40.', uz: "Teskari yo'l. 0,04 dan 40 chiqishi uchun kerakli ko'paytuvchini katakka sudrang." },
    tray_label: { ru: 'Множители', uz: "Ko'paytuvchilar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'От 0,04 до 40 запятая прыгнула на три места вправо. Три нуля — это 1000.', uz: "0,04 dan 40 gacha vergul uch o'rin o'ngga sakradi. Uch nol — bu 1000." },
    correct_text: { ru: 'Верно! Запятая прыгнула на три места — значит умножили на 1000.', uz: "To'g'ri! Vergul uch o'rin sakradi — demak 1000 ga ko'paytirilgan." },
    fact: { ru: 'Размеры данных растут шагами по 1000: килобайт, мегабайт, гигабайт. Каждый шаг — сдвиг запятой на три места.', uz: "Ma'lumot hajmi 1000 lik qadamlar bilan o'sadi: kilobayt, megabayt, gigabayt. Har qadam — vergulni uch o'rin surish." },
    audio: {
      intro: { ru: 'Обратный ход. На что умножили ноль целых четыре сотых, чтобы вышло сорок? Перетащи или нажми нужный множитель в клетку, потом нажми проверить.', uz: "Teskari yo'l. Nol butun yuzdan to'rtni nechaga ko'paytirsak qirq chiqadi? Kerakli ko'paytuvchini katakka sudrang yoki bosing, keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно, на тысячу. Запятая прошла три места вправо.', uz: "To'g'ri, mingga. Vergul uch o'rin o'ngga bordi." },
      on_wrong: { ru: 'Пока нет. Посчитай, на сколько мест прыгнула запятая.', uz: "Hali emas. Vergul necha o'rin sakraganini sanang." }
    }
  },

  // ── s10 — CASE (Nilufar, foto hajmi): 100 × 0,2 = 20 MB (QuestionScreen, keep-visible) ──
  s10: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    label: { ru: 'Сколько весят все фото?', uz: "Hamma foto qancha tortadi?" },
    lead: { ru: 'Это нужно в жизни. Нилуфар загружает в облако 100 фотографий, каждая по 0,2 МБ.', uz: "Bu hayotda kerak. Nilufar bulutga 100 ta foto yuklamoqda, har biri 0,2 MB." },
    question_text: { ru: '100 × 0,2 МБ = ?', uz: "100 × 0,2 MB = ?" },
    opt0: { ru: '20 МБ', uz: "20 MB" },
    opt1: { ru: '2 МБ', uz: "2 MB" },
    opt2: { ru: '200 МБ', uz: "200 MB" },
    opt3: { ru: '0,2 МБ', uz: "0,2 MB" },
    correct_text: { ru: 'Верно. Умножаем на 100 — запятая на два места вправо: 0,2 → 20 МБ.', uz: "To'g'ri. 100 ga ko'paytiramiz — vergul ikki o'rin o'ngga: 0,2 → 20 MB." },
    wrong_1: { ru: 'Это сдвиг лишь на одно место (на 10). А множитель 100 — два места: 20 МБ.', uz: "Bu faqat bir o'rin surish (10 ga). Ko'paytuvchi 100 esa — ikki o'rin: 20 MB." },
    wrong_2: { ru: 'Три места — это умножение на 1000. А у нас 100 — два места: 20 МБ.', uz: "Uch o'rin — bu 1000 ga ko'paytirish. Bizda 100 — ikki o'rin: 20 MB." },
    wrong_3: { ru: 'Это размер одной фотографии. А их 100, значит число станет больше: 20 МБ.', uz: "Bu bitta fotoning hajmi. Ular 100 ta, demak son katta bo'ladi: 20 MB." },
    wrong_default: { ru: 'Умножаем на 100 — два места вправо: 0,2 → 20 МБ.', uz: "100 ga ko'paytiramiz — ikki o'rin o'ngga: 0,2 → 20 MB." },
    audio_hint_1: { ru: 'Это сдвиг только на одно место. У множителя сто два нуля, нужно два места.', uz: "Bu faqat bir o'rin surish. Ko'paytuvchi yuzning ikkita noli bor, ikki o'rin kerak." },
    audio_hint_2: { ru: 'Три места, это для тысячи. У нас сто, значит два места.', uz: "Uch o'rin, bu ming uchun. Bizda yuz, demak ikki o'rin." },
    audio_hint_3: { ru: 'Это размер одной фотографии. Их сто, поэтому число должно вырасти.', uz: "Bu bitta fotoning hajmi. Ular yuzta, shuning uchun son o'sishi kerak." },
    fact: { ru: 'Учёные большие и малые числа пишут через степени десяти и сдвиг запятой. Скорость света — около 3·10⁵ км/с.', uz: "Olimlar katta va kichik sonlarni o'nning darajasi va vergul surish bilan yozadi. Yorug'lik tezligi — taxminan 3·10⁵ km/s." },
    audio: {
      intro: { ru: 'Нилуфар загружает сто фотографий, каждая по ноль целых две десятых мегабайта. Сколько мегабайт займут все сто? Здесь умножаем на сто. Выбери ответ.', uz: "Nilufar yuzta foto yuklamoqda, har biri nol butun o'ndan ikki megabayt. Hammasi yuztasi necha megabayt egallaydi? Bu yerda yuzga ko'paytiramiz. Javobni tanlang." },
      on_correct: { ru: 'Верно. Умножили на сто, запятая прошла два места вправо: ноль целых две десятых стало двадцать. А вот и факт: учёные большие и малые числа записывают через степени десяти и сдвиг запятой.', uz: "To'g'ri. Yuzga ko'paytirdik, vergul ikki o'rin o'ngga bordi: nol butun o'ndan ikki yigirma bo'ldi. Mana fakt: olimlar katta va kichik sonlarni o'nning darajalari va vergul surish bilan yozadi." },
      on_wrong: { ru: 'Пока нет. Посмотри разбор.', uz: "Hali emas. Tushuntirishga qarang." }
    }
  },

  // ── s11 — 6-8 MISOL OSON->QIYIN (SeqMix: mc / input / multi), YAKUNIY ──
  s11: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Примеры: от простого к сложному', uz: "Misollar: oddiydan murakkabga" },
    lead: { ru: 'Семь примеров. Каждый чуть сложнее.', uz: "Yetti misol. Har biri biroz qiyinroq." },
    audio: {
      intro: { ru: 'Семь примеров, от простого к сложному. Для каждого считай, на сколько мест и в какую сторону идёт запятая. Поехали.', uz: "Yetti misol, oddiydan murakkabga. Har biriga vergul necha o'rin va qaysi tomonga borishini sanang. Boshladik." },
      on_wrong: { ru: 'Не совсем. Считай нули множителя и сторону: умножаем, вправо, делим, влево.', uz: "Unchalik emas. Ko'paytuvchi nollarini va tomonni sanang: ko'paytirsak, o'ngga, bo'lsak, chapga." },
      on_done: { ru: 'Отлично. Ты прошёл от простого примера до самого трудного.', uz: "Zo'r. Oson misoldan eng qiyiniga qadar yetib bordingiz." }
    },
    items: [
      { type: 'mc', q: { ru: '3,1 × 10', uz: "3,1 × 10" }, opts: ['31', '3,10', '310'], correct: 0,
        say: { ru: 'Три целых одна десятая умножить на десять.', uz: "Uch butun o'ndan bir karra o'n." },
        ok: { ru: 'Верно. Одно место вправо: 31.', uz: "To'g'ri. Bir o'rin o'ngga: 31." },
        no: { ru: 'На 10, одно место вправо, ноль не дописывай.', uz: "10 ga, bir o'rin o'ngga, nol qo'shmang." } },
      { type: 'input', q: { ru: '8 ÷ 10 = ?', uz: "8 ÷ 10 = ?" }, answer: 0.8,
        say: { ru: 'Восемь разделить на десять. Введи ответ.', uz: "Sakkiz bo'lingan o'n. Javobni kiriting." },
        ok: { ru: 'Верно. 8 это 8,0; влево на одно место — 0,8.', uz: "To'g'ri. 8 bu 8,0; chapga bir o'rin — 0,8." },
        no: { ru: 'У 8 запятая справа: 8,0. Подвинь влево на одно место.', uz: "8 da vergul o'ngda: 8,0. Chapga bir o'rin suring." } },
      { type: 'mc', q: { ru: '0,5 × 100', uz: "0,5 × 100" }, opts: ['5', '50', '500'], correct: 1,
        say: { ru: 'Ноль целых пять десятых умножить на сто.', uz: "Nol butun o'ndan besh karra yuz." },
        ok: { ru: 'Верно. Два места вправо — запятая ушла, стало целое 50.', uz: "To'g'ri. Ikki o'rin o'ngga — vergul ketdi, butun 50 bo'ldi." },
        no: { ru: 'На 100, два места вправо. Запятая уйдёт за цифру, выйдет целое.', uz: "100 ga, ikki o'rin o'ngga. Vergul raqamdan o'tadi, butun chiqadi." } },
      { type: 'multi', q: { ru: 'Какие записи равны 25?', uz: "Qaysi yozuvlar 25 ga teng?" }, opts: ['2,5 × 10', '2,50', '250 ÷ 10', '0,25 × 100'], correctSet: [0, 2, 3],
        say: { ru: 'Отметь все записи, равные двадцати пяти. Их несколько.', uz: "Yigirma beshga teng barcha yozuvlarni belgilang. Ular bir nechta." },
        ok: { ru: 'Верно. 2,5 × 10, 250 ÷ 10 и 0,25 × 100 дают 25. А 2,50 это всего лишь 2,5.', uz: "To'g'ri. 2,5 × 10, 250 ÷ 10 va 0,25 × 100 25 ga teng. 2,50 esa atigi 2,5." },
        no: { ru: 'Посчитай каждую и помни: приписать ноль нельзя, 2,50 это 2,5.', uz: "Har birini hisoblang va yodda tuting: nol qo'shib bo'lmaydi, 2,50 bu 2,5." } },
      { type: 'input', q: { ru: '5 ÷ 100 = ?', uz: "5 ÷ 100 = ?" }, answer: 0.05,
        say: { ru: 'Пять разделить на сто. Запятая пойдёт влево на два места.', uz: "Beshni yuzga bo'lamiz. Vergul chapga ikki o'rin boradi." },
        ok: { ru: 'Верно. Слева не хватило цифр — впереди ноль целых и ноль: 0,05.', uz: "To'g'ri. Chapda raqam yetmadi — oldida nol butun va nol: 0,05." },
        no: { ru: 'Двигай запятую влево и впереди допиши нули: 0,05.', uz: "Vergulni chapga suring va oldiga nol qo'shing: 0,05." } },
      { type: 'mc', q: { ru: '3,6 ÷ 100', uz: "3,6 ÷ 100" }, opts: ['36', '0,036', '0,36'], correct: 1,
        say: { ru: 'Три целых шесть десятых разделить на сто.', uz: "Uch butun o'ndan olti bo'lingan yuz." },
        ok: { ru: 'Верно. Влево на два места, впереди нули: 0,036.', uz: "To'g'ri. Chapga ikki o'rin, oldida nollar: 0,036." },
        no: { ru: 'Деление, влево на два места; впереди допиши нули.', uz: "Bo'lish, chapga ikki o'rin; oldiga nol qo'shing." } },
      { type: 'input', q: { ru: '0,008 × 1000 = ?', uz: "0,008 × 1000 = ?" }, answer: 8,
        say: { ru: 'Ноль целых восемь тысячных умножить на тысячу. Введи ответ.', uz: "Nol butun mingdan sakkiz karra ming. Javobni kiriting." },
        ok: { ru: 'Верно. Три места вправо — запятая ушла, стало целое 8.', uz: "To'g'ri. Uch o'rin o'ngga — vergul ketdi, butun 8 bo'ldi." },
        no: { ru: 'У 1000 три нуля, три места вправо. Запятая уйдёт, выйдет 8.', uz: "1000 ning uchta noli bor, uch o'rin o'ngga. Vergul ketadi, 8 chiqadi." } }
    ]
  },

  // ── s12 — SUMMARY (kanonik Dars09-13 layout) ──
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты умножаешь и делишь на 10, 100 и 1000.', uz: "Endi siz 10, 100 va 1000 ga ko'paytirasiz va bo'lasiz." },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Умножаем — запятая идёт вправо, делим — влево.', uz: "Ko'paytiramiz — vergul o'ngga, bo'lamiz — chapga boradi." },
    main_2: { ru: 'На сколько мест: сколько нулей в множителе (10 — одно, 100 — два, 1000 — три).', uz: "Necha o'rin: ko'paytuvchida nechta nol (10 — bir, 100 — ikki, 1000 — uch)." },
    main_3: { ru: 'Не хватает цифр — ставим нули в пустые разряды (250; 0,05).', uz: "Raqam yetmasa — bo'sh xonalarga nol qo'yamiz (250; 0,05)." },
    main_4: { ru: 'Не приписывай ноль, как у целых: 2,5 × 10 это 25, а не 2,50.', uz: "Butun sonlardek nol qo'shmang: 2,5 × 10 bu 25, 2,50 emas." },
    back_to_hook: { ru: '2,5 × 10 это не 2,50, а 25 — запятая шагнула вправо.', uz: "2,5 × 10 bu 2,50 emas, 25 — vergul o'ngga qadam tashladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Десятичная дробь и разряды» — десятые, сотые, тысячные.', uz: "«O'nli kasr va xonalar» — o'ndan, yuzdan, mingdan." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'умножение десятичной дроби на десятичную дробь.', uz: "o'nli kasrni o'nli kasrga ko'paytirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты умножаешь и делишь десятичную дробь на десять, сто и тысячу. Умножаем — запятая идёт вправо, делим — влево, на столько мест, сколько нулей в множителе. Если цифр не хватило, ставим нули в пустые разряды. И помни: ноль приписывать нельзя — две целых пять десятых умножить на десять это двадцать пять, а не две целых пять десятых с нулём. Дальше научимся умножать десятичную дробь на десятичную.', uz: "Zo'r. Endi siz o'nli kasrni o'nga, yuzga va mingga ko'paytirasiz va bo'lasiz. Ko'paytiramiz — vergul o'ngga, bo'lamiz — chapga, ko'paytuvchidagi nollar soni qancha bo'lsa shuncha o'rin. Raqam yetmasa, bo'sh xonalarga nol qo'yamiz. Va yodda tuting: nol qo'shib bo'lmaydi — ikki butun o'ndan besh karra o'n bu yigirma besh, nol bilan ikki butun o'ndan besh emas. Keyin o'nli kasrni o'nli kasrga ko'paytirishni o'rganamiz." }
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

// Ikonka ✓ — feedback faqat rang bilan emas (accessibility).
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

// ============================================================
// FAKT-BLOK (ko'k karta, to'g'ri javobdan keyin)
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const FACT_BADGE_SCI = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" };
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const AnimPow = () => (<div className="fa-pow"><span className="fa-pow-b">10</span><span className="fa-pow-e">n</span></div>);
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
// VIZUALIZATOR — VergulSakraydi (raqam yo'lakchasi; vergul sakraydi, bo'sh katakka nol)
// cells: [{ d:'2', state:'on'|'off'|'new' }], comma: chegara indeksi (1..cells.length).
// vergul left = comma * (katak eni + 4px); transition bilan siljiydi. comma===length => butun (yashirin).
// ============================================================
const CommaHop = ({ cells, comma, cw = 'clamp(28px, 6.5vw, 40px)' }) => {
  const n = cells.length;
  const showComma = comma > 0 && comma < n;
  return (
    <div className="vh-wrap" aria-hidden="true">
      <span className="vh-cells" style={{ '--vcw': cw, '--cp': comma }}>
        {cells.map((cell, i) => (
          <span key={i} className={`vh-cell${cell.state === 'off' ? ' vh-off' : ''}${cell.state === 'new' ? ' vh-new' : ''}`}>{cell.state === 'off' ? '' : cell.d}</span>
        ))}
        <span className={`vh-comma${showComma ? '' : ' vh-comma-off'}`}>,</span>
      </span>
    </div>
  );
};
// Tayyor satr "a × b = c" / "a ÷ b = c" — mono, bo'yalgan natija (rule/case uchun).
const EqLine = ({ a, op, b, c }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 10px)', justifyContent: 'center', flexWrap: 'wrap', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 'clamp(18px, 3.4vw, 24px)' }}>
    <span style={{ color: T.ink }}>{a}</span><Op>{op}</Op><span style={{ color: T.ink }}>{b}</span><Op>=</Op><span style={{ color: T.success }}>{c}</span>
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
// input — o'nli son (vergul yoki nuqta qabul qilinadi).
// ============================================================
const parseDec = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/[^\d.-]/g, '')); return isNaN(v) ? null : v; };
const fmtDec = (n) => String(n).replace('.', ',');

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
    if (isCorrect) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setWrong(prev => { const s = new Set(prev); s.add(i); return s; }); voiceWrong(it.no); }
  };
  const submitInput = () => {
    if (done || solvedItem) return;
    const v = parseDec(val);
    if (v === null) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = Math.abs(v - it.answer) < 1e-9;
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
                  <input type="text" inputMode="decimal" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={solvedItem ? fmtDec(it.answer) : val} placeholder="0,0" disabled={solvedItem}
                    onChange={e => { setVal(e.target.value); setShowHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(100px, 22vw, 130px)' }}/>
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
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.2vw, 19px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}
            {it.type === 'multi' && (
              <>
                <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  {it.opts.map((o, i) => {
                    const on = sel.has(i);
                    return (
                      <button key={i} className={`option${on ? ' option-correct' : ''}`} disabled={solvedItem} onClick={() => toggleMulti(i)}
                        style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
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
  const dropTo = (slot) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const m = [...p]; m[slot] = sel; return m; }); setSel(null); };
  const returnChip = (slot) => { if (solved) return; setChecked(false); setPlace(p => { const m = [...p]; m[slot] = null; return m; }); };
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
  const dropTo = (bin) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const m = [...p]; m[sel] = bin; return m; }); setSel(null); };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const m = [...p]; m[i] = null; return m; }); };
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
// s0 — HOOK: konseptual, harakatli VergulSakraydi (2,5 ↔ 25 loop) + reveal-MC
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const [picked, setPicked] = useState(null);
  const [phase, setPhase] = useState(0);   // 0: 2,5  1: 25 (vergul o'ngga sakradi)
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p === 0 ? 1 : 0)), 1700);
    return () => clearInterval(id);
  }, []);
  const cells = [{ d: '2', state: 'on' }, { d: '5', state: 'on' }];
  const comma = phase === 0 ? 1 : 2;
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
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <CommaHop cells={cells} comma={comma}/>
          <p className="mono small" style={{ margin: 0, color: phase === 1 ? T.success : T.ink2, fontWeight: 600 }}>{phase === 0 ? '2,5  × 10 …' : (lang === 'uz' ? "→ vergul o'ngga: 25" : '→ запятая вправо: 25')}</p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: T.ink3, textDecoration: 'line-through' }}>2,50 ✗</span>
            <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: T.success, fontWeight: 700 }}>25 ✓</span>
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

// s1 — WARM-UP SeqMC (razryadlar)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;

// s2 — EXPLORATION ×10 (VergulSakraydi)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const cells = [{ d: '2', state: 'on' }, { d: '5', state: 'on' }];
  const comma = step >= 1 ? 2 : 1;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: step >= 1 ? T.success : T.ink2, fontWeight: 600 }}>{step >= 1 ? '2,5 × 10 = 25' : '2,5 × 10'}</span>
          <CommaHop cells={cells} comma={comma}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION ×100 (ikki sakrash + nol)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const cells = [{ d: '2', state: 'on' }, { d: '5', state: 'on' }, { d: '0', state: step >= 1 ? 'new' : 'off' }];
  const comma = step >= 1 ? 3 : 1;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: step >= 1 ? T.success : T.ink2, fontWeight: 600 }}>{step >= 1 ? '2,5 × 100 = 250' : '2,5 × 100'}</span>
          <CommaHop cells={cells} comma={comma}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION ÷100 (chapga, oldida nollar)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s4_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  // 5 ÷ 100 = 0,05  →  cells ['0','0','5']; boshda faqat '5' (butun, comma=3), keyin chapga 2 o'rin (comma=1), oldida ikki nol
  const cells = [{ d: '0', state: step >= 1 ? 'new' : 'off' }, { d: '0', state: step >= 1 ? 'new' : 'off' }, { d: '5', state: 'on' }];
  const comma = step >= 1 ? 1 : 3;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: step >= 1 ? T.success : T.ink2, fontWeight: 600 }}>{step >= 1 ? '5 ÷ 100 = 0,05' : '5 ÷ 100'}</span>
          <CommaHop cells={cells} comma={comma}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE (birlashgan)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <EqLine a="2,5" op="×" b="10" c="25"/>
            <EqLine a="5" op="÷" b="100" c="0,05"/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.label)}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span style={{ color: T.success, fontWeight: 700, marginTop: 1 }}>→</span><p className="body" style={{ margin: 0 }}>{mt(t(c.rule_mul))}</p></div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span style={{ color: T.blue, fontWeight: 700, marginTop: 1 }}>←</span><p className="body" style={{ margin: 0 }}>{mt(t(c.rule_div))}</p></div>
          </div>
          <div className="frame-tip" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p className="small mono" style={{ margin: 0, fontWeight: 700, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.warn_label)}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.warn))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s6 — 5 OSON SAVOL (SeqMC)
const Screen6 = (props) => <SeqMC {...props} screenContent={CONTENT.s6} scored={true}/>;

// s7 — DRAG-CLASSIFY (×/÷ savatlari)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const items = [c.it0, c.it1, c.it2, c.it3].map((node, i) => ({ id: i, node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(14px, 2.1vw, 17px)' }}>{t(node)}</span> }));
  const bins = [{ id: 'big', label: c.bin_big }, { id: 'small', label: c.bin_small }];
  const correct = ['big', 'small', 'big', 'small'];   // 2,5×10 / 6÷10 / 0,3×100 / 40÷1000
  return <DragToBins {...props} idx={7} c={c} items={items} bins={bins} correct={correct} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>} badge={FACT_BADGE}/>}/>;
};

// s8 — VERGULNI QO'YISH (custom): 475 ÷ 100 = 4,75
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const digits = c.digits.split('');                  // ['4','7','5']
  const correctGap = 1;                               // 4 | 7 5  →  4,75
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [pickedGap, setPickedGap] = useState(wasSolved ? correctGap : null);
  const [solved, setSolved] = useState(wasSolved);
  const [wrong, setWrong] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const pickGap = (g) => {
    if (solved) return;
    const ok = g === correctGap;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    setPickedGap(g);
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); }
    if (ok) {
      setSolved(true); setWrong(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: '4,75', studentAnswer: '4,75', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setWrong(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 26px)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <button className={`cp-gap${pickedGap === i ? (i === correctGap ? ' cp-gap-ok' : ' cp-gap-no') : ''}`} disabled={solved} onClick={() => pickGap(i)} aria-label="comma slot">
                    <span className="cp-comma">{pickedGap === i ? ',' : ''}</span>
                  </button>
                )}
                <span className="cp-digit">{d}</span>
              </React.Fragment>
            ))}
          </span>
        </div>
        <FeedbackBlock show={pickedGap !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>{mt(t(solved ? c.correct_text : c.hint_wrong))}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s9 — DRAG-FILL: 0,04 × [1000] = 40
const Screen9 = (props) => {
  const c = CONTENT.s9;
  const chips = ['10', '100', '1000'].map(v => ({ id: v, node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(15px, 2.4vw, 19px)' }}>{v}</span> }));
  const correct = ['1000'];
  const renderBoard = (slotEl) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(6px, 1.8vw, 12px)', flexWrap: 'wrap', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 'clamp(18px, 3.4vw, 24px)' }}>
      <span style={{ color: T.ink }}>0,04</span><Op>×</Op>{slotEl(0)}<Op>=</Op><span style={{ color: T.success }}>40</span>
    </span>
  );
  return <DragToSlots {...props} idx={9} c={c} chips={chips} correct={correct} slotSize="lg" renderBoard={renderBoard} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>} badge={FACT_BADGE}/>}/>;
};

// s10 — CASE final MC (Nilufar): 100 × 0,2 = 20 MB (keep-visible)
const Screen10 = (props) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const base = [c.opt0[lang], c.opt1[lang], c.opt2[lang], c.opt3[lang]];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const lead = (
    <>
      <p className="body fade-up" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 20px)', marginTop: 12 }}>
        <span className="mono" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: T.ink }}>{mt(t(c.question_text))}</span>
      </div>
    </>
  );
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} titleNode={c.label} question={lead} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimPow/>} badge={FACT_BADGE_SCI}/>}/>;
};

// s11 — 6-8 MISOL OSON->QIYIN (SeqMix), YAKUNIY
const Screen11 = (props) => <SeqMix {...props} screenContent={CONTENT.s11} scored={true}/>;

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
export default function DecimalShiftLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12];
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
// CSS — bazaviy (Dars28) + dars27 maxsus (vergul-yo'lakcha/hook/fakt-anim/dnd/vergul-qo'yish)
// ============================================================
const STYLES = `/*__BASE__*/

/* === Dars27 (dec_5_04) maxsus CSS === */
/* HOOK jonli animatsiya */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }

/* === VergulSakraydi — raqam yo'lakchasi === */
.vh-wrap { display: flex; justify-content: center; width: 100%; padding: 6px 0; }
.vh-cells { position: relative; display: inline-flex; }
.vh-cell { width: var(--vcw); height: calc(var(--vcw) * 1.34); margin: 0 2px; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(22px, 5vw, 32px); color: #0E0E10; border-radius: 8px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.35); transition: background 0.3s, box-shadow 0.3s, color 0.3s; }
.vh-off { background: rgba(167, 166, 162, 0.08); box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.16); color: transparent; }
.vh-new { animation: vhPop 0.55s cubic-bezier(0.34, 1.5, 0.6, 1) backwards; color: #019ACB; box-shadow: inset 0 0 0 2px #019ACB; }
@keyframes vhPop { from { transform: translateY(-12px) scale(0.4); opacity: 0; } }
.vh-comma { position: absolute; bottom: calc(var(--vcw) * 0.12); left: calc(var(--cp) * (var(--vcw) + 4px)); transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #FF4F28; line-height: 1; pointer-events: none; transition: left 0.6s cubic-bezier(0.34, 1.1, 0.64, 1), opacity 0.45s; }
.vh-comma-off { opacity: 0; }

/* === vergulni qo'yish (s8) === */
.cp-digit { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(30px, 7vw, 46px); color: #0E0E10; padding: 0 2px; }
.cp-gap { width: clamp(16px, 4vw, 24px); height: clamp(40px, 9vw, 58px); border: none; background: transparent; cursor: pointer; position: relative; vertical-align: middle; border-radius: 8px; transition: background 0.2s; }
.cp-gap:not(:disabled):hover { background: rgba(1, 154, 203, 0.12); }
.cp-gap::after { content: ''; position: absolute; left: 50%; bottom: 8px; width: 2px; height: 40%; transform: translateX(-50%); background: rgba(167, 166, 162, 0.45); border-radius: 2px; transition: background 0.2s; }
.cp-gap:not(:disabled):hover::after { background: #019ACB; }
.cp-gap-ok::after { background: transparent; }
.cp-gap-no::after { background: transparent; }
.cp-comma { position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px, 6.5vw, 42px); line-height: 1; }
.cp-gap-ok .cp-comma { color: #1F7A4D; }
.cp-gap-no .cp-comma { color: #FF4F28; }

/* === fakt-anim === */
.fa-prog { position: relative; width: 66px; height: 16px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.2s ease-in-out infinite; }
@keyframes faProg { 0% { width: 6%; } 60% { width: 80%; } 100% { width: 6%; } }
.fa-pow { display: inline-flex; align-items: flex-start; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #019ACB; }
.fa-pow-b { font-size: clamp(26px, 5vw, 34px); }
.fa-pow-e { font-size: clamp(14px, 2.6vw, 18px); animation: faPowE 1.8s ease-in-out infinite; }
@keyframes faPowE { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-3px); opacity: 1; } }

/* === ambient fon (har bir ekranda) === */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; border-radius: inherit; }
.amb-o { position: absolute; border-radius: 50%; filter: blur(2px); opacity: 0.5; }
.amb-o1 { width: 120px; height: 120px; left: -28px; top: 8%; background: radial-gradient(circle at 30% 30%, rgba(255,79,40,0.16), rgba(255,79,40,0)); animation: ambFloat 13s ease-in-out infinite; }
.amb-o2 { width: 90px; height: 90px; right: -20px; top: 38%; background: radial-gradient(circle at 30% 30%, rgba(1,154,203,0.16), rgba(1,154,203,0)); animation: ambFloat 17s ease-in-out infinite reverse; }
.amb-o3 { width: 70px; height: 70px; left: 22%; bottom: -18px; background: radial-gradient(circle at 30% 30%, rgba(31,122,77,0.13), rgba(31,122,77,0)); animation: ambFloat 15s ease-in-out infinite; }
@keyframes ambFloat { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(14px, -16px); } 66% { transform: translate(-10px, 12px); } }

/* === DRAG-AND-DROP (Dars37 dnd uslubi) === */
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

/* === reduced-motion === */
@media (prefers-reduced-motion: reduce) {
  .hook-sheen, .hook-glow, .vh-new, .fa-prog-fill, .fa-pow-e, .amb-o { animation: none !important; }
  .vh-comma { transition: none !important; }
}
`;
