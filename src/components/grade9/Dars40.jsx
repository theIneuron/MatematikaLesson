// ============================================================================
// 9-sinf, Dars 40. O'XSHASHLIKNING IKKINCHI VA UCHINCHI ALOMATLARI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 9-dars (34-35-bet),
// 10-dars (36-37), 12-dars (40-41).
//   2-alomat, TBT (34-bet): bir uchburchakning ikki tomoni ikkinchisining
//       ikki tomoniga proporsional va SHU TOMONLAR HOSIL QILGAN
//       burchaklar teng bo'lsa, uchburchaklar o'xshash.
//       Masala (34-bet): AB va CD kesmalar O da kesishadi, AO = 12,
//       BO = 4, CO = 30, DO = 10 → nisbatlar 3 ga teng, burchaklar
//       vertikal, demak o'xshash, k = 3, yuzlar nisbati 9.
//   3-alomat, TTT (36-bet): uchta tomon proporsional bo'lsa, o'xshash.
//       10.2: 14, 11, 13 va 28, 22, 26 → hamma nisbat 2.
//       10.5: trapetsiya asoslari 6 va 9, balandligi 10 → diagonallar
//       kesishgan nuqtadan asoslargacha 4 va 6.
//   12-dars (40-bet): bissektrisa tushgan tomonni qolgan ikki tomonga
//       proporsional kesmalarga ajratadi.
//
// DARS 35-DARSNI DAVOM ETTIRADI. U yerda faqat BIRINCHI alomat berilgan
// edi — ikkita burchak. Bugungi savol boshqacha: burchaklar UMUMAN
// BERILMAGAN bo'lsa nima qilish kerak. Javob — kirish joyi boshqa,
// xulosa o'sha: uchta alomat bitta xulosaga uchta turli yo'l.
//
// XUK shu savolni qo'yadi: tomonlari 3, 4, 5 va 6, 8, 10 bo'lgan ikkita
// uchburchak. Birorta burchak berilmagan, ya'ni birinchi alomat
// ishlamaydi. Lekin javob baribir bor.
//
// TUZOQ (12-ekran): uchta nisbatdan faqat IKKITASINI tekshirish.
// 3, 4, 5 va 6, 8, 11 da birinchi ikkitasi 2 ga teng, uchinchisi esa
// 2,2. Uchburchak mavjud (6 + 8 > 11), ya'ni chizmani ko'rib xato
// topib bo'lmaydi — faqat uchinchi nisbatni hisoblab.
//
// TRANSFER (13-ekran) — 12-darsning teoremasi: bissektrisa tushgan
// tomonni qolgan ikki tomonga proporsional ajratadi. Bu o'xshashlikning
// darhol ishlaydigan natijasi va u 45-darsdagi metrik munosabatlarga
// tayanch bo'ladi.
//
// CHIZMA: `PolyPair` (7G) qayta ishlatildi, yangi asbob yo'q.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, PolyPair, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-40',
  n: 40,
  row: 40,
  block: 'Б7',
  topic: L(
    "O'xshashlikning ikkinchi va uchinchi alomatlari",
    'Второй и третий признаки подобия',
    'The second and third similarity criteria',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Uchta tomon proporsional bo'lsa, uchburchaklar o'xshash",
    'Если три стороны пропорциональны, треугольники подобны',
    'If three sides are proportional, the triangles are similar',
  ),
  L(
    "Ikkita tomon proporsional va ular ORASIDAGI burchaklar teng bo'lsa, uchburchaklar o'xshash",
    'Если две стороны пропорциональны и равны углы МЕЖДУ ними, треугольники подобны',
    'If two sides are proportional and the angles BETWEEN them are equal, the triangles are similar',
  ),
  L(
    "Qaysi alomatni tanlash berilgan ma'lumotga bog'liq, xulosa esa bir xil",
    'Выбор признака зависит от данных, а вывод один и тот же',
    'Which criterion to use depends on the data, the conclusion is the same',
  ),
]

export const MISS = {
  'uchinchi-nisbatni-tekshirmaslik': {
    what: L(
      "uchta nisbatdan faqat ikkitasi tekshirildi",
      'из трёх отношений проверены только два',
      'only two of the three ratios were checked',
    ),
    wrong: null,
    at: 0,
  },
  'burchak-tomonlar-orasida-emas': {
    what: L(
      "teng burchak tomonlar orasida emas edi, lekin alomat qo'llanildi",
      'равный угол не между сторонами, но признак всё равно применён',
      'the equal angle was not between the sides, yet the criterion was applied',
    ),
    wrong: null,
    at: 0,
  },
  'mos-tomonlarni-adashtirish': {
    what: L(
      "nisbatlarda mos bo'lmagan tomonlar juftlashtirildi",
      'в отношениях сопоставлены не соответственные стороны',
      'non corresponding sides were paired in the ratios',
    ),
    wrong: null,
    at: 0,
  },
  'alomatni-notogri-tanlash': {
    what: L(
      "berilgan ma'lumotga mos kelmaydigan alomat tanlandi",
      'выбран признак, не соответствующий данным',
      'a criterion was chosen that does not match the given data',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — burchaklar berilmagan.
// ============================================================
const T345 = { pts: [[0, 0], [4, 0], [4, 3]], sides: ['4', '3', '5'] }
const T6810 = { pts: [[0, 0], [8, 0], [8, 6]], sides: ['8', '6', '10'] }

const S1 = {
  eyebrow: L('BURCHAKLAR YO\'Q', 'УГЛОВ НЕТ', 'NO ANGLES GIVEN'),
  title: L(
    "Faqat tomonlar berilgan",
    'Даны только стороны',
    'Only the sides are given',
  ),
  audio: [
    A('mount',
      "Ikkita uchburchak. Birinchisining tomonlari uch, to'rt, besh. Ikkinchisiniki olti, sakkiz, o'n.",
      'Два треугольника. У первого стороны три, четыре, пять. У второго шесть, восемь, десять.',
      'Two triangles. The first has sides three, four, five. The second six, eight, ten.'),
    A('why',
      "35-darsdagi alomat ikkita burchakni talab qilardi. Bu yerda esa birorta ham burchak berilmagan.",
      'Признак с 35 урока требовал двух углов. А здесь не дано ни одного угла.',
      'The criterion from lesson 35 needed two angles. Here not a single angle is given.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={T345} b={T6810} sameScale />}
      steps={[]}
      ask={L(
        "Burchaklarni bilmasdan o'xshashlikni aniqlash mumkinmi?",
        'Можно ли определить подобие, не зная углов?',
        'Can similarity be settled without knowing the angles?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Mumkin: tomonlarning nisbatlarini solishtirish kerak",
            'Можно: нужно сравнить отношения сторон',
            'It can: compare the ratios of the sides',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Mumkin emas: burchaklarsiz alomat ishlamaydi",
            'Нельзя: без углов признак не работает',
            'It cannot: without angles no criterion works',
          ),
          hint: L(
            "Nisbatlarni hisoblab ko'ring: olti bo'lingan uch, sakkiz bo'lingan to'rt, o'n bo'lingan besh. Uchtasi ham bir xil son berdi.",
            'Посчитай отношения: шесть на три, восемь на четыре, десять на пять. Все три дали одно число.',
            'Compute the ratios: six over three, eight over four, ten over five. All three gave the same number.',
          ),
        },
      ]}
      after={L(
        "Ha. Uchala nisbat ham ikkiga teng. Bugun yana ikkita alomat bilan tanishamiz, ular burchaklar berilmaganda ham ishlaydi.",
        'Да. Все три отношения равны двум. Сегодня познакомимся ещё с двумя признаками, они работают и без углов.',
        'Yes. All three ratios equal two. Today we meet two more criteria that work even without angles.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — birinchi alomat.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Birinchi alomatni eslaymiz",
    'Вспомним первый признак',
    'Recalling the first criterion',
  ),
  audio: [
    A('mount',
      "35-darsda ko'rgandik: uchburchaklar uchun ikkita burchakning tengligi yetarli.",
      'На 35 уроке мы видели: для треугольников достаточно равенства двух углов.',
      'In lesson 35 we saw that two equal angles suffice for triangles.'),
    A('why',
      "Nega uchinchi burchakni tekshirish shart emas edi?",
      'Почему не нужно было проверять третий угол?',
      'Why was there no need to check the third angle?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('∠A = ∠A₁,   ∠B = ∠B₁', '∠A = ∠A₁,   ∠B = ∠B₁', '∠A = ∠A₁,   ∠B = ∠B₁')}
      steps={[]}
      ask={L(
        "Uchinchi burchaklar haqida nima deyish mumkin?",
        'Что можно сказать о третьих углах?',
        'What can be said about the third angles?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ular ham teng', 'Они тоже равны', 'They are equal too') },
        {
          id: 'wrong',
          label: L("Ularni ham tekshirish kerak", 'Их тоже нужно проверить', 'They must be checked too'),
          hint: L(
            "Uchburchakning burchaklari yig'indisi bir yuz sakson. Ikkitasi bir xil bo'lsa, uchinchisiga bir xil qoldiq qoladi.",
            'Сумма углов треугольника сто восемьдесят. Если два одинаковы, третьему остаётся одинаковый остаток.',
            'The angles of a triangle sum to one hundred eighty. If two agree, the same remainder is left.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu birinchi alomat, u burchaklar orqali ishlaydi. Bugun tomonlar orqali ishlaydigan ikkitasini qo'shamiz.",
        'Верно. Это первый признак, он работает через углы. Сегодня добавим два, которые работают через стороны.',
        'Correct. That is the first criterion and it works through angles. Today we add two that work through sides.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — uchinchi alomat (TTT).
// ============================================================
const S3 = {
  eyebrow: L('UCHTA TOMON', 'ТРИ СТОРОНЫ', 'THREE SIDES'),
  title: L(
    "Uchta nisbat bir xil bo'lsa",
    'Если три отношения одинаковы',
    'When all three ratios agree',
  ),
  audio: [
    A('mount',
      "Uchinchi alomat eng sodda: uchta tomon proporsional bo'lsa, uchburchaklar o'xshash.",
      'Третий признак самый простой: если три стороны пропорциональны, треугольники подобны.',
      'The third criterion is the simplest: three proportional sides make the triangles similar.'),
    A('why',
      "Burchaklar haqida hech narsa aytilmaydi, ular o'z-o'zidan teng bo'lib chiqadi.",
      'Про углы ничего не говорится, они получаются равными сами собой.',
      'Nothing is said of the angles, they come out equal on their own.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        '14, 11, 13   |   28, 22, 26',
        '14, 11, 13   |   28, 22, 26',
        '14, 11, 13   |   28, 22, 26',
      )}
      steps={[
        { id: 'a', head: L('Ikkita nisbat', 'Два отношения', 'Two ratios'), lines: ['28 : 14 = 2', '22 : 11 = 2'] },
      ]}
      ask={L(
        "Bu uchburchaklar o'xshashmi?",
        'Подобны ли эти треугольники?',
        'Are these triangles similar?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ha', 'Да', 'Yes') },
        {
          id: 'wrong',
          label: L("Yo'q", 'Нет', 'No'),
          hint: L(
            "Uchinchi nisbatni ham hisoblang: yigirma olti bo'lingan o'n uch. U ham ikkiga teng, demak uchalasi bir xil.",
            'Посчитай и третье отношение: двадцать шесть на тринадцать. Оно тоже равно двум, значит все три совпали.',
            'Compute the third ratio too: twenty six over thirteen. It is two as well, so all three agree.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchala nisbat ikkiga teng, demak uchburchaklar o'xshash va koeffitsient ikki. Bu darslikning 10.2-mashqi.",
        'Верно. Все три отношения равны двум, значит треугольники подобны и коэффициент два. Это задача 10.2 учебника.',
        'Correct. All three ratios are two, so the triangles are similar with factor two. This is exercise 10.2.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — ikkinchi alomat (TBT).
// ============================================================
const S4 = {
  eyebrow: L('IKKITA TOMON VA BURCHAK', 'ДВЕ СТОРОНЫ И УГОЛ', 'TWO SIDES AND AN ANGLE'),
  title: L(
    "Burchak aynan tomonlar orasida turishi kerak",
    'Угол должен стоять именно между сторонами',
    'The angle must sit between the sides',
  ),
  audio: [
    A('mount',
      "Ikkinchi alomat kamroq ma'lumot talab qiladi: ikkita tomon proporsional va ular orasidagi burchaklar teng.",
      'Второй признак требует меньше данных: две стороны пропорциональны и углы между ними равны.',
      'The second criterion needs less: two proportional sides and equal angles between them.'),
    A('why',
      "Orasidagi degan so'z bu yerda hal qiluvchi. Nega, buni o'n ikkinchi ekranda ko'ramiz.",
      'Слово между здесь решающее. Почему, увидим на двенадцатом экране.',
      'The word between is decisive here. Why, we see on screen twelve.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'AB : A₁B₁ = AC : A₁C₁',
        'AB : A₁B₁ = AC : A₁C₁',
        'AB : A₁B₁ = AC : A₁C₁',
      )}
      steps={[]}
      ask={L(
        "Alomat ishlashi uchun qaysi burchaklar teng bo'lishi kerak?",
        'Какие углы должны быть равны, чтобы признак сработал?',
        'Which angles must be equal for the criterion to work?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Shu ikkita tomon orasidagi burchaklar",
            'Углы между этими двумя сторонами',
            'The angles between those two sides',
          ),
        },
        {
          id: 'wrong',
          label: L("Istalgan ikkita burchak", 'Любые два угла', 'Any two angles'),
          hint: L(
            "Nisbatda AB va AC tomonlari qatnashyapti, ular A uchida uchrashadi. Demak aynan A burchagi kerak.",
            'В отношении участвуют стороны AB и AC, они сходятся в вершине A. Значит нужен именно угол A.',
            'The ratio uses the sides AB and AC, which meet at A. So the angle A is the one needed.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Nisbatda qatnashgan ikkita tomon bitta uchda uchrashadi, va aynan o'sha uchdagi burchak teng bo'lishi kerak.",
        'Верно. Две стороны из отношения сходятся в одной вершине, и равным должен быть угол именно при ней.',
        'Correct. The two sides in the ratio meet at one vertex, and the angle there is the one that must match.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — darslikning masalasi.
// ============================================================
const S5 = {
  eyebrow: L('VERTIKAL BURCHAKLAR', 'ВЕРТИКАЛЬНЫЕ УГЛЫ', 'VERTICAL ANGLES'),
  title: L(
    "Burchak tayyor holda beriladi",
    'Угол даётся в готовом виде',
    'The angle comes ready made',
  ),
  audio: [
    A('mount',
      "AB va CD kesmalar O nuqtada kesishadi. AO o'n ikki, BO to'rt, CO o'ttiz, DO o'n.",
      'Отрезки AB и CD пересекаются в точке O. AO двенадцать, BO четыре, CO тридцать, DO десять.',
      'The segments AB and CD meet at O. AO is twelve, BO four, CO thirty, DO ten.'),
    A('why',
      "Kesishgan joyda vertikal burchaklar hosil bo'ladi, ular esa har doim teng.",
      'В точке пересечения образуются вертикальные углы, а они всегда равны.',
      'At the crossing point vertical angles appear, and they are always equal.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('AO = 12, BO = 4,   CO = 30, DO = 10', 'AO = 12, BO = 4,   CO = 30, DO = 10', 'AO = 12, BO = 4,   CO = 30, DO = 10')}
      steps={[
        { id: 'a', head: L('Nisbatlar', 'Отношения', 'The ratios'), lines: ['12 : 4 = 3', '30 : 10 = 3'] },
      ]}
      ask={L(
        "Qaysi alomat bu yerda ishlaydi?",
        'Какой признак здесь работает?',
        'Which criterion applies here?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Ikkinchi: ikkita tomon va ular orasidagi burchak",
            'Второй: две стороны и угол между ними',
            'The second: two sides and the angle between them',
          ),
        },
        {
          id: 'wrong',
          label: L("Uchinchi: uchta tomon", 'Третий: три стороны', 'The third: three sides'),
          hint: L(
            "Uchinchi tomonlar, ya'ni AC va BD, umuman berilmagan. Ularni hisoblash ham mumkin emas.",
            'Третьи стороны, то есть AC и BD, вообще не даны. И вычислить их нельзя.',
            'The third sides AC and BD are not given at all, and they cannot be computed either.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkita nisbat uchga teng, burchaklar esa vertikal, demak teng. Uchburchaklar o'xshash va koeffitsient uch.",
        'Верно. Два отношения равны трём, а углы вертикальные, значит равны. Треугольники подобны с коэффициентом три.',
        'Correct. Two ratios are three and the angles are vertical, hence equal. The triangles are similar with factor three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — yuzlar nisbati.
// ============================================================
const S6 = {
  eyebrow: L('YUZLAR', 'ПЛОЩАДИ', 'THE AREAS'),
  title: L(
    "Koeffitsient topilgach, qolgani oson",
    'Найдя коэффициент, остальное просто',
    'With the factor found, the rest is easy',
  ),
  audio: [
    A('mount',
      "Koeffitsient uchga teng ekanini topdik. Endi 35-darsning natijasini qo'llaymiz.",
      'Мы нашли, что коэффициент равен трём. Теперь применим результат 35 урока.',
      'We found the factor is three. Now apply the result of lesson 35.'),
    A('why',
      "U yerda yuzlar nisbati koeffitsientning kvadratiga teng edi.",
      'Там отношение площадей равнялось квадрату коэффициента.',
      'There the ratio of areas equalled the square of the factor.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('k = 3', 'k = 3', 'k = 3')}
      steps={[]}
      ask={L(
        "Bu uchburchaklarning yuzlari nisbati nechaga teng?",
        'Чему равно отношение площадей этих треугольников?',
        'What is the ratio of the areas of these triangles?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '9' },
        {
          id: 'wrong',
          label: '3',
          hint: L(
            "Uch bu TOMONLARNING nisbati. Yuz esa ikki o'lchamli, shuning uchun nisbat kvadratga ko'tariladi.",
            'Три это отношение СТОРОН. А площадь двумерна, поэтому отношение возводится в квадрат.',
            'Three is the ratio of the SIDES. An area is two dimensional, so the ratio gets squared.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, to'qqiz. Bu darslikning masalasi to'liq yechildi: alomat o'xshashlikni berdi, o'xshashlik esa yuzlar nisbatini.",
        'Верно, девять. Задача учебника решена полностью: признак дал подобие, а подобие дало отношение площадей.',
        'Correct, nine. The textbook problem is fully solved: the criterion gave similarity and similarity gave the area ratio.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — qaysi alomatni tanlash.
// ============================================================
const S7 = {
  eyebrow: L('QAYSI BIRINI', 'КОТОРЫЙ ИЗ НИХ', 'WHICH ONE'),
  title: L(
    "Alomatni ma'lumot tanlaydi",
    'Признак выбирают данные',
    'The data choose the criterion',
  ),
  audio: [
    A('mount',
      "Uchta alomat bor, lekin har safar ulardan bittasi qulay bo'ladi.",
      'Признаков три, но каждый раз удобен только один из них.',
      'There are three criteria, but each time only one of them fits.'),
    A('why',
      "Tanlash oddiy: nima berilgan bo'lsa, o'sha alomat olinadi.",
      'Выбор прост: берут тот признак, под который есть данные.',
      'The choice is simple: take the criterion your data fit.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Faqat ikkita burchak berilgan",
        'Даны только два угла',
        'Only two angles are given',
      )}
      steps={[]}
      ask={L(
        "Qaysi alomat kerak?",
        'Какой признак нужен?',
        'Which criterion is needed?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Birinchi', 'Первый', 'The first') },
        {
          id: 'wrong',
          label: L('Uchinchi', 'Третий', 'The third'),
          hint: L(
            "Uchinchi alomat uchta tomonni talab qiladi, bu yerda esa tomonlar umuman berilmagan.",
            'Третий признак требует трёх сторон, а здесь сторон вообще не дано.',
            'The third criterion needs three sides, and here no sides are given at all.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Burchaklar berilsa birinchi alomat, uchta tomon berilsa uchinchisi, ikkita tomon va ular orasidagi burchak berilsa ikkinchisi olinadi.",
        'Верно. Если даны углы, берут первый. Если три стороны, третий. Если две стороны и угол между ними, второй.',
        'Correct. Angles given means the first, three sides the third, two sides with the angle between them the second.',
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
    'Geometriya 9, 9-dars (34-35-bet) va 10-dars (36-37-bet)',
    'Геометрия 9, урок 9 (стр. 34-35) и урок 10 (стр. 36-37)',
    'Geometry 9, lesson 9 (p. 34-35) and lesson 10 (p. 36-37)',
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
          "Uchta alomat uchta xil xulosa beradimi?",
          'Дают ли три признака три разных вывода?',
          'Do the three criteria give three different conclusions?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Yo'q, xulosa bitta: uchburchaklar o'xshash",
              'Нет, вывод один: треугольники подобны',
              'No, the conclusion is one: the triangles are similar',
            ),
          },
          {
            id: 'wrong',
            label: L("Ha, har biri o'zining natijasini beradi", 'Да, каждый даёт свой результат', 'Yes, each gives its own result'),
            hint: L(
              "Alomatlar kirish joyi bilan farq qiladi, chiqish joyi esa bitta. Qaysi biri bilan kirsangiz ham, o'xshashlik chiqadi.",
              'Признаки отличаются входом, а выход у них один. С каким бы ни вошёл, выйдет подобие.',
              'The criteria differ in their entry point, not their exit. Whichever you enter by, similarity comes out.',
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
    "Uchta kirish, bitta chiqish",
    'Три входа, один выход',
    'Three entrances, one exit',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz ikkita yangi alomatni ko'rdingiz va ularni qanday tanlashni bildingiz.",
      'На семи экранах ты увидел два новых признака и узнал, как их выбирать.',
      'On seven screens you met two new criteria and learned how to choose between them.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — uchinchi alomat.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Uchta nisbatni tekshiring",
    'Проверь три отношения',
    'Check the three ratios',
  ),
  audio: [
    A('mount',
      "Uchta juftlik. Har birida uchala nisbatni ham hisoblang.",
      'Три пары. В каждой посчитай все три отношения.',
      'Three pairs. Compute all three ratios in each.'),
    A('why',
      "Bitta nisbat farq qilsa, o'xshashlik yo'q.",
      'Если хоть одно отношение отличается, подобия нет.',
      'If even one ratio differs, there is no similarity.'),
  ],
  props: {
    stepLabel: L('Juftlik', 'Пара', 'Pair'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi. Uchinchi alomatda uchala nisbat ham kerak, ikkitasi hech qachon yetarli emas.",
      'Все три проверены. Третьему признаку нужны все три отношения, двух никогда не хватает.',
      'All three are checked. The third criterion needs all three ratios, two are never enough.',
    ),
    tasks: [
      {
        expr: '5, 6, 7   |   10, 12, 14',
        question: L('Bu uchburchaklar o\'xshashmi?', 'Подобны ли эти треугольники?', 'Are these triangles similar?'),
        ok: L("Ha. Uchala nisbat ham ikkiga teng.", 'Да. Все три отношения равны двум.', 'Yes. All three ratios equal two.'),
        items: [
          { id: 'a', right: true, label: L('Ha, k = 2', 'Да, k = 2', 'Yes, k = 2') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Har bir nisbatni alohida hisoblang: o'n bo'lingan besh, o'n ikki bo'lingan olti, o'n to'rt bo'lingan yetti.", 'Посчитай каждое отношение отдельно: десять на пять, двенадцать на шесть, четырнадцать на семь.', 'Compute each ratio: ten over five, twelve over six, fourteen over seven.') },
        ],
        solution: ['10 : 5 = 2', '12 : 6 = 2', '14 : 7 = 2'],
      },
      {
        expr: '4, 6, 8   |   6, 9, 12',
        question: L('Bu uchburchaklar o\'xshashmi?', 'Подобны ли эти треугольники?', 'Are these triangles similar?'),
        ok: L("Ha. Uchala nisbat ham bir butun besh o'ndanga teng.", 'Да. Все три отношения равны одной целой пяти десятым.', 'Yes. All three ratios equal one point five.'),
        items: [
          { id: 'a', right: true, label: L('Ha, k = 1,5', 'Да, k = 1,5', 'Yes, k = 1.5') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Koeffitsient butun son bo'lishi shart emas. Olti bo'lingan to'rt bir butun besh o'ndan, to'qqiz bo'lingan olti ham shunday.", 'Коэффициент не обязан быть целым. Шесть на четыре это полтора, девять на шесть тоже.', 'The factor need not be whole. Six over four is one and a half, and so is nine over six.') },
        ],
        solution: ['6 : 4 = 1,5', '9 : 6 = 1,5', '12 : 8 = 1,5'],
      },
      {
        expr: '3, 5, 7   |   6, 10, 15',
        question: L('Bu uchburchaklar o\'xshashmi?', 'Подобны ли эти треугольники?', 'Are these triangles similar?'),
        ok: L("Yo'q. Birinchi ikkita nisbat ikkiga teng, uchinchisi esa ikki butun bir o'ndan yetti.", 'Нет. Первые два отношения равны двум, а третье примерно два целых одна седьмая.', 'No. The first two ratios are two, the third is about two and one seventh.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Uchinchi nisbatni hisoblang: o'n besh bo'lingan yetti. Bu ikkiga teng emas, demak proporsionallik buzilgan.", 'Посчитай третье отношение: пятнадцать на семь. Это не два, значит пропорциональность нарушена.', 'Compute the third ratio: fifteen over seven. That is not two, so the proportionality breaks.') },
        ],
        solution: ['6 : 3 = 2', '10 : 5 = 2', '15 : 7 ≈ 2,14'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — alomatni tanlash.
// ============================================================
const S10 = {
  eyebrow: L('ALOMATNI TANLASH', 'ВЫБОР ПРИЗНАКА', 'CHOOSING THE CRITERION'),
  title: L(
    "Berilganga qarab tanlang",
    'Выбирай по данным',
    'Choose by what is given',
  ),
  audio: [
    A('mount',
      "Uchta holat. Har birida qaysi alomat ishlashini ayting.",
      'Три случая. В каждом скажи, какой признак сработает.',
      'Three cases. In each say which criterion applies.'),
    A('why',
      "Hisoblash shart emas, faqat nima berilganiga qarang.",
      'Считать не нужно, просто посмотри, что дано.',
      'No computing needed, just look at what is given.'),
  ],
  props: {
    stepLabel: L('Holat', 'Случай', 'Case'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi. Alomatni tanlash hisobdan oldin turadi, xuddi 26-darsdagi progressiya turini aniqlash kabi.",
      'Все три определены. Выбор признака идёт раньше вычислений, как и определение типа прогрессии на 26 уроке.',
      'All three are settled. Choosing the criterion comes before any computing, as with the progression type in lesson 26.',
    ),
    tasks: [
      {
        expr: '∠A = ∠A₁,   ∠B = ∠B₁',
        question: L('Qaysi alomat ishlaydi?', 'Какой признак работает?', 'Which criterion applies?'),
        ok: L("Ha, birinchi. Ikkita burchak yetarli.", 'Да, первый. Двух углов достаточно.', 'Yes, the first. Two angles suffice.'),
        items: [
          { id: 'a', right: true, label: L('Birinchi', 'Первый', 'The first') },
          { id: 'b', label: L('Ikkinchi', 'Второй', 'The second'), hint: L("Ikkinchi alomat tomonlarning nisbatini talab qiladi, bu yerda esa tomonlar berilmagan.", 'Второй признак требует отношения сторон, а здесь сторон не дано.', 'The second needs a ratio of sides, and no sides are given here.') },
        ],
        solution: [L('ikkita burchak', 'два угла', 'two angles'), L('birinchi alomat', 'первый признак', 'the first criterion')],
      },
      {
        expr: 'AB : A₁B₁ = AC : A₁C₁,   ∠A = ∠A₁',
        question: L('Qaysi alomat ishlaydi?', 'Какой признак работает?', 'Which criterion applies?'),
        ok: L("Ha, ikkinchi. Ikkita tomon va ular orasidagi burchak.", 'Да, второй. Две стороны и угол между ними.', 'Yes, the second. Two sides and the angle between them.'),
        items: [
          { id: 'a', right: true, label: L('Ikkinchi', 'Второй', 'The second') },
          { id: 'b', label: L('Uchinchi', 'Третий', 'The third'), hint: L("Uchinchi alomatga uchta tomon kerak, bu yerda esa ikkitasi berilgan va ularning o'rniga burchak qo'shilgan.", 'Третьему признаку нужны три стороны, а здесь их две, и вместо третьей добавлен угол.', 'The third needs three sides, here there are two and an angle instead of the third.') },
        ],
        solution: [L('ikki tomon va burchak', 'две стороны и угол', 'two sides and an angle'), L('ikkinchi alomat', 'второй признак', 'the second criterion')],
      },
      {
        expr: 'AB : A₁B₁ = BC : B₁C₁ = CA : C₁A₁',
        question: L('Qaysi alomat ishlaydi?', 'Какой признак работает?', 'Which criterion applies?'),
        ok: L("Ha, uchinchi. Uchala tomon proporsional.", 'Да, третий. Все три стороны пропорциональны.', 'Yes, the third. All three sides are proportional.'),
        items: [
          { id: 'a', right: true, label: L('Uchinchi', 'Третий', 'The third') },
          { id: 'b', label: L('Birinchi', 'Первый', 'The first'), hint: L("Birinchi alomat burchaklar haqida, bu yerda esa birorta burchak berilmagan.", 'Первый признак про углы, а здесь не дано ни одного угла.', 'The first is about angles, and here no angle is given.') },
        ],
        solution: [L('uchta tomon', 'три стороны', 'three sides'), L('uchinchi alomat', 'третий признак', 'the third criterion')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — darslikning 10.5-mashqi.
// ============================================================
const S11 = {
  eyebrow: L('TRAPETSIYA', 'ТРАПЕЦИЯ', 'A TRAPEZIUM'),
  title: L(
    "Diagonallar kesishgan nuqta",
    'Точка пересечения диагоналей',
    'Where the diagonals cross',
  ),
  audio: [
    A('mount',
      "Trapetsiyaning asoslari olti va to'qqiz, balandligi o'n. Diagonallar bir nuqtada kesishadi.",
      'Основания трапеции шесть и девять, высота десять. Диагонали пересекаются в одной точке.',
      'A trapezium has bases six and nine and height ten. The diagonals meet at a point.'),
    A('why',
      "Asoslar parallel, demak kesishgan joyda ikkita o'xshash uchburchak hosil bo'ladi.",
      'Основания параллельны, значит в точке пересечения получаются два подобных треугольника.',
      'The bases are parallel, so two similar triangles appear at the crossing.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Masofalar asoslarning nisbatida bo'linadi, bu esa o'xshashlikning to'g'ridan-to'g'ri natijasi.",
      'Оба шага сделаны. Расстояния делятся в отношении оснований, и это прямое следствие подобия.',
      'Both steps are done. The distances split in the ratio of the bases, a direct consequence of similarity.',
    ),
    tasks: [
      {
        expr: '6,  9',
        question: L(
          "Hosil bo'lgan uchburchaklarning koeffitsienti nechaga teng?",
          'Чему равен коэффициент получившихся треугольников?',
          'What is the factor of the resulting triangles?',
        ),
        ok: L("Ha. Olti bo'lingan to'qqiz, ikki uchdan.", 'Да. Шесть на девять, две трети.', 'Yes. Six over nine is two thirds.'),
        items: [
          { id: 'a', right: true, label: 'k = 2/3' },
          { id: 'b', label: 'k = 3', hint: L("Uch bu asoslarning AYIRMASI. Koeffitsient esa ularning nisbati.", 'Три это РАЗНОСТЬ оснований. А коэффициент это их отношение.', 'Three is the DIFFERENCE of the bases. The factor is their ratio.') },
        ],
        solution: ['k = 6 : 9 = 2/3'],
      },
      {
        expr: 'h = 10',
        question: L(
          "Kesishgan nuqtadan kichik asosgacha bo'lgan masofa nechaga teng?",
          'Чему равно расстояние от точки пересечения до меньшего основания?',
          'What is the distance from the crossing point to the smaller base?',
        ),
        ok: L(
          "Ha, to'rt. Balandlik ikki va uch nisbatida bo'linadi, ya'ni to'rt va olti.",
          'Да, четыре. Высота делится в отношении два к трём, то есть четыре и шесть.',
          'Yes, four. The height splits in the ratio two to three, that is four and six.',
        ),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '5', hint: L("Besh balandlikning yarmi bo'lardi, ya'ni asoslar teng bo'lganda. Bu yerda esa ular har xil.", 'Пять было бы половиной высоты, то есть при равных основаниях. А здесь они разные.', 'Five would be half the height, which needs equal bases. Here they differ.') },
        ],
        solution: ['h₁ : h₂ = 2 : 3', 'h₁ + h₂ = 10', 'h₁ = 4,  h₂ = 6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — ikkita nisbat yetarli emas.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ikkita nisbat tekshirildi, uchinchisi yo'q",
    'Два отношения проверены, третье нет',
    'Two ratios checked, the third not',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Uchburchaklar uch, to'rt, besh va olti, sakkiz, o'n bir. U birinchi ikkita nisbatni hisoblab, ikkalasi ham ikkiga teng ekanini ko'rgan va o'xshash deb yozgan.",
      'Решение Камрона. Треугольники три, четыре, пять и шесть, восемь, одиннадцать. Он посчитал первые два отношения, увидел, что оба равны двум, и записал подобны.',
      "Kamron's solution. The triangles are three, four, five and six, eight, eleven. He computed the first two ratios, saw both were two, and wrote similar."),
    A('why',
      "Ikkala nisbat haqiqatan ham ikkiga teng. Uchinchisini hisoblang.",
      'Оба отношения и правда равны двум. Посчитай третье.',
      'Both ratios really are two. Now compute the third.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bu xato ayniqsa xavfli, chunki uni chizmadan topib bo'lmaydi: tomonlari 6, 8, 11 bo'lgan uchburchak mavjud va tashqi ko'rinishi shubha tug'dirmaydi. Faqat uchinchi nisbatni hisoblash yordam beradi.",
      'Эта ошибка особенно опасна тем, что её не видно на чертеже: треугольник со сторонами 6, 8, 11 существует и выглядит обычно. Помогает только вычисление третьего отношения.',
      'This slip is especially dangerous because no drawing reveals it: a triangle with sides 6, 8, 11 exists and looks ordinary. Only computing the third ratio helps.',
    ),
    tasks: [
      {
        expr: '3, 4, 5   |   6, 8, 11',
        question: L(
          "Uchinchi nisbat nechaga teng?",
          'Чему равно третье отношение?',
          'What does the third ratio equal?',
        ),
        ok: L(
          "To'g'ri, ikki butun ikki o'ndan. Bu ikkiga teng emas, demak uchburchaklar o'xshash emas.",
          'Верно, две целых две десятых. Это не два, значит треугольники не подобны.',
          'Correct, two point two. That is not two, so the triangles are not similar.',
        ),
        items: [
          { id: 'a', right: true, label: '2,2' },
          {
            id: 'b',
            label: '2',
            hint: L(
              "O'n bir bo'lingan besh ni hisoblang. Agar ikkiga teng bo'lganda, uchinchi tomon o'n bo'lardi, lekin u o'n bir.",
              'Посчитай одиннадцать делить на пять. Если бы было два, третья сторона равнялась бы десяти, а она одиннадцать.',
              'Compute eleven over five. If it were two, the third side would be ten, but it is eleven.',
            ),
          },
        ],
        solution: [
          '6 : 3 = 2,   8 : 4 = 2',
          '11 : 5 = 2,2',
          L('oxshash emas', 'не подобны', 'not similar'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — bissektrisa.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Bissektrisa tomonni qanday bo'ladi",
    'Как биссектриса делит сторону',
    'How a bisector splits a side',
  ),
  audio: [
    A('mount',
      "Uchburchakning bissektrisasi qarshi tomonni ikkita bo'lakka ajratadi. Bu bo'laklar teng emas.",
      'Биссектриса треугольника делит противоположную сторону на два куска. Эти куски не равны.',
      'A triangle bisector splits the opposite side into two pieces. They are not equal.'),
    A('why',
      "Darslikning teoremasiga ko'ra, ular qolgan ikki tomonga proporsional bo'ladi.",
      'По теореме учебника они пропорциональны двум другим сторонам.',
      'By the textbook theorem they are proportional to the other two sides.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bissektrisa haqidagi bu teorema o'xshashlikning eng ko'p ishlatiladigan natijalaridan biri, va u 45-darsdagi metrik munosabatlarga tayanch bo'ladi.",
      'Эта теорема о биссектрисе одно из самых применяемых следствий подобия, и она станет опорой метрическим соотношениям на 45 уроке.',
      'This bisector theorem is among the most used consequences of similarity, and it will support the metric relations in lesson 45.',
    ),
    tasks: [
      {
        expr: 'AB = 8,   AC = 6,   BC = 7',
        question: L(
          "Bo'laklarning nisbati nechaga teng?",
          'Чему равно отношение кусков?',
          'What is the ratio of the pieces?',
        ),
        ok: L(
          "Ha, to'rt uchdan. Bo'laklar AB va AC tomonlarga proporsional, ya'ni sakkiz va olti kabi.",
          'Да, четыре третьих. Куски пропорциональны сторонам AB и AC, то есть как восемь к шести.',
          'Yes, four thirds. The pieces are proportional to AB and AC, that is as eight to six.',
        ),
        items: [
          { id: 'a', right: true, label: '4 : 3' },
          {
            id: 'b',
            label: '1 : 1',
            hint: L(
              "Teng bo'laklarni MEDIANA beradi, bissektrisa emas. Bissektrisa esa qo'shni tomonlar nisbatida bo'ladi.",
              'Равные куски даёт МЕДИАНА, а не биссектриса. Биссектриса делит в отношении прилежащих сторон.',
              'Equal pieces come from a MEDIAN, not a bisector. A bisector splits in the ratio of the adjacent sides.',
            ),
          },
        ],
        solution: ['8 : 6 = 4 : 3'],
      },
      {
        expr: 'BC = 7,   4 : 3',
        question: L(
          "Bo'laklar nechaga teng?",
          'Чему равны куски?',
          'What do the pieces equal?',
        ),
        ok: L(
          "Ha, to'rt va uch. Yettita ulush to'rt va uchga bo'lindi.",
          'Да, четыре и три. Семь долей разделились на четыре и три.',
          'Yes, four and three. Seven shares split into four and three.',
        ),
        items: [
          { id: 'a', right: true, label: L('4 va 3', '4 и 3', '4 and 3') },
          {
            id: 'b',
            label: L('8 va 6', '8 и 6', '8 and 6'),
            hint: L(
              "Sakkiz va olti bu TOMONLARNING uzunliklari, ularning yig'indisi o'n to'rt. Bo'laklar esa BC ning ichida yotadi va yig'indisi yetti.",
              'Восемь и шесть это длины СТОРОН, их сумма четырнадцать. А куски лежат внутри BC и в сумме дают семь.',
              'Eight and six are the SIDE lengths and sum to fourteen. The pieces lie inside BC and sum to seven.',
            ),
          },
        ],
        solution: ['4 + 3 = 7', L('bolaklar 4 va 3', 'куски 4 и 3', 'the pieces are 4 and 3')],
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
    "Blits: nechta nisbat, qaysi burchak",
    'Блиц: сколько отношений, какой угол',
    'Blitz: how many ratios, which angle',
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
        tag: 'uchinchi-nisbatni-tekshirmaslik',
        ask: L(
          "Uchinchi alomat uchun nechta nisbatni tekshirish kerak?",
          'Сколько отношений нужно проверить для третьего признака?',
          'How many ratios must be checked for the third criterion?',
        ),
        options: [
          { id: 'r', right: true, label: L('Uchtasini', 'Три', 'Three') },
          { id: 'w', label: L('Ikkitasini', 'Два', 'Two') },
        ],
        ok: L(
          "To'g'ri. Ikkitasi mos kelib, uchinchisi farq qilishi mumkin.",
          'Верно. Два могут совпасть, а третье отличаться.',
          'Correct. Two may agree while the third differs.',
        ),
        hint: L(
          "12-ekranni eslang: u yerda ikkita nisbat ikkiga teng edi, uchinchisi esa ikki butun ikki o'ndan.",
          'Вспомни 12 экран: там два отношения были равны двум, а третье двум целым двум десятым.',
          'Recall screen 12: two ratios were two there and the third was two point two.',
        ),
      },
      {
        id: 'q2',
        tag: 'burchak-tomonlar-orasida-emas',
        ask: L(
          "Ikkinchi alomatda burchak qayerda turishi kerak?",
          'Где должен стоять угол во втором признаке?',
          'Where must the angle sit in the second criterion?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Nisbatdagi tomonlar orasida", 'Между сторонами из отношения', 'Between the sides in the ratio'),
          },
          { id: 'w', label: L('Istalgan joyda', 'В любом месте', 'Anywhere') },
        ],
        ok: L(
          "To'g'ri. Nisbatda qatnashgan ikkita tomon bitta uchda uchrashadi, o'sha burchak kerak.",
          'Верно. Две стороны из отношения сходятся в одной вершине, нужен угол при ней.',
          'Correct. The two sides in the ratio meet at one vertex, and that angle is the one needed.',
        ),
        hint: L(
          "4-ekranni eslang: nisbatda AB va AC bor edi, ular A uchida uchrashardi.",
          'Вспомни 4 экран: в отношении были AB и AC, они сходились в вершине A.',
          'Recall screen 4: the ratio held AB and AC, meeting at A.',
        ),
      },
      {
        id: 'q3',
        tag: 'alomatni-notogri-tanlash',
        ask: L(
          "Faqat uchta tomon berilgan. Qaysi alomat kerak?",
          'Даны только три стороны. Какой признак нужен?',
          'Only three sides are given. Which criterion is needed?',
        ),
        options: [
          { id: 'r', right: true, label: L('Uchinchi', 'Третий', 'The third') },
          { id: 'w', label: L('Birinchi', 'Первый', 'The first') },
        ],
        ok: L(
          "To'g'ri. Birinchi alomat burchaklarni talab qiladi, ular esa berilmagan.",
          'Верно. Первый признак требует углов, а их не дано.',
          'Correct. The first criterion needs angles and none are given.',
        ),
        hint: L(
          "7-ekranni eslang: alomatni ma'lumot tanlaydi, hisob emas.",
          'Вспомни 7 экран: признак выбирают данные, а не вычисления.',
          'Recall screen 7: the data choose the criterion, not the computation.',
        ),
      },
      {
        id: 'q4',
        tag: 'mos-tomonlarni-adashtirish',
        ask: L(
          "Uchta alomat uchta xil xulosa beradimi?",
          'Дают ли три признака три разных вывода?',
          'Do the three criteria give three different conclusions?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q, xulosa bitta", 'Нет, вывод один', 'No, one conclusion') },
          { id: 'w', label: L('Ha, uchta', 'Да, три', 'Yes, three') },
        ],
        ok: L(
          "To'g'ri. Ular kirish joyi bilan farq qiladi, chiqishda esa o'xshashlik turadi.",
          'Верно. Они отличаются входом, а на выходе подобие.',
          'Correct. They differ at the entrance, and at the exit stands similarity.',
        ),
        hint: L(
          "8-ekranni eslang: uchta kirish, bitta chiqish.",
          'Вспомни 8 экран: три входа, один выход.',
          'Recall screen 8: three entrances, one exit.',
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
    "Burchaklar bo'lmasa, tomonlar bor",
    'Нет углов — есть стороны',
    'No angles, but there are sides',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda birorta burchak berilmagandi, lekin o'xshashlikni aniqlash baribir mumkin bo'ldi.",
      'На первом экране не было дано ни одного угла, но подобие всё равно удалось определить.',
      'On the first screen not a single angle was given, yet similarity could still be settled.'),
    A('s1',
      "Siz ikkita yangi alomatni chiqardingiz, ularni tanlashni o'rgandingiz va bissektrisa haqidagi natijani oldingiz.",
      'Ты вывел два новых признака, научился их выбирать и получил результат о биссектрисе.',
      'You derived two new criteria, learned to choose between them, and obtained the bisector result.'),
    A('s2',
      "Keyingi darsda gomotetiya.",
      'В следующем уроке гомотетия.',
      'The next lesson covers homothety.'),
  ],
  props: {
    mark: 'TTT   ·   TBT   ·   BB',
    markNote: L(
      "uchta kirish, bitta xulosa",
      'три входа, один вывод',
      'three entrances, one conclusion',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: gomotetiya',
      'Следующий урок: гомотетия',
      'Next lesson: homothety',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'alomatni-notogri-tanlash', ...S2 },
  { role: 'explain',  tag: 'uchinchi-nisbatni-tekshirmaslik', ...S3 },
  { role: 'explain',  tag: 'burchak-tomonlar-orasida-emas', ...S4 },
  { role: 'explain',  tag: 'alomatni-notogri-tanlash', ...S5 },
  { role: 'explain',  tag: 'mos-tomonlarni-adashtirish', ...S6 },
  { role: 'explain',  tag: 'alomatni-notogri-tanlash', ...S7 },
  { role: 'rule',     tag: 'alomatni-notogri-tanlash', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'uchinchi-nisbatni-tekshirmaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'alomatni-notogri-tanlash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'mos-tomonlarni-adashtirish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'uchinchi-nisbatni-tekshirmaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'mos-tomonlarni-adashtirish', ...S13 },
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
