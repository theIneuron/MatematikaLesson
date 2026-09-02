// ============================================================================
// 9-sinf, Dars 48. KOSINUSLAR TEOREMASI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 29-dars (86-87-bet).
//   Teorema (86-bet): a² = b² + c² − 2bc · cos A.
//   Isbot: B uchidan BD balandlik tushiriladi. BCD to'g'ri burchakli,
//       Pifagor bo'yicha BC² = BD² + DC², DC = AC − AD, ABD dan esa
//       BD² + AD² = AB² va AD = AB · cos A. Almashtirib qo'yilsa,
//       BC² = AB² + AC² − 2 · AB · AC · cos A.
//   Eslatma (86-bet): kosinuslar teoremasi Pifagor teoremasining
//       UMUMLASHMASI — A = 90° bo'lganda cos 90° = 0 va uchinchi
//       qo'shiluvchi yo'qoladi.
//   1-masala: AB = 6, AC = 7, ∠A = 60° → BC² = 49 + 36 − 42 = 43.
//   Natija (87-bet): cos A = (b² + c² − a²) / (2bc) — uchta tomondan
//       burchakni topish.
//   2-masala: a = 5, b = 6, c = 4 → cos A = 9/16, AD = 2,25.
//   29.2: a) 3, 4, ∠C = 60° → AB = √13;  b) 4, 4√2, ∠B = 45° → AC = 4.
//   29.3: tomonlari 5, 6, 7 → cos = 5/7, 19/35, 1/5 — uchalasi musbat.
//   29.6: tomonlari 5 va 7, burchagi 120° bo'lgan parallelogramm →
//       diagonallar √109 va √39.
//
// 43-DARSDA BERILGAN QARZ SHU YERDA UZILADI. U yerda skalyar
// ko'paytma burchak orqali berilgan va aytilgandi: koordinatali
// formulaning ISBOTI 48-darsga, kosinuslar teoremasidan keyinga
// qoldiriladi. Transfer aynan shu isbotni beradi: OA² + OB² − AB² ni
// yozib chiqsak, yarmi a₁b₁ + a₂b₂ bo'lib chiqadi. Ya'ni 8-sinfning
// koordinatali formulasi va 9-sinfning burchakli ta'rifi bir xil
// narsa ekan.
//
// XUK 47-DARSNING CHEGARASINI KO'RSATADI. Sinuslar teoremasi TOMON
// va uning QARSHISIDAGI BURCHAK juftligini talab qiladi. Darslikning
// 1-masalasida esa ikkita tomon va ular ORASIDAGI burchak berilgan —
// juftlik yo'q, teorema ishlamaydi. Yangi qurol kerak.
//
// TUZOQ (12-ekran): o'tmas burchakda kosinusning MANFIY ishorasini
// unutish. 120° da cos = −0,5, ya'ni uchinchi qo'shiluvchi qo'shiladi,
// ayirilmaydi. Ishorani unutgan bola 39 ni oladi, to'g'ri javob esa
// 109. Tekshiruv oddiy: o'tmas burchakka qarshi eng uzun tomon yotadi,
// √39 esa 7 dan qisqa.
//
// CHIZMA: `TriFig` (7K), yangisi yasalmadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, TriFig } from './asboblar.jsx'

export const META = {
  id: 'grade9-48',
  n: 48,
  row: 48,
  block: 'Б7',
  topic: L('Kosinuslar teoremasi', 'Теорема косинусов', 'The law of cosines'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Tomonning kvadrati qolgan ikkitasining kvadratlari yig'indisidan ularning ikkilangan ko'paytmasi karra kosinusni ayirganga teng",
    'Квадрат стороны равен сумме квадратов двух других минус их удвоенное произведение на косинус угла',
    'A side squared equals the sum of the other two squared minus twice their product times the cosine',
  ),
  L(
    "A = 90° bo'lganda kosinus nolga aylanadi va Pifagor teoremasi qoladi",
    'При A = 90° косинус обращается в ноль и остаётся теорема Пифагора',
    'At A = 90° the cosine vanishes and the theorem of Pythagoras remains',
  ),
  L(
    "Uchta tomondan burchakni topish mumkin: cos A = (b² + c² − a²) / (2bc)",
    'По трём сторонам можно найти угол: cos A = (b² + c² − a²) / (2bc)',
    'Three sides give the angle: cos A = (b² + c² − a²) / (2bc)',
  ),
]

export const MISS = {
  'otmas-burchak-ishorasi': {
    what: L(
      "o'tmas burchakda kosinusning manfiy ishorasi unutildi",
      'при тупом угле упущен минус у косинуса',
      'the minus of the cosine at an obtuse angle was dropped',
    ),
    wrong: null,
    at: 0,
  },
  'ikkilangan-kopaytmani-unutish': {
    what: L(
      "uchinchi qo'shiluvchida ikkilik unutildi",
      'в третьем слагаемом потеряна двойка',
      'the factor two was lost in the third term',
    ),
    wrong: null,
    at: 0,
  },
  'notogri-burchak-tanlash': {
    what: L(
      "formulaga tomonlar orasidagi burchak o'rniga boshqa burchak qo'yildi",
      'в формулу подставлен не угол между сторонами, а другой',
      'an angle other than the one between the sides was used',
    ),
    wrong: null,
    at: 0,
  },
  'ildizni-unutish': {
    what: L(
      "javobda tomonning o'zi emas, uning kvadrati qoldirildi",
      'в ответе оставлен квадрат стороны, а не сама сторона',
      'the answer kept the square of the side instead of the side',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — sinuslar teoremasi ishlamaydi.
// ============================================================
const S1 = {
  eyebrow: L('JUFTLIK YO\'Q', 'ПАРЫ НЕТ', 'NO PAIR'),
  title: L(
    "Ikkita tomon va ular orasidagi burchak",
    'Две стороны и угол между ними',
    'Two sides and the angle between them',
  ),
  audio: [
    A('mount',
      "ABC uchburchakda AB olti santimetr, AC yetti santimetr, ular orasidagi A burchagi esa oltmish daraja. BC ni topish kerak.",
      'В треугольнике ABC сторона AB шесть сантиметров, AC семь, а угол A между ними шестьдесят градусов. Нужно найти BC.',
      'In ABC the side AB is six centimetres, AC is seven, and the angle A between them is sixty degrees. Find BC.'),
    A('why',
      "Kecha sinuslar teoremasi tomon va uning qarshisidagi burchak juftligini talab qilardi. Bu yerda esa burchak noma'lum tomonga qarshi turibdi.",
      'Вчера теорема синусов требовала пары из стороны и противолежащего ей угла. А здесь угол лежит против неизвестной стороны.',
      'Yesterday the law of sines needed a side with the angle facing it. Here the angle faces the unknown side.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[6.56, 7, 6]}
          names={['A', 'B', 'C']}
          edges={{ c: '6', b: '7', a: '?' }}
          angles={{ A: '60°' }}
        />
      }
      steps={[]}
      ask={L(
        "Sinuslar teoremasi bu yerda yordam beradimi?",
        'Поможет ли здесь теорема синусов?',
        'Will the law of sines help here?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Yo'q: ma'lum tomon va uning qarshi burchagi juftligi yo'q",
            'Нет: нет пары из известной стороны и её угла',
            'No: there is no pair of a known side with its angle',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Ha: bitta burchak va ikkita tomon bor",
            'Да: есть угол и две стороны',
            'Yes: there is an angle and two sides',
          ),
          hint: L(
            "Teoremada har bir tomon o'ziga QARSHI burchak bilan turadi. Oltmish daraja esa noma'lum BC ga qarshi, ya'ni ikkala noma'lum bitta kasrda.",
            'В теореме каждая сторона стоит со своим ПРОТИВОЛЕЖАЩИМ углом. А шестьдесят градусов лежат против неизвестной BC, то есть в одной дроби два неизвестных.',
            'In the theorem each side stands with the angle FACING it. Sixty degrees faces the unknown BC, so one fraction holds two unknowns.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun ikkita tomon va ular ORASIDAGI burchak bilan ishlaydigan teoremani chiqaramiz.",
        'Верно. Сегодня выведем теорему, которая работает с двумя сторонами и углом МЕЖДУ ними.',
        'Correct. Today we derive the theorem that works with two sides and the angle BETWEEN them.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — Pifagor va uning cheklovi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Pifagor faqat bitta burchakda ishlaydi",
    'Пифагор работает только при одном угле',
    'Pythagoras works at one angle only',
  ),
  audio: [
    A('mount',
      "45-darsda Pifagor teoremasini chiqargandik: gipotenuzaning kvadrati katetlarning kvadratlari yig'indisiga teng.",
      'На 45 уроке мы вывели теорему Пифагора: квадрат гипотенузы равен сумме квадратов катетов.',
      'In lesson 45 we derived Pythagoras: the hypotenuse squared is the sum of the squares of the legs.'),
    A('why',
      "Lekin u faqat to'g'ri burchakda ishlaydi. Burchak oltmish daraja bo'lsa, tenglik buziladi.",
      'Но он работает только при прямом угле. Если угол шестьдесят градусов, равенство нарушится.',
      'But it holds only for a right angle. At sixty degrees the equality breaks.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('b = 7,   c = 6,   ∠A = 60°', 'b = 7,   c = 6,   ∠A = 60°', 'b = 7,   c = 6,   ∠A = 60°')}
      steps={[
        { id: 'a', head: L('Pifagor aytardi', 'Пифагор сказал бы', 'Pythagoras would say'), lines: ['a² = 49 + 36 = 85'] },
      ]}
      ask={L(
        "Haqiqiy a² 85 dan katta bo'ladimi yoki kichikmi?",
        'Настоящее a² будет больше 85 или меньше?',
        'Will the true a² be more than 85 or less?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Kichik', 'Меньше', 'Less') },
        {
          id: 'wrong',
          label: L('Katta', 'Больше', 'More'),
          hint: L(
            "Burchak to'qsondan oltmishga kamaydi, ya'ni B va C uchlari bir biriga yaqinlashdi. Yaqinlashgan uchlar orasidagi masofa esa qisqaradi.",
            'Угол уменьшился с девяноста до шестидесяти, то есть вершины B и C сблизились. А расстояние между сблизившимися вершинами короче.',
            'The angle shrank from ninety to sixty, so the vertices B and C drew closer. And closer vertices are less far apart.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Demak Pifagorning yig'indisidan biror narsa ayirilishi kerak, va u burchakka bog'liq bo'ladi.",
        'Верно. Значит из суммы Пифагора нужно что то вычесть, и это что то зависит от угла.',
        'Correct. So something must be taken from the Pythagorean sum, and that something depends on the angle.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — balandlik va Pifagor.
// ============================================================
const S3 = {
  eyebrow: L('BALANDLIK', 'ВЫСОТА', 'THE ALTITUDE'),
  title: L(
    "Uchburchakni to'g'ri burchakliga bo'lamiz",
    'Разрежем треугольник на прямоугольные',
    'Cut the triangle into right ones',
  ),
  audio: [
    A('mount',
      "B uchidan AC tomoniga BD balandlik tushiramiz. Endi ikkita to'g'ri burchakli uchburchak bor: ABD va BCD.",
      'Из вершины B опустим на сторону AC высоту BD. Теперь есть два прямоугольных треугольника: ABD и BCD.',
      'Drop the altitude BD from B to AC. Now there are two right triangles: ABD and BCD.'),
    A('why',
      "BCD uchburchakda Pifagor teoremasini yozamiz.",
      'В треугольнике BCD запишем теорему Пифагора.',
      'Write Pythagoras in the triangle BCD.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[6.56, 7, 6]}
          names={['A', 'B', 'C']}
          altitude
          footLab="D"
          altLab="h"
          angles={{ A: '60°' }}
        />
      }
      steps={[
        { id: 'a', head: L('BCD uchun', 'Для BCD', 'For BCD'), lines: ['BC² = BD² + DC²'] },
      ]}
      ask={L(
        "DC kesma nimaga teng?",
        'Чему равен отрезок DC?',
        'What does the segment DC equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'AC − AD' },
        {
          id: 'wrong',
          label: 'AC + AD',
          hint: L(
            "D nuqta A va C orasida yotibdi. Butun AC dan AD bo'lagini olib tashlasak, qolgani DC bo'ladi.",
            'Точка D лежит между A и C. Если из всего AC убрать кусок AD, останется DC.',
            'The point D lies between A and C. Take AD away from the whole AC and DC is left.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi qavsni ochamiz va ABD uchburchakdan ikkita tenglikni qo'shamiz.",
        'Верно. Теперь раскроем скобку и добавим два равенства из треугольника ABD.',
        'Correct. Now expand the bracket and bring in two equalities from ABD.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — AD = AB cos A.
// ============================================================
const S4 = {
  eyebrow: L('PROYEKSIYA', 'ПРОЕКЦИЯ', 'THE PROJECTION'),
  title: L(
    "Kosinus shu yerda kiradi",
    'Здесь и входит косинус',
    'Here the cosine enters',
  ),
  audio: [
    A('mount',
      "Qavsni ochsak, BC kvadrat teng BD kvadrat qo'shuv AC kvadrat ayirib ikki karra AC karra AD qo'shuv AD kvadrat chiqadi.",
      'Раскрыв скобку, получим BC квадрат равно BD квадрат плюс AC квадрат минус два AC на AD плюс AD квадрат.',
      'Expanding gives BC squared equals BD squared plus AC squared minus twice AC times AD plus AD squared.'),
    A('why',
      "BD kvadrat qo'shuv AD kvadrat bu ABD uchburchakdagi Pifagor, ya'ni AB kvadrat. AD ni esa 46-dars beradi.",
      'BD квадрат плюс AD квадрат это Пифагор в треугольнике ABD, то есть AB квадрат. А AD даёт 46 урок.',
      'BD squared plus AD squared is Pythagoras in ABD, that is AB squared. And AD comes from lesson 46.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "ABD to'g'ri burchakli,   ∠A — o'tkir",
        'ABD прямоугольный,   ∠A — острый',
        'ABD is right angled,   ∠A is acute',
      )}
      steps={[]}
      ask={L(
        "AD proyeksiya nimaga teng?",
        'Чему равна проекция AD?',
        'What does the projection AD equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'AB · cos A' },
        {
          id: 'wrong',
          label: 'AB · sin A',
          hint: L(
            "AD burchakka YONDOSH katet. 46-darsda yondosh katet gipotenuzaga kosinusni ko'paytirganga teng edi.",
            'AD это ПРИЛЕЖАЩИЙ к углу катет. На 46 уроке прилежащий катет равнялся гипотенузе на косинус.',
            'AD is the leg ADJACENT to the angle. In lesson 46 the adjacent leg was the hypotenuse times the cosine.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Almashtirib qo'ysak, BC kvadrat teng AB kvadrat qo'shuv AC kvadrat ayirib ikki karra AB karra AC karra kosinus A. Bu kosinuslar teoremasi.",
        'Верно. После подстановки BC квадрат равно AB квадрат плюс AC квадрат минус два AB на AC на косинус A. Это теорема косинусов.',
        'Correct. Substituting gives BC squared equals AB squared plus AC squared minus twice AB times AC times the cosine of A. That is the law of cosines.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — Pifagorning umumlashmasi.
// ============================================================
const S5 = {
  eyebrow: L('UMUMLASHMA', 'ОБОБЩЕНИЕ', 'A GENERALISATION'),
  title: L(
    "Pifagor bu yerda xususiy hol",
    'Пифагор здесь частный случай',
    'Pythagoras is a special case here',
  ),
  audio: [
    A('mount',
      "Formulaga to'qson darajani qo'yib ko'ramiz. Kosinus to'qson nolga teng.",
      'Подставим в формулу девяносто градусов. Косинус девяноста равен нулю.',
      'Put ninety degrees into the formula. The cosine of ninety is zero.'),
    A('why',
      "Nolga ko'paytirilgan qo'shiluvchi butunlay yo'qoladi.",
      'Слагаемое, умноженное на ноль, исчезает целиком.',
      'A term multiplied by zero disappears entirely.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a² = b² + c² − 2bc · cos 90°', 'a² = b² + c² − 2bc · cos 90°', 'a² = b² + c² − 2bc · cos 90°')}
      steps={[]}
      ask={L(
        "Qanday tenglik qoladi?",
        'Какое равенство останется?',
        'What equality is left?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'a² = b² + c²' },
        {
          id: 'wrong',
          label: 'a² = b² + c² − 2bc',
          hint: L(
            "Kosinus to'qson nolga teng, birga emas. Ikki bc karra nol nolni beradi.",
            'Косинус девяноста равен нулю, а не единице. Два bc на ноль даёт ноль.',
            'The cosine of ninety is zero, not one. Two bc times zero is zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, Pifagor teoremasi. Ya'ni bugungi teorema uni bekor qilmaydi, o'z ichiga oladi. O'tmas burchakda esa kosinus manfiy va uchinchi qo'shiluvchi qo'shiladi.",
        'Верно, теорема Пифагора. Значит сегодняшняя теорема её не отменяет, а вбирает в себя. А при тупом угле косинус отрицателен и третье слагаемое прибавляется.',
        'Correct, the theorem of Pythagoras. Today theorem does not cancel it but contains it. At an obtuse angle the cosine is negative and the third term is added.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning masalasi.
// ============================================================
const S6 = {
  eyebrow: L('XUKKA JAVOB', 'ОТВЕТ НА ХУК', 'ANSWERING THE HOOK'),
  title: L(
    "Birinchi masala yechiladi",
    'Первая задача решается',
    'The first problem gives way',
  ),
  audio: [
    A('mount',
      "Birinchi ekranga qaytamiz: AB olti, AC yetti, A burchagi oltmish daraja.",
      'Вернёмся к первому экрану: AB шесть, AC семь, угол A шестьдесят градусов.',
      'Back to the first screen: AB is six, AC is seven, the angle A sixty degrees.'),
    A('why',
      "Formulaga qo'yamiz: qirq to'qqiz qo'shuv o'ttiz olti ayirib sakson to'rt karra bir ikkidan.",
      'Подставим в формулу: сорок девять плюс тридцать шесть минус восемьдесят четыре на одну вторую.',
      'Substitute: forty nine plus thirty six minus eighty four times one half.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[6.56, 7, 6]}
          names={['A', 'B', 'C']}
          edges={{ c: '6', b: '7', a: '?' }}
          angles={{ A: '60°' }}
        />
      }
      steps={[
        { id: 'a', head: L('Hisob', 'Счёт', 'The count'), lines: ['a² = 49 + 36 − 84 · 0,5', 'a² = 43'] },
      ]}
      ask={L(
        "BC nechaga teng?",
        'Чему равно BC?',
        'What does BC equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '√43' },
        {
          id: 'wrong',
          label: '43',
          hint: L(
            "Qirq uch bu tomonning KVADRATI. Tomonning o'zi uchun ildiz olish kerak, u taxminan olti butun olti o'ndanga teng.",
            'Сорок три это КВАДРАТ стороны. Для самой стороны нужен корень, он примерно шесть целых шесть десятых.',
            'Forty three is the SQUARE of the side. The side itself needs a root, about six point six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Javob ildiz ostida qoladi va bu normal: darslikning javobi ham ildiz qirq uch.",
        'Верно. Ответ остаётся под корнем, и это нормально: в учебнике ответ тоже корень из сорока трёх.',
        'Correct. The answer stays under a root, and that is fine: the textbook answer is root forty three too.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — teskari formula.
// ============================================================
const S7 = {
  eyebrow: L('TESKARI YO\'NALISH', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER WAY'),
  title: L(
    "Uchta tomondan burchakka",
    'От трёх сторон к углу',
    'From three sides to an angle',
  ),
  audio: [
    A('mount',
      "Formulani kosinusga nisbatan yechsak, uchta tomondan burchakni topish mumkin bo'ladi.",
      'Если решить формулу относительно косинуса, по трём сторонам можно найти угол.',
      'Solving the formula for the cosine lets three sides give an angle.'),
    A('why',
      "Bunda kosinusning ISHORASI burchakning turini darhol aytib beradi.",
      'При этом ЗНАК косинуса сразу сообщает тип угла.',
      'And the SIGN of the cosine names the type of angle at once.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('cos A = (b² + c² − a²) : 2bc', 'cos A = (b² + c² − a²) : 2bc', 'cos A = (b² + c² − a²) : 2bc')}
      steps={[
        { id: 'a', head: L('Tomonlar 5, 6, 7', 'Стороны 5, 6, 7', 'Sides 5, 6, 7'), lines: ['cos A = (36 + 49 − 25) : 84', 'cos A = 5/7'] },
      ]}
      ask={L(
        "Kosinus musbat chiqdi. Bu nimani bildiradi?",
        'Косинус вышел положительным. Что это значит?',
        'The cosine came out positive. What does that mean?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Burchak o'tkir", 'Угол острый', 'The angle is acute') },
        {
          id: 'wrong',
          label: L("Burchak o'tmas", 'Угол тупой', 'The angle is obtuse'),
          hint: L(
            "46-darsni eslang: o'tmas burchakda kosinus manfiy edi. Musbat kosinus esa o'tkir burchakka tegishli.",
            'Вспомни 46 урок: при тупом угле косинус был отрицательным. А положительный косинус у острого угла.',
            'Recall lesson 46: an obtuse angle had a negative cosine. A positive cosine belongs to an acute angle.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Tomonlari besh, olti, yetti bo'lgan uchburchakda uchala kosinus ham musbat, demak u o'tkir burchakli. Sinuslar teoremasi bunday xulosani bera olmasdi: sinus ikkala turni ham musbat ko'rsatadi.",
        'Верно. У треугольника со сторонами пять, шесть, семь все три косинуса положительны, значит он остроугольный. Теорема синусов такого вывода дать не могла: синус в обоих случаях положителен.',
        'Correct. In the triangle with sides five, six and seven all three cosines are positive, so it is acute. The law of sines could not tell: the sine is positive either way.',
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
    'Geometriya 9, 29-dars (86-87-bet)',
    'Геометрия 9, урок 29 (стр. 86-87)',
    'Geometry 9, lesson 29 (p. 86-87)',
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
          "Kosinuslar teoremasi Pifagor teoremasini bekor qiladimi?",
          'Отменяет ли теорема косинусов теорему Пифагора?',
          'Does the law of cosines cancel the theorem of Pythagoras?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Yo'q, uni xususiy hol sifatida o'z ichiga oladi",
              'Нет, включает её как частный случай',
              'No, it contains it as a special case',
            ),
          },
          {
            id: 'wrong',
            label: L(
              "Ha, endi eskisi kerak emas",
              'Да, старая больше не нужна',
              'Yes, the old one is no longer needed',
            ),
            hint: L(
              "5-ekranni eslang: to'qson darajani qo'yganda aynan Pifagorning tengligi qoldi.",
              'Вспомни 5 экран: при подстановке девяноста осталось ровно равенство Пифагора.',
              'Recall screen 5: putting in ninety left exactly the Pythagorean equality.',
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
    "Pifagor va tuzatma",
    'Пифагор и поправка',
    'Pythagoras with a correction',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz teoremani balandlik orqali chiqardingiz va uni ikki tomonga ishlatdingiz.",
      'На семи экранах ты вывел теорему через высоту и применил её в обе стороны.',
      'On seven screens you derived the theorem through the altitude and used it both ways.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — tomonni topish.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Ikkita tomon va burchakdan uchinchisiga",
    'От двух сторон и угла к третьей',
    'From two sides and an angle to the third',
  ),
  audio: [
    A('mount',
      "Uchta masala. Darslikning yigirma to'qqiz nuqta ikkinchi mashqi.",
      'Три задачи. Задача двадцать девять точка два учебника.',
      'Three problems. Exercise twenty nine point two.'),
    A('why',
      "Har safar formulaga tomonlar ORASIDAGI burchakni qo'ying.",
      'Каждый раз подставляй в формулу угол МЕЖДУ сторонами.',
      'Each time put the angle BETWEEN the sides into the formula.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Ikkinchisida javob butun son chiqdi, chunki kosinus qirq besh ildiz ikkini qisqartirdi. Uchinchisida esa o'tmas burchak bo'lgani uchun qo'shiluvchi qo'shildi va javob eng katta chiqdi.",
      'Все три найдены. Во второй ответ получился целым, потому что косинус сорока пяти сократил корень из двух. А в третьей угол тупой, поэтому слагаемое прибавилось и ответ вышел наибольшим.',
      'All three are found. The second came out whole because the cosine of forty five cancelled the root of two. In the third the angle is obtuse, so the term was added and the answer came out largest.',
    ),
    tasks: [
      {
        expr: 'AC = 3,   BC = 4,   ∠C = 60°',
        question: L('AB nechaga teng?', 'Чему равно AB?', 'What does AB equal?'),
        ok: L("Ha, ildiz o'n uch. To'qqiz qo'shuv o'n olti ayirib o'n ikki.", 'Да, корень из тринадцати. Девять плюс шестнадцать минус двенадцать.', 'Yes, root thirteen. Nine plus sixteen minus twelve.'),
        items: [
          { id: 'a', right: true, label: '√13' },
          { id: 'b', label: '5', hint: L("Besh bu Pifagor bo'yicha javob, ya'ni burchak to'qson bo'lganda. Oltmish darajada esa o'n ikki ayiriladi.", 'Пять это ответ по Пифагору, то есть при угле девяносто. А при шестидесяти вычитается двенадцать.', 'Five is the Pythagorean answer, valid at ninety degrees. At sixty, twelve is subtracted.') },
        ],
        solution: ['AB² = 9 + 16 − 2 · 3 · 4 · 0,5', 'AB² = 13'],
      },
      {
        expr: 'AB = 4,   BC = 4√2,   ∠B = 45°',
        question: L('AC nechaga teng?', 'Чему равно AC?', 'What does AC equal?'),
        ok: L("Ha, to'rt. O'n olti qo'shuv o'ttiz ikki ayirib o'ttiz ikki.", 'Да, четыре. Шестнадцать плюс тридцать два минус тридцать два.', 'Yes, four. Sixteen plus thirty two minus thirty two.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '4√2', hint: L("Uchinchi qo'shiluvchini hisoblang: ikki karra to'rt karra to'rt ildiz ikki karra kosinus qirq besh. Kosinus qirq besh ildiz ikki bo'lingan ikkiga teng, ildizlar qisqaradi va o'ttiz ikki chiqadi.", 'Посчитай третье слагаемое: два на четыре на четыре корня из двух на косинус сорока пяти. Косинус сорока пяти это корень из двух пополам, корни сокращаются и выходит тридцать два.', 'Compute the third term: two times four times four root two times the cosine of forty five. That cosine is root two over two, the roots cancel and thirty two remains.') },
        ],
        solution: ['AC² = 16 + 32 − 32', 'AC² = 16,  AC = 4'],
      },
      {
        expr: 'b = 5,   c = 7,   ∠A = 120°',
        question: L('a nechaga teng?', 'Чему равно a?', 'What does a equal?'),
        ok: L(
          "Ha, ildiz bir yuz to'qqiz. Kosinus bir yuz yigirma manfiy bir ikkidan, shuning uchun o'ttiz besh qo'shildi.",
          'Да, корень из ста девяти. Косинус ста двадцати минус одна вторая, поэтому тридцать пять прибавилось.',
          'Yes, root one hundred nine. The cosine of one hundred twenty is minus one half, so thirty five was added.',
        ),
        items: [
          { id: 'a', right: true, label: '√109' },
          { id: 'b', label: '√39', hint: L("Ishoraga qarang: bir yuz yigirma o'tmas burchak, uning kosinusi manfiy. Manfiyni ayirish esa qo'shishga aylanadi.", 'Посмотри на знак: сто двадцать это тупой угол, его косинус отрицателен. А вычитание отрицательного превращается в сложение.', 'Watch the sign: one hundred twenty is obtuse and its cosine is negative. Subtracting a negative turns into adding.') },
        ],
        solution: ['a² = 25 + 49 − 70 · (−0,5)', 'a² = 74 + 35 = 109'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — burchakni topish.
// ============================================================
const S10 = {
  eyebrow: L('BURCHAK', 'УГОЛ', 'THE ANGLE'),
  title: L(
    "Uchta tomon burchakni aytib beradi",
    'Три стороны назовут угол',
    'Three sides name the angle',
  ),
  audio: [
    A('mount',
      "Endi uchala tomon ham ma'lum, burchakning kosinusini topish kerak.",
      'Теперь известны все три стороны, а найти нужно косинус угла.',
      'Now all three sides are known and the cosine of an angle is wanted.'),
    A('why',
      "Darslikning yigirma to'qqiz nuqta uchinchi mashqi.",
      'Задача двадцать девять точка три учебника.',
      'Exercise twenty nine point three.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Formulada suratdagi ayirilayotgan had har doim QIDIRILAYOTGAN burchakka qarshi turgan tomon bo'ladi, qolgan ikkitasi esa maxrajga tushadi.",
      'Обе найдены. В формуле вычитаемое в числителе это всегда сторона, лежащая против ИСКОМОГО угла, а две другие уходят в знаменатель.',
      'Both are found. In the formula the subtracted term is always the side facing the WANTED angle, while the other two go below.',
    ),
    tasks: [
      {
        expr: 'a = 5,   b = 6,   c = 7',
        question: L(
          "A burchakning kosinusi nechaga teng?",
          'Чему равен косинус угла A?',
          'What is the cosine of the angle A?',
        ),
        ok: L("Ha, besh yettidan. Oltmish bo'lingan sakson to'rt.", 'Да, пять седьмых. Шестьдесят на восемьдесят четыре.', 'Yes, five sevenths. Sixty over eighty four.'),
        items: [
          { id: 'a', right: true, label: '5/7' },
          { id: 'b', label: '1/5', hint: L("Bir beshdan bu C burchakning kosinusi. A burchagi beshga qarshi turibdi, demak suratdan yigirma besh ayiriladi.", 'Одна пятая это косинус угла C. Угол A лежит против пятёрки, значит из числителя вычитают двадцать пять.', 'One fifth is the cosine of C. The angle A faces the five, so twenty five is what gets subtracted.') },
        ],
        solution: ['cos A = (36 + 49 − 25) : 84', 'cos A = 60 : 84 = 5/7'],
      },
      {
        expr: 'a = 5,   b = 6,   c = 7',
        question: L(
          "C burchakning kosinusi nechaga teng?",
          'Чему равен косинус угла C?',
          'What is the cosine of the angle C?',
        ),
        ok: L("Ha, bir beshdan. O'n ikki bo'lingan oltmish.", 'Да, одна пятая. Двенадцать на шестьдесят.', 'Yes, one fifth. Twelve over sixty.'),
        items: [
          { id: 'a', right: true, label: '1/5' },
          { id: 'b', label: '5/7', hint: L("Besh yettidan bu A burchakning kosinusi edi. C burchagi yettiga qarshi turibdi, demak suratdan qirq to'qqiz ayiriladi.", 'Пять седьмых был косинус угла A. Угол C лежит против семёрки, значит вычитают сорок девять.', 'Five sevenths was the cosine of A. The angle C faces the seven, so forty nine is subtracted.') },
        ],
        solution: ['cos C = (25 + 36 − 49) : 60', 'cos C = 12 : 60 = 1/5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — parallelogramm.
// ============================================================
const S11 = {
  eyebrow: L('PARALLELOGRAMM', 'ПАРАЛЛЕЛОГРАММ', 'A PARALLELOGRAM'),
  title: L(
    "Ikkita diagonal, ikkita burchak",
    'Две диагонали, два угла',
    'Two diagonals, two angles',
  ),
  audio: [
    A('mount',
      "Parallelogrammning tomonlari besh va yetti, bir burchagi esa bir yuz yigirma daraja. Diagonallarini topish kerak.",
      'Стороны параллелограмма пять и семь, а один из углов сто двадцать градусов. Нужно найти диагонали.',
      'A parallelogram has sides five and seven with one angle of one hundred twenty degrees. Find the diagonals.'),
    A('why',
      "Har bir diagonal o'z uchburchagida uchinchi tomon bo'ladi. Burchaklar esa qo'shni, ya'ni bir yuz yigirma va oltmish.",
      'Каждая диагональ в своём треугольнике третья сторона. А углы смежные, то есть сто двадцать и шестьдесят.',
      'Each diagonal is the third side of its own triangle. The angles are supplementary, one hundred twenty and sixty.'),
  ],
  props: {
    stepLabel: L('Diagonal', 'Диагональ', 'Diagonal'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Katta diagonal o'tmas burchakka, kichigi esa o'tkir burchakka qarshi yotadi — bu darslikning yigirma to'qqiz nuqta oltinchi mashqi.",
      'Обе найдены. Большая диагональ лежит против тупого угла, меньшая против острого — это задача двадцать девять точка шесть учебника.',
      'Both are found. The longer diagonal faces the obtuse angle and the shorter the acute one; this is exercise twenty nine point six.',
    ),
    tasks: [
      {
        expr: '5,   7,   ∠ = 120°',
        question: L(
          "Bu burchakka qarshi yotgan diagonal nechaga teng?",
          'Чему равна диагональ против этого угла?',
          'What is the diagonal facing that angle?',
        ),
        ok: L("Ha, ildiz bir yuz to'qqiz, taxminan o'n butun to'rt o'ndan.", 'Да, корень из ста девяти, примерно десять целых четыре десятых.', 'Yes, root one hundred nine, about ten point four.'),
        items: [
          { id: 'a', right: true, label: '√109' },
          { id: 'b', label: '√39', hint: L("Ildiz o'ttiz to'qqiz kichik diagonal, u OLTMISH darajaga qarshi yotadi. Bir yuz yigirma darajada esa kosinus manfiy.", 'Корень из тридцати девяти это малая диагональ, она лежит против ШЕСТИДЕСЯТИ градусов. А при ста двадцати косинус отрицателен.', 'Root thirty nine is the shorter diagonal, facing SIXTY degrees. At one hundred twenty the cosine is negative.') },
        ],
        solution: ['d² = 25 + 49 + 35', 'd² = 109'],
      },
      {
        expr: '5,   7,   ∠ = 60°',
        question: L(
          "Ikkinchi diagonal nechaga teng?",
          'Чему равна вторая диагональ?',
          'What is the other diagonal?',
        ),
        ok: L("Ha, ildiz o'ttiz to'qqiz, taxminan olti butun ikki o'ndan.", 'Да, корень из тридцати девяти, примерно шесть целых две десятых.', 'Yes, root thirty nine, about six point two.'),
        items: [
          { id: 'a', right: true, label: '√39' },
          { id: 'b', label: '√74', hint: L("Yetmish to'rt bu faqat kvadratlarning yig'indisi, ya'ni to'qson darajadagi javob. Oltmish darajada undan o'ttiz besh ayiriladi.", 'Семьдесят четыре это только сумма квадратов, то есть ответ при девяноста градусах. При шестидесяти из неё вычитают тридцать пять.', 'Seventy four is just the sum of the squares, the answer at ninety degrees. At sixty, thirty five is taken off.') },
        ],
        solution: ['d² = 25 + 49 − 35', 'd² = 39'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — ishorani unutish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "O'tmas burchakda ishora almashadi",
    'При тупом угле знак меняется',
    'At an obtuse angle the sign flips',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Tomonlar besh va yetti, burchak bir yuz yigirma daraja. U kosinusni nol butun besh o'ndan deb olgan va javobni ildiz o'ttiz to'qqiz deb yozgan.",
      'Решение Камрона. Стороны пять и семь, угол сто двадцать градусов. Он взял косинус равным ноль целых пяти десятым и записал ответ корень из тридцати девяти.',
      "Kamron's solution. The sides are five and seven with an angle of one hundred twenty degrees. He took the cosine as zero point five and wrote root thirty nine."),
    A('why',
      "Javobni hisoblamasdan tekshirish mumkin. O'ttiz to'qqizning ildizi olti butun ikki o'ndanga yaqin.",
      'Ответ можно проверить, не считая. Корень из тридцати девяти около шести целых двух десятых.',
      'The answer can be checked without computing. Root thirty nine is about six point two.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "O'tmas burchakka uchburchakning eng uzun tomoni qarshi yotishi kerak, Kamronning javobi esa yettidan ham qisqa. Sabab bitta: bir yuz yigirma darajaning kosinusi manfiy bir ikkidan, shuning uchun uchinchi qo'shiluvchi ayirilmaydi, balki qo'shiladi. To'g'ri javob ildiz bir yuz to'qqiz, ya'ni taxminan o'n butun to'rt o'ndan.",
      'Против тупого угла должна лежать самая длинная сторона треугольника, а ответ Камрона короче даже семи. Причина одна: косинус ста двадцати равен минус одной второй, поэтому третье слагаемое не вычитается, а прибавляется. Верный ответ корень из ста девяти, примерно десять целых четыре десятых.',
      'The longest side must face the obtuse angle, yet Kamron answer is shorter even than seven. One reason: the cosine of one hundred twenty is minus one half, so the third term is added, not subtracted. The right answer is root one hundred nine, about ten point four.',
    ),
    tasks: [
      {
        expr: 'b = 5,   c = 7,   ∠A = 120°   →   a = √39 ?',
        question: L(
          "Bir yuz yigirma darajaning kosinusi nechaga teng?",
          'Чему равен косинус ста двадцати градусов?',
          'What is the cosine of one hundred twenty degrees?',
        ),
        ok: L(
          "To'g'ri, manfiy bir ikkidan. Demak uchinchi qo'shiluvchi qo'shiladi va javob ildiz bir yuz to'qqiz.",
          'Верно, минус одна вторая. Значит третье слагаемое прибавляется, и ответ корень из ста девяти.',
          'Correct, minus one half. So the third term is added and the answer is root one hundred nine.',
        ),
        items: [
          { id: 'a', right: true, label: '−0,5' },
          {
            id: 'b',
            label: '0,5',
            hint: L(
              "46-darsni eslang: kosinus o'tmas burchakda manfiy edi, chunki nuqta chap yarim tekislikka o'tadi. Bir yuz yigirma esa o'tmas burchak.",
              'Вспомни 46 урок: при тупом угле косинус отрицателен, ведь точка уходит в левую полуплоскость. А сто двадцать это тупой угол.',
              'Recall lesson 46: an obtuse angle has a negative cosine, since the point moves into the left half plane. One hundred twenty is obtuse.',
            ),
          },
        ],
        solution: [
          'a² = 25 + 49 − 70 · (−0,5)',
          'a² = 109,   a ≈ 10,4',
          L('Kamron: 74 − 35 = 39', 'Камрон: 74 − 35 = 39', 'Kamron: 74 − 35 = 39'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — 43-darsning qarzi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "43-darsda qoldirilgan isbot",
    'Доказательство, отложенное с 43 урока',
    'The proof left over from lesson 43',
  ),
  audio: [
    A('mount',
      "43-darsda skalyar ko'paytma burchak orqali berilgandi. O'shanda aytilgandi, koordinatali formulaning isboti kosinuslar teoremasidan keyin bo'ladi. Endi u bor.",
      'На 43 уроке скалярное произведение дали через угол. Тогда было сказано, что доказательство координатной формулы будет после теоремы косинусов. Теперь она есть.',
      'In lesson 43 the scalar product came through the angle. We said then that the coordinate formula would be proved after the law of cosines. Now we have it.'),
    A('why',
      "Ikkita vektorni koordinata boshidan qo'yamiz va uchlarini tutashtiramiz. Hosil bo'lgan uchburchakka teoremani qo'llaymiz.",
      'Отложим два вектора из начала координат и соединим их концы. К получившемуся треугольнику применим теорему.',
      'Place two vectors at the origin and join their tips. Apply the theorem to the triangle that appears.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Shu bilan ikkita ta'rif bitta ekani isbotlandi. 8-sinfning koordinatali formulasi va 9-sinfning burchakli ta'rifi bir xil sonni beradi, va ularni bog'lagan narsa aynan kosinuslar teoremasi bo'ldi. Darslik ham xuddi shu yo'ldan boradi.",
      'Тем самым доказано, что два определения это одно. Координатная формула 8 класса и угловое определение 9 класса дают одно и то же число, а связала их именно теорема косинусов. Учебник идёт этим же путём.',
      'This proves the two definitions are one. The coordinate formula of grade eight and the angle definition of grade nine give the same number, and the law of cosines is what joined them. The textbook takes the same route.',
    ),
    tasks: [
      {
        expr: 'a(3; 1),   b(2; 4)',
        question: L(
          "Uchlar orasidagi masofaning kvadrati nechaga teng?",
          'Чему равен квадрат расстояния между концами?',
          'What is the square of the distance between the tips?',
        ),
        ok: L(
          "Ha, o'n. Ikki ayirib uch minus bir, to'rt ayirib bir uch, bir qo'shuv to'qqiz o'n.",
          'Да, десять. Два минус три это минус один, четыре минус один три, один плюс девять десять.',
          'Yes, ten. Two minus three is minus one, four minus one is three, one plus nine is ten.',
        ),
        items: [
          { id: 'a', right: true, label: '10' },
          {
            id: 'b',
            label: '30',
            hint: L(
              "Masofani koordinatalarning AYIRMASI orqali hisoblang: minus birning kvadrati bir, uchning kvadrati to'qqiz.",
              'Считай расстояние через РАЗНОСТИ координат: минус один в квадрате один, три в квадрате девять.',
              'Use the DIFFERENCES of the coordinates: minus one squared is one, three squared is nine.',
            ),
          },
        ],
        solution: ['AB² = (2 − 3)² + (4 − 1)²', 'AB² = 1 + 9 = 10'],
      },
      {
        expr: '|a|² = 10,   |b|² = 20,   AB² = 10',
        question: L(
          "Kosinuslar teoremasidan skalyar ko'paytma nechaga teng?",
          'Чему равно скалярное произведение по теореме косинусов?',
          'By the law of cosines, what is the scalar product?',
        ),
        ok: L(
          "Ha, o'n. Va koordinatali formula ham o'n beradi: uch karra ikki qo'shuv bir karra to'rt.",
          'Да, десять. И координатная формула даёт десять: три на два плюс один на четыре.',
          'Yes, ten. And the coordinate formula gives ten too: three times two plus one times four.',
        ),
        items: [
          { id: 'a', right: true, label: '10' },
          {
            id: 'b',
            label: '20',
            hint: L(
              "Teoremani skalyar ko'paytmaga nisbatan yeching: u yig'indidan masofaning kvadratini ayirib, ikkiga bo'lganga teng.",
              'Реши теорему относительно скалярного произведения: это сумма минус квадрат расстояния, делённое пополам.',
              'Solve the theorem for the scalar product: it is the sum minus the squared distance, halved.',
            ),
          },
        ],
        solution: [
          '(a, b) = (10 + 20 − 10) : 2 = 10',
          'a₁b₁ + a₂b₂ = 3 · 2 + 1 · 4 = 10',
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
    "Blits: ishora, ikkilik, qaysi burchak",
    'Блиц: знак, двойка, какой угол',
    'Blitz: the sign, the two, which angle',
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
        tag: 'notogri-burchak-tanlash',
        ask: L(
          "Formulaga qaysi burchak qo'yiladi?",
          'Какой угол подставляют в формулу?',
          'Which angle goes into the formula?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Ma'lum ikkita tomon orasidagi", 'Между двумя известными сторонами', 'The one between the two known sides'),
          },
          {
            id: 'w',
            label: L("Istalgan ma'lum burchak", 'Любой известный угол', 'Any known angle'),
          },
        ],
        ok: L(
          "To'g'ri. Formulada qidirilayotgan tomon shu burchakka qarshi turadi.",
          'Верно. Искомая сторона в формуле лежит против этого угла.',
          'Correct. The wanted side faces that very angle.',
        ),
        hint: L(
          "1-ekranni eslang: masalada aynan tomonlar orasidagi burchak berilgandi, shuning uchun sinuslar teoremasi ishlamagandi.",
          'Вспомни 1 экран: в задаче дан был именно угол между сторонами, поэтому теорема синусов и не работала.',
          'Recall screen 1: the problem gave the angle between the sides, which is why the law of sines failed.',
        ),
      },
      {
        id: 'q2',
        tag: 'otmas-burchak-ishorasi',
        ask: L(
          "O'tmas burchakda uchinchi qo'shiluvchi qanday ishlaydi?",
          'Как работает третье слагаемое при тупом угле?',
          'How does the third term behave at an obtuse angle?',
        ),
        options: [
          { id: 'r', right: true, label: L("Qo'shiladi", 'Прибавляется', 'It is added') },
          { id: 'w', label: L('Ayiriladi', 'Вычитается', 'It is subtracted') },
        ],
        ok: L(
          "To'g'ri. Kosinus manfiy, manfiyni ayirish esa qo'shishga aylanadi.",
          'Верно. Косинус отрицателен, а вычитание отрицательного превращается в сложение.',
          'Correct. The cosine is negative, and subtracting a negative turns into adding.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron aynan shu ishorani unutib, o'n to'rt o'rniga olti butun ikki o'ndan olgandi.",
          'Вспомни 12 экран: Камрон упустил именно этот знак и получил шесть целых две десятых вместо десяти целых четырёх.',
          'Recall screen 12: Kamron lost that sign and got six point two instead of ten point four.',
        ),
      },
      {
        id: 'q3',
        tag: 'ikkilangan-kopaytmani-unutish',
        ask: L(
          "A = 90° bo'lganda formuladan nima qoladi?",
          'Что остаётся от формулы при A = 90°?',
          'What is left of the formula at A = 90°?',
        ),
        options: [
          { id: 'r', right: true, label: L('Pifagor teoremasi', 'Теорема Пифагора', 'The theorem of Pythagoras') },
          { id: 'w', label: L('Sinuslar teoremasi', 'Теорема синусов', 'The law of sines') },
        ],
        ok: L(
          "To'g'ri. Kosinus to'qson nolga teng va uchinchi qo'shiluvchi yo'qoladi.",
          'Верно. Косинус девяноста равен нулю, и третье слагаемое исчезает.',
          'Correct. The cosine of ninety is zero and the third term vanishes.',
        ),
        hint: L(
          "5-ekranni eslang: teorema Pifagorni bekor qilmaydi, o'z ichiga oladi.",
          'Вспомни 5 экран: теорема не отменяет Пифагора, а вбирает его.',
          'Recall screen 5: the theorem does not cancel Pythagoras but contains him.',
        ),
      },
      {
        id: 'q4',
        tag: 'ildizni-unutish',
        ask: L(
          "Formuladan chiqqan son nima bo'ladi?",
          'Чем является число, вышедшее из формулы?',
          'What is the number the formula produces?',
        ),
        options: [
          { id: 'r', right: true, label: L("Tomonning kvadrati", 'Квадратом стороны', 'The square of the side') },
          { id: 'w', label: L("Tomonning o'zi", 'Самой стороной', 'The side itself') },
        ],
        ok: L(
          "To'g'ri. Javobda ildiz olishni unutmang.",
          'Верно. Не забудь в ответе взять корень.',
          'Correct. Do not forget the root in the answer.',
        ),
        hint: L(
          "6-ekranni eslang: qirq uch chiqqandi, javob esa ildiz qirq uch edi.",
          'Вспомни 6 экран: вышло сорок три, а ответом был корень из сорока трёх.',
          'Recall screen 6: forty three came out and the answer was root forty three.',
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
    "Pifagor va uning tuzatmasi",
    'Пифагор и поправка к нему',
    'Pythagoras and his correction',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda sinuslar teoremasi ishlamasdi, chunki tomon va uning qarshi burchagi juftligi yo'q edi.",
      'На первом экране теорема синусов не работала, потому что не было пары из стороны и её угла.',
      'On the first screen the law of sines failed for want of a side paired with its angle.'),
    A('s1',
      "Siz balandlik orqali yangi teoremani chiqardingiz, uni ikki tomonga ishlatdingiz va 43-darsdagi qarzni uzdingiz.",
      'Ты вывел через высоту новую теорему, применил её в обе стороны и закрыл долг 43 урока.',
      'You derived a new theorem through the altitude, used it both ways, and settled the debt of lesson 43.'),
    A('s2',
      "Keyingi darsda uchburchaklarni yechish: ikkala teorema birga ishlaydi.",
      'В следующем уроке решение треугольников: обе теоремы работают вместе.',
      'The next lesson solves triangles with both theorems at once.'),
  ],
  props: {
    mark: 'a² = b² + c² − 2bc · cos A',
    markNote: L(
      "cos 90° = 0 bo'lganda Pifagor qoladi",
      'при cos 90° = 0 остаётся Пифагор',
      'at cos 90° = 0 Pythagoras remains',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: uchburchaklarni yechish',
      'Следующий урок: решение треугольников',
      'Next lesson: solving triangles',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'notogri-burchak-tanlash', ...S2 },
  { role: 'explain',  tag: 'notogri-burchak-tanlash', ...S3 },
  { role: 'explain',  tag: 'ikkilangan-kopaytmani-unutish', ...S4 },
  { role: 'explain',  tag: 'ikkilangan-kopaytmani-unutish', ...S5 },
  { role: 'explain',  tag: 'ildizni-unutish', ...S6 },
  { role: 'explain',  tag: 'otmas-burchak-ishorasi', ...S7 },
  { role: 'rule',     tag: 'ikkilangan-kopaytmani-unutish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'otmas-burchak-ishorasi', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'notogri-burchak-tanlash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'otmas-burchak-ishorasi', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'otmas-burchak-ishorasi', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ikkilangan-kopaytmani-unutish', ...S13 },
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
