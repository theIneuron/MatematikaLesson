// ============================================================================
// 9-sinf, Dars 43. IKKI VEKTOR ORASIDAGI BURCHAK VA SKALYAR KO'PAYTMA.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 31-dars (90-91-bet).
//   Burchak (90-bet): nolinchi bo'lmagan a va b vektorlar bitta O
//       nuqtadan qo'yiladi, AOB burchak ular orasidagi burchak deyiladi.
//       Bir xil yo'nalgan vektorlar orasidagi burchak nolga teng.
//   Ta'rif (90-bet): (a, b) = |a| · |b| · cos φ. Vektorlardan biri nol
//       bo'lsa, ko'paytma ham nol.
//   Alomat (90-bet): (a, b) = 0 bo'lishi bilan perpendikulyarlik bir xil.
//   Fizika (90-bet): F kuch jismni s masofaga siljitganda bajarilgan
//       ish A = |F| · |s| · cos φ.
//   Xossa (90-bet): (a, b) = a₁b₁ + a₂b₂ va u KOSINUSLAR TEOREMASI
//       bilan isbotlanadi.
//   31.1: a) 4 · 5 · cos30° = 10√3;  b) 8 · 7 · cos45° = 28√2;
//       d) 2,4 · 10 · cos60° = 12.
//   31.2: a) (0,5; −1) va (2; 3) → −2;  b) (−5; 6) va (6; 5) → 0;
//       d) (1,5; 2) va (4; −2) → 2.
//   31.3: ABCD romb, BD = AB = 4 → ABD teng tomonli, ∠A = 60°,
//       AB · AD = 8; diagonallar perpendikulyar, OC · OD = 0.
//   31.5: a) 4x + 30 = 0 → x = −7,5;  d) −3x = 0 → x = 0.
//   31.6: a(3;3), b(2;−2), c(−1;−4), d(−4;1) → perpendikulyar juftlar
//       a bilan b va c bilan d.
//
// BU MAVZU 8-SINFDA BOR, LEKIN BOSHQA TOMONIDAN. 8-sinfning 55-darsi
// skalyar ko'paytmani KOORDINATALAR orqali beradi: x₁x₂ + y₁y₂, natija
// son. U yerda formula ISHLAYDI, lekin nega ishlashi va nimani
// bildirishi ochilmagan. Bugungi dars ikkinchi tomonini beradi:
// ta'rif BURCHAK orqali, ko'paytmaning ishorasi, perpendikulyarlik
// alomati va fizik ma'no. Ikkala tomon 48-darsda uchrashadi —
// koordinatali formula kosinuslar teoremasidan aynan o'sha yerda
// chiqariladi, chunki bugun kosinuslar teoremasi hali yo'q.
//
// XUK shu bo'shliqni ko'rsatadi: a(−5; 6) va b(6; 5) uchun 8-sinf
// formulasi nol beradi. Nol nimani anglatadi degan savolga esa
// 8-sinf javob bermagan edi.
//
// TUZOQ (12-ekran): sonlardagi qoidani vektorlarga ko'chirish. Sonlarda
// ko'paytma nolga teng bo'lsa, ko'paytuvchilardan biri albatta nol.
// Vektorlarda esa ikkala vektor ham noldan farqli bo'lib, ko'paytma
// nol bo'lishi mumkin — bu perpendikulyarlikni bildiradi.
//
// TRANSFER (13-ekran) — 31.3: romb, koordinatalarsiz. Tomoni va kichik
// diagonali 4 ga teng, demak ABD teng tomonli va A burchagi 60 daraja.
// Bu yerda burchak CHIZMADAN olinadi, koordinatadan emas — ya'ni
// ta'rifning o'zi ishlaydi.
//
// CHIZMA: yangi `AngleFig` (7J) — asbob emas, chizma: bitta nuqtadan
// chiqqan ikkita vektor, ixtiyoriy o'qlar va burchak yoyi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { AngleFig, G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-43',
  n: 43,
  row: 43,
  block: 'Б7',
  topic: L(
    "Ikki vektor orasidagi burchak va skalyar ko'paytma",
    'Угол между векторами и скалярное произведение',
    'The angle between vectors and the scalar product',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Vektorlar orasidagi burchak ularni bitta nuqtadan qo'yganda o'lchanadi",
    'Угол между векторами измеряют, отложив их от одной точки',
    'The angle between vectors is measured after placing them at one point',
  ),
  L(
    "Skalyar ko'paytma uzunliklar va burchak kosinusining ko'paytmasiga teng",
    'Скалярное произведение равно произведению длин на косинус угла',
    'The scalar product is the product of the lengths and the cosine of the angle',
  ),
  L(
    "Nolga teng ko'paytma perpendikulyarlikni bildiradi, nol vektorni emas",
    'Произведение, равное нулю, означает перпендикулярность, а не нулевой вектор',
    'A product equal to zero means perpendicularity, not a zero vector',
  ),
]

export const MISS = {
  'nol-kopaytma-nol-vektor': {
    what: L(
      "ko'paytma nol bo'lsa vektorlardan biri nol deb o'ylandi",
      'решено, что при нулевом произведении один из векторов нулевой',
      'a zero product was taken to mean one vector is zero',
    ),
    wrong: null,
    at: 0,
  },
  'burchak-umumiy-nuqtasiz': {
    what: L(
      "vektorlar bitta nuqtaga qo'yilmasdan burchak o'lchandi",
      'угол измерен без приведения векторов к общей точке',
      'the angle was measured without bringing the vectors to a common point',
    ),
    wrong: null,
    at: 0,
  },
  'ishorani-yoqotish': {
    what: L(
      "o'tmas burchakda ko'paytmaning manfiy ishorasi hisobga olinmadi",
      'при тупом угле упущен отрицательный знак произведения',
      'the minus sign of the product at an obtuse angle was dropped',
    ),
    wrong: null,
    at: 0,
  },
  'natija-vektor-deb-olish': {
    what: L(
      "skalyar ko'paytmaning natijasi vektor deb olindi",
      'результат скалярного произведения принят за вектор',
      'the result of the scalar product was taken to be a vector',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — nol chiqdi, ma'nosi noma'lum.
// ============================================================
const S1 = {
  eyebrow: L('NOL CHIQDI', 'ПОЛУЧИЛСЯ НОЛЬ', 'THE ANSWER IS ZERO'),
  title: L(
    "Formula ishladi, ma'nosi esa aytilmadi",
    'Формула сработала, а смысл не назван',
    'The formula worked, the meaning went unsaid',
  ),
  audio: [
    A('mount',
      "Ikkita vektor: birinchisining koordinatalari minus besh va olti, ikkinchisiniki olti va besh.",
      'Два вектора: у первого координаты минус пять и шесть, у второго шесть и пять.',
      'Two vectors: the first has coordinates minus five and six, the second six and five.'),
    A('why',
      "8-sinfning formulasi bo'yicha ko'paytma minus o'ttiz qo'shuv o'ttiz, ya'ni nol. Lekin nol nimani bildiradi.",
      'По формуле 8 класса произведение минус тридцать плюс тридцать, то есть ноль. Но что означает ноль.',
      'By the formula of grade eight the product is minus thirty plus thirty, that is zero. But what does zero mean.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <AngleFig
          vecs={[{ x: -5, y: 6, label: 'a' }, { x: 6, y: 5, label: 'b' }]}
          axes
          arc
          arcLab="?"
        />
      }
      steps={[]}
      ask={L(
        "Nol natija bu vektorlar haqida nima aytadi?",
        'Что говорит нулевой результат об этих векторах?',
        'What does a zero result say about these vectors?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Ular orasidagi burchak haqida biror narsa aytadi",
            'Что то говорит об угле между ними',
            'It says something about the angle between them',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Vektorlardan biri nol vektor",
            'Один из векторов нулевой',
            'One of the vectors is the zero vector',
          ),
          hint: L(
            "Ikkala vektorning ham koordinatalari noldan farqli, uzunliklari ham noldan katta. Demak sabab boshqa joyda.",
            'У обоих векторов координаты не нулевые и длины больше нуля. Значит причина в другом.',
            'Both vectors have non zero coordinates and positive lengths. So the reason lies elsewhere.',
          ),
        },
      ]}
      after={L(
        "Ha. 8-sinfda bu formula ishlagan, lekin ma'nosi ochilmagan edi. Bugun ta'rifni burchak orqali beramiz va nol nimani bildirishini bilamiz.",
        'Да. В 8 классе формула работала, но смысл не раскрывался. Сегодня дадим определение через угол и узнаем, что означает ноль.',
        'Yes. In grade eight the formula worked but its meaning stayed closed. Today we define it through the angle and learn what zero means.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — 8-sinf formulasi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Natija son, vektor emas",
    'Результат число, а не вектор',
    'The result is a number, not a vector',
  ),
  audio: [
    A('mount',
      "8-sinfda skalyar ko'paytma koordinatalar orqali berilgandi: mos koordinatalar ko'paytiriladi va qo'shiladi.",
      'В 8 классе скалярное произведение задавалось через координаты: соответственные координаты умножают и складывают.',
      'In grade eight the scalar product came through coordinates: multiply matching coordinates and add.'),
    A('why',
      "Uning nomi ham shundan: skalyar degani son degani.",
      'Отсюда и название: скаляр значит число.',
      'Hence the name: a scalar is a number.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a(3; 4)   va   b(2; 1)', 'a(3; 4)   и   b(2; 1)', 'a(3; 4)   and   b(2; 1)')}
      steps={[
        { id: 'a', head: L('Hisob', 'Счёт', 'The count'), lines: ['3 · 2 + 4 · 1'] },
      ]}
      ask={L(
        "Natija nima bo'ladi?",
        'Чем будет результат?',
        'What will the result be?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('10, ya\'ni son', '10, то есть число', '10, that is a number') },
        {
          id: 'wrong',
          label: L('Vektor (6; 4)', 'Вектор (6; 4)', 'The vector (6; 4)'),
          hint: L(
            "Koordinatalar ko'paytirilgandan keyin ular QO'SHILADI, ya'ni bitta son qoladi. Vektor qolmaydi.",
            'После умножения координаты СКЛАДЫВАЮТСЯ, то есть остаётся одно число. Вектора не остаётся.',
            'After multiplying, the coordinates are ADDED, so one number is left. No vector remains.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, o'n. Bugun shu songa geometrik ma'no beramiz.",
        'Верно, десять. Сегодня придадим этому числу геометрический смысл.',
        'Correct, ten. Today we give that number a geometric meaning.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — burchak qanday o'lchanadi.
// ============================================================
const S3 = {
  eyebrow: L('BITTA NUQTADAN', 'ИЗ ОДНОЙ ТОЧКИ', 'FROM ONE POINT'),
  title: L(
    "Vektorlarni avval yig'ish kerak",
    'Векторы сначала сводят вместе',
    'The vectors are brought together first',
  ),
  audio: [
    A('mount',
      "Ikkita vektor tekislikning turli joylarida turishi mumkin. Ular orasidagi burchakni o'lchash uchun avval bitta nuqtaga qo'yiladi.",
      'Два вектора могут стоять в разных местах плоскости. Чтобы измерить угол между ними, их сначала откладывают от одной точки.',
      'Two vectors may sit anywhere on the plane. To measure the angle between them, they are first placed at one point.'),
    A('why',
      "Vektorning o'rni muhim emas, faqat yo'nalishi va uzunligi muhim.",
      'Место вектора не важно, важны только направление и длина.',
      'Where a vector sits does not matter, only its direction and length.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <AngleFig
          vecs={[{ x: 6, y: 1, label: 'a' }, { x: 2, y: 5, label: 'b' }]}
          arc
          arcLab="φ"
        />
      }
      steps={[]}
      ask={L(
        "Ikkita vektor bir xil yo'nalgan bo'lsa, ular orasidagi burchak nechaga teng?",
        'Чему равен угол между сонаправленными векторами?',
        'What is the angle between vectors pointing the same way?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0°' },
        {
          id: 'wrong',
          label: '180°',
          hint: L(
            "Bir yuz sakson daraja qarama-qarshi yo'nalgan vektorlarga tegishli. Bir xil yo'nalganlarida esa ular ustma ust tushadi.",
            'Сто восемьдесят градусов относится к противоположно направленным. У сонаправленных они ложатся друг на друга.',
            'One hundred eighty belongs to opposite directions. Same direction means they lie on top of each other.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, nol. Qarama-qarshi yo'nalganlarida bir yuz sakson, perpendikulyar bo'lganda esa to'qson daraja.",
        'Верно, ноль. У противоположно направленных сто восемьдесят, а у перпендикулярных девяносто градусов.',
        'Correct, zero. Opposite directions give one hundred eighty, and perpendicular ones ninety degrees.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — ta'rif.
// ============================================================
const S4 = {
  eyebrow: L('TA\'RIF', 'ОПРЕДЕЛЕНИЕ', 'THE DEFINITION'),
  title: L(
    "Uzunliklar va burchak kosinusi",
    'Длины и косинус угла',
    'The lengths and the cosine',
  ),
  audio: [
    A('mount',
      "Skalyar ko'paytma deb vektorlar uzunliklarining va ular orasidagi burchak kosinusining ko'paytmasiga aytiladi.",
      'Скалярным произведением называют произведение длин векторов на косинус угла между ними.',
      'The scalar product is the product of the vector lengths and the cosine of the angle between them.'),
    A('why',
      "Endi koordinatalar umuman kerak emas, uzunlik va burchak yetadi.",
      'Теперь координаты вовсе не нужны, хватает длины и угла.',
      'Now no coordinates are needed at all, a length and an angle suffice.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('(a, b) = |a| · |b| · cos φ', '(a, b) = |a| · |b| · cos φ', '(a, b) = |a| · |b| · cos φ')}
      steps={[
        { id: 'a', head: L('Berilgan', 'Дано', 'Given'), lines: ['|a| = 2,4', '|b| = 10', 'φ = 60°'] },
      ]}
      ask={L(
        "Skalyar ko'paytma nechaga teng?",
        'Чему равно скалярное произведение?',
        'What does the scalar product equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '12' },
        {
          id: 'wrong',
          label: '24',
          hint: L(
            "Yigirma to'rt bu faqat uzunliklarning ko'paytmasi. Uni yana oltmish darajaning kosinusiga, ya'ni bir ikkidanga ko'paytirish kerak.",
            'Двадцать четыре это только произведение длин. Его ещё нужно умножить на косинус шестидесяти, то есть на одну вторую.',
            'Twenty four is only the product of the lengths. It must still be multiplied by the cosine of sixty, that is one half.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning o'ttiz bir nuqta birinchi mashqi, uchinchi bandi.",
        'Верно. Это задача тридцать один точка один учебника, третий пункт.',
        'Correct. This is exercise thirty one point one, the third item.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — ishora.
// ============================================================
const S5 = {
  eyebrow: L('ISHORA', 'ЗНАК', 'THE SIGN'),
  title: L(
    "Ishorani burchak boshqaradi",
    'Знаком управляет угол',
    'The angle rules the sign',
  ),
  audio: [
    A('mount',
      "Uzunliklar har doim musbat. Demak ko'paytmaning ishorasi faqat kosinusdan keladi.",
      'Длины всегда положительны. Значит знак произведения приходит только от косинуса.',
      'Lengths are always positive. So the sign of the product comes only from the cosine.'),
    A('why',
      "O'tkir burchakda kosinus musbat, o'tmas burchakda esa manfiy.",
      'При остром угле косинус положителен, при тупом отрицателен.',
      'For an acute angle the cosine is positive, for an obtuse one negative.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <AngleFig
          vecs={[{ x: 6, y: 1, label: 'a' }, { x: -4, y: 4, label: 'b' }]}
          arc
          arcLab="φ"
        />
      }
      steps={[]}
      ask={L(
        "Burchak o'tmas bo'lsa, ko'paytma qanday bo'ladi?",
        'Каким будет произведение при тупом угле?',
        'What is the product when the angle is obtuse?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Manfiy', 'Отрицательным', 'Negative') },
        {
          id: 'wrong',
          label: L('Musbat', 'Положительным', 'Positive'),
          hint: L(
            "To'qson darajadan katta burchaklarning kosinusi manfiy edi. Manfiyga ko'paytirilgan musbat son manfiy bo'ladi.",
            'Косинус углов больше девяноста был отрицательным. Положительное число, умноженное на отрицательное, даёт отрицательное.',
            'The cosine of angles above ninety was negative. A positive number times a negative one is negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ishora vektorlarning bir tomonga qarayotganini yoki qarama-qarshi tomonga qarayotganini ko'rsatadi.",
        'Верно. Знак показывает, смотрят ли векторы в одну сторону или в разные.',
        'Correct. The sign shows whether the vectors look the same way or opposite ways.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — perpendikulyarlik alomati.
// ============================================================
const S6 = {
  eyebrow: L('XUKKA JAVOB', 'ОТВЕТ НА ХУК', 'ANSWERING THE HOOK'),
  title: L(
    "Nol bu to'qson daraja",
    'Ноль это девяносто градусов',
    'Zero means ninety degrees',
  ),
  audio: [
    A('mount',
      "Endi birinchi ekranning savoliga javob beramiz. Ko'paytma nolga teng bo'lsin.",
      'Теперь ответим на вопрос первого экрана. Пусть произведение равно нулю.',
      'Now we answer the question of the first screen. Let the product be zero.'),
    A('why',
      "Uzunliklar noldan farqli, demak nolga aylanadigan yagona ko'paytuvchi kosinus.",
      'Длины не равны нулю, значит обратиться в ноль может только косинус.',
      'The lengths are not zero, so the only factor that can vanish is the cosine.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <AngleFig
          vecs={[{ x: -5, y: 6, label: 'a' }, { x: 6, y: 5, label: 'b' }]}
          axes
          arc
          arcLab="90°"
        />
      }
      steps={[
        { id: 'a', head: L('Shart', 'Условие', 'The condition'), lines: ['|a| · |b| · cos φ = 0', 'cos φ = 0'] },
      ]}
      ask={L(
        "Bunday burchak nechaga teng?",
        'Чему равен такой угол?',
        'What does such an angle equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '90°' },
        {
          id: 'wrong',
          label: '0°',
          hint: L(
            "Nol darajaning kosinusi birga teng, nolga emas. Kosinus aynan to'qson darajada nolga aylanadi.",
            'Косинус нуля равен единице, а не нулю. Косинус обращается в ноль именно при девяноста градусах.',
            'The cosine of zero is one, not zero. The cosine vanishes exactly at ninety degrees.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Xukdagi vektorlar perpendikulyar ekan. Bu alomat teskari tomonga ham ishlaydi: perpendikulyar bo'lsa, ko'paytma albatta nol.",
        'Верно. Векторы из хука оказались перпендикулярны. Признак работает и обратно: если перпендикулярны, произведение обязательно ноль.',
        'Correct. The vectors from the hook are perpendicular. The criterion also works backwards: perpendicular vectors always give zero.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — fizika.
// ============================================================
const S7 = {
  eyebrow: L('FIZIKADA', 'В ФИЗИКЕ', 'IN PHYSICS'),
  title: L(
    "Nega sumkani ko'tarib yurish ish emas",
    'Почему нести сумку не работа',
    'Why carrying a bag is not work',
  ),
  audio: [
    A('mount',
      "Fizikada kuch jismni siljitganda bajarilgan ish kuch va siljish vektorlarining skalyar ko'paytmasiga teng.",
      'В физике работа силы при перемещении тела равна скалярному произведению векторов силы и перемещения.',
      'In physics the work of a force equals the scalar product of the force and the displacement.'),
    A('why',
      "Sumkani qo'lda ko'tarib yurganda kuch yuqoriga, siljish esa oldinga yo'nalgan.",
      'Когда несёшь сумку в руке, сила направлена вверх, а перемещение вперёд.',
      'Carrying a bag in your hand, the force points up and the displacement forward.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <AngleFig
          vecs={[{ x: 0, y: 6, label: 'F' }, { x: 6, y: 0, label: 's' }]}
          arc
          arcLab="90°"
        />
      }
      steps={[]}
      ask={L(
        "Bunday holatda bajarilgan ish nechaga teng?",
        'Чему равна работа в таком случае?',
        'What is the work done in that case?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0' },
        {
          id: 'wrong',
          label: L("Kuchning uzunligiga teng", 'Равна длине силы', 'Equal to the length of the force'),
          hint: L(
            "Kuch va siljish perpendikulyar, ya'ni kosinus nolga teng. Nolga ko'paytirilgan har qanday son nol beradi.",
            'Сила и перемещение перпендикулярны, то есть косинус равен нулю. Любое число, умноженное на ноль, даёт ноль.',
            'Force and displacement are perpendicular, so the cosine is zero. Any number times zero is zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, nol. Charchash bor, fizik ma'nodagi ish esa yo'q. Skalyar ko'paytma aynan shu farqni o'lchaydi.",
        'Верно, ноль. Усталость есть, а работы в физическом смысле нет. Скалярное произведение измеряет именно эту разницу.',
        'Correct, zero. There is tiredness but no work in the physical sense. The scalar product measures exactly that difference.',
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
    'Geometriya 9, 31-dars (90-91-bet)',
    'Геометрия 9, урок 31 (стр. 90-91)',
    'Geometry 9, lesson 31 (p. 90-91)',
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
          "Skalyar ko'paytmani hisoblash uchun koordinatalar shartmi?",
          'Обязательны ли координаты, чтобы посчитать скалярное произведение?',
          'Are coordinates required to compute a scalar product?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Yo'q: uzunliklar va burchak yetadi",
              'Нет: хватает длин и угла',
              'No: the lengths and the angle suffice',
            ),
          },
          {
            id: 'wrong',
            label: L('Ha, koordinatasiz hisoblab bo\'lmaydi', 'Да, без координат не посчитать', 'Yes, without coordinates it cannot be done'),
            hint: L(
              "4-ekranni eslang: u yerda koordinata umuman berilmagandi, faqat ikki butun to'rt o'ndan, o'n va oltmish daraja.",
              'Вспомни 4 экран: там координат не было вовсе, только две целых четыре десятых, десять и шестьдесят градусов.',
              'Recall screen 4: no coordinates at all, only two point four, ten and sixty degrees.',
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
    "Ikkinchi tomondan qaralgan formula",
    'Формула с другой стороны',
    'The formula seen from the other side',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz 8-sinfdagi formulaning geometrik ma'nosini oldingiz.",
      'На семи экранах ты получил геометрический смысл формулы из 8 класса.',
      'On seven screens you gained the geometric meaning of the grade eight formula.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — uzunlik va burchak.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Koordinatasiz hisob",
    'Счёт без координат',
    'Computing without coordinates',
  ),
  audio: [
    A('mount',
      "Uchta masala. Har birida ikkita uzunlik va ular orasidagi burchak berilgan.",
      'Три задачи. В каждой даны две длины и угол между ними.',
      'Three problems. Each gives two lengths and the angle between them.'),
    A('why',
      "Darslikning o'ttiz bir nuqta birinchi mashqi.",
      'Задача тридцать один точка один учебника.',
      'Exercise thirty one point one.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hisoblandi. Javob ildizli chiqishi normal: kosinus har doim ham chiroyli son bermaydi, formula esa o'zgarmaydi.",
      'Все три посчитаны. Ответ с корнем это нормально: косинус не всегда даёт красивое число, а формула не меняется.',
      'All three are computed. A root in the answer is normal: the cosine is not always tidy, while the formula stays the same.',
    ),
    tasks: [
      {
        expr: '|a| = 4,   |b| = 5,   φ = 30°',
        question: L(
          "Skalyar ko'paytma nechaga teng?",
          'Чему равно скалярное произведение?',
          'What does the scalar product equal?',
        ),
        ok: L(
          "Ha. Yigirma karra uchning ildizini ikkiga bo'lgan, ya'ni o'n karra uchning ildizi.",
          'Да. Двадцать на корень из трёх пополам, то есть десять корней из трёх.',
          'Yes. Twenty times root three over two, that is ten root three.',
        ),
        items: [
          { id: 'a', right: true, label: '10√3' },
          { id: 'b', label: '20', hint: L("Yigirma bu faqat uzunliklarning ko'paytmasi. Uni o'ttiz darajaning kosinusiga ham ko'paytirish kerak.", 'Двадцать это только произведение длин. Его нужно ещё умножить на косинус тридцати.', 'Twenty is only the product of the lengths. It must also be multiplied by the cosine of thirty.') },
        ],
        solution: ['4 · 5 · cos 30°', '20 · √3/2 = 10√3'],
      },
      {
        expr: '|a| = 8,   |b| = 7,   φ = 45°',
        question: L(
          "Skalyar ko'paytma nechaga teng?",
          'Чему равно скалярное произведение?',
          'What does the scalar product equal?',
        ),
        ok: L(
          "Ha. Ellik olti karra ikkining ildizini ikkiga bo'lgan, ya'ni yigirma sakkiz karra ikkining ildizi.",
          'Да. Пятьдесят шесть на корень из двух пополам, то есть двадцать восемь корней из двух.',
          'Yes. Fifty six times root two over two, that is twenty eight root two.',
        ),
        items: [
          { id: 'a', right: true, label: '28√2' },
          { id: 'b', label: '56√2', hint: L("Ellik oltini ikkiga bo'lishni unutdingiz: qirq besh darajaning kosinusi ikkining ildizini ikkiga bo'lganga teng.", 'Ты забыл разделить пятьдесят шесть на два: косинус сорока пяти это корень из двух пополам.', 'You forgot to halve fifty six: the cosine of forty five is root two over two.') },
        ],
        solution: ['8 · 7 · cos 45°', '56 · √2/2 = 28√2'],
      },
      {
        expr: '|a| = 6,   |b| = 3,   φ = 120°',
        question: L(
          "Skalyar ko'paytma nechaga teng?",
          'Чему равно скалярное произведение?',
          'What does the scalar product equal?',
        ),
        ok: L(
          "Ha, minus to'qqiz. Burchak o'tmas, demak natija manfiy.",
          'Да, минус девять. Угол тупой, значит результат отрицательный.',
          'Yes, minus nine. The angle is obtuse, so the result is negative.',
        ),
        items: [
          { id: 'a', right: true, label: '−9' },
          { id: 'b', label: '9', hint: L("Bir yuz yigirma darajaning kosinusi manfiy bir ikkidanga teng. Manfiy ko'paytuvchi javobni ham manfiy qiladi.", 'Косинус ста двадцати равен минус одной второй. Отрицательный множитель делает и ответ отрицательным.', 'The cosine of one hundred twenty is minus one half. A negative factor makes the answer negative too.') },
        ],
        solution: ['6 · 3 · cos 120°', '18 · (−0,5) = −9'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — koordinatalar va ishora.
// ============================================================
const S10 = {
  eyebrow: L('ISHORA', 'ЗНАК', 'THE SIGN'),
  title: L(
    "Son burchakni aytib beradi",
    'Число подскажет угол',
    'The number tells the angle',
  ),
  audio: [
    A('mount',
      "Endi koordinatalar berilgan. Ko'paytmani hisoblab, burchak haqida xulosa chiqaring.",
      'Теперь даны координаты. Посчитай произведение и сделай вывод об угле.',
      'Now the coordinates are given. Compute the product and conclude about the angle.'),
    A('why',
      "Darslikning o'ttiz bir nuqta ikkinchi mashqi.",
      'Задача тридцать один точка два учебника.',
      'Exercise thirty one point two.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham hisoblandi. Ko'paytmaning o'zi burchakning kattaligini bermaydi, lekin uning turini darhol aytadi: musbat bo'lsa o'tkir, manfiy bo'lsa o'tmas, nol bo'lsa to'g'ri.",
      'Обе посчитаны. Само произведение не даёт величину угла, но сразу называет его тип: положительное острый, отрицательное тупой, ноль прямой.',
      'Both are computed. The product does not give the size of the angle but names its type at once: positive acute, negative obtuse, zero right.',
    ),
    tasks: [
      {
        expr: 'a(0,5; −1)   ·   b(2; 3)',
        question: L(
          "Ko'paytma va burchak turi qanday?",
          'Каковы произведение и тип угла?',
          'What are the product and the type of angle?',
        ),
        ok: L(
          "Ha, minus ikki. Manfiy, demak burchak o'tmas.",
          'Да, минус два. Отрицательное, значит угол тупой.',
          'Yes, minus two. Negative, so the angle is obtuse.',
        ),
        items: [
          { id: 'a', right: true, label: L('−2, o\'tmas', '−2, тупой', '−2, obtuse') },
          { id: 'b', label: L('4, o\'tkir', '4, острый', '4, acute'), hint: L("Ikkinchi qo'shiluvchini diqqat bilan hisoblang: minus bir karra uch minus uchga teng. Bir qo'shuv minus uch minus ikki beradi.", 'Посчитай второе слагаемое внимательно: минус один на три это минус три. Один плюс минус три даёт минус два.', 'Compute the second term carefully: minus one times three is minus three. One plus minus three gives minus two.') },
        ],
        solution: ['0,5 · 2 + (−1) · 3', '1 − 3 = −2'],
      },
      {
        expr: 'a(1,5; 2)   ·   b(4; −2)',
        question: L(
          "Ko'paytma va burchak turi qanday?",
          'Каковы произведение и тип угла?',
          'What are the product and the type of angle?',
        ),
        ok: L(
          "Ha, ikki. Musbat, demak burchak o'tkir.",
          'Да, два. Положительное, значит угол острый.',
          'Yes, two. Positive, so the angle is acute.',
        ),
        items: [
          { id: 'a', right: true, label: L('2, o\'tkir', '2, острый', '2, acute') },
          { id: 'b', label: L('10, o\'tkir', '10, острый', '10, acute'), hint: L("Ikkinchi koordinatalar ko'paytmasi manfiy: ikki karra minus ikki minus to'rt. Olti va minus to'rtning yig'indisi ikki.", 'Произведение вторых координат отрицательно: два на минус два минус четыре. Сумма шести и минус четырёх это два.', 'The product of the second coordinates is negative: two times minus two is minus four. Six plus minus four is two.') },
        ],
        solution: ['1,5 · 4 + 2 · (−2)', '6 − 4 = 2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — perpendikulyarlik sharti.
// ============================================================
const S11 = {
  eyebrow: L('NOMA\'LUM KOORDINATA', 'НЕИЗВЕСТНАЯ КООРДИНАТА', 'AN UNKNOWN COORDINATE'),
  title: L(
    "Perpendikulyar bo'lishi uchun",
    'Чтобы стали перпендикулярны',
    'To make them perpendicular',
  ),
  audio: [
    A('mount',
      "Endi teskari masala. Koordinatalardan biri noma'lum, vektorlar esa perpendikulyar bo'lishi kerak.",
      'Теперь обратная задача. Одна из координат неизвестна, а векторы должны быть перпендикулярны.',
      'Now the reverse problem. One coordinate is unknown and the vectors must be perpendicular.'),
    A('why',
      "Alomat tenglama beradi. Ko'paytmani nolga tenglashtiramiz.",
      'Признак даёт уравнение. Приравниваем произведение к нулю.',
      'The criterion gives an equation. Set the product equal to zero.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Perpendikulyarlik alomati bu yerda geometriyani ALGEBRAGA aylantirdi: chizmasiz, faqat tenglama yechildi.",
      'Обе найдены. Признак перпендикулярности превратил геометрию в АЛГЕБРУ: без чертежа, решением уравнения.',
      'Both are found. The perpendicularity criterion turned geometry into ALGEBRA: no drawing, just an equation.',
    ),
    tasks: [
      {
        expr: 'a(4; 5)   ⊥   b(x; 6)',
        question: L('x nechaga teng?', 'Чему равно x?', 'What does x equal?'),
        ok: L(
          "Ha, minus yetti butun besh o'ndan. To'rt x qo'shuv o'ttiz nolga teng.",
          'Да, минус семь целых пять десятых. Четыре x плюс тридцать равно нулю.',
          'Yes, minus seven point five. Four x plus thirty equals zero.',
        ),
        items: [
          { id: 'a', right: true, label: '−7,5' },
          { id: 'b', label: '7,5', hint: L("Tenglamani yeching: to'rt x teng minus o'ttiz. Musbat songa bo'linganda ishora saqlanadi, ya'ni x manfiy.", 'Реши уравнение: четыре x равно минус тридцать. При делении на положительное знак сохраняется, значит x отрицателен.', 'Solve: four x equals minus thirty. Dividing by a positive keeps the sign, so x is negative.') },
        ],
        solution: ['4x + 5 · 6 = 0', '4x = −30', 'x = −7,5'],
      },
      {
        expr: 'a(0; −3)   ⊥   b(5; x)',
        question: L('x nechaga teng?', 'Чему равно x?', 'What does x equal?'),
        ok: L(
          "Ha, nol. Birinchi qo'shiluvchi nolga teng, demak ikkinchisi ham nol bo'lishi kerak.",
          'Да, ноль. Первое слагаемое равно нулю, значит и второе должно быть нулём.',
          'Yes, zero. The first term is zero, so the second must be zero as well.',
        ),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '5', hint: L("Tenglamani yozing: nol karra besh qo'shuv minus uch karra x nolga teng. Bundan minus uch x nolga teng.", 'Запиши уравнение: ноль на пять плюс минус три на x равно нулю. Отсюда минус три x равно нулю.', 'Write the equation: zero times five plus minus three times x equals zero. Hence minus three x is zero.') },
        ],
        solution: ['0 · 5 + (−3) · x = 0', '−3x = 0', 'x = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — nol ko'paytma.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Sonlardagi qoida bu yerda ishlamaydi",
    'Правило чисел здесь не работает',
    'The rule for numbers fails here',
  ),
  audio: [
    A('mount',
      "Kamronning fikri. Sonlarda ko'paytma nolga teng bo'lsa, ko'paytuvchilardan biri albatta nol edi. Shuning uchun u vektorlarda ham shunday deb yozdi.",
      'Мысль Камрона. В числах если произведение равно нулю, то один из множителей обязательно ноль. Поэтому он записал так же и для векторов.',
      "Kamron's thought. With numbers a zero product forces one factor to be zero. So he wrote the same for vectors."),
    A('why',
      "Xukdagi vektorlarni eslang. Ular minus besh, olti hamda olti, besh edi.",
      'Вспомни векторы из хука. Они были минус пять, шесть и шесть, пять.',
      'Recall the vectors from the hook. They were minus five, six and six, five.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Sonlarda nolga aylanish uchun ko'paytuvchining o'zi yo'qolishi kerak. Vektorlarda esa uchinchi ko'paytuvchi bor, kosinus, va aynan u nolga aylanadi. Shuning uchun ikkala vektor ham to'liq mavjud bo'lib, ko'paytma nol chiqadi.",
      'В числах для нуля должен исчезнуть сам множитель. У векторов есть третий множитель, косинус, и обращается в ноль именно он. Поэтому оба вектора существуют, а произведение нулевое.',
      'With numbers the factor itself must vanish. Vectors have a third factor, the cosine, and that is what vanishes. So both vectors are alive and the product is still zero.',
    ),
    tasks: [
      {
        expr: 'a(−5; 6)   ·   b(6; 5) = 0',
        question: L(
          "Bu vektorlardan birortasi nol vektormi?",
          'Является ли хоть один из этих векторов нулевым?',
          'Is either of these vectors the zero vector?',
        ),
        ok: L(
          "To'g'ri, ikkalasi ham noldan farqli. Ko'paytma esa baribir nol, chunki ular perpendikulyar.",
          'Верно, оба ненулевые. А произведение всё равно ноль, потому что они перпендикулярны.',
          'Correct, both are non zero. The product is zero anyway because they are perpendicular.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, ikkalasi ham noldan farqli", 'Нет, оба ненулевые', 'No, both are non zero'),
          },
          {
            id: 'b',
            label: L('Ha, biri nol vektor', 'Да, один нулевой', 'Yes, one is the zero vector'),
            hint: L(
              "Nol vektorning ikkala koordinatasi ham nol bo'ladi. Bu yerda esa minus besh ham, olti ham noldan farqli.",
              'У нулевого вектора обе координаты равны нулю. А здесь и минус пять, и шесть не нули.',
              'The zero vector has both coordinates zero. Here minus five and six are both non zero.',
            ),
          },
        ],
        solution: [
          '|a| = √61,   |b| = √61',
          'cos φ = 0   →   φ = 90°',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — romb, koordinatalarsiz.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Burchakni chizmadan olish",
    'Взять угол с чертежа',
    'Taking the angle from a drawing',
  ),
  audio: [
    A('mount',
      "ABCD romb, uning diagonallari O nuqtada kesishadi. Kichik diagonali BD tomoniga teng va to'rtga teng.",
      'ABCD ромб, его диагонали пересекаются в точке O. Меньшая диагональ BD равна стороне и равна четырём.',
      'ABCD is a rhombus whose diagonals meet at O. The shorter diagonal BD equals the side and equals four.'),
    A('why',
      "Bu yerda koordinata umuman yo'q. Burchak faqat chizmadan olinadi.",
      'Здесь нет никаких координат. Угол берут только с чертежа.',
      'There are no coordinates here. The angle comes from the drawing alone.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Rombda ABD teng tomonli uchburchak bo'lgani uchun burchak oltmish darajaga aylandi, diagonallarning perpendikulyarligi esa oxirgi ko'paytmani darhol nolga aylantirdi.",
      'Оба шага сделаны. В ромбе треугольник ABD равносторонний, поэтому угол оказался шестьдесят градусов, а перпендикулярность диагоналей сразу обнулила последнее произведение.',
      'Both steps are done. In the rhombus the triangle ABD is equilateral, so the angle came out sixty degrees, and the perpendicular diagonals zeroed the last product at once.',
    ),
    tasks: [
      {
        expr: 'AB = BD = 4',
        question: L(
          "AB va AD vektorlarning skalyar ko'paytmasi nechaga teng?",
          'Чему равно скалярное произведение векторов AB и AD?',
          'What is the scalar product of the vectors AB and AD?',
        ),
        ok: L(
          "Ha, sakkiz. ABD uchburchakning uchala tomoni ham to'rtga teng, demak u teng tomonli va A burchagi oltmish daraja.",
          'Да, восемь. У треугольника ABD все три стороны равны четырём, значит он равносторонний и угол A равен шестидесяти градусам.',
          'Yes, eight. All three sides of the triangle ABD are four, so it is equilateral and the angle A is sixty degrees.',
        ),
        items: [
          { id: 'a', right: true, label: '8' },
          {
            id: 'b',
            label: '16',
            hint: L(
              "O'n olti bu faqat uzunliklarning ko'paytmasi, ya'ni burchak nol bo'lgandagi javob. A burchagi esa oltmish daraja.",
              'Шестнадцать это только произведение длин, то есть ответ при нулевом угле. А угол A равен шестидесяти градусам.',
              'Sixteen is only the product of the lengths, the answer for a zero angle. But the angle A is sixty degrees.',
            ),
          },
        ],
        solution: ['∠A = 60°', '4 · 4 · cos 60° = 8'],
      },
      {
        expr: 'OC,   OD',
        question: L(
          "Ularning skalyar ko'paytmasi nechaga teng?",
          'Чему равно их скалярное произведение?',
          'What is their scalar product?',
        ),
        ok: L(
          "Ha, nol. Rombning diagonallari perpendikulyar, demak burchak to'qson daraja.",
          'Да, ноль. Диагонали ромба перпендикулярны, значит угол девяносто градусов.',
          'Yes, zero. The diagonals of a rhombus are perpendicular, so the angle is ninety degrees.',
        ),
        items: [
          { id: 'a', right: true, label: '0' },
          {
            id: 'b',
            label: L("Uzunliklarni bilmasdan aytib bo'lmaydi", 'Без длин сказать нельзя', 'Impossible to say without the lengths'),
            hint: L(
              "Kosinus nolga teng bo'lganda uzunliklar ahamiyatsiz: nolga ko'paytirilgan istalgan son nol beradi.",
              'Когда косинус равен нулю, длины не важны: любое число, умноженное на ноль, даёт ноль.',
              'When the cosine is zero the lengths do not matter: any number times zero is zero.',
            ),
          },
        ],
        solution: ['∠COD = 90°', 'cos 90° = 0', L('kopaytma nol', 'произведение ноль', 'the product is zero')],
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
    "Blits: son, ishora, to'qson daraja",
    'Блиц: число, знак, девяносто градусов',
    'Blitz: number, sign, ninety degrees',
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
        tag: 'natija-vektor-deb-olish',
        ask: L(
          "Skalyar ko'paytmaning natijasi nima?",
          'Чем является результат скалярного произведения?',
          'What is the result of a scalar product?',
        ),
        options: [
          { id: 'r', right: true, label: L('Son', 'Число', 'A number') },
          { id: 'w', label: L('Vektor', 'Вектор', 'A vector') },
        ],
        ok: L(
          "To'g'ri. Nomi ham shundan: skalyar degani son degani.",
          'Верно. Отсюда и название: скаляр значит число.',
          'Correct. Hence the name: a scalar is a number.',
        ),
        hint: L(
          "2-ekranni eslang: koordinatalar ko'paytirilgandan keyin qo'shilgandi va bitta son qolgandi.",
          'Вспомни 2 экран: координаты перемножили, потом сложили, и осталось одно число.',
          'Recall screen 2: the coordinates were multiplied, then added, and one number was left.',
        ),
      },
      {
        id: 'q2',
        tag: 'nol-kopaytma-nol-vektor',
        ask: L(
          "Noldan farqli vektorlarning ko'paytmasi nol bo'lsa, bu nimani bildiradi?",
          'Если произведение ненулевых векторов равно нулю, что это значит?',
          'If the product of non zero vectors is zero, what does that mean?',
        ),
        options: [
          { id: 'r', right: true, label: L('Ular perpendikulyar', 'Они перпендикулярны', 'They are perpendicular') },
          { id: 'w', label: L('Bunday bo\'lishi mumkin emas', 'Такого быть не может', 'That cannot happen') },
        ],
        ok: L(
          "To'g'ri. Kosinus nolga aylanadi, vektorlar esa o'z joyida qoladi.",
          'Верно. В ноль обращается косинус, а векторы остаются на месте.',
          'Correct. The cosine vanishes while the vectors stay.',
        ),
        hint: L(
          "12-ekranni eslang: minus besh, olti va olti, besh vektorlarining ikkalasi ham noldan farqli edi.",
          'Вспомни 12 экран: векторы минус пять, шесть и шесть, пять оба были ненулевыми.',
          'Recall screen 12: the vectors minus five, six and six, five were both non zero.',
        ),
      },
      {
        id: 'q3',
        tag: 'ishorani-yoqotish',
        ask: L(
          "Burchak o'tmas bo'lsa, ko'paytmaning ishorasi qanday?",
          'Каков знак произведения при тупом угле?',
          'What is the sign of the product at an obtuse angle?',
        ),
        options: [
          { id: 'r', right: true, label: L('Manfiy', 'Отрицательный', 'Negative') },
          { id: 'w', label: L('Musbat', 'Положительный', 'Positive') },
        ],
        ok: L(
          "To'g'ri. Uzunliklar musbat, ishorani esa faqat kosinus beradi.",
          'Верно. Длины положительны, а знак даёт только косинус.',
          'Correct. The lengths are positive and only the cosine gives the sign.',
        ),
        hint: L(
          "9-ekranni eslang: bir yuz yigirma darajada javob minus to'qqiz chiqqandi.",
          'Вспомни 9 экран: при ста двадцати градусах вышло минус девять.',
          'Recall screen 9: at one hundred twenty degrees the answer came out minus nine.',
        ),
      },
      {
        id: 'q4',
        tag: 'burchak-umumiy-nuqtasiz',
        ask: L(
          "Vektorlar orasidagi burchakni o'lchashdan oldin nima qilinadi?",
          'Что делают перед измерением угла между векторами?',
          'What is done before measuring the angle between vectors?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Ularni bitta nuqtaga qo'yiladi", 'Их откладывают от одной точки', 'They are placed at one point'),
          },
          {
            id: 'w',
            label: L("Uzunliklari tenglashtiriladi", 'Их длины уравнивают', 'Their lengths are equalised'),
          },
        ],
        ok: L(
          "To'g'ri. Vektorning o'rni ahamiyatsiz, shuning uchun uni istalgan nuqtaga ko'chirish mumkin.",
          'Верно. Место вектора не важно, поэтому его можно перенести в любую точку.',
          'Correct. Where a vector sits does not matter, so it may be moved anywhere.',
        ),
        hint: L(
          "3-ekranni eslang: burchak faqat vektorlar bitta nuqtadan chiqqanda ko'rinadi.",
          'Вспомни 3 экран: угол виден только когда векторы выходят из одной точки.',
          'Recall screen 3: the angle shows only when the vectors leave one point.',
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
    "Formulaning ikkinchi tomoni",
    'Вторая сторона формулы',
    'The other side of the formula',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda 8-sinf formulasi nol bergandi va nol nimani bildirishi noma'lum edi.",
      'На первом экране формула 8 класса дала ноль, и было неизвестно, что этот ноль означает.',
      'On the first screen the grade eight formula gave zero, and what that zero meant was unknown.'),
    A('s1',
      "Endi bilasiz: nol perpendikulyarlik, musbat son o'tkir burchak, manfiy son esa o'tmas burchak.",
      'Теперь ты знаешь: ноль это перпендикулярность, положительное число острый угол, отрицательное тупой.',
      'Now you know: zero means perpendicular, a positive number an acute angle, a negative one obtuse.'),
    A('s2',
      "Koordinatali formulaning o'zi qayerdan kelib chiqishini 48-darsda, kosinuslar teoremasidan keyin ko'ramiz.",
      'Откуда берётся сама координатная формула, увидим на 48 уроке, после теоремы косинусов.',
      'Where the coordinate formula itself comes from we shall see in lesson 48, after the law of cosines.'),
  ],
  props: {
    mark: '(a, b) = |a| · |b| · cos φ',
    markNote: L(
      "nol bu to'qson daraja, nol vektor emas",
      'ноль это девяносто градусов, а не нулевой вектор',
      'zero means ninety degrees, not a zero vector',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: aylana uzunligi',
      'Следующий урок: длина окружности',
      'Next lesson: the circumference of a circle',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'natija-vektor-deb-olish', ...S2 },
  { role: 'explain',  tag: 'burchak-umumiy-nuqtasiz', ...S3 },
  { role: 'explain',  tag: 'ishorani-yoqotish', ...S4 },
  { role: 'explain',  tag: 'ishorani-yoqotish', ...S5 },
  { role: 'explain',  tag: 'nol-kopaytma-nol-vektor', ...S6 },
  { role: 'explain',  tag: 'nol-kopaytma-nol-vektor', ...S7 },
  { role: 'rule',     tag: 'natija-vektor-deb-olish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'ishorani-yoqotish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'ishorani-yoqotish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nol-kopaytma-nol-vektor', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'nol-kopaytma-nol-vektor', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'burchak-umumiy-nuqtasiz', ...S13 },
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
