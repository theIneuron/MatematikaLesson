# Dars06R — CONTENT (Б1 «OCHIQ KOINOT» yakuni · «Takrorlash — Sayyora 1: 100 gacha nomerlash» · program d.7)

> **Takrorlash darsi (Б1 yakuni)** — Dars01–06 materiali: o'nlik/birlik, o'qish/yozish, razryad tarkibi, taqqoslash, o'nlab sanash, son o'qi.
> Klon-baza **Dars41** (MixStage). YANGI kind: `place`(PlaceVal) · `compare`(CompareRow) · `calc`(SumText) · `numline`(NumLineMini). Yangi konsept YO'Q.
> Slot-mos: s0 hook=place · s1 place · s2 compare · s3 numline · s4 place. **regext.mjs + kirill skan majburiy.**

---

```javascript
const CONTENT = {
  // s0 — HOOK: 34 da o'nlik 34 ta? (raqam≠miqdor). To'g'rimi? Yo'q (3 o'nlik).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Повторение', uz: "Mavzu: Takrorlash" },
    lead: { ru: 'Верно ли сказали?', uz: "To'g'ri aytildimi?" },
    q: { ru: 'В числе тридцать четыре кто-то сказал: тридцать четыре десятка. Это верно?', uz: "O'ttiz to'rt sonida kimdir «o'ttiz to'rt o'nlik» dedi. Bu to'g'rimi?" },
    hookfig: { kind: 'place', tens: 3, ones: 4 },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Нет', uz: "Yo'q" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы улетаем с Земли. Прежде чем в путь — повторим первую планету.',
          'Вот число тридцать четыре: три десятка и четыре единицы.',
          'Кто-то сказал, что здесь тридцать четыре десятка. Но десятков только три, а четыре — единицы.',
          'Как думаешь, верно ли сказали? Послушай: да или нет. Или ты пока не знаешь.'
        ],
        uz: [
          "Yerdan uchyapmiz. Yo'lga chiqishdan oldin — birinchi sayyorani takrorlaymiz.",
          "Mana o'ttiz to'rt soni: uch o'nlik va to'rt birlik.",
          "Kimdir bu yerda o'ttiz to'rt o'nlik bor dedi. Ammo o'nlik faqat uchta, to'rttasi — birlik.",
          "Sizningcha, to'g'ri aytildimi? Tinglang: ha yoki yo'q. Yoki hali bilmaysiz."
        ]
      },
      on_correct: { ru: 'Верно. Три десятка и четыре единицы — тридцать четыре.', uz: "To'g'ri. Uch o'nlik va to'rt birlik — o'ttiz to'rt." },
      on_wrong: { ru: 'Десятков три, единиц четыре. Сейчас повторим.', uz: "O'nlik uchta, birlik to'rtta. Hozir takrorlaymiz." },
      on_unknown: { ru: 'Ничего. Сегодня повторим первую планету.', uz: "Hechqisi yo'q. Bugun birinchi sayyorani takrorlaymiz." }
    }
  },

  // s1 — RECAP: o'nlik/birlik (place 4/6=46). caption edit: «to'rt o'nlik, olti birlik». 3 seg.
  s1: {
    eyebrow: { ru: 'Разряды', uz: 'Razryadlar' },
    lead: { ru: 'Десятки и единицы', uz: "O'nliklar va birliklar" },
    recap: { kind: 'place', tens: 4, ones: 6 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Число состоит из десятков и единиц. Четыре десятка и шесть единиц — это сорок шесть.', uz: "Son o'nlik va birlikdan tuziladi. To'rt o'nlik va olti birlik — bu qirq olti." },
    audio: {
      ru: ['Вспомним разряды.', 'Слева десятки — по десять в столбике, справа единицы.', 'Четыре десятка и шесть единиц — сорок шесть.'],
      uz: ["Razryadlarni eslaymiz.", "Chapda o'nliklar — ustunda o'ntadan, o'ngda birliklar.", "To'rt o'nlik va olti birlik — qirq olti."]
    }
  },

  // s2 — RECAP: taqqoslash (compare 45 va 54). caption edit: «qirq besh kichik». 3 seg.
  s2: {
    eyebrow: { ru: 'Сравнение', uz: 'Taqqoslash' },
    lead: { ru: 'Сравниваем числа', uz: "Sonlarni taqqoslaymiz" },
    recap: { kind: 'compare', a: 45, b: 54 },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Сначала сравни десятки. У сорока пяти четыре десятка, у пятидесяти четырёх — пять. Значит сорок пять меньше.', uz: "Avval o'nliklarni solishtiring. Qirq beshda to'rt o'nlik, ellik to'rtda — besh. Demak qirq besh kichik." },
    audio: {
      ru: ['Вспомним сравнение.', 'Сначала смотрим на десятки: у кого больше десятков, то число больше.', 'Сорок пять меньше пятидесяти четырёх.'],
      uz: ["Taqqoslashni eslaymiz.", "Avval o'nliklarga qaraymiz: kimda o'nlik ko'p, o'sha son katta.", "Qirq besh ellik to'rtdan kichik."]
    }
  },

  // s3 — RECAP+check: son o'qi (numline mark 40). belgisiz check.
  s3: {
    eyebrow: { ru: 'Числовой луч', uz: "Son o'qi" },
    lead: { ru: 'Число на луче', uz: "O'qdagi son" },
    recap: { kind: 'numline', from: 0, to: 100, step: 10, mark: 40 },
    check_q: { ru: 'Какое число отмечено на луче?', uz: "O'qda qaysi son belgilangan?" },
    opts: [{ ru: '40', uz: '40', ok: true }, { ru: '14', uz: '14' }, { ru: '400', uz: '400' }],
    wrong: { ru: 'Метка стоит на четвёртом десятке: это сорок.', uz: "Belgi to'rtinchi o'nlikda: bu qirq." },
    check_ok: { ru: 'Верно! Это сорок.', uz: "To'g'ri! Bu qirq." },
    audio: {
      ru: ['Вспомним числовой луч.', 'Числа на луче стоят по порядку, по десяткам.', 'Проверь. Какое число отмечено?'],
      uz: ["Son o'qini eslaymiz.", "O'qdagi sonlar tartib bilan, o'nliklab turadi.", "Tekshiring. Qaysi son belgilangan?"]
    }
  },

  // s4 — RECAP+check: razryad tarkibi (place 7/0=70). caption edit: «yetti o'nlik».
  s4: {
    eyebrow: { ru: 'Разряды', uz: 'Razryadlar' },
    lead: { ru: 'Круглые десятки', uz: "Yumaloq o'nliklar" },
    recap: { kind: 'place', tens: 7, ones: 0 },
    check_q: { ru: 'Сколько здесь единиц?', uz: "Bu yerda nechta birlik bor?" },
    opts: [{ ru: '0', uz: '0', ok: true }, { ru: '7', uz: '7' }, { ru: '70', uz: '70' }],
    wrong: { ru: 'Семь десятков, а единиц нет — ноль. Это семьдесят.', uz: "Yetti o'nlik, birlik esa yo'q — nol. Bu yetmish." },
    check_ok: { ru: 'Верно! Единиц ноль.', uz: "To'g'ri! Birlik nol." },
    audio: {
      ru: ['Круглые десятки.', 'Семьдесят — это семь десятков и ноль единиц.', 'Проверь. Сколько единиц?'],
      uz: ["Yumaloq o'nliklar.", "Yetmish — bu yetti o'nlik va nol birlik.", "Tekshiring. Nechta birlik bor?"]
    }
  },

  // sTBL — KALIT: Б1 nima. 3 seg.
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Что мы прошли', uz: "Nimalarni o'tdik" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'На первой планете мы прошли десятки и единицы, чтение чисел, сравнение, счёт десятками и числовой луч.', uz: "Birinchi sayyorada o'nlik va birlik, sonlarni o'qish, taqqoslash, o'nlab sanash va son o'qini o'tdik." },
    audio: {
      ru: ['Соберём ключ. Мы прошли много.', 'Десятки и единицы, чтение и сравнение чисел.', 'Счёт десятками и числовой луч. Повторим всё.'],
      uz: ["Kalitni yig'amiz. Ko'p narsa o'tdik.", "O'nlik va birlik, sonlarni o'qish va taqqoslash.", "O'nlab sanash va son o'qi. Hammasini takrorlaymiz."]
    }
  },

  // s5 — o'nlik/birlik.
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' }, label: { ru: 'Какое число?', uz: "Qaysi son?" },
    rounds: [
      { kind: 'place', tens: 5, ones: 2, q: { ru: 'Какое это число?', uz: "Bu qaysi son?" },
        opts: [{ ru: '52', uz: '52', ok: true }, { ru: '25', uz: '25', wrong: { ru: 'Пять десятков и две единицы — пятьдесят два.', uz: "Besh o'nlik va ikki birlik — ellik ikki." } }, { ru: '7', uz: '7', wrong: { ru: 'Это не сложение. Пять десятков, две единицы — пятьдесят два.', uz: "Bu qo'shish emas. Besh o'nlik, ikki birlik — ellik ikki." } }],
        correct_text: { ru: 'Верно. Пятьдесят два.', uz: "To'g'ri. Ellik ikki." } },
      { kind: 'place', tens: 8, ones: 3, q: { ru: 'Какое это число?', uz: "Bu qaysi son?" },
        opts: [{ ru: '83', uz: '83', ok: true }, { ru: '38', uz: '38', wrong: { ru: 'Сначала десятки: восемь десятков и три единицы — восемьдесят три.', uz: "Avval o'nliklar: sakkiz o'nlik va uch birlik — sakson uch." } }, { ru: '11', uz: '11', wrong: { ru: 'Восемь десятков, три единицы — восемьдесят три.', uz: "Sakkiz o'nlik, uch birlik — sakson uch." } }],
        correct_text: { ru: 'Верно. Восемьдесят три.', uz: "To'g'ri. Sakson uch." } }
    ],
    audio: { intro: { ru: 'Посчитай десятки и единицы.', uz: "O'nlik va birliklarni sanang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s6 — taqqoslash.
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' }, label: { ru: 'Сравни', uz: "Taqqoslang" },
    rounds: [
      { kind: 'compare', a: 67, b: 76, q: { ru: 'Левое число какое?', uz: "Chapdagi son qanday?" },
        opts: [{ ru: 'меньше', uz: 'kichik', ok: true }, { ru: 'больше', uz: 'katta', wrong: { ru: 'У шестидесяти семи шесть десятков, у семидесяти шести — семь. Значит меньше.', uz: "Oltmish yettida olti o'nlik, yetmish oltida — yetti. Demak kichik." } }, { ru: 'равно', uz: 'teng', wrong: { ru: 'Числа разные. Шестьдесят семь меньше.', uz: "Sonlar har xil. Oltmish yetti kichik." } }],
        correct_text: { ru: 'Верно. Шестьдесят семь меньше.', uz: "To'g'ri. Oltmish yetti kichik." } },
      { kind: 'compare', a: 90, b: 89, q: { ru: 'Левое число какое?', uz: "Chapdagi son qanday?" },
        opts: [{ ru: 'больше', uz: 'katta', ok: true }, { ru: 'меньше', uz: 'kichik', wrong: { ru: 'У девяноста девять десятков, у восьмидесяти девяти — восемь. Значит больше.', uz: "To'qsonda to'qqiz o'nlik, sakson to'qqizda — sakkiz. Demak katta." } }, { ru: 'равно', uz: 'teng', wrong: { ru: 'Числа разные. Девяносто больше.', uz: "Sonlar har xil. To'qson katta." } }],
        correct_text: { ru: 'Верно. Девяносто больше.', uz: "To'g'ri. To'qson katta." } }
    ],
    audio: { intro: { ru: 'Сначала сравни десятки.', uz: "Avval o'nliklarni solishtiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s7 — son o'qi.
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' }, label: { ru: 'Число на луче', uz: "O'qdagi son" },
    rounds: [
      { kind: 'numline', from: 0, to: 100, step: 10, mark: 60, q: { ru: 'Какое число отмечено?', uz: "Qaysi son belgilangan?" },
        opts: [{ ru: '60', uz: '60', ok: true }, { ru: '16', uz: '16', wrong: { ru: 'Метка на шестом десятке: шестьдесят.', uz: "Belgi oltinchi o'nlikda: oltmish." } }, { ru: '6', uz: '6', wrong: { ru: 'Это десятки. Метка на шестидесяти.', uz: "Bu o'nliklar. Belgi oltmishda." } }],
        correct_text: { ru: 'Верно. Шестьдесят.', uz: "To'g'ri. Oltmish." } },
      { kind: 'numline', from: 0, to: 100, step: 10, mark: 30, q: { ru: 'Какое число отмечено?', uz: "Qaysi son belgilangan?" },
        opts: [{ ru: '30', uz: '30', ok: true }, { ru: '13', uz: '13', wrong: { ru: 'Метка на третьем десятке: тридцать.', uz: "Belgi uchinchi o'nlikda: o'ttiz." } }, { ru: '3', uz: '3', wrong: { ru: 'Это десятки. Метка на тридцати.', uz: "Bu o'nliklar. Belgi o'ttizda." } }],
        correct_text: { ru: 'Верно. Тридцать.', uz: "To'g'ri. O'ttiz." } }
    ],
    audio: { intro: { ru: 'Считай десятки от нуля до метки.', uz: "Noldan belgigacha o'nliklarni sanang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s8 — o'nlab (calc yumaloq o'nlik).
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' }, label: { ru: 'Круглые десятки', uz: "Yumaloq o'nliklar" },
    rounds: [
      { kind: 'calc', a: 30, op: '+', b: 20, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '50', uz: '50', ok: true }, { ru: '5', uz: '5', wrong: { ru: 'Три десятка и два десятка — пять десятков, пятьдесят.', uz: "Uch o'nlik va ikki o'nlik — besh o'nlik, ellik." } }, { ru: '32', uz: '32', wrong: { ru: 'Складываем десятки: тридцать плюс двадцать — пятьдесят.', uz: "O'nliklarni qo'shamiz: o'ttiz qo'shuv yigirma — ellik." } }],
        correct_text: { ru: 'Верно. Пятьдесят.', uz: "To'g'ri. Ellik." } },
      { kind: 'calc', a: 70, op: '−', b: 40, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '30', uz: '30', ok: true }, { ru: '3', uz: '3', wrong: { ru: 'Семь десятков минус четыре десятка — три десятка, тридцать.', uz: "Yetti o'nlik ayirish to'rt o'nlik — uch o'nlik, o'ttiz." } }, { ru: '110', uz: '110', wrong: { ru: 'Это вычитание: семьдесят минус сорок — тридцать.', uz: "Bu ayirish: yetmish ayirish qirq — o'ttiz." } }],
        correct_text: { ru: 'Верно. Тридцать.', uz: "To'g'ri. O'ttiz." } }
    ],
    audio: { intro: { ru: 'Складывай и вычитай круглые десятки.', uz: "Yumaloq o'nliklarni qo'shing va ayiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s9 — o'nlab sanash (word ketma-ketlik).
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' }, label: { ru: 'Считай десятками', uz: "O'nlab sanang" },
    rounds: [
      { kind: 'word', q: { ru: 'Двадцать, тридцать, сорок… какое число дальше?', uz: "Yigirma, o'ttiz, qirq… keyingi son qaysi?" },
        opts: [{ ru: '50', uz: '50', ok: true }, { ru: '41', uz: '41', wrong: { ru: 'Считаем десятками: после сорока — пятьдесят.', uz: "O'nlab sanaymiz: qirqdan keyin — ellik." } }, { ru: '45', uz: '45', wrong: { ru: 'Шаг — десять: дальше пятьдесят.', uz: "Qadam — o'n: keyingisi ellik." } }],
        correct_text: { ru: 'Верно. Пятьдесят.', uz: "To'g'ri. Ellik." } },
      { kind: 'word', q: { ru: 'Пятнадцать, двадцать, двадцать пять… какое число дальше?', uz: "O'n besh, yigirma, yigirma besh… keyingi son qaysi?" },
        opts: [{ ru: '30', uz: '30', ok: true }, { ru: '26', uz: '26', wrong: { ru: 'Шаг — пять: после двадцати пяти — тридцать.', uz: "Qadam — besh: yigirma beshdan keyin — o'ttiz." } }, { ru: '35', uz: '35', wrong: { ru: 'Прибавляем по пять: дальше тридцать.', uz: "Beshtadan qo'shamiz: keyingisi o'ttiz." } }],
        correct_text: { ru: 'Верно. Тридцать.', uz: "To'g'ri. O'ttiz." } }
    ],
    audio: { intro: { ru: 'Найди шаг в ряду и продолжи.', uz: "Qatordagi qadamni toping va davom ettiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s10 — o'nlik/birlik teskari (word: nechta o'nlik).
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' }, label: { ru: 'Подумай', uz: "O'ylab ko'ring" },
    rounds: [
      { kind: 'place', tens: 6, ones: 5, q: { ru: 'Сколько здесь десятков?', uz: "Bu yerda nechta o'nlik bor?" },
        opts: [{ ru: '6', uz: '6', ok: true }, { ru: '65', uz: '65', wrong: { ru: 'Десятков шесть, а всё число — шестьдесят пять.', uz: "O'nlik oltita, butun son esa — oltmish besh." } }, { ru: '5', uz: '5', wrong: { ru: 'Пять — это единицы. Десятков шесть.', uz: "Besh — bu birliklar. O'nlik oltita." } }],
        correct_text: { ru: 'Верно. Шесть десятков.', uz: "To'g'ri. Olti o'nlik." } },
      { kind: 'compare', a: 40, b: 40, q: { ru: 'Левое число какое?', uz: "Chapdagi son qanday?" },
        opts: [{ ru: 'равно', uz: 'teng', ok: true }, { ru: 'больше', uz: 'katta', wrong: { ru: 'Оба числа сорок — они равны.', uz: "Ikkala son ham qirq — ular teng." } }, { ru: 'меньше', uz: 'kichik', wrong: { ru: 'Числа одинаковые: сорок равно сорока.', uz: "Sonlar bir xil: qirq qirqga teng." } }],
        correct_text: { ru: 'Верно. Они равны.', uz: "To'g'ri. Ular teng." } }
    ],
    audio: { intro: { ru: 'Смотри на разряды и сравнивай.', uz: "Razryadlarga qarang va solishtiring." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s11 — son o'qi + razryad.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' }, label: { ru: 'Подумай', uz: "O'ylab ko'ring" },
    rounds: [
      { kind: 'numline', from: 0, to: 100, step: 10, mark: 90, q: { ru: 'Какое число отмечено?', uz: "Qaysi son belgilangan?" },
        opts: [{ ru: '90', uz: '90', ok: true }, { ru: '19', uz: '19', wrong: { ru: 'Метка на девятом десятке: девяносто.', uz: "Belgi to'qqizinchi o'nlikda: to'qson." } }, { ru: '9', uz: '9', wrong: { ru: 'Это десятки. Метка на девяноста.', uz: "Bu o'nliklar. Belgi to'qsonda." } }],
        correct_text: { ru: 'Верно. Девяносто.', uz: "To'g'ri. To'qson." } },
      { kind: 'place', tens: 1, ones: 9, q: { ru: 'Какое это число?', uz: "Bu qaysi son?" },
        opts: [{ ru: '19', uz: '19', ok: true }, { ru: '91', uz: '91', wrong: { ru: 'Один десяток и девять единиц — девятнадцать.', uz: "Bir o'nlik va to'qqiz birlik — o'n to'qqiz." } }, { ru: '10', uz: '10', wrong: { ru: 'Один десяток, девять единиц — девятнадцать.', uz: "Bir o'nlik, to'qqiz birlik — o'n to'qqiz." } }],
        correct_text: { ru: 'Верно. Девятнадцать.', uz: "To'g'ri. O'n to'qqiz." } }
    ],
    audio: { intro: { ru: 'Вспомни луч и разряды.', uz: "O'q va razryadlarni eslang." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  s12: { eyebrow: { ru: 'Задача', uz: 'Masala' }, lead: { ru: 'Бит повторяет.', uz: "Bit takrorlaydi." }, audio: { ru: 'Бит повторяет первую планету.', uz: "Bit birinchi sayyorani takrorlaydi." } },

  // s13 — MASALA: place (word).
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' }, label: { ru: 'Число Бита', uz: "Bit soni" },
    story: { ru: 'Бит собрал семь десятков и восемь единиц кристаллов. Какое это число?', uz: "Bit yetti o'nlik va sakkiz birlik kristall yig'di. Bu qaysi son?" },
    kind: 'place', tens: 7, ones: 8, q: { ru: 'Какое это число?', uz: "Bu qaysi son?" },
    opts: [{ ru: '78', uz: '78', ok: true }, { ru: '87', uz: '87', wrong: { ru: 'Сначала десятки: семь десятков и восемь единиц — семьдесят восемь.', uz: "Avval o'nliklar: yetti o'nlik va sakkiz birlik — yetmish sakkiz." } }, { ru: '15', uz: '15', wrong: { ru: 'Это не сложение. Семь десятков, восемь единиц — семьдесят восемь.', uz: "Bu qo'shish emas. Yetti o'nlik, sakkiz birlik — yetmish sakkiz." } }],
    correct_text: { ru: 'Верно. Семьдесят восемь.', uz: "To'g'ri. Yetmish sakkiz." },
    audio: { intro: { ru: 'Бит собрал семь десятков и восемь единиц. Какое число?', uz: "Bit yetti o'nlik va sakkiz birlik yig'di. Qaysi son?" }, on_correct: { ru: 'Верно. Семьдесят восемь.', uz: "To'g'ri. Yetmish sakkiz." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s14 — FINAL + FactCard.
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' }, label: { ru: 'Повторение', uz: "Takrorlash" },
    rounds: [
      { kind: 'place', tens: 9, ones: 4, q: { ru: 'Какое это число?', uz: "Bu qaysi son?" },
        opts: [{ ru: '94', uz: '94', ok: true }, { ru: '49', uz: '49', wrong: { ru: 'Сначала десятки: девять десятков и четыре единицы — девяносто четыре.', uz: "Avval o'nliklar: to'qqiz o'nlik va to'rt birlik — to'qson to'rt." } }, { ru: '13', uz: '13', wrong: { ru: 'Девять десятков, четыре единицы — девяносто четыре.', uz: "To'qqiz o'nlik, to'rt birlik — to'qson to'rt." } }],
        correct_text: { ru: 'Верно. Девяносто четыре.', uz: "To'g'ri. To'qson to'rt." } },
      { kind: 'compare', a: 58, b: 85, q: { ru: 'Левое число какое?', uz: "Chapdagi son qanday?" },
        opts: [{ ru: 'меньше', uz: 'kichik', ok: true }, { ru: 'больше', uz: 'katta', wrong: { ru: 'У пятидесяти восьми пять десятков, у восьмидесяти пяти — восемь. Значит меньше.', uz: "Ellik sakkizda besh o'nlik, sakson beshda — sakkiz. Demak kichik." } }, { ru: 'равно', uz: 'teng', wrong: { ru: 'Числа разные. Пятьдесят восемь меньше.', uz: "Sonlar har xil. Ellik sakkiz kichik." } }],
        correct_text: { ru: 'Верно. Пятьдесят восемь меньше.', uz: "To'g'ri. Ellik sakkiz kichik." } },
      { kind: 'calc', a: 50, op: '+', b: 30, q: { ru: 'Сколько получится?', uz: "Nechta bo'ladi?" },
        opts: [{ ru: '80', uz: '80', ok: true }, { ru: '8', uz: '8', wrong: { ru: 'Пять десятков и три десятка — восемь десятков, восемьдесят.', uz: "Besh o'nlik va uch o'nlik — sakkiz o'nlik, sakson." } }, { ru: '20', uz: '20', wrong: { ru: 'Это сложение: пятьдесят плюс тридцать — восемьдесят.', uz: "Bu qo'shish: ellik qo'shuv o'ttiz — sakson." } }],
        correct_text: { ru: 'Верно. Восемьдесят.', uz: "To'g'ri. Sakson." } }
    ],
    fact_badge: { ru: 'Планета 1', uz: 'Sayyora 1' },
    fact_text: { ru: 'Первая планета позади! Числа до ста мы знаем. Впереди Марс.', uz: "Birinchi sayyora orqada qoldi! Yuzgacha sonlarni bilamiz. Oldinda Mars." },
    fact_audio: { ru: 'Первая планета пройдена. Числа до ста мы знаем. Впереди красный Марс.', uz: "Birinchi sayyora bosib o'tildi. Yuzgacha sonlarni bilamiz. Oldinda qizil Mars." },
    audio: { intro: { ru: 'Последняя проверка первой планеты.', uz: "Birinchi sayyoraning oxirgi tekshiruvi." }, on_correct: { ru: 'Верно.', uz: "To'g'ri." }, on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." } }
  },

  // s15 — YAKUN.
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Планета 1 пройдена!', uz: "Sayyora 1 o'tildi!" },
    cando: { ru: 'Ты повторил всю первую планету — числа до ста!', uz: "Butun birinchi sayyorani takrorladingiz — yuzgacha sonlar!" },
    rule_recap: { ru: 'Десятки и единицы, чтение, сравнение, счёт десятками и числовой луч — всё повторили.', uz: "O'nlik va birlik, o'qish, taqqoslash, o'nlab sanash va son o'qi — hammasini takrorladik." },
    audio: {
      ru: 'Первая планета пройдена. Мы вспомнили десятки и единицы, сравнение чисел, счёт десятками и числовой луч. Дальше — красный Марс.',
      uz: "Birinchi sayyora o'tildi. O'nlik va birlik, sonlarni taqqoslash, o'nlab sanash va son o'qini esladik. Keyin — qizil Mars."
    }
  }
};
```
