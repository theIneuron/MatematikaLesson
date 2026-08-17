// ============================================================
// 6 КЛАСС, УРОК 45 «Работа с данными»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б13, первый урок. Три характеристики набора вводятся не списком
// определений, а как ответы на разные вопросы: что встречается чаще,
// что стоит в середине и сколько было бы у каждого при равном делении.
// Хук построен на выбросе: одно большое число утягивает среднее.
//
// Сцена — читательский уголок класса, таблица прочитанных книг.
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
  lessonId: 'div_6_45',
  lessonTitle: {
    ru: 'Работа с данными',
    uz: "Ma'lumotlar bilan ishlash",
    en: 'Working with data',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 kitoblar jadvali: 2 3 3 4 28
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 jadval va diagramma o'qish
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 uch xarakteristika
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: tartiblab, o'rtasini olamiz
  { id: 's_out',    type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 kenglik va bitta katta son
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: kitoblar
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: tartiblamasdan mediana
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_three',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 moda, mediana, o'rtacha x3
  { id: 's_read',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 kenglik va xulosa x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: moda yoki mediana
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: kitoblar
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Сколько книг за месяц', uz: 'Bir oyda nechta kitob', en: 'Books in a month' },
    lead: {
      ru: 'Пятеро ребят прочитали 2, 3, 3, 4 и 28 книг.',
      uz: "Beshta bola 2, 3, 3, 4 va 28 kitob o'qidi.",
      en: 'Five children read 2, 3, 3, 4 and 28 books.',
    },
    voice_a: { ru: 'Сардор: обычный ученик читает 8 книг.', uz: "Sardor: oddiy o'quvchi 8 kitob o'qiydi.", en: 'Sardor: a typical pupil reads 8 books.' },
    voice_b: { ru: 'Нигора: скорее 3.', uz: "Nigora: 3 ga o'xshaydi.", en: 'Nigora: more like 3.' },
    ask: { ru: 'Сколько книг у обычного ученика этой группы?', uz: "Bu guruhdagi oddiy o'quvchida nechta kitob?", en: 'How many books has a typical pupil here?' },
    options: [
      { ru: '8 книг', uz: '8 kitob', en: '8 books' },
      { ru: '3 книги', uz: '3 kitob', en: '3 books' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'В читательском уголке класса ведут таблицу. За месяц пятеро ребят прочитали две, три, три, четыре и двадцать восемь книг.',
          'Сардор сложил всё и разделил на пятерых: получилось восемь, и он говорит, что обычный ученик читает восемь книг. Нигора отвечает, что скорее три. Сколько книг у обычного ученика этой группы? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Sinf mutolaa burchagida jadval yuritiladi. Bir oyda beshta bola ikki, uch, uch, to'rt va yigirma sakkiz kitob o'qidi.",
          "Sardor hammasini qo'shib beshga bo'ldi: sakkiz chiqdi va u oddiy o'quvchi sakkiz kitob o'qiydi deydi. Nigora esa uchga o'xshaydi deb javob beradi. Bu guruhdagi oddiy o'quvchida nechta kitob? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'The class reading corner keeps a table. In a month five children read two, three, three, four and twenty eight books.',
          'Sardor added it all and divided by five: he got eight and says a typical pupil reads eight books. Nigora answers more like three. How many books has a typical pupil here? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Таблица и диаграмма', uz: 'Jadval va diagramma', en: 'Table and chart' },
    done: {
      ru: 'Таблица даёт точные числа, диаграмма — картину целиком. Одна строка данных, два способа показать.',
      uz: "Jadval aniq sonlarni, diagramma esa umumiy manzarani beradi. Bir qator ma'lumot, ikki xil ko'rsatish usuli.",
      en: 'A table gives exact numbers, a chart gives the whole picture. One row of data, two ways to show it.',
    },
    audio: {
      ru: [
        'Данные можно записать таблицей: имя и число рядом. Так видно точное значение у каждого.',
        'А можно нарисовать столбики: чем больше число, тем выше столбик. Так сразу видно, кто выделяется.',
        'Числа те же, но смотрятся по-разному. Сегодня научимся описывать такой набор несколькими числами.',
      ],
      uz: [
        "Ma'lumotlarni jadval bilan yozish mumkin: ism va son yonma-yon. Shunda har birining aniq qiymati ko'rinadi.",
        "Yoki ustunlar chizish mumkin: son qancha katta bo'lsa, ustun shuncha baland. Shunda kim ajralib turganini darrov ko'rinadi.",
        "Sonlar o'sha, lekin boshqacha ko'rinadi. Bugun bunday to'plamni bir necha son bilan tasvirlashni o'rganamiz.",
      ],
      en: [
        'Data can be written as a table: a name and a number side by side. That shows each exact value.',
        'Or you can draw bars: the bigger the number, the taller the bar. That shows at once who stands out.',
        'The numbers are the same but they read differently. Today we learn to describe such a set with a few numbers.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Три вопроса к набору', uz: "To'plamga uch savol", en: 'Three questions for a set' },
    lines: [
      { ru: 'что встречается чаще всего — мода', uz: "eng ko'p uchraydigani — moda", en: 'what appears most often: the mode' },
      { ru: 'что стоит в середине ряда — медиана', uz: "qatorning o'rtasidagi — mediana", en: 'what stands in the middle: the median' },
      { ru: 'сколько у каждого при равном делении — среднее', uz: "teng bo'linganda har birida qancha — o'rtacha", en: 'how much each would get: the mean' },
    ],
    done: {
      ru: 'Это три разных вопроса, поэтому и ответы разные. Ни одно из трёх чисел не «главнее» остальных: у каждого своя работа.',
      uz: "Bu uch xil savol, shuning uchun javoblar ham har xil. Uch sondan birortasi qolganidan «muhimroq» emas: har birining o'z ishi bor.",
      en: 'These are three different questions, so the answers differ. None of the three is “the main one”: each has its own job.',
    },
    audio: {
      ru: [
        'К набору чисел можно задать три разных вопроса. Первый: какое значение встречается чаще всего? Такое число называют модой.',
        'Второй: если выстроить все числа по порядку, какое окажется точно в середине? Это медиана.',
        'Третий: если сложить всё и разделить между всеми поровну, сколько достанется каждому? Это среднее арифметическое. Три вопроса разные, поэтому и три ответа могут не совпадать.',
      ],
      uz: [
        "Sonlar to'plamiga uch xil savol berish mumkin. Birinchisi: qaysi qiymat eng ko'p uchraydi? Bunday son moda deb ataladi.",
        "Ikkinchisi: barcha sonlarni tartib bilan tizsak, qaysi biri aynan o'rtada bo'ladi? Bu mediana.",
        "Uchinchisi: hammasini qo'shib, barchaga teng bo'lsak, har biriga qancha tegadi? Bu o'rtacha arifmetik. Uch savol har xil, shuning uchun uch javob ham mos kelmasligi mumkin.",
      ],
      en: [
        'You can ask a set of numbers three different questions. First: which value appears most often? That is the mode.',
        'Second: if you line all the numbers up in order, which one sits exactly in the middle? That is the median.',
        'Third: if you add everything and share it equally, how much does each get? That is the mean. Three different questions, so the three answers may well differ.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Сначала по порядку', uz: 'Avval tartib bilan', en: 'Order first' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    demo_lines: [
      { ru: 'ряд 4, 6, 6, 8, 11 уже по порядку', uz: '4, 6, 6, 8, 11 qatori allaqachon tartibda', en: 'the row 4, 6, 6, 8, 11 is already in order' },
      { ru: 'мода 6: встречается дважды', uz: 'moda 6: ikki marta uchraydi', en: 'mode 6: it appears twice' },
      { ru: 'медиана 6, среднее 35 : 5 = 7', uz: "mediana 6, o'rtacha 35 : 5 = 7", en: 'median 6, mean 35 : 5 = 7' },
    ],
    demo_note: {
      ru: 'Медиану ищут только в упорядоченном ряду. Среднее считают по сумме, порядок для него не важен.',
      uz: "Mediana faqat tartiblangan qatorda topiladi. O'rtacha yig'indi bilan hisoblanadi, unga tartib muhim emas.",
      en: 'The median needs an ordered row. The mean comes from the sum, and order does not matter for it.',
    },
    play_ask: { ru: 'Ряд 3, 9, 5, 7, 5. Чему равна медиана?', uz: '3, 9, 5, 7, 5 qatori. Mediana nechaga teng?', en: 'The row 3, 9, 5, 7, 5. The median?' },
    play_opts: ['5', '7', '5,8'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. По порядку: 3, 5, 5, 7, 9 — в середине 5.',
      uz: "To'g'ri. Tartib bilan: 3, 5, 5, 7, 9 — o'rtada 5.",
      en: 'Right. In order: 3, 5, 5, 7, 9 with 5 in the middle.',
    },
    play_wrong: [
      null,
      { ru: 'Это середина неупорядоченного ряда: сначала расставьте числа.', uz: "Bu tartiblanmagan qatorning o'rtasi: avval sonlarni tartiblang.", en: 'That is the middle of the unsorted row: sort first.' },
      { ru: 'Это среднее арифметическое, а спрашивали медиану.', uz: "Bu o'rtacha arifmetik, so'ralgani esa mediana.", en: 'That is the mean, but the median was asked.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу порядок работы на ряде четыре, шесть, шесть, восемь, одиннадцать.',
        uz: "Ish tartibini to'rt, olti, olti, sakkiz, o'n bir qatorida ko'rsataman.",
        en: 'I will show the working order on the row four, six, six, eight, eleven.',
      },
      demo: {
        ru: 'Ряд уже выстроен по возрастанию. Шестёрка встречается два раза, значит мода шесть. Всего пять чисел, третье по счёту стоит в середине, и это тоже шесть: медиана шесть. Теперь сложим всё: тридцать пять, разделим на пять, получится семь. Это среднее.',
        uz: "Qator allaqachon o'sish bo'yicha tizilgan. Olti ikki marta uchraydi, demak moda olti. Jami beshta son, hisob bo'yicha uchinchisi o'rtada turadi va u ham olti: mediana olti. Endi hammasini qo'shamiz: o'ttiz besh, beshga bo'lamiz, yetti chiqadi. Bu o'rtacha.",
        en: 'The row is already in increasing order. Six appears twice, so the mode is six. There are five numbers and the third sits in the middle, also six: median six. Now add them all: thirty five, divide by five, that gives seven. That is the mean.',
      },
      play: {
        ru: 'Теперь ваша очередь. Ряд три, девять, пять, семь, пять. Чему равна медиана?',
        uz: "Endi sizning navbatingiz. Uch, to'qqiz, besh, yetti, besh qatori. Mediana nechaga teng?",
        en: 'Now it is your turn. The row three, nine, five, seven, five. What is the median?',
      },
      ok: {
        ru: 'Верно. После упорядочивания в середине оказалась пятёрка.',
        uz: "To'g'ri. Tartiblagandan keyin o'rtada besh turdi.",
        en: 'Right. After sorting, five sits in the middle.',
      },
      wrong: {
        ru: 'Сначала выстройте числа по возрастанию, а потом берите то, что в середине.',
        uz: "Avval sonlarni o'sish bo'yicha tizing, keyin o'rtadagisini oling.",
        en: 'Sort the numbers first, then take the middle one.',
      },
    },
  },

  s_out: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Одно большое число', uz: 'Bitta katta son', en: 'One big number' },
    lines: [
      { ru: 'размах: наибольшее минус наименьшее', uz: 'kenglik: eng kattadan eng kichigi ayiriladi', en: 'range: largest minus smallest' },
      { ru: '28 − 2 = 26: разброс огромный', uz: '28 − 2 = 26: tarqalish juda katta', en: '28 − 2 = 26: a huge spread' },
      { ru: 'среднее выросло до 8, медиана осталась 3', uz: "o'rtacha 8 gacha oshdi, mediana 3 bo'lib qoldi", en: 'the mean rose to 8, the median stayed 3' },
    ],
    done: {
      ru: 'Среднее чувствительно к одному выбросу, медиана — нет. Когда разброс большой, о «типичном» лучше говорить медианой.',
      uz: "O'rtacha bitta chetlashishga sezgir, mediana esa yo'q. Tarqalish katta bo'lganda «tipik» haqida mediana bilan gapirish yaxshiroq.",
      en: 'The mean is sensitive to one outlier, the median is not. With a big spread, the median describes the typical value better.',
    },
    audio: {
      ru: [
        'Есть ещё одно полезное число: размах. Это разность между наибольшим и наименьшим значением. У нас двадцать восемь минус два, то есть двадцать шесть. Разброс огромный.',
        'Посмотрим, что делает одно большое число. Уберём двадцать восемь: среднее у четырёх остальных станет три. Вернём его: среднее подскочит до восьми, хотя ни один ученик восьми книг не читал.',
        'А медиана не шевельнулась: она как стояла на трёх, так и стоит. Поэтому, когда разброс большой, типичное значение честнее описывать медианой.',
      ],
      uz: [
        "Yana bir foydali son bor: kenglik. Bu eng katta va eng kichik qiymat orasidagi ayirma. Bizda yigirma sakkiz minus ikki, ya'ni yigirma olti. Tarqalish juda katta.",
        "Bitta katta son nima qilishini ko'ramiz. Yigirma sakkizni olib tashlaymiz: qolgan to'rttasining o'rtachasi uch bo'ladi. Uni qaytaramiz: o'rtacha sakkizgacha ko'tariladi, holbuki hech bir o'quvchi sakkiz kitob o'qimagan.",
        "Mediana esa joyidan jilmadi: uchda turgan edi, shundayligicha qoldi. Shuning uchun tarqalish katta bo'lganda tipik qiymatni mediana bilan tasvirlash halolroq.",
      ],
      en: [
        'There is one more useful number: the range. It is the difference between the largest and the smallest value. Ours is twenty eight minus two, that is twenty six. A huge spread.',
        'See what one big number does. Remove the twenty eight: the mean of the other four becomes three. Put it back: the mean jumps to eight, though no pupil read eight books.',
        'The median did not budge: it stood at three and it stays there. So with a big spread the typical value is described more honestly by the median.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Разбираем таблицу', uz: 'Jadvalni tahlil qilamiz', en: 'Reading the table' },
    lead: { ru: 'Данные: 2, 3, 3, 4, 28.', uz: "Ma'lumotlar: 2, 3, 3, 4, 28.", en: 'Data: 2, 3, 3, 4, 28.' },
    steps: [
      { ru: 'мода 3, медиана 3', uz: 'moda 3, mediana 3', en: 'mode 3, median 3' },
      { ru: 'среднее: 40 : 5 = 8', uz: "o'rtacha: 40 : 5 = 8", en: 'mean: 40 : 5 = 8' },
      { ru: 'размах 26 — виноват один выброс', uz: 'kenglik 26 — bitta chetlashish aybdor', en: 'range 26: one outlier is to blame' },
    ],
    done: {
      ru: 'Обычный ученик группы прочитал 3 книги: так говорят и мода, и медиана. Среднее 8 верно посчитано, но никого не описывает. Права была Нигора.',
      uz: "Guruhning oddiy o'quvchisi 3 kitob o'qigan: moda ham, mediana ham shuni aytadi. O'rtacha 8 to'g'ri hisoblangan, lekin hech kimni tasvirlamaydi. Nigora haq edi.",
      en: 'A typical pupil read 3 books: both the mode and the median say so. The mean of 8 is computed correctly but describes nobody. Nigora was right.',
    },
    audio: {
      ru: [
        'Решаем вместе. Выстроим данные по порядку: два, три, три, четыре, двадцать восемь. Тройка встречается дважды, значит мода три. В середине пяти чисел стоит третье, тоже три: медиана три.',
        'Считаем среднее: сумма сорок, делим на пять, получается восемь. Сардор посчитал правильно.',
        'Но посмотрите на данные: четверо прочитали от двух до четырёх книг, и ни один не прочитал восемь. Среднее утянуло одно большое число. Обычный ученик группы прочитал три книги. Права была Нигора.',
      ],
      uz: [
        "Birga yechamiz. Ma'lumotlarni tartib bilan tizamiz: ikki, uch, uch, to'rt, yigirma sakkiz. Uch ikki marta uchraydi, demak moda uch. Beshta sonning o'rtasida uchinchisi turadi, u ham uch: mediana uch.",
        "O'rtachani hisoblaymiz: yig'indi qirq, beshga bo'lamiz, sakkiz chiqadi. Sardor to'g'ri hisoblagan.",
        "Ammo ma'lumotlarga qarang: to'rttasi ikkitadan to'rttagacha kitob o'qigan va birortasi ham sakkiz o'qimagan. O'rtachani bitta katta son tortib ketdi. Guruhning oddiy o'quvchisi uch kitob o'qigan. Nigora haq edi.",
      ],
      en: [
        'Let us solve it together. Sort the data: two, three, three, four, twenty eight. Three appears twice, so the mode is three. The third of five numbers sits in the middle, also three: median three.',
        'Compute the mean: the sum is forty, divide by five, that gives eight. Sardor computed it correctly.',
        'But look at the data: four pupils read between two and four books and none read eight. One big number pulled the mean up. A typical pupil read three books. Nigora was right.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Медиана требует порядка', uz: 'Mediana tartib talab qiladi', en: 'The median needs order' },
    bad_line: { ru: 'ошибка: в ряду 3, 9, 5 медиана 9', uz: 'xato: 3, 9, 5 qatorida mediana 9', en: 'mistake: in 3, 9, 5 the median is 9' },
    good_line: { ru: 'верно: 3, 5, 9 — медиана 5', uz: "to'g'ri: 3, 5, 9 — mediana 5", en: 'right: 3, 5, 9 gives median 5' },
    warn_line: { ru: 'ошибка: назвали среднее «самым частым»', uz: "xato: o'rtacha «eng ko'p uchraydigan» deb atalgan", en: 'mistake: calling the mean “the most frequent”' },
    done: {
      ru: 'Медиану берут в упорядоченном ряду, моду — по повторам, среднее — по сумме. Три разных вопроса, три разных действия.',
      uz: "Mediana tartiblangan qatordan, moda takrorlar bo'yicha, o'rtacha yig'indi bo'yicha olinadi. Uch xil savol, uch xil amal.",
      en: 'The median comes from an ordered row, the mode from repeats, the mean from the sum. Three questions, three actions.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. Берут середину ряда как он записан, не расставив числа по возрастанию. В ряду три, девять, пять посередине стоит девятка, но медиана здесь пять.',
        'Правило простое: сначала упорядочить, потом брать середину.',
        'Вторая ошибка в словах. Среднее это результат деления суммы, а не самое частое значение. Самое частое это мода, и она может быть совсем другим числом.',
      ],
      uz: [
        "Darsning asosiy xatosi. Sonlarni o'sish bo'yicha tizmasdan, qator yozilganidek o'rtasini olishadi. Uch, to'qqiz, besh qatorida o'rtada to'qqiz turadi, mediana esa bu yerda besh.",
        "Qoida oddiy: avval tartiblash, keyin o'rtasini olish.",
        "Ikkinchi xato so'zlarda. O'rtacha yig'indini bo'lish natijasi, eng ko'p uchraydigan qiymat emas. Eng ko'p uchraydigani moda va u butunlay boshqa son bo'lishi mumkin.",
      ],
      en: [
        'The main mistake here. People take the middle of the row as written, without sorting. In three, nine, five the middle is nine, but the median is five.',
        'The rule is simple: sort first, then take the middle.',
        'The second mistake is in words. The mean is the result of dividing a sum, not the most frequent value. The most frequent is the mode, and it can be a completely different number.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Четыре числа о наборе', uz: "To'plam haqida to'rt son", en: 'Four numbers about a set' },
    rule_1: {
      ru: 'Мода — значение, которое встречается чаще всего. Медиана — середина упорядоченного ряда. Среднее арифметическое — сумма, делённая на количество. Размах — наибольшее минус наименьшее.',
      uz: "Moda — eng ko'p uchraydigan qiymat. Mediana — tartiblangan qatorning o'rtasi. O'rtacha arifmetik — yig'indini songa bo'lish. Kenglik — eng kattadan eng kichigi ayirilgani.",
      en: 'The mode is the most frequent value. The median is the middle of an ordered row. The mean is the sum divided by the count. The range is largest minus smallest.',
    },
    rule_2: {
      ru: 'Одно очень большое значение сильно тянет среднее, а медиану почти не задевает. Книги: мода и медиана 3, среднее 8. Права была Нигора.',
      uz: "Bitta juda katta qiymat o'rtachani kuchli tortadi, medianaga esa deyarli tegmaydi. Kitoblar: moda va mediana 3, o'rtacha 8. Nigora haq edi.",
      en: 'One very large value pulls the mean strongly and barely touches the median. The books: mode and median 3, mean 8. Nigora was right.',
    },
    audio: {
      ru: 'Запомним правило. Мода это значение, которое встречается чаще всего. Медиана это то, что стоит в середине упорядоченного ряда, поэтому сначала числа расставляют по возрастанию. Среднее арифметическое это сумма, делённая на количество. Размах это разность наибольшего и наименьшего. Одно очень большое значение сильно тянет среднее, а медиану почти не задевает. Вернёмся к книгам. Мода и медиана равны трём, а среднее восьми. Обычный ученик прочитал три книги. Права была Нигора.',
      uz: "Qoidani eslab qolamiz. Moda bu eng ko'p uchraydigan qiymat. Mediana bu tartiblangan qatorning o'rtasida turgani, shuning uchun avval sonlar o'sish bo'yicha tiziladi. O'rtacha arifmetik bu yig'indini songa bo'lgani. Kenglik bu eng katta va eng kichikning ayirmasi. Bitta juda katta qiymat o'rtachani kuchli tortadi, medianaga esa deyarli tegmaydi. Kitoblarga qaytamiz. Moda va mediana uchga, o'rtacha esa sakkizga teng. Oddiy o'quvchi uch kitob o'qigan. Nigora haq edi.",
      en: 'Let us remember the rule. The mode is the most frequent value. The median is what stands in the middle of an ordered row, so sort the numbers first. The mean is the sum divided by the count. The range is largest minus smallest. One very large value pulls the mean strongly and barely touches the median. Back to the books. Mode and median are three, the mean is eight. A typical pupil read three books. Nigora was right.',
    },
  },

  s_three: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Мода, медиана, среднее', uz: "Moda, mediana, o'rtacha", en: 'Mode, median, mean' },
    lead: { ru: 'Ряд: 2, 4, 4, 6, 9.', uz: 'Qator: 2, 4, 4, 6, 9.', en: 'The row: 2, 4, 4, 6, 9.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Чему равна мода?', uz: 'Moda nechaga teng?', en: 'What is the mode?' },
        opts: ['4', '5', '9'],
        correct: 0,
        ok: { ru: 'Верно. Четвёрка встречается дважды.', uz: "To'g'ri. To'rt ikki marta uchraydi.", en: 'Right. Four appears twice.' },
        wrong: [
          null,
          { ru: 'Это среднее, а мода — самое частое значение.', uz: "Bu o'rtacha, moda esa eng ko'p uchraydigan qiymat.", en: 'That is the mean; the mode is the most frequent.' },
          { ru: 'Девятка встречается только один раз.', uz: "To'qqiz faqat bir marta uchraydi.", en: 'Nine appears only once.' },
        ],
      },
      {
        q: { ru: 'Чему равна медиана?', uz: 'Mediana nechaga teng?', en: 'What is the median?' },
        opts: ['4', '5', '6'],
        correct: 0,
        ok: { ru: 'Верно. Третье число из пяти это 4.', uz: "To'g'ri. Beshta sondan uchinchisi 4.", en: 'Right. The third of five numbers is 4.' },
        wrong: [
          null,
          { ru: 'Это среднее арифметическое.', uz: "Bu o'rtacha arifmetik.", en: 'That is the mean.' },
          { ru: 'Шестёрка стоит четвёртой, а не третьей.', uz: "Olti to'rtinchi turadi, uchinchi emas.", en: 'Six is fourth, not third.' },
        ],
      },
      {
        q: { ru: 'Чему равно среднее арифметическое?', uz: "O'rtacha arifmetik nechaga teng?", en: 'What is the mean?' },
        opts: ['5', '4', '25'],
        correct: 0,
        ok: { ru: 'Верно. 25 : 5 = 5.', uz: "To'g'ri. 25 : 5 = 5.", en: 'Right. 25 : 5 = 5.' },
        wrong: [
          null,
          { ru: 'Это мода и медиана, а среднее считают по сумме.', uz: "Bu moda va mediana, o'rtacha esa yig'indi bilan hisoblanadi.", en: 'That is the mode and median; the mean uses the sum.' },
          { ru: 'Это сумма, её ещё нужно разделить на 5.', uz: "Bu yig'indi, uni yana 5 ga bo'lish kerak.", en: 'That is the sum; divide it by 5.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на три характеристики. Ряд два, четыре, четыре, шесть, девять.',
        uz: "Uch xarakteristika mashqi. Qator ikki, to'rt, to'rt, olti, to'qqiz.",
        en: 'Practice on the three measures. The row is two, four, four, six, nine.',
      },
    },
  },

  s_read: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Размах и выводы', uz: 'Kenglik va xulosalar', en: 'Range and conclusions' },
    lead: { ru: 'Смотри не только на числа, но и на разброс.', uz: 'Faqat sonlarga emas, tarqalishga ham qarang.', en: 'Look at the spread, not only the numbers.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Ряд 5, 7, 7, 9, 30. Чему равен размах?', uz: '5, 7, 7, 9, 30 qatori. Kenglik nechaga teng?', en: 'The row 5, 7, 7, 9, 30. The range?' },
        opts: ['25', '30', '7'],
        correct: 0,
        ok: { ru: 'Верно. 30 − 5 = 25.', uz: "To'g'ri. 30 − 5 = 25.", en: 'Right. 30 − 5 = 25.' },
        wrong: [
          null,
          { ru: 'Это наибольшее значение, а размах — разность.', uz: 'Bu eng katta qiymat, kenglik esa ayirma.', en: 'That is the largest value; the range is a difference.' },
          { ru: 'Это мода, а не размах.', uz: 'Bu moda, kenglik emas.', en: 'That is the mode, not the range.' },
        ],
      },
      {
        q: { ru: 'В том же ряду что описывает группу честнее?', uz: "Shu qatorda guruhni nima halolroq tasvirlaydi?", en: 'In that row, what describes the group better?' },
        opts: [
          { ru: 'медиана 7', uz: 'mediana 7', en: 'the median 7' },
          { ru: 'среднее 11,6', uz: "o'rtacha 11,6", en: 'the mean 11.6' },
          { ru: 'размах 25', uz: 'kenglik 25', en: 'the range 25' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Четверо около семи, а среднее утянуло число 30.', uz: "To'g'ri. To'rttasi yetti atrofida, o'rtachani esa 30 tortdi.", en: 'Right. Four are near seven; the 30 pulled the mean.' },
        wrong: [
          null,
          { ru: 'Такого значения нет ни у кого в группе.', uz: "Bunday qiymat guruhda hech kimda yo'q.", en: 'Nobody in the group has that value.' },
          { ru: 'Размах говорит о разбросе, а не о типичном.', uz: 'Kenglik tarqalish haqida, tipik haqida emas.', en: 'The range is about spread, not the typical value.' },
        ],
      },
      {
        q: { ru: 'Ряд 6, 6, 6, 6. Чему равен размах?', uz: '6, 6, 6, 6 qatori. Kenglik nechaga teng?', en: 'The row 6, 6, 6, 6. The range?' },
        opts: ['0', '6', '24'],
        correct: 0,
        ok: { ru: 'Верно. Наибольшее и наименьшее совпали.', uz: "To'g'ri. Eng katta va eng kichik mos keldi.", en: 'Right. Largest and smallest coincide.' },
        wrong: [
          null,
          { ru: 'Это само значение, а размах — разность.', uz: "Bu qiymatning o'zi, kenglik esa ayirma.", en: 'That is the value itself; the range is a difference.' },
          { ru: 'Это сумма всех значений.', uz: "Bu barcha qiymatlar yig'indisi.", en: 'That is the sum of all values.' },
        ],
      },
      {
        q: { ru: 'Что сильнее меняется от одного огромного значения?', uz: "Bitta juda katta qiymatdan nima kuchliroq o'zgaradi?", en: 'What changes most from one huge value?' },
        opts: [
          { ru: 'среднее арифметическое', uz: "o'rtacha arifmetik", en: 'the mean' },
          { ru: 'медиана', uz: 'mediana', en: 'the median' },
          { ru: 'мода', uz: 'moda', en: 'the mode' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Оно считается по сумме, а сумма растёт.', uz: "To'g'ri. U yig'indi bilan hisoblanadi, yig'indi esa o'sadi.", en: 'Right. It uses the sum, and the sum grows.' },
        wrong: [
          null,
          { ru: 'Медиана смотрит на середину, а не на величину.', uz: "Mediana o'rtaga qaraydi, kattalikka emas.", en: 'The median looks at the middle, not the size.' },
          { ru: 'Мода смотрит на повторы.', uz: 'Moda takrorlarga qaraydi.', en: 'The mode looks at repeats.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на размах и выводы. Помните, что среднее чувствительно к выбросам.',
        uz: "Kenglik va xulosalar mashqi. O'rtacha chetlashishlarga sezgir ekanini yodda tuting.",
        en: 'Practice on range and conclusions. Remember the mean is sensitive to outliers.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Мода или медиана', uz: 'Moda yoki mediana', en: 'Mode or median' },
    lead: { ru: 'Смотри, о чём именно говорит описание.', uz: "Ta'rif aynan nima haqida ekaniga qarang.", en: 'See what each description is about.' },
    bin_a: { ru: 'Это мода', uz: 'Bu moda', en: 'The mode' },
    bin_b: { ru: 'Это медиана', uz: 'Bu mediana', en: 'The median' },
    cards: [
      { label: { ru: 'встречается чаще всего', uz: "eng ko'p uchraydi", en: 'appears most often' }, bin: 'a' },
      { label: { ru: 'самый популярный размер', uz: "eng ommabop o'lcham", en: 'the most popular size' }, bin: 'a' },
      { label: { ru: 'повторяется больше других', uz: "boshqalardan ko'p takrorlanadi", en: 'repeats more than others' }, bin: 'a' },
      { label: { ru: 'стоит в середине ряда', uz: "qatorning o'rtasida turadi", en: 'stands in the middle of the row' }, bin: 'b' },
      { label: { ru: 'делит ряд на две половины', uz: "qatorni ikki yarmiga bo'ladi", en: 'splits the row in halves' }, bin: 'b' },
      { label: { ru: 'нужно сначала упорядочить', uz: 'avval tartiblash kerak', en: 'needs sorting first' }, bin: 'b' },
    ],
    hint: {
      ru: 'Мода про повторы, медиана про место в упорядоченном ряду.',
      uz: "Moda takrorlar haqida, mediana tartiblangan qatordagi o'rin haqida.",
      en: 'The mode is about repeats, the median about position in a sorted row.',
    },
    correct_text: {
      ru: 'Верно. Разные вопросы к одному и тому же набору.',
      uz: "To'g'ri. Bitta to'plamga har xil savollar.",
      en: 'Right. Different questions about the same set.',
    },
    audio: {
      intro: {
        ru: 'Разложите описания по двум корзинам. Мода про повторы, медиана про середину.',
        uz: "Ta'riflarni ikki savatga ajrating. Moda takrorlar, mediana o'rta haqida.",
        en: 'Sort the descriptions into two baskets. Mode is repeats, median is the middle.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Это про повторы или про середину?', uz: "Bu yerga emas. Bu takrorlar haqidami yoki o'rta haqidami?", en: 'Not here. Repeats or the middle?' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сардор: «В ряду 8, 2, 5 медиана 2». Проверь.', uz: "Sardor: «8, 2, 5 qatorida mediana 2». Tekshiring.", en: 'Sardor: “In 8, 2, 5 the median is 2.” Check it.' },
        opts: [
          { ru: 'Нет: по порядку 2, 5, 8, медиана 5', uz: "Yo'q: tartib bilan 2, 5, 8, mediana 5", en: 'No: sorted 2, 5, 8, the median is 5' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, медиана 8', uz: "Yo'q, mediana 8", en: 'No, the median is 8' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Медиану ищут только после упорядочивания.', uz: "To'g'ri. Mediana faqat tartiblagandan keyin topiladi.", en: 'Right. The median comes after sorting.' },
        wrong: [
          null,
          { ru: 'Двойка стоит второй только в незаписанном порядке.', uz: 'Ikki faqat tartiblanmagan yozuvda ikkinchi turadi.', en: 'Two is second only in the unsorted row.' },
          { ru: 'Восьмёрка наибольшая, а не серединная.', uz: "Sakkiz eng katta, o'rtadagi emas.", en: 'Eight is the largest, not the middle.' },
        ],
      },
      {
        q: { ru: 'Нигора: «Среднее 8, значит кто-то прочитал 8 книг». Проверь.', uz: "Nigora: «O'rtacha 8, demak kimdir 8 kitob o'qigan». Tekshiring.", en: 'Nigora: “The mean is 8, so someone read 8 books.” Check it.' },
        opts: [
          { ru: 'Нет: среднее может не совпасть ни с одним значением', uz: "Yo'q: o'rtacha birorta qiymatga ham mos kelmasligi mumkin", en: 'No: the mean may match no value at all' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, среднее всегда равно медиане', uz: "Yo'q, o'rtacha doim medianaga teng", en: 'No, the mean always equals the median' },
        ],
        correct: 0,
        ok: { ru: 'Верно. В нашем наборе восьмёрки нет вовсе.', uz: "To'g'ri. Bizning to'plamda sakkiz umuman yo'q.", en: 'Right. There is no eight in our set at all.' },
        wrong: [
          null,
          { ru: 'Среднее это результат деления, а не чьё-то значение.', uz: "O'rtacha bo'lish natijasi, kimningdir qiymati emas.", en: 'The mean is a quotient, not somebody’s value.' },
          { ru: 'В нашем наборе среднее 8, а медиана 3.', uz: "Bizning to'plamda o'rtacha 8, mediana esa 3.", en: 'In our set the mean is 8 and the median 3.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в порядке чисел, и в понимании среднего.',
        uz: "Birovning yechimini tekshiring. Xato sonlar tartibida ham, o'rtachani tushunishda ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the order and in understanding the mean.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Читательский дневник', uz: 'Mutolaa daftari', en: 'The reading log' },
    lead: { ru: 'Данные группы: 2, 3, 3, 4, 28 книг.', uz: "Guruh ma'lumotlari: 2, 3, 3, 4, 28 kitob.", en: 'The group data: 2, 3, 3, 4, 28 books.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Чему равна медиана этого набора?', uz: "Bu to'plamning medianasi nechaga teng?", en: 'The median of this set?' },
        opts: ['3', '8', '4'],
        correct: 0,
        ok: { ru: 'Верно. Ряд уже по порядку, в середине 3.', uz: "To'g'ri. Qator allaqachon tartibda, o'rtada 3.", en: 'Right. The row is sorted and 3 is in the middle.' },
        wrong: [
          null,
          { ru: 'Это среднее арифметическое.', uz: "Bu o'rtacha arifmetik.", en: 'That is the mean.' },
          { ru: 'Четвёрка стоит четвёртой из пяти.', uz: "To'rt beshtadan to'rtinchi turadi.", en: 'Four is fourth of five.' },
        ],
      },
      {
        q: { ru: 'Если убрать 28, каким станет среднее?', uz: "28 olib tashlansa, o'rtacha qanday bo'ladi?", en: 'Remove the 28: what is the mean?' },
        opts: ['3', '8', '4'],
        correct: 0,
        ok: { ru: 'Верно. 12 : 4 = 3, и оно совпало с медианой.', uz: "To'g'ri. 12 : 4 = 3 va u mediana bilan mos keldi.", en: 'Right. 12 : 4 = 3, matching the median.' },
        wrong: [
          null,
          { ru: 'Восемь было со выбросом, а теперь его нет.', uz: "Sakkiz chetlashish bilan edi, endi u yo'q.", en: 'Eight came with the outlier, which is gone.' },
          { ru: 'Сумма четырёх чисел 12, а не 16.', uz: "To'rt sonning yig'indisi 12, 16 emas.", en: 'The sum of four numbers is 12, not 16.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про читательский дневник. Данные группы: две, три, три, четыре и двадцать восемь книг.',
        uz: "Mutolaa daftari haqida masala. Guruh ma'lumotlari: ikki, uch, uch, to'rt va yigirma sakkiz kitob.",
        en: 'A reading log problem. The group data: two, three, three, four and twenty eight books.',
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
        q: { ru: 'Ряд 4, 5, 6, 7, 8. Найди среднее арифметическое.', uz: "4, 5, 6, 7, 8 qatori. O'rtacha arifmetikni toping.", en: 'The row 4, 5, 6, 7, 8. Find the mean.' },
        hint: { ru: 'Сумма 30, дели на 5.', uz: "Yig'indi 30, 5 ga bo'ling.", en: 'The sum is 30, divide by 5.' },
        hint_audio: { ru: 'Сложите все пять чисел, получится тридцать, а потом разделите на пять.', uz: "Beshta sonni qo'shing, o'ttiz chiqadi, keyin beshga bo'ling.", en: 'Add all five numbers to get thirty, then divide by five.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Ряд 7, 2, 9, 2, 5. Чему равна мода?', uz: '7, 2, 9, 2, 5 qatori. Moda nechaga teng?', en: 'The row 7, 2, 9, 2, 5. The mode?' },
        opts: ['5', '7', '2', '9'],
        wrong: [
          { ru: 'Это медиана после упорядочивания.', uz: 'Bu tartiblagandan keyingi mediana.', en: 'That is the median after sorting.' },
          { ru: 'Семёрка встречается один раз.', uz: 'Yetti bir marta uchraydi.', en: 'Seven appears once.' },
          null,
          { ru: 'Девятка встречается один раз.', uz: "To'qqiz bir marta uchraydi.", en: 'Nine appears once.' },
        ],
        correct: { ru: 'Верно. Двойка встречается дважды.', uz: "To'g'ri. Ikki ikki marta uchraydi.", en: 'Right. Two appears twice.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Ряд 10, 3, 6. Чему равна медиана?', uz: '10, 3, 6 qatori. Mediana nechaga teng?', en: 'The row 10, 3, 6. The median?' },
        opts: ['3', '6', '10', '19'],
        wrong: [
          { ru: 'Это наименьшее значение.', uz: 'Bu eng kichik qiymat.', en: 'That is the smallest value.' },
          null,
          { ru: 'Это наибольшее, а не серединное.', uz: "Bu eng katta, o'rtadagi emas.", en: 'That is the largest, not the middle.' },
          { ru: 'Это сумма всех чисел.', uz: "Bu barcha sonlar yig'indisi.", en: 'That is the sum.' },
        ],
        correct: { ru: 'Верно. По порядку 3, 6, 10 — в середине 6.', uz: "To'g'ri. Tartib bilan 3, 6, 10 — o'rtada 6.", en: 'Right. Sorted 3, 6, 10 gives 6 in the middle.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что такое размах?', uz: 'Kenglik nima?', en: 'What is the range?' },
        opts: [
          { ru: 'самое частое значение', uz: "eng ko'p uchraydigan qiymat", en: 'the most frequent value' },
          { ru: 'середина ряда', uz: "qatorning o'rtasi", en: 'the middle of the row' },
          { ru: 'сумма всех значений', uz: "barcha qiymatlar yig'indisi", en: 'the sum of all values' },
          { ru: 'наибольшее минус наименьшее', uz: 'eng kattadan eng kichigi ayirilgani', en: 'largest minus smallest' },
        ],
        wrong: [
          { ru: 'Это мода.', uz: 'Bu moda.', en: 'That is the mode.' },
          { ru: 'Это медиана.', uz: 'Bu mediana.', en: 'That is the median.' },
          { ru: 'Сумма нужна для среднего.', uz: "Yig'indi o'rtacha uchun kerak.", en: 'The sum is used for the mean.' },
          null,
        ],
        correct: { ru: 'Верно. Размах показывает разброс данных.', uz: "To'g'ri. Kenglik ma'lumotlar tarqalishini ko'rsatadi.", en: 'Right. The range shows the spread.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Книги: 2, 3, 3, 4, 28. Что описывает группу честнее?', uz: 'Kitoblar: 2, 3, 3, 4, 28. Guruhni nima halolroq tasvirlaydi?', en: 'Books: 2, 3, 3, 4, 28. What describes the group better?' },
        opts: [
          { ru: 'медиана 3', uz: 'mediana 3', en: 'the median 3' },
          { ru: 'среднее 8', uz: "o'rtacha 8", en: 'the mean 8' },
          { ru: 'размах 26', uz: 'kenglik 26', en: 'the range 26' },
          { ru: 'наибольшее 28', uz: 'eng katta 28', en: 'the largest 28' },
        ],
        wrong: [
          null,
          { ru: 'Восьми книг не прочитал никто.', uz: "Sakkiz kitobni hech kim o'qimagan.", en: 'Nobody read eight books.' },
          { ru: 'Размах про разброс, а не про типичное.', uz: 'Kenglik tarqalish haqida, tipik haqida emas.', en: 'The range is about spread, not the typical value.' },
          { ru: 'Это как раз выброс, он один такой.', uz: "Bu aynan chetlashish, u yolg'iz.", en: 'That is the outlier, the only one.' },
        ],
        correct: { ru: 'Верно. Четверо читали от 2 до 4 книг.', uz: "To'g'ri. To'rttasi 2 dan 4 tagacha kitob o'qigan.", en: 'Right. Four of them read between 2 and 4.' },
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
      ru: 'Одно среднее легко вводит в заблуждение. Про реку говорят, что средняя глубина метр, и кажется, что перейти можно везде. Но у берега может быть двадцать сантиметров, а на середине четыре метра. Поэтому рядом со средним всегда смотрят на размах и на медиану.',
      uz: "Bitta o'rtacha osongina chalg'itadi. Daryo haqida o'rtacha chuqurligi bir metr deyiladi va hamma joyda o'tib ketish mumkindek tuyuladi. Ammo qirg'oqda yigirma santimetr, o'rtada esa to'rt metr bo'lishi mumkin. Shuning uchun o'rtacha yonida doim kenglikka va medianaga ham qaraladi.",
      en: 'A single mean misleads easily. A river is said to average a metre deep, and it seems you can wade anywhere. But near the bank it may be twenty centimetres and mid-stream four metres. That is why the range and the median are read alongside the mean.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Одно среднее легко вводит в заблуждение. Про реку говорят, что средняя глубина метр, и кажется, что перейти можно везде. Но у берега может быть двадцать сантиметров, а на середине четыре метра. Поэтому рядом со средним всегда смотрят на размах и на медиану.',
      uz: "Bilasizmi? Bitta o'rtacha osongina chalg'itadi. Daryo haqida o'rtacha chuqurligi bir metr deyiladi va hamma joyda o'tib ketish mumkindek tuyuladi. Ammo qirg'oqda yigirma santimetr, o'rtada esa to'rt metr bo'lishi mumkin. Shuning uchun o'rtacha yonida doim kenglikka va medianaga ham qaraladi.",
      en: 'Did you know? A single mean misleads easily. A river is said to average a metre deep, and it seems you can wade anywhere. But near the bank it may be twenty centimetres and mid-stream four metres. That is why the range and the median are read alongside the mean.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Данные', uz: "Matematika · Ma'lumotlar", en: 'Mathematics · Data' },
    heading: { ru: 'Работа с данными', uz: "Ma'lumotlar bilan ishlash", en: 'Working with data' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'мода — самое частое', uz: "moda — eng ko'p uchraydigani", en: 'the mode is the most frequent' },
    brief_2: { ru: 'медиана — середина упорядоченного ряда', uz: "mediana — tartiblangan qatorning o'rtasi", en: 'the median is the middle of a sorted row' },
    brief_3: { ru: 'среднее — сумма делить на количество', uz: "o'rtacha — yig'indi bo'linsin songa", en: 'the mean is the sum over the count' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Размах', uz: 'Kenglik', en: 'The range' },
    memo_a1: { ru: 'наибольшее минус наименьшее', uz: 'eng kattadan eng kichigi', en: 'largest minus smallest' },
    memo_q2: { ru: 'Один выброс', uz: 'Bitta chetlashish', en: 'One outlier' },
    memo_a2: { ru: 'тянет среднее, не медиану', uz: "o'rtachani tortadi, medianani emas", en: 'pulls the mean, not the median' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'искать медиану без порядка', uz: 'medianani tartiblamasdan izlash', en: 'finding a median unsorted' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Мода это самое частое значение, медиана это середина упорядоченного ряда, среднее арифметическое это сумма, делённая на количество, а размах это разность наибольшего и наименьшего. Одно очень большое значение тянет среднее, но не медиану.',
        'Читательский дневник: обычный ученик прочитал три книги, хотя среднее равно восьми.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Moda eng ko'p uchraydigan qiymat, mediana tartiblangan qatorning o'rtasi, o'rtacha arifmetik yig'indini songa bo'lgani, kenglik esa eng katta va eng kichikning ayirmasi. Bitta juda katta qiymat o'rtachani tortadi, medianani esa yo'q.",
        "Mutolaa daftari: o'rtacha sakkizga teng bo'lsa ham, oddiy o'quvchi uch kitob o'qigan.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'The mode is the most frequent value, the median is the middle of a sorted row, the mean is the sum over the count, and the range is largest minus smallest. One very large value pulls the mean but not the median.',
        'The reading log: a typical pupil read three books although the mean is eight.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Упорядочь и посчитай', uz: 'Usul. Tartiblang va hisoblang', en: 'Method. Sort, then count' },
    m1_steps: {
      ru: ['Выстрой числа по возрастанию', 'Мода — что повторяется, медиана — что в середине', 'Среднее — сумма делить на количество, размах — крайние'],
      uz: ["Sonlarni o'sish bo'yicha tizing", "Moda — takrorlangani, mediana — o'rtadagi", "O'rtacha — yig'indi bo'linsin songa, kenglik — chetlari"],
      en: ['Line the numbers up in order', 'Mode: what repeats. Median: what is in the middle', 'Mean: sum over count. Range: the two extremes'],
    },
    m1_no: {
      ru: 'Если размах большой, о типичном значении честнее говорить медианой, а не средним.',
      uz: "Kenglik katta bo'lsa, tipik qiymat haqida o'rtacha emas, mediana bilan gapirish halolroq.",
      en: 'If the range is large, describe the typical value with the median, not the mean.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: читательский уголок класса, таблица книг.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d45wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EFE4D2"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d45wall)"/>

    {/* Полка с книгами */}
    <g>
      <rect x="10" y="86" width="96" height="5" rx="2.5" fill="#C9A472"/>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={14 + k * 15} y={86 - (22 + (k % 3) * 6)} width="12" height={22 + (k % 3) * 6}
          rx="2" fill={['#D9603F', '#7ECBE6', '#8FBF7F', '#F5C77E', '#B99B72', '#019ACB'][k]}/>
      ))}
      <rect x="10" y="122" width="96" height="5" rx="2.5" fill="#C9A472"/>
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={16 + k * 22} y={100} width="18" height="22" rx="2" fill="#C3B49A"/>
      ))}
    </g>

    {/* Таблица результатов на доске */}
    <g>
      <rect x="128" y="18" width="248" height="104" rx="5" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2.4"/>
      {[2, 3, 3, 4, 28].map((v, i) => (
        <g key={i}>
          <rect x="138" y={26 + i * 18} width="90" height="14" rx="3" fill="#F4F1EA"/>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={144 + k * 26} y={31 + i * 18} width="20" height="3" rx="1.5" fill="#C3B49A"/>
          ))}
          <rect x="236" y={26 + i * 18} width={v === 28 ? 120 : v * 9} height="14" rx="3"
            fill={v === 28 ? '#D9603F' : '#7ECBE6'} opacity={v === 28 ? 1 : 0.85}/>
          <text x={v === 28 ? 352 : 240 + v * 9} y={37 + i * 18} textAnchor={v === 28 ? 'end' : 'start'}
            fill={v === 28 ? '#FFFDF7' : '#4F9EBB'}
            fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">{v}</text>
        </g>
      ))}
      <rect className="d45-mark" x="234" y={26 + 4 * 18 - 2} width="124" height="18" rx="4"
        fill="none" stroke="#8A6A22" strokeWidth="2"/>
    </g>

    <Person x={52} ground={140} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={90} ground={140} head={13} shirt="#8FBF7F" hair="#5A4636"/>
    <rect x="0" y="140" width="400" height="14" fill="#D2A96F"/>
  </svg>
);

// Итог: три числа об одном наборе.
const FinalScene = () => {
  const lang = useLang();
  const cells = [
    { v: '3', l: tri(lang, 'мода', 'moda', 'mode'), tone: '#1F7A4D', bg: '#E3F0E8' },
    { v: '3', l: tri(lang, 'медиана', 'mediana', 'median'), tone: '#019ACB', bg: '#E7F5FA' },
    { v: '8', l: tri(lang, 'среднее', "o'rtacha", 'mean'), tone: '#D9603F', bg: '#FFF1EC' },
    { v: '26', l: tri(lang, 'размах', 'kenglik', 'range'), tone: '#8A6A22', bg: '#FBF3D6' },
  ];
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${14 + i * 94}, 16)`}>
          <rect x="0" y="0" width="82" height="44" rx="8" fill={c.bg} stroke={c.tone} strokeWidth="2"/>
          <text x="41" y="30" textAnchor="middle" fill={c.tone}
            fontFamily="'JetBrains Mono', monospace" fontSize="19" fontWeight="700">{c.v}</text>
          <text x="41" y="60" textAnchor="middle" fill="#8A8883"
            fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">{c.l}</text>
        </g>
      ))}
      <text x="200" y="86" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">
        {tri(lang, 'один набор, четыре разных ответа',
          "bitta to'plam, to'rt xil javob",
          'one set, four different answers')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: столбики данных и подсветка нужной величины.
const Bars = ({ data, mark = null, size = 'mid' }) => {
  const max = Math.max(...data, 1);
  const w = 22; const gap = 10; const h = 74;
  return (
    <span className={'d45-bars-box d45-bars-' + size}>
      <svg viewBox={`0 0 ${data.length * (w + gap) + 30} 110`} aria-hidden="true">
        <path d={`M14 ${h + 12} h${data.length * (w + gap)}`} stroke="#8E8578" strokeWidth="2"/>
        {data.map((v, i) => {
          const bh = Math.max((v / max) * h, 6);
          const hit = mark === i;
          return (
            <g key={i}>
              <rect x={20 + i * (w + gap)} y={h + 12 - bh} width={w} height={bh} rx="3"
                fill={hit ? '#A9CFBA' : '#E7F5FA'} stroke={hit ? '#1F7A4D' : '#019ACB'} strokeWidth="1.8"/>
              <text x={20 + i * (w + gap) + w / 2} y={h + 26} textAnchor="middle" fill="#8A8883"
                fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700">{v}</text>
            </g>
          );
        })}
      </svg>
    </span>
  );
};

// Упорядоченный ряд с подсветкой середины.
const Row = ({ data, mid = false, ordered = true }) => {
  const arr = ordered ? [...data].sort((a, b) => a - b) : data;
  const midIdx = Math.floor(arr.length / 2);
  return (
    <span className="d45-row">
      {arr.map((v, i) => (
        <i key={i} className={'d45-cell' + (mid && i === midIdx ? ' d45-cell-mid' : '')}>{v}</i>
      ))}
    </span>
  );
};

const Line = ({ node, on }) => (
  <span className={'d45-line d45-fade' + (on ? ' d45-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d45-stage d45-stage-row">
        <Row data={[2, 3, 3, 4, 28]} ordered={false}/>
        <span className={'d45-fade' + (step >= 1 ? ' d45-on' : '')}>
          <Bars size="sm" data={[2, 3, 3, 4, 28]}/>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
      <span className={'d45-chips d45-fade' + (step >= 1 ? ' d45-on' : '')}>
        <i className="d45-chip-l">{tri(lang, 'таблица', 'jadval', 'table')}</i>
        <i className="d45-chip-g">{tri(lang, 'диаграмма', 'diagramma', 'chart')}</i>
      </span>
    </div>
  );
};

// Ядро: три вопроса к набору.
const CoreBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d45-stage">
        <Row data={[4, 6, 6, 8, 11]} mid={step >= 1}/>
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

// Размах и выброс.
const OutBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_out;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d45-stage d45-stage-row">
        <Bars size="sm" data={step >= 1 ? [2, 3, 3, 4, 28] : [2, 3, 3, 4]} mark={step >= 1 ? 4 : null}/>
        <span className="d45-col">
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

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d45-stage">
        <Row data={[2, 3, 3, 4, 28]} mid={step >= 0}/>
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

// Граница: медиана требует порядка.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d45-stage">
        <span className="d45-pair d45-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d45-pair d45-pair-good d45-fade' + (step >= 1 ? ' d45-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d45-pair d45-pair-warn d45-fade' + (step >= 2 ? ' d45-on' : '')}>
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
        <div className={'d45-banner fade-up delay-1' + (phase === 'play' ? ' d45-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d45-stage d45-stage-tool">
          {phase === 'demo' ? (
            <>
              <Row data={[4, 6, 6, 8, 11]} mid={shown >= 2}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d45-verdict' + (done ? ' d45-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
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
          <div className="d45-acts fade-up">
            <button className="d45-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d45-btn d45-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
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
const ScreenOut = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_out} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <OutBody step={step}/>}/>
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
      <div className="d45-stage">
        <Row data={[2, 3, 3, 4, 28]} mid/>
      </div>
    )}/>
);

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenThree = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_three} asideNode={methodAside}
    figureNode={() => <div className="d45-task-fig"><Row data={[2, 4, 4, 6, 9]} mid/></div>}/>
);
const ScreenRead = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_read} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: данные дневника.
const TaskFig = ({ idx }) => (
  <div className="d45-task-fig">
    {idx >= 1
      ? <Bars size="sm" data={[2, 3, 3, 4]}/>
      : <Row data={[2, 3, 3, 4, 28]} mid/>}
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
.d45-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d45-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d45-stage-tool .d45-line { font-size: clamp(12px, 2vw, 16px); }
.d45-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); flex-wrap: wrap; }
.d45-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 190px; min-width: 0; }

/* Диаграмма */
.d45-bars-box { display: block; width: 100%; max-width: 260px; }
.d45-bars-sm { max-width: 220px; }
.d45-bars-box svg { width: 100%; height: auto; display: block; }

/* Упорядоченный ряд */
.d45-row { display: inline-flex; gap: clamp(4px, 1vw, 8px); flex-wrap: wrap; justify-content: center; }
.d45-cell { font-style: normal; min-width: clamp(30px, 6vw, 44px); padding: 6px 8px; border-radius: 10px; background: #F4F1EA; border: 1px solid #E9E3D9; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.5vw, 19px); font-weight: 700; color: #494550; text-align: center; }
.d45-cell-mid { background: #E3F0E8; border-color: #1F7A4D; color: #1F7A4D; }

.d45-fade { opacity: 0; transition: opacity 420ms linear; }
.d45-on { opacity: 1; }
.d45-line { font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 16px); font-weight: 700; color: #494550; text-align: center; }

/* Подписи */
.d45-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d45-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d45-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d45-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d45-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d45-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d45-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d45-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d45-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d45-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d45-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d45-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d45-verdict-on { opacity: 1; }
.d45-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d45-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d45-btn:disabled { opacity: 0.45; cursor: default; }
.d45-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d45-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: рамка на выделяющейся строке мигает */
.d45-mark { animation: d45Mark 2600ms ease-in-out infinite; }
@keyframes d45Mark { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d45-mark { animation: none; } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DataLesson({
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

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenOut, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenThree, ScreenRead, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
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
