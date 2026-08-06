import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars17 — "Ikki xonali sonni bir xonaliga ko'paytirish" (num-3-17) | Б3 boshi
// Syujet: «modul yig'ish» (SYUJET_3SINF.md 159-satr, Б3 «USTAXONA»). Ustaxonaga 4 modul
//   buyurtma qilinadi, har birida 23 detal; jadval yordam bermaydi — sonni QISMLARGA
//   ajratish usuli ochiladi.
// SAHNA (metodist qoidasi: 1-9-darsdan olib qayta ishlash): 3-darsning maydoni
//   (`RazryadPlazaBg`) USTAXONAGA aylantirildi. O'zgargani: deraza KUNDUZGI (tepalik va
//   bog'lar), yoyilma-panel o'rniga 4 uyali YIG'ISH STOLI va kran ilgagi, chapda
//   sterjenlar RAFI, o'ngda kubiklar YASHIGI.
// MEXANIKA (yangi mexanika YARATILMAGAN): MC xuk, TAP bilan ochilish, savol-oldin-qoida,
//   TAP + MC (o'rin almashtirish), bitta savolli MC (16-darsning soat ekranidan, soatsiz),
//   NumPad trenajyor + CheckStrip, konsol (1-dars uslubi, 15-darsning `MeasureCell`i),
//   masala (yozuv + jadval + ikki qadam javob + tekshirish), final panel + FactCard.
//   Test ekranlarida RASM YO'Q (metodist qoidasi 15-darsdan).
// KO'CHIRILGAN: `MeasureCell` va `TaskTable` (15-dars), `FoldRow` (13-dars), CheckStrip
//   (14-15-dars), sahna karkasi (3-dars).
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 23-24-betlar «23 · 4, 4 · 23
//   ko'rinishidagi ifodalar»): usul dosloven — 23 · 4 = (20 + 3) · 4 = 20 · 4 + 3 · 4 =
//   80 + 12 = 92; tana misollari 2-topshiriqdan (14·2, 15·4, 46·2, 3·27, 7·12, 2·19),
//   final 7-topshiriqdan (25·4, 2·33, 61·3); masala 3-topshiriq strukturasi (6 · 14 + 12).
// YADRO: 23 · 4 — yig'indini ko'paytirish (11-dars) davomi. USTUN YO'Q (u 21-darsda).
// Misconception: M1 faqat o'nliklar (80); M2 birlikni yozib qo'yish (83); M3 raqamlarni
//   yelimlash (812); M4 bir xonalini ajratmoqchi bo'lish (3·27); M5 qo'shishda adashish.
// FactCard: qadimgi misrliklar ikkilantirish bilan ko'paytirgan — 23, 46, 92.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 17» (tasdiq 2026-08-05).
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
  lessonId: 'num-3-17',
  lessonTitle: { ru: 'Урок 17. Умножение двузначного на однозначное', uz: "17-dars. Ikki xonali sonni bir xonaliga ko'paytirish" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 17»): s0 xuk (buyurtma 4 × 23) · s1 modul qismlarga
// (23 = 20 + 3) · s2 o'nliklar (20 · 4) · s3 birliklar va yig'indi (3 · 4, 80 + 12) ·
// s4 savol-oldin-QOIDA · s5 almashtirish (3 · 27) · s6 test yozuvni tanlash · s7 test
// qiymat · s8 trenajyor NumPad · s9 xatoni top · s10 konsol 7 · 12 · s11 trenajyor NumPad ·
// s12 masala (jadval + ikki qadam) · s13 final 3 misol + FactCard · s14 yakun.
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
    topic: { ru: 'Умножение двузначного на однозначное', uz: "Ikki xonalini bir xonaliga ko'paytirish" },
    lead: { ru: 'Мастерской заказали 4 модуля по 23 детали', uz: "Ustaxonaga 23 detaldan iborat 4 modul buyurtma qilindi" },
    order_cap: { ru: 'заказ: 4 модуля, в каждом 23 детали', uz: 'buyurtma: 4 modul, har birida 23 detal' },
    q: { ru: 'Сколько всего деталей нужно со склада?', uz: 'Ombordan jami nechta detal kerak?' },
    opt0: { ru: '92', uz: '92' },
    opt1: { ru: '80', uz: '80' },
    opt2: { ru: '83', uz: '83' },
    opt3: { ru: '812', uz: '812' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется умножение двузначного числа на однозначное.',
          'Мастерской заказали четыре модуля. В каждом двадцать три детали.',
          'Таблица умножения тут не поможет. Двадцати трёх в ней нет.',
          'Как думаешь, сколько всего деталей понадобится?'
        ],
        uz: [
          "Dars mavzusi ikki xonali sonni bir xonali songa ko'paytirish deb ataladi.",
          "Ustaxonaga to'rtta modul buyurtma qilindi. Har birida yigirma uchta detal bor.",
          "Ko'paytirish jadvali bu yerda yordam bermaydi. Unda yigirma uch yo'q.",
          "Sizningcha, jami nechta detal kerak bo'ladi?"
        ]
      },
      on_correct: {
        ru: 'Верно! А за урок узнаешь, как посчитать это быстро и без таблицы.',
        uz: "To'g'ri! Darsda esa buni tez va jadvalsiz hisoblashni o'rganasiz."
      },
      on_wrong1: {
        ru: 'Это только стержни-десятки. А кубики-единицы остались в ящике.',
        uz: "Bu faqat o'nlik-sterjenlar. Birlik-kubiklar esa yashikda qoldi."
      },
      on_wrong2: {
        ru: 'Десятки умножены, а три единицы просто дописаны. Их тоже нужно взять четыре раза.',
        uz: "O'nliklar ko'paytirilgan, uch birlik esa shunchaki yozib qo'yilgan. Ularni ham to'rt marta olish kerak."
      },
      on_idk: {
        ru: 'Цифры перемножены по отдельности, а ответы склеены. Так число рассыпается.',
        uz: "Raqamlar alohida ko'paytirilib, javoblar yelimlangan. Bunda son buzilib ketadi."
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбираем', uz: 'Ajratamiz' },
    lead: { ru: 'Разберём число 23 на части', uz: '23 sonini qismlarga ajratamiz' },
    plate: '23',
    part1: '20',
    part2: '3',
    formula: '23 = 20 + 3',
    btn1: { ru: 'Показать десятки', uz: "O'nliklarni ko'rsatish" },
    btn2: { ru: 'А единицы?', uz: 'Birliklari-chi?' },
    done_text: { ru: 'С такими частями умножать легко. Каждую часть отдельно.', uz: "Bunday qismlar bilan ko'paytirish oson. Har bir qismni alohida." },
    audio: {
      ru: [
        'Разберём одну деталь заказа. Число двадцать три.',
        'Два стержня-десятка. Это двадцать.',
        'И три кубика-единицы. Это три.',
        'Двадцать три это двадцать и ещё три. Две удобные части.'
      ],
      uz: [
        "Buyurtmadagi bitta bo'lakni ko'rib chiqamiz. Yigirma uch soni.",
        "Ikki o'nlik-sterjen. Bu yigirma.",
        "Va uch birlik-kubik. Bu uch.",
        "Yigirma uch bu yigirma va yana uch. Ikki qulay qism."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Сначала десятки: 20 · 4', uz: "Avval o'nliklar: 20 · 4" },
    expr: '20 · 4 = 80',
    btn1: { ru: 'Взять десятки', uz: "O'nliklarni olish" },
    btn2: { ru: 'Сосчитать', uz: 'Sanash' },
    done_text: { ru: 'Десятки посчитаны. Но модули ещё не готовы, не хватает единиц.', uz: "O'nliklar sanaldi. Lekin modullar hali tayyor emas, birliklar yetishmayapti." },
    audio: {
      ru: [
        'Сначала берём десятки для всех четырёх модулей.',
        'Два десятка, четыре раза. Восемь стержней на столе.',
        'Восемь десятков это восемьдесят. Первая часть готова.'
      ],
      uz: [
        "Avval to'rttala modul uchun o'nliklarni olamiz.",
        "Ikki o'nlikdan to'rt marta. Stolda sakkiz sterjen.",
        "Sakkiz o'nlik bu sakson. Birinchi qism tayyor."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Теперь единицы и сумма', uz: "Endi birliklar va yig'indi" },
    expr1: '3 · 4 = 12',
    final_line: '23 · 4 = 92',
    btn1: { ru: 'Взять единицы', uz: 'Birliklarni olish' },
    btn2: { ru: 'Сложить части', uz: "Qismlarni qo'shish" },
    done_text: { ru: 'Десятки отдельно, единицы отдельно, потом сложили. Весь приём.', uz: "O'nliklar alohida, birliklar alohida, keyin qo'shdik. Usulning hammasi shu." },
    audio: {
      ru: [
        'Теперь кубики. Три единицы, четыре раза. Двенадцать.',
        'Складываем части. Восемьдесят и двенадцать, девяносто два.',
        'Ровно столько было и в твоём прогнозе в начале. Заказ посчитан.'
      ],
      uz: [
        "Endi kubiklar. Uch birlikdan to'rt marta. O'n ikki.",
        "Qismlarni qo'shamiz. Sakson va o'n ikki, to'qson ikki.",
        "Boshidagi taxminingiz bilan bir xil. Buyurtma hisoblandi."
      ]
    }
  },

  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Мы разложили 23 на 20 и 3. Что делаем с частями дальше?', uz: '23 ni 20 va 3 ga ajratdik. Qismlar bilan keyin nima qilamiz?' },
    opts: [
      { ru: 'умножаем каждую часть и складываем', uz: "har bir qismni ko'paytirib, qo'shamiz" },
      { ru: 'умножаем только большую часть', uz: "faqat katta qismni ko'paytiramiz" },
      { ru: 'сначала складываем части, потом умножаем', uz: "avval qismlarni qo'shamiz, keyin ko'paytiramiz" },
      { ru: 'умножаем части друг на друга', uz: "qismlarni bir-biriga ko'paytiramiz" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тогда три единицы в каждом модуле останутся несчитанными.', uz: 'Unda har moduldagi uch birlik sanalmay qoladi.' },
      2: { ru: 'Если сложить двадцать и три, вернётся двадцать три. Мы снова в начале.', uz: "Yigirma bilan uchni qo'shsak, yana yigirma uch chiqadi. Boshiga qaytdik." },
      3: { ru: 'Части умножаются на четыре, а не между собой. Двадцать на три умножать незачем.', uz: "Qismlar to'rtga ko'paytiriladi, bir-biriga emas. Yigirmani uchga ko'paytirish shart emas." }
    },
    on_correct: { ru: 'Верно! Каждую часть отдельно, потом сложить.', uz: "To'g'ri! Har qismni alohida, keyin qo'shish." },
    rule_lines: {
      ru: [
        'разложи число на десятки и единицы',
        'умножь каждую часть отдельно',
        'сложи результаты — умножение суммы, урок 11'
      ],
      uz: [
        "sonni o'nlik va birlikka ajrating",
        "har bir qismni alohida ko'paytiring",
        "natijalarni qo'shing — yig'indini ko'paytirish, 11-dars"
      ]
    },
    rule_ex: '23 · 4 = 20 · 4 + 3 · 4 = 80 + 12 = 92',
    rule_speech: {
      ru: 'Правило такое. Раскладываем число на десятки и единицы. Умножаем каждую часть отдельно. Потом складываем. Это то же умножение суммы, которое было в уроке про сумму.',
      uz: "Qoida shunday. Sonni o'nlik va birlikka ajratamiz. Har bir qismni alohida ko'paytiramiz. Keyin qo'shamiz. Bu o'sha yig'indini ko'paytirish, yig'indi haqidagi darsda o'tganmiz."
    },
    audio: {
      intro: { ru: 'Теперь главный вопрос урока.', uz: 'Endi darsning asosiy savoli.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Перестановка', uz: "O'rin almashtirish" },
    lead: { ru: 'Если однозначное стоит первым', uz: 'Bir xonali son birinchi tursa' },
    line0: '3 · 27 = 27 · 3',
    line0_cap: { ru: 'перестановка, урок 9', uz: "o'rin almashtirish, 9-dars" },
    line1: '27 · 3 = 20 · 3 + 7 · 3',
    line2: '60 + 21 = 81',
    btn1: { ru: 'Переставить', uz: "O'rnini almashtirish" },
    btn2: { ru: 'Разложить и сосчитать', uz: 'Ajratib sanash' },
    mc_q: { ru: 'Зачем мы переставили множители?', uz: "Ko'paytuvchilarning o'rnini nega almashtirdik?" },
    mc_opts: [
      { ru: 'раскладывать удобно двузначное число', uz: 'ikki xonali sonni ajratish qulay' },
      { ru: 'от перестановки ответ становится другим', uz: "o'rin almashganda javob boshqacha chiqadi" },
      { ru: 'три больше двадцати семи', uz: 'uch yigirma yettidan katta' },
      { ru: 'так требует порядок действий', uz: 'amallar tartibi shuni talab qiladi' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Перестановка ответа не меняет, это правило из урока про таблицу.', uz: "O'rin almashtirish javobni o'zgartirmaydi, bu jadval darsidagi qoida." },
      2: { ru: 'Сравни ещё раз. Три меньше двадцати семи, но дело вовсе не в этом.', uz: 'Yana bir solishtiring. Uch yigirma yettidan kichik, lekin gap bunda emas.' },
      3: { ru: 'Здесь одно действие, порядок ни при чём. Дело в удобстве.', uz: "Bu yerda bitta amal, tartibning aloqasi yo'q. Gap qulaylikda." }
    },
    mc_ok: { ru: 'Верно! Ответ не меняется, а раскладывать двузначное удобнее.', uz: "To'g'ri! Javob o'zgarmaydi, ikki xonalini ajratish esa qulayroq." },
    audio: {
      ru: [
        'А если однозначное число стоит первым? Три умножить на двадцать семь.',
        'У тройки нет десятков, раскладывать нечего. Поэтому переставляем множители местами.',
        'Теперь привычно. Двадцать на три, шестьдесят. Семь на три, двадцать один. Вместе восемьдесят один.'
      ],
      uz: [
        "Bir xonali son birinchi tursa-chi? Uchni yigirma yettiga ko'paytirish kerak.",
        "Uchda o'nliklar yo'q, ajratadigan narsa yo'q. Shuning uchun ko'paytuvchilar o'rnini almashtiramiz.",
        "Endi odatdagidek. Yigirmani uchga, oltmish. Yettini uchga, yigirma bir. Birgalikda sakson bir."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    q: { ru: '14 · 2. Какая запись верна?', uz: "14 · 2. Qaysi yozuv to'g'ri?" },
    opts: [
      { ru: '10 · 2 + 4 · 2', uz: '10 · 2 + 4 · 2' },
      { ru: '10 · 2 + 4', uz: '10 · 2 + 4' },
      { ru: '10 + 4 · 2', uz: '10 + 4 · 2' },
      { ru: '14 + 2', uz: '14 + 2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Десятки умножены, а четыре единицы просто дописаны. Их тоже берут два раза.', uz: "O'nlik ko'paytirilgan, to'rt birlik esa shunchaki yozib qo'yilgan. Ular ham ikki marta olinadi." },
      2: { ru: 'Здесь наоборот. Единицы умножены, а десяток взят один раз.', uz: "Bu yerda teskarisi. Birliklar ko'paytirilgan, o'nlik esa bir marta olingan." },
      3: { ru: 'Это сложение. А в заказе четырнадцать берут два раза.', uz: "Bu qo'shish. Buyurtmada esa o'n to'rt ikki marta olinadi." }
    },
    audio: {
      intro: { ru: 'Четырнадцать умножить на два. Выбери верную запись.', uz: "O'n to'rtni ikkiga ko'paytirish. To'g'ri yozuvni tanlang." },
      on_correct: { ru: 'Верно! Обе части умножены на два. Получится двадцать восемь.', uz: "To'g'ri! Ikkala qism ham ikkiga ko'paytirilgan. Yigirma sakkiz chiqadi." },
      on_wrong: { ru: 'Проверь каждую часть. И десятки, и единицы берут два раза.', uz: "Har qismni tekshiring. O'nliklar ham, birliklar ham ikki marta olinadi." }
    }
  },

  s7: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    q: { ru: '15 · 4 = ?', uz: '15 · 4 = ?' },
    opts: [
      { ru: '60', uz: '60' },
      { ru: '45', uz: '45' },
      { ru: '40', uz: '40' },
      { ru: '420', uz: '420' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Десятки умножены, а пятёрка просто приписана. Пять на четыре это ещё двадцать.', uz: "O'nlik ko'paytirilgan, besh esa shunchaki yozib qo'yilgan. Besh karra to'rt yana yigirma bo'ladi." },
      2: { ru: 'Это только десять на четыре. Пять единиц остались несчитанными.', uz: "Bu faqat o'n karra to'rt. Besh birlik sanalmay qoldi." },
      3: { ru: 'Два ответа склеены в одно число. Части не приписывают, а складывают.', uz: "Ikki javob bitta songa yelimlangan. Qismlar yozib qo'yilmaydi, qo'shiladi." }
    },
    audio: {
      intro: { ru: 'Пятнадцать умножить на четыре. Разложи и сосчитай.', uz: "O'n beshni to'rtga ko'paytiring. Ajrating va sanang." },
      on_correct: { ru: 'Верно! Сорок и двадцать, шестьдесят.', uz: "To'g'ri! Qirq va yigirma, oltmish." },
      on_wrong: { ru: 'Разложи пятнадцать на десять и пять, умножь каждую часть.', uz: "O'n beshni o'n va beshga ajrating, har qismni ko'paytiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    q: { ru: '17 · 4. Набери ответ.', uz: '17 · 4. Javobni tering.' },
    ans: 68,
    check: '40 + 28 = 68',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    hint: { ru: 'Разложи семнадцать. Десять на четыре и семь на четыре. Потом сложи.', uz: "O'n yettini ajrating. O'nni to'rtga va yettini to'rtga. Keyin qo'shing." },
    audio: {
      intro: { ru: 'Семнадцать умножить на четыре. Здесь при сложении будь внимательнее.', uz: "O'n yettini to'rtga ko'paytiring. Bu yerda qo'shishda ehtiyot bo'ling." },
      on_correct: { ru: 'Верно! Сорок и двадцать восемь, шестьдесят восемь.', uz: "To'g'ri! Qirq va yigirma sakkiz, oltmish sakkiz." }
    }
  },

  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'В записи спряталась ошибка. Где она?', uz: 'Yozuvga xato yashiringan. U qayerda?' },
    fig_line: '46 · 2 = 80 + 6 = 86',
    opts: [
      { ru: 'шесть не умножили на два', uz: "olti ikkiga ko'paytirilmagan" },
      { ru: 'сорок умножили неверно', uz: "qirq noto'g'ri ko'paytirilgan" },
      { ru: 'части сложили неверно', uz: "qismlar noto'g'ri qo'shilgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сорок на два это восемьдесят, тут всё честно. Смотри на вторую часть.', uz: "Qirq karra ikki sakson, bu joyi to'g'ri. Ikkinchi qismga qarang." },
      2: { ru: 'Восемьдесят и шесть сложены верно. Но само слагаемое шесть неверное.', uz: "Sakson bilan olti to'g'ri qo'shilgan. Lekin olti qo'shiluvchining o'zi noto'g'ri." },
      3: { ru: 'Проверь вторую часть. Шесть должно стать двенадцатью.', uz: "Ikkinchi qismni tekshiring. Olti o'n ikkiga aylanishi kerak edi." }
    },
    audio: {
      intro: {
        ru: ['Сорок шесть умножить на два. Кто-то посчитал так. Восемьдесят плюс шесть, восемьдесят шесть.', 'В записи спряталась ошибка. Найди, где.'],
        uz: ["Qirq oltini ikkiga ko'paytirishdi. Kimdir shunday hisobladi. Sakson qo'shuv olti, sakson olti.", 'Yozuvga xato yashiringan. Qayerdaligini toping.']
      },
      on_correct: { ru: 'Точно! Шесть тоже нужно умножить. Шесть на два, двенадцать, и ответ девяносто два.', uz: "Aniq! Oltini ham ko'paytirish kerak. Olti karra ikki, o'n ikki, javob to'qson ikki." },
      on_wrong: { ru: 'Проверь каждый шаг записи по очереди.', uz: 'Yozuvning har qadamini navbat bilan tekshiring.' }
    }
  },

  s10: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: '7 · 12 — заполни консоль по частям', uz: "7 · 12 — konsolni qismlab to'ldiring" },
    swap_line: '7 · 12 = 12 · 7',
    cells: [
      { head: { ru: 'десятки', uz: "o'nliklar" }, label: '10 · 7', ans: 70, hint: { ru: 'Десять умножить на семь.', uz: "O'nni yettiga ko'paytiring." } },
      { head: { ru: 'единицы', uz: 'birliklar' }, label: '2 · 7', ans: 14, hint: { ru: 'Два умножить на семь.', uz: "Ikkini yettiga ko'paytiring." } },
      { head: { ru: 'вместе', uz: 'birgalikda' }, label: '70 + 14', ans: 84, hint: { ru: 'Сложи семьдесят и четырнадцать.', uz: "Yetmish bilan o'n to'rtni qo'shing." } }
    ],
    check: '70 + 14 = 84',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    audio: {
      intro: { ru: 'Семь умножить на двенадцать. Сначала переставим, потом заполни консоль по частям.', uz: "Yettini o'n ikkiga ko'paytiramiz. Avval o'rnini almashtiramiz, keyin konsolni qismlab to'ldiring." },
      on_correct: { ru: 'Верно! Семьдесят и четырнадцать, восемьдесят четыре.', uz: "To'g'ri! Yetmish va o'n to'rt, sakson to'rt." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    q: { ru: '2 · 19. Набери ответ.', uz: '2 · 19. Javobni tering.' },
    ans: 38,
    check: '20 + 18 = 38',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    hint: { ru: 'Сначала переставь. Потом разложи девятнадцать на десять и девять.', uz: "Avval o'rnini almashtiring. Keyin o'n to'qqizni o'n va to'qqizga ajrating." },
    audio: {
      intro: { ru: 'Два умножить на девятнадцать. Вспомни, с чего начать, когда однозначное стоит первым.', uz: "Ikkini o'n to'qqizga ko'paytiring. Bir xonali son birinchi turganda nimadan boshlashni eslang." },
      on_correct: { ru: 'Верно! Двадцать и восемнадцать, тридцать восемь.', uz: "To'g'ri! Yigirma va o'n sakkiz, o'ttiz sakkiz." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.' },
    q: { ru: 'Мастерская ставит на модуль по 6 пластин в день. Так шло 14 дней, и осталось поставить 12 пластин. Сколько пластин всего?', uz: "Ustaxona modulga kuniga 6 tadan plastina o'rnatadi. Shunday 14 kun o'tdi va 12 ta plastina o'rnatilmay qoldi. Jami nechta plastina bor?" },
    q_speech: { ru: 'По шесть пластин в день, четырнадцать дней, осталось двенадцать. Сколько пластин всего?', uz: "Kuniga olti plastinadan, o'n to'rt kun, o'n ikkitasi qoldi. Jami nechta plastina?" },
    tbl_heads: [
      { ru: 'В день', uz: 'Kuniga' },
      { ru: 'Дней', uz: 'Kunlar' },
      { ru: 'Осталось', uz: 'Qolgani' }
    ],
    tbl_cells: ['6', '14', '12'],
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '6 · 14 + 12', uz: '6 · 14 + 12' },
      { ru: '6 · 14 − 12', uz: '6 · 14 − 12' },
      { ru: '6 + 14 + 12', uz: '6 + 14 + 12' },
      { ru: '6 · 14', uz: '6 · 14' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Минус убирает пластины. А те двенадцать тоже часть заказа, их добавляют.', uz: "Minus plastinalarni olib tashlaydi. O'sha o'n ikkitasi ham buyurtmaning qismi, ular qo'shiladi." },
      2: { ru: 'По шесть пластин брали четырнадцать раз. Это умножение, а не сложение.', uz: "Olti plastinadan o'n to'rt marta olindi. Bu ko'paytirish, qo'shish emas." },
      3: { ru: 'Это только поставленные пластины. Двенадцать ещё ждут своей очереди.', uz: "Bu faqat o'rnatilgan plastinalar. O'n ikkitasi hali navbat kutyapti." }
    },
    pick_ok: { ru: 'Запись верная. Теперь считай по шагам.', uz: "Yozuv to'g'ri. Endi qadamlab hisoblang." },
    step1_q: '6 · 14 = ?',
    ans1: 84,
    hint1: { ru: 'Шесть умножить на четырнадцать. Переставь и разложи.', uz: "Oltini o'n to'rtga ko'paytiring. O'rnini almashtirib ajrating." },
    step2_q: '84 + 12 = ?',
    ans2: 96,
    hint2: { ru: 'К поставленным прибавь оставшиеся.', uz: "O'rnatilganiga qolganini qo'shing." },
    check: '84 + 12 = 96',
    setup_audio: { ru: 'Задача из мастерской. По шесть пластин в день, четырнадцать дней, и двенадцать ещё не поставлены. Сначала выбери запись, потом считай по шагам.', uz: "Ustaxonadan masala. Kuniga olti plastinadan, o'n to'rt kun, yana o'n ikkitasi o'rnatilmagan. Avval yozuvni tanlang, keyin qadamlab hisoblang." },
    audio: {
      intro: { ru: 'Тут пригодится весь приём.', uz: "Bu yerda butun usul kerak bo'ladi." },
      on_correct: { ru: 'Девяносто шесть пластин! И проверка сошлась. Восемьдесят четыре и двенадцать.', uz: "To'qson olti plastina! Tekshirish ham to'g'ri chiqdi. Sakson to'rt va o'n ikki." },
      on_wrong: { ru: 'Посчитай ещё раз, по шагам.', uz: 'Yana bir bor, qadamlab hisoblang.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Три примера — и приём твой', uz: 'Uch misol va usul sizniki' },
    items: [
      {
        kind: 'num',
        q: { ru: '25 · 4. Набери ответ.', uz: '25 · 4. Javobni tering.' },
        q_speech: { ru: 'Двадцать пять умножить на четыре.', uz: "Yigirma beshni to'rtga ko'paytirish." },
        ans: 100,
        hint: { ru: 'Двадцать на четыре и пять на четыре. Потом сложи.', uz: "Yigirmani to'rtga va beshni to'rtga. Keyin qo'shing." }
      },
      {
        kind: 'mc',
        q: { ru: '2 · 33 = ?', uz: '2 · 33 = ?' },
        q_speech: { ru: 'Два умножить на тридцать три.', uz: "Ikkini o'ttiz uchga ko'paytirish." },
        opt0: { ru: '66', uz: '66' },
        opt1: { ru: '60', uz: '60' },
        opt2: { ru: '63', uz: '63' },
        opt3: { ru: '35', uz: '35' },
        wrong_1: { ru: 'Это только тридцать на два. Три единицы потерялись.', uz: "Bu faqat o'ttiz karra ikki. Uch birlik yo'qoldi." },
        wrong_2: { ru: 'Тройка просто приписана, а её тоже умножают. Три на два, шесть.', uz: "Uch shunchaki yozib qo'yilgan, uni ham ko'paytirish kerak. Uch karra ikki, olti." },
        wrong_3: { ru: 'Это сложение. А тридцать три берут два раза.', uz: "Bu qo'shish. O'ttiz uch esa ikki marta olinadi." }
      },
      {
        kind: 'mc',
        q: { ru: '61 · 3 = ?', uz: '61 · 3 = ?' },
        q_speech: { ru: 'Шестьдесят один умножить на три.', uz: "Oltmish birni uchga ko'paytirish." },
        opt0: { ru: '183', uz: '183' },
        opt1: { ru: '180', uz: '180' },
        opt2: { ru: '181', uz: '181' },
        opt3: { ru: '613', uz: '613' },
        wrong_1: { ru: 'Это только шестьдесят на три. Единица осталась несчитанной.', uz: 'Bu faqat oltmish karra uch. Bir birlik sanalmay qoldi.' },
        wrong_2: { ru: 'Единица просто приписана. Один на три это три, а не один.', uz: "Birlik shunchaki yozib qo'yilgan. Bir karra uch bu uch, bir emas." },
        wrong_3: { ru: 'Множитель приписан к числу, а умножение так не работает.', uz: "Ko'paytuvchi songa yozib qo'yilgan, ko'paytirish bunday ishlamaydi." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Древние египтяне умножали любые числа одним лишь удвоением. Чтобы умножить двадцать три на четыре, они удваивали два раза: двадцать три, сорок шесть, девяносто два. Удвоить дважды это и есть умножить на четыре. Они тоже разбивали трудное умножение на удобные шаги — как ты сегодня разбивал число на десятки и единицы.',
      uz: "Qadimgi misrliklar istalgan sonni faqat ikkilantirish bilan ko'paytirishgan. Yigirma uchni to'rtga ko'paytirish uchun ikki marta ikkilantirishgan: yigirma uch, qirq olti, to'qson ikki. Ikki marta ikkilantirish bu to'rtga ko'paytirish degani. Ular ham qiyin ko'paytirishni qulay qadamlarga bo'lishgan, siz bugun sonni o'nlik va birlikka bo'lganingizdek."
    },
    fact_audio: {
      ru: 'Древние египтяне умножали любые числа одним лишь удвоением. Чтобы умножить двадцать три на четыре, они удваивали два раза. Двадцать три, сорок шесть, девяносто два. Удвоить дважды это и есть умножить на четыре. Они тоже разбивали трудное умножение на удобные шаги. Приём один и тот же. Разбей трудное на удобные шаги.',
      uz: "Qadimgi misrliklar istalgan sonni faqat ikkilantirish bilan ko'paytirishgan. Yigirma uchni to'rtga ko'paytirish uchun ikki marta ikkilantirishgan. Yigirma uch, qirq olti, to'qson ikki. Ikki marta ikkilantirish bu to'rtga ko'paytirish degani. Ular ham qiyin ko'paytirishni qulay qadamlarga bo'lishgan. Usul bitta. Qiyinni qulay qadamlarga bo'ling."
    },
    audio: {
      intro: { ru: 'Финальная проверка, три примера.', uz: 'Yakuniy tekshiruv, uch misol.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Разложи число на десятки и единицы и умножь части.', uz: "Sonni o'nlik va birlikka ajrating va qismlarni ko'paytiring." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Заказ выполнен: четыре модуля готовы!', uz: "Buyurtma bajarildi: to'rt modul tayyor!" },
    cando: { ru: 'Теперь ты умножаешь двузначное число на однозначное без таблицы.', uz: "Endi siz ikki xonali sonni bir xonaliga jadvalsiz ko'paytirasiz." },
    rule_recap: {
      ru: '23 · 4 = 20 · 4 + 3 · 4 = 80 + 12 = 92. Разложи, умножь части, сложи.',
      uz: "23 · 4 = 20 · 4 + 3 · 4 = 80 + 12 = 92. Ajrating, qismlarni ko'paytiring, qo'shing."
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi' },
    conn_refs: { ru: 'урок 9: таблица умножения; урок 11: умножение суммы', uz: "9-dars: ko'paytirish jadvali; 11-dars: yig'indini ko'paytirish" },
    conn_label_next: { ru: 'дальше', uz: 'keyingi' },
    conn_next: { ru: 'двузначное разделить на однозначное', uz: "ikki xonalini bir xonaliga bo'lish" },
    audio: {
      ru: 'Четыре модуля собраны, заказ выполнен. И у тебя новый приём. Запомни главное. Разложи число на десятки и единицы, умножь каждую часть и сложи. Собирать научились. В следующий раз будем раздавать. Разделим большое число на равные части!',
      uz: "To'rt modul yig'ildi, buyurtma bajarildi. Sizda esa yangi usul bor. Asosiysini eslab qoling. Sonni o'nlik va birlikka ajrating, har qismni ko'paytiring va qo'shing. Yig'ishni o'rgandik. Keyingi safar tarqatamiz. Katta sonni teng qismlarga bo'lamiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Разберём заказ по частям.', uz: 'Buyurtmani qismlarga ajratamiz.' },
  s2:  { ru: 'Сначала десятки.', uz: "Avval o'nliklar." },
  s3:  { ru: 'Теперь единицы.', uz: 'Endi birliklar.' },
  s4:  { ru: 'Соберём это в правило.', uz: "Buni qoidaga yig'amiz." },
  s5:  { ru: 'А если наоборот?', uz: "Teskarisi bo'lsa-chi?" },
  s6:  { ru: 'Проверим приём.', uz: 'Usulni tekshiramiz.' },
  s7:  { ru: 'Ещё один пример.', uz: 'Yana bitta misol.' },
  s8:  { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s9:  { ru: 'Кто-то ошибся.', uz: 'Kimdir xato qildi.' },
  s10: { ru: 'Соберём по шагам.', uz: "Qadamlab yig'amiz." },
  s11: { ru: 'И ещё один сам.', uz: "Yana bittasini o'zingiz." },
  s12: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Заказ выполнен. Идём дальше!', uz: 'Buyurtma bajarildi. Davom etamiz!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Четыре модуля собраны, и теперь ты умножаешь двузначное число без таблицы. Спасибо за помощь!',
  uz: "Missiya bajarildi! To'rt modul yig'ildi, endi siz ikki xonali sonni jadvalsiz ko'paytirasiz. Yordamingiz uchun rahmat!"
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



// --- USTAXONA (D19): 3-darsning `RazryadPlazaBg` maydoni qayta ishlangan.
// O'zgargani: deraza KUNDUZGI (tepalik, bog' va quyosh — tungi shahar o'rniga), yoyilma-panel
// o'rniga 4 uyali YIG'ISH STOLI va tepasida kran ilgagi, chapda o'nlik-sterjenlar RAFI,
// o'ngda birlik-kubiklar YASHIGI. Yorug' kun (metodist 18-qoidasi), rekvizit pulsatsiyasiz.
const WorkshopBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d19wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d19sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d19floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <linearGradient id="d19bench" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#C6AE82"/></linearGradient>
      <radialGradient id="d19sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d19lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d19winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    {/* sex devori va shifti (3-dars karkasi) */}
    <rect x="0" y="0" width="400" height="180" fill="url(#d19wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d19lamp)" opacity="0.26"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    {/* DERAZA: kunduzgi osmon, quyosh, tepalik va bog' */}
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
    {/* KRAN ILGAGI: shiftdan yig'ish stoliga tushadi */}
    <line x1="200" y1="24" x2="200" y2="104" stroke="#8A8378" strokeWidth="2"/>
    <rect x="194" y="102" width="12" height="7" rx="2" fill="#8A8378"/>
    <path d="M200 109 q0 9 7 9 q6 0 6 -6" stroke="#6B655C" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* YIG'ISH STOLI: 4 uyali (markzda, yoyilma-panel o'rnida) */}
    <rect x="98" y="122" width="204" height="34" rx="6" fill="url(#d19bench)" stroke="#B4976F" strokeWidth="1.6"/>
    <text x="200" y="119" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">MODUL</text>
    {[0, 1, 2, 3].map((k) => (
      <g key={`slot${k}`} transform={`translate(${112 + k * 47} 128)`}>
        <rect x="0" y="0" width="37" height="22" rx="4" fill="#FBF7F0" stroke="#B4976F" strokeWidth="1" strokeDasharray="3 2.4"/>
        <text x="18.5" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C0A87E" fontFamily="'JetBrains Mono', monospace">23</text>
      </g>
    ))}
    <path d="M150 156 h100 l10 18 h-120 Z" fill="#C3A87E"/><rect x="146" y="172" width="108" height="4" fill="#A98C64"/>
    {/* chap: STERJENLAR RAFI (o'nliklar) */}
    <g transform="translate(8 108)">
      <rect x="0" y="0" width="64" height="64" rx="5" fill="#C3A87E" opacity="0.55"/>
      {[0, 1, 2].map((r) => (
        <g key={`shf${r}`} transform={`translate(6 ${8 + r * 19})`}>
          <rect x="-2" y="12" width="56" height="3" rx="1.5" fill="#A98C64"/>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${k * 27} 0)`}>
              <rect x="0" y="0" width="25" height="10" rx="3" fill="#F2A85C" stroke="#C97F35" strokeWidth="0.8"/>
              <g stroke="#C97F35" strokeWidth="0.5" opacity="0.7">{[1, 2, 3, 4].map((m) => <line key={m} x1={m * 5} y1="1" x2={m * 5} y2="9"/>)}</g>
            </g>
          ))}
        </g>
      ))}
    </g>
    {/* o'ng: KUBIKLAR YASHIGI (birliklar) */}
    <g transform="translate(328 116)">
      <rect x="0" y="10" width="62" height="46" rx="5" fill="#C3A87E"/>
      <rect x="3" y="13" width="56" height="40" rx="3" fill="#B49670"/>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={`cb${k}`} x={7 + (k % 3) * 17} y={17 + Math.floor(k / 3) * 17} width="13" height="13" rx="2.5" fill="#6FD0E4" stroke="#3E8FA8" strokeWidth="0.9"/>
      ))}
    </g>
    {/* pol */}
    <rect x="0" y="176" width="400" height="54" fill="url(#d19floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
);

// Sahna + ekipaj (donor naqshi, faqat fon boshqa).
const WorkshopScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <WorkshopBg/>
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





// --- MODUL DETALLARI: o'nlik-STERJEN (10 katakli) va birlik-KUBIK. Razryad kartasi emas,
// jismonan har xil detallar (metodist 10-qoidasi: aktsent olinayotgan detalda).
const RodSVG = () => (
  <svg viewBox="0 0 56 12" className="d19-rod" aria-hidden="true">
    <rect x="1" y="1" width="54" height="10" rx="3" fill="#F2A85C" stroke="#C97F35" strokeWidth="1"/>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <line key={k} x1={1 + k * 5.4} y1="2" x2={1 + k * 5.4} y2="10" stroke="#C97F35" strokeWidth="0.7" opacity="0.7"/>)}
  </svg>
);
const CubeSVG = () => (
  <svg viewBox="0 0 12 12" className="d19-cube" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" rx="2.4" fill="#6FD0E4" stroke="#3E8FA8" strokeWidth="1"/>
  </svg>
);

// --- YIG'ISH STOLI GURUHLARI: 4 modul qutisi; rods=2 o'nliklar, cubes=3 birliklar.
const D19Module = ({ rods = 0, cubes = 0, dimRods = false }) => (
  <span className="d19-mod">
    {rods > 0 ? (
      <span className={`d19-mod-rods ${dimRods ? 'd19-dim' : 'lm-reveal'}`}>
        {Array.from({ length: rods }).map((_, i) => <RodSVG key={i}/>)}
      </span>
    ) : null}
    {cubes > 0 ? (
      <span className="d19-mod-cubes lm-reveal">
        {Array.from({ length: cubes }).map((_, i) => <CubeSVG key={i}/>)}
      </span>
    ) : null}
    {rods === 0 && cubes === 0 ? <span className="d19-mod-empty mono">?</span> : null}
  </span>
);
const D19Groups = ({ rods = 0, cubes = 0, dimRods = false }) => (
  <div className="d19-groups">
    {[0, 1, 2, 3].map((i) => <D19Module key={i} rods={rods} cubes={cubes} dimRods={dimRods}/>)}
  </div>
);

// --- FACTCARD QAHRAMONI: Misr usuli — ikkilantirish zanjiri 23 -> 46 -> 92.
const DoubleFig = () => (
  <svg viewBox="0 0 220 110" style={{ width: 'min(270px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d19papy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6E9"/><stop offset="100%" stopColor="#F1E2C6"/></linearGradient>
    </defs>
    {[['23', 34, 0], ['46', 110, 1], ['92', 186, 2]].map(([n, cx, k]) => (
      <g key={n} className={k > 0 ? 'd19-slice' : undefined} style={k > 1 ? { animationDelay: '1s' } : undefined}>
        <rect x={cx - 24} y="36" width="48" height="32" rx="9" fill="url(#d19papy)" stroke="#C9B79A" strokeWidth="2.4"/>
        <text x={cx} y="58" textAnchor="middle" fontSize="17" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">{n}</text>
      </g>
    ))}
    {[72, 148].map((x, i) => (
      <g key={`ar${i}`} className="d19-slice" style={{ animationDelay: `${i}s` }}>
        <path d={`M${x - 8} 52 H${x + 8}`} stroke="#FF4F28" strokeWidth="2.4" strokeLinecap="round"/>
        <path d={`M${x + 4} 47 L${x + 9} 52 L${x + 4} 57`} stroke="#FF4F28" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x={x} y="40" textAnchor="middle" fontSize="10" fontWeight="800" fill="#C0392B" fontFamily="'JetBrains Mono', monospace">× 2</text>
      </g>
    ))}
    <text x="110" y="94" textAnchor="middle" fontSize="9" fontWeight="700" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">23 · 4 = 92</text>
  </svg>
);

// --- BITTA SAVOLLI MC (16-darsning soat ekrani naqshi, SOATSIZ): variantlar aralashadi,
// noto'g'ri javob O'TKAZMAYDI, to'g'ri YASHIL, har noto'g'riga o'z tahlili. figLine —
// savol ustidagi mono yozuv (masalan, xatoli hisob). intro satr YOKI massiv bo'ladi.
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
    else { firstRef.current = false; setHintMsg(c.hint); setTimeout(() => { setVal(''); setNumLock(false); }, 1500); }
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
          <WorkshopScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d19-order">
              {[0, 1, 2, 3].map((i) => <span key={i} className="mono d19-order-plate">23</span>)}
            </span>
            <span className="d19-note">{t(c.order_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option mono" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.4vw, 19px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
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
              <span className="mono">{t(opts[order[picked]])}</span>
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

// s1 — MODUL QISMLARGA: 23 = 20 + 3 (TAP bilan)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's1_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
          <span className="mono d19-plate">{c.plate}</span>
          {step >= 1 && (
            <span className="d19-partrow lm-reveal">
              <RodSVG/><RodSVG/>
              <span className="mono d19-partnum" style={{ color: '#C97F35' }}>{c.part1}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="d19-partrow lm-reveal">
              <CubeSVG/><CubeSVG/><CubeSVG/>
              <span className="mono d19-partnum" style={{ color: '#2E7E9E' }}>{c.part2}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d19-formula lm-reveal">{c.formula}</span>}
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

// s2 — O'NLIKLAR: 20 · 4 = 80 (yig'ish stoli, TAP bilan)
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <D19Groups rods={step >= 1 ? 2 : 0}/>
          {step >= 2 && <span className="mono d19-expr lm-reveal">{c.expr}</span>}
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

// s3 — BIRLIKLAR va YIG'INDI: 3 · 4 = 12, keyin 80 + 12 = 92 (13-darsning svyortkasi)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio[lang][0], trigger: 'on_event:step1', waits_for: null },
    { id: 's3_1', text: c.audio[lang][1], trigger: 'on_event:step2', waits_for: null },
    { id: 's3_2', text: c.audio[lang][2], trigger: 'after_previous', waits_for: null }
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
  const foldItems = step >= 2
    ? [{ txt: '80', hot: true }, { txt: '+' }, { txt: '12', hot: true }, { txt: '=' }, { txt: '92', fresh: true, big: true }]
    : [];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <D19Groups rods={2} cubes={step >= 1 ? 3 : 0} dimRods/>
          {step >= 1 && <span className="mono d19-expr lm-reveal">{c.expr1}</span>}
          {step >= 2 && <FoldRow items={foldItems}/>}
          {step >= 2 && <span className="mono d19-final lm-reveal">{c.final_line}</span>}
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

// s5 — ALMASHTIRISH: 3 · 27 (TAP bilan ochilish + savol)
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's5_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's5_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done: built, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const orderMC = React.useMemo(() => shuffleArr(c.mc_opts.map((_, i) => i)), []);
  const mcCi = orderMC.indexOf(c.mc_ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const solved = picked === mcCi;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === mcCi) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      const h = c.mc_hints[orderMC[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.mc_hints[1])[lang]); }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          {step >= 1 && (
            <>
              <span className="mono d19-expr lm-reveal">{c.line0}</span>
              <span className="d19-note lm-reveal">{t(c.line0_cap)}</span>
            </>
          )}
          {step >= 2 && (
            <>
              <span className="mono d19-expr lm-reveal">{c.line1}</span>
              <span className="mono d19-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.line2}</span>
            </>
          )}
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

// s6 — TEST: yozuvni tanlash (14 · 2), rasm YO'Q
const Screen6 = (props) => <MCOne props={props} ck="s6" mono/>;

// s7 — TEST: qiymat (15 · 4), rasm YO'Q
const Screen7 = (props) => <MCOne props={props} ck="s7" mono/>;

// s8 — TRENAJYOR NumPad: 17 · 4
const Screen8 = (props) => <NumOne props={props} ck="s8"/>;

// s9 — XATONI TOP: 46 · 2 = 80 + 6 = 86
const Screen9 = (props) => <MCOne props={props} ck="s9" figLine={CONTENT.s9.fig_line}/>;

// s10 — KONSOL: 7 · 12 uch qadamda (1-dars uslubi, 15-darsning MeasureCell'i)
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
  const [phase, setPhase] = useState(props.storedAnswer ? c.cells.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
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
      setTimeout(() => { setVal(''); setNumLock(false); setPhase((p) => p + 1); }, last ? 400 : 900);
    } else {
      firstRef.current = false;
      setHintMsg(cell.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.lead),
        correctAnswer: '84', studentAnswer: '84', correct: firstRef.current,
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
          <div className="lm-console">
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2}/>
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

// s11 — TRENAJYOR NumPad: 2 · 19
const Screen11 = (props) => <NumOne props={props} ck="s11"/>;

// s12 — MASALA: jadval + yozuv + ikki qadam javob + tekshirish
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
      else { setTimeout(() => { setVal(''); setNumLock(false); setStepNum(1); }, 900); }
    } else {
      firstRef.current = false;
      setHintMsg(stepHint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
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
        <h1 className="title h-sub fade-up" style={{ margin: 0, fontSize: 'clamp(14px, 2.2vw, 19px)' }}>{t(c.q)}</h1>
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
                    style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2.2vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.opts[k])}</button>
                ))}
              </div>
            </>
          )}
          {chosen && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <span className="mono d19-steplabel lm-reveal">{stepNum === 0 ? c.step1_q : c.step2_q}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d19-res lm-reveal">{c.ans2}</span>}
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
              <div className="d2-fact-hero"><DoubleFig/></div>
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
        <div className="d19-final-scene fade-up delay-1"><WorkshopScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function TwoDigitMulLesson({
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
.d19-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d19-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d19-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
/* --- MODUL QISMLARI (s1) --- */
.d19-plate { font-size: clamp(26px, 5.4vw, 38px); font-weight: 800; color: #0E0E10; padding: 4px 18px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d19-partrow { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); }
.d19-partnum { font-size: clamp(17px, 3.4vw, 24px); font-weight: 800; }
.d19-formula { font-size: clamp(19px, 3.8vw, 27px); font-weight: 800; color: #FF4F28; }
/* --- YIG'ISH STOLI GURUHLARI (s2-s3) --- */
.d19-groups { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px, 1.6vw, 12px); }
.d19-mod { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  min-width: clamp(58px, 13vw, 76px); min-height: clamp(42px, 9vw, 56px); padding: clamp(4px, 1vw, 7px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d19-mod-rods { display: flex; flex-direction: column; gap: 2px; }
.d19-mod-cubes { display: flex; gap: 2px; }
.d19-rod { width: clamp(40px, 9vw, 56px); height: auto; display: block; }
.d19-cube { width: clamp(10px, 2.4vw, 13px); height: auto; display: block; }
.d19-dim { opacity: 0.45; }
.d19-mod-empty { font-size: clamp(16px, 3.4vw, 22px); font-weight: 800; color: #C4BEB4; }
/* --- IFODA SATRLARI --- */
.d19-expr { font-size: clamp(17px, 3.4vw, 24px); font-weight: 800; color: #3A3530; }
.d19-final { font-size: clamp(19px, 3.8vw, 27px); font-weight: 800; color: #1F7A4D; }
.d19-errline { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); }
.d19-steplabel { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; }
.d19-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
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
.d19-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d19-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* --- FACTCARD: ikkilantirish zanjiri navbat bilan yonadi --- */
.d19-slice { animation: d19slice 4s ease-in-out infinite; }
@keyframes d19slice { 0%, 8% { opacity: 0.25; } 28%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d19-slice { animation: none; opacity: 1; } }
`;
