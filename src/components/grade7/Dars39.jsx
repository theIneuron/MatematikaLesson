// ============================================================================
// 7-sinf, Dars 39. VARIANTLARNI SANASH: KOMBINATORIKA. B6 BLOKINI YOPADI.
// (Комбинаторика: подсчёт вариантов)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// DARS HAJMI METODIST QARORI BILAN CHEKLANGAN (2026-08-21): rejada «ma'lumot
// bilan ishlash va kombinatorika» yozilgan, lekin darsga KOMBINATORIKA
// oldi -- etalon (§2, B6) aynan uning xatosini nomlaydi: variantlar
// QO'SHILADI, ko'paytirilmaydi. Ma'lumot bilan ishlash kursga kirmaydi.
//
// ASBOB YANGI EMAS: B4 blokining YUZA TO'RTBURCHAGI. Va u bu yerda
// daraxtdan ham kuchli: uch ko'ylak va ikki shim -- olti KATAK, va ular
// KO'RINADI. «Uch qo'shuv ikki besh» degan javob mumkin emas, chunki
// kataklar oltita va beshinchisidan keyin yana bittasi turadi.
//
// TESKARI HOLAT HAM BOR (7-ekran): variantlar QO'SHILADIGAN holat -- bir
// vaqtda faqat BITTA narsa tanlanganda. Usiz dars «har doim ko'paytiring»
// deb o'rgatib qo'yardi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_39'
const LESSON_TITLE = L('Variantlarni sanash', 'Комбинаторика: подсчёт вариантов', 'Counting variants')
const LESSON_NO = L('39-dars', 'Урок 39', 'Lesson 39')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 39 }

const TAGS = {
  Z1: L('variantlar qo\'shildi', 'варианты сложили', 'the variants were added'),
  Z2: L('variant tushib qoldi', 'вариант пропущен', 'a variant was skipped'),
  Z3: L('tartib hisobga olinmadi', 'порядок не учтён', 'the order was not counted'),
  Z4: L('ko\'paytuvchi noto\'g\'ri', 'множитель не тот', 'the wrong factor'),
  Z5: L('sanoq usuli almashtirildi', 'способ подсчёта спутан', 'the counting method was mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Qo'shdi yoki ko'paytirdi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('VARIANTLARNI SANASH', 'ПОДСЧЁТ ВАРИАНТОВ', 'COUNTING VARIANTS'),
  noBack: true,
  noNotes: true,
  title: L('Qo\'shish yoki ko\'paytirish', 'Сложить или умножить', 'Add or multiply'),
  gate: {
    source: { kind: 'plain', tokens: ['3', '?', '2'] },
    rows: [
      { tokens: ['3', '+', '2'], value: '5' },
      { tokens: ['3', '·', '2'], value: '6' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Uch ko'ylak va ikki shim bor. Har ko'ylakka har shimni kiyish mumkin. Nechta boshqa-boshqa kiyim to'plami chiqadi? Tabloda har birining javobi turadi.",
      'Есть три рубашки и две пары брюк. К каждой рубашке подходят любые брюки. Сколько разных наборов? На табло ответ каждого.',
      'There are three shirts and two pairs of trousers. Any trousers go with any shirt. How many different outfits? The boards show each answer.',
    ),
    items: [
      {
        id: 'mult',
        label: L("Olti: ko'paytirish kerak", 'Шесть: надо умножить', 'Six: they must be multiplied'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'add',
        label: L("Besh: qo'shish kerak", 'Пять: надо сложить', 'Five: they must be added'),
        hint: L(
          "Har ko'ylakka IKKI xil shim to'g'ri keladi, ya'ni har ko'ylak ikki to'plam beradi.",
          'К каждой рубашке подходят ДВОЕ брюк, значит каждая рубашка даёт два набора.',
          'Each shirt goes with TWO trousers, so each shirt gives two outfits.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham to\'g\'ri', 'Оба верны', 'Both are right'),
        hint: L(
          "To'plamlar soni bitta son, va u besh ham, olti ham bo'lolmaydi.",
          'Число наборов одно, и оно не может быть и пять, и шесть.',
          'The number of outfits is one number, it cannot be both five and six.',
        ),
      },
      {
        id: 'none',
        label: L('Sanab bo\'lmaydi', 'Посчитать нельзя', 'It cannot be counted'),
        hint: L(
          "Sanash mumkin: har to'plamni bitta katak deb qo'yamiz va kataklarni sanaymiz.",
          'Посчитать можно: каждый набор это одна клетка, и клетки считаются.',
          'It can be counted: each outfit is one cell, and the cells are counted.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Uch ko'ylak va ikki shim. Har ko'ylakka har shim to'g'ri keladi.", 'Три рубашки и две пары брюк. К каждой рубашке подходят любые брюки.', 'Three shirts and two pairs of trousers. Any trousers go with any shirt.'),
    A('mount', "Tabloda ikki javob turadi: besh va olti.", 'На табло два ответа: пять и шесть.', 'The boards show two answers: five and six.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Kataklar soni va juftliklar. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchga to'rt bo'lgan to'rtburchakda nechta katak bor?",
        'Сколько клеток в прямоугольнике три на четыре?',
        'How many cells are in a three by four rectangle?',
      ),
      ok: L("Kataklar soni tomonlar ko'paytmasiga teng.", 'Число клеток равно произведению сторон.', 'The cell count is the product of the sides.'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '7', tag: 'Z1', hint: L("Tomonlar qo'shilmaydi, ko'paytiriladi.", 'Стороны не складываются, а умножаются.', 'The sides are multiplied, not added.') },
        { id: 'c', label: '14', tag: 'Z6', hint: L("Bu perimetr, kataklar soni esa ko'paytma.", 'Это периметр, а число клеток это произведение.', 'That is the perimeter, the cell count is the product.') },
        { id: 'd', label: '9', tag: 'Z6', hint: L("Uch karra to'rt o'n ikki beradi.", 'Три на четыре это двенадцать.', 'Three times four is twelve.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "1 va 2 sonlaridan hamda a va b harflaridan nechta juftlik tuzish mumkin?",
        'Сколько пар можно составить из чисел 1 и 2 и букв a и b?',
        'How many pairs can be made from the numbers 1 and 2 and the letters a and b?',
      ),
      ok: L("Har son har harf bilan juftlashadi: ikki karra ikki.", 'Каждое число сочетается с каждой буквой: два на два.', 'Each number pairs with each letter: two times two.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', tag: 'Z2', hint: L("Har son ikki marta qatnashadi.", 'Каждое число участвует дважды.', 'Each number takes part twice.') },
        { id: 'c', label: '3', tag: 'Z1', hint: L("Bu qo'shishga o'xshaydi, bizga esa hamma juftlik kerak.", 'Это похоже на сложение, а нужны все пары.', 'That looks like adding, but all the pairs are needed.') },
        { id: 'd', label: '8', tag: 'Z6', hint: L("Ikki karra ikki to'rt beradi.", 'Два на два это четыре.', 'Two times two is four.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "1 va 2 raqamlaridan nechta ikki xonali son yozish mumkin, raqamlar takrorlansa ham?",
        'Сколько двузначных чисел можно записать цифрами 1 и 2, если цифры могут повторяться?',
        'How many two digit numbers use the digits 1 and 2, if digits may repeat?',
      ),
      ok: L("Birinchi raqam ikki xil, ikkinchisi ham ikki xil.", 'Первая цифра двумя способами, вторая тоже двумя.', 'The first digit two ways, the second two ways as well.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', tag: 'Z2', hint: L("O'n bir va yigirma ikki ham mos keladi.", 'Одиннадцать и двадцать два тоже подходят.', 'Eleven and twenty two also qualify.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("To'rt son bor: o'n bir, o'n ikki, yigirma bir, yigirma ikki.", 'Есть четыре числа: одиннадцать, двенадцать, двадцать один, двадцать два.', 'There are four: eleven, twelve, twenty one, twenty two.') },
        { id: 'd', label: '6', tag: 'Z6', hint: L("Raqamlar ikkita, xonalar ham ikkita: ikki karra ikki.", 'Цифр две, разрядов два: два на два.', 'Two digits, two places: two times two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ular bitta narsa haqida: kataklar soni ko'paytmaga teng.", 'Три коротких вопроса. Все об одном: число клеток равно произведению.', 'Three short questions, all about one thing: the cell count is the product.'),
    A('1', "Ikkinchisi juftliklar haqida.", 'Второй про пары.', 'The second is about pairs.'),
    A('2', "Uchinchisida raqamlar takrorlanishi mumkin.", 'В третьем цифры могут повторяться.', 'In the third the digits may repeat.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. TO'RTBURCHAK: har katak bitta to'plam.
// ============================================================
const S3 = {
  kind: 'grid',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Har katak bitta to\'plam', 'Каждая клетка это один набор', 'Each cell is one outfit'),
  caption: L(
    "Chapda uch ko'ylak, yuqorida ikki shim. Har katakni bosing: unda bitta to'plam turadi.",
    'Слева три рубашки, сверху две пары брюк. Нажми на каждую клетку: в ней один набор.',
    'Three shirts on the left, two trousers on top. Tap each cell: it holds one outfit.',
  ),
  left: ['1', '2', '3'],
  top: ['a', '+b'],
  cols: 2,
  options: [
    { id: 'a', label: '6' },
    { id: 'b', label: '5' },
    { id: 'c', label: '3' },
    { id: 'd', label: '2' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Beshinchi katakdan keyin yana bittasi turibdi: kataklar oltita.", 'После пятой клетки стоит ещё одна: клеток шесть.', 'After the fifth cell there is one more: six cells.') },
    { key: 'c', tag: 'Z2', hint: L("Uch bu ko'ylaklar soni. Har ko'ylak esa ikki to'plam beradi.", 'Три это число рубашек. А каждая рубашка даёт два набора.', 'Three is the number of shirts. Each shirt gives two outfits.') },
    { key: 'd', tag: 'Z2', hint: L("Ikki bu shimlar soni.", 'Два это число брюк.', 'Two is the number of trousers.') },
  ],
  note: L(
    "Kataklar soni tomonlar KO'PAYTMASIGA teng: uch karra ikki olti. Qo'shish besh berardi, lekin kataklar oltita va ular ko'rinib turadi.",
    'Число клеток равно ПРОИЗВЕДЕНИЮ сторон: три на два шесть. Сложение дало бы пять, но клеток шесть, и они видны.',
    'The cell count is the PRODUCT of the sides: three times two is six. Adding would give five, but there are six cells and they are visible.',
  ),
  audio: [
    A('mount', "Har to'plamni bitta katak deb qo'yamiz: chapda ko'ylak, yuqorida shim.", 'Каждый набор положим одной клеткой: слева рубашка, сверху брюки.', 'Let us put each outfit as one cell: the shirt on the left, the trousers on top.'),
    A('mount', "Hamma katakni bosing va ularni sanang.", 'Нажми на все клетки и посчитай их.', 'Tap every cell and count them.'),
    A('cell-all', "Kataklar ochildi. Endi ularning sonini ayting.", 'Клетки открыты. Теперь назови их число.', 'The cells are open. Now name their count.'),
  ],
}

// ============================================================
// 4. FARQLASH. QACHON QO'SHILADI: bir vaqtda BITTA narsa tanlansa.
// ============================================================
const S4 = {
  kind: 'sort',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Ko\'paytiramiz yoki qo\'shamiz', 'Умножаем или складываем', 'Multiply or add'),
  zones: [
    { id: 'z1', label: L("Ko'paytiramiz", 'Умножаем', 'We multiply') },
    { id: 'z2', label: L("Qo'shamiz", 'Складываем', 'We add') },
  ],
  cards: [
    { id: 'c1', text: L("ko'ylak VA shim", 'рубашка И брюки', 'a shirt AND trousers'), zone: 'z1' },
    { id: 'c2', text: L('bitta taom: sho\'rva YOKI salat', 'одно блюдо: суп ИЛИ салат', 'one dish: soup OR salad'), zone: 'z2' },
    { id: 'c3', text: L("yo'l: shahar A dan B ga VA B dan C ga", 'путь: из A в B И из B в C', 'a route: A to B AND B to C'), zone: 'z1' },
    { id: 'c4', text: L('bitta sovg\'a: kitob YOKI koptok', 'один приз: книга ИЛИ мяч', 'one prize: a book OR a ball'), zone: 'z2' },
  ],
  prompt: L(
    "Belgi bitta so'zda: «va» bo'lsa ko'paytiramiz, «yoki» bo'lsa qo'shamiz.",
    'Признак в одном слове: если «и» — умножаем, если «или» — складываем.',
    'The mark is one word: AND means multiply, OR means add.',
  ),
  wrongs: [
    {
      tag: 'Z5',
      hint: L(
        "«Va» degani ikki narsa BIRGA olinadi, ya'ni har biri har biri bilan juftlashadi. «Yoki» degani bir vaqtda faqat bittasi.",
        '«И» значит, что берутся два предмета ВМЕСТЕ, то есть каждый сочетается с каждым. «Или» значит, что берётся только один.',
        'AND means two things are taken TOGETHER, so each pairs with each. OR means only one is taken.',
      ),
    },
  ],
  okNote: L(
    "Ko'paytirish ikki tanlov KETMA-KET bo'lganda, qo'shish esa tanlovlar BIR-BIRINI almashtirganda.",
    'Умножение когда два выбора идут ПОДРЯД, сложение когда выборы ЗАМЕНЯЮТ друг друга.',
    'Multiplication when two choices come ONE AFTER the other, addition when the choices REPLACE each other.',
  ),
  audio: [
    A('mount', "Variantlar har doim ko'paytirilmaydi. Ba'zan qo'shiladi.", 'Варианты не всегда умножаются. Иногда складываются.', 'Variants are not always multiplied. Sometimes they add.'),
    A('mount', "Belgini so'zdan izlang: va yoki yoki.", 'Ищи признак в слове: и или или.', 'Look for the mark in the word: AND or OR.'),
    A('ok', "Va -- ko'paytirish, yoki -- qo'shish.", 'И это умножение, или это сложение.', 'AND means multiply, OR means add.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Ko'paytma yozuv bilan.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Yozuv bilan', 'Записью', 'As a record'),
  given: L(
    "To'rt xil muzqaymoq va uch xil sirop bor. Har muzqaymoqqa har sirop quyiladi.",
    'Есть четыре вида мороженого и три сиропа. К каждому мороженому подходит любой сироп.',
    'There are four kinds of ice cream and three syrups. Any syrup goes with any ice cream.',
  ),
  template: [{ slot: 0 }, ' · ', { slot: 1 }, ' = 12'],
  parts: [
    { id: 'a', label: '4' },
    { id: 'b', label: '3' },
    { id: 'c', label: '7' },
    { id: 'd', label: '12' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ko'paytmani yozing.",
    'Запиши произведение.',
    'Write the product.',
  ),
  checkNote: L(
    "To'rt karra uch o'n ikki. Har muzqaymoq uch variant beradi, va muzqaymoq to'rtta.",
    'Четыре на три двенадцать. Каждое мороженое даёт три варианта, а мороженого четыре.',
    'Four times three is twelve. Each ice cream gives three variants, and there are four kinds.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Bu yig'indi, bizga esa ko'paytma kerak.", 'Это сумма, а нужно произведение.', 'That is the sum, but a product is needed.') },
    { key: 'd', tag: 'Z4', hint: L("O'n ikki bu javob, ko'paytuvchi emas.", 'Двенадцать это ответ, а не множитель.', 'Twelve is the answer, not a factor.') },
    { key: '*', tag: 'Z4', hint: L("Ko'paytuvchilar -- ikki guruhning sonlari.", 'Множители это числа двух групп.', 'The factors are the counts of the two groups.') },
  ],
  audio: [
    A('mount', "To'rtburchakni har safar chizish shart emas: ko'paytmani darrov yozish mumkin.", 'Прямоугольник рисовать каждый раз не обязательно: произведение можно записать сразу.', 'The rectangle need not be drawn every time: the product can be written at once.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. To'rtburchak, boshqa tomonlar.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikki harf va uch son', 'Две буквы и три числа', 'Two letters and three numbers'),
  caption: L(
    "Chapda ikki harf, yuqorida uch son. Hamma katakni bosing.",
    'Слева две буквы, сверху три числа. Нажми на все клетки.',
    'Two letters on the left, three numbers on top. Tap every cell.',
  ),
  left: ['A', '+B'],
  top: ['1', '+2', '+3'],
  cols: 2,
  options: [
    { id: 'a', label: '6' },
    { id: 'b', label: '5' },
    { id: 'c', label: '3' },
    { id: 'd', label: '9' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikki qo'shuv uch besh beradi, kataklar esa oltita.", 'Два плюс три это пять, а клеток шесть.', 'Two plus three is five, but there are six cells.') },
    { key: 'c', tag: 'Z2', hint: L("Uch bu sonlar soni. Har harf uch variant beradi.", 'Три это число чисел. Каждая буква даёт три варианта.', 'Three is the count of numbers. Each letter gives three variants.') },
    { key: 'd', tag: 'Z6', hint: L("Ikki karra uch olti beradi.", 'Два на три это шесть.', 'Two times three is six.') },
  ],
  note: L(
    "Tomonlar almashsa ham natija o'zgarmaydi: ikki karra uch va uch karra ikki bir xil olti beradi.",
    'Если стороны поменять местами, результат не изменится: два на три и три на два дают одно и то же шесть.',
    'Swapping the sides changes nothing: two times three and three times two both give six.',
  ),
  audio: [
    A('mount', "Bu safar tomonlar boshqa: ikki va uch.", 'На этот раз стороны другие: два и три.', 'This time the sides differ: two and three.'),
    A('mount', "Hamma katakni bosing va sanang.", 'Нажми на все клетки и посчитай.', 'Tap every cell and count.'),
    A('cell-all', "Kataklar ochildi.", 'Клетки открыты.', 'The cells are open.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: variantlar QO'SHILADI.
// ============================================================
const S7 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Bu yerda qo\'shiladi', 'Здесь складывают', 'Here they add'),
  given: L(
    "Oshxonada ikki xil sho'rva va uch xil salat bor. Bola BITTA taom oladi. Uning nechta tanlovi bor?",
    'В столовой два вида супа и три салата. Ребёнок берёт ОДНО блюдо. Сколько у него вариантов?',
    'The canteen has two soups and three salads. A child takes ONE dish. How many choices?',
  ),
  template: ['2 + 3 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '5' },
    { id: 'b', label: '6' },
    { id: 'c', label: '2' },
    { id: 'd', label: '3' },
  ],
  answer: ['a'],
  prompt: L(
    "Tanlovlar sonini yozing.",
    'Запиши число вариантов.',
    'Write the number of choices.',
  ),
  checkNote: L(
    "Bola bitta taom oladi, ya'ni sho'rva YOKI salat. To'plam yasalmaydi, shuning uchun variantlar qo'shiladi: besh.",
    'Ребёнок берёт одно блюдо, то есть суп ИЛИ салат. Набор не составляется, поэтому варианты складываются: пять.',
    'The child takes one dish, that is soup OR salad. No pair is formed, so the choices add: five.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Ko'paytirish sho'rva VA salat olinganda bo'lardi, bu yerda esa bittasi.", 'Умножение было бы, если брать суп И салат, а здесь одно.', 'Multiplying would fit soup AND salad, but here it is one dish.') },
    { key: 'c', tag: 'Z2', hint: L("Salatlar ham hisobga olinadi.", 'Салаты тоже считаются.', 'The salads count too.') },
    { key: 'd', tag: 'Z2', hint: L("Sho'rvalar ham hisobga olinadi.", 'Супы тоже считаются.', 'The soups count too.') },
  ],
  audio: [
    A('mount', "Endi holat boshqa: bola bitta taom oladi, ikkitasini emas.", 'Теперь случай другой: ребёнок берёт одно блюдо, а не два.', 'Now the case differs: the child takes one dish, not two.'),
    A('mount', "To'plam yasalmasa, variantlar qo'shiladi.", 'Если набор не составляется, варианты складываются.', 'When no pair is formed, the choices add.'),
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
    { id: 'f1', label: L('tanlov ketma-ket ikki qadamda bo\'lsa', 'если выбор идёт в два шага подряд', 'if the choice runs in two steps') },
    { id: 'f2', label: L("variantlar KO'PAYTIRILADI", 'варианты УМНОЖАЮТСЯ', 'the variants are MULTIPLIED') },
    { id: 'f3', label: L("bir vaqtda faqat bittasi tanlansa esa", 'а если выбирают только одно', 'and if only one is chosen') },
    { id: 'f4', label: L("variantlar QO'SHILADI", 'варианты СКЛАДЫВАЮТСЯ', 'the variants are ADDED') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval ketma-ket tanlov va ko'paytirish, keyin bitta tanlov va qo'shish.",
    'Порядок нарушен. Сначала выбор подряд и умножение, потом один выбор и сложение.',
    'The order is off. The step by step choice and multiplication first, then the single choice and addition.',
  ),
  lawChips: [
    { label: '·', tone: 's2' },
    { label: '+', tone: 's1' },
    { label: '( )', tone: 'par' },
    { label: '2 · 3', tone: 'off' },
  ],
  lawSweep: L(
    "ko'paytirish, qo'shish, katak, tomonlar",
    'умножение, сложение, клетка, стороны',
    'multiplication, addition, the cell, the sides',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Agar tanlov ketma-ket ikki qadamdan iborat bo'lsa -- avval bittasi, keyin ikkinchisi -- variantlar soni KO'PAYTIRILADI. To'rtburchakda bu kataklar soni bo'lib ko'rinadi.",
        'Если выбор состоит из двух шагов подряд — сначала одно, потом другое — число вариантов УМНОЖАЕТСЯ. На прямоугольнике это видно как число клеток.',
        'If a choice is two steps in a row — first one, then the other — the number of variants is MULTIPLIED. On the rectangle it shows as the cell count.',
      ),
      L(
        "Agar bir vaqtda faqat BITTA narsa tanlansa, variantlar QO'SHILADI. Belgi so'zda turadi: «va» ko'paytirishga, «yoki» qo'shishga olib keladi.",
        'Если одновременно выбирают только ОДНО, варианты СКЛАДЫВАЮТСЯ. Признак в слове: «и» ведёт к умножению, «или» к сложению.',
        'If only ONE thing is chosen at a time, the variants are ADDED. The mark is in the word: AND leads to multiplying, OR to adding.',
      ),
    ],
  },
  hookCap: L(
    "Kataklar soni  --  tomonlar ko'paytmasi",
    'Число клеток — произведение сторон',
    'The cell count is the product of the sides',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("«va»  --  ko'paytirish", '«и» это умножение', 'AND means multiply'),
    L("«yoki»  --  qo'shish", '«или» это сложение', 'OR means add'),
    L('katak -- bitta variant', 'клетка это один вариант', 'a cell is one variant'),
  ],
  audio: [
    A('mount', "Ikki holatni ko'rdik: ko'paytirish va qo'shish. Endi qoidani yig'amiz.", 'Оба случая мы увидели: умножение и сложение. Теперь соберём правило.', 'We have seen both cases: multiplying and adding. Now let us build the rule.'),
    A('ok', "To'g'ri. Bu bilan blok yopiladi.", 'Верно. На этом блок закрывается.', 'Correct. That closes the block.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Besh xil daftar va to'rt xil ruchka bor. Bitta daftar VA bitta ruchka olinadi. Nechta variant?",
        'Есть пять видов тетрадей и четыре ручки. Берут одну тетрадь И одну ручку. Сколько вариантов?',
        'There are five notebooks and four pens. One notebook AND one pen are taken. How many variants?',
      ),
      ok: L("«Va» degani ko'paytirish: besh karra to'rt.", '«И» значит умножение: пять на четыре.', 'AND means multiplying: five times four.'),
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '9', tag: 'Z1', hint: L("Bu yig'indi. Har daftar to'rt variant beradi.", 'Это сумма. Каждая тетрадь даёт четыре варианта.', 'That is the sum. Each notebook gives four variants.') },
        { id: 'c', label: '5', tag: 'Z2', hint: L("Ruchkalar ham hisobga olinadi.", 'Ручки тоже считаются.', 'The pens count too.') },
        { id: 'd', label: '25', tag: 'Z6', hint: L("Besh karra to'rt yigirma beradi.", 'Пять на четыре это двадцать.', 'Five times four is twenty.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uch xil sharbat YOKI ikki xil choy bor. Bitta ichimlik olinadi. Nechta variant?",
        'Есть три сока ИЛИ два чая. Берут один напиток. Сколько вариантов?',
        'There are three juices OR two teas. One drink is taken. How many variants?',
      ),
      ok: L("«Yoki» degani qo'shish: uch qo'shuv ikki.", '«Или» значит сложение: три плюс два.', 'OR means adding: three plus two.'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '6', tag: 'Z5', hint: L("Ko'paytirish sharbat VA choy olinganda bo'lardi.", 'Умножение было бы, если брать сок И чай.', 'Multiplying would fit juice AND tea.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Choylar ham hisobga olinadi.", 'Чаи тоже считаются.', 'The teas count too.') },
        { id: 'd', label: '2', tag: 'Z2', hint: L("Sharbatlar ham hisobga olinadi.", 'Соки тоже считаются.', 'The juices count too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "1, 2 va 3 raqamlaridan nechta ikki xonali son yozish mumkin, raqamlar takrorlansa ham?",
        'Сколько двузначных чисел можно записать цифрами 1, 2 и 3, если цифры могут повторяться?',
        'How many two digit numbers use the digits 1, 2 and 3, if digits may repeat?',
      ),
      ok: L("Har xonaga uch raqam: uch karra uch.", 'На каждый разряд три цифры: три на три.', 'Three digits per place: three times three.'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '6', tag: 'Z3', hint: L("Raqamlar takrorlanishi mumkin, demak o'n bir ham mos keladi.", 'Цифры могут повторяться, значит одиннадцать тоже подходит.', 'Digits may repeat, so eleven qualifies too.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Ikkinchi xona ham tanlanadi.", 'Второй разряд тоже выбирается.', 'The second place is chosen as well.') },
        { id: 'd', label: '12', tag: 'Z6', hint: L("Uch karra uch to'qqiz beradi.", 'Три на три это девять.', 'Three times three is nine.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Shahar A dan B ga ikki yo'l, B dan C ga uch yo'l bor. A dan C ga nechta yo'l bor?",
        'Из города A в B два пути, из B в C три пути. Сколько путей из A в C?',
        'Two routes from A to B, three from B to C. How many routes from A to C?',
      ),
      ok: L("Har birinchi yo'ldan keyin uch davomi bor: ikki karra uch.", 'После каждого первого пути есть три продолжения: два на три.', 'Each first route has three continuations: two times three.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '5', tag: 'Z1', hint: L("Yo'l ikki qadamdan iborat, demak ko'paytiriladi.", 'Путь состоит из двух шагов, значит умножается.', 'The route is two steps, so it multiplies.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Birinchi qism ham tanlanadi.", 'Первая часть тоже выбирается.', 'The first part is chosen too.') },
        { id: 'd', label: '2', tag: 'Z2', hint: L("Ikkinchi qism ham tanlanadi.", 'Вторая часть тоже выбирается.', 'The second part is chosen too.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisida yoki turibdi, qolganlarida va.", 'Четыре вопроса. Во втором стоит или, в остальных и.', 'Four questions. The second has OR, the rest have AND.'),
    A('1', "Ikkinchisiga diqqat: bu yerda qo'shiladi.", 'Внимание на второй: здесь складывают.', 'Watch the second: here they add.'),
    A('2', "Uchinchisida raqamlar takrorlanadi.", 'В третьем цифры повторяются.', 'In the third the digits repeat.'),
    A('3', "Oxirgisi yo'l haqida.", 'Последний про путь.', 'The last is about a route.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: UCH qadamli tanlov.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uch qadamli tanlov', 'Выбор в три шага', 'A choice in three steps'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Uch ko'ylak, to'rt shim va ikki shapka bor. Har uchtasidan bittasi olinadi.",
    'Три рубашки, четыре брюк и две шапки. Из каждой группы берут по одному.',
    'Three shirts, four trousers and two caps. One from each group is taken.',
  ),
  template: ['3 · 4 = ', { slot: 0 }, ',   ', { slot: 1 }, ' · 2 = 24'],
  parts: [
    { id: 'a', label: '12' },
    { id: 'b', label: '12' },
    { id: 'c', label: '7' },
    { id: 'd', label: '9' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Avval ikki guruhni ko'paytiring, keyin uchinchisini qo'shib ko'paytiring.",
    'Сначала перемножь две группы, потом умножь на третью.',
    'Multiply two groups first, then multiply by the third.',
  ),
  checkNote: L(
    "Uch karra to'rt o'n ikki, keyin o'n ikki karra ikki yigirma to'rt. Uch qadamli tanlovda uch ko'paytuvchi bo'ladi.",
    'Три на четыре двенадцать, потом двенадцать на два двадцать четыре. В выборе из трёх шагов три множителя.',
    'Three times four is twelve, then twelve times two is twenty four. A three step choice has three factors.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z1', hint: L("Bu yig'indi, bizga esa ko'paytma kerak.", 'Это сумма, а нужно произведение.', 'That is the sum, but a product is needed.') },
    { key: 'd', tag: 'Z6', hint: L("Uch karra to'rt o'n ikki beradi.", 'Три на четыре это двенадцать.', 'Three times four is twelve.') },
    { key: '*', tag: 'Z4', hint: L("Har guruh o'z ko'paytuvchisini beradi.", 'Каждая группа даёт свой множитель.', 'Each group gives its own factor.') },
  ],
  probe: {
    question: L("Uch guruh bo'lsa nechta ko'paytuvchi bo'ladi?", 'Сколько множителей, если групп три?', 'How many factors when there are three groups?'),
    items: [
      { id: 'a', correct: true, label: '3' },
      { id: 'b', tag: 'Z4', label: '2', hint: L("Uchinchi guruh ham o'z ko'paytuvchisini beradi.", 'Третья группа тоже даёт свой множитель.', 'The third group gives its factor too.') },
      { id: 'c', tag: 'Z6', label: '6', hint: L("Ko'paytuvchilar soni guruhlar soniga teng.", 'Число множителей равно числу групп.', 'The factor count equals the group count.') },
      { id: 'd', tag: 'Z5', label: '1', hint: L("Bitta ko'paytuvchi bitta guruh bo'lganda bo'lardi.", 'Один множитель был бы при одной группе.', 'One factor would fit one group.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ikki guruh, keyin uchinchisi.", 'Два шага. Сначала две группы, потом третья.', 'Two steps. Two groups first, then the third.'),
    A('mount', "Guruhlar uchta, demak ko'paytuvchilar ham uchta bo'ladi.", 'Групп три, значит и множителей будет три.', 'Three groups mean three factors.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Usulni O'ZINGIZ tanlaysiz.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Usulni o\'zingiz tanlang', 'Способ выбери сам', 'Choose the method yourself'),
  given: L(
    "Kutubxonada olti xil ertak YOKI to'rt xil she'r kitobi bor. Bola BITTA kitob oladi.",
    'В библиотеке шесть сказок ИЛИ четыре книги стихов. Ребёнок берёт ОДНУ книгу.',
    'The library has six fairy tale books OR four poetry books. A child takes ONE book.',
  ),
  template: ['6 ', { slot: 0 }, ' 4 = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '+' },
    { id: 'b', label: '10' },
    { id: 'c', label: '·' },
    { id: 'd', label: '24' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Amalni va javobni yozing.",
    'Запиши действие и ответ.',
    'Write the operation and the answer.',
  ),
  checkNote: L(
    "Bola bitta kitob oladi, ya'ni ertak YOKI she'r. To'plam yasalmaydi, shuning uchun qo'shiladi: o'n.",
    'Ребёнок берёт одну книгу, то есть сказку ИЛИ стихи. Набор не составляется, поэтому складывают: десять.',
    'The child takes one book, a fairy tale OR poetry. No pair is formed, so they add: ten.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z5', hint: L("Ko'paytirish ikki kitob olinganda bo'lardi, bu yerda esa bittasi.", 'Умножение было бы, если брать две книги, а здесь одна.', 'Multiplying would fit two books, but here it is one.') },
    { key: 'd', tag: 'Z5', hint: L("Yigirma to'rt bu ko'paytma, bizga esa yig'indi kerak.", 'Двадцать четыре это произведение, а нужна сумма.', 'Twenty four is the product, but the sum is needed.') },
    { key: '*', tag: 'Z5', hint: L("Belgini so'zdan izlang: «yoki» turibdi.", 'Ищи признак в слове: стоит «или».', 'Look for the mark in the word: it says OR.') },
  ],
  audio: [
    A('mount', "Bu safar usul aytilmaydi. Belgini o'zingiz topasiz.", 'На этот раз способ не назван. Признак находишь сам.', 'This time the method is not named. You find the mark yourself.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Guruhlar TO'G'RI sanalgan, lekin ular
// QO'SHILGAN.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Qo'shish to'g'ri bajarilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Сложение выполнено верно. И всё же какая строка ошибочна?',
    'The addition is done right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L("4 ko'ylak VA 3 shim", '4 рубашки И 3 брюк', '4 shirts AND 3 trousers') },
    { id: 'r2', text: L("variantlar soni: 4 qo'shuv 3", 'число вариантов: 4 плюс 3', 'the count: 4 plus 3') },
    { id: 'r3', text: '4 + 3 = 7' },
    { id: 'r4', text: L('7', '7', '7') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shartning o'zi.", 'Это само условие.', 'That is the condition itself.'),
    r3: L("Hisob to'g'ri: to'rt qo'shuv uch yetti.", 'Счёт верен: четыре плюс три семь.', 'The arithmetic is right: four plus three is seven.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    template: ['4 ', { slot: 0 }, ' 3 = ', { slot: 1 }],
    parts: [
      { id: 'a', label: '·' },
      { id: 'b', label: '12' },
      { id: 'c', label: '+' },
      { id: 'd', label: '7' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Amalni tuzating va javobni hisoblang.",
      'Исправь действие и посчитай ответ.',
      'Fix the operation and compute the answer.',
    ),
    checkNote: L(
      "Shartda «va» turibdi: ko'ylak ham, shim ham olinadi. Har ko'ylak uch to'plam beradi, ko'ylak esa to'rtta -- o'n ikki katak.",
      'В условии стоит «и»: берут и рубашку, и брюки. Каждая рубашка даёт три набора, а рубашек четыре — двенадцать клеток.',
      'The condition says AND: both a shirt and trousers are taken. Each shirt gives three outfits, and there are four shirts — twelve cells.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z1', hint: L("Qo'shish bir vaqtda bittasi olinganda bo'ladi.", 'Сложение бывает, когда берут только одно.', 'Adding fits when only one is taken.') },
      { key: 'd', tag: 'Z1', hint: L("Yetti bu yig'indi, kataklar esa o'n ikkita.", 'Семь это сумма, а клеток двенадцать.', 'Seven is the sum, but there are twelve cells.') },
      { key: '*', tag: 'Z5', hint: L("Belgi so'zda: «va» ko'paytirishga olib keladi.", 'Признак в слове: «и» ведёт к умножению.', 'The mark is in the word: AND leads to multiplying.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda guruhlar to'g'ri sanalgan.", 'В этой ловушке группы посчитаны верно.', 'In this trap the groups are counted right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Shartda va turgan, demak ko'paytirish kerak edi.", 'Нашёл. В условии стоит и, значит нужно было умножать.', 'You found it. The condition says AND, so multiplying was needed.'),
    A('done', "Kataklar soni tomonlar ko'paytmasiga teng.", 'Число клеток равно произведению сторон.', 'The cell count is the product of the sides.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. PAROL: har xona alohida tanlanadi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ikki raqamli parol', 'Пароль из двух цифр', 'A two digit code'),
  given: L(
    "Qulfda ikki xona bor, va har xonaga nol dan to'qqiz gacha raqam qo'yiladi. Raqamlar takrorlanishi mumkin.",
    'В замке два разряда, и в каждый ставится цифра от нуля до девяти. Цифры могут повторяться.',
    'A lock has two places, each taking a digit from zero to nine. Digits may repeat.',
  ),
  template: ['10 · 10 = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '100' },
    { id: 'b', label: '20' },
    { id: 'c', label: '90' },
    { id: 'd', label: '19' },
  ],
  answer: ['a'],
  prompt: L(
    "Nechta parol chiqadi.",
    'Сколько получается паролей.',
    'How many codes there are.',
  ),
  checkNote: L(
    "Har xonaga o'n raqam mos keladi, xonalar esa ikkita: o'n karra o'n yuz. Nol dan to'qqiz gacha o'n raqam bor, to'qqiz emas.",
    'На каждый разряд подходит десять цифр, а разрядов два: десять на десять сто. От нуля до девяти десять цифр, а не девять.',
    'Each place takes ten digits and there are two places: ten times ten is one hundred. From zero to nine there are ten digits, not nine.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Bu yig'indi. Har xona alohida tanlanadi, demak ko'paytiriladi.", 'Это сумма. Каждый разряд выбирается отдельно, значит умножается.', 'That is the sum. Each place is chosen separately, so they multiply.') },
    { key: 'c', tag: 'Z6', hint: L("Nol dan to'qqiz gacha o'n raqam bor: nolni ham sanang.", 'От нуля до девяти десять цифр: считай и ноль.', 'From zero to nine there are ten digits: count the zero too.') },
    { key: 'd', tag: 'Z1', hint: L("Xonalar ketma-ket tanlanadi, shuning uchun ko'paytiriladi.", 'Разряды выбираются подряд, поэтому умножаются.', 'The places are chosen in a row, so they multiply.') },
  ],
  audio: [
    A('mount', "Parol ham xuddi shunday sanaladi: har xona alohida tanlanadi.", 'Пароль считается точно так же: каждый разряд выбирается отдельно.', 'A code is counted the same way: each place is chosen separately.'),
    A('mount', "Nol dan to'qqiz gacha nechta raqam borligini eslab qoling.", 'Запомни, сколько цифр от нуля до девяти.', 'Remember how many digits there are from zero to nine.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki xil non VA uch xil pishloq. Bitta sendvich yasaladi. Nechta variant?",
        'Два вида хлеба И три сыра. Делают один сэндвич. Сколько вариантов?',
        'Two breads AND three cheeses. One sandwich is made. How many variants?',
      ),
      ok: L("«Va» -- ko'paytirish: ikki karra uch.", '«И» это умножение: два на три.', 'AND means multiply: two times three.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '5', tag: 'Z1', hint: L("Har non uch variant beradi.", 'Каждый хлеб даёт три варианта.', 'Each bread gives three variants.') },
        { id: 'c', label: '3', tag: 'Z2', hint: L("Nonlar ham hisobga olinadi.", 'Хлеб тоже считается.', 'The bread counts too.') },
        { id: 'd', label: '2', tag: 'Z2', hint: L("Pishloqlar ham hisobga olinadi.", 'Сыр тоже считается.', 'The cheese counts too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "To'rt xil qalam YOKI besh xil ruchka. Bitta narsa olinadi. Nechta variant?",
        'Четыре карандаша ИЛИ пять ручек. Берут одну вещь. Сколько вариантов?',
        'Four pencils OR five pens. One item is taken. How many variants?',
      ),
      ok: L("«Yoki» -- qo'shish: to'rt qo'shuv besh.", '«Или» это сложение: четыре плюс пять.', 'OR means add: four plus five.'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '20', tag: 'Z5', hint: L("Ko'paytirish ikki narsa olinganda bo'lardi.", 'Умножение было бы, если брать две вещи.', 'Multiplying would fit taking two items.') },
        { id: 'c', label: '4', tag: 'Z2', hint: L("Ruchkalar ham hisobga olinadi.", 'Ручки тоже считаются.', 'The pens count too.') },
        { id: 'd', label: '5', tag: 'Z2', hint: L("Qalamlar ham hisobga olinadi.", 'Карандаши тоже считаются.', 'The pencils count too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "1, 2, 3, 4 raqamlaridan nechta ikki xonali son yozish mumkin, raqamlar takrorlansa ham?",
        'Сколько двузначных чисел можно записать цифрами 1, 2, 3, 4, если цифры могут повторяться?',
        'How many two digit numbers use the digits 1, 2, 3, 4, if digits may repeat?',
      ),
      ok: L("Har xonaga to'rt raqam: to'rt karra to'rt.", 'На каждый разряд четыре цифры: четыре на четыре.', 'Four digits per place: four times four.'),
      items: [
        { id: 'a', label: '16', correct: true },
        { id: 'b', label: '8', tag: 'Z1', hint: L("Bu yig'indi, xonalar esa ketma-ket tanlanadi.", 'Это сумма, а разряды выбираются подряд.', 'That is the sum, but the places are chosen in a row.') },
        { id: 'c', label: '12', tag: 'Z3', hint: L("Raqamlar takrorlanishi mumkin, demak har xonada to'rttasi.", 'Цифры могут повторяться, значит в каждом разряде четыре.', 'Digits may repeat, so each place has four.') },
        { id: 'd', label: '4', tag: 'Z2', hint: L("Ikkinchi xona ham tanlanadi.", 'Второй разряд тоже выбирается.', 'The second place is chosen too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uch guruhdan bittadan narsa olinsa, nechta ko'paytuvchi bo'ladi?",
        'Если из трёх групп берут по одному, сколько будет множителей?',
        'Taking one from each of three groups, how many factors are there?',
      ),
      ok: L("Har guruh o'z ko'paytuvchisini beradi.", 'Каждая группа даёт свой множитель.', 'Each group gives its own factor.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', tag: 'Z4', hint: L("Uchinchi guruh ham qatnashadi.", 'Третья группа тоже участвует.', 'The third group takes part too.') },
        { id: 'c', label: '1', tag: 'Z5', hint: L("Bitta ko'paytuvchi bitta guruhda bo'lardi.", 'Один множитель был бы при одной группе.', 'One factor would fit one group.') },
        { id: 'd', label: '6', tag: 'Z6', hint: L("Ko'paytuvchilar soni guruhlar soniga teng.", 'Число множителей равно числу групп.', 'The factor count equals the group count.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida yoki turibdi.", 'Во втором стоит или.', 'The second says OR.'),
    A('2', "Uchinchisida raqamlar takrorlanadi.", 'В третьем цифры повторяются.', 'In the third the digits repeat.'),
    A('3', "Oxirgisi ko'paytuvchilar soni haqida.", 'Последний про число множителей.', 'The last is about the factor count.'),
  ],
}

// ============================================================
// 15. YAKUN. B6 BLOKI YOPILDI.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Kataklar soni -- ko\'paytma', 'Число клеток это произведение', 'The cell count is the product'),
  gate: S1.gate,
  fix: {
    tokens: ['3', '·', '2'],
    value: '6',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Har ko'ylakka ikki xil shim to'g'ri keladi, ko'ylak esa uchta. Demak kataklar oltita, va javob ko'paytma bo'ladi.",
    'К каждой рубашке подходят две пары брюк, а рубашек три. Значит клеток шесть, и ответ это произведение.',
    'Each shirt goes with two trousers, and there are three shirts. So there are six cells, and the answer is the product.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    mult: L("olti: ko'paytirish", 'шесть: умножение', 'six: multiplying'),
    add: L("besh: qo'shish", 'пять: сложение', 'five: adding'),
    both: L('ikkovi ham', 'оба', 'both'),
    none: L('sanab bo\'lmaydi', 'посчитать нельзя', 'cannot be counted'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['3 · 2 → 6', '2 · 3 → 6', '2 + 3 → 5', '10 · 10 → 100'],
  twoLabel: L('B6 bloki yopildi', 'Блок Б6 закрыт', 'Block B6 is closed'),
  twoA: L(
    "«va»  →  ko'paytirish",
    '«и»  →  умножение',
    'AND  →  multiply',
  ),
  twoB: L(
    "«yoki»  →  qo'shish",
    '«или»  →  сложение',
    'OR  →  add',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'geometriya',
    'геометрия',
    'geometry',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta so'zdan chiqdi: va ko'paytirishga, yoki qo'shishga olib keladi.", 'Вся сегодняшняя работа вышла из одного слова: и ведёт к умножению, или к сложению.', 'All of today came from one word: AND leads to multiplying, OR to adding.'),
    A('mount', "Funksiyalar bloki shu bilan yopildi. Keyingi blokda geometriya.", 'Блок функций на этом закрыт. В следующем блоке геометрия.', 'The block of functions closes here. The next block brings geometry.'),
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
