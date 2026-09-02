// ============================================================================
// 9-sinf, Dars 51. MASALALAR YECHISH: IKKALA TEOREMA BIRGA.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 33-dars (96-97-bet),
// qisman 30-dars (88-bet).
//   1-masala (96-bet): parallelogramm diagonallari kvadratlarining
//       yig'indisi tomonlar kvadratlari yig'indisining ikkilanganiga
//       teng: d₁² + d₂² = 2(a² + b²). Isbot: ikkita uchburchakka
//       kosinuslar teoremasi va cos(180° − α) = −cos α.
//   2-masala (96-bet): ∠A = 30°, AB = 4, AC = √3 → BC = √7,
//       S = √3, A uchidan tushirilgan balandlik AD = 2√21 : 7.
//   3-masala (96-97-bet): tezlik va burchaklar bo'yicha kesishma
//       nuqtagacha bo'lgan masofalar; sinuslar teoremasi.
//   33.4: tomonlari 7 va 11, uchinchi tomonga tushirilgan medianasi
//       6 → uchinchi tomon 14.
//   33.5: tomonlari 6 va 8, bir diagonali 12 → ikkinchisi 2√14.
//   33.6: tomoni 18, qarshi burchagi 60° → tashqi aylana radiusi 6√3.
//   33.7: teng yonli trapetsiya, kichik asosi yon tomoniga teng,
//       katta asosi 20, burchagi 120° → perimetri 50.
//
// DIQQAT, METODISTGA. Rejada bu dars «DTM masalalari (1-qism)» deb
// nomlangan, ETALON_9SINF.md esa Б7 blokini «profil DTM mutaxassisi
// bilan kelishuvni kutmoqda» deb belgilaydi — bu alohida geyt.
// Shuning uchun bu yerda 10 va 11-sinfdagi kabi DTM REJIMI (ikkinchi
// anatomiya, soat, bo'shliqlar xaritasi) YASALMADI: uni yasash
// grade8/screens.jsx umumiy qatlamini o'zgartirishni talab qiladi,
// ya'ni 9-sinfning ellik va 8-sinfning ellik besh darsiga tegadi.
// Dars darslikning 33-darsi bo'yicha «masalalar yechish» sifatida
// yig'ildi: mavzu ham, mashqlar ham darslikdan. DTM rejimi kerak
// bo'lsa, u alohida qaror bilan va umumiy qatlamdan boshlab
// kiritiladi.
//
// DARSNING O'ZAGI — KO'P QADAMLI MASALA. 46-50-darslarda har bir
// qurol alohida berilgan edi, bu yerda esa bitta masalada ikkitasi
// ham kerak bo'ladi va yechim uch qadamgacha cho'ziladi. Xuk shuni
// ko'rsatadi: medianasi berilgan uchburchakda na sinuslar, na
// kosinuslar teoremasi to'g'ridan to'g'ri ishlamaydi — avval chizmani
// TO'LDIRISH kerak.
//
// TUZOQ (12-ekran): ko'p qadamli masalada oxirgi qadamni tashlab
// ketish. Kamron balandlikni topish o'rniga yuzni javob deb yozgan.
// Bu eng ko'p uchraydigan yo'qotish: hisob to'g'ri, savolga javob
// yo'q.
//
// TRANSFER (13-ekran): darslikning 3-masalasi — qoidabuzar haydovchi
// va DAN xodimi. Sinuslar teoremasi ikki marta qo'llaniladi, keyin
// vaqt hisoblanadi. Javob «yo'q» bo'lib chiqadi va bu geometriyaning
// hayotdagi ishlashini ko'rsatadi.
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
  id: 'grade9-51',
  n: 51,
  row: 51,
  block: 'Б7',
  topic: L(
    "Masalalar yechish: ikkala teorema birga",
    'Решение задач: обе теоремы вместе',
    'Solving problems: both theorems together',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Ko'p qadamli masalada avval chizma to'ldiriladi, keyin teorema tanlanadi",
    'В многошаговой задаче сначала достраивают чертёж, потом выбирают теорему',
    'In a multi step problem the drawing is completed first, then a theorem is chosen',
  ),
  L(
    "Parallelogramm diagonallari uchun d₁² + d₂² = 2(a² + b²)",
    'Для диагоналей параллелограмма d₁² + d₂² = 2(a² + b²)',
    'For the diagonals of a parallelogram d₁² + d₂² = 2(a² + b²)',
  ),
  L(
    "Oxirgi qadam savolga qaytish: nima so'ralganini tekshirish",
    'Последний шаг это возврат к вопросу: что именно спрашивали',
    'The last step is returning to the question: what exactly was asked',
  ),
]

export const MISS = {
  'oxirgi-qadamni-tashlash': {
    what: L(
      "oraliq natija javob deb yozildi",
      'промежуточный результат записан как ответ',
      'an intermediate result was written as the answer',
    ),
    wrong: null,
    at: 0,
  },
  'chizmani-toldirmaslik': {
    what: L(
      "chizma to'ldirilmadi va teorema ishga tushmadi",
      'чертёж не достроен, и теорема не запустилась',
      'the drawing was not completed and no theorem could start',
    ),
    wrong: null,
    at: 0,
  },
  'notogri-teorema': {
    what: L(
      "berilganga mos kelmaydigan teorema tanlandi",
      'выбрана теорема, не соответствующая данным',
      'a theorem was chosen that does not match the data',
    ),
    wrong: null,
    at: 0,
  },
  'mediana-diagonal-farqi': {
    what: L(
      "mediana diagonal bilan chalkashtirildi",
      'медиана перепутана с диагональю',
      'a median was confused with a diagonal',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — mediana berilgan.
// ============================================================
const S1 = {
  eyebrow: L('MEDIANA', 'МЕДИАНА', 'A MEDIAN'),
  title: L(
    "Ikkala teorema ham to'g'ridan to'g'ri ishlamaydi",
    'Ни одна теорема не работает напрямую',
    'Neither theorem works directly',
  ),
  audio: [
    A('mount',
      "Uchburchakning ikkita tomoni yetti va o'n bir, uchinchi tomonga tushirilgan medianasi esa olti. Uchinchi tomonni topish kerak.",
      'Две стороны треугольника семь и одиннадцать, а медиана к третьей стороне шесть. Нужно найти третью сторону.',
      'Two sides of a triangle are seven and eleven, and the median to the third side is six. Find the third side.'),
    A('why',
      "Kosinuslar teoremasi uchun burchak kerak, sinuslar teoremasi uchun ham. Medianani esa ikkala teorema ham bilmaydi.",
      'Теореме косинусов нужен угол, теореме синусов тоже. А про медиану ни одна из них не знает.',
      'The law of cosines needs an angle and so does the law of sines. And neither knows anything about a median.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[7, 11, 14]}
          names={['A', 'B', 'C']}
          edges={{ a: '7', b: '11', c: '?' }}
        />
      }
      steps={[]}
      ask={L(
        "Bunday masalada birinchi qadam qanday bo'ladi?",
        'Каким будет первый шаг в такой задаче?',
        'What is the first step in such a problem?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Chizmani to'ldirish, ya'ni yordamchi chiziq o'tkazish",
            'Достроить чертёж, то есть провести вспомогательную линию',
            'Complete the drawing, that is add an auxiliary line',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Kosinuslar teoremasini yozib, burchakni belgilash",
            'Записать теорему косинусов и обозначить угол',
            'Write the law of cosines and name the angle',
          ),
          hint: L(
            "Noma'lum burchakni belgilash tenglamaga yana bitta noma'lum qo'shadi. Bu yerda esa medianani boshqa narsaga aylantirish kerak.",
            'Обозначение неизвестного угла добавит в уравнение ещё одно неизвестное. А здесь нужно превратить медиану во что то другое.',
            'Naming an unknown angle adds one more unknown to the equation. Here the median must be turned into something else.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun ko'p qadamli masalalarni yechamiz va ularning birinchi qadami deyarli har doim chizma bilan bog'liq.",
        'Верно. Сегодня решаем многошаговые задачи, и первый шаг в них почти всегда связан с чертежом.',
        'Correct. Today we solve multi step problems, and their first step nearly always concerns the drawing.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — 48-darsning teoremasi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qo'shni burchaklarning kosinuslari",
    'Косинусы смежных углов',
    'The cosines of supplementary angles',
  ),
  audio: [
    A('mount',
      "Parallelogrammning qo'shni burchaklari yig'indisi bir yuz saksonga teng.",
      'Сумма соседних углов параллелограмма сто восемьдесят.',
      'Adjacent angles of a parallelogram sum to one hundred eighty.'),
    A('why',
      "46-darsda bunday burchaklarning kosinuslari haqida nima aytilgandi.",
      'Что на 46 уроке говорилось о косинусах таких углов.',
      'What did lesson 46 say about the cosines of such angles.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('cos (180° − α) = ?', 'cos (180° − α) = ?', 'cos (180° − α) = ?')}
      steps={[]}
      ask={L(
        "Bu nimaga teng?",
        'Чему это равно?',
        'What does this equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '−cos α' },
        {
          id: 'wrong',
          label: 'cos α',
          hint: L(
            "Ishorasini o'zgartirmaydigan sinus edi. Kosinus esa chap yarim tekislikda manfiy bo'lib qoladi.",
            'Знак не менял синус. А косинус в левой полуплоскости становится отрицательным.',
            'It was the sine that kept its sign. The cosine turns negative in the left half plane.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugungi birinchi natija aynan shu ishoraga tayanadi.",
        'Верно. Первый сегодняшний результат опирается именно на этот знак.',
        'Correct. Today first result rests on that very sign.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — diagonallar formulasi.
// ============================================================
const S3 = {
  eyebrow: L('DIAGONALLAR', 'ДИАГОНАЛИ', 'THE DIAGONALS'),
  title: L(
    "Ikkita tenglikni qo'shamiz",
    'Складываем два равенства',
    'Adding the two equalities',
  ),
  audio: [
    A('mount',
      "Parallelogrammning ikkita uchburchagiga kosinuslar teoremasini yozamiz. Birinchisida burchak alfa, ikkinchisida bir yuz sakson ayirib alfa.",
      'Запишем теорему косинусов для двух треугольников параллелограмма. В первом угол альфа, во втором сто восемьдесят минус альфа.',
      'Write the law of cosines for the two triangles of a parallelogram. The first has the angle alpha, the second one hundred eighty minus alpha.'),
    A('why',
      "Ikkinchisida kosinus ishorasini o'zgartiradi, ya'ni ayirish qo'shishga aylanadi.",
      'Во втором косинус меняет знак, то есть вычитание превращается в сложение.',
      'In the second the cosine flips sign, so the subtraction turns into addition.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'd₁² = a² + b² − 2ab · cos α,   d₂² = a² + b² + 2ab · cos α',
        'd₁² = a² + b² − 2ab · cos α,   d₂² = a² + b² + 2ab · cos α',
        'd₁² = a² + b² − 2ab · cos α,   d₂² = a² + b² + 2ab · cos α',
      )}
      steps={[]}
      ask={L(
        "Ikkalasini qo'shsak, nima chiqadi?",
        'Что получится, если их сложить?',
        'What comes out if they are added?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'd₁² + d₂² = 2(a² + b²)' },
        {
          id: 'wrong',
          label: 'd₁² + d₂² = 2(a² + b²) − 4ab · cos α',
          hint: L(
            "Kosinusli qo'shiluvchilar bir xil, lekin ishoralari qarama-qarshi. Qo'shganda ular bir birini yo'q qiladi.",
            'Слагаемые с косинусом одинаковы, но знаки у них противоположны. При сложении они уничтожают друг друга.',
            'The cosine terms are the same but their signs oppose. Adding them cancels both.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Burchak butunlay yo'qoldi, ya'ni bu tenglik istalgan parallelogramm uchun o'rinli. Bu darslikning birinchi masalasi.",
        'Верно. Угол исчез полностью, значит равенство верно для любого параллелограмма. Это первая задача учебника.',
        'Correct. The angle vanished entirely, so the equality holds for any parallelogram. This is the first textbook problem.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — mediana diagonalga aylanadi.
// ============================================================
const S4 = {
  eyebrow: L('YORDAMCHI CHIZIQ', 'ВСПОМОГАТЕЛЬНАЯ ЛИНИЯ', 'THE AUXILIARY LINE'),
  title: L(
    "Medianani ikki barobar uzaytiramiz",
    'Продлим медиану вдвое',
    'Double the median',
  ),
  audio: [
    A('mount',
      "Xukka qaytamiz. Medianani uning o'zi qadar uzaytirsak, parallelogramm hosil bo'ladi.",
      'Вернёмся к хуку. Если продлить медиану на её же длину, получится параллелограмм.',
      'Back to the hook. Extending the median by its own length makes a parallelogram.'),
    A('why',
      "Uchburchakning ikkita tomoni parallelogrammning tomonlari bo'ladi, mediananing ikkilangani esa diagonali.",
      'Две стороны треугольника станут сторонами параллелограмма, а удвоенная медиана диагональю.',
      'The two sides of the triangle become sides of the parallelogram and the doubled median becomes a diagonal.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a = 7,   b = 11,   m = 6', 'a = 7,   b = 11,   m = 6', 'a = 7,   b = 11,   m = 6')}
      steps={[
        { id: 'a', head: L('Parallelogramm', 'Параллелограмм', 'The parallelogram'), lines: ['d₁ = 2m = 12', 'd₂ = c'] },
      ]}
      ask={L(
        "Uchinchi tomon nechaga teng?",
        'Чему равна третья сторона?',
        'What is the third side?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '14' },
        {
          id: 'wrong',
          label: '12',
          hint: L(
            "O'n ikki bu mediananing ikkilangani, ya'ni BIRINCHI diagonal. Ikkinchisini formuladan topish kerak: bir yuz qirq to'rt qo'shuv c kvadrat teng ikki karra yuz.",
            'Двенадцать это удвоенная медиана, то есть ПЕРВАЯ диагональ. Вторую нужно найти из формулы: сто сорок четыре плюс c квадрат равно двум на сто.',
            'Twelve is the doubled median, the FIRST diagonal. The second comes from the formula: one hundred forty four plus c squared equals twice one hundred.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir yuz qirq to'rt qo'shuv c kvadrat teng ikki yuz, demak c kvadrat bir yuz to'qson olti va c o'n to'rtga teng. Bu darslikning o'ttiz uch nuqta to'rtinchi mashqi.",
        'Верно. Сто сорок четыре плюс c квадрат равно двести, значит c квадрат сто девяносто шесть и c равно четырнадцати. Это задача тридцать три точка четыре учебника.',
        'Correct. One hundred forty four plus c squared is two hundred, so c squared is one hundred ninety six and c is fourteen. This is exercise thirty three point four.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — uch qadamli masala, birinchi qadam.
// ============================================================
const S5 = {
  eyebrow: L('UCH QADAM', 'ТРИ ШАГА', 'THREE STEPS'),
  title: L(
    "Balandlikni topish uchun uchta qadam",
    'До высоты три шага',
    'Three steps to the altitude',
  ),
  audio: [
    A('mount',
      "Darslikning ikkinchi masalasi. A burchagi o'ttiz daraja, AB to'rt, AC ildiz uch. A uchidan tushirilgan balandlikni topish kerak.",
      'Вторая задача учебника. Угол A тридцать градусов, AB четыре, AC корень из трёх. Нужно найти высоту из вершины A.',
      'The second textbook problem. The angle A is thirty degrees, AB is four, AC is root three. Find the altitude from A.'),
    A('why',
      "Balandlik BC tomoniga tushadi, BC esa hali noma'lum.",
      'Высота падает на сторону BC, а BC пока неизвестна.',
      'The altitude falls on BC and BC is not yet known.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('∠A = 30°,   AB = 4,   AC = √3', '∠A = 30°,   AB = 4,   AC = √3', '∠A = 30°,   AB = 4,   AC = √3')}
      steps={[]}
      ask={L(
        "Birinchi qadamda nima topiladi?",
        'Что находят на первом шаге?',
        'What is found on the first step?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('BC tomon', 'Сторона BC', 'The side BC') },
        {
          id: 'wrong',
          label: L('Darhol balandlik', 'Сразу высота', 'The altitude at once'),
          hint: L(
            "Balandlik BC ga tushadi, ya'ni uni topish uchun BC ning uzunligi kerak bo'ladi. Berilganlar esa ikkita tomon va ular orasidagi burchak.",
            'Высота падает на BC, значит для неё нужна длина BC. А дано две стороны и угол между ними.',
            'The altitude falls on BC, so its length is needed. And the data are two sides with the angle between them.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Kosinuslar teoremasi: o'n olti qo'shuv uch ayirib o'n ikki, ya'ni BC kvadrat yetti va BC ildiz yetti.",
        'Верно. Теорема косинусов: шестнадцать плюс три минус двенадцать, то есть BC квадрат семь и BC корень из семи.',
        'Correct. The law of cosines: sixteen plus three minus twelve, so BC squared is seven and BC is root seven.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — ikkinchi va uchinchi qadam.
// ============================================================
const S6 = {
  eyebrow: L('YUZ ORQALI', 'ЧЕРЕЗ ПЛОЩАДЬ', 'THROUGH THE AREA'),
  title: L(
    "Yuz ikkita yo'l bilan yoziladi",
    'Площадь записывают двумя способами',
    'The area gets written two ways',
  ),
  audio: [
    A('mount',
      "BC topildi. Endi yuzni ikkita usulda yozamiz: berilganlar orqali va balandlik orqali.",
      'BC найдена. Теперь запишем площадь двумя способами: через данные и через высоту.',
      'BC is found. Now write the area two ways: through the data and through the altitude.'),
    A('why',
      "Bu 50-darsning usuli: yuz javob emas, vosita.",
      'Это приём 50 урока: площадь не ответ, а средство.',
      'This is the trick of lesson 50: the area is a means, not an answer.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('S = √3,   BC = √7', 'S = √3,   BC = √7', 'S = √3,   BC = √7')}
      steps={[
        { id: 'a', head: L('Ikkinchi yozuv', 'Вторая запись', 'The second form'), lines: ['S = ½ · BC · AD'] },
      ]}
      ask={L(
        "Balandlik AD nimaga teng?",
        'Чему равна высота AD?',
        'What does the altitude AD equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '2√3 : √7' },
        {
          id: 'wrong',
          label: '√3 : √7',
          hint: L(
            "Formulada yarim ko'paytuvchi bor: yuz teng yarim karra BC karra AD. Demak AD ni topish uchun yuzni IKKIGA ko'paytirib, BC ga bo'lish kerak.",
            'В формуле есть множитель одна вторая: площадь равна половине BC на AD. Значит для AD площадь нужно УДВОИТЬ и разделить на BC.',
            'The formula has the half: the area is half BC times AD. So AD needs the area DOUBLED and divided by BC.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Maxrajni ildizdan qutqarsak, javob ikki karra ildiz yigirma bir bo'lingan yetti bo'ladi. Darslikning javobi ham shunday.",
        'Верно. Избавившись от корня в знаменателе, получим два корня из двадцати одного делить на семь. Ответ учебника такой же.',
        'Correct. Clearing the root from the denominator gives two root twenty one over seven. The textbook answer agrees.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — qurollar xaritasi.
// ============================================================
const S7 = {
  eyebrow: L('XARITA', 'КАРТА', 'THE MAP'),
  title: L(
    "Qaysi ma'lumot qaysi qurolni chaqiradi",
    'Какие данные какой инструмент зовут',
    'Which data call which tool',
  ),
  audio: [
    A('mount',
      "Blokda beshta qurol yig'ildi: sinus ta'rifi, sinuslar teoremasi, kosinuslar teoremasi, yuz formulasi va diagonallar tengligi.",
      'В блоке собрано пять инструментов: определение синуса, теорема синусов, теорема косинусов, формула площади и равенство диагоналей.',
      'The block gathered five tools: the definition of the sine, the law of sines, the law of cosines, the area formula and the diagonal identity.'),
    A('why',
      "Masala boshida bitta savol beriladi: nima berilgan.",
      'В начале задачи задают один вопрос: что дано.',
      'At the start of a problem one question is asked: what is given.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Tomoni 18, unga qarshi burchak 60°. Tashqi aylananing radiusi so'ralgan",
        'Сторона 18, против неё угол 60°. Спрашивают радиус описанной окружности',
        'A side of 18 faces an angle of 60°. The circumradius is asked',
      )}
      steps={[]}
      ask={L(
        "Qaysi qurol kerak?",
        'Какой инструмент нужен?',
        'Which tool is needed?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Sinuslar teoremasi', 'Теорема синусов', 'The law of sines') },
        {
          id: 'wrong',
          label: L('Kosinuslar teoremasi', 'Теорема косинусов', 'The law of cosines'),
          hint: L(
            "Kosinuslar teoremasida radius umuman qatnashmaydi. Ikki R esa aynan sinuslar teoremasining o'ng tomonida turibdi.",
            'В теореме косинусов радиуса нет вовсе. А два R стоит как раз в правой части теоремы синусов.',
            'The law of cosines has no radius at all. And two R sits on the right side of the law of sines.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki R teng o'n sakkiz bo'lingan sinus oltmish, ya'ni radius olti ildiz uch. Bu darslikning o'ttiz uch nuqta oltinchi mashqi.",
        'Верно. Два R равно восемнадцать на синус шестидесяти, значит радиус шесть корней из трёх. Это задача тридцать три точка шесть учебника.',
        'Correct. Two R is eighteen over the sine of sixty, so the radius is six root three. This is exercise thirty three point six.',
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
    'Geometriya 9, 33-dars (96-97-bet)',
    'Геометрия 9, урок 33 (стр. 96-97)',
    'Geometry 9, lesson 33 (p. 96-97)',
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
          "Ko'p qadamli masalada eng ko'p nima yo'qoladi?",
          'Что чаще всего теряют в многошаговой задаче?',
          'What gets lost most often in a multi step problem?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Oxirgi qadam: oraliq natija javob deb yoziladi",
              'Последний шаг: промежуточный результат пишут как ответ',
              'The last step: an intermediate result is written as the answer',
            ),
          },
          {
            id: 'wrong',
            label: L(
              "Formulalar: ular esdan chiqadi",
              'Формулы: их забывают',
              'The formulas: they get forgotten',
            ),
            hint: L(
              "Formulani unutsangiz, ish umuman boshlanmaydi va buni darhol sezasiz. Oxirgi qadamning yo'qligi esa sezilmaydi: hisob to'g'ri, javob esa boshqa savolniki.",
              'Забыв формулу, ты вообще не начнёшь и сразу это заметишь. А пропуск последнего шага незаметен: счёт верный, но ответ на другой вопрос.',
              'Forget a formula and you cannot start at all, which you notice at once. A missing last step goes unnoticed: the arithmetic is right but the answer belongs to another question.',
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
    "Chizma, qurol, savolga qaytish",
    'Чертёж, инструмент, возврат к вопросу',
    'The drawing, the tool, the question again',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz ikkita ko'p qadamli masalani yechdingiz va qurollar xaritasini ko'rdingiz.",
      'На семи экранах ты решил две многошаговые задачи и увидел карту инструментов.',
      'On seven screens you solved two multi step problems and saw the map of tools.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — diagonallar va medianalar.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Bitta formula, ikkita masala",
    'Одна формула, две задачи',
    'One formula, two problems',
  ),
  audio: [
    A('mount',
      "Darslikning o'ttiz uch nuqta beshinchi va o'ttiz uch nuqta to'rtinchi mashqlari.",
      'Задачи тридцать три точка пять и тридцать три точка четыре учебника.',
      'Exercises thirty three point five and thirty three point four.'),
    A('why',
      "Ikkalasi ham diagonallar tengligiga tayanadi.",
      'Обе опираются на равенство диагоналей.',
      'Both rest on the diagonal identity.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Bitta formula ikkita boshqacha ko'ringan masalani yopdi, chunki mediana uzaytirilgach diagonalga aylanadi.",
      'Обе решены. Одна формула закрыла две внешне разные задачи, потому что продлённая медиана становится диагональю.',
      'Both are solved. One formula closed two seemingly different problems, because an extended median becomes a diagonal.',
    ),
    tasks: [
      {
        expr: 'a = 6,   b = 8,   d₁ = 12',
        question: L(
          "Ikkinchi diagonal nechaga teng?",
          'Чему равна вторая диагональ?',
          'What is the second diagonal?',
        ),
        ok: L("Ha, ikki ildiz o'n to'rt, taxminan yetti butun besh o'ndan.", 'Да, два корня из четырнадцати, примерно семь целых пять десятых.', 'Yes, two root fourteen, about seven point five.'),
        items: [
          { id: 'a', right: true, label: '2√14' },
          { id: 'b', label: '10', hint: L("Formulaga qo'ying: bir yuz qirq to'rt qo'shuv d ikkinchi kvadrat teng ikki karra yuz. Bundan d ikkinchi kvadrat ellik olti.", 'Подставь в формулу: сто сорок четыре плюс d второе квадрат равно двум на сто. Отсюда d второе квадрат пятьдесят шесть.', 'Substitute: one hundred forty four plus d two squared equals twice one hundred. So d two squared is fifty six.') },
        ],
        solution: ['144 + d₂² = 2 · (36 + 64)', 'd₂² = 56'],
      },
      {
        expr: 'a = 7,   b = 11,   m = 6',
        question: L(
          "Uchinchi tomon nechaga teng?",
          'Чему равна третья сторона?',
          'What is the third side?',
        ),
        ok: L("Ha, o'n to'rt.", 'Да, четырнадцать.', 'Yes, fourteen.'),
        items: [
          { id: 'a', right: true, label: '14' },
          { id: 'b', label: '18', hint: L("Mediana ikki barobar uzaytirilgach diagonal bo'ladi, ya'ni birinchi diagonal o'n ikki. Yig'indi esa ikki karra yetmish to'qqiz qo'shuv bir yuz yigirma bir.", 'Продлённая вдвое медиана становится диагональю, то есть первая диагональ двенадцать. А сумма это два на сорок девять плюс сто двадцать один.', 'The doubled median becomes a diagonal, so the first is twelve. The sum is twice forty nine plus one hundred twenty one.') },
        ],
        solution: ['144 + c² = 2 · (49 + 121)', 'c² = 196,   c = 14'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — yuz va tomon.
// ============================================================
const S10 = {
  eyebrow: L('YUZDAN TOMONGA', 'ОТ ПЛОЩАДИ К СТОРОНЕ', 'FROM AREA TO SIDE'),
  title: L(
    "Darslikning to'rtinchi rasmi",
    'Четвёртый рисунок учебника',
    'The fourth figure of the textbook',
  ),
  audio: [
    A('mount',
      "Ikkita chizmada yuz va bitta tomon berilgan, ikkinchi tomonni topish kerak.",
      'На двух чертежах даны площадь и одна сторона, найти нужно вторую.',
      'Two drawings give an area and one side; find the other side.'),
    A('why',
      "Yuz formulasini teskari o'girish kerak.",
      'Формулу площади нужно развернуть.',
      'The area formula must be turned around.'),
  ],
  props: {
    stepLabel: L('Chizma', 'Чертёж', 'Drawing'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Bu darslikning o'ttiz uch nuqta birinchi mashqi. Ikkinchisida javob butun son chiqdi, chunki sinus o'ttiz aynan yarimga teng.",
      'Обе найдены. Это задача тридцать три точка один учебника. Во второй ответ вышел целым, потому что синус тридцати равен ровно половине.',
      'Both are found. This is exercise thirty three point one. The second came out whole because the sine of thirty is exactly a half.',
    ),
    tasks: [
      {
        expr: 'S = 12,   b = 8,   ∠ = 60°',
        question: L('x nechaga teng?', 'Чему равно x?', 'What does x equal?'),
        ok: L("Ha, ikki ildiz uch, taxminan uch butun besh o'ndan.", 'Да, два корня из трёх, примерно три целых пять десятых.', 'Yes, two root three, about three point five.'),
        items: [
          { id: 'a', right: true, label: '2√3' },
          { id: 'b', label: '3', hint: L("Tenglamani yozing: o'n ikki teng yarim karra sakkiz karra x karra sinus oltmish. Sinus oltmish esa ildiz uch bo'lingan ikki.", 'Запиши уравнение: двенадцать равно половине на восемь на x на синус шестидесяти. А синус шестидесяти корень из трёх пополам.', 'Write the equation: twelve equals half of eight times x times the sine of sixty. That sine is root three over two.') },
        ],
        solution: ['12 = ½ · 8 · x · (√3/2)', 'x = 24 : (4√3) = 2√3'],
      },
      {
        expr: 'S = 60,   b = 15,   ∠ = 30°',
        question: L('x nechaga teng?', 'Чему равно x?', 'What does x equal?'),
        ok: L("Ha, o'n olti.", 'Да, шестнадцать.', 'Yes, sixteen.'),
        items: [
          { id: 'a', right: true, label: '16' },
          { id: 'b', label: '8', hint: L("Yarim karra o'n besh karra nol butun besh o'ndan uch butun yetmish besh yuzdanga teng. Oltmishni shunga bo'ling.", 'Половина на пятнадцать на ноль целых пять десятых это три целых семьдесят пять сотых. Раздели шестьдесят на это.', 'Half of fifteen times zero point five is three point seven five. Divide sixty by that.') },
        ],
        solution: ['60 = ½ · 15 · x · 0,5', 'x = 60 : 3,75 = 16'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — trapetsiya.
// ============================================================
const S11 = {
  eyebrow: L('TRAPETSIYA', 'ТРАПЕЦИЯ', 'A TRAPEZIUM'),
  title: L(
    "Burchak tomonni ochib beradi",
    'Угол раскрывает сторону',
    'The angle unlocks the side',
  ),
  audio: [
    A('mount',
      "Teng yonli trapetsiyaning kichik asosi yon tomoniga teng, katta asosi yigirma, bir burchagi esa bir yuz yigirma daraja.",
      'У равнобедренной трапеции меньшее основание равно боковой стороне, большее двадцать, а один угол сто двадцать градусов.',
      'An isosceles trapezium has its shorter base equal to a leg, the longer base twenty, and one angle of one hundred twenty degrees.'),
    A('why',
      "Yon tomonlarni asosga proyeksiyalasak, katta asos uchta bo'lakka ajraladi.",
      'Если спроецировать боковые стороны на основание, большее основание разделится на три куска.',
      'Projecting the legs onto the base splits the longer base into three pieces.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Perimetr ellikka teng. Bu darslikning o'ttiz uch nuqta yettinchi mashqi. Bu yerda ham birinchi qadam chizma bilan bog'liq bo'ldi: proyeksiyalar o'tkazilmaguncha tenglama yozilmaydi.",
      'Периметр равен пятидесяти. Это задача тридцать три точка семь учебника. И здесь первый шаг оказался связан с чертежом: пока не проведены проекции, уравнение не записать.',
      'The perimeter is fifty. This is exercise thirty three point seven. Here too the first step was the drawing: no equation until the projections are drawn.',
    ),
    tasks: [
      {
        expr: 'a,   ∠ = 120°',
        question: L(
          "Yon tomonning katta asosdagi proyeksiyasi nechaga teng?",
          'Чему равна проекция боковой стороны на большее основание?',
          'What is the projection of a leg on the longer base?',
        ),
        ok: L(
          "Ha, a ning yarmi. Katta asosdagi burchak oltmish daraja va kosinus oltmish nol butun besh o'ndan.",
          'Да, половина a. Угол при большем основании шестьдесят градусов, а косинус шестидесяти ноль целых пять десятых.',
          'Yes, half of a. The angle at the longer base is sixty degrees and the cosine of sixty is zero point five.',
        ),
        items: [
          { id: 'a', right: true, label: 'a : 2' },
          {
            id: 'b',
            label: 'a',
            hint: L(
              "Proyeksiya yon tomonning o'zi emas, uning gorizontal qismi. U yon tomon karra kosinusga teng.",
              'Проекция это не сама боковая сторона, а её горизонтальная часть. Она равна стороне на косинус.',
              'A projection is not the leg itself but its horizontal part, the leg times the cosine.',
            ),
          },
        ],
        solution: ['∠ = 180° − 120° = 60°', 'a · cos 60° = a : 2'],
      },
      {
        expr: '20 = a + a/2 + a/2',
        question: L(
          "Trapetsiyaning perimetri nechaga teng?",
          'Чему равен периметр трапеции?',
          'What is the perimeter of the trapezium?',
        ),
        ok: L("Ha, ellik. Yon tomon o'nga teng, kichik asos ham o'n.", 'Да, пятьдесят. Боковая сторона десять, меньшее основание тоже десять.', 'Yes, fifty. The leg is ten and the shorter base is ten as well.'),
        items: [
          { id: 'a', right: true, label: '50' },
          { id: 'b', label: '40', hint: L("Perimetrga to'rtta tomon kiradi: katta asos yigirma, kichik asos o'n va ikkita yon tomon o'ndan.", 'В периметр входят четыре стороны: большее основание двадцать, меньшее десять и две боковые по десять.', 'The perimeter has four sides: the longer base twenty, the shorter ten, and two legs of ten.') },
        ],
        solution: ['2a = 20   →   a = 10', 'P = 20 + 10 + 10 + 10 = 50'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — oxirgi qadam.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Hisob to'g'ri, javob boshqa savolniki",
    'Счёт верный, ответ на другой вопрос',
    'The arithmetic is right, the answer is not',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Ikkinchi masalada u BC ni ildiz yetti deb, yuzni ildiz uch deb to'g'ri topgan va javobga ildiz uchni yozgan.",
      'Решение Камрона. Во второй задаче он верно нашёл BC как корень из семи и площадь как корень из трёх, а в ответ записал корень из трёх.',
      "Kamron's solution. In the second problem he correctly found BC as root seven and the area as root three, and wrote root three as the answer."),
    A('why',
      "Ikkala hisob ham to'g'ri. Savol esa boshqa narsani so'ragan edi.",
      'Оба вычисления верны. А спрашивали другое.',
      'Both computations are right. But the question asked for something else.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bunday xatoni tekshirishning eng ishonchli yo'li bor: javobni yozishdan oldin savolni qayta o'qish va o'lchov birligiga qarash. Yuz kvadrat birlikda, balandlik esa oddiy uzunlikda o'lchanadi — ya'ni ildiz uch bu yerda javob bo'lolmaydi.",
      'У такой ошибки есть надёжная проверка: перед записью ответа перечитать вопрос и посмотреть на единицы. Площадь измеряется в квадратных единицах, а высота в обычных — значит корень из трёх здесь ответом быть не может.',
      'There is a reliable check for this slip: reread the question before writing the answer and look at the units. An area is in square units and a height in plain ones, so root three cannot be the answer here.',
    ),
    tasks: [
      {
        expr: 'S = √3,   BC = √7   →   AD = √3 ?',
        question: L(
          "Masalada nima so'ralgan edi?",
          'Что спрашивали в задаче?',
          'What did the problem ask for?',
        ),
        ok: L(
          "To'g'ri, balandlik. Yuz esa faqat oraliq natija edi.",
          'Верно, высота. А площадь была лишь промежуточным результатом.',
          'Correct, the altitude. The area was only an intermediate result.',
        ),
        items: [
          { id: 'a', right: true, label: L('Balandlik', 'Высота', 'The altitude') },
          {
            id: 'b',
            label: L('Yuz', 'Площадь', 'The area'),
            hint: L(
              "Masalaning shartini eslang: A uchidan tushirilgan AD balandligini toping. Yuz shartda umuman tilga olinmagan.",
              'Вспомни условие: найдите высоту AD из вершины A. Площадь в условии вообще не упоминалась.',
              'Recall the statement: find the altitude AD from the vertex A. The area was never mentioned there.',
            ),
          },
        ],
        solution: [
          'S = ½ · BC · AD',
          'AD = 2√3 : √7 = 2√21 : 7',
          L('Kamron: √3', 'Камрон: √3', 'Kamron: √3'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 3-masalasi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Chorrahaga kim birinchi yetadi",
    'Кто первым доедет до перекрёстка',
    'Who reaches the crossing first',
  ),
  audio: [
    A('mount',
      "Qoidabuzar haydovchi A nuqtadan soatiga bir yuz qirq kilometr tezlikda, DAN xodimi esa B nuqtadan soatiga yetmish kilometr tezlikda C chorrahaga qarab yo'lga chiqdi.",
      'Нарушитель выехал из точки A со скоростью сто сорок километров в час, а сотрудник ДПС из точки B со скоростью семьдесят, оба к перекрёстку C.',
      'A speeding driver left A at one hundred forty kilometres an hour and an officer left B at seventy, both heading for the crossing C.'),
    A('why',
      "AB masofa ikki kilometr, A dagi burchak yigirma daraja, B dagi burchak esa ellik daraja.",
      'Расстояние AB два километра, угол при A двадцать градусов, при B пятьдесят.',
      'The distance AB is two kilometres, the angle at A is twenty degrees and at B fifty.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Qoidabuzar qirq ikki soniyada, DAN xodimi esa qirq olti soniyada yetib boradi. Demak xodim kechikadi va darslikning javobi «yo'q». Bu yerda geometriya javobni emas, QARORNI berdi: to'rt soniyalik farq masalani hal qildi.",
      'Нарушитель доедет за сорок две секунды, а сотрудник за сорок шесть. Значит он опоздает, и ответ учебника нет. Здесь геометрия дала не ответ, а РЕШЕНИЕ: разница в четыре секунды определила исход.',
      'The driver takes forty two seconds and the officer forty six. So the officer is late and the textbook answer is no. Here geometry gave not an answer but a DECISION: four seconds settled it.',
    ),
    tasks: [
      {
        expr: 'AB = 2,   ∠A = 20°,   ∠B = 50°',
        question: L(
          "C dagi burchak nechaga teng?",
          'Чему равен угол при C?',
          'What is the angle at C?',
        ),
        ok: L("Ha, bir yuz o'n daraja.", 'Да, сто десять градусов.', 'Yes, one hundred ten degrees.'),
        items: [
          { id: 'a', right: true, label: '110°' },
          { id: 'b', label: '70°', hint: L("Yetmish bu ikkita berilgan burchakning YIG'INDISI. Uchinchi burchak esa bir yuz sakson ayirib yetmish.", 'Семьдесят это СУММА двух данных углов. А третий угол это сто восемьдесят минус семьдесят.', 'Seventy is the SUM of the two given angles. The third angle is one hundred eighty minus seventy.') },
        ],
        solution: ['∠C = 180° − (20° + 50°)', '∠C = 110°'],
      },
      {
        expr: 'AC ≈ 1,63,   v = 140',
        question: L(
          "Yo'l bir butun oltmish uch yuzdan kilometr, tezlik soatiga bir yuz qirq kilometr. Qoidabuzar necha soniyada yetib boradi?",
          'Путь одна целая шестьдесят три сотых километра, скорость сто сорок километров в час. За сколько секунд доедет нарушитель?',
          'The stretch is one point six three kilometres at one hundred forty an hour. How many seconds does the driver need?',
        ),
        ok: L(
          "Ha, taxminan qirq ikki soniya. DAN xodimiga esa qirq olti soniya kerak, demak u kechikadi.",
          'Да, примерно сорок две секунды. А сотруднику нужно сорок шесть, значит он опоздает.',
          'Yes, about forty two seconds. The officer needs forty six, so he is late.',
        ),
        items: [
          { id: 'a', right: true, label: L('≈ 42 s', '≈ 42 с', '≈ 42 s') },
          {
            id: 'b',
            label: L('≈ 12 s', '≈ 12 с', '≈ 12 s'),
            hint: L(
              "Vaqtni soatda hisoblang: bir butun oltmish uch yuzdan bo'lingan bir yuz qirq nol butun nol yuz o'n olti soat. Uni uch ming olti yuzga ko'paytiring.",
              'Посчитай время в часах: одна целая шестьдесят три сотых на сто сорок это ноль целых сто шестнадцать десятитысячных часа. Умножь на три тысячи шестьсот.',
              'Compute the time in hours: one point six three over one hundred forty is zero point zero one one six hours. Multiply by three thousand six hundred.',
            ),
          },
        ],
        solution: ['t = 1,63 : 140 ≈ 0,0116', L('0,0116 soat = 42 s', '0,0116 ч = 42 с', '0.0116 h = 42 s')],
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
    "Blits: qurol, chizma, oxirgi qadam",
    'Блиц: инструмент, чертёж, последний шаг',
    'Blitz: the tool, the drawing, the last step',
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
        tag: 'mediana-diagonal-farqi',
        ask: L(
          "Mediana qanday qilib diagonalga aylantiriladi?",
          'Как медиану превращают в диагональ?',
          'How is a median turned into a diagonal?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Ikki barobar uzaytiriladi", 'Её продлевают вдвое', 'It is doubled in length'),
          },
          { id: 'w', label: L("Ikkiga bo'linadi", 'Её делят пополам', 'It is halved') },
        ],
        ok: L(
          "To'g'ri. Shunda uchburchak parallelogrammga to'ldiriladi.",
          'Верно. Тогда треугольник достраивается до параллелограмма.',
          'Correct. Then the triangle is completed to a parallelogram.',
        ),
        hint: L(
          "4-ekranni eslang: mediana o'n ikkiga aylangandi, ya'ni oltining ikki barobariga.",
          'Вспомни 4 экран: медиана превратилась в двенадцать, то есть в удвоенную шестёрку.',
          'Recall screen 4: the median became twelve, twice the six.',
        ),
      },
      {
        id: 'q2',
        tag: 'notogri-teorema',
        ask: L(
          "Tashqi aylananing radiusini qaysi teorema beradi?",
          'Какая теорема даёт радиус описанной окружности?',
          'Which theorem gives the circumradius?',
        ),
        options: [
          { id: 'r', right: true, label: L('Sinuslar', 'Синусов', 'Of sines') },
          { id: 'w', label: L('Kosinuslar', 'Косинусов', 'Of cosines') },
        ],
        ok: L(
          "To'g'ri. Ikki R aynan sinuslar teoremasining o'ng tomonida turadi.",
          'Верно. Два R стоит как раз в правой части теоремы синусов.',
          'Correct. Two R sits on the right side of the law of sines.',
        ),
        hint: L(
          "47-darsni eslang: nisbat tashqi aylananing diametriga teng edi.",
          'Вспомни 47 урок: отношение равнялось диаметру описанной окружности.',
          'Recall lesson 47: the ratio equalled the diameter of the circumscribed circle.',
        ),
      },
      {
        id: 'q3',
        tag: 'oxirgi-qadamni-tashlash',
        ask: L(
          "Javobni yozishdan oldin nima qilinadi?",
          'Что делают перед тем, как записать ответ?',
          'What is done before writing the answer?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Savol qayta o'qiladi", 'Перечитывают вопрос', 'The question is reread'),
          },
          {
            id: 'w',
            label: L("Hisob ikki marta takrorlanadi", 'Дважды повторяют счёт', 'The arithmetic is redone twice'),
          },
        ],
        ok: L(
          "To'g'ri. Hisob to'g'ri bo'lib, javob boshqa savolniki bo'lishi mumkin.",
          'Верно. Счёт может быть верным, а ответ относиться к другому вопросу.',
          'Correct. The arithmetic may be right while the answer belongs to another question.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron yuzni topgan, so'ralgan narsa esa balandlik edi.",
          'Вспомни 12 экран: Камрон нашёл площадь, а спрашивали высоту.',
          'Recall screen 12: Kamron found the area while the altitude was asked for.',
        ),
      },
      {
        id: 'q4',
        tag: 'chizmani-toldirmaslik',
        ask: L(
          "Trapetsiyada birinchi qadam qanday bo'ldi?",
          'Каким был первый шаг в трапеции?',
          'What was the first step with the trapezium?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Yon tomonlarni asosga proyeksiyalash", 'Спроецировать боковые стороны на основание', 'Project the legs onto the base'),
          },
          {
            id: 'w',
            label: L("Kosinuslar teoremasini yozish", 'Записать теорему косинусов', 'Write the law of cosines'),
          },
        ],
        ok: L(
          "To'g'ri. Proyeksiyalar o'tkazilmaguncha tenglama yozilmaydi.",
          'Верно. Пока не проведены проекции, уравнение не записать.',
          'Correct. No equation until the projections are drawn.',
        ),
        hint: L(
          "1-ekranni eslang: ko'p qadamli masalaning birinchi qadami deyarli har doim chizma bilan bog'liq.",
          'Вспомни 1 экран: первый шаг многошаговой задачи почти всегда связан с чертежом.',
          'Recall screen 1: the first step of a multi step problem nearly always concerns the drawing.',
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
    "Qurollar birga ishlaganda",
    'Когда инструменты работают вместе',
    'When the tools work together',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda mediana berilgandi va ikkala teorema ham to'g'ridan to'g'ri ishlamasdi.",
      'На первом экране была дана медиана, и ни одна теорема не работала напрямую.',
      'On the first screen a median was given and neither theorem worked directly.'),
    A('s1',
      "Siz chizmani to'ldirishni, qurolni ma'lumotga qarab tanlashni va oxirgi qadamni tashlab ketmaslikni mashq qildingiz.",
      'Ты потренировался достраивать чертёж, выбирать инструмент по данным и не бросать последний шаг.',
      'You practised completing a drawing, choosing a tool by the data, and not dropping the last step.'),
    A('s2',
      "Keyingi dars butun blokni takrorlaydi.",
      'Следующий урок повторяет весь блок.',
      'The next lesson revises the whole block.'),
  ],
  props: {
    mark: '1 → 2 → 3',
    markNote: L(
      "chizma, qurol, savolga qaytish",
      'чертёж, инструмент, возврат к вопросу',
      'drawing, tool, back to the question',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: takrorlash',
      'Следующий урок: повторение',
      'Next lesson: revision',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'notogri-teorema', ...S2 },
  { role: 'explain',  tag: 'mediana-diagonal-farqi', ...S3 },
  { role: 'explain',  tag: 'mediana-diagonal-farqi', ...S4 },
  { role: 'explain',  tag: 'chizmani-toldirmaslik', ...S5 },
  { role: 'explain',  tag: 'oxirgi-qadamni-tashlash', ...S6 },
  { role: 'explain',  tag: 'notogri-teorema', ...S7 },
  { role: 'rule',     tag: 'oxirgi-qadamni-tashlash', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'mediana-diagonal-farqi', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'notogri-teorema', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'chizmani-toldirmaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'oxirgi-qadamni-tashlash', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'chizmani-toldirmaslik', ...S13 },
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
