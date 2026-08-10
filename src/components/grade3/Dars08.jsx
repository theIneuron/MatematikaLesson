import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars08 — "Sanoq sistemalari; Rim raqamlari" (num-3-08) | B1 | belgi-devor
// Syujet: Bit sayyorasi LUMO, belgi-devor (SYUJET_3SINF.md B1 d.8, B1 yakuni). Qadimiy
//   belgilar bilan son o'qish/yozish. Bit — mezbon-gid. Darslik: matematika_3_uzb.pdf 88-89-bet.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: I V X L C; kichik belgi o'ngda->qo'shiladi (VI=6), chapda->ayiriladi (IX=9); 3 martadan ko'p yo'q.
// MEXANIKA: recall pozitsion/nopozitsion (s1), belgilar jadvali (s2), qo'shuv (s3), ayiruv (s4),
//   QOIDA (s5), Rim->son MC (s6), son->Rim MC (s7), xatoni top (s8), oy masala (s9),
//   final panel (s10), yakun (s11). RomanBig (belgi vizuali). Audio TTS-toza: harf ovozda emas, tasvirda.
// Misconception: M1 qo'shuv/ayiruv chalkash (IV=6), M2 o'rin muhim deb (XI vs IX), M3 belgi qiymati, M4 IIII.
//
// FREE_NAV=true (blokirovka o'chiq — push oldidan false ga qaytariladi).
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
const TOTAL_SCREENS = 12;
const LESSON_META = {
  lessonId: 'num-3-08',
  lessonTitle: { ru: 'Урок 8. Римские цифры', uz: "8-dars. Rim raqamlari" }
};
// STRUKTURA (12 ekran): s0 hook · s1–s4 kashfiyot · s5 qoida · s6–s9 mashq · s10 final · s11 xulosa.
// Syujet: Bit sayyorasi Lumo, belgi-devor (SYUJET_3SINF.md Б1 d.8).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars08 «Rim raqamlari» (num-3-08). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: Rim belgilari (I V X L C) · belgi-devor. Lumo shahri, Bit sayyorasi.
// ============================================================

const CONTENT = {
  // s0 — HOOK: belgi-devor, IV qaysi son (ayiruv seed)
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: римские цифры', uz: 'Mavzu: Rim raqamlari' },
    lead: { ru: 'На стене Бита числа записаны знаками.', uz: 'Bit devorida sonlar belgilar bilan yozilgan.' },
    roman: 'IV',
    q: { ru: 'Какое это число?', uz: 'Bu qaysi son?' },
    opt0: { ru: '4', uz: '4' },
    opt1: { ru: '6', uz: '6' },
    opt2: { ru: '51', uz: '51' },
    audio: {
      intro: {
        ru: [
          'Тема урока — римские цифры. Научимся читать и записывать числа древними знаками.',
          'В прошлой области заработал счётный терминал. Теперь Бит показывает стену со старыми знаками.',
          'Такими знаками писали в древнем Риме. Вот один знак, за ним ещё один.',
          'Маленький знак стоит слева от большего. Как думаешь, какое это число? Выбери вариант.'
        ],
        uz: [
          "Dars mavzusi — Rim raqamlari. Sonlarni qadimiy belgilar bilan o'qish va yozishni o'rganamiz.",
          "O'tgan hududda hisob terminali ishga tushdi. Endi Bit eski belgili devorni ko'rsatadi.",
          "Bunday belgilar bilan qadimgi Rimda yozishgan. Mana bitta belgi, uning ketidan yana bittasi.",
          "Kichik belgi kattaroq belgidan chapda turibdi. Sizningcha, bu qaysi son? Variantni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Маленький знак слева отнимается: пять минус один это четыре.', uz: "To'g'ri. Kichik belgi chapda ayiriladi: besh ayir bir bu to'rt." },
      on_wrong: { ru: 'Смотри на порядок. Маленький знак слева отнимается, не прибавляется.', uz: "Tartibga qarang. Kichik belgi chapda ayiriladi, qo'shilmaydi." }
    }
  },

  // s1 — RECALL/kirish: pozitsion va nopozitsion
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'У наших цифр важно место. У знаков — нет.', uz: "Bizning raqamlarda o'rin muhim. Belgilarda esa yo'q." },
    audio: {
      ru: [
        'Вспомним. В наших числах значение цифры зависит от места. В числе двести двадцать два три одинаковых цифры, но значат разное.',
        'Это позиционная система. А есть и другая, непозиционная.',
        'В непозиционной системе значение знака не зависит от места. Знак десять всегда значит десять, где бы он ни стоял. Римские цифры — как раз такая система.'
      ],
      uz: [
        "Eslaymiz. Bizning sonlarda raqamning qiymati o'rniga bog'liq. Ikki yuz yigirma ikkida uchta bir xil raqam bor, lekin har xil qiymatga ega.",
        "Bu pozitsion sistema. Yana boshqasi ham bor, nopozitsion.",
        "Nopozitsion sistemada belgining qiymati o'rniga bog'liq emas. O'n belgisi qayerda tursa ham doim o'n degani. Rim raqamlari ana shunday sistema."
      ]
    }
  },

  // s2 — RIM BELGILARI jadvali: I V X L C
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Знаки римских цифр.', uz: 'Rim raqamlari belgilari.' },
    symbols: [
      { r: 'I', v: '1' }, { r: 'V', v: '5' }, { r: 'X', v: '10' }, { r: 'L', v: '50' }, { r: 'C', v: '100' }
    ],
    extra: { ru: 'Ещё есть D = 500 и M = 1000.', uz: 'Yana D = 500 va M = 1000 ham bor.' },
    audio: {
      ru: [
        'Выучим главные знаки. Знак один это единица. Знак пять это пятёрка. Знак десять это десяток.',
        'Знак пятьдесят это пять десятков. Знак сто это сотня. Есть ещё знаки пятьсот и тысяча. Из этих знаков собирают любое число.'
      ],
      uz: [
        "Asosiy belgilarni o'rganamiz. Bir belgisi birga teng. Besh belgisi beshga teng. O'n belgisi o'nga teng.",
        "Ellik belgisi besh o'nlikka teng. Yuz belgisi yuzga teng. Yana besh yuz va ming belgilari ham bor. Bu belgilardan har qanday son yig'iladi."
      ]
    }
  },

  // s3 — QO'SHUV qoidasi (kichik o'ngda)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Маленький знак справа — прибавляем.', uz: "Kichik belgi o'ngda — qo'shamiz." },
    examples: [
      { r: 'VI', calc: '5 + 1', v: '6' },
      { r: 'XII', calc: '10 + 1 + 1', v: '12' },
      { r: 'XV', calc: '10 + 5', v: '15' }
    ],
    done_text: { ru: 'Если меньший знак стоит справа от большего, их значения складывают.', uz: "Kichik belgi kattadan o'ngda tursa, ularning qiymatlari qo'shiladi." },
    audio: {
      ru: [
        'Первое правило. Если маленький знак стоит справа от большего, знаки складывают.',
        'Пятёрка и единица справа это шесть. Десяток и две единицы это двенадцать.',
        'Десяток и пятёрка справа это пятнадцать. Справа — значит прибавляем.'
      ],
      uz: [
        "Birinchi qoida. Agar kichik belgi kattadan o'ngda tursa, belgilar qo'shiladi.",
        "Beshlik va o'ngdagi birlik bu olti. O'nlik va ikkita birlik bu o'n ikki.",
        "O'nlik va o'ngdagi beshlik bu o'n besh. O'ngda bo'lsa, demak qo'shamiz."
      ]
    }
  },

  // s4 — AYIRUV qoidasi (kichik chapda) + 3 martadan ko'p yo'q
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Маленький знак слева — отнимаем.', uz: "Kichik belgi chapda — ayiramiz." },
    examples: [
      { r: 'IV', calc: '5 − 1', v: '4' },
      { r: 'IX', calc: '10 − 1', v: '9' },
      { r: 'XL', calc: '50 − 10', v: '40' },
      { r: 'XC', calc: '100 − 10', v: '90' }
    ],
    note_bad: 'IIII', note_good: 'IV',
    done_text: { ru: 'Если меньший знак слева от большего — отнимаем. И один знак не пишут больше трёх раз подряд.', uz: "Kichik belgi kattadan chapda bo'lsa — ayiramiz. Va bitta belgi uch martadan ko'p ketma-ket yozilmaydi." },
    audio: {
      ru: [
        'Второе правило. Если маленький знак стоит слева от большего, его значение отнимают.',
        'Единица слева от пятёрки это четыре. Единица слева от десятка это девять.',
        'Десяток слева от пятидесяти это сорок. Десяток слева от сотни это девяносто.',
        'И запомни ещё. Один и тот же знак не пишут больше трёх раз подряд. Поэтому четыре пишут не четырьмя единицами, а как пять без одного.'
      ],
      uz: [
        "Ikkinchi qoida. Agar kichik belgi kattadan chapda tursa, uning qiymati ayiriladi.",
        "Beshlikning chapidagi birlik bu to'rt. O'nlikning chapidagi birlik bu to'qqiz.",
        "Ellikning chapidagi o'nlik bu qirq. Yuzning chapidagi o'nlik bu to'qson.",
        "Va yana yodda tuting. Bitta belgi uch martadan ko'p ketma-ket yozilmaydi. Shuning uchun to'rtni to'rtta birlik bilan emas, beshdan bitta kam qilib yozamiz."
      ]
    }
  },

  // s5 — QOIDA
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Меньший знак справа от большего — прибавляем, слева — отнимаем. Один знак не повторяют больше трёх раз подряд.', uz: "Kichik belgi kattadan o'ngda — qo'shamiz, chapda — ayiramiz. Bitta belgi uch martadan ko'p takrorlanmaydi." },
    check_roman: 'IX',
    check_q: { ru: 'Какое число записано знаками IX? Нажми верный ответ.', uz: 'IX belgilari qaysi sonni yozadi? To\'g\'ri javobni bosing.' },
    check_opts: ['9', '11'],
    check_ci: 0,
    check_ok: { ru: 'Верно! Единица слева от десятка отнимается: десять минус один это девять.', uz: "To'g'ri! O'nlikning chapidagi birlik ayiriladi: o'n ayir bir bu to'qqiz." },
    check_no: { ru: 'Маленький знак слева отнимается: десять минус один это девять.', uz: "Kichik belgi chapda ayiriladi: o'n ayir bir bu to'qqiz." },
    audio: {
      ru: [
        'Отлично, теперь запомним правило римских цифр.',
        'Если меньший знак стоит справа от большего, их значения складывают.',
        'Если меньший знак стоит слева, его значение отнимают от большего.',
        'И один и тот же знак не пишут больше трёх раз подряд. А теперь сам. Какое число записано знаками, где единица стоит перед десятком?'
      ],
      uz: [
        "Zo'r, endi Rim raqamlari qoidasini eslab qolamiz.",
        "Agar kichik belgi kattadan o'ngda tursa, ularning qiymatlari qo'shiladi.",
        "Agar kichik belgi chapda tursa, uning qiymati kattadan ayiriladi.",
        "Va bitta belgi uch martadan ko'p yozilmaydi. Endi o'zingiz. Birlik o'nlikdan oldin turgan belgilar qaysi sonni yozadi?"
      ]
    }
  },

  // s6 — MASHQ Rim -> son (MC), 3 raund
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какое это число?', uz: 'Bu qaysi son?' },
    items: [
      {
        roman: 'XIV', ci: 0,
        opts: [{ ru: '14', uz: '14' }, { ru: '16', uz: '16' }, { ru: '6', uz: '6' }],
        hints: {
          1: { ru: 'После десятка идёт четыре, а не шесть: единица слева от пятёрки. Это 14.', uz: "O'nlikdan keyin to'rt keladi, olti emas: birlik beshning chapida. Bu 14." },
          2: { ru: 'Не забудь десяток впереди. Десять и четыре это 14.', uz: "Oldidagi o'nlikni unutmang. O'n va to'rt bu 14." }
        }
      },
      {
        roman: 'XL', ci: 0,
        opts: [{ ru: '40', uz: '40' }, { ru: '60', uz: '60' }, { ru: '10', uz: '10' }],
        hints: {
          1: { ru: 'Десяток слева от пятидесяти отнимается: пятьдесят минус десять это 40.', uz: "Ellikning chapidagi o'nlik ayiriladi: ellik ayir o'n bu 40." },
          2: { ru: 'Здесь два знака: десяток и пятьдесят. Это 40.', uz: "Bu yerda ikki belgi: o'nlik va ellik. Bu 40." }
        }
      },
      {
        roman: 'XXVII', ci: 0,
        opts: [{ ru: '27', uz: '27' }, { ru: '22', uz: '22' }, { ru: '32', uz: '32' }],
        hints: {
          1: { ru: 'Два десятка, пятёрка и две единицы: двадцать семь.', uz: "Ikki o'nlik, beshlik va ikki birlik: yigirma yetti." },
          2: { ru: 'Десятков ровно два, не три: это 27.', uz: "O'nlik roppa-rosa ikkita, uch emas: bu 27." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Читай числа, записанные римскими знаками. Три задания.', uz: "Rim belgilari bilan yozilgan sonlarni o'qing. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри, где меньший знак: слева отнимаем, справа прибавляем.', uz: "Kichik belgi qayerda ekaniga qarang: chapda ayiramiz, o'ngda qo'shamiz." }
    }
  },

  // s7 — MASHQ son -> Rim (MC), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Как записать это число римскими цифрами?', uz: 'Bu sonni Rim raqamlarida qanday yozamiz?' },
    items: [
      {
        num: 8, ci: 0,
        opts: [{ ru: 'VIII', uz: 'VIII' }, { ru: 'IIX', uz: 'IIX' }, { ru: 'IX', uz: 'IX' }],
        hints: {
          1: { ru: 'Отнимают только один знак слева. Восемь это пять и три единицы: VIII.', uz: "Chapda faqat bitta belgi ayiriladi. Sakkiz bu besh va uch birlik: VIII." },
          2: { ru: 'Это девять, а не восемь. Восемь пишут VIII.', uz: "Bu to'qqiz, sakkiz emas. Sakkizni VIII deb yozamiz." }
        }
      },
      {
        num: 9, ci: 0,
        opts: [{ ru: 'IX', uz: 'IX' }, { ru: 'VIIII', uz: 'VIIII' }, { ru: 'XI', uz: 'XI' }],
        hints: {
          1: { ru: 'Один знак нельзя писать больше трёх раз. Девять это десять без одного: IX.', uz: "Bitta belgi uch martadan ko'p yozilmaydi. To'qqiz bu o'ndan bitta kam: IX." },
          2: { ru: 'Это одиннадцать. Девять пишут IX, единица слева.', uz: "Bu o'n bir. To'qqizni IX deb yozamiz, birlik chapda." }
        }
      },
      {
        num: 40, ci: 0,
        opts: [{ ru: 'XL', uz: 'XL' }, { ru: 'XXXX', uz: 'XXXX' }, { ru: 'LX', uz: 'LX' }],
        hints: {
          1: { ru: 'Четыре десятка нельзя писать четырьмя знаками. Сорок это XL.', uz: "To'rt o'nlikni to'rtta belgi bilan yozib bo'lmaydi. Qirq bu XL." },
          2: { ru: 'Это шестьдесят. Сорок пишут XL, десяток слева.', uz: "Bu oltmish. Qirqni XL deb yozamiz, o'nlik chapda." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Выбери верную запись числа римскими знаками. Три задания.', uz: "Sonning Rim belgilaridagi to'g'ri yozuvini tanlang. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Помни: один знак не больше трёх раз, четыре и девять пишут через вычитание.', uz: "Yodda tut: bitta belgi uch martadan ko'p emas, to'rt va to'qqiz ayirish orqali yoziladi." }
    }
  },

  // s8 — MASHQ xatoni top (Rim juftlari), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверную запись.', uz: "Noto'g'ri yozuvni toping." },
    items: [
      {
        stmts: ['VI = 6', 'IX = 11', 'XX = 20'],
        wrong: 1,
        hint: { ru: 'В записи с единицей слева от десятка отнимаем: это 9, а не 11.', uz: "Birlik o'nlikning chapida bo'lsa ayiramiz: bu 9, 11 emas." }
      },
      {
        stmts: ['XV = 15', 'IV = 6', 'XXX = 30'],
        wrong: 1,
        hint: { ru: 'Единица слева от пятёрки отнимается: это 4, а не 6.', uz: "Beshlikning chapidagi birlik ayiriladi: bu 4, 6 emas." }
      },
      {
        stmts: ['XC = 90', 'VII = 7', 'XL = 60'],
        wrong: 2,
        hint: { ru: 'Десяток слева от пятидесяти отнимается: это 40, а не 60.', uz: "Ellikning chapidagi o'nlik ayiriladi: bu 40, 60 emas." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три записи. Одна неверная. Найди неверную запись.', uz: "Uchta yozuv beraman. Bittasi noto'g'ri. Noto'g'ri yozuvni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь порядок знаков: слева отнимаем, справа прибавляем.', uz: "Belgilar tartibini tekshiring: chapda ayiramiz, o'ngda qo'shamiz." }
    }
  },

  // s9 — MASALA (case): oy nomi (Bit devor belgisi)
  s9: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'На стене Бит показал месяц числом VIII.', uz: 'Bit devorda oyni VIII soni bilan ko\'rsatdi.' },
    roman: 'VIII', ci: 0,
    q: { ru: 'Какой это месяц по счёту?', uz: 'Bu nechanchi oy?' },
    opts: [{ ru: '8', uz: '8' }, { ru: '6', uz: '6' }, { ru: '3', uz: '3' }],
    hints: {
      1: { ru: 'Пятёрка и три единицы справа это восемь, а не шесть.', uz: "Beshlik va o'ngdagi uch birlik bu sakkiz, olti emas." },
      2: { ru: 'Не забудь пятёрку впереди: пять и три это восемь.', uz: "Oldidagi beshlikni unutmang: besh va uch bu sakkiz." }
    },
    setup_audio: { ru: 'Год делят на месяцы, и каждый месяц можно записать римским числом по порядку. Бит показал на стене знаки: пятёрка и три единицы.', uz: "Yil oylarga bo'linadi, va har oyni tartib bo'yicha Rim soni bilan yozish mumkin. Bit devorda belgilarni ko'rsatdi: beshlik va uch birlik." },
    audio: {
      intro: { ru: 'Прочитай, какой это месяц по счёту. Выбери верный ответ.', uz: "Bu nechanchi oy ekanini o'qing. To'g'ri javobni tanlang." },
      on_correct: { ru: 'Верно. Пять и три это восемь — восьмой месяц.', uz: "To'g'ri. Besh va uch bu sakkiz — sakkizinchi oy." },
      on_wrong: { ru: 'Считай знаки: пятёрка и три единицы это восемь.', uz: "Belgilarni sanang: beshlik va uch birlik bu sakkiz." }
    }
  },

  // s10 — FINAL panel (5 savol, hammasi MC) + FactCard
  s10: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'mc',
        q: { ru: 'Какое число записано знаками XIII?', uz: 'XIII belgilari qaysi sonni yozadi?' },
        opt0: { ru: '13', uz: '13' },
        opt1: { ru: '15', uz: '15' },
        opt2: { ru: '8', uz: '8' },
        wrong_1: { ru: 'Десяток и три единицы это тринадцать.', uz: "O'nlik va uch birlik bu o'n uch." },
        wrong_2: { ru: 'Впереди десяток, потом три единицы: тринадцать.', uz: "Oldida o'nlik, keyin uch birlik: o'n uch." }
      },
      {
        kind: 'mc',
        q: { ru: 'Как записать 12 римскими цифрами?', uz: '12 ni Rim raqamlarida qanday yozamiz?' },
        opt0: { ru: 'XII', uz: 'XII' },
        opt1: { ru: 'IIX', uz: 'IIX' },
        opt2: { ru: 'XXII', uz: 'XXII' },
        wrong_1: { ru: 'Слева отнимают только один знак. Двенадцать это XII.', uz: "Chapda faqat bitta belgi ayiriladi. O'n ikki bu XII." },
        wrong_2: { ru: 'Это двадцать два. Двенадцать это XII.', uz: "Bu yigirma ikki. O'n ikki bu XII." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число записано знаками IX?', uz: 'IX belgilari qaysi sonni yozadi?' },
        opt0: { ru: '9', uz: '9' },
        opt1: { ru: '11', uz: '11' },
        opt2: { ru: '6', uz: '6' },
        wrong_1: { ru: 'Единица слева отнимается: десять минус один это девять.', uz: "Chapdagi birlik ayiriladi: o'n ayir bir bu to'qqiz." },
        wrong_2: { ru: 'Это не шесть. Единица слева от десятка это девять.', uz: "Bu olti emas. O'nlikning chapidagi birlik bu to'qqiz." }
      },
      {
        kind: 'mc',
        q: { ru: 'Как записать 90 римскими цифрами?', uz: '90 ni Rim raqamlarida qanday yozamiz?' },
        opt0: { ru: 'XC', uz: 'XC' },
        opt1: { ru: 'CX', uz: 'CX' },
        opt2: { ru: 'LXL', uz: 'LXL' },
        wrong_1: { ru: 'Это сто десять. Девяносто это десяток слева от сотни: XC.', uz: "Bu bir yuz o'n. To'qson bu yuzning chapidagi o'nlik: XC." },
        wrong_2: { ru: 'Так знаки не пишут. Девяносто это XC.', uz: "Belgilar bunday yozilmaydi. To'qson bu XC." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число записано знаками XXIV?', uz: 'XXIV belgilari qaysi sonni yozadi?' },
        opt0: { ru: '24', uz: '24' },
        opt1: { ru: '26', uz: '26' },
        opt2: { ru: '16', uz: '16' },
        wrong_1: { ru: 'Два десятка и четыре: двадцать четыре, а не двадцать шесть.', uz: "Ikki o'nlik va to'rt: yigirma to'rt, yigirma olti emas." },
        wrong_2: { ru: 'Десятков два, не один: двадцать четыре.', uz: "O'nlik ikkita, bitta emas: yigirma to'rt." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Самая близкая к нам звезда после Солнца — Проксима Центавра — тоже красный карлик. До неё свет летит больше четырёх лет.', uz: "Quyoshdan keyin bizga eng yaqin yulduz — Proksima Sentavri — ham qizil mitti. Uning nuri bizgacha to'rt yildan ko'proq uchadi." },
    fact_audio: { ru: 'Самая близкая к нам звезда после Солнца — Проксима Центавра — тоже красный карлик. До неё свет летит больше четырёх лет.', uz: "Quyoshdan keyin bizga eng yaqin yulduz — Proksima Sentavri — ham qizil mitti. Uning nuri bizgacha to'rt yildan ko'proq uchadi." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает записи, отвечай на каждую.', uz: "Yakuniy tekshiruv. Shahar kompyuteri yozuvlar ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — YAKUN (Б1 hudud yakuni)
  s11: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Стена знаков прочитана — город Бита открыт!', uz: 'Belgili devor o\'qildi — Bit shahri ochildi!' },
    cando: { ru: 'Теперь ты читаешь и записываешь числа римскими цифрами.', uz: "Endi siz sonlarni Rim raqamlarida o'qiysiz va yozasiz." },
    rule_recap: { ru: 'Меньший знак справа — прибавляем, слева — отнимаем. Один знак не больше трёх раз подряд.', uz: "Kichik belgi o'ngda — qo'shamiz, chapda — ayiramiz. Bitta belgi uch martadan ko'p emas." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'чтение и запись чисел', uz: "sonlarni o'qish va yozish" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'новая область — Сады света: таблица умножения', uz: "yangi hudud — Nur bog'lari: ko'paytirish jadvali" },
    audio: {
      ru: 'Стена знаков прочитана, и город Бита полностью открыт. Мы научились читать и записывать числа римскими цифрами. Запомни. Меньший знак справа от большего прибавляем, а слева отнимаем. И один и тот же знак не пишут больше трёх раз подряд. Дальше нас ждёт новая область — Сады света, где мы вспомним таблицу умножения.',
      uz: "Belgili devor o'qildi, va Bit shahri to'liq ochildi. Biz sonlarni Rim raqamlarida o'qish va yozishni o'rgandik. Yodda tuting. Kichik belgi kattadan o'ngda bo'lsa qo'shamiz, chapda bo'lsa ayiramiz. Va bitta belgi uch martadan ko'p yozilmaydi. Endi bizni yangi hudud kutmoqda — Nur bog'lari, u yerda ko'paytirish jadvalini eslaymiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним про место цифры.', uz: 'Raqam o\'rni haqida eslaymiz.' },
  s2:  { ru: 'Выучим знаки.', uz: 'Belgilarni o\'rganamiz.' },
  s3:  { ru: 'Первое правило — сложение.', uz: 'Birinchi qoida — qo\'shish.' },
  s4:  { ru: 'Второе правило — вычитание.', uz: 'Ikkinchi qoida — ayirish.' },
  s5:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s6:  { ru: 'Правило знаем. Читай сам.', uz: "Qoidani bilamiz. O'zingiz o'qing." },
  s7:  { ru: 'Теперь записывай сам.', uz: 'Endi o\'zingiz yozing.' },
  s8:  { ru: 'Проверим записи на ошибку.', uz: 'Yozuvlarni xatoga tekshiramiz.' },
  s9:  { ru: 'Бит показал месяц на стене.', uz: 'Bit devorda oyni ko\'rsatdi.' },
  s10: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s11: { ru: 'Город открыт. Идём дальше!', uz: 'Shahar ochildi. Davom etamiz!' }
};

// s11 payoff (xulosadan oldin aytiladi)
const S11_PAYOFF = {
  ru: 'Миссия выполнена! Мы разгадали древние знаки на стене, и весь город Бита теперь открыт. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz devordagi qadimiy belgilarni yechdik, va Bitning butun shahri endi ochiq. Yordamingiz uchun rahmat!"
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
      <RimHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars08 «Rim raqamlari» (sanoq sistemalari)
// ============================================================



// --- QADIMGI CHORAK SAHNASI (D08 namuna): nurab ketgan tosh xaroba, o'yilgan qadimiy belgilar
//     (Rim raqami + sayyora runasi), biolyuminessent mox, qizil mitti osmoni. Bit shahrining arxeologik chorak.
const RimHallBg = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="h8wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EADAB4"/><stop offset="100%" stopColor="#CDB689"/></linearGradient>
      <linearGradient id="h8col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A8946A"/><stop offset="42%" stopColor="#E8D8B2"/><stop offset="100%" stopColor="#A8946A"/></linearGradient>
      <linearGradient id="h8sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5E4256"/><stop offset="45%" stopColor="#A8705E"/><stop offset="82%" stopColor="#D89A66"/><stop offset="100%" stopColor="#F2C88E"/></linearGradient>
      <linearGradient id="h8floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9B283"/><stop offset="100%" stopColor="#A38A5E"/></linearGradient>
      <linearGradient id="h8slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4D3AC"/><stop offset="100%" stopColor="#C6AE7E"/></linearGradient>
      <radialGradient id="h8sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#EE9A5A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <radialGradient id="h8moss" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#BFF0C8"/><stop offset="100%" stopColor="#7FD0A0" stopOpacity="0"/></radialGradient>
      <clipPath id="h8arch"><path d="M124 96 L124 70 Q124 40 200 40 Q276 40 276 70 L276 96 Z"/></clipPath>
    </defs>
    {/* --- DEVOR + shift lintel (interyer) --- */}
    <rect x="0" y="0" width="400" height="180" fill="url(#h8wall)"/>
    <rect x="0" y="0" width="400" height="20" fill="#C2AC7E"/><rect x="0" y="19" width="400" height="3" fill="#9A855C"/>
    <g fill="#B09A6E">{[40, 96, 152, 248, 304, 360].map((x, i) => <rect key={i} x={x} y="6" width="30" height="8" rx="1.5"/>)}</g>
    {/* osma moss-fonar (3) */}
    {[104, 200, 296].map((cx, i) => (
      <g key={i}>
        <line x1={cx} y1="20" x2={cx} y2="30" stroke="#8A7550" strokeWidth="1.6"/>
        <path d={`M${cx - 6} 30 h12 l-2 9 h-8 Z`} fill="#B7A176" stroke="#8A7550" strokeWidth="0.8"/>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="35" r="4.2" fill="#BFF0C8"/>
        <ellipse cx={cx} cy="34" rx="11" ry="16" fill="url(#h8moss)" opacity="0.5"/>
      </g>
    ))}
    {/* --- ORTDA: RAVOQ -> vayrona mahalla (chuqurlik) --- */}
    <g clipPath="url(#h8arch)">
      <rect x="120" y="38" width="160" height="60" fill="url(#h8sky)"/>
      <g><circle cx="150" cy="60" r="7" fill="#C79AD6"/><ellipse cx="150" cy="60" rx="12" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.3" opacity="0.8"/></g>
      <circle cx="250" cy="88" r="15" fill="url(#h8sun)"/><circle cx="250" cy="88" r="7" fill="#FFD89A"/>
      {/* uzoq vayrona siluet */}
      <g opacity="0.6" fill="#9A6E68"><path d="M132 96 v-16 q6 -8 12 0 v16 Z"/><rect x="160" y="82" width="12" height="14"/><path d="M182 96 v-20 l7 -6 l7 6 v20 Z"/><rect x="214" y="84" width="10" height="12"/></g>
      <g fill="#FFE39A" opacity="0.8"><circle cx="138" cy="88" r="1"/><circle cx="187" cy="86" r="1"/></g>
    </g>
    {/* ravoq toshi (voussoir) */}
    <path d="M116 96 L116 70 Q116 32 200 32 Q284 32 284 70 L284 96 L276 96 L276 70 Q276 40 200 40 Q124 40 124 70 L124 96 Z" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1.2"/>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.7"><path d="M150 43 l-4 -7"/><path d="M200 36 v-8"/><path d="M250 43 l4 -7"/></g>
    {/* --- RAMKA USTUNLARI (old plan, chuqurlik) --- */}
    {[28, 334].map((x, i) => (
      <g key={i}>
        <rect x={x - 6} y="24" width="54" height="12" rx="3" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1"/>
        <rect x={x} y="36" width="42" height="140" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1"/>
        <g stroke="#9A855C" strokeWidth="1.2" opacity="0.55">{[10, 21, 32].map((dx, k) => <line key={k} x1={x + dx} y1="40" x2={x + dx} y2="172"/>)}</g>
        <rect x={x - 4} y="168" width="50" height="10" rx="2" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1"/>
        <circle className="lm-glow" cx={x + 21} cy="30" r="3" fill="#BFF0C8"/>
      </g>
    ))}
    {/* o'ng ustunga o'ralgan alien uzumcha */}
    <path d="M356 172 Q346 150 356 130 Q366 110 356 90 Q348 74 356 60" fill="none" stroke="#6FBF8E" strokeWidth="2.4"/>
    <g fill="#8FD8A8">{[[352, 150], [360, 118], [350, 96], [358, 72]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="2.6"/>)}</g>
    {/* --- MARKAZIY STELA: rim <-> zamonaviy (XII = 12) --- */}
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x="116" y="94" width="168" height="66" rx="5" fill="url(#h8slab)" stroke="#8A7550" strokeWidth="2"/>
    <rect x="122" y="100" width="156" height="54" rx="3" fill="none" stroke="#A8946A" strokeWidth="1" opacity="0.7"/>
    <rect x="130" y="103" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="111.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'РИМСКАЯ ЦИФРА' : 'RIM RAQAMI'}</text>
    <text x="156" y="142" textAnchor="middle" fontSize="24" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">XII</text>
    <text x="205" y="140" textAnchor="middle" fontSize="20" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">=</text>
    <text x="248" y="142" textAnchor="middle" fontSize="24" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">12</text>
    {/* --- CHAP artefakt: quyosh soati --- */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <ellipse cx="0" cy="4" rx="24" ry="9" fill="url(#h8slab)" stroke="#8A7550" strokeWidth="1.2"/>
      <path d="M0 4 L-2 -6 L2 -6 Z" fill="#8A7550"/>
      <g stroke="#8A7550" strokeWidth="0.8">{[-18, -9, 0, 9, 18].map((dx, k) => <line key={k} x1={dx} y1={4 - Math.abs(dx) * 0.16} x2={dx * 0.8} y2={0 - Math.abs(dx) * 0.14}/>)}</g>
      <text x="0" y="-3" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">XII</text>
    </g>
    {/* --- O'NG artefakt: I V X L C tosh-tabletlari --- */}
    {[['I', 92], ['V', 108], ['X', 124], ['L', 140], ['C', 156]].map(([g, y], i) => (
      <g key={i} transform={`translate(306 ${y})`}>
        <rect x="0" y="0" width="26" height="14" rx="3" fill="url(#h8slab)" stroke="#8A7550" strokeWidth="1"/>
        <text x="13" y="11" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{g}</text>
      </g>
    ))}
    <circle className="lm-glow" cx="300" cy="90" r="2.4" fill="#BFF0C8"/>
    {/* --- POL: mozaik tosh + perspektiva --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#h8floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#8A7550" strokeWidth="2"/>
    <g stroke="#8A7550" strokeWidth="1" opacity="0.4"><path d="M30 230 L178 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M370 230 L222 178"/></g>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g fill="none" stroke="#8A7550" strokeWidth="0.8" opacity="0.3">{[160, 200, 240].map((cx, k) => <path key={k} d={`M${cx} 186 l8 5 l-8 5 l-8 -5 Z`}/>)}</g>
    {/* --- OLD PLAN: yiqilgan ustun bo'lagi (chap) + moss --- */}
    <g transform="translate(58 176)"><rect x="-2" y="-12" width="34" height="11" rx="3" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1" transform="rotate(-6)"/><circle className="lm-glow" cx="0" cy="-8" r="2.6" fill="#BFF0C8"/></g>
    {/* havoda porlovchi sporalar */}
    <g><circle className="lm-glow" cx="96" cy="70" r="1.5" fill="#DFF0C8"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="320" cy="150" r="1.4" fill="#CFEFD8"/></g>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <RimHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- Rim belgisi (katta).
const RomanBig = ({ r, color }) => (
  <span className="mono" style={{ fontSize: 'clamp(34px, 8.5vw, 54px)', fontWeight: 800, color: color || T.ink, letterSpacing: 'clamp(3px, 1vw, 6px)' }}>{r}</span>
);

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
  const [okPick, setOkPick] = useState(props.storedAnswer && items.length ? items[items.length - 1].ci : null);   // to'g'ri variant YASHIL yonadi (metodist 2026-08-04)
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{heading(it)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 21px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s0 — HOOK: IV qaysi son
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const ok = picked === 0;
  const fbKey = (i) => (i === 0 ? 'on_correct' : 'on_wrong');
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
  const opts = [c.opt0, c.opt1, c.opt2];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1 lm-scene-host" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden'  }}>
          <LessonScene gathered={ok}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(18px, 3.6vw, 30px)', background: '#F0EBE1' }}>
          <RomanBig r={c.roman}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(16px, 2.4vw, 22px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(16px, 2.4vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span>{t(opts[picked])}</span>
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

// s1 — RECALL: pozitsion/nopozitsion
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s1_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s1_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: T.ink, letterSpacing: 4 }}>222</span>
            <span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.ink2, fontWeight: 700 }}>{lang === 'ru' ? 'место важно (позиционная)' : "o'rin muhim (pozitsion)"}</span>
          </div>
          {reached >= 2 && (
            <div className="lm-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <RomanBig r="X X X"/>
              <span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.accent, fontWeight: 700 }}>{lang === 'ru' ? 'знак всегда 10 (непозиционная)' : "belgi doim 10 (nopozitsion)"}</span>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s2 — RIM BELGILARI jadvali
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s2_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s2_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const showExtra = reached >= 1;
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 24px)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px, 2.4vw, 16px)', justifyContent: 'center' }}>
            {c.symbols.map((s, i) => (
              <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 'clamp(50px, 13vw, 70px)', padding: 'clamp(6px, 1.4vw, 10px)', background: T.paper, borderRadius: 12, boxShadow: '0 4px 12px -5px rgba(58, 53, 48, 0.25)' }}>
                <span className="mono" style={{ fontSize: 'clamp(26px, 6vw, 38px)', fontWeight: 800, color: T.accent }}>{s.r}</span>
                <span className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', fontWeight: 800, color: T.ink }}>{s.v}</span>
              </div>
            ))}
          </div>
          {showExtra && <p className="mono lm-reveal" style={{ margin: 0, color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.8vw, 15px)' }}>{t(c.extra)}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3/s4 — QO'SHUV/AYIRUV qoidasi (misollar)
const ExploreRoman = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...c.audio[lang].map((text, i) => ({ id: `${ck}_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  const re = new RegExp(`^${ck}_\\d+$`);
  useEffect(() => { if (seg && re.test(seg)) setReached((r) => Math.max(r, +seg.slice(ck.length + 1))); }, [seg]);
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2.2vw, 16px)', padding: 'clamp(14px, 2.8vw, 22px)' }}>
          {c.examples.map((ex, i) => (
            <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.14}s`, display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 36px)', fontWeight: 800, color: T.accent, letterSpacing: 2, minWidth: 'clamp(56px, 15vw, 84px)', textAlign: 'center' }}>{ex.r}</span>
              <span className="mono" style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: T.ink3, fontWeight: 700 }}>{ex.calc}</span>
              <span className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', color: T.ink3, fontWeight: 800 }}>=</span>
              <span className="mono" style={{ fontSize: 'clamp(20px, 4.4vw, 30px)', fontWeight: 800, color: T.ink }}>{ex.v}</span>
            </div>
          ))}
          {c.note_bad && reached >= (c.audio[lang].length - 1) && (
            <div className="frame-tip lm-reveal" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(8px, 1.6vw, 12px)', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', fontWeight: 800, color: '#C0392B', textDecoration: 'line-through' }}>{c.note_bad}</span>
              <span className="mono" style={{ fontSize: 'clamp(16px, 2.6vw, 20px)', color: T.ink3 }}>→</span>
              <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', fontWeight: 800, color: T.success }}>{c.note_good}</span>
            </div>
          )}
        </div>
        {done && (
          <div className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};
const Screen3 = (props) => <ExploreRoman props={props} ck="s3"/>;
const Screen4 = (props) => <ExploreRoman props={props} ck="s4"/>;

// s5 — QOIDA + check
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s5', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s5_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  // Variantlar har mount'da ARALASHADI: to'g'ri javob doim bir joyda turmasin (metodist,
  // 2026-08-04). `order` — ko'rsatish tartibi, `ci` — to'g'ri javobning YANGI o'rni.
  const order = React.useMemo(() => shuffleArr(c.check_opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.check_ci);
  const ok = picked === ci;
  const revealRef = useRevealScroll(ok, 500);
  const pick = (i) => {
    if (!canAct || ok) return;
    setPicked(i);
    if (i === ci) sfx.playCorrect();
  };
  const canAdv = useAdvanceGate(ok, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="d2-rulecard fade-up">
          <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
          <p className="d2-rulecard-txt">{t(c.rule)}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <RomanBig r={c.check_roman}/>
          <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : (picked !== null ? t(c.check_no) : t(c.check_q))}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${ok && i === ci ? 'option-correct' : ''} ${picked === i && i !== ci ? 'option-picked-wrong' : ''}`} disabled={!canAct || ok} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{c.check_opts[k]}</button>
            ))}
          </div>
        </div>
        {ok && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.check_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — MASHQ Rim -> son (MC)
const Screen6 = (props) => {
  const t = useT();
  const c = CONTENT.s6;
  const heading = () => t(c.q);
  const renderFig = (it) => <RomanBig r={it.roman}/>;
  return <MCRoundD2 props={props} ck="s6" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s7 — MASHQ son -> Rim (MC)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(36px, 8vw, 54px)', fontWeight: 800, color: T.ink }}>{it.num}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s8 — MASHQ xatoni top
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([
    brgSeg('s8', lang),
    { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
      setTimeout(() => { setSolvedRound(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1300);
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(16px, 3vw, 22px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s9 — MASALA (case): oy nomi
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  const order = React.useMemo(() => shuffleArr([0, 1, 2]), []);
  const opts = order.map((k) => c.opts[k]);
  const ci = order.indexOf(c.ci);
  const hints = order.map((k) => c.hints[k]);
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(props.storedAnswer ? props.storedAnswer.studentAnswerIndex : null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const revealRef = useRevealScroll(solved, 500);
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect();
      if (firstRef.current === null) firstRef.current = wrongSet.size === 0;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((hints[i] || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        studentAnswerIndex: ci, correctAnswer: String(c.opts[c.ci][lang]), studentAnswer: String(c.opts[c.ci][lang]), correct: firstRef.current === null ? true : firstRef.current,
        firstTry: firstRef.current === null ? true : firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const hintMsg = wrongSet.size > 0 ? [...wrongSet].map((i) => hints[i]).filter(Boolean).slice(-1)[0] : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 22px)' }}>
          <FrameFx/>
          <RomanBig r={c.roman}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
            {opts.map((o, i) => (
              <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solved && i === ci ? 'option-correct' : ''}`} disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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

// FaktCard rasmi: chapda Quyosh, o'ngda Proksima. Nur nuqta bo'lib yo'l bosadi, yo'ldagi to'rt
// belgi — to'rt yil; yulduzga yetguncha yana bir oz qoladi.
const ProximaFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="d8Bg" cx="50%" cy="50%" r="64%"><stop offset="0%" stopColor="#281A32"/><stop offset="54%" stopColor="#15132C"/><stop offset="100%" stopColor="#090717"/></radialGradient>
        <radialGradient id="d8Sun" cx="38%" cy="32%" r="68%"><stop offset="0%" stopColor="#FFF6D8"/><stop offset="46%" stopColor="#FFC23C"/><stop offset="100%" stopColor="#E0700C"/></radialGradient>
        <radialGradient id="d8Star" cx="40%" cy="36%" r="62%"><stop offset="0%" stopColor="#FFE8C0"/><stop offset="42%" stopColor="#FF7A3C"/><stop offset="100%" stopColor="#BE2E0C"/></radialGradient>
        <radialGradient id="d8Glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FF8A4C" stopOpacity="0.5"/><stop offset="100%" stopColor="#FF8A4C" stopOpacity="0"/></radialGradient>
        <clipPath id="d8Clip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#d8Clip)">
        <rect width="340" height="150" fill="url(#d8Bg)"/>
        <g fill="#FFF6E8">
          {[[120, 26, 1.2, 0], [196, 130, 1, 0.9], [252, 22, 1.3, 1.5], [88, 126, 1.1, 2.2]].map(([x, y, r, d], i) => (
            <circle key={i} className="lm-ff-tw" style={{ animationDelay: d + 's' }} cx={x} cy={y} r={r}/>
          ))}
        </g>
        <circle className="lm-ff-glow" cx="36" cy="75" r="34" fill="url(#d8Glow)"/>
        <circle cx="36" cy="75" r="22" fill="url(#d8Sun)"/>
        <line x1="64" y1="75" x2="290" y2="75" stroke="rgba(255,238,210,0.3)" strokeWidth="1.4" strokeDasharray="5 6"/>
        <g stroke="#FFD9A8" strokeWidth="2" strokeLinecap="round" opacity="0.75">
          <line x1="115" y1="66" x2="115" y2="84"/>
          <line x1="165" y1="66" x2="165" y2="84"/>
          <line x1="214" y1="66" x2="214" y2="84"/>
          <line x1="264" y1="66" x2="264" y2="84"/>
        </g>
        <g className="lm-ff-ray">
          <line x1="66" y1="75" x2="42" y2="75" stroke="#FFF6E8" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
          <circle cx="68" cy="75" r="4.2" fill="#FFFDF4"/>
          <circle cx="68" cy="75" r="9" fill="#FFF6E8" opacity="0.22"/>
        </g>
        <circle className="lm-ff-glow" cx="306" cy="75" r="22" fill="url(#d8Glow)"/>
        <circle cx="306" cy="75" r="12.5" fill="url(#d8Star)"/>
      </g>
    </svg>
  </span>
);

// s10 — FINAL panel (5 savol, hammasi MC) + FactCard
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[idx];
  const [wrongSet, setWrongSet] = useState(() => new Set());   // shu savolda urinilgan xato variantlar
  const [hintMsg, setHintMsg] = useState(null);                // xato tahlili (savol almashmaydi)
  const PASS = Math.ceil(items.length * 0.7);
  // NOTO'G'RI javob keyingi savolga O'TKAZMAYDI (metodist, 2026-08-04): bola shu savolda
  // qoladi, tahlilni oladi va qayta urinib ko'radi. Ball faqat BIRINCHI urinishda beriladi.
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.intro_line)}</p>
        {!done && it && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
            <FrameFx/>
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${idx + 1} из ${items.length}` : `${idx + 1}-topshiriq, jami ${items.length}`}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {orders[idx].map((k, i) => (
                <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 21px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                  {t(it[`opt${k}`])}
                </button>
              ))}
            </div>
            {hintMsg && (
              <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success fade-up" style={{ marginBottom: 12 }}><Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/></div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><ProximaFig/></div>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — YAKUN
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const audio = useAudio([
    { id: 's11_pay', text: S11_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's11_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 16px)', position: 'relative' }}>
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
        <div className="fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function RomanLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11];
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
/* Хук с дополнительной панелью: рамка тянется, сцена занимает ровно остаток места.
   Так не нужен магический запас высоты — экран сходится на любом окне. */
.lm-scene-host { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; }
.lm-scene-host .lm-scene { width: auto; height: 100%; max-width: 100%; max-height: 372px; }
.lm-scene { position: relative; width: min(100%, calc(clamp(var(--scene-floor, 160px), calc(100dvh - var(--scene-reserve, 570px)), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
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
`;
