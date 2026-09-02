// ============================================================================
// 9-sinf, Dars 41. GOMOTETIYA.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 20-dars (62-63-bet).
//   Ta'rif (62-bet): O nuqta va musbat k soni berilgan. F shaklning har
//       bir X nuqtasi uchun OX nurida OX₁ = k · OX bo'ladigan X₁ nuqta
//       olinadi. Bunday almashtirish GOMOTETIYA, O uning markazi,
//       k esa koeffitsienti.
//   Teorema (62-bet): gomotetiya — O'XSHASHLIK ALMASHTIRISHI.
//       Isbot: XOY va X₁OY₁ uchburchaklarda ∠O umumiy va
//       OX₁/OX = OY₁/OY = k, demak ular IKKINCHI ALOMAT bo'yicha
//       o'xshash (40-dars!), shundan X₁Y₁ = k · XY.
//   4-rasm (63-bet): 0 < k < 1 da shakl siqiladi, k ≥ 1 da cho'ziladi.
//   20.4: perimetrlari 18 va 27 bo'lgan ikkita romb gomotetik →
//       k = 3/2, yuzlar nisbati 9/4.
//   20.7: aylanaga gomotetik shakl yana aylana bo'ladi.
//
// DARS 36-DARSGA JAVOB BERADI. U yerda uchta almashtirish ko'rilgandi
// va ularning hammasi HARAKAT edi — masofani saqlardi. Tabiiy savol
// ochiq qolgandi: masofani o'zgartiradigan almashtirish bormi.
// Gomotetiya aynan shunday: u masofani k marta ko'paytiradi va
// shuning uchun harakat EMAS. Xuk shu qarama-qarshilikdan boshlanadi.
//
// DARS 40-DARSGA HAM TAYANADI: gomotetiyaning o'xshashlik ekani
// ikkinchi alomat bilan isbotlanadi (umumiy burchak va ikkita
// proporsional tomon). Ya'ni kecha o'rganilgan alomat bugun ISHGA
// tushadi — bu 4-ekranda ochiq ko'rsatiladi.
//
// TUZOQ (12-ekran): gomotetiyada yuz ham k marta ortadi deb hisoblash.
// Aslida yuz k KVADRAT marta ortadi, chunki gomotetiya o'xshashlik
// beradi (35-dars). Ekran uni 20.4-mashqning sonlari bilan yiqitadi.
//
// TRANSFER (13-ekran): 20.7-mashqning ma'nosi — istalgan ikkita aylana
// gomotetik, koeffitsienti radiuslar nisbatiga teng. Shundan chiqadiki,
// BARCHA aylanalar o'zaro o'xshash, uchburchaklardan farqli.
//
// CHIZMA: `PolyPair` va `CircleFig` qayta ishlatildi, yangi asbob yo'q.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, PolyPair, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-41',
  n: 41,
  row: 41,
  block: 'Б7',
  topic: L('Gomotetiya', 'Гомотетия', 'Homothety'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Gomotetiyada har bir nuqta OX nurida OX₁ = k · OX shartiga ko'ra siljiydi",
    'При гомотетии каждая точка сдвигается по лучу OX так, что OX₁ = k · OX',
    'In a homothety each point moves along the ray OX so that OX₁ = k · OX',
  ),
  L(
    "Gomotetiya harakat emas: u masofani saqlamaydi, k marta ko'paytiradi",
    'Гомотетия не движение: она не сохраняет расстояние, а умножает его на k',
    'A homothety is no motion: it does not preserve distance but multiplies it by k',
  ),
  L(
    "Gomotetik shakllar o'xshash, ularning yuzlari nisbati esa k kvadratga teng",
    'Гомотетичные фигуры подобны, а отношение их площадей равно k в квадрате',
    'Homothetic figures are similar and their areas are in ratio k squared',
  ),
]

export const MISS = {
  'gomotetiya-harakat-emas': {
    what: L(
      "gomotetiya harakat deb hisoblandi",
      'гомотетия сочтена движением',
      'the homothety was taken for a motion',
    ),
    wrong: null,
    at: 0,
  },
  'yuz-k-marta': {
    what: L(
      "yuz k marta ortadi deb olindi, k kvadrat o'rniga",
      'принято, что площадь растёт в k раз, а не в k в квадрате',
      'the area was taken to grow by k instead of k squared',
    ),
    wrong: null,
    at: 0,
  },
  'markazdan-hisoblamaslik': {
    what: L(
      "masofa markazdan emas, boshqa nuqtadan o'lchandi",
      'расстояние отмерено не от центра, а от другой точки',
      'the distance was measured from a point other than the centre',
    ),
    wrong: null,
    at: 0,
  },
  'k-birdan-kichik': {
    what: L(
      "k birdan kichik bo'lganda shakl kattaradi deb o'ylandi",
      'при k меньше единицы решено, что фигура увеличится',
      'with k below one the figure was thought to grow',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — 36-darsning ochiq savoli.
// ============================================================
const F_SM = { pts: [[0, 0], [1.2, 0], [1.2, 0.9], [0.6, 1.4], [0, 0.9]], sides: [] }
const F_BIG = { pts: [[0, 0], [2.4, 0], [2.4, 1.8], [1.2, 2.8], [0, 1.8]], sides: [] }

const S1 = {
  eyebrow: L('HARAKATMI', 'ДВИЖЕНИЕ ЛИ', 'IS IT A MOTION'),
  title: L(
    "Shakl kattalashdi, lekin shakli o'zgarmadi",
    'Фигура выросла, но форма не изменилась',
    'The figure grew, its shape did not',
  ),
  audio: [
    A('mount',
      "O nuqtadan chiquvchi nurlar bo'ylab kichik shakl kattaroq shaklga o'tkazilgan. Uning burchaklari o'sha, tomonlari esa ikki barobar uzun.",
      'Вдоль лучей из точки O малая фигура переведена в большую. Углы у неё те же, а стороны вдвое длиннее.',
      'Along rays from O the small figure has been carried into a larger one. Its angles are the same, its sides twice as long.'),
    A('why',
      "36-darsda uchta almashtirish ko'rgandik va hammasi harakat edi. Bu almashtirish ham harakatmi?",
      'На 36 уроке мы видели три преобразования, и все были движениями. Это преобразование тоже движение?',
      'In lesson 36 we saw three transformations and all were motions. Is this one a motion too?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={F_SM} b={F_BIG} sameScale />}
      steps={[]}
      ask={L(
        "Bu almashtirish harakat bo'la oladimi?",
        'Может ли это преобразование быть движением?',
        'Can this transformation be a motion?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Yo'q: masofalar ikki barobar ortdi",
            'Нет: расстояния выросли вдвое',
            'No: the distances doubled',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Ha: burchaklar saqlandi, demak harakat",
            'Да: углы сохранились, значит движение',
            'Yes: the angles survived, so it is a motion',
          ),
          hint: L(
            "Harakatning ta'rifi burchaklar haqida emas edi. 36-darsda u masofa haqida edi, bu yerda esa masofa o'zgardi.",
            'Определение движения было не про углы. На 36 уроке оно было про расстояние, а здесь расстояние изменилось.',
            'The definition of a motion was not about angles. In lesson 36 it was about distance, and here the distance changed.',
          ),
        },
      ]}
      after={L(
        "Ha. 36-darsda barcha almashtirishlar masofani saqlardi. Bugun birinchi marta uni O'ZGARTIRADIGAN almashtirishni ko'ramiz, uning nomi gomotetiya.",
        'Да. На 36 уроке все преобразования сохраняли расстояние. Сегодня впервые увидим то, которое его МЕНЯЕТ, оно называется гомотетией.',
        'Yes. In lesson 36 every transformation preserved distance. Today we meet the first one that CHANGES it, called a homothety.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — harakatning ta'rifi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Harakat nimani saqlardi",
    'Что сохраняло движение',
    'What a motion preserved',
  ),
  audio: [
    A('mount',
      "36-darsning ta'rifini eslaymiz. Harakat deb nuqtalar orasidagi masofani saqlaydigan almashtirishga aytilardi.",
      'Вспомним определение с 36 урока. Движением называлось преобразование, сохраняющее расстояние между точками.',
      'Recall the definition from lesson 36. A motion was a transformation preserving the distance between points.'),
    A('why',
      "35-darsda esa o'xshashlikda masofalar k marta o'zgarardi.",
      'А на 35 уроке при подобии расстояния менялись в k раз.',
      'And in lesson 35 similarity changed distances by a factor of k.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Almashtirish masofani k marta ko'paytiradi, k ≠ 1",
        'Преобразование умножает расстояние на k, k ≠ 1',
        'A transformation multiplies distance by k, with k ≠ 1',
      )}
      steps={[]}
      ask={L(
        "Bunday almashtirish harakat bo'ladimi?",
        'Будет ли такое преобразование движением?',
        'Is such a transformation a motion?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Yo'q", 'Нет', 'No') },
        {
          id: 'wrong',
          label: L('Ha', 'Да', 'Yes'),
          hint: L(
            "Harakat masofani o'zgartirmasligi kerak. k birga teng bo'lmasa, masofa albatta o'zgaradi.",
            'Движение не должно менять расстояние. Если k не равно единице, расстояние обязательно изменится.',
            'A motion must leave distance alone. If k is not one, the distance certainly changes.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Demak masofani o'zgartiradigan almashtirishlar alohida turkum. Bugun ularning eng oddiysi bilan tanishamiz.",
        'Верно. Значит преобразования, меняющие расстояние, это отдельный класс. Сегодня познакомимся с простейшим из них.',
        'Correct. So transformations that change distance form their own class. Today we meet the simplest of them.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ta'rif.
// ============================================================
const S3 = {
  eyebrow: L('TA\'RIF', 'ОПРЕДЕЛЕНИЕ', 'THE DEFINITION'),
  title: L(
    "Markaz, nur va koeffitsient",
    'Центр, луч и коэффициент',
    'A centre, a ray, and a factor',
  ),
  audio: [
    A('mount',
      "O nuqta va musbat k soni beriladi. Har bir X nuqta uchun O dan X orqali nur o'tkaziladi.",
      'Даны точка O и положительное число k. Через каждую точку X из O проводится луч.',
      'A point O and a positive number k are given. Through each point X a ray is drawn from O.'),
    A('why',
      "Shu nurda O dan boshlab OX ning k barobariga teng masofa o'lchanadi. O'sha yerda X birinchi nuqta turadi.",
      'На этом луче от O отмеряется расстояние, равное k длинам OX. Там и стоит точка X первое.',
      'Along that ray a distance of k times OX is measured from O. There sits the point X one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('OX = 5,   k = 2', 'OX = 5,   k = 2', 'OX = 5,   k = 2')}
      steps={[]}
      ask={L(
        "OX₁ masofasi nechaga teng?",
        'Чему равно расстояние OX₁?',
        'What does the distance OX₁ equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '10' },
        {
          id: 'wrong',
          label: '7',
          hint: L(
            "Yetti beshga ikkini QO'SHGANDA chiqadi. Gomotetiyada esa masofa k ga KO'PAYTIRILADI.",
            'Семь выходит при СЛОЖЕНИИ пяти и двух. А при гомотетии расстояние УМНОЖАЕТСЯ на k.',
            'Seven comes from ADDING two to five. A homothety MULTIPLIES the distance by k.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Diqqat: masofa har doim MARKAZDAN o'lchanadi, boshqa nuqtadan emas. Markaz esa o'z joyida qoladi.",
        'Верно. Внимание: расстояние всегда отмеряется от ЦЕНТРА, а не от другой точки. Сам центр остаётся на месте.',
        'Correct. Note: the distance is always measured from the CENTRE, not from any other point. The centre itself stays put.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — isbot 40-dars orqali.
// ============================================================
const S4 = {
  eyebrow: L('KECHAGI ALOMAT ISHGA TUSHDI', 'ВЧЕРАШНИЙ ПРИЗНАК В ДЕЛЕ', 'YESTERDAY CRITERION AT WORK'),
  title: L(
    "Nega gomotetiya o'xshashlik beradi",
    'Почему гомотетия даёт подобие',
    'Why a homothety yields similarity',
  ),
  audio: [
    A('mount',
      "Ikkita nuqta X va Y ni olamiz, ularning akslari X birinchi va Y birinchi. O, X, Y uchburchagini va O, X birinchi, Y birinchi uchburchagini qaraymiz.",
      'Возьмём две точки X и Y и их образы X первое и Y первое. Рассмотрим треугольники O X Y и O X первое Y первое.',
      'Take two points X and Y with images X one and Y one. Consider the triangles O X Y and O X one Y one.'),
    A('why',
      "Bu ikkita uchburchakda O burchagi umumiy, tomonlarning nisbati esa ikkalasida ham k ga teng.",
      'В этих двух треугольниках угол O общий, а отношение сторон в обоих равно k.',
      'These two triangles share the angle O, and both side ratios equal k.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'OX₁ : OX = OY₁ : OY = k,   ∠O — umumiy',
        'OX₁ : OX = OY₁ : OY = k,   ∠O — общий',
        'OX₁ : OX = OY₁ : OY = k,   ∠O is shared',
      )}
      steps={[]}
      ask={L(
        "Qaysi alomat bu uchburchaklarning o'xshashligini beradi?",
        'Какой признак даёт подобие этих треугольников?',
        'Which criterion gives the similarity of these triangles?',
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
          label: L('Birinchi: ikkita burchak', 'Первый: два угла', 'The first: two angles'),
          hint: L(
            "Bizda faqat BITTA burchak bor, u ham umumiy. Qolgan ma'lumot esa tomonlarning nisbati.",
            'У нас только ОДИН угол, и тот общий. Остальные данные это отношения сторон.',
            'We have only ONE angle, and it is the shared one. The rest of the data are side ratios.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. 40-darsda o'rgangan ikkinchi alomat aynan shu yerda ishlaydi. Shundan X birinchi Y birinchi teng k karra XY kelib chiqadi: gomotetiya o'xshashlik almashtirishi.",
        'Верно. Второй признак, изученный на 40 уроке, работает именно здесь. Отсюда X первое Y первое равно k на XY: гомотетия это преобразование подобия.',
        'Correct. The second criterion from lesson 40 works exactly here. Hence X one Y one equals k times XY: a homothety is a similarity transformation.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — k kichik va katta.
// ============================================================
const S5 = {
  eyebrow: L('SIQILISH VA CHO\'ZILISH', 'СЖАТИЕ И РАСТЯЖЕНИЕ', 'SHRINKING AND STRETCHING'),
  title: L(
    "k birdan kichik bo'lsa nima bo'ladi",
    'Что будет, если k меньше единицы',
    'What happens when k is below one',
  ),
  audio: [
    A('mount',
      "Darslikning to'rtinchi rasmida ikkita hol ko'rsatilgan. Birinchisida koeffitsient birdan kichik, ikkinchisida birdan katta.",
      'На четвёртом рисунке учебника показаны два случая. В первом коэффициент меньше единицы, во втором больше.',
      'The fourth figure in the textbook shows two cases. In the first the factor is below one, in the second above.'),
    A('why',
      "Masofa k ga ko'paytirilsa va k kichik bo'lsa, natija kichrayadi.",
      'Если расстояние умножается на k и k мало, результат уменьшается.',
      'If the distance is multiplied by k and k is small, the result shrinks.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('k = 1/2', 'k = 1/2', 'k = 1/2')}
      steps={[
        { id: 'a', head: L('Masofa', 'Расстояние', 'The distance'), lines: ['OX = 8'] },
      ]}
      ask={L(
        "Shakl kattalashadimi yoki kichrayadimi?",
        'Фигура увеличится или уменьшится?',
        'Will the figure grow or shrink?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Kichrayadi', 'Уменьшится', 'It shrinks') },
        {
          id: 'wrong',
          label: L('Kattalashadi', 'Увеличится', 'It grows'),
          hint: L(
            "Sakkizni bir ikkidanga ko'paytiring: to'rt chiqadi. To'rt esa sakkizdan kichik.",
            'Умножь восемь на одну вторую: получится четыре. А четыре меньше восьми.',
            'Multiply eight by one half: that gives four. And four is less than eight.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Koeffitsient birdan kichik bo'lsa shakl siqiladi, birdan katta bo'lsa cho'ziladi. Bir bo'lsa esa shakl umuman o'zgarmaydi.",
        'Верно. При коэффициенте меньше единицы фигура сжимается, больше единицы растягивается. А при единице фигура не меняется вовсе.',
        'Correct. Below one the figure shrinks, above one it stretches. At exactly one it does not change at all.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — yuzlar.
// ============================================================
const S6 = {
  eyebrow: L('YUZLAR', 'ПЛОЩАДИ', 'THE AREAS'),
  title: L(
    "Gomotetiya o'xshashlik bergani uchun",
    'Раз гомотетия даёт подобие',
    'Since a homothety gives similarity',
  ),
  audio: [
    A('mount',
      "Gomotetiya o'xshashlik almashtirishi ekanini isbotladik. Demak 35-darsning barcha natijalari unga ham tegishli.",
      'Мы доказали, что гомотетия это преобразование подобия. Значит все результаты 35 урока к ней тоже относятся.',
      'We proved a homothety is a similarity transformation. So every result of lesson 35 applies to it as well.'),
    A('why',
      "U yerda perimetrlar k marta, yuzlar esa k kvadrat marta o'zgarardi.",
      'Там периметры менялись в k раз, а площади в k квадрат раз.',
      'There perimeters changed by k and areas by k squared.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('k = 3', 'k = 3', 'k = 3')}
      steps={[]}
      ask={L(
        "Gomotetiyada figuraning yuzi necha marta ortadi?",
        'Во сколько раз вырастет площадь фигуры при гомотетии?',
        'By what factor does the area grow under a homothety?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('9 marta', 'В 9 раз', '9 times') },
        {
          id: 'wrong',
          label: L('3 marta', 'В 3 раза', '3 times'),
          hint: L(
            "Uch marta uzunliklar ortadi. Yuz esa ikki o'lchamli, shuning uchun koeffitsient kvadratga ko'tariladi.",
            'В три раза растут длины. А площадь двумерна, поэтому коэффициент возводится в квадрат.',
            'Lengths grow threefold. An area is two dimensional, so the factor gets squared.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Gomotetiya yangi qoida keltirmaydi, u 35-darsning qoidalarini o'zi bilan olib keladi.",
        'Верно. Гомотетия не приносит новых правил, она приводит с собой правила 35 урока.',
        'Correct. A homothety brings no new rules, it brings along the rules of lesson 35.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — darslikning 20.4-mashqi.
// ============================================================
const S7 = {
  eyebrow: L('IKKITA ROMB', 'ДВА РОМБА', 'TWO RHOMBI'),
  title: L(
    "Perimetrdan koeffitsientga",
    'От периметра к коэффициенту',
    'From the perimeter to the factor',
  ),
  audio: [
    A('mount',
      "Ikkita romb gomotetik. Ularning perimetrlari o'n sakkiz va yigirma yetti.",
      'Два ромба гомотетичны. Их периметры восемнадцать и двадцать семь.',
      'Two rhombi are homothetic. Their perimeters are eighteen and twenty seven.'),
    A('why',
      "Perimetrlar nisbati koeffitsientga teng edi, tomonlar nisbati ham o'shanday.",
      'Отношение периметров равнялось коэффициенту, отношение сторон такое же.',
      'The ratio of perimeters equalled the factor, and so does the ratio of sides.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('P₁ = 18,   P₂ = 27', 'P₁ = 18,   P₂ = 27', 'P₁ = 18,   P₂ = 27')}
      steps={[
        { id: 'a', head: L('Koeffitsient', 'Коэффициент', 'The factor'), lines: ['27 : 18 = 3/2'] },
      ]}
      ask={L(
        "Bu romblarning yuzlari nisbati nechaga teng?",
        'Чему равно отношение площадей этих ромбов?',
        'What is the ratio of the areas of these rhombi?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '9/4' },
        {
          id: 'wrong',
          label: '3/2',
          hint: L(
            "Uch ikkidan bu TOMONLARNING nisbati. Yuzlar uchun uni kvadratga ko'tarish kerak.",
            'Три вторых это отношение СТОРОН. Для площадей его нужно возвести в квадрат.',
            'Three halves is the ratio of the SIDES. For areas it must be squared.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch ikkidanning kvadrati to'qqiz to'rtdan. Bu darslikning yigirma nuqta to'rtinchi mashqi.",
        'Верно. Квадрат трёх вторых это девять четвёртых. Это задача двадцать точка четыре учебника.',
        'Correct. Three halves squared is nine quarters. This is exercise twenty point four.',
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
    'Geometriya 9, 20-dars (62-63-bet)',
    'Геометрия 9, урок 20 (стр. 62-63)',
    'Geometry 9, lesson 20 (p. 62-63)',
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
          "Gomotetiya harakatlar turkumiga kiradimi?",
          'Относится ли гомотетия к движениям?',
          'Does a homothety belong to the motions?',
        )}
        cols={2}
        items={[
          { id: 'right', right: true, label: L("Yo'q", 'Нет', 'No') },
          {
            id: 'wrong',
            label: L('Ha', 'Да', 'Yes'),
            hint: L(
              "1-ekranni eslang: shakl kattalashdi, ya'ni masofalar o'zgardi. Harakat esa masofani saqlashi kerak edi.",
              'Вспомни 1 экран: фигура выросла, значит расстояния изменились. А движение должно было расстояние сохранять.',
              'Recall screen 1: the figure grew, so distances changed. A motion had to preserve distance.',
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
    "Masofani o'zgartiradigan birinchi almashtirish",
    'Первое преобразование, меняющее расстояние',
    'The first transformation that changes distance',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz gomotetiyaning ta'rifini, isbotini va natijalarini ko'rdingiz.",
      'На семи экранах ты увидел определение гомотетии, её доказательство и следствия.',
      'On seven screens you met the definition of a homothety, its proof, and its consequences.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — nuqtaning aksi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Markazdan o'lchang",
    'Отмеряй от центра',
    'Measure from the centre',
  ),
  audio: [
    A('mount',
      "Uchta masala. Har birida markazdan nuqtagacha bo'lgan masofa va koeffitsient berilgan.",
      'Три задачи. В каждой даны расстояние от центра до точки и коэффициент.',
      'Three problems. Each gives the distance from the centre to a point and the factor.'),
    A('why',
      "Ko'paytiring, qo'shmang.",
      'Умножай, не складывай.',
      'Multiply, do not add.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Koeffitsient birdan kichik bo'lsa nuqta markazga yaqinlashadi, katta bo'lsa uzoqlashadi.",
      'Все три найдены. При коэффициенте меньше единицы точка приближается к центру, больше единицы удаляется.',
      'All three are found. Below one the point moves toward the centre, above one away from it.',
    ),
    tasks: [
      {
        expr: 'OX = 6,   k = 3',
        question: L('OX₁ nechaga teng?', 'Чему равно OX₁?', 'What does OX₁ equal?'),
        ok: L("Ha, o'n sakkiz. Olti karra uch.", 'Да, восемнадцать. Шесть на три.', 'Yes, eighteen. Six times three.'),
        items: [
          { id: 'a', right: true, label: '18' },
          { id: 'b', label: '9', hint: L("To'qqiz oltiga uchni QO'SHGANDA chiqadi. Gomotetiyada esa ko'paytiriladi.", 'Девять выходит при СЛОЖЕНИИ шести и трёх. А при гомотетии умножают.', 'Nine comes from ADDING three to six. A homothety multiplies.') },
        ],
        solution: ['OX₁ = 3 · 6 = 18'],
      },
      {
        expr: 'OX = 12,   k = 1/3',
        question: L('OX₁ nechaga teng?', 'Чему равно OX₁?', 'What does OX₁ equal?'),
        ok: L("Ha, to'rt. Koeffitsient birdan kichik, demak nuqta markazga yaqinlashdi.", 'Да, четыре. Коэффициент меньше единицы, значит точка приблизилась к центру.', 'Yes, four. The factor is below one, so the point moved toward the centre.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '36', hint: L("O'ttiz olti o'n ikkini UCHGA ko'paytirganda chiqadi. Koeffitsient esa bir uchdan, ya'ni uchga bo'lish.", 'Тридцать шесть выходит при умножении двенадцати НА ТРИ. А коэффициент одна третья, то есть деление на три.', 'Thirty six comes from multiplying twelve BY three. The factor is one third, that is dividing by three.') },
        ],
        solution: ['OX₁ = 12 : 3 = 4'],
      },
      {
        expr: 'XY = 6,   k = 2,5',
        question: L('X₁Y₁ nechaga teng?', 'Чему равно X₁Y₁?', 'What does X₁Y₁ equal?'),
        ok: L("Ha, o'n besh. Kesmalar ham xuddi masofalar kabi k marta ortadi.", 'Да, пятнадцать. Отрезки, как и расстояния, растут в k раз.', 'Yes, fifteen. Segments, like distances, grow by k.'),
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '8,5', hint: L("Sakkiz butun besh o'ndan oltiga ikki butun besh o'ndanni qo'shganda chiqadi. Bu yerda esa ko'paytirish kerak.", 'Восемь целых пять десятых выходит при сложении шести и двух с половиной. А здесь нужно умножать.', 'Eight point five comes from adding two and a half to six. Here multiplication is needed.') },
        ],
        solution: ['X₁Y₁ = 2,5 · 6 = 15'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — koeffitsientni topish.
// ============================================================
const S10 = {
  eyebrow: L('KOEFFITSIENTNI TOPISH', 'НАХОДИМ КОЭФФИЦИЕНТ', 'FINDING THE FACTOR'),
  title: L(
    "Teskari yo'nalish",
    'В обратную сторону',
    'The other direction',
  ),
  audio: [
    A('mount',
      "Endi ikkita o'lchov berilgan, koeffitsientni topish kerak.",
      'Теперь даны два измерения, а найти нужно коэффициент.',
      'Now two measurements are given and the factor must be found.'),
    A('why',
      "Koeffitsient bu aksning aslga nisbati.",
      'Коэффициент это отношение образа к оригиналу.',
      'The factor is the ratio of the image to the original.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Perimetr uzunlik bo'lgani uchun uning nisbati to'g'ridan-to'g'ri koeffitsientni beradi, yuz esa oldin ildiz olishni talab qiladi.",
      'Обе найдены. Периметр это длина, поэтому его отношение сразу даёт коэффициент, а площадь сначала требует корня.',
      'Both are found. A perimeter is a length, so its ratio gives the factor at once, while an area needs a root first.',
    ),
    tasks: [
      {
        expr: 'P₁ = 20,   P₂ = 50',
        question: L('Koeffitsient nechaga teng?', 'Чему равен коэффициент?', 'What does the factor equal?'),
        ok: L("Ha. Ellik bo'lingan yigirma, ikki butun besh o'ndan.", 'Да. Пятьдесят на двадцать, две целых пять десятых.', 'Yes. Fifty over twenty is two point five.'),
        items: [
          { id: 'a', right: true, label: 'k = 2,5' },
          { id: 'b', label: 'k = 30', hint: L("O'ttiz bu perimetrlarning AYIRMASI. Koeffitsient esa nisbat.", 'Тридцать это РАЗНОСТЬ периметров. А коэффициент это отношение.', 'Thirty is the DIFFERENCE of the perimeters. The factor is a ratio.') },
        ],
        solution: ['k = 50 : 20 = 2,5'],
      },
      {
        expr: 'S₁ = 4,   S₂ = 36',
        question: L('Koeffitsient nechaga teng?', 'Чему равен коэффициент?', 'What does the factor equal?'),
        ok: L("Ha, uchga. Yuzlar nisbati to'qqiz, uning ildizi esa uch.", 'Да, трём. Отношение площадей девять, а его корень три.', 'Yes, three. The area ratio is nine and its root is three.'),
        items: [
          { id: 'a', right: true, label: 'k = 3' },
          { id: 'b', label: 'k = 9', hint: L("To'qqiz bu YUZLARNING nisbati, ya'ni k kvadrat. Koeffitsientning o'zi uchun ildiz olish kerak.", 'Девять это отношение ПЛОЩАДЕЙ, то есть k в квадрате. Для самого коэффициента нужен корень.', 'Nine is the ratio of AREAS, that is k squared. The factor itself needs a root.') },
        ],
        solution: ['36 : 4 = 9', 'k = √9 = 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — aylanalar.
// ============================================================
const S11 = {
  eyebrow: L('AYLANALAR', 'ОКРУЖНОСТИ', 'CIRCLES'),
  title: L(
    "Aylananing aksi yana aylana",
    'Образ окружности снова окружность',
    'The image of a circle is a circle',
  ),
  audio: [
    A('mount',
      "Darslikning yigirma nuqta yettinchi mashqida shunday deyilgan. Aylanaga gomotetik shakl yana aylana bo'ladi.",
      'В задаче двадцать точка семь учебника сказано так. Фигура, гомотетичная окружности, снова окружность.',
      'Exercise twenty point seven says this. A figure homothetic to a circle is again a circle.'),
    A('why',
      "Radius ham boshqa kesmalar kabi k marta o'zgaradi.",
      'Радиус, как и другие отрезки, меняется в k раз.',
      'The radius, like any segment, changes by a factor of k.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Gomotetiya aylanani aylanaga, to'g'ri chiziqni to'g'ri chiziqqa o'tkazadi, faqat o'lchamini o'zgartiradi.",
      'Обе найдены. Гомотетия переводит окружность в окружность, прямую в прямую, меняя только размер.',
      'Both are found. A homothety sends a circle to a circle and a line to a line, changing only the size.',
    ),
    tasks: [
      {
        expr: 'R = 6,   k = 1/2',
        question: L('Yangi radius nechaga teng?', 'Чему равен новый радиус?', 'What is the new radius?'),
        ok: L("Ha, uch. Radius ham k marta o'zgaradi.", 'Да, три. Радиус тоже меняется в k раз.', 'Yes, three. The radius changes by k as well.'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '12', hint: L("O'n ikki radiusni IKKIGA ko'paytirganda chiqadi. Koeffitsient esa bir ikkidan.", 'Двенадцать выходит при умножении радиуса НА ДВА. А коэффициент одна вторая.', 'Twelve comes from multiplying the radius BY two. The factor is one half.') },
        ],
        solution: ['R₁ = 6 : 2 = 3'],
      },
      {
        expr: 'R₁ = 3,   R₂ = 5',
        question: L(
          "Bu ikkita aylanani bog'laydigan koeffitsient nechaga teng?",
          'Чему равен коэффициент, связывающий эти две окружности?',
          'What factor links these two circles?',
        ),
        ok: L("Ha, besh uchdan. Har qanday ikkita aylana gomotetik bo'la oladi.", 'Да, пять третьих. Любые две окружности могут быть гомотетичны.', 'Yes, five thirds. Any two circles can be homothetic.'),
        items: [
          { id: 'a', right: true, label: 'k = 5/3' },
          { id: 'b', label: 'k = 2', hint: L("Ikki radiuslarning AYIRMASI. Koeffitsient esa ularning nisbati: besh bo'lingan uch.", 'Два это РАЗНОСТЬ радиусов. А коэффициент их отношение: пять на три.', 'Two is the DIFFERENCE of the radii. The factor is their ratio: five over three.') },
        ],
        solution: ['k = R₂ : R₁ = 5/3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — yuz k marta.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Yuz ham k marta ortadimi",
    'Растёт ли площадь тоже в k раз',
    'Does the area also grow by k',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Koeffitsient ikki, kichik figuraning yuzi besh. U kattasining yuzini o'n deb yozgan.",
      'Решение Камрона. Коэффициент два, площадь малой фигуры пять. Он записал площадь большой как десять.',
      "Kamron's solution. The factor is two and the small figure has area five. He wrote the large area as ten."),
    A('why',
      "Uzunliklar haqiqatan ham ikki barobar ortadi. Lekin yuz uzunlik emas.",
      'Длины и правда растут вдвое. Но площадь это не длина.',
      'Lengths really do double. But an area is not a length.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Gomotetiya o'xshashlik almashtirishi, demak 35-darsning qoidasi to'liq ishlaydi: uzunliklar k marta, yuzlar esa k kvadrat marta. Kamronning javobi ikki barobar kichik.",
      'Гомотетия это преобразование подобия, значит правило 35 урока работает целиком: длины в k раз, площади в k квадрат раз. Ответ Камрона вдвое меньше нужного.',
      'A homothety is a similarity transformation, so the rule of lesson 35 applies in full: lengths by k, areas by k squared. Kamron answer is half of what it should be.',
    ),
    tasks: [
      {
        expr: 'k = 2,   S = 5   →   S₁ = 10 ?',
        question: L(
          "Tomoni bir bo'lgan kvadratni ikki koeffitsienti bilan gomotetiya qilsak, yuzi necha marta ortadi?",
          'Если квадрат со стороной один подвергнуть гомотетии с коэффициентом два, во сколько раз вырастет площадь?',
          'If a square of side one undergoes a homothety of factor two, by what factor does the area grow?',
        ),
        ok: L(
          "To'g'ri, to'rt marta. Demak javob yigirma, o'n emas.",
          'Верно, в четыре раза. Значит ответ двадцать, а не десять.',
          'Correct, fourfold. So the answer is twenty, not ten.',
        ),
        items: [
          { id: 'a', right: true, label: L('4 marta', 'В 4 раза', '4 times') },
          {
            id: 'b',
            label: L('2 marta', 'В 2 раза', '2 times'),
            hint: L(
              "Yangi kvadratning tomoni ikki, yuzi esa ikki karra ikki. Eski yuz bir edi, demak nisbat to'rt.",
              'Сторона нового квадрата два, а площадь два на два. Старая площадь была единица, значит отношение четыре.',
              'The new square has side two and area two times two. The old area was one, so the ratio is four.',
            ),
          },
        ],
        solution: [
          'S₁ : S = k² = 4',
          'S₁ = 5 · 4 = 20',
          L('Kamron: 5 · 2 = 10', 'Камрон: 5 · 2 = 10', 'Kamron: 5 · 2 = 10'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — nega barcha aylanalar o'xshash.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Nega barcha aylanalar o'xshash",
    'Почему все окружности подобны',
    'Why all circles are similar',
  ),
  audio: [
    A('mount',
      "Uchburchaklar orasida o'xshash bo'lmaganlari ko'p. Aylanalar bilan esa boshqacha.",
      'Среди треугольников много неподобных. С окружностями иначе.',
      'Among triangles many are not similar. With circles it is otherwise.'),
    A('why',
      "Istalgan ikkita aylanani oling. Ularni gomotetiya bilan bog'lash mumkinmi?",
      'Возьми любые две окружности. Можно ли связать их гомотетией?',
      'Take any two circles. Can a homothety link them?'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Aylananing shaklini bitta son, radius belgilaydi. Shuning uchun har qanday ikkita aylanani gomotetiya bog'laydi va ular har doim o'xshash. Uchburchakda esa uchta son bor, ularning nisbatlari mos kelmasligi mumkin.",
      'Форму окружности задаёт одно число, радиус. Поэтому любые две окружности связывает гомотетия и они всегда подобны. А у треугольника три числа, и их отношения могут не совпасть.',
      'A circle shape is fixed by one number, the radius. So a homothety links any two circles and they are always similar. A triangle has three numbers, and their ratios need not agree.',
    ),
    tasks: [
      {
        expr: 'R₁ = 4,   R₂ = 10',
        question: L(
          "Bu aylanalarni bog'laydigan koeffitsient bormi?",
          'Существует ли коэффициент, связывающий эти окружности?',
          'Is there a factor linking these circles?',
        ),
        ok: L(
          "Ha, ikki butun besh o'ndan. O'n bo'lingan to'rt.",
          'Да, две целых пять десятых. Десять на четыре.',
          'Yes, two point five. Ten over four.',
        ),
        items: [
          { id: 'a', right: true, label: L('Ha, k = 2,5', 'Да, k = 2,5', 'Yes, k = 2.5') },
          {
            id: 'b',
            label: L("Yo'q, radiuslar juda farq qiladi", 'Нет, радиусы слишком разные', 'No, the radii differ too much'),
            hint: L(
              "Koeffitsient istalgan musbat son bo'lishi mumkin, u chegaralanmagan. To'rtni ikki butun besh o'ndanga ko'paytiring.",
              'Коэффициент может быть любым положительным числом, он не ограничен. Умножь четыре на две с половиной.',
              'The factor may be any positive number, it is not bounded. Multiply four by two and a half.',
            ),
          },
        ],
        solution: ['k = 10 : 4 = 2,5'],
      },
      {
        expr: 'a : a₁ = b : b₁ = c : c₁',
        question: L(
          "Istalgan ikkita uchburchak ham shunday bog'lanadimi?",
          'Так же ли связаны любые два треугольника?',
          'Are any two triangles linked the same way?',
        ),
        ok: L(
          "Yo'q. Uchburchakda uchta tomon bor va ularning nisbatlari mos kelmasligi mumkin, aylanada esa faqat bitta o'lcham.",
          'Нет. У треугольника три стороны, и их отношения могут не совпасть, а у окружности лишь один размер.',
          'No. A triangle has three sides whose ratios may disagree, while a circle has only one size.',
        ),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          {
            id: 'b',
            label: L('Ha', 'Да', 'Yes'),
            hint: L(
              "40-darsni eslang: uchta nisbatdan bittasi farq qilsa, o'xshashlik yo'q edi. Aylanada esa tekshiriladigan nisbat bitta.",
              'Вспомни 40 урок: если хоть одно из трёх отношений отличается, подобия нет. А у окружности проверять нужно одно отношение.',
              'Recall lesson 40: if even one of three ratios differs, there is no similarity. A circle has just one ratio to check.',
            ),
          },
        ],
        solution: [
          L('aylana: bitta olcham', 'окружность: один размер', 'a circle: one size'),
          L('uchburchak: uchta olcham', 'треугольник: три размера', 'a triangle: three sizes'),
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
    "Blits: markaz, koeffitsient, yuz",
    'Блиц: центр, коэффициент, площадь',
    'Blitz: centre, factor, area',
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
        tag: 'gomotetiya-harakat-emas',
        ask: L(
          "Gomotetiya masofani saqlaydimi?",
          'Сохраняет ли гомотетия расстояние?',
          'Does a homothety preserve distance?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, k marta ko'paytiradi", 'Нет, умножает на k', 'No, it multiplies by k') },
          { id: 'yes', label: L('Ha, saqlaydi', 'Да, сохраняет', 'Yes, it does') },
        ],
        ok: L(
          "To'g'ri. Shuning uchun u harakat emas, o'xshashlik almashtirishi.",
          'Верно. Поэтому она не движение, а преобразование подобия.',
          'Correct. So it is no motion but a similarity transformation.',
        ),
        hint: L(
          "1-ekranni eslang: shakl kattalashgandi, ya'ni masofalar o'zgargandi.",
          'Вспомни 1 экран: фигура выросла, значит расстояния изменились.',
          'Recall screen 1: the figure grew, so the distances changed.',
        ),
      },
      {
        id: 'q2',
        tag: 'markazdan-hisoblamaslik',
        ask: L(
          "Gomotetiyada masofa qayerdan o'lchanadi?",
          'Откуда отмеряется расстояние при гомотетии?',
          'From where is the distance measured in a homothety?',
        ),
        options: [
          { id: 'c', right: true, label: L('Markazdan', 'От центра', 'From the centre') },
          { id: 'o', label: L('Istalgan nuqtadan', 'От любой точки', 'From any point') },
        ],
        ok: L(
          "To'g'ri. Markaz o'z joyida qoladi, qolgan hamma nuqta undan hisoblanadi.",
          'Верно. Центр остаётся на месте, все остальные точки отсчитываются от него.',
          'Correct. The centre stays put and every other point is counted from it.',
        ),
        hint: L(
          "3-ekranni eslang: nur markazdan chiqadi va masofa o'sha nurda o'lchanadi.",
          'Вспомни 3 экран: луч выходит из центра, и расстояние меряется по нему.',
          'Recall screen 3: the ray leaves the centre and the distance is measured along it.',
        ),
      },
      {
        id: 'q3',
        tag: 'k-birdan-kichik',
        ask: L(
          "k = 1/4 bo'lsa, shakl qanday o'zgaradi?",
          'Как изменится фигура при k = 1/4?',
          'How does the figure change when k = 1/4?',
        ),
        options: [
          { id: 'sm', right: true, label: L('Kichrayadi', 'Уменьшится', 'It shrinks') },
          { id: 'big', label: L('Kattalashadi', 'Увеличится', 'It grows') },
        ],
        ok: L(
          "To'g'ri. Birdan kichik songa ko'paytirish natijani kichraytiradi.",
          'Верно. Умножение на число меньше единицы уменьшает результат.',
          'Correct. Multiplying by a number below one makes the result smaller.',
        ),
        hint: L(
          "5-ekranni eslang: sakkizni bir ikkidanga ko'paytirganda to'rt chiqqandi.",
          'Вспомни 5 экран: восемь на одну вторую дало четыре.',
          'Recall screen 5: eight times one half gave four.',
        ),
      },
      {
        id: 'q4',
        tag: 'yuz-k-marta',
        ask: L(
          "k = 4 bo'lsa, yuz necha marta ortadi?",
          'Во сколько раз вырастет площадь при k = 4?',
          'By what factor does the area grow when k = 4?',
        ),
        options: [
          { id: 'r', right: true, label: '16' },
          { id: 'w', label: '4' },
        ],
        ok: L(
          "To'g'ri. Gomotetiya o'xshashlik beradi, yuzlar esa k kvadrat marta o'zgaradi.",
          'Верно. Гомотетия даёт подобие, а площади меняются в k квадрат раз.',
          'Correct. A homothety gives similarity, and areas change by k squared.',
        ),
        hint: L(
          "12-ekranni eslang: tomoni ikki bo'lgan kvadratga birlik kvadratdan to'rttasi sig'gandi.",
          'Вспомни 12 экран: в квадрат со стороной два помещалось четыре единичных.',
          'Recall screen 12: a square of side two held four unit squares.',
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
    "Masofani ko'paytiradigan almashtirish",
    'Преобразование, умножающее расстояние',
    'The transformation that multiplies distance',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda shakl kattalashdi, burchaklari esa saqlandi. Bu harakat emas edi.",
      'На первом экране фигура выросла, а углы сохранились. Движением это не было.',
      'On the first screen the figure grew while the angles held. That was no motion.'),
    A('s1',
      "Siz gomotetiyaning ta'rifini oldingiz, uning o'xshashlik ekanini 40-darsning alomati bilan isbotladingiz va yuz k kvadrat marta ortishini bildingiz.",
      'Ты получил определение гомотетии, доказал её подобие признаком с 40 урока и узнал, что площадь растёт в k квадрат раз.',
      'You got the definition, proved similarity with the criterion from lesson 40, and learned the area grows by k squared.'),
    A('s2',
      "Keyingi darsda aylanadagi proporsional kesmalar.",
      'В следующем уроке пропорциональные отрезки в окружности.',
      'The next lesson covers proportional segments in a circle.'),
  ],
  props: {
    mark: 'OX₁ = k · OX',
    markNote: L(
      "harakat emas: masofa o'zgaradi",
      'не движение: расстояние меняется',
      'no motion: the distance changes',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: aylanadagi proporsional kesmalar',
      'Следующий урок: пропорциональные отрезки в окружности',
      'Next lesson: proportional segments in a circle',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'gomotetiya-harakat-emas', ...S2 },
  { role: 'explain',  tag: 'markazdan-hisoblamaslik', ...S3 },
  { role: 'explain',  tag: 'gomotetiya-harakat-emas', ...S4 },
  { role: 'explain',  tag: 'k-birdan-kichik', ...S5 },
  { role: 'explain',  tag: 'yuz-k-marta', ...S6 },
  { role: 'explain',  tag: 'yuz-k-marta', ...S7 },
  { role: 'rule',     tag: 'gomotetiya-harakat-emas', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'markazdan-hisoblamaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'yuz-k-marta', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'k-birdan-kichik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yuz-k-marta', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'gomotetiya-harakat-emas', ...S13 },
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
