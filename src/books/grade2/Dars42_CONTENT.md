# Dars42 — CONTENT (Б6 NEPTUN · «Takrorlash + ПК6: Sayyora 6 yakuni» · program d.45)

> **Takrorlash + amaliy nazorat (ПК6)** — Б6 (Dars32–40) aralash yakuniy tekshiruvi. Klon-baza **Dars41** (MixStage + minilar).
> Slot-mavzular Dars41 bilan bir xil (s0 tenglama-hook · s1 ulush parts=4 · s2 vaqt h=3 · s3 pul · s4 ma'lumot) — ekran caption'lari mos. s5–s14 erkin.
> Yangi konsept YO'Q. **regext.mjs + kirill skan majburiy.**

---

```javascript
const CONTENT = {
  // s0 — HOOK (tenglama): x+4=9, kimdir x=13 dedi (qo'shdi). To'g'rimi? Yo'q (5).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Проверка', uz: "Mavzu: Nazorat" },
    lead: { ru: 'Верно ли решили?', uz: "To'g'ri yechildimi?" },
    q: { ru: 'Уравнение: x плюс четыре равно девять. Кто-то сказал: x равен тринадцати. Это верно?', uz: "Tenglama: x qo'shuv to'rt teng to'qqiz. Kimdir «x o'n uchga teng» dedi. Bu to'g'rimi?" },
    eqhook: { op: '+', n: 4, res: 9 },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы у Нептуна. Сегодня проверка всего, что прошли на шестой планете.',
          'Вот уравнение: x плюс четыре равно девять.',
          'Кто-то сложил и сказал, что x равен тринадцати. Но чтобы найти x, надо вычитать.',
          'Как думаешь, верно ли решили? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidamiz. Bugun oltinchi sayyorada o'tgan hammasining tekshiruvi.",
          "Mana tenglama: x qo'shuv to'rt teng to'qqiz.",
          "Kimdir qo'shib, x o'n uchga teng dedi. Ammo x ni topish uchun ayirish kerak.",
          "Sizningcha, to'g'ri yechildimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Убери от девяти четыре: девять минус четыре — пять.', uz: "To'g'ri. To'qqizdan to'rtni oling: to'qqiz ayirish to'rt — besh." },
      on_wrong: { ru: 'Чтобы найти x, убери известное: девять минус четыре — пять. Сейчас проверим.', uz: "x ni topish uchun ma'lumni oling: to'qqiz ayirish to'rt — besh. Hozir tekshiramiz." },
      on_unknown: { ru: 'Ничего. Сегодня проверим всё, что прошли.', uz: "Hechqisi yo'q. Bugun o'tgan hammasini tekshiramiz." }
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

  // s3 — RECAP+check: pul (500+500=1000).
  s3: {
    eyebrow: { ru: 'Деньги', uz: 'Pul' },
    lead: { ru: 'Вспомним деньги', uz: "Pulni eslaymiz" },
    recap: { kind: 'money', coins: [500, 500] },
    check_q: { ru: 'Пятьсот и пятьсот сумов. Сколько всего?', uz: "Besh yuz va besh yuz so'm. Jami qancha?" },
    opts: [{ ru: '1000 сум', uz: "1000 so'm", ok: true }, { ru: '550 сум', uz: "550 so'm" }, { ru: '2 сум', uz: "2 so'm" }],
    wrong: { ru: 'Считай стоимость: пятьсот плюс пятьсот — тысяча.', uz: "Qiymatni sanang: besh yuz qo'shuv besh yuz — ming." },
    check_ok: { ru: 'Верно! Тысяча сумов.', uz: "To'g'ri! Ming so'm." },
    audio: {
      ru: ['Вспомним деньги.', 'Деньги считают по стоимости монет.', 'Проверь. Пятьсот и пятьсот сумов. Сколько всего?'],
      uz: ["Pulni eslaymiz.", "Pul tangalarning qiymati bo'yicha sanaladi.", "Tekshiring. Besh yuz va besh yuz so'm. Jami qancha?"]
    }
  },

  // s4 — RECAP+check: ma'lumot (piktogramma sanash). caption «bitta rasm — bitta birlik».
  s4: {
    eyebrow: { ru: 'Данные', uz: "Ma'lumotlar" },
    lead: { ru: 'Вспомним данные', uz: "Ma'lumotni eslaymiz" },
    recap: { kind: 'data', data: [{ label: { ru: 'Ключи', uz: 'Kalitlar' }, n: 6, k: 'star', c: 'or' }] },
    check_q: { ru: 'Сколько ключей на пиктограмме?', uz: "Piktogrammada nechta kalit bor?" },
    opts: [{ ru: '6', uz: '6', ok: true }, { ru: '5', uz: '5' }, { ru: '7', uz: '7' }],
    wrong: { ru: 'Одна картинка — одна единица. Посчитай: их шесть.', uz: "Bitta rasm — bitta birlik. Sanang: ular oltita." },
    check_ok: { ru: 'Верно! Ключей шесть.', uz: "To'g'ri! Kalit oltita." },
    audio: {
      ru: ['Вспомним данные.', 'В пиктограмме одна картинка — одна единица.', 'Проверь. Сколько ключей?'],
      uz: ["Ma'lumotni eslaymiz.", "Piktogrammada bitta rasm — bitta birlik.", "Tekshiring. Nechta kalit bor?"]
    }
  },

  // sTBL — KALIT: nazoratda nimalar. 3 seg.
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Что проверяем', uz: "Nimani tekshiramiz" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'В проверке — уравнения, доли, время, деньги, задачи, логика и данные. Считай внимательно.', uz: "Tekshiruvda — tenglama, ulush, vaqt, pul, masala, mantiq va ma'lumot. Diqqat bilan sanang." },
    audio: {
      ru: ['Соберём ключ. Сегодня проверка.', 'Проверим уравнения, доли, время и деньги.', 'А также задачи, логику и данные. Будь внимателен.'],
      uz: ["Kalitni yig'amiz. Bugun tekshiruv.", "Tenglama, ulush, vaqt va pulni tekshiramiz.", "Shuningdek masala, mantiq va ma'lumot. Diqqatli bo'ling."]
    }
  },

  // s5 — tenglama.
  s5: {
    eyebrow: { ru: 'Проверка · 1', uz: 'Tekshiruv · 1' }, label: { ru: 'Реши', uz: "Yeching" },
    rounds: [
      { kind: 'eq', op: '+', n: 2, res: 7, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '9', uz: '9', wrong: { ru: 'Убери два: семь минус два — пять.', uz: "Ikkini oling: yetti ayirish ikki — besh." } }, { ru: '7', uz: '7', wrong: { ru: 'Семь минус два — пять.', uz: "Yetti ayirish ikki — besh." } }],
        correct_text: { ru: 'Верно. Пять.', uz: "To'g'ri. Besh." } },
      { kind: 'eq', op: '−', n: 3, res: 4, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '7', uz: '7', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'При вычитании прибавь: четыре плюс три — семь.', uz: "Ayirishda qo'shing: to'rt qo'shuv uch — yetti." } }, { ru: '4', uz: '4', wrong: { ru: 'Четыре плюс три — семь.', uz: "To'rt qo'shuv uch — yetti." } }],
        correct_text: { ru: 'Верно. Семь.', uz: "To'g'ri. Yetti." } }
    ],
    audio: { intro: { ru: 'Найди спрятанное число x.', uz: "Yashirin son x ni toping." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s6 — vaqt.
  s6: {
    eyebrow: { ru: 'Проверка · 2', uz: 'Tekshiruv · 2' }, label: { ru: 'Сколько времени?', uz: "Soat nechada?" },
    rounds: [
      { kind: 'time', h: 7, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '7:00', uz: '7:00', ok: true }, { ru: '12:35', uz: '12:35', wrong: { ru: 'Короткая на семи — семь часов.', uz: "Kalta yettida — soat yetti." } }, { ru: '7:12', uz: '7:12', wrong: { ru: 'Длинная на двенадцати — ноль минут.', uz: "Uzun o'n ikkida — nol daqiqa." } }],
        correct_text: { ru: 'Верно. Семь часов.', uz: "To'g'ri. Soat yetti." } },
      { kind: 'time', h: 2, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '2:00', uz: '2:00', ok: true }, { ru: '12:10', uz: '12:10', wrong: { ru: 'Короткая на двух — два часа.', uz: "Kalta ikkida — soat ikki." } }, { ru: '2:12', uz: '2:12', wrong: { ru: 'Длинная на двенадцати — ноль минут.', uz: "Uzun o'n ikkida — nol daqiqa." } }],
        correct_text: { ru: 'Верно. Два часа.', uz: "To'g'ri. Soat ikki." } }
    ],
    audio: { intro: { ru: 'Прочитай время по часам.', uz: "Soatga qarab vaqtni o'qing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s7 — ulush.
  s7: {
    eyebrow: { ru: 'Проверка · 3', uz: 'Tekshiruv · 3' }, label: { ru: 'Какая доля?', uz: "Qanday ulush?" },
    rounds: [
      { kind: 'ulush', parts: 4, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна четвёртая', uz: "bir to'rtdan", ok: true }, { ru: 'четыре', uz: "to'rt", wrong: { ru: 'Четыре — число частей. Одна из четырёх — одна четвёртая.', uz: "To'rt — qismlar soni. To'rttadan biri — bir to'rtdan." } }, { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Частей четыре, значит одна четвёртая.', uz: "Qism to'rtta, demak bir to'rtdan." } }],
        correct_text: { ru: 'Верно. Одна четвёртая.', uz: "To'g'ri. Bir to'rtdan." } },
      { kind: 'ulush', parts: 3, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', ok: true }, { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Частей три, значит одна третья.', uz: "Qism uchta, demak bir uchdan." } }, { ru: 'три', uz: 'uch', wrong: { ru: 'Три — число частей. Одна из трёх — одна третья.', uz: "Uch — qismlar soni. Uchtadan biri — bir uchdan." } }],
        correct_text: { ru: 'Верно. Одна третья.', uz: "To'g'ri. Bir uchdan." } }
    ],
    audio: { intro: { ru: 'Посчитай равные части и назови долю.', uz: "Teng qismlarni sanang va ulushni nomlang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s8 — pul.
  s8: {
    eyebrow: { ru: 'Проверка · 4', uz: 'Tekshiruv · 4' }, label: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    rounds: [
      { kind: 'money', coins: [1000, 200], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '1200 сум', uz: "1200 so'm", ok: true }, { ru: '2 сум', uz: "2 so'm", wrong: { ru: 'Считай стоимость: тысяча плюс двести — тысяча двести.', uz: "Qiymatni sanang: ming qo'shuv ikki yuz — ming ikki yuz." } }, { ru: '3000 сум', uz: "3000 so'm", wrong: { ru: 'Тысяча плюс двести — тысяча двести.', uz: "Ming qo'shuv ikki yuz — ming ikki yuz." } }],
        correct_text: { ru: 'Верно. Тысяча двести сумов.', uz: "To'g'ri. Ming ikki yuz so'm." } },
      { kind: 'money', coins: [500, 500, 100], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '1100 сум', uz: "1100 so'm", ok: true }, { ru: '3 сум', uz: "3 so'm", wrong: { ru: 'Три — число монет. Считай стоимость: тысяча сто.', uz: "Uch — tanga soni. Qiymatni sanang: ming yuz." } }, { ru: '1050 сум', uz: "1050 so'm", wrong: { ru: 'Пятьсот, пятьсот, сто — тысяча сто.', uz: "Besh yuz, besh yuz, yuz — ming yuz." } }],
        correct_text: { ru: 'Верно. Тысяча сто сумов.', uz: "To'g'ri. Ming yuz so'm." } }
    ],
    audio: { intro: { ru: 'Сложи стоимость монет.', uz: "Tangalar qiymatini qo'shing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s9 — kalendar + data.
  s9: {
    eyebrow: { ru: 'Проверка · 5', uz: 'Tekshiruv · 5' }, label: { ru: 'Подумай', uz: "O'ylab ko'ring" },
    rounds: [
      { kind: 'cal', q: { ru: 'Какой день идёт до субботы?', uz: "Shanbadan oldin qaysi kun keladi?" },
        opts: [{ ru: 'пятница', uz: 'juma', ok: true }, { ru: 'воскресенье', uz: 'yakshanba', wrong: { ru: 'Воскресенье после субботы. До субботы — пятница.', uz: "Yakshanba shanbadan keyin. Shanbadan oldin — juma." } }, { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Сразу до субботы — пятница.', uz: "Shanbadan darrov oldin — juma." } }],
        correct_text: { ru: 'Верно. До субботы — пятница.', uz: "To'g'ri. Shanbadan oldin — juma." } },
      { kind: 'data', data: [{ label: { ru: 'Звёзды', uz: 'Yulduzlar' }, n: 4, k: 'star', c: 'or' }], q: { ru: 'Сколько звёзд?', uz: "Nechta yulduz bor?" },
        opts: [{ ru: '4', uz: '4', ok: true }, { ru: '3', uz: '3', wrong: { ru: 'Посчитай по одной: их четыре.', uz: "Bittalab sanang: ular to'rtta." } }, { ru: '5', uz: '5', wrong: { ru: 'Картинок четыре.', uz: "Rasm to'rtta." } }],
        correct_text: { ru: 'Верно. Звёзд четыре.', uz: "To'g'ri. Yulduz to'rtta." } }
    ],
    audio: { intro: { ru: 'Вспомни календарь и данные.', uz: "Kalendar va ma'lumotni eslang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s10 — masala.
  s10: {
    eyebrow: { ru: 'Проверка · 6', uz: 'Tekshiruv · 6' }, label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'word', q: { ru: 'Лента девять см, отрезали два. Сколько осталось?', uz: "Tasma to'qqiz sm, ikki kesildi. Qancha qoldi?" },
        opts: [{ ru: '7', uz: '7', ok: true }, { ru: '11', uz: '11', wrong: { ru: 'Отрезали — вычитаем: девять минус два — семь.', uz: "Kesildi — ayiramiz: to'qqiz ayirish ikki — yetti." } }, { ru: '2', uz: '2', wrong: { ru: 'Два отрезали. Осталось семь.', uz: "Ikki kesildi. Qolgani yetti." } }],
        correct_text: { ru: 'Верно. Девять минус два — семь.', uz: "To'g'ri. To'qqiz ayirish ikki — yetti." } },
      { kind: 'word', q: { ru: 'Было пять кораблей, пришло ещё три. Сколько стало?', uz: "Besh kema edi, yana uchtasi keldi. Nechta bo'ldi?" },
        opts: [{ ru: '8', uz: '8', ok: true }, { ru: '2', uz: '2', wrong: { ru: 'Пришло — складываем: пять плюс три — восемь.', uz: "Keldi — qo'shamiz: besh qo'shuv uch — sakkiz." } }, { ru: '5', uz: '5', wrong: { ru: 'Добавь три: пять плюс три — восемь.', uz: "Uchni qo'shing: besh qo'shuv uch — sakkiz." } }],
        correct_text: { ru: 'Верно. Пять плюс три — восемь.', uz: "To'g'ri. Besh qo'shuv uch — sakkiz." } }
    ],
    audio: { intro: { ru: 'Выбери действие и посчитай.', uz: "Amalni tanlang va hisoblang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s11 — mantiq + ma'lumot.
  s11: {
    eyebrow: { ru: 'Проверка · 7', uz: 'Tekshiruv · 7' }, label: { ru: 'Подумай', uz: "O'ylab ko'ring" },
    rounds: [
      { kind: 'pattern', seq: [{ k: 'star', c: 'pu' }, { k: 'star', c: 'or' }, { k: 'star', c: 'pu' }, { k: 'star', c: 'or' }], q: { ru: 'Какого цвета звезда дальше?', uz: "Keyingi yulduz qaysi rangda?" },
        opts: [{ ru: 'фиолетовая', uz: 'siyohrang', ok: true }, { ru: 'оранжевая', uz: "to'q sariq", wrong: { ru: 'Цвет чередуется. После оранжевой — фиолетовая.', uz: "Rang almashadi. To'q sariqdan keyin — siyohrang." } }, { ru: 'зелёная', uz: 'yashil', wrong: { ru: 'В узоре только два цвета. Дальше фиолетовая.', uz: "Naqshda faqat ikki rang. Keyingisi siyohrang." } }],
        correct_text: { ru: 'Верно. После оранжевой — фиолетовая.', uz: "To'g'ri. To'q sariqdan keyin — siyohrang." } },
      { kind: 'data', data: [{ label: { ru: 'Роботы', uz: 'Robotlar' }, n: 6, k: 'circle', c: 'gr' }, { label: { ru: 'Ящики', uz: 'Qutilar' }, n: 4, k: 'square', c: 'or' }], q: { ru: 'На сколько роботов больше?', uz: "Robot nechta ko'p?" },
        opts: [{ ru: '2', uz: '2', ok: true }, { ru: '10', uz: '10', wrong: { ru: 'Разница — вычитаем: шесть минус четыре — два.', uz: "Farq — ayiramiz: olti ayirish to'rt — ikki." } }, { ru: '4', uz: '4', wrong: { ru: 'Четыре — это ящики. Разница два.', uz: "To'rt — bu qutilar. Farqi ikki." } }],
        correct_text: { ru: 'Верно. Шесть минус четыре — два.', uz: "To'g'ri. Olti ayirish to'rt — ikki." } }
    ],
    audio: { intro: { ru: 'Вспомни узоры и данные.', uz: "Naqsh va ma'lumotni eslang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  s12: { eyebrow: { ru: 'Задача', uz: 'Masala' }, lead: { ru: 'Проверка Бита.', uz: "Bit tekshiruvi." }, audio: { ru: 'Бит проходит проверку.', uz: "Bit tekshiruvdan o'tadi." } },

  // s13 — MASALA: word.
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' }, label: { ru: 'Проверка Бита', uz: "Bit tekshiruvi" },
    story: { ru: 'У Бита было десять кристаллов, четыре он отдал экипажу. Сколько осталось?', uz: "Bitda o'n kristall bor edi, to'rttasini ekipajga berdi. Nechta qoldi?" },
    kind: 'word', q: { ru: 'Сколько кристаллов осталось?', uz: "Nechta kristall qoldi?" },
    opts: [{ ru: '6', uz: '6', ok: true }, { ru: '14', uz: '14', wrong: { ru: 'Отдал — вычитаем: десять минус четыре — шесть.', uz: "Berdi — ayiramiz: o'n ayirish to'rt — olti." } }, { ru: '4', uz: '4', wrong: { ru: 'Четыре отдал. Осталось шесть.', uz: "To'rt berdi. Qolgani olti." } }],
    correct_text: { ru: 'Верно. Десять минус четыре — шесть.', uz: "To'g'ri. O'n ayirish to'rt — olti." },
    audio: { intro: { ru: 'У Бита было десять кристаллов, четыре отдал. Сколько осталось?', uz: "Bitda o'n kristall edi, to'rttasini berdi. Nechta qoldi?" }, on_correct: { ru: 'Верно. Шесть.', uz: "To'g'ri. Olti." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s14 — FINAL + FactCard.
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' }, label: { ru: 'Проверка', uz: "Tekshiruv" },
    rounds: [
      { kind: 'eq', op: '−', n: 4, res: 5, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '9', uz: '9', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'При вычитании прибавь: пять плюс четыре — девять.', uz: "Ayirishda qo'shing: besh qo'shuv to'rt — to'qqiz." } }, { ru: '5', uz: '5', wrong: { ru: 'Пять плюс четыре — девять.', uz: "Besh qo'shuv to'rt — to'qqiz." } }],
        correct_text: { ru: 'Верно. Девять.', uz: "To'g'ri. To'qqiz." } },
      { kind: 'ulush', parts: 2, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'две', uz: 'ikki', wrong: { ru: 'Две — число частей. Одна из двух — одна вторая.', uz: "Ikki — qismlar soni. Ikkitadan biri — bir ikkidan." } }, { ru: 'одна четвёртая', uz: "bir to'rtdan", wrong: { ru: 'Частей две, значит одна вторая.', uz: "Qism ikkita, demak bir ikkidan." } }],
        correct_text: { ru: 'Верно. Одна вторая.', uz: "To'g'ri. Bir ikkidan." } },
      { kind: 'money', coins: [1000, 500, 200], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '1700 сум', uz: "1700 so'm", ok: true }, { ru: '3 сум', uz: "3 so'm", wrong: { ru: 'Считай стоимость: тысяча семьсот.', uz: "Qiymatni sanang: ming yetti yuz." } }, { ru: '1520 сум', uz: "1520 so'm", wrong: { ru: 'Тысяча, пятьсот, двести — тысяча семьсот.', uz: "Ming, besh yuz, ikki yuz — ming yetti yuz." } }],
        correct_text: { ru: 'Верно. Тысяча семьсот сумов.', uz: "To'g'ri. Ming yetti yuz so'm." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Шестая планета пройдена. Осталась последняя дорога — домой, на Землю.', uz: "Oltinchi sayyora bosib o'tildi. Oxirgi yo'l qoldi — uyga, Yerga." },
    fact_audio: { ru: 'Шестая планета пройдена. Впереди последняя дорога домой, на Землю.', uz: "Oltinchi sayyora bosib o'tildi. Oldinda uyga, Yerga oxirgi yo'l." },
    audio: { intro: { ru: 'Последняя часть проверки.', uz: "Tekshiruvning oxirgi qismi." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s15 — YAKUN.
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Проверка пройдена!', uz: "Tekshiruv o'tildi!" },
    cando: { ru: 'Ты справился с проверкой шестой планеты!', uz: "Oltinchi sayyora tekshiruvini uddaladingiz!" },
    rule_recap: { ru: 'Уравнения, доли, время, деньги, задачи, логика и данные — всё проверено.', uz: "Tenglama, ulush, vaqt, pul, masala, mantiq va ma'lumot — hammasi tekshirildi." },
    audio: {
      ru: 'Проверка пройдена. Мы справились с уравнениями, долями, временем, деньгами, задачами, логикой и данными. Впереди последний урок — дорога домой.',
      uz: "Tekshiruv o'tildi. Tenglama, ulush, vaqt, pul, masala, mantiq va ma'lumotni uddaladik. Oldinda oxirgi dars — uyga yo'l."
    }
  }
};
```
