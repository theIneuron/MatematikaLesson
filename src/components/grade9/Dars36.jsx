// ============================================================================
// 9-sinf, Dars 36. GEOMETRIK ALMASHTIRISHLAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 15-dars (48-49-bet),
// 16-dars (50-51), 17-dars (52-53).
//   15-dars: shakl almashtirish tushunchasi; HARAKAT — nuqtalar
//       orasidagi masofani SAQLAYDIGAN almashtirish; parallel ko'chirish
//       vektor bo'yicha. Harakat bilan ustma-ust tushadigan shakllar
//       TENG deyiladi.
//   16-dars: o'qqa nisbatan simmetriya. Darslik uni harakat ekanini
//       koordinatalar bilan ISBOTLAYDI: A(x₁; y₁) va B(x₂; y₂) uchun
//       akslar A₁(−x₁; y₁), B₁(−x₂; y₂), va masofa formulasida
//       (−x₂ − (−x₁))² = (x₂ − x₁)², ya'ni AB = A₁B₁.
//   17-dars: markaziy simmetriya va burish. 1-masala: O(2; 4) ga
//       nisbatan A(1; 2) → A₁(3; 6).
//
// DARSNING UMURTQASI — BITTA SAVOL: qaysi almashtirish MASOFANI
// saqlaydi. Uchta almashtirish (parallel ko'chirish, o'qqa nisbatan va
// markaziy simmetriya) saqlaydi va harakat deb ataladi, o'xshashlik esa
// (35-dars) saqlamaydi — u masofani k marta o'zgartiradi. Shuning uchun
// xuk ikkita darsni ulaydi: siljitilgan figura TENG, kattalashtirilgani
// esa faqat O'XSHASH.
//
// KOORDINATALAR TAYANCH BO'LIB ISHLAYDI. Simmetriyani «ko'zdan»
// aniqlash aldamchi, koordinatada esa u bitta ishora almashishi:
// Oy o'qi abssissani, Ox o'qi ordinatani, markaz esa IKKALASINI
// almashtiradi. 12-ekrandagi tuzoq aynan shu joyda: Kamron Oy o'qiga
// nisbatan simmetriyada y ni almashtirgan.
//
// TRANSFER (13-ekran): markaziy simmetriya bu 180 gradusga burish.
// Ikkita ta'rif bir xil almashtirishni beradi, va buni tekshirish
// mumkin — nuqta markazdan o'tib, teng masofada narigi tomonga tushadi.
//
// CHIZMA: `PolyPair` ga `axis` qo'shildi ('v' — o'q, 'c' — markaz).
// Simmetriyada ikkita figurani ko'rsatishning o'zi yetmaydi, ular
// ORASIDAGI o'q ko'rinishi kerak.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, PolyPair, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-36',
  n: 36,
  row: 36,
  block: 'Б7',
  topic: L(
    'Geometrik almashtirishlar',
    'Геометрические преобразования',
    'Geometric transformations',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Masofani saqlaydigan shakl almashtirish HARAKAT deb ataladi",
    'Преобразование фигуры, сохраняющее расстояния, называется ДВИЖЕНИЕМ',
    'A transformation that preserves distances is called a MOTION',
  ),
  L(
    "Parallel ko'chirish, o'qqa va markazga nisbatan simmetriya — hammasi harakat",
    'Параллельный перенос, осевая и центральная симметрия — всё это движения',
    'A translation, an axial and a central symmetry are all motions',
  ),
  L(
    "Oy o'qi abssissani, Ox o'qi ordinatani, markaz esa ikkala koordinatani almashtiradi",
    'Ось Oy меняет абсциссу, ось Ox ординату, а центр обе координаты',
    'The Oy axis flips the abscissa, Ox the ordinate, and a centre flips both',
  ),
]

export const MISS = {
  'harakat-emasni-harakat': {
    what: L(
      "masofani o'zgartiradigan almashtirish harakat deb hisoblandi",
      'преобразование, меняющее расстояния, сочтено движением',
      'a transformation that changes distances was taken for a motion',
    ),
    wrong: null,
    at: 0,
  },
  'qaysi-koordinata-almashadi': {
    what: L(
      "simmetriyada noto'g'ri koordinata almashtirildi",
      'при симметрии изменена не та координата',
      'the wrong coordinate was flipped in the symmetry',
    ),
    wrong: null,
    at: 0,
  },
  'markaz-ortasi-emas': {
    what: L(
      "markaz kesmaning o'rtasi ekani ishlatilmadi",
      'не использовано, что центр это середина отрезка',
      'the fact that the centre is the midpoint was not used',
    ),
    wrong: null,
    at: 0,
  },
  'nima-saqlanadi': {
    what: L(
      "harakatda nima saqlanishi noto'g'ri aytildi",
      'неверно названо, что сохраняется при движении',
      'what a motion preserves was named wrongly',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — 35-dars bilan ulanish.
// ============================================================
const T1 = { pts: [[0, 0], [1.6, 0], [1.6, 1]], sides: ['4', '', ''] }
const T1MOVED = { pts: [[0, 0], [1.6, 0], [1.6, 1]], sides: ['4', '', ''] }
const T2BIG = { pts: [[0, 0], [3.2, 0], [3.2, 2]], sides: ['8', '', ''] }

const S1 = {
  eyebrow: L('TENG YOKI O\'XSHASH', 'РАВНЫ ИЛИ ПОДОБНЫ', 'EQUAL OR SIMILAR'),
  title: L(
    "Siljitilgan va kattalashtirilgan",
    'Сдвинутый и увеличенный',
    'Shifted and enlarged',
  ),
  audio: [
    A('mount',
      "O'tgan darsda o'xshash figuralar bilan ishlagandik. Bugun ularni tengligi bilan solishtiramiz.",
      'На прошлом уроке мы работали с подобными фигурами. Сегодня сравним их с равными.',
      'Last lesson we worked with similar figures. Today we compare them with equal ones.'),
    A('why',
      "Chapdagi uchburchakning tomoni to'rt, o'ngdagisining tomoni sakkiz. Uni faqat siljitishmagan, kattalashtirishgan ham.",
      'У левого треугольника сторона четыре, у правого восемь. Его не просто сдвинули, а увеличили.',
      'The left triangle has side four, the right one eight. It was not merely shifted but enlarged.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={T1} b={T2BIG} sameScale />}
      steps={[]}
      ask={L(
        "Bunday almashtirishda nuqtalar orasidagi masofa saqlanadimi?",
        'Сохраняется ли расстояние между точками при таком преобразовании?',
        'Does such a transformation preserve the distance between points?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Yo'q: barcha masofalar ikki barobar ortdi",
            'Нет: все расстояния выросли вдвое',
            'No: every distance doubled',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Ha: shakl o'zgarmadi, demak masofa ham",
            'Да: форма не изменилась, значит и расстояние',
            'Yes: the shape is unchanged, so the distance is too',
          ),
          hint: L(
            "Shakl haqiqatan ham o'zgarmadi, lekin savol masofa haqida. To'rt sakkizga aylandi, demak masofa ikki barobar ortdi.",
            'Форма и правда не изменилась, но вопрос о расстоянии. Четыре стало восемью, значит расстояние выросло вдвое.',
            'The shape really is unchanged, but the question is about distance. Four became eight, so the distance doubled.',
          ),
        },
      ]}
      after={L(
        "Ha. Bunday figuralar o'xshash, lekin teng emas. Bugun masofani SAQLAYDIGAN almashtirishlar bilan tanishamiz, ular harakat deb ataladi.",
        'Да. Такие фигуры подобны, но не равны. Сегодня познакомимся с преобразованиями, которые СОХРАНЯЮТ расстояние, их называют движениями.',
        'Yes. Such figures are similar but not equal. Today we meet transformations that PRESERVE distance, called motions.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — ikki nuqta orasidagi masofa.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Masofa formulasi kerak bo'ladi",
    'Понадобится формула расстояния',
    'The distance formula will be needed',
  ),
  audio: [
    A('mount',
      "Ikki nuqta orasidagi masofa koordinatalar ayirmalarining kvadratlari yig'indisidan ildiz olish bilan topiladi.",
      'Расстояние между двумя точками находится как корень из суммы квадратов разностей координат.',
      'The distance between two points is the root of the sum of the squared coordinate differences.'),
    A('why',
      "Bir ikki nuqtasidan to'rt olti nuqtasigacha bo'lgan masofani hisoblang.",
      'Посчитай расстояние от точки один два до точки четыре шесть.',
      'Compute the distance from the point one two to the point four six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('A(1; 2),   B(4; 6)', 'A(1; 2),   B(4; 6)', 'A(1; 2),   B(4; 6)')}
      steps={[
        { id: 'a', head: L('Ayirmalar', 'Разности', 'The differences'), lines: ['4 − 1 = 3', '6 − 2 = 4'] },
      ]}
      ask={L(
        "AB masofasi nechaga teng?",
        'Чему равно расстояние AB?',
        'What does the distance AB equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'AB = 5' },
        {
          id: 'wrong',
          label: 'AB = 7',
          hint: L(
            "Yetti bu ayirmalarning yig'indisi. Masofa esa gipotenuza, ya'ni to'qqiz qo'shuv o'n oltidan ildiz.",
            'Семь это сумма разностей. А расстояние это гипотенуза, то есть корень из девяти плюс шестнадцать.',
            'Seven is the sum of the differences. The distance is a hypotenuse, the root of nine plus sixteen.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch va to'rt katetlar, besh esa gipotenuza. Bugun aynan shu formula bilan simmetriyaning harakat ekanini isbotlaymiz.",
        'Верно. Три и четыре катеты, пять гипотенуза. Сегодня именно этой формулой докажем, что симметрия это движение.',
        'Correct. Three and four are the legs and five the hypotenuse. Today this very formula will prove a symmetry is a motion.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — parallel ko'chirish.
// ============================================================
const S3 = {
  eyebrow: L('PARALLEL KO\'CHIRISH', 'ПАРАЛЛЕЛЬНЫЙ ПЕРЕНОС', 'TRANSLATION'),
  title: L(
    "Hamma nuqta bir xil yo'nalishda siljiydi",
    'Все точки сдвигаются одинаково',
    'Every point shifts the same way',
  ),
  audio: [
    A('mount',
      "Eng oddiy harakat bu parallel ko'chirish. Barcha nuqtalar bitta vektor bo'yicha, bir xil masofaga siljiydi.",
      'Простейшее движение это параллельный перенос. Все точки сдвигаются по одному вектору на одно расстояние.',
      'The simplest motion is a translation. Every point shifts along one vector by the same distance.'),
    A('why',
      "Har bir nuqta uch birlik o'ngga siljisa, ikkita nuqta orasidagi masofa nima bo'ladi?",
      'Если каждая точка сдвинется на три единицы вправо, что станет с расстоянием между двумя точками?',
      'If every point moves three units right, what happens to the distance between two points?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={T1} b={T1MOVED} sameScale marks={L('parallel kochirish', 'параллельный перенос', 'a translation')} />}
      steps={[]}
      ask={L(
        "Siljishdan keyin masofa qanday o'zgaradi?",
        'Как изменится расстояние после сдвига?',
        'How does the distance change after the shift?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("O'zgarmaydi", 'Не изменится', 'It stays the same'),
        },
        {
          id: 'wrong',
          label: L('Uch birlikka ortadi', 'Вырастет на три единицы', 'It grows by three units'),
          hint: L(
            "Ikkala nuqta ham bir xil tomonga siljidi, demak ular orasidagi bo'shliq o'zgarmadi. Uch birlik har bir nuqtaning siljishi, ular orasidagi masofa emas.",
            'Обе точки сдвинулись в одну сторону, значит промежуток между ними не изменился. Три единицы это сдвиг каждой точки, а не расстояние между ними.',
            'Both points moved the same way, so the gap between them is unchanged. Three units is each point shift, not the distance between them.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Parallel ko'chirish masofani saqlaydi, demak u harakat. Harakat bilan ustma-ust tushadigan figuralar TENG deyiladi.",
        'Верно. Параллельный перенос сохраняет расстояние, значит это движение. Фигуры, совмещаемые движением, называют равными.',
        'Correct. A translation preserves distance, so it is a motion. Figures joined by a motion are called equal.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — o'qqa nisbatan simmetriya.
// ============================================================
const FL = { pts: [[0, 0], [1.4, 0], [1.4, 0.5], [0.5, 0.5], [0.5, 1.2], [0, 1.2]], sides: [] }
const FR = { pts: [[1.4, 0], [0, 0], [0, 0.5], [0.9, 0.5], [0.9, 1.2], [1.4, 1.2]], sides: [] }

const S4 = {
  eyebrow: L('O\'QQA NISBATAN', 'ОТНОСИТЕЛЬНО ОСИ', 'ABOUT AN AXIS'),
  title: L(
    "Ko'zguga qarab turgandek",
    'Как в зеркале',
    'As in a mirror',
  ),
  audio: [
    A('mount',
      "O'qqa nisbatan simmetriyada har bir nuqta o'qning narigi tomoniga, xuddi shu masofaga o'tadi.",
      'При симметрии относительно оси каждая точка переходит на другую сторону оси, на то же расстояние.',
      'In an axial symmetry each point crosses to the other side of the axis at the same distance.'),
    A('why',
      "Agar o'q Oy bo'lsa, koordinatalarning qaysi biri o'zgaradi?",
      'Если ось это Oy, какая из координат меняется?',
      'If the axis is Oy, which coordinate changes?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={FL} b={FR} sameScale axis="v" />}
      steps={[
        { id: 'a', head: L('Nuqta', 'Точка', 'The point'), lines: ['A(3; 5)'] },
      ]}
      ask={L(
        "Oy o'qiga nisbatan simmetriyada A nuqta qayerga o'tadi?",
        'Куда перейдёт точка A при симметрии относительно оси Oy?',
        'Where does A go under symmetry about the Oy axis?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'A₁(−3; 5)' },
        {
          id: 'wrong',
          label: 'A₁(3; −5)',
          hint: L(
            "Oy o'qi tik turadi, nuqta esa uning narigi tomoniga o'tadi, ya'ni chapga yoki o'ngga. Balandligi esa o'zgarmaydi.",
            'Ось Oy стоит вертикально, и точка переходит на другую её сторону, то есть влево или вправо. А высота не меняется.',
            'The Oy axis stands upright, so the point crosses left or right. Its height does not change.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Oy o'qi abssissaning ishorasini almashtiradi, ordinata esa joyida qoladi. Ox o'qida aksincha bo'ladi.",
        'Верно. Ось Oy меняет знак абсциссы, а ордината остаётся на месте. У оси Ox наоборот.',
        'Correct. The Oy axis flips the sign of the abscissa while the ordinate stays. For Ox it is the other way round.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — simmetriya harakat ekanining isboti.
// ============================================================
const S5 = {
  eyebrow: L('ISBOT', 'ДОКАЗАТЕЛЬСТВО', 'THE PROOF'),
  title: L(
    "Nega simmetriya harakat",
    'Почему симметрия это движение',
    'Why a symmetry is a motion',
  ),
  audio: [
    A('mount',
      "Bir ikki va to'rt olti nuqtalarini olaylik. Ularning Oy o'qiga nisbatan akslari minus bir ikki va minus to'rt olti.",
      'Возьмём точки один два и четыре шесть. Их образы относительно оси Oy это минус один два и минус четыре шесть.',
      'Take the points one two and four six. Their images about Oy are minus one two and minus four six.'),
    A('why',
      "Yangi abssissalarning ayirmasini hisoblang: minus to'rt minus minus bir.",
      'Посчитай разность новых абсцисс: минус четыре минус минус один.',
      'Compute the difference of the new abscissas: minus four minus minus one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('A₁(−1; 2),   B₁(−4; 6)', 'A₁(−1; 2),   B₁(−4; 6)', 'A₁(−1; 2),   B₁(−4; 6)')}
      steps={[
        { id: 'a', head: L('Ayirma', 'Разность', 'The difference'), lines: ['−4 − (−1) = −3'] },
      ]}
      ask={L(
        "Yangi masofa nechaga teng?",
        'Чему равно новое расстояние?',
        'What does the new distance equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '5' },
        {
          id: 'wrong',
          label: '−5',
          hint: L(
            "Ayirma manfiy chiqdi, lekin u KVADRATGA ko'tariladi va minus yo'qoladi. Masofa esa hech qachon manfiy bo'lmaydi.",
            'Разность вышла отрицательной, но она возводится в КВАДРАТ и минус исчезает. А расстояние отрицательным не бывает.',
            'The difference came out negative, but it is SQUARED and the minus disappears. A distance is never negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, o'sha besh. Ayirmaning ishorasi almashdi, kvadrati esa o'zgarmadi. Shuning uchun simmetriya masofani saqlaydi va harakat hisoblanadi.",
        'Верно, те же пять. Знак разности сменился, а квадрат не изменился. Поэтому симметрия сохраняет расстояние и считается движением.',
        'Correct, the same five. The sign of the difference flipped but its square did not. So a symmetry preserves distance and counts as a motion.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — markaziy simmetriya.
// ============================================================
const S6 = {
  eyebrow: L('MARKAZGA NISBATAN', 'ОТНОСИТЕЛЬНО ЦЕНТРА', 'ABOUT A CENTRE'),
  title: L(
    "Markaz kesmaning o'rtasi",
    'Центр это середина отрезка',
    'The centre is the midpoint',
  ),
  audio: [
    A('mount',
      "Markaziy simmetriyada nuqta markazdan o'tib, teng masofada narigi tomonga tushadi.",
      'При центральной симметрии точка проходит через центр и попадает на равное расстояние с другой стороны.',
      'In a central symmetry a point passes through the centre and lands at an equal distance beyond it.'),
    A('why',
      "Demak markaz nuqta bilan uning aksini birlashtiruvchi kesmaning o'rtasi bo'ladi.",
      'Значит центр это середина отрезка, соединяющего точку и её образ.',
      'So the centre is the midpoint of the segment joining a point and its image.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PolyPair a={FL} b={FR} sameScale axis="c" marks={L('markaz', 'центр', 'the centre')} />}
      steps={[
        { id: 'a', head: L('Ortasi shart', 'Условие середины', 'The midpoint condition'), lines: ['(1 + x) : 2 = 2', '(2 + y) : 2 = 4'] },
      ]}
      ask={L(
        "O(2; 4) markazga nisbatan A(1; 2) qayerga o'tadi?",
        'Куда перейдёт A(1; 2) при симметрии относительно центра O(2; 4)?',
        'Where does A(1; 2) go about the centre O(2; 4)?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'A₁(3; 6)' },
        {
          id: 'wrong',
          label: 'A₁(−1; −2)',
          hint: L(
            "Minus bir minus ikki bu KOORDINATALAR BOSHIGA nisbatan aks bo'lardi. Bu yerda esa markaz ikki to'rt nuqtasida.",
            'Минус один минус два это образ относительно НАЧАЛА КООРДИНАТ. А здесь центр в точке два четыре.',
            'Minus one minus two is the image about the ORIGIN. Here the centre sits at two four.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkidan birgacha bir birlik, demak narigi tomonga ham bir birlik, ya'ni uch. Ordinata bilan ham xuddi shunday. Bu darslikning birinchi masalasi.",
        'Верно. От двух до единицы одна единица, значит и с другой стороны одна, то есть три. С ординатой так же. Это первая задача учебника.',
        'Correct. From two to one is one unit, so one unit beyond gives three. The ordinate works the same. This is the first problem in the textbook.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — nima saqlanadi.
// ============================================================
const S7 = {
  eyebrow: L('NIMA SAQLANADI', 'ЧТО СОХРАНЯЕТСЯ', 'WHAT IS PRESERVED'),
  title: L(
    "Harakat nimani buzmaydi",
    'Что движение не портит',
    'What a motion leaves alone',
  ),
  audio: [
    A('mount',
      "Harakatda to'g'ri chiziq to'g'ri chiziqqa, kesma unga teng kesmaga, burchak unga teng burchakka o'tadi.",
      'При движении прямая переходит в прямую, отрезок в равный отрезок, угол в равный угол.',
      'Under a motion a line goes to a line, a segment to an equal segment, an angle to an equal angle.'),
    A('why',
      "Yuz haqida nima deyish mumkin?",
      'А что можно сказать о площади?',
      'And what about the area?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Harakat: masofa saqlanadi",
        'Движение: расстояние сохраняется',
        'A motion: distance is preserved',
      )}
      steps={[]}
      ask={L(
        "Harakatda figuraning yuzi qanday o'zgaradi?",
        'Как меняется площадь фигуры при движении?',
        'How does a figure area change under a motion?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("O'zgarmaydi, chunki barcha o'lchamlar saqlanadi", 'Не меняется, ведь все размеры сохраняются', 'It does not change, since every size is preserved'),
        },
        {
          id: 'wrong',
          label: L("Kvadratga ko'tariladi", 'Возводится в квадрат', 'It gets squared'),
          hint: L(
            "Kvadratga ko'tarish o'xshashlikda, 35-darsda edi. U yerda masofalar k marta o'zgargandi, bu yerda esa umuman o'zgarmaydi.",
            'Возведение в квадрат было при подобии, на 35 уроке. Там расстояния менялись в k раз, а здесь не меняются вовсе.',
            'Squaring belonged to similarity in lesson 35. There distances changed by k, here they do not change at all.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Harakat figurani ko'chiradi yoki aylantiradi, lekin uni cho'zmaydi. Shuning uchun uzunlik ham, burchak ham, yuz ham saqlanadi.",
        'Верно. Движение переносит или поворачивает фигуру, но не растягивает её. Поэтому сохраняются и длина, и угол, и площадь.',
        'Correct. A motion moves or turns a figure but never stretches it. So length, angle, and area all survive.',
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
    'Geometriya 9, 15-17-darslar (48-53-bet)',
    'Геометрия 9, уроки 15-17 (стр. 48-53)',
    'Geometry 9, lessons 15-17 (p. 48-53)',
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
          "Almashtirish harakat ekanini nima hal qiladi?",
          'Что решает, является ли преобразование движением?',
          'What decides whether a transformation is a motion?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L('Masofaning saqlanishi', 'Сохранение расстояния', 'Whether distance is preserved'),
          },
          {
            id: 'wrong',
            label: L("Shaklning o'zgarmasligi", 'Неизменность формы', 'Whether the shape is unchanged'),
            hint: L(
              "1-ekranni eslang: u yerda shakl o'zgarmagandi, lekin masofa ikki barobar ortgandi va bu harakat emas edi.",
              'Вспомни 1 экран: там форма не изменилась, но расстояние выросло вдвое, и движением это не было.',
              'Recall screen 1: the shape was unchanged there, yet the distance doubled and it was no motion.',
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
    "Harakat va uning uch turi",
    'Движение и три его вида',
    'A motion and its three kinds',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz harakatning ta'rifini, uchta turini va koordinatalardagi ko'rinishini ko'rdingiz.",
      'На семи экранах ты увидел определение движения, три его вида и запись в координатах.',
      'On seven screens you met the definition of a motion, its three kinds, and its coordinate form.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — koordinatalar.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Qaysi koordinata almashadi",
    'Какая координата меняется',
    'Which coordinate flips',
  ),
  audio: [
    A('mount',
      "Uchta almashtirish, bitta nuqta. Har safar qaysi koordinata ishorasini almashtirishini aniqlang.",
      'Три преобразования, одна точка. Каждый раз определи, какая координата меняет знак.',
      'Three transformations, one point. Each time decide which coordinate flips sign.'),
    A('why',
      "O'q tik bo'lsa, nuqta chapga yoki o'ngga o'tadi.",
      'Если ось вертикальна, точка переходит влево или вправо.',
      'If the axis is upright, the point crosses left or right.'),
  ],
  props: {
    stepLabel: L('Almashtirish', 'Преобразование', 'Transformation'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Tik o'q abssissani, yotiq o'q ordinatani, koordinatalar boshi esa ikkalasini almashtiradi.",
      'Все три найдены. Вертикальная ось меняет абсциссу, горизонтальная ординату, а начало координат обе.',
      'All three are found. A vertical axis flips the abscissa, a horizontal one the ordinate, and the origin flips both.',
    ),
    tasks: [
      {
        expr: 'A(3; 5),   Oy',
        question: L('Aks nuqta qanday koordinatalarga ega?', 'Какие координаты у образа?', 'What are the coordinates of the image?'),
        ok: L("Ha. Oy o'qi tik, demak abssissa ishorasini almashtiradi.", 'Да. Ось Oy вертикальна, значит абсцисса меняет знак.', 'Yes. The Oy axis is upright, so the abscissa flips.'),
        items: [
          { id: 'a', right: true, label: '(−3; 5)' },
          { id: 'b', label: '(3; −5)', hint: L("Bu Ox o'qiga nisbatan aks bo'lardi. Oy o'qi esa tik turadi.", 'Это был бы образ относительно оси Ox. А ось Oy стоит вертикально.', 'That would be the image about Ox. The Oy axis stands upright.') },
        ],
        solution: ['Oy:  x → −x', '(3; 5) → (−3; 5)'],
      },
      {
        expr: 'A(3; 5),   Ox',
        question: L('Aks nuqta qanday koordinatalarga ega?', 'Какие координаты у образа?', 'What are the coordinates of the image?'),
        ok: L("Ha. Ox o'qi yotiq, demak ordinata ishorasini almashtiradi.", 'Да. Ось Ox горизонтальна, значит ординат меняет знак.', 'Yes. The Ox axis is horizontal, so the ordinate flips.'),
        items: [
          { id: 'a', right: true, label: '(3; −5)' },
          { id: 'b', label: '(−3; −5)', hint: L("Ikkala ishora ham almashsa, bu markaziy simmetriya bo'lardi. O'qqa nisbatan esa faqat bittasi almashadi.", 'Если меняются оба знака, это была бы центральная симметрия. А относительно оси меняется только один.', 'Flipping both signs would be a central symmetry. About an axis only one flips.') },
        ],
        solution: ['Ox:  y → −y', '(3; 5) → (3; −5)'],
      },
      {
        expr: 'A(3; 5),   O(0; 0)',
        question: L('Aks nuqta qanday koordinatalarga ega?', 'Какие координаты у образа?', 'What are the coordinates of the image?'),
        ok: L("Ha. Markaziy simmetriyada ikkala koordinata ham ishorasini almashtiradi.", 'Да. При центральной симметрии обе координаты меняют знак.', 'Yes. In a central symmetry both coordinates flip.'),
        items: [
          { id: 'a', right: true, label: '(−3; −5)' },
          { id: 'b', label: '(−3; 5)', hint: L("Bu Oy o'qiga nisbatan aks. Markaz esa nuqtani butunlay qarama-qarshi tomonga o'tkazadi.", 'Это образ относительно оси Oy. А центр переводит точку в полностью противоположную сторону.', 'That is the image about Oy. A centre sends the point to the fully opposite side.') },
        ],
        solution: ['O(0; 0):  (x; y) → (−x; −y)', '(3; 5) → (−3; −5)'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — markazni topish.
// ============================================================
const S10 = {
  eyebrow: L('MARKAZNI TOPISH', 'НАХОДИМ ЦЕНТР', 'FINDING THE CENTRE'),
  title: L(
    "Teskari masala",
    'Обратная задача',
    'The reverse problem',
  ),
  audio: [
    A('mount',
      "Endi nuqta va uning aksi ma'lum, markazni topish kerak.",
      'Теперь известны точка и её образ, а найти нужно центр.',
      'Now the point and its image are known and the centre must be found.'),
    A('why',
      "Markaz kesmaning o'rtasi edi, o'rtani esa o'rta arifmetik beradi.",
      'Центр был серединой отрезка, а середину даёт среднее арифметическое.',
      'The centre was the midpoint, and a midpoint comes from the arithmetic mean.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Markazni topish uchun koordinatalarni qo'shib, ikkiga bo'lish yetarli — bu 28-darsdagi o'rta arifmetikning o'zi.",
      'Обе найдены. Чтобы найти центр, достаточно сложить координаты и разделить на два — это то же среднее арифметическое с 28 урока.',
      'Both are found. To find the centre, add the coordinates and halve them — the same arithmetic mean as in lesson 28.',
    ),
    tasks: [
      {
        expr: 'A(1; 2)  →  A₁(5; 8)',
        question: L('Simmetriya markazi qayerda?', 'Где центр симметрии?', 'Where is the centre of symmetry?'),
        ok: L("Ha. Bir qo'shuv besh ikkiga bo'lingan uch, ikki qo'shuv sakkiz ikkiga bo'lingan besh.", 'Да. Один плюс пять пополам три, два плюс восемь пополам пять.', 'Yes. One plus five halved is three, two plus eight halved is five.'),
        items: [
          { id: 'a', right: true, label: 'O(3; 5)' },
          { id: 'b', label: 'O(4; 6)', hint: L("To'rt olti bu koordinatalarning AYIRMASI. Markaz esa o'rtada, ya'ni yig'indining yarmida.", 'Четыре шесть это РАЗНОСТЬ координат. А центр посередине, то есть половина суммы.', 'Four six is the DIFFERENCE of the coordinates. The centre is midway, that is half the sum.') },
        ],
        solution: ['x = (1 + 5) : 2 = 3', 'y = (2 + 8) : 2 = 5'],
      },
      {
        expr: 'O(1; 1),   A(4; 3)',
        question: L('A nuqtaning aksi qayerda?', 'Где образ точки A?', 'Where is the image of A?'),
        ok: L("Ha. Ikki karra bir minus to'rt minus ikki, ikki karra bir minus uch minus bir.", 'Да. Дважды один минус четыре это минус два, дважды один минус три это минус один.', 'Yes. Twice one minus four is minus two, twice one minus three is minus one.'),
        items: [
          { id: 'a', right: true, label: '(−2; −1)' },
          { id: 'b', label: '(−4; −3)', hint: L("Minus to'rt minus uch koordinatalar boshiga nisbatan aks bo'lardi. Markaz esa bir bir nuqtasida, u boshqa joyda.", 'Минус четыре минус три это образ относительно начала координат. А центр в точке один один, он в другом месте.', 'Minus four minus three is the image about the origin. The centre sits at one one, elsewhere.') },
        ],
        solution: ['x₁ = 2 · 1 − 4 = −2', 'y₁ = 2 · 1 − 3 = −1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — harakatmi yoki yo'q.
// ============================================================
const S11 = {
  eyebrow: L('HARAKATMI', 'ДВИЖЕНИЕ ЛИ', 'IS IT A MOTION'),
  title: L(
    "Har birini masofa bo'yicha tekshiring",
    'Проверь каждое по расстоянию',
    'Test each by distance',
  ),
  audio: [
    A('mount',
      "Uchta almashtirish. Har birida masofa saqlanadimi yoki yo'qmi degan savolga javob bering.",
      'Три преобразования. В каждом ответь, сохраняется ли расстояние.',
      'Three transformations. In each say whether distance is preserved.'),
    A('why',
      "Har safar bitta savol beriladi. Masofa o'zgardimi.",
      'Каждый раз задаётся один вопрос. Изменилось ли расстояние.',
      'One question is asked each time. Did the distance change.'),
  ],
  props: {
    stepLabel: L('Almashtirish', 'Преобразование', 'Transformation'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi. Ta'rif bitta va u qisqa, shuning uchun har qanday almashtirishni bir xil savol bilan sinash mumkin.",
      'Все три проверены. Определение одно и оно короткое, поэтому любое преобразование проверяется одним и тем же вопросом.',
      'All three are checked. The definition is single and short, so any transformation is tested by the same question.',
    ),
    tasks: [
      {
        expr: '90°',
        question: L('90 gradusga burish harakatmi?', 'Является ли движением поворот на 90 градусов?', 'Is a 90 degree rotation a motion?'),
        ok: L("Ha. Burishda figura aylanadi, lekin cho'zilmaydi.", 'Да. При повороте фигура вращается, но не растягивается.', 'Yes. A rotation turns the figure without stretching it.'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Burishda har bir nuqta markazdan bir xil masofada qoladi, demak nuqtalar orasidagi masofa ham o'zgarmaydi.", 'При повороте каждая точка остаётся на том же расстоянии от центра, значит и расстояние между точками не меняется.', 'In a rotation every point keeps its distance from the centre, so the distances between points hold too.') },
        ],
        solution: [L('masofa saqlanadi', 'расстояние сохраняется', 'distance is preserved')],
      },
      {
        expr: 'k = 2',
        question: L(
          "Koeffitsienti ikkiga teng o'xshashlik harakatmi?",
          'Является ли движением подобие с коэффициентом два?',
          'Is a similarity with factor two a motion?',
        ),
        ok: L("Yo'q. Barcha masofalar ikki barobar ortadi, demak saqlanmaydi.", 'Нет. Все расстояния увеличиваются вдвое, значит не сохраняются.', 'No. Every distance doubles, so nothing is preserved.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Shakl saqlanadi, lekin ta'rif shakl haqida emas, MASOFA haqida. Bu xukdagi holatning o'zi.", 'Форма сохраняется, но определение не о форме, а о РАССТОЯНИИ. Это тот же случай, что в хуке.', 'The shape survives, but the definition is about DISTANCE, not shape. This is the case from the opening.') },
        ],
        solution: [L('masofa k marta ortadi', 'расстояние растёт в k раз', 'distance grows k times')],
      },
      {
        expr: '(x; y) → (−x; −y)',
        question: L('Markaziy simmetriya harakatmi?', 'Является ли движением центральная симметрия?', 'Is a central symmetry a motion?'),
        ok: L("Ha. Nuqta narigi tomonga TENG masofada o'tadi, demak masofalar saqlanadi.", 'Да. Точка переходит на другую сторону на РАВНОЕ расстояние, значит расстояния сохраняются.', 'Yes. A point crosses to the other side at an EQUAL distance, so distances hold.'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ishoralar almashadi, lekin masofa hisoblanganda ular kvadratga ko'tariladi. Buni 5-ekranda ko'rgansiz.", 'Знаки меняются, но при вычислении расстояния они возводятся в квадрат. Ты видел это на 5 экране.', 'The signs flip, but computing a distance squares them. You saw this on screen five.') },
        ],
        solution: [L('masofa saqlanadi', 'расстояние сохраняется', 'distance is preserved')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — noto'g'ri koordinata.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tik o'q qaysi koordinatani almashtiradi",
    'Какую координату меняет вертикальная ось',
    'Which coordinate a vertical axis flips',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Nuqta ikki uch, o'q esa Oy. U aksni ikki minus uch deb yozgan.",
      'Решение Камрона. Точка два три, ось Oy. Он записал образ как два минус три.',
      "Kamron's solution. The point is two three and the axis is Oy. He wrote the image as two minus three."),
    A('why',
      "Uning fikricha, Oy o'qi y ni almashtiradi. Chizmaga qarab tekshiring.",
      'По его мысли, ось Oy меняет y. Проверь по чертежу.',
      'He reasoned that the Oy axis changes y. Check it on the drawing.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Nomdagi harf o'qning o'zini ataydi, u o'zgaradigan koordinatani emas. Oy o'qi TIK turadi va nuqtani chapdan o'ngga o'tkazadi, ya'ni x ni almashtiradi. Bu xatoni yodlash bilan emas, o'qning yo'nalishiga qarab yengish kerak.",
      'Буква в названии называет саму ось, а не ту координату, что меняется. Ось Oy стоит ВЕРТИКАЛЬНО и переносит точку слева направо, то есть меняет x. Эту ошибку побеждают не заучиванием, а взглядом на направление оси.',
      'The letter in the name names the axis itself, not the coordinate that changes. The Oy axis stands UPRIGHT and carries the point from left to right, flipping x. The cure is looking at the axis direction, not memorising.',
    ),
    tasks: [
      {
        expr: 'A(2; 3),   Oy   →   (2; −3) ?',
        question: L(
          "Oy o'qi qaysi tomonga yo'nalgan va nuqtani qayerga o'tkazadi?",
          'Куда направлена ось Oy и куда она переносит точку?',
          'Which way does the Oy axis run and where does it carry the point?',
        ),
        ok: L(
          "To'g'ri. Oy tik turadi, nuqta esa uning narigi tomoniga, ya'ni chapga o'tadi. Javob minus ikki uch.",
          'Верно. Oy стоит вертикально, и точка переходит на другую её сторону, то есть влево. Ответ минус два три.',
          'Correct. Oy stands upright and the point crosses to its other side, to the left. The answer is minus two three.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Tik turadi, nuqtani chapga o'tkazadi", 'Стоит вертикально, переносит точку влево', 'It stands upright and carries the point left'),
          },
          {
            id: 'b',
            label: L("Yotiq turadi, nuqtani pastga o'tkazadi", 'Лежит горизонтально, переносит точку вниз', 'It lies flat and carries the point down'),
            hint: L(
              "Oy o'qi ordinatalar o'qi, u yuqoriga qarab yo'nalgan. Yotiq turadigani Ox, ya'ni abssissalar o'qi.",
              'Ось Oy это ось ординат, она направлена вверх. Горизонтально лежит Ox, ось абсцисс.',
              'The Oy axis is the axis of ordinates and points upward. The horizontal one is Ox, the axis of abscissas.',
            ),
          },
        ],
        solution: [
          'Oy:  x → −x',
          '(2; 3) → (−2; 3)',
          L('Kamron: (2; −3)', 'Камрон: (2; −3)', 'Kamron: (2; −3)'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — markaziy simmetriya va burish.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ikkita ta'rif, bitta almashtirish",
    'Два определения, одно преобразование',
    'Two definitions, one transformation',
  ),
  audio: [
    A('mount',
      "Markaziy simmetriyada nuqta markazdan o'tib, teng masofaga tushadi. Burishda esa nuqta markaz atrofida aylanadi.",
      'При центральной симметрии точка проходит через центр на равное расстояние. А при повороте точка вращается вокруг центра.',
      'In a central symmetry a point passes through the centre at an equal distance. In a rotation a point turns about the centre.'),
    A('why',
      "Nuqtani markaz atrofida bir yuz sakson gradusga bursak, u qayerga tushadi?",
      'Если повернуть точку вокруг центра на сто восемьдесят градусов, куда она попадёт?',
      'If a point turns one hundred eighty degrees about the centre, where does it land?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkita boshqa ta'rif bitta va o'sha almashtirishni beradi. Bunday hollarda ikkinchi ta'rifni yodlash shart emas, uni birinchisidan ko'rish yetarli.",
      'Два разных определения дают одно и то же преобразование. В таких случаях второе не нужно заучивать, достаточно увидеть его в первом.',
      'Two different definitions give one and the same transformation. In such cases the second needs no memorising, only recognising in the first.',
    ),
    tasks: [
      {
        expr: '180°',
        question: L(
          "Markaz atrofida 180 gradusga burish qaysi almashtirish bilan bir xil?",
          'С каким преобразованием совпадает поворот на 180 градусов вокруг центра?',
          'Which transformation matches a 180 degree rotation about the centre?',
        ),
        ok: L(
          "To'g'ri, markaziy simmetriya bilan. Nuqta markazdan o'tib, narigi tomonga teng masofada tushadi.",
          'Верно, с центральной симметрией. Точка проходит через центр и попадает на равное расстояние с другой стороны.',
          'Correct, the central symmetry. The point passes through the centre and lands at an equal distance beyond.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('Markaziy simmetriya', 'Центральная симметрия', 'A central symmetry'),
          },
          {
            id: 'b',
            label: L("O'qqa nisbatan simmetriya", 'Осевая симметрия', 'An axial symmetry'),
            hint: L(
              "O'qqa nisbatan simmetriyada nuqta CHIZIQNING narigi tomoniga o'tadi va figura ko'zgudagidek teskari bo'ladi. Burishda esa figura teskari bo'lmaydi, u shunchaki aylanadi.",
              'При осевой симметрии точка переходит на другую сторону ПРЯМОЙ, и фигура становится зеркальной. А при повороте фигура не зеркалится, она просто вращается.',
              'In an axial symmetry a point crosses a LINE and the figure becomes mirrored. A rotation does not mirror the figure, it merely turns it.',
            ),
          },
        ],
        solution: [
          L('180 gradus burish', 'поворот на 180 градусов', 'a 180 degree turn'),
          L('markaziy simmetriya', 'центральная симметрия', 'a central symmetry'),
        ],
      },
      {
        expr: 'A(3; 5),   O(0; 0)',
        question: L(
          "180 gradusga burgandan keyin nuqta qayerda bo'ladi?",
          'Где окажется точка после поворота на 180 градусов?',
          'Where does the point end up after a 180 degree turn?',
        ),
        ok: L(
          "Ha, minus uch minus besh. Bu markaziy simmetriyaning javobi bilan bir xil.",
          'Да, минус три минус пять. Это тот же ответ, что и у центральной симметрии.',
          'Yes, minus three minus five. The same answer as the central symmetry gives.',
        ),
        items: [
          { id: 'a', right: true, label: '(−3; −5)' },
          {
            id: 'b',
            label: '(5; 3)',
            hint: L(
              "Koordinatalarning o'rin almashishi to'qson gradusga burishda bo'ladi. Bir yuz saksonda esa nuqta to'g'ri qarama-qarshi tomonga o'tadi.",
              'Перестановка координат бывает при повороте на девяносто градусов. А при ста восьмидесяти точка уходит прямо в противоположную сторону.',
              'Swapping coordinates happens in a ninety degree turn. At one hundred eighty the point goes straight to the opposite side.',
            ),
          },
        ],
        solution: ['(x; y) → (−x; −y)', '(3; 5) → (−3; −5)'],
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
    "Blits: masofa, o'q, markaz",
    'Блиц: расстояние, ось, центр',
    'Blitz: distance, axis, centre',
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
        tag: 'harakat-emasni-harakat',
        ask: L(
          "Almashtirish harakat bo'lishi uchun nima saqlanishi kerak?",
          'Что должно сохраняться, чтобы преобразование было движением?',
          'What must be preserved for a transformation to be a motion?',
        ),
        options: [
          { id: 'd', right: true, label: L('Masofa', 'Расстояние', 'Distance') },
          { id: 's', label: L('Faqat shakl', 'Только форма', 'The shape alone') },
        ],
        ok: L(
          "To'g'ri. Shakl o'xshashlikda ham saqlanadi, lekin u harakat emas.",
          'Верно. Форма сохраняется и при подобии, но движением оно не является.',
          'Correct. Similarity preserves shape too, yet it is no motion.',
        ),
        hint: L(
          "1-ekranni eslang: uchburchak ikki barobar kattargandi, shakli esa o'zgarmagandi.",
          'Вспомни 1 экран: треугольник вырос вдвое, а форма не изменилась.',
          'Recall screen 1: the triangle doubled while its shape stayed.',
        ),
      },
      {
        id: 'q2',
        tag: 'qaysi-koordinata-almashadi',
        ask: L(
          "Ox o'qiga nisbatan simmetriyada qaysi koordinata almashadi?",
          'Какая координата меняется при симметрии относительно оси Ox?',
          'Which coordinate flips under symmetry about Ox?',
        ),
        options: [
          { id: 'y', right: true, label: L('Ordinata', 'Ордината', 'The ordinate') },
          { id: 'x', label: L('Abssissa', 'Абсцисса', 'The abscissa') },
        ],
        ok: L(
          "To'g'ri. Ox yotiq turadi, nuqta esa yuqoridan pastga o'tadi.",
          'Верно. Ox лежит горизонтально, и точка переходит сверху вниз.',
          'Correct. Ox lies flat and the point crosses from above to below.',
        ),
        hint: L(
          "12-ekranni eslang: nomdagi harf o'qni ataydi, o'zgaradigan koordinatani emas.",
          'Вспомни 12 экран: буква в названии называет ось, а не изменяемую координату.',
          'Recall screen 12: the letter names the axis, not the coordinate that changes.',
        ),
      },
      {
        id: 'q3',
        tag: 'markaz-ortasi-emas',
        ask: L(
          "Simmetriya markazi kesmaning qayerida turadi?",
          'Где на отрезке находится центр симметрии?',
          'Where on the segment does the centre of symmetry sit?',
        ),
        options: [
          { id: 'mid', right: true, label: L("O'rtasida", 'В середине', 'At the midpoint') },
          { id: 'end', label: L('Chetida', 'На краю', 'At an end') },
        ],
        ok: L(
          "To'g'ri. Shuning uchun markazning koordinatalari o'rta arifmetik bilan topiladi.",
          'Верно. Поэтому координаты центра находятся средним арифметическим.',
          'Correct. That is why the centre coordinates come from the arithmetic mean.',
        ),
        hint: L(
          "10-ekranni eslang: bir va beshning o'rtasi uch bo'lgandi.",
          'Вспомни 10 экран: серединой между одним и пятью была тройка.',
          'Recall screen 10: the midpoint of one and five was three.',
        ),
      },
      {
        id: 'q4',
        tag: 'nima-saqlanadi',
        ask: L(
          "Harakatda figuraning yuzi o'zgaradimi?",
          'Меняется ли площадь фигуры при движении?',
          'Does a figure area change under a motion?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Barcha uzunliklar saqlanadi, demak yuz ham.",
          'Верно. Все длины сохраняются, значит и площадь.',
          'Correct. Every length survives, so the area does too.',
        ),
        hint: L(
          "7-ekranni eslang: harakat figurani ko'chiradi, lekin cho'zmaydi.",
          'Вспомни 7 экран: движение переносит фигуру, но не растягивает.',
          'Recall screen 7: a motion moves a figure without stretching it.',
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
    "Masofa saqlansa, bu harakat",
    'Сохранилось расстояние — это движение',
    'Distance preserved means a motion',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda kattalashtirilgan uchburchak harakat bermadi, chunki masofalar o'zgardi.",
      'На первом экране увеличенный треугольник движением не оказался, ведь расстояния изменились.',
      'On the first screen the enlarged triangle was no motion, since the distances changed.'),
    A('s1',
      "Siz uchta harakatni ko'rdingiz va ularning koordinatalardagi ko'rinishini bildingiz: tik o'q abssissani, yotiq o'q ordinatani, markaz esa ikkalasini almashtiradi.",
      'Ты увидел три движения и узнал их запись в координатах: вертикальная ось меняет абсциссу, горизонтальная ординату, а центр обе.',
      'You saw three motions and their coordinate form: a vertical axis flips the abscissa, a horizontal one the ordinate, and a centre flips both.'),
    A('s2',
      "Keyingi darsda ichki chizilgan burchaklar.",
      'В следующем уроке вписанные углы.',
      'The next lesson covers inscribed angles.'),
  ],
  props: {
    mark: '(x; y) → (−x; −y)',
    markNote: L(
      "markaziy simmetriya, ya'ni 180 gradusga burish",
      'центральная симметрия, то есть поворот на 180 градусов',
      'a central symmetry, that is a 180 degree turn',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: ichki chizilgan burchaklar',
      'Следующий урок: вписанные углы',
      'Next lesson: inscribed angles',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'harakat-emasni-harakat', ...S2 },
  { role: 'explain',  tag: 'harakat-emasni-harakat', ...S3 },
  { role: 'explain',  tag: 'qaysi-koordinata-almashadi', ...S4 },
  { role: 'explain',  tag: 'harakat-emasni-harakat', ...S5 },
  { role: 'explain',  tag: 'markaz-ortasi-emas', ...S6 },
  { role: 'explain',  tag: 'nima-saqlanadi', ...S7 },
  { role: 'rule',     tag: 'harakat-emasni-harakat', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'qaysi-koordinata-almashadi', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'markaz-ortasi-emas', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'harakat-emasni-harakat', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'qaysi-koordinata-almashadi', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'nima-saqlanadi', ...S13 },
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
