# Dars38 — CONTENT (Б6 NEPTUN · «Kattaликларга masala: vaqt, pul, uzunlik» · program d.41)

> **Mexanika (metodist 2026-07-17): ARALASH** — masala yechish usuli (bergan → so'ralgan → amal → javob) teach + qoida +
> har xil kattalik mashqi (vizual bilan). Б6 sintez darsi (pul Dars37, vaqt Dars35, uzunlik Б5).
> Klon-baza: **Dars37.jsx** (Neptun biom + siz-registr). Yangi: `MiniClock` (butun soat), `LenBar` (sm uzunlik) + CoinSet (meros).
> `MasalaStage` — masala matni + vizual (`kind`: money/time/length/num) → javob MC. s6/s9 = amal-tanlash (qaysi amal, +/−).
> Ko'lam: pul 100–2000 (100-karrali), uzunlik ≤ 20 sm, vaqt butun soat 1–12, son ≤ 100.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **UZ atamalar (draft):** masala, bergan/berilgan, so'ralgan, amal, qo'shish/ayirish, qancha qoldi, jami. Xaydarov solishtirilmadi.
2. So'z-signal (qoldi/sarfladi → −; jami/birga → +) — RU/UZ tekshirilishi kerak.
3. Sonlar (pul yuzlik) — grade-2 dan kengroq, metodist qarori (Dars37 bilan bir xil).

---

```javascript
const CONTENT = {
  // s0 — HOOK: uzunlik. Bor 8 sm, 3 sm kesildi; kimdir QO'SHDI (11). To'g'rimi? Yo'q (5) — amal noto'g'ri.
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Задачи', uz: "Mavzu: Masalalar" },
    lead: { ru: 'Верное ли действие?', uz: "Amal to'g'rimi?" },
    q: { ru: 'Была лента восемь сантиметров, отрезали три. Кто-то сложил и сказал: одиннадцать. Это верно?', uz: "Tasma sakkiz santimetr edi, uch santimetr kesildi. Kimdir qo'shib, o'n bir dedi. Bu to'g'rimi?" },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на станции у Нептуна. Экипаж решает задачи про величины.',
          'Была лента восемь сантиметров. От неё отрезали три сантиметра.',
          'Кто-то сложил восемь и три и сказал: одиннадцать. Но если отрезали, надо вычитать, а не складывать.',
          'Как думаешь, это верно? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidagi stansiyadamiz. Ekipaj kattaliklar haqidagi masalalarni yechyapti.",
          "Tasma sakkiz santimetr edi. Undan uch santimetr kesildi.",
          "Kimdir sakkiz bilan uchni qo'shib, o'n bir dedi. Ammo kesilgan bo'lsa, qo'shish emas, ayirish kerak.",
          "Sizningcha, bu to'g'rimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Отрезали — значит вычитаем: восемь минус три — пять.', uz: "To'g'ri. Kesildi — demak ayiramiz: sakkiz ayirish uch — besh." },
      on_wrong: { ru: 'Если отрезали, надо вычитать. Восемь минус три — пять. Сейчас разберём.', uz: "Kesilgan bo'lsa, ayirish kerak. Sakkiz ayirish uch — besh. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня научимся выбирать действие в задаче.', uz: "Hechqisi yo'q. Bugun masalada amalni tanlashni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: masala qadamlari — nima BERILGAN, nima SO'RALGAN (pul misoli). 4 seg.
  s1: {
    eyebrow: { ru: 'Шаги задачи', uz: 'Masala qadamlari' },
    lead: { ru: 'Что дано и что спросили', uz: "Nima berilgan, nima so'ralgan" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Сначала найди, что дано, потом — что спросили. Только потом выбирай действие.', uz: "Avval nima berilganini top, keyin — nima so'ralganini. Shundan keyingina amalni tanla." },
    audio: {
      ru: [
        'В каждой задаче есть то, что дано, и то, что спросили.',
        'Например: было пятьсот сумов, добавили двести. Дано — пятьсот и двести.',
        'Спросили: сколько стало всего.',
        'Сначала находим дано и вопрос, потом решаем.'
      ],
      uz: [
        "Har masalada berilgan narsa va so'ralgan narsa bor.",
        "Masalan: besh yuz so'm bor edi, ikki yuz qo'shildi. Berilgan — besh yuz va ikki yuz.",
        "So'ralgan: jami qancha bo'ldi.",
        "Avval berilgan va savolni topamiz, keyin yechamiz."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: amal-signali — ko'paysa → qo'shish, kamaysa → ayirish. 4 seg.
  s2: {
    eyebrow: { ru: 'Какое действие', uz: 'Qaysi amal' },
    lead: { ru: 'Больше или меньше', uz: "Ko'paydimi, kamaydimi" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Стало больше — складывай. Стало меньше — вычитай.', uz: "Ko'paydi — qo'sh. Kamaydi — ayir." },
    audio: {
      ru: [
        'Как узнать, какое действие в задаче?',
        'Если добавили, прибавили, пришло — стало больше. Это сложение.',
        'Если отрезали, потратили, ушло — стало меньше. Это вычитание.',
        'Смотри на слова задачи: больше или меньше.'
      ],
      uz: [
        "Masalada qaysi amal ekanini qanday bilamiz?",
        "Agar qo'shildi, keldi — ko'paydi. Bu qo'shish.",
        "Agar kesildi, sarflandi, ketdi — kamaydi. Bu ayirish.",
        "Masala so'zlariga qarang: ko'paydimi yoki kamaydimi."
      ]
    }
  },

  // s3 — QOIDA: berilgan+so'ralganni top, amalni tanla, hisobla + check (500+200 → 700).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Найди, что дано и что спросили. Реши, стало больше или меньше. Выбери действие и посчитай.', uz: "Nima berilgan va so'ralganini top. Ko'paydimi yoki kamaydimi — hal qil. Amalni tanla va hisobla." },
    kind: 'money', coins: [500, 200],
    check_q: { ru: 'Было пятьсот сумов, добавили двести. Сколько стало?', uz: "Besh yuz so'm bor edi, ikki yuz qo'shildi. Qancha bo'ldi?" },
    opts: [{ ru: '700 сум', uz: "700 so'm", ok: true }, { ru: '300 сум', uz: "300 so'm" }, { ru: '520 сум', uz: "520 so'm" }],
    wrong: { ru: 'Добавили — значит стало больше, складываем: пятьсот плюс двести — семьсот.', uz: "Qo'shildi — demak ko'paydi, qo'shamiz: besh yuz qo'shuv ikki yuz — yetti yuz." },
    check_ok: { ru: 'Верно! Добавили — сложили: семьсот сумов.', uz: "To'g'ri! Qo'shildi — qo'shdik: yetti yuz so'm." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Найди, что дано и что спросили.',
        'Реши, стало больше или меньше, и выбери действие.',
        'Проверь. Было пятьсот сумов, добавили двести. Сколько стало?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Nima berilgan va so'ralganini top.",
        "Ko'paydimi yoki kamaydimi — hal qil va amalni tanla.",
        "Tekshiring. Besh yuz so'm bor edi, ikki yuz qo'shildi. Qancha bo'ldi?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (BIRLIK + WARN): javobda birlik muhim (so'm/soat/sm). warn: birliklarni aralashtirma. check (uzunlik).
  s4: {
    eyebrow: { ru: 'Единицы', uz: 'Birliklar' },
    lead: { ru: 'Не забывай единицу', uz: "Birlikni unutma" },
    kind: 'length', bar: 9, cut: 0,
    warn: { ru: 'В ответе всегда пиши единицу: сумы, часы или сантиметры. Не смешивай их.', uz: "Javobda doim birlikni yozing: so'm, soat yoki santimetr. Ularni aralashtirmang." },
    check_q: { ru: 'Лента девять сантиметров, отрезали четыре. Сколько осталось?', uz: "Tasma to'qqiz santimetr, to'rt santimetr kesildi. Qancha qoldi?" },
    opts: [{ ru: '5 см', uz: '5 sm', ok: true }, { ru: '13 см', uz: '13 sm' }, { ru: '5 сум', uz: "5 so'm" }],
    wrong: { ru: 'Отрезали — вычитаем: девять минус четыре — пять. И это сантиметры, а не сумы.', uz: "Kesildi — ayiramiz: to'qqiz ayirish to'rt — besh. Va bu santimetr, so'm emas." },
    check_ok: { ru: 'Верно! Пять сантиметров.', uz: "To'g'ri! Besh santimetr." },
    audio: {
      ru: [
        'В ответе задачи всегда есть единица.',
        'Деньги — в сумах, время — в часах, длина — в сантиметрах.',
        'Не смешивай единицы: сантиметры это не сумы.',
        'Проверь. Лента девять сантиметров, отрезали четыре. Сколько осталось?'
      ],
      uz: [
        "Masala javobida doim birlik bo'ladi.",
        "Pul — so'mda, vaqt — soatda, uzunlik — santimetrda.",
        "Birliklarni aralashtirmang: santimetr bu so'm emas.",
        "Tekshiring. Tasma to'qqiz santimetr, to'rt santimetr kesildi. Qancha qoldi?"
      ]
    }
  },

  // sTBL — KALIT: so'z-signal → amal (qo'shildi/keldi → +; kesildi/sarfladi/ketdi → −). done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Слова-подсказки', uz: "Ishora-so'zlar" },
    caption: { ru: 'Слова задачи · действие', uz: "Masala so'zi · amal" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Добавили, пришло, всего — сложение. Отрезали, потратили, осталось — вычитание.', uz: "Qo'shildi, keldi, jami — qo'shish. Kesildi, sarflandi, qoldi — ayirish." },
    audio: {
      ru: [
        'Соберём ключ. Слова задачи подсказывают действие.',
        'Добавили, пришло, стало всего — это сложение.',
        'Отрезали, потратили, осталось — это вычитание.'
      ],
      uz: [
        "Kalitni yig'amiz. Masala so'zlari amalni bildiradi.",
        "Qo'shildi, keldi, jami bo'ldi — bu qo'shish.",
        "Kesildi, sarflandi, qoldi — bu ayirish."
      ]
    }
  },

  // s5 — MASHQ MasalaStage (money, qo'shish). distraktor = noto'g'ri amal (M1), bergan son (M3).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'money', coins: [300, 200], q: { ru: 'Было триста сумов, добавили двести. Сколько стало?', uz: "Uch yuz so'm bor edi, ikki yuz qo'shildi. Qancha bo'ldi?" },
        opts: [{ ru: '500 сум', uz: "500 so'm", ok: true }, { ru: '100 сум', uz: "100 so'm", wrong: { ru: 'Добавили — стало больше, надо складывать: триста плюс двести — пятьсот.', uz: "Qo'shildi — ko'paydi, qo'shish kerak: uch yuz qo'shuv ikki yuz — besh yuz." } }, { ru: '300 сум', uz: "300 so'm", wrong: { ru: 'Триста — это только начало. Добавь двести: получится пятьсот.', uz: "Uch yuz — bu faqat boshi. Ikki yuz qo'sh: besh yuz bo'ladi." } }],
        correct_text: { ru: 'Верно. Триста плюс двести — пятьсот сумов.', uz: "To'g'ri. Uch yuz qo'shuv ikki yuz — besh yuz so'm." } },
      { kind: 'money', coins: [500, 100], q: { ru: 'Было пятьсот сумов, пришло сто. Сколько стало?', uz: "Besh yuz so'm bor edi, yuz keldi. Qancha bo'ldi?" },
        opts: [{ ru: '600 сум', uz: "600 so'm", ok: true }, { ru: '400 сум', uz: "400 so'm", wrong: { ru: 'Пришло — стало больше. Пятьсот плюс сто — шестьсот.', uz: "Keldi — ko'paydi. Besh yuz qo'shuv yuz — olti yuz." } }, { ru: '510 сум', uz: "510 so'm", wrong: { ru: 'Считай по сотням: пятьсот плюс сто — шестьсот.', uz: "Yuzliklab sana: besh yuz qo'shuv yuz — olti yuz." } }],
        correct_text: { ru: 'Верно. Пятьсот плюс сто — шестьсот сумов.', uz: "To'g'ri. Besh yuz qo'shuv yuz — olti yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Прочитай задачу, выбери действие и посчитай.', uz: "Masalani o'qing, amalni tanlang va hisoblang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ MasalaStage (amal-tanlash): qaysi amal? opts = qo'shish/ayirish. distraktor = teskari amal (M1).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Какое действие?', uz: "Qaysi amal?" },
    rounds: [
      { kind: 'length', bar: 7, cut: 3, q: { ru: 'Было семь см, отрезали три. Какое действие?', uz: "Yetti sm bor edi, uch kesildi. Qaysi amal?" },
        opts: [{ ru: 'вычитание', uz: 'ayirish', ok: true }, { ru: 'сложение', uz: "qo'shish", wrong: { ru: 'Отрезали — стало меньше. Меньше — это вычитание.', uz: "Kesildi — kamaydi. Kamaydi — bu ayirish." } }],
        correct_text: { ru: 'Верно. Отрезали — вычитание.', uz: "To'g'ri. Kesildi — ayirish." } },
      { kind: 'money', coins: [400, 200], q: { ru: 'Было четыреста сумов, добавили двести. Какое действие?', uz: "To'rt yuz so'm edi, ikki yuz qo'shildi. Qaysi amal?" },
        opts: [{ ru: 'сложение', uz: "qo'shish", ok: true }, { ru: 'вычитание', uz: 'ayirish', wrong: { ru: 'Добавили — стало больше. Больше — это сложение.', uz: "Qo'shildi — ko'paydi. Ko'paydi — bu qo'shish." } }],
        correct_text: { ru: 'Верно. Добавили — сложение.', uz: "To'g'ri. Qo'shildi — qo'shish." } },
      { kind: 'num', q: { ru: 'В отряде было девять человек, трое ушли. Какое действие?', uz: "Otryadда to'qqiz kishi edi, uchtasi ketdi. Qaysi amal?" },
        opts: [{ ru: 'вычитание', uz: 'ayirish', ok: true }, { ru: 'сложение', uz: "qo'shish", wrong: { ru: 'Ушли — стало меньше. Меньше — это вычитание.', uz: "Ketdi — kamaydi. Kamaydi — bu ayirish." } }],
        correct_text: { ru: 'Верно. Ушли — вычитание.', uz: "To'g'ri. Ketdi — ayirish." } }
    ],
    audio: {
      intro: { ru: 'Стало больше или меньше? Выбери действие.', uz: "Ko'paydimi yoki kamaydimi? Amalni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ MasalaStage (length, ayirish). distraktor = qo'shish (M1), birlik (M2).
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'length', bar: 8, cut: 3, q: { ru: 'Лента восемь см, отрезали три. Сколько осталось?', uz: "Tasma sakkiz sm, uch kesildi. Qancha qoldi?" },
        opts: [{ ru: '5 см', uz: '5 sm', ok: true }, { ru: '11 см', uz: '11 sm', wrong: { ru: 'Отрезали — вычитаем, а не складываем: восемь минус три — пять.', uz: "Kesildi — ayiramiz, qo'shmaymiz: sakkiz ayirish uch — besh." } }, { ru: '5 сум', uz: "5 so'm", wrong: { ru: 'Число пять верное, но это сантиметры, а не сумы.', uz: "Besh soni to'g'ri, ammo bu santimetr, so'm emas." } }],
        correct_text: { ru: 'Верно. Восемь минус три — пять сантиметров.', uz: "To'g'ri. Sakkiz ayirish uch — besh santimetr." } },
      { kind: 'length', bar: 10, cut: 6, q: { ru: 'Провод десять см, отрезали шесть. Сколько осталось?', uz: "Sim o'n sm, olti kesildi. Qancha qoldi?" },
        opts: [{ ru: '4 см', uz: '4 sm', ok: true }, { ru: '16 см', uz: '16 sm', wrong: { ru: 'Отрезали — вычитаем: десять минус шесть — четыре.', uz: "Kesildi — ayiramiz: o'n ayirish olti — to'rt." } }, { ru: '6 см', uz: '6 sm', wrong: { ru: 'Шесть — это сколько отрезали. Осталось десять минус шесть — четыре.', uz: "Olti — bu qancha kesilgani. Qolgani o'n ayirish olti — to'rt." } }],
        correct_text: { ru: 'Верно. Десять минус шесть — четыре сантиметра.', uz: "To'g'ri. O'n ayirish olti — to'rt santimetr." } }
    ],
    audio: {
      intro: { ru: 'Отрезали — значит стало меньше. Выбери ответ с единицей.', uz: "Kesildi — demak kamaydi. Birlik bilan javobni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ MasalaStage (time, butun soat). distraktor = noto'g'ri amal, birlik.
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Задача о времени', uz: "Vaqt masalasi" },
    rounds: [
      { kind: 'time', clock: 3, q: { ru: 'Сейчас три часа. Через два часа сколько будет?', uz: "Hozir soat uch. Ikki soatdan keyin nechada bo'ladi?" },
        opts: [{ ru: '5 часов', uz: '5 soat', ok: true }, { ru: '1 час', uz: '1 soat', wrong: { ru: 'Через — значит позже, прибавляем: три плюс два — пять часов.', uz: "Keyin — demak keyinroq, qo'shamiz: uch qo'shuv ikki — besh soat." } }, { ru: '5 см', uz: '5 sm', wrong: { ru: 'Число пять верное, но время в часах, а не в сантиметрах.', uz: "Besh soni to'g'ri, ammo vaqt soatda, santimetrда emas." } }],
        correct_text: { ru: 'Верно. Три плюс два — пять часов.', uz: "To'g'ri. Uch qo'shuv ikki — besh soat." } },
      { kind: 'time', clock: 8, q: { ru: 'Сейчас восемь часов. Два часа назад сколько было?', uz: "Hozir soat sakkiz. Ikki soat oldin nechada edi?" },
        opts: [{ ru: '6 часов', uz: '6 soat', ok: true }, { ru: '10 часов', uz: '10 soat', wrong: { ru: 'Назад — значит раньше, вычитаем: восемь минус два — шесть часов.', uz: "Oldin — demak avvalroq, ayiramiz: sakkiz ayirish ikki — olti soat." } }, { ru: '2 часа', uz: '2 soat', wrong: { ru: 'Два — это сколько прошло. Было восемь минус два — шесть часов.', uz: "Ikki — bu qancha o'tgani. Sakkiz ayirish ikki — olti soat edi." } }],
        correct_text: { ru: 'Верно. Восемь минус два — шесть часов.', uz: "To'g'ri. Sakkiz ayirish ikki — olti soat." } }
    ],
    audio: {
      intro: { ru: 'Через — прибавляй, назад — вычитай. Ответ в часах.', uz: "Keyin — qo'sh, oldin — ayir. Javob soatda." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ MasalaStage (amal-tanlash aralash).
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Какое действие?', uz: "Qaysi amal?" },
    rounds: [
      { kind: 'money', coins: [800], q: { ru: 'Было восемьсот сумов, потратили триста. Какое действие?', uz: "Sakkiz yuz so'm edi, uch yuz sarflandi. Qaysi amal?" },
        opts: [{ ru: 'вычитание', uz: 'ayirish', ok: true }, { ru: 'сложение', uz: "qo'shish", wrong: { ru: 'Потратили — стало меньше. Это вычитание.', uz: "Sarflandi — kamaydi. Bu ayirish." } }],
        correct_text: { ru: 'Верно. Потратили — вычитание.', uz: "To'g'ri. Sarflandi — ayirish." } },
      { kind: 'num', q: { ru: 'На складе было шесть ящиков, привезли ещё четыре. Какое действие?', uz: "Omborda olti quti edi, yana to'rttasi keltirildi. Qaysi amal?" },
        opts: [{ ru: 'сложение', uz: "qo'shish", ok: true }, { ru: 'вычитание', uz: 'ayirish', wrong: { ru: 'Привезли ещё — стало больше. Это сложение.', uz: "Yana keltirildi — ko'paydi. Bu qo'shish." } }],
        correct_text: { ru: 'Верно. Привезли — сложение.', uz: "To'g'ri. Keltirildi — qo'shish." } },
      { kind: 'time', clock: 6, q: { ru: 'Работа шла с шести часов, прошло три часа. Какое действие, чтобы узнать время?', uz: "Ish soat oltidan boshlandi, uch soat o'tdi. Vaqtni bilish uchun qaysi amal?" },
        opts: [{ ru: 'сложение', uz: "qo'shish", ok: true }, { ru: 'вычитание', uz: 'ayirish', wrong: { ru: 'Прошло время — стало позже, прибавляем. Это сложение.', uz: "Vaqt o'tdi — keyinroq bo'ldi, qo'shamiz. Bu qo'shish." } }],
        correct_text: { ru: 'Верно. Время прошло — сложение.', uz: "To'g'ri. Vaqt o'tdi — qo'shish." } }
    ],
    audio: {
      intro: { ru: 'Стало больше или меньше? Выбери действие.', uz: "Ko'paydimi yoki kamaydimi? Amalni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishга qarang." }
    }
  },

  // s10 — MASHQ MasalaStage (money, ayirish). distraktor = qo'shish (M1), sarflangan son (M3).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'money', coins: [800], q: { ru: 'Было восемьсот сумов, потратили триста. Сколько осталось?', uz: "Sakkiz yuz so'm edi, uch yuz sarflandi. Qancha qoldi?" },
        opts: [{ ru: '500 сум', uz: "500 so'm", ok: true }, { ru: '1100 сум', uz: "1100 so'm", wrong: { ru: 'Потратили — вычитаем, а не складываем: восемьсот минус триста — пятьсот.', uz: "Sarflandi — ayiramiz, qo'shmaymiz: sakkiz yuz ayirish uch yuz — besh yuz." } }, { ru: '300 сум', uz: "300 so'm", wrong: { ru: 'Триста — это сколько потратили. Осталось восемьсот минус триста — пятьсот.', uz: "Uch yuz — bu sarflangani. Qolgani sakkiz yuz ayirish uch yuz — besh yuz." } }],
        correct_text: { ru: 'Верно. Восемьсот минус триста — пятьсот сумов.', uz: "To'g'ri. Sakkiz yuz ayirish uch yuz — besh yuz so'm." } },
      { kind: 'money', coins: [1000], q: { ru: 'Было тысяча сумов, потратили четыреста. Сколько осталось?', uz: "Ming so'm edi, to'rt yuz sarflandi. Qancha qoldi?" },
        opts: [{ ru: '600 сум', uz: "600 so'm", ok: true }, { ru: '1400 сум', uz: "1400 so'm", wrong: { ru: 'Потратили — вычитаем: тысяча минус четыреста — шестьсот.', uz: "Sarflandi — ayiramiz: ming ayirish to'rt yuz — olti yuz." } }, { ru: '400 сум', uz: "400 so'm", wrong: { ru: 'Четыреста потратили. Осталось тысяча минус четыреста — шестьсот.', uz: "To'rt yuz sarflandi. Qolgani ming ayirish to'rt yuz — olti yuz." } }],
        correct_text: { ru: 'Верно. Тысяча минус четыреста — шестьсот сумов.', uz: "To'g'ri. Ming ayirish to'rt yuz — olti yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Потратили — стало меньше. Вычитай и не забудь единицу.', uz: "Sarflandi — kamaydi. Ayir va birlikni unutma." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ MasalaStage aralash (vaqt/uzunlik/pul).
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'length', bar: 6, cut: 0, q: { ru: 'Одна лента шесть см, другая четыре см. Какова общая длина?', uz: "Bir tasma olti sm, ikkinchisi to'rt sm. Umumiy uzunlik qancha?" },
        opts: [{ ru: '10 см', uz: '10 sm', ok: true }, { ru: '2 см', uz: '2 sm', wrong: { ru: 'Общая длина — это вместе, складываем: шесть плюс четыре — десять.', uz: "Umumiy uzunlik — birga, qo'shamiz: olti qo'shuv to'rt — o'n." } }, { ru: '10 сум', uz: "10 so'm", wrong: { ru: 'Десять верно, но это сантиметры, не сумы.', uz: "O'n to'g'ri, ammo bu santimetr, so'm emas." } }],
        correct_text: { ru: 'Верно. Шесть плюс четыре — десять сантиметров.', uz: "To'g'ri. Olti qo'shuv to'rt — o'n santimetr." } },
      { kind: 'time', clock: 4, q: { ru: 'Сейчас четыре часа. Через три часа сколько будет?', uz: "Hozir soat to'rt. Uch soatdan keyin nechada bo'ladi?" },
        opts: [{ ru: '7 часов', uz: '7 soat', ok: true }, { ru: '1 час', uz: '1 soat', wrong: { ru: 'Через — прибавляем: четыре плюс три — семь часов.', uz: "Keyin — qo'shamiz: to'rt qo'shuv uch — yetti soat." } }, { ru: '7 см', uz: '7 sm', wrong: { ru: 'Время в часах, а не в сантиметрах.', uz: "Vaqt soatda, santimetrда emas." } }],
        correct_text: { ru: 'Верно. Четыре плюс три — семь часов.', uz: "To'g'ri. To'rt qo'shuv uch — yetti soat." } },
      { kind: 'money', coins: [500, 200], q: { ru: 'Было пятьсот сумов, потратили двести. Сколько осталось?', uz: "Besh yuz so'm edi, ikki yuz sarflandi. Qancha qoldi?" },
        opts: [{ ru: '300 сум', uz: "300 so'm", ok: true }, { ru: '700 сум', uz: "700 so'm", wrong: { ru: 'Потратили — вычитаем: пятьсот минус двести — триста.', uz: "Sarflandi — ayiramiz: besh yuz ayirish ikki yuz — uch yuz." } }, { ru: '200 сум', uz: "200 so'm", wrong: { ru: 'Двести потратили. Осталось пятьсот минус двести — триста.', uz: "Ikki yuz sarflandi. Qolgani besh yuz ayirish ikki yuz — uch yuz." } }],
        correct_text: { ru: 'Верно. Пятьсот минус двести — триста сумов.', uz: "To'g'ri. Besh yuz ayirish ikki yuz — uch yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Читай слова задачи, выбирай действие, пиши единицу.', uz: "Masala so'zlarini o'qing, amalni tanlang, birlikni yozing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Бит на станции.', uz: "Bit stansiyada." },
    audio: { ru: 'Бит решает задачу станции.', uz: "Bit stansiya masalasini yechadi." }
  },

  // s13 — MASALA (MasalaStage single, money ayirish): Bit sarfladi.
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Расчёт Бита', uz: "Bit hisobi" },
    story: { ru: 'У Бита было тысяча сумов. За припасы он отдал шестьсот. Сколько сумов у него осталось?', uz: "Bitda ming so'm bor edi. Oziq-ovqat uchun olti yuz berdi. Unда qancha so'm qoldi?" },
    kind: 'money', coins: [1000],
    q: { ru: 'Сколько осталось у Бита?', uz: "Bitda qancha qoldi?" },
    opts: [
      { ru: '400 сум', uz: "400 so'm", ok: true },
      { ru: '1600 сум', uz: "1600 so'm", wrong: { ru: 'Отдал — стало меньше, вычитаем: тысяча минус шестьсот — четыреста.', uz: "Berdi — kamaydi, ayiramiz: ming ayirish olti yuz — to'rt yuz." } },
      { ru: '600 сум', uz: "600 so'm", wrong: { ru: 'Шестьсот он отдал. Осталось тысяча минус шестьсот — четыреста.', uz: "Olti yuzni berdi. Qolgani ming ayirish olti yuz — to'rt yuz." } }
    ],
    correct_text: { ru: 'Верно. Тысяча минус шестьсот — четыреста сумов.', uz: "To'g'ri. Ming ayirish olti yuz — to'rt yuz so'm." },
    audio: {
      intro: { ru: 'У Бита было тысяча сумов, он отдал шестьсот. Сколько осталось?', uz: "Bitda ming so'm edi, olti yuz berdi. Qancha qoldi?" },
      on_correct: { ru: 'Верно. Осталось четыреста сумов.', uz: "To'g'ri. To'rt yuz so'm qoldi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (aralash ×3 + FactCard Neptun).
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Реши задачу', uz: "Masalani yeching" },
    rounds: [
      { kind: 'money', coins: [500, 500], q: { ru: 'Было пятьсот сумов, добавили пятьсот. Сколько стало?', uz: "Besh yuz so'm edi, besh yuz qo'shildi. Qancha bo'ldi?" },
        opts: [{ ru: '1000 сум', uz: "1000 so'm", ok: true }, { ru: '0 сум', uz: "0 so'm", wrong: { ru: 'Добавили — складываем: пятьсот плюс пятьсот — тысяча.', uz: "Qo'shildi — qo'shamiz: besh yuz qo'shuv besh yuz — ming." } }, { ru: '500 сум', uz: "500 so'm", wrong: { ru: 'Пятьсот — только начало. Плюс пятьсот — тысяча.', uz: "Besh yuz — faqat boshi. Besh yuz qo'shsak — ming." } }],
        correct_text: { ru: 'Верно. Тысяча сумов.', uz: "To'g'ri. Ming so'm." } },
      { kind: 'length', bar: 9, cut: 5, q: { ru: 'Лента девять см, отрезали пять. Сколько осталось?', uz: "Tasma to'qqiz sm, besh kesildi. Qancha qoldi?" },
        opts: [{ ru: '4 см', uz: '4 sm', ok: true }, { ru: '14 см', uz: '14 sm', wrong: { ru: 'Отрезали — вычитаем: девять минус пять — четыре.', uz: "Kesildi — ayiramiz: to'qqiz ayirish besh — to'rt." } }, { ru: '4 сум', uz: "4 so'm", wrong: { ru: 'Четыре верно, но это сантиметры.', uz: "To'rt to'g'ri, ammo bu santimetr." } }],
        correct_text: { ru: 'Верно. Четыре сантиметра.', uz: "To'g'ri. To'rt santimetr." } },
      { kind: 'time', clock: 7, q: { ru: 'Сейчас семь часов. Два часа назад сколько было?', uz: "Hozir soat yetti. Ikki soat oldin nechada edi?" },
        opts: [{ ru: '5 часов', uz: '5 soat', ok: true }, { ru: '9 часов', uz: '9 soat', wrong: { ru: 'Назад — вычитаем: семь минус два — пять часов.', uz: "Oldin — ayiramiz: yetti ayirish ikki — besh soat." } }, { ru: '2 часа', uz: '2 soat', wrong: { ru: 'Два — сколько прошло. Было семь минус два — пять часов.', uz: "Ikki — qancha o'tgani. Yetti ayirish ikki — besh soat edi." } }],
        correct_text: { ru: 'Верно. Пять часов.', uz: "To'g'ri. Besh soat." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'У Нептуна четырнадцать спутников — маленьких лун, что кружат вокруг него.', uz: "Neptunning o'n to'rtta yo'ldoshi bor — uning atrofida aylanadigan kichik oylar." },
    fact_audio: { ru: 'У Нептуна целых четырнадцать спутников. Это маленькие луны вокруг планеты.', uz: "Neptunning o'n to'rtta yo'ldoshi bor. Bular sayyora atrofidagi kichik oylar." },
    audio: {
      intro: { ru: 'Последняя проверка. Выбирай действие и пиши единицу.', uz: "Oxirgi tekshiruv. Amalni tanlang va birlikni yozing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi d.42)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь решать задачи про величины!', uz: "Endi siz kattaliklar haqidagi masalalarni yecha olasiz!" },
    rule_recap: { ru: 'Найди дано и вопрос. Стало больше — сложение, меньше — вычитание. В ответе пиши единицу.', uz: "Berilgan va savolni top. Ko'paydi — qo'shish, kamaydi — ayirish. Javobda birlikni yoz." },
    audio: {
      ru: 'Миссия выполнена. Мы научились решать задачи про величины. Найди, что дано и что спросили. Если стало больше — складывай, если меньше — вычитай. И всегда пиши единицу: сумы, часы или сантиметры. Дальше нас ждёт новая задача.',
      uz: "Missiya bajarildi. Kattaliklar haqidagi masalalarni yechishni o'rgandik. Nima berilgan va so'ralganini top. Ko'paysa — qo'sh, kamaysa — ayir. Va doim birlikni yoz: so'm, soat yoki santimetr. Keyin bizni yangi masala kutmoqda."
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder)

| ekran | kind/vizual | savol turi |
|---|---|---|
| s0 | length (LenBar 8, cut 3) | hook Ha/Yo'q |
| s1–s2 | — | teach (usul, signal) |
| s3 | money (CoinSet 500+200) | rule + check |
| s4 | length (LenBar 9) + warn | birlik check |
| sTBL | — (so'z-signal jadval) | KALIT |
| s5 | money | javob (qo'shish) |
| s6 | length/money/num | AMAL-tanlash (+/−) |
| s7 | length | javob (ayirish) |
| s8 | time (MiniClock) | javob |
| s9 | money/num/time | AMAL-tanlash |
| s10 | money | javob (ayirish) |
| s11 | length/time/money | aralash javob |
| s13 | money (masala) | javob |
| s14 | money/length/time + FactCard | aralash |
| s15 | summary | NeptunField |
