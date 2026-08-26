// Dars34 · Amaliyot 09 — Tartib · 🔴 · tag: table_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 9-pozitsiya)
//
// TO'RT QADAM: tartiblash -> variantlarni ajratish -> chastotalarni sanash
// -> yig'indini hajm bilan solishtirish.
//
// З70 SHU YERDA TUG'ILADI: tekshiruvni oldinga qo'yish yoki umuman
// qilmaslik. Tekshiruv oxirgi qadam bo'lgani muhim — u ishning natijasini
// nazorat qiladi, ishning o'zi emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'table_steps', level: '🔴',
  expr: ['2, 3, 2, 4, 2, 3, 5, 3, 2, 4'], exprSize: 19,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['2,2,2,2,3,3,3,4,4,5'],
      label: L("natijalarni o'sish tartibida yozamiz", 'записываем результаты по возрастанию', 'write the results in increasing order') },
    { id: 'l2', tokens: ['2; 3; 4; 5'],
      label: L('har xil variantlarni ajratamiz', 'выделяем различные варианты', 'pick out the distinct variants') },
    { id: 'l3', tokens: ['4; 3; 2; 1'],
      label: L('har variantning chastotasini sanaymiz', 'считаем частоту каждого варианта', 'count the frequency of each variant') },
    { id: 'l4', tokens: ['4+3+2+1 = 10'],
      label: L("yig'indini tanlanma hajmi bilan solishtiramiz", 'сравниваем сумму с объёмом выборки', 'compare the sum with the sample size') },
  ],
  start: ['l4', 'l3', 'l1', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Chastota jadvali to'rt qadamda tuziladi, lekin qadamlar aralashib ketgan. Oxirgi qadam yangi ma'lumot bermaydi — u qilingan ishni nazorat qiladi.",
    'Таблица частот составляется в четыре шага, но шаги перепутаны. Последний шаг новых сведений не даёт — он контролирует сделанное.',
    'A frequency table is built in four steps, but the steps are mixed up. The last step brings no new information — it checks the work already done.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval natijalarni o'sish tartibida yozamiz: bir xil sonlar yonma-yon turadi va ularni sanash oson bo'ladi. Keyin har xil variantlarni ajratamiz — ikki, uch, to'rt, besh: bu jadvalning birinchi ustuni. Undan keyin har variantning chastotasini sanaymiz — to'rt, uch, ikki, bir. Va oxirida yig'indini tanlanma hajmi bilan solishtiramiz: to'rt qo'shuv uch qo'shuv ikki qo'shuv bir o'n, va tanlanmada ham o'nta natija bor edi. Tekshiruvni oldinga qo'yib bo'lmaydi — tekshiriladigan chastotalar hali yo'q, va aynan shu joyda jadval tekshirilmasdan qolib ketadi.",
    'Верно. Сначала записываем результаты по возрастанию: одинаковые числа встают рядом и считать их становится легко. Потом выделяем различные варианты — два, три, четыре, пять: это первый столбец таблицы. Затем считаем частоту каждого — четыре, три, два, один. И в конце сравниваем сумму с объёмом выборки: четыре плюс три плюс два плюс один десять, и в выборке было десять результатов. Проверку нельзя ставить вперёд — проверять пока нечего, и именно здесь таблица остаётся непроверенной.',
    'Correct. First we write the results in increasing order: equal numbers line up and become easy to count. Then we pick out the distinct variants — two, three, four, five: that is the first column of the table. Then we count the frequency of each — four, three, two, one. And at the end we compare the sum with the sample size: four plus three plus two plus one is ten, and the sample held ten results. The check cannot be put first — there are no frequencies to check yet, and this is exactly where a table ends up unchecked.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Solishtirish CHASTOTALAR SANALGANDAN keyin bo'ladi: qo'shiladigan sonlar hali yo'q. Bu qadamni oldinga surish yoki umuman tashlab ketish jadvalni tekshirilmagan qoldiradi, va o'shanda bitta tashlab ketilgan natija sezilmasdan qoladi. Tekshiruv arzon: to'rtta sonni qo'shish bir sekundlik ish, xatoni esa u darhol ko'rsatadi.",
      'Сравнение идёт ПОСЛЕ подсчёта частот: складывать пока нечего. Если сдвинуть этот шаг вперёд или вовсе его выбросить, таблица останется непроверенной, и один пропущенный результат пройдёт незамеченным. Проверка дешёвая: сложить четыре числа — секундное дело, а ошибку она показывает сразу.',
      'The comparison comes AFTER the frequencies are counted: there is nothing to add yet. Moving this step forward, or dropping it altogether, leaves the table unchecked, and a single skipped result then passes unnoticed. The check is cheap: adding four numbers takes a second, and it shows an error at once.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Sanash VARIANTLAR AJRATILGANDAN keyin bo'ladi: nimani sanash kerakligi hali aniq emas. Variantlar ro'yxati jadvalning birinchi ustunini beradi, va faqat undan keyin har qatorga chastota yoziladi. Ro'yxatsiz sanash — bu bir variantni ikki marta sanash yoki bittasini butunlay unutish demakdir.",
      'Подсчёт идёт ПОСЛЕ выделения вариантов: пока неясно, что именно считать. Список вариантов даёт первый столбец таблицы, и только потом в каждую строку вписывается частота. Считать без списка значит сосчитать один вариант дважды или забыть другой совсем.',
      'The counting comes AFTER the variants are picked out: it is not yet clear what to count. The list of variants gives the first column of the table, and only then does a frequency go into each row. Counting without the list means counting one variant twice or forgetting another entirely.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Sanoqdan yoki tekshiruvdan boshlab bo'lmaydi — ular ishning oxiri. Birinchi qadam eng sodda va eng foydali: natijalarni tartiblash. Tartiblangandan keyin bir xil sonlar yonma-yon turadi, va butun qolgan ish ancha oson bo'ladi.",
      'Начинать со счёта или с проверки нельзя — это конец работы. Первый шаг самый простой и самый полезный: упорядочить результаты. После упорядочивания одинаковые числа встают рядом, и вся оставшаяся работа заметно упрощается.',
      'You cannot start with the counting or the check — they are the end of the work. The first step is the simplest and the most useful: order the results. Once ordered, equal numbers stand together and all the remaining work becomes much easier.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Variantlarni ajratish TARTIBLASHDAN keyin bo'ladi. Tartiblanmagan qatorda bir xil sonlar bir-biridan uzoqda turadi, va ro'yxatga bitta variant ikki marta tushib qolishi mumkin. Tartiblash aynan shu xavfni yo'q qiladi — bu qadamning butun foydasi shunda.",
      'Выделение вариантов идёт ПОСЛЕ упорядочивания. В неупорядоченном ряду одинаковые числа стоят далеко друг от друга, и один вариант может попасть в список дважды. Упорядочивание именно эту опасность и снимает — в этом вся его польза.',
      'Picking out the variants comes AFTER the ordering. In an unordered row equal numbers stand far apart, and one variant may end up in the list twice. Ordering removes exactly that risk — that is the whole use of the step.') },
  ],
  wrongText: L(
    "Tartiblash birinchi, tekshiruv oxirgi. Har qadam oldingisining natijasini ishlatadi: ro'yxatsiz sanab bo'lmaydi, chastotasiz tekshirib bo'lmaydi.",
    'Упорядочивание первым, проверка последней. Каждый шаг пользуется результатом предыдущего: без списка не сосчитать, без частот не проверить.',
    'Ordering comes first, the check last. Each step uses the result of the one before: you cannot count without the list, nor check without the frequencies.'),
};

export default function D34_09(props) { return <SwapOrder data={DATA} {...props} />; }
