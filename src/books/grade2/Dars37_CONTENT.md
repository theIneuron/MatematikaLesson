# Dars37 — CONTENT (Б6 NEPTUN · «Pul: tanga bilan hisob» · program d.40)

> **Mexanika (metodist 2026-07-17): ARALASH** — pul sanash (teach + qoida) + summa yig'ish / solishtirish (mashq).
> **Nominal (metodist qarori): REAL UZ — 100, 200, 500, 1000 so'm.** Summalar ≤ ~2000 (100 ga karrali). 1000 so'm = banknota, qolgani tanga.
> Klon-baza: **Dars36.jsx** (Neptun biom + siz-registr). Yangi: `CoinFig` (bitta tanga/banknota nominal bilan) + `CoinSet` (qator) +
> `MoneyMCStage` (CoinSet → summa / solishtirish, MC) · `GatherStage` (summa → mos to'plamni tanla).
> Ko'prik (d.38/39): pulni QIYMAT bo'yicha sanaymiz (dona bo'yicha emas) — daqiqani 5 tadan sanagandek.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **Nominal real UZ (100/200/500/1000 so'm)** — metodist tanlovi. Sonlar yuzlik/minglik; grade-2 qo'shish ko'lamidan kengroq,
   ammo 100 ga karrali (yuzliklarni sanash). Summalar ≤ ~2000.
2. **UZ atamalar (draft):** pul = деньги, tanga = монета, so'm; «uch yuz so'm», «jami». Xaydarov darsligiga solishtirilmagan.
3. Misconception M1 (asosiy): tanga DONA sini sanash (3 tanga = 3 so'm). Har tangada QIYMAT bor — shu sanaladi.

---

```javascript
const CONTENT = {
  // s0 — HOOK: 3 tanga (100+200+100=400). Kimdir «3 so'm» dedi (donani sanadi). To'g'rimi? Yo'q (400).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Деньги', uz: "Mavzu: Pul" },
    lead: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    q: { ru: 'На столе три монеты. Кто-то сказал: тут три сума, ведь монет три. Это верно?', uz: "Stolda uchta tanga. Kimdir aytdi: bu yerda uch so'm, chunki tanga uchta. Bu to'g'rimi?" },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на станции у Нептуна, на пункте обмена. Бит считает деньги.',
          'На столе три монеты: сто, двести и снова сто сумов.',
          'Кто-то сказал: тут три сума, ведь монет три штуки. Но он посчитал штуки, а не стоимость.',
          'Как думаешь, это верно? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidagi stansiyadamiz, almashuv shoxobchasida. Bit pul sanayapti.",
          "Stolda uchta tanga: yuz, ikki yuz va yana yuz so'm.",
          "Kimdir aytdi: bu yerda uch so'm, chunki tanga uch dona. Ammo u donani sanadi, qiymatni emas.",
          "Sizningcha, bu to'g'rimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Считать надо стоимость: сто плюс двести плюс сто — четыреста сумов.', uz: "To'g'ri. Qiymatni sanash kerak: yuz qo'shuv ikki yuz qo'shuv yuz — to'rt yuz so'm." },
      on_wrong: { ru: 'Считать надо не штуки, а стоимость монет. Сейчас разберём.', uz: "Donani emas, tangalarning qiymatini sanash kerak. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня научимся считать деньги.', uz: "Hechqisi yo'q. Bugun pul sanashni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: CoinSet. Har tangada qiymat; qiymat bo'yicha sana (100+200=300). 4 seg step-reveal.
  s1: {
    eyebrow: { ru: 'Деньги', uz: 'Pul' },
    lead: { ru: 'У каждой монеты своя стоимость', uz: "Har tanganing o'z qiymati bor" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Деньги считают по стоимости монет, а не по их числу. Складывай значения.', uz: "Pul tangalarning soni bo'yicha emas, qiymati bo'yicha sanaladi. Qiymatlarni qo'shing." },
    audio: {
      ru: [
        'Посмотри на монеты. На каждой написана её стоимость.',
        'Здесь монета сто сумов и монета двести сумов.',
        'Чтобы узнать, сколько всего, складываем стоимость: сто плюс двести.',
        'Получается триста сумов. Считаем по стоимости, а не по числу монет.'
      ],
      uz: [
        "Tangalarga qarang. Har birida uning qiymati yozilgan.",
        "Bu yerda yuz so'mlik tanga va ikki yuz so'mlik tanga bor.",
        "Jami qancha ekanini bilish uchun qiymatni qo'shamiz: yuz qo'shuv ikki yuz.",
        "Uch yuz so'm bo'ladi. Qiymat bo'yicha sanaymiz, tanga soni bo'yicha emas."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: summani yig'ish. 300 so'm = 100 + 200. 4 seg.
  s2: {
    eyebrow: { ru: 'Собрать сумму', uz: 'Summa yig\'ish' },
    lead: { ru: 'Как собрать сумму', uz: "Summani qanday yig'ish" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Чтобы собрать сумму, подбери монеты так, чтобы их стоимость вместе дала нужное число.', uz: "Summani yig'ish uchun tangalarni shunday tanlangki, ularning qiymati birga kerakli sonni bersin." },
    audio: {
      ru: [
        'Теперь наоборот: нужно собрать триста сумов.',
        'Возьмём монету сто сумов и монету двести сумов.',
        'Сто плюс двести — это триста. Сумма собрана.',
        'Можно собрать одну сумму разными монетами.'
      ],
      uz: [
        "Endi aksincha: uch yuz so'm yig'ish kerak.",
        "Yuz so'mlik tanga va ikki yuz so'mlik tanga olamiz.",
        "Yuz qo'shuv ikki yuz — bu uch yuz. Summa yig'ildi.",
        "Bitta summani har xil tangalar bilan yig'ish mumkin."
      ]
    }
  },

  // s3 — QOIDA: tangalarning QIYMATini qo'sh (sonini emas) + check (200+100 → 300).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Чтобы посчитать деньги, складывай стоимость монет, а не их количество.', uz: "Pulni sanash uchun tangalarning qiymatini qo'shing, ularning sonini emas." },
    coins: [200, 100],
    check_q: { ru: 'Монеты двести и сто сумов. Сколько всего?', uz: "Ikki yuz va yuz so'mlik tangalar. Jami qancha?" },
    opts: [{ ru: '300 so\'m', uz: "300 so'm", ok: true }, { ru: '2 so\'m', uz: "2 so'm" }, { ru: '210 so\'m', uz: "210 so'm" }],
    wrong: { ru: 'Складывай стоимость: двести плюс сто — триста сумов. Число монет тут ни при чём.', uz: "Qiymatni qo'shing: ikki yuz qo'shuv yuz — uch yuz so'm. Tanga soni bu yerda ahamiyatsiz." },
    check_ok: { ru: 'Верно! Двести плюс сто — триста сумов.', uz: "To'g'ri! Ikki yuz qo'shuv yuz — uch yuz so'm." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Чтобы посчитать деньги, складывай стоимость монет.',
        'Не их количество, а именно стоимость.',
        'Проверь. Монеты двести и сто сумов. Сколько всего?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Pulni sanash uchun tangalarning qiymatini qo'shing.",
        "Ularning sonini emas, aynan qiymatini.",
        "Tekshiring. Ikki yuz va yuz so'mlik tangalar. Jami qancha?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (SOLISHTIRISH + WARN): ko'p tanga ≠ ko'p pul. Ikki 100 (200) < bitta 500. check (qaysi ko'p?).
  s4: {
    eyebrow: { ru: 'Сравнение', uz: 'Solishtirish' },
    lead: { ru: 'Больше монет — не всегда больше денег', uz: "Ko'p tanga — har doim ko'p pul emas" },
    coinsA: [100, 100],
    coinsB: [500],
    warn: { ru: 'Не смотри на число монет. Две монеты по сто — это двести, а одна монета пятьсот — это больше.', uz: "Tanga soniga qaramang. Ikkita yuz so'mlik — bu ikki yuz, bitta besh yuz so'mlik esa — ko'proq." },
    check_q: { ru: 'Где денег больше: две монеты по сто или одна монета пятьсот?', uz: "Qayerda pul ko'p: ikkita yuz so'mlik yoki bitta besh yuz so'mlik?" },
    opts: [{ ru: 'одна 500', uz: "bitta 500", ok: true }, { ru: 'две по 100', uz: "ikkita 100" }, { ru: 'поровну', uz: 'teng' }],
    wrong: { ru: 'Две по сто — это двести сумов. А пятьсот больше двухсот. Считай стоимость, не штуки.', uz: "Ikkita yuz — bu ikki yuz so'm. Besh yuz ikki yuzdan katta. Qiymatni sanang, donani emas." },
    check_ok: { ru: 'Верно! Пятьсот больше, чем двести. Монет меньше, а денег больше.', uz: "To'g'ri! Besh yuz ikki yuzdan katta. Tanga kam, pul ko'p." },
    audio: {
      ru: [
        'Сравним деньги. Слева две монеты по сто, справа одна монета пятьсот.',
        'Монет слева больше, но денег меньше: две по сто — это двести.',
        'А одна монета пятьсот — это пятьсот сумов, больше.',
        'Проверь. Где денег больше: две по сто или одна пятьсот?'
      ],
      uz: [
        "Pulni solishtiramiz. Chapda ikkita yuz so'mlik, o'ngda bitta besh yuz so'mlik.",
        "Chapda tanga ko'p, ammo pul kam: ikkita yuz — bu ikki yuz.",
        "Bitta besh yuz so'mlik esa — besh yuz so'm, ko'proq.",
        "Tekshiring. Qayerda pul ko'p: ikkita yuz yoki bitta besh yuz?"
      ]
    }
  },

  // sTBL — KALIT: nominal 100 · 200 · 500 · 1000 so'm. done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Наши деньги', uz: "Bizning pullarimiz" },
    caption: { ru: 'Монеты и купюра', uz: "Tanga va banknota" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Есть монеты сто, двести и пятьсот сумов и купюра тысяча сумов. Считай по стоимости.', uz: "Yuz, ikki yuz va besh yuz so'mlik tangalar hamda ming so'mlik banknota bor. Qiymat bo'yicha sanang." },
    audio: {
      ru: [
        'Соберём ключ. Вот наши деньги.',
        'Монеты: сто, двести и пятьсот сумов.',
        'И купюра тысяча сумов. Считаем деньги по стоимости.'
      ],
      uz: [
        "Kalitni yig'amiz. Mana bizning pullarimiz.",
        "Tangalar: yuz, ikki yuz va besh yuz so'm.",
        "Va ming so'mlik banknota. Pulni qiymat bo'yicha sanaymiz."
      ]
    }
  },

  // s5 — MASHQ CountMoneyStage: to'plam → jami. distraktor = dona soni (M1), noto'g'ri yig'indi (M4).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    rounds: [
      { coins: [100, 200, 100], q: { ru: 'Посчитай сумму монет.', uz: "Tangalar summasini hisoblang." },
        opts: [{ ru: '400 so\'m', uz: "400 so'm", ok: true }, { ru: '3 so\'m', uz: "3 so'm", wrong: { ru: 'Ты посчитал число монет, а не стоимость. Сто плюс двести плюс сто — четыреста.', uz: "Siz tanga sonini sanadingiz, qiymatini emas. Yuz qo'shuv ikki yuz qo'shuv yuz — to'rt yuz." } }, { ru: '300 so\'m', uz: "300 so'm", wrong: { ru: 'Ты забыл одну монету сто. Сто плюс двести плюс сто — четыреста.', uz: "Bitta yuz so'mlikni unutdingiz. Yuz qo'shuv ikki yuz qo'shuv yuz — to'rt yuz." } }],
        correct_text: { ru: 'Верно. Сто плюс двести плюс сто — четыреста сумов.', uz: "To'g'ri. Yuz qo'shuv ikki yuz qo'shuv yuz — to'rt yuz so'm." } },
      { coins: [500, 200], q: { ru: 'Посчитай сумму монет.', uz: "Tangalar summasini hisoblang." },
        opts: [{ ru: '700 so\'m', uz: "700 so'm", ok: true }, { ru: '2 so\'m', uz: "2 so'm", wrong: { ru: 'Это число монет, а не деньги. Пятьсот плюс двести — семьсот.', uz: "Bu tanga soni, pul emas. Besh yuz qo'shuv ikki yuz — yetti yuz." } }, { ru: '520 so\'m', uz: "520 so'm", wrong: { ru: 'Складывай сотнями: пятьсот плюс двести — семьсот.', uz: "Yuzliklab qo'shing: besh yuz qo'shuv ikki yuz — yetti yuz." } }],
        correct_text: { ru: 'Верно. Пятьсот плюс двести — семьсот сумов.', uz: "To'g'ri. Besh yuz qo'shuv ikki yuz — yetti yuz so'm." } },
      { coins: [200, 200, 100], q: { ru: 'Посчитай сумму монет.', uz: "Tangalar summasini hisoblang." },
        opts: [{ ru: '500 so\'m', uz: "500 so'm", ok: true }, { ru: '3 so\'m', uz: "3 so'm", wrong: { ru: 'Три — это число монет. Двести плюс двести плюс сто — пятьсот.', uz: "Uch — bu tanga soni. Ikki yuz qo'shuv ikki yuz qo'shuv yuz — besh yuz." } }, { ru: '410 so\'m', uz: "410 so'm", wrong: { ru: 'Считай по сотням: двести плюс двести плюс сто — пятьсот.', uz: "Yuzliklab sanang: ikki yuz qo'shuv ikki yuz qo'shuv yuz — besh yuz." } }],
        correct_text: { ru: 'Верно. Двести плюс двести плюс сто — пятьсот сумов.', uz: "To'g'ri. Ikki yuz qo'shuv ikki yuz qo'shuv yuz — besh yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Сложи стоимость всех монет и выбери, сколько всего.', uz: "Barcha tangalarning qiymatini qo'shing va jami qancha ekanini tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ GatherStage: kerakli summa → mos to'plam. distraktor = kam/ortiq (M3).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Собери сумму', uz: "Summani yig'ing" },
    rounds: [
      { amount: 300, q: { ru: 'Какой набор даёт триста сумов?', uz: "Qaysi to'plam uch yuz so'm beradi?" },
        choices: [{ coins: [100, 200], ok: true }, { coins: [100, 100] }, { coins: [500] }],
        wrong: { ru: 'Нужно триста. Сто плюс двести — триста. Проверь стоимость набора.', uz: "Uch yuz kerak. Yuz qo'shuv ikki yuz — uch yuz. To'plam qiymatini tekshiring." },
        correct_text: { ru: 'Верно. Сто плюс двести — триста сумов.', uz: "To'g'ri. Yuz qo'shuv ikki yuz — uch yuz so'm." } },
      { amount: 700, q: { ru: 'Какой набор даёт семьсот сумов?', uz: "Qaysi to'plam yetti yuz so'm beradi?" },
        choices: [{ coins: [500, 200], ok: true }, { coins: [500, 100] }, { coins: [200, 200] }],
        wrong: { ru: 'Нужно семьсот. Пятьсот плюс двести — семьсот.', uz: "Yetti yuz kerak. Besh yuz qo'shuv ikki yuz — yetti yuz." },
        correct_text: { ru: 'Верно. Пятьсот плюс двести — семьсот сумов.', uz: "To'g'ri. Besh yuz qo'shuv ikki yuz — yetti yuz so'm." } },
      { amount: 400, q: { ru: 'Какой набор даёт четыреста сумов?', uz: "Qaysi to'plam to'rt yuz so'm beradi?" },
        choices: [{ coins: [200, 200], ok: true }, { coins: [100, 200] }, { coins: [500] }],
        wrong: { ru: 'Нужно четыреста. Двести плюс двести — четыреста.', uz: "To'rt yuz kerak. Ikki yuz qo'shuv ikki yuz — to'rt yuz." },
        correct_text: { ru: 'Верно. Двести плюс двести — четыреста сумов.', uz: "To'g'ri. Ikki yuz qo'shuv ikki yuz — to'rt yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Выбери набор монет, стоимость которого равна нужной сумме.', uz: "Qiymati kerakli summaga teng bo'lgan tanga to'plamini tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ CountMoneyStage: 1000 bilan. distraktor = dona / noto'g'ri.
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    rounds: [
      { coins: [500, 500], q: { ru: 'Посчитай сумму.', uz: "Summani hisoblang." },
        opts: [{ ru: '1000 so\'m', uz: "1000 so'm", ok: true }, { ru: '2 so\'m', uz: "2 so'm", wrong: { ru: 'Две монеты — это число, а не деньги. Пятьсот плюс пятьсот — тысяча.', uz: "Ikki tanga — bu son, pul emas. Besh yuz qo'shuv besh yuz — ming." } }, { ru: '550 so\'m', uz: "550 so'm", wrong: { ru: 'Пятьсот плюс пятьсот — это тысяча сумов.', uz: "Besh yuz qo'shuv besh yuz — bu ming so'm." } }],
        correct_text: { ru: 'Верно. Пятьсот плюс пятьсот — тысяча сумов.', uz: "To'g'ri. Besh yuz qo'shuv besh yuz — ming so'm." } },
      { coins: [1000, 200], q: { ru: 'Посчитай сумму.', uz: "Summani hisoblang." },
        opts: [{ ru: '1200 so\'m', uz: "1200 so'm", ok: true }, { ru: '2 so\'m', uz: "2 so'm", wrong: { ru: 'Это штуки. Тысяча плюс двести — тысяча двести.', uz: "Bu dona. Ming qo'shuv ikki yuz — ming ikki yuz." } }, { ru: '3000 so\'m', uz: "3000 so'm", wrong: { ru: 'Тысяча плюс двести — тысяча двести, не три тысячи.', uz: "Ming qo'shuv ikki yuz — ming ikki yuz, uch ming emas." } }],
        correct_text: { ru: 'Верно. Тысяча плюс двести — тысяча двести сумов.', uz: "To'g'ri. Ming qo'shuv ikki yuz — ming ikki yuz so'm." } },
      { coins: [100, 100, 100, 200], q: { ru: 'Посчитай сумму.', uz: "Summani hisoblang." },
        opts: [{ ru: '500 so\'m', uz: "500 so'm", ok: true }, { ru: '4 so\'m', uz: "4 so'm", wrong: { ru: 'Четыре — это число монет. Сто плюс сто плюс сто плюс двести — пятьсот.', uz: "To'rt — bu tanga soni. Yuz qo'shuv yuz qo'shuv yuz qo'shuv ikki yuz — besh yuz." } }, { ru: '320 so\'m', uz: "320 so'm", wrong: { ru: 'Считай по сотням: три сотни и двести — пятьсот.', uz: "Yuzliklab sanang: uchta yuz va ikki yuz — besh yuz." } }],
        correct_text: { ru: 'Верно. Три по сто и двести — пятьсот сумов.', uz: "To'g'ri. Uchta yuz va ikki yuz — besh yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Здесь есть и купюра тысяча. Сложи всю стоимость.', uz: "Bu yerda ming so'mlik banknota ham bor. Butun qiymatni qo'shing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ CompareMoneyStage: qaysi to'plamda ko'p. distraktor = tanga soni (M2).
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Где денег больше?', uz: "Qayerda pul ko'p?" },
    rounds: [
      { a: [500], b: [100, 100], q: { ru: 'В каком наборе больше денег?', uz: "Qaysi to'plamda pul ko'p?" },
        opts: [{ ru: 'слева', uz: 'chapda', ok: true }, { ru: 'справа', uz: "o'ngda", wrong: { ru: 'Справа две монеты, но всего двести. Слева пятьсот — больше.', uz: "O'ngda ikki tanga, ammo jami ikki yuz. Chapda besh yuz — ko'proq." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Пятьсот и двести не равны. Слева больше.', uz: "Besh yuz va ikki yuz teng emas. Chapda ko'proq." } }],
        correct_text: { ru: 'Верно. Слева пятьсот, справа двести. Слева больше.', uz: "To'g'ri. Chapda besh yuz, o'ngda ikki yuz. Chapda ko'proq." } },
      { a: [200, 200], b: [500], q: { ru: 'В каком наборе больше денег?', uz: "Qaysi to'plamda pul ko'p?" },
        opts: [{ ru: 'справа', uz: "o'ngda", ok: true }, { ru: 'слева', uz: 'chapda', wrong: { ru: 'Слева две монеты, но всего четыреста. Справа пятьсот — больше.', uz: "Chapda ikki tanga, ammo jami to'rt yuz. O'ngda besh yuz — ko'proq." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Четыреста и пятьсот не равны. Справа больше.', uz: "To'rt yuz va besh yuz teng emas. O'ngda ko'proq." } }],
        correct_text: { ru: 'Верно. Слева четыреста, справа пятьсот. Справа больше.', uz: "To'g'ri. Chapda to'rt yuz, o'ngda besh yuz. O'ngda ko'proq." } },
      { a: [1000], b: [500, 500], q: { ru: 'В каком наборе больше денег?', uz: "Qaysi to'plamda pul ko'p?" },
        opts: [{ ru: 'поровну', uz: 'teng', ok: true }, { ru: 'слева', uz: 'chapda', wrong: { ru: 'Слева тысяча. Справа пятьсот плюс пятьсот — тоже тысяча. Поровну.', uz: "Chapda ming. O'ngda besh yuz qo'shuv besh yuz — bu ham ming. Teng." } }, { ru: 'справа', uz: "o'ngda", wrong: { ru: 'Справа две монеты, но их сумма тысяча — как слева. Поровну.', uz: "O'ngda ikki tanga, ammo ularning summasi ming — chapdagidek. Teng." } }],
        correct_text: { ru: 'Верно. И слева, и справа тысяча сумов. Поровну.', uz: "To'g'ri. Chapda ham, o'ngda ham ming so'm. Teng." } }
    ],
    audio: {
      intro: { ru: 'Посчитай стоимость каждого набора и выбери, где денег больше.', uz: "Har to'plamning qiymatini sanang va qayerda pul ko'p ekanini tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ GatherStage: summa yig'ish (aralash, 1000 bilan).
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Собери сумму', uz: "Summani yig'ing" },
    rounds: [
      { amount: 1000, q: { ru: 'Какой набор даёт тысячу сумов?', uz: "Qaysi to'plam ming so'm beradi?" },
        choices: [{ coins: [500, 500], ok: true }, { coins: [500, 200] }, { coins: [200, 200, 200] }],
        wrong: { ru: 'Нужна тысяча. Пятьсот плюс пятьсот — тысяча.', uz: "Ming kerak. Besh yuz qo'shuv besh yuz — ming." },
        correct_text: { ru: 'Верно. Пятьсот плюс пятьсот — тысяча сумов.', uz: "To'g'ri. Besh yuz qo'shuv besh yuz — ming so'm." } },
      { amount: 600, q: { ru: 'Какой набор даёт шестьсот сумов?', uz: "Qaysi to'plam olti yuz so'm beradi?" },
        choices: [{ coins: [500, 100], ok: true }, { coins: [200, 200] }, { coins: [500, 200] }],
        wrong: { ru: 'Нужно шестьсот. Пятьсот плюс сто — шестьсот.', uz: "Olti yuz kerak. Besh yuz qo'shuv yuz — olti yuz." },
        correct_text: { ru: 'Верно. Пятьсот плюс сто — шестьсот сумов.', uz: "To'g'ri. Besh yuz qo'shuv yuz — olti yuz so'm." } },
      { amount: 1200, q: { ru: 'Какой набор даёт тысячу двести сумов?', uz: "Qaysi to'plam ming ikki yuz so'm beradi?" },
        choices: [{ coins: [1000, 200], ok: true }, { coins: [1000, 100] }, { coins: [500, 500] }],
        wrong: { ru: 'Нужно тысяча двести. Тысяча плюс двести — тысяча двести.', uz: "Ming ikki yuz kerak. Ming qo'shuv ikki yuz — ming ikki yuz." },
        correct_text: { ru: 'Верно. Тысяча плюс двести — тысяча двести сумов.', uz: "To'g'ri. Ming qo'shuv ikki yuz — ming ikki yuz so'm." } }
    ],
    audio: {
      intro: { ru: 'Собери нужную сумму. Складывай стоимость монет.', uz: "Kerakli summani yig'ing. Tangalar qiymatini qo'shing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ CountMoneyStage aralash (kattaroq summalar).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
    rounds: [
      { coins: [1000, 500, 200], q: { ru: 'Посчитай сумму.', uz: "Summani hisoblang." },
        opts: [{ ru: '1700 so\'m', uz: "1700 so'm", ok: true }, { ru: '3 so\'m', uz: "3 so'm", wrong: { ru: 'Три — число монет. Тысяча плюс пятьсот плюс двести — тысяча семьсот.', uz: "Uch — tanga soni. Ming qo'shuv besh yuz qo'shuv ikki yuz — ming yetti yuz." } }, { ru: '1520 so\'m', uz: "1520 so'm", wrong: { ru: 'Складывай по сотням: тысяча, пятьсот, двести — тысяча семьсот.', uz: "Yuzliklab qo'shing: ming, besh yuz, ikki yuz — ming yetti yuz." } }],
        correct_text: { ru: 'Верно. Тысяча семьсот сумов.', uz: "To'g'ri. Ming yetti yuz so'm." } },
      { coins: [500, 500, 500], q: { ru: 'Посчитай сумму.', uz: "Summani hisoblang." },
        opts: [{ ru: '1500 so\'m', uz: "1500 so'm", ok: true }, { ru: '3 so\'m', uz: "3 so'm", wrong: { ru: 'Три — это штуки. Пятьсот три раза — тысяча пятьсот.', uz: "Uch — bu dona. Besh yuz uch marta — ming besh yuz." } }, { ru: '1050 so\'m', uz: "1050 so'm", wrong: { ru: 'Пятьсот плюс пятьсот плюс пятьсот — тысяча пятьсот.', uz: "Besh yuz qo'shuv besh yuz qo'shuv besh yuz — ming besh yuz." } }],
        correct_text: { ru: 'Верно. Три по пятьсот — тысяча пятьсот сумов.', uz: "To'g'ri. Uchta besh yuz — ming besh yuz so'm." } },
      { coins: [1000, 1000], q: { ru: 'Посчитай сумму.', uz: "Summani hisoblang." },
        opts: [{ ru: '2000 so\'m', uz: "2000 so'm", ok: true }, { ru: '2 so\'m', uz: "2 so'm", wrong: { ru: 'Две — число купюр. Тысяча плюс тысяча — две тысячи.', uz: "Ikki — banknota soni. Ming qo'shuv ming — ikki ming." } }, { ru: '1100 so\'m', uz: "1100 so'm", wrong: { ru: 'Тысяча плюс тысяча — две тысячи сумов.', uz: "Ming qo'shuv ming — ikki ming so'm." } }],
        correct_text: { ru: 'Верно. Тысяча плюс тысяча — две тысячи сумов.', uz: "To'g'ri. Ming qo'shuv ming — ikki ming so'm." } }
    ],
    audio: {
      intro: { ru: 'Сложи всю стоимость, считай по сотням и тысячам.', uz: "Butun qiymatni qo'shing, yuzlik va minglab sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ CompareMoneyStage aralash.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Где денег больше?', uz: "Qayerda pul ko'p?" },
    rounds: [
      { a: [500, 200], b: [1000], q: { ru: 'В каком наборе больше денег?', uz: "Qaysi to'plamda pul ko'p?" },
        opts: [{ ru: 'справа', uz: "o'ngda", ok: true }, { ru: 'слева', uz: 'chapda', wrong: { ru: 'Слева две монеты, всего семьсот. Справа тысяча — больше.', uz: "Chapda ikki tanga, jami yetti yuz. O'ngda ming — ko'proq." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Семьсот и тысяча не равны. Справа больше.', uz: "Yetti yuz va ming teng emas. O'ngda ko'proq." } }],
        correct_text: { ru: 'Верно. Слева семьсот, справа тысяча. Справа больше.', uz: "To'g'ri. Chapda yetti yuz, o'ngda ming. O'ngda ko'proq." } },
      { a: [1000, 100], b: [500, 500, 100], q: { ru: 'В каком наборе больше денег?', uz: "Qaysi to'plamda pul ko'p?" },
        opts: [{ ru: 'поровну', uz: 'teng', ok: true }, { ru: 'слева', uz: 'chapda', wrong: { ru: 'Слева тысяча сто. Справа пятьсот, пятьсот, сто — тоже тысяча сто. Поровну.', uz: "Chapda ming yuz. O'ngda besh yuz, besh yuz, yuz — bu ham ming yuz. Teng." } }, { ru: 'справа', uz: "o'ngda", wrong: { ru: 'Справа больше монет, но сумма такая же — тысяча сто. Поровну.', uz: "O'ngda tanga ko'p, ammo summa bir xil — ming yuz. Teng." } }],
        correct_text: { ru: 'Верно. И там, и там тысяча сто сумов. Поровну.', uz: "To'g'ri. U yerda ham, bu yerda ham ming yuz so'm. Teng." } },
      { a: [200, 200, 200], b: [500, 200], q: { ru: 'В каком наборе больше денег?', uz: "Qaysi to'plamda pul ko'p?" },
        opts: [{ ru: 'справа', uz: "o'ngda", ok: true }, { ru: 'слева', uz: 'chapda', wrong: { ru: 'Слева три монеты, всего шестьсот. Справа семьсот — больше.', uz: "Chapda uch tanga, jami olti yuz. O'ngda yetti yuz — ko'proq." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Шестьсот и семьсот не равны. Справа больше.', uz: "Olti yuz va yetti yuz teng emas. O'ngda ko'proq." } }],
        correct_text: { ru: 'Верно. Слева шестьсот, справа семьсот. Справа больше.', uz: "To'g'ri. Chapda olti yuz, o'ngda yetti yuz. O'ngda ko'proq." } }
    ],
    audio: {
      intro: { ru: 'Посчитай оба набора по стоимости и сравни.', uz: "Ikkala to'plamni qiymat bo'yicha sanang va solishtiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Бит на обмене.', uz: "Bit almashuvda." },
    audio: { ru: 'Бит платит за припасы на станции.', uz: "Bit stansiyada oziq-ovqat uchun to'laydi." }
  },

  // s13 — MASALA (CountMoneyStage single): Bit oziq-ovqatga to'laydi — jami qancha?
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Оплата на станции', uz: "Stansiyada to'lov" },
    story: { ru: 'Бит платит за припасы монетами: пятьсот, двести и сто сумов. Сколько он заплатил всего?', uz: "Bit oziq-ovqat uchun tangalar bilan to'laydi: besh yuz, ikki yuz va yuz so'm. U jami qancha to'ladi?" },
    coins: [500, 200, 100],
    q: { ru: 'Сколько заплатил Бит?', uz: "Bit qancha to'ladi?" },
    opts: [
      { ru: '800 so\'m', uz: "800 so'm", ok: true },
      { ru: '3 so\'m', uz: "3 so'm", wrong: { ru: 'Три — это число монет. Пятьсот плюс двести плюс сто — восемьсот.', uz: "Uch — bu tanga soni. Besh yuz qo'shuv ikki yuz qo'shuv yuz — sakkiz yuz." } },
      { ru: '710 so\'m', uz: "710 so'm", wrong: { ru: 'Считай по сотням: пятьсот, двести, сто — восемьсот.', uz: "Yuzliklab sanang: besh yuz, ikki yuz, yuz — sakkiz yuz." } }
    ],
    correct_text: { ru: 'Верно. Пятьсот плюс двести плюс сто — восемьсот сумов.', uz: "To'g'ri. Besh yuz qo'shuv ikki yuz qo'shuv yuz — sakkiz yuz so'm." },
    audio: {
      intro: { ru: 'Бит платит монетами пятьсот, двести и сто сумов. Сколько всего он заплатил?', uz: "Bit besh yuz, ikki yuz va yuz so'mlik tangalar bilan to'laydi. U jami qancha to'ladi?" },
      on_correct: { ru: 'Верно. Восемьсот сумов.', uz: "To'g'ri. Sakkiz yuz so'm." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (aralash count/compare ×3 + FactCard Neptun).
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Деньги', uz: "Pul" },
    rounds: [
      { kind: 'count', coins: [500, 500], q: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
        opts: [{ ru: '1000 so\'m', uz: "1000 so'm", ok: true }, { ru: '2 so\'m', uz: "2 so'm", wrong: { ru: 'Две — число монет. Пятьсот плюс пятьсот — тысяча.', uz: "Ikki — tanga soni. Besh yuz qo'shuv besh yuz — ming." } }, { ru: '550 so\'m', uz: "550 so'm", wrong: { ru: 'Пятьсот плюс пятьсот — тысяча сумов.', uz: "Besh yuz qo'shuv besh yuz — ming so'm." } }],
        correct_text: { ru: 'Верно. Тысяча сумов.', uz: "To'g'ri. Ming so'm." } },
      { kind: 'compare', a: [1000], b: [500, 200], q: { ru: 'Где денег больше?', uz: "Qayerda pul ko'p?" },
        opts: [{ ru: 'слева', uz: 'chapda', ok: true }, { ru: 'справа', uz: "o'ngda", wrong: { ru: 'Справа семьсот, слева тысяча. Слева больше.', uz: "O'ngda yetti yuz, chapda ming. Chapda ko'proq." } }, { ru: 'поровну', uz: 'teng', wrong: { ru: 'Тысяча и семьсот не равны. Слева больше.', uz: "Ming va yetti yuz teng emas. Chapda ko'proq." } }],
        correct_text: { ru: 'Верно. Слева тысяча, справа семьсот. Слева больше.', uz: "To'g'ri. Chapda ming, o'ngda yetti yuz. Chapda ko'proq." } },
      { kind: 'count', coins: [200, 200, 100], q: { ru: 'Сколько всего денег?', uz: "Jami qancha pul?" },
        opts: [{ ru: '500 so\'m', uz: "500 so'm", ok: true }, { ru: '3 so\'m', uz: "3 so'm", wrong: { ru: 'Три — штуки. Двести плюс двести плюс сто — пятьсот.', uz: "Uch — dona. Ikki yuz qo'shuv ikki yuz qo'shuv yuz — besh yuz." } }, { ru: '410 so\'m', uz: "410 so'm", wrong: { ru: 'Считай по сотням: двести, двести, сто — пятьсот.', uz: "Yuzliklab sanang: ikki yuz, ikki yuz, yuz — besh yuz." } }],
        correct_text: { ru: 'Верно. Пятьсот сумов.', uz: "To'g'ri. Besh yuz so'm." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Нептун такой далёкий, что свет Солнца идёт до него больше четырёх часов.', uz: "Neptun shunchalik uzoqki, Quyosh nuri ungacha to'rt soatdan ko'proq yo'l bosadi." },
    fact_audio: { ru: 'Нептун так далеко, что свет Солнца летит до него больше четырёх часов.', uz: "Neptun shunchalik uzoqki, Quyosh nuri ungacha to'rt soatdan ko'proq uchadi." },
    audio: {
      intro: { ru: 'Последняя проверка. Считай деньги по стоимости.', uz: "Oxirgi tekshiruv. Pulni qiymat bo'yicha sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi d.41 kattalik-masala)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь считать деньги!', uz: "Endi siz pul sanay olasiz!" },
    rule_recap: { ru: 'Деньги считают по стоимости монет, а не по их числу. Больше монет — не всегда больше денег.', uz: "Pul tangalarning qiymati bo'yicha sanaladi, soni bo'yicha emas. Ko'p tanga — har doim ko'p pul emas." },
    audio: {
      ru: 'Миссия выполнена. Мы научились считать деньги. Деньги считают по стоимости монет, а не по их числу. И помни: больше монет — не всегда больше денег. Дальше будем решать задачи про величины.',
      uz: "Missiya bajarildi. Pul sanashni o'rgandik. Pul tangalarning qiymati bo'yicha sanaladi, soni bo'yicha emas. Va yodda tuting: ko'p tanga — har doim ko'p pul emas. Keyingi safar kattaliklarga oid masalalar yechamiz."
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder)

| ekran | Stage | figure/param |
|---|---|---|
| s0 | hook | CoinSet [100,200,100] |
| s1 | CoinSet teach | 100+200 step-reveal |
| s2 | CoinSet teach | 300 = 100+200 |
| s3 | rule + check | CoinSet(c.coins) |
| s4 | CoinSet×2 + warn + check | coinsA/coinsB |
| sTBL | jadval (4 nominal) | 100/200/500/1000 |
| s5/s7/s10 | CountMoneyStage | CoinSet → summa |
| s6/s9 | GatherStage | summa → CoinSet choices |
| s8/s11 | CompareMoneyStage | ikki CoinSet → qaysi ko'p |
| s13 | CountMoneyStage (masala) | [500,200,100] |
| s14 | aralash (count/compare) + FactCard | kind: count/compare |
| s15 | summary | NeptunField |
