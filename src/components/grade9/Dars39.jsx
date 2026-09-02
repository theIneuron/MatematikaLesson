// ============================================================================
// 9-sinf, Dars 39. ICHKI VA TASHQI CHIZILGAN KO'PBURCHAKLAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 36-dars (104-105-bet)
// va 38-dars (108-109-bet).
//   Ta'rif (104-bet): barcha uchlari aylanada yotgan ko'pburchak ichki
//       chizilgan, aylana esa tashqi chizilgan deyiladi.
//   MUHIM SHART (104-bet): uchtadan ko'p burchagi bo'lgan ko'pburchakka
//       har doim ham tashqi aylana chizib bo'lmaydi. To'rtburchak uchun
//       shart aniq: qarama-qarshi burchaklar yig'indisi 180° bo'lishi
//       KERAK VA YETARLI. Parallelogrammga (to'g'ri to'rtburchakdan
//       tashqari) tashqi aylana chizib bo'lmaydi.
//   Markaz (105-bet): tomonlarning o'rta perpendikulyarlari kesishgan
//       nuqtada yotadi.
//   2-masala (104-105-bet): teng yonli uchburchak, asosga tushirilgan
//       balandlik 16, R = 10 → OD = 6, AD = 8, AC = 16, AB = 8√5.
//   36.4: katetlari 16 va 12 → gipotenuza 20 → R = 10.
//   36.5: R = 25, to'rtburchak tomoni 14 → diagonal 50, ikkinchi tomon
//       48, yuz 672.
//   36.6: R = 10 uchun teng tomonli uchburchak, kvadrat va teng yonli
//       to'g'ri burchakli uchburchak tomonlari.
//   38-dars: muntazam n burchakning har bir burchagi (n−2)/n · 180°.
//
// DARS 37-DARSNI DAVOM ETTIRADI. U yerda TRANSFER sifatida ichki
// chizilgan to'rtburchakda qarama-qarshi burchaklar yig'indisi 180°
// ekani CHIQARILGANDI. Bugun shu tenglik ikkinchi tomondan o'qiladi:
// u shart ham ekan, ya'ni yig'indi 180° bo'lmasa, aylana umuman
// chizilmaydi. Xuk aynan shu yerda: parallelogramm.
//
// XUK KUTILMAGAN. Parallelogramm «yaxshi» figura, lekin unga tashqi
// aylana chizib bo'lmaydi: qarama-qarshi burchaklari TENG, demak
// ularning yig'indisi 180° bo'lishi uchun har biri 90° bo'lishi kerak.
// Ya'ni faqat to'g'ri to'rtburchakgina ichki chiziladi.
//
// TUZOQ (12-ekran): romb. U ham parallelogramm, lekin bolaga «hamma
// tomoni teng» degani «juda muntazam» bo'lib tuyuladi. Ekran uni
// o'sha hisob bilan yiqitadi: rombning qarama-qarshi burchaklari ham
// teng, demak faqat kvadrat ichki chiziladi.
//
// TRANSFER (13-ekran) 37-DARSNING «DIAMETRGA TIRALGAN BURCHAK 90°»
// natijasini teskari yo'nalishda ishlatadi: to'g'ri burchakli
// uchburchakda gipotenuza DIAMETR bo'ladi, demak R = c : 2. Bu
// 36.4-mashqni bir qatorda yechadi.
//
// CHIZMA: `CircleFig` (7H) va `PolyPair` (7G) qayta ishlatildi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { CircleFig, G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-39',
  n: 39,
  row: 39,
  block: 'Б7',
  topic: L(
    "Ichki va tashqi chizilgan ko'pburchaklar",
    'Вписанные и описанные многоугольники',
    'Inscribed and circumscribed polygons',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "To'rtburchak aylanaga ichki chizilishi uchun qarama-qarshi burchaklar yig'indisi 180° bo'lishi shart",
    'Чтобы четырёхугольник вписывался в окружность, сумма противоположных углов должна быть 180°',
    'A quadrilateral is inscribable exactly when its opposite angles add to 180°',
  ),
  L(
    "Tashqi chizilgan aylananing markazi tomonlarning o'rta perpendikulyarlarida yotadi",
    'Центр описанной окружности лежит на серединных перпендикулярах сторон',
    'The centre of a circumscribed circle lies on the perpendicular bisectors of the sides',
  ),
  L(
    "To'g'ri burchakli uchburchakda gipotenuza diametr, ya'ni R gipotenuzaning yarmi",
    'В прямоугольном треугольнике гипотенуза это диаметр, то есть R это её половина',
    'In a right triangle the hypotenuse is a diameter, so R is half of it',
  ),
]

export const MISS = {
  'har-doim-chiziladi': {
    what: L(
      "har qanday to'rtburchakka tashqi aylana chiziladi deb hisoblandi",
      'сочтено, что около любого четырёхугольника можно описать окружность',
      'it was assumed any quadrilateral can be circumscribed',
    ),
    wrong: null,
    at: 0,
  },
  'gipotenuza-diametr-emas': {
    what: L(
      "to'g'ri burchakli uchburchakda gipotenuza diametr ekani ishlatilmadi",
      'не использовано, что в прямоугольном треугольнике гипотенуза это диаметр',
      'the hypotenuse being a diameter was not used',
    ),
    wrong: null,
    at: 0,
  },
  'markaz-joyini-bilmaslik': {
    what: L(
      "markaz o'rta perpendikulyarda yotishi hisobga olinmadi",
      'не учтено, что центр лежит на серединном перпендикуляре',
      'the centre lying on a perpendicular bisector was not taken into account',
    ),
    wrong: null,
    at: 0,
  },
  'muntazam-burchak-formulasi': {
    what: L(
      "muntazam ko'pburchak burchagi formulasi noto'g'ri qo'llanildi",
      'неверно применена формула угла правильного многоугольника',
      'the regular polygon angle formula was applied wrongly',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — parallelogramm.
// ============================================================
const S1 = {
  eyebrow: L('YAXSHI FIGURA', 'ХОРОШАЯ ФИГУРА', 'A NICE FIGURE'),
  title: L(
    "Parallelogrammni aylanaga joylashtirib bo'ladimi",
    'Уместится ли параллелограмм в окружность',
    'Will a parallelogram fit a circle',
  ),
  audio: [
    A('mount',
      "Parallelogrammning qarama-qarshi tomonlari ham, qarama-qarshi burchaklari ham teng. Bu juda tartibli figura.",
      'У параллелограмма равны и противоположные стороны, и противоположные углы. Это очень правильная фигура.',
      'A parallelogram has equal opposite sides and equal opposite angles. A very orderly figure.'),
    A('why',
      "O'tgan darsda ichki chizilgan to'rtburchakning qarama-qarshi burchaklari yig'indisi bir yuz sakson ekanini chiqargandik. Parallelogrammni tekshiring.",
      'На прошлом уроке мы вывели, что у вписанного четырёхугольника сумма противоположных углов сто восемьдесят. Проверь параллелограмм.',
      'Last lesson we derived that an inscribed quadrilateral has opposite angles summing to one hundred eighty. Check a parallelogram.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('∠A = ∠C', '∠A = ∠C', '∠A = ∠C')}
      steps={[
        { id: 'a', head: L('Shart', 'Условие', 'The condition'), lines: ['∠A + ∠C = 180°'] },
      ]}
      ask={L(
        "Qanday parallelogrammni aylanaga ichki chizish mumkin?",
        'Какой параллелограмм можно вписать в окружность?',
        'Which parallelogram can be inscribed in a circle?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Faqat burchaklari to'g'ri bo'lganini",
            'Только тот, у которого углы прямые',
            'Only one whose angles are right',
          ),
        },
        {
          id: 'wrong',
          label: L('Har qandayini', 'Любой', 'Any of them'),
          hint: L(
            "Qarama-qarshi burchaklar teng, demak ularning yig'indisi bitta burchakning ikkilangani. Ikkilangani bir yuz sakson bo'lsa, burchakning o'zi nechaga teng?",
            'Противоположные углы равны, значит их сумма это удвоенный угол. Если удвоенный равен ста восьмидесяти, чему равен сам угол?',
            'The opposite angles are equal, so their sum is one angle doubled. If the double is one hundred eighty, what is the angle?',
          ),
        },
      ]}
      after={L(
        "Ha, faqat to'g'ri to'rtburchakni. Ikki A bir yuz saksonga teng bo'lsa, A to'qsonga teng. Demak tartibli figura bo'lish yetarli emas, shart aniq.",
        'Да, только прямоугольник. Если два A равно ста восьмидесяти, то A равно девяноста. Значит быть правильной фигурой недостаточно, условие точное.',
        'Yes, only a rectangle. If twice A is one hundred eighty, then A is ninety. Being a nice figure is not enough, the condition is exact.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — 37-darsning natijasi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "O'tgan darsda chiqargan tengligimiz",
    'Равенство, выведенное на прошлом уроке',
    'The identity derived last lesson',
  ),
  audio: [
    A('mount',
      "Ichki chizilgan to'rtburchakning qarama-qarshi burchaklari ikkita yoyning yarmiga teng edi.",
      'Противоположные углы вписанного четырёхугольника равнялись половинам двух дуг.',
      'The opposite angles of an inscribed quadrilateral were halves of two arcs.'),
    A('why',
      "Bu ikkita yoy esa birgalikda butun aylanani beradi.",
      'А эти две дуги вместе дают всю окружность.',
      'And those two arcs together make the whole circle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[
            { deg: 210, label: 'A' }, { deg: 120, label: 'B' },
            { deg: 30, label: 'C' }, { deg: 300, label: 'D' },
          ]}
          chords={[[0, 1], [1, 2], [2, 3], [3, 0]]}
          cap={L('ichki chizilgan to\'rtburchak', 'вписанный четырёхугольник', 'an inscribed quadrilateral')}
        />
      )}
      steps={[]}
      ask={L(
        "Qarama-qarshi burchaklarning yig'indisi nechaga teng?",
        'Чему равна сумма противоположных углов?',
        'What do the opposite angles add up to?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '180°' },
        {
          id: 'wrong',
          label: '360°',
          hint: L(
            "Uch yuz oltmish YOYLARNING yig'indisi. Burchaklar esa yoylarning yarmi, demak ularning yig'indisi ham ikki barobar kichik.",
            'Триста шестьдесят это сумма ДУГ. А углы это половины дуг, значит и сумма вдвое меньше.',
            'Three hundred sixty is the sum of the ARCS. The angles are their halves, so their sum halves too.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun bu tenglik ikkinchi tomondan o'qiladi: u nafaqat natija, balki SHART ham.",
        'Верно. Сегодня это равенство прочитается с другой стороны: оно не только следствие, но и УСЛОВИЕ.',
        'Correct. Today this identity is read the other way: it is not only a consequence but a CONDITION.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — shart ikki tomonlama.
// ============================================================
const S3 = {
  eyebrow: L('IKKI TOMONLAMA', 'В ОБЕ СТОРОНЫ', 'BOTH WAYS'),
  title: L(
    "Natija ham, shart ham",
    'И следствие, и условие',
    'A consequence and a condition',
  ),
  audio: [
    A('mount',
      "O'tgan darsda shunday dedik: agar to'rtburchak ichki chizilgan bo'lsa, yig'indi bir yuz sakson.",
      'На прошлом уроке мы сказали: если четырёхугольник вписан, то сумма сто восемьдесят.',
      'Last lesson we said: if a quadrilateral is inscribed, the sum is one hundred eighty.'),
    A('why',
      "Darslik teskarisini ham tasdiqlaydi: yig'indi bir yuz sakson bo'lsa, aylana chizish MUMKIN.",
      'Учебник утверждает и обратное: если сумма сто восемьдесят, окружность описать МОЖНО.',
      'The textbook also states the converse: if the sum is one hundred eighty, the circle CAN be drawn.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "To'rtburchakda ∠A = 100°, ∠C = 80°",
        'В четырёхугольнике ∠A = 100°, ∠C = 80°',
        'In a quadrilateral ∠A = 100°, ∠C = 80°',
      )}
      steps={[]}
      ask={L(
        "Bu to'rtburchakka tashqi aylana chizish mumkinmi?",
        'Можно ли описать около этого четырёхугольника окружность?',
        'Can a circle be circumscribed about this quadrilateral?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Mumkin', 'Можно', 'It can') },
        {
          id: 'wrong',
          label: L("Mumkin emas", 'Нельзя', 'It cannot'),
          hint: L(
            "Yig'indini hisoblang: yuz qo'shuv sakson. Bu aynan bir yuz sakson, ya'ni shart bajarilyapti.",
            'Посчитай сумму: сто плюс восемьдесят. Это ровно сто восемьдесят, значит условие выполнено.',
            'Add them up: one hundred plus eighty. That is exactly one hundred eighty, so the condition holds.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shart bajarilsa, aylana albatta topiladi. Bajarilmasa esa hech qanday urinish yordam bermaydi.",
        'Верно. Если условие выполнено, окружность обязательно найдётся. А если нет, никакие попытки не помогут.',
        'Correct. When the condition holds the circle certainly exists. When it fails, no amount of trying helps.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — markaz qayerda.
// ============================================================
const S4 = {
  eyebrow: L('MARKAZ QAYERDA', 'ГДЕ ЦЕНТР', 'WHERE THE CENTRE IS'),
  title: L(
    "Markaz hamma uchdan teng uzoqlikda",
    'Центр равноудалён от всех вершин',
    'The centre is equidistant from every vertex',
  ),
  audio: [
    A('mount',
      "Tashqi chizilgan aylananing markazi barcha uchlardan teng uzoqlikda yotadi, chunki ularning hammasi aylanada.",
      'Центр описанной окружности равноудалён от всех вершин, ведь все они лежат на окружности.',
      'The centre of the circumscribed circle is equidistant from all vertices, since they all lie on the circle.'),
    A('why',
      "Ikkita nuqtadan teng uzoqlikdagi nuqtalar qayerda yotadi?",
      'Где лежат точки, равноудалённые от двух точек?',
      'Where do the points equidistant from two points lie?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Kesmaning ikkita uchidan teng uzoqlikdagi nuqtalar qayerda yotadi?",
        'Где лежат точки, равноудалённые от двух концов отрезка?',
        'Where lie the points equidistant from the two ends of a segment?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Kesmaning o'rta perpendikulyarida",
            'На серединном перпендикуляре отрезка',
            'On the perpendicular bisector of the segment',
          ),
        },
        {
          id: 'wrong',
          label: L("Kesmaning o'zida", 'На самом отрезке', 'On the segment itself'),
          hint: L(
            "Kesmaning o'zida faqat BITTA shunday nuqta bor, ya'ni uning o'rtasi. Lekin bunday nuqtalar ko'p, va ular butun bir chiziqni hosil qiladi.",
            'На самом отрезке такая точка только ОДНА, это его середина. Но таких точек много, и они образуют целую прямую.',
            'On the segment there is only ONE such point, its midpoint. But there are many such points and they form a whole line.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun markaz barcha tomonlarning o'rta perpendikulyarlari kesishgan nuqtada yotadi. Uni yasash uchun ikkitasi yetarli.",
        'Верно. Поэтому центр лежит в точке пересечения серединных перпендикуляров всех сторон. Для построения хватит двух.',
        'Correct. So the centre sits where the perpendicular bisectors of all the sides meet. Two of them suffice to construct it.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — to'g'ri burchakli uchburchak.
// ============================================================
const S5 = {
  eyebrow: L('ENG QULAY HOL', 'САМЫЙ УДОБНЫЙ СЛУЧАЙ', 'THE HANDIEST CASE'),
  title: L(
    "Gipotenuza diametr bo'lib chiqadi",
    'Гипотенуза оказывается диаметром',
    'The hypotenuse turns out to be a diameter',
  ),
  audio: [
    A('mount',
      "O'tgan darsda diametrga tiralgan burchak to'g'ri ekanini ko'rgandik. Endi shuni teskari tomonga o'qiymiz.",
      'На прошлом уроке мы видели, что угол, опирающийся на диаметр, прямой. Теперь прочитаем это в обратную сторону.',
      'Last lesson we saw that an angle on a diameter is right. Now read that backwards.'),
    A('why',
      "Agar uchburchakning burchagi to'g'ri bo'lsa, unga qarshi tomon nima bo'ladi?",
      'Если угол треугольника прямой, чем окажется противолежащая сторона?',
      'If a triangle angle is right, what becomes of the opposite side?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={(
        <CircleFig
          pts={[{ deg: 180, label: 'A' }, { deg: 0, label: 'B' }, { deg: 65, label: 'C' }]}
          chords={[[0, 1], [2, 0], [2, 1]]}
          showCenter
          cap={L('∠C = 90°', '∠C = 90°', '∠C = 90°')}
        />
      )}
      steps={[
        { id: 'a', head: L('Katetlar', 'Катеты', 'The legs'), lines: [L('katetlar 16 va 12', 'катеты 16 и 12', 'legs 16 and 12'), L('gipotenuza 20', 'гипотенуза 20', 'hypotenuse 20')] },
      ]}
      ask={L(
        "Tashqi chizilgan aylananing radiusi nechaga teng?",
        'Чему равен радиус описанной окружности?',
        'What is the radius of the circumscribed circle?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'R = 10' },
        {
          id: 'wrong',
          label: 'R = 20',
          hint: L(
            "Yigirma bu gipotenuzaning o'zi, ya'ni DIAMETR. Radius esa diametrning yarmi.",
            'Двадцать это сама гипотенуза, то есть ДИАМЕТР. А радиус это половина диаметра.',
            'Twenty is the hypotenuse itself, the DIAMETER. The radius is half of it.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. To'g'ri burchakli uchburchakda gipotenuza har doim diametr, shuning uchun radius uning yarmi. Bu 36.4-mashqni bir qatorda yechadi.",
        'Верно. В прямоугольном треугольнике гипотенуза всегда диаметр, поэтому радиус её половина. Это решает задачу 36.4 в одну строку.',
        'Correct. In a right triangle the hypotenuse is always a diameter, so the radius is half of it. This solves exercise 36.4 in one line.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning 2-masalasi.
// ============================================================
const S6 = {
  eyebrow: L('MARKAZ BALANDLIKDA', 'ЦЕНТР НА ВЫСОТЕ', 'THE CENTRE ON THE ALTITUDE'),
  title: L(
    "Teng yonli uchburchakda",
    'В равнобедренном треугольнике',
    'In an isosceles triangle',
  ),
  audio: [
    A('mount',
      "Teng yonli uchburchakning asosga tushirilgan balandligi o'n olti, tashqi aylananing radiusi esa o'n.",
      'Высота равнобедренного треугольника к основанию шестнадцать, а радиус описанной окружности десять.',
      'The altitude of an isosceles triangle to its base is sixteen and the circumscribed radius is ten.'),
    A('why',
      "Balandlik asosning o'rta perpendikulyari ham bo'ladi, demak markaz aynan shu balandlikda yotadi.",
      'Высота здесь одновременно серединный перпендикуляр основания, значит центр лежит именно на ней.',
      'The altitude is also the perpendicular bisector of the base, so the centre lies exactly on it.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('BD = 16,   R = 10', 'BD = 16,   R = 10', 'BD = 16,   R = 10')}
      steps={[
        { id: 'a', head: L('Markazgacha', 'До центра', 'To the centre'), lines: ['OD = 16 − 10 = 6'] },
      ]}
      ask={L(
        "Asosning yarmi nechaga teng?",
        'Чему равна половина основания?',
        'What is half the base?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '8' },
        {
          id: 'wrong',
          label: '6',
          hint: L(
            "Olti bu markazdan asosgacha bo'lgan masofa, ya'ni katet. Ikkinchi katet esa Pifagor teoremasidan chiqadi: yuz minus o'ttiz olti.",
            'Шесть это расстояние от центра до основания, то есть катет. А второй катет выходит из теоремы Пифагора: сто минус тридцать шесть.',
            'Six is the distance from the centre to the base, one leg. The other leg comes from Pythagoras: one hundred minus thirty six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yuz minus o'ttiz oltidan ildiz sakkiz, demak asos o'n olti. Yon tomon esa sakkiz karra ildiz besh.",
        'Верно. Корень из ста минус тридцати шести это восемь, значит основание шестнадцать. А боковая сторона восемь корней из пяти.',
        'Correct. The root of one hundred minus thirty six is eight, so the base is sixteen. The leg is eight root five.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — muntazam ko'pburchak.
// ============================================================
const S7 = {
  eyebrow: L('MUNTAZAM KO\'PBURCHAK', 'ПРАВИЛЬНЫЙ МНОГОУГОЛЬНИК', 'A REGULAR POLYGON'),
  title: L(
    "Hamma tomoni va burchagi teng",
    'Все стороны и углы равны',
    'All sides and angles equal',
  ),
  audio: [
    A('mount',
      "Hamma tomoni va hamma burchagi teng bo'lgan qavariq ko'pburchak muntazam deyiladi.",
      'Выпуклый многоугольник, у которого все стороны и все углы равны, называют правильным.',
      'A convex polygon with all sides and all angles equal is called regular.'),
    A('why',
      "Burchaklar yig'indisi n minus ikki karra bir yuz sakson. Ular teng bo'lgani uchun bittasini topish oson.",
      'Сумма углов равна n минус два на сто восемьдесят. Так как они равны, найти один легко.',
      'The angles sum to n minus two times one hundred eighty. Since they are equal, finding one is easy.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('n = 6', 'n = 6', 'n = 6')}
      steps={[
        { id: 'a', head: L('Yigindi', 'Сумма', 'The sum'), lines: ['(6 − 2) · 180° = 720°'] },
      ]}
      ask={L(
        "Muntazam oltiburchakning har bir burchagi nechaga teng?",
        'Чему равен каждый угол правильного шестиугольника?',
        'What does each angle of a regular hexagon equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '120°' },
        {
          id: 'wrong',
          label: '720°',
          hint: L(
            "Yetti yuz yigirma bu BARCHA burchaklarning yig'indisi. Bitta burchak uchun uni oltiga bo'lish kerak.",
            'Семьсот двадцать это сумма ВСЕХ углов. Для одного угла нужно разделить на шесть.',
            'Seven hundred twenty is the sum of ALL the angles. For one angle divide it by six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Formula shunday: n minus ikki bo'lingan n, karra bir yuz sakson. Beshburchakda bir yuz sakkiz, sakkizburchakda bir yuz o'ttiz besh.",
        'Верно. Формула такая: n минус два делить на n, умножить на сто восемьдесят. У пятиугольника сто восемь, у восьмиугольника сто тридцать пять.',
        'Correct. The formula reads: n minus two over n, times one hundred eighty. A pentagon gives one hundred eight, an octagon one hundred thirty five.',
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
    'Geometriya 9, 36-dars (104-105-bet) va 38-dars (108-109-bet)',
    'Геометрия 9, урок 36 (стр. 104-105) и урок 38 (стр. 108-109)',
    'Geometry 9, lesson 36 (p. 104-105) and lesson 38 (p. 108-109)',
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
          "Har qanday to'rtburchakka tashqi aylana chizish mumkinmi?",
          'Можно ли около любого четырёхугольника описать окружность?',
          'Can a circle be circumscribed about any quadrilateral?',
        )}
        cols={2}
        items={[
          { id: 'right', right: true, label: L("Yo'q", 'Нет', 'No') },
          {
            id: 'wrong',
            label: L('Ha', 'Да', 'Yes'),
            hint: L(
              "1-ekranni eslang: parallelogramm juda tartibli figura, lekin unga tashqi aylana chizib bo'lmaydi.",
              'Вспомни 1 экран: параллелограмм очень правильная фигура, но описать около него окружность нельзя.',
              'Recall screen 1: a parallelogram is very orderly, yet no circle can be drawn about it.',
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
    "Shart, markaz va gipotenuza",
    'Условие, центр и гипотенуза',
    'The condition, the centre, the hypotenuse',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz shartni ikki tomonga o'qidingiz, markazning joyini topdingiz va muntazam ko'pburchak burchagini hisobladingiz.",
      'На семи экранах ты прочитал условие в обе стороны, нашёл место центра и вычислил угол правильного многоугольника.',
      'On seven screens you read the condition both ways, located the centre, and computed a regular polygon angle.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — radiusni topish.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tashqi aylananing radiusi",
    'Радиус описанной окружности',
    'The circumscribed radius',
  ),
  audio: [
    A('mount',
      "Uchta masala. Ikkitasida uchburchak to'g'ri burchakli, ya'ni gipotenuza diametr.",
      'Три задачи. В двух треугольник прямоугольный, значит гипотенуза диаметр.',
      'Three problems. In two the triangle is right, so the hypotenuse is a diameter.'),
    A('why',
      "To'g'ri burchakni ko'rgan joyda darrov gipotenuzani izlang.",
      'Увидев прямой угол, сразу ищи гипотенузу.',
      'Whenever a right angle shows up, look for the hypotenuse.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. To'g'ri burchakli uchburchakda radius bir qadamda chiqadi, boshqa hollarda esa qo'shimcha qurish kerak bo'ladi.",
      'Все три найдены. В прямоугольном треугольнике радиус выходит за один шаг, в остальных случаях нужны дополнительные построения.',
      'All three are found. In a right triangle the radius comes in one step, other cases need extra construction.',
    ),
    tasks: [
      {
        expr: '16,  12',
        question: L(
          "Katetlari 16 va 12. Tashqi aylananing radiusi nechaga teng?",
          'Катеты 16 и 12. Чему равен радиус описанной окружности?',
          'The legs are 16 and 12. What is the circumscribed radius?',
        ),
        ok: L("Ha. Gipotenuza yigirma, radius esa uning yarmi.", 'Да. Гипотенуза двадцать, а радиус её половина.', 'Yes. The hypotenuse is twenty and the radius is half of it.'),
        items: [
          { id: 'a', right: true, label: 'R = 10' },
          { id: 'b', label: 'R = 20', hint: L("Yigirma gipotenuzaning o'zi, ya'ni diametr. Radius undan ikki barobar kichik.", 'Двадцать это сама гипотенуза, то есть диаметр. Радиус вдвое меньше.', 'Twenty is the hypotenuse itself, the diameter. The radius is half that.') },
        ],
        solution: ['√(256 + 144) = 20', 'R = 20 : 2 = 10'],
      },
      {
        expr: '6,  8',
        question: L(
          "Katetlari 6 va 8. Tashqi aylananing radiusi nechaga teng?",
          'Катеты 6 и 8. Чему равен радиус описанной окружности?',
          'The legs are 6 and 8. What is the circumscribed radius?',
        ),
        ok: L("Ha. Gipotenuza o'n, radius besh.", 'Да. Гипотенуза десять, радиус пять.', 'Yes. The hypotenuse is ten and the radius five.'),
        items: [
          { id: 'a', right: true, label: 'R = 5' },
          { id: 'b', label: 'R = 7', hint: L("Yetti oltidan sakkizgacha bo'lgan sonlarning o'rtasi, lekin radius o'rtacha emas. Avval gipotenuzani hisoblang.", 'Семь это середина между шестью и восемью, но радиус не среднее. Сначала посчитай гипотенузу.', 'Seven is midway between six and eight, but the radius is no average. Compute the hypotenuse first.') },
        ],
        solution: ['√(36 + 64) = 10', 'R = 5'],
      },
      {
        expr: '16,  10,  10',
        question: L('Bu uchburchak to\'g\'ri burchaklimi?', 'Прямоугольный ли этот треугольник?', 'Is this triangle right angled?'),
        ok: L("Yo'q. Yuz qo'shuv yuz ikki yuz, o'n oltining kvadrati esa ikki yuz ellik olti. Ular teng emas.", 'Нет. Сто плюс сто двести, а квадрат шестнадцати двести пятьдесят шесть. Они не равны.', 'No. One hundred plus one hundred is two hundred, while sixteen squared is two hundred fifty six. They differ.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Pifagor teoremasini tekshiring: eng katta tomonning kvadrati qolgan ikkitasining kvadratlari yig'indisiga teng bo'lishi kerak.", 'Проверь теорему Пифагора: квадрат наибольшей стороны должен равняться сумме квадратов двух других.', 'Check Pythagoras: the square of the longest side must equal the sum of the other two squares.') },
        ],
        solution: ['10² + 10² = 200', '16² = 256', '200 ≠ 256'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — darslikning 36.5-mashqi.
// ============================================================
const S10 = {
  eyebrow: L('AYLANADAGI TO\'RTBURCHAK', 'ПРЯМОУГОЛЬНИК В ОКРУЖНОСТИ', 'A RECTANGLE IN A CIRCLE'),
  title: L(
    "Diagonal diametr bo'lib chiqadi",
    'Диагональ оказывается диаметром',
    'The diagonal turns out to be a diameter',
  ),
  audio: [
    A('mount',
      "Radiusi yigirma besh bo'lgan aylanaga to'g'ri to'rtburchak ichki chizilgan, uning bir tomoni o'n to'rt.",
      'В окружность радиусом двадцать пять вписан прямоугольник, одна его сторона четырнадцать.',
      'A rectangle is inscribed in a circle of radius twenty five, and one side is fourteen.'),
    A('why',
      "To'g'ri to'rtburchakning burchagi to'g'ri, demak diagonal diametr bo'ladi.",
      'Угол прямоугольника прямой, значит диагональ это диаметр.',
      'A rectangle angle is right, so the diagonal is a diameter.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Diagonalni diametr deb tanish masalani oddiy Pifagor teoremasiga aylantirdi.",
      'Оба шага сделаны. Узнав в диагонали диаметр, задачу свели к обычной теореме Пифагора.',
      'Both steps are done. Recognising the diagonal as a diameter reduced the problem to plain Pythagoras.',
    ),
    tasks: [
      {
        expr: 'R = 25',
        question: L("To'g'ri to'rtburchakning diagonali nechaga teng?", 'Чему равна диагональ прямоугольника?', 'What does the rectangle diagonal equal?'),
        ok: L("Ha, ellik. Diagonal diametr, diametr esa ikkita radius.", 'Да, пятьдесят. Диагональ это диаметр, а диаметр это два радиуса.', 'Yes, fifty. The diagonal is a diameter and a diameter is two radii.'),
        items: [
          { id: 'a', right: true, label: '50' },
          { id: 'b', label: '25', hint: L("Yigirma besh bu RADIUS. Diagonal esa aylananing bir chetidan ikkinchisiga o'tadi.", 'Двадцать пять это РАДИУС. А диагональ идёт от одного края окружности до другого.', 'Twenty five is the RADIUS. The diagonal runs from one edge of the circle to the other.') },
        ],
        solution: ['d = 2R = 50'],
      },
      {
        expr: 'd = 50,   a = 14',
        question: L('Ikkinchi tomon nechaga teng?', 'Чему равна вторая сторона?', 'What does the other side equal?'),
        ok: L("Ha, qirq sakkiz. Ikki ming besh yuz minus bir yuz to'qson olti, ildizi qirq sakkiz.", 'Да, сорок восемь. Две тысячи пятьсот минус сто девяносто шесть, корень сорок восемь.', 'Yes, forty eight. Two thousand five hundred minus one hundred ninety six, root forty eight.'),
        items: [
          { id: 'a', right: true, label: '48' },
          { id: 'b', label: '36', hint: L("O'ttiz olti ellikdan o'n to'rtni AYIRGANDA chiqadi. Lekin bu tomonlar to'g'ri burchakli uchburchakning katetlari, ular Pifagor teoremasi bilan bog'langan.", 'Тридцать шесть выходит при ВЫЧИТАНИИ четырнадцати из пятидесяти. Но эти стороны катеты прямоугольного треугольника, они связаны теоремой Пифагора.', 'Thirty six comes from SUBTRACTING fourteen from fifty. But these sides are legs of a right triangle, linked by Pythagoras.') },
        ],
        solution: ['√(2500 − 196) = 48'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — muntazam ko'pburchak burchaklari.
// ============================================================
const S11 = {
  eyebrow: L('MUNTAZAM KO\'PBURCHAK', 'ПРАВИЛЬНЫЙ МНОГОУГОЛЬНИК', 'A REGULAR POLYGON'),
  title: L(
    "Formulani uch marta qo'llash",
    'Применяем формулу трижды',
    'Applying the formula three times',
  ),
  audio: [
    A('mount',
      "Uchta ko'pburchak. Har birida bitta burchakni toping.",
      'Три многоугольника. В каждом найди один угол.',
      'Three polygons. Find one angle in each.'),
    A('why',
      "Avval yig'indini hisoblang, keyin uni burchaklar soniga bo'ling.",
      'Сначала посчитай сумму, потом раздели её на число углов.',
      'Compute the sum first, then divide it by the number of angles.'),
  ],
  props: {
    stepLabel: L("Ko'pburchak", 'Многоугольник', 'Polygon'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Burchaklar soni ortgan sari har bir burchak kattaradi va bir yuz saksonga yaqinlashadi, lekin unga hech qachon yetmaydi.",
      'Все три найдены. С ростом числа углов каждый угол увеличивается и приближается к ста восьмидесяти, но никогда их не достигает.',
      'All three are found. As the count grows each angle grows too, approaching one hundred eighty without ever reaching it.',
    ),
    tasks: [
      {
        expr: 'n = 3',
        question: L('Muntazam uchburchakning burchagi nechaga teng?', 'Чему равен угол правильного треугольника?', 'What is the angle of a regular triangle?'),
        ok: L("Ha, oltmish. Bir yuz saksonni uchga bo'lsak.", 'Да, шестьдесят. Сто восемьдесят делим на три.', 'Yes, sixty. One hundred eighty over three.'),
        items: [
          { id: 'a', right: true, label: '60°' },
          { id: 'b', label: '180°', hint: L("Bir yuz sakson uchta burchakning YIG'INDISI. Bitta burchak uchun uchga bo'lish kerak.", 'Сто восемьдесят это СУММА трёх углов. Для одного нужно разделить на три.', 'One hundred eighty is the SUM of the three angles. For one, divide by three.') },
        ],
        solution: ['(3 − 2) · 180° = 180°', '180° : 3 = 60°'],
      },
      {
        expr: 'n = 5',
        question: L('Muntazam beshburchakning burchagi nechaga teng?', 'Чему равен угол правильного пятиугольника?', 'What is the angle of a regular pentagon?'),
        ok: L("Ha, bir yuz sakkiz. Yig'indi besh yuz qirq, beshga bo'lamiz.", 'Да, сто восемь. Сумма пятьсот сорок, делим на пять.', 'Yes, one hundred eight. The sum is five hundred forty, divided by five.'),
        items: [
          { id: 'a', right: true, label: '108°' },
          { id: 'b', label: '72°', hint: L("Yetmish ikki bu MARKAZIY burchak, ya'ni uch yuz oltmishni beshga bo'lgan. Ichki burchak esa boshqa formuladan chiqadi.", 'Семьдесят два это ЦЕНТРАЛЬНЫЙ угол, триста шестьдесят делить на пять. А внутренний угол выходит по другой формуле.', 'Seventy two is the CENTRAL angle, three hundred sixty over five. The interior angle comes from another formula.') },
        ],
        solution: ['(5 − 2) · 180° = 540°', '540° : 5 = 108°'],
      },
      {
        expr: 'n = 8',
        question: L('Muntazam sakkizburchakning burchagi nechaga teng?', 'Чему равен угол правильного восьмиугольника?', 'What is the angle of a regular octagon?'),
        ok: L("Ha, bir yuz o'ttiz besh. Yig'indi bir ming sakson, sakkizga bo'lamiz.", 'Да, сто тридцать пять. Сумма тысяча восемьдесят, делим на восемь.', 'Yes, one hundred thirty five. The sum is one thousand eighty, divided by eight.'),
        items: [
          { id: 'a', right: true, label: '135°' },
          { id: 'b', label: '120°', hint: L("Bir yuz yigirma OLTIBURCHAKNING burchagi edi. Sakkizburchakda burchaklar kattaroq bo'ladi.", 'Сто двадцать было углом ШЕСТИУГОЛЬНИКА. У восьмиугольника углы больше.', 'One hundred twenty was the HEXAGON angle. An octagon has larger angles.') },
        ],
        solution: ['(8 − 2) · 180° = 1080°', '1080° : 8 = 135°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — romb.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Rombni aylanaga chizib bo'ladimi",
    'Впишется ли ромб в окружность',
    'Will a rhombus fit a circle',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Rombning hamma tomoni teng, demak u juda muntazam figura, uni albatta aylanaga ichki chizish mumkin degan.",
      'Решение Камрона. У ромба все стороны равны, значит фигура очень правильная, и вписать её в окружность точно можно, решил он.',
      "Kamron's solution. A rhombus has all sides equal, so it is very regular and can surely be inscribed, he decided."),
    A('why',
      "Romb ham parallelogramm. Xukdagi hisobni takrorlang.",
      'Ромб это тоже параллелограмм. Повтори расчёт из хука.',
      'A rhombus is a parallelogram too. Repeat the computation from the opening.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Tomonlarning tengligi hech narsani hal qilmaydi, shart faqat BURCHAKLAR haqida. Rombning qarama-qarshi burchaklari teng, demak ular faqat to'qson gradus bo'lgandagina yig'indi bir yuz sakson chiqadi — bu esa kvadrat.",
      'Равенство сторон ничего не решает, условие только про УГЛЫ. У ромба противоположные углы равны, значит сумма сто восемьдесят выходит лишь при девяноста градусах — а это квадрат.',
      'Equal sides settle nothing, the condition speaks only of ANGLES. A rhombus has equal opposite angles, so the sum reaches one hundred eighty only at ninety degrees — which is a square.',
    ),
    tasks: [
      {
        expr: '∠A = ∠C',
        question: L(
          "Qanday rombni aylanaga ichki chizish mumkin?",
          'Какой ромб можно вписать в окружность?',
          'Which rhombus can be inscribed in a circle?',
        ),
        ok: L(
          "To'g'ri, faqat kvadratni. Qolgan romblarga tashqi aylana chizib bo'lmaydi.",
          'Верно, только квадрат. Около остальных ромбов окружность описать нельзя.',
          'Correct, only a square. No other rhombus can be circumscribed.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('Faqat kvadratni', 'Только квадрат', 'Only a square'),
          },
          {
            id: 'b',
            label: L("Har qandayini, tomonlari teng", 'Любой, ведь стороны равны', 'Any, since the sides are equal'),
            hint: L(
              "Shart tomonlar haqida emas, burchaklar haqida. Yassilangan rombning o'tkir burchagi o'ttiz gradus bo'lsin. U holda yig'indi oltmish, bir yuz sakson emas.",
              'Условие не о сторонах, а об углах. Пусть у приплюснутого ромба острый угол тридцать градусов. Тогда сумма шестьдесят, а не сто восемьдесят.',
              'The condition is about angles, not sides. Take a flattened rhombus with an acute angle of thirty degrees. The sum is sixty, not one hundred eighty.',
            ),
          },
        ],
        solution: [
          '∠A + ∠C = 2∠A = 180°',
          '∠A = 90°',
          L('kvadrat', 'квадрат', 'a square'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 36.6-mashqi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Bitta aylana, ikkita figura",
    'Одна окружность, две фигуры',
    'One circle, two figures',
  ),
  audio: [
    A('mount',
      "Radiusi o'n bo'lgan aylanaga kvadrat ichki chizilgan. Uning diagonali diametrga teng.",
      'В окружность радиусом десять вписан квадрат. Его диагональ равна диаметру.',
      'A square is inscribed in a circle of radius ten. Its diagonal equals the diameter.'),
    A('why',
      "Kvadratning diagonali tomonidan ildiz ikki marta katta.",
      'Диагональ квадрата больше стороны в корень из двух раз.',
      'A square diagonal exceeds its side by a factor of root two.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala figura ham bitta aylanaga chizildi, lekin tomonlari har xil chiqdi. Sabab oddiy: diagonal va tomon o'rtasidagi bog'lanish har bir figurada boshqacha.",
      'Обе фигуры вписаны в одну окружность, но стороны вышли разными. Причина проста: связь диагонали и стороны у каждой фигуры своя.',
      'Both figures fit the same circle yet their sides differ. The reason is simple: each figure links its diagonal and side its own way.',
    ),
    tasks: [
      {
        expr: 'R = 10',
        question: L(
          "Ichki chizilgan kvadratning tomoni nechaga teng?",
          'Чему равна сторона вписанного квадрата?',
          'What does the side of the inscribed square equal?',
        ),
        ok: L(
          "Ha. Diagonal yigirma, tomon esa yigirma bo'lingan ildiz ikki, ya'ni o'n karra ildiz ikki.",
          'Да. Диагональ двадцать, а сторона двадцать делить на корень из двух, то есть десять корней из двух.',
          'Yes. The diagonal is twenty, and the side is twenty over root two, that is ten root two.',
        ),
        items: [
          { id: 'a', right: true, label: '10√2' },
          {
            id: 'b',
            label: '20',
            hint: L(
              "Yigirma bu DIAGONAL, ya'ni diametr. Kvadratning tomoni esa diagonaldan kichik.",
              'Двадцать это ДИАГОНАЛЬ, то есть диаметр. А сторона квадрата меньше диагонали.',
              'Twenty is the DIAGONAL, the diameter. A square side is shorter than its diagonal.',
            ),
          },
        ],
        solution: ['d = 2R = 20', 'a = 20 : √2 = 10√2'],
      },
      {
        expr: 'R = 10',
        question: L(
          "Ichki chizilgan muntazam oltiburchakning tomoni nechaga teng?",
          'Чему равна сторона вписанного правильного шестиугольника?',
          'What does the side of the inscribed regular hexagon equal?',
        ),
        ok: L(
          "Ha, o'nga teng. Markaziy burchak oltmish gradus, uchburchak esa teng tomonli bo'lib chiqadi.",
          'Да, десяти. Центральный угол шестьдесят градусов, и треугольник оказывается равносторонним.',
          'Yes, ten. The central angle is sixty degrees and the triangle turns out equilateral.',
        ),
        items: [
          { id: 'a', right: true, label: '10' },
          {
            id: 'b',
            label: '20',
            hint: L(
              "Yigirma diametr, u oltiburchakning ikkita tomoniga to'g'ri keladi. Bitta tomon esa markazdan chiqqan ikkita radius bilan teng tomonli uchburchak hosil qiladi.",
              'Двадцать это диаметр, он охватывает две стороны шестиугольника. А одна сторона вместе с двумя радиусами даёт равносторонний треугольник.',
              'Twenty is the diameter, spanning two sides of the hexagon. One side with two radii makes an equilateral triangle.',
            ),
          },
        ],
        solution: [
          '360° : 6 = 60°',
          L('teng tomonli uchburchak', 'равносторонний треугольник', 'an equilateral triangle'),
          'a = R = 10',
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
    "Blits: shart, markaz, gipotenuza",
    'Блиц: условие, центр, гипотенуза',
    'Blitz: condition, centre, hypotenuse',
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
        tag: 'har-doim-chiziladi',
        ask: L(
          "Har qanday parallelogrammga tashqi aylana chizish mumkinmi?",
          'Можно ли описать окружность около любого параллелограмма?',
          'Can a circle be circumscribed about any parallelogram?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, faqat to'g'ri to'rtburchakka", 'Нет, только около прямоугольника', 'No, only about a rectangle') },
          { id: 'yes', label: L('Ha, har qandayiga', 'Да, около любого', 'Yes, about any') },
        ],
        ok: L(
          "To'g'ri. Qarama-qarshi burchaklar teng, ularning yig'indisi bir yuz sakson bo'lishi uchun har biri to'qson bo'lishi kerak.",
          'Верно. Противоположные углы равны, и чтобы их сумма была сто восемьдесят, каждый должен быть девяносто.',
          'Correct. The opposite angles are equal, so their sum reaches one hundred eighty only when each is ninety.',
        ),
        hint: L(
          "1 va 12-ekranni eslang: parallelogramm ham, romb ham shu hisobda yiqildi.",
          'Вспомни 1 и 12 экраны: и параллелограмм, и ромб упали на этом расчёте.',
          'Recall screens 1 and 12: both the parallelogram and the rhombus fell on this computation.',
        ),
      },
      {
        id: 'q2',
        tag: 'gipotenuza-diametr-emas',
        ask: L(
          "To'g'ri burchakli uchburchakda tashqi aylananing radiusi nimaga teng?",
          'Чему равен радиус описанной окружности прямоугольного треугольника?',
          'What is the circumscribed radius of a right triangle?',
        ),
        options: [
          { id: 'r', right: true, label: L('Gipotenuzaning yarmiga', 'Половине гипотенузы', 'Half the hypotenuse') },
          { id: 'w', label: L('Gipotenuzaga', 'Гипотенузе', 'The hypotenuse') },
        ],
        ok: L(
          "To'g'ri. Gipotenuza diametr, radius esa uning yarmi.",
          'Верно. Гипотенуза это диаметр, а радиус его половина.',
          'Correct. The hypotenuse is the diameter and the radius is half of it.',
        ),
        hint: L(
          "5-ekranni eslang: burchak to'g'ri bo'lsa, unga qarshi tomon diametr bo'ladi.",
          'Вспомни 5 экран: если угол прямой, противолежащая сторона это диаметр.',
          'Recall screen 5: a right angle makes the opposite side a diameter.',
        ),
      },
      {
        id: 'q3',
        tag: 'markaz-joyini-bilmaslik',
        ask: L(
          "Tashqi chizilgan aylananing markazi qayerda yotadi?",
          'Где лежит центр описанной окружности?',
          'Where does the centre of a circumscribed circle lie?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Tomonlarning o'rta perpendikulyarlarida", 'На серединных перпендикулярах сторон', 'On the perpendicular bisectors of the sides'),
          },
          { id: 'w', label: L('Burchaklar bissektrisalarida', 'На биссектрисах углов', 'On the angle bisectors') },
        ],
        ok: L(
          "To'g'ri. Markaz barcha uchlardan teng uzoqlikda, shuning uchun har bir tomonning o'rta perpendikulyarida yotadi.",
          'Верно. Центр равноудалён от всех вершин, поэтому лежит на серединном перпендикуляре каждой стороны.',
          'Correct. The centre is equidistant from all vertices, so it lies on every side perpendicular bisector.',
        ),
        hint: L(
          "Bissektrisalar ICHKI chizilgan aylananing markazini beradi, u tomonlardan teng uzoqlikda bo'ladi.",
          'Биссектрисы дают центр ВПИСАННОЙ окружности, он равноудалён от сторон.',
          'The bisectors give the centre of the INSCRIBED circle, equidistant from the sides.',
        ),
      },
      {
        id: 'q4',
        tag: 'muntazam-burchak-formulasi',
        ask: L(
          "Muntazam beshburchakning bitta burchagi nechaga teng?",
          'Чему равен один угол правильного пятиугольника?',
          'What is one angle of a regular pentagon?',
        ),
        options: [
          { id: 'r', right: true, label: '108°' },
          { id: 'w', label: '540°' },
        ],
        ok: L(
          "To'g'ri. Besh yuz qirq barcha burchaklarning yig'indisi, bittasi esa uning beshdan biri.",
          'Верно. Пятьсот сорок это сумма всех углов, а один это её пятая часть.',
          'Correct. Five hundred forty is the sum of all the angles and one is a fifth of it.',
        ),
        hint: L(
          "11-ekranni eslang: avval yig'indi, keyin burchaklar soniga bo'lish.",
          'Вспомни 11 экран: сначала сумма, потом деление на число углов.',
          'Recall screen 11: the sum first, then divide by the count.',
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
    "Chizish mumkinmi degan savol",
    'Вопрос о том, можно ли описать',
    'The question of whether it can be done',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda parallelogramm juda tartibli figura bo'lsa ham, unga tashqi aylana chizib bo'lmasligi ko'rindi.",
      'На первом экране выяснилось, что параллелограмм при всей своей правильности окружностью не описывается.',
      'On the first screen a parallelogram, orderly as it is, turned out not to be circumscribable.'),
    A('s1',
      "Siz shartni ikki tomonga o'qidingiz, markazning joyini bildingiz va to'g'ri burchakli uchburchakda radiusni bir qadamda topdingiz.",
      'Ты прочитал условие в обе стороны, узнал место центра и нашёл радиус прямоугольного треугольника за один шаг.',
      'You read the condition both ways, located the centre, and found a right triangle radius in one step.'),
    A('s2',
      "Keyingi darsda vektorlar.",
      'В следующем уроке векторы.',
      'The next lesson covers vectors.'),
  ],
  props: {
    mark: '∠A + ∠C = 180°',
    markNote: L(
      "ichki chizilishning sharti",
      'условие вписанности',
      'the condition for being inscribable',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: vektorlar',
      'Следующий урок: векторы',
      'Next lesson: vectors',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'har-doim-chiziladi', ...S2 },
  { role: 'explain',  tag: 'har-doim-chiziladi', ...S3 },
  { role: 'explain',  tag: 'markaz-joyini-bilmaslik', ...S4 },
  { role: 'explain',  tag: 'gipotenuza-diametr-emas', ...S5 },
  { role: 'explain',  tag: 'markaz-joyini-bilmaslik', ...S6 },
  { role: 'explain',  tag: 'muntazam-burchak-formulasi', ...S7 },
  { role: 'rule',     tag: 'har-doim-chiziladi', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'gipotenuza-diametr-emas', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'gipotenuza-diametr-emas', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'muntazam-burchak-formulasi', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'har-doim-chiziladi', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'markaz-joyini-bilmaslik', ...S13 },
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
