// Dars36 · Amaliyot 09 — Guruhlar · 🔴 · tag: equals_12_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 9-pozitsiya)
//
// TO'RT JUFTLIK, HAR BIRIDA FAQAT AMAL FARQ QILADI:
//   3·4 / 3+4 ; 2·6 / 2+6 ; 2·2·3 / 2·2+3 ; 12·1 / 12+1
// Oxirgi juftlik alohida: birga KO'PAYTIRISH natijani o'zgartirmaydi,
// birni QO'SHISH esa o'zgartiradi. Kombinatorikada bu «bitta variantli
// bosqich» degani — u sanoqqa hech narsa qo'shmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'equals_12_or_not', level: '🔴',
  zoneSize: 13, itemSize: 17, zoneLbl: 116,
  zones: [
    { id: 'z1', label: L('QIYMATI 12', 'ЗНАЧЕНИЕ 12', 'VALUE IS 12') },
    { id: 'z2', label: L('12 EMAS', 'НЕ 12', 'NOT 12') },
  ],
  items: [
    { id: 'i1', tokens: ['3 · 4'], zone: 'z1' },
    { id: 'i2', tokens: ['3 + 4'], zone: 'z2' },
    { id: 'i3', tokens: ['2 · 6'], zone: 'z1' },
    { id: 'i4', tokens: ['2 + 6'], zone: 'z2' },
    { id: 'i5', tokens: ['2 · 2 · 3'], zone: 'z1' },
    { id: 'i6', tokens: ['2 · 2 + 3'], zone: 'z2' },
    { id: 'i7', tokens: ['12 · 1'], zone: 'z1' },
    { id: 'i8', tokens: ['12 + 1'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv, va hammasida o'sha sonlar juft-juft takrorlanadi. Har juftlikda faqat AMAL o'zgargan: ko'paytirish qo'shishga almashgan.",
    'Восемь записей, и во всех числа повторяются парами. В каждой паре изменено только ДЕЙСТВИЕ: умножение заменено сложением.',
    'Eight records, and the numbers repeat in pairs throughout. In each pair only the OPERATION has changed: multiplication replaced by addition.'),
  ask: L('Yozuvni bosing, keyin guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. O'n ikkini beradiganlar: uch karra to'rt; ikki karra olti; ikki karra ikki karra uch; o'n ikki karra bir. Bermaydiganlar: uch qo'shuv to'rt yetti; ikki qo'shuv olti sakkiz; ikki karra ikki qo'shuv uch yetti; o'n ikki qo'shuv bir o'n uch. Bu sonlar bo'sh mashq emas — ular sahnalarni ifodalaydi. Uch karra to'rt: uchta ko'ylak va to'rtta shim. Ikki karra ikki karra uch: uchta ketma-ket bosqich. O'n ikki karra bir esa bitta variantli bosqich — masalan ichimlik faqat bitta bo'lsa: u sanoqni O'ZGARTIRMAYDI, chunki birga ko'paytirish hech narsa qilmaydi. Birni QO'SHSANGIZ esa sanoq o'zgaradi, va aynan shu yerda xato tug'iladi.",
    'Верно. Двенадцать дают: трижды четыре; дважды шесть; дважды два на три; двенадцать на один. Не дают: три плюс четыре семь; два плюс шесть восемь; дважды два плюс три семь; двенадцать плюс один тринадцать. Эти числа не пустое упражнение — за ними стоят сцены. Трижды четыре: три рубашки и четверо брюк. Дважды два на три: три последовательных шага. А двенадцать на один — это шаг с единственным вариантом, например когда напиток всего один: он счёт НЕ МЕНЯЕТ, ведь умножение на единицу ничего не делает. А вот ПРИБАВЛЕНИЕ единицы счёт меняет, и именно здесь рождается ошибка.',
    'Correct. Those giving twelve: three times four; two times six; two times two times three; twelve times one. Those not: three plus four is seven; two plus six is eight; two times two plus three is seven; twelve plus one is thirteen. These numbers are no idle exercise — scenes stand behind them. Three times four: three shirts and four pairs of trousers. Two times two times three: three sequential steps. And twelve times one is a step with a single option, as when there is only one drink: it does NOT change the count, since multiplying by one does nothing. ADDING one, however, does change the count, and that is where the error hides.'),
  wrongs: [
    { when: (s) => s.place.i8 === 'z1' || s.place.i7 === 'z2', text: L(
      "Bu juftlik eng nozigi: birga KO'PAYTIRISH natijani o'zgartirmaydi, birni QO'SHISH esa o'zgartiradi. O'n ikki karra bir o'n ikki; o'n ikki qo'shuv bir o'n uch. Kombinatorikada bu farq muhim: bitta variantli bosqich (masalan ichimlik faqat bitta) sanoqqa hech narsa qo'shmaydi, chunki har tayyor yo'l bitta yo'l bo'lib qolaveradi.",
      'Эта пара самая тонкая: УМНОЖЕНИЕ на единицу результат не меняет, а ПРИБАВЛЕНИЕ единицы меняет. Двенадцать на один двенадцать; двенадцать плюс один тринадцать. В комбинаторике это различие важно: шаг с единственным вариантом (например, напиток всего один) ничего к счёту не добавляет, ведь каждый готовый путь так и остаётся одним путём.',
      'This pair is the subtlest: MULTIPLYING by one changes nothing, ADDING one changes the result. Twelve times one is twelve; twelve plus one is thirteen. In combinatorics this difference matters: a step with a single option (only one drink, say) adds nothing to the count, since every finished path stays one path.') },
    { when: (s) => s.place.i6 === 'z1' || s.place.i5 === 'z2', text: L(
      "Bu ikki yozuvda o'sha uch son turibdi, farq esa oxirgi amalda. Ikki karra ikki karra uch — uchala bosqich ham ketma-ket, natija o'n ikki. Ikki karra ikki qo'shuv uch — bu ikki bosqichdan keyin uchta ALOHIDA variant qo'shilgani, natija yetti. Amallar tartibiga qarang: ko'paytirish avval bajariladi, keyin qo'shish.",
      'В этих двух записях стоят одни и те же три числа, а различие в последнем действии. Дважды два на три — все три шага подряд, результат двенадцать. Дважды два плюс три — это два шага, к которым прибавлены три ОТДЕЛЬНЫХ варианта, результат семь. Смотри на порядок действий: сначала умножение, потом сложение.',
      'These two records hold the same three numbers, differing in the last operation. Two times two times three — all three steps in sequence, result twelve. Two times two plus three — two steps followed by three SEPARATE options added, result seven. Watch the order of operations: multiplication first, then addition.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1', text: L(
      "Bu yozuvda qo'shish turibdi, va u o'n ikkini bermaydi: uch qo'shuv to'rt yetti, ikki qo'shuv olti sakkiz. Qo'shish natijani KATTA qilmaydi — u faqat variantlarni bir ro'yxatga yig'adi. Ko'paytirish esa har bosqichda ro'yxatni ko'chiradi, shuning uchun natija tez o'sadi.",
      'В этой записи стоит сложение, и двенадцати оно не даёт: три плюс четыре семь, два плюс шесть восемь. Сложение результат сильно не увеличивает — оно лишь собирает варианты в один список. А умножение на каждом шаге размножает список, поэтому результат растёт быстро.',
      'This record holds an addition, and it does not give twelve: three plus four is seven, two plus six is eight. Addition does not make the result much larger — it merely gathers options into one list. Multiplication copies the list at every step, so the result grows quickly.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2', text: L(
      "Bu yozuvda ko'paytirish turibdi va u o'n ikkini beradi: uch karra to'rt yoki ikki karra olti. Ikkala yozuv ham o'n ikkiga teng, garchi sonlar boshqa bo'lsa ham — bitta sanoqqa turli sahnalar olib kelishi mumkin: uchta ko'ylak va to'rtta shim, yoki ikkita shapka va oltita sharf.",
      'В этой записи стоит умножение, и оно даёт двенадцать: трижды четыре или дважды шесть. Обе записи равны двенадцати, хотя числа разные — к одному и тому же счёту могут вести разные сцены: три рубашки и четверо брюк или две шапки и шесть шарфов.',
      'This record holds a multiplication and it gives twelve: three times four, or two times six. Both records equal twelve though the numbers differ — different scenes can lead to the same count: three shirts and four pairs of trousers, or two hats and six scarves.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvni oddiy hisob bilan tekshiring, keyin uni o'n ikki bilan solishtiring. Amallar tartibini unutmang: ko'paytirish qo'shishdan oldin bajariladi.",
      'Проверяй каждую запись обычным счётом, потом сравнивай с двенадцатью. Не забывай порядок действий: умножение выполняется раньше сложения.',
      'Check each record with ordinary arithmetic, then compare it with twelve. Do not forget the order of operations: multiplication comes before addition.') },
  ],
  wrongText: L(
    "Har yozuvni hisoblang va o'n ikki bilan solishtiring. Ko'paytirish qo'shishdan oldin bajariladi, birga ko'paytirish esa hech narsani o'zgartirmaydi.",
    'Посчитай каждую запись и сравни с двенадцатью. Умножение выполняется раньше сложения, а умножение на единицу ничего не меняет.',
    'Compute each record and compare it with twelve. Multiplication comes before addition, and multiplying by one changes nothing.'),
};

export default function D36_09(props) { return <Zones data={DATA} {...props} />; }
