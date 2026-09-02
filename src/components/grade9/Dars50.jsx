// ============================================================================
// 9-sinf, Dars 50. UCHBURCHAK YUZINI BURCHAK SINUSI ORQALI HISOBLASH.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 27-dars (82-83-bet).
//   1-teorema (82-bet): S = ½ · ab · sin C. Isbot: BD balandlik
//       tushiriladi, BCD dan BD = a · sin C, keyin S = ½ · b · BD.
//       Uchta ko'rinishi bor: ½bc·sinA, ½ac·sinB, ½ab·sinC.
//   1-masala: S = 24, AC = 8, ∠A = 30° → AB = 2·24 : (8 · 0,5) = 12.
//   2-masala: parallelogramm uchun S = ab · sin α.
//   2-teorema (83-bet): to'rtburchakning yuzi diagonallari va ular
//       orasidagi burchak sinusi ko'paytmasining yarmiga teng,
//       S = ½ · d₁ · d₂ · sin α. Isbot: to'rtta uchburchakning yuzi
//       qo'shiladi va sin(180° − α) = sin α ishlatiladi.
//   27.2: a) 6, 4, 30° → 6;  b) 14, 7√3, 60° → 73,5;
//       d) 3, 4√2, 45° → 6.
//   27.3: diagonali 12, diagonallar orasidagi burchak 30° → 36.
//   27.4: tomoni 7√2, o'tmas burchagi 135° bo'lgan romb → 49√2.
//   27.5: katta diagonali 18, burchagi 120° bo'lgan romb → 54√3.
//   27.8: AB = 8, AC = 12, ∠A = 60° → AD bissektrisa = 4,8√3.
//
// BU DARS 47-DARSNI KECHIKKAN HOLDA TO'LDIRADI. Darslikda yuz
// formulasi sinuslar teoremasidan OLDIN turadi va uni isbotlash
// uchun ishlatiladi. Bizning ketma-ketligimizda sinuslar teoremasi
// 47-darsda tashqi aylana orqali chiqarilgan (sabab o'sha darsning
// izohida), shuning uchun yuz formulasi mustaqil mavzu bo'lib
// qoldi va endi 46-darsning sinusiga to'g'ridan to'g'ri tayanadi.
//
// XUK: ikkita tomon va ular orasidagi burchak berilgan, balandlik
// esa yo'q. Boshlang'ich sinfdan tanish S = ½ · asos · balandlik
// formulasi ishga tushmaydi, chunki balandlik o'lchanmagan.
//
// TUZOQ (12-ekran): formulada yarmini unutish. Ekran uni javob bilan
// emas, BAHO bilan yiqitadi: sinus birdan katta bo'lmagani uchun yuz
// hech qachon ½ab dan oshmaydi. Tomonlari 6 va 4 bo'lgan uchburchakda
// yuz 12 dan katta bo'lolmaydi, Kamronning javobi esa aynan 12 —
// ya'ni sinus birga teng, burchak to'g'ri bo'lishi kerak edi.
//
// TRANSFER (13-ekran) — 27.8: bissektrisa uzunligini YUZ orqali
// topish. S(ABC) = S(ABD) + S(ADC), har uchala yuz ham sinus
// formulasi bilan yoziladi va AD tenglamadan chiqadi. Bu yerda yuz
// javob emas, VOSITA bo'ladi — uzunlikni topish uchun.
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
  id: 'grade9-50',
  n: 50,
  row: 50,
  block: 'Б7',
  topic: L(
    "Uchburchak yuzini burchak sinusi orqali hisoblash",
    'Площадь треугольника через синус угла',
    'The area of a triangle through the sine of an angle',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Uchburchakning yuzi ikki tomon va ular orasidagi burchak sinusi ko'paytmasining yarmiga teng",
    'Площадь треугольника равна половине произведения двух сторон на синус угла между ними',
    'The area of a triangle is half the product of two sides and the sine of the angle between them',
  ),
  L(
    "Sinus birdan katta bo'lmagani uchun yuz hech qachon yarim ko'paytmadan oshmaydi",
    'Синус не больше единицы, поэтому площадь никогда не превосходит половины произведения',
    'The sine is at most one, so the area never exceeds half the product',
  ),
  L(
    "To'rtburchakning yuzi diagonallari va ular orasidagi burchak orqali ham topiladi",
    'Площадь четырёхугольника находится и через диагонали с углом между ними',
    'A quadrilateral area also comes from its diagonals and the angle between them',
  ),
]

export const MISS = {
  'yarimni-unutish': {
    what: L(
      "formulada yarim ko'paytuvchi unutildi",
      'в формуле потерян множитель одна вторая',
      'the factor one half was dropped from the formula',
    ),
    wrong: null,
    at: 0,
  },
  'notogri-burchak-olish': {
    what: L(
      "tomonlar orasidagi burchak o'rniga boshqa burchak olindi",
      'взят не угол между сторонами, а другой',
      'an angle other than the one between the sides was used',
    ),
    wrong: null,
    at: 0,
  },
  'balandlik-tomon-almashish': {
    what: L(
      "tomonning o'zi balandlik deb olindi",
      'сторона принята за высоту',
      'a side was taken for the altitude',
    ),
    wrong: null,
    at: 0,
  },
  'otmas-burchakda-sinus': {
    what: L(
      "o'tmas burchakda sinus manfiy deb o'ylandi",
      'решено, что при тупом угле синус отрицателен',
      'the sine was thought negative at an obtuse angle',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — balandlik yo'q.
// ============================================================
const S1 = {
  eyebrow: L('BALANDLIK YO\'Q', 'ВЫСОТЫ НЕТ', 'NO ALTITUDE'),
  title: L(
    "Eski formula ishga tushmaydi",
    'Старая формула не запускается',
    'The old formula will not start',
  ),
  audio: [
    A('mount',
      "Uchburchakning tomonlari olti va to'rt, ular orasidagi burchak o'ttiz daraja. Yuzini topish kerak.",
      'Стороны треугольника шесть и четыре, угол между ними тридцать градусов. Нужно найти площадь.',
      'A triangle has sides six and four with an angle of thirty degrees between them. Find the area.'),
    A('why',
      "Yuz formulasini bilamiz: asosning yarmi karra balandlik. Lekin balandlik berilmagan.",
      'Формулу площади мы знаем: половина основания на высоту. Но высота не дана.',
      'We know the area formula: half the base times the height. But no height is given.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[4, 6, 3.2]}
          names={['A', 'B', 'C']}
          edges={{ c: '6', b: '4' }}
          angles={{ A: '30°' }}
        />
      }
      steps={[]}
      ask={L(
        "Balandliksiz yuzni topish mumkinmi?",
        'Можно ли найти площадь без высоты?',
        'Can the area be found without the height?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Mumkin: balandlikni burchak orqali hisoblash mumkin",
            'Можно: высоту можно вычислить через угол',
            'It can: the height can be computed from the angle',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Mumkin emas: balandlik o'lchanishi kerak",
            'Нельзя: высоту нужно измерить',
            'It cannot: the height must be measured',
          ),
          hint: L(
            "46-darsni eslang: qarshi katet gipotenuzaga sinusni ko'paytirganga teng edi. Balandlik ham aynan shunday katet.",
            'Вспомни 46 урок: противолежащий катет равнялся гипотенузе на синус. Высота это как раз такой катет.',
            'Recall lesson 46: the opposite leg was the hypotenuse times the sine. The altitude is exactly such a leg.',
          ),
        },
      ]}
      after={L(
        "Ha. Bugun balandlikni butunlay chetlab o'tadigan formulani chiqaramiz.",
        'Да. Сегодня выведем формулу, которая обходится вовсе без высоты.',
        'Yes. Today we derive a formula that skips the height entirely.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — ikkita eski fakt.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Balandlik ham katet",
    'Высота это тоже катет',
    'An altitude is a leg too',
  ),
  audio: [
    A('mount',
      "Uchburchakka balandlik tushirsak, to'g'ri burchakli uchburchak hosil bo'ladi va balandlik uning kateti bo'lib qoladi.",
      'Если опустить в треугольнике высоту, получится прямоугольный треугольник, и высота станет его катетом.',
      'Dropping an altitude makes a right triangle in which the altitude is a leg.'),
    A('why',
      "Bu katet burchakka qarshi turibdi, demak 46-darsning qoidasi ishlaydi.",
      'Этот катет лежит против угла, значит работает правило 46 урока.',
      'That leg faces the angle, so the rule of lesson 46 applies.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('BC = 4,   ∠C = 30°', 'BC = 4,   ∠C = 30°', 'BC = 4,   ∠C = 30°')}
      steps={[]}
      ask={L(
        "B uchidan tushirilgan balandlik nechaga teng?",
        'Чему равна высота из вершины B?',
        'What is the altitude from B?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '2' },
        {
          id: 'wrong',
          label: '4',
          hint: L(
            "To'rt bu BC tomonning o'zi, ya'ni gipotenuza. Balandlik esa undan qisqaroq: to'rt karra sinus o'ttiz.",
            'Четыре это сама сторона BC, то есть гипотенуза. А высота короче: четыре на синус тридцати.',
            'Four is the side BC itself, the hypotenuse. The altitude is shorter: four times the sine of thirty.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Balandlik teng tomon karra shu tomon bilan asos orasidagi burchakning sinusi. Butun bugungi formula shu bitta jumladan chiqadi.",
        'Верно. Высота равна стороне на синус угла между этой стороной и основанием. Вся сегодняшняя формула выходит из этой одной фразы.',
        'Correct. The altitude equals a side times the sine of the angle between that side and the base. The whole formula follows from that one sentence.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — formulani chiqarish.
// ============================================================
const S3 = {
  eyebrow: L('CHIQARISH', 'ВЫВОД', 'THE DERIVATION'),
  title: L(
    "Balandlikni formulaga qo'yamiz",
    'Подставим высоту в формулу',
    'Substitute the altitude into the formula',
  ),
  audio: [
    A('mount',
      "Eski formula: yuz teng asosning yarmi karra balandlik. Asos b, balandlik esa a karra sinus C.",
      'Старая формула: площадь равна половине основания на высоту. Основание b, а высота a на синус C.',
      'The old formula: the area is half the base times the height. The base is b and the height is a times the sine of C.'),
    A('why',
      "Ikkalasini birlashtiramiz.",
      'Соединим одно с другим.',
      'Put the two together.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('S = ½ · b · h,   h = a · sin C', 'S = ½ · b · h,   h = a · sin C', 'S = ½ · b · h,   h = a · sin C')}
      steps={[]}
      ask={L(
        "Qanday formula chiqadi?",
        'Какая формула получится?',
        'What formula comes out?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'S = ½ · ab · sin C' },
        {
          id: 'wrong',
          label: 'S = ab · sin C',
          hint: L(
            "Eski formulada yarim ko'paytuvchi bor edi va u hech qayerga ketmadi. U yangisida ham qoladi.",
            'В старой формуле был множитель одна вторая, и он никуда не делся. Он остаётся и в новой.',
            'The old formula had a factor of one half and it did not go anywhere. It stays in the new one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi balandlik umuman kerak emas: ikkita tomon va ular orasidagi burchak yetadi.",
        'Верно. Теперь высота вовсе не нужна: хватает двух сторон и угла между ними.',
        'Correct. The height is no longer needed: two sides and the angle between them suffice.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — uchta ko'rinish.
// ============================================================
const S4 = {
  eyebrow: L('UCHTA KO\'RINISH', 'ТРИ ВИДА', 'THREE FORMS'),
  title: L(
    "Qaysi juftlik ma'lum bo'lsa, o'sha ishlaydi",
    'Работает та пара, которая известна',
    'Whichever pair you know is the one that works',
  ),
  audio: [
    A('mount',
      "Balandlikni istalgan uchdan tushirish mumkin, shuning uchun formula uchta ko'rinishga ega.",
      'Высоту можно опустить из любой вершины, поэтому у формулы три вида.',
      'The altitude may drop from any vertex, so the formula has three forms.'),
    A('why',
      "Har birida burchak aynan ko'rsatilgan ikkita tomon orasida turadi.",
      'В каждом угол стоит именно между двумя указанными сторонами.',
      'In each the angle sits exactly between the two named sides.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[4, 6, 3.2]}
          names={['A', 'B', 'C']}
          edges={{ c: 'c', b: 'b', a: 'a' }}
          angles={{ A: 'α' }}
        />
      }
      steps={[
        { id: 'a', head: L('Ikkita ko\'rinish', 'Два вида', 'Two forms'), lines: ['S = ½ · ab · sin C', 'S = ½ · ac · sin B'] },
      ]}
      ask={L(
        "Uchinchi ko'rinish qanday yoziladi?",
        'Как записывается третий вид?',
        'How is the third form written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'S = ½ · bc · sin A' },
        {
          id: 'wrong',
          label: 'S = ½ · bc · sin C',
          hint: L(
            "b va c tomonlar A uchida uchrashadi. Formulada esa aynan tomonlar ORASIDAGI burchak turadi.",
            'Стороны b и c сходятся в вершине A. А в формуле стоит именно угол МЕЖДУ сторонами.',
            'The sides b and c meet at the vertex A. And the formula holds the angle BETWEEN the sides.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchtasi ham bir xil yuzni beradi, tanlash esa qaysi ma'lumot borligiga bog'liq.",
        'Верно. Все три дают одну и ту же площадь, а выбор зависит от того, какие данные есть.',
        'Correct. All three give the same area, and the choice depends on what data you have.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — teskari masala.
// ============================================================
const S5 = {
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE REVERSE PROBLEM'),
  title: L(
    "Yuz ma'lum, tomon qidiriladi",
    'Площадь известна, ищут сторону',
    'The area is known, a side is wanted',
  ),
  audio: [
    A('mount',
      "Darslikning birinchi masalasi. Uchburchakning yuzi yigirma to'rt, AC sakkiz, A burchagi o'ttiz daraja.",
      'Первая задача учебника. Площадь треугольника двадцать четыре, AC восемь, угол A тридцать градусов.',
      'The first textbook problem. The area is twenty four, AC is eight and the angle A is thirty degrees.'),
    A('why',
      "Formulada uchta ko'paytuvchi bor, ulardan ikkitasi ma'lum.",
      'В формуле три множителя, два из них известны.',
      'The formula has three factors and two of them are known.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('24 = ½ · AB · 8 · 0,5', '24 = ½ · AB · 8 · 0,5', '24 = ½ · AB · 8 · 0.5')}
      steps={[]}
      ask={L(
        "AB nechaga teng?",
        'Чему равно AB?',
        'What does AB equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '12' },
        {
          id: 'wrong',
          label: '6',
          hint: L(
            "O'ng tomonni soddalashtiring: yarim karra sakkiz karra nol butun besh o'ndan ikkiga teng. Demak yigirma to'rt teng ikki AB.",
            'Упрости правую часть: половина на восемь на ноль целых пять десятых это два. Значит двадцать четыре равно двум AB.',
            'Simplify the right side: a half times eight times zero point five is two. So twenty four equals two AB.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, o'n ikki. Formula ikki tomonga ishlaydi: yuzni ham beradi, uzunlikni ham.",
        'Верно, двенадцать. Формула работает в обе стороны: даёт и площадь, и длину.',
        'Correct, twelve. The formula works both ways: it gives an area and a length.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — parallelogramm.
// ============================================================
const S6 = {
  eyebrow: L('PARALLELOGRAMM', 'ПАРАЛЛЕЛОГРАММ', 'A PARALLELOGRAM'),
  title: L(
    "Ikkita uchburchak bitta parallelogramm",
    'Два треугольника это параллелограмм',
    'Two triangles make a parallelogram',
  ),
  audio: [
    A('mount',
      "Parallelogrammning diagonali uni ikkita teng uchburchakka ajratadi.",
      'Диагональ параллелограмма делит его на два равных треугольника.',
      'A diagonal splits a parallelogram into two equal triangles.'),
    A('why',
      "Har birining yuzi yarim ab sinus alfa, ikkitasi esa ikki barobar.",
      'Площадь каждого половина ab синус альфа, а двух вдвое больше.',
      'Each has area half ab sine alpha, and two of them twice that.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('AB = a,   AD = b,   ∠A = α', 'AB = a,   AD = b,   ∠A = α', 'AB = a,   AD = b,   ∠A = α')}
      steps={[]}
      ask={L(
        "Parallelogrammning yuzi nimaga teng?",
        'Чему равна площадь параллелограмма?',
        'What is the area of the parallelogram?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'ab · sin α' },
        {
          id: 'wrong',
          label: '½ · ab · sin α',
          hint: L(
            "Yarim ko'paytma bitta uchburchakning yuzi edi. Parallelogrammda esa shunday uchburchak ikkita.",
            'Половина произведения была площадью одного треугольника. А в параллелограмме таких треугольников два.',
            'Half the product was the area of one triangle. A parallelogram holds two such triangles.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning ikkinchi masalasi. Yarim yo'qoladi, chunki uchburchak ikkita.",
        'Верно. Это вторая задача учебника. Половина исчезает, потому что треугольников два.',
        'Correct. This is the second textbook problem. The half disappears because there are two triangles.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — diagonallar orqali.
// ============================================================
const S7 = {
  eyebrow: L('DIAGONALLAR', 'ДИАГОНАЛИ', 'THE DIAGONALS'),
  title: L(
    "Tomonlarni bilmasdan ham bo'ladi",
    'Можно и не зная сторон',
    'Even without knowing the sides',
  ),
  audio: [
    A('mount',
      "Ixtiyoriy to'rtburchakning diagonallari uni to'rtta uchburchakka ajratadi. Har birining yuzini sinus formulasi bilan yozamiz.",
      'Диагонали любого четырёхугольника делят его на четыре треугольника. Площадь каждого запишем формулой с синусом.',
      'The diagonals of any quadrilateral cut it into four triangles. Write each area with the sine formula.'),
    A('why',
      "Ikkitasida burchak alfa, ikkitasida esa bir yuz sakson ayirib alfa. Lekin ularning sinuslari teng.",
      'В двух угол альфа, а в двух сто восемьдесят минус альфа. Но синусы у них равны.',
      'Two have the angle alpha and two have one hundred eighty minus alpha. But their sines agree.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('sin (180° − α) = sin α', 'sin (180° − α) = sin α', 'sin (180° − α) = sin α')}
      steps={[
        { id: 'a', head: L('Yig\'indi', 'Сумма', 'The sum'), lines: ['S = ½ · (AC · BD) · sin α'] },
      ]}
      ask={L(
        "Bu formula qanday to'rtburchaklar uchun ishlaydi?",
        'Для каких четырёхугольников работает эта формула?',
        'For which quadrilaterals does this formula work?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Barchasi uchun', 'Для всех', 'For all of them') },
        {
          id: 'wrong',
          label: L('Faqat romb uchun', 'Только для ромба', 'Only for a rhombus'),
          hint: L(
            "Isbotda to'rtburchakning turi haqida hech narsa aytilmadi. Faqat diagonallar kesishishi va yuzlarning qo'shilishi ishlatildi.",
            'В доказательстве про вид четырёхугольника ничего не говорилось. Использовались только пересечение диагоналей и сложение площадей.',
            'The proof said nothing about the kind of quadrilateral. It used only the crossing diagonals and the adding of areas.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning ikkinchi teoremasi va u romb, kvadrat hamda deltoid uchun yuz formulalarini bitta qatorga jamlaydi.",
        'Верно. Это вторая теорема учебника, и она собирает формулы площади ромба, квадрата и дельтоида в одну строку.',
        'Correct. This is the second textbook theorem, and it folds the area formulas of the rhombus, square and kite into one line.',
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
    'Geometriya 9, 27-dars (82-83-bet)',
    'Геометрия 9, урок 27 (стр. 82-83)',
    'Geometry 9, lesson 27 (p. 82-83)',
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
          "Yuz eng katta qachon bo'ladi?",
          'Когда площадь будет наибольшей?',
          'When is the area greatest?',
        )}
        cols={2}
        items={[
          { id: 'right', right: true, label: L("Burchak to'g'ri bo'lganda", 'При прямом угле', 'At a right angle') },
          {
            id: 'wrong',
            label: L("Burchak o'tmas bo'lganda", 'При тупом угле', 'At an obtuse angle'),
            hint: L(
              "Tomonlar o'zgarmasa, yuz faqat sinusga bog'liq. Sinus esa to'qson darajada eng katta qiymatiga, birga yetadi.",
              'При неизменных сторонах площадь зависит только от синуса. А синус достигает наибольшего значения, единицы, при девяноста градусах.',
              'With fixed sides the area depends only on the sine, and the sine peaks at one at ninety degrees.',
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
    "Balandliksiz yuz",
    'Площадь без высоты',
    'Area without a height',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz formulani chiqardingiz va uni uchburchakdan to'rtburchakka ko'chirdingiz.",
      'На семи экранах ты вывел формулу и перенёс её с треугольника на четырёхугольник.',
      'On seven screens you derived the formula and carried it from a triangle to a quadrilateral.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — to'g'ridan to'g'ri hisob.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Ikki tomon va burchakdan yuzga",
    'От двух сторон и угла к площади',
    'From two sides and an angle to the area',
  ),
  audio: [
    A('mount',
      "Darslikning yigirma yetti nuqta ikkinchi mashqi. Uchta uchburchak.",
      'Задача двадцать семь точка два учебника. Три треугольника.',
      'Exercise twenty seven point two. Three triangles.'),
    A('why',
      "Har safar burchak aynan berilgan ikkita tomon orasida turibdi.",
      'Каждый раз угол стоит именно между двумя данными сторонами.',
      'Each time the angle sits between the two given sides.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hisoblandi. Ikkinchi va uchinchisida ildizlar qisqarib ketdi, chunki qirq besh va oltmish darajaning sinuslari ildiz bilan yoziladi.",
      'Все три посчитаны. Во второй и третьей корни сократились, потому что синусы сорока пяти и шестидесяти записываются через корень.',
      'All three are computed. In the second and third the roots cancelled, since the sines of forty five and sixty carry roots.',
    ),
    tasks: [
      {
        expr: 'AB = 6,   AC = 4,   ∠A = 30°',
        question: L('Yuz nechaga teng?', 'Чему равна площадь?', 'What is the area?'),
        ok: L("Ha, olti. Yarim karra yigirma to'rt karra nol butun besh o'ndan.", 'Да, шесть. Половина на двадцать четыре на ноль целых пять десятых.', 'Yes, six. Half of twenty four times zero point five.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '12', hint: L("O'n ikki bu yarim karra olti karra to'rt, ya'ni sinussiz javob. Sinus o'ttiz esa nol butun besh o'ndanga teng.", 'Двенадцать это половина на шесть на четыре, то есть ответ без синуса. А синус тридцати равен ноль целых пяти десятым.', 'Twelve is half of six times four, the answer without the sine. And the sine of thirty is zero point five.') },
        ],
        solution: ['S = ½ · 6 · 4 · 0,5', 'S = 6'],
      },
      {
        expr: 'BC = 3,   AB = 4√2,   ∠B = 45°',
        question: L('Yuz nechaga teng?', 'Чему равна площадь?', 'What is the area?'),
        ok: L("Ha, olti. Ildiz ikkilar qisqarib ketdi.", 'Да, шесть. Корни из двух сократились.', 'Yes, six. The roots of two cancelled.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '6√2', hint: L("Sinus qirq besh ildiz ikki bo'lingan ikkiga teng. Uni to'rt ildiz ikkiga ko'paytirsangiz, ildizlar qisqaradi va to'rt qoladi.", 'Синус сорока пяти это корень из двух пополам. Умножив его на четыре корня из двух, корни сократишь и останется четыре.', 'The sine of forty five is root two over two. Times four root two the roots cancel and four remains.') },
        ],
        solution: ['S = ½ · 3 · 4√2 · (√2/2)', 'S = 6'],
      },
      {
        expr: 'AC = 14,   BC = 7√3,   ∠C = 60°',
        question: L('Yuz nechaga teng?', 'Чему равна площадь?', 'What is the area?'),
        ok: L("Ha, yetmish uch butun besh o'ndan.", 'Да, семьдесят три целых пять десятых.', 'Yes, seventy three point five.'),
        items: [
          { id: 'a', right: true, label: '73,5' },
          { id: 'b', label: '49', hint: L("Sinus oltmish ildiz uch bo'lingan ikki. Yetti ildiz uchga ko'paytirsangiz, ildizlar qisqaradi va yigirma bir qoladi, keyin yarim karra o'n to'rt karra yigirma bir.", 'Синус шестидесяти это корень из трёх пополам. Умножив на семь корней из трёх, получишь двадцать один, затем половина на четырнадцать на двадцать один.', 'The sine of sixty is root three over two. Times seven root three gives twenty one, then half of fourteen times twenty one.') },
        ],
        solution: ['S = ½ · 14 · 7√3 · (√3/2)', 'S = 73,5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — to'rtburchaklar.
// ============================================================
const S10 = {
  eyebrow: L('TO\'RTBURCHAKLAR', 'ЧЕТЫРЁХУГОЛЬНИКИ', 'QUADRILATERALS'),
  title: L(
    "Diagonallar va tomonlar",
    'Диагонали и стороны',
    'Diagonals and sides',
  ),
  audio: [
    A('mount',
      "Ikkita masala. Biri diagonallar orqali, ikkinchisi tomonlar orqali yechiladi.",
      'Две задачи. Одна решается через диагонали, другая через стороны.',
      'Two problems. One goes through the diagonals, the other through the sides.'),
    A('why',
      "Rombda tomonlar teng, shuning uchun formula soddalashadi.",
      'В ромбе стороны равны, поэтому формула упрощается.',
      'A rhombus has equal sides, so the formula gets simpler.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. To'g'ri to'rtburchakda diagonallar teng bo'lgani uchun formulaga bitta son ikki marta kiradi, rombda esa tomonlar teng.",
      'Обе найдены. У прямоугольника диагонали равны, поэтому одно число входит в формулу дважды, а у ромба равны стороны.',
      'Both are found. A rectangle has equal diagonals so one number enters twice, while a rhombus has equal sides.',
    ),
    tasks: [
      {
        expr: 'd₁ = d₂ = 12,   ∠ = 30°',
        question: L(
          "To'g'ri to'rtburchakning yuzi nechaga teng?",
          'Чему равна площадь прямоугольника?',
          'What is the area of the rectangle?',
        ),
        ok: L("Ha, o'ttiz olti. Diagonallar teng, ikkalasi ham o'n ikki.", 'Да, тридцать шесть. Диагонали равны, обе по двенадцать.', 'Yes, thirty six. The diagonals are equal, both twelve.'),
        items: [
          { id: 'a', right: true, label: '36' },
          { id: 'b', label: '72', hint: L("Yarim ko'paytuvchini unutmang: yarim karra o'n ikki karra o'n ikki karra nol butun besh o'ndan.", 'Не забудь множитель одна вторая: половина на двенадцать на двенадцать на ноль целых пять десятых.', 'Do not lose the half: a half times twelve times twelve times zero point five.') },
        ],
        solution: ['S = ½ · 12 · 12 · sin 30°', 'S = 36'],
      },
      {
        expr: 'a = 7√2,   ∠ = 135°',
        question: L(
          "Rombning yuzi nechaga teng?",
          'Чему равна площадь ромба?',
          'What is the area of the rhombus?',
        ),
        ok: L("Ha, qirq to'qqiz ildiz ikki. Sinus bir yuz o'ttiz besh sinus qirq beshga teng.", 'Да, сорок девять корней из двух. Синус ста тридцати пяти равен синусу сорока пяти.', 'Yes, forty nine root two. The sine of one hundred thirty five equals the sine of forty five.'),
        items: [
          { id: 'a', right: true, label: '49√2' },
          {
            id: 'b',
            label: L("Manfiy son", 'Отрицательное число', 'A negative number'),
            hint: L(
              "O'tmas burchakda MANFIY bo'lgani kosinus edi. Sinus esa bir yuz saksongacha musbat bo'lib qoladi.",
              'При тупом угле ОТРИЦАТЕЛЕН был косинус. А синус остаётся положительным вплоть до ста восьмидесяти.',
              'It was the COSINE that went negative at an obtuse angle. The sine stays positive all the way to one hundred eighty.',
            ),
          },
        ],
        solution: ['S = (7√2)² · sin 135°', 'S = 98 · (√2/2) = 49√2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — romb diagonal orqali.
// ============================================================
const S11 = {
  eyebrow: L('IKKI QADAM', 'ДВА ШАГА', 'TWO STEPS'),
  title: L(
    "Avval tomon, keyin yuz",
    'Сначала сторона, потом площадь',
    'The side first, then the area',
  ),
  audio: [
    A('mount',
      "Rombning katta diagonali o'n sakkiz, bir burchagi esa bir yuz yigirma daraja. Yuzini topish kerak.",
      'Большая диагональ ромба восемнадцать, а один из углов сто двадцать градусов. Нужно найти площадь.',
      'The longer diagonal of a rhombus is eighteen and one angle is one hundred twenty degrees. Find the area.'),
    A('why',
      "Diagonal rombni ikkita teng yonli uchburchakka ajratadi.",
      'Диагональ делит ромб на два равнобедренных треугольника.',
      'The diagonal splits the rhombus into two isosceles triangles.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Yuz ellik to'rt ildiz uch, taxminan to'qson uch butun besh o'ndan. Bu darslikning yigirma yetti nuqta beshinchi mashqi va u ikkita qadamni talab qildi: avval tomon, keyin yuz.",
      'Площадь пятьдесят четыре корня из трёх, примерно девяносто три целых пять десятых. Это задача двадцать семь точка пять учебника, и она потребовала двух шагов: сначала сторона, потом площадь.',
      'The area is fifty four root three, about ninety three point five. This is exercise twenty seven point five and it needed two steps: the side first, then the area.',
    ),
    tasks: [
      {
        expr: 'd = 18,   ∠ = 120°',
        question: L(
          "Rombning tomoni nechaga teng?",
          'Чему равна сторона ромба?',
          'What is the side of the rhombus?',
        ),
        ok: L(
          "Ha, olti ildiz uch. Kosinuslar teoremasi bilan yoki teng tomonli uchburchak orqali topiladi.",
          'Да, шесть корней из трёх. Находится теоремой косинусов или через равносторонний треугольник.',
          'Yes, six root three. It comes from the law of cosines or through an equilateral triangle.',
        ),
        items: [
          { id: 'a', right: true, label: '6√3' },
          { id: 'b', label: '9', hint: L("To'qqiz bu diagonalning yarmi. Tomon esa undan uzunroq, chunki u to'qson darajadan katta burchakka qarshi turibdi.", 'Девять это половина диагонали. А сторона длиннее, ведь она лежит против угла больше девяноста.', 'Nine is half the diagonal. The side is longer, since it faces an angle above ninety degrees.') },
        ],
        solution: ['18² = 2a² − 2a² · cos 120°', 'a = 6√3'],
      },
      {
        expr: 'a = 6√3,   ∠ = 120°',
        question: L('Rombning yuzi nechaga teng?', 'Чему равна площадь ромба?', 'What is the area of the rhombus?'),
        ok: L("Ha, ellik to'rt ildiz uch.", 'Да, пятьдесят четыре корня из трёх.', 'Yes, fifty four root three.'),
        items: [
          { id: 'a', right: true, label: '54√3' },
          { id: 'b', label: '108', hint: L("Bir yuz sakkiz bu tomonning kvadrati, ya'ni sinussiz javob. Sinus bir yuz yigirma esa ildiz uch bo'lingan ikkiga teng.", 'Сто восемь это квадрат стороны, то есть ответ без синуса. А синус ста двадцати равен корню из трёх пополам.', 'One hundred eight is the side squared, the answer without the sine. The sine of one hundred twenty is root three over two.') },
        ],
        solution: ['S = 108 · sin 120°', 'S = 54√3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — yarimni unutish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Javobni baho bilan tekshirish",
    'Проверка ответа оценкой',
    'Checking an answer by an estimate',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Tomonlar olti va to'rt, burchak o'ttiz daraja. U yuzni o'n ikki deb topgan.",
      'Решение Камрона. Стороны шесть и четыре, угол тридцать градусов. Он получил площадь двенадцать.',
      "Kamron's solution. The sides are six and four with an angle of thirty degrees. He got an area of twelve."),
    A('why',
      "Bu javobni hisobni takrorlamasdan ham tekshirish mumkin.",
      'Этот ответ можно проверить, не повторяя вычислений.',
      'That answer can be checked without redoing the computation.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Sinus birdan katta bo'lolmaydi, shuning uchun yuz hech qachon yarim ab dan oshmaydi va unga faqat to'g'ri burchakda yetadi. Olti va to'rt uchun bu chegara o'n ikki, Kamronning javobi esa aynan o'n ikki — ya'ni u burchakni to'qson daraja deb hisoblagan bilan barobar. O'ttiz darajada javob ikki barobar kichik: olti.",
      'Синус не бывает больше единицы, поэтому площадь никогда не превосходит половины ab и достигает её только при прямом угле. Для шести и четырёх этот предел двенадцать, а ответ Камрона ровно двенадцать — то есть он посчитал так, будто угол прямой. При тридцати градусах ответ вдвое меньше: шесть.',
      'The sine never exceeds one, so the area never passes half of ab and reaches it only at a right angle. For six and four that ceiling is twelve, and Kamron answer is exactly twelve, as though the angle were right. At thirty degrees the answer is half that: six.',
    ),
    tasks: [
      {
        expr: 'a = 6,   b = 4,   ∠ = 30°   →   S = 12 ?',
        question: L(
          "Tomonlari olti va to'rt bo'lgan uchburchakning yuzi eng ko'pi bilan nechaga teng bo'la oladi?",
          'Какой наибольшей может быть площадь треугольника со сторонами шесть и четыре?',
          'What is the largest possible area of a triangle with sides six and four?',
        ),
        ok: L(
          "To'g'ri, o'n ikki, va bunga faqat to'g'ri burchakda yetiladi. Demak o'ttiz darajadagi javob undan kichik bo'lishi shart.",
          'Верно, двенадцать, и это достигается только при прямом угле. Значит ответ при тридцати градусах обязан быть меньше.',
          'Correct, twelve, and only at a right angle. So the answer at thirty degrees must be smaller.',
        ),
        items: [
          { id: 'a', right: true, label: '12' },
          {
            id: 'b',
            label: '24',
            hint: L(
              "Yigirma to'rt bu tomonlarning ko'paytmasi. Formulada esa uning yarmi turibdi, sinus ham birdan katta emas.",
              'Двадцать четыре это произведение сторон. А в формуле стоит его половина, и синус не больше единицы.',
              'Twenty four is the product of the sides. The formula takes half of it, and the sine is at most one.',
            ),
          },
        ],
        solution: [
          'S = ½ · 6 · 4 · sin 30°',
          'S = 12 · 0,5 = 6',
          L('Kamron: 6 · 4 · 0,5 = 12', 'Камрон: 6 · 4 · 0,5 = 12', 'Kamron: 6 · 4 · 0.5 = 12'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — bissektrisa yuz orqali.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Yuz javob emas, vosita",
    'Площадь не ответ, а средство',
    'The area as a means, not an answer',
  ),
  audio: [
    A('mount',
      "ABC uchburchakda AB sakkiz, AC o'n ikki, A burchagi oltmish daraja. AD bissektrisaning uzunligini topish kerak.",
      'В треугольнике ABC сторона AB восемь, AC двенадцать, угол A шестьдесят градусов. Нужно найти длину биссектрисы AD.',
      'In ABC the side AB is eight, AC is twelve and the angle A is sixty degrees. Find the length of the bisector AD.'),
    A('why',
      "Bissektrisa uchburchakni ikkitaga bo'ladi va ikkala bo'lakning yuzi butunning yuziga qo'shiladi.",
      'Биссектриса делит треугольник надвое, и площади частей в сумме дают целое.',
      'The bisector splits the triangle in two, and the parts add up to the whole.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bissektrisa to'rt butun sakkiz o'ndan karra ildiz uch, taxminan sakkiz butun uch o'ndan. Bu yerda yuz javob emas, VOSITA bo'ldi: uni ikki xil usulda yozib, noma'lum uzunlikni tenglamadan chiqardik. Darslikning yigirma yetti nuqta sakkizinchi mashqi aynan shu ko'rsatmani beradi.",
      'Биссектриса четыре целых восемь десятых корня из трёх, примерно восемь целых три десятых. Площадь здесь оказалась не ответом, а СРЕДСТВОМ: записав её двумя способами, мы вытащили неизвестную длину из уравнения. Задача двадцать семь точка восемь учебника даёт именно такое указание.',
      'The bisector is four point eight root three, about eight point three. Here the area was not the answer but a MEANS: written two ways it pulled an unknown length out of an equation. Exercise twenty seven point eight gives exactly that hint.',
    ),
    tasks: [
      {
        expr: 'AB = 8,   AC = 12,   ∠A = 60°',
        question: L(
          "Butun uchburchakning yuzi nechaga teng?",
          'Чему равна площадь всего треугольника?',
          'What is the area of the whole triangle?',
        ),
        ok: L("Ha, yigirma to'rt ildiz uch.", 'Да, двадцать четыре корня из трёх.', 'Yes, twenty four root three.'),
        items: [
          { id: 'a', right: true, label: '24√3' },
          { id: 'b', label: '48', hint: L("Qirq sakkiz bu yarim karra sakkiz karra o'n ikki, ya'ni sinussiz. Sinus oltmish ildiz uch bo'lingan ikki.", 'Сорок восемь это половина на восемь на двенадцать, то есть без синуса. А синус шестидесяти корень из трёх пополам.', 'Forty eight is half of eight times twelve, without the sine. The sine of sixty is root three over two.') },
        ],
        solution: ['S = ½ · 8 · 12 · (√3/2)', 'S = 24√3'],
      },
      {
        expr: '60° = 30° + 30°',
        question: L(
          "Ikkita bo'lakning yuzlari yig'indisi AD orqali qanday yoziladi?",
          'Как записать сумму площадей двух частей через AD?',
          'How is the sum of the two areas written through AD?',
        ),
        ok: L(
          "Ha, besh AD. Yarim karra sakkiz karra AD karra nol butun besh o'ndan qo'shuv yarim karra o'n ikki karra AD karra nol butun besh o'ndan.",
          'Да, пять AD. Половина на восемь на AD на ноль целых пять десятых плюс половина на двенадцать на AD на ноль целых пять десятых.',
          'Yes, five AD. Half of eight times AD times zero point five plus half of twelve times AD times zero point five.',
        ),
        items: [
          { id: 'a', right: true, label: '5 · AD' },
          {
            id: 'b',
            label: '10 · AD',
            hint: L(
              "Har bir yuzda yarim ko'paytuvchi ham, sinus o'ttiz ham bor. Sakkiz va o'n ikkining yig'indisi yigirma, uni ikkiga bo'lib, keyin yana ikkiga bo'ling.",
              'В каждой площади есть и множитель одна вторая, и синус тридцати. Сумма восьми и двенадцати двадцать, раздели её на два и ещё раз на два.',
              'Each area carries both the half and the sine of thirty. Eight plus twelve is twenty; halve it and halve it again.',
            ),
          },
        ],
        solution: ['½ · 8 · AD · 0,5 + ½ · 12 · AD · 0,5', '5 · AD = 24√3', 'AD = 4,8√3'],
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
    "Blits: yarim, qaysi burchak, chegara",
    'Блиц: половина, какой угол, предел',
    'Blitz: the half, which angle, the ceiling',
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
        tag: 'notogri-burchak-olish',
        ask: L(
          "Formulada qaysi burchakning sinusi turadi?",
          'Синус какого угла стоит в формуле?',
          'The sine of which angle stands in the formula?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Ikkita tomon orasidagi", 'Между двумя сторонами', 'The one between the two sides'),
          },
          { id: 'w', label: L('Eng katta burchak', 'Наибольшего угла', 'The largest angle') },
        ],
        ok: L(
          "To'g'ri. Formulada uchta harf bor va burchak ikkalasining orasida turadi.",
          'Верно. В формуле три буквы, и угол стоит между двумя из них.',
          'Correct. The formula holds three letters and the angle sits between two of them.',
        ),
        hint: L(
          "4-ekranni eslang: b va c tomonlar A uchida uchrashardi, shuning uchun ular bilan sinus A yozilgandi.",
          'Вспомни 4 экран: стороны b и c сходились в вершине A, поэтому с ними писался синус A.',
          'Recall screen 4: the sides b and c met at A, so the sine of A went with them.',
        ),
      },
      {
        id: 'q2',
        tag: 'yarimni-unutish',
        ask: L(
          "Parallelogrammning yuzida yarim ko'paytuvchi bormi?",
          'Есть ли множитель одна вторая в площади параллелограмма?',
          'Does the parallelogram area carry the factor one half?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'w', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Parallelogramm ikkita bir xil uchburchakdan iborat, shuning uchun yarim yo'qoladi.",
          'Верно. Параллелограмм состоит из двух одинаковых треугольников, поэтому половина исчезает.',
          'Correct. A parallelogram is two identical triangles, so the half disappears.',
        ),
        hint: L(
          "6-ekranni eslang: diagonal parallelogrammni ikkita teng uchburchakka ajratgandi.",
          'Вспомни 6 экран: диагональ делила параллелограмм на два равных треугольника.',
          'Recall screen 6: the diagonal split it into two equal triangles.',
        ),
      },
      {
        id: 'q3',
        tag: 'otmas-burchakda-sinus',
        ask: L(
          "O'tmas burchakda yuz manfiy bo'lib qoladimi?",
          'Станет ли площадь отрицательной при тупом угле?',
          'Does the area go negative at an obtuse angle?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q, sinus musbat qoladi", 'Нет, синус остаётся положительным', 'No, the sine stays positive') },
          { id: 'w', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Manfiy bo'ladigan kosinus edi, sinus esa bir yuz saksongacha musbat.",
          'Верно. Отрицательным становился косинус, а синус положителен вплоть до ста восьмидесяти.',
          'Correct. It was the cosine that went negative; the sine is positive up to one hundred eighty.',
        ),
        hint: L(
          "10-ekranni eslang: bir yuz o'ttiz besh darajali rombning yuzi musbat chiqqandi.",
          'Вспомни 10 экран: площадь ромба с углом сто тридцать пять вышла положительной.',
          'Recall screen 10: the rhombus with an angle of one hundred thirty five had a positive area.',
        ),
      },
      {
        id: 'q4',
        tag: 'balandlik-tomon-almashish',
        ask: L(
          "Tomonlari 5 va 8 bo'lgan uchburchakning yuzi 25 bo'la oladimi?",
          'Может ли площадь треугольника со сторонами 5 и 8 быть равной 25?',
          'Can a triangle with sides 5 and 8 have area 25?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'w', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Chegara yarim karra besh karra sakkiz, ya'ni yigirma, va yigirma besh undan katta.",
          'Верно. Предел это половина на пять на восемь, то есть двадцать, а двадцать пять больше.',
          'Correct. The ceiling is half of five times eight, that is twenty, and twenty five is above it.',
        ),
        hint: L(
          "12-ekranni eslang: sinus birdan katta bo'lmagani uchun yuz yarim ko'paytmadan oshmaydi.",
          'Вспомни 12 экран: синус не больше единицы, поэтому площадь не превышает половины произведения.',
          'Recall screen 12: the sine is at most one, so the area cannot pass half the product.',
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
    "Burchak balandlikning o'rnini bosdi",
    'Угол заменил высоту',
    'The angle took the place of the height',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda balandlik berilmagandi va eski formula ishga tushmasdi.",
      'На первом экране высота не была дана, и старая формула не запускалась.',
      'On the first screen no height was given and the old formula would not start.'),
    A('s1',
      "Siz formulani chiqardingiz, uni parallelogramm va to'rtburchakka ko'chirdingiz va bissektrisani yuz orqali topdingiz.",
      'Ты вывел формулу, перенёс её на параллелограмм и четырёхугольник и нашёл биссектрису через площадь.',
      'You derived the formula, carried it to a parallelogram and a quadrilateral, and found a bisector through the area.'),
    A('s2',
      "Keyingi darsda blok bo'yicha DTM masalalari.",
      'В следующем уроке задачи ДТМ по блоку.',
      'The next lesson brings DTM problems for the block.'),
  ],
  props: {
    mark: 'S = ½ · ab · sin C',
    markNote: L(
      "sinus birdan katta emas, demak S ≤ ½ab",
      'синус не больше единицы, значит S ≤ ½ab',
      'the sine is at most one, so S ≤ ½ab',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: DTM masalalari',
      'Следующий урок: задачи ДТМ',
      'Next lesson: DTM problems',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'balandlik-tomon-almashish', ...S2 },
  { role: 'explain',  tag: 'yarimni-unutish', ...S3 },
  { role: 'explain',  tag: 'notogri-burchak-olish', ...S4 },
  { role: 'explain',  tag: 'yarimni-unutish', ...S5 },
  { role: 'explain',  tag: 'yarimni-unutish', ...S6 },
  { role: 'explain',  tag: 'otmas-burchakda-sinus', ...S7 },
  { role: 'rule',     tag: 'notogri-burchak-olish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'notogri-burchak-olish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'otmas-burchakda-sinus', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'balandlik-tomon-almashish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yarimni-unutish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'yarimni-unutish', ...S13 },
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
