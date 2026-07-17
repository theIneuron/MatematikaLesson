# Dars33 — CONTENT (Б6 NEPTUN · «Tenglamalar: noma'lumni topish» · program d.36)

> **Mexanika (metodist 2026-07-17): GIBRID** — tarozi/muvozanat (teach + qoida), yashirin oyna (mashq), qo'yib-tekshirish.
> Klon-baza: **Dars32.jsx** (Neptun biom + siz-registr tayyor). Yangi Stage'lar: `BalanceScale`/`BalanceStage`,
> `SlotFindStage` (Dars32 `SlotExpr` reversi), `SubstStage`. Barcha tenglama BUTUN musbat yechimli; operand bir xonali;
> natija ≤ 12; ayirish faqat `x−n` (noma'lum birinchi).

## ⚠️ Metodistga eslatmalar (validatsiya kerak)

1. **`x` ni ovozda qanday o'qish** — hal qilinishi kerak masala. O'zbek lotin alifbosida `x` = /χ/ (xat, xola)
   undoshi, matematik noma'lum emas. Rus an'anasida «икс». Men **vizualda `x`** (program d.36 notatsiyasi),
   **ovozda «iks»** ishlatdim, ammo har joyda **«yashirin son»** deb qayta bog'ladim. Agar o'zbek metodist «iks»
   ni rad qilsa — ovozda faqat «yashirin son / noma'lum son» qoldiriladi, vizual `x` saqlanadi. **Tasdiqланг.**
2. **Atamalar (draft):** tenglama (уравнение), noma'lum (неизвестное), tenglik (равенство), ikki tomon (обе части),
   muvozanat (равновесие), qo'yib tekshirish (проверка подстановкой). Xaydarov darsligiga solishtirilmagan (Notion MCP uzuq).
3. **Ayiruv atamasi:** ovozda «ayirish» ishlatildi (besh ayirish ikki). Agar darslikda «minus» bo'lsa — almashtiriladi.

---

```javascript
const CONTENT = {
  // s0 — HOOK: x+4=9, x=5. Distraktor 13 = 9+4 (teskari amal yo'q, hammasini qo'shish).
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Уравнения', uz: "Mavzu: Tenglamalar" },
    lead: { ru: 'Какое число спрятано?', uz: "Qanday son yashiringan?" },
    q: { ru: 'Бит показывает уравнение: x плюс четыре равно девять. Какое число спрятано за x?', uz: "Bit tenglamani ko'rsatadi: x qo'shuv to'rt teng to'qqiz. x ortida qanday son yashiringan?" },
    opt0: { ru: '13', uz: '13' },   // distraktor: 9+4 (teskari amal qilinmadi)
    opt1: { ru: '5', uz: '5' },     // to'g'ri: 9−4
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы снова на палубе станции у Нептуна. Это последняя планета нашего пути.',
          'Бит показывает уравнение: x плюс четыре равно девять.',
          'x — это скрытое число, которое мы ищем. Его надо найти так, чтобы слева и справа было поровну.',
          'Послушай два ответа. Первый — тринадцать. Второй — пять. Или ты пока не знаешь. Выбери свой ответ.'
        ],
        uz: [
          "Yana Neptun yonidagi stansiya dekasidamiz. Bu — yo'limizning oxirgi sayyorasi.",
          "Bit tenglamani ko'rsatadi: x qo'shuv to'rt teng to'qqiz.",
          "x — bu biz qidirayotgan yashirin son. Uni shunday topish kerakki, chap va o'ng tomon teng bo'lsin.",
          "Ikki javobni tinglang. Birinchi — o'n uch. Ikkinchi — besh. Yoki hali bilmaysiz. O'z javobingizni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Пять плюс четыре — девять. Слева и справа поровну.', uz: "To'g'ri. Besh qo'shuv to'rt — to'qqiz. Chap va o'ng tomon teng." },
      on_wrong: { ru: 'Тринадцать — это девять плюс четыре. Но складывать всё не нужно. Сейчас разберём.', uz: "O'n uch — bu to'qqiz qo'shuv to'rt. Ammo hammasini qo'shish shart emas. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Сегодня научимся находить спрятанное число.', uz: "Hechqisi yo'q. Bugun yashirin sonni topishni o'rganamiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: TAROZI (BalanceScale). x+4=9, muvozanat. reveal 0 muvozanat, 1 to'rtni oldik, 2 x=5. 4 seg.
  s1: {
    eyebrow: { ru: 'Равновесие', uz: 'Muvozanat' },
    lead: { ru: 'Две части — поровну', uz: "Ikki tomon — teng" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Уравнение — это весы. Слева и справа поровну. Сними известное — останется спрятанное число.', uz: "Tenglama — bu tarozi. Chap va o'ng tomon teng. Ma'lumni ol — yashirin son qoladi." },
    audio: {
      ru: [
        'Представь весы. Слева стоит x плюс четыре, справа — девять. Они в равновесии, поровну.',
        'Чтобы найти спрятанное число, снимем с обеих сторон по четыре.',
        'Слева осталось x, справа — девять минус четыре, это пять.',
        'Значит, x равно пять. Весы остались в равновесии.'
      ],
      uz: [
        "Tarozini tasavvur qiling. Chapda x qo'shuv to'rt turibdi, o'ngda — to'qqiz. Ular muvozanatda, teng.",
        "Yashirin sonni topish uchun ikkala tomondan to'rttadan olamiz.",
        "Chapda x qoldi, o'ngda — to'qqiz ayirish to'rt, bu besh.",
        "Demak, x beshga teng. Tarozi muvozanatda qoldi."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: YASHIRIN OYNA (SlotFind). ▢+4=9. reveal 0 bo'sh oyna, 1 son 5 kiradi, 2 yig'indi 9 tasdiq. 4 seg.
  s2: {
    eyebrow: { ru: 'Окошко', uz: 'Oyna' },
    lead: { ru: 'x — это окошко', uz: "x — bu oyna" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'x — это окошко для спрятанного числа. Подбери число так, чтобы равенство стало верным.', uz: "x — bu yashirin son uchun oyna. Sonni shunday tanlangki, tenglik to'g'ri bo'lsin." },
    audio: {
      ru: [
        'Спрятанное число можно показать окошком: окошко плюс четыре равно девять.',
        'Подберём число в окошко. Поставим пять.',
        'Проверим: пять плюс четыре — девять. Равенство верное.',
        'Окошко и буква x — это одно и то же: место для спрятанного числа.'
      ],
      uz: [
        "Yashirin sonni oyna bilan ko'rsatish mumkin: oyna qo'shuv to'rt teng to'qqiz.",
        "Oynaga son tanlaymiz. Beshni qo'yamiz.",
        "Tekshiramiz: besh qo'shuv to'rt — to'qqiz. Tenglik to'g'ri.",
        "Oyna va x harfi — bu bir xil narsa: yashirin son uchun joy."
      ]
    }
  },

  // s3 — QOIDA: noma'lumni topish — ma'lumni ol (teskari amal) + check (x+2=6, x=4).
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Уравнение — две равные части. Чтобы найти спрятанное число, убери от девяти известное четыре: получится спрятанное.', uz: "Tenglama — ikkita teng tomon. Yashirin sonni topish uchun to'qqizdan ma'lum to'rtni ol: yashirin son chiqadi." },
    check_q: { ru: 'x плюс два равно шесть. Чему равно x?', uz: "x qo'shuv ikki teng olti. x nechaga teng?" },
    opts: [{ ru: '4', uz: '4', ok: true }, { ru: '8', uz: '8' }, { ru: '2', uz: '2' }],
    wrong: { ru: 'Не складывай всё. Убери от шести известное два: шесть минус два — четыре.', uz: "Hammasini qo'shmang. Oltidan ma'lum ikkini oling: olti ayirish ikki — to'rt." },
    check_ok: { ru: 'Верно! Четыре плюс два — шесть. Поровну.', uz: "To'g'ri! To'rt qo'shuv ikki — olti. Teng." },
    audio: {
      ru: [
        'Запомним правило. Слушай.',
        'Уравнение — это две равные части, как весы.',
        'Чтобы найти спрятанное число, убери от результата известное число.',
        'Проверь. x плюс два равно шесть. Чему равно x?'
      ],
      uz: [
        "Qoidani eslab qolamiz. Tinglang.",
        "Tenglama — bu ikkita teng tomon, xuddi tarozi kabi.",
        "Yashirin sonni topish uchun natijadan ma'lum sonni oling.",
        "Tekshiring. x qo'shuv ikki teng olti. x nechaga teng?"
      ]
    }
  },

  // s4 — QO'YIB TEKSHIR + WARN (x≠9+4). CheckViz: x=5 → 5+4=9. check (x+3=7, x=4).
  s4: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshirish' },
    lead: { ru: 'Подставь и проверь', uz: "Qo'yib tekshiring" },
    warn_badge: { ru: 'Осторожно', uz: 'Ehtiyot' },
    warn: { ru: 'x плюс четыре равно девять — это не значит x равно девять плюс четыре. Складывать всё нельзя.', uz: "x qo'shuv to'rt teng to'qqiz — bu x teng to'qqiz qo'shuv to'rt degani emas. Hammasini qo'shib bo'lmaydi." },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Нашёл число — подставь его вместо x и проверь, что равенство верное.', uz: "Sonni topdingiz — uni x o'rniga qo'ying va tenglik to'g'riligini tekshiring." },
    check_q: { ru: 'x плюс три равно семь. Чему равно x?', uz: "x qo'shuv uch teng yetti. x nechaga teng?" },
    opts: [{ ru: '4', uz: '4', ok: true }, { ru: '10', uz: '10' }, { ru: '3', uz: '3' }],
    wrong: { ru: 'Десять — это семь плюс три. Нужно наоборот: семь минус три — четыре.', uz: "O'n — bu yetti qo'shuv uch. Aksincha kerak: yetti ayirish uch — to'rt." },
    check_ok: { ru: 'Верно! Подставим: четыре плюс три — семь.', uz: "To'g'ri! Qo'yib ko'ramiz: to'rt qo'shuv uch — yetti." },
    audio: {
      ru: [
        'Когда нашёл спрятанное число, всегда проверь его.',
        'Подставь число вместо x и посчитай. Если слева и справа поровну — число верное.',
        'Но будь внимателен: x плюс четыре равно девять — это не значит девять плюс четыре.',
        'Проверь сам. x плюс три равно семь. Чему равно x?'
      ],
      uz: [
        "Yashirin sonni topganingizda, uni doim tekshiring.",
        "Sonni x o'rniga qo'ying va hisoblang. Chap va o'ng teng bo'lsa — son to'g'ri.",
        "Lekin diqqat bo'ling: x qo'shuv to'rt teng to'qqiz — bu to'qqiz qo'shuv to'rt degani emas.",
        "O'zingiz tekshiring. x qo'shuv uch teng yetti. x nechaga teng?"
      ]
    }
  },

  // sTBL — KALIT: tenglama-tekshirish jadvali (x+2=6→4, x+3=8→5, x−2=3→5). done sTBL_2 (3 seg).
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Проверяем спрятанное число', uz: "Yashirin sonni tekshiramiz" },
    caption: { ru: 'Уравнение · спрятанное число · проверка', uz: "Tenglama · yashirin son · tekshirish" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'В любом уравнении найди спрятанное число и подставь его для проверки.', uz: "Har qanday tenglamada yashirin sonni toping va tekshirish uchun qo'ying." },
    audio: {
      ru: [
        'Соберём ключ. В каждой строке — уравнение и его спрятанное число.',
        'x плюс два равно шесть — спрятано четыре. x плюс три равно восемь — спрятано пять.',
        'x минус два равно три — спрятано пять. Подставь и проверь каждое.'
      ],
      uz: [
        "Kalitni yig'amiz. Har qatorda — tenglama va uning yashirin soni.",
        "x qo'shuv ikki teng olti — besh... yo'q, to'rt yashiringan. x qo'shuv uch teng sakkiz — besh yashiringan.",
        "x ayirish ikki teng uch — besh yashiringan. Har birini qo'yib tekshiring."
      ]
    }
  },

  // s5 — MASHQ BalanceStage single: x+3=8 → 5. distraktor 11(=8+3, M1), 8(=o'ng tomon, M3).
  s5: {
    eyebrow: { ru: 'Тренировка · 1', uz: 'Mashq · 1' },
    label: { ru: 'Найди спрятанное число', uz: "Yashirin sonni toping" },
    q: { ru: 'x плюс три равно восемь. Чему равно x?', uz: "x qo'shuv uch teng sakkiz. x nechaga teng?" },
    opt0: { ru: '11', uz: '11' },   // M1: 8+3
    opt1: { ru: '5', uz: '5', ok: true },  // 8−3
    opt2: { ru: '8', uz: '8' },     // M3: o'ng tomonni ko'chirdi
    wrong_0: { ru: 'Одиннадцать — это восемь плюс три. Но складывать всё не нужно. Убери от восьми известное три: восемь минус три — пять.', uz: "O'n bir — bu sakkiz qo'shuv uch. Ammo hammasini qo'shish shart emas. Sakkizdan ma'lum uchni oling: sakkiz ayirish uch — besh." },
    wrong_2: { ru: 'Восемь — это весь результат, а не спрятанное число. Убери от восьми известное три: получится пять.', uz: "Sakkiz — bu butun natija, yashirin son emas. Sakkizdan ma'lum uchni oling: besh chiqadi." },
    correct_text: { ru: 'Верно. Пять плюс три — восемь. Поровну.', uz: "To'g'ri. Besh qo'shuv uch — sakkiz. Teng." },
    audio: {
      intro: { ru: 'x плюс три равно восемь. Найди спрятанное число x.', uz: "x qo'shuv uch teng sakkiz. Yashirin son x ni toping." },
      on_correct: { ru: 'Верно. Восемь минус три — пять.', uz: "To'g'ri. Sakkiz ayirish uch — besh." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — MASHQ SlotFind 3 round (+): ▢+2=7→5, ▢+5=9→4, ▢+3=8→5. distraktor = o'ng tomon (M4: +n etiborsiz).
  s6: {
    eyebrow: { ru: 'Тренировка · 2', uz: 'Mashq · 2' },
    label: { ru: 'Подбери число в окошко', uz: "Oynaga son tanlang" },
    rounds: [
      { q: { ru: 'Окошко плюс два равно семь. Какое число в окошке?', uz: "Oyna qo'shuv ikki teng yetti. Oynada qanday son?" },
        opt0: { ru: '7', uz: '7' }, opt1: { ru: '5', uz: '5', ok: true }, opt2: { ru: '9', uz: '9' },
        wrong_0: { ru: 'Семь — это весь результат. Убери известное два: семь минус два — пять.', uz: "Yetti — bu butun natija. Ma'lum ikkini oling: yetti ayirish ikki — besh." },
        wrong_2: { ru: 'Девять — это семь плюс два. Нужно наоборот: семь минус два — пять.', uz: "To'qqiz — bu yetti qo'shuv ikki. Aksincha kerak: yetti ayirish ikki — besh." },
        correct_text: { ru: 'Верно. Пять плюс два — семь.', uz: "To'g'ri. Besh qo'shuv ikki — yetti." } },
      { q: { ru: 'Окошко плюс пять равно девять. Какое число в окошке?', uz: "Oyna qo'shuv besh teng to'qqiz. Oynada qanday son?" },
        opt0: { ru: '9', uz: '9' }, opt1: { ru: '4', uz: '4', ok: true }, opt2: { ru: '14', uz: '14' },
        wrong_0: { ru: 'Девять — это весь результат. Убери известное пять: девять минус пять — четыре.', uz: "To'qqiz — bu butun natija. Ma'lum beshni oling: to'qqiz ayirish besh — to'rt." },
        wrong_2: { ru: 'Четырнадцать — это девять плюс пять. Нужно наоборот: девять минус пять — четыре.', uz: "O'n to'rt — bu to'qqiz qo'shuv besh. Aksincha kerak: to'qqiz ayirish besh — to'rt." },
        correct_text: { ru: 'Верно. Четыре плюс пять — девять.', uz: "To'g'ri. To'rt qo'shuv besh — to'qqiz." } },
      { q: { ru: 'Окошко плюс три равно восемь. Какое число в окошке?', uz: "Oyna qo'shuv uch teng sakkiz. Oynada qanday son?" },
        opt0: { ru: '8', uz: '8' }, opt1: { ru: '5', uz: '5', ok: true }, opt2: { ru: '11', uz: '11' },
        wrong_0: { ru: 'Восемь — это весь результат. Убери известное три: восемь минус три — пять.', uz: "Sakkiz — bu butun natija. Ma'lum uchni oling: sakkiz ayirish uch — besh." },
        wrong_2: { ru: 'Одиннадцать — это восемь плюс три. Нужно наоборот: восемь минус три — пять.', uz: "O'n bir — bu sakkiz qo'shuv uch. Aksincha kerak: sakkiz ayirish uch — besh." },
        correct_text: { ru: 'Верно. Пять плюс три — восемь.', uz: "To'g'ri. Besh qo'shuv uch — sakkiz." } }
    ],
    audio: {
      intro: { ru: 'Подбери число в окошко так, чтобы равенство стало верным.', uz: "Oynaga sonni shunday tanlangki, tenglik to'g'ri bo'lsin." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s7 — MASHQ BalanceStage 3 round (+): x+4=10→6, x+1=5→4, x+6=9→3. distraktor result+n (M1).
  s7: {
    eyebrow: { ru: 'Тренировка · 3', uz: 'Mashq · 3' },
    label: { ru: 'Найди спрятанное число', uz: "Yashirin sonni toping" },
    rounds: [
      { q: { ru: 'x плюс четыре равно десять. Чему равно x?', uz: "x qo'shuv to'rt teng o'n. x nechaga teng?" },
        opt0: { ru: '14', uz: '14' }, opt1: { ru: '6', uz: '6', ok: true }, opt2: { ru: '10', uz: '10' },
        wrong_0: { ru: 'Четырнадцать — это десять плюс четыре. Убери известное четыре: десять минус четыре — шесть.', uz: "O'n to'rt — bu o'n qo'shuv to'rt. Ma'lum to'rtni oling: o'n ayirish to'rt — olti." },
        wrong_2: { ru: 'Десять — это весь результат. Убери известное четыре: получится шесть.', uz: "O'n — bu butun natija. Ma'lum to'rtni oling: olti chiqadi." },
        correct_text: { ru: 'Верно. Шесть плюс четыре — десять.', uz: "To'g'ri. Olti qo'shuv to'rt — o'n." } },
      { q: { ru: 'x плюс один равно пять. Чему равно x?', uz: "x qo'shuv bir teng besh. x nechaga teng?" },
        opt0: { ru: '6', uz: '6' }, opt1: { ru: '4', uz: '4', ok: true }, opt2: { ru: '5', uz: '5' },
        wrong_0: { ru: 'Шесть — это пять плюс один. Нужно наоборот: пять минус один — четыре.', uz: "Olti — bu besh qo'shuv bir. Aksincha kerak: besh ayirish bir — to'rt." },
        wrong_2: { ru: 'Пять — это весь результат. Убери известное один: получится четыре.', uz: "Besh — bu butun natija. Ma'lum birni oling: to'rt chiqadi." },
        correct_text: { ru: 'Верно. Четыре плюс один — пять.', uz: "To'g'ri. To'rt qo'shuv bir — besh." } },
      { q: { ru: 'x плюс шесть равно девять. Чему равно x?', uz: "x qo'shuv olti teng to'qqiz. x nechaga teng?" },
        opt0: { ru: '15', uz: '15' }, opt1: { ru: '3', uz: '3', ok: true }, opt2: { ru: '9', uz: '9' },
        wrong_0: { ru: 'Пятнадцать — это девять плюс шесть. Убери известное шесть: девять минус шесть — три.', uz: "O'n besh — bu to'qqiz qo'shuv olti. Ma'lum oltini oling: to'qqiz ayirish olti — uch." },
        wrong_2: { ru: 'Девять — это весь результат. Убери известное шесть: получится три.', uz: "To'qqiz — bu butun natija. Ma'lum oltini oling: uch chiqadi." },
        correct_text: { ru: 'Верно. Три плюс шесть — девять.', uz: "To'g'ri. Uch qo'shuv olti — to'qqiz." } }
    ],
    audio: {
      intro: { ru: 'Весы в равновесии. Найди спрятанное число x.', uz: "Tarozi muvozanatda. Yashirin son x ni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s8 — MASHQ SlotFind 3 round (x−n=res): x−2=3→5, x−4=1→5, x−3=4→7. distraktor res−n (M2: yo'nalish teskari).
  s8: {
    eyebrow: { ru: 'Тренировка · 4', uz: 'Mashq · 4' },
    label: { ru: 'Теперь с вычитанием', uz: "Endi ayirish bilan" },
    rounds: [
      { q: { ru: 'x минус два равно три. Чему равно x?', uz: "x ayirish ikki teng uch. x nechaga teng?" },
        opt0: { ru: '1', uz: '1' }, opt1: { ru: '5', uz: '5', ok: true }, opt2: { ru: '3', uz: '3' },
        wrong_0: { ru: 'Один — это три минус два. Но здесь наоборот: спрятанное число больше. Прибавь известное: три плюс два — пять.', uz: "Bir — bu uch ayirish ikki. Ammo bu yerda aksincha: yashirin son kattaroq. Ma'lumni qo'shing: uch qo'shuv ikki — besh." },
        wrong_2: { ru: 'Три — это весь результат. Прибавь известное два: три плюс два — пять.', uz: "Uch — bu butun natija. Ma'lum ikkini qo'shing: uch qo'shuv ikki — besh." },
        correct_text: { ru: 'Верно. Пять минус два — три.', uz: "To'g'ri. Besh ayirish ikki — uch." } },
      { q: { ru: 'x минус четыре равно один. Чему равно x?', uz: "x ayirish to'rt teng bir. x nechaga teng?" },
        opt0: { ru: '3', uz: '3' }, opt1: { ru: '5', uz: '5', ok: true }, opt2: { ru: '1', uz: '1' },
        wrong_0: { ru: 'Три — это не то. При вычитании прибавь известное к результату: один плюс четыре — пять.', uz: "Uch — bu noto'g'ri. Ayirishda ma'lumni natijaga qo'shing: bir qo'shuv to'rt — besh." },
        wrong_2: { ru: 'Один — это весь результат. Прибавь известное четыре: один плюс четыре — пять.', uz: "Bir — bu butun natija. Ma'lum to'rtni qo'shing: bir qo'shuv to'rt — besh." },
        correct_text: { ru: 'Верно. Пять минус четыре — один.', uz: "To'g'ri. Besh ayirish to'rt — bir." } },
      { q: { ru: 'x минус три равно четыре. Чему равно x?', uz: "x ayirish uch teng to'rt. x nechaga teng?" },
        opt0: { ru: '1', uz: '1' }, opt1: { ru: '7', uz: '7', ok: true }, opt2: { ru: '4', uz: '4' },
        wrong_0: { ru: 'Один — это четыре минус три. Но здесь прибавь известное: четыре плюс три — семь.', uz: "Bir — bu to'rt ayirish uch. Ammo bu yerda ma'lumni qo'shing: to'rt qo'shuv uch — yetti." },
        wrong_2: { ru: 'Четыре — это весь результат. Прибавь известное три: четыре плюс три — семь.', uz: "To'rt — bu butun natija. Ma'lum uchni qo'shing: to'rt qo'shuv uch — yetti." },
        correct_text: { ru: 'Верно. Семь минус три — четыре.', uz: "To'g'ri. Yetti ayirish uch — to'rt." } }
    ],
    audio: {
      intro: { ru: 'Теперь уравнение с вычитанием. Подбери число в окошко.', uz: "Endi ayirishli tenglama. Oynaga son tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — MASHQ SubstStage 3 round: qaysi qiymat tenglikni to'g'ri qiladi (qo'yib-tekshir). M3: o'ng tomon soni.
  s9: {
    eyebrow: { ru: 'Тренировка · 5', uz: 'Mashq · 5' },
    label: { ru: 'Подставь и проверь', uz: "Qo'ying va tekshiring" },
    rounds: [
      { q: { ru: 'Какое число сделает верным: x плюс три равно восемь?', uz: "Qaysi son to'g'ri qiladi: x qo'shuv uch teng sakkiz?" },
        opt0: { ru: '8', uz: '8' }, opt1: { ru: '5', uz: '5', ok: true }, opt2: { ru: '11', uz: '11' },
        wrong_0: { ru: 'Подставим восемь: восемь плюс три — одиннадцать, а не восемь. Не подходит. Верное число — пять.', uz: "Sakkizni qo'yamiz: sakkiz qo'shuv uch — o'n bir, sakkiz emas. Mos emas. To'g'ri son — besh." },
        wrong_2: { ru: 'Подставим одиннадцать: одиннадцать плюс три — четырнадцать. Не подходит. Верное число — пять.', uz: "O'n birni qo'yamiz: o'n bir qo'shuv uch — o'n to'rt. Mos emas. To'g'ri son — besh." },
        correct_text: { ru: 'Верно. Пять плюс три — восемь. Равенство верное.', uz: "To'g'ri. Besh qo'shuv uch — sakkiz. Tenglik to'g'ri." } },
      { q: { ru: 'Какое число сделает верным: x плюс два равно девять?', uz: "Qaysi son to'g'ri qiladi: x qo'shuv ikki teng to'qqiz?" },
        opt0: { ru: '9', uz: '9' }, opt1: { ru: '7', uz: '7', ok: true }, opt2: { ru: '11', uz: '11' },
        wrong_0: { ru: 'Подставим девять: девять плюс два — одиннадцать, а не девять. Не подходит. Верное число — семь.', uz: "To'qqizni qo'yamiz: to'qqiz qo'shuv ikki — o'n bir, to'qqiz emas. Mos emas. To'g'ri son — yetti." },
        wrong_2: { ru: 'Подставим одиннадцать: одиннадцать плюс два — тринадцать. Не подходит. Верное число — семь.', uz: "O'n birni qo'yamiz: o'n bir qo'shuv ikki — o'n uch. Mos emas. To'g'ri son — yetti." },
        correct_text: { ru: 'Верно. Семь плюс два — девять.', uz: "To'g'ri. Yetti qo'shuv ikki — to'qqiz." } },
      { q: { ru: 'Какое число сделает верным: x минус два равно четыре?', uz: "Qaysi son to'g'ri qiladi: x ayirish ikki teng to'rt?" },
        opt0: { ru: '4', uz: '4' }, opt1: { ru: '6', uz: '6', ok: true }, opt2: { ru: '2', uz: '2' },
        wrong_0: { ru: 'Подставим четыре: четыре минус два — два, а не четыре. Не подходит. Верное число — шесть.', uz: "To'rtni qo'yamiz: to'rt ayirish ikki — ikki, to'rt emas. Mos emas. To'g'ri son — olti." },
        wrong_2: { ru: 'Подставим два: два минус два — ноль. Не подходит. Верное число — шесть.', uz: "Ikkini qo'yamiz: ikki ayirish ikki — nol. Mos emas. To'g'ri son — olti." },
        correct_text: { ru: 'Верно. Шесть минус два — четыре.', uz: "To'g'ri. Olti ayirish ikki — to'rt." } }
    ],
    audio: {
      intro: { ru: 'Подставь каждое число вместо x и проверь, где равенство верное.', uz: "Har sonni x o'rniga qo'ying va tenglik qayerda to'g'ri ekanini tekshiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — MASHQ BalanceStage 3 round (+/−): x+2=9→7, x−5=2→7, x+4=6→2. aralash.
  s10: {
    eyebrow: { ru: 'Тренировка · 6', uz: 'Mashq · 6' },
    label: { ru: 'Сложение и вычитание', uz: "Qo'shish va ayirish" },
    rounds: [
      { q: { ru: 'x плюс два равно девять. Чему равно x?', uz: "x qo'shuv ikki teng to'qqiz. x nechaga teng?" },
        opt0: { ru: '11', uz: '11' }, opt1: { ru: '7', uz: '7', ok: true }, opt2: { ru: '9', uz: '9' },
        wrong_0: { ru: 'Одиннадцать — это девять плюс два. Убери известное два: девять минус два — семь.', uz: "O'n bir — bu to'qqiz qo'shuv ikki. Ma'lum ikkini oling: to'qqiz ayirish ikki — yetti." },
        wrong_2: { ru: 'Девять — это весь результат. Убери известное два: получится семь.', uz: "To'qqiz — bu butun natija. Ma'lum ikkini oling: yetti chiqadi." },
        correct_text: { ru: 'Верно. Семь плюс два — девять.', uz: "To'g'ri. Yetti qo'shuv ikki — to'qqiz." } },
      { q: { ru: 'x минус пять равно два. Чему равно x?', uz: "x ayirish besh teng ikki. x nechaga teng?" },
        opt0: { ru: '3', uz: '3' }, opt1: { ru: '7', uz: '7', ok: true }, opt2: { ru: '2', uz: '2' },
        wrong_0: { ru: 'Три — это два минус... нет. При вычитании прибавь известное: два плюс пять — семь.', uz: "Uch — bu ikki ayirish... yo'q. Ayirishda ma'lumni qo'shing: ikki qo'shuv besh — yetti." },
        wrong_2: { ru: 'Два — это весь результат. Прибавь известное пять: два плюс пять — семь.', uz: "Ikki — bu butun natija. Ma'lum beshni qo'shing: ikki qo'shuv besh — yetti." },
        correct_text: { ru: 'Верно. Семь минус пять — два.', uz: "To'g'ri. Yetti ayirish besh — ikki." } },
      { q: { ru: 'x плюс четыре равно шесть. Чему равно x?', uz: "x qo'shuv to'rt teng olti. x nechaga teng?" },
        opt0: { ru: '10', uz: '10' }, opt1: { ru: '2', uz: '2', ok: true }, opt2: { ru: '6', uz: '6' },
        wrong_0: { ru: 'Десять — это шесть плюс четыре. Убери известное четыре: шесть минус четыре — два.', uz: "O'n — bu olti qo'shuv to'rt. Ma'lum to'rtni oling: olti ayirish to'rt — ikki." },
        wrong_2: { ru: 'Шесть — это весь результат. Убери известное четыре: получится два.', uz: "Olti — bu butun natija. Ma'lum to'rtni oling: ikki chiqadi." },
        correct_text: { ru: 'Верно. Два плюс четыре — шесть.', uz: "To'g'ri. Ikki qo'shuv to'rt — olti." } }
    ],
    audio: {
      intro: { ru: 'Здесь и сложение, и вычитание. Найди спрятанное число x.', uz: "Bu yerda ham qo'shish, ham ayirish. Yashirin son x ni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — MASHQ SlotFind 3 round aralash: ▢+3=9→6, ▢−2=6→8, ▢+5=8→3.
  s11: {
    eyebrow: { ru: 'Тренировка · 7', uz: 'Mashq · 7' },
    label: { ru: 'Подбери число в окошко', uz: "Oynaga son tanlang" },
    rounds: [
      { q: { ru: 'Окошко плюс три равно девять. Какое число в окошке?', uz: "Oyna qo'shuv uch teng to'qqiz. Oynada qanday son?" },
        opt0: { ru: '9', uz: '9' }, opt1: { ru: '6', uz: '6', ok: true }, opt2: { ru: '12', uz: '12' },
        wrong_0: { ru: 'Девять — это весь результат. Убери известное три: девять минус три — шесть.', uz: "To'qqiz — bu butun natija. Ma'lum uchni oling: to'qqiz ayirish uch — olti." },
        wrong_2: { ru: 'Двенадцать — это девять плюс три. Нужно наоборот: девять минус три — шесть.', uz: "O'n ikki — bu to'qqiz qo'shuv uch. Aksincha kerak: to'qqiz ayirish uch — olti." },
        correct_text: { ru: 'Верно. Шесть плюс три — девять.', uz: "To'g'ri. Olti qo'shuv uch — to'qqiz." } },
      { q: { ru: 'Окошко минус два равно шесть. Какое число в окошке?', uz: "Oyna ayirish ikki teng olti. Oynada qanday son?" },
        opt0: { ru: '4', uz: '4' }, opt1: { ru: '8', uz: '8', ok: true }, opt2: { ru: '6', uz: '6' },
        wrong_0: { ru: 'Четыре — это шесть минус два. Но при вычитании прибавь: шесть плюс два — восемь.', uz: "To'rt — bu olti ayirish ikki. Ammo ayirishda qo'shing: olti qo'shuv ikki — sakkiz." },
        wrong_2: { ru: 'Шесть — это весь результат. Прибавь известное два: шесть плюс два — восемь.', uz: "Olti — bu butun natija. Ma'lum ikkini qo'shing: olti qo'shuv ikki — sakkiz." },
        correct_text: { ru: 'Верно. Восемь минус два — шесть.', uz: "To'g'ri. Sakkiz ayirish ikki — olti." } },
      { q: { ru: 'Окошко плюс пять равно восемь. Какое число в окошке?', uz: "Oyna qo'shuv besh teng sakkiz. Oynada qanday son?" },
        opt0: { ru: '8', uz: '8' }, opt1: { ru: '3', uz: '3', ok: true }, opt2: { ru: '13', uz: '13' },
        wrong_0: { ru: 'Восемь — это весь результат. Убери известное пять: восемь минус пять — три.', uz: "Sakkiz — bu butun natija. Ma'lum beshni oling: sakkiz ayirish besh — uch." },
        wrong_2: { ru: 'Тринадцать — это восемь плюс пять. Нужно наоборот: восемь минус пять — три.', uz: "O'n uch — bu sakkiz qo'shuv besh. Aksincha kerak: sakkiz ayirish besh — uch." },
        correct_text: { ru: 'Верно. Три плюс пять — восемь.', uz: "To'g'ri. Uch qo'shuv besh — sakkiz." } }
    ],
    audio: {
      intro: { ru: 'И сложение, и вычитание в окошках. Подбери число.', uz: "Oynalarda ham qo'shish, ham ayirish. Sonni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // sCASE — MASALA: ekipaj x+4=9 → 5. Bit stansiya. distraktor 13(M1), 4(?).
  sCASE: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    label: { ru: 'Экипаж станции', uz: "Stansiya ekipaji" },
    setup: { ru: 'На станции у Нептуна должно быть девять членов экипажа. Четверо уже на палубе. Сколько ещё в пути?', uz: "Neptun yonidagi stansiyada to'qqiz kishilik ekipaj bo'lishi kerak. To'rt kishi allaqachon dekada. Yana nechtasi yo'lda?" },
    q: { ru: 'Спрятанное число плюс четыре равно девять. Сколько ещё в пути?', uz: "Yashirin son qo'shuv to'rt teng to'qqiz. Yana nechtasi yo'lda?" },
    opt0: { ru: '13', uz: '13' }, opt1: { ru: '5', uz: '5', ok: true }, opt2: { ru: '4', uz: '4' },
    wrong_0: { ru: 'Тринадцать — это девять плюс четыре. Но всего экипажа девять. Убери четверых с палубы: девять минус четыре — пять.', uz: "O'n uch — bu to'qqiz qo'shuv to'rt. Ammo butun ekipaj to'qqiz. Dekadagi to'rttani oling: to'qqiz ayirish to'rt — besh." },
    wrong_2: { ru: 'Четыре — это те, кто уже на палубе. А в пути — остальные: девять минус четыре — пять.', uz: "To'rt — bu allaqachon dekada bo'lganlar. Yo'lda esa qolganlari: to'qqiz ayirish to'rt — besh." },
    correct_text: { ru: 'Верно. Пять плюс четыре — девять. Экипаж в сборе.', uz: "To'g'ri. Besh qo'shuv to'rt — to'qqiz. Ekipaj to'liq." },
    audio: {
      intro: { ru: 'На станции должно быть девять членов экипажа. Четверо на палубе. Сколько ещё в пути?', uz: "Stansiyada to'qqiz kishilik ekipaj bo'lishi kerak. To'rt kishi dekada. Yana nechtasi yo'lda?" },
      on_correct: { ru: 'Верно. Девять минус четыре — пять.', uz: "To'g'ri. To'qqiz ayirish to'rt — besh." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s14 — FINAL: 3 round aralash (x+5=8→3, x−3=5→8, x+2=6→4) + FactCard Neptun.
  s14: {
    eyebrow: { ru: 'Итог · проверка', uz: 'Yakun · tekshiruv' },
    label: { ru: 'Найди спрятанное число', uz: "Yashirin sonni toping" },
    rounds: [
      { q: { ru: 'x плюс пять равно восемь. Чему равно x?', uz: "x qo'shuv besh teng sakkiz. x nechaga teng?" },
        opt0: { ru: '13', uz: '13' }, opt1: { ru: '3', uz: '3', ok: true }, opt2: { ru: '8', uz: '8' },
        wrong_0: { ru: 'Тринадцать — это восемь плюс пять. Убери известное пять: восемь минус пять — три.', uz: "O'n uch — bu sakkiz qo'shuv besh. Ma'lum beshni oling: sakkiz ayirish besh — uch." },
        wrong_2: { ru: 'Восемь — это весь результат. Убери известное пять: получится три.', uz: "Sakkiz — bu butun natija. Ma'lum beshni oling: uch chiqadi." },
        correct_text: { ru: 'Верно. Три плюс пять — восемь.', uz: "To'g'ri. Uch qo'shuv besh — sakkiz." } },
      { q: { ru: 'x минус три равно пять. Чему равно x?', uz: "x ayirish uch teng besh. x nechaga teng?" },
        opt0: { ru: '2', uz: '2' }, opt1: { ru: '8', uz: '8', ok: true }, opt2: { ru: '5', uz: '5' },
        wrong_0: { ru: 'Два — это пять минус три. Но при вычитании прибавь: пять плюс три — восемь.', uz: "Ikki — bu besh ayirish uch. Ammo ayirishda qo'shing: besh qo'shuv uch — sakkiz." },
        wrong_2: { ru: 'Пять — это весь результат. Прибавь известное три: пять плюс три — восемь.', uz: "Besh — bu butun natija. Ma'lum uchni qo'shing: besh qo'shuv uch — sakkiz." },
        correct_text: { ru: 'Верно. Восемь минус три — пять.', uz: "To'g'ri. Sakkiz ayirish uch — besh." } },
      { q: { ru: 'x плюс два равно шесть. Чему равно x?', uz: "x qo'shuv ikki teng olti. x nechaga teng?" },
        opt0: { ru: '8', uz: '8' }, opt1: { ru: '4', uz: '4', ok: true }, opt2: { ru: '6', uz: '6' },
        wrong_0: { ru: 'Восемь — это шесть плюс два. Убери известное два: шесть минус два — четыре.', uz: "Sakkiz — bu olti qo'shuv ikki. Ma'lum ikkini oling: olti ayirish ikki — to'rt." },
        wrong_2: { ru: 'Шесть — это весь результат. Убери известное два: получится четыре.', uz: "Olti — bu butun natija. Ma'lum ikkini oling: to'rt chiqadi." },
        correct_text: { ru: 'Верно. Четыре плюс два — шесть.', uz: "To'g'ri. To'rt qo'shuv ikki — olti." } }
    ],
    fact_badge: { ru: 'Нептун', uz: 'Neptun' },
    fact: { ru: 'На Нептуне самые сильные ветры в Солнечной системе — быстрее любого урагана на Земле.', uz: "Neptunda Quyosh tizimidagi eng kuchli shamollar esadi — Yerdagi har qanday bo'rondan tezroq." },
    audio: {
      intro: { ru: 'Последняя проверка. Найди спрятанное число x.', uz: "Oxirgi tekshiruv. Yashirin son x ni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — XULOSA: qoida recap → keyingi d.37 (ulush/доли).
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    lead: { ru: 'Ты научился решать уравнения', uz: "Tenglama yechishni o'rgandingiz" },
    rule_recap: { ru: 'Уравнение — две равные части. Убери известное — найдёшь спрятанное. Потом подставь и проверь.', uz: "Tenglama — ikkita teng tomon. Ma'lumni ol — yashirin sonni topasan. Keyin qo'yib tekshir." },
    conn_refs: { ru: 'Мы использовали сложение и вычитание, которые уже знаем.', uz: "Biz allaqachon bilgan qo'shish va ayirishdan foydalandik." },
    conn_next: { ru: 'Дальше — доли: как делить целое на равные части.', uz: "Keyingisi — ulushlar: butunni teng qismlarga qanday bo'lish." },
    audio: {
      ru: [
        'Ты научился находить спрятанное число в уравнении.',
        'Уравнение — это две равные части. Убери известное — и найдёшь спрятанное. Потом подставь и проверь.',
        'Дальше мы узнаем про доли: как делить целое на равные части.'
      ],
      uz: [
        "Tenglamadagi yashirin sonni topishni o'rgandingiz.",
        "Tenglama — bu ikkita teng tomon. Ma'lumni oling — yashirin sonni topasiz. Keyin qo'yib tekshiring.",
        "Keyingi safar ulushlar haqida bilib olamiz: butunni teng qismlarga qanday bo'lish."
      ]
    }
  }
};
```

## Ekran-mexanika xaritasi (jsx-builder uchun)

| ekran | Stage | round/single |
|---|---|---|
| s0 | hook (custom) | x+4=9, distr 13 |
| s1 | BalanceScale teach | reveal 0/1/2 |
| s2 | SlotFind teach | reveal 0/1/2 |
| s3 | rule + check | x+2=6 |
| s4 | CheckViz + warn + check | x+3=7 |
| sTBL | jadval | 3 qator |
| s5 | BalanceStage | single |
| s6 | SlotFindStage | 3 (+) |
| s7 | BalanceStage | 3 (+) |
| s8 | SlotFindStage | 3 (−) |
| s9 | SubstStage | 3 (qo'yib-tekshir) |
| s10 | BalanceStage | 3 (+/−) |
| s11 | SlotFindStage | 3 (aralash) |
| sCASE | BalanceStage masala | single |
| s14 | aralash + FactCard | 3 |
| s15 | summary | — |
