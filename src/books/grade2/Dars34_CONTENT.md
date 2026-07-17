# Dars34 — CONTENT (Б6 NEPTUN · «Ulush (доли): butunning qismi» · program d.37)

> **Mexanika (metodist 2026-07-17): BO'LAK-BO'YASH** — butunni N ta TENG qismga bo'l, bittasini bo'ya → «bir Ndan».
> Klon-baza: **Dars33.jsx** (Neptun biom + siz-registr). Yangi: `ShareFig` (shakl→N teng qism, k bo'yalgan; `equal:false`→teng emas) +
> `NameStage` (bo'yalgan ulushni nomla) · `PickShapeStage` (nomga mos shakl) · `EqualCheckStage` (teng qismmi?) · `CompareStage` (qaysi katta).
> FAQAT birlik ulush (N dan 1). Butun=1. N=2,3,4 (s14/case da 6 gacha). «Kasr/maxraj» atamasi YO'Q.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **UZ atamalar (draft, Notion MCP uzuq — Xaydarov solishtirmadi):** ulush = доля/qism; `bir ikkidan`=1/2, `bir uchdan`=1/3,
   `bir to'rtdan`=1/4, `bir beshdan`=1/5, `bir oltidan`=1/6. **`bir Ndan` vs `Ndan bir` tartibi — validatsiya kerak** (audio_rules
   namunasida `bir ikkidan` edi). `yarim` (1/2 uchun) — ishlataymi yoki faqat `bir ikkidan`? Hozir `bir ikkidan` + s0 da `yarim` ma'nosi.
2. **Faqat birlik ulush** (N dan 1). Ulush qo'shish YO'Q, `2/3` YO'Q.
3. Misconception M2 (asosiy): ko'proq qism = kattaroq ulush. s4 warn + s9 CompareStage bevosita uradi.

---

```javascript
const CONTENT = {
  // s0 — HOOK: shokolad 2 TENG BO'LMAGAN qismga bo'lingan; katta bo'lak «yarim»mi? To'g'ri = Yo'q (ulush teng bo'ladi).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Доли', uz: "Mavzu: Ulushlar" },
    lead: { ru: 'Это половина?', uz: "Bu yarimmi?" },
    q: { ru: 'Шоколадку разломили на две неравные части. Большой кусок — это половина?', uz: "Shokoladni ikkita teng bo'lmagan qismga sindirishdi. Katta bo'lak — bu yarimmi?" },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы всё ещё на станции у Нептуна. Экипаж делит паёк.',
          'Шоколадку разломили на две части. Но части получились разные: одна большая, другая маленькая.',
          'Кто-то говорит: большой кусок — это половина. Как думаешь, это верно?',
          'Послушай ответы: да или нет. Или ты пока не знаешь. Выбери свой ответ.'
        ],
        uz: [
          "Hali ham Neptun yonidagi stansiyadamiz. Ekipaj paykni bo'lmoqda.",
          "Shokoladni ikki qismga sindirishdi. Ammo qismlar har xil bo'ldi: biri katta, biri kichik.",
          "Kimdir aytadi: katta bo'lak — bu yarim. Sizningcha, bu to'g'rimi?",
          "Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz. O'z javobingizni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Половина — это когда обе части равные. А тут они разные.', uz: "To'g'ri. Yarim — bu ikkala qism teng bo'lganda. Bu yerda esa ular har xil." },
      on_wrong: { ru: 'Половина бывает, только когда части равные. Сейчас разберём.', uz: "Yarim faqat qismlar teng bo'lganda bo'ladi. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня разберём доли — равные части целого.', uz: "Hechqisi yo'q. Bugun ulushlarni o'rganamiz — butunning teng qismlari." }
    }
  },

  // s1 — TUSHUNTIRISH-1: ShareFig. Butun → 3 teng qism, 1 bo'yalgan → bir uchdan. Teng qism sharti. 4 seg step-reveal.
  s1: {
    eyebrow: { ru: 'Доля', uz: 'Ulush' },
    lead: { ru: 'Равные части целого', uz: "Butunning teng qismlari" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Доля — это одна из равных частей целого. Части обязательно равны.', uz: "Ulush — bu butunning teng qismlaridan biri. Qismlar albatta teng." },
    audio: {
      ru: [
        'Возьмём целую лепёшку. Разделим её на три равные части.',
        'Части получились одинаковые, поровну.',
        'Закрасим одну часть. Это одна из трёх равных частей — одна третья.',
        'Одна третья — это доля. Доля бывает только из равных частей.'
      ],
      uz: [
        "Butun bir non olamiz. Uni uchta teng qismga bo'lamiz.",
        "Qismlar bir xil, teng bo'ldi.",
        "Bitta qismni bo'yaymiz. Bu — uchta teng qismdan biri — bir uchdan.",
        "Bir uchdan — bu ulush. Ulush faqat teng qismlardan bo'ladi."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: turli N → bir ikkidan / bir uchdan / bir to'rtdan (nomlash). 4 seg.
  s2: {
    eyebrow: { ru: 'Название', uz: 'Nomlash' },
    lead: { ru: 'Как называется доля', uz: "Ulush qanday nomlanadi" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'На сколько равных частей поделили — так и называется одна часть.', uz: "Nechta teng qismga bo'linsa — bitta qism shunday nomlanadi." },
    audio: {
      ru: [
        'Поделим целое на две равные части. Одна часть — одна вторая.',
        'Поделим на три равные части. Одна часть — одна третья.',
        'Поделим на четыре равные части. Одна часть — одна четвёртая.',
        'Смотри: на сколько равных частей поделили, так и называется одна доля.'
      ],
      uz: [
        "Butunni ikkita teng qismga bo'lamiz. Bitta qism — bir ikkidan.",
        "Uchta teng qismga bo'lamiz. Bitta qism — bir uchdan.",
        "To'rtta teng qismga bo'lamiz. Bitta qism — bir to'rtdan.",
        "Qarang: nechta teng qismga bo'linsa, bitta ulush shunday nomlanadi."
      ]
    }
  },

  // s3 — QOIDA: teng qismlar sonini sana (N), bittasini bo'ya → bir Ndan + check (4 teng qism, 1 bo'yalgan → bir to'rtdan).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Посчитай, на сколько равных частей поделили целое. Одна такая часть — это одна доля.', uz: "Butun nechta teng qismga bo'linganini sanang. Shunday bitta qism — bu bitta ulush." },
    fig: { shape: 'circle', parts: 4, shaded: 1 },
    check_q: { ru: 'Круг поделён на четыре равные части, одна закрашена. Какая это доля?', uz: "Doira to'rtta teng qismga bo'lingan, bittasi bo'yalgan. Bu qanday ulush?" },
    opts: [{ ru: 'одна четвёртая', uz: "bir to'rtdan", ok: true }, { ru: 'одна первая', uz: 'bir birdan' }, { ru: 'четыре', uz: "to'rt" }],
    wrong: { ru: 'Посчитай все равные части: их четыре. Одна из четырёх — одна четвёртая.', uz: "Barcha teng qismlarni sanang: ular to'rtta. To'rttadan biri — bir to'rtdan." },
    check_ok: { ru: 'Верно! Четыре равные части, одна из них — одна четвёртая.', uz: "To'g'ri! To'rtta teng qism, ulardan biri — bir to'rtdan." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Посчитай, на сколько равных частей поделили целое.',
        'Одна такая равная часть — это одна доля.',
        'Проверь. Круг поделён на четыре равные части, одна закрашена. Какая это доля?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Butun nechta teng qismga bo'linganini sanang.",
        "Shunday bitta teng qism — bu bitta ulush.",
        "Tekshiring. Doira to'rtta teng qismga bo'lingan, bittasi bo'yalgan. Bu qanday ulush?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (SOLISHTIRISH + WARN): ko'proq qism → har biri KICHIKROQ. bir ikkidan > bir to'rtdan.
  // warn: bir uchdan > bir ikkidan EMAS. check: qaysi katta — bir ikkidan yoki bir to'rtdan?
  s4: {
    eyebrow: { ru: 'Сравнение', uz: 'Solishtirish' },
    lead: { ru: 'Больше частей — меньше доля', uz: "Ko'proq qism — kichikroq ulush" },
    figA: { shape: 'circle', parts: 2, shaded: 1 },
    figB: { shape: 'circle', parts: 4, shaded: 1 },
    warn: { ru: 'Не путай: одна третья не больше одной второй. Чем больше частей, тем каждая меньше.', uz: "Chalkashtirmang: bir uchdan bir ikkidandan katta emas. Qism qancha ko'p bo'lsa, har biri shuncha kichik." },
    check_q: { ru: 'Что больше: одна вторая или одна четвёртая?', uz: "Qaysi biri katta: bir ikkidan yoki bir to'rtdan?" },
    opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'одна четвёртая', uz: "bir to'rtdan" }, { ru: 'равны', uz: 'teng' }],
    wrong: { ru: 'Посмотри на картинки: при делении на две части кусок больше, чем при делении на четыре.', uz: "Rasmlarga qarang: ikkiga bo'lganda bo'lak to'rtga bo'lgandan katta." },
    check_ok: { ru: 'Верно! Одна вторая больше: частей меньше — значит каждая крупнее.', uz: "To'g'ri! Bir ikkidan katta: qism kamroq — demak har biri yirikroq." },
    audio: {
      ru: [
        'Сравним доли. Слева целое поделили на две части, справа — на четыре.',
        'Видишь: если частей больше, то каждая часть меньше.',
        'Одна вторая больше, чем одна четвёртая. Не одна четвёртая.',
        'Проверь. Что больше: одна вторая или одна четвёртая?'
      ],
      uz: [
        "Ulushlarni solishtiramiz. Chapda butun ikki qismga, o'ngda — to'rt qismga bo'lingan.",
        "Ko'ryapsizmi: qism ko'p bo'lsa, har bir qism kichikroq.",
        "Bir ikkidan bir to'rtdandan katta. Bir to'rtdan emas.",
        "Tekshiring. Qaysi biri katta: bir ikkidan yoki bir to'rtdan?"
      ]
    }
  },

  // sTBL — KALIT: butun · qismlar soni · bo'yalgan · nom (bir ikkidan / uchdan / to'rtdan). done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Считаем равные части', uz: "Teng qismlarni sanaymiz" },
    caption: { ru: 'Целое · равных частей · доля', uz: "Butun · teng qism · ulush" },
    rows: [{ shape: 'bar', parts: 2, shaded: 1 }, { shape: 'bar', parts: 3, shaded: 1 }, { shape: 'bar', parts: 4, shaded: 1 }],
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Сначала проверь, что части равны. Потом посчитай их и назови долю.', uz: "Avval qismlar tengligini tekshiring. Keyin ularni sanang va ulushni nomlang." },
    audio: {
      ru: [
        'Соберём ключ. В каждой строке — целое, поделённое на равные части.',
        'Две части — одна вторая. Три части — одна третья.',
        'Четыре части — одна четвёртая. Сначала проверь, что части равны.'
      ],
      uz: [
        "Kalitni yig'amiz. Har qatorda — teng qismlarga bo'lingan butun.",
        "Ikki qism — bir ikkidan. Uch qism — bir uchdan.",
        "To'rt qism — bir to'rtdan. Avval qismlar tengligini tekshiring."
      ]
    }
  },

  // s5 — MASHQ NameStage: bo'yalgan ulushni nomla. distraktor = qism soni (M3), noto'g'ri N.
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Назови долю', uz: "Ulushni nomlang" },
    fig: { shape: 'circle', parts: 3, shaded: 1 },
    q: { ru: 'Круг поделён на три равные части, одна закрашена. Какая это доля?', uz: "Doira uchta teng qismga bo'lingan, bittasi bo'yalgan. Bu qanday ulush?" },
    opts: [
      { ru: 'три', uz: 'uch', wrong: { ru: 'Три — это число всех частей, а не название доли. Одна из трёх — одна третья.', uz: "Uch — bu barcha qismlar soni, ulush nomi emas. Uchtadan biri — bir uchdan." } },
      { ru: 'одна третья', uz: 'bir uchdan', ok: true },
      { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Одна вторая — это когда частей две. А тут частей три. Значит, одна третья.', uz: "Bir ikkidan — bu qism ikkita bo'lganda. Bu yerda esa uchta. Demak, bir uchdan." } }
    ],
    correct_text: { ru: 'Верно. Три равные части — одна из них одна третья.', uz: "To'g'ri. Uchta teng qism — ulardan biri bir uchdan." },
    audio: {
      intro: { ru: 'Круг поделён на три равные части, одна закрашена. Назови долю.', uz: "Doira uchta teng qismga bo'lingan, bittasi bo'yalgan. Ulushni nomlang." },
      on_correct: { ru: 'Верно. Одна третья.', uz: "To'g'ri. Bir uchdan." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ PickShapeStage: nomga mos shaklni tanla (bir to'rtdan). distraktor = teng bo'lmagan, boshqa N.
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Выбери фигуру', uz: "Shaklni tanlang" },
    rounds: [
      { name: { ru: 'одна четвёртая', uz: "bir to'rtdan" }, q: { ru: 'Где закрашена одна четвёртая?', uz: "Qayerda bir to'rtdan bo'yalgan?" },
        choices: [{ shape: 'circle', parts: 4, shaded: 1, equal: true, ok: true }, { shape: 'circle', parts: 4, shaded: 1, equal: false }, { shape: 'circle', parts: 3, shaded: 1, equal: true }],
        wrong: { ru: 'Одна четвёртая — это одна из четырёх равных частей. Проверь: частей четыре и они равны.', uz: "Bir to'rtdan — bu to'rtta teng qismdan biri. Tekshiring: qism to'rtta va ular teng." },
        correct_text: { ru: 'Верно. Четыре равные части, закрашена одна.', uz: "To'g'ri. To'rtta teng qism, bittasi bo'yalgan." } },
      { name: { ru: 'одна вторая', uz: 'bir ikkidan' }, q: { ru: 'Где закрашена одна вторая?', uz: "Qayerda bir ikkidan bo'yalgan?" },
        choices: [{ shape: 'bar', parts: 2, shaded: 1, equal: true, ok: true }, { shape: 'bar', parts: 2, shaded: 1, equal: false }, { shape: 'bar', parts: 3, shaded: 1, equal: true }],
        wrong: { ru: 'Одна вторая — это одна из двух равных частей. Части должны быть одинаковыми.', uz: "Bir ikkidan — bu ikkita teng qismdan biri. Qismlar bir xil bo'lishi kerak." },
        correct_text: { ru: 'Верно. Две равные части, закрашена одна.', uz: "To'g'ri. Ikkita teng qism, bittasi bo'yalgan." } },
      { name: { ru: 'одна третья', uz: 'bir uchdan' }, q: { ru: 'Где закрашена одна третья?', uz: "Qayerda bir uchdan bo'yalgan?" },
        choices: [{ shape: 'rect', parts: 3, shaded: 1, equal: true, ok: true }, { shape: 'rect', parts: 4, shaded: 1, equal: true }, { shape: 'rect', parts: 3, shaded: 1, equal: false }],
        wrong: { ru: 'Одна третья — это одна из трёх равных частей. Посчитай части и проверь равенство.', uz: "Bir uchdan — bu uchta teng qismdan biri. Qismlarni sanang va tengligini tekshiring." },
        correct_text: { ru: 'Верно. Три равные части, закрашена одна.', uz: "To'g'ri. Uchta teng qism, bittasi bo'yalgan." } }
    ],
    audio: {
      intro: { ru: 'Выбери фигуру, где закрашена нужная доля. Части должны быть равными.', uz: "Kerakli ulush bo'yalgan shaklni tanlang. Qismlar teng bo'lishi kerak." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ EqualCheckStage: teng qismmi (ulushmi)? Ha/Yo'q. M1 (teng bo'lmagan ham ulush).
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Это доля?', uz: "Bu ulushmi?" },
    rounds: [
      { fig: { shape: 'circle', parts: 3, shaded: 1, equal: false }, q: { ru: 'Части равны? Можно назвать это долей?', uz: "Qismlar tengmi? Buni ulush deyish mumkinmi?" }, answer: false,
        wrong: { ru: 'Части разные по размеру. Доля бывает только из равных частей.', uz: "Qismlar o'lchami har xil. Ulush faqat teng qismlardan bo'ladi." },
        correct_text: { ru: 'Верно. Части неравные — это не доля.', uz: "To'g'ri. Qismlar teng emas — bu ulush emas." } },
      { fig: { shape: 'bar', parts: 4, shaded: 1, equal: true }, q: { ru: 'Части равны? Можно назвать это долей?', uz: "Qismlar tengmi? Buni ulush deyish mumkinmi?" }, answer: true,
        wrong: { ru: 'Посмотри: все четыре части одинаковые. Значит, это доля.', uz: "Qarang: to'rtta qism bir xil. Demak, bu ulush." },
        correct_text: { ru: 'Верно. Части равные — это доля, одна четвёртая.', uz: "To'g'ri. Qismlar teng — bu ulush, bir to'rtdan." } },
      { fig: { shape: 'rect', parts: 2, shaded: 1, equal: false }, q: { ru: 'Части равны? Можно назвать это долей?', uz: "Qismlar tengmi? Buni ulush deyish mumkinmi?" }, answer: false,
        wrong: { ru: 'Один кусок больше другого. Половина бывает только из двух равных частей.', uz: "Bir bo'lak ikkinchisidan katta. Yarim faqat ikkita teng qismdan bo'ladi." },
        correct_text: { ru: 'Верно. Части неравные — это не половина.', uz: "To'g'ri. Qismlar teng emas — bu yarim emas." } }
    ],
    audio: {
      intro: { ru: 'Посмотри на части. Они равные? Можно ли назвать это долей?', uz: "Qismlarga qarang. Ular tengmi? Buni ulush deyish mumkinmi?" },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ NameStage: boshqa N (bar/2, rect/4, circle/6). distraktor M3 + noto'g'ri N.
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Назови долю', uz: "Ulushni nomlang" },
    rounds: [
      { fig: { shape: 'bar', parts: 2, shaded: 1 }, q: { ru: 'Лента поделена на две равные части, одна закрашена. Какая доля?', uz: "Tasma ikkita teng qismga bo'lingan, bittasi bo'yalgan. Qanday ulush?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'две', uz: 'ikki', wrong: { ru: 'Две — это число частей, а не доля. Одна из двух — одна вторая.', uz: "Ikki — bu qismlar soni, ulush emas. Ikkitadan biri — bir ikkidan." } }, { ru: 'одна четвёртая', uz: "bir to'rtdan", wrong: { ru: 'Одна четвёртая — когда частей четыре. Здесь их две. Значит одна вторая.', uz: "Bir to'rtdan — qism to'rtta bo'lganda. Bu yerda ikkita. Demak bir ikkidan." } }],
        correct_text: { ru: 'Верно. Две равные части — одна вторая.', uz: "To'g'ri. Ikkita teng qism — bir ikkidan." } },
      { fig: { shape: 'rect', parts: 4, shaded: 1 }, q: { ru: 'Прямоугольник поделён на четыре равные части, одна закрашена. Какая доля?', uz: "To'rtburchak to'rtta teng qismga bo'lingan, bittasi bo'yalgan. Qanday ulush?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', wrong: { ru: 'Одна третья — когда частей три. Посчитай: тут их четыре. Одна четвёртая.', uz: "Bir uchdan — qism uchta bo'lganda. Sanang: bu yerda to'rtta. Bir to'rtdan." } }, { ru: 'одна четвёртая', uz: "bir to'rtdan", ok: true }, { ru: 'четыре', uz: "to'rt", wrong: { ru: 'Четыре — число частей, а не доля. Одна из четырёх — одна четвёртая.', uz: "To'rt — qismlar soni, ulush emas. To'rttadan biri — bir to'rtdan." } }],
        correct_text: { ru: 'Верно. Четыре равные части — одна четвёртая.', uz: "To'g'ri. To'rtta teng qism — bir to'rtdan." } },
      { fig: { shape: 'circle', parts: 6, shaded: 1 }, q: { ru: 'Круг поделён на шесть равных частей, одна закрашена. Какая доля?', uz: "Doira oltita teng qismga bo'lingan, bittasi bo'yalgan. Qanday ulush?" },
        opts: [{ ru: 'одна шестая', uz: 'bir oltidan', ok: true }, { ru: 'шесть', uz: 'olti', wrong: { ru: 'Шесть — число частей, а не доля. Одна из шести — одна шестая.', uz: "Olti — qismlar soni, ulush emas. Oltitadan biri — bir oltidan." } }, { ru: 'одна пятая', uz: 'bir beshdan', wrong: { ru: 'Посчитай части ещё раз: их шесть. Значит одна шестая.', uz: "Qismlarni yana sanang: ular oltita. Demak bir oltidan." } }],
        correct_text: { ru: 'Верно. Шесть равных частей — одна шестая.', uz: "To'g'ri. Oltita teng qism — bir oltidan." } }
    ],
    audio: {
      intro: { ru: 'Посчитай равные части и назови долю.', uz: "Teng qismlarni sanang va ulushni nomlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ CompareStage: qaysi katta — ikki ulush. M2 (asosiy): kichik N = katta ulush.
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Что больше?', uz: "Qaysi biri katta?" },
    rounds: [
      { a: 2, b: 4, q: { ru: 'Что больше: одна вторая или одна четвёртая?', uz: "Qaysi biri katta: bir ikkidan yoki bir to'rtdan?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'одна четвёртая', uz: "bir to'rtdan", wrong: { ru: 'Наоборот: частей четыре — каждая меньше. Одна вторая больше.', uz: "Aksincha: qism to'rtta — har biri kichik. Bir ikkidan katta." } }, { ru: 'равны', uz: 'teng', wrong: { ru: 'Они не равны: чем меньше частей, тем каждая крупнее.', uz: "Ular teng emas: qism kam bo'lsa, har biri yirikroq." } }],
        correct_text: { ru: 'Верно. Одна вторая больше одной четвёртой.', uz: "To'g'ri. Bir ikkidan bir to'rtdandan katta." } },
      { a: 3, b: 2, q: { ru: 'Что больше: одна третья или одна вторая?', uz: "Qaysi biri katta: bir uchdan yoki bir ikkidan?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'одна третья', uz: 'bir uchdan', wrong: { ru: 'Частей три — каждая меньше, чем при двух. Одна вторая больше.', uz: "Qism uchta — har biri ikkitagidan kichik. Bir ikkidan katta." } }, { ru: 'равны', uz: 'teng', wrong: { ru: 'Не равны: две части крупнее, чем три.', uz: "Teng emas: ikki qism uch qismdan yirikroq." } }],
        correct_text: { ru: 'Верно. Одна вторая больше одной третьей.', uz: "To'g'ri. Bir ikkidan bir uchdandan katta." } },
      { a: 3, b: 6, q: { ru: 'Что больше: одна третья или одна шестая?', uz: "Qaysi biri katta: bir uchdan yoki bir oltidan?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', ok: true }, { ru: 'одна шестая', uz: 'bir oltidan', wrong: { ru: 'Частей шесть — каждая меньше. Одна третья больше.', uz: "Qism oltita — har biri kichik. Bir uchdan katta." } }, { ru: 'равны', uz: 'teng', wrong: { ru: 'Не равны: три части крупнее шести.', uz: "Teng emas: uch qism olti qismdan yirikroq." } }],
        correct_text: { ru: 'Верно. Одна третья больше одной шестой.', uz: "To'g'ri. Bir uchdan bir oltidandan katta." } }
    ],
    audio: {
      intro: { ru: 'Посмотри на две доли. Что больше?', uz: "Ikki ulushga qarang. Qaysi biri katta?" },
      on_correct: { ru: 'Верно. Меньше частей — крупнее доля.', uz: "To'g'ri. Qism kam — ulush yirik." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ PickShapeStage: nomga mos shakl (aralash). distraktor teng emas / boshqa N.
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Выбери фигуру', uz: "Shaklni tanlang" },
    rounds: [
      { name: { ru: 'одна третья', uz: 'bir uchdan' }, q: { ru: 'Где закрашена одна третья?', uz: "Qayerda bir uchdan bo'yalgan?" },
        choices: [{ shape: 'circle', parts: 3, shaded: 1, equal: true, ok: true }, { shape: 'circle', parts: 2, shaded: 1, equal: true }, { shape: 'circle', parts: 3, shaded: 1, equal: false }],
        wrong: { ru: 'Нужны три равные части, одна закрашена. Проверь количество и равенство.', uz: "Uchta teng qism kerak, bittasi bo'yalgan. Sonini va tengligini tekshiring." },
        correct_text: { ru: 'Верно. Три равные части.', uz: "To'g'ri. Uchta teng qism." } },
      { name: { ru: 'одна шестая', uz: 'bir oltidan' }, q: { ru: 'Где закрашена одна шестая?', uz: "Qayerda bir oltidan bo'yalgan?" },
        choices: [{ shape: 'bar', parts: 6, shaded: 1, equal: true, ok: true }, { shape: 'bar', parts: 4, shaded: 1, equal: true }, { shape: 'bar', parts: 6, shaded: 1, equal: false }],
        wrong: { ru: 'Одна шестая — одна из шести равных частей. Посчитай части.', uz: "Bir oltidan — oltita teng qismdan biri. Qismlarni sanang." },
        correct_text: { ru: 'Верно. Шесть равных частей.', uz: "To'g'ri. Oltita teng qism." } },
      { name: { ru: 'одна вторая', uz: 'bir ikkidan' }, q: { ru: 'Где закрашена одна вторая?', uz: "Qayerda bir ikkidan bo'yalgan?" },
        choices: [{ shape: 'rect', parts: 2, shaded: 1, equal: true, ok: true }, { shape: 'rect', parts: 2, shaded: 1, equal: false }, { shape: 'rect', parts: 4, shaded: 1, equal: true }],
        wrong: { ru: 'Одна вторая — две равные части. Куски должны быть одинаковыми.', uz: "Bir ikkidan — ikkita teng qism. Bo'laklar bir xil bo'lishi kerak." },
        correct_text: { ru: 'Верно. Две равные части.', uz: "To'g'ri. Ikkita teng qism." } }
    ],
    audio: {
      intro: { ru: 'Выбери фигуру с нужной долей. Части должны быть равными.', uz: "Kerakli ulushli shaklni tanlang. Qismlar teng bo'lishi kerak." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ NameStage aralash (doira/lenta/to'rtburchak). distraktor M3 + noto'g'ri N.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Назови долю', uz: "Ulushni nomlang" },
    rounds: [
      { fig: { shape: 'rect', parts: 3, shaded: 1 }, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', ok: true }, { ru: 'три', uz: 'uch', wrong: { ru: 'Три — число частей, а не доля. Одна из трёх — одна третья.', uz: "Uch — qismlar soni, ulush emas. Uchtadan biri — bir uchdan." } }, { ru: 'одна четвёртая', uz: "bir to'rtdan", wrong: { ru: 'Частей три, а не четыре. Значит одна третья.', uz: "Qism uchta, to'rtta emas. Demak bir uchdan." } }],
        correct_text: { ru: 'Верно. Три равные части — одна третья.', uz: "To'g'ri. Uchta teng qism — bir uchdan." } },
      { fig: { shape: 'circle', parts: 2, shaded: 1 }, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'одна третья', uz: 'bir uchdan', wrong: { ru: 'Частей две, а не три. Значит одна вторая.', uz: "Qism ikkita, uchta emas. Demak bir ikkidan." } }, { ru: 'две', uz: 'ikki', wrong: { ru: 'Две — число частей. Одна из двух — одна вторая.', uz: "Ikki — qismlar soni. Ikkitadan biri — bir ikkidan." } }],
        correct_text: { ru: 'Верно. Две равные части — одна вторая.', uz: "To'g'ri. Ikkita teng qism — bir ikkidan." } },
      { fig: { shape: 'bar', parts: 4, shaded: 1 }, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна четвёртая', uz: "bir to'rtdan", ok: true }, { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Частей четыре, а не две. Значит одна четвёртая.', uz: "Qism to'rtta, ikkita emas. Demak bir to'rtdan." } }, { ru: 'четыре', uz: "to'rt", wrong: { ru: 'Четыре — число частей. Одна из четырёх — одна четвёртая.', uz: "To'rt — qismlar soni. To'rttadan biri — bir to'rtdan." } }],
        correct_text: { ru: 'Верно. Четыре равные части — одна четвёртая.', uz: "To'g'ri. To'rtta teng qism — bir to'rtdan." } }
    ],
    audio: {
      intro: { ru: 'Посчитай равные части и назови долю.', uz: "Teng qismlarni sanang va ulushni nomlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Экипаж делит паёк.', uz: "Ekipaj paykni bo'ladi." },
    audio: { ru: 'Бит делит паёк на равные части.', uz: "Bit paykni teng qismlarga bo'ladi." }
  },

  // s13 — MASALA (NameStage single): Bit pitsani 4 teng qismga bo'ldi → bir to'rtdan.
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Паёк на четверых', uz: "Payk to'rt kishiga" },
    story: { ru: 'Бит делит круглую лепёшку поровну на четверых членов экипажа. Какая доля достанется каждому?', uz: "Bit yumaloq nonni to'rt ekipaj a'zosiga teng bo'ladi. Har biriga qanday ulush tegadi?" },
    fig: { shape: 'circle', parts: 4, shaded: 1 },
    q: { ru: 'Лепёшку поделили на четыре равные части. Сколько достанется одному?', uz: "Non to'rtta teng qismga bo'lindi. Bittasiga qancha tegadi?" },
    opts: [
      { ru: 'одна четвёртая', uz: "bir to'rtdan", ok: true },
      { ru: 'четыре', uz: "to'rt", wrong: { ru: 'Четыре — это на сколько поделили. А одному достанется одна из четырёх — одна четвёртая.', uz: "To'rt — bu nechaga bo'linganini bildiradi. Bittasiga esa to'rttadan biri — bir to'rtdan tegadi." } },
      { ru: 'одна вторая', uz: 'bir ikkidan', wrong: { ru: 'Одна вторая — если бы делили на двоих. А тут четверо. Значит одна четвёртая.', uz: "Bir ikkidan — ikki kishiga bo'lganda bo'lardi. Bu yerda to'rt kishi. Demak bir to'rtdan." } }
    ],
    correct_text: { ru: 'Верно. Четыре равные части, каждому — одна четвёртая.', uz: "To'g'ri. To'rtta teng qism, har biriga — bir to'rtdan." },
    audio: {
      intro: { ru: 'Бит делит круглую лепёшку поровну на четверых. Какая доля достанется одному?', uz: "Bit yumaloq nonni to'rt kishiga teng bo'ladi. Bittasiga qanday ulush tegadi?" },
      on_correct: { ru: 'Верно. Каждому — одна четвёртая.', uz: "To'g'ri. Har biriga — bir to'rtdan." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (NameStage ×3 + FactCard Neptun): bar/2, circle/3, rect/6.
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Назови долю', uz: "Ulushni nomlang" },
    rounds: [
      { fig: { shape: 'bar', parts: 2, shaded: 1 }, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна вторая', uz: 'bir ikkidan', ok: true }, { ru: 'две', uz: 'ikki', wrong: { ru: 'Две — число частей. Одна из двух — одна вторая.', uz: "Ikki — qismlar soni. Ikkitadan biri — bir ikkidan." } }, { ru: 'одна третья', uz: 'bir uchdan', wrong: { ru: 'Частей две, значит одна вторая.', uz: "Qism ikkita, demak bir ikkidan." } }],
        correct_text: { ru: 'Верно. Одна вторая.', uz: "To'g'ri. Bir ikkidan." } },
      { fig: { shape: 'circle', parts: 3, shaded: 1 }, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна третья', uz: 'bir uchdan', ok: true }, { ru: 'одна четвёртая', uz: "bir to'rtdan", wrong: { ru: 'Частей три, а не четыре. Одна третья.', uz: "Qism uchta, to'rtta emas. Bir uchdan." } }, { ru: 'три', uz: 'uch', wrong: { ru: 'Три — число частей. Одна из трёх — одна третья.', uz: "Uch — qismlar soni. Uchtadan biri — bir uchdan." } }],
        correct_text: { ru: 'Верно. Одна третья.', uz: "To'g'ri. Bir uchdan." } },
      { fig: { shape: 'rect', parts: 6, shaded: 1 }, q: { ru: 'Какая доля закрашена?', uz: "Qanday ulush bo'yalgan?" },
        opts: [{ ru: 'одна шестая', uz: 'bir oltidan', ok: true }, { ru: 'шесть', uz: 'olti', wrong: { ru: 'Шесть — число частей. Одна из шести — одна шестая.', uz: "Olti — qismlar soni. Oltitadan biri — bir oltidan." } }, { ru: 'одна пятая', uz: 'bir beshdan', wrong: { ru: 'Посчитай ещё раз: частей шесть. Одна шестая.', uz: "Yana sanang: qism oltita. Bir oltidan." } }],
        correct_text: { ru: 'Верно. Одна шестая.', uz: "To'g'ri. Bir oltidan." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Год на Нептуне длится почти сто шестьдесят пять земных лет — так далеко он от Солнца.', uz: "Neptunda bir yil deyarli bir yuz oltmish besh Yer yiliga cho'ziladi — u Quyoshdan shunchalik uzoq." },
    fact_audio: { ru: 'Год на Нептуне длится почти сто шестьдесят пять земных лет. Так далеко он от Солнца.', uz: "Neptunda bir yil deyarli bir yuz oltmish besh Yer yiliga cho'ziladi. U Quyoshdan shunchalik uzoq." },
    audio: {
      intro: { ru: 'Последняя проверка. Посчитай равные части и назови долю.', uz: "Oxirgi tekshiruv. Teng qismlarni sanang va ulushni nomlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi: vaqt d.38)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь находить и называть доли!', uz: "Endi siz ulushlarni topa va nomlay olasiz!" },
    rule_recap: { ru: 'Доля — одна из равных частей целого. Посчитай части — так и назови долю. Больше частей — меньше доля.', uz: "Ulush — butunning teng qismlaridan biri. Qismlarni sanang — ulushni shunday nomlang. Ko'proq qism — kichikroq ulush." },
    audio: {
      ru: 'Миссия выполнена. Мы научились находить доли — равные части целого. Посчитай, на сколько равных частей поделили, так и назови долю. И запомни: чем больше частей, тем меньше каждая доля. Дальше мы узнаем про время.',
      uz: "Missiya bajarildi. Ulushlarni topishni o'rgandik — butunning teng qismlarini. Nechta teng qismga bo'linganini sanang, ulushni shunday nomlang. Va eslab qoling: qism qancha ko'p bo'lsa, har bir ulush shuncha kichik. Keyingi safar vaqt haqida bilib olamiz."
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder)

| ekran | Stage | figure/param |
|---|---|---|
| s0 | hook | ShareFig 2 teng emas |
| s1 | ShareFig teach | circle/3, step-reveal |
| s2 | ShareFig teach | 2/3/4 |
| s3 | rule + check (NameStage-check) | circle/4 |
| s4 | CompareFig + warn + check | circle/2 vs 4 |
| sTBL | jadval (3 ShareFig qatori) | bar 2/3/4 |
| s5/s8/s11 | NameStage | fig → nom |
| s6/s10 | PickShapeStage | nom → figure choices |
| s7 | EqualCheckStage | teng? Ha/Yo'q |
| s9 | CompareStage | a vs b |
| s13 | NameStage (masala) | circle/4 |
| s14 | NameStage ×3 + FactCard | bar/2·circle/3·rect/6 |
| s15 | summary | NeptunField |
