// Dars34 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 7-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCH ATAMASI. Bankdagi tuzoqlar:
//   «o'rtacha qiymat» va «moda» — 35-darsning atamalari, bu yerda ular
//                                 gapga tushadi, lekin yolg'on;
//   «tanlanma hajmi»           — mavjud atama, lekin u boshqa narsani
//                                 nomlaydi: natijalar SONI.
// `ClozeBank` — kartalari `L()` oladigan yagona mexanika, shuning uchun
// har darsning atama-topshirig'i aynan shu tipda (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Tanlanma natijalari o'sish tartibida yozilsa,",
      'Если результаты выборки записать по возрастанию, получится',
      'If the sample results are written in increasing order, the result is the') },
    { slot: 0 },
    { text: L(
      "hosil bo'ladi. Variant necha marta uchragani",
      '. Число, сколько раз встретился вариант, называется', '. The number of times a variant occurs is the') },
    { slot: 1 },
    { text: L(
      ", uning tanlanma hajmiga nisbati esa",
      ', а его отношение к объёму выборки —', ', and its ratio to the sample size is the') },
    { slot: 2 },
    { text: L('deyiladi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('variatsion qator', 'вариационный ряд', 'variation series') },
    { id: 'w2', label: L('chastota', 'частотой', 'frequency') },
    { id: 'w3', label: L('nisbiy chastota', 'относительной частотой', 'relative frequency') },
    { id: 'w4', label: L("o'rtacha qiymat", 'среднее значение', 'mean') },
    { id: 'w5', label: L('moda', 'мода', 'mode') },
    { id: 'w6', label: L('tanlanma hajmi', 'объём выборки', 'sample size') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uchala atamasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa boshqa narsani nomlaydi.",
    'Все три термина урока собраны в одно предложение, но три слова выпали. В банке шесть карточек: три встают на место, а три называют другое.',
    'All three terms of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards: three fit, and three name something else.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch atama uch bosqichni nomlaydi. Avval natijalar tartiblanadi — variatsion qator hosil bo'ladi, va unda hamma natija saqlanadi. Keyin har variant necha marta uchragani sanaladi — bu chastota, va u butun son. Oxirida chastota tanlanma hajmiga bo'linadi — bu nisbiy chastota, va u ulush, ya'ni noldan birgacha. Uchtasi ketma-ket turadi: birinchisi tartib beradi, ikkinchisi sanoq, uchinchisi esa nisbat. Va yana bitta fakt bu gapga sig'magan, lekin u har doim ishlaydi: chastotalar yig'indisi tanlanma hajmiga teng.",
    'Верно. Три термина называют три шага. Сначала результаты упорядочиваются — получается вариационный ряд, и в нём сохраняются все результаты. Потом считается, сколько раз встретился каждый вариант, — это частота, и она целое число. В конце частота делится на объём выборки — это относительная частота, и она доля, то есть от нуля до единицы. Три идут подряд: первый даёт порядок, второй счёт, третий отношение. И ещё один факт в это предложение не поместился, но он работает всегда: сумма частот равна объёму выборки.',
    'Correct. Three terms name three steps. First the results are ordered — that gives the variation series, and it keeps every result. Then it is counted how many times each variant occurs — that is the frequency, a whole number. Finally the frequency is divided by the sample size — that is the relative frequency, a share between zero and one. The three follow one another: the first gives order, the second a count, the third a ratio. And one more fact did not fit this sentence, though it always holds: the sum of the frequencies equals the sample size.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1, text: L(
      "«O'rtacha qiymat» va «moda» — keyingi darsning atamalari, va ular bu gapdagi hech bir bo'shliqqa tushmaydi. O'rtacha qiymat yig'indini soniga bo'lishdan chiqadi, moda esa eng ko'p uchraydigan qiymat. Bu darsda esa gap qatorni TARTIBLASH va uchrashlarni SANASH haqida — hech qanday o'rtacha hisoblanmayapti.",
      '«Среднее значение» и «мода» — термины следующего урока, и ни в один пропуск этого предложения они не встают. Среднее получается делением суммы на количество, а мода — это самое частое значение. В этом же уроке речь об УПОРЯДОЧИВАНИИ ряда и ПОДСЧЁТЕ встреч — никакое среднее здесь не вычисляется.',
      '«Mean» and «mode» are terms of the next lesson, and they fit none of the gaps in this sentence. The mean comes from dividing a sum by a count, and the mode is the most frequent value. This lesson is about ORDERING the series and COUNTING occurrences — no average is being computed.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Tanlanma hajmi» — haqiqiy atama, lekin u boshqa narsani nomlaydi: tanlanmadagi natijalarning umumiy SONI. Bu gapda esa u allaqachon aytilgan — «tanlanma hajmiga nisbati» degan so'zlarda. Nisbatning O'ZI boshqacha nomlanadi, va aynan shu nom so'ralyapti.",
      '«Объём выборки» — настоящий термин, но он называет другое: общее КОЛИЧЕСТВО результатов в выборке. А в этом предложении он уже упомянут — в словах «отношение к объёму выборки». САМО отношение называется иначе, и именно это название спрашивают.',
      '«Sample size» is a real term, but it names something else: the total NUMBER of results in the sample. And in this sentence it has already been mentioned — in the words «ratio to the sample size». The ratio ITSELF has a different name, and that is the name being asked for.') },
    { when: (s) => s.slots[1] === 'w3' || s.slots[2] === 'w2', text: L(
      "Chastota va nisbiy chastota o'rin almashdi. Ularni gapning o'zi ajratadi: «necha marta uchragani» — bu SANOQ, ya'ni chastota; «tanlanma hajmiga nisbati» — bu BO'LISH natijasi, ya'ni nisbiy chastota. Ikkinchisining nomida «nisbiy» so'zi bejiz turmaydi — u nisbatdan kelib chiqqan.",
      'Частота и относительная частота поменялись местами. Их различает само предложение: «сколько раз встретился» — это ПОДСЧЁТ, то есть частота; «отношение к объёму выборки» — это результат ДЕЛЕНИЯ, то есть относительная частота. Слово «относительная» в названии стоит не зря — оно от отношения.',
      'Frequency and relative frequency changed places. The sentence itself tells them apart: «how many times it occurs» is a COUNT, that is the frequency; «its ratio to the sample size» is the result of a DIVISION, that is the relative frequency. The word «relative» in the name is there for a reason — it comes from the ratio.') },
    { when: (s) => s.slots.indexOf('w1') === -1, text: L(
      "Birinchi bo'shliqda tartiblangan qatorning nomi turishi kerak — variatsion qator. Uni tanlanmaning o'zidan ajrating: tanlanma natijalar KELGAN tartibda, variatsion qator esa O'SISH tartibida yozilgan. Ikkalasida ham o'sha sonlar, lekin ikkinchisi bilan ishlash oson.",
      'В первом пропуске должно стоять название упорядоченного ряда — вариационный ряд. Отличай его от самой выборки: выборка записана в порядке ПОСТУПЛЕНИЯ, а вариационный ряд по ВОЗРАСТАНИЮ. Числа те же, но со вторым работать удобно.',
      'The first gap needs the name of the ordered row — the variation series. Tell it from the sample itself: the sample is written in the order the results ARRIVED, the variation series in INCREASING order. The same numbers in both, but the second is the one you can work with.') },
  ],
  wrongText: L(
    "Uch bosqichni ajrating: tartiblash, sanash va bo'lish. Har bosqichning o'z nomi bor, va ular ketma-ket keladi.",
    'Раздели три шага: упорядочивание, подсчёт и деление. У каждого шага своё название, и идут они по порядку.',
    'Separate the three steps: ordering, counting and dividing. Each step has its own name, and they come in order.'),
};

export default function D34_07(props) { return <ClozeBank data={DATA} {...props} />; }
