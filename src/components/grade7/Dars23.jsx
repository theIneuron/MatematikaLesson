// ============================================================================
// 7-sinf, Dars 23. GURUHLASH USULI BILAN KO'PAYTUVCHILARGA AJRATISH.
// (Разложение многочлена на множители способом группировки)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// TO'RT HAD, IKKI GURUH, VA ENG MUHIMI -- UMUMIY QAVS. Blokning bu
// yerdagi xatosi etalonda ATALGAN: ikkinchi guruhda ishora almashtirilmaydi.
// Shuning uchun xuk ham guruhlash haqida emas, ISHORA haqida: `−x + 3` dan
// minus chiqarilganda qavsda `x − 3` bo'ladimi yoki `x + 3`.
//
// ASBOBLAR, HAMMASI TAYYOR:
//   zonalar -- to'rt hadni ikki guruhga tarqatish, «hammasi yoki hech nima»;
//   3 (yuza to'rtburchagi) -- ajratmani KO'PAYTIRIB tekshirish: to'rt katak
//     o'sha to'rt hadni qaytarishi shart;
//   son qo'yish -- ikkinchi guruhning ishorasi son bilan tekshiriladi.
//
// NEGA QAYTA YOZISH ASBOBI YO'Q. `a(b − 3) + b(b − 3)` yozuvida qavslar bor,
// va asbob yozuvni amal belgilari bo'yicha bo'ladi: bosiladigan «uchlik»
// qavsni kesib o'tadi va ma'nosiz bo'lib qoladi. Shuning uchun umumiy qavsni
// chiqarish 5-ekranda YOZUVNI YIG'ISH bilan beriladi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_23'
const LESSON_TITLE = L("Guruhlash usuli bilan ko'paytuvchilarga ajratish", 'Разложение многочлена на множители способом группировки', 'Factoring a polynomial by grouping')
const LESSON_NO = L('23-dars', 'Урок 23', 'Lesson 23')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 23 }

const TAGS = {
  Z1: L('guruh noto\'g\'ri tanlandi', 'группа выбрана неудачно', 'the grouping was a poor choice'),
  Z2: L('umumiy qavs ko\'rilmadi', 'общая скобка не увидена', 'the common bracket was not seen'),
  Z3: L('ikkinchi guruhda ishora', 'знак во второй группе', 'the sign in the second group'),
  Z4: L("ko'paytuvchi to'liq chiqarilmadi", 'множитель вынесен не весь', 'the factor was not fully taken out'),
  Z5: L('umumiysi yo\'q hadlar guruhlandi', 'сгруппировали то, у чего нет общего', 'terms with nothing in common were grouped'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Minus qavsdan ikki xil chiqarilgan. TABLODA: x besh
// bo'lganda chiqadigan qiymat. Boshlang'ich yozuvda u minus ikki.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('GURUHLASH USULI', 'СПОСОБ ГРУППИРОВКИ', 'THE GROUPING METHOD'),
  noBack: true,
  noNotes: true,
  title: L('Minus qavsdan chiqdi', 'Минус вышел за скобку', 'The minus went out of the bracket'),
  gate: {
    source: { kind: 'plain', tokens: ['−x', '+', '3'] },
    rows: [
      { tokens: ['−(x', '−', '3)'], value: '−2' },
      { tokens: ['−(x', '+', '3)'], value: '−8' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Minus qavsdan ikki xil chiqarilgan. Tabloda x besh bo'lgandagi qiymat turadi, boshlang'ich yozuvda esa u minus ikki. Kim haq?",
      'Минус вынесли за скобку двумя способами. На табло значение при x равном пяти, а у исходной записи оно минус два. Кто прав?',
      'The minus was taken out in two ways. The boards show the value at x equal to five, and the original record gives minus two. Who is right?',
    ),
    items: [
      {
        id: 'minus',
        label: L("Qavsda x minus uch turgani", 'Тот, у кого в скобке x минус три', 'The one whose bracket is x minus three'),
        hint: L(
          "Taxminingiz qabul qilindi. Son qo'yib tekshiramiz.",
          'Прогноз принят. Проверим подстановкой.',
          'Your prediction is taken. We will check it by substitution.',
        ),
      },
      {
        id: 'plus',
        label: L("Qavsda x qo'shuv uch turgani", 'Тот, у кого в скобке x плюс три', 'The one whose bracket is x plus three'),
        hint: L(
          "Beshni qo'ying: minus qavs sakkiz minus sakkiz beradi, kerak esa minus ikki.",
          'Подставь пять: минус скобка восемь даёт минус восемь, а надо минус два.',
          'Substitute five: minus the bracket eight gives minus eight, but minus two is needed.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham: minusni xohlagancha chiqarish mumkin', 'Оба: минус можно вынести как угодно', 'Both: a minus can be taken out any way'),
        hint: L(
          "Bitta x da ikki xil qiymat chiqsa, yozuvlardan bittasi boshlang'ichga teng emas.",
          'Если при одном x выходят два разных значения, одна из записей не равна исходной.',
          'If one x gives two different values, one of the records is not equal to the original.',
        ),
      },
      {
        id: 'no',
        label: L('Minusni umuman chiqarib bo\'lmaydi', 'Минус вообще нельзя вынести', 'A minus cannot be taken out at all'),
        hint: L(
          "Minus ham ko'paytuvchi: minus bir. Uni chiqarish oddiy chiqarishning o'zi.",
          'Минус это тоже множитель, минус один. Вынести его это обычное вынесение.',
          'A minus is a factor too, minus one. Taking it out is ordinary taking out.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bitta yozuvdan minus ikki xil chiqarilgan.", 'Из одной записи минус вынесли двумя способами.', 'A minus was taken out of one record in two ways.'),
    A('mount', "Tabloda x besh bo'lgandagi qiymat turadi. Boshlang'ich yozuvda u minus ikki.", 'На табло значение при x равном пяти. У исходной записи оно минус два.', 'The boards show the value at x equal to five. The original record gives minus two.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Uchta savol: chiqarish (22-dars), minusni chiqarish,
// va QAVS umumiy ko'paytuvchi bo'lishi. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  cols: 2,
  items: [
    {
      wrap: false,
      prompt: '2x² − 6x',
      ok: L("Ikki x ikkala hadda bor, va u qavs oldiga chiqdi.", 'Два x есть в обоих членах, и они вышли перед скобку.', 'Two x is in both terms, and it went before the bracket.'),
      items: [
        { id: 'a', label: '2x(x − 3)', correct: true },
        { id: 'b', label: '2x(x − 6)', tag: 'Z6', hint: L("Olti x ni ikki x ga bo'lsak uch chiqadi.", 'Шесть x разделить на два x это три.', 'Six x divided by two x is three.') },
        { id: 'c', label: '2(x² − 3x)', tag: 'Z4', hint: L("x harfi ikkala hadda ham bor, uni ham chiqarish kerak.", 'Буква x есть в обоих членах, её тоже надо вынести.', 'The letter x is in both terms, it must come out too.') },
        { id: 'd', label: '2x(x + 3)', tag: 'Z3', hint: L("Ikkinchi had manfiy edi.", 'Второй член был отрицательным.', 'The second term was negative.') },
      ],
    },
    {
      wrap: false,
      prompt: '−x + 3',
      ok: L("Minus bir chiqarildi, va qavsdagi ikki ishora ham almashdi.", 'Вынесли минус один, и оба знака в скобке перевернулись.', 'Minus one was taken out, and both signs inside flipped.'),
      items: [
        { id: 'a', label: '−(x − 3)', correct: true },
        { id: 'b', label: '−(x + 3)', tag: 'Z3', hint: L("Minus har hadning ishorasini almashtiradi, uchlikning ham.", 'Минус меняет знак каждого члена, и у тройки тоже.', 'The minus flips the sign of every term, the three included.') },
        { id: 'c', label: '(x − 3)', tag: 'Z3', hint: L("Birinchi had manfiy, shuning uchun minus qavs oldida qoladi.", 'Первый член отрицательный, поэтому минус остаётся перед скобкой.', 'The first term is negative, so the minus stays before the bracket.') },
        { id: 'd', label: '−(3 − x)', tag: 'Z3', hint: L("Qavs ichida hadlar tartibi saqlanadi, faqat ishoralar almashadi.", 'Внутри скобки порядок членов сохраняется, меняются только знаки.', 'Inside the bracket the order of terms stays, only the signs flip.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "a(b − 3) va b(b − 3) da nima umumiy?",
        'Что общего у a(b − 3) и b(b − 3)?',
        'What do a(b − 3) and b(b − 3) have in common?',
      ),
      ok: L("Qavs ikkalasida bir xil, ya'ni u umumiy ko'paytuvchi.", 'Скобка в обоих одна и та же, значит она общий множитель.', 'The bracket is the same in both, so it is a common factor.'),
      items: [
        { id: 'a', label: '(b − 3)', correct: true },
        { id: 'b', label: 'b', tag: 'Z2', hint: L("Birinchi ifodada b faqat qavs ichida turibdi, alohida ko'paytuvchi emas.", 'В первом выражении b стоит только внутри скобки, отдельным множителем она не является.', 'In the first expression b is only inside the bracket, not a separate factor.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Uchlik qavs ichida turadi, alohida ko'paytuvchi bo'lolmaydi.", 'Тройка стоит внутри скобки, отдельным множителем быть не может.', 'The three sits inside the bracket, it cannot be a separate factor.') },
        {
          id: 'd',
          label: L('umumiy narsa yo\'q', 'ничего общего нет', 'nothing in common'),
          tag: 'Z2',
          hint: L("Qavs ikkalasida bir xil yozilgan, demak u umumiy ko'paytuvchi.", 'Скобка в обоих написана одинаково, значит она общий множитель.', 'The bracket is written the same in both, so it is a common factor.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Uchinchisi bugungi darsning kalitini beradi.", 'Три коротких вопроса. Третий даёт ключ к сегодняшнему уроку.', 'Three short questions. The third gives the key to today.'),
    A('1', "Ikkinchisi minus haqida.", 'Второй про минус.', 'The second is about the minus.'),
    A('2', "Uchinchisiga diqqat: umumiy ko'paytuvchi QAVS ham bo'lishi mumkin.", 'Внимание на третий: общим множителем может быть и СКОБКА.', 'Watch the third: a BRACKET can be a common factor too.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. ZONALAR: to'rt hadni ikki guruhga tarqatish.
// «Hammasi yoki hech nima»: bitta had ham xato joyda bo'lsa, o'tmaydi.
// ============================================================
const S3 = {
  kind: 'sort',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('To\'rt hadni ikki guruhga', 'Четыре члена в две группы', 'Four terms into two groups'),
  zones: [
    { id: 'z1', label: L('Birinchi guruh', 'Первая группа', 'The first group') },
    { id: 'z2', label: L('Ikkinchi guruh', 'Вторая группа', 'The second group') },
  ],
  cards: [
    { id: 'c1', text: 'ab', zone: 'z1' },
    { id: 'c2', text: '−3a', zone: 'z1' },
    { id: 'c3', text: 'b²', zone: 'z2' },
    { id: 'c4', text: '−3b', zone: 'z2' },
  ],
  prompt: L(
    "ab − 3a + b² − 3b ni ikki guruhga tarqating: har guruhda umumiy ko'paytuvchi bo'lsin.",
    'Раскинь ab − 3a + b² − 3b по двум группам так, чтобы в каждой был общий множитель.',
    'Split ab − 3a + b² − 3b into two groups so that each has a common factor.',
  ),
  wrongs: [
    {
      tag: 'Z1',
      hint: L(
        "Guruhga umumiy harfi bor hadlar yig'iladi: a li ikki had va b li ikki had.",
        'В группу собираются члены с общей буквой: два члена с a и два члена с b.',
        'A group gathers terms with a shared letter: the two a terms and the two b terms.',
      ),
    },
  ],
  okNote: L(
    "Birinchi guruhda umumiy ko'paytuvchi a, ikkinchisida b. Va ikkovida bir xil qavs qoladi.",
    'В первой группе общий множитель a, во второй b. И в обеих остаётся одна и та же скобка.',
    'The first group has a as its common factor, the second has b. And both leave the same bracket.',
  ),
  audio: [
    A('mount', "To'rt had bor. Ularni ikki guruhga bo'lamiz.", 'Есть четыре члена. Разобьём их на две группы.', 'There are four terms. Let us split them into two groups.'),
    A('mount', "Shart bitta: har guruhda umumiy ko'paytuvchi bo'lishi kerak.", 'Условие одно: в каждой группе должен быть общий множитель.', 'One condition: each group must have a common factor.'),
    A('ok', "Birinchi guruhda a, ikkinchisida b chiqadi.", 'В первой группе выносится a, во второй b.', 'The first group gives a, the second gives b.'),
  ],
}

// ============================================================
// 4. FARQLASH. AJRATMA KO'PAYTIRILGANDA boshlang'ich yozuvni
// QAYTARISHI SHART. To'rt katak -- o'sha to'rt had.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ajratma ko\'paytirilganda', 'Разложение под умножением', 'The factorization under multiplication'),
  caption: L(
    "Bu chiqqan ko'paytma. To'rt katakni ochib, boshlang'ich to'rt had bilan solishtiring.",
    'Вот полученное произведение. Открой четыре клетки и сверь с исходными четырьмя членами.',
    'Here is the product we got. Open the four cells and compare with the original four terms.',
  ),
  left: ['b', '−3'],
  top: ['a', '+b'],
  options: [
    { id: 'a', label: 'ab + b² − 3a − 3b' },
    { id: 'b', label: 'ab − 3b' },
    { id: 'c', label: 'ab + b² + 3a + 3b' },
    { id: 'd', label: 'ab + b² − 3a + 3b' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ikki katak bo'sh qoldi: b karra b va minus uch karra a.", 'Две клетки остались пустыми: b на b и минус три на a.', 'Two cells stayed empty: b times b and minus three times a.') },
    { key: 'c', tag: 'Z3', hint: L("Chapda minus uch turibdi, uning ikki ko'paytmasi manfiy.", 'Слева стоит минус три, оба его произведения отрицательны.', 'Minus three stands on the left, and both of its products are negative.') },
    { key: 'd', tag: 'Z3', hint: L("Minus uch karra b manfiy bo'ladi.", 'Минус три на b выходит отрицательным.', 'Minus three times b comes out negative.') },
  ],
  note: L(
    "To'rt katak o'sha to'rt hadni qaytardi. Demak ajratma to'g'ri: ko'paytirish guruhlashni tekshiradi.",
    'Четыре клетки вернули те же четыре члена. Значит разложение верное: умножение проверяет группировку.',
    'The four cells gave back the same four terms. So the factorization is right: multiplication checks the grouping.',
  ),
  audio: [
    A('mount', "Guruhlashdan chiqqan ko'paytma shu: qavs b minus uch karra qavs a qo'shuv b.", 'Из группировки вышло произведение: скобка b минус три на скобку a плюс b.', 'The grouping gave this product: the bracket b minus three times the bracket a plus b.'),
    A('mount', "Uni ko'paytirib, boshlang'ich yozuv qaytishini tekshiramiz.", 'Умножим его и проверим, вернётся ли исходная запись.', 'Let us multiply it and check whether the original record comes back.'),
    A('cell-all', "To'rt katak ochildi. Hadlar o'sha to'rttasi.", 'Четыре клетки открыты. Члены те же четыре.', 'All four cells are open. The terms are the same four.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. UMUMIY QAVSNI CHIQARISH. Asbobsiz: qavs
// ko'paytuvchi bo'lib chiqadi, oldida turganlar ikkinchi qavsga
// yig'iladi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Umumiy qavs chiqadi', 'Общая скобка выносится', 'The common bracket comes out'),
  lines: ['a(b − 3) + b(b − 3)'],
  template: ['=  (', { slot: 0 }, ')(', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: 'b − 3' },
    { id: 'b', label: 'a + b' },
    { id: 'c', label: 'a · b' },
    { id: 'd', label: 'b + 3' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Umumiy qavsni chiqaring, oldida turganlar ikkinchi qavs bo'ladi.",
    'Вынеси общую скобку, а то, что стояло перед ней, станет второй скобкой.',
    'Take out the common bracket, and what stood before it becomes the second bracket.',
  ),
  checkNote: L(
    "Qavs b minus uch ikkala qo'shiluvchida ham bor, ya'ni umumiy ko'paytuvchi. Uning oldida a va b turgan edi.",
    'Скобка b минус три есть в обоих слагаемых, значит она общий множитель. Перед ней стояли a и b.',
    'The bracket b minus three is in both addends, so it is a common factor. Before it stood a and b.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Qavslar oldida a va b turibdi, ular orasida qo'shuv.", 'Перед скобками стоят a и b, между ними сложение.', 'Before the brackets stand a and b, with a plus between them.') },
    { key: 'd', tag: 'Z3', hint: L("Ikkala qo'shiluvchida ham qavs bir xil, uning ichidagi ishora o'zgarmaydi.", 'В обоих слагаемых скобка одна и та же, знак внутри не меняется.', 'The bracket is the same in both addends, the sign inside does not change.') },
    { key: '*', tag: 'Z2', hint: L("Umumiy ko'paytuvchi bu qavsning o'zi.", 'Общий множитель это сама скобка.', 'The common factor is the bracket itself.') },
  ],
  audio: [
    A('mount', "Guruhlar chiqarildi va bir xil qavs paydo bo'ldi.", 'Из групп вынесли множители, и появилась одинаковая скобка.', 'The groups gave their factors, and the same bracket appeared.'),
    A('mount', "Endi shu qavs o'zi umumiy ko'paytuvchi bo'ladi va qavsdan chiqadi.", 'Теперь эта скобка сама становится общим множителем и выносится.', 'Now that bracket itself becomes the common factor and comes out.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. IKKINCHI GURUHDA KO'PAYTUVCHI BIRLIK: uni ko'rish
// oson emas, lekin usul aynan shunda ishlaydi.
// ============================================================
const S6 = {
  kind: 'sort',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikkinchi guruhda ko\'paytuvchi ko\'rinmaydi', 'Во второй группе множителя не видно', 'The second group hides its factor'),
  zones: [
    { id: 'z1', label: L('Birinchi guruh', 'Первая группа', 'The first group') },
    { id: 'z2', label: L('Ikkinchi guruh', 'Вторая группа', 'The second group') },
  ],
  cards: [
    { id: 'c1', text: 'x³', zone: 'z1' },
    { id: 'c2', text: '+x²', zone: 'z1' },
    { id: 'c3', text: '+x', zone: 'z2' },
    { id: 'c4', text: '+1', zone: 'z2' },
  ],
  prompt: L(
    "x³ + x² + x + 1 ni ikki guruhga tarqating. Ikkinchi guruhda ko'paytuvchi bor, faqat u ko'rinmaydi.",
    'Раскинь x³ + x² + x + 1 по двум группам. Во второй группе множитель есть, просто его не видно.',
    'Split x³ + x² + x + 1 into two groups. The second group has a factor, it is just not visible.',
  ),
  wrongs: [
    {
      tag: 'Z1',
      hint: L(
        "Birinchi ikki had x kvadratga bo'linadi. Oxirgi ikkitasining umumiy ko'paytuvchisi birlik, va bu yetarli.",
        'Первые два члена делятся на x в квадрате. У последних двух общий множитель единица, и этого достаточно.',
        'The first two terms divide by x squared. The last two share a factor of one, and that is enough.',
      ),
    },
  ],
  okNote: L(
    "Birinchi guruhdan x kvadrat, ikkinchisidan birlik chiqadi. Ikkovida ham qavs x qo'shuv bir qoladi.",
    'Из первой группы выносится x в квадрате, из второй единица. В обеих остаётся скобка x плюс один.',
    'The first group gives x squared, the second gives one. Both leave the bracket x plus one.',
  ),
  audio: [
    A('mount', "To'rt had, hammasi qo'shuv bilan.", 'Четыре члена, все со сложением.', 'Four terms, all with plus signs.'),
    A('mount', "Ikkinchi guruhda ko'paytuvchi birlik bo'ladi, va shu birlik ishni tugatadi.", 'Во второй группе множителем будет единица, и она доводит дело до конца.', 'In the second group the factor is one, and that one finishes the job.'),
    A('ok', "Ikkovida ham qavs x qo'shuv bir chiqdi.", 'В обеих вышла скобка x плюс один.', 'Both gave the bracket x plus one.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: ikkinchi guruh MINUS
// bilan boshlanadi. Umumiy qavs faqat ishoralar almashganda chiqadi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Ikkinchi guruh minus bilan', 'Вторая группа с минуса', 'The second group starts with a minus'),
  letter: 'x',
  numbers: [1, 2, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '2x² − 6x − x + 3', sub: (n) => '2 · ' + n + '² − 6 · ' + n + ' − ' + n + ' + 3', val: (n) => 2 * n * n - 6 * n - n + 3 },
    { id: 'r2', expr: '(x − 3)(2x − 1)', sub: (n) => '(' + n + ' − 3)(2 · ' + n + ' − 1)', val: (n) => (n - 3) * (2 * n - 1) },
  ],
  probe: {
    question: L(
      "Ikkinchi guruh minus x qo'shuv uch. Undan qanday qavs chiqadi?",
      'Вторая группа это минус x плюс три. Какая скобка из неё выходит?',
      'The second group is minus x plus three. Which bracket comes out of it?',
    ),
    items: [
      {
        id: 'flip',
        correct: true,
        label: L('x minus uch: minus chiqdi va ishoralar almashdi', 'x минус три: минус вынесли, и знаки перевернулись', 'x minus three: the minus came out and the signs flipped'),
      },
      {
        id: 'keep',
        tag: 'Z3',
        label: L("x qo'shuv uch", 'x плюс три', 'x plus three'),
        hint: L(
          "Unda umumiy qavs chiqmaydi, umumiy qavssiz esa guruhlash ishlamaydi.",
          'Тогда общей скобки не получится, а без неё группировка не работает.',
          'Then no common bracket appears, and without it the grouping does not work.',
        ),
      },
      {
        id: 'one',
        tag: 'Z3',
        label: L("minus x qo'shuv uch, qavsni o'zgartirmasa ham bo'ladi", 'минус x плюс три, скобку менять не надо', 'minus x plus three, no need to change the bracket'),
        hint: L(
          "Qavs umumiy bo'lishi uchun minus uning oldiga chiqariladi.",
          'Чтобы скобка стала общей, минус выносится за неё.',
          'For the bracket to become common, the minus is taken out in front of it.',
        ),
      },
      {
        id: 'no',
        tag: 'Z1',
        label: L('Ikkinchi guruhni boshqacha olish kerak edi', 'Вторую группу надо было взять другой', 'The second group should have been chosen differently'),
        hint: L(
          "Guruhlar to'g'ri: birinchisida ikki x, ikkinchisida birlik chiqadi.",
          'Группы выбраны верно: в первой выносится два x, во второй единица.',
          'The groups are right: the first gives two x, the second gives one.',
        ),
      },
    ],
  },
  okText: L(
    "Ikkinchi guruhdan minus bir chiqariladi, va qavs ichidagi ikki ishora ham almashadi. Faqat shundan keyin qavs umumiy bo'ladi.",
    'Из второй группы выносится минус один, и оба знака внутри скобки переворачиваются. Только тогда скобка становится общей.',
    'Minus one is taken out of the second group, and both signs inside flip. Only then does the bracket become common.',
  ),
  audio: [
    A('mount', "Yuqorida to'rt hadli yozuv, pastda ikki qavsning ko'paytmasi.", 'Сверху запись из четырёх членов, снизу произведение двух скобок.', 'Above a record of four terms, below a product of two brackets.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('hadlarni guruhlarga bo\'lamiz', 'разбиваем члены на группы', 'we split the terms into groups') },
    { id: 'f2', label: L("har guruhda umumiy ko'paytuvchini chiqaramiz", 'в каждой группе выносим общий множитель', 'in each group we take out the common factor') },
    { id: 'f3', label: L('qavs ikkovida bir xil chiqadi', 'скобка получается одна и та же', 'the bracket comes out the same in both') },
    { id: 'f4', label: L("uni chiqarib ko'paytma olamiz", 'выносим её и получаем произведение', 'we take it out and get a product') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval guruhlar, keyin har guruhda chiqarish, keyin bir xil qavs, oxirida ko'paytma.",
    'Порядок нарушен. Сначала группы, потом вынесение в каждой, потом одинаковая скобка, в конце произведение.',
    'The order is off. Groups first, then taking out in each, then the same bracket, and the product last.',
  ),
  lawChips: [
    { label: '( ) ( )', tone: 'par' },
    { label: '+', tone: 's1' },
    { label: '−', tone: 's1' },
    { label: '2 · 2', tone: 'off' },
  ],
  lawSweep: L(
    'ikki guruh, ishora, umumiy qavs',
    'две группы, знак, общая скобка',
    'two groups, the sign, the common bracket',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ko'phadni guruhlash usuli bilan ko'paytuvchilarga ajratish uchun hadlarni guruhlarga bo'lish, har guruhda umumiy ko'paytuvchini chiqarish va so'ngra umumiy qavsni chiqarish kerak.",
        'Чтобы разложить многочлен на множители способом группировки, надо разбить его члены на группы, вынести общий множитель в каждой группе и затем вынести общую скобку.',
        'To factor a polynomial by grouping, split its terms into groups, take out the common factor in each group and then take out the common bracket.',
      ),
      L(
        "Agar guruh minus bilan boshlansa, minus ko'paytuvchi bilan birga chiqadi va qavs ichidagi HAR hadning ishorasi almashadi. Umumiy qavs faqat shunda paydo bo'ladi.",
        'Если группа начинается с минуса, минус выносится вместе с множителем, и знак КАЖДОГО члена внутри скобки меняется. Общая скобка появляется только при этом.',
        'If a group starts with a minus, the minus comes out with the factor and the sign of EVERY term inside flips. Only then does the common bracket appear.',
      ),
    ],
  },
  hookCap: L(
    'Minus qavsdan chiqsa, har ishora almashadi',
    'Минус за скобку переворачивает каждый знак',
    'A minus taken out flips every sign',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('ikki guruh', 'две группы', 'two groups'),
    L("har birida o'z ko'paytuvchisi", 'своя множитель в каждой', 'its own factor in each'),
    L('qavs umumiy', 'скобка общая', 'the bracket is shared'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik: guruhlar, birlik va minus. Endi qoidani yig'amiz.", 'Все случаи мы увидели: группы, единица и минус. Теперь соберём правило.', 'We have seen all the cases: groups, the one and the minus. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu blokda bitta dars qoldi: bo'lish.", 'Верно. В этом блоке остался один урок: деление.', 'Correct. One lesson is left in this block: division.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "ab + 5a + 3b + 15 ni qanday guruhlash umumiy qavsga olib keladi?",
        'Какая группировка ab + 5a + 3b + 15 ведёт к общей скобке?',
        'Which grouping of ab + 5a + 3b + 15 leads to a common bracket?',
      ),
      ok: L("Birinchi guruhdan a, ikkinchisidan uch chiqadi, ikkovida qavs b qo'shuv besh qoladi.", 'Из первой группы выносится a, из второй тройка, и в обеих остаётся скобка b плюс пять.', 'The first group gives a, the second gives three, and both leave the bracket b plus five.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('(ab + 5a) va (3b + 15)', '(ab + 5a) и (3b + 15)', '(ab + 5a) and (3b + 15)'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L('(ab + 15) va (5a + 3b)', '(ab + 15) и (5a + 3b)', '(ab + 15) and (5a + 3b)'),
          hint: L("Birinchi guruhda umumiy ko'paytuvchi yo'q: a b va o'n besh.", 'В первой группе нет общего множителя: a b и пятнадцать.', 'The first group has no common factor: a b and fifteen.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('(ab + 5a + 3b) va (15)', '(ab + 5a + 3b) и (15)', '(ab + 5a + 3b) and (15)'),
          hint: L("Guruhlar teng bo'linadi: ikkitadan had.", 'Группы делятся поровну: по два члена.', 'The groups split evenly: two terms each.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L('(5a + 3b + 15) va (ab)', '(5a + 3b + 15) и (ab)', '(5a + 3b + 15) and (ab)'),
          hint: L("Bitta haddan guruh bo'lmaydi, undan chiqaradigan narsa yo'q.", 'Из одного члена группы не получится, выносить из него нечего.', 'One term makes no group, there is nothing to take out of it.'),
        },
      ],
    },
    {
      wrap: false,
      prompt: '3x³ + 3x² + 4x + 4',
      ok: L("Birinchi guruhdan uch x kvadrat, ikkinchisidan to'rt chiqadi.", 'Из первой группы выносится три x в квадрате, из второй четвёрка.', 'The first group gives three x squared, the second gives four.'),
      items: [
        { id: 'a', label: '(x + 1)(3x² + 4)', correct: true },
        { id: 'b', label: '(x + 1)(3x² + 4x)', tag: 'Z6', hint: L("To'rt x va to'rtni to'rtga bo'lsak x va bir chiqadi, x qolmaydi.", 'Четыре x и четыре, делённые на четыре, дают x и один, лишнего x не остаётся.', 'Four x and four divided by four give x and one, no extra x is left.') },
        { id: 'c', label: '(3x² + 4)(x − 1)', tag: 'Z3', hint: L("Ikkala guruh ham qo'shuv bilan, qavsda minus paydo bo'lmaydi.", 'Обе группы со сложением, минус в скобке не появляется.', 'Both groups have plus signs, no minus appears in the bracket.') },
        { id: 'd', label: '(x + 1)(3x + 4)', tag: 'Z4', hint: L("Birinchi guruhda uch x kub va uch x kvadrat, ulardan uch x KVADRAT chiqadi.", 'В первой группе три x в кубе и три x в квадрате, из них выносится три x в КВАДРАТЕ.', 'The first group has three x cubed and three x squared, so three x SQUARED comes out.') },
      ],
    },
    {
      wrap: false,
      prompt: '5x² − 5x − 2x + 2',
      ok: L("Ikkinchi guruhdan minus ikki chiqdi va qavs ichidagi ishoralar almashdi.", 'Из второй группы вынесли минус два, и знаки в скобке перевернулись.', 'Minus two came out of the second group, and the signs inside flipped.'),
      items: [
        { id: 'a', label: '(x − 1)(5x − 2)', correct: true },
        { id: 'b', label: '(x − 1)(5x + 2)', tag: 'Z3', hint: L("Ikkinchi guruh minus bilan boshlanadi, shuning uchun ikkinchi qavsda minus ikki turadi.", 'Вторая группа начинается с минуса, поэтому во второй скобке минус два.', 'The second group starts with a minus, so the second bracket holds minus two.') },
        { id: 'c', label: '(x + 1)(5x − 2)', tag: 'Z3', hint: L("Birinchi guruhdan besh x chiqsa, qavsda x minus bir qoladi.", 'Если из первой группы вынести пять x, в скобке останется x минус один.', 'Taking five x out of the first group leaves x minus one.') },
        { id: 'd', label: '(x − 1)(5x² − 2)', tag: 'Z4', hint: L("Besh x kvadrat va besh x dan besh x chiqadi, x kvadrat emas.", 'Из пяти x в квадрате и пяти x выносится пять x, а не x в квадрате.', 'From five x squared and five x we take five x, not x squared.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "x³ + x² + x + 1 da ikkinchi guruh x qo'shuv bir. Undan qaysi ko'paytuvchi chiqadi?",
        'В x³ + x² + x + 1 вторая группа это x плюс один. Какой множитель из неё выносится?',
        'In x³ + x² + x + 1 the second group is x plus one. Which factor comes out of it?',
      ),
      ok: L("Birlik chiqadi, va shundan keyin qavs ikkovida bir xil bo'ladi.", 'Выносится единица, и после этого скобка в обеих одна и та же.', 'One comes out, and after that the bracket is the same in both.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '0', tag: 'Z2', hint: L("Nol chiqarilsa butun guruh yo'qolardi.", 'Если вынести ноль, вся группа исчезла бы.', 'Taking out zero would make the whole group vanish.') },
        { id: 'c', label: 'x', tag: 'Z5', hint: L("Ikkinchi hadda x harfi yo'q, u birlik.", 'Во втором члене буквы x нет, это единица.', 'The second term has no x, it is a one.') },
        {
          id: 'd',
          tag: 'Z2',
          label: L("hech narsa chiqarilmaydi", 'ничего не выносится', 'nothing comes out'),
          hint: L("Umumiy qavs paydo bo'lishi uchun guruhdan birlik chiqariladi.", 'Чтобы появилась общая скобка, из группы выносится единица.', 'For the common bracket to appear, a one is taken out of the group.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Birinchisida guruhlashning o'zi so'raladi.", 'Четыре вопроса. В первом спрашивают саму группировку.', 'Four questions. The first asks about the grouping itself.'),
    A('1', "Ikkinchisida ko'rsatkichlarga diqqat.", 'Во втором внимание на показатели.', 'In the second, watch the exponents.'),
    A('2', "Uchinchisida ikkinchi guruh minus bilan.", 'В третьем вторая группа с минуса.', 'In the third the second group starts with a minus.'),
    A('3', "Oxirgisi birlik haqida.", 'Последний про единицу.', 'The last is about the one.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: avval guruhlardan chiqarish, keyin
// umumiy qavs.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki qadamda', 'В два шага', 'In two steps'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['x³ + 2x² + 3x + 6  =  ', { slot: 0 }, '(x + 2) + ', { slot: 1 }, '(x + 2)'],
  parts: [
    { id: 'a', label: 'x²' },
    { id: 'b', label: '3' },
    { id: 'c', label: 'x' },
    { id: 'd', label: '3x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Har guruhdan ko'paytuvchini chiqaring. Qavs bir xil bo'lishi kerak.",
    'Вынеси множитель в каждой группе. Скобка должна получиться одна и та же.',
    'Take out the factor in each group. The bracket must come out the same.',
  ),
  checkNote: L(
    "Birinchi guruhdan x kvadrat, ikkinchisidan uchlik chiqdi, va qavs x qo'shuv ikki umumiy bo'ldi.",
    'Из первой группы вынесли x в квадрате, из второй тройку, и скобка x плюс два стала общей.',
    'The first group gave x squared, the second gave three, and the bracket x plus two became common.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("x kub va ikki x kvadratdan x KVADRAT chiqadi.", 'Из x в кубе и двух x в квадрате выносится x в КВАДРАТЕ.', 'From x cubed and two x squared, x SQUARED comes out.') },
    { key: 'd', tag: 'Z6', hint: L("Uch x va olti uchga bo'linadi, harf chiqmaydi.", 'Три x и шесть делятся на три, буква при этом не выносится.', 'Three x and six divide by three, no letter comes out.') },
    { key: '*', tag: 'Z2', hint: L("Ikki guruhdan bir xil qavs chiqishi kerak.", 'Из двух групп должна выйти одна и та же скобка.', 'The two groups must give the same bracket.') },
  ],
  probe: {
    question: L("Umumiy qavs chiqarilgandan keyin nima bo'ladi?", 'Что получится после вынесения общей скобки?', 'What comes out after the common bracket is taken out?'),
    items: [
      { id: 'a', correct: true, label: '(x + 2)(x² + 3)' },
      { id: 'b', tag: 'Z6', label: '(x + 2)(x² · 3)', hint: L("Qavslar oldida x kvadrat va uch turgan edi, ular orasida qo'shuv.", 'Перед скобками стояли x в квадрате и три, между ними сложение.', 'Before the brackets stood x squared and three, with a plus between.') },
      { id: 'c', tag: 'Z4', label: '(x + 2)(x + 3)', hint: L("Birinchi guruhdan x kvadrat chiqqan edi.", 'Из первой группы выносилось x в квадрате.', 'The first group gave x squared.') },
      { id: 'd', tag: 'Z2', label: '(x² + 3)(x + 6)', hint: L("Umumiy qavs x qo'shuv ikki.", 'Общая скобка это x плюс два.', 'The common bracket is x plus two.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval guruhlardan chiqarish, keyin umumiy qavs.", 'Два шага. Сначала вынесение из групп, потом общая скобка.', 'Two steps. Taking out from the groups first, then the common bracket.'),
    A('mount', "Qavs ikkovida bir xil chiqmasa, guruhlashni almashtirish kerak.", 'Если скобка в обеих выйдет разной, группировку надо поменять.', 'If the bracket comes out different in the two, the grouping must change.'),
    A('two', "Endi ikkinchi qadam: umumiy qavsni chiqaring.", 'Теперь второй шаг: вынеси общую скобку.', 'Now the second step: take out the common bracket.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Asbob yo'q, to'rt had va ikki ishora.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('To\'rt haddan ikki qavs', 'Из четырёх членов две скобки', 'Two brackets out of four terms'),
  template: ['ab − 4a + 5b − 20  =  (', { slot: 0 }, ')(', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: 'b − 4' },
    { id: 'b', label: 'a + 5' },
    { id: 'c', label: 'b + 4' },
    { id: 'd', label: 'a − 5' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki guruh ham bir xil qavs beradi. Ko'paytmani yig'ing.",
    'Обе группы дают одну и ту же скобку. Собери произведение.',
    'Both groups give the same bracket. Build the product.',
  ),
  checkNote: L(
    "Birinchi ikki haddan a, oxirgi ikkitasidan beshlik chiqadi, va ikkovida b minus to'rt qoladi.",
    'Из первых двух членов выносится a, из последних двух пятёрка, и в обеих остаётся b минус четыре.',
    'The first two terms give a, the last two give five, and both leave b minus four.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Birinchi guruhda minus to'rt a turibdi, demak qavsda minus bo'ladi.", 'В первой группе стоит минус четыре a, значит в скобке минус.', 'The first group holds minus four a, so the bracket takes a minus.') },
    { key: 'd', tag: 'Z3', hint: L("Beshlik oldida qo'shuv turibdi.", 'Перед пятёркой стоит сложение.', 'The five has a plus before it.') },
    { key: '*', tag: 'Z2', hint: L("Ikki guruhdan bir xil qavs chiqadi, u birinchi ko'paytuvchi bo'ladi.", 'Из двух групп выходит одна и та же скобка, она и станет первым множителем.', 'The two groups give the same bracket, and it becomes the first factor.') },
  ],
  audio: [
    A('mount', "Bu safar yordam yo'q. To'rt had, ikkita ishora.", 'На этот раз без помощи. Четыре члена, два знака.', 'This time without help. Four terms, two signs.'),
    A('mount', "Guruhlarni o'zingiz oling va bir xil qavsni izlang.", 'Возьми группы сам и ищи одинаковую скобку.', 'Choose the groups yourself and look for the matching bracket.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ikki guruhdan ham ko'paytuvchi TO'G'RI chiqarilgan,
// lekin ikkinchisida ISHORA almashtirilmagan -- va umumiy qavs
// yo'qolgan. Blokning atalgan xatosi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ikki guruh ham to'g'ri tanlangan, birinchisi to'g'ri chiqarilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Обе группы выбраны верно, первая вынесена верно. И всё же какая строка ошибочна?',
    'Both groups are chosen right and the first is taken out right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '2x² − 6x − x + 3' },
    { id: 'r2', text: '2x² − 6x = 2x(x − 3)' },
    { id: 'r3', text: '−x + 3 = −(x + 3)' },
    { id: 'r4', text: L('2x(x − 3) − (x + 3)', '2x(x − 3) − (x + 3)', '2x(x − 3) − (x + 3)') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: ikki x chiqarildi, qavsda x minus uch qoldi.", 'Верно: вынесли два x, в скобке осталось x минус три.', 'Right: two x came out and the bracket kept x minus three.'),
    r4: L("Bu qator oldingisidan chiqadi. Xato undan oldin paydo bo'lgan.", 'Эта строка следует из предыдущей. Ошибка появилась раньше.', 'This line follows from the previous one. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z3', r2: 'Z3', r4: 'Z3' },
  proofFill: {
    template: ['−x + 3  =  −(x ', { slot: 0 }, ' 3)   →   (x − 3)(', { slot: 1 }, ')'],
    parts: [
      { id: 'a', label: '−' },
      { id: 'b', label: '2x − 1' },
      { id: 'c', label: '+' },
      { id: 'd', label: '2x + 1' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Qavsdagi ishorani tuzating va ajratmani oxiriga yetkazing.",
      'Исправь знак в скобке и доведи разложение до произведения.',
      'Fix the sign in the bracket and finish the factorization.',
    ),
    checkNote: L(
      "Minus chiqarilganda ikkala ishora ham almashadi. Shundan keyin qavs x minus uch umumiy bo'ladi.",
      'При вынесении минуса оба знака переворачиваются. После этого скобка x минус три становится общей.',
      'Taking out the minus flips both signs. After that the bracket x minus three becomes common.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z3', hint: L("Minus bir har hadga ko'paytiriladi, ya'ni ishoralar almashadi.", 'Минус один умножается на каждый член, значит знаки меняются.', 'Minus one multiplies every term, so the signs flip.') },
      { key: 'd', tag: 'Z3', hint: L("Qavs oldida minus turgan edi, demak ikkinchi qavsda minus bir bo'ladi.", 'Перед скобкой стоял минус, значит во второй скобке минус один.', 'A minus stood before the bracket, so the second bracket holds minus one.') },
      { key: '*', tag: 'Z3', hint: L("Ikkinchi guruhdan minus chiqariladi.", 'Из второй группы выносится минус.', 'A minus is taken out of the second group.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda guruhlar to'g'ri tanlangan.", 'В этой ловушке группы выбраны верно.', 'In this trap the groups are chosen right.'),
    A('mount', "Shunday bo'lsa ham umumiy qavs chiqmadi. Xato birinchi qaysi qatorda.", 'И всё же общей скобки не получилось. В какой строке ошибка впервые.', 'And yet no common bracket appeared. Which line has the mistake first.'),
    A('proof', "Topdingiz. Minus chiqarilganda uchlikning ishorasi ham almashishi kerak edi.", 'Нашёл. При вынесении минуса знак тройки тоже должен был поменяться.', 'You found it. Taking out the minus should have flipped the sign of the three too.'),
    A('done', "Endi qavs ikkovida bir xil, va ko'paytma chiqdi.", 'Теперь скобка в обеих одна и та же, и произведение получилось.', 'Now the bracket is the same in both, and the product came out.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. TESKARI YO'L: ko'paytma berilgan, to'rt hadni
// tiklash kerak -- ya'ni guruhlarni ko'rish.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE INVERSE TASK'),
  title: L('To\'rt hadni tiklash', 'Восстановить четыре члена', 'Restoring the four terms'),
  given: L(
    "Ko'paytma ma'lum. Guruhlashdan oldin to'rt had qanday turgan edi?",
    'Произведение известно. Как стояли четыре члена до группировки?',
    'The product is known. How did the four terms stand before the grouping?',
  ),
  template: ['(x − 3)(2x − 1)  =  2x² − x − ', { slot: 0 }, ' + ', { slot: 1 }],
  parts: [
    { id: 'a', label: '6x' },
    { id: 'b', label: '3' },
    { id: 'c', label: '3x' },
    { id: 'd', label: '6' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ko'paytmani ochib, ikkinchi guruhga tushadigan hadlarni yozing.",
    'Раскрой произведение и запиши члены, которые попадут во вторую группу.',
    'Expand the product and write the terms that fall into the second group.',
  ),
  checkNote: L(
    "−3 · 2x = −6x, −3 · (−1) = +3. Bu ikkovi ikkinchi guruh.",
    '−3 · 2x = −6x, а −3 · (−1) = +3. Эти два и есть вторая группа.',
    '−3 · 2x = −6x, and −3 · (−1) = +3. Those two are the second group.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("Minus uch ikki x ga ko'paytiriladi, ya'ni olti x chiqadi.", 'Минус три умножается на два x, значит выйдет шесть x.', 'Minus three is multiplied by two x, so six x comes out.') },
    { key: 'd', tag: 'Z6', hint: L("Minus uch karra minus bir uch beradi.", 'Минус три на минус один даёт три.', 'Minus three times minus one gives three.') },
    { key: '*', tag: 'Z6', hint: L("Har had har hadga: to'rt ko'paytma bo'ladi.", 'Каждый член на каждый: произведений будет четыре.', 'Every term by every term: there will be four products.') },
  ],
  audio: [
    A('mount', "Teskari yo'l: ko'paytma bor, to'rt had esa yo'q.", 'Обратный путь: произведение есть, а четырёх членов нет.', 'The inverse path: the product is there, the four terms are not.'),
    A('mount', "Ikkinchi qavsdan chiqadigan ikki ko'paytmani hisoblang.", 'Посчитай два произведения, которые дают вторую группу.', 'Work out the two products that make the second group.'),
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
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: 'ab + 2a + 3b + 6',
      ok: L("Birinchi guruhdan a, ikkinchisidan uch chiqdi.", 'Из первой группы вынесли a, из второй тройку.', 'The first group gave a, the second gave three.'),
      items: [
        { id: 'a', label: '(b + 2)(a + 3)', correct: true },
        { id: 'b', label: '(b + 2)(a + 6)', tag: 'Z6', hint: L("Ikkinchi guruhdan uch chiqadi, olti emas: uch b va olti uchga bo'linadi.", 'Из второй группы выносится три, а не шесть: три b и шесть делятся на три.', 'The second group gives three, not six: three b and six divide by three.') },
        { id: 'c', label: '(b + 3)(a + 2)', tag: 'Z6', hint: L("Birinchi guruhdan qavs b qo'shuv ikki chiqadi.", 'Из первой группы выходит скобка b плюс два.', 'The first group gives the bracket b plus two.') },
        { id: 'd', label: '(b + 2)(a − 3)', tag: 'Z3', hint: L("Uchinchi va to'rtinchi hadlar musbat, minus paydo bo'lmaydi.", 'Третий и четвёртый члены положительны, минус не появляется.', 'The third and fourth terms are positive, no minus appears.') },
      ],
    },
    {
      wrap: false,
      question: L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is its value?'),
      prompt: 'x³ − x² + 4x − 4',
      ok: L("Birinchi guruhdan x kvadrat, ikkinchisidan to'rt chiqdi, qavs x minus bir.", 'Из первой группы вынесли x в квадрате, из второй четвёрку, скобка x минус один.', 'The first group gave x squared, the second gave four, and the bracket is x minus one.'),
      items: [
        { id: 'a', label: '(x − 1)(x² + 4)', correct: true },
        { id: 'b', label: '(x − 1)(x² − 4)', tag: 'Z3', hint: L("Ikkinchi guruh qo'shuv bilan qo'shilgan, ya'ni ikkinchi qavsda musbat to'rt.", 'Вторая группа присоединена сложением, значит во второй скобке плюс четыре.', 'The second group is joined by a plus, so the second bracket holds plus four.') },
        { id: 'c', label: '(x + 1)(x² + 4)', tag: 'Z3', hint: L("Birinchi guruhda minus x kvadrat bor, qavsda x minus bir qoladi.", 'В первой группе есть минус x в квадрате, в скобке остаётся x минус один.', 'The first group has minus x squared, so the bracket keeps x minus one.') },
        { id: 'd', label: '(x − 1)(x + 4)', tag: 'Z4', hint: L("Birinchi guruhdan x KVADRAT chiqadi.", 'Из первой группы выносится x в КВАДРАТЕ.', 'The first group gives x SQUARED.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "−2x + 8 guruhidan minus ikki chiqarildi. Qavsda nima qoldi?",
        'Из группы −2x + 8 вынесли минус два. Что осталось в скобке?',
        'Minus two was taken out of the group −2x + 8. What is left in the bracket?',
      ),
      ok: L("Minus ikki har hadga bo'ldi va ikkala ishora almashdi.", 'Минус два разделил каждый член, и оба знака перевернулись.', 'Minus two divided each term, and both signs flipped.'),
      items: [
        { id: 'a', label: 'x − 4', correct: true },
        { id: 'b', label: 'x + 4', tag: 'Z3', hint: L("Sakkizni minus ikkiga bo'lsak minus to'rt chiqadi.", 'Восемь разделить на минус два это минус четыре.', 'Eight divided by minus two is minus four.') },
        { id: 'c', label: '−x + 4', tag: 'Z3', hint: L("Minus ikki x ni minus ikkiga bo'lsak musbat x chiqadi.", 'Минус два x разделить на минус два это плюс x.', 'Minus two x divided by minus two is plus x.') },
        { id: 'd', label: 'x − 8', tag: 'Z6', hint: L("Sakkizni ikkiga bo'lish kerak, u to'rt beradi.", 'Восемь надо разделить на два, выйдет четыре.', 'Eight must be divided by two, giving four.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Birinchi guruh y qo'shuv uch qavsini berdi, ikkinchisi y minus uch. Endi nima qilinadi?",
        'Первая группа дала скобку y плюс три, вторая y минус три. Что дальше?',
        'The first group gave the bracket y plus three, the second gave y minus three. What now?',
      ),
      ok: L("Qavslar boshqa, demak guruhlash boshqacha olinishi kerak.", 'Скобки разные, значит группировку надо взять другую.', 'The brackets differ, so the grouping must be chosen differently.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('guruhlashni boshqacha olish kerak', 'надо сгруппировать иначе', 'the grouping must be redone'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L('umumiy qavsni chiqarish', 'вынести общую скобку', 'take out the common bracket'),
          hint: L("Qavslar bir xil emas: birida qo'shuv, ikkinchisida ayirish. Umumiy qavs yo'q.", 'Скобки не одинаковы: в одной плюс, в другой минус. Общей скобки нет.', 'The brackets are not the same: one has a plus, the other a minus. There is no common bracket.'),
        },
        {
          id: 'c',
          tag: 'Z2',
          label: L("qavslarni ko'paytirish", 'перемножить скобки', 'multiply the brackets'),
          hint: L("Ko'paytirish orqaga qaytaradi, ajratish esa oldinga bormaydi.", 'Умножение вернёт назад, а разложение вперёд не продвинется.', 'Multiplying goes back, and the factoring makes no progress.'),
        },
        {
          id: 'd',
          tag: 'Z3',
          label: L("ikkinchi qavsning ishorasini almashtirish", 'поменять знак во второй скобке', 'flip the sign in the second bracket'),
          hint: L("Qavs ichidagi ishora shunchaki almashtirilmaydi, aks holda yozuvning o'zi o'zgaradi.", 'Знак в скобке просто так не меняют, иначе изменится сама запись.', 'A sign inside a bracket is not just flipped, that would change the record itself.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida birinchi guruhda minus bor.", 'Во втором в первой группе есть минус.', 'In the second, the first group has a minus.'),
    A('2', "Uchinchisi minusni chiqarish haqida.", 'Третий про вынесение минуса.', 'The third is about taking out a minus.'),
    A('3', "Oxirgisida qavslar bir xil emas.", 'В последнем скобки не одинаковы.', 'In the last one the brackets are not the same.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Umumiy qavs', 'Общая скобка', 'The common bracket'),
  gate: S1.gate,
  fix: {
    tokens: ['−(x', '−', '3)'],
    value: '−2',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Minus ko'paytuvchi bo'lib chiqadi, va qavs ichidagi har hadning ishorasi almashadi. Beshda minus ikki chiqadi, boshlang'ich yozuvdagidek.",
    'Минус выносится как множитель, и знак каждого члена внутри переворачивается. При пяти получается минус два, как и у исходной записи.',
    'The minus comes out as a factor, and the sign of every term inside flips. At five it gives minus two, just like the original.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    minus: L('qavsda x minus uch', 'в скобке x минус три', 'the bracket x minus three'),
    plus: L("qavsda x qo'shuv uch", 'в скобке x плюс три', 'the bracket x plus three'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    no: L('chiqarib bo\'lmaydi', 'вынести нельзя', 'cannot be taken out'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['ab − 3a + b² − 3b → (b − 3)', 'x³ + x² + x + 1 → (x + 1)', '−x + 3 → −(x − 3)', '2x² − 6x − x + 3 → (x − 3)'],
  twoLabel: L('B4 bloki davom etadi', 'Блок Б4 продолжается', 'Block B4 continues'),
  twoA: L(
    "ikki guruh  →  har birida o'z ko'paytuvchisi",
    'две группы  →  свой множитель в каждой',
    'two groups  →  its own factor in each',
  ),
  twoB: L(
    'minus  →  ishoralarni almashtiradi',
    'минус  →  переворачивает знаки',
    'the minus  →  flips the signs',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "birhad va ko'phadlarni bo'lish",
    'деление одночленов и многочленов',
    'dividing monomials and polynomials',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta narsani izlashdan chiqdi: ikki guruhdan bir xil qavs.", 'Вся сегодняшняя работа вышла из поиска одного: одинаковой скобки в двух группах.', 'All of today came from looking for one thing: the same bracket in two groups.'),
    A('mount', "Keyingi dars blokni yopadi: bo'lish.", 'Следующий урок закрывает блок: деление.', 'The next lesson closes the block: division.'),
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
