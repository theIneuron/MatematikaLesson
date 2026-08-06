import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars23 — "Ikki amalli masalalar" (num-3-23) | Б3 «USTAXONA» YAKUNI
// Syujet: «jo'natish stoli» (SYUJET_3SINF.md 165-satr). Hosil terildi, endi uni
//   yashiklarga joylab jo'natish kerak: bo'limning hamma amali bitta masalada uchrashadi.
// SAHNA: blokka bitta fon (17-darsning ustaxonasi), ishchi tugun BOSHQA: JO'NATISH STOLI —
//   palletdagi to'la yashiklar va yonida sig'magan qoldiq.
// MEXANIKA (yangi mexanika YARATILMAGAN): MC xuk, TAP bilan ochilish, yashik modeli,
//   savol-oldin-qoida, xatoni top (ikki marta), tokchaga saralash (savol turi bo'yicha),
//   konsol uch katak, bitta savolli NumPad ikki marta, Bit tuzog'i, masala jadval bilan,
//   final panel + FactCard.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019):
//   31-bet 7-masala DOSLOVEN — Botir 45 kg, Sardor 54 kg, yashiklar 8 kg dan, savol
//   «necha kilogramm ortib qoladi» (javob QOLDIQ, bo'linma emas);
//   26-bet 5-masala — 91 kitobdan 27 tasi tarqatildi, qolgani 4 bog'lam;
//   26-bet 3-masala — 48 pomidor 3 bankaga, 5 ta shunday bankaga nechta kerak;
//   28-bet 3-masala — 96 kitob, bog'lamda 16 tadan.
// MUHIM: karkasda 111-bet «Tarkibli masalalar» ko'rsatilgan edi, lekin u yerdagi sonlar
//   to'rt xonali (1560, 3422) — Б3 doirasidan tashqarida. Shuning uchun masalalar
//   bo'limning O'Z betlaridan (25-31) olindi, tuzilma esa tarkibli masala tuzilmasi.
// YADRO: 45 + 54 = 99, 99 : 8 = 12 (3 qold.). Bitta hisob, ikki xil javob: bo'linma
//   yashiklarni sanaydi, qoldiq esa sig'maganini.
// Misconception: M1 qoldiq o'rniga bo'linmani javob qilish; M2 qo'shishdan oldin bo'lish;
//   M3 qoldiqni «nechta yashik» degan savolga javob qilish; M4 birinchi qadamda to'xtash.
// FactCard: ikki amalli masala bitta satrda yoziladi, qavs navbatni ko'rsatadi —
//   (45 + 54) : 8, qavssiz avval 54 bo'linib ketardi.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 23». Karkas: BLOK_B3_KARKAS.md.
//
// FREE_NAV kitdan keladi (hozircha true).
// ============================================================================
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
  lessonId: 'num-3-23',
  lessonTitle: { ru: 'Урок 23. Задачи в два действия', uz: "23-dars. Ikki amalli masalalar" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 23»): s0 xuk 45+54 va 8 kg dan · s1 yechim ikki qadamda ·
// s2 yashiklar modeli (12 to'la va 3 kg ortiqcha) · s3 savol-oldin-QOIDA · s4 xatoni top
// (javob bo'linma bilan berilgan) · s5 saralash savol turi bo'yicha · s6 test qaysi yozuv
// mos · s7 konsol (91 − 27) : 4 · s8 xatoni top (ikkinchi amal noto'g'ri) · s9 Bit tuzog'i
// (qoldiq yana bitta yashik talab qiladi) · s10 trenajyor 48 : 3 va 16 · 5 · s11 trenajyor
// 96 : 16 · s12 masala (56 : 4 va 14 · 7) · s13 final 3 masala + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
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
  // s0 — XUK: darslik 31-bet 7-masala. Javob QOLDIQ, bo'linma emas.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Задачи в два действия', uz: "Ikki amalli masalalar" },
    lead: { ru: 'Ботир собрал 45 кг помидоров, Сардор 54 кг', uz: "Botir 45 kg, Sardor esa 54 kg pomidor terib oldi" },
    order_cap: { ru: 'раскладывают в ящики по 8 кг', uz: "pomidorlar 8 kg dan yashiklarga joylanadi" },
    q: { ru: 'Сколько килограммов помидоров останется?', uz: "Necha kilogramm pomidor ortib qoladi?" },
    opt0: { ru: '3 кг', uz: '3 kg' },
    opt1: { ru: '12 кг', uz: '12 kg' },
    opt2: { ru: '99 кг', uz: '99 kg' },
    opt3: { ru: '8 кг', uz: '8 kg' },
    audio: {
      intro: {
        ru: [
          'Весь блок ты считал. Сегодня научишься выбирать, что именно считать.',
          'Ботир собрал сорок пять килограммов помидоров, Сардор пятьдесят четыре.',
          'Помидоры раскладывают в ящики, в каждый по восемь килограммов.',
          'Как думаешь, сколько килограммов останется?'
        ],
        uz: [
          "Butun bo'lim davomida siz hisobladingiz. Bugun nimani hisoblash kerakligini tanlashni o'rganasiz.",
          "Botir qirq besh kilogramm, Sardor esa ellik to'rt kilogramm pomidor terib oldi.",
          "Pomidorlar yashiklarga joylanadi, har biriga sakkiz kilogrammdan.",
          "Sizningcha, necha kilogramm ortib qoladi?"
        ]
      },
      on_correct: { ru: 'Верно! А сейчас увидишь, откуда взялись эти три килограмма.', uz: "To'g'ri! Endi bu uch kilogramm qayerdan chiqqanini ko'rasiz." },
      on_wrong1: { ru: 'Двенадцать это ящики, а спрашивают про килограммы. Смотри, о чём вопрос.', uz: "O'n ikki bu yashiklar soni, savol esa kilogramm haqida. Savolga e'tibor bering." },
      on_wrong2: { ru: 'Девяносто девять это весь урожай. Его ещё надо разложить по ящикам.', uz: "To'qson to'qqiz bu butun hosil. Uni hali yashiklarga joylash kerak." },
      on_idk: { ru: 'Ничего. Сначала соберём урожай вместе, потом разложим по ящикам.', uz: "Hechqisi yo'q. Avval hosilni birga yig'amiz, keyin yashiklarga joylaymiz." }
    }
  },

  // s1 — IKKI QADAM: yechim zanjiri (darslik 31-bet 7-masala).
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'В задаче два действия, и порядок у них жёсткий', uz: "Masalada ikki amal bor, tartibi esa qat'iy" },
    task_line: '45 кг и 54 кг, ящики по 8 кг',
    task_line_uz: "45 kg va 54 kg, yashiklar 8 kg dan",
    step1: '45 + 54 = 99',
    step1_cap: { ru: 'сначала весь урожай вместе', uz: "avval butun hosil birga" },
    step2: '99 : 8 = 12 (ост. 3)',
    step2_cap: { ru: 'потом раскладываем по ящикам', uz: "keyin yashiklarga joylaymiz" },
    res: 'осталось 3 кг',
    btn1: { ru: 'Собрать вместе', uz: "Birga yig'ish" },
    btn2: { ru: 'Разложить по ящикам', uz: 'Yashiklarga joylash' },
    done_text: { ru: 'Два действия, и только второе отвечает на вопрос', uz: "Ikki amal, savolga esa faqat ikkinchisi javob beradi" },
    audio: {
      ru: [
        'Разберём задачу по шагам.',
        'Сначала складываем. Сорок пять и пятьдесят четыре, получается девяносто девять килограммов.',
        'Теперь делим на восемь. Выходит двенадцать ящиков и три килограмма сверху. Спрашивали про килограммы, значит ответ три.'
      ],
      uz: [
        "Masalani qadamma-qadam ko'rib chiqamiz.",
        "Avval qo'shamiz. Qirq besh va ellik to'rt, to'qson to'qqiz kilogramm bo'ladi.",
        "Endi sakkizga bo'lamiz. O'n ikkita yashik va uch kilogramm ortiqcha chiqadi. Kilogramm so'ralgan edi, demak javob uch."
      ]
    }
  },

  // s2 — YASHIKLAR: 12 to'la yashik va 3 kg ortiqcha KO'RINADI.
  s2: {
    eyebrow: { ru: 'Модель', uz: 'Model' },
    lead: { ru: 'Одно деление, а ответов в нём два', uz: "Bitta bo'lish, javob esa ikkita" },
    total: 99,
    per: 8,
    full: 12,
    rest: 3,
    capA: { ru: '12 полных ящиков', uz: "12 ta to'la yashik" },
    capB: { ru: '3 кг не вошли', uz: "3 kg sig'madi" },
    res: '99 : 8 = 12 (ост. 3)',
    btn1: { ru: 'Наполнить ящики', uz: "Yashiklarni to'ldirish" },
    btn2: { ru: 'Показать остаток', uz: "Qoldiqni ko'rsatish" },
    done_text: { ru: 'Частное это ящики, остаток это килограммы', uz: "Bo'linma bu yashiklar, qoldiq bu kilogrammlar" },
    audio: {
      ru: [
        'Посмотри на ящики.',
        'Двенадцать ящиков наполнились доверху. Это частное.',
        'А три килограмма остались рядом, на целый ящик их не хватило. Это остаток. Один счёт, а ответа в нём два.'
      ],
      uz: [
        "Yashiklarga qarang.",
        "O'n ikkita yashik to'la to'ldi. Bu bo'linma.",
        "Uch kilogramm esa yonida qoldi, butun yashikka yetmadi. Bu qoldiq. Bitta hisob, javob esa ikkita."
      ]
    }
  },

  // s3 — SAVOL-OLDIN-QOIDA: nima so'ralgan, o'shani javob qilamiz.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Спросили: сколько ящиков заполнилось. Что берём в ответ?', uz: "So'ralgan savol: nechta yashik to'ldi. Javobga nimani olamiz?" },
    opts: [
      { ru: 'частное', uz: "bo'linmani" },
      { ru: 'остаток', uz: 'qoldiqni' },
      { ru: 'делимое', uz: "bo'linuvchini" },
      { ru: 'сумму', uz: "yig'indini" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Остаток это то, что не вошло. Ящики считает частное.', uz: "Qoldiq bu sig'magani. Yashiklarni bo'linma sanaydi." },
      2: { ru: 'Делимое это весь урожай, девяносто девять. Ящиков столько быть не может.', uz: "Bo'linuvchi bu butun hosil, to'qson to'qqiz. Yashiklar shuncha bo'la olmaydi." },
      3: { ru: 'Сумма была на первом шаге. Вопрос про второй.', uz: "Yig'indi birinchi qadamda edi. Savol ikkinchisi haqida." }
    },
    on_correct: { ru: 'Да. Вопрос выбирает, какое из двух чисел ответ.', uz: "Ha. Savol ikki sondan qaysi biri javob ekanini tanlaydi." },
    rule_lines: {
      ru: ['В задаче в два действия сначала находим то, что можно найти сразу.', 'Потом смотрим на вопрос: он выбирает, частное это или остаток.'],
      uz: ["Ikki amalli masalada avval darrov topiladiganini topamiz.", "Keyin savolga qaraymiz: u bo'linmami yoki qoldiqmi, o'zi tanlaydi."]
    },
    rule_ex: '99 : 8 = 12 (ост. 3)',
    rule_speech: { ru: 'девяносто девять разделить на восемь, двенадцать и три в остатке', uz: "to'qson to'qqizni sakkizga bo'lsak, o'n ikki va uch qoldiq" },
    audio: {
      intro: {
        ru: 'Прежде чем считать, надо решить, что именно ищем. Спросили, сколько ящиков заполнилось. Что берём в ответ?',
        uz: "Hisoblashdan oldin nimani qidirayotganimizni hal qilish kerak. Nechta yashik to'ldi deb so'raldi. Javobga nimani olamiz?"
      }
    }
  },

  // s4 — XATONI TOP: javob bo'linma bilan berilgan, savol esa kilogramm haqida (M1).
  s4: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Спрашивали, сколько килограммов осталось. В чём ошибка?', uz: "Necha kilogramm qolgani so'ralgan edi. Xato nimada?" },
    fig_line: '45 + 54 = 99, 99 : 8 = 12, ответ 12 кг',
    opts: [
      { ru: 'в ответ взяли ящики, а не килограммы', uz: "javobga kilogramm emas, yashik olingan" },
      { ru: 'сложили неверно', uz: "noto'g'ri qo'shilgan" },
      { ru: 'надо было делить на 12', uz: "12 ga bo'lish kerak edi" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сорок пять и пятьдесят четыре это девяносто девять. Здесь всё верно.', uz: "Qirq besh va ellik to'rt bu to'qson to'qqiz. Bu yeri to'g'ri." },
      2: { ru: 'Двенадцать это результат, а не делитель. Делили на восемь.', uz: "O'n ikki bu natija, bo'luvchi emas. Sakkizga bo'lingan." },
      3: { ru: 'Ошибка есть. Ответ записан в ящиках, а спрашивали килограммы.', uz: "Xato bor. Javob yashikda yozilgan, so'ralgani esa kilogramm." }
    },
    audio: {
      intro: { ru: 'Здесь посчитали правильно, а ответ записали не тот. Найди ошибку.', uz: "Bu yerda to'g'ri hisoblangan, javob esa boshqa yozilgan. Xatoni toping." },
      on_correct: { ru: 'Точно. Счёт верный, а ответ не на тот вопрос. Остаток три килограмма.', uz: "Aniq. Hisob to'g'ri, javob esa boshqa savolga. Qoldiq uch kilogramm." },
      on_wrong: { ru: 'Проверь не счёт, а последнюю строку. О чём спрашивали.', uz: "Hisobni emas, oxirgi satrni tekshiring. Nima so'ralgan edi." }
    }
  },

  // s5 — SARALASH: savol nimani so'rayapti, bo'linmanimi yoki qoldiqnimi.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи вопросы: где ответ частное, а где остаток', uz: "Savollarni ajrating: qayerda javob bo'linma, qayerda qoldiq" },
    bin_a: { ru: 'ответ частное', uz: "javob bo'linma" },
    bin_b: { ru: 'ответ остаток', uz: 'javob qoldiq' },
    items: [
      { n: { ru: 'сколько ящиков', uz: 'nechta yashik' }, a: true, hint: { ru: 'Ящики считает частное.', uz: "Yashiklarni bo'linma sanaydi." } },
      { n: { ru: 'сколько кг не вошло', uz: "necha kg sig'madi" }, a: false, hint: { ru: 'Не вошло это остаток.', uz: "Sig'magani bu qoldiq." } },
      { n: { ru: 'по сколько в коробке', uz: 'qutida nechtadan' }, a: true, hint: { ru: 'Поровну в каждой это частное.', uz: "Har birida tengdan bu bo'linma." } },
      { n: { ru: 'сколько лишних', uz: 'nechtasi ortiqcha' }, a: false, hint: { ru: 'Лишние это то, что не поместилось.', uz: "Ortiqcha bu sig'may qolgani." } }
    ],
    audio: {
      intro: { ru: 'Четыре вопроса. Отправь каждый на свою полку, по тому, что он спрашивает.', uz: "To'rtta savol. Har birini nimani so'rashiga qarab o'z tokchasiga yuboring." },
      on_correct: { ru: 'Все на месте. Теперь ты слышишь вопрос до того, как начал считать.', uz: "Hammasi joyida. Endi siz hisobdan oldin savolni eshitasiz." },
      on_wrong: { ru: 'Спроси себя. Это про то, что раздали, или про то, что осталось.', uz: "O'zingizdan so'rang. Bu tarqatilgani haqidami yoki qolgani haqidami." }
    }
  },

  // s6 — TEST: masalaga qaysi yozuv mos keladi (darslik 26-bet 5-masala).
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Из 91 книги раздали 27, остальные связали по 4. Какая запись подходит?', uz: "91 ta kitobdan 27 tasi tarqatildi, qolgani 4 tadan bog'landi. Qaysi yozuv mos keladi?" },
    opts: [
      { ru: '(91 − 27) : 4', uz: '(91 − 27) : 4' },
      { ru: '91 − 27 : 4', uz: '91 − 27 : 4' },
      { ru: '91 : 4 − 27', uz: '91 : 4 − 27' },
      { ru: '(91 + 27) : 4', uz: '(91 + 27) : 4' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Без скобок сначала разделится двадцать семь. А делить надо остаток книг.', uz: "Qavssiz avval yigirma yetti bo'linadi. Bo'lish kerak bo'lgani esa qolgan kitoblar." },
      2: { ru: 'Здесь делят все девяносто одну книгу, включая розданные.', uz: "Bu yerda to'qson bitta kitobning hammasi bo'linadi, tarqatilgani ham." },
      3: { ru: 'Розданные книги ушли. Их вычитают, а не прибавляют.', uz: "Tarqatilgan kitoblar ketdi. Ular ayiriladi, qo'shilmaydi." }
    },
    audio: {
      intro: { ru: 'Из девяноста одной книги раздали двадцать семь, остальные связали по четыре. Какая запись подходит?', uz: "To'qson bitta kitobdan yigirma yettitasi tarqatildi, qolgani to'rttadan bog'landi. Qaysi yozuv mos keladi?" },
      on_correct: { ru: 'Верно. Скобки говорят, что вычитание идёт первым.', uz: "To'g'ri. Qavs ayirish birinchi ekanini aytadi." },
      on_wrong: { ru: 'Подумай, что происходит раньше. Сначала книги раздали, потом связали.', uz: "Nima oldin bo'lishini o'ylang. Avval kitoblar tarqatildi, keyin bog'landi." }
    }
  },

  // s7 — KONSOL: o'sha masala qadamlab, uchinchi katak — tekshirish (20-dars).
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Заполни консоль по шагам', uz: "Konsolni qadamma-qadam to'ldiring" },
    swap_line: '(91 − 27) : 4',
    cells: [
      { head: { ru: 'шаг 1', uz: '1-qadam' }, label: '91 − 27', ans: 64, hint: { ru: 'Убери розданные книги.', uz: "Tarqatilgan kitoblarni olib tashlang." } },
      { head: { ru: 'шаг 2', uz: '2-qadam' }, label: '64 : 4', ans: 16, hint: { ru: 'Шестьдесят это четыре по пятнадцать, и ещё четыре.', uz: "Oltmish bu to'rtta o'n beshtadan, yana to'rt." } },
      { head: { ru: 'проверка', uz: 'tekshirish' }, label: '16 · 4', ans: 64, hint: { ru: 'Умножь ответ на делитель.', uz: "Javobni bo'luvchiga ko'paytiring." } }
    ],
    check: '(91 − 27) : 4 = 16',
    check_label: { ru: 'вся задача одной строкой', uz: 'butun masala bitta satrda' },
    audio: {
      intro: { ru: 'Заполни три окна. Первое это вычитание, второе деление, третье проверка.', uz: "Uchta oynani to'ldiring. Birinchisi ayirish, ikkinchisi bo'lish, uchinchisi tekshirish." },
      on_correct: { ru: 'Шестнадцать связок, и проверка сошлась. Вся задача уместилась в одну строку со скобками.', uz: "O'n oltita bog'lam, tekshirish ham mos keldi. Butun masala qavsli bitta satrga sig'di." }
    }
  },

  // s8 — XATONI TOP: ikkinchi qadamda amal noto'g'ri tanlangan (darslik 26-bet 3-masala).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: '48 помидоров в 3 банки. Сколько нужно на 5 таких банок? В чём ошибка?', uz: "48 dona pomidor 3 ta bankaga. 5 ta shunday bankaga nechta kerak? Xato nimada?" },
    fig_line: '48 : 3 = 16, 16 : 5 = 3 (ост. 1)',
    opts: [
      { ru: 'на втором шаге надо умножать', uz: "ikkinchi qadamda ko'paytirish kerak" },
      { ru: 'на первом шаге надо умножать', uz: "birinchi qadamda ko'paytirish kerak" },
      { ru: '48 на 3 не делится', uz: "48 uchga bo'linmaydi" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Первый шаг верный, он показывает, сколько в одной банке.', uz: "Birinchi qadam to'g'ri, u bitta bankada nechta borligini ko'rsatadi." },
      2: { ru: 'Сорок восемь делится на три. Получается шестнадцать.', uz: "Qirq sakkiz uchga bo'linadi. O'n olti chiqadi." },
      3: { ru: 'Банок стало больше, значит и помидоров нужно больше. Делением больше не станет.', uz: "Banka ko'paydi, demak pomidor ham ko'proq kerak. Bo'lish bilan ko'paymaydi." }
    },
    audio: {
      intro: { ru: 'Первый шаг здесь правильный, а второй нет. Найди ошибку.', uz: "Bu yerda birinchi qadam to'g'ri, ikkinchisi esa yo'q. Xatoni toping." },
      on_correct: { ru: 'Верно. В одной банке шестнадцать, а банок пять. Шестнадцать умножить на пять, восемьдесят.', uz: "To'g'ri. Bitta bankada o'n olti, banka esa beshta. O'n oltini beshga ko'paytiramiz, sakson." },
      on_wrong: { ru: 'Спроси себя, чего стало больше. Банок стало больше, значит и помидоров.', uz: "O'zingizdan so'rang, nima ko'paydi. Banka ko'paydi, demak pomidor ham." }
    }
  },

  // s9 — BIT TUZOG'I: qoldiq borligi yana bitta yashik talab qiladi (yopiq maydon).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzog\'i' },
    lead: { ru: 'Бит смотрит на решение и делает вывод', uz: "Bit yechimga qarab xulosa chiqaradi" },
    lines: ['99 : 8 = 12 (ост. 3)', '12 ящиков, 3 кг рядом'],
    lines_uz: ['99 : 8 = 12 (3 qold.)', "12 yashik, yonida 3 kg"],
    line_cap: { ru: 'Бит: значит, двенадцати ящиков хватит, чтобы увезти весь урожай', uz: "Bit: demak, butun hosilni olib ketishga o'n ikkita yashik yetadi" },
    trap_label: { ru: 'Так ли это?', uz: "Shundaymi?" },
    trap_opts: { ru: ['нет, нужен ещё один ящик', 'да, двенадцати хватит'], uz: ["yo'q, yana bitta yashik kerak", "ha, o'n ikkita yetadi"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Три килограмма никуда не денутся, для них нужен тринадцатый ящик. Он поедет неполным.', uz: "Ha. Uch kilogramm yo'qolmaydi, ular uchun o'n uchinchi yashik kerak. U to'lmagan holda ketadi." },
    trap_wrong: { ru: 'А три килограмма куда? Остаток тоже надо увезти, значит ящиков тринадцать.', uz: "Uch kilogramm-chi? Qoldiqni ham olib ketish kerak, demak yashik o'n uchta." },
    audio: {
      ru: [
        'Бит посмотрел на решение и говорит.',
        'Двенадцать ящиков, значит двенадцати хватит, чтобы увезти весь урожай.',
        'Так ли это?'
      ],
      uz: [
        "Bit yechimga qaradi va aytadi.",
        "O'n ikkita yashik, demak butun hosilni olib ketishga o'n ikkitasi yetadi.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: darslik 26-bet 3-masala, endi to'g'ri yechim bilan.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: '48 помидоров разложили в 3 банки поровну. Сколько помидоров нужно на 5 таких банок?', uz: "48 dona pomidor 3 ta bankaga teng qismlarga bo'lib solindi. 5 ta shunday bankaga necha dona pomidor kerak?" },
    ans: 80,
    check: '48 : 3 = 16, 16 · 5 = 80',
    check_label: { ru: 'сначала в одной банке, потом в пяти', uz: 'avval bitta bankada, keyin beshtasida' },
    hint: { ru: 'Узнай, сколько в одной банке, и повтори это пять раз.', uz: "Bitta bankada nechta ekanini biling va buni besh marta takrorlang." },
    audio: {
      intro: { ru: 'Сорок восемь помидоров разложили в три банки поровну. Сколько нужно на пять таких банок?', uz: "Qirq sakkiz dona pomidor uchta bankaga teng bo'lib solindi. Beshta shunday bankaga nechta kerak?" },
      on_correct: { ru: 'Восемьдесят. Первый шаг деление, второй умножение.', uz: "Sakson. Birinchi qadam bo'lish, ikkinchisi ko'paytirish." }
    }
  },

  // s11 — TRENAJYOR NumPad: darslik 28-bet 3-masala (ikki xonaliga bo'lish, 18-dars bonusi).
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'В библиотеку привезли 96 книг, по 16 книг в связке. Сколько связок привезли?', uz: "Kutubxonaga 96 ta kitob olib kelindi. Har bir bog'lamda 16 tadan bo'lsa, nechta bog'lam keltirilgan?" },
    ans: 6,
    check: '16 · 6 = 96',
    check_label: { ru: 'проверка умножением', uz: "ko'paytirib tekshirish" },
    hint: { ru: 'Подбирай. По шестнадцать пять раз это восемьдесят, мало.', uz: "Tanlab ko'ring. O'n oltitadan besh marta bu sakson, kam." },
    audio: {
      intro: { ru: 'В библиотеку привезли девяносто шесть книг, по шестнадцать в связке. Сколько получилось связок?', uz: "Kutubxonaga to'qson oltita kitob keltirildi, bog'lamda o'n oltitadan. Nechta bog'lam bo'ldi?" },
      on_correct: { ru: 'Шесть связок. Проверка сошлась, шестнадцать на шесть это девяносто шесть.', uz: "Oltita bog'lam. Tekshirish mos keldi, o'n oltini oltiga ko'paytirsak to'qson olti." }
    }
  },

  // s12 — MASALA: jadval bilan, ikki qadam (darslik 26-bet 3-masala naqshi, boshqa sonlar).
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Заказ мастерской', uz: 'Ustaxona buyurtmasi' },
    q: { ru: '56 деталей разложили в 4 коробки поровну. Сколько деталей в 7 таких коробках?', uz: "56 ta detal 4 ta qutiga teng bo'lib joylandi. 7 ta shunday qutida nechta detal bo'ladi?" },
    q_speech: { ru: 'пятьдесят шесть деталей разложили в четыре коробки поровну. Сколько деталей в семи таких коробках?', uz: "ellik oltita detal to'rtta qutiga teng bo'lib joylandi. Yettita shunday qutida nechta detal bo'ladi?" },
    tbl_heads: [
      { ru: 'всего деталей', uz: 'jami detal' },
      { ru: 'коробок', uz: 'quti' },
      { ru: 'нужно коробок', uz: 'kerakli quti' }
    ],
    tbl_cells: ['56', '4', '7'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '56 : 4', uz: '56 : 4' },
      { ru: '56 · 4', uz: '56 · 4' },
      { ru: '56 · 7', uz: '56 · 7' },
      { ru: '4 · 7', uz: '4 · 7' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сначала надо узнать, сколько в одной коробке.', uz: "Avval bitta qutida nechta ekanini bilish kerak." },
      2: { ru: 'Умножать пока нечего, сколько в одной коробке, ещё неизвестно.', uz: "Hozircha ko'paytiradigan narsa yo'q, bitta qutida nechta ekani hali noma'lum." },
      3: { ru: 'Это число коробок, а не деталей.', uz: "Bu quti soni, detal soni emas." }
    },
    pick_ok: { ru: 'Верно. Сначала одна коробка, потом семь.', uz: "To'g'ri. Avval bitta quti, keyin yetti." },
    step1_q: { ru: 'Сколько деталей в одной коробке?', uz: 'Bitta qutida nechta detal?' },
    ans1: 14,
    hint1: { ru: 'Пятьдесят шесть раздели на четыре.', uz: "Ellik oltini to'rtga bo'ling." },
    step2_q: { ru: 'Сколько деталей в 7 коробках?', uz: '7 ta qutida nechta detal?' },
    ans2: 98,
    hint2: { ru: 'Четырнадцать возьми семь раз.', uz: "O'n to'rtni yetti marta oling." },
    check: '56 : 4 = 14, 14 · 7 = 98',
    setup_audio: { ru: 'Мастерской пришёл заказ. Посмотри на таблицу и реши, с чего начинать.', uz: "Ustaxonaga buyurtma keldi. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Пятьдесят шесть деталей разложили в четыре коробки поровну. Сколько деталей будет в семи таких коробках?', uz: "Ellik oltita detal to'rtta qutiga teng bo'lib joylandi. Yettita shunday qutida nechta detal bo'ladi?" },
      on_correct: { ru: 'Девяносто восемь деталей. Два шага, и оба на месте.', uz: "To'qson sakkizta detal. Ikki qadam, ikkalasi ham joyida." },
      on_wrong: { ru: 'Вернись к первому шагу. Сколько деталей в одной коробке.', uz: "Birinchi qadamga qayting. Bitta qutida nechta detal bor." }
    }
  },

  // s13 — FINAL: uch xil turdagi masala, sonlar darsda uchramagan.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задачи. Смотри, о чём спрашивают', uz: "Uchta masala. Nima so'ralganiga qarang" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Было 87 болтов, 39 израсходовали. Остальные разложили в 6 ящиков поровну. Сколько в каждом?', uz: "87 ta bolt bor edi, 39 tasi ishlatildi. Qolgani 6 ta yashikka teng bo'lindi. Har birida nechta?" },
        q_speech: { ru: 'было восемьдесят семь болтов, тридцать девять израсходовали. Остальные разложили в шесть ящиков поровну. Сколько в каждом?', uz: "sakson yettita bolt bor edi, o'ttiz to'qqiztasi ishlatildi. Qolgani oltita yashikka teng bo'lindi. Har birida nechta?" },
        ans: 8,
        hint: { ru: 'Сначала убери израсходованные.', uz: "Avval ishlatilganini olib tashlang." }
      },
      {
        kind: 'num',
        q: { ru: 'Собрали 29 кг и 37 кг. Ящики по 7 кг. Сколько килограммов останется?', uz: "29 kg va 37 kg terildi. Yashiklar 7 kg dan. Necha kilogramm ortib qoladi?" },
        q_speech: { ru: 'собрали двадцать девять килограммов и тридцать семь. Ящики по семь килограммов. Сколько килограммов останется?', uz: "yigirma to'qqiz kilogramm va o'ttiz yetti kilogramm terildi. Yashiklar yetti kilogrammdan. Necha kilogramm ortib qoladi?" },
        ans: 3,
        hint: { ru: 'Спрашивают не про ящики, а про то, что не вошло.', uz: "Yashik haqida emas, sig'magani haqida so'ralyapti." }
      },
      {
        kind: 'num',
        q: { ru: '63 детали разложили в 9 коробок поровну. Сколько деталей в 4 таких коробках?', uz: "63 ta detal 9 ta qutiga teng bo'lindi. 4 ta shunday qutida nechta detal?" },
        q_speech: { ru: 'шестьдесят три детали разложили в девять коробок поровну. Сколько деталей в четырёх таких коробках?', uz: "oltmish uchta detal to'qqizta qutiga teng bo'lindi. To'rtta shunday qutida nechta detal?" },
        ans: 28,
        hint: { ru: 'Сначала одна коробка, потом четыре.', uz: "Avval bitta quti, keyin to'rtta." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Задачу в два действия можно записать одной строкой. Скобки показывают, что делаем первым: (45 + 54) : 8. Без скобок машина сначала разделит 54 на 8 и получит совсем другое.',
      uz: "Ikki amalli masalani bitta satrda yozish mumkin. Qavs nimani birinchi qilishni ko'rsatadi: (45 + 54) : 8. Qavssiz mashina avval 54 ni 8 ga bo'ladi va butunlay boshqa natija chiqadi."
    },
    fact_audio: {
      ru: 'Задачу в два действия можно записать одной строкой. Скобки показывают, что делаем первым. Сорок пять плюс пятьдесят четыре в скобках, и всё это делим на восемь. Без скобок сначала разделилось бы пятьдесят четыре, и ответ вышел бы совсем другой. Мы весь урок делали два шага по очереди, и скобки это как раз про очередь.',
      uz: "Ikki amalli masalani bitta satrda yozish mumkin. Qavs nimani birinchi qilishni ko'rsatadi. Qirq besh qo'shuv ellik to'rt qavs ichida, hammasini sakkizga bo'lamiz. Qavssiz avval ellik to'rt bo'linardi va javob butunlay boshqa chiqardi. Butun dars davomida biz ikki qadamni navbat bilan qildik, qavs esa aynan navbat haqida."
    },
    audio: {
      intro: { ru: 'Три задачи напоследок. В каждой смотри, о чём спрашивают.', uz: "Oxirida uchta masala. Har birida nima so'ralganiga qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Перечитай вопрос. Он подсказывает, какое число брать в ответ.', uz: "Savolni qayta o'qing. U javobga qaysi sonni olishni aytadi." }
    }
  },

  // s14 — YAKUN: bo'lim yopiladi, keyingisi ulushlar (reja 27-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Заказ мастерской закрыт!', uz: 'Ustaxona buyurtmasi yopildi!' },
    cando: {
      ru: ['вижу в задаче два действия и их порядок', 'выбираю ответ по вопросу: частное или остаток', 'записываю решение одной строкой со скобками'],
      uz: ["masalada ikki amalni va ularning tartibini ko'raman", "javobni savolga qarab tanlayman: bo'linmami yoki qoldiqmi", "yechimni qavs bilan bitta satrda yozaman"]
    },
    rule_recap: { ru: 'Сначала находим то, что можно. Потом отвечаем ровно на вопрос.', uz: "Avval topsa bo'ladiganini topamiz. Keyin aynan savolga javob beramiz." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 18: деление по частям; урок 19: остаток; урок 20: проверка', uz: "18-dars: qismlab bo'lish; 19-dars: qoldiq; 20-dars: tekshirish" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'доли: как делят одно целое на равные части', uz: "ulushlar: bir butunni teng qismlarga bo'lish" },
    audio: {
      ru: 'Заказ мастерской закрыт, и весь блок вместе с ним. Запомни главное. В задаче в два действия сначала находим то, что можно найти сразу, а потом отвечаем ровно на тот вопрос, который задали. Частное и остаток это разные ответы одного счёта. В следующий раз целое начнём делить на равные доли!',
      uz: "Ustaxona buyurtmasi yopildi, u bilan birga butun bo'lim ham. Asosiysini eslab qoling. Ikki amalli masalada avval darrov topiladiganini topamiz, keyin esa aynan berilgan savolga javob beramiz. Bo'linma va qoldiq bu bitta hisobning turli javoblari. Keyingi safar butunni teng ulushlarga bo'la boshlaymiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Разберём по шагам.', uz: 'Qadamma-qadam ko\'rib chiqamiz.' },
  s2:  { ru: 'Посмотрим на ящики.', uz: 'Yashiklarga qaraymiz.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Кто-то ответил не на тот вопрос.', uz: 'Kimdir boshqa savolga javob beribdi.' },
  s5:  { ru: 'Разложи по полкам.', uz: 'Tokchalarga ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Соберём по шагам.', uz: "Qadamlab yig'amiz." },
  s8:  { ru: 'Второй шаг подвёл.', uz: 'Ikkinchi qadam adashtirdi.' },
  s9:  { ru: 'А вот и Бит со своей идеей.', uz: "Mana Bit ham o'z fikri bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна поставка.', uz: 'Yana bitta yetkazma.' },
  s12: { ru: 'Заказ из учебника.', uz: 'Kitobdagi buyurtma.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Отгрузка готова. Идём дальше!', uz: "Jo'natish tayyor. Davom etamiz!" }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Урожай разложен, остаток не потерялся. Спасибо за помощь!',
  uz: "Missiya bajarildi! Hosil joylandi, qoldiq yo'qolmadi. Yordamingiz uchun rahmat!"
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




// ============================================================
// EKRANLAR — Dars09 «Ko'paytirish jadvali» (Б2 «Nur bog'lari»)
// ============================================================



// --- JO'NATISH STOLI (D23): blokning umumiy foni SAQLANADI, ishchi tugun BOSHQA: pallet
// ustida to'la yashiklar va yonida sig'magan qoldiq — bo'linma va qoldiq KO'RINADI.
const ShipmentBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d23wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d23sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d23floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <radialGradient id="d23sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d23lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d23winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    <rect x="0" y="0" width="400" height="180" fill="url(#d23wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d23lamp)" opacity="0.26"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#d23sky)"/>
    <g clipPath="url(#d23winClip)">
      <circle cx="96" cy="48" r="20" fill="url(#d23sun)"/><circle cx="96" cy="48" r="7" fill="#FFF3C4"/>
      <g fill="#FFFFFF" opacity="0.9"><ellipse cx="250" cy="44" rx="18" ry="6"/><ellipse cx="264" cy="41" rx="12" ry="4.6"/></g>
      <path d="M46 84 Q140 62 220 82 Q300 98 354 80 L354 94 L46 94 Z" fill="#BFE0A8"/>
      <path d="M46 90 Q160 74 354 88 L354 94 L46 94 Z" fill="#A8D290"/>
      {[120, 168, 216, 264, 312].map((x, i) => (
        <g key={`tr${i}`} transform={`translate(${x} ${84 - (i % 2) * 3})`}>
          <rect x="-1" y="-4" width="2" height="6" fill="#8A6B42"/>
          <circle cx="0" cy="-7" r="4.6" fill="#6FBF8E"/>
        </g>
      ))}
    </g>
    <g fill="none" stroke="#C9B79A" strokeWidth="3"><rect x="42" y="28" width="316" height="70" rx="7"/></g>
    <g stroke="#C9B79A" strokeWidth="2.4" opacity="0.9"><path d="M148 32 V94"/><path d="M256 32 V94"/></g>
    <rect x="42" y="95" width="316" height="5" rx="2" fill="#B4976F"/>
    {/* JO'NATISH STOLI: pallet ustida 12 to'la yashik, yonida 3 kg sig'magan */}
    <text x="200" y="112" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">JO'NATISH STOLI</text>
    <g transform="translate(84 118)">
      {Array.from({ length: 2 }).map((_, r) => (
        <g key={`br${r}`} transform={`translate(0 ${r * 22})`}>
          {Array.from({ length: 6 }).map((_, k) => (
            <g key={k} transform={`translate(${k * 25} 0)`}>
              <rect x="0" y="0" width="21" height="18" rx="2.4" fill="#F2A85C" stroke="#C97F35" strokeWidth="0.9"/>
              <rect x="0" y="0" width="21" height="5" rx="2" fill="#FFCB8E"/>
              <line x1="10.5" y1="5" x2="10.5" y2="18" stroke="#C97F35" strokeWidth="0.6" opacity="0.6"/>
            </g>
          ))}
        </g>
      ))}
      <rect x="-6" y="46" width="163" height="6" rx="2" fill="#C3A87E"/>
      <rect x="-6" y="52" width="163" height="4" rx="1.6" fill="#A98C64"/>
      <text x="75" y="66" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#C97F35" fontFamily="'JetBrains Mono', monospace">12</text>
    </g>
    <g transform="translate(272 148)">
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={k * 13} cy={k === 1 ? -7 : 0} r="6.2" fill="#E0563A" stroke="#B33F27" strokeWidth="0.9"/>
      ))}
      <text x="13" y="20" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#B33F27" fontFamily="'JetBrains Mono', monospace">3</text>
    </g>
    <rect x="0" y="176" width="400" height="54" fill="url(#d23floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
);

const ShipmentScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <ShipmentBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};
const NumPad = ({ value, setValue, disabled, max = 3, state = null }) => {
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

// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================





// --- KONSOL YACHEYKASI (1-darsdan ko'chirilgan `.lm-cons*` uslubi, 15-darsning komponenti):
// `label` berilsa ekranchada YOZUV ko'rsatiladi (10 · 7), tagida terilgan javob yoki «?».
const MeasureCell = ({ head, n = 8, badge, val, lit = false, label = null }) => (
  <div className={`lm-cons ${lit ? 'lm-cons-lit' : ''}`}>
    {head ? <div className="lm-cons-head mono">{head}</div> : null}
    <div className="lm-cons-screen">
      {label !== null ? (
        <span className="mono d16-plate">{label}</span>
      ) : (
        <span className="d16-row">
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} className="d16-row-lamp"><Chiroq/></span>
          ))}
        </span>
      )}
      {badge ? <span className="lm-cons-x mono">{badge}</span> : null}
    </div>
    {val !== null && val !== undefined ? <div className="lm-cons-val mono lm-reveal">{val}</div> : <div className="lm-cons-val mono" style={{ color: '#C4BEB4' }}>?</div>}
  </div>
);





// --- YASHIKLAR: 12 tasi to'ladi, 3 kg esa yoniga chiqadi. Bola bo'linma va qoldiqni
// bitta rasmda KO'RADI: to'la yashiklar bir rangda, sig'magan qoldiq boshqa rangda.
const BoxFill = ({ full, rest, showBoxes, showRest }) => (
  <span className="d23-boxwrap">
    <span className="d23-boxrow">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className={`d23-box${showBoxes ? ' d23-box-on' : ''}`}
          style={{ animationDelay: `${0.03 * i}s` }} aria-hidden="true"/>
      ))}
    </span>
    {showRest && (
      <span className="d23-rest lm-reveal">
        {Array.from({ length: rest }).map((_, i) => <span key={i} className="d23-kg" aria-hidden="true"/>)}
      </span>
    )}
  </span>
);

// --- FACTCARD QAHRAMONI: qavs navbatni ko'rsatadi.
const BracketFig = () => (
  <svg viewBox="0 0 220 96" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <text x="110" y="18" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">(45 + 54) : 8</text>
    <path d="M56 26 Q52 34 56 42" fill="none" stroke="#C97F35" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M150 26 Q154 34 150 42" fill="none" stroke="#C97F35" strokeWidth="2.4" strokeLinecap="round"/>
    <text x="103" y="40" textAnchor="middle" fontSize="10" fontWeight="800" fill="#C97F35" fontFamily="'JetBrains Mono', monospace">1</text>
    <text x="182" y="40" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">2</text>
    <line x1="20" y1="52" x2="200" y2="52" stroke="#D8CDB8" strokeWidth="1.4"/>
    <text x="110" y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5D5A52" fontFamily="'JetBrains Mono', monospace">99 : 8 = 12 (3)</text>
    <text x="110" y="88" textAnchor="middle" fontSize="8" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">qavs navbatni belgilaydi</text>
  </svg>
);
const MCOne = ({ props, ck, mono = false, figLine = null }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const segs = Array.isArray(c.audio.intro[lang]) ? c.audio.intro[lang] : [c.audio.intro[lang]];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...segs.map((text, i) => ({ id: `${ck}_i${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: c.opts[c.ci][lang], studentAnswer: c.opts[c.ci][lang], correct: firstRef.current,
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          {figLine && <span className="mono d23-errline">{figLine}</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: mono ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: mono ? "'JetBrains Mono', monospace" : undefined }}>{t(c.opts[k])}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.audio.on_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// --- BITTA TOPSHIRIQLI NumPad TRENAJYOR (16-darsning s11 naqshi, bitta misolga): javob
// teriladi, to'g'rida CheckStrip bilan teskari tekshirish, noto'g'rida turtki-hint.
const NumOne = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const [solved, setSolved] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.hint)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.hint); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <NumPad value={solved ? String(c.ans) : val} setValue={setVal} disabled={!canAct || numLock || solved} max={3}/>
          {!solved && <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

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
        <div className="frame fade-up delay-1 d23-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <ShipmentScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d23-order">
              <span className="mono d23-order-plate">11</span>
              <span className="d23-order-sep mono">:</span>
              <span className="mono d23-order-plate">2</span>
            </span>
            <span className="d23-note">{t(c.order_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(12.5px, 2vw, 16px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, textAlign: 'center' }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
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

// s1 — XONALAR BO'YICHA: tanish usul (darslik 45-bet, a bandi)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <span className="mono d23-plate">{lang === 'ru' ? c.task_line : c.task_line_uz}</span>
          {step >= 1 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d23-expr">{c.step1}</span>
              <span className="d23-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d23-expr">{c.step2}</span>
              <span className="d23-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d23-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
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

// s2 — YASHIKLAR: bitta bo'lishning IKKI javobi ko'rinadi (bo'linma va qoldiq)
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <BoxFill full={c.full} rest={c.rest} showBoxes={step >= 1} showRest={step >= 2}/>
          <div className="d23-gridrow">
            {step >= 1 && (
              <span className="d23-gridcap lm-reveal">
                <span className="mono d23-expr" style={{ color: '#C97F35' }}>{t(c.capA)}</span>
              </span>
            )}
            {step >= 2 && (
              <span className="d23-gridcap lm-reveal">
                <span className="mono d23-expr" style={{ color: '#B33F27' }}>{t(c.capB)}</span>
              </span>
            )}
          </div>
          {step >= 2 && <span className="mono d23-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 800, textAlign: 'center' }}>
                {t(c.opts[k])}
              </button>
            ))}
          </div>
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <div className="d15-rulelines">
              {c.rule_lines[lang].map((l, i) => <span key={i} className="d15-ruleline lm-reveal" style={{ animationDelay: `${i * 0.18}s` }}>{l}</span>)}
              <span className="mono d15-ruleex lm-reveal" style={{ animationDelay: '0.54s' }}>{c.rule_ex}</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s4 — XATONI TOP: tekshirishda qoldiq unutilgan (rasm yo'q, faqat yozuv)
const Screen4 = (props) => <MCOne props={props} ck="s4" figLine={CONTENT.s4.fig_line}/>;

// s5 — SARALASH: tekis bo'linadi yoki qoldiq bilan
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [sel, setSel] = useState(false);
  const [wrongBin, setWrongBin] = useState(null);
  const [okBin, setOkBin] = useState(props.storedAnswer !== undefined ? (c.items[c.items.length - 1].a ? 'a' : 'b') : null);
  const [hintMsg, setHintMsg] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const triedRef = useRef(false);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  const place = (bin) => {
    if (!canAct || done || okBin !== null) return;
    const right = (bin === 'a') === it.a;
    if (right) {
      setOkBin(bin); sfx.playCorrect(); setHintMsg(null);
      if (!triedRef.current) setScore((s) => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => {
        const last = idx + 1 >= c.items.length;
        if (!last) { setOkBin(null); setSel(false); setWrongBin(null); }
        triedRef.current = false;
        setIdx((n) => n + 1);
      }, 1300);
    } else {
      setWrongBin(bin);
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(it.hint[lang]); }
      setTimeout(() => setWrongBin(null), 900);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'sort-bins',
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
  const bin = (key, label) => (
    <button className={`lm-bin ${okBin === key ? 'lm-bin-full' : ''} ${wrongBin === key ? 'option-picked-wrong' : ''} ${sel && okBin === null ? 'lm-bin-open' : ''}`}
      disabled={!canAct || done || okBin !== null} onClick={() => place(key)}>
      <span className="lm-bin-head mono">{t(label)}</span>
      <span className="lm-bin-slot mono">{okBin === key ? t(it.n) : ''}</span>
    </button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, c.items.length)} / {c.items.length}</div>
            <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <div className="lm-digtray">
                {okBin === null
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{t(it.n)}</button>
                  : <span className="lm-digtray-empty mono">{t(it.n)}</span>}
              </div>
              <div className="d23-bins">
                {bin('a', c.bin_a)}
                {bin('b', c.bin_b)}
              </div>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
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

// s6 — TEST: 25 : 2, nechtasi ortadi
const Screen6 = (props) => <MCOne props={props} ck="s6" mono/>;

// s7 — KONSOL: 38 : 3, bo'linma va qoldiq
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s7;
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [phase, setPhase] = useState(props.storedAnswer ? c.cells.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const solved = phase >= c.cells.length;
  const cell = c.cells[Math.min(phase, c.cells.length - 1)];
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === cell.ans;
    const last = phase + 1 >= c.cells.length;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : cell.hint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setPhase((p) => p + 1); }, last ? 400 : 900);
    } else {
      firstRef.current = false;
      setHintMsg(cell.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.lead),
        correctAnswer: '12', studentAnswer: '12', correct: firstRef.current,
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <span className="mono d23-expr">{c.swap_line}</span>
          <div className="lm-console" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 320 }}>
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s8 — XATONI TOP: 53 : 4 = 12 (qold. 5)
const Screen8 = (props) => <MCOne props={props} ck="s8" figLine={CONTENT.s8.fig_line}/>;

// s9 — BIT TUZOG'I: «javob chiroyli, tekshirish shart emas» (yopiq maydon)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's9_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = trapPick === c.trap_ci || props.storedAnswer?.correct === true;
  const pickTrap = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === c.trap_ci) {
      setTrapPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.trap_label),
        correctAnswer: c.trap_opts[lang][c.trap_ci], studentAnswer: c.trap_opts[lang][c.trap_ci], correct: firstRef.current,
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
  const lines = lang === 'ru' ? c.lines : c.lines_uz;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <span className="mono d23-plate">{lines[0]}</span>
          <span className="d23-bad">{lines[1]}</span>
          <span className="d23-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="d23-trap">
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.trap_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR: ko'paytirishni bo'lish bilan tekshirish (96 : 8)
const Screen10 = (props) => <NumOne props={props} ck="s10"/>;

// s11 — TRENAJYOR NumPad: 53 : 4
const Screen11 = (props) => <NumOne props={props} ck="s11"/>;

// s12 — MASALA: 74 : 6, yashiklar va ortiqcha detallar
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s12;
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
  const [stepNum, setStepNum] = useState(0);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const chosen = pickIdx === ci || solved;
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
  const stepAns = stepNum === 0 ? c.ans1 : c.ans2;
  const stepHint = stepNum === 0 ? c.hint1 : c.hint2;
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === stepAns;
    const last = stepNum === 1;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : stepHint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      if (last) { setSolved(true); }
      else { setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setStepNum(1); }, 900); }
    } else {
      firstRef.current = false;
      setHintMsg(stepHint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans2), studentAnswer: String(c.ans2), correct: firstRef.current,
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
        <h1 className="title h-sub fade-up" style={{ margin: 0, fontSize: 'clamp(13px, 2.1vw, 18px)' }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <TaskTable heads={c.tbl_heads.map((h) => t(h))} cells={c.tbl_cells}/>
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
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <span className="d23-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d23-res lm-reveal">{c.ans1} · {c.ans2}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s7.check_label)} ok/>}
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

// s13 — FINAL 3 misol + FactCard
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
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
  const it = items[Math.min(idx, items.length - 1)];
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const numTriedRef = useRef(false);
  const done = idx >= items.length;
  const PASS = Math.ceil(items.length * 0.7);
  useEffect(() => {
    if (done || audio.muted || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const pick = (i) => {
    if (!canAct || picked !== null || done || wrongSet.has(i)) return;
    const isOk = orders[idx][i] === 0;
    if (isOk) {
      setPicked(i); sfx.playCorrect();
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
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1700);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
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
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2.1vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
            <div className="frame-success reveal-soft" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={`${score} / ${items.length}`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><BracketFig/></div>
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
        <div className="d23-final-scene fade-up delay-1"><ShipmentScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function TwoStepTasksLesson({
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
}
/* xuk ekrani (s0): sahna ham ETALON o'lchamida (Dars01 s0 = 629x330) */
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
/* === DARS14: IFODA SVYORTKASI === */
/* === DARS14: QOIDA uch satr === */
/* === DARS14: QAVS panellari === */
/* === DARS14: USTUN (stolbik) — 5-sinf naqshi ===
   Har satr: BELGI sloti (2 monoshrift belgisi) + TANA. Ikkisi bir shriftda, shuning uchun
   xonalar aniq ustun-ustun tushadi, belgi esa pastdagi sonning chap yonida turadi. */
/* === DARS14: masala sahnasi (uch tokcha + yerdagi lampalar) === */
/* yakuniy ekran (s14): sahna ETALON o'lchamida (Dars01 s14) */
/* ============================================================
   DARS15 — jo'natish maydonchasi: vagonetka, son uchburchagi, tekshirish satri.
   ============================================================ */
/* sahna o'lchami — ETALON (Dars01 s0: 629x330 @1440x900), ekran uchun alohida klass:
   global .lm-scene budjetini ko'tarish HAMMA darsni kichraytiradi (metodist saboqi). */
/* Sahna o'lchami BALANDLIK BUDJETIDAN chiqadi (Dars13 naqshi): xuk ekranida sahna +
   vagonetka paneli + 4 variant sig'ishi kerak, shuning uchun budjet donor bilan bir xil. */
/* --- VAGONETKA --- */
@keyframes d15roll { from { transform: translateX(0); } to { transform: translateX(14%); } }
/* --- SON UCHBURCHAGI (darslik topshirig'i) --- */
/* --- TEKSHIRISH SATRI --- */
.d15-check { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 999px;
  background: #E3F0E8; border: 2px solid #9CCBB0; }
.d15-check-no { background: #FDE8E4; border-color: #E9AFA2; }
.d15-check-sign { font-size: clamp(12px, 1.8vw, 15px); font-weight: 800; color: #1F7A4D; }
.d15-check-no .d15-check-sign { color: #C0392B; }
.d15-check-expr { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #0E0E10; }
.d15-check-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-transform: uppercase; letter-spacing: .4px; }
/* --- TESKARI YO'L (s2) --- */
/* --- QOIDA KARTASI (s4) --- */
.d15-rulelines { display: flex; flex-direction: column; gap: 5px; }
.d15-ruleline { font-size: clamp(12.5px, 1.9vw, 15px); font-weight: 700; color: #0E0E10; }
.d15-ruleex { align-self: flex-start; margin-top: 2px; padding: 3px 10px; border-radius: 999px;
  background: #FFE8E1; color: #FF4F28; font-size: clamp(12px, 1.9vw, 15px); font-weight: 800; }
/* --- TEKSHIRISH PANELLARI (s6) --- */
/* --- BONUS: iks harfi (s10) --- */
/* --- FACTCARD: tovush to'lqini borib qaytadi --- */
@keyframes d15wave {
  0%, 100% { opacity: 0; transform: translateX(0); }
  35% { opacity: 1; transform: translateX(18px); }
  70% { opacity: .5; transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .d15-cart-go, .d15-wave, .d15-count-tick { animation: none; }
}
/* ============================================================
   DARS16 — bog' vazifasi: 1-darsning konsoli, darslik jadvali, merka-polosalar.
   ============================================================ */
/* --- KONSOL (1-darsdan ko'chirilgan uslub; bu yerda ikki yacheyka) --- */
@keyframes lm-cons-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
/* --- MERKA: bir qatorda lampalar --- */
/* --- XUK: ikki gulzor paneli --- */
/* --- DARSLIK JADVALI (26-bet): uch ustun, shapka tepada --- */
/* --- MERKA-POLOSALAR (necha marta ko'p) --- */
/* --- s3, s5, s10, s12 mayda matnlar --- */
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: yuk ko'tarilishi --- */
@keyframes d16lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .d16-load { animation: none; } }
/* ============================================================
   DARS17 — saralash zali: qatorlar massivi, sonlar o'qi, ikki tokcha.
   ============================================================ */
/* --- XUK: 12 lampa uyumi --- */
/* --- QATORLAR MASSIVI (ArrayViz) --- */
/* --- BO'LUVCHILAR RO'YXATI --- */
/* --- IKKI TOKCHA (1-darsning lm-bin mexanikasi) --- */
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: soat teng bo'laklarga bo'linadi --- */
@keyframes d17slice { 0%, 45%, 100% { opacity: 0; } 15%, 30% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d17-slice { animation: none; opacity: .6; } }
/* ============================================================
   DARS19 — ustaxona: modul detallari, konsol, jadval, svyortka.
   ============================================================ */
/* --- XUK: buyurtma qatori (4 modul-plastinka) --- */
/* --- MODUL QISMLARI (s1) --- */
/* --- YIG'ISH STOLI GURUHLARI (s2-s3) --- */
/* --- IFODA SATRLARI --- */
/* --- KONSOL (1-dars uslubi, 15-darsdan ko'chirilgan CSS) --- */
.lm-console { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); width: 100%; max-width: 440px; }
.lm-cons { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); padding: clamp(9px, 2vw, 14px) 4px; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.28s, background 0.28s; }
.lm-cons-lit { background: #FFF6E9; box-shadow: 0 5px 16px -9px rgba(255,154,46,0.75), inset 0 0 0 1.5px rgba(255,154,46,0.5); }
.lm-cons-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-cons-screen { display: flex; align-items: center; justify-content: center; gap: clamp(4px, 1.2vw, 8px); min-height: clamp(32px, 7vw, 44px); }
.lm-cons-x { font-size: clamp(16px, 3.4vw, 23px); font-weight: 800; color: #3A3530; display: inline-block; }
.lm-cons-val { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3.2vw, 22px); font-weight: 800; color: #FF4F28; }
.d16-plate { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #0E0E10; padding: 2px 8px;
  border-radius: 9px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row { display: inline-flex; gap: clamp(1px, 0.5vw, 3px); padding: clamp(3px, 0.8vw, 5px) clamp(4px, 1vw, 6px);
  border-radius: 8px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row-lamp { display: inline-flex; width: clamp(9px, 2.2vw, 14px); height: clamp(9px, 2.2vw, 14px); }
.d16-row-lamp svg { width: 100%; height: 100%; }
/* --- DARSLIK JADVALI (15-darsdan ko'chirilgan CSS) --- */
.d16-tbl { width: 100%; max-width: 420px; border: 2px solid #C9B79A; border-radius: 10px; overflow: hidden; background: #FFFFFF; }
.d16-tbl-row { display: grid; grid-template-columns: repeat(3, 1fr); }
.d16-tbl-head { background: #F3E7CE; border-bottom: 2px solid #C9B79A; }
.d16-tbl-cell { padding: clamp(5px, 1.2vw, 8px) clamp(3px, 1vw, 6px); text-align: center; font-size: clamp(10px, 1.6vw, 12.5px);
  font-weight: 700; color: #5A5A60; border-right: 1px solid #DCCDB0; display: flex; align-items: center; justify-content: center; }
.d16-tbl-row .d16-tbl-cell:last-child { border-right: none; }
.d16-tbl-val { font-size: clamp(17px, 3.6vw, 24px); font-weight: 800; color: #0E0E10; min-height: clamp(34px, 8vw, 46px); }
.d16-tbl-hot { color: #FF4F28; background: #FFF4EF; }
/* --- IFODA SVYORTKASI (13-darsdan ko'chirilgan CSS) --- */
.d14-expr { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 11px); flex-wrap: wrap; min-height: clamp(34px, 7vw, 48px); }
.d14-tok { font-size: clamp(22px, 4.8vw, 32px); font-weight: 800; color: #3A3530; padding: 2px 6px; border-radius: 8px; transition: background 0.25s ease, color 0.25s ease; }
.d14-tok-hot { background: rgba(255,79,40,0.16); color: #FF4F28; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.45); }
.d14-tok-fresh { background: rgba(31,122,77,0.14); color: #1F7A4D; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.4); }
.d14-tok-big { font-size: clamp(28px, 6vw, 42px); color: #1F7A4D; }
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: ikkilantirish zanjiri navbat bilan yonadi --- */
@keyframes d19slice { 0%, 8% { opacity: 0.25; } 28%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d19-slice { animation: none; opacity: 1; } }

/* ============================================================
   DARS18 — taqsimot rafi: detallar, tokchalar, saralash.
   ============================================================ */

/* --- XUK: buyurtma yorlig'i --- */

/* --- DETALLAR --- */

/* --- TOKCHALAR (qismni tengdan tarqatish) --- */

/* --- IFODA SATRLARI --- */

/* --- TOKCHAGA SARALASH (16-darsdan ko'chirilgan mexanika, chip kengroq) --- */
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: clamp(44px, 10vw, 58px); align-items: center; }
.lm-digtray-empty { font-size: clamp(15px, 3.2vw, 21px); font-weight: 800; color: #C4BEB4; letter-spacing: 1px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(76px, 17vw, 104px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF;
  font-size: clamp(15px, 3.2vw, 22px); font-weight: 800; color: #3A3530; cursor: pointer; padding: 0 10px;
  box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none;
  border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #E3F0E8; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.35); }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-bin-slot { min-width: clamp(60px, 13vw, 84px); height: clamp(34px, 7vw, 44px); display: flex; align-items: center; justify-content: center;
  border-radius: 10px; background: #FFFFFF; font-size: clamp(14px, 3vw, 20px); font-weight: 800; color: #3A3530;
  box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.lm-bin:disabled { cursor: default; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: uch xil ajratish navbat bilan yonadi --- */
@keyframes d18split { 0%, 6% { opacity: 0.25; } 24%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d18-split { animation: none; opacity: 1; } }

/* ============================================================
   DARS19 — teng ulash stoli: tarqatish, ortiqcha lagani, qoldiq.
   ============================================================ */

/* --- XUK: buyurtma --- */

/* --- TARQATISH DOSKASI --- */

/* --- IFODA SATRLARI --- */


/* --- YOPIQ MAYDON (Bit tuzog'i) --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: hafta strelkasi --- */
@keyframes d19arc { 0%, 10% { transform: rotate(0deg); } 55%, 100% { transform: rotate(308deg); } }
@media (prefers-reduced-motion: reduce) { .d19-arc { animation: none; } }

/* ============================================================
   DARS20 — nazorat terminali: tekshiruv juftliklari, moslik.
   ============================================================ */


/* --- TEKSHIRUV JUFTLIGI --- */

/* --- IFODA SATRLARI --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: skaner chizig'i --- */
@keyframes d20scan { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(132px); } }

/* ============================================================
   DARS21 — ustun terminali: yozuv, o'tkazish, qadamlar.
   ============================================================ */


/* --- USTUN (13-darsdan ko'chirilgan CSS) --- */
.d14-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 12px;
  padding: clamp(8px, 1.8vw, 13px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 1.5px rgba(190,150,90,.3); }
.d14-colr { white-space: pre; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px);
  font-weight: 800; color: #3A3530; line-height: 1.25; }
.d14-col-slot { color: #8A8378; }
.d14-col-sign { color: #8A8378; }
.d14-col-hot { color: #1F7A4D; }
.d14-colr-carry { position: relative; height: clamp(11px, 2.1vw, 15px); font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }
.d14-carry { position: absolute; top: 0; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 2vw, 14px); font-weight: 800; color: #FF4F28; }
.d14-col-rule { height: 2.3px; background: #3A3530; border-radius: 2px; margin: 3px 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: qadamlar navbat bilan yonadi --- */
@keyframes d21step { 0%, 10% { opacity: 0.3; } 30%, 100% { opacity: 1; } }

/* ============================================================
   DARS22 — katta modul: katak to'r, ikki bo'lak, qismlar.
   ============================================================ */

.d23-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d23-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d23-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d23-expr { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #3A3530; }
.d23-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d23-bad { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; }
.d23-errline { font-size: clamp(13px, 2.5vw, 19px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); text-align: center; }
.d23-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d23-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d23-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d23-trap { display: flex; gap: 10px; justify-content: center; }
.d23-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 460px; }

/* --- KATAK TO'R --- */
.d23-grid { display: inline-flex; align-items: flex-start; gap: clamp(5px, 1.2vw, 9px);
  padding: clamp(5px, 1.2vw, 8px); border-radius: 10px; background: rgba(255,236,200,.45);
  box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d23-grid-part { display: inline-flex; flex-direction: column; gap: 2px; }
.d23-grid-row { display: inline-flex; gap: 2px; }
.d23-cell { display: inline-block; width: clamp(6px, 1.5vw, 10px); height: clamp(6px, 1.5vw, 10px); border-radius: 2px; }
.d23-cell-a { background: #F2A85C; box-shadow: inset 0 0 0 0.5px #C97F35; }
.d23-cell-b { background: #6FD0E4; box-shadow: inset 0 0 0 0.5px #3E8FA8; }
.d23-gridrow { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: clamp(6px, 1.6vw, 12px); }
.d23-gridcap { display: flex; flex-direction: column; align-items: center; gap: 3px; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d23-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d23-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: zinapoya --- */
.d23-stair { animation: d22stair 3.6s ease-in-out infinite; }
@keyframes d22stair { 0%, 12% { opacity: 0.3; } 34%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d23-stair { animation: none; opacity: 1; } }

.d23-boxwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d23-boxrow { display: grid; grid-template-columns: repeat(6, auto); gap: clamp(4px, 1vw, 7px); justify-content: center; }
.d23-box { width: clamp(20px, 3.4vw, 27px); height: clamp(17px, 2.9vw, 23px); border-radius: 3px;
  background: #EFE6D6; border: 1.5px solid #D8CDB8; opacity: 0.5; transition: none; }
.d23-box-on { background: linear-gradient(180deg, #FFCB8E 0 26%, #F2A85C 26% 100%); border-color: #C97F35;
  opacity: 1; animation: d23pop 0.32s ease-out both; }
@keyframes d23pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.d23-rest { display: inline-flex; gap: clamp(4px, 1vw, 7px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 13px);
  border-radius: 999px; background: #FDECE7; border: 1.5px dashed #E0563A; }
.d23-kg { width: clamp(11px, 1.9vw, 15px); height: clamp(11px, 1.9vw, 15px); border-radius: 50%;
  background: #E0563A; border: 1.2px solid #B33F27; }
`;
