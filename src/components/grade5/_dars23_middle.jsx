const LESSON_META = {
  lessonId: 'frac_5_15',
  lessonTitle: { ru: 'Сложение и вычитание смешанных чисел', uz: "Aralash sonlarni qo'shish va ayirish" }
};
const TOTAL_SCREENS = 12;

// Obuchayushchiy dars: proverochnye ekrany scored (pervaya popytka -> LMS), summary bez schyota.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0  why-framed (M1: nega 4/3 ni butunga)
  { id: 's1',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 1  warm-up: noto'g'ri kasr -> aralash (prereq frac_5_14)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  qo'shish + ko'chirish
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 3  ayirish + qarz olish
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 4  har xil maxraj
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 5  qoida + 2-usul
  { id: 's6',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // 6  drag-FILL (mixfill)
  { id: 's7',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' }, // 7  5 oson savol
  { id: 's8',  type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 8  case (Nilufar, lenta)
  { id: 's9',  type: 'test',        template: 'SeqMix',         scored: true,  scope: 'practice' }, // 9  6-8 misol, har xil tip
  { id: 's10', type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'final' },    // 10 yakuniy (Saida, masofa)
  { id: 's11', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 11 yakun + ConnectionsBlock
];

const CONTENT = {
  // ===== s0 HOOK (konseptual, personajsiz): javobda 4/3 qolsa nega butunga ajratamiz? =====
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    title: { ru: 'В ответе осталось 4/3. Это конец?', uz: "Javobda 4/3 qoldi. Bu oxirimi?" },
    lead: { ru: 'Сложили 1 2/3 + 2 2/3 и получили 3 целых и 4/3.', uz: "1 2/3 + 2 2/3 ni qo'shib, 3 butun va 4/3 hosil qildik." },
    question: { ru: '4/3 — это меньше одного целого или больше?', uz: "4/3 — bir butundan kam yoki ko'pmi?" },
    opt0: { ru: 'Больше: 4/3 = 1 целый и 1/3, его выделяют → 4 1/3', uz: "Ko'p: 4/3 = 1 butun va 1/3, uni ajratamiz → 4 1/3" },
    opt1: { ru: 'Ровно или меньше: 3 4/3 — это и есть ответ', uz: "Teng yoki kam: 3 4/3 — bu javobning o'zi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Верно. В 4/3 умещается одно целое (3/3) и ещё 1/3. Его выделяют: 3 + 1 1/3 = 4 1/3.', uz: "To'g'ri. 4/3 ichida bitta butun (3/3) va yana 1/3 bor. Uni ajratamiz: 3 + 1 1/3 = 4 1/3." },
    reveal1: { ru: 'Так оставлять нельзя. 4/3 больше одного целого, поэтому ответ ещё не готов — нужно выделить целое.', uz: "Bunday qoldirib bo'lmaydi. 4/3 bir butundan ko'p, shuning uchun javob hali tayyor emas — butunni ajratish kerak." },
    reveal2: { ru: 'Посмотрим на плитках, что такое 4/3.', uz: "4/3 nimaligini plitkalarda ko'ramiz." },
    audio: { ru: 'Сложили одну целую две третьих и две целых две третьих, получилось три целых и четыре третьих. Четыре третьих больше одного целого, ведь три третьих это уже целое. Как думаешь, такой ответ готов? Выбери ответ.', uz: "Bir butun uchdan ikki va ikki butun uchdan ikkini qo'shib, uch butun va uchdan to'rt hosil qildik. Uchdan to'rt bir butundan ko'p, chunki uchdan uch allaqachon bitta butun. Sizningcha, bunday javob tayyormi? Javobni tanlang." }
  },

  // ===== s1 WARM-UP (QuestionScreen): noto'g'ri kasrni aralash songa (prereq frac_5_14) =====
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslab olamiz" },
    title: { ru: 'Сначала вспомним один приём', uz: "Avval bitta usulni eslaymiz" },
    question: { ru: '7/4 — переведи в смешанное число.', uz: "7/4 ni aralash songa aylantiring." },
    opt0: { ru: '1 3/4', uz: '1 3/4' },
    opt1: { ru: '1 1/4', uz: '1 1/4' },
    opt2: { ru: '3 1/4', uz: '3 1/4' },
    opt3: { ru: '7/4 — уже готово', uz: "7/4 — tayyor" },
    correct_text: { ru: 'Верно. В 7 четвёртых одно целое (4/4) и остаток 3/4. Значит 7/4 = 1 3/4.', uz: "To'g'ri. 7 ta to'rtdan birda bitta butun (4/4) va qoldiq 3/4 bor. Demak 7/4 = 1 3/4." },
    wrong_1: { ru: 'Пересчитай остаток: из 7 убрали 4 (одно целое), осталось 3 — это 3/4.', uz: "Qoldiqni qayta sanang: 7 dan 4 ni oldik (bir butun), 3 qoldi — bu 3/4." },
    wrong_2: { ru: 'Целая часть — это сколько раз 4 умещается в 7. Это один раз, не три.', uz: "Butun qism — 4 ning 7 ichiga necha marta sig'ishi. Bu bir marta, uch emas." },
    wrong_3: { ru: '7/4 — неправильная дробь, числитель больше знаменателя. Её выделяют в целое и остаток.', uz: "7/4 — noto'g'ri kasr, surati maxrajidan katta. Uni butun va qoldiqqa ajratamiz." },
    wrong_default: { ru: 'Раздели 7 на 4: целое — один, остаток — 3, то есть 3/4.', uz: "7 ni 4 ga bo'ling: butun — bir, qoldiq — 3, ya'ni 3/4." },
    audio_hint_1: { ru: 'Пересчитай остаток, целая часть один.', uz: "Qoldiqni qayta sanang, butun qismi bir." },
    audio_hint_2: { ru: 'Целая часть один, остаток возьми в дробь.', uz: "Butun qismi bir, qoldiqni kasrga oling." },
    audio_hint_3: { ru: 'Это неправильная дробь, её надо выделить в смешанное число.', uz: "Bu noto'g'ri kasr, uni aralash songa ajratish kerak." },
    audio: {
      intro: { ru: 'Чтобы складывать смешанные числа, пригодится этот приём. Переведи семь четвёртых в смешанное число. Выбери ответ.', uz: "Aralash sonlarni qo'shish uchun shu usul kerak bo'ladi. Yettidan to'rtni aralash songa aylantiring. Javobni tanlang." },
      on_correct: { ru: 'Верно. Одно целое и три четвёртых.', uz: "To'g'ri. Bir butun va to'rtdan uch." },
      on_wrong: { ru: 'Не совсем. Раздели семь на четыре: целое один, остаток три.', uz: "Unchalik emas. Yettini to'rtga bo'ling: butun bir, qoldiq uch." }
    }
  },

  // ===== s2 EXPLORATION (step): qo'shish + ko'chirish, 1 2/3 + 2 2/3 = 4 1/3 =====
  s2: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Складываем: целые с целыми, доли с долями', uz: "Qo'shamiz: butunni butunga, ulushni ulushga" },
    lead: { ru: '1 2/3 + 2 2/3. Соберём по частям и посмотрим, где спрятано целое.', uz: "1 2/3 + 2 2/3. Bo'laklab yig'amiz va butun qayerda yashiringanini ko'ramiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А вычитание?', uz: "Tushunarli. Ayirish-chi?" },
    cap1: { ru: 'Целые: 1 + 2 = 3.', uz: "Butunlar: 1 + 2 = 3." },
    cap2: { ru: 'Доли: 2/3 + 2/3 = 4/3. Это больше целого.', uz: "Ulushlar: 2/3 + 2/3 = 4/3. Bu butundan ko'p." },
    cap3: { ru: 'Выделяем целое: 4/3 = 1 1/3. Прибавили к 3 → 4 1/3.', uz: "Butunni ajratamiz: 4/3 = 1 1/3. 3 ga qo'shdik → 4 1/3." },
    result: { ru: '1 2/3 + 2 2/3 = 4 1/3', uz: "1 2/3 + 2 2/3 = 4 1/3" },
    audio: {
      ru: [
        'Складываем одну целую две третьих и две целых две третьих. Нажимай кнопку дальше.',
        'Сначала складываем целые: один и два, три целых.',
        'Теперь доли: две третьих и две третьих, четыре третьих. Это больше одного целого, ведь три третьих уже целое.',
        'Выделяем целое: четыре третьих это одна целая и одна третья. Прибавляем к трём, получается четыре целых одна третья.'
      ],
      uz: [
        "Bir butun uchdan ikki va ikki butun uchdan ikkini qo'shamiz. Davom etish tugmasini bosing.",
        "Avval butunlarni qo'shamiz: bir va ikki, uch butun.",
        "Endi ulushlarni: uchdan ikki va uchdan ikki, uchdan to'rt. Bu bir butundan ko'p, chunki uchdan uch allaqachon butun.",
        "Butunni ajratamiz: uchdan to'rt bu bir butun va uchdan bir. Uchga qo'shamiz, to'rt butun uchdan bir hosil bo'ladi."
      ]
    }
  },

  // ===== s3 EXPLORATION (step): ayirish + qarz olish, 3 1/4 − 1 3/4 = 1 2/4 =====
  s3: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Вычитаем: иногда нужно занять у целого', uz: "Ayiramiz: ba'zan butundan qarz olamiz" },
    lead: { ru: '3 1/4 − 1 3/4. Из 1/4 нельзя вычесть 3/4 — займём одно целое.', uz: "3 1/4 − 1 3/4. 1/4 dan 3/4 ni ayirib bo'lmaydi — bitta butunni qarzga olamiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А разные знаменатели?', uz: "Tushunarli. Har xil maxraj-chi?" },
    cap1: { ru: 'Беда: 1/4 меньше 3/4, верхней доли не хватает.', uz: "Muammo: 1/4 dan 3/4 kichik, yuqori ulush yetmaydi." },
    cap2: { ru: 'Занимаем целое: оно ломается на 4 доли. 3 1/4 = 2 5/4.', uz: "Butunni qarzga olamiz: u 4 ulushga sinadi. 3 1/4 = 2 5/4." },
    cap3: { ru: 'Теперь вычитаем: 2 − 1 = 1, 5/4 − 3/4 = 2/4. Ответ 1 2/4.', uz: "Endi ayiramiz: 2 − 1 = 1, 5/4 − 3/4 = 2/4. Javob 1 2/4." },
    result: { ru: '3 1/4 − 1 3/4 = 1 2/4', uz: "3 1/4 − 1 3/4 = 1 2/4" },
    audio: {
      ru: [
        'Вычитаем из трёх целых одной четвёртой одну целую три четвёртых. Нажимай кнопку дальше.',
        'Смотри: из одной четвёртой нельзя вычесть три четвёртых, верхней доли не хватает.',
        'Занимаем одно целое. Оно ломается на четыре доли. Теперь три целых одна четвёртая это две целых пять четвёртых.',
        'Вычитаем: две минус один, одно целое, пять четвёртых минус три четвёртых, две четвёртых. Получается одна целая две четвёртых.'
      ],
      uz: [
        "Uch butun to'rtdan birdan bir butun to'rtdan uchni ayiramiz. Davom etish tugmasini bosing.",
        "Qarang: to'rtdan birdan to'rtdan uchni ayirib bo'lmaydi, yuqori ulush yetmaydi.",
        "Bitta butunni qarzga olamiz. U to'rt ulushga sinadi. Endi uch butun to'rtdan bir bu ikki butun to'rtdan besh.",
        "Ayiramiz: ikki minus bir, bir butun, to'rtdan besh minus to'rtdan uch, to'rtdan ikki. Bir butun to'rtdan ikki hosil bo'ladi."
      ]
    }
  },

  // ===== s4 EXPLORATION (step): har xil maxraj, 1 1/2 + 2 1/3 = 3 5/6 =====
  s4: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Разные знаменатели — сначала уравняем доли', uz: "Maxrajlar har xil — avval ulushlarni tenglashtiramiz" },
    lead: { ru: '1 1/2 + 2 1/3. Доли разного размера, приведём к одному знаменателю.', uz: "1 1/2 + 2 1/3. Ulushlar har xil o'lchamda, bir maxrajga keltiramiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А правило?', uz: "Tushunarli. Qoida-chi?" },
    cap1: { ru: 'Общий знаменатель 6: 1/2 = 3/6, 1/3 = 2/6.', uz: "Umumiy maxraj 6: 1/2 = 3/6, 1/3 = 2/6." },
    cap2: { ru: 'Целые: 1 + 2 = 3. Доли: 3/6 + 2/6 = 5/6.', uz: "Butunlar: 1 + 2 = 3. Ulushlar: 3/6 + 2/6 = 5/6." },
    cap3: { ru: 'Ответ 3 5/6. Здесь целое выделять не нужно: 5/6 меньше целого.', uz: "Javob 3 5/6. Bu yerda butunni ajratish shart emas: 5/6 butundan kam." },
    result: { ru: '1 1/2 + 2 1/3 = 3 5/6', uz: "1 1/2 + 2 1/3 = 3 5/6" },
    audio: {
      ru: [
        'Складываем одну целую одну вторую и две целых одну третью. Доли разного размера. Нажимай кнопку дальше.',
        'Общий знаменатель шесть. Одна вторая это три шестых, одна третья это две шестых.',
        'Теперь по частям: целые один и два, три. Доли три шестых и две шестых, пять шестых.',
        'Получается три целых пять шестых. Целое выделять не нужно, ведь пять шестых меньше одного целого.'
      ],
      uz: [
        "Bir butun ikkidan bir va ikki butun uchdan birni qo'shamiz. Ulushlar har xil o'lchamda. Davom etish tugmasini bosing.",
        "Umumiy maxraj olti. Ikkidan bir bu oltidan uch, uchdan bir bu oltidan ikki.",
        "Endi bo'laklab: butunlar bir va ikki, uch. Ulushlar oltidan uch va oltidan ikki, oltidan besh.",
        "Uch butun oltidan besh hosil bo'ladi. Butunni ajratish shart emas, chunki oltidan besh bir butundan kam."
      ]
    }
  },

  // ===== s5 RULE + 2-usul =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Как складывать и вычитать смешанные числа', uz: "Aralash sonlarni qo'shish va ayirish" },
    bridge: { ru: 'Мы увидели это на плитках. Теперь соберём в правило.', uz: "Buni plitkalarda ko'rdik. Endi qoidaga yig'amiz." },
    rule_label: { ru: 'Запомните', uz: "Yodda tuting" },
    rule_1: { ru: 'Если знаменатели разные — сначала приведите доли к общему знаменателю.', uz: "Maxrajlar har xil bo'lsa — avval ulushlarni umumiy maxrajga keltiring." },
    rule_2: { ru: 'Целые складывайте (вычитайте) с целыми, доли — с долями.', uz: "Butunlarni butun bilan, ulushlarni ulush bilan qo'shing yoki ayiring." },
    rule_3: { ru: 'При сложении доли стали больше целого — выделите одно целое (перенос).', uz: "Qo'shganda ulush butundan oshsa — bitta butunni ajrating (ko'chirish)." },
    rule_4: { ru: 'При вычитании верхней доли не хватает — займите одно целое у целой части.', uz: "Ayirganda yuqori ulush yetmasa — butun qismdan bitta butunni qarzga oling." },
    warn_label: { ru: 'Две частые ошибки', uz: "Ikki tez-tez uchraydigan xato" },
    warn: { ru: 'Оставить в ответе неправильную дробь, например 4/3, и не занять у целого при вычитании.', uz: "Javobda noto'g'ri kasrni, masalan 4/3 ni qoldirib ketish va ayirishda butundan qarz olmaslik." },
    second_label: { ru: 'Второй способ', uz: "Ikkinchi usul" },
    second: { ru: 'Можно перевести в неправильные дроби: 1 2/3 = 5/3, 2 2/3 = 8/3, тогда 5/3 + 8/3 = 13/3 = 4 1/3.', uz: "Noto'g'ri kasrga aylantirib ham yechsa bo'ladi: 1 2/3 = 5/3, 2 2/3 = 8/3, demak 5/3 + 8/3 = 13/3 = 4 1/3." },
    audio: { ru: 'Запомните. Если знаменатели разные, сначала приводим доли к общему знаменателю. Дальше целые складываем или вычитаем с целыми, а доли с долями. Если при сложении доли стали больше целого, выделяем одно целое. Если при вычитании верхней доли не хватает, занимаем одно целое у целой части. И второй способ: можно перевести смешанные числа в неправильные дроби, сложить и снова выделить целое. Одна целая две третьих это пять третьих, две целых две третьих это восемь третьих, вместе тринадцать третьих, то есть четыре целых одна третья.', uz: "Yodda tuting. Maxrajlar har xil bo'lsa, avval ulushlarni umumiy maxrajga keltiramiz. So'ng butunlarni butun bilan, ulushlarni ulush bilan qo'shamiz yoki ayiramiz. Qo'shganda ulush butundan oshsa, bitta butunni ajratamiz. Ayirganda yuqori ulush yetmasa, butun qismdan bitta butunni qarzga olamiz. Ikkinchi usul ham bor: aralash sonni noto'g'ri kasrga aylantirib, qo'shib, yana butunni ajratsa bo'ladi. Bir butun uchdan ikki bu uchdan besh, ikki butun uchdan ikki bu uchdan sakkiz, birga uchdan o'n uch, ya'ni to'rt butun uchdan bir." }
  },

  // ===== s6 DRAG-FILL (mixfill): ko'chirishni to'ldiring, 1 2/3 + 2 2/3 = [4] 1/3 =====
  s6: {
    eyebrow: { ru: 'Собери ответ', uz: "Javobni yig'ing" },
    title: { ru: 'Перетащи целую часть на место', uz: "Butun qismni joyiga torting" },
    lead: { ru: 'Доли уже сложили: 2/3 + 2/3 = 4/3 = 1 1/3. Сколько целых получится?', uz: "Ulushlarni qo'shdik: 2/3 + 2/3 = 4/3 = 1 1/3. Nechta butun chiqadi?" },
    drag_num: { ru: 'Перетащи число в окошко — или нажми число, потом нажми окошко.', uz: "Sonni katakka torting — yoki sonni bosib, so'ng katakka bosing." },
    hint: { ru: 'Целые: 1 + 2 = 3, и ещё одно целое из 4/3. Всего 4, доля 1/3.', uz: "Butunlar: 1 + 2 = 3, va 4/3 dan yana bitta butun. Hammasi 4, ulush 1/3." },
    fb_correct: { ru: 'Верно. 3 целых плюс целое из 4/3 — это 4, и остаётся 1/3. Ответ 4 1/3.', uz: "To'g'ri. 3 butun va 4/3 dan bitta butun — bu 4, hamda 1/3 qoladi. Javob 4 1/3." },
    item: {
      kind: 'mixfill', aw: 1, an: 2, bw: 2, bn: 2, d: 3, op: '+', resN: 1, answer: 4,
      chips: [{ id: 'c0', label: '4', ok: true }, { id: 'c1', label: '3', ok: false }, { id: 'c2', label: '5', ok: false }]
    },
    audio: {
      intro: { ru: 'Доли мы уже сложили: получилось четыре третьих, а это одно целое и одна третья. Сколько всего целых выйдет? Перетащи число в окошко.', uz: "Ulushlarni allaqachon qo'shdik: uchdan to'rt chiqdi, bu bir butun va uchdan bir. Hammasi bo'lib nechta butun chiqadi? Sonni katakka torting." },
      on_correct: { ru: 'Верно. Всего четыре целых и одна третья.', uz: "To'g'ri. Hammasi to'rt butun va uchdan bir." },
      on_wrong: { ru: 'Пока не то. Сложи три целых и ещё одно целое из четырёх третьих.', uz: "Hozircha emas. Uch butun va uchdan to'rtdan chiqqan yana bitta butunni qo'shing." }
    }
  },

  // ===== s7 — BESHTA OSON SAVOL (SeqMC, scored) =====
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Пять быстрых примеров', uz: "Beshta tez misol" },
    lead: { ru: 'Складывай и вычитай смешанные числа. Выбери ответ.', uz: "Aralash sonlarni qo'shing va ayiring. Javobni tanlang." },
    bridge: { ru: 'Правило знаем — теперь потренируемся.', uz: "Qoidani bilamiz — endi mashq qilamiz." },
    questions: [
      {
        q: '1 1/5 + 2 3/5', say: { ru: 'Сложи одну целую одну пятую и две целых три пятых.', uz: "Bir butun beshdan bir va ikki butun beshdan uchni qo'shing." },
        opts: ['3 4/5', '2 4/5', '3 2/5'], correct: 0,
        ok: { ru: 'Верно: 1 + 2 = 3, 1/5 + 3/5 = 4/5.', uz: "To'g'ri: 1 + 2 = 3, 1/5 + 3/5 = 4/5." },
        no: { ru: 'Целые складывай с целыми, доли с долями.', uz: "Butunlarni butunga, ulushlarni ulushga qo'shing." }
      },
      {
        q: '3 3/7 − 1 2/7', say: { ru: 'Вычти из трёх целых трёх седьмых одну целую две седьмых.', uz: "Uch butun yettidan uchdan bir butun yettidan ikkini ayiring." },
        opts: ['2 2/7', '2 1/7', '1 1/7'], correct: 1,
        ok: { ru: 'Верно: 3 − 1 = 2, 3/7 − 2/7 = 1/7.', uz: "To'g'ri: 3 − 1 = 2, 3/7 − 2/7 = 1/7." },
        no: { ru: 'Целое вычитай из целого, долю из доли.', uz: "Butunni butundan, ulushni ulushdan ayiring." }
      },
      {
        q: '1 2/3 + 1 2/3', say: { ru: 'К одной целой двум третьим прибавь ещё одну целую две третьих.', uz: "Bir butun uchdan ikkiga yana bir butun uchdan ikkini qo'shing." },
        opts: ['2 4/3', '3 4/3', '3 1/3'], correct: 2,
        ok: { ru: 'Верно: доли дали 4/3, выделили целое — 3 1/3.', uz: "To'g'ri: ulushlar 4/3 berdi, butunni ajratdik — 3 1/3." },
        no: { ru: 'Если доли стали больше целого, выдели одно целое.', uz: "Ulush butundan oshsa, bitta butunni ajrating." }
      },
      {
        q: '2 3/4 + 1 1/4', say: { ru: 'Сложи две целых три четвёртых и одну целую одну четвёртую.', uz: "Ikki butun to'rtdan uch va bir butun to'rtdan birni qo'shing." },
        opts: ['4', '3 4/4', '4 1/4'], correct: 0,
        ok: { ru: 'Верно: 3/4 + 1/4 = 4/4 = 1, всего 4 целых.', uz: "To'g'ri: 3/4 + 1/4 = 4/4 = 1, hammasi 4 butun." },
        no: { ru: 'Доли дали целое. Прибавь это целое к остальным.', uz: "Ulushlar butun berdi. Bu butunni qolganlariga qo'shing." }
      },
      {
        q: '4 1/6 − 2 1/6', say: { ru: 'Вычти из четырёх целых одной шестой две целых одну шестую.', uz: "To'rt butun oltidan birdan ikki butun oltidan birni ayiring." },
        opts: ['2 2/6', '2', '1 1/6'], correct: 1,
        ok: { ru: 'Верно: 4 − 2 = 2, 1/6 − 1/6 = 0 — остаётся 2.', uz: "To'g'ri: 4 − 2 = 2, 1/6 − 1/6 = 0 — 2 qoladi." },
        no: { ru: 'Доли равны, их разность ноль, останутся только целые.', uz: "Ulushlar teng, ayirmasi nol, faqat butunlar qoladi." }
      }
    ],
    audio: {
      intro: { ru: 'Правило знаем, теперь потренируемся. Пять быстрых примеров.', uz: "Qoidani bilamiz, endi mashq qilamiz. Beshta tez misol." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все примеры решены.', uz: "Zo'r, hamma misol yechildi." }
    }
  },

  // ===== s8 — CASE (Nilufar, lenta): 3 1/4 − 1 3/4 (qarz olish) =====
  s8: {
    eyebrow: { ru: 'Задача · лента', uz: "Masala · lenta" },
    title: { ru: 'Нилуфар шила и отрезала ленту', uz: "Nilufar tikdi va lenta kesdi" },
    question: { ru: 'Было 3 1/4 м ленты, отрезала 1 3/4 м. Сколько осталось?', uz: "3 1/4 m lenta bor edi, 1 3/4 m kesdi. Qancha qoldi?" },
    opt0: { ru: '1 2/4 м', uz: '1 2/4 m' },
    opt1: { ru: '2 2/4 м', uz: '2 2/4 m' },
    opt2: { ru: '1 3/4 м', uz: '1 3/4 m' },
    opt3: { ru: '2 1/4 м', uz: '2 1/4 m' },
    correct_text: { ru: 'Верно. Из 1/4 нельзя вычесть 3/4, заняли целое: 3 1/4 = 2 5/4. Тогда 2 5/4 − 1 3/4 = 1 2/4 м.', uz: "To'g'ri. 1/4 dan 3/4 ni ayirib bo'lmaydi, butunni qarzga oldik: 3 1/4 = 2 5/4. Demak 2 5/4 − 1 3/4 = 1 2/4 m." },
    wrong_1: { ru: 'Похоже, целое не заняли. Из 1/4 нельзя вычесть 3/4 — сначала займи одно целое.', uz: "Butunni qarzga olmadingiz shekilli. 1/4 dan 3/4 ayrilmaydi — avval bitta butunni oling." },
    wrong_2: { ru: 'Это уменьшаемое, а не ответ. Займи целое и вычти доли.', uz: "Bu kamayuvchi, javob emas. Butunni qarzga oling va ulushlarni ayiring." },
    wrong_3: { ru: 'Целую часть посчитали неверно: после займа целых остаётся 1.', uz: "Butun qismni noto'g'ri sanadingiz: qarzdan keyin butun 1 qoladi." },
    wrong_default: { ru: 'Займи одно целое: 3 1/4 = 2 5/4, затем вычти.', uz: "Bitta butunni qarzga oling: 3 1/4 = 2 5/4, so'ng ayiring." },
    audio_hint_1: { ru: 'Сначала займи одно целое, потом вычитай доли.', uz: "Avval bitta butunni qarzga oling, so'ng ulushlarni ayiring." },
    audio_hint_2: { ru: 'Это уменьшаемое, а не ответ. Выполни вычитание.', uz: "Bu kamayuvchi, javob emas. Ayirishni bajaring." },
    audio_hint_3: { ru: 'Пересчитай целую часть после займа, останется один.', uz: "Qarzdan keyin butun qismni qayta sanang, bir qoladi." },
    fact: { ru: 'Портные и плотники всегда меряют смешанными числами: полтора метра, две с половиной доски.', uz: "Tikuvchi va duradgorlar doim aralash son bilan o'lchaydi: bir yarim metr, ikki yarim taxta." },
    audio: {
      intro: { ru: 'У Нилуфар было три целых одна четвёртая метра ленты, она отрезала одну целую три четвёртых. Сколько осталось? Выбери ответ.', uz: "Nilufarda uch butun to'rtdan bir metr lenta bor edi, u bir butun to'rtdan uchni kesdi. Qancha qoldi? Javobni tanlang." },
      on_correct: { ru: 'Верно, осталось одна целая две четвёртых метра. Кстати, портные и плотники всегда меряют смешанными числами.', uz: "To'g'ri, bir butun to'rtdan ikki metr qoldi. Aytgancha, tikuvchi va duradgorlar doim aralash son bilan o'lchaydi." },
      on_wrong: { ru: 'Не совсем. Из одной четвёртой нельзя вычесть три четвёртых, займи целое.', uz: "Unchalik emas. To'rtdan birdan to'rtdan uchni ayirib bo'lmaydi, butunni qarzga oling." }
    }
  },

  // ===== s9 — OLTI-SAKKIZ MISOL, OSONDAN QIYINGA, HAR XIL TIP (SeqMix, scored) =====
  s9: {
    eyebrow: { ru: 'Смешанная тренировка', uz: "Aralash mashq" },
    title: { ru: 'Семь примеров — разного типа', uz: "Yettita misol — har xil turdagi" },
    lead: { ru: 'Разные типы: выбор, перетаскивание, сортировка — от лёгкого к трудному.', uz: "Har xil tur: tanlash, tortish, saralash — osondan qiyinga." },
    bridge: { ru: 'Проверим себя на разных типах вопросов.', uz: "Turli xil savollar bilan o'zimizni sinaymiz." },
    lvl_easy: { ru: 'Лёгкий', uz: "Oson" },
    lvl_mid: { ru: 'Средний', uz: "O'rta" },
    lvl_hard: { ru: 'Трудный', uz: "Qiyin" },
    drag_num: { ru: 'Перетащи число — или нажми число, потом нажми окошко.', uz: "Sonni torting — yoki sonni bosib, so'ng katakka bosing." },
    bin_ask: { ru: 'Что нужно сделать? Перетащи пример — или нажми его, потом нажми корзину.', uz: "Nima qilish kerak? Misolni torting — yoki bosib, so'ng savatga bosing." },
    bin_carry: { ru: 'Нужен перенос', uz: "Ko'chirish kerak" },
    bin_borrow: { ru: 'Нужен заём', uz: "Qarz olish kerak" },
    bin_direct: { ru: 'Напрямую', uz: "To'g'ridan" },
    items: [
      // (1) MC oson
      { kind: 'mc', lvl: 'easy', prob: '1 1/4 + 1 1/4', opts: ['2 2/4', '2 1/4', '1 2/4'], correct: 0,
        say: { ru: 'Сложи одну целую одну четвёртую и одну целую одну четвёртую.', uz: "Bir butun to'rtdan bir va bir butun to'rtdan birni qo'shing." },
        ok: { ru: 'Верно: 1 + 1 = 2, 1/4 + 1/4 = 2/4.', uz: "To'g'ri: 1 + 1 = 2, 1/4 + 1/4 = 2/4." },
        no: { ru: 'Целые с целыми, доли с долями.', uz: "Butunni butunga, ulushni ulushga." } },
      // (2) MIXFILL oson (ko'chirishsiz): 2 1/5 + 1 3/5 = [3] 4/5
      { kind: 'mixfill', lvl: 'easy', aw: 2, an: 1, bw: 1, bn: 3, d: 5, op: '+', resN: 4, answer: 3,
        chips: [{ id: 'c0', label: '3', ok: true }, { id: 'c1', label: '4', ok: false }, { id: 'c2', label: '2', ok: false }],
        say: { ru: 'Сложи две целых одну пятую и одну целую три пятых, перетащи целую часть.', uz: "Ikki butun beshdan bir va bir butun beshdan uchni qo'shing, butun qismni torting." },
        ok: { ru: 'Верно: 2 + 1 = 3, доли 4/5.', uz: "To'g'ri: 2 + 1 = 3, ulush 4/5." },
        no: { ru: 'Сложи целые: 2 и 1. Доли уже меньше целого.', uz: "Butunlarni qo'shing: 2 va 1. Ulush butundan kichik." } },
      // (3) MC o'rta (ko'chirish): 2 3/5 + 1 4/5 = 4 2/5
      { kind: 'mc', lvl: 'mid', prob: '2 3/5 + 1 4/5', opts: ['3 7/5', '4 2/5', '4 7/5'], correct: 1,
        say: { ru: 'Сложи две целых три пятых и одну целую четыре пятых.', uz: "Ikki butun beshdan uch va bir butun beshdan to'rtni qo'shing." },
        ok: { ru: 'Верно: доли дали 7/5 = 1 2/5, всего 4 2/5.', uz: "To'g'ri: ulushlar 7/5 = 1 2/5 berdi, hammasi 4 2/5." },
        no: { ru: 'Доли стали больше целого, выдели одно целое.', uz: "Ulush butundan oshdi, bitta butunni ajrating." } },
      // (4) DRAGBIN o'rta (klassifikatsiya): 3 1/4 − 1 3/4 -> qarz
      { kind: 'dragbin', lvl: 'mid', expr: '3 1/4 − 1 3/4', bin: 'borrow',
        say: { ru: 'Что нужно для этого вычитания? Перетащи в корзину.', uz: "Bu ayirish uchun nima kerak? Savatga torting." },
        ok: { ru: 'Верно: 1/4 меньше 3/4, нужно занять целое.', uz: "To'g'ri: 1/4 dan 3/4 katta, butunni qarzga olish kerak." },
        no: { ru: 'Сравни доли: верхней не хватает, значит заём.', uz: "Ulushlarni solishtiring: yuqorisi yetmaydi, demak qarz." } },
      // (5) MIXFILL o'rta (qarz): 3 1/3 − 1 2/3 = [1] 2/3
      { kind: 'mixfill', lvl: 'mid', aw: 3, an: 1, bw: 1, bn: 2, d: 3, op: '-', resN: 2, answer: 1,
        chips: [{ id: 'c0', label: '1', ok: true }, { id: 'c1', label: '2', ok: false }, { id: 'c2', label: '3', ok: false }],
        say: { ru: 'Вычти из трёх целых одной третьей одну целую две третьих, перетащи целую часть.', uz: "Uch butun uchdan birdan bir butun uchdan ikkini ayiring, butun qismni torting." },
        ok: { ru: 'Верно: заняли целое (2 4/3), осталось 1 2/3.', uz: "To'g'ri: butunni qarzga oldik (2 4/3), 1 2/3 qoldi." },
        no: { ru: 'Сначала займи одно целое у целой части, потом вычитай доли.', uz: "Avval butun qismdan bitta butunni qarzga oling, so'ng ulushlarni ayiring." } },
      // (6) MC qiyin (har xil maxraj): 1 1/2 + 2 1/3 = 3 5/6
      { kind: 'mc', lvl: 'hard', prob: '1 1/2 + 2 1/3', opts: ['3 2/5', '3 5/6', '4 5/6'], correct: 1,
        say: { ru: 'Сложи одну целую одну вторую и две целых одну третью.', uz: "Bir butun ikkidan bir va ikki butun uchdan birni qo'shing." },
        ok: { ru: 'Верно: общий знаменатель 6, 3/6 + 2/6 = 5/6, всего 3 5/6.', uz: "To'g'ri: umumiy maxraj 6, 3/6 + 2/6 = 5/6, hammasi 3 5/6." },
        no: { ru: 'Сначала приведи доли к общему знаменателю шесть.', uz: "Avval ulushlarni umumiy maxraj oltiga keltiring." } },
      // (7) DRAGBIN qiyin: 2 1/2 + 1 3/4 -> umumiy maxraj 4, 2/4+3/4=5/4 -> ko'chirish
      { kind: 'dragbin', lvl: 'hard', expr: '2 1/2 + 1 3/4', bin: 'carry',
        say: { ru: 'Приведи к общему знаменателю и реши, что нужно. Перетащи в корзину.', uz: "Umumiy maxrajga keltiring va nima kerakligini hal qiling. Savatga torting." },
        ok: { ru: 'Верно: 2/4 + 3/4 = 5/4 больше целого — нужен перенос.', uz: "To'g'ri: 2/4 + 3/4 = 5/4 butundan katta — ko'chirish kerak." },
        no: { ru: 'Сложи доли в общем знаменателе: если больше целого, перенос.', uz: "Ulushlarni umumiy maxrajda qo'shing: butundan oshsa, ko'chirish." } }
    ],
    fact: { ru: 'Полоса загрузки файла показывает целое и долю вместе — смешанное число встречается и здесь.', uz: "Fayl yuklanish chizig'i butun va ulushni birga ko'rsatadi — aralash son bu yerda ham bor." },
    audio: {
      intro: { ru: 'Проверим себя на разных типах. Семь примеров: выбор, перетаскивание и сортировка.', uz: "Turli xil tiplarda o'zimizni sinaymiz. Yettita misol: tanlash, tortish va saralash." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все типы решены. Кстати, полоса загрузки файла это тоже целое и доля вместе.', uz: "Ajoyib, barcha tur yechildi. Aytgancha, fayl yuklanish chizig'i ham butun va ulush birga." }
    }
  },

  // ===== s10 — YAKUNIY (QuestionScreen, final): Saida, masofa, 1 3/4 + 2 1/2 = 4 1/4 =====
  s10: {
    eyebrow: { ru: 'Итог · дистанция', uz: "Yakun · masofa" },
    title: { ru: 'Саида пробежала утром и вечером', uz: "Saida ertalab va kechqurun yugurdi" },
    question: { ru: 'Утром 1 3/4 км, вечером 2 1/2 км. Сколько всего? (1 3/4 + 2 1/2)', uz: "Ertalab 1 3/4 km, kechqurun 2 1/2 km. Jami qancha? (1 3/4 + 2 1/2)" },
    opt0: { ru: '4 1/4 км', uz: '4 1/4 km' },
    opt1: { ru: '3 5/4 км', uz: '3 5/4 km' },
    opt2: { ru: '3 4/6 км', uz: '3 4/6 km' },
    opt3: { ru: '4 1/2 км', uz: '4 1/2 km' },
    correct_text: { ru: 'Верно. 1/2 = 2/4, доли 3/4 + 2/4 = 5/4 — больше целого. Выделили целое: 3 + 1 1/4 = 4 1/4 км.', uz: "To'g'ri. 1/2 = 2/4, ulushlar 3/4 + 2/4 = 5/4 — butundan ko'p. Butunni ajratdik: 3 + 1 1/4 = 4 1/4 km." },
    wrong_1: { ru: 'Доли стали 5/4 — это больше целого. Выдели одно целое и не оставляй 5/4.', uz: "Ulushlar 5/4 bo'ldi — bu butundan ko'p. Bitta butunni ajrating, 5/4 ni qoldirmang." },
    wrong_2: { ru: 'Сначала общий знаменатель 4, а не 6: 1/2 = 2/4. И не забудь перенос.', uz: "Avval umumiy maxraj 4, 6 emas: 1/2 = 2/4. Ko'chirishni ham unutmang." },
    wrong_3: { ru: 'Доли сложи в общем знаменателе: 3/4 + 2/4 = 5/4, отсюда перенос даёт 1/4.', uz: "Ulushlarni umumiy maxrajda qo'shing: 3/4 + 2/4 = 5/4, ko'chirishdan 1/4 chiqadi." },
    wrong_default: { ru: 'Приведи к знаменателю 4, сложи доли, выдели целое.', uz: "Maxraj 4 ga keltiring, ulushlarni qo'shing, butunni ajrating." },
    audio_hint_1: { ru: 'Доли стали больше целого, выдели одно целое.', uz: "Ulush butundan oshdi, bitta butunni ajrating." },
    audio_hint_2: { ru: 'Общий знаменатель здесь четыре, не шесть.', uz: "Umumiy maxraj bu yerda to'rt, olti emas." },
    audio_hint_3: { ru: 'Сложи доли в общем знаменателе и выдели целое.', uz: "Ulushlarni umumiy maxrajda qo'shing va butunni ajrating." },
    fact: { ru: 'Древние вавилонские учёные писали целое и долю вместе в системе из 60 — часы и минуты пришли оттуда.', uz: "Qadimgi bobillik olimlar butun va ulushni 60 lik tizimda yozgan — soat va daqiqa o'shandan qolgan." },
    audio: {
      intro: { ru: 'Саида пробежала утром одну целую три четвёртых километра и вечером две целых одну вторую. Сколько всего? Выбери ответ.', uz: "Saida ertalab bir butun to'rtdan uch kilometr, kechqurun ikki butun ikkidan bir yugurdi. Jami qancha? Javobni tanlang." },
      on_correct: { ru: 'Верно, всего четыре целых одна четвёртая километра. А ещё часы и минуты идут из вавилонской системы из шестидесяти.', uz: "To'g'ri, hammasi to'rt butun to'rtdan bir kilometr. Yana soat va daqiqa bobilliklarning oltmishlik tizimidan kelgan." },
      on_wrong: { ru: 'Не совсем. Приведи к знаменателю четыре, сложи доли и выдели целое.', uz: "Unchalik emas. Maxraj to'rtga keltiring, ulushlarni qo'shing va butunni ajrating." }
    }
  },

  // ===== s11 SUMMARY + ConnectionsBlock =====
  s11: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что мы усвоили', uz: "Nimani o'rgandik" },
    title: { ru: 'Теперь ты складываешь и вычитаешь смешанные числа.', uz: "Endi siz aralash sonlarni qo'shasiz va ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Разные знаменатели — сначала общий знаменатель, потом по частям.', uz: "Maxrajlar har xil bo'lsa — avval umumiy maxraj, so'ng bo'laklab." },
    main_2: { ru: 'При сложении доли больше целого — выделяем целое (перенос).', uz: "Qo'shganda ulush butundan oshsa — butunni ajratamiz (ko'chirish)." },
    main_3: { ru: 'При вычитании доли не хватает — занимаем целое у целой части.', uz: "Ayirganda ulush yetmasa — butun qismdan butunni qarzga olamiz." },
    score_label: { ru: 'Верно с первой попытки', uz: "Birinchi urinishda to'g'ri" },
    back_to_hook: { ru: 'И ответ из начала: 1 2/3 + 2 2/3 = 4 1/3, а не 3 4/3.', uz: "Boshdagi javob: 1 2/3 + 2 2/3 = 4 1/3, 3 4/3 emas." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Перевод смешанного числа и неправильной дроби» и «Сложение дробей с разными знаменателями».', uz: "«Aralash son va noto'g'ri kasr» hamda «Har xil maxrajli kasrlarni qo'shish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'десятичные дроби — другой способ записывать целое и доли.', uz: "o'nli kasrlar — butun va ulushni boshqacha yozish usuli." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты складываешь и вычитаешь смешанные числа. Если знаменатели разные, сначала приводим к общему знаменателю, потом считаем по частям. Если при сложении доли стали больше целого, выделяем целое. Если при вычитании доли не хватает, занимаем целое у целой части. Дальше нас ждут десятичные дроби — другой способ записывать целое и доли.', uz: "Zo'r. Endi siz aralash sonlarni qo'shasiz va ayirasiz. Maxrajlar har xil bo'lsa, avval umumiy maxrajga keltiramiz, so'ng bo'laklab hisoblaymiz. Qo'shganda ulush butundan oshsa, butunni ajratamiz. Ayirganda ulush yetmasa, butun qismdan butunni qarzga olamiz. Keyingi darsda o'nli kasrlar bizni kutmoqda — butun va ulushni boshqacha yozish usuli." }
  }
};

// ============================================================
// YORDAMCHILAR (infra'da yo'q — shu yerda) + faktlar
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => {
    content[`wrong_${newI}`] = c[`wrong_${oldI}`];
    content[`hint_${newI}`] = c[`hint_${oldI}`];
    content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`];
  });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

const optEl = (t, node) => <span className="body" style={{ display: 'inline' }}>{mt(t(node))}</span>;
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ margin: 0 }}>{mt(t(node))}</p> : null; };

const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-harakat (fon-on-all): Stage.stage-content ichida har ekranda.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// FAKT-BLOK — ko'k karta, katta animatsiya + kam matn (faqat to'g'ri javobdan keyin).
const FB_IT   = { ru: 'Знаешь ли ты? · IT',      uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_LIFE = { ru: 'Знаешь ли ты? · Жизнь',   uz: "Bilasizmi? · Hayot" };
const AnimMeasure = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '½', '2', '½'].map((ch, i) => (<span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.28}s` }}>{ch}</span>))}
  </div>
);
const AnimLoad = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '0', '0', '%'].map((ch, i) => (<span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>))}
  </div>
);
const AnimClock = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '2', ':', '0', '0'].map((ch, i) => (<span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.24}s` }}>{ch}</span>))}
  </div>
);
const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// ============================================================
// VIZUALIZATOR frac_5_15: MixedBar — aralash son plitkalarda. Butun = to'liq plitka, ulush = qisman plitka.
// Qo'shish: ulushlar bir butundan oshsa, ortiqcha bo'lak yangi butunga aylanadi (ko'chirish / mb-rise+arrive).
// Ayirish: yuqori ulush yetmasa, bitta butun ulushlarga sinadi (qarz olish / mb-break).
// ============================================================
const UnitBar = ({ den, fill, cls = 'on', breaking = false, arrive = false }) => (
  <span className={`mb-unit${breaking ? ' mb-break' : ''}${arrive ? ' mb-arrive' : ''}`}>
    {Array.from({ length: den }).map((_, i) => <span key={i} className={`mb-cell${i < fill ? ' ' + cls : ''}`}/>)}
  </span>
);

const MixedBar = ({ whole = 0, num = 0, den, over = 0, cls = 'on', breakLast = false, arriveLast = false, riseOver = false }) => {
  const u = [];
  for (let i = 0; i < whole; i++) u.push(<UnitBar key={`w${i}`} den={den} fill={den} cls={cls} breaking={breakLast && i === whole - 1} arrive={arriveLast && i === whole - 1}/>);
  if (num > 0) u.push(<UnitBar key="p" den={den} fill={num} cls={cls}/>);
  if (over > 0) u.push(<span key="ov" className={`mb-over${riseOver ? ' mb-rise' : ''}`}>{Array.from({ length: over }).map((_, i) => <span key={i} className="mb-ov-cell on"/>)}</span>);
  if (u.length === 0) u.push(<UnitBar key="z" den={den} fill={0} cls={cls}/>);
  return <span className="mb-wrap">{u}</span>;
};

// MixedNum — aralash son yozuvi (butun + Frac).
const MixedNum = ({ w, n, d, color }) => (
  <span className="mn">
    {(w !== null && w !== undefined) && <span className="mn-w" style={{ color }}>{w}</span>}
    {(n !== null && n !== undefined && d) && <Frac n={String(n)} d={String(d)} size="mid" color={color}/>}
  </span>
);

// ExprLine — kasr/aralash ifodani BIR XIL o'lchamda chizadi (kasr Frac + operator mos o'lchamda).
const ExprLine = ({ s, size = 'mid' }) => {
  const str = String(s);
  const out = []; let last = 0; let m; let k = 0;
  const re = /(\d+|\?)\/(\d+)/g;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last, m.index)}</span>);
    out.push(<Frac key={`f${k}`} n={m[1]} d={m[2]} size={size}/>);
    k += 1; last = m.index + m[0].length;
  }
  if (last < str.length) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last)}</span>);
  return <span className={`expr-row expr-row-${size}`}>{out}</span>;
};

// ============================================================
// DragDropItem — pointer-asosli drag-and-drop (sichqoncha + touch). Metodlar:
//   mixfill — butun-son chipni aralash ifodaning katagiga tashlash.
//   dragbin — ifodani uchta savatdan biriga: ko'chirish / qarz / to'g'ridan.
// Веди-до-верного: noto'g'ri tashlansa chip qaytadi + maslahat; to'g'ri tashlansa onResult(true).
// ============================================================
const DragChipView = ({ chip }) => (chip.expr ? <ExprLine s={chip.expr} size="sm"/> : <span className="dd-num">{chip.label}</span>);

const DragDropItem = ({ it, solved, instr, binLabels, onResult }) => {
  const t = useT();
  // Gibrid: (1) torting (pointer-drag), (2) BOSIB tanlang -> nishonga bosing (tap-rejim, touch'da ishonchli).
  const [drag, setDrag] = useState(null);          // { id, x, y, moved } — suzuvchi klon
  const [selected, setSelected] = useState(null);  // bosib tanlangan chip id (tap-rejim)
  const [landed, setLanded] = useState(null);
  const [badZone, setBadZone] = useState(null);
  const downRef = useRef(null);                     // { id, x, y, moved } — pointer pastga tushgan holat
  const isBin = it.kind === 'dragbin';
  const chips = isBin ? [{ id: 'e0', expr: it.expr, bin: it.bin }] : it.chips;
  const correctChip = isBin ? chips[0] : chips.find(x => x.ok);
  const placedChip = solved ? correctChip : (landed ? chips.find(x => x.id === landed) : null);
  const locked = solved || !!landed;

  const tryDrop = (id, zid) => {
    if (locked || !zid) return;
    const chip = chips.find(x => x.id === id);
    if (!chip) return;
    const ok = isBin ? (zid === chip.bin) : (zid === 'slot' && chip.ok);
    if (ok) { setLanded(id); setSelected(null); setBadZone(null); onResult(true); }
    else { setBadZone(zid); setSelected(null); onResult(false); }
  };
  const down = (e, id) => {
    if (locked) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { void err; }
    setBadZone(null);
    downRef.current = { id, x: e.clientX, y: e.clientY, moved: false };
    setDrag({ id, x: e.clientX, y: e.clientY, moved: false });
  };
  const move = (e, id) => {
    const info = downRef.current;
    if (!info || info.id !== id) return;
    if (Math.abs(e.clientX - info.x) > 6 || Math.abs(e.clientY - info.y) > 6) info.moved = true;
    setDrag(d => (d ? { ...d, x: e.clientX, y: e.clientY, moved: info.moved } : d));
  };
  const up = (e, id) => {
    const info = downRef.current; downRef.current = null;
    setDrag(null);
    if (!info || info.id !== id || locked) return;
    if (info.moved) {
      let zid = null;
      try { const el = document.elementFromPoint(e.clientX, e.clientY); const z = el && el.closest && el.closest('[data-zone]'); zid = z ? z.getAttribute('data-zone') : null; } catch (err) { void err; }
      if (zid) tryDrop(id, zid); else setSelected(id);   // hech qayerga tushmadi -> tanlangan qoladi
    } else {
      setSelected(s => (s === id ? null : id));            // oddiy bosish -> tanlash / bekor qilish
      setBadZone(null);
    }
  };
  const handlers = (id) => ({ onPointerDown: (e) => down(e, id), onPointerMove: (e) => move(e, id), onPointerUp: (e) => up(e, id) });
  const zoneClick = (zid) => { if (!locked && selected) tryDrop(selected, zid); };
  const clone = (drag && drag.moved) ? chips.find(x => x.id === drag.id) : null;
  const pickHint = !!selected && !locked;

  // ---- DRAGBIN: ifodani savatga (carry / borrow / direct) ----
  if (isBin) {
    return (
      <div className="dd-wrap fade-up delay-1">
        <p className="dd-instr">{mt(t(instr))}</p>
        <div className="dd-tray-row">
          {locked
            ? <span className="dd-chip dd-chip-expr dd-used"><ExprLine s={it.expr} size="sm"/></span>
            : <button className={`dd-chip dd-chip-expr${drag && drag.moved ? ' dd-dragging' : ''}${selected === 'e0' ? ' dd-chip-sel' : ''}`} {...handlers('e0')}><ExprLine s={it.expr} size="sm"/></button>}
        </div>
        <div className="dd-bins3">
          {binLabels.map(b => (
            <button key={b.key} type="button" data-zone={b.key} disabled={locked} onClick={() => zoneClick(b.key)}
              className={`sort-bin sort-bin-cu${badZone === b.key ? ' sort-bin-bad' : ''}${(placedChip && it.bin === b.key) ? ' dd-zone-on' : ''}${pickHint ? ' dd-zone-pick' : ''}`}>
              <span className="sort-bin-h">{mt(t(b.label))}</span>
              {(placedChip && it.bin === b.key) && <span className="sort-chip-in"><ExprLine s={it.expr} size="sm"/></span>}
            </button>
          ))}
        </div>
        {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><ExprLine s={it.expr} size="sm"/></span>}
      </div>
    );
  }

  // ---- MIXFILL: aralash ifoda + butun-son katagi ----
  return (
    <div className="dd-wrap fade-up delay-1">
      <p className="dd-instr">{mt(t(instr))}</p>
      <div className="dd-eq">
        <MixedNum w={it.aw} n={it.an} d={it.d} color={T.accent}/>
        <span className="expr-op expr-op-mid">{it.op === '-' ? '−' : '+'}</span>
        <MixedNum w={it.bw} n={it.bn} d={it.d} color={T.blue}/>
        <span className="expr-op expr-op-mid">=</span>
        <span className="mn-result">
          <span data-zone="slot" onClick={() => zoneClick('slot')} role="button" tabIndex={locked ? -1 : 0}
            className={`dd-slot${placedChip ? ' dd-slot-on' : ''}${badZone === 'slot' ? ' dd-bad' : ''}${pickHint ? ' dd-zone-pick' : ''}`}>{placedChip ? placedChip.label : '?'}</span>
          {it.resN != null && <Frac n={String(it.resN)} d={String(it.d)} size="mid"/>}
        </span>
      </div>
      <div className="dd-tray-row">
        {chips.map(ch => {
          const used = placedChip && placedChip.id === ch.id;
          return (
            <button key={ch.id} className={`dd-chip${used ? ' dd-used' : ''}${(drag && drag.moved && drag.id === ch.id) ? ' dd-dragging' : ''}${selected === ch.id ? ' dd-chip-sel' : ''}`} disabled={locked} {...handlers(ch.id)}>
              <DragChipView chip={ch}/>
            </button>
          );
        })}
      </div>
      {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><DragChipView chip={clone}/></span>}
    </div>
  );
};

// ============================================================
// SeqMC — ketma-ket beshta tez MC (mobil-do'st tap, веди-до-верного).
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const qs = c.questions; const n = qs.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `seq${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const q = qs[idx];
  const solvedItem = picked === q.correct;
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && qs[i].say) e.pushOneOff(qs[i].say[lang]); } };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const pick = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    const isCorrect = i === q.correct;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = isCorrect;
    if (isCorrect) {
      setPicked(i); sfx.playCorrect();
      const cur = firstTryRef.current.slice();
      advanceRef.current = setTimeout(() => {
        if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); sayItem(ni); }
        else finish(cur);
      }, 850);
    } else {
      sfx.playWrong();
      setWrong(prev => { const s = new Set(prev); s.add(i); return s; });
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(q.no ? q.no[lang] : c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <ExprLine s={tx(q.q)} size="big"/>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <ExprLine s={tx(o)} size="mid"/>
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? q.ok : q.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMix — ketma-ket HAR XIL TIPLI misollar (mc / mixfill / dragbin), osondan qiyinga. Mobil-do'st.
// ============================================================
const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev, factOnDone }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const lvlNode = { easy: c.lvl_easy, mid: c.lvl_mid, hard: c.lvl_hard };
  const audio = useAudio([{ id: `smix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];
  const solvedItem = picked !== null;
  const advanceIntro = () => { if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); } };
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const wrongVoice = () => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff((it.no && it.no[lang]) || c.audio.on_wrong[lang]); } };
  const markFirst = (ok) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = ok; };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const correctNow = (firstTries) => {
    sfx.playCorrect();
    advanceRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); setHint(false); sayItem(ni); }
      else finish(firstTries);
    }, 820);
  };
  const pickMc = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    advanceIntro();
    const ok = i === it.correct; markFirst(ok);
    if (ok) { setPicked(i); correctNow(firstTryRef.current.slice()); }
    else { sfx.playWrong(); setWrong(p => { const s = new Set(p); s.add(i); return s; }); wrongVoice(); }
  };
  const dragResult = (ok) => {
    if (done || solvedItem) return;
    advanceIntro();
    markFirst(ok);
    if (ok) { setPicked('ok'); setHint(false); correctNow(firstTryRef.current.slice()); }
    else { sfx.playWrong(); setHint(true); wrongVoice(); }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const showWrong = !solvedItem && (wrong.size > 0 || hint);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <>
            <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: T.success }}><IconOk/></span>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Barcha turdagi misollar yechildi." : 'Все типы примеров решены.'}</p>
            </div>
            {factOnDone}
          </>
        ) : (
          <>
            <span className="smix-tag fade-up">{mt(tx(lvlNode[it.lvl]))}</span>

            {it.kind === 'mc' && (
              <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
                <ExprLine s={it.prob} size="big"/>
              </div>
            )}
            {it.kind === 'mc' && (
              <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <ExprLine s={o} size="mid"/>
                    </button>
                  );
                })}
              </div>
            )}

            {(it.kind === 'mixfill' || it.kind === 'dragbin') && (
              <DragDropItem key={idx} it={it} solved={solvedItem}
                instr={it.kind === 'dragbin' ? c.bin_ask : c.drag_num}
                binLabels={[{ key: 'carry', label: c.bin_carry }, { key: 'borrow', label: c.bin_borrow }, { key: 'direct', label: c.bin_direct }]}
                onResult={dragResult}/>
            )}

            <FeedbackBlock show={solvedItem || showWrong} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? <IconOk/> : <IconNo/>}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? it.ok : it.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR (fon — Stage.has-amb orqali har ekranda)
// ============================================================

// s0 — HOOK (konseptual, personajsiz). Qaytishda picked TO'LIQ sbros.
const ScreenHook = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: screen, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <MixedBar whole={3} num={3} den={3} over={1} riseOver/>
          <span className="mb-label">3 <Frac n="4" d="3" size="mid" color={T.accent}/></span>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ margin: 0, color: T.ink2 }}>{mt(t(reveals[picked]))}</p>}
      </div>
    </Stage>
  );
};

// s1 — WARM-UP (QuestionScreen): noto'g'ri kasr -> aralash son.
const ScreenWarm = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]); // to'g'ri -> B
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content}
    titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={() => <MixedBar whole={1} num={3} den={4}/>}/>;
};

// s2 — EXPLORATION (step): qo'shish + ko'chirish.
const ScreenAddCarry = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          {step === 0 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={1} num={2} den={3}/></div>
              <span className="mb-plus">+</span>
              <div className="mb-grp"><MixedBar whole={2} num={2} den={3}/></div>
            </div>
          )}
          {step === 1 && <MixedBar whole={3} den={3}/>}
          {step === 2 && <MixedBar whole={3} num={3} den={3} over={1} riseOver/>}
          {step >= 3 && <MixedBar whole={4} num={1} den={3} arriveLast/>}
          {step >= 1 && step < 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(step === 1 ? c.cap1 : c.cap2))}</p>}
          {step >= 3 && <span className="mb-label"><ExprLine s={t(c.result)} size="mid"/></span>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (step): ayirish + qarz olish.
const ScreenSubBorrow = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          {step <= 1 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={3} num={1} den={4} breakLast={step === 1}/></div>
              <span className="mb-plus">−</span>
              <div className="mb-grp"><MixedBar whole={1} num={3} den={4} cls="on-blue"/></div>
            </div>
          )}
          {step === 2 && <MixedBar whole={2} num={4} den={4} over={1} riseOver/>}
          {step >= 3 && <MixedBar whole={1} num={2} den={4} arriveLast/>}
          {step >= 1 && step < 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(step === 1 ? c.cap1 : c.cap2))}</p>}
          {step >= 3 && <span className="mb-label"><ExprLine s={t(c.result)} size="mid"/></span>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (step): har xil maxraj.
const ScreenDiffDen = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s4_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          {step === 0 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={1} num={1} den={2}/></div>
              <span className="mb-plus">+</span>
              <div className="mb-grp"><MixedBar whole={2} num={1} den={3} cls="on-blue"/></div>
            </div>
          )}
          {step === 1 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={1} num={3} den={6}/></div>
              <span className="mb-plus">+</span>
              <div className="mb-grp"><MixedBar whole={2} num={2} den={6} cls="on-blue"/></div>
            </div>
          )}
          {step >= 2 && <MixedBar whole={3} num={5} den={6} arriveLast={step === 2}/>}
          {step >= 1 && step < 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.cap1))}</p>}
          {step === 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.cap2))}</p>}
          {step >= 3 && <span className="mb-label"><ExprLine s={t(c.result)} size="mid"/></span>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s5 — RULE + 2-usul.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2, c.rule_3, c.rule_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="eyebrow" style={{ color: '#A07D14', marginBottom: 6 }}>{t(c.warn_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn))}</p>
        </div>
        <div className="frame fade-up delay-3">
          <p className="eyebrow" style={{ color: T.blue, marginBottom: 6 }}>{t(c.second_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.second))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — DRAG-FILL (mixfill, scored). Bitta DragDropItem + o'z holati.
const ScreenDrag = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const result = (ok) => {
    if (solved) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true); setHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: String(c.item.answer), studentAnswer: String(c.item.answer), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: 1, solved: true });
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      sfx.playWrong(); setHint(true);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.1vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.2vw, 18px)' }}>
          <DragDropItem it={c.item} solved={solved} instr={c.drag_num} onResult={result}/>
        </div>
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s7 — beshta oson savol.
const ScreenEasy = (props) => <SeqMC {...props} screenContent={CONTENT.s7} scored={true}/>;

// s8 — CASE (Nilufar, QuestionScreen).
const ScreenCase = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 3, 0, 1]); // to'g'ri -> C
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content}
    titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={(solved) => solved ? <MixedBar whole={1} num={2} den={4}/> : <div className="mb-eq"><MixedBar whole={3} num={1} den={4}/><span className="mb-plus">−</span><MixedBar whole={1} num={3} den={4} cls="on-blue"/></div>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_LIFE} anim={<AnimMeasure/>}/>}/>;
};

// s9 — olti-sakkiz misol, har xil tip.
const ScreenMix = (props) => <SeqMix {...props} screenContent={CONTENT.s9} scored={true} factOnDone={<FactCard text={CONTENT.s9.fact} badge={FB_IT} anim={<AnimLoad/>}/>}/>;

// s10 — YAKUNIY (QuestionScreen, final).
const ScreenFinal = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 1, 2, 0]); // to'g'ri -> D
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content}
    titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={(solved) => solved ? <MixedBar whole={4} num={1} den={4}/> : <div className="mb-eq"><MixedBar whole={1} num={3} den={4}/><span className="mb-plus">+</span><MixedBar whole={2} num={2} den={4} cls="on-blue"/></div>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimClock/>}/>}/>;
};

// s11 — SUMMARY (kanonik: ball qatori + ulanishlar bloki, top-anchor).
const ScreenSummary = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const scoredTotal = SCREEN_META.filter(s => s.scored).length;
  const correctCount = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame-success fade-up delay-1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="display" style={{ fontSize: 'clamp(26px, 6vw, 38px)', color: T.success }}>{correctCount} / {scoredTotal}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2"><p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

export default function MixedNumbersLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
    const scored = SCREEN_META.filter(s => s.scored);
    const finalScreens = scored.filter(s => s.scope === 'final');
    const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
    const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && a.correct).length;
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scored.length,
      correctAnswers: correctCount,
      scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
      finalScore: finalCorrect,
      finalTotal: finalScreens.length,
      passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    };
    safeOnFinished(payload);
  }, [answers, safeOnFinished]);

  const screens = [ScreenHook, ScreenWarm, ScreenAddCarry, ScreenSubBorrow, ScreenDiffDen, ScreenRule, ScreenDrag, ScreenEasy, ScreenCase, ScreenMix, ScreenFinal, ScreenSummary];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
    </LangContext.Provider>
  );
}
