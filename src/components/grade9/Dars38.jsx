// ============================================================================
// 9-sinf, Dars 38. AYLANAGA URINMA.
//
// REDAKSIYA 1, 2026-08-28.
//
// DARSLIK 8-SINFDAN (37-darsdagi kabi): «Geometriya 8», 35-mavzu
// (111-113-bet). «Geometriya 9» da urinma yo'q, reja ham shuni aytadi.
//   Uch hol (111-bet): markazdan to'g'ri chiziqqacha masofa d va radius
//       R ni solishtirish hammasini hal qiladi — d > R umumiy nuqta
//       yo'q, d = R bitta nuqta (urinma), d < R ikkita nuqta (kesuvchi).
//   Vatar uzunligi (112-bet): AB = 2√(R² − d²).
//   1-teorema (112-bet): urinma urinish nuqtasiga o'tkazilgan radiusga
//       PERPENDIKULAR. Isbot qisqa va chiroyli: urinmaning boshqa
//       hamma nuqtasi aylanadan tashqarida, demak OA eng qisqa masofa,
//       eng qisqasi esa perpendikulyar.
//   2-teorema (112-bet): teskarisi ham to'g'ri — radiusning uchidan
//       o'tuvchi perpendikulyar urinmadir.
//   427-mashq: tashqi nuqtadan o'tkazilgan ikkita urinma TENG.
//   430-mashq: ∠C = 90°, AB = 10, ∠ABC = 30° → AC = 5, ya'ni R = 5 da
//       urinma, R < 5 da umumiy nuqta yo'q, R > 5 da ikkita nuqta.
//
// DARSNING UMURTQASI — BITTA SOLISHTIRISH: d va R. Uchta holni yodlash
// kerak emas, ular bitta taqqoslashdan chiqadi, va bola buni xukda
// o'zi ko'radi. Ikkinchi umurtqa — perpendikulyarlik: urinma bilan
// bog'liq deyarli har bir masala shu to'g'ri burchakdan boshlanadi.
//
// TUZOQ (12-ekran) 27-DARSNING SHARTIGA QAYTADI. Kamron vatar
// formulasini d > R holda qo'llagan va ildiz ostida manfiy son
// chiqqan. Formula xato aytmaydi, u shunchaki son bermaydi — bu
// «shartni o'zim tekshiraman» odatining o'sha darsdagi davomi.
//
// TRANSFER (13-ekran) darslikning 430-mashqi: uchburchakda AC masofa
// hisoblanadi va undan keyin R ning uch xil holi ajratiladi. Bu yerda
// 33-darsning sinusi ham ishlaydi.
//
// CHIZMA: `CircleFig` (7H) 37-darsdan qayta ishlatiladi, yangi asbob
// yo'q.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { CircleFig, G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-38',
  n: 38,
  row: 38,
  block: 'Б7',
  topic: L('Aylanaga urinma', 'Касательная к окружности', 'A tangent to a circle'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Umumiy nuqtalar sonini d va R ni solishtirish hal qiladi",
    'Число общих точек решает сравнение d и R',
    'The number of common points is settled by comparing d and R',
  ),
  L(
    "Urinma urinish nuqtasidagi radiusga perpendikulyar",
    'Касательная перпендикулярна радиусу в точке касания',
    'A tangent is perpendicular to the radius at the point of contact',
  ),
  L(
    "Tashqi nuqtadan o'tkazilgan ikkita urinma o'zaro teng",
    'Две касательные из внешней точки равны между собой',
    'Two tangents from an outside point are equal',
  ),
]

export const MISS = {
  'd-va-r-solishtirmaslik': {
    what: L(
      "d va R solishtirilmasdan holat aytildi",
      'случай назван без сравнения d и R',
      'the case was named without comparing d and R',
    ),
    wrong: null,
    at: 0,
  },
  'urinma-perpendikulyar-emas': {
    what: L(
      "urinma radiusga perpendikulyar ekani ishlatilmadi",
      'не использовано, что касательная перпендикулярна радиусу',
      'the perpendicularity of tangent and radius was not used',
    ),
    wrong: null,
    at: 0,
  },
  'shartni-tekshirmaslik': {
    what: L(
      "vatar formulasi d > R holda ham qo'llanildi",
      'формула хорды применена и при d больше R',
      'the chord formula was used even when d exceeds R',
    ),
    wrong: null,
    at: 0,
  },
  'ikki-urinma-teng': {
    what: L(
      "tashqi nuqtadan chiqqan urinmalar teng ekani ishlatilmadi",
      'не использовано равенство касательных из внешней точки',
      'the equality of tangents from an outside point was not used',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — uchta hol.
// ============================================================
const S1 = {
  eyebrow: L('NECHTA NUQTA', 'СКОЛЬКО ТОЧЕК', 'HOW MANY POINTS'),
  title: L(
    "To'g'ri chiziq aylanani necha joyda kesadi",
    'Сколько раз прямая пересекает окружность',
    'How often a line meets a circle',
  ),
  audio: [
    A('mount',
      "Aylana va to'g'ri chiziq berilgan. Markazdan chiziqqacha bo'lgan masofani d, radiusni R deb belgilaymiz.",
      'Даны окружность и прямая. Расстояние от центра до прямой обозначим d, а радиус R.',
      'A circle and a line are given. Call the distance from the centre to the line d and the radius R.'),
    A('why',
      "Chiziq markazdan uzoqlashsa, u avval ikki joyda kesadi, keyin bir joyda tegib o'tadi, so'ng umuman tegmaydi.",
      'Если прямая удаляется от центра, она сначала пересекает в двух местах, потом касается в одном, а затем не задевает вовсе.',
      'As the line moves away from the centre it first cuts twice, then touches once, then misses entirely.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 150, label: 'A' }, { deg: 30, label: 'B' }]}
          chords={[[0, 1]]}
          showCenter
          cap={L('d < R', 'd < R', 'd < R')}
        />
      )}
      steps={[]}
      ask={L(
        "Umumiy nuqtalar soni nimaga bog'liq?",
        'От чего зависит число общих точек?',
        'What does the number of common points depend on?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "d va R ning qaysi biri katta ekaniga",
            'От того, что больше: d или R',
            'On which is larger, d or R',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Chiziqning uzunligiga",
            'От длины прямой',
            'On the length of the line',
          ),
          hint: L(
            "To'g'ri chiziq cheksiz, uning uzunligi yo'q. Muhimi u markazdan qanchalik uzoqda o'tishi.",
            'Прямая бесконечна, длины у неё нет. Важно, насколько далеко от центра она проходит.',
            'A line is endless and has no length. What matters is how far from the centre it passes.',
          ),
        },
      ]}
      after={L(
        "Ha. Butun mavzu bitta solishtirishga sig'adi: d va R. Bugun uchala holni ham ko'ramiz.",
        'Да. Вся тема помещается в одно сравнение: d и R. Сегодня разберём все три случая.',
        'Yes. The whole topic fits into one comparison: d against R. Today we go through all three cases.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — nuqtadan chiziqqacha masofa.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Masofa deganda perpendikulyar tushuniladi",
    'Под расстоянием понимают перпендикуляр',
    'Distance means the perpendicular',
  ),
  audio: [
    A('mount',
      "Nuqtadan to'g'ri chiziqqacha bo'lgan masofa deb, o'sha nuqtadan chiziqqa tushirilgan perpendikulyarning uzunligiga aytiladi.",
      'Расстоянием от точки до прямой называют длину перпендикуляра, опущенного из этой точки на прямую.',
      'The distance from a point to a line is the length of the perpendicular dropped to it.'),
    A('why',
      "Nega aynan perpendikulyar? Chunki u eng qisqa.",
      'Почему именно перпендикуляр? Потому что он самый короткий.',
      'Why the perpendicular? Because it is the shortest.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Nuqtadan chiziqqa turli kesmalar",
        'Разные отрезки от точки до прямой',
        'Various segments from a point to a line',
      )}
      steps={[]}
      ask={L(
        "Nuqtadan chiziqqacha bo'lgan kesmalarning qaysi biri eng qisqa?",
        'Какой из отрезков от точки до прямой самый короткий?',
        'Which segment from the point to the line is shortest?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L('Perpendikulyar', 'Перпендикуляр', 'The perpendicular'),
        },
        {
          id: 'wrong',
          label: L("Og'ma kesmalardan istalgani", 'Любая из наклонных', 'Any of the slanted ones'),
          hint: L(
            "Har qanday og'ma kesma perpendikulyar bilan to'g'ri burchakli uchburchak hosil qiladi va u yerda GIPOTENUZA bo'ladi, gipotenuza esa katetdan uzun.",
            'Любая наклонная образует с перпендикуляром прямоугольный треугольник, где она ГИПОТЕНУЗА, а гипотенуза длиннее катета.',
            'Any slanted segment forms a right triangle with the perpendicular where it is the HYPOTENUSE, and a hypotenuse exceeds a leg.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu oddiy fikr bugungi asosiy teoremani isbotlaydi, buni beshinchi ekranda ko'ramiz.",
        'Верно. Эта простая мысль докажет сегодняшнюю главную теорему, увидим это на пятом экране.',
        'Correct. This simple idea will prove today main theorem, as seen on the fifth screen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — uchta hol.
// ============================================================
const S3 = {
  eyebrow: L('UCHTA HOL', 'ТРИ СЛУЧАЯ', 'THREE CASES'),
  title: L(
    "Bitta taqqoslash, uchta javob",
    'Одно сравнение, три ответа',
    'One comparison, three answers',
  ),
  audio: [
    A('mount',
      "Agar d radiusdan katta bo'lsa, chiziqning har bir nuqtasi markazdan radiusdan uzoqroqda, demak umumiy nuqta yo'q.",
      'Если d больше радиуса, каждая точка прямой дальше от центра, чем радиус, значит общих точек нет.',
      'If d exceeds the radius, every point of the line lies farther than the radius, so there are no common points.'),
    A('why',
      "Agar d radiusdan kichik bo'lsa, chiziq aylananing ichiga kiradi va ikki joyda chiqadi.",
      'Если d меньше радиуса, прямая заходит внутрь окружности и выходит в двух местах.',
      'If d is less than the radius, the line enters the circle and leaves it in two places.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('d = R', 'd = R', 'd = R')}
      steps={[
        { id: 'a', head: L('Ikki hol', 'Два случая', 'Two cases'), lines: ['d > R  →  0', 'd < R  →  2'] },
      ]}
      ask={L(
        "d radiusga teng bo'lsa, nechta umumiy nuqta bo'ladi?",
        'Сколько общих точек, если d равно радиусу?',
        'How many common points are there when d equals the radius?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Bitta', 'Одна', 'One') },
        {
          id: 'wrong',
          label: L('Ikkita', 'Две', 'Two'),
          hint: L(
            "Ikkitasi d radiusdan KICHIK bo'lganda edi. Tenglikda esa chiziq aylanaga endigina yetib keladi va ichkariga kirmaydi.",
            'Две было при d МЕНЬШЕ радиуса. А при равенстве прямая только-только достаёт до окружности и внутрь не заходит.',
            'Two came when d was LESS than the radius. At equality the line just reaches the circle and never enters.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bitta umumiy nuqtasi bo'lgan chiziq URINMA deb ataladi, o'sha nuqta esa urinish nuqtasi.",
        'Верно. Прямую с одной общей точкой называют КАСАТЕЛЬНОЙ, а саму точку точкой касания.',
        'Correct. A line with a single common point is called a TANGENT, and the point is the point of contact.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — asosiy teorema.
// ============================================================
const S4 = {
  eyebrow: L('ASOSIY TEOREMA', 'ГЛАВНАЯ ТЕОРЕМА', 'THE MAIN THEOREM'),
  title: L(
    "Urinma va radius orasidagi burchak",
    'Угол между касательной и радиусом',
    'The angle between tangent and radius',
  ),
  audio: [
    A('mount',
      "Urinmaning urinish nuqtasidan boshqa hamma nuqtasi aylanadan tashqarida yotadi, ya'ni markazdan uzoqroqda.",
      'Все точки касательной, кроме точки касания, лежат вне окружности, то есть дальше от центра.',
      'Every point of a tangent but the contact point lies outside the circle, farther from the centre.'),
    A('why',
      "Demak urinish nuqtasigacha bo'lgan masofa eng qisqa. Ikkinchi ekranni eslang: eng qisqasi qanday kesma edi?",
      'Значит расстояние до точки касания самое короткое. Вспомни второй экран: какой отрезок был самым коротким?',
      'So the distance to the contact point is the shortest. Recall screen two: which segment was shortest?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 90, label: 'A' }]}
          radii={[0]}
          showCenter
          cap={L('urinish nuqtasi A', 'точка касания A', 'contact point A')}
        />
      )}
      steps={[]}
      ask={L(
        "Urinma bilan radius orasidagi burchak nechaga teng?",
        'Чему равен угол между касательной и радиусом?',
        'What is the angle between the tangent and the radius?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '90°' },
        {
          id: 'wrong',
          label: L("Har xil bo'lishi mumkin", 'Может быть разным', 'It may vary'),
          hint: L(
            "Radius eng qisqa masofa bo'lib chiqdi, eng qisqa masofa esa har doim perpendikulyar. Demak burchak bitta va u to'g'ri.",
            'Радиус оказался кратчайшим расстоянием, а кратчайшее это всегда перпендикуляр. Значит угол один и он прямой.',
            'The radius turned out to be the shortest distance, and the shortest is always the perpendicular. So the angle is fixed and right.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Urinma radiusga perpendikulyar. Urinma bilan bog'liq deyarli har bir masala shu to'g'ri burchakdan boshlanadi.",
        'Верно. Касательная перпендикулярна радиусу. Почти любая задача про касательную начинается с этого прямого угла.',
        'Correct. A tangent is perpendicular to the radius. Almost every tangent problem starts from that right angle.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — teskari teorema.
// ============================================================
const S5 = {
  eyebrow: L('TESKARI TEOREMA', 'ОБРАТНАЯ ТЕОРЕМА', 'THE CONVERSE'),
  title: L(
    "Perpendikulyar chizsak, urinma chiqadimi",
    'Проведём перпендикуляр — выйдет ли касательная',
    'Draw a perpendicular and get a tangent',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Radiusning aylanadagi uchidan unga perpendikulyar chiziq o'tkazamiz.",
      'Теперь наоборот. Через конец радиуса на окружности проведём перпендикулярную ему прямую.',
      'Now the reverse. Through the end of a radius on the circle draw a line perpendicular to it.'),
    A('why',
      "Bu chiziqning markazgacha bo'lgan masofasi nechaga teng?",
      'Чему равно расстояние от этой прямой до центра?',
      'What is the distance from this line to the centre?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('d = ?', 'd = ?', 'd = ?')}
      steps={[
        { id: 'a', head: L('Perpendikulyar', 'Перпендикуляр', 'The perpendicular'), lines: ['d = OA = R'] },
      ]}
      ask={L(
        "Demak bu chiziq aylanaga nisbatan qanday?",
        'Значит какова эта прямая по отношению к окружности?',
        'So how does this line relate to the circle?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Urinma', 'Касательная', 'A tangent') },
        {
          id: 'wrong',
          label: L('Kesuvchi', 'Секущая', 'A secant'),
          hint: L(
            "Kesuvchida d radiusdan KICHIK bo'ladi. Bu yerda esa masofa aynan radiusga teng, chunki u radiusning o'zi.",
            'У секущей d МЕНЬШЕ радиуса. А здесь расстояние в точности равно радиусу, ведь это сам радиус.',
            'For a secant d is LESS than the radius. Here the distance equals the radius exactly, since it is the radius itself.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu urinmaning ALOMATI: radiusga perpendikulyar va uning aylanadagi uchidan o'tsa, chiziq urinma bo'ladi. Teorema ikkala tomonga ham ishlaydi.",
        'Верно. Это ПРИЗНАК касательной: перпендикулярна радиусу и проходит через его конец на окружности. Теорема работает в обе стороны.',
        'Correct. This is the tangent CRITERION: perpendicular to the radius and through its end on the circle. The theorem works both ways.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — ikkita urinma.
// ============================================================
const S6 = {
  eyebrow: L('IKKITA URINMA', 'ДВЕ КАСАТЕЛЬНЫЕ', 'TWO TANGENTS'),
  title: L(
    "Tashqi nuqtadan ikkita urinma",
    'Из внешней точки две касательные',
    'Two tangents from an outside point',
  ),
  audio: [
    A('mount',
      "Aylanadan tashqaridagi nuqtadan unga ikkita urinma o'tkazish mumkin. Urinish nuqtalarigacha bo'lgan kesmalarni solishtiramiz.",
      'Из точки вне окружности можно провести к ней две касательные. Сравним отрезки до точек касания.',
      'From a point outside a circle two tangents can be drawn. Compare the segments to the contact points.'),
    A('why',
      "Ikkita to'g'ri burchakli uchburchak hosil bo'ladi, ularning gipotenuzasi umumiy va katetlari radiusga teng.",
      'Получаются два прямоугольных треугольника с общей гипотенузой и катетами, равными радиусу.',
      'Two right triangles appear with a shared hypotenuse and legs equal to the radius.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 55, label: 'C' }, { deg: 305, label: 'B' }]}
          radii={[0, 1]}
          showCenter
          cap={L('ikkita urinish nuqtasi', 'две точки касания', 'two contact points')}
        />
      )}
      steps={[
        { id: 'a', head: L('Uchburchaklar', 'Треугольники', 'The triangles'), lines: ['OB = OC = R', L('OA — umumiy tomon', 'OA — общая сторона', 'OA is the shared side')] },
      ]}
      ask={L(
        "AB va AC kesmalar haqida nima deyish mumkin?",
        'Что можно сказать об отрезках AB и AC?',
        'What can be said of the segments AB and AC?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ular teng', 'Они равны', 'They are equal') },
        {
          id: 'wrong',
          label: L("Ular har xil", 'Они разные', 'They differ'),
          hint: L(
            "Ikkala uchburchakning gipotenuzasi bitta va katetlari teng, demak uchburchaklar teng. Teng uchburchaklarning mos tomonlari ham teng.",
            'У обоих треугольников общая гипотенуза и равные катеты, значит треугольники равны. А у равных треугольников равны и соответственные стороны.',
            'Both triangles share a hypotenuse and have equal legs, so the triangles are equal. Equal triangles have equal corresponding sides.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning 427-mashqi. Tashqi nuqtadan chiqqan ikkita urinma har doim teng, va bu masalalarda tez-tez kerak bo'ladi.",
        'Верно. Это задача 427 учебника. Две касательные из внешней точки всегда равны, и это часто нужно в задачах.',
        'Correct. This is exercise 427. Two tangents from an outside point are always equal, and problems need this often.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — vatar uzunligi.
// ============================================================
const S7 = {
  eyebrow: L('VATAR UZUNLIGI', 'ДЛИНА ХОРДЫ', 'THE CHORD LENGTH'),
  title: L(
    "Kesuvchi holda vatarni hisoblash",
    'Считаем хорду в случае секущей',
    'Computing the chord for a secant',
  ),
  audio: [
    A('mount',
      "Chiziq aylanani ikki joyda kessa, ular orasidagi qism vatar bo'ladi.",
      'Если прямая пересекает окружность в двух местах, часть между ними это хорда.',
      'If a line cuts the circle twice, the piece between the cuts is a chord.'),
    A('why',
      "Markazdan vatarga tushirilgan perpendikulyar uni teng ikkiga bo'ladi, shunda to'g'ri burchakli uchburchak paydo bo'ladi.",
      'Перпендикуляр из центра делит хорду пополам, и появляется прямоугольный треугольник.',
      'The perpendicular from the centre halves the chord and a right triangle appears.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('R = 5,   d = 3', 'R = 5,   d = 3', 'R = 5,   d = 3')}
      steps={[
        { id: 'a', head: L('Yarim vatar', 'Половина хорды', 'Half the chord'), lines: ['√(25 − 9) = 4'] },
      ]}
      ask={L(
        "Vatarning to'liq uzunligi nechaga teng?",
        'Чему равна полная длина хорды?',
        'What is the full length of the chord?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '8' },
        {
          id: 'wrong',
          label: '4',
          hint: L(
            "To'rt bu vatarning YARMI, chunki perpendikulyar uni teng ikkiga bo'lgandi. Javob uchun ikkiga ko'paytirish kerak.",
            'Четыре это ПОЛОВИНА хорды, ведь перпендикуляр разделил её пополам. Для ответа нужно умножить на два.',
            'Four is HALF the chord, since the perpendicular split it in two. The answer needs doubling.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Formula shunday yoziladi: vatar teng ikki karra ildiz ostida R kvadrat minus d kvadrat.",
        'Верно. Формула записывается так: хорда равна двум корням из R в квадрате минус d в квадрате.',
        'Correct. The formula reads: the chord equals twice the root of R squared minus d squared.',
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
    'Geometriya 8, 35-mavzu (111-113-bet)',
    'Геометрия 8, тема 35 (стр. 111-113)',
    'Geometry 8, topic 35 (p. 111-113)',
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
          "Urinma masalasini yechish odatda nimadan boshlanadi?",
          'С чего обычно начинается решение задачи о касательной?',
          'How does a tangent problem usually begin?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Urinish nuqtasiga radius chizishdan",
              'С проведения радиуса в точку касания',
              'By drawing the radius to the contact point',
            ),
          },
          {
            id: 'wrong',
            label: L("Vatar uzunligini hisoblashdan", 'С вычисления длины хорды', 'By computing the chord length'),
            hint: L(
              "Vatar urinma holda umuman yo'q: umumiy nuqta bitta. Radius esa darrov to'g'ri burchak beradi.",
              'При касании хорды вообще нет: общая точка одна. А радиус сразу даёт прямой угол.',
              'With a tangent there is no chord at all: one common point. The radius, though, gives a right angle at once.',
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
    "Bitta taqqoslash va bitta to'g'ri burchak",
    'Одно сравнение и один прямой угол',
    'One comparison and one right angle',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz uchta holni, urinmaning xossasini va alomatini hamda vatar formulasini ko'rdingiz.",
      'На семи экранах ты увидел три случая, свойство и признак касательной и формулу хорды.',
      'On seven screens you met the three cases, the tangent property and criterion, and the chord formula.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — darslikning 424-mashqi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Har safar d va R ni solishtiring",
    'Каждый раз сравнивай d и R',
    'Compare d and R each time',
  ),
  audio: [
    A('mount',
      "Uchta holat. Har birida radius va masofa berilgan.",
      'Три случая. В каждом даны радиус и расстояние.',
      'Three cases. Each gives a radius and a distance.'),
    A('why',
      "Diqqat qiling. Birliklar har doim ham bir xil bo'lavermaydi.",
      'Будь внимателен. Единицы не всегда одинаковы.',
      'Be careful. The units are not always the same.'),
  ],
  props: {
    stepLabel: L('Holat', 'Случай', 'Case'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Uchinchisida birliklarni tenglashtirish kerak edi — bu masalalarda tez-tez uchraydigan tuzoq.",
      'Все три найдены. В третьем нужно было привести единицы к одной — частая ловушка в задачах.',
      'All three are found. The third needed the units matched, a common trap in problems.',
    ),
    tasks: [
      {
        expr: 'R = 8,   d = 6',
        question: L('Nechta umumiy nuqta bor?', 'Сколько общих точек?', 'How many common points?'),
        ok: L("Ha, ikkita. Olti sakkizdan kichik, demak chiziq kesuvchi.", 'Да, две. Шесть меньше восьми, значит прямая секущая.', 'Yes, two. Six is less than eight, so the line is a secant.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Две', 'Two') },
          { id: 'b', label: L('Bitta', 'Одна', 'One'), hint: L("Bitta nuqta faqat TENGLIKDA bo'ladi. Bu yerda esa masofa radiusdan kichik.", 'Одна точка бывает только при РАВЕНСТВЕ. А здесь расстояние меньше радиуса.', 'A single point happens only at EQUALITY. Here the distance is less than the radius.') },
        ],
        solution: ['6 < 8', L('kesuvchi', 'секущая', 'a secant')],
      },
      {
        expr: 'R = 4,   d = 40 mm',
        question: L('Nechta umumiy nuqta bor?', 'Сколько общих точек?', 'How many common points?'),
        ok: L("Ha, bitta. Qirq millimetr to'rt santimetrga teng, ya'ni masofa radiusga teng.", 'Да, одна. Сорок миллиметров это четыре сантиметра, то есть расстояние равно радиусу.', 'Yes, one. Forty millimetres is four centimetres, so the distance equals the radius.'),
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Одна', 'One') },
          { id: 'b', label: L("Yo'q", 'Ни одной', 'None'), hint: L("Qirq to'rtdan katta ko'rinadi, lekin birliklar har xil. Millimetrni santimetrga o'tkazing.", 'Сорок кажется больше четырёх, но единицы разные. Переведи миллиметры в сантиметры.', 'Forty looks larger than four, but the units differ. Convert the millimetres to centimetres.') },
        ],
        solution: ['40 mm = 4 sm', 'd = R', L('urinma', 'касательная', 'a tangent')],
      },
      {
        expr: 'R = 1,6 dm,   d = 24 sm',
        question: L('Nechta umumiy nuqta bor?', 'Сколько общих точек?', 'How many common points?'),
        ok: L("Ha, birorta ham yo'q. Yigirma to'rt santimetr ikki butun to'rt o'ndan detsimetr, u radiusdan katta.", 'Да, ни одной. Двадцать четыре сантиметра это две целых четыре десятых дециметра, больше радиуса.', 'Yes, none. Twenty four centimetres is two point four decimetres, more than the radius.'),
        items: [
          { id: 'a', right: true, label: L("Birorta ham yo'q", 'Ни одной', 'None') },
          { id: 'b', label: L('Ikkita', 'Две', 'Two'), hint: L("Ikkitasi masofa radiusdan kichik bo'lganda edi. Bu yerda esa ikki butun to'rt o'ndan bir butun olti o'ndandan katta.", 'Две было при расстоянии меньше радиуса. А здесь две целых четыре десятых больше одной целой шести десятых.', 'Two came when the distance was less than the radius. Here two point four exceeds one point six.') },
        ],
        solution: ['24 sm = 2,4 dm', '2,4 > 1,6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — vatar uzunligi.
// ============================================================
const S10 = {
  eyebrow: L('VATAR', 'ХОРДА', 'THE CHORD'),
  title: L(
    "Formula bo'yicha hisoblash",
    'Считаем по формуле',
    'Computing by the formula',
  ),
  audio: [
    A('mount',
      "Ikkita masala. Har birida radius va masofa berilgan, vatarni topish kerak.",
      'Две задачи. В каждой даны радиус и расстояние, нужно найти хорду.',
      'Two problems. Each gives a radius and a distance, and the chord must be found.'),
    A('why',
      "Ildiz ostida radiusning kvadratidan masofaning kvadrati ayiriladi.",
      'Под корнем из квадрата радиуса вычитается квадрат расстояния.',
      'Under the root the squared distance is taken from the squared radius.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Ildizdan chiqqan son yarim vatar, shuning uchun oxirida ikkiga ko'paytirish esdan chiqmasin.",
      'Обе найдены. Число из-под корня это половина хорды, поэтому не забывай в конце умножить на два.',
      'Both are found. The number from the root is half the chord, so remember the final doubling.',
    ),
    tasks: [
      {
        expr: 'R = 13,   d = 5',
        question: L('Vatar nechaga teng?', 'Чему равна хорда?', 'What does the chord equal?'),
        ok: L("Ha. Bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki, ikkilangani yigirma to'rt.", 'Да. Сто шестьдесят девять минус двадцать пять сто сорок четыре, корень двенадцать, удвоенный двадцать четыре.', 'Yes. One hundred sixty nine minus twenty five is one hundred forty four, its root twelve, doubled twenty four.'),
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '12', hint: L("O'n ikki bu yarim vatar. Perpendikulyar vatarni teng ikkiga bo'lgandi.", 'Двенадцать это половина хорды. Перпендикуляр разделил её пополам.', 'Twelve is half the chord. The perpendicular split it in two.') },
        ],
        solution: ['√(169 − 25) = 12', '2 · 12 = 24'],
      },
      {
        expr: 'R = 10,   d = 6',
        question: L('Vatar nechaga teng?', 'Чему равна хорда?', 'What does the chord equal?'),
        ok: L("Ha. Yuz minus o'ttiz olti oltmish to'rt, ildizi sakkiz, ikkilangani o'n olti.", 'Да. Сто минус тридцать шесть шестьдесят четыре, корень восемь, удвоенный шестнадцать.', 'Yes. One hundred minus thirty six is sixty four, its root eight, doubled sixteen.'),
        items: [
          { id: 'a', right: true, label: '16' },
          { id: 'b', label: '8', hint: L("Sakkiz ildizdan chiqqan son, ya'ni yarim vatar. Uni ikkiga ko'paytirish qolgan.", 'Восемь это число из-под корня, то есть половина хорды. Осталось умножить на два.', 'Eight came from the root and is half the chord. It still needs doubling.') },
        ],
        solution: ['√(100 − 36) = 8', '2 · 8 = 16'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — darslikning 429-mashqi.
// ============================================================
const S11 = {
  eyebrow: L('IKKITA PERPENDIKULYAR URINMA', 'ДВЕ ПЕРПЕНДИКУЛЯРНЫЕ КАСАТЕЛЬНЫЕ', 'TWO PERPENDICULAR TANGENTS'),
  title: L(
    "To'rtburchak kvadrat bo'lib chiqadi",
    'Четырёхугольник оказывается квадратом',
    'The quadrilateral turns out to be a square',
  ),
  audio: [
    A('mount',
      "Tashqi nuqtadan ikkita o'zaro perpendikulyar urinma o'tkazilgan. Radiuslarni urinish nuqtalariga chizamiz.",
      'Из внешней точки проведены две взаимно перпендикулярные касательные. Проведём радиусы в точки касания.',
      'Two mutually perpendicular tangents are drawn from an outside point. Draw the radii to the contact points.'),
    A('why',
      "Hosil bo'lgan to'rtburchakda nechta to'g'ri burchak bor?",
      'Сколько прямых углов в получившемся четырёхугольнике?',
      'How many right angles does the resulting quadrilateral have?'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Uchta to'g'ri burchak to'rtburchakni to'g'ri to'rtburchak qiladi, ikkita teng qo'shni tomon esa uni kvadratga aylantiradi.",
      'Оба шага сделаны. Три прямых угла делают четырёхугольник прямоугольником, а две равные смежные стороны превращают его в квадрат.',
      'Both steps are done. Three right angles make it a rectangle, and two equal adjacent sides make it a square.',
    ),
    tasks: [
      {
        expr: '⊥',
        question: L(
          "To'rtburchakda nechta to'g'ri burchak bor?",
          'Сколько прямых углов в четырёхугольнике?',
          'How many right angles does the quadrilateral have?',
        ),
        ok: L(
          "Ha, uchta. Ikkitasi urinma bilan radius orasida, uchinchisi esa urinmalar orasida.",
          'Да, три. Два между касательной и радиусом, третий между самими касательными.',
          'Yes, three. Two between tangent and radius, the third between the tangents.',
        ),
        items: [
          { id: 'a', right: true, label: L('Uchta', 'Три', 'Three') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("Urinmalar ikkita, va har biri o'z radiusiga perpendikulyar. Ular bir birga ham perpendikulyar deb berilgan.", 'Касательных две, и каждая перпендикулярна своему радиусу. И друг другу они тоже перпендикулярны по условию.', 'There are two tangents, each perpendicular to its own radius. And they are perpendicular to each other by the condition.') },
        ],
        solution: [L('urinma radiusga perpendikulyar', 'касательная перпендикулярна радиусу', 'tangent is perpendicular to radius'), '3'],
      },
      {
        expr: 'OB = OC = R',
        question: L(
          "Har bir urinmaning uzunligi nechaga teng?",
          'Чему равна длина каждой касательной?',
          'What is the length of each tangent?',
        ),
        ok: L(
          "Ha, radiusga teng. To'rtburchak kvadrat bo'lib chiqdi, uning hamma tomoni teng.",
          'Да, радиусу. Четырёхугольник оказался квадратом, у него все стороны равны.',
          'Yes, the radius. The quadrilateral is a square and all its sides are equal.',
        ),
        items: [
          { id: 'a', right: true, label: 'R' },
          { id: 'b', label: '2R', hint: L("Ikki R diametr bo'lardi. Kvadratning tomoni esa radiusga teng, chunki ikkita qo'shni tomoni radius.", 'Два R это диаметр. А сторона квадрата равна радиусу, ведь две смежные стороны это радиусы.', 'Two R is a diameter. The square side equals the radius, since two adjacent sides are radii.') },
        ],
        solution: [L('kvadrat', 'квадрат', 'a square'), 'AB = AC = R'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — shartni tekshirmaslik.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ildiz ostida manfiy son",
    'Под корнем отрицательное число',
    'A negative under the root',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Radius besh, masofa yetti. U vatar formulasiga qo'ygan va ildiz ostida minus yigirma to'rt chiqqan.",
      'Решение Камрона. Радиус пять, расстояние семь. Он подставил в формулу хорды и под корнем вышло минус двадцать четыре.',
      "Kamron's solution. The radius is five and the distance seven. He used the chord formula and got minus twenty four under the root."),
    A('why',
      "Kamron kalkulyator xato ishlayapti deb o'ylagan. Aslida esa formula boshqa narsani aytyapti.",
      'Камрон решил, что калькулятор врёт. На деле формула говорит о другом.',
      'Kamron decided the calculator was broken. In fact the formula is saying something else.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI XULOSA", 'ВЕРНЫЙ ВЫВОД', 'THE RIGHT CONCLUSION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ildiz ostidagi manfiy son xato emas, XABAR: bunday vatar mavjud emas, chunki chiziq aylanani umuman kesmaydi. Formulani qo'llashdan oldin d va R ni solishtirish kerak edi — bu 27-darsdagi «shartni o'zim tekshiraman» odatining o'sha davomi.",
      'Отрицательное число под корнем это не ошибка, а СООБЩЕНИЕ: такой хорды нет, ведь прямая вообще не пересекает окружность. Перед формулой нужно было сравнить d и R — то же продолжение привычки проверять условие, что и на 27 уроке.',
      'A negative under the root is not an error but a MESSAGE: no such chord exists, since the line never meets the circle. Comparing d and R had to come first — the same habit of checking the condition as in lesson 27.',
    ),
    tasks: [
      {
        expr: 'R = 5,   d = 7   →   √(25 − 49)',
        question: L(
          "Ildiz ostida manfiy son chiqishi nimani bildiradi?",
          'О чём говорит отрицательное число под корнем?',
          'What does a negative under the root tell us?',
        ),
        ok: L(
          "To'g'ri. Masofa radiusdan katta, demak chiziq aylanani kesmaydi va hech qanday vatar yo'q.",
          'Верно. Расстояние больше радиуса, значит прямая не пересекает окружность и никакой хорды нет.',
          'Correct. The distance exceeds the radius, so the line misses the circle and there is no chord at all.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Bunday vatar yo'q, chiziq kesmaydi", 'Такой хорды нет, прямая не пересекает', 'No such chord, the line does not cut'),
          },
          {
            id: 'b',
            label: L("Hisobda arifmetik xato bor", 'В счёте арифметическая ошибка', 'There is an arithmetic slip'),
            hint: L(
              "Hisobni tekshiring: yigirma besh minus qirq to'qqiz haqiqatan ham minus yigirma to'rt. Xato hisobda emas, formulani qo'llashda.",
              'Проверь счёт: двадцать пять минус сорок девять и правда минус двадцать четыре. Ошибка не в счёте, а в применении формулы.',
              'Check the arithmetic: twenty five minus forty nine really is minus twenty four. The slip is not in the counting but in applying the formula.',
            ),
          },
        ],
        solution: [
          'd = 7 > R = 5',
          L('umumiy nuqta yoq', 'общих точек нет', 'no common points'),
          L('vatar yoq', 'хорды нет', 'no chord'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 430-mashqi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Qanday radiusda urinma bo'ladi",
    'При каком радиусе выйдет касание',
    'At what radius does it touch',
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchakda gipotenuza o'n, o'tkir burchaklardan biri o'ttiz gradus. Markazi A nuqtada bo'lgan aylana chizilgan.",
      'В прямоугольном треугольнике гипотенуза десять, один из острых углов тридцать градусов. Проведена окружность с центром в точке A.',
      'In a right triangle the hypotenuse is ten and one acute angle is thirty degrees. A circle is drawn with centre at A.'),
    A('why',
      "Aylana BC chiziqqa urinishi uchun radius nimaga teng bo'lishi kerak? Avval A dan BC gacha masofani toping.",
      'Каким должен быть радиус, чтобы окружность касалась прямой BC? Сначала найди расстояние от A до BC.',
      'What radius makes the circle touch the line BC? First find the distance from A to BC.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Masala ikkita darsni birlashtirdi: masofa 33-darsning sinusi bilan topildi, keyin bugungi uchta hol qo'llanildi. Bitta son barcha uchala savolga javob berdi.",
      'Задача соединила два урока: расстояние найдено синусом с 33 урока, дальше применены сегодняшние три случая. Одно число ответило сразу на все три вопроса.',
      'The problem joined two lessons: the distance came from the sine of lesson 33, then today three cases applied. One number answered all three questions.',
    ),
    tasks: [
      {
        expr: 'AB = 10,   ∠ABC = 30°',
        question: L(
          "A nuqtadan BC chiziqqacha masofa nechaga teng?",
          'Чему равно расстояние от точки A до прямой BC?',
          'What is the distance from A to the line BC?',
        ),
        ok: L(
          "Ha, beshga. Burchak C to'g'ri, demak AC ning o'zi perpendikulyar, va u o'n karra sinus o'ttizga teng.",
          'Да, пяти. Угол C прямой, значит AC и есть перпендикуляр, он равен десять на синус тридцати.',
          'Yes, five. The angle C is right, so AC is the perpendicular itself, equal to ten times the sine of thirty.',
        ),
        items: [
          { id: 'a', right: true, label: '5' },
          {
            id: 'b',
            label: '10',
            hint: L(
              "O'n bu GIPOTENUZA, ya'ni A dan B gacha. Masofa esa perpendikulyar bo'yicha o'lchanadi, u esa AC kateti.",
              'Десять это ГИПОТЕНУЗА, от A до B. А расстояние измеряется по перпендикуляру, то есть по катету AC.',
              'Ten is the HYPOTENUSE from A to B. Distance is measured along the perpendicular, the leg AC.',
            ),
          },
        ],
        solution: ['AC = 10 · sin30°', 'AC = 5'],
      },
      {
        expr: 'd = 5',
        question: L(
          "Aylana BC ga urinishi uchun radius qanday bo'lishi kerak?",
          'Каким должен быть радиус, чтобы окружность касалась BC?',
          'What radius makes the circle touch BC?',
        ),
        ok: L(
          "Ha, beshga teng. Kichikroq bo'lsa umumiy nuqta bo'lmaydi, kattaroq bo'lsa ikkita bo'ladi.",
          'Да, равным пяти. Меньше и общих точек не будет, больше и их станет две.',
          'Yes, equal to five. Smaller and there are no common points, larger and there are two.',
        ),
        items: [
          { id: 'a', right: true, label: 'R = 5' },
          {
            id: 'b',
            label: 'R < 5',
            hint: L(
              "Radius masofadan kichik bo'lsa, aylana chiziqqa yetib bormaydi. Urinish esa aynan TENGLIKDA bo'ladi.",
              'Если радиус меньше расстояния, окружность до прямой не достаёт. А касание бывает именно при РАВЕНСТВЕ.',
              'If the radius is under the distance, the circle never reaches the line. Touching happens exactly at EQUALITY.',
            ),
          },
        ],
        solution: ['d = R = 5', L('urinma', 'касание', 'tangency')],
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
    "Blits: taqqoslash, burchak, tenglik",
    'Блиц: сравнение, угол, равенство',
    'Blitz: comparison, angle, equality',
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
        tag: 'd-va-r-solishtirmaslik',
        ask: L(
          "Masofa radiusga teng bo'lsa, chiziq qanday deyiladi?",
          'Как называется прямая, если расстояние равно радиусу?',
          'What is the line called when the distance equals the radius?',
        ),
        options: [
          { id: 'r', right: true, label: L('Urinma', 'Касательная', 'A tangent') },
          { id: 'w', label: L('Kesuvchi', 'Секущая', 'A secant') },
        ],
        ok: L(
          "To'g'ri. Tenglikda umumiy nuqta bitta bo'ladi.",
          'Верно. При равенстве общая точка одна.',
          'Correct. At equality there is a single common point.',
        ),
        hint: L(
          "Kesuvchida masofa radiusdan KICHIK bo'ladi va ikkita nuqta chiqadi.",
          'У секущей расстояние МЕНЬШЕ радиуса и точек выходит две.',
          'For a secant the distance is LESS than the radius and two points appear.',
        ),
      },
      {
        id: 'q2',
        tag: 'urinma-perpendikulyar-emas',
        ask: L(
          "Urinma bilan urinish nuqtasidagi radius orasidagi burchak qanday?",
          'Каков угол между касательной и радиусом в точке касания?',
          'What is the angle between a tangent and the radius at the contact point?',
        ),
        options: [
          { id: 'r', right: true, label: '90°' },
          { id: 'w', label: L("Har xil", 'Разный', 'It varies') },
        ],
        ok: L(
          "To'g'ri. Radius eng qisqa masofa, eng qisqasi esa perpendikulyar.",
          'Верно. Радиус это кратчайшее расстояние, а кратчайшее это перпендикуляр.',
          'Correct. The radius is the shortest distance, and the shortest is the perpendicular.',
        ),
        hint: L(
          "2 va 4-ekranni eslang: eng qisqa kesma har doim perpendikulyar bo'ladi.",
          'Вспомни 2 и 4 экраны: кратчайший отрезок всегда перпендикуляр.',
          'Recall screens 2 and 4: the shortest segment is always the perpendicular.',
        ),
      },
      {
        id: 'q3',
        tag: 'ikki-urinma-teng',
        ask: L(
          "Tashqi nuqtadan o'tkazilgan ikkita urinma haqida nima deyish mumkin?",
          'Что можно сказать о двух касательных из внешней точки?',
          'What can be said of two tangents from an outside point?',
        ),
        options: [
          { id: 'r', right: true, label: L('Ular teng', 'Они равны', 'They are equal') },
          { id: 'w', label: L('Ular har xil', 'Они разные', 'They differ') },
        ],
        ok: L(
          "To'g'ri. Ikkita to'g'ri burchakli uchburchak teng chiqadi.",
          'Верно. Два прямоугольных треугольника оказываются равными.',
          'Correct. The two right triangles turn out equal.',
        ),
        hint: L(
          "6-ekranni eslang: gipotenuza umumiy, katetlar esa radiusga teng.",
          'Вспомни 6 экран: гипотенуза общая, а катеты равны радиусу.',
          'Recall screen 6: the hypotenuse is shared and the legs equal the radius.',
        ),
      },
      {
        id: 'q4',
        tag: 'shartni-tekshirmaslik',
        ask: L(
          "Vatar formulasida ildiz ostida manfiy son chiqsa, bu nimani bildiradi?",
          'Что означает отрицательное число под корнем в формуле хорды?',
          'What does a negative under the root in the chord formula mean?',
        ),
        options: [
          { id: 'r', right: true, label: L("Vatar mavjud emas", 'Хорды не существует', 'No such chord exists') },
          { id: 'w', label: L('Hisobda xato bor', 'В счёте ошибка', 'There is a slip in the counting') },
        ],
        ok: L(
          "To'g'ri. Chiziq aylanani kesmaydi, demak vatar ham yo'q.",
          'Верно. Прямая не пересекает окружность, значит и хорды нет.',
          'Correct. The line does not cut the circle, so there is no chord.',
        ),
        hint: L(
          "12-ekranni eslang: hisob to'g'ri edi, formula esa noto'g'ri joyda qo'llanilgandi.",
          'Вспомни 12 экран: счёт был верен, а формула применена не там.',
          'Recall screen 12: the arithmetic was right and the formula misapplied.',
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
    "Bitta son va bitta to'g'ri burchak",
    'Одно число и один прямой угол',
    'One number and one right angle',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda umumiy nuqtalar soni faqat ikkita songa bog'liq ekani ko'rindi: masofa va radius.",
      'На первом экране выяснилось, что число общих точек зависит лишь от двух чисел: расстояния и радиуса.',
      'On the first screen the number of common points turned out to depend on just two numbers: the distance and the radius.'),
    A('s1',
      "Siz urinmaning xossasini va alomatini, ikkita urinmaning tengligini va vatar formulasini bildingiz.",
      'Ты узнал свойство и признак касательной, равенство двух касательных и формулу хорды.',
      'You learned the tangent property and criterion, the equality of two tangents, and the chord formula.'),
    A('s2',
      "Keyingi darsda ichki va tashqi chizilgan ko'pburchaklar.",
      'В следующем уроке вписанные и описанные многоугольники.',
      'The next lesson covers inscribed and circumscribed polygons.'),
  ],
  props: {
    mark: 'd = R',
    markNote: L(
      "urinmaning yagona sharti",
      'единственное условие касания',
      'the only condition for tangency',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: ichki va tashqi chizilgan ko\'pburchaklar',
      'Следующий урок: вписанные и описанные многоугольники',
      'Next lesson: inscribed and circumscribed polygons',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'urinma-perpendikulyar-emas', ...S2 },
  { role: 'explain',  tag: 'd-va-r-solishtirmaslik', ...S3 },
  { role: 'explain',  tag: 'urinma-perpendikulyar-emas', ...S4 },
  { role: 'explain',  tag: 'urinma-perpendikulyar-emas', ...S5 },
  { role: 'explain',  tag: 'ikki-urinma-teng', ...S6 },
  { role: 'explain',  tag: 'shartni-tekshirmaslik', ...S7 },
  { role: 'rule',     tag: 'urinma-perpendikulyar-emas', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'd-va-r-solishtirmaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'shartni-tekshirmaslik', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'ikki-urinma-teng', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'shartni-tekshirmaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'd-va-r-solishtirmaslik', ...S13 },
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
