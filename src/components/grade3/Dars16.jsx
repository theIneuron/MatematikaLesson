import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars16 — "Bo'luvchilar va karrali sonlar" (num-3-16) | Б2 yakuni
// Syujet: «qator saralash» (SYUJET_3SINF.md 144-satr). Bit 12 ta lampani teng qatorlarga
//   terishni so'raydi; qaysi sonlar tekis bo'linadi, qaysilari yo'q — shundan bo'luvchi
//   tushunchasi chiqadi.
// SAHNA (metodist qoidasi: 1-9-darsdan olib qayta ishlash): 6-darsning zali (`SkywayBg`) —
//   xonadan o'tadigan SON O'QI relsi. O'zgargani: deraza KUNDUZGI va ortida bog' terrasalari
//   (9-dars elementi), rels belgilari 1 dan 12 gacha va ularda 12 ning BO'LUVCHILARI yonadi,
//   yugurgich vagon o'rniga ikki saralash tokchasi.
// MEXANIKA (yangi mexanika YARATILMAGAN): MC xuk, ikki karta ko'prik, TAP bilan ochilish,
//   MC + qoida kartasi, yopiq maydon, 5 soniyalik soat, TOKCHAGA SARALASH (1-dars mexanikasi),
//   MCRoundD2 ×3, NumPad trenajyor + CheckStrip, masala (yozuv + javob + tekshirish),
//   final panel + FactCard. Test ekranida RASM YO'Q (metodist qoidasi 15-darsdan).
// KO'CHIRILGAN: `ArrayViz` (9 va 13-dars), sonlar o'qi (6-darsning `NumLine` si birlik
//   qadamga moslangan), tokcha-saralash CSS va mexanikasi (1-dars).
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 58-60-bet «Sonning bo'luvchi va karralilarini
//   aniqlash»): «1, 2 va 3 sonlari 6 sonining bo'luvchilari deyiladi»; «36 soni 4 ga qoldiqsiz
//   bo'linadi, demak 36 soni 4 ning karralisi»; 36 ning barcha bo'luvchilari; «3 ga karrali
//   sonlarni topish uchun uni 1, 2, 3, 4 ga ko'paytiring»; 59-bet 1a — bo'luvchilarni SONLAR
//   O'QIDA belgilash (s3); 59-bet 2 va 6 — qaysi sonning bo'luvchilari ko'p (s10 bonus).
// YADRO: 12 soni (bo'luvchilari 1, 2, 3, 4, 6, 12) va 3 ning karralilari 3, 6, 9, 12.
// Misconception: M1 bo'luvchi va karralini almashtirish; M2 bir va sonning o'zini unutish;
//   M3 karrali son bitta deb o'ylash; M4 «deyarli bo'linadi».
// FactCard: soatda oltmish daqiqa, yilda o'n ikki oy — bu sonlarning bo'luvchilari ko'p.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 16» (tasdiq 2026-08-05).
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
  lessonId: 'num-3-16',
  lessonTitle: { ru: 'Урок 16. Делители и кратные числа', uz: "16-dars. Bo'luvchilar va karrali sonlar" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 16»): s0 xuk (12 lampa) · s1 ko'prik (tekis bo'linadi va
// bo'linmaydi) · s2 BO'LUVCHILAR modeli (qatorlar) · s3 SONLAR O'QIDA belgilash (darslik) ·
// s4 savol-oldin-QOIDA · s5 Bit tuzog'i (deyarli bo'linadi) · s6 bo'luvchi va karrali ·
// s7 5 soniya soat · s8 TOKCHAGA SARALASH · s9 test ×3 · s10 BONUS kimning bo'luvchisi ko'p ·
// s11 trenajyor · s12 masala · s13 final 5 savol + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
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
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Делители и кратные числа', uz: "Bo'luvchilar va karrali sonlar" },
    lead: { ru: 'Двенадцать ламп надо разложить в равные ряды', uz: "O'n ikkita lampani teng qatorlarga terish kerak" },
    rail_cap: { ru: 'сегодня работаем с числом 12', uz: 'bugun 12 soni bilan ishlaymiz' },
    q: { ru: 'По сколько ламп можно разложить 12 ровно, без остатка?', uz: "12 lampani nechtadan qilib qoldiqsiz terish mumkin?" },
    opt0: { ru: 'по 4', uz: '4 tadan' },
    opt1: { ru: 'по 5', uz: '5 tadan' },
    opt2: { ru: 'по 7', uz: '7 tadan' },
    opt3: { ru: 'по 8', uz: '8 tadan' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется делители и кратные числа. Узнаем, какие числа делят число ровно, а какие нет.',
          'Бит принёс двенадцать ламп и просит разложить их в равные ряды.',
          'Ряды должны получиться ровными. Лишних ламп остаться не должно.',
          'Как думаешь, по сколько ламп получится разложить ровно?'
        ],
        uz: [
          "Dars mavzusi bo'luvchilar va karrali sonlar deb ataladi. Qaysi sonlar sonni qoldiqsiz bo'lishini bilib olamiz.",
          "Bit o'n ikkita lampa keltirdi va ularni teng qatorlarga terishni so'rayapti.",
          "Qatorlar tekis chiqishi kerak. Ortiqcha lampa qolmasligi lozim.",
          "Sizningcha, nechtadan qilib tersak, tekis chiqadi?"
        ]
      },
      on_correct: {
        ru: 'Верно! По четыре получится ровно три ряда, и ни одной лампы не останется.',
        uz: "To'g'ri! To'rttadan olsak, roppa-rosa uch qator chiqadi, birorta lampa ortmaydi."
      },
      on_wrong1: {
        ru: 'По пять уложится два ряда, и две лампы останутся лишними. Значит, ровно не вышло.',
        uz: "Beshtadan olsak, ikki qator chiqadi, ikkita lampa ortib qoladi. Demak, tekis chiqmadi."
      },
      on_wrong2: {
        ru: 'Семь уложится один раз, и пять ламп останутся.',
        uz: "Yettita bir marta joylashadi, beshta lampa ortib qoladi."
      },
      on_idk: {
        ru: 'Восемь тоже уложится один раз, останутся четыре лампы.',
        uz: "Sakkizta ham bir marta joylashadi, to'rtta lampa ortib qoladi."
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспоминаем', uz: 'Eslaymiz' },
    lead: { ru: 'Одно число, а два разных случая', uz: 'Bitta son, lekin ikki xil holat' },
    tap_label: { ru: 'Нажми на карточку', uz: 'Kartani bosing' },
    card1: { ru: '12 : 4 = 3', uz: '12 : 4 = 3' },
    card1_cap: { ru: 'делится ровно', uz: "qoldiqsiz bo'linadi" },
    card2: { ru: '12 : 5', uz: '12 : 5' },
    card2_cap: { ru: 'два ряда и 2 лампы лишние', uz: 'ikki qator va 2 lampa ortadi' },
    audio: {
      ru: [
        'Одно и то же число, а два разных случая. Открой первую карточку.',
        'Двенадцать разделить на четыре, три. Ровно, ничего не осталось.',
        'А двенадцать на пять ровно не делится. Два ряда есть, и две лампы лишние.',
        'Вот эта разница сегодня и есть главная. Делит ровно или не делит.'
      ],
      uz: [
        "Bitta son, lekin ikki xil holat. Birinchi kartani oching.",
        "O'n ikkini to'rtga bo'lsak, uch. Tekis, hech narsa qolmadi.",
        "O'n ikkini beshga esa qoldiqsiz bo'lib bo'lmaydi. Ikki qator bor, ikkita lampa ortiqcha.",
        "Bugun asosiysi ana shu farq. Qoldiqsiz bo'ladimi yoki yo'qmi."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Разложим 12 всеми ровными способами', uz: "12 ni barcha tekis usullarda teramiz" },
    rows: [
      { by: 1, rows: 12 },
      { by: 2, rows: 6 },
      { by: 3, rows: 4 },
      { by: 4, rows: 3 },
      { by: 6, rows: 2 },
      { by: 12, rows: 1 }
    ],
    list_cap: { ru: 'делители 12', uz: "12 ning bo'luvchilari" },
    btn1: { ru: 'Разложить по одному', uz: 'Bittadan terish' },
    btn2: { ru: 'Дальше по два и по три', uz: 'Keyin ikkitadan va uchtadan' },
    btn3: { ru: 'И остальные способы', uz: 'Qolgan usullar ham' },
    done_text: { ru: 'Шесть способов, шесть чисел. Двенадцать делится ровно на каждое из них.', uz: "Olti usul, olti son. O'n ikki ularning har biriga qoldiqsiz bo'linadi." },
    audio: {
      ru: [
        'Разложим двенадцать всеми способами, какие получаются ровно.',
        'По одному. Двенадцать рядов. Ровно.',
        'По два, шесть рядов. По три, четыре ряда. Тоже ровно.',
        'По четыре, по шесть. И, наконец, все двенадцать в один ряд.',
        'Смотри на список. Один, два, три, четыре, шесть, двенадцать. Это все числа, которые делят двенадцать ровно.'
      ],
      uz: [
        "O'n ikkitani tekis chiqadigan barcha usullarda teramiz.",
        "Bittadan. O'n ikki qator. Tekis.",
        "Ikkitadan, olti qator. Uchtadan, to'rt qator. Bu ham tekis.",
        "To'rttadan, oltitadan. Va nihoyat, hammasi bitta qatorga.",
        "Ro'yxatga qarang. Bir, ikki, uch, to'rt, olti, o'n ikki. Bular o'n ikkini qoldiqsiz bo'ladigan barcha sonlar."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Числовая ось', uz: "Sonlar o'qi" },
    lead: { ru: 'Отметим делители 12 на числовой оси', uz: "12 ning bo'luvchilarini sonlar o'qida belgilaymiz" },
    book_note: { ru: 'задание из учебника, стр. 59', uz: 'kitobdagi topshiriq, 59-bet' },
    divisors: [1, 2, 3, 4, 6, 12],
    others: [5, 7, 8, 9, 10, 11],
    btn1: { ru: 'Зажечь делители', uz: "Bo'luvchilarni yoqish" },
    btn2: { ru: 'А остальные?', uz: 'Qolganlari-chi?' },
    done_text: { ru: 'Шесть отметок из двенадцати. Остальные числа делят двенадцать с остатком.', uz: "O'n ikkitadan oltitasi belgilandi. Qolgan sonlar o'n ikkini qoldiq bilan bo'ladi." },
    audio: {
      ru: [
        'В учебнике это задание есть. Отметить делители двенадцати на числовой оси.',
        'Загораются один, два, три, четыре, шесть и двенадцать.',
        'А пять, семь, восемь, девять, десять и одиннадцать остаются серыми. Они двенадцать ровно не делят.',
        'Заметь края. Единица делит любое число, и само число делит себя. Их часто забывают.'
      ],
      uz: [
        "Kitobda shu topshiriq bor. O'n ikkining bo'luvchilarini sonlar o'qida belgilash.",
        "Bir, ikki, uch, to'rt, olti va o'n ikki yonadi.",
        "Besh, yetti, sakkiz, to'qqiz, o'n va o'n bir esa kulrang qoladi. Ular o'n ikkini qoldiqsiz bo'lmaydi.",
        "Chekkalarga e'tibor bering. Bir har qanday sonni bo'ladi, sonning o'zi ham o'zini bo'ladi. Ularni ko'pincha unutishadi."
      ]
    }
  },

  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Как проверить, делитель ли 5 для числа 12?', uz: "5 soni 12 ning bo'luvchisimi, qanday tekshiramiz?" },
    opts: [
      { ru: 'Разделить и посмотреть на остаток', uz: "Bo'lib ko'rib, qoldiqqa qarash" },
      { ru: 'Сравнить, какое число больше', uz: 'Qaysi son katta ekanini taqqoslash' },
      { ru: 'Сложить их', uz: "Ularni qo'shish" },
      { ru: 'Умножить их', uz: "Ularni ko'paytirish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Больше или меньше тут не решает. Пять меньше двенадцати, но делителем не стало.', uz: "Katta yoki kichikligi bu yerda hal qilmaydi. Besh o'n ikkidan kichik, lekin bo'luvchi bo'lmadi." },
      2: { ru: 'Сложение не проверяет деление.', uz: "Qo'shish bo'lishni tekshirmaydi." },
      3: { ru: 'Умножение помогает искать кратные, а не проверять делителя.', uz: "Ko'paytirish karralilarni topishga yordam beradi, bo'luvchini tekshirishga emas." }
    },
    on_correct: { ru: 'Верно! Делим и смотрим на остаток.', uz: "To'g'ri! Bo'lamiz va qoldiqqa qaraymiz." },
    rule_lines: {
      ru: [
        'делитель — на него делится без остатка',
        'кратное — оно получается умножением',
        'у любого числа делители 1 и оно само'
      ],
      uz: [
        "bo'luvchi — songa qoldiqsiz bo'linadi",
        "karrali — ko'paytirishdan chiqadi",
        "har sonda 1 va sonning o'zi bo'luvchi"
      ]
    },
    rule_ex: '12 : 4 = 3 · 3 · 6 · 9 · 12',
    rule_speech: {
      ru: 'Правило такое. Делитель это число, на которое делится без остатка. Кратное это то, что получается, когда умножаешь. И запомни края. Единица и само число всегда делители.',
      uz: "Qoida shunday. Bo'luvchi bu son unga qoldiqsiz bo'linadigan son. Karrali bu ko'paytirganda chiqadigan son. Chekkalarni ham eslab qoling. Bir va sonning o'zi doim bo'luvchi bo'ladi."
    },
    audio: {
      intro: { ru: 'Теперь главный вопрос урока.', uz: "Endi darsning asosiy savoli." }
    }
  },

  s5: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzogi' },
    lead: { ru: 'Бит считает, что пять почти подходит', uz: "Bit besh deyarli to'g'ri keladi deb o'ylaydi" },
    lines: ['12 : 5', '2 + 2'],
    line_cap: { ru: 'два ряда и две лампы лишние', uz: 'ikki qator va ikkita lampa ortiqcha' },
    trap_label: { ru: 'Прав ли Бит?', uz: 'Bit haqmi?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    trap_correct: {
      ru: 'Точно! Почти не считается. Делитель делит без остатка, а две лишние лампы это уже остаток.',
      uz: "Aniq! Deyarli hisoblanmaydi. Bo'luvchi qoldiqsiz bo'ladi, ikkita ortiqcha lampa esa qoldiq."
    },
    trap_wrong: {
      ru: 'Посмотри на ряды. Две лампы лежат отдельно, ряд неполный. Значит, ровно не разделилось.',
      uz: "Qatorlarga qarang. Ikkita lampa alohida yotibdi, qator to'liq emas. Demak, tekis bo'linmadi."
    },
    audio: {
      ru: [
        'Бит рассуждает так. Двенадцать на пять почти делится, остаётся всего две лампы. Значит, пять подходит!',
        'Прав ли Бит?'
      ],
      uz: [
        "Bit shunday fikr yuritadi. O'n ikki beshga deyarli bo'linadi, bor-yo'g'i ikkita lampa qoladi. Demak, besh to'g'ri keladi!",
        "Bit haqmi?"
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Делители и кратные', uz: "Bo'luvchi va karrali" },
    lead: { ru: 'Два списка смотрят в разные стороны', uz: "Ikki ro'yxat turli tomonga qaraydi" },
    left_title: { ru: 'делители 12', uz: "12 ning bo'luvchilari" },
    left_lines: ['1 · 2 · 3', '4 · 6 · 12', '12 : 4 = 3'],
    left_cap: { ru: 'это те, кто делит 12', uz: "12 ni bo'ladiganlar" },
    right_title: { ru: 'кратные 3', uz: "3 ning karralilari" },
    right_lines: ['3 · 6 · 9', '12 · 15 · 18', '3 × 4 = 12'],
    right_cap: { ru: 'это то, что получается из 3', uz: '3 dan chiqadiganlar' },
    btn1: { ru: 'Делители', uz: "Bo'luvchilar" },
    btn2: { ru: 'Кратные', uz: 'Karralilar' },
    mc_q: { ru: '12 — это кратное трёх или делитель трёх?', uz: "12 soni 3 ning karralisimi yoki bo'luvchisimi?" },
    mc_q_speech: { ru: 'Двенадцать это кратное трёх или делитель трёх?', uz: "O'n ikki uchning karralisimi yoki bo'luvchisimi?" },
    mc_opts: [
      { ru: 'кратное трёх', uz: "3 ning karralisi" },
      { ru: 'делитель трёх', uz: "3 ning bo'luvchisi" },
      { ru: 'и то, и другое', uz: 'ikkalasi ham' },
      { ru: 'ни то, ни другое', uz: 'ikkalasi ham emas' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Делитель не больше самого числа. Двенадцать больше трёх, оно не может делить тройку.', uz: "Bo'luvchi sondan katta bo'lmaydi. O'n ikki uchdan katta, u uchni bo'la olmaydi." },
      2: { ru: 'Так бывает только у числа с самим собой. Здесь числа разные.', uz: "Bunday faqat sonning o'zi bilan bo'ladi. Bu yerda sonlar boshqa." },
      3: { ru: 'Связь есть. Три умножить на четыре, двенадцать, значит двенадцать кратно трём.', uz: "Bog'lanish bor. Uch karra to'rt, o'n ikki, demak o'n ikki uchga karrali." }
    },
    mc_ok: { ru: 'Верно! Двенадцать получается из тройки умножением, значит оно кратное.', uz: "To'g'ri! O'n ikki uchdan ko'paytirish bilan chiqadi, demak u karrali." },
    audio: {
      ru: [
        'Два списка похожи, но смотрят в разные стороны. Нажми и сравни.',
        'Делители двенадцати. Это те, кто делит двенадцать. Они не больше самого числа.',
        'Кратные тройки. Их получают умножением на один, два, три, четыре. И список можно продолжать дальше.',
        'Одно и то же число может быть кратным для одного и делителем для другого. Всё зависит от того, кого с кем сравниваем.'
      ],
      uz: [
        "Ikki ro'yxat o'xshaydi, lekin turli tomonga qaraydi. Bosing va solishtiring.",
        "O'n ikkining bo'luvchilari. Bular o'n ikkini bo'ladigan sonlar. Ular sonning o'zidan katta emas.",
        "Uchning karralilari. Ular bir, ikki, uch, to'rtga ko'paytirib olinadi. Ro'yxatni yana davom ettirsa bo'ladi.",
        "Bitta son biri uchun karrali, boshqasi uchun bo'luvchi bo'lishi mumkin. Hammasi kimni kim bilan solishtirishga bog'liq."
      ]
    }
  },

  s7: {
    eyebrow: { ru: 'Пять секунд', uz: 'Besh soniya' },
    q: { ru: 'Какое число кратно 4?', uz: "Qaysi son 4 ga karrali?" },
    q_speech: { ru: 'Какое число кратно четырём?', uz: "Qaysi son to'rtga karrali?" },
    items: [
      {
        opts: [{ ru: '20', uz: '20' }, { ru: '14', uz: '14' }, { ru: '18', uz: '18' }, { ru: '22', uz: '22' }],
        hints: [
          null,
          { ru: 'Четырнадцать на четыре ровно не делится, останутся две единицы.', uz: "O'n to'rt to'rtga qoldiqsiz bo'linmaydi, ikkita ortadi." },
          { ru: 'Восемнадцать на четыре тоже не делится ровно.', uz: "O'n sakkiz ham to'rtga tekis bo'linmaydi." },
          { ru: 'Двадцать два на четыре не делится, останутся две единицы.', uz: "Yigirma ikki to'rtga bo'linmaydi, ikkita ortadi." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Пять секунд на подумать. Кратное числа четыре получается умножением четвёрки.', uz: "O'ylash uchun besh soniya. To'rtning karralisi to'rtni ko'paytirish bilan chiqadi." },
      on_correct: { ru: 'Успел! Четыре умножить на пять, двадцать.', uz: "Ulguribsiz! To'rt karra besh, yigirma." },
      on_wrong: { ru: 'Умножай четвёрку по порядку и смотри, какое число встретится.', uz: "To'rtni tartib bilan ko'paytiring va qaysi son uchrashini ko'ring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи числа по полкам', uz: 'Sonlarni tokchalarga ajrating' },
    bin_a: { ru: 'делится на 3', uz: "3 ga bo'linadi" },
    bin_b: { ru: 'не делится', uz: "bo'linmaydi" },
    items: [
      { n: 9, a: true, hint: { ru: 'Проверь делением. Девять на три, три ряда ровно.', uz: "Bo'lib tekshiring. To'qqizni uchga bo'lsak, uch qator tekis." } },
      { n: 16, a: false, hint: { ru: 'Шестнадцать на три не делится, одна единица лишняя.', uz: "O'n oltini uchga bo'lib bo'lmaydi, bittasi ortadi." } },
      { n: 21, a: true, hint: { ru: 'Двадцать один на три, семь рядов ровно.', uz: "Yigirma birni uchga bo'lsak, yetti qator tekis." } },
      { n: 22, a: false, hint: { ru: 'Двадцать два на три не делится, одна единица лишняя.', uz: "Yigirma ikkini uchga bo'lib bo'lmaydi, bittasi ortadi." } }
    ],
    audio: {
      intro: { ru: 'Разложи числа по полкам. Слева те, что делятся на три ровно, справа остальные.', uz: "Sonlarni tokchalarga ajrating. Chapda uchga tekis bo'linadiganlar, o'ngda qolganlari." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Раздели на три и посмотри, остаётся ли что-нибудь.', uz: "Uchga bo'lib ko'ring va biror narsa qoladimi, qarang." }
    }
  },

  s9: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    items: [
      {
        q: { ru: 'Сколько делителей у числа 10?', uz: "10 sonining nechta bo'luvchisi bor?" },
        q_speech: { ru: 'Сколько делителей у числа десять?', uz: "O'n sonining nechta bo'luvchisi bor?" },
        opts: [{ ru: '4', uz: '4' }, { ru: '2', uz: '2' }, { ru: '5', uz: '5' }, { ru: '10', uz: '10' }],
        hints: [
          null,
          { ru: 'Ты посчитал только два и пять. Единица и само десять тоже делители.', uz: "Faqat ikki va beshni sanadingiz. Bir va o'nning o'zi ham bo'luvchi." },
          { ru: 'Пять это один из делителей, а вопрос про их количество.', uz: "Besh bu bo'luvchilardan biri, savol esa ularning soni haqida." },
          { ru: 'Десять это само число. Делителей у него четыре.', uz: "O'n bu sonning o'zi. Uning bo'luvchilari to'rtta." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Какое число кратно 6?', uz: "Qaysi son 6 ga karrali?" },
        q_speech: { ru: 'Какое число кратно шести?', uz: "Qaysi son oltiga karrali?" },
        opts: [{ ru: '18', uz: '18' }, { ru: '20', uz: '20' }, { ru: '22', uz: '22' }, { ru: '26', uz: '26' }],
        hints: [
          null,
          { ru: 'Двадцать на шесть не делится ровно.', uz: "Yigirma oltiga tekis bo'linmaydi." },
          { ru: 'Двадцать два тоже не делится на шесть.', uz: "Yigirma ikki ham oltiga bo'linmaydi." },
          { ru: 'Двадцать шесть на шесть не делится, останутся две единицы.', uz: "Yigirma olti oltiga bo'linmaydi, ikkita ortadi." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Какой самый большой делитель числа 15?', uz: "15 sonining eng katta bo'luvchisi qaysi?" },
        q_speech: { ru: 'Какой самый большой делитель числа пятнадцать?', uz: "O'n besh sonining eng katta bo'luvchisi qaysi?" },
        opts: [{ ru: '15', uz: '15' }, { ru: '5', uz: '5' }, { ru: '3', uz: '3' }, { ru: '1', uz: '1' }],
        hints: [
          null,
          { ru: 'Пять делитель, но есть больше.', uz: "Besh bo'luvchi, lekin undan kattasi bor." },
          { ru: 'Три тоже делитель, но не самый большой.', uz: "Uch ham bo'luvchi, lekin eng kattasi emas." },
          { ru: 'Единица самый маленький делитель, а спрашивают про самый большой.', uz: "Bir eng kichik bo'luvchi, savol esa eng katta haqida." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Три вопроса. Помни про края списка, единицу и само число.', uz: "Uch savol. Ro'yxat chekkalarini, bir va sonning o'zini unutmang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Перебери делители по порядку.', uz: "Bo'luvchilarni tartib bilan sanang." }
    }
  },

  s10: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'У разных чисел делителей разное количество', uz: "Turli sonlarning bo'luvchilari soni har xil" },
    left_title: { ru: 'делители 12', uz: "12 ning bo'luvchilari" },
    left_list: '1 · 2 · 3 · 4 · 6 · 12',
    left_count: { ru: 'шесть делителей', uz: "olti bo'luvchi" },
    right_title: { ru: 'делители 7', uz: "7 ning bo'luvchilari" },
    right_list: '1 · 7',
    right_count: { ru: 'два делителя', uz: "ikki bo'luvchi" },
    book_note: { ru: 'в учебнике так же сравнивают 48 и 54', uz: "kitobda ham qirq sakkiz va ellik to'rt solishtiriladi" },
    btn1: { ru: 'Делители 12', uz: "12 ning bo'luvchilari" },
    btn2: { ru: 'Делители 7', uz: "7 ning bo'luvchilari" },
    mc_q: { ru: 'У какого числа делителей больше?', uz: "Qaysi sonning bo'luvchilari ko'p?" },
    mc_q_speech: { ru: 'У какого числа делителей больше, у двенадцати или у семи?', uz: "Qaysi sonning bo'luvchilari ko'p, o'n ikkidami yoki yettidami?" },
    mc_opts: [
      { ru: 'у 12', uz: '12 da' },
      { ru: 'у 7', uz: '7 da' },
      { ru: 'поровну', uz: 'teng' },
      { ru: 'у обоих по одному', uz: 'ikkisida bittadan' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'У семёрки только единица и сама семёрка. Это два делителя.', uz: "Yettida faqat bir va yettining o'zi bor. Bu ikki bo'luvchi." },
      2: { ru: 'Посчитай столбики. Слева шесть чисел, справа два.', uz: "Ustunlarni sanang. Chapda olti son, o'ngda ikki." },
      3: { ru: 'По одному делителю не бывает. Единица и само число уже двое.', uz: "Bitta bo'luvchi bo'lmaydi. Bir va sonning o'zi allaqachon ikkita." }
    },
    mc_ok: { ru: 'Верно! У двенадцати шесть делителей, у семёрки только два.', uz: "To'g'ri! O'n ikkida olti bo'luvchi, yettida esa faqat ikkita." },
    audio: {
      ru: [
        'Небольшой бонус. У разных чисел делителей бывает разное количество.',
        'У двенадцати шесть делителей. Один, два, три, четыре, шесть, двенадцать.',
        'А у семёрки только два. Единица и сама семёрка.',
        'В учебнике такое задание тоже есть. Там сравнивают сорок восемь и пятьдесят четыре.'
      ],
      uz: [
        "Kichik bonus. Turli sonlarning bo'luvchilari soni har xil bo'ladi.",
        "O'n ikkining olti bo'luvchisi bor. Bir, ikki, uch, to'rt, olti, o'n ikki.",
        "Yettida esa faqat ikkita. Bir va yettining o'zi.",
        "Kitobda ham shunday topshiriq bor. U yerda qirq sakkiz va ellik to'rt solishtiriladi."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    items: [
      { q: { ru: 'Сколько делителей у числа 14? Набери ответ.', uz: "14 sonining nechta bo'luvchisi bor? Javobni tering." }, q_speech: { ru: 'Сколько делителей у числа четырнадцать?', uz: "O'n to'rt sonining nechta bo'luvchisi bor?" }, ans: 4, check: '1 · 2 · 7 · 14', hint: { ru: 'Перебери по порядку. Единица, два, семь и само четырнадцать.', uz: "Tartib bilan ko'ring. Bir, ikki, yetti va o'n to'rtning o'zi." } },
      { q: { ru: 'Третье кратное числа 5. Набери ответ.', uz: "5 ning uchinchi karralisi. Javobni tering." }, q_speech: { ru: 'Третье кратное числа пять.', uz: "Beshning uchinchi karralisi." }, ans: 15, check: '5 × 3 = 15', hint: { ru: 'Умножай пятёрку по порядку. Пять, десять, пятнадцать.', uz: "Beshni tartib bilan ko'paytiring. Besh, o'n, o'n besh." } },
      { q: { ru: 'Самый маленький делитель числа 9. Набери ответ.', uz: "9 sonining eng kichik bo'luvchisi. Javobni tering." }, q_speech: { ru: 'Самый маленький делитель числа девять.', uz: "To'qqiz sonining eng kichik bo'luvchisi." }, ans: 1, check: '9 : 1 = 9', hint: { ru: 'Единица делит любое число.', uz: "Bir har qanday sonni bo'ladi." } }
    ],
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    audio: {
      intro: { ru: 'Три задания, и после каждого проверка.', uz: "Uch topshiriq, har biridan keyin tekshirish." },
      on_correct: { ru: 'Верно, и проверка это подтвердила.', uz: "To'g'ri, tekshirish ham buni tasdiqladi." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Задача из теплицы.', uz: 'Issiqxonadan masala.' },
    q: { ru: 'В теплице 36 ламп. Их ставят в ряды по 9. Сколько рядов?', uz: "Issiqxonada 36 lampa bor. Ular 9 tadan qatorlarga qo'yiladi. Nechta qator bo'ladi?" },
    q_speech: { ru: 'В теплице тридцать шесть ламп. Их ставят в ряды по девять. Сколько рядов?', uz: "Issiqxonada o'ttiz olti lampa bor. Ular to'qqiztadan qatorlarga qo'yiladi. Nechta qator bo'ladi?" },
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '36 : 9', uz: '36 : 9' },
      { ru: '36 × 9', uz: '36 × 9' },
      { ru: '36 − 9', uz: '36 − 9' },
      { ru: '9 : 36', uz: '9 : 36' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение соберёт ещё больше ламп, а их всего тридцать шесть.', uz: "Ko'paytirish yana ko'p lampa yig'adi, ular esa jami o'ttiz oltita." },
      2: { ru: 'Вычитание уберёт один ряд, а нужно число рядов.', uz: "Ayirish bitta qatorni olib qo'yadi, bizga esa qatorlar soni kerak." },
      3: { ru: 'Делят большее на меньшее.', uz: "Kattani kichigiga bo'ladilar." }
    },
    pick_ok: { ru: 'Запись верная. Теперь набери ответ.', uz: "Yozuv to'g'ri. Endi javobni tering." },
    ans: 4,
    check: '4 × 9 = 36',
    setup_audio: { ru: 'Задача из теплицы. Тридцать шесть ламп, в ряду по девять. Сначала выбери запись, потом посчитай.', uz: "Issiqxonadan masala. O'ttiz olti lampa, qatorda to'qqiztadan. Avval yozuvni tanlang, keyin hisoblang." },
    audio: {
      intro: { ru: 'Тут пригодится всё правило.', uz: "Bu yerda butun qoida kerak bo'ladi." },
      on_correct: { ru: 'Четыре ряда! И проверка сошлась, четыре умножить на девять, тридцать шесть. Значит, девять делитель тридцати шести.', uz: "To'rt qator! Tekshirish ham mos keldi, to'rt karra to'qqiz, o'ttiz olti. Demak, to'qqiz o'ttiz oltining bo'luvchisi." },
      on_wrong: { ru: 'Тридцать шесть разделить на девять. Сколько рядов уложится?', uz: "O'ttiz oltini to'qqizga bo'ling. Nechta qator joylashadi?" }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Пять вопросов — и блок закрыт', uz: "Besh savol va bo'lim yopiladi" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько делителей у числа 8? Набери ответ.', uz: "8 sonining nechta bo'luvchisi bor? Javobni tering." },
        q_speech: { ru: 'Сколько делителей у числа восемь?', uz: "Sakkiz sonining nechta bo'luvchisi bor?" },
        ans: 4,
        hint: { ru: 'Один, два, четыре и само восемь.', uz: "Bir, ikki, to'rt va sakkizning o'zi." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число кратно 7?', uz: "Qaysi son 7 ga karrali?" },
        q_speech: { ru: 'Какое число кратно семи?', uz: "Qaysi son yettiga karrali?" },
        opt0: { ru: '28', uz: '28' },
        opt1: { ru: '30', uz: '30' },
        opt2: { ru: '32', uz: '32' },
        opt3: { ru: '34', uz: '34' },
        wrong_1: { ru: 'Тридцать на семь не делится ровно.', uz: "O'ttiz yettiga tekis bo'linmaydi." },
        wrong_2: { ru: 'Тридцать два тоже не делится на семь.', uz: "O'ttiz ikki ham yettiga bo'linmaydi." },
        wrong_3: { ru: 'Тридцать четыре на семь не делится.', uz: "O'ttiz to'rt yettiga bo'linmaydi." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какой самый большой делитель числа 24?', uz: "24 sonining eng katta bo'luvchisi qaysi?" },
        q_speech: { ru: 'Какой самый большой делитель числа двадцать четыре?', uz: "Yigirma to'rt sonining eng katta bo'luvchisi qaysi?" },
        opt0: { ru: '24', uz: '24' },
        opt1: { ru: '12', uz: '12' },
        opt2: { ru: '8', uz: '8' },
        opt3: { ru: '6', uz: '6' },
        wrong_1: { ru: 'Двенадцать делитель, но само число больше.', uz: "O'n ikki bo'luvchi, lekin sonning o'zi kattaroq." },
        wrong_2: { ru: 'Восемь делитель, но не самый большой.', uz: "Sakkiz bo'luvchi, lekin eng kattasi emas." },
        wrong_3: { ru: 'Шесть тоже делитель, и тоже не самый большой.', uz: "Olti ham bo'luvchi, u ham eng kattasi emas." }
      },
      {
        kind: 'num',
        q: { ru: 'Четвёртое кратное числа 8. Набери ответ.', uz: "8 ning to'rtinchi karralisi. Javobni tering." },
        q_speech: { ru: 'Четвёртое кратное числа восемь.', uz: "Sakkizning to'rtinchi karralisi." },
        ans: 32,
        hint: { ru: 'Восемь, шестнадцать, двадцать четыре, тридцать два.', uz: "Sakkiz, o'n olti, yigirma to'rt, o'ttiz ikki." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число НЕ кратно 5?', uz: "Qaysi son 5 ga karrali EMAS?" },
        q_speech: { ru: 'Какое число не кратно пяти?', uz: "Qaysi son beshga karrali emas?" },
        opt0: { ru: '13', uz: '13' },
        opt1: { ru: '30', uz: '30' },
        opt2: { ru: '45', uz: '45' },
        opt3: { ru: '25', uz: '25' },
        wrong_1: { ru: 'Это число делится на пять ровно. Ищи другое.', uz: "Bu son beshga tekis bo'linadi. Boshqasini qidiring." },
        wrong_2: { ru: 'Это число делится на пять ровно. Ищи другое.', uz: "Bu son beshga tekis bo'linadi. Boshqasini qidiring." },
        wrong_3: { ru: 'Это число делится на пять ровно. Ищи другое.', uz: "Bu son beshga tekis bo'linadi. Boshqasini qidiring." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'В часе шестьдесят минут, а в году двенадцать месяцев не случайно. У этих чисел очень много делителей: шестьдесят делится на два, три, четыре, пять, шесть, десять, двенадцать, пятнадцать, двадцать и тридцать. Такое число удобно делить на равные части, поэтому его выбрали для времени ещё в древности.',
      uz: "Bir soatda oltmish daqiqa, bir yilda o'n ikki oy bo'lishi tasodif emas. Bu sonlarning bo'luvchilari juda ko'p: oltmish ikkiga, uchga, to'rtga, beshga, oltiga, o'nga, o'n ikkiga, o'n beshga, yigirmaga va o'ttizga bo'linadi. Bunday sonni teng qismlarga bo'lish qulay, shuning uchun uni qadimda vaqt uchun tanlashgan."
    },
    fact_audio: {
      ru: 'В часе шестьдесят минут, а в году двенадцать месяцев не случайно. У этих чисел очень много делителей. Шестьдесят делится на два, на три, на четыре, на пять, на шесть, на десять, на двенадцать, на пятнадцать, на двадцать и на тридцать. Такое число удобно делить на равные части, поэтому его выбрали для времени ещё в древности. Мы весь урок искали делители, и часы с календарём построены на том же.',
      uz: "Bir soatda oltmish daqiqa, bir yilda o'n ikki oy bo'lishi tasodif emas. Bu sonlarning bo'luvchilari juda ko'p. Oltmish ikkiga, uchga, to'rtga, beshga, oltiga, o'nga, o'n ikkiga, o'n beshga, yigirmaga va o'ttizga bo'linadi. Bunday sonni teng qismlarga bo'lish qulay, shuning uchun uni qadimda vaqt uchun tanlashgan. Butun dars bo'luvchilarni qidirdik, soat va taqvim ham xuddi shunga qurilgan."
    },
    audio: {
      intro: { ru: 'Финальная проверка, пять вопросов.', uz: 'Yakuniy tekshiruv, besh savol.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Перебери делители по порядку и проверь остаток.', uz: "Bo'luvchilarni tartib bilan sanang va qoldiqni tekshiring." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Ряды разложены, полки заполнены!', uz: "Qatorlar terildi, tokchalar to'ldi!" },
    cando: { ru: 'Теперь ты находишь делители числа и его кратные.', uz: "Endi siz sonning bo'luvchilarini va karralilarini topasiz." },
    rule_recap: {
      ru: 'Делитель делит без остатка: 12 : 4 = 3. Кратное получается умножением: 3, 6, 9, 12. У любого числа делители 1 и оно само.',
      uz: "Bo'luvchi qoldiqsiz bo'ladi: 12 : 4 = 3. Karrali ko'paytirishdan chiqadi: 3, 6, 9, 12. Har qanday sonda 1 va sonning o'zi bo'luvchi."
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi' },
    conn_refs: { ru: 'урок 9: таблица умножения; урок 14: связь умножения и деления; урок 15: задачи', uz: "9-dars: ko'paytirish jadvali; 14-dars: bog'lanish; 15-dars: masalalar" },
    conn_label_next: { ru: 'дальше', uz: 'keyingi' },
    conn_next: { ru: 'умножение двузначного на однозначное', uz: "ikki xonalini bir xonaliga ko'paytirish" },
    audio: {
      ru: 'Ряды разложены, полки заполнены. И у тебя новое слово. Делитель. Запомни главное. Делитель делит без остатка, кратное получается умножением, а единица и само число делители всегда. Блок про умножение и деление мы прошли. В следующий раз научимся умножать двузначное число!',
      uz: "Qatorlar terildi, tokchalar to'ldi. Sizda esa yangi so'z bor. Bo'luvchi. Asosiysini eslab qoling. Bo'luvchi qoldiqsiz bo'ladi, karrali ko'paytirishdan chiqadi, bir va sonning o'zi esa doim bo'luvchi. Ko'paytirish va bo'lish bo'limini o'tdik. Keyingi safar ikki xonali sonni ko'paytirishni o'rganamiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Сначала вспомним, что умеем.', uz: 'Avval bilganimizni eslaymiz.' },
  s2:  { ru: 'Теперь разложим сами.', uz: "Endi o'zimiz teramiz." },
  s3:  { ru: 'Перенесём это на числовую ось.', uz: "Buni sonlar o'qiga ko'chiramiz." },
  s4:  { ru: 'Соберём это в правило.', uz: "Buni qoidaga yig'amiz." },
  s5:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s6:  { ru: 'Теперь про кратные.', uz: 'Endi karralilar haqida.' },
  s7:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang." },
  s8:  { ru: 'Разложим числа по полкам.', uz: 'Sonlarni tokchalarga ajratamiz.' },
  s9:  { ru: 'Теперь вопросы.', uz: 'Endi savollar.' },
  s10: { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s11: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s12: { ru: 'Задача из теплицы.', uz: 'Issiqxonadan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Блок закрыт. Идём дальше!', uz: "Bo'lim yopildi. Davom etamiz!" }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Ряды разложены, полки заполнены, и теперь ты знаешь, какие числа делят число ровно. Спасибо за помощь!',
  uz: "Missiya bajarildi! Qatorlar terildi, tokchalar to'ldi, endi qaysi sonlar sonni tekis bo'lishini bilasiz. Yordamingiz uchun rahmat!"
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



// --- SARALASH ZALI (D17): 6-darsning `SkywayBg` sahnasi qayta ishlangan.
// O'zgargani: deraza KUNDUZGI va ortida bog' terrasalari (9-dars elementi), relsdagi
// belgilar 1 dan 12 gacha, ularda 12 ning BO'LUVCHILARI yonadi, yugurgich vagon o'rniga
// ikki chekkada saralash tokchalari, rels ustida yorliq 12.
const D17_MARKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const D17_DIVS = [1, 2, 3, 4, 6, 12];
const SortHallBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d17wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d17sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d17floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <linearGradient id="d17shelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#C6AE82"/></linearGradient>
      <radialGradient id="d17sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d17lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d17winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    {/* zal (6-dars karkasi) */}
    <rect x="0" y="0" width="400" height="180" fill="url(#d17wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d17lamp)" opacity="0.26"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    {/* DERAZA: kunduzgi osmon va bog' terrasalari */}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#d17sky)"/>
    <g clipPath="url(#d17winClip)">
      <circle cx="300" cy="48" r="22" fill="url(#d17sun)"/><circle cx="300" cy="48" r="8" fill="#FFF3C4"/>
      <g fill="#FFFFFF" opacity="0.9"><ellipse cx="120" cy="44" rx="18" ry="6"/><ellipse cx="134" cy="41" rx="12" ry="4.6"/></g>
      <rect x="46" y="74" width="308" height="20" fill="#CCE8B8"/>
      {[58, 96, 134, 172, 210, 248, 286, 324].map((x, i) => (
        <g key={`pl${i}`} transform={`translate(${x} 88)`}>
          <path d="M0 0 Q-2 -8 0 -13" stroke="#6FBF8E" strokeWidth="1.8" fill="none"/>
          <circle className="lm-glow" style={{ animationDelay: `${(i % 4) * 0.5}s` }} cx="0" cy="-15" r="3" fill="#FFD98A"/>
        </g>
      ))}
    </g>
    <g fill="none" stroke="#C9B79A" strokeWidth="3"><rect x="42" y="28" width="316" height="70" rx="7"/></g>
    <g stroke="#C9B79A" strokeWidth="2.4" opacity="0.9"><path d="M148 32 V94"/><path d="M256 32 V94"/></g>
    <rect x="42" y="95" width="316" height="5" rx="2" fill="#B4976F"/>
    {/* SON O'QI RELSI: 1 dan 12 gacha, bo'luvchilar yonadi */}
    <text x="200" y="112" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">12</text>
    <line x1="52" y1="132" x2="336" y2="132" stroke="#8FA6B8" strokeWidth="3" strokeLinecap="round"/>
    {D17_MARKS.map((v, i) => {
      const x = 52 + (i * 284) / 11;
      const lit = D17_DIVS.includes(v);
      return (
        <g key={`mk${v}`}>
          <line x1={x} y1={lit ? 124 : 127} x2={x} y2={lit ? 140 : 137} stroke={lit ? '#FF4F28' : '#A9B6C2'} strokeWidth={lit ? 2.6 : 1.6}/>
          {lit && <circle className="lm-glow" style={{ animationDelay: `${i * 0.25}s` }} cx={x} cy="132" r="3.4" fill="#FFD98A"/>}
          <text x={x} y="150" textAnchor="middle" fontSize="7" fontWeight={lit ? 800 : 600} fill={lit ? '#C0392B' : '#8FA0AE'} fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      );
    })}
    {/* IKKI SARALASH TOKCHASI (yugurgich vagon o'rniga) */}
    {[[18, '#A6D8C2'], [378, '#F2CB9E']].map(([x, col], i) => (
      <g key={`sh${i}`} transform={`translate(${x} 100)`}>
        <rect x="-12" y="0" width="24" height="58" rx="4" fill="url(#d17shelf)" stroke="#B4976F" strokeWidth="1"/>
        {[0, 1, 2].map((r) => <rect key={r} x="-10" y={6 + r * 18} width="20" height="3" rx="1.5" fill="#B4976F" opacity="0.7"/>)}
        <rect x="-12" y="-9" width="24" height="8" rx="2" fill={col}/>
      </g>
    ))}
    {/* pol */}
    <rect x="0" y="176" width="400" height="54" fill="url(#d17floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/></g>
    <g transform="translate(388 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
);

// Sahna + ekipaj (donor naqshi, faqat fon boshqa).
const SortScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <SortHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};


const NumPad = ({ value, setValue, disabled, max = 2 }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className="mono" style={{ minWidth: 120, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${T.accent}`, background: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: 4, padding: '0 14px' }}>{value || '—'}</div>
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
  // Savol matnida belgi (56 : 7), OVOZDA esa so'z bilan — KONTENT_3SINF.md «Ovoz variantlari».
  useEffect(() => {
    if (done || audio.muted || !it || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
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

// --- QATORLAR MASSIVI (9 va 13-darsdan `ArrayViz`): rows × cols nurli lampa.
const ArrayViz = ({ rows, cols }) => (
  <div className="d17-array">
    {Array.from({ length: rows }).map((_, r) => (
      <span key={r} className="d17-array-row">
        {Array.from({ length: cols }).map((_, c) => (
          <span key={c} className="d17-array-cell g1-pop-in" style={{ animationDelay: `${(r * cols + c) * 0.03}s` }}><Chiroq/></span>
        ))}
      </span>
    ))}
  </div>
);

// --- SONLAR O'QI (6-darsning `NumLine` si asosida, birlik qadam va yonuvchi belgilar bilan).
// Metodist qoidasi: yangi mexanika emas, mavjud komponentni darsga moslash.
const NumLineUnits = ({ lo = 1, hi = 12, lit = [], dim = [] }) => {
  const W = 340, pad = 22, y = 40;
  const xp = (v) => pad + ((v - lo) / (hi - lo)) * (W - 2 * pad);
  const marks = [];
  for (let v = lo; v <= hi; v += 1) marks.push(v);
  return (
    <svg viewBox={`0 0 ${W} 66`} style={{ width: 'min(340px, 99%)', height: 'auto' }} aria-hidden="true">
      <line x1={xp(lo)} y1={y} x2={xp(hi)} y2={y} stroke={T.ink3} strokeWidth="2"/>
      {marks.map((v) => {
        const on = lit.includes(v);
        const off = dim.includes(v);
        return (
          <g key={v}>
            <line x1={xp(v)} y1={y - (on ? 9 : 5)} x2={xp(v)} y2={y + (on ? 9 : 5)} stroke={on ? T.accent : T.ink3} strokeWidth={on ? 2.6 : 1.4}/>
            {on && <circle className="lm-glow" cx={xp(v)} cy={y} r="4.2" fill="#FFD98A"/>}
            <text x={xp(v)} y={y + 22} textAnchor="middle" fontSize="10" fontWeight={on ? 800 : 600}
              fill={on ? T.accent : (off ? T.ink3 : T.ink2)} fontFamily="'JetBrains Mono', monospace">{v}</text>
          </g>
        );
      })}
    </svg>
  );
};



// --- FACTCARD QAHRAMONI: soat siferblati teng bo'laklarga bo'linadi (60 va 12 ning
// bo'luvchilari ko'p — shuning uchun vaqt shu sonlarga qurilgan).
const ClockFig = () => (
  <svg viewBox="0 0 200 120" style={{ width: 'min(260px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d17dial" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6E9"/><stop offset="100%" stopColor="#F1E2C6"/></linearGradient>
    </defs>
    <circle cx="100" cy="60" r="44" fill="url(#d17dial)" stroke="#C9B79A" strokeWidth="3"/>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const r1 = 36, r2 = 42;
      const big = i % 3 === 0;
      return (
        <line key={i} x1={100 + Math.cos(a) * r1} y1={60 + Math.sin(a) * r1}
          x2={100 + Math.cos(a) * r2} y2={60 + Math.sin(a) * r2}
          stroke={big ? '#FF4F28' : '#B4976F'} strokeWidth={big ? 3 : 1.6} strokeLinecap="round"/>
      );
    })}
    {/* teng bo'laklar navbat bilan yonadi */}
    <g className="d17-slice"><path d="M100 60 L100 16 A44 44 0 0 1 144 60 Z" fill="#FFD98A" opacity="0.55"/></g>
    <g className="d17-slice" style={{ animationDelay: '1s' }}><path d="M100 60 L144 60 A44 44 0 0 1 100 104 Z" fill="#A6D8C2" opacity="0.5"/></g>
    <line x1="100" y1="60" x2="100" y2="32" stroke="#3A3530" strokeWidth="3" strokeLinecap="round"/>
    <line x1="100" y1="60" x2="122" y2="60" stroke="#3A3530" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="100" cy="60" r="4" fill="#3A3530"/>
    <text x="100" y="115" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">12 · 60</text>
  </svg>
);

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
        <div className="frame fade-up delay-1 d17-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <SortScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d17-heap">
              {Array.from({ length: 12 }).map((_, i) => <span key={i} className="d17-heap-lamp"><Chiroq/></span>)}
            </span>
            <span className="d17-note">{t(c.rail_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
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

// s1 — KO'PRIK: ikki karta (tekis bo'linadi va bo'linmaydi)
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
                  <span className="mono lm-reveal" style={{ fontSize: 'clamp(17px, 3.2vw, 24px)', fontWeight: 800, color: i === 0 ? '#1F7A4D' : '#C0392B' }}>{t(cd.v)}</span>
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

// s2 — BO'LUVCHILAR MODELI: 12 ta lampa turli qatorlarga terilib chiqadi (TAP)
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
  // qadam 1 -> bittadan, qadam 2 -> ikkitadan va uchtadan, qadam 3 -> qolganlari
  const shownCount = step === 0 ? 0 : (step === 1 ? 1 : (step === 2 ? 3 : 6));
  const shown = c.rows.slice(0, shownCount);
  const list = shown.map((r) => r.by).join(' · ');
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : c.btn3);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <div className="d17-rowset">
            {shown.map((r) => (
              <span key={r.by} className="d17-rowbox lm-reveal">
                <ArrayViz rows={r.rows} cols={r.by}/>
                <span className="mono d17-rowcap">{`12 : ${r.by} = ${r.rows}`}</span>
              </span>
            ))}
          </div>
          {shownCount > 0 && (
            <span className="d17-list lm-reveal">
              <span className="d17-note">{t(c.list_cap)}</span>
              <span className="mono d17-list-nums">{list}</span>
            </span>
          )}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(12px, 1.9vw, 15px)' }}>{t(btnLabel)}</button>
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

// s3 — SONLAR O'QIDA BELGILASH (darslik 59-bet, 1a topshiriq)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's3_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's3_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's3_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <span className="d17-note">{t(c.book_note)}</span>
          <NumLineUnits lo={1} hi={12} lit={step >= 1 ? c.divisors : []} dim={step >= 2 ? c.others : []}/>
          {step >= 1 && <span className="mono d17-list-nums lm-reveal">{c.divisors.join(' · ')}</span>}
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

// s4 — SAVOL-OLDIN-QOIDA
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    { id: 's4_0', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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

// s5 — BIT TUZOG'I (M4: «deyarli bo'linadi»)
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's5_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
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
          {/* ikki qator va ikkita ortiqcha lampa — xato ko'rinib tursin */}
          <div className="d17-rowset">
            <span className="d17-rowbox"><ArrayViz rows={2} cols={5}/><span className="mono d17-rowcap">{c.lines[0]}</span></span>
            <span className="d17-rowbox d17-rowbox-extra">
              <span className="d17-array"><span className="d17-array-row">{[0, 1].map((i) => <span key={i} className="d17-array-cell"><Chiroq/></span>)}</span></span>
              <span className="mono d17-rowcap">{t(c.line_cap)}</span>
            </span>
          </div>
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

// s6 — BO'LUVCHILAR va KARRALILAR: ikki panel + savol
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s6;
  const audio = useAudio([
    brgSeg('s6', lang),
    { id: 's6_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's6_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's6_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's6_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
  useEffect(() => {
    if (!built || audio.muted || !c.mc_q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_q_speech[lang]);
  }, [built]);
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
    <div className={`d15-pan ${shown ? 'd15-pan-on' : ''}`}>
      <span className="mono d15-pan-title">{t(title)}</span>
      {lines.map((l, i) => (i === 0 || shown) && (
        <span key={i} className={`mono d15-pan-line ${i === 2 ? 'd15-pan-res' : ''} ${i > 0 ? 'lm-reveal' : ''}`}
          style={{ animationDelay: `${i * 0.2}s`, color: i === 2 ? (tone === 'a' ? '#1F7A4D' : '#2E5AA8') : T.ink }}>{l}</span>
      ))}
      {shown && <span className="d15-pan-cap lm-reveal" style={{ animationDelay: '0.5s' }}>{t(cap)}</span>}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div className="d15-panrow">
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
                  style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(42px, 6vw, 52px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
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

// s7 — 5 SONIYA SOAT
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s7;
  const it0 = c.items[0];
  const items = React.useMemo(() => {
    const order = shuffleArr(it0.opts.map((_, i) => i));
    return { opts: order.map((i) => it0.opts[i]), hints: order.map((i) => it0.hints[i]), ci: order.indexOf(it0.ci) };
  }, []);
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
        correctAnswer: '20', studentAnswer: '20', correct: firstRef.current,
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

// s8 — SARALASH: chip va ikki tokcha (1-dars mexanikasi, demo bosqichisiz)
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s8;
  const audio = useAudio([
    brgSeg('s8', lang),
    { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
      <span className="lm-bin-slot mono">{okBin === key ? it.n : ''}</span>
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
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{it.n}</button>
                  : <span className="lm-digtray-empty mono">{it.n}</span>}
              </div>
              <div className="d17-bins">
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

// s9 — TEST MC ×3 (rasm YO'Q, metodist qoidasi 15-darsdan)
const Screen9 = (props) => {
  const t = useT();
  const heading = (it) => t(it.q);
  const renderFig = () => null;
  return <MCRoundD2 props={props} ck="s9" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s10 — BONUS: kimning bo'luvchisi ko'p (darslik 59-bet g'oyasi)
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s10;
  const audio = useAudio([
    brgSeg('s10', lang),
    ...c.audio[lang].map((text, i) => ({
      id: `s10_${i}`,
      text,
      trigger: i === 0 ? 'after_previous' : (i === 3 ? 'after_previous' : `on_event:step${i}`),
      waits_for: null
    }))
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
  useEffect(() => {
    if (!built || audio.muted || !c.mc_q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_q_speech[lang]);
  }, [built]);
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
  const col = (title, list, count, shown) => (
    <div className={`d15-pan ${shown ? 'd15-pan-on' : ''}`}>
      <span className="mono d15-pan-title">{t(title)}</span>
      {shown ? (
        <>
          <span className="mono d15-pan-line lm-reveal">{list}</span>
          <span className="d15-pan-cap lm-reveal" style={{ animationDelay: '0.3s' }}>{t(count)}</span>
        </>
      ) : <span className="mono d15-pan-line" style={{ color: T.ink3 }}>?</span>}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.6vw, 11px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <div className="d15-panrow">
            {col(c.left_title, c.left_list, c.left_count, step >= 1)}
            {col(c.right_title, c.right_list, c.right_count, step >= 2)}
          </div>
          {step >= 2 && <span className="d17-note lm-reveal">{t(c.book_note)}</span>}
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(12px, 1.9vw, 15px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
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
                  style={{ padding: 'clamp(8px, 1.4vw, 11px)', fontSize: 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(40px, 5.6vw, 50px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
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

// s11 — TRENAJYOR NumPad ×3 + tekshirish satri
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s11;
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [hintMsg, setHintMsg] = useState(null);
  const [showCheck, setShowCheck] = useState(props.storedAnswer !== undefined);
  const triedRef = useRef(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  useEffect(() => {
    if (done || audio.muted || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const check = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      setShowCheck(true);
      if (!triedRef.current) setScore((s) => s + 1);
      setTimeout(() => {
        if (idx + 1 < c.items.length) { setVal(''); setShowCheck(false); }
        setNumLock(false); setHintMsg(null); triedRef.current = false; setIdx((n) => n + 1);
      }, 2100);
    } else {
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
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
              {(showCheck || done) && <CheckStrip expr={it.check} cap={t(c.check_label)} ok/>}
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

// s12 — MASALA: yozuv + javob + tekshirish
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
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.audio.on_wrong); setTimeout(() => { setVal(''); setNumLock(false); }, 1500); }
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
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
              {!solved && (
                <>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d17-res lm-reveal">{c.ans}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s11.check_label)} ok/>}
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

// s13 — FINAL 5 savol + FactCard
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
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1700);
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
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
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
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(15px, 2.4vw, 20px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
              <div className="d2-fact-hero"><ClockFig/></div>
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
        <div className="d17-final-scene fade-up delay-1"><SortScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function DivisorsLesson({
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
.d15-panrow { display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); width: 100%; justify-content: center; }
.d15-pan { flex: 1 1 clamp(130px, 40%, 220px); display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: clamp(8px, 1.8vw, 13px); border-radius: 12px; background: #F6F4EF; border: 2px dashed #D8D2C4; }
.d15-pan-on { background: #FFFFFF; border-style: solid; border-color: #E6D9BC; box-shadow: 0 3px 0 rgba(190,170,130,.28); }
.d15-pan-title { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 800; color: #5A5A60; text-transform: uppercase; letter-spacing: .5px; }
.d15-pan-line { font-size: clamp(13px, 2.3vw, 18px); font-weight: 800; }
.d15-pan-res { font-size: clamp(15px, 2.8vw, 21px); }
.d15-pan-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-align: center; }
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
.d17-heap { display: inline-flex; flex-wrap: wrap; justify-content: center; gap: clamp(2px, 0.8vw, 5px);
  max-width: 300px; padding: clamp(4px, 1vw, 7px) clamp(6px, 1.4vw, 10px); border-radius: 10px;
  background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d17-heap-lamp { display: inline-flex; width: clamp(14px, 3.4vw, 20px); height: clamp(14px, 3.4vw, 20px); }
.d17-heap-lamp svg { width: 100%; height: 100%; }
/* --- QATORLAR MASSIVI (ArrayViz) --- */
.d17-array { display: inline-flex; flex-direction: column; gap: 2px; padding: clamp(3px, 0.8vw, 5px);
  border-radius: 8px; background: rgba(226,242,251,.55); box-shadow: inset 0 0 0 1px rgba(120,160,190,.25); }
.d17-array-row { display: flex; gap: 2px; }
.d17-array-cell { display: inline-flex; width: clamp(7px, 1.7vw, 11px); height: clamp(7px, 1.7vw, 11px); }
.d17-array-cell svg { width: 100%; height: 100%; }
.d17-rowset { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: clamp(6px, 1.6vw, 12px); }
.d17-rowbox { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.d17-rowbox-extra { opacity: 0.95; }
.d17-rowcap { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; }
/* --- BO'LUVCHILAR RO'YXATI --- */
.d17-list { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.d17-list-nums { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #FF4F28; letter-spacing: 1px; }
.d17-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d17-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
/* --- IKKI TOKCHA (1-darsning lm-bin mexanikasi) --- */
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: clamp(44px, 10vw, 58px); align-items: center; }
.lm-digtray-empty { font-size: clamp(18px, 4vw, 24px); font-weight: 800; color: #C4BEB4; letter-spacing: 2px; }
.lm-digchip { width: clamp(42px, 9vw, 56px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF;
  font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; cursor: pointer;
  box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.d17-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 420px; }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none;
  border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #E3F0E8; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.35); }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-bin-slot { width: clamp(36px, 8vw, 50px); height: clamp(40px, 9vw, 56px); display: flex; align-items: center; justify-content: center;
  border-radius: 10px; background: #FFFFFF; font-size: clamp(20px, 4.4vw, 30px); font-weight: 800; color: #3A3530;
  box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.lm-bin:disabled { cursor: default; }
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d17-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d17-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* --- FACTCARD: soat teng bo'laklarga bo'linadi --- */
.d17-slice { animation: d17slice 4s ease-in-out infinite; transform-origin: 100px 60px; }
@keyframes d17slice { 0%, 45%, 100% { opacity: 0; } 15%, 30% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d17-slice { animation: none; opacity: .6; } }
`;
