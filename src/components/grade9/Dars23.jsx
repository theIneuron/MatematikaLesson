// ============================================================================
// 9-sinf, Dars 23. ARIFMETIK PROGRESSIYA YIG'INDISI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 30-§ (158-160-bet).
//   1-masala (158-bet): birdan yuzgacha natural sonlar yig'indisi.
//       Yig'indi IKKI MARTA yoziladi — to'g'ri va teskari tartibda — va
//       hadma-had qo'shiladi: 2S = yuzta 101, S = 5050. Bu darsning XUKI.
//   Teorema (158-159-bet): S_n = (a_1 + a_n)/2 · n, isboti xuddi shu
//       usul bilan: (2) va (3) tengliklarni qo'shish.
//   2-masala (159-bet): birinchi n ta natural son yig'indisi n(n+1)/2.
//   3-masala (159-bet): 38 + 35 + 32 + ... + (−7). Avval n topiladi
//       (n = 16), keyin yig'indi: S_16 = 248. IKKI QADAMLI masala.
//   4-masala (159-160-bet): birdan boshlab nechta natural son olinsa,
//       yig'indi 153 bo'ladi. Formulaning IKKINCHI ko'rinishi
//       S_n = (2a_1 + (n − 1)d)/2 · n ishlatiladi, kvadrat tenglama
//       n² + n − 306 = 0 chiqadi, ildizlari −18 va 17, va MANFIY ildIZ
//       RAD ETILADI: «число слагаемых не может быть отрицательным».
//       Bu 19-darsdagi «javobni ma'no bilan kesish» qadamining o'zi.
//   Mashqlar 374-379 (160-bet) — mashq va transfer ekranlarida.
//
// ASBOB: `SeqTable` (Dars21) UCHINCHI marta, endi YANGI mazmun bilan:
// jadval hadlarni emas, QISMIY YIG'INDILARNI to'ldiradi (S_1, S_2, ...).
// Qo'l harakati o'sha bo'lgani uchun yangi asbob kerak emas, lekin
// jadvalning ma'nosi boshqa — o'quvchi yig'indining o'sishini ko'radi.
//
// TEGLAR (o'zining):
//   yigindini-had-bilan-adashtirish — S_n ni a_n bilan adashtirish
//   juftlar-sonini-notogri-olish    — juftlar soni n ta emas, n bo'lingan
//                                      ikki ekanini unutish
//   n-ni-topmasdan-yigindiga-otish  — hadlar sonini topmasdan yig'indi
//                                      formulasiga o'tish
//   manfiy-ildizni-rad-etmaslik     — hadlar soni manfiy chiqqan ildizni
//                                      javobda qoldirish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SeqTable } from './asboblar.jsx'

export const META = {
  id: 'grade9-23',
  n: 23,
  row: 23,
  block: 'Б4',
  topic: L("Arifmetik progressiya yig'indisi", 'Сумма арифметической прогрессии', 'Sum of an arithmetic progression'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Yig'indini ikki marta, to'g'ri va teskari tartibda yozib qo'shsak, barcha juftlar bir xil bo'ladi",
    'Если записать сумму дважды, в прямом и обратном порядке, и сложить, все пары окажутся одинаковыми',
    'If the sum is written twice, forwards and backwards, and added, all the pairs come out the same',
  ),
  L(
    "Birinchi n ta hadning yig'indisi: chekka ikki hadning o'rtasini hadlar soniga ko'paytirish",
    'Сумма первых n членов: среднее двух крайних членов умножить на число членов',
    'The sum of the first n terms: the mean of the two outer terms times the number of terms',
  ),
  L(
    "Oxirgi had noma'lum bo'lsa, uning o'rniga a_1 va d qo'yiladi va formula faqat d orqali yoziladi",
    'Если последний член неизвестен, вместо него подставляют a_1 и d, и формула записывается только через d',
    'If the last term is unknown, a_1 and d are substituted for it, and the formula is written through d alone',
  ),
]

export const MISS = {
  'yigindini-had-bilan-adashtirish': {
    what: L(
      "yig'indi S_n hadning o'zi a_n bilan adashtirildi",
      'сумма S_n перепутана с самим членом a_n',
      'the sum S_n was confused with the term a_n itself',
    ),
    wrong: null,
    at: 0,
  },
  'juftlar-sonini-notogri-olish': {
    what: L(
      "juftlar soni noto'g'ri olindi",
      'неверно взято число пар',
      'the number of pairs was taken incorrectly',
    ),
    wrong: null,
    at: 0,
  },
  'n-ni-topmasdan-yigindiga-otish': {
    what: L(
      "hadlar soni topilmasdan yig'indi formulasiga o'tildi",
      'к формуле суммы перешли, не найдя число членов',
      'the sum formula was used without first finding the number of terms',
    ),
    wrong: null,
    at: 0,
  },
  'manfiy-ildizni-rad-etmaslik': {
    what: L(
      "hadlar soni manfiy chiqqan ildiz javobda qoldirildi",
      'корень с отрицательным числом слагаемых оставлен в ответе',
      'a root giving a negative count of terms was kept in the answer',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 1-masalasi.
// ============================================================
const S1 = {
  eyebrow: L('YUZTA SONNI TEZ', 'СТО ЧИСЕЛ БЫСТРО', 'A HUNDRED NUMBERS FAST'),
  title: L(
    "Birdan yuzgacha barcha sonlarni qo'shish",
    'Сложить все числа от одного до ста',
    'Add every number from one to a hundred',
  ),
  audio: [
    A('mount',
      "Birdan yuzgacha barcha natural sonlarni qo'shish kerak. Birma-bir qo'shish uzoq: yuzta amal.",
      'Нужно сложить все натуральные числа от одного до ста. Складывать по одному долго: сто действий.',
      'You need to add every natural number from one to a hundred. Adding one by one is slow: a hundred operations.'),
    A('why',
      "Bu progressiya, ayirmasi bir. Uning tuzilishidan foydalanib, hisobni qisqartirish mumkin.",
      'Это прогрессия с разностью один. Пользуясь её устройством, счёт можно сократить.',
      'This is a progression with difference one. Using its structure, the count can be shortened.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Birinchi va oxirgi sonni qo'shsak yuz bir. Ikkinchi va oxiridan ikkinchisini qo'shsak nechchi?",
      'Сложим первое и последнее число, получится сто один. А второе и предпоследнее?',
      'Adding the first and the last gives a hundred and one. What about the second and the second to last?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L('Yana yuz bir', 'Тоже сто один', 'A hundred and one again'),
      },
      {
        id: 'wrong',
        show: L('Boshqa son', 'Другое число', 'A different number'),
        hint: L(
          "Ikki qo'shi to'qson to'qqiz: bu ham yuz bir. Bir tomondan bitta qo'shildi, ikkinchisidan bitta ayirildi.",
          'Два плюс девяносто девять: это тоже сто один. С одной стороны прибавилась единица, с другой убавилась.',
          'Two plus ninety nine: also a hundred and one. One was added on one side and taken away on the other.',
        ),
      },
    ],
    after: L(
      "To'g'ri, va bu butun mavzuning kaliti: chekkadan olingan juftlar hammasi bir xil. Bugun shu narsani formulaga aylantiramiz.",
      'Верно, и это ключ ко всей теме: все пары, взятые с краёв, одинаковы. Сегодня превратим это в формулу.',
      'Correct, and this is the key to the whole topic: all pairs taken from the ends are equal. Today we turn this into a formula.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 22-darsdan: a_n formulasi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Yig'indi va had ikki xil narsa",
    'Сумма и член это разные вещи',
    'The sum and a term are different things',
  ),
  audio: [
    A('mount',
      "22-darsda a n hadning o'zini bildirardi. Bugun yangi belgi kiradi: S n, bu birinchi n ta hadning yig'indisi.",
      'На 22 уроке a n обозначало сам член. Сегодня вводится новое обозначение: S n, это сумма первых n членов.',
      'In lesson 22 a n meant the term itself. Today a new symbol appears: S n, the sum of the first n terms.'),
    A('why',
      "Besh, o'n, o'n besh qatorini oling: uchinchi had o'n besh, lekin birinchi uchtasining yig'indisi boshqa son.",
      'Возьми ряд пять, десять, пятнадцать: третий член пятнадцать, а сумма первых трёх это другое число.',
      'Take the row five, ten, fifteen: the third term is fifteen, but the sum of the first three is a different number.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5, 10, 15, 20, ...', '5, 10, 15, 20, ...', '5, 10, 15, 20, ...')}
      steps={[]}
      ask={L(
        "Birinchi uchta hadning yig'indisi nechaga teng?",
        'Чему равна сумма первых трёх членов?',
        'What does the sum of the first three terms equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '30' },
        {
          id: 'wrong',
          label: '15',
          hint: L(
            "O'n besh bu uchinchi HADNING o'zi. Yig'indi esa uchalasini qo'shish: besh qo'shi o'n qo'shi o'n besh.",
            'Пятнадцать это сам третий ЧЛЕН. А сумма это сложить все три: пять плюс десять плюс пятнадцать.',
            'Fifteen is the third TERM itself. The sum is all three added: five plus ten plus fifteen.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. S uch teng o'ttiz, a uch esa o'n besh. Bu ikki belgini adashtirmaslik kerak.",
        'Верно. S три равно тридцати, а a три равно пятнадцати. Эти два обозначения нельзя путать.',
        'Correct. S three equals thirty, while a three equals fifteen. These two symbols must not be confused.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — DARSLIKNING USULI: ikki marta yozish.
// ============================================================
const S3 = {
  eyebrow: L('IKKI MARTA YOZISH', 'ЗАПИСАТЬ ДВАЖДЫ', 'WRITE IT TWICE'),
  title: L(
    "Teskari tartibda yozib, qo'shish",
    'Записать в обратном порядке и сложить',
    'Write it backwards and add',
  ),
  audio: [
    A('mount',
      "Yig'indini ikki marta yozamiz: birinchisini birdan yuzgacha, ikkinchisini yuzdan birgacha. Keyin ustma-ust qo'shamiz.",
      'Запишем сумму дважды: первый раз от одного до ста, второй от ста до одного. Потом сложим столбиком.',
      'We write the sum twice: first from one to a hundred, then from a hundred to one. Then we add them term by term.'),
    A('why',
      "Har bir ustunda yuz bir chiqadi, chunki bir tomon o'sganda ikkinchisi shuncha kamayadi.",
      'В каждом столбце получается сто один, потому что насколько растёт одна сторона, настолько убывает другая.',
      'Each column gives a hundred and one, because as one side grows the other falls by the same amount.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('S = 1 + 2 + ... + 100', 'S = 1 + 2 + ... + 100', 'S = 1 + 2 + ... + 100')}
      steps={[
        { id: 'a', head: L('Teskari tartibda', 'В обратном порядке', 'Backwards'), lines: ['S = 100 + 99 + ... + 1'] },
        { id: 'b', head: L('Qo\'shamiz', 'Складываем', 'Add them'), lines: ['2S = 101 + 101 + ... + 101'] },
      ]}
      ask={L(
        "Yuz bir nechta marta takrorlanadi?",
        'Сколько раз повторяется сто один?',
        'How many times does a hundred and one repeat?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Yuz marta', 'Сто раз', 'A hundred times') },
        {
          id: 'wrong',
          label: L('Ellik marta', 'Пятьдесят раз', 'Fifty times'),
          hint: L(
            "Har bir hadga bittadan ustun to'g'ri keladi, hadlar esa yuzta. Ellik bu juftlar soni, lekin bu yerda hozircha ustunlar sanaladi.",
            'На каждый член приходится по одному столбцу, а членов сто. Пятьдесят это число пар, но здесь пока считаются столбцы.',
            'Each term gets one column, and there are a hundred terms. Fifty is the number of pairs, but here we are counting columns.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki S teng yuz bir karra yuz, demak S teng yuz bir karra ellik, ya'ni besh ming ellik.",
        'Верно. Два S равно сто один на сто, значит S равно сто один на пятьдесят, то есть пять тысяч пятьдесят.',
        'Correct. Two S equals a hundred and one times a hundred, so S equals a hundred and one times fifty, that is five thousand fifty.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — NEGA HAR BIR JUFT BIR XIL.
// ============================================================
const S4 = {
  eyebrow: L('NEGA BIR XIL', 'ПОЧЕМУ ОДИНАКОВЫ', 'WHY THEY ARE EQUAL'),
  title: L(
    "Bir tomon o'sadi, ikkinchisi shuncha kamayadi",
    'Одна сторона растёт, другая на столько же убывает',
    'One side grows, the other falls by as much',
  ),
  audio: [
    A('mount',
      "Chapdan o'ngga yurganda hadlar d ga o'sadi, o'ngdan chapga yurganda esa d ga kamayadi. Shuning uchun juftning yig'indisi o'zgarmaydi.",
      'Идя слева направо, члены растут на d, а идя справа налево, убывают на d. Поэтому сумма пары не меняется.',
      'Going left to right the terms grow by d, going right to left they fall by d. So the sum of a pair does not change.'),
    A('why',
      "Bu faqat yuzta son uchun emas, har qanday arifmetik progressiya uchun ishlaydi.",
      'Это работает не только для ста чисел, а для любой арифметической прогрессии.',
      'This works not only for a hundred numbers but for any arithmetic progression.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Nega ikkinchi va oxiridan ikkinchi hadning yig'indisi chekkalarnikiga teng?",
        'Почему сумма второго и предпоследнего члена равна сумме крайних?',
        'Why does the sum of the second and second-to-last equal the sum of the outer two?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Biri d ga oshdi, ikkinchisi d ga kamaydi", 'Один вырос на d, другой на d уменьшился', 'One grew by d, the other fell by d'),
        },
        {
          id: 'wrong',
          label: L('Bu faqat tasodif', 'Это просто совпадение', 'It is just a coincidence'),
          hint: L(
            "Qadam hamma joyda bir xil: chapdan bitta qadam oldinga siljisak d qo'shiladi, o'ngdan bitta qadam orqaga siljisak d ayiriladi. Yig'indi o'zgarmaydi.",
            'Шаг везде одинаков: сдвигаясь на шаг слева, прибавляем d, сдвигаясь на шаг справа, вычитаем d. Сумма не меняется.',
            'The step is the same everywhere: moving one step from the left adds d, moving one step from the right subtracts d. The sum is unchanged.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun barcha juftlar bir xil va ularning yig'indisi a bir qo'shi a n ga teng.",
        'Верно. Поэтому все пары одинаковы, и каждая равна a один плюс a n.',
        'Correct. That is why all pairs are equal, each one being a one plus a n.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — UMUMIY FORMULA.
// ============================================================
const S5 = {
  eyebrow: L('UMUMIY FORMULA', 'ОБЩАЯ ФОРМУЛА', 'THE GENERAL FORMULA'),
  title: L(
    "Chekkalarning o'rtasi, hadlar soniga ko'paytirilgan",
    'Среднее крайних, умноженное на число членов',
    'The mean of the outer two, times the number of terms',
  ),
  audio: [
    A('mount',
      "Xuddi shu usul har qanday progressiyaga qo'llaniladi: ikki S teng a bir qo'shi a n, karra n.",
      'Тот же приём применяется к любой прогрессии: два S равно a один плюс a n, умножить на n.',
      'The same trick applies to any progression: two S equals a one plus a n, times n.'),
    A('why',
      "Ikkiga bo'lsak, formulaning o'zi chiqadi.",
      'Разделив на два, получаем саму формулу.',
      'Dividing by two gives the formula itself.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2Sₙ = (a₁ + aₙ)·n', '2Sₙ = (a₁ + aₙ)·n', '2Sₙ = (a₁ + aₙ)·n')}
      steps={[
        { id: 'd', head: L('Ikkiga bo\'lamiz', 'Делим на два', 'Divide by two'), lines: ['Sₙ = (a₁ + aₙ)/2 · n'] },
      ]}
      ask={L(
        "Bu formulani so'z bilan qanday o'qish mumkin?",
        'Как эту формулу прочитать словами?',
        'How can this formula be read in words?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Chekka ikki hadning o'rtasi, hadlar soniga ko'paytirilgan", 'Среднее двух крайних членов, умноженное на число членов', 'The mean of the two outer terms, times the number of terms'),
        },
        {
          id: 'wrong',
          label: L("Birinchi va oxirgi hadning yig'indisi", 'Сумма первого и последнего члена', 'The sum of the first and last term'),
          hint: L(
            "Yig'indining o'zi yetarli emas: u ikkiga bo'linadi va hadlar soniga ko'paytiriladi. Aks holda javob faqat bitta juftni beradi.",
            'Одной суммы мало: её делят на два и умножают на число членов. Иначе ответ даст только одну пару.',
            'The sum alone is not enough: it is halved and multiplied by the number of terms. Otherwise the answer gives only one pair.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu 22-darsdagi xossaga o'xshaydi: o'rtacha qiymatni hadlar soniga ko'paytirsak, yig'indi chiqadi.",
        'Верно. Это перекликается со свойством с 22 урока: среднее значение, умноженное на число членов, даёт сумму.',
        'Correct. This echoes the property from lesson 22: the average value times the number of terms gives the sum.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — IKKINCHI KO'RINISH: a_n noma'lum bo'lsa.
// ============================================================
const S6 = {
  eyebrow: L("OXIRGI HAD NOMA'LUM", 'ПОСЛЕДНИЙ ЧЛЕН НЕИЗВЕСТЕН', 'THE LAST TERM IS UNKNOWN'),
  title: L(
    "Formulaning ikkinchi ko'rinishi",
    'Второй вид формулы',
    'The second form of the formula',
  ),
  audio: [
    A('mount',
      "Ba'zan oxirgi had berilmaydi, faqat birinchi had va ayirma ma'lum. Unda a n o'rniga uning formulasi qo'yiladi.",
      'Иногда последний член не дан, известны только первый член и разность. Тогда вместо a n подставляют его формулу.',
      'Sometimes the last term is not given, only the first term and the difference. Then its formula is substituted for a n.'),
    A('why',
      "22-darsdan: a n teng a bir qo'shi n minus bir karra d.",
      'С 22 урока: a n равно a один плюс n минус один на d.',
      'From lesson 22: a n equals a one plus n minus one times d.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('Sₙ = (a₁ + aₙ)/2 · n', 'Sₙ = (a₁ + aₙ)/2 · n', 'Sₙ = (a₁ + aₙ)/2 · n')}
      steps={[
        { id: 'p', head: L('aₙ o\'rniga', 'Вместо aₙ', 'In place of aₙ'), lines: ['aₙ = a₁ + (n − 1)d'] },
      ]}
      ask={L(
        "Qo'yilgandan keyin surat qanday ko'rinishga keladi?",
        'К какому виду приходит числитель после подстановки?',
        'What form does the numerator take after substitution?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: '2a₁ + (n − 1)d' },
        {
          id: 'wrong',
          label: 'a₁ + (n − 1)d',
          hint: L(
            "Suratda a bir ikki marta uchraydi: bittasi o'zi, ikkinchisi a n ning ichida. Ularni qo'shsak ikki a bir bo'ladi.",
            'В числителе a один встречается дважды: один сам по себе, второй внутри a n. Вместе они дают два a один.',
            'In the numerator a one appears twice: once on its own, once inside a n. Together they make two a one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkinchi ko'rinish: S n teng ikki a bir qo'shi n minus bir karra d, bo'lingan ikki, karra n. Bu yerda oxirgi had kerak emas.",
        'Верно. Второй вид: S n равно два a один плюс n минус один на d, делённое на два, умножить на n. Здесь последний член не нужен.',
        'Correct. The second form: S n equals two a one plus n minus one times d, over two, times n. Here the last term is not needed.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — IKKI QADAMLI MASALA (3-masala).
// ============================================================
const S7 = {
  eyebrow: L('AVVAL N, KEYIN S', 'СНАЧАЛА N, ПОТОМ S', 'FIRST N, THEN S'),
  title: L(
    "Hadlar sonini bilmasdan yig'indini topib bo'lmaydi",
    'Не зная числа членов, сумму не найти',
    'Without the number of terms the sum cannot be found',
  ),
  audio: [
    A('mount',
      "Yig'indi: o'ttiz sakkiz qo'shi o'ttiz besh qo'shi o'ttiz ikki va hokazo, minus yettigacha. Birinchi had o'ttiz sakkiz, ayirma minus uch.",
      'Сумма: тридцать восемь плюс тридцать пять плюс тридцать два и так далее, до минус семи. Первый член тридцать восемь, разность минус три.',
      'The sum: thirty eight plus thirty five plus thirty two and so on, down to minus seven. The first term is thirty eight, the difference is minus three.'),
    A('why',
      "Formulada n turibdi, lekin u berilmagan: avval uni topish kerak.",
      'В формуле стоит n, но оно не дано: сначала нужно его найти.',
      'The formula has n in it, but it is not given: it must be found first.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('38 + 35 + 32 + ... + (−7)', '38 + 35 + 32 + ... + (−7)', '38 + 35 + 32 + ... + (−7)')}
      steps={[
        { id: 'n', head: L('Nechta had', 'Сколько членов', 'How many terms'), lines: ['−7 = 38 + (n − 1)(−3)', '−45 = −3(n − 1),  n = 16'] },
      ]}
      ask={L(
        "Hadlar soni o'n olti. Yig'indi nechaga teng?",
        'Число членов шестнадцать. Чему равна сумма?',
        'The number of terms is sixteen. What does the sum equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '248' },
        {
          id: 'wrong',
          label: '496',
          hint: L(
            "Chekkalarning yig'indisi o'ttiz bir, uni IKKIGA BO'LIB, keyin o'n oltiga ko'paytirish kerak.",
            'Сумма крайних тридцать один, её нужно РАЗДЕЛИТЬ НА ДВА и потом умножить на шестнадцать.',
            'The sum of the outer two is thirty one, it must be HALVED and then multiplied by sixteen.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. O'ttiz bir bo'lingan ikki, karra o'n olti, ikki yuz qirq sakkiz. Bu ikki qadamli masala: avval n, keyin S.",
        'Верно. Тридцать один делить на два, умножить на шестнадцать, двести сорок восемь. Это задача в два шага: сначала n, потом S.',
        'Correct. Thirty one over two, times sixteen, two hundred forty eight. This is a two-step problem: first n, then S.',
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
    "Algebra 9, 30-§, teorema va 1-3-masalalar (158-159-bet)",
    'Алгебра 9, §30, теорема и задачи 1-3 (стр. 158-159)',
    'Algebra 9, §30, the theorem and problems 1-3 (p. 158-159)',
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
          "Nega yig'indi ikki marta yozib qo'shiladi?",
          'Почему сумму записывают дважды и складывают?',
          'Why is the sum written twice and added?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Shunda barcha juftlar bir xil bo'lib qoladi", 'Тогда все пары становятся одинаковыми', 'Then all the pairs become equal'),
          },
          {
            id: 'wrong',
            label: L("Javobni ikki barobar aniq qilish uchun", 'Чтобы ответ был вдвое точнее', 'To make the answer twice as accurate'),
            hint: L(
              "3-ekranni eslang: teskari tartibda yozilganda har bir ustun yuz bir bergan edi. Maqsad aniqlik emas, bir xil juftlar.",
              'Вспомни 3 экран: при обратной записи каждый столбец давал сто один. Цель не точность, а одинаковые пары.',
              'Recall screen 3: written backwards, each column gave a hundred and one. The aim is not accuracy but equal pairs.',
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
    "Juftlar, formula va ikkinchi ko'rinish",
    'Пары, формула и второй вид',
    'Pairs, the formula, and the second form',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz juftlarni topdingiz, formulani chiqardingiz va uning ikkinchi ko'rinishini oldingiz. Endi ular qoida sifatida.",
      'На семи экранах ты нашёл пары, вывел формулу и получил её второй вид. Теперь они в виде правила.',
      'On seven screens you found the pairs, derived the formula, and obtained its second form. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SeqTable, YANGI MAZMUN: qismiy yig'indilar.
// ============================================================
const S9 = {
  eyebrow: L("YIG'INDILAR JADVALI", 'ТАБЛИЦА СУММ', 'A TABLE OF SUMS'),
  title: L(
    "Jadvalda endi hadlar emas, yig'indilar",
    'В таблице теперь не члены, а суммы',
    'The table now holds sums, not terms',
  ),
  audio: [
    A('mount',
      "Progressiya: uch, yetti, o'n bir, o'n besh, o'n to'qqiz. Jadvalga har safar shu paytgacha to'plangan yig'indini qo'ying.",
      'Прогрессия: три, семь, одиннадцать, пятнадцать, девятнадцать. В таблицу ставь сумму, накопленную к этому моменту.',
      'The progression: three, seven, eleven, fifteen, nineteen. Put into the table the sum accumulated so far.'),
    A('why',
      "S bir bu birinchi hadning o'zi, S ikki birinchi ikkitasining yig'indisi va hokazo.",
      'S один это сам первый член, S два сумма первых двух, и так далее.',
      'S one is the first term itself, S two is the sum of the first two, and so on.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('3, 7, 11, 15, 19 → Sₙ', '3, 7, 11, 15, 19 → Sₙ', '3, 7, 11, 15, 19 → Sₙ')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '3', wrong: '7', hint: L("S bir bu faqat birinchi had: uchga teng.", 'S один это только первый член: равен трём.', 'S one is just the first term: it equals three.') },
        { value: '10', wrong: '7', hint: L("Uchga yettini qo'shing: o'n bo'ladi. Yetti bu ikkinchi hadning o'zi, yig'indi emas.", 'К трём прибавь семь: получится десять. Семь это сам второй член, а не сумма.', 'Add seven to three: that makes ten. Seven is the second term itself, not the sum.') },
        { value: '21', wrong: '18', hint: L("O'nga o'n birni qo'shing: yigirma bir.", 'К десяти прибавь одиннадцать: двадцать один.', 'Add eleven to ten: twenty one.') },
        { value: '36', wrong: '33', hint: L("Yigirma birga o'n beshni qo'shing: o'ttiz olti.", 'К двадцати одному прибавь пятнадцать: тридцать шесть.', 'Add fifteen to twenty one: thirty six.') },
        { value: '55', wrong: '50', hint: L("O'ttiz oltiga o'n to'qqizni qo'shing: ellik besh.", 'К тридцати шести прибавь девятнадцать: пятьдесят пять.', 'Add nineteen to thirty six: fifty five.') },
      ]}
      ask={L(
        "Har bir nomer uchun to'plangan yig'indini tanlang",
        'Для каждого номера выбери накопленную сумму',
        'For each index choose the accumulated sum',
      )}
      after={L(
        "Ana xolos. Uch, o'n, yigirma bir, o'ttiz olti, ellik besh. Formulani tekshiring: uch qo'shi o'n to'qqiz, bo'lingan ikki, karra besh, ellik besh.",
        'Вот и всё. Три, десять, двадцать один, тридцать шесть, пятьдесят пять. Проверь формулой: три плюс девятнадцать, делить на два, умножить на пять, пятьдесят пять.',
        'That is all it takes. Three, ten, twenty one, thirty six, fifty five. Check with the formula: three plus nineteen, over two, times five, fifty five.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: formula bo'yicha yig'indi.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Formula bo'yicha hisoblash",
    'Считаем по формуле',
    'Computing with the formula',
  ),
  audio: [
    A('mount',
      "Uchta yig'indi. Har birida chekka hadlar va hadlar soni berilgan.",
      'Три суммы. В каждой даны крайние члены и число членов.',
      'Three sums. In each, the outer terms and the number of terms are given.'),
    A('why',
      "Chekkalarni qo'shing, ikkiga bo'ling, hadlar soniga ko'paytiring.",
      'Сложи крайние, раздели на два, умножь на число членов.',
      'Add the outer two, halve, multiply by the number of terms.'),
  ],
  props: {
    stepLabel: L('Yig\'indi', 'Сумма', 'Sum'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hisoblandi: formula chekka hadlar va ularning soni orqali ishlaydi.",
      'Все три посчитаны: формула работает через крайние члены и их число.',
      'All three are computed: the formula works through the outer terms and their count.',
    ),
    tasks: [
      {
        expr: 'a₁ = 1,  aₙ = 20,  n = 50',
        question: L('Yig\'indi nechaga teng?', 'Чему равна сумма?', 'What does the sum equal?'),
        ok: L("Ha. Bir qo'shi yigirma yigirma bir, bo'lingan ikki, karra ellik: besh yuz yigirma besh.", 'Да. Один плюс двадцать двадцать один, делить на два, умножить на пятьдесят: пятьсот двадцать пять.', 'Yes. One plus twenty is twenty one, over two, times fifty: five hundred twenty five.'),
        items: [
          { id: 'a', right: true, label: '525' },
          { id: 'b', label: '1050', hint: L("Ikkiga bo'lishni unutmang: yigirma bir karra ellik ming ellik, undan yarmi olinadi.", 'Не забудь разделить на два: двадцать один на пятьдесят тысяча пятьдесят, из них берётся половина.', 'Do not forget to halve: twenty one times fifty is one thousand fifty, and half of that is taken.') },
        ],
        solution: ['S = (1 + 20)/2 · 50 = 525'],
      },
      {
        expr: 'a₁ = −1,  aₙ = −40,  n = 20',
        question: L('Yig\'indi nechaga teng?', 'Чему равна сумма?', 'What does the sum equal?'),
        ok: L("Ha. Minus bir qo'shi minus qirq minus qirq bir, bo'lingan ikki, karra yigirma: minus to'rt yuz o'n.", 'Да. Минус один плюс минус сорок минус сорок один, делить на два, умножить на двадцать: минус четыреста десять.', 'Yes. Minus one plus minus forty is minus forty one, over two, times twenty: minus four hundred ten.'),
        items: [
          { id: 'a', right: true, label: '−410' },
          { id: 'b', label: '410', hint: L("Ikkala had ham manfiy, demak yig'indi ham manfiy chiqadi.", 'Оба члена отрицательны, значит и сумма получится отрицательной.', 'Both terms are negative, so the sum comes out negative too.') },
        ],
        solution: ['S = (−1 + (−40))/2 · 20 = −410'],
      },
      {
        expr: '2 + 3 + 4 + ... + 98',
        question: L(
          "Ikkidan to'qson sakkizgacha barcha natural sonlar yig'indisi nechaga teng?",
          'Чему равна сумма всех натуральных чисел от двух до девяноста восьми?',
          'What does the sum of all naturals from two to ninety eight equal?',
        ),
        ok: L("Ha. Hadlar soni to'qson yetti, chekkalarning yig'indisi yuz: ellik karra to'qson yetti, to'rt ming sakkiz yuz ellik.", 'Да. Число членов девяносто семь, сумма крайних сто: пятьдесят на девяносто семь, четыре тысячи восемьсот пятьдесят.', 'Yes. The number of terms is ninety seven, the outer sum is a hundred: fifty times ninety seven, four thousand eight hundred fifty.'),
        items: [
          { id: 'a', right: true, label: '4850' },
          { id: 'b', label: '4900', hint: L("Hadlar soniga diqqat: ikkidan to'qson sakkizgacha to'qson olti emas, to'qson yetti ta son bor. Chekkalarni ham sanang.", 'Внимательнее с числом членов: от двух до девяноста восьми не девяносто шесть, а девяносто семь чисел. Крайние тоже считаются.', 'Careful with the count: from two to ninety eight there are ninety seven numbers, not ninety six. The ends count too.') },
        ],
        solution: [L('Hadlar soni: 98 − 2 + 1 = 97', 'Число членов: 98 − 2 + 1 = 97', 'Number of terms: 98 − 2 + 1 = 97'), 'S = (2 + 98)/2 · 97 = 4850'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: qaysi ko'rinish qulay.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Qaysi ko'rinishni tanlash",
    'Какой вид формулы выбрать',
    'Which form of the formula to choose',
  ),
  audio: [
    A('mount',
      "Har savolda nima berilgani boshqacha. Shunga qarab formulaning qaysi ko'rinishi qulay ekanini tanlang.",
      'В каждом вопросе дано разное. В зависимости от этого выбери, какой вид формулы удобнее.',
      'Each question gives different data. Based on that, choose which form of the formula is more convenient.'),
    A('why',
      "Oxirgi had berilgan bo'lsa birinchi ko'rinish, ayirma berilgan bo'lsa ikkinchisi.",
      'Если дан последний член, первый вид, если дана разность, второй.',
      'If the last term is given, the first form; if the difference is given, the second.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tanlandi: qaysi ko'rinish qulayligini BERILGAN ma'lumot hal qiladi.",
      'Все три выбраны: какой вид удобнее, решают ДАННЫЕ условия.',
      'All three are chosen: which form is convenient is decided by the given data.',
    ),
    tasks: [
      {
        expr: 'a₁ = 5,  a₂₀ = 62,  n = 20',
        question: L('Qaysi ko\'rinish qulay?', 'Какой вид удобнее?', 'Which form is convenient?'),
        ok: L("Ha. Ikkala chekka had ham berilgan, ayirmani hisoblash shart emas.", 'Да. Оба крайних члена даны, разность считать не нужно.', 'Yes. Both outer terms are given, no need to compute the difference.'),
        items: [
          { id: 'a', right: true, label: 'Sₙ = (a₁ + aₙ)/2 · n' },
          { id: 'b', label: 'Sₙ = (2a₁ + (n − 1)d)/2 · n', hint: L("Ikkinchi ko'rinish ayirmani talab qiladi, u esa berilmagan. Chekka hadlar tayyor turibdi.", 'Второй вид требует разность, а её не дали. Крайние члены уже готовы.', 'The second form needs the difference, which is not given. The outer terms are already there.') },
        ],
        solution: ['S = (5 + 62)/2 · 20 = 670'],
      },
      {
        expr: 'a₁ = −5,  d = 0,5,  n = 12',
        question: L('Qaysi ko\'rinish qulay?', 'Какой вид удобнее?', 'Which form is convenient?'),
        ok: L("Ha. Oxirgi had berilmagan, lekin ayirma bor: ikkinchi ko'rinish uni to'g'ridan-to'g'ri ishlatadi.", 'Да. Последний член не дан, но есть разность: второй вид использует её напрямую.', 'Yes. The last term is not given, but the difference is: the second form uses it directly.'),
        items: [
          { id: 'a', right: true, label: 'Sₙ = (2a₁ + (n − 1)d)/2 · n' },
          { id: 'b', label: 'Sₙ = (a₁ + aₙ)/2 · n', hint: L("Birinchi ko'rinish uchun avval oxirgi hadni hisoblash kerak bo'ladi, bu qo'shimcha qadam.", 'Для первого вида придётся сначала посчитать последний член, это лишний шаг.', 'The first form would need the last term computed first, an extra step.') },
        ],
        solution: ['S = (2·(−5) + 11·0,5)/2 · 12 = −27'],
      },
      {
        expr: '1 + 2 + ... = 153',
        question: L(
          "Birdan boshlab ketma-ket sonlar qo'shiladi. Bu yerda noma'lum nima?",
          'Складываются подряд идущие числа, начиная с одного. Что здесь неизвестно?',
          'Consecutive numbers starting from one are added. What is unknown here?',
        ),
        ok: L("Ha. Bu safar yig'indi berilgan, topilishi kerak bo'lgan esa hadlar soni.", 'Да. На этот раз дана сумма, а найти нужно число членов.', 'Yes. This time the sum is given, and the number of terms must be found.'),
        items: [
          { id: 'a', right: true, label: L('Hadlar soni n', 'Число членов n', 'The number of terms n') },
          { id: 'b', label: L('Yig\'indi S', 'Сумма S', 'The sum S'), hint: L("Yig'indi bir yuz ellik uch deb aytilgan, demak u ma'lum. Noma'lum esa nechta had olinganligi.", 'Сумма названа: сто пятьдесят три, значит она известна. Неизвестно, сколько членов взято.', 'The sum is stated as one hundred fifty three, so it is known. What is unknown is how many terms were taken.') },
        ],
        solution: [L('Berilgan: a₁ = 1, d = 1, S = 153', 'Дано: a₁ = 1, d = 1, S = 153', 'Given: a₁ = 1, d = 1, S = 153'), L('Topiladi: n', 'Найти: n', 'Find: n')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Sanjar manfiy ildizni javobda qoldirgan.
// Darslikning 4-masalasidagi aynan shu qadam.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Hadlar soni manfiy bo'la oladimi",
    'Может ли число слагаемых быть отрицательным',
    'Can the number of terms be negative',
  ),
  audio: [
    A('mount',
      "Sanjarning yechimi. Birdan boshlab nechta natural son olinsa yig'indi bir yuz ellik uch bo'ladi. U kvadrat tenglamani to'g'ri yechib, minus o'n sakkiz va o'n yetti ildizlarini topgan va ikkalasini ham javobga yozgan.",
      'Решение Санжара. Сколько натуральных чисел, начиная с одного, нужно взять, чтобы сумма была сто пятьдесят три. Он верно решил квадратное уравнение, нашёл корни минус восемнадцать и семнадцать и записал в ответ оба.',
      "Sanjar's solution. How many naturals starting from one give a sum of one hundred fifty three. He solved the quadratic correctly, found the roots minus eighteen and seventeen, and wrote both in the answer."),
    A('why',
      "Ikkala ildiz ham tenglamani qanoatlantiradi. Lekin n bu yerda nimani bildiradi?",
      'Оба корня удовлетворяют уравнению. Но что здесь означает n?',
      'Both roots satisfy the equation. But what does n mean here?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "N bu hadlar soni, u manfiy bo'la olmaydi: minus o'n sakkiz rad etiladi, javob o'n yetti. Bu 19-darsdagi ma'no bo'yicha kesishning o'zi.",
      'N это число слагаемых, оно не может быть отрицательным: минус восемнадцать отбрасывается, ответ семнадцать. Это то же отсечение по смыслу, что на 19 уроке.',
      'N is the number of terms, which cannot be negative: minus eighteen is rejected, the answer is seventeen. This is the same cutting by meaning as in lesson 19.',
    ),
    tasks: [
      {
        expr: 'n² + n − 306 = 0,   n₁ = −18,  n₂ = 17',
        question: L(
          "Sanjar ikkala ildizni ham javobga yozdi. N bu yerda nimani bildiradi va u manfiy bo'la oladimi?",
          'Санжар записал в ответ оба корня. Что здесь означает n и может ли оно быть отрицательным?',
          'Sanjar wrote both roots in the answer. What does n mean here, and can it be negative?',
        ),
        ok: L(
          "To'g'ri: n bu qo'shiluvchilar soni, u manfiy bo'la olmaydi. Minus o'n sakkiz matematik jihatdan ildiz, lekin masalaning ma'nosiga zid: javob faqat o'n yetti.",
          'Верно: n это число слагаемых, оно не может быть отрицательным. Минус восемнадцать математически корень, но противоречит смыслу задачи: ответ только семнадцать.',
          'Correct: n is the number of terms, which cannot be negative. Minus eighteen is mathematically a root but contradicts the meaning: the answer is only seventeen.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Hadlar soni, manfiy bo'la olmaydi", 'Число слагаемых, отрицательным быть не может', 'The number of terms, it cannot be negative'),
          },
          {
            id: 'b',
            label: L("Oddiy noma'lum, ikkala ildiz ham javob", 'Обычное неизвестное, оба корня подходят', 'An ordinary unknown, both roots fit'),
            hint: L("Minus o'n sakkizta qo'shiluvchi bo'lishi mumkinmi? Qo'shiluvchilar sanaladi, sanoq esa manfiy bo'lmaydi.", 'Может ли быть минус восемнадцать слагаемых? Слагаемые считают, а счёт не бывает отрицательным.', 'Can there be minus eighteen terms? Terms are counted, and a count is never negative.'),
          },
        ],
        solution: [
          'n₁ = −18,  n₂ = 17',
          L("n — hadlar soni, manfiy bo'lmaydi", 'n это число слагаемых, отрицательным не бывает', 'n is a count of terms, never negative'),
          L("To'g'ri javob: n = 17", 'Верный ответ: n = 17', 'Correct answer: n = 17'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 4-masalasi to'liq.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Yig'indi berilgan, hadlar soni izlanadi",
    'Дана сумма, ищется число членов',
    'The sum is given, the number of terms is sought',
  ),
  audio: [
    A('mount',
      "Darslikning masalasi: birdan boshlab ketma-ket natural sonlar olinadi. Ularning yig'indisi bir yuz ellik uchga teng bo'lishi uchun nechta son kerak?",
      'Задача учебника: берут подряд натуральные числа, начиная с одного. Сколько чисел нужно, чтобы их сумма равнялась ста пятидесяти трём?',
      'A textbook problem: consecutive naturals are taken starting from one. How many are needed for their sum to equal one hundred fifty three?'),
    A('why',
      "Oxirgi had noma'lum, shuning uchun ikkinchi ko'rinish olinadi. Natijada n ga nisbatan kvadrat tenglama chiqadi.",
      'Последний член неизвестен, поэтому берётся второй вид. В итоге получается квадратное уравнение относительно n.',
      'The last term is unknown, so the second form is used. This gives a quadratic equation in n.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: o'n yettita son. Tekshirish oson, chunki birdan o'n yettigacha yig'indi formulasi n karra n qo'shi bir, bo'lingan ikki.",
      'Найдено: семнадцать чисел. Проверить легко, ведь сумма от одного до семнадцати это n на n плюс один, делить на два.',
      'Found: seventeen numbers. Easy to check, since the sum from one to seventeen is n times n plus one, over two.',
    ),
    tasks: [
      {
        expr: '1 + 2 + ... + n = 153',
        question: L(
          "Ikkinchi ko'rinishga qo'yilgandan keyin qanday tenglama hosil bo'ladi?",
          'Какое уравнение получается после подстановки во второй вид?',
          'What equation results after substituting into the second form?',
        ),
        ok: L(
          "Ha. Ikki karra bir qo'shi n minus bir, bo'lingan ikki, karra n teng bir yuz ellik uch. Soddalashtirsak n kvadrat qo'shi n minus uch yuz olti teng nol.",
          'Да. Два на один плюс n минус один, делить на два, умножить на n равно ста пятидесяти трём. После упрощения n в квадрате плюс n минус триста шесть равно нулю.',
          'Yes. Two times one plus n minus one, over two, times n equals one hundred fifty three. Simplified: n squared plus n minus three hundred six equals zero.',
        ),
        items: [
          { id: 'a', right: true, label: 'n² + n − 306 = 0' },
          { id: 'b', label: 'n² + n − 153 = 0', hint: L("Ikkala tomonni ikkiga ko'paytiring: bir yuz ellik uch ikki barobar bo'lib, uch yuz olti bo'ladi.", 'Умножь обе части на два: сто пятьдесят три удвоится и станет тремястами шестью.', 'Multiply both sides by two: one hundred fifty three doubles to three hundred six.') },
        ],
        solution: [
          '153 = (2 + (n − 1))/2 · n',
          '306 = n(n + 1)',
          'n² + n − 306 = 0,  n = 17',
        ],
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
    "Blits: juftlar, formula, ma'no",
    'Блиц: пары, формула, смысл',
    'Blitz: pairs, formula, meaning',
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
        tag: 'yigindini-had-bilan-adashtirish',
        ask: L(
          "S beshinchi va a beshinchi bir xil narsani bildiradimi?",
          'Означают ли S пятое и a пятое одно и то же?',
          'Do S five and a five mean the same thing?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. A beshinchi bu beshinchi hadning o'zi, S beshinchi esa birinchi beshtasining yig'indisi.",
          'Верно. A пятое это сам пятый член, а S пятое сумма первых пяти.',
          'Correct. A five is the fifth term itself, while S five is the sum of the first five.',
        ),
        hint: L(
          "2-ekranni eslang: a uch o'n beshga teng edi, S uch esa o'ttizga.",
          'Вспомни 2 экран: a три равнялось пятнадцати, а S три тридцати.',
          'Recall screen 2: a three equalled fifteen, while S three equalled thirty.',
        ),
      },
      {
        id: 'q2',
        tag: 'juftlar-sonini-notogri-olish',
        ask: L(
          "Formulada chekkalarning yig'indisi nimaga bo'linadi?",
          'На что делится сумма крайних членов в формуле?',
          'What is the sum of the outer terms divided by in the formula?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkiga', 'На два', 'By two') },
          { id: 'n', label: L('Hadlar soniga', 'На число членов', 'By the number of terms') },
        ],
        ok: L(
          "To'g'ri. Ikkiga bo'linadi va hadlar soniga KO'PAYTIRILADI.",
          'Верно. Делится на два и УМНОЖАЕТСЯ на число членов.',
          'Correct. It is divided by two and MULTIPLIED by the number of terms.',
        ),
        hint: L(
          "5-ekranni eslang: chekkalarning o'rtasi olinadi, keyin u hadlar soniga ko'paytiriladi.",
          'Вспомни 5 экран: берётся среднее крайних, потом оно умножается на число членов.',
          'Recall screen 5: the mean of the outer two is taken, then multiplied by the number of terms.',
        ),
      },
      {
        id: 'q3',
        tag: 'n-ni-topmasdan-yigindiga-otish',
        ask: L(
          "Hadlar soni noma'lum bo'lsa, uni topmasdan yig'indini hisoblash mumkinmi?",
          'Если число членов неизвестно, можно ли посчитать сумму, не найдя его?',
          'If the number of terms is unknown, can the sum be computed without finding it?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Formulada n bor, shuning uchun avval hadlar soni topiladi.",
          'Верно. В формуле есть n, поэтому сначала находят число членов.',
          'Correct. The formula contains n, so the number of terms is found first.',
        ),
        hint: L(
          "7-ekranni eslang: avval n o'n olti ekani topilgan, keyingina yig'indi hisoblangan.",
          'Вспомни 7 экран: сначала нашли, что n равно шестнадцати, и только потом посчитали сумму.',
          'Recall screen 7: first n was found to be sixteen, and only then the sum was computed.',
        ),
      },
      {
        id: 'q4',
        tag: 'manfiy-ildizni-rad-etmaslik',
        ask: L(
          "Hadlar soni uchun manfiy ildiz javobga kiradimi?",
          'Входит ли отрицательный корень в ответ для числа слагаемых?',
          'Does a negative root belong in the answer for the number of terms?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Sanoq manfiy bo'lmaydi, shuning uchun bunday ildiz rad etiladi.",
          'Верно. Счёт не бывает отрицательным, поэтому такой корень отбрасывается.',
          'Correct. A count is never negative, so such a root is rejected.',
        ),
        hint: L(
          "12-ekranni eslang: Sanjarning xatosi aynan shu edi, va bu 19-darsdagi ma'no bo'yicha kesishning o'zi.",
          'Вспомни 12 экран: именно в этом была ошибка Санжара, и это то же отсечение по смыслу, что на 19 уроке.',
          "Recall screen 12: this was Sanjar's mistake, and it is the same cutting by meaning as in lesson 19.",
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
    "Juftlar, formula va ikki ko'rinish",
    'Пары, формула и два её вида',
    'Pairs, the formula and its two forms',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda chekkadan olingan juftlar bir xil ekanini topdingiz. Bugun shu kuzatuv butun formulani berdi.",
      'На первом экране ты обнаружил, что пары, взятые с краёв, одинаковы. Сегодня это наблюдение дало всю формулу.',
      'On the first screen you found that pairs taken from the ends are equal. Today that observation gave the whole formula.'),
    A('s1',
      "Siz yig'indini ikki marta yozish usulini, formulaning ikki ko'rinishini va hadlar sonini topish qadamini o'rgandingiz.",
      'Ты освоил приём с двойной записью суммы, два вида формулы и шаг нахождения числа членов.',
      'You learned the double-writing trick, the two forms of the formula, and the step of finding the number of terms.'),
    A('s2',
      "Keyingi darsda geometrik progressiya: hadlar qo'shilmaydi, ko'paytiriladi.",
      'В следующем уроке геометрическая прогрессия: члены не складываются, а умножаются.',
      'The next lesson covers the geometric progression: terms are multiplied, not added.'),
  ],
  props: {
    mark: 'Sₙ = (a₁ + aₙ)/2 · n',
    markNote: L(
      "chekkalarning o'rtasi, hadlar soniga",
      'среднее крайних, на число членов',
      'the mean of the ends, times the count',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: geometrik progressiya',
      'Следующий урок: геометрическая прогрессия',
      'Next lesson: the geometric progression',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'yigindini-had-bilan-adashtirish', ...S2 },
  { role: 'explain',  tag: 'juftlar-sonini-notogri-olish', ...S3 },
  { role: 'explain',  tag: 'juftlar-sonini-notogri-olish', ...S4 },
  { role: 'explain',  tag: 'juftlar-sonini-notogri-olish', ...S5 },
  { role: 'explain',  tag: 'n-ni-topmasdan-yigindiga-otish', ...S6 },
  { role: 'explain',  tag: 'n-ni-topmasdan-yigindiga-otish', ...S7 },
  { role: 'rule',     tag: 'juftlar-sonini-notogri-olish', ...S8 },
  { role: 'practice', tool: 'seqtable', tag: 'yigindini-had-bilan-adashtirish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'juftlar-sonini-notogri-olish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'n-ni-topmasdan-yigindiga-otish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'manfiy-ildizni-rad-etmaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'n-ni-topmasdan-yigindiga-otish', ...S13 },
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
