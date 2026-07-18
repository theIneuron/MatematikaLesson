# Dars41 — CONTENT (Б6 NEPTUN · «Takrorlash: Sayyora 6» · program d.44)

> **Takrorlash darsi** — Б6 (Dars32–40) aralash: tenglama, ulush, vaqt, pul, kalendar, masala, mantiq, ma'lumot.
> Klon-baza: **Dars40.jsx** (Shape/Pictogram meros). Yangi: `MixStage` (kind bo'yicha ixcham vizual) + ClockMini/CoinRow/PieMini/EqText.
> Yangi konsept YO'Q — barcha misconception qayta mustahkamlanadi. **regext.mjs + kirill skan majburiy.**

---

```javascript
const CONTENT = {
  // s0 — HOOK (tenglama): x+3=8, kimdir x=11 dedi (qo'shdi). To'g'rimi? Yo'q (5).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Повторение', uz: "Mavzu: Takrorlash" },
    lead: { ru: 'Верно ли решили?', uz: "To'g'ri yechildimi?" },
    q: { ru: 'Уравнение: x плюс три равно восемь. Кто-то сказал: x равен одиннадцати. Это верно?', uz: "Tenglama: x qo'shuv uch teng sakkiz. Kimdir «x o'n birga teng» dedi. Bu to'g'rimi?" },
    eqhook: { op: '+', n: 3, res: 8 },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы почти дома, на станции у Нептуна. Экипаж повторяет всё пройденное.',
          'Вот уравнение: x плюс три равно восемь.',
          'Кто-то сложил и сказал, что x равен одиннадцати. Но чтобы найти x, надо вычитать.',
          'Как думаешь, верно ли решили? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Deyarli uydamiz, Neptun yonidagi stansiyada. Ekipaj o'tganlarni takrorlayapti.",
          "Mana tenglama: x qo'shuv uch teng sakkiz.",
          "Kimdir qo'shib, x o'n birga teng dedi. Ammo x ni topish uchun ayirish kerak.",
          "Sizningcha, to'g'ri yechildimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Убери от восьми три: восемь минус три — пять.', uz: "To'g'ri. Sakkizdan uchni oling: sakkiz ayirish uch — besh." },
      on_wrong: { ru: 'Чтобы найти x, убери известное: восемь минус три — пять. Сейчас повторим.', uz: "x ni topish uchun ma'lumni oling: sakkiz ayirish uch — besh. Hozir takrorlaymiz." },
      on_unknown: { ru: 'Ничего. Сегодня повторим всё, что прошли.', uz: "Hechqisi yo'q. Bugun o'tgan hammasini takrorlaymiz." }
    }
  },

  // s1 — RECAP: ulush (pie 4, 1 bo'yalgan → bir to'rtdan). 3 seg.
  s1: {
    eyebrow: { ru: 'Доли', uz: 'Ulush' },
    lead: { ru: 'Вспомним доли', uz: "Ulushni eslaymiz" },
    recap: { kind: 'ulush', parts: 4 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Доля — одна из равных частей. Четыре равные части, одна закрашена — это одна четвёртая.', uz: "Ulush — teng qismlardan biri. To'rtta teng qism, biri bo'yalgan — bu bir to'rtdan." },
    audio: {
      ru: ['Вспомним доли.', 'Целое поделили на четыре равные части.', 'Одна закрашенная часть — это одна четвёртая.'],
      uz: ["Ulushni eslaymiz.", "Butun to'rtta teng qismga bo'lingan.", "Bir bo'yalgan qism — bu bir to'rtdan."]
    }
  },

  // s2 — RECAP: vaqt (clock 3:00). 3 seg.
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

  // s3 — RECAP+check: pul (500+200=700).
  s3: {
    eyebrow: { ru: 'Деньги', uz: 'Pul' },
    lead: { ru: 'Вспомним деньги', uz: "Pulni eslaymiz" },
    recap: { kind: 'money', coins: [500, 200] },
    check_q: { ru: 'Пятьсот и двести сумов. Сколько всего?', uz: "Besh yuz va ikki yuz so'm. Jami qancha?" },
    opts: [{ ru: '700 сум', uz: "700 so'm", ok: true }, { ru: '300 сум', uz: "300 so'm" }, { ru: '2 сум', uz: "2 so'm" }],
    wrong: { ru: 'Считай стоимость: пятьсот плюс двести — семьсот.', uz: "Qiymatni sanang: besh yuz qo'shuv ikki yuz — yetti yuz." },
    check_ok: { ru: 'Верно! Семьсот сумов.', uz: "To'g'ri! Yetti yuz so'm." },
    audio: {
      ru: ['Вспомним деньги.', 'Деньги считают по стоимости монет.', 'Проверь. Пятьсот и двести сумов. Сколько всего?'],
      uz: ["Pulni eslaymiz.", "Pul tangalarning qiymati bo'yicha sanaladi.", "Tekshiring. Besh yuz va ikki yuz so'm. Jami qancha?"]
    }
  },

  // s4 — RECAP+check: ma'lumot (piktogramma sanash).
  s4: {
    eyebrow: { ru: 'Данные', uz: "Ma'lumotlar" },
    lead: { ru: 'Вспомним данные', uz: "Ma'lumotni eslaymiz" },
    recap: { kind: 'data', data: [{ label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 5, k: 'star', c: 'pu' }] },
    check_q: { ru: 'Сколько кристаллов на пиктограмме?', uz: "Piktogrammada nechta kristall bor?" },
    opts: [{ ru: '5', uz: '5', ok: true }, { ru: '4', uz: '4' }, { ru: '6', uz: '6' }],
    wrong: { ru: 'Одна картинка — одна единица. Посчитай: их пять.', uz: "Bitta rasm — bitta birlik. Sanang: ular beshta." },
    check_ok: { ru: 'Верно! Кристаллов пять.', uz: "To'g'ri! Kristall beshta." },
    audio: {
      ru: ['Вспомним данные.', 'В пиктограмме одна картинка — одна единица.', 'Проверь. Сколько кристаллов?'],
      uz: ["Ma'lumotni eslaymiz.", "Piktogrammada bitta rasm — bitta birlik.", "Tekshiring. Nechta kristall bor?"]
    }
  },

  // sTBL — KALIT: Б6 ko'nikmalari. done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Что мы прошли', uz: "Nimalarni o'tdik" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Мы прошли уравнения, доли, время, календарь, деньги, задачи, логику и данные.', uz: "Biz tenglama, ulush, vaqt, kalendar, pul, masala, mantiq va ma'lumotlarни o'tdik." },
    audio: {
      ru: ['Соберём ключ. Мы прошли много тем.', 'Уравнения и доли, время и календарь.', 'Деньги, задачи, логику и данные. Повторим всё.'],
      uz: ["Kalitni yig'amiz. Ko'p mavzu o'tdik.", "Tenglama va ulush, vaqt va kalendar.", "Pul, masala, mantiq va ma'lumot. Hammasini takrorlaymiz."]
    }
  },

  // s5 — MASHQ mix: tenglama.
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Реши', uz: "Yeching" },
    rounds: [
      { kind: 'eq', op: '+', n: 4, res: 9, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '13', uz: '13', wrong: { ru: 'Не складывай: девять минус четыре — пять.', uz: "Qo'shmang: to'qqiz ayirish to'rt — besh." } }, { ru: '9', uz: '9', wrong: { ru: 'Убери четыре: девять минус четыре — пять.', uz: "To'rtni oling: to'qqiz ayirish to'rt — besh." } }],
        correct_text: { ru: 'Верно. Девять минус четыре — пять.', uz: "To'g'ri. To'qqiz ayirish to'rt — besh." } },
      { kind: 'eq', op: '−', n: 2, res: 3, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'При вычитании прибавь: три плюс два — пять.', uz: "Ayirishda qo'shing: uch qo'shuv ikki — besh." } }, { ru: '3', uz: '3', wrong: { ru: 'Прибавь два: три плюс два — пять.', uz: "Ikkini qo'shing: uch qo'shuv ikki — besh." } }],
        correct_text: { ru: 'Верно. Три плюс два — пять.', uz: "To'g'ri. Uch qo'shuv ikki — besh." } }
    ],
    audio: { intro: { ru: 'Найди спрятанное число x.', uz: "Yashirin son x ni toping." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s6 — MASHQ mix: ulush.
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Какая доля?', uz: "Qanday ulush?" },
    rounds: [
      { kind: 'ulush', parts: 3, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', ok: true }, { ru: 'три', uz: 'uch', wrong: { ru: 'Три — число частей. Одна из трёх — одна третья.', uz: "Uch — qismlar soni. Uchtadan biri — bir uchdan." } }, { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Частей три, значит одна третья.', uz: "Qism uchta, demak bir uchdan." } }],
        correct_text: { ru: 'Верно. Три равные части — одна третья.', uz: "To'g'ri. Uchta teng qism — bir uchdan." } },
      { kind: 'ulush', parts: 2, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'одна четвёртая', uz: "bir to'rtdan", wrong: { ru: 'Частей две, значит одна вторая.', uz: "Qism ikkita, demak bir ikkidan." } }, { ru: 'две', uz: 'ikki', wrong: { ru: 'Две — число частей. Одна из двух — одна вторая.', uz: "Ikki — qismlar soni. Ikkitadan biri — bir ikkidan." } }],
        correct_text: { ru: 'Верно. Две равные части — одна вторая.', uz: "To'g'ri. Ikkita teng qism — bir ikkidan." } }
    ],
    audio: { intro: { ru: 'Посчитай равные части и назови долю.', uz: "Teng qismlarni sanang va ulushni nomlang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s7 — MASHQ mix: vaqt.
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Сколько времени?', uz: "Soat nechada?" },
    rounds: [
      { kind: 'time', h: 6, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '6:00', uz: '6:00', ok: true }, { ru: '12:30', uz: '12:30', wrong: { ru: 'Короткая на шести — часы. Шесть часов.', uz: "Kalta oltida — soat. Soat olti." } }, { ru: '6:12', uz: '6:12', wrong: { ru: 'Длинная на двенадцати — ноль минут. Шесть часов.', uz: "Uzun o'n ikkida — nol daqiqa. Soat olti." } }],
        correct_text: { ru: 'Верно. Шесть часов ровно.', uz: "To'g'ri. Roppa-rosa soat olti." } },
      { kind: 'time', h: 9, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '9:00', uz: '9:00', ok: true }, { ru: '12:45', uz: '12:45', wrong: { ru: 'Короткая на девяти — часы. Девять часов.', uz: "Kalta to'qqizda — soat. Soat to'qqiz." } }, { ru: '9:12', uz: '9:12', wrong: { ru: 'Длинная на двенадцати — ноль минут. Девять часов.', uz: "Uzun o'n ikkida — nol daqiqa. Soat to'qqiz." } }],
        correct_text: { ru: 'Верно. Девять часов ровно.', uz: "To'g'ri. Roppa-rosa soat to'qqiz." } }
    ],
    audio: { intro: { ru: 'Прочитай время: короткая — часы, длинная — минуты.', uz: "Vaqtni o'qing: kalta — soat, uzun — daqiqa." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s8 — MASHQ mix: pul.
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    rounds: [
      { kind: 'money', coins: [500, 200, 100], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '800 сум', uz: "800 so'm", ok: true }, { ru: '3 сум', uz: "3 so'm", wrong: { ru: 'Три — число монет. Считай стоимость: восемьсот.', uz: "Uch — tanga soni. Qiymatni sanang: sakkiz yuz." } }, { ru: '710 сум', uz: "710 so'm", wrong: { ru: 'Считай по сотням: пятьсот, двести, сто — восемьсот.', uz: "Yuzliklab sanang: besh yuz, ikki yuz, yuz — sakkiz yuz." } }],
        correct_text: { ru: 'Верно. Восемьсот сумов.', uz: "To'g'ri. Sakkiz yuz so'm." } },
      { kind: 'money', coins: [1000, 500], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '1500 сум', uz: "1500 so'm", ok: true }, { ru: '2 сум', uz: "2 so'm", wrong: { ru: 'Считай стоимость: тысяча плюс пятьсот — тысяча пятьсот.', uz: "Qiymatni sanang: ming qo'shuv besh yuz — ming besh yuz." } }, { ru: '1050 сум', uz: "1050 so'm", wrong: { ru: 'Тысяча плюс пятьсот — тысяча пятьсот.', uz: "Ming qo'shuv besh yuz — ming besh yuz." } }],
        correct_text: { ru: 'Верно. Тысяча пятьсот сумов.', uz: "To'g'ri. Ming besh yuz so'm." } }
    ],
    audio: { intro: { ru: 'Сложи стоимость монет.', uz: "Tangalar qiymatini qo'shing." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s9 — MASHQ mix: kalendar (text) + mantiq (pattern).
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Подумай', uz: "O'ylab ko'ring" },
    rounds: [
      { kind: 'cal', q: { ru: 'Какой день идёт после среды?', uz: "Chorshanbadan keyin qaysi kun keladi?" },
        opts: [{ ru: 'четверг', uz: 'payshanba', ok: true }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Вторник был раньше. После среды — четверг.', uz: "Seshanba oldin edi. Chorshanbadan keyin — payshanba." } }, { ru: 'понедельник', uz: 'dushanba', wrong: { ru: 'После среды по порядку — четверг.', uz: "Chorshanbadan keyin tartib bilan — payshanba." } }],
        correct_text: { ru: 'Верно. После среды — четверг.', uz: "To'g'ri. Chorshanbadan keyin — payshanba." } },
      { kind: 'pattern', seq: [{ k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }, { k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        opts: [{ ru: 'круг', uz: 'doira', ok: true }, { ru: 'треугольник', uz: 'uchburchak', wrong: { ru: 'Звено — круг, треугольник. После треугольника — круг.', uz: "Zveno — doira, uchburchak. Uchburchakdan keyin — doira." } }, { ru: 'квадрат', uz: 'kvadrat', wrong: { ru: 'В узоре только круг и треугольник. Дальше круг.', uz: "Naqshда faqat doira va uchburchak. Keyingisi doira." } }],
        correct_text: { ru: 'Верно. После треугольника — круг.', uz: "To'g'ri. Uchburchakdan keyin — doira." } }
    ],
    audio: { intro: { ru: 'Вспомни календарь и узоры.', uz: "Kalendar va naqshlarni eslang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s10 — MASHQ mix: masala (word).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'word', q: { ru: 'Было восемь кристаллов, три отдали. Сколько осталось?', uz: "Sakkiz kristall bor edi, uchtasi berildi. Nechta qoldi?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '11', uz: '11', wrong: { ru: 'Отдали — вычитаем: восемь минус три — пять.', uz: "Berildi — ayiramiz: sakkiz ayirish uch — besh." } }, { ru: '3', uz: '3', wrong: { ru: 'Три отдали. Осталось восемь минус три — пять.', uz: "Uch berildi. Qolgani sakkiz ayirish uch — besh." } }],
        correct_text: { ru: 'Верно. Восемь минус три — пять.', uz: "To'g'ri. Sakkiz ayirish uch — besh." } },
      { kind: 'word', q: { ru: 'На складе было шесть ящиков, привезли ещё четыре. Сколько стало?', uz: "Omborda olti quti edi, yana to'rtta keltirildi. Nechta bo'ldi?" },
        opts: [{ ru: '10', uz: '10', ok: true }, { ru: '2', uz: '2', wrong: { ru: 'Привезли ещё — складываем: шесть плюс четыре — десять.', uz: "Yana keltirildi — qo'shamiz: olti qo'shuv to'rt — o'n." } }, { ru: '6', uz: '6', wrong: { ru: 'Добавь четыре: шесть плюс четыре — десять.', uz: "To'rtni qo'shing: olti qo'shuv to'rt — o'n." } }],
        correct_text: { ru: 'Верно. Шесть плюс четыре — десять.', uz: "To'g'ri. Olti qo'shuv to'rt — o'n." } }
    ],
    audio: { intro: { ru: 'Выбери действие: больше — сложи, меньше — вычти.', uz: "Amalni tanlang: ko'paysa — qo'shing, kamaysa — ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s11 — MASHQ mix: ma'lumot (data) + ulush.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Читай данные', uz: "Ma'lumotni o'qing" },
    rounds: [
      { kind: 'data', data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 3, k: 'square', c: 'bl' }, { label: { ru: 'Роботы', uz: 'Robotlar' }, n: 6, k: 'circle', c: 'gr' }], q: { ru: 'Чего больше?', uz: "Nima ko'p?" },
        opts: [{ ru: 'роботов', uz: 'robot', ok: true }, { ru: 'кораблей', uz: 'kema', wrong: { ru: 'Кораблей три, роботов шесть. Роботов больше.', uz: "Kema uchta, robot oltita. Robot ko'p." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Три и шесть не равны. Роботов больше.', uz: "Uch va olti teng emas. Robot ko'p." } }],
        correct_text: { ru: 'Верно. Роботов шесть — больше.', uz: "To'g'ri. Robot oltita — ko'proq." } },
      { kind: 'ulush', parts: 4, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна четвёртая', uz: "bir to'rtdan", ok: true }, { ru: 'четыре', uz: "to'rt", wrong: { ru: 'Четыре — число частей. Одна из четырёх — одна четвёртая.', uz: "To'rt — qismlar soni. To'rttadan biri — bir to'rtdan." } }, { ru: 'одна третья', uz: 'bir uchdan', wrong: { ru: 'Частей четыре, значит одна четвёртая.', uz: "Qism to'rtta, demak bir to'rtdan." } }],
        correct_text: { ru: 'Верно. Четыре части — одна четвёртая.', uz: "To'g'ri. To'rt qism — bir to'rtdan." } }
    ],
    audio: { intro: { ru: 'Читай данные и вспомни доли.', uz: "Ma'lumotni o'qing va ulushni eslang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  s12: { eyebrow: { ru: 'Задача', uz: 'Masala' }, lead: { ru: 'Бит повторяет.', uz: "Bit takrorlaydi." }, audio: { ru: 'Бит повторяет пройденное.', uz: "Bit o'tganlarni takrorlaydi." } },

  // s13 — MASALA: masala (pul).
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Расчёт Бита', uz: "Bit hisobi" },
    story: { ru: 'У Бита было семьсот сумов, он потратил двести. Сколько осталось?', uz: "Bitda yetti yuz so'm bor edi, ikki yuz sarfladi. Qancha qoldi?" },
    kind: 'word',
    q: { ru: 'Сколько осталось у Бита?', uz: "Bitda qancha qoldi?" },
    opts: [{ ru: '500 сум', uz: "500 so'm", ok: true }, { ru: '900 сум', uz: "900 so'm", wrong: { ru: 'Потратил — вычитаем: семьсот минус двести — пятьсот.', uz: "Sarfladi — ayiramiz: yetti yuz ayirish ikki yuz — besh yuz." } }, { ru: '200 сум', uz: "200 so'm", wrong: { ru: 'Двести потратил. Осталось пятьсот.', uz: "Ikki yuz sarfladi. Qolgani besh yuz." } }],
    correct_text: { ru: 'Верно. Семьсот минус двести — пятьсот сумов.', uz: "To'g'ri. Yetti yuz ayirish ikki yuz — besh yuz so'm." },
    audio: { intro: { ru: 'У Бита было семьсот сумов, потратил двести. Сколько осталось?', uz: "Bitda yetti yuz so'm edi, ikki yuz sarfladi. Qancha qoldi?" }, on_correct: { ru: 'Верно. Пятьсот сумов.', uz: "To'g'ri. Besh yuz so'm." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s14 — FINAL (aralash ×3 + FactCard).
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Повторение', uz: "Takrorlash" },
    rounds: [
      { kind: 'eq', op: '+', n: 5, res: 8, q: { ru: 'Чему равен x?', uz: "x nechaga teng?" },
        opts: [{ ru: '3', uz: '3', ok: true }, { ru: '13', uz: '13', wrong: { ru: 'Убери пять: восемь минус пять — три.', uz: "Beshni oling: sakkiz ayirish besh — uch." } }, { ru: '8', uz: '8', wrong: { ru: 'Восемь минус пять — три.', uz: "Sakkiz ayirish besh — uch." } }],
        correct_text: { ru: 'Верно. Три.', uz: "To'g'ri. Uch." } },
      { kind: 'time', h: 4, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '4:00', uz: '4:00', ok: true }, { ru: '12:20', uz: '12:20', wrong: { ru: 'Короткая на четырёх — часы. Четыре часа.', uz: "Kalta to'rtda — soat. Soat to'rt." } }, { ru: '4:12', uz: '4:12', wrong: { ru: 'Длинная на двенадцати — ноль минут.', uz: "Uzun o'n ikkida — nol daqiqa." } }],
        correct_text: { ru: 'Верно. Четыре часа.', uz: "To'g'ri. Soat to'rt." } },
      { kind: 'money', coins: [200, 200, 100], q: { ru: 'Сколько всего?', uz: "Jami qancha?" },
        opts: [{ ru: '500 сум', uz: "500 so'm", ok: true }, { ru: '3 сум', uz: "3 so'm", wrong: { ru: 'Считай стоимость: двести, двести, сто — пятьсот.', uz: "Qiymatni sanang: ikki yuz, ikki yuz, yuz — besh yuz." } }, { ru: '410 сум', uz: "410 so'm", wrong: { ru: 'По сотням: пятьсот.', uz: "Yuzliklab: besh yuz." } }],
        correct_text: { ru: 'Верно. Пятьсот сумов.', uz: "To'g'ri. Besh yuz so'm." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Мы прошли весь путь: от Земли через шесть планет — почти домой.', uz: "Butun yo'lni bosib o'tdik: Yerdan olti sayyora orqali — deyarli uyda." },
    fact_audio: { ru: 'Мы прошли весь путь от Земли через шесть планет. Дом уже совсем близко.', uz: "Yerdan olti sayyora orqali butun yo'lni bosib o'tdik. Uy juda yaqin." },
    audio: { intro: { ru: 'Последняя проверка повторения.', uz: "Takrorlashning oxirgi tekshiruvi." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s15 — YAKUN
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Повторение завершено!', uz: 'Takrorlash tugadi!' },
    cando: { ru: 'Ты повторил всё пройденное на шестой планете!', uz: "Oltinchi sayyorada o'tgan hammasini takrorladingiz!" },
    rule_recap: { ru: 'Уравнения, доли, время, деньги, задачи, логика и данные — всё повторили.', uz: "Tenglama, ulush, vaqt, pul, masala, mantiq va ma'lumot — hammasini takrorladik." },
    audio: {
      ru: 'Повторение завершено. Мы вспомнили уравнения, доли, время, деньги, задачи, логику и данные. Дальше — итоговая проверка перед домом.',
      uz: "Takrorlash tugadi. Tenglama, ulush, vaqt, pul, masala, mantiq va ma'lumotni esladik. Keyin — uyга qaytishdan oldingi yakuniy tekshiruv."
    }
  }
};
```
