import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars19 — "Qoldiqli bo'lish" (num-3-19) | Б3 «USTAXONA»
// Syujet: «teng ulash» (SYUJET_3SINF.md 161-satr). O'n bitta detalni ikki stolga teng
//   tarqatib bo'lmaydi — ortgani LAGANGA tushadi, va shu narsa QOLDIQ deb ataladi.
// SAHNA: blokka bitta fon (17-darsning ustaxonasi), ishchi tugun BOSHQA: TENG ULASH STOLI
//   va yonida ORTIQCHA LAGANI.
// MEXANIKA (yangi mexanika YARATILMAGAN): MC xuk, TAP bilan ochilish (ikki ekran),
//   savol-oldin-qoida, Bit tuzog'i (yopiq maydon), tokchaga saralash, konsol ikki katak
//   (bo'linma va qoldiq), bitta savolli MC va NumPad, xatoni top, BONUS (podbor),
//   masala jadval bilan, final panel + FactCard.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 30-bet «Qoldiqli bo'lish»):
//   qoida DOSLOVEN — «qoldiq son bo'luvchidan doim kichik bo'lishi kerak»;
//   kitob rasmi: 11 : 2 = 5 (qold. 1), 11 : 3 = 3 (qold. 2), 11 : 4 = 2 (qold. 3);
//   2-topshiriq sonlari: 25 : 2, 53 : 4, 38 : 3, 95 : 12 (BONUS), 75 : 6;
//   31-bet 6-topshiriq: 55 : 3, 74 : 6 (masala), 2-topshiriq: 47 : 5.
// YADRO: bitta son 11, uch xil bo'luvchi — qoldiq har safar boshqa.
// Misconception: M1 qoldiq bo'luvchidan katta; M2 «deyarli bo'lindi», qoldiq tashlanadi;
//   M3 qoldiq bo'linmaga yozib qo'yiladi; M4 bo'linma o'rniga bo'luvchi olinadi.
// FactCard: qoldiq taqvimda ishlaydi — chorshanbadan yigirma kun keyin seshanba.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 19». Karkas: BLOK_B3_KARKAS.md.
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
  lessonId: 'num-3-19',
  lessonTitle: { ru: 'Урок 19. Деление с остатком', uz: "19-dars. Qoldiqli bo'lish" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 19»): s0 xuk 11:2 · s1 tarqatish · s2 11:3 va 11:4 ·
// s3 savol-oldin-QOIDA · s4 Bit tuzog'i · s5 saralash · s6 test 25:2 · s7 konsol 38:3 ·
// s8 xatoni top 53:4 · s9 BONUS 95:12 · s10 test yozuvlar · s11 trenajyor 53:4 ·
// s12 masala 74:6 · s13 final 3 misol + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
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
    topic: { ru: 'Деление с остатком', uz: "Qoldiqli bo'lish" },
    lead: { ru: '11 деталей раздают на 2 стола поровну', uz: "11 ta detal 2 stolga tengdan tarqatiladi" },
    order_cap: { ru: 'раздать поровну, лишнее — в лоток', uz: "tengdan tarqatish, ortiqchasi — laganga" },
    q: { ru: 'Сколько деталей на каждом столе и сколько останется?', uz: "Har bir stolda nechta detal bo'ladi va nechtasi ortadi?" },
    opt0: { ru: 'по 5, останется 1', uz: "5 tadan, 1 ta ortadi" },
    opt1: { ru: 'по 6, не останется', uz: "6 tadan, ortmaydi" },
    opt2: { ru: 'по 5, останется 2', uz: "5 tadan, 2 ta ortadi" },
    opt3: { ru: 'по 4, останется 3', uz: "4 tadan, 3 ta ortadi" },
    audio: {
      intro: {
        ru: [
          'Тема урока называется деление с остатком.',
          'На стол раздачи привезли одиннадцать деталей. Их раздают на два стола поровну.',
          'Поровну одиннадцать не делится. Что-то обязательно останется.',
          'Как думаешь, сколько будет на каждом столе и сколько останется?'
        ],
        uz: [
          "Dars mavzusi qoldiqli bo'lish deb ataladi.",
          "Tarqatish stoliga o'n bitta detal keldi. Ular ikki stolga tengdan tarqatiladi.",
          "O'n bir tengdan bo'linmaydi. Albatta biror narsa ortib qoladi.",
          "Sizningcha, har bir stolda nechtadan bo'ladi va nechtasi ortadi?"
        ]
      },
      on_correct: {
        ru: 'Верно! По пять на стол, и одна деталь лишняя. Эту лишнюю и называют остатком.',
        uz: "To'g'ri! Har stolga beshtadan, bitta detal ortiqcha. Ana shu ortiqchani qoldiq deyishadi."
      },
      on_wrong1: {
        ru: 'По шесть на два стола это двенадцать, а деталей одиннадцать. Одной не хватит.',
        uz: "Ikki stolga oltitadan bu o'n ikki, detal esa o'n bitta. Bittasi yetmaydi."
      },
      on_wrong2: {
        ru: 'По пять на два стола это десять. Останется одна деталь, а не две.',
        uz: "Ikki stolga beshtadan bu o'n. Bitta detal ortadi, ikkita emas."
      },
      on_idk: {
        ru: 'По четыре на два стола это восемь. Тогда останется три, но их ещё можно раздать.',
        uz: "Ikki stolga to'rttadan bu sakkiz. Unda uchta ortadi, lekin ularni yana tarqatsa bo'ladi."
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбираем', uz: 'Ajratamiz' },
    lead: { ru: 'Раздаём 11 деталей на 2 стола', uz: "11 ta detalni 2 stolga tarqatamiz" },
    rows: 2,
    per: 5,
    rest: 1,
    formula: '11 : 2 = 5 (ост. 1)',
    formula_uz: '11 : 2 = 5 (qold. 1)',
    btn1: { ru: 'Раздать поровну', uz: 'Tengdan tarqatish' },
    btn2: { ru: 'Что осталось?', uz: 'Nima ortdi?' },
    done_text: { ru: 'Пять на столе, одна в лотке. Лишнее и есть остаток.', uz: "Beshtadan stolda, bittasi laganda. Ortiqchasi qoldiq bo'ladi." },
    audio: {
      ru: [
        'Раздаём одиннадцать деталей на два стола.',
        'По пять на каждый стол. Это десять деталей.',
        'Одна деталь не поместилась в раздачу. Её кладут в лоток. Это остаток.'
      ],
      uz: [
        "O'n bitta detalni ikki stolga tarqatamiz.",
        "Har bir stolga beshtadan. Bu o'nta detal.",
        "Bitta detal tarqatishga sig'madi. Uni laganga qo'yishadi. Bu qoldiq."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Те же 11 деталей на 3 и на 4 стола', uz: "O'sha 11 detal 3 va 4 stolga" },
    book_note: { ru: 'рисунок из учебника, стр. 30', uz: 'kitobdagi rasm, 30-bet' },
    cases: [
      { div: 3, per: 3, rest: 2, line: '11 : 3 = 3 (ост. 2)', line_uz: '11 : 3 = 3 (qold. 2)' },
      { div: 4, per: 2, rest: 3, line: '11 : 4 = 2 (ост. 3)', line_uz: '11 : 4 = 2 (qold. 3)' }
    ],
    btn1: { ru: 'На 3 стола', uz: '3 stolga' },
    btn2: { ru: 'На 4 стола', uz: '4 stolga' },
    done_text: { ru: 'Число одно, а остатки разные. Всё зависит от того, на сколько делим.', uz: "Son bitta, qoldiqlar esa har xil. Hammasi nechaga bo'lishga bog'liq." },
    audio: {
      ru: [
        'Возьмём те же одиннадцать деталей, но столов будет больше.',
        'На три стола по три детали, и две останутся.',
        'На четыре стола по две детали, и три останутся. Число одно, а остатки разные.'
      ],
      uz: [
        "O'sha o'n bitta detalni olamiz, lekin stollar ko'proq bo'ladi.",
        "Uch stolga uchtadan, ikkitasi ortadi.",
        "To'rt stolga ikkitadan, uchtasi ortadi. Son bitta, qoldiqlar esa har xil."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Каким должен быть остаток?', uz: 'Qoldiq qanday bo\'lishi kerak?' },
    opts: [
      { ru: 'меньше делителя', uz: "bo'luvchidan kichik" },
      { ru: 'меньше частного', uz: "bo'linmadan kichik" },
      { ru: 'больше делителя', uz: "bo'luvchidan katta" },
      { ru: 'любым', uz: 'har qanday' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'На частное остаток не смотрит. Сравнивай его с тем, на сколько делим.', uz: "Qoldiq bo'linmaga qaramaydi. Uni nechaga bo'layotganingiz bilan solishtiring." },
      2: { ru: 'Если остаток больше делителя, значит каждому можно дать ещё по одной.', uz: "Qoldiq bo'luvchidan katta bo'lsa, demak har biriga yana bittadan berish mumkin." },
      3: { ru: 'Не любым. Из остатка нельзя раздать ещё один полный круг.', uz: "Har qanday emas. Qoldiqdan yana bitta to'liq aylana tarqatib bo'lmaydi." }
    },
    on_correct: { ru: 'Верно! Остаток всегда меньше делителя.', uz: "To'g'ri! Qoldiq doim bo'luvchidan kichik." },
    rule_lines: {
      ru: [
        'остаток всегда меньше делителя',
        'иначе можно раздать ещё по одной',
        'остаток бывает и нулём — тогда делится ровно'
      ],
      uz: [
        "qoldiq doim bo'luvchidan kichik",
        "aks holda yana bittadan tarqatish mumkin",
        "qoldiq nol ham bo'ladi — u holda tekis bo'linadi"
      ]
    },
    rule_ex: '11 : 2 = 5 (1) · 11 : 3 = 3 (2) · 11 : 4 = 2 (3)',
    rule_speech: {
      ru: 'Правило такое. Остаток всегда меньше делителя. Если он получился больше или равен, значит каждому можно дать ещё по одной детали. А если остаток ноль, число разделилось ровно.',
      uz: "Qoida shunday. Qoldiq doim bo'luvchidan kichik. Agar u katta yoki teng chiqsa, demak har biriga yana bittadan berish mumkin. Qoldiq nol bo'lsa, son tekis bo'lingan."
    },
    audio: {
      intro: { ru: 'Теперь главный вопрос урока.', uz: 'Endi darsning asosiy savoli.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzogi' },
    lead: { ru: 'Бит разделил 11 на 3 вот так', uz: "Bit 11 ni 3 ga mana bunday bo'ldi" },
    lines: ['11 : 3 = 2', '(ост. 5)'],
    line_cap: { ru: 'два на каждый стол, пять в лотке', uz: 'har stolga ikkitadan, beshtasi laganda' },
    trap_label: { ru: 'Прав ли Бит?', uz: 'Bit haqmi?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    trap_correct: {
      ru: 'Точно! Пять больше трёх, значит каждому столу можно дать ещё по одной. Останется два.',
      uz: "Aniq! Besh uchdan katta, demak har bir stolga yana bittadan berish mumkin. Ikkitasi ortadi."
    },
    trap_wrong: {
      ru: 'Посмотри на лоток. Там пять деталей, а столов три. Каждому хватит ещё по одной.',
      uz: "Laganga qarang. U yerda beshta detal, stollar esa uchta. Har biriga yana bittadan yetadi."
    },
    audio: {
      ru: [
        'Бит раздал одиннадцать деталей на три стола. По две на стол, и пять положил в лоток.',
        'Прав ли Бит?'
      ],
      uz: [
        "Bit o'n bitta detalni uch stolga tarqatdi. Har stolga ikkitadan, beshtasini laganga qo'ydi.",
        "Bit haqmi?"
      ]
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи примеры по полкам', uz: 'Misollarni tokchalarga ajrating' },
    bin_a: { ru: 'делится ровно', uz: "tekis bo'linadi" },
    bin_b: { ru: 'с остатком', uz: 'qoldiq bilan' },
    items: [
      { n: '24 : 3', a: true, hint: { ru: 'Двадцать четыре на три, восемь. В лотке пусто.', uz: "Yigirma to'rtni uchga bo'lsak, sakkiz. Lagan bo'sh." } },
      { n: '25 : 2', a: false, hint: { ru: 'По двенадцать на два стола это двадцать четыре. Одна деталь останется.', uz: "Ikki stolga o'n ikkitadan bu yigirma to'rt. Bitta detal ortadi." } },
      { n: '36 : 6', a: true, hint: { ru: 'Тридцать шесть на шесть, шесть. Лишних нет.', uz: "O'ttiz oltini oltiga bo'lsak, olti. Ortiqcha yo'q." } },
      { n: '38 : 3', a: false, hint: { ru: 'По двенадцать на три стола это тридцать шесть. Две детали останутся.', uz: "Uch stolga o'n ikkitadan bu o'ttiz olti. Ikkita detal ortadi." } }
    ],
    audio: {
      intro: { ru: 'Разложи примеры по полкам. Слева те, где в лотке пусто, справа те, где что-то остаётся.', uz: "Misollarni tokchalarga ajrating. Chapda lagan bo'sh qoladiganlari, o'ngda biror narsa ortadiganlari." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Раздели и посмотри в лоток.', uz: "Bo'ling va laganga qarang." }
    }
  },

  s6: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    q: { ru: '25 : 2. Сколько останется?', uz: '25 : 2. Nechtasi ortadi?' },
    opts: [
      { ru: '1', uz: '1' },
      { ru: '2', uz: '2' },
      { ru: '5', uz: '5' },
      { ru: '0', uz: '0' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Остаток должен быть меньше двух. Двойка не подходит.', uz: "Qoldiq ikkidan kichik bo'lishi kerak. Ikki to'g'ri kelmaydi." },
      2: { ru: 'Пять больше двух, значит можно раздать ещё. Раздай до конца.', uz: "Besh ikkidan katta, demak yana tarqatish mumkin. Oxirigacha tarqating." },
      3: { ru: 'Двадцать пять на два ровно не делится, ведь число нечётное.', uz: "Yigirma beshni ikkiga tekis bo'lib bo'lmaydi, chunki son toq." }
    },
    audio: {
      intro: { ru: 'Двадцать пять деталей на два стола. Сколько окажется в лотке?', uz: "Yigirma beshta detal ikki stolga. Laganda nechtasi qoladi?" },
      on_correct: { ru: 'Верно! По двенадцать на стол, и одна в лотке.', uz: "To'g'ri! Har stolga o'n ikkitadan, bittasi laganda." },
      on_wrong: { ru: 'Раздавай, пока в лотке не станет меньше двух.', uz: "Laganda ikkitadan kam qolguncha tarqating." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: '38 : 3 — частное и остаток', uz: "38 : 3 — bo'linma va qoldiq" },
    swap_line: '38 : 3',
    cells: [
      { head: { ru: 'на каждый стол', uz: 'har stolga' }, label: '38 : 3', ans: 12, hint: { ru: 'По сколько выйдет на стол? Тридцать шесть раздаются поровну.', uz: "Har stolga nechtadan chiqadi? O'ttiz olti tengdan tarqaladi." } },
      { head: { ru: 'в лотке', uz: 'laganda' }, label: '38 − 36', ans: 2, hint: { ru: 'Раздали тридцать шесть. Сколько осталось от тридцати восьми?', uz: "O'ttiz olti tarqatildi. O'ttiz sakkizdan nechtasi qoldi?" } }
    ],
    check: '12 · 3 + 2 = 38',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    audio: {
      intro: { ru: 'Тридцать восемь деталей на три стола. Сначала найди, по сколько на стол, потом сколько в лотке.', uz: "O'ttiz sakkizta detal uch stolga. Avval har stolga nechtadan tushishini, keyin laganda nechta qolishini toping." },
      on_correct: { ru: 'Верно! Двенадцать на стол и две в лотке.', uz: "To'g'ri! Har stolga o'n ikkitadan, ikkitasi laganda." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'В записи спряталась ошибка. Где она?', uz: 'Yozuvga xato yashiringan. U qayerda?' },
    fig_line: '53 : 4 = 12 (ост. 5)',
    opts: [
      { ru: 'остаток больше делителя', uz: "qoldiq bo'luvchidan katta" },
      { ru: 'частное слишком большое', uz: "bo'linma juda katta" },
      { ru: 'делитель записан неверно', uz: "bo'luvchi noto'g'ri yozilgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Частное как раз маловато. Но сначала посмотри на лоток.', uz: "Bo'linma aksincha kichik. Lekin avval laganga qarang." },
      2: { ru: 'Делитель четыре, так и было в задании.', uz: "Bo'luvchi to'rt, topshiriqda ham shunday edi." },
      3: { ru: 'Сравни остаток и делитель. Пять больше четырёх.', uz: "Qoldiq bilan bo'luvchini solishtiring. Besh to'rtdan katta." }
    },
    audio: {
      intro: {
        ru: ['Пятьдесят три детали на четыре стола. Кто-то раздал по двенадцать и оставил пять.', 'Найди ошибку в записи.'],
        uz: ["Ellik uchta detal to'rt stolga. Kimdir o'n ikkitadan tarqatib, beshtasini qoldirdi.", 'Yozuvdagi xatoni toping.']
      },
      on_correct: { ru: 'Точно! Пять больше четырёх. Раздаём ещё по одной. Тринадцать на стол и одна в лотке.', uz: "Aniq! Besh to'rtdan katta. Yana bittadan tarqatamiz. Har stolga o'n uchtadan, bittasi laganda." },
      on_wrong: { ru: 'Сравни остаток с делителем.', uz: "Qoldiqni bo'luvchi bilan solishtiring." }
    }
  },

  s9: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'А если столов двенадцать?', uz: "Stollar o'n ikkita bo'lsa-chi?" },
    task_line: '95 : 12',
    task_cap: { ru: 'подбираем, как в прошлом уроке', uz: "o'tgan darsdagidek tanlaymiz" },
    step1: '12 · 7 = 84',
    step1_cap: { ru: 'помещается', uz: "sig'adi" },
    step2: '12 · 8 = 96',
    step2_cap: { ru: 'уже много', uz: "bu ko'p" },
    res: '95 : 12 = 7 (ост. 11)',
    btn1: { ru: 'Взять семь раз', uz: 'Yetti marta olish' },
    btn2: { ru: 'А восемь?', uz: 'Sakkiz-chi?' },
    mc_q: { ru: 'Остаток 11 — так можно?', uz: 'Qoldiq 11 — shunday bo\'ladimi?' },
    mc_opts: [
      { ru: 'да, ведь 11 меньше 12', uz: "ha, chunki 11 son 12 dan kichik" },
      { ru: 'нет, остаток слишком большой', uz: "yo'q, qoldiq juda katta" },
      { ru: 'нет, остаток всегда меньше десяти', uz: "yo'q, qoldiq doim o'ndan kichik" },
      { ru: 'да, остаток может быть любым', uz: "ha, qoldiq har qanday bo'ladi" }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Большой он только на вид. Сравнивать надо с делителем, а не с другими остатками.', uz: "U faqat ko'rinishdan katta. Bo'luvchi bilan solishtirish kerak, boshqa qoldiqlar bilan emas." },
      2: { ru: 'Такого правила нет. Остаток сравнивают только с делителем.', uz: "Bunday qoida yo'q. Qoldiq faqat bo'luvchi bilan solishtiriladi." },
      3: { ru: 'Любым он быть не может: двенадцать в остатке означало бы ещё один полный круг.', uz: "Har qanday bo'la olmaydi: qoldiqda o'n ikki bo'lsa, yana bitta to'liq aylana chiqadi." }
    },
    mc_ok: { ru: 'Верно! Одиннадцать меньше двенадцати, значит остаток правильный.', uz: "To'g'ri! O'n bir o'n ikkidan kichik, demak qoldiq to'g'ri." },
    audio: {
      ru: [
        'Небольшой бонус. А если столов сразу двенадцать? Разложить на части тут не выйдет.',
        'Подбираем, как в прошлом уроке. Двенадцать умножить на семь, восемьдесят четыре. Помещается.',
        'Двенадцать умножить на восемь, девяносто шесть. Это уже больше девяноста пяти.',
        'Значит, по семь на стол, а в лотке одиннадцать деталей.'
      ],
      uz: [
        "Kichik bonus. Stollar birdaniga o'n ikkita bo'lsa-chi? Bu yerda qismlarga ajratib bo'lmaydi.",
        "O'tgan darsdagidek tanlaymiz. O'n ikki karra yetti, sakson to'rt. Sig'adi.",
        "O'n ikki karra sakkiz, to'qson olti. Bu to'qson beshdan katta.",
        "Demak, har stolga yettitadan, laganda esa o'n bitta detal."
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    q: { ru: 'В какой записи остаток возможен?', uz: 'Qaysi yozuvda qoldiq mumkin?' },
    opts: [
      { ru: '29 : 5 = 5 (ост. 4)', uz: '29 : 5 = 5 (qold. 4)' },
      { ru: '29 : 5 = 4 (ост. 9)', uz: '29 : 5 = 4 (qold. 9)' },
      { ru: '29 : 5 = 5 (ост. 5)', uz: '29 : 5 = 5 (qold. 5)' },
      { ru: '29 : 5 = 6 (ост. 1)', uz: '29 : 5 = 6 (qold. 1)' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Девять больше пяти. Из лотка можно раздать ещё по одной.', uz: "To'qqiz beshdan katta. Lagandan yana bittadan tarqatsa bo'ladi." },
      2: { ru: 'Остаток равен делителю. Это тоже ещё один полный круг.', uz: "Qoldiq bo'luvchiga teng. Bu ham yana bitta to'liq aylana." },
      3: { ru: 'Шесть на пять это тридцать, а деталей двадцать девять. Столько раздать нельзя.', uz: "Olti karra besh o'ttiz, detal esa yigirma to'qqizta. Bunchasini tarqatib bo'lmaydi." }
    },
    audio: {
      intro: { ru: 'Четыре записи одного деления. Верной может быть только одна.', uz: "Bitta bo'lishning to'rt yozuvi. Faqat bittasi to'g'ri bo'lishi mumkin." },
      on_correct: { ru: 'Верно! Пять на пять двадцать пять, и четыре в лотке. Четыре меньше пяти.', uz: "To'g'ri! Besh karra besh yigirma besh, to'rttasi laganda. To'rt beshdan kichik." },
      on_wrong: { ru: 'Проверь два условия. Раздали не больше, чем было, и остаток меньше делителя.', uz: "Ikki shartni tekshiring. Boridan ko'p tarqatilmagan va qoldiq bo'luvchidan kichik." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    q: { ru: '53 : 4. Сколько на каждом столе?', uz: '53 : 4. Har bir stolda nechta?' },
    ans: 13,
    check: '13 · 4 + 1 = 53',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    hint: { ru: 'Сорок на четыре это десять, ещё двенадцать на четыре это три. Вместе тринадцать, и одна останется.', uz: "Qirqni to'rtga bo'lsak o'n, yana o'n ikkini to'rtga bo'lsak uch. Birgalikda o'n uch, bittasi ortadi." },
    audio: {
      intro: { ru: 'Пятьдесят три детали на четыре стола. Набери, по сколько выйдет на стол.', uz: "Ellik uchta detal to'rt stolga. Har stolga nechtadan chiqishini tering." },
      on_correct: { ru: 'Верно! Тринадцать на стол, одна в лотке. Проверка сошлась.', uz: "To'g'ri! Har stolga o'n uchtadan, bittasi laganda. Tekshirish mos keldi." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.' },
    q: { ru: 'В мастерской 74 детали. В один ящик входит 6 деталей. Сколько ящиков наполнится и сколько деталей останется?', uz: "Ustaxonada 74 ta detal bor. Bitta yashikka 6 ta detal sig'adi. Nechta yashik to'ladi va nechta detal ortadi?" },
    q_speech: { ru: 'Семьдесят четыре детали, в ящик входит шесть. Сколько ящиков наполнится и сколько останется?', uz: "Yetmish to'rtta detal, yashikka oltita sig'adi. Nechta yashik to'ladi va nechtasi ortadi?" },
    tbl_heads: [
      { ru: 'Всего деталей', uz: 'Jami detal' },
      { ru: 'В ящик входит', uz: "Yashikka sig'adi" },
      { ru: 'Ящиков', uz: 'Yashiklar' }
    ],
    tbl_cells: ['74', '6', '?'],
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '74 : 6', uz: '74 : 6' },
      { ru: '74 · 6', uz: '74 · 6' },
      { ru: '74 − 6', uz: '74 − 6' },
      { ru: '6 : 74', uz: '6 : 74' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение соберёт ещё больше деталей, а их всего семьдесят четыре.', uz: "Ko'paytirish yana ko'p detal yig'adi, ular esa jami yetmish to'rtta." },
      2: { ru: 'Вычитание уберёт один ящик, а нужно число ящиков.', uz: "Ayirish bitta yashikni olib qo'yadi, bizga esa yashiklar soni kerak." },
      3: { ru: 'Делят большее на меньшее. Детали раскладывают по ящикам.', uz: "Kattani kichigiga bo'ladilar. Detallar yashiklarga taqsimlanadi." }
    },
    pick_ok: { ru: 'Запись верная. Теперь считай по шагам.', uz: "Yozuv to'g'ri. Endi qadamlab hisoblang." },
    step1_q: { ru: 'Сколько ящиков наполнится?', uz: "Nechta yashik to'ladi?" },
    ans1: 12,
    hint1: { ru: 'Шестьдесят на шесть это десять, ещё двенадцать на шесть это два.', uz: "Oltmishni oltiga bo'lsak o'n, yana o'n ikkini oltiga bo'lsak ikki." },
    step2_q: { ru: 'Сколько деталей останется?', uz: 'Nechta detal ortadi?' },
    ans2: 2,
    hint2: { ru: 'Двенадцать ящиков по шесть это семьдесят две детали. Сколько осталось от семидесяти четырёх?', uz: "O'n ikki yashik oltitadan bu yetmish ikkita detal. Yetmish to'rttadan nechtasi qoldi?" },
    check: '12 · 6 + 2 = 74',
    setup_audio: { ru: 'Задача из мастерской. Семьдесят четыре детали и ящики по шесть. Сначала выбери запись, потом считай по шагам.', uz: "Ustaxonadan masala. Yetmish to'rtta detal va oltitadan yashiklar. Avval yozuvni tanlang, keyin qadamlab hisoblang." },
    audio: {
      intro: { ru: 'Тут пригодятся и частное, и остаток.', uz: "Bu yerda bo'linma ham, qoldiq ham kerak bo'ladi." },
      on_correct: { ru: 'Двенадцать полных ящиков и две детали сверху! Проверка сошлась.', uz: "O'n ikkita to'la yashik va ikkita ortiqcha detal! Tekshirish mos keldi." },
      on_wrong: { ru: 'Посчитай ещё раз, по шагам.', uz: 'Yana bir bor, qadamlab hisoblang.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Три примера — и остаток твой', uz: 'Uch misol va qoldiq sizniki' },
    items: [
      {
        kind: 'num',
        q: { ru: '75 : 6. Сколько останется? Набери ответ.', uz: '75 : 6. Nechtasi ortadi? Javobni tering.' },
        q_speech: { ru: 'Семьдесят пять разделить на шесть. Сколько останется?', uz: "Yetmish beshni oltiga bo'lish. Nechtasi ortadi?" },
        ans: 3,
        hint: { ru: 'По двенадцать на шесть столов это семьдесят две.', uz: "Olti stolga o'n ikkitadan bu yetmish ikki." }
      },
      {
        kind: 'mc',
        q: { ru: '55 : 3 = ?', uz: '55 : 3 = ?' },
        q_speech: { ru: 'Пятьдесят пять разделить на три.', uz: "Ellik beshni uchga bo'lish." },
        opt0: { ru: '18 (ост. 1)', uz: '18 (qold. 1)' },
        opt1: { ru: '17 (ост. 4)', uz: '17 (qold. 4)' },
        opt2: { ru: '18 (ост. 3)', uz: '18 (qold. 3)' },
        opt3: { ru: '19 (ост. 2)', uz: '19 (qold. 2)' },
        wrong_1: { ru: 'Четыре больше трёх, значит можно раздать ещё по одной.', uz: "To'rt uchdan katta, demak yana bittadan tarqatish mumkin." },
        wrong_2: { ru: 'Остаток равен делителю. Это ещё один полный круг.', uz: "Qoldiq bo'luvchiga teng. Bu yana bitta to'liq aylana." },
        wrong_3: { ru: 'Девятнадцать на три это пятьдесят семь, а деталей пятьдесят пять.', uz: "O'n to'qqiz karra uch ellik yetti, detal esa ellik beshta." }
      },
      {
        kind: 'mc',
        q: { ru: '47 : 5 = ?', uz: '47 : 5 = ?' },
        q_speech: { ru: 'Сорок семь разделить на пять.', uz: "Qirq yettini beshga bo'lish." },
        opt0: { ru: '9 (ост. 2)', uz: '9 (qold. 2)' },
        opt1: { ru: '8 (ост. 7)', uz: '8 (qold. 7)' },
        opt2: { ru: '9 (ост. 5)', uz: '9 (qold. 5)' },
        opt3: { ru: '10 (ост. 3)', uz: '10 (qold. 3)' },
        wrong_1: { ru: 'Семь больше пяти. Раздай ещё по одной.', uz: "Yetti beshdan katta. Yana bittadan tarqating." },
        wrong_2: { ru: 'Остаток равен делителю, так не бывает.', uz: "Qoldiq bo'luvchiga teng, bunday bo'lmaydi." },
        wrong_3: { ru: 'Десять на пять это пятьдесят, а деталей сорок семь.', uz: "O'n karra besh ellik, detal esa qirq yettita." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Остаток работает как часы. Если сегодня среда и прошло двадцать дней, какой будет день? Двадцать разделить на семь это две недели и остаток шесть. Две полные недели ничего не меняют, важен только остаток: отсчитай шесть дней от среды и получишь вторник. Поэтому календарь и расписание держатся на остатке.',
      uz: "Qoldiq soatdek ishlaydi. Bugun chorshanba bo'lsa va yigirma kun o'tsa, qaysi kun bo'ladi? Yigirmani yettiga bo'lsak, ikki hafta va olti qoldiq. Ikki to'liq hafta hech narsani o'zgartirmaydi, faqat qoldiq muhim: chorshanbadan olti kun sanang, seshanba chiqadi. Shuning uchun taqvim va jadval qoldiqqa tayanadi."
    },
    fact_audio: {
      ru: 'Остаток работает как часы. Если сегодня среда и прошло двадцать дней, какой будет день? Двадцать разделить на семь это две недели и остаток шесть. Две полные недели ничего не меняют, важен только остаток. Отсчитай шесть дней от среды и получишь вторник. Поэтому календарь и расписание держатся на остатке. Мы весь урок искали то, что остаётся, и вот где это работает каждый день.',
      uz: "Qoldiq soatdek ishlaydi. Bugun chorshanba bo'lsa va yigirma kun o'tsa, qaysi kun bo'ladi? Yigirmani yettiga bo'lsak, ikki hafta va olti qoldiq. Ikki to'liq hafta hech narsani o'zgartirmaydi, faqat qoldiq muhim. Chorshanbadan olti kun sanang, seshanba chiqadi. Shuning uchun taqvim va jadval qoldiqqa tayanadi. Butun dars ortib qoladigan narsani qidirdik, mana u har kuni qayerda ishlaydi."
    },
    audio: {
      intro: { ru: 'Финальная проверка, три примера.', uz: 'Yakuniy tekshiruv, uch misol.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Раздавай, пока в лотке не станет меньше делителя.', uz: "Laganda bo'luvchidan kam qolguncha tarqating." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Раздача закончена, лоток на месте!', uz: 'Tarqatish tugadi, lagan joyida!' },
    cando: { ru: 'Теперь ты делишь с остатком и знаешь, каким остаток быть не может.', uz: "Endi siz qoldiq bilan bo'lasiz va qoldiq qanday bo'la olmasligini bilasiz." },
    rule_recap: {
      ru: '11 : 2 = 5 (ост. 1). Остаток всегда меньше делителя, иначе можно раздать ещё по одной.',
      uz: "11 : 2 = 5 (qold. 1). Qoldiq doim bo'luvchidan kichik, aks holda yana bittadan tarqatish mumkin."
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi' },
    conn_refs: { ru: 'урок 16: делится ровно или нет; урок 18: деление по частям', uz: "16-dars: tekis bo'linadimi; 18-dars: qismlab bo'lish" },
    conn_label_next: { ru: 'дальше', uz: 'keyingi' },
    conn_next: { ru: 'проверка деления с остатком', uz: "qoldiqli bo'lishni tekshirish" },
    audio: {
      ru: 'Раздача закончена, и лоток стоит на месте. Запомни главное. Остаток всегда меньше делителя, иначе можно раздать ещё по одной. А как убедиться, что разделил верно? В следующий раз научимся проверять!',
      uz: "Tarqatish tugadi, lagan joyida turibdi. Asosiysini eslab qoling. Qoldiq doim bo'luvchidan kichik, aks holda yana bittadan tarqatish mumkin. To'g'ri bo'lganiga qanday ishonch hosil qilamiz? Keyingi safar tekshirishni o'rganamiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Начнём с раздачи.', uz: 'Tarqatishdan boshlaymiz.' },
  s2:  { ru: 'То же число, но столов больше.', uz: "O'sha son, lekin stollar ko'proq." },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'А вот и Бит со своей раздачей.', uz: "Mana Bit ham o'z tarqatishi bilan." },
  s5:  { ru: 'Разложи по полкам.', uz: 'Tokchalarga ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Соберём по частям.', uz: "Qismlab yig'amiz." },
  s8:  { ru: 'Кто-то ошибся в записи.', uz: 'Kimdir yozuvda xato qildi.' },
  s9:  { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s10: { ru: 'Четыре записи, одна верная.', uz: "To'rt yozuv, bittasi to'g'ri." },
  s11: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s12: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Раздача закончена. Идём дальше!', uz: 'Tarqatish tugadi. Davom etamiz!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Детали разданы поровну, лишние в лотке, и теперь ты знаешь слово остаток. Спасибо за помощь!',
  uz: "Missiya bajarildi! Detallar tengdan tarqatildi, ortiqchasi laganda, endi siz qoldiq so'zini bilasiz. Yordamingiz uchun rahmat!"
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



// --- TENG ULASH STOLI (D19): blokning umumiy foni (17-darsning ustaxonasi) SAQLANADI,
// ishchi tugun BOSHQA: markazda uzun teng ulash stoli, chekkada ORTIQCHA LAGANI —
// tarqatishga sig'magan detallar shu yerga tushadi.
const ShareBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d19wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d19sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d19floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <linearGradient id="d19tbl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#C6AE82"/></linearGradient>
      <radialGradient id="d19sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d19lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d19winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    <rect x="0" y="0" width="400" height="180" fill="url(#d19wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d19lamp)" opacity="0.26"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#d19sky)"/>
    <g clipPath="url(#d19winClip)">
      <circle cx="96" cy="48" r="20" fill="url(#d19sun)"/><circle cx="96" cy="48" r="7" fill="#FFF3C4"/>
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
    {/* TENG ULASH STOLI: ikki teng bo'lim, har birida beshtadan detal */}
    <rect x="66" y="120" width="212" height="46" rx="6" fill="url(#d19tbl)" stroke="#B4976F" strokeWidth="1.6"/>
    <line x1="172" y1="122" x2="172" y2="164" stroke="#B4976F" strokeWidth="1.6" strokeDasharray="3 3"/>
    {[0, 1].map((half) => (
      <g key={`hf${half}`} transform={`translate(${74 + half * 106} 128)`}>
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x={(k % 3) * 20} y={Math.floor(k / 3) * 16} width="16" height="11" rx="2.5" fill="#F2A85C" stroke="#C97F35" strokeWidth="0.8"/>
        ))}
      </g>
    ))}
    <text x="172" y="116" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">TENGDAN</text>
    {/* ORTIQCHA LAGANI: bitta detal */}
    <g transform="translate(300 124)">
      <path d="M0 6 h58 l-6 30 h-46 Z" fill="#C3A87E" stroke="#9A8058" strokeWidth="1.4"/>
      <rect x="-2" y="1" width="62" height="6" rx="2.4" fill="#D9C29D" stroke="#9A8058" strokeWidth="1.2"/>
      <rect x="21" y="14" width="16" height="11" rx="2.5" fill="#F2A85C" stroke="#C97F35" strokeWidth="0.9"/>
      <text x="29" y="46" textAnchor="middle" fontSize="7" fontWeight="800" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">ORTDI</text>
    </g>
    <path d="M150 174 h100 l10 18 h-120 Z" fill="#C3A87E"/><rect x="146" y="190" width="108" height="4" fill="#A98C64"/>
    <g transform="translate(12 128)">
      <rect x="0" y="0" width="46" height="46" rx="5" fill="#C3A87E" opacity="0.55"/>
      {[0, 1, 2, 3].map((k) => (
        <rect key={`bx${k}`} x={6 + (k % 2) * 19} y={7 + Math.floor(k / 2) * 18} width="16" height="11" rx="2.5" fill="#F2A85C" stroke="#C97F35" strokeWidth="0.8"/>
      ))}
    </g>
    <rect x="0" y="176" width="400" height="54" fill="url(#d19floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
);

const ShareScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <ShareBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};
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





// --- DETAL (17 va 18-darsdan): bitta plashka.
const PartSVG = () => (
  <svg viewBox="0 0 16 11" className="d19-part" aria-hidden="true">
    <rect x="0.6" y="0.6" width="14.8" height="9.8" rx="2.4" fill="#F2A85C" stroke="#C97F35" strokeWidth="1"/>
  </svg>
);

// --- TARQATISH: stollar va ORTIQCHA LAGANI. Bolaga qoldiq shu yerda ko'rinadi —
// stolda tengdan, laganda ortgani. rows = stollar soni, per = har stolda, rest = qoldiq.
const ShareBoard = ({ rows, per, rest, label }) => (
  <span className="d19-board">
    <span className="d19-tables">
      {Array.from({ length: rows }).map((_, r) => (
        <span key={r} className="d19-table">
          {Array.from({ length: per }).map((_, k) => <PartSVG key={k}/>)}
        </span>
      ))}
    </span>
    <span className={`d19-tray ${rest ? 'd19-tray-full' : 'd19-tray-empty'}`}>
      <span className="d19-tray-head mono">{label}</span>
      <span className="d19-tray-body">
        {rest > 0 ? Array.from({ length: rest }).map((_, k) => <PartSVG key={k}/>) : <span className="mono d19-tray-zero">0</span>}
      </span>
    </span>
  </span>
);

// --- FACTCARD QAHRAMONI: hafta doirasi, qoldiq bo'yicha kun topiladi.
const WeekFig = () => (
  <svg viewBox="0 0 200 120" style={{ width: 'min(260px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d19dial" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6E9"/><stop offset="100%" stopColor="#F1E2C6"/></linearGradient>
    </defs>
    <circle cx="100" cy="58" r="42" fill="url(#d19dial)" stroke="#C9B79A" strokeWidth="3"/>
    {Array.from({ length: 7 }).map((_, i) => {
      const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
      const x = 100 + Math.cos(a) * 32;
      const y = 58 + Math.sin(a) * 32;
      const hot = i === 2 || i === 1;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={hot ? 8 : 6} fill={i === 2 ? '#FFD98A' : (i === 1 ? '#A6D8C2' : '#FFFFFF')} stroke={hot ? '#C97F35' : '#C9B79A'} strokeWidth="1.6"/>
          <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fontWeight="800" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{i + 1}</text>
        </g>
      );
    })}
    <g className="d19-arc"><path d="M100 58 L100 26" stroke="#FF4F28" strokeWidth="2.6" strokeLinecap="round"/></g>
    <text x="100" y="62" textAnchor="middle" fontSize="9" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">20 : 7</text>
    <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">2 hafta va 6 qoldiq</text>
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
          {figLine && <span className="mono d19-errline">{figLine}</span>}
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
        <div className="frame fade-up delay-1 d19-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <ShareScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d19-order">
              <span className="mono d19-order-plate">11</span>
              <span className="d19-order-sep mono">:</span>
              <span className="mono d19-order-plate">2</span>
            </span>
            <span className="d19-note">{t(c.order_cap)}</span>
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

// s1 — TARQATISH: 11 detal 2 stolga, ortgani laganda (TAP bilan)
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
  const trayLabel = lang === 'ru' ? 'в лотке' : 'laganda';
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          {step === 0 && <span className="mono d19-plate">11</span>}
          {step >= 1 && (
            <span className="lm-reveal">
              <ShareBoard rows={c.rows} per={c.per} rest={step >= 2 ? c.rest : 0} label={trayLabel}/>
            </span>
          )}
          {step >= 2 && <span className="mono d19-final lm-reveal">{lang === 'ru' ? c.formula : c.formula_uz}</span>}
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

// s2 — O'SHA 11, boshqa bo'luvchilar (darslik 30-bet rasmi)
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
  const trayLabel = lang === 'ru' ? 'в лотке' : 'laganda';
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.2vw, 9px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.2vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <span className="d19-note">{t(c.book_note)}</span>
          <div className="d19-caserow">
            {c.cases.map((cs, i) => (step >= i + 1 ? (
              <span key={cs.div} className="d19-case lm-reveal">
                <ShareBoard rows={cs.div} per={cs.per} rest={cs.rest} label={trayLabel}/>
                <span className="mono d19-expr">{lang === 'ru' ? cs.line : cs.line_uz}</span>
              </span>
            ) : null))}
          </div>
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

// s4 — BIT TUZOG'I: qoldiq bo'luvchidan katta (yopiq maydon)
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
  const trayLabel = lang === 'ru' ? 'в лотке' : 'laganda';
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <ShareBoard rows={3} per={2} rest={5} label={trayLabel}/>
          <span className="mono d19-bad">{c.lines[0]} {c.lines[1]}</span>
          <span className="d19-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="d19-trap">
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
              <div className="d19-bins">
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
          <span className="mono d19-expr">{c.swap_line}</span>
          <div className="lm-console" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 320 }}>
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2} state={numState}/>
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

// s9 — BONUS: ikki xonali bo'luvchi (95 : 12), 18-darsning podbori davomi
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's9_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's9_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's9_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.2vw, 9px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.2vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <span className="mono d19-plate">{c.task_line}</span>
          <span className="d19-note">{t(c.task_cap)}</span>
          {step >= 1 && (
            <span className="d19-case lm-reveal" style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
              <span className="mono d19-expr">{c.step1}</span>
              <span className="d19-note" style={{ color: '#1F7A4D' }}>{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="d19-case lm-reveal" style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
              <span className="mono d19-expr">{c.step2}</span>
              <span className="d19-note" style={{ color: '#C0392B' }}>{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d19-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
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
                  style={{ padding: 'clamp(8px, 1.4vw, 11px)', fontSize: 'clamp(11.5px, 1.7vw, 14px)', minHeight: 'clamp(40px, 5.6vw, 50px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.mc_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TEST: qaysi yozuvda qoldiq mumkin
const Screen10 = (props) => <MCOne props={props} ck="s10" mono/>;

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
                  <span className="d19-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d19-res lm-reveal">{c.ans1} · {c.ans2}</span>}
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
              <div className="d2-fact-hero"><WeekFig/></div>
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
        <div className="d19-final-scene fade-up delay-1"><ShareScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function RemainderLesson({
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
.d19-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d19-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d19-order-sep { font-size: clamp(13px, 2.4vw, 17px); font-weight: 800; color: #8A8378; }
.d19-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }

/* --- TARQATISH DOSKASI --- */
.d19-part { width: clamp(13px, 2.8vw, 17px); height: auto; display: block; }
.d19-board { display: inline-flex; align-items: flex-start; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; justify-content: center; }
.d19-tables { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 7px); }
.d19-table { display: inline-flex; flex-wrap: wrap; gap: 3px; max-width: clamp(120px, 30vw, 190px);
  padding: clamp(4px, 1vw, 7px); border-radius: 10px; background: rgba(255,236,200,.5);
  box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d19-tray { display: inline-flex; flex-direction: column; align-items: center; gap: 3px;
  padding: clamp(4px, 1vw, 7px) clamp(6px, 1.4vw, 10px); border-radius: 10px; }
.d19-tray-full { background: rgba(255,79,40,.07); box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.34); }
.d19-tray-empty { background: rgba(31,122,77,.07); box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.3); }
.d19-tray-head { font-size: clamp(8.5px, 1.4vw, 10.5px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.d19-tray-body { display: inline-flex; flex-wrap: wrap; gap: 3px; justify-content: center; min-width: clamp(30px, 7vw, 42px); }
.d19-tray-zero { font-size: clamp(13px, 2.6vw, 18px); font-weight: 800; color: #1F7A4D; }

/* --- IFODA SATRLARI --- */
.d19-expr { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #3A3530; }
.d19-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d19-bad { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #C0392B; }
.d19-errline { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); }
.d19-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d19-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d19-plate { font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #0E0E10; padding: 4px 16px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d19-caserow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 2vw, 16px); }
.d19-case { display: flex; flex-direction: column; align-items: center; gap: 4px; }

.d19-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 440px; }

/* --- YOPIQ MAYDON (Bit tuzog'i) --- */
.d19-trap { display: flex; gap: 10px; justify-content: center; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d19-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d19-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: hafta strelkasi --- */
.d19-arc { animation: d19arc 4s ease-in-out infinite; transform-origin: 100px 58px; }
@keyframes d19arc { 0%, 10% { transform: rotate(0deg); } 55%, 100% { transform: rotate(308deg); } }
@media (prefers-reduced-motion: reduce) { .d19-arc { animation: none; } }
`;
