// Dars36 · Amaliyot 03 — Nechta · 🟢 · tag: product_rule
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 3-pozitsiya)
//
// T2 ENG SODDA HOLDA: ikki bosqich, va ular KETMA-KET — avval ko'ylak,
// keyin shim. Ketma-ket bosqichlar KO'PAYTIRILADI.
//
// Asosiy xato — yetti, ya'ni qo'shish (З74). Razbor uni jadval bilan
// rad etadi: har ko'ylakka to'rttadan juftlik to'g'ri keladi, ya'ni uchta
// qatorda to'rttadan katak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'product_rule', level: '🟢',
  target: 12, allowNeg: false,
  // `expr` YO'Q ATAYLAB: `3 · 4` yozuvi javobning amalini oldindan aytib
  // qo'yardi, savol esa aynan shu — qo'shiladimi yoki ko'paytiriladimi.
  // Sahna faqat SO'Z bilan beriladi, va u uch tilda ham chiqadi.
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Shkafda uchta ko'ylak va to'rtta shim bor. Bitta ko'ylak va bitta shim tanlanadi. Bunday kiyim juftligini nechta usulda tanlash mumkin?",
    'В шкафу три рубашки и четверо брюк. Выбирается одна рубашка и одни брюки. Сколькими способами можно выбрать такую пару?',
    'There are three shirts and four pairs of trousers in the wardrobe. One shirt and one pair are chosen. In how many ways can such an outfit be chosen?'),
  label: L('Juftliklar soni', 'Число пар', 'The number of outfits'),
  ask: L('Nechta juftlik tuziladi?', 'Сколько получается пар?', 'How many outfits are there?'),
  correctText: L(
    "To'g'ri. Tanlash ikki bosqichda boradi va ular ketma-ket: avval ko'ylak tanlanadi, keyin shim. Har ko'ylakka to'rtta shimning har biri mos keladi, ya'ni har ko'ylak to'rtta juftlik beradi. Ko'ylak uchta, demak jami uch karra to'rt — o'n ikki. Buni jadval bilan ko'rish oson: uchta qator, to'rtta ustun, va har katak bitta juftlik. Kataklarni sanang — o'n ikkita. Qo'shish bu yerda yaramaydi: uch qo'shuv to'rt yetti degani ko'ylakni YOKI shimni tanlash degani bo'lardi, biz esa ikkalasini birga tanlayapmiz.",
    'Верно. Выбор идёт в два шага, и они последовательны: сначала выбирается рубашка, потом брюки. Каждой рубашке подходят любые из четырёх брюк, то есть каждая рубашка даёт четыре пары. Рубашек три, значит всего трижды четыре — двенадцать. Это легко увидеть таблицей: три строки, четыре столбца, и каждая клетка — одна пара. Сосчитай клетки — двенадцать. Сложение здесь не годится: три плюс четыре семь означало бы выбрать рубашку ИЛИ брюки, а мы выбираем и то, и другое.',
    'Correct. The choice goes in two steps, and they are sequential: first the shirt, then the trousers. Every shirt goes with any of the four pairs of trousers, so each shirt gives four outfits. There are three shirts, so three times four in all — twelve. A table makes it plain: three rows, four columns, and each cell is one outfit. Count the cells — twelve. Addition will not do here: three plus four is seven, which would mean choosing a shirt OR trousers, while we are choosing both.'),
  wrongs: [
    { when: (s) => s.value === 7, text: L(
      "Uch va to'rt QO'SHILDI, lekin bu yerda ko'paytirish kerak. Qo'shish boshqa savolga javob beradi: «bitta narsa tanlansa, nechta yo'l bor» — ya'ni ko'ylak YOKI shim. Bizda esa ikkala narsa ham tanlanadi, va bosqichlar ketma-ket. Jadval chizing: uchta qator, to'rtta ustun. Yettita katak chizib bo'lmaydi — jadval to'liq to'lganda o'n ikkita bo'ladi.",
      'Три и четыре СЛОЖИЛИ, но здесь нужно умножение. Сложение отвечает на другой вопрос: «сколько способов выбрать одну вещь» — то есть рубашку ИЛИ брюки. А у нас выбираются обе вещи, и шаги последовательны. Нарисуй таблицу: три строки, четыре столбца. Семь клеток нарисовать не выйдет — заполненная таблица даёт двенадцать.',
      'Three and four were ADDED, but multiplication is what is needed here. Addition answers a different question: «how many ways to choose one item» — a shirt OR trousers. Here both are chosen and the steps are sequential. Draw a table: three rows, four columns. Seven cells cannot be drawn — a full table gives twelve.') },
    { when: (s) => s.value === 34 || s.value === 43, text: L(
      "Ikki son yonma-yon yozildi, lekin bu hisob emas. Savol nechta JUFTLIK tuzilishi haqida: har ko'ylakka to'rttadan juftlik to'g'ri keladi, ko'ylak esa uchta. Uch karra to'rt o'n ikki. Javobni tekshirish oson: juftliklar soni eng katta guruhdan katta, lekin ikki guruh ko'paytmasidan oshmaydi.",
      'Два числа записали подряд, но это не вычисление. Вопрос о том, сколько получается ПАР: каждой рубашке отвечают четыре пары, а рубашек три. Трижды четыре двенадцать. Проверить легко: число пар больше самой большой группы, но не превышает произведения двух групп.',
      'The two numbers were written side by side, but that is not a computation. The question is how many OUTFITS there are: each shirt gives four, and there are three shirts. Three times four is twelve. An easy check: the number of outfits exceeds the largest group but does not go beyond the product of the two groups.') },
    { when: (s) => s.value === 3 || s.value === 4 || s.value === 1, text: L(
      "Faqat bitta guruh sanaldi, ikkinchisi hisobga olinmadi. Ikkala tanlov ham bo'lishi kerak: ko'ylaksiz ham, shimsiz ham juftlik yig'ilmaydi. Har ko'ylak to'rtta juftlik beradi, ko'ylak uchta — uch karra to'rt o'n ikki.",
      'Сосчитана только одна группа, вторая не учтена. Нужны оба выбора: без рубашки пара не соберётся, как и без брюк. Каждая рубашка даёт четыре пары, рубашек три — трижды четыре двенадцать.',
      'Only one group was counted, the other left out. Both choices are needed: no outfit is assembled without a shirt, nor without trousers. Each shirt gives four outfits and there are three shirts — three times four is twelve.') },
  ],
  wrongText: L(
    "Ketma-ket ikki bosqich ko'paytiriladi. Jadval bilan tekshiring: har ko'ylakka to'rttadan juftlik to'g'ri keladi.",
    'Два последовательных шага перемножаются. Проверь таблицей: каждой рубашке отвечают четыре пары.',
    'Two sequential steps are multiplied. Check with a table: each shirt gives four outfits.'),
};

export default function D36_03(props) { return <TypeValue data={DATA} {...props} />; }
