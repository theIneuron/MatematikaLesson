# Dars43 — CONTENT (Б6 NEPTUN · «Yakuniy nazorat ИК: Yer'ga qo'nish» · program d.46)

> **Yakuniy nazorat (ИК)** — BUTUN 2-sinf kursi (Б1–Б6) yakuniy tekshiruvi. Klon-baza **Dars42** (MixStage + minilar).
> Slot-mavzular Dars41/42 bilan bir xil (s0 tenglama-hook · s1 ulush parts=4 · s2 vaqt h=3 · s3 pul · s4 ma'lumot) — caption'lar mos.
> s5–s14 butun kurs aralash: qo'shish/ayirish (Б1–2), ko'paytirish/bo'lish `word`-masala (Б3–4), geometriya/o'lchov (Б5), Б6 mavzular. **Kosmik missiya YAKUNI — Yerga qo'nish.**
> Yangi konsept YO'Q. **regext.mjs + kirill skan majburiy.**

---

```javascript
const CONTENT = {
  // s0 — HOOK (tenglama): x−2=6, kimdir x=4 dedi (ayirdi). To'g'rimi? Yo'q (8).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Итог года', uz: "Mavzu: Yil yakuni" },
    lead: { ru: 'Верно ли решили?', uz: "To'g'ri yechildimi?" },
    q: { ru: 'Уравнение: x минус два равно шесть. Кто-то сказал: x равен четырём. Это верно?', uz: "Tenglama: x ayirish ikki teng olti. Kimdir «x to'rtga teng» dedi. Bu to'g'rimi?" },
    eqhook: { op: '−', n: 2, res: 6 },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы у Нептуна, впереди дорога домой. Сегодня итоговая проверка за весь год.',
          'Вот уравнение: x минус два равно шесть.',
          'Кто-то вычел и сказал, что x равен четырём. Но при вычитании x надо прибавлять.',
          'Как думаешь, верно ли решили? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidamiz, oldinda uyga yo'l. Bugun butun yil uchun yakuniy tekshiruv.",
          "Mana tenglama: x ayirish ikki teng olti.",
          "Kimdir ayirib, x to'rtga teng dedi. Ammo ayirishda x ni qo'shish kerak.",
          "Sizningcha, to'g'ri yechildimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. При вычитании прибавь: шесть плюс два — восемь.', uz: "To'g'ri. Ayirishda qo'shing: olti qo'shuv ikki — sakkiz." },
      on_wrong: { ru: 'При вычитании x прибавляем: шесть плюс два — восемь. Сейчас проверим.', uz: "Ayirishda x ni qo'shamiz: olti qo'shuv ikki — sakkiz. Hozir tekshiramiz." },
      on_unknown: { ru: 'Ничего. Сегодня проверим весь год.', uz: "Hechqisi yo'q. Bugun butun yilni tekshiramiz." }
    }
  },

  // s1 — RECAP: ulush (pie 4). caption «bir to'rtdan». 3 seg.
  s1: {
    eyebrow: { ru: 'Доли', uz: 'Ulush' },
    lead: { ru: 'Вспомним доли', uz: "Ulushni eslaymiz" },
    recap: { kind: 'ulush', parts: 4 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Доля — одна из равных частей. Четыре равные части, одна закрашена — одна четвёртая.', uz: "Ulush — teng qismlardan biri. To'rtta teng qism, biri bo'yalgan — bir to'rtdan." },
    audio: {
      ru: ['Вспомним доли.', 'Целое поделили на четыре равные части.', 'Одна закрашенная часть — это одна четвёртая.'],
      uz: ["Ulushni eslaymiz.", "Butun to'rtta teng qismga bo'lingan.", "Bir bo'yalgan qism — bu bir to'rtdan."]
    }
  },

  // s2 — RECAP: vaqt (clock 3:00). caption «soat uch». 3 seg.
  s2: {
    eyebrow: { ru: 'Время', uz: 'Vaqt' },
    lead: { ru: 'Вспомним время', uz: "Vaqtni eslaymiz" },
    recap: { kind: 'time', h: 3 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Короткая стрелка — часы, длинная — минуты. Здесь три часа.', uz: "Kalta strelka — soat, uzun — daqiqa. Bu yerda soat uch." },
    audio: {
      ru: ['Вспомним время.', 'Короткая стрелка показывает часы, длинная — минуты.', 'Сейчас три часа ровно.'],
      uz: ["Vaqtni eslaymiz.", "Kalta strelka soatni, uzun daqiqani ko'rsatadi.", "Hozir roppa-rosa soat uch."]
    }
  },

  // s3 — RECAP+check: pul (200+200+100=500).
  s3: {
    eyebrow: { ru: 'Деньги', uz: 'Pul' },
    lead: { ru: 'Вспомним деньги', uz: "Pulni eslaymiz" },
    recap: { kind: 'money', coins: [200, 200, 100] },
    check_q: { ru: 'Двести, двести и сто сумов. Сколько всего?', uz: "Ikki yuz, ikki yuz va yuz so'm. Jami qancha?" },
    opts: [{ ru: '500 сум', uz: "500 so'm", ok: true }, { ru: '410 сум', uz: "410 so'm" }, { ru: '3 сум', uz: "3 so'm" }],
    wrong: { ru: 'Считай по сотням: двести, двести, сто — пятьсот.', uz: "Yuzliklab sanang: ikki yuz, ikki yuz, yuz — besh yuz." },
    check_ok: { ru: 'Верно! Пятьсот сумов.', uz: "To'g'ri! Besh yuz so'm." },
    audio: {
      ru: ['Вспомним деньги.', 'Деньги считают по стоимости монет.', 'Проверь. Двести, двести и сто сумов. Сколько всего?'],
      uz: ["Pulni eslaymiz.", "Pul tangalarning qiymati bo'yicha sanaladi.", "Tekshiring. Ikki yuz, ikki yuz va yuz so'm. Jami qancha?"]
    }
  },

  // s4 — RECAP+check: ma'lumot (piktogramma sanash). caption «bitta rasm — bitta birlik».
  s4: {
    eyebrow: { ru: 'Данные', uz: "Ma'lumotlar" },
    lead: { ru: 'Вспомним данные', uz: "Ma'lumotni eslaymiz" },
    recap: { kind: 'data', data: [{ label: { ru: 'Звёзды', uz: 'Yulduzlar' }, n: 7, k: 'star', c: 'or' }] },
    check_q: { ru: 'Сколько звёзд на пиктограмме?', uz: "Piktogrammada nechta yulduz bor?" },
    opts: [{ ru: '7', uz: '7', ok: true }, { ru: '6', uz: '6' }, { ru: '8', uz: '8' }],
    wrong: { ru: 'Одна картинка — одна единица. Посчитай: их семь.', uz: "Bitta rasm — bitta birlik. Sanang: ular yettita." },
    check_ok: { ru: 'Верно! Звёзд семь.', uz: "To'g'ri! Yulduz yettita." },
    audio: {
      ru: ['Вспомним данные.', 'В пиктограмме одна картинка — одна единица.', 'Проверь. Сколько звёзд?'],
      uz: ["Ma'lumotni eslaymiz.", "Piktogrammada bitta rasm — bitta birlik.", "Tekshiring. Nechta yulduz bor?"]
    }
  },

  // sTBL — KALIT: butun yil. 3 seg.
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Итог года', uz: "Yil yakuni" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'За год мы прошли сложение и вычитание, умножение и деление, геометрию и все темы шестой планеты.', uz: "Yil davomida qo'shish va ayirish, ko'paytirish va bo'lish, geometriya va oltinchi sayyoraning barcha mavzularini o'tdik." },
    audio: {
      ru: ['Соберём ключ. Сегодня итог всего года.', 'Сложение и вычитание, умножение и деление.', 'Геометрия, время, деньги и данные. Проверим всё.'],
      uz: ["Kalitni yig'amiz. Bugun butun yil yakuni.", "Qo'shish va ayirish, ko'paytirish va bo'lish.", "Geometriya, vaqt, pul va ma'lumot. Hammasini tekshiramiz."]
    }
  },

  // s5 — tenglama (Б6).
  s5: {
    eyebrow: { ru: 'Итог · 1', uz: 'Yakun · 1' }, label: { ru: 'Реши', uz: "Yeching" },
    rounds: [
      { kind: 'eq', op: '+', n: 3, res: 10, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '7', uz: '7', ok: true }, { ru: '13', uz: '13', wrong: { ru: 'Не складывай: десять минус три — семь.', uz: "Qo'shmang: o'n ayirish uch — yetti." } }, { ru: '10', uz: '10', wrong: { ru: 'Убери три: десять минус три — семь.', uz: "Uchni oling: o'n ayirish uch — yetti." } }],
        correct_text: { ru: 'Верно. Семь.', uz: "To'g'ri. Yetti." } },
      { kind: 'eq', op: '−', n: 4, res: 3, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '7', uz: '7', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'При вычитании прибавь: три плюс четыре — семь.', uz: "Ayirishda qo'shing: uch qo'shuv to'rt — yetti." } }, { ru: '3', uz: '3', wrong: { ru: 'Три плюс четыре — семь.', uz: "Uch qo'shuv to'rt — yetti." } }],
        correct_text: { ru: 'Верно. Семь.', uz: "To'g'ri. Yetti." } }
    ],
    audio: { intro: { ru: 'Найди спрятанное число x.', uz: "Yashirin son x ni toping." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s6 — ko'paytirish (Б3), word.
  s6: {
    eyebrow: { ru: 'Итог · 2', uz: 'Yakun · 2' }, label: { ru: 'Умножение', uz: "Ko'paytirish" },
    rounds: [
      { kind: 'word', q: { ru: 'Три ряда по четыре кристалла. Сколько всего?', uz: "Uch qatorda to'rttadan kristall. Jami nechta?" },
        opts: [{ ru: '12', uz: '12', ok: true }, { ru: '7', uz: '7', wrong: { ru: 'Это не сложение. Три по четыре — двенадцать.', uz: "Bu qo'shish emas. To'rttadan uchta — o'n ikki." } }, { ru: '9', uz: '9', wrong: { ru: 'Три раза по четыре — двенадцать.', uz: "To'rttadan uch marta — o'n ikki." } }],
        correct_text: { ru: 'Верно. Три по четыре — двенадцать.', uz: "To'g'ri. To'rttadan uchta — o'n ikki." } },
      { kind: 'word', q: { ru: 'Два ряда по пять роботов. Сколько всего?', uz: "Ikki qatorda beshtadan robot. Jami nechta?" },
        opts: [{ ru: '10', uz: '10', ok: true }, { ru: '7', uz: '7', wrong: { ru: 'Это не сложение. Два по пять — десять.', uz: "Bu qo'shish emas. Beshtadan ikkita — o'n." } }, { ru: '25', uz: '25', wrong: { ru: 'Два раза по пять — десять.', uz: "Beshtadan ikki marta — o'n." } }],
        correct_text: { ru: 'Верно. Два по пять — десять.', uz: "To'g'ri. Beshtadan ikkita — o'n." } }
    ],
    audio: { intro: { ru: 'Равные ряды — это умножение.', uz: "Teng qatorlar — bu ko'paytirish." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s7 — vaqt (Б6).
  s7: {
    eyebrow: { ru: 'Итог · 3', uz: 'Yakun · 3' }, label: { ru: 'Сколько времени?', uz: "Soat nechada?" },
    rounds: [
      { kind: 'time', h: 8, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '8:00', uz: '8:00', ok: true }, { ru: '12:40', uz: '12:40', wrong: { ru: 'Короткая на восьми — восемь часов.', uz: "Kalta sakkizda — soat sakkiz." } }, { ru: '8:12', uz: '8:12', wrong: { ru: 'Длинная на двенадцати — ноль минут.', uz: "Uzun o'n ikkida — nol daqiqa." } }],
        correct_text: { ru: 'Верно. Восемь часов.', uz: "To'g'ri. Soat sakkiz." } },
      { kind: 'time', h: 10, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '10:00', uz: '10:00', ok: true }, { ru: '12:50', uz: '12:50', wrong: { ru: 'Короткая на десяти — десять часов.', uz: "Kalta o'nda — soat o'n." } }, { ru: '10:12', uz: '10:12', wrong: { ru: 'Длинная на двенадцати — ноль минут.', uz: "Uzun o'n ikkida — nol daqiqa." } }],
        correct_text: { ru: 'Верно. Десять часов.', uz: "To'g'ri. Soat o'n." } }
    ],
    audio: { intro: { ru: 'Прочитай время по часам.', uz: "Soatga qarab vaqtni o'qing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s8 — bo'lish (Б4), word.
  s8: {
    eyebrow: { ru: 'Итог · 4', uz: 'Yakun · 4' }, label: { ru: 'Деление', uz: "Bo'lish" },
    rounds: [
      { kind: 'word', q: { ru: 'Двенадцать кристаллов раздали поровну трём. Сколько каждому?', uz: "O'n ikki kristallni uch kishiga teng ulashdik. Har biriga nechtadan?" },
        opts: [{ ru: '4', uz: '4', ok: true }, { ru: '9', uz: '9', wrong: { ru: 'Раздать поровну — это деление: двенадцать на три — четыре.', uz: "Teng ulashish — bu bo'lish: o'n ikki bo'linadi uch — to'rt." } }, { ru: '15', uz: '15', wrong: { ru: 'Двенадцать на три — четыре.', uz: "O'n ikki bo'linadi uch — to'rt." } }],
        correct_text: { ru: 'Верно. Двенадцать на три — четыре.', uz: "To'g'ri. O'n ikki bo'linadi uch — to'rt." } },
      { kind: 'word', q: { ru: 'Десять деталей разложили по два в ряд. Сколько рядов?', uz: "O'n detalni ikkitadan qatorga terdik. Nechta qator?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '8', uz: '8', wrong: { ru: 'Это деление: десять на два — пять.', uz: "Bu bo'lish: o'n bo'linadi ikki — besh." } }, { ru: '12', uz: '12', wrong: { ru: 'Десять на два — пять.', uz: "O'n bo'linadi ikki — besh." } }],
        correct_text: { ru: 'Верно. Десять на два — пять.', uz: "To'g'ri. O'n bo'linadi ikki — besh." } }
    ],
    audio: { intro: { ru: 'Раздать поровну — это деление.', uz: "Teng ulashish — bu bo'lish." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s9 — pul (Б6).
  s9: {
    eyebrow: { ru: 'Итог · 5', uz: 'Yakun · 5' }, label: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    rounds: [
      { kind: 'money', coins: [1000, 500, 500], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '2000 сум', uz: "2000 so'm", ok: true }, { ru: '3 сум', uz: "3 so'm", wrong: { ru: 'Три — число монет. Считай стоимость: две тысячи.', uz: "Uch — tanga soni. Qiymatni sanang: ikki ming." } }, { ru: '1550 сум', uz: "1550 so'm", wrong: { ru: 'Тысяча, пятьсот, пятьсот — две тысячи.', uz: "Ming, besh yuz, besh yuz — ikki ming." } }],
        correct_text: { ru: 'Верно. Две тысячи сумов.', uz: "To'g'ri. Ikki ming so'm." } },
      { kind: 'money', coins: [500, 200, 100], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '800 сум', uz: "800 so'm", ok: true }, { ru: '3 сум', uz: "3 so'm", wrong: { ru: 'Считай стоимость: восемьсот.', uz: "Qiymatni sanang: sakkiz yuz." } }, { ru: '710 сум', uz: "710 so'm", wrong: { ru: 'Пятьсот, двести, сто — восемьсот.', uz: "Besh yuz, ikki yuz, yuz — sakkiz yuz." } }],
        correct_text: { ru: 'Верно. Восемьсот сумов.', uz: "To'g'ri. Sakkiz yuz so'm." } }
    ],
    audio: { intro: { ru: 'Сложи стоимость монет.', uz: "Tangalar qiymatini qo'shing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s10 — masala qo'shish/ayirish (Б1-2), word.
  s10: {
    eyebrow: { ru: 'Итог · 6', uz: 'Yakun · 6' }, label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'word', q: { ru: 'Было четырнадцать деталей, шесть использовали. Сколько осталось?', uz: "O'n to'rt detal bor edi, oltitasi ishlatildi. Nechta qoldi?" },
        opts: [{ ru: '8', uz: '8', ok: true }, { ru: '20', uz: '20', wrong: { ru: 'Использовали — вычитаем: четырнадцать минус шесть — восемь.', uz: "Ishlatildi — ayiramiz: o'n to'rt ayirish olti — sakkiz." } }, { ru: '6', uz: '6', wrong: { ru: 'Шесть использовали. Осталось восемь.', uz: "Olti ishlatildi. Qolgani sakkiz." } }],
        correct_text: { ru: 'Верно. Четырнадцать минус шесть — восемь.', uz: "To'g'ri. O'n to'rt ayirish olti — sakkiz." } },
      { kind: 'word', q: { ru: 'В ангаре семь кораблей, прилетело ещё восемь. Сколько стало?', uz: "Angarda yetti kema, yana sakkizta uchib keldi. Nechta bo'ldi?" },
        opts: [{ ru: '15', uz: '15', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'Прилетело ещё — складываем: семь плюс восемь — пятнадцать.', uz: "Yana keldi — qo'shamiz: yetti qo'shuv sakkiz — o'n besh." } }, { ru: '13', uz: '13', wrong: { ru: 'Семь плюс восемь — пятнадцать.', uz: "Yetti qo'shuv sakkiz — o'n besh." } }],
        correct_text: { ru: 'Верно. Семь плюс восемь — пятнадцать.', uz: "To'g'ri. Yetti qo'shuv sakkiz — o'n besh." } }
    ],
    audio: { intro: { ru: 'Выбери действие: больше — сложи, меньше — вычти.', uz: "Amalni tanlang: ko'paysa — qo'shing, kamaysa — ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s11 — ulush + geometriya (Б5), word.
  s11: {
    eyebrow: { ru: 'Итог · 7', uz: 'Yakun · 7' }, label: { ru: 'Подумай', uz: "O'ylab ko'ring" },
    rounds: [
      { kind: 'ulush', parts: 3, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', ok: true }, { ru: 'три', uz: 'uch', wrong: { ru: 'Три — число частей. Одна из трёх — одна третья.', uz: "Uch — qismlar soni. Uchtadan biri — bir uchdan." } }, { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Частей три, значит одна третья.', uz: "Qism uchta, demak bir uchdan." } }],
        correct_text: { ru: 'Верно. Одна третья.', uz: "To'g'ri. Bir uchdan." } },
      { kind: 'word', q: { ru: 'У квадрата все стороны по три см. Чему равен периметр?', uz: "Kvadratning barcha tomoni uch sm. Perimetri nechaga teng?" },
        opts: [{ ru: '12', uz: '12', ok: true }, { ru: '7', uz: '7', wrong: { ru: 'У квадрата четыре стороны: три и три и три и три — двенадцать.', uz: "Kvadratда to'rt tomon: uch va uch va uch va uch — o'n ikki." } }, { ru: '6', uz: '6', wrong: { ru: 'Сложи все четыре стороны: двенадцать.', uz: "To'rt tomonni qo'shing: o'n ikki." } }],
        correct_text: { ru: 'Верно. Четыре стороны по три — двенадцать.', uz: "To'g'ri. Uchdan to'rt tomon — o'n ikki." } }
    ],
    audio: { intro: { ru: 'Вспомни доли и периметр.', uz: "Ulush va perimetrni eslang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  s12: { eyebrow: { ru: 'Задача', uz: 'Masala' }, lead: { ru: 'Итог Бита.', uz: "Bit yakuni." }, audio: { ru: 'Бит проходит итоговую проверку.', uz: "Bit yakuniy tekshiruvdan o'tadi." } },

  // s13 — MASALA: word (ko'paytirish yakuni).
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' }, label: { ru: 'Итог Бита', uz: "Bit yakuni" },
    story: { ru: 'Бит собрал четыре ряда по пять кристаллов. Сколько всего кристаллов?', uz: "Bit beshtadan to'rt qator kristall yig'di. Jami nechta kristall?" },
    kind: 'word', q: { ru: 'Сколько всего кристаллов?', uz: "Jami nechta kristall?" },
    opts: [{ ru: '20', uz: '20', ok: true }, { ru: '9', uz: '9', wrong: { ru: 'Это не сложение. Четыре по пять — двадцать.', uz: "Bu qo'shish emas. Beshtadan to'rtta — yigirma." } }, { ru: '25', uz: '25', wrong: { ru: 'Четыре раза по пять — двадцать.', uz: "Beshtadan to'rt marta — yigirma." } }],
    correct_text: { ru: 'Верно. Четыре по пять — двадцать.', uz: "To'g'ri. Beshtadan to'rtta — yigirma." },
    audio: { intro: { ru: 'Бит собрал четыре ряда по пять кристаллов. Сколько всего?', uz: "Bit beshtadan to'rt qator kristall yig'di. Jami nechta?" }, on_correct: { ru: 'Верно. Двадцать.', uz: "To'g'ri. Yigirma." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s14 — FINAL + FactCard (Yerga qo'nish).
  s14: {
    eyebrow: { ru: 'Итог года', uz: 'Yil yakuni' }, label: { ru: 'Последняя проверка', uz: "Oxirgi tekshiruv" },
    rounds: [
      { kind: 'eq', op: '+', n: 6, res: 15, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '9', uz: '9', ok: true }, { ru: '21', uz: '21', wrong: { ru: 'Убери шесть: пятнадцать минус шесть — девять.', uz: "Oltini oling: o'n besh ayirish olti — to'qqiz." } }, { ru: '15', uz: '15', wrong: { ru: 'Пятнадцать минус шесть — девять.', uz: "O'n besh ayirish olti — to'qqiz." } }],
        correct_text: { ru: 'Верно. Девять.', uz: "To'g'ri. To'qqiz." } },
      { kind: 'word', q: { ru: 'Восемнадцать деталей раздали поровну шести. Сколько каждому?', uz: "O'n sakkiz detalni olti kishiga teng ulashdik. Har biriga nechtadan?" },
        opts: [{ ru: '3', uz: '3', ok: true }, { ru: '12', uz: '12', wrong: { ru: 'Раздать поровну — деление: восемнадцать на шесть — три.', uz: "Teng ulashish — bo'lish: o'n sakkiz bo'linadi olti — uch." } }, { ru: '24', uz: '24', wrong: { ru: 'Восемнадцать на шесть — три.', uz: "O'n sakkiz bo'linadi olti — uch." } }],
        correct_text: { ru: 'Верно. Восемнадцать на шесть — три.', uz: "To'g'ri. O'n sakkiz bo'linadi olti — uch." } },
      { kind: 'money', coins: [1000, 1000], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '2000 сум', uz: "2000 so'm", ok: true }, { ru: '2 сум', uz: "2 so'm", wrong: { ru: 'Считай стоимость: тысяча и тысяча — две тысячи.', uz: "Qiymatni sanang: ming va ming — ikki ming." } }, { ru: '1100 сум', uz: "1100 so'm", wrong: { ru: 'Тысяча плюс тысяча — две тысячи.', uz: "Ming qo'shuv ming — ikki ming." } }],
        correct_text: { ru: 'Верно. Две тысячи сумов.', uz: "To'g'ri. Ikki ming so'm." } }
    ],
    fact_badge: { ru: 'Земля', uz: 'Yer' },
    fact_text: { ru: 'Весь путь пройден! Корабль сел на Землю. Ты прошёл весь второй класс.', uz: "Butun yo'l bosib o'tildi! Kema Yerga qo'ndi. Siz butun ikkinchi sinfni o'tdingiz." },
    fact_audio: { ru: 'Весь путь пройден. Корабль сел на Землю. Ты прошёл весь второй класс. Молодец!', uz: "Butun yo'l bosib o'tildi. Kema Yerga qo'ndi. Siz butun ikkinchi sinfni o'tdingiz. Barakalla!" },
    audio: { intro: { ru: 'Последняя проверка перед посадкой.', uz: "Qo'nishdan oldingi oxirgi tekshiruv." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s15 — YAKUN (Yerga qo'nish).
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Мы дома!', uz: 'Uydamiz!' },
    cando: { ru: 'Ты прошёл весь второй класс и вернулся домой на Землю!', uz: "Siz butun ikkinchi sinfni o'tib, Yerga — uyga qaytdingiz!" },
    rule_recap: { ru: 'Сложение, вычитание, умножение, деление, геометрия и все темы года — всё пройдено.', uz: "Qo'shish, ayirish, ko'paytirish, bo'lish, geometriya va yilning barcha mavzulari — hammasi o'tildi." },
    audio: {
      ru: 'Мы дома! Корабль сел на Землю. За год мы прошли сложение и вычитание, умножение и деление, геометрию и много тем. Ты справился со всем. Молодец!',
      uz: "Uydamiz! Kema Yerga qo'ndi. Yil davomida qo'shish va ayirish, ko'paytirish va bo'lish, geometriya va ko'p mavzuni o'tdik. Siz hammasini uddaladingiz. Barakalla!"
    }
  }
};
```
