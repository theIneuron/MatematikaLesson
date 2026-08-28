// ============================================================================
// 9-sinf, Dars 24. GEOMETRIK PROGRESSIYA.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 31-§ (162-165-bet).
//   Kirish (162-bet): tomoni 4 sm teng tomonli uchburchak, o'rta
//       chiziqlar bilan ichma-ich quriladi: 4, 2, 1, 1/2, 1/4, 1/8.
//       Darsning XUKI shu — geometrik chizmadan kelib chiqadi.
//   Ta'rif (162-bet): b_(n+1) = b_n · q, bunda b_n ≠ 0 va q ≠ 0.
//       q — progressiyaning MAXRAJI.
//   To'rtta misol (162-163-bet): q = 4; q = 2/3 (kasr); q = −12
//       (MANFIY, ishoralar almashadi); q = 1 (o'zgarmas qator).
//   1-masala (163-bet): b_n = 7^(2n) geometrik progressiya, q = 49.
//   NOM SABABI (163-bet): b_n² = b_(n−1)·b_(n+1), musbat hadlarda
//       b_n = √(b_(n−1)·b_(n+1)) — o'rta GEOMETRIK. 22-darsdagi o'rta
//       arifmetik bilan to'liq parallel.
//   Formula (1) (164-bet): b_n = b_1·q^(n−1).
//   2-masala: b_1 = 81, q = 1/3, b_7 = 1/9.
//   3-masala: 2, 6, 18 ... da 486 ning nomeri, n = 6.
//   4-masala: b_6 = 96, b_8 = 384 → q² = 4 → q = 2 YOKI q = −2,
//       ya'ni IKKITA javob. 22-darsning 4-masalasida javob bitta edi.
//
// DARSNING QURILISHI 22-DARS BILAN PARALLEL: u yerda d QO'SHILADI,
// bu yerda q ga KO'PAYTIRILADI; u yerda had qo'shnilarining o'rta
// arifmetigi, bu yerda o'rta geometrigi; formulada esa ikkalasida ham
// (n − 1), va sababi bir xil — birinchi hadga qadam qilinmaydi.
//
// ASBOB: `SeqTable` (Dars21) TO'RTINCHI marta. Yangi asbob kerak emas.
//
// TEGLAR (o'zining):
//   qoshish-bilan-adashtirish   — q ni qo'shib yuborish, ko'paytirish
//                                  o'rniga
//   darajani-notogri-olish      — q^(n−1) o'rniga q^n yoki q·n olish
//   manfiy-maxrajni-tanimaslik  — q manfiy bo'lganda ishoralar
//                                  almashishini hisobga olmaslik
//   ikkinchi-javobni-yoqotish   — q² dan faqat musbat ildizni olib,
//                                  ikkinchi javobni tushirib qoldirish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SeqTable } from './asboblar.jsx'

export const META = {
  id: 'grade9-24',
  n: 24,
  row: 24,
  block: 'Б4',
  topic: L('Geometrik progressiya', 'Геометрическая прогрессия', 'Geometric progression'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Geometrik progressiyada har bir keyingi had oldingisiga bir xil songa KO'PAYTIRILADI, bu son maxraj q",
    'В геометрической прогрессии каждый следующий член получается УМНОЖЕНИЕМ предыдущего на одно и то же число, это знаменатель q',
    'In a geometric progression each next term is the previous one MULTIPLIED by the same number, the ratio q',
  ),
  L(
    "N-chi hadni topish uchun birinchi hadni q ga n minus bir marta ko'paytirish kerak: b_n = b_1·q^(n−1)",
    'Чтобы найти n-й член, первый нужно умножить на q ровно n минус один раз: b_n = b_1·q^(n−1)',
    'To find the n-th term, multiply the first by q exactly n minus one times: b_n = b_1·q^(n−1)',
  ),
  L(
    "Musbat hadlarda har bir had ikki qo'shnisining o'rta GEOMETRIGIGA teng, nom ham shundan",
    'При положительных членах каждый член равен среднему ГЕОМЕТРИЧЕСКОМУ двух соседей, отсюда и название',
    'With positive terms each term equals the GEOMETRIC mean of its two neighbours, hence the name',
  ),
]

export const MISS = {
  'qoshish-bilan-adashtirish': {
    what: L(
      "q ko'paytirilmasdan qo'shib yuborildi",
      'q прибавлено вместо умножения',
      'q was added instead of being multiplied',
    ),
    wrong: null,
    at: 0,
  },
  'darajani-notogri-olish': {
    what: L(
      "daraja noto'g'ri olindi: n minus bir o'rniga n",
      'взята неверная степень: вместо n минус один взято n',
      'the wrong power was used: n instead of n minus one',
    ),
    wrong: null,
    at: 0,
  },
  'manfiy-maxrajni-tanimaslik': {
    what: L(
      "q manfiy bo'lganda ishoralar almashishi hisobga olinmadi",
      'не учтено чередование знаков при отрицательном q',
      'the alternating signs with a negative q were not taken into account',
    ),
    wrong: null,
    at: 0,
  },
  'ikkinchi-javobni-yoqotish': {
    what: L(
      "q kvadratdan faqat bitta ildiz olindi, ikkinchisi tushib qoldi",
      'из квадрата q взят только один корень, второй потерян',
      'only one root was taken from q squared, the second was lost',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning uchburchagi.
// ============================================================
const S1 = {
  eyebrow: L("QADAM EMAS, KARRA", 'НЕ ШАГ, А МНОЖИТЕЛЬ', 'NOT A STEP BUT A FACTOR'),
  title: L(
    "Uchburchak ichida uchburchak",
    'Треугольник внутри треугольника',
    'A triangle inside a triangle',
  ),
  audio: [
    A('mount',
      "Tomoni to'rt santimetr bo'lgan teng tomonli uchburchak. Uning tomonlari o'rtalarini tutashtirsak, tomoni ikki santimetr bo'lgan uchburchak chiqadi. Yana takrorlasak, bir chiqadi, keyin esa bir ikkidan.",
      'Равносторонний треугольник со стороной четыре сантиметра. Соединив середины его сторон, получим треугольник со стороной два сантиметра. Повторим ещё раз, и получится один, потом одна вторая.',
      'An equilateral triangle with side four centimetres. Joining the midpoints of its sides gives a triangle with side two centimetres. Repeat once more and you get one, then one half.'),
    A('why',
      "To'rt, ikki, bir, bir ikkidan. 22-darsdagi progressiyada har safar bir xil son qo'shilardi. Bu yerda ham shundaymi?",
      'Четыре, два, один, одна вторая. В прогрессии с 22 урока каждый раз прибавлялось одно и то же число. Здесь так же?',
      'Four, two, one, one half. In the progression from lesson 22 the same number was added each time. Is it the same here?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "To'rt, ikki, bir, bir ikkidan. Har safar nima qilinyapti?",
      'Четыре, два, один, одна вторая. Что происходит каждый раз?',
      'Four, two, one, one half. What happens each time?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Bir ikkidanga ko'paytirilyapti", 'Умножается на одну вторую', 'Multiplied by one half'),
      },
      {
        id: 'wrong',
        show: L("Bir xil son ayirilyapti", 'Вычитается одно и то же число', 'The same number is subtracted'),
        hint: L(
          "Tekshiring: to'rtdan ikkiga tushish uchun ikki ayirildi, ikkidan birga tushish uchun esa faqat bir. Ayiriladigan son bir xil emas.",
          'Проверь: чтобы от четырёх дойти до двух, вычли два, а от двух до одного только один. Вычитаемое не одинаково.',
          'Check: going from four to two took subtracting two, from two to one only one. The subtracted amount is not the same.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bu yerda qo'shilmaydi, ko'paytiriladi. Bunday ketma-ketlik geometrik progressiya deyiladi.",
      'Верно. Здесь не прибавляют, а умножают. Такую последовательность называют геометрической прогрессией.',
      'Correct. Here nothing is added, things are multiplied. Such a sequence is called a geometric progression.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 22-dars bilan farq.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Maxrajni qanday topish",
    'Как найти знаменатель',
    'How to find the ratio',
  ),
  audio: [
    A('mount',
      "22-darsda ayirmani topish uchun keyingi haddan oldingisi ayirilardi. Bu yerda esa boshqa amal kerak.",
      'На 22 уроке, чтобы найти разность, из следующего члена вычитали предыдущий. Здесь нужно другое действие.',
      'In lesson 22, to find the difference, the previous term was subtracted from the next. Here a different operation is needed.'),
    A('why',
      "Agar har safar ko'paytirilsa, teskari amal bo'lishi kerak.",
      'Если каждый раз умножают, обратное действие должно быть соответствующим.',
      'If multiplication happens each time, the reverse operation must match it.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2, 6, 18, 54, ...', '2, 6, 18, 54, ...', '2, 6, 18, 54, ...')}
      steps={[]}
      ask={L(
        "Maxraj qanday topiladi?",
        'Как находится знаменатель?',
        'How is the ratio found?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Keyingisini oldingisiga bo'lib: olti bo'lingan ikki", 'Делением следующего на предыдущий: шесть делить на два', 'Dividing the next by the previous: six over two') },
        {
          id: 'wrong',
          label: L("Keyingisidan oldingisini ayirib: olti minus ikki", 'Вычитанием предыдущего из следующего: шесть минус два', 'Subtracting previous from next: six minus two'),
          hint: L(
            "Ayirish to'rt beradi, lekin o'n sakkiz olti qo'shi to'rt emas. Ko'paytirishning teskarisi bo'lish.",
            'Вычитание даёт четыре, но восемнадцать это не шесть плюс четыре. Обратное умножению это деление.',
            'Subtraction gives four, but eighteen is not six plus four. The inverse of multiplication is division.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Maxraj uchga teng: har safar uchga ko'paytiriladi. Tekshiring: olti karra uch o'n sakkiz.",
        'Верно. Знаменатель равен трём: каждый раз умножается на три. Проверь: шесть на три восемнадцать.',
        'Correct. The ratio is three: multiplied by three each time. Check: six times three is eighteen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — SeqTable: ko'paytirish bilan.
// ============================================================
const S3 = {
  eyebrow: L("KO'PAYTIRIB TO'LDIRISH", 'ЗАПОЛНЯЕМ УМНОЖЕНИЕМ', 'FILLING BY MULTIPLYING'),
  title: L(
    "Jadval endi ko'paytirish bilan to'ladi",
    'Таблица теперь заполняется умножением',
    'The table now fills by multiplying',
  ),
  audio: [
    A('mount',
      "Birinchi had ikki, maxraj uch. Jadvalni to'ldiring: har safar oldingisini uchga ko'paytiring.",
      'Первый член два, знаменатель три. Заполни таблицу: каждый раз умножай предыдущий на три.',
      'The first term is two, the ratio is three. Fill the table: multiply the previous by three each time.'),
    W('cell',
      "Arifmetik progressiyada hadlar bir xil qadam bilan o'sardi, bu yerda esa tobora tezroq.",
      'В арифметической прогрессии члены росли одинаковым шагом, а здесь всё быстрее.',
      'In an arithmetic progression the terms grew by an equal step, here they grow ever faster.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('b₁ = 2,  q = 3', 'b₁ = 2,  q = 3', 'b₁ = 2,  q = 3')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '2', wrong: '6', hint: L("Birinchi had shartda berilgan: ikkiga teng.", 'Первый член дан в условии: равен двум.', 'The first term is given: it equals two.') },
        { value: '6', wrong: '5', hint: L("Ikkini uchga KO'PAYTIRING: olti bo'ladi, qo'shish emas.", 'УМНОЖЬ два на три: получится шесть, а не сложение.', 'MULTIPLY two by three: that makes six, not addition.') },
        { value: '18', wrong: '9', hint: L("Oltini uchga ko'paytiring: o'n sakkiz.", 'Умножь шесть на три: восемнадцать.', 'Multiply six by three: eighteen.') },
        { value: '54', wrong: '21', hint: L("O'n sakkizni uchga ko'paytiring: ellik to'rt.", 'Умножь восемнадцать на три: пятьдесят четыре.', 'Multiply eighteen by three: fifty four.') },
        { value: '162', wrong: '57', hint: L("Ellik to'rtni uchga ko'paytiring: bir yuz oltmish ikki.", 'Умножь пятьдесят четыре на три: сто шестьдесят два.', 'Multiply fifty four by three: one hundred sixty two.') },
      ]}
      ask={L(
        "Jadvalni to'ldiring: har qadamda uchga ko'paytiriladi",
        'Заполни таблицу: на каждом шаге умножается на три',
        'Fill the table: multiplied by three at each step',
      )}
      after={L(
        "Ana xolos. Ikki, olti, o'n sakkiz, ellik to'rt, bir yuz oltmish ikki. Qadam bir xil emas, lekin KARRA bir xil.",
        'Вот и всё. Два, шесть, восемнадцать, пятьдесят четыре, сто шестьдесят два. Шаг не одинаков, но МНОЖИТЕЛЬ одинаков.',
        'That is all it takes. Two, six, eighteen, fifty four, one hundred sixty two. The step is not equal, but the FACTOR is.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — MAXRAJ HAR XIL: kasr, manfiy, bir.
// ============================================================
const S4 = {
  eyebrow: L("MAXRAJ HAR XIL", 'ЗНАМЕНАТЕЛЬ БЫВАЕТ РАЗНЫМ', 'THE RATIO VARIES'),
  title: L(
    "Maxraj manfiy bo'lsa, ishoralar almashadi",
    'При отрицательном знаменателе знаки чередуются',
    'With a negative ratio the signs alternate',
  ),
  audio: [
    A('mount',
      "Darslik to'rtta misol beradi: maxraj to'rt, maxraj ikki uchdan, maxraj minus o'n ikki va maxraj bir. Manfiy maxrajga diqqat qiling.",
      'Учебник даёт четыре примера: знаменатель четыре, знаменатель две трети, знаменатель минус двенадцать и знаменатель один. Обрати внимание на отрицательный.',
      'The textbook gives four examples: ratio four, ratio two thirds, ratio minus twelve, and ratio one. Note the negative one.'),
    A('why',
      "Minus bir o'n ikkidan, bir, minus o'n ikki, bir yuz qirq to'rt. Har safar ishora almashyapti.",
      'Минус одна двенадцатая, один, минус двенадцать, сто сорок четыре. Каждый раз знак меняется.',
      'Minus one twelfth, one, minus twelve, one hundred forty four. The sign flips each time.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3, −6, 12, −24, ...', '3, −6, 12, −24, ...', '3, −6, 12, −24, ...')}
      steps={[]}
      ask={L(
        "Bu progressiyaning maxraji qanday?",
        'Каков знаменатель этой прогрессии?',
        'What is the ratio of this progression?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'q = −2' },
        {
          id: 'wrong',
          label: 'q = 2',
          hint: L(
            "Ikkiga ko'paytirilsa, ishora saqlanib qolardi. Ishoralar almashyapti, demak maxraj manfiy.",
            'При умножении на два знак бы сохранялся. Знаки чередуются, значит знаменатель отрицателен.',
            'Multiplying by two would keep the sign. The signs alternate, so the ratio is negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Maxraj manfiy bo'lsa, hadlar navbatma-navbat musbat va manfiy bo'ladi. Maxraj birga teng bo'lsa esa hamma hadlar bir xil.",
        'Верно. При отрицательном знаменателе члены чередуются: положительный, отрицательный. А при знаменателе один все члены одинаковы.',
        'Correct. With a negative ratio the terms alternate positive and negative. With ratio one all the terms are the same.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — NEGA «GEOMETRIK»: o'rta geometrik.
// 22-dars bilan parallel.
// ============================================================
const S5 = {
  eyebrow: L('NOM QAYERDAN', 'ОТКУДА НАЗВАНИЕ', 'WHERE THE NAME COMES FROM'),
  title: L(
    "Endi o'rtacha boshqacha hisoblanadi",
    'Теперь среднее считается иначе',
    'Now the mean is computed differently',
  ),
  audio: [
    A('mount',
      "22-darsda har bir had qo'shnilarining o'rta arifmetigi edi: ularni qo'shib, ikkiga bo'lardik. Bu yerda boshqacha.",
      'На 22 уроке каждый член был средним арифметическим соседей: их складывали и делили на два. Здесь иначе.',
      'In lesson 22 each term was the arithmetic mean of its neighbours: they were added and halved. Here it is different.'),
    A('why',
      "Ikki, olti, o'n sakkiz qatorini oling. Ikki karra o'n sakkiz o'ttiz olti, uning kvadrat ildizi esa olti.",
      'Возьми ряд два, шесть, восемнадцать. Два на восемнадцать тридцать шесть, а корень из этого шесть.',
      'Take the row two, six, eighteen. Two times eighteen is thirty six, and its square root is six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2,  6,  18', '2,  6,  18', '2,  6,  18')}
      steps={[
        { id: 'g', head: L('Chekkalarning ko\'paytmasi', 'Произведение крайних', 'Product of the outer two'), lines: ['2 · 18 = 36', '√36 = 6'] },
      ]}
      ask={L(
        "O'rtadagi had qo'shnilari bilan qanday bog'langan?",
        'Как средний член связан со своими соседями?',
        'How is the middle term related to its neighbours?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ularning ko'paytmasining kvadrat ildiziga teng", 'Равен квадратному корню из их произведения', 'It equals the square root of their product'),
        },
        {
          id: 'wrong',
          label: L("Ularning yig'indisining yarmiga teng", 'Равен половине их суммы', 'It equals half their sum'),
          hint: L(
            "Yig'indining yarmi o'n bo'lardi, lekin o'rtadagi had olti. Yarim yig'indi arifmetik progressiyaning xossasi edi.",
            'Половина суммы дала бы десять, а средний член шесть. Половина суммы это свойство арифметической прогрессии.',
            'Half the sum would give ten, but the middle term is six. Half the sum was the property of an arithmetic progression.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu o'rta GEOMETRIK, progressiya nomi ham shundan. Arifmetikda qo'shib bo'lardik, geometrikda ko'paytirib ildiz olamiz.",
        'Верно. Это среднее ГЕОМЕТРИЧЕСКОЕ, отсюда и название прогрессии. В арифметической складывали и делили, в геометрической умножаем и извлекаем корень.',
        'Correct. This is the GEOMETRIC mean, hence the name. In the arithmetic one we added and halved, in the geometric one we multiply and take a root.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — FORMULA: yana (n − 1).
// ============================================================
const S6 = {
  eyebrow: L('FORMULA', 'ФОРМУЛА', 'THE FORMULA'),
  title: L(
    "Yana n minus bir marta",
    'Снова n минус один раз',
    'Again n minus one times',
  ),
  audio: [
    A('mount',
      "Birinchi haddan ikkinchisiga bir marta ko'paytiriladi, uchinchisiga ikki marta, to'rtinchisiga uch marta.",
      'От первого члена ко второму умножают один раз, к третьему два, к четвёртому три.',
      'From the first term to the second one multiplication, to the third two, to the fourth three.'),
    A('why',
      "Sanoq 22-darsdagidek: qadamlar soni nomerdan bitta kam. Faqat qadam endi ko'paytirish.",
      'Счёт такой же, как на 22 уроке: шагов на один меньше номера. Только шаг теперь умножение.',
      'The count is as in lesson 22: one step fewer than the index. Only now the step is multiplication.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('b₁ = 2,  q = 3', 'b₁ = 2,  q = 3', 'b₁ = 2,  q = 3')}
      steps={[
        { id: 'a', head: L('Ikkinchisiga', 'До второго', 'To the second'), lines: ['b₂ = 2 · 3¹ = 6'] },
        { id: 'b', head: L('Uchinchisiga', 'До третьего', 'To the third'), lines: ['b₃ = 2 · 3² = 18'] },
      ]}
      ask={L(
        "Oltinchi had uchun uch qanday darajada bo'ladi?",
        'В какой степени будет тройка для шестого члена?',
        'To what power will three be raised for the sixth term?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Beshinchi', 'В пятой', 'To the fifth') },
        {
          id: 'wrong',
          label: L('Oltinchi', 'В шестой', 'To the sixth'),
          hint: L(
            "Birinchi hadga ko'paytirish kerak emas. Ikkinchisiga bir marta, demak oltinchisiga besh marta.",
            'До первого члена умножать не нужно. До второго один раз, значит до шестого пять.',
            'No multiplication is needed to reach the first term. One to the second, so five to the sixth.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Umumiy formula: b n teng b bir karra q ning n minus bir darajasi. Aynan shu sabab bilan, 22-darsdagidek.",
        'Верно. Общая формула: b n равно b один на q в степени n минус один. По той же самой причине, что и на 22 уроке.',
        'Correct. The general formula: b n equals b one times q to the power n minus one. For the very same reason as in lesson 22.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — darslikning 2-masalasi: kamayuvchi.
// ============================================================
const S7 = {
  eyebrow: L('KAMAYUVCHI PROGRESSIYA', 'УБЫВАЮЩАЯ ПРОГРЕССИЯ', 'A FALLING PROGRESSION'),
  title: L(
    "Maxraj kasr bo'lsa, hadlar kichrayadi",
    'При дробном знаменателе члены уменьшаются',
    'With a fractional ratio the terms shrink',
  ),
  audio: [
    A('mount',
      "Birinchi had sakson bir, maxraj bir uchdan. Yettinchi hadni toping.",
      'Первый член восемьдесят один, знаменатель одна третья. Найди седьмой член.',
      'The first term is eighty one, the ratio is one third. Find the seventh term.'),
    A('why',
      "Yettinchi hadga yetish uchun bir uchdanga olti marta ko'paytirish kerak, ya'ni uchning oltinchi darajasiga bo'lish.",
      'Чтобы дойти до седьмого члена, нужно шесть раз умножить на одну третью, то есть разделить на три в шестой степени.',
      'To reach the seventh term, multiply by one third six times, that is, divide by three to the sixth.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('b₁ = 81,  q = 1/3,  b₇ = ?', 'b₁ = 81,  q = 1/3,  b₇ = ?', 'b₁ = 81,  q = 1/3,  b₇ = ?')}
      steps={[
        { id: 'f', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['b₇ = 81 · (1/3)⁶', 'b₇ = 81 / 729'] },
      ]}
      ask={L(
        "Yettinchi had nechaga teng?",
        'Чему равен седьмой член?',
        'What does the seventh term equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '1/9' },
        {
          id: 'wrong',
          label: '1/729',
          hint: L(
            "Sakson bir yetti yuz yigirma to'qqizga bo'linadi, nolga emas. Sakson bir uchning to'rtinchi darajasi, shuning uchun uchning ikkinchi darajasi qoladi.",
            'Восемьдесят один делится на семьсот двадцать девять, а не единица. Восемьдесят один это три в четвёртой, поэтому остаётся три во второй.',
            'It is eighty one divided by seven hundred twenty nine, not one. Eighty one is three to the fourth, so three squared remains.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir to'qqizdan. Maxraj birdan kichik bo'lgani uchun hadlar kichrayib boradi, xuddi xukdagi uchburchaklar kabi.",
        'Верно. Одна девятая. Так как знаменатель меньше единицы, члены уменьшаются, как треугольники из хука.',
        'Correct. One ninth. Since the ratio is less than one, the terms shrink, like the triangles in the opening.',
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
    "Algebra 9, 31-§, ta'rif va 1-2-masalalar (162-164-bet)",
    'Алгебра 9, §31, определение и задачи 1-2 (стр. 162-164)',
    'Algebra 9, §31, the definition and problems 1-2 (p. 162-164)',
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
          "Arifmetik va geometrik progressiya nimasi bilan farq qiladi?",
          'Чем отличаются арифметическая и геометрическая прогрессии?',
          'How do the arithmetic and geometric progressions differ?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Birinchisida qo'shiladi, ikkinchisida ko'paytiriladi", 'В первой прибавляют, во второй умножают', 'In the first you add, in the second you multiply'),
          },
          {
            id: 'wrong',
            label: L("Faqat nomi bilan", 'Только названием', 'Only by their name'),
            hint: L(
              "3-ekranni eslang: u yerda qadam bir xil emas edi, karra bir xil edi. Bu boshqa amal.",
              'Вспомни 3 экран: там шаг не был одинаковым, одинаковым был множитель. Это другое действие.',
              'Recall screen 3: there the step was not equal, the factor was. That is a different operation.',
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
    "Maxraj, daraja va o'rta geometrik",
    'Знаменатель, степень и среднее геометрическое',
    'The ratio, the power, and the geometric mean',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz maxrajni topdingiz, uning manfiy va kasr bo'lishini ko'rdingiz, nomning sababini bildingiz va formulani chiqardingiz.",
      'На семи экранах ты нашёл знаменатель, увидел его отрицательным и дробным, узнал причину названия и вывел формулу.',
      'On seven screens you found the ratio, saw it negative and fractional, learned the reason for the name, and derived the formula.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SeqTable: MANFIY maxraj.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Endi maxraj manfiy",
    'Теперь знаменатель отрицателен',
    'Now the ratio is negative',
  ),
  audio: [
    A('mount',
      "Birinchi had uch, maxraj minus ikki. Jadvalni to'ldiring: har safar minus ikkiga ko'paytiring.",
      'Первый член три, знаменатель минус два. Заполни таблицу: каждый раз умножай на минус два.',
      'The first term is three, the ratio is minus two. Fill the table: multiply by minus two each time.'),
    A('why',
      "Ishoralar navbatma-navbat almashadi, lekin absolyut qiymat ikki barobar o'sib boradi.",
      'Знаки чередуются, но абсолютная величина удваивается.',
      'The signs alternate, but the magnitude doubles.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('b₁ = 3,  q = −2', 'b₁ = 3,  q = −2', 'b₁ = 3,  q = −2')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '3', wrong: '−6', hint: L("Birinchi had shartda berilgan: uchga teng.", 'Первый член дан в условии: равен трём.', 'The first term is given: it equals three.') },
        { value: '−6', wrong: '6', hint: L("Uchni minus ikkiga ko'paytiring: minus olti. Ishora almashadi.", 'Умножь три на минус два: минус шесть. Знак меняется.', 'Multiply three by minus two: minus six. The sign flips.') },
        { value: '12', wrong: '−12', hint: L("Minus oltini minus ikkiga ko'paytiring: ikki manfiy musbat beradi, o'n ikki.", 'Умножь минус шесть на минус два: два минуса дают плюс, двенадцать.', 'Multiply minus six by minus two: two negatives give a positive, twelve.') },
        { value: '−24', wrong: '24', hint: L("O'n ikkini minus ikkiga ko'paytiring: minus yigirma to'rt.", 'Умножь двенадцать на минус два: минус двадцать четыре.', 'Multiply twelve by minus two: minus twenty four.') },
        { value: '48', wrong: '−48', hint: L("Minus yigirma to'rtni minus ikkiga ko'paytiring: qirq sakkiz, musbat.", 'Умножь минус двадцать четыре на минус два: сорок восемь, положительное.', 'Multiply minus twenty four by minus two: forty eight, positive.') },
      ]}
      ask={L(
        "Jadvalni to'ldiring: maxraj manfiy, ishoralar almashadi",
        'Заполни таблицу: знаменатель отрицателен, знаки чередуются',
        'Fill the table: the ratio is negative, the signs alternate',
      )}
      after={L(
        "Ana xolos. Uch, minus olti, o'n ikki, minus yigirma to'rt, qirq sakkiz. Toq nomerlarda musbat, juftlarida manfiy.",
        'Вот и всё. Три, минус шесть, двенадцать, минус двадцать четыре, сорок восемь. На нечётных номерах положительные, на чётных отрицательные.',
        'That is all it takes. Three, minus six, twelve, minus twenty four, forty eight. Positive at odd indices, negative at even ones.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: maxrajni topish.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Maxrajni topish",
    'Находим знаменатель',
    'Finding the ratio',
  ),
  audio: [
    A('mount',
      "Uchta progressiya. Har birida maxrajni toping.",
      'Три прогрессии. В каждой найди знаменатель.',
      'Three progressions. Find the ratio in each.'),
    A('why',
      "Keyingi hadni oldingisiga bo'ling.",
      'Раздели следующий член на предыдущий.',
      'Divide the next term by the previous one.'),
  ],
  props: {
    stepLabel: L('Progressiya', 'Прогрессия', 'Progression'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi: maxraj butun, kasr va manfiy bo'lishi mumkin.",
      'Все три найдены: знаменатель может быть целым, дробным и отрицательным.',
      'All three are found: the ratio can be whole, fractional or negative.',
    ),
    tasks: [
      {
        expr: '2, 8, 32, 128, ...',
        question: L('Maxraj nechaga teng?', 'Чему равен знаменатель?', 'What does the ratio equal?'),
        ok: L("Ha. Sakkiz bo'lingan ikki, to'rtga teng.", 'Да. Восемь делить на два, равно четырём.', 'Yes. Eight over two, equals four.'),
        items: [
          { id: 'a', right: true, label: 'q = 4' },
          { id: 'b', label: 'q = 6', hint: L("Olti bu sakkiz minus ikki, ya'ni ayirma. Geometrik progressiyada esa bo'lish kerak.", 'Шесть это восемь минус два, то есть разность. А в геометрической прогрессии нужно делить.', 'Six is eight minus two, a difference. In a geometric progression you must divide.') },
        ],
        solution: ['8 : 2 = 4', '32 : 8 = 4'],
      },
      {
        expr: '1, 2/3, 4/9, 8/27, ...',
        question: L('Maxraj nechaga teng?', 'Чему равен знаменатель?', 'What does the ratio equal?'),
        ok: L("Ha. Ikki uchdan bo'lingan bir, ikki uchdanga teng.", 'Да. Две трети делить на один, равно двум третьим.', 'Yes. Two thirds over one, equals two thirds.'),
        items: [
          { id: 'a', right: true, label: 'q = 2/3' },
          { id: 'b', label: 'q = 3/2', hint: L("Hadlar kichrayib boryapti, demak maxraj birdan kichik bo'lishi kerak. Uch ikkidan esa birdan katta.", 'Члены уменьшаются, значит знаменатель должен быть меньше единицы. А три вторых больше единицы.', 'The terms are shrinking, so the ratio must be less than one. Three halves is greater than one.') },
        ],
        solution: ['(2/3) : 1 = 2/3', '(4/9) : (2/3) = 2/3'],
      },
      {
        expr: '5, −15, 45, −135, ...',
        question: L('Maxraj nechaga teng?', 'Чему равен знаменатель?', 'What does the ratio equal?'),
        ok: L("Ha. Minus o'n besh bo'lingan besh, minus uchga teng.", 'Да. Минус пятнадцать делить на пять, равно минус трём.', 'Yes. Minus fifteen over five, equals minus three.'),
        items: [
          { id: 'a', right: true, label: 'q = −3' },
          { id: 'b', label: 'q = 3', hint: L("Uchga ko'paytirilsa, hamma hadlar musbat qolardi. Ishoralar almashyapti, demak maxraj manfiy.", 'При умножении на три все члены остались бы положительными. Знаки чередуются, значит знаменатель отрицателен.', 'Multiplying by three would keep all terms positive. The signs alternate, so the ratio is negative.') },
        ],
        solution: ['(−15) : 5 = −3', '45 : (−15) = −3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: darslikning 3-masalasi.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Nomerni daraja orqali topish",
    'Находим номер через степень',
    'Finding the index through the power',
  ),
  audio: [
    A('mount',
      "Har savolda progressiya va had berilgan. Formulaga qo'yib, darajani, keyin nomerni toping.",
      'В каждом вопросе даны прогрессия и член. Подставь в формулу, найди степень, потом номер.',
      'Each question gives a progression and a term. Substitute into the formula, find the power, then the index.'),
    A('why',
      "Daraja topilgach, nomerni olish uchun unga bittani qo'shish kerak.",
      'Найдя степень, чтобы получить номер, к ней нужно прибавить единицу.',
      'Once the power is found, add one to it to get the index.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi: daraja n minus birga teng, shuning uchun nomer undan bittaga katta.",
      'Все три найдены: степень равна n минус один, поэтому номер на единицу больше неё.',
      'All three are found: the power equals n minus one, so the index is one greater.',
    ),
    tasks: [
      {
        expr: '2, 6, 18, ...   486 = ?',
        question: L('To\'rt yuz sakson oltining nomeri qanday?', 'Каков номер четырёхсот восьмидесяти шести?', 'What is the index of four hundred eighty six?'),
        ok: L("Ha. Uchning beshinchi darajasi ikki yuz qirq uch, demak daraja besh, nomer esa olti.", 'Да. Три в пятой степени двести сорок три, значит степень пять, а номер шесть.', 'Yes. Three to the fifth is two hundred forty three, so the power is five and the index is six.'),
        items: [
          { id: 'a', right: true, label: 'n = 6' },
          { id: 'b', label: 'n = 5', hint: L("Besh bu DARAJA, nomer emas. Daraja n minus birga teng, demak nomer bittaga katta.", 'Пять это СТЕПЕНЬ, а не номер. Степень равна n минус один, значит номер на единицу больше.', 'Five is the POWER, not the index. The power equals n minus one, so the index is one greater.') },
        ],
        solution: ['486 = 2 · 3ⁿ⁻¹', '243 = 3ⁿ⁻¹ = 3⁵', 'n − 1 = 5,  n = 6'],
      },
      {
        expr: '3, 6, 12, ...   96 = ?',
        question: L('To\'qson oltining nomeri qanday?', 'Каков номер девяноста шести?', 'What is the index of ninety six?'),
        ok: L("Ha. To'qson olti bo'lingan uch o'ttiz ikki, bu ikkining beshinchi darajasi, demak nomer olti.", 'Да. Девяносто шесть делить на три тридцать два, это два в пятой степени, значит номер шесть.', 'Yes. Ninety six over three is thirty two, which is two to the fifth, so the index is six.'),
        items: [
          { id: 'a', right: true, label: 'n = 6' },
          { id: 'b', label: 'n = 32', hint: L("O'ttiz ikki bu ikkining darajasidan chiqqan son, nomer emas. Ikkining qaysi darajasi o'ttiz ikkiga teng?", 'Тридцать два это результат возведения двойки в степень, а не номер. В какой степени два равно тридцати двум?', 'Thirty two is the result of raising two to a power, not the index. To what power is two thirty two?') },
        ],
        solution: ['96 = 3 · 2ⁿ⁻¹', '32 = 2ⁿ⁻¹ = 2⁵', 'n = 6'],
      },
      {
        expr: '1, 2, 4, 8, ...   100 = ?',
        question: L('Yuz bu progressiyaning hadimi?', 'Является ли сто членом этой прогрессии?', 'Is one hundred a term of this progression?'),
        ok: L("Yo'q. Yuz ikkining darajasi emas: ikkining oltinchi darajasi oltmish to'rt, yettinchisi bir yuz yigirma sakkiz.", 'Нет. Сто не является степенью двойки: два в шестой шестьдесят четыре, в седьмой сто двадцать восемь.', 'No. One hundred is not a power of two: two to the sixth is sixty four, to the seventh is one hundred twenty eight.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Ikkining darajalarini sanang: bir, ikki, to'rt, sakkiz, o'n olti, o'ttiz ikki, oltmish to'rt, bir yuz yigirma sakkiz. Yuz ular orasida yo'q.", 'Перечисли степени двойки: один, два, четыре, восемь, шестнадцать, тридцать два, шестьдесят четыре, сто двадцать восемь. Ста среди них нет.', 'List the powers of two: one, two, four, eight, sixteen, thirty two, sixty four, one hundred twenty eight. One hundred is not among them.') },
        ],
        solution: ['100 = 2ⁿ⁻¹ ?', L('2⁶ = 64,  2⁷ = 128', '2⁶ = 64,  2⁷ = 128', '2⁶ = 64,  2⁷ = 128'), L('Butun daraja yoq', 'Целой степени нет', 'No whole power exists')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Kamron ko'paytirish o'rniga qo'shgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ko'paytirish o'rniga qo'shish",
    'Сложить вместо умножения',
    'Adding instead of multiplying',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Birinchi had besh, maxraj ikki. To'rtinchi hadni topish uchun u beshga ikkini uch marta qo'shib, o'n bir deb yozgan.",
      'Решение Камрона. Первый член пять, знаменатель два. Чтобы найти четвёртый член, он трижды прибавил к пяти двойку и записал одиннадцать.',
      "Kamron's solution. The first term is five, the ratio is two. To find the fourth term he added two to five three times and wrote eleven."),
    A('why',
      "Qadamlar soni to'g'ri, ularning uchtasi bor. Lekin amal to'g'rimi?",
      'Число шагов верное, их три. Но верно ли действие?',
      'The number of steps is right, there are three of them. But is the operation right?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamron qadamlarni to'g'ri sanagan, lekin geometrik progressiyada har qadamda KO'PAYTIRILADI: besh, o'n, yigirma, qirq.",
      'Камрон верно посчитал шаги, но в геометрической прогрессии на каждом шаге УМНОЖАЮТ: пять, десять, двадцать, сорок.',
      'Kamron counted the steps correctly, but in a geometric progression each step MULTIPLIES: five, ten, twenty, forty.',
    ),
    tasks: [
      {
        expr: 'b₁ = 5,  q = 2,  b₄ = ?',
        question: L(
          "Kamron uch marta ikkini qo'shdi. Geometrik progressiyada har qadamda qanday amal bajariladi?",
          'Камрон трижды прибавил двойку. Какое действие выполняется на каждом шаге в геометрической прогрессии?',
          'Kamron added two three times. What operation is performed at each step in a geometric progression?',
        ),
        ok: L(
          "To'g'ri: ko'paytirish. Besh, o'n, yigirma, qirq. Javob qirq, o'n bir emas.",
          'Верно: умножение. Пять, десять, двадцать, сорок. Ответ сорок, а не одиннадцать.',
          'Correct: multiplication. Five, ten, twenty, forty. The answer is forty, not eleven.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ko'paytirish, javob qirq", 'Умножение, ответ сорок', 'Multiplication, the answer is forty'),
          },
          {
            id: 'b',
            label: L("Qo'shish, Kamron to'g'ri qilgan", 'Сложение, Камрон прав', 'Addition, Kamron is right'),
            hint: L("Qo'shish arifmetik progressiyaning amali. Geometrikda maxraj KARRA sifatida ishlaydi: besh karra ikki o'n.", 'Сложение это действие арифметической прогрессии. В геометрической знаменатель работает как МНОЖИТЕЛЬ: пять на два десять.', 'Addition is the arithmetic progression operation. In the geometric one the ratio acts as a FACTOR: five times two is ten.'),
          },
        ],
        solution: [
          'b₄ = 5 · 2³ = 5 · 8 = 40',
          L('Kamron: 5 + 2 + 2 + 2 = 11', 'Камрон: 5 + 2 + 2 + 2 = 11', 'Kamron: 5 + 2 + 2 + 2 = 11'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 4-masalasi: IKKITA javob.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ikkita had berilgan, ikkita javob chiqadi",
    'Даны два члена, получается два ответа',
    'Two terms given, two answers result',
  ),
  audio: [
    A('mount',
      "Darslikdan masala. Oltinchi had to'qson olti, sakkizinchisi uch yuz sakson to'rt. Ikkinchisini birinchisiga bo'lsak, maxrajning kvadrati chiqadi.",
      'Задача из учебника. Шестой член девяносто шесть, восьмой триста восемьдесят четыре. Разделив второй на первый, получим квадрат знаменателя.',
      'A problem from the textbook. The sixth term is ninety six, the eighth is three hundred eighty four. Dividing the second by the first gives the square of the ratio.'),
    A('why',
      "Kvadrati to'rtga teng bo'lgan sonlar nechta?",
      'Сколько существует чисел, квадрат которых равен четырём?',
      'How many numbers have a square equal to four?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: kvadrati to'rt bo'lgan ikkita son bor, shuning uchun masalaning ikkita javobi bor. 22-darsdagi shunga o'xshash masalada javob bitta edi.",
      'Найдено: чисел с квадратом четыре два, поэтому у задачи два ответа. В похожей задаче на 22 уроке ответ был один.',
      'Found: two numbers have a square of four, so the problem has two answers. In the similar problem in lesson 22 there was only one.',
    ),
    tasks: [
      {
        expr: 'b₆ = 96,  b₈ = 384,  q = ?',
        question: L(
          "Bo'lgandan keyin maxrajning kvadrati to'rtga teng chiqdi. Maxraj nechaga teng?",
          'После деления квадрат знаменателя оказался равен четырём. Чему равен знаменатель?',
          'After dividing, the square of the ratio came out as four. What does the ratio equal?',
        ),
        ok: L(
          "Ha, ikkita javob. Maxraj ikki bo'lsa birinchi had uch, minus ikki bo'lsa minus uch. Ikkalasi ham shartni qanoatlantiradi.",
          'Да, два ответа. При знаменателе два первый член три, при минус двух минус три. Оба удовлетворяют условию.',
          'Yes, two answers. With ratio two the first term is three, with minus two it is minus three. Both satisfy the statement.',
        ),
        items: [
          { id: 'a', right: true, label: L('Ikki yoki minus ikki', 'Два или минус два', 'Two or minus two') },
          { id: 'b', label: L('Faqat ikki', 'Только два', 'Only two'), hint: L("Minus ikkining kvadrati ham to'rtga teng. Ikkala ildizni ham tekshirish kerak, ularning ikkalasi ham javob beradi.", 'Квадрат минус двух тоже равен четырём. Нужно проверить оба корня, и оба дают ответ.', 'Minus two squared is also four. Both roots must be checked, and both give an answer.') },
        ],
        solution: [
          '384 : 96 = q²,  q² = 4',
          'q = 2  →  b₁ = 3',
          'q = −2  →  b₁ = −3',
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
    "Blits: maxraj, daraja, ishora",
    'Блиц: знаменатель, степень, знак',
    'Blitz: ratio, power, sign',
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
        tag: 'qoshish-bilan-adashtirish',
        ask: L(
          "Geometrik progressiyada maxraj qo'shiladimi yoki ko'paytiriladimi?",
          'В геометрической прогрессии знаменатель прибавляется или умножается?',
          'In a geometric progression, is the ratio added or multiplied?',
        ),
        options: [
          { id: 'mul', right: true, label: L("Ko'paytiriladi", 'Умножается', 'Multiplied') },
          { id: 'add', label: L("Qo'shiladi", 'Прибавляется', 'Added') },
        ],
        ok: L(
          "To'g'ri. Qo'shish arifmetik progressiyaning amali edi.",
          'Верно. Сложение было действием арифметической прогрессии.',
          'Correct. Addition was the operation of the arithmetic progression.',
        ),
        hint: L(
          "12-ekranni eslang: Kamronning xatosi aynan shu edi.",
          'Вспомни 12 экран: именно в этом была ошибка Камрона.',
          "Recall screen 12: this was exactly Kamron's mistake.",
        ),
      },
      {
        id: 'q2',
        tag: 'darajani-notogri-olish',
        ask: L(
          "Beshinchi hadni topish uchun maxraj qanday darajaga ko'tariladi?",
          'В какую степень возводится знаменатель для нахождения пятого члена?',
          'To what power is the ratio raised to find the fifth term?',
        ),
        options: [
          { id: 'four', right: true, label: L("To'rtinchi", 'В четвёртую', 'The fourth') },
          { id: 'five', label: L('Beshinchi', 'В пятую', 'The fifth') },
        ],
        ok: L(
          "To'g'ri. Daraja nomerdan bitta kam, chunki birinchi hadga ko'paytirish kerak emas.",
          'Верно. Степень на единицу меньше номера, ведь до первого члена умножать не нужно.',
          'Correct. The power is one less than the index, since no multiplication reaches the first term.',
        ),
        hint: L(
          "6-ekranni eslang: bu 22-darsdagi n minus bir qoidasining o'zi, faqat amal boshqa.",
          'Вспомни 6 экран: это то же правило n минус один с 22 урока, только действие другое.',
          'Recall screen 6: this is the same n minus one rule as in lesson 22, only the operation differs.',
        ),
      },
      {
        id: 'q3',
        tag: 'manfiy-maxrajni-tanimaslik',
        ask: L(
          "Maxraj manfiy bo'lsa, hadlarning ishorasi qanday bo'ladi?",
          'Какими будут знаки членов при отрицательном знаменателе?',
          'What happens to the signs of the terms when the ratio is negative?',
        ),
        options: [
          { id: 'alt', right: true, label: L('Navbatma-navbat almashadi', 'Чередуются', 'They alternate') },
          { id: 'neg', label: L('Hammasi manfiy', 'Все отрицательные', 'All negative') },
        ],
        ok: L(
          "To'g'ri. Ikki manfiy ko'paytirilganda musbat chiqadi, shuning uchun ishoralar almashadi.",
          'Верно. Произведение двух отрицательных положительно, поэтому знаки чередуются.',
          'Correct. Two negatives multiply to a positive, so the signs alternate.',
        ),
        hint: L(
          "9-ekranni eslang: uch, minus olti, o'n ikki, minus yigirma to'rt.",
          'Вспомни 9 экран: три, минус шесть, двенадцать, минус двадцать четыре.',
          'Recall screen 9: three, minus six, twelve, minus twenty four.',
        ),
      },
      {
        id: 'q4',
        tag: 'ikkinchi-javobni-yoqotish',
        ask: L(
          "Maxrajning kvadrati to'qqizga teng chiqsa, nechta javob bo'ladi?",
          'Если квадрат знаменателя оказался равен девяти, сколько будет ответов?',
          'If the square of the ratio comes out as nine, how many answers are there?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Один', 'One') },
        ],
        ok: L(
          "To'g'ri. Uch va minus uch: kvadrati to'qqizga teng bo'lgan ikkita son bor.",
          'Верно. Три и минус три: чисел с квадратом девять два.',
          'Correct. Three and minus three: two numbers have a square of nine.',
        ),
        hint: L(
          "13-ekranni eslang: u yerda kvadrat to'rtga teng edi va ikkita javob chiqqan edi.",
          'Вспомни 13 экран: там квадрат равнялся четырём и получилось два ответа.',
          'Recall screen 13: there the square was four and two answers resulted.',
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
    "Karra, daraja va o'rta geometrik",
    'Множитель, степень и среднее геометрическое',
    'The factor, the power, and the geometric mean',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda uchburchaklar ketma-ketligida qo'shish emas, ko'paytirish borligini topdingiz. Bugun shu farq butun mavzuni ochdi.",
      'На первом экране ты обнаружил, что в ряду треугольников не прибавление, а умножение. Сегодня это отличие раскрыло всю тему.',
      'On the first screen you found that the row of triangles multiplies rather than adds. Today that difference opened the whole topic.'),
    A('s1',
      "Siz maxrajni topishni, uning kasr va manfiy bo'lishini, o'rta geometrik xossasini va daraja formulasini o'rgandingiz.",
      'Ты освоил нахождение знаменателя, его дробность и отрицательность, свойство среднего геометрического и формулу со степенью.',
      'You learned to find the ratio, that it can be fractional or negative, the geometric mean property, and the power formula.'),
    A('s2',
      "Keyingi darsda geometrik progressiyaning yig'indisi.",
      'В следующем уроке сумма геометрической прогрессии.',
      'The next lesson covers the sum of a geometric progression.'),
  ],
  props: {
    mark: 'bₙ = b₁·qⁿ⁻¹',
    markNote: L(
      "n minus bir marta ko'paytiriladi",
      'умножается n минус один раз',
      'multiplied n minus one times',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: geometrik progressiya yigindisi',
      'Следующий урок: сумма геометрической прогрессии',
      'Next lesson: the sum of a geometric progression',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'qoshish-bilan-adashtirish', ...S2 },
  { role: 'explain',  tool: 'seqtable', tag: 'qoshish-bilan-adashtirish', ...S3 },
  { role: 'explain',  tag: 'manfiy-maxrajni-tanimaslik', ...S4 },
  { role: 'explain',  tag: 'qoshish-bilan-adashtirish', ...S5 },
  { role: 'explain',  tag: 'darajani-notogri-olish', ...S6 },
  { role: 'explain',  tag: 'darajani-notogri-olish', ...S7 },
  { role: 'rule',     tag: 'qoshish-bilan-adashtirish', ...S8 },
  { role: 'practice', tool: 'seqtable', tag: 'manfiy-maxrajni-tanimaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-bilan-adashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'darajani-notogri-olish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-bilan-adashtirish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ikkinchi-javobni-yoqotish', ...S13 },
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
