// ============================================================================
// 7-sinf, Dars 20. KO'PHADNI BIR HADGA KO'PAYTIRISH.
// (Умножение многочлена на одночлен)
//
// BIRINCHI DARS KONVEYERDA. Bu faylda JSX YO'Q: o'ram `screens.jsx` da
// turadi, dars esa 15 ta ma'lumot obyekti. Har obyektning `kind` maydoni
// qaysi forma qo'yilishini aytadi. Ilgari har dars 15 ta bir xil o'ram
// yozardi va aynan o'sha qatorlarda xato qilinardi.
//
// ASBOB: `AreaGrid` -- YUZA TO'RTBURCHAGI, etalon § 2 dagi 3-asbob.
// Darslikning o'zi shu modelni so'raydi: shakllarning yuzini toping
// (47 va 49-betlar), modellar asosida qo'shish (45-bet).
//
// NAZORATCHI SHUNDAN: kataklar SONI ko'rinadi. Qavsda uch had bo'lsa uch
// katak turadi, va ulardan bittasi ochilmasa bu KO'ZGA TASHLANADI. Blokning
// asosiy xatosi -- ko'paytmani tushirib qoldirish -- shu bilan yopiladi.
// Tuzoq ekrani aynan shu xatoni qo'yadi: uch qadam ham to'g'ri hisoblangan,
// lekin uchinchi ko'paytma umuman yozilmagan.
//
// ASBOB HISOBLAMAYDI (§8.1): katak ochilganda ko'paytuvchilar JUFTI
// ko'rinadi, natijani o'quvchi o'zi topadi -- koeffitsiyent va
// ko'rsatkichlar ustidagi ish B3 blokining ishi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_20'
const LESSON_TITLE = L("Ko'phadni bir hadga ko'paytirish", 'Умножение многочлена на одночлен', 'Multiplying a polynomial by a monomial')
const LESSON_NO = L('20-dars', 'Урок 20', 'Lesson 20')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 20 }

const TAGS = {
  Z1: L("ko'paytuvchi hamma hadga tarqatilmadi", 'множитель дошёл не до всех членов', 'the factor did not reach every term'),
  Z2: L("ko'paytma tushib qoldi", 'произведение пропущено', 'a product was skipped'),
  Z3: L('ishora hisobga olinmadi', 'знак не учтён', 'the sign was ignored'),
  Z4: L("ko'rsatkichlar qo'shilmadi", 'показатели не сложены', 'the exponents were not added'),
  Z5: L("qavs ichini qo'shishga urindi", 'пытались сложить внутри скобки', 'an attempt to add inside the bracket'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ikki o'quvchi bitta ko'paytmani hisobladi. Tablolarda
// HISOBLANGAN KO'PAYTMALAR SONI turadi: bitta va ikkita.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("KO'PHADNI BIR HADGA KO'PAYTIRISH", 'УМНОЖЕНИЕ МНОГОЧЛЕНА НА ОДНОЧЛЕН', 'MULTIPLYING A POLYNOMIAL BY A MONOMIAL'),
  noBack: true,
  noNotes: true,
  title: L("Nechta ko'paytma kerak", 'Сколько произведений нужно', 'How many products are needed'),
  gate: {
    source: { kind: 'plain', tokens: ['3a', '·', '(2a', '+', '5)'] },
    rows: [
      { tokens: ['6a²', '+', '5'], value: '1' },
      { tokens: ['6a²', '+', '15a'], value: '2' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Qavsda ikki had bor. Tablolarda hisoblangan ko'paytmalar soni turadi. Kim haq?",
      'В скобке два члена. На табло стоит число посчитанных произведений. Кто прав?',
      'The bracket has two terms. The boards show how many products were worked out. Who is right?',
    ),
    items: [
      {
        id: 'both',
        label: L("Ikkita: ko'paytuvchi HAR hadga tarqaladi", 'Два: множитель расходится на КАЖДЫЙ член', 'Two: the factor spreads to EVERY term'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'first',
        label: L("Bittasi: ko'paytuvchi faqat birinchi hadga tegishli", 'Одно: множитель относится только к первому члену', 'One: the factor belongs to the first term only'),
        hint: L(
          "Yuqori tabloga qarang: beshlik o'zgarmay qolgan. Uch a unga tegdimi.",
          'Посмотри на верхнее табло: пятёрка осталась как была. Дошло ли до неё три a.',
          'Look at the upper board: the five stayed as it was. Did three a reach it.',
        ),
      },
      {
        id: 'three',
        label: L("Uchta: qavsdagi qo'shuv ham ko'paytiriladi", 'Три: сложение в скобке тоже умножается', 'Three: the addition in the bracket is multiplied too'),
        hint: L(
          "Qo'shuv had emas, u hadlarni ajratadi. Ko'paytiriladigan narsa hadlar.",
          'Сложение это не член, оно разделяет члены. Умножаются члены.',
          'Addition is not a term, it separates terms. Terms are what gets multiplied.',
        ),
      },
      {
        id: 'none',
        label: L("Avval qavs ichini hisoblash kerak", 'Сначала надо посчитать в скобке', 'The bracket must be worked out first'),
        hint: L(
          "Qavs ichida x li had va son turibdi, ular o'xshash emas va qo'shilmaydi.",
          'В скобке член с x и число, они не подобны и не складываются.',
          'The bracket holds an x term and a number, they are not like and do not add.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta ko'paytmani hisobladi va boshqa javob oldi.", 'Два ученика считали одно произведение и получили разное.', 'Two students worked out the same product and got different answers.'),
    A('mount', "Tablolarda hisoblangan ko'paytmalar soni turadi: bittasida bitta, ikkinchisida ikkita.", 'На табло стоит число посчитанных произведений: у одного одно, у другого два.', 'The boards show how many products were computed: one has one, the other two.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. B3 va B1: bir hadlar ko'paytmasi va son bilan qavs.
// KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  items: [
    {
      prompt: '3a · 2a',
      ok: L("Koeffitsiyentlar ko'paytiriladi, bir xil harflar sanaladi.", 'Коэффициенты умножаются, одинаковые буквы считаются.', 'The coefficients multiply, like letters get counted.'),
      items: [
        { id: 'a', label: '6a²', correct: true },
        { id: 'b', label: '6a', tag: 'Z4', hint: L("Ikkita a bor, demak a kvadrat.", 'Есть две a, значит a в квадрате.', 'There are two a, so a squared.') },
        { id: 'c', label: '5a²', tag: 'Z6', hint: L("Uch va ikki qo'shilmaydi, ko'paytiriladi.", 'Три и два не складывают, а умножают.', 'Three and two are not added but multiplied.') },
        { id: 'd', label: '6a⁴', tag: 'Z4', hint: L("Ko'rsatkichlar qo'shiladi: bir va bir teng ikki.", 'Показатели складываются: один и один это два.', 'The exponents add: one and one is two.') },
      ],
    },
    {
      prompt: '−2a⁴ · 14ab',
      ok: L("Manfiy karra musbat manfiy beradi, a ning ko'rsatkichlari qo'shiladi.", 'Минус на плюс даёт минус, показатели a складываются.', 'A minus times a plus gives a minus, and the a exponents add.'),
      items: [
        { id: 'a', label: '−28a⁵b', correct: true },
        { id: 'b', label: '−28a⁴b', tag: 'Z4', hint: L("Ikkinchi ko'paytuvchida ham a bor, ko'rsatkichlar qo'shiladi.", 'Во втором множителе тоже есть a, показатели складываются.', 'The second factor has an a too, and the exponents add.') },
        { id: 'c', label: '28a⁵b', tag: 'Z3', hint: L("Bitta minus toq, ishora qoladi.", 'Один минус это нечётно, знак остаётся.', 'One minus is odd, the sign stays.') },
        { id: 'd', label: '−28a⁴b⁴', tag: 'Z4', hint: L("b faqat bitta ko'paytuvchida bor va u bittaligicha qoladi.", 'b есть только в одном множителе и остаётся в одном экземпляре.', 'b appears in one factor only and stays single.') },
      ],
    },
    {
      prompt: '2(2x − 5)',
      ok: L("Son ham qavsdagi har hadga tarqaladi.", 'Число тоже расходится на каждый член скобки.', 'A number spreads to every term of the bracket too.'),
      items: [
        { id: 'a', label: '4x − 10', correct: true },
        { id: 'b', label: '4x − 5', tag: 'Z1', hint: L("Beshlik ham ikkiga ko'paytiriladi.", 'Пятёрка тоже умножается на два.', 'The five is multiplied by two as well.') },
        { id: 'c', label: '4x + 10', tag: 'Z3', hint: L("Qavs ichida ayirish turgan edi.", 'Внутри скобки было вычитание.', 'Inside the bracket there was a subtraction.') },
        { id: 'd', label: '−6x', tag: 'Z5', hint: L("Ikki x va beshlik o'xshash hadlar emas.", 'Два x и пятёрка не подобные члены.', 'Two x and five are not like terms.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ikkitasi o'tgan blokdan, bittasi esa birinchi blokdan.", 'Три коротких вопроса. Два из прошлого блока, один из первого.', 'Three short questions. Two from the last block, one from the first.'),
    A('1', "Ikkinchisida ishora bor.", 'Во втором есть знак.', 'The second has a sign.'),
    A('2', "Oxirgisi qavs haqida.", 'Последний про скобку.', 'The last is about the bracket.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. TO'RTBURCHAK. Ikki katak -- ikki ko'paytma.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Har katak bitta ko\'paytma', 'Каждая клетка это одно произведение', 'Each cell is one product'),
  caption: L(
    "Katakni bosing: unda qaysi ikki narsa ko'paytirilishi ko'rinadi.",
    'Нажми на клетку: в ней видно, что на что умножается.',
    'Tap a cell: it shows which two things get multiplied.',
  ),
  left: ['3a'],
  top: ['2a', '+5'],
  options: [
    { id: 'a', label: '6a² + 15a' },
    { id: 'b', label: '6a² + 5' },
    { id: 'c', label: '6a² + 15' },
    { id: 'd', label: '5a² + 15a' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikkinchi katakda ham ko'paytma turibdi, beshlik o'zgarmay qolmaydi.", 'Во второй клетке тоже произведение, пятёрка не остаётся как была.', 'The second cell holds a product too, the five does not stay as it was.') },
    { key: 'c', tag: 'Z4', hint: L("Uch a karra besh da a yo'qolmaydi.", 'В три a на пять буква a не исчезает.', 'In three a times five the letter a does not vanish.') },
    { key: 'd', tag: 'Z6', hint: L("Birinchi katakda uch karra ikki, ya'ni olti.", 'В первой клетке три на два, то есть шесть.', 'In the first cell three times two, that is six.') },
  ],
  note: L(
    "Kataklar soni qavsdagi hadlar soniga teng.",
    'Число клеток равно числу членов в скобке.',
    'The number of cells equals the number of terms in the bracket.',
  ),
  audio: [
    A('mount', "Ko'paytmani to'rtburchak bilan ko'rsatamiz. Chapda ko'paytuvchi, yuqorida qavsning hadlari.", 'Произведение покажем прямоугольником. Слева множитель, сверху члены скобки.', 'We show the product as a rectangle. The factor on the left, the bracket terms on top.'),
    A('mount', "Kataklar soni hadlar soniga teng. Har katakni bosib ko'ring.", 'Число клеток равно числу членов. Нажми на каждую клетку.', 'The number of cells equals the number of terms. Tap each cell.'),
    A('cell-all', "Ikki katak ochildi. Endi har ko'paytmani hisoblang.", 'Две клетки открыты. Теперь посчитай каждое произведение.', 'Both cells are open. Now work out each product.'),
  ],
}

// ============================================================
// 4. FARQLASH. Ko'paytuvchi MANFIY: ikkala katak ham ishorani oladi.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Manfiy ko\'paytuvchi', 'Отрицательный множитель', 'A negative factor'),
  caption: L(
    "Endi chapdagi ko'paytuvchi manfiy. Ikkala katakni ham bosing.",
    'Теперь множитель слева отрицательный. Нажми на обе клетки.',
    'Now the factor on the left is negative. Tap both cells.',
  ),
  left: ['−2a⁴'],
  top: ['14ab', '+2,5b'],
  options: [
    { id: 'a', label: '−28a⁵b − 5a⁴b' },
    { id: 'b', label: '−28a⁵b + 5a⁴b' },
    { id: 'c', label: '28a⁵b + 5a⁴b' },
    { id: 'd', label: '−28a⁵b − 5b' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Ikkinchi katakda ham manfiy ko'paytuvchi turibdi, ya'ni natija manfiy.", 'Во второй клетке тоже отрицательный множитель, значит результат отрицательный.', 'The second cell also has the negative factor, so the result is negative.') },
    { key: 'c', tag: 'Z3', hint: L("Birinchi katakda bitta minus bor, u yo'qolmaydi.", 'В первой клетке один минус, он не исчезает.', 'The first cell has one minus, and it does not vanish.') },
    { key: 'd', tag: 'Z4', hint: L("Ikkinchi katakda a to'rtinchi daraja ham bor.", 'Во второй клетке есть и a в четвёртой.', 'The second cell has a to the fourth as well.') },
  ],
  note: L(
    "Ko'paytuvchining ishorasi HAR katakka boradi.",
    'Знак множителя доходит до КАЖДОЙ клетки.',
    'The sign of the factor reaches EVERY cell.',
  ),
  audio: [
    A('mount', "O'sha to'rtburchak, lekin chapdagi ko'paytuvchi manfiy.", 'Тот же прямоугольник, но множитель слева отрицательный.', 'The same rectangle, but the factor on the left is negative.'),
    A('mount', "Ikkala katakni ham bosing va ishoralarga qarang.", 'Нажми на обе клетки и смотри на знаки.', 'Tap both cells and watch the signs.'),
    A('cell-all', "Ikkala katakda ham manfiy ko'paytuvchi turibdi.", 'В обеих клетках стоит отрицательный множитель.', 'Both cells hold the negative factor.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Uch hadli qavs va HARFLI ko'paytuvchi:
// javobni o'quvchi yig'adi, asbob yo'q.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Uch had, harfli ko\'paytuvchi', 'Три члена и буквенный множитель', 'Three terms and a letter factor'),
  lines: ['ab²(ab − bc + 2a)  =  ab² · ab − ab² · bc + ab² · 2a'],
  template: ['=  ', { slot: 0 }, ' − ', { slot: 1 }, ' + ', { slot: 2 }],
  parts: [
    { id: 'a', label: 'a²b³' },
    { id: 'b', label: 'ab³c' },
    { id: 'c', label: '2a²b²' },
    { id: 'd', label: 'a²b²' },
    { id: 'e', label: '2a³b²' },
  ],
  answer: ['a', 'b', 'c'],
  prompt: L(
    "Uchta ko'paytma yozilgan. Har birini hisoblab, javobni yig'ing.",
    'Три произведения выписаны. Посчитай каждое и собери ответ.',
    'The three products are written out. Work each one out and build the answer.',
  ),
  checkNote: L(
    "Har katakda a ning ko'rsatkichlari va b ning ko'rsatkichlari alohida qo'shildi.",
    'В каждой клетке показатели a и показатели b сложились отдельно.',
    'In each cell the a exponents and the b exponents added separately.',
  ),
  wrongs: [
    { key: 'd', tag: 'Z4', hint: L("Birinchi ko'paytmada b ikki marta va yana bir marta keladi, ya'ni uchta.", 'В первом произведении b встречается дважды и ещё раз, значит трижды.', 'In the first product b appears twice and once more, so three times.') },
    { key: 'e', tag: 'Z4', hint: L("Uchinchi ko'paytmada a ikkita: bittasi ko'paytuvchidan, bittasi qavsdan.", 'В третьем произведении a две: одна из множителя, одна из скобки.', 'In the third product there are two a: one from the factor, one from the bracket.') },
    { key: '*', tag: 'Z4', hint: L("Har harfni alohida sanang.", 'Считай каждую букву отдельно.', 'Count each letter separately.') },
  ],
  audio: [
    A('mount', "Endi qavsda uch had, ko'paytuvchi esa harfli.", 'Теперь в скобке три члена, а множитель буквенный.', 'Now the bracket has three terms and the factor has letters.'),
    A('mount', "Uchta ko'paytma allaqachon yozilgan. Ularni hisoblash qoldi.", 'Три произведения уже выписаны. Осталось их посчитать.', 'The three products are already written out. What is left is to work them out.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Uch katak, manfiy ko'paytuvchi, qavsda ham minus.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Uch katak va ikki minus', 'Три клетки и два минуса', 'Three cells and two minuses'),
  caption: L(
    "Uchta katak bor. Hammasini bosib, keyin javobni tanlang.",
    'Клеток три. Нажми на все, потом выбери ответ.',
    'There are three cells. Tap them all, then pick the answer.',
  ),
  left: ['−3x²y'],
  top: ['2x', '−4y', '+5'],
  cols: 2,
  options: [
    { id: 'a', label: '−6x³y + 12x²y² − 15x²y' },
    { id: 'b', label: '−6x³y − 12x²y² − 15x²y' },
    { id: 'c', label: '−6x³y + 12x²y² + 15x²y' },
    { id: 'd', label: '−6x³y + 12xy² − 15x²y' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Ikkinchi katakda ikki minus bor, ular birga musbat beradi.", 'Во второй клетке два минуса, вместе они дают плюс.', 'The second cell has two minuses, and together they give a plus.') },
    { key: 'c', tag: 'Z3', hint: L("Uchinchi katakda faqat bitta minus bor.", 'В третьей клетке минус только один.', 'The third cell has just one minus.') },
    { key: 'd', tag: 'Z4', hint: L("Ikkinchi katakda x ning ko'rsatkichi o'zgarmaydi: qavsdagi hadda x yo'q.", 'Во второй клетке показатель x не меняется: в члене скобки x нет.', 'In the second cell the x exponent does not change: the bracket term has no x.') },
  ],
  note: L(
    "Uch had -- uch katak, va har katakda o'z ishorasi.",
    'Три члена это три клетки, и в каждой свой знак.',
    'Three terms means three cells, each with its own sign.',
  ),
  audio: [
    A('mount', "Bu safar qavsda uch had, va ikkinchisi manfiy.", 'На этот раз в скобке три члена, и второй отрицательный.', 'This time the bracket has three terms, and the second is negative.'),
    A('mount', "Ko'paytuvchi ham manfiy. Ikkinchi katakda nima bo'ladi.", 'Множитель тоже отрицательный. Что будет во второй клетке.', 'The factor is negative too. What happens in the second cell.'),
    A('cell-all', "Uch katak ochildi.", 'Три клетки открыты.', 'All three cells are open.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: qavsni ochish QIYMATNI
// o'zgartirmaydi. Ya'ni qoida ayniyat (4-darsga bog'lanish).
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Qavs ochildi, qiymat o\'zgardimi', 'Скобку раскрыли, значение изменилось?', 'The bracket is opened, did the value change?'),
  letter: 'a',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '3a(2a + 5)', sub: (n) => '3 · ' + n + ' · (2 · ' + n + ' + 5)', val: (n) => 3 * n * (2 * n + 5) },
    { id: 'r2', expr: '6a² + 15a', sub: (n) => '6 · ' + n + '² + 15 · ' + n, val: (n) => 6 * n * n + 15 * n },
  ],
  probe: {
    question: L(
      "Uch sonda ham ikki qator bir xil son berdi. Bu nima degani?",
      'При всех трёх числах строки дали одно и то же. Что это значит?',
      'At all three numbers the rows gave the same value. What does that mean?',
    ),
    items: [
      { id: 'ident', correct: true, label: L("Qavsni ochish qiymatni o'zgartirmaydi", 'Раскрытие скобки не меняет значение', 'Opening the bracket does not change the value') },
      { id: 'luck', tag: 'Z1', label: L('Tasodif', 'Совпадение', 'A coincidence'), hint: L("Uch xil son sinaldi va uchtasida ham mos keldi.", 'Проверили три разных числа, и совпало при всех трёх.', 'Three different numbers were tried, and it matched at all three.') },
      { id: 'pos', tag: 'Z1', label: L('Faqat musbat sonlarda', 'Только при положительных', 'Only at positive numbers'), hint: L("Qoida sonning ishorasiga bog'liq emas, u xossadan chiqadi.", 'Правило не зависит от знака числа, оно следует из свойства.', 'The rule does not depend on the sign, it follows from a property.') },
      { id: 'eq', tag: 'Z1', label: L('Bu tenglama', 'Это уравнение', 'That is an equation'), hint: L("Tenglama faqat ba'zi sonlarda bajariladi, bu esa uchtasida ham bajarildi.", 'Уравнение выполняется лишь при некоторых числах, а это выполнилось при всех трёх.', 'An equation holds only at some numbers, and this held at all three.') },
    ],
  },
  okText: L(
    "Ya'ni qavsni ochish qoidasi AYNIYAT: u har qanday qiymatda bajariladi.",
    'То есть правило раскрытия скобки это ТОЖДЕСТВО: оно верно при любом значении.',
    'So the rule for opening a bracket is an IDENTITY: it holds for every value.',
  ),
  audio: [
    A('mount', "Yuqorida qavsli yozuv, pastda qavs ochilgan yozuv.", 'Сверху запись со скобкой, снизу запись с раскрытой скобкой.', 'Above the record with a bracket, below the opened one.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("ko'phadning har bir hadini", 'каждый член многочлена', 'each term of the polynomial') },
    { id: 'f2', label: L("shu bir hadga ko'paytiramiz", 'умножаем на этот одночлен', 'we multiply by that monomial') },
    { id: 'f3', label: L("hosil bo'lgan ko'paytmalarni qo'shamiz", 'полученные произведения складываем', 'and add the products we got') },
    { id: 'f4', label: L("natijada yana ko'phad chiqadi", 'в результате снова получается многочлен', 'the result is a polynomial again') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval hadlar, keyin ko'paytirish, keyin qo'shish, oxirida natija.",
    'Порядок нарушен. Сначала члены, потом умножение, потом сложение, в конце результат.',
    'The order is off. Terms first, then multiplication, then addition, and the result last.',
  ),
  lawChips: [
    { label: '( )', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '+', tone: 's1' },
    { label: '1 2 3', tone: 'off' },
  ],
  lawSweep: L(
    "qavs, ko'paytirish, qo'shish, kataklar soni",
    'скобка, умножение, сложение, число клеток',
    'bracket, multiplication, addition, cell count',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ko'phadni bir hadga ko'paytirish uchun ko'phadning har bir hadini shu bir hadga ko'paytirish va hosil bo'lgan ko'paytmalarni qo'shish kerak.",
        'Чтобы умножить многочлен на одночлен, нужно каждый член многочлена умножить на этот одночлен и полученные произведения сложить.',
        'To multiply a polynomial by a monomial, multiply every term of the polynomial by that monomial and add the products.',
      ),
      L(
        "Natijada yana ko'phad hosil bo'ladi, va uning hadlari soni qavsdagi hadlar soniga teng bo'ladi.",
        'В результате снова получается многочлен, и число его членов равно числу членов в скобке.',
        'The result is a polynomial again, and it has as many terms as the bracket had.',
      ),
    ],
  },
  hookCap: L(
    "Kataklar soni -- qavsdagi hadlar soni",
    'Число клеток это число членов в скобке',
    'The cell count is the term count in the bracket',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("har hadga", 'к каждому члену', 'to every term'),
    L("ishora ham boradi", 'знак тоже доходит', 'the sign travels too'),
    L("ko'rsatkichlar qo'shiladi", 'показатели складываются', 'the exponents add'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило.', 'We have seen all the cases. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda shu qoida ikki qavsga ishlaydi.", 'Верно. На следующем уроке это правило заработает для двух скобок.', 'Correct. Next lesson this rule works for two brackets.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI. To'rt yozuv, biri qavsdan KEYIN turgan
// ko'paytuvchi bilan.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      prompt: '−4x(5x − 7y)',
      ok: L("Ikki katak, ikkinchisida ikki minus.", 'Две клетки, во второй два минуса.', 'Two cells, and the second has two minuses.'),
      items: [
        { id: 'a', label: '−20x² + 28xy', correct: true },
        { id: 'b', label: '−20x² − 28xy', tag: 'Z3', hint: L("Ikkinchi katakda minus to'rt karra minus yetti, ya'ni musbat.", 'Во второй клетке минус четыре на минус семь, значит плюс.', 'In the second cell minus four times minus seven, so a plus.') },
        { id: 'c', label: '−20x² + 28y', tag: 'Z4', hint: L("Ikkinchi katakda x ham bor.", 'Во второй клетке есть и x.', 'The second cell has an x too.') },
        { id: 'd', label: '−20x − 28xy', tag: 'Z4', hint: L("Birinchi katakda x ikkita.", 'В первой клетке две x.', 'The first cell has two x.') },
      ],
    },
    {
      prompt: '(6a − 7b) 8c',
      ok: L("Ko'paytuvchi qavsdan KEYIN turgan bo'lsa ham, u har hadga boradi.", 'Даже если множитель стоит ПОСЛЕ скобки, он доходит до каждого члена.', 'Even when the factor stands AFTER the bracket, it reaches every term.'),
      items: [
        { id: 'a', label: '48ac − 56bc', correct: true },
        { id: 'b', label: '48ac − 7b', tag: 'Z1', hint: L("Ko'paytuvchi ikkinchi hadga ham boradi.", 'Множитель доходит и до второго члена.', 'The factor reaches the second term too.') },
        { id: 'c', label: '48ac + 56bc', tag: 'Z3', hint: L("Qavsda ayirish turgan edi.", 'В скобке было вычитание.', 'The bracket had a subtraction.') },
        { id: 'd', label: '48abc − 56abc', tag: 'Z4', hint: L("Birinchi hadda b yo'q, ikkinchisida a yo'q.", 'В первом члене нет b, во втором нет a.', 'The first term has no b, the second has no a.') },
      ],
    },
    {
      prompt: '(x⁷ − x⁶ + x⁴)x³',
      ok: L("Har katakda ko'rsatkichlar qo'shildi.", 'В каждой клетке показатели сложились.', 'In each cell the exponents added.'),
      items: [
        { id: 'a', label: 'x¹⁰ − x⁹ + x⁷', correct: true },
        { id: 'b', label: 'x²¹ − x¹⁸ + x¹²', tag: 'Z4', hint: L("Ko'paytirishda ko'rsatkichlar qo'shiladi, ko'paytirilmaydi.", 'При умножении показатели складываются, а не умножаются.', 'When multiplying, exponents add, they do not multiply.') },
        { id: 'c', label: 'x¹⁰ − x⁶ + x⁴', tag: 'Z1', hint: L("Ikkinchi va uchinchi hadlar ham x kubga ko'paytiriladi.", 'Второй и третий члены тоже умножаются на x в кубе.', 'The second and third terms are multiplied by x cubed too.') },
        { id: 'd', label: 'x¹⁰ − x⁹ − x⁷', tag: 'Z3', hint: L("Uchinchi had oldida qo'shuv turgan edi.", 'Перед третьим членом было сложение.', 'The third term had a plus before it.') },
      ],
    },
    {
      prompt: '7xy(x + y − 3xy)',
      ok: L("Uch katak, uchinchisida ikki harf ham bor.", 'Три клетки, и в третьей есть обе буквы.', 'Three cells, and the third has both letters.'),
      items: [
        { id: 'a', label: '7x²y + 7xy² − 21x²y²', correct: true },
        { id: 'b', label: '7x²y + 7xy² − 21xy', tag: 'Z4', hint: L("Uchinchi katakda x ikkita va y ikkita bo'ladi.", 'В третьей клетке будет две x и две y.', 'The third cell will have two x and two y.') },
        { id: 'c', label: '7x²y + 7xy² + 21x²y²', tag: 'Z3', hint: L("Uchinchi had manfiy edi.", 'Третий член был отрицательным.', 'The third term was negative.') },
        { id: 'd', label: '7x²y² + 7x²y² − 21x²y²', tag: 'Z4', hint: L("Birinchi katakda faqat bitta y bor, ikkinchisida faqat bitta x.", 'В первой клетке только одна y, во второй только одна x.', 'The first cell has just one y, the second just one x.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt yozuv. Ikkinchisida ko'paytuvchi qavsdan KEYIN turibdi.", 'Четыре записи. Во второй множитель стоит ПОСЛЕ скобки.', 'Four records. In the second the factor stands AFTER the bracket.'),
    A('1', "Ikkinchisiga diqqat: ko'paytuvchi o'ngda.", 'Внимание на второй: множитель справа.', 'Watch the second: the factor is on the right.'),
    A('2', "Uchinchisi ko'rsatkichlar haqida.", 'Третий про показатели.', 'The third is about exponents.'),
    A('3', "Oxirgisida uch katak.", 'В последнем три клетки.', 'The last one has three cells.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: avval ko'paytmalar, keyin daraja.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Katta ko\'rsatkichlar', 'Большие показатели', 'Big exponents'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['ab³(a³b − a⁴b⁵ + a⁷b¹¹)  =  ', { slot: 0 }, ' − ', { slot: 1 }, ' + a⁸b¹⁴'],
  parts: [
    { id: 'a', label: 'a⁴b⁴' },
    { id: 'b', label: 'a⁵b⁸' },
    { id: 'c', label: 'a³b³' },
    { id: 'd', label: 'a⁴b¹⁵' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Birinchi ikki katakni yozing. Uchinchisi allaqachon yozilgan.",
    'Запиши первые две клетки. Третья уже записана.',
    'Write the first two cells. The third is already written.',
  ),
  checkNote: L(
    "Har katakda a ning ko'rsatkichlari va b ning ko'rsatkichlari alohida qo'shildi.",
    'В каждой клетке показатели a и показатели b сложились отдельно.',
    'In each cell the a exponents and the b exponents added separately.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Birinchi katakda a uchta va yana bitta, ya'ni to'rtta.", 'В первой клетке a три и ещё одна, значит четыре.', 'In the first cell a is three and one more, so four.') },
    { key: 'd', tag: 'Z4', hint: L("Ikkinchi katakda b beshta va yana uchta, ya'ni sakkizta.", 'Во второй клетке b пять и ещё три, значит восемь.', 'In the second cell b is five and three more, so eight.') },
    { key: '*', tag: 'Z4', hint: L("Ko'rsatkichlar qo'shiladi, har harf alohida sanaladi.", 'Показатели складываются, каждая буква считается отдельно.', 'The exponents add, and each letter is counted separately.') },
  ],
  probe: {
    question: L("Birinchi hadning darajasi nechchi?", 'Какова степень первого члена?', 'What is the degree of the first term?'),
    items: [
      { id: 'a', correct: true, label: '8' },
      { id: 'b', tag: 'Z4', label: '4', hint: L("Daraja bu ikkala harf ko'rsatkichining yig'indisi.", 'Степень это сумма показателей обеих букв.', 'The degree is the sum of both letter exponents.') },
      { id: 'c', tag: 'Z4', label: '16', hint: L("Ko'rsatkichlar qo'shiladi, ko'paytirilmaydi.", 'Показатели складываются, а не умножаются.', 'The exponents add, they do not multiply.') },
      { id: 'd', tag: 'Z4', label: '7', hint: L("To'rt va to'rt sakkiz beradi.", 'Четыре и четыре дают восемь.', 'Four and four give eight.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval kataklar, keyin daraja.", 'Два шага. Сначала клетки, потом степень.', 'Two steps. The cells first, then the degree.'),
    A('mount', "Ko'rsatkichlar katta, lekin ish o'sha: har harfni alohida sanash.", 'Показатели большие, но работа та же: считать каждую букву отдельно.', 'The exponents are big, but the job is the same: count each letter separately.'),
    A('two', "Endi ikkinchi qadam: darajani toping.", 'Теперь второй шаг: найди степень.', 'Now the second step: find the degree.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Asbob yo'q: ikki minus va uch had.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('To\'rtburchaksiz', 'Без прямоугольника', 'Without the rectangle'),
  template: ['−2ab³(−3a⁷b⁶ + 8a⁵b² − 9a⁴b¹¹)  =  ', { slot: 0 }, ' − 16a⁶b⁵ + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '6a⁸b⁹' },
    { id: 'b', label: '18a⁵b¹⁴' },
    { id: 'c', label: '−6a⁸b⁹' },
    { id: 'd', label: '18a⁵b¹³' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Birinchi va uchinchi katakni yozing. Ikkinchisi yozilgan.",
    'Запиши первую и третью клетки. Вторая записана.',
    'Write the first and the third cell. The second is written.',
  ),
  checkNote: L(
    "Birinchi va uchinchi katakda ikki minus bor, ya'ni ikkalasi ham musbat chiqdi.",
    'В первой и третьей клетке по два минуса, значит обе вышли положительными.',
    'The first and third cells each have two minuses, so both came out positive.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Minus ikki karra minus uch musbat olti beradi.", 'Минус два на минус три даёт плюс шесть.', 'Minus two times minus three gives plus six.') },
    { key: 'd', tag: 'Z4', hint: L("Uchinchi katakda b uchta va yana o'n bitta.", 'В третьей клетке b три и ещё одиннадцать.', 'In the third cell b is three and eleven more.') },
    { key: '*', tag: 'Z3', hint: L("Ko'paytuvchi manfiy, shuning uchun har katakda ishora almashadi.", 'Множитель отрицательный, поэтому в каждой клетке знак меняется.', 'The factor is negative, so the sign flips in every cell.') },
  ],
  audio: [
    A('mount', "Bu safar to'rtburchak yo'q. Uch katak, ko'paytuvchi manfiy.", 'На этот раз прямоугольника нет. Три клетки, множитель отрицательный.', 'This time there is no rectangle. Three cells, and the factor is negative.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Uch qadam ham to'g'ri, lekin UCHINCHI KO'PAYTMA
// umuman yozilmagan -- blokning asosiy xatosi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Hisoblangan ko'paytmalar to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Посчитанные произведения верны. И всё же какая строка ошибочна?',
    'The products worked out are right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '2x(3x − 5 + y)' },
    { id: 'r2', text: '2x · 3x = 6x²' },
    { id: 'r3', text: '2x · (−5) = −10x' },
    { id: 'r4', text: L('javob: 6x² − 10x', 'ответ: 6x² − 10x', 'answer: 6x² − 10x') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: ikki karra uch olti, x ikkita.", 'Верно: два на три шесть, x две.', 'Right: two times three is six, and there are two x.'),
    r3: L("To'g'ri: ikki karra minus besh minus o'n.", 'Верно: два на минус пять это минус десять.', 'Right: two times minus five is minus ten.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r3: 'Z2' },
  proofFill: {
    // AJRATGICH SO'ZSIZ: shablon tarjima qilinmaydi, va «javob» so'zi ruscha
    // versiyada ham o'zbekcha bo'lib qolardi.
    template: ['2x · y  =  ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: '2xy' },
      { id: 'b', label: '6x² − 10x + 2xy' },
      { id: 'c', label: '2x + y' },
      { id: 'd', label: '6x² − 10x' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Tushib qolgan ko'paytmani yozing va javobni to'ldiring.",
      'Запиши пропущенное произведение и дострой ответ.',
      'Write the missing product and complete the answer.',
    ),
    checkNote: L(
      "Qavsda uch had bor edi, ya'ni uch katak. Uchinchisi yozilmagan.",
      'В скобке было три члена, значит три клетки. Третья не была записана.',
      'The bracket had three terms, so three cells. The third was never written.',
    ),
    wrongs: [
      { key: 'c|d', tag: 'Z2', hint: L("Uchinchi katakda ko'paytma turadi, qo'shuv emas. Va javobda u ham bo'lishi kerak.", 'В третьей клетке произведение, а не сумма. И в ответе оно тоже должно быть.', 'The third cell holds a product, not a sum. And the answer must include it.') },
      { key: '*', tag: 'Z2', hint: L("Kataklar soni qavsdagi hadlar soniga teng.", 'Число клеток равно числу членов в скобке.', 'The cell count equals the term count in the bracket.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda hisoblangan ko'paytmalar to'g'ri.", 'В этой ловушке посчитанные произведения верны.', 'In this trap the products worked out are right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Qaysi qatorda xato.", 'И всё же ответ неверен. В какой строке ошибка.', 'And yet the answer is wrong. Which line has the mistake.'),
    A('proof', "Topdingiz. Uchinchi ko'paytma umuman yozilmagan.", 'Нашёл. Третье произведение вообще не было записано.', 'You found it. The third product was never written at all.'),
    A('done', "Qavsda uch had bor edi, demak uch katak kerak.", 'В скобке было три члена, значит нужно три клетки.', 'The bracket had three terms, so three cells are needed.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TESKARI YO'L: ko'paytma berilgan, qavs izlanadi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('Qavsni tiklash', 'Восстановить скобку', 'Restoring the bracket'),
  given: L(
    "Ko'paytma berilgan, ko'paytuvchi ham ma'lum. Qavsda nima turgan edi?",
    'Дано произведение, множитель тоже известен. Что стояло в скобке?',
    'The product is given and the factor is known. What was in the bracket?',
  ),
  template: ['12a² − 18a  =  6a (', { slot: 0 }, ' − ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '2a' },
    { id: 'b', label: '3' },
    { id: 'c', label: '2' },
    { id: 'd', label: '3a' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Har katakni olti a ga bo'lib ko'ring.",
    'Раздели каждую клетку на шесть a.',
    'Divide each cell by six a.',
  ),
  checkNote: L(
    "Olti a karra ikki a o'n ikki a kvadrat, olti a karra uch esa o'n sakkiz a.",
    'Шесть a на два a это двенадцать a в квадрате, а шесть a на три восемнадцать a.',
    'Six a times two a is twelve a squared, and six a times three is eighteen a.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Olti a karra ikki faqat o'n ikki a beradi, a kvadrat chiqmaydi.", 'Шесть a на два даёт только двенадцать a, без квадрата.', 'Six a times two gives only twelve a, with no square.') },
    { key: 'd', tag: 'Z4', hint: L("Olti a karra uch a o'n sakkiz a kvadrat bo'lardi.", 'Шесть a на три a было бы восемнадцать a в квадрате.', 'Six a times three a would be eighteen a squared.') },
    { key: '*', tag: 'Z4', hint: L("Har katakni ko'paytuvchiga bo'lish kerak.", 'Каждую клетку нужно разделить на множитель.', 'Each cell must be divided by the factor.') },
  ],
  audio: [
    A('mount', "Bu safar teskari yo'l: ko'paytma bor, qavs esa yo'q.", 'На этот раз обратный путь: произведение есть, а скобки нет.', 'This time the inverse path: the product is there, the bracket is not.'),
    A('mount', "Har katakni ko'paytuvchiga bo'lib ko'ring.", 'Раздели каждую клетку на множитель.', 'Divide each cell by the factor.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  items: [
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '3a(2a + 5)',
      ok: L("Ikki katak, ikkalasi ham hisoblandi.", 'Две клетки, обе посчитаны.', 'Two cells, both worked out.'),
      items: [
        { id: 'a', label: '6a² + 15a', correct: true },
        { id: 'b', label: '6a² + 5', tag: 'Z1', hint: L("Ikkinchi katak ham ko'paytma.", 'Вторая клетка тоже произведение.', 'The second cell is a product too.') },
        { id: 'c', label: '6a² + 15', tag: 'Z4', hint: L("Uch a karra besh da a qoladi.", 'В три a на пять буква a остаётся.', 'In three a times five the a stays.') },
        { id: 'd', label: '5a² + 15a', tag: 'Z6', hint: L("Uch karra ikki olti.", 'Три на два шесть.', 'Three times two is six.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '−2a⁴(14ab + 2,5b)',
      ok: L("Ishora ikkala katakka ham bordi.", 'Знак дошёл до обеих клеток.', 'The sign reached both cells.'),
      items: [
        { id: 'a', label: '−28a⁵b − 5a⁴b', correct: true },
        { id: 'b', label: '−28a⁵b + 5a⁴b', tag: 'Z3', hint: L("Ikkinchi katakda ham manfiy ko'paytuvchi.", 'Во второй клетке тоже отрицательный множитель.', 'The second cell also has the negative factor.') },
        { id: 'c', label: '−28a⁴b − 5a⁴b', tag: 'Z4', hint: L("Birinchi katakda a beshta.", 'В первой клетке a пять.', 'In the first cell a is five.') },
        { id: 'd', label: '−28a⁵b − 5b', tag: 'Z4', hint: L("Ikkinchi katakda a to'rtinchi daraja ham bor.", 'Во второй клетке есть и a в четвёртой.', 'The second cell has a to the fourth as well.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("2x(3x − 5 + y) da nechta ko'paytma bor?", 'Сколько произведений в 2x(3x − 5 + y)?', 'How many products are in 2x(3x − 5 + y)?'),
      ok: L("Qavsda uch had, ya'ni uch ko'paytma.", 'В скобке три члена, значит три произведения.', 'The bracket has three terms, so three products.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', tag: 'Z2', hint: L("Qavsdagi hadlarni sanang: x li, son va y.", 'Посчитай члены в скобке: с x, число и y.', 'Count the terms in the bracket: the x one, the number and the y.') },
        { id: 'c', label: '4', tag: 'Z5', hint: L("Qo'shuv va ayirish belgilari had emas.", 'Знаки сложения и вычитания это не члены.', 'The plus and minus signs are not terms.') },
        { id: 'd', label: '1', tag: 'Z1', hint: L("Ko'paytuvchi har hadga boradi.", 'Множитель доходит до каждого члена.', 'The factor reaches every term.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '(x⁷ − x⁶ + x⁴)x³',
      ok: L("Ko'rsatkichlar qo'shildi, ko'paytuvchi o'ngda turgan bo'lsa ham.", 'Показатели сложились, хотя множитель стоял справа.', 'The exponents added, even though the factor stood on the right.'),
      items: [
        { id: 'a', label: 'x¹⁰ − x⁹ + x⁷', correct: true },
        { id: 'b', label: 'x²¹ − x¹⁸ + x¹²', tag: 'Z4', hint: L("Ko'rsatkichlar qo'shiladi.", 'Показатели складываются.', 'The exponents add.') },
        { id: 'c', label: 'x¹⁰ − x⁶ + x⁴', tag: 'Z1', hint: L("Ko'paytuvchi hamma hadga boradi.", 'Множитель доходит до всех членов.', 'The factor reaches all the terms.') },
        { id: 'd', label: 'x¹⁰ − x⁹ − x⁷', tag: 'Z3', hint: L("Uchinchi had oldida qo'shuv edi.", 'Перед третьим членом было сложение.', 'The third term had a plus before it.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi ishora haqida.", 'Второй про знак.', 'The second is about the sign.'),
    A('2', "Uchinchisi kataklar soni haqida.", 'Третий про число клеток.', 'The third is about the cell count.'),
    A('3', "Oxirgisida ko'paytuvchi o'ngda.", 'В последнем множитель справа.', 'In the last one the factor is on the right.'),
  ],
}

// ============================================================
// 15. YAKUN. Yangi matematika yo'q (§4.2): xuk sahnasi tuzatiladi.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Kataklar soni yashirmaydi', 'Число клеток не спрячешь', 'The cell count hides nothing'),
  gate: S1.gate,
  fix: {
    tokens: ['6a²', '+', '15a'],
    value: '2',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Qavsda ikki had bor edi, ya'ni ikki katak va ikki ko'paytma. Beshlik ham uch a ga ko'paytiriladi.",
    'В скобке было два члена, значит две клетки и два произведения. Пятёрка тоже умножается на три a.',
    'The bracket had two terms, so two cells and two products. The five is multiplied by three a as well.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    both: L('ikkita ko\'paytma', 'два произведения', 'two products'),
    first: L('bitta ko\'paytma', 'одно произведение', 'one product'),
    three: L('uchta ko\'paytma', 'три произведения', 'three products'),
    none: L("avval qavs ichi", 'сначала внутри скобки', 'the bracket first'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['3a(2a + 5) → 2', '−2a⁴(14ab + 2,5b) → 2', '−3x²y(2x − 4y + 5) → 3', '12a² − 18a = 6a(2a − 3)'],
  twoLabel: L('B4 bloki davom etadi', 'Блок Б4 продолжается', 'Block B4 continues'),
  twoA: L("kataklar  →  qavsdagi hadlar", 'клетки  →  члены скобки', 'cells  →  bracket terms'),
  twoB: L("ishora  →  har katakka", 'знак  →  в каждую клетку', 'the sign  →  into every cell'),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "ikki qavsni ko'paytirish",
    'умножение двух скобок',
    'multiplying two brackets',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta narsadan chiqdi: kataklar soni qavsdagi hadlar soniga teng.", 'Вся сегодняшняя работа вышла из одного: число клеток равно числу членов в скобке.', 'All of today came from one thing: the cell count equals the term count in the bracket.'),
    A('mount', "Keyingi darsda ikki qavs ko'paytiriladi va kataklar to'rtta bo'ladi.", 'На следующем уроке умножаются две скобки, и клеток станет четыре.', 'Next lesson two brackets are multiplied, and there will be four cells.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
