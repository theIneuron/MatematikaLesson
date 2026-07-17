# Dars35 — CONTENT (Б6 NEPTUN · «Vaqt: soat va daqiqa» · program d.38)

> **Mexanika (metodist 2026-07-17): ARALASH** — soat o'qish (teach + qoida) + analog↔raqamli moslash (mashq).
> Klon-baza: **Dars34.jsx** (Neptun biom + siz-registr). Yangi: `ClockFace` (siferblat + soat/daqiqa strelkalari) +
> `ReadClockStage` (vaqtni o'qi → MC h:mm) · `MatchClockStage` (analog↔raqamli; mode: toDigital/toClock).
> Ko'lam: butun soat, yarim (30), chorak (15/45), 5-daqiqalik (s10). Daqiqa 5 ga karrali. 12-soatlik. AM/PM YO'Q.
> Ulush ko'prigi (Dars34): yarim soat = siferblatning yarmi, chorak = chorak.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **UZ atamalar (draft, Notion MCP uzuq):** soat = час/часы, daqiqa = минута; soat strelkasi (kalta) = часовая, daqiqa strelkasi
   (uzun) = минутная; `yarim soat` = polчаса, `chorak soat` = четверть. **O'qish shakli** — men «soat [h], [m] daqiqa» ishlatdim
   (masalan 4:30 = «soat to'rt, o'ttiz daqiqa»). `uch yarim` / «половина четвёртого» kabi idiomatik shakl QO'LLANMADI (grade-2 uchun
   sodda). Metodist idiomatik shaklni afzal ko'rsa — almashtiriladi.
2. **Raqamli yozuv** vizualda `h:mm` (3:00, 4:30). Audio'da faqat so'z (raqam/`:` yo'q).
3. Misconception M2 (asosiy): daqiqa strelkasi 3 da → «3 daqiqa» emas, 15. s4 warn + s9 bevosita uradi.

---

```javascript
const CONTENT = {
  // s0 — HOOK: soat 3:00 (kalta strelka 3 da, uzun 12 da). Kimdir «12:15» deb o'qidi (strelkalarni almashtirdi). To'g'rimi? Yo'q.
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Время', uz: "Mavzu: Vaqt" },
    lead: { ru: 'Сколько на часах?', uz: "Soat nechada?" },
    q: { ru: 'Короткая стрелка на трёх, длинная на двенадцати. Кто-то прочитал: двенадцать пятнадцать. Это верно?', uz: "Kalta strelka uchda, uzun o'n ikkida. Kimdir «o'n ikki o'n besh» deb o'qidi. Bu to'g'rimi?" },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на станции у Нептуна. Экипаж сверяет время по часам.',
          'На часах короткая стрелка стоит на трёх, а длинная — на двенадцати.',
          'Кто-то прочитал это как двенадцать часов пятнадцать минут. Он перепутал стрелки.',
          'Как думаешь, это верно? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidagi stansiyadamiz. Ekipaj soatga qarab vaqtni tekshiryapti.",
          "Soatda kalta strelka uchda turibdi, uzun strelka esa o'n ikkida.",
          "Kimdir buni «soat o'n ikki, o'n besh daqiqa» deb o'qidi. U strelkalarni chalkashtirdi.",
          "Sizningcha, bu to'g'rimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Короткая стрелка — это часы: сейчас три. А длинная — минуты.', uz: "To'g'ri. Kalta strelka — bu soat: hozir uch. Uzun strelka esa — daqiqa." },
      on_wrong: { ru: 'Он перепутал стрелки. Короткая показывает часы, длинная — минуты. Сейчас разберём.', uz: "U strelkalarni chalkashtirdi. Kalta strelka soatni, uzun daqiqani ko'rsatadi. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня научимся читать время по часам.', uz: "Hechqisi yo'q. Bugun soatga qarab vaqtni o'qishni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: ClockFace, ikki strelka. Kalta=soat (soat strelkasi), uzun=daqiqa. Butun soat 3:00. 4 seg step.
  s1: {
    eyebrow: { ru: 'Часы', uz: 'Soat' },
    lead: { ru: 'Две стрелки', uz: "Ikki strelka" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Короткая стрелка показывает часы, длинная — минуты. Когда длинная на двенадцати — минут ноль, целый час.', uz: "Kalta strelka soatni, uzun strelka daqiqani ko'rsatadi. Uzun o'n ikkida bo'lsa — daqiqa nol, butun soat." },
    audio: {
      ru: [
        'Посмотри на часы. У них две стрелки.',
        'Короткая стрелка показывает часы. Сейчас она на трёх — значит, три часа.',
        'Длинная стрелка показывает минуты. Сейчас она на двенадцати — значит, минут ноль.',
        'Читаем вместе: три часа ровно.'
      ],
      uz: [
        "Soatga qarang. Uning ikkita strelkasi bor.",
        "Kalta strelka soatni ko'rsatadi. Hozir u uchda — demak, soat uch.",
        "Uzun strelka daqiqani ko'rsatadi. Hozir u o'n ikkida — demak, daqiqa nol.",
        "Birga o'qiymiz: roppa-rosa soat uch."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: yarim soat. Uzun strelka 6 da = 30 daqiqa = yarim soat (ulush ko'prigi). 4 seg.
  s2: {
    eyebrow: { ru: 'Полчаса', uz: 'Yarim soat' },
    lead: { ru: 'Длинная на шести — полчаса', uz: "Uzun oltida — yarim soat" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Длинная стрелка на шести — это тридцать минут, ровно полциферблата. Это половина часа.', uz: "Uzun strelka oltida — bu o'ttiz daqiqa, siferblatning roppa-rosa yarmi. Bu — yarim soat." },
    audio: {
      ru: [
        'Теперь длинная стрелка прошла полкруга и стоит на шести.',
        'Полкруга — это тридцать минут. Ровно половина часа.',
        'Короткая стрелка ушла немного дальше трёх — часы всё ещё три.',
        'Читаем: три часа тридцать минут. Это полчаса, как половина из прошлого урока.'
      ],
      uz: [
        "Endi uzun strelka doiraning yarmini bosib o'tdi va oltida turibdi.",
        "Doiraning yarmi — bu o'ttiz daqiqa. Soatning roppa-rosa yarmi.",
        "Kalta strelka uchdan sal narigа o'tdi — soat hali ham uch.",
        "O'qiymiz: soat uch, o'ttiz daqiqa. Bu — yarim soat, o'tgan darsdagi yarim kabi."
      ]
    }
  },

  // s3 — QOIDA: kalta→qaysi soat, uzun→daqiqa (raqam×5) + check (soat 6:00).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Сначала посмотри на короткую стрелку — какой час. Потом на длинную — сколько минут.', uz: "Avval kalta strelkaga qarang — qaysi soat. Keyin uzun strelkaga — necha daqiqa." },
    fig: { h: 6, m: 0 },
    check_q: { ru: 'Короткая на шести, длинная на двенадцати. Сколько времени?', uz: "Kalta oltida, uzun o'n ikkida. Soat nechada?" },
    opts: [{ ru: '6:00', uz: '6:00', ok: true }, { ru: '12:30', uz: '12:30' }, { ru: '6:12', uz: '6:12' }],
    wrong: { ru: 'Короткая стрелка — часы: она на шести. Длинная на двенадцати — минут ноль. Значит, шесть часов.', uz: "Kalta strelka — soat: u oltida. Uzun o'n ikkida — daqiqa nol. Demak, soat olti." },
    check_ok: { ru: 'Верно! Шесть часов ровно.', uz: "To'g'ri! Roppa-rosa soat olti." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Сначала короткая стрелка — какой час.',
        'Потом длинная стрелка — сколько минут.',
        'Проверь. Короткая на шести, длинная на двенадцати. Сколько времени?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Avval kalta strelka — qaysi soat.",
        "Keyin uzun strelka — necha daqiqa.",
        "Tekshiring. Kalta oltida, uzun o'n ikkida. Soat nechada?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (CHORAK + WARN): uzun 3 da = 15 daqiqa (chorak). warn: 3 da → «3 daqiqa» EMAS, 15. check (2:15).
  s4: {
    eyebrow: { ru: 'Четверть', uz: 'Chorak' },
    lead: { ru: 'Длинная на трёх — пятнадцать минут', uz: "Uzun uchda — o'n besh daqiqa" },
    fig: { h: 2, m: 15 },
    warn: { ru: 'Длинная стрелка на трёх — это не три минуты, а пятнадцать. Каждый номер — это по пять минут.', uz: "Uzun strelka uchda — bu uch daqiqa emas, o'n besh. Har bir raqam — besh daqiqadan." },
    check_q: { ru: 'Короткая на двух, длинная на трёх. Сколько времени?', uz: "Kalta ikkida, uzun uchda. Soat nechada?" },
    opts: [{ ru: '2:15', uz: '2:15', ok: true }, { ru: '2:03', uz: '2:03' }, { ru: '3:15', uz: '3:15' }],
    wrong: { ru: 'Длинная на трёх — это пятнадцать минут, не три. Часы — по короткой: два. Значит, два пятнадцать.', uz: "Uzun uchda — bu o'n besh daqiqa, uch emas. Soat — kalta bo'yicha: ikki. Demak, ikki o'n besh." },
    check_ok: { ru: 'Верно! Два часа пятнадцать минут — четверть.', uz: "To'g'ri! Soat ikki, o'n besh daqiqa — chorak." },
    audio: {
      ru: [
        'Длинная стрелка встала на три. Но это не три минуты.',
        'Каждый номер на часах — это пять минут. Три номера — пятнадцать минут.',
        'Пятнадцать минут — это четверть часа.',
        'Проверь. Короткая на двух, длинная на трёх. Сколько времени?'
      ],
      uz: [
        "Uzun strelka uchга keldi. Ammo bu uch daqiqa emas.",
        "Soatdagi har bir raqam — besh daqiqa. Uch raqam — o'n besh daqiqa.",
        "O'n besh daqiqa — bu chorak soat.",
        "Tekshiring. Kalta ikkida, uzun uchda. Soat nechada?"
      ]
    }
  },

  // sTBL — KALIT: soat · soat(raqam) · daqiqa · yozuv. 3 qator (3:00, 4:30, 2:15). done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Читаем часы', uz: "Soatni o'qiymiz" },
    caption: { ru: 'Часы · время', uz: "Soat · vaqt" },
    rows: [{ h: 3, m: 0 }, { h: 4, m: 30 }, { h: 2, m: 15 }],
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Сначала короткая стрелка — час. Потом длинная — минуты. Каждый номер — пять минут.', uz: "Avval kalta strelka — soat. Keyin uzun — daqiqa. Har raqam — besh daqiqa." },
    audio: {
      ru: [
        'Соберём ключ. Читаем по короткой, потом по длинной стрелке.',
        'Три часа ровно. Четыре часа тридцать минут — полчаса.',
        'Два часа пятнадцать минут — четверть. Каждый номер — пять минут.'
      ],
      uz: [
        "Kalitni yig'amiz. Avval kalta, keyin uzun strelka bo'yicha o'qiymiz.",
        "Roppa-rosa soat uch. Soat to'rt, o'ttiz daqiqa — yarim soat.",
        "Soat ikki, o'n besh daqiqa — chorak. Har raqam — besh daqiqa."
      ]
    }
  },

  // s5 — MASHQ ReadClockStage: butun soatlar. distraktor = strelkalar almashgan (M1).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Прочитай время', uz: "Vaqtni o'qing" },
    mode: 'read',
    rounds: [
      { h: 5, m: 0, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '5:00', uz: '5:00', ok: true }, { ru: '12:25', uz: '12:25', wrong: { ru: 'Ты перепутал стрелки. Короткая на пяти — это часы. Длинная на двенадцати — минут ноль. Пять часов.', uz: "Strelkalarni chalkashtirdingiz. Kalta beshda — bu soat. Uzun o'n ikkida — daqiqa nol. Soat besh." } }, { ru: '5:12', uz: '5:12', wrong: { ru: 'Длинная на двенадцати — это ноль минут, не двенадцать. Пять часов ровно.', uz: "Uzun o'n ikkida — bu nol daqiqa, o'n ikki emas. Roppa-rosa soat besh." } }],
        correct_text: { ru: 'Верно. Пять часов ровно.', uz: "To'g'ri. Roppa-rosa soat besh." } },
      { h: 9, m: 0, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '9:00', uz: '9:00', ok: true }, { ru: '12:45', uz: '12:45', wrong: { ru: 'Короткая стрелка — часы, она на девяти. Длинная на двенадцати — минут ноль. Девять часов.', uz: "Kalta strelka — soat, u to'qqizda. Uzun o'n ikkida — daqiqa nol. Soat to'qqiz." } }, { ru: '9:12', uz: '9:12', wrong: { ru: 'Длинная на двенадцати — ноль минут. Девять часов ровно.', uz: "Uzun o'n ikkida — nol daqiqa. Roppa-rosa soat to'qqiz." } }],
        correct_text: { ru: 'Верно. Девять часов ровно.', uz: "To'g'ri. Roppa-rosa soat to'qqiz." } },
      { h: 7, m: 0, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '7:00', uz: '7:00', ok: true }, { ru: '12:35', uz: '12:35', wrong: { ru: 'Не путай стрелки. Короткая на семи — часы. Семь часов.', uz: "Strelkalarni chalkashtirmang. Kalta yettida — soat. Soat yetti." } }, { ru: '7:12', uz: '7:12', wrong: { ru: 'Длинная на двенадцати — ноль минут. Семь часов ровно.', uz: "Uzun o'n ikkida — nol daqiqa. Roppa-rosa soat yetti." } }],
        correct_text: { ru: 'Верно. Семь часов ровно.', uz: "To'g'ri. Roppa-rosa soat yetti." } }
    ],
    audio: {
      intro: { ru: 'Прочитай время: сначала короткая стрелка, потом длинная.', uz: "Vaqtni o'qing: avval kalta strelka, keyin uzun." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ MatchClockStage toDigital: analog → raqamli yozuvni tanla. distraktor = noto'g'ri daqiqa (M4).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Какая запись подходит?', uz: "Qaysi yozuv mos keladi?" },
    mode: 'toDigital',
    rounds: [
      { h: 6, m: 30, q: { ru: 'Выбери запись для этих часов.', uz: "Shu soat uchun yozuvni tanlang." },
        opts: [{ ru: '6:30', uz: '6:30', ok: true }, { ru: '6:06', uz: '6:06', wrong: { ru: 'Длинная на шести — это тридцать минут, не шесть. Шесть тридцать.', uz: "Uzun oltida — bu o'ttiz daqiqa, olti emas. Olti o'ttiz." } }, { ru: '7:30', uz: '7:30', wrong: { ru: 'Короткая ещё у шести, не у семи. Шесть тридцать.', uz: "Kalta hali oltida, yettida emas. Olti o'ttiz." } }],
        correct_text: { ru: 'Верно. Шесть тридцать — полчаса.', uz: "To'g'ri. Olti o'ttiz — yarim soat." } },
      { h: 10, m: 0, q: { ru: 'Выбери запись для этих часов.', uz: "Shu soat uchun yozuvni tanlang." },
        opts: [{ ru: '10:00', uz: '10:00', ok: true }, { ru: '12:50', uz: '12:50', wrong: { ru: 'Стрелки перепутаны. Короткая на десяти — часы. Десять часов.', uz: "Strelkalar chalkash. Kalta o'nda — soat. Soat o'n." } }, { ru: '10:12', uz: '10:12', wrong: { ru: 'Длинная на двенадцати — ноль минут. Десять часов.', uz: "Uzun o'n ikkida — nol daqiqa. Soat o'n." } }],
        correct_text: { ru: 'Верно. Десять часов ровно.', uz: "To'g'ri. Roppa-rosa soat o'n." } },
      { h: 8, m: 15, q: { ru: 'Выбери запись для этих часов.', uz: "Shu soat uchun yozuvni tanlang." },
        opts: [{ ru: '8:15', uz: '8:15', ok: true }, { ru: '8:03', uz: '8:03', wrong: { ru: 'Длинная на трёх — пятнадцать минут, не три. Восемь пятнадцать.', uz: "Uzun uchda — o'n besh daqiqa, uch emas. Sakkiz o'n besh." } }, { ru: '3:15', uz: '3:15', wrong: { ru: 'Часы — по короткой стрелке: восемь. Восемь пятнадцать.', uz: "Soat — kalta strelka bo'yicha: sakkiz. Sakkiz o'n besh." } }],
        correct_text: { ru: 'Верно. Восемь пятнадцать — четверть.', uz: "To'g'ri. Sakkiz o'n besh — chorak." } }
    ],
    audio: {
      intro: { ru: 'Посмотри на часы и выбери верную запись времени.', uz: "Soatga qarang va to'g'ri vaqt yozuvini tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ ReadClockStage: yarim soat. distraktor = daqiqa=6 (M2) yoki soat yaxlitlangan (M3).
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Прочитай время', uz: "Vaqtni o'qing" },
    mode: 'read',
    rounds: [
      { h: 4, m: 30, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '4:30', uz: '4:30', ok: true }, { ru: '4:06', uz: '4:06', wrong: { ru: 'Длинная на шести — это тридцать минут, не шесть. Четыре тридцать.', uz: "Uzun oltida — bu o'ttiz daqiqa, olti emas. To'rt o'ttiz." } }, { ru: '5:30', uz: '5:30', wrong: { ru: 'Короткая ещё не дошла до пяти, она у четырёх. Четыре тридцать.', uz: "Kalta hali beshga yetmagan, u to'rtda. To'rt o'ttiz." } }],
        correct_text: { ru: 'Верно. Четыре тридцать — полчаса.', uz: "To'g'ri. To'rt o'ttiz — yarim soat." } },
      { h: 8, m: 30, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '8:30', uz: '8:30', ok: true }, { ru: '9:30', uz: '9:30', wrong: { ru: 'Короткая между восемью и девятью, но час ещё восемь. Восемь тридцать.', uz: "Kalta sakkiz bilan to'qqiz orasida, ammo soat hali sakkiz. Sakkiz o'ttiz." } }, { ru: '8:06', uz: '8:06', wrong: { ru: 'Длинная на шести — тридцать минут. Восемь тридцать.', uz: "Uzun oltida — o'ttiz daqiqa. Sakkiz o'ttiz." } }],
        correct_text: { ru: 'Верно. Восемь тридцать.', uz: "To'g'ri. Sakkiz o'ttiz." } },
      { h: 11, m: 30, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '11:30', uz: '11:30', ok: true }, { ru: '12:30', uz: '12:30', wrong: { ru: 'Короткая ещё у одиннадцати, не у двенадцати. Одиннадцать тридцать.', uz: "Kalta hali o'n birda, o'n ikkida emas. O'n bir o'ttiz." } }, { ru: '11:06', uz: '11:06', wrong: { ru: 'Длинная на шести — тридцать минут. Одиннадцать тридцать.', uz: "Uzun oltida — o'ttiz daqiqa. O'n bir o'ttiz." } }],
        correct_text: { ru: 'Верно. Одиннадцать тридцать.', uz: "To'g'ri. O'n bir o'ttiz." } }
    ],
    audio: {
      intro: { ru: 'Половина часа: длинная стрелка на шести. Прочитай время.', uz: "Yarim soat: uzun strelka oltida. Vaqtni o'qing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ MatchClockStage toClock: raqamli yozuv → mos soatni tanla (mini ClockFace choices).
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Выбери часы', uz: "Soatni tanlang" },
    mode: 'toClock',
    rounds: [
      { name: { ru: '3:00', uz: '3:00' }, q: { ru: 'Где показано три часа?', uz: "Qayerda soat uch ko'rsatilgan?" },
        choices: [{ h: 3, m: 0, ok: true }, { h: 12, m: 15 }, { h: 3, m: 30 }],
        wrong: { ru: 'Три часа: короткая на трёх, длинная на двенадцати.', uz: "Soat uch: kalta uchda, uzun o'n ikkida." },
        correct_text: { ru: 'Верно. Три часа ровно.', uz: "To'g'ri. Roppa-rosa soat uch." } },
      { name: { ru: '6:30', uz: '6:30' }, q: { ru: 'Где показано шесть тридцать?', uz: "Qayerda olti o'ttiz ko'rsatilgan?" },
        choices: [{ h: 6, m: 30, ok: true }, { h: 6, m: 0 }, { h: 7, m: 30 }],
        wrong: { ru: 'Шесть тридцать: короткая между шестью и семью, длинная на шести.', uz: "Olti o'ttiz: kalta olti bilan yetti orasida, uzun oltida." },
        correct_text: { ru: 'Верно. Шесть тридцать.', uz: "To'g'ri. Olti o'ttiz." } },
      { name: { ru: '9:15', uz: '9:15' }, q: { ru: 'Где показано девять пятнадцать?', uz: "Qayerda to'qqiz o'n besh ko'rsatilgan?" },
        choices: [{ h: 9, m: 15, ok: true }, { h: 9, m: 0 }, { h: 3, m: 45 }],
        wrong: { ru: 'Девять пятнадцать: короткая на девяти, длинная на трёх.', uz: "To'qqiz o'n besh: kalta to'qqizda, uzun uchda." },
        correct_text: { ru: 'Верно. Девять пятнадцать.', uz: "To'g'ri. To'qqiz o'n besh." } }
    ],
    audio: {
      intro: { ru: 'Выбери часы, которые показывают это время.', uz: "Shu vaqtni ko'rsatayotgan soatni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ ReadClockStage: chorak. distraktor = daqiqa=3 (M2), 9→«9».
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Прочитай время', uz: "Vaqtni o'qing" },
    mode: 'read',
    rounds: [
      { h: 2, m: 15, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '2:15', uz: '2:15', ok: true }, { ru: '2:03', uz: '2:03', wrong: { ru: 'Длинная на трёх — это пятнадцать минут, не три. Каждый номер — пять минут. Два пятнадцать.', uz: "Uzun uchda — bu o'n besh daqiqa, uch emas. Har raqam — besh daqiqa. Ikki o'n besh." } }, { ru: '3:15', uz: '3:15', wrong: { ru: 'Часы — по короткой: два. Два пятнадцать.', uz: "Soat — kalta bo'yicha: ikki. Ikki o'n besh." } }],
        correct_text: { ru: 'Верно. Два пятнадцать — четверть.', uz: "To'g'ri. Ikki o'n besh — chorak." } },
      { h: 7, m: 45, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '7:45', uz: '7:45', ok: true }, { ru: '7:09', uz: '7:09', wrong: { ru: 'Длинная на девяти — это сорок пять минут, не девять. Девять номеров по пять. Семь сорок пять.', uz: "Uzun to'qqizda — bu qirq besh daqiqa, to'qqiz emas. To'qqiz raqam beshdan. Yetti qirq besh." } }, { ru: '8:45', uz: '8:45', wrong: { ru: 'Короткая ещё у семи. Семь сорок пять.', uz: "Kalta hali yettida. Yetti qirq besh." } }],
        correct_text: { ru: 'Верно. Семь сорок пять.', uz: "To'g'ri. Yetti qirq besh." } },
      { h: 4, m: 15, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '4:15', uz: '4:15', ok: true }, { ru: '4:03', uz: '4:03', wrong: { ru: 'Длинная на трёх — пятнадцать минут. Четыре пятнадцать.', uz: "Uzun uchda — o'n besh daqiqa. To'rt o'n besh." } }, { ru: '3:15', uz: '3:15', wrong: { ru: 'Часы — по короткой: четыре. Четыре пятнадцать.', uz: "Soat — kalta bo'yicha: to'rt. To'rt o'n besh." } }],
        correct_text: { ru: 'Верно. Четыре пятнадцать.', uz: "To'g'ri. To'rt o'n besh." } }
    ],
    audio: {
      intro: { ru: 'Четверть часа. Помни: каждый номер — это пять минут.', uz: "Chorak soat. Yodda tuting: har raqam — besh daqiqa." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ ReadClockStage: 5-daqiqalik. distraktor = raqamni ×5 qilmaslik (M2).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Прочитай время', uz: "Vaqtni o'qing" },
    mode: 'read',
    rounds: [
      { h: 3, m: 20, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '3:20', uz: '3:20', ok: true }, { ru: '3:04', uz: '3:04', wrong: { ru: 'Длинная на четырёх — это двадцать минут: четыре номера по пять. Три двадцать.', uz: "Uzun to'rtda — bu yigirma daqiqa: to'rt raqam beshdan. Uch yigirma." } }, { ru: '4:20', uz: '4:20', wrong: { ru: 'Часы — по короткой: три. Три двадцать.', uz: "Soat — kalta bo'yicha: uch. Uch yigirma." } }],
        correct_text: { ru: 'Верно. Три двадцать.', uz: "To'g'ri. Uch yigirma." } },
      { h: 7, m: 5, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '7:05', uz: '7:05', ok: true }, { ru: '7:01', uz: '7:01', wrong: { ru: 'Длинная на одном — это пять минут: один номер по пять. Семь ноль пять.', uz: "Uzun birda — bu besh daqiqa: bitta raqam beshdan. Yetti nol besh." } }, { ru: '1:35', uz: '1:35', wrong: { ru: 'Стрелки перепутаны. Часы — по короткой: семь. Семь ноль пять.', uz: "Strelkalar chalkash. Soat — kalta bo'yicha: yetti. Yetti nol besh." } }],
        correct_text: { ru: 'Верно. Семь ноль пять.', uz: "To'g'ri. Yetti nol besh." } },
      { h: 10, m: 25, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '10:25', uz: '10:25', ok: true }, { ru: '10:05', uz: '10:05', wrong: { ru: 'Длинная на пяти — это двадцать пять минут: пять номеров по пять. Десять двадцать пять.', uz: "Uzun beshda — bu yigirma besh daqiqa: besh raqam beshdan. O'n yigirma besh." } }, { ru: '5:50', uz: '5:50', wrong: { ru: 'Часы — по короткой: десять. Десять двадцать пять.', uz: "Soat — kalta bo'yicha: o'n. O'n yigirma besh." } }],
        correct_text: { ru: 'Верно. Десять двадцать пять.', uz: "To'g'ri. O'n yigirma besh." } }
    ],
    audio: {
      intro: { ru: 'Каждый номер — пять минут. Посчитай минуты по длинной стрелке.', uz: "Har raqam — besh daqiqa. Uzun strelka bo'yicha daqiqani sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ MatchClockStage toClock aralash.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Выбери часы', uz: "Soatni tanlang" },
    mode: 'toClock',
    rounds: [
      { name: { ru: '5:30', uz: '5:30' }, q: { ru: 'Где показано пять тридцать?', uz: "Qayerda besh o'ttiz ko'rsatilgan?" },
        choices: [{ h: 5, m: 30, ok: true }, { h: 5, m: 0 }, { h: 6, m: 30 }],
        wrong: { ru: 'Пять тридцать: короткая между пятью и шестью, длинная на шести.', uz: "Besh o'ttiz: kalta besh bilan olti orasida, uzun oltida." },
        correct_text: { ru: 'Верно. Пять тридцать.', uz: "To'g'ri. Besh o'ttiz." } },
      { name: { ru: '8:00', uz: '8:00' }, q: { ru: 'Где показано восемь часов?', uz: "Qayerda soat sakkiz ko'rsatilgan?" },
        choices: [{ h: 8, m: 0, ok: true }, { h: 12, m: 40 }, { h: 8, m: 15 }],
        wrong: { ru: 'Восемь часов: короткая на восьми, длинная на двенадцати.', uz: "Soat sakkiz: kalta sakkizda, uzun o'n ikkida." },
        correct_text: { ru: 'Верно. Восемь часов.', uz: "To'g'ri. Soat sakkiz." } },
      { name: { ru: '2:45', uz: '2:45' }, q: { ru: 'Где показано два сорок пять?', uz: "Qayerda ikki qirq besh ko'rsatilgan?" },
        choices: [{ h: 2, m: 45, ok: true }, { h: 9, m: 10 }, { h: 2, m: 15 }],
        wrong: { ru: 'Два сорок пять: короткая почти у трёх, длинная на девяти.', uz: "Ikki qirq besh: kalta deyarli uchda, uzun to'qqizda." },
        correct_text: { ru: 'Верно. Два сорок пять.', uz: "To'g'ri. Ikki qirq besh." } }
    ],
    audio: {
      intro: { ru: 'Выбери часы, которые показывают это время.', uz: "Shu vaqtni ko'rsatayotgan soatni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Бит сверяет расписание.', uz: "Bit jadvalni tekshiradi." },
    audio: { ru: 'Бит смотрит на часы станции.', uz: "Bit stansiya soatiga qaraydi." }
  },

  // s13 — MASALA (ReadClockStage single): stansiya voqeasi 7:30 (yarim).
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Расписание станции', uz: "Stansiya jadvali" },
    story: { ru: 'По расписанию связь с Землёй в семь тридцать. Бит смотрит на часы станции. Какое время они показывают?', uz: "Jadvalga ko'ra Yer bilan aloqa yetti o'ttizda. Bit stansiya soatiga qaraydi. Ular qanday vaqtni ko'rsatyapti?" },
    mode: 'read',
    h: 7, m: 30,
    q: { ru: 'Сколько времени на часах?', uz: "Soatda vaqt nechada?" },
    opts: [
      { ru: '7:30', uz: '7:30', ok: true },
      { ru: '8:30', uz: '8:30', wrong: { ru: 'Короткая ещё у семи, не у восьми. Семь тридцать.', uz: "Kalta hali yettida, sakkizda emas. Yetti o'ttiz." } },
      { ru: '7:06', uz: '7:06', wrong: { ru: 'Длинная на шести — это тридцать минут, не шесть. Семь тридцать.', uz: "Uzun oltida — bu o'ttiz daqiqa, olti emas. Yetti o'ttiz." } }
    ],
    correct_text: { ru: 'Верно. Семь тридцать — время связи с Землёй.', uz: "To'g'ri. Yetti o'ttiz — Yer bilan aloqa vaqti." },
    audio: {
      intro: { ru: 'Связь с Землёй по расписанию. Прочитай время на часах станции.', uz: "Jadval bo'yicha Yer bilan aloqa. Stansiya soatidagi vaqtni o'qing." },
      on_correct: { ru: 'Верно. Семь тридцать.', uz: "To'g'ri. Yetti o'ttiz." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (ReadClockStage ×3 + FactCard Neptun): 6:00, 9:30, 4:15.
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Прочитай время', uz: "Vaqtni o'qing" },
    mode: 'read',
    rounds: [
      { h: 6, m: 0, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '6:00', uz: '6:00', ok: true }, { ru: '12:30', uz: '12:30', wrong: { ru: 'Стрелки перепутаны. Короткая на шести — часы. Шесть часов.', uz: "Strelkalar chalkash. Kalta oltida — soat. Soat olti." } }, { ru: '6:12', uz: '6:12', wrong: { ru: 'Длинная на двенадцати — ноль минут. Шесть часов.', uz: "Uzun o'n ikkida — nol daqiqa. Soat olti." } }],
        correct_text: { ru: 'Верно. Шесть часов ровно.', uz: "To'g'ri. Roppa-rosa soat olti." } },
      { h: 9, m: 30, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '9:30', uz: '9:30', ok: true }, { ru: '10:30', uz: '10:30', wrong: { ru: 'Короткая ещё у девяти. Девять тридцать.', uz: "Kalta hali to'qqizda. To'qqiz o'ttiz." } }, { ru: '9:06', uz: '9:06', wrong: { ru: 'Длинная на шести — тридцать минут. Девять тридцать.', uz: "Uzun oltida — o'ttiz daqiqa. To'qqiz o'ttiz." } }],
        correct_text: { ru: 'Верно. Девять тридцать — полчаса.', uz: "To'g'ri. To'qqiz o'ttiz — yarim soat." } },
      { h: 4, m: 15, q: { ru: 'Сколько времени?', uz: "Soat nechada?" },
        opts: [{ ru: '4:15', uz: '4:15', ok: true }, { ru: '4:03', uz: '4:03', wrong: { ru: 'Длинная на трёх — пятнадцать минут. Четыре пятнадцать.', uz: "Uzun uchda — o'n besh daqiqa. To'rt o'n besh." } }, { ru: '3:15', uz: '3:15', wrong: { ru: 'Часы — по короткой: четыре. Четыре пятнадцать.', uz: "Soat — kalta bo'yicha: to'rt. To'rt o'n besh." } }],
        correct_text: { ru: 'Верно. Четыре пятнадцать — четверть.', uz: "To'g'ri. To'rt o'n besh — chorak." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Сутки на Нептуне — всего шестнадцать часов: планета крутится быстрее Земли.', uz: "Neptunda bir sutka — atigi o'n olti soat: sayyora Yerdan tezroq aylanadi." },
    fact_audio: { ru: 'Сутки на Нептуне длятся всего шестнадцать часов. Планета крутится быстрее Земли.', uz: "Neptunda bir sutka atigi o'n olti soat davom etadi. Sayyora Yerdan tezroq aylanadi." },
    audio: {
      intro: { ru: 'Последняя проверка. Сначала короткая стрелка, потом длинная.', uz: "Oxirgi tekshiruv. Avval kalta strelka, keyin uzun." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi d.39)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь читать время по часам!', uz: "Endi siz soatga qarab vaqtni o'qiy olasiz!" },
    rule_recap: { ru: 'Короткая стрелка — часы, длинная — минуты. Каждый номер — пять минут. Половина часа — на шести, четверть — на трёх.', uz: "Kalta strelka — soat, uzun — daqiqa. Har raqam — besh daqiqa. Yarim soat — oltida, chorak — uchda." },
    audio: {
      ru: 'Миссия выполнена. Мы научились читать время по часам. Короткая стрелка показывает часы, длинная — минуты, а каждый номер — это пять минут. Половина часа — длинная на шести, четверть — на трёх. Дальше мы продолжим путь домой.',
      uz: "Missiya bajarildi. Soatga qarab vaqtni o'qishni o'rgandik. Kalta strelka soatni, uzun daqiqani ko'rsatadi, har bir raqam esa — besh daqiqa. Yarim soat — uzun oltida, chorak — uchda. Keyin uyga yo'lni davom ettiramiz."
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder)

| ekran | Stage | param |
|---|---|---|
| s0 | hook | ClockFace 3:00 |
| s1 | ClockFace teach | 3:00 step-reveal |
| s2 | ClockFace teach | 3:30 (yarim) |
| s3 | rule + check | ClockFace 6:00 |
| s4 | ClockFace + warn + check | 2:15 (chorak) |
| sTBL | jadval (3 ClockFace qatori) | 3:00·4:30·2:15 |
| s5/s7/s9/s10 | ReadClockStage | ClockFace → h:mm MC |
| s6 | MatchClockStage toDigital | ClockFace → raqamli |
| s8/s11 | MatchClockStage toClock | raqamli → ClockFace choices |
| s13 | ReadClockStage (masala) | 7:30 |
| s14 | ReadClockStage ×3 + FactCard | 6:00·9:30·4:15 |
| s15 | summary | NeptunField |
