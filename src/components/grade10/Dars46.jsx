// ============================================================================
// 10-sinf, Dars 46. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS46_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) tayyor.
// Ekran tanalari qo'lda yozilgan: asbob va figurani tanlash matematik qaror,
// va u avtomatlashtirilmaydi (etalon §5.3).
//
// Tartib: tanalarni to'ldirish, keyin `grade10-lesson-audit.mjs`, keyin
// tez yarus (2 o'lcham), keyin to'liq prognon. Har yangi figura oldin
// `probe/figures.html` stendida suratga olinadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import {
  AuditRows,
  MatchPairs,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  ProbeChain,
  ProofRows,
  Scene,
  SpinScene,
} from './tools.jsx'

import { Space3D } from './space.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 46
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Skalyar ko'paytma`,
  `Урок ${LESSON_NO}. Скалярное произведение`,
  `Lesson ${LESSON_NO}. The dot product`,
)

const BLOCK = { label: 'B8', from: 43, to: 47, current: 46 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L("KO'PAYTMA", 'ПРОИЗВЕДЕНИЕ', 'THE PRODUCT'),
  title: L("Uzunliklar yoki o'qlar bo'yicha yig'indi", 'Длины или суммы по осям', 'Lengths or the sum along the axes'),
  audio: [
    A('mount', "Ikki vektor, uzunliklari olti va uch. Ularning skalyar ko'paytmasini qidiramiz.", 'Два вектора, длины шесть и три. Ищем их скалярное произведение.', 'Two vectors, lengths six and three. We look for their dot product.'),
    A('r1', "Birinchi yozuv uzunliklarni ko'paytiradi va o'n sakkiz beradi.", 'Первая запись перемножает длины и даёт восемнадцать.', 'The first reading multiplies the lengths and gives eighteen.'),
    A('r2', "Ikkinchisi o'qlar bo'yicha ko'paytmalarni qo'shadi va o'n olti beradi.", 'Вторая складывает произведения по осям и даёт шестнадцать.', 'The second adds the products along the axes and gives sixteen.'),
    A('ask', "Ko'paytma so'zi uzunliklarni ko'paytirishga undaydi. Sizningcha qaysi yozuv to'g'ri?", 'Слово произведение подсказывает перемножить длины. Как думаешь, какая запись верная?', 'The word product suggests multiplying the lengths. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi hisoblaymiz.', 'Твой ответ записан. Сейчас посчитаем.', 'Your answer is recorded. Now we compute.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("uzunliklar ko'paytmasi", 'произведение длин', 'the product of the lengths'),
      value: '18',
    },
    b: {
      name: L("o'qlar bo'yicha ko'paytmalar yig'indisi", 'сумма произведений по осям', 'the sum of products along the axes'),
      value: '16',
    },
  },
  expr: 'a (4; 4; 2),   b (1; 2; 2)',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Kursdan uch savol', 'Три вопроса из курса', 'Three questions from the course'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi.", 'Три вопроса. Правило урока соберётся из первого и второго.', 'Three questions. The rule of the lesson will be assembled from the first and the second.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Skalyar ko'paytma nima beradi?", 'Что даёт скалярное произведение?', 'What does a dot product give?'),
      done: 'a·b = 16',
      items: [
        { id: 'a', label: L('son', 'число', 'a number'), correct: true },
        { id: 'b', label: L('vektor', 'вектор', 'a vector'), hint: L("Skalyar so'zining o'zi natija son ekanini bildiradi.", 'Слово скалярное и значит, что результат число.', 'The word scalar itself means the result is a number.') },
        { id: 'c', label: L('burchak', 'угол', 'an angle'), hint: L("Burchak undan olinadi, o'zi esa son.", 'Угол из него достают, но сам он число.', 'The angle is extracted from it, but it is a number itself.') },
        { id: 'd', label: L('uzunlik', 'длину', 'a length'), hint: L("Uzunlik manfiy bo'lmaydi, ko'paytma esa bo'ladi.", 'Длина не бывает отрицательной, а произведение бывает.', 'A length is never negative, a product can be.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("To'g'ri burchakning kosinusi nimaga teng?", 'Чему равен косинус прямого угла?', 'What is the cosine of a right angle?'),
      done: 'cos 90° = 0',
      items: [
        { id: 'a', label: L('nolga', 'нулю', 'zero'), correct: true },
        { id: 'b', label: L('birga', 'единице', 'one'), hint: L('Bir nol burchakning kosinusi.', 'Единица это косинус нулевого угла.', 'One is the cosine of the zero angle.') },
        { id: 'c', label: L('bir ikkidan', 'одной второй', 'one half'), hint: L('Bir ikkidan oltmish daraja.', 'Одна вторая это шестьдесят градусов.', 'One half is sixty degrees.') },
        { id: 'd', label: L('minus birga', 'минус единице', 'minus one'), hint: L('Minus bir yoyilgan burchak.', 'Минус единица это развёрнутый угол.', 'Minus one is the straight angle.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Uzunlik uchlik bo'yicha qanday hisoblanadi?", 'Как считается длина по тройке?', 'How is a length computed from a triple?'),
      done: '|a| = 6',
      items: [
        { id: 'a', label: L("kvadratlar yig'indisidan ildiz", 'корень из суммы квадратов', 'the root of the sum of squares'), correct: true },
        { id: 'b', label: L("uch sonning yig'indisi", 'сумма трёх чисел', 'the sum of the three numbers'), hint: L("Yig'indi boshqa sonni beradi.", 'Сумма даёт другое число.', 'The sum gives another number.') },
        { id: 'c', label: L("sonlar ko'paytmasi", 'произведение чисел', 'the product of the numbers'), hint: L("Nol bo'lsa, ko'paytma nolga aylanadi.", 'Произведение обнулится, если есть ноль.', 'The product becomes zero if there is a zero.') },
        { id: 'd', label: L('sonlarning eng kattasi', 'наибольшее из чисел', 'the largest of the numbers'), hint: L("Eng kattasi bitta o'lchov.", 'Наибольшее это одно измерение.', 'The largest is one dimension.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'qlar bo'yicha ko'paytiramiz va qo'shamiz", 'Перемножаем по осям и складываем', 'We multiply along the axes and add'),
  tag: 'kosinussiz-kopaytma',
  show: [
    [
      L('a vektori va b vektori', 'вектор a и вектор b', 'the vector a and the vector b'),
      L("birinchi o'q bo'yicha to'rt karra bir", 'по первой оси четыре на один', 'along the first axis four times one'),
    ],
    [
      L("va har o'q bo'yicha shunday", 'и так по каждой оси', 'and so along each axis'),
      L("yig'indi o'n oltiga teng", 'сумма равна шестнадцати', 'the sum equals sixteen'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ikki vektor bir nuqtadan chiqarilgan, va ular orasida burchak ko'rinadi.", 'Два вектора выпущены из одной точки, и между ними виден угол.', 'Two vectors are drawn from one point, and the angle between them is visible.'),
    A('move', "Skalyar ko'paytma o'qlar bo'yicha va juda qisqa hisoblanadi. To'rtni birga ko'paytirsak to'rt bo'ladi. To'rtni ikkiga ko'paytirsak sakkiz bo'ladi. Ikkini ikkiga ko'paytirsak to'rt bo'ladi. Qo'shamiz va o'n olti chiqadi. Bu yozuvning ikki xossasiga e'tibor bering. Birinchisi: natija son, vektor emas, shuning uchun unda yo'nalish yo'q. Ikkinchisi: ko'paytuvchilar tartibi muhim emas, a karra b va b karra a bir xil, chunki har qo'shiluvchi ikki sonning ko'paytmasi. Va e'tibor bering, bu hisobda uzunliklar umuman qatnashmadi: faqat uchliklar kerak bo'ldi.", 'Скалярное произведение считается по осям и очень коротко. Четыре умножить на один даёт четыре. Четыре умножить на два даёт восемь. Два умножить на два даёт четыре. Складываем и получаем шестнадцать. Обрати внимание на два свойства этой записи. Первое: результат число, а не вектор, и потому у него нет направления. Второе: порядок множителей не важен, произведение a на b и b на a одно и то же, потому что каждое слагаемое это произведение двух чисел. И заметь, что длины в этом счёте не участвовали вообще: понадобились только тройки.', 'The dot product is computed along the axes and very briefly. Four times one gives four. Four times two gives eight. Two times two gives four. We add and get sixteen. Note two properties of this notation. First: the result is a number and not a vector, so it has no direction. Second: the order of the factors does not matter, a times b and b times a are the same, because every term is a product of two numbers. And note that the lengths did not take part in this counting at all: only the triples were needed.'),
    A('work', "O'zingiz hisoblang. a va b ning skalyar ko'paytmasi nimaga teng?", 'Посчитай сам. Чему равно скалярное произведение a и b?', 'Work it out yourself. What does the dot product of a and b equal?'),
  ],
  work: {
    prompt: L("a va b ning skalyar ko'paytmasi?", 'Скалярное произведение a и b?', 'The dot product of a and b?'),
    ok: L("O'n olti. To'rt qo'shuv sakkiz qo'shuv to'rt.", 'Шестнадцать. Четыре плюс восемь плюс четыре.', 'Sixteen. Four plus eight plus four.'),
    hint: [
      L("Sonlarni bir o'q bo'yicha ko'paytirib, keyin qo'shing.", 'Перемножай числа по одной оси, потом складывай.', 'Multiply the numbers along one axis, then add.'),
      L("To'rt, sakkiz, to'rt.", 'Четыре, восемь, четыре.', 'Four, eight, four.'),
      L("O'n olti.", 'Шестнадцать.', 'Sixteen.'),
    ],
    answer: '16',
  },
  expr: 'a·b = 4 + 8 + 4',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Uzunliklar kosinus bilan birga kiradi', 'Длины входят вместе с косинусом', 'The lengths enter together with the cosine'),
  tag: 'kosinussiz-kopaytma',
  show: [
    [
      L('a ning uzunligi oltiga teng', 'длина a равна шести', 'the length of a equals six'),
      L('b ning uzunligi uchga teng', 'длина b равна трём', 'the length of b equals three'),
    ],
    [
      L("uzunliklar ko'paytmasi o'n sakkiz", 'произведение длин восемнадцать', 'the product of the lengths is eighteen'),
      L("ko'paytma esa o'n olti", 'а произведение шестнадцать', 'and the product is sixteen'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ikki vektorning uzunligini hisoblab, ularni ko'paytiraman.", 'Посчитаю длины обоих векторов и перемножу их.', 'Let me compute the lengths of both vectors and multiply them.'),
    A('move', "Olti karra uch o'n sakkiz beradi, skalyar ko'paytmani esa biz allaqachon hisobladik, va u o'n olti. Sonlar boshqa, va farq bejiz emas: ikkinchi formulaning uchinchi ko'paytuvchisi bor, vektorlar orasidagi burchakning kosinusi. O'n sakkizni kosinusga ko'paytirsak o'n olti bo'ladi, demak kosinus sakkiz to'qqizdan. Burchak kichik, vektorlar deyarli bir tomonga qaraydi, va shuning uchun ko'paytma uzunliklar ko'paytmasiga yaqin. Ana darsning savoliga javob: uzunliklarni ko'paytirish mumkin, lekin bu eng katta mumkin bo'lgan qiymat bo'ladi, ko'paytmaning o'zi emas. Ular faqat kosinus birga teng bo'lganda, ya'ni vektorlar bir yo'nalishda bo'lganda mos tushadi.", 'Шесть на три даёт восемнадцать, а скалярное произведение мы уже посчитали, и оно шестнадцать. Числа разные, и разница не случайна: у второй формулы есть третий множитель, косинус угла между векторами. Восемнадцать умножить на косинус даёт шестнадцать, значит косинус равен восьми девятым. Угол небольшой, векторы смотрят почти в одну сторону, и произведение поэтому близко к произведению длин. Вот и ответ на вопрос урока: перемножить длины можно, но это будет наибольшее возможное значение, а не само произведение. Совпадут они только тогда, когда косинус равен единице, то есть когда векторы сонаправлены.', 'Six times three gives eighteen, and we have already computed the dot product, and it is sixteen. The numbers differ, and the difference is no accident: the second formula has a third factor, the cosine of the angle between the vectors. Eighteen times the cosine gives sixteen, so the cosine equals eight ninths. The angle is small, the vectors point almost the same way, and that is why the product is close to the product of the lengths. There is the answer to the question of the lesson: you may multiply the lengths, but that will be the largest possible value and not the product itself. They coincide only when the cosine equals one, that is when the vectors have the same direction.'),
    A('work', "O'zingiz hisoblang. Uzunliklar ko'paytmasi nimaga teng?", 'Посчитай сам. Чему равно произведение длин?', 'Work it out yourself. What does the product of the lengths equal?'),
  ],
  work: {
    prompt: L("Uzunliklar ko'paytmasi?", 'Произведение длин?', 'The product of the lengths?'),
    ok: L("O'n sakkiz. Olti karra uch.", 'Восемнадцать. Шесть на три.', 'Eighteen. Six times three.'),
    hint: [
      L('Uzunliklar olti va uch.', 'Длины шесть и три.', 'The lengths are six and three.'),
      L("Ularni ko'paytirish kerak.", 'Их надо перемножить.', 'They must be multiplied.'),
      L("O'n sakkiz.", 'Восемнадцать.', 'Eighteen.'),
    ],
    answer: '18',
  },
  expr: '|a|·|b| = 18',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nol to'g'ri burchakni bildiradi", 'Ноль означает прямой угол', 'Zero means a right angle'),
  tag: 'kosinussiz-kopaytma',
  show: [
    [
      L("uzunligi o'sha uch bo'lgan c vektori", 'вектор c той же длины три', 'the vector c of the same length three'),
      L("uzunliklar o'zgarmadi", 'длины не изменились', 'the lengths did not change'),
    ],
    [
      L("ko'paytma esa nol bo'ldi", 'а произведение стало нулём', 'and the product became zero'),
      L("burchak to'g'ri chiqdi", 'угол оказался прямым', 'the angle turned out right'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "b ni c vektoriga almashtiraman. Uning uzunligi o'sha, uch, yo'nalishi esa boshqa.", 'Заменю b на вектор c. Длина у него та же, три, а направление другое.', 'Let me replace b with the vector c. Its length is the same, three, but its direction is different.'),
    A('move', "O'qlar bo'yicha hisoblayman: to'rt karra ikki sakkiz beradi, to'rt karra minus bir minus to'rt beradi, ikki karra minus ikki minus to'rt beradi. Yig'indi nol. Uzunliklar o'zgarmadi, ko'paytma o'zgardi, va bu darsning asosiy savoliga javob: uzunliklar ko'paytmani aniqlamaydi. Bundan tashqari, bu yerdagi nol tasodifiy mos tushish emas. Ko'paytma uzunliklar karra kosinusga teng, uzunliklar nol emas, demak aynan kosinus nol bo'ldi. Kosinus esa roppa-rosa to'qsan darajada nolga teng. Shundan perpendikulyarlik alomati, blokdagi eng foydalisi: ikki vektor faqat va faqat skalyar ko'paytmasi nolga teng bo'lganda perpendikulyar. Tekshiruv uchliklar bo'yicha boradi, hech qanday chizmasiz va hech qanday burchaksiz.", 'Считаю по осям: четыре на два даёт восемь, четыре на минус один даёт минус четыре, два на минус два даёт минус четыре. Сумма ноль. Длины не изменились, произведение изменилось, и это и есть ответ на главный вопрос урока: длины произведение не определяют. Более того, ноль тут не случайное совпадение. Произведение равно длинам, умноженным на косинус, длины не нули, значит нулём стал именно косинус. А косинус равен нулю ровно на девяноста градусах. Отсюда признак перпендикулярности, самый полезный в блоке: два вектора перпендикулярны тогда и только тогда, когда их скалярное произведение равно нулю. Проверка идёт по тройкам, без всякого чертежа и без всякого угла.', 'I compute along the axes: four times two gives eight, four times minus one gives minus four, two times minus two gives minus four. The sum is zero. The lengths did not change, the product did, and that is the answer to the main question of the lesson: the lengths do not determine the product. Moreover, the zero here is not a chance coincidence. The product equals the lengths times the cosine, the lengths are not zero, so it is the cosine that became zero. And the cosine equals zero exactly at ninety degrees. Hence the criterion of perpendicularity, the most useful one in the block: two vectors are perpendicular if and only if their dot product equals zero. The check goes by the triples, with no drawing and no angle at all.'),
    A('work', "O'zingiz hisoblang. a va c ning ko'paytmasi nimaga teng?", 'Посчитай сам. Чему равно произведение a и c?', 'Work it out yourself. What does the product of a and c equal?'),
  ],
  work: {
    prompt: L("a va c ning ko'paytmasi?", 'Произведение a и c?', 'The product of a and c?'),
    ok: L("Nol. Demak burchak to'g'ri.", 'Ноль. Значит угол прямой.', 'Zero. So the angle is right.'),
    hint: [
      L("O'qlar bo'yicha hisoblang, ishoralarni hisobga oling.", 'Считай по осям, знаки учитывай.', 'Compute along the axes, take the signs into account.'),
      L("Sakkiz minus to'rt minus to'rt.", 'Восемь минус четыре минус четыре.', 'Eight minus four minus four.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  expr: 'a·c = 0',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Vektor o'ziga karra uzunlik kvadratini beradi", 'Вектор на себя даёт квадрат длины', 'A vector times itself gives the square of the length'),
  tag: 'kosinussiz-kopaytma',
  show: [
    [
      L("a ni olib, a ga ko'paytiramiz", 'берём a и умножаем на a', 'we take a and multiply by a'),
      L('ular orasidagi burchak nol', 'угол между ними нулевой', 'the angle between them is zero'),
    ],
    [
      L('kosinus birga teng', 'косинус равен единице', 'the cosine equals one'),
      L("natija o'ttiz olti", 'результат тридцать шесть', 'the result is thirty six'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Vektorni o'ziga ko'paytiraman. U va o'zi orasidagi burchak nol.", 'Умножу вектор на самого себя. Угол между ним и им же нулевой.', 'Let me multiply a vector by itself. The angle between it and itself is zero.'),
    A('move', "Nol burchakning kosinusi birga teng, demak ko'paytma shunchaki uzunlik karra uzunlik, ya'ni uzunlik kvadrati. O'qlar bo'yicha ham o'sha chiqadi: o'n olti qo'shuv o'n olti qo'shuv to'rt o'ttiz olti beradi, va bu roppa-rosa olti kvadrat. Shundan qulay usul: uzunlik kerak bo'lsa, qo'l ostida esa faqat uchlik bo'lsa, skalyar kvadratni hisoblab, ildizini olish mumkin. Va yana bitta natija, tekshiruvlar uchun muhim. Skalyar kvadrat hech qachon manfiy bo'lmaydi, chunki u kvadratlar yig'indisi. Demak yechimingizda manfiy skalyar kvadrat chiqsa, xato allaqachon bo'lgan, va uni oldinroqdan qidirish kerak.", 'Косинус нулевого угла равен единице, значит произведение это просто длина на длину, то есть квадрат длины. По осям выходит то же: шестнадцать плюс шестнадцать плюс четыре даёт тридцать шесть, и это ровно шесть в квадрате. Отсюда удобный приём: если нужна длина, а под руками только тройка, можно посчитать скалярный квадрат и взять корень. И ещё одно следствие, важное для проверок. Скалярный квадрат никогда не бывает отрицательным, потому что он сумма квадратов. Значит если у тебя в решении вышел отрицательный скалярный квадрат, ошибка уже случилась, и искать её надо раньше.', 'The cosine of the zero angle equals one, so the product is simply length times length, that is the square of the length. Along the axes the same comes out: sixteen plus sixteen plus four gives thirty six, and that is exactly six squared. Hence a handy trick: if you need a length and have only a triple at hand, you can compute the scalar square and take the root. And one more consequence, important for checking. A scalar square is never negative, because it is a sum of squares. So if a negative scalar square appeared in your solution, the mistake has already happened and must be looked for earlier.'),
    A('work', "O'zingiz hisoblang. a karra a nimaga teng?", 'Посчитай сам. Чему равно произведение a на a?', 'Work it out yourself. What does a times a equal?'),
  ],
  work: {
    prompt: L('a karra a?', 'Произведение a на a?', 'The product of a times a?'),
    ok: L("O'ttiz olti. Bu olti kvadrat.", 'Тридцать шесть. Это шесть в квадрате.', 'Thirty six. That is six squared.'),
    hint: [
      L('a ning uzunligi oltiga teng.', 'Длина a равна шести.', 'The length of a equals six.'),
      L('Nol burchakning kosinusi birga teng.', 'Косинус нулевого угла равен единице.', 'The cosine of the zero angle equals one.'),
      L("O'ttiz olti.", 'Тридцать шесть.', 'Thirty six.'),
    ],
    answer: '36',
  },
  expr: 'a·a = 36',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L('Ishora burchak haqida aytadi', 'Знак говорит про угол', 'The sign speaks of the angle'),
  tag: 'kosinussiz-kopaytma',
  show: [
    [
      L('uch juft vektor', 'три пары векторов', 'three pairs of vectors'),
      L("ko'paytmalar o'n olti, nol, minus to'rt", 'произведения шестнадцать, ноль, минус четыре', 'the products are sixteen, zero, minus four'),
    ],
    [
      L("noldan katta o'tkir degani", 'больше нуля значит острый', 'greater than zero means acute'),
      L("noldan kichik o'tmas degani", 'меньше нуля значит тупой', 'less than zero means obtuse'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Uchinchi juftni, b va c ni olamiz. Ikki uzunlik ham uch, ko'paytma esa minus to'rt.", 'Возьмём третью пару, b и c. Обе длины по три, а произведение минус четыре.', 'Take the third pair, b and c. Both lengths are three and the product is minus four.'),
    A('move', "Manfiy ko'paytma xato emas. Uzunliklar har doim musbat, demak ishora kosinusdan keldi, kosinus esa o'tmas burchaklarda manfiy. Shunday qilib ishora asbobga aylanadi: noldan katta -- burchak o'tkir, roppa-rosa nol -- to'g'ri, noldan kichik -- o'tmas. Bu uchliklar bo'yicha darrov o'qiladi, kosinusni hisoblamasdan, va imtihonda vaqt tejaydi. Va maxsus hol: vektorlardan biri nol bo'lsa, ko'paytma ham nol, lekin bu perpendikulyarlikni bildirmaydi -- nol vektorda yo'nalish umuman yo'q, va u bilan burchak aniqlanmagan. Shuning uchun perpendikulyarlik alomatida har doim ikki vektor ham nol emasligi aytiladi.", 'Отрицательное произведение не ошибка. Длины положительны всегда, значит знак пришёл от косинуса, а косинус отрицателен на тупых углах. Так знак становится инструментом: больше нуля значит угол острый, ровно ноль значит прямой, меньше нуля значит тупой. Это читается сразу по тройкам, без счёта косинуса, и на экзамене экономит время. И особый случай: если один из векторов нулевой, произведение тоже ноль, но перпендикулярности это не означает, потому что у нулевого вектора направления нет вовсе, и угол с ним не определён. Поэтому в признаке перпендикулярности всегда оговаривают, что оба вектора не нулевые.', 'A negative product is not a mistake. Lengths are always positive, so the sign came from the cosine, and the cosine is negative at obtuse angles. So the sign becomes a tool: greater than zero means the angle is acute, exactly zero means right, less than zero means obtuse. That is read straight off the triples, without computing the cosine, and it saves time at the exam. And a special case: if one of the vectors is the zero vector, the product is zero too, but that does not mean perpendicularity, because the zero vector has no direction at all and the angle with it is undefined. That is why the criterion of perpendicularity always states that both vectors are non zero.'),
    A('work', "O'zingiz hisoblang. Uch juftdan nechtasi to'g'ri burchak beradi?", 'Посчитай сам. Сколько из трёх пар дают прямой угол?', 'Work it out yourself. How many of the three pairs give a right angle?'),
  ],
  work: {
    prompt: L("Nechta juft to'g'ri burchak beradi?", 'Сколько пар дают прямой угол?', 'How many pairs give a right angle?'),
    ok: L("Bittasi. Faqat ko'paytmasi nol bo'lgani.", 'Одна. Только та, где произведение ноль.', 'One. Only the one whose product is zero.'),
    hint: [
      L("To'g'ri burchak roppa-rosa nol.", 'Прямой угол это ровно ноль.', 'A right angle is exactly zero.'),
      L("O'n olti va minus to'rt nol emas.", 'Шестнадцать и минус четыре не нули.', 'Sixteen and minus four are not zero.'),
      L('Bittasi.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'b·c = −4',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Bitta sonning ikki formulasi', 'Две формулы одного числа', 'Two formulas of one number'),
  tag: 'kosinussiz-kopaytma',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Ikki formula bir xil sonni beradi, va butun kuch shunda. Birinchisi uchliklar bo'yicha hisoblanadi va na chizma, na burchak talab qiladi. Ikkinchisi ma'noni tushuntiradi va uchliklar ma'lum bo'lganda burchakni topishga imkon beradi. Birgalikda ular shunday ishlaydi: o'qlar bo'yicha hisobladingiz, uzunliklar ko'paytmasiga bo'ldingiz, kosinusni oldingiz. Uchinchi satr perpendikulyarlik alomati, va u imtihonda eng ko'p uchraydi. Nol vektorlar haqidagi shart rasmiyatchilik emas: nol vektorda yo'nalish yo'q, va u bilan burchak aniqlanmagan, shuning uchun bu holda nol burchak haqida hech narsa aytmaydi.", 'Две формулы дают одно и то же число, и в этом вся сила. Первая считается по тройкам и не требует ни чертежа, ни угла. Вторая объясняет смысл и позволяет найти угол, когда тройки известны. Вместе они работают так: посчитал по осям, поделил на произведение длин, получил косинус. Третья строка это признак перпендикулярности, и он самый частый на экзамене. Оговорка про нулевые векторы не формальность: у нулевого вектора направления нет, и угол с ним не определён, поэтому ноль в этом случае ничего про угол не говорит.', 'The two formulas give one and the same number, and that is where all the power lies. The first is computed by triples and requires neither a drawing nor an angle. The second explains the meaning and lets you find the angle when the triples are known. Together they work like this: you computed along the axes, divided by the product of the lengths, got the cosine. The third line is the criterion of perpendicularity, and it is the most frequent one at the exam. The clause about zero vectors is not a formality: the zero vector has no direction and the angle with it is undefined, so zero in that case says nothing about the angle.'),
  ],
  probe: {
    question: L("Ko'paytma uzunliklar ko'paytmasiga qachon teng?", 'Когда произведение равно произведению длин?', 'When does the product equal the product of the lengths?'),
    items: [
      { id: 'a', label: L("vektorlar bir yo'nalishda bo'lganda", 'когда векторы сонаправлены', 'when the vectors have the same direction'), correct: true },
      { id: 'b', label: L('har doim', 'всегда', 'always'), hint: L("U holda kosinus har doim bir bo'lardi.", 'Тогда косинус был бы всегда единицей.', 'Then the cosine would always be one.') },
    ],
  },
  rule: {
    lawLabel: L("Skalyar ko'paytma", 'Скалярное произведение', 'The dot product'),
    lines: [
      L("uchliklar bo'yicha bu o'qlar bo'yicha ko'paytmalar yig'indisi", 'по тройкам это сумма произведений по осям', 'by triples it is the sum of products along the axes'),
      L('uzunliklar orqali bu uzunliklar karra burchak kosinusi', 'через длины это длины, умноженные на косинус угла', 'through lengths it is the lengths times the cosine of the angle'),
      L("nol to'g'ri burchakni bildiradi, agar ikki vektor ham nol bo'lmasa", 'ноль означает прямой угол, если оба вектора не нулевые', 'zero means a right angle, provided both vectors are non zero'),
    ],
    law: 'a·b = |a|·|b|·cos φ',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Juft va uning ko'paytmasi", 'Пара и её произведение', 'A pair and its product'),
  tag: 'kosinussiz-kopaytma',
  audio: [
    A('mount', "To'rt son va to'rt juft. O'qlar bo'yicha hisoblang.", 'Четыре числа и четыре пары. Считай по осям.', 'Four numbers and four pairs. Count along the axes.'),
  ],
  match: {
    prompt: L('Sonni juft bilan birlashtiring', 'Соедини число с парой', 'Match the number with the pair'),
    ok: L("To'rttasi ham joyida. Ishora burchakni o'qiydi.", 'Все четыре на месте. Знак читает угол.', 'All four in place. The sign reads the angle.'),
    a: L('a va b', 'a и b', 'a and b'),
    b: L('a va c', 'a и c', 'a and c'),
    c: L('a va a', 'a и a', 'a and a'),
    d: L('b va c', 'b и c', 'b and c'),
    left: ['16', '0', '36', '−4'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Vektorlar perpendikulyar ekanini isbotlang', 'Докажи, что векторы перпендикулярны', 'Prove the vectors are perpendicular'),
  tag: 'kosinussiz-kopaytma',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('a va c vektorlarining uchliklari, ikkisi ham nol emas', 'тройки векторов a и c, оба не нулевые', 'the triples of a and c, both non zero'),
    goal: L("ular orasidagi burchak to'g'ri", 'угол между ними прямой', 'the angle between them is right'),
    r1: L("o'qlar bo'yicha ko'paytma nolga teng", 'произведение по осям равно нулю', 'the product along the axes equals zero'),
    r2: L("uzunliklar nol emas, demak kosinus nol bo'ldi", 'длины не нули, значит нулём стал косинус', 'the lengths are not zero, so it is the cosine that became zero'),
    r3: L("kosinus to'qsan darajada nolga teng", 'косинус равен нулю на девяноста градусах', 'the cosine equals zero at ninety degrees'),
    ok: L("Isbotlandi. Alomat uchliklar bo'yicha, chizmasiz ishlaydi.", 'Доказано. Признак работает по тройкам, без чертежа.', 'Proved. The criterion works by triples, without a drawing.'),
    e1: L("Uzunliklar haqida keyin. Avval ko'paytmani hisoblang.", 'Про длины дальше. Сначала посчитай произведение.', 'The lengths come later. First compute the product.'),
    e2: L('Nol olindi. Endi bu nega kosinus.', 'Ноль получен. Теперь почему это косинус.', 'The zero is obtained. Now why it is the cosine.'),
    e3: L('Kosinus nol. Endi burchak haqida xulosa.', 'Косинус ноль. Теперь вывод про угол.', 'The cosine is zero. Now the conclusion about the angle.'),
  },
  reason: {
    s1: L("ko'paytma o'qlar bo'yicha hisoblanadi", 'произведение считается по осям', 'the product is computed along the axes'),
    s2: L("ko'paytmaning ikkinchi formulasi", 'вторая формула произведения', 'the second formula of the product'),
    s3: L("to'g'ri burchakning kosinusi nolga teng", 'косинус прямого угла равен нулю', 'the cosine of a right angle equals zero'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'a·c = 0',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO TOOL'),
  title: L('Hisob va tartib', 'Счёт и порядок', 'Counting and order'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob olib qo'yildi. Qog'ozda hisoblaymiz.", 'Прибор убран. Считаем на бумаге.', 'The tool is put away. We count on paper.'),
    A('next', 'Endi qadamlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring.', 'Теперь порядок шагов. Расставь их так, как считают.', 'Now the order of the steps. Arrange them the way the counting goes.'),
  ],
  task: {
    ok: L('Oltmish. Kosinus bir ikkidan chiqdi.', 'Шестьдесят. Косинус вышел одна вторая.', 'Sixty. The cosine came out one half.'),
    hint: [
      L("Ko'paytmani uzunliklar ko'paytmasiga bo'ling.", 'Раздели произведение на произведение длин.', 'Divide the product by the product of the lengths.'),
      L("To'qqizni o'n sakkizga bo'lsak bir ikkidan bo'ladi.", 'Девять на восемнадцать даёт одну вторую.', 'Nine over eighteen gives one half.'),
      L('Oltmish daraja.', 'Шестьдесят градусов.', 'Sixty degrees.'),
    ],
    prompt: '|a| = 6,   |b| = 3,   a·b = 9,   φ = ?',
    answer: '60',
  },
  order: {
    prompt: L('Qadamlarni hisoblash tartibida joylashtiring', 'Расставь шаги в том порядке, в каком считают', 'Arrange the steps in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Ko'paytma, uzunliklar, kosinus, burchak.", 'Порядок верный. Произведение, длины, косинус, угол.', 'The order is right. The product, the lengths, the cosine, the angle.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['φ', 'a·b', 'cos φ', '|a|·|b|'],
    answer: 'a·b  |a|·|b|  cos φ  φ',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato qatorni toping', 'Найди строку с ошибкой', 'Find the line with the mistake'),
  tag: 'check',
  audio: [
    A('mount', "To'rt qator, va ulardan biri kosinusni yo'qotadi.", 'Четыре строки, и одна из них теряет косинус.', 'Four lines, and one of them loses the cosine.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Uzunliklar to'g'ri hisoblangan.", 'Длины посчитаны верно.', 'The lengths are computed correctly.'),
    r4: L('Kosinus yuqoridagi xato qatordan olingan.', 'Косинус получен из неверной строки выше.', 'The cosine comes from the wrong line above.'),
  },
  proof: L("Sahnani buring: uzunliklar turadi, ko'paytma esa burchak bilan o'zgaradi.", 'Поверни сцену: длины держатся, а произведение меняется вместе с углом.', 'Rotate the scene: the lengths hold while the product changes with the angle.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. Ko'paytma uzunliklar ko'paytmasi deb olingan.", 'Третья. Произведение взяли как произведение длин.', 'The third. The product was taken as the product of the lengths.'),
    hint: [
      L('Uchinchi qatordagi son qayerdan olinganini tekshiring.', 'Проверь, откуда взялось число в третьей строке.', 'Check where the number in the third line came from.'),
      L("O'qlar bo'yicha o'n olti chiqadi, o'n sakkiz emas.", 'По осям выходит шестнадцать, а не восемнадцать.', 'Along the axes sixteen comes out, not eighteen.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'a (4; 4; 2),   b (1; 2; 2)',
    r2: '|a| = 6,   |b| = 3',
    r3: 'a·b = 18',
    r4: 'cos φ = 1',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Teskari tomonga', 'В обратную сторону', 'The other way round'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Darsni o'ngdan chapga o'qiymiz. Ko'paytma berilgan, burchakni topish kerak.", 'Прочитаем урок справа налево. Дано произведение, найти надо угол.', 'Let us read the lesson from right to left. The product is given, the angle is to be found.'),
    A('work', "To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны. Их больше одной.', 'Mark all the readings that are correct. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Bu vektorlar uchun nima to'g'ri", 'Что верно для этих векторов', 'What is true for these vectors'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi kosinus va ishorani yo'qotadi.", 'Три записи из пяти. Две оставшиеся теряют косинус и знак.', 'Three readings out of five. The other two lose the cosine and the sign.'),
    items: [
      { id: 'd', label: 'a·b = 18', hint: L("Bu uzunliklar ko'paytmasi, skalyar ko'paytma emas.", 'Это произведение длин, а не скалярное произведение.', 'That is the product of the lengths, not the dot product.') },
      { id: 'e', label: 'a·a = −36', hint: L("Skalyar kvadrat manfiy bo'lmaydi.", 'Скалярный квадрат отрицательным не бывает.', 'A scalar square is never negative.') },
      { id: 'a', label: 'a·b = 16', ok: true },
      { id: 'b', label: 'a·c = 0', ok: true },
      { id: 'c', label: 'a·a = 36', ok: true },
    ],
  },
  place: {
    prompt: L("Ikki nolmas vektorning skalyar ko'paytmasi nolga teng. Ular orasidagi burchak necha daraja?", 'Скалярное произведение двух ненулевых векторов равно нулю. Каков угол между ними в градусах?', 'The dot product of two non zero vectors equals zero. What is the angle between them in degrees?'),
    ok: L("To'qsan. Nol to'g'ri burchakni bildiradi.", 'Девяносто. Ноль означает прямой угол.', 'Ninety. Zero means a right angle.'),
    wrong: L("Uzunliklar nol emas, demak kosinus nol bo'ldi.", 'Длины не нули, значит нулём стал косинус.', 'The lengths are not zero, so it is the cosine that became zero.'),
    target: '90',
    step: 'cos φ = 0',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'kosinussiz-kopaytma',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Skalyar ko'paytma nima beradi?", 'Что даёт скалярное произведение?', 'What does a dot product give?'),
      done: 'a·b = 16',
      items: [
        { id: 'a', label: L('son', 'число', 'a number'), correct: true },
        { id: 'b', label: L('vektor', 'вектор', 'a vector'), hint: L("Skalyar so'zining o'zi son degani.", 'Слово скалярное и значит число.', 'The word scalar itself means a number.') },
        { id: 'c', label: L('uzunlik', 'длину', 'a length'), hint: L("Uzunlik manfiy bo'lmaydi.", 'Длина не бывает отрицательной.', 'A length is never negative.') },
        { id: 'd', label: L('yuza', 'площадь', 'an area'), hint: L("Yuzaning bunga aloqasi yo'q.", 'Площадь тут ни при чём.', 'An area has nothing to do with it.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Nolmas vektorlarda nol nimani bildiradi?', 'Что означает ноль у ненулевых векторов?', 'What does zero mean for non zero vectors?'),
      done: 'cos 90° = 0',
      items: [
        { id: 'a', label: L("to'g'ri burchak", 'прямой угол', 'a right angle'), correct: true },
        { id: 'b', label: L('nol burchak', 'нулевой угол', 'the zero angle'), hint: L("Nol burchakda ko'paytma eng katta.", 'При нулевом угле произведение наибольшее.', 'At the zero angle the product is the largest.') },
        { id: 'c', label: L("o'tmas burchak", 'тупой угол', 'an obtuse angle'), hint: L("O'tmasda ko'paytma manfiy.", 'У тупого произведение отрицательное.', 'For an obtuse angle the product is negative.') },
        { id: 'd', label: L('vektorlar teng ekanini', 'что векторы равны', 'that the vectors are equal'), hint: L("Tenglarda ko'paytma uzunlik kvadrati.", 'У равных произведение это квадрат длины.', 'For equal vectors the product is the square of the length.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Vektorning o'ziga ko'paytmasi nimaga teng?", 'Чему равно произведение вектора на себя?', 'What does a vector times itself equal?'),
      done: 'a·a = 36',
      items: [
        { id: 'a', label: L('uzunlik kvadratiga', 'квадрату длины', 'the square of the length'), correct: true },
        { id: 'b', label: L('uzunlikka', 'длине', 'the length'), hint: L('Kosinus bir, lekin uzunlik ikki marta kiradi.', 'Косинус единица, но длина входит дважды.', 'The cosine is one, but the length enters twice.') },
        { id: 'c', label: L('nolga', 'нулю', 'zero'), hint: L("Nol to'g'ri burchakda bo'lardi.", 'Ноль был бы при прямом угле.', 'Zero would be at a right angle.') },
        { id: 'd', label: L('ikkilangan uzunlikka', 'удвоенной длине', 'the doubled length'), hint: L('Ikkilanish boshqa amal.', 'Удвоение это другое действие.', 'Doubling is another operation.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Manfiy ko'paytma nima haqida aytadi?", 'О чём говорит отрицательное произведение?', 'What does a negative product say?'),
      done: 'b·c = −4',
      items: [
        { id: 'a', label: L("burchak o'tmas", 'угол тупой', 'the angle is obtuse'), correct: true },
        { id: 'b', label: L('yechimda xato', 'в решении ошибка', 'there is a mistake in the solution'), hint: L("Manfiy ko'paytma bo'ladi va bu odatiy.", 'Отрицательное произведение бывает и это норма.', 'A negative product does happen and it is normal.') },
        { id: 'c', label: L('uzunlik manfiy', 'длина отрицательна', 'the length is negative'), hint: L('Uzunlik har doim musbat.', 'Длина всегда положительна.', 'A length is always positive.') },
        { id: 'd', label: L('vektorlar perpendikulyar', 'векторы перпендикулярны', 'the vectors are perpendicular'), hint: L('Perpendikulyarlik roppa-rosa nol.', 'Перпендикулярность это ровно ноль.', 'Perpendicularity is exactly zero.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars uzunliklarni ko'paytirish kerakmi degan savol bilan boshlandi.", 'Урок начался с вопроса, перемножать ли длины.', 'The lesson began with the question whether to multiply the lengths.'),
    A('next', "Ularni ko'paytirish mumkin, lekin eng katta mumkin bo'lgan qiymat chiqadi, ko'paytmaning o'zi emas: haqiqiy formulada uchinchi ko'paytuvchi, burchak kosinusi bor. Uchliklar bo'yicha hisoblash oddiyroq, u yerda faqat sonlar kerak, va natija darrov chiqadi. Qolgani shundan. Uzunliklar ko'paytmani aniqlamaydi: biz faqat yo'nalishni o'zgartirdik, uzunliklar qoldi, son esa nol bo'ldi. Nolmas vektorlarda nol to'g'ri burchakni bildiradi, va bu imtihonda eng ko'p uchraydigan tekshiruv. Vektorning o'ziga ko'paytmasi uzunlik kvadratini beradi, chunki nol burchakning kosinusi birga teng. Ishora esa burchakni hisobsiz o'qiydi: noldan katta o'tkir, nol to'g'ri, noldan kichik o'tmas. Keyin tekislik tenglamasi paydo bo'ladi, va undagi koeffitsiyentlar uchligi normal bo'lib chiqadi.", 'Перемножить их можно, но выйдет наибольшее возможное значение, а не произведение: в настоящей формуле есть третий множитель, косинус угла. Считать проще по тройкам, там нужны только числа, и результат получается сразу. Отсюда всё остальное. Длины произведение не определяют: мы поменяли только направление, длины остались, а число стало нулём. Ноль при ненулевых векторах означает прямой угол, и это самая частая проверка на экзамене. Вектор на себя даёт квадрат длины, потому что косинус нулевого угла равен единице. А знак читает угол без всякого счёта: больше нуля острый, ноль прямой, меньше нуля тупой. Дальше появится уравнение плоскости, и тройка коэффициентов в нём окажется нормалью.', 'You may multiply them, but the largest possible value comes out and not the product: the real formula has a third factor, the cosine of the angle. Counting is simpler by triples, only numbers are needed there, and the result comes at once. Everything else follows. The lengths do not determine the product: we changed only the direction, the lengths stayed, and the number became zero. Zero for non zero vectors means a right angle, and that is the most frequent check at the exam. A vector times itself gives the square of the length, because the cosine of the zero angle equals one. And the sign reads the angle without any counting: greater than zero acute, zero right, less than zero obtuse. Next the equation of a plane will appear, and the triple of coefficients in it will turn out to be a normal.'),
  ],
  can: [
    L("Ko'paytmani o'qlar bo'yicha hisoblayman", 'Считаю произведение по осям', 'I compute the product along the axes'),
    L("Burchak kosinusini uchliklar bo'yicha topaman", 'Нахожу косинус угла по тройкам', 'I find the cosine of the angle from the triples'),
    L('Perpendikulyarlikni nol bilan tekshiraman', 'Проверяю перпендикулярность нулём', 'I check perpendicularity by zero'),
    L("Burchakni ko'paytma ishorasi bo'yicha o'qiyman", 'Читаю угол по знаку произведения', 'I read the angle from the sign of the product'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin tekislik tenglamasi, koeffitsiyentlar uchligi normal bo'lib chiqadi", 'Дальше уравнение плоскости — тройка коэффициентов окажется нормалью', 'Next comes the equation of a plane, where the triple of coefficients turns out to be a normal'),
  lifehack: L("Kosinusni hisoblashdan oldin ko'paytma ishorasiga qarang", 'Посмотри на знак произведения прежде, чем считать косинус', 'Look at the sign of the product before computing the cosine'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Programma, sakkizinchi blok', 'Программа, блок восемь', 'The programme, block eight'),
  hook: {
    a: '18',
    b: '16',
  },
  proved: '16',
  law: 'a·b = |a|·|b|·cos φ',
  sheet: [
    'a·b = 16',
    '|a|·|b| = 18',
    'a·c = 0',
    'a·a = 36',
    'b·c = −4',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6C -- `Space3D`, 11-sinfning fazoviy karkasiga o'ram (space.jsx).
// `dot` rejimi burchak dugasini chizadi, `value` esa sonni yozadi. Son FAQAT
// razborda ochiladi: javobni o'quvchi yozadigan ekranda asbob oxirgi satrni
// yozmasligi kerak (etalon §3).
const BOX = [5, 5, 5]
const VA = [4, 4, 2]          // uzunligi 6
const VB = [1, 2, 2]          // uzunligi 3, VA bilan ko'paytmasi 16
const VC = [2, -1, -2]        // uzunligi 3, VA bilan ko'paytmasi NOL
const O = [0, 0, 0]

const PAIR_AB = [
  { from: O, to: VA, label: 'a' },
  { from: O, to: VB, label: 'b', tone: 'graph' },
]
const PAIR_AC = [
  { from: O, to: VA, label: 'a' },
  { from: O, to: VC, label: 'c', tone: 'accent' },
]
const PAIR_BC = [
  { from: O, to: VB, label: 'b', tone: 'graph' },
  { from: O, to: VC, label: 'c', tone: 'accent' },
]

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => ({ id: PAIR_IDS[i], label: S9.match[k] }))

const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const REASONS = [
  { id: 's1', label: S10.reason.s1 },
  { id: 's2', label: S10.reason.s2 },
  { id: 's3', label: S10.reason.s3 },
  { id: 'pic', label: S10.reason.pic.label, missing: S10.reason.pic.missing },
]
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's1', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's2', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's3', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Prognoz TURG'UN chizmada: aynan shunda yon qirralar esdan chiqadi.
        fig={() => (
          <Scene
            fig={<Space3D mode="dot" box={BOX} vectors={PAIR_AB} />}
            max={230}
            h={158}
          />
        )}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          <Scene
            fig={<Space3D mode="dot" box={BOX} vectors={PAIR_AB} />}
            max={240}
            h={158}
          />
        </Col>
        <Col>
          <ProbeChain items={S2.items} cols={2} audio={audio} onSolved={solve} />
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen3 = (p) => (
  <Screen data={S3} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S3.show.length && !solved ? (
      /* Kadr 1 -- bitta yoq, kadr 2 -- ikkinchisi ham: jism yassi
         ko'pburchaklardan yig'iladi. */
      <Scene
        fig={(
          <Space3D
            mode="dot" box={BOX}
            vectors={phase === 0
              ? PAIR_AB
              : [
                { from: O, to: VA, label: 'a', coords: true },
                { from: O, to: VB, label: 'b', coords: true, tone: 'graph' },
              ]}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space3D mode="dot" box={BOX} vectors={PAIR_AB} />}
        prompt={S3.work.prompt}
        answer={num(S3.work.answer)}
        okText={S3.work.ok}
        hints={S3.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* DARSNING SHOHIDI. Ikki yoq umumiy TOMONGA ega, va o'sha tomon --
         qirra. Qirra yoritilgan, ya'ni ikki yoqning chegarasi ko'rinadi. */
      <Scene
        fig={(
          <Space3D
            mode="dot" box={BOX} vectors={PAIR_AB}
            value={phase === 0 ? 'len' : 'angle'}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space3D mode="dot" box={BOX} vectors={PAIR_AB} value="len" />}
        prompt={S4.work.prompt}
        answer={num(S4.work.answer)}
        okText={S4.work.ok}
        hints={S4.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      <Scene
        fig={(
          <Space3D
            mode="dot" box={BOX}
            vectors={phase === 0
              ? [
                { from: O, to: VA, label: 'a' },
                { from: O, to: VC, label: 'c', coords: true, tone: 'accent' },
              ]
              : PAIR_AC}
            value={phase === 0 ? 'len' : 'angle'}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space3D mode="dot" box={BOX} vectors={PAIR_AC} />}
        prompt={S5.work.prompt}
        answer={num(S5.work.answer)}
        okText={S5.work.ok}
        hints={S5.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Scene
        fig={(
          <Space3D
            mode="dot" box={BOX}
            vectors={[
              { from: O, to: VA, label: 'a', coords: true },
              { from: O, to: VA, label: 'a', tone: 'accent', dash: true },
            ]}
            value={phase === 0 ? 'none' : 'len'}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="dot" box={BOX}
            vectors={[
              { from: O, to: VA, label: 'a', coords: true },
              { from: O, to: VA, label: 'a', tone: 'accent', dash: true },
            ]}
          />
        )}
        prompt={S6.work.prompt}
        answer={num(S6.work.answer)}
        okText={S6.work.ok}
        hints={S6.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* CHEGARA. Kadr 1 -- OG'MA prizma, kadr 2 -- to'g'ri. Farq faqat yon
         qirrada, va qimirlamas chizmada u deyarli ko'rinmaydi. */
      <Scene
        fig={(
          <Space3D
            mode="dot" box={BOX}
            vectors={phase === 0 ? PAIR_BC : PAIR_AC}
            value={phase === 0 ? 'angle' : 'angle'}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space3D mode="dot" box={BOX} vectors={PAIR_BC} />}
        prompt={S7.work.prompt}
        answer={num(S7.work.answer)}
        okText={S7.work.ok}
        hints={S7.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        fig={(solved) => (
          <Scene
            fig={(
              <Space3D
                mode="dot" box={BOX} yaw={solved ? 0.9 : 0}
                vectors={PAIR_AB} value={solved ? 'angle' : 'none'}
              />
            )}
            max={330}
          />
        )}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={EQ_LEFT}
        right={EQ_RIGHT}
        okText={S9.match.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen10 = (p) => (
  <Screen data={S10} {...p}>
    {({ audio, solve }) => (
      <ProofRows
        given={S10.proof.given}
        goal={S10.proof.goal}
        rows={PROOF_ROWS}
        reasons={REASONS}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen11 = (p) => (
  <Screen data={S11} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <OrderRow
        prompt={S11.order.prompt}
        items={ORD11}
        answer={ORD11_ANS}
        okText={S11.order.ok}
        badText={S11.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big" style={{ textAlign: 'left' }}>{S11.task.prompt}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            answer={num(S11.task.answer)}
            okText={S11.task.ok}
            hints={S11.task.hint}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen12 = (p) => (
  <Screen data={S12} {...p}>
    {({ audio, stage, setStage, solve }) => (
      <Cols l={1.1} r={1}>
        <Col>
          <AuditRows
            rows={TRAP_ROWS}
            answerId={S12.answerId}
            hints={S12.hint}
            proof={S12.proof}
            hideProof
            audio={audio}
            onSolved={() => setStage(1)}
          />
        </Col>
        <Col>
          {stage === 1 ? (
            <NumberEntry
              compact
              prompt={S12.entry.prompt}
              answer={num(S12.entry.answer)}
              okText={S12.entry.ok}
              hints={S12.entry.hint}
              audio={audio}
              onSolved={solve}
            />
          ) : (
            <Slot mh={170} />
          )}
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen13 = (p) => (
  <Screen data={S13} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="mid">{S13.place.step}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S13.place.prompt}
            answer={num(S13.place.target)}
            okText={S13.place.ok}
            hints={[S13.place.wrong]}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen14 = (p) => (
  <Screen data={S14} {...p}>
    {(s) => (
      <BlitzBody
        {...s}
        data={S14}
        fig={(round) => (
          <Scene
            fig={(
              <Space3D
                mode="dot" box={BOX} yaw={round * 0.3}
                vectors={round === 1 ? PAIR_AC : PAIR_AB}
              />
            )}
            max={260}
            h={168}
          />
        )}
      />
    )}
  </Screen>
)

const Screen15 = (p) => (
  <Screen data={S15} {...p}>
    {(s) => (
      <SummaryBody
        {...s}
        data={{
          ...S15,
          hookLabels: { a: S15.hook.a, b: S15.hook.b, both: '?', none: '?' },
          sheetSteps: S15.sheet,
        }}
        answers={p.answers}
      />
    )}
  </Screen>
)

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default makeLesson({
  meta: { id: LESSON_ID, no: LESSON_NO, title: LESSON_TITLE },
  block: BLOCK,
  screens: SCREENS,
  voice: 'm',
})
