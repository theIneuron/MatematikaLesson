// Dars36 · Amaliyot 07 — Pazl · 🟡 · tag: expr_to_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 7-pozitsiya)
//
// З74 SOF ARIFMETIKADA. Uch yozuvda o'sha uch son — ikki, uch, to'rt, —
// va uch xil bog'lanish:
//   2·3·4 = 24  — uchala bosqich ham bajariladi
//   2+3+4 = 9   — uch variantdan bittasi tanlanadi
//   2·3+4 = 10  — ARALASH hol: ikki bosqich ketma-ket, uchinchisi esa
//                 alohida variant (T3)
// Uchinchisi eng qimmat: bitta masalada ikkala qoida ham ishlashi mumkin.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'expr_to_value', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['2·3·4'] },
    { id: 'f2', side: 0, tokens: ['2+3+4'] },
    { id: 'f3', side: 0, tokens: ['2·3+4'] },
    { id: 'v1', side: 1, v: '24' },
    { id: 'v2', side: 1, v: '9' },
    { id: 'v3', side: 1, v: '10' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda o'sha uch son turibdi — ikki, uch va to'rt. Farq faqat amallarda, va har yozuv boshqa turdagi sanoqni bildiradi: ko'paytirish ketma-ket bosqichlarni, qo'shish esa bir-birini istisno qiladigan variantlarni.",
    'В трёх записях стоят одни и те же три числа — два, три и четыре. Различие только в действиях, и каждая запись означает свой тип счёта: умножение — последовательные шаги, сложение — взаимоисключающие варианты.',
    'The three records hold the same three numbers — two, three and four. They differ only in the operations, and each record means a different kind of count: multiplication for sequential steps, addition for mutually exclusive options.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchi yozuvda uchala bosqich ham ketma-ket bajariladi: ikki karra uch olti, olti karra to'rt yigirma to'rt. Ikkinchisida uch variantdan faqat bittasi tanlanadi: ikki qo'shuv uch qo'shuv to'rt to'qqiz. Uchinchisi aralash: ikki bosqich ketma-ket ishlaydi va ko'paytiriladi — olti, — undan keyin to'rtta alohida variant qo'shiladi: o'n. Amallar tartibi ham shu ma'noni beradi: ko'paytirish avval bajariladi, chunki u BITTA yo'lning ichidagi bosqichlarni yig'adi, qo'shish esa tayyor yo'llarni sanaydi. Bitta masalada ikkala qoida ham uchrashi mumkin, va ularni ajratish uchun «va» bilan «yoki» ni ajratish kifoya.",
    'Верно. В первой записи все три шага выполняются подряд: дважды три шесть, шесть на четыре двадцать четыре. Во второй из трёх вариантов выбирается только один: два плюс три плюс четыре девять. Третья смешанная: два шага идут подряд и перемножаются — шесть, — а затем прибавляются четыре отдельных варианта: десять. Порядок действий несёт тот же смысл: умножение выполняется первым, потому что оно собирает шаги ВНУТРИ одного пути, а сложение считает готовые пути. В одной задаче могут встретиться оба правила, и чтобы их различить, достаточно различить «и» и «или».',
    'Correct. In the first record all three steps are carried out in sequence: two times three is six, six times four is twenty-four. In the second, only one of three options is chosen: two plus three plus four is nine. The third is mixed: two steps run in sequence and multiply — six — and then four separate options are added: ten. The order of operations carries the same meaning: multiplication comes first because it assembles the steps WITHIN one path, while addition counts finished paths. Both rules may meet in one problem, and to tell them apart it is enough to tell «and» from «or».'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuv ARALASH: unda ham ko'paytirish, ham qo'shish bor. Avval ko'paytirish bajariladi — ikki karra uch olti, — keyin to'rt qo'shiladi: o'n. Bu tasodifiy tartib emas, u ma'no bilan bog'liq: ko'paytirilgan ikki bosqich BITTA yo'lni yasaydi, to'rt esa boshqa, mustaqil yo'llar. Oltita yo'l va to'rtta yo'l — jami o'nta.",
      'Третья запись СМЕШАННАЯ: в ней есть и умножение, и сложение. Сначала выполняется умножение — дважды три шесть, — потом прибавляется четыре: десять. Это не случайный порядок, он связан со смыслом: перемноженные два шага дают ОДИН путь, а четвёрка — другие, независимые пути. Шесть путей и четыре пути — всего десять.',
      'The third record is MIXED: it holds both multiplication and addition. The multiplication is done first — two times three is six — and then four is added: ten. This is no arbitrary order, it follows the meaning: the two multiplied steps make ONE path, while the four are other, independent paths. Six paths and four paths — ten in all.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ko'paytirish va qo'shish almashib ketdi. Farqni natijaning kattaligidan ko'rish mumkin: ko'paytirish sonlarni ancha KATTA qiladi — yigirma to'rt, — qo'shish esa kichik natija beradi: to'qqiz. Kombinatorikada bu farq ma'noli: ketma-ket bosqichlar yo'llar sonini ko'paytiradi, alohida variantlar esa faqat qo'shadi.",
      'Умножение и сложение поменялись местами. Различие видно по величине результата: умножение делает числа заметно БОЛЬШЕ — двадцать четыре, — а сложение даёт маленький результат: девять. В комбинаторике это различие содержательно: последовательные шаги умножают число путей, а отдельные варианты лишь прибавляют.',
      'Multiplication and addition changed places. The difference shows in the size of the result: multiplication makes numbers much LARGER — twenty-four — while addition gives a small result: nine. In combinatorics this difference is meaningful: sequential steps multiply the number of paths, separate options merely add to it.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda faqat qo'shish bor: ikki qo'shuv uch qo'shuv to'rt to'qqiz. Bu sahnada uch guruh variant bo'lardi va ulardan FAQAT BITTASI tanlanadi — masalan avtobusda, poyezdda yoki mashinada borish. Ketma-ket bosqich yo'q, shuning uchun ko'paytirish ham yo'q.",
      'Во второй записи только сложение: два плюс три плюс четыре девять. В такой сцене было бы три группы вариантов, и выбирается ТОЛЬКО ОДИН — например, доехать автобусом, поездом или машиной. Последовательных шагов нет, поэтому нет и умножения.',
      'The second record has only addition: two plus three plus four is nine. Such a scene would have three groups of options and only ONE is chosen — travelling by bus, by train or by car, say. There are no sequential steps, so there is no multiplication.') },
  ],
  wrongText: L(
    "Har yozuvni amal bo'yicha o'qing: ko'paytirish ketma-ket bosqichlarni yig'adi, qo'shish esa alohida variantlarni sanaydi. Aralash yozuvda ko'paytirish oldin bajariladi.",
    'Читай каждую запись по действию: умножение собирает последовательные шаги, сложение считает отдельные варианты. В смешанной записи умножение выполняется первым.',
    'Read each record by its operation: multiplication assembles sequential steps, addition counts separate options. In a mixed record the multiplication comes first.'),
};

export default function D36_07(props) { return <PairSlots data={DATA} {...props} />; }
