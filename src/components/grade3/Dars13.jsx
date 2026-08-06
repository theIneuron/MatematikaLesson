import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars13 — "Amallar tartibi" (num-3-13) | Б2 | qavs va amallar navbati
// Syujet: «Yorug' bog'» davomi (11-12-dars) — bog' kirishidagi BUYURTMA TAXTASI.
//   Taxtada bitta yozuv: 3 + 6 × 2. Anvar 15 lampa keltirdi, Zuhra 18: buyurtma bitta,
//   javob ikkita. To'siq shu, uni AMALLAR TARTIBI qoidasi yechadi.
// FactCard: kungaboqar urug'lari oltin burchak bo'ylab spiral (21, 34, 55 — qo'shiluvchi
//   sonlar). Metodist 2026-08-05: FactCard MATEMATIKA va FAN mavzusida bo'ladi.
// Infra: grade3 Dars12.jsx dan BAYT-ANIQ ko'chirildi (Stage, audio, NumPad, MCRoundD2,
//   yashil javob, FactCard freym ostida, orbital anim, TAP bilan ochilish). O'zgarmadi.
// YADRO: 3 + 6 × 2 = 15, chapdan o'ngga esa 18 — va 18 aynan (3 + 6) × 2 ning javobi.
//   Ya'ni xato javob bema'nilik emas, u BOSHQA yozuvning javobi; buni QAVS hal qiladi.
// MEXANIKA: xuk (s0), ikki karta ko'prik (s1), SVYORTKA — ifoda qisqaradi (s2),
//   QOIDA uch satr (s3), Bit tuzog'i chapdan o'ngga (s4), QAVS ikki panel + savol (s5),
//   5s soat (s6), «qaysi amal birinchi» MC×3 (s7), test MC×3 (s8), BONUS USTUN:
//   × keyin + va − (s9), NumPad trenajyor (s10), masala: yozuv + javob (s11),
//   xatoni top (s12), final 5 savol + FactCard (s13), yakun (s14).
// Misconception: M1 chapdan o'ngga hisoblash, M2 qavsni e'tiborsiz qoldirish,
//   M3 bitta amalda to'xtash, M4 «tartib ahamiyatsiz».
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 13» (tasdiq 2026-08-05).
//
// FREE_NAV=true (blokirovka o'chiq — 3-sinf to'liq tayyor bo'lgach false, metodist qarori).
// ============================================================================

// ============================================================






   // TEST/EDIT — blokirovka o'chiq (erkin navigatsiya). PUSH oldidan false ga qaytaring!














// AI-проверка открытых ответов — единственный разрешённый fetch (кроме <audio>.src).
// Возвращает { correct, feedback, transcript? } или бросает.
async function gradeAnswer({ screenIdx, question, rubric, lang, mode, answerText, audioBlob }) {
  const endpoint = ttsConfig.aiGradingEndpoint;
  if (!endpoint) throw new Error('No grading endpoint configured');
  const lessonId = (typeof LESSON_META !== 'undefined' && LESSON_META.lessonId) || '';
  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId); fd.append('screenIdx', String(screenIdx));
    fd.append('question', question || ''); fd.append('rubric', rubric || '');
    fd.append('lang', lang); fd.append('mode', 'voice');
    if (audioBlob) fd.append('audio', audioBlob, 'answer.webm');
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, screenIdx, question: question || '', rubric: rubric || '', lang, mode: 'text', answerText: answerText || '' }),
    });
  }
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') throw new Error('Malformed grading response');
  return data;
}

























































// ============================================================
// --- 2-SINF DARS: num_2_01 — O'nliklar va birliklar (Б1, 100 gacha) ---
// 7-8 yosh: ovoz yetakchi kanal, typing YO'Q (tap), concrete-avval (batareya/kasseta ->
// pult-bloklar -> displey kartasi), bar model YO'Q. Manba: 2sinf_metodologiya.md +
// ETALON_2SINF.md + Dars01_CONTENT.md v2 (Yulduz porti). Barcha sonlar 100 ichida (Б1).
// ============================================================

// v5 IXCHAMLASH (18 -> 15): test tomoni ixchamlashdi (tushuntirish s2-s6 + qoida s7 TEGILMADI).
//   sPANEL «Bort testi» = eski s11 + sCMP + sERR (3 ketma-ket sub).
//   sCASE «Yuk xati» = eski s12 (kirish) + s13 (savol) BITTA ekranда.
// v6 FAKT ALOHIDA (bekor): sPANEL sub-1 dagi FactCard SKROLL chiqargani uchun undan olindi.
// v7 FAKT FINAL SLAYDGA (16 -> 15): alohida fakt-slaydi BEKOR; fakt endi FINAL test s14 ga
//   factOnCorrect bilan (bitta savolli slaydда joy bor, skrollsiz — etalon naqsh). sPANEL faktsiz qoladi.



const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-13',
  lessonTitle: { ru: 'Урок 13. Порядок действий', uz: '13-dars. Amallar tartibi' }
};
// STRUKTURA (metodist tasdig'i 2026-08-05, KONTENT_3SINF.md «Dars 13»): bitta yozuv
// 3 + 6 × 2 ustida qurilgan. s0 xuk (ikki savat, 15 va 18) · s1 ko'prik · s2 SVYORTKA
// (ifoda qisqaradi) · s3 QOIDA · s4 Bit tuzog'i (chapdan o'ngga) · s5 QAVS hammasini
// o'zgartiradi · s6 soat · s7 «qaysi amal birinchi?» ×3 · s8 test ×3 · s9 BONUS ustun
// (× keyin + va −) · s10 NumPad ×3 · s11 masala (yozuv + javob) · s12 xatoni top ·
// s13 final 5 savol + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars13 «Amallar tartibi» (num-3-13). RU + UZ to'liq.
// Manba: src/books/grade3/KONTENT_3SINF.md, «Dars 13» bo'limi (tasdiq 2026-08-05).
// Syujet: «Yorug' bog'» davomi — bog' kirishidagi BUYURTMA TAXTASI: 3 + 6 × 2.
// YADRO: qoida bo'yicha 15, chapdan o'ngga esa 18; 18 — QAVSLI yozuvning javobi.
// M1: chapdan o'ngga hisoblash. M2: qavsni e'tiborsiz qoldirish. M3: bitta amalda
// to'xtash. M4: «tartib ahamiyatsiz».
// BONUS s9: USTUN — ifoda ichida ko'paytirish, keyin qo'shish va ayirish ustunda.
// ============================================================
const CONTENT = {
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: порядок действий', uz: 'Mavzu: amallar tartibi' },
    lead: { ru: 'Доска заказа и две разные корзины.', uz: 'Buyurtma taxtasi va ikki xil savat.' },
    board: { ru: '3 + 6 × 2', uz: '3 + 6 × 2' },
    board_cap: { ru: 'заказ на доске', uz: 'taxtadagi buyurtma' },
    basket_a: { ru: 'Анвар', uz: 'Anvar' },
    basket_b: { ru: 'Зухра', uz: 'Zuhra' },
    q: { ru: 'Заказ один, а корзины разные. Почему?', uz: 'Buyurtma bitta, savatlar esa boshqacha. Nega?' },
    opt0: { ru: 'Считали в разном порядке', uz: 'Har xil tartibda hisoblagan' },
    opt1: { ru: 'Кто-то ошибся в таблице', uz: 'Kimdir jadvalda xato qilgan' },
    opt2: { ru: 'На доске два заказа', uz: 'Taxtada ikki buyurtma bor' },
    opt3: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется порядок действий. Узнаем, какое действие в примере считают первым.',
          'У входа в светящийся сад висит доска заказа. На ней написано, сколько ламп собрать.',
          'Анвар и Зухра прочитали одну и ту же доску и пошли собирать. Анвар принёс пятнадцать ламп, Зухра восемнадцать.',
          'Бит не может отправить заказ, ведь сад один, а ответов два. Как думаешь, почему корзины разные?'
        ],
        uz: [
          'Dars mavzusi amallar tartibi deb ataladi. Misolda qaysi amal birinchi hisoblanishini bilib olamiz.',
          "Yorug' bog' kirishida buyurtma taxtasi turadi. Unda nechta lampa yig'ish yozilgan.",
          "Anvar va Zuhra bitta taxtani o'qib, yig'ishga ketdi. Anvar o'n beshta lampa keltirdi, Zuhra o'n sakkizta.",
          "Bit buyurtmani yubora olmaydi, chunki bog' bitta, javob esa ikkita. Sizningcha, savatlar nega boshqacha?"
        ]
      },
      on_correct: { ru: 'Верно! Числа одни, а порядок разный. Сейчас разберёмся, чей порядок правильный.', uz: "To'g'ri! Sonlar bir xil, tartib esa boshqacha. Hozir kimning tartibi to'g'riligini aniqlaymiz." },
      on_wrong1: { ru: 'Оба считали верно. Ошибки в таблице нет, дело в другом.', uz: "Ikkisi ham to'g'ri hisobladi. Jadvalda xato yo'q, gap boshqada." },
      on_wrong2: { ru: 'Доска одна, запись одна. А корзины всё равно разные.', uz: "Taxta bitta, yozuv bitta. Savatlar esa baribir boshqacha." },
      on_idk: { ru: 'Сейчас увидишь, в чём дело. Ответ прячется в одном слове, и это порядок.', uz: "Hozir gap nimada ekanini ko'rasiz. Javob bitta so'zda yashiringan, u tartib." }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'Оба действия тебе знакомы.', uz: 'Ikkala amal ham sizga tanish.' },
    card1: { ru: '6 × 2 = 12', uz: '6 × 2 = 12' },
    card1_cap: { ru: 'таблица умножения, урок 9', uz: "ko'paytirish jadvali, 9-dars" },
    card2: { ru: '3 + 12 = 15', uz: '3 + 12 = 15' },
    card2_cap: { ru: 'сложение, второй класс', uz: "qo'shish, ikkinchi sinf" },
    tap_label: { ru: 'Открой карточки по одной', uz: 'Kartalarni bittalab oching' },
    audio: {
      ru: [
        'Смотри, оба действия ты уже умеешь. Открой первую карточку.',
        'Шесть умножить на два, двенадцать. Это из таблицы.',
        'Три плюс двенадцать, пятнадцать. Тоже легко.',
        'Действия знакомые. Новое только одно, с какого из них начинать.'
      ],
      uz: [
        'Qarang, ikkala amalni ham bilasiz. Birinchi kartani oching.',
        "Olti karra ikki, o'n ikki. Bu jadvaldan.",
        "Uch qo'shuv o'n ikki, o'n besh. Bu ham oson.",
        "Amallar tanish. Yangisi faqat bitta, qaysi biridan boshlash kerak."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Считаем заказ с доски.', uz: 'Taxtadagi buyurtmani hisoblaymiz.' },
    btn1: { ru: 'Найти умножение', uz: "Ko'paytirishni topish" },
    btn2: { ru: 'Свернуть', uz: 'Yig\'ish' },
    btn3: { ru: 'Сложить', uz: 'Qo\'shish' },
    done_text: { ru: 'Три плюс шесть умножить на два, пятнадцать. Прав оказался Анвар.', uz: "Uch qo'shuv olti karra ikki, o'n besh. Anvar haq bo'lib chiqdi." },
    audio: {
      ru: [
        'Вот запись с доски. Три плюс шесть умножить на два.',
        'Сначала ищем умножение и деление. Здесь есть умножение, шесть умножить на два.',
        'Считаем его и ставим на место результат. Двенадцать. Запись стала короче, три плюс двенадцать.',
        'Теперь сложение. Три плюс двенадцать, пятнадцать. Пример закончился.',
        'Видишь главное? Каждое действие съедает два числа и оставляет одно. Пример укорачивается, пока не останется ответ.'
      ],
      uz: [
        "Mana taxtadagi yozuv. Uch qo'shuv olti karra ikki.",
        "Avval ko'paytirish va bo'lishni qidiramiz. Bu yerda ko'paytirish bor, olti karra ikki.",
        "Uni hisoblab, o'rniga natijani qo'yamiz. O'n ikki. Yozuv qisqardi, uch qo'shuv o'n ikki.",
        "Endi qo'shish. Uch qo'shuv o'n ikki, o'n besh. Misol tugadi.",
        "Asosiy narsani sezdingizmi? Har amal ikki sonni yeb, bittasini qoldiradi. Misol javob qolgancha qisqaradi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Какое действие в примере считают первым?', uz: 'Misolda qaysi amal birinchi hisoblanadi?' },
    opts: [
      { ru: 'Умножение и деление, слева направо', uz: "Ko'paytirish va bo'lish, chapdan o'ngga" },
      { ru: 'То, что написано левее всех', uz: 'Eng chapda yozilgani' },
      { ru: 'Сложение и вычитание', uz: "Qo'shish va ayirish" },
      { ru: 'Любое, ответ не изменится', uz: "Xohlagani, javob o'zgarmaydi" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так прочитала Зухра и получила восемнадцать. Мы читаем слева направо, но считаем не так.', uz: "Zuhra shunday o'qib, o'n sakkiz chiqardi. Biz chapdan o'ngga o'qiymiz, hisoblash esa boshqacha." },
      2: { ru: 'Наоборот. Сложение и вычитание ждут своей очереди, они последние.', uz: "Teskarisi. Qo'shish va ayirish navbatini kutadi, ular oxirgi." },
      3: { ru: 'Две корзины у входа как раз показывают, ответ меняется. Пятнадцать и восемнадцать.', uz: "Kirishdagi ikki savat aynan shuni ko'rsatadi, javob o'zgaradi. O'n besh va o'n sakkiz." }
    },
    rule_lines: {
      ru: ['1) сначала действия в скобках', '2) потом умножение и деление, слева направо', '3) в конце сложение и вычитание, слева направо'],
      uz: ['1) avval qavs ichidagi amallar', "2) keyin ko'paytirish va bo'lish, chapdan o'ngga", "3) oxirida qo'shish va ayirish, chapdan o'ngga"]
    },
    rule: { ru: 'Порядок действий: 1) сначала действия в скобках; 2) потом умножение и деление, слева направо; 3) в конце сложение и вычитание, слева направо. 3 + 6 × 2 = 3 + 12 = 15.', uz: "Amallar tartibi: 1) avval qavs ichidagi amallar; 2) keyin ko'paytirish va bo'lish, chapdan o'ngga; 3) oxirida qo'shish va ayirish, chapdan o'ngga." },
    rule_speech: { ru: 'Порядок действий такой. Сначала то, что в скобках. Потом умножение и деление, слева направо. В конце сложение и вычитание, тоже слева направо.', uz: "Amallar tartibi shunday. Avval qavs ichidagisi. Keyin ko'paytirish va bo'lish, chapdan o'ngga. Oxirida qo'shish va ayirish, u ham chapdan o'ngga." },
    audio: {
      intro: { ru: 'Мы посчитали одну запись. Теперь главный вопрос урока.', uz: 'Bitta yozuvni hisobladik. Endi darsning asosiy savoli.' }
    },
    on_correct: { ru: 'Именно так! Умножение и деление сильнее, они идут вперёд.', uz: "Aynan shunday! Ko'paytirish va bo'lish kuchliroq, ular oldinda boradi." }
  },

  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Бит читает как книгу. Проверим?', uz: 'Bit kitob kabi o\'qiydi. Tekshiramizmi?' },
    lines: ['3 + 6 × 2', '3 + 6 = 9', '9 × 2 = 18'],
    trap_label: { ru: 'Бит получил 18. Верно?', uz: 'Bit 18 chiqardi. To\'g\'rimi?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    audio: {
      ru: [
        'Бит читает как книгу, слева направо. Три плюс шесть, девять. Девять умножить на два, восемнадцать!',
        'Верно ли посчитал Бит?'
      ],
      uz: [
        "Bit kitob o'qigandek, chapdan o'ngga o'qiydi. Uch qo'shuv olti, to'qqiz. To'qqiz karra ikki, o'n sakkiz!",
        "Bit to'g'ri hisobladimi?"
      ]
    },
    trap_correct: { ru: 'Точно! Но смотри, как интересно, восемнадцать не выдумка. Это ответ на другую запись, где сложение стоит в скобках. Сейчас увидишь.', uz: "Aniq! Lekin qarang, qanchalik qiziq, o'n sakkiz o'ydirma emas. Bu boshqa yozuvning javobi, unda qo'shish qavs ichida turadi. Hozir ko'rasiz." },
    trap_wrong: { ru: 'Умножение считают раньше сложения. Сначала шесть умножить на два, потом прибавить три.', uz: "Ko'paytirish qo'shishdan avval hisoblanadi. Avval olti karra ikki, keyin uch qo'shiladi." }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Числа одинаковые, разница только в скобках.', uz: 'Sonlar bir xil, farq faqat qavsda.' },
    left_title: { ru: 'без скобок', uz: 'qavssiz' },
    right_title: { ru: 'со скобками', uz: 'qavs bilan' },
    left_lines: ['3 + 6 × 2', '3 + 12', '15'],
    right_lines: ['(3 + 6) × 2', '9 × 2', '18'],
    left_cap: { ru: 'корзина Анвара', uz: 'Anvarning savati' },
    right_cap: { ru: 'корзина Зухры', uz: 'Zuhraning savati' },
    btn1: { ru: 'Посчитать без скобок', uz: 'Qavssiz hisoblash' },
    btn2: { ru: 'Посчитать со скобками', uz: 'Qavs bilan hisoblash' },
    mc_q: { ru: 'Для чего нужны скобки?', uz: 'Qavs nima uchun kerak?' },
    mc_opts: [
      { ru: 'Отметить действие, которое делаем первым', uz: 'Birinchi bajaradigan amalni belgilash uchun' },
      { ru: 'Скобки ничего не меняют', uz: 'Qavs hech narsani o\'zgartirmaydi' },
      { ru: 'Отделить большие числа', uz: 'Katta sonlarni ajratish uchun' },
      { ru: 'Заменить умножение сложением', uz: 'Ko\'paytirishni qo\'shishga almashtirish uchun' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Здесь скобки поменяли ответ с пятнадцати на восемнадцать. Числа те же, а ответ другой.', uz: "Bu yerda qavs javobni o'n beshdan o'n sakkizga o'zgartirdi. Sonlar o'sha, javob boshqa." },
      2: { ru: 'Размер чисел тут ни при чём. Скобки говорят про очередь.', uz: "Sonning kattaligi bunga aloqasi yo'q. Qavs navbat haqida gapiradi." },
      3: { ru: 'Умножение осталось умножением. Изменилась только его очередь.', uz: "Ko'paytirish ko'paytirishligida qoldi. Faqat uning navbati o'zgardi." }
    },
    mc_ok: { ru: 'Вот и разгадка! Зухра считала верно, но для записи со скобками. А на доске скобок не было. Скобки командуют, меня считай первым.', uz: "Mana javob! Zuhra to'g'ri hisobladi, lekin qavsli yozuv uchun. Taxtada esa qavs yo'q edi. Qavs buyuradi, avval meni hisobla." },
    audio: {
      ru: [
        'Две записи, числа одинаковые, три, шесть и два. Разница только в скобках.',
        'Без скобок первым идёт умножение. Три плюс двенадцать, пятнадцать. Корзина Анвара.',
        'Со скобками первым идёт сложение. Девять умножить на два, восемнадцать. Корзина Зухры.',
        'Теперь вопрос.'
      ],
      uz: [
        "Ikki yozuv, sonlar bir xil, uch, olti va ikki. Farq faqat qavsda.",
        "Qavssiz avval ko'paytirish boradi. Uch qo'shuv o'n ikki, o'n besh. Anvarning savati.",
        "Qavs bilan avval qo'shish boradi. To'qqiz karra ikki, o'n sakkiz. Zuhraning savati.",
        'Endi savol.'
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Сколько будет 20 − 3 × 5?', uz: '20 − 3 × 5 nechta bo\'ladi?' },
    items: [
      {
        ci: 0,
        opts: [{ ru: '5', uz: '5' }, { ru: '85', uz: '85' }, { ru: '15', uz: '15' }, { ru: '25', uz: '25' }],
        hints: {
          1: { ru: 'Так считают слева направо. Сначала умножение, три умножить на пять.', uz: "Bu chapdan o'ngga hisoblash. Avval ko'paytirish, uch karra besh." },
          2: { ru: 'Это только первое действие, три умножить на пять. Осталось вычесть.', uz: "Bu faqat birinchi amal, uch karra besh. Ayirish qoldi." },
          3: { ru: 'Здесь вычитание, а не сложение. Двадцать минус пятнадцать.', uz: "Bu yerda ayirish, qo'shish emas. Yigirma ayiruv o'n besh." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Проверь себя. Двадцать минус три умножить на пять. Пять секунд подумай.', uz: "O'zingizni sinang. Yigirma ayiruv uch karra besh. Besh soniya o'ylang." },
      on_correct: { ru: 'Пять! Сначала умножение, потом вычитание.', uz: "Besh! Avval ko'paytirish, keyin ayirish." },
      on_wrong: { ru: 'Найди сначала умножение или деление.', uz: "Avval ko'paytirish yoki bo'lishni toping." }
    }
  },

  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какое действие делаем первым?', uz: 'Qaysi amalni birinchi bajaramiz?' },
    items: [
      {
        expr: '20 − 3 × 5', ci: 0,
        opts: [{ ru: '3 × 5', uz: '3 × 5' }, { ru: '20 − 3', uz: '20 − 3' }, { ru: '20 × 5', uz: '20 × 5' }, { ru: 'Порядок не важен', uz: 'Tartib muhim emas' }],
        hints: {
          1: { ru: 'Это чтение слева направо. Умножение сильнее, оно идёт первым.', uz: "Bu chapdan o'ngga o'qish. Ko'paytirish kuchliroq, u birinchi boradi." },
          2: { ru: 'Двадцать и пять не стоят рядом. Умножается три на пять.', uz: "Yigirma va besh yonma-yon turmagan. Uch beshga ko'paytiriladi." },
          3: { ru: 'Важен. Слева направо получится восемьдесят пять, а верно пять.', uz: "Muhim. Chapdan o'ngga sakson besh chiqadi, to'g'risi esa besh." }
        }
      },
      {
        expr: '(8 + 4) : 2', ci: 0,
        opts: [{ ru: '8 + 4', uz: '8 + 4' }, { ru: '4 : 2', uz: '4 : 2' }, { ru: '8 : 2', uz: '8 : 2' }, { ru: 'Порядок не важен', uz: 'Tartib muhim emas' }],
        hints: {
          1: { ru: 'Деление обычно первое, но скобки сильнее. Сначала то, что внутри них.', uz: "Bo'lish odatda birinchi, lekin qavs kuchliroq. Avval uning ichidagisi." },
          2: { ru: 'Восьмёрка стоит в скобках вместе с четвёркой. Их и складываем.', uz: "Sakkiz qavs ichida to'rt bilan turadi. Ularni qo'shamiz." },
          3: { ru: 'Со скобками получится шесть, без них восемь плюс два, десять.', uz: "Qavs bilan olti chiqadi, qavssiz esa sakkiz qo'shuv ikki, o'n." }
        }
      },
      {
        expr: '12 : 2 + 3 × 4', ci: 0,
        opts: [{ ru: '12 : 2', uz: '12 : 2' }, { ru: '3 × 4', uz: '3 × 4' }, { ru: '2 + 3', uz: '2 + 3' }, { ru: 'Порядок не важен', uz: 'Tartib muhim emas' }],
        hints: {
          1: { ru: 'Это тоже умножение, но оно правее. Идём слева направо, значит первым деление.', uz: "Bu ham ko'paytirish, lekin o'ngroqda. Chapdan o'ngga boramiz, demak birinchi bo'lish." },
          2: { ru: 'Двойка и тройка не пара, одна при делении, другая при умножении.', uz: "Ikki va uch juft emas, biri bo'lishda, biri ko'paytirishda." },
          3: { ru: 'Тут два сильных действия и одно слабое. Сильные первые, слева направо.', uz: "Bu yerda ikki kuchli amal va bitta kuchsiz bor. Kuchlilar birinchi, chapdan o'ngga." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Главный навык. Не считай, а покажи, какое действие первое. Три задания.', uz: "Asosiy ko'nikma. Hisoblamang, qaysi amal birinchi ekanini ko'rsating. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Поищи умножение, деление или скобки. Попробуй ещё.', uz: "Ko'paytirish, bo'lish yoki qavsni qidiring. Yana urinib ko'ring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      {
        q: { ru: 'Сколько будет 3 + 6 × 2?', uz: '3 + 6 × 2 nechta bo\'ladi?' }, expr: '3 + 6 × 2', ci: 0,
        opts: [{ ru: '15', uz: '15' }, { ru: '18', uz: '18' }, { ru: '12', uz: '12' }, { ru: '30', uz: '30' }],
        hints: {
          1: { ru: 'Так посчитала Зухра. Это ответ для записи со скобками.', uz: "Zuhra shunday hisobladi. Bu qavsli yozuvning javobi." },
          2: { ru: 'Это только умножение. Осталось прибавить три.', uz: "Bu faqat ko'paytirish. Uchni qo'shish qoldi." },
          3: { ru: 'Так было бы, если сложить в скобках три и два. Но скобок нет.', uz: "Qavs ichida uch va ikki qo'shilsa shunday bo'lardi. Lekin qavs yo'q." }
        }
      },
      {
        q: { ru: 'Сколько будет (20 − 8) : 4?', uz: '(20 − 8) : 4 nechta bo\'ladi?' }, expr: '(20 − 8) : 4', ci: 0,
        opts: [{ ru: '3', uz: '3' }, { ru: '18', uz: '18' }, { ru: '12', uz: '12' }, { ru: '5', uz: '5' }],
        hints: {
          1: { ru: 'Скобки сильнее деления. Сначала двадцать минус восемь.', uz: "Qavs bo'lishdan kuchliroq. Avval yigirma ayiruv sakkiz." },
          2: { ru: 'Это только скобки. Осталось разделить на четыре.', uz: "Bu faqat qavs. To'rtga bo'lish qoldi." },
          3: { ru: 'Это двадцать разделить на четыре. А восьмёрку надо сначала вычесть.', uz: "Bu yigirmani to'rtga bo'lish. Sakkizni esa avval ayirish kerak." }
        }
      },
      {
        q: { ru: 'Сколько будет 40 : 5 + 2 × 3?', uz: '40 : 5 + 2 × 3 nechta bo\'ladi?' }, expr: '40 : 5 + 2 × 3', ci: 0,
        opts: [{ ru: '14', uz: '14' }, { ru: '30', uz: '30' }, { ru: '8', uz: '8' }, { ru: '6', uz: '6' }],
        hints: {
          1: { ru: 'Это счёт слева направо, подряд. Сильные действия считают первыми.', uz: "Bu chapdan o'ngga ketma-ket hisoblash. Kuchli amallar birinchi hisoblanadi." },
          2: { ru: 'Это только деление. Осталось умножение и сложение.', uz: "Bu faqat bo'lish. Ko'paytirish va qo'shish qoldi." },
          3: { ru: 'Это только умножение. Сорок на пять тоже надо посчитать.', uz: "Bu faqat ko'paytirish. Qirqni beshga ham hisoblash kerak." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Теперь считаем до конца. Сначала скобки, потом умножение и деление, в конце сложение. Три задания.', uz: "Endi oxirigacha hisoblaymiz. Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь очередь действий. Попробуй ещё.', uz: 'Amallar navbatini tekshiring. Yana urinib ko\'ring.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'Большие числа: порядок тот же, а считаем столбиком.', uz: "Katta sonlar: tartib o'sha, hisoblash esa ustunda." },
    a_title: { ru: '128 + 24 × 3', uz: '128 + 24 × 3' },
    b_title: { ru: '250 − 8 × 20', uz: '250 − 8 × 20' },
    a_total: { ru: '128 + 24 × 3 = 200', uz: '128 + 24 × 3 = 200' },
    b_line: { ru: '8 × 20 = 160', uz: '8 × 20 = 160' },
    b_total: { ru: '250 − 8 × 20 = 90', uz: '250 − 8 × 20 = 90' },
    btn1: { ru: 'Умножить в столбик', uz: 'Ustunda ko\'paytirish' },
    btn2: { ru: 'Сложить в столбик', uz: 'Ustunda qo\'shish' },
    btn3: { ru: 'Второй заказ', uz: 'Ikkinchi buyurtma' },
    btn4: { ru: 'Вычесть в столбик', uz: 'Ustunda ayirish' },
    mc_q: { ru: 'Почему нельзя было сразу сложить 128 и 24 в столбик?', uz: 'Nega 128 va 24 ni darrov ustunda qo\'shib bo\'lmaydi?' },
    mc_opts: [
      { ru: 'Умножение считают раньше сложения', uz: "Ko'paytirish qo'shishdan avval hisoblanadi" },
      { ru: '128 больше, чем 24', uz: '128 son 24 dan katta' },
      { ru: 'Столбик всегда пишут первым', uz: 'Ustun har doim birinchi yoziladi' },
      { ru: 'Можно было, ответ тот же', uz: 'Mumkin edi, javob o\'sha' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Размер чисел не решает очередь. Решает знак действия.', uz: "Sonning kattaligi navbatni hal qilmaydi. Amal belgisi hal qiladi." },
      2: { ru: 'Столбик это способ записи, а не очередь. Очередь задают знаки.', uz: "Ustun — yozish usuli, navbat emas. Navbatni belgilar beradi." },
      3: { ru: 'Проверь. Сто двадцать восемь плюс двадцать четыре, это сто пятьдесят два. Умножить на три, четыреста пятьдесят шесть. Совсем другой ответ.', uz: "Tekshiring. Bir yuz yigirma sakkiz qo'shuv yigirma to'rt, bu bir yuz ellik ikki. Uchga ko'paytirsak, to'rt yuz ellik olti. Butunlay boshqa javob." }
    },
    mc_ok: { ru: 'Верно! Порядок решает, что считать, а столбик показывает, как считать.', uz: "To'g'ri! Tartib nimani hisoblashni hal qiladi, ustun esa qanday hisoblashni ko'rsatadi." },
    audio: {
      ru: [
        'Бонус. В саду попались заказы с большими числами. Порядок тот же, а считать будем столбиком.',
        'Сначала умножение. Двадцать четыре умножить на три, столбиком. Три на четыре, двенадцать, двойка вниз, единица в запас. Три на два, шесть, и один в запасе, семь. Семьдесят два.',
        'Теперь сложение. Сто двадцать восемь плюс семьдесят два, столбиком. Восемь и два, десять, ноль вниз, единица в запас. Два и семь и один, десять, снова ноль вниз и единица в запас. Один и один, два. Двести!',
        'Второй заказ. Восемь умножить на двадцать, сто шестьдесят. Это из урока про десятки.',
        'И вычитаем столбиком. Двести пятьдесят минус сто шестьдесят. Ноль без нуля, ноль. Из пяти шесть не вычесть, занимаем десяток, пятнадцать минус шесть, девять. Два минус один и минус занятый, ноль. Девяносто!',
        'Видишь, как сошлись три урока? Порядок решает, что считать, а столбик показывает, как считать. Теперь вопрос.'
      ],
      uz: [
        "Bonus. Bog'da katta sonli buyurtmalar chiqdi. Tartib o'sha, hisoblashni esa ustunda qilamiz.",
        "Avval ko'paytirish. Yigirma to'rtni uchga ko'paytiramiz, ustunda. Uch karra to'rt, o'n ikki, ikki pastga, bir zaxiraga. Uch karra ikki, olti, zaxirada bir, yetti. Yetmish ikki.",
        "Endi qo'shish. Bir yuz yigirma sakkiz qo'shuv yetmish ikki, ustunda. Sakkiz va ikki, o'n, nol pastga, bir zaxiraga. Ikki va yetti va bir, o'n, yana nol pastga, bir zaxiraga. Bir va bir, ikki. Ikki yuz!",
        "Ikkinchi buyurtma. Sakkiz karra yigirma, bir yuz oltmish. Bu o'nliklar haqidagi darsdan.",
        "Va ustunda ayiramiz. Ikki yuz ellikdan bir yuz oltmishni. Noldan nol, nol. Beshdan oltini ayirib bo'lmaydi, o'nlik olamiz, o'n beshdan olti, to'qqiz. Ikkidan bir va olingan birni, nol. To'qson!",
        "Uch dars qanday birlashganini ko'rdingizmi? Tartib nimani hisoblashni hal qiladi, ustun esa qanday hisoblashni ko'rsatadi. Endi savol."
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    items: [
      { q: { ru: 'Набери ответ: 5 + 4 × 3.', uz: 'Javobni ter: 5 + 4 × 3.' }, ans: 17, hint: { ru: 'Сначала четыре умножить на три.', uz: "Avval to'rt karra uch." } },
      { q: { ru: 'Набери ответ: (10 + 8) : 2.', uz: 'Javobni ter: (10 + 8) : 2.' }, ans: 9, hint: { ru: 'Сначала скобки, десять плюс восемь.', uz: "Avval qavs, o'n qo'shuv sakkiz." } },
      { q: { ru: 'Набери ответ: 18 : 3 + 5 × 2.', uz: 'Javobni ter: 18 : 3 + 5 × 2.' }, ans: 16, hint: { ru: 'Два сильных действия, потом сложи.', uz: 'Ikki kuchli amal, keyin qo\'shing.' } }
    ],
    audio: {
      intro: { ru: 'Теперь без вариантов. Определи очередь, посчитай и набери ответ.', uz: "Endi variantlarsiz. Navbatni aniqlang, hisoblang va javobni tering." },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" }
    }
  },

  s11: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Заказ на сегодня.', uz: 'Bugungi buyurtma.' },
    q: { ru: 'На трёх полках по 8 ламп, и ещё 6 ламп лежат на земле. Сколько ламп всего?', uz: 'Uch tokchada sakkiztadan lampa, yana 6 lampa yerda yotibdi. Jami nechta lampa?' },
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '8 × 3 + 6', uz: '8 × 3 + 6' },
      { ru: '8 + 3 × 6', uz: '8 + 3 × 6' },
      { ru: '(8 + 6) × 3', uz: '(8 + 6) × 3' },
      { ru: '8 × 3 × 6', uz: '8 × 3 × 6' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Здесь шесть ламп умножаются на три. А они лежат отдельно, их только прибавляют.', uz: "Bu yerda olti lampa uchga ko'paytiriladi. Ular esa alohida yotibdi, faqat qo'shiladi." },
      2: { ru: 'Скобки говорят, что на каждой полке восемь и шесть. Но шести ламп на полках нет.', uz: "Qavs har tokchada sakkiz va olti bor deydi. Lekin tokchalarda olti lampa yo'q." },
      3: { ru: 'Тогда полок было бы восемнадцать. Шесть ламп надо прибавить, а не умножить.', uz: "Unda tokchalar o'n sakkizta bo'lardi. Olti lampani qo'shish kerak, ko'paytirish emas." }
    },
    pick_ok: { ru: 'Запись верная. Теперь набери ответ.', uz: "Yozuv to'g'ri. Endi javobni tering." },
    ans: 30,
    setup_audio: { ru: 'Заказ на сегодня. Три полки, на каждой по восемь ламп. И ещё шесть ламп на земле. Сначала выбери запись, потом посчитай.', uz: "Bugungi buyurtma. Uch tokcha, har birida sakkizta lampa. Yana oltita lampa yerda. Avval yozuvni tanlang, keyin hisoblang." },
    audio: {
      intro: { ru: 'Порядок действий начинается уже при записи условия.', uz: "Amallar tartibi shart yozilayotganda boshlanadi." },
      on_correct: { ru: 'Тридцать ламп! И запись выбрана верно, и порядок соблюдён.', uz: "O'ttizta lampa! Yozuv ham to'g'ri tanlandi, tartib ham saqlandi." },
      on_wrong: { ru: 'Сначала восемь умножить на три, это двадцать четыре. Потом прибавь шесть.', uz: "Avval sakkiz karra uch, bu yigirma to'rt. Keyin oltini qo'shing." }
    }
  },

  s12: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni top' },
    q: { ru: 'В одной записи порядок сбился. Найди её.', uz: 'Bitta yozuvda tartib buzilgan. Uni toping.' },
    items: [
      {
        stmts: ['2 + 5 × 4 = 22', '(3 + 7) × 2 = 20', '30 − 4 × 5 = 130', '40 : 4 + 6 = 16'],
        wrong: 2,
        hint: { ru: 'Эта запись верна. Проверь остальные, везде ли умножение и деление посчитали первыми.', uz: "Bu yozuv to'g'ri. Boshqalarini tekshiring, hamma joyda ko'paytirish va bo'lish birinchi hisoblanganmi." }
      }
    ],
    audio: {
      intro: { ru: 'Бит записал четыре примера, в одном порядок сбился. Найди его.', uz: "Bit to'rtta misol yozdi, bittasida tartib buzilgan. Uni toping." },
      on_correct: { ru: 'Да! Здесь посчитали слева направо, тридцать минус четыре, двадцать шесть, и на пять. Надо было сначала четыре умножить на пять, двадцать. Тридцать минус двадцать, десять.', uz: "Ha! Bu yerda chapdan o'ngga hisoblagan, o'ttiz ayiruv to'rt, yigirma olti, keyin beshga. Kerak edi, avval to'rt karra besh, yigirma. O'ttiz ayiruv yigirma, o'n." },
      on_wrong: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Финальная проверка. Пять заданий.', uz: 'Yakuniy tekshiruv. Beshta topshiriq.' },
    items: [
      {
        kind: 'num', ans: 14,
        q: { ru: 'Набери ответ: 4 + 5 × 2.', uz: 'Javobni ter: 4 + 5 × 2.' },
        hint: { ru: 'Сначала пять умножить на два.', uz: 'Avval besh karra ikki.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Сколько будет (12 − 4) : 2?', uz: '(12 − 4) : 2 nechta bo\'ladi?' },
        opt0: { ru: '4', uz: '4' },
        opt1: { ru: '10', uz: '10' },
        opt2: { ru: '8', uz: '8' },
        opt3: { ru: '6', uz: '6' },
        wrong_1: { ru: 'Скобки сильнее. Сначала двенадцать минус четыре.', uz: "Qavs kuchliroq. Avval o'n ikki ayiruv to'rt." },
        wrong_2: { ru: 'Это только скобки. Осталось разделить на два.', uz: "Bu faqat qavs. Ikkiga bo'lish qoldi." },
        wrong_3: { ru: 'Это двенадцать разделить на два. Четвёрку надо вычесть первой.', uz: "Bu o'n ikkini ikkiga bo'lish. To'rtni avval ayirish kerak." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое действие первое в 24 : 3 + 2 × 5?', uz: '24 : 3 + 2 × 5 da qaysi amal birinchi?' },
        opt0: { ru: '24 : 3', uz: '24 : 3' },
        opt1: { ru: '3 + 2', uz: '3 + 2' },
        opt2: { ru: '2 × 5', uz: '2 × 5' },
        opt3: { ru: 'Порядок не важен', uz: 'Tartib muhim emas' },
        wrong_1: { ru: 'Сложение последнее. Первыми деление и умножение.', uz: "Qo'shish oxirgi. Birinchi bo'lish va ko'paytirish." },
        wrong_2: { ru: 'Тоже сильное действие, но оно правее. Идём слева направо.', uz: "Bu ham kuchli amal, lekin o'ngroqda. Chapdan o'ngga boramiz." },
        wrong_3: { ru: 'Важен всегда. Иначе ответы у всех разные.', uz: "Har doim muhim. Aks holda hammaning javobi boshqacha bo'ladi." }
      },
      {
        kind: 'num', ans: 44,
        q: { ru: 'Набери ответ: 100 − 7 × 8.', uz: 'Javobni ter: 100 − 7 × 8.' },
        hint: { ru: 'Сначала семь умножить на восемь.', uz: 'Avval yetti karra sakkiz.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
        opt0: { ru: '40 − 3 × 6 = 222', uz: '40 − 3 × 6 = 222' },
        opt1: { ru: '3 + 6 × 5 = 33', uz: '3 + 6 × 5 = 33' },
        opt2: { ru: '(3 + 7) × 2 = 20', uz: '(3 + 7) × 2 = 20' },
        opt3: { ru: '40 : 4 + 6 = 16', uz: '40 : 4 + 6 = 16' },
        wrong_1: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." },
        wrong_2: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." },
        wrong_3: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Семечки подсолнуха уложены спиралями: двадцать одна в одну сторону, тридцать четыре в другую, а у больших цветов пятьдесят пять. Ведь двадцать один плюс тридцать четыре и есть пятьдесят пять.', uz: "Kungaboqar urug'lari spiral bo'ylab terilgan: bir tomonga yigirma bitta, boshqasiga o'ttiz to'rtta, katta gullarda esa ellik beshta. Yigirma bir qo'shuv o'ttiz to'rt aynan ellik beshga teng." },
    fact_audio: { ru: 'У подсолнуха семечки уложены спиралями. Спиралей обычно двадцать одна в одну сторону и тридцать четыре в другую, а у больших цветов пятьдесят пять. Сложи двадцать один и тридцать четыре и получишь как раз пятьдесят пять. Мы весь урок соблюдали порядок в примере, а у подсолнуха свой порядок, и в нём тоже спрятано сложение.', uz: "Kungaboqar urug'lari spiral bo'ylab joylashadi. Spirallar odatda bir tomonga yigirma bitta, boshqa tomonga o'ttiz to'rtta, katta gullarda esa ellik beshta bo'ladi. Yigirma bir va o'ttiz to'rtni qo'shsangiz, aynan ellik besh chiqadi. Butun dars misolda tartibga amal qildik, kungaboqarning esa o'z tartibi bor va unda ham qo'shish yashiringan." },
    audio: {
      intro: { ru: 'Финальная проверка. Пять заданий, потом интересный факт.', uz: 'Yakuniy tekshiruv. Beshta topshiriq, keyin qiziq fakt.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Проверь очередь действий.', uz: 'Amallar navbatini tekshiring.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Заказ собран верно, сад светится!', uz: "Buyurtma to'g'ri yig'ildi, bog' porlayapti!" },
    cando: { ru: 'Теперь ты знаешь, какое действие в примере считают первым.', uz: "Endi siz misolda qaysi amal birinchi hisoblanishini bilasiz." },
    rule_recap: { ru: 'Сначала скобки, потом умножение и деление слева направо, в конце сложение и вычитание. 3 + 6 × 2 = 15, а (3 + 6) × 2 = 18.', uz: "Avval qavs, keyin ko'paytirish va bo'lish chapdan o'ngga, oxirida qo'shish va ayirish." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'уроки 11 и 12: умножение и деление суммы; урок 7: столбик', uz: "11 va 12-darslar: yig'indini ko'paytirish va bo'lish; 7-dars: ustun" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyin' },
    conn_next: { ru: 'связь компонентов', uz: 'komponentlar bog\'lanishi' },
    audio: {
      ru: 'Заказ отправлен, и у тебя новое правило. Сначала скобки, потом умножение и деление, в конце сложение и вычитание. Слева направо. И запомни главное, скобки это не украшение, они меняют ответ. А если ответ известен, а одно из чисел спряталось? Например, какое число умножили на пять, чтобы вышло сорок? Об этом в следующем уроке!',
      uz: "Buyurtma yuborildi, sizda esa yangi qoida bor. Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish. Chapdan o'ngga. Va asosiysini eslab qoling, qavs bezak emas, u javobni o'zgartiradi. Agar javob ma'lum bo'lsa, sonlardan biri yashiringan bo'lsa-chi? Masalan, qirq chiqishi uchun qaysi son beshga ko'paytirilgan? Bu haqda keyingi darsda!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Сначала вспомним, что умеем.', uz: 'Avval bilganimizni eslaymiz.' },
  s2:  { ru: 'Теперь к доске заказа.', uz: 'Endi buyurtma taxtasiga.' },
  s3:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s4:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s5:  { ru: 'Теперь про скобки.', uz: 'Endi qavs haqida.' },
  s6:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang." },
  s7:  { ru: 'Потренируем главный навык.', uz: "Asosiy ko'nikmani mashq qilamiz." },
  s8:  { ru: 'Теперь считаем до конца.', uz: 'Endi oxirigacha hisoblaymiz.' },
  s9:  { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s10: { ru: 'Теперь набирай ответы сам.', uz: "Endi javoblarni o'zingiz tering." },
  s11: { ru: 'Биту нужна помощь с заказом.', uz: 'Bitga buyurtmada yordam kerak.' },
  s12: { ru: 'Проверим записи Бита.', uz: 'Bitning yozuvlarini tekshiramiz.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Заказ готов. Идём дальше!', uz: 'Buyurtma tayyor. Davom etamiz!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Заказ собран по правилу, и корзина у входа теперь одна. Спасибо за помощь!',
  uz: "Missiya bajarildi! Buyurtma qoida bo'yicha yig'ildi, kirishdagi savat endi bitta. Yordamingiz uchun rahmat!"
};





// ============================================================
// 1-SINF ANIMATSION KIT (etalon — keyingi darslar shundan meros oladi)
// Barcha sikllar prefers-reduced-motion bilan to'xtaydi (CSS @media + usePrefersReducedMotion).
// ============================================================



































// ============================================================
// LUMO VIZUALIZATORLAR — «BIT SHAHRI» (yuzlik/o'nlik/birlik):
// chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik).
// Qizil mitti yulduz osmoni, chiroqli minoralar. Razryad-mat (3 ustun).
// ============================================================


const brgSeg = makeBrgSeg(BRIDGES);
const withBridgeAudio = (c, key) => {
  const b = BRIDGES[key];
  if (!b || !c.audio || !c.audio.intro) return c;
  return { ...c, audio: { ...c.audio, intro: { ru: `${b.ru} ${c.audio.intro.ru}`, uz: `${b.uz} ${c.audio.intro.uz}` } } };
};



















// --- RAZRYAD-MAT (3 ustun: yuzlik/o'nlik/birlik). concrete -> panel/lenta/chiroq; digits -> raqam.
const RazryadTable = ({ h = 0, t = 0, o = 0, labels, emph = null, concrete = false, digits = false, onCell = null, cellSel = null }) => {
  const cols = [['h', h], ['t', t], ['o', o]];
  return (
    <div className="lm-mat">
      {cols.map(([k, n]) => (
        <div key={k} className={`lm-mat-col ${emph === k ? 'lm-mat-emph' : ''}`}>
          <div className="lm-mat-head mono">{labels[k]}</div>
          <div className="lm-mat-cell">
            {concrete && (
              <div className="lm-mat-stack">
                {n === 0
                  ? <span className="lm-mat-zero mono">0</span>
                  : Array.from({ length: n }).map((_, i) => (
                      <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        {k === 'h' ? <Panel className="lm-mat-panel"/> : k === 't' ? <Lenta className="lm-mat-lenta"/> : <Chiroq className="lm-mat-chiroq"/>}
                      </span>
                    ))}
              </div>
            )}
            {digits && (
              onCell
                ? <button className={`lm-mat-digit lm-mat-digit-btn mono ${cellSel === k ? 'lm-mat-digit-ok' : ''}`} onClick={() => onCell(k)}>{n}</button>
                : <div className="lm-mat-digit mono">{n}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};






























// --- HOOK SAHNASI: Lumo shahri + butun ekipaj sayyorada qo'ngan. Bit mezbon MARKAZDA, do'stlar yon-atrofda.
const HookScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <GardenTerraceBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars09 «Ko'paytirish jadvali» (Б2 «Nur bog'lari»)
// ============================================================



// --- NUR BOG'I TERRASALARI SAHNASI (D10): qatorli porlovchi o'simliklar (massiv)
const GardenTerraceBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g0sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="52%" stopColor="#E2F2FB"/><stop offset="100%" stopColor="#FBEFD4"/></linearGradient>
      <linearGradient id="g0hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CCE8B8"/><stop offset="100%" stopColor="#A6CF92"/></linearGradient>
      <linearGradient id="g0wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#CBB488"/></linearGradient>
      <linearGradient id="g0floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F1DFB4"/><stop offset="100%" stopColor="#DCC392"/></linearGradient>
      <linearGradient id="g0col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#CDB489"/><stop offset="42%" stopColor="#F4E7C8"/><stop offset="100%" stopColor="#CDB489"/></linearGradient>
      <linearGradient id="g0bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A87E5C"/><stop offset="100%" stopColor="#7C5A3E"/></linearGradient>
      <radialGradient id="g0sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
    </defs>
    {/* --- OSMON + sayyora + quyosh --- */}
    <rect x="0" y="0" width="400" height="130" fill="url(#g0sky)"/>
    {/* KUNDUZ: quyosh + oq bulutlar (metodist 2026-08-05: fon YORUG' bo'lsin) */}
    <circle cx="330" cy="38" r="40" fill="url(#g0sun)"/><circle cx="330" cy="38" r="13" fill="#FFF3C4"/>
    <g fill="#FFFFFF" opacity="0.9">
      <ellipse cx="76" cy="34" rx="25" ry="9"/><ellipse cx="94" cy="30" rx="17" ry="7.5"/><ellipse cx="58" cy="31" rx="14" ry="6.5"/>
      <ellipse cx="214" cy="24" rx="19" ry="7.5"/><ellipse cx="229" cy="21" rx="12" ry="5.5"/>
      <ellipse cx="150" cy="44" rx="14" ry="5.5" opacity="0.7"/>
    </g>
    {/* uzoq yashil tepaliklar (kunduzgi ufq) */}
    <path d="M0 124 Q52 98 108 118 Q158 132 202 110 Q252 88 312 114 Q356 130 400 112 L400 132 L0 132 Z" fill="url(#g0hill)"/>
    {/* uzoq shahar silueti (bog' devori ortida) */}
    <g opacity="0.75" fill="#8FC08A">
      <ellipse cx="66" cy="118" rx="16" ry="9"/><ellipse cx="88" cy="120" rx="11" ry="7"/>
      <ellipse cx="306" cy="118" rx="15" ry="9"/><ellipse cx="326" cy="121" rx="10" ry="6"/>
      <ellipse cx="186" cy="117" rx="13" ry="8"/>
    </g>
    {/* bog' o'rtaligi (midground to'ldirish — oq bo'shliq bo'lmasin) */}
    <rect x="0" y="120" width="400" height="58" fill="url(#g0floor)"/>
    {/* --- BOG' DEVORI (past, panjarali) --- */}
    <rect x="0" y="120" width="400" height="12" fill="url(#g0wall)"/><rect x="0" y="118" width="400" height="4" rx="2" fill="#EAD9B8"/>
    <g stroke="#B49A6E" strokeWidth="1.2" opacity="0.6">{[40, 90, 140, 260, 310, 360].map((x, i) => <line key={i} x1={x} y1="122" x2={x} y2="130"/>)}</g>
    {/* --- MARKAZIY MASSIV: 3 x 4 o'simlik (ko'paytirish) --- */}
    <rect x="104" y="146" width="192" height="16" rx="4" fill="url(#g0bed)"/><rect x="104" y="146" width="192" height="4" rx="2" fill="#B78E64"/>
    <g><path d="M130 148 Q128 127 130 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="106" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0s' }} cx="130" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 127 172 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="106" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.18s' }} cx="172" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 127 214 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="106" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.36s' }} cx="214" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 127 256 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="106" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.54s' }} cx="256" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M130 148 Q128 136 130 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="124" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.72s' }} cx="130" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 136 172 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="124" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.8999999999999999s' }} cx="172" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 136 214 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="124" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.08s' }} cx="214" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 136 256 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="124" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.26s' }} cx="256" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M130 148 Q128 145 130 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="142" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.44s' }} cx="130" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 145 172 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="142" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.6199999999999999s' }} cx="172" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 145 214 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="142" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.7999999999999998s' }} cx="214" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 145 256 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="142" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.98s' }} cx="256" cy="142" r="3" fill="#FFF4D0"/></g>
    {/* massiv ramkasi + tenglama banneri (pergoladan osilgan) */}
    <path d="M160 52 h80 v14 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 Z" fill="#E8B4C4" stroke="#D08FA6" strokeWidth="1"/>
    <text x="200" y="63" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A4E64" fontFamily="'JetBrains Mono', monospace">3 + 6 × 2</text>
    {/* --- PERGOLA (ramka: 2 ustun + ustki to'sinlar + osma uzumcha) --- */}
    {[26, 356].map((x, i) => (
      <g key={`col${i}`}>
        <rect x={x - 6} y="40" width="30" height="12" rx="3" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <rect x={x} y="52" width="18" height="124" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <rect x={x - 4} y="168" width="26" height="10" rx="2" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <path d={`M${x + 9} 66 Q${x + 3} 90 ${x + 9} 116 Q${x + 15} 140 ${x + 9} 164`} fill="none" stroke="#6FBF8E" strokeWidth="2"/>
        <g fill="#8FD8A8">{[80, 120, 150].map((cy, k) => <circle key={k} cx={x + (k % 2 ? 4 : 14)} cy={cy} r="2.4"/>)}</g>
      </g>
    ))}
    {/* ustki to'sinlar */}
    <g fill="url(#g0col)" stroke="#9A855C" strokeWidth="0.8" opacity="0.9">{[44, 92, 140, 200, 260, 308, 356].map((x, i) => <rect key={i} x={x} y="40" width="8" height="7" rx="2"/>)}</g>
    <rect x="30" y="40" width="340" height="6" rx="2" fill="#C9B084"/>
    {/* osma gul-savatlar */}
    {[120, 280].map((x, i) => (
      <g key={`bk${i}`}><line x1={x} y1="46" x2={x} y2="58" stroke="#9A855C" strokeWidth="1"/><path d={`M${x - 8} 58 h16 l-2 8 h-12 Z`} fill="#B78E64"/><circle className="lm-glow" cx={x} cy="60" r="3.5" fill="#FFB6D0"/></g>
    ))}
    {/* --- POL: bog' yo'lagi + perspektiva --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#g0floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M40 230 L182 178"/><path d="M140 230 L196 178"/><path d="M260 230 L204 178"/><path d="M360 230 L218 178"/></g>
    {/* 13-DARS YAKUNI: uchta tayyor yo'lak porlaydi (to'siq yechildi) */}
    <g>
      <path d="M181 178 L188 178 L92 230 L26 230 Z" fill="#FFE6A6" opacity="0.42" stroke="#FFF0C4" strokeWidth="0.6" strokeOpacity="0.5"/>
      <path d="M196 178 L203 178 L222 230 L166 230 Z" fill="#FFE6A6" opacity="0.42" stroke="#FFF0C4" strokeWidth="0.6" strokeOpacity="0.5"/>
      <path d="M211 178 L218 178 L372 230 L306 230 Z" fill="#FFE6A6" opacity="0.42" stroke="#FFF0C4" strokeWidth="0.6" strokeOpacity="0.5"/>
      <g fill="#FFF0C4">
        <circle className="lm-glow" cx="171" cy="190" r="1.6"/><circle className="lm-glow" style={{ animationDelay: '0.4s' }} cx="146" cy="206" r="2"/><circle className="lm-glow" style={{ animationDelay: '0.8s' }} cx="108" cy="224" r="2.4"/>
        <circle className="lm-glow" style={{ animationDelay: '0.2s' }} cx="199" cy="190" r="1.6"/><circle className="lm-glow" style={{ animationDelay: '0.6s' }} cx="201" cy="206" r="2"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="203" cy="224" r="2.4"/>
        <circle className="lm-glow" style={{ animationDelay: '0.3s' }} cx="228" cy="190" r="1.6"/><circle className="lm-glow" style={{ animationDelay: '0.7s' }} cx="264" cy="206" r="2"/><circle className="lm-glow" style={{ animationDelay: '1.1s' }} cx="308" cy="224" r="2.4"/>
      </g>
    </g>
    {/* --- OLD PLAN: gultuvaklar + kapalak --- */}
    <g transform="translate(20 176)"><path d="M-10 0 h20 l-3 -14 h-14 Z" fill="#C98A6A"/><path d="M0 -14 Q-4 -28 0 -34" stroke="#6FBF8E" strokeWidth="2.4" fill="none"/><circle className="lm-glow" cx="0" cy="-36" r="5" fill="#FFB6D0"/><path d="M-4 -22 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/></g>
    <g transform="translate(380 176)"><path d="M-9 0 h18 l-3 -12 h-12 Z" fill="#C98A6A"/><path d="M0 -12 Q3 -24 0 -30" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-32" r="4.2" fill="#8FE8C0"/></g>
    <g className="lm-float"><g transform="translate(300 96)"><path d="M0 0 q-5 -4 -9 0 q4 3 9 0 q5 -4 9 0 q-4 3 -9 0Z" fill="#FFA6D0" opacity="0.9"/><circle cx="0" cy="0" r="1.4" fill="#FFF"/></g></g>
    <g><circle className="lm-glow" cx="110" cy="80" r="1.5" fill="#FFE0B0"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="290" cy="70" r="1.4" fill="#CFE8FF"/></g>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <GardenTerraceBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- MASSIV (nurli o'simlik qatorlari): rows x cols Chiroq.
const ArrayViz = ({ rows, cols }) => (
  <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 'clamp(3px, 1vw, 7px)', padding: 'clamp(7px, 1.8vw, 13px)', background: '#152342', borderRadius: 12 }}>
    {Array.from({ length: rows * cols }).map((_, i) => (
      <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.03}s`, width: 'clamp(14px, 4vw, 24px)', height: 'clamp(14px, 4vw, 24px)', display: 'inline-flex' }}><Chiroq/></span>
    ))}
  </div>
);

// --- MINI-SHAHARCHA (final savol vizuali).
const MINI_HOUSES = [
  [10, 30, 34, '#F2B49A', '#DF8A6C', 'pitch'], [50, 24, 44, '#F5D592', '#E0AE5A', 'dome'],
  [80, 34, 26, '#BEA9E0', '#9A7CC6', 'pitch'], [120, 26, 40, '#A6D8C2', '#7CB69E', 'flat'],
  [152, 30, 30, '#F6BCC6', '#E489A2', 'dome'], [188, 26, 42, '#AECDEC', '#83A9D2', 'pitch'], [220, 30, 32, '#F3CB9E', '#DCA265', 'flat']
];
const MiniCity = () => (
  <svg viewBox="0 0 260 92" style={{ width: 'min(300px, 88%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g>
      <circle cx="30" cy="16" r="8" fill="#C79AD6"/>
      <ellipse cx="30" cy="16" rx="13.5" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.6" opacity="0.85"/>
    </g>
    <circle cx="228" cy="14" r="9" fill="#FFE39A" opacity="0.55"/>
    <circle cx="228" cy="14" r="5.5" fill="url(#lmSun)"/>
    <g className="lm-float"><path d="M120 14 L125 21 L120 28 L115 21 Z" fill="#7FE0D8" opacity="0.9"/></g>
    {MINI_HOUSES.map(([x, w, h, body, roof, type], i) => {
      const ty = 84 - h;
      return (
        <g key={i}>
          {type === 'pitch' && <path d={`M${x - 2} ${ty + 1} L${x + w / 2 - 4} ${ty - 8} Q${x + w / 2} ${ty - 12} ${x + w / 2 + 4} ${ty - 8} L${x + w + 2} ${ty + 1} Z`} fill={roof}/>}
          {type === 'dome' && <path d={`M${x} ${ty + 1} A ${w / 2} ${w / 2.4} 0 0 1 ${x + w} ${ty + 1} Z`} fill={roof}/>}
          {type === 'flat' && <rect x={x - 2} y={ty - 5} width={w + 4} height="7" rx="3" fill={roof}/>}
          <rect x={x} y={ty} width={w} height={84 - ty} rx="5" fill={body}/>
          {[0, 1].map((r) => [0, 1].map((cc) => {
            const wy = ty + 8 + r * 12;
            if (wy > 78) return null;
            return <rect key={`${r}-${cc}`} className={(i + r + cc) % 3 === 0 ? 'lm-cwin' : ''} x={x + 5 + cc * (w - 14)} y={wy} width="5" height="6" rx="1.4" fill="url(#lmGlow)"/>;
          }))}
        </g>
      );
    })}
    <rect x="0" y="84" width="260" height="8" rx="3" fill="#DAC090"/>
    {[[70, '#8FE0D0'], [140, '#F0A0C8'], [206, '#8FD8F0']].map(([x, c], i) => (
      <circle key={i} className="lm-glow" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy="88" r="2" fill={c}/>
    ))}
  </svg>
);


const NumPad = ({ value, setValue, disabled, max = 2, state = null }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className={`mono${state === 'bad' ? ' lm-ans-bad' : ''}`} style={{ minWidth: 120, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#E0563A' : T.accent}`, background: state === 'ok' ? '#EAF6EF' : state === 'bad' ? '#FDECE7' : T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#B33F27' : T.ink, letterSpacing: 4, padding: '0 14px', transition: 'border-color .18s, background .18s, color .18s' }}>{value || '—'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 6 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={{ ...npKey, cursor: disabled ? 'default' : 'pointer' }}>{d}</button>
        ))}
        <span/>
        <button type="button" disabled={disabled} onClick={() => push('0')} style={{ ...npKey, cursor: disabled ? 'default' : 'pointer' }}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...npKey, fontSize: 18, color: T.accent, cursor: disabled ? 'default' : 'pointer' }}>⌫</button>
      </div>
    </div>
  );
};

// --- KO'P-RAUNDLI MC (heading/renderFig render-props).
const MCRoundD2 = ({ props, ck, heading, renderFig, cols = 2 }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  const items = React.useMemo(() => c.items.map((it) => {
    const order = shuffleArr(it.opts.map((_, i) => i));
    return { ...it, opts: order.map((i) => it.opts[i]), hints: it.hints ? order.map((i) => it.hints[i]) : it.hints, ci: order.indexOf(it.ci) };
  }), []);
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  const [okPick, setOkPick] = useState(props.storedAnswer && items.length ? items[items.length - 1].ci : null);   // to'g'ri variant YASHIL yonadi (metodist 2026-08-04)
  const pick = (i) => {
    if (!canAct || done || okPick !== null || wrongSet.has(i)) return;
    if (i === it.ci) {
      setOkPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { if (idx + 1 < items.length) setOkPick(null); setWrongSet(new Set()); setHintMsg(null); setIdx((n) => n + 1); }, 1200);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      setHintMsg((it.hints && it.hints[i]) || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(((it.hints && it.hints[i]) || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: ck,
        correctAnswer: String(items.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, items.length)} / {items.length}</div>
            <h1 className="title h-sub fade-up">{heading(it)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={`${score} / ${items.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};



// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================



// --- 5 soniyalik o'ylash SOATI (Dars01/11 naqshi).
const CountdownClock = ({ n, total = 5, lang }) => {
  const R = 34, C = 2 * Math.PI * R;
  const frac = Math.max(0, n) / total;
  return (
    <div className="lm-clock fade-up">
      <svg viewBox="0 0 80 80" style={{ width: 'clamp(78px, 20vw, 96px)', height: 'auto' }} aria-hidden="true">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#E6E1D6" strokeWidth="7"/>
        <circle cx="40" cy="40" r={R} fill="none" stroke="#FF4F28" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 1s linear' }}/>
        <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fontSize="30" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">{Math.max(0, n)}</text>
      </svg>
      <span className="lm-clock-cap mono">{lang === 'ru' ? 'Подумай…' : "O'ylab ko'ring…"}</span>
    </div>
  );
};


// ============================================================
// DARS14 EKRANLARI (15). Donor: Dars12 (bog' sahnasi, yashil javob, FactCard freym ostida,
// orbital anim, TAP bilan ochilish, NumPad, MCRoundD2).
// YANGI: OrderBoard (buyurtma taxtasi), BasketFig (savat + lampalar), FoldRow (ifoda
//   SVYORTKASI: juftlik yonadi -> bitta plashkaga aylanadi -> yozuv qisqaradi),
//   ColumnCalc (ustun: × , + va − uchun bitta komponent; belgi sonlar orasida, 5-sinf
//   naqshi: monoshrift, ch birligi, zaxira raqami xona ustida).
// ============================================================

// --- BUYURTMA TAXTASI: yog'och lavha, ustida yozuv (bog' kirishida turadi).
const OrderBoard = ({ expr, cap, hot = false }) => (
  <div className={`d14-board ${hot ? 'd14-board-hot' : ''}`}>
    <span className="d14-board-nail" style={{ left: '10%' }}/>
    <span className="d14-board-nail" style={{ right: '10%' }}/>
    <span className="mono d14-board-expr">{expr}</span>
    {cap && <span className="d14-board-cap">{cap}</span>}
  </div>
);

// --- SAVAT: 1-SINF naqshi (grade1 BasketArt) — dastali to'qima savat, ichi YUQORIDAN
// ko'rinadi: lampalar gardish orqasida uch qatorda yotadi, oldingi qator gardish bilan
// yarim yopiladi. Metodist 2026-08-05: «пусть вид на корзин будет с верху как на 1 классе».
// Qatorlar ORQADAN oldinga to'ladi: 15 lampa = 6 + 6 + 3, 18 lampa = 6 + 6 + 6 —
// oldingi qator KO'ZGA ko'rinib farq qiladi.
const D14_BASKET_ROWS = [
  { y: 41, xs: [35, 45, 55, 65, 75, 85] },
  { y: 51, xs: [31, 42, 53, 64, 75, 86] },
  { y: 61, xs: [33, 44, 55, 66, 77, 88] }
];
const D14_BASKET_SLOTS = D14_BASKET_ROWS.flatMap((r) => r.xs.map((x) => [x, r.y]));
const BasketFig = ({ n, cap, tone = 'a' }) => (
  <div className="d14-basket" aria-hidden="true">
    <svg viewBox="0 0 120 108" style={{ width: 'clamp(58px, 13.5vw, 84px)', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id={`d14bk${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D89A4C"/><stop offset="100%" stopColor="#AE6F2A"/>
        </linearGradient>
        <radialGradient id={`d14bkin${tone}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#8C6234"/><stop offset="100%" stopColor="#5E3F1E"/>
        </radialGradient>
      </defs>
      {/* dasta (orqada) */}
      <path d="M32 54 Q60 6 88 54" fill="none" stroke="#90591D" strokeWidth="7" strokeLinecap="round"/>
      <path d="M32 54 Q60 12 88 54" fill="none" stroke="#C68E42" strokeWidth="2.6" strokeLinecap="round" opacity="0.7"/>
      {/* ichki bo'shliq (savat ichi ko'rinadi) */}
      <ellipse cx="60" cy="54" rx="41" ry="15.5" fill={`url(#d14bkin${tone})`}/>
      {/* LAMPALAR — ichida, orqa qatordan oldinga */}
      <g>
        {D14_BASKET_SLOTS.slice(0, n).map(([x, y], i) => (
          <g key={i} className="g1-pop-in" style={{ animationDelay: `${0.1 + i * 0.04}s` }}>
            <circle cx={x} cy={y} r="6" fill="rgba(255,214,120,0.28)"/>
            <circle cx={x} cy={y} r="4" fill="#FFE09A" stroke="#E8B45A" strokeWidth="0.8"/>
            <circle cx={x - 1.1} cy={y - 1.1} r="1.3" fill="#FFF8E4"/>
          </g>
        ))}
      </g>
      {/* savat OLD devori: yuqori chegarasi — gardishning oldingi yoyi */}
      <path d="M19 54 A41 15.5 0 0 0 101 54 Q99 88 82 96 Q60 102 38 96 Q21 88 19 54 Z"
        fill={`url(#d14bk${tone})`} stroke="#8A561B" strokeWidth="1.6"/>
      {/* to'qima: gorizontal qatorlar + vertikal o'rim */}
      <g fill="none" stroke="#8A561B" strokeWidth="1.3" opacity="0.42">
        <path d="M21 66 Q60 76 99 66"/><path d="M24 78 Q60 88 96 78"/><path d="M31 89 Q60 97 89 89"/>
      </g>
      <g fill="none" stroke="#8A561B" strokeWidth="1" opacity="0.3">
        <path d="M34 62 L37 95"/><path d="M47 66 L48 99"/><path d="M60 68 V101"/><path d="M73 66 L72 99"/><path d="M86 62 L83 95"/>
      </g>
      {/* gardish (old lab) */}
      <path d="M19 54 A41 15.5 0 0 0 101 54 L101 47 A41 15.5 0 0 1 19 47 Z" fill="#B5793A" stroke="#8A561B" strokeWidth="1.3"/>
      <path d="M22 51 A38 13 0 0 0 98 51" fill="none" stroke="#EAB97A" strokeWidth="1.8" opacity="0.65"/>
    </svg>
    <span className="mono d14-basket-num">{n}</span>
    {cap && <span className="d14-basket-cap">{cap}</span>}
  </div>
);



// ============================================================
// USTUN (stolbik) — 5-sinf naqshi (grade5/Dars04 MulColumnStepwise, grade3/Dars11 ColumnMulDemo).
// Har satr = BELGI slot (2 monoshrift belgisi) + TANA (w ta belgi), ikkisi ham bir xil
// shriftda, shuning uchun raqamlar xonalar bo'yicha aniq ustun-ustun tushadi va belgi
// pastdagi sonning chap yonida turadi (kitobdagi joylashuv).
// carries: [k] — zaxira raqami k-xona USTIDA (absolyut, ch birligida).
// ============================================================
const ColumnCalc = ({ w = 3, sign, top, bot, res, carries = [], show = true }) => (
  <div className="d14-col mono" aria-hidden="true">
    <div className="d14-colr-carry" style={{ width: `${w + 2}ch` }}>
      {carries.map((k) => (
        <span key={k} className="d14-carry lm-reveal" style={{ left: `${k + 2.5}ch` }}>1</span>
      ))}
    </div>
    <div className="d14-colr"><span className="d14-col-slot">{'  '}</span>{top}</div>
    <div className="d14-colr"><span className="d14-col-slot d14-col-sign">{`${sign} `}</span>{bot}</div>
    <div className="d14-col-rule" style={{ width: `${w + 2}ch` }}/>
    <div className={`d14-colr${show ? ' d14-col-hot' : ''}`}><span className="d14-col-slot">{'  '}</span>{show ? res : ' '.repeat(w)}</div>
  </div>
);

// ============================================================
// FactCard illyustratsiyasi (s13): KUNGABOQAR kallagi — urug'lar OLTIN BURCHAK bo'ylab
// spiral qilib terilgan (137,5 daraja qadam: shu qadam bilan urug'lar bo'shliqsiz
// joylashadi va spirallar soni 21, 34, 55 bo'lib chiqadi). Atrofida bitta URUG' orbitada.
// Fakt MATEMATIKA + FAN mavzusida (metodist talabi 2026-08-05).
// ============================================================
const D14_STARS = [
  [18, 20, 1.0, 0], [42, 12, 0.7, 0.6], [68, 34, 0.9, 1.2], [28, 62, 0.8, 0.3],
  [250, 18, 1.0, 0.5], [286, 12, 0.7, 1.0], [312, 30, 1.1, 1.5], [268, 48, 0.6, 2.0],
  [148, 10, 0.8, 0.8], [200, 14, 0.7, 1.3]
];
const D14_SEEDS = Array.from({ length: 110 }, (_, i) => {
  const a = i * 137.5 * Math.PI / 180;
  const r = 3.35 * Math.sqrt(i + 1);
  return [+(170 + r * Math.cos(a)).toFixed(1), +(70 + r * Math.sin(a)).toFixed(1), +(1.3 + 1.1 * (i / 110)).toFixed(2)];
});
const D14_PETALS = Array.from({ length: 18 }, (_, i) => +(i * 20).toFixed(1));
const SeedFig = () => (
  <>
    <circle cx="170" cy="70" r="8" fill="url(#d14Glow)"/>
    <g transform="rotate(-24 170 70)">
      <ellipse cx="170" cy="70" rx="3.4" ry="5.4" fill="#4A3B28" stroke="#2E2417" strokeWidth="0.7"/>
      <path d="M168.4 66.4 q1.4 3.6 0 7.2" stroke="#C9B08A" strokeWidth="0.9" fill="none"/>
    </g>
  </>
);
const SunflowerFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="d14Sky" cx="50%" cy="30%" r="75%"><stop offset="0%" stopColor="#1E2C52"/><stop offset="60%" stopColor="#141E3C"/><stop offset="100%" stopColor="#0A1024"/></radialGradient>
        <radialGradient id="d14Glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFE7A8" stopOpacity="0.85"/><stop offset="60%" stopColor="#F0C46A" stopOpacity="0.35"/><stop offset="100%" stopColor="#F0C46A" stopOpacity="0"/></radialGradient>
        <radialGradient id="d14Head" cx="42%" cy="34%" r="72%"><stop offset="0%" stopColor="#6E5636"/><stop offset="100%" stopColor="#3E2F1C"/></radialGradient>
        <linearGradient id="d14Petal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFD866"/><stop offset="100%" stopColor="#E8A62C"/></linearGradient>
        <clipPath id="d14Clip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#d14Clip)">
        <rect x="0" y="0" width="340" height="150" fill="url(#d14Sky)"/>
        <g fill="#FFF6E8">{D14_STARS.map(([x, y, r, d], i) => <circle key={i} className="star-tw" style={{ animationDelay: `${d}s` }} cx={x} cy={y} r={r}/>)}</g>
        {/* uzoqdagi porlayotgan bog' qatorlari */}
        <g opacity="0.5">
          <rect x="18" y="128" width="44" height="4" rx="2" fill="#2C4433"/><rect x="70" y="128" width="44" height="4" rx="2" fill="#2C4433"/>
          <rect x="232" y="128" width="44" height="4" rx="2" fill="#2C4433"/><rect x="284" y="128" width="40" height="4" rx="2" fill="#2C4433"/>
          <circle className="star-tw" style={{ animationDelay: '0.5s' }} cx="40" cy="130" r="1.4" fill="#FFE6A6"/>
          <circle className="star-tw" style={{ animationDelay: '1.3s' }} cx="92" cy="130" r="1.4" fill="#FFE6A6"/>
          <circle className="star-tw" style={{ animationDelay: '0.9s' }} cx="254" cy="130" r="1.4" fill="#FFE6A6"/>
        </g>
        {/* orbita izi */}
        <ellipse cx="170" cy="70" rx="80" ry="44" fill="none" stroke="rgba(248,232,200,0.22)" strokeWidth="1.1"/>
        {/* ORQA urug' */}
        <g className="lumo-orbit-back"><SeedFig/></g>
        {/* KUNGABOQAR: gulbarglar + kallak + spiral urug'lar */}
        <circle className="rd-glow" cx="170" cy="70" r="56" fill="url(#d14Glow)"/>
        <g>
          {D14_PETALS.map((deg, i) => (
            <g key={i} transform={`rotate(${deg} 170 70)`}>
              <ellipse cx="170" cy="24" rx="6.4" ry="14" fill="url(#d14Petal)" stroke="#D2941F" strokeWidth="0.7"/>
            </g>
          ))}
        </g>
        <circle cx="170" cy="70" r="38" fill="url(#d14Head)" stroke="#2E2417" strokeWidth="1.4"/>
        <g fill="#D8BE8E">
          {D14_SEEDS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.55 + 0.45 * (i / D14_SEEDS.length)}/>)}
        </g>
        {/* OLD urug' */}
        <g className="lumo-orbit-front"><SeedFig/></g>
      </g>
    </svg>
  </span>
);


// s0 — XUK (prognoz, 4 variant 2x2, aralashadi)
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const order = React.useMemo(() => shuffleArr([0, 1, 2, 3]), []);
  const ok = picked !== null && order[picked] === 0;
  const fbKey = (i) => {
    const k = order[i];
    return k === 0 ? 'on_correct' : (k === 1 ? 'on_wrong1' : (k === 2 ? 'on_wrong2' : 'on_idk'));
  };
  const pick = (i) => {
    if (picked !== null || !canAct) return;
    setPicked(i);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio[fbKey(i)][lang]); }
  };
  const canAdv = useAdvanceGate(picked !== null, audio);
  const navContent = (
    <>
      {props.screen > 0 && <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>}
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const opts = [c.opt0, c.opt1, c.opt2, c.opt3];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1vw, 8px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {/* ETALON (Dars01 s0): xuk ekranida BIOM sahnasi — bola avval joyni ko'radi */}
        <div className="frame fade-up delay-1 d14-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1 d14-hookrow" style={{ padding: 'clamp(6px, 1.2vw, 9px)' }}>
            <OrderBoard expr={t(c.board)} cap={t(c.board_cap)}/>
            <div className="d14-baskets">
              <BasketFig n={15} cap={t(c.basket_a)} tone="a"/>
              <BasketFig n={18} cap={t(c.basket_b)} tone="b"/>
            </div>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(12px, 1.7vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(12px, 1.8vw, 16px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span>{t(opts[order[picked]])}</span>
            </button>
          </div>
        )}
        {picked !== null && (
          <FeedbackBlock show={true} isCorrect={ok} wrongClass="frame-tip">
            <Reaction state={ok ? 'correct' : 'wrong'} praise={t(c.audio[fbKey(picked)])}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s1 — KO'PRIK: ikki karta BITTALAB ochiladi
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:card1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:card2', waits_for: null },
    { id: 's1_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [opened, setOpened] = useState(0);
  const done = opened >= 2;
  const open = (i) => {
    if (!canAct || i !== opened) return;
    setOpened(i + 1); sfx.playCorrect();
    audio.triggerInternal(`card${i + 1}`);
  };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const cards = [{ v: c.card1, cap: c.card1_cap }, { v: c.card2, cap: c.card2_cap }];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <p className="fade-up delay-1" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(c.tap_label)}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'clamp(8px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          {cards.map((cd, i) => (
            <button key={i} className={`d12-card ${opened > i ? 'd12-card-on' : ''}`} disabled={!canAct || opened !== i} onClick={() => open(i)}>
              {opened > i ? (
                <>
                  <span className="mono lm-reveal" style={{ fontSize: 'clamp(17px, 3.2vw, 24px)', fontWeight: 800, color: '#1F7A4D' }}>{t(cd.v)}</span>
                  <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 700, color: T.ink2 }}>{t(cd.cap)}</span>
                </>
              ) : (
                <span className="mono" style={{ fontSize: 'clamp(22px, 4.4vw, 30px)', fontWeight: 800, color: T.ink3 }}>?</span>
              )}
            </button>
          ))}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio[lang][3]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s2 — SVYORTKA: ifoda qisqaradi (3 tap)
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's2_3', text: c.audio[lang][3], trigger: 'on_event:step3', waits_for: null },
    { id: 's2_4', text: c.audio[lang][4], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 4);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const rows = [
    [{ txt: '3' }, { txt: '+' }, { txt: '6 × 2' }],
    [{ txt: '3' }, { txt: '+' }, { txt: '6 × 2', hot: true }],
    [{ txt: '3' }, { txt: '+' }, { txt: '12', fresh: true }],
    [{ txt: '15', big: true }]
  ];
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : c.btn3);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <OrderBoard expr={t(CONTENT.s0.board)} hot={step >= 1}/>
          <FoldRow items={rows[step]}/>
          {step >= 1 && step < 3 && (
            <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, color: T.ink3 }}>
              {lang === 'ru' ? '× и : считают первыми' : "× va : birinchi hisoblanadi"}
            </span>
          )}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(btnLabel)}</button>
          )}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — SAVOL-OLDIN-QOIDA
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const solved = picked === ci;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(`${c.on_correct[lang]} ${c.rule_speech[lang]}`); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.hints[1])[lang]); }
    }
  };
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center', color: T.accent }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          {order.map((k, i) => (
            <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
              disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.6vw, 13px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 800, textAlign: 'center' }}>
              {t(c.opts[k])}
            </button>
          ))}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <div className="d14-rulelines">
              {c.rule_lines[lang].map((l, i) => <span key={i} className="d14-ruleline lm-reveal" style={{ animationDelay: `${i * 0.18}s` }}>{l}</span>)}
              <span className="mono d14-ruleex lm-reveal" style={{ animationDelay: '0.54s' }}>3 + 6 × 2 = 3 + 12 = 15</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s4 — BIT TUZOG'I (M1: chapdan o'ngga)
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    { id: 's4_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's4_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = trapPick === c.trap_ci;
  const pickTrap = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === c.trap_ci) {
      setTrapPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_wrong[lang]); }
    }
  };
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          {c.lines.map((l, i) => (
            <span key={i} className="mono lm-reveal" style={{ animationDelay: `${i * 0.25}s`, fontSize: `clamp(${i === 2 ? 19 : 16}px, ${i === 2 ? 3.8 : 3}vw, ${i === 2 ? 28 : 22}px)`, fontWeight: 800, color: i === 2 ? '#C0392B' : T.ink }}>{l}</span>
          ))}
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.trap_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s5 — QAVS HAMMASINI O'ZGARTIRADI: ikki panel (2 tap) + 1 savol
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's5_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's5_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's5_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done: built, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const orderMC = React.useMemo(() => shuffleArr(c.mc_opts.map((_, i) => i)), []);
  const mcCi = orderMC.indexOf(c.mc_ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === mcCi || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === mcCi) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.mc_hints[orderMC[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.mc_hints[1])[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.mc_q),
        correctAnswer: c.mc_opts[c.mc_ci][lang], studentAnswer: c.mc_opts[c.mc_ci][lang], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const panel = (title, lines, cap, shown, tone) => (
    <div className={`d14-pan ${shown ? 'd14-pan-on' : ''}`}>
      <span className="mono d14-pan-title">{t(title)}</span>
      {lines.map((l, i) => (i === 0 || shown) && (
        <span key={i} className={`mono d14-pan-line ${i === 2 ? 'd14-pan-res' : ''} ${i > 0 ? 'lm-reveal' : ''}`}
          style={{ animationDelay: `${i * 0.2}s`, color: i === 2 ? (tone === 'a' ? '#1F7A4D' : '#C0392B') : T.ink }}>{l}</span>
      ))}
      {shown && <span className="d14-pan-cap lm-reveal" style={{ animationDelay: '0.5s' }}>{t(cap)}</span>}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div className="d14-panrow">
            {panel(c.left_title, c.left_lines, c.left_cap, step >= 1, 'a')}
            {panel(c.right_title, c.right_lines, c.right_cap, step >= 2, 'b')}
          </div>
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
          )}
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
            <FrameFx/>
            <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(13px, 1.9vw, 16px)' }}>{t(c.mc_q)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
              {orderMC.map((k, i) => (
                <button key={i} className={`option ${solved && i === mcCi ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(12px, 1.7vw, 15px)', minHeight: 'clamp(42px, 6vw, 52px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.mc_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — 5 SONIYA SOAT
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s6;
  const it0 = c.items[0];
  const items = React.useMemo(() => {
    const order = shuffleArr(it0.opts.map((_, i) => i));
    return { opts: order.map((i) => it0.opts[i]), hints: order.map((i) => it0.hints[i]), ci: order.indexOf(it0.ci) };
  }, []);
  const audio = useAudio([
    brgSeg('s6', lang),
    { id: 's6_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [clock, setClock] = useState(5);
  const [clockDone, setClockDone] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setClock((n) => {
      if (n <= 1) { clearInterval(id); setClockDone(true); return 0; }
      return n - 1;
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === items.ci || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || !clockDone || solved || wrongSet.has(i)) return;
    if (i === items.ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = items.hints[i];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: '5', studentAnswer: '5', correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)', minHeight: 'clamp(150px, 30vw, 190px)', justifyContent: 'center' }}>
          <FrameFx/>
          {!clockDone && <CountdownClock n={clock} lang={lang}/>}
          {clockDone && (
            <>
              <div className="lm-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
                {items.opts.map((o, i) => (
                  <button key={i} className={`option ${solved && i === items.ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
            </>
          )}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s7 — «QAYSI AMAL BIRINCHI?» MC x3 (variantlar — AMALLAR, javob emas)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(24px, 5.2vw, 34px)', fontWeight: 800, color: T.ink }}>{it.expr}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s8 — TEST MC x3
const Screen8 = (props) => {
  const t = useT();
  const c = CONTENT.s8;
  const heading = (it) => t(it.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(22px, 4.8vw, 32px)', fontWeight: 800, color: T.ink }}>{it.expr}</span>;
  return <MCRoundD2 props={props} ck="s8" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s9 — BONUS: USTUN (× keyin + va −) + 1 savol
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    ...c.audio[lang].map((text, i) => ({
      id: `s9_${i}`,
      text,
      trigger: i === 0 ? 'after_previous' : (i === 5 ? 'after_previous' : `on_event:step${i}`),
      waits_for: null
    }))
  ]);
  const canAct = useCanAnswer(audio);
  // 4 tap: 24×3 ustunda · 128+72 ustunda · 8×20 · 250−160 ustunda
  const { step, done: built, advance } = useTapSteps(audio, 5);
  const tapCol = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const orderMC = React.useMemo(() => shuffleArr(c.mc_opts.map((_, i) => i)), []);
  const mcCi = orderMC.indexOf(c.mc_ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === mcCi || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === mcCi) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.mc_hints[orderMC[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.mc_hints[1])[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.mc_q),
        correctAnswer: c.mc_opts[c.mc_ci][lang], studentAnswer: c.mc_opts[c.mc_ci][lang], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : (step === 2 ? c.btn3 : c.btn4));
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2.2vw, 16px)' }}>
          <FrameFx/>
          <div className="d14-colrow">
            {step >= 1 && (
              <div className="d14-colwrap lm-reveal">
                <span className="mono d14-colcap">{'24 × 3'}</span>
                <ColumnCalc sign={'×'} top={' 24'} bot={'  3'} res={' 72'} carries={[1]}/>
              </div>
            )}
            {step >= 2 && (
              <div className="d14-colwrap lm-reveal">
                <span className="mono d14-colcap">{'128 + 72'}</span>
                <ColumnCalc sign={'+'} top={'128'} bot={' 72'} res={'200'} carries={[0, 1]}/>
              </div>
            )}
            {step >= 3 && (
              <div className="d14-colwrap lm-reveal">
                <span className="mono d14-colcap">{t(c.b_title)}</span>
                <span className="mono d14-colline">{t(c.b_line)}</span>
              </div>
            )}
            {step >= 4 && (
              <div className="d14-colwrap lm-reveal">
                <span className="mono d14-colcap">{'250 − 160'}</span>
                <ColumnCalc sign={'−'} top={'250'} bot={'160'} res={' 90'} carries={[]}/>
              </div>
            )}
          </div>
          {step >= 2 && <span className="mono d14-total lm-reveal">{t(c.a_total)}</span>}
          {step >= 4 && <span className="mono d14-total lm-reveal">{t(c.b_total)}</span>}
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tapCol}
              style={{ fontSize: 'clamp(12px, 1.9vw, 15px)' }}>{t(btnLabel)}</button>
          )}
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(10px, 2.2vw, 16px)' }}>
            <FrameFx/>
            <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.8vw, 15px)' }}>{t(c.mc_q)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
              {orderMC.map((k, i) => (
                <button key={i} className={`option ${solved && i === mcCi ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(8px, 1.4vw, 11px)', fontSize: 'clamp(12px, 1.7vw, 14px)', minHeight: 'clamp(40px, 5.6vw, 50px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.mc_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR NumPad x3
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s10;
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const triedRef = useRef(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  const check = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!triedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); triedRef.current = false; setIdx((n) => n + 1); }, 1500);
    } else {
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'numpad-trainer',
        correctAnswer: String(c.items.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, c.items.length)} / {c.items.length}</div>
            <h1 className="title h-sub fade-up">{t(it.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <NumPad value={done ? String(it.ans) : val} setValue={setVal} disabled={!canAct || numLock || done} max={3}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || done || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={`${score} / ${c.items.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — MASALA: avval YOZUVNI tanlash, keyin javobni terish
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s11;
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const [pickIdx, setPickIdx] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const chosen = pickIdx === ci;
  const pick = (i) => {
    if (!canAct || chosen || wrongSet.has(i)) return;
    if (i === ci) {
      setPickIdx(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.pick_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.hints[1])[lang]); }
    }
  };
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.audio.on_wrong); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans), studentAnswer: String(c.ans), correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.1vw, 9px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', padding: 'clamp(8px, 1.8vw, 14px)' }}>
          <FrameFx/>
          <div className="d14-shelfrow">
            <div style={{ transform: 'scale(0.6)', transformOrigin: 'center', margin: 'calc(-0.21 * clamp(70px, 16vw, 120px)) 0' }}>
              <ArrayViz rows={3} cols={8}/>
            </div>
            <div className="d14-loose">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.2 + i * 0.06}s`, width: 'clamp(12px, 3.2vw, 20px)', height: 'clamp(12px, 3.2vw, 20px)', display: 'inline-flex' }}><Chiroq/></span>
              ))}
            </div>
          </div>
          {!chosen && (
            <>
              <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(c.pick_label)}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(96px, 1fr))', gap: 10, width: '100%' }}>
                {order.map((k, i) => (
                  <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2.4vw, 19px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.opts[k])}</button>
                ))}
              </div>
            </>
          )}
          {chosen && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(17px, 3.2vw, 24px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock || solved} max={3}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || solved || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
            </>
          )}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s12 — XATONI TOP
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s12;
  const items = c.items;
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [solvedRound, setSolvedRound] = useState(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  const pick = (i) => {
    if (!canAct || done || solvedRound || wrongSet.has(i)) return;
    if (i === it.wrong) {
      setSolvedRound(true); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { setSolvedRound(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1800);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'find-error',
        correctAnswer: String(items.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(14px, 2.6vw, 20px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(it.hint)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s13 — FINAL 5 savol + FactCard (freym OSTIDA, orbital anim)
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s13;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2, 3])), []);
  const audio = useAudio([
    brgSeg('s13', lang),
    { id: 's13_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[idx];
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const numTriedRef = useRef(false);
  const PASS = Math.ceil(items.length * 0.7);
  const pick = (i) => {
    if (!canAct || picked !== null || idx >= items.length || wrongSet.has(i)) return;
    const isOk = orders[idx][i] === 0;
    if (isOk) {
      setPicked(i);
      if (wrongSet.size === 0) setScore((s) => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => { setPicked(null); setWrongSet(new Set()); setHintMsg(null); setIdx((n) => n + 1); }, 1500);
    } else {
      const nw = new Set(wrongSet); nw.add(i); setWrongSet(nw);
      const hint = it[`wrong_${orders[idx][i]}`] || it.wrong_1 || c.audio.on_wrong;
      setHintMsg(hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(hint[lang]); }
    }
  };
  const checkNum = () => {
    if (!canAct || numLock || val === '' || idx >= items.length) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1700);
    }
  };
  useEffect(() => {
    if (idx >= items.length && !recorded) {
      setRecorded(true);
      const finalScore = score;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.fact_audio[lang]); }
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.intro_line),
        correctAnswer: String(items.length), studentAnswer: finalScore, correct: finalScore >= PASS,
        firstTry: finalScore >= PASS, attempts: 1, solved: finalScore >= PASS
      });
    }
  }, [idx]);
  const done = idx >= items.length;
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.intro_line)}</p>
        {!done && it && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
            <FrameFx/>
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </div>
                {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(it.hint)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                      {t(it[`opt${k}`])}
                    </button>
                  ))}
                </div>
                {hintMsg && (
                  <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>
                )}
              </>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success fade-up" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={`${score} / ${items.length}`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><SunflowerFig/></div>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s14 — YAKUN
const Screen14 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const audio = useAudio([
    { id: 's14_pay', text: S14_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's14_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.2vw, 14px)', position: 'relative' }}>
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.1 + i * 0.18}s`, display: 'inline-flex' }}>
              <svg viewBox="0 0 40 40" style={{ width: 'clamp(26px, 6vw, 34px)', height: 'auto', animation: `g1twinkle ${1.8 + i * 0.3}s ease-in-out ${0.7 + i * 0.25}s infinite` }} aria-hidden="true">
                <path d="M20 3 L25.2 14.6 L38 16 L28.5 24.6 L31.2 37 L20 30.4 L8.8 37 L11.5 24.6 L2 16 L14.8 14.6 Z" fill="#FFC23C"/>
              </svg>
            </span>
          ))}
        </div>
        <Confetti/>
        <div className="frame-success fade-up">
          <h2 className="title h-title" style={{ margin: 0, textAlign: 'center' }}>{t(c.mission_done)}</h2>
          <p className="title" style={{ margin: 'clamp(4px, 1vw, 8px) 0 0', fontSize: 'clamp(14px, 2vw, 17px)', color: '#1F7A4D', textAlign: 'center' }}>{t(c.cando)}</p>
        </div>
        <div className="d2-rulecard fade-up delay-1">
          <span className="d2-rulecard-badge mono">{lang === 'ru' ? 'Помни' : 'Yodda tut'}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 'clamp(10px, 2.4vw, 20px)', rowGap: 3 }}>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.ink2 }}>{t(c.conn_label_refs)}: {t(c.conn_refs)}</span>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.conn_label_next)}: {t(c.conn_next)}</span>
        </div>
        {/* yakuniy sahna — ETALON o'lchamida (Dars01 s14) */}
        <div className="d14-final-scene fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function OrderOpsLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'f' });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [heroMood, setHeroMood] = useState('pointing');   // personaj holati (butun urok bo'ylab bitta overlay)
  const heroCtx = React.useMemo(() => ({ setMood: setHeroMood }), []);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); setHeroMood('pointing'); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
  const scored = SCREEN_META.filter(s => s.scored);
  const finalScreens = scored.filter(s => s.scope === 'final');
  const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && SCREEN_META[i]?.scored && a.correct).length;
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
  const CurrentScreen = screens[current];

  // Ekran almashganda personajni "ko'rsatadi" (pointing) holatiga qaytaramiz;
  // javobdan keyin Reaction uni happy/encourage'ga o'zgartiradi.
  const next = () => { setHeroMood('pointing'); setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { setHeroMood('pointing'); setCurrent(s => Math.max(s - 1, 0)); };

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  const starTotal = SCREEN_META.filter((s) => s.scored).length;
  const starsEarned = answers.filter((a, i) => a && SCREEN_META[i] && SCREEN_META[i].scored && a.correct).length;

  return (
    <LangContext.Provider value={lang}>
      <ProgressContext.Provider value={{ stars: starsEarned, total: starTotal }}>
      <HeroContext.Provider value={heroCtx}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <GradientDefs/>
        <D2Defs/>
        <D2Motes/>
        <StageHero mood={heroMood}/>
        {/* v8: «UCHISHGA TAYYORLIK» shkalasi — INFRA/Stage'дан TASHQARIDA (lesson-root darajasi) */}
        <ReadinessMeter screen={current} total={TOTAL_SCREENS} lang={lang}/>
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
      </HeroContext.Provider>
      </ProgressContext.Provider>
    </LangContext.Provider>
  );
}
const STYLES = BASE_STYLES + `
.lm-mat-stack { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.lm-scene { position: relative; width: min(100%, calc(clamp(160px, calc(100dvh - 570px), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .lm-reveal, .lm-write, .lm-drop, .lm-fadein { animation: none; } }
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: 54px; align-items: center; }
.lm-digtray-empty { font-size: 22px; font-weight: 800; color: #C4BEB4; letter-spacing: 2px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; width: clamp(42px, 9vw, 56px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; cursor: pointer; box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #ff4f28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bins { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none; border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #F1EDE5; }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.lm-bin-slot { width: clamp(36px, 8vw, 50px); height: clamp(40px, 9vw, 56px); display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.d2-factcard { display: flex; flex-direction: column; gap: 6px; background: #14203C; border-radius: 14px; padding: clamp(12px, 2.4vw, 18px); }
.d2-factcard-badge { align-self: flex-start; background: rgba(255,184,77,0.2); color: #FFC23C; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-factcard-txt { margin: 0; color: #EAF0F8; font-size: clamp(14px, 1.9vw, 16px); line-height: 1.5; }
/* --- FactCard KENG tungi-bog' paneli + 3D orbita (Dars01 SymPy hisobi bayt-aniq) --- */
.d2-fact-hero { align-self: stretch; display: block; margin: 4px calc(-1 * clamp(12px, 2.4vw, 18px)) 8px; }
.d2-fact-hero .d2-factfig { display: block; width: 100%; }
.d2-fact-hero .d2-factfig svg { display: block; width: 100%; height: auto; border-radius: 14px; box-shadow: 0 8px 22px -8px rgba(5,10,25,0.6); }
.lumo-orbit-front, .lumo-orbit-back { transform-box: view-box; transform-origin: 170px 78px; animation: 13s linear infinite; }
.lumo-orbit-front { animation-name: lumoOrbitFront; }
.lumo-orbit-back { animation-name: lumoOrbitBack; }
.rd-glow { transform-box: view-box; transform-origin: 170px 78px; animation: rdPulse 3.8s ease-in-out infinite; }
.star-tw { animation: starTw 2.8s ease-in-out infinite; }
.comet { transform-box: view-box; animation: cometDrift 10s linear infinite; }
.heat-wave { animation: starTw 2.2s ease-in-out infinite; }
.bulb-rays { animation: rayPulse 3.8s ease-in-out infinite; }
@keyframes rayPulse { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.5; } }
@keyframes starTw { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes cometDrift { 0% { transform: translate(30px,116px); opacity: 0; } 6% { opacity: 0.85; } 32% { opacity: 0.85; } 46% { transform: translate(250px,20px); opacity: 0; } 100% { transform: translate(250px,20px); opacity: 0; } }
@keyframes rdPulse { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
@keyframes lumoOrbitFront {
  0% { transform: translate(74px,0px) scale(1); opacity: 1; }
  8.33% { transform: translate(64.09px,-20.69px) scale(1.22); opacity: 1; }
  16.67% { transform: translate(37px,-35.84px) scale(1.455); opacity: 1; }
  25% { transform: translate(0px,-41.38px) scale(1.565); opacity: 1; }
  33.33% { transform: translate(-37px,-35.84px) scale(1.455); opacity: 1; }
  41.67% { transform: translate(-64.09px,-20.69px) scale(1.22); opacity: 1; }
  50% { transform: translate(-74px,0px) scale(1); opacity: 1; }
  58.33% { transform: translate(-64.09px,20.69px) scale(0.847); opacity: 0; }
  66.67% { transform: translate(-37px,35.84px) scale(0.762); opacity: 0; }
  75% { transform: translate(0px,41.38px) scale(0.735); opacity: 0; }
  83.33% { transform: translate(37px,35.84px) scale(0.762); opacity: 0; }
  91.67% { transform: translate(64.09px,20.69px) scale(0.847); opacity: 0; }
  100% { transform: translate(74px,0px) scale(1); opacity: 1; }
}
@keyframes lumoOrbitBack {
  0% { transform: translate(74px,0px) scale(1); opacity: 0; }
  8.33% { transform: translate(64.09px,-20.69px) scale(1.22); opacity: 0; }
  16.67% { transform: translate(37px,-35.84px) scale(1.455); opacity: 0; }
  25% { transform: translate(0px,-41.38px) scale(1.565); opacity: 0; }
  33.33% { transform: translate(-37px,-35.84px) scale(1.455); opacity: 0; }
  41.67% { transform: translate(-64.09px,-20.69px) scale(1.22); opacity: 0; }
  50% { transform: translate(-74px,0px) scale(1); opacity: 0; }
  58.33% { transform: translate(-64.09px,20.69px) scale(0.847); opacity: 1; }
  66.67% { transform: translate(-37px,35.84px) scale(0.762); opacity: 1; }
  75% { transform: translate(0px,41.38px) scale(0.735); opacity: 1; }
  83.33% { transform: translate(37px,35.84px) scale(0.762); opacity: 1; }
  91.67% { transform: translate(64.09px,20.69px) scale(0.847); opacity: 1; }
  100% { transform: translate(74px,0px) scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .lumo-orbit-front, .lumo-orbit-back, .rd-glow, .star-tw, .comet, .heat-wave, .bulb-rays { animation: none; } .lumo-orbit-back, .comet { opacity: 0; } .bulb-rays { opacity: 0.35; } }
/* === DARS11: RazryadShift taxtasi === */
.rz-wrap { display: flex; flex-direction: column; gap: 6px; width: min(340px, 92%); }
.rz-heads { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.rz-board { position: relative; height: clamp(56px, 12vw, 72px); }
.rz-cell { position: absolute; top: 0; bottom: 0; width: calc(100% / 3 - 6px); margin: 0 3px; background: #FBF7F0; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(58, 53, 48, 0.08); }
.rz-chip { position: absolute; top: 0; bottom: 0; width: calc(100% / 3); display: flex; align-items: center; justify-content: center; font-size: clamp(26px, 6vw, 38px); font-weight: 800; color: #3A3530; transition: left 0.9s ease, opacity 0.6s ease; }
/* saralash kartasi: to'g'ri savatga "uchib ketadi" */
.rz-fly { animation: rz-fly-a 1s ease forwards; }
@keyframes rz-fly-a { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0.55); opacity: 0; } }
/* zanjir tuguni yonishi */
.rz-node-on { animation: rz-node-a 0.5s ease; }
@keyframes rz-node-a { 0% { transform: scale(0.7); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
/* 5 soniyalik soat (Dars01 naqshi) */
.lm-clock { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.lm-clock-cap { font-size: clamp(13px, 1.9vw, 16px); font-weight: 800; color: #017BA3; }
@media (prefers-reduced-motion: reduce) { .rz-chip { transition: none; } .rz-fly, .rz-node-on, .lm-reveal { animation: none; } }
/* === DARS12: YO'LAKLAR va KESISH (SplitArray) ===
   Metodist: yo'lak HAQIQIY ko'rinsin. Shuning uchun yo'laklar TUPROQ maydonida yotadi,
   chekkalarida o't tutamlari, har yo'lak oxirida uycha. */
.d12-ground { position: relative; width: 100%; max-width: 470px; padding: clamp(12px, 2.6vw, 18px) clamp(8px, 1.8vw, 14px); border-radius: 16px;
  background: radial-gradient(120% 90% at 50% 0%, #24402C 0%, #1A3021 55%, #12241A 100%); box-shadow: inset 0 0 0 1.5px rgba(20,40,24,0.9), inset 0 8px 18px -10px rgba(0,0,0,0.6); overflow: hidden; }
/* tuproq donadorligi */
.d12-ground::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image: radial-gradient(#3E5A44 0.6px, transparent 0.7px), radial-gradient(#2C4433 0.5px, transparent 0.6px);
  background-size: 13px 11px, 9px 15px; background-position: 0 0, 5px 7px; }
/* o't tutamlari chekkalarda */
.d12-grass { position: absolute; left: 0; right: 0; height: clamp(9px, 2vw, 13px); pointer-events: none; }
.d12-grass-top { top: 2px; }
.d12-grass-bot { bottom: 2px; transform: scaleY(-1); }
.d12-grass i { position: absolute; bottom: 0; width: 2px; height: 100%; border-radius: 2px 2px 0 0; background: linear-gradient(180deg, #4E8A5A 0%, #2E5A38 100%); transform-origin: bottom center; animation: d12-sway 3.4s ease-in-out infinite; }
@keyframes d12-sway { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.d12-field { position: relative; z-index: 1; display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d12-hut { flex: 0 0 auto; width: clamp(18px, 4.2vw, 26px); margin-left: clamp(4px, 1.2vw, 8px); }
/* xuk ekranidagi bitta namuna yo'lak — pastroq maydon */
.d12-sample-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
.d12-sample-cap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 22ch; line-height: 1.35; }
.d12-ground-sample { max-width: 290px; padding: clamp(7px, 1.6vw, 11px) clamp(7px, 1.6vw, 10px); }
/* SAHNA KECHQURUN: syujet «bog' qorong'i» — tungi qatlam (SVG o'zi o'zgarmaydi) */
/* tungi qatlam AYNAN sahna ichida (freym chetlariga chiqmaydi): .lm-scene overflow hidden */
.d12-night .lm-scene { filter: brightness(0.64) saturate(0.88); }
.d12-night .lm-scene::after { content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: linear-gradient(180deg, rgba(24,34,86,0.42) 0%, rgba(12,18,48,0.5) 100%); }
.d12-row { position: relative; display: flex; align-items: center; gap: clamp(3px, 0.8vw, 6px); }
/* nurlarning YERGA tushgan yorug'i — yo'lak «porlab turgani» shundan ko'rinadi */
.d12-row::before { content: ''; position: absolute; left: -8px; right: -8px; top: -5px; bottom: -5px; border-radius: 14px; pointer-events: none;
  background: radial-gradient(58% 130% at 42% 50%, rgba(255,214,140,0.20) 0%, rgba(255,214,140,0.07) 45%, rgba(255,214,140,0) 72%); }
.d12-plitas { display: flex; gap: clamp(3px, 0.8vw, 6px); flex: 0 0 auto; }
.d12-plitas .d12-plita { width: clamp(58px, 14vw, 82px); }
.d12-toshchas { display: flex; gap: clamp(3px, 0.8vw, 6px); flex: 0 0 auto; }
.d12-toshchas .d12-toshcha { width: clamp(14px, 3.4vw, 20px); }
.d12-plita, .d12-toshcha { display: inline-block; transition: opacity 0.45s; }
/* kesish chizig'i: yorug' vertikal ajratgich */
.d12-cut { flex: 0 0 auto; width: 3px; align-self: stretch; min-height: clamp(14px, 3.4vw, 20px); border-radius: 2px; background: linear-gradient(180deg, rgba(127,224,216,0) 0%, #7FE0D8 22%, #FFF6DC 50%, #7FE0D8 78%, rgba(127,224,216,0) 100%); box-shadow: 0 0 8px 1px rgba(127,224,216,0.75); animation: d12-cut-in 0.5s ease; }
@keyframes d12-cut-in { 0% { opacity: 0; transform: scaleY(0.2); } 100% { opacity: 1; transform: none; } }
.d12-row-split { gap: clamp(6px, 1.6vw, 12px); }
/* yorliqlar guruhlar USTIDA turadi: chapdagi plitalar ustida, o'ngdagi toshchalar ustida
   (satr bilan bir xil o'lchamlar: 2 plita + oraliq, keyin kesish chizig'i) */
.d12-labels { display: flex; align-items: flex-end; gap: clamp(6px, 1.6vw, 12px); font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
/* yorliqlar TUPROQ (to'q) fonida — yorug' ranglar */
.d12-label-l { width: calc(2 * clamp(58px, 14vw, 82px) + clamp(3px, 0.8vw, 6px)); text-align: center; color: #8FE8B4; }
.d12-label-r { width: calc(3 * clamp(14px, 3.4vw, 20px) + 2 * clamp(3px, 0.8vw, 6px) + 3px); text-align: center; color: #8FD8F0; }
.d12-spark { animation: d12-spark-a 3s ease-in-out infinite; }
@keyframes d12-spark-a { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
/* s1: ochiladigan ikki karta */
.d12-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-height: clamp(74px, 16vw, 96px); padding: clamp(10px, 2vw, 14px); border: none; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1.5px rgba(58,53,48,0.09); cursor: pointer; transition: background 0.35s, box-shadow 0.35s, transform 0.15s; }
.d12-card:disabled { cursor: default; }
.d12-card:not(:disabled):active { transform: scale(0.97); }
.d12-card-on { background: #E3F0E8; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.35); }
/* === DARS12: USTUN (stolbik) demo === */
.d12-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 14px; padding: clamp(10px, 2vw, 16px) clamp(14px, 3vw, 22px); box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.18); }
/* ustun satrlari — 5-sinf naqshi: monoshrift, O'NGGA tekislangan, kenglik ch birligida,
   shuning uchun raqamlar xonalar bo'yicha aniq ustun-ustun tushadi va belgi
   ko'paytuvchining chap yonida turadi (kitobdagi joylashuv). */
.d12-colr { white-space: pre; text-align: right; min-width: 3ch; font-size: clamp(21px, 4.4vw, 30px); line-height: 1.42; font-weight: 800; color: #3A3530; }
/* ko'chirilgan o'nlik AYNAN o'nliklar ustuni ustida: satr 3 ustun, o'nlik — o'rtasi (50%) */
.d12-colr-carry { position: relative; width: 3ch; height: clamp(13px, 2.4vw, 17px); font-size: clamp(21px, 4.4vw, 30px); }
.d12-carry { position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: clamp(11px, 2vw, 14px); line-height: 1; font-weight: 800; color: #FF4F28; }
.d12-col-sign { color: #8A8378; }
.d12-col-hot { color: #1F7A4D; }
.d12-col-rule { height: 2.5px; width: 3ch; font-size: clamp(21px, 4.4vw, 30px); background: #3A3530; border-radius: 2px; margin: 4px 0; }
.d12-col-total { align-self: center; font-size: clamp(15px, 2.8vw, 20px); font-weight: 800; color: #FF4F28; margin-top: 8px; white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { .d12-spark, .d12-cut { animation: none; } }
/* past ekranlarda (768px) fakt rasmi va masala sahnasi ixchamlashadi — skrollsiz qoladi */
@media (max-height: 820px) {
  .d2-fact-hero .d2-factfig svg { max-width: 268px; margin-inline: auto; }
  .d14-shelfrow { gap: clamp(4px, 1.2vw, 10px); }
  .d14-loose span { width: clamp(10px, 2.6vw, 15px) !important; height: clamp(10px, 2.6vw, 15px) !important; }
}
/* xuk ekrani (s0): sahna ham ETALON o'lchamida (Dars01 s0 = 629x330) */
.d14-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
/* yakuniy ekran (s14): sahna ETALON o'lchamida — Dars01 dagi 570px budjet */
.d13-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* === DARS13: TOSH SANDIQ va TARQATISH (ShareOut) === */
.d13-box { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 7px); padding: clamp(8px, 1.8vw, 13px) clamp(9px, 2vw, 14px);
  border-radius: 12px; background: linear-gradient(180deg, #6B5540 0%, #4E3E2E 100%); box-shadow: inset 0 0 0 2px #7E6A52, inset 0 6px 14px -8px rgba(0,0,0,0.55); }
.d13-box-plitas { display: grid; grid-template-columns: repeat(3, auto); gap: clamp(3px, 0.8vw, 6px); }
.d13-box-plitas .d12-plita { width: clamp(44px, 10vw, 62px); }
.d13-box-toshchas { display: flex; gap: clamp(3px, 0.8vw, 6px); justify-content: center; }
.d13-box-toshchas .d12-toshcha { width: clamp(13px, 3vw, 18px); }
/* xuk ekranida sandiq + izoh yonma-yon */
.d13-boxrow { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
/* xuk panelida sandiq IXCHAM: balandlik tejaladi, skroll chiqmaydi */
.d13-boxrow .d13-box { padding: clamp(6px, 1.4vw, 9px) clamp(7px, 1.6vw, 10px); gap: clamp(3px, 0.7vw, 5px); }
.d13-boxrow .d13-box-plitas { gap: clamp(2px, 0.6vw, 4px); }
.d13-boxrow .d13-box-plitas .d12-plita { width: clamp(34px, 7.6vw, 46px); }
.d13-boxrow .d13-box-toshchas .d12-toshcha { width: clamp(10px, 2.3vw, 14px); }
.d13-boxcap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 16ch; line-height: 1.35; }
/* tarqatish: sandiq -> uch yo'lak */
.d13-share { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d13-share-src { display: flex; justify-content: center; }
.d13-share-dst { max-width: 470px; }
/* bo'sh o'rin (tarqatishdan oldin) — chiziqli kontur */
.d13-slot { display: inline-block; width: clamp(58px, 14vw, 82px); height: clamp(14px, 3.2vw, 20px); border-radius: 4px; border: 1.5px dashed rgba(160,190,170,0.45); }
.d13-slot-sm { width: clamp(14px, 3.4vw, 20px); border-radius: 50%; }
/* yo'lak yorlig'i (30 -> 32) */
.d13-tag { margin-left: clamp(4px, 1.2vw, 8px); font-size: clamp(11px, 1.9vw, 15px); font-weight: 800; color: #8FE8B4; background: rgba(31,122,77,0.28); border-radius: 999px; padding: 1px 8px; }
.d13-tag-full { color: #FFE6A6; background: rgba(255,184,77,0.24); }
.d13-note { font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; color: #5A5A60; }
/* burchak usuli (ugolok) — 5-sinf DivBoard naqshi */
.d13-div { padding: clamp(4px, 1.2vw, 8px) clamp(6px, 1.6vw, 10px); background: #FFF8EF; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.16); }
/* === DARS14: BUYURTMA TAXTASI va SAVATLAR === */
.d14-hookrow { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 26px); flex-wrap: wrap; }
.d14-baskets { display: flex; align-items: flex-end; gap: clamp(8px, 2.2vw, 20px); }
.d14-board { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: 2px;
  padding: clamp(8px, 1.8vw, 13px) clamp(14px, 3.2vw, 26px); border-radius: 10px;
  background: linear-gradient(180deg, #C89A62 0%, #A2764A 100%); box-shadow: inset 0 0 0 2px #7E5A2C, 0 6px 14px -8px rgba(58,53,48,0.45); }
.d14-board-hot { box-shadow: inset 0 0 0 2px #7E5A2C, 0 0 0 3px rgba(255,79,40,0.28), 0 6px 14px -8px rgba(58,53,48,0.45); }
.d14-board-expr { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #FFF6E4; letter-spacing: 1px; }
.d14-board-cap { font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; color: #F3DEC0; text-transform: uppercase; letter-spacing: 0.5px; }
.d14-board-nail { position: absolute; top: 5px; width: 4px; height: 4px; border-radius: 50%; background: #6B4A22; }
.d14-basket { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.d14-basket-num { font-size: clamp(14px, 2.3vw, 18px); font-weight: 800; color: #FF4F28; }
.d14-basket-cap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; }
/* === DARS14: IFODA SVYORTKASI === */
.d14-expr { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 11px); flex-wrap: wrap; min-height: clamp(38px, 8vw, 54px); }
.d14-tok { font-size: clamp(24px, 5.2vw, 36px); font-weight: 800; color: #3A3530; padding: 2px 6px; border-radius: 8px; transition: background 0.25s ease, color 0.25s ease; }
.d14-tok-hot { background: rgba(255,79,40,0.16); color: #FF4F28; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.45); }
.d14-tok-fresh { background: rgba(31,122,77,0.14); color: #1F7A4D; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.4); }
.d14-tok-big { font-size: clamp(30px, 6.6vw, 46px); color: #1F7A4D; }
/* === DARS14: QOIDA uch satr === */
.d14-rulelines { display: flex; flex-direction: column; gap: 3px; }
.d14-ruleline { font-size: clamp(13px, 1.9vw, 16px); font-weight: 700; color: #3A3530; line-height: 1.35; }
.d14-ruleex { margin-top: 3px; font-size: clamp(14px, 2.4vw, 19px); font-weight: 800; color: #FF4F28; }
/* === DARS14: QAVS panellari === */
.d14-panrow { display: flex; align-items: stretch; justify-content: center; gap: clamp(8px, 2.2vw, 18px); flex-wrap: wrap; width: 100%; }
.d14-pan { flex: 1 1 130px; max-width: 220px; display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: clamp(8px, 1.8vw, 13px) clamp(6px, 1.4vw, 12px); border-radius: 12px; background: #FFF8EF; box-shadow: inset 0 0 0 1.5px rgba(58,53,48,0.1); }
.d14-pan-on { box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.28); }
.d14-pan-title { font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.5px; }
.d14-pan-line { font-size: clamp(15px, 2.8vw, 21px); font-weight: 800; }
.d14-pan-res { font-size: clamp(19px, 3.8vw, 27px); }
.d14-pan-cap { font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; color: #5A5A60; }
/* === DARS14: USTUN (stolbik) — 5-sinf naqshi ===
   Har satr: BELGI sloti (2 monoshrift belgisi) + TANA. Ikkisi bir shriftda, shuning uchun
   xonalar aniq ustun-ustun tushadi, belgi esa pastdagi sonning chap yonida turadi. */
.d14-colrow { display: flex; align-items: flex-end; justify-content: center; gap: clamp(6px, 1.6vw, 14px); flex-wrap: wrap; }
.d14-colwrap { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.d14-colcap { font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; color: #8A8378; letter-spacing: 0.5px; }
.d14-colline { padding: clamp(8px, 1.8vw, 14px) clamp(10px, 2.2vw, 16px); border-radius: 12px; background: #FFF8EF;
  box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.18); font-size: clamp(15px, 2.8vw, 21px); font-weight: 800; color: #3A3530; }
.d14-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 12px;
  padding: clamp(7px, 1.6vw, 12px) clamp(10px, 2.2vw, 15px); box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.18); }
.d14-colr { white-space: pre; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px);
  line-height: 1.3; font-weight: 800; color: #3A3530; }
.d14-col-slot { color: #8A8378; }
.d14-col-sign { color: #8A8378; }
.d14-col-hot { color: #1F7A4D; }
.d14-colr-carry { position: relative; height: clamp(11px, 2.1vw, 15px); font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }
.d14-carry { position: absolute; top: 0; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 1.8vw, 13px); line-height: 1; font-weight: 800; color: #FF4F28; }
.d14-col-rule { height: 2.3px; background: #3A3530; border-radius: 2px; margin: 3px 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }
.d14-total { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #FF4F28; }
/* === DARS14: masala sahnasi (uch tokcha + yerdagi lampalar) === */
.d14-shelfrow { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.8vw, 16px); flex-wrap: wrap; }
.d14-loose { display: flex; gap: clamp(3px, 0.9vw, 6px); align-items: flex-end; }
/* yakuniy ekran (s14): sahna ETALON o'lchamida (Dars01 s14) */
.d14-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
`;
