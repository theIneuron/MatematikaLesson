// ============================================================================
// 9-sinf, Dars 13. SISTEMA ORQALI MASALALAR.
//
// REDAKSIYA 1, 2026-08-27. Darslik: II bobga oid mashqlar, 205(1)-masala
// (86-bet): ikki xonali son o'z raqamlari yig'indisidan uch marta katta,
// raqamlar yig'indisining kvadrati esa berilgan sondan uch marta katta.
// Sonni toping. Bosh misol: N va s (son va raqamlar yig'indisi) bo'yicha
// sistema, Dars11dagi o'rniga qo'yish texnikasi bilan yechiladi, natijada
// ikkita nomzod chiqadi va biri masala shartiga (ikki xonali son) ZID
// bo'lgani uchun rad etiladi. 205(2)-masala bilan bir xil tuzilish
// tasdiqlanadi. Ikkinchi misol — sinfning o'zi tuzgan, Dars09dagi Viyet
// teoremasi teskarisini masalaga qaytarish uchun.
//
// BLOK 2 (7-13-DARSLAR) SHU DARS BILAN YAKUNLANADI. RecallMC ishlatildi
// (Dars09, 11, 12dagi qaror bilan bir xil).
//
// TEGLAR (o'zining):
//   ozgaruvchi-notogri-tanlash    — nimani x (yoki N, s) deb belgilash
//                                   noaniq yoki chalkash tanlanishi
//   shartni-notogri-tenglamaga-otkazish — so'zdagi shartni noto'g'ri
//                                   tenglamaga aylantirish
//   nomuvofiq-yechimni-qabul-qilish — matematik jihatdan to'g'ri, lekin
//                                   masala shartiga zid yechimni qabul
//                                   qilish
//   javobni-masala-tiliga-qaytarmaslik — topilgan sonni masala savoliga
//                                   javob sifatida aniq yozmaslik
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-13',
  n: 13,
  row: 13,
  block: 'Б2',
  topic: L('Masalalar', 'Задачи', 'Word problems'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Masalani sistema orqali yechishda avval har bir noma'lum aniq nima anglatishini belgilash kerak",
    'При решении задачи через систему сначала нужно определить, что именно означает каждое неизвестное',
    'When solving a problem through a system, first it must be defined exactly what each unknown means',
  ),
  L(
    "So'zdagi har bir shart alohida tenglamaga aylanadi, sistema shu ikki tenglamadan tuziladi",
    'Каждое условие в тексте превращается в отдельное уравнение, система составляется из этих двух уравнений',
    'Each condition in the text becomes a separate equation, the system is built from these two equations',
  ),
  L(
    "Matematik jihatdan to'g'ri chiqqan yechim ham masala shartiga zid bo'lsa, rad etiladi",
    'Даже математически верно найденное решение отбрасывается, если оно противоречит условию задачи',
    'Even a mathematically correct solution is rejected if it contradicts the conditions of the problem',
  ),
]

export const MISS = {
  'ozgaruvchi-notogri-tanlash': {
    what: L(
      "noma'lum nimani anglatishi noaniq yoki chalkash belgilandi",
      'неясно или путано определено, что означает неизвестное',
      'it was unclear or confused what the unknown means',
    ),
    wrong: null,
    at: 0,
  },
  'shartni-notogri-tenglamaga-otkazish': {
    what: L(
      "so'zdagi shart noto'g'ri tenglamaga aylantirildi",
      'условие в тексте неверно превращено в уравнение',
      'the condition in the text was turned into the wrong equation',
    ),
    wrong: null,
    at: 0,
  },
  'nomuvofiq-yechimni-qabul-qilish': {
    what: L(
      "masala shartiga zid yechim tekshirilmasdan qabul qilindi",
      'решение, противоречащее условию задачи, принято без проверки',
      'a solution contradicting the problem was accepted without checking',
    ),
    wrong: null,
    at: 0,
  },
  'javobni-masala-tiliga-qaytarmaslik': {
    what: L(
      "topilgan son masala savoliga aniq javob sifatida yozilmadi",
      'найденное число не записано как чёткий ответ на вопрос задачи',
      "the found number was not written as a clear answer to the problem's question",
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('SO\'ZDAN TENGLAMAGA', 'ОТ СЛОВ К УРАВНЕНИЮ', 'FROM WORDS TO AN EQUATION'),
  title: L(
    "Bu masalani tusmollab topib bo'lmaydi",
    'Эту задачу не угадать наугад',
    'This problem cannot be guessed at random',
  ),
  audio: [
    A('mount',
      "Masala: ikki xonali son o'z raqamlari yig'indisidan uch marta katta. Raqamlar yig'indisining kvadrati esa shu sondan uch marta katta.",
      'Задача: двузначное число в три раза больше суммы своих цифр. А квадрат суммы цифр в три раза больше данного числа.',
      'Problem: a two-digit number is three times the sum of its digits. And the square of the digit sum is three times the number.'),
    A('why',
      "Bunday shartlarni tusmollab topish qiyin. Ularni tenglamaga aylantirsak-chi?",
      'Такие условия трудно угадать. А что если превратить их в уравнения?',
      'Such conditions are hard to guess. What if we turn them into equations?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Bunday masalani qanday yechish qulay?",
      'Как удобнее решать такую задачу?',
      'How is it convenient to solve such a problem?',
    ),
    items: [
      { id: 'right', right: true, show: L("Sonni va raqamlar yig'indisini harf bilan belgilab, sistema tuzish", 'Обозначить число и сумму цифр буквами и составить систему', 'Denote the number and the digit sum with letters and build a system') },
      {
        id: 'wrong',
        show: L('Sonlarni birma-bir sinab ko\'rish', 'Перебирать числа одно за другим', 'Try numbers one by one'),
        hint: L(
          "Bu ham ishlashi mumkin, lekin uzoq va ishonchsiz. Harf bilan belgilab, tenglama tuzish aniq va tez yo'l beradi.",
          'Это тоже может сработать, но долго и ненадёжно. Обозначение буквами и составление уравнения дают точный и быстрый путь.',
          'This might also work, but it is slow and unreliable. Denoting with letters and building an equation gives an exact, fast path.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun sonni N, raqamlar yig'indisini s deb belgilab, sistema tuzamiz.",
      'Верно. Сегодня обозначим число N, сумму цифр s, и составим систему.',
      'Correct. Today we denote the number N, the digit sum s, and build a system.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — ikki xonali son va raqamlar yig'indisi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Raqamlar yig'indisini eslash",
    'Вспоминаем сумму цифр',
    'Recalling the digit sum',
  ),
  audio: [
    A('mount',
      "Savol: yigirma yettining raqamlari yig'indisi nechiga teng?",
      'Вопрос: чему равна сумма цифр числа двадцать семь?',
      'Question: what is the digit sum of twenty-seven?'),
    A('why',
      "Ikki va yettini qo'shing.",
      'Сложи два и семь.',
      'Add two and seven.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('27', '27', '27')}
      steps={[
        { id: 'sum', head: '2 + 7', lines: ['9'] },
      ]}
      ask={L(
        "Yigirma yettining raqamlari yig'indisi nechiga teng?",
        'Чему равна сумма цифр числа двадцать семь?',
        'What is the digit sum of twenty-seven?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '9' },
        {
          id: 'wrong',
          label: '27',
          hint: L(
            "Raqamlar yig'indisi sonning o'zi emas: ikki va yettini alohida qo'shing.",
            'Сумма цифр это не само число: сложи два и семь по отдельности.',
            "The digit sum is not the number itself: add two and seven separately.",
          ),
        },
      ]}
      after={L(
        "To'g'ri. Raqamlar yig'indisi to'qqiz. Bugun masalada aynan shu sondan foydalanamiz.",
        'Верно. Сумма цифр девять. Сегодня в задаче используем именно это число.',
        "Correct. The digit sum is nine. Today's problem uses exactly this number.",
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — SO'ZDAN SISTEMAGA.
// ============================================================
const S3 = {
  eyebrow: L('SISTEMA TUZISH', 'СОСТАВЛЕНИЕ СИСТЕМЫ', 'BUILDING THE SYSTEM'),
  title: L(
    "Har bir shart o'z tenglamasini beradi",
    'Каждое условие даёт своё уравнение',
    'Each condition gives its own equation',
  ),
  audio: [
    A('mount',
      "Sonni N, raqamlar yig'indisini s deb belgilaymiz. Birinchi shart: son yig'indidan uch marta katta.",
      'Обозначим число N, сумму цифр s. Первое условие: число в три раза больше суммы.',
      'We denote the number N, the digit sum s. The first condition: the number is three times the sum.'),
    A('why',
      "Ikkinchi shart: yig'indining kvadrati sondan uch marta katta.",
      'Второе условие: квадрат суммы в три раза больше числа.',
      'The second condition: the square of the sum is three times the number.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L("N = son,  s = raqamlar yig'indisi", 'N = число,  s = сумма цифр', 'N = the number,  s = the digit sum')}
      steps={[
        { id: 'first', head: '1', lines: ['N = 3s'] },
        { id: 'second', head: '2', lines: ['s² = 3N'] },
      ]}
      ask={L(
        "\"Son yig'indidan uch marta katta\" degan gap qaysi tenglamaga aylanadi?",
        'Фраза о том, что число в три раза больше суммы, превращается в какое уравнение?',
        'The phrase "the number is three times the sum" turns into which equation?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'N = 3s' },
        {
          id: 'wrong',
          label: 'N = s + 3',
          hint: L(
            "\"Uch marta katta\" ko'paytirishni bildiradi, uch qo'shishni emas: N s ga emas, uch karra s ga teng.",
            'Слова в три раза больше означают умножение, а не прибавление тройки: N равно не s плюс три, а трижды s.',
            '"Three times greater" means multiplication, not adding three: N equals not s plus three, but three times s.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkala shart ham tenglamaga aylandi: N teng uch s, s kvadrat teng uch N.",
        'Верно. Оба условия превратились в уравнения: N равно три s, s в квадрате равно три N.',
        'Correct. Both conditions turned into equations: N equals three s, s squared equals three N.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — O'RNIGA QO'YISH (11-DARSDAN).
// ============================================================
const S4 = {
  eyebrow: L("TANISH YO'L", 'ЗНАКОМЫЙ ПУТЬ', 'A FAMILIAR PATH'),
  title: L(
    "11-darsdagi yo'l bilan yechamiz",
    'Решаем путём с 11 урока',
    'We solve by the path from lesson 11',
  ),
  audio: [
    A('mount',
      "N allaqachon uch s orqali ifodalangan. Buni ikkinchi tenglamaga qo'ying.",
      'N уже выражен через три s. Подставь это во второе уравнение.',
      'N is already expressed through three s. Substitute this into the second equation.'),
    W('reduce',
      "S kvadrat teng uch karra uch s, ya'ni to'qqiz s. Bu yerdan s kvadrat minus to'qqiz s teng nol.",
      's в квадрате равно три, умноженное на три s, то есть девять s. Отсюда s в квадрате минус девять s равно нулю.',
      's squared equals three times three s, that is nine s. From this, s squared minus nine s equals zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('N = 3s,  s² = 3N', 'N = 3s,  s² = 3N', 'N = 3s,  s² = 3N')}
      steps={[
        { id: 'sub', head: 's²', lines: ['s² = 3(3s)', 's² = 9s'] },
        { id: 'factor', head: 's² − 9s', lines: ['s(s − 9) = 0'] },
      ]}
      ask={L(
        "S(s minus to'qqiz) teng nol tenglamasining ildizlari qanday?",
        'Каковы корни уравнения s, умноженное на s минус девять, равно нулю?',
        'What are the roots of the equation s times s minus nine equals zero?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 's = 0  yoki  s = 9' },
        {
          id: 'wrong',
          label: 's = 9  bitta ildiz',
          hint: L(
            "Ko'paytma nolga teng bo'lishi uchun ko'paytuvchilardan BIRI nolga teng bo'lishi kifoya: s ning o'zi ham, s minus to'qqiz ham nolga teng bo'lishi mumkin.",
            'Чтобы произведение равнялось нулю, достаточно, чтобы ОДИН из множителей был равен нулю: и сам s, и s минус девять могут быть равны нулю.',
            'For a product to equal zero, it is enough that ONE factor equals zero: both s itself and s minus nine can be zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkita nomzod bor: s nol yoki s to'qqiz. Ikkalasini ham tekshiramiz.",
        'Верно. Есть два кандидата: s равен нулю или s равен девяти. Проверим оба.',
        'Correct. There are two candidates: s equals zero or s equals nine. We check both.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — MASALA SHARTIGA ZID YECHIMNI RAD ETISH.
// ============================================================
const S5 = {
  eyebrow: L('SHARTGA ZID', 'ПРОТИВОРЕЧИТ УСЛОВИЮ', 'CONTRADICTS THE CONDITION'),
  title: L(
    "Matematik to'g'ri, lekin masalaga mos emas",
    'Математически верно, но не подходит задаче',
    'Mathematically correct, but does not fit the problem',
  ),
  audio: [
    A('mount',
      "S nol bo'lsa, N uch karra nol, ya'ni nol bo'ladi.",
      'Если s равен нулю, N равно трижды нулю, то есть нулю.',
      'If s equals zero, N equals three times zero, that is zero.'),
    A('why',
      "Masala ikki xonali sonni so'ragan edi. Nol ikki xonali sonmi?",
      'Задача спрашивала про двузначное число. Ноль это двузначное число?',
      'The problem asked for a two-digit number. Is zero a two-digit number?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('s = 0,  N = 3s', 's = 0,  N = 3s', 's = 0,  N = 3s')}
      steps={[
        { id: 'calc', head: 'N', lines: ['N = 3 · 0 = 0'] },
      ]}
      ask={L(
        "S nol nomzodi masala shartiga mos keladimi?",
        'Кандидат s равный нулю подходит условию задачи?',
        'Does the candidate s equal zero fit the condition of the problem?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Yo'q, rad etiladi", 'Нет, отбрасывается', 'No, it is rejected') },
        {
          id: 'wrong',
          label: L("Ha, mos keladi", 'Да, подходит', 'Yes, it fits'),
          hint: L(
            "N nolga teng chiqdi, nol esa ikki xonali son emas: masala aynan ikki xonali sonni so'ragan edi.",
            'N получился равным нулю, а ноль не двузначное число: задача спрашивала именно про двузначное число.',
            'N came out equal to zero, and zero is not a two-digit number: the problem asked specifically for a two-digit number.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Matematik jihatdan s nol ham tenglamani qanoatlantiradi, lekin masala shartiga zid, shuning uchun rad etiladi.",
        'Верно. Математически s равный нулю тоже удовлетворяет уравнению, но противоречит условию задачи, поэтому отбрасывается.',
        'Correct. Mathematically s equal to zero also satisfies the equation, but it contradicts the problem, so it is rejected.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — YAKUNIY JAVOBNI MASALA TILIGA QAYTARISH.
// ============================================================
const S6 = {
  eyebrow: L('JAVOB', 'ОТВЕТ', 'THE ANSWER'),
  title: L(
    "Topilgan sonni masala savoliga qaytaramiz",
    'Возвращаем найденное число к вопросу задачи',
    'We return the found number to the question of the problem',
  ),
  audio: [
    A('mount',
      "S to'qqizga teng qoldi. N teng uch karra to'qqiz, ya'ni yigirma yetti.",
      's равен девяти. N равно трижды девять, то есть двадцать семь.',
      's equals nine. N equals three times nine, that is twenty-seven.'),
    A('why',
      "Tekshiring: yigirma yettining raqamlari yig'indisi to'qqizmi? Yig'indining kvadrati yigirma yettidan uch marta kattami?",
      'Проверь: сумма цифр двадцати семи равна девяти? Квадрат суммы в три раза больше двадцати семи?',
      'Check: is the digit sum of twenty-seven equal to nine? Is the square of the sum three times twenty-seven?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('s = 9,  N = 3s', 's = 9,  N = 3s', 's = 9,  N = 3s')}
      steps={[
        { id: 'n', head: 'N', lines: ['N = 3 · 9 = 27'] },
        { id: 'check', head: '2 + 7', lines: ['2 + 7 = 9', '9² = 81 = 3 · 27'] },
      ]}
      ask={L(
        "Masalaning yakuniy javobi qanday yoziladi?",
        'Как записать окончательный ответ задачи?',
        'How is the final answer of the problem written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Qidirilgan son: yigirma yetti', 'Искомое число: двадцать семь', 'The sought number: twenty-seven') },
        {
          id: 'wrong',
          label: L("Qidirilgan son: to'qqiz", 'Искомое число: девять', 'The sought number: nine'),
          hint: L(
            "To'qqiz bu s, ya'ni raqamlar yig'indisi, masala esa sonning o'zini so'ragan: bu N, ya'ni yigirma yetti.",
            'Девять это s, то есть сумма цифр, а задача спрашивала про само число: это N, то есть двадцать семь.',
            'Nine is s, the digit sum, but the problem asked for the number itself: that is N, twenty-seven.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Javob: yigirma yetti. Tekshiruv ham to'g'ri chiqdi: ikkalasi ham shartga mos.",
        'Верно. Ответ: двадцать семь. Проверка тоже сошлась: оба условия выполняются.',
        'Correct. The answer: twenty-seven. The check also worked out: both conditions hold.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — IKKINCHI MASALA: YIG'INDI VA KO'PAYTMA
// (Dars09 BILAN BOG'LANISH).
// ============================================================
const S7 = {
  eyebrow: L('IKKINCHI MASALA', 'ВТОРАЯ ЗАДАЧА', 'A SECOND PROBLEM'),
  title: L(
    "Ikkita son: yig'indi va ko'paytma berilgan",
    'Два числа: даны сумма и произведение',
    'Two numbers: the sum and product are given',
  ),
  audio: [
    A('mount',
      "Yangi masala: ikkita musbat sonning yig'indisi o'n besh, ko'paytmasi qirq to'rt. Sonlarni toping.",
      'Новая задача: сумма двух положительных чисел пятнадцать, произведение сорок четыре. Найди числа.',
      'A new problem: the sum of two positive numbers is fifteen, the product is forty-four. Find the numbers.'),
    A('why',
      "Bu 9-darsdagi holatning o'zi: yig'indi va ko'paytma berilgan, demak Viyet teoremasi teskarisi ishlatiladi.",
      'Это тот же случай, что и на 9 уроке: даны сумма и произведение, значит используется теорема, обратная теореме Виета.',
      'This is the same case as in lesson 9: the sum and product are given, so the converse of Vieta\'s theorem is used.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y = 15,  xy = 44', 'x + y = 15,  xy = 44', 'x + y = 15,  xy = 44')}
      steps={[
        { id: 'eq', head: 'z²', lines: ['z² − 15z + 44 = 0'] },
        { id: 'roots', head: 'z', lines: ['z1 = 11,  z2 = 4'] },
      ]}
      ask={L(
        "Bu masalada qaysi darsdagi texnika ishlatildi?",
        'Какая техника с какого урока была использована в этой задаче?',
        'Which technique from which lesson was used in this problem?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("9-darsdagi Viyet teoremasi teskarisi", 'Теорема, обратная теореме Виета, с 9 урока', "The converse of Vieta's theorem, from lesson 9") },
        {
          id: 'wrong',
          label: L("11-darsdagi o'rniga qo'yish", 'Подстановка с 11 урока', 'Substitution from lesson 11'),
          hint: L(
            "Bu yerda maxsus ifodalash-qo'yish qadamlari yo'q: yig'indi va ko'paytma to'g'ridan-to'g'ri berilgan, bu aynan 9-darsdagi holat.",
            'Здесь нет отдельных шагов выражения и подстановки: сумма и произведение даны напрямую, это точно случай с 9 урока.',
            'There are no separate expressing-and-substituting steps here: the sum and product are given directly, this is exactly the case from lesson 9.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sonlar to'rt va o'n bir: to'rt qo'shi o'n bir o'n besh, to'rt karra o'n bir qirq to'rt.",
        'Верно. Числа четыре и одиннадцать: четыре плюс одиннадцать пятнадцать, четыре на одиннадцать сорок четыре.',
        'Correct. The numbers are four and eleven: four plus eleven is fifteen, four times eleven is forty-four.',
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
    "Algebra 9, II bobga mashqlar, 205-masala (86-bet)",
    'Алгебра 9, упражнения к главе II, задача 205 (стр. 86)',
    'Algebra 9, exercises to chapter II, problem 205 (p. 86)',
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
          "Sistema yechilgach, nomzodlar bilan yana nima qilish kerak?",
          'После решения системы, что ещё нужно сделать с кандидатами?',
          'After solving the system, what else must be done with the candidates?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Har birini masala shartiga solishtirish va mos javobni yozish", 'Сравнить каждого с условием задачи и записать подходящий ответ', 'Compare each with the problem and write the fitting answer'),
          },
          {
            id: 'wrong',
            label: L("Barchasini darrov javob deb yozish", 'Сразу записать всех как ответ', 'Write all of them as the answer right away'),
            hint: L(
              "5-ekranni eslang: s nol matematik jihatdan tenglamani qanoatlantirgan bo'lsa-da, masala shartiga zid bo'lgani uchun rad etilgan edi.",
              'Вспомни 5 экран: s равный нулю математически удовлетворял уравнению, но был отброшен из-за противоречия условию задачи.',
              'Recall screen 5: s equal to zero mathematically satisfied the equation, but was rejected for contradicting the problem.',
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
    "Sistema orqali masala yechish qoidasi",
    'Правило решения задачи через систему',
    'The rule for solving a problem through a system',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz noma'lumlarni belgilashni, sistema tuzishni va shartga zid yechimni rad etishni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам обозначал неизвестные, составлял систему и отбрасывал решение, противоречащее условию. Теперь они в виде правила.',
      'On six screens you denoted unknowns, built a system, and rejected a solution contradicting the condition with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — YO'NALTIRILGAN: 205(2)-masala, uch qadam.
// ============================================================
const S9 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "Yana bir ikki xonali son: uch qadam",
    'Ещё одно двузначное число: три шага',
    'Another two-digit number: three steps',
  ),
  audio: [
    A('mount',
      "Yangi masala: ikki xonali son raqamlari yig'indisidan to'rt marta katta, yig'indining kvadrati esa sonning uch ikkidan qismiga teng. Uch qadam, yordam yo'q.",
      'Новая задача: двузначное число в четыре раза больше суммы своих цифр, а квадрат суммы равен трём вторым частям числа. Три шага, помощи нет.',
      'A new problem: a two-digit number is four times its digit sum, and the square of the sum equals three halves of the number. Three steps, no help.'),
    A('why',
      "Xuddi shu tuzilish: N va s orqali sistema tuzing, so'ng o'rniga qo'ying.",
      'Та же структура: составь систему через N и s, потом подставь.',
      'The same structure: build the system through N and s, then substitute.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: sistema tuzildi, s topildi, N topildi.",
      'Все три шага пройдены: система составлена, s найден, N найден.',
      'All three steps are done: the system built, s found, N found.',
    ),
    tasks: [
      {
        expr: 'N ~ s,  s² ~ N',
        question: L(
          "N son to'rt marta katta, s kvadrat esa N ning uch ikkidan qismiga teng. Qaysi sistema tuziladi?",
          'N в четыре раза больше, а s в квадрате равно трём вторым от N. Какая система составляется?',
          'N is four times greater, and s squared equals three halves of N. Which system is built?',
        ),
        ok: L("Ha. N teng to'rt s, s kvadrat teng uch ikkidan N.", 'Да. N равно четыре s, s в квадрате равно три вторых от N.', 'Yes. N equals four s, s squared equals three halves of N.'),
        items: [
          { id: 'a', right: true, label: 'N = 4s,  s² = 1,5N' },
          { id: 'b', label: 'N = s + 4,  s² = 1,5N', hint: L("\"To'rt marta katta\" ko'paytirishni bildiradi: N to'rt s ga teng, s qo'shi to'rt emas.", 'Слова в четыре раза больше означают умножение: N равно четыре s, а не s плюс четыре.', '"Four times greater" means multiplication: N equals four s, not s plus four.') },
        ],
        solution: ['N = 4s', 's² = 1,5N'],
      },
      {
        expr: 's² = 1,5(4s)',
        question: L('Soddalashtirilgach qaysi tenglama qoladi?', 'Какое уравнение остаётся после упрощения?', 'Which equation remains after simplifying?'),
        ok: L("Ha. Bir butun besh o'ndan karra to'rt olti beradi, s kvadrat olti s teng.", 'Да. Один целых пять десятых на четыре даёт шесть, s в квадрате равно шести s.', 'Yes. One point five times four gives six, s squared equals six s.'),
        items: [
          { id: 'a', right: true, label: 's² = 6s' },
          { id: 'b', label: 's² = 4s', hint: L("Bir butun besh o'ndanni to'rtga ko'paytiring: olti chiqadi, to'rt emas.", 'Умножь один целых пять десятых на четыре: получится шесть, а не четыре.', 'Multiply one point five by four: you get six, not four.') },
        ],
        solution: ['s² = 1,5 · 4s', 's² = 6s'],
      },
      {
        expr: 's² − 6s = 0',
        question: L(
          "N ikki xonali son bo'lishi kerak. S ning qaysi qiymati masalaga mos keladi?",
          'N должно быть двузначным числом. Какое значение s подходит задаче?',
          'N must be a two-digit number. Which value of s fits the problem?',
        ),
        ok: L("Ha. S nol N ni nolga aylantiradi, bu ikki xonali son emas, shuning uchun s olti tanlanadi.", 'Да. s равный нулю превращает N в ноль, а это не двузначное число, поэтому выбирается s равный шести.', 'Yes. s equal to zero turns N into zero, which is not a two-digit number, so s equal to six is chosen.'),
        items: [
          { id: 'a', right: true, label: 's = 6' },
          { id: 'b', label: 's = 0', hint: L("S nol bo'lsa N ham nolga teng bo'ladi, nol esa ikki xonali son emas.", 'Если s равен нулю, N тоже будет равен нулю, а ноль не двузначное число.', 'If s equals zero, N also equals zero, and zero is not a two-digit number.') },
        ],
        solution: ['s(s − 6) = 0', L('s = 0 rad etiladi', 's = 0 отбрасывается', 's = 0 is rejected'), 's = 6, N = 24'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: so'zdan tenglamaga, to'rtta.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tez tarjima: so'zdan tenglamaga",
    'Быстрый перевод: от слов к уравнению',
    'Quick translation: from words to an equation',
  ),
  audio: [
    A('mount',
      "To'rtta gap ketma-ket. Har birini tenglamaga aylantiring.",
      'Четыре фразы подряд. Каждую преврати в уравнение.',
      'Four phrases in a row. Turn each into an equation.'),
    A('why',
      "\"Marta katta\" ko'paytirishni, \"birlik katta\" qo'shishni bildiradi.",
      'Слова в несколько раз больше означают умножение, слова на столько-то больше означают сложение.',
      '"Times greater" means multiplication, "more by" means addition.'),
  ],
  props: {
    stepLabel: L('Gap', 'Фраза', 'Phrase'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham tarjima qilindi. \"Marta katta\" ko'paytirish, \"birlik katta\" qo'shish beradi.",
      'Все четыре переведены. Слова в несколько раз больше дают умножение, слова на столько-то больше дают сложение.',
      'All four are translated. "Times greater" gives multiplication, "more by" gives addition.',
    ),
    tasks: [
      {
        expr: 'a ~ b',
        question: L(
          "A soni b sonidan besh marta katta. Qaysi tenglama mos keladi?",
          'Число a в пять раз больше числа b. Какое уравнение подходит?',
          'Number a is five times greater than number b. Which equation fits?',
        ),
        ok: L("Ha. Besh marta katta ko'paytirishni bildiradi, a besh b ga teng.", 'Да. В пять раз больше это умножение, a равно пяти b.', 'Yes. Five times greater is multiplication, a equals five b.'),
        items: [
          { id: 'a', right: true, label: 'a = 5b' },
          { id: 'b', label: 'a = b + 5', hint: L("Marta katta ko'paytirishni bildiradi, birlikka katta emas: qo'shish emas, ko'paytirish kerak.", 'В несколько раз больше означает умножение, а не больше на: нужно не сложение, а умножение.', '"Times greater" means multiplication, not "greater by": multiplication is needed, not addition.') },
        ],
        solution: [L("Besh marta katta = ko'paytirish", 'В пять раз больше = умножение', 'Five times greater = multiplication'), 'a = 5b'],
      },
      {
        expr: 'x ~ y',
        question: L(
          "X soni y sonidan yetti birlik katta. Qaysi tenglama mos keladi?",
          'Число x на семь больше числа y. Какое уравнение подходит?',
          'Number x is seven more than number y. Which equation fits?',
        ),
        ok: L("Ha. Birlik katta qo'shishni bildiradi, x y qo'shi yetti ga teng.", 'Да. На столько-то больше это сложение, x равно y плюс семь.', 'Yes. "More by" is addition, x equals y plus seven.'),
        items: [
          { id: 'a', right: true, label: 'x = y + 7' },
          { id: 'b', label: 'x = 7y', hint: L("Birlikka katta qo'shishni bildiradi, marta katta emas: ko'paytirish emas, qo'shish kerak.", 'На столько-то больше означает сложение, а не в несколько раз больше: нужно не умножение, а сложение.', '"More by" means addition, not "times greater": addition is needed, not multiplication.') },
        ],
        solution: [L("Yetti birlik katta = qo'shish", 'На семь больше = сложение', 'Seven more = addition'), 'x = y + 7'],
      },
      {
        expr: 'x + y = 20',
        question: L(
          "Ikki sonning yig'indisi yigirma, biri ikkinchisidan olti birlik katta. Ikkinchi shart qaysi tenglamaga aylanadi?",
          'Сумма двух чисел двадцать, одно на шесть больше другого. Во что превращается второе условие?',
          'The sum of two numbers is twenty, one is six more than the other. What does the second condition become?',
        ),
        ok: L("Ha. Olti katta so'zi qo'shishni beradi.", 'Да. На шесть больше даёт сложение.', 'Yes. "Six more" gives addition.'),
        items: [
          { id: 'a', right: true, label: 'x = y + 6' },
          { id: 'b', label: 'x = 6y', hint: L("Olti birlik katta so'zi qo'shishni bildiradi, ko'paytirishni emas.", 'Слова на шесть больше означают сложение, а не умножение.', 'The words "six more" mean addition, not multiplication.') },
        ],
        solution: ['x + y = 20', 'x = y + 6'],
      },
      {
        expr: 'x, y',
        question: L(
          "Ikkita sonning ko'paytmasi o'ttiz olti. Bu shart qaysi tenglamaga aylanadi?",
          'Произведение двух чисел тридцать шесть. Во что превращается это условие?',
          'The product of two numbers is thirty-six. What does this condition become?',
        ),
        ok: L("Ha. Ko'paytma so'zi karra amalini bildiradi.", 'Да. Слово произведение означает умножение.', 'Yes. The word "product" means multiplication.'),
        items: [
          { id: 'a', right: true, label: 'xy = 36' },
          { id: 'b', label: 'x + y = 36', hint: L("Ko'paytma so'zi qo'shishni emas, ko'paytirishni bildiradi.", 'Слово произведение означает не сложение, а умножение.', 'The word "product" means not addition, but multiplication.') },
        ],
        solution: [L("Ko'paytma = ko'paytirish", 'Произведение = умножение', 'Product = multiplication'), 'xy = 36'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: sistema yechish va tekshirish.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: sistemani yakunlash",
    'Только счёт: завершаем систему',
    'Just computation: finishing the system',
  ),
  audio: [
    A('mount',
      "Har savolda sistema deyarli yechilgan, oxirgi qadamni siz bajarasiz.",
      'В каждом вопросе система почти решена, последний шаг делаешь ты.',
      'In each question the system is almost solved, you do the final step.'),
    A('why',
      "Shartga zid nomzodni rad etishni unutmang.",
      'Не забудь отбросить кандидата, противоречащего условию.',
      'Do not forget to reject a candidate contradicting the condition.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hal bo'ldi: sistemadan topilgan nomzodlar masala shartiga solishtirildi.",
      'Все три решены: кандидаты, найденные из системы, сравнены с условием задачи.',
      'All three are solved: the candidates found from the system are compared with the problem.',
    ),
    tasks: [
      {
        expr: 'x + y = 10,  xy = 21',
        question: L('Sonlar qanday?', 'Каковы числа?', 'What are the numbers?'),
        ok: L("Ha. Uch va yetti: uch qo'shi yetti o'n, uch karra yetti yigirma bir.", 'Да. Три и семь: три плюс семь десять, три на семь двадцать один.', 'Yes. Three and seven: three plus seven is ten, three times seven is twenty-one.'),
        items: [
          { id: 'a', right: true, label: '3  ·  7' },
          { id: 'b', label: '5  ·  5', hint: L("Beshni beshga ko'paytiring: yigirma besh chiqadi, yigirma bir emas.", 'Умножь пять на пять: получится двадцать пять, а не двадцать один.', 'Multiply five by five: you get twenty-five, not twenty-one.') },
        ],
        solution: ['z² − 10z + 21 = 0', 'z1 = 3, z2 = 7'],
      },
      {
        expr: 'x < 0',
        question: L(
          "Masalada bu son uzunlik bo'lishi kerak, ammo nomzod manfiy chiqdi. Bu nomzod javobga kiradimi?",
          'В задаче это число должно быть длиной, но кандидат получился отрицательным. Этот кандидат входит в ответ?',
          'In the problem this number must be a length, but the candidate came out negative. Does this candidate belong to the answer?',
        ),
        ok: L("Yo'q. Uzunlik manfiy bo'la olmaydi, bu nomzod masala shartiga zid.", 'Нет. Длина не может быть отрицательной, этот кандидат противоречит условию.', 'No. A length cannot be negative, this candidate contradicts the problem.'),
        items: [
          { id: 'a', label: L('Ha, kiradi', 'Да, входит', 'Yes, it does') },
          { id: 'b', right: true, label: L("Yo'q, rad etiladi", 'Нет, отбрасывается', 'No, it is rejected') },
        ],
        solution: [
          L("Uzunlik manfiy bo'lishi mumkin emas", 'Длина не может быть отрицательной', 'A length cannot be negative'),
          L('Nomzod rad etiladi', 'Кандидат отбрасывается', 'The candidate is rejected'),
        ],
      },
      {
        expr: 'N = 4s,  s = 5',
        question: L('N nechiga teng?', 'Чему равен N?', 'What does N equal?'),
        ok: L("Ha. To'rt karra besh yigirma.", 'Да. Четыре на пять двадцать.', 'Yes. Four times five is twenty.'),
        items: [
          { id: 'a', right: true, label: '20' },
          { id: 'b', label: '9', hint: L("To'rtni beshga ko'paytiring, qo'shmang.", 'Умножь четыре на пять, а не складывай.', 'Multiply four by five, do not add.') },
        ],
        solution: ['N = 4 · 5 = 20'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Nodira javobni s bilan yozib, N ni unutgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Javob noto'g'ri harf bilan yozilgan",
    'Ответ записан не той буквой',
    'The answer written with the wrong letter',
  ),
  audio: [
    A('mount',
      "Nodiraning yechimi. U 205(1)-masalani to'g'ri yechib, s to'qqizga teng ekanini topdi va \"javob: to'qqiz\" deb yozdi.",
      'Решение Нодиры. Она верно решила задачу 205(1), нашла, что s равен девяти, и записала ответом просто девять.',
      "Nodira's solution. She correctly solved problem 205(1), found that s equals nine, and wrote \"answer: nine\"."),
    A('why',
      "Masala nimani so'ragan edi: raqamlar yig'indisinimi yoki sonning o'zinimi?",
      'Что спрашивала задача: сумму цифр или само число?',
      'What did the problem ask for: the digit sum or the number itself?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Nodiraning hisobi to'g'ri edi, lekin u s ni N bilan almashtirib qo'ydi: masala sonning o'zini so'ragan, raqamlar yig'indisini emas.",
      'Счёт Нодиры был верным, но она перепутала s с N: задача спрашивала про само число, а не про сумму цифр.',
      "Nodira's computation was correct, but she confused s with N: the problem asked for the number itself, not the digit sum.",
    ),
    tasks: [
      {
        expr: 's = 9',
        question: L(
          "Nodira javob sifatida to'qqizni yozdi. Masala nimani so'ragan edi: raqamlar yig'indisinimi yoki ikki xonali sonning o'zinimi?",
          'Нодира записала ответом девять. Что спрашивала задача: сумму цифр или само двузначное число?',
          'Nodira wrote nine as the answer. What did the problem ask for: the digit sum or the two-digit number itself?',
        ),
        ok: L(
          "Ikki xonali sonning o'zini. S bu faqat oraliq natija, yakuniy javob N, ya'ni yigirma yetti.",
          'Само двузначное число. s это лишь промежуточный результат, окончательный ответ N, то есть двадцать семь.',
          'The two-digit number itself. s is only an intermediate result, the final answer is N, that is twenty-seven.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Sonning o'zini, javob yigirma yetti bolishi kerak edi", 'Само число, ответом должно было быть двадцать семь', 'The number itself, the answer should have been twenty-seven'),
          },
          {
            id: 'b',
            label: L("Raqamlar yig'indisini, Nodira to'g'ri", 'Сумму цифр, Нодира права', 'The digit sum, Nodira is right'),
            hint: L("Masala matnini qayta o'qing: ikki xonali son, shu sonni toping deyilgan, raqamlar yig'indisi emas.", 'Перечитай текст задачи: сказано про двузначное число, найдите это число, а не сумму цифр.', 'Re-read the problem text: it says a two-digit number, find this number, not the digit sum.'),
          },
        ],
        solution: [
          L('s = 9 faqat yordamchi natija', 's = 9 это только промежуточный результат', 's = 9 is only an intermediate result'),
          'N = 3 · 9 = 27',
          L("To'g'ri javob: yigirma yetti", 'Верный ответ: двадцать семь', 'Correct answer: twenty-seven'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — javobdan masalaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Javobdan masala shartiga",
    'От ответа к условию задачи',
    'From the answer to the problem',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: ikkita son berilgan, qaysi shart shu sonlarni berishini siz tanlaysiz.",
      'На этот раз наоборот: даны два числа, а какое условие их даёт, выбираешь ты.',
      'This time it is the other way round: two numbers are given, you choose which condition gives them.'),
    A('why',
      "Har bir nomzodda yig'indi va ko'paytmani hisoblab, berilgan shartga solishtiring.",
      'В каждом кандидате посчитай сумму и произведение, сравни с данным условием.',
      'In each candidate, compute the sum and product, compare with the given condition.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: sonlardan orqaga qaytib, mos shartni tanlash ham xuddi shu hisobga tayanadi.",
      'Найдено: путь от чисел назад к условию опирается на тот же самый счёт.',
      'Found: going backward from the numbers to the condition relies on the same computation.',
    ),
    tasks: [
      {
        expr: '6, 3',
        question: L(
          "Olti va uch qaysi shartga mos keladi?",
          'Какому условию соответствуют шесть и три?',
          'Which condition do six and three fit?',
        ),
        ok: L("Ha. Olti qo'shi uch to'qqiz, olti karra uch o'n sakkiz.", 'Да. Шесть плюс три девять, шесть на три восемнадцать.', 'Yes. Six plus three is nine, six times three is eighteen.'),
        items: [
          { id: 'a', right: true, label: L("Yig'indisi to'qqiz, ko'paytmasi o'n sakkiz", 'Сумма девять, произведение восемнадцать', 'Sum nine, product eighteen') },
          { id: 'b', label: L("Yig'indisi to'qqiz, ko'paytmasi o'n olti", 'Сумма девять, произведение шестнадцать', 'Sum nine, product sixteen'), hint: L("Ko'paytmani qayta hisoblang: olti karra uch o'n sakkiz beradi, o'n olti emas.", 'Пересчитай произведение: шесть на три даёт восемнадцать, а не шестнадцать.', 'Recompute the product: six times three gives eighteen, not sixteen.') },
        ],
        solution: ['6 + 3 = 9', '6 · 3 = 18'],
      },
      {
        expr: 'N = 24',
        question: L(
          "Yigirma to'rt qaysi shartga mos keladi: to'rt marta kattami yoki uch marta kattami?",
          'Двадцать четыре соответствует какому условию: в четыре раза больше или в три раза больше?',
          'Does twenty-four fit which condition: four times greater or three times greater?',
        ),
        ok: L("Ha. Yigirma to'rtning raqamlari yig'indisi olti, yigirma to'rt esa oltidan to'rt marta katta.", 'Да. Сумма цифр двадцати четырёх шесть, а двадцать четыре в четыре раза больше шести.', 'Yes. The digit sum of twenty-four is six, and twenty-four is four times six.'),
        items: [
          { id: 'a', right: true, label: L("To'rt marta katta (6-dars misoli)", 'В четыре раза больше (пример из 9 экрана)', 'Four times greater (the screen 9 example)') },
          { id: 'b', label: L("Uch marta katta (asosiy misol)", 'В три раза больше (основной пример)', 'Three times greater (the main example)'), hint: L("Raqamlar yig'indisini uchga ko'paytiring: yigirma yetti chiqadi, yigirma to'rt emas.", 'Умножь сумму цифр на три: получится двадцать семь, а не двадцать четыре.', 'Multiply the digit sum by three: you get twenty-seven, not twenty-four.') },
        ],
        solution: ['2 + 4 = 6', '24 = 4 · 6'],
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
    "Blits: belgilash, tarjima, rad etish, javob",
    'Блиц: обозначение, перевод, отбрасывание, ответ',
    'Blitz: denoting, translating, rejecting, answering',
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
        tag: 'ozgaruvchi-notogri-tanlash',
        ask: L(
          "Sistema tuzishdan oldin birinchi ish nima?",
          'Что делают в первую очередь перед составлением системы?',
          'What is done first before building a system?',
        ),
        options: [
          { id: 'right', right: true, label: L("Har bir noma'lum nimani anglatishini aniq belgilash", 'Чётко определить, что означает каждое неизвестное', 'Clearly define what each unknown means') },
          { id: 'wrong', label: L("Darrov tenglama yozishga o'tish", 'Сразу приступить к записи уравнения', 'Go straight to writing the equation') },
        ],
        ok: L(
          "To'g'ri. Noma'lum aniq belgilanmasa, tenglama tuzishning o'zi qiyinlashadi.",
          'Верно. Без чёткого обозначения неизвестного само составление уравнения затрудняется.',
          'Correct. Without a clear definition of the unknown, building the equation itself becomes hard.',
        ),
        hint: L(
          "3-ekranni eslang: N va s aniq belgilangandan keyingina sistema tuzish oson bo'ldi.",
          'Вспомни 3 экран: составить систему стало легко только после чёткого обозначения N и s.',
          'Recall screen 3: building the system became easy only after clearly denoting N and s.',
        ),
      },
      {
        id: 'q2',
        tag: 'shartni-notogri-tenglamaga-otkazish',
        ask: L(
          "\"A soni b sonidan olti marta katta\" degan gap qanday tenglamaga aylanadi?",
          'Фраза о том, что число a в шесть раз больше числа b, превращается в какое уравнение?',
          'The phrase "number a is six times greater than number b" turns into which equation?',
        ),
        options: [
          { id: 'right', right: true, label: 'a = 6b' },
          { id: 'wrong', label: 'a = b + 6' },
        ],
        ok: L(
          "To'g'ri. \"Marta katta\" ko'paytirishni bildiradi.",
          'Верно. В несколько раз больше означает умножение.',
          'Correct. "Times greater" means multiplication.',
        ),
        hint: L(
          "10-ekranni eslang: \"marta katta\" ko'paytirish, \"birlik katta\" qo'shish beradi.",
          'Вспомни 10 экран: в несколько раз больше даёт умножение, на столько-то больше даёт сложение.',
          'Recall screen 10: "times greater" gives multiplication, "more by" gives addition.',
        ),
      },
      {
        id: 'q3',
        tag: 'nomuvofiq-yechimni-qabul-qilish',
        ask: L(
          "Sistemadan topilgan nomzod matematik jihatdan to'g'ri, lekin masala shartiga zid bo'lsa, u qabul qilinadimi?",
          'Если найденный из системы кандидат математически верен, но противоречит условию задачи, он принимается?',
          'If a candidate found from the system is mathematically correct but contradicts the problem, is it accepted?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Har bir nomzod masala shartiga solishtiriladi, mos kelmasa rad etiladi.",
          'Верно. Каждый кандидат сравнивается с условием задачи, если не подходит, отбрасывается.',
          'Correct. Every candidate is compared with the problem, if it does not fit, it is rejected.',
        ),
        hint: L(
          "5-ekranni eslang: s nol matematik jihatdan to'g'ri edi, lekin ikki xonali son shartiga zid bo'lgani uchun rad etilgan edi.",
          'Вспомни 5 экран: s равный нулю был математически верен, но отброшен из-за противоречия условию двузначного числа.',
          'Recall screen 5: s equal to zero was mathematically correct, but rejected for contradicting the two-digit number condition.',
        ),
      },
      {
        id: 'q4',
        tag: 'javobni-masala-tiliga-qaytarmaslik',
        ask: L(
          "Sistema yechilgach, yakuniy javobni yozishdan oldin nima qilish kerak?",
          'После решения системы, что нужно сделать перед записью окончательного ответа?',
          'After solving the system, what must be done before writing the final answer?',
        ),
        options: [
          { id: 'right', right: true, label: L("Masala aynan nimani so'raganini qayta o'qish", 'Перечитать, что именно спрашивала задача', 'Re-read what exactly the problem asked') },
          { id: 'wrong', label: L("Birinchi topilgan sonni javob deb yozish", 'Записать первое найденное число как ответ', 'Write the first found number as the answer') },
        ],
        ok: L(
          "To'g'ri. Ba'zan yordamchi o'zgaruvchi (masalan, s) topiladi, lekin masala boshqa narsani, N ni so'raydi.",
          'Верно. Иногда находится вспомогательная переменная (например, s), а задача спрашивает про другое, про N.',
          'Correct. Sometimes an auxiliary variable (like s) is found, but the problem asks about something else, N.',
        ),
        hint: L(
          "12-ekrandagi Nodiraning xatosini eslang: u s ni javob deb yozgan edi, N o'rniga.",
          'Вспомни ошибку Нодиры на 12 экране: она записала s как ответ, вместо N.',
          "Recall Nodira's mistake on screen 12: she wrote s as the answer, instead of N.",
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN. BLOK 2 YAKUNLANADI.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Masala, sistema, javob: blok yakunlandi",
    'Задача, система, ответ: блок завершён',
    'Problem, system, answer: the block is complete',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda bunday masalani tenglama orqali yechish qulayligini taxmin qildingiz. Bugun aynan shu yo'lni to'liq egalladingiz.",
      'На первом экране ты предположил, что такую задачу удобно решать через уравнения. Сегодня ты полностью освоил именно этот путь.',
      'On the first screen you guessed that such a problem is convenient to solve through equations. Today you fully mastered exactly this path.'),
    A('s1',
      "Siz noma'lumlarni belgilashni, so'zdan tenglama tuzishni va shartga zid yechimni rad etib, javobni masala tiliga qaytarishni o'rgandingiz.",
      'Ты освоил обозначение неизвестных, составление уравнения из текста, отбрасывание решения, противоречащего условию, и возврат ответа к языку задачи.',
      'You learned denoting unknowns, building an equation from text, rejecting a solution that contradicts the condition, and returning the answer to the language of the problem.'),
    A('s2',
      "Bu bilan tenglamalar va sistemalar bloki yakunlandi. Keyingi darsda yangi blok: tengsizliklar, ikkinchi darajali tengsizlikdan boshlanadi.",
      'На этом блок уравнений и систем завершён. В следующем уроке новый блок: неравенства, начиная с неравенства второй степени.',
      'This completes the block on equations and systems. The next lesson begins a new block: inequalities, starting with the second-degree inequality.'),
  ],
  props: {
    mark: 'N = 27',
    markNote: L(
      "bugungi masalaning javobi",
      'ответ сегодняшней задачи',
      "today's answer",
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: ikkinchi darajali tengsizliklar',
      'Следующий урок: неравенства второй степени',
      'Next lesson: second-degree inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'ozgaruvchi-notogri-tanlash', ...S2 },
  { role: 'explain',  tag: 'shartni-notogri-tenglamaga-otkazish', ...S3 },
  { role: 'explain',  tag: 'shartni-notogri-tenglamaga-otkazish', ...S4 },
  { role: 'explain',  tag: 'nomuvofiq-yechimni-qabul-qilish', ...S5 },
  { role: 'explain',  tag: 'javobni-masala-tiliga-qaytarmaslik', ...S6 },
  { role: 'explain',  tag: 'shartni-notogri-tenglamaga-otkazish', ...S7 },
  { role: 'rule',     tag: 'nomuvofiq-yechimni-qabul-qilish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'nomuvofiq-yechimni-qabul-qilish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'shartni-notogri-tenglamaga-otkazish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nomuvofiq-yechimni-qabul-qilish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'javobni-masala-tiliga-qaytarmaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'shartni-notogri-tenglamaga-otkazish', ...S13 },
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
