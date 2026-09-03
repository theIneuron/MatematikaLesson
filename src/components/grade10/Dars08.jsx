// ============================================================================
// 10-sinf, Dars 8. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS08_KONTENT.md
// Ma'lumot sborshchik bilan yig'ilgan, EKRAN TANALARI qo'lda: asbob va
// figurani tanlash matematik qaror (etalon 5.3). Asbob 2 -- yozuv, asbob 5 --
// polosa, 6-ekranda `TwoLines` ko'zgu rejimida (darslik 4-rasm, 39-bet).
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
  Scene,
} from './tools.jsx'
import { DomainBand, TwoLines } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 8
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Murakkab va teskari funksiya`,
  `Урок ${LESSON_NO}. Сложная и обратная функция`,
  `Lesson ${LESSON_NO}. Composite and inverse function`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 8 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TARTIB', 'ПОРЯДОК', 'THE ORDER'),
  title: L("Tartib o'zgarsa, javob o'zgaradimi?", 'Меняем порядок — меняется ответ?', 'Change the order, does the answer change?'),
  audio: [
    A('mount', "Ikki funksiya. Birinchisi kvadratga ko'taradi, ikkinchisi uchni ayiradi.", 'Две функции. Первая возводит в квадрат, вторая отнимает три.', 'Two functions. The first squares, the second subtracts three.'),
    A('r1', "Birinchi yozuv tartib muhim emas deydi: avval kvadrat yoki avval minus uch, farqi yo'q.", 'Первая запись говорит, что порядок неважен: сначала квадрат или сначала минус три, разницы нет.', 'The first reading says the order does not matter: square first or subtract three first, no difference.'),
    A('r2', "Ikkinchisi tartib sonni o'zgartiradi deydi, unda ikkitadan bittasi ortiqcha.", 'Вторая говорит, что порядок меняет число, и тогда одна запись из двух лишняя.', 'The second says the order changes the number, and then one of the two readings is wrong.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi ikkala tartibni hisoblaymiz.', 'Твой ответ записан. Сейчас посчитаем оба порядка.', 'Your answer is saved. Now we will compute both orders.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ikkala tartib bir xil son beradi', 'оба порядка дают одно число', 'both orders give the same number'),
      value: 'f(g(5)) = g(f(5))',
    },
    b: {
      name: L('tartiblar boshqa son beradi', 'порядки дают разные числа', 'the orders give different numbers'),
      value: 'f(g(5)) ≠ g(f(5))',
    },
  },
  defs: ['f(x) = x²', 'g(x) = x − 3'],
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE BASICS'),
  title: L('Boshlashdan oldin uchta qisqa savol', 'Три коротких перед началом', 'Three short ones before we start'),
  tag: 'support',
  audio: [
    A('mount', 'Siz bilgan narsalar uchun uchta savol. Darsning ikkala funksiyasi ularda alohida uchraydi.', 'Три вопроса на то, что уже знаешь. Обе функции урока встретятся в них по отдельности.', 'Three questions on what you already know. Both functions of the lesson appear in them separately.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Funksiya kvadratga ko'taradi. U ikkida nima beradi?", 'Функция возводит в квадрат. Что она даёт на двойке?', 'The function squares. What does it give at two?'),
      done: L('Bu darsning tashqi funksiyasi.', 'Это внешняя функция урока.', 'This is the outer function of the lesson.'),
      items: [
        { id: 'a', label: L('4', '4', '4'), correct: true },
        { id: 'b', label: L('2', '2', '2'), hint: L('Ikki bu kirish, chiqish emas.', 'Двойка это вход, а не выход.', 'Two is the input, not the output.') },
        { id: 'c', label: L('8', '8', '8'), hint: L("Sakkiz bu kub, kvadrat esa ikki ko'paytuvchi.", 'Восемь это куб, а квадрат это два множителя.', 'Eight is the cube; a square is two factors.') },
        { id: 'd', label: L('1', '1', '1'), hint: L('Birni birning kvadrati beradi, ikkining emas.', 'Единицу даёт квадрат единицы, а не двойки.', 'One comes from the square of one, not of two.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Funksiya uchni ayiradi. U beshda nima beradi?', 'Функция отнимает три. Что она даёт на пятёрке?', 'The function subtracts three. What does it give at five?'),
      done: L('Bu esa ichkisi.', 'А это внутренняя.', 'And this is the inner one.'),
      items: [
        { id: 'a', label: L('2', '2', '2'), correct: true },
        { id: 'b', label: L('8', '8', '8'), hint: L("Sakkiz qo'shishda chiqardi, bu yerda esa minus.", 'Восемь вышло бы при сложении, а здесь стоит минус.', 'Eight would come from addition, but here it is a minus.') },
        { id: 'c', label: L('15', '15', '15'), hint: L("O'n besh bu uchga ko'paytirish, uchni ayirish emas.", 'Пятнадцать это умножение на три, а не вычитание трёх.', 'Fifteen is multiplication by three, not subtracting three.') },
        { id: 'd', label: L('−2', '−2', '−2'), hint: L('Ishora teskari: beshdan uch ayirildi, teskarisi emas.', 'Знак перевёрнут: от пяти отняли три, а не наоборот.', 'The sign is flipped: three from five, not the other way.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Iks ayirish uch ifodasi qanday iksda nolga teng?', 'При каком икс выражение икс минус три равно нулю?', 'For which x does x minus three equal zero?'),
      done: L("Xuddi shu son teskarisini izlaganda kerak bo'ladi.", 'Это же число понадобится, когда будем искать обратную.', 'The same number will be needed when we look for the inverse.'),
      items: [
        { id: 'a', label: L('3', '3', '3'), correct: true },
        { id: 'b', label: L('0', '0', '0'), hint: L('Nolda minus uch chiqadi, nol emas.', 'При нуле выйдет минус три, а не ноль.', 'At zero it gives minus three, not zero.') },
        { id: 'c', label: L('−3', '−3', '−3'), hint: L('Minus uchda minus olti chiqadi.', 'При минус трёх выйдет минус шесть.', 'At minus three it gives minus six.') },
        { id: 'd', label: L('1', '1', '1'), hint: L('Birda minus ikki chiqadi.', 'При единице выйдет минус два.', 'At one it gives minus two.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('MURAKKAB FUNKSIYA', 'СЛОЖНАЯ ФУНКЦИЯ', 'A COMPOSITE FUNCTION'),
  title: L('Ichki funksiya birinchi ishlaydi', 'Внутренняя работает первой', 'The inner one works first'),
  tag: 'slozhnaya-poryadok',
  show: [
    [
      L('1-qadam. Ichki funksiya sonni oladi', 'Шаг 1. Внутренняя функция берёт число', 'Step 1. The inner function takes the number'),
      L("iks o'rniga iks ayirish uch qo'yildi", 'вместо икс подставлено икс минус три', 'x minus three is put in place of x'),
      L('uning natijasi tashqisiga boradi', 'её результат идёт дальше, во внешнюю', 'its result goes on, into the outer one'),
    ],
    [
      L("2-qadam. Tashqisi kvadratga ko'taradi", 'Шаг 2. Внешняя возводит в квадрат', 'Step 2. The outer one squares'),
      L('qavs ichida tayyor son turadi', 'в скобках стоит уже готовое число', 'inside the brackets a ready number stands'),
      L('beshda ichkisi ikkini beradi', 'на пятёрке внутренняя даёт два', 'at five the inner one gives two'),
    ],
  ],
  motion: ['side'],
  audio: [
    A('mount', "Chapda ikkala funksiya, o'ngda yozuv. Har bir qadam daftardagidek o'z satrini oladi.", 'Слева обе функции, справа запись. Каждый шаг занимает свою строку, как в тетради.', 'On the left both functions, on the right the record. Each step takes its own line, as in a notebook.'),
    A('side', "Ichki funksiya qayerga qo'yilishini kuzatib turing. U butunlay, minusi bilan kiradi.", 'Смотри, куда подставляется внутренняя функция. Она входит целиком, вместе со своим минусом.', 'Watch where the inner function goes. It enters whole, together with its minus.'),
    A('work', 'Darslik bunga murakkab funksiya deydi: bir funksiya boshqasining ichida turadi.', 'Учебник называет это сложной функцией: одна функция стоит внутри другой.', 'The textbook calls this a composite function: one function stands inside another.'),
  ],
  work: {
    prompt: L('Murakkab funksiyaning beshdagi qiymatini hisoblang', 'Посчитай значение сложной функции на пятёрке', 'Compute the value of the composite at five'),
    ok: L("To'g'ri. Ichkisi ikkini berdi, tashqisi kvadratga ko'tardi: to'rt.", 'Верно. Внутренняя дала два, внешняя возвела в квадрат: четыре.', 'Correct. The inner gave two, the outer squared it: four.'),
    hint: [
      L("Avval iks besh bo'lganda iks ayirish uchni hisoblang.", 'Сначала посчитай икс минус три при икс равном пяти.', 'First compute x minus three at x equal to five.'),
      L('Ichkisi ikkini berdi. Endi tashqisi ishlaydi.', 'Внутренняя дала два. Теперь работает внешняя.', 'The inner gave two. Now the outer works.'),
      L("Ikkining kvadrati to'rt.", 'Квадрат двойки это четыре.', 'Two squared is four.'),
    ],
    expr: 'f(g(5)) = (5 − 3)²',
    answer: '4',
  },
  defs: ['f(x) = x²', 'g(x) = x − 3'],
  frame: [
    'f(g(x)) = f(x − 3)',
    'f(g(x)) = (x − 3)²',
  ],
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('BOSHQA TARTIB', 'ДРУГОЙ ПОРЯДОК', 'THE OTHER ORDER'),
  title: L("O'sha ikki funksiya, tartib teskari", 'Те же две функции, порядок обратный', 'The same two functions, the order reversed'),
  tag: 'slozhnaya-poryadok',
  show: [
    [
      L("Endi birinchi bo'lib kvadrat ishlaydi", 'Теперь первой работает квадрат', 'Now the square works first'),
      L('va faqat keyin uch ayiriladi', 'и только потом отнимается три', 'and only then three is subtracted'),
      L('beshda yigirma ikki chiqadi', 'на пятёрке выходит двадцать два', 'at five it comes out twenty two'),
    ],
    [
      L("To'rt va yigirma ikki", 'Четыре против двадцати двух', 'Four against twenty two'),
      L("o'sha funksiyalar, o'sha kirish, boshqa tartib", 'те же функции, тот же вход, разный порядок', 'same functions, same input, different order'),
      L('demak tartibni yozish shart', 'значит запись порядка обязательна', 'so writing the order down is mandatory'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Endi teskarisi: kvadrat birinchi, minus uch ikkinchi.', 'Теперь наоборот: квадрат первым, минус три вторым.', 'Now the other way round: the square first, minus three second.'),
    A('two', 'Bir xil funksiyalar, sonlar esa boshqa. Qavslar qayerda turganiga qarang.', 'Одни и те же функции, а числа разные. Смотри, где стоят скобки.', 'The same functions, different numbers. Watch where the brackets are.'),
    A('work', 'Ichkisi bu qavs ichidagisi. U birinchi ishlaydi.', 'Внутренняя это та, что в скобках. Она и работает первой.', 'The inner one is the one inside the brackets. It works first.'),
  ],
  order: {
    prompt: L('Tartib bilan joylashtiring', 'Расставь по порядку', 'Put them in order'),
    s1: L('kirish ichkisiga boradi', 'вход идёт во внутреннюю', 'the input goes into the inner one'),
    s2: L('uning natijasi tashqisiga boradi', 'её результат идёт во внешнюю', 'its result goes into the outer one'),
    s3: L('tashqisi javob beradi', 'внешняя даёт ответ', 'the outer one gives the answer'),
    ok: L("To'g'ri. Ichkisi doim birinchi, va bu qavslardan ko'rinadi.", 'Верно. Внутренняя всегда первой, и это видно по скобкам.', 'Correct. The inner one always goes first, and the brackets show it.'),
    bad: L('Tartib boshqacha. Qavs ichida qaysi funksiya turganiga qarang.', 'Порядок другой. Смотри, какая функция стоит в скобках.', 'The order is different. Look at which function stands inside the brackets.'),
    mark: 'f(g(x))',
  },
  defs: ['f(x) = x²', 'g(x) = x − 3'],
  frame: [
    'g(f(x)) = x² − 3',
    'f(g(5)) = 4,   g(f(5)) = 22',
  ],
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('QAYERDA ANIQLANGAN', 'ГДЕ ОПРЕДЕЛЕНА', 'WHERE IT IS DEFINED'),
  title: L('Shart ichkisidan keladi', 'Условие приходит от внутренней', 'The condition comes from the inner one'),
  tag: 'slozhnaya-oblast',
  show: [
    [
      L("Tashqisi butun o'qda aniqlangan", 'Внешняя определена на всей прямой', 'The outer one is defined on the whole line'),
      L('ichkisi esa ildiz', 'а внутренняя это корень', 'but the inner one is a root'),
      L("ildiz ostida manfiy bo'lolmaydi", 'под корнем отрицательного быть не может', 'a negative cannot stand under a root'),
    ],
    [
      L("Polosa noldan o'ngga bo'yalgan", 'Полоса закрашена от нуля вправо', 'The band is shaded from zero rightwards'),
      L('bu murakkab funksiyaning aniqlanish sohasi', 'это область определения сложной функции', 'this is the domain of the composite'),
      L('darslik uni ichkisidan oladi, tashqisidan emas', 'учебник берёт её у внутренней, а не у внешней', 'the textbook takes it from the inner one, not the outer'),
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', "Darslikdagi misol, o'ttiz beshinchi bet. Tashqi funksiya oddiy, ichkisi esa ildiz.", 'Пример из учебника, страница тридцать пять. Внешняя функция обычная, а внутренняя корень.', 'The example from the textbook, page thirty five. The outer function is ordinary, the inner one is a root.'),
    A('band', "Ruxsat etilgan qiymatlar polosasi birinchi paydo bo'ladi, qo'yishdan oldin.", 'Полоса допустимых значений появляется первой, ещё до подстановки.', 'The band of allowed values appears first, before any substitution.'),
    A('work', 'Shart ichki funksiyadan keldi, savol esa murakkab funksiya haqida edi.', 'Условие пришло от внутренней функции, хотя вопрос был про сложную.', 'The condition came from the inner function, though the question was about the composite.'),
  ],
  work: {
    prompt: L('t ning eng kichik ruxsat etilgan qiymatini yozing', 'Запиши наименьшее допустимое значение те', 'Write the smallest allowed value of t'),
    ok: L("To'g'ri. Nol kiradi: noldan ildiz bor va u nolga teng.", 'Верно. Ноль входит: корень из нуля есть и равен нулю.', 'Correct. Zero is included: the root of zero exists and equals zero.'),
    hint: [
      L('Ildiz ostida nima turganiga qarang.', 'Смотри, что стоит под корнем.', 'Look at what stands under the root.'),
      L("Ildiz uning ostidagi manfiy bo'lmaganda aniqlangan.", 'Корень определён, когда под ним не отрицательное.', 'A root is defined when what is under it is not negative.'),
      L('Chegara sohaga kiradi: bu nol.', 'Граница входит в область: это ноль.', 'The boundary belongs to the domain: it is zero.'),
    ],
    expr: 'x = √t',
    answer: '0',
  },
  defs: ['y = 2x² − 3x', 'x = √t'],
  frame: [
    'y = 2t − 3√t',
    't ≥ 0',
  ],
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TESKARI FUNKSIYA', 'ОБРАТНАЯ ФУНКЦИЯ', 'THE INVERSE FUNCTION'),
  title: L('Kirish va chiqish joyini almashadi', 'Вход и выход меняются местами', 'The input and the output swap places'),
  tag: 'obratnaya-kak-stepen',
  show: [
    [
      L("To'g'ri funksiya iksdan igrekka olib boradi", 'Прямая функция ведёт от икс к игрек', 'The direct function leads from x to y'),
      L('teskarisi igrekdan iksga qaytaradi', 'обратная возвращает от игрек к икс', 'the inverse leads back from y to x'),
      L("minus bir va to'rt nuqtasi to'rt va minus bir bo'ladi", 'точка минус один и четыре становится четыре и минус один', 'the point minus one and four becomes four and minus one'),
    ],
    [
      L("Punktir bu igrek teng iks to'g'ri chizig'i", 'Пунктир это прямая игрек равно икс', 'The dashed line is y equals x'),
      L('grafiklar unga nisbatan simmetrik', 'графики симметричны относительно неё', 'the graphs are symmetric about it'),
      L("darslik xuddi shuni o'ttiz to'qqizinchi betda chizadi", 'учебник рисует это же на странице тридцать девять', 'the textbook draws the same on page thirty nine'),
    ],
  ],
  motion: ['mirror'],
  audio: [
    A('mount', "To'g'ri funksiya ikkilantiradi va olti qo'shadi. Teskarisi hammasini qaytarishi kerak.", 'Прямая функция удваивает и добавляет шесть. Обратная должна вернуть всё назад.', 'The direct function doubles and adds six. The inverse has to bring everything back.'),
    A('mirror', "Ko'zgu nima qilishini kuzatib turing. Nuqta punktirdan o'tadi va koordinatalari joyini almashadi.", 'Смотри, что делает зеркало. Точка переходит через пунктир и меняет координаты местами.', 'Watch what the mirror does. The point crosses the dashed line and swaps its coordinates.'),
    A('work', 'Yuqoridagi minus bir teskari funksiyani bildiradi, kasr yoki daraja emas.', 'Запись минус один сверху означает обратную функцию, а не дробь и не степень.', 'The minus one above means the inverse function, not a fraction and not a power.'),
  ],
  work: {
    prompt: L("Teskari funksiyaning o'ndagi qiymatini hisoblang", 'Посчитай значение обратной функции на десятке', 'Compute the value of the inverse at ten'),
    ok: L("To'g'ri. Ikki. Tekshiruv: to'g'ri funksiya ikkida o'n beradi, demak aynan o'sha yerga qaytdik.", 'Верно. Два. Проверка: прямая функция на двойке даёт десять, значит вернулись ровно туда.', 'Correct. Two. Check: the direct function at two gives ten, so we came back exactly there.'),
    hint: [
      L("Igrek teng ikki iks qo'shuv olti tenglikdan iksni ifodalang.", 'Из равенства игрек равно два икс плюс шесть вырази икс.', 'From y equals two x plus six express x.'),
      L("Oltini ayiring, keyin ikkiga bo'ling.", 'Отними шесть, потом раздели на два.', 'Subtract six, then divide by two.'),
      L("O'n ayirish olti bu to'rt, to'rtni ikkiga bo'lsa ikki.", 'Десять минус шесть это четыре, четыре на два это два.', 'Ten minus six is four, four divided by two is two.'),
    ],
    expr: 'f⁻¹(x) = 0,5x − 3',
    answer: '2',
  },
  defs: ['f(x) = 2x + 6', 'f⁻¹(x) = 0,5x − 3'],
  frame: [
    'y = 2x + 6   ⇒   x = 0,5y − 3',
    'f(2) = 10,   f⁻¹(10) = 2',
  ],
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE'),
  title: L("Har funksiyaning teskarisi yo'q", 'Обратная есть не у всякой функции', 'Not every function has an inverse'),
  tag: 'obratnaya-bez-odnoznachnosti',
  show: [
    [
      L("Butun o'qdagi kvadratning teskarisi yo'q", 'Квадрат на всей прямой обратной не имеет', 'The square on the whole line has no inverse'),
      L("bitta igrekka ikki xil iks to'g'ri keladi", 'одному игрек отвечают два разных икс', 'one y corresponds to two different x'),
      L('demak bir qiymatli qaytish mumkin emas', 'значит вернуться однозначно нельзя', 'so there is no single way back'),
    ],
    [
      L("O'qning o'ng yarmida teskarisi bor", 'На правой половине прямой обратная есть', 'On the right half of the line the inverse exists'),
      L("unda har igrekka bitta iks to'g'ri keladi", 'там каждому игрек отвечает один икс', 'there each y has exactly one x'),
      L('darslik ildizning yagonaligini talab qiladi', 'учебник и требует единственности корня', 'the textbook requires exactly this uniqueness'),
    ],
  ],
  motion: ['count'],
  audio: [
    A('mount', "Darslik tenglama yagona ildizga ega bo'lishini talab qiladi. Buni son bilan tekshiramiz.", 'Учебник требует, чтобы уравнение имело единственный корень. Проверим это числом.', 'The textbook requires the equation to have a unique root. Let us check it with a number.'),
    A('count', 'Yozuvga qarang. Ikki son bir xil kvadrat beradi.', 'Смотри на запись. Два числа дают один и тот же квадрат.', 'Look at the record. Two numbers give one and the same square.'),
    A('work', "Aynan shu sababli butun o'qdagi kvadratning teskarisi yo'q.", 'Вот из-за этого обратной у квадрата на всей прямой и нет.', 'This is exactly why the square has no inverse on the whole line.'),
  ],
  work: {
    prompt: L("Kvadrati to'qqizga teng bo'lgan nechta son bor?", 'Сколько чисел дают квадрат, равный девяти?', 'How many numbers give a square equal to nine?'),
    ok: L("To'g'ri. Ikkita: uch va minus uch. Bitta igrek, ikki iks, teskarisi yo'q.", 'Верно. Два: три и минус три. Один игрек, два икс, обратной нет.', 'Correct. Two: three and minus three. One y, two x, no inverse.'),
    hint: [
      L("Qaysi sonning kvadrati to'qqiz beradi?", 'Какое число в квадрате даёт девять?', 'Which number squared gives nine?'),
      L("Minus uchning kvadrati ham to'qqiz beradi.", 'Минус три в квадрате тоже даёт девять.', 'Minus three squared also gives nine.'),
      L('Demak bunday son ikkita, bitta emas.', 'Значит таких чисел два, а не одно.', 'So there are two such numbers, not one.'),
    ],
    expr: 'x² = 9',
    answer: '2',
  },
  defs: ['y = x²', 'y = 9'],
  frame: [
    'x² = 9   ⇒   x = 3;   x = −3',
    'x ≥ 0   ⇒   x = 3',
  ],
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  title: L("Darslikning uchta ta'rifi", 'Три определения учебника', 'Three definitions from the textbook'),
  tag: 'period-lyuboy',
  motion: ['rule'],
  audio: [
    A('mount', 'Kartochkani ochishdan oldin bitta savolga javob bering.', 'Прежде чем открыть карточку, ответь на один вопрос.', 'Before the card opens, answer one question.'),
    A('rule', "Kartochka darslik so'zlari bilan gapiradi. Uchta ta'rif, va uchalasi tartib haqida.", 'Карточка говорит словами учебника. Три определения, и все три про порядок.', 'The card speaks in the words of the textbook. Three definitions, and all three are about order.'),
  ],
  probe: {
    question: L('Asosiy davr nima?', 'Что такое основной период?', 'What is the fundamental period?'),
    items: [
      { id: 'a', label: L('eng kichik musbat davr', 'наименьший положительный период', 'the smallest positive period'), correct: true },
      { id: 'b', label: L('mos kelgan har qanday davr', 'любой период, который подошёл', 'any period that happened to fit'), hint: L("Unda asosiy davr cheksiz ko'p bo'lardi: har birining ortidan ikkilangani va uchlangani keladi.", 'Тогда основных периодов было бы бесконечно много: за каждым идут его удвоение и утроение.', 'Then there would be infinitely many fundamental periods: each one is followed by its double and triple.') },
    ],
  },
  rule: {
    lawLabel: L('Davriy funksiya', 'Периодическая функция', 'A periodic function'),
    lines: [
      L('35-bet. Funksiya ichidagi funksiya — murakkab funksiya.', 'Стр. 35. Функция внутри функции — сложная функция.', 'Page 35. A function inside a function is a composite.'),
      L("37-bet. Ildiz yagona bo'lsa teskarisi bor; yuqoridagi minus bir uni bildiradi.", 'Стр. 37. Корень единственный — есть обратная; минус один сверху её и означает.', 'Page 37. A unique root means an inverse; the minus one above denotes it.'),
      L('39-bet. Asosiy davr — eng kichik musbat davr.', 'Стр. 39. Основной период — наименьший положительный.', 'Page 39. The fundamental period is the smallest positive one.'),
    ],
    law: 'f(x + nT) = f(x),   n ∈ Z',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L("TO'RT JUFTLIK", 'ЧЕТЫРЕ ПАРЫ', 'FOUR PAIRS'),
  title: L('Funksiyani teskarisi bilan biriktiring', 'Соедини функцию с её обратной', 'Match each function with its inverse'),
  tag: 'obratnaya-kak-stepen',
  audio: [
    A('mount', "To'rtta funksiya, har birining o'z teskarisi bor. Teskarisi to'g'risi qilgan ishni bekor qiladi.", 'Четыре функции, и у каждой своя обратная. Обратная отменяет то, что сделала прямая.', 'Four functions, each with its own inverse. The inverse undoes what the direct one did.'),
  ],
  match: {
    prompt: L("Har funksiyaga o'z teskarisi", 'Каждой функции своя обратная', 'Each function gets its own inverse'),
    a: L('x − 5', 'x − 5', 'x − 5'),
    b: L('x : 3', 'x : 3', 'x : 3'),
    c: L('x + 2', 'x + 2', 'x + 2'),
    d: L('4x', '4x', '4x'),
    ok: L("To'rttasi ham to'g'ri. Teskarisi amalni bekor qiladi, funksiyaga bo'lmaydi.", 'Все четыре верно. Обратная отменяет действие, а не делит на функцию.', 'All four correct. The inverse undoes the action; it does not divide by the function.'),
    left: ['f(x) = x + 5', 'f(x) = 3x', 'f(x) = x − 2', 'f(x) = x : 4'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Qadamlar atalgan, tartib sizdan', 'Шаги названы, порядок за тобой', 'The steps are named, the order is yours'),
  tag: 'obratnaya-kak-stepen',
  audio: [
    A('mount', "Darslik teskarisini to'rt qadamda izlaydi, oxirgi qadamni esa yodda tutish qiyin.", 'Учебник ищет обратную в четыре шага, и последний шаг легко забыть.', 'The textbook finds the inverse in four steps, and the last step is easy to forget.'),
  ],
  order: {
    prompt: L('Tartib bilan joylashtiring', 'Расставь по порядку', 'Put them in order'),
    s1: L("f(x) o'rniga igrekni yozish", 'записать игрек вместо эф от икс', 'write y in place of f(x)'),
    s2: L('iksni igrek orqali ifodalash', 'выразить икс через игрек', 'express x through y'),
    s3: L('harflarni almashtirib teskarisini yozish', 'поменять буквы и записать обратную', 'swap the letters and write the inverse'),
    ok: L("To'g'ri. Ikki iks qo'shuv bir chiqadi. Tekshiruv: to'g'risi beshda ikki, teskarisi ikkida besh.", 'Верно. Выходит два икс плюс один. Проверка: прямая на пяти даёт два, обратная на двух даёт пять.', 'Correct. It gives two x plus one. Check: the direct at five gives two, the inverse at two gives five.'),
    bad: L('Tartib boshqacha. Harflar oxirida almashadi, boshida emas.', 'Порядок другой. Буквы меняются местами в самом конце, а не в начале.', 'The order is different. The letters swap at the very end, not at the start.'),
    mark: 'f⁻¹(x) = 2x + 1',
  },
  defs: 'f(x) = (x − 1) : 2',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Davr, asbobsiz', 'Период, без прибора', 'The period, no instrument'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob.", 'Прибора здесь нет. Сначала порядок записей, потом ответ.', 'There is no instrument here. First the order of the lines, then the answer.'),
    A('next', "Endi qiymatning o'zi. Sonni yozing.", 'Теперь само значение. Пиши число.', 'Now the value itself. Write the number.'),
  ],
  order: {
    prompt: L("Yozuvlarni paydo bo'lish tartibida joylashtiring", 'Расставь записи в том порядке, в каком они появляются', 'Put the lines in the order they appear'),
    title: L('Yozuvlar tartibi', 'Порядок записей', 'The order of the lines'),
    ok: L("To'g'ri. To'qqiz bu bir qo'shuv ikki davr, shuning uchun qiymat o'sha.", 'Верно. Девятка это единица плюс два периода, поэтому значение то же.', 'Correct. Nine is one plus two periods, so the value is the same.'),
    bad: L("Tartib to'g'ri emas. Avval to'qqizni davr orqali yozadilar, keyin qiymatni oladilar.", 'Не тот порядок. Сначала девятку раскладывают через период, потом берут значение.', 'Wrong order. First nine is written through the period, then the value is taken.'),
    items: ['f(x + 4) = f(x)', 'f(9) = f(1 + 2·4)', 'f(9) = f(1)', 'f(9) = 7'],
    answer: 'f(x + 4) = f(x)  f(9) = f(1 + 2·4)  f(9) = f(1)  f(9) = 7',
  },
  task: {
    prompt: L("Davr to'rtga teng, birdagi qiymat yettiga teng. To'qqizdagi qiymat nimaga teng?", 'Период равен четырём, значение в единице равно семи. Чему равно значение в девятке?', 'The period is four, the value at one is seven. What is the value at nine?'),
    ok: L("To'g'ri. Yetti. Qiymat har to'rt qadamda takrorlanadi.", 'Верно. Семь. Значение повторяется через каждые четыре шага.', 'Correct. Seven. The value repeats every four steps.'),
    hint: [
      L("Birdan to'qqizgacha nechta davr bor?", 'Сколько периодов от единицы до девятки?', 'How many periods from one to nine?'),
      L("Sakkiz bu to'rtlik ikki davr.", 'Восемь это два периода по четыре.', 'Eight is two periods of four.'),
      L("Butun son davrdan keyin qiymat o'sha bo'ladi.", 'Через целое число периодов значение то же самое.', 'After a whole number of periods the value is the same.'),
    ],
    answer: '7',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Hamma qadam to'g'ri, xulosa noto'g'ri", 'Все шаги верны, вывод неверен', 'Every step is right, the conclusion is wrong'),
  tag: 'check',
  audio: [
    A('mount', "Yechim to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping.", 'Решение выписано в четыре строки. Найди ту, где появилась ошибка.', 'The solution is written in four lines. Find the one where the mistake appeared.'),
    A('next', "Endi u yerda turishi kerak bo'lgan sonni yozing.", 'Теперь запиши число, которое там должно стоять.', 'Now write the number that belongs there.'),
  ],
  hint: {
    r1: L("Bu berilgan: davr to'rtga teng.", 'Это дано: период равен четырём.', 'This is given: the period equals four.'),
    r2: L("To'g'ri: to'rt davr bo'lsa, sakkiz ham davr.", 'Верно: если четыре период, то и восемь период.', 'Correct: if four is a period, so is eight.'),
    r3: L("Bu ham to'g'ri, sakkiz haqiqatan davr.", 'Тоже верно, восемь действительно период.', 'Also correct, eight really is a period.'),
  },
  proof: L('Xato oxirgi satrda. Asosiy davr eng kichik musbat davr, topilgan har qanday davr emas.', 'Ошибка в последней строке. Основной период это наименьший положительный, а не любой найденный.', 'The mistake is in the last line. The fundamental period is the smallest positive one, not any found.'),
  entry: {
    prompt: L('Bu funksiyaning asosiy davrini yozing', 'Запиши основной период этой функции', 'Write the fundamental period of this function'),
    ok: L("To'g'ri. To'rt: bu eng kichik musbat davr.", 'Верно. Четыре: это наименьший положительный период.', 'Correct. Four: this is the smallest positive period.'),
    hint: [
      L("To'rtdan sakkiz, o'n ikki va shu kabilar kelib chiqadi.", 'Из четвёрки следуют восемь, двенадцать и так далее.', 'From four follow eight, twelve and so on.'),
      L("Teskarisi chiqmaydi: sakkizdan to'rt kelib chiqmaydi.", 'Наоборот не выходит: из восьмёрки четвёрка не следует.', 'The other way round fails: four does not follow from eight.'),
      L("Demak ularning eng kichigi to'rt.", 'Значит наименьший из них четыре.', 'So the smallest of them is four.'),
    ],
    answer: '4',
  },
  row: {
    r1: 'f(x + 4) = f(x)',
    r2: 'f(x + 8) = f(x + 4) = f(x)',
    r3: 'T = 8',
    r4: 'T₀ = 8',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE REVERSE TASK'),
  title: L('Endi siz hisoblaysiz', 'Теперь считаешь ты', 'Now you do the counting'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Bungacha teskarisini sizga tayyor berardilar. Endi uning ishini o'zingiz tekshirasiz.", 'До этого обратную давали тебе готовой. Теперь проверишь её действие сам.', 'Until now the inverse was given to you ready-made. Now you check its action yourself.'),
    A('work', "E'tibor bering: teskarisi va to'g'risi bir-birini bekor qiladi, va bu ularning asosiy xossasi.", 'Обрати внимание: обратная и прямая друг друга отменяют, и это их главное свойство.', 'Notice: the inverse and the direct cancel each other, and that is their main property.'),
  ],
  multi: {
    prompt: L("Butun o'qda teskarisi bor hamma funksiyani belgilang", 'Отметь все функции, у которых обратная есть на всей прямой', 'Mark every function that has an inverse on the whole line'),
    title: L("To'rttadan ikkitasi", 'Две из четырёх', 'Two out of four'),
    ok: L("To'g'ri. Teskarisi har qiymatga aynan bitta kirish to'g'ri kelganda bor.", 'Верно. Обратная есть там, где каждому значению отвечает ровно один вход.', 'Correct. An inverse exists where each value has exactly one input.'),
    items: [
      { id: 'c', label: 'f(x) = x²', hint: L('Kvadrat bir qiymatni ikki xil songa beradi, bir qiymatli qaytish mumkin emas.', 'Квадрат даёт одно значение двум разным числам, вернуться однозначно нельзя.', 'The square gives one value to two different numbers; there is no single way back.') },
      { id: 'd', label: 'f(x) = |x|', hint: L('Modul ham plyus va minusni yopishtiradi: ikki va minus ikkida u bir xil.', 'Модуль тоже склеивает плюс и минус: у двух и минус двух он одинаковый.', 'The absolute value also glues plus and minus: at two and minus two it is the same.') },
      { id: 'a', label: 'f(x) = x + 1', ok: true },
      { id: 'b', label: 'f(x) = 2x', ok: true },
    ],
  },
  entry: {
    prompt: L("Funksiya besh qo'shadi. Uchdagi to'g'ri qiymatning teskarisi nimaga teng?", 'Функция добавляет пять. Чему равно значение обратной от значения прямой в тройке?', 'The function adds five. What is the inverse of the direct value at three?'),
    ok: L("To'g'ri. Uch. Teskarisi kirishda nima bo'lsa, aynan shuni qaytaradi.", 'Верно. Три. Обратная возвращает ровно то, что было на входе.', 'Correct. Three. The inverse returns exactly what was on the input.'),
    hint: [
      L("Avval uchdagi to'g'risini hisoblang.", 'Сначала посчитай прямую в тройке.', 'First compute the direct one at three.'),
      L("To'g'risi sakkizni berdi. Endi teskarisi ishlaydi.", 'Прямая дала восемь. Теперь работает обратная.', 'The direct gave eight. Now the inverse works.'),
      L('Teskarisi beshni ayiradi: sakkiz ayirish besh.', 'Обратная отнимает пять: восемь минус пять.', 'The inverse subtracts five: eight minus five.'),
    ],
    expr: 'f(x) = x + 5,   f⁻¹(f(3)) = ?',
    answer: '3',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'THE BLITZ'),
  title: L("Ketma-ket to'rtta savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'slozhnaya-poryadok',
  audio: [
    A('mount', "To'rtta savol, va ular baholanadi.", 'Четыре вопроса, и они идут в оценку.', 'Four questions, and they count towards the score.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Murakkab funksiyada birinchi ishlaydigan...', 'В сложной функции первой работает…', 'In a composite function the first to work is...'),
      done: L("Qavslar tartibni beradi, va ular ichdan o'qiladi.", 'Скобки задают порядок, и читаются они изнутри.', 'The brackets set the order, and they are read from inside out.'),
      items: [
        { id: 'a', label: L('qavs ichidagisi', 'та, что в скобках', 'the one inside the brackets'), correct: true },
        { id: 'b', label: L('tashqaridagisi', 'та, что снаружи', 'the one outside'), hint: L('Tashqisi tayyor sonni oladi, demak ikkinchi ishlaydi.', 'Внешняя получает уже готовое число, значит работает второй.', 'The outer one receives a ready number, so it works second.') },
        { id: 'c', label: L('har qanday, tartib muhim emas', 'любая, порядок неважен', 'either one, the order does not matter'), hint: L("To'rt va yigirma ikki: tartib muhim.", 'Четыре против двадцати двух: порядок важен.', 'Four against twenty two: the order matters.') },
        { id: 'd', label: L("sohasi kengrog'i", 'та, у которой область шире', 'the one with the wider domain'), hint: L('Aniqlanish sohasi boshqa narsani hal qiladi: murakkab funksiya qayerda aniqlangan.', 'Область определения решает другое: где сложная функция определена.', 'The domain settles a different thing: where the composite is defined.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Yuqoridagi minus bir bildiradi...', 'Запись минус один сверху означает…', 'The minus one above means...'),
      done: L('Teskari funksiya, kasr emas. Bu yozuv, daraja emas.', 'Обратная функция, а не дробь. Это запись, а не степень.', 'The inverse function, not a fraction. It is a notation, not a power.'),
      items: [
        { id: 'a', label: L('teskari funksiyani', 'обратную функцию', 'the inverse function'), correct: true },
        { id: 'b', label: L("bir bo'lingan funksiya kasrini", 'дробь один делить на функцию', 'the fraction one over the function'), hint: L("Son bilan tekshiruv: teskarisi o'nda ikki beradi, kasr esa bir yigirma oltidan.", 'Проверка числом: обратная в десятке даёт два, а дробь одну двадцать шестую.', 'Check with a number: the inverse at ten gives two, the fraction gives one twenty sixth.') },
        { id: 'c', label: L("funksiyaning o'zini minus bilan", 'минус саму функцию', 'minus the function itself'), hint: L("Funksiya oldidagi minus boshqacha yoziladi, yuqorida biri bo'lmaydi.", 'Минус перед функцией пишут иначе, без единицы сверху.', 'A minus in front of a function is written differently, with no one above.') },
        { id: 'd', label: L('birinchi hosilani', 'первую производную', 'the first derivative'), hint: L('Hosila boshqa mavzu va boshqa yozuv.', 'Производная это другая тема и другая запись.', 'The derivative is another topic and another notation.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Teskari funksiyaning grafigi...', 'График обратной функции…', 'The graph of the inverse...'),
      done: L("Ko'zgu bu igrek teng iks to'g'ri chizig'i.", 'Зеркало это прямая игрек равно икс.', 'The mirror is the line y equals x.'),
      items: [
        { id: 'a', label: L("igrek teng iks to'g'ri chizig'iga nisbatan simmetrik", 'симметричен относительно прямой игрек равно икс', 'is symmetric about the line y equals x'), correct: true, ok: L("Ha: nuqta koordinatalarini almashtiradi, va bu punktirdagi aks etishning o'zi.", 'Да: точка меняет координаты местами, и это и есть отражение в пунктире.', 'Yes: the point swaps its coordinates, and that is the reflection in the dashed line.') },
        { id: 'b', label: L("iks o'qiga nisbatan simmetrik", 'симметричен относительно оси икс', 'is symmetric about the x axis'), hint: L("Iks o'qidagi aks etish igrek ishorasini o'zgartiradi, harflarni almashtirmaydi.", 'Отражение в оси икс меняет знак игрек, а не меняет буквы местами.', 'Reflection in the x axis flips the sign of y; it does not swap the letters.') },
        { id: 'c', label: L("to'g'risining grafigi bilan ustma-ust", 'совпадает с графиком прямой', 'coincides with the graph of the direct one'), hint: L("Ustma-ust tushish bo'ladi, lekin faqat maxsus hollarda, doim emas.", 'Совпадение бывает, но только в особых случаях, а не всегда.', 'Coinciding happens, but only in special cases, not always.') },
        { id: 'd', label: L("igrek o'qiga nisbatan simmetrik", 'симметричен относительно оси игрек', 'is symmetric about the y axis'), hint: L('Bu juft funksiyaning simmetriyasi, mavzu boshqa.', 'Это симметрия чётной функции, тема другая.', 'That is the symmetry of an even function, a different topic.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Asosiy davr bu...', 'Основной период это…', 'The fundamental period is...'),
      done: L('Eng kichik musbat, darslik shunday deydi.', 'Наименьший положительный, так говорит учебник.', 'The smallest positive, that is what the textbook says.'),
      items: [
        { id: 'a', label: L('eng kichik musbat davr', 'наименьший положительный период', 'the smallest positive period'), correct: true },
        { id: 'b', label: L('davrlarning eng qulayi', 'самый удобный из периодов', 'the most convenient of the periods'), hint: L("Qulaylik ta'rif emas: darslik eng kichik musbatni ataydi.", 'Удобство не определение: учебник называет наименьший положительный.', 'Convenience is not a definition: the textbook names the smallest positive.') },
        { id: 'c', label: L('qiymatlar mos kelgan har qanday son', 'любое число, при котором значения совпали', 'any number where the values happened to match'), hint: L('Bitta nuqtadagi moslik davr qilmaydi: tenglik hamma iksda kerak.', 'Совпадение в одной точке периодом не делает: равенство нужно при всех икс.', 'A match at one point makes no period: the equality must hold for all x.') },
        { id: 'd', label: L('ikkilangan davr', 'удвоенный период', 'the doubled period'), hint: L("Ikkilangani ham davr, lekin u kattaroq, kerak bo'lgani esa eng kichigi.", 'Удвоенный тоже период, но он больше, а нужен наименьший.', 'The doubled one is a period too, but it is larger, and the smallest is wanted.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('XULOSA', 'ИТОГ', 'THE SUMMARY'),
  title: L('Uch mavzu, bitta fikr: tartib', 'Три темы, одна мысль: порядок', 'Three topics, one idea: order'),
  audio: [
    A('mount', 'Birinchi ekrandagi taxmin va natija yonma-yon turadi.', 'Прогноз с первого экрана и результат стоят рядом.', 'The guess from screen one and the result stand side by side.'),
    A('next', "Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi.", 'Шпаргалка собрана по учебнику. Ниже видно, что умеешь.', 'The sheet is put together from the textbook. Below you can see what you can do.'),
  ],
  can: [
    L("Murakkab funksiyani to'g'ri tartibda hisoblayman", 'Считаю сложную функцию в правильном порядке', 'I compute a composite in the right order'),
    L("Teskarisini topaman va qo'yib tekshiraman", 'Нахожу обратную и проверяю её подстановкой', 'I find the inverse and check it by substitution'),
    L("Teskarisi yo'q holatni ko'raman", 'Вижу, когда обратной нет', 'I see when there is no inverse'),
    L('Davrni asosiy davrdan ajrataman', 'Отличаю период от основного периода', 'I tell a period from the fundamental period'),
  ],
  levels: {
    full: L("Hammasidan o'tdingiz va tuzoqni ochdingiz", 'Прошёл всё и разобрал ловушку', 'Everything done, the trap taken apart'),
    gap: L("Murakkab va teskari ishlaydi, davr hali yo'q", 'Сложная и обратная работают, период ещё нет', 'Composite and inverse work, the period not yet'),
    back: L('Uchinchi ekranga qaytish kerak: ichkisi birinchi ishlaydi', 'Стоит вернуться к экрану три: внутренняя работает первой', 'Worth going back to screen three: the inner one works first'),
  },
  bridge: L('Keyingisi arkfunksiyalar: bular sinus, kosinus va tangensga teskari, va yagonalik sharti ham shu yerda chiqadi.', 'Дальше аркфункции: это обратные к синусу, косинусу и тангенсу, и там же появится условие единственности.', 'Next come the arc functions: inverses of sine, cosine and tangent, and the uniqueness condition shows up there.'),
  lifehack: L("Teskarisini formula bilan emas, son bilan tekshirish qulay: kirishni to'g'risidan, keyin teskarisidan o'tkazing. Aynan o'sha kirish qaytsa, teskarisi to'g'ri topilgan.", 'Обратную удобно проверять не формулой, а числом: прогони вход через прямую, потом через обратную. Если вернулся ровно тот же вход, обратная найдена верно.', 'It is handy to check an inverse with a number rather than a formula: run an input through the direct one, then through the inverse. If exactly the same input comes back, the inverse is right.'),
  sheetTitle: L('Dars shpargalkasi', 'Шпаргалка урока', 'The lesson sheet'),
  sheetSrc: L('algebra 2022, 35, 37, 39-betlar', 'алгебра 2022, стр. 35, 37, 39', 'algebra 2022, pages 35, 37, 39'),
  hook: {
    a: 'f(g(5)) = g(f(5))',
    b: 'f(g(5)) ≠ g(f(5))',
  },
  proved: '4 ≠ 22',
  law: 'f(x + nT) = f(x),   n ∈ Z',
  sheet: [
    'f(g(x)) = f(x − 3) = (x − 3)²',
    'g(f(x)) = x² − 3',
    'y = 2x + 6   ⇒   f⁻¹(x) = 0,5x − 3',
    'x² = 9   ⇒   x = 3;  x = −3',
    'T₀ = 4   ⇒   4, 8, 12, …',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))

// IKKI TA'RIF YONMA-YON. Sistema emas, shuning uchun figurali qavs yo'q:
// bular ikkita alohida funksiya, va ularni bir qavsga olish yolg'on bo'lardi.
const Defs = ({ rows, size = 'sm' }) => (
  <span style={{ display: 'block' }}>
    {(Array.isArray(rows) ? rows : [rows]).map((r, i) => (
      <Expr key={i} size={size} style={{ textAlign: 'left' }}>{r}</Expr>
    ))}
  </span>
)

// ASBOB 2: YOZUV. Kartochka daftar varag'i, har qadam o'z satrida.
const Rec = ({ defs, line, items }) => (
  <Cols l={1} r={1}>
    <Col>
      <Panel tone="paper">
        <Defs rows={defs} />
        <Expr size="big" style={{ textAlign: 'left', marginTop: 6 }}>{line}</Expr>
      </Panel>
    </Col>
    <Col><NoteList items={items} /></Col>
  </Cols>
)

// ODZ POLOSASI 5-ekranda: ildiz ostidagi manfiy bo'lmaydi, chegara nolda.
const BAND = { lo: -3, hi: 11, ticks: [-2, 0, 2, 4, 6, 8, 10] }

// TESKARI FUNKSIYA GRAFIGI: `f(x) = 2x + 6` va `f⁻¹(x) = 0,5x − 3`, o'rtada
// `y = x` ko'zgusi, nuqta (−1; 4) va uning juftligi (4; −1). Darslik, 4-rasm.
const Mirror = ({ step, size }) => (
  <TwoLines size={size} step={step} k1={2} b1={6} k2={0.5} b2={-3} mirror pairAt={-1} />
)

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const FUN_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const FUN_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

// 4-ekranda UCHTA qadam: kirish, natija, javob. To'rtinchi qadam bu yerda
// yo'q -- 25-darsda to'rttasi noutbukning 615 px iga sig'magan edi.
const ORD4 = ['s1', 's2', 's3'].map((id) => ({ id, label: S4.order[id] }))
// UCHTA QADAM: kitobning to'rt qadami uchga yig'ildi, chunki noutbukning
// 615 px ida to'rtta slot 40 px ga oshib ketardi. Oxirgi ikkisi bitta
// harakat -- harflarni almashtirib yozib qo'yish.
const ORD10 = ['s1', 's2', 's3'].map((id) => ({ id, label: S10.order[id] }))
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
        // Ikkala funksiya ko'rinadi, hisob esa YO'Q: prognoz sondan oldin
        // qilinadi, aks holda taxmin qilinmaydi, o'qiladi.
        fig={() => (
          <Panel tone="paper">
            <Defs rows={S1.defs} size="mid" />
          </Panel>
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
          <Panel tone="paper">
            <Defs rows={S1.defs} size="mid" />
          </Panel>
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
      /* Yozuv pastga o'sadi: 1-kadrda ichki funksiya qavsga kiradi,
         2-kadrda tashqisi ishlaydi. */
      <Rec defs={S3.defs} line={phase === 0 ? S3.frame[1] : S3.frame[2]} items={S3.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="mid" style={{ textAlign: 'left' }}>{S3.work.expr}</Expr>
          </Panel>
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
      /* Razgranichenie: O'SHA ikki funksiya, tartib teskari. Ikkinchi kadrda
         ikki son yonma-yon turadi -- to'rt va yigirma ikki. */
      <Rec defs={S4.defs} line={phase === 0 ? S4.frame[1] : S4.frame[2]} items={S4.show[phase]} />
    ) : (
      <OrderRow
        prompt={S4.order.prompt}
        items={ORD4}
        answer={['s1', 's2', 's3']}
        okText={S4.order.ok}
        badText={S4.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* ASBOB 5. Polosa ichki funksiyadan keladi: savol murakkab funksiya
         haqida, shart esa ildizdan. */
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={phase} from={0} {...BAND} />} max={280} h={186} />
          <Panel tone="paper">
            <Expr size="mid">{phase === 0 ? S5.frame[1] : S5.frame[2]}</Expr>
          </Panel>
        </Col>
        <Col><NoteList items={S5.show[phase]} /></Col>
      </Cols>
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} from={0} {...BAND} />} max={280} h={186} />
          <Panel tone="paper">
            <Expr size="mid">{S5.work.expr}</Expr>
          </Panel>
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
      /* DARSNING SHOHIDI. Nuqta punktirdan o'tadi va koordinatalari joyini
         almashadi -- teskari funksiyaning grafigi shundan yig'iladi. */
      <Scene fig={<Mirror step={phase + 1} />} note={<NoteList items={S6.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Mirror step={2} />} max={300} /></Col>
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
      /* Chegara SON bilan tekshiriladi: ikki son bitta kvadrat beradi. */
      <Rec defs={S7.defs} line={phase === 0 ? S7.frame[1] : S7.frame[2]} items={S7.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big" style={{ textAlign: 'left' }}>{S7.work.expr}</Expr>
          </Panel>
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
        // Ko'zgu javob paytida ochiladi: qoida uni tug'dirgan harakat yonida.
        fig={(solved) => <Scene fig={<Mirror step={solved ? 2 : 0} />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={FUN_LEFT}
        right={FUN_RIGHT}
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
      <>
        <Defs rows={S10.defs} />
        <OrderRow
          prompt={S10.order.prompt}
          items={ORD10}
          answer={['s1', 's2', 's3']}
          okText={S10.order.ok}
          badText={S10.order.bad}
          audio={audio}
          onSolved={solve}
        />
      </>
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
      <NumberEntry
        prompt={S11.task.prompt}
        answer={num(S11.task.answer)}
        okText={S11.task.ok}
        hints={S11.task.hint}
        audio={audio}
        onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
      />
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
            <Expr size="mid">{S13.entry.expr}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S13.entry.prompt}
            answer={num(S13.entry.answer)}
            okText={S13.entry.ok}
            hints={S13.entry.hint}
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
          <Scene fig={<Mirror step={round >= 2 ? 2 : 1} />} max={260} h={168} />
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
