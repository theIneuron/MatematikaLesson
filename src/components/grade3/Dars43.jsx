import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars43 — "Vaqt: soat, daqiqa, soniya" (num-3-43) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 48-satr). SAHNA: 1-DARSNING shahri, tugun — minora soati.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, vaqt boblari).
// YADRO: vaqt o'lchovlari O'NLIK EMAS. 1 soat = 60 daqiqa, 1 daqiqa = 60 soniya.
//   Soatda ikki strelka: kalta — soat, uzun — daqiqa.
// Misconception: M1 «bir soatda 100 daqiqa»; M2 strelkalarni almashtirish; M3 sifatdagi
//   raqamni daqiqa deb o'qish (3 raqami 15 daqiqa); M4 vaqtni oddiy son kabi ayirish.
// FactCard: Yupiterda sutka o'n soat — u Yerdan tez aylanadi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-43',
  lessonTitle: { ru: 'Урок 43. Время: час, минута, секунда', uz: '43-dars. Vaqt: soat, daqiqa, soniya', en: 'Lesson 43. Time: the hour, the minute, the second' }
};
// STRUKTURA: s0 xuk soat · s1 strelkalar · s2 daqiqa va soniya · s3 QOIDA 60 · s4 chizma
// bo'yicha vaqt · s5 saralash soat yoki daqiqa · s6 test aylantirish · s7 konsol vaqt ·
// s8 xatoni top (100 daqiqa) · s9 Bit tuzog'i (strelka almashib ketdi) · s10 trenajyor
// soatdan daqiqaga · s11 trenajyor ayirma · s12 masala jadval · s13 final + FactCard · s14 yakun.
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
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Время: час, минута, секунда', uz: 'Vaqt: soat, daqiqa, soniya', en: 'Time: the hour, the minute, the second' },
    lead: { ru: 'На башне города часы', uz: 'Shahar minorasida soat', en: 'A clock on the city tower' },
    order_cap: { ru: 'две стрелки, одна короче', uz: 'ikki strelka, biri kalta', en: 'two hands, one is shorter' },
    plate: ['1', { ru: 'ч', uz: 'soat', en: 'hour' }, '60'],
    q: { ru: 'Какая стрелка показывает часы?', uz: 'Qaysi strelka soatni ko\'rsatadi?', en: 'Which hand shows the hours?' },
    opt0: { ru: 'короткая', uz: 'kaltasi', en: 'the short one' },
    opt1: { ru: 'длинная', uz: 'uzuni', en: 'the long one' },
    opt2: { ru: 'обе одинаково', uz: 'ikkalasi bir xil', en: 'both the same' },
    opt3: { ru: 'та, что быстрее', uz: 'tezroq yurgani', en: 'the one that goes faster' },
    audio: {
      intro: {
        ru: [
          'Массу мы взвесили. Возьмём величину, которую нельзя потрогать.',
          'На башне города висят часы. У них две стрелки.',
          'Одна короткая и движется медленно, другая длинная и обходит круг быстро.',
          'Как думаешь, какая из них показывает часы?'
        ],
        uz: [
          "Massani tortdik. Endi ushlab bo'lmaydigan kattalikni olamiz.",
          "Shahar minorasida soat osilgan. Unda ikki strelka bor.",
          "Biri kalta va sekin yuradi, ikkinchisi uzun va aylanani tez bosib o'tadi.",
          "Sizningcha, ulardan qaysi biri soatni ko'rsatadi?"
        ],
        en: ['We have weighed mass. Now let us take a quantity you cannot touch.', 'A clock hangs on the city tower. It has two hands.', 'One is short and moves slowly, the other is long and goes round the circle fast.', 'Which of them do you think shows the hours?']
      },
      on_correct: { ru: 'Верно! Короткая стрелка показывает часы, она проходит круг за половину суток.', uz: "To'g'ri! Kalta strelka soatni ko'rsatadi, u aylanani sutkaning yarmida bosib o'tadi.", en: 'Right! The short hand shows the hours, it goes round the circle in half a day.' },
      on_wrong1: { ru: 'Длинная бежит быстро и обходит круг за час. Это минутная.', uz: "Uzuni tez yuradi va aylanani bir soatda bosib o'tadi. Bu daqiqa strelkasi.", en: 'The long one runs fast and goes round the circle in an hour. That is the minute hand.' },
      on_wrong2: { ru: 'Стрелки разные и по длине, и по скорости.', uz: "Strelkalar uzunligi bilan ham, tezligi bilan ham har xil.", en: 'The hands differ both in length and in speed.' },
      on_idk: { ru: 'Ничего. Сейчас проследим за обеими.', uz: "Hechqisi yo'q. Hozir ikkalasini kuzatamiz.", en: 'Never mind. Let us follow both of them now.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Следим за стрелками', uz: 'Strelkalarni kuzatamiz', en: 'We follow the hands' },
    task_line: 'один круг длинной стрелки',
    task_line_uz: "uzun strelkaning bir aylanasi",
    task_line_en: 'one circle of the long hand',
    step1: { ru: '60 минут', uz: '60 daqiqa', en: '60 minutes' },
    step1_cap: { ru: 'длинная обошла весь круг', uz: 'uzuni butun aylanani bosdi', en: 'the long one went round the whole circle' },
    step2: { ru: '1 час', uz: '1 soat', en: '1 hour' },
    step2_cap: { ru: 'короткая сдвинулась на одно деление', uz: 'kaltasi bir bo\'linmaga siljidi', en: 'the short one moved by one division' },
    res: { ru: '60 мин = 1 ч', uz: '60 daq = 1 soat', en: '60 min = 1 h' },
    btn1: { ru: 'Пустить длинную', uz: 'Uzunini yuritish', en: 'Start the long one' },
    btn2: { ru: 'Посмотреть короткую', uz: 'Kaltasiga qarash', en: 'Look at the short one' },
    done_text: { ru: 'Пока длинная обходит круг, короткая сдвигается на один час.', uz: "Uzuni aylanani bosib o'tguncha, kaltasi bir soatga siljiydi.", en: 'While the long hand goes round the circle, the short one moves on by one hour.' },
    audio: {
      ru: [
        'Проследим за стрелками часов.',
        'Длинная стрелка прошла весь круг. Это шестьдесят минут.',
        'За это время короткая сдвинулась всего на одно деление, то есть на один час. Значит в часе шестьдесят минут.'
      ],
      uz: [
        "Soat strelkalarini kuzatamiz.",
        "Uzun strelka butun aylanani bosib o'tdi. Bu oltmish daqiqa.",
        "Shu vaqtda kaltasi atigi bir bo'linmaga, ya'ni bir soatga siljidi. Demak bir soatda oltmish daqiqa bor."
      ],
      en: ['Let us follow the hands of the clock.', 'The long hand has gone round the whole circle. That is sixty minutes.', 'In that time the short one moved only by one division, that is by one hour. So there are sixty minutes in an hour.']
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Самая быстрая стрелка', uz: 'Eng tez strelka', en: 'The fastest hand' },
    capA: { ru: 'секундная обходит круг за минуту', uz: 'soniya strelkasi aylanani bir daqiqada bosadi', en: 'the second hand goes round the circle in a minute' },
    capB: { ru: '1 мин = 60 с', uz: '1 daqiqa = 60 soniya', en: '1 min = 60 s' },
    res: { ru: 'везде по 60', uz: 'hamma yerda 60 tadan', en: 'sixty everywhere' },
    btn1: { ru: 'Пустить секундную', uz: 'Soniya strelkasini yuritish', en: 'Start the second hand' },
    btn2: { ru: 'Сравнить мерки', uz: "O'lchovlarni solishtirish", en: 'Compare the measures' },
    done_text: { ru: 'И час, и минута делятся на шестьдесят частей. Это старинный счёт, не десятки.', uz: "Soat ham, daqiqa ham oltmishta qismga bo'linadi. Bu qadimgi hisob, o'nlik emas.", en: 'Both the hour and the minute are divided into sixty parts. That is an old way of counting, not tens.' },
    audio: {
      ru: [
        'У часов есть и третья стрелка, самая тонкая и быстрая.',
        'Она обходит круг за одну минуту, и делений на круге шестьдесят. Значит в минуте шестьдесят секунд.',
        'Заметь, время считают не десятками, а шестидесятками. Так считали ещё в древности, и мы считаем так до сих пор.'
      ],
      uz: [
        "Soatda uchinchi strelka ham bor, eng ingichka va tez.",
        "U aylanani bir daqiqada bosib o'tadi, aylanadagi bo'linma esa oltmishta. Demak bir daqiqada oltmish soniya bor.",
        "E'tibor bering, vaqt o'nlab emas, oltmishlab sanaladi. Qadimda ham shunday sanashgan va biz hozirgacha shunday sanaymiz."
      ],
      en: ['A clock has a third hand too, the thinnest and the fastest.', 'It goes round the circle in one minute, and there are sixty divisions on the circle. So there are sixty seconds in a minute.', 'Notice that time is counted not in tens but in sixties. People counted this way in ancient times, and we still count this way now.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Сколько минут в одном часе?', uz: 'Bir soatda necha daqiqa bor?', en: 'How many minutes are in one hour?' },
    opts: [
      { ru: '60', uz: '60', en: '60' },
      { ru: '100', uz: '100', en: '100' },
      { ru: '24', uz: '24', en: '24' },
      { ru: '30', uz: '30', en: '30' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сто это счёт десятками, а время считают шестидесятками.', uz: "Yuz bu o'nlab hisob, vaqt esa oltmishlab sanaladi.", en: 'A hundred is counting in tens, and time is counted in sixties.' },
      2: { ru: 'Двадцать четыре это часы в сутках, а не минуты в часе.', uz: "Yigirma to'rt bu sutkadagi soat, soatdagi daqiqa emas.", en: 'Twenty four is the hours in a day, not the minutes in an hour.' },
      3: { ru: 'Тридцать минут это половина часа.', uz: "O'ttiz daqiqa bu yarim soat.", en: 'Thirty minutes is half an hour.' }
    },
    on_correct: { ru: 'Верно. В часе шестьдесят минут.', uz: "To'g'ri. Bir soatda oltmish daqiqa bor.", en: 'Right. There are sixty minutes in an hour.' },
    rule_lines: {
      ru: ['1 ч = 60 мин', '1 мин = 60 с', 'время считают не десятками'],
      uz: ["1 soat = 60 daqiqa", "1 daqiqa = 60 soniya", "vaqt o'nlab sanalmaydi"],
      en: ['1 h = 60 min', '1 min = 60 s', 'time is not counted in tens']
    },
    rule_ex: { ru: '2 ч = 120 мин', uz: '2 soat = 120 daq', en: '2 h = 120 min' },
    rule_speech: { ru: 'В одном часе шестьдесят минут, в одной минуте шестьдесят секунд. Время считают не десятками, поэтому переводить надо умножением на шестьдесят.', uz: "Bir soatda oltmish daqiqa, bir daqiqada oltmish soniya bor. Vaqt o'nlab sanalmaydi, shuning uchun o'tkazish oltmishga ko'paytirish bilan bajariladi.", en: 'There are sixty minutes in one hour and sixty seconds in one minute. Time is not counted in tens, so to convert it you multiply by sixty.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы посмотрели все три стрелки.', uz: "Qoidani yig'amiz. Uchala strelkani ko'rdik.", en: 'Let us gather the rule. We have looked at all three hands.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Часы показывают 3 часа 15 минут. Где длинная стрелка?', uz: "Soat 3 soat 15 daqiqani ko'rsatyapti. Uzun strelka qayerda?", en: 'The clock shows 3 hours 15 minutes. Where is the long hand?' },
    fig_w: 3,
    fig_h: 3,
    opts: [
      { ru: 'на цифре 3', uz: '3 raqamida', en: 'on the figure 3' },
      { ru: 'на цифре 15', uz: '15 raqamida', en: 'on the figure 15' },
      { ru: 'на цифре 1', uz: '1 raqamida', en: 'on the figure 1' },
      { ru: 'на цифре 12', uz: '12 raqamida', en: 'on the figure 12' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'На циферблате всего двенадцать цифр, пятнадцати там нет.', uz: "Sifatblatda jami o'n ikkita raqam bor, o'n besh u yerda yo'q.", en: 'There are only twelve figures on a clock face, there is no fifteen there.' },
      2: { ru: 'На цифре один было бы пять минут.', uz: "Bir raqamida besh daqiqa bo'lardi.", en: 'On the figure one it would be five minutes.' },
      3: { ru: 'На двенадцати длинная стрелка стоит ровно в начале часа.', uz: "O'n ikkida uzun strelka soat boshida turadi.", en: 'On twelve the long hand stands exactly at the start of the hour.' }
    },
    audio: {
      intro: { ru: 'Посмотри на циферблат. Между соседними цифрами пять минут. Где стоит длинная стрелка в пятнадцать минут?', uz: "Sifatblatga qarang. Qo'shni raqamlar orasida besh daqiqa bor. O'n besh daqiqada uzun strelka qayerda turadi?", en: 'Look at the clock face. There are five minutes between neighbouring figures. Where does the long hand stand at fifteen minutes?' },
      on_correct: { ru: 'Верно. Три раза по пять, это пятнадцать минут.', uz: "To'g'ri. Beshtadan uch marta, bu o'n besh daqiqa.", en: 'Right. Three times five, that is fifteen minutes.' },
      on_wrong: { ru: 'Считай по пять минут от двенадцати.', uz: "O'n ikkidan besh daqiqadan sanang.", en: 'Count in fives of minutes from twelve.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи события по меркам', uz: "Voqealarni o'lchovlarga ajrating", en: 'Sort the events by measure' },
    bin_a: { ru: 'минуты', uz: 'daqiqa', en: 'minutes' },
    bin_b: { ru: 'часы', uz: 'soat', en: 'hours' },
    items: [
      { n: { ru: 'почистить зубы', uz: 'tish yuvish', en: 'brushing your teeth' }, a: true, hint: { ru: 'Это дело на пару минут.', uz: "Bu bir necha daqiqalik ish.", en: 'That is a job of a couple of minutes.' } },
      { n: { ru: 'ночной сон', uz: 'tungi uyqu', en: 'a night of sleep' }, a: false, hint: { ru: 'Сон меряют часами.', uz: "Uyqu soat bilan o'lchanadi.", en: 'Sleep is measured in hours.' } },
      { n: { ru: 'сварить яйцо', uz: 'tuxum pishirish', en: 'boiling an egg' }, a: true, hint: { ru: 'Хватает нескольких минут.', uz: "Bir necha daqiqa yetadi.", en: 'A few minutes are enough.' } },
      { n: { ru: 'школьный день', uz: 'maktab kuni', en: 'a school day' }, a: false, hint: { ru: 'День в школе длится часы.', uz: "Maktabdagi kun soatlab davom etadi.", en: 'A day at school lasts hours.' } }
    ],
    audio: {
      intro: { ru: 'Четыре дела. Отправь каждое к подходящей мерке.', uz: "To'rtta ish. Har birini mos o'lchoviga yuboring.", en: 'Four things to do. Send each one to the measure that suits it.' },
      on_correct: { ru: 'Всё на месте. Короткое меряют минутами, длинное часами.', uz: "Hammasi joyida. Qisqasi daqiqada, uzuni soatda o'lchanadi.", en: 'All in place. Short things are measured in minutes, long ones in hours.' },
      on_wrong: { ru: 'Прикинь, успеешь ли ты это за одну перемену.', uz: "Buni bitta tanaffusda ulgurasizmi, chamalang.", en: 'Think whether you could manage it in one break.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Сколько минут в 2 часах?', uz: '2 soatda necha daqiqa bor?', en: 'How many minutes are in 2 hours?' },
    opts: [
      { ru: '120', uz: '120', en: '120' },
      { ru: '200', uz: '200', en: '200' },
      { ru: '60', uz: '60', en: '60' },
      { ru: '100', uz: '100', en: '100' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двести это счёт сотнями, а в часе шестьдесят минут.', uz: "Ikki yuz bu yuzlab hisob, bir soatda esa oltmish daqiqa.", en: 'Two hundred is counting in hundreds, and there are sixty minutes in an hour.' },
      2: { ru: 'Шестьдесят это только один час.', uz: "Oltmish bu atigi bir soat.", en: 'Sixty is only one hour.' },
      3: { ru: 'Сто минут это больше часа, но меньше двух.', uz: "Yuz daqiqa bir soatdan ko'p, ikkidan kam.", en: 'A hundred minutes is more than an hour but less than two.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько минут в двух часах?', uz: "Tez savol. Ikki soatda necha daqiqa bor?", en: 'A quick question. How many minutes are in two hours?' },
      on_correct: { ru: 'Верно, два раза по шестьдесят.', uz: "To'g'ri, oltmishdan ikki marta.", en: 'Right, two times sixty.' },
      on_wrong: { ru: 'Умножай на шестьдесят, а не на сто.', uz: "Yuzga emas, oltmishga ko'paytiring.", en: 'Multiply by sixty, not by a hundred.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Урок начался в 9:00 и длился 45 минут', uz: "Dars 9:00 da boshlandi va 45 daqiqa davom etdi", en: 'The lesson began at 9:00 and lasted 45 minutes' },
    swap_line: { ru: 'урок 45 минут', uz: 'dars 45 daqiqa', en: 'the lesson is 45 minutes' },
    cells: [
      { head: { ru: 'длина урока', uz: 'dars uzunligi', en: 'the length of the lesson' }, label: { ru: 'минут', uz: 'daqiqa', en: 'minutes' }, ans: 45, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.', en: 'That number is given in the problem.' } },
      { head: { ru: 'до конца часа', uz: 'soat oxirigacha', en: 'to the end of the hour' }, label: '60 − 45', ans: 15, hint: { ru: 'В часе шестьдесят минут.', uz: "Bir soatda oltmish daqiqa bor.", en: 'There are sixty minutes in an hour.' } },
      { head: { ru: 'перемена', uz: 'tanaffus', en: 'the break' }, label: { ru: 'минут', uz: 'daqiqa', en: 'minutes' }, ans: 15, hint: { ru: 'Оставшееся время и есть перемена.', uz: "Qolgan vaqt tanaffusning o'zi.", en: 'The time that is left is the break.' } }
    ],
    check: '45 + 15 = 60',
    check_label: { ru: 'урок и перемена', uz: 'dars va tanaffus', en: 'the lesson and the break' },
    audio: {
      intro: { ru: 'Заполни три окна. Длина урока, остаток часа и перемена.', uz: "Uchta oynani to'ldiring. Dars uzunligi, soat qoldig'i va tanaffus.", en: 'Fill three windows. The length of the lesson, the rest of the hour and the break.' },
      on_correct: { ru: 'Сорок пять и пятнадцать дают ровно час.', uz: "Qirq besh va o'n besh rosa bir soat beradi.", en: 'Forty five and fifteen give exactly an hour.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Записали: 1 ч 20 мин = 120 мин. Где ошибка?', uz: "1 soat 20 daqiqa = 120 daqiqa deb yozilibdi. Xato qayerda?", en: 'They wrote: 1 h 20 min = 120 min. Where is the mistake?' },
    fig_line: { ru: '1 ч 20 мин', uz: '1 soat 20 daq', en: '1 h 20 min' },
    opts: [
      { ru: 'час взяли за 100 минут', uz: 'soat 100 daqiqa deb olingan', en: 'the hour was taken as 100 minutes' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'неверно сложили', uz: "noto'g'ri qo'shilgan", en: 'the adding was wrong' },
      { ru: 'перепутали минуты и секунды', uz: 'daqiqa va soniya chalkashtirilgan', en: 'minutes and seconds were mixed up' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сто плюс двадцать это сто двадцать, а в часе шестьдесят минут.', uz: "Yuz qo'shuv yigirma yuz yigirma, bir soatda esa oltmish daqiqa.", en: 'A hundred plus twenty is a hundred and twenty, and there are sixty minutes in an hour.' },
      2: { ru: 'Сложение верное, подвела мерка часа.', uz: "Qo'shish to'g'ri, soat o'lchovi aldadi.", en: 'The adding is right, it is the measure of the hour that let it down.' },
      3: { ru: 'Секунды тут вообще не участвуют.', uz: "Soniya bu yerda umuman qatnashmaydi.", en: 'Seconds do not come into it at all here.' }
    },
    audio: {
      intro: { ru: 'Кто-то посчитал час за сто минут. Найди ошибку.', uz: "Kimdir soatni yuz daqiqa deb hisoblabdi. Xatoni toping.", en: 'Someone counted the hour as a hundred minutes. Find the mistake.' },
      on_correct: { ru: 'Верно. Час это шестьдесят минут, значит выйдет восемьдесят.', uz: "To'g'ri. Soat bu oltmish daqiqa, demak sakson chiqadi.", en: 'Right. An hour is sixty minutes, so it comes out as eighty.' },
      on_wrong: { ru: 'Проверь, сколько минут в часе.', uz: "Bir soatda necha daqiqa borligini tekshiring.", en: 'Check how many minutes are in an hour.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит читает время на башне', uz: 'Bit minoradagi vaqtni o\'qiyapti', en: 'Bit is reading the time on the tower' },
    lines: ['короткая на 5, длинная на 12', 'Бит: значит двенадцать часов пять минут'],
    lines_uz: ["kaltasi 5 da, uzuni 12 da", "Bit: demak o'n ikki soat besh daqiqa"],
    lines_en: ['the short one on 5, the long one on 12', 'Bit: so it is twelve hours five minutes'],
    line_cap: { ru: 'Бит: читаю по длинной стрелке', uz: "Bit: uzun strelka bo'yicha o'qiyman", en: 'Bit: I read it by the long hand' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, часы показывает короткая', 'да, всё верно'], uz: ["yo'q, soatni kaltasi ko'rsatadi", 'ha, hammasi to\'g\'ri'], en: ['no, the hours are shown by the short one', 'yes, that is right'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Часы показывает короткая стрелка, а минуты длинная. Здесь пять часов ровно, а Бит поменял стрелки местами.', uz: "Ha. Soatni kalta strelka, daqiqani uzuni ko'rsatadi. Bu yerda rosa besh soat, Bit esa strelkalarni almashtirib yuboribdi.", en: 'Yes. The hours are shown by the short hand and the minutes by the long one. Here it is five hours exactly, and Bit swapped the hands round.' },
    trap_wrong: { ru: 'Вспомни, какая стрелка обходит круг за час.', uz: "Qaysi strelka aylanani bir soatda bosib o'tishini eslang.", en: 'Remember which hand goes round the circle in an hour.' },
    audio: {
      ru: [
        'Бит смотрит на часы башни.',
        'Короткая на пятёрке, длинная на двенадцати. Значит сейчас двенадцать часов и пять минут.',
        'Так ли это?'
      ],
      uz: [
        "Bit minora soatiga qarayapti.",
        "Kaltasi beshda, uzuni o'n ikkida. Demak hozir o'n ikki soatu besh daqiqa.",
        "Shundaymi?"
      ],
      en: ['Bit is looking at the tower clock.', 'The short one is on the five, the long one on the twelve. So it is twelve hours and five minutes now.', 'Is that so?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько минут в 3 часах?', uz: '3 soatda necha daqiqa bor?', en: 'How many minutes are in 3 hours?' },
    ans: 180,
    check: '3 · 60',
    check_label: { ru: 'часы в минуты', uz: 'soatdan daqiqaga', en: 'hours into minutes' },
    hint: { ru: 'Умножь три на шестьдесят.', uz: "Uchni oltmishga ko'paytiring.", en: 'Multiply three by sixty.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько минут в трёх часах?', uz: "Endi o'zingiz hisoblang. Uch soatda necha daqiqa bor?", en: 'Now count on your own. How many minutes are in three hours?' },
      on_correct: { ru: 'Сто восемьдесят минут.', uz: "Bir yuz sakson daqiqa.", en: 'A hundred and eighty minutes.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Мультфильм идёт 25 минут, прошло 10. Сколько минут осталось?', uz: "Multfilm 25 daqiqa, 10 daqiqa o'tdi. Necha daqiqa qoldi?", en: 'A cartoon runs for 25 minutes, 10 have passed. How many minutes are left?' },
    ans: 15,
    check: '25 − 10',
    check_label: { ru: 'мерка одна', uz: "o'lchov bitta", en: 'one measure' },
    hint: { ru: 'Из двадцати пяти вычти десять.', uz: "Yigirma beshdan o'nni ayiring.", en: 'Take ten away from twenty five.' },
    audio: {
      intro: { ru: 'Мультфильм идёт двадцать пять минут, прошло десять. Сколько осталось?', uz: "Multfilm yigirma besh daqiqa, o'n daqiqa o'tdi. Qancha qoldi?", en: 'A cartoon runs for twenty five minutes, ten have passed. How many are left?' },
      on_correct: { ru: 'Пятнадцать минут.', uz: "O'n besh daqiqa.", en: 'Fifteen minutes.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Расписание станции', uz: 'Bekat jadvali', en: 'The station timetable' },
    q: { ru: 'Поезд идёт 1 ч 40 мин. Сколько это минут и на сколько минут это больше часа?', uz: "Poyezd 1 soat 40 daqiqa yuradi. Bu necha daqiqa va bir soatdan necha daqiqa ko'p?", en: 'A train takes 1 h 40 min. How many minutes is that and how many minutes more than an hour?' },
    q_speech: { ru: 'поезд идёт один час сорок минут. Сколько это минут и на сколько это больше часа?', uz: "poyezd bir soatu qirq daqiqa yuradi. Bu necha daqiqa va bir soatdan nechaga ko'p?", en: 'a train takes one hour forty minutes. How many minutes is that and how much more than an hour is it?' },
    tbl_heads: [
      { ru: 'часы', uz: 'soat', en: 'hours' },
      { ru: 'минуты', uz: 'daqiqa', en: 'minutes' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: ['1', '40', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: 'перевести час в минуты', uz: 'soatni daqiqaga o\'tkazish', en: 'turn the hour into minutes' },
      { ru: 'сложить 1 и 40', uz: "1 va 40 ni qo'shish", en: 'add 1 and 40' },
      { ru: 'умножить 40 на 60', uz: "40 ni 60 ga ko'paytirish", en: 'multiply 40 by 60' },
      { ru: 'вычесть 40 из 60', uz: '60 dan 40 ni ayirish', en: 'subtract 40 from 60' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Час и минуты это разные мерки, их числа не складывают.', uz: "Soat va daqiqa har xil o'lchov, ularning soni qo'shilmaydi.", en: 'An hour and minutes are different measures, their numbers are not added.' },
      2: { ru: 'Умножать надо часы, а не минуты.', uz: "Daqiqani emas, soatni ko'paytirish kerak.", en: 'It is the hours that have to be multiplied, not the minutes.' },
      3: { ru: 'Вычитание понадобится, но во втором вопросе.', uz: "Ayirish kerak bo'ladi, lekin ikkinchi savolda.", en: 'Subtraction will be needed, but in the second question.' }
    },
    pick_ok: { ru: 'Верно. Сначала одна мерка, потом сравнение.', uz: "To'g'ri. Avval bitta o'lchov, keyin solishtirish.", en: 'Right. First one measure, then the comparison.' },
    step1_q: { ru: 'Сколько всего минут идёт поезд?', uz: 'Poyezd jami necha daqiqa yuradi?', en: 'How many minutes does the train take in all?' },
    ans1: 100,
    hint1: { ru: 'Шестьдесят минут часа плюс сорок.', uz: "Soatning oltmish daqiqasiga qirqni qo'shing.", en: 'Sixty minutes of the hour plus forty.' },
    step2_q: { ru: 'На сколько минут это больше часа?', uz: "Bu bir soatdan necha daqiqa ko'p?", en: 'How many minutes more than an hour is that?' },
    ans2: 40,
    hint2: { ru: 'Из ста вычти шестьдесят.', uz: "Yuzdan oltmishni ayiring.", en: 'Take sixty away from a hundred.' },
    check: { ru: '100 мин, на 40 больше', uz: "100 daq, 40 taga ko'p", en: '100 min, 40 more' },
    setup_audio: { ru: 'На станции считают время в пути. Посмотри на таблицу и реши, с чего начать.', uz: "Bekatda yo'l vaqti hisoblanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'At the station they are counting the travelling time. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Поезд идёт час сорок. Сколько это минут и на сколько больше часа?', uz: "Poyezd bir soatu qirq daqiqa yuradi. Bu necha daqiqa va bir soatdan nechaga ko'p?", en: 'A train takes an hour forty. How many minutes is that and how much more than an hour?' },
      on_correct: { ru: 'Сто минут, и это на сорок минут больше часа.', uz: "Yuz daqiqa, va bu bir soatdan qirq daqiqa ko'p.", en: 'A hundred minutes, and that is forty minutes more than an hour.' },
      on_wrong: { ru: 'Сначала переведи час в минуты.', uz: "Avval soatni daqiqaga o'tkazing.", en: 'First turn the hour into minutes.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Помни про шестьдесят', uz: 'Uchta topshiriq. Oltmishni yodda tuting', en: 'Three tasks. Remember the sixty' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько секунд в 2 минутах?', uz: '2 daqiqada necha soniya bor?', en: 'How many seconds are in 2 minutes?' },
        q_speech: { ru: 'сколько секунд в двух минутах?', uz: 'ikki daqiqada necha soniya bor?', en: 'how many seconds are in two minutes?' },
        ans: 120,
        hint: { ru: 'В минуте шестьдесят секунд.', uz: "Bir daqiqada oltmish soniya bor.", en: 'There are sixty seconds in a minute.' }
      },
      {
        kind: 'num',
        q: { ru: 'Урок 40 минут, перемена 10. Сколько минут вместе?', uz: 'Dars 40 daqiqa, tanaffus 10. Birgalikda necha daqiqa?', en: 'The lesson is 40 minutes, the break 10. How many minutes together?' },
        q_speech: { ru: 'урок сорок минут, перемена десять. Сколько минут вместе?', uz: 'dars qirq daqiqa, tanaffus o\'n. Birgalikda necha daqiqa?', en: 'the lesson is forty minutes, the break ten. How many minutes together?' },
        ans: 50,
        hint: { ru: 'Мерка одна, просто сложи.', uz: "O'lchov bitta, shunchaki qo'shing.", en: 'The measure is the same, just add them.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько минут в половине часа?', uz: 'Yarim soatda necha daqiqa bor?', en: 'How many minutes are in half an hour?' },
        q_speech: { ru: 'сколько минут в половине часа?', uz: 'yarim soatda necha daqiqa bor?', en: 'how many minutes are in half an hour?' },
        ans: 30,
        hint: { ru: 'Половина от шестидесяти.', uz: "Oltmishning yarmi.", en: 'Half of sixty.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Сутки бывают разной длины не только на разных планетах, но и у одной. На Юпитере сутки всего десять часов: он огромный, но крутится очень быстро. А на Венере сутки длиннее её года.',
      uz: "Sutka uzunligi turli sayyoralarda ham, bitta sayyorada ham har xil bo'ladi. Yupiterda sutka atigi o'n soat: u ulkan, lekin juda tez aylanadi. Venerada esa sutka uning yilidan uzun.",
      en: 'A day can be of different lengths not only on different planets but even for one of them. On Jupiter a day is only ten hours: it is huge, but it spins very fast. And on Venus a day is longer than its year.'
    },
    fact_audio: {
      ru: 'Вот что интересно. Сутки это один оборот планеты вокруг себя, и длятся они везде по-разному. Юпитер огромный, в него поместилось бы больше тысячи таких шаров, как Земля. А крутится он так быстро, что сутки там всего десять часов. Венера наоборот, поворачивается очень медленно, и сутки на ней выходят длиннее, чем её собственный год.',
      uz: "Mana qizig'i. Sutka bu sayyoraning o'z atrofida bir marta aylanishi va u hamma joyda har xil davom etadi. Yupiter ulkan, unga Yerdek mingdan ortiq shar sig'adi. Aylanishi esa shu qadar tezki, u yerda sutka atigi o'n soat. Venera aksincha, juda sekin aylanadi va undagi sutka o'z yilidan ham uzun chiqadi.",
      en: 'Here is something interesting. A day is one turn of a planet about itself, and everywhere it lasts differently. Jupiter is huge, more than a thousand balls like the Earth would fit inside it. And it spins so fast that a day there is only ten hours. Venus is the other way round, it turns very slowly, and a day on it comes out longer than its own year.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Считай шестидесятками.', uz: "Oxirida uchta topshiriq. Oltmishlab sanang.", en: 'Three tasks at the end. Count in sixties.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'В часе и в минуте по шестьдесят частей.', uz: "Soatda ham, daqiqada ham oltmishtadan qism bor.", en: 'An hour and a minute have sixty parts each.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Часы башни прочитаны!', uz: 'Minora soati o\'qildi!', en: 'The tower clock is read!' },
    cando: {
      ru: ['читаю время по двум стрелкам', 'перевожу часы в минуты', 'не считаю время десятками'],
      uz: ["ikki strelka bo'yicha vaqtni o'qiyman", "soatni daqiqaga o'tkazaman", "vaqtni o'nlab sanamayman"],
      en: ['I read the time by two hands', 'I turn hours into minutes', 'I do not count time in tens']
    },
    rule_recap: { ru: 'В часе 60 минут, в минуте 60 секунд. Часы показывает короткая стрелка.', uz: "Bir soatda 60 daqiqa, bir daqiqada 60 soniya. Soatni kalta strelka ko'rsatadi.", en: 'There are 60 minutes in an hour and 60 seconds in a minute. The hours are shown by the short hand.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 42: перевод мерок; урок 9: умножение', uz: "42-dars: o'lchov o'tkazish; 9-dars: ko'paytirish", en: 'lesson 42: converting measures; lesson 9: multiplication' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'единицы длины и их соотношения', uz: 'uzunlik birliklari va ularning bog\'lanishi', en: 'units of length and how they are linked' },
    audio: {
      ru: 'Часы башни прочитаны. Запомни главное. Часы на циферблате показывает короткая стрелка, минуты длинная, а секунды самая тонкая. В часе шестьдесят минут, и в минуте тоже шестьдесят секунд. Время считают не десятками, поэтому час это не сто минут, а шестьдесят, и об этом легко забыть. В следующий раз вернёмся к длине и посмотрим, как связаны сантиметр, дециметр и метр!',
      uz: "Minora soati o'qildi. Asosiysini eslab qoling. Sifatblatda soatni kalta strelka, daqiqani uzuni, soniyani esa eng ingichkasi ko'rsatadi. Bir soatda oltmish daqiqa, bir daqiqada ham oltmish soniya bor. Vaqt o'nlab sanalmaydi, shuning uchun soat yuz daqiqa emas, oltmish daqiqa, buni unutish oson. Keyingi safar uzunlikka qaytib, santimetr, detsimetr va metr qanday bog'langanini ko'ramiz!",
      en: 'The tower clock is read. Remember the main thing. On a clock face the hours are shown by the short hand, the minutes by the long one, and the seconds by the thinnest. There are sixty minutes in an hour, and sixty seconds in a minute too. Time is not counted in tens, so an hour is not a hundred minutes but sixty, and that is easy to forget. Next time we will come back to length and see how the centimetre, the decimetre and the metre are linked!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Проследим за стрелками.', uz: 'Strelkalarni kuzatamiz.', en: 'Let us follow the hands.' },
  s2:  { ru: 'Есть и третья стрелка.', uz: 'Uchinchi strelka ham bor.', en: 'There is a third hand as well.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай циферблат.', uz: "Sifatblatni o'qing.", en: 'Read the clock face.' },
  s5:  { ru: 'Разложи дела.', uz: 'Ishlarni ajrating.', en: 'Sort the things to do.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут час посчитали неверно.', uz: "Bu yerda soat noto'g'ri hisoblanibdi.", en: 'Here the hour was counted wrongly.' },
  s9:  { ru: 'А вот и Бит с чтением времени.', uz: "Mana Bit ham vaqtni o'qiyapti.", en: 'And here is Bit reading the time.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё одно время.', uz: 'Yana bitta vaqt.', en: 'And one more time.' },
  s12: { ru: 'Задача со станции.', uz: 'Bekatdan masala.', en: 'A task from the station.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Часы прочитаны. Стрелки на месте, и шестьдесят везде своё.',
  uz: "Soat o'qildi. Strelkalar joyida va oltmish hamma yerda o'z o'rnida.",
  en: 'The clock is read. The hands are in place, and sixty is everywhere in its own way.'
};

// --- SAHNA TUGUNI (D43): 1-DARSNING shahri, ustiga minora soati.
const ClockNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(200 120)">
      <circle r="42" fill="#FDF6E8" stroke="#8A7550" strokeWidth="3"/>
      <circle r="36" fill="none" stroke="#C6AE7E" strokeWidth="1"/>
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="0" y1="-34" x2="0" y2="-29" stroke="#8A7550" strokeWidth="2" transform={`rotate(${i * 30})`}/>
      ))}
      <line x1="0" y1="0" x2="0" y2="-20" stroke="#3A3530" strokeWidth="4" strokeLinecap="round" transform="rotate(150)"/>
      <line x1="0" y1="0" x2="0" y2="-30" stroke="#C06A2E" strokeWidth="2.6" strokeLinecap="round" transform="rotate(60)"/>
      <circle r="3.4" fill="#8A7550"/>
      <text x="0" y="58" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, '1 час = 60 минут', '1 soat = 60 daqiqa', '1 hour = 60 minutes')}</text>
    </g>
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
      <LumoCityBg fill/>
      <ClockNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): sifatblat, uzun strelka uchda.
const ClockFaceFig = () => (
  <svg viewBox="0 0 180 180" style={{ width: 'min(220px, 72%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <circle cx="90" cy="90" r="76" fill="#FDF6E8" stroke="#8A7550" strokeWidth="3"/>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      return (
        <text key={i} x={90 + Math.cos(a) * 58} y={90 + Math.sin(a) * 58 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{i === 0 ? 12 : i}</text>
      );
    })}
    <line x1="90" y1="90" x2="90" y2="46" stroke="#C06A2E" strokeWidth="4" strokeLinecap="round" transform="rotate(90 90 90)"/>
    <line x1="90" y1="90" x2="90" y2="58" stroke="#3A3530" strokeWidth="6" strokeLinecap="round" transform="rotate(90 90 90)"/>
    <circle cx="90" cy="90" r="5" fill="#8A7550"/>
  </svg>
);

// --- FACTCARD QAHRAMONI: Yupiter tez, Venera sekin aylanadi.
const SpinFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(64 52)">
      <circle r="30" fill="#E8C79A" stroke="#B08A5A" strokeWidth="2"/>
      <ellipse cx="0" cy="-10" rx="30" ry="5" fill="#C9A277" opacity="0.7"/>
      <ellipse cx="0" cy="6" rx="28" ry="5" fill="#C9A277" opacity="0.6"/>
      <ellipse cx="8" cy="14" rx="7" ry="4" fill="#C4563A" opacity="0.85"/>
      <path d="M-38 -22 a40 40 0 0 1 14 -12" fill="none" stroke="#C06A2E" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M-25 -35 l1 8 l8 -3" fill="none" stroke="#C06A2E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="0" y="46" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">10</text>
    </g>
    <g transform="translate(160 52)">
      <circle r="22" fill="#F0DDB8" stroke="#B08A5A" strokeWidth="2"/>
      <circle cx="-6" cy="-4" r="6" fill="#E0C89A" opacity="0.8"/>
      <path d="M-30 -16 a34 34 0 0 1 10 -9" fill="none" stroke="#7FA8BF" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4"/>
      <text x="0" y="38" textAnchor="middle" fontSize="9" fontWeight="800" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'медленно', 'sekin', 'slowly')}</text>
    </g>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: SpinFig,
  figs: { s4: <ClockFaceFig/> }
});
