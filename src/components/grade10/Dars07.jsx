// ============================================================================
// 10-sinf, Dars 7. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS07_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) mashina bilan
// yig'ilgan. Ekran tanalari qo'lda yozilgan: asbob va figurani tanlash --
// matematik qaror, va u avtomatlashtirilmaydi (etalon §5.3).
//
// Matn o'zgarsa: kontentni to'g'rilash va qayta yig'ish (kalitsiz), tanalar
// joyida qoladi. Keyin `grade10-lesson-audit.mjs`, tez yarus, to'liq prognon.
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
  Scene,
} from './tools.jsx'
// Координатная плоскость -- прибор 4 в упрощённом виде (`PODXOD_10SINF.md` §7).
// Единственный урок класса, где окружности нет вовсе.
import { Plane } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 7
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Funksiyalar`,
  `Урок ${LESSON_NO}. Функции`,
  `Lesson ${LESSON_NO}. Functions`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 7 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('FUNKSIYA', 'ФУНКЦИЯ', 'THE FUNCTION'),
  title: L('Har qanday egri chiziq funksiya grafigimi?', 'Всякая ли кривая — график функции?', 'Is every curve the graph of a function?'),
  motion: ['mount'],
  audio: [
    A('mount', "Nuqta egri chiziq bo'ylab yuradi, undan ikkita iz tushadi: biri gorizontal o'qqa, ikkinchisi vertikalga.", 'Точка идёт по кривой, и от неё падают два следа: один на горизонтальную ось, другой на вертикальную.', 'The point walks along the curve, dropping two traces: one on the horizontal axis, one on the vertical.'),
    A('r1', 'Birinchi yozuv grafik bu chizilgan har qanday egri chiziq deydi.', 'Первая запись говорит, что график это любая нарисованная кривая.', 'The first reading says a graph is any drawn curve.'),
    A('r2', "Ikkinchisi bitta kirishga aynan bitta chiqish bo'lishi kerak deydi.", 'Вторая говорит, что у одного входа должен быть ровно один выход.', 'The second says one input must have exactly one output.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi to'g'ri chiziq bilan tekshiramiz.", 'Твой ответ записан. Сейчас проверим прямой.', 'Your answer is saved. Now a line will check it.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('grafik bu har qanday egri chiziq', 'график это любая кривая', 'a graph is any curve'),
      value: 'x   →   y,  y',
    },
    b: {
      name: L('bitta kirishga bitta chiqish', 'у одного входа один выход', 'one input, one output'),
      value: 'x   →   y',
    },
  },
  expr: 'x   →   y',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("Ta'rifdan oldin uch savol", 'Три вопроса перед определением', 'Three questions before the definition'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Koordinatalar juftligining birinchi soni nimani ko'rsatadi?", 'Что показывает первое число пары координат?', 'What does the first number of a coordinate pair show?'),
      done: '(x; y)',
      items: [
        { id: 'a', label: L("gorizontal bo'yicha siljish", 'сдвиг по горизонтали', 'the shift along the horizontal'), correct: true },
        { id: 'b', label: L('balandlikni', 'высоту', 'the height'), hint: L('Balandlik juftlikning ikkinchi soni.', 'Высота это второе число пары.', 'The height is the second number of the pair.') },
        { id: 'c', label: L("boshgacha bo'lgan masofa", 'расстояние до начала', 'the distance to the origin'), hint: L('Masofa ikkala sondan birga hisoblanadi, birinchisidan emas.', 'Расстояние считается из обоих чисел сразу, а не из первого.', 'The distance is computed from both numbers, not from the first.') },
        { id: 'd', label: L('nuqtaning raqami', 'номер точки', 'the number of the point'), hint: L('Koordinata bu joylashuv, raqam emas.', 'Координата это положение, а не номер.', 'A coordinate is a position, not a number in a list.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Sinus qanday qiymatlarni oladi?', 'Какие значения принимает синус?', 'Which values does the sine take?'),
      done: 'E(y) = [−1; 1]',
      items: [
        { id: 'a', label: L('minus birdan birgacha', 'от минус единицы до единицы', 'from minus one to one'), correct: true },
        { id: 'b', label: L('har qanday', 'любые', 'any values'), hint: L("To'lqin polosadan chiqmaydi, bu o'tgan darsda edi.", 'Волна не выходит из полосы, это был прошлый урок.', 'The wave stays inside the band, that was the previous lesson.') },
        { id: 'c', label: L('faqat musbat', 'только положительные', 'only positive ones'), hint: L("O'qdan pastda qiymatlar manfiy.", 'Ниже оси значения отрицательны.', 'Below the axis the values are negative.') },
        { id: 'd', label: L('noldan birgacha', 'от нуля до единицы', 'from zero to one'), hint: L("To'lqinning pastki yarmi nol ostiga ketadi.", 'Нижняя половина волны уходит под ноль.', 'The lower half of the wave goes below zero.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Sinus qaysi `x` larda aniqlangan?', 'При каких `x` определён синус?', 'For which `x` is the sine defined?'),
      done: 'D(y) = (−∞; +∞)',
      items: [
        { id: 'a', label: L('har qandayida', 'при любых', 'for all of them'), correct: true },
        { id: 'b', label: L('faqat musbatlarida', 'только при положительных', 'only for positive ones'), hint: L('Manfiy burish ham nuqta beradi, bu beshinchi darsda edi.', 'Отрицательный поворот тоже даёт точку, это был пятый урок.', 'A negative turn also gives a point, that was lesson five.') },
        { id: 'c', label: L('faqat noldan uch yuz oltmishgacha', 'только от нуля до трёхсот шестидесяти', 'only from zero to three hundred sixty'), hint: L("To'liq aylanadan keyin sanoq davom etadi, nuqta yuraveradi.", 'За полным оборотом счёт продолжается, точка идёт дальше.', 'Past a full turn the count continues, the point goes on.') },
        { id: 'd', label: L('faqat butun sonlarda', 'только при целых', 'only for whole numbers'), hint: L("Burchak kasr ham bo'ladi, nuqta bo'linmalar orasiga turadi.", 'Угол бывает и дробным, точка встанет между делениями.', 'An angle can be fractional, the point stands between the marks.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Funksiya bu qoida', 'Функция это правило', 'A function is a rule'),
  tag: 'dva-y-na-odin-x',
  show: [
    [
      L("kirish gorizontal bo'yicha", 'вход по горизонтали', 'the input along the horizontal'),
      L("chiqish vertikal bo'yicha", 'выход по вертикали', 'the output along the vertical'),
    ],
    [
      L('nuqta yuradi, izlar tushadi', 'точка идёт, следы падают', 'the point goes, the traces fall'),
      L('har kirishga bitta chiqish', 'у каждого входа один выход', 'each input has one output'),
    ],
  ],
  motion: ['walk'],
  audio: [
    A('mount', "Gorizontal o'qda kirish, vertikalda chiqish.", 'На горизонтальной оси вход, на вертикальной выход.', 'The horizontal axis carries the input, the vertical one the output.'),
    A('walk', "Nuqta egri chiziq bo'ylab yuradi, undan ikkita iz tushadi. Chapdagisi kirish, pastdagisi chiqish. Har kirishga aynan bitta chiqish mos keladi, qoida shundan iborat.", 'Точка идёт по кривой, и от неё падают два следа. Левый след это вход, нижний это выход. Каждому входу отвечает ровно один выход, и в этом всё правило.', 'The point walks along the curve, dropping two traces. One is the input, the other the output. Each input matches exactly one output, and that is the whole rule.'),
    A('work', "O'zingiz hisoblang. Bitta kirishda nechta chiqish bor?", 'Посчитай сам. Сколько выходов у одного входа?', 'Compute it yourself. How many outputs does one input have?'),
  ],
  work: {
    prompt: L('Bitta kirish nechta chiqish beradi?', 'Сколько выходов даёт один вход?', 'How many outputs does one input give?'),
    ok: L("Bitta. Ikkita bo'lganda qoida qaysi birini olishni aytmagan bo'lardi.", 'Один. Если бы их было два, правило не говорило бы, какой из них брать.', 'One. If there were two, the rule would not say which one to take.'),
    hint: [
      L("Vertikal o'qqa nechta iz tushishiga qarang.", 'Посмотри, сколько следов падает на вертикальную ось.', 'Look how many traces fall on the vertical axis.'),
      L('Iz bitta, va u nuqtaning har holati uchun bitta.', 'След один, и он один для каждого положения точки.', 'There is one trace, and one for every position of the point.'),
      L('Bitta.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'g'ri chiziq egri chiziqni tekshiradi", 'Прямая проверяет кривую', 'A line checks the curve'),
  tag: 'dva-y-na-odin-x',
  show: [
    [
      L("vertikal to'g'ri chiziq suriladi", 'вертикальная прямая едет', 'a vertical line moves across'),
      L('grafikda bitta uchrashuv', 'у графика одна встреча', 'the graph meets it once'),
    ],
    [
      L('aylanada ikkita', 'у окружности их две', 'the circle meets it twice'),
      L('demak bu funksiya emas', 'значит это не функция', 'so this is not a function'),
    ],
  ],
  motion: ['test'],
  audio: [
    A('mount', 'Aylanani olaylik. U chizilgan, lekin qoidami.', 'Возьмём окружность. Она нарисована, но правило ли это.', 'Take a circle. It is drawn, but is it a rule.'),
    A('test', "Vertikal to'g'ri chiziq o'tkazamiz. Funksiya grafigida u egri chiziqni bir marta uchratadi, bu yerda esa birdan ikkita: bitta kirishga ikkita chiqish mos keladi. Qoida qaysi birini olishni aytmaydi, demak qoida yo'q.", 'Ведём вертикальную прямую. У графика функции она встречает кривую один раз, а здесь сразу два: одному входу отвечают два выхода. Правило не говорит, какой брать, значит правила нет.', 'We draw a vertical line. On the graph of a function it meets the curve once, here it meets it twice at once: one input matches two outputs. The rule does not say which to take, so there is no rule.'),
    A('work', "O'zingiz hisoblang. To'g'ri chiziq aylanani necha marta uchratdi?", 'Посчитай сам. Сколько раз прямая встретила окружность?', 'Compute it yourself. How many times did the line meet the circle?'),
  ],
  work: {
    prompt: L("Vertikal to'g'ri chiziq aylanani necha marta uchratdi?", 'Сколько раз вертикальная прямая встретила окружность?', 'How many times did the vertical line meet the circle?'),
    ok: L('Ikkita. Bitta kirishga ikkita chiqish mos keladi, va qoida chiqmaydi.', 'Два. Одному входу отвечают два выхода, и правила не получается.', 'Two. One input matches two outputs, and no rule comes out.'),
    hint: [
      L("To'g'ri chiziq egri chiziqni kesgan nuqtalarni sanang.", 'Посчитай точки, где прямая пересекла кривую.', 'Count the points where the line crossed the curve.'),
      L('Yuqorida bitta va pastda bitta.', 'Сверху одна и снизу одна.', 'One above and one below.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Aniqlanish sohasi gorizontal bo'yicha yotadi", 'Область определения лежит по горизонтали', 'The domain lies along the horizontal'),
  tag: 'd-vs-e',
  show: [
    [
      L('qanday kirishlar umuman olinadi', 'какие входы вообще берутся', 'which inputs are taken at all'),
      L('bu aniqlanish sohasi', 'это и есть область определения', 'that is the domain'),
    ],
    [
      L("polosa gorizontal o'qqa yotdi", 'полоса легла на горизонтальную ось', 'the band lies on the horizontal axis'),
      L('sinusda u chekkasiz', 'у синуса она без края', 'for the sine it has no edge'),
    ],
  ],
  motion: ['dom'],
  audio: [
    A('mount', 'Har funksiyaga birinchi savol: u qanday kirishlarni qabul qiladi.', 'Первый вопрос к любой функции: какие входы она принимает.', 'The first question about any function: which inputs it accepts.'),
    A('dom', "Polosa gorizontal o'qqa yotadi va hamma kirishni birdan ko'rsatadi. Sinusda u ikki tomonga chekkasiz cho'ziladi: har qanday son to'g'ri keladi. Buni aniqlanish sohasi deb ataydilar.", 'Полоса ложится на горизонтальную ось и показывает все входы сразу. У синуса она тянется без края в обе стороны: подходит любое число. Это и называют областью определения.', 'The band lies on the horizontal axis and shows every input at once. For the sine it stretches without end both ways: any number fits. That is called the domain.'),
    A('work', "O'zingiz hisoblang. Sinusga kirish sifatida nechta son to'g'ri kelmaydi?", 'Посчитай сам. Сколько чисел не подходит синусу в качестве входа?', 'Compute it yourself. How many numbers do not fit the sine as an input?'),
  ],
  work: {
    prompt: L("Sinusga kirish sifatida nechta son to'g'ri KELMAYDI?", 'Сколько чисел НЕ подходит синусу как вход?', 'How many numbers do NOT fit the sine as an input?'),
    ok: L("Nol. Har qanday son to'g'ri keladi, shuning uchun polosa chekkasiz cho'ziladi.", 'Ноль. Подходит любое число, поэтому полоса тянется без края.', 'Zero. Every number fits, and that is why the band has no end.'),
    hint: [
      L('Polosa qayerda uzilishiga qarang.', 'Посмотри, где полоса обрывается.', 'Look where the band breaks off.'),
      L("U na chapda, na o'ngda uziladi.", 'Она не обрывается ни слева, ни справа.', 'It breaks off neither on the left nor on the right.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Qiymatlar to'plami vertikal bo'yicha yotadi", 'Множество значений лежит по вертикали', 'The range lies along the vertical'),
  tag: 'd-vs-e',
  show: [
    [
      L('qanday chiqishlar chiqadi', 'какие выходы получаются', 'which outputs come out'),
      L("bu qiymatlar to'plami", 'это множество значений', 'that is the range'),
    ],
    [
      L("polosa vertikal o'qqa turdi", 'полоса встала на вертикальную ось', 'the band stands on the vertical axis'),
      L('sinusda u chekkali', 'у синуса она с краями', 'for the sine it has edges'),
    ],
  ],
  motion: ['rng'],
  audio: [
    A('mount', 'Ikkinchi savol: funksiyada qanday chiqishlar chiqadi.', 'Второй вопрос: какие выходы у функции получаются.', 'The second question: which outputs the function produces.'),
    A('rng', "Endi polosa vertikal o'qqa turadi. Sinusda u qisqa: minus birdan birgacha, va chekkalari bor. Bu qiymatlar to'plami, va uni aniqlanish sohasi bilan chalkashtirib bo'lmaydi: biri gorizontal, ikkinchisi vertikal bo'yicha yotadi.", 'Теперь полоса встаёт на вертикальную ось. У синуса она короткая: от минус единицы до единицы, и края у неё есть. Это множество значений, и путать его с областью определения нельзя: одно лежит по горизонтали, другое по вертикали.', 'Now the band stands on the vertical axis. For the sine it is short: from minus one to one, and it has edges. That is the range, and it must not be confused with the domain: one lies along the horizontal, the other along the vertical.'),
    A('work', "O'zingiz hisoblang. Sinusning eng katta qiymati qancha?", 'Посчитай сам. Чему равно самое большое значение синуса?', 'Compute it yourself. What is the largest value of the sine?'),
  ],
  work: {
    prompt: L('Sinusning eng katta qiymati qancha?', 'Чему равно самое большое значение синуса?', 'What is the largest value of the sine?'),
    ok: L('Bir. Polosaning yuqori cheti eng katta qiymat.', 'Единица. Верхний край полосы и есть наибольшее значение.', 'One. The upper edge of the band is the largest value.'),
    hint: [
      L('Vertikal polosaning yuqori chetiga qarang.', 'Посмотри на верхний край вертикальной полосы.', 'Look at the upper edge of the vertical band.'),
      L("To'lqin unga cho'qqida tegadi.", 'Волна касается его на вершине.', 'The wave touches it at the peak.'),
      L('Bir.', 'Единица.', 'One.'),
    ],
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Formula, jadval va grafik — bir narsa', 'Формула, таблица и график — одно и то же', 'Formula, table and graph are the same thing'),
  tag: 'funksiya-tolko-formula',
  show: [
    [
      L('qoidani formula bilan yozish mumkin', 'правило можно записать формулой', 'the rule can be written as a formula'),
      L('jadval bilan ham', 'можно таблицей', 'or as a table'),
    ],
    [
      L('grafik bilan ham', 'можно графиком', 'or as a graph'),
      L('nuqtadagi qiymat bir xil', 'значение в точке одно и то же', 'the value at a point is the same'),
    ],
  ],
  motion: ['same'],
  audio: [
    A('mount', 'Bitta qoida uch xil yoziladi: formula, jadval va grafik bilan.', 'Одно и то же правило записывают тремя способами: формулой, таблицей и графиком.', 'The same rule is written in three ways: as a formula, a table and a graph.'),
    A('same', "Tekshirish oson: bitta kirishni olamiz va har usulda chiqishga qaraymiz. Formula son beradi, jadval o'sha sonni beradi, va grafikdagi nuqta o'sha balandlikda turadi. Demak bu uch xil narsa emas, bitta qoidaning uch yozuvi.", 'Проверить просто: возьмём один и тот же вход и посмотрим выход в каждом способе. Формула даёт число, таблица даёт то же число, и точка на графике стоит на той же высоте. Значит это не три разные вещи, а три записи одного правила.', 'Checking is easy: take the same input and look at the output in each way. The formula gives a number, the table gives the same number, and the point on the graph stands at the same height. So these are not three different things but three readings of one rule.'),
    A('work', "O'zingiz hisoblang. Nolning sinusi qancha?", 'Посчитай сам. Чему равен синус нуля?', 'Compute it yourself. What is the sine of zero?'),
  ],
  work: {
    prompt: L('sin 0 qancha?', 'Чему равен sin 0?', 'What is sin 0?'),
    ok: L('Nol. Formula ham, jadval ham, grafik ham bu yerda bir xil son beradi.', 'Ноль. И формула, и таблица, и график дают здесь одно и то же число.', 'Zero. The formula, the table and the graph all give the same number here.'),
    hint: [
      L("Nolda nuqta aylananing o'ng chetida turadi.", 'При нуле точка стоит на правом краю окружности.', 'At zero the point stands at the right edge of the circle.'),
      L('Uning balandligi nolga teng.', 'Высота у неё равна нулю.', 'Its height equals zero.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Funksiya, `D` va `E`', 'Функция, `D` и `E`', 'The function, `D` and `E`'),
  tag: 'd-vs-e',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', 'Polosa yana bir bor yotadi, va qoida yonida ochiladi. Gorizontal bu kirishlar, vertikal bu chiqishlar, va ularni chalkashtirish savolni chalkashtirish demakdir.', 'Полоса ложится ещё раз, и правило открывается рядом. Горизонталь это входы, вертикаль это выходы, и перепутать их значит перепутать вопрос.', 'The band lies down once more, and the rule opens beside it. The horizontal is the inputs, the vertical the outputs, and mixing them up means mixing up the question.'),
  ],
  probe: {
    question: L("Aniqlanish sohasi qayerdan o'qiladi?", 'Где читается область определения?', 'Where is the domain read?'),
    items: [
      { id: 'a', label: L("gorizontal o'q bo'yicha", 'по горизонтальной оси', 'along the horizontal axis'), correct: true },
      { id: 'b', label: L("vertikal o'q bo'yicha", 'по вертикальной оси', 'along the vertical axis'), hint: L("Vertikal bo'yicha qiymatlar to'plami o'qiladi, aniqlanish sohasi emas.", 'По вертикали читается множество значений, а не область определения.', 'Along the vertical the range is read, not the domain.') },
    ],
  },
  rule: {
    lawLabel: L("Ikki o'q", 'Две оси', 'Two axes'),
    lines: [
      L('Funksiya bu qoida: har kirishga aynan bitta chiqish mos keladi.', 'Функция это правило: каждому входу отвечает ровно один выход.', 'A function is a rule: each input matches exactly one output.'),
      L("Aniqlanish sohasi gorizontal, qiymatlar to'plami vertikal bo'yicha o'qiladi.", 'Область определения читается по горизонтали, множество значений по вертикали.', 'The domain is read along the horizontal, the range along the vertical.'),
      L('Qoidani formula, jadval yoki grafik bilan berish mumkin: bu bir narsaning uch yozuvi.', 'Правило можно задать формулой, таблицей или графиком: это три записи одного и того же.', 'The rule can be given by a formula, a table or a graph: three readings of one thing.'),
    ],
    law: 'D(y) = (−∞; +∞),   E(y) = [−1; 1]',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Funksiya va uning qiymatlari', 'Функция и её значения', 'The function and its values'),
  tag: 'd-vs-e',
  audio: [
    A('mount', "To'rt funksiya va to'rt to'plam. Ularni birlashtiring.", 'Четыре функции и четыре множества. Соедини их.', 'Four functions and four sets. Match them.'),
  ],
  match: {
    prompt: L("Funksiyani o'z qiymatlar to'plami bilan birlashtiring.", 'Соедини функцию с её множеством значений.', 'Match the function with its range.'),
    ok: L("Qiymatlar to'plami vertikal bo'yicha o'qiladi: ko'paytuvchi polosani cho'zadi, qo'shilgan son esa uni butunlay ko'taradi.", 'Множество значений читается по вертикали: множитель растягивает полосу, а прибавленное число поднимает её целиком.', 'The range is read along the vertical: the factor stretches the band, and an added number lifts the whole of it.'),
    left: ['y = sin x', 'y = 2 sin x', 'y = x', 'y = sin x + 3'],
    a: '[−1; 1]',
    b: '[−2; 2]',
    c: '(−∞; +∞)',
    d: '[2; 4]',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Grafikni qadam bilan o'qing", 'Прочитай график по шагам', 'Read the graph step by step'),
  tag: 'd-vs-e',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("gorizontal o'q", 'горизонтальная ось', 'the horizontal axis'),
    s2: L('aniqlanish sohasi', 'область определения', 'the domain'),
    s3: L("vertikal o'q", 'вертикальная ось', 'the vertical axis'),
    s4: L("qiymatlar to'plami", 'множество значений', 'the range'),
    ok: L("Tartib doim shunday: avval o'q, keyin yozuv. Yozuvdan boshlansa, qaysi o'q nima uchunligini chalkashtirish oson.", 'Порядок такой всегда: сначала ось, потом запись. Если начать с записи, легко перепутать, какая ось за что отвечает.', 'The order is always this: the axis first, the reading second. Starting with the reading makes it easy to mix up which axis is which.'),
    bad: L('Avval gorizontal va uning yozuvi, keyin vertikal va uning yozuvi.', 'Сначала горизонталь и её запись, потом вертикаль и её запись.', 'First the horizontal and its reading, then the vertical and its reading.'),
    mark: 'D → E',
  },
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz hisoblang', 'Посчитай без чертежа', 'Compute without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране чертежа нет. На экзамене его тоже не будет.', 'There is no drawing on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("Ikki. Ko'paytuvchi to'lqinni vertikal bo'yicha cho'zadi, va polosaning yuqori cheti ikkigacha ketadi.", 'Два. Множитель растягивает волну по вертикали, и верхний край полосы уходит до двойки.', 'Two. The factor stretches the wave vertically, and the upper edge of the band reaches two.'),
    hint: [
      L("Sinus birdan katta bo'lmaydi.", 'Синус не бывает больше единицы.', 'The sine is never more than one.'),
      L("Eng katta qiymatni ikkiga ko'paytiring.", 'Умножь наибольшее значение на два.', 'Multiply the largest value by two.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    prompt: 'y = 2 sin x,   max y = ?',
    answer: '2',
  },
  order: {
    prompt: L("Yuqori chetlarni o'sish tartibida joylashtiring.", 'Расставь по возрастанию верхние края.', 'Arrange the upper edges in increasing order.'),
    title: L('Qaysi funksiyaning yuqori cheti pastroq?', 'У какой функции верхний край ниже?', 'Which function has the lower upper edge?'),
    ok: L("Siz ko'paytuvchilarni solishtirdingiz, ular esa qiymatlar polosasini cho'zadi.", 'Ты сравнил множители, а они и растягивают полосу значений.', 'You compared the factors, and it is they that stretch the band of values.'),
    bad: L("Sinus oldidagi ko'paytuvchiga qarang: u yuqori chetni beradi.", 'Посмотри на множитель перед синусом: он и задаёт верхний край.', 'Look at the factor before the sine: it sets the upper edge.'),
    items: ['0,5 sin x', 'sin x', '2 sin x', '3 sin x'],
    answer: '0,5 sin x  sin x  2 sin x  3 sin x',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob noto'g'ri. Qayerda?", 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  audio: [
    A('mount', "Masala. Sinusning aniqlanish sohasi va qiymatlar to'plamini yozish.", 'Задача. Записать область определения и множество значений синуса.', 'A task. Write the domain and the range of the sine.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: sinus har qanday kirishda aniqlangan.", 'Эта строка верна: синус определён при любом входе.', 'This line is right: the sine is defined for every input.'),
    r2: L("Bu qator ham to'g'ri: qiymatlar minus bir bilan bir orasida yotadi.", 'Эта строка тоже верна: значения лежат между минус единицей и единицей.', 'This line is right too: the values lie between minus one and one.'),
    r4: L('Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida.', 'Эта строка повторяет ошибку предыдущей. Первая неверная строка выше.', 'This line repeats the error of the previous one. The first wrong line is above.'),
  },
  proof: L("O'qlar joyi almashib ketgan.", 'Оси перепутаны местами.', 'The axes were swapped.'),
  entry: {
    prompt: L("Sinus qiymatlar to'plamining yuqori cheti qancha?", 'Чему равен верхний край множества значений синуса?', 'What is the upper edge of the range of the sine?'),
    ok: L("Bir. Qiymatlar to'plami vertikal bo'yicha o'qiladi, va to'lqin birgacha yetadi.", 'Единица. Множество значений читается по вертикали, и волна доходит до единицы.', 'One. The range is read along the vertical, and the wave reaches one.'),
    hint: [
      L("Qiymatlar to'plami bu chiqishlar, kirishlar emas.", 'Множество значений это выходы, а не входы.', 'The range is the outputs, not the inputs.'),
      L("Chiqishlar vertikal o'q bo'yicha o'qiladi.", 'Выходы читаются по вертикальной оси.', 'The outputs are read along the vertical axis.'),
      L('Bir.', 'Единица.', 'One.'),
    ],
    answer: '1',
  },
  row: {
    r1: 'y = sin x',
    r2: '−1 ≤ y ≤ 1',
    r3: 'D(y) = [−1; 1]',
    r4: 'E(y) = (−∞; +∞)',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Yozuvdan funksiyani tanlash', 'По записи выбрать функцию', 'From the reading back to the function'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskari masala. Yozuv berilgan, funksiyalarni tanlash kerak.', 'Теперь обратная задача. Дана запись, а выбрать надо функции.', 'Now the inverse task. A reading is given, and the functions must be chosen.'),
    A('next', 'Qiymatlari kesmada yotgan hammasini belgilang.', 'Отметь все, у которых значения лежат в отрезке.', 'Mark all whose values lie in a segment.'),
  ],
  multi: {
    prompt: L("Qiymatlar to'plami kesma bo'lgan hamma funksiyani belgilang.", 'Отметь все функции, у которых множество значений это отрезок.', 'Mark every function whose range is a segment.'),
    title: L('Qaysi funksiyalarda qiymatlar kesmada yotadi?', 'У каких функций значения лежат в отрезке?', 'Which functions have their values in a segment?'),
    ok: L("Beshtadan uchtasi. Kesma bu ikki tomondan ham chet bo'lgani.", 'Три из пяти. Отрезок это когда края есть с обеих сторон.', 'Three out of five. A segment is when there are edges on both sides.'),
    items: [
      { id: 'd', label: 'y = x', hint: L("To'g'ri chiziqda qiymatlar ikki tomonga chekkasiz ketadi.", 'У прямой значения уходят без края в обе стороны.', 'For the line the values run without end both ways.') },
      { id: 'e', label: 'y = x + 1', hint: L("Siljigan to'g'ri chiziq ham ikki tomonga chekkasiz ketadi.", 'Прямая со сдвигом всё равно уходит без края в обе стороны.', 'A shifted line still runs without end both ways.') },
      { id: 'a', label: 'y = sin x', ok: true },
      { id: 'b', label: 'y = 2 sin x', ok: true },
      { id: 'c', label: 'y = cos x', ok: true },
    ],
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'd-vs-e',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Aniqlanish sohasi qayerdan o'qiladi?", 'Где читается область определения?', 'Where is the domain read?'),
      done: 'D(y)',
      items: [
        { id: 'a', label: L("gorizontal bo'yicha", 'по горизонтали', 'along the horizontal'), correct: true },
        { id: 'b', label: L("vertikal bo'yicha", 'по вертикали', 'along the vertical'), hint: L("Vertikal bo'yicha chiqishlar, ya'ni qiymatlar to'plami o'qiladi.", 'По вертикали читаются выходы, то есть множество значений.', 'Along the vertical the outputs are read, that is the range.') },
        { id: 'c', label: L("ikkala o'q bo'yicha", 'по обеим осям', 'along both axes'), hint: L("Har o'q o'zi uchun javob beradi: biri kirishlar, ikkinchisi chiqishlar.", 'Каждая ось отвечает за своё: одна за входы, другая за выходы.', 'Each axis has its own job: one for inputs, the other for outputs.') },
        { id: 'd', label: L("formula bo'yicha", 'по формуле', 'from the formula'), hint: L("Formuladan ham bo'ladi, lekin grafikda bu oddiy polosa.", 'По формуле тоже можно, но на графике это просто полоса.', 'The formula works too, but on the graph it is simply a band.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Funksiyada bitta kirishda nechta chiqish bor?', 'Сколько выходов у одного входа у функции?', 'How many outputs does one input have in a function?'),
      done: 'x   →   y',
      items: [
        { id: 'a', label: L('aynan bitta', 'ровно один', 'exactly one'), correct: true },
        { id: 'b', label: L('ikkita', 'два', 'two'), hint: L("Ikkita chiqish aylanada bo'ladi, va u funksiya emas.", 'Два выхода бывают у окружности, и она функцией не является.', 'Two outputs happen for a circle, and it is not a function.') },
        { id: 'c', label: L("qancha bo'lsa ham", 'сколько угодно', 'any number'), hint: L("Unda qoida qaysi chiqishni olishni aytmagan bo'lardi.", 'Тогда правило не говорило бы, какой выход брать.', 'Then the rule would not say which output to take.') },
        { id: 'd', label: L('hech qaysi', 'ни одного', 'none'), hint: L("Chiqishsiz qoida umuman bo'lmasdi.", 'Без выхода правила бы не было вовсе.', 'Without an output there would be no rule at all.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Sinusning qiymatlar to'plami nimaga teng?", 'Чему равно множество значений синуса?', 'What is the range of the sine?'),
      done: 'E(y) = [−1; 1]',
      items: [
        { id: 'a', label: L('minus birdan birgacha kesma', 'отрезок от минус единицы до единицы', 'the segment from minus one to one'), correct: true, ok: L("Ha. To'lqin polosadan chiqmaydi.", 'Да. Волна не выходит из полосы.', 'Yes. The wave stays inside the band.') },
        { id: 'b', label: L('barcha sonlar', 'все числа', 'all numbers'), hint: L("Barcha sonlar bu aniqlanish sohasi, qiymatlar to'plami emas.", 'Все числа это область определения, а не множество значений.', 'All numbers is the domain, not the range.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Aylana funksiya grafigimi?', 'Является ли окружность графиком функции?', 'Is a circle the graph of a function?'),
      done: 'x = 1',
      items: [
        { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
        { id: 'b', label: L('ha', 'да', 'yes'), hint: L("Vertikal to'g'ri chiziq uni ikki marta kesadi.", 'Вертикальная прямая пересекает её дважды.', 'A vertical line crosses it twice.') },
        { id: 'c', label: L('faqat yuqori yarmi', 'только верхняя половина', 'only the upper half'), hint: L('Yarmi funksiya, lekin savol butun aylana haqida edi.', 'Половина уже функция, но вопрос был про всю окружность.', 'The half is a function, but the question was about the whole circle.') },
        { id: 'd', label: L("radiusga bog'liq", 'зависит от радиуса', 'it depends on the radius'), hint: L("Radius hech narsani o'zgartirmaydi: to'g'ri chiziq baribir ikki marta uchratadi.", 'Радиус ничего не меняет: прямая всё равно встретит кривую дважды.', 'The radius changes nothing: the line still meets the curve twice.') },
      ],
    },
  ],
  angles: ['0°', '90°', '180°', '270°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Har qanday egri chiziq funksiya bermaydi: bitta kirishga aynan bitta chiqish bo'lishi kerak.", 'Не всякая кривая задаёт функцию: у одного входа должен быть ровно один выход.', 'Not every curve gives a function: one input must have exactly one output.'),
  ],
  can: [
    L("Egri chiziqni vertikal to'g'ri chiziq bilan tekshiraman", 'Проверяю кривую вертикальной прямой', 'I check a curve with a vertical line'),
    L("Aniqlanish sohasini gorizontal bo'yicha o'qiyman", 'Читаю область определения по горизонтали', 'I read the domain along the horizontal'),
    L("Qiymatlar to'plamini vertikal bo'yicha o'qiyman", 'Читаю множество значений по вертикали', 'I read the range along the vertical'),
    L('Formula, jadval va grafik bitta qoida ekanini bilaman', 'Знаю, что формула, таблица и график — одно правило', 'I know a formula, a table and a graph are one rule'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: qaysi o'q nima uchun javob beradi.", 'Одно место требует повтора: какая ось за что отвечает.', 'One place needs review: which axis does what.'),
    back: L('Qoidaga va 5-ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen 5.'),
  },
  bridge: L("Birinchi blok yopildi. Keyin tenglamalar: u yerda o'sha aylana, lekin burchaklar qidiriladi.", 'Блок 1 закрыт. Дальше уравнения: там та же окружность, но искать будут углы.', 'Block one is closed. Next come equations: the same circle, but angles will be sought.'),
  lifehack: L("Qaysi o'q nima uchunligini unutdingizmi: kirish chapdan o'ngga, o'qishdek boradi. Chiqish yuqoriga ko'tariladi.", 'Забыл, какая ось за что: вход идёт слева направо, как чтение. Выход поднимается вверх.', 'Forgot which axis is which: the input runs left to right, like reading. The output rises upwards.'),
  sheetTitle: L('Funksiya · shpargalka', 'Функция · шпаргалка', 'The function · cheat sheet'),
  sheetSrc: L('10-sinf · 7-dars', '10 класс · урок 7', 'Grade 10 · lesson 7'),
  hook: {
    a: 'y,  y',
    b: 'x   →   y',
  },
  proved: 'x   →   y',
  law: 'D(y) = (−∞; +∞),   E(y) = [−1; 1]',
  sheet: [
    'x   →   y',
    'D(y)',
    'E(y)',
    'E(sin x) = [−1; 1]',
    'E(2 sin x) = [−2; 2]',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: минус там типографский, `parseInt` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «функция — множество значений». Обе стороны формулы.
const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const FN_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const FN_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})
// Отметок на окружности тут нет: в этом уроке окружности вообще нет.

const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Точка идёт по кривой уже на хуке, роняя два следа: вход и выход
        // видны до того, как названы.
        fig={() => <Scene fig={<Plane step={1} curve="sin" show="point" />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="sin" show="point" />} max={300} />
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
      /* Вход и выход падают ОДНОВРЕМЕННО: правило видно как пара следов, а
         не как определение. */
      <Scene
        fig={<Plane step={phase} curve="sin" show="point" />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="sin" show="point" />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S3.work.prompt}
            answer={num(S3.work.answer)}
            okText={S3.work.ok}
            hints={S3.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* СВИДЕТЕЛЬ УРОКА. На графике функции прямая встречает кривую один раз,
         на окружности сразу два — и это видно, а не сказано. */
      <Scene
        fig={<Plane step={phase + 1} curve={phase === 0 ? 'sin' : 'circle'} show="vline" at={1.1} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={2} curve="circle" show="vline" />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S4.work.prompt}
            answer={num(S4.work.answer)}
            okText={S4.work.ok}
            hints={S4.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      <Scene
        fig={<Plane step={phase + 1} curve="sin" show="dom" />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={2} curve="sin" show="dom" />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S5.work.prompt}
            answer={num(S5.work.answer)}
            okText={S5.work.ok}
            hints={S5.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* ТА ЖЕ полоса, только повёрнутая на вертикаль: различение D и E
         держится на направлении, а не на словах. */
      <Scene
        fig={<Plane step={phase + 1} curve="sin" show="rng" />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={2} curve="sin" show="rng" />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S6.work.prompt}
            answer={num(S6.work.answer)}
            okText={S6.work.ok}
            hints={S6.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      <Scene
        fig={<Plane step={phase} curve="sin" show="point" />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="sin" show="point" />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S7.work.prompt}
            answer={num(S7.work.answer)}
            okText={S7.work.ok}
            hints={S7.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        // Полоса ложится в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => <Scene fig={<Plane step={solved ? 2 : 0} curve="sin" show="dom" />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={FN_LEFT}
        right={FN_RIGHT}
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
      <OrderRow
        prompt={S10.order.prompt}
        items={ORD10}
        answer={['s1', 's2', 's3', 's4']}
        okText={S10.order.ok}
        badText={S10.order.bad}
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
    {({ audio, solve }) => (
      /* Окружности на этом уроке нет, поэтому и «поставь точку» нет: перенос
         идёт от записи к функции, а не от угла к точке. */
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
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
            fig={<Plane step={1} curve={round === 3 ? 'circle' : 'sin'} show={round === 3 ? 'vline' : 'point'} />}
            max={300}
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
