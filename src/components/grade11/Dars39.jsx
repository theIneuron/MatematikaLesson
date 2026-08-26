// ============================================================================
// 11-sinf, Dars 39. TEKISLIKLAR ORASIDAGI BURCHAK.
//
// B5 blokining beshinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `dihedral` rejimi
//
// MANBA YO'Q (metodist qarori 2026-08-20). Matematika 38-darsdan (normal =
// koeffitsiyentlar) va 37-darsdan (kosinus skalyar ko'paytma orqali)
// chiqariladi.
//
// DARSNING BITTA GAPI: tekisliklar orasidagi burchak normallar orasidagi
// burchak bilan bir xil, LEKIN har doim O'TKIR olinadi. Kosinusdagi modul --
// butun darsning o'zi.
//
// BLOKNING ASOSIY CHALKASHLIGI shu (PODXOD_11SINF.md §7): normallarni
// burchak deb olib, o'tmasini yozib qo'yadilar. Asbob ikki juft burchakni
// ham chizadi va qaysi biri javob ekanini o'zi yozadi.
//
// SONLAR TEKSHIRILDI:
//   z = 0 va x + z = 2:   n1·n2 = 1,   burchak 45
//   z = 0 va x − z = 2:   n1·n2 = −1,  normallar 135, TEKISLIKLAR 45
//   (1;2;2) va (2;−3;2):  0            perpendikular, 90
//   (1;0;0) va (2;0;0):   2            parallel, 0
//   zanjir (2;−1;2) va (1;2;2): 4, uzunliklar 3 va 3, cos = 4/9
//   mustaqil: 2 + 2m − 3 = 0  ->  m = 1/2, tekshiruv nol
//   blits: |−6| / (3·4) = 1/2  ->  60 daraja
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_39',
  title: L('Tekisliklar orasidagi burchak', 'Угол между плоскостями', 'The angle between planes'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 39 }

// ============================================================
// SLAYD 1. XUK. Bitta juft tekislik, ikki xil javob.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Tekisliklar orasidagi burchak', 'Угол между плоскостями', 'The angle between planes'),
  title: L('Qaysi biri javob', 'Который из них ответ', 'Which one is the answer'),
  expr: L('z = 0  va  x − z = 2', 'z = 0  и  x − z = 2', 'z = 0  and  x − z = 2'),
  rows: [
    { id: 'a', name: L('Aziz', 'Азиз', 'Aziz'), value: '135°' },
    { id: 'b', name: L('Dilnoza', 'Дилноза', 'Dilnoza'), value: '45°' },
  ],
  probe: {
    question: L(
      'Tekisliklar orasidagi burchak qaysi?',
      'Какой из них угол между плоскостями?',
      'Which one is the angle between the planes?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi chizmaga qaraymiz.',
      'Твой ответ записан. Сейчас посмотрим на чертёж.',
      'Your answer is saved. Now we will look at the drawing.',
    ),
    items: [
      { id: 'a', label: '135°' },
      { id: 'b', label: '45°' },
      { id: 'c', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell') },
    ],
  },
  holds: [4500, 4000, 4000],
  audio: [
    A('mount', "O'tgan darsda tekislik tenglamasini yozdik va normalni koeffitsiyentlardan o'qidik. Bugun ikki tekislik keladi.", 'На прошлом уроке мы записали уравнение плоскости и читали нормаль из коэффициентов. Сегодня придут две плоскости.', 'Last lesson we wrote the equation of a plane and read the normal off the coefficients. Today two planes arrive.'),
    A('r1', "Aziz normallarni sanadi va bir yuz o'ttiz beshni oldi.", 'Азиз посчитал нормали и получил сто тридцать пять.', 'Aziz computed the normals and got a hundred thirty five.'),
    A('r2', "Dilnoza esa qirq beshni yozdi. Ikkalasi ham bir xil tekisliklar bilan ishladi.", 'А Дилноза записала сорок пять. Оба работали с одними и теми же плоскостями.', 'Dilnoza wrote forty five. Both worked with the same planes.'),
    A('ask', "Sizningcha qaysi biri javob. Hozircha shunchaki taxmin qiling.", 'Как думаешь, который из них ответ. Пока просто предположи.', 'Which one do you think is the answer. Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Uchtasi ham shu blokdan. Bu baholanmaydi.",
    'Все три из этого блока. Это не оценивается.',
    'All three from this block. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Normal', 'Нормаль', 'The normal'),
      short: L('38-darsdan', 'из урока 38', 'from lesson 38'),
      ex: [{ e: L('koeffitsiyentlar', 'коэффициенты', 'the coefficients'), why: L('tenglamadan o\'qiladi', 'читается из уравнения', 'read off the equation') }],
    },
    {
      id: 'c2',
      title: L('Kosinus', 'Косинус', 'The cosine'),
      short: L('37-darsdan', 'из урока 37', 'from lesson 37'),
      ex: [{ e: 'cos φ = (a · b) / (|a| |b|)', why: L('ikki vektor orasida', 'между двумя векторами', 'between two vectors') }],
    },
    {
      id: 'c3',
      title: L('Ishora', 'Знак', 'The sign'),
      short: L('37-darsdan', 'из урока 37', 'from lesson 37'),
      ex: [{ e: L('minus -- o\'tmas', 'минус — тупой', 'minus means obtuse'), why: L('plyus -- o\'tkir', 'плюс — острый', 'plus means acute') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true, cols: 2,
      prompt: L('x − 2y + 2z = 1 normali?', 'Нормаль x − 2y + 2z = 1?', 'The normal of x − 2y + 2z = 1?'),
      items: [
        { id: 'a', label: '(1; −2; 2)', correct: true },
        { id: 'b', label: '(1; 2; 2)', hint: L("Ikkinchi koeffitsiyent manfiy: minus ikki igrek.", 'Второй коэффициент отрицательный: минус два игрек.', 'The second coefficient is negative: minus two y.') },
        { id: 'c', label: '(1; −2; 2; 1)', hint: L("Ozod had normalga kirmaydi.", 'Свободный член в нормаль не входит.', 'The free term is not part of the normal.') },
        { id: 'd', label: '(1; 1; 1)', hint: L("Koeffitsiyentlar teng emas.", 'Коэффициенты не равны.', 'The coefficients are not equal.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 2,
      prompt: '(1; 2; 2) · (2; −3; 2)',
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '12', hint: L("Ikkinchi ko'paytma manfiy: ikki karra minus uch.", 'Второе произведение отрицательное: два на минус три.', 'The second product is negative: two times minus three.') },
        { id: 'c', label: '−6', hint: L("Uchinchi ko'paytma ham bor: ikki karra ikki.", 'Есть и третье произведение: два на два.', 'There is a third product too: two times two.') },
        { id: 'd', label: '6', hint: L("Ikki minus olti plyus to'rt nol beradi.", 'Два минус шесть плюс четыре даёт нуль.', 'Two minus six plus four gives zero.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 2,
      prompt: L('Son manfiy. Burchak?', 'Число отрицательное. Угол?', 'The number is negative. The angle?'),
      items: [
        { id: 'a', label: L("o'tmas", 'тупой', 'obtuse'), correct: true },
        { id: 'b', label: L("o'tkir", 'острый', 'acute'), hint: L("O'tkir burchakda son musbat bo'ladi.", 'У острого угла число положительное.', 'For an acute angle the number is positive.') },
      ],
    },
  ],
  holds: [3000, 4000, 4500, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: normal to'g'ridan to'g'ri koeffitsiyentlarda turadi.", 'Первая опора с прошлого урока: нормаль стоит прямо в коэффициентах.', 'The first basic from last lesson: the normal sits right in the coefficients.'),
    A('c2', "Ikkinchi tayanch: ikki vektor orasidagi kosinus skalyar ko'paytmani uzunliklarga bo'lib topiladi.", 'Вторая опора: косинус между двумя векторами находят, поделив скалярное произведение на длины.', 'The second basic: the cosine between two vectors comes from dividing the dot product by the lengths.'),
    A('c3', "Uchinchi tayanch: sonning ishorasi burchak turini beradi.", 'Третья опора: знак числа даёт вид угла.', 'The third basic: the sign of the number gives the kind of angle.'),
    A('recap', 'Uchtasi birga bugungi javobni beradi.', 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', 'Endi uchta qisqa topshiriq.', 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZON: normallar burchagi tekisliklar burchagimi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'angle_obtuse',
  eyebrow: L('Juftlarni sanaymiz', 'Считаем пары', 'Computing the pairs'),
  title: L('Normallar burchagi javobmi', 'Угол нормалей это ответ?', 'Is the normals angle the answer?'),
  expr: L('tekisliklar burchagi', 'угол плоскостей', 'the planes angle'),
  goal: L("o'tkirni topish", 'найти острый', 'find the acute one'),
  rule: L("Ko'paytmani sanaymiz.", 'Считаем произведение.', 'We compute the product.'),
  pick: L('Qaysi juftni tekshiramiz?', 'Какую пару проверим?', 'Which pair shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('normal burchagi', 'угол нормалей', 'the normals angle'), value: 'n' },
    { id: 'b', key: 'inB', name: L("o'tkir burchak", 'острый угол', 'the acute angle'), value: '<' },
  ],
  points: [
    {
      id: 'q1', label: '(0; 0; 1) · (1; 0; 1)', num: '45°', step: 'calc', verdict: 'in',
      calc: L('1: ikkisi ham 45°', '1: оба 45°', '1: both 45°'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: '(0; 0; 1) · (1; 0; −1)', num: '135°', step: 'calc', verdict: 'out',
      calc: L('−1: normallar 135°', '−1: нормали 135°', '−1: normals 135°'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: '(1; 2; 2) · (2; −3; 2)', num: '90°', step: 'calc', verdict: 'in',
      calc: L('0: ikkisi ham 90°', '0: оба 90°', '0: both 90°'),
      sol: true, inA: true, inB: true,
    },
  ],
  probe: {
    question: L(
      'Tekisliklar orasidagi burchak qanday olinadi?',
      'Как берут угол между плоскостями?',
      'How is the angle between planes taken?',
    ),
    items: [
      { id: 'b', label: L("har doim o'tkir", 'всегда острый', 'always the acute one'), correct: true },
      { id: 'a', label: L("normallar qanday bo'lsa", 'какой у нормалей', 'whatever the normals give'), hint: L("Ikkinchi juftni ko'ring: normallar 135, tekisliklar 45.", 'Смотри вторую пару: нормали 135, плоскости 45.', 'See the second pair: normals 135, planes 45.') },
      { id: 'c', label: L('har doim o\'tmas', 'всегда тупой', 'always the obtuse one'), hint: L("Birinchi va uchinchi juftda o'tmas burchak umuman yo'q.", 'В первой и третьей паре тупого угла вообще нет.', 'In the first and third pairs there is no obtuse angle at all.') },
      { id: 'd', label: L("ixtiyoriy", 'любой', 'either one'), hint: L("Ixtiyoriy emas: javob bitta bo'lishi kerak.", 'Не любой: ответ должен быть один.', 'Not either: the answer must be one.') },
    ],
  },
  holds: [3000, 4500, 2500, 2600, 9000],
  audio: [
    A('mount', 'Taxmin bor. Endi mezonni topamiz.', 'Прогноз есть. Теперь найдём признак.', 'The guess is made. Now let us find the criterion.'),
    A('mount', "Ikki da'vo bor. Biri normallar burchagi javob deydi, ikkinchisi javob o'tkir burchak deydi.", 'Есть два утверждения. Одно говорит, что ответ это угол нормалей, а другое, что ответ острый угол.', 'There are two claims. One says the answer is the normals angle, the other says the answer is the acute angle.'),
    A('mount', "To'rtta juftni birma bir sanaymiz.", 'Посчитаем четыре пары по одной.', 'Let us compute four pairs one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Birinchi, uchinchi va to'rtinchi juftlarda ikkala da'vo ham bir xil javob beradi. Ikkinchi juft esa ularni ajratdi: son minus bir, normallar bir yuz o'ttiz besh gradus, tekisliklar orasidagi burchak esa qirq besh. Demak birinchi da'vo yiqildi: normal qayoqqa qaragani bizning tanlovimiz, tekisliklar orasidagi burchak esa unga bog'liq emas.", 'Вот результат. В первой, третьей и четвёртой парах оба утверждения дают один ответ. А вторая пара их разделила: число минус один, нормали сто тридцать пять градусов, а угол между плоскостями сорок пять. Значит первое утверждение упало: куда смотрит нормаль это наш выбор, а угол между плоскостями от него не зависит.', 'Here is the result. In the first, third and fourth pairs both claims agree. The second pair split them: the number is minus one, the normals give a hundred thirty five degrees, and the angle between the planes is forty five. The first claim fell: where a normal points is our choice, and the angle between planes does not depend on it.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: IKKI TEKISLIK, IKKI JUFT BURCHAK.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'angle_obtuse',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Ikki juft burchak, javob bitta', 'Две пары углов, ответ один', 'Two pairs of angles, one answer'),
  chip: L('z = 0  va  x + z = 2', 'z = 0  и  x + z = 2', 'z = 0  and  x + z = 2'),
  space: {
    mode: 'dihedral',
    box: [[-1, 4], [-1, 4], [-1, 4]],
    height: 210,
    interactive: true,
    planes: [
      { n: [0, 0, 1], d: 0, label: 'α', normal: false },
      { n: [1, 0, 1], d: -2, label: 'β', normal: false, tone: 'accent', showAt: 1 },
    ],
    caption: L('karkasni barmoq bilan burish mumkin', 'каркас можно повернуть пальцем', 'you can turn the frame with a finger'),
  },
  bonus: L(
    "Qirra ustida IKKI juft burchak turadi, va ular birga bir yuz sakson beradi. Javob har doim o'tkiri: shuning uchun kosinusda modul turadi.",
    'На ребре стоят ДВЕ пары углов, и вместе они дают сто восемьдесят. Ответ всегда острый: поэтому в косинусе стоит модуль.',
    'On the edge stand TWO pairs of angles, and together they give a hundred eighty. The answer is always the acute one: that is why the cosine takes an absolute value.',
  ),
  probe: {
    question: L(
      "Normallar 135° berdi. Tekisliklar orasidagi burchak?",
      'Нормали дали 135°. Угол между плоскостями?',
      'The normals gave 135°. The angle between the planes?',
    ),
    items: [
      { id: 'a', label: '45°', correct: true },
      { id: 'b', label: '135°', hint: L("Bu normallar burchagi. Tekisliklar orasida esa o'tkiri olinadi.", 'Это угол нормалей. А между плоскостями берут острый.', 'That is the normals angle. Between planes the acute one is taken.') },
      { id: 'c', label: '90°', hint: L("To'qson faqat son nol bo'lganda.", 'Девяносто только при нулевом числе.', 'Ninety only when the number is zero.') },
      { id: 'd', label: '180°', hint: L("Bir yuz sakson bu ikki juft burchakning yig'indisi.", 'Сто восемьдесят это сумма двух пар углов.', 'A hundred eighty is the sum of the two pairs.') },
    ],
  },
  holds: [4000, 6500],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. Bitta tekislik pol, ikkinchisi unga qiya.", 'Признак найден. Теперь посмотрим на чертёж. Одна плоскость это пол, вторая идёт под наклоном.', 'The criterion is found. Now let us look at the drawing. One plane is the floor, the second goes at a slant.'),
    A('one', "Ikkinchi tekislik paydo bo'ldi, va ular QIRRA bo'ylab kesishdi. Burchak aynan shu qirrada o'lchanadi, havoda emas.", 'Появилась вторая плоскость, и они пересеклись по РЕБРУ. Угол измеряется именно на этом ребре, а не в воздухе.', 'The second plane appeared, and they met along an EDGE. The angle is measured on that edge, not in the air.'),
    A('two', "Asbob ikki juft burchakni ham chizdi: qirq besh va bir yuz o'ttiz besh. Pastda esa javob yozilgan, va u o'tkiri. Normal qayoqqa qaragani bizning tanlovimiz, javob esa undan qat'i nazar bir xil.", 'Прибор нарисовал обе пары углов: сорок пять и сто тридцать пять. А внизу написан ответ, и это острый. Куда смотрит нормаль это наш выбор, а ответ от него не зависит.', 'The tool drew both pairs of angles: forty five and a hundred thirty five. Below it wrote the answer, and it is the acute one. Where a normal points is our choice, the answer does not depend on it.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Modul.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'angle_obtuse',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Kosinusdagi modul', 'Модуль в косинусе', 'The absolute value in the cosine'),
  rows: [
    'cos φ = |n₁ · n₂| / (|n₁| · |n₂|)',
    '0° ≤ φ ≤ 90°',
  ],
  probe: {
    question: L(
      'Nega modul kerak?',
      'Зачем нужен модуль?',
      'Why is the absolute value needed?',
    ),
    items: [
      { id: 'a', label: L("javob o'tkir bo'lishi kerak", 'ответ должен быть острым', 'the answer must be acute'), correct: true },
      { id: 'b', label: L('kosinus manfiy bo\'lmaydi', 'косинус не бывает отрицательным', 'a cosine is never negative'), hint: L("Kosinus manfiy bo'ladi: 37-darsda o'tmas burchakda aynan shunday edi.", 'Косинус бывает отрицательным: в уроке 37 у тупого угла так и было.', 'A cosine can be negative: in lesson 37 an obtuse angle gave exactly that.') },
      { id: 'c', label: L('uzunliklar manfiy', 'длины отрицательны', 'the lengths are negative'), hint: L("Uzunlik hech qachon manfiy bo'lmaydi, va modul unga tegishli emas.", 'Длина никогда не отрицательна, и модуль не про неё.', 'A length is never negative, and the absolute value is not about it.') },
      { id: 'd', label: L("shunday qulay", 'так удобнее', 'it is more convenient'), hint: L("Qulaylik emas: normalning yo'nalishi bizning tanlovimiz, javob esa bitta bo'lishi kerak.", 'Не удобство: направление нормали наш выбор, а ответ должен быть один.', 'Not convenience: the normal direction is our choice, and the answer must be unique.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Burchak', 'Правило 1. Угол', 'Rule 1. The angle'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'cos φ = |n₁ · n₂| / (|n₁| · |n₂|)',
    lines: [
      L("burchak qirrada o'lchanadi", 'угол измеряется на ребре', 'the angle is measured on the edge'),
      L('modul javobni o\'tkir qiladi', 'модуль делает ответ острым', 'the absolute value makes the answer acute'),
      L("normalni teskari qilsak, javob o'zgarmaydi", 'если развернуть нормаль, ответ не изменится', 'flipping a normal does not change the answer'),
      L('javob nol dan to\'qsongacha', 'ответ от нуля до девяноста', 'the answer lies from zero to ninety'),
    ],
    example: L('misol:  |−1| / √2  →  45°', 'пример:  |−1| / √2  →  45°', 'example:  |−1| / √2  →  45°'),
  },
  holds: [4000, 7500, 4500],
  audio: [
    A('mount', 'Chizma ko\'rildi. Endi qoidani yozamiz.', 'Чертёж увидели. Теперь запишем правило.', 'We saw the drawing. Now let us write the rule.'),
    A('def', "Tekisliklar orasidagi burchakning kosinusi normallar ko'paytmasining MODULINI uzunliklar ko'paytmasiga bo'lib topiladi. Modul shuning uchun kerakki, normalni qaysi tomonga qaratish bizning tanlovimiz, tekisliklar orasidagi burchak esa bitta. Shu sababli javob har doim nol dan to'qson gradusgacha bo'ladi.", 'Косинус угла между плоскостями находят, поделив МОДУЛЬ произведения нормалей на произведение длин. Модуль нужен потому, что направление нормали это наш выбор, а угол между плоскостями один. Поэтому ответ всегда лежит от нуля до девяноста градусов.', 'The cosine of the angle between planes comes from dividing the ABSOLUTE VALUE of the normals product by the product of the lengths. The absolute value is needed because the direction of a normal is our choice, while the angle between the planes is single. So the answer always lies from zero to ninety degrees.'),
    A('rule', "To'g'ri. Va tekshiruv oson: javob to'qsondan katta chiqdi -- modul tushib qolgan.", 'Верно. И проверка простая: ответ вышел больше девяноста, значит потерян модуль.', 'Correct. And the check is easy: if the answer exceeds ninety, the absolute value was lost.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: normal teskari qilindi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'angle_obtuse',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Normal teskari qilindi', 'Нормаль развернули', 'The normal was flipped'),
  was: { label: UI.was, expr: 'n₂ (1; 0; 1)' },
  now: { label: UI.now, expr: 'n₂ (−1; 0; −1)' },
  probe1: {
    cols: 2,
    question: L('Ko\'paytma qanday o\'zgaradi?', 'Как изменится произведение?', 'How does the product change?'),
    items: [
      { id: 'a', label: L('ishorasi almashadi', 'сменит знак', 'it flips sign'), correct: true },
      { id: 'b', label: L("o'zgarmaydi", 'не изменится', 'it stays'), hint: L("Har bir ko'paytuvchi ishorasini almashtirdi, demak yig'indi ham.", 'Каждый множитель сменил знак, значит и сумма.', 'Every factor flipped sign, so the sum does too.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L(
      'Tekisliklar orasidagi burchak o\'zgaradimi?',
      'Изменится ли угол между плоскостями?',
      'Will the angle between the planes change?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L("yo'q", 'нет', 'no') },
      { id: 'b', label: L('ha', 'да', 'yes') },
    ],
  },
  holds: [4000, 5000, 3000],
  audio: [
    A('mount', "Qoida yozildi. Endi normalni teskari qilamiz.", 'Правило записали. Теперь развернём нормаль.', 'The rule is written. Now let us flip the normal.'),
    A('now', "Ikkinchi tekislikning tenglamasini minus birga ko'paytirdik. Tekislik o'sha qoldi, normal esa teskari tomonga qaradi.", 'Мы умножили уравнение второй плоскости на минус один. Плоскость осталась той же, а нормаль стала смотреть в обратную сторону.', 'We multiplied the second plane equation by minus one. The plane stayed the same, and the normal now points the other way.'),
    A('q1', "Ko'paytma qanday o'zgaradi?", 'Как изменится произведение?', 'How does the product change?'),
    A('q2', "Endi taxmin qiling: tekisliklar orasidagi burchak o'zgaradimi.", 'Теперь предположи: изменится ли угол между плоскостями.', 'Now make a guess: will the angle between the planes change.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: modul bilan va modulsiz.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'angle_obtuse',
  eyebrow: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  title: L('Modul bilan va modulsiz', 'С модулем и без', 'With and without the absolute value'),
  expr: 'n₁ (0; 0; 1),  n₂ (1; 0; −1)',
  need: L('javob o\'tkir bo\'lsin', 'ответ должен быть острым', 'the answer must be acute'),
  answerLabel: L('burchak', 'угол', 'the angle'),
  cards: [
    {
      tag: L('modulsiz', 'без модуля', 'without it'),
      txt: 'cos φ = −1 / √2',
      point: { label: L('burchak', 'угол', 'the angle'), calc: '135°', verdict: 'out' },
    },
    {
      tag: L('modul bilan', 'с модулем', 'with it'),
      txt: 'cos φ = 1 / √2',
      point: { label: L('burchak', 'угол', 'the angle'), calc: '45°', verdict: 'in' },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['45°', '135°', '90°', '225°'],
    value: ['45°'],
    label: 'φ =',
    prompt: L('Burchakni yozing', 'Запиши угол', 'Write the angle'),
    wrongs: [
      { key: '135°', hint: L("Bu normallar burchagi. Tekisliklar orasida o'tkiri olinadi.", 'Это угол нормалей. Между плоскостями берут острый.', 'That is the normals angle. Between planes the acute one is taken.') },
      { key: '90°', hint: L("To'qson faqat ko'paytma nol bo'lganda. Bu yerda u minus bir.", 'Девяносто только при нулевом произведении. Здесь оно минус один.', 'Ninety only when the product is zero. Here it is minus one.') },
      { key: '225°', hint: L("Burchak nol dan to'qsongacha bo'ladi.", 'Угол лежит от нуля до девяноста.', 'The angle lies from zero to ninety.') },
      { key: '*', hint: L("Modul minus birni birga aylantiradi, va kosinus bir bo'lingan ildiz ikki bo'ladi.", 'Модуль превращает минус один в единицу, и косинус становится один на корень из двух.', 'The absolute value turns minus one into one, and the cosine becomes one over root two.') },
    ],
  },
  holds: [4000, 4500, 6000],
  audio: [
    A('mount', "Taxmin bor. Endi ikkala yo'lni ham sanaymiz.", 'Прогноз есть. Теперь посчитаем оба пути.', 'The guess is made. Now let us compute both paths.'),
    A('p1', "Modulsiz kosinus minus bir bo'lingan ildiz ikki, va burchak bir yuz o'ttiz besh chiqadi. Lekin chizmada tekisliklar orasida qirq besh ko'rinib turgan edi.", 'Без модуля косинус минус один на корень из двух, и угол выходит сто тридцать пять. Но на чертеже между плоскостями было видно сорок пять.', 'Without the absolute value the cosine is minus one over root two and the angle comes out a hundred thirty five. But the drawing showed forty five between the planes.'),
    A('p2', "Modul bilan esa kosinus musbat, va javob qirq besh. Bu chizmaga mos keladi. Burchakni yozing.", 'С модулем косинус положительный, и ответ сорок пять. Это сходится с чертежом. Запиши угол.', 'With the absolute value the cosine is positive and the answer is forty five. That matches the drawing. Write the angle.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Perpendikular va parallel tekisliklar.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'plane_parallel',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Perpendikular va parallel', 'Перпендикулярные и параллельные', 'Perpendicular and parallel'),
  cases: [
    {
      label: L("ko'paytma nol", 'произведение нуль', 'a zero product'),
      text: L('tekisliklar perpendikular', 'плоскости перпендикулярны', 'the planes are perpendicular'),
      tone: 'graph',
    },
    {
      label: L('normallar kollinear', 'нормали коллинеарны', 'the normals are collinear'),
      text: L('tekisliklar parallel', 'плоскости параллельны', 'the planes are parallel'),
      tone: 'accent',
    },
  ],
  rows: [
    '(1; 2; 2) · (2; −3; 2) = 0  →  90°',
    L('(1; 2; 2) va (2; 4; 4)  →  parallel', '(1; 2; 2) и (2; 4; 4)  →  параллельны', '(1; 2; 2) and (2; 4; 4)  →  parallel'),
  ],
  probe: {
    question: L(
      'Normallari kollinear, ozod hadlari mos emas. Tekisliklar?',
      'Нормали коллинеарны, свободные члены не пропорциональны. Плоскости?',
      'The normals are collinear, the free terms are not proportional. The planes?',
    ),
    items: [
      { id: 'a', label: L('parallel, ustma-ust emas', 'параллельны, не совпадают', 'parallel, not the same'), correct: true },
      { id: 'b', label: L('ustma-ust', 'совпадают', 'the same plane'), hint: L("Ustma-ust bo'lishi uchun ozod had ham mos bo'lishi kerak.", 'Для совпадения и свободный член должен быть пропорционален.', 'To coincide, the free term must be proportional too.') },
      { id: 'c', label: L('perpendikular', 'перпендикулярны', 'perpendicular'), hint: L("Perpendikularlikda ko'paytma nol bo'lardi, kollinearlikda esa u eng katta.", 'При перпендикулярности произведение нуль, а при коллинеарности оно наибольшее.', 'Perpendicularity gives a zero product, collinearity gives the largest.') },
      { id: 'd', label: L('kesishadi', 'пересекаются', 'they intersect'), hint: L("Parallel tekisliklar kesishmaydi.", 'Параллельные плоскости не пересекаются.', 'Parallel planes do not intersect.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Ikki maxsus holat', 'Правило 2. Два особых случая', 'Rule 2. Two special cases'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('n₁ · n₂ = 0  →  90°;   n₁ = λn₂  →  parallel', 'n₁ · n₂ = 0  →  90°;   n₁ = λn₂  →  параллельны', 'n₁ · n₂ = 0  →  90°;   n₁ = λn₂  →  the planes are parallel'),
    lines: [
      L('nol -- perpendikularlik, chizmasiz', 'нуль это перпендикулярность, без чертежа', 'zero is perpendicularity, with no drawing'),
      L("kollinear normal -- parallellik", 'коллинеарная нормаль это параллельность', 'a collinear normal is parallelism'),
      L('ozod had ham mos bo\'lsa -- ustma-ust', 'если и свободный член пропорционален — совпадают', 'if the free term matches too, they coincide'),
      L("noma'lum koeffitsiyent shu shartdan topiladi", 'неизвестный коэффициент находится из этого условия', 'an unknown coefficient comes from this condition'),
    ],
    example: L('misol:  2 + 2m − 3 = 0  →  m = 1/2', 'пример:  2 + 2m − 3 = 0  →  m = 1/2', 'example:  2 + 2m − 3 = 0  →  m = 1/2'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('bitta juft normal uch savolga javob beradi', 'одна пара нормалей отвечает на три вопроса', 'one pair of normals answers three questions'),
    lines: [
      L('1. ko\'paytma nol -- perpendikular', '1. произведение нуль — перпендикулярны', '1. a zero product means perpendicular'),
      L('2. kollinear -- parallel', '2. коллинеарны — параллельны', '2. collinear means parallel'),
      L('3. qolgan holatda modul bilan kosinus', '3. в остальных случаях косинус с модулем', '3. otherwise the cosine with an absolute value'),
      L('4. javob har doim o\'tkir', '4. ответ всегда острый', '4. the answer is always acute'),
    ],
  },
  holds: [4000, 7000, 2600],
  audio: [
    A('mount', "Burchak yozildi. Endi ikkita maxsus holat.", 'Угол записали. Теперь два особых случая.', 'The angle is written. Now two special cases.'),
    A('rows', "Agar normallar ko'paytmasi nol bo'lsa, tekisliklar perpendikular. Agar normallar kollinear bo'lsa, ya'ni koordinatalari proporsional bo'lsa, tekisliklar parallel. Va agar ozod had ham xuddi shu nisbatda bo'lsa, ular ustma-ust tushadi.", 'Если произведение нормалей нуль, плоскости перпендикулярны. Если нормали коллинеарны, то есть координаты пропорциональны, плоскости параллельны. А если и свободный член в том же отношении, они совпадают.', 'If the product of the normals is zero, the planes are perpendicular. If the normals are collinear, that is their coordinates are proportional, the planes are parallel. And if the free term keeps the same ratio, they coincide.'),
    A('rule', "To'g'ri.", 'Верно.', 'Correct.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'angle_obtuse',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Kosinusning ishorasi', 'Знак косинуса', 'The sign of the cosine'),
  left: L('n₁ · n₂ = −4,  uzunliklari 3 va 3', 'n₁ · n₂ = −4, длины 3 и 3', 'n₁ · n₂ = −4, lengths 3 and 3'),
  template: ['cos φ = ', { slot: 0 }, ' 4/9'],
  signs: ['+', '−'],
  answer: '+',
  checkNote: L(
    "Tekisliklar orasidagi burchak o'tmas bo'lmaydi",
    'Угол между плоскостями не бывает тупым',
    'The angle between planes is never obtuse',
  ),
  wrongs: [
    { key: '−', hint: L("Minus bilan burchak o'tmas chiqadi, tekisliklar orasida esa o'tkiri olinadi. Modul aynan buni qiladi.", 'С минусом угол выйдет тупым, а между плоскостями берут острый. Модуль как раз это и делает.', 'With a minus the angle is obtuse, while between planes the acute one is taken. That is what the absolute value does.') },
  ],
  probe: {
    question: L("Burchak o'tkirmi yoki o'tmas?", 'Угол острый или тупой?', 'Is the angle acute or obtuse?'),
    items: [
      { id: 'a', label: L("o'tkir", 'острый', 'acute'), correct: true },
      { id: 'b', label: L("o'tmas", 'тупой', 'obtuse'), hint: L("Modul olingandan keyin kosinus musbat, ya'ni burchak o'tkir.", 'После модуля косинус положителен, значит угол острый.', 'After the absolute value the cosine is positive, so the angle is acute.') },
      { id: 'c', label: L("to'g'ri", 'прямой', 'right'), hint: L("To'g'ri burchakda kosinus nol bo'lardi.", 'У прямого угла косинус был бы нулём.', 'A right angle would give a zero cosine.') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell'), hint: L("Aniqlanadi: tekisliklar orasidagi burchak har doim o'tkir yoki to'g'ri.", 'Определяется: угол между плоскостями всегда острый или прямой.', 'It can: the angle between planes is always acute or right.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Kosinusning ishorasini qo'ying.", 'Поставь знак косинуса.', 'Place the sign of the cosine.'),
    A('checked', "Bo'ldi. Endi burchak turini ayting.", 'Готово. Теперь назови вид угла.', 'Done. Now name the kind of angle.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'norm', label: L('normallarni yozish', 'выписать нормали', 'write the normals') },
  { id: 'dot', label: L("ko'paytmani sanash", 'посчитать произведение', 'compute the product') },
  { id: 'len', label: L('uzunliklarni topish', 'найти длины', 'find the lengths') },
  { id: 'abs', label: L('modul olib bo\'lish', 'взять модуль и поделить', 'take the absolute value and divide') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'angle_obtuse',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Kosinusni topamiz', 'Находим косинус', 'Finding the cosine'),
  start: L('2x − y + 2z = 1  va  x + 2y + 2z = 3', '2x − y + 2z = 1  и  x + 2y + 2z = 3', '2x − y + 2z = 1  and  x + 2y + 2z = 3'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'norm',
      to: 'n₁ (2; −1; 2),  n₂ (1; 2; 2)',
      wrongs: [
        { action: 'dot', hint: L("Avval normallarni yozing: ular koeffitsiyentlarda.", 'Сначала выпиши нормали: они в коэффициентах.', 'First write the normals: they are in the coefficients.') },
        { action: 'len', hint: L("Uzunlik keyin: avval nimaning uzunligi kerakligini yozing.", 'Длина потом: сначала запиши, у чего искать длину.', 'The length comes later: first write whose length is needed.') },
        { action: 'abs', hint: L("Modul eng oxirida.", 'Модуль в самом конце.', 'The absolute value comes last.') },
      ],
    },
    {
      action: 'dot',
      to: '2 − 2 + 4 = 4',
      wrongs: [
        { action: 'norm', hint: L("Normallar yozilgan.", 'Нормали выписаны.', 'The normals are written.') },
        { action: 'len', hint: L("Avval ko'paytmani sanang.", 'Сначала посчитай произведение.', 'Compute the product first.') },
        { action: 'abs', hint: L("Modul olish uchun avval son kerak.", 'Чтобы взять модуль, нужно сначала число.', 'To take the absolute value, the number is needed first.') },
      ],
    },
    {
      action: 'len',
      to: '|n₁| = 3,  |n₂| = 3',
      wrongs: [
        { action: 'dot', hint: L("Sanalgan: to'rt.", 'Посчитано: четыре.', 'Computed: four.') },
        { action: 'norm', hint: L("Normallar joyida.", 'Нормали на месте.', 'The normals are in place.') },
        { action: 'abs', hint: L("Bo'lish uchun uzunliklar kerak.", 'Чтобы делить, нужны длины.', 'To divide, the lengths are needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4/9', '−4/9', '4/6', '9/4'],
    value: ['4/9'],
    label: 'cos φ =',
    prompt: L('Kosinusni yozing', 'Запиши косинус', 'Write the cosine'),
    wrongs: [
      { key: '−4/9', hint: L("Ko'paytma musbat edi: to'rt. Modul ham ishorani o'zgartirmaydi.", 'Произведение было положительным: четыре. И модуль знак не меняет.', 'The product was positive: four. The absolute value keeps it.') },
      { key: '4/6', hint: L("Uzunliklar uch va uch, ko'paytmasi to'qqiz.", 'Длины три и три, произведение девять.', 'The lengths are three and three, their product nine.') },
      { key: '9/4', hint: L("Kosinus birdan katta bo'lmaydi.", 'Косинус не бывает больше единицы.', 'A cosine is never above one.') },
      { key: '*', hint: L("To'rtni to'qqizga bo'lish kerak.", 'Четыре надо поделить на девять.', 'Four must be divided by nine.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi to\'liq masalani o\'tamiz.', 'Знак поставлен. Пройдём полную задачу.', 'The sign is placed. Let us work a full problem.'),
    A('start', "Diqqat: bu yerda ko'paytma musbat chiqadi, ya'ni modul javobni o'zgartirmaydi. Lekin uni yozish odat bo'lishi kerak.", 'Внимание: здесь произведение выйдет положительным, то есть модуль ответа не изменит. Но писать его должно войти в привычку.', 'Careful: here the product comes out positive, so the absolute value changes nothing. But writing it must become a habit.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: perpendikularlik sharti.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'plane_parallel',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Perpendikular bo\'lsin', 'Пусть будут перпендикулярны', 'Let them be perpendicular'),
  start: L('2x + my − z = 1  va  x + 2y + 3z = 0', '2x + my − z = 1  и  x + 2y + 3z = 0', '2x + my − z = 1  and  x + 2y + 3z = 0'),
  actions: ACTIONS_10,
  hint: L(
    "Perpendikularlikda ko'paytma nolga teng.",
    'При перпендикулярности произведение равно нулю.',
    'Perpendicularity means the product is zero.',
  ),
  steps: [
    {
      action: 'norm',
      to: 'n₁ (2; m; −1),  n₂ (1; 2; 3)',
      wrongs: [
        { action: 'dot', hint: L("Avval normallarni yozing.", 'Сначала выпиши нормали.', 'First write the normals.') },
        { action: 'len', hint: L("Uzunlik bu masalada kerak emas.", 'Длина в этой задаче не нужна.', 'The length is not needed here.') },
        { action: 'abs', hint: L("Modul kerak emas: shart nol haqida.", 'Модуль не нужен: условие про нуль.', 'No absolute value: the condition is about zero.') },
      ],
    },
    {
      action: 'dot',
      to: '2 + 2m − 3 = 0',
      wrongs: [
        { action: 'norm', hint: L("Normallar yozilgan.", 'Нормали выписаны.', 'The normals are written.') },
        { action: 'len', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
        { action: 'abs', hint: L("Kerak emas: nol modulsiz ham nol.", 'Не нужно: нуль и без модуля нуль.', 'Not needed: zero is zero either way.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1/2', '−1/2', '2', '5/2'],
    value: ['1/2'],
    label: 'm =',
    prompt: L('m ni yozing', 'Запиши m', 'Write m'),
    wrongs: [
      { key: '−1/2', hint: L("Ikki minus uch minus bir, demak ikki m birga teng.", 'Два минус три это минус один, значит два m равно одному.', 'Two minus three is minus one, so two m equals one.') },
      { key: '2', hint: L("Bunda ko'paytma ikki plyus to'rt minus uch, ya'ni uch chiqadi.", 'Тогда произведение два плюс четыре минус три, то есть три.', 'Then the product is two plus four minus three, that is three.') },
      { key: '5/2', hint: L("Bu ikki m ning qiymati emas: tenglama ikki m teng bir.", 'Это не значение двух m: уравнение даёт два m равно одному.', 'That is not the value of two m: the equation gives two m equals one.') },
      { key: '*', hint: L("Ikki plyus ikki m minus uch nolga teng, demak m yarim.", 'Два плюс два m минус три равно нулю, значит m одна вторая.', 'Two plus two m minus three is zero, so m is one half.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Perpendikularlik sharti ko'paytmani nolga tenglashtirishni beradi, va undan m chiqadi.", 'Условие перпендикулярности даёт уравнение с нулём, и из него выходит m.', 'The perpendicularity condition gives an equation with zero, and m comes out of it.'),
    A('answered', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'angle_obtuse', ask: true, cols: 4,
      done: '45°',
      prompt: L('z = 0 va x + z = 2 orasidagi burchak?', 'Угол между z = 0 и x + z = 2?', 'The angle between z = 0 and x + z = 2?'),
      items: [
        { id: 'a', label: '45°', correct: true },
        { id: 'b', label: '90°', hint: L("To'qson faqat ko'paytma nol bo'lganda, bu yerda u bir.", 'Девяносто только при нулевом произведении, здесь оно один.', 'Ninety only for a zero product, here it is one.') },
        { id: 'c', label: '135°', hint: L("Tekisliklar orasida o'tkiri olinadi.", 'Между плоскостями берут острый.', 'Between planes the acute one is taken.') },
        { id: 'd', label: '0°', hint: L("Nol parallel tekisliklarda bo'ladi.", 'Нуль бывает у параллельных плоскостей.', 'Zero belongs to parallel planes.') },
      ],
    },
    {
      id: 'b2', tag: 'plane_parallel', ask: true, cols: 2,
      done: L('ha', 'да', 'yes'),
      prompt: L('(1; 2; 2) va (2; −3; 2): perpendikularmi?', '(1; 2; 2) и (2; −3; 2): перпендикулярны?', '(1; 2; 2) and (2; −3; 2): perpendicular?'),
      items: [
        { id: 'a', label: L('ha', 'да', 'yes'), correct: true },
        { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Ikki minus olti plyus to'rt nol beradi, ya'ni perpendikular.", 'Два минус шесть плюс четыре даёт нуль, значит перпендикулярны.', 'Two minus six plus four is zero, so they are perpendicular.') },
      ],
    },
    {
      // Ikki ustun: «perpendicular» va «they intersect» kesilardi.
      id: 'b3', tag: 'plane_parallel', ask: true, cols: 2,
      done: L('parallel', 'параллельны', 'parallel'),
      prompt: L('x + 2y + 2z = 6 va 2x + 4y + 4z = 5?', 'x + 2y + 2z = 6 и 2x + 4y + 4z = 5?', 'x + 2y + 2z = 6 and 2x + 4y + 4z = 5?'),
      items: [
        { id: 'a', label: L('parallel', 'параллельны', 'parallel'), correct: true },
        { id: 'b', label: L('ustma-ust', 'совпадают', 'the same'), hint: L("Ozod had mos emas: ikki karra olti o'n ikki, tenglamada esa besh.", 'Свободный член не пропорционален: дважды шесть двенадцать, а в уравнении пять.', 'The free term does not match: twice six is twelve, the equation says five.') },
        { id: 'c', label: L('perpendikular', 'перпендикулярны', 'perpendicular'), hint: L("Normallar kollinear, ya'ni ko'paytma eng katta, nol emas.", 'Нормали коллинеарны, значит произведение наибольшее, а не нуль.', 'The normals are collinear, so the product is largest, not zero.') },
        { id: 'd', label: L('kesishadi', 'пересекаются', 'they intersect'), hint: L("Kollinear normal kesishishga yo'l qoldirmaydi.", 'Коллинеарная нормаль не оставляет места пересечению.', 'A collinear normal leaves no room for intersection.') },
      ],
    },
    {
      id: 'b4', tag: 'plane_parallel', ask: true, cols: 4,
      done: '0',
      prompt: L('cos φ, normallar (1; 0; 0) va (0; 1; 0)?', 'cos φ, нормали (1; 0; 0) и (0; 1; 0)?', 'cos φ, normals (1; 0; 0) and (0; 1; 0)?'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: '1', hint: L("Bir kollinear normalda bo'lardi, bu yerda esa ko'paytma nol.", 'Единица была бы у коллинеарных нормалей, здесь произведение нуль.', 'One would mean collinear normals, here the product is zero.') },
        { id: 'c', label: '1/2', hint: L("Yarim oltmish gradusda, bu yerda esa to'qson.", 'Одна вторая при шестидесяти, а здесь девяносто.', 'A half means sixty, here it is ninety.') },
        { id: 'd', label: '−1', hint: L("Modul olingandan keyin kosinus manfiy bo'lmaydi.", 'После модуля косинус не бывает отрицательным.', 'After the absolute value a cosine is never negative.') },
      ],
    },
    {
      id: 'b5', tag: 'angle_obtuse', ask: true, cols: 4,
      done: '0°',
      prompt: L('Normallar (0; 0; 1) va (0; 0; −1). Burchak?', 'Нормали (0; 0; 1) и (0; 0; −1). Угол?', 'Normals (0; 0; 1) and (0; 0; −1). The angle?'),
      items: [
        { id: 'a', label: '0°', correct: true },
        { id: 'b', label: '180°', hint: L("Bu normallar orasidagi burchak. Tekisliklar esa parallel, ya'ni nol.", 'Это угол между нормалями. А плоскости параллельны, то есть нуль.', 'That is the angle between the normals. The planes are parallel, that is zero.') },
        { id: 'c', label: '90°', hint: L("Ko'paytma minus bir, nol emas.", 'Произведение минус один, а не нуль.', 'The product is minus one, not zero.') },
        { id: 'd', label: '45°', hint: L("Modul bilan kosinus bir, ya'ni burchak nol.", 'С модулем косинус единица, значит угол нуль.', 'With the absolute value the cosine is one, so the angle is zero.') },
      ],
    },
    {
      id: 'b6', tag: 'angle_obtuse', ask: true, cols: 4,
      done: '1/2',
      prompt: L('n₁ · n₂ = −6, uzunliklari 3 va 4. cos φ?', 'n₁ · n₂ = −6, длины 3 и 4. cos φ?', 'n₁ · n₂ = −6, lengths 3 and 4. cos φ?'),
      items: [
        { id: 'a', label: '1/2', correct: true },
        { id: 'b', label: '−1/2', hint: L("Modul minusni olib tashlaydi.", 'Модуль убирает минус.', 'The absolute value removes the minus.') },
        { id: 'c', label: '−6/7', hint: L("Uzunliklar qo'shilmaydi, ko'paytiriladi: uch karra to'rt o'n ikki.", 'Длины не складываются, а перемножаются: три на четыре двенадцать.', 'The lengths multiply, not add: three times four is twelve.') },
        { id: 'd', label: '2', hint: L("Kosinus birdan katta bo'lmaydi.", 'Косинус не бывает больше единицы.', 'A cosine is never above one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Perpendikularlik.', 'Перпендикулярность.', 'Perpendicularity.'),
    A('q3', 'Parallellik.', 'Параллельность.', 'Parallelism.'),
    A('q4', 'Kosinus.', 'Косинус.', 'The cosine.'),
    A('q5', 'Teskari normal.', 'Развёрнутая нормаль.', 'A flipped normal.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: modul tushib qolgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'angle_obtuse',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchta satr to\'g\'ri, bittasi yo\'q', 'Три строки верны, одна нет', 'Three lines are right, one is not'),
  rows: [
    { id: 'r1', text: 'n₁ (0; 0; 1),  n₂ (1; 0; −1)' },
    { id: 'r2', text: 'n₁ · n₂ = −1' },
    { id: 'r3', text: '|n₁| = 1,  |n₂| = √2' },
    { id: 'r4', text: 'cos φ = −1 / √2' },
    { id: 'r5', text: 'φ = 135°' },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Ko'paytma to'g'ri sanalgan: nol plyus nol minus bir.", 'Произведение посчитано верно: нуль плюс нуль минус один.', 'The product is right: zero plus zero minus one.'),
    r3: L("Uzunliklar to'g'ri: bir va ildiz ikki.", 'Длины верны: один и корень из двух.', 'The lengths are right: one and root two.'),
    r5: L("Oxirgi satr oldingisidan to'g'ri chiqadi. Xato yuqorida.", 'Последняя строка верно следует из предыдущей. Ошибка выше.', 'The last line follows correctly. The error is above.'),
  },
  proofPoint: L('modul tushib qolgan', 'модуль потерян', 'the absolute value is lost'),
  proof: L(
    "Kosinusda MODUL bo'lishi kerak edi. U bilan kosinus bir bo'lingan ildiz ikki, va javob qirq besh gradus. Chizmada ham tekisliklar orasida qirq besh ko'rinadi.",
    'В косинусе должен был стоять МОДУЛЬ. С ним косинус один на корень из двух, и ответ сорок пять градусов. На чертеже между плоскостями тоже видно сорок пять.',
    'The cosine should have taken an ABSOLUTE VALUE. With it the cosine is one over root two and the answer is forty five degrees. The drawing also shows forty five between the planes.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('modul olinmagan', 'не взят модуль', 'the absolute value was not taken'), correct: true },
      { id: 'b', label: L("ko'paytma xato", 'произведение неверно', 'the product is wrong'), hint: L("Ko'paytma to'g'ri: minus bir.", 'Произведение верно: минус один.', 'The product is right: minus one.') },
      { id: 'c', label: L('uzunlik xato', 'длина неверна', 'the length is wrong'), hint: L("Uzunliklar to'g'ri: bir va ildiz ikki.", 'Длины верны: один и корень из двух.', 'The lengths are right: one and root two.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javob to'qsondan katta, tekisliklar orasidagi burchak esa bunday bo'lmaydi.", 'Ответ больше девяноста, а угол между плоскостями таким не бывает.', 'The answer exceeds ninety, and the angle between planes never does.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: uchta satr haqiqatan to'g'ri. Xato bittasida, va uni tanish qiladi.", 'Внимание: три строки действительно верны. Ошибка в одной, и она узнаваемая.', 'Careful: three lines are truly right. The error is in one, and it is recognisable.'),
    A('proof', "Qarang: to'rtinchi satrda kosinus manfiy chiqib qolgan. Tekisliklar orasidagi burchak esa o'tmas bo'lmaydi, shuning uchun kosinusda modul turadi. Modul bilan javob qirq besh gradus. Va oson tekshiruv: javob to'qsondan katta chiqsa, modul tushib qolgan.", 'Смотри: в четвёртой строке косинус вышел отрицательным. А угол между плоскостями тупым не бывает, поэтому в косинусе стоит модуль. С модулем ответ сорок пять градусов. И простая проверка: если ответ больше девяноста, значит потерян модуль.', 'Look: in the fourth line the cosine came out negative. But the angle between planes is never obtuse, so the cosine takes an absolute value. With it the answer is forty five degrees. And an easy check: if the answer exceeds ninety, the absolute value was lost.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'plane_parallel',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Shartni yig\'ing', 'Собери условие', 'Build the condition'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('nol yoki proporsiya', 'нуль или пропорция', 'zero or a proportion'),
  tasks: [
    {
      prompt: L('2x + my − z va x + 2y + 3z perpendikular', '2x + my − z и x + 2y + 3z перпендикулярны', '2x + my − z and x + 2y + 3z are perpendicular'),
      template: ['2 + ', { slot: 0 }, ' − 3 ', { slot: 1 }, ' 0'],
      parts: ['2m', 'm', '=', '<'],
      answer: ['2m', '='],
      doneLabel: '2 + 2m − 3 = 0',
      wrongs: [
        { key: 'm|=', hint: L("Ikkinchi koeffitsiyentlar m va ikki, ularning ko'paytmasi ikki m.", 'Вторые коэффициенты m и два, их произведение два m.', 'The second coefficients are m and two, their product is two m.') },
        { key: '*', hint: L("Perpendikularlikda ko'paytma NOLGA TENG bo'ladi.", 'При перпендикулярности произведение РАВНО НУЛЮ.', 'Perpendicularity means the product EQUALS ZERO.') },
      ],
    },
    {
      prompt: L('3x − y + 2z = 7 ga parallel tekislik normali', 'нормаль плоскости, параллельной 3x − y + 2z = 7', 'the normal of a plane parallel to 3x − y + 2z = 7'),
      template: ['( 3 ;  ', { slot: 0 }, ' ;  ', { slot: 1 }, ' )'],
      parts: ['−1', '1', '2', '7'],
      answer: ['−1', '2'],
      doneLabel: '(3; −1; 2)',
      wrongs: [
        { key: '1|2', hint: L("Ikkinchi koeffitsiyent manfiy: minus igrek.", 'Второй коэффициент отрицательный: минус игрек.', 'The second coefficient is negative: minus y.') },
        { key: '−1|7', hint: L("Ozod had normalga kirmaydi.", 'Свободный член в нормаль не входит.', 'The free term is not part of the normal.') },
        { key: '*', hint: L("Parallel tekisliklarning normali bir xil, ya'ni koeffitsiyentlar o'sha.", 'У параллельных плоскостей нормаль одна, то есть коэффициенты те же.', 'Parallel planes share the normal, so the coefficients are the same.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: shart bor, yozuv kerak.', 'Ошибка найдена. Последнее задание обратное: есть условие, нужна запись.', 'The error is found. The last task is reverse: a condition is given, the record is needed.'),
    A('built1', "Endi ikkinchisi: parallel tekislikning normali.", 'Теперь второе: нормаль параллельной плоскости.', 'Now the second: the normal of a parallel plane.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'angle_obtuse',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'cos φ = |n₁ · n₂| / (|n₁| · |n₂|)',
  ruleLines: [
    L("burchak qirrada, javob o'tkir", 'угол на ребре, ответ острый', 'the angle on the edge, the answer acute'),
    L('nol -- perpendikular tekisliklar', 'нуль это перпендикулярные плоскости', 'zero means perpendicular planes'),
    L('kollinear normal -- parallel', 'коллинеарная нормаль это параллельность', 'a collinear normal means parallel'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('qaysi biri javob', 'который ответ', 'which is the answer'),
      right: '45°',
      map: { a: '135°', b: '45°', c: L('ikkalasi', 'оба', 'both'), d: L('aniqlanmaydi', 'не определить', 'cannot tell') },
    },
    {
      screen: 5,
      expr: L("normal teskari", 'нормаль развернули', 'the normal flipped'),
      right: L("burchak o'sha", 'угол тот же', 'the angle stays'),
      map: { a: L("o'sha", 'тот же', 'the same'), b: L("o'zgaradi", 'изменится', 'it changes') },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('135 va 45 → modul → 45', '135 и 45 → модуль → 45', '135 and 45 → the absolute value → 45'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va chizma ekraniga qayting", 'Вернись к правилу и к экрану с чертежом', 'Go back to the rule and the drawing screen'),
  },
  probe: {
    question: L(
      "Javob to'qsondan katta chiqdi. Nima bo'lgan?",
      'Ответ вышел больше девяноста. Что случилось?',
      'The answer exceeded ninety. What happened?',
    ),
    items: [
      { id: 'a', label: L('modul tushib qolgan', 'потерян модуль', 'the absolute value was lost'), correct: true },
      { id: 'b', label: L('uzunlik xato', 'неверная длина', 'a wrong length'), hint: L("Uzunlik musbat, va u burchakni to'qsondan chiqarib yubormaydi.", 'Длина положительна, и она не выведет угол за девяносто.', 'A length is positive and will not push the angle past ninety.') },
      { id: 'c', label: L('normal xato', 'неверная нормаль', 'a wrong normal'), hint: L("Normal xato bo'lsa ham javob to'qsondan oshmasligi kerak: modul buni ta'minlaydi.", 'Даже при неверной нормали ответ не должен превышать девяноста: это обеспечивает модуль.', 'Even with a wrong normal the answer should not exceed ninety: the absolute value ensures that.') },
      { id: 'd', label: L("shunday bo'lishi mumkin", 'так бывает', 'that happens'), hint: L("Bo'lmaydi: tekisliklar orasidagi burchak ta'rif bo'yicha o'tkir yoki to'g'ri.", 'Не бывает: угол между плоскостями по определению острый или прямой.', 'It does not: by definition the angle between planes is acute or right.') },
    ],
  },
  sheetTitle: L('Tekisliklar burchagi · shpargalka', 'Угол между плоскостями · шпаргалка', 'The angle between planes · cheat sheet'),
  sheetSrc: L('11-sinf · 39-dars', '11 класс · урок 39', 'Grade 11 · lesson 39'),
  lifehack: L(
    "Javob to'qsondan katta chiqsa -- modulni qo'ying.",
    'Если ответ больше девяноста — поставь модуль.',
    'If the answer exceeds ninety, put in the absolute value.',
  ),
  holds: [3000, 6000, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Javob qirq besh, va normalni teskari qilish burchakni o'zgartirmaydi.", 'Вот твои прогнозы и вот как оказалось. Ответ сорок пять, и разворот нормали угол не меняет.', 'Here are your guesses and here is how it turned out. The answer is forty five, and flipping the normal does not change the angle.'),
    A('rule', "Va mana darsning umumiy fikri. Tekisliklar orasidagi burchak qirrada o'lchanadi, va u normallar orqali topiladi. Lekin normal qayoqqa qaragani bizning tanlovimiz, shuning uchun kosinusda modul turadi va javob har doim o'tkir. Ko'paytma nol bo'lsa tekisliklar perpendikular, normallar kollinear bo'lsa parallel. Keyingi darsda shu normal masofani beradi.", 'И вот общая мысль урока. Угол между плоскостями измеряется на ребре, а находится через нормали. Но куда смотрит нормаль это наш выбор, поэтому в косинусе стоит модуль и ответ всегда острый. Если произведение нуль, плоскости перпендикулярны, если нормали коллинеарны, параллельны. На следующем уроке эта нормаль даст расстояние.', 'And here is the shared thought of the lesson. The angle between planes is measured on the edge and found through the normals. But where a normal points is our choice, so the cosine takes an absolute value and the answer is always acute. A zero product means perpendicular planes, collinear normals mean parallel ones. Next lesson this normal will give a distance.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
