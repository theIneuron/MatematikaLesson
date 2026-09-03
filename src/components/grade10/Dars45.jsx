// ============================================================================
// 10-sinf, Dars 45. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS45_KONTENT.md
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
const LESSON_NO = 45
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Vektorlar ustida amallar`,
  `Урок ${LESSON_NO}. Действия с векторами`,
  `Lesson ${LESSON_NO}. Operations on vectors`,
)

const BLOCK = { label: 'B8', from: 43, to: 47, current: 45 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('AMALLAR', 'ДЕЙСТВИЯ', 'OPERATIONS'),
  title: L('Ayirma qayerga qaraydi', 'Куда смотрит разность', 'Where the difference points'),
  audio: [
    A('mount', 'Ikki vektor bir nuqtadan chiqarilgan. Ularning ayirmasini, a minus b ni qidiramiz.', 'Два вектора выпущены из одной точки. Ищем их разность, a минус b.', 'Two vectors are drawn from one point. We look for their difference, a minus b.'),
    A('r1', 'Birinchi yozuvda strelka b oxiridan a oxiriga.', 'В первой записи стрелка из конца b в конец a.', 'In the first reading the arrow is from the end of b to the end of a.'),
    A('r2', 'Ikkinchisida teskarisiga.', 'Во второй наоборот.', 'In the second it is the other way.'),
    A('ask', "Ikki strelka ham bir to'g'ri chiziqda yotadi, va ko'z bilan ular bir xil. Sizningcha qaysi yozuv to'g'ri?", 'Обе стрелки лежат на одной прямой, и на глаз они одинаковые. Как думаешь, какая запись верная?', 'Both arrows lie on one line, and by eye they look the same. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi ayirmani yasaymiz.', 'Твой ответ записан. Сейчас построим разность.', 'Your answer is recorded. Now we build the difference.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first'), correct: true },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('b oxiridan a oxiriga', 'из конца b в конец a', 'from the end of b to the end of a'),
      value: '(3; 4; 0)',
    },
    b: {
      name: L('a oxiridan b oxiriga', 'из конца a в конец b', 'from the end of a to the end of b'),
      value: '(−3; −4; 0)',
    },
  },
  expr: 'a (4; 4; 2),   b (1; 0; 2)',
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
      prompt: L("Uchburchak qoidasi bo'yicha vektorlar qanday qo'shiladi?", 'Как складывают векторы по правилу треугольника?', 'How are vectors added by the triangle rule?'),
      done: 'a + b',
      items: [
        { id: 'a', label: L("ikkinchisining boshi birinchisining oxiriga qo'yiladi", 'начало второго ставят в конец первого', 'the start of the second is placed at the end of the first'), correct: true },
        { id: 'b', label: L("ikkisi ham bir nuqtadan qo'yiladi", 'оба ставят из одной точки', 'both are placed from one point'), hint: L('Bir nuqtadan bu parallelogramm qoidasi.', 'Из одной точки это правило параллелограмма.', 'From one point that is the parallelogram rule.') },
        { id: 'c', label: L("uzunliklari qo'shiladi", 'складывают их длины', 'their lengths are added'), hint: L("Uzunliklar faqat bir yo'nalishdagilarda qo'shiladi.", 'Длины складываются только у сонаправленных.', 'Lengths add only for vectors of the same direction.') },
        { id: 'd', label: L('ikkitasidan kattasi olinadi', 'берут наибольший из двух', 'the larger of the two is taken'), hint: L("Yig'indi qo'shiluvchilar orasidan tanlamaydi.", 'Сумма не выбирает между слагаемыми.', 'A sum does not choose between the terms.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ikkiga ko'paytirish nima qiladi?", 'Что делает умножение на два?', 'What does multiplying by two do?'),
      done: '2a',
      items: [
        { id: 'a', label: L("ikki barobar uzaytiradi, yo'nalish o'sha", 'удлиняет вдвое, направление то же', 'doubles the length, the direction is the same'), correct: true },
        { id: 'b', label: L('vektorni buradi', 'поворачивает вектор', 'turns the vector'), hint: L("Songa ko'paytirishda burilish yo'q.", 'Поворота при умножении на число нет.', 'There is no turn when multiplying by a number.') },
        { id: 'c', label: L("faqat birinchi sonni o'zgartiradi", 'меняет только первое число', 'changes only the first number'), hint: L("Ko'paytuvchi uch sonning hammasiga o'tadi.", 'Множитель проходит по всем трём числам.', 'The factor goes through all three numbers.') },
        { id: 'd', label: L('ikki barobar uzaytiradi va teskari buradi', 'удлиняет вдвое и разворачивает', 'doubles the length and reverses it'), hint: L("Manfiy ko'paytuvchi teskari buradi.", 'Разворачивает отрицательный множитель.', 'A negative factor reverses it.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Vektor va qarama-qarshining yig'indisi nimaga teng?", 'Чему равна сумма вектора и противоположного?', 'What does a vector plus its opposite equal?'),
      done: 'a + (−a) = 0',
      items: [
        { id: 'a', label: L('nol vektorga', 'нулевому вектору', 'the zero vector'), correct: true },
        { id: 'b', label: L('ikkilangan vektorga', 'удвоенному вектору', 'the doubled vector'), hint: L("Ikkilanish o'zi bilan qo'shganda chiqadi.", 'Удвоение выйдет при сложении с самим собой.', 'Doubling comes from adding it to itself.') },
        { id: 'c', label: L("o'sha uzunlikdagi vektorga", 'вектору той же длины', 'a vector of the same length'), hint: L("Natijaning uzunligi nol, o'sha emas.", 'Длина результата ноль, а не та же.', 'The length of the result is zero, not the same.') },
        { id: 'd', label: L("hech nimaga, bunday qo'shib bo'lmaydi", 'ничему, так складывать нельзя', 'nothing, such an addition is not allowed'), hint: L("Ixtiyoriy ikki vektorni qo'shish mumkin.", 'Складывать можно любые два вектора.', 'Any two vectors may be added.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'qlar bo'yicha qo'shamiz", 'Складываем по осям', 'We add along the axes'),
  tag: 'ayirma-tartibi',
  show: [
    [
      L('a vektori va b vektori', 'вектор a и вектор b', 'the vector a and the vector b'),
      L("b boshi a oxiriga qo'yildi", 'начало b поставили в конец a', 'the start of b was placed at the end of a'),
    ],
    [
      L('a boshidan b oxirigacha strelka', 'стрелка от начала a до конца b', 'an arrow from the start of a to the end of b'),
      L("bu yig'indi, besh to'rt to'rt", 'это сумма, пять четыре четыре', 'this is the sum, five four four'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ikki vektor, va ikkinchisining boshini birinchisining oxiriga qo'ydim.", 'Два вектора, и второй я поставил началом в конец первого.', 'Two vectors, and I placed the start of the second at the end of the first.'),
    A('move', "Yopuvchi strelka birinchisining boshidan ikkinchisining oxirigacha boradi, va bu yig'indi. Koordinatalarda hammasi chizmadagidan oddiy: har o'q bo'yicha alohida qo'shish kerak. To'rt qo'shuv bir besh beradi, to'rt qo'shuv nol to'rt beradi, ikki qo'shuv ikki to'rt beradi. Yig'indi besh to'rt to'rt. O'qlar bo'yicha mustaqil qo'shish nega mumkin: har vektor siljish, va bir o'q bo'yicha ketma-ket ikki siljish shunchaki qo'shiladi, boshqa o'qlar bunga ta'sir qilmaydi. E'tibor bering, yig'indi tartibga bog'liq emas: avval b ni, keyin a ni qo'ying, va yopuvchi strelka o'sha nuqtaga keladi.", 'Замыкающая стрелка идёт от начала первого до конца второго, и это сумма. В координатах всё проще, чем на чертеже: складывать надо по каждой оси отдельно. Четыре плюс один даёт пять, четыре плюс нуль даёт четыре, два плюс два даёт четыре. Сумма пять четыре четыре. Почему по осям можно складывать независимо: каждый вектор это сдвиг, а два сдвига подряд по одной оси просто складываются, и другие оси на это не влияют. Обрати внимание, что от порядка сумма не зависит: поставь сначала b, потом a, и замыкающая стрелка придёт в ту же точку.', 'The closing arrow goes from the start of the first to the end of the second, and that is the sum. In coordinates everything is simpler than on the drawing: you add along each axis separately. Four plus one gives five, four plus zero gives four, two plus two gives four. The sum is five four four. Why the axes may be added independently: every vector is a shift, and two shifts in a row along one axis simply add up, and the other axes do not affect it. Note that the sum does not depend on the order: place b first and a second, and the closing arrow arrives at the same point.'),
    A('work', "O'zingiz hisoblang. Yig'indining ikkinchi soni qanday?", 'Посчитай сам. Какое второе число у суммы?', 'Work it out yourself. What is the second number of the sum?'),
  ],
  work: {
    prompt: L("Yig'indining ikkinchi soni?", 'Второе число суммы?', 'The second number of the sum?'),
    ok: L("To'rt. To'rt qo'shuv nol.", 'Четыре. Четыре плюс нуль.', 'Four. Four plus zero.'),
    hint: [
      L("Ikkinchi o'q bo'yicha qo'shing.", 'Складывай по второй оси.', 'Add along the second axis.'),
      L('b da u yerda nol.', 'У b там нуль.', 'b has zero there.'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    answer: '4',
  },
  expr: 'a + b = (5; 4; 4)',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Ikki qoida, bitta javob', 'Два правила, один ответ', 'Two rules, one answer'),
  tag: 'ayirma-tartibi',
  show: [
    [
      L('uchburchak qoidasi', 'правило треугольника', 'the triangle rule'),
      L("yig'indi besh to'rt to'rt", 'сумма пять четыре четыре', 'the sum is five four four'),
    ],
    [
      L('parallelogramm qoidasi', 'правило параллелограмма', 'the parallelogram rule'),
      L("yig'indi o'sha", 'сумма та же самая', 'the sum is the same'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "O'sha yig'indini ikkinchi usul bilan yig'aman: ikki vektor ham bir nuqtadan.", 'Соберу ту же сумму вторым способом: оба вектора из одной точки.', 'Let me collect the same sum in the second way: both vectors from one point.'),
    A('move', "Parallelogrammni to'ldiraman, va yig'indi uning umumiy boshdan chiqqan diagonali. Uchlik o'sha chiqdi, besh to'rt to'rt, va bu tasodif emas: parallelogramm va uchburchak bir xil chizma, faqat ikkinchi holda ikkinchi vektor ko'chirilgan. Vektorni ko'chirish esa uni o'zgartirmaydi, bu o'tgan darsning qoidasi. Demak qoidani tanlash qulaylikni tanlash, javobni tanlash emas. Vektorlar ko'p bo'lib zanjir bo'lib ketsa, uchburchak qulayroq. Ikkisi ham bir nuqtadan chiqarilgan bo'lsa, parallelogramm qulayroq, va ayirma uchun aynan u kerak bo'ladi.", 'Достраиваю параллелограмм, и сумма это его диагональ из общего начала. Тройка получилась та же, пять четыре четыре, и это не совпадение: параллелограмм и треугольник это один и тот же чертёж, только во втором случае второй вектор перенесён. А перенос вектора его не меняет, это правило прошлого урока. Значит выбор правила это выбор удобства, а не выбор ответа. Треугольник удобнее, когда векторов много и они идут цепочкой. Параллелограмм удобнее, когда оба выпущены из одной точки, и именно он понадобится для разности.', 'I complete the parallelogram, and the sum is its diagonal from the common start. The triple came out the same, five four four, and that is no coincidence: the parallelogram and the triangle are one and the same drawing, only in the second case the second vector has been shifted. And shifting a vector does not change it, that is the rule of the previous lesson. So the choice of rule is a choice of convenience, not a choice of answer. The triangle is handier when there are many vectors going in a chain. The parallelogram is handier when both are drawn from one point, and it is exactly the one needed for the difference.'),
    A('work', "O'zingiz hisoblang. Ikki qoida nechta xil javob beradi?", 'Посчитай сам. Сколько разных ответов дают два правила?', 'Work it out yourself. How many different answers do the two rules give?'),
  ],
  work: {
    prompt: L('Nechta xil javob?', 'Сколько разных ответов?', 'How many different answers?'),
    ok: L("Bitta. Qoidalar boshqa, yig'indi bitta.", 'Один. Правила разные, сумма одна.', 'One. The rules differ, the sum is one.'),
    hint: [
      L('Uchliklarni taqqoslang, chizmalarni emas.', 'Сравни тройки, а не чертежи.', 'Compare the triples, not the drawings.'),
      L("Ikkisi ham besh to'rt to'rt berdi.", 'Обе дали пять четыре четыре.', 'Both gave five four four.'),
      L('Bitta.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'a + b = b + a',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ayirma qarama-qarshi bilan yig'indi", 'Разность это сумма с противоположным', 'A difference is a sum with the opposite'),
  tag: 'ayirma-tartibi',
  show: [
    [
      L('b vektori teskari burildi', 'развернули вектор b', 'the vector b was reversed'),
      L("va a ga qo'shildi", 'и прибавили к a', 'and added to a'),
    ],
    [
      L('b oxiridan a oxiriga strelka', 'стрелка из конца b в конец a', 'an arrow from the end of b to the end of a'),
      L("ayirma uch to'rt nol", 'разность три четыре нуль', 'the difference is three four zero'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ayirma yangi amal emas. b ni teskari buraman va a bilan qo'shaman.", 'Разность не новое действие. Разворачиваю b и складываю с a.', 'A difference is not a new operation. I reverse b and add it to a.'),
    A('move', "Koordinatalarda bu har o'q bo'yicha ayirish: to'rt minus bir uch beradi, to'rt minus nol to'rt beradi, ikki minus ikki nol beradi. Ayirma uch to'rt nol. Chizmada esa u boshqacha ko'rinadi, va bu darsning eng foydali joyi. Ikki vektor ham bir nuqtadan chiqarilgan bo'lsa, a minus b ayirmasi b oxiridan a oxiriga strelka. Tekshirish oson: b oxiridan a oxiriga yuring, va siz haqiqatan b bo'ylab orqaga qaytasiz, keyin a bo'ylab yurasiz. Tartib bu yerda hammasini hal qiladi. Harflarni almashtiring, va strelka teskari buriladi, uch son esa ishorani o'zgartiradi. Uzunlik esa o'zgarmaydi, shuning uchun tartibdagi xatoni uzunlik bilan ushlab bo'lmaydi.", 'В координатах это вычитание по каждой оси: четыре минус один даёт три, четыре минус нуль даёт четыре, два минус два даёт нуль. Разность три четыре нуль. А на чертеже она видна иначе, и это самое полезное место урока. Если оба вектора выпущены из одной точки, разность a минус b это стрелка из конца b в конец a. Проверить легко: пройди от конца b в конец a, и ты действительно вернёшься по b назад, а потом пройдёшь по a. Порядок здесь решает всё. Переставь буквы, и стрелка развернётся, а все три числа сменят знак. Длина при этом не изменится, и потому по длине ошибку в порядке не поймать.', 'In coordinates that is a subtraction along each axis: four minus one gives three, four minus zero gives four, two minus two gives zero. The difference is three four zero. On the drawing it is seen differently, and that is the most useful place in the lesson. If both vectors are drawn from one point, the difference a minus b is the arrow from the end of b to the end of a. It is easy to check: walk from the end of b to the end of a, and you really do go back along b and then forward along a. The order decides everything here. Swap the letters and the arrow reverses while all three numbers change sign. The length does not change, and that is why a mistake in the order cannot be caught by the length.'),
    A('work', "O'zingiz hisoblang. a minus b ayirmasining birinchi soni qanday?", 'Посчитай сам. Какое первое число у разности a минус b?', 'Work it out yourself. What is the first number of the difference a minus b?'),
  ],
  work: {
    prompt: L('Ayirmaning birinchi soni?', 'Первое число разности?', 'The first number of the difference?'),
    ok: L("Uch. To'rt minus bir.", 'Три. Четыре минус один.', 'Three. Four minus one.'),
    hint: [
      L("Birinchi o'q bo'yicha ayiring.", 'Вычитай по первой оси.', 'Subtract along the first axis.'),
      L("a da u yerda to'rt, b da bir.", 'У a там четыре, у b один.', 'a has four there, b has one.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  expr: 'a − b = a + (−b)',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ko'paytuvchi barcha o'qlarga o'tadi", 'Множитель проходит по всем осям', 'The factor goes through all the axes'),
  tag: 'ayirma-tartibi',
  show: [
    [
      L("uzunligi olti bo'lgan a vektori", 'вектор a длиной шесть', 'the vector a of length six'),
      L("ikkiga ko'paytiramiz", 'умножаем на два', 'we multiply by two'),
    ],
    [
      L('har son ikkilandi', 'каждое число удвоилось', 'every number doubled'),
      L("uzunlik o'n ikki bo'ldi", 'длина стала двенадцать', 'the length became twelve'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "a vektorini olib, ikkiga ko'paytiramiz.", 'Возьмём вектор a и умножим его на два.', 'Take the vector a and multiply it by two.'),
    A('move', "Ko'paytuvchi uch sonning hammasiga birdan o'tadi, va bu chizmada ko'rinadi: strelka ikki barobar uzaydi, yo'nalish esa avvalgi bo'lib qoldi. Uzunlik ham ikkilandi, va uni qaytadan hisoblash kerak emas: har son ikki barobar o'ssa, har kvadrat to'rt barobar o'sadi, to'rt barobar katta sondan ildiz esa roppa-rosa ikki barobar katta. Shundan umumiy qoida: uzunlik ko'paytuvchining moduliga ko'paytiriladi. Modul so'zi bu yerda muhim, chunki manfiy ko'paytuvchida ham uzunlik o'sadi, faqat yo'nalish teskari buriladi. Va maxsus hol: nolga ko'paytirish nol vektorni beradi, unda yo'nalish umuman yo'q.", 'Множитель проходит по всем трём числам сразу, и это видно на чертеже: стрелка вытянулась вдвое, а направление осталось прежним. Длина тоже удвоилась, и её не надо считать заново: если каждое число выросло вдвое, то каждый квадрат вырос вчетверо, а корень из вчетверо большего числа ровно вдвое больше. Отсюда общее правило: длина умножается на модуль множителя. Слово модуль тут важно, потому что при отрицательном множителе длина всё равно растёт, а разворачивается только направление. И особый случай: умножение на нуль даёт нулевой вектор, у которого направления нет вовсе.', 'The factor goes through all three numbers at once, and that is visible on the drawing: the arrow stretched twice while the direction stayed the same. The length doubled too, and there is no need to compute it anew: if every number grew twice, every square grew four times, and the root of a four times larger number is exactly twice as large. Hence the general rule: the length is multiplied by the modulus of the factor. The word modulus matters here, because with a negative factor the length still grows and only the direction reverses. And a special case: multiplying by zero gives the zero vector, which has no direction at all.'),
    A('work', "O'zingiz hisoblang. Ikkilangan a vektorining uzunligi qancha?", 'Посчитай сам. Какова длина удвоенного вектора a?', 'Work it out yourself. What is the length of the doubled vector a?'),
  ],
  work: {
    prompt: L('Ikkilangan a ning uzunligi?', 'Длина удвоенного a?', 'The length of the doubled a?'),
    ok: L("O'n ikki. Olti karra ikki.", 'Двенадцать. Шесть на два.', 'Twelve. Six times two.'),
    hint: [
      L('a ning uzunligi oltiga teng.', 'Длина a равна шести.', 'The length of a equals six.'),
      L("Ko'paytuvchi uzunlikka ham o'tadi.", 'Множитель проходит и в длину.', 'The factor passes into the length as well.'),
      L("O'n ikki.", 'Двенадцать.', 'Twelve.'),
    ],
    answer: '12',
  },
  expr: '2a = (8; 8; 4)',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L("Natija qachon yo'qoladi", 'Когда результат исчезает', 'When the result disappears'),
  tag: 'ayirma-tartibi',
  show: [
    [
      L('a vektori va qarama-qarshisi', 'вектор a и противоположный', 'the vector a and its opposite'),
      L("ularni zanjir qilib qo'yamiz", 'ставим их цепочкой', 'we place them in a chain'),
    ],
    [
      L("yopuvchi strelka yo'qoldi", 'замыкающая стрелка пропала', 'the closing arrow vanished'),
      L('oxir boshiga qaytdi', 'конец вернулся в начало', 'the end returned to the start'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "a vektorini, uning ketidan qarama-qarshisini boshini oxiriga qo'yib qo'yaman.", 'Поставлю вектор a, а за ним противоположный, началом в конец.', 'Let me place the vector a and after it its opposite, start at the end.'),
    A('move', "Ikkinchi vektor bizni aynan chiqqan joyimizga qaytardi, va yopuvchi strelka qolmadi. Koordinatalarda ham xuddi shunday: har son o'zining manfiysi bilan qo'shilib nol berdi. Nol vektor chiqdi. U maxsus: uzunligi nol, yo'nalishi esa umuman yo'q, va bu yozuvdagi e'tiborsizlik emas, xossa. Shuning uchun nol vektorni strelka bilan chizib bo'lmaydi va u qayerga qaraydi deb so'rab bo'lmaydi. Buning o'rniga u arifmetikadagi nol kabi tutadi: uni ixtiyoriy vektorga qo'shing, va u o'zgarmaydi. Va yana: masalada nol vektor chiqsa, bu ko'pincha javobning o'zi, xatoning alomati emas.", 'Второй вектор вернул нас точно туда, откуда мы вышли, и замыкающей стрелки не осталось. В координатах то же самое: каждое число сложилось со своим отрицательным и дало нуль. Получился нулевой вектор. Он особый: длина у него нуль, а направления нет совсем, и это не небрежность записи, а свойство. Поэтому нулевой вектор нельзя нарисовать стрелкой и нельзя спросить, куда он смотрит. Зато он ведёт себя как нуль в арифметике: прибавь его к любому вектору, и тот не изменится. И ещё: если в задаче вышел нулевой вектор, это часто и есть ответ, а не признак ошибки.', 'The second vector brought us exactly back to where we started, and no closing arrow was left. In coordinates the same thing: every number added to its negative and gave zero. The zero vector appeared. It is special: its length is zero and it has no direction at all, and that is not sloppy notation but a property. That is why the zero vector cannot be drawn as an arrow and cannot be asked where it points. On the other hand it behaves like zero in arithmetic: add it to any vector and that vector does not change. And one more thing: if a problem yields the zero vector, that is often the answer itself and not a sign of a mistake.'),
    A('work', "O'zingiz hisoblang. Bu yig'indining uzunligi qancha?", 'Посчитай сам. Какова длина этой суммы?', 'Work it out yourself. What is the length of this sum?'),
  ],
  work: {
    prompt: L("Yig'indining uzunligi?", 'Длина суммы?', 'The length of the sum?'),
    ok: L('Nol. Bu nol vektor.', 'Ноль. Это нулевой вектор.', 'Zero. It is the zero vector.'),
    hint: [
      L("Har sonni o'zining manfiysi bilan qo'shing.", 'Сложи каждое число со своим отрицательным.', 'Add every number to its negative.'),
      L('Uchtasi ham nol berdi.', 'Все три дали нуль.', 'All three gave zero.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  expr: 'a + (−a) = 0',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Uch amal', 'Три действия', 'Three operations'),
  tag: 'ayirma-tartibi',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Birinchi satr deyarli barcha qiyinchilikni oladi: amallar o'qlar bo'yicha boradi, va hisob uchun hech qanday geometriya kerak emas. Ikkinchi satr chizma allaqachon berilgan va ayirmani undan o'qish kerak bo'lgan joyda kerak, va bu aynan tartib yo'qoladigan joy. Uchinchi satr ko'paytuvchi haqida, va unda modul so'zi muhim: uzunlik ishoraga bog'liq emas. Eng foydali odat esa bunday. Ayirmani hisoblashdan oldin qaysi oxirdan qaysi oxirga borayotganingizni ovoz chiqarib ayting. Aytolmasangiz, demak tartib hali tanlanmagan, va hisoblash erta.", 'Первая строка снимает почти все трудности: действия идут по осям, и никакой геометрии для счёта не нужно. Вторая строка нужна там, где чертёж уже дан и надо прочитать по нему разность, и это ровно то место, где теряют порядок. Третья строка про множитель, и в ней важно слово модуль: длина от знака не зависит. А самая полезная привычка такая. Прежде чем считать разность, назови вслух, из какого конца в какой ты идёшь. Если сказать не получается, значит порядок ещё не выбран, и считать рано.', 'The first line removes almost all the difficulty: the operations go along the axes, and no geometry is needed for the counting. The second line is needed where the drawing is already given and the difference has to be read off it, and that is exactly where the order gets lost. The third line is about the factor, and the word modulus matters in it: the length does not depend on the sign. And the most useful habit is this. Before computing a difference, say aloud which end you are going from and to. If you cannot say it, the order has not been chosen yet and it is too early to compute.'),
  ],
  probe: {
    question: L('a minus b ayirmasi qayerga boradi?', 'Куда идёт разность a минус b?', 'Where does the difference a minus b go?'),
    items: [
      { id: 'a', label: L('b oxiridan a oxiriga', 'из конца b в конец a', 'from the end of b to the end of a'), correct: true },
      { id: 'b', label: L('a oxiridan b oxiriga', 'из конца a в конец b', 'from the end of a to the end of b'), hint: L('Bunda b minus a chiqadi, unda barcha ishoralar teskari.', 'Так выйдет b минус a, у неё все знаки обратные.', 'That gives b minus a, whose signs are all reversed.') },
    ],
  },
  rule: {
    lawLabel: L("O'qlar bo'yicha amallar", 'Действия по осям', 'Operations along the axes'),
    lines: [
      L("yig'indi va ayirma har o'q bo'yicha alohida hisoblanadi", 'сумма и разность считаются по каждой оси отдельно', 'the sum and the difference are computed along each axis separately'),
      L('a minus b ayirmasi b oxiridan a oxiriga boradi', 'разность a минус b идёт из конца b в конец a', 'the difference a minus b goes from the end of b to the end of a'),
      L("ko'paytuvchi barcha sonlarga o'tadi, uzunlik uning modulini oladi", 'множитель проходит по всем числам, длина берёт его модуль', 'the factor goes through all the numbers, the length takes its modulus'),
    ],
    law: 'a − b = a + (−b)',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Amal va natija', 'Действие и результат', 'The operation and the result'),
  tag: 'ayirma-tartibi',
  audio: [
    A('mount', "To'rt uchlik va to'rt amal. O'qlar bo'yicha hisoblang.", 'Четыре тройки и четыре действия. Считай по осям.', 'Four triples and four operations. Count along the axes.'),
  ],
  match: {
    prompt: L('Uchlikni amal bilan birlashtiring', 'Соедини тройку с действием', 'Match the triple with the operation'),
    ok: L("To'rttasi ham joyida. Har amal o'qlar bo'yicha boradi.", 'Все четыре на месте. Каждое действие идёт по осям.', 'All four in place. Every operation goes along the axes.'),
    a: L("a va b yig'indisi", 'сумма a и b', 'the sum of a and b'),
    b: L('a minus b ayirmasi', 'разность a минус b', 'the difference a minus b'),
    c: L('ikkilangan a', 'удвоенный a', 'the doubled a'),
    d: L('qarama-qarshi b', 'противоположный b', 'the opposite of b'),
    left: ['(5; 4; 4)', '(3; 4; 0)', '(8; 8; 4)', '(−1; 0; −2)'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Uchburchak qoidasini isbotlang', 'Докажи правило треугольника', 'Prove the triangle rule'),
  tag: 'ayirma-tartibi',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L("uch nuqta, zanjir bo'lgan ikki vektor", 'три точки, два вектора цепочкой', 'three points, two vectors in a chain'),
    goal: L("yig'indi birinchi nuqtadan uchinchisiga vektor beradi", 'сумма даёт вектор из первой точки в третью', 'the sum gives the vector from the first point to the third'),
    r1: L('birinchi vektor ikkinchi nuqta minus birinchisi', 'первый вектор это вторая точка минус первая', 'the first vector is the second point minus the first'),
    r2: L('ikkinchi vektor uchinchi nuqta minus ikkinchisi', 'второй вектор это третья точка минус вторая', 'the second vector is the third point minus the second'),
    r3: L("yig'indida ikkinchi nuqta qisqardi", 'в сумме вторая точка сократилась', 'in the sum the second point cancelled'),
    ok: L("Isbotlandi. Uchburchak qoidasi o'rtadagi nuqtaning qisqarishi.", 'Доказано. Правило треугольника это сокращение средней точки.', 'Proved. The triangle rule is the cancelling of the middle point.'),
    e1: L('Ikkinchi vektor haqida keyin. Avval birinchisi.', 'Про второй вектор дальше. Сначала первый.', 'The second vector comes later. First the first one.'),
    e2: L('Birinchisi yozildi. Endi ikkinchisi.', 'Первый записан. Теперь второй.', 'The first is written. Now the second.'),
    e3: L("Ikkisi ham yozildi. Qo'shganda nima bo'ladi.", 'Оба записаны. Что происходит при сложении.', 'Both are written. What happens when they are added.'),
  },
  reason: {
    s1: L('vektorning uchligi oxir minus boshi', 'тройка вектора это конец минус начало', 'the triple of a vector is the end minus the start'),
    s2: L("ikkinchi juft uchun o'sha qoida", 'то же правило для второй пары', 'the same rule for the second pair'),
    s3: L("qo'shish har o'q bo'yicha boradi", 'сложение идёт по каждой оси', 'the addition goes along each axis'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'AB + BC = AC',
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
    ok: L("Besh. Uch va to'rt besh beradi.", 'Пять. Три и четыре дают пять.', 'Five. Three and four give five.'),
    hint: [
      L('Avval ayirmaning uchligini toping.', 'Сначала найди тройку разности.', 'First find the triple of the difference.'),
      L("Uch to'rt nol.", 'Три четыре нуль.', 'Three four zero.'),
      L("To'qqiz qo'shuv o'n olti.", 'Девять плюс шестнадцать.', 'Nine plus sixteen.'),
    ],
    prompt: 'a (4; 4; 2),   b (1; 0; 2),   |a − b| = ?',
    answer: '5',
  },
  order: {
    prompt: L('Qadamlarni hisoblash tartibida joylashtiring', 'Расставь шаги в том порядке, в каком считают', 'Arrange the steps in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Teskari burish, qo'shish, kvadratlar, ildiz.", 'Порядок верный. Развернуть, сложить, квадраты, корень.', 'The order is right. Reverse, add, squares, root.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['|a − b|', '−b', 'x² + y² + z²', 'a + (−b)'],
    answer: '−b  a + (−b)  x² + y² + z²  |a − b|',
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
    A('mount', "To'rt qator, va ulardan biri ayirish tartibini o'zgartiradi.", 'Четыре строки, и одна из них меняет порядок вычитания.', 'Four lines, and one of them changes the order of subtraction.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Qoida to'g'ri yozilgan.", 'Правило записано верно.', 'The rule is written correctly.'),
    r4: L('Qator yuqoridagi xato qatordan olingan.', 'Строка получена из неверной строки выше.', 'The line comes from the wrong line above.'),
  },
  proof: L("Sahnani buring: strelka b oxiridan a oxiriga boradi, va burilish buni o'zgartirmaydi.", 'Поверни сцену: стрелка идёт из конца b в конец a, и поворот этого не меняет.', 'Rotate the scene: the arrow goes from the end of b to the end of a, and rotation does not change it.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L('Uchinchi. Teskari tartibda ayirilgan.', 'Третья. Вычли в обратном порядке.', 'The third. The subtraction was done in the reverse order.'),
    hint: [
      L('Qaysi vektordan ayirilganini tekshiring.', 'Проверь, из какого вектора вычитали.', 'Check which vector was subtracted from.'),
      L('Yozuvdagi birinchi harf ayiriladigan narsa.', 'Первая буква в записи это то, из чего вычитают.', 'The first letter in the notation is what you subtract from.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'a (4; 4; 2),   b (1; 0; 2)',
    r2: 'a − b = a + (−b)',
    r3: 'a − b = (−3; −4; 0)',
    r4: 'b − a = (3; 4; 0)',
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
    A('mount', "Darsni o'ngdan chapga o'qiymiz. Yig'indi berilgan, qo'shiluvchini topish kerak.", 'Прочитаем урок справа налево. Дана сумма, найти надо слагаемое.', 'Let us read the lesson from right to left. The sum is given, a term is to be found.'),
    A('work', "To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны. Их больше одной.', 'Mark all the readings that are correct. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Bu vektorlar uchun nima to'g'ri", 'Что верно для этих векторов', 'What is true for these vectors'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi tartib va ko'paytuvchini aralashtiradi.", 'Три записи из пяти. Две оставшиеся путают порядок и множитель.', 'Three readings out of five. The other two confuse the order and the factor.'),
    items: [
      { id: 'd', label: 'a − b = (−3; −4; 0)', hint: L('Bu teskari tartibdagi ayirma.', 'Это разность в обратном порядке.', 'That is the difference in the reverse order.') },
      { id: 'e', label: '2a = (8; 4; 2)', hint: L("Ko'paytuvchi uch sonning hammasiga o'tadi.", 'Множитель проходит по всем трём числам.', 'The factor goes through all three numbers.') },
      { id: 'a', label: 'b = (1; 0; 2)', ok: true },
      { id: 'b', label: 'a − b = (3; 4; 0)', ok: true },
      { id: 'c', label: '2a = (8; 8; 4)', ok: true },
    ],
  },
  place: {
    prompt: L("a vektori va a qo'shuv b yig'indisi ma'lum. b vektorining uchinchi soni qanday?", 'Известны вектор a и сумма a плюс b. Каково третье число вектора b?', 'The vector a and the sum a plus b are known. What is the third number of the vector b?'),
    ok: L("Ikki. To'rt minus ikki.", 'Два. Четыре минус два.', 'Two. Four minus two.'),
    wrong: L("Yig'indidan ma'lum qo'shiluvchi ayiriladi, teskarisi emas.", 'Из суммы вычитают известное слагаемое, а не наоборот.', 'The known term is subtracted from the sum, not the other way.'),
    target: '2',
    step: '4 − 2',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'ayirma-tartibi',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Yig'indi koordinatalar bo'yicha qanday hisoblanadi?", 'Как считают сумму по координатам?', 'How is a sum computed in coordinates?'),
      done: 'a + b = (5; 4; 4)',
      items: [
        { id: 'a', label: L("har o'q bo'yicha alohida", 'по каждой оси отдельно', 'along each axis separately'), correct: true },
        { id: 'b', label: L("uzunliklar qo'shiladi", 'складывают длины', 'the lengths are added'), hint: L("Uzunliklar faqat bir yo'nalishdagilarda qo'shiladi.", 'Длины складываются только у сонаправленных.', 'Lengths add only for vectors of the same direction.') },
        { id: 'c', label: L('eng katta sonlar olinadi', 'берут наибольшие числа', 'the largest numbers are taken'), hint: L("Yig'indi sonlar orasidan tanlamaydi.", 'Сумма не выбирает между числами.', 'A sum does not choose between numbers.') },
        { id: 'd', label: L("o'qlar bo'yicha ko'paytiriladi", 'умножают по осям', 'they are multiplied along the axes'), hint: L("Ko'paytirish boshqa amal.", 'Умножение это другое действие.', 'Multiplication is another operation.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('a minus b ayirmasi qayerga boradi?', 'Куда идёт разность a минус b?', 'Where does the difference a minus b go?'),
      done: 'a − b = (3; 4; 0)',
      items: [
        { id: 'a', label: L('b oxiridan a oxiriga', 'из конца b в конец a', 'from the end of b to the end of a'), correct: true },
        { id: 'b', label: L('a oxiridan b oxiriga', 'из конца a в конец b', 'from the end of a to the end of b'), hint: L('Bunda b minus a chiqadi.', 'Так выйдет b минус a.', 'That gives b minus a.') },
        { id: 'c', label: L('umumiy boshdan', 'из общего начала', 'from the common start'), hint: L("Umumiy boshdan yig'indi boradi.", 'Из общего начала идёт сумма.', 'The sum goes from the common start.') },
        { id: 'd', label: L("parallelogramm diagonali bo'ylab", 'по диагонали параллелограмма', 'along the diagonal of the parallelogram'), hint: L("Bu diagonal yig'indining o'zi.", 'Эта диагональ и есть сумма.', 'That diagonal is the sum itself.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Minus birga ko'paytirish nima beradi?", 'Что даёт умножение на минус один?', 'What does multiplying by minus one give?'),
      done: '−a',
      items: [
        { id: 'a', label: L("uzunligi o'sha, yo'nalishi teskari", 'тот же по длине, обратный по направлению', 'the same in length, reverse in direction'), correct: true },
        { id: 'b', label: L('nol vektor', 'нулевой вектор', 'the zero vector'), hint: L("Nolni nolga ko'paytirish beradi.", 'Нулевой даёт умножение на нуль.', 'The zero vector comes from multiplying by zero.') },
        { id: 'c', label: L('ikki barobar qisqa', 'вдвое короче', 'twice as short'), hint: L("Ko'paytuvchining moduli birga teng.", 'Модуль множителя равен единице.', 'The modulus of the factor equals one.') },
        { id: 'd', label: L("o'sha vektor", 'тот же вектор', 'the same vector'), hint: L("Yo'nalish teskari bo'ldi.", 'Направление стало обратным.', 'The direction became reverse.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Vektor va qarama-qarshining yig'indisi nimaga teng?", 'Чему равна сумма вектора и противоположного?', 'What does a vector plus its opposite equal?'),
      done: 'a + (−a) = 0',
      items: [
        { id: 'a', label: L('nol vektorga', 'нулевому вектору', 'the zero vector'), correct: true },
        { id: 'b', label: L('ikkilangan vektorga', 'удвоенному вектору', 'the doubled vector'), hint: L("Ikkilanish o'zi bilan qo'shganda chiqadi.", 'Удвоение выйдет при сложении с самим собой.', 'Doubling comes from adding it to itself.') },
        { id: 'c', label: L("o'sha uzunlikdagi vektorga", 'вектору той же длины', 'a vector of the same length'), hint: L('Natijaning uzunligi nol.', 'Длина результата ноль.', 'The length of the result is zero.') },
        { id: 'd', label: L('qarama-qarshiga', 'противоположному', 'the opposite one'), hint: L("Qarama-qarshi qo'shiluvchilardan biri.", 'Противоположный это одно из слагаемых.', 'The opposite is one of the terms.') },
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
    A('mount', 'Dars ayirma qayerga qarashi haqidagi savol bilan boshlandi.', 'Урок начался с вопроса, куда смотрит разность.', 'The lesson began with the question where the difference points.'),
    A('next', "U ikkinchi vektorning oxiridan birinchisining oxiriga boradi, va buni chalkashtirish oson, chunki ikki strelka ham bir to'g'ri chiziqda yotadi va uzunligi bitta. Xatoni faqat yo'nalish yoki ishoralar bo'yicha ushlash mumkin, shuning uchun tartibni hisobdan oldin tanlash kerak, keyin emas. Amallarning o'zi esa oddiy: yig'indi ham, ayirma ham har o'q bo'yicha alohida hisoblanadi, ko'paytuvchi esa uch sonning hammasiga o'tadi, va uzunlik uning modulini oladi. Uchburchak qoidasi va parallelogramm qoidasi bitta javob beradi, chunki bu ko'chirilgan vektorli bitta chizma. Nol vektor esa masalalarda oddiy javob: uzunligi nol, yo'nalishi yo'q. Keyin ikki vektor vektor emas, son bera boshlaydi.", 'Она идёт из конца второго вектора в конец первого, и перепутать это легко, потому что обе стрелки лежат на одной прямой и длина у них одна. Поймать ошибку можно только по направлению или по знакам, и потому порядок надо выбирать до счёта, а не после. Сами действия при этом просты: и сумма, и разность считаются по каждой оси отдельно, а множитель проходит по всем трём числам, и длина берёт его модуль. Правило треугольника и правило параллелограмма дают один ответ, потому что это один чертёж с перенесённым вектором. А нулевой вектор в задачах это нормальный ответ: длина нуль, направления нет. Дальше два вектора начнут давать не вектор, а число.', 'It goes from the end of the second vector to the end of the first, and it is easy to mix up, because both arrows lie on one line and their length is the same. The mistake can be caught only by the direction or by the signs, and that is why the order must be chosen before the counting, not after. The operations themselves are simple: both the sum and the difference are computed along each axis separately, and the factor goes through all three numbers while the length takes its modulus. The triangle rule and the parallelogram rule give one answer, because it is one drawing with a shifted vector. And the zero vector in problems is a normal answer: length zero, no direction. Next two vectors will start giving not a vector but a number.'),
  ],
  can: [
    L("O'qlar bo'yicha qo'shaman va ayiraman", 'Складываю и вычитаю по осям', 'I add and subtract along the axes'),
    L("Ayirmani chizmadan kerakli tartibda o'qiyman", 'Читаю разность с чертежа в нужном порядке', 'I read a difference off a drawing in the right order'),
    L("Vektorni songa ko'paytiraman", 'Умножаю вектор на число', 'I multiply a vector by a number'),
    L('Nol vektor javob, xato emasligini bilaman', 'Знаю, что нулевой вектор это ответ, а не ошибка', 'I know the zero vector is an answer, not a mistake'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin skalyar ko'paytma, ikki vektor vektor emas, son beradi", 'Дальше скалярное произведение — два вектора дадут не вектор, а число', 'Next comes the dot product, where two vectors give not a vector but a number'),
  lifehack: L('Ayirmani hisoblashdan oldin qaysi oxirdan qaysi oxirga borayotganingizni ovoz chiqarib ayting', 'Прежде чем считать разность, скажи вслух, из какого конца в какой идёшь', 'Before computing a difference, say aloud which end you go from and to'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Programma, sakkizinchi blok', 'Программа, блок восемь', 'The programme, block eight'),
  hook: {
    a: '(3; 4; 0)',
    b: '(−3; −4; 0)',
  },
  proved: '(3; 4; 0)',
  law: 'a − b = a + (−b)',
  sheet: [
    'a + b = (5; 4; 4)',
    'a − b = (3; 4; 0)',
    '2a = (8; 8; 4)',
    '|2a| = 2|a|',
    'a + (−a) = 0',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6C -- `Space3D`, 11-sinfning fazoviy karkasiga o'ram (space.jsx).
const BOX = [5, 5, 5]
const VA = [4, 4, 2]          // uzunligi 6
const VB = [1, 0, 2]
const VB_BACK = [-1, 0, -2]
const VSUM = [5, 4, 4]
const VDIFF = [3, 4, 0]       // uzunligi 5
const VA_BACK = [-4, -4, -2]
const O = [0, 0, 0]

// AYIRMA CHIZMADA: ikki vektor UMUMIY boshdan chiqarilgan, va ayirma b ning
// oxiridan a ning oxiriga boradi. Shuning uchun u `vec` rejimida uchinchi
// strelka bo'lib beriladi, `sum` rejimida emas: `sum` yopuvchi strelkani
// boshqa joydan chizadi.
const PAIR = [
  { from: O, to: VA, label: 'a', coords: true },
  { from: O, to: VB, label: 'b', coords: true, tone: 'graph' },
]
const DIFF_ARROW = { from: VB, to: VA, label: 'c', coords: true, tone: 'accent' }
const DIFF_WRONG = { from: VA, to: VB, label: 'c', coords: true, tone: 'tip', dash: true }

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
            fig={(
              <Space3D
                mode="vec" box={BOX}
                vectors={PAIR.concat([DIFF_ARROW, DIFF_WRONG])}
              />
            )}
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
            fig={<Space3D mode="vec" box={BOX} vectors={PAIR} />}
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
          phase === 0 ? (
            <Space3D mode="vec" box={BOX} vectors={PAIR} />
          ) : (
            <Space3D mode="sum" box={BOX} sum={{ a: VA, b: VB, rule: 'triangle' }} />
          )
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space3D mode="sum" box={BOX} sum={{ a: VA, b: VB, rule: 'triangle' }} />}
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
            mode="sum" box={BOX}
            sum={{ a: VA, b: VB, rule: phase === 0 ? 'triangle' : 'parallelogram' }}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={(
          <Space3D mode="sum" box={BOX} sum={{ a: VA, b: VB, rule: 'parallelogram' }} />
        )}
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
            mode="vec" box={BOX}
            vectors={phase === 0
              ? [
                { from: O, to: VA, label: 'a', coords: true },
                { from: O, to: VB_BACK, label: 'b', coords: true, tone: 'graph', dash: true },
              ]
              : PAIR.concat([DIFF_ARROW])}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space3D mode="vec" box={BOX} vectors={PAIR.concat([DIFF_ARROW])} />}
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
            mode="vec" box={[9, 9, 9]}
            vectors={[{ from: O, to: VA, label: 'a', coords: true }]}
            lambda={phase === 0 ? 1 : 2}
            value="len"
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="vec" box={[9, 9, 9]}
            vectors={[{ from: O, to: VA, label: 'a', coords: true }]}
            lambda={2} value="len"
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
          phase === 0 ? (
            <Space3D
              mode="vec" box={BOX}
              vectors={[
                { from: O, to: VA, label: 'a', coords: true },
                { from: VA, to: O, label: 'b', coords: true, tone: 'accent', dash: true },
              ]}
            />
          ) : (
            <Space3D
              mode="sum" box={BOX}
              sum={{ a: VA, b: VA_BACK, rule: 'triangle' }}
            />
          )
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={(
          <Space3D mode="sum" box={BOX} sum={{ a: VA, b: VA_BACK, rule: 'triangle' }} />
        )}
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
                mode="vec" box={BOX} yaw={solved ? 0.9 : 0}
                vectors={PAIR.concat([DIFF_ARROW])}
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
                mode="vec" box={BOX} yaw={round * 0.3}
                vectors={round === 1 ? PAIR.concat([DIFF_ARROW]) : PAIR}
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
