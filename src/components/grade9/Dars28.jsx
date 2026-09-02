// ============================================================================
// 9-sinf, Dars 28. STATISTIK XARAKTERISTIKALAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Algebra 9, 38-§ (206-208-bet),
// 37-§ dan tasodifiy miqdor tushunchasi (198-bet).
//   Moda M_0 (207-bet): tanlanmada eng ko'p uchraydigan QIYMAT.
//       Ikkita bo'lishi mumkin (5, 6, 11, 3, 3, 5), umuman
//       bo'lmasligi ham mumkin (1, 3, 7, 20, 6, 11).
//   Mediana M_e (207-bet): tartiblangan qatorning o'rtasi. Toq sonda —
//       o'rtadagi son, juftda — o'rtadagi ikkitasining o'rta arifmetigi.
//   Kenglik R (208-bet): eng katta va eng kichik qiymatning ayirmasi,
//       tarqoqlik o'lchovi.
//   O'rtacha qiymat (208-bet): chastotalar bilan og'irlangan o'rta
//       arifmetik. 2-masala: X = 3,4,5,7,10 va M = 3,1,2,1,3 → 6.
//
// DARSLIKDA IKKITA XATO TOPILDI, ikkalasi ham tuzatib olindi:
//   1) 1-masala, 1) (207-bet). Tanlanma 8, 2, 0, 5, −5, 4, 8.
//      Darslik uni «−5, 0, 2, 5, 4, 8, 8» deb «tartiblaydi» — 5 va 4
//      o'rin almashib qolgan — va medianani 5 deb beradi. To'g'ri
//      tartib: −5, 0, 2, 4, 5, 8, 8, ettita sondan o'rtadagisi 4.
//      JAVOB 4. Bu shunchaki terish xatosi emas, matematik xato, va u
//      aynan shu darsning asosiy xatosidan kelib chiqqan: qator
//      tartiblanmagan. 12-ekrandagi tuzoq shundan yasaldi.
//   2) Kenglik misoli (208-bet). Tanlanma 190, 187, 198, 189, 195, 190.
//      Darslik eng kichik qiymatni 186 deb oladi va R = 12 chiqaradi,
//      lekin qatorda 186 yo'q, eng kichigi 187, demak R = 11.
//      6-ekranda R = 11 olindi.
//
// YANGI ASBOB: `SortRow` (asboblar.jsx, 7C). Sinf qoidasi bo'yicha
// asbob yangi mavzuga emas, yangi QO'L HARAKATIGA beriladi — bu yerda
// shunday harakat bor: sonlarni o'sish tartibida terib chiqish. Asbob
// tartib buzilishini jismonan imkonsiz qiladi va qator to'lgach
// o'rtasini o'zi yoqadi. Ya'ni u darslik xato qilgan joyni himoya
// qiladi.
//
// TRANSFER (13-ekran) darslikda yo'q, lekin uning to'rtta
// xarakteristikasidan bevosita kelib chiqadi: 1, 2, 3, 4, 5 va
// 1, 2, 3, 4, 100. O'rtacha uchdan yigirma ikkiga sakraydi, mediana
// esa uchligicha qoladi. Nega bitta emas, bir nechta xarakteristika
// kerakligiga eng qisqa javob shu.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SortRow } from './asboblar.jsx'

export const META = {
  id: 'grade9-28',
  n: 28,
  row: 28,
  block: 'Б5',
  topic: L(
    'Statistik xarakteristikalar',
    'Статистические характеристики',
    'Statistical measures',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Moda eng ko'p uchraydigan qiymat, u ikkita bo'lishi yoki umuman bo'lmasligi mumkin",
    'Мода это наиболее частое значение, их может быть два или не быть вовсе',
    'The mode is the most frequent value, there can be two of them or none at all',
  ),
  L(
    "Mediana TARTIBLANGAN qatorning o'rtasi, juft sonda esa o'rtadagi ikkitasining o'rtachasi",
    'Медиана это середина УПОРЯДОЧЕННОГО ряда, а при чётном числе среднее двух средних',
    'The median is the middle of the ORDERED row, and with an even count the mean of the two middle ones',
  ),
  L(
    "Kenglik eng katta va eng kichik qiymatning ayirmasi, u tarqoqlikni ko'rsatadi",
    'Размах это разность наибольшего и наименьшего значения, он показывает разброс',
    'The range is the difference between the largest and smallest value, showing the spread',
  ),
]

export const MISS = {
  'tartiblashni-unutish': {
    what: L(
      "mediana tartiblanmagan qatorning o'rtasidan olindi",
      'медиана взята из середины неупорядоченного ряда',
      'the median was taken from the middle of an unordered row',
    ),
    wrong: null,
    at: 0,
  },
  'modani-chastota-bilan-adashtirish': {
    what: L(
      "moda deb qiymat emas, uning necha marta uchragani aytildi",
      'модой названо не значение, а сколько раз оно встретилось',
      'the count of occurrences was named as the mode instead of the value',
    ),
    wrong: null,
    at: 0,
  },
  'kenglikni-notogri-olish': {
    what: L(
      "kenglik ayirma o'rniga boshqa amal bilan olindi",
      'размах взят другим действием вместо разности',
      'the range was taken by an operation other than subtraction',
    ),
    wrong: null,
    at: 0,
  },
  'bitta-son-yetarli-emas': {
    what: L(
      "butun tanlanma bitta son bilan to'liq tavsiflandi deb hisoblandi",
      'сочтено, что вся выборка полностью описана одним числом',
      'it was assumed one number fully describes the whole sample',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — bir xil o'rtacha, boshqacha sinf.
// ============================================================
const S1 = {
  eyebrow: L("BIR XIL O'RTACHA", 'ОДИНАКОВОЕ СРЕДНЕЕ', 'THE SAME AVERAGE'),
  title: L(
    "Ikki guruh, bitta o'rtacha baho",
    'Две группы, одна средняя оценка',
    'Two groups, one average mark',
  ),
  audio: [
    A('mount',
      "Birinchi guruhda beshta o'quvchi va hammasi besh baho olgan. Ikkinchi guruhda baholar uch, to'rt, besh, olti, yetti.",
      'В первой группе пять учеников и все получили пятёрку. Во второй группе оценки три, четыре, пять, шесть, семь.',
      'In the first group five students all scored five. In the second group the marks are three, four, five, six, seven.'),
    A('why',
      "Ikkala guruhda ham o'rtacha baho beshga teng. Lekin guruhlar bir xilmi?",
      'В обеих группах средняя оценка равна пяти. Но одинаковы ли группы?',
      'In both groups the average mark is five. But are the groups the same?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "5, 5, 5, 5, 5 va 3, 4, 5, 6, 7. O'rtacha bir xil. Guruhlar haqida nima deyish mumkin?",
      '5, 5, 5, 5, 5 и 3, 4, 5, 6, 7. Среднее одинаково. Что можно сказать о группах?',
      '5, 5, 5, 5, 5 and 3, 4, 5, 6, 7. The average is the same. What can be said about the groups?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Ular butunlay boshqacha, o'rtacha buni ko'rsatmaydi",
          'Они совсем разные, среднее этого не показывает',
          'They are quite different, and the average does not show it',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Ular bir xil, chunki o'rtachasi teng",
          'Они одинаковы, ведь среднее равно',
          'They are the same, since the average is equal',
        ),
        hint: L(
          "Birinchi guruhda hamma bir xil o'qiydi. Ikkinchisida esa uch baho olgan ham, yetti olgan ham bor. O'rtacha bu farqni yashiradi.",
          'В первой группе все учатся одинаково. Во второй есть и тройка, и семёрка. Среднее прячет это различие.',
          'In the first group everyone performs alike. The second has both a three and a seven. The average hides that difference.',
        ),
      },
    ],
    after: L(
      "Ha. Bitta son butun guruhni tavsiflay olmaydi. Bugun yana uchta xarakteristika bilan tanishamiz.",
      'Да. Одно число не может описать всю группу. Сегодня познакомимся ещё с тремя характеристиками.',
      'Yes. One number cannot describe a whole group. Today we meet three more measures.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — o'rtacha qiymat.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "O'rtacha qiymat 8-sinfdan tanish",
    'Среднее значение знакомо с 8 класса',
    'The mean is familiar from grade eight',
  ),
  audio: [
    A('mount',
      "O'rtacha qiymat barcha sonlarning yig'indisini ularning soniga bo'lish bilan topiladi.",
      'Среднее значение находится делением суммы всех чисел на их количество.',
      'The mean is found by dividing the sum of all the numbers by how many there are.'),
    A('why',
      "Ikkinchi guruhning baholarini qo'shib ko'ring.",
      'Сложи оценки второй группы.',
      'Add up the marks of the second group.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3, 4, 5, 6, 7', '3, 4, 5, 6, 7', '3, 4, 5, 6, 7')}
      steps={[
        { id: 'a', head: L('Yigindi', 'Сумма', 'The sum'), lines: ['3 + 4 + 5 + 6 + 7 = 25'] },
      ]}
      ask={L(
        "O'rtacha qiymat nechaga teng?",
        'Чему равно среднее значение?',
        'What does the mean equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '5' },
        {
          id: 'wrong',
          label: '25',
          hint: L(
            "Yigirma besh bu YIG'INDI. Uni sonlar soniga, ya'ni beshga bo'lish qolgan.",
            'Двадцать пять это СУММА. Её ещё нужно разделить на количество чисел, то есть на пять.',
            'Twenty five is the SUM. It still has to be divided by how many numbers there are, that is five.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yigirma beshni beshga bo'lsak, besh chiqadi. Xukdagi ikkala guruhda ham shu son chiqqandi.",
        'Верно. Двадцать пять разделить на пять будет пять. В обеих группах из хука вышло это же число.',
        'Correct. Twenty five over five is five. Both groups in the opening gave this same number.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — SortRow: mediana, toq son.
// ============================================================
const S3 = {
  eyebrow: L('AVVAL TARTIBLASH', 'СНАЧАЛА УПОРЯДОЧИТЬ', 'ORDER IT FIRST'),
  title: L(
    "Mediana tartiblangan qatorning o'rtasi",
    'Медиана это середина упорядоченного ряда',
    'The median is the middle of the ordered row',
  ),
  audio: [
    A('mount',
      "Ikkinchi xarakteristika mediana. Bu tartiblangan qatorning o'rtasida turgan son.",
      'Вторая характеристика это медиана. Это число, стоящее в середине упорядоченного ряда.',
      'The second measure is the median. It is the number standing in the middle of the ordered row.'),
    A('why',
      "Sonlarni eng kichigidan boshlab tering. Har safar qolganlarning eng kichigini bosing.",
      'Собирай числа начиная с наименьшего. Каждый раз нажимай наименьшее из оставшихся.',
      'Collect the numbers starting from the smallest. Each time press the smallest of those left.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SortRow
      values={[8, 2, 0, 5, -5, 4, 8]}
      ask={L(
        "Qatorni o'sish tartibida tering",
        'Собери ряд по возрастанию',
        'Build the row in increasing order',
      )}
      hint={L(
        "Bu son qolganlarning eng kichigi emas. Qolgan sonlarni ko'zdan kechiring va eng kichigini toping.",
        'Это число не наименьшее из оставшихся. Пробеги взглядом остальные и найди самое маленькое.',
        'This is not the smallest of the remaining ones. Scan the rest and find the smallest.',
      )}
      after={L(
        "Qator tayyor. Yettita son bor, demak o'rtada bittasi turibdi, u to'rtga teng. Mediana to'rt.",
        'Ряд готов. Чисел семь, значит в середине стоит одно, и оно равно четырём. Медиана четыре.',
        'The row is ready. There are seven numbers, so one stands in the middle, and it is four. The median is four.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — mediana, juft son.
// ============================================================
const S4 = {
  eyebrow: L('JUFT SONDA', 'ПРИ ЧЁТНОМ ЧИСЛЕ', 'WITH AN EVEN COUNT'),
  title: L(
    "O'rtada ikkita son turganda",
    'Когда в середине стоят два числа',
    'When two numbers stand in the middle',
  ),
  audio: [
    A('mount',
      "Endi oltita son. Tartiblasak, ikki, uch, to'rt, besh, yetti, sakkiz chiqadi.",
      'Теперь шесть чисел. Упорядочив, получим два, три, четыре, пять, семь, восемь.',
      'Now six numbers. Ordered, they give two, three, four, five, seven, eight.'),
    A('why',
      "Oltita sonning o'rtasida bitta son yo'q, ikkitasi bor. Nima qilish kerak?",
      'У шести чисел в середине не одно число, а два. Что делать?',
      'Six numbers have no single middle, but two. What is to be done?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2, 3, 4, 5, 7, 8', '2, 3, 4, 5, 7, 8', '2, 3, 4, 5, 7, 8')}
      steps={[
        { id: 'a', head: L('Ortadagi ikkitasi', 'Два средних', 'The two middle ones'), lines: [L('4  va  5', '4  и  5', '4  and  5')] },
      ]}
      ask={L(
        "Mediana nechaga teng?",
        'Чему равна медиана?',
        'What does the median equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '4,5' },
        {
          id: 'wrong',
          label: '9',
          hint: L(
            "To'qqiz bu ikkalasining YIG'INDISI. O'rta arifmetik uchun uni yana ikkiga bo'lish kerak.",
            'Девять это СУММА этих двух. Для среднего арифметического её нужно ещё разделить на два.',
            'Nine is the SUM of those two. For the arithmetic mean it still has to be halved.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. To'rt butun besh o'ndan. Diqqat qiling: mediana qatorda umuman bo'lmasligi ham mumkin ekan.",
        'Верно. Четыре целых пять десятых. Заметь: медианы может вообще не быть среди чисел ряда.',
        'Correct. Four point five. Note that the median need not appear among the numbers of the row at all.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — moda.
// ============================================================
const S5 = {
  eyebrow: L('ENG KO\'P UCHRAGANI', 'САМОЕ ЧАСТОЕ', 'THE MOST FREQUENT'),
  title: L(
    "Moda qiymat, uning soni emas",
    'Мода это значение, а не его количество',
    'The mode is a value, not a count',
  ),
  audio: [
    A('mount',
      "Uchinchi xarakteristika moda. Bu tanlanmada eng ko'p uchraydigan qiymat.",
      'Третья характеристика это мода. Это значение, которое встречается в выборке чаще всего.',
      'The third measure is the mode. It is the value occurring most often in the sample.'),
    A('why',
      "Sakkiz, to'qqiz, ikki, to'rt, sakkiz, olti, uch. Qaysi son ikki marta uchradi?",
      'Восемь, девять, два, четыре, восемь, шесть, три. Какое число встретилось дважды?',
      'Eight, nine, two, four, eight, six, three. Which number appeared twice?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('8, 9, 2, 4, 8, 6, 3', '8, 9, 2, 4, 8, 6, 3', '8, 9, 2, 4, 8, 6, 3')}
      steps={[
        { id: 'a', head: L('Uchrash soni', 'Сколько раз встретилось', 'Occurrences'), lines: ['8 → 2', L('qolganlari → 1', 'остальные → 1', 'the rest → 1')] },
      ]}
      ask={L(
        "Moda nechaga teng?",
        'Чему равна мода?',
        'What does the mode equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'M₀ = 8' },
        {
          id: 'wrong',
          label: 'M₀ = 2',
          hint: L(
            "Ikki bu sakkiz necha marta uchragani, ya'ni CHASTOTA. Moda esa qiymatning o'zi.",
            'Два это сколько раз встретилась восьмёрка, то есть ЧАСТОТА. А мода это само значение.',
            'Two is how many times eight occurred, that is the FREQUENCY. The mode is the value itself.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Moda sakkizga teng. Moda ikkita ham bo'lishi mumkin, masalan besh, olti, o'n bir, uch, uch, besh qatorida. Ba'zan esa umuman bo'lmaydi.",
        'Верно. Мода равна восьми. Мод может быть и две, например в ряду пять, шесть, одиннадцать, три, три, пять. А иногда моды нет вовсе.',
        'Correct. The mode is eight. There can be two modes, as in five, six, eleven, three, three, five. And sometimes there is none.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — kenglik.
// ============================================================
const S6 = {
  eyebrow: L('TARQOQLIK', 'РАЗБРОС', 'THE SPREAD'),
  title: L(
    "Kenglik xukdagi savolga javob beradi",
    'Размах отвечает на вопрос из хука',
    'The range answers the opening question',
  ),
  audio: [
    A('mount',
      "To'rtinchi xarakteristika kenglik. Bu eng katta va eng kichik qiymatning ayirmasi.",
      'Четвёртая характеристика это размах. Это разность наибольшего и наименьшего значения.',
      'The fourth measure is the range. It is the difference between the largest and the smallest value.'),
    A('why',
      "Ikkita tanlanmani solishtiring. Birinchisida sonlar keng sochilgan, ikkinchisida bir joyda to'plangan.",
      'Сравни две выборки. В первой числа разбросаны широко, во второй собраны в одном месте.',
      'Compare two samples. In the first the numbers are widely scattered, in the second they cluster.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        '21, 27, 22, 8, 9, 15, 19, 21',
        '21, 27, 22, 8, 9, 15, 19, 21',
        '21, 27, 22, 8, 9, 15, 19, 21',
      )}
      steps={[
        { id: 'a', head: L('Chekka qiymatlar', 'Крайние значения', 'The extreme values'), lines: ['max = 27', 'min = 8'] },
      ]}
      ask={L(
        "Bu tanlanmaning kengligi nechaga teng?",
        'Чему равен размах этой выборки?',
        'What does the range of this sample equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'R = 19' },
        {
          id: 'wrong',
          label: 'R = 35',
          hint: L(
            "O'ttiz besh bu chekka qiymatlarning YIG'INDISI. Kenglik esa ayirma, ya'ni yigirma yetti minus sakkiz.",
            'Тридцать пять это СУММА крайних значений. А размах это разность, то есть двадцать семь минус восемь.',
            'Thirty five is the SUM of the extremes. The range is their difference, twenty seven minus eight.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi solishtiring: bir yuz to'qson, bir yuz sakson yetti, bir yuz to'qson sakkiz, bir yuz sakson to'qqiz, bir yuz to'qson besh, bir yuz to'qson tanlanmasining kengligi faqat o'n bir. Sonlar kattaroq, tarqoqlik esa kichikroq.",
        'Верно. Теперь сравни: у выборки сто девяносто, сто восемьдесят семь, сто девяносто восемь, сто восемьдесят девять, сто девяносто пять, сто девяносто размах всего одиннадцать. Числа больше, а разброс меньше.',
        'Correct. Now compare: the sample one hundred ninety, one hundred eighty seven, one hundred ninety eight, one hundred eighty nine, one hundred ninety five, one hundred ninety has a range of just eleven. Bigger numbers, smaller spread.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — chastotalar jadvali bo'yicha o'rtacha.
// ============================================================
const S7 = {
  eyebrow: L('CHASTOTALAR JADVALI', 'ТАБЛИЦА ЧАСТОТ', 'A FREQUENCY TABLE'),
  title: L(
    "Har bir qiymat o'z chastotasi bilan hisoblanadi",
    'Каждое значение учитывается со своей частотой',
    'Each value counts with its own frequency',
  ),
  audio: [
    A('mount',
      "Ma'lumotlar jadval bilan berilgan. Yuqorida qiymatlar, pastda ular necha marta uchragani.",
      'Данные заданы таблицей. Сверху значения, снизу сколько раз каждое встретилось.',
      'The data come as a table. Values on top, and below how many times each occurred.'),
    A('why',
      "Uchta uchlik, bitta to'rtlik, ikkita beshlik, bitta yettilik, uchta o'nlik. Jami o'nta son.",
      'Три тройки, одна четвёрка, две пятёрки, одна семёрка, три десятки. Всего десять чисел.',
      'Three threes, one four, two fives, one seven, three tens. Ten numbers in all.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'X: 3, 4, 5, 7, 10     M: 3, 1, 2, 1, 3',
        'X: 3, 4, 5, 7, 10     M: 3, 1, 2, 1, 3',
        'X: 3, 4, 5, 7, 10     M: 3, 1, 2, 1, 3',
      )}
      steps={[
        { id: 'a', head: L('Yigindi', 'Сумма', 'The sum'), lines: ['9 + 4 + 10 + 7 + 30 = 60'] },
        { id: 'b', head: L('Sonlar soni', 'Количество чисел', 'How many numbers'), lines: ['3 + 1 + 2 + 1 + 3 = 10'] },
      ]}
      ask={L(
        "O'rtacha qiymat nechaga teng?",
        'Чему равно среднее значение?',
        'What does the mean equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '6' },
        {
          id: 'wrong',
          label: '5,8',
          hint: L(
            "Besh butun sakkiz o'ndan beshta qiymatni oddiy qo'shib beshga bo'lganda chiqadi. Lekin uchlik uch marta uchragan, o'nlik ham uch marta, ularni bir martadan sanash mumkin emas.",
            'Пять целых восемь десятых выходит, если просто сложить пять значений и разделить на пять. Но тройка встретилась три раза, десятка тоже три, их нельзя считать по одному разу.',
            'Five point eight comes from simply adding the five values and dividing by five. But the three occurred thrice and so did the ten, they cannot count once each.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Oltmishni o'nga bo'lsak, olti chiqadi. Chastota har bir qiymatning og'irligi, uni hisobga olmasa bo'lmaydi.",
        'Верно. Шестьдесят разделить на десять будет шесть. Частота это вес каждого значения, без него не обойтись.',
        'Correct. Sixty over ten is six. The frequency is the weight of each value and cannot be ignored.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    "Algebra 9, 38-§, moda, mediana, kenglik va o'rtacha (206-208-bet)",
    'Алгебра 9, §38, мода, медиана, размах и среднее (стр. 206-208)',
    'Algebra 9, §38, mode, median, range and mean (p. 206-208)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        steps={[]}
        ask={L(
          "Medianani topishdan oldin nima qilinadi?",
          'Что делается перед нахождением медианы?',
          'What is done before finding the median?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Qator o'sish tartibida tartiblanadi", 'Ряд упорядочивается по возрастанию', 'The row is put into increasing order'),
          },
          {
            id: 'wrong',
            label: L("Qatordagi sonlar qo'shiladi", 'Числа ряда складываются', 'The numbers of the row are added'),
            hint: L(
              "Qo'shish o'rtacha qiymat uchun kerak. Mediana esa o'rin haqida, qiymatlarning yig'indisi haqida emas.",
              'Сложение нужно для среднего значения. А медиана про место, а не про сумму значений.',
              'Adding is for the mean. The median is about position, not about the sum of the values.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "To'rtta xarakteristika, to'rt xil savol",
    'Четыре характеристики, четыре разных вопроса',
    'Four measures, four different questions',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz o'rtachani, medianani, modani va kenglikni topdingiz. Har biri boshqa savolga javob beradi.",
      'На семи экранах ты нашёл среднее, медиану, моду и размах. Каждая отвечает на свой вопрос.',
      'On seven screens you found the mean, the median, the mode, and the range. Each answers a different question.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SortRow ikkinchi marta.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana bitta qator",
    'Ещё один ряд',
    'One more row',
  ),
  audio: [
    A('mount',
      "Beshta son. Ularni o'sish tartibida terib chiqing va medianani ko'ring.",
      'Пять чисел. Собери их по возрастанию и увидь медиану.',
      'Five numbers. Build them in increasing order and see the median.'),
    A('why',
      "Bu safar manfiy son ham bor, u eng chapda turadi.",
      'На этот раз есть и отрицательное число, оно встанет левее всех.',
      'This time there is a negative number too, and it goes leftmost.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SortRow
      values={[12, -3, 7, 12, 1]}
      ask={L(
        "Qatorni o'sish tartibida tering",
        'Собери ряд по возрастанию',
        'Build the row in increasing order',
      )}
      hint={L(
        "Bu son qolganlarning eng kichigi emas. Manfiy son har doim musbatlardan kichik ekanini unutmang.",
        'Это число не наименьшее из оставшихся. Помни, что отрицательное всегда меньше положительных.',
        'This is not the smallest of the remaining ones. Remember a negative is always less than a positive.',
      )}
      after={L(
        "Qator tayyor: minus uch, bir, yetti, o'n ikki, o'n ikki. Mediana yettiga teng, moda esa o'n ikki.",
        'Ряд готов: минус три, один, семь, двенадцать, двенадцать. Медиана равна семи, а мода двенадцати.',
        'The row is ready: minus three, one, seven, twelve, twelve. The median is seven and the mode is twelve.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: moda va kenglik.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Moda va kenglik",
    'Мода и размах',
    'The mode and the range',
  ),
  audio: [
    A('mount',
      "Uchta topshiriq. Ikkitasi moda haqida, bittasi kenglik haqida.",
      'Три задания. Два про моду, одно про размах.',
      'Three tasks. Two about the mode, one about the range.'),
    A('why',
      "Moda har doim ham bitta bo'lavermaydi.",
      'Мода не всегда бывает одна.',
      'The mode is not always a single one.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Moda bitta, ikkita bo'lishi yoki umuman bo'lmasligi mumkin, kenglik esa har doim bitta son.",
      'Все три найдены. Мода бывает одна, две или отсутствует, а размах это всегда одно число.',
      'All three are found. The mode can be one, two, or none, while the range is always a single number.',
    ),
    tasks: [
      {
        expr: '5, 6, 11, 3, 3, 5',
        question: L('Bu tanlanmaning modasi qanday?', 'Какова мода этой выборки?', 'What is the mode of this sample?'),
        ok: L("Ha, ikkita moda. Uchlik ham, beshlik ham ikki martadan uchradi.", 'Да, две моды. И тройка, и пятёрка встретились по два раза.', 'Yes, two modes. Both the three and the five occurred twice.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita: 3 va 5', 'Две: 3 и 5', 'Two: 3 and 5') },
          { id: 'b', label: L('Bitta: 3', 'Одна: 3', 'One: 3'), hint: L("Beshlikni ham sanang: u ham ikki marta uchradi. Ikkalasining chastotasi teng, demak ikkalasi ham moda.", 'Посчитай и пятёрку: она тоже встретилась дважды. Их частоты равны, значит обе моды.', 'Count the five too: it also appeared twice. Their frequencies are equal, so both are modes.') },
        ],
        solution: ['3 → 2,  5 → 2', '6 → 1,  11 → 1'],
      },
      {
        expr: '1, 3, 7, 20, 6, 11',
        question: L('Bu tanlanmaning modasi qanday?', 'Какова мода этой выборки?', 'What is the mode of this sample?'),
        ok: L("Ha, modasi yo'q. Har bir son bir martadan uchragan, birortasi ajralib turmaydi.", 'Да, моды нет. Каждое число встретилось по одному разу, ни одно не выделяется.', 'Yes, there is no mode. Each number occurred once and none stands out.'),
        items: [
          { id: 'a', right: true, label: L("Modasi yo'q", 'Моды нет', 'There is no mode') },
          { id: 'b', label: L('Eng kattasi: 20', 'Наибольшее: 20', 'The largest: 20'), hint: L("Moda eng katta son emas, eng KO'P UCHRAGAN son. Bu yerda hamma sonlar bir martadan uchragan.", 'Мода это не наибольшее число, а самое ЧАСТОЕ. Здесь все числа встретились по разу.', 'The mode is not the largest number but the most FREQUENT one. Here every number occurred once.') },
        ],
        solution: [L('har biri bir martadan', 'каждое по одному разу', 'each one occurs once')],
      },
      {
        expr: '4, 19, 7, 4, 12',
        question: L('Bu tanlanmaning kengligi nechaga teng?', 'Чему равен размах этой выборки?', 'What does the range of this sample equal?'),
        ok: L("Ha. O'n to'qqiz minus to'rt, ya'ni o'n besh.", 'Да. Девятнадцать минус четыре, то есть пятнадцать.', 'Yes. Nineteen minus four, that is fifteen.'),
        items: [
          { id: 'a', right: true, label: 'R = 15' },
          { id: 'b', label: 'R = 12', hint: L("O'n ikki bu qatordagi sonlardan biri. Kenglik esa qatorda bo'lishi shart emas, u ikkita chekka qiymatning ayirmasi.", 'Двенадцать это одно из чисел ряда. А размах не обязан в ряду быть, это разность двух крайних значений.', 'Twelve is one of the numbers in the row. The range need not be in the row, it is the difference of the two extremes.') },
        ],
        solution: ['max = 19,  min = 4', 'R = 19 − 4 = 15'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — ZANJIR: chastotalar bilan o'rtacha.
// ============================================================
const S11 = {
  eyebrow: L("O'RTACHA", 'СРЕДНЕЕ', 'THE MEAN'),
  title: L(
    "Jadval bo'yicha o'rtacha",
    'Среднее по таблице',
    'The mean from a table',
  ),
  audio: [
    A('mount',
      "Ikkita jadval. Har birida o'rtacha qiymatni toping.",
      'Две таблицы. В каждой найди среднее значение.',
      'Two tables. Find the mean in each.'),
    A('why',
      "Suratga qiymatlarni chastotaga ko'paytirib qo'shing, maxrajga chastotalar yig'indisini qo'ying.",
      'В числитель сложи значения, умноженные на частоты, в знаменатель сумму частот.',
      'In the numerator add the values times their frequencies, in the denominator the sum of frequencies.'),
  ],
  props: {
    stepLabel: L('Jadval', 'Таблица', 'Table'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Chastota qiymatning og'irligi, shuning uchun katta chastotali qiymat o'rtachani o'ziga tortadi.",
      'Обе найдены. Частота это вес значения, поэтому значение с большой частотой тянет среднее к себе.',
      'Both are found. The frequency is a weight, so a value with a large frequency pulls the mean towards itself.',
    ),
    tasks: [
      {
        expr: 'X: 2, 4, 6      M: 5, 3, 2',
        question: L('O\'rtacha qiymat nechaga teng?', 'Чему равно среднее значение?', 'What does the mean equal?'),
        ok: L("Ha. O'n qo'shuv o'n ikki qo'shuv o'n ikki o'ttiz to'rt, o'ntaga bo'lsak uch butun to'rt o'ndan.", 'Да. Десять плюс двенадцать плюс двенадцать тридцать четыре, делим на десять и получаем три целых четыре десятых.', 'Yes. Ten plus twelve plus twelve is thirty four, over ten gives three point four.'),
        items: [
          { id: 'a', right: true, label: '3,4' },
          { id: 'b', label: '4', hint: L("To'rt uchta qiymatni oddiy qo'shib uchga bo'lganda chiqadi. Lekin ikkilik besh marta uchragan, u o'rtachani pastga tortadi.", 'Четыре выходит, если просто сложить три значения и разделить на три. Но двойка встретилась пять раз и тянет среднее вниз.', 'Four comes from adding the three values and dividing by three. But the two occurred five times and pulls the mean down.') },
        ],
        solution: ['2·5 + 4·3 + 6·2 = 34', '5 + 3 + 2 = 10', '34 : 10 = 3,4'],
      },
      {
        expr: 'X: 1, 5      M: 9, 1',
        question: L('O\'rtacha qiymat nechaga teng?', 'Чему равно среднее значение?', 'What does the mean equal?'),
        ok: L("Ha. To'qqiz qo'shuv besh o'n to'rt, o'nga bo'lsak bir butun to'rt o'ndan. Birlik to'qqiz marta uchragani uchun o'rtacha birga juda yaqin.", 'Да. Девять плюс пять четырнадцать, делим на десять и получаем одна целая четыре десятых. Единица встретилась девять раз, поэтому среднее близко к единице.', 'Yes. Nine plus five is fourteen, over ten gives one point four. The one occurred nine times, so the mean sits close to one.'),
        items: [
          { id: 'a', right: true, label: '1,4' },
          { id: 'b', label: '3', hint: L("Uch bu birlik va beshlikning o'rtasi, ular teng chastotada uchraganda chiqardi. Bu yerda esa birlik to'qqiz marta, beshlik bir marta uchragan.", 'Три это середина между единицей и пятёркой, она вышла бы при равных частотах. Здесь же единица девять раз, а пятёрка один.', 'Three is midway between one and five, which would hold at equal frequencies. Here the one occurs nine times and the five once.') },
        ],
        solution: ['1·9 + 5·1 = 14', '9 + 1 = 10', '14 : 10 = 1,4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — mediana tartiblanmagan qatordan olingan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tartiblanmagan qatorning o'rtasi",
    'Середина неупорядоченного ряда',
    'The middle of an unordered row',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Unga o'n, uch, sakkiz, bir, olti qatori berilgan. U o'rtada turgan sakkizni olib, mediana sakkiz deb yozgan.",
      'Решение Камрона. Ему дан ряд десять, три, восемь, один, шесть. Он взял стоящую в середине восьмёрку и записал медиана восемь.',
      "Kamron's solution. He was given the row ten, three, eight, one, six. He took the eight standing in the middle and wrote median is eight."),
    A('why',
      "Sonlar soni toq, o'rtasi haqiqatan ham uchinchi o'rinda. Lekin bitta qadam tushib qolgan.",
      'Число чисел нечётно, середина действительно на третьем месте. Но один шаг пропущен.',
      'The count is odd and the middle really is the third place. But one step was skipped.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Mediana qatorning qaysi o'rnida turgani haqida emas, qiymatlarning TARTIBI haqida. Tartiblamasdan olingan o'rta son tasodifiy son bo'lib qoladi.",
      'Медиана не о том, какое место в ряду, а о ПОРЯДКЕ значений. Взятое без упорядочивания среднее число оказывается случайным.',
      'The median is not about a position in the row as written, but about the ORDER of the values. A middle taken without ordering is just a random number.',
    ),
    tasks: [
      {
        expr: '10, 3, 8, 1, 6   →   Mₑ = 8 ?',
        question: L(
          "Kamron qaysi qadamni tushirib qoldirgan?",
          'Какой шаг пропустил Камрон?',
          'Which step did Kamron skip?',
        ),
        ok: L(
          "To'g'ri. Tartiblasak bir, uch, olti, sakkiz, o'n chiqadi, o'rtasida esa olti turibdi. Mediana olti.",
          'Верно. Упорядочив, получим один, три, шесть, восемь, десять, а в середине шесть. Медиана шесть.',
          'Correct. Ordered they give one, three, six, eight, ten, and six stands in the middle. The median is six.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Qatorni tartiblamagan, javob olti", 'Не упорядочил ряд, ответ шесть', 'He did not order the row, the answer is six'),
          },
          {
            id: 'b',
            label: L("Xato yo'q, mediana sakkiz", 'Ошибки нет, медиана восемь', 'There is no mistake, the median is eight'),
            hint: L(
              "Sakkizdan kichik uchta son bormi? Bir, uch, olti. Uchta. Sakkizdan katta esa faqat o'n, ya'ni bitta. Demak sakkiz o'rtada emas.",
              'Есть ли три числа меньше восьми? Один, три, шесть. Три числа. А больше восьми только десять, то есть одно. Значит восьмёрка не в середине.',
              'Are there three numbers below eight? One, three, six make three. Above eight only ten, that is one. So eight is not in the middle.',
            ),
          },
        ],
        solution: [
          '1, 3, 6, 8, 10',
          'Mₑ = 6',
          L('Kamron: 10, 3, 8, 1, 6', 'Камрон: 10, 3, 8, 1, 6', 'Kamron: 10, 3, 8, 1, 6'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — bitta chetlashgan qiymat.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Bitta g'alati son nimani buzadi",
    'Что ломает одно странное число',
    'What one odd number breaks',
  ),
  audio: [
    A('mount',
      "Bir, ikki, uch, to'rt, besh. O'rtachasi uch, medianasi ham uch. Endi beshni yuzga almashtiramiz.",
      'Один, два, три, четыре, пять. Среднее три, медиана тоже три. Теперь заменим пять на сто.',
      'One, two, three, four, five. The mean is three and so is the median. Now replace the five with a hundred.'),
    A('why',
      "Bitta son o'zgardi. Ikkala xarakteristika ham shunday keskin o'zgaradimi?",
      'Изменилось одно число. Обе ли характеристики изменятся так же резко?',
      'One number changed. Will both measures shift just as sharply?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Mana nega bitta xarakteristika yetmaydi. Chetlashgan qiymat o'rtachani o'ziga sudrab ketadi, mediana esa joyida qoladi, chunki u qiymatlarga emas, ularning tartibiga qaraydi.",
      'Вот почему одной характеристики мало. Выброс утаскивает среднее за собой, а медиана остаётся на месте, ведь она смотрит не на значения, а на их порядок.',
      'This is why one measure is not enough. An outlier drags the mean along, while the median stays put, since it looks at order rather than at values.',
    ),
    tasks: [
      {
        expr: '1, 2, 3, 4, 100',
        question: L(
          "Yangi qatorning o'rtachasi nechaga teng?",
          'Чему равно среднее нового ряда?',
          'What does the mean of the new row equal?',
        ),
        ok: L(
          "Ha, yigirma ikki. O'rtacha uchdan yigirma ikkiga sakradi, holbuki qatordagi to'rtta son o'z joyida qoldi.",
          'Да, двадцать два. Среднее скакнуло с трёх до двадцати двух, хотя четыре числа ряда остались на месте.',
          'Yes, twenty two. The mean jumped from three to twenty two, although four numbers of the row never moved.',
        ),
        items: [
          { id: 'a', right: true, label: '22' },
          { id: 'b', label: '3', hint: L("Uch bu ESKI qatorning o'rtachasi. Yuzni qo'shsak, yig'indi bir yuz o'nga aylanadi, uni beshga bo'ling.", 'Три это среднее СТАРОГО ряда. Со ста сумма становится сто десять, раздели её на пять.', 'Three was the mean of the OLD row. With the hundred the sum becomes one hundred ten, divide it by five.') },
        ],
        solution: ['1 + 2 + 3 + 4 + 100 = 110', '110 : 5 = 22'],
      },
      {
        expr: '1, 2, 3, 4, 100',
        question: L(
          "Yangi qatorning medianasi nechaga teng?",
          'Чему равна медиана нового ряда?',
          'What does the median of the new row equal?',
        ),
        ok: L(
          "Ha, uch. Qator allaqachon tartiblangan, o'rtada esa o'sha uchlik turibdi. Mediana chetlashgan qiymatni sezmadi.",
          'Да, три. Ряд уже упорядочен, а в середине стоит всё та же тройка. Медиана выброса не заметила.',
          'Yes, three. The row is already ordered and the same three stands in the middle. The median never noticed the outlier.',
        ),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '22', hint: L("Yigirma ikki bu o'rtacha, mediana emas. Medianani topish uchun hisoblash kerak emas, o'rtada turgan sonni ko'rish kifoya.", 'Двадцать два это среднее, а не медиана. Для медианы считать не нужно, достаточно увидеть число в середине.', 'Twenty two is the mean, not the median. The median needs no computing, just look at the number in the middle.') },
        ],
        solution: ['1, 2, 3, 4, 100', 'Mₑ = 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: moda, mediana, kenglik",
    'Блиц: мода, медиана, размах',
    'Blitz: mode, median, range',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'tartiblashni-unutish',
        ask: L(
          "Medianani topish uchun qator tartiblanishi shartmi?",
          'Обязательно ли упорядочивать ряд, чтобы найти медиану?',
          'Must the row be ordered to find the median?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha, shart', 'Да, обязательно', 'Yes, it must') },
          { id: 'no', label: L("Yo'q, shart emas", 'Нет, не обязательно', 'No, it need not') },
        ],
        ok: L(
          "To'g'ri. Tartiblamasdan olingan o'rta son mediana emas, tasodifiy son bo'lib qoladi.",
          'Верно. Взятое без упорядочивания среднее число это не медиана, а случайное число.',
          'Correct. A middle taken without ordering is not the median but a random number.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron aynan shu qadamni tushirib qoldirgan.",
          'Вспомни 12 экран: Камрон пропустил именно этот шаг.',
          'Recall screen 12: this is exactly the step Kamron skipped.',
        ),
      },
      {
        id: 'q2',
        tag: 'modani-chastota-bilan-adashtirish',
        ask: L(
          "Yettilik tanlanmada besh marta uchradi. Moda nechaga teng?",
          'Семёрка встретилась в выборке пять раз. Чему равна мода?',
          'A seven occurred five times in the sample. What does the mode equal?',
        ),
        options: [
          { id: 'seven', right: true, label: '7' },
          { id: 'five', label: '5' },
        ],
        ok: L(
          "To'g'ri. Besh bu chastota, ya'ni necha marta uchragani. Moda esa qiymatning o'zi.",
          'Верно. Пять это частота, то есть сколько раз встретилось. А мода это само значение.',
          'Correct. Five is the frequency, how many times it occurred. The mode is the value itself.',
        ),
        hint: L(
          "5-ekranni eslang: u yerda sakkizlik ikki marta uchragan, moda esa sakkiz edi.",
          'Вспомни 5 экран: там восьмёрка встретилась дважды, а модой была восьмёрка.',
          'Recall screen 5: the eight occurred twice there, and the mode was eight.',
        ),
      },
      {
        id: 'q3',
        tag: 'kenglikni-notogri-olish',
        ask: L(
          "Kenglik qanday amal bilan topiladi?",
          'Каким действием находится размах?',
          'By which operation is the range found?',
        ),
        options: [
          { id: 'sub', right: true, label: L('Ayirish bilan', 'Вычитанием', 'By subtraction') },
          { id: 'add', label: L("Qo'shish bilan", 'Сложением', 'By addition') },
        ],
        ok: L(
          "To'g'ri. Eng kattadan eng kichigi ayiriladi.",
          'Верно. Из наибольшего вычитается наименьшее.',
          'Correct. The smallest is subtracted from the largest.',
        ),
        hint: L(
          "6-ekranni eslang: yigirma yetti minus sakkiz o'n to'qqiz bergandi.",
          'Вспомни 6 экран: двадцать семь минус восемь дало девятнадцать.',
          'Recall screen 6: twenty seven minus eight gave nineteen.',
        ),
      },
      {
        id: 'q4',
        tag: 'bitta-son-yetarli-emas',
        ask: L(
          "Bitta chetlashgan katta son qaysi xarakteristikani kuchli o'zgartiradi?",
          'Какую характеристику сильно меняет одно выделяющееся большое число?',
          'Which measure does a single large outlier change strongly?',
        ),
        options: [
          { id: 'mean', right: true, label: L("O'rtachani", 'Среднее', 'The mean') },
          { id: 'med', label: L('Medianani', 'Медиану', 'The median') },
        ],
        ok: L(
          "To'g'ri. O'rtacha barcha qiymatlarni qo'shadi, shuning uchun katta son uni o'ziga tortadi. Mediana esa faqat tartibga qaraydi.",
          'Верно. Среднее складывает все значения, поэтому большое число тянет его к себе. А медиана смотрит только на порядок.',
          'Correct. The mean adds every value, so a large number pulls it along. The median looks only at order.',
        ),
        hint: L(
          "13-ekranni eslang: yuzni qo'shganda o'rtacha uchdan yigirma ikkiga sakragandi, mediana esa uchligicha qolgandi.",
          'Вспомни 13 экран: со ста среднее скакнуло с трёх до двадцати двух, а медиана осталась тройкой.',
          'Recall screen 13: with the hundred the mean jumped from three to twenty two while the median stayed three.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Bitta son kam, to'rttasi ko'p narsani aytadi",
    'Одного числа мало, четыре говорят многое',
    'One number is too few, four say a lot',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda ikkita butunlay boshqa guruhning o'rtachasi bir xil chiqdi. Bugungi dars shu kamchilikni to'ldirdi.",
      'На первом экране у двух совершенно разных групп среднее оказалось одинаковым. Сегодняшний урок восполнил этот пробел.',
      'On the first screen two quite different groups shared the same average. Today filled that gap.'),
    A('s1',
      "Siz modani, medianani va kenglikni topishni o'rgandingiz hamda chetlashgan qiymat o'rtachani sudrab ketishini ko'rdingiz.",
      'Ты научился находить моду, медиану и размах и увидел, как выброс утаскивает среднее.',
      'You learned to find the mode, the median and the range, and saw an outlier drag the mean away.'),
    A('s2',
      "Keyingi darsda chastota va ehtimollik.",
      'В следующем уроке частота и вероятность.',
      'The next lesson covers frequency and probability.'),
  ],
  props: {
    mark: 'R = max − min',
    markNote: L(
      "kenglik tarqoqlikni o'lchaydi",
      'размах измеряет разброс',
      'the range measures the spread',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: chastota va ehtimollik',
      'Следующий урок: частота и вероятность',
      'Next lesson: frequency and probability',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'bitta-son-yetarli-emas', ...S2 },
  { role: 'explain',  tool: 'sortrow', tag: 'tartiblashni-unutish', ...S3 },
  { role: 'explain',  tag: 'tartiblashni-unutish', ...S4 },
  { role: 'explain',  tag: 'modani-chastota-bilan-adashtirish', ...S5 },
  { role: 'explain',  tag: 'kenglikni-notogri-olish', ...S6 },
  { role: 'explain',  tag: 'bitta-son-yetarli-emas', ...S7 },
  { role: 'rule',     tag: 'tartiblashni-unutish', ...S8 },
  { role: 'practice', tool: 'sortrow', tag: 'tartiblashni-unutish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'modani-chastota-bilan-adashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'bitta-son-yetarli-emas', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'tartiblashni-unutish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'bitta-son-yetarli-emas', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
