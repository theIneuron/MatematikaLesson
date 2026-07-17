# Dars31 — CONTENT (Б5 YAKUNI · «Takrorlash — butun geometriya»)

> Program d.34 · Uran ustaxona · klon-baza Dars30 · YANGI `ChainStage` (shakl → o'lchov → perimetr).
> Audio TTS-toza: sonlar SO'Z bilan, «» va matematik belgilar YO'Q, bir segment = bir fikr.
> Ko'rinadigan matnda digit/belgi OK. UZ registr — **siz**. Apostrof oddiy `'`.
> Segment sonlari: s2 = 4, s3 = 4 (qoida s3_1/s3_3 da yonadi), s4 = 4 (warn s4_2 da), sTBL = 3.

```js
const CONTENT = {
  // s0 — HOOK: kvadrat tomoni 3 sm → perimetr 12. Distraktor 9 = bitta tomon tashlab ketilgan (3+3+3) VA 3×3 chalkashuvi.
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Повторение — вся геометрия', uz: "Mavzu: Takrorlash — butun geometriya" },
    lead: { ru: 'Чему равен периметр?', uz: "Perimetr nechaga teng?" },
    q: { ru: 'Экипаж проверяет квадратную панель: каждая сторона три сантиметра. Чему равен её периметр?', uz: "Ekipaj kvadrat panelni tekshirmoqda: har bir tomoni uch santimetr. Uning perimetri nechaga teng?" },
    opt0: { ru: '9', uz: '9' },      // distraktor: uchta tomon (3+3+3) yoki 3×3
    opt1: { ru: '12', uz: '12' },    // to'g'ri
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы снова в мастерской на спутнике Урана. Сегодня повторяем всю геометрию.',
          'Экипаж проверяет квадратную панель. Каждая её сторона — три сантиметра.',
          'Периметр — это длина всего края фигуры. Чему равен периметр этой панели?',
          'Послушай два ответа. Первый — девять. Второй — двенадцать. Или ты пока не знаешь. Выбери свой ответ.'
        ],
        uz: [
          "Yana Uran yo'ldoshidagi ustaxonadamiz. Bugun butun geometriyani takrorlaymiz.",
          "Ekipaj kvadrat panelni tekshirmoqda. Uning har bir tomoni — uch santimetr.",
          "Perimetr — bu shakl chetining butun uzunligi. Bu panelning perimetri nechaga teng?",
          "Ikki javobni tinglang. Birinchi — to'qqiz. Ikkinchi — o'n ikki. Yoki hali bilmaysiz. O'z javobingizni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. У квадрата четыре стороны: три плюс три плюс три плюс три — двенадцать.', uz: "To'g'ri. Kvadratning to'rtta tomoni bor: uch qo'shuv uch qo'shuv uch qo'shuv uch — o'n ikki." },
      on_wrong: { ru: 'Девять — это только три стороны. А у квадрата их четыре. Сейчас всё повторим.', uz: "To'qqiz — bu faqat uchta tomon. Kvadratda esa to'rtta. Hozir hammasini takrorlaymiz." },
      on_unknown: { ru: 'Ничего. Сегодня повторим всю геометрию: линии, фигуры, длину и периметр.', uz: "Hechqisi yo'q. Bugun butun geometriyani takrorlaymiz: chiziqlar, shakllar, uzunlik va perimetr." }
    }
  },

  // s1 — TAKROR-1: chiziq turlari (uch soni) + ko'pburchak (tomon soni). Figure = LineFig+PolyFig galereya.
  s1: {
    eyebrow: { ru: 'Повторение', uz: 'Takrorlash' },
    lead: { ru: 'Линии и фигуры', uz: "Chiziqlar va shakllar" },
    body: { ru: 'Тип линии узнаём по концам: у прямой концов нет, у луча один конец, у отрезка два. А многоугольник узнаём по сторонам: три стороны — треугольник, четыре — четырёхугольник.', uz: "Chiziq turini uchlaridan taniymiz: to'g'ri chiziqning uchi yo'q, nurning bitta uchi bor, kesmaning ikkita. Ko'pburchakni esa tomonlaridan taniymiz: uchta tomon — uchburchak, to'rtta — to'rtburchak." },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Считай концы — узнаешь линию. Считай стороны — узнаешь многоугольник.', uz: "Uchlarni sanang — chiziqni bilasiz. Tomonlarni sanang — ko'pburchakni bilasiz." },
    audio: {
      ru: [
        'Сначала вспомним линии и фигуры.',
        'Тип линии видно по концам: у прямой концов нет, у луча один, у отрезка два.',
        'А многоугольник узнаём по сторонам: три стороны — треугольник, четыре стороны — четырёхугольник.'
      ],
      uz: [
        "Avval chiziqlar va shakllarni eslaymiz.",
        "Chiziq turi uchlaridan ko'rinadi: to'g'ri chiziqning uchi yo'q, nurning bitta, kesmaning ikkita.",
        "Ko'pburchakni esa tomonlaridan taniymiz: uchta tomon — uchburchak, to'rtta tomon — to'rtburchak."
      ]
    }
  },

  // s2 — TAKROR-2: uzunlik birliklari (step-reveal: 1=Ruler, 2=ConvertViz, 3=info). 4 segment.
  s2: {
    eyebrow: { ru: 'Единицы длины', uz: 'Uzunlik birliklari' },
    lead: { ru: 'Сантиметр, дециметр, метр', uz: "Santimetr, detsimetr, metr" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Один дециметр — это десять сантиметров. Один метр — это сто сантиметров.', uz: "Bir detsimetr — o'n santimetr. Bir metr — yuz santimetr." },
    audio: {
      ru: [
        'Теперь вспомним, чем измеряют длину.',
        'Маленькое измеряют в сантиметрах: карандаш или деталь.',
        'Парту — в дециметрах, а модуль станции — в метрах.',
        'Запомни: один дециметр — это десять сантиметров, а один метр — это сто сантиметров.'
      ],
      uz: [
        "Endi uzunlikni nima bilan o'lchashni eslaymiz.",
        "Kichik narsani santimetrda o'lchaymiz: qalam yoki detal.",
        "Partani — detsimetrda, stansiya modulini esa — metrda.",
        "Yodlang: bir detsimetr — bu o'n santimetr, bir metr esa — yuz santimetr."
      ]
    }
  },

  // s3 — QOIDA: perimetr = barcha tomonlar yig'indisi + check (SumFig tri 2,3,4 → 9)
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Периметр — это сумма всех сторон: сложи длины всех сторон фигуры.', uz: "Perimetr — bu barcha tomonlar yig'indisi: shaklning barcha tomonlari uzunligini qo'shing." },
    check_q: { ru: 'Чему равен периметр этого треугольника?', uz: "Bu uchburchakning perimetri nechaga teng?" },
    opts: [{ ru: '7', uz: '7' }, { ru: '9', uz: '9', ok: true }, { ru: '11', uz: '11' }],
    wrong: { ru: 'Сложи все три стороны: 2 + 3 + 4.', uz: "Uchala tomonni qo'shing: 2 + 3 + 4." },
    check_ok: { ru: 'Верно! 2 + 3 + 4 = 9.', uz: "To'g'ri! 2 + 3 + 4 = 9." },
    audio: {
      ru: [
        'Запишем главное правило геометрии. Слушай и запомни.',
        'Периметр — это длина всего края фигуры.',
        'Чтобы найти периметр, сложи длины всех сторон.',
        'Проверь. Чему равен периметр этого треугольника?'
      ],
      uz: [
        "Geometriyaning asosiy qoidasini yozamiz. Tinglang va yodlang.",
        "Perimetr — bu shakl chetining butun uzunligi.",
        "Perimetrni topish uchun barcha tomonlar uzunligini qo'shing.",
        "Tekshiring. Bu uchburchakning perimetri nechaga teng?"
      ]
    }
  },

  // s4 — ZANJIR NAMOYISHI (rect 4×2: nom → o'lchov → perimetr 12) + warn (s4_2) + check (kvadrat 2 → 8)
  s4: {
    eyebrow: { ru: 'Три шага', uz: 'Uch qadam' },
    lead: { ru: 'От фигуры к периметру — три шага', uz: "Shakldan perimetrgacha — uch qadam" },
    body: { ru: 'Сначала узнай фигуру: четыре стороны — четырёхугольник. Потом измерь стороны линейкой: четыре сантиметра и два. Потом сложи все стороны: 4 + 2 + 4 + 2 = 12.', uz: "Avval shaklni aniqlang: to'rtta tomon — to'rtburchak. So'ng tomonlarni chizg'ich bilan o'lchang: to'rt santimetr va ikki. So'ng barcha tomonlarni qo'shing: 4 + 2 + 4 + 2 = 12." },
    warn: { ru: 'Не пропусти ни одной стороны — обойди фигуру по краю до конца.', uz: "Birorta tomonni ham tashlab ketmang — shakl chetini oxirigacha aylanib chiqing." },
    check_q: { ru: 'Периметр квадрата со стороной 2?', uz: "Tomoni 2 bo'lgan kvadratning perimetri?" },
    opts: [{ ru: '4', uz: '4' }, { ru: '8', uz: '8', ok: true }, { ru: '6', uz: '6' }],
    wrong: { ru: 'У квадрата четыре стороны: 2 + 2 + 2 + 2.', uz: "Kvadratning to'rtta tomoni bor: 2 + 2 + 2 + 2." },
    check_ok: { ru: 'Верно! 2 + 2 + 2 + 2 = 8.', uz: "To'g'ri! 2 + 2 + 2 + 2 = 8." },
    audio: {
      ru: [
        'Покажу все три шага на одной фигуре.',
        'Шаг первый — узнаём фигуру: четыре стороны, значит четырёхугольник. Шаг второй — измеряем стороны линейкой: четыре сантиметра и два сантиметра.',
        'Шаг третий — складываем все стороны. Не пропусти ни одной: обойди фигуру по краю. Четыре плюс два плюс четыре плюс два — двенадцать.',
        'Проверь. Чему равен периметр квадрата со стороной два?'
      ],
      uz: [
        "Uch qadamning hammasini bitta shaklda ko'rsataman.",
        "Birinchi qadam — shaklni aniqlaymiz: to'rtta tomon, demak to'rtburchak. Ikkinchi qadam — tomonlarni chizg'ich bilan o'lchaymiz: to'rt santimetr va ikki santimetr.",
        "Uchinchi qadam — barcha tomonlarni qo'shamiz. Birortasini ham tashlab ketmang: shakl chetini aylanib chiqing. To'rt qo'shuv ikki qo'shuv to'rt qo'shuv ikki — o'n ikki.",
        "Tekshiring. Tomoni ikki bo'lgan kvadratning perimetri nechaga teng?"
      ]
    }
  },

  // sTBL — Б5 KALITI: uch soni · tomon soni · birlik · perimetr (3 segment, info sTBL_2 da)
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Ключ пятой планеты', uz: "Beshinchi sayyora kaliti" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Концы — тип линии. Стороны — многоугольник. 1 дм = 10 см, 1 м = 100 см. Периметр — сумма сторон.', uz: "Uchlar — chiziq turi. Tomonlar — ko'pburchak. 1 dm = 10 sm, 1 m = 100 sm. Perimetr — tomonlar yig'indisi." },
    audio: {
      ru: [
        'Запомни ключ пятой планеты.',
        'Концы говорят, какая это линия. Стороны говорят, какой это многоугольник.',
        'Один дециметр — десять сантиметров. А периметр — это сумма всех сторон.'
      ],
      uz: [
        "Beshinchi sayyora kalitini yodlang.",
        "Uchlar qanday chiziq ekanini aytadi. Tomonlar qanday ko'pburchak ekanini aytadi.",
        "Bir detsimetr — o'n santimetr. Perimetr esa — barcha tomonlar yig'indisi."
      ]
    }
  },

  // s5 — MASHQ ChainStage single: kvadrat 3 sm → perimetr 12
  s5: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    lead: { ru: 'Три шага', uz: 'Uch qadam' },
    transition: { ru: 'Повторение закончили. Теперь пройди все три шага сам.', uz: "Takrorlashni tugatdik. Endi uch qadamning hammasini o'zingiz bosib o'ting." },
    shape: 'rect', dims: [3, 3], measure: 0,
    wrong_shape: { ru: 'Посчитай стороны фигуры.', uz: "Shaklning tomonlarini sanang." },
    wrong_len: { ru: 'Смотри, где кончается деталь на линейке.', uz: "Detal chizg'ichda qayerda tugashiga qarang." },
    wrong_perim: { ru: 'Сложи длины всех сторон, ни одну не пропусти.', uz: "Barcha tomonlar uzunligini qo'shing, birortasini tashlab ketmang." },
    done_text: { ru: 'Верно! Все три шага пройдены.', uz: "To'g'ri! Uch qadam ham bosib o'tildi." },
    audio: {
      intro: { ru: 'Тренировка. Три шага: узнай фигуру, измерь сторону, найди периметр.', uz: "Mashq. Uch qadam: shaklni aniqlang, tomonni o'lchang, perimetrni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри на фигуру внимательно.', uz: "Shaklga diqqat bilan qarang." }
    }
  },

  // s6 — MASHQ LineTypeStage ×3: kesma(type) · to'g'ri chiziq(count→0) · fonar nuri(hayotiy langar, type)
  s6: {
    eyebrow: { ru: 'Линии', uz: 'Chiziqlar' },
    lead: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    rounds: [
      { type: 'segment', ask: 'type' },
      { type: 'line', ask: 'count' },
      { type: 'ray', ask: 'type', kind: 'beam' }
    ],
    wrong: { ru: 'Посчитай концы: ноль, один или два.', uz: "Uchlarni sanang: nol, bir yoki ikki." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Вспомни линии. Считай концы.', uz: "Chiziqlarni eslang. Uchlarni sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай концы линии.', uz: "Chiziqning uchlarini sanang." }
    }
  },

  // s7 — MASHQ PolyTypeStage ×3: beshburchak(name) · doira(ispoly→yo'q) · oltiburchak(count)
  s7: {
    eyebrow: { ru: 'Фигуры', uz: 'Shakllar' },
    lead: { ru: 'Какая это фигура?', uz: "Bu qanday shakl?" },
    rounds: [
      { sides: 5, ask: 'name' },
      { sides: 0, ask: 'ispoly' },
      { sides: 6, ask: 'count' }
    ],
    wrong: { ru: 'Посчитай стороны фигуры.', uz: "Shaklning tomonlarini sanang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Вспомни многоугольники. Считай стороны.', uz: "Ko'pburchaklarni eslang. Tomonlarni sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'У многоугольника стороны прямые, а фигура замкнута.', uz: "Ko'pburchakning tomonlari to'g'ri, shakli esa yopiq." }
    }
  },

  // s8 — MASHQ ChainStage ×2: rect 4×2 → 12 · uchburchak 3,4,5 → 12
  s8: {
    eyebrow: { ru: 'Три шага', uz: 'Uch qadam' },
    lead: { ru: 'Пройди три шага', uz: "Uch qadamni bosib o'ting" },
    rounds: [
      { shape: 'rect', dims: [4, 2], measure: 0 },
      { shape: 'tri', dims: [3, 4, 5], measure: 2 }
    ],
    wrong_shape: { ru: 'Посчитай стороны фигуры.', uz: "Shaklning tomonlarini sanang." },
    wrong_len: { ru: 'Считай от нуля на линейке.', uz: "Chizg'ichda noldan sanang." },
    wrong_perim: { ru: 'Обойди фигуру по краю и сложи все стороны.', uz: "Shakl chetini aylanib chiqing va barcha tomonlarni qo'shing." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Снова три шага: фигура, длина, периметр.', uz: "Yana uch qadam: shakl, uzunlik, perimetr." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не спеши, посмотри на фигуру.', uz: "Shoshilmang, shaklga qarang." }
    }
  },

  // s9 — MASHQ LenStage ×3: ruler 6 sm · modul→metr · 3 dm = 30 sm
  s9: {
    eyebrow: { ru: 'Длина', uz: 'Uzunlik' },
    lead: { ru: 'Измерь и переведи', uz: "O'lchang va almashtiring" },
    rounds: [
      { mode: 'ruler', cm: 6, wrong: { ru: 'Считай от нуля на линейке.', uz: "Chizg'ichda noldan sanang." } },
      { mode: 'unit', obj: 'module', unit: 'm', wrong: { ru: 'Модуль станции большой — какая единица подойдёт?', uz: "Stansiya moduli katta — qaysi birlik mos keladi?" } },
      { mode: 'convert', from: 'dm', to: 'sm', val: 3, wrong: { ru: 'В одном дециметре десять сантиметров.', uz: "Bir detsimetrda o'n santimetr bor." } }
    ],
    wrong: { ru: 'Посмотри внимательно на единицу.', uz: "Birlikka diqqat bilan qarang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Вспомни длину: линейка и единицы.', uz: "Uzunlikni eslang: chizg'ich va birliklar." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь единицу измерения.', uz: "O'lchov birligini tekshiring." }
    }
  },

  // s10 — MASHQ PerimStage ×3: geo 4×2 · sum tri 3,4,5 · geo L-shakl (yuza tuzog'i)
  s10: {
    eyebrow: { ru: 'Периметр', uz: 'Perimetr' },
    lead: { ru: 'Найди периметр', uz: "Perimetrni toping" },
    rounds: [
      { mode: 'geo', verts: [[0, 0], [4, 0], [4, 2], [0, 2]] },
      { mode: 'sum', shape: 'tri', sides: [3, 4, 5] },
      { mode: 'geo', verts: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]], wrong: { ru: 'Считай только край, а не клетки внутри.', uz: "Faqat chetni sanang, ichidagi kataklarni emas." } }
    ],
    wrong: { ru: 'Обойди фигуру по краю и сложи все стороны.', uz: "Shakl chetini aylanib chiqing va barcha tomonlarni qo'shing." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Вспомни периметр. Складывай стороны.', uz: "Perimetrni eslang. Tomonlarni qo'shing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Периметр — это только край фигуры.', uz: "Perimetr — bu faqat shaklning cheti." }
    }
  },

  // s11 — MASHQ RectBuildStage ×2: eni 4 bo'yi 2 · kvadrat 3×3
  s11: {
    eyebrow: { ru: 'Построение', uz: 'Yasash' },
    lead: { ru: 'Построй прямоугольник', uz: "To'rtburchak yasang" },
    rounds: [{ w: 4, h: 2 }, { w: 3, h: 3 }],
    wrong: { ru: 'Настрой ширину и высоту точно по размеру.', uz: "Eni va bo'yini o'lcham bo'yicha aniq sozlang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Последняя тренировка. Настрой ширину и высоту и проверь.', uz: "Oxirgi mashq. Eni va bo'yini sozlab tekshiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Ширина и высота должны совпасть с заданием.', uz: "Eni va bo'yi topshiriqga mos kelishi kerak." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Зухра делает рамку.', uz: "Zuhra ramka yasaydi." },
    manifest_label: { ru: 'рамка', uz: 'ramka' },
    audio: {
      ru: 'Зухра делает рамку для панели станции.',
      uz: "Zuhra stansiya paneli uchun ramka yasayapti."
    }
  },

  // s13 — MASALA (ChainStage): Zuhra ramkasi rect 5×2 → perimetr 14 (lenta uzunligi)
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Помоги Зухре.', uz: "Zuhraga yordam bering." },
    shape: 'rect', dims: [5, 2], measure: 0,
    story: { ru: 'Зухра делает рамку для панели. Пройди три шага и найди, сколько сантиметров ленты нужно на весь край.', uz: "Zuhra panel uchun ramka yasayapti. Uch qadamni bosib o'ting va butun chetga necha santimetr lenta kerakligini toping." },
    wrong_shape: { ru: 'Посчитай стороны панели.', uz: "Panelning tomonlarini sanang." },
    wrong_len: { ru: 'Считай от нуля на линейке.', uz: "Chizg'ichda noldan sanang." },
    wrong_perim: { ru: 'Лента идёт по всему краю: сложи все четыре стороны.', uz: "Lenta butun chet bo'ylab ketadi: to'rtala tomonni qo'shing." },
    done_text: { ru: 'Верно! Рамка готова.', uz: "To'g'ri! Ramka tayyor." },
    audio: {
      intro: { ru: 'Зухра делает рамку для панели: ширина пять сантиметров, высота два. Пройди три шага.', uz: "Zuhra panel uchun ramka yasayapti: eni besh santimetr, bo'yi ikki. Uch qadamni bosib o'ting." },
      on_correct: { ru: 'Верно. Ленты хватит ровно на весь край.', uz: "To'g'ri. Lenta butun chetga roppa-rosa yetadi." },
      on_wrong: { ru: 'Лента идёт по всему краю панели.', uz: "Lenta panelning butun cheti bo'ylab ketadi." }
    }
  },

  // s14 — FINAL (ChainStage ×2 + FactCard Uran): tri 4,4,4 → 12 · rect 6×3 → 18
  s14: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    lead: { ru: 'Финальная проверка', uz: 'Yakuniy tekshiruv' },
    rounds: [
      { shape: 'tri', dims: [4, 4, 4], measure: 0 },
      { shape: 'rect', dims: [6, 3], measure: 0 }
    ],
    wrong_shape: { ru: 'Посчитай стороны фигуры.', uz: "Shaklning tomonlarini sanang." },
    wrong_len: { ru: 'Смотри, где кончается деталь на линейке.', uz: "Detal chizg'ichda qayerda tugashiga qarang." },
    wrong_perim: { ru: 'Сложи длины всех сторон, ни одну не пропусти.', uz: "Barcha tomonlar uzunligini qo'shing, birortasini tashlab ketmang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Уран лежит на боку, поэтому его кольца стоят почти вертикально — как обруч.', uz: "Uran yonboshlab yotadi, shuning uchun uning halqalari deyarli tik turadi — xuddi gardishdek." },
    fact_audio: { ru: 'Уран лежит на боку. Поэтому его кольца стоят почти вертикально, как обруч.', uz: "Uran yonboshlab yotadi. Shuning uchun uning halqalari deyarli tik turadi, xuddi gardishdek." },
    audio: {
      intro: { ru: 'Финальная проверка. Пройди три шага сам.', uz: "Yakuniy tekshiruv. Uch qadamni o'zingiz bosib o'ting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не спеши, проверь каждый шаг.', uz: "Shoshilmang, har qadamni tekshiring." }
    }
  },

  // s15 — YAKUN: rule_recap + Б6 Neptun ga o'tish
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты знаешь всю геометрию: линии, фигуры, длину и периметр!', uz: "Endi siz butun geometriyani bilasiz: chiziqlar, shakllar, uzunlik va perimetr!" },
    rule_recap: { ru: 'Периметр — сумма всех сторон. Считай концы — узнаешь линию, считай стороны — узнаешь фигуру.', uz: "Perimetr — barcha tomonlar yig'indisi. Uchlarni sanang — chiziqni bilasiz, tomonlarni sanang — shaklni bilasiz." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'линии, фигуры, длина, периметр', uz: "chiziqlar, shakllar, uzunlik, perimetr" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'дальше: Нептун — выражения и уравнения', uz: "keyingi: Neptun — ifoda va tenglama" },
    audio: {
      ru: 'Миссия выполнена. Мы повторили всю геометрию: линии, фигуры, длину и периметр. Периметр — это сумма всех сторон. В мастерской на спутнике Урана экипаж проверил все панели. Пятая планета пройдена! Дальше нас ждёт Нептун.',
      uz: "Missiya bajarildi. Butun geometriyani takrorladik: chiziqlar, shakllar, uzunlik va perimetr. Perimetr — bu barcha tomonlar yig'indisi. Uran yo'ldoshidagi ustaxonada ekipaj barcha panellarni tekshirdi. Beshinchi sayyora bosib o'tildi! Keyin bizni Neptun kutmoqda."
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Вспомним линии и фигуры.', uz: "Chiziqlar va shakllarni eslaymiz." },
  s2:  { ru: 'А чем измеряем длину?', uz: "Uzunlikni nima bilan o'lchaymiz?" },
  s3:  { ru: 'Главное правило.', uz: "Asosiy qoida." },
  s4:  { ru: 'Соберём всё вместе.', uz: "Hammasini birga yig'amiz." },
  sTBL: { ru: 'Ключ пятой планеты.', uz: "Beshinchi sayyora kaliti." },
  s5:  { ru: 'Теперь три шага сам.', uz: "Endi uch qadam o'zingiz." },
  s6:  { ru: 'Линии.', uz: "Chiziqlar." },
  s7:  { ru: 'Фигуры.', uz: "Shakllar." },
  s8:  { ru: 'Снова три шага.', uz: "Yana uch qadam." },
  s9:  { ru: 'Длина.', uz: "Uzunlik." },
  s10: { ru: 'Периметр.', uz: "Perimetr." },
  s11: { ru: 'Построй сам.', uz: "O'zingiz yasang." },
  s12: { ru: 'Зухра делает рамку.', uz: "Zuhra ramka yasaydi." },
  s13: { ru: 'Помоги Зухре.', uz: "Zuhraga yordam bering." },
  s14: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s15: { ru: 'Пятая планета пройдена!', uz: "Beshinchi sayyora bosib o'tildi!" }
};

const S15_PAYOFF = {
  ru: 'В мастерской на спутнике Урана экипаж проверил все панели и рамки. Пятая планета пройдена! Спасибо за помощь.',
  uz: "Uran yo'ldoshidagi ustaxonada ekipaj barcha panel va ramkalarni tekshirdi. Beshinchi sayyora bosib o'tildi! Yordamingiz uchun rahmat."
};
```

## Tekshiruv izohlari

- **Sonlar ko'lami:** perimetr 8–18, tomon 2–6 sm, chizg'ich ≤ 10 sm, convert 3 dm = 30 sm. Hammasi Б5 ichida.
- **Distraktorlar = misconception:** s0 → 9 (tomon tashlab ketish + 3×3); s4 check → 4 (ikki tomon); s10 r3 → yuza tuzog'i (L-shakl ichidagi kataklar); `perimOpts` avtomatik ±2.
- **Personaj:** Zuhra (5-lik kanon ekipaj: Ra'no, Anvar, Zuhra, Jasur + Bit).
- **UZ registr:** butun dars **siz** (`sanang`, `qo'shing`, `toping`). ⚠️ Dars26–30 da yalang'och buyruq (`sana`, `qo'sh`) qolgan — alohida QA ishi.
- **Fakt:** Uran halqalari tik (Dars30 dagi «4 barobar katta» takrorlanmasin).
