// ============================================================================
// 9-sinf, Dars 25. GEOMETRIK PROGRESSIYA DASTLABKI n TA HADINING YIG'INDISI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 32-§ (167-169-bet).
//   1-masala (167-bet): S = 1 + 3 + 3² + 3³ + 3⁴ + 3⁵. Tenglikning
//       ikkala qismi 3 ga KO'PAYTIRILADI, so'ng ayiriladi:
//       3S − S = 3⁶ − 1, 2S = 728, S = 364. Darsning butun g'oyasi shu.
//   Teorema (167-168-bet): q ≠ 1 bo'lganda S_n = b_1(1 − qⁿ)/(1 − q).
//       Chiqarilishi 1-masaladagi qadamning aynan o'zi, faqat sonlar
//       o'rniga harflar.
//   q = 1 HOLI (168-bet): S_n = b_1·n. Formulaning maxraji nolga
//       aylanadi, shuning uchun bu hol ALOHIDA yoziladi.
//   2-masala (168-bet): 6, 2, 2/3 uchun S_5 = 242/27.
//   3-masala (168-bet): q = 1/2, S_6 = 252 → b_1 = 128.
//   4-masala (169-bet): b_1 = −3, q = 2, S_n = −93 → n = 5.
//   5-masala (169-bet): oxirgi had ma'lum bo'lganda formula
//       S_n = (b_n·q − b_1)/(q − 1) ko'rinishiga keltiriladi;
//       5 + 15 + ... + 1215 = 1820.
//
// 23-DARS BILAN PARALLEL: u yerda ham yig'indi TO'G'RIDAN-TO'G'RI emas,
// AYLANMA yo'l bilan topilgan edi — yig'indi ikkinchi marta teskari
// tartibda yozilib, qo'shilgandi. Bu yerda aylanma yo'l boshqacha:
// yig'indi q ga ko'paytirilib, ayiriladi. Ikkala usulning ma'nosi bir:
// ikkita deyarli bir xil qatorni yonma-yon qo'yib, farqini olish.
// 2-ekran shu farqni ataylab so'raydi.
//
// TUZOQ (12-ekran) 24-DARSDAN O'SIB CHIQADI: had formulasida daraja
// n − 1, yig'indi formulasida esa n. Kamron 24-darsning darajasini
// yig'indiga olib kirgan. Uning javobi 26 — bu S_4 emas, aynan S_3,
// ya'ni xato bitta hadni tushirib qoldiradi. Shu tekshiruv ekranda
// ochiq ko'rsatiladi.
//
// ASBOB: `SeqTable` beshinchi marta — 23-darsdagidek QISMIY
// YIG'INDILARNI to'ldiradi. Yangi qo'l harakati yo'q, yangi asbob
// kerak emas.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SeqTable } from './asboblar.jsx'

export const META = {
  id: 'grade9-25',
  n: 25,
  row: 25,
  block: 'Б4',
  topic: L(
    "Geometrik progressiya yig'indisi",
    'Сумма геометрической прогрессии',
    'The sum of a geometric progression',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Yig'indini q ga ko'paytirib ayirsak, o'rtadagi hadlar qisqaradi va ikkitasi qoladi",
    'Если сумму умножить на q и вычесть, средние члены сократятся и останутся два',
    'Multiplying the sum by q and subtracting cancels the middle terms, two remain',
  ),
  L(
    "q birdan farqli bo'lsa: b_1 ni (1 − qⁿ) ga ko'paytirib, (1 − q) ga bo'lish",
    'При q, отличном от единицы: b_1 умножить на (1 − qⁿ) и разделить на (1 − q)',
    'When q differs from one: b_1 times (1 − qⁿ), divided by (1 − q)',
  ),
  L(
    "q birga teng bo'lsa maxraj nolga aylanadi, yig'indi esa b_1 ni n ga ko'paytirish",
    'При q равном единице знаменатель обращается в ноль, а сумма это b_1 умножить на n',
    'When q equals one the denominator becomes zero, and the sum is b_1 times n',
  ),
]

export const MISS = {
  'yigindida-daraja-n': {
    what: L(
      "yig'indi formulasiga had formulasining n minus bir darajasi olib kirildi",
      'в формулу суммы перенесена степень n минус один из формулы члена',
      'the n minus one power from the term formula was carried into the sum formula',
    ),
    wrong: null,
    at: 0,
  },
  'q-bir-bolsa': {
    what: L(
      "q birga teng bo'lgan hol unutildi, maxraj nolga aylanadi",
      'забыт случай q равного единице, знаменатель обращается в ноль',
      'the case q equals one was forgotten, the denominator turns into zero',
    ),
    wrong: null,
    at: 0,
  },
  'manfiy-q-ni-hisoblamaslik': {
    what: L(
      "q manfiy bo'lganda uning juft darajasi musbat bo'lishi hisobga olinmadi",
      'не учтено, что чётная степень отрицательного q положительна',
      'it was not taken into account that an even power of a negative q is positive',
    ),
    wrong: null,
    at: 0,
  },
  'oxirgi-had-orqali-hisoblash': {
    what: L(
      "oxirgi had ma'lum bo'lganda formulaning ikkinchi ko'rinishi ishlatilmadi",
      'при известном последнем члене не использована вторая форма формулы',
      'the second form of the formula was not used when the last term is known',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 1-masalasi: S va 3S yonma-yon.
// ============================================================
const S1 = {
  eyebrow: L('IKKITA QATOR YONMA-YON', 'ДВА РЯДА РЯДОМ', 'TWO ROWS SIDE BY SIDE'),
  title: L(
    "Bir xil hadlar, ikkitasidan tashqari",
    'Одинаковые члены, кроме двух',
    'Identical terms, all but two',
  ),
  audio: [
    A('mount',
      "Bir qo'shuv uch qo'shuv to'qqiz qo'shuv yigirma yetti qo'shuv sakson bir qo'shuv ikki yuz qirq uch. Bu yig'indini S deb belgilaymiz.",
      'Один плюс три плюс девять плюс двадцать семь плюс восемьдесят один плюс двести сорок три. Обозначим эту сумму через S.',
      'One plus three plus nine plus twenty seven plus eighty one plus two hundred forty three. Call this sum S.'),
    A('why',
      "Endi butun yig'indini uchga ko'paytiramiz va ostiga yozamiz. Ikkita qatorni diqqat bilan solishtiring.",
      'Теперь умножим всю сумму на три и запишем ниже. Внимательно сравни два ряда.',
      'Now multiply the whole sum by three and write it below. Compare the two rows carefully.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "S = 1 + 3 + 9 + 27 + 81 + 243 va 3S = 3 + 9 + 27 + 81 + 243 + 729. Bu ikki qator qanday farq qiladi?",
      'S = 1 + 3 + 9 + 27 + 81 + 243 и 3S = 3 + 9 + 27 + 81 + 243 + 729. Чем различаются эти два ряда?',
      'S = 1 + 3 + 9 + 27 + 81 + 243 and 3S = 3 + 9 + 27 + 81 + 243 + 729. How do these two rows differ?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Faqat ikkita had bilan: birida bir bor, ikkinchisida yetti yuz yigirma to'qqiz",
          'Только двумя членами: в одном есть единица, в другом семьсот двадцать девять',
          'By two terms only: one row has the one, the other has seven hundred twenty nine',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Barcha hadlari bilan, chunki har biri uch barobar katta",
          'Всеми членами, ведь каждый втрое больше',
          'By every term, since each is three times bigger',
        ),
        hint: L(
          "Qatorlarni yonma-yon o'qing. Uch, to'qqiz, yigirma yetti, sakson bir, ikki yuz qirq uch. Shu beshtasi ikkalasida ham bor.",
          'Прочти ряды рядом. Три, девять, двадцать семь, восемьдесят один, двести сорок три. Эти пять есть в обоих.',
          'Read the rows side by side. Three, nine, twenty seven, eighty one, two hundred forty three appear in both.',
        ),
      },
    ],
    after: L(
      "Ha. Beshta had ikkalasida bir xil. Demak ayirsak, ular qisqaradi. Bugungi dars shu bitta harakat ustiga quriladi.",
      'Да. Пять членов в обоих одинаковы. Значит при вычитании они сократятся. Весь сегодняшний урок стоит на этом одном действии.',
      'Yes. Five terms are the same in both. So subtracting cancels them. The whole lesson rests on this single move.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 23-dars bilan farq.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Teskari tartib bu yerda yordam bermaydi",
    'Обратный порядок здесь не помогает',
    'Reversing the order does not help here',
  ),
  audio: [
    A('mount',
      "23-darsda arifmetik progressiya yig'indisini topgandik. U yerda yig'indi ikkinchi marta teskari tartibda yozilardi va juftlar bir xil chiqardi.",
      'На 23 уроке мы нашли сумму арифметической прогрессии. Там сумму писали второй раз в обратном порядке, и пары получались одинаковыми.',
      'In lesson 23 we found the sum of an arithmetic progression. The sum was written a second time in reverse order, and the pairs came out equal.'),
    A('why',
      "Endi shu usulni geometrik progressiyaga qo'llab ko'ring: bir, uch, to'qqiz, yigirma yetti.",
      'Теперь попробуй применить тот же приём к геометрической прогрессии: один, три, девять, двадцать семь.',
      'Now try the same trick on a geometric progression: one, three, nine, twenty seven.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1, 3, 9, 27', '1, 3, 9, 27', '1, 3, 9, 27')}
      steps={[
        { id: 'p', head: L('Chekkadan juftlar', 'Пары с краёв', 'Pairs from the ends'), lines: ['1 + 27 = 28', '3 + 9 = 12'] },
      ]}
      ask={L(
        "Nega teskari tartib usuli bu yerda ishlamaydi?",
        'Почему приём с обратным порядком здесь не работает?',
        'Why does the reverse-order trick fail here?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Juftlarning yig'indisi bir xil emas: yigirma sakkiz va o'n ikki", 'Суммы пар не одинаковы: двадцать восемь и двенадцать', 'The pair sums are not equal: twenty eight and twelve'),
        },
        {
          id: 'wrong',
          label: L("Hadlar soni juft bo'lgani uchun", 'Потому что число членов чётное', 'Because the number of terms is even'),
          hint: L(
            "Hadlar soni bu yerda muhim emas. Ikkita juftni hisoblab ko'ring va ularni solishtiring.",
            'Число членов здесь ни при чём. Посчитай обе пары и сравни их.',
            'The count of terms is irrelevant here. Compute both pairs and compare them.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Arifmetikda qadam qo'shilardi, shuning uchun juftlar tenglashardi. Geometrikda esa boshqa aylanma yo'l kerak.",
        'Верно. В арифметической шаг прибавлялся, поэтому пары выравнивались. В геометрической нужен другой обходной путь.',
        'Correct. In the arithmetic one the step was added, so the pairs evened out. The geometric one needs a different detour.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ayirish: 3S − S.
// ============================================================
const S3 = {
  eyebrow: L('AYIRAMIZ', 'ВЫЧИТАЕМ', 'SUBTRACTING'),
  title: L(
    "Ayirgandan keyin ikkita son qoladi",
    'После вычитания остаются два числа',
    'Two numbers remain after subtracting',
  ),
  audio: [
    A('mount',
      "Pastdagi tenglikdan yuqoridagisini ayiramiz. Chap tomonda uch S minus S qoladi, o'ng tomonda esa umumiy hadlar qisqaradi.",
      'Из нижнего равенства вычтем верхнее. Слева останется три S минус S, а справа общие члены сократятся.',
      'Subtract the upper equality from the lower one. On the left three S minus S remains, on the right the shared terms cancel.'),
    A('why',
      "Qaysi ikkita son qoladi? Uch S da ortiqcha yetti yuz yigirma to'qqiz bor, S da esa ortiqcha bir.",
      'Какие два числа останутся? В три S лишнее семьсот двадцать девять, а в S лишняя единица.',
      'Which two numbers remain? Three S has the extra seven hundred twenty nine, and S has the extra one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3S − S = ?', '3S − S = ?', '3S − S = ?')}
      steps={[
        { id: 'a', head: L('Chap tomon', 'Левая часть', 'Left side'), lines: ['3S − S = 2S'] },
      ]}
      ask={L(
        "Ayirilgandan keyin o'ng tomonda nima qoladi?",
        'Что останется в правой части после вычитания?',
        'What remains on the right side after the subtraction?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '729 − 1' },
        {
          id: 'wrong',
          label: '729 + 1',
          hint: L(
            "Ayirilyapti, qo'shilmayapti. Bir S da bor edi, S esa ayiriladi, demak bir minus ishora bilan chiqadi.",
            'Вычитаем, а не складываем. Единица была в S, а S вычитается, значит она выйдет со знаком минус.',
            'We are subtracting, not adding. The one was in S, and S is subtracted, so it comes out with a minus.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki S teng yetti yuz yigirma sakkiz, demak S teng uch yuz oltmish to'rt. Oltita qo'shishning o'rniga bitta ayirish.",
        'Верно. Два S равно семьсот двадцать восемь, значит S равно триста шестьдесят четыре. Вместо шести сложений одно вычитание.',
        'Correct. Two S is seven hundred twenty eight, so S is three hundred sixty four. One subtraction instead of six additions.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — sonlar o'rniga harflar.
// ============================================================
const S4 = {
  eyebrow: L('HARFLAR BILAN', 'В БУКВАХ', 'IN LETTERS'),
  title: L(
    "O'sha qadam, faqat sonlar o'rniga harflar",
    'Тот же шаг, только вместо чисел буквы',
    'The same move, only with letters instead of numbers',
  ),
  audio: [
    A('mount',
      "Endi ixtiyoriy progressiya. Yig'indini q ga ko'paytiramiz va ayiramiz. O'rtadagi hadlar yana qisqaradi.",
      'Теперь произвольная прогрессия. Умножим сумму на q и вычтем. Средние члены снова сократятся.',
      'Now an arbitrary progression. Multiply the sum by q and subtract. The middle terms cancel again.'),
    A('why',
      "S minus q S teng b bir minus b bir q ning n darajasi. Chapda S umumiy ko'paytuvchi sifatida chiqariladi.",
      'S минус q S равно b один минус b один на q в степени n. Слева S выносится как общий множитель.',
      'S minus q S equals b one minus b one times q to the n. On the left S factors out.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('S − qS = b₁ − b₁qⁿ', 'S − qS = b₁ − b₁qⁿ', 'S − qS = b₁ − b₁qⁿ')}
      steps={[
        { id: 'a', head: L("Umumiy ko'paytuvchi", 'Общий множитель', 'Common factor'), lines: ['S(1 − q) = b₁(1 − qⁿ)'] },
      ]}
      ask={L(
        "S ni topish uchun nimaga bo'lish kerak?",
        'На что нужно разделить, чтобы найти S?',
        'What must we divide by to find S?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '1 − q' },
        {
          id: 'wrong',
          label: '1 − qⁿ',
          hint: L(
            "S qavs bir minus q bilan ko'paytirilgan, aynan shu qavsdan qutulish kerak. Bir minus q ning n darajasi o'ng tomonda turibdi.",
            'S умножено на скобку один минус q, именно от неё нужно избавиться. Один минус q в степени n стоит справа.',
            'S is multiplied by the bracket one minus q, and that is the one to remove. One minus q to the n sits on the right.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. S n teng b bir karra bir minus q ning n darajasi, bo'lingan bir minus q. Bu darslikning to'rtinchi formulasi.",
        'Верно. S n равно b один на один минус q в степени n, делённое на один минус q. Это четвёртая формула учебника.',
        'Correct. S n equals b one times one minus q to the n, divided by one minus q. This is formula four in the textbook.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — darslikning 2-masalasi.
// ============================================================
const S5 = {
  eyebrow: L('FORMULA ISHLAYDI', 'ФОРМУЛА В ДЕЛЕ', 'THE FORMULA AT WORK'),
  title: L(
    "Kamayuvchi progressiyaning yig'indisi",
    'Сумма убывающей прогрессии',
    'The sum of a shrinking progression',
  ),
  audio: [
    A('mount',
      "Olti, ikki, ikki uchdan. Birinchi had olti, maxraj bir uchdan. Dastlabki beshta hadning yig'indisini toping.",
      'Шесть, два, две трети. Первый член шесть, знаменатель одна третья. Найди сумму первых пяти членов.',
      'Six, two, two thirds. The first term is six, the ratio is one third. Find the sum of the first five terms.'),
    A('why',
      "Formulaga qo'yamiz. Bir uchdanning beshinchi darajasi bir ikki yuz qirq uchdan.",
      'Подставим в формулу. Одна третья в пятой степени это одна двести сорок третья.',
      'Substitute into the formula. One third to the fifth is one two hundred forty third.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('b₁ = 6,  q = 1/3,  S₅ = ?', 'b₁ = 6,  q = 1/3,  S₅ = ?', 'b₁ = 6,  q = 1/3,  S₅ = ?')}
      steps={[
        { id: 'a', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['S₅ = 6(1 − 1/243) : (2/3)'] },
      ]}
      ask={L(
        "Beshta hadning yig'indisi nechaga teng?",
        'Чему равна сумма пяти членов?',
        'What does the sum of five terms equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '242/27' },
        {
          id: 'wrong',
          label: '242/243',
          hint: L(
            "Qavs ichidagi ayirma ikki yuz qirq ikki bo'lingan ikki yuz qirq uch. Uni yana oltiga ko'paytirib, ikki uchdanga bo'lish qolgan.",
            'Разность в скобке это двести сорок два на двести сорок три. Её ещё нужно умножить на шесть и разделить на две трети.',
            'The bracket difference is two hundred forty two over two hundred forty three. It still has to be multiplied by six and divided by two thirds.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki yuz qirq ikki bo'lingan yigirma yetti, ya'ni to'qqiz atrofida. Qo'lda qo'shib tekshirsangiz ham shu chiqadi.",
        'Верно. Двести сорок два на двадцать семь, то есть около девяти. Если сложить вручную, получится то же самое.',
        'Correct. Two hundred forty two over twenty seven, that is about nine. Adding by hand gives the same.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning 5-masalasi: oxirgi had orqali.
// ============================================================
const S6 = {
  eyebrow: L("OXIRGI HAD MA'LUM", 'ИЗВЕСТЕН ПОСЛЕДНИЙ ЧЛЕН', 'THE LAST TERM IS KNOWN'),
  title: L(
    "n noma'lum bo'lsa ham yig'indi topiladi",
    'Сумму можно найти и не зная n',
    'The sum can be found even without knowing n',
  ),
  audio: [
    A('mount',
      "Besh qo'shuv o'n besh qo'shuv qirq besh va hokazo, oxirgi hadi bir ming ikki yuz o'n besh. Hadlar soni berilmagan.",
      'Пять плюс пятнадцать плюс сорок пять и так далее, последний член тысяча двести пятнадцать. Число членов не дано.',
      'Five plus fifteen plus forty five and so on, the last term is one thousand two hundred fifteen. The count of terms is not given.'),
    A('why',
      "Formuladagi b bir q ning n darajasi aslida oxirgi hadni q ga ko'paytirgan bilan bir xil.",
      'Выражение b один на q в степени n в формуле это то же самое, что последний член на q.',
      'The expression b one times q to the n in the formula is the same as the last term times q.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5, 15, 45, ..., 1215', '5, 15, 45, ..., 1215', '5, 15, 45, ..., 1215')}
      steps={[
        { id: 'a', head: L("Formulaning ikkinchi ko'rinishi", 'Вторая форма формулы', 'The second form of the formula'), lines: ['Sₙ = (bₙ·q − b₁) : (q − 1)'] },
      ]}
      ask={L(
        "Bu yig'indi nechaga teng?",
        'Чему равна эта сумма?',
        'What does this sum equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '1820' },
        {
          id: 'wrong',
          label: '1215',
          hint: L(
            "Bir ming ikki yuz o'n besh bu faqat OXIRGI had. Yig'indi undan katta bo'lishi kerak, chunki oldingi hadlar ham qo'shiladi.",
            'Тысяча двести пятнадцать это только ПОСЛЕДНИЙ член. Сумма должна быть больше, ведь прибавляются и предыдущие.',
            'One thousand two hundred fifteen is only the LAST term. The sum must be larger, since the earlier terms add on too.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir ming ikki yuz o'n beshni uchga ko'paytiramiz, beshni ayiramiz, ikkiga bo'lamiz. Bir ming sakkiz yuz yigirma.",
        'Верно. Тысячу двести пятнадцать умножаем на три, вычитаем пять, делим на два. Тысяча восемьсот двадцать.',
        'Correct. Multiply one thousand two hundred fifteen by three, subtract five, divide by two. One thousand eight hundred twenty.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — q = 1 holi.
// ============================================================
const S7 = {
  eyebrow: L('BITTA HOL CHETDA QOLDI', 'ОДИН СЛУЧАЙ ОСТАЛСЯ В СТОРОНЕ', 'ONE CASE STAYS OUTSIDE'),
  title: L(
    "q birga teng bo'lsa formula ishlamaydi",
    'При q равном единице формула не работает',
    'With q equal to one the formula fails',
  ),
  audio: [
    A('mount',
      "Yetti, yetti, yetti, yetti, yetti. Bu ham geometrik progressiya, maxraji birga teng. Yig'indisi aniq o'ttiz besh.",
      'Семь, семь, семь, семь, семь. Это тоже геометрическая прогрессия, знаменатель равен единице. Сумма очевидно тридцать пять.',
      'Seven, seven, seven, seven, seven. This is a geometric progression too, with ratio one. The sum is plainly thirty five.'),
    A('why',
      "Endi shu progressiyani formulaga qo'ying va maxrajga qarang.",
      'Теперь подставь эту прогрессию в формулу и посмотри на знаменатель.',
      'Now put this progression into the formula and look at the denominator.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('7, 7, 7, 7, 7   →   q = 1', '7, 7, 7, 7, 7   →   q = 1', '7, 7, 7, 7, 7   →   q = 1')}
      steps={[
        { id: 'a', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['S₅ = 7(1 − 1⁵) : (1 − 1)'] },
      ]}
      ask={L(
        "Formulaga qo'yilganda nima sodir bo'ladi?",
        'Что происходит при подстановке в формулу?',
        'What happens when we substitute into the formula?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Maxraj nolga aylanadi, formula ishlamaydi", 'Знаменатель обращается в ноль, формула не работает', 'The denominator becomes zero, the formula fails'),
        },
        {
          id: 'wrong',
          label: L("Yig'indi nolga teng chiqadi", 'Сумма получается равной нулю', 'The sum comes out as zero'),
          hint: L(
            "Surat ham, maxraj ham nolga aylanadi. Nolni nolga bo'lish mumkin emas, javob nol emas.",
            'И числитель, и знаменатель обращаются в ноль. Делить ноль на ноль нельзя, ответ не ноль.',
            'Both the numerator and the denominator turn into zero. Zero over zero is not allowed, and the answer is not zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun teorema q birga teng emas deb boshlanadi. q birga teng bo'lsa hamma hadlar bir xil, yig'indi esa b bir karra n.",
        'Верно. Поэтому теорема начинается со слов q не равно единице. При q равном единице все члены одинаковы, а сумма это b один на n.',
        'Correct. That is why the theorem starts with q not equal to one. When q is one all terms are equal, and the sum is b one times n.',
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
    'Algebra 9, 32-§, teorema va 1-5-masalalar (167-169-bet)',
    'Алгебра 9, §32, теорема и задачи 1-5 (стр. 167-169)',
    'Algebra 9, §32, the theorem and problems 1-5 (p. 167-169)',
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
          "Yig'indi formulasi qanday qadamdan chiqdi?",
          'Из какого шага получилась формула суммы?',
          'From which move did the sum formula come?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Yig'indi q ga ko'paytirilib, o'zidan ayirildi", 'Сумму умножили на q и вычли из неё саму себя', 'The sum was multiplied by q and subtracted from itself'),
          },
          {
            id: 'wrong',
            label: L("Yig'indi teskari tartibda yozilib, qo'shildi", 'Сумму записали в обратном порядке и сложили', 'The sum was written in reverse order and added'),
            hint: L(
              "2-ekranni eslang: teskari tartib bu yerda juftlarni tenglashtirmadi. U 23-darsning usuli edi.",
              'Вспомни 2 экран: обратный порядок здесь не выровнял пары. Это приём 23 урока.',
              'Recall screen 2: reversing did not even out the pairs here. That was the lesson 23 trick.',
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
    "Ko'paytir, ayir, bo'l",
    'Умножь, вычти, раздели',
    'Multiply, subtract, divide',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz qadamni sonlarda ko'rdingiz, harflarda takrorladingiz, ikkita ko'rinishini oldingiz va chetda qolgan holni topdingiz.",
      'На семи экранах ты увидел шаг в числах, повторил его в буквах, получил две формы формулы и нашёл случай, оставшийся в стороне.',
      'On seven screens you saw the move in numbers, repeated it in letters, obtained both forms, and found the case left outside.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SeqTable: qismiy yig'indilar.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Qismiy yig'indilar jadvali",
    'Таблица частичных сумм',
    'A table of partial sums',
  ),
  audio: [
    A('mount',
      "Progressiya ikki, olti, o'n sakkiz, ellik to'rt, bir yuz oltmish ikki. Jadvalga hadlarni emas, YIG'INDILARNI yozing.",
      'Прогрессия два, шесть, восемнадцать, пятьдесят четыре, сто шестьдесят два. В таблицу пиши не члены, а СУММЫ.',
      'The progression is two, six, eighteen, fifty four, one hundred sixty two. Write the SUMS in the table, not the terms.'),
    A('why',
      "Har katakda avvalgi yig'indiga navbatdagi had qo'shiladi.",
      'В каждой клетке к предыдущей сумме прибавляется очередной член.',
      'In each cell the next term is added to the previous sum.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SeqTable
      rule={L('2, 6, 18, 54, 162', '2, 6, 18, 54, 162', '2, 6, 18, 54, 162')}
      ns={[1, 2, 3, 4, 5]}
      cells={[
        { value: '2', wrong: '6', hint: L("Birinchi yig'indi bu birinchi hadning o'zi: ikki.", 'Первая сумма это сам первый член: два.', 'The first sum is the first term itself: two.') },
        { value: '8', wrong: '6', hint: L("Ikki qo'shuv olti: sakkiz. Olti bu yig'indi emas, ikkinchi hadning o'zi.", 'Два плюс шесть: восемь. Шесть это не сумма, а сам второй член.', 'Two plus six is eight. Six is not the sum, it is the second term itself.') },
        { value: '26', wrong: '18', hint: L("Sakkiz qo'shuv o'n sakkiz: yigirma olti.", 'Восемь плюс восемнадцать: двадцать шесть.', 'Eight plus eighteen: twenty six.') },
        { value: '80', wrong: '54', hint: L("Yigirma olti qo'shuv ellik to'rt: sakson.", 'Двадцать шесть плюс пятьдесят четыре: восемьдесят.', 'Twenty six plus fifty four: eighty.') },
        { value: '242', wrong: '162', hint: L("Sakson qo'shuv bir yuz oltmish ikki: ikki yuz qirq ikki.", 'Восемьдесят плюс сто шестьдесят два: двести сорок два.', 'Eighty plus one hundred sixty two: two hundred forty two.') },
      ]}
      ask={L(
        "Jadvalni to'ldiring: har katakda qismiy yig'indi",
        'Заполни таблицу: в каждой клетке частичная сумма',
        'Fill the table: each cell holds a partial sum',
      )}
      after={L(
        "Ana xolos. Ikki, sakkiz, yigirma olti, sakson, ikki yuz qirq ikki. Diqqat qiling: bularning har biri uchning darajasidan bitta kam.",
        'Вот и всё. Два, восемь, двадцать шесть, восемьдесят, двести сорок два. Заметь: каждое из них на единицу меньше степени тройки.',
        'That is all it takes. Two, eight, twenty six, eighty, two hundred forty two. Notice: each is one less than a power of three.',
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
    "Formula bo'yicha yig'indi",
    'Сумма по формуле',
    'The sum by the formula',
  ),
  audio: [
    A('mount',
      "Uchta progressiya. Har birida dastlabki hadlarning yig'indisini toping.",
      'Три прогрессии. В каждой найди сумму первых членов.',
      'Three progressions. Find the sum of the first terms in each.'),
    A('why',
      "Avval maxrajni aniqlang, keyin formulaga qo'ying.",
      'Сначала определи знаменатель, потом подставь в формулу.',
      'First determine the ratio, then substitute into the formula.'),
  ],
  props: {
    stepLabel: L('Progressiya', 'Прогрессия', 'Progression'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Maxraj birdan katta bo'lganda ayirmani teskari yozib, minuslardan qutulish qulay.",
      'Все три найдены. Когда знаменатель больше единицы, удобно перевернуть разность и избавиться от минусов.',
      'All three are found. When the ratio exceeds one it helps to flip the difference and get rid of the minuses.',
    ),
    tasks: [
      {
        expr: '5, 10, 20, ...   S₇ = ?',
        question: L('Yettita hadning yig\'indisi nechaga teng?', 'Чему равна сумма семи членов?', 'What does the sum of seven terms equal?'),
        ok: L("Ha. Ikkining yettinchi darajasi bir yuz yigirma sakkiz, undan bir ayirsak bir yuz yigirma yetti, beshga ko'paytirsak olti yuz o'ttiz besh.", 'Да. Два в седьмой степени сто двадцать восемь, минус один сто двадцать семь, умножить на пять шестьсот тридцать пять.', 'Yes. Two to the seventh is one hundred twenty eight, minus one is one hundred twenty seven, times five is six hundred thirty five.'),
        items: [
          { id: 'a', right: true, label: '635' },
          { id: 'b', label: '640', hint: L("Olti yuz qirq bu besh karra bir yuz yigirma sakkiz, ya'ni birni ayirish unutilgan. Formulada qavs ichida bir ayiriladi.", 'Шестьсот сорок это пять на сто двадцать восемь, то есть забыто вычитание единицы. В формуле в скобке вычитается единица.', 'Six hundred forty is five times one hundred twenty eight, so subtracting the one was forgotten. The formula subtracts one inside the bracket.') },
        ],
        solution: ['q = 10 : 5 = 2', 'S₇ = 5(2⁷ − 1) : (2 − 1)', 'S₇ = 5 · 127 = 635'],
      },
      {
        expr: '2, 6, 18, ...   S₇ = ?',
        question: L('Yettita hadning yig\'indisi nechaga teng?', 'Чему равна сумма семи членов?', 'What does the sum of seven terms equal?'),
        ok: L("Ha. Uchning yettinchi darajasi ikki ming bir yuz sakson yetti, undan bir ayiramiz.", 'Да. Три в седьмой степени две тысячи сто восемьдесят семь, вычитаем единицу.', 'Yes. Three to the seventh is two thousand one hundred eighty seven, and we subtract one.'),
        items: [
          { id: 'a', right: true, label: '2186' },
          { id: 'b', label: '4374', hint: L("To'rt ming uch yuz yetmish to'rt bu ikki karra ikki ming bir yuz sakson yetti. Lekin maxraj uch minus bir, ya'ni ikkiga bo'lish ham bor, ular qisqaradi.", 'Четыре тысячи триста семьдесят четыре это два на две тысячи сто восемьдесят семь. Но в знаменателе три минус один, и деление на два их сокращает.', 'Four thousand three hundred seventy four is two times two thousand one hundred eighty seven. But the denominator is three minus one, and dividing by two cancels it.') },
        ],
        solution: ['q = 3', 'S₇ = 2(3⁷ − 1) : (3 − 1)', 'S₇ = 3⁷ − 1 = 2186'],
      },
      {
        expr: 'b₁ = 1/2,  q = 2,  n = 6',
        question: L('Oltita hadning yig\'indisi nechaga teng?', 'Чему равна сумма шести членов?', 'What does the sum of six terms equal?'),
        ok: L("Ha. Ikkining oltinchi darajasi oltmish to'rt, undan bir ayirsak oltmish uch, yarmini olsak o'ttiz bir butun bir ikkidan.", 'Да. Два в шестой степени шестьдесят четыре, минус один шестьдесят три, половина это тридцать один целая одна вторая.', 'Yes. Two to the sixth is sixty four, minus one is sixty three, and half of that is thirty one and a half.'),
        items: [
          { id: 'a', right: true, label: '63/2' },
          { id: 'b', label: '63', hint: L("Oltmish uch bu qavsning qiymati. Uni birinchi hadga, ya'ni bir ikkidanga ko'paytirish qolgan.", 'Шестьдесят три это значение скобки. Её ещё нужно умножить на первый член, то есть на одну вторую.', 'Sixty three is the value of the bracket. It still has to be multiplied by the first term, one half.') },
        ],
        solution: ['S₆ = (1/2)(2⁶ − 1) : (2 − 1)', 'S₆ = 63/2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — TESKARI MASALALAR (3- va 4-masala).
// ============================================================
const S11 = {
  eyebrow: L('TESKARISIGA', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER WAY ROUND'),
  title: L(
    "Yig'indi ma'lum, qolgani noma'lum",
    'Сумма известна, остальное нет',
    'The sum is known, the rest is not',
  ),
  audio: [
    A('mount',
      "Endi yig'indi berilgan, topish kerak bo'lgani esa birinchi had yoki hadlar soni.",
      'Теперь дана сумма, а найти нужно первый член или число членов.',
      'Now the sum is given, and what must be found is the first term or the count of terms.'),
    A('why',
      "Formula o'sha, faqat noma'lum boshqa joyda turadi.",
      'Формула та же, просто неизвестное стоит в другом месте.',
      'The formula is the same, only the unknown sits elsewhere.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Hadlar soni daraja orqali chiqadi, shuning uchun ikkining darajalarini yoddan bilish qo'l keladi.",
      'Оба найдены. Число членов выходит через степень, поэтому степени двойки полезно знать наизусть.',
      'Both are found. The count of terms comes out through a power, so knowing the powers of two by heart helps.',
    ),
    tasks: [
      {
        expr: 'q = 1/2,  S₆ = 252,  b₁ = ?',
        question: L('Birinchi had nechaga teng?', 'Чему равен первый член?', 'What does the first term equal?'),
        ok: L("Ha. Qavs ichida oltmish uch oltmish to'rtdan, maxraj bir ikkidan, demak b bir bir yuz yigirma sakkiz.", 'Да. В скобке шестьдесят три шестьдесят четвёртых, знаменатель одна вторая, значит b один сто двадцать восемь.', 'Yes. The bracket is sixty three sixty fourths, the denominator is one half, so b one is one hundred twenty eight.'),
        items: [
          { id: 'a', right: true, label: 'b₁ = 128' },
          { id: 'b', label: 'b₁ = 252', hint: L("Ikki yuz ellik ikki bu YIG'INDI, birinchi had emas. Birinchi had undan kichik bo'lishi kerak.", 'Двести пятьдесят два это СУММА, а не первый член. Первый член должен быть меньше.', 'Two hundred fifty two is the SUM, not the first term. The first term has to be smaller.') },
        ],
        solution: ['252 = b₁(1 − 1/64) : (1/2)', '252 = b₁ · 63/32', 'b₁ = 128'],
      },
      {
        expr: 'b₁ = −3,  q = 2,  Sₙ = −93,  n = ?',
        question: L('Hadlar soni nechta?', 'Сколько членов?', 'How many terms are there?'),
        ok: L("Ha. Ikkining n darajasi o'ttiz ikkiga teng chiqdi, o'ttiz ikki bu ikkining beshinchi darajasi, demak n beshga teng.", 'Да. Два в степени n оказалось равно тридцати двум, тридцать два это два в пятой, значит n равно пяти.', 'Yes. Two to the n came out as thirty two, and thirty two is two to the fifth, so n is five.'),
        items: [
          { id: 'a', right: true, label: 'n = 5' },
          { id: 'b', label: 'n = 32', hint: L("O'ttiz ikki bu ikkining darajasidan chiqqan son. Ikkining qaysi darajasi o'ttiz ikkiga teng, o'shanisi n bo'ladi.", 'Тридцать два это результат возведения двойки в степень. Показатель, при котором два даёт тридцать два, и есть n.', 'Thirty two is the result of raising two to a power. The exponent that makes two into thirty two is n.') },
        ],
        solution: ['−93 = −3(1 − 2ⁿ) : (1 − 2)', '−31 = 1 − 2ⁿ', '2ⁿ = 32 = 2⁵,  n = 5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — 24-darsning darajasi yig'indiga olib kirilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Bitta daraja, bitta yo'qolgan had",
    'Одна степень, один потерянный член',
    'One power off, one term lost',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Ikki qo'shuv olti qo'shuv o'n sakkiz qo'shuv ellik to'rt. U formulaga uchning UCHINCHI darajasini qo'ygan va yigirma olti chiqargan.",
      'Решение Камрона. Два плюс шесть плюс восемнадцать плюс пятьдесят четыре. Он подставил в формулу три в ТРЕТЬЕЙ степени и получил двадцать шесть.',
      "Kamron's solution. Two plus six plus eighteen plus fifty four. He put three to the THIRD power into the formula and got twenty six."),
    A('why',
      "O'tgan darsda had formulasida daraja n minus bir edi, Kamron o'shani eslab qolgan. Uning javobini tekshiring.",
      'На прошлом уроке в формуле члена степень была n минус один, Камрон запомнил именно её. Проверь его ответ.',
      'In the last lesson the term formula had the power n minus one, and that is what Kamron remembered. Check his answer.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamronning yigirma oltisi xato emas, u boshqa savolning javobi: bu uchta hadning yig'indisi. n minus bir darajasi to'rtinchi hadni tushirib qoldirdi.",
      'Двадцать шесть у Камрона не выдумка, это ответ на другой вопрос: сумма трёх членов. Степень n минус один потеряла четвёртый член.',
      "Kamron's twenty six is not nonsense, it answers a different question: the sum of three terms. The n minus one power dropped the fourth term.",
    ),
    tasks: [
      {
        expr: '2 + 6 + 18 + 54 = ?',
        question: L(
          "Kamron uchning uchinchi darajasini oldi. Yig'indi formulasida daraja qanday bo'lishi kerak?",
          'Камрон взял три в третьей степени. Какой должна быть степень в формуле суммы?',
          'Kamron used three to the third. What should the power be in the sum formula?',
        ),
        ok: L(
          "To'g'ri: hadlar soniga teng, ya'ni to'rtinchi daraja. Javob sakson, yigirma olti emas.",
          'Верно: равной числу членов, то есть четвёртой. Ответ восемьдесят, а не двадцать шесть.',
          'Correct: equal to the count of terms, that is the fourth. The answer is eighty, not twenty six.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Hadlar soniga teng, javob sakson", 'Равной числу членов, ответ восемьдесят', 'Equal to the count of terms, the answer is eighty'),
          },
          {
            id: 'b',
            label: L("Hadlar sonidan bitta kam, Kamron to'g'ri qilgan", 'На единицу меньше числа членов, Камрон прав', 'One less than the count of terms, Kamron is right'),
            hint: L(
              "Qo'lda qo'shib ko'ring: ikki qo'shuv olti qo'shuv o'n sakkiz qo'shuv ellik to'rt sakson bo'ladi, yigirma olti emas. n minus bir darajasi had formulasiniki edi.",
              'Сложи вручную: два плюс шесть плюс восемнадцать плюс пятьдесят четыре даёт восемьдесят, а не двадцать шесть. Степень n минус один была в формуле члена.',
              'Add by hand: two plus six plus eighteen plus fifty four is eighty, not twenty six. The n minus one power belonged to the term formula.',
            ),
          },
        ],
        solution: [
          'S₄ = 2(3⁴ − 1) : (3 − 1) = 80',
          L('Kamron: 2(3³ − 1) : 2 = 26', 'Камрон: 2(3³ − 1) : 2 = 26', 'Kamron: 2(3³ − 1) : 2 = 26'),
          L('26 = 2 + 6 + 18, uchta had', '26 = 2 + 6 + 18, три члена', '26 = 2 + 6 + 18, three terms'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — manfiy maxraj yig'indi formulasida.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Manfiy maxraj formulaning ichida",
    'Отрицательный знаменатель внутри формулы',
    'A negative ratio inside the formula',
  ),
  audio: [
    A('mount',
      "Maxraj minus ikki, sakkizta hadning yig'indisi sakson besh. Birinchi hadni toping.",
      'Знаменатель минус два, сумма восьми членов восемьдесят пять. Найди первый член.',
      'The ratio is minus two, the sum of eight terms is eighty five. Find the first term.'),
    A('why',
      "Minus ikkining sakkizinchi darajasi juft, demak u MUSBAT. Maxrajda esa bir minus minus ikki turadi.",
      'Минус два в восьмой степени чётная, значит она ПОЛОЖИТЕЛЬНА. А в знаменателе стоит один минус минус два.',
      'Minus two to the eighth is an even power, so it is POSITIVE. And the denominator holds one minus minus two.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi. Birinchi had minus bir, sakkizinchisi esa bir yuz yigirma sakkiz. Qo'lda qo'shib tekshiring: minus bir qo'shuv ikki minus to'rt va hokazo, sakson besh chiqadi.",
      'Найдено. Первый член минус один, восьмой сто двадцать восемь. Проверь вручную: минус один плюс два минус четыре и так далее, выйдет восемьдесят пять.',
      'Found. The first term is minus one, the eighth is one hundred twenty eight. Check by hand: minus one plus two minus four and so on gives eighty five.',
    ),
    tasks: [
      {
        expr: 'q = −2,  S₈ = 85,  b₁ = ?',
        question: L(
          "Minus ikkining sakkizinchi darajasi qanday ishoraga ega?",
          'Какой знак у минус двух в восьмой степени?',
          'What sign does minus two to the eighth have?',
        ),
        ok: L(
          "To'g'ri, musbat: ikki yuz ellik olti. Shundan keyin b bir minus birga teng chiqadi, sakkizinchi had esa bir yuz yigirma sakkiz.",
          'Верно, положительный: двести пятьдесят шесть. Отсюда b один равно минус единице, а восьмой член сто двадцать восемь.',
          'Correct, positive: two hundred fifty six. From there b one is minus one, and the eighth term is one hundred twenty eight.',
        ),
        items: [
          { id: 'a', right: true, label: L('Musbat, 256', 'Положительный, 256', 'Positive, 256') },
          {
            id: 'b',
            label: L('Manfiy, −256', 'Отрицательный, −256', 'Negative, −256'),
            hint: L(
              "Sakkizta manfiy ko'paytuvchi juftlarga bo'linadi, har bir juft musbat beradi. Manfiy natija faqat TOQ darajada chiqadi.",
              'Восемь отрицательных множителей разбиваются на пары, каждая пара даёт плюс. Отрицательный результат бывает только в НЕЧЁТНОЙ степени.',
              'Eight negative factors split into pairs, and each pair gives a plus. A negative result comes only from an ODD power.',
            ),
          },
        ],
        solution: [
          '85 = b₁(1 − 256) : (1 + 2)',
          '85 = b₁ · (−255) : 3 = −85b₁',
          'b₁ = −1,  b₈ = −1 · (−2)⁷ = 128',
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
    "Blits: daraja, maxraj, ikkinchi ko'rinish",
    'Блиц: степень, знаменатель, вторая форма',
    'Blitz: the power, the ratio, the second form',
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
        tag: 'yigindida-daraja-n',
        ask: L(
          "Yig'indi formulasida q qanday darajaga ko'tariladi?",
          'В какую степень возводится q в формуле суммы?',
          'To what power is q raised in the sum formula?',
        ),
        options: [
          { id: 'n', right: true, label: L('n darajasiga', 'В степень n', 'To the power n') },
          { id: 'n1', label: L('n minus bir darajasiga', 'В степень n минус один', 'To the power n minus one') },
        ],
        ok: L(
          "To'g'ri. n minus bir had formulasida edi, yig'indida esa aynan n.",
          'Верно. Степень n минус один была в формуле члена, а в сумме именно n.',
          'Correct. The n minus one power was in the term formula, in the sum it is exactly n.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron aynan shu ikkitasini adashtirgan va bitta hadni yo'qotgan.",
          'Вспомни 12 экран: Камрон перепутал как раз эти две степени и потерял один член.',
          'Recall screen 12: Kamron mixed up exactly these two powers and lost one term.',
        ),
      },
      {
        id: 'q2',
        tag: 'q-bir-bolsa',
        ask: L(
          "Maxraj birga teng bo'lsa, yig'indi qanday topiladi?",
          'Как находится сумма, если знаменатель равен единице?',
          'How is the sum found when the ratio equals one?',
        ),
        options: [
          { id: 'bn', right: true, label: L("b bir karra n", 'b один умножить на n', 'b one times n') },
          { id: 'f', label: L("O'sha formula bilan", 'По той же формуле', 'By the same formula') },
        ],
        ok: L(
          "To'g'ri. Formula bu holda ishlamaydi, maxraji nolga aylanadi. Hamma hadlar bir xil bo'lgani uchun ularni sanab ko'paytirish yetarli.",
          'Верно. Формула здесь не работает, знаменатель обращается в ноль. Так как все члены одинаковы, достаточно их сосчитать и умножить.',
          'Correct. The formula fails here, its denominator turns into zero. Since all terms are equal, counting and multiplying is enough.',
        ),
        hint: L(
          "7-ekranni eslang: yetti, yetti, yetti, yetti, yetti uchun maxrajda bir minus bir chiqqan edi.",
          'Вспомни 7 экран: для семи, семи, семи, семи, семи в знаменателе вышло один минус один.',
          'Recall screen 7: for seven, seven, seven, seven, seven the denominator came out as one minus one.',
        ),
      },
      {
        id: 'q3',
        tag: 'manfiy-q-ni-hisoblamaslik',
        ask: L(
          "Maxraj manfiy va daraja juft bo'lsa, natija qanday ishoraga ega?",
          'Какой знак у результата, если знаменатель отрицателен, а степень чётная?',
          'What sign does the result have when the ratio is negative and the power is even?',
        ),
        options: [
          { id: 'p', right: true, label: L('Musbat', 'Положительный', 'Positive') },
          { id: 'm', label: L('Manfiy', 'Отрицательный', 'Negative') },
        ],
        ok: L(
          "To'g'ri. Manfiy ko'paytuvchilar juftlarga bo'linadi, har bir juft musbat beradi.",
          'Верно. Отрицательные множители разбиваются на пары, каждая пара даёт плюс.',
          'Correct. The negative factors split into pairs, and each pair gives a plus.',
        ),
        hint: L(
          "13-ekranni eslang: minus ikkining sakkizinchi darajasi ikki yuz ellik olti, musbat.",
          'Вспомни 13 экран: минус два в восьмой степени двести пятьдесят шесть, положительное.',
          'Recall screen 13: minus two to the eighth is two hundred fifty six, a positive number.',
        ),
      },
      {
        id: 'q4',
        tag: 'oxirgi-had-orqali-hisoblash',
        ask: L(
          "Hadlar soni noma'lum, lekin oxirgi had berilgan. Nima qilinadi?",
          'Число членов неизвестно, но дан последний член. Что делается?',
          'The count of terms is unknown but the last term is given. What is done?',
        ),
        options: [
          { id: 'sec', right: true, label: L("Formulaning ikkinchi ko'rinishi ishlatiladi", 'Используется вторая форма формулы', 'The second form of the formula is used') },
          { id: 'no', label: L("Yig'indini topib bo'lmaydi", 'Сумму найти нельзя', 'The sum cannot be found') },
        ],
        ok: L(
          "To'g'ri. Oxirgi hadni q ga ko'paytirib, birinchi hadni ayiramiz va q minus birga bo'lamiz.",
          'Верно. Последний член умножаем на q, вычитаем первый и делим на q минус один.',
          'Correct. Multiply the last term by q, subtract the first, and divide by q minus one.',
        ),
        hint: L(
          "6-ekranni eslang: besh qo'shuv o'n besh va hokazo, oxirgisi bir ming ikki yuz o'n besh. Hadlar soni kerak bo'lmagandi.",
          'Вспомни 6 экран: пять плюс пятнадцать и так далее, последний тысяча двести пятнадцать. Число членов не понадобилось.',
          'Recall screen 6: five plus fifteen and so on, the last one is one thousand two hundred fifteen. The count of terms was never needed.',
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
    "Bitta ayirish oltita qo'shishning o'rniga",
    'Одно вычитание вместо шести сложений',
    'One subtraction instead of six additions',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda siz ikki qatorning faqat ikkita had bilan farq qilishini ko'rdingiz. Butun formula shu kuzatuvdan chiqdi.",
      'На первом экране ты увидел, что два ряда различаются лишь двумя членами. Вся формула выросла из этого наблюдения.',
      'On the first screen you saw that two rows differ by only two terms. The whole formula grew out of that observation.'),
    A('s1',
      "Siz formulani chiqardingiz, uning ikkinchi ko'rinishini oldingiz, chetda qolgan holni topdingiz va manfiy maxraj bilan ishladingiz.",
      'Ты вывел формулу, получил её вторую форму, нашёл случай, оставшийся в стороне, и поработал с отрицательным знаменателем.',
      'You derived the formula, obtained its second form, found the case left outside, and worked with a negative ratio.'),
    A('s2',
      "Keyingi dars amaliy: ikkala progressiyaga oid aralash masalalar.",
      'Следующий урок практический: смешанные задачи на обе прогрессии.',
      'The next lesson is practical: mixed problems on both progressions.'),
  ],
  props: {
    mark: 'Sₙ = b₁(1 − qⁿ) : (1 − q)',
    markNote: L(
      "q birga teng bo'lmaganda",
      'при q не равном единице',
      'when q is not equal to one',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: progressiyalarga oid masalalar',
      'Следующий урок: задачи на прогрессии',
      'Next lesson: problems on progressions',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'yigindida-daraja-n', ...S2 },
  { role: 'explain',  tag: 'yigindida-daraja-n', ...S3 },
  { role: 'explain',  tag: 'yigindida-daraja-n', ...S4 },
  { role: 'explain',  tag: 'yigindida-daraja-n', ...S5 },
  { role: 'explain',  tag: 'oxirgi-had-orqali-hisoblash', ...S6 },
  { role: 'explain',  tag: 'q-bir-bolsa', ...S7 },
  { role: 'rule',     tag: 'yigindida-daraja-n', ...S8 },
  { role: 'practice', tool: 'seqtable', tag: 'yigindida-daraja-n', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'yigindida-daraja-n', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'oxirgi-had-orqali-hisoblash', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yigindida-daraja-n', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'manfiy-q-ni-hisoblamaslik', ...S13 },
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
