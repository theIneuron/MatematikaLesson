# Dars40 — CONTENT (Б6 NEPTUN · «Ma'lumotlar bilan ishlash: piktogramma, jadval» · program d.43)

> **Mexanika (metodist 2026-07-17): ARALASH** — piktogramma (teach + qoida: 1 rasm=1 birlik) + jadval o'qish + solishtirish.
> Klon-baza: **Dars39.jsx** (Shape meros). Yangi: `Pictogram` (kategoriya-qatorlar, ikonka=birlik) + `DataTable` (kategoriya|son) +
> `DataStage` (mode: picto/table). Ikonka = `Shape`. Ko'lam: kategoriyaga ≤ 10, jami ≤ 20.
> **⚠️ REGISTR:** siz-shakli (sanang/solishtiring/o'qing/toping) — yalang'och buyruq (sana/top) YO'Q. `regext.mjs` majburiy.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)
1. **UZ atamalar (draft):** jadval, piktogramma, birlik, jami, qaysi ko'p/kam, nechta. Xaydarov solishtirilmadi.
2. 1 ikonka = 1 birlik; son ≤ 10 (kategoriya), jami ≤ 20.

---

```javascript
const CONTENT = {
  // s0 — HOOK: kema piktogrammasi (3 ta); kimdir «to'rtta» dedi. To'g'rimi? Yo'q (uchta) — 1:1 sanash.
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Данные', uz: "Mavzu: Ma'lumotlar" },
    lead: { ru: 'Верно ли посчитали?', uz: "To'g'ri sanaldimi?" },
    q: { ru: 'На картинке три корабля. Кто-то сказал: их четыре. Это верно?', uz: "Rasmda uchta kema bor. Kimdir «to'rtta» dedi. Bu to'g'rimi?" },
    picto: { label: { ru: 'Корабли', uz: 'Kemalar' }, n: 3, k: 'square', c: 'bl' },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на станции у Нептуна. На панели показаны данные.',
          'Каждая картинка — это одна единица. Здесь картинки кораблей.',
          'Кто-то сказал, что кораблей четыре. Но их нужно посчитать по одному.',
          'Как думаешь, верно ли посчитали? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidagi stansiyadamiz. Panelда ma'lumotlar ko'rsatilgan.",
          "Har bir rasm — bu bitta birlik. Bu yerda kema rasmlari.",
          "Kimdir kema to'rtta dedi. Ammo ularni bittalab sanash kerak.",
          "Sizningcha, to'g'ri sanaldimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Каждая картинка — один корабль. Их три, а не четыре.', uz: "To'g'ri. Har rasm — bitta kema. Ular uchta, to'rtta emas." },
      on_wrong: { ru: 'Посчитай по одному: одна картинка — один корабль. Их три. Сейчас разберём.', uz: "Bittalab sanang: bitta rasm — bitta kema. Ular uchta. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня научимся читать данные.', uz: "Hechqisi yo'q. Bugun ma'lumotlarni o'qishni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: piktogramma — 1 ikonka = 1 birlik, qatorni sanaymiz. 4 seg.
  s1: {
    eyebrow: { ru: 'Пиктограмма', uz: 'Piktogramma' },
    lead: { ru: 'Одна картинка — одна единица', uz: "Bitta rasm — bitta birlik" },
    picto: { label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 5, k: 'star', c: 'pu' },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'В пиктограмме одна картинка — это одна единица. Чтобы узнать количество, посчитай картинки.', uz: "Piktogrammada bitta rasm — bu bitta birlik. Sonini bilish uchun rasmlarni sanang." },
    audio: {
      ru: [
        'Посмотри на пиктограмму. Здесь картинки кристаллов.',
        'Одна картинка — это один кристалл, одна единица.',
        'Чтобы узнать, сколько кристаллов, посчитаем картинки по одной.',
        'Их пять. Одна картинка — одна единица.'
      ],
      uz: [
        "Piktogrammaga qarang. Bu yerda kristall rasmlari.",
        "Bitta rasm — bu bitta kristall, bitta birlik.",
        "Kristall nechta ekanini bilish uchun rasmlarni bittalab sanaymiz.",
        "Ular beshta. Bitta rasm — bitta birlik."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: qatorlarni solishtir — qaysi ko'p (soni bo'yicha). 4 seg.
  s2: {
    eyebrow: { ru: 'Сравнение', uz: 'Solishtirish' },
    lead: { ru: 'Где больше', uz: "Qaysi biri ko'p" },
    picto2: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 3, k: 'square', c: 'bl' }, { label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 5, k: 'star', c: 'pu' }],
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Чтобы сравнить, посчитай картинки в каждом ряду. Больше там, где картинок больше.', uz: "Solishtirish uchun har qatordagi rasmlarni sanang. Rasm ko'p bo'lgan joyda ko'proq." },
    audio: {
      ru: [
        'Сравним два ряда. Сверху корабли, снизу кристаллы.',
        'Кораблей три, кристаллов пять.',
        'Чтобы узнать, где больше, считаем картинки, а не длину.',
        'Кристаллов больше: их пять, а кораблей три.'
      ],
      uz: [
        "Ikki qatorni solishtiramiz. Tepada kemalar, pastda kristallar.",
        "Kema uchta, kristall beshta.",
        "Qaysi ko'p ekanini bilish uchun rasmlarni sanaymiz, uzunlikni emas.",
        "Kristall ko'p: ular beshta, kema esa uchta."
      ]
    }
  },

  // s3 — QOIDA: piktogramma — rasmlarni sana, 1 rasm=1 birlik + check (picto).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'В пиктограмме считай картинки по одной. Одна картинка — одна единица.', uz: "Piktogrammada rasmlarni bittalab sanang. Bitta rasm — bitta birlik." },
    mode: 'picto',
    data: [{ label: { ru: 'Роботы', uz: 'Robotlar' }, n: 4, k: 'circle', c: 'gr' }],
    check_q: { ru: 'Сколько роботов на пиктограмме?', uz: "Piktogrammada nechta robot bor?" },
    opts: [{ ru: '4', uz: '4', ok: true }, { ru: '3', uz: '3' }, { ru: '5', uz: '5' }],
    wrong: { ru: 'Посчитай картинки по одной: их четыре.', uz: "Rasmlarni bittalab sanang: ular to'rtta." },
    check_ok: { ru: 'Верно! Роботов четыре.', uz: "To'g'ri! Robot to'rtta." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'В пиктограмме одна картинка — одна единица.',
        'Считай картинки по одной.',
        'Проверь. Сколько роботов на пиктограмме?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Piktogrammada bitta rasm — bitta birlik.",
        "Rasmlarni bittalab sanang.",
        "Tekshiring. Piktogrammada nechta robot bor?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (JADVAL + WARN): jadvalда kerakli qatorni o'qi. warn: qatorni chalkashtirma. check (table).
  s4: {
    eyebrow: { ru: 'Таблица', uz: 'Jadval' },
    lead: { ru: 'Читай нужную строку', uz: "Kerakli qatorni o'qing" },
    mode: 'table',
    data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 3 }, { label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 6 }, { label: { ru: 'Роботы', uz: 'Robotlar' }, n: 2 }],
    warn: { ru: 'В таблице найди нужную строку и прочитай число рядом. Не путай строки.', uz: "Jadvalда kerakli qatorni toping va yonidagi sonni o'qing. Qatorlarni chalkashtirmang." },
    check_q: { ru: 'Сколько кристаллов в таблице?', uz: "Jadvalда nechta kristall bor?" },
    opts: [{ ru: '6', uz: '6', ok: true }, { ru: '3', uz: '3' }, { ru: '2', uz: '2' }],
    wrong: { ru: 'Найди строку кристаллов и прочитай число рядом: шесть.', uz: "Kristall qatorini toping va yonidagi sonni o'qing: olti." },
    check_ok: { ru: 'Верно! Кристаллов шесть.', uz: "To'g'ri! Kristall oltita." },
    audio: {
      ru: [
        'Данные можно записать в таблицу.',
        'В таблице слева название, справа число.',
        'Найди нужную строку и прочитай число рядом. Не путай строки.',
        'Проверь. Сколько кристаллов в таблице?'
      ],
      uz: [
        "Ma'lumotlarni jadvalга yozish mumkin.",
        "Jadvalда chapda nom, o'ngda son.",
        "Kerakli qatorni toping va yonidagi sonni o'qing. Qatorlarni chalkashtirmang.",
        "Tekshiring. Jadvalда nechta kristall bor?"
      ]
    }
  },

  // sTBL — KALIT: piktogramma ↔ jadval (bir xil ma'lumot ikki ko'rinishда). done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Пиктограмма и таблица', uz: "Piktogramma va jadval" },
    picto2: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 3, k: 'square', c: 'bl' }, { label: { ru: 'Роботы', uz: 'Robotlar' }, n: 2, k: 'circle', c: 'gr' }],
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Одни и те же данные можно показать пиктограммой и таблицей. Считай картинки или читай число.', uz: "Bir xil ma'lumotni piktogramma va jadval bilan ko'rsatish mumkin. Rasmlarni sanang yoki sonni o'qing." },
    audio: {
      ru: [
        'Соберём ключ. Данные показывают двумя способами.',
        'В пиктограмме считаем картинки, одна картинка — одна единица.',
        'В таблице читаем число рядом с названием.'
      ],
      uz: [
        "Kalitni yig'amiz. Ma'lumotlar ikki xil ko'rsatiladi.",
        "Piktogrammada rasmlarni sanaymiz, bitta rasm — bitta birlik.",
        "Jadvalда nom yonidagi sonni o'qiymiz."
      ]
    }
  },

  // s5 — MASHQ picto (sanash). distraktor = noto'g'ri sanash (M1).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Посчитай', uz: "Sanang" },
    rounds: [
      { mode: 'picto', data: [{ label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 6, k: 'star', c: 'pu' }], q: { ru: 'Сколько кристаллов?', uz: "Nechta kristall bor?" },
        opts: [{ ru: '6', uz: '6', ok: true }, { ru: '5', uz: '5', wrong: { ru: 'Посчитай картинки ещё раз по одной: их шесть.', uz: "Rasmlarni yana bittalab sanang: ular oltita." } }, { ru: '7', uz: '7', wrong: { ru: 'Посчитай внимательно: картинок шесть.', uz: "Diqqat bilan sanang: rasm oltita." } }],
        correct_text: { ru: 'Верно. Кристаллов шесть.', uz: "To'g'ri. Kristall oltita." } },
      { mode: 'picto', data: [{ label: { ru: 'Роботы', uz: 'Robotlar' }, n: 4, k: 'circle', c: 'gr' }], q: { ru: 'Сколько роботов?', uz: "Nechta robot bor?" },
        opts: [{ ru: '4', uz: '4', ok: true }, { ru: '3', uz: '3', wrong: { ru: 'Одна картинка — один робот. Их четыре.', uz: "Bitta rasm — bitta robot. Ular to'rtta." } }, { ru: '6', uz: '6', wrong: { ru: 'Посчитай по одной: роботов четыре.', uz: "Bittalab sanang: robot to'rtta." } }],
        correct_text: { ru: 'Верно. Роботов четыре.', uz: "To'g'ri. Robot to'rtta." } }
    ],
    audio: {
      intro: { ru: 'Посчитай картинки по одной и выбери число.', uz: "Rasmlarni bittalab sanang va sonni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ table (qiymat o'qish). distraktor = boshqa qator (M3).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Читай таблицу', uz: "Jadvalни o'qing" },
    rounds: [
      { mode: 'table', data: [{ label: { ru: 'Ящики', uz: 'Qutilar' }, n: 5 }, { label: { ru: 'Лампы', uz: 'Lampalar' }, n: 2 }, { label: { ru: 'Ключи', uz: 'Kalitlar' }, n: 7 }], q: { ru: 'Сколько ламп в таблице?', uz: "Jadvalда nechta lampa bor?" },
        opts: [{ ru: '2', uz: '2', ok: true }, { ru: '5', uz: '5', wrong: { ru: 'Пять — это ящики. Найди строку ламп: их два.', uz: "Besh — bu qutilar. Lampa qatorini toping: ular ikkita." } }, { ru: '7', uz: '7', wrong: { ru: 'Семь — это ключи. Ламп два.', uz: "Yetti — bu kalitlar. Lampa ikkita." } }],
        correct_text: { ru: 'Верно. Ламп два.', uz: "To'g'ri. Lampa ikkita." } },
      { mode: 'table', data: [{ label: { ru: 'Ящики', uz: 'Qutilar' }, n: 4 }, { label: { ru: 'Лампы', uz: 'Lampalar' }, n: 6 }, { label: { ru: 'Ключи', uz: 'Kalitlar' }, n: 3 }], q: { ru: 'Сколько ключей?', uz: "Nechta kalit bor?" },
        opts: [{ ru: '3', uz: '3', ok: true }, { ru: '4', uz: '4', wrong: { ru: 'Четыре — это ящики. Ключей три.', uz: "To'rt — bu qutilar. Kalit uchta." } }, { ru: '6', uz: '6', wrong: { ru: 'Шесть — это лампы. Ключей три.', uz: "Olti — bu lampalar. Kalit uchta." } }],
        correct_text: { ru: 'Верно. Ключей три.', uz: "To'g'ri. Kalit uchta." } }
    ],
    audio: {
      intro: { ru: 'Найди нужную строку и прочитай число рядом.', uz: "Kerakli qatorni toping va yonidagi sonni o'qing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ picto (solishtirish). distraktor = uzunlik/o'lcham (M2).
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Где больше?', uz: "Qaysi biri ko'p?" },
    rounds: [
      { mode: 'picto', data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 4, k: 'square', c: 'bl' }, { label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 6, k: 'star', c: 'pu' }], q: { ru: 'Чего больше?', uz: "Nima ko'p?" },
        opts: [{ ru: 'кристаллов', uz: 'kristall', ok: true }, { ru: 'кораблей', uz: 'kema', wrong: { ru: 'Посчитай: кораблей четыре, кристаллов шесть. Кристаллов больше.', uz: "Sanang: kema to'rtta, kristall oltita. Kristall ko'p." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Четыре и шесть не равны. Кристаллов больше.', uz: "To'rt va olti teng emas. Kristall ko'p." } }],
        correct_text: { ru: 'Верно. Кристаллов шесть — больше.', uz: "To'g'ri. Kristall oltita — ko'proq." } },
      { mode: 'picto', data: [{ label: { ru: 'Роботы', uz: 'Robotlar' }, n: 5, k: 'circle', c: 'gr' }, { label: { ru: 'Ящики', uz: 'Qutilar' }, n: 3, k: 'square', c: 'or' }], q: { ru: 'Чего больше?', uz: "Nima ko'p?" },
        opts: [{ ru: 'роботов', uz: 'robot', ok: true }, { ru: 'ящиков', uz: 'quti', wrong: { ru: 'Роботов пять, ящиков три. Роботов больше.', uz: "Robot beshta, quti uchta. Robot ko'p." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Пять и три не равны. Роботов больше.', uz: "Besh va uch teng emas. Robot ko'p." } }],
        correct_text: { ru: 'Верно. Роботов пять — больше.', uz: "To'g'ri. Robot beshta — ko'proq." } }
    ],
    audio: {
      intro: { ru: 'Посчитай каждый ряд и выбери, чего больше.', uz: "Har qatorni sanang va qaysi ko'p ekanini tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ table (jami). distraktor = hisob xato (M4).
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Сколько всего?', uz: "Jami nechta?" },
    rounds: [
      { mode: 'table', data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 4 }, { label: { ru: 'Роботы', uz: 'Robotlar' }, n: 3 }], q: { ru: 'Сколько всего кораблей и роботов?', uz: "Kema va robot jami nechta?" },
        opts: [{ ru: '7', uz: '7', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'Всего — это сложить: четыре плюс три — семь.', uz: "Jami — bu qo'shish: to'rt qo'shuv uch — yetti." } }, { ru: '43', uz: '43', wrong: { ru: 'Складывай значения: четыре плюс три — семь.', uz: "Qiymatlarni qo'shing: to'rt qo'shuv uch — yetti." } }],
        correct_text: { ru: 'Верно. Четыре плюс три — семь.', uz: "To'g'ri. To'rt qo'shuv uch — yetti." } },
      { mode: 'table', data: [{ label: { ru: 'Ящики', uz: 'Qutilar' }, n: 6 }, { label: { ru: 'Лампы', uz: 'Lampalar' }, n: 5 }], q: { ru: 'Сколько всего ящиков и ламп?', uz: "Quti va lampa jami nechta?" },
        opts: [{ ru: '11', uz: '11', ok: true }, { ru: '1', uz: '1', wrong: { ru: 'Всего — это сумма: шесть плюс пять — одиннадцать.', uz: "Jami — bu yig'indi: olti qo'shuv besh — o'n bir." } }, { ru: '65', uz: '65', wrong: { ru: 'Складывай значения: шесть плюс пять — одиннадцать.', uz: "Qiymatlarni qo'shing: olti qo'shuv besh — o'n bir." } }],
        correct_text: { ru: 'Верно. Шесть плюс пять — одиннадцать.', uz: "To'g'ri. Olti qo'shuv besh — o'n bir." } }
    ],
    audio: {
      intro: { ru: 'Сложи значения строк, чтобы узнать, сколько всего.', uz: "Jami nechta ekanini bilish uchun qator qiymatlarini qo'shing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ picto (ayirma: nechta ko'p). distraktor = M4.
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'На сколько больше?', uz: "Nechta ko'p?" },
    rounds: [
      { mode: 'picto', data: [{ label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 7, k: 'star', c: 'pu' }, { label: { ru: 'Корабли', uz: 'Kemalar' }, n: 4, k: 'square', c: 'bl' }], q: { ru: 'На сколько кристаллов больше, чем кораблей?', uz: "Kristall kemadan nechta ko'p?" },
        opts: [{ ru: '3', uz: '3', ok: true }, { ru: '11', uz: '11', wrong: { ru: 'На сколько больше — это вычесть: семь минус четыре — три.', uz: "Nechta ko'p — bu ayirish: yetti ayirish to'rt — uch." } }, { ru: '7', uz: '7', wrong: { ru: 'Семь — это все кристаллы. Разница семь минус четыре — три.', uz: "Yetti — bu barcha kristall. Farqi yetti ayirish to'rt — uch." } }],
        correct_text: { ru: 'Верно. Семь минус четыре — три.', uz: "To'g'ri. Yetti ayirish to'rt — uch." } },
      { mode: 'picto', data: [{ label: { ru: 'Роботы', uz: 'Robotlar' }, n: 8, k: 'circle', c: 'gr' }, { label: { ru: 'Ящики', uz: 'Qutilar' }, n: 5, k: 'square', c: 'or' }], q: { ru: 'На сколько роботов больше, чем ящиков?', uz: "Robot qutidan nechta ko'p?" },
        opts: [{ ru: '3', uz: '3', ok: true }, { ru: '13', uz: '13', wrong: { ru: 'На сколько больше — вычитаем: восемь минус пять — три.', uz: "Nechta ko'p — ayiramiz: sakkiz ayirish besh — uch." } }, { ru: '5', uz: '5', wrong: { ru: 'Пять — это ящики. Разница восемь минус пять — три.', uz: "Besh — bu qutilar. Farqi sakkiz ayirish besh — uch." } }],
        correct_text: { ru: 'Верно. Восемь минус пять — три.', uz: "To'g'ri. Sakkiz ayirish besh — uch." } }
    ],
    audio: {
      intro: { ru: 'На сколько больше — это разница. Вычти меньшее из большего.', uz: "Nechta ko'p — bu farq. Kattadan kichikni ayiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ table (ikki qatorni solishtir).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Читай таблицу', uz: "Jadvalни o'qing" },
    rounds: [
      { mode: 'table', data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 5 }, { label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 8 }, { label: { ru: 'Роботы', uz: 'Robotlar' }, n: 5 }], q: { ru: 'Чего больше всего?', uz: "Nima eng ko'p?" },
        opts: [{ ru: 'кристаллов', uz: 'kristall', ok: true }, { ru: 'кораблей', uz: 'kema', wrong: { ru: 'Кораблей пять, кристаллов восемь. Больше всего кристаллов.', uz: "Kema beshta, kristall sakkizta. Eng ko'p kristall." } }, { ru: 'роботов', uz: 'robot', wrong: { ru: 'Роботов пять, а кристаллов восемь. Больше кристаллов.', uz: "Robot beshta, kristall sakkizta. Kristall ko'p." } }],
        correct_text: { ru: 'Верно. Кристаллов восемь — больше всего.', uz: "To'g'ri. Kristall sakkizta — eng ko'p." } },
      { mode: 'table', data: [{ label: { ru: 'Ящики', uz: 'Qutilar' }, n: 7 }, { label: { ru: 'Лампы', uz: 'Lampalar' }, n: 2 }, { label: { ru: 'Ключи', uz: 'Kalitlar' }, n: 4 }], q: { ru: 'Чего меньше всего?', uz: "Nima eng kam?" },
        opts: [{ ru: 'ламп', uz: 'lampa', ok: true }, { ru: 'ящиков', uz: 'quti', wrong: { ru: 'Ящиков семь — это много. Меньше всего ламп, их два.', uz: "Quti yettita — bu ko'p. Eng kam lampa, ikkita." } }, { ru: 'ключей', uz: 'kalit', wrong: { ru: 'Ключей четыре, а ламп два. Меньше ламп.', uz: "Kalit to'rtta, lampa ikkita. Lampa kam." } }],
        correct_text: { ru: 'Верно. Ламп два — меньше всего.', uz: "To'g'ri. Lampa ikkita — eng kam." } }
    ],
    audio: {
      intro: { ru: 'Сравни числа в таблице и выбери ответ.', uz: "Jadvaldagi sonlarni solishtiring va javobni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ picto aralash.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Читай данные', uz: "Ma'lumotni o'qing" },
    rounds: [
      { mode: 'picto', data: [{ label: { ru: 'Ключи', uz: 'Kalitlar' }, n: 5, k: 'star', c: 'or' }], q: { ru: 'Сколько ключей?', uz: "Nechta kalit bor?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '4', uz: '4', wrong: { ru: 'Посчитай по одной: ключей пять.', uz: "Bittalab sanang: kalit beshta." } }, { ru: '6', uz: '6', wrong: { ru: 'Внимательно: картинок пять.', uz: "Diqqat bilan: rasm beshta." } }],
        correct_text: { ru: 'Верно. Ключей пять.', uz: "To'g'ri. Kalit beshta." } },
      { mode: 'picto', data: [{ label: { ru: 'Лампы', uz: 'Lampalar' }, n: 6, k: 'circle', c: 'or' }, { label: { ru: 'Ключи', uz: 'Kalitlar' }, n: 6, k: 'star', c: 'or' }], q: { ru: 'Чего больше?', uz: "Nima ko'p?" },
        opts: [{ ru: 'поровну', uz: 'teng', ok: true }, { ru: 'ламп', uz: 'lampa', wrong: { ru: 'Ламп шесть и ключей шесть. Их поровну.', uz: "Lampa oltita, kalit oltita. Ular teng." } }, { ru: 'ключей', uz: 'kalit', wrong: { ru: 'И тех, и других по шесть. Поровну.', uz: "Ikkalasidan ham oltitadan. Teng." } }],
        correct_text: { ru: 'Верно. Их поровну — по шесть.', uz: "To'g'ri. Ular teng — oltitadan." } },
      { mode: 'picto', data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 2, k: 'square', c: 'bl' }, { label: { ru: 'Роботы', uz: 'Robotlar' }, n: 5, k: 'circle', c: 'gr' }], q: { ru: 'На сколько роботов больше?', uz: "Robot nechta ko'p?" },
        opts: [{ ru: '3', uz: '3', ok: true }, { ru: '7', uz: '7', wrong: { ru: 'На сколько больше — вычитаем: пять минус два — три.', uz: "Nechta ko'p — ayiramiz: besh ayirish ikki — uch." } }, { ru: '2', uz: '2', wrong: { ru: 'Два — это корабли. Разница пять минус два — три.', uz: "Ikki — bu kema. Farqi besh ayirish ikki — uch." } }],
        correct_text: { ru: 'Верно. Пять минус два — три.', uz: "To'g'ri. Besh ayirish ikki — uch." } }
    ],
    audio: {
      intro: { ru: 'Читай пиктограмму, считай и сравнивай.', uz: "Piktogrammani o'qing, sanang va solishtiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Панель Бита.', uz: "Bit paneli." },
    audio: { ru: 'Бит смотрит на данные станции.', uz: "Bit stansiya ma'lumotlariga qaraydi." }
  },

  // s13 — MASALA (picto single): Bit zaxira panelida — kristall va kema.
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Запасы станции', uz: "Stansiya zaxirasi" },
    story: { ru: 'На панели Бита показаны запасы: кристаллы и корабли. Посчитай кристаллы.', uz: "Bit panelida zaxiralar ko'rsatilgan: kristall va kema. Kristallni sanang." },
    mode: 'picto',
    data: [{ label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 7, k: 'star', c: 'pu' }, { label: { ru: 'Корабли', uz: 'Kemalar' }, n: 3, k: 'square', c: 'bl' }],
    q: { ru: 'Сколько кристаллов на панели?', uz: "Panelда nechta kristall bor?" },
    opts: [
      { ru: '7', uz: '7', ok: true },
      { ru: '10', uz: '10', wrong: { ru: 'Десять — это всего. А кристаллов семь, посчитай их ряд.', uz: "O'n — bu jami. Kristall esa yettita, ularning qatorini sanang." } },
      { ru: '3', uz: '3', wrong: { ru: 'Три — это корабли. Кристаллов семь.', uz: "Uch — bu kema. Kristall yettita." } }
    ],
    correct_text: { ru: 'Верно. Кристаллов семь.', uz: "To'g'ri. Kristall yettita." },
    audio: {
      intro: { ru: 'На панели кристаллы и корабли. Посчитай кристаллы.', uz: "Panelда kristall va kema. Kristallni sanang." },
      on_correct: { ru: 'Верно. Кристаллов семь.', uz: "To'g'ri. Kristall yettita." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (aralash picto/table ×3 + FactCard Neptun).
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Данные', uz: "Ma'lumotlar" },
    rounds: [
      { mode: 'picto', data: [{ label: { ru: 'Роботы', uz: 'Robotlar' }, n: 5, k: 'circle', c: 'gr' }], q: { ru: 'Сколько роботов?', uz: "Nechta robot bor?" },
        opts: [{ ru: '5', uz: '5', ok: true }, { ru: '4', uz: '4', wrong: { ru: 'Посчитай по одной: роботов пять.', uz: "Bittalab sanang: robot beshta." } }, { ru: '6', uz: '6', wrong: { ru: 'Картинок пять.', uz: "Rasm beshta." } }],
        correct_text: { ru: 'Верно. Роботов пять.', uz: "To'g'ri. Robot beshta." } },
      { mode: 'table', data: [{ label: { ru: 'Корабли', uz: 'Kemalar' }, n: 6 }, { label: { ru: 'Кристаллы', uz: 'Kristallar' }, n: 3 }], q: { ru: 'Сколько всего?', uz: "Jami nechta?" },
        opts: [{ ru: '9', uz: '9', ok: true }, { ru: '3', uz: '3', wrong: { ru: 'Всего — сложи: шесть плюс три — девять.', uz: "Jami — qo'shing: olti qo'shuv uch — to'qqiz." } }, { ru: '63', uz: '63', wrong: { ru: 'Складывай значения: шесть плюс три — девять.', uz: "Qiymatlarni qo'shing: olti qo'shuv uch — to'qqiz." } }],
        correct_text: { ru: 'Верно. Всего девять.', uz: "To'g'ri. Jami to'qqiz." } },
      { mode: 'picto', data: [{ label: { ru: 'Ящики', uz: 'Qutilar' }, n: 6, k: 'square', c: 'or' }, { label: { ru: 'Лампы', uz: 'Lampalar' }, n: 4, k: 'circle', c: 'or' }], q: { ru: 'На сколько ящиков больше?', uz: "Quti nechta ko'p?" },
        opts: [{ ru: '2', uz: '2', ok: true }, { ru: '10', uz: '10', wrong: { ru: 'Разница — вычитаем: шесть минус четыре — два.', uz: "Farq — ayiramiz: olti ayirish to'rt — ikki." } }, { ru: '4', uz: '4', wrong: { ru: 'Четыре — это лампы. Разница шесть минус четыре — два.', uz: "To'rt — bu lampa. Farqi olti ayirish to'rt — ikki." } }],
        correct_text: { ru: 'Верно. Шесть минус четыре — два.', uz: "To'g'ri. Olti ayirish to'rt — ikki." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Нептун виден с Земли только в телескоп — так далеко он находится.', uz: "Neptun Yerdan faqat teleskopда ko'rinadi — u shunchalik uzoqda." },
    fact_audio: { ru: 'Нептун так далеко, что с Земли его видно только в телескоп.', uz: "Neptun shunchalik uzoqki, Yerdan uni faqat teleskopда ko'rish mumkin." },
    audio: {
      intro: { ru: 'Последняя проверка. Читай пиктограмму и таблицу.', uz: "Oxirgi tekshiruv. Piktogramma va jadvalни o'qing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi d.44 takrorlash)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь читать данные!', uz: "Endi siz ma'lumotlarni o'qiy olasiz!" },
    rule_recap: { ru: 'В пиктограмме считай картинки: одна картинка — одна единица. В таблице читай число рядом с названием.', uz: "Piktogrammada rasmlarni sanang: bitta rasm — bitta birlik. Jadvalда nom yonidagi sonni o'qing." },
    audio: {
      ru: 'Миссия выполнена. Мы научились читать данные. В пиктограмме одна картинка — одна единица, считай картинки. В таблице читай число рядом с названием. Так можно сравнивать и складывать. Дальше повторим всё пройденное.',
      uz: "Missiya bajarildi. Ma'lumotlarni o'qishni o'rgandik. Piktogrammada bitta rasm — bitta birlik, rasmlarni sanang. Jadvalда nom yonidagi sonni o'qing. Shunday qilib solishtirish va qo'shish mumkin. Keyin o'tganlarni takrorlaymiz."
    }
  }
};
```

## Ekran-mexanika (jsx-builder)
| ekran | mode | vizual |
|---|---|---|
| s0 | hook | Pictogram (kema 3) |
| s1 | picto teach | Pictogram (kristall 5) |
| s2 | picto teach | 2 qator solishtirish |
| s3 | rule+check | Pictogram (robot 4) |
| s4 | table teach+warn | DataTable 3 qator |
| sTBL | KALIT | picto + jadval |
| s5/s7/s9/s11 | picto | Pictogram |
| s6/s8/s10 | table | DataTable |
| s13 | picto masala | 2 kategoriya |
| s14 | mix + FactCard | picto/table |
| s15 | summary | NeptunField |
