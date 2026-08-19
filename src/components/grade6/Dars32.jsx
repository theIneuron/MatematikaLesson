// ============================================================
// 6 КЛАСС, УРОК 32 «Раскрытие скобок»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б8, третий урок. Распределительный закон не объявляется, а
// получается из двух честных способов посчитать одну и ту же покупку.
// Минус перед скобкой сводится к множителю −1 и правилу знаков урока 29.
//
// Сцена — киоск канцтоваров у школы, наборы к учебному году.
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
  FB_SCI,
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
  lessonId: 'grade6-32',
  lessonTitle: {
    ru: 'Раскрытие скобок',
    uz: 'Qavslarni ochish',
    en: 'Opening brackets',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 kiosk: ikki xil hisob
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 harfli ifoda esga tushadi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 taqsimot qonuni to'g'ri burchakda
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: har bir qo'shiluvchiga
  { id: 's_minus',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 qavs oldidagi minus
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: manfiy ko'paytuvchi
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: HAR BIR had o'zgaradi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_plus',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 musbat ko'paytuvchi x3
  { id: 's_neg',    type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 minus va manfiy ko'paytuvchi x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ishoralar o'zgaradimi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: to'plamlar
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Наборы к школе', uz: "Maktabga to'plamlar", en: 'Back to school sets' },
    lead: {
      ru: 'В наборе тетрадь за 3000 и ручка за 2000. Класс берёт 4 набора.',
      uz: "To'plamda 3000 lik daftar va 2000 lik ruchka bor. Sinf 4 ta to'plam oladi.",
      en: 'A set holds a 3000 notebook and a 2000 pen. The class takes 4 sets.',
    },
    voice_a: { ru: 'Камола считает: 4 · (3000 + 2000)', uz: 'Kamola hisoblaydi: 4 · (3000 + 2000)', en: 'Kamola counts: 4 · (3000 + 2000)' },
    voice_b: { ru: 'Тимур считает: 4 · 3000 + 4 · 2000', uz: 'Timur hisoblaydi: 4 · 3000 + 4 · 2000', en: 'Timur counts: 4 · 3000 + 4 · 2000' },
    ask: { ru: 'Кто посчитал стоимость верно?', uz: "Kim narxni to'g'ri hisobladi?", en: 'Who counted the cost correctly?' },
    options: [
      { ru: 'только Камола', uz: 'faqat Kamola', en: 'only Kamola' },
      { ru: 'оба', uz: 'ikkalasi ham', en: 'both of them' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'У школы работает киоск канцтоваров. В наборе тетрадь за три тысячи и ручка за две тысячи, класс берёт четыре набора.',
          'Камола считает четыре умножить на сумму трёх и двух тысяч. Тимур считает по-другому: четыре тетради и отдельно четыре ручки. Кто посчитал стоимость верно? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab yonida kanselyariya kioski ishlaydi. To'plamda uch minglik daftar va ikki minglik ruchka bor, sinf to'rtta to'plam oladi.",
          "Kamola to'rtni uch va ikki ming yig'indisiga ko'paytiradi. Timur boshqacha hisoblaydi: to'rtta daftar va alohida to'rtta ruchka. Kim narxni to'g'ri hisobladi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A stationery kiosk works by the school. A set holds a three thousand notebook and a two thousand pen, and the class takes four sets.',
          'Kamola multiplies four by the sum of three and two thousand. Timur counts differently: four notebooks and four pens separately. Who counted the cost correctly? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Буква вместо цены', uz: "Narx o'rniga harf", en: 'A letter instead of a price' },
    done: {
      ru: 'Цена набора это a + b. Четыре набора записывают как 4(a + b): скобка показывает, что умножается вся сумма.',
      uz: "To'plam narxi a + b. To'rtta to'plam 4(a + b) deb yoziladi: qavs butun yig'indi ko'paytirilishini ko'rsatadi.",
      en: 'A set costs a + b. Four sets are written 4(a + b): the bracket shows the whole sum is multiplied.',
    },
    audio: {
      ru: [
        'Вспомним прошлый урок. Цену тетради обозначим буквой а, цену ручки буквой бэ. Тогда набор стоит а плюс бэ.',
        'Четыре набора это четыре умножить на всю сумму. Пишут так: четыре, скобка, а плюс бэ.',
        'Скобка здесь не украшение. Она показывает, что множитель относится ко всей сумме, а не к одному слагаемому.',
      ],
      uz: [
        "O'tgan darsni eslaymiz. Daftar narxini a harfi bilan, ruchka narxini b harfi bilan belgilaymiz. Unda to'plam a qo'shuv b turadi.",
        "To'rtta to'plam bu to'rtni butun yig'indiga ko'paytirish. Shunday yoziladi: to'rt, qavs, a qo'shuv b.",
        "Qavs bu yerda bezak emas. U ko'paytuvchi bitta qo'shiluvchiga emas, butun yig'indiga tegishli ekanini ko'rsatadi.",
      ],
      en: [
        'Recall the last lesson. Let the notebook price be a and the pen price b. Then a set costs a plus b.',
        'Four sets is four times the whole sum, written four, bracket, a plus b.',
        'The bracket is not decoration. It shows the factor applies to the whole sum, not to one term.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Два честных способа', uz: "Ikkita halol yo'l", en: 'Two honest ways' },
    lines: [
      { ru: 'по наборам: 4 · (3000 + 2000) = 4 · 5000 = 20 000', uz: "to'plamlar bo'yicha: 4 · (3000 + 2000) = 4 · 5000 = 20 000", en: 'by sets: 4 · (3000 + 2000) = 4 · 5000 = 20 000' },
      { ru: 'по товарам: 4 · 3000 + 4 · 2000 = 12 000 + 8000 = 20 000', uz: "mahsulotlar bo'yicha: 4 · 3000 + 4 · 2000 = 12 000 + 8000 = 20 000", en: 'by items: 4 · 3000 + 4 · 2000 = 12 000 + 8000 = 20 000' },
      { ru: 'значит 4(a + b) = 4a + 4b', uz: 'demak 4(a + b) = 4a + 4b', en: 'so 4(a + b) = 4a + 4b' },
    ],
    done: {
      ru: 'Прямоугольник можно посчитать целиком, а можно по двум частям — площадь одна. Оба способа верны, права была и Камола, и Тимур.',
      uz: "To'g'ri to'rtburchakni butunicha ham, ikki qismi bo'yicha ham hisoblash mumkin — yuza bitta. Ikkala yo'l ham to'g'ri, Kamola ham, Timur ham haq edi.",
      en: 'A rectangle can be counted whole or in two parts, and the area is the same. Both ways are right: Kamola and Timur both were.',
    },
    audio: {
      ru: [
        'Считаем первым способом. Один набор стоит пять тысяч, четыре набора двадцать тысяч.',
        'Считаем вторым. Четыре тетради двенадцать тысяч, четыре ручки восемь тысяч, вместе снова двадцать тысяч.',
        'Посмотрите на прямоугольник. Его можно посчитать целиком, а можно разрезать на две части и сложить площади. Ответ один и тот же. Значит четыре умножить на сумму равно четыре а плюс четыре бэ. Правы были оба.',
      ],
      uz: [
        "Birinchi yo'l bilan hisoblaymiz. Bitta to'plam besh ming, to'rtta to'plam yigirma ming turadi.",
        "Ikkinchi yo'l bilan hisoblaymiz. To'rtta daftar o'n ikki ming, to'rtta ruchka sakkiz ming, birga yana yigirma ming.",
        "To'g'ri to'rtburchakka qarang. Uni butunicha hisoblash ham, ikki qismga kesib yuzalarni qo'shish ham mumkin. Javob bir xil. Demak to'rtni yig'indiga ko'paytirish to'rt a qo'shuv to'rt b ga teng. Ikkalasi ham haq edi.",
      ],
      en: [
        'Count the first way. One set costs five thousand, four sets twenty thousand.',
        'Count the second way. Four notebooks are twelve thousand, four pens eight thousand, together twenty thousand again.',
        'Look at the rectangle. You can count it whole or cut it in two and add the areas. The answer is the same. So four times the sum equals four a plus four b. Both were right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Множитель идёт к каждому', uz: "Ko'paytuvchi har biriga boradi", en: 'The factor reaches every term' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: '3(x + 4): множитель 3, в скобке два слагаемых', uz: "3(x + 4): ko'paytuvchi 3, qavsda ikki qo'shiluvchi", en: '3(x + 4): the factor is 3 and the bracket holds two terms' },
      { ru: '3 · x = 3x', uz: '3 · x = 3x', en: '3 · x = 3x' },
      { ru: '3 · 4 = 12, значит 3x + 12', uz: '3 · 4 = 12, demak 3x + 12', en: '3 · 4 = 12, so 3x + 12' },
    ],
    demo_note: {
      ru: 'Множитель умножается на каждое слагаемое скобки, ни одно не пропускают.',
      uz: "Ko'paytuvchi qavsdagi har bir qo'shiluvchiga ko'payadi, birortasi ham tashlab ketilmaydi.",
      en: 'The factor multiplies every term in the bracket; none is skipped.',
    },
    play_ask: { ru: 'Раскрой скобки: 5(a + 2)', uz: 'Qavslarni oching: 5(a + 2)', en: 'Open the brackets: 5(a + 2)' },
    play_opts: ['5a + 10', '5a + 2', 'a + 10'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 5 · a = 5a и 5 · 2 = 10.',
      uz: "To'g'ri. 5 · a = 5a va 5 · 2 = 10.",
      en: 'Right. 5 · a = 5a and 5 · 2 = 10.',
    },
    play_wrong: [
      null,
      { ru: 'Двойку тоже нужно умножить на 5.', uz: "Ikkini ham 5 ga ko'paytirish kerak.", en: 'The two must be multiplied by 5 as well.' },
      { ru: 'Букву тоже нужно умножить на 5.', uz: "Harfni ham 5 ga ko'paytirish kerak.", en: 'The letter must be multiplied by 5 as well.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу приём на примере три, скобка, икс плюс четыре.',
        uz: "Usulni uch, qavs, iks qo'shuv to'rt misolida ko'rsataman.",
        en: 'I will show the move on three, bracket, x plus four.',
      },
      demo: {
        ru: 'Множитель три идёт к каждому слагаемому скобки. Сначала три умножить на икс, это три икс. Потом три умножить на четыре, это двенадцать. Получилось три икс плюс двенадцать.',
        uz: "Uch ko'paytuvchi qavsdagi har bir qo'shiluvchiga boradi. Avval uch karra iks, bu uch iks. Keyin uch karra to'rt, bu o'n ikki. Uch iks qo'shuv o'n ikki chiqdi.",
        en: 'The factor three reaches every term in the bracket. First three times x is three x. Then three times four is twelve. That gives three x plus twelve.',
      },
      play: {
        ru: 'Теперь ваша очередь. Раскройте скобки: пять, скобка, а плюс два.',
        uz: "Endi sizning navbatingiz. Qavslarni oching: besh, qavs, a qo'shuv ikki.",
        en: 'Now it is your turn. Open the brackets: five, bracket, a plus two.',
      },
      ok: {
        ru: 'Верно. Пятёрка ушла и к букве, и к двойке.',
        uz: "To'g'ri. Besh ham harfga, ham ikkiga bordi.",
        en: 'Right. The five went to both the letter and the two.',
      },
      wrong: {
        ru: 'Множитель обязан достаться каждому слагаемому скобки.',
        uz: "Ko'paytuvchi qavsdagi har bir qo'shiluvchiga tegishi shart.",
        en: 'The factor must reach every term inside the bracket.',
      },
    },
  },

  s_minus: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Минус перед скобкой', uz: 'Qavs oldidagi minus', en: 'A minus before the bracket' },
    lines: [
      { ru: '−(a − 5) — это −1 · (a − 5)', uz: '−(a − 5) — bu −1 · (a − 5)', en: '−(a − 5) means −1 · (a − 5)' },
      { ru: '−1 · a = −a', uz: '−1 · a = −a', en: '−1 · a = −a' },
      { ru: '−1 · (−5) = 5, значит −a + 5', uz: '−1 · (−5) = 5, demak −a + 5', en: '−1 · (−5) = 5, so −a + 5' },
    ],
    done: {
      ru: 'Минус перед скобкой — это множитель −1, поэтому знак меняется у каждого слагаемого. Плюс перед скобкой ничего не меняет.',
      uz: "Qavs oldidagi minus bu −1 ko'paytuvchi, shuning uchun har bir qo'shiluvchining ishorasi o'zgaradi. Qavs oldidagi plyus hech nimani o'zgartirmaydi.",
      en: 'A minus before a bracket is the factor −1, so every term flips its sign. A plus before a bracket changes nothing.',
    },
    audio: {
      ru: [
        'Теперь трудный случай: перед скобкой стоит минус, а множителя как будто нет.',
        'На самом деле он есть, и это минус единица. Умножаем каждое слагаемое: минус один на а даёт минус а, минус один на минус пять даёт плюс пять.',
        'Получилось минус а плюс пять. Знак поменялся у обоих слагаемых. А если перед скобкой плюс, множитель равен единице, и ничего не меняется.',
      ],
      uz: [
        "Endi qiyin hol: qavs oldida minus turibdi, ko'paytuvchi esa yo'qdek.",
        "Aslida u bor va bu minus bir. Har bir qo'shiluvchini ko'paytiramiz: minus bir karra a minus a beradi, minus bir karra minus besh plyus besh beradi.",
        "Minus a qo'shuv besh chiqdi. Ikkala qo'shiluvchining ham ishorasi o'zgardi. Qavs oldida plyus bo'lsa, ko'paytuvchi birga teng va hech nima o'zgarmaydi.",
      ],
      en: [
        'Now the hard case: a minus stands before the bracket and there seems to be no factor.',
        'There is one, and it is minus one. Multiply each term: minus one times a is minus a, minus one times minus five is plus five.',
        'That gives minus a plus five. Both terms flipped. And if the bracket has a plus before it, the factor is one and nothing changes.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Отрицательный множитель', uz: "Manfiy ko'paytuvchi", en: 'A negative factor' },
    lead: { ru: 'Раскроем скобки: −3(2y − 5).', uz: "Qavslarni ochamiz: −3(2y − 5).", en: 'Open the brackets: −3(2y − 5).' },
    steps: [
      { ru: '−3 · 2y = −6y', uz: '−3 · 2y = −6y', en: '−3 · 2y = −6y' },
      { ru: '−3 · (−5) = 15', uz: '−3 · (−5) = 15', en: '−3 · (−5) = 15' },
      { ru: 'ответ: −6y + 15', uz: 'javob: −6y + 15', en: 'answer: −6y + 15' },
    ],
    done: {
      ru: 'Знак каждого слагаемого решает правило знаков из урока 29. Проверить можно подстановкой: при y = 1 оба выражения дают 9.',
      uz: "Har bir qo'shiluvchining ishorasini 29-darsdagi ishoralar qoidasi hal qiladi. Qo'yib tekshirsa bo'ladi: y = 1 da ikkala ifoda ham 9 beradi.",
      en: 'The sign of each term comes from the rule of lesson 29. Check by substituting: at y = 1 both expressions give 9.',
    },
    audio: {
      ru: [
        'Решаем вместе. Раскроем скобки в записи минус три, скобка, два игрек минус пять.',
        'Первое слагаемое: минус три умножить на два игрек. Модули три и два дают шесть, знаки разные, значит минус шесть игрек.',
        'Второе: минус три умножить на минус пять. Знаки одинаковые, значит плюс пятнадцать. Ответ минус шесть игрек плюс пятнадцать. Проверим подстановкой: при игрек равном единице исходное даёт девять и ответ тоже девять.',
      ],
      uz: [
        "Birga yechamiz. Minus uch, qavs, ikki igrek minus besh yozuvidagi qavslarni ochamiz.",
        "Birinchi qo'shiluvchi: minus uch karra ikki igrek. Uch va ikki modullari oltini beradi, ishoralar har xil, demak minus olti igrek.",
        "Ikkinchisi: minus uch karra minus besh. Ishoralar bir xil, demak plyus o'n besh. Javob minus olti igrek qo'shuv o'n besh. Qo'yib tekshiramiz: igrek birga teng bo'lganda dastlabkisi ham, javob ham to'qqiz beradi.",
      ],
      en: [
        'Let us solve it together. Open the brackets in minus three, bracket, two y minus five.',
        'First term: minus three times two y. The absolute values three and two give six, the signs differ, so minus six y.',
        'Second: minus three times minus five. Equal signs, so plus fifteen. The answer is minus six y plus fifteen. Check by substituting: at y equal to one the original gives nine and so does the answer.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Никого не пропускаем', uz: 'Hech kimni tashlab ketmaymiz', en: 'Nobody gets skipped' },
    bad_line: { ru: 'ошибка: −(a − 5) = −a − 5', uz: 'xato: −(a − 5) = −a − 5', en: 'mistake: −(a − 5) = −a − 5' },
    good_line: { ru: 'верно: −(a − 5) = −a + 5', uz: "to'g'ri: −(a − 5) = −a + 5", en: 'right: −(a − 5) = −a + 5' },
    warn_line: { ru: 'ошибка: 2(x + 3) = 2x + 3, тройку забыли', uz: 'xato: 2(x + 3) = 2x + 3, uch unutilgan', en: 'mistake: 2(x + 3) = 2x + 3, the three was forgotten' },
    done: {
      ru: 'Множитель достаётся каждому слагаемому, и знак меняется у каждого. Проверка простая: подставь любое число в обе записи.',
      uz: "Ko'paytuvchi har bir qo'shiluvchiga tegadi, ishora ham har birida o'zgaradi. Tekshiruv oddiy: ikkala yozuvga istalgan sonni qo'ying.",
      en: 'The factor reaches every term and every sign flips. The check is simple: substitute any number into both lines.',
    },
    audio: {
      ru: [
        'Две самые частые ошибки урока. Первая: минус меняет знак только у первого слагаемого, а второе оставляют как было.',
        'Проверим подстановкой. При а равном единице исходное даёт четыре, а неверная запись минус шесть. Верно будет минус а плюс пять.',
        'Вторая ошибка: множитель умножили только на букву, а число в скобке забыли. Множитель обязан достаться каждому слагаемому.',
      ],
      uz: [
        "Darsning eng ko'p uchraydigan ikki xatosi. Birinchisi: minus faqat birinchi qo'shiluvchining ishorasini o'zgartiradi, ikkinchisi esa o'sha holicha qoldiriladi.",
        "Qo'yib tekshiramiz. a birga teng bo'lganda dastlabkisi to'rt, noto'g'ri yozuv esa minus olti beradi. To'g'risi minus a qo'shuv besh bo'ladi.",
        "Ikkinchi xato: ko'paytuvchi faqat harfga ko'paytirilgan, qavsdagi son unutilgan. Ko'paytuvchi har bir qo'shiluvchiga tegishi shart.",
      ],
      en: [
        'The two most common mistakes here. First: the minus flips only the first term and the second is left as it was.',
        'Check by substituting. At a equal to one the original gives four while the wrong line gives minus six. The right answer is minus a plus five.',
        'Second mistake: the factor was applied only to the letter and the number inside the bracket was forgotten. The factor must reach every term.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как раскрывают скобки', uz: 'Qavslar qanday ochiladi', en: 'How brackets are opened' },
    rule_1: {
      ru: 'Множитель перед скобкой умножается на каждое слагаемое: k(a + b) = ka + kb. Знак каждого произведения находят по правилу знаков.',
      uz: "Qavs oldidagi ko'paytuvchi har bir qo'shiluvchiga ko'payadi: k(a + b) = ka + kb. Har bir ko'paytmaning ishorasi ishoralar qoidasi bilan topiladi.",
      en: 'The factor before the bracket multiplies every term: k(a + b) = ka + kb. Each sign follows the sign rule.',
    },
    rule_2: {
      ru: 'Плюс перед скобкой знаки сохраняет, минус меняет у всех слагаемых. Киоск: 4(3000 + 2000) = 4 · 3000 + 4 · 2000, правы были оба.',
      uz: "Qavs oldidagi plyus ishoralarni saqlaydi, minus esa barcha qo'shiluvchilarda o'zgartiradi. Kiosk: 4(3000 + 2000) = 4 · 3000 + 4 · 2000, ikkalasi ham haq edi.",
      en: 'A plus before the bracket keeps the signs, a minus flips them all. The kiosk: 4(3000 + 2000) = 4 · 3000 + 4 · 2000, so both were right.',
    },
    audio: {
      ru: 'Запомним правило. Множитель перед скобкой умножается на каждое слагаемое, и знак каждого произведения находят по правилу знаков. Плюс перед скобкой знаки сохраняет, а минус меняет их у всех слагаемых, потому что это множитель минус единица. Вернёмся к киоску. Четыре набора можно посчитать и по наборам, и по товарам: ответ двадцать тысяч. Правы были оба.',
      uz: "Qoidani eslab qolamiz. Qavs oldidagi ko'paytuvchi har bir qo'shiluvchiga ko'payadi, har bir ko'paytmaning ishorasi esa ishoralar qoidasi bilan topiladi. Qavs oldidagi plyus ishoralarni saqlaydi, minus esa barchasini o'zgartiradi, chunki bu minus bir ko'paytuvchi. Kioskga qaytamiz. To'rtta to'plamni to'plamlar bo'yicha ham, mahsulotlar bo'yicha ham hisoblash mumkin: javob yigirma ming. Ikkalasi ham haq edi.",
      en: 'Let us remember the rule. The factor before the bracket multiplies every term, and each sign follows the sign rule. A plus before the bracket keeps the signs, a minus flips them all, because it is the factor minus one. Back to the kiosk. Four sets can be counted by sets or by items: the answer is twenty thousand. Both were right.',
    },
  },

  s_plus: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Скобки с плюсом', uz: 'Plyusli qavslar', en: 'Brackets with a plus' },
    lead: { ru: 'Умножай на каждое слагаемое.', uz: "Har bir qo'shiluvchiga ko'paytiring.", en: 'Multiply every term.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Раскрой скобки: 4(x + 3)', uz: 'Qavslarni oching: 4(x + 3)', en: 'Open the brackets: 4(x + 3)' },
        opts: ['4x + 12', '4x + 3', 'x + 12'],
        correct: 0,
        ok: { ru: 'Верно. 4 · x = 4x и 4 · 3 = 12.', uz: "To'g'ri. 4 · x = 4x va 4 · 3 = 12.", en: 'Right. 4 · x = 4x and 4 · 3 = 12.' },
        wrong: [
          null,
          { ru: 'Тройку тоже умножают на 4.', uz: "Uchni ham 4 ga ko'paytiriladi.", en: 'The three is multiplied by 4 too.' },
          { ru: 'Букву тоже умножают на 4.', uz: "Harfni ham 4 ga ko'paytiriladi.", en: 'The letter is multiplied by 4 too.' },
        ],
      },
      {
        q: { ru: 'Раскрой скобки: 6(a − 2)', uz: 'Qavslarni oching: 6(a − 2)', en: 'Open the brackets: 6(a − 2)' },
        opts: ['6a − 12', '6a − 2', '6a + 12'],
        correct: 0,
        ok: { ru: 'Верно. 6 · a = 6a и 6 · (−2) = −12.', uz: "To'g'ri. 6 · a = 6a va 6 · (−2) = −12.", en: 'Right. 6 · a = 6a and 6 · (−2) = −12.' },
        wrong: [
          null,
          { ru: 'Двойку тоже умножают на 6.', uz: "Ikkini ham 6 ga ko'paytiriladi.", en: 'The two is multiplied by 6 too.' },
          { ru: 'Знаки множителей разные, значит минус.', uz: "Ko'paytuvchilar ishorasi har xil, demak minus.", en: 'The signs differ, so minus.' },
        ],
      },
      {
        q: { ru: 'Раскрой скобки: 2(3y + 5)', uz: 'Qavslarni oching: 2(3y + 5)', en: 'Open the brackets: 2(3y + 5)' },
        opts: ['6y + 10', '3y + 10', '6y + 5'],
        correct: 0,
        ok: { ru: 'Верно. 2 · 3y = 6y и 2 · 5 = 10.', uz: "To'g'ri. 2 · 3y = 6y va 2 · 5 = 10.", en: 'Right. 2 · 3y = 6y and 2 · 5 = 10.' },
        wrong: [
          null,
          { ru: 'Коэффициент 3 тоже умножают на 2.', uz: "3 koeffitsiyent ham 2 ga ko'payadi.", en: 'The coefficient 3 is multiplied by 2 too.' },
          { ru: 'Пятёрку тоже умножают на 2.', uz: "Beshni ham 2 ga ko'paytiriladi.", en: 'The five is multiplied by 2 too.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на скобки с положительным множителем. Не пропускайте ни одного слагаемого.',
        uz: "Musbat ko'paytuvchili qavslar mashqi. Birorta qo'shiluvchini tashlab ketmang.",
        en: 'Practice with a positive factor. Do not skip a single term.',
      },
    },
  },

  s_neg: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Минус перед скобкой', uz: 'Qavs oldidagi minus', en: 'A minus before the bracket' },
    lead: { ru: 'Помни: минус — это множитель −1.', uz: "Yodda tuting: minus bu −1 ko'paytuvchi.", en: 'Remember: a minus is the factor −1.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Раскрой скобки: −(x + 7)', uz: 'Qavslarni oching: −(x + 7)', en: 'Open the brackets: −(x + 7)' },
        opts: ['−x − 7', '−x + 7', 'x − 7'],
        correct: 0,
        ok: { ru: 'Верно. Знак поменялся у обоих слагаемых.', uz: "To'g'ri. Ikkala qo'shiluvchining ham ishorasi o'zgardi.", en: 'Right. Both terms flipped their sign.' },
        wrong: [
          null,
          { ru: 'Семёрка была положительной, значит станет отрицательной.', uz: "Yetti musbat edi, demak manfiy bo'ladi.", en: 'The seven was positive, so it becomes negative.' },
          { ru: 'Первое слагаемое тоже меняет знак.', uz: "Birinchi qo'shiluvchi ham ishorasini o'zgartiradi.", en: 'The first term flips too.' },
        ],
      },
      {
        q: { ru: 'Раскрой скобки: −(b − 4)', uz: 'Qavslarni oching: −(b − 4)', en: 'Open the brackets: −(b − 4)' },
        opts: ['−b + 4', '−b − 4', 'b + 4'],
        correct: 0,
        ok: { ru: 'Верно. Минус на минус дал плюс.', uz: "To'g'ri. Minus minusga plyus berdi.", en: 'Right. Minus times minus gave a plus.' },
        wrong: [
          null,
          { ru: 'Четвёрка была отрицательной, значит станет положительной.', uz: "To'rt manfiy edi, demak musbat bo'ladi.", en: 'The four was negative, so it becomes positive.' },
          { ru: 'Первое слагаемое тоже меняет знак.', uz: "Birinchi qo'shiluvchi ham ishorasini o'zgartiradi.", en: 'The first term flips too.' },
        ],
      },
      {
        q: { ru: 'Раскрой скобки: −2(m + 3)', uz: 'Qavslarni oching: −2(m + 3)', en: 'Open the brackets: −2(m + 3)' },
        opts: ['−2m − 6', '−2m + 6', '2m − 6'],
        correct: 0,
        ok: { ru: 'Верно. Оба произведения отрицательные.', uz: "To'g'ri. Ikkala ko'paytma ham manfiy.", en: 'Right. Both products are negative.' },
        wrong: [
          null,
          { ru: 'Тройка положительная, а множитель отрицательный: будет минус.', uz: "Uch musbat, ko'paytuvchi esa manfiy: minus bo'ladi.", en: 'The three is positive and the factor negative: minus.' },
          { ru: 'Множитель отрицательный, первое слагаемое тоже.', uz: "Ko'paytuvchi manfiy, birinchi qo'shiluvchi ham shunday.", en: 'The factor is negative, so is the first term.' },
        ],
      },
      {
        q: { ru: 'Что делает плюс перед скобкой?', uz: 'Qavs oldidagi plyus nima qiladi?', en: 'What does a plus before a bracket do?' },
        opts: [
          { ru: 'ничего не меняет', uz: "hech nimani o'zgartirmaydi", en: 'changes nothing' },
          { ru: 'меняет знаки', uz: "ishoralarni o'zgartiradi", en: 'flips the signs' },
          { ru: 'убирает первое слагаемое', uz: "birinchi qo'shiluvchini olib tashlaydi", en: 'removes the first term' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Это множитель 1.', uz: "To'g'ri. Bu 1 ko'paytuvchi.", en: 'Right. It is the factor 1.' },
        wrong: [
          null,
          { ru: 'Знаки меняет минус, а не плюс.', uz: "Ishoralarni minus o'zgartiradi, plyus emas.", en: 'The minus flips signs, not the plus.' },
          { ru: 'Слагаемые никуда не деваются.', uz: "Qo'shiluvchilar hech qayerga ketmaydi.", en: 'No term disappears.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на минус перед скобкой. Помните про множитель минус единица.',
        uz: "Qavs oldidagi minus mashqi. Minus bir ko'paytuvchini yodda tuting.",
        en: 'Practice with a minus before the bracket. Remember the factor minus one.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Поменяются ли знаки', uz: "Ishoralar o'zgaradimi", en: 'Will the signs flip' },
    lead: { ru: 'Смотри только на множитель перед скобкой.', uz: "Faqat qavs oldidagi ko'paytuvchiga qarang.", en: 'Look only at the factor before the bracket.' },
    bin_a: { ru: 'Знаки меняются', uz: "Ishoralar o'zgaradi", en: 'The signs flip' },
    bin_b: { ru: 'Знаки сохраняются', uz: 'Ishoralar saqlanadi', en: 'The signs stay' },
    cards: [
      { label: '−(x + 2)', bin: 'a' },
      { label: '−3(y − 1)', bin: 'a' },
      { label: '−5(a + 4)', bin: 'a' },
      { label: '2(x + 6)', bin: 'b' },
      { label: '7(b − 3)', bin: 'b' },
      { label: '+(m − 8)', bin: 'b' },
    ],
    hint: {
      ru: 'Знаки меняет только отрицательный множитель.',
      uz: "Ishoralarni faqat manfiy ko'paytuvchi o'zgartiradi.",
      en: 'Only a negative factor flips the signs.',
    },
    correct_text: {
      ru: 'Верно. Всё решает знак множителя перед скобкой.',
      uz: "To'g'ri. Hammasini qavs oldidagi ko'paytuvchi ishorasi hal qiladi.",
      en: 'Right. The sign of the factor decides everything.',
    },
    audio: {
      intro: {
        ru: 'Разложите записи по двум корзинам. Считать не нужно, смотрите на множитель.',
        uz: "Yozuvlarni ikki savatga ajrating. Hisoblash shart emas, ko'paytuvchiga qarang.",
        en: 'Sort the lines into two baskets. No computing, just look at the factor.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри на знак множителя.', uz: "Bu yerga emas. Ko'paytuvchi ishorasiga qarang.", en: 'Not here. Look at the sign of the factor.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Камола: «3(x + 5) = 3x + 5». Проверь.', uz: "Kamola: «3(x + 5) = 3x + 5». Tekshiring.", en: 'Kamola: “3(x + 5) = 3x + 5.” Check it.' },
        opts: [
          { ru: 'Нет: пятёрку тоже умножают, будет 3x + 15', uz: "Yo'q: beshni ham ko'paytiriladi, 3x + 15 bo'ladi", en: 'No: the five is multiplied too, it is 3x + 15' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 3x − 15', uz: "Yo'q, 3x − 15 bo'ladi", en: 'No, it is 3x − 15' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Множитель достаётся каждому слагаемому.', uz: "To'g'ri. Ko'paytuvchi har bir qo'shiluvchiga tegadi.", en: 'Right. The factor reaches every term.' },
        wrong: [
          null,
          { ru: 'Подставь x = 1: слева 18, справа 8.', uz: "x = 1 ni qo'ying: chapda 18, o'ngda 8.", en: 'Substitute x = 1: 18 on the left, 8 on the right.' },
          { ru: 'Оба множителя положительные, минусу взяться неоткуда.', uz: "Ikkala ko'paytuvchi ham musbat, minus qayerdan kelsin.", en: 'Both factors are positive, there is no source for a minus.' },
        ],
      },
      {
        q: { ru: 'Тимур: «−(y − 6) = −y − 6». Проверь.', uz: "Timur: «−(y − 6) = −y − 6». Tekshiring.", en: 'Timur: “−(y − 6) = −y − 6.” Check it.' },
        opts: [
          { ru: 'Нет: будет −y + 6', uz: "Yo'q: −y + 6 bo'ladi", en: 'No: it is −y + 6' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет y − 6', uz: "Yo'q, y − 6 bo'ladi", en: 'No, it is y − 6' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Минус на минус даёт плюс.', uz: "To'g'ri. Minus minusga plyus beradi.", en: 'Right. Minus times minus gives a plus.' },
        wrong: [
          null,
          { ru: 'Подставь y = 0: слева 6, справа −6.', uz: "y = 0 ni qo'ying: chapda 6, o'ngda −6.", en: 'Substitute y = 0: 6 on the left, −6 on the right.' },
          { ru: 'Первое слагаемое тоже меняет знак.', uz: "Birinchi qo'shiluvchi ham ishorasini o'zgartiradi.", en: 'The first term flips too.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Подстановка числа показывает ошибку сразу.',
        uz: "Birovning yechimini tekshiring. Son qo'yish xatoni darrov ko'rsatadi.",
        en: 'Check someone else’s work. Substituting a number shows the mistake at once.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Наборы для класса', uz: "Sinf uchun to'plamlar", en: 'Sets for the class' },
    lead: { ru: 'Тетрадь 3000, ручка 2000, набор из одной тетради и одной ручки.', uz: "Daftar 3000, ruchka 2000, to'plamda bittadan daftar va ruchka.", en: 'Notebook 3000, pen 2000, a set holds one of each.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько стоят 7 наборов?', uz: "7 ta to'plam qancha turadi?", en: 'What do 7 sets cost?' },
        opts: [
          { ru: '35 000 сум', uz: "35 000 so'm", en: '35 000 soums' },
          { ru: '21 000 сум', uz: "21 000 so'm", en: '21 000 soums' },
          { ru: '5007 сум', uz: "5007 so'm", en: '5007 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 7(3000 + 2000) = 7 · 5000 = 35 000.', uz: "To'g'ri. 7(3000 + 2000) = 7 · 5000 = 35 000.", en: 'Right. 7(3000 + 2000) = 7 · 5000 = 35 000.' },
        wrong: [
          null,
          { ru: 'Посчитали только тетради, ручки забыли.', uz: 'Faqat daftarlar hisoblangan, ruchkalar unutilgan.', en: 'Only the notebooks were counted, the pens forgotten.' },
          { ru: 'Число наборов прибавили, а нужно умножить.', uz: "To'plamlar soni qo'shilgan, ko'paytirish kerak esa.", en: 'The number of sets was added instead of multiplied.' },
        ],
      },
      {
        q: { ru: 'Ручка подорожала на 500 сум. Сколько теперь стоят 7 наборов?', uz: "Ruchka 500 so'mga qimmatlashdi. Endi 7 ta to'plam qancha turadi?", en: 'The pen went up by 500. What do 7 sets cost now?' },
        opts: [
          { ru: '38 500 сум', uz: "38 500 so'm", en: '38 500 soums' },
          { ru: '35 500 сум', uz: "35 500 so'm", en: '35 500 soums' },
          { ru: '40 000 сум', uz: "40 000 so'm", en: '40 000 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Прибавка идёт к каждому набору: 7 · 500 = 3500.', uz: "To'g'ri. Qo'shimcha har bir to'plamga tegadi: 7 · 500 = 3500.", en: 'Right. The rise applies to every set: 7 · 500 = 3500.' },
        wrong: [
          null,
          { ru: 'Прибавку посчитали один раз, а наборов семь.', uz: "Qo'shimcha bir marta hisoblangan, to'plamlar esa yettita.", en: 'The rise was counted once, but there are seven sets.' },
          { ru: 'Столько вышло бы при подорожании на 714 сум.', uz: "Bu 714 so'mga qimmatlashganda chiqardi.", en: 'That would need a rise of 714 soums.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про наборы. Тетрадь три тысячи, ручка две тысячи, в наборе по одной штуке.',
        uz: "To'plamlar haqida masala. Daftar uch ming, ruchka ikki ming, to'plamda bittadan.",
        en: 'A problem about sets. The notebook is three thousand, the pen two thousand, one of each per set.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 24,
        q: { ru: 'Найди значение 3(x + 5) при x = 3. Набери ответ.', uz: 'x = 3 da 3(x + 5) qiymatini toping. Javobni tering.', en: 'Find the value of 3(x + 5) at x = 3. Type the answer.' },
        hint: { ru: 'В скобке 8, дальше 3 · 8.', uz: 'Qavsda 8, keyin 3 · 8.', en: 'The bracket is 8, then 3 · 8.' },
        hint_audio: { ru: 'Сначала посчитайте в скобке: три плюс пять восемь. Потом умножьте на три.', uz: "Avval qavs ichida hisoblang: uch qo'shuv besh sakkiz. Keyin uchga ko'paytiring.", en: 'First compute inside the bracket: three plus five is eight. Then multiply by three.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Раскрой скобки: 5(y − 2)', uz: 'Qavslarni oching: 5(y − 2)', en: 'Open the brackets: 5(y − 2)' },
        opts: ['5y − 2', '5y + 10', '5y − 10', 'y − 10'],
        wrong: [
          { ru: 'Двойку тоже умножают на 5.', uz: "Ikkini ham 5 ga ko'paytiriladi.", en: 'The two is multiplied by 5 too.' },
          { ru: 'Знаки множителей разные, значит минус.', uz: "Ko'paytuvchilar ishorasi har xil, demak minus.", en: 'The signs differ, so minus.' },
          null,
          { ru: 'Букву тоже умножают на 5.', uz: "Harfni ham 5 ga ko'paytiriladi.", en: 'The letter is multiplied by 5 too.' },
        ],
        correct: { ru: 'Верно. 5 · y = 5y и 5 · (−2) = −10.', uz: "To'g'ri. 5 · y = 5y va 5 · (−2) = −10.", en: 'Right. 5 · y = 5y and 5 · (−2) = −10.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Раскрой скобки: −(a − 9)', uz: 'Qavslarni oching: −(a − 9)', en: 'Open the brackets: −(a − 9)' },
        opts: ['−a − 9', '−a + 9', 'a − 9', 'a + 9'],
        wrong: [
          { ru: 'Девятка была отрицательной, значит станет положительной.', uz: "To'qqiz manfiy edi, demak musbat bo'ladi.", en: 'The nine was negative, so it becomes positive.' },
          null,
          { ru: 'Первое слагаемое тоже меняет знак.', uz: "Birinchi qo'shiluvchi ham ishorasini o'zgartiradi.", en: 'The first term flips too.' },
          { ru: 'Знак меняется у обоих, а не сохраняется.', uz: "Ishora ikkalasida o'zgaradi, saqlanmaydi.", en: 'Both flip, nothing stays.' },
        ],
        correct: { ru: 'Верно. Множитель −1 меняет знак у каждого слагаемого.', uz: "To'g'ri. −1 ko'paytuvchi har bir qo'shiluvchining ishorasini o'zgartiradi.", en: 'Right. The factor −1 flips every term.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Чему равно −4(b + 2)?', uz: '−4(b + 2) nimaga teng?', en: 'What is −4(b + 2)?' },
        opts: ['4b + 8', '−4b + 8', '−4b + 2', '−4b − 8'],
        wrong: [
          { ru: 'Множитель отрицательный, первое слагаемое тоже.', uz: "Ko'paytuvchi manfiy, birinchi qo'shiluvchi ham shunday.", en: 'The factor is negative, so is the first term.' },
          { ru: 'Двойка положительная, а множитель отрицательный: минус.', uz: "Ikki musbat, ko'paytuvchi manfiy: minus.", en: 'The two is positive and the factor negative: minus.' },
          { ru: 'Двойку тоже умножают на 4.', uz: "Ikkini ham 4 ga ko'paytiriladi.", en: 'The two is multiplied by 4 too.' },
          null,
        ],
        correct: { ru: 'Верно. Оба произведения отрицательные.', uz: "To'g'ri. Ikkala ko'paytma ham manfiy.", en: 'Right. Both products are negative.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Как быстро посчитать 7 · 98 в уме?', uz: '7 · 98 ni xayolan qanday tez hisoblash mumkin?', en: 'How do you compute 7 · 98 quickly in your head?' },
        opts: [
          { ru: '7 · 100 − 7 · 2', uz: '7 · 100 − 7 · 2', en: '7 · 100 − 7 · 2' },
          { ru: '7 · 100 − 2', uz: '7 · 100 − 2', en: '7 · 100 − 2' },
          { ru: '7 · 90 + 8', uz: '7 · 90 + 8', en: '7 · 90 + 8' },
          { ru: '7 + 98', uz: '7 + 98', en: '7 + 98' },
        ],
        wrong: [
          null,
          { ru: 'Двойку тоже нужно умножить на 7.', uz: "Ikkini ham 7 ga ko'paytirish kerak.", en: 'The two must be multiplied by 7 too.' },
          { ru: 'Восьмёрку тоже нужно умножить на 7.', uz: "Sakkizni ham 7 ga ko'paytirish kerak.", en: 'The eight must be multiplied by 7 too.' },
          { ru: 'Это сложение, а нужно произведение.', uz: "Bu qo'shish, ko'paytma kerak esa.", en: 'That is addition, but a product is needed.' },
        ],
        correct: { ru: 'Верно. 98 = 100 − 2, дальше раскрываем скобки: 700 − 14 = 686.', uz: "To'g'ri. 98 = 100 − 2, keyin qavslarni ochamiz: 700 − 14 = 686.", en: 'Right. 98 = 100 − 2, then open the brackets: 700 − 14 = 686.' },
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
      ru: 'Раскрытие скобок вы уже делали много лет, просто не называли это так. Когда столбиком умножают 23 на 4, на самом деле считают 4 · 20 плюс 4 · 3. Тот же закон стоит за устным счётом: 7 · 98 удобно считать как 700 минус 14.',
      uz: "Qavslarni ochishni siz ko'p yillardan beri qilib kelyapsiz, shunchaki bunday atamagansiz. Ustunda 23 ni 4 ga ko'paytirganda aslida 4 · 20 qo'shuv 4 · 3 hisoblanadi. Xuddi shu qonun og'zaki hisobda ham turadi: 7 · 98 ni 700 minus 14 deb hisoblash qulay.",
      en: 'You have been opening brackets for years without calling it that. Multiplying 23 by 4 in a column really computes 4 · 20 plus 4 · 3. The same law powers mental arithmetic: 7 · 98 is easiest as 700 minus 14.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Раскрытие скобок ты уже делал много лет, просто не называл это так. Когда столбиком умножают двадцать три на четыре, на самом деле считают четыре на двадцать плюс четыре на три. Тот же закон стоит за устным счётом: семь на девяносто восемь удобно считать как семьсот минус четырнадцать.',
      uz: "Bilasizmi? Qavslarni ochishni siz ko'p yillardan beri qilib kelyapsiz, shunchaki bunday atamagansiz. Ustunda yigirma uchni to'rtga ko'paytirganda aslida to'rt karra yigirma qo'shuv to'rt karra uch hisoblanadi. Xuddi shu qonun og'zaki hisobda ham turadi: yetti karra to'qson sakkizni yetti yuz minus o'n to'rt deb hisoblash qulay.",
      en: 'Did you know? You have been opening brackets for years without calling it that. Multiplying twenty three by four in a column really computes four times twenty plus four times three. The same law powers mental arithmetic: seven times ninety eight is easiest as seven hundred minus fourteen.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Выражения', uz: 'Matematika · Ifodalar', en: 'Mathematics · Expressions' },
    heading: { ru: 'Раскрытие скобок', uz: 'Qavslarni ochish', en: 'Opening brackets' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'k(a + b) = ka + kb', uz: 'k(a + b) = ka + kb', en: 'k(a + b) = ka + kb' },
    brief_2: { ru: 'множитель идёт к каждому слагаемому', uz: "ko'paytuvchi har bir qo'shiluvchiga boradi", en: 'the factor reaches every term' },
    brief_3: { ru: 'минус перед скобкой — это −1', uz: 'qavs oldidagi minus — bu −1', en: 'a minus before the bracket is −1' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Плюс перед скобкой', uz: 'Qavs oldidagi plyus', en: 'A plus before the bracket' },
    memo_a1: { ru: 'знаки сохраняет', uz: 'ishoralarni saqlaydi', en: 'keeps the signs' },
    memo_q2: { ru: 'Проверка ответа', uz: 'Javobni tekshirish', en: 'Checking the answer' },
    memo_a2: { ru: 'подставить любое число', uz: "istalgan sonni qo'yish", en: 'substitute any number' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'забыть второе слагаемое', uz: "ikkinchi qo'shiluvchini unutish", en: 'forgetting the second term' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Множитель перед скобкой умножается на каждое слагаемое, и знак каждого произведения находят по правилу знаков. Плюс перед скобкой знаки сохраняет, минус меняет их у всех слагаемых, потому что это множитель минус единица.',
        'Киоск: четыре набора можно посчитать двумя способами, ответ один и тот же.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Qavs oldidagi ko'paytuvchi har bir qo'shiluvchiga ko'payadi, har bir ko'paytmaning ishorasi ishoralar qoidasi bilan topiladi. Qavs oldidagi plyus ishoralarni saqlaydi, minus esa barchasini o'zgartiradi, chunki bu minus bir ko'paytuvchi.",
        "Kiosk: to'rtta to'plamni ikki yo'l bilan hisoblash mumkin, javob bir xil.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The factor before the bracket multiplies every term, and each sign follows the sign rule. A plus keeps the signs, a minus flips them all, because it is the factor minus one.',
        'The kiosk: four sets can be counted two ways and the answer is the same.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Каждому по множителю', uz: "Usul. Har biriga ko'paytuvchi", en: 'Method. One factor for each' },
    m1_steps: {
      ru: ['Посмотри на множитель перед скобкой', 'Умножь его на первое слагаемое', 'Умножь на второе и поставь знаки'],
      uz: ["Qavs oldidagi ko'paytuvchiga qarang", "Uni birinchi qo'shiluvchiga ko'paytiring", "Ikkinchisiga ko'paytiring va ishoralarni qo'ying"],
      en: ['Look at the factor before the bracket', 'Multiply it by the first term', 'Multiply by the second and set the signs'],
    },
    m1_no: {
      ru: 'Проверка: подставь в обе записи любое число, значения обязаны совпасть.',
      uz: "Tekshiruv: ikkala yozuvga istalgan sonni qo'ying, qiymatlar mos kelishi shart.",
      en: 'Check: substitute any number into both lines, the values must match.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: киоск канцтоваров у школы.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d32sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d32sky)"/>

    {/* Киоск с полосатым навесом */}
    <rect x="150" y="52" width="196" height="82" rx="5" fill="#E4D9C6" stroke="#C9A472" strokeWidth="2"/>
    <rect x="160" y="66" width="176" height="44" rx="4" fill="#FFFDF7"/>
    <g>
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={144 + i * 30} y="38" width="30" height="14" fill={i % 2 ? '#D9603F' : '#FFFDF7'}/>
      ))}
      <rect x="144" y="36" width="210" height="4" rx="2" fill="#C9A472"/>
    </g>

    {/* Витрина: четыре одинаковых набора */}
    {[0, 1, 2, 3].map((k) => (
      <g key={k} transform={`translate(${172 + k * 42}, 72)`}>
        <rect x="0" y="0" width="30" height="32" rx="3" fill="#F4EEDF" stroke="#C9A472" strokeWidth="1.4"/>
        <rect x="4" y="5" width="14" height="18" rx="2" fill="#7ECBE6"/>
        <rect x="21" y="5" width="4" height="18" rx="2" fill="#D9603F"/>
        <text x="15" y="30" textAnchor="middle" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="6" fontWeight="700">3000+2000</text>
      </g>
    ))}

    {/* Ценник качается на витрине */}
    <g className="d32-tag">
      <rect x="-24" y="-11" width="48" height="22" rx="4" fill="#FBF3D6" stroke="#E4CE93" strokeWidth="1.6"/>
      <text x="0" y="4" textAnchor="middle" fill="#8A6A22"
        fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">4 ta</text>
    </g>

    {/* Продавщица за прилавком и двое учеников */}
    <Person x={362} ground={134} head={12} shirt="#8FBF7F" hair="#5A4636"/>
    <Person x={64} ground={134} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={104} ground={134} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="134" width="400" height="20" fill="#D2A96F"/>
  </svg>
);

// Итог: прямоугольник, посчитанный целиком и по частям.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      <g>
        <rect x="26" y="18" width="96" height="46" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
        <text x="74" y="46" textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">4(a + b)</text>
      </g>
      <text x="146" y="46" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700">=</text>
      <g>
        <rect x="170" y="18" width="86" height="46" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
        <text x="213" y="46" textAnchor="middle" fill="#1F7A4D"
          fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">4a</text>
      </g>
      <text x="272" y="46" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700">+</text>
      <g>
        <rect x="288" y="18" width="86" height="46" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2"/>
        <text x="331" y="46" textAnchor="middle" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">4b</text>
      </g>
      <text x="200" y="84" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'целиком или по частям, площадь одна',
          "butunicha yoki qismlab, yuza bitta",
          'whole or in parts, the area is the same')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: прямоугольник, разрезанный на две части.
const AreaFig = ({ split, aLabel, bLabel, kLabel }) => {
  const h = 62; const y = 20;
  const wa = 96; const wb = 64; const x0 = 60;
  return (
    <span className="d32-area-box">
      <svg viewBox="0 0 260 108" aria-hidden="true">
        <text x={x0 - 12} y={y + h / 2 + 5} textAnchor="end" fill="#D9603F"
          fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">{kLabel}</text>
        <rect x={x0} y={y} width={wa} height={h} fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
        <rect x={x0 + wa} y={y} width={wb} height={h} fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2"/>
        {split && (
          <path d={`M${x0 + wa} ${y - 6} v${h + 12}`} stroke="#D9603F" strokeWidth="2.6" strokeDasharray="5 4"/>
        )}
        <text x={x0 + wa / 2} y={y - 6} textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{aLabel}</text>
        <text x={x0 + wa + wb / 2} y={y - 6} textAnchor="middle" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{bLabel}</text>
        <text x={x0 + wa / 2} y={y + h / 2 + 6} textAnchor="middle" fill="#019ACB"
          fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">{split ? '4a' : ''}</text>
        <text x={x0 + wa + wb / 2} y={y + h / 2 + 6} textAnchor="middle" fill="#8A6A22"
          fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">{split ? '4b' : ''}</text>
        <text x={x0 + (wa + wb) / 2} y={y + h + 18} textAnchor="middle" fill="#8A8883"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">
          {split ? '4a + 4b' : '4(a + b)'}
        </text>
      </svg>
    </span>
  );
};

// Разбор раскрытия: дуги от множителя к каждому слагаемому.
const Open = ({ k, a, b, op, on1, on2, res }) => (
  <span className="d32-open">
    <svg viewBox="0 0 260 62" aria-hidden="true">
      <text x="24" y="46" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">{k}</text>
      <text x="48" y="46" fill="#494550" fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">(</text>
      <text x="76" y="46" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">{a}</text>
      <text x="104" y="46" textAnchor="middle" fill="#8A8883"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">{op}</text>
      <text x="132" y="46" textAnchor="middle" fill="#8A6A22"
        fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">{b}</text>
      <text x="152" y="46" fill="#494550" fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="700">)</text>
      <path className={'d32-arc d32-fade' + (on1 ? ' d32-on' : '')}
        d="M24 26 Q 50 2 76 26" fill="none" stroke="#019ACB" strokeWidth="2" strokeLinecap="round"/>
      <path className={'d32-arc d32-fade' + (on2 ? ' d32-on' : '')}
        d="M24 26 Q 78 -14 132 26" fill="none" stroke="#8A6A22" strokeWidth="2" strokeLinecap="round"/>
      <text x="212" y="46" textAnchor="middle" fill="#1F7A4D"
        className={'d32-fade' + (on2 ? ' d32-on' : '')}
        fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700">{res}</text>
      <text x="174" y="46" fill="#8A8883" className={'d32-fade' + (on2 ? ' d32-on' : '')}
        fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700">=</text>
    </svg>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d32-line d32-fade' + (on ? ' d32-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d32-stage">
        <span className="d32-set">
          <i className="d32-set-a">a</i>
          <b>+</b>
          <i className="d32-set-b">b</i>
        </span>
        <span className={'d32-chips d32-fade' + (step >= 1 ? ' d32-on' : '')}>
          <i className="d32-chip-l">{tri(lang, 'цена набора', "to'plam narxi", 'the set price')}</i>
          <i className="d32-chip-g">4(a + b)</i>
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

// Ядро: прямоугольник целиком и по частям.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d32-stage d32-stage-row">
        <AreaFig split={step >= 1} aLabel="a" bLabel="b" kLabel="4"/>
        <span className="d32-col">
          {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
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

// Минус перед скобкой как множитель −1.
const MinusBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_minus;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d32-stage">
        <Open k="−1" a="a" b="5" op="−" on1={step >= 1} on2={step >= 2} res="−a + 5"/>
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
      <div className="frame fade-up delay-1 d32-stage">
        <Open k="−3" a="2y" b="5" op="−" on1={step >= 0} on2={step >= 1} res="−6y + 15"/>
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

// Граница: пропущенное слагаемое и незамеченный знак.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d32-stage">
        <span className="d32-pair d32-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d32-pair d32-pair-good d32-fade' + (step >= 1 ? ' d32-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d32-pair d32-pair-warn d32-fade' + (step >= 2 ? ' d32-on' : '')}>
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
        <div className={'d32-banner fade-up delay-1' + (phase === 'play' ? ' d32-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d32-stage d32-stage-tool">
          {phase === 'demo' ? (
            <>
              <Open k="3" a="x" b="4" op="+" on1={shown >= 1} on2={shown >= 2} res="3x + 12"/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d32-verdict' + (done ? ' d32-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d32-acts fade-up">
            <button className="d32-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d32-btn d32-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenMinus = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_minus} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <MinusBody step={step}/>}/>
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
      <div className="d32-stage">
        <Open k="4" a="a" b="b" op="+" on1 on2 res="4a + 4b"/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenPlus = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_plus} asideNode={methodAside}/>
);
const ScreenNeg = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_neg} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: тот же прямоугольник, но с ценами.
const TaskFig = ({ idx }) => (
  <div className="d32-task-fig">
    <AreaFig split aLabel={idx >= 1 ? '2500' : '3000'} bLabel={idx >= 1 ? '2500' : '2000'} kLabel="7"/>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={(it, idx) => <TaskFig idx={idx}/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
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
.d32-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d32-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d32-stage-tool .d32-line { font-size: clamp(12px, 2vw, 16px); }
.d32-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 24px); flex-wrap: wrap; }
.d32-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 210px; min-width: 0; }

.d32-fade { opacity: 0; transition: opacity 420ms linear; }
.d32-on { opacity: 1; }
.d32-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Прямоугольник площади */
.d32-area-box { display: block; width: 100%; max-width: 280px; }
.d32-area-box svg { width: 100%; height: auto; display: block; }

/* Разбор раскрытия */
.d32-open { display: block; width: 100%; max-width: 300px; }
.d32-open svg { width: 100%; height: auto; display: block; }

/* Набор */
.d32-set { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); }
.d32-set i { font-style: normal; width: clamp(38px, 7vw, 54px); height: clamp(38px, 7vw, 54px); display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 28px); font-weight: 700; }
.d32-set-a { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d32-set-b { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }
.d32-set b { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); color: #8A8883; }

/* Подписи */
.d32-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d32-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; }
.d32-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; font-family: 'Manrope', system-ui, sans-serif; }
.d32-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d32-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d32-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d32-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d32-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d32-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d32-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d32-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d32-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d32-verdict-on { opacity: 1; }
.d32-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d32-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d32-btn:disabled { opacity: 0.45; cursor: default; }
.d32-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d32-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: ценник качается на витрине */
.d32-tag { animation: d32Tag 3600ms ease-in-out infinite; }
@keyframes d32Tag { 0%, 100% { transform: translate(176px, 122px) rotate(-6deg); } 50% { transform: translate(176px, 122px) rotate(5deg); } }
@media (prefers-reduced-motion: reduce) { .d32-tag { animation: none; transform: translate(176px, 122px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function OpenBracketsLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenMinus, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenPlus, ScreenNeg, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
