# Dars36 — CONTENT (Б6 NEPTUN · «Kalendar: kun, hafta, oy» · program d.39)

> **Mexanika (metodist 2026-07-17): ARALASH** — hafta kunlari (teach + qoida) + kalendar-katak o'qish (mashq) + oylar.
> Klon-baza: **Dars35.jsx** (Neptun biom + siz-registr). Yangi: `WeekStrip` (7 kun qatori) + `CalendarFig` (oy jadvali: 7 ustun
> + sanalar, sana ajratiladi) + `WeekDayStage` (keyin/oldin/kecha-bugun-erta) · `CalendarReadStage` (sana → hafta kuni) · `MonthStage` (oylar).
> Kalendar MAVHUM oy (real sanaga bog'lanmagan): 1-sana = Chorshanba (startDow=2), 30 kun. Hafta kuni(N) = (N+1) mod 7, 0=Dushanba.
> Hafta boshi = **Dushanba** (o'zbek/rus standarti). Vaqt ko'prigi (Dars35): kun/hafta/oy — vaqt birliklari.

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **UZ atamalar (draft):** hafta kunlari — Dushanba, Seshanba, Chorshanba, Payshanba, Juma, Shanba, Yakshanba
   (qisqartma Du/Se/Ch/Pa/Ju/Sh/Ya). Oylar — yanvar…dekabr. kecha/bugun/erta. **Qisqartmalar va hafta boshini tekshiring.**
2. **Kalendar mavhum** (real sanaga bog'lanmagan): 1-sana=Chorshanba, 30 kun. Barcha CalendarRead ekranlarida bir xil oy.
3. **CalendarRead soddalashtirildi:** faqat sana→hafta kuni yo'nalishi (kun→sana ko'p javobli, noaniq bo'lardi). Metodistga eslatma.

---

```javascript
const CONTENT = {
  // s0 — HOOK: «Chorshanbadan keyin Dushanba keladi»mi? (kun tartibi buzilgan). To'g'ri = Yo'q (Payshanba).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Календарь', uz: "Mavzu: Kalendar" },
    lead: { ru: 'Верный ли порядок?', uz: "Tartib to'g'rimi?" },
    q: { ru: 'Кто-то сказал: после среды идёт понедельник. Это верно?', uz: "Kimdir aytdi: chorshanbadan keyin dushanba keladi. Bu to'g'rimi?" },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы на станции у Нептуна. Бит заполняет бортовой журнал по календарю.',
          'Дни недели всегда идут по порядку, один за другим.',
          'Кто-то сказал: после среды идёт понедельник. Но он перепутал порядок дней.',
          'Как думаешь, это верно? Послушай ответы: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Neptun yonidagi stansiyadamiz. Bit kalendar bo'yicha bort jurnalini to'ldiryapti.",
          "Hafta kunlari doim tartib bilan, birin-ketin keladi.",
          "Kimdir aytdi: chorshanbadan keyin dushanba keladi. Ammo u kun tartibini chalkashtirdi.",
          "Sizningcha, bu to'g'rimi? Javoblarni tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. После среды идёт четверг, а не понедельник.', uz: "To'g'ri. Chorshanbadan keyin payshanba keladi, dushanba emas." },
      on_wrong: { ru: 'Дни идут по порядку: после среды — четверг. Сейчас разберём.', uz: "Kunlar tartib bilan keladi: chorshanbadan keyin — payshanba. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня разберём дни недели и календарь.', uz: "Hechqisi yo'q. Bugun hafta kunlari va kalendarni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: WeekStrip — 7 kun tartibi. Hafta = 7 kun. 4 seg step-reveal.
  s1: {
    eyebrow: { ru: 'Неделя', uz: 'Hafta' },
    lead: { ru: 'Семь дней недели', uz: "Haftaning yetti kuni" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'В неделе семь дней. Они всегда идут по порядку, от понедельника до воскресенья.', uz: "Haftada yetti kun bor. Ular doim tartib bilan, dushanbadan yakshanbagacha keladi." },
    audio: {
      ru: [
        'Посмотри на неделю. В ней семь дней.',
        'Первый день — понедельник. За ним вторник, среда, четверг.',
        'Потом пятница, суббота и воскресенье.',
        'Дни всегда идут по порядку. После воскресенья снова понедельник.'
      ],
      uz: [
        "Haftaga qarang. Unda yetti kun bor.",
        "Birinchi kun — dushanba. Undan keyin seshanba, chorshanba, payshanba.",
        "Keyin juma, shanba va yakshanba.",
        "Kunlar doim tartib bilan keladi. Yakshanbadan keyin yana dushanba."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: kecha / bugun / erta (WeekStrip da). 4 seg.
  s2: {
    eyebrow: { ru: 'Вчера · сегодня · завтра', uz: 'Kecha · bugun · erta' },
    lead: { ru: 'Вчера, сегодня, завтра', uz: "Kecha, bugun, erta" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Сегодня — этот день. Вчера — день до него, завтра — день после него.', uz: "Bugun — shu kun. Kecha — undan oldingi kun, erta — undan keyingi kun." },
    audio: {
      ru: [
        'Допустим, сегодня среда.',
        'Вчера был день до среды — вторник.',
        'Завтра будет день после среды — четверг.',
        'Вчера, сегодня, завтра — это три дня подряд.'
      ],
      uz: [
        "Aytaylik, bugun chorshanba.",
        "Kecha chorshanbadan oldingi kun — seshanba edi.",
        "Erta chorshanbadan keyingi kun — payshanba bo'ladi.",
        "Kecha, bugun, erta — bu ketma-ket uch kun."
      ]
    }
  },

  // s3 — QOIDA: kunlar tartib bilan; oxirgisidan keyin — yana birinchisi + check (jumadan keyin? → shanba).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Дни недели идут по порядку. После последнего дня недели снова начинается первый.', uz: "Hafta kunlari tartib bilan keladi. Haftaning oxirgi kunidan keyin yana birinchisi boshlanadi." },
    check_q: { ru: 'Какой день идёт после пятницы?', uz: "Jumadan keyin qaysi kun keladi?" },
    opts: [{ ru: 'суббота', uz: 'shanba', ok: true }, { ru: 'четверг', uz: 'payshanba' }, { ru: 'понедельник', uz: 'dushanba' }],
    wrong: { ru: 'Иди по порядку: пятница, потом суббота. Четверг был до пятницы.', uz: "Tartib bilan boring: juma, keyin shanba. Payshanba jumadan oldin edi." },
    check_ok: { ru: 'Верно! После пятницы идёт суббота.', uz: "To'g'ri! Jumadan keyin shanba keladi." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Дни недели всегда идут по порядку.',
        'После последнего дня, воскресенья, снова начинается понедельник.',
        'Проверь. Какой день идёт после пятницы?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Hafta kunlari doim tartib bilan keladi.",
        "Oxirgi kun, yakshanbadan keyin, yana dushanba boshlanadi.",
        "Tekshiring. Jumadan keyin qaysi kun keladi?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3 (OYLAR + WARN): yilda 12 oy, oyda ~30 kun. warn: hafta=7 kun, oy ≠ 7. check (yilda nechta oy? → 12).
  s4: {
    eyebrow: { ru: 'Месяцы', uz: 'Oylar' },
    lead: { ru: 'В году двенадцать месяцев', uz: "Yilda o'n ikki oy" },
    warn: { ru: 'Не путай: в неделе семь дней, а в месяце около тридцати. Это разные единицы времени.', uz: "Chalkashtirmang: haftada yetti kun, oyda esa taxminan o'ttiz kun. Bular har xil vaqt birliklari." },
    check_q: { ru: 'Сколько месяцев в году?', uz: "Yilda nechta oy bor?" },
    opts: [{ ru: '12', uz: '12', ok: true }, { ru: '7', uz: '7' }, { ru: '30', uz: '30' }],
    wrong: { ru: 'Семь — это дни недели, тридцать — дни месяца. А месяцев в году двенадцать.', uz: "Yetti — bu hafta kunlari, o'ttiz — oy kunlari. Yilda esa o'n ikki oy bor." },
    check_ok: { ru: 'Верно! В году двенадцать месяцев.', uz: "To'g'ri! Yilda o'n ikki oy bor." },
    audio: {
      ru: [
        'В году двенадцать месяцев: январь, февраль, март и так далее.',
        'В одном месяце около тридцати дней.',
        'Не путай: неделя — это семь дней, а месяц — около тридцати.',
        'Проверь. Сколько месяцев в году?'
      ],
      uz: [
        "Yilda o'n ikki oy bor: yanvar, fevral, mart va hokazo.",
        "Bitta oyda taxminan o'ttiz kun bor.",
        "Chalkashtirmang: hafta — bu yetti kun, oy esa — taxminan o'ttiz.",
        "Tekshiring. Yilda nechta oy bor?"
      ]
    }
  },

  // sTBL — KALIT: hafta kunlari (to'liq+qisqa) + hafta=7 · oy~30 · yil=12 oy. done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Дни, недели, месяцы', uz: "Kunlar, haftalar, oylar" },
    caption: { ru: 'Семь дней недели', uz: "Haftaning yetti kuni" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Неделя — семь дней. В месяце около тридцати дней. В году двенадцать месяцев.', uz: "Hafta — yetti kun. Oyda taxminan o'ttiz kun. Yilda o'n ikki oy." },
    audio: {
      ru: [
        'Соберём ключ. Семь дней недели идут по порядку.',
        'От понедельника до воскресенья — это одна неделя, семь дней.',
        'В месяце около тридцати дней, а в году двенадцать месяцев.'
      ],
      uz: [
        "Kalitni yig'amiz. Haftaning yetti kuni tartib bilan keladi.",
        "Dushanbadan yakshanbagacha — bu bitta hafta, yetti kun.",
        "Oyda taxminan o'ttiz kun, yilda esa o'n ikki oy bor."
      ]
    }
  },

  // s5 — MASHQ WeekDayStage: keyin/oldin qaysi kun. distraktor = tartib buzilishi (M1).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Какой день?', uz: "Qaysi kun?" },
    rounds: [
      { q: { ru: 'Какой день идёт после вторника?', uz: "Seshanbadan keyin qaysi kun keladi?" },
        opts: [{ ru: 'среда', uz: 'chorshanba', ok: true }, { ru: 'понедельник', uz: 'dushanba', wrong: { ru: 'Понедельник был до вторника. По порядку после вторника — среда.', uz: "Dushanba seshanbadan oldin edi. Tartib bilan seshanbadan keyin — chorshanba." } }, { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Четверг идёт через день. Сразу после вторника — среда.', uz: "Payshanba bir kundan keyin keladi. Seshanbadan darrov keyin — chorshanba." } }],
        correct_text: { ru: 'Верно. После вторника — среда.', uz: "To'g'ri. Seshanbadan keyin — chorshanba." } },
      { q: { ru: 'Какой день идёт до субботы?', uz: "Shanbadan oldin qaysi kun keladi?" },
        opts: [{ ru: 'пятница', uz: 'juma', ok: true }, { ru: 'воскресенье', uz: 'yakshanba', wrong: { ru: 'Воскресенье идёт после субботы, а не до неё. До субботы — пятница.', uz: "Yakshanba shanbadan keyin keladi, oldin emas. Shanbadan oldin — juma." } }, { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Четверг стоит раньше. Сразу до субботы — пятница.', uz: "Payshanba oldinroq turadi. Shanbadan darrov oldin — juma." } }],
        correct_text: { ru: 'Верно. До субботы — пятница.', uz: "To'g'ri. Shanbadan oldin — juma." } },
      { q: { ru: 'Какой день идёт после воскресенья?', uz: "Yakshanbadan keyin qaysi kun keladi?" },
        opts: [{ ru: 'понедельник', uz: 'dushanba', ok: true }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Суббота была до воскресенья. После последнего дня снова понедельник.', uz: "Shanba yakshanbadan oldin edi. Oxirgi kundan keyin yana dushanba." } }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'После воскресенья начинается новая неделя — с понедельника.', uz: "Yakshanbadan keyin yangi hafta boshlanadi — dushanbadan." } }],
        correct_text: { ru: 'Верно. После воскресенья снова понедельник.', uz: "To'g'ri. Yakshanbadan keyin yana dushanba." } }
    ],
    audio: {
      intro: { ru: 'Иди по порядку дней недели и выбери верный день.', uz: "Hafta kunlari tartibi bo'yicha boring va to'g'ri kunni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ CalendarReadStage: sana → hafta kuni (mavhum oy, 1=Ch). distraktor = qo'shni kun / sanani kun deb (M2).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Какой день у числа?', uz: "Sana qaysi kunga to'g'ri keladi?" },
    rounds: [
      { mark: 8, q: { ru: 'На какой день недели приходится восьмое число?', uz: "Sakkizinchi sana haftaning qaysi kuniga to'g'ri keladi?" },
        opts: [{ ru: 'среда', uz: 'chorshanba', ok: true }, { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Посмотри по столбцу: восьмое стоит под средой, не под четвергом.', uz: "Ustunga qarang: sakkizinchi chorshanba tagida turadi, payshanba emas." } }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Восьмое — под средой. Вторник левее.', uz: "Sakkizinchi — chorshanba tagida. Seshanba chaproqda." } }],
        correct_text: { ru: 'Верно. Восьмое — среда.', uz: "To'g'ri. Sakkizinchi — chorshanba." } },
      { mark: 6, q: { ru: 'На какой день недели приходится шестое число?', uz: "Oltinchi sana haftaning qaysi kuniga to'g'ri keladi?" },
        opts: [{ ru: 'понедельник', uz: 'dushanba', ok: true }, { ru: 'воскресенье', uz: 'yakshanba', wrong: { ru: 'Шестое стоит в столбце понедельника, первого столбца.', uz: "Oltinchi dushanba ustunida, birinchi ustunda turadi." } }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Шестое — под понедельником. Вторник правее.', uz: "Oltinchi — dushanba tagida. Seshanba o'ngroqda." } }],
        correct_text: { ru: 'Верно. Шестое — понедельник.', uz: "To'g'ri. Oltinchi — dushanba." } },
      { mark: 10, q: { ru: 'На какой день недели приходится десятое число?', uz: "O'ninchi sana haftaning qaysi kuniga to'g'ri keladi?" },
        opts: [{ ru: 'пятница', uz: 'juma', ok: true }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Десятое стоит под пятницей, не под субботой.', uz: "O'ninchi juma tagida turadi, shanba emas." } }, { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Десятое — под пятницей. Четверг левее.', uz: "O'ninchi — juma tagida. Payshanba chaproqda." } }],
        correct_text: { ru: 'Верно. Десятое — пятница.', uz: "To'g'ri. O'ninchi — juma." } }
    ],
    audio: {
      intro: { ru: 'Найди число в календаре и посмотри, в каком оно столбце дня.', uz: "Kalendardan sanani toping va u qaysi kun ustunida ekanini qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ WeekDayStage: kecha/bugun/erta. distraktor = teskari (kecha↔erta).
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Вчера и завтра', uz: "Kecha va erta" },
    rounds: [
      { q: { ru: 'Сегодня четверг. Какой день был вчера?', uz: "Bugun payshanba. Kecha qaysi kun edi?" },
        opts: [{ ru: 'среда', uz: 'chorshanba', ok: true }, { ru: 'пятница', uz: 'juma', wrong: { ru: 'Пятница будет завтра, а не вчера. Вчера — день до четверга, среда.', uz: "Juma erta bo'ladi, kecha emas. Kecha — payshanbadan oldingi kun, chorshanba." } }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Вторник был раньше. Вчера — это день сразу до четверга, среда.', uz: "Seshanba oldinroq edi. Kecha — payshanbadan darrov oldingi kun, chorshanba." } }],
        correct_text: { ru: 'Верно. Вчера была среда.', uz: "To'g'ri. Kecha chorshanba edi." } },
      { q: { ru: 'Сегодня воскресенье. Какой день будет завтра?', uz: "Bugun yakshanba. Erta qaysi kun bo'ladi?" },
        opts: [{ ru: 'понедельник', uz: 'dushanba', ok: true }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Суббота была вчера. Завтра после воскресенья — понедельник.', uz: "Shanba kecha edi. Yakshanbadan keyin erta — dushanba." } }, { ru: 'пятница', uz: 'juma', wrong: { ru: 'Пятница была раньше. Завтра — новая неделя, понедельник.', uz: "Juma oldinroq edi. Erta — yangi hafta, dushanba." } }],
        correct_text: { ru: 'Верно. Завтра будет понедельник.', uz: "To'g'ri. Erta dushanba bo'ladi." } },
      { q: { ru: 'Сегодня среда. Какой день будет завтра?', uz: "Bugun chorshanba. Erta qaysi kun bo'ladi?" },
        opts: [{ ru: 'четверг', uz: 'payshanba', ok: true }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Вторник был вчера. Завтра — день после среды, четверг.', uz: "Seshanba kecha edi. Erta — chorshanbadan keyingi kun, payshanba." } }, { ru: 'пятница', uz: 'juma', wrong: { ru: 'Пятница будет через день. Сразу завтра — четверг.', uz: "Juma bir kundan keyin bo'ladi. Darrov erta — payshanba." } }],
        correct_text: { ru: 'Верно. Завтра будет четверг.', uz: "To'g'ri. Erta payshanba bo'ladi." } }
    ],
    audio: {
      intro: { ru: 'Вчера — день до сегодня, завтра — день после. Выбери верный день.', uz: "Kecha — bugungacha bo'lgan kun, erta — keyingi kun. To'g'ri kunni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ CalendarReadStage: boshqa sanalar. distraktor = qo'shni kun.
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Какой день у числа?', uz: "Sana qaysi kunga to'g'ri keladi?" },
    rounds: [
      { mark: 3, q: { ru: 'На какой день приходится третье число?', uz: "Uchinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'пятница', uz: 'juma', ok: true }, { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Третье стоит под пятницей. Четверг — второе число.', uz: "Uchinchi juma tagida turadi. Payshanba — ikkinchi sana." } }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Третье — под пятницей. Суббота правее.', uz: "Uchinchi — juma tagida. Shanba o'ngroqda." } }],
        correct_text: { ru: 'Верно. Третье — пятница.', uz: "To'g'ri. Uchinchi — juma." } },
      { mark: 14, q: { ru: 'На какой день приходится четырнадцатое число?', uz: "O'n to'rtinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'вторник', uz: 'seshanba', ok: true }, { ru: 'понедельник', uz: 'dushanba', wrong: { ru: 'Четырнадцатое под вторником. Понедельник — тринадцатое.', uz: "O'n to'rtinchi seshanba tagida. Dushanba — o'n uchinchi." } }, { ru: 'среда', uz: 'chorshanba', wrong: { ru: 'Четырнадцатое — под вторником. Среда правее.', uz: "O'n to'rtinchi — seshanba tagida. Chorshanba o'ngroqda." } }],
        correct_text: { ru: 'Верно. Четырнадцатое — вторник.', uz: "To'g'ri. O'n to'rtinchi — seshanba." } },
      { mark: 12, q: { ru: 'На какой день приходится двенадцатое число?', uz: "O'n ikkinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'воскресенье', uz: 'yakshanba', ok: true }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Двенадцатое под воскресеньем, последним столбцом. Суббота — одиннадцатое.', uz: "O'n ikkinchi yakshanba, oxirgi ustun tagida. Shanba — o'n birinchi." } }, { ru: 'понедельник', uz: 'dushanba', wrong: { ru: 'Двенадцатое — воскресенье. Понедельник — начало недели.', uz: "O'n ikkinchi — yakshanba. Dushanba — hafta boshi." } }],
        correct_text: { ru: 'Верно. Двенадцатое — воскресенье.', uz: "To'g'ri. O'n ikkinchi — yakshanba." } }
    ],
    audio: {
      intro: { ru: 'Снова найди число и посмотри его столбец дня.', uz: "Yana sanani toping va uning kun ustunini qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ MonthStage: oylar. distraktor = 7/30 chalkashligi (M3), oy tartibi (M4).
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Месяцы года', uz: "Yil oylari" },
    rounds: [
      { q: { ru: 'Сколько месяцев в году?', uz: "Yilda nechta oy bor?" },
        opts: [{ ru: '12', uz: '12', ok: true }, { ru: '7', uz: '7', wrong: { ru: 'Семь — это дни недели, а не месяцы. В году двенадцать месяцев.', uz: "Yetti — bu hafta kunlari, oylar emas. Yilda o'n ikki oy." } }, { ru: '30', uz: '30', wrong: { ru: 'Около тридцати — это дни в месяце. А месяцев в году двенадцать.', uz: "Taxminan o'ttiz — bu oydagi kunlar. Yilda esa o'n ikki oy." } }],
        correct_text: { ru: 'Верно. В году двенадцать месяцев.', uz: "To'g'ri. Yilda o'n ikki oy." } },
      { q: { ru: 'Какой месяц идёт после мая?', uz: "Maydan keyin qaysi oy keladi?" },
        opts: [{ ru: 'июнь', uz: 'iyun', ok: true }, { ru: 'апрель', uz: 'aprel', wrong: { ru: 'Апрель был до мая. После мая идёт июнь.', uz: "Aprel maydan oldin edi. Maydan keyin iyun keladi." } }, { ru: 'июль', uz: 'iyul', wrong: { ru: 'Июль идёт через месяц. Сразу после мая — июнь.', uz: "Iyul bir oydan keyin keladi. Maydan darrov keyin — iyun." } }],
        correct_text: { ru: 'Верно. После мая идёт июнь.', uz: "To'g'ri. Maydan keyin iyun keladi." } },
      { q: { ru: 'Какой месяц первый в году?', uz: "Yilning birinchi oyi qaysi?" },
        opts: [{ ru: 'январь', uz: 'yanvar', ok: true }, { ru: 'декабрь', uz: 'dekabr', wrong: { ru: 'Декабрь — последний месяц года. Первый — январь.', uz: "Dekabr — yilning oxirgi oyi. Birinchisi — yanvar." } }, { ru: 'март', uz: 'mart', wrong: { ru: 'Март — третий месяц. Год начинается с января.', uz: "Mart — uchinchi oy. Yil yanvardan boshlanadi." } }],
        correct_text: { ru: 'Верно. Год начинается с января.', uz: "To'g'ri. Yil yanvardan boshlanadi." } }
    ],
    audio: {
      intro: { ru: 'Вспомни: месяцев в году двенадцать, они идут по порядку.', uz: "Eslang: yilda o'n ikki oy, ular tartib bilan keladi." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ CalendarReadStage aralash.
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Какой день у числа?', uz: "Sana qaysi kunga to'g'ri keladi?" },
    rounds: [
      { mark: 7, q: { ru: 'На какой день приходится седьмое число?', uz: "Yettinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'вторник', uz: 'seshanba', ok: true }, { ru: 'понедельник', uz: 'dushanba', wrong: { ru: 'Седьмое под вторником. Понедельник — шестое.', uz: "Yettinchi seshanba tagida. Dushanba — oltinchi." } }, { ru: 'среда', uz: 'chorshanba', wrong: { ru: 'Седьмое — под вторником. Среда правее.', uz: "Yettinchi — seshanba tagida. Chorshanba o'ngroqda." } }],
        correct_text: { ru: 'Верно. Седьмое — вторник.', uz: "To'g'ri. Yettinchi — seshanba." } },
      { mark: 11, q: { ru: 'На какой день приходится одиннадцатое число?', uz: "O'n birinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'суббота', uz: 'shanba', ok: true }, { ru: 'пятница', uz: 'juma', wrong: { ru: 'Одиннадцатое под субботой. Пятница — десятое.', uz: "O'n birinchi shanba tagida. Juma — o'ninchi." } }, { ru: 'воскресенье', uz: 'yakshanba', wrong: { ru: 'Одиннадцатое — под субботой. Воскресенье правее.', uz: "O'n birinchi — shanba tagida. Yakshanba o'ngroqda." } }],
        correct_text: { ru: 'Верно. Одиннадцатое — суббота.', uz: "To'g'ri. O'n birinchi — shanba." } },
      { mark: 5, q: { ru: 'На какой день приходится пятое число?', uz: "Beshinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'воскресенье', uz: 'yakshanba', ok: true }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Пятое под воскресеньем, последним столбцом. Суббота — четвёртое.', uz: "Beshinchi yakshanba, oxirgi ustun tagida. Shanba — to'rtinchi." } }, { ru: 'пятница', uz: 'juma', wrong: { ru: 'Пятое — под воскресеньем. Пятница левее.', uz: "Beshinchi — yakshanba tagida. Juma chaproqda." } }],
        correct_text: { ru: 'Верно. Пятое — воскресенье.', uz: "To'g'ri. Beshinchi — yakshanba." } }
    ],
    audio: {
      intro: { ru: 'Читай календарь по столбцам дней недели.', uz: "Kalendarni hafta kunlari ustunlari bo'yicha o'qing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ WeekDayStage aralash (tartib).
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Какой день?', uz: "Qaysi kun?" },
    rounds: [
      { q: { ru: 'Какой день идёт после четверга?', uz: "Payshanbadan keyin qaysi kun keladi?" },
        opts: [{ ru: 'пятница', uz: 'juma', ok: true }, { ru: 'среда', uz: 'chorshanba', wrong: { ru: 'Среда была до четверга. После четверга — пятница.', uz: "Chorshanba payshanbadan oldin edi. Payshanbadan keyin — juma." } }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Суббота идёт через день. Сразу после четверга — пятница.', uz: "Shanba bir kundan keyin keladi. Payshanbadan darrov keyin — juma." } }],
        correct_text: { ru: 'Верно. После четверга — пятница.', uz: "To'g'ri. Payshanbadan keyin — juma." } },
      { q: { ru: 'Какой день идёт до понедельника?', uz: "Dushanbadan oldin qaysi kun keladi?" },
        opts: [{ ru: 'воскресенье', uz: 'yakshanba', ok: true }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Вторник идёт после понедельника, а не до. До понедельника — воскресенье.', uz: "Seshanba dushanbadan keyin keladi, oldin emas. Dushanbadan oldin — yakshanba." } }, { ru: 'суббота', uz: 'shanba', wrong: { ru: 'Суббота была раньше. Сразу до понедельника — воскресенье.', uz: "Shanba oldinroq edi. Dushanbadan darrov oldin — yakshanba." } }],
        correct_text: { ru: 'Верно. До понедельника — воскресенье.', uz: "To'g'ri. Dushanbadan oldin — yakshanba." } },
      { q: { ru: 'Сколько дней в неделе?', uz: "Haftada nechta kun bor?" },
        opts: [{ ru: '7', uz: '7', ok: true }, { ru: '12', uz: '12', wrong: { ru: 'Двенадцать — это месяцы в году. В неделе семь дней.', uz: "O'n ikki — bu yildagi oylar. Haftada yetti kun." } }, { ru: '5', uz: '5', wrong: { ru: 'Дней в неделе семь, вместе с субботой и воскресеньем.', uz: "Haftada yetti kun, shanba va yakshanba bilan birga." } }],
        correct_text: { ru: 'Верно. В неделе семь дней.', uz: "To'g'ri. Haftada yetti kun." } }
    ],
    audio: {
      intro: { ru: 'Помни порядок дней недели. Выбери верный ответ.', uz: "Hafta kunlari tartibini yodda tuting. To'g'ri javobni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — MASALA konteksti (ishlatilmaydi, klon an'anasi bo'yicha saqlanadi)
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Бит заполняет журнал.', uz: "Bit jurnalni to'ldiradi." },
    audio: { ru: 'Бит отмечает день в бортовом журнале.', uz: "Bit bort jurnalida kunni belgilaydi." }
  },

  // s13 — MASALA (CalendarReadStage single): jurnalda voqea 15-sanada — qaysi kun?
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'День в журнале', uz: "Jurnaldagi kun" },
    story: { ru: 'Бит отметил в журнале важное событие на пятнадцатое число. Посмотри в календарь: какой это день недели?', uz: "Bit jurnalda muhim voqeani o'n beshinchi sanaga belgiladi. Kalendarga qarang: bu haftaning qaysi kuni?" },
    mark: 15,
    q: { ru: 'На какой день недели приходится пятнадцатое число?', uz: "O'n beshinchi sana haftaning qaysi kuniga to'g'ri keladi?" },
    opts: [
      { ru: 'среда', uz: 'chorshanba', ok: true },
      { ru: 'четверг', uz: 'payshanba', wrong: { ru: 'Пятнадцатое стоит под средой. Четверг — шестнадцатое.', uz: "O'n beshinchi chorshanba tagida turadi. Payshanba — o'n oltinchi." } },
      { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Пятнадцатое — под средой. Вторник левее.', uz: "O'n beshinchi — chorshanba tagida. Seshanba chaproqda." } }
    ],
    correct_text: { ru: 'Верно. Пятнадцатое — среда. Событие в среду.', uz: "To'g'ri. O'n beshinchi — chorshanba. Voqea chorshanba kuni." },
    audio: {
      intro: { ru: 'Событие назначено на пятнадцатое число. Посмотри в календарь: какой это день недели?', uz: "Voqea o'n beshinchi sanaga belgilangan. Kalendarga qarang: bu haftaning qaysi kuni?" },
      on_correct: { ru: 'Верно. Пятнадцатое — среда.', uz: "To'g'ri. O'n beshinchi — chorshanba." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL (aralash Week/Calendar ×3 + FactCard Neptun).
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Календарь', uz: "Kalendar" },
    rounds: [
      { kind: 'week', q: { ru: 'Какой день идёт после среды?', uz: "Chorshanbadan keyin qaysi kun keladi?" },
        opts: [{ ru: 'четверг', uz: 'payshanba', ok: true }, { ru: 'вторник', uz: 'seshanba', wrong: { ru: 'Вторник был до среды. После среды — четверг.', uz: "Seshanba chorshanbadan oldin edi. Chorshanbadan keyin — payshanba." } }, { ru: 'понедельник', uz: 'dushanba', wrong: { ru: 'Понедельник — начало недели. После среды — четверг.', uz: "Dushanba — hafta boshi. Chorshanbadan keyin — payshanba." } }],
        correct_text: { ru: 'Верно. После среды — четверг.', uz: "To'g'ri. Chorshanbadan keyin — payshanba." } },
      { kind: 'cal', mark: 9, q: { ru: 'На какой день приходится девятое число?', uz: "To'qqizinchi sana qaysi kunga to'g'ri keladi?" },
        opts: [{ ru: 'четверг', uz: 'payshanba', ok: true }, { ru: 'среда', uz: 'chorshanba', wrong: { ru: 'Девятое под четвергом. Среда — восьмое.', uz: "To'qqizinchi payshanba tagida. Chorshanba — sakkizinchi." } }, { ru: 'пятница', uz: 'juma', wrong: { ru: 'Девятое — под четвергом. Пятница правее.', uz: "To'qqizinchi — payshanba tagida. Juma o'ngroqda." } }],
        correct_text: { ru: 'Верно. Девятое — четверг.', uz: "To'g'ri. To'qqizinchi — payshanba." } },
      { kind: 'week', q: { ru: 'Сколько месяцев в году?', uz: "Yilda nechta oy bor?" },
        opts: [{ ru: '12', uz: '12', ok: true }, { ru: '7', uz: '7', wrong: { ru: 'Семь — дни недели. Месяцев в году двенадцать.', uz: "Yetti — hafta kunlari. Yilda o'n ikki oy." } }, { ru: '30', uz: '30', wrong: { ru: 'Тридцать — дни месяца. Месяцев двенадцать.', uz: "O'ttiz — oy kunlari. Oylar o'n ikkita." } }],
        correct_text: { ru: 'Верно. В году двенадцать месяцев.', uz: "To'g'ri. Yilda o'n ikki oy." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact_text: { ru: 'Нептун открыли не в телескоп, а по расчётам: учёные вычислили, где он должен быть.', uz: "Neptun teleskopda emas, hisob-kitob orqali topilgan: olimlar u qayerda bo'lishini hisoblab chiqishgan." },
    fact_audio: { ru: 'Нептун нашли не глазами, а по расчётам. Учёные вычислили, где он должен быть, и не ошиблись.', uz: "Neptun ko'z bilan emas, hisob-kitob orqali topilgan. Olimlar u qayerda bo'lishini hisoblab, xato qilishmagan." },
    audio: {
      intro: { ru: 'Последняя проверка. Дни недели, календарь и месяцы.', uz: "Oxirgi tekshiruv. Hafta kunlari, kalendar va oylar." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi d.40 pul)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты умеешь читать календарь!', uz: "Endi siz kalendarni o'qiy olasiz!" },
    rule_recap: { ru: 'В неделе семь дней по порядку. В месяце около тридцати дней, в году двенадцать месяцев.', uz: "Haftada yetti kun tartib bilan. Oyda taxminan o'ttiz kun, yilda o'n ikki oy." },
    audio: {
      ru: 'Миссия выполнена. Мы научились читать календарь. В неделе семь дней, они идут по порядку. В месяце около тридцати дней, а в году двенадцать месяцев. Дальше мы узнаем про деньги.',
      uz: "Missiya bajarildi. Kalendarni o'qishni o'rgandik. Haftada yetti kun, ular tartib bilan keladi. Oyda taxminan o'ttiz kun, yilda esa o'n ikki oy. Keyingi safar pul haqida bilib olamiz."
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder)

| ekran | Stage | figure/param |
|---|---|---|
| s0 | hook | WeekStrip (tartib buzuq) |
| s1 | WeekStrip teach | 7 kun step-reveal |
| s2 | WeekStrip teach | kecha/bugun/erta |
| s3 | rule + check | — (jumadan keyin) |
| s4 | MonthFig + warn + check | 12 oy |
| sTBL | jadval | WeekStrip + info |
| s5/s7/s11 | WeekDayStage | matn MC (kunlar) |
| s6/s8/s10 | CalendarReadStage | CalendarFig (mark sana → kun) |
| s9 | MonthStage | matn MC (oylar) |
| s13 | CalendarReadStage (masala) | mark 15 |
| s14 | aralash (week/cal) + FactCard | kind: week/cal |
| s15 | summary | NeptunField |
