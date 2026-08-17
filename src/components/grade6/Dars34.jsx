// ============================================================
// 6 КЛАСС, УРОК 34 «Линейные уравнения»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б9, второй урок. Уравнение вводится как равновесие: с обеих чаш
// снимают одинаковое, и весы остаются в равновесии. Отсюда получаются
// оба действия — перенос слагаемого и деление на коэффициент, — а не
// заучиваются как приёмы.
//
// Сцена — кабинет физики, рычажные весы с гирями и мешочком.
// ============================================================

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import {
  T,
  configureLesson,
  registerLesson,
  navLocked,
  tri,
  pickL,
  mt,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  PREVIEW_START,
  BASE_STYLES,
  Stage,
  Person,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  HintBlock,
  FeedbackBlock,
  FactCard,
  FB_HIST,
  AnimDigits,
  MethodCard,
  HookScreen,
  RevealScreen,
  RuleScreen,
  Classify,
  MultiTask,
  FinalPanel,
  SummaryScreen,
} from './screens.jsx';

const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'grade6-34',
  lessonTitle: {
    ru: 'Линейные уравнения',
    uz: 'Chiziqli tenglamalar',
    en: 'Linear equations',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 tarozi: x + 3 = 10
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 tenglik qachon to'g'ri
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 muvozanat: bir xilini olib tashlaymiz
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: ikkala tomonga bir xil amal
  { id: 's_two',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 ikki bosqichli tenglama
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: noma'lum ikki tomonda
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: amal IKKALA tomonga
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_one',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 bir bosqich x3
  { id: 's_multi',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 ikki bosqich va qavs x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: x = 4 to'g'ri keladimi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: tarozi
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Весы в кабинете физики', uz: 'Fizika xonasidagi tarozi', en: 'Scales in the physics room' },
    lead: {
      ru: 'Слева мешочек и гиря 3 кг, справа гиря 10 кг. Весы в равновесии.',
      uz: "Chapda xaltacha va 3 kg tosh, o'ngda 10 kg tosh. Tarozi muvozanatda.",
      en: 'On the left a bag and a 3 kg weight, on the right a 10 kg weight. The scales balance.',
    },
    voice_a: { ru: 'Санжар: мешочек весит 13 кг.', uz: 'Sanjar: xaltacha 13 kg keladi.', en: 'Sanjar: the bag weighs 13 kg.' },
    voice_b: { ru: 'Малика: нет, 7 кг.', uz: "Malika: yo'q, 7 kg.", en: 'Malika: no, 7 kg.' },
    ask: { ru: 'Сколько весит мешочек?', uz: 'Xaltacha qancha keladi?', en: 'How much does the bag weigh?' },
    options: [
      { ru: '13 кг', uz: '13 kg', en: '13 kg' },
      { ru: '7 кг', uz: '7 kg', en: '7 kg' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В кабинете физики стоят рычажные весы. На левой чаше мешочек с песком и гиря в три килограмма, на правой гиря в десять килограммов. Чаши уравновешены.',
          'Санжар говорит, что мешочек весит тринадцать килограммов, Малика что семь. Сколько весит мешочек? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Fizika xonasida richagli tarozi turibdi. Chap tovoqda qumli xaltacha va uch kilogrammlik tosh, o'ng tovoqda o'n kilogrammlik tosh. Tovoqlar muvozanatda.",
          "Sanjar xaltacha o'n uch kilogramm keladi deydi, Malika esa yetti deydi. Xaltacha qancha keladi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A beam balance stands in the physics room. The left pan holds a bag of sand and a three kilogram weight, the right pan a ten kilogram weight. The pans are level.',
          'Sanjar says the bag weighs thirteen kilograms, Malika says seven. How much does the bag weigh? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Когда равенство верно', uz: "Tenglik qachon to'g'ri", en: 'When an equality is true' },
    done: {
      ru: 'Равенство с буквой верно не всегда, а только при некоторых значениях. Найти такое значение — и значит решить уравнение.',
      uz: "Harfli tenglik har doim emas, faqat ba'zi qiymatlarda to'g'ri bo'ladi. Shunday qiymatni topish tenglamani yechish demakdir.",
      en: 'An equality with a letter is not always true, only for some values. Finding such a value is what solving means.',
    },
    audio: {
      ru: [
        'Вспомним тридцать первый урок. Значение выражения находят подстановкой.',
        'Возьмём равенство икс плюс три равно десяти. При икс равном пяти слева восемь, справа десять: равенство неверно. При икс равном семи слева десять и справа десять: верно.',
        'Такое равенство с буквой называют уравнением, а подходящее значение его корнем. Решить уравнение значит найти корень.',
      ],
      uz: [
        "O'ttiz birinchi darsni eslaymiz. Ifoda qiymati son qo'yish bilan topiladi.",
        "Iks qo'shuv uch o'nga teng tengligini olamiz. Iks beshga teng bo'lganda chapda sakkiz, o'ngda o'n: tenglik noto'g'ri. Iks yettiga teng bo'lganda chapda o'n, o'ngda o'n: to'g'ri.",
        "Bunday harfli tenglikni tenglama, mos qiymatni esa uning ildizi deb atashadi. Tenglamani yechish ildizni topish demakdir.",
      ],
      en: [
        'Recall lesson thirty one. The value of an expression comes from substitution.',
        'Take the equality x plus three equals ten. At x equal to five the left side is eight and the right ten: false. At x equal to seven both sides are ten: true.',
        'Such an equality with a letter is called an equation, and the fitting value is its root. Solving means finding the root.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Снимаем одинаковое с обеих чаш', uz: 'Ikkala tovoqdan bir xilini olamiz', en: 'Take the same off both pans' },
    lines: [
      { ru: 'x + 3 = 10', uz: 'x + 3 = 10', en: 'x + 3 = 10' },
      { ru: 'снимаем 3 кг с каждой чаши', uz: 'har bir tovoqdan 3 kg olamiz', en: 'take 3 kg off each pan' },
      { ru: 'x = 7: равновесие сохранилось', uz: 'x = 7: muvozanat saqlandi', en: 'x = 7: the balance held' },
    ],
    done: {
      ru: 'Если с обеих чаш снять поровну, весы останутся в равновесии. Так уравнение и решают. Права была Малика.',
      uz: "Ikkala tovoqdan teng miqdorda olinsa, tarozi muvozanatda qoladi. Tenglama shunday yechiladi. Malika haq edi.",
      en: 'Take equal amounts off both pans and the scales stay level. That is how an equation is solved. Malika was right.',
    },
    audio: {
      ru: [
        'Весы уравновешены, значит слева и справа масса одинаковая. Мешочек и три килограмма весят столько же, сколько десять килограммов.',
        'Снимем с левой чаши гирю в три килограмма. Чтобы равновесие сохранилось, ровно столько же снимем и справа.',
        'Слева остался мешочек, справа семь килограммов. Значит мешочек весит семь. Санжар сложил вместо того, чтобы снять, и получил тринадцать. Права была Малика.',
      ],
      uz: [
        "Tarozi muvozanatda, demak chapda va o'ngda massa bir xil. Xaltacha va uch kilogramm o'n kilogramm bilan barobar.",
        "Chap tovoqdan uch kilogrammlik toshni olamiz. Muvozanat saqlanishi uchun o'ngdan ham aynan shuncha olamiz.",
        "Chapda xaltacha, o'ngda yetti kilogramm qoldi. Demak xaltacha yetti kilogramm keladi. Sanjar olib tashlash o'rniga qo'shdi va o'n uch chiqardi. Malika haq edi.",
      ],
      en: [
        'The scales balance, so the mass is the same on both sides. The bag and three kilograms weigh as much as ten kilograms.',
        'Take the three kilogram weight off the left pan. To keep the balance, take exactly the same off the right.',
        'The bag is left on one side and seven kilograms on the other. So the bag weighs seven. Sanjar added instead of removing and got thirteen. Malika was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Одно действие — обе части', uz: 'Bitta amal — ikkala tomon', en: 'One move, both sides' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'x − 4 = 9: слева мешочка не хватает 4 кг', uz: "x − 4 = 9: chapda 4 kg yetmayapti", en: 'x − 4 = 9: the left side is 4 kg short' },
      { ru: 'прибавляем 4 к обеим частям', uz: "ikkala tomonga 4 ni qo'shamiz", en: 'add 4 to both sides' },
      { ru: 'x = 13, проверка: 13 − 4 = 9', uz: 'x = 13, tekshiruv: 13 − 4 = 9', en: 'x = 13, check: 13 − 4 = 9' },
    ],
    demo_note: {
      ru: 'Что сделали с одной частью, обязаны сделать и с другой. Только тогда равенство остаётся верным.',
      uz: "Bir tomonga nima qilingan bo'lsa, ikkinchisiga ham qilish shart. Faqat shunda tenglik to'g'ri qoladi.",
      en: 'Whatever you do to one side you must do to the other. Only then does the equality stay true.',
    },
    play_ask: { ru: 'Реши уравнение: x + 6 = 15', uz: 'Tenglamani yeching: x + 6 = 15', en: 'Solve: x + 6 = 15' },
    play_opts: ['9', '21', '15'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Сняли по 6 с обеих частей: x = 9.',
      uz: "To'g'ri. Ikkala tomondan 6 tadan olindi: x = 9.",
      en: 'Right. Six came off both sides: x = 9.',
    },
    play_wrong: [
      null,
      { ru: 'Шестёрку нужно снять, а не прибавить.', uz: "Oltini olib tashlash kerak, qo'shish emas.", en: 'The six must come off, not be added.' },
      { ru: 'Это правая часть, а не значение x.', uz: "Bu o'ng tomon, x ning qiymati emas.", en: 'That is the right side, not the value of x.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу приём на примере икс минус четыре равно девяти.',
        uz: "Usulni iks minus to'rt to'qqizga teng misolida ko'rsataman.",
        en: 'I will show the move on x minus four equals nine.',
      },
      demo: {
        ru: 'Слева от мешочка отняли четыре килограмма. Вернём их: прибавим четыре к левой части и обязательно четыре к правой. Слева остался мешочек, справа тринадцать. Проверим: тринадцать минус четыре девять. Сходится.',
        uz: "Chapda xaltachadan to'rt kilogramm ayirilgan. Uni qaytaramiz: chap tomonga to'rtni qo'shamiz va albatta o'ng tomonga ham to'rtni. Chapda xaltacha, o'ngda o'n uch qoldi. Tekshiramiz: o'n uch minus to'rt to'qqiz. To'g'ri keldi.",
        en: 'Four kilograms were taken from the left. Put them back: add four to the left side and four to the right as well. The bag is alone on the left and thirteen on the right. Check: thirteen minus four is nine. It matches.',
      },
      play: {
        ru: 'Теперь ваша очередь. Решите уравнение икс плюс шесть равно пятнадцати.',
        uz: "Endi sizning navbatingiz. Iks qo'shuv olti o'n beshga teng tenglamasini yeching.",
        en: 'Now it is your turn. Solve x plus six equals fifteen.',
      },
      ok: {
        ru: 'Верно. Сняли по шесть с обеих частей и получили девять.',
        uz: "To'g'ri. Ikkala tomondan oltitadan olindi va to'qqiz chiqdi.",
        en: 'Right. Six came off both sides and left nine.',
      },
      wrong: {
        ru: 'Снимите с обеих частей то, что мешает мешочку остаться одному.',
        uz: "Xaltachaning yolg'iz qolishiga xalaqit berayotgan narsani ikkala tomondan oling.",
        en: 'Remove from both sides whatever keeps the bag from standing alone.',
      },
    },
  },

  s_two: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Уравнение в два шага', uz: 'Ikki bosqichli tenglama', en: 'A two step equation' },
    lines: [
      { ru: '2x + 1 = 9: два мешочка и гиря', uz: '2x + 1 = 9: ikki xaltacha va tosh', en: '2x + 1 = 9: two bags and a weight' },
      { ru: 'сначала снимаем 1: 2x = 8', uz: 'avval 1 ni olamiz: 2x = 8', en: 'first take off 1: 2x = 8' },
      { ru: 'потом делим на 2: x = 4', uz: "keyin 2 ga bo'lamiz: x = 4", en: 'then divide by 2: x = 4' },
    ],
    done: {
      ru: 'Сначала убирают лишнее слагаемое, потом делят на коэффициент. Порядок обратный тому, в каком считали бы значение.',
      uz: "Avval ortiqcha had olib tashlanadi, keyin koeffitsiyentga bo'linadi. Tartib qiymatni hisoblash tartibiga teskari.",
      en: 'First remove the extra term, then divide by the coefficient. The order is the reverse of computing a value.',
    },
    audio: {
      ru: [
        'Теперь на левой чаше два одинаковых мешочка и гиря в один килограмм, справа девять.',
        'Первый шаг тот же: снимаем килограмм с обеих чаш. Осталось два мешочка против восьми килограммов.',
        'Второй шаг новый: если два одинаковых мешочка весят восемь, то один весит четыре. Делим обе части на два. Проверим: два раза по четыре плюс один это девять. Сходится.',
      ],
      uz: [
        "Endi chap tovoqda ikkita bir xil xaltacha va bir kilogrammlik tosh, o'ngda to'qqiz.",
        "Birinchi qadam o'sha: ikkala tovoqdan bir kilogrammdan olamiz. Ikki xaltacha sakkiz kilogrammga qarshi qoldi.",
        "Ikkinchi qadam yangi: ikkita bir xil xaltacha sakkiz kelsa, bittasi to'rt keladi. Ikkala tomonni ikkiga bo'lamiz. Tekshiramiz: ikki marta to'rt qo'shuv bir bu to'qqiz. To'g'ri keldi.",
      ],
      en: [
        'Now the left pan holds two identical bags and a one kilogram weight, the right holds nine.',
        'The first step is the same: take one kilogram off both pans. Two bags remain against eight kilograms.',
        'The second step is new: if two identical bags weigh eight, one weighs four. Divide both sides by two. Check: twice four plus one is nine. It matches.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Мешочки на обеих чашах', uz: 'Xaltachalar ikkala tovoqda', en: 'Bags on both pans' },
    lead: { ru: 'Решим 5x = 2x + 9.', uz: "5x = 2x + 9 ni yechamiz.", en: 'Solve 5x = 2x + 9.' },
    steps: [
      { ru: 'снимаем 2 мешочка с обеих чаш', uz: 'ikkala tovoqdan 2 tadan xaltacha olamiz', en: 'take 2 bags off both pans' },
      { ru: '3x = 9', uz: '3x = 9', en: '3x = 9' },
      { ru: 'делим на 3: x = 3', uz: "3 ga bo'lamiz: x = 3", en: 'divide by 3: x = 3' },
    ],
    done: {
      ru: 'Снимать можно не только гири, но и мешочки — лишь бы поровну с обеих чаш. Проверка: 5 · 3 = 15 и 2 · 3 + 9 = 15.',
      uz: "Faqat toshlarni emas, xaltachalarni ham olish mumkin — ikkala tovoqdan teng bo'lsa bas. Tekshiruv: 5 · 3 = 15 va 2 · 3 + 9 = 15.",
      en: 'You may remove bags as well as weights, as long as it is equal on both pans. Check: 5 · 3 = 15 and 2 · 3 + 9 = 15.',
    },
    audio: {
      ru: [
        'Решаем вместе. Слева пять одинаковых мешочков, справа два таких же мешочка и девять килограммов.',
        'Снимем по два мешочка с каждой чаши: слева останется три мешочка, справа девять килограммов.',
        'Три мешочка весят девять, значит один весит три. Проверим: пять по три это пятнадцать, а два по три плюс девять тоже пятнадцать. Сходится.',
      ],
      uz: [
        "Birga yechamiz. Chapda beshta bir xil xaltacha, o'ngda xuddi shunday ikkita xaltacha va to'qqiz kilogramm.",
        "Har bir tovoqdan ikkitadan xaltacha olamiz: chapda uchta xaltacha, o'ngda to'qqiz kilogramm qoladi.",
        "Uchta xaltacha to'qqiz kelsa, bittasi uch keladi. Tekshiramiz: besh marta uch o'n besh, ikki marta uch qo'shuv to'qqiz ham o'n besh. To'g'ri keldi.",
      ],
      en: [
        'Let us solve it together. Five identical bags on the left, two such bags and nine kilograms on the right.',
        'Take two bags off each pan: three bags remain on the left, nine kilograms on the right.',
        'Three bags weigh nine, so one weighs three. Check: five threes are fifteen, and two threes plus nine is fifteen too. It matches.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Одна чаша не считается', uz: "Bitta tovoq hisobga o'tmaydi", en: 'One pan is not enough' },
    bad_line: { ru: 'ошибка: x + 3 = 10, значит x = 13', uz: 'xato: x + 3 = 10, demak x = 13', en: 'mistake: x + 3 = 10 so x = 13' },
    good_line: { ru: 'верно: снимаем 3 с обеих частей, x = 7', uz: "to'g'ri: ikkala tomondan 3 olamiz, x = 7", en: 'right: take 3 off both sides, x = 7' },
    warn_line: { ru: 'ошибка: 2x = 8 даёт x = 6, вычли вместо деления', uz: "xato: 2x = 8 dan x = 6, bo'lish o'rniga ayirilgan", en: 'mistake: 2x = 8 giving x = 6, subtracting instead of dividing' },
    done: {
      ru: 'Каждый шаг делают с обеими частями, и действие выбирают обратное тому, что стоит у неизвестного. Ответ всегда проверяют подстановкой.',
      uz: "Har bir qadam ikkala tomonga qilinadi, amal esa noma'lum yonidagiga teskari tanlanadi. Javob doim qo'yib tekshiriladi.",
      en: 'Every step applies to both sides, and the move is the opposite of what sits with the unknown. Always check by substituting.',
    },
    audio: {
      ru: [
        'Две частые ошибки урока. Первая: гирю прибавили вместо того, чтобы снять, и получили тринадцать.',
        'Проверка ловит это сразу: тринадцать плюс три это шестнадцать, а не десять. Правильный корень семь.',
        'Вторая ошибка: в записи два икс равно восьми вычитают двойку и получают шесть. Но два икс это не икс плюс два, а икс, взятый дважды. Обе части делят на два, и получается четыре.',
      ],
      uz: [
        "Darsning tez-tez uchraydigan ikki xatosi. Birinchisi: tosh olib tashlanmay, qo'shilgan va o'n uch chiqqan.",
        "Tekshiruv buni darrov ushlaydi: o'n uch qo'shuv uch bu o'n olti, o'n emas. To'g'ri ildiz yetti.",
        "Ikkinchi xato: ikki iks sakkizga teng yozuvida ikkini ayirib, olti deb olishadi. Ammo ikki iks bu iks qo'shuv ikki emas, ikki marta olingan iks. Ikkala tomon ikkiga bo'linadi va to'rt chiqadi.",
      ],
      en: [
        'Two common mistakes here. First: the weight was added instead of removed, giving thirteen.',
        'A check catches it at once: thirteen plus three is sixteen, not ten. The right root is seven.',
        'Second mistake: in two x equals eight the two is subtracted, giving six. But two x is not x plus two, it is x taken twice. Divide both sides by two and get four.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как решают уравнение', uz: 'Tenglama qanday yechiladi', en: 'How an equation is solved' },
    rule_1: {
      ru: 'Уравнение — равенство с буквой, а его корень — значение, при котором равенство верно. С обеими частями делают одно и то же действие: прибавляют, вычитают, умножают или делят на одно число.',
      uz: "Tenglama — harfli tenglik, uning ildizi — tenglik to'g'ri bo'ladigan qiymat. Ikkala tomonga bir xil amal qilinadi: bir xil songa qo'shiladi, ayiriladi, ko'paytiriladi yoki bo'linadi.",
      en: 'An equation is an equality with a letter, and its root is the value that makes it true. Both sides get the same move: add, subtract, multiply or divide by the same number.',
    },
    rule_2: {
      ru: 'Сначала убирают лишние слагаемые, потом делят на коэффициент. Ответ проверяют подстановкой. Весы: x + 3 = 10, значит x = 7. Права была Малика.',
      uz: "Avval ortiqcha hadlar olib tashlanadi, keyin koeffitsiyentga bo'linadi. Javob qo'yib tekshiriladi. Tarozi: x + 3 = 10, demak x = 7. Malika haq edi.",
      en: 'Remove the extra terms first, then divide by the coefficient. Check the answer by substituting. The scales: x + 3 = 10, so x = 7. Malika was right.',
    },
    audio: {
      ru: 'Запомним правило. Уравнение это равенство с буквой, а его корень значение, при котором равенство верно. С обеими частями делают одно и то же действие, иначе равновесие нарушится. Сначала убирают лишние слагаемые, потом делят обе части на коэффициент. Ответ всегда проверяют подстановкой. Вернёмся к весам. Икс плюс три равно десяти, значит икс равен семи. Права была Малика.',
      uz: "Qoidani eslab qolamiz. Tenglama bu harfli tenglik, uning ildizi esa tenglik to'g'ri bo'ladigan qiymat. Ikkala tomonga bir xil amal qilinadi, aks holda muvozanat buziladi. Avval ortiqcha hadlar olib tashlanadi, keyin ikkala tomon koeffitsiyentga bo'linadi. Javob doim qo'yib tekshiriladi. Taroziga qaytamiz. Iks qo'shuv uch o'nga teng, demak iks yettiga teng. Malika haq edi.",
      en: 'Let us remember the rule. An equation is an equality with a letter, and its root is the value that makes it true. Both sides get the same move, otherwise the balance breaks. Remove the extra terms first, then divide both sides by the coefficient. Always check by substituting. Back to the scales. x plus three equals ten, so x equals seven. Malika was right.',
    },
  },

  s_one: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Один шаг', uz: 'Bir bosqich', en: 'One step' },
    lead: { ru: 'Сделай обратное действие с обеими частями.', uz: 'Ikkala tomonga teskari amalni bajaring.', en: 'Do the opposite move on both sides.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Реши: x + 5 = 12', uz: 'Yeching: x + 5 = 12', en: 'Solve: x + 5 = 12' },
        opts: ['7', '17', '12'],
        correct: 0,
        ok: { ru: 'Верно. 12 − 5 = 7, проверка: 7 + 5 = 12.', uz: "To'g'ri. 12 − 5 = 7, tekshiruv: 7 + 5 = 12.", en: 'Right. 12 − 5 = 7, check: 7 + 5 = 12.' },
        wrong: [
          null,
          { ru: 'Пятёрку нужно снять, а не прибавить.', uz: "Beshni olib tashlash kerak, qo'shish emas.", en: 'The five must come off, not be added.' },
          { ru: 'Это правая часть, а не корень.', uz: "Bu o'ng tomon, ildiz emas.", en: 'That is the right side, not the root.' },
        ],
      },
      {
        q: { ru: 'Реши: x − 3 = 8', uz: 'Yeching: x − 3 = 8', en: 'Solve: x − 3 = 8' },
        opts: ['11', '5', '24'],
        correct: 0,
        ok: { ru: 'Верно. 8 + 3 = 11, проверка: 11 − 3 = 8.', uz: "To'g'ri. 8 + 3 = 11, tekshiruv: 11 − 3 = 8.", en: 'Right. 8 + 3 = 11, check: 11 − 3 = 8.' },
        wrong: [
          null,
          { ru: 'Тройку отняли, значит вернуть её надо прибавлением.', uz: "Uch ayirilgan, demak uni qo'shish bilan qaytariladi.", en: 'The three was taken away, so add it back.' },
          { ru: 'Здесь вычитание, а не умножение.', uz: "Bu yerda ayirish, ko'paytirish emas.", en: 'This is subtraction, not multiplication.' },
        ],
      },
      {
        q: { ru: 'Реши: 4x = 20', uz: 'Yeching: 4x = 20', en: 'Solve: 4x = 20' },
        opts: ['5', '16', '80'],
        correct: 0,
        ok: { ru: 'Верно. Обе части делим на 4.', uz: "To'g'ri. Ikkala tomonni 4 ga bo'lamiz.", en: 'Right. Divide both sides by 4.' },
        wrong: [
          null,
          { ru: 'Здесь x взят 4 раза, значит делим, а не вычитаем.', uz: "Bu yerda x 4 marta olingan, demak bo'lamiz, ayirmaymiz.", en: 'Here x is taken 4 times, so divide, do not subtract.' },
          { ru: 'Умножение уже сделано в левой части.', uz: "Ko'paytirish chap tomonda allaqachon bajarilgan.", en: 'The multiplication is already on the left side.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на один шаг. Каждый раз действуйте с обеими частями.',
        uz: 'Bir bosqichli mashq. Har safar ikkala tomonga amal qiling.',
        en: 'One step practice. Each time act on both sides.',
      },
    },
  },

  s_multi: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Два шага и скобки', uz: 'Ikki bosqich va qavslar', en: 'Two steps and brackets' },
    lead: { ru: 'Сначала слагаемые, потом коэффициент.', uz: 'Avval hadlar, keyin koeffitsiyent.', en: 'Terms first, coefficient second.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Реши: 2x + 3 = 11', uz: 'Yeching: 2x + 3 = 11', en: 'Solve: 2x + 3 = 11' },
        opts: ['4', '7', '5'],
        correct: 0,
        ok: { ru: 'Верно. 2x = 8, потом x = 4.', uz: "To'g'ri. 2x = 8, keyin x = 4.", en: 'Right. 2x = 8, then x = 4.' },
        wrong: [
          null,
          { ru: 'Снять тройку — это только первый шаг.', uz: 'Uchni olib tashlash faqat birinchi qadam.', en: 'Removing the three is only the first step.' },
          { ru: 'Проверь: 2 · 5 + 3 = 13, а нужно 11.', uz: 'Tekshiring: 2 · 5 + 3 = 13, kerakli 11 esa.', en: 'Check: 2 · 5 + 3 = 13, but 11 is needed.' },
        ],
      },
      {
        q: { ru: 'Реши: 3x − 5 = 10', uz: 'Yeching: 3x − 5 = 10', en: 'Solve: 3x − 5 = 10' },
        opts: ['5', '15', '2'],
        correct: 0,
        ok: { ru: 'Верно. 3x = 15, потом x = 5.', uz: "To'g'ri. 3x = 15, keyin x = 5.", en: 'Right. 3x = 15, then x = 5.' },
        wrong: [
          null,
          { ru: 'Прибавить пятёрку — только первый шаг, дальше деление.', uz: "Beshni qo'shish faqat birinchi qadam, keyin bo'lish.", en: 'Adding five is only the first step, division follows.' },
          { ru: 'Проверь: 3 · 2 − 5 = 1, а нужно 10.', uz: 'Tekshiring: 3 · 2 − 5 = 1, kerakli 10 esa.', en: 'Check: 3 · 2 − 5 = 1, but 10 is needed.' },
        ],
      },
      {
        q: { ru: 'Реши: 2(x + 1) = 14', uz: 'Yeching: 2(x + 1) = 14', en: 'Solve: 2(x + 1) = 14' },
        opts: ['6', '7', '13'],
        correct: 0,
        ok: { ru: 'Верно. 2x + 2 = 14, дальше 2x = 12 и x = 6.', uz: "To'g'ri. 2x + 2 = 14, keyin 2x = 12 va x = 6.", en: 'Right. 2x + 2 = 14, then 2x = 12 and x = 6.' },
        wrong: [
          null,
          { ru: 'Про единицу в скобке забыли.', uz: 'Qavsdagi bir unutilgan.', en: 'The one inside the bracket was forgotten.' },
          { ru: 'Двойку перед скобкой не учли.', uz: 'Qavs oldidagi ikki hisobga olinmagan.', en: 'The two before the bracket was ignored.' },
        ],
      },
      {
        q: { ru: 'Реши: 4x = x + 9', uz: 'Yeching: 4x = x + 9', en: 'Solve: 4x = x + 9' },
        opts: ['3', '9', '2'],
        correct: 0,
        ok: { ru: 'Верно. Снимаем по x: 3x = 9, значит x = 3.', uz: "To'g'ri. Bittadan x olamiz: 3x = 9, demak x = 3.", en: 'Right. Take one x off each side: 3x = 9, so x = 3.' },
        wrong: [
          null,
          { ru: 'Слева тоже есть иксы, их нужно учесть.', uz: 'Chapda ham ikslar bor, ularni hisobga olish kerak.', en: 'There are x terms on the left too.' },
          { ru: 'Проверь: 4 · 2 = 8, а 2 + 9 = 11.', uz: 'Tekshiring: 4 · 2 = 8, 2 + 9 esa 11.', en: 'Check: 4 · 2 = 8, but 2 + 9 = 11.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика посложнее. Если есть скобки, раскройте их первыми.',
        uz: "Murakkabroq mashq. Qavslar bo'lsa, avval ularni oching.",
        en: 'Harder practice. If there are brackets, open them first.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Подходит ли x = 4', uz: "x = 4 to'g'ri keladimi", en: 'Does x = 4 fit' },
    lead: { ru: 'Подставь четвёрку и сравни части.', uz: "To'rtni qo'ying va tomonlarni solishtiring.", en: 'Substitute four and compare the sides.' },
    bin_a: { ru: 'x = 4 подходит', uz: "x = 4 to'g'ri keladi", en: 'x = 4 fits' },
    bin_b: { ru: 'x = 4 не подходит', uz: "x = 4 to'g'ri kelmaydi", en: 'x = 4 does not fit' },
    cards: [
      { label: 'x + 3 = 7', bin: 'a' },
      { label: '2x = 8', bin: 'a' },
      { label: 'x − 1 = 3', bin: 'a' },
      { label: 'x + 5 = 8', bin: 'b' },
      { label: '3x = 9', bin: 'b' },
      { label: 'x − 2 = 5', bin: 'b' },
    ],
    hint: {
      ru: 'Считайте левую часть при x = 4 и сравнивайте с правой.',
      uz: "x = 4 da chap tomonni hisoblang va o'ng tomon bilan solishtiring.",
      en: 'Compute the left side at x = 4 and compare with the right.',
    },
    correct_text: {
      ru: 'Верно. Проверка подстановкой отвечает на вопрос за один шаг.',
      uz: "To'g'ri. Qo'yib tekshirish savolga bir qadamda javob beradi.",
      en: 'Right. Substitution answers the question in one step.',
    },
    audio: {
      intro: {
        ru: 'Разложите уравнения по двум корзинам. Подставляйте четвёрку и смотрите, сходятся ли части.',
        uz: "Tenglamalarni ikki savatga ajrating. To'rtni qo'ying va tomonlar mos kelishiga qarang.",
        en: 'Sort the equations into two baskets. Substitute four and see whether the sides match.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посчитай левую часть, подставив четвёрку.', uz: "Bu yerga emas. To'rtni qo'yib, chap tomonni hisoblang.", en: 'Not here. Substitute four and compute the left side.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Санжар: «3x = 12, значит x = 9». Проверь.', uz: "Sanjar: «3x = 12, demak x = 9». Tekshiring.", en: 'Sanjar: “3x = 12 so x = 9.” Check it.' },
        opts: [
          { ru: 'Нет: обе части делят на 3, будет 4', uz: "Yo'q: ikkala tomon 3 ga bo'linadi, 4 bo'ladi", en: 'No: divide both sides by 3, it is 4' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 36', uz: "Yo'q, 36 bo'ladi", en: 'No, it is 36' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3x значит x взят трижды, значит делим.', uz: "To'g'ri. 3x bu x uch marta olingan, demak bo'lamiz.", en: 'Right. 3x means x taken three times, so divide.' },
        wrong: [
          null,
          { ru: 'Проверь: 3 · 9 = 27, а нужно 12.', uz: 'Tekshiring: 3 · 9 = 27, kerakli 12 esa.', en: 'Check: 3 · 9 = 27, but 12 is needed.' },
          { ru: 'Умножать не нужно, деление уже даёт ответ.', uz: "Ko'paytirish shart emas, bo'lish javob beradi.", en: 'No multiplying needed, division gives the answer.' },
        ],
      },
      {
        q: { ru: 'Малика: «x − 6 = 4, значит x = −2». Проверь.', uz: "Malika: «x − 6 = 4, demak x = −2». Tekshiring.", en: 'Malika: “x − 6 = 4 so x = −2.” Check it.' },
        opts: [
          { ru: 'Нет: прибавляем 6 к обеим частям, x = 10', uz: "Yo'q: ikkala tomonga 6 qo'shiladi, x = 10", en: 'No: add 6 to both sides, x = 10' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 24', uz: "Yo'q, 24 bo'ladi", en: 'No, it is 24' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Проверка: 10 − 6 = 4.', uz: "To'g'ri. Tekshiruv: 10 − 6 = 4.", en: 'Right. Check: 10 − 6 = 4.' },
        wrong: [
          null,
          { ru: 'Проверь: −2 − 6 это −8, а нужно 4.', uz: 'Tekshiring: −2 − 6 bu −8, kerakli 4 esa.', en: 'Check: −2 − 6 is −8, but 4 is needed.' },
          { ru: 'Здесь вычитание, а не умножение.', uz: "Bu yerda ayirish, ko'paytirish emas.", en: 'This is subtraction, not multiplication.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Подстановка корня показывает ошибку сразу.',
        uz: "Birovning yechimini tekshiring. Ildizni qo'yish xatoni darrov ko'rsatadi.",
        en: 'Check someone else’s work. Substituting the root shows the mistake at once.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Мешочки и гири', uz: 'Xaltachalar va toshlar', en: 'Bags and weights' },
    lead: { ru: 'Все мешочки одинаковые, их масса x килограммов.', uz: "Barcha xaltachalar bir xil, massasi x kilogramm.", en: 'All bags are identical and weigh x kilograms.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Слева 3 мешочка, справа 12 кг. Сколько весит мешочек?', uz: "Chapda 3 ta xaltacha, o'ngda 12 kg. Xaltacha qancha keladi?", en: 'Three bags on the left, 12 kg on the right. How heavy is one bag?' },
        opts: [
          { ru: '4 кг', uz: '4 kg', en: '4 kg' },
          { ru: '9 кг', uz: '9 kg', en: '9 kg' },
          { ru: '36 кг', uz: '36 kg', en: '36 kg' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 3x = 12, обе части делим на 3.', uz: "To'g'ri. 3x = 12, ikkala tomonni 3 ga bo'lamiz.", en: 'Right. 3x = 12, divide both sides by 3.' },
        wrong: [
          null,
          { ru: 'Три мешочка не отнимают, а делят.', uz: "Uchta xaltacha ayirilmaydi, bo'linadi.", en: 'The three bags are divided out, not subtracted.' },
          { ru: 'Это масса всех мешочков, если бы каждый весил 12.', uz: 'Bu har biri 12 kelganda barcha xaltachalar massasi.', en: 'That would be the total if each weighed 12.' },
        ],
      },
      {
        q: { ru: 'Слева 2 мешочка и 5 кг, справа 17 кг. Сколько весит мешочек?', uz: "Chapda 2 ta xaltacha va 5 kg, o'ngda 17 kg. Xaltacha qancha keladi?", en: 'Two bags and 5 kg on the left, 17 kg on the right. One bag?' },
        opts: [
          { ru: '6 кг', uz: '6 kg', en: '6 kg' },
          { ru: '11 кг', uz: '11 kg', en: '11 kg' },
          { ru: '12 кг', uz: '12 kg', en: '12 kg' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 2x + 5 = 17, дальше 2x = 12 и x = 6.', uz: "To'g'ri. 2x + 5 = 17, keyin 2x = 12 va x = 6.", en: 'Right. 2x + 5 = 17, then 2x = 12 and x = 6.' },
        wrong: [
          null,
          { ru: 'Снять пятёрку — только первый шаг.', uz: 'Beshni olib tashlash faqat birinchi qadam.', en: 'Removing the five is only the first step.' },
          { ru: 'Это масса двух мешочков, а спрашивают про один.', uz: "Bu ikki xaltacha massasi, so'ralayotgani esa bittasi.", en: 'That is the mass of two bags, but one was asked.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про весы. Все мешочки одинаковые, их масса икс килограммов.',
        uz: "Tarozi haqida masala. Barcha xaltachalar bir xil, massasi iks kilogramm.",
        en: 'A scales problem. All bags are identical and weigh x kilograms.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 7,
        q: { ru: 'Реши уравнение x + 8 = 15. Набери корень.', uz: 'x + 8 = 15 tenglamasini yeching. Ildizni tering.', en: 'Solve x + 8 = 15. Type the root.' },
        hint: { ru: 'Сними по 8 с обеих частей.', uz: 'Ikkala tomondan 8 tadan oling.', en: 'Take 8 off both sides.' },
        hint_audio: { ru: 'Снимите восемь с обеих частей и посмотрите, что осталось справа.', uz: "Ikkala tomondan sakkizni oling va o'ngda nima qolganiga qarang.", en: 'Take eight off both sides and see what remains on the right.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Реши: 6x = 42', uz: 'Yeching: 6x = 42', en: 'Solve: 6x = 42' },
        opts: ['36', '48', '7', '252'],
        wrong: [
          { ru: 'Здесь x взят 6 раз, значит делим.', uz: "Bu yerda x 6 marta olingan, demak bo'lamiz.", en: 'Here x is taken 6 times, so divide.' },
          { ru: 'Прибавлять не нужно: слева умножение.', uz: "Qo'shish shart emas: chapda ko'paytirish.", en: 'No adding needed: the left side is a product.' },
          null,
          { ru: 'Умножение уже сделано в левой части.', uz: "Ko'paytirish chap tomonda bajarilgan.", en: 'The multiplication is already on the left.' },
        ],
        correct: { ru: 'Верно. 42 : 6 = 7, проверка: 6 · 7 = 42.', uz: "To'g'ri. 42 : 6 = 7, tekshiruv: 6 · 7 = 42.", en: 'Right. 42 : 6 = 7, check: 6 · 7 = 42.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Реши: 5x − 4 = 16', uz: 'Yeching: 5x − 4 = 16', en: 'Solve: 5x − 4 = 16' },
        opts: ['20', '4', '3', '12'],
        wrong: [
          { ru: 'Прибавить четвёрку — только первый шаг.', uz: "To'rtni qo'shish faqat birinchi qadam.", en: 'Adding four is only the first step.' },
          null,
          { ru: 'Проверь: 5 · 3 − 4 = 11, а нужно 16.', uz: 'Tekshiring: 5 · 3 − 4 = 11, kerakli 16 esa.', en: 'Check: 5 · 3 − 4 = 11, but 16 is needed.' },
          { ru: 'Четвёрку прибавляют, а не отнимают ещё раз.', uz: "To'rt qo'shiladi, yana ayirilmaydi.", en: 'The four is added back, not subtracted again.' },
        ],
        correct: { ru: 'Верно. 5x = 20, значит x = 4.', uz: "To'g'ri. 5x = 20, demak x = 4.", en: 'Right. 5x = 20, so x = 4.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что называют корнем уравнения?', uz: 'Tenglama ildizi deb nimaga aytiladi?', en: 'What is the root of an equation?' },
        opts: [
          { ru: 'любое число', uz: 'istalgan sonni', en: 'any number' },
          { ru: 'коэффициент при букве', uz: 'harf oldidagi koeffitsiyentni', en: 'the coefficient of the letter' },
          { ru: 'правую часть равенства', uz: "tenglikning o'ng tomonini", en: 'the right side of the equality' },
          { ru: 'значение, при котором равенство верно', uz: "tenglik to'g'ri bo'ladigan qiymatni", en: 'the value that makes it true' },
        ],
        wrong: [
          { ru: 'Подходит не любое: проверка это показывает.', uz: "Har qanday son mos kelmaydi: tekshiruv shuni ko'rsatadi.", en: 'Not any number fits: a check shows that.' },
          { ru: 'Коэффициент это число перед буквой, а не корень.', uz: 'Koeffitsiyent harf oldidagi son, ildiz emas.', en: 'The coefficient sits before the letter, it is not the root.' },
          { ru: 'В уравнении x + 3 = 10 правая часть 10, а корень 7.', uz: "x + 3 = 10 tenglamasida o'ng tomon 10, ildiz esa 7.", en: 'In x + 3 = 10 the right side is 10 but the root is 7.' },
          null,
        ],
        correct: { ru: 'Верно. Корень проверяют подстановкой.', uz: "To'g'ri. Ildiz qo'yib tekshiriladi.", en: 'Right. A root is checked by substitution.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Слева 4 мешочка, справа мешочек и 9 кг. Масса мешочка?', uz: "Chapda 4 ta xaltacha, o'ngda bitta xaltacha va 9 kg. Xaltacha massasi?", en: 'Four bags on the left, one bag and 9 kg on the right. One bag?' },
        opts: [
          { ru: '3 кг', uz: '3 kg', en: '3 kg' },
          { ru: '9 кг', uz: '9 kg', en: '9 kg' },
          { ru: '2 кг', uz: '2 kg', en: '2 kg' },
          { ru: '5 кг', uz: '5 kg', en: '5 kg' },
        ],
        wrong: [
          null,
          { ru: 'Слева тоже мешочки, их нужно учесть.', uz: 'Chapda ham xaltachalar bor, ularni hisobga olish kerak.', en: 'There are bags on the left too.' },
          { ru: 'Проверь: 4 · 2 = 8, а 2 + 9 = 11.', uz: 'Tekshiring: 4 · 2 = 8, 2 + 9 esa 11.', en: 'Check: 4 · 2 = 8, but 2 + 9 = 11.' },
          { ru: 'Проверь: 4 · 5 = 20, а 5 + 9 = 14.', uz: 'Tekshiring: 4 · 5 = 20, 5 + 9 esa 14.', en: 'Check: 4 · 5 = 20, but 5 + 9 = 14.' },
        ],
        correct: { ru: 'Верно. 4x = x + 9, значит 3x = 9 и x = 3.', uz: "To'g'ri. 4x = x + 9, demak 3x = 9 va x = 3.", en: 'Right. 4x = x + 9, so 3x = 9 and x = 3.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: 'Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.',
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'Слово «алгебра» родилось из названия трактата аль-Хорезми, уроженца Хорезма, работавшего в IX веке. Действие «аль-джабр» означало восстановление: перенести вычитаемое в другую часть равенства, чтобы оно стало положительным. Именно этим вы сегодня и занимались, снимая гири с обеих чаш.',
      uz: "«Algebra» so'zi IX asrda ishlagan xorazmlik al-Xorazmiy risolasi nomidan tug'ilgan. «Al-jabr» amali tiklash degan ma'noni bildirgan: ayriluvchini musbat bo'lishi uchun tenglikning boshqa tomoniga o'tkazish. Siz bugun toshlarni ikkala tovoqdan olib, aynan shu bilan shug'ullandingiz.",
      en: 'The word algebra comes from the title of a treatise by al-Khwarizmi, a native of Khorezm who worked in the ninth century. The operation al-jabr meant restoring: moving a subtracted term to the other side so it becomes positive. That is exactly what you did today by taking weights off both pans.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Слово алгебра родилось из названия трактата аль-Хорезми, уроженца Хорезма, работавшего в девятом веке. Действие аль-джабр означало восстановление: перенести вычитаемое в другую часть равенства, чтобы оно стало положительным. Именно этим ты сегодня и занимался, снимая гири с обеих чаш.',
      uz: "Bilasizmi? Algebra so'zi to'qqizinchi asrda ishlagan xorazmlik al-Xorazmiy risolasi nomidan tug'ilgan. Al-jabr amali tiklash degan ma'noni bildirgan: ayriluvchini musbat bo'lishi uchun tenglikning boshqa tomoniga o'tkazish. Siz bugun toshlarni ikkala tovoqdan olib, aynan shu bilan shug'ullandingiz.",
      en: 'Did you know? The word algebra comes from the title of a treatise by al-Khwarizmi, a native of Khorezm who worked in the ninth century. The operation al-jabr meant restoring: moving a subtracted term to the other side so it becomes positive. That is exactly what you did today by taking weights off both pans.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Уравнения', uz: 'Matematika · Tenglamalar', en: 'Mathematics · Equations' },
    heading: { ru: 'Линейные уравнения', uz: 'Chiziqli tenglamalar', en: 'Linear equations' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'уравнение — это равновесие', uz: 'tenglama — bu muvozanat', en: 'an equation is a balance' },
    brief_2: { ru: 'действие делают с обеими частями', uz: 'amal ikkala tomonga qilinadi', en: 'a move applies to both sides' },
    brief_3: { ru: 'сначала слагаемые, потом коэффициент', uz: 'avval hadlar, keyin koeffitsiyent', en: 'terms first, coefficient second' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Корень уравнения', uz: 'Tenglama ildizi', en: 'The root' },
    memo_a1: { ru: 'делает равенство верным', uz: "tenglikni to'g'ri qiladi", en: 'makes the equality true' },
    memo_q2: { ru: 'Запись 3x = 12', uz: '3x = 12 yozuvi', en: 'The line 3x = 12' },
    memo_a2: { ru: 'решается делением', uz: "bo'lish bilan yechiladi", en: 'is solved by dividing' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'изменить только одну часть', uz: "faqat bir tomonni o'zgartirish", en: 'changing only one side' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Уравнение это равенство с буквой, а решить его значит найти корень. С обеими частями делают одно и то же действие, иначе равновесие нарушится. Сначала убирают лишние слагаемые, потом делят на коэффициент, а ответ проверяют подстановкой.',
        'Весы: икс плюс три равно десяти, значит икс равен семи.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Tenglama bu harfli tenglik, uni yechish esa ildizni topish demak. Ikkala tomonga bir xil amal qilinadi, aks holda muvozanat buziladi. Avval ortiqcha hadlar olib tashlanadi, keyin koeffitsiyentga bo'linadi, javob esa qo'yib tekshiriladi.",
        "Tarozi: iks qo'shuv uch o'nga teng, demak iks yettiga teng.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'An equation is an equality with a letter, and solving it means finding the root. Both sides get the same move, otherwise the balance breaks. Remove the extra terms first, then divide by the coefficient, and check by substituting.',
        'The scales: x plus three equals ten, so x equals seven.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Держим равновесие', uz: 'Usul. Muvozanatni saqlaymiz', en: 'Method. Keep the balance' },
    m1_steps: {
      ru: ['Убери лишние слагаемые с обеих частей', 'Раздели обе части на коэффициент', 'Подставь корень и проверь'],
      uz: ['Ikkala tomondan ortiqcha hadlarni oling', "Ikkala tomonni koeffitsiyentga bo'ling", "Ildizni qo'ying va tekshiring"],
      en: ['Remove the extra terms from both sides', 'Divide both sides by the coefficient', 'Substitute the root and check'],
    },
    m1_no: {
      ru: 'Действие всегда идёт в обе части: изменили одну — равенство сломалось.',
      uz: "Amal doim ikkala tomonga qilinadi: bittasini o'zgartirsangiz, tenglik buziladi.",
      en: 'A move always goes to both sides: change one and the equality breaks.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: кабинет физики, рычажные весы на столе.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d34wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE7D8"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d34wall)"/>

    {/* Шкаф с приборами и плакат */}
    <g opacity="0.9">
      <rect x="10" y="20" width="66" height="88" rx="4" fill="#E4D9C6" stroke="#C9A472" strokeWidth="2"/>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x="16" y={30 + k * 26} width="54" height="3" rx="1.5" fill="#C9A472"/>
          <rect x={20 + k * 6} y={20 + k * 26} width="10" height="9" rx="2" fill="#7ECBE6"/>
          <circle cx={48 + k * 4} cy={26 + k * 26} r="4" fill="#D9603F"/>
        </g>
      ))}
      <rect x="322" y="18" width="62" height="44" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="1.8"/>
      <path d="M330 52 h46 M330 44 h30 M330 36 h38" stroke="#B4A48C" strokeWidth="2" strokeLinecap="round"/>
    </g>

    {/* Стол и рычажные весы */}
    <rect x="96" y="112" width="216" height="7" rx="3" fill="#C9A472"/>
    <rect x="112" y="119" width="7" height="20" fill="#B08A55"/>
    <rect x="290" y="119" width="7" height="20" fill="#B08A55"/>

    <g>
      <path d="M204 112 v-50" stroke="#8E8578" strokeWidth="4"/>
      <path d="M204 62 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" fill="#8E8578"/>
      <g className="d34-beam">
        <path d="M136 62 h136" stroke="#8E8578" strokeWidth="3.6" strokeLinecap="round"/>
        <path d="M140 62 v18 M268 62 v18" stroke="#8E8578" strokeWidth="1.6"/>
        <path d="M114 84 h52 a4 4 0 0 1 -4 8 h-44 a4 4 0 0 1 -4 -8 z" fill="#D9B989" stroke="#C9A472" strokeWidth="1.6"/>
        <path d="M242 84 h52 a4 4 0 0 1 -4 8 h-44 a4 4 0 0 1 -4 -8 z" fill="#D9B989" stroke="#C9A472" strokeWidth="1.6"/>

        {/* Левая чаша: мешочек и гиря 3 */}
        <path d="M124 84 q4 -20 12 -20 q8 0 12 20 z" fill="#B99B72" stroke="#8B7350" strokeWidth="1.4"/>
        <text x="136" y="80" textAnchor="middle" fill="#FFFDF7"
          fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">x</text>
        <rect x="150" y="70" width="14" height="14" rx="2" fill="#7B7367"/>
        <text x="157" y="81" textAnchor="middle" fill="#FFFDF7"
          fontFamily="'JetBrains Mono', monospace" fontSize="8" fontWeight="700">3</text>

        {/* Правая чаша: гиря 10 */}
        <rect x="258" y="66" width="20" height="18" rx="2" fill="#7B7367"/>
        <rect x="264" y="62" width="8" height="5" rx="2" fill="#7B7367"/>
        <text x="268" y="79" textAnchor="middle" fill="#FFFDF7"
          fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">10</text>
      </g>
    </g>

    {/* Двое у стола */}
    <Person x={330} ground={140} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={366} ground={140} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: с обеих чаш сняли одинаковое.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <g>
        <rect x="24" y="16" width="130" height="40" rx="8" fill="#FFF1EC" stroke="#F3C4B4" strokeWidth="2"/>
        <text x="89" y="42" textAnchor="middle" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">x + 3 = 10</text>
      </g>
      <path d="M166 36 h34" stroke="#8E8578" strokeWidth="2.4" markerEnd="url(#d34fin)"/>
      <defs>
        <marker id="d34fin" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill="#8E8578"/>
        </marker>
      </defs>
      <g>
        <rect x="212" y="16" width="164" height="40" rx="8" fill="#E3F0E8" stroke="#A9CFBA" strokeWidth="2"/>
        <text x="294" y="42" textAnchor="middle" fill="#1F7A4D"
          fontFamily="'JetBrains Mono', monospace" fontSize="17" fontWeight="700">x = 7</text>
      </g>
      <text x="200" y="76" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'сняли по 3 с обеих чаш, равновесие осталось',
          'ikkala tovoqdan 3 tadan olindi, muvozanat qoldi',
          'three came off both pans and the balance held')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: чаши весов с мешочками и гирями.
const Scale = ({ left, right, size = 'mid' }) => {
  const pan = (items, x0) => {
    let cursor = x0;
    return items.map((it, i) => {
      const w = it.kind === 'bag' ? 22 : 20;
      const node = it.kind === 'bag' ? (
        <g key={i} transform={`translate(${cursor}, 0)`}>
          <path d="M0 42 q2 -22 11 -22 q9 0 11 22 z" fill="#B99B72" stroke="#8B7350" strokeWidth="1.6"/>
          <text x="11" y="38" textAnchor="middle" fill="#FFFDF7"
            fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">x</text>
        </g>
      ) : (
        <g key={i} transform={`translate(${cursor}, 0)`}>
          <rect x="0" y="22" width="20" height="20" rx="2" fill="#7B7367"/>
          <rect x="6" y="18" width="8" height="5" rx="2" fill="#7B7367"/>
          <text x="10" y="36" textAnchor="middle" fill="#FFFDF7"
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">{it.n}</text>
        </g>
      );
      cursor += w + 6;
      return node;
    });
  };
  return (
    <span className={'d34-scale-box d34-scale-' + size}>
      <svg viewBox="0 0 360 84" aria-hidden="true">
        <path d="M180 78 v-56" stroke="#8E8578" strokeWidth="4"/>
        <path d="M40 22 h280" stroke="#8E8578" strokeWidth="3.6" strokeLinecap="round"/>
        <path d="M44 22 v16 M316 22 v16" stroke="#8E8578" strokeWidth="1.6"/>
        <path d="M14 44 h60 a5 5 0 0 1 -5 9 h-50 a5 5 0 0 1 -5 -9 z" fill="#D9B989" stroke="#C9A472" strokeWidth="1.6"/>
        <path d="M286 44 h60 a5 5 0 0 1 -5 9 h-50 a5 5 0 0 1 -5 -9 z" fill="#D9B989" stroke="#C9A472" strokeWidth="1.6"/>
        <g transform="translate(0, 2)">{pan(left, 18)}</g>
        <g transform="translate(0, 2)">{pan(right, 290)}</g>
        <rect x="150" y="78" width="60" height="5" rx="2.5" fill="#C9A472"/>
      </svg>
    </span>
  );
};

// Строка решения: обе части и действие между ними.
const Step = ({ left, right, note, on }) => (
  <span className={'d34-step d34-fade' + (on ? ' d34-on' : '')}>
    <i className="d34-side">{left}</i>
    <b>=</b>
    <i className="d34-side">{right}</i>
    {note && <em className="d34-note">{note}</em>}
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d34-line d34-fade' + (on ? ' d34-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d34-stage">
        <span className="d34-check">
          <i className="d34-check-bad">x = 5: 8 ≠ 10</i>
          <i className={'d34-check-good d34-fade' + (step >= 1 ? ' d34-on' : '')}>x = 7: 10 = 10</i>
        </span>
        <span className={'d34-chips d34-fade' + (step >= 2 ? ' d34-on' : '')}>
          <i className="d34-chip-g">{tri(lang, 'корень уравнения', 'tenglama ildizi', 'the root')}</i>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: снимаем три килограмма с обеих чаш.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d34-stage">
        <Scale size="sm"
          left={step >= 1 ? [{ kind: 'bag' }] : [{ kind: 'bag' }, { kind: 'w', n: 3 }]}
          right={step >= 1 ? [{ kind: 'w', n: 7 }] : [{ kind: 'w', n: 10 }]}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Два шага: сначала слагаемое, потом коэффициент.
const TwoBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_two;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d34-stage">
        <Scale size="sm"
          left={step >= 1 ? [{ kind: 'bag' }, { kind: 'bag' }] : [{ kind: 'bag' }, { kind: 'bag' }, { kind: 'w', n: 1 }]}
          right={step >= 1 ? [{ kind: 'w', n: 8 }] : [{ kind: 'w', n: 9 }]}/>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d34-stage">
        <Step left="5x" right="2x + 9" on={step >= 0}/>
        <Step left="3x" right="9" on={step >= 1}/>
        <Step left="x" right="3" on={step >= 2}/>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Граница: действие только с одной частью.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d34-stage">
        <span className="d34-pair d34-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d34-pair d34-pair-good d34-fade' + (step >= 1 ? ' d34-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d34-pair d34-pair-warn d34-fade' + (step >= 2 ? ' d34-on' : '')}>
          <Line node={t(c.warn_line)} on/>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-tip fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ЭКРАН 4 — «сначала показали, потом сам»
// ============================================================
const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(0);
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === c.play_correct;
  const done = shown >= 2;

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1400));
    if (shown === 1) timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1600));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (i) => {
    if (solved) return;
    setPicked(i);
    if (i !== c.play_correct) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: c.play_opts[c.play_correct], studentAnswer: c.play_opts[i],
        correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true,
      });
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!solved || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d34-banner fade-up delay-1' + (phase === 'play' ? ' d34-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d34-stage d34-stage-tool">
          {phase === 'demo' ? (
            <>
              <Step left="x − 4" right="9" on={shown >= 0}/>
              <Step left="x" right="13" on={shown >= 2}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d34-verdict' + (done ? ' d34-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d34-acts fade-up">
            <button className="d34-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d34-btn d34-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 3 : shown}/>
      </div>
    </Stage>
  );
};

// ============================================================
// ОБЁРТКИ ЭКРАНОВ
// ============================================================
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<HookScene/>}/>
);
const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);
const ScreenCore = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_core} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <CoreBody step={step}/>}/>
);
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenTwo = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_two} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <TwoBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => (
  <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
    exampleNode={(
      <div className="d34-stage">
        <Scale size="sm" left={[{ kind: 'bag' }]} right={[{ kind: 'w', n: 7 }]}/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenOne = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_one} asideNode={methodAside}/>
);
const ScreenMulti = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_multi} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: чаши весов из условия.
const TaskFig = ({ idx }) => (
  <div className="d34-task-fig">
    <Scale size="sm"
      left={idx >= 1
        ? [{ kind: 'bag' }, { kind: 'bag' }, { kind: 'w', n: 5 }]
        : [{ kind: 'bag' }, { kind: 'bag' }, { kind: 'bag' }]}
      right={idx >= 1 ? [{ kind: 'w', n: 17 }] : [{ kind: 'w', n: 12 }]}/>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_HIST} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
);

const SummaryCards = () => {
  const t = useT();
  const c = CONTENT.s14;
  return (
    <div className="frame sm-card">
      <p className="sm-card-h">{t(c.memo_title)}</p>
      <div className="mm-grid">
        {[[c.memo_q1, c.memo_a1], [c.memo_q2, c.memo_a2], [c.memo_q3, c.memo_a3]].map((row, i) => (
          <span className="mm-row" key={i}>
            <span className="mm-q">{t(row[0])}</span>
            <span className="mm-a">{t(row[1])}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Screen14 = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14}
    sceneNode={<FinalScene/>} cards={<SummaryCards/>}/>
);

// ============================================================
// CSS УРОКА
// ============================================================
const LESSON_STYLES = `
.d34-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d34-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d34-stage-tool .d34-line { font-size: clamp(12px, 2vw, 16px); }

/* Весы */
.d34-scale-box { display: block; width: 100%; max-width: 320px; }
.d34-scale-sm { max-width: 260px; }
.d34-scale-box svg { width: 100%; height: auto; display: block; }

.d34-fade { opacity: 0; transition: opacity 420ms linear; }
.d34-on { opacity: 1; }
.d34-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; text-align: center; }

/* Строка решения */
.d34-step { display: inline-flex; align-items: center; gap: clamp(6px, 1.3vw, 11px); flex-wrap: wrap; justify-content: center; }
.d34-step b { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 22px); color: #8A8883; }
.d34-side { font-style: normal; padding: 5px 14px; border-radius: 11px; background: #F4F1EA; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 22px); font-weight: 700; color: #494550; }
.d34-note { font-style: normal; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 13px); font-weight: 700; color: #8A8883; }

/* Проверка подстановкой */
.d34-check { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d34-check i { font-style: normal; padding: 6px 14px; border-radius: 11px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; }
.d34-check-bad { background: #FFF1EC; border: 1px solid #F3C4B4; color: #D9603F; }
.d34-check-good { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Подписи */
.d34-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d34-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d34-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d34-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d34-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d34-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d34-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d34-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d34-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d34-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d34-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d34-verdict-on { opacity: 1; }
.d34-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d34-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d34-btn:disabled { opacity: 0.45; cursor: default; }
.d34-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d34-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: коромысло чуть покачивается и замирает в равновесии */
.d34-beam { transform-origin: 204px 62px; animation: d34Beam 5200ms ease-in-out infinite; }
@keyframes d34Beam { 0%, 100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.6deg); } }
@media (prefers-reduced-motion: reduce) { .d34-beam { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function LinearEquationLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || tri(lang, 'Ученик', "O'quvchi", 'Student');
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm',
    navLock: false,
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenTwo, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenOne, ScreenMulti, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
  const CurrentScreen = screens[current];

  const finishLesson = () => {
    if (!onFinished) return;
    onFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      answers: answers.filter(Boolean),
    });
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="lesson-root">
        <style>{STYLES}</style>
        {isPreview && (
          <div className="g6-lang-switch">
            {['ru', 'uz', 'en'].map((l) => (
              <button key={l} className={'btn-ghost' + (l === lang ? ' is-on' : '')}
                onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          onAnswer={(data) => setAnswers((prev) => { const next = [...prev]; next[current] = data; return next; })}
          onNext={() => setCurrent((v) => Math.min(v + 1, TOTAL_SCREENS - 1))}
          onPrev={() => setCurrent((v) => Math.max(v - 1, 0))}
          onReset={() => { setAnswers([]); setCurrent(0); }}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
