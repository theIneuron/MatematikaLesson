// ============================================================================
// 9-sinf, Dars 37. AYLANAGA ICHKI CHIZILGAN BURCHAK.
//
// REDAKSIYA 1, 2026-08-28.
//
// DARSLIK 8-SINFDAN OLINDI. Tekshirildi: «Geometriya 9» mundarijasida
// ichki chizilgan burchak yo'q, reja ham shuni aytadi. Manba —
// «Geometriya 8», 36-mavzu (114-117-bet), tayanch esa 33-mavzu
// (markaziy burchak, 107-bet).
//   Ta'rif (114-bet): uchi aylanada yotuvchi, tomonlari aylanani kesib
//       o'tuvchi burchak ichki chizilgan burchak deyiladi.
//   Teorema (114-bet): ichki chizilgan burchak o'zi tiralgan yoyning
//       YARMI bilan o'lchanadi.
//   Natijalar (196-rasm): a) bir yoyga tiralgan barcha ichki chizilgan
//       burchaklar TENG; b) diametrga (yarim aylanaga) tiralgan burchak
//       TO'G'RI, ya'ni 90°.
//   Masala (197-rasm): vatar radiusga teng bo'lsa, markaziy burchak 60°,
//       ichki chizilgan esa 30°.
//   437-mashq: ∠BAC = 70°, ⌣AB = 120° → ⌣BC = 140°, ⌣AC = 100°.
//   439-mashq: AB diametr, ⌣AC : ⌣CB = 7 : 2 → ⌣CB = 40°, ∠BAC = 20°.
//
// XUK DARSLIKNING 196-RASMIDAN. Uchta ichki chizilgan burchak bitta
// yoyga tiralgan, uchlari esa aylananing turli joylarida. Ko'z bilan
// ular boshqacha ko'rinadi (biri «keng», biri «tor»), aslida esa TENG.
// Bu kutilmagan natija darsning butun mazmunini bir kadrda beradi:
// burchak uchning joyiga emas, YOYGA bog'liq.
//
// TUZOQ (12-ekran): yarimni unutish. Bu mavzuning yagona va eng keng
// tarqalgan xatosi. Ekran uni diametr bilan yiqitadi: yarim aylana
// 180°, agar burchak yoyga TENG bo'lsa, u ham 180° bo'lardi — ya'ni
// yoyilgan burchak, uchburchak esa yo'qolib ketardi.
//
// TRANSFER (13-ekran) darslikda yo'q, lekin teoremadan bir qadamda
// chiqadi: aylanaga ichki chizilgan to'rtburchakda qarama-qarshi
// burchaklar yig'indisi 180°, chunki ular ikkita yoyning yarmiga teng,
// yoylar esa birgalikda 360° beradi.
//
// CHIZMA: yangi `CircleFig` (asboblar.jsx, 7H). U 38, 39 va 44-darslar
// uchun ham ishlaydi — ularning hammasi aylana ustida.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { CircleFig, G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-37',
  n: 37,
  row: 37,
  block: 'Б7',
  topic: L(
    'Ichki chizilgan burchaklar',
    'Вписанные углы',
    'Inscribed angles',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Ichki chizilgan burchak o'zi tiralgan yoyning YARMI bilan o'lchanadi",
    'Вписанный угол измеряется ПОЛОВИНОЙ дуги, на которую он опирается',
    'An inscribed angle is measured by HALF the arc it subtends',
  ),
  L(
    "Bitta yoyga tiralgan barcha ichki chizilgan burchaklar o'zaro teng",
    'Все вписанные углы, опирающиеся на одну дугу, равны между собой',
    'All inscribed angles on the same arc are equal',
  ),
  L(
    "Diametrga tiralgan ichki chizilgan burchak to'g'ri burchakdir",
    'Вписанный угол, опирающийся на диаметр, прямой',
    'An inscribed angle on a diameter is a right angle',
  ),
]

export const MISS = {
  'yarmini-unutish': {
    what: L(
      "burchak yoyning yarmiga emas, yoyning o'ziga teng deb olindi",
      'угол принят равным дуге, а не её половине',
      'the angle was taken as the arc itself instead of half of it',
    ),
    wrong: null,
    at: 0,
  },
  'uch-joyiga-bogliq': {
    what: L(
      "burchak uchining joyiga bog'liq deb hisoblandi",
      'сочтено, что угол зависит от места вершины',
      'the angle was thought to depend on where the vertex sits',
    ),
    wrong: null,
    at: 0,
  },
  'markaziy-bilan-adashtirish': {
    what: L(
      "ichki chizilgan burchak markaziy burchak bilan almashtirildi",
      'вписанный угол перепутан с центральным',
      'the inscribed angle was confused with the central one',
    ),
    wrong: null,
    at: 0,
  },
  'yoylar-yigindisi': {
    what: L(
      "yoylarning yig'indisi 360 gradus ekani ishlatilmadi",
      'не использовано, что сумма дуг равна 360 градусам',
      'the fact that the arcs sum to 360 degrees was not used',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 196-a rasmi.
// ============================================================
const S1 = {
  eyebrow: L('UCHTA BURCHAK', 'ТРИ УГЛА', 'THREE ANGLES'),
  title: L(
    "Uchlari har xil, yoyi bitta",
    'Вершины разные, дуга одна',
    'Different vertices, one arc',
  ),
  audio: [
    A('mount',
      "Aylanada A va C nuqtalari belgilangan. Ular orasidagi yoyga uchta burchak tiralgan, ularning uchlari B, D va E nuqtalarida.",
      'На окружности отмечены точки A и C. На дугу между ними опираются три угла с вершинами B, D и E.',
      'Points A and C are marked on a circle. Three angles rest on the arc between them, with vertices at B, D and E.'),
    A('why',
      "Uchlar bir biridan uzoqda. Burchaklar ham har xil bo'ladimi?",
      'Вершины далеко друг от друга. Будут ли и углы разными?',
      'The vertices are far apart. Will the angles differ as well?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[
            { deg: 200, label: 'A' }, { deg: 340, label: 'C' },
            { deg: 70, label: 'B' }, { deg: 110, label: 'D' }, { deg: 30, label: 'E' },
          ]}
          chords={[[2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [4, 1]]}
          arc={[0, 1]}
        />
      )}
      steps={[]}
      ask={L(
        "Bitta yoyga tiralgan bu uchta burchak haqida nima deyish mumkin?",
        'Что можно сказать об этих трёх углах, опирающихся на одну дугу?',
        'What can be said of these three angles on the same arc?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ular o'zaro teng", 'Они равны между собой', 'They are equal to one another'),
        },
        {
          id: 'wrong',
          label: L(
            "Uchi yoyga yaqinrog'i kattaroq",
            'Тот больше, чья вершина ближе к дуге',
            'The one with the nearer vertex is larger',
          ),
          hint: L(
            "Shunday tuyuladi, lekin bu aldamchi. Bugun ko'ramizki, burchak uchning joyiga emas, faqat YOYGA bog'liq.",
            'Так кажется, но это обманчиво. Сегодня увидим, что угол зависит не от места вершины, а только от ДУГИ.',
            'It looks that way, but the look deceives. Today we see the angle depends not on the vertex but only on the ARC.',
          ),
        },
      ]}
      after={L(
        "Ha, ular teng. Bu kutilmagan natija va u bugungi darsning butun mazmunini beradi: burchakni yoy belgilaydi.",
        'Да, они равны. Это неожиданный результат, и он даёт всё содержание сегодняшнего урока: угол задаётся дугой.',
        'Yes, they are equal. An unexpected result, and it carries the whole lesson: the arc fixes the angle.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — markaziy burchak.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Markaziy burchak yoyning o'ziga teng",
    'Центральный угол равен самой дуге',
    'A central angle equals its arc',
  ),
  audio: [
    A('mount',
      "Uchi aylananing MARKAZIDA bo'lgan burchak markaziy burchak deyiladi.",
      'Угол с вершиной в ЦЕНТРЕ окружности называют центральным.',
      'An angle with its vertex at the CENTRE is called a central angle.'),
    A('why',
      "Markaziy burchak o'zi tiralgan yoyning gradus o'lchoviga teng.",
      'Центральный угол равен градусной мере дуги, на которую опирается.',
      'A central angle equals the degree measure of the arc it rests on.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 200, label: 'A' }, { deg: 340, label: 'C' }]}
          radii={[0, 1]}
          arc={[0, 1]}
          showCenter
          cap={L('markaziy burchak', 'центральный угол', 'a central angle')}
        />
      )}
      steps={[]}
      ask={L(
        "Yoy 140 gradus bo'lsa, markaziy burchak nechaga teng?",
        'Если дуга сто сорок градусов, чему равен центральный угол?',
        'If the arc is one hundred forty degrees, what is the central angle?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '140°' },
        {
          id: 'wrong',
          label: '70°',
          hint: L(
            "Yetmish yarmi bo'lardi. Lekin yarim ICHKI CHIZILGAN burchakka tegishli, markaziy burchak esa yoyning o'ziga teng.",
            'Семьдесят это половина. Но половина относится к ВПИСАННОМУ углу, а центральный равен самой дуге.',
            'Seventy is the half. But the half belongs to the INSCRIBED angle, while a central one equals the arc itself.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Markaziy burchak yoyni to'g'ridan-to'g'ri o'lchaydi. Endi uchi markazda emas, aylanada bo'lgan burchakka o'tamiz.",
        'Верно. Центральный угол измеряет дугу напрямую. Теперь перейдём к углу, вершина которого не в центре, а на окружности.',
        'Correct. A central angle measures the arc directly. Now to an angle whose vertex is on the circle, not at the centre.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — teorema.
// ============================================================
const S3 = {
  eyebrow: L('TEOREMA', 'ТЕОРЕМА', 'THE THEOREM'),
  title: L(
    "Ichki chizilgan burchak yoyning yarmi",
    'Вписанный угол это половина дуги',
    'An inscribed angle is half the arc',
  ),
  audio: [
    A('mount',
      "Uchi aylanada yotgan, tomonlari esa aylanani kesib o'tgan burchak ichki chizilgan deyiladi.",
      'Угол с вершиной на окружности, стороны которого пересекают окружность, называют вписанным.',
      'An angle with its vertex on the circle and sides cutting it is called inscribed.'),
    A('why',
      "Teoremaga ko'ra u o'zi tiralgan yoyning yarmi bilan o'lchanadi.",
      'По теореме он измеряется половиной дуги, на которую опирается.',
      'By the theorem it is measured by half the arc it rests on.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 200, label: 'A' }, { deg: 340, label: 'C' }, { deg: 80, label: 'B' }]}
          chords={[[2, 0], [2, 1]]}
          arc={[0, 1]}
          cap={L('ichki chizilgan burchak', 'вписанный угол', 'an inscribed angle')}
        />
      )}
      steps={[
        { id: 'a', head: L('Yoy', 'Дуга', 'The arc'), lines: ['⌣AC = 140°'] },
      ]}
      ask={L(
        "Ichki chizilgan burchak ABC nechaga teng?",
        'Чему равен вписанный угол ABC?',
        'What does the inscribed angle ABC equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '70°' },
        {
          id: 'wrong',
          label: '140°',
          hint: L(
            "Bir yuz qirq bu yoyning o'zi, ya'ni markaziy burchak. Ichki chizilgani esa uning yarmi.",
            'Сто сорок это сама дуга, то есть центральный угол. А вписанный это его половина.',
            'One hundred forty is the arc itself, the central angle. The inscribed one is half of it.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yoy bir xil qolsa, uchni aylana bo'ylab siljitsak ham burchak o'zgarmaydi. Xukdagi uchta burchak shuning uchun teng edi.",
        'Верно. Пока дуга та же, вершину можно двигать по окружности, а угол не изменится. Поэтому три угла из хука были равны.',
        'Correct. While the arc holds, the vertex may slide along the circle and the angle stays. That is why the three angles in the opening matched.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — teskari yo'nalish.
// ============================================================
const S4 = {
  eyebrow: L('TESKARISIGA', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER WAY'),
  title: L(
    "Burchakdan yoyga",
    'От угла к дуге',
    'From the angle to the arc',
  ),
  audio: [
    A('mount',
      "Endi burchak berilgan, yoyni topish kerak. Burchak yoyning yarmi edi.",
      'Теперь дан угол, а найти нужно дугу. Угол был половиной дуги.',
      'Now the angle is given and the arc must be found. The angle was half the arc.'),
    A('why',
      "Demak yoy burchakdan ikki barobar katta.",
      'Значит дуга вдвое больше угла.',
      'So the arc is twice the angle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('∠BAC = 70°', '∠BAC = 70°', '∠BAC = 70°')}
      steps={[]}
      ask={L(
        "Bu burchak tiralgan yoy nechaga teng?",
        'Чему равна дуга, на которую опирается этот угол?',
        'What does the arc this angle rests on equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '140°' },
        {
          id: 'wrong',
          label: '35°',
          hint: L(
            "O'ttiz besh bu burchakning yarmi. Lekin yarim bo'lgani BURCHAK edi, yoy esa undan katta.",
            'Тридцать пять это половина угла. Но половиной был УГОЛ, а дуга больше него.',
            'Thirty five halves the angle. But it was the ANGLE that was the half, and the arc is larger.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning 437-mashqidagi birinchi qadam. Ikki tomonga ham o'tish mumkin: yoydan burchakka bo'lib, burchakdan yoyga ko'paytirib.",
        'Верно. Это первый шаг задачи 437 учебника. Переходить можно в обе стороны: от дуги к углу делением, от угла к дуге умножением.',
        'Correct. This is the first step of exercise 437. The passage works both ways: dividing from arc to angle, multiplying from angle to arc.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — diametrga tiralgan burchak.
// ============================================================
const S5 = {
  eyebrow: L('DIAMETRGA TIRALGAN', 'ОПИРАЕТСЯ НА ДИАМЕТР', 'ON A DIAMETER'),
  title: L(
    "Eng foydali natija",
    'Самое полезное следствие',
    'The most useful corollary',
  ),
  audio: [
    A('mount',
      "Endi yoy yarim aylana bo'lsin, ya'ni tomonlar diametrga tiralsin.",
      'Пусть теперь дуга это полуокружность, то есть стороны опираются на диаметр.',
      'Now let the arc be a semicircle, so the sides rest on a diameter.'),
    A('why',
      "Yarim aylana bir yuz sakson gradus. Burchak esa uning yarmi.",
      'Полуокружность это сто восемьдесят градусов. А угол это её половина.',
      'A semicircle is one hundred eighty degrees. And the angle is half of it.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 180, label: 'A' }, { deg: 0, label: 'C' }, { deg: 75, label: 'B' }]}
          chords={[[0, 1], [2, 0], [2, 1]]}
          arc={[0, 1]}
          showCenter
          cap={L('AC diametr', 'AC диаметр', 'AC is a diameter')}
        />
      )}
      steps={[
        { id: 'a', head: L('Yarim aylana', 'Полуокружность', 'A semicircle'), lines: ['⌣AC = 180°'] },
      ]}
      ask={L(
        "Diametrga tiralgan ichki chizilgan burchak nechaga teng?",
        'Чему равен вписанный угол, опирающийся на диаметр?',
        'What does an inscribed angle on a diameter equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '90°' },
        {
          id: 'wrong',
          label: '180°',
          hint: L(
            "Bir yuz sakson bu yoyning o'zi. Burchak esa uning yarmi, va bunday burchak to'g'ri burchak deb ataladi.",
            'Сто восемьдесят это сама дуга. А угол это её половина, и такой угол называют прямым.',
            'One hundred eighty is the arc itself. The angle is half of it, and such an angle is called right.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, to'qson gradus. Uchni aylana bo'ylab qayerga siljitsangiz ham burchak to'g'ri qoladi. Bu natija masalalarda eng ko'p ishlatiladi.",
        'Верно, девяносто градусов. Куда бы ты ни сдвинул вершину по окружности, угол останется прямым. Это следствие используется в задачах чаще всего.',
        'Correct, ninety degrees. Wherever the vertex slides along the circle, the angle stays right. This corollary is the one most used in problems.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning 197-rasmi.
// ============================================================
const S6 = {
  eyebrow: L('VATAR RADIUSGA TENG', 'ХОРДА РАВНА РАДИУСУ', 'A CHORD EQUAL TO THE RADIUS'),
  title: L(
    "Teng tomonli uchburchak paydo bo'ladi",
    'Появляется равносторонний треугольник',
    'An equilateral triangle appears',
  ),
  audio: [
    A('mount',
      "AB vatari radiusga teng bo'lsin. Markazdan A va B ga radiuslar chizamiz.",
      'Пусть хорда AB равна радиусу. Проведём из центра радиусы в A и B.',
      'Let the chord AB equal the radius. Draw radii from the centre to A and B.'),
    A('why',
      "Uchta tomon ham teng chiqdi. Bunday uchburchakning burchaklari nechaga teng?",
      'Все три стороны оказались равны. Чему равны углы такого треугольника?',
      'All three sides came out equal. What are the angles of such a triangle?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 200, label: 'A' }, { deg: 260, label: 'B' }, { deg: 60, label: 'C' }]}
          chords={[[0, 1], [2, 0], [2, 1]]}
          radii={[0, 1]}
          arc={[0, 1]}
          showCenter
        />
      )}
      steps={[
        { id: 'a', head: L('Markaziy burchak', 'Центральный угол', 'The central angle'), lines: ['∠AOB = 60°'] },
      ]}
      ask={L(
        "C nuqtadan AB vatar qanday burchak ostida ko'rinadi?",
        'Под каким углом видна хорда AB из точки C?',
        'At what angle is the chord AB seen from C?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '30°' },
        {
          id: 'wrong',
          label: '60°',
          hint: L(
            "Oltmish bu MARKAZIY burchak, uning uchi markazda. C nuqta esa aylanada yotibdi, demak burchak ichki chizilgan va ikki barobar kichik.",
            'Шестьдесят это ЦЕНТРАЛЬНЫЙ угол, его вершина в центре. А точка C лежит на окружности, значит угол вписанный и вдвое меньше.',
            'Sixty is the CENTRAL angle with its vertex at the centre. Point C lies on the circle, so the angle is inscribed and half as large.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchburchak teng tomonli, demak markaziy burchak oltmish gradus va yoy ham oltmish. Ichki chizilgan burchak esa o'ttiz.",
        'Верно. Треугольник равносторонний, значит центральный угол шестьдесят градусов и дуга тоже шестьдесят. А вписанный угол тридцать.',
        'Correct. The triangle is equilateral, so the central angle is sixty degrees and so is the arc. The inscribed angle is thirty.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — yoylarning yig'indisi.
// ============================================================
const S7 = {
  eyebrow: L('YOYLAR JAMI', 'ВСЕ ДУГИ ВМЕСТЕ', 'ALL THE ARCS'),
  title: L(
    "Butun aylana 360 gradus",
    'Вся окружность триста шестьдесят градусов',
    'The whole circle is three hundred sixty degrees',
  ),
  audio: [
    A('mount',
      "Aylanada uchta nuqta uchta yoy hosil qiladi. Ularning yig'indisi butun aylana, ya'ni uch yuz oltmish gradus.",
      'Три точки на окружности образуют три дуги. Их сумма это вся окружность, то есть триста шестьдесят градусов.',
      'Three points on a circle make three arcs. Their sum is the whole circle, three hundred sixty degrees.'),
    A('why',
      "Ikkita yoy ma'lum bo'lsa, uchinchisi ayirish bilan topiladi.",
      'Если две дуги известны, третья находится вычитанием.',
      'If two arcs are known, the third comes from subtraction.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('⌣AB = 120°,   ⌣BC = 140°', '⌣AB = 120°,   ⌣BC = 140°', '⌣AB = 120°,   ⌣BC = 140°')}
      steps={[
        { id: 'a', head: L('Butun aylana', 'Вся окружность', 'The whole circle'), lines: ['360°'] },
      ]}
      ask={L(
        "Uchinchi yoy nechaga teng?",
        'Чему равна третья дуга?',
        'What does the third arc equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '100°' },
        {
          id: 'wrong',
          label: '20°',
          hint: L(
            "Yigirma ikkita yoyning AYIRMASI. Uchinchi yoy esa aylanadan ikkalasini ham ayirgandan keyin qoladi.",
            'Двадцать это РАЗНОСТЬ двух дуг. А третья дуга остаётся после вычитания обеих из окружности.',
            'Twenty is the DIFFERENCE of the two arcs. The third arc is what remains after both are taken from the circle.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch yuz oltmish minus bir yuz yigirma minus bir yuz qirq, ya'ni yuz. Bu darslikning 437-mashqi to'liq yechildi.",
        'Верно. Триста шестьдесят минус сто двадцать минус сто сорок, то есть сто. Задача 437 учебника решена полностью.',
        'Correct. Three hundred sixty minus one hundred twenty minus one hundred forty is one hundred. Exercise 437 is now fully solved.',
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
    'Geometriya 8, 36-mavzu (114-117-bet); tayanch 33-mavzu (107-bet)',
    'Геометрия 8, тема 36 (стр. 114-117); опора тема 33 (стр. 107)',
    'Geometry 8, topic 36 (p. 114-117); based on topic 33 (p. 107)',
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
          "Ichki chizilgan burchak nimaga bog'liq?",
          'От чего зависит вписанный угол?',
          'What does an inscribed angle depend on?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Faqat o'zi tiralgan yoyga", 'Только от дуги, на которую опирается', 'Only on the arc it rests on'),
          },
          {
            id: 'wrong',
            label: L("Uchining aylanadagi joyiga", 'От места вершины на окружности', 'On where its vertex sits'),
            hint: L(
              "1-ekranni eslang: uchta burchakning uchlari har xil joyda edi, o'zlari esa teng chiqdi.",
              'Вспомни 1 экран: у трёх углов вершины были в разных местах, а сами углы оказались равны.',
              'Recall screen 1: three angles had vertices in different places and came out equal.',
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
    "Yarim yoy va ikkita natija",
    'Половина дуги и два следствия',
    'Half an arc and two corollaries',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz teoremani, uning ikkita natijasini va yoylar yig'indisini ko'rdingiz.",
      'На семи экранах ты увидел теорему, два её следствия и сумму дуг.',
      'On seven screens you met the theorem, its two corollaries, and the sum of the arcs.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — yoydan burchakka va aksincha.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Ikki tomonga o'tish",
    'Переход в обе стороны',
    'Passing both ways',
  ),
  audio: [
    A('mount',
      "Uchta topshiriq. Ba'zilarida yoy berilgan, ba'zilarida burchak.",
      'Три задания. В одних дана дуга, в других угол.',
      'Three tasks. Some give the arc, others the angle.'),
    A('why',
      "Yoydan burchakka bo'linadi, burchakdan yoyga ko'paytiriladi.",
      'От дуги к углу делят, от угла к дуге умножают.',
      'From arc to angle divide, from angle to arc multiply.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Yo'nalishni adashtirmaslik uchun eslab qoling: burchak har doim yoydan KICHIK.",
      'Все три найдены. Чтобы не перепутать направление, запомни: угол всегда МЕНЬШЕ дуги.',
      'All three are found. To keep the direction straight, remember: the angle is always SMALLER than the arc.',
    ),
    tasks: [
      {
        expr: '⌣AC = 100°',
        question: L('Ichki chizilgan burchak nechaga teng?', 'Чему равен вписанный угол?', 'What does the inscribed angle equal?'),
        ok: L("Ha, ellik. Yoyning yarmi.", 'Да, пятьдесят. Половина дуги.', 'Yes, fifty. Half the arc.'),
        items: [
          { id: 'a', right: true, label: '50°' },
          { id: 'b', label: '200°', hint: L("Ikki yuz yoyni ikkiga KO'PAYTIRGANDA chiqadi. Burchak esa yoydan kichik bo'lishi kerak.", 'Двести выходит при УМНОЖЕНИИ дуги на два. А угол должен быть меньше дуги.', 'Two hundred comes from MULTIPLYING the arc by two. The angle must be smaller than the arc.') },
        ],
        solution: ['∠ = 100° : 2 = 50°'],
      },
      {
        expr: '∠ABC = 25°',
        question: L('Yoy nechaga teng?', 'Чему равна дуга?', 'What does the arc equal?'),
        ok: L("Ha, ellik. Yoy burchakdan ikki barobar katta.", 'Да, пятьдесят. Дуга вдвое больше угла.', 'Yes, fifty. The arc is twice the angle.'),
        items: [
          { id: 'a', right: true, label: '50°' },
          { id: 'b', label: '12,5°', hint: L("O'n ikki butun besh o'ndan burchakni ikkiga bo'lganda chiqadi. Bu yerda esa teskarisi kerak.", 'Двенадцать целых пять десятых выходит при делении угла на два. А здесь нужно наоборот.', 'Twelve point five comes from halving the angle. Here the reverse is needed.') },
        ],
        solution: ['⌣ = 25° · 2 = 50°'],
      },
      {
        expr: '⌣AC = 180°',
        question: L('Ichki chizilgan burchak nechaga teng?', 'Чему равен вписанный угол?', 'What does the inscribed angle equal?'),
        ok: L("Ha, to'qson. Bu diametrga tiralgan burchak.", 'Да, девяносто. Это угол, опирающийся на диаметр.', 'Yes, ninety. This is the angle on a diameter.'),
        items: [
          { id: 'a', right: true, label: '90°' },
          { id: 'b', label: '180°', hint: L("Bir yuz sakson yoyning o'zi, ya'ni yarim aylana. Burchak esa uning yarmi.", 'Сто восемьдесят это сама дуга, полуокружность. А угол её половина.', 'One hundred eighty is the arc itself, a semicircle. The angle is half of it.') },
        ],
        solution: ['∠ = 180° : 2 = 90°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — uchburchak ichida.
// ============================================================
const S10 = {
  eyebrow: L('UCHBURCHAK ICHIDA', 'ВНУТРИ ТРЕУГОЛЬНИКА', 'INSIDE A TRIANGLE'),
  title: L(
    "To'g'ri burchak tayyor",
    'Прямой угол уже есть',
    'The right angle is already there',
  ),
  audio: [
    A('mount',
      "Uchburchakning bir tomoni diametr bo'lsa, unga qarshi burchak to'g'ri bo'ladi.",
      'Если одна сторона треугольника это диаметр, противолежащий угол прямой.',
      'If one side of a triangle is a diameter, the opposite angle is right.'),
    A('why',
      "Demak uchburchakning qolgan ikkita burchagi to'qson gradusga qo'shiladi.",
      'Значит два других угла треугольника в сумме дают девяносто градусов.',
      'So the other two angles of the triangle add to ninety degrees.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Diametr ko'ringan joyda to'g'ri burchakni darrov yozib qo'yish kerak — bu masalani ko'pincha bir qadamda hal qiladi.",
      'Обе найдены. Увидев диаметр, сразу отмечай прямой угол — это часто решает задачу за один шаг.',
      'Both are found. Whenever a diameter shows up, note the right angle at once — it often settles the problem in one step.',
    ),
    tasks: [
      {
        expr: '∠BAC = 35°',
        question: L(
          'AC diametr. ∠ABC nechaga teng?',
          'AC это диаметр. Чему равен ∠ABC?',
          'AC is a diameter. What does ∠ABC equal?',
        ),
        ok: L("Ha, to'qson. U diametrga tiralgan.", 'Да, девяносто. Он опирается на диаметр.', 'Yes, ninety. It rests on the diameter.'),
        items: [
          { id: 'a', right: true, label: '90°' },
          { id: 'b', label: '55°', hint: L("Ellik besh bu UCHINCHI burchak, ya'ni to'qson minus o'ttiz besh. Savol esa diametrga tiralgani haqida.", 'Пятьдесят пять это ТРЕТИЙ угол, то есть девяносто минус тридцать пять. А вопрос про угол, опирающийся на диаметр.', 'Fifty five is the THIRD angle, ninety minus thirty five. The question asks about the angle on the diameter.') },
        ],
        solution: [L('AC diametr', 'AC диаметр', 'AC is a diameter'), '∠ABC = 90°'],
      },
      {
        expr: '∠ABC = 90°,   ∠BAC = 35°',
        question: L('Uchinchi burchak nechaga teng?', 'Чему равен третий угол?', 'What does the third angle equal?'),
        ok: L("Ha, ellik besh. Bir yuz sakson minus to'qson minus o'ttiz besh.", 'Да, пятьдесят пять. Сто восемьдесят минус девяносто минус тридцать пять.', 'Yes, fifty five. One hundred eighty minus ninety minus thirty five.'),
        items: [
          { id: 'a', right: true, label: '55°' },
          { id: 'b', label: '145°', hint: L("Bir yuz qirq besh bir yuz saksondan faqat o'ttiz beshni ayirganda chiqadi. To'g'ri burchakni ham ayirish kerak.", 'Сто сорок пять выходит, если вычесть из ста восьмидесяти только тридцать пять. Нужно вычесть и прямой угол.', 'One hundred forty five comes from subtracting only thirty five. The right angle must be taken off too.') },
        ],
        solution: ['180° − 90° − 35° = 55°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — darslikning 439-mashqi.
// ============================================================
const S11 = {
  eyebrow: L('NISBAT BILAN', 'ПО ОТНОШЕНИЮ', 'BY A RATIO'),
  title: L(
    "Yoylar nisbatda berilgan",
    'Дуги даны отношением',
    'The arcs are given by a ratio',
  ),
  audio: [
    A('mount',
      "AB diametr, AC esa vatar. AC va CB yoylarining nisbati yetti ikkiga.",
      'AB диаметр, а AC хорда. Отношение дуг AC и CB равно семь к двум.',
      'AB is a diameter and AC a chord. The arcs AC and CB are in ratio seven to two.'),
    A('why',
      "Diametr aylanani teng ikkiga bo'ladi, demak bu ikkita yoyning yig'indisi bir yuz sakson.",
      'Диаметр делит окружность пополам, значит сумма этих двух дуг сто восемьдесят.',
      'A diameter halves the circle, so these two arcs add to one hundred eighty.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Nisbat berilganda avval bitta ulushni topish kerak, keyin hammasi oson.",
      'Оба шага сделаны. Когда дано отношение, сначала находят одну долю, дальше всё просто.',
      'Both steps are done. With a ratio given, find one share first and the rest is easy.',
    ),
    tasks: [
      {
        expr: '7x + 2x = 180°',
        question: L('Bitta ulush nechaga teng?', 'Чему равна одна доля?', 'What does one share equal?'),
        ok: L("Ha, yigirma. To'qqizta ulush bir yuz saksonni beradi.", 'Да, двадцать. Девять долей дают сто восемьдесят.', 'Yes, twenty. Nine shares make one hundred eighty.'),
        items: [
          { id: 'a', right: true, label: 'x = 20°' },
          { id: 'b', label: 'x = 90°', hint: L("To'qson bir yuz saksonni IKKIGA bo'lganda chiqadi. Bu yerda esa ulushlar to'qqizta.", 'Девяносто выходит при делении ста восьмидесяти на ДВА. А здесь долей девять.', 'Ninety comes from halving one hundred eighty. Here there are nine shares.') },
        ],
        solution: ['9x = 180°', 'x = 20°'],
      },
      {
        expr: '⌣CB = 2x = 40°',
        question: L('∠BAC nechaga teng?', 'Чему равен ∠BAC?', 'What does ∠BAC equal?'),
        ok: L("Ha, yigirma. Burchak CB yoyiga tiralgan, demak uning yarmi.", 'Да, двадцать. Угол опирается на дугу CB, значит это её половина.', 'Yes, twenty. The angle rests on arc CB, so it is half of it.'),
        items: [
          { id: 'a', right: true, label: '20°' },
          { id: 'b', label: '40°', hint: L("Qirq bu YOYNING o'zi. Ichki chizilgan burchak esa har doim yoyning yarmi.", 'Сорок это САМА дуга. А вписанный угол всегда половина дуги.', 'Forty is the ARC itself. An inscribed angle is always half the arc.') },
        ],
        solution: ['∠BAC = 40° : 2 = 20°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — yarmini unutish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Yarmi qayoqqa ketdi",
    'Куда делась половина',
    'Where the half went',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Yoy bir yuz sakson gradus, ya'ni yarim aylana. U ichki chizilgan burchakni ham bir yuz sakson deb yozgan.",
      'Решение Камрона. Дуга сто восемьдесят градусов, то есть полуокружность. Он записал вписанный угол тоже как сто восемьдесят.',
      "Kamron's solution. The arc is one hundred eighty degrees, a semicircle. He wrote the inscribed angle as one hundred eighty too."),
    A('why',
      "Bunday burchak qanday ko'rinishga ega bo'lardi? Chizib ko'ring.",
      'Как выглядел бы такой угол? Попробуй представить.',
      'What would such an angle look like? Picture it.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bir yuz sakson gradusli burchak bu yoyilgan burchak, uning tomonlari bitta to'g'ri chiziqda yotadi. U holda uchburchak umuman qolmasdi. Demak yarim tushib qolgan, va javob to'qson.",
      'Угол в сто восемьдесят градусов это развёрнутый угол, его стороны лежат на одной прямой. Тогда никакого треугольника не осталось бы. Значит половина потеряна, и ответ девяносто.',
      'An angle of one hundred eighty degrees is a straight angle with its sides on one line. Then no triangle would remain at all. So the half was lost and the answer is ninety.',
    ),
    tasks: [
      {
        expr: '⌣AC = 180°   →   ∠ABC = 180° ?',
        question: L(
          "180 gradusli burchakning tomonlari qanday joylashadi?",
          'Как расположены стороны угла в сто восемьдесят градусов?',
          'How do the sides of a one hundred eighty degree angle lie?',
        ),
        ok: L(
          "To'g'ri, bitta to'g'ri chiziqda. U holda B nuqta AC chiziqda yotib qolardi va uchburchak yo'qolardi. Javob to'qson.",
          'Верно, на одной прямой. Тогда точка B лежала бы на прямой AC и треугольник исчез бы. Ответ девяносто.',
          'Correct, on one straight line. Then B would lie on the line AC and the triangle would vanish. The answer is ninety.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Bitta to'g'ri chiziqda", 'На одной прямой', 'On one straight line'),
          },
          {
            id: 'b',
            label: L("Kamron to'g'ri, javob 180", 'Камрон прав, ответ 180', 'Kamron is right, the answer is 180'),
            hint: L(
              "5-ekrandagi chizmaga qarang: B nuqta aylananing tepasida, AC esa pastda. Bunday burchak ochiq ko'rinadi, lekin yoyilgan emas.",
              'Посмотри на чертёж 5 экрана: точка B наверху окружности, а AC внизу. Такой угол выглядит раскрытым, но не развёрнутым.',
              'Look at the drawing on screen five: B is at the top of the circle and AC below. Such an angle looks wide but is not straight.',
            ),
          },
        ],
        solution: [
          '∠ABC = 180° : 2 = 90°',
          L('Kamron: 180°', 'Камрон: 180°', 'Kamron: 180°'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — ichki chizilgan to'rtburchak.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Aylanaga ichki chizilgan to'rtburchak",
    'Четырёхугольник, вписанный в окружность',
    'A quadrilateral inscribed in a circle',
  ),
  audio: [
    A('mount',
      "To'rtta uchi ham aylanada yotgan to'rtburchakni olaylik. Qarama-qarshi ikkita burchagini qaraymiz.",
      'Возьмём четырёхугольник, все четыре вершины которого лежат на окружности. Рассмотрим два его противоположных угла.',
      'Take a quadrilateral with all four vertices on a circle. Consider two opposite angles.'),
    A('why',
      "Har biri o'z yoyining yarmi. Bu ikkita yoy esa birgalikda butun aylanani beradi.",
      'Каждый это половина своей дуги. А эти две дуги вместе дают всю окружность.',
      'Each is half its own arc. And those two arcs together make the whole circle.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bu darslikda alohida qoida sifatida berilmagan, lekin bugungi teoremadan bir qadamda chiqdi. Ichki chizilgan to'rtburchakda qarama-qarshi burchaklar yig'indisi har doim 180 gradus.",
      'В учебнике это не дано отдельным правилом, но вышло из сегодняшней теоремы за один шаг. У вписанного четырёхугольника сумма противоположных углов всегда сто восемьдесят градусов.',
      'The textbook gives no separate rule for this, yet it followed from today theorem in one step. In an inscribed quadrilateral opposite angles always add to one hundred eighty degrees.',
    ),
    tasks: [
      {
        expr: '⌣ + ⌣ = ?',
        question: L(
          "Qarama-qarshi burchaklar tiralgan ikkita yoyning yig'indisi nechaga teng?",
          'Чему равна сумма двух дуг, на которые опираются противоположные углы?',
          'What do the two arcs under the opposite angles add up to?',
        ),
        ok: L(
          "Ha, uch yuz oltmish. Ular birgalikda butun aylanani qoplaydi.",
          'Да, триста шестьдесят. Вместе они покрывают всю окружность.',
          'Yes, three hundred sixty. Together they cover the whole circle.',
        ),
        items: [
          { id: 'a', right: true, label: '360°' },
          { id: 'b', label: '180°', hint: L("Bir yuz sakson yarim aylana bo'lardi. Bu ikkita yoy esa hech qanday joyni tashlab ketmasdan butun aylanani bo'lib oladi.", 'Сто восемьдесят это полуокружность. А эти две дуги делят между собой всю окружность, не оставляя пропусков.', 'One hundred eighty is a semicircle. These two arcs share the whole circle between them with no gaps.') },
        ],
        solution: [L('ikkita yoy butun aylana', 'две дуги это вся окружность', 'the two arcs are the whole circle'), '360°'],
      },
      {
        expr: '360° : 2',
        question: L(
          "Demak qarama-qarshi burchaklarning yig'indisi nechaga teng?",
          'Значит чему равна сумма противоположных углов?',
          'So what do the opposite angles add up to?',
        ),
        ok: L(
          "Ha, bir yuz sakson. Har biri yarim, demak yig'indisi uch yuz oltmishning yarmi.",
          'Да, сто восемьдесят. Каждый это половина, значит сумма это половина от трёхсот шестидесяти.',
          'Yes, one hundred eighty. Each is a half, so the sum is half of three hundred sixty.',
        ),
        items: [
          { id: 'a', right: true, label: '180°' },
          { id: 'b', label: '360°', hint: L("Uch yuz oltmish YOYLARNING yig'indisi edi. Burchaklar esa yoylardan ikki barobar kichik.", 'Триста шестьдесят было суммой ДУГ. А углы вдвое меньше дуг.', 'Three hundred sixty was the sum of the ARCS. The angles are half the arcs.') },
        ],
        solution: ['(360°) : 2 = 180°'],
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
    "Blits: yarim, diametr, yoy",
    'Блиц: половина, диаметр, дуга',
    'Blitz: the half, the diameter, the arc',
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
        tag: 'yarmini-unutish',
        ask: L(
          "Yoy 60 gradus bo'lsa, ichki chizilgan burchak nechaga teng?",
          'Если дуга шестьдесят градусов, чему равен вписанный угол?',
          'If the arc is sixty degrees, what is the inscribed angle?',
        ),
        options: [
          { id: 'r', right: true, label: '30°' },
          { id: 'w', label: '60°' },
        ],
        ok: L(
          "To'g'ri. Ichki chizilgan burchak har doim yoyning yarmi.",
          'Верно. Вписанный угол всегда половина дуги.',
          'Correct. An inscribed angle is always half the arc.',
        ),
        hint: L(
          "Oltmish gradus MARKAZIY burchakka teng bo'lardi, uning uchi markazda.",
          'Шестьдесят градусов равнялся бы ЦЕНТРАЛЬНЫЙ угол, его вершина в центре.',
          'Sixty degrees would be the CENTRAL angle, whose vertex is at the centre.',
        ),
      },
      {
        id: 'q2',
        tag: 'uch-joyiga-bogliq',
        ask: L(
          "Uchni aylana bo'ylab siljitsak, ichki chizilgan burchak o'zgaradimi?",
          'Изменится ли вписанный угол, если сдвинуть вершину по окружности?',
          'Does an inscribed angle change if the vertex slides along the circle?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, agar yoy o'zgarmasa", 'Нет, если дуга та же', 'No, provided the arc is the same') },
          { id: 'yes', label: L('Ha, albatta', 'Да, обязательно', 'Yes, always') },
        ],
        ok: L(
          "To'g'ri. Burchakni yoy belgilaydi, uchning joyi emas.",
          'Верно. Угол задаёт дуга, а не место вершины.',
          'Correct. The arc fixes the angle, not the vertex position.',
        ),
        hint: L(
          "1-ekranni eslang: uchta burchakning uchlari har xil joyda edi va hammasi teng chiqdi.",
          'Вспомни 1 экран: вершины трёх углов были в разных местах, и все углы вышли равными.',
          'Recall screen 1: the three vertices sat in different places and all the angles matched.',
        ),
      },
      {
        id: 'q3',
        tag: 'markaziy-bilan-adashtirish',
        ask: L(
          "Diametrga tiralgan ichki chizilgan burchak nechaga teng?",
          'Чему равен вписанный угол, опирающийся на диаметр?',
          'What does an inscribed angle on a diameter equal?',
        ),
        options: [
          { id: 'r', right: true, label: '90°' },
          { id: 'w', label: '180°' },
        ],
        ok: L(
          "To'g'ri. Yarim aylana bir yuz sakson, uning yarmi to'qson.",
          'Верно. Полуокружность сто восемьдесят, её половина девяносто.',
          'Correct. A semicircle is one hundred eighty and its half is ninety.',
        ),
        hint: L(
          "12-ekranni eslang: bir yuz sakson bo'lsa, uchburchak umuman qolmasdi.",
          'Вспомни 12 экран: при ста восьмидесяти треугольника вообще не осталось бы.',
          'Recall screen 12: at one hundred eighty no triangle would remain at all.',
        ),
      },
      {
        id: 'q4',
        tag: 'yoylar-yigindisi',
        ask: L(
          "Aylanadagi barcha yoylarning yig'indisi nechaga teng?",
          'Чему равна сумма всех дуг окружности?',
          'What do all the arcs of a circle add up to?',
        ),
        options: [
          { id: 'r', right: true, label: '360°' },
          { id: 'w', label: '180°' },
        ],
        ok: L(
          "To'g'ri. Shuning uchun ikkita yoy ma'lum bo'lsa, uchinchisi ayirish bilan topiladi.",
          'Верно. Поэтому, если известны две дуги, третья находится вычитанием.',
          'Correct. So when two arcs are known, the third comes by subtraction.',
        ),
        hint: L(
          "7-ekranni eslang: uch yuz oltmishdan ikkita yoy ayirilgandi.",
          'Вспомни 7 экран: из трёхсот шестидесяти вычитали две дуги.',
          'Recall screen 7: two arcs were taken from three hundred sixty.',
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
    "Burchakni yoy belgilaydi",
    'Угол задаётся дугой',
    'The arc fixes the angle',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda uchlari har xil joyda bo'lgan uchta burchak teng chiqdi. Sabab bitta: ular bitta yoyga tiralgan.",
      'На первом экране три угла с вершинами в разных местах оказались равными. Причина одна: они опираются на одну дугу.',
      'On the first screen three angles with vertices in different places came out equal. One reason: they rest on the same arc.'),
    A('s1',
      "Siz teoremani, diametr haqidagi natijani va ichki chizilgan to'rtburchakning xossasini bildingiz.",
      'Ты узнал теорему, следствие о диаметре и свойство вписанного четырёхугольника.',
      'You learned the theorem, the corollary about a diameter, and the property of an inscribed quadrilateral.'),
    A('s2',
      "Keyingi darsda aylanaga urinma.",
      'В следующем уроке касательная к окружности.',
      'The next lesson covers a tangent to a circle.'),
  ],
  props: {
    mark: '∠ = ⌣ : 2',
    markNote: L(
      "diametrga tiralgan burchak 90 gradus",
      'угол на диаметр равен девяноста градусам',
      'the angle on a diameter is ninety degrees',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: aylanaga urinma',
      'Следующий урок: касательная к окружности',
      'Next lesson: a tangent to a circle',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'markaziy-bilan-adashtirish', ...S2 },
  { role: 'explain',  tag: 'yarmini-unutish', ...S3 },
  { role: 'explain',  tag: 'yarmini-unutish', ...S4 },
  { role: 'explain',  tag: 'yarmini-unutish', ...S5 },
  { role: 'explain',  tag: 'markaziy-bilan-adashtirish', ...S6 },
  { role: 'explain',  tag: 'yoylar-yigindisi', ...S7 },
  { role: 'rule',     tag: 'uch-joyiga-bogliq', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'yarmini-unutish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'markaziy-bilan-adashtirish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'yoylar-yigindisi', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yarmini-unutish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'yoylar-yigindisi', ...S13 },
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
