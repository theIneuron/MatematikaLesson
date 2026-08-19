// ============================================================
// 6 КЛАСС, УРОК 36 «Экономические задачи и задачи на работу»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б10, первый урок. Две разные с виду темы держатся на одной
// тройке величин: цена, количество, стоимость устроены так же, как
// производительность, время, работа. Совместная работа выводится из
// того, что складываются производительности, а не времена.
//
// Сцена — школьная швейная мастерская, шьют сумки к ярмарке.
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
  lessonId: 'grade6-36',
  lessonTitle: {
    ru: 'Экономические задачи и задачи на работу',
    uz: 'Iqtisodiy va ishga oid masalalar',
    en: 'Money and work problems',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 ustaxona: 6 va 12 soat
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 narx, miqdor, qiymat uchligi
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 unumdorlik, vaqt, ish — o'sha uchlik
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: uchlikda uchinchisini topish
  { id: 's_join',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 birgalikdagi ish
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: chegirma
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: vaqtlar qo'shilmaydi
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_three',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 uchlik x3
  { id: 's_work',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 ish va chegirma x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: ko'paytiramizmi yoki bo'lamizmi
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: ustaxona
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Заказ на ярмарку', uz: 'Yarmarkaga buyurtma', en: 'An order for the fair' },
    lead: {
      ru: 'Мадина шьёт весь заказ за 6 часов, Зилола за 12. Начали работать вместе.',
      uz: "Madina butun buyurtmani 6 soatda, Zilola 12 soatda tikadi. Ular birga ishlay boshladi.",
      en: 'Madina sews the whole order in 6 hours, Zilola in 12. They started working together.',
    },
    voice_a: { ru: 'Улугбек: вместе за 9 часов.', uz: "Ulug'bek: birga 9 soatda.", en: 'Ulugbek: together in 9 hours.' },
    voice_b: { ru: 'Мадина: быстрее, за 4 часа.', uz: "Madina: tezroq, 4 soatda.", en: 'Madina: faster, in 4 hours.' },
    ask: { ru: 'За сколько часов сошьют вместе?', uz: 'Birga necha soatda tikishadi?', en: 'How long will it take together?' },
    options: [
      { ru: '9 часов', uz: '9 soat', en: '9 hours' },
      { ru: '4 часа', uz: '4 soat', en: '4 hours' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В школьной швейной мастерской готовят сумки к ярмарке. Мадина шьёт весь заказ за шесть часов, Зилола за двенадцать. Сегодня они взялись за работу вместе.',
          'Улугбек посчитал середину и говорит, что вместе выйдет девять часов. Мадина отвечает, что вдвоём должно получиться быстрее, за четыре. За сколько часов сошьют вместе? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab tikuvchilik ustaxonasida yarmarkaga sumkalar tayyorlanmoqda. Madina butun buyurtmani olti soatda, Zilola o'n ikki soatda tikadi. Bugun ular ishga birga kirishdi.",
          "Ulug'bek o'rtasini hisoblab, birga to'qqiz soat chiqadi deydi. Madina esa ikkovlon tezroq, to'rt soatda bo'lishi kerak deb javob beradi. Birga necha soatda tikishadi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The school sewing workshop is making bags for the fair. Madina sews the whole order in six hours, Zilola in twelve. Today they took it on together.',
          'Ulugbek took the middle and says together it will be nine hours. Madina answers that two people should be faster, four hours. How long will it take together? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Цена, количество, стоимость', uz: 'Narx, miqdor, qiymat', en: 'Price, amount, cost' },
    done: {
      ru: 'Три величины связаны умножением: крайние дают среднее, а по стоимости и одной из них находят вторую делением.',
      uz: "Uch kattalik ko'paytirish bilan bog'langan: ikkitasi uchinchisini beradi, qiymat va bittasi orqali ikkinchisi bo'lish bilan topiladi.",
      en: 'Three quantities linked by multiplication: two give the third, and division recovers either one from the cost.',
    },
    audio: {
      ru: [
        'Вспомним знакомую тройку. Цена умножить на количество даёт стоимость.',
        'Сумка стоит тридцать тысяч, купили четыре: сто двадцать тысяч.',
        'Работает и наоборот. Если знаем стоимость и цену, делением находим количество. Если знаем стоимость и количество, находим цену.',
      ],
      uz: [
        "Tanish uchlikni eslaymiz. Narx karra miqdor qiymatni beradi.",
        "Sumka o'ttiz ming turadi, to'rttasi olindi: bir yuz yigirma ming.",
        "Teskarisi ham ishlaydi. Qiymat va narx ma'lum bo'lsa, bo'lish bilan miqdor topiladi. Qiymat va miqdor ma'lum bo'lsa, narx topiladi.",
      ],
      en: [
        'Recall a familiar trio. Price times amount gives cost.',
        'A bag costs thirty thousand and four were bought: one hundred twenty thousand.',
        'It works backwards too. With cost and price, division gives the amount. With cost and amount, it gives the price.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Работа устроена так же', uz: 'Ish ham xuddi shunday', en: 'Work is built the same way' },
    lines: [
      { ru: 'производительность — сколько сумок в час', uz: 'unumdorlik — soatiga nechta sumka', en: 'rate: how many bags per hour' },
      { ru: 'производительность · время = работа', uz: "unumdorlik · vaqt = ish", en: 'rate · time = work' },
      { ru: '3 · 5 = 15 сумок', uz: '3 · 5 = 15 ta sumka', en: '3 · 5 = 15 bags' },
    ],
    done: {
      ru: 'Это та же тройка, что цена, количество и стоимость. Значит и находят в ней третью величину так же: умножением или делением.',
      uz: "Bu narx, miqdor va qiymat uchligining o'zi. Demak uchinchi kattalik ham xuddi shunday topiladi: ko'paytirish yoki bo'lish bilan.",
      en: 'It is the same trio as price, amount and cost. So the third quantity is found the same way: by multiplying or dividing.',
    },
    audio: {
      ru: [
        'Теперь посмотрим на работу. Сколько сумок мастер шьёт за один час, называют производительностью.',
        'Если производительность три сумки в час, то за пять часов выйдет пятнадцать сумок. Производительность умножить на время даёт работу.',
        'Сравните с прошлой строкой: цена умножить на количество даёт стоимость. Это одна и та же тройка, только величины называются по-другому. Значит и делить в ней можно так же.',
      ],
      uz: [
        "Endi ishga qaraymiz. Usta bir soatda nechta sumka tikishini unumdorlik deb atashadi.",
        "Unumdorlik soatiga uchta sumka bo'lsa, besh soatda o'n beshta sumka chiqadi. Unumdorlik karra vaqt ishni beradi.",
        "O'tgan satr bilan solishtiring: narx karra miqdor qiymatni beradi. Bu bitta uchlikning o'zi, faqat kattaliklar boshqacha ataladi. Demak bo'lish ham xuddi shunday ishlaydi.",
      ],
      en: [
        'Now look at work. How many bags a maker sews in one hour is called the rate.',
        'If the rate is three bags an hour, five hours give fifteen bags. Rate times time is work.',
        'Compare with the previous line: price times amount gives cost. It is the same trio with different names. So dividing works the same way too.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Третья величина в тройке', uz: 'Uchlikdagi uchinchi kattalik', en: 'The third quantity in a trio' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'известны производительность и время', uz: "unumdorlik va vaqt ma'lum", en: 'the rate and the time are known' },
      { ru: 'значит работу находим умножением', uz: "demak ishni ko'paytirish bilan topamiz", en: 'so the work comes from multiplying' },
      { ru: '5 · 3 = 15 сумок', uz: '5 · 3 = 15 ta sumka', en: '5 · 3 = 15 bags' },
    ],
    demo_note: {
      ru: 'Ищем среднее в тройке — умножаем. Ищем крайнее — делим. Это правило одно для денег и для работы.',
      uz: "Uchlikdagi o'rtadagini qidirsak — ko'paytiramiz. Chetdagini qidirsak — bo'lamiz. Bu qoida pul uchun ham, ish uchun ham bitta.",
      en: 'Looking for the middle of the trio, multiply. Looking for an outer one, divide. One rule for money and for work.',
    },
    play_ask: { ru: 'За 8 часов сшили 24 сумки. Сколько сумок в час?', uz: '8 soatda 24 ta sumka tikildi. Soatiga nechta?', en: '24 bags in 8 hours. How many per hour?' },
    play_opts: ['3', '32', '192'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. Работа известна, время тоже: делим 24 : 8.',
      uz: "To'g'ri. Ish ham, vaqt ham ma'lum: 24 : 8 ni bo'lamiz.",
      en: 'Right. Work and time are known, so divide 24 by 8.',
    },
    play_wrong: [
      null,
      { ru: 'Это сумма, а величины связаны умножением.', uz: "Bu yig'indi, kattaliklar esa ko'paytirish bilan bog'langan.", en: 'That is a sum, but the quantities are linked by multiplication.' },
      { ru: 'Умножением находят работу, а она уже известна.', uz: "Ko'paytirish bilan ish topiladi, u esa allaqachon ma'lum.", en: 'Multiplying finds the work, which is already known.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу порядок работы. Мастер шьёт пять сумок в час и работает три часа.',
        uz: "Ish tartibini ko'rsataman. Usta soatiga beshta sumka tikadi va uch soat ishlaydi.",
        en: 'I will show the working order. A maker sews five bags an hour and works three hours.',
      },
      demo: {
        ru: 'Известны производительность и время, а найти надо работу. Работа стоит в тройке посередине, значит умножаем: пять на три пятнадцать сумок.',
        uz: "Unumdorlik va vaqt ma'lum, topish kerak bo'lgani ish. Ish uchlikda o'rtada turadi, demak ko'paytiramiz: besh karra uch o'n beshta sumka.",
        en: 'The rate and the time are known and the work is wanted. Work sits in the middle of the trio, so multiply: five times three is fifteen bags.',
      },
      play: {
        ru: 'Теперь ваша очередь. За восемь часов сшили двадцать четыре сумки. Сколько сумок в час?',
        uz: "Endi sizning navbatingiz. Sakkiz soatda yigirma to'rtta sumka tikildi. Soatiga nechta?",
        en: 'Now it is your turn. Twenty four bags were sewn in eight hours. How many per hour?',
      },
      ok: {
        ru: 'Верно. Двадцать четыре разделить на восемь это три сумки в час.',
        uz: "To'g'ri. Yigirma to'rtni sakkizga bo'lsak, soatiga uchta sumka.",
        en: 'Right. Twenty four divided by eight is three bags an hour.',
      },
      wrong: {
        ru: 'Работа уже известна, поэтому ищем крайнюю величину делением.',
        uz: "Ish allaqachon ma'lum, shuning uchun chetdagi kattalikni bo'lish bilan qidiramiz.",
        en: 'The work is already known, so find the outer quantity by dividing.',
      },
    },
  },

  s_join: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Работают вместе', uz: 'Birga ishlashadi', en: 'Working together' },
    lines: [
      { ru: 'заказ 12 сумок: Мадина 2 в час, Зилола 1 в час', uz: '12 ta sumka: Madina soatiga 2 ta, Zilola 1 ta', en: '12 bags: Madina 2 per hour, Zilola 1 per hour' },
      { ru: 'вместе за час: 2 + 1 = 3 сумки', uz: 'birga soatiga: 2 + 1 = 3 ta', en: 'together per hour: 2 + 1 = 3 bags' },
      { ru: '12 : 3 = 4 часа', uz: '12 : 3 = 4 soat', en: '12 : 3 = 4 hours' },
    ],
    done: {
      ru: 'Складываются производительности, а не времена. Вместе всегда быстрее, чем у самого быстрого в одиночку. Права была Мадина.',
      uz: "Unumdorliklar qo'shiladi, vaqtlar emas. Birga har doim eng tezining yolg'iz ishlaganidan tezroq bo'ladi. Madina haq edi.",
      en: 'Rates add, times do not. Together is always faster than the quickest one alone. Madina was right.',
    },
    audio: {
      ru: [
        'Возьмём заказ в двенадцать сумок. Мадина шьёт его за шесть часов, значит две сумки в час. Зилола за двенадцать часов, значит одну сумку в час.',
        'Работая вместе, за один час они сошьют две плюс одну, то есть три сумки. Складываются именно производительности.',
        'Теперь делим заказ на общую производительность: двенадцать разделить на три это четыре часа. Улугбек взял середину между шестью и двенадцатью, но вместе не может быть дольше, чем у Мадины одной. Права была Мадина.',
      ],
      uz: [
        "O'n ikkita sumkalik buyurtmani olamiz. Madina uni olti soatda tikadi, demak soatiga ikkita. Zilola o'n ikki soatda, demak soatiga bitta.",
        "Birga ishlab, bir soatda ular ikki qo'shuv bir, ya'ni uchta sumka tikadi. Aynan unumdorliklar qo'shiladi.",
        "Endi buyurtmani umumiy unumdorlikka bo'lamiz: o'n ikkini uchga bo'lsak to'rt soat. Ulug'bek olti bilan o'n ikkining o'rtasini oldi, lekin birga ishlash Madinaning yolg'iz ishlashidan uzoq bo'lolmaydi. Madina haq edi.",
      ],
      en: [
        'Take an order of twelve bags. Madina sews it in six hours, so two bags an hour. Zilola in twelve hours, so one bag an hour.',
        'Working together, in one hour they sew two plus one, that is three bags. It is the rates that add.',
        'Now divide the order by the joint rate: twelve divided by three is four hours. Ulugbek took the middle of six and twelve, but together cannot be slower than Madina alone. Madina was right.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Скидка на ярмарке', uz: 'Yarmarkadagi chegirma', en: 'A discount at the fair' },
    lead: { ru: 'Сумка стоит 30 000 сум, на ярмарке скидка 20%.', uz: "Sumka 30 000 so'm turadi, yarmarkada 20% chegirma.", en: 'A bag costs 30 000 soums with a 20% discount at the fair.' },
    steps: [
      { ru: 'скидка: 30 000 : 100 · 20 = 6000', uz: 'chegirma: 30 000 : 100 · 20 = 6000', en: 'discount: 30 000 : 100 · 20 = 6000' },
      { ru: 'новая цена: 30 000 − 6000 = 24 000', uz: 'yangi narx: 30 000 − 6000 = 24 000', en: 'new price: 30 000 − 6000 = 24 000' },
      { ru: 'три сумки: 24 000 · 3 = 72 000', uz: 'uchta sumka: 24 000 · 3 = 72 000', en: 'three bags: 24 000 · 3 = 72 000' },
    ],
    done: {
      ru: 'Скидка считается от старой цены, а стоимость — уже от новой. Это проценты из урока 21 и тройка величин вместе.',
      uz: "Chegirma eski narxdan, qiymat esa yangi narxdan hisoblanadi. Bu 21-darsdagi foizlar va kattaliklar uchligi birgalikda.",
      en: 'The discount comes off the old price, and the cost is built from the new one. That is percents from lesson 21 plus the trio.',
    },
    audio: {
      ru: [
        'Решаем вместе. Сумка стоит тридцать тысяч сум, на ярмарке скидка двадцать процентов.',
        'Сначала считаем саму скидку. Один процент это триста сум, значит двадцать процентов это шесть тысяч.',
        'Новая цена тридцать тысяч минус шесть тысяч, то есть двадцать четыре тысячи. Три сумки по новой цене стоят семьдесят две тысячи. Скидку берут от старой цены, а стоимость считают уже от новой.',
      ],
      uz: [
        "Birga yechamiz. Sumka o'ttiz ming so'm turadi, yarmarkada yigirma foiz chegirma.",
        "Avval chegirmaning o'zini hisoblaymiz. Bir foiz uch yuz so'm, demak yigirma foiz olti ming.",
        "Yangi narx o'ttiz ming minus olti ming, ya'ni yigirma to'rt ming. Yangi narxdagi uchta sumka yetmish ikki ming turadi. Chegirma eski narxdan olinadi, qiymat esa yangi narxdan hisoblanadi.",
      ],
      en: [
        'Let us solve it together. A bag costs thirty thousand soums with a twenty percent discount at the fair.',
        'First the discount itself. One percent is three hundred soums, so twenty percent is six thousand.',
        'The new price is thirty thousand minus six thousand, that is twenty four thousand. Three bags at the new price cost seventy two thousand. The discount comes off the old price and the cost is built from the new one.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilinadi', en: 'Where mistakes happen' },
    title: { ru: 'Времена не складываются', uz: "Vaqtlar qo'shilmaydi", en: 'Times do not add' },
    bad_line: { ru: 'ошибка: 6 и 12 часов, вместе 9 или 18', uz: 'xato: 6 va 12 soat, birga 9 yoki 18', en: 'mistake: 6 and 12 hours giving 9 or 18' },
    good_line: { ru: 'верно: складываем 2 и 1 сумку в час, выходит 4 часа', uz: "to'g'ri: soatiga 2 va 1 ta sumkani qo'shamiz, 4 soat chiqadi", en: 'right: add 2 and 1 bags an hour, giving 4 hours' },
    warn_line: { ru: 'ошибка: скидка 20%, потом ещё 10% — это не 30%', uz: 'xato: 20% chegirma, keyin yana 10% — bu 30% emas', en: 'mistake: 20% then 10% is not 30%' },
    done: {
      ru: 'Вместе всегда быстрее самого быстрого. А вторую скидку считают уже от новой цены, поэтому две скидки не складываются.',
      uz: "Birga ishlash har doim eng tezidan tezroq. Ikkinchi chegirma esa yangi narxdan hisoblanadi, shuning uchun ikki chegirma qo'shilmaydi.",
      en: 'Together is always faster than the quickest. And a second discount is taken off the new price, so discounts do not add.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. Времена складывают или берут между ними середину. Но вместе работа идёт быстрее, чем у самого быстрого в одиночку, а восемнадцать и девять часов больше шести.',
        'Складывать надо производительности: две сумки в час и одна дают три, отсюда четыре часа.',
        'Вторая ошибка про скидки. Сначала скинули двадцать процентов, потом ещё десять. Это не тридцать процентов: вторую скидку считают уже от новой цены, и она меньше.',
      ],
      uz: [
        "Darsning asosiy xatosi. Vaqtlar qo'shiladi yoki ular o'rtasi olinadi. Ammo birga ishlash eng tezining yolg'iz ishlaganidan tezroq boradi, o'n sakkiz va to'qqiz soat esa oltidan katta.",
        "Unumdorliklarni qo'shish kerak: soatiga ikkita va bitta sumka uchtani beradi, bundan to'rt soat.",
        "Ikkinchi xato chegirmalar haqida. Avval yigirma foiz tushirildi, keyin yana o'n. Bu o'ttiz foiz emas: ikkinchi chegirma yangi narxdan hisoblanadi va u kichikroq.",
      ],
      en: [
        'The main mistake here. Times get added, or the middle is taken. But together the work goes faster than the quickest alone, while eighteen and nine hours are both more than six.',
        'It is the rates that add: two bags an hour and one make three, which gives four hours.',
        'The second mistake is about discounts. First twenty percent off, then ten more. That is not thirty percent: the second discount comes off the new price and is smaller.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Одна тройка на две темы', uz: 'Ikki mavzuga bitta uchlik', en: 'One trio for two topics' },
    rule_1: {
      ru: 'Цена · количество = стоимость, и точно так же производительность · время = работа. Среднюю величину находят умножением, крайнюю — делением.',
      uz: "Narx · miqdor = qiymat, xuddi shunday unumdorlik · vaqt = ish. O'rtadagi kattalik ko'paytirish, chetdagisi bo'lish bilan topiladi.",
      en: 'Price · amount = cost, and likewise rate · time = work. The middle quantity comes from multiplying, an outer one from dividing.',
    },
    rule_2: {
      ru: 'При совместной работе складывают производительности, а не времена. Скидку считают от старой цены, а стоимость — от новой. Мастерская: вместе за 4 часа, права была Мадина.',
      uz: "Birgalikda ishlaganda unumdorliklar qo'shiladi, vaqtlar emas. Chegirma eski narxdan, qiymat yangi narxdan hisoblanadi. Ustaxona: birga 4 soatda, Madina haq edi.",
      en: 'For joint work the rates add, not the times. A discount comes off the old price and the cost from the new one. The workshop: four hours together, so Madina was right.',
    },
    audio: {
      ru: 'Запомним правило. Цена умножить на количество даёт стоимость, и точно так же производительность умножить на время даёт работу. Среднюю величину тройки находят умножением, крайнюю делением. При совместной работе складывают производительности, а не времена, поэтому вместе всегда быстрее. Скидку считают от старой цены, а стоимость уже от новой. Вернёмся в мастерскую. Вместе заказ сошьют за четыре часа. Права была Мадина.',
      uz: "Qoidani eslab qolamiz. Narx karra miqdor qiymatni beradi, xuddi shunday unumdorlik karra vaqt ishni beradi. Uchlikning o'rtadagi kattaligi ko'paytirish, chetdagisi bo'lish bilan topiladi. Birgalikda ishlaganda unumdorliklar qo'shiladi, vaqtlar emas, shuning uchun birga har doim tezroq. Chegirma eski narxdan, qiymat esa yangi narxdan hisoblanadi. Ustaxonaga qaytamiz. Buyurtmani birga to'rt soatda tikishadi. Madina haq edi.",
      en: 'Let us remember the rule. Price times amount gives cost, and likewise rate times time gives work. The middle quantity of the trio comes from multiplying, an outer one from dividing. For joint work the rates add, not the times, so together is always faster. A discount comes off the old price and the cost from the new one. Back to the workshop. Together the order takes four hours. Madina was right.',
    },
  },

  s_three: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Тройка величин', uz: 'Kattaliklar uchligi', en: 'The trio of quantities' },
    lead: { ru: 'Смотри, какая величина неизвестна.', uz: "Qaysi kattalik noma'lumligiga qarang.", en: 'See which quantity is missing.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сумка 25 000 сум, купили 6. Стоимость?', uz: "Sumka 25 000 so'm, 6 tasi olindi. Qiymati?", en: 'A bag costs 25 000, six bought. Cost?' },
        opts: [
          { ru: '150 000 сум', uz: "150 000 so'm", en: '150 000 soums' },
          { ru: '25 006 сум', uz: "25 006 so'm", en: '25 006 soums' },
          { ru: '4166 сум', uz: "4166 so'm", en: '4166 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Цена · количество = стоимость.', uz: "To'g'ri. Narx · miqdor = qiymat.", en: 'Right. Price · amount = cost.' },
        wrong: [
          null,
          { ru: 'Величины связаны умножением, а не сложением.', uz: "Kattaliklar ko'paytirish bilan bog'langan, qo'shish bilan emas.", en: 'The quantities are linked by multiplication, not addition.' },
          { ru: 'Делением находят цену, а она уже известна.', uz: "Bo'lish bilan narx topiladi, u esa ma'lum.", en: 'Division finds the price, which is known.' },
        ],
      },
      {
        q: { ru: 'За 7 часов сшили 35 сумок. Производительность?', uz: '7 soatda 35 ta sumka tikildi. Unumdorlik?', en: '35 bags in 7 hours. The rate?' },
        opts: [
          { ru: '5 сумок в час', uz: 'soatiga 5 ta', en: '5 bags an hour' },
          { ru: '42 сумки в час', uz: 'soatiga 42 ta', en: '42 bags an hour' },
          { ru: '245 сумок в час', uz: 'soatiga 245 ta', en: '245 bags an hour' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 35 : 7 = 5 сумок в час.', uz: "To'g'ri. 35 : 7 = soatiga 5 ta.", en: 'Right. 35 : 7 = 5 bags an hour.' },
        wrong: [
          null,
          { ru: 'Это сумма, а нужно деление.', uz: "Bu yig'indi, bo'lish kerak esa.", en: 'That is a sum, but division is needed.' },
          { ru: 'Умножением находят работу, а она известна.', uz: "Ko'paytirish bilan ish topiladi, u esa ma'lum.", en: 'Multiplying finds the work, which is known.' },
        ],
      },
      {
        q: { ru: 'Мастер шьёт 4 сумки в час. Сколько за 9 часов?', uz: 'Usta soatiga 4 ta sumka tikadi. 9 soatda nechta?', en: 'A maker sews 4 bags an hour. How many in 9 hours?' },
        opts: ['36', '13', '2'],
        correct: 0,
        ok: { ru: 'Верно. 4 · 9 = 36 сумок.', uz: "To'g'ri. 4 · 9 = 36 ta sumka.", en: 'Right. 4 · 9 = 36 bags.' },
        wrong: [
          null,
          { ru: 'Величины перемножают, а не складывают.', uz: "Kattaliklar ko'paytiriladi, qo'shilmaydi.", en: 'The quantities multiply, they do not add.' },
          { ru: 'Делят, когда работа уже известна.', uz: "Ish ma'lum bo'lganda bo'linadi.", en: 'You divide when the work is already known.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на тройку. Если ищете среднюю величину, умножайте, если крайнюю, то делите.',
        uz: "Uchlik mashqi. O'rtadagi kattalikni qidirsangiz ko'paytiring, chetdagisini qidirsangiz bo'ling.",
        en: 'Trio practice. Multiply for the middle quantity, divide for an outer one.',
      },
    },
  },

  s_work: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Работа и скидка', uz: 'Ish va chegirma', en: 'Work and discount' },
    lead: { ru: 'Помни: складываются производительности.', uz: "Yodda tuting: unumdorliklar qo'shiladi.", en: 'Remember: the rates add.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Один шьёт 3 в час, другой 5. Сколько вместе за час?', uz: 'Biri soatiga 3 ta, ikkinchisi 5 ta tikadi. Birga soatiga nechta?', en: 'One sews 3 an hour, another 5. Together per hour?' },
        opts: ['8', '15', '2'],
        correct: 0,
        ok: { ru: 'Верно. Производительности складываются.', uz: "To'g'ri. Unumdorliklar qo'shiladi.", en: 'Right. The rates add.' },
        wrong: [
          null,
          { ru: 'Производительности складывают, а не перемножают.', uz: "Unumdorliklar qo'shiladi, ko'paytirilmaydi.", en: 'Rates add, they do not multiply.' },
          { ru: 'Вместе работают быстрее, а не медленнее.', uz: 'Birga tezroq ishlashadi, sekinroq emas.', en: 'Together they work faster, not slower.' },
        ],
      },
      {
        q: { ru: 'Заказ 40 сумок, вместе шьют 8 в час. За сколько часов?', uz: "Buyurtma 40 ta sumka, birga soatiga 8 ta tikishadi. Necha soatda?", en: 'An order of 40 bags at 8 an hour together. How long?' },
        opts: ['5', '32', '320'],
        correct: 0,
        ok: { ru: 'Верно. 40 : 8 = 5 часов.', uz: "To'g'ri. 40 : 8 = 5 soat.", en: 'Right. 40 : 8 = 5 hours.' },
        wrong: [
          null,
          { ru: 'Это разность, а нужно деление.', uz: "Bu ayirma, bo'lish kerak esa.", en: 'That is a difference, but division is needed.' },
          { ru: 'Умножением находят работу, а она известна.', uz: "Ko'paytirish bilan ish topiladi, u esa ma'lum.", en: 'Multiplying finds the work, which is known.' },
        ],
      },
      {
        q: { ru: 'Сумка 40 000 сум, скидка 25%. Новая цена?', uz: "Sumka 40 000 so'm, 25% chegirma. Yangi narx?", en: 'A bag is 40 000 with 25% off. New price?' },
        opts: [
          { ru: '30 000 сум', uz: "30 000 so'm", en: '30 000 soums' },
          { ru: '10 000 сум', uz: "10 000 so'm", en: '10 000 soums' },
          { ru: '39 975 сум', uz: "39 975 so'm", en: '39 975 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Скидка 10 000, значит цена 30 000.', uz: "To'g'ri. Chegirma 10 000, demak narx 30 000.", en: 'Right. The discount is 10 000, so the price is 30 000.' },
        wrong: [
          null,
          { ru: 'Это сама скидка, а спрашивали новую цену.', uz: "Bu chegirmaning o'zi, so'ralgani esa yangi narx.", en: 'That is the discount itself, but the new price was asked.' },
          { ru: 'Проценты — это сотые доли, а не единицы.', uz: "Foizlar yuzdan bir ulush, birlik emas.", en: 'Percents are hundredths, not units.' },
        ],
      },
      {
        q: { ru: 'Почему вместе всегда быстрее?', uz: 'Nega birga har doim tezroq?', en: 'Why is together always faster?' },
        opts: [
          { ru: 'общая производительность больше', uz: "umumiy unumdorlik kattaroq", en: 'the joint rate is larger' },
          { ru: 'времена складываются', uz: "vaqtlar qo'shiladi", en: 'the times add' },
          { ru: 'работа уменьшается', uz: 'ish kamayadi', en: 'the work shrinks' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Больше производительность — меньше время.', uz: "To'g'ri. Unumdorlik katta — vaqt kichik.", en: 'Right. A bigger rate means less time.' },
        wrong: [
          null,
          { ru: 'Складываются как раз производительности.', uz: "Aynan unumdorliklar qo'shiladi.", en: 'It is the rates that add.' },
          { ru: 'Заказ остаётся тем же, меняется скорость.', uz: "Buyurtma o'sha qoladi, tezlik o'zgaradi.", en: 'The order stays the same, the speed changes.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на работу и проценты. Не путайте производительность со временем.',
        uz: 'Ish va foizlar mashqi. Unumdorlikni vaqt bilan chalkashtirmang.',
        en: 'Practice on work and percents. Do not confuse the rate with the time.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Умножить или разделить', uz: "Ko'paytirish yoki bo'lish", en: 'Multiply or divide' },
    lead: { ru: 'Смотри, какая величина неизвестна: средняя или крайняя.', uz: "Qaysi kattalik noma'lumligiga qarang: o'rtadagimi yoki chetdagi.", en: 'See which quantity is missing: the middle or an outer one.' },
    bin_a: { ru: 'Умножаем', uz: "Ko'paytiramiz", en: 'We multiply' },
    bin_b: { ru: 'Делим', uz: "Bo'lamiz", en: 'We divide' },
    cards: [
      { label: { ru: 'знаем цену и количество', uz: "narx va miqdor ma'lum", en: 'price and amount known' }, bin: 'a' },
      { label: { ru: 'знаем производительность и время', uz: "unumdorlik va vaqt ma'lum", en: 'rate and time known' }, bin: 'a' },
      { label: { ru: 'знаем скорость и время', uz: "tezlik va vaqt ma'lum", en: 'speed and time known' }, bin: 'a' },
      { label: { ru: 'знаем стоимость и цену', uz: "qiymat va narx ma'lum", en: 'cost and price known' }, bin: 'b' },
      { label: { ru: 'знаем работу и время', uz: "ish va vaqt ma'lum", en: 'work and time known' }, bin: 'b' },
      { label: { ru: 'знаем путь и скорость', uz: "yo'l va tezlik ma'lum", en: 'distance and speed known' }, bin: 'b' },
    ],
    hint: {
      ru: 'Стоимость, работа и путь стоят в середине тройки: их находят умножением.',
      uz: "Qiymat, ish va yo'l uchlikning o'rtasida turadi: ular ko'paytirish bilan topiladi.",
      en: 'Cost, work and distance sit in the middle of the trio: multiplying finds them.',
    },
    correct_text: {
      ru: 'Верно. Три разные темы держатся на одной и той же тройке.',
      uz: "To'g'ri. Uchta har xil mavzu bitta uchlikka tayanadi.",
      en: 'Right. Three different topics rest on the same trio.',
    },
    audio: {
      intro: {
        ru: 'Разложите случаи по двум корзинам. Если неизвестна средняя величина, умножаем, если крайняя, то делим.',
        uz: "Hollarni ikki savatga ajrating. O'rtadagi kattalik noma'lum bo'lsa ko'paytiramiz, chetdagisi bo'lsa bo'lamiz.",
        en: 'Sort the cases into two baskets. Multiply for a missing middle, divide for a missing outer one.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Посмотри, что именно ищут.', uz: 'Bu yerga emas. Nima qidirilayotganiga qarang.', en: 'Not here. Look at what is being sought.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Улугбек: «Один за 4 часа, другой за 4 часа, вместе за 8». Проверь.', uz: "Ulug'bek: «Biri 4 soatda, ikkinchisi 4 soatda, birga 8 soatda». Tekshiring.", en: 'Ulugbek: “One in 4 hours, another in 4, together 8.” Check it.' },
        opts: [
          { ru: 'Нет: вместе за 2 часа, вдвоём быстрее', uz: "Yo'q: birga 2 soatda, ikkovlon tezroq", en: 'No: 2 hours together, two are faster' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, вместе за 4 часа', uz: "Yo'q, birga 4 soatda", en: 'No, 4 hours together' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Производительность удвоилась, время вдвое меньше.', uz: "To'g'ri. Unumdorlik ikki barobar oshdi, vaqt ikki barobar kamaydi.", en: 'Right. The rate doubled, so the time halved.' },
        wrong: [
          null,
          { ru: 'Вдвоём не может быть дольше, чем одному.', uz: "Ikkovlon yolg'izdan uzoq bo'lolmaydi.", en: 'Two people cannot be slower than one.' },
          { ru: 'Столько выходит у одного, а работают двое.', uz: "Bu yolg'iz ishlaganda chiqadi, ishlayotgan esa ikkov.", en: 'That is one person’s time, but two are working.' },
        ],
      },
      {
        q: { ru: 'Зилола: «Скидка 20%, потом ещё 10% — всего 30%». Проверь.', uz: "Zilola: «20% chegirma, keyin yana 10% — jami 30%». Tekshiring.", en: 'Zilola: “20% off, then 10% more, so 30%.” Check it.' },
        opts: [
          { ru: 'Нет: вторая скидка считается от новой цены', uz: "Yo'q: ikkinchi chegirma yangi narxdan hisoblanadi", en: 'No: the second discount comes off the new price' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, всего 20%', uz: "Yo'q, jami 20%", en: 'No, only 20%' },
        ],
        correct: 0,
        ok: { ru: 'Верно. От 100 000 выйдет 72 000, а не 70 000.', uz: "To'g'ri. 100 000 dan 70 000 emas, 72 000 chiqadi.", en: 'Right. From 100 000 you get 72 000, not 70 000.' },
        wrong: [
          null,
          { ru: 'Проценты берут от разных цен, поэтому не складываются.', uz: "Foizlar har xil narxlardan olinadi, shuning uchun qo'shilmaydi.", en: 'The percents come off different prices, so they do not add.' },
          { ru: 'Вторая скидка тоже уменьшает цену.', uz: 'Ikkinchi chegirma ham narxni kamaytiradi.', en: 'The second discount lowers the price too.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в работе, и в процентах.',
        uz: "Birovning yechimini tekshiring. Xato ishda ham, foizlarda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the work part and in the percents.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Мастерская к ярмарке', uz: 'Yarmarkaga ustaxona', en: 'The workshop before the fair' },
    lead: { ru: 'Мадина шьёт 2 сумки в час, Зилола 1. Сумка стоит 30 000 сум.', uz: "Madina soatiga 2 ta, Zilola 1 ta sumka tikadi. Sumka 30 000 so'm turadi.", en: 'Madina sews 2 bags an hour, Zilola 1. A bag costs 30 000 soums.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько сумок сошьют вместе за 6 часов?', uz: 'Birga 6 soatda nechta sumka tikishadi?', en: 'How many bags in 6 hours together?' },
        opts: ['18', '9', '3'],
        correct: 0,
        ok: { ru: 'Верно. Вместе 3 в час, значит 3 · 6 = 18.', uz: "To'g'ri. Birga soatiga 3 ta, demak 3 · 6 = 18.", en: 'Right. Three an hour together, so 3 · 6 = 18.' },
        wrong: [
          null,
          { ru: 'Это работа одной Мадины за 4 часа с половиной.', uz: "Bu Madinaning yolg'iz ishlagani.", en: 'That is Madina working alone.' },
          { ru: 'Это производительность, а спрашивали работу.', uz: "Bu unumdorlik, so'ralgani esa ish.", en: 'That is the rate, but the work was asked.' },
        ],
      },
      {
        q: { ru: 'Все 18 сумок продали со скидкой 10%. Сколько собрали?', uz: "18 ta sumka 10% chegirma bilan sotildi. Qancha yig'ildi?", en: 'All 18 bags sold at 10% off. How much came in?' },
        opts: [
          { ru: '486 000 сум', uz: "486 000 so'm", en: '486 000 soums' },
          { ru: '540 000 сум', uz: "540 000 so'm", en: '540 000 soums' },
          { ru: '54 000 сум', uz: "54 000 so'm", en: '54 000 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Цена 27 000, значит 27 000 · 18 = 486 000.', uz: "To'g'ri. Narx 27 000, demak 27 000 · 18 = 486 000.", en: 'Right. The price is 27 000, so 27 000 · 18 = 486 000.' },
        wrong: [
          null,
          { ru: 'Это выручка без скидки.', uz: 'Bu chegirmasiz tushum.', en: 'That is the take without the discount.' },
          { ru: 'Это вся скидка, а не выручка.', uz: 'Bu butun chegirma, tushum emas.', en: 'That is the whole discount, not the take.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про мастерскую. Мадина шьёт две сумки в час, Зилола одну, сумка стоит тридцать тысяч сум.',
        uz: "Ustaxona haqida masala. Madina soatiga ikkita, Zilola bitta sumka tikadi, sumka o'ttiz ming so'm turadi.",
        en: 'A workshop problem. Madina sews two bags an hour, Zilola one, and a bag costs thirty thousand soums.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 6,
        q: { ru: 'За 9 часов сшили 54 сумки. Сколько в час? Набери ответ.', uz: '9 soatda 54 ta sumka tikildi. Soatiga nechta? Javobni tering.', en: '54 bags in 9 hours. How many per hour? Type the answer.' },
        hint: { ru: 'Работа и время известны: делим.', uz: "Ish va vaqt ma'lum: bo'lamiz.", en: 'Work and time are known: divide.' },
        hint_audio: { ru: 'Работа и время известны, значит производительность находим делением пятидесяти четырёх на девять.', uz: "Ish va vaqt ma'lum, demak unumdorlikni ellik to'rtni to'qqizga bo'lib topamiz.", en: 'Work and time are known, so divide fifty four by nine to find the rate.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Один шьёт 4 в час, другой 6. Заказ 30 сумок. За сколько вместе?', uz: 'Biri soatiga 4 ta, ikkinchisi 6 ta tikadi. Buyurtma 30 ta. Birga necha soatda?', en: 'One sews 4 an hour, another 6. An order of 30. How long together?' },
        opts: ['10', '5', '3', '2'],
        wrong: [
          { ru: 'Это время одного из мастеров, а работают двое.', uz: "Bu ustalardan birining vaqti, ishlayotgan esa ikkov.", en: 'That is one maker’s time, but two are working.' },
          { ru: 'Это время второго мастера в одиночку.', uz: "Bu ikkinchi ustaning yolg'iz vaqti.", en: 'That is the second maker alone.' },
          null,
          { ru: 'Проверь: 10 сумок в час дали бы 30 за 3 часа.', uz: 'Tekshiring: soatiga 10 ta 30 tani 3 soatda berardi.', en: 'Check: ten an hour gives thirty in three hours.' },
        ],
        correct: { ru: 'Верно. Вместе 10 в час, значит 30 : 10 = 3 часа.', uz: "To'g'ri. Birga soatiga 10 ta, demak 30 : 10 = 3 soat.", en: 'Right. Ten an hour together, so 30 : 10 = 3 hours.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Товар стоил 50 000, скидка 30%. Новая цена?', uz: "Mahsulot 50 000 turardi, 30% chegirma. Yangi narx?", en: 'An item cost 50 000 with 30% off. New price?' },
        opts: [
          { ru: '15 000 сум', uz: "15 000 so'm", en: '15 000 soums' },
          { ru: '35 000 сум', uz: "35 000 so'm", en: '35 000 soums' },
          { ru: '20 000 сум', uz: "20 000 so'm", en: '20 000 soums' },
          { ru: '49 970 сум', uz: "49 970 so'm", en: '49 970 soums' },
        ],
        wrong: [
          { ru: 'Это сама скидка, а спрашивали цену.', uz: "Bu chegirmaning o'zi, so'ralgani esa narx.", en: 'That is the discount, but the price was asked.' },
          null,
          { ru: 'Так вышло бы при скидке 60%.', uz: "60% chegirmada shunday bo'lardi.", en: 'That would need a 60% discount.' },
          { ru: 'Проценты — это сотые доли, а не единицы.', uz: "Foizlar yuzdan bir ulush, birlik emas.", en: 'Percents are hundredths, not units.' },
        ],
        correct: { ru: 'Верно. Скидка 15 000, значит цена 35 000.', uz: "To'g'ri. Chegirma 15 000, demak narx 35 000.", en: 'Right. The discount is 15 000, so the price is 35 000.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что складывают при совместной работе?', uz: "Birgalikda ishlaganda nima qo'shiladi?", en: 'What adds up in joint work?' },
        opts: [
          { ru: 'времена', uz: 'vaqtlar', en: 'the times' },
          { ru: 'объёмы работы', uz: 'ish hajmlari', en: 'the amounts of work' },
          { ru: 'ничего не складывают', uz: "hech nima qo'shilmaydi", en: 'nothing adds' },
          { ru: 'производительности', uz: 'unumdorliklar', en: 'the rates' },
        ],
        wrong: [
          { ru: 'Времена как раз не складываются.', uz: "Vaqtlar aynan qo'shilmaydi.", en: 'Times are exactly what does not add.' },
          { ru: 'Заказ один и тот же, он не растёт.', uz: "Buyurtma bitta, u o'smaydi.", en: 'The order is one and does not grow.' },
          { ru: 'Что-то складывается, иначе работа не пошла бы быстрее.', uz: "Nimadir qo'shiladi, aks holda ish tezlashmasdi.", en: 'Something adds, otherwise nothing would speed up.' },
          null,
        ],
        correct: { ru: 'Верно. Поэтому вместе всегда быстрее.', uz: "To'g'ri. Shuning uchun birga har doim tezroq.", en: 'Right. That is why together is always faster.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Мадина за 6 часов, Зилола за 12. За сколько вместе?', uz: 'Madina 6 soatda, Zilola 12 soatda. Birga necha soatda?', en: 'Madina in 6 hours, Zilola in 12. Together?' },
        opts: ['4', '9', '18', '6'],
        wrong: [
          null,
          { ru: 'Это середина между 6 и 12, а вместе быстрее.', uz: "Bu 6 va 12 ning o'rtasi, birga esa tezroq.", en: 'That is the middle of 6 and 12, but together is faster.' },
          { ru: 'Времена не складываются.', uz: "Vaqtlar qo'shilmaydi.", en: 'Times do not add.' },
          { ru: 'Столько нужно одной Мадине.', uz: "Bu Madinaning yolg'iz vaqti.", en: 'That is Madina working alone.' },
        ],
        correct: { ru: 'Верно. 2 и 1 сумка в час дают 3, значит 12 : 3 = 4 часа.', uz: "To'g'ri. Soatiga 2 va 1 ta 3 tani beradi, demak 12 : 3 = 4 soat.", en: 'Right. Two and one an hour make three, so 12 : 3 = 4 hours.' },
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
      ru: 'Производительность умеет расти не только от числа рабочих. В 1913 году на заводе Генри Форда собрали первый движущийся конвейер: каждый рабочий стал делать одну операцию, и машина ехала к нему сама. Сборка одного автомобиля сократилась примерно с 12 часов до полутора, а цена упала настолько, что машину смог купить обычный рабочий.',
      uz: "Unumdorlik faqat ishchilar sonidan o'smaydi. 1913 yilda Genri Ford zavodida birinchi harakatlanuvchi konveyer yig'ildi: har bir ishchi bitta amalni bajaradigan bo'ldi, mashina esa uning oldiga o'zi kelardi. Bitta avtomobil yig'ish taxminan 12 soatdan bir yarim soatgacha qisqardi, narx esa oddiy ishchi ham sotib ola oladigan darajada tushdi.",
      en: 'Rates can grow without adding workers. In 1913 Henry Ford’s plant ran the first moving assembly line: each worker did one operation and the car came to them. Assembling one car fell from about 12 hours to an hour and a half, and the price dropped so far that an ordinary worker could buy one.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Производительность умеет расти не только от числа рабочих. В тысяча девятьсот тринадцатом году на заводе Генри Форда собрали первый движущийся конвейер: каждый рабочий стал делать одну операцию, а машина ехала к нему сама. Сборка одного автомобиля сократилась примерно с двенадцати часов до полутора, и цена упала настолько, что машину смог купить обычный рабочий.',
      uz: "Bilasizmi? Unumdorlik faqat ishchilar sonidan o'smaydi. Ming to'qqiz yuz o'n uchinchi yilda Genri Ford zavodida birinchi harakatlanuvchi konveyer yig'ildi: har bir ishchi bitta amalni bajaradigan bo'ldi, mashina esa uning oldiga o'zi kelardi. Bitta avtomobil yig'ish taxminan o'n ikki soatdan bir yarim soatgacha qisqardi, narx esa oddiy ishchi ham sotib ola oladigan darajada tushdi.",
      en: 'Did you know? Rates can grow without adding workers. In nineteen thirteen Henry Ford’s plant ran the first moving assembly line: each worker did one operation and the car came to them. Assembling one car fell from about twelve hours to an hour and a half, and the price dropped so far that an ordinary worker could buy one.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Задачи', uz: 'Matematika · Masalalar', en: 'Mathematics · Word problems' },
    heading: { ru: 'Деньги и работа', uz: 'Pul va ish', en: 'Money and work' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'цена · количество = стоимость', uz: 'narx · miqdor = qiymat', en: 'price · amount = cost' },
    brief_2: { ru: 'производительность · время = работа', uz: 'unumdorlik · vaqt = ish', en: 'rate · time = work' },
    brief_3: { ru: 'вместе складываются производительности', uz: "birga unumdorliklar qo'shiladi", en: 'in joint work the rates add' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Средняя величина', uz: "O'rtadagi kattalik", en: 'The middle quantity' },
    memo_a1: { ru: 'находится умножением', uz: "ko'paytirish bilan topiladi", en: 'comes from multiplying' },
    memo_q2: { ru: 'Скидка', uz: 'Chegirma', en: 'A discount' },
    memo_a2: { ru: 'считается от старой цены', uz: 'eski narxdan hisoblanadi', en: 'comes off the old price' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'сложить времена работы', uz: "ish vaqtlarini qo'shish", en: 'adding the working times' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Цена умножить на количество даёт стоимость, и точно так же производительность умножить на время даёт работу. Среднюю величину тройки находят умножением, крайнюю делением. При совместной работе складывают производительности, а не времена.',
        'Мастерская: вместе заказ сошьют за четыре часа.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Narx karra miqdor qiymatni beradi, xuddi shunday unumdorlik karra vaqt ishni beradi. Uchlikning o'rtadagi kattaligi ko'paytirish, chetdagisi bo'lish bilan topiladi. Birgalikda ishlaganda unumdorliklar qo'shiladi, vaqtlar emas.",
        "Ustaxona: buyurtmani birga to'rt soatda tikishadi.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'Price times amount gives cost, and likewise rate times time gives work. The middle of the trio comes from multiplying, an outer one from dividing. For joint work the rates add, not the times.',
        'The workshop: together the order takes four hours.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Найди тройку', uz: 'Usul. Uchlikni toping', en: 'Method. Find the trio' },
    m1_steps: {
      ru: ['Назови три величины задачи', 'Отметь, какая из них неизвестна', 'Средняя — умножай, крайняя — дели'],
      uz: ['Masaladagi uch kattalikni ayting', "Qaysi biri noma'lumligini belgilang", "O'rtadagisi — ko'paytiring, chetdagisi — bo'ling"],
      en: ['Name the three quantities', 'Mark which one is unknown', 'Middle: multiply. Outer: divide'],
    },
    m1_no: {
      ru: 'При совместной работе сначала находят общую производительность за час.',
      uz: 'Birgalikdagi ishda avval soatlik umumiy unumdorlik topiladi.',
      en: 'For joint work, first find the joint rate per hour.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: школьная швейная мастерская перед ярмаркой.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d36wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE4D2"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d36wall)"/>

    {/* Полка с рулонами ткани */}
    <g opacity="0.92">
      <rect x="10" y="18" width="96" height="6" rx="3" fill="#C9A472"/>
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x={14 + k * 23} y="24" width="18" height="30" rx="4"
            fill={['#7ECBE6', '#F5C77E', '#8FBF7F', '#D9603F'][k]}/>
          <path d={`M${23 + k * 23} 24 v30`} stroke="#FFFDF7" strokeWidth="1.4" opacity="0.5"/>
        </g>
      ))}
    </g>

    {/* Готовые сумки на стойке */}
    <g>
      <path d="M300 40 h84" stroke="#8E8578" strokeWidth="2.4"/>
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${308 + k * 28}, 40)`}>
          <path d="M2 8 h16 l3 22 h-22 z" fill="#8FBF7F" stroke="#6FA463" strokeWidth="1.4"/>
          <path d="M5 8 q5 -8 10 0" fill="none" stroke="#6FA463" strokeWidth="1.6"/>
        </g>
      ))}
    </g>

    {/* Два рабочих стола со швейными машинами */}
    {[0, 1].map((k) => (
      <g key={k} transform={`translate(${118 + k * 96}, 0)`}>
        <rect x="0" y="96" width="80" height="6" rx="3" fill="#C9A472"/>
        <rect x="8" y="102" width="6" height="24" fill="#B08A55"/>
        <rect x="66" y="102" width="6" height="24" fill="#B08A55"/>
        <path d="M14 96 v-22 h30 v10 h18 v12 z" fill="#7B7367"/>
        <rect x="20" y="86" width="34" height="4" rx="2" fill="#F4EEDF"/>
        <circle className="d36-wheel" cx="58" cy="80" r="6" fill="none" stroke="#F5C77E" strokeWidth="2.4"/>
        <path className="d36-needle" d="M30 82 v8" stroke="#FFFDF7" strokeWidth="2" strokeLinecap="round"/>
      </g>
    ))}

    {/* Табличка с временем работы */}
    <g>
      <rect x="150" y="14" width="104" height="34" rx="5" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2"/>
      <text x="178" y="36" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">6</text>
      <text x="202" y="36" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">va</text>
      <text x="228" y="36" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700">12</text>
    </g>

    {/* Две швеи за столами */}
    <Person x={146} ground={126} head={12} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={242} ground={126} head={12} shirt="#F5C77E" hair="#5A4636"/>
    <rect x="0" y="132" width="400" height="22" fill="#D2A96F"/>
  </svg>
);

// Итог: две тройки величин рядом.
const FinalScene = () => {
  const lang = useLang();
  const rows = [
    { a: tri(lang, 'цена', 'narx', 'price'), b: tri(lang, 'количество', 'miqdor', 'amount'), c: tri(lang, 'стоимость', 'qiymat', 'cost') },
    { a: tri(lang, 'производительность', 'unumdorlik', 'rate'), b: tri(lang, 'время', 'vaqt', 'time'), c: tri(lang, 'работа', 'ish', 'work') },
  ];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {rows.map((r, i) => (
        <g key={i} transform={`translate(0, ${10 + i * 38})`}>
          <rect x="14" y="0" width="126" height="28" rx="6" fill="#E7F5FA" stroke="#019ACB" strokeWidth="1.8"/>
          <text x="77" y="19" textAnchor="middle" fill="#019ACB"
            fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">{r.a}</text>
          <text x="150" y="19" textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">·</text>
          <rect x="160" y="0" width="86" height="28" rx="6" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="1.8"/>
          <text x="203" y="19" textAnchor="middle" fill="#8A6A22"
            fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">{r.b}</text>
          <text x="256" y="19" textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">=</text>
          <rect x="266" y="0" width="120" height="28" rx="6" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="1.8"/>
          <text x="326" y="19" textAnchor="middle" fill="#1F7A4D"
            fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">{r.c}</text>
        </g>
      ))}
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: тройка величин, неизвестная подсвечена.
const Triple = ({ a, b, c, missing, note }) => (
  <span className="d36-triple">
    <i className={'d36-cell d36-cell-a' + (missing === 'a' ? ' d36-cell-miss' : '')}>{a}</i>
    <b>·</b>
    <i className={'d36-cell d36-cell-b' + (missing === 'b' ? ' d36-cell-miss' : '')}>{b}</i>
    <b>=</b>
    <i className={'d36-cell d36-cell-c' + (missing === 'c' ? ' d36-cell-miss' : '')}>{c}</i>
    {note && <em className="d36-note">{note}</em>}
  </span>
);

// Производительности двух мастеров и их сумма.
const Rates = ({ a, b, sum, on }) => (
  <span className="d36-rates-box">
    <svg viewBox="0 0 320 96" aria-hidden="true">
      <rect x="14" y="10" width={a * 26} height="22" rx="4" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2"/>
      <text x={14 + a * 13} y="26" textAnchor="middle" fill="#019ACB"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{a}</text>
      <rect x="14" y="38" width={b * 26} height="22" rx="4" fill="#FBF3D6" stroke="#8A6A22" strokeWidth="2"/>
      <text x={14 + b * 13} y="54" textAnchor="middle" fill="#8A6A22"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{b}</text>
      <g className={'d36-fade' + (on ? ' d36-on' : '')}>
        <rect x="14" y="66" width={sum * 26} height="22" rx="4" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2"/>
        <text x={14 + sum * 13} y="82" textAnchor="middle" fill="#1F7A4D"
          fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{sum}</text>
      </g>
    </svg>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d36-line d36-fade' + (on ? ' d36-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d36-stage">
        <Triple a={tri(lang, 'цена', 'narx', 'price')} b={tri(lang, 'количество', 'miqdor', 'amount')}
          c={tri(lang, 'стоимость', 'qiymat', 'cost')}/>
        <span className={'d36-chips d36-fade' + (step >= 1 ? ' d36-on' : '')}>
          <i className="d36-chip-g">30 000 · 4 = 120 000</i>
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

// Ядро: та же тройка для работы.
const CoreBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d36-stage">
        <Triple a={tri(lang, 'производительность', 'unumdorlik', 'rate')} b={tri(lang, 'время', 'vaqt', 'time')}
          c={tri(lang, 'работа', 'ish', 'work')} missing={step >= 1 ? 'c' : null}/>
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

// Совместная работа: производительности складываются.
const JoinBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_join;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d36-stage">
        <Rates a={2} b={1} sum={3} on={step >= 1}/>
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
      <div className="frame fade-up delay-1 d36-stage">
        <span className="d36-price">
          <i className="d36-old">30 000</i>
          <b>→</b>
          <i className={'d36-new d36-fade' + (step >= 1 ? ' d36-on' : '')}>24 000</i>
        </span>
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

// Граница: времена не складываются.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d36-stage">
        <span className="d36-pair d36-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d36-pair d36-pair-good d36-fade' + (step >= 1 ? ' d36-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d36-pair d36-pair-warn d36-fade' + (step >= 2 ? ' d36-on' : '')}>
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
        <div className={'d36-banner fade-up delay-1' + (phase === 'play' ? ' d36-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d36-stage d36-stage-tool">
          {phase === 'demo' ? (
            <>
              <Triple a="5" b="3" c={shown >= 2 ? '15' : '?'} missing={shown >= 1 ? 'c' : null}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d36-verdict' + (done ? ' d36-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d36-acts fade-up">
            <button className="d36-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d36-btn d36-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenJoin = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_join} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <JoinBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => {
  const lang = useLang();
  return (
    <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
      exampleNode={(
        <div className="d36-stage">
          <Triple a={tri(lang, 'производительность', 'unumdorlik', 'rate')} b={tri(lang, 'время', 'vaqt', 'time')}
            c={tri(lang, 'работа', 'ish', 'work')}/>
        </div>
      )}/>
  );
};

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenThree = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_three} asideNode={methodAside}/>
);
const ScreenWork = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_work} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: производительности мастериц.
const TaskFig = ({ idx }) => (
  <div className="d36-task-fig">
    {idx >= 1 ? (
      <span className="d36-price">
        <i className="d36-old">30 000</i>
        <b>→</b>
        <i className="d36-new">27 000</i>
      </span>
    ) : (
      <Rates a={2} b={1} sum={3} on/>
    )}
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
.d36-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d36-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d36-stage-tool .d36-line { font-size: clamp(12px, 2vw, 16px); }

.d36-fade { opacity: 0; transition: opacity 420ms linear; }
.d36-on { opacity: 1; }
.d36-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.2vw, 17px); font-weight: 700; color: #494550; text-align: center; }

/* Тройка величин */
.d36-triple { display: inline-flex; align-items: center; gap: clamp(5px, 1.2vw, 10px); flex-wrap: wrap; justify-content: center; }
.d36-triple b { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.6vw, 20px); color: #8A8883; }
.d36-cell { font-style: normal; padding: 6px 13px; border-radius: 11px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 2vw, 15px); font-weight: 700; text-align: center; }
.d36-cell-a { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d36-cell-b { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }
.d36-cell-c { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }
.d36-cell-miss { outline: 2px dashed #FF4F28; outline-offset: 2px; }
.d36-note { font-style: normal; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(11px, 1.9vw, 13px); font-weight: 700; color: #8A8883; }

/* Производительности */
.d36-rates-box { display: block; width: 100%; max-width: 300px; }
.d36-rates-box svg { width: 100%; height: auto; display: block; }

/* Цена до и после скидки */
.d36-price { display: inline-flex; align-items: center; gap: clamp(8px, 1.7vw, 14px); flex-wrap: wrap; justify-content: center; }
.d36-price b { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); color: #8A8883; }
.d36-price i { font-style: normal; padding: 6px 15px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.8vw, 23px); font-weight: 700; }
.d36-old { background: #FFF1EC; border: 1px solid #F3C4B4; color: #D9603F; text-decoration: line-through; }
.d36-new { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Подписи */
.d36-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d36-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; }
.d36-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d36-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d36-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d36-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d36-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d36-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d36-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d36-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d36-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d36-verdict-on { opacity: 1; }
.d36-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d36-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d36-btn:disabled { opacity: 0.45; cursor: default; }
.d36-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d36-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: маховик крутится, игла ходит вверх-вниз */
.d36-wheel { animation: d36Wheel 1600ms linear infinite; transform-origin: center; transform-box: fill-box; }
@keyframes d36Wheel { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.d36-needle { animation: d36Needle 700ms ease-in-out infinite; }
@keyframes d36Needle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
@media (prefers-reduced-motion: reduce) { .d36-wheel, .d36-needle { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function WorkMoneyLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenJoin, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenThree, ScreenWork, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
