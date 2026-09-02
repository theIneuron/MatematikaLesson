// ============================================================================
// 9-sinf, Dars 35. FIGURALARNING O'XSHASHLIGI. GEOMETRIYA BLOKI BOSHI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 6-dars (28-29-bet),
// 7-dars (30-31), 8-dars (32-33).
//   6-dars: ikkita ko'pburchak o'xshash deyiladi, agar mos burchaklari
//       teng VA mos tomonlari proporsional bo'lsa. Ikkala shart ham
//       kerak. O'xshashlik koeffitsienti k.
//       1-masala: x/6 = 1/3 → x = 2.
//       2-masala: tomoni 1 bo'lgan kvadrat va tomonlari 2 va 1 bo'lgan
//       to'rtburchak — burchaklari teng (hammasi 90°), lekin tomonlari
//       proporsional emas, demak O'XSHASH EMAS.
//   7-dars: perimetrlar nisbati k ga, YUZLAR nisbati esa k KVADRATIGA
//       teng (teorema isboti bilan).
//   8-dars: uchburchaklar o'xshashligining birinchi alomati — ikkita
//       burchak yetarli.
//
// DARSNING ASOSIY G'OYASI IKKITA QARAMA-QARSHI MISOLDA. Ta'rifda ikkita
// shart bor, va bola odatda bittasini yetarli deb hisoblaydi. Shuning
// uchun dars ikkita AKSILMISOL bilan boshlanadi:
//   xuk — burchaklar teng, tomonlar proporsional emas (darslikning
//         2-masalasi: kvadrat va cho'zilgan to'rtburchak);
//   3-ekran — tomonlar proporsional, burchaklar teng emas (darslikning
//         2-rasmidagi romblar).
// Ikkita ko'zgu misol ta'rifni bahssiz qiladi. Keyin uchburchaklar
// uchun yengillik ko'rsatiladi: u yerda ikkita burchak YETARLI, chunki
// uchinchisi o'z-o'zidan chiqadi va tomonlar ham ergashadi.
//
// TUZOQ (12-ekran): yuzlar nisbatini k deb olish. Bu geometriyaning
// eng qadimgi xatosi. Ekran uni sanash bilan yiqitadi: k = 3 bo'lsa,
// katta figuraga kichigidan TO'QQIZTA sig'adi, uchta emas.
//
// YANGI ASBOB YO'Q, lekin YANGI CHIZMA bor: `PolyPair` (asboblar.jsx,
// 7G) va `RecallMC` ning `figure` sloti. Sinf qoidasi bo'yicha asbob
// yangi HARAKATGA beriladi, bu yerda harakat o'sha — variantni tanlash,
// yangisi faqat ko'rish kerakligi. Shuning uchun asbob emas, mavjud
// asbobga chizma sloti ochildi. Bu butun geometriya bloki (35-52) uchun
// ishlaydi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, PolyPair, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-35',
  n: 35,
  row: 35,
  block: 'Б7',
  topic: L(
    "Figuralarning o'xshashligi",
    'Подобие фигур',
    'Similarity of figures',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "O'xshashlik uchun IKKALA shart kerak: burchaklar teng va tomonlar proporsional",
    'Для подобия нужны ОБА условия: углы равны и стороны пропорциональны',
    'Similarity needs BOTH conditions: equal angles and proportional sides',
  ),
  L(
    "Uchburchaklar uchun ikkita burchakning tengligi yetarli",
    'Для треугольников достаточно равенства двух углов',
    'For triangles two equal angles are enough',
  ),
  L(
    "Perimetrlar nisbati k ga, yuzlar nisbati esa k kvadratiga teng",
    'Отношение периметров равно k, а отношение площадей k в квадрате',
    'Perimeters are in ratio k, and areas in ratio k squared',
  ),
]

export const MISS = {
  'bitta-shart-yetarli-emas': {
    what: L(
      "o'xshashlik uchun bitta shart yetarli deb hisoblandi",
      'сочтено, что для подобия достаточно одного условия',
      'one condition was taken as enough for similarity',
    ),
    wrong: null,
    at: 0,
  },
  'yuzlar-nisbati-kvadrat': {
    what: L(
      "yuzlar nisbati k kvadratiga emas, k ga teng deb olindi",
      'отношение площадей принято равным k, а не k в квадрате',
      'the ratio of areas was taken as k instead of k squared',
    ),
    wrong: null,
    at: 0,
  },
  'mos-tomonlarni-adashtirish': {
    what: L(
      "nisbat tuzishda mos bo'lmagan tomonlar olindi",
      'в отношение взяты не соответственные стороны',
      'non corresponding sides were used in the ratio',
    ),
    wrong: null,
    at: 0,
  },
  'uchburchakda-ikki-burchak': {
    what: L(
      "uchburchakda ikkita burchak yetarli ekani ishlatilmadi",
      'не использовано, что в треугольнике достаточно двух углов',
      'the fact that two angles suffice in a triangle was not used',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 2-masalasi.
// ============================================================
const SQ = { pts: [[0, 0], [0, 1], [1, 1], [1, 0]], sides: ['1', '1', '1', '1'] }
const RECT = { pts: [[0, 0], [0, 1], [2, 1], [2, 0]], sides: ['1', '2', '1', '2'] }

const S1 = {
  eyebrow: L('HAMMA BURCHAK TENG', 'ВСЕ УГЛЫ РАВНЫ', 'ALL ANGLES EQUAL'),
  title: L(
    "Kvadrat va cho'zilgan to'rtburchak",
    'Квадрат и вытянутый прямоугольник',
    'A square and a stretched rectangle',
  ),
  audio: [
    A('mount',
      "Chapda tomoni bir bo'lgan kvadrat, o'ngda tomonlari bir va ikki bo'lgan to'rtburchak.",
      'Слева квадрат со стороной один, справа прямоугольник со сторонами один и два.',
      'On the left a square of side one, on the right a rectangle with sides one and two.'),
    A('why',
      "Ikkalasining ham hamma burchagi to'qson gradus, ya'ni burchaklari mos ravishda teng. Ular o'xshashmi?",
      'У обоих все углы по девяносто градусов, то есть углы соответственно равны. Подобны ли они?',
      'Both have every angle at ninety degrees, so their angles match. Are they similar?'),
  ],
  // XUKDA CHIZMA SHART: «tomoni 1 bo'lgan kvadrat va 2×1 to'rtburchak»
  // ni so'z bilan taqqoslab bo'lmaydi. Umumiy `PickBroken` chizma
  // olmaydi (u 8-sinf bilan bo'lishilgan), shuning uchun bu yerda
  // `RecallMC` ning chizma sloti ishlatiladi — savol va variantlar
  // shakli o'zgarmaydi, sinf qoidasi buzilmaydi.
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={SQ} b={RECT} sameScale />}
      steps={[]}
      ask={L(
        "Burchaklari teng. Bu figuralar o'xshashmi?",
        'Углы равны. Подобны ли эти фигуры?',
        'The angles are equal. Are these figures similar?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Yo'q: bir tomon bir xil qolgan, ikkinchisi ikki barobar cho'zilgan",
            'Нет: одна сторона осталась прежней, другая растянулась вдвое',
            'No: one side stayed the same while the other doubled',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Ha: burchaklari teng bo'lsa, figuralar o'xshash",
            'Да: если углы равны, фигуры подобны',
            'Yes: equal angles make figures similar',
          ),
          hint: L(
            "Nisbatlarni tuzing: bir bo'lingan bir birga teng, bir bo'lingan ikki esa yarimga. Ular bir xil emas, demak tomonlar proporsional emas.",
            'Составь отношения: один делить на один равно единице, а один делить на два равно половине. Они не совпадают, значит стороны не пропорциональны.',
            'Form the ratios: one over one is one, and one over two is a half. They differ, so the sides are not proportional.',
          ),
        },
      ]}
      after={L(
        "Ha. Burchaklarning tengligi yetarli emas. Bugun ko'ramizki, o'xshashlik uchun ikkita shart kerak, va ikkinchisi ham xuddi shunday muhim.",
        'Да. Равенства углов недостаточно. Сегодня увидим, что для подобия нужны два условия, и второе не менее важно.',
        'Yes. Equal angles are not enough. Today we see that similarity needs two conditions, and the second matters just as much.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — proporsionallik.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Proporsional degani nima",
    'Что значит пропорциональны',
    'What proportional means',
  ),
  audio: [
    A('mount',
      "Tomonlar proporsional deyiladi, agar ularning nisbatlari bir xil son bersa.",
      'Стороны называют пропорциональными, если их отношения дают одно и то же число.',
      'Sides are called proportional when their ratios all give the same number.'),
    A('why',
      "Tomonlari uch va besh bo'lgan figura va tomonlari olti va o'n bo'lgan figurani solishtiring.",
      'Сравни фигуру со сторонами три и пять и фигуру со сторонами шесть и десять.',
      'Compare a figure with sides three and five with one having sides six and ten.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3 va 5    →    6 va 10', '3 и 5    →    6 и 10', '3 and 5    →    6 and 10')}
      steps={[]}
      ask={L(
        "Bu tomonlar proporsionalmi?",
        'Пропорциональны ли эти стороны?',
        'Are these sides proportional?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ha, k = 2', 'Да, k = 2', 'Yes, k = 2') },
        {
          id: 'wrong',
          label: L("Yo'q", 'Нет', 'No'),
          hint: L(
            "Nisbatlarni hisoblang: olti bo'lingan uch ikkiga teng, o'n bo'lingan besh ham ikkiga. Ikkalasi bir xil son berdi.",
            'Посчитай отношения: шесть делить на три равно двум, десять делить на пять тоже два. Оба дали одно число.',
            'Compute the ratios: six over three is two, and ten over five is two as well. Both gave the same number.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu son o'xshashlik koeffitsienti deyiladi va k harfi bilan belgilanadi. Bu yerda k ikkiga teng.",
        'Верно. Это число называют коэффициентом подобия и обозначают буквой k. Здесь k равно двум.',
        'Correct. This number is called the similarity factor, written k. Here k equals two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — teskari aksilmisol: romblar.
// ============================================================
const RH1 = { pts: [[0, 0], [0.5, 1], [1.5, 1], [1, 0]], sides: ['a', '', 'a', ''] }
const RH2 = { pts: [[0, 0], [0.85, 0.55], [1.85, 0.55], [1, 0]], sides: ['a', '', 'a', ''] }

const S3 = {
  eyebrow: L('ENDI TESKARISI', 'ТЕПЕРЬ НАОБОРОТ', 'NOW THE REVERSE'),
  title: L(
    "Tomonlar proporsional, burchaklar esa yo'q",
    'Стороны пропорциональны, а углы нет',
    'Proportional sides but unequal angles',
  ),
  audio: [
    A('mount',
      "Ikkita romb. Rombning barcha tomonlari teng, demak ularning tomonlari har doim proporsional.",
      'Два ромба. У ромба все стороны равны, значит их стороны всегда пропорциональны.',
      'Two rhombi. A rhombus has all sides equal, so their sides are always proportional.'),
    A('why',
      "Lekin biri tik, ikkinchisi yotiq. Ularning burchaklari boshqacha.",
      'Но один прямой, а другой приплюснутый. Углы у них разные.',
      'But one stands upright and the other is flattened. Their angles differ.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={RH1} b={RH2} marks={L('tomonlari teng', 'стороны равны', 'equal sides')} />}
      steps={[]}
      ask={L(
        "Tomonlari proporsional. Bu romblar o'xshashmi?",
        'Стороны пропорциональны. Подобны ли эти ромбы?',
        'The sides are proportional. Are these rhombi similar?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Yo'q", 'Нет', 'No') },
        {
          id: 'wrong',
          label: L('Ha', 'Да', 'Yes'),
          hint: L(
            "Ikkinchi romb yassilangan, uning o'tkir burchagi ancha kichik. Burchaklar esa teng bo'lishi shart edi.",
            'Второй ромб приплюснут, его острый угол заметно меньше. А углы должны быть равны.',
            'The second rhombus is flattened and its acute angle is much smaller. But the angles were required to be equal.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Xukda burchaklar teng edi, tomonlar esa yo'q. Bu yerda aksincha. Ikkala holatda ham figuralar o'xshash emas, demak ta'rifda ikkala shart ham kerak.",
        'Верно. В хуке углы были равны, а стороны нет. Здесь наоборот. В обоих случаях фигуры не подобны, значит в определении нужны оба условия.',
        'Correct. In the opening the angles matched but the sides did not. Here it is the other way round. Neither pair is similar, so the definition needs both conditions.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — koeffitsient va noma'lum tomon.
// ============================================================
const P1 = { pts: [[0, 0], [0.35, 1], [1.35, 1], [1, 0]], sides: ['6', '', 'x', ''] }
const P2 = { pts: [[0, 0], [0.35, 1], [1.35, 1], [1, 0]], sides: ['3', '', '1', ''] }

const S4 = {
  eyebrow: L('KOEFFITSIENT ISHLAYDI', 'КОЭФФИЦИЕНТ В ДЕЛЕ', 'THE FACTOR AT WORK'),
  title: L(
    "Noma'lum tomonni topish",
    'Находим неизвестную сторону',
    'Finding an unknown side',
  ),
  audio: [
    A('mount',
      "Bu ikkita ko'pburchak o'xshash. Kichigining tomonlari uch va bir, kattasiniki esa olti va noma'lum.",
      'Эти два многоугольника подобны. У меньшего стороны три и один, у большего шесть и неизвестная.',
      'These two polygons are similar. The smaller has sides three and one, the larger six and an unknown.'),
    A('why',
      "Nisbatlar teng bo'lishi kerak. Olti bo'lingan uch nechaga teng?",
      'Отношения должны быть равны. Чему равно шесть делить на три?',
      'The ratios must be equal. What is six over three?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={P1} b={P2} sameScale={false} />}
      steps={[
        { id: 'a', head: L('Koeffitsient', 'Коэффициент', 'The factor'), lines: ['6 : 3 = 2'] },
      ]}
      ask={L(
        "Noma'lum tomon nechaga teng?",
        'Чему равна неизвестная сторона?',
        'What does the unknown side equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'x = 2' },
        {
          id: 'wrong',
          label: 'x = 3',
          hint: L(
            "Uch bu KICHIK figuraning boshqa tomoni. Noma'lum tomon esa bittaning ikki barobari bo'lishi kerak, chunki koeffitsient ikki.",
            'Три это другая сторона МАЛОЙ фигуры. А неизвестная сторона должна быть вдвое больше единицы, ведь коэффициент два.',
            'Three is the other side of the SMALL figure. The unknown side must be twice one, since the factor is two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Har bir tomon ikki barobar kattaradi, demak bitta ikkiga aylanadi. Bu darslikning birinchi masalasi.",
        'Верно. Каждая сторона увеличивается вдвое, значит единица становится двойкой. Это первая задача учебника.',
        'Correct. Every side doubles, so one becomes two. This is the first problem in the textbook.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — uchburchak uchun yengillik.
// ============================================================
const S5 = {
  eyebrow: L('UCHBURCHAK OSONROQ', 'С ТРЕУГОЛЬНИКОМ ПРОЩЕ', 'TRIANGLES ARE EASIER'),
  title: L(
    "Ikkita burchak yetarli",
    'Достаточно двух углов',
    'Two angles are enough',
  ),
  audio: [
    A('mount',
      "Ko'pburchaklar uchun ikkala shartni ham tekshirish kerak edi. Uchburchakda esa ish ancha yengil.",
      'Для многоугольников нужно было проверять оба условия. А с треугольником дело намного легче.',
      'For polygons both conditions had to be checked. With a triangle the work is far lighter.'),
    A('why',
      "Ikkita burchak teng bo'lsa, uchinchisi haqida nima deyish mumkin?",
      'Если два угла равны, что можно сказать о третьем?',
      'If two angles match, what can be said of the third?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('∠A = ∠A₁,   ∠C = ∠C₁', '∠A = ∠A₁,   ∠C = ∠C₁', '∠A = ∠A₁,   ∠C = ∠C₁')}
      steps={[
        { id: 'a', head: L('Burchaklar yigindisi', 'Сумма углов', 'The angle sum'), lines: ['∠B = 180° − (∠A + ∠C)'] },
      ]}
      ask={L(
        "Uchinchi burchaklar haqida nima deyish mumkin?",
        'Что можно сказать о третьих углах?',
        'What can be said about the third angles?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ular ham teng, chunki yig'indi bir yuz sakson", 'Они тоже равны, ведь сумма сто восемьдесят', 'They are equal too, since the sum is one hundred eighty'),
        },
        {
          id: 'wrong',
          label: L("Ular har xil bo'lishi mumkin", 'Они могут различаться', 'They may differ'),
          hint: L(
            "Uchburchakning burchaklari yig'indisi har doim bir yuz sakson gradus. Ikkitasi bir xil bo'lsa, uchinchisiga bir xil qoldiq qoladi.",
            'Сумма углов треугольника всегда сто восемьдесят градусов. Если два одинаковы, третьему остаётся одинаковый остаток.',
            'The angles of a triangle always sum to one hundred eighty. If two agree, the same remainder is left for the third.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun uchburchaklar uchun ikkita burchak yetarli. Bu birinchi alomat deb ataladi, va u tomonlarni tekshirishdan butunlay ozod qiladi.",
        'Верно. Поэтому для треугольников достаточно двух углов. Это называют первым признаком, и он полностью освобождает от проверки сторон.',
        'Correct. So two angles suffice for triangles. This is called the first criterion, and it frees us from checking the sides entirely.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — perimetrlar.
// ============================================================
const S6 = {
  eyebrow: L('PERIMETRLAR', 'ПЕРИМЕТРЫ', 'THE PERIMETERS'),
  title: L(
    "Perimetr ham k marta ortadi",
    'Периметр тоже растёт в k раз',
    'The perimeter also grows k times',
  ),
  audio: [
    A('mount',
      "Har bir tomon k marta kattaradi. Perimetr esa tomonlarning yig'indisi.",
      'Каждая сторона увеличивается в k раз. А периметр это сумма сторон.',
      'Each side grows k times. And the perimeter is the sum of the sides.'),
    A('why',
      "Uchta tomon ham uch barobar kattarsa, ularning yig'indisi qanday o'zgaradi?",
      'Если все три стороны увеличатся втрое, как изменится их сумма?',
      'If all three sides triple, how does their sum change?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('k = 3', 'k = 3', 'k = 3')}
      steps={[
        { id: 'a', head: L('Kichik perimetr', 'Малый периметр', 'The small perimeter'), lines: ['24 + 18 + 30 + 54 = 126'] },
      ]}
      ask={L(
        "Katta figuraning perimetri nechaga teng?",
        'Чему равен периметр большой фигуры?',
        'What does the perimeter of the large figure equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '378' },
        {
          id: 'wrong',
          label: '129',
          hint: L(
            "Bir yuz yigirma to'qqiz bu perimetrga uch QO'SHILGAN. Lekin har bir tomon uchga KO'PAYTIRILADI, demak yig'indi ham uch barobar ortadi.",
            'Сто двадцать девять это периметр ПЛЮС три. Но каждая сторона УМНОЖАЕТСЯ на три, значит и сумма растёт втрое.',
            'One hundred twenty nine is the perimeter PLUS three. But each side is MULTIPLIED by three, so the sum triples too.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir yuz yigirma olti karra uch. Perimetrlar nisbati aynan k ga teng, chunki har bir qo'shiluvchi bir xil songa ko'paytiriladi.",
        'Верно. Сто двадцать шесть на три. Отношение периметров равно именно k, ведь каждое слагаемое умножается на одно и то же число.',
        'Correct. One hundred twenty six times three. The ratio of perimeters is exactly k, since every summand is multiplied by the same number.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — yuzlar.
// ============================================================
const S7 = {
  eyebrow: L('YUZLAR BOSHQACHA', 'С ПЛОЩАДЯМИ ИНАЧЕ', 'AREAS BEHAVE DIFFERENTLY'),
  title: L(
    "Yuz k marta emas, k kvadrat marta ortadi",
    'Площадь растёт не в k, а в k квадрат раз',
    'The area grows k squared times, not k',
  ),
  audio: [
    A('mount',
      "Tomoni bir bo'lgan kvadratni olaylik va uni ikki barobar kattaraytiraylik. Yangi kvadratning tomoni ikki.",
      'Возьмём квадрат со стороной один и увеличим его вдвое. У нового квадрата сторона два.',
      'Take a square of side one and double it. The new square has side two.'),
    A('why',
      "Kichik kvadratdan kattasiga nechta sig'adi? Sanab ko'ring, bu ikki emas.",
      'Сколько малых квадратов поместится в большой? Посчитай, это не два.',
      'How many small squares fit in the large one? Count them, it is not two.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('k = 2', 'k = 2', 'k = 2')}
      steps={[
        { id: 'a', head: L('Yuzlar', 'Площади', 'The areas'), lines: ['1 · 1 = 1', '2 · 2 = 4'] },
      ]}
      ask={L(
        "Yuz necha marta ortdi?",
        'Во сколько раз выросла площадь?',
        'By what factor did the area grow?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('4 marta', 'В 4 раза', '4 times') },
        {
          id: 'wrong',
          label: L('2 marta', 'В 2 раза', '2 times'),
          hint: L(
            "Ikki marta faqat tomon ortdi. Yuz esa ikkita o'lchamdan iborat, ikkalasi ham ikki barobar kattardi, shuning uchun ikki karra ikki.",
            'Вдвое выросла только сторона. А площадь состоит из двух измерений, оба выросли вдвое, поэтому два на два.',
            'Only the side doubled. An area has two dimensions and both doubled, so two times two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yuzlar nisbati k kvadratga teng. Bu darslikning yettinchi darsidagi teorema, va u yuzning ikki o'lchamli ekanidan kelib chiqadi.",
        'Верно. Отношение площадей равно k в квадрате. Это теорема седьмого урока учебника, и она следует из двумерности площади.',
        'Correct. The ratio of areas is k squared. This is the theorem of lesson seven, and it follows from an area having two dimensions.',
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
    'Geometriya 9, 6-8-darslar (28-33-bet)',
    'Геометрия 9, уроки 6-8 (стр. 28-33)',
    'Geometry 9, lessons 6-8 (p. 28-33)',
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
          "Ko'pburchaklarning o'xshashligi uchun nechta shart kerak?",
          'Сколько условий нужно для подобия многоугольников?',
          'How many conditions does similarity of polygons need?',
        )}
        cols={2}
        items={[
          { id: 'right', right: true, label: L('Ikkita', 'Два', 'Two') },
          {
            id: 'wrong',
            label: L('Bitta', 'Одно', 'One'),
            hint: L(
              "1 va 3-ekranni eslang: bir joyda burchaklar teng edi, boshqasida tomonlar proporsional, lekin ikkalasi ham o'xshash emas.",
              'Вспомни 1 и 3 экраны: в одном равны углы, в другом пропорциональны стороны, и ни там ни там подобия нет.',
              'Recall screens 1 and 3: one pair had equal angles, the other proportional sides, and neither was similar.',
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
    "Ikkita shart, bitta alomat",
    'Два условия, один признак',
    'Two conditions, one criterion',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz ikkita aksilmisol ko'rdingiz, koeffitsientni topdingiz va perimetr bilan yuz qanday o'zgarishini bildingiz.",
      'На семи экранах ты увидел два контрпримера, нашёл коэффициент и узнал, как меняются периметр и площадь.',
      'On seven screens you saw two counterexamples, found the factor, and learned how the perimeter and area change.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — darslikning 6.5-masalasi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Barcha tomonlarni topish",
    'Найти все стороны',
    'Finding every side',
  ),
  audio: [
    A('mount',
      "Ikkita o'xshash to'rtburchak. Kichigining tomonlari yigirma to'rt, o'n sakkiz, o'ttiz va ellik to'rt.",
      'Два подобных четырёхугольника. У меньшего стороны двадцать четыре, восемнадцать, тридцать и пятьдесят четыре.',
      'Two similar quadrilaterals. The smaller has sides twenty four, eighteen, thirty and fifty four.'),
    A('why',
      "Kattasining bitta tomoni ma'lum. Ellik to'rt, u o'n sakkizga mos keladi.",
      'У большего известна одна сторона. Пятьдесят четыре, она соответствует восемнадцати.',
      'One side of the larger is known. Fifty four, matching the eighteen.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Koeffitsient bir marta topiladi va keyin barcha tomonlarga bir xil qo'llanadi.",
      'Все три найдены. Коэффициент находится один раз и потом одинаково применяется ко всем сторонам.',
      'All three are found. The factor is found once and then applies to every side alike.',
    ),
    tasks: [
      {
        expr: '54 : 18',
        question: L('O\'xshashlik koeffitsienti nechaga teng?', 'Чему равен коэффициент подобия?', 'What does the similarity factor equal?'),
        ok: L("Ha, uchga. Katta figura kichigidan uch barobar katta.", 'Да, трём. Большая фигура втрое больше меньшей.', 'Yes, three. The large figure is three times the small one.'),
        items: [
          { id: 'a', right: true, label: 'k = 3' },
          { id: 'b', label: 'k = 36', hint: L("O'ttiz olti ellik to'rtdan o'n sakkizni AYIRGANDA chiqadi. Koeffitsient esa nisbat, ya'ni bo'lish.", 'Тридцать шесть выходит при ВЫЧИТАНИИ восемнадцати из пятидесяти четырёх. А коэффициент это отношение, то есть деление.', 'Thirty six comes from SUBTRACTING eighteen from fifty four. The factor is a ratio, that is a division.') },
        ],
        solution: ['k = 54 : 18 = 3'],
      },
      {
        expr: 'AB = 24,   k = 3',
        question: L('Katta figuradagi mos tomon nechaga teng?', 'Чему равна соответственная сторона большой фигуры?', 'What does the matching side of the large figure equal?'),
        ok: L("Ha. Yigirma to'rt karra uch, yetmish ikki.", 'Да. Двадцать четыре на три, семьдесят два.', 'Yes. Twenty four times three is seventy two.'),
        items: [
          { id: 'a', right: true, label: '72' },
          { id: 'b', label: '8', hint: L("Sakkiz yigirma to'rtni uchga BO'LGANDA chiqadi, ya'ni figura kichrayadi. Bu yerda esa katta figuraga o'tilyapti.", 'Восемь выходит при ДЕЛЕНИИ двадцати четырёх на три, то есть фигура уменьшается. А здесь переход к большой фигуре.', 'Eight comes from DIVIDING twenty four by three, shrinking the figure. Here we move to the larger one.') },
        ],
        solution: ['24 · 3 = 72'],
      },
      {
        expr: 'AD = 54,   k = 3',
        question: L('Katta figuradagi eng uzun tomon nechaga teng?', 'Чему равна самая длинная сторона большой фигуры?', 'What does the longest side of the large figure equal?'),
        ok: L("Ha. Ellik to'rt karra uch, bir yuz oltmish ikki.", 'Да. Пятьдесят четыре на три, сто шестьдесят два.', 'Yes. Fifty four times three is one hundred sixty two.'),
        items: [
          { id: 'a', right: true, label: '162' },
          { id: 'b', label: '54', hint: L("Ellik to'rt bu KICHIK figuraning tomoni. Katta figurada u ham uch barobar kattaradi.", 'Пятьдесят четыре это сторона МАЛОЙ фигуры. В большой она тоже увеличивается втрое.', 'Fifty four is a side of the SMALL figure. In the large one it triples as well.') },
        ],
        solution: ['54 · 3 = 162'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — darslikning 6.4-masalasi.
// ============================================================
const S10 = {
  eyebrow: L('VERTIKAL BURCHAKLAR', 'ВЕРТИКАЛЬНЫЕ УГЛЫ', 'VERTICAL ANGLES'),
  title: L(
    "Ikkita uchburchak bitta nuqtada",
    'Два треугольника в одной точке',
    'Two triangles at one point',
  ),
  audio: [
    A('mount',
      "Ikkita uchburchak O nuqtada uchrashadi va o'xshash. Kichigida tomonlar uch va to'rt, kattasida esa olti va noma'lum.",
      'Два треугольника встречаются в точке O и подобны. В меньшем стороны три и четыре, в большем шесть и неизвестная.',
      'Two triangles meet at point O and are similar. The smaller has sides three and four, the larger six and an unknown.'),
    A('why',
      "Avval koeffitsientni toping, keyin qolganini.",
      'Сначала найди коэффициент, потом остальное.',
      'Find the factor first, then the rest.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Mos tomonlarni adashtirmaslik uchun har doim koeffitsient qaysi juftlikdan olinganini eslab turing.",
      'Обе найдены. Чтобы не перепутать соответственные стороны, всегда помни, из какой пары взят коэффициент.',
      'Both are found. To avoid mixing up corresponding sides, always keep in mind which pair gave the factor.',
    ),
    tasks: [
      {
        expr: 'BO = 3,   OD = 6',
        question: L('Koeffitsient nechaga teng?', 'Чему равен коэффициент?', 'What does the factor equal?'),
        ok: L("Ha, ikkiga. Katta uchburchak ikki barobar katta.", 'Да, двум. Большой треугольник вдвое больше.', 'Yes, two. The larger triangle is twice the size.'),
        items: [
          { id: 'a', right: true, label: 'k = 2' },
          { id: 'b', label: 'k = 3', hint: L("Uch bu kichik tomonning O'ZI, nisbat emas. Oltini uchga bo'ling.", 'Три это САМА малая сторона, а не отношение. Раздели шесть на три.', 'Three is the small side ITSELF, not a ratio. Divide six by three.') },
        ],
        solution: ['k = OD : BO = 6 : 3 = 2'],
      },
      {
        expr: 'CD = 10,   k = 2',
        question: L('AB tomoni nechaga teng?', 'Чему равна сторона AB?', 'What does side AB equal?'),
        ok: L("Ha, beshga. AB kichik uchburchakda, demak u ikki barobar kichik.", 'Да, пяти. AB в малом треугольнике, значит он вдвое меньше.', 'Yes, five. AB is in the small triangle, so it is half as long.'),
        items: [
          { id: 'a', right: true, label: 'AB = 5' },
          { id: 'b', label: 'AB = 20', hint: L("Yigirma o'nni ikkiga KO'PAYTIRGANDA chiqadi, ya'ni yana kattalashtirilgan. AB esa kichik uchburchakning tomoni.", 'Двадцать выходит при УМНОЖЕНИИ десяти на два, то есть снова увеличили. А AB это сторона малого треугольника.', 'Twenty comes from MULTIPLYING ten by two, enlarging again. But AB belongs to the small triangle.') },
        ],
        solution: ['AB = CD : k', 'AB = 10 : 2 = 5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — perimetr va yuz.
// ============================================================
const S11 = {
  eyebrow: L('PERIMETR VA YUZ', 'ПЕРИМЕТР И ПЛОЩАДЬ', 'PERIMETER AND AREA'),
  title: L(
    "Ikkalasi boshqacha o'zgaradi",
    'Они меняются по-разному',
    'The two change differently',
  ),
  audio: [
    A('mount',
      "Koeffitsient to'rtga teng. Perimetr va yuz qanday o'zgarishini alohida ayting.",
      'Коэффициент равен четырём. Скажи отдельно, как изменятся периметр и площадь.',
      'The factor is four. Say separately how the perimeter and the area change.'),
    A('why',
      "Bittasi k marta, ikkinchisi k kvadrat marta.",
      'Одно в k раз, другое в k квадрат раз.',
      'One by k, the other by k squared.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Perimetr uzunlik, shuning uchun k marta. Yuz esa ikki o'lchamli, shuning uchun k kvadrat marta.",
      'Обе найдены. Периметр это длина, поэтому в k раз. А площадь двумерна, поэтому в k квадрат раз.',
      'Both are found. A perimeter is a length, so it scales by k. An area is two dimensional, so it scales by k squared.',
    ),
    tasks: [
      {
        expr: 'k = 4,   P = 10',
        question: L('Katta figuraning perimetri nechaga teng?', 'Чему равен периметр большой фигуры?', 'What does the perimeter of the large figure equal?'),
        ok: L("Ha, qirq. Perimetr k marta ortadi.", 'Да, сорок. Периметр растёт в k раз.', 'Yes, forty. The perimeter grows by k.'),
        items: [
          { id: 'a', right: true, label: '40' },
          { id: 'b', label: '160', hint: L("Bir yuz oltmish o'nni k KVADRATGA ko'paytirganda chiqadi. Kvadrat esa yuz uchun, perimetr uchun emas.", 'Сто шестьдесят выходит при умножении десяти на k В КВАДРАТЕ. А квадрат для площади, не для периметра.', 'One hundred sixty comes from ten times k SQUARED. The square belongs to areas, not perimeters.') },
        ],
        solution: ['P₁ = 10 · 4 = 40'],
      },
      {
        expr: 'k = 4,   S = 10',
        question: L('Katta figuraning yuzi nechaga teng?', 'Чему равна площадь большой фигуры?', 'What does the area of the large figure equal?'),
        ok: L("Ha, bir yuz oltmish. Yuz k kvadrat marta, ya'ni o'n olti marta ortadi.", 'Да, сто шестьдесят. Площадь растёт в k квадрат раз, то есть в шестнадцать.', 'Yes, one hundred sixty. The area grows by k squared, that is sixteen times.'),
        items: [
          { id: 'a', right: true, label: '160' },
          { id: 'b', label: '40', hint: L("Qirq perimetrniki edi. Yuz esa ikki o'lchamli va u to'rt karra to'rt marta ortadi.", 'Сорок было для периметра. А площадь двумерна и растёт в четыре на четыре раз.', 'Forty belonged to the perimeter. An area is two dimensional and grows by four times four.') },
        ],
        solution: ['S₁ = 10 · 4² = 160'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — yuzni k marta oshirish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Yuzni sanab ko'rish",
    'Пересчитать площадь',
    'Counting the area out',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Koeffitsient uchga teng, kichik figuraning yuzi ikki. U kattasining yuzini olti deb yozgan.",
      'Решение Камрона. Коэффициент три, площадь малой фигуры два. Он записал площадь большой как шесть.',
      "Kamron's solution. The factor is three and the small figure has area two. He wrote the large area as six."),
    A('why',
      "Tekshirish uchun tomoni bir bo'lgan kvadratni olaylik va uni uch barobar kattaraytiraylik.",
      'Чтобы проверить, возьмём квадрат со стороной один и увеличим его втрое.',
      'To test this, take a square of side one and enlarge it three times.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('TEKSHIRUV', 'ПРОВЕРКА', 'THE CHECK'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Tomoni uch bo'lgan kvadratga tomoni bir bo'lgan kvadratdan to'qqiztasi sig'adi, uchtasi emas. Demak yuz k marta emas, k kvadrat marta ortadi va Kamronning javobi uch barobar kichik.",
      'В квадрат со стороной три помещается девять квадратов со стороной один, а не три. Значит площадь растёт не в k, а в k квадрат раз, и ответ Камрона втрое меньше нужного.',
      'A square of side three holds nine squares of side one, not three. So the area grows by k squared, not k, and Kamron answer is three times too small.',
    ),
    tasks: [
      {
        expr: 'k = 3,   S = 2   →   S₁ = 6 ?',
        question: L(
          "Tomoni 3 bo'lgan kvadratga tomoni 1 bo'lgan kvadratdan nechtasi sig'adi?",
          'Сколько квадратов со стороной 1 поместится в квадрат со стороной 3?',
          'How many squares of side 1 fit into a square of side 3?',
        ),
        ok: L(
          "To'g'ri, to'qqizta. Demak yuz to'qqiz barobar ortadi va to'g'ri javob o'n sakkiz.",
          'Верно, девять. Значит площадь растёт в девять раз, и верный ответ восемнадцать.',
          'Correct, nine. So the area grows ninefold and the right answer is eighteen.',
        ),
        items: [
          { id: 'a', right: true, label: L('9 ta', '9', '9') },
          {
            id: 'b',
            label: L('3 ta', '3', '3'),
            hint: L(
              "Uchtasi faqat bitta qatorga sig'adi. Lekin bunday qator uchta bo'ladi, chunki kvadrat balandligi ham uch.",
              'Три помещаются только в один ряд. Но таких рядов будет три, ведь высота квадрата тоже три.',
              'Three fit in a single row. But there are three such rows, since the square is three tall as well.',
            ),
          },
        ],
        solution: [
          '3 · 3 = 9',
          'S₁ = 2 · 9 = 18',
          L('Kamron: 2 · 3 = 6', 'Камрон: 2 · 3 = 6', 'Kamron: 2 · 3 = 6'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 6.6-masalasi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "O'rta chiziq ajratgan uchburchak",
    'Треугольник, отсечённый средней линией',
    'The triangle cut off by a midline',
  ),
  audio: [
    A('mount',
      "Uchburchakning ikkita tomoni o'rtalari birlashtirildi. Hosil bo'lgan kichik uchburchak kattasiga o'xshash.",
      'Середины двух сторон треугольника соединили. Получившийся малый треугольник подобен большому.',
      'The midpoints of two sides of a triangle were joined. The small triangle formed is similar to the large one.'),
    A('why',
      "O'rta chiziq tomonlarni teng ikkiga bo'ladi, demak koeffitsient ma'lum.",
      'Средняя линия делит стороны пополам, значит коэффициент известен.',
      'A midline halves the sides, so the factor is known.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kichik uchburchak kattasining chorak qismini egallaydi. Ya'ni o'rta chiziq uchburchakni teng ikkiga emas, bir va uch qismga ajratadi — bu ko'pincha kutilmagan bo'ladi.",
      'Малый треугольник занимает четверть большого. То есть средняя линия делит треугольник не пополам, а на одну и три части — это часто оказывается неожиданным.',
      'The small triangle takes a quarter of the large one. So a midline splits the triangle into one part and three, not in half — which often comes as a surprise.',
    ),
    tasks: [
      {
        expr: 'k = ?',
        question: L(
          "Kichik va katta uchburchakning koeffitsienti nechaga teng?",
          'Чему равен коэффициент малого и большого треугольников?',
          'What is the factor between the small and the large triangle?',
        ),
        ok: L(
          "Ha, ikkiga. Har bir tomon ikki barobar kichik.",
          'Да, двум. Каждая сторона вдвое меньше.',
          'Yes, two. Every side is half as long.',
        ),
        items: [
          { id: 'a', right: true, label: 'k = 2' },
          { id: 'b', label: 'k = 4', hint: L("To'rt yuzlar nisbati bo'ladi. Koeffitsient esa TOMONLAR nisbati, o'rta chiziq esa tomonni teng ikkiga bo'ladi.", 'Четыре это отношение площадей. А коэффициент это отношение СТОРОН, средняя же линия делит сторону пополам.', 'Four is the ratio of areas. The factor is the ratio of SIDES, and a midline halves a side.') },
        ],
        solution: [L('tomonlar teng ikkiga bolinadi', 'стороны делятся пополам', 'the sides are halved'), 'k = 2'],
      },
      {
        expr: 'k = 2',
        question: L(
          "Katta uchburchakning yuzi kichigidan necha marta katta?",
          'Во сколько раз площадь большого треугольника больше малого?',
          'How many times larger is the area of the big triangle?',
        ),
        ok: L(
          "Ha, to'rt marta. Kichik uchburchak kattasining chorak qismi.",
          'Да, в четыре раза. Малый треугольник это четверть большого.',
          'Yes, four times. The small triangle is a quarter of the large one.',
        ),
        items: [
          { id: 'a', right: true, label: L('4 marta', 'В 4 раза', '4 times') },
          {
            id: 'b',
            label: L('2 marta', 'В 2 раза', '2 times'),
            hint: L(
              "Ikki marta tomonlar nisbati edi. Yuz esa k kvadrat marta o'zgaradi, buni 12-ekranda kvadratchalarni sanab ko'rgansiz.",
              'В два раза было отношение сторон. А площадь меняется в k квадрат раз, ты считал это по клеткам на 12 экране.',
              'Twice was the ratio of sides. An area changes by k squared, as counted with the small squares on screen twelve.',
            ),
          },
        ],
        solution: ['S : S₁ = k² = 4'],
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
    "Blits: shartlar, alomat, kvadrat",
    'Блиц: условия, признак, квадрат',
    'Blitz: conditions, criterion, square',
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
        tag: 'bitta-shart-yetarli-emas',
        ask: L(
          "Ikkita to'rtburchakning hamma burchagi to'qson gradus. Ular o'xshashmi?",
          'У двух четырёхугольников все углы по девяносто градусов. Подобны ли они?',
          'Two quadrilaterals have every angle at ninety degrees. Are they similar?',
        ),
        options: [
          { id: 'no', right: true, label: L('Shart emas', 'Не обязательно', 'Not necessarily') },
          { id: 'yes', label: L('Ha, albatta', 'Да, обязательно', 'Yes, necessarily') },
        ],
        ok: L(
          "To'g'ri. Tomonlari proporsional bo'lmasligi mumkin, xukdagi kvadrat va to'rtburchak kabi.",
          'Верно. Стороны могут быть непропорциональны, как квадрат и прямоугольник из хука.',
          'Correct. The sides may not be proportional, as with the square and rectangle in the opening.',
        ),
        hint: L(
          "1-ekranni eslang: burchaklari teng edi, lekin bir tomon cho'zilgandi.",
          'Вспомни 1 экран: углы были равны, но одна сторона растянута.',
          'Recall screen 1: the angles matched but one side was stretched.',
        ),
      },
      {
        id: 'q2',
        tag: 'uchburchakda-ikki-burchak',
        ask: L(
          "Uchburchaklar uchun nechta burchakning tengligi yetarli?",
          'Равенства скольких углов достаточно для треугольников?',
          'How many equal angles suffice for triangles?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Двух', 'Two') },
          { id: 'three', label: L('Uchta', 'Трёх', 'Three') },
        ],
        ok: L(
          "To'g'ri. Uchinchisi o'z-o'zidan teng chiqadi, chunki yig'indi bir yuz sakson.",
          'Верно. Третий выйдет равным сам собой, ведь сумма сто восемьдесят.',
          'Correct. The third comes out equal by itself, since the sum is one hundred eighty.',
        ),
        hint: L(
          "5-ekranni eslang: uchinchi burchak bir yuz sakson minus qolgan ikkitasi.",
          'Вспомни 5 экран: третий угол это сто восемьдесят минус два остальных.',
          'Recall screen 5: the third angle is one hundred eighty minus the other two.',
        ),
      },
      {
        id: 'q3',
        tag: 'yuzlar-nisbati-kvadrat',
        ask: L(
          "Koeffitsient beshga teng. Yuz necha marta ortadi?",
          'Коэффициент равен пяти. Во сколько раз вырастет площадь?',
          'The factor is five. By what factor does the area grow?',
        ),
        options: [
          { id: 'r', right: true, label: '25' },
          { id: 'w', label: '5' },
        ],
        ok: L(
          "To'g'ri. Yuz ikki o'lchamli, shuning uchun koeffitsient kvadratga ko'tariladi.",
          'Верно. Площадь двумерна, поэтому коэффициент возводится в квадрат.',
          'Correct. An area is two dimensional, so the factor is squared.',
        ),
        hint: L(
          "12-ekranni eslang: tomoni uch bo'lgan kvadratga to'qqizta katakcha sig'gandi.",
          'Вспомни 12 экран: в квадрат со стороной три помещалось девять клеток.',
          'Recall screen 12: a square of side three held nine small squares.',
        ),
      },
      {
        id: 'q4',
        tag: 'mos-tomonlarni-adashtirish',
        ask: L(
          "Perimetrlar nisbati nimaga teng?",
          'Чему равно отношение периметров?',
          'What does the ratio of perimeters equal?',
        ),
        options: [
          { id: 'k', right: true, label: 'k' },
          { id: 'k2', label: 'k²' },
        ],
        ok: L(
          "To'g'ri. Perimetr uzunlik, u kvadratga ko'tarilmaydi.",
          'Верно. Периметр это длина, он в квадрат не возводится.',
          'Correct. A perimeter is a length and is not squared.',
        ),
        hint: L(
          "6-ekranni eslang: har bir tomon k marta ortsa, ularning yig'indisi ham k marta ortadi.",
          'Вспомни 6 экран: если каждая сторона растёт в k раз, то и их сумма растёт в k раз.',
          'Recall screen 6: if every side grows by k, so does their sum.',
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
    "Bir xil shakl, boshqa o'lcham",
    'Одна форма, другой размер',
    'The same shape, a different size',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda burchaklari teng bo'lgan figuralar o'xshash chiqmadi, uchinchisida esa tomonlari proporsional bo'lganlari.",
      'На первом экране фигуры с равными углами не оказались подобными, а на третьем такие же с пропорциональными сторонами.',
      'On the first screen figures with equal angles were not similar, and on the third neither were those with proportional sides.'),
    A('s1',
      "Siz koeffitsientni topishni, uchburchakning yengil alomatini va yuz nega k kvadrat marta ortishini bildingiz.",
      'Ты научился находить коэффициент, узнал лёгкий признак для треугольника и почему площадь растёт в k квадрат раз.',
      'You learned to find the factor, the easy triangle criterion, and why an area grows by k squared.'),
    A('s2',
      "Keyingi darsda geometrik almashtirishlar.",
      'В следующем уроке геометрические преобразования.',
      'The next lesson covers geometric transformations.'),
  ],
  props: {
    mark: 'S : S₁ = k²',
    markNote: L(
      "perimetrlar esa k ga nisbatda",
      'а периметры в отношении k',
      'while perimeters are in ratio k',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: geometrik almashtirishlar',
      'Следующий урок: геометрические преобразования',
      'Next lesson: geometric transformations',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'bitta-shart-yetarli-emas', ...S2 },
  { role: 'explain',  tag: 'bitta-shart-yetarli-emas', ...S3 },
  { role: 'explain',  tag: 'mos-tomonlarni-adashtirish', ...S4 },
  { role: 'explain',  tag: 'uchburchakda-ikki-burchak', ...S5 },
  { role: 'explain',  tag: 'yuzlar-nisbati-kvadrat', ...S6 },
  { role: 'explain',  tag: 'yuzlar-nisbati-kvadrat', ...S7 },
  { role: 'rule',     tag: 'bitta-shart-yetarli-emas', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'mos-tomonlarni-adashtirish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'mos-tomonlarni-adashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'yuzlar-nisbati-kvadrat', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yuzlar-nisbati-kvadrat', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'yuzlar-nisbati-kvadrat', ...S13 },
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
