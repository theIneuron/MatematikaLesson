// Dars28 · Amaliyot 01 — Tengsizlik · 🟢 · tag: condition_to_inequality
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 1-pozitsiya)
//
// T1: masala sharti tengsizlikka aylantiriladi. 21-darsdan farqi bitta
// so'zda: u yerda «teng» edi va tenglama chiqardi, bu yerda «yetadi»,
// «kamida», «ko'pi bilan» — va tengsizlik chiqadi.
//
// Uch xato variant uch xil yo'l: belgi teskari; ko'paytirish o'rniga
// qo'shish; kattaliklar almashgan.
// Ismlar o'zbekcha (ETALON §9). Variantlar aralashtiriladi (Choice ichida),
// razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'condition_to_inequality', level: '🟢',
  correct: 0, optCols: 2, optSize: 17,
  eyebrow: L('Tengsizlik', 'Неравенство', 'The inequality'),
  setup: L(
    "Bitta daftar 3000 so'm turadi. Azizda 20000 so'm bor. U x ta daftar sotib olmoqchi, va puli yetishi kerak.",
    'Одна тетрадь стоит 3000 сумов. У Азиза 20000 сумов. Он хочет купить x тетрадей, и денег должно хватить.',
    'One notebook costs 3000 soums. Aziz has 20000 soums. He wants to buy x notebooks, and the money must be enough.'),
  ask: L(
    'Qaysi tengsizlik masala shartiga mos keladi?',
    'Какое неравенство соответствует условию задачи?',
    "Which inequality matches the problem's condition?"),
  opts: [
    { label: ['3000x ≤ 20000'] },
    { label: ['3000x ≥ 20000'] },
    { label: ['x + 3000 ≤ 20000'] },
    { label: ['20000x ≤ 3000'] },
  ],
  correctText: L(
    "To'g'ri. x ta daftarning narxi uch ming x, va u Azizning pulidan oshmasligi kerak. «Yetishi kerak» degan gap aynan shu belgini beradi. Tekshirish: olti daftar o'n sakkiz ming — yetadi; yetti daftar yigirma bir ming — yetmaydi.",
    'Верно. Стоимость x тетрадей это три тысячи x, и она не должна превышать деньги Азиза. Слова «должно хватить» дают именно этот знак. Проверка: шесть тетрадей это восемнадцать тысяч — хватает; семь тетрадей двадцать одна тысяча — не хватает.',
    "Correct. The cost of x notebooks is three thousand x, and it must not exceed Aziz's money. The phrase «must be enough» gives exactly this sign. Check: six notebooks cost eighteen thousand — enough; seven cost twenty one thousand — not enough."),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Belgi TESKARI qo'yilgan. Bu yozuvda daftarlarning narxi Azizning pulidan katta yoki teng bo'lishi talab qilinadi, ya'ni pul YETMASLIGI kerak. Shartda esa aksincha: puli yetishi kerak, demak narx puldan oshmasligi kerak. Tekshiring: o'nta daftar o'ttiz ming so'm — bu yozuvni bajaradi, lekin Azizda bunday pul yo'q.",
      'Знак поставлен НАОБОРОТ. В этой записи требуется, чтобы стоимость тетрадей была больше или равна деньгам Азиза, то есть чтобы денег НЕ ХВАТИЛО. А в условии наоборот: денег должно хватить, значит стоимость не должна превышать сумму. Проверь: десять тетрадей это тридцать тысяч сумов — эта запись выполняется, но таких денег у Азиза нет.',
      'The sign is REVERSED. This record demands that the cost of the notebooks be greater than or equal to Aziz\'s money, that is that the money NOT be enough. The condition says the opposite: the money must suffice, so the cost must not exceed the sum. Check: ten notebooks cost thirty thousand soums — this record holds, yet Aziz does not have that much.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu yerda narx daftarlar soniga QO'SHILGAN, ko'paytirilmagan. Har daftar uch ming so'm turadi, ya'ni ikkita daftar olti ming, uchtasi to'qqiz ming — bu ko'paytirish. Qo'shish esa ma'nosiz chiqadi: x ta daftar qo'shuv uch ming so'm degan kattalik yo'q.",
      'Здесь цена СЛОЖЕНА с числом тетрадей, а не умножена. Каждая тетрадь стоит три тысячи, значит две тетради шесть тысяч, три — девять тысяч, и это умножение. А сложение даёт бессмыслицу: величины «x тетрадей плюс три тысячи сумов» не существует.',
      'Here the price is ADDED to the number of notebooks instead of being multiplied. Each notebook costs three thousand, so two cost six thousand and three cost nine thousand — that is multiplication. Addition yields nonsense: there is no quantity «x notebooks plus three thousand soums».') },
    { when: (s) => s.picked === 3, text: L(
      "Kattaliklar ALMASHGAN: bu yozuvda Azizning puli daftarlar soniga ko'paytirilgan. Ma'nosini o'qing — yigirma ming so'mni x marta olsak, u uch ming so'mdan kam bo'lishi kerak. Bunday shart masalada yo'q. Ko'paytiriladigan narsa — BITTA daftarning narxi.",
      'Величины ПЕРЕПУТАНЫ: в этой записи деньги Азиза умножены на число тетрадей. Прочитай смысл — двадцать тысяч сумов, взятые x раз, должны быть меньше трёх тысяч. Такого условия в задаче нет. Умножается цена ОДНОЙ тетради.',
      'The quantities are SWAPPED: this record multiplies Aziz\'s money by the number of notebooks. Read the meaning — twenty thousand soums taken x times must be less than three thousand. There is no such condition in the problem. What gets multiplied is the price of ONE notebook.') },
  ],
  wrongText: L(
    "Avval x ta daftarning narxini yozing: bitta daftarning narxini x ga ko'paytiring. Keyin uni Azizning puli bilan solishtiring: narx puldan oshmasligi kerak.",
    'Сначала запиши стоимость x тетрадей: цену одной умножь на x. Потом сравни её с деньгами Азиза: стоимость не должна превышать сумму.',
    'First write the cost of x notebooks: multiply the price of one by x. Then compare it with Aziz\'s money: the cost must not exceed the sum.'),
};

export default function D28_01(props) { return <Choice data={DATA} {...props} />; }
