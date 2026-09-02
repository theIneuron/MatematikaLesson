// ============================================================================
// 9-sinf, Dars 32. EHTIMOLLIK VA STATISTIKAGA OID MASALALAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: V bobga doir mashqlar (213-bet,
// 500-508) va 38-§ ning oxirgi qismi (209-210-bet).
//
// DARS IKKI ISHNI BAJARADI.
//   1) V bobning barcha mavzularini bitta joyga yig'adi: 501, 502
//      (klassik ehtimollik), 503 (kombinatorika bilan: kubik va tanga,
//      n = 6 · 2 = 12), 504-507 (moda, mediana, kenglik, o'rtacha).
//   2) DISPERSIYA va O'RTA KVADRAT CHETLANISHNI kiritadi (38-§,
//      209-210-bet). Ular 28-darsga sig'magandi: u yerda moda,
//      mediana, kenglik va o'rtacha berilgan. 508-mashq esa aynan
//      dispersiyani so'raydi, ya'ni uni tashlab ketib bo'lmaydi.
//
// NEGA DISPERSIYA AYNAN SHU YERDA. 28-darsning xuki «bitta son butun
// tanlanmani tavsiflamaydi» degan edi va kenglik javob bo'lgandi.
// Bugungi xuk shu javobni ham sindiradi: 1, 5, 5, 5, 9 va 1, 1, 5, 9, 9
// tanlanmalarining O'RTACHASI ham, MEDIANASI ham, KENGLIGI ham bir xil
// (5, 5, 8), o'zlari esa boshqa. Kenglik faqat ikkita chekka songa
// qaraydi, o'rtadagilarni ko'rmaydi. Dispersiya esa hammasini sanaydi:
// 6,4 va 12,8, ya'ni ikki barobar farq.
//
// TUZOQ (12-ekran): chetlanishlarni shunchaki qo'shish. Ularning
// yig'indisi HAR DOIM nolga teng, chunki o'rtacha aynan shunday
// tanlangan. Kamron shundan «tarqoqlik nolga teng» degan xulosa
// chiqargan. Kvadratga ko'tarish ixtiro emas, ehtiyoj: minuslar
// plyuslarni yo'q qilmasin.
//
// TRANSFER (13-ekran) darslikning 210-betdagi mulohazasi: agar miqdor
// santimetrda o'lchansa, dispersiya kvadrat santimetrda chiqadi va uni
// o'sish bilan solishtirib bo'lmaydi. Shuning uchun ildiz olinadi —
// sigma o'sha santimetrda bo'ladi. Ya'ni kvadrat ildiz bu «chiroyli
// qilish» emas, o'lchov birligini qaytarish.
//
// YANGI ASBOB YO'Q: `SortRow` (28-dars) medianaga qaytadi, qolgani
// `RecallMC` va `Drill`.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SortRow } from './asboblar.jsx'

export const META = {
  id: 'grade9-32',
  n: 32,
  row: 32,
  block: 'Б5',
  topic: L(
    'Ehtimollik va statistikaga oid masalalar',
    'Задачи на вероятность и статистику',
    'Problems on probability and statistics',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Kenglik faqat ikkita chekka songa qaraydi, dispersiya esa hamma qiymatni sanaydi",
    'Размах смотрит лишь на два крайних числа, а дисперсия учитывает все значения',
    'The range looks only at the two extremes, while the variance counts every value',
  ),
  L(
    "Chetlanishlar kvadratga ko'tariladi, chunki ularning oddiy yig'indisi har doim nol",
    'Отклонения возводят в квадрат, потому что их обычная сумма всегда равна нулю',
    'Deviations are squared because their plain sum is always zero',
  ),
  L(
    "Sigma dispersiyaning kvadrat ildizi, u miqdor bilan bir xil o'lchamda bo'ladi",
    'Сигма это квадратный корень из дисперсии, она в тех же единицах, что и величина',
    'Sigma is the square root of the variance and carries the same unit as the quantity',
  ),
]

export const MISS = {
  'chetlanishlar-yigindisi-nol': {
    what: L(
      "chetlanishlar kvadratsiz qo'shildi va yig'indi nol chiqdi",
      'отклонения сложены без квадратов и сумма вышла нулевой',
      'the deviations were added without squaring and the sum came out zero',
    ),
    wrong: null,
    at: 0,
  },
  'kenglik-yetarli-emas': {
    what: L(
      "tarqoqlik faqat kenglik bilan baholandi",
      'разброс оценён только по размаху',
      'the spread was judged by the range alone',
    ),
    wrong: null,
    at: 0,
  },
  'natijalarni-sanamaslik': {
    what: L(
      "ikkita tajriba birga o'tkazilganda natijalar soni ko'paytirilmadi",
      'при двух опытах сразу число исходов не перемножено',
      'with two experiments at once the outcome counts were not multiplied',
    ),
    wrong: null,
    at: 0,
  },
  'olchov-birligini-unutish': {
    what: L(
      "dispersiyaning o'lchov birligi miqdornikidan farq qilishi unutildi",
      'забыто, что единица дисперсии отличается от единицы величины',
      "it was forgotten that the variance unit differs from the quantity's unit",
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — kenglik ham yetmaydi.
// ============================================================
const S1 = {
  eyebrow: L('YANA BIR XIL', 'СНОВА ОДИНАКОВО', 'THE SAME AGAIN'),
  title: L(
    "Uchta xarakteristika ham bir xil chiqdi",
    'Все три характеристики совпали',
    'All three measures came out equal',
  ),
  audio: [
    A('mount',
      "Ikkita tanlanma. Birinchisi bir, besh, besh, besh, to'qqiz. Ikkinchisi bir, bir, besh, to'qqiz, to'qqiz.",
      'Две выборки. Первая один, пять, пять, пять, девять. Вторая один, один, пять, девять, девять.',
      'Two samples. The first is one, five, five, five, nine. The second is one, one, five, nine, nine.'),
    A('why',
      "Ikkalasining o'rtachasi beshga, medianasi beshga, kengligi sakkizga teng. Lekin ular bir xilmi?",
      'У обеих среднее пять, медиана пять, размах восемь. Но одинаковы ли они?',
      'Both have mean five, median five, and range eight. But are they the same?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "1, 5, 5, 5, 9 va 1, 1, 5, 9, 9. Uchta xarakteristika bir xil. Farq bormi?",
      '1, 5, 5, 5, 9 и 1, 1, 5, 9, 9. Три характеристики совпадают. Есть ли разница?',
      '1, 5, 5, 5, 9 and 1, 1, 5, 9, 9. Three measures agree. Is there a difference?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Bor: ikkinchisida sonlar chekkalarga siljigan",
          'Есть: во второй числа сдвинуты к краям',
          'Yes: in the second the numbers cluster at the ends',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Yo'q: uchta xarakteristika bir xil bo'lsa, tanlanmalar ham bir xil",
          'Нет: если три характеристики совпали, то и выборки одинаковы',
          'No: if three measures agree, the samples are the same',
        ),
        hint: L(
          "Sonlarni birma-bir solishtiring. Birinchisida uchta beshlik bor, ikkinchisida bittasi. Qolganlari esa chekkalarda o'tirishibdi.",
          'Сравни числа по одному. В первой три пятёрки, во второй одна. Остальные сидят по краям.',
          'Compare the numbers one by one. The first has three fives, the second only one. The rest sit at the ends.',
        ),
      },
    ],
    after: L(
      "Ha. Kenglik faqat ikkita chekka songa qaraydi, o'rtadagilarni umuman ko'rmaydi. Bugun hamma qiymatni sanaydigan o'lchov bilan tanishamiz.",
      'Да. Размах смотрит только на два крайних числа и совсем не видит средних. Сегодня познакомимся с мерой, которая считает все значения.',
      'Yes. The range looks only at the two extremes and never sees the middle. Today we meet a measure that counts every value.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — o'rtacha va chetlanish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "O'rtachadan qancha uzoq",
    'Насколько далеко от среднего',
    'How far from the mean',
  ),
  audio: [
    A('mount',
      "Tarqoqlikni o'lchash uchun har bir sonning o'rtachadan qanchalik uzoqligini bilish kerak.",
      'Чтобы измерить разброс, нужно знать, насколько каждое число далеко от среднего.',
      'To measure spread we need to know how far each number lies from the mean.'),
    A('why',
      "Birinchi tanlanmaning o'rtachasi beshga teng. Birinchi soni esa bir.",
      'Среднее первой выборки равно пяти. А её первое число один.',
      'The mean of the first sample is five. Its first number is one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1, 5, 5, 5, 9      X = 5', '1, 5, 5, 5, 9      X = 5', '1, 5, 5, 5, 9      X = 5')}
      steps={[]}
      ask={L(
        "Birinchi sonning o'rtachadan chetlanishi qanday?",
        'Каково отклонение первого числа от среднего?',
        'What is the deviation of the first number from the mean?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '−4' },
        {
          id: 'wrong',
          label: '4',
          hint: L(
            "Bir beshdan KICHIK, demak chetlanish manfiy. Sondan o'rtacha ayiriladi, teskarisi emas.",
            'Один МЕНЬШЕ пяти, значит отклонение отрицательное. Из числа вычитают среднее, а не наоборот.',
            'One is LESS than five, so the deviation is negative. The mean is subtracted from the number, not the other way round.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, minus to'rt. Qolgan chetlanishlar nol, nol, nol va to'rt. Endi ularni birlashtirish kerak.",
        'Верно, минус четыре. Остальные отклонения ноль, ноль, ноль и четыре. Теперь их нужно объединить.',
        'Correct, minus four. The other deviations are zero, zero, zero and four. Now they must be combined.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — nega kvadrat kerak.
// ============================================================
const S3 = {
  eyebrow: L('NEGA KVADRAT', 'ЗАЧЕМ КВАДРАТ', 'WHY SQUARE'),
  title: L(
    "Oddiy yig'indi har doim nol chiqadi",
    'Обычная сумма всегда даёт ноль',
    'The plain sum always gives zero',
  ),
  audio: [
    A('mount',
      "Chetlanishlarni shunchaki qo'shib ko'ramiz. Minus to'rt qo'shuv nol qo'shuv nol qo'shuv nol qo'shuv to'rt.",
      'Просто сложим отклонения. Минус четыре плюс ноль плюс ноль плюс ноль плюс четыре.',
      'Let us simply add the deviations. Minus four plus zero plus zero plus zero plus four.'),
    A('why',
      "Nol chiqdi. Ikkinchi tanlanmada ham tekshiring: minus to'rt, minus to'rt, nol, to'rt, to'rt.",
      'Вышел ноль. Проверь и вторую выборку: минус четыре, минус четыре, ноль, четыре, четыре.',
      'Zero came out. Check the second sample too: minus four, minus four, zero, four, four.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('−4 + 0 + 0 + 0 + 4 = 0', '−4 + 0 + 0 + 0 + 4 = 0', '−4 + 0 + 0 + 0 + 4 = 0')}
      steps={[
        { id: 'a', head: L('Ikkinchi tanlanma', 'Вторая выборка', 'The second sample'), lines: ['−4 − 4 + 0 + 4 + 4 = 0'] },
      ]}
      ask={L(
        "Nega ikkala tanlanmada ham nol chiqdi?",
        'Почему в обеих выборках вышел ноль?',
        'Why did both samples give zero?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Minuslar plyuslarni to'liq yo'q qiladi, o'rtacha shunday tanlangan",
            'Минусы полностью гасят плюсы, среднее именно так и выбрано',
            'The minuses cancel the pluses exactly, that is how the mean is chosen',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Tasodifan, sonlar shunday chiqqan",
            'Случайно, так вышли числа',
            'By chance, the numbers happened to work out',
          ),
          hint: L(
            "Istalgan tanlanmani olib ko'ring, natija baribir nol bo'ladi. O'rtacha aynan barcha chetlanishlarni muvozanatlaydigan son.",
            'Возьми любую выборку, результат всё равно будет ноль. Среднее это как раз то число, которое уравновешивает все отклонения.',
            'Take any sample at all and the result is still zero. The mean is precisely the number that balances every deviation.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun chetlanishlar kvadratga ko'tariladi: kvadrat manfiy bo'lmaydi va minuslar bir birini yo'q qilmaydi.",
        'Верно. Поэтому отклонения возводят в квадрат: квадрат не бывает отрицательным, и минусы друг друга не гасят.',
        'Correct. That is why the deviations are squared: a square is never negative, so the minuses cannot cancel out.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — birinchi tanlanmaning dispersiyasi.
// ============================================================
const S4 = {
  eyebrow: L('DISPERSIYA', 'ДИСПЕРСИЯ', 'THE VARIANCE'),
  title: L(
    "Kvadratlarning o'rtachasi",
    'Среднее квадратов',
    'The mean of the squares',
  ),
  audio: [
    A('mount',
      "Chetlanishlarni kvadratga ko'taramiz va ularning o'rtachasini olamiz. Bu son dispersiya deyiladi.",
      'Возведём отклонения в квадрат и возьмём их среднее. Это число называют дисперсией.',
      'Square the deviations and take their mean. This number is called the variance.'),
    A('why',
      "Birinchi tanlanmada kvadratlar o'n olti, nol, nol, nol va o'n olti.",
      'В первой выборке квадраты шестнадцать, ноль, ноль, ноль и шестнадцать.',
      'In the first sample the squares are sixteen, zero, zero, zero and sixteen.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('16 + 0 + 0 + 0 + 16 = 32', '16 + 0 + 0 + 0 + 16 = 32', '16 + 0 + 0 + 0 + 16 = 32')}
      steps={[]}
      ask={L(
        "Dispersiya nechaga teng?",
        'Чему равна дисперсия?',
        'What does the variance equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'D = 6,4' },
        {
          id: 'wrong',
          label: 'D = 32',
          hint: L(
            "O'ttiz ikki bu kvadratlarning YIG'INDISI. Dispersiya esa ularning o'rtachasi, demak sonlar soniga bo'lish kerak.",
            'Тридцать два это СУММА квадратов. А дисперсия это их среднее, значит нужно разделить на количество чисел.',
            'Thirty two is the SUM of the squares. The variance is their mean, so divide by how many numbers there are.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. O'ttiz ikki bo'lingan besh, olti butun to'rt o'ndan. Endi ikkinchi tanlanmani hisoblaymiz.",
        'Верно. Тридцать два разделить на пять, шесть целых четыре десятых. Теперь посчитаем вторую выборку.',
        'Correct. Thirty two over five is six point four. Now for the second sample.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — ikkinchi tanlanma, taqqoslash.
// ============================================================
const S5 = {
  eyebrow: L('TAQQOSLASH', 'СРАВНЕНИЕ', 'THE COMPARISON'),
  title: L(
    "Xukdagi savolga javob",
    'Ответ на вопрос из хука',
    'The answer to the opening question',
  ),
  audio: [
    A('mount',
      "Ikkinchi tanlanmada chetlanishlar minus to'rt, minus to'rt, nol, to'rt, to'rt. Kvadratlari esa to'rtta o'n oltilik va bitta nol.",
      'Во второй выборке отклонения минус четыре, минус четыре, ноль, четыре, четыре. А квадраты это четыре шестнадцати и один ноль.',
      'In the second sample the deviations are minus four, minus four, zero, four, four. The squares are four sixteens and one zero.'),
    A('why',
      "Yig'indi oltmish to'rt. Uni beshga bo'ling va birinchi tanlanma bilan solishtiring.",
      'Сумма шестьдесят четыре. Раздели на пять и сравни с первой выборкой.',
      'The sum is sixty four. Divide by five and compare with the first sample.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('64 : 5 = 12,8', '64 : 5 = 12,8', '64 : 5 = 12,8')}
      steps={[
        { id: 'a', head: L('Birinchi tanlanma', 'Первая выборка', 'The first sample'), lines: ['D = 6,4'] },
      ]}
      ask={L(
        "Ikkinchi tanlanmaning tarqoqligi haqida nima deyish mumkin?",
        'Что можно сказать о разбросе второй выборки?',
        'What can be said about the spread of the second sample?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L('U ikki barobar katta', 'Он вдвое больше', 'It is twice as large'),
        },
        {
          id: 'wrong',
          label: L("U bir xil, chunki kenglik teng", 'Он такой же, ведь размах равен', 'It is the same, since the ranges match'),
          hint: L(
            "Kenglik haqiqatan ham teng, lekin dispersiya olti butun to'rt o'ndan va o'n ikki butun sakkiz o'ndan. Aynan shu farqni kenglik ko'rsata olmagandi.",
            'Размах действительно равен, но дисперсия шесть целых четыре десятых и двенадцать целых восемь десятых. Именно эту разницу размах и не показал.',
            'The ranges do match, but the variances are six point four and twelve point eight. That is exactly the difference the range could not show.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Kenglik ikkalasida sakkiz, dispersiya esa ikki barobar farq qiladi. Xukdagi savol shu bilan yopildi.",
        'Верно. Размах у обеих восемь, а дисперсия отличается вдвое. Вопрос из хука на этом закрыт.',
        'Correct. Both ranges are eight, yet the variances differ twofold. The opening question is settled.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — sigma va o'lcham.
// ============================================================
const S6 = {
  eyebrow: L('SIGMA', 'СИГМА', 'SIGMA'),
  title: L(
    "Nega dispersiyadan ildiz olinadi",
    'Зачем из дисперсии извлекают корень',
    'Why a root is taken from the variance',
  ),
  audio: [
    A('mount',
      "Aytaylik, bolalarning bo'yi santimetrda o'lchangan. Chetlanish ham santimetrda bo'ladi.",
      'Допустим, рост детей измерен в сантиметрах. Отклонение тоже будет в сантиметрах.',
      'Suppose the heights of children are measured in centimetres. The deviations are in centimetres too.'),
    A('why',
      "Lekin chetlanishni kvadratga ko'tardik. Dispersiya endi qanday o'lchamda?",
      'Но отклонение мы возвели в квадрат. В каких единицах теперь дисперсия?',
      'But the deviation was squared. What unit does the variance carry now?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('D = 8,2', 'D = 8,2', 'D = 8,2')}
      steps={[
        { id: 'a', head: L('Ildiz olamiz', 'Извлекаем корень', 'Take the root'), lines: ['σ ≈ 2,86'] },
      ]}
      ask={L(
        "Nega dispersiyadan kvadrat ildiz olinadi?",
        'Зачем из дисперсии извлекают квадратный корень?',
        'Why is a square root taken from the variance?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Natija miqdor bilan bir xil o'lchamda bo'lishi uchun",
            'Чтобы результат был в тех же единицах, что и величина',
            'So the result carries the same unit as the quantity',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Sonni kichikroq qilish uchun",
            'Чтобы число стало меньше',
            'To make the number smaller',
          ),
          hint: L(
            "Agar dispersiya nol butun to'rt o'ndan bo'lsa, ildiz uni KATTALASHTIRADI. Demak gap kattalikda emas, o'lchov birligida.",
            'Если дисперсия ноль целых четыре десятых, корень её УВЕЛИЧИТ. Значит дело не в величине, а в единице измерения.',
            'If the variance is zero point four, the root makes it LARGER. So the point is the unit, not the size.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bo'y santimetrda, dispersiya kvadrat santimetrda, sigma esa yana santimetrda. Uni bo'y bilan bevosita solishtirish mumkin.",
        'Верно. Рост в сантиметрах, дисперсия в квадратных сантиметрах, а сигма снова в сантиметрах. Её можно сравнивать с ростом напрямую.',
        'Correct. Height in centimetres, variance in square centimetres, and sigma back in centimetres. It compares with the height directly.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — 503-mashq: ikkita tajriba birga.
// ============================================================
const S7 = {
  eyebrow: L('IKKITA TAJRIBA BIRGA', 'ДВА ОПЫТА СРАЗУ', 'TWO EXPERIMENTS AT ONCE'),
  title: L(
    "Kubik va tanga birga tashlanadi",
    'Кубик и монету бросают вместе',
    'A die and a coin are thrown together',
  ),
  audio: [
    A('mount',
      "Stolga o'yin kubigi va tanga birga tashlanadi. Bu 31-darsdagi ko'paytirish qoidasi.",
      'На стол бросают кубик и монету вместе. Это правило умножения с 31 урока.',
      'A die and a coin are thrown on the table together. This is the multiplication rule from lesson 31.'),
    A('why',
      "Avval barcha natijalar sonini toping, keyin qulaylarini.",
      'Сначала найди число всех исходов, потом благоприятных.',
      'Find the count of all outcomes first, then the favourable ones.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('6 · 2 = 12', '6 · 2 = 12', '6 · 2 = 12')}
      steps={[
        { id: 'a', head: L('Kubikdagi tub sonlar', 'Простые на кубике', 'Primes on the die'), lines: ['2, 3, 5'] },
      ]}
      ask={L(
        "Kubikda tub son va tangada gerb chiqish ehtimolligi qanday?",
        'Какова вероятность простого числа на кубике и герба на монете?',
        'What is the probability of a prime on the die and heads on the coin?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'P = 1/4' },
        {
          id: 'wrong',
          label: 'P = 1/2',
          hint: L(
            "Yarim faqat kubik haqida bo'lardi: oltitadan uchtasi tub. Lekin tanga ham gerb tomoni bilan tushishi kerak, bu shartni ham qo'shing.",
            'Половина была бы только про кубик: из шести три простых. Но и монета должна упасть гербом, добавь и это условие.',
            'A half would cover the die alone: three primes out of six. But the coin must land heads too, so add that condition.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qulay natijalar uchta: ikki va gerb, uch va gerb, besh va gerb. Uch bo'lingan o'n ikki, ya'ni bir to'rtdan.",
        'Верно. Благоприятных исходов три: два и герб, три и герб, пять и герб. Три на двенадцать, то есть одна четвёртая.',
        'Correct. Three outcomes are favourable: two with heads, three with heads, five with heads. Three over twelve is one quarter.',
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
    "Algebra 9, 38-§ (209-210-bet) va V bobga doir mashqlar (213-bet)",
    'Алгебра 9, §38 (стр. 209-210) и упражнения к главе V (стр. 213)',
    'Algebra 9, §38 (p. 209-210) and the chapter V exercises (p. 213)',
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
          "Nega chetlanishlar kvadratga ko'tariladi?",
          'Почему отклонения возводят в квадрат?',
          'Why are the deviations squared?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Aks holda ularning yig'indisi nol chiqadi", 'Иначе их сумма выйдет нулевой', 'Otherwise their sum comes out zero'),
          },
          {
            id: 'wrong',
            label: L("Kvadrat bilan hisoblash osonroq", 'С квадратами считать проще', 'Squares are easier to compute with'),
            hint: L(
              "Kvadrat hisobni osonlashtirmaydi, aksincha. U boshqa muammoni hal qiladi, uni 3-ekranda ko'rgansiz.",
              'Квадрат счёт не облегчает, скорее наоборот. Он решает другую задачу, ты видел её на 3 экране.',
              'Squaring makes the arithmetic harder, not easier. It solves a different problem, seen on screen three.',
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
    "Tarqoqlikning ikkinchi o'lchovi",
    'Вторая мера разброса',
    'The second measure of spread',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz kenglikning kamchiligini topdingiz, dispersiyani chiqardingiz va sigmaning nima uchun kerakligini bildingiz.",
      'На семи экранах ты нашёл слабое место размаха, вывел дисперсию и узнал, зачем нужна сигма.',
      'On seven screens you found the weakness of the range, derived the variance, and learned what sigma is for.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — 501-mashq: sharlar.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "O'n beshta shar",
    'Пятнадцать шаров',
    'Fifteen balls',
  ),
  audio: [
    A('mount',
      "Qutida to'rtta qora, beshta qizil va oltita ko'k shar bor. Bitta shar olinadi.",
      'В коробке четыре чёрных, пять красных и шесть синих шаров. Вынимают один шар.',
      'A box holds four black, five red and six blue balls. One ball is drawn.'),
    A('why',
      "Maxraj har safar o'n besh bo'lib qoladi, faqat surat o'zgaradi.",
      'Знаменатель всё время пятнадцать, меняется только числитель.',
      'The denominator stays fifteen throughout, only the numerator changes.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Oxirgi ikkitasi chegaraviy holatlar: yashil shar yo'q, demak nol, uchta rangdan biri esa har doim chiqadi, demak bir.",
      'Все три найдены. Последние два это граничные случаи: зелёных нет, значит ноль, а один из трёх цветов выпадает всегда, значит единица.',
      'All three are found. The last two are the boundary cases: no green balls means zero, and one of the three colours always appears, which means one.',
    ),
    tasks: [
      {
        expr: '4 + 5 + 6 = 15',
        question: L('Olingan shar qora bo\'lish ehtimolligi qanday?', 'Какова вероятность, что вынутый шар чёрный?', 'What is the probability the drawn ball is black?'),
        ok: L("Ha. To'rt bo'lingan o'n besh.", 'Да. Четыре на пятнадцать.', 'Yes. Four over fifteen.'),
        items: [
          { id: 'a', right: true, label: 'P = 4/15' },
          { id: 'b', label: 'P = 4/11', hint: L("O'n bir bu qora BO'LMAGAN sharlar soni. Maxrajda esa barcha sharlar turishi kerak.", 'Одиннадцать это число НЕ чёрных шаров. А в знаменателе должны стоять все шары.', 'Eleven counts the balls that are NOT black. The denominator must hold every ball.') },
        ],
        solution: ['m = 4,  n = 15', 'P = 4/15'],
      },
      {
        expr: '4 + 5 + 6 = 15',
        question: L('Olingan shar ko\'k emas bo\'lish ehtimolligi qanday?', 'Какова вероятность, что вынутый шар не синий?', 'What is the probability the drawn ball is not blue?'),
        ok: L("Ha. Ko'k bo'lmaganlar to'qqizta, ya'ni to'rt qo'shuv besh. To'qqiz bo'lingan o'n besh, uch beshdan.", 'Да. Не синих девять, то есть четыре плюс пять. Девять на пятнадцать, три пятых.', 'Yes. Nine are not blue, that is four plus five. Nine over fifteen is three fifths.'),
        items: [
          { id: 'a', right: true, label: 'P = 3/5' },
          { id: 'b', label: 'P = 2/5', hint: L("Ikki beshdan bu KO'K shar chiqish ehtimolligi. Savol esa teskarisi haqida.", 'Две пятых это вероятность СИНЕГО шара. А вопрос про обратное.', 'Two fifths is the probability of a BLUE ball. The question asks the opposite.') },
        ],
        solution: ['m = 4 + 5 = 9', 'P = 9/15 = 3/5'],
      },
      {
        expr: '4 + 5 + 6 = 15',
        question: L(
          "Olingan shar yo qora, yo qizil, yo ko'k bo'lish ehtimolligi qanday?",
          'Какова вероятность, что вынутый шар чёрный, или красный, или синий?',
          'What is the probability the drawn ball is black, or red, or blue?',
        ),
        ok: L("Ha, birga teng. Qutida boshqa rang yo'q, bu muqarrar hodisa.", 'Да, единице. Других цветов в коробке нет, это достоверное событие.', 'Yes, one. There are no other colours in the box, so this event is certain.'),
        items: [
          { id: 'a', right: true, label: 'P = 1' },
          { id: 'b', label: 'P = 3/15', hint: L("Uch bo'lingan o'n besh uchta rang borligini bildirardi. Lekin qulay natija ranglar emas, SHARLAR, ular esa o'n beshtasi ham qulay.", 'Три на пятнадцать означало бы, что цветов три. Но благоприятные исходы это не цвета, а ШАРЫ, и благоприятны все пятнадцать.', 'Three over fifteen would count the colours. But the outcomes are BALLS, and all fifteen are favourable.') },
        ],
        solution: ['m = 15,  n = 15', 'P = 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — 502-mashq: sonlar 1 dan 50 gacha.
// ============================================================
const S10 = {
  eyebrow: L('BIRDAN ELLIGACHA', 'ОТ ОДНОГО ДО ПЯТИДЕСЯТИ', 'FROM ONE TO FIFTY'),
  title: L(
    "Tavakkaliga son aytildi",
    'Наугад названо число',
    'A number is named at random',
  ),
  audio: [
    A('mount',
      "Birdan elligacha bo'lgan natural son tavakkaliga aytildi. Barcha natijalar soni ellikta.",
      'Наугад названо натуральное число от одного до пятидесяти. Число всех исходов пятьдесят.',
      'A whole number from one to fifty is named at random. There are fifty outcomes in all.'),
    A('why',
      "Har savolda qulay sonlarni sanang.",
      'В каждом вопросе сосчитай подходящие числа.',
      'In each question count the numbers that fit.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Karrali sonlarni sanash uchun ellikni o'sha songa bo'lish yetarli, sanab chiqish shart emas.",
      'Все три найдены. Чтобы сосчитать кратные, достаточно разделить пятьдесят на это число, перечислять не нужно.',
      'All three are found. To count the multiples just divide fifty by that number, no listing needed.',
    ),
    tasks: [
      {
        expr: '1 ... 50',
        question: L('Aytilgan son yettiga karrali bo\'lish ehtimolligi qanday?', 'Какова вероятность, что названное число кратно семи?', 'What is the probability the number is a multiple of seven?'),
        ok: L("Ha. Yetti, o'n to'rt, yigirma bir va hokazo qirq to'qqizgacha, yettita son.", 'Да. Семь, четырнадцать, двадцать один и так далее до сорока девяти, семь чисел.', 'Yes. Seven, fourteen, twenty one and so on to forty nine, seven numbers.'),
        items: [
          { id: 'a', right: true, label: 'P = 7/50' },
          { id: 'b', label: 'P = 1/7', hint: L("Bir yettidan yettita natija bo'lganda chiqardi. Bu yerda esa natijalar ellikta, qulaylari yettita.", 'Одна седьмая вышла бы при семи исходах. А здесь исходов пятьдесят, благоприятных семь.', 'One seventh would need seven outcomes. Here there are fifty outcomes and seven favourable.') },
        ],
        solution: ['7, 14, 21, 28, 35, 42, 49', 'm = 7,  n = 50'],
      },
      {
        expr: '1 ... 50',
        question: L('Aytilgan son o\'nga karrali bo\'lish ehtimolligi qanday?', 'Какова вероятность, что названное число кратно десяти?', 'What is the probability the number is a multiple of ten?'),
        ok: L("Ha. O'n, yigirma, o'ttiz, qirq, ellik, beshta son. Besh bo'lingan ellik, bir o'ndan.", 'Да. Десять, двадцать, тридцать, сорок, пятьдесят, пять чисел. Пять на пятьдесят, одна десятая.', 'Yes. Ten, twenty, thirty, forty, fifty, five numbers. Five over fifty is one tenth.'),
        items: [
          { id: 'a', right: true, label: 'P = 1/10' },
          { id: 'b', label: 'P = 1/5', hint: L("Bir beshdan o'nta qulay son bo'lganda chiqardi. Elligacha esa o'nga karrali sonlar beshta.", 'Одна пятая вышла бы при десяти подходящих числах. А кратных десяти до пятидесяти пять.', 'One fifth would need ten favourable numbers. Up to fifty there are five multiples of ten.') },
        ],
        solution: ['10, 20, 30, 40, 50', 'P = 5/50 = 1/10'],
      },
      {
        expr: '1 ... 50',
        question: L('Aytilgan son yetti emas bo\'lish ehtimolligi qanday?', 'Какова вероятность, что названное число не семь?', 'What is the probability the number is not seven?'),
        ok: L("Ha. Yettidan boshqa qirq to'qqizta son bor.", 'Да. Кроме семёрки есть сорок девять чисел.', 'Yes. Apart from the seven there are forty nine numbers.'),
        items: [
          { id: 'a', right: true, label: 'P = 49/50' },
          { id: 'b', label: 'P = 1/50', hint: L("Bir elligdan bu aynan YETTI chiqish ehtimolligi. Savol esa teskarisi haqida, u deyarli birga teng.", 'Одна пятидесятая это вероятность выпадения ИМЕННО семёрки. А вопрос про обратное, оно почти достоверно.', 'One fiftieth is the probability of getting EXACTLY seven. The question asks the opposite, which is nearly certain.') },
        ],
        solution: ['m = 49,  n = 50', 'P = 49/50'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — SortRow: 505-mashqning qatori.
// ============================================================
const S11 = {
  eyebrow: L('MEDIANA', 'МЕДИАНА', 'THE MEDIAN'),
  title: L(
    "Manfiy sonli qator",
    'Ряд с отрицательными числами',
    'A row with negative numbers',
  ),
  audio: [
    A('mount',
      "Darslikning 505-mashqidan qator. Uni tartiblang va medianasini toping.",
      'Ряд из упражнения 505 учебника. Упорядочи его и найди медиану.',
      'A row from exercise 505 of the textbook. Order it and find the median.'),
    A('why',
      "Oltita son bor, demak o'rtada ikkitasi turadi.",
      'Чисел шесть, значит в середине окажутся два.',
      'There are six numbers, so two will stand in the middle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SortRow
      values={[-7, -7, -4, -4, 1, 3]}
      ask={L(
        "Qatorni o'sish tartibida tering",
        'Собери ряд по возрастанию',
        'Build the row in increasing order',
      )}
      hint={L(
        "Bu son qolganlarning eng kichigi emas. Manfiy sonlarda modul qancha katta bo'lsa, son shuncha kichik.",
        'Это число не наименьшее из оставшихся. У отрицательных чисел чем больше модуль, тем меньше само число.',
        'This is not the smallest of those left. Among negatives, the larger the modulus the smaller the number.',
      )}
      after={L(
        "Qator tayyor. O'rtada minus to'rt va minus to'rt turibdi, ularning o'rtachasi ham minus to'rt. Mediana minus to'rt, moda esa ikkita: minus yetti va minus to'rt.",
        'Ряд готов. В середине минус четыре и минус четыре, их среднее тоже минус четыре. Медиана минус четыре, а мод две: минус семь и минус четыре.',
        'The row is ready. Minus four and minus four stand in the middle, and their mean is minus four too. The median is minus four, and there are two modes: minus seven and minus four.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 12. TUZOQ — chetlanishlarni kvadratsiz qo'shish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Nol chiqdi, demak tarqoqlik yo'qmi",
    'Вышел ноль, значит разброса нет?',
    'Zero came out, so there is no spread?',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Tanlanma ikki, to'rt, olti. O'rtachasi to'rt, chetlanishlar minus ikki, nol va ikki.",
      'Решение Камрона. Выборка два, четыре, шесть. Среднее четыре, отклонения минус два, ноль и два.',
      "Kamron's solution. The sample is two, four, six. The mean is four and the deviations are minus two, zero and two."),
    A('why',
      "U ularni qo'shib nol olgan va tanlanmada tarqoqlik yo'q degan xulosaga kelgan.",
      'Он сложил их, получил ноль и заключил, что разброса в выборке нет.',
      'He added them, got zero, and concluded the sample has no spread.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Chetlanishlarning yig'indisi HAR QANDAY tanlanmada nolga teng, hatto eng tarqoqida ham. Shuning uchun bu yig'indi tarqoqlik haqida hech narsa ayta olmaydi, va shuning uchun kvadrat kerak.",
      'Сумма отклонений равна нулю в ЛЮБОЙ выборке, даже в самой разбросанной. Поэтому она ничего не говорит о разбросе, и поэтому нужен квадрат.',
      'The sum of deviations is zero for ANY sample, even the most scattered one. So it says nothing about spread, and that is why squaring is needed.',
    ),
    tasks: [
      {
        expr: '2, 4, 6   →   (−2) + 0 + 2 = 0',
        question: L(
          "Kamronning xulosasi to'g'rimi?",
          'Верен ли вывод Камрона?',
          "Is Kamron's conclusion right?",
        ),
        ok: L(
          "To'g'ri, xato. Yig'indi istalgan tanlanmada nol chiqadi. Kvadratlar bilan hisoblasak, dispersiya sakkiz uchdan bo'ladi.",
          'Верно, вывод неверен. Сумма выходит нулевой в любой выборке. С квадратами дисперсия равна восьми третьим.',
          'Correct, the conclusion is wrong. The sum is zero for any sample. With squares the variance is eight thirds.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q: yig'indi har doim nol chiqadi", 'Нет: сумма всегда выходит нулевой', 'No: the sum always comes out zero'),
          },
          {
            id: 'b',
            label: L("Ha: nol tarqoqlik yo'qligini bildiradi", 'Да: ноль означает отсутствие разброса', 'Yes: zero means there is no spread'),
            hint: L(
              "Bir, to'rt, yetti tanlanmasini oling. U ancha tarqoq, lekin chetlanishlari minus uch, nol va uch, ularning yig'indisi ham nol.",
              'Возьми выборку один, четыре, семь. Она разбросана сильнее, но её отклонения минус три, ноль и три, и сумма тоже ноль.',
              'Take the sample one, four, seven. It is more scattered, yet its deviations are minus three, zero and three, and the sum is zero again.',
            ),
          },
        ],
        solution: [
          '4 + 0 + 4 = 8',
          'D = 8 : 3',
          L('Kamron: (−2) + 0 + 2 = 0', 'Камрон: (−2) + 0 + 2 = 0', 'Kamron: (−2) + 0 + 2 = 0'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — 508-mashq va o'lchov birligi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Hisoblang va o'lchamini ayting",
    'Посчитай и назови единицу',
    'Compute it and name the unit',
  ),
  audio: [
    A('mount',
      "Darslikning 508-mashqidan tanlanma. Olti, uch, besh, to'rt, to'rt. Bu bolalarning kitob soni deylik.",
      'Выборка из упражнения 508 учебника. Шесть, три, пять, четыре, четыре. Пусть это число книг у детей.',
      'A sample from exercise 508. Six, three, five, four, four. Say it is the number of books the children have.'),
    A('why',
      "Avval o'rtachani toping, keyin kvadratlarni qo'shing.",
      'Сначала найди среднее, потом сложи квадраты.',
      'Find the mean first, then add the squares.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Dispersiya kitob kvadratida chiqadi va uni kitoblar soni bilan solishtirib bo'lmaydi, sigma esa yana kitobda.",
      'Оба шага сделаны. Дисперсия выходит в книгах в квадрате, её нельзя сравнивать с числом книг, а сигма снова в книгах.',
      'Both steps are done. The variance comes out in books squared and cannot be compared with a count of books, while sigma is back in books.',
    ),
    tasks: [
      {
        expr: '6, 3, 5, 4, 4',
        question: L(
          "Bu tanlanmaning o'rtachasi nechaga teng?",
          'Чему равно среднее этой выборки?',
          'What does the mean of this sample equal?',
        ),
        ok: L(
          "Ha. Yig'indi yigirma ikki, beshga bo'lsak to'rt butun to'rt o'ndan.",
          'Да. Сумма двадцать два, делим на пять и получаем четыре целых четыре десятых.',
          'Yes. The sum is twenty two, over five gives four point four.',
        ),
        items: [
          { id: 'a', right: true, label: '4,4' },
          { id: 'b', label: '4', hint: L("To'rt bu medianaga yaqin, lekin o'rtacha emas. Sonlarni qo'shing: olti qo'shuv uch qo'shuv besh qo'shuv to'rt qo'shuv to'rt.", 'Четыре это ближе к медиане, но не среднее. Сложи числа: шесть плюс три плюс пять плюс четыре плюс четыре.', 'Four is close to the median but not the mean. Add the numbers: six plus three plus five plus four plus four.') },
        ],
        solution: ['6 + 3 + 5 + 4 + 4 = 22', '22 : 5 = 4,4'],
      },
      {
        expr: 'D ≈ 1,04',
        question: L(
          "Sigma qanday o'lchamda bo'ladi?",
          'В каких единицах будет сигма?',
          'What unit will sigma carry?',
        ),
        ok: L(
          "To'g'ri, kitobda. Ildiz kvadrat o'lchamni qaytaradi, shuning uchun sigma bevosita taqqoslashga yaroqli.",
          'Верно, в книгах. Корень возвращает единицу из квадрата, поэтому сигму можно сравнивать напрямую.',
          'Correct, in books. The root undoes the squaring, so sigma can be compared directly.',
        ),
        items: [
          { id: 'a', right: true, label: L('Kitobda', 'В книгах', 'In books') },
          {
            id: 'b',
            label: L('Kitob kvadratida', 'В книгах в квадрате', 'In books squared'),
            hint: L(
              "Kvadrat o'lcham dispersiyaniki edi. Ildiz olingandan keyin o'lcham dastlabkisiga qaytadi, xuddi tomoni yuzdan topilgandek.",
              'Квадратная единица была у дисперсии. После корня единица возвращается к исходной, как сторона находится из площади.',
              'The squared unit belonged to the variance. After the root the unit returns to the original, like finding a side from an area.',
            ),
          },
        ],
        solution: [
          'D ≈ 1,04',
          'σ = √D ≈ 1,02',
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
    "Blits: kvadrat, kenglik, sigma",
    'Блиц: квадрат, размах, сигма',
    'Blitz: the square, the range, sigma',
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
        tag: 'chetlanishlar-yigindisi-nol',
        ask: L(
          "Chetlanishlarning oddiy yig'indisi nechaga teng?",
          'Чему равна обычная сумма отклонений?',
          'What does the plain sum of deviations equal?',
        ),
        options: [
          { id: 'zero', right: true, label: L('Har doim nolga', 'Всегда нулю', 'Always zero') },
          { id: 'dep', label: L("Tanlanmaga bog'liq", 'Зависит от выборки', 'It depends on the sample') },
        ],
        ok: L(
          "To'g'ri. Aynan shuning uchun undan foyda yo'q va kvadrat kerak bo'ladi.",
          'Верно. Именно поэтому от неё нет пользы и нужен квадрат.',
          'Correct. That is exactly why it is useless and squaring is needed.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron shu noldan noto'g'ri xulosa chiqargandi.",
          'Вспомни 12 экран: Камрон сделал из этого нуля неверный вывод.',
          'Recall screen 12: Kamron drew a wrong conclusion from that zero.',
        ),
      },
      {
        id: 'q2',
        tag: 'kenglik-yetarli-emas',
        ask: L(
          "Ikki tanlanmaning kengligi teng. Tarqoqligi ham tengmi?",
          'У двух выборок равный размах. Равен ли и разброс?',
          'Two samples share a range. Do they share the spread?',
        ),
        options: [
          { id: 'no', right: true, label: L('Shart emas', 'Не обязательно', 'Not necessarily') },
          { id: 'yes', label: L('Ha, albatta', 'Да, обязательно', 'Yes, necessarily') },
        ],
        ok: L(
          "To'g'ri. Kenglik faqat chekkalarni ko'radi, o'rtadagi sonlar boshqacha joylashgan bo'lishi mumkin.",
          'Верно. Размах видит только края, а средние числа могут располагаться иначе.',
          'Correct. The range sees only the ends, while the middle numbers may sit quite differently.',
        ),
        hint: L(
          "1-ekranni eslang: ikkala tanlanmaning kengligi sakkiz edi, dispersiyasi esa ikki barobar farq qildi.",
          'Вспомни 1 экран: размах у обеих был восемь, а дисперсия отличалась вдвое.',
          'Recall screen 1: both ranges were eight while the variances differed twofold.',
        ),
      },
      {
        id: 'q3',
        tag: 'olchov-birligini-unutish',
        ask: L(
          "Bo'y santimetrda o'lchansa, sigma qanday o'lchamda bo'ladi?",
          'Если рост измерен в сантиметрах, в каких единицах сигма?',
          'If height is in centimetres, what unit does sigma carry?',
        ),
        options: [
          { id: 'cm', right: true, label: L('Santimetrda', 'В сантиметрах', 'In centimetres') },
          { id: 'cm2', label: L('Kvadrat santimetrda', 'В квадратных сантиметрах', 'In square centimetres') },
        ],
        ok: L(
          "To'g'ri. Kvadrat santimetr dispersiyaniki, ildiz esa o'lchamni qaytaradi.",
          'Верно. Квадратные сантиметры у дисперсии, а корень возвращает единицу.',
          'Correct. Square centimetres belong to the variance, and the root restores the unit.',
        ),
        hint: L(
          "6-ekranni eslang: ildiz sonni kichraytirish uchun emas, o'lchamni qaytarish uchun olinadi.",
          'Вспомни 6 экран: корень берут не чтобы уменьшить число, а чтобы вернуть единицу.',
          'Recall screen 6: the root is taken to restore the unit, not to shrink the number.',
        ),
      },
      {
        id: 'q4',
        tag: 'natijalarni-sanamaslik',
        ask: L(
          "Kubik va tanga birga tashlansa, natijalar soni nechta?",
          'Если бросают кубик и монету вместе, сколько исходов?',
          'If a die and a coin are thrown together, how many outcomes are there?',
        ),
        options: [
          { id: 'r', right: true, label: '12' },
          { id: 'w', label: '8' },
        ],
        ok: L(
          "To'g'ri. Olti karra ikki. Bu 31-darsdagi ko'paytirish qoidasi.",
          'Верно. Шесть на два. Это правило умножения с 31 урока.',
          'Correct. Six times two. This is the multiplication rule from lesson 31.',
        ),
        hint: L(
          "Sakkiz oltini ikkiga QO'SHGANDA chiqadi. Kubikning har bir tomoniga esa tanganing ikkita holati mos keladi.",
          'Восемь выходит при СЛОЖЕНИИ шести и двух. А каждой грани кубика отвечают два положения монеты.',
          'Eight comes from ADDING six and two. Each die face pairs with two coin positions.',
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
    "Bob yakunlandi",
    'Глава завершена',
    'The chapter is complete',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda ikkita tanlanmaning uchta xarakteristikasi ham bir xil chiqqandi, o'zlari esa boshqa edi.",
      'На первом экране у двух выборок совпали все три характеристики, а сами они были разными.',
      'On the first screen two samples matched on all three measures yet were different.'),
    A('s1',
      "Siz dispersiyani chiqardingiz, sigmaning nima uchun kerakligini bildingiz va bobning barcha masalalarini ishladingiz.",
      'Ты вывел дисперсию, узнал, зачем нужна сигма, и разобрал задачи всей главы.',
      'You derived the variance, learned what sigma is for, and worked through the problems of the whole chapter.'),
    A('s2',
      "Keyingi darsda trigonometriya elementlari.",
      'В следующем уроке элементы тригонометрии.',
      'The next lesson covers elements of trigonometry.'),
  ],
  props: {
    mark: 'σ = √D',
    markNote: L(
      "sigma miqdor bilan bir xil o'lchamda",
      'сигма в тех же единицах, что и величина',
      'sigma carries the same unit as the quantity',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: trigonometriya elementlari',
      'Следующий урок: элементы тригонометрии',
      'Next lesson: elements of trigonometry',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'kenglik-yetarli-emas', ...S2 },
  { role: 'explain',  tag: 'chetlanishlar-yigindisi-nol', ...S3 },
  { role: 'explain',  tag: 'chetlanishlar-yigindisi-nol', ...S4 },
  { role: 'explain',  tag: 'kenglik-yetarli-emas', ...S5 },
  { role: 'explain',  tag: 'olchov-birligini-unutish', ...S6 },
  { role: 'explain',  tag: 'natijalarni-sanamaslik', ...S7 },
  { role: 'rule',     tag: 'chetlanishlar-yigindisi-nol', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'natijalarni-sanamaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'natijalarni-sanamaslik', ...S10 },
  { role: 'practice', tool: 'sortrow', tag: 'kenglik-yetarli-emas', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'chetlanishlar-yigindisi-nol', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'olchov-birligini-unutish', ...S13 },
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
