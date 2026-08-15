// ============================================================================
// 11-sinf, Dars 09. KO'RSATKICHLI TENGLAMALAR.  (Показательные уравнения)
//
// B2 blokining BIRINCHI darsi. Bu faylda FAQAT MA'LUMOT: qaysi tenglama,
// qaysi variantlar, qaysi razbor, qaysi ovoz. Ekran tanasi `screens.jsx` da,
// mexanika `tools.jsx` da, infratuzilma `core.jsx` da.
//   raskadrovka: src/books/grade11/DARS09_SKELET.md (redaksiya 2)
//   kontent:     src/books/grade11/DARS09_CONTENT.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// 12-darsdan farqi BITTA ekran (9-rol: belgi emas, ASOS qo'yiladi) -- ya'ni
// 10% chegarasida. Rollar va tartib aynan etalondagidek.
//
// Darsning O'ZAGI: javob endi ORALIQ emas, SON. Va yil bo'yi eng qimmat
// tuzoq -- almashtirishning MANFIY ildizi -- birinchi ekrandayoq turadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_09',
  title: L('Ko\'rsatkichli tenglamalar', 'Показательные уравнения', 'Exponential equations'),
}

// B2 bloki 9-14 darslar, bu birinchisi. Shapkadagi «9-dars / Урок 9» ham
// shu sondan olinadi.
const BLOCK = { label: 'B2', from: 9, to: 14, current: 9 }

// Xuk va tekshirish o'qi: ikkala da'vogar javob shu yerda ko'rinadi.
const AXIS_H = { min: -4, max: 6, ticks: [{ v: -1 }, { v: 0 }, { v: 2 }] }
const AXIS_B = { min: 0, max: 6, ticks: [{ v: 3 }] }

const EQ_HOOK = '9ˣ − 6·3ˣ − 27 = 0'
const EQ_BASE = '6ˣ⁺⁷ = 36³ˣ'
const EQ_SUB = '4ˣ − 2ˣ − 2 = 0'

// ============================================================
// SLAYD 1. XUK. Ikki javob: bittasida ortiqcha ildiz bor.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Ko\'rsatkichli tenglamalar', 'Показательные уравнения', 'Exponential equations'),
  title: L('Bitta ildizmi yoki ikkita?', 'Один корень или два?', 'One root or two?'),
  expr: EQ_HOOK,
  axis: AXIS_H,
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: L('bitta ildiz:  x = 2', 'один корень:  x = 2', 'one root:  x = 2'),
      marks: [{ v: 2, tone: 'ink' }],
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: L('ikkita ildiz:  x = 2,  x = −1', 'два корня:  x = 2,  x = −1', 'two roots:  x = 2,  x = −1'),
      marks: [{ v: 2, tone: 'tip' }, { v: -1, tone: 'tip' }],
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi uni qo'yib tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его подстановкой.',
      'Your answer is saved. Now we will check it by substitution.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  // Kadrni ekranda ushlab turish, ms. MATN O'ZGARSA -- sonni ham to'g'rila.
  holds: [4500, 3500, 7000, 4000],
  audio: [
    A('mount', 'Ikki kishi bitta tenglamani yechdi va turli javob oldi.', 'Двое решили одно и то же уравнение и получили разные ответы.', 'Two students solved the same equation and got different answers.'),
    A('r1', 'Mana birinchi javob: ildiz bitta, u ikki.', 'Вот первый ответ: корень один, это двойка.', 'Here is the first answer: one root, and it is two.'),
    A('r2', "Mana ikkinchisi. Ikki bu yerda ham bor, lekin yonida minus bir turibdi. Javoblar faqat shu sonda farq qiladi.", 'А вот второй. Двойка есть и здесь, но рядом с ней стоит минус единица. Расходятся ответы только в ней.', 'And here is the second one. Two is here as well, but next to it stands minus one. The answers differ only in that number.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH. Ikkinchi tayanch -- butun darsning kaliti.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Bahsni hal qilishdan oldin uch narsani eslab olamiz. Ularsiz ildizni tekshirib bo'lmaydi. Bu baholanmaydi.",
    'Прежде чем решать спор, вспомним три вещи. Без них корень не проверить. Это не оценивается.',
    'Before settling the argument, let us recall three things. Without them the root cannot be checked. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Bitta son — turli asoslar', 'Одно число — разные основания', 'One number, different bases'),
      short: L('turli asoslar', 'разные основания', 'different bases'),
      ex: [
        { e: '36 = 6²', why: '6 · 6 = 36' },
        { e: '27 = 3³', why: '3 · 3 · 3 = 27' },
      ],
    },
    {
      // Bugungi darsning KALITI: xuk ekranidagi ortiqcha ildiz aynan shu
      // tayanch bilan o'chadi.
      id: 'c2',
      title: L('Daraja doim musbat', 'Степень всегда положительна', 'A power is always positive'),
      short: L('daraja doim musbat', 'степень всегда положительна', 'a power is always positive'),
      ex: [
        { e: '2³ = 8', why: L('musbat', 'положительно', 'positive') },
        { e: '2⁻³ = 1/8', why: L('yana musbat, nol ham, minus ham emas', 'снова положительно, ни нуля, ни минуса', 'positive again, neither zero nor minus') },
      ],
    },
    {
      id: 'c3',
      title: L("Daraja ko'paytuvchilarga ajraladi", 'Степень раскладывается на множители', 'A power splits into factors'),
      short: L("ko'paytuvchilarga ajraladi", 'на множители', 'into factors'),
      ex: [
        { e: '2ˣ⁺² = 2ˣ · 4', why: L('2² = 4 alohida chiqdi', '2² = 4 вынесли отдельно', '2² = 4 taken out') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('36 = 6 ning qaysi darajasi?', '36 = 6 в какой степени?', '36 = 6 to what power?'),
      cols: 4,
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', hint: L("Uch kvadrat bu to'qqiz, bizga esa o'ttiz olti kerak.", 'Три в квадрате это девять, а нам нужно тридцать шесть.', 'Three squared is nine, but we need thirty six.') },
        { id: 'c', label: '6', hint: L("Olti birinchi darajada bu oltining o'zi.", 'Шесть в первой степени это сама шестёрка.', 'Six to the first power is six itself.') },
        { id: 'd', label: '36', hint: L("Ko'rsatkich bu necha marta ko'paytirish, natija emas.", 'Показатель это сколько раз умножаем, а не результат.', 'The exponent is how many times we multiply, not the result.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("2ˣ qaysi qiymatni QABUL QILA OLMAYDI?", 'Какое значение НЕ МОЖЕТ принимать 2ˣ?', 'Which value can 2ˣ NEVER take?'),
      cols: 4,
      items: [
        { id: 'a', label: '−4', correct: true },
        { id: 'b', label: '0,5', hint: L("Bo'lishi mumkin: iks minus bir bo'lganda bir ikkidan chiqadi.", 'Может: при иксе минус один получается одна вторая.', 'It can: at x equal to minus one you get one half.') },
        { id: 'c', label: '1', hint: L('Bo\'lishi mumkin: har qanday son nolinchi darajada birga teng.', 'Может: любое число в нулевой степени даёт единицу.', 'It can: any number to the power zero gives one.') },
        { id: 'd', label: '8', hint: L("Bo'lishi mumkin: iks uch bo'lganda sakkiz chiqadi.", 'Может: при иксе три получается восемь.', 'It can: at x equal to three you get eight.') },
      ],
    },
    {
      id: 't3',
      prompt: '2ˣ⁺² =',
      cols: 4,
      items: [
        { id: 'a', label: '2ˣ · 4', correct: true },
        { id: 'b', label: '2ˣ + 4', hint: L('Iks birga teng deb qo\'ying: chapda sakkiz, o\'ngda olti. Mos kelmadi.', 'Подставь икс равный одному: слева восемь, справа шесть. Не сходится.', 'Substitute x equal to one: eight on the left, six on the right. It does not match.') },
        { id: 'c', label: '2²ˣ', hint: L('Ko\'rsatkichlar qo\'shiladi, ikkilanmaydi.', 'Показатели складываются, а не удваиваются.', 'Exponents add up, they do not double.') },
        { id: 'd', label: '4ˣ', hint: L('Iks birga teng deb qo\'ying: chapda sakkiz, o\'ngda to\'rt.', 'Подставь икс равный одному: слева восемь, справа четыре.', 'Substitute x equal to one: eight on the left, four on the right.') },
      ],
    },
  ],
  holds: [4500, 10000, 11000, 7000, 8000, 6000],
  audio: [
    A('mount', 'Bahsni hal qilishdan oldin uch narsani tiklaymiz. Bu baho emas.', 'Прежде чем решать спор, восстановим три вещи. Это не оценка.', 'Before we settle the argument, let us restore three things. This is not graded.'),
    A(
      'c1',
      "Birinchi tayanch. Bitta sonni turli asoslar bilan yozish mumkin. O'ttiz olti bu olti kvadrat, yigirma yetti bu uch kub. Bugun bu kerak bo'ladi.",
      'Первая опора. Одно и то же число можно записать разными основаниями. Тридцать шесть это шесть в квадрате, двадцать семь это три в кубе. Сегодня это понадобится.',
      'First basic. The same number can be written with different bases. Thirty six is six squared, twenty seven is three cubed. We will need this today.',
    ),
    A(
      'c2',
      "Ikkinchi tayanch, va bugun u asosiy. Daraja doim musbat. Ikki kub bu sakkiz. Ikki minus uchinchi darajada bir sakkizdan. Hech qachon nol ham, minus ham chiqmaydi.",
      'Вторая опора, и сегодня она главная. Степень всегда положительна. Два в кубе это восемь. Два в минус третьей это одна восьмая. Ни разу не ноль и ни разу не минус.',
      'Second basic, and today it is the main one. A power is always positive. Two cubed is eight. Two to the power minus three is one eighth. Never zero and never negative.',
    ),
    A(
      'c3',
      "Uchinchi tayanch. Daraja ko'paytuvchilarga ajraladi: ikkining iks plyus ikki darajasi bu ikkining iks darajasi karra to'rt.",
      'Третья опора. Степень раскладывается на множители: два в степени икс плюс два это два в степени икс, умноженное на четыре.',
      'Third basic. A power splits into factors: two to the power x plus two is two to the power x times four.',
    ),
    A(
      'recap',
      "Qisqacha takrorlaymiz. Birinchi: bitta son, turli asoslar. Ikkinchi, va bugun asosiy: daraja doim musbat. Uchinchi: daraja ko'paytuvchilarga ajraladi.",
      'Повторим коротко. Первое: одно число, разные основания. Второе, и сегодня главное: степень всегда положительна. Третье: степень раскладывается на множители.',
      'Let us repeat briefly. First: one number, different bases. Second, and today the main one: a power is always positive. Third: a power splits into factors.',
    ),
    A(
      'tasks',
      "Endi tayanchlarni bitta tugmaga yig'aman. Kerak bo'lsa, bosib ochasiz. Endi uchta qisqa topshiriq.",
      'Теперь я сворачиваю опоры в одну кнопку. Понадобятся, нажмёшь и откроешь. Теперь три коротких задания.',
      'Now I am folding the basics into one button. If you need them, press it and they open. Now three short tasks.',
    ),
  ],
}

// ============================================================
// SLAYD 3. Bahsni QO'YISH hal qiladi. Uchinchi nuqta -- nazorat uchun.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L("Qo'yib tekshiramiz", 'Проверим подстановкой', 'Let us check by substitution'),
  title: L('Bahsni qo\'yish hal qiladi', 'Спор решает подстановка', 'Substitution settles it'),
  expr: EQ_HOOK,
  goal: L('chapda NOL chiqishi kerak', 'слева должен получиться НОЛЬ', 'the left side must give ZERO'),
  rule: L(
    "Son ildiz bo'ladi, agar qo'yilgandan keyin ikki tomon teng bo'lsa. Ikki javobni ajratadigan sonni izlaymiz.",
    'Число — корень, если после подстановки обе части стали равны. Ищем число, которое разводит эти два ответа.',
    'A number is a root if after substitution both sides become equal. We are looking for a number that separates these two answers.',
  ),
  pick: L('Qaysi sonni qo\'yamiz?', 'Какое число подставим?', 'Which number shall we substitute?'),
  claims: [
    {
      id: 'a', key: 'inA',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: 'x = 2',
    },
    {
      id: 'b', key: 'inB',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: 'x = 2,  x = −1',
    },
  ],
  axis: AXIS_H,
  sets: [],
  points: [
    {
      id: 'p2', label: 'x = 2', num: '2', mark: 2, step: 'calc', verdict: 'in',
      role: L('ikki javobda ham bor', 'есть в обоих ответах', 'in both answers'),
      calc: '81 − 54 − 27 = 0',
      sol: true, inA: true, inB: true,
    },
    {
      id: 'pm1', label: 'x = −1', num: '−1', mark: -1, step: 'calc', verdict: 'out',
      role: L('faqat ikkinchisida', 'только во втором', 'only in the second'),
      calc: '1/9 − 2 − 27 ≠ 0',
      sol: false, inA: false, inB: true,
    },
    {
      id: 'p0', label: 'x = 0', num: '0', mark: 0, step: 'calc', verdict: 'out',
      role: L("hech qaysisida yo'q", 'нет ни в одном', 'in neither'),
      calc: '1 − 6 − 27 ≠ 0',
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'a', label: L('bitta ildiz', 'один корень', 'one root'), correct: true,
        ok: L("To'g'ri. Siz bir javobga mos, ikkinchisiga mos kelmaydigan sonni topdingiz. Tekshirish usuli aynan shu.", 'Верно. Число найдено: оно проходит по одному ответу и не проходит по другому. Это и есть способ проверки.', 'Correct. You found a number that fits one answer and fails the other. That is the way to check.'),
      },
      {
        id: 'b', label: L('ikkita ildiz', 'два корня', 'two roots'),
        hint: L("Minus birni qo'ying. Chapda bir to'qqizdan minus ikki minus yigirma yetti chiqadi, bu esa nol emas. Demak minus bir ildiz bo'lolmaydi, ikkinchi javobga esa u kiradi.", 'Подставь минус единицу. Слева получается одна девятая минус два минус двадцать семь, и это не ноль. Значит минус единица корнем быть не может, а во второй ответ она входит.', 'Substitute minus one. On the left you get one ninth minus two minus twenty seven, and that is not zero. So minus one cannot be a root, yet the second answer contains it.'),
      },
    ],
  },
  holds: [2500, 8000, 5000, 2500, 12000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A(
      'mount',
      "Bahs bahs bilan emas, son bilan hal qilinadi. Qoida oddiy: agar son ildiz bo'lsa, qo'yilgandan keyin ikki tomon teng bo'ladi.",
      'Спор решается не спором, а числом. Правило простое: если число корень, то после подстановки обе части станут равны.',
      'An argument is settled by a number, not by arguing. The rule is simple: if a number is a root, both sides become equal after substitution.',
    ),
    A(
      'mount',
      "Sonni tanlang. Uni boshlang'ich tenglamaga qo'yamiz va chapda nol chiqadimi, ko'ramiz.",
      'Выбери число. Мы подставим его в исходное уравнение и посмотрим, получится ли слева ноль.',
      'Pick a number. We will substitute it into the original equation and see whether the left side gives zero.',
    ),
    A('calc', 'Hisoblaymiz va nol bilan solishtiramiz.', 'Считаем и сравниваем с нулём.', 'We compute and compare with zero.'),
    A(
      'mark',
      "Uch son tekshirildi. Ikki nol beradi, demak u ildiz. Minus bir nol bermaydi, demak u ildiz bo'lolmaydi. Nol ham nol bermaydi, va bu ham tekshiruv: u kesadi, hammasini tasdiqlamaydi.",
      'Три числа проверены. Двойка даёт ноль, значит она корень. Минус единица ноль не даёт, значит корнем она быть не может. А ноль тоже не даёт ноль, и это тоже проверка: она отсекает, а не подтверждает всё подряд.',
      'Three numbers checked. Two gives zero, so it is a root. Minus one does not give zero, so it cannot be a root. And zero does not give zero either, which is also a check: it cuts off, it does not confirm everything.',
    ),
    A('next', 'Bitta son ikki javobni ajratdi. Qaysi biri to\'g\'ri?', 'Одно число развело два ответа. Какой из них верный?', 'One number separated the two answers. Which of them is correct?'),
  ],
}

// ============================================================
// SLAYD 4. CHIZIQ O'QQACHA TUSHMAYDI. Ortiqcha ildiz qayerdan kelgani.
// ============================================================
const EXP3 = (x) => Math.pow(3, x)

const S4 = {
  role: 'graph',
  tag: 'positive_power',
  drag: false,
  eyebrow: L('Ortiqcha ildiz qayerdan keldi', 'Откуда взялся лишний корень', 'Where the extra root came from'),
  title: L('Chiziq o\'qqacha tushmaydi', 'Кривая не опускается до оси', 'The curve never reaches the axis'),
  chip: 'y = 3ˣ',
  graph: {
    fn: EXP3,
    xDomain: [-2.2, 3.2],
    yDomain: [-4.5, 12],
    hline: 9,
    cross: 2,
    drop: true,
    dropLabel: 'x = 2',
    hline2: -3,
    xTicks: [{ v: -1 }, { v: 0 }, { v: 2 }, { v: 3 }],
    yTicks: [{ v: 0 }, { v: 9 }, { v: -3 }],
    height: 168,
  },
  bonus: L(
    "Radioaktiv yemirilish, choyning sovishi, omonat foizi — hammasi ko'rsatkichli model: teng vaqtda kattalik teng MARTA o'zgaradi, teng miqdorga emas.",
    'Радиоактивный распад, охлаждение чая, проценты по вкладу — всё это показательные модели: за равное время величина меняется в равное ЧИСЛО РАЗ, а не на равную величину.',
    'Radioactive decay, cooling tea, interest on a deposit are all exponential models: over equal time the quantity changes by an equal NUMBER OF TIMES, not by an equal amount.',
  ),
  probe: {
    question: L('3ˣ = −3 ning nechta yechimi bor?', 'Сколько решений у 3ˣ = −3?', 'How many solutions does 3ˣ = −3 have?'),
    items: [
      { id: 'a', label: L('bitta ham yo\'q', 'ни одного', 'none'), correct: true },
      { id: 'b', label: L('bitta', 'одно', 'one'), hint: L("Chiziq minus uchgacha tushadigan nuqtani ko'rsating. Unday nuqta yo'q: chiziq butunlay o'qdan yuqorida.", 'Покажи точку, где кривая опускается до минус трёх. Её нет: кривая целиком выше оси.', 'Show a point where the curve reaches minus three. There is none: the curve lies entirely above the axis.') },
      { id: 'c', label: L('ikkita', 'два', 'two'), hint: L("Chiziq monoton: u bitta qiymatdan ikki marta o'tolmaydi.", 'Кривая монотонна: она не может пройти через одно значение дважды.', 'The curve is monotone: it cannot pass through one value twice.') },
      { id: 'd', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p yechim to'g'ri chiziq egri chiziq bilan ustma-ust tushganda bo'lardi. U undan hatto o'tmaydi ham.", 'Бесконечно много решений было бы, если бы прямая совпала с кривой. Она с ней даже не встречается.', 'Infinitely many solutions would mean the line coincides with the curve. It does not even meet it.') },
    ],
  },
  holds: [5000, 6000, 6500, 6500, 8000],
  audio: [
    A('mount', "Qo'yish qaysi javob to'g'ri ekanini ko'rsatdi. Endi minus bir umuman qayerdan kelganini ko'ramiz.", 'Подстановка показала, какой ответ верный. Теперь посмотрим, откуда вообще взялась минус единица.', 'The substitution showed which answer is correct. Now let us see where minus one came from at all.'),
    A('curve', "Mana chiziq, uchning iks darajasi. Qarang: u butunlay o'qdan yuqorida.", 'Вот кривая, три в степени икс. Смотри: она целиком выше оси.', 'Here is the curve, three to the power x. Look: it lies entirely above the axis.'),
    A('line', "Endi to'qqiz balandlikda to'g'ri chiziq o'tkazamiz. Kesishish bor, va u aynan bitta.", 'Теперь проведём прямую на высоте девять. Пересечение есть, и оно ровно одно.', 'Now let us draw a line at height nine. There is an intersection, and exactly one.'),
    A('drop', "Uning o'qdagi soyasiga qarang: ildiz aynan shu, ikki. Chiziq faqat yuqoriga boradi, shuning uchun bu balandlikdan ikkinchi marta o'tmaydi.", 'Смотри на его тень на оси: это и есть корень, двойка. Кривая идёт только вверх, поэтому второй раз эту высоту она не пройдёт.', 'Look at its shadow on the axis: that is the root, two. The curve only goes up, so it will not cross that height a second time.'),
    A('none', "Endi minus uch balandlikda to'g'ri chiziq. Chiziq u bilan birorta nuqtada uchrashmaydi. Demak uchning iks darajasi minus uchga teng bo'lolmaydi, va ortiqcha ildiz ham shundan.", 'А теперь прямая на высоте минус три. Кривая не встречает её ни в одной точке. Значит три в степени икс не может равняться минус трём, отсюда и лишний корень.', 'And now a line at height minus three. The curve does not meet it at any point. So three to the power x cannot equal minus three, and that is where the extra root came from.'),
  ],
}

// ============================================================
// SLAYD 5. BIRINCHI ASBOB: bitta asos. 1-QOIDA.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'same_base',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bitta asos', 'Одно основание', 'One base'),
  rows: [EQ_BASE, '36 = 6²', '6ˣ⁺⁷ = 6⁶ˣ'],
  probe: {
    question: L(
      "Asoslar bir xil bo'ldi. Unda ko'rsatkichlar uchun nima to'g'ri?",
      'Основания стали одинаковыми. Что тогда верно для показателей?',
      'The bases are now the same. What is then true for the exponents?',
    ),
    items: [
      { id: 'a', label: L('ko\'rsatkichlar teng', 'показатели равны', 'the exponents are equal'), correct: true },
      { id: 'b', label: L("ko'rsatkichlarni ham asoslar kabi solishtirish kerak", 'показатели тоже надо сравнить как основания', 'the exponents must be compared like bases'), hint: L("Asoslar allaqachon bir xil, solishtiradigan narsa yo'q. Ko'rsatkichlarni solishtirish qoldi.", 'Основания уже одинаковы, сравнивать нечего. Осталось сравнить показатели.', 'The bases are already the same, there is nothing to compare. Only the exponents are left.') },
      { id: 'c', label: L('logarifm olish kerak', 'нужно взять логарифм', 'you must take a logarithm'), hint: L("Mumkin, lekin bu uzunroq. Ko'rsatkichlar allaqachon ko'rinib turibdi.", 'Можно, но это длиннее. Показатели уже видны, брать логарифм не от чего.', 'You can, but that is longer. The exponents are already visible.') },
      { id: 'd', label: L('tenglik mumkin emas', 'равенство невозможно', 'equality is impossible'), hint: L("Mumkin. Bir butun to'rt o'ndan sonini qo'yib tekshiring.", 'Возможно. Подставь одну целую четыре десятых и проверь.', 'It is possible. Substitute one point four and check.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Bitta asos', 'Правило 1. Одно основание', 'Rule 1. One base'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'aᶠ = aᵍ  ⟺  f = g',
    lines: [
      L('ikki tomonni bitta asosga keltir', 'приведи обе части к одному основанию', 'bring both sides to one base'),
      L("asoslar teng — ko'rsatkichlarni tenglashtir", 'основания равны — приравняй показатели', 'bases equal — set the exponents equal'),
      L('shart: a > 0 va a ≠ 1', 'условие: a > 0 и a ≠ 1', 'condition: a > 0 and a ≠ 1'),
      L('a = 1 da qoida ishlamaydi: 1ᶠ = 1ᵍ doim', 'при a = 1 правило не работает: 1ᶠ = 1ᵍ всегда', 'at a = 1 the rule fails: 1ᶠ = 1ᵍ always'),
    ],
    example: L('misol:  6ˣ⁺⁷ = 36³ˣ  →  x = 1,4', 'пример:  6ˣ⁺⁷ = 36³ˣ  →  x = 1,4', 'example:  6ˣ⁺⁷ = 36³ˣ  →  x = 1,4'),
  },
  holds: [4000, 8000, 5000],
  audio: [
    A('mount', "Rasmni ko'rdik. Endi shuni yozuv bilan olamiz.", 'Картинку мы увидели. Теперь получим то же самое записью.', 'We have seen the picture. Now let us get the same in writing.'),
    A('toBase', "Chapda asos olti, o'ngda o'ttiz olti. Asoslar turlicha, ko'rsatkichlarni tenglashtirib bo'lmaydi. Lekin o'ttiz olti bu olti kvadrat.", 'Слева основание шесть, справа тридцать шесть. Основания разные, и приравнивать показатели пока нельзя. Но тридцать шесть это шесть в квадрате.', 'On the left the base is six, on the right thirty six. The bases differ, so the exponents cannot be equated yet. But thirty six is six squared.'),
    A('same', "Endi asoslar bir xil, chapda ham, o'ngda ham olti.", 'Теперь основания одинаковые, и слева, и справа шесть.', 'Now the bases are the same, six on both sides.'),
    A('rule', "Aynan shunday. Asoslar bir xil, demak ko'rsatkichlar teng. Iks plyus yetti teng olti iks, demak iks bir butun to'rt o'ndan.", 'Именно так. Основания одинаковые, значит равны показатели. Икс плюс семь равно шести икс, отсюда икс равен одной целой четырём десятым.', 'Exactly. The bases are the same, so the exponents are equal. x plus seven equals six x, so x is one point four.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: daraja ikki marta uchraydi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'substitution',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Daraja ikki marta uchraydi', 'Степень встречается дважды', 'The power appears twice'),
  was: { label: UI.was, expr: EQ_BASE },
  now: { label: UI.now, expr: EQ_SUB },
  probe1: {
    question: L('Ikkinchi yozuv birinchisidan nimasi bilan farq qiladi?', 'Чем вторая запись отличается от первой?', 'How does the second record differ from the first?'),
    items: [
      { id: 'a', label: L('bitta daraja ikki marta uchraydi', 'одна и та же степень встречается дважды', 'the same power appears twice'), correct: true },
      { id: 'b', label: L('asos boshqa', 'основание другое', 'the base is different'), hint: L("To'rt bu ikki kvadrat, demak asos o'sha. Ikkining iks darajasi necha marta uchrashiga qarang.", 'Четыре это два в квадрате, значит основание то же самое. Смотри, сколько раз встречается два в степени икс.', 'Four is two squared, so the base is the same. Look at how many times two to the power x appears.') },
      { id: 'c', label: L('ozod had bor', 'есть свободный член', 'there is a constant term'), hint: L("Ozod had ilgari ham bor edi, o'ngda. U hech narsani o'zgartirmaydi.", 'Свободный член был и раньше, справа. Он ничего не меняет.', 'There was a constant term before, on the right. It changes nothing.') },
      { id: 'd', label: L('o\'ngda nol', 'справа ноль', 'the right side is zero'), hint: L("O'ngdagi nol qulay, qiyin emas. Qiyinchilik chaproqda.", 'Ноль справа это удобно, а не трудно. Трудность левее.', 'Zero on the right is convenient, not hard. The difficulty is further left.') },
    ],
  },
  probe2: {
    question: L('Ildiz nechaga teng?', 'Чему равен корень?', 'What does the root equal?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '1' },
      { id: 'b', label: '2' },
      { id: 'c', label: '0' },
      { id: 'd', label: L("ildiz yo'q", 'корней нет', 'no roots') },
    ],
  },
  holds: [5000, 8000, 3500, 3500],
  audio: [
    A('mount', "Birinchi qoida tayyor. Lekin u har doim ishlamaydi. Nima o'zganiga qarang.", 'Первое правило готово. Но оно работает не всегда. Смотри, что изменилось.', 'The first rule is ready. But it does not always work. Look at what changed.'),
    A('now', "Oldingi misolda asoslar turlicha edi, biz ularni bittaga keltirdik. Bu yerda esa bitta asos ikki marta uchraydi, keltiradigan joy yo'q.", 'В прошлом примере основания были разные, и мы свели их к одному. А здесь одно и то же основание встречается дважды, и сводить не к чему.', 'In the previous example the bases were different and we brought them to one. Here the same base appears twice, and there is nothing to bring together.'),
    A('q1', 'Bu yozuv oldingisidan nimasi bilan farq qiladi?', 'Чем эта запись отличается от прежней?', 'How does this record differ from the previous one?'),
    A('q2', 'Sizningcha ildiz nechaga teng? Shunchaki taxmin qiling.', 'Как думаешь, чему равен корень? Просто предположи.', 'What do you think the root is? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD, BIRI QOLADI. Javobni o'quvchi O'ZI yozadi.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'positive_power',
  eyebrow: L('Ikkisini ham tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Ikki nomzod, biri qoladi', 'Два кандидата, один выживает', 'Two candidates, one survives'),
  expr: '4ˣ − 2ˣ − 2 = 0,      t = 2ˣ',
  need: 't > 0',
  answerLabel: 'A',
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 't = 2',
      point: {
        label: '2ˣ = 2,  x = 1',
        calc: '4 − 2 − 2 = 0',
        verdict: 'in',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: 't = −1',
      point: {
        label: '2ˣ = −1',
        calc: L('daraja manfiy bo\'lmaydi', 'степень не бывает отрицательной', 'a power is never negative'),
        verdict: 'out',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['−1', '0', '1', '2'],
    value: ['1'],
    prompt: L('Ildizni yozing', 'Запиши корень', 'Write the root'),
    wrongs: [
      { key: '−1', hint: L("Minus bir bu tening ildizi, iksning emas. Ikkining iks darajasi minus birga teng bo'lolmaydi.", 'Минус единица это корень для тэ, а не для икса. Два в степени икс не может равняться минус единице.', 'Minus one is a root for t, not for x. Two to the power x cannot equal minus one.') },
      { key: '2', hint: L('Ikkini boshlang\'ich tenglamaga qo\'ying: o\'n olti minus to\'rt minus ikki, bu nol emas.', 'Подставь двойку в исходное: шестнадцать минус четыре минус два, это не ноль.', 'Substitute two into the original: sixteen minus four minus two, that is not zero.') },
      { key: '*', hint: L("A nomzod qoldi: ikkining iks darajasi ikkiga teng.", 'Остался кандидат A: два в степени икс равно двум.', 'Candidate A remains: two to the power x equals two.') },
    ],
  },
  holds: [3000, 9000, 9000, 5000],
  audio: [
    A('mount', 'Siz ildizni taxmin qildingiz. Ikkala nomzodni tekshiramiz.', 'Прогноз есть. Проверим обоих кандидатов.', 'You guessed the root. Let us check both candidates.'),
    A('p1', "Birinchi nomzod: te ikkiga teng. Demak ikkining iks darajasi ikkiga teng, iks birga teng. Boshlang'ich tenglamaga qo'yamiz: to'rt minus ikki minus ikki, bu nol. Mos keladi.", 'Первый кандидат: тэ равно двум. Значит два в степени икс равно двум, и икс равен единице. Подставим в исходное: четыре минус два минус два, это ноль. Подходит.', 'First candidate: t equals two. So two to the power x equals two, and x equals one. Substitute into the original: four minus two minus two, that is zero. It fits.'),
    A('p2', "Ikkinchi nomzod: te minus birga teng. Demak ikkining iks darajasi minus birga teng bo'lishi kerak. Lekin daraja hech qachon manfiy bo'lmaydi, buni chiziqda ko'rdik. Nomzod tushib qoladi.", 'Второй кандидат: тэ равно минус единице. Значит два в степени икс должно равняться минус единице. Но степень никогда не бывает отрицательной, мы видели это на кривой. Кандидат отпадает.', 'Second candidate: t equals minus one. So two to the power x would equal minus one. But a power is never negative, we saw that on the curve. The candidate is discarded.'),
    A('write', "Bir nomzod mos keldi, ikkinchisi tushib qoldi. Ildizni o'zingiz yozing.", 'Один кандидат подошёл, другой отпал. Запиши корень сам.', 'One candidate fits, the other is out. Write the root yourself.'),
  ],
}

// ============================================================
// SLAYD 8. 2-QOIDA va BITTA JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'substitution',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bitta qoida', 'Одно правило', 'One rule'),
  cases: [
    {
      label: L('asoslar turlicha', 'основания разные', 'bases differ'),
      text: L('bitta asosga keltir', 'приведи к одному основанию', 'bring to one base'),
      tone: 'graph',
    },
    {
      label: L('daraja ikki marta', 'степень дважды', 'power twice'),
      text: L('almashtirish t = aˣ', 'замена t = aˣ', 'substitute t = aˣ'),
      tone: 'accent',
    },
  ],
  rows: ['4ˣ = (2ˣ)²', 't² − t − 2 = 0,   t > 0'],
  probe: {
    question: L('Nega darrov t > 0 deb yoziladi?', 'Зачем сразу писать t > 0?', 'Why write t > 0 right away?'),
    items: [
      { id: 'a', label: L('daraja musbat, manfiy ildiz darrov tushib qoladi', 'степень положительна, и отрицательный корень сразу отпадает', 'a power is positive, so a negative root drops at once'), correct: true },
      { id: 'b', label: L('shunday yozish qabul qilingan', 'так принято записывать', 'it is the accepted way'), hint: L("Bu rasmiyatchilik emas. Bu shartsiz javobga ortiqcha ildiz kiradi.", 'Это не оформление. Без этого условия в ответ попадёт лишний корень.', 'This is not formatting. Without the condition an extra root enters the answer.') },
      { id: 'c', label: L('tenglama kvadrat bo\'lishi uchun', 'чтобы уравнение стало квадратным', 'to make the equation quadratic'), hint: L("Uni kvadrat qiladigan almashtirish, shart emas. Shart ortiqcha ildizni kesadi.", 'Квадратным его делает замена, а не условие. Условие отсекает лишний корень.', 'The substitution makes it quadratic, not the condition. The condition cuts off the extra root.') },
      { id: 'd', label: L('iks musbat bo\'lishi uchun', 'чтобы икс был положительным', 'so that x is positive'), hint: L("Iks har qanday bo'lishi mumkin, manfiy ham. Musbat bo'lgani daraja, ko'rsatkich emas.", 'Икс может быть любым, в том числе отрицательным. Положительна степень, а не показатель.', 'x can be anything, including negative. It is the power that is positive, not the exponent.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Daraja ikki marta', 'Правило 2. Степень дважды', 'Rule 2. The power twice'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'a²ˣ = (aˣ)²',
    lines: [
      L("kvadratni ko'r: 4ˣ = (2ˣ)²", 'увидь квадрат: 4ˣ = (2ˣ)²', 'see the square: 4ˣ = (2ˣ)²'),
      L('almashtirish t = 2ˣ va darrov shart t > 0', 'замена t = 2ˣ и сразу условие t > 0', 'substitute t = 2ˣ and at once the condition t > 0'),
      L('kvadratni yech, t ≤ 0 ni tashla', 'реши квадратное, отбрось t ≤ 0', 'solve the quadratic, discard t ≤ 0'),
      L('iksga qayt: 2ˣ = t', 'вернись к иксу: 2ˣ = t', 'go back to x: 2ˣ = t'),
    ],
    example: L('misol:  4ˣ − 2ˣ − 2 = 0  →  x = 1', 'пример:  4ˣ − 2ˣ − 2 = 0  →  x = 1', 'example:  4ˣ − 2ˣ − 2 = 0  →  x = 1'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'aᶠ = aᵍ  ⟺  f = g',
    lines: [
      L('1. bitta asosga keltir', '1. приведи к одному основанию', '1. bring to one base'),
      L("2. asoslar teng — ko'rsatkichlarni tenglashtir", '2. основания равны — приравняй показатели', '2. bases equal — set the exponents equal'),
      L('3. daraja ikki marta — almashtirish t = aˣ, va t > 0', '3. степень дважды — замена t = aˣ, и t > 0', '3. power twice — substitute t = aˣ, and t > 0'),
      L('4. ildizni boshlang\'ich tenglamaga qo\'yib tekshir', '4. проверь корень подстановкой в исходное', '4. check the root by substituting into the original'),
    ],
  },
  holds: [4500, 5500, 5500, 5000],
  audio: [
    A('mount', 'Nomzodlar javobni ko\'rsatdi. Endi usulni to\'liq yozamiz.', 'Кандидаты показали ответ. Теперь запишем способ целиком.', 'The candidates showed the answer. Now let us write the method in full.'),
    A('toSquare', "To'rtning iks darajasi bu ikkining iks darajasining kvadrati. Almashtirish shuning uchun mumkin.", 'Четыре в степени икс это два в степени икс, возведённое в квадрат. Вот почему замена вообще возможна.', 'Four to the power x is two to the power x squared. That is why the substitution is possible at all.'),
    A('q', "Almashtirishni qilamiz va darrov shartni yozamiz: te noldan katta. Bu shart nega kerak?", 'Делаем замену и сразу пишем условие: тэ больше нуля. Зачем это условие?', 'We substitute and write the condition at once: t is greater than zero. Why this condition?'),
    A('rule', "To'g'ri. Daraja musbat, demak manfiy ildiz tekshiruvdan keyin emas, darrov tushib qoladi.", 'Верно. Степень положительна, значит отрицательный корень отпадает сразу, а не после проверки.', 'Correct. A power is positive, so a negative root drops immediately, not after checking.'),
    A('both', 'Endi ikkala holatni bitta qoidaga yig\'ing.', 'А теперь собери оба случая в одно правило.', 'Now combine both cases into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ASOSNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'same_base',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Umumiy asos', 'Общее основание', 'The common base'),
  left: '8ˣ⁺¹ = 32ˣ⁻¹',
  template: [{ slot: 0 }, '³ˣ⁺³', '  =  ', { slot: 0 }, '⁵ˣ⁻⁵'],
  signs: ['2', '4', '8'],
  answer: '2',
  checkNote: L(
    'Tekshiruv: chapda 8⁵, o\'ngda 32³ — ikkisi ham 2¹⁵',
    'Проверка: слева 8⁵, справа 32³ — и то и другое 2¹⁵',
    'Check: 8⁵ on the left, 32³ on the right — both are 2¹⁵',
  ),
  wrongs: [
    { key: '4', hint: L("O'ttiz ikki to'rt orqali butun daraja bilan ifodalanmaydi.", 'Тридцать два через четвёрку целой степенью не выражается.', 'Thirty two is not a whole power of four.') },
    { key: '8', hint: L("Sakkiz chapda mos keladi, o'ngda esa o'ttiz ikki sakkizning butun darajasiga aylanmaydi.", 'Восьмёрка годится слева, а справа тридцать два в целую степень восьмёрки не превращается.', 'Eight works on the left, but on the right thirty two is not a whole power of eight.') },
  ],
  probe: {
    question: L("Nega ko'rsatkichlarni tenglashtirish mumkin?", 'Почему можно приравнять показатели?', 'Why may the exponents be equated?'),
    items: [
      { id: 'a', label: L('funksiya monoton: bir qiymatga bitta ko\'rsatkich', 'функция монотонна: одному значению отвечает один показатель', 'the function is monotone: one value has one exponent'), correct: true },
      { id: 'b', label: L('shunday qulayroq', 'так удобнее', 'it is more convenient'), hint: L("Qulaylik dalil emas. Sabab funksiyaning o'zida.", 'Удобство это не доказательство. Причина в самой функции.', 'Convenience is not a proof. The reason is in the function itself.') },
      { id: 'c', label: L('asoslar musbat bo\'lgani uchun', 'потому что основания положительны', 'because the bases are positive'), hint: L("Musbatlik kerak, lekin yetarli emas: asos birga teng bo'lsa qoida buziladi.", 'Положительность нужна, но её мало: при основании, равном единице, правило ломается.', 'Positivity is needed but not enough: at base one the rule breaks.') },
      { id: 'd', label: L('o\'ngda ham daraja bo\'lgani uchun', 'потому что справа тоже степень', 'because the right side is also a power'), hint: L("Ikki tomonda ham daraja bo'lishi shart, lekin gap monotonlikda.", 'Степень с обеих сторон нужна, но дело в монотонности.', 'A power on both sides is required, but the point is monotonicity.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', 'Ikki tomon keltiriladigan asosni tanlang.', 'Выбери основание, к которому приводятся обе части.', 'Choose the base to which both sides can be brought.'),
    A('checked', "Bo'ldi. Endi ta'riflang: ko'rsatkichlarni umuman nega tenglashtirish mumkin?", 'Получилось. Теперь сформулируй: почему показатели вообще можно приравнивать?', 'Done. Now put it into words: why may the exponents be equated at all?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'factor', label: L("umumiy ko'paytuvchini chiqarish", 'вынести общий множитель', 'take out the common factor') },
  { id: 'addPow', label: L("ko'rsatkichlarni qo'shish", 'сложить показатели', 'add the exponents') },
  { id: 'divide', label: L('ikki tomonni bo\'lish', 'разделить обе части', 'divide both sides') },
  { id: 'sameBase', label: L('bitta asosga keltirish', 'привести к одному основанию', 'bring to one base') },
]

const ADD_POW_HINT = L(
  "Nolni qo'ying. Chapda to'rt plyus bir, bu besh — to'g'ri. Ikkining ikki iks plyus ikki darajasi esa nolda to'rt beradi, bu besh emas. Demak yozuvlar teng kuchli emas.",
  'Подставь ноль. Слева четыре плюс один, это пять — верно. А два в степени два икс плюс два при нуле даёт четыре, и это не пять. Значит записи не равносильны.',
  'Substitute zero. On the left four plus one, that is five — correct. But two to the power two x plus two gives four at zero, and that is not five. So the records are not equivalent.',
)

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'factor_out',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Шаг за шагом', 'Step by step'),
  start: '2ˣ⁺² + 2ˣ = 5',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'factor',
      to: '2ˣ(4 + 1) = 5',
      wrongs: [
        { action: 'addPow', hint: ADD_POW_HINT },
        { action: 'divide', hint: L("Hozircha bo'ladigan narsa yo'q: chapda yig'indi, ko'paytma emas.", 'Делить пока не на что: слева сумма, а не произведение.', 'There is nothing to divide by yet: the left side is a sum, not a product.') },
        { action: 'sameBase', hint: L("Asos allaqachon bir xil. Qiyinchilik shundaki, qo'shiluvchi ikkita.", 'Основание уже одно и то же. Трудность в том, что слагаемых два.', 'The base is already the same. The difficulty is that there are two terms.') },
      ],
    },
    {
      action: 'divide',
      to: '2ˣ = 1',
      wrongs: [
        { action: 'addPow', hint: ADD_POW_HINT },
        { action: 'factor', hint: L("Ko'paytuvchi allaqachon chiqarilgan.", 'Множитель уже вынесен.', 'The factor is already taken out.') },
        { action: 'sameBase', hint: L("Avval beshga bo'ling: o'ngda ham, chapda ham besh turibdi.", 'Сначала раздели на пять: и слева, и справа стоит пятёрка.', 'First divide by five: there is a five on both sides.') },
      ],
    },
    {
      action: 'sameBase',
      to: '2ˣ = 2⁰,   x = 0',
      wrongs: [
        { action: 'factor', hint: L("Chiqaradigan narsa qolmadi.", 'Выносить больше нечего.', 'There is nothing left to take out.') },
        { action: 'divide', hint: L("Bo'lish tugadi. Endi birni daraja ko'rinishida yozing.", 'Деление закончено. Теперь запиши единицу как степень.', 'The division is done. Now write one as a power.') },
        { action: 'addPow', hint: L("Qo'shiladigan ko'rsatkich qolmadi.", 'Складывать больше нечего.', 'There are no exponents left to add.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['−1', '0', '1', '2'],
    value: ['0'],
    prompt: L('Ildizni imtihonda yozganingizdek yozing', 'Запиши корень так, как пишут на экзамене', 'Write the root the way you would on the exam'),
    wrongs: [{ key: '*', hint: L("Oxirgi satrga qarang: ikkining nolinchi darajasi.", 'Смотри на последнюю строку: два в нулевой степени.', 'Look at the last line: two to the power zero.') }],
  },
  audio: [
    A('mount', 'Siz qoidani ta\'rifladingiz. Misolni to\'liq o\'tamiz.', 'Правило сформулировано. Пройдём пример целиком.', 'You put the rule into words. Let us go through an example completely.'),
    A('start', "Bu yerda asos bitta, lekin qo'shiluvchi ikkita. Nimadan boshlashni tanlang.", 'Здесь основание одно, но слагаемых два. Выбери, с чего начать.', 'Here the base is one, but there are two terms. Choose where to start.'),
    A('step4', 'Endi ildizni imtihonda yozganingizdek yozing.', 'Теперь запиши корень так, как пишут на экзамене.', 'Now write the root the way you would on the exam.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL. IKKI ildiz -- «doim bitta» degan yolg'on
// model shu yerda sinadi.
// ============================================================
const ACTIONS_11 = [
  { id: 'subst', label: L('almashtirish t = 3ˣ, t > 0', 'замена t = 3ˣ, t > 0', 'substitute t = 3ˣ, t > 0') },
  { id: 'solveQ', label: L('kvadrat tenglamani yechish', 'решить квадратное уравнение', 'solve the quadratic') },
  { id: 'back', label: L('iksga qaytish', 'вернуться к иксу', 'go back to x') },
]

const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'substitution',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Tenglamani yeching', 'Реши уравнение', 'Solve the equation'),
  start: '9ˣ − 10·3ˣ + 9 = 0',
  actions: ACTIONS_11,
  hint: L(
    "Almashtirishning ikkala ildizi ham musbat. Demak biri ham tashlanmaydi.",
    'Оба корня замены положительны. Значит ни один не отбрасывается.',
    'Both roots of the substitution are positive. So neither is discarded.',
  ),
  steps: [
    {
      action: 'subst',
      to: 't² − 10t + 9 = 0,   t > 0',
      wrongs: [
        { action: 'solveQ', hint: L("Yechadigan kvadrat tenglama hali yo'q: avval almashtirish.", 'Квадратного уравнения ещё нет: сначала замена.', 'There is no quadratic yet: substitute first.') },
        { action: 'back', hint: L("Qaytadigan joy yo'q: hali almashtirmadik.", 'Возвращаться некуда: замены ещё не было.', 'There is nowhere to go back to: there was no substitution yet.') },
      ],
    },
    {
      action: 'solveQ',
      to: 't = 1,   t = 9',
      wrongs: [
        { action: 'subst', hint: L('Almashtirish allaqachon qilingan.', 'Замена уже сделана.', 'The substitution is already done.') },
        { action: 'back', hint: L("Avval te ni toping, keyin iksga qaytasiz.", 'Сначала найди тэ, потом вернёшься к иксу.', 'First find t, then go back to x.') },
      ],
    },
    {
      action: 'back',
      to: '3ˣ = 1,   3ˣ = 9',
      wrongs: [
        { action: 'subst', hint: L('Almashtirish allaqachon qilingan.', 'Замена уже сделана.', 'The substitution is already done.') },
        { action: 'solveQ', hint: L('Kvadrat tenglama yechildi.', 'Квадратное уже решено.', 'The quadratic is already solved.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    slots: 2,
    numbers: ['−2', '0', '1', '2', '3'],
    value: ['0', '2'],
    prompt: L('Ikkala ildizni yozing', 'Запиши оба корня', 'Write both roots'),
    wrongs: [
      { key: '2', hint: L("Nolni tekshiring: bir minus o'n plyus to'qqiz, bu nol. Demak nol ham ildiz.", 'Проверь ноль: единица минус десять плюс девять, это ноль. Значит ноль тоже корень.', 'Check zero: one minus ten plus nine, that is zero. So zero is a root as well.') },
      { key: '0', hint: L("Ikkini tekshiring: sakson bir minus to'qson plyus to'qqiz, bu nol. Demak ikki ham ildiz.", 'Проверь двойку: восемьдесят один минус девяносто плюс девять, это ноль. Значит двойка тоже корень.', 'Check two: eighty one minus ninety plus nine, that is zero. So two is a root as well.') },
      { key: '*', hint: L("Almashtirishning ikkala ildizi musbat, demak ikkisi ham iks beradi.", 'Оба корня замены положительны, значит оба дают икс.', 'Both roots of the substitution are positive, so both give an x.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', 'Asosga qarang va te uchun shartni yodda tuting.', 'Смотри на основание и помни про условие для тэ.', 'Look at the base and remember the condition for t.'),
    A('answered', "Javobni yozing. Ildiz ikkita bo'lsa, ikkisini ham.", 'Запиши ответ. Если корней два, то оба.', 'Write the answer. If there are two roots, write both.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. OLTI SAVOL, YAGONA BAHOLANADIGAN EKRAN.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'positive_power', ask: true, cols: 2,
      done: L("7ˣ = −49 da yechim yo'q", 'у 7ˣ = −49 решений нет', '7ˣ = −49 has no solutions'),
      prompt: L('7ˣ = −49 ning nechta ildizi bor?', 'Сколько корней у 7ˣ = −49?', 'How many roots does 7ˣ = −49 have?'),
      items: [
        { id: 'a', label: L('bitta ham yo\'q', 'ни одного', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'один', 'one'), hint: L("Yettining darajasi har qanday iksda musbat, o'ngda esa minus qirq to'qqiz.", 'Степень семёрки положительна при любом иксе, а справа минус сорок девять.', 'A power of seven is positive for any x, while the right side is minus forty nine.') },
        { id: 'c', label: L('ikkita', 'два', 'two'), hint: L("Chiziq bu to'g'ri chiziqni ikki marta emas, umuman uchratmaydi.", 'Кривая не встречает эту прямую ни разу, а не дважды.', 'The curve does not meet that line twice, it does not meet it at all.') },
        { id: 'd', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p yechim faqat ustma-ust tushganda bo'ladi.", 'Бесконечно много бывает только при совпадении.', 'Infinitely many happens only when they coincide.') },
      ],
    },
    {
      id: 'b2', tag: 'same_base', prompt: '2ˣ⁺¹ = 8', cols: 4,
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', hint: L("Sakkiz bu ikki kub, demak iks plyus bir uchga teng, iks esa ikki.", 'Восемь это два в кубе, значит икс плюс один равно трём, а икс равен двум.', 'Eight is two cubed, so x plus one equals three, and x equals two.') },
        { id: 'c', label: '4', hint: L("Ikkining to'rtinchi darajasi o'n olti, sakkiz emas.", 'Два в четвёртой это шестнадцать, а не восемь.', 'Two to the fourth is sixteen, not eight.') },
        { id: 'd', label: '1', hint: L("Iks bir bo'lsa chapda to'rt chiqadi.", 'При иксе один слева получится четыре.', 'At x equal to one the left side gives four.') },
      ],
    },
    {
      id: 'b3', tag: 'substitution', ask: true, cols: 1,
      done: L('almashtirish: 25ˣ − 6·5ˣ + 5 = 0', 'замена: 25ˣ − 6·5ˣ + 5 = 0', 'substitution: 25ˣ − 6·5ˣ + 5 = 0'),
      prompt: L('Qaysi tenglamada t = aˣ almashtirish kerak?', 'В каком уравнении нужна замена t = aˣ?', 'In which equation is the substitution t = aˣ needed?'),
      items: [
        { id: 'a', label: '25ˣ − 6·5ˣ + 5 = 0', correct: true },
        { id: 'b', label: '5ˣ = 25', hint: L("Bu yerda daraja bitta, almashtirish kerak emas: yigirma besh bu besh kvadrat.", 'Здесь степень одна, замена не нужна: двадцать пять это пять в квадрате.', 'Here there is only one power, no substitution is needed: twenty five is five squared.') },
        { id: 'c', label: '5ˣ⁺¹ = 5²ˣ', hint: L("Asoslar bir xil, ko'rsatkichlarni tenglashtirish yetadi.", 'Основания одинаковы, достаточно приравнять показатели.', 'The bases are the same, equating the exponents is enough.') },
        { id: 'd', label: '5x² − 6x + 5 = 0', hint: L("Bu oddiy kvadrat tenglama, iks darajada emas.", 'Это обычное квадратное уравнение, икс не в показателе.', 'That is an ordinary quadratic, x is not in the exponent.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true, cols: 1,
      done: L('tekshiruv: boshlang\'ich tenglamaga qo\'yish', 'проверка: подставить в исходное', 'check: substitute into the original'),
      prompt: L(
        "4ˣ − 2ˣ − 2 = 0 uchun sizda x = 1 chiqdi. Buni eng tez qanday tekshirasiz?",
        'У тебя вышло x = 1 для 4ˣ − 2ˣ − 2 = 0. Как быстрее всего это проверить?',
        'You got x = 1 for 4ˣ − 2ˣ − 2 = 0. What is the fastest way to check it?',
      ),
      items: [
        { id: 'a', label: L('boshlang\'ich tenglamaga qo\'yish', 'подставить в исходное уравнение', 'substitute into the original equation'), correct: true },
        { id: 'b', label: L("o'sha usul bilan ikkinchi marta yechish", 'решить второй раз тем же способом', 'solve it a second time the same way'), hint: L("O'sha usul bilan o'sha xatoni takrorlaysiz. Mustaqil tekshiruv kerak.", 'Тем же способом повторишь ту же ошибку. Нужна независимая проверка.', 'The same way will repeat the same mistake. You need an independent check.') },
        { id: 'c', label: L('javoblarga qarash', 'посмотреть в ответы', 'look at the answers'), hint: L('Imtihonda javoblar bo\'lmaydi.', 'На экзамене ответов не будет.', 'On the exam there are no answers to look at.') },
        { id: 'd', label: L('nechta ildiz borligini sanash', 'посчитать, сколько корней', 'count how many roots there are'), hint: L("Ildizlar soni ildizning to'g'riligini isbotlamaydi.", 'Количество корней не доказывает правильность корня.', 'The number of roots does not prove a root is right.') },
      ],
    },
    {
      id: 'b5', tag: 'same_base', prompt: '3ˣ · 3ˣ⁺¹ = 81', cols: 4,
      items: [
        { id: 'a', label: '1,5', correct: true },
        { id: 'b', label: '3', hint: L("Chapda darajalar ko'paytiriladi, demak ko'rsatkichlar qo'shiladi: ikki iks plyus bir.", 'Слева степени перемножаются, значит показатели складываются: два икс плюс один.', 'On the left the powers multiply, so the exponents add: two x plus one.') },
        { id: 'c', label: '4', hint: L("To'rt bu o'ngdagi ko'rsatkich, javob emas.", 'Четыре это показатель справа, а не ответ.', 'Four is the exponent on the right, not the answer.') },
        { id: 'd', label: '2', hint: L("Ikkida chapda uchning beshinchi darajasi chiqadi.", 'При двойке слева получится три в пятой.', 'At two the left side gives three to the fifth.') },
      ],
    },
    {
      id: 'b6', tag: 'neg_exponent', prompt: '(1/2)ˣ = 8', cols: 4,
      items: [
        { id: 'a', label: '−3', correct: true },
        { id: 'b', label: '3', hint: L("Bir ikkidan bu ikkining minus birinchi darajasi. Minusni yo'qotmang.", 'Одна вторая это два в минус первой степени. Минус не потеряй.', 'One half is two to the power minus one. Do not lose the minus.') },
        { id: 'c', label: '1/3', hint: L("Ko'rsatkich butun son: sakkiz bu ikkining kubi.", 'Показатель целый: восемь это два в кубе.', 'The exponent is a whole number: eight is two cubed.') },
        { id: 'd', label: '−1/3', hint: L("Minus to'g'ri, lekin daraja butun: uch, uchdan bir emas.", 'Минус верный, но степень целая: три, а не одна треть.', 'The minus is right, but the exponent is whole: three, not one third.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Bu yerda asosni ko\'ring.', 'Здесь посмотри на основание.', 'Here look at the base.'),
    A('q3', 'Qaysi birida daraja ikki marta uchraydi?', 'В каком из них степень встречается дважды?', 'In which one does the power appear twice?'),
    A('q4', 'Tekshiruv haqida savol.', 'Вопрос про проверку.', 'A question about checking.'),
    A('q5', "Chapda ikkita daraja ko'paytirilgan.", 'Слева перемножены две степени.', 'On the left two powers are multiplied.'),
    A('q6', 'Oxirgi. Asos kasr.', 'Последний. Основание дробное.', 'The last one. The base is a fraction.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO. Birinchi xato satrni topish.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'same_base',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Qadamlar to'g'ri, javob xato", 'Шаги верны, ответ нет', 'Steps right, answer wrong'),
  rows: [
    { id: 'r1', text: EQ_BASE },
    { id: 'r2', text: 'x + 7 = 3x' },
    { id: 'r3', text: '2x = 7' },
    { id: 'r4', text: 'x = 3,5' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich tenglama, unda xato bo'lishi mumkin emas.", 'Это исходное уравнение, ошибки в нём быть не может.', 'This is the original equation, there can be no error in it.'),
    r3: L("2-satrdan bu to'g'ri kelib chiqadi. Xato oldin kelgan.", 'Из строки 2 это следует верно. Ошибка пришла раньше.', 'This follows correctly from line 2. The error came earlier.'),
    r4: L("Javob haqiqatan xato. Lekin u oldin xato bo'lgan, qayerda ekanini toping.", 'Ответ действительно неверный. Но неверным он стал раньше, найди, где именно.', 'The answer is indeed wrong. But it became wrong earlier, find exactly where.'),
  },
  proofPoint: 'x = 3,5',
  proof: L(
    "Chapda 6¹⁰,⁵, o'ngda 36¹⁰,⁵. O'ngdagi asos katta, demak butun ifoda ham katta. Tenglik yo'q. To'g'risi: 36 = 6², unda x + 7 = 6x va x = 1,4",
    'Слева 6¹⁰,⁵, справа 36¹⁰,⁵. Основание справа больше, значит и всё выражение больше. Равенства нет. Верно: 36 = 6², тогда x + 7 = 6x и x = 1,4',
    'On the left 6¹⁰,⁵, on the right 36¹⁰,⁵. The base on the right is larger, so the whole expression is larger. There is no equality. Correct: 36 = 6², then x + 7 = 6x and x = 1,4',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L('asoslar turlicha, avval bittaga keltirish kerak', 'основания разные, сначала привести к одному', 'the bases differ, bring them to one first'), correct: true },
      { id: 'b', label: L("ko'rsatkichlarni tenglashtirib bo'lmaydi", 'показатели нельзя приравнивать', 'exponents may not be equated'), hint: L("Mumkin, lekin FAQAT asoslar bir xil bo'lganda.", 'Можно, но ТОЛЬКО когда основания одинаковы.', 'They may, but ONLY when the bases are the same.') },
      { id: 'c', label: L('qo\'shiluvchini ko\'chirish', 'перенос слагаемого', 'moving a term'), hint: L("Yetti to'g'ri ko'chirilgan, bu 3-satrda ko'rinadi.", 'Семёрка перенесена верно, это видно в строке 3.', 'The seven was moved correctly, you can see it in line 3.') },
      { id: 'd', label: L('amallar tartibi', 'порядок действий', 'order of operations'), hint: L("Tartib to'g'ri edi: avval asos, keyin chiziqli tenglama.", 'Порядок был правильный: сначала основание, потом линейное уравнение.', 'The order was right: the base first, then the linear equation.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma qadam to'g'ri ko'rinadi. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Все шаги здесь выглядят верными. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Every step here looks correct. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Tekshiramiz. Uch yarimni qo'ysak, chapda oltining darajasi, o'ngda o'ttiz oltining o'sha darajasi. O'ngdagi asos katta, demak tenglik yo'q.", 'Проверим. Подставим три с половиной: слева шесть в степени, справа тридцать шесть в той же степени. Основание справа больше, значит равенства нет.', 'Let us check. Substitute three and a half: on the left six to a power, on the right thirty six to the same power. The base on the right is larger, so there is no equality.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const PARTS_14 = ['2ˣ', '3ˣ', '=', '8', '9', '27']

const S14 = {
  role: 'build',
  led: 'student',
  tag: 'same_base',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  axis: AXIS_B,
  marks: [{ v: 3, tone: 'graph' }],
  targetLabel: L('Maqsad ildizi', 'Целевой корень', 'Target root'),
  targetValue: 'x = 3',
  tasks: [
    {
      prompt: L('Asosi 2 bo\'lsin', 'Пусть основание будет 2', 'Let the base be 2'),
      template: [{ slot: 0 }, { slot: 1 }, { slot: 2 }],
      parts: PARTS_14,
      answer: ['2ˣ', '=', '8'],
      doneLabel: L('birinchi usul:  2ˣ = 8', 'первый способ: 2ˣ = 8', 'first way: 2ˣ = 8'),
      wrongs: [
        { key: '2ˣ|=|9', hint: L("To'qqiz ikkining darajasi emas.", 'Девять это не степень двойки.', 'Nine is not a power of two.') },
        { key: '2ˣ|=|27', hint: L("Yigirma yetti ham ikkining darajasi emas.", 'Двадцать семь тоже не степень двойки.', 'Twenty seven is not a power of two either.') },
        { key: '*', hint: L("Ikkining qaysi darajasi uchga teng ko'rsatkich beradi?", 'Какая степень двойки даёт показатель три?', 'Which power of two gives the exponent three?') },
      ],
    },
    {
      prompt: L("Endi asosi 3, ildiz esa o'sha", 'А теперь основание 3, а корень тот же', 'Now base 3, with the same root'),
      template: [{ slot: 0 }, { slot: 1 }, { slot: 2 }],
      parts: PARTS_14,
      answer: ['3ˣ', '=', '27'],
      doneLabel: L('ikkinchi usul:  3ˣ = 27', 'второй способ: 3ˣ = 27', 'second way: 3ˣ = 27'),
      wrongs: [
        { key: '3ˣ|=|9', hint: L("Bu to'g'ri yozuv, lekin ildizi ikki chiqadi, bizga esa uch kerak.", 'Это верная запись, но корень получается два, а нужен три.', 'That is a valid record, but the root is two, and we need three.') },
        { key: '3ˣ|=|8', hint: L("Sakkiz uchning darajasi emas.", 'Восемь это не степень тройки.', 'Eight is not a power of three.') },
        { key: '*', hint: L("Uchning kubi nechaga teng?", 'Чему равен три в кубе?', 'What is three cubed?') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xatoni topdingiz. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'You found the error. The last task is the reverse one.'),
    A('built1', "Endi o'sha ildiz, lekin asos uch bo'lishi kerak.", 'А теперь тот же корень, но основание должно быть три.', 'And now the same root, but the base must be three.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. Prognozlar, qoida, xukka qaytish.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_point',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'aᶠ = aᵍ  ⟺  f = g',
  ruleLines: [
    L('1. bitta asosga keltir', '1. приведи к одному основанию', '1. bring to one base'),
    L('2. daraja ikki marta — almashtirish t = aˣ, t > 0', '2. степень дважды — замена t = aˣ, t > 0', '2. power twice — substitute t = aˣ, t > 0'),
    L('3. ildizni boshlang\'ich tenglamaga qo\'yib tekshir', '3. проверь корень подстановкой в исходное', '3. check the root by substituting into the original'),
  ],
  predicts: [
    {
      screen: 0,
      expr: EQ_HOOK,
      right: L('bitta ildiz', 'один корень', 'one root'),
      map: {
        a: L('bitta ildiz', 'один корень', 'one root'),
        b: L('ikkita ildiz', 'два корня', 'two roots'),
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: EQ_SUB,
      right: '1',
      map: { a: '1', b: '2', c: '0', d: L("ildiz yo'q", 'корней нет', 'no roots') },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '9ˣ − 6·3ˣ − 27 = 0   →   t = 3ˣ > 0   →   t = 9   →   x = 2',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qoidaga va ikki nomzodli ekranga qayting', 'Вернись к правилу и к экрану с двумя кандидатами', 'Go back to the rule and to the two-candidates screen'),
  },
  probe: {
    question: L('Ildizingizni qanday tekshirasiz?', 'Как проверить свой корень?', 'How do you check your root?'),
    items: [
      { id: 'a', label: L('boshlang\'ich tenglamaga qo\'yish', 'подставить в исходное уравнение', 'substitute into the original equation'), correct: true },
      { id: 'b', label: L("o'sha usul bilan qayta yechish", 'решить второй раз тем же способом', 'solve it again the same way'), hint: L("O'sha usul o'sha xatoni takrorlaydi.", 'Тот же способ повторит ту же ошибку.', 'The same way repeats the same mistake.') },
      { id: 'c', label: L('javoblarga qarash', 'посмотреть в ответы', 'look at the answers'), hint: L("Imtihonda javoblar bo'lmaydi.", 'На экзамене ответов не будет.', 'On the exam there are no answers.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L('Butun dars tekshirdik. Nima bilan ekanini eslang.', 'Мы весь урок проверяли. Вспомни, чем.', 'We were checking all lesson. Recall with what.') },
    ],
  },
  sheetTitle: L('Ko\'rsatkichli tenglamalar · shpargalka', 'Показательные уравнения · шпаргалка', 'Exponential equations · cheat sheet'),
  sheetSrc: L('11-sinf · 9-dars', '11 класс · урок 9', 'Grade 11 · lesson 9'),
  lifehack: L(
    "10 sekundlik tekshiruv: ildizingizni boshlang'ich tenglamaga qo'ying. Ikki tomon teng bo'lishi shart.",
    'Проверка за 10 секунд: подставь свой корень в исходное уравнение. Обе части обязаны стать равными.',
    'A 10-second check: substitute your root into the original equation. Both sides must become equal.',
  ),
  holds: [2500, 8000, 4000, 4500],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik.", 'Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли.', 'Here is your guess and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked.'),
    A('rule', "Va mana dars boshlangan tenglama. Endi u uch qadamda yechiladi, ortiqcha ildiz esa o'zi tushib qoladi.", 'А вот уравнение, с которого урок начался. Теперь оно решается за три шага, и лишний корень отпадает сам.', 'And here is the equation the lesson began with. Now it takes three steps, and the extra root drops by itself.'),
    A('q', "Va eng muhimi: ildizga ishonchingiz bo'lmasa, o'zingiz tekshirish usuli bor.", 'И главное: если сомневаешься в корне, есть способ проверить самому.', 'And the main thing: if you are unsure of your root, there is a way to check it yourself.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
