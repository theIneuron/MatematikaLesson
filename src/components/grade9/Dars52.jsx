// ============================================================================
// 9-sinf, Dars 52. TAKRORLASH. KURSNING OXIRGI DARSI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, «Bilimingizni sinab
// ko'ring» ikkita bo'limi — 100-bet (II bob) va 142-bet (IV bob).
//   100-bet, 1-test: noto'g'ri tenglikni topish. Javob E:
//       S = ½ab·sin α — yuz formulasida tomonlar ORASIDAGI burchak
//       turishi kerak, ya'ni γ.
//   100-bet, 2-test: noto'g'ri tenglik cos(180° − α) = cos α.
//   100-bet, 3-test: uchta tomon berilganda kosinuslar teoremasi.
//   100-bet, 4-test: burchaklar 137° va 15°, katta tomon 22 →
//       kichik tomon 8,3.
//   100-bet, 9-test: burchaklar 3 : 2 : 1 → tomonlar 2 : √3 : 1.
//   142-bet, 1-test: balandlik haqidagi noto'g'ri tasdiq — «gipotenuza
//       yarmiga teng» (u faqat teng yonli holda shunday).
//   142-bet, 2-test: kesishgan vatarlarda AO = CO shart emas.
//   142-bet masalalari: ED = 4; OD = 8; urinma KP = 8; AB = 10;
//       proyeksiyalar 18 va 32.
//
// BU KURSNING OXIRGI DARSI, 52 dan 52. Shuning uchun uning formati
// boshqacha: yangi mavzu yo'q, hamma ekran DARSLIKNING NAZORAT
// TESTLARIGA qurilgan. Testlarning aksariyati «NOTO'G'RI tasdiqni
// toping» ko'rinishida — bu format hisobni emas, TUSHUNISHNI
// tekshiradi, chunki uchta to'g'ri javobning orasidan bittasini
// ajratish uchun har birini bilish kerak.
//
// XUK darhol shu formatni beradi: to'rtta tenglikdan bittasi noto'g'ri
// va u 50-darsning eng nozik joyiga tegadi — yuz formulasida burchak
// aynan tomonlar orasida turishi shart.
//
// TUZOQ (12-ekran): «katta tomon katta burchakka qarshi» qoidasini
// teskari o'qish. 137° va 15° bo'lgan uchburchakda kichik tomon 15°
// ga qarshi turadi, 137° ga emas — chalkashtirgan bola 8,3 o'rniga
// katta sonni oladi.
//
// TRANSFER (13-ekran) — YILNI YOPADIGAN MASALA: kosinuslar teoremasi
// KVADRAT TENGLAMA beradi (x² − 3x − 40 = 0), ya'ni Б1 blokining
// algebrasi Б7 blokining geometriyasida ishlaydi. Ikkinchi ildiz
// manfiy va u tomon bo'lolmaydi — bu 4-darsda o'rganilgan «ildizni
// ma'noga qarab tekshirish» odati.
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
  id: 'grade9-52',
  n: 52,
  row: 52,
  block: 'Б7',
  topic: L('Takrorlash', 'Повторение', 'Revision'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Yuz formulasida burchak aynan ko'rsatilgan tomonlar orasida turadi",
    'В формуле площади угол стоит именно между названными сторонами',
    'In the area formula the angle sits between the named sides',
  ),
  L(
    "Kichik tomon kichik burchakka, katta tomon katta burchakka qarshi yotadi",
    'Меньшая сторона лежит против меньшего угла, большая против большего',
    'The smaller side faces the smaller angle and the larger the larger',
  ),
  L(
    "Geometrik masala kvadrat tenglama berishi mumkin, manfiy ildiz esa tomon bo'lolmaydi",
    'Геометрическая задача может дать квадратное уравнение, а отрицательный корень стороной быть не может',
    'A geometry problem may yield a quadratic, and a negative root cannot be a side',
  ),
]

export const MISS = {
  'burchak-tomonlar-orasida': {
    what: L(
      "yuz formulasida tomonlar orasida turmagan burchak olindi",
      'в формуле площади взят угол не между сторонами',
      'the area formula was used with an angle not between the sides',
    ),
    wrong: null,
    at: 0,
  },
  'katta-kichik-almashish': {
    what: L(
      "kichik tomon katta burchakka qarshi qo'yildi",
      'меньшая сторона поставлена против большего угла',
      'the smaller side was set against the larger angle',
    ),
    wrong: null,
    at: 0,
  },
  'sinus-kosinus-ishorasi': {
    what: L(
      "sinus va kosinusning o'tmas burchakdagi ishorasi chalkashtirildi",
      'перепутаны знаки синуса и косинуса при тупом угле',
      'the signs of the sine and cosine at an obtuse angle were mixed up',
    ),
    wrong: null,
    at: 0,
  },
  'manfiy-ildizni-qoldirish': {
    what: L(
      "kvadrat tenglamaning manfiy ildizi javobda qoldirildi",
      'отрицательный корень квадратного уравнения оставлен в ответе',
      'the negative root of the quadratic was kept in the answer',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — noto'g'ri tenglikni topish.
// ============================================================
const S1 = {
  eyebrow: L('NOTO\'G\'RI TENGLIK', 'НЕВЕРНОЕ РАВЕНСТВО', 'THE FALSE EQUALITY'),
  title: L(
    "Uchtasi to'g'ri, bittasi yo'q",
    'Три верны, одно нет',
    'Three are true, one is not',
  ),
  audio: [
    A('mount',
      "Darslikning nazorat testi. Tomonlari a, b, c va mos burchaklari alfa, beta, gamma bo'lgan uchburchak uchun to'rtta tenglik berilgan.",
      'Контрольный тест учебника. Для треугольника со сторонами a, b, c и соответственными углами альфа, бета, гамма даны четыре равенства.',
      'A control test from the textbook. Four equalities are given for a triangle with sides a, b, c and matching angles alpha, beta, gamma.'),
    A('why',
      "Ulardan bittasi noto'g'ri. Uni topish uchun to'rttasini ham bilish kerak.",
      'Одно из них неверно. Чтобы его найти, нужно знать все четыре.',
      'One of them is false. Finding it takes knowing all four.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'a² = b² + c² − 2bc · cos α       a : sin α = b : sin β',
        'a² = b² + c² − 2bc · cos α       a : sin α = b : sin β',
        'a² = b² + c² − 2bc · cos α       a : sin α = b : sin β',
      )}
      steps={[
        { id: 'a', head: L('Yana ikkitasi', 'Ещё два', 'Two more'), lines: ['S = ½ ab · sin γ', 'S = ½ ab · sin α'] },
      ]}
      ask={L(
        "Qaysi tenglik noto'g'ri?",
        'Какое равенство неверно?',
        'Which equality is false?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'S = ½ ab · sin α' },
        {
          id: 'wrong',
          label: 'S = ½ ab · sin γ',
          hint: L(
            "a va b tomonlar C uchida uchrashadi, ya'ni ular orasidagi burchak gamma. Yuz formulasida esa aynan orasidagi burchak turishi kerak.",
            'Стороны a и b сходятся в вершине C, то есть угол между ними гамма. А в формуле площади должен стоять именно угол между ними.',
            'The sides a and b meet at C, so the angle between them is gamma. And the area formula needs exactly that angle.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Alfa burchagi a tomonga QARSHI turadi, a va b orasida emas. Bugun butun blokni shunday testlar bilan takrorlaymiz.",
        'Верно. Угол альфа лежит ПРОТИВ стороны a, а не между a и b. Сегодня повторим весь блок такими тестами.',
        'Correct. The angle alpha faces the side a, it does not sit between a and b. Today we revise the whole block with such tests.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — keltirish formulalari.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Ikkinchi test: yana noto'g'risi",
    'Второй тест: снова неверное',
    'The second test: the false one again',
  ),
  audio: [
    A('mount',
      "Endi to'rtta trigonometrik tenglik. Uchtasi 46-darsdan tanish.",
      'Теперь четыре тригонометрических равенства. Три знакомы с 46 урока.',
      'Now four trigonometric equalities. Three are familiar from lesson 46.'),
    A('why',
      "Diqqat qilinadigan joy o'tmas burchakdagi ishoralar.",
      'Внимание нужно к знакам при тупом угле.',
      'The care is needed with the signs at an obtuse angle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'sin²α + cos²α = 1       sin (180° − α) = sin α',
        'sin²α + cos²α = 1       sin (180° − α) = sin α',
        'sin²α + cos²α = 1       sin (180° − α) = sin α',
      )}
      steps={[
        { id: 'a', head: L('Yana ikkitasi', 'Ещё два', 'Two more'), lines: ['cos (180° − α) = cos α', 'sin (90° − α) = cos α'] },
      ]}
      ask={L(
        "Qaysi tenglik noto'g'ri?",
        'Какое равенство неверно?',
        'Which equality is false?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'cos (180° − α) = cos α' },
        {
          id: 'wrong',
          label: 'sin (180° − α) = sin α',
          hint: L(
            "Sinus yuqori yarim tekislikda qoladi va ishorasini saqlaydi. Kosinus esa chap tomonga o'tib, manfiy bo'lib qoladi.",
            'Синус остаётся в верхней полуплоскости и сохраняет знак. А косинус уходит влево и становится отрицательным.',
            'The sine stays in the upper half plane and keeps its sign. The cosine moves left and turns negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. O'ng tomonda minus turishi kerak edi. Aynan shu minus 48-darsda o'tmas burchakli uchburchakning tomonini uzaytirgan edi.",
        'Верно. Справа должен был стоять минус. Именно этот минус на 48 уроке удлинял сторону в тупоугольном треугольнике.',
        'Correct. A minus belonged on the right. That very minus lengthened the side of an obtuse triangle in lesson 48.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — qaysi teorema.
// ============================================================
const S3 = {
  eyebrow: L('QAYSI TEOREMA', 'КАКАЯ ТЕОРЕМА', 'WHICH THEOREM'),
  title: L(
    "Uchta tomon berilganda",
    'Когда даны три стороны',
    'When three sides are given',
  ),
  audio: [
    A('mount',
      "Uchinchi test. Uchburchakning uchta tomoni ma'lum, burchaklarini topish kerak.",
      'Третий тест. Известны три стороны треугольника, нужно найти углы.',
      'The third test. Three sides are known and the angles are wanted.'),
    A('why',
      "49-darsning birinchi savoli aynan shu edi.",
      'Первый вопрос 49 урока был именно об этом.',
      'The first question of lesson 49 was exactly this.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[5, 6, 10]}
          names={['A', 'B', 'C']}
          edges={{ a: '5', b: '6', c: '10' }}
        />
      }
      steps={[]}
      ask={L(
        "Qaysi teorema kerak?",
        'Какая теорема нужна?',
        'Which theorem is needed?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Kosinuslar', 'Косинусов', 'Of cosines') },
        {
          id: 'wrong',
          label: L('Sinuslar', 'Синусов', 'Of sines'),
          hint: L(
            "Sinuslar teoremasining har bir kasrida bitta burchak turadi. Bu yerda esa birorta burchak berilmagan.",
            'В каждой дроби теоремы синусов стоит угол. А здесь не дано ни одного.',
            'Each fraction of the law of sines holds an angle. Here none is given.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Tomonlari besh, olti va o'n bo'lgan uchburchakda eng katta burchakning kosinusi minus o'n uch yigirmadan, ya'ni u o'tmas.",
        'Верно. В треугольнике со сторонами пять, шесть и десять косинус наибольшего угла минус тринадцать двадцатых, то есть он тупой.',
        'Correct. In the triangle with sides five, six and ten the cosine of the largest angle is minus thirteen twentieths, so it is obtuse.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — kichik tomon.
// ============================================================
const S4 = {
  eyebrow: L('KICHIK TOMON', 'МЕНЬШАЯ СТОРОНА', 'THE SMALLER SIDE'),
  title: L(
    "Qaysi burchakka qarshi qarash kerak",
    'Против какого угла смотреть',
    'Which angle to look opposite',
  ),
  audio: [
    A('mount',
      "To'rtinchi test. Uchburchakning bir burchagi bir yuz o'ttiz yetti daraja, ikkinchisi o'n besh. Katta tomoni yigirma ikki.",
      'Четвёртый тест. Один угол треугольника сто тридцать семь градусов, второй пятнадцать. Большая сторона двадцать два.',
      'The fourth test. One angle is one hundred thirty seven degrees, another fifteen. The largest side is twenty two.'),
    A('why',
      "Kichik tomonni topish kerak. Avval u qaysi burchakka qarshi turishini aniqlaymiz.",
      'Нужно найти меньшую сторону. Сначала определим, против какого угла она лежит.',
      'The smallest side is wanted. First decide which angle it faces.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('137°,   15°,   28°', '137°,   15°,   28°', '137°,   15°,   28°')}
      steps={[]}
      ask={L(
        "Kichik tomon qaysi burchakka qarshi turadi?",
        'Против какого угла лежит меньшая сторона?',
        'Which angle does the smallest side face?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '15°' },
        {
          id: 'wrong',
          label: '137°',
          hint: L(
            "Bir yuz o'ttiz yetti eng KATTA burchak, unga eng katta tomon qarshi turadi. Bu yigirma ikkiga teng bo'lgan tomon.",
            'Сто тридцать семь это НАИБОЛЬШИЙ угол, против него лежит наибольшая сторона. Это та, что равна двадцати двум.',
            'One hundred thirty seven is the LARGEST angle and the largest side faces it. That is the side of twenty two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi sinuslar teoremasi: yigirma ikki karra sinus o'n besh bo'lingan sinus bir yuz o'ttiz yetti, taxminan sakkiz butun uch o'ndan.",
        'Верно. Теперь теорема синусов: двадцать два на синус пятнадцати делить на синус ста тридцати семи, примерно восемь целых три десятых.',
        'Correct. Now the law of sines: twenty two times the sine of fifteen over the sine of one hundred thirty seven, about eight point three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — burchaklar nisbati.
// ============================================================
const S5 = {
  eyebrow: L('NISBATLAR', 'ОТНОШЕНИЯ', 'RATIOS'),
  title: L(
    "Burchaklar nisbati tomonlarnikini bermaydi",
    'Отношение углов не даёт отношения сторон',
    'The ratio of angles is not the ratio of sides',
  ),
  audio: [
    A('mount',
      "To'qqizinchi test. Uchburchak burchaklarining nisbati uch, ikki, bir kabi. Tomonlarining nisbatini topish kerak.",
      'Девятый тест. Отношение углов треугольника три, два, один. Нужно найти отношение сторон.',
      'The ninth test. The angles are in the ratio three, two, one. Find the ratio of the sides.'),
    A('why',
      "Burchaklarning o'zi oson topiladi: to'qson, oltmish va o'ttiz daraja.",
      'Сами углы находятся легко: девяносто, шестьдесят и тридцать градусов.',
      'The angles themselves are easy: ninety, sixty and thirty degrees.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('90°,   60°,   30°', '90°,   60°,   30°', '90°,   60°,   30°')}
      steps={[
        { id: 'a', head: L('Sinuslar', 'Синусы', 'The sines'), lines: ['sin 90° = 1', 'sin 60° = √3/2', 'sin 30° = 1/2'] },
      ]}
      ask={L(
        "Tomonlarning nisbati qanday?",
        'Каково отношение сторон?',
        'What is the ratio of the sides?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '2 : √3 : 1' },
        {
          id: 'wrong',
          label: '3 : 2 : 1',
          hint: L(
            "Tomonlar burchaklarga emas, ularning SINUSLARIGA proporsional. Uchta sinusni ikkiga ko'paytiring: ikki, ildiz uch, bir.",
            'Стороны пропорциональны не углам, а их СИНУСАМ. Умножь три синуса на два: два, корень из трёх, один.',
            'The sides are proportional not to the angles but to their SINES. Multiply the three sines by two: two, root three, one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Burchaklar nisbati uch, ikki, bir bo'lsa ham, tomonlarniki butunlay boshqa chiqdi. 46-darsning tuzog'i shu haqda edi.",
        'Верно. Хотя углы относятся как три, два, один, стороны вышли совсем в другом отношении. Ловушка 46 урока была именно об этом.',
        'Correct. Though the angles are three to two to one, the sides came out in quite another ratio. The trap of lesson 46 was about that.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — balandlik haqidagi test.
// ============================================================
const S6 = {
  eyebrow: L('BALANDLIK', 'ВЫСОТА', 'THE ALTITUDE'),
  title: L(
    "Har doim emas, faqat ba'zan",
    'Не всегда, а лишь иногда',
    'Not always, only sometimes',
  ),
  audio: [
    A('mount',
      "Ikkinchi bo'limning birinchi testi. To'g'ri burchakli uchburchakning gipotenuzasiga tushirilgan balandligi haqida to'rtta tasdiq.",
      'Первый тест второго раздела. Четыре утверждения о высоте, опущенной на гипотенузу.',
      'The first test of the second section. Four statements about the altitude to the hypotenuse.'),
    A('why',
      "Uchtasi har doim to'g'ri, bittasi esa faqat maxsus holda.",
      'Три верны всегда, а одно только в особом случае.',
      'Three always hold and one only in a special case.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[8, 6, 10]}
          names={['A', 'B', 'C']}
          altitude
          right="C"
          altLab="h"
          segs={{ left: '3,6', right: '6,4' }}
        />
      }
      steps={[]}
      ask={L(
        "Qaysi tasdiq noto'g'ri?",
        'Какое утверждение неверно?',
        'Which statement is false?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Balandlik gipotenuzaning yarmiga teng",
            'Высота равна половине гипотенузы',
            'The altitude equals half the hypotenuse',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Balandlik uchburchakni ikkita o'xshash uchburchakka ajratadi",
            'Высота делит треугольник на два подобных',
            'The altitude splits the triangle into two similar ones',
          ),
          hint: L(
            "45-darsni eslang: o'xshashlik har doim bajariladi, chunki har bir bo'lakda to'g'ri burchak va kattasining bitta o'tkir burchagi bor.",
            'Вспомни 45 урок: подобие выполняется всегда, ведь в каждой части есть прямой угол и один острый угол большого треугольника.',
            'Recall lesson 45: the similarity always holds, since each part has a right angle and one acute angle of the whole.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Balandlik gipotenuzaning yarmiga faqat teng yonli holda, ya'ni katetlar teng bo'lganda yetadi. Chizmadagi misolda esa u to'rt butun sakkiz o'ndan, gipotenuzaning yarmi esa besh.",
        'Верно. Высота равна половине гипотенузы только в равнобедренном случае, то есть при равных катетах. А на чертеже она четыре целых восемь десятых при половине гипотенузы пять.',
        'Correct. The altitude equals half the hypotenuse only in the isosceles case with equal legs. On the drawing it is four point eight while half the hypotenuse is five.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — vatarlar haqidagi test.
// ============================================================
const S7 = {
  eyebrow: L('VATARLAR', 'ХОРДЫ', 'CHORDS'),
  title: L(
    "Ko'paytmalar teng, bo'laklar esa yo'q",
    'Произведения равны, куски нет',
    'The products agree, the pieces do not',
  ),
  audio: [
    A('mount',
      "Ikkinchi test. AB va CD vatarlar O nuqtada kesishadi, to'rtta tasdiq berilgan.",
      'Второй тест. Хорды AB и CD пересекаются в точке O, даны четыре утверждения.',
      'The second test. The chords AB and CD meet at O and four statements are given.'),
    A('why',
      "42-darsni eslang: u yerda nima teng bo'lib chiqqandi.",
      'Вспомни 42 урок: что там оказалось равным.',
      'Recall lesson 42: what turned out to be equal there.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        '∠DAB = ∠DCB       AO · OB = CO · OD',
        '∠DAB = ∠DCB       AO · OB = CO · OD',
        '∠DAB = ∠DCB       AO · OB = CO · OD',
      )}
      steps={[
        { id: 'a', head: L('Yana ikkitasi', 'Ещё два', 'Two more'), lines: ['AOD ~ COB', 'AO = CO'] },
      ]}
      ask={L(
        "Qaysi tasdiq noto'g'ri?",
        'Какое утверждение неверно?',
        'Which statement is false?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'AO = CO' },
        {
          id: 'wrong',
          label: 'AO · OB = CO · OD',
          hint: L(
            "Bu 42-darsning teoremasi va u har doim bajariladi. Bo'laklarning o'zi esa har xil bo'lishi mumkin.",
            'Это теорема 42 урока, и она выполняется всегда. А сами куски могут быть разными.',
            'That is the theorem of lesson 42 and it always holds. The pieces themselves may differ.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Teorema KO'PAYTMALARNI tenglashtiradi, bo'laklarni emas. Olti karra to'rt va uch karra sakkiz bir xil yigirma to'rtni beradi, garchi oltı va uch teng bo'lmasa ham.",
        'Верно. Теорема приравнивает ПРОИЗВЕДЕНИЯ, а не куски. Шесть на четыре и три на восемь дают одно и то же двадцать четыре, хотя шесть и три не равны.',
        'Correct. The theorem equates the PRODUCTS, not the pieces. Six times four and three times eight both give twenty four, though six and three differ.',
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
    'Geometriya 9, 100-bet va 142-bet, nazorat testlari',
    'Геометрия 9, стр. 100 и 142, контрольные тесты',
    'Geometry 9, p. 100 and 142, control tests',
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
          "Nega «noto'g'risini toping» savoli qiyinroq?",
          'Почему вопрос «найди неверное» труднее?',
          'Why is the question find the false one harder?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Chunki to'rttasini ham tekshirish kerak",
              'Потому что проверить нужно все четыре',
              'Because all four must be checked',
            ),
          },
          {
            id: 'wrong',
            label: L(
              "Chunki javoblar uzunroq yozilgan",
              'Потому что ответы записаны длиннее',
              'Because the answers are written longer',
            ),
            hint: L(
              "Oddiy savolda bitta to'g'ri javobni topsangiz yetadi. Bu yerda esa uchtasi to'g'ri ekaniga ishonch hosil qilish kerak.",
              'В обычном вопросе достаточно найти один верный ответ. А здесь нужно убедиться, что три из них верны.',
              'An ordinary question needs one right answer found. Here you must be sure three of them are right.',
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
    "Uchta nozik joy",
    'Три тонких места',
    'Three delicate spots',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz darslikning yettita nazorat testini yechdingiz.",
      'На семи экранах ты решил семь контрольных тестов учебника.',
      'On seven screens you solved seven control tests of the textbook.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — vatarlar va urinma.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Aylanadagi kesmalar",
    'Отрезки в окружности',
    'Segments in a circle',
  ),
  audio: [
    A('mount',
      "Darslikning bir yuz qirq ikkinchi betidagi masalalar. Uchtasi ham 42-darsning teoremalariga.",
      'Задачи со сто сорок второй страницы учебника. Все три на теоремы 42 урока.',
      'Problems from page one hundred forty two. All three use the theorems of lesson 42.'),
    A('why',
      "Vatarlar uchun ko'paytmalar teng, urinma uchun esa kvadrat.",
      'Для хорд равны произведения, а для касательной квадрат.',
      'For chords the products agree; for a tangent it is a square.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham yechildi. Uchinchisida urinma bilan markazgacha bo'lgan masofa Pifagor teoremasi orqali bog'landi, chunki urinma radiusga perpendikulyar.",
      'Все три решены. В третьей касательная и расстояние до центра связаны теоремой Пифагора, ведь касательная перпендикулярна радиусу.',
      'All three are solved. In the third the tangent and the distance to the centre are linked by Pythagoras, since a tangent is perpendicular to the radius.',
    ),
    tasks: [
      {
        expr: 'AE = 5,   BE = 2,   EC = 2,5',
        question: L('ED nechaga teng?', 'Чему равно ED?', 'What does ED equal?'),
        ok: L("Ha, to'rt. O'n bo'lingan ikki butun besh o'ndan.", 'Да, четыре. Десять на две целых пять десятых.', 'Yes, four. Ten over two point five.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '2,5', hint: L("Ko'paytmalarni tenglashtiring: besh karra ikki teng ikki butun besh o'ndan karra ED. Chap tomon o'nga teng.", 'Приравняй произведения: пять на два равно две целых пять десятых на ED. Слева десять.', 'Set the products equal: five times two equals two point five times ED. The left side is ten.') },
        ],
        solution: ['5 · 2 = 2,5 · ED', 'ED = 4'],
      },
      {
        expr: 'AO = 6,   OB = 4,   CO = 3',
        question: L('OD nechaga teng?', 'Чему равно OD?', 'What does OD equal?'),
        ok: L("Ha, sakkiz. Yigirma to'rt bo'lingan uch.", 'Да, восемь. Двадцать четыре на три.', 'Yes, eight. Twenty four over three.'),
        items: [
          { id: 'a', right: true, label: '8' },
          { id: 'b', label: '6', hint: L("Olti karra to'rt yigirma to'rt. Uni uchga bo'ling.", 'Шесть на четыре двадцать четыре. Раздели на три.', 'Six times four is twenty four. Divide by three.') },
        ],
        solution: ['6 · 4 = 3 · OD', 'OD = 8'],
      },
      {
        expr: 'R = 6,   OK = 10',
        question: L(
          "K nuqtadan urinish nuqtasigacha bo'lgan masofa nechaga teng?",
          'Чему равно расстояние от точки K до точки касания?',
          'What is the distance from K to the point of contact?',
        ),
        ok: L("Ha, sakkiz. Yuz ayirib o'ttiz olti oltmish to'rt.", 'Да, восемь. Сто минус тридцать шесть шестьдесят четыре.', 'Yes, eight. One hundred minus thirty six is sixty four.'),
        items: [
          { id: 'a', right: true, label: '8' },
          { id: 'b', label: '4', hint: L("Urinma radiusga perpendikulyar, demak OKP to'g'ri burchakli va gipotenuzasi o'n. Katetlaridan biri olti.", 'Касательная перпендикулярна радиусу, значит OKP прямоугольный с гипотенузой десять. Один из катетов шесть.', 'A tangent is perpendicular to the radius, so OKP is right angled with hypotenuse ten. One leg is six.') },
        ],
        solution: ['KP² = 100 − 36 = 64', 'KP = 8'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — to'g'ri burchakli uchburchak.
// ============================================================
const S10 = {
  eyebrow: L('PROYEKSIYALAR', 'ПРОЕКЦИИ', 'PROJECTIONS'),
  title: L(
    "45-darsning formulalari",
    'Формулы 45 урока',
    'The formulas of lesson 45',
  ),
  audio: [
    A('mount',
      "Ikkita masala to'g'ri burchakli uchburchakka.",
      'Две задачи на прямоугольный треугольник.',
      'Two problems on a right triangle.'),
    A('why',
      "Birinchisida balandlik va proyeksiya, ikkinchisida katetlarning nisbati berilgan.",
      'В первой даны высота и проекция, во второй отношение катетов.',
      'The first gives an altitude and a projection, the second a ratio of legs.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Ikkinchisida katetlar o'ttiz va qirq bo'lib chiqdi, ya'ni bu mashhur uchlikning o'n barobari.",
      'Обе решены. Во второй катеты оказались тридцать и сорок, то есть известная тройка, увеличенная в десять раз.',
      'Both are solved. In the second the legs came out thirty and forty, the famous triple scaled tenfold.',
    ),
    tasks: [
      {
        expr: 'CD = 4,8,   AD = 3,6',
        question: L('AB gipotenuza nechaga teng?', 'Чему равна гипотенуза AB?', 'What is the hypotenuse AB?'),
        ok: L("Ha, o'n. Ikkinchi bo'lak olti butun to'rt o'ndan.", 'Да, десять. Второй кусок шесть целых четыре десятых.', 'Yes, ten. The other piece is six point four.'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '8,4', hint: L("Balandlikning kvadrati bo'laklarning ko'paytmasiga teng: yigirma uch butun nol to'rt yuzdan bo'lingan uch butun olti o'ndan olti butun to'rt o'ndan. Ikkala bo'lakni qo'shing.", 'Квадрат высоты равен произведению кусков: двадцать три целых ноль четыре сотых на три целых шесть десятых это шесть целых четыре десятых. Сложи оба куска.', 'The altitude squared is the product of the pieces: twenty three point zero four over three point six is six point four. Add both pieces.') },
        ],
        solution: ['BD = 4,8² : 3,6 = 6,4', 'AB = 3,6 + 6,4 = 10'],
      },
      {
        expr: 'a : b = 3 : 4,   c = 50',
        question: L(
          "Balandlik gipotenuzadan qanday bo'laklar ajratadi?",
          'Какие куски отсекает высота на гипотенузе?',
          'What pieces does the altitude cut on the hypotenuse?',
        ),
        ok: L("Ha, o'n sakkiz va o'ttiz ikki.", 'Да, восемнадцать и тридцать два.', 'Yes, eighteen and thirty two.'),
        items: [
          { id: 'a', right: true, label: L('18 va 32', '18 и 32', '18 and 32') },
          { id: 'b', label: L('20 va 30', '20 и 30', '20 and 30'), hint: L("Katetlar o'ttiz va qirq. Har bir proyeksiya katetning kvadratini gipotenuzaga bo'lganga teng: to'qqiz yuz bo'lingan ellik va bir ming olti yuz bo'lingan ellik.", 'Катеты тридцать и сорок. Каждая проекция это квадрат катета делить на гипотенузу: девятьсот на пятьдесят и тысяча шестьсот на пятьдесят.', 'The legs are thirty and forty. Each projection is a leg squared over the hypotenuse: nine hundred over fifty and one thousand six hundred over fifty.') },
        ],
        solution: [L('katetlar 30 va 40', 'катеты 30 и 40', 'legs 30 and 40'), '900 : 50 = 18,   1600 : 50 = 32'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — sinuslar teoremasi.
// ============================================================
const S11 = {
  eyebrow: L('IKKI SAVOL BIRGA', 'ДВА ВОПРОСА СРАЗУ', 'TWO QUESTIONS AT ONCE'),
  title: L(
    "Tomon ham, radius ham",
    'И сторона, и радиус',
    'Both the side and the radius',
  ),
  audio: [
    A('mount',
      "Yuzinchi betdagi birinchi masala. AB olti santimetr, A burchagi oltmish, B burchagi yetmish besh daraja.",
      'Первая задача со сотой страницы. AB шесть сантиметров, угол A шестьдесят, угол B семьдесят пять градусов.',
      'The first problem on page one hundred. AB is six centimetres, the angle A sixty and the angle B seventy five degrees.'),
    A('why',
      "BC tomonni va tashqi chizilgan aylananing radiusini topish kerak.",
      'Нужно найти сторону BC и радиус описанной окружности.',
      'Find the side BC and the radius of the circumscribed circle.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala javob ham bitta nisbatdan chiqdi: sinuslar teoremasi tomonni ham, radiusni ham beradi, chunki uning o'ng tomonida ikki R turadi.",
      'Оба ответа вышли из одного отношения: теорема синусов даёт и сторону, и радиус, ведь справа у неё стоит два R.',
      'Both answers came from one ratio: the law of sines gives the side and the radius, since two R stands on its right.',
    ),
    tasks: [
      {
        expr: 'AB = 6,   ∠A = 60°,   ∠B = 75°',
        question: L('BC tomon nechaga teng?', 'Чему равна сторона BC?', 'What is the side BC?'),
        ok: L(
          "Ha, taxminan yetti butun uch o'ndan. Uchinchi burchak qirq besh daraja.",
          'Да, примерно семь целых три десятых. Третий угол сорок пять градусов.',
          'Yes, about seven point three. The third angle is forty five degrees.',
        ),
        items: [
          { id: 'a', right: true, label: '≈ 7,3' },
          { id: 'b', label: '≈ 4,9', hint: L("Avval uchinchi burchakni toping: bir yuz sakson ayirib oltmish ayirib yetmish besh qirq besh. BC ga oltmish daraja, AB ga esa qirq besh daraja qarshi turadi.", 'Сначала найди третий угол: сто восемьдесят минус шестьдесят минус семьдесят пять сорок пять. Против BC лежит шестьдесят, против AB сорок пять.', 'First find the third angle: one hundred eighty minus sixty minus seventy five is forty five. BC faces sixty and AB faces forty five.') },
        ],
        solution: ['∠C = 45°', 'BC = 6 · sin 60° : sin 45° ≈ 7,35'],
      },
      {
        expr: 'AB = 6,   ∠C = 45°',
        question: L(
          "Tashqi chizilgan aylananing radiusi nechaga teng?",
          'Чему равен радиус описанной окружности?',
          'What is the radius of the circumscribed circle?',
        ),
        ok: L("Ha, taxminan to'rt butun ikki o'ndan, ya'ni uch ildiz ikki.", 'Да, примерно четыре целых две десятых, то есть три корня из двух.', 'Yes, about four point two, that is three root two.'),
        items: [
          { id: 'a', right: true, label: '≈ 4,24' },
          { id: 'b', label: '≈ 8,49', hint: L("Sakkiz butun qirq to'qqiz yuzdan bu DIAMETR. Nisbat ikki R ga teng edi, demak yana ikkiga bo'ling.", 'Восемь целых сорок девять сотых это ДИАМЕТР. Отношение равнялось двум R, значит раздели ещё на два.', 'Eight point four nine is the DIAMETER. The ratio equalled two R, so halve it.') },
        ],
        solution: ['2R = 6 : sin 45° ≈ 8,49', 'R ≈ 4,24'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — katta va kichik almashdi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Qaysi tomon kichik",
    'Какая сторона меньше',
    'Which side is the smaller',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Burchaklar bir yuz o'ttiz yetti va o'n besh daraja, katta tomon yigirma ikki. U kichik tomonni yigirma ikki karra sinus bir yuz o'ttiz yetti bo'lingan sinus o'n besh deb yozgan.",
      'Решение Камрона. Углы сто тридцать семь и пятнадцать градусов, большая сторона двадцать два. Он записал меньшую сторону как двадцать два на синус ста тридцати семи делить на синус пятнадцати.',
      "Kamron's solution. The angles are one hundred thirty seven and fifteen with the largest side twenty two. He wrote the smallest side as twenty two times the sine of one hundred thirty seven over the sine of fifteen."),
    A('why',
      "Javobni hisoblamasdan tekshirish mumkin.",
      'Ответ можно проверить, не считая.',
      'The answer can be checked without computing.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamronning kasrida surat maxrajdan katta, demak javob yigirma ikkidan uzun chiqadi. Lekin yigirma ikki eng KATTA tomon edi, undan uzunroq tomon bo'lishi mumkin emas. Bitta qarash butun yechimni tekshiradi va bunday tekshiruv har qanday javobga qo'llanadi.",
      'В дроби Камрона числитель больше знаменателя, значит ответ выйдет длиннее двадцати двух. Но двадцать два и была НАИБОЛЬШЕЙ стороной, длиннее неё быть нечему. Один взгляд проверяет всё решение, и такая проверка годится для любого ответа.',
      'In Kamron fraction the numerator exceeds the denominator, so the answer comes out longer than twenty two. But twenty two was the LARGEST side and nothing can exceed it. One glance checks the whole solution, and such a check fits any answer.',
    ),
    tasks: [
      {
        expr: '22 · sin 137° : sin 15° ?',
        question: L(
          "Kamronning javobi yigirma ikkidan katta bo'ladimi yoki kichik?",
          'Ответ Камрона будет больше двадцати двух или меньше?',
          'Will Kamron answer be more than twenty two or less?',
        ),
        ok: L(
          "To'g'ri, katta. Demak u eng katta tomondan ham uzun chiqadi va bu mumkin emas.",
          'Верно, больше. Значит он длиннее самой большой стороны, а это невозможно.',
          'Correct, more. So it exceeds the largest side, which is impossible.',
        ),
        items: [
          { id: 'a', right: true, label: L('Katta', 'Больше', 'More') },
          {
            id: 'b',
            label: L('Kichik', 'Меньше', 'Less'),
            hint: L(
              "Sinus bir yuz o'ttiz yetti sinus qirq uchga teng, ya'ni taxminan nol butun oltmish sakkiz yuzdan. Sinus o'n besh esa nol butun yigirma olti yuzdan. Katta sonni kichikka bo'lsak, natija ortadi.",
              'Синус ста тридцати семи равен синусу сорока трёх, примерно ноль целых шестьдесят восемь сотых. А синус пятнадцати ноль целых двадцать шесть сотых. Деление большего на меньшее увеличивает.',
              'The sine of one hundred thirty seven equals that of forty three, about zero point six eight. The sine of fifteen is zero point two six. Dividing larger by smaller increases.',
            ),
          },
        ],
        solution: [
          '22 · sin 15° : sin 137° ≈ 8,3',
          L('Kamron: ≈ 58', 'Камрон: ≈ 58', 'Kamron: ≈ 58'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — yilni yopadigan masala.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Geometriya kvadrat tenglama berdi",
    'Геометрия дала квадратное уравнение',
    'Geometry produced a quadratic',
  ),
  audio: [
    A('mount',
      "Uchburchakning ikkita tomoni uch va x, ular orasidagi burchak oltmish daraja, uchinchi tomoni esa yetti. x ni topish kerak.",
      'Две стороны треугольника три и x, угол между ними шестьдесят градусов, а третья сторона семь. Нужно найти x.',
      'Two sides of a triangle are three and x with an angle of sixty degrees between them, and the third side is seven. Find x.'),
    A('why',
      "Kosinuslar teoremasini yozsak, noma'lum ikkinchi darajada paydo bo'ladi.",
      'Если записать теорему косинусов, неизвестное появится во второй степени.',
      'Writing the law of cosines makes the unknown appear squared.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Yil shu yerda yopildi. Kosinuslar teoremasi yettinchi blokdan, kvadrat tenglama birinchi blokdan, ildizni ma'noga qarab tekshirish esa 4-darsdan. Bitta masalada uchalasi ham kerak bo'ldi, va aynan shu narsa matematikani mavzular ro'yxatidan bitta fanga aylantiradi.",
      'Год закрылся здесь. Теорема косинусов из седьмого блока, квадратное уравнение из первого, а проверка корня по смыслу с 4 урока. В одной задаче понадобилось всё три, и именно это превращает математику из списка тем в единый предмет.',
      'The year closes here. The law of cosines from block seven, the quadratic from block one, and checking a root against meaning from lesson four. One problem needed all three, and that is what turns mathematics from a list of topics into one subject.',
    ),
    tasks: [
      {
        expr: 'b = 3,   c = x,   a = 7,   ∠A = 60°',
        question: L(
          "Kosinuslar teoremasidan qanday tenglama chiqadi?",
          'Какое уравнение следует из теоремы косинусов?',
          'What equation follows from the law of cosines?',
        ),
        ok: L(
          "Ha. Qirq to'qqiz teng to'qqiz qo'shuv x kvadrat ayirib uch x, ya'ni x kvadrat ayirib uch x ayirib qirq nolga teng.",
          'Да. Сорок девять равно девять плюс x квадрат минус три x, то есть x квадрат минус три x минус сорок равно нулю.',
          'Yes. Forty nine equals nine plus x squared minus three x, that is x squared minus three x minus forty equals zero.',
        ),
        items: [
          { id: 'a', right: true, label: 'x² − 3x − 40 = 0' },
          {
            id: 'b',
            label: 'x² + 3x − 40 = 0',
            hint: L(
              "Uchinchi qo'shiluvchi ikki karra uch karra x karra kosinus oltmish, ya'ni olti x karra nol butun besh o'ndan uch x. Formulada u AYIRILADI.",
              'Третье слагаемое это два на три на x на косинус шестидесяти, то есть шесть x на ноль целых пять десятых три x. В формуле оно ВЫЧИТАЕТСЯ.',
              'The third term is two times three times x times the cosine of sixty, that is six x times zero point five, three x. The formula SUBTRACTS it.',
            ),
          },
        ],
        solution: ['49 = 9 + x² − 2 · 3 · x · 0,5', 'x² − 3x − 40 = 0'],
      },
      {
        expr: 'x² − 3x − 40 = 0',
        question: L(
          "Tenglamaning qaysi ildizi javob bo'ladi?",
          'Какой корень уравнения будет ответом?',
          'Which root of the equation is the answer?',
        ),
        ok: L(
          "Ha, sakkiz. Ikkinchi ildiz minus besh va u tomon bo'lolmaydi.",
          'Да, восемь. Второй корень минус пять, а он стороной быть не может.',
          'Yes, eight. The other root is minus five and it cannot be a side.',
        ),
        items: [
          { id: 'a', right: true, label: L('Faqat 8', 'Только 8', 'Only 8') },
          {
            id: 'b',
            label: L('8 va −5', '8 и −5', '8 and −5'),
            hint: L(
              "Tenglama uchun ikkala ildiz ham to'g'ri. Lekin masalada x uzunlik, uzunlik esa manfiy bo'lolmaydi.",
              'Для уравнения верны оба корня. Но в задаче x это длина, а длина отрицательной не бывает.',
              'Both roots satisfy the equation. But in the problem x is a length, and a length is never negative.',
            ),
          },
        ],
        solution: ['x₁ = 8,   x₂ = −5', L('x = 8', 'x = 8', 'x = 8')],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS — butun yil bo'yicha.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: yil bo'yicha to'rtta savol",
    'Блиц: четыре вопроса за год',
    'Blitz: four questions for the year',
  ),
  audio: [
    A('mount',
      "To'rtta savol, har biri boshqa blokdan. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса, каждый из своего блока. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions, each from its own block. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'manfiy-ildizni-qoldirish',
        ask: L(
          "Kvadrat tenglamaning ildizi uzunlik bo'lsa, nima tekshiriladi?",
          'Если корень квадратного уравнения это длина, что проверяют?',
          'If a root of a quadratic is a length, what is checked?',
        ),
        options: [
          { id: 'r', right: true, label: L('Musbatligi', 'Положительность', 'That it is positive') },
          { id: 'w', label: L('Butunligi', 'Целость', 'That it is whole') },
        ],
        ok: L(
          "To'g'ri. Uzunlik manfiy bo'lolmaydi, butun bo'lishi esa shart emas.",
          'Верно. Длина не бывает отрицательной, а целой быть не обязана.',
          'Correct. A length is never negative but need not be whole.',
        ),
        hint: L(
          "13-ekranni eslang: minus besh tenglamaning ildizi edi, lekin masalaning javobi emas.",
          'Вспомни 13 экран: минус пять был корнем уравнения, но не ответом задачи.',
          'Recall screen 13: minus five was a root of the equation but not the answer.',
        ),
      },
      {
        id: 'q2',
        tag: 'sinus-kosinus-ishorasi',
        ask: L(
          "O'tmas burchakda qaysi biri manfiy bo'ladi?",
          'Что становится отрицательным при тупом угле?',
          'Which one turns negative at an obtuse angle?',
        ),
        options: [
          { id: 'r', right: true, label: L('Kosinus', 'Косинус', 'The cosine') },
          { id: 'w', label: L('Sinus', 'Синус', 'The sine') },
        ],
        ok: L(
          "To'g'ri. Sinus bir yuz saksongacha musbat bo'lib qoladi.",
          'Верно. Синус остаётся положительным вплоть до ста восьмидесяти.',
          'Correct. The sine stays positive all the way to one hundred eighty.',
        ),
        hint: L(
          "2-ekranni eslang: noto'g'ri tenglik aynan kosinus haqida edi.",
          'Вспомни 2 экран: неверное равенство было как раз про косинус.',
          'Recall screen 2: the false equality was about the cosine.',
        ),
      },
      {
        id: 'q3',
        tag: 'katta-kichik-almashish',
        ask: L(
          "Eng katta burchakka qanday tomon qarshi turadi?",
          'Какая сторона лежит против наибольшего угла?',
          'Which side faces the largest angle?',
        ),
        options: [
          { id: 'r', right: true, label: L('Eng kattasi', 'Наибольшая', 'The largest') },
          { id: 'w', label: L('Eng kichigi', 'Наименьшая', 'The smallest') },
        ],
        ok: L(
          "To'g'ri. Bu tekshiruv javobni hisobsiz nazorat qiladi.",
          'Верно. Эта проверка контролирует ответ без всякого счёта.',
          'Correct. That check controls an answer with no computing at all.',
        ),
        hint: L(
          "12-ekranni eslang: Kamronning javobi eng katta tomondan ham uzun chiqqandi.",
          'Вспомни 12 экран: ответ Камрона вышел длиннее самой большой стороны.',
          'Recall screen 12: Kamron answer came out longer than the largest side.',
        ),
      },
      {
        id: 'q4',
        tag: 'burchak-tomonlar-orasida',
        ask: L(
          "S = ½ab · sin C formulasida C qayerda turadi?",
          'Где стоит C в формуле S = ½ab · sin C?',
          'Where does C sit in the formula S = ½ab · sin C?',
        ),
        options: [
          { id: 'r', right: true, label: L('a va b orasida', 'Между a и b', 'Between a and b') },
          { id: 'w', label: L('c tomonga qarshi', 'Против стороны c', 'Opposite the side c') },
        ],
        ok: L(
          "To'g'ri, a va b orasida. Bu ikkalasi bir xil burchak, lekin formulani eslashda birinchisi ishonchliroq.",
          'Верно, между a и b. Это один и тот же угол, но при запоминании формулы первое надёжнее.',
          'Correct, between a and b. It is the same angle either way, but the first is the safer way to recall the formula.',
        ),
        hint: L(
          "1-ekranni eslang: noto'g'ri tenglikda sinus alfa turgandi, alfa esa a ga qarshi.",
          'Вспомни 1 экран: в неверном равенстве стоял синус альфа, а альфа лежит против a.',
          'Recall screen 1: the false equality had the sine of alpha, and alpha faces a.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN — KURSNING OXIRI.
// ============================================================
const S15 = {
  eyebrow: L('KURS YAKUNI', 'ИТОГ КУРСА', 'END OF THE COURSE'),
  title: L(
    "Ellik ikki dars ortda qoldi",
    'Пятьдесят два урока позади',
    'Fifty two lessons behind you',
  ),
  audio: [
    A('s0',
      "Yil kvadrat tenglamalardan boshlangandi, bugun esa kosinuslar teoremasi o'sha kvadrat tenglamani qaytarib berdi.",
      'Год начинался с квадратных уравнений, а сегодня теорема косинусов вернула то же квадратное уравнение.',
      'The year began with quadratic equations, and today the law of cosines handed one back.'),
    A('s1',
      "Yo'lda funksiyalar, tengsizliklar, progressiyalar, statistika, trigonometriya va geometriya bo'ldi. Ularning hammasi bir biriga tayandi.",
      'По пути были функции, неравенства, прогрессии, статистика, тригонометрия и геометрия. И все они опирались друг на друга.',
      'Along the way came functions, inequalities, progressions, statistics, trigonometry and geometry. And each leaned on the others.'),
    A('s2',
      "Matematika mavzular ro'yxati emas, bitta fan. Yaxshi dam oling.",
      'Математика это не список тем, а один предмет. Хорошего отдыха.',
      'Mathematics is not a list of topics but one subject. Rest well.'),
  ],
  props: {
    mark: '52 / 52',
    markNote: L(
      "kurs yakunlandi",
      'курс завершён',
      'the course is complete',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "9-sinf kursi yakunlandi",
      'Курс 9 класса завершён',
      'The grade nine course is complete',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'sinus-kosinus-ishorasi', ...S2 },
  { role: 'explain',  tag: 'burchak-tomonlar-orasida', ...S3 },
  { role: 'explain',  tag: 'katta-kichik-almashish', ...S4 },
  { role: 'explain',  tag: 'katta-kichik-almashish', ...S5 },
  { role: 'explain',  tag: 'burchak-tomonlar-orasida', ...S6 },
  { role: 'explain',  tag: 'burchak-tomonlar-orasida', ...S7 },
  { role: 'rule',     tag: 'sinus-kosinus-ishorasi', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'burchak-tomonlar-orasida', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'burchak-tomonlar-orasida', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'katta-kichik-almashish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'katta-kichik-almashish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'manfiy-ildizni-qoldirish', ...S13 },
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
