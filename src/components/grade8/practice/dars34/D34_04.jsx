// Dars34 · Amaliyot 04 — Pazl · 🟡 · tag: variant_to_relative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 4-pozitsiya)
//
// CHAPDA VARIANT, O'NGDA ULUSH. Chastotalar (4, 3, 2) kartada UMUMAN
// yo'q — bu ataylab: juftlash faqat nisbiy chastota bilan bo'ladi, ya'ni
// har javob bo'lish orqali olinadi.
//
// Tanlanma hajmi o'n, shuning uchun bo'lish oson va o'nli kasr chiroyli
// chiqadi: 4:10 = 0,4; 3:10 = 0,3; 2:10 = 0,2. Ulushlar yig'indisi esa
// birdan kichik, chunki beshlik jadvalda yo'q — buni razbor aytadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'variant_to_relative', level: '🟡',
  faceSize: 14, faceSizePhone: 12,
  given: [['n = 10']],
  givenLabel: L('Tanlanma hajmi', 'Объём выборки', 'The sample size'),
  cards: [
    { id: 'f1', side: 0, tokens: ['2'] },
    { id: 'f2', side: 0, tokens: ['3'] },
    { id: 'f3', side: 0, tokens: ['4'] },
    { id: 'v1', side: 1, v: '0,4' },
    { id: 'v2', side: 1, v: '0,3' },
    { id: 'v3', side: 1, v: '0,2' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Chapda tanlanmaning uch varianti: ikki, uch va to'rt. O'ngda ularning nisbiy chastotalari. Tanlanmada ikkilik to'rt marta, uchlik uch marta, to'rtlik ikki marta uchraydi, tanlanma hajmi esa o'n.",
    'Слева три варианта выборки: два, три и четыре. Справа их относительные частоты. В выборке двойка встречается четыре раза, тройка три, четвёрка два, а объём выборки десять.',
    'On the left, three variants of the sample: two, three and four. On the right, their relative frequencies. In the sample the two occurs four times, the three three times, the four twice, and the sample size is ten.'),
  ask: L(
    'Variantni bosing, keyin uyani bosing.',
    'Нажми вариант, потом ячейку.',
    'Tap a variant, then a slot.'),
  bank: L('Variantlar', 'Варианты', 'Variants'),
  correctText: L(
    "To'g'ri. Nisbiy chastota chastotani tanlanma hajmiga bo'lishdan chiqadi: to'rt bo'lingan o'n — nol butun to'rt o'ndan; uch bo'lingan o'n — nol butun uch o'ndan; ikki bo'lingan o'n — nol butun ikki o'ndan. Diqqat qiling: chap ustundagi son VARIANT, o'ngdagisi esa ULUSH. To'rtlik varianti nol butun ikki o'ndan ulushga ega — ikkalasida «ikki» eshitilgani tasodif.",
    'Верно. Относительная частота получается делением частоты на объём выборки: четыре делить на десять — нуль целых четыре десятых; три делить на десять — нуль целых три десятых; два делить на десять — нуль целых две десятых. Обрати внимание: число слева — ВАРИАНТ, справа — ДОЛЯ. У варианта четыре доля нуль целых две десятых, и то, что в обоих слышится «два», — совпадение.',
    'Correct. A relative frequency comes from dividing the frequency by the sample size: four by ten is zero point four; three by ten is zero point three; two by ten is zero point two. Note: the number on the left is the VARIANT, the one on the right the SHARE. The variant four has the share zero point two, and «two» sounding in both is a coincidence.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "To'rtlik varianti bilan uning ulushi chalkashtirilyapti. Chap ustundagi to'rt — VARIANT, ya'ni to'rtta kitob o'qigan o'quvchilar haqida; ular esa ikki kishi, ya'ni chastota ikki. Ulush ikki bo'lingan o'n — nol butun ikki o'ndan. Chap va o'ng ustundagi sonlarni bevosita solishtirib bo'lmaydi: birinchisi kitoblarni sanaydi, ikkinchisi o'quvchilarning ulushini.",
      'Вариант четыре путают с его долей. Четвёрка в левом столбце — это ВАРИАНТ, то есть речь об учениках, прочитавших четыре книги; а их двое, значит частота два. Доля два делить на десять — нуль целых две десятых. Числа левого и правого столбцов нельзя сравнивать напрямую: первое считает книги, второе — долю учеников.',
      'The variant four is being confused with its share. The four in the left column is the VARIANT, that is, it concerns students who read four books; and there are two of them, so the frequency is two. The share is two divided by ten — zero point two. The numbers in the two columns cannot be compared directly: the first counts books, the second counts the share of students.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Ikkilik tanlanmada ENG KO'P uchraydigan variant: to'rt marta. Shuning uchun uning ulushi ham eng katta — nol butun to'rt o'ndan. Ulushlarni tartiblang: eng ko'p uchraydigan variantga eng katta ulush to'g'ri keladi, va bu tartib har doim saqlanadi, chunki hamma ulush bir xil songa bo'linadi.",
      'Двойка — САМЫЙ частый вариант выборки: четыре раза. Поэтому и доля у неё наибольшая — нуль целых четыре десятых. Упорядочь доли: самому частому варианту отвечает наибольшая доля, и этот порядок сохраняется всегда, ведь все доли делятся на одно и то же число.',
      'The two is the MOST frequent variant of the sample: four times. So its share is the largest as well — zero point four. Order the shares: the most frequent variant takes the largest share, and this order always holds, since every share is divided by the same number.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Uchlikning chastotasi uch, va tanlanma hajmi o'n: uch bo'lingan o'n nol butun uch o'ndan. Bu yerda variant va ulush sonlari bir-biriga o'xshab ketadi, lekin ular bir xil narsa emas: uchlik varianti uchun ulush nol butun uch o'ndan, va bu faqat hajm o'n bo'lgani uchun shunday chiroyli chiqdi.",
      'Частота тройки равна трём, а объём выборки десять: три делить на десять нуль целых три десятых. Здесь числа варианта и доли похожи, но это не одно и то же: у варианта три доля нуль целых три десятых, и так красиво вышло лишь потому, что объём равен десяти.',
      'The frequency of the three is three and the sample size is ten: three divided by ten is zero point three. Here the numbers of the variant and the share resemble each other, but they are not the same thing: the variant three has the share zero point three, and it came out so neatly only because the size is ten.') },
  ],
  wrongText: L(
    "Avval variantning chastotasini sanang, keyin uni tanlanma hajmiga bo'ling. Chap ustunda variant turadi, o'ngda esa ulush.",
    'Сначала сосчитай частоту варианта, потом раздели её на объём выборки. В левом столбце стоит вариант, в правом доля.',
    'First count the frequency of the variant, then divide it by the sample size. The left column holds the variant, the right one the share.'),
};

export default function D34_04(props) { return <PairSlots data={DATA} {...props} />; }
