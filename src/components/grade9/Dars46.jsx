// ============================================================================
// 9-sinf, Dars 46. O'TKIR BURCHAKNING SINUSI, KOSINUSI VA TANGENSI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 25-dars (76-77-bet).
//   1-rasm (76-bet): ∠C = 90° bo'lgan ABC uchburchakda
//       sin α = BC/AB, cos α = AC/AB, tg α = BC/AC, ctg α = AC/BC.
//   Birlik yarim aylana (76-bet): M(x; y) uchun sin α = y, cos α = x,
//       chunki gipotenuza MO = 1. Shundan sin²α + cos²α = 1 kelib
//       chiqadi — bu x² + y² = 1 ning o'zi.
//   Keltirish (77-bet): sin(90° − α) = cos α, cos(90° − α) = sin α;
//       sin(180° − α) = sin α, cos(180° − α) = −cos α.
//   «Trigonometriya» — yunoncha «uchburchaklarni yechish».
//   25.5: a) cos²(180−α) + cos²(90−α) = cos²α + sin²α = 1;
//       d) tg α · tg(90−α) = tg α · ctg α = 1.
//   25.6: ∠A = 150°, AC = 7 → C uchidan tushirilgan balandlik
//       7 · sin30° = 3,5.
//   25.7: sin α = √3/2 → cos α = ±1/2.
//
// 33-DARS BILAN CHEGARA. Algebra bloki (33 va 34-darslar) sinus va
// kosinusni KOORDINATA orqali bergan: birlik aylana, nuqtaning
// abssissasi va ordinatasi. Bugungi dars teskari yo'nalishda ishlaydi
// — koordinatadan TOMONLAR NISBATIGA qaytadi va shu bilan 47-49
// darslarga (sinuslar va kosinuslar teoremalari) yo'l ochadi.
// Ya'ni bu takror emas, ikkinchi tomondan qarash.
//
// DARSNING O'ZAGI — NEGA SINUS JADVALI UMUMAN MAVJUD. Sabab
// o'xshashlikda: o'tkir burchagi α bo'lgan BARCHA to'g'ri burchakli
// uchburchaklar o'zaro o'xshash (40-darsning birinchi alomati),
// shuning uchun katetning gipotenuzaga nisbati uchburchakning
// kattaligiga emas, faqat α ga bog'liq. Xuk shu yerdan boshlanadi:
// birlik aylanada sin30° = 0,5, gipotenuzasi 8 bo'lgan uchburchakda
// esa qarshi katet 4 — ya'ni o'sha nisbat, sakkiz marta cho'zilgan.
//
// TUZOQ (12-ekran): burchak ikki marta ortsa, sinus ham ikki marta
// ortadi deb o'ylash. sin30° = 0,5, demak sin60° bir bo'lishi kerak
// edi — lekin sinus birdan katta bo'lolmaydi va u aslida 0,866.
// Xato «hisob xatosi» emas, PROPORSIONALLIKNI o'rinsiz ko'chirish.
//
// TRANSFER (13-ekran): 25.6 — o'tmas burchakli uchburchakda balandlik.
// U yerda sin150° kerak bo'ladi va keltirish formulasi ishlaydi.
// Ikkinchi qadam amaliy: soyasi 12 metr, quyosh burchagi 30 daraja
// bo'lgan daraxtning balandligi — tangens orqali.
//
// CHIZMA: `TriFig` (7K) 45-darsdan. Unga `angles` qo'shildi —
// burchakning yoyi va nomi. Yangi chizma yasalmadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, TriFig } from './asboblar.jsx'

export const META = {
  id: 'grade9-46',
  n: 46,
  row: 46,
  block: 'Б7',
  topic: L(
    "O'tkir burchakning sinusi, kosinusi va tangensi",
    'Синус, косинус и тангенс острого угла',
    'The sine, cosine and tangent of an acute angle',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Sinus qarshi katetning gipotenuzaga nisbati, kosinus esa yondosh katetning gipotenuzaga nisbati",
    'Синус это отношение противолежащего катета к гипотенузе, косинус — прилежащего к гипотенузе',
    'The sine is the opposite leg over the hypotenuse, the cosine the adjacent leg over the hypotenuse',
  ),
  L(
    "Nisbat uchburchakning kattaligiga emas, faqat burchakka bog'liq",
    'Отношение зависит не от размера треугольника, а только от угла',
    'The ratio depends not on the size of the triangle but only on the angle',
  ),
  L(
    "Burchak ikki marta ortsa, sinus ikki marta ortmaydi",
    'Если угол вырос вдвое, синус вдвое не растёт',
    'Doubling the angle does not double the sine',
  ),
]

export const MISS = {
  'sinus-burchakka-proporsional': {
    what: L(
      "sinus burchakka to'g'ri proporsional deb olindi",
      'синус принят прямо пропорциональным углу',
      'the sine was taken to be proportional to the angle',
    ),
    wrong: null,
    at: 0,
  },
  'qarshi-yondosh-almashish': {
    what: L(
      "qarshi katet bilan yondosh katet almashtirildi",
      'противолежащий катет перепутан с прилежащим',
      'the opposite leg was swapped with the adjacent one',
    ),
    wrong: null,
    at: 0,
  },
  'gipotenuza-orniga-katet': {
    what: L(
      "nisbatning maxrajiga gipotenuza o'rniga katet qo'yildi",
      'в знаменателе отношения вместо гипотенузы стоит катет',
      'a leg was put in the denominator instead of the hypotenuse',
    ),
    wrong: null,
    at: 0,
  },
  'sinus-birdan-katta': {
    what: L(
      "sinusning qiymati birdan katta chiqdi va bu tekshirilmadi",
      'значение синуса вышло больше единицы и это не проверено',
      'the sine came out greater than one and that went unchecked',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — birlik aylanadan haqiqiy uchburchakka.
// ============================================================
const S1 = {
  eyebrow: L('GIPOTENUZA BIR EMAS', 'ГИПОТЕНУЗА НЕ ЕДИНИЦА', 'THE HYPOTENUSE IS NOT ONE'),
  title: L(
    "Birlik aylanada 0,5 edi, bu yerda nima",
    'На единичной окружности было 0,5, а здесь что',
    'On the unit circle it was 0.5, and here',
  ),
  audio: [
    A('mount',
      "33-darsda birlik aylanadan o'qigandik: o'ttiz darajaning sinusi nol butun besh o'ndanga teng.",
      'На 33 уроке мы читали с единичной окружности: синус тридцати градусов равен нулю целых пяти десятым.',
      'In lesson 33 we read from the unit circle that the sine of thirty degrees is zero point five.'),
    A('why',
      "Bu yerda esa gipotenuza bir emas, sakkizga teng. O'ttiz darajaga qarshi turgan katet nechaga teng bo'ladi.",
      'А здесь гипотенуза не единица, а восемь. Чему равен катет, лежащий против тридцати градусов.',
      'Here the hypotenuse is not one but eight. What is the leg opposite the thirty degrees.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[4, 6.93, 8]}
          names={['A', 'B', 'C']}
          right="C"
          edges={{ c: '8', a: '?' }}
          angles={{ A: '30°' }}
        />
      }
      steps={[]}
      ask={L(
        "Qarshi katet nechaga teng?",
        'Чему равен противолежащий катет?',
        'What is the opposite leg?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '4' },
        {
          id: 'wrong',
          label: '0,5',
          hint: L(
            "Nol butun besh o'ndan bu NISBAT, uzunlik emas. Uni gipotenuzaga ko'paytiring.",
            'Ноль целых пять десятых это ОТНОШЕНИЕ, а не длина. Умножь его на гипотенузу.',
            'Zero point five is a RATIO, not a length. Multiply it by the hypotenuse.',
          ),
        },
      ]}
      after={L(
        "Ha, to'rt. Uchburchak sakkiz marta kattalashdi, nisbat esa o'zgarmadi. Bugun nega shunday ekanini ko'ramiz.",
        'Да, четыре. Треугольник вырос в восемь раз, а отношение не изменилось. Сегодня увидим, почему так.',
        'Yes, four. The triangle grew eightfold while the ratio held. Today we see why.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — barcha bunday uchburchaklar o'xshash.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Bitta o'tkir burchak yetarli",
    'Хватает одного острого угла',
    'One acute angle is enough',
  ),
  audio: [
    A('mount',
      "Ikkita to'g'ri burchakli uchburchak olamiz va ularning o'tkir burchaklaridan bittasi bir xil bo'lsin.",
      'Возьмём два прямоугольных треугольника, у которых один из острых углов одинаков.',
      'Take two right triangles sharing one of their acute angles.'),
    A('why',
      "40-darsning birinchi alomatini eslang: nechta burchak kerak edi.",
      'Вспомни первый признак с 40 урока: сколько углов было нужно.',
      'Recall the first criterion of lesson 40: how many angles were needed.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "∠C = ∠C₁ = 90°,   ∠A = ∠A₁ = 30°",
        '∠C = ∠C₁ = 90°,   ∠A = ∠A₁ = 30°',
        '∠C = ∠C₁ = 90°,   ∠A = ∠A₁ = 30°',
      )}
      steps={[]}
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
          label: L("Tomonlarni bilish kerak", 'Нужно знать стороны', 'The sides must be known'),
          hint: L(
            "Birinchi alomat tomonlarni umuman so'ramaydi. Unga ikkita teng burchak yetarli edi, bu yerda esa ular bor.",
            'Первый признак сторон вовсе не требует. Ему хватало двух равных углов, а они здесь есть.',
            'The first criterion asks for no sides at all. Two equal angles sufficed, and here they are.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Demak o'tkir burchagi o'ttiz daraja bo'lgan barcha to'g'ri burchakli uchburchaklar o'zaro o'xshash. Bu bugungi darsning kaliti.",
        'Верно. Значит все прямоугольные треугольники с острым углом тридцать градусов подобны между собой. Это ключ сегодняшнего урока.',
        'Correct. So all right triangles with an acute angle of thirty degrees are similar. That is the key to today.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — nisbat faqat burchakka bog'liq.
// ============================================================
const S3 = {
  eyebrow: L('NEGA JADVAL BOR', 'ПОЧЕМУ ЕСТЬ ТАБЛИЦА', 'WHY A TABLE EXISTS'),
  title: L(
    "Nisbat uchburchakni tanlamaydi",
    'Отношение не выбирает треугольник',
    'The ratio does not care which triangle',
  ),
  audio: [
    A('mount',
      "O'xshash uchburchaklarda mos tomonlarning nisbati bir xil edi. Demak qarshi katetning gipotenuzaga nisbati ham bir xil.",
      'В подобных треугольниках отношения соответственных сторон одинаковы. Значит и отношение противолежащего катета к гипотенузе одинаково.',
      'In similar triangles the ratios of corresponding sides agree. So the opposite leg over the hypotenuse agrees too.'),
    A('why',
      "Bu nisbat uchburchakning kattaligiga bog'liq emas ekan. U faqat bitta narsaga bog'liq.",
      'Значит это отношение не зависит от размера треугольника. Оно зависит только от одного.',
      'So that ratio does not depend on the size of the triangle. It depends on one thing only.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Nisbat nimaga bog'liq?",
        'От чего зависит отношение?',
        'What does the ratio depend on?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Faqat burchakka", 'Только от угла', 'Only on the angle') },
        {
          id: 'wrong',
          label: L("Gipotenuzaning uzunligiga", 'От длины гипотенузы', 'On the length of the hypotenuse'),
          hint: L(
            "Xukni eslang: gipotenuza sakkiz marta uzun edi, katet ham sakkiz marta uzun chiqdi, nisbat esa o'sha bo'lib qoldi.",
            'Вспомни хук: гипотенуза была в восемь раз длиннее, катет тоже вышел в восемь раз длиннее, а отношение осталось прежним.',
            'Recall the hook: the hypotenuse was eight times longer, the leg came out eight times longer, and the ratio stayed.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Aynan shuning uchun sinuslar jadvalini tuzish mumkin: har bir burchakka bitta son mos keladi va u barcha uchburchaklar uchun ishlaydi.",
        'Верно. Именно поэтому можно составить таблицу синусов: каждому углу отвечает одно число, и оно работает для всех треугольников.',
        'Correct. That is exactly why a table of sines can exist: each angle has one number, good for every triangle.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — uchta nisbat.
// ============================================================
const S4 = {
  eyebrow: L('UCHTA NISBAT', 'ТРИ ОТНОШЕНИЯ', 'THREE RATIOS'),
  title: L(
    "Qaysi katet qarshi, qaysi biri yondosh",
    'Какой катет противолежащий, какой прилежащий',
    'Which leg is opposite and which adjacent',
  ),
  audio: [
    A('mount',
      "Burchak tanlangach, ikkita katetning roli ajraladi. Biri burchakka qarshi turadi, ikkinchisi esa uning yonida yotadi.",
      'Как только выбран угол, роли катетов расходятся. Один лежит против угла, другой прилежит к нему.',
      'Once an angle is chosen the legs part in role. One lies opposite it, the other beside it.'),
    A('why',
      "Sinus qarshi katetni, kosinus esa yondosh katetni gipotenuzaga bo'ladi.",
      'Синус делит на гипотенузу противолежащий катет, косинус прилежащий.',
      'The sine divides the opposite leg by the hypotenuse, the cosine the adjacent one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[4, 6.93, 8]}
          names={['A', 'B', 'C']}
          right="C"
          edges={{ c: '8', a: '4', b: '6,93' }}
          angles={{ A: 'α' }}
        />
      }
      steps={[
        { id: 'a', head: L('Sinus', 'Синус', 'The sine'), lines: ['sin α = BC : AB'] },
      ]}
      ask={L(
        "Kosinus qanday yoziladi?",
        'Как записывается косинус?',
        'How is the cosine written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'cos α = AC : AB' },
        {
          id: 'wrong',
          label: 'cos α = AC : BC',
          hint: L(
            "AC bo'lingan BC bu ikkita KATETNING nisbati, ya'ni kotangens. Kosinusda maxrajda gipotenuza turadi.",
            'AC на BC это отношение двух КАТЕТОВ, то есть котангенс. У косинуса в знаменателе гипотенуза.',
            'AC over BC is the ratio of the two LEGS, that is the cotangent. The cosine has the hypotenuse below.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Tangens esa gipotenuzasiz ishlaydi: qarshi katetni yondosh katetga bo'ladi.",
        'Верно. А тангенс обходится без гипотенузы: делит противолежащий катет на прилежащий.',
        'Correct. The tangent does without the hypotenuse: the opposite leg over the adjacent one.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — birlik aylana bilan bog'lanish.
// ============================================================
const S5 = {
  eyebrow: L('IKKITA TA\'RIF, BITTA MA\'NO', 'ДВА ОПРЕДЕЛЕНИЯ, ОДИН СМЫСЛ', 'TWO DEFINITIONS, ONE MEANING'),
  title: L(
    "Nega birlik aylanada oddiy chiqadi",
    'Почему на единичной окружности проще',
    'Why the unit circle keeps it simple',
  ),
  audio: [
    A('mount',
      "33-darsda sinus nuqtaning tik koordinatasi edi, bugun esa u nisbat. Bu ikkita boshqa ta'rifmi.",
      'На 33 уроке синус был вертикальной координатой точки, а сегодня это отношение. Это два разных определения.',
      'In lesson 33 the sine was the height of a point, today it is a ratio. Are these two different definitions.'),
    A('why',
      "Birlik aylanada gipotenuza radiusga, ya'ni birga teng. Nisbatning maxraji bir bo'lsa, nima qoladi.",
      'На единичной окружности гипотенуза равна радиусу, то есть единице. Что остаётся, если знаменатель единица.',
      'On the unit circle the hypotenuse equals the radius, that is one. What remains when the denominator is one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('sin α = y : 1', 'sin α = y : 1', 'sin α = y : 1')}
      steps={[]}
      ask={L(
        "Ikkita ta'rif bir biriga qanday bog'langan?",
        'Как связаны эти два определения?',
        'How are the two definitions linked?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Bu bitta ta'rif: birlik aylanada maxraj bir",
            'Это одно определение: на единичной окружности знаменатель единица',
            'It is one definition: on the unit circle the denominator is one',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Ular boshqa boshqa va alohida yodlanadi",
            'Они разные и запоминаются отдельно',
            'They differ and must be learned apart',
          ),
          hint: L(
            "Bir songa bo'lish hech narsani o'zgartirmaydi. Demak koordinataning o'zi nisbatga teng bo'lib qoladi.",
            'Деление на единицу ничего не меняет. Значит сама координата и есть это отношение.',
            'Dividing by one changes nothing. So the coordinate itself is that ratio.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Birlik aylana bu shunchaki gipotenuzasi birga teng qilib tanlangan uchburchak. Shuning uchun 33-darsning barcha natijalari bugun ham ishlaydi, jumladan sinus kvadrat qo'shuv kosinus kvadrat teng bir.",
        'Верно. Единичная окружность это просто треугольник с гипотенузой, выбранной равной единице. Поэтому все результаты 33 урока работают и сегодня, включая синус квадрат плюс косинус квадрат равно единице.',
        'Correct. The unit circle is simply a triangle whose hypotenuse was chosen to be one. So every result of lesson 33 still holds, including sine squared plus cosine squared equals one.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — sin(90 − α) = cos α.
// ============================================================
const S6 = {
  eyebrow: L('IKKINCHI O\'TKIR BURCHAK', 'ВТОРОЙ ОСТРЫЙ УГОЛ', 'THE OTHER ACUTE ANGLE'),
  title: L(
    "Bitta chizma, ikkita nuqtai nazar",
    'Один чертёж, два взгляда',
    'One drawing, two viewpoints',
  ),
  audio: [
    A('mount',
      "O'sha uchburchakka endi ikkinchi o'tkir burchak tomonidan qaraymiz. U to'qson daraja ayirib alfaga teng.",
      'Посмотрим на тот же треугольник со стороны второго острого угла. Он равен девяноста градусам минус альфа.',
      'Look at the same triangle from its other acute angle. It equals ninety degrees minus alpha.'),
    A('why',
      "Alfa uchun qarshi bo'lgan katet ikkinchi burchak uchun yondosh bo'lib qoladi.",
      'Катет, противолежащий альфе, для второго угла становится прилежащим.',
      'The leg opposite alpha becomes the adjacent leg for the other angle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[4, 6.93, 8]}
          names={['A', 'B', 'C']}
          right="C"
          edges={{ c: '8', a: '4' }}
          angles={{ A: 'α', B: '90°−α' }}
        />
      }
      steps={[]}
      ask={L(
        "Ikkinchi burchakning sinusi nimaga teng?",
        'Чему равен синус второго угла?',
        'What does the sine of the other angle equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'cos α' },
        {
          id: 'wrong',
          label: 'sin α',
          hint: L(
            "Ikkinchi burchak uchun qarshi katet endi AC, ya'ni alfaning YONDOSH kateti. Yondosh katetning gipotenuzaga nisbati esa kosinus.",
            'Для второго угла противолежащим стал AC, то есть ПРИЛЕЖАЩИЙ катет альфы. А прилежащий к гипотенузе это косинус.',
            'For the other angle the opposite leg is now AC, the ADJACENT leg of alpha. Adjacent over hypotenuse is the cosine.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning keltirish formulasi: to'qson daraja ayirib alfaning sinusi alfaning kosinusiga teng. Uni yodlash shart emas, chizmadan o'qib olish mumkin.",
        'Верно. Это формула приведения из учебника: синус девяноста минус альфа равен косинусу альфа. Её не нужно заучивать, её читают с чертежа.',
        'Correct. This is the textbook reduction formula: the sine of ninety minus alpha is the cosine of alpha. No need to memorise it, it is read off the drawing.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — o'tmas burchak.
// ============================================================
const S7 = {
  eyebrow: L('O\'TMAS BURCHAK', 'ТУПОЙ УГОЛ', 'AN OBTUSE ANGLE'),
  title: L(
    "Uchburchakda o'tmas burchak ham bo'ladi",
    'В треугольнике бывает и тупой угол',
    'A triangle may hold an obtuse angle',
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchakda barcha burchaklar o'tkir edi. Lekin uchburchakning o'zida o'tmas burchak ham uchraydi.",
      'В прямоугольном треугольнике все углы были острыми. Но в треугольнике бывает и тупой угол.',
      'In a right triangle every angle was acute. But a triangle may have an obtuse angle.'),
    A('why',
      "33-darsda buning uchun tayyor formula chiqqandi.",
      'На 33 уроке для этого была выведена готовая формула.',
      'Lesson 33 already produced the formula for that.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('sin (180° − α) = sin α', 'sin (180° − α) = sin α', 'sin (180° − α) = sin α')}
      steps={[
        { id: 'a', head: L('Misol', 'Пример', 'An example'), lines: ['sin 150° = sin 30°'] },
      ]}
      ask={L(
        "sin 150° nechaga teng?",
        'Чему равен sin 150°?',
        'What is sin 150°?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0,5' },
        {
          id: 'wrong',
          label: '−0,5',
          hint: L(
            "Manfiy ishora KOSINUSDA paydo bo'ladi. Sinus esa yuqori yarim tekislikda qoladi va musbat bo'lib turaveradi.",
            'Минус появляется у КОСИНУСА. А синус остаётся в верхней полуплоскости и держится положительным.',
            'The minus belongs to the COSINE. The sine stays in the upper half plane and remains positive.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun o'tmas burchakli uchburchakda ham sinus bilan ishlash mumkin, va 47-darsdagi sinuslar teoremasi aynan shunga tayanadi.",
        'Верно. Поэтому с синусом можно работать и в тупоугольном треугольнике, и теорема синусов на 47 уроке опирается именно на это.',
        'Correct. So the sine works in an obtuse triangle too, and the law of sines in lesson 47 rests on exactly that.',
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
    'Geometriya 9, 25-dars (76-77-bet)',
    'Геометрия 9, урок 25 (стр. 76-77)',
    'Geometry 9, lesson 25 (p. 76-77)',
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
          "Sinus jadvali nega barcha uchburchaklar uchun ishlaydi?",
          'Почему таблица синусов работает для всех треугольников?',
          'Why does a table of sines work for every triangle?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Bir xil o'tkir burchakli uchburchaklar o'xshash bo'lgani uchun",
              'Потому что треугольники с одним острым углом подобны',
              'Because triangles with the same acute angle are similar',
            ),
          },
          {
            id: 'wrong',
            label: L(
              "Jadval barcha o'lchamlar uchun alohida tuzilgani uchun",
              'Потому что таблицу составили для всех размеров',
              'Because the table was made for every size',
            ),
            hint: L(
              "Uzunliklar cheksiz ko'p, ularning hammasini jadvalga sig'dirib bo'lmaydi. Jadvalda esa faqat burchaklar turibdi.",
              'Длин бесконечно много, все они в таблицу не поместятся. А в таблице стоят только углы.',
              'There are infinitely many lengths and no table could hold them. The table lists only angles.',
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
    "Burchak sonni belgilaydi",
    'Угол задаёт число',
    'The angle fixes the number',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz nisbatning nega faqat burchakka bog'liq ekanini ko'rdingiz.",
      'На семи экранах ты увидел, почему отношение зависит только от угла.',
      'On seven screens you saw why the ratio depends on the angle alone.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — katetni topish.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Gipotenuza va burchakdan katetga",
    'От гипотенузы и угла к катету',
    'From hypotenuse and angle to a leg',
  ),
  audio: [
    A('mount',
      "Uchta masala. Har birida gipotenuza va o'tkir burchak berilgan.",
      'Три задачи. В каждой даны гипотенуза и острый угол.',
      'Three problems. Each gives a hypotenuse and an acute angle.'),
    A('why',
      "Katetni topish uchun gipotenuzani mos nisbatga ko'paytirish kerak.",
      'Чтобы найти катет, гипотенузу умножают на нужное отношение.',
      'To find a leg, multiply the hypotenuse by the right ratio.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Diqqat qilinadigan yagona joy qaysi katet qarshi va qaysi biri yondosh ekanini ajratish, qolgani oddiy ko'paytirish.",
      'Все три найдены. Единственное, за чем нужно следить, это какой катет противолежащий, а какой прилежащий; остальное простое умножение.',
      'All three are found. The one thing to watch is which leg is opposite and which adjacent; the rest is plain multiplication.',
    ),
    tasks: [
      {
        expr: 'AB = 10,   ∠A = 60°',
        question: L(
          "Qarshi katet nechaga teng?",
          'Чему равен противолежащий катет?',
          'What is the opposite leg?',
        ),
        ok: L("Ha, taxminan sakkiz butun yetmish yuzdan. O'n karra sinus oltmish.", 'Да, примерно восемь целых семьдесят сотых. Десять на синус шестидесяти.', 'Yes, about eight point seven. Ten times the sine of sixty.'),
        items: [
          { id: 'a', right: true, label: '≈ 8,7' },
          { id: 'b', label: '5', hint: L("Besh bu YONDOSH katet: o'n karra kosinus oltmish. Qarshi katet uchun sinus kerak.", 'Пять это ПРИЛЕЖАЩИЙ катет: десять на косинус шестидесяти. Для противолежащего нужен синус.', 'Five is the ADJACENT leg: ten times the cosine of sixty. The opposite leg needs the sine.') },
        ],
        solution: ['sin 60° ≈ 0,866', '10 · 0,866 ≈ 8,66'],
      },
      {
        expr: 'AB = 10,   ∠A = 60°',
        question: L(
          "Yondosh katet nechaga teng?",
          'Чему равен прилежащий катет?',
          'What is the adjacent leg?',
        ),
        ok: L("Ha, besh. O'n karra kosinus oltmish, ya'ni o'n karra bir ikkidan.", 'Да, пять. Десять на косинус шестидесяти, то есть десять на одну вторую.', 'Yes, five. Ten times the cosine of sixty, that is ten times one half.'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '≈ 8,7', hint: L("Sakkiz butun yetti o'ndan bu qarshi katet edi. Yondosh katet uchun kosinus olinadi va kosinus oltmish bir ikkidanga teng.", 'Восемь целых семь десятых был противолежащий катет. Для прилежащего берут косинус, а косинус шестидесяти это одна вторая.', 'Eight point seven was the opposite leg. The adjacent one uses the cosine, and the cosine of sixty is one half.') },
        ],
        solution: ['cos 60° = 0,5', '10 · 0,5 = 5'],
      },
      {
        expr: 'a = 6,   ∠A = 30°',
        question: L(
          "Qarshi katet oltiga teng. Gipotenuza nechaga teng?",
          'Противолежащий катет равен шести. Чему равна гипотенуза?',
          'The opposite leg is six. What is the hypotenuse?',
        ),
        ok: L("Ha, o'n ikki. Olti bo'lingan nol butun besh o'ndan.", 'Да, двенадцать. Шесть делить на ноль целых пять десятых.', 'Yes, twelve. Six divided by zero point five.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '3', hint: L("Uch bu oltini ikkiga BO'LGANDA chiqadi. Bu yerda esa teskarisi: katet gipotenuzadan kichik, demak gipotenuza kattaroq bo'lishi kerak.", 'Три выходит при ДЕЛЕНИИ шести на два. А здесь наоборот: катет меньше гипотенузы, значит гипотенуза больше.', 'Three comes from DIVIDING six by two. Here it is the reverse: a leg is shorter than the hypotenuse, so the hypotenuse is larger.') },
        ],
        solution: ['6 : 0,5 = 12'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — tangens.
// ============================================================
const S10 = {
  eyebrow: L('TANGENS', 'ТАНГЕНС', 'THE TANGENT'),
  title: L(
    "Gipotenuzasiz ishlaydigan nisbat",
    'Отношение, обходящееся без гипотенузы',
    'The ratio that skips the hypotenuse',
  ),
  audio: [
    A('mount',
      "Tangens ikkita katetni bir biriga bo'ladi, gipotenuza unga kerak emas.",
      'Тангенс делит один катет на другой, гипотенуза ему не нужна.',
      'The tangent divides one leg by the other and needs no hypotenuse.'),
    A('why',
      "Shuning uchun u amaliyotda eng ko'p uchraydi. Gipotenuzani o'lchash ko'pincha imkonsiz.",
      'Поэтому на практике он встречается чаще всего. Гипотенузу часто измерить невозможно.',
      'That is why it shows up most in practice. The hypotenuse is often impossible to measure.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Qirq besh darajaning tangensi birga teng, shuning uchun bunday uchburchakda katetlar ham teng bo'ladi — buni yodlash shart emas, teng yonli uchburchakni tasavvur qilish yetadi.",
      'Обе решены. Тангенс сорока пяти равен единице, поэтому в таком треугольнике катеты равны — заучивать это не нужно, достаточно представить равнобедренный треугольник.',
      'Both are solved. The tangent of forty five is one, so such a triangle has equal legs; no need to memorise it, just picture an isosceles triangle.',
    ),
    tasks: [
      {
        expr: 'b = 12,   ∠A = 45°',
        question: L(
          "Yondosh katet o'n ikkiga teng. Qarshi katet nechaga teng?",
          'Прилежащий катет равен двенадцати. Чему равен противолежащий?',
          'The adjacent leg is twelve. What is the opposite one?',
        ),
        ok: L("Ha, o'n ikki. Qirq besh darajaning tangensi birga teng.", 'Да, двенадцать. Тангенс сорока пяти равен единице.', 'Yes, twelve. The tangent of forty five is one.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '6', hint: L("Tangensni hisoblang: qirq besh darajada u birga teng, demak katetlar bir xil bo'ladi.", 'Посчитай тангенс: при сорока пяти он равен единице, значит катеты одинаковы.', 'Compute the tangent: at forty five it is one, so the legs are the same.') },
        ],
        solution: ['tg 45° = 1', '12 · 1 = 12'],
      },
      {
        expr: 'b = 12,   ∠A = 30°',
        question: L(
          "Yondosh katet o'n ikkiga teng. Qarshi katet nechaga teng?",
          'Прилежащий катет равен двенадцати. Чему равен противолежащий?',
          'The adjacent leg is twelve. What is the opposite one?',
        ),
        ok: L(
          "Ha, taxminan olti butun to'qqiz o'ndan. O'n ikki karra tangens o'ttiz.",
          'Да, примерно шесть целых девять десятых. Двенадцать на тангенс тридцати.',
          'Yes, about six point nine. Twelve times the tangent of thirty.',
        ),
        items: [
          { id: 'a', right: true, label: '≈ 6,9' },
          { id: 'b', label: '6', hint: L("Olti bu o'n ikki karra nol butun besh o'ndan, ya'ni SINUS o'ttiz. Tangens esa nol butun ellik yetti yuzdanga yaqin.", 'Шесть это двенадцать на ноль целых пять десятых, то есть СИНУС тридцати. А тангенс около ноля целых пятидесяти семи сотых.', 'Six is twelve times zero point five, the SINE of thirty. The tangent is about zero point five seven.') },
        ],
        solution: ['tg 30° ≈ 0,577', '12 · 0,577 ≈ 6,93'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — ayniyat va keltirish.
// ============================================================
const S11 = {
  eyebrow: L('AYNIYAT', 'ТОЖДЕСТВО', 'THE IDENTITY'),
  title: L(
    "Sinusdan kosinusga",
    'От синуса к косинусу',
    'From sine to cosine',
  ),
  audio: [
    A('mount',
      "Ikkita masala. Birinchisi asosiy ayniyatga, ikkinchisi keltirish formulalariga.",
      'Две задачи. Первая на основное тождество, вторая на формулы приведения.',
      'Two problems. The first on the basic identity, the second on the reduction formulas.'),
    A('why',
      "Darslikning yigirma besh nuqta yettinchi va yigirma besh nuqta beshinchi mashqlari.",
      'Задачи двадцать пять точка семь и двадцать пять точка пять учебника.',
      'Exercises twenty five point seven and twenty five point five.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. O'tkir burchak uchun kosinus musbat, shuning uchun ikkita ildizdan biri tanlandi. Uchburchakning burchagi o'tmas bo'lishi ham mumkin, o'shanda manfiy qiymat kerak bo'ladi.",
      'Обе решены. Для острого угла косинус положителен, поэтому из двух корней выбран один. Угол треугольника может быть и тупым, тогда понадобится отрицательное значение.',
      'Both are solved. For an acute angle the cosine is positive, so one of the two roots was chosen. A triangle angle may also be obtuse, and then the negative value is the one needed.',
    ),
    tasks: [
      {
        expr: 'sin α = 0,6,   α < 90°',
        question: L('cos α nechaga teng?', 'Чему равен cos α?', 'What does cos α equal?'),
        ok: L(
          "Ha, nol butun sakkiz o'ndan. Bir ayirib nol butun o'ttiz olti yuzdan nol butun oltmish to'rt yuzdan, uning ildizi nol butun sakkiz o'ndan.",
          'Да, ноль целых восемь десятых. Один минус ноль целых тридцать шесть сотых это ноль целых шестьдесят четыре сотых, корень из него ноль целых восемь десятых.',
          'Yes, zero point eight. One minus zero point three six is zero point six four, whose root is zero point eight.',
        ),
        items: [
          { id: 'a', right: true, label: '0,8' },
          { id: 'b', label: '0,4', hint: L("Nol butun to'rt o'ndan birdan nol butun olti o'ndanni AYIRGANDA chiqadi. Ayniyatda esa kvadratlar turibdi.", 'Ноль целых четыре десятых выходит при ВЫЧИТАНИИ ноля целых шести десятых из единицы. А в тождестве стоят квадраты.', 'Zero point four comes from SUBTRACTING zero point six from one. The identity has squares.') },
        ],
        solution: ['cos²α = 1 − 0,36 = 0,64', 'cos α = 0,8'],
      },
      {
        expr: 'tg α · tg (90° − α)',
        question: L(
          "Bu ifoda nimaga teng?",
          'Чему равно это выражение?',
          'What does this expression equal?',
        ),
        ok: L(
          "Ha, birga. To'qson daraja ayirib alfaning tangensi alfaning kotangensiga teng, tangens karra kotangens esa bir.",
          'Да, единице. Тангенс девяноста минус альфа это котангенс альфа, а тангенс на котангенс равно один.',
          'Yes, one. The tangent of ninety minus alpha is the cotangent of alpha, and tangent times cotangent is one.',
        ),
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: 'tg²α', hint: L("To'qson daraja ayirib alfa BOSHQA burchak, uning tangensi alfanikiga teng emas. 6-ekranni eslang: rollar almashadi.", 'Девяносто минус альфа это ДРУГОЙ угол, его тангенс не равен тангенсу альфы. Вспомни 6 экран: роли меняются.', 'Ninety minus alpha is a DIFFERENT angle and its tangent is not that of alpha. Recall screen 6: the roles swap.') },
        ],
        solution: ['tg (90° − α) = ctg α', 'tg α · ctg α = 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — sinus burchakka proporsional emas.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Burchak ikki barobar, sinus ham ikki barobarmi",
    'Угол вдвое, синус тоже вдвое?',
    'The angle doubles, does the sine',
  ),
  audio: [
    A('mount',
      "Kamronning fikri. O'ttiz darajaning sinusi nol butun besh o'ndan, demak oltmish darajaniki bir bo'lishi kerak.",
      'Мысль Камрона. Синус тридцати равен ноль целых пять десятых, значит у шестидесяти он должен быть единицей.',
      "Kamron's thought. The sine of thirty is zero point five, so the sine of sixty ought to be one."),
    A('why',
      "Bu javobni tekshirish uchun jadval ham kerak emas.",
      'Чтобы проверить этот ответ, таблица даже не нужна.',
      'No table is needed to check that answer.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Sinus birga faqat to'qson darajada aylanadi, chunki o'shanda qarshi katet gipotenuzaning o'ziga aylanadi. Oltmish darajada esa u nol butun sakkiz yuz oltmish olti mingdan. Umuman olganda, sinus burchakka proporsional emas: yigirma darajadan o'ttizga o'tganda u sezilarli o'sadi, sakson darajadan to'qsonga o'tganda esa deyarli o'zgarmaydi.",
      'Синус обращается в единицу только при девяноста градусах, ведь тогда противолежащий катет становится самой гипотенузой. А при шестидесяти он равен ноль целых восемьсот шестьдесят шесть тысячных. Вообще синус не пропорционален углу: от двадцати к тридцати он заметно растёт, а от восьмидесяти к девяноста почти не меняется.',
      'The sine reaches one only at ninety degrees, where the opposite leg becomes the hypotenuse itself. At sixty it is zero point eight six six. In general the sine is not proportional to the angle: from twenty to thirty it climbs noticeably, from eighty to ninety it barely moves.',
    ),
    tasks: [
      {
        expr: 'sin 30° = 0,5   →   sin 60° = 1 ?',
        question: L(
          "Sinus qanday qiymatlarni qabul qila oladi?",
          'Какие значения может принимать синус?',
          'What values can the sine take?',
        ),
        ok: L(
          "To'g'ri, birdan katta bo'lolmaydi. Sinus bu katetning gipotenuzaga nisbati, katet esa gipotenuzadan uzun bo'la olmaydi.",
          'Верно, больше единицы быть не может. Синус это отношение катета к гипотенузе, а катет не бывает длиннее гипотенузы.',
          'Correct, it cannot exceed one. The sine is a leg over the hypotenuse, and no leg is longer than the hypotenuse.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('Birdan katta emas', 'Не больше единицы', 'No greater than one'),
          },
          {
            id: 'b',
            label: L('Istalgan musbat sonni', 'Любое положительное число', 'Any positive number'),
            hint: L(
              "Nisbatning surati katet, maxraji gipotenuza. Gipotenuza esa uchburchakning eng uzun tomoni, demak kasr birdan oshmaydi.",
              'В числителе катет, в знаменателе гипотенуза. А гипотенуза самая длинная сторона, значит дробь единицу не превысит.',
              'The numerator is a leg, the denominator the hypotenuse. The hypotenuse is the longest side, so the fraction never passes one.',
            ),
          },
        ],
        solution: [
          'sin 60° ≈ 0,866',
          L('sinus 1 dan katta emas', 'синус не больше 1', 'the sine is at most 1'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — o'tmas burchak va daraxt.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "O'lchab bo'lmaydigan narsani hisoblash",
    'Вычислить то, что не измерить',
    'Computing what cannot be measured',
  ),
  audio: [
    A('mount',
      "Birinchi masala darslikdan olindi. ABC uchburchakda A burchagi bir yuz ellik daraja va AC yetti santimetr.",
      'Первая задача взята из учебника. В треугольнике ABC угол A равен ста пятидесяти градусам, а AC семь сантиметров.',
      'The first problem comes from the textbook. In ABC the angle A is one hundred fifty degrees and AC is seven centimetres.'),
    A('why',
      "C uchidan AB tomoniga tushirilgan balandlikni topish kerak.",
      'Нужно найти высоту, опущенную из вершины C на сторону AB.',
      'Find the altitude from C to the side AB.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala masala ham bitta g'oyaga tayanadi: to'g'ridan to'g'ri o'lchab bo'lmaydigan uzunlik burchak orqali hisoblanadi. Aynan shuning uchun trigonometriya yunonchada uchburchaklarni yechish degan ma'noni anglatadi.",
      'Обе задачи держатся на одной идее: длину, которую нельзя измерить напрямую, вычисляют через угол. Именно поэтому тригонометрия по-гречески означает решение треугольников.',
      'Both problems rest on one idea: a length you cannot measure directly is computed through an angle. That is why trigonometry means solving triangles in Greek.',
    ),
    tasks: [
      {
        expr: '∠A = 150°,   AC = 7',
        question: L(
          "C uchidan tushirilgan balandlik nechaga teng?",
          'Чему равна высота из вершины C?',
          'What is the altitude from C?',
        ),
        ok: L(
          "Ha, uch butun besh o'ndan. Balandlik AB ning davomiga tushadi va u yerda o'ttiz darajali burchak hosil bo'ladi.",
          'Да, три целых пять десятых. Высота падает на продолжение AB, и там образуется угол тридцать градусов.',
          'Yes, three point five. The altitude falls on the extension of AB, where an angle of thirty degrees appears.',
        ),
        items: [
          { id: 'a', right: true, label: '3,5' },
          {
            id: 'b',
            label: '7',
            hint: L(
              "Yetti bu AC tomonning o'zi. Balandlik esa undan qisqaroq: yetti karra sinus o'ttiz.",
              'Семь это сама сторона AC. А высота короче: семь на синус тридцати.',
              'Seven is the side AC itself. The altitude is shorter: seven times the sine of thirty.',
            ),
          },
        ],
        solution: ['sin 150° = sin 30° = 0,5', 'h = 7 · 0,5 = 3,5'],
      },
      {
        expr: 's = 12 m,   ∠ = 30°',
        question: L(
          "Soya o'n ikki metr, quyosh burchagi o'ttiz daraja. Daraxtning balandligi nechaga teng?",
          'Тень двенадцать метров, угол солнца тридцать градусов. Чему равна высота дерева?',
          'The shadow is twelve metres and the sun angle thirty degrees. How tall is the tree?',
        ),
        ok: L(
          "Ha, taxminan olti butun to'qqiz o'ndan metr. Balandlik soyaga tangensni ko'paytirish orqali topiladi.",
          'Да, примерно шесть целых девять десятых метра. Высоту находят умножением тени на тангенс.',
          'Yes, about six point nine metres. The height is the shadow times the tangent.',
        ),
        items: [
          { id: 'a', right: true, label: L('≈ 6,9 m', '≈ 6,9 м', '≈ 6.9 m') },
          {
            id: 'b',
            label: L('6 m', '6 м', '6 m'),
            hint: L(
              "Olti bu o'n ikki karra sinus o'ttiz. Bu yerda gipotenuza umuman berilmagan, demak sinus emas, tangens kerak.",
              'Шесть это двенадцать на синус тридцати. Здесь гипотенуза вообще не дана, значит нужен не синус, а тангенс.',
              'Six is twelve times the sine of thirty. No hypotenuse is given here, so the tangent is needed, not the sine.',
            ),
          },
        ],
        solution: ['h = 12 · tg 30°', 'h ≈ 12 · 0,577 ≈ 6,9'],
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
    "Blits: qarshi, yondosh, chegara",
    'Блиц: противолежащий, прилежащий, граница',
    'Blitz: opposite, adjacent, the limit',
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
        tag: 'gipotenuza-orniga-katet',
        ask: L(
          "Sinusning maxrajida nima turadi?",
          'Что стоит в знаменателе синуса?',
          'What stands in the denominator of the sine?',
        ),
        options: [
          { id: 'r', right: true, label: L('Gipotenuza', 'Гипотенуза', 'The hypotenuse') },
          { id: 'w', label: L('Yondosh katet', 'Прилежащий катет', 'The adjacent leg') },
        ],
        ok: L(
          "To'g'ri. Yondosh katet maxrajda turganda bu tangens bo'ladi.",
          'Верно. Если в знаменателе прилежащий катет, это тангенс.',
          'Correct. With the adjacent leg below it becomes the tangent.',
        ),
        hint: L(
          "4-ekranni eslang: sinus ham, kosinus ham gipotenuzaga bo'linardi, faqat suratlari boshqa edi.",
          'Вспомни 4 экран: и синус, и косинус делились на гипотенузу, различались только числители.',
          'Recall screen 4: sine and cosine both divided by the hypotenuse and differed only above.',
        ),
      },
      {
        id: 'q2',
        tag: 'sinus-birdan-katta',
        ask: L(
          "Sinus birdan katta bo'la oladimi?",
          'Может ли синус быть больше единицы?',
          'Can the sine exceed one?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'w', label: L('Katta burchaklarda ha', 'При больших углах да', 'At large angles yes') },
        ],
        ok: L(
          "To'g'ri. Katet gipotenuzadan uzun bo'lolmaydi, demak nisbat birdan oshmaydi.",
          'Верно. Катет не бывает длиннее гипотенузы, значит отношение единицу не превысит.',
          'Correct. No leg outruns the hypotenuse, so the ratio never passes one.',
        ),
        hint: L(
          "12-ekranni eslang: aynan shu tekshiruv Kamronning javobini yiqitgandi.",
          'Вспомни 12 экран: именно эта проверка обрушила ответ Камрона.',
          'Recall screen 12: that very check brought down Kamron answer.',
        ),
      },
      {
        id: 'q3',
        tag: 'sinus-burchakka-proporsional',
        ask: L(
          "sin 60° nol butun besh o'ndanning ikki barobarimi?",
          'Равен ли sin 60° удвоенному ноль целых пяти десятым?',
          'Is sin 60° twice zero point five?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q, u 0,866 ga yaqin", 'Нет, он около 0,866', 'No, it is about 0.866') },
          { id: 'w', label: L('Ha, 1 ga teng', 'Да, равен 1', 'Yes, it is 1') },
        ],
        ok: L(
          "To'g'ri. Sinus burchakka proporsional emas, u birga faqat to'qson darajada yetadi.",
          'Верно. Синус не пропорционален углу, единицы он достигает лишь при девяноста градусах.',
          'Correct. The sine is not proportional to the angle and reaches one only at ninety degrees.',
        ),
        hint: L(
          "Bir degani qarshi katet gipotenuzaning o'ziga teng degani, bu esa faqat to'g'ri burchakda bo'ladi.",
          'Единица означала бы, что катет равен самой гипотенузе, а это бывает только при прямом угле.',
          'One would mean the leg equals the hypotenuse itself, which happens only at a right angle.',
        ),
      },
      {
        id: 'q4',
        tag: 'qarshi-yondosh-almashish',
        ask: L(
          "sin (90° − α) nimaga teng?",
          'Чему равен sin (90° − α)?',
          'What does sin (90° − α) equal?',
        ),
        options: [
          { id: 'r', right: true, label: 'cos α' },
          { id: 'w', label: 'sin α' },
        ],
        ok: L(
          "To'g'ri. Ikkinchi o'tkir burchak uchun katetlarning rollari almashadi.",
          'Верно. У второго острого угла роли катетов меняются местами.',
          'Correct. For the other acute angle the legs swap roles.',
        ),
        hint: L(
          "6-ekranni eslang: alfaga qarshi bo'lgan katet ikkinchi burchakka yondosh bo'lib qolgandi.",
          'Вспомни 6 экран: катет, противолежащий альфе, для второго угла стал прилежащим.',
          'Recall screen 6: the leg opposite alpha became the adjacent one for the other angle.',
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
    "Burchak bitta sonni belgilaydi",
    'Угол задаёт одно число',
    'An angle fixes one number',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda birlik aylananing nol butun besh o'ndani sakkiz marta katta uchburchakda ham ishladi.",
      'На первом экране ноль целых пять десятых с единичной окружности сработали и в треугольнике в восемь раз больше.',
      'On the first screen the zero point five from the unit circle worked in a triangle eight times larger.'),
    A('s1',
      "Siz buning sababini o'xshashlikdan topdingiz, uchta nisbatni ajratdingiz va o'lchab bo'lmaydigan balandlikni hisobladingiz.",
      'Ты нашёл причину в подобии, различил три отношения и вычислил высоту, которую нельзя измерить.',
      'You found the reason in similarity, told the three ratios apart, and computed a height no one could measure.'),
    A('s2',
      "Keyingi darsda sinuslar teoremasi.",
      'В следующем уроке теорема синусов.',
      'The next lesson covers the law of sines.'),
  ],
  props: {
    mark: 'sin α = a : c',
    markNote: L(
      "nisbat uchburchakning kattaligiga bog'liq emas",
      'отношение не зависит от размера треугольника',
      'the ratio does not depend on the size',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: sinuslar teoremasi',
      'Следующий урок: теорема синусов',
      'Next lesson: the law of sines',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'sinus-burchakka-proporsional', ...S2 },
  { role: 'explain',  tag: 'sinus-burchakka-proporsional', ...S3 },
  { role: 'explain',  tag: 'qarshi-yondosh-almashish', ...S4 },
  { role: 'explain',  tag: 'gipotenuza-orniga-katet', ...S5 },
  { role: 'explain',  tag: 'qarshi-yondosh-almashish', ...S6 },
  { role: 'explain',  tag: 'sinus-birdan-katta', ...S7 },
  { role: 'rule',     tag: 'sinus-burchakka-proporsional', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'qarshi-yondosh-almashish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'gipotenuza-orniga-katet', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'qarshi-yondosh-almashish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'sinus-birdan-katta', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'sinus-birdan-katta', ...S13 },
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
