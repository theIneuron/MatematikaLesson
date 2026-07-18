# Dars39 — CONTENT (Б6 NEPTUN · «Mantiq: naqsh, ortiqcha, xulosa» · program d.42)

> **Mexanika (metodist 2026-07-17): ARALASH** — naqsh (teach + qoida) + ortiqchani top + sodda xulosa.
> Klon-baza: **Dars38.jsx**. Yangi: `Shape` ({k:circle/tri/square/star, c:or/bl/gr/pu}, num=son) + `PatternRow` (naqsh + «?») +
> `LogicStage` (`mode`: pattern/odd/deduct). Vizual-og'ir (mantiq ko'rinishда), uz matn minimal.
> Shape-spec: `{k, c}` yoki `{k:'num', v}`. choices/group elementlari `ok:true` bilan to'g'ri/ortiqchani belgilaydi.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **UZ atamalar (draft):** naqsh/qonuniyat, ortiqcha, qoida, keyingisi, katta/kichik. Xaydarov solishtirilmadi.
2. Mantiq abstrakt — shakl/son. Sonli naqsh ≤ 20.
3. **uz-kirill skan majburiy** (Dars38 da 5 ifloslanish bo'lgan).

---

```javascript
const CONTENT = {
  // s0 — HOOK: naqsh or-doira/bl-uchburchak takror; kimdir «keyingisi doira» dedi (qoida bo'yicha uchburchak). Yo'q.
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Логика', uz: "Mavzu: Mantiq" },
    lead: { ru: 'Верно ли продолжили?', uz: "To'g'ri davom ettirildimi?" },
    q: { ru: 'Узор: круг, треугольник, круг, треугольник, круг. Кто-то сказал: дальше круг. Это верно?', uz: "Naqsh: doira, uchburchak, doira, uchburchak, doira. Kimdir «keyingisi doira» dedi. Bu to'g'rimi?" },
    seq: [{ k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }, { k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }, { k: 'circle', c: 'or' }],
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на станции у Нептуна. Экипаж решает логические задачи.',
          'Посмотри на узор: круг, треугольник, круг, треугольник, круг.',
          'Здесь повторяется звено круг-треугольник. После круга должен быть треугольник, а не круг.',
          'Как думаешь, верно ли продолжили? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidagi stansiyadamiz. Ekipaj mantiqiy masalalarni yechyapti.",
          "Naqshga qarang: doira, uchburchak, doira, uchburchak, doira.",
          "Bu yerda doira-uchburchak zvenosi takrorlanadi. Doiradan keyin uchburchak bo'lishi kerak, doira emas.",
          "Sizningcha, to'g'ri davom ettirildimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Повторяется круг-треугольник. После круга — треугольник.', uz: "To'g'ri. Doira-uchburchak takrorlanadi. Doiradan keyin — uchburchak." },
      on_wrong: { ru: 'Смотри на правило: круг-треугольник. После круга — треугольник. Сейчас разберём.', uz: "Qoidaga qarang: doira-uchburchak. Doiradan keyin — uchburchak. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня разберём узоры, лишний и выводы.', uz: "Hechqisi yo'q. Bugun naqsh, ortiqcha va xulosalarni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: naqsh — takrorlanuvchi zveno (doira-uchburchak). 4 seg step-reveal.
  s1: {
    eyebrow: { ru: 'Закономерность', uz: 'Naqsh' },
    lead: { ru: 'Повторяющееся звено', uz: "Takrorlanuvchi zveno" },
    seq: [{ k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }, { k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }],
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'В узоре есть звено, которое повторяется. Найди звено — узнаешь, что дальше.', uz: "Naqshda takrorlanadigan zveno bor. Zvenoni top — keyingisini bilasan." },
    audio: {
      ru: [
        'Посмотри на узор: круг, треугольник, круг, треугольник.',
        'Здесь повторяется звено: круг и треугольник.',
        'Звено повторяется снова и снова.',
        'Найди звено — и узнаешь, что будет дальше.'
      ],
      uz: [
        "Naqshga qarang: doira, uchburchak, doira, uchburchak.",
        "Bu yerda zveno takrorlanadi: doira va uchburchak.",
        "Zveno qayta-qayta takrorlanadi.",
        "Zvenoni top — keyin nima bo'lishini bilasan."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: ortiqcha — guruhда biri mos emas (bir tur, biri boshqa). 4 seg.
  s2: {
    eyebrow: { ru: 'Лишний', uz: 'Ortiqcha' },
    lead: { ru: 'Что не подходит', uz: "Nima mos emas" },
    group: [{ k: 'circle', c: 'or' }, { k: 'circle', c: 'or' }, { k: 'square', c: 'or' }, { k: 'circle', c: 'or' }],
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'В группе один предмет отличается от других. Найди общий признак — и увидишь лишний.', uz: "Guruhda bitta narsa boshqalardan farq qiladi. Umumiy belgini top — ortiqchani ko'rasan." },
    audio: {
      ru: [
        'Посмотри на группу фигур.',
        'Три из них круги, а одна — квадрат.',
        'Квадрат не подходит: он лишний.',
        'Найди общий признак — и увидишь, кто лишний.'
      ],
      uz: [
        "Shakllar guruhiga qarang.",
        "Uchtasi doira, bittasi — kvadrat.",
        "Kvadrat mos emas: u ortiqcha.",
        "Umumiy belgini top — ortiqchani ko'rasan."
      ]
    }
  },

  // s3 — QOIDA: naqsh qoidasini top, keyin davom ettir + check (pattern).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Сначала найди правило узора — какое звено повторяется. Потом продолжай по правилу.', uz: "Avval naqsh qoidasini top — qaysi zveno takrorlanadi. Keyin qoida bo'yicha davom ettir." },
    mode: 'pattern',
    seq: [{ k: 'square', c: 'gr' }, { k: 'circle', c: 'pu' }, { k: 'square', c: 'gr' }, { k: 'circle', c: 'pu' }],
    check_q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
    choices: [{ k: 'square', c: 'gr', ok: true }, { k: 'circle', c: 'pu' }, { k: 'tri', c: 'or' }],
    wrong: { ru: 'Повторяется квадрат-круг. После круга снова квадрат.', uz: "Kvadrat-doira takrorlanadi. Doiradan keyin yana kvadrat." },
    check_ok: { ru: 'Верно! После круга снова квадрат.', uz: "To'g'ri! Doiradan keyin yana kvadrat." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Найди звено узора, которое повторяется.',
        'Продолжай узор по этому правилу.',
        'Проверь. Квадрат, круг, квадрат, круг. Что дальше?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Naqshning takrorlanadigan zvenosini top.",
        "Naqshni shu qoida bo'yicha davom ettir.",
        "Tekshiring. Kvadrat, doira, kvadrat, doira. Keyingisi nima?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (XULOSA + WARN): katta/kichik. warn: munosabatni teskari qilma. check (deduct).
  s4: {
    eyebrow: { ru: 'Вывод', uz: 'Xulosa' },
    lead: { ru: 'Больше и меньше', uz: "Katta va kichik" },
    mode: 'deduct',
    fig: { pair: [{ k: 'circle', c: 'or', big: true }, { k: 'circle', c: 'bl', big: false }] },
    warn: { ru: 'Смотри внимательно: если один больше, то другой меньше. Не переворачивай.', uz: "Diqqat bilan qarang: biri katta bo'lsa, ikkinchisi kichik. Teskari qilmang." },
    check_q: { ru: 'Оранжевый круг больше синего. Какой меньше?', uz: "To'q sariq doira ko'kdan katta. Qaysi biri kichik?" },
    opts: [{ ru: 'синий', uz: "ko'k", ok: true }, { ru: 'оранжевый', uz: 'to\'q sariq' }, { ru: 'равны', uz: 'teng' }],
    wrong: { ru: 'Если оранжевый больше, то синий меньше. Меньше — синий.', uz: "To'q sariq katta bo'lsa, ko'k kichik. Kichigi — ko'k." },
    check_ok: { ru: 'Верно! Синий меньше.', uz: "To'g'ri! Ko'k kichik." },
    audio: {
      ru: [
        'Иногда в задаче надо сделать вывод.',
        'Если одна фигура больше, то другая меньше.',
        'Не переворачивай: больше и меньше — разные.',
        'Проверь. Оранжевый круг больше синего. Какой меньше?'
      ],
      uz: [
        "Ba'zan masalada xulosa chiqarish kerak.",
        "Bir shakl katta bo'lsa, ikkinchisi kichik.",
        "Teskari qilma: katta va kichik — har xil.",
        "Tekshiring. To'q sariq doira ko'kdan katta. Qaysi biri kichik?"
      ]
    }
  },

  // sTBL — KALIT: uch turdagi mantiq (naqsh · ortiqcha · xulosa). done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Три вида задач', uz: "Uch xil topshiriq" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Узор — найди правило. Лишний — найди общий признак. Вывод — сравни внимательно.', uz: "Naqsh — qoidani top. Ortiqcha — umumiy belgini top. Xulosa — diqqat bilan solishtir." },
    audio: {
      ru: [
        'Соберём ключ. Сегодня три вида задач.',
        'Узор — найди правило и продолжи. Лишний — найди общий признак.',
        'Вывод — сравни внимательно и не переворачивай.'
      ],
      uz: [
        "Kalitni yig'amiz. Bugun uch xil topshiriq.",
        "Naqsh — qoidani top va davom ettir. Ortiqcha — umumiy belgini top.",
        "Xulosa — diqqat bilan solishtir va teskari qilma."
      ]
    }
  },

  // s5 — MASHQ pattern (shakl). distraktor = oxirgi elementni ko'chirish (M1).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Продолжи узор', uz: "Naqshni davom ettir" },
    rounds: [
      { mode: 'pattern', seq: [{ k: 'circle', c: 'or' }, { k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }, { k: 'circle', c: 'or' }, { k: 'circle', c: 'or' }, { k: 'tri', c: 'bl' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        choices: [{ k: 'circle', c: 'or', ok: true }, { k: 'tri', c: 'bl' }, { k: 'square', c: 'gr' }],
        wrong: { ru: 'Звено — круг, круг, треугольник. После треугольника снова круг.', uz: "Zveno — doira, doira, uchburchak. Uchburchakdan keyin yana doira." },
        correct_text: { ru: 'Верно. После треугольника — круг.', uz: "To'g'ri. Uchburchakdan keyin — doira." } },
      { mode: 'pattern', seq: [{ k: 'star', c: 'pu' }, { k: 'square', c: 'gr' }, { k: 'star', c: 'pu' }, { k: 'square', c: 'gr' }, { k: 'star', c: 'pu' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        choices: [{ k: 'square', c: 'gr', ok: true }, { k: 'star', c: 'pu' }, { k: 'circle', c: 'or' }],
        wrong: { ru: 'Звено — звезда, квадрат. После звезды — квадрат.', uz: "Zveno — yulduz, kvadrat. Yulduzdan keyin — kvadrat." },
        correct_text: { ru: 'Верно. После звезды — квадрат.', uz: "To'g'ri. Yulduzdan keyin — kvadrat." } }
    ],
    audio: {
      intro: { ru: 'Найди правило узора и выбери, что будет дальше.', uz: "Naqsh qoidasini top va keyingisini tanla." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ odd (shakl/rang). distraktor = ahamiyatsiz belgi (M2).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Найди лишний', uz: "Ortiqchani top" },
    rounds: [
      { mode: 'odd', group: [{ k: 'tri', c: 'or' }, { k: 'tri', c: 'bl' }, { k: 'circle', c: 'gr', ok: true }, { k: 'tri', c: 'pu' }], q: { ru: 'Какая фигура лишняя?', uz: "Qaysi shakl ortiqcha?" },
        wrong: { ru: 'Три из них треугольники, а один — круг. Круг лишний.', uz: "Uchtasi uchburchak, bittasi — doira. Doira ortiqcha." },
        correct_text: { ru: 'Верно. Круг лишний — остальные треугольники.', uz: "To'g'ri. Doira ortiqcha — qolgani uchburchak." } },
      { mode: 'odd', group: [{ k: 'square', c: 'gr' }, { k: 'circle', c: 'gr' }, { k: 'star', c: 'gr' }, { k: 'tri', c: 'or', ok: true }], q: { ru: 'Какая фигура лишняя?', uz: "Qaysi shakl ortiqcha?" },
        wrong: { ru: 'Три из них зелёные, а одна — оранжевая. Оранжевая лишняя.', uz: "Uchtasi yashil, bittasi — to'q sariq. To'q sariq ortiqcha." },
        correct_text: { ru: 'Верно. Оранжевая лишняя — остальные зелёные.', uz: "To'g'ri. To'q sariq ortiqcha — qolgani yashil." } }
    ],
    audio: {
      intro: { ru: 'Найди общий признак и выбери лишнюю фигуру.', uz: "Umumiy belgini top va ortiqcha shaklni tanla." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ pattern (rang). distraktor = M1.
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Продолжи узор', uz: "Naqshni davom ettir" },
    rounds: [
      { mode: 'pattern', seq: [{ k: 'circle', c: 'or' }, { k: 'circle', c: 'bl' }, { k: 'circle', c: 'or' }, { k: 'circle', c: 'bl' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        choices: [{ k: 'circle', c: 'or', ok: true }, { k: 'circle', c: 'bl' }, { k: 'circle', c: 'gr' }],
        wrong: { ru: 'Цвет чередуется: оранжевый, синий. После синего — оранжевый.', uz: "Rang almashadi: to'q sariq, ko'k. Ko'kdan keyin — to'q sariq." },
        correct_text: { ru: 'Верно. После синего — оранжевый.', uz: "To'g'ri. Ko'kdan keyin — to'q sariq." } },
      { mode: 'pattern', seq: [{ k: 'square', c: 'gr' }, { k: 'square', c: 'gr' }, { k: 'square', c: 'pu' }, { k: 'square', c: 'gr' }, { k: 'square', c: 'gr' }, { k: 'square', c: 'pu' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        choices: [{ k: 'square', c: 'gr', ok: true }, { k: 'square', c: 'pu' }, { k: 'circle', c: 'or' }],
        wrong: { ru: 'Звено — зелёный, зелёный, фиолетовый. После фиолетового снова зелёный.', uz: "Zveno — yashil, yashil, siyohrang. Siyohrangdan keyin yana yashil." },
        correct_text: { ru: 'Верно. После фиолетового — зелёный.', uz: "To'g'ri. Siyohrangdan keyin — yashil." } }
    ],
    audio: {
      intro: { ru: 'Здесь узор по цвету. Найди правило и продолжи.', uz: "Bu yerda rang bo'yicha naqsh. Qoidani top va davom ettir." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ deduct (katta/kichik, oldin/keyin). distraktor = teskari (M3).
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Сделай вывод', uz: "Xulosa chiqar" },
    rounds: [
      { mode: 'deduct', fig: { pair: [{ k: 'square', c: 'gr', big: false }, { k: 'square', c: 'pu', big: true }] }, q: { ru: 'Фиолетовый квадрат больше зелёного. Какой меньше?', uz: "Siyohrang kvadrat yashildan katta. Qaysi biri kichik?" },
        opts: [{ ru: 'зелёный', uz: 'yashil', ok: true }, { ru: 'фиолетовый', uz: 'siyohrang', wrong: { ru: 'Фиолетовый больше, значит меньше — зелёный.', uz: "Siyohrang katta, demak kichigi — yashil." } }, { ru: 'равны', uz: 'teng', wrong: { ru: 'Они разные: один больше, другой меньше.', uz: "Ular har xil: biri katta, biri kichik." } }],
        correct_text: { ru: 'Верно. Зелёный меньше.', uz: "To'g'ri. Yashil kichik." } },
      { mode: 'deduct', q: { ru: 'Анвар пришёл раньше Зухры. Кто пришёл позже?', uz: "Anvar Zuhradan oldin keldi. Kim keyin keldi?" },
        opts: [{ ru: 'Зухра', uz: 'Zuhra', ok: true }, { ru: 'Анвар', uz: 'Anvar', wrong: { ru: 'Анвар был раньше. Значит позже пришла Зухра.', uz: "Anvar oldin edi. Demak keyin Zuhra keldi." } }, { ru: 'вместе', uz: 'birga', wrong: { ru: 'Один был раньше, другой позже — не вместе.', uz: "Biri oldin, biri keyin — birga emas." } }],
        correct_text: { ru: 'Верно. Зухра пришла позже.', uz: "To'g'ri. Zuhra keyin keldi." } }
    ],
    audio: {
      intro: { ru: 'Прочитай, сравни внимательно и сделай вывод.', uz: "O'qing, diqqat bilan solishtiring va xulosa chiqaring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ odd (boshqa belgi). distraktor = M2.
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Найди лишний', uz: "Ortiqchani top" },
    rounds: [
      { mode: 'odd', group: [{ k: 'num', v: 2 }, { k: 'num', v: 4 }, { k: 'num', v: 5, ok: true }, { k: 'num', v: 6 }], q: { ru: 'Какое число лишнее?', uz: "Qaysi son ortiqcha?" },
        wrong: { ru: 'Два, четыре, шесть — чётные. Пять — нечётное, лишнее.', uz: "Ikki, to'rt, olti — juft. Besh — toq, ortiqcha." },
        correct_text: { ru: 'Верно. Пять лишнее — остальные чётные.', uz: "To'g'ri. Besh ortiqcha — qolgani juft." } },
      { mode: 'odd', group: [{ k: 'star', c: 'or' }, { k: 'star', c: 'bl' }, { k: 'star', c: 'gr' }, { k: 'circle', c: 'pu', ok: true }], q: { ru: 'Что лишнее?', uz: "Nima ortiqcha?" },
        wrong: { ru: 'Три из них звёзды, а одна — круг. Круг лишний.', uz: "Uchtasi yulduz, bittasi — doira. Doira ortiqcha." },
        correct_text: { ru: 'Верно. Круг лишний — остальные звёзды.', uz: "To'g'ri. Doira ortiqcha — qolgani yulduz." } }
    ],
    audio: {
      intro: { ru: 'Найди, чем похожи, и выбери лишний.', uz: "Nimasi o'xshashligini top va ortiqchani tanla." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ pattern (sonli, +2). distraktor = M1 / hisob.
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Числовой узор', uz: "Sonli naqsh" },
    rounds: [
      { mode: 'pattern', seq: [{ k: 'num', v: 2 }, { k: 'num', v: 4 }, { k: 'num', v: 6 }, { k: 'num', v: 8 }], q: { ru: 'Какое число будет дальше?', uz: "Keyingi son nima?" },
        choices: [{ k: 'num', v: 10, ok: true }, { k: 'num', v: 9 }, { k: 'num', v: 8 }],
        wrong: { ru: 'Каждый раз прибавляем два: восемь плюс два — десять.', uz: "Har safar ikki qo'shamiz: sakkiz qo'shuv ikki — o'n." },
        correct_text: { ru: 'Верно. Восемь плюс два — десять.', uz: "To'g'ri. Sakkiz qo'shuv ikki — o'n." } },
      { mode: 'pattern', seq: [{ k: 'num', v: 5 }, { k: 'num', v: 7 }, { k: 'num', v: 9 }, { k: 'num', v: 11 }], q: { ru: 'Какое число будет дальше?', uz: "Keyingi son nima?" },
        choices: [{ k: 'num', v: 13, ok: true }, { k: 'num', v: 12 }, { k: 'num', v: 11 }],
        wrong: { ru: 'Прибавляем по два: одиннадцать плюс два — тринадцать.', uz: "Ikkitadan qo'shamiz: o'n bir qo'shuv ikki — o'n uch." },
        correct_text: { ru: 'Верно. Одиннадцать плюс два — тринадцать.', uz: "To'g'ri. O'n bir qo'shuv ikki — o'n uch." } }
    ],
    audio: {
      intro: { ru: 'Как меняются числа? Найди правило и продолжи.', uz: "Sonlar qanday o'zgaradi? Qoidani top va davom ettir." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ aralash (deduct + pattern).
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Подумай', uz: "O'ylab ko'r" },
    rounds: [
      { mode: 'deduct', q: { ru: 'Зухра выше Анвара, а Анвар выше Бита. Кто самый высокий?', uz: "Zuhra Anvardan baland, Anvar Bitdan baland. Kim eng baland?" },
        opts: [{ ru: 'Зухра', uz: 'Zuhra', ok: true }, { ru: 'Бит', uz: 'Bit', wrong: { ru: 'Бит ниже всех. Выше всех — Зухра.', uz: "Bit hammadan past. Eng baland — Zuhra." } }, { ru: 'Анвар', uz: 'Anvar', wrong: { ru: 'Анвар в середине. Выше всех — Зухра.', uz: "Anvar o'rtada. Eng baland — Zuhra." } }],
        correct_text: { ru: 'Верно. Зухра самая высокая.', uz: "To'g'ri. Zuhra eng baland." } },
      { mode: 'pattern', seq: [{ k: 'tri', c: 'or' }, { k: 'circle', c: 'bl' }, { k: 'square', c: 'gr' }, { k: 'tri', c: 'or' }, { k: 'circle', c: 'bl' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        choices: [{ k: 'square', c: 'gr', ok: true }, { k: 'tri', c: 'or' }, { k: 'circle', c: 'bl' }],
        wrong: { ru: 'Звено — треугольник, круг, квадрат. После круга — квадрат.', uz: "Zveno — uchburchak, doira, kvadrat. Doiradan keyin — kvadrat." },
        correct_text: { ru: 'Верно. После круга — квадрат.', uz: "To'g'ri. Doiradan keyin — kvadrat." } },
      { mode: 'odd', group: [{ k: 'circle', c: 'or' }, { k: 'square', c: 'or' }, { k: 'tri', c: 'or' }, { k: 'circle', c: 'bl', ok: true }], q: { ru: 'Что лишнее?', uz: "Nima ortiqcha?" },
        wrong: { ru: 'Три из них оранжевые, а одна — синяя. Синяя лишняя.', uz: "Uchtasi to'q sariq, bittasi — ko'k. Ko'k ortiqcha." },
        correct_text: { ru: 'Верно. Синяя лишняя.', uz: "To'g'ri. Ko'k ortiqcha." } }
    ],
    audio: {
      intro: { ru: 'Разные задачи. Читай внимательно и выбирай.', uz: "Har xil topshiriq. Diqqat bilan o'qing va tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Бит чинит пульт.', uz: "Bit pultни tuzatadi." },
    audio: { ru: 'Бит восстанавливает узор на пульте.', uz: "Bit pultdagi naqshni tiklaydi." }
  },

  // s13 — MASALA (pattern single): Bit pult naqshini tuzatadi.
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Узор на пульте', uz: "Pultdagi naqsh" },
    story: { ru: 'На пульте станции стёрся узор. Бит должен продолжить его правильно. Что идёт дальше?', uz: "Stansiya pultidagi naqsh o'chib qoldi. Bit uni to'g'ri davom ettirishi kerak. Keyingisi nima?" },
    mode: 'pattern',
    seq: [{ k: 'star', c: 'or' }, { k: 'star', c: 'bl' }, { k: 'star', c: 'or' }, { k: 'star', c: 'bl' }, { k: 'star', c: 'or' }],
    q: { ru: 'Что идёт дальше в узоре?', uz: "Naqshda keyingisi nima?" },
    choices: [{ k: 'star', c: 'bl', ok: true }, { k: 'star', c: 'or' }, { k: 'circle', c: 'gr' }],
    wrong: { ru: 'Цвет чередуется: оранжевый, синий. После оранжевого — синий.', uz: "Rang almashadi: to'q sariq, ko'k. To'q sariqdan keyin — ko'k." },
    correct_text: { ru: 'Верно. После оранжевой — синяя звезда.', uz: "To'g'ri. To'q sariqdan keyin — ko'k yulduz." },
    audio: {
      intro: { ru: 'На пульте узор из звёзд. Продолжи его правильно.', uz: "Pultda yulduzlardan naqsh. Uni to'g'ri davom ettiring." },
      on_correct: { ru: 'Верно. После оранжевой — синяя.', uz: "To'g'ri. To'q sariqdan keyin — ko'k." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (aralash pattern/odd/deduct ×3 + FactCard Neptun).
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Логика', uz: "Mantiq" },
    rounds: [
      { mode: 'pattern', seq: [{ k: 'circle', c: 'gr' }, { k: 'tri', c: 'or' }, { k: 'circle', c: 'gr' }, { k: 'tri', c: 'or' }], q: { ru: 'Что будет дальше?', uz: "Keyingisi nima?" },
        choices: [{ k: 'circle', c: 'gr', ok: true }, { k: 'tri', c: 'or' }, { k: 'square', c: 'bl' }],
        wrong: { ru: 'Звено — круг, треугольник. После треугольника — круг.', uz: "Zveno — doira, uchburchak. Uchburchakdan keyin — doira." },
        correct_text: { ru: 'Верно. После треугольника — круг.', uz: "To'g'ri. Uchburchakdan keyin — doira." } },
      { mode: 'odd', group: [{ k: 'num', v: 3 }, { k: 'num', v: 5 }, { k: 'num', v: 8, ok: true }, { k: 'num', v: 7 }], q: { ru: 'Какое число лишнее?', uz: "Qaysi son ortiqcha?" },
        wrong: { ru: 'Три, пять, семь — нечётные. Восемь — чётное, лишнее.', uz: "Uch, besh, yetti — toq. Sakkiz — juft, ortiqcha." },
        correct_text: { ru: 'Верно. Восемь лишнее — остальные нечётные.', uz: "To'g'ri. Sakkiz ortiqcha — qolgani toq." } },
      { mode: 'deduct', q: { ru: 'Утро наступает раньше вечера. Что позже?', uz: "Ertalab kechqurundan oldin keladi. Nima keyin?" },
        opts: [{ ru: 'вечер', uz: 'kechqurun', ok: true }, { ru: 'утро', uz: 'ertalab', wrong: { ru: 'Утро раньше. Значит позже — вечер.', uz: "Ertalab oldin. Demak keyin — kechqurun." } }, { ru: 'вместе', uz: 'birga', wrong: { ru: 'Одно раньше, другое позже.', uz: "Biri oldin, biri keyin." } }],
        correct_text: { ru: 'Верно. Вечер позже.', uz: "To'g'ri. Kechqurun keyin." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Нептун — единственная планета, которую нашли с помощью математики, а не в телескоп.', uz: "Neptun — teleskopda emas, matematika yordamida topilgan yagona sayyora." },
    fact_audio: { ru: 'Нептун нашли с помощью математики. Учёные вычислили, где он должен быть.', uz: "Neptun matematika yordamida topilgan. Olimlar u qayerda bo'lishini hisoblab chiqishgan." },
    audio: {
      intro: { ru: 'Последняя проверка. Узор, лишний и вывод.', uz: "Oxirgi tekshiruv. Naqsh, ortiqcha va xulosa." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi d.43 ma'lumot)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь рассуждать логически!', uz: "Endi siz mantiqiy fikrlay olasiz!" },
    rule_recap: { ru: 'Узор — найди правило. Лишний — найди общий признак. Вывод — сравни внимательно.', uz: "Naqsh — qoidani top. Ortiqcha — umumiy belgini top. Xulosa — diqqat bilan solishtir." },
    audio: {
      ru: 'Миссия выполнена. Мы научились рассуждать логически. В узоре ищи правило и продолжай. В группе ищи общий признак и находи лишний. В выводе сравнивай внимательно и не переворачивай. Дальше будем работать с данными.',
      uz: "Missiya bajarildi. Mantiqiy fikrlashni o'rgandik. Naqshda qoidani top va davom ettir. Guruhda umumiy belgini top va ortiqchani top. Xulosada diqqat bilan solishtir va teskari qilma. Keyingi safar ma'lumotlar bilan ishlaymiz."
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder)

| ekran | mode | vizual |
|---|---|---|
| s0 | hook | PatternRow (◯▲◯▲◯) |
| s1 | naqsh teach | PatternRow zveno |
| s2 | ortiqcha teach | group (3 doira + 1 kvadrat) |
| s3 | rule + check | PatternRow + choices |
| s4 | deduct + warn | pair (katta/kichik) |
| sTBL | KALIT | 3 tur ikonka |
| s5/s7 | pattern | PatternRow + shakl-choices |
| s6/s9 | odd | group-choices |
| s8/s11 | deduct/mix | text + pair |
| s10 | pattern (num) | son-naqsh |
| s13 | pattern (masala) | yulduz-naqsh |
| s14 | mix + FactCard | pattern/odd/deduct |
| s15 | summary | NeptunField |
