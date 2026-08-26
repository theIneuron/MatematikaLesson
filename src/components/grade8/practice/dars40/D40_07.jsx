// Dars40 · Amaliyot 07 — Juftlash · 🟡 · tag: given_to_unknown
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 7-pozitsiya)
//
// TESKARI MASALA: yuza berilgan, o'lchamlardan biri izlanadi.
//   S=36, a=9 -> h=4
//   S=48, a=6 -> h=8
//   S=45, h=5 -> a=9      <- bu yerda noma'lum ASOS
//   S=42, a=7 -> h=6
// Uchinchi qator boshqacha: formulaning ikki tomoni ham teng huquqli, ya'ni
// bo'lish asosni ham, balandlikni ham topa oladi. Buni ko'rmaslik — eng
// ko'p uchraydigan chalkashlik.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'given_to_unknown', level: '🟡',
  connect: true,
  targetSize: 20, itemSize: 15,
  items: [
    { id: 'm1', tokens: ['S = 36,  a = 9'] },
    { id: 'm2', tokens: ['S = 48,  a = 6'] },
    { id: 'm3', tokens: ['S = 45,  h = 5'] },
    { id: 'm4', tokens: ['S = 42,  a = 7'] },
  ],
  targets: [
    { id: 't1', tokens: ['4'] },
    { id: 't2', tokens: ['8'] },
    { id: 't3', tokens: ['9'] },
    { id: 't4', tokens: ['6'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt teskari masala: yuza va bitta o'lcham berilgan, ikkinchisini topish kerak. Diqqat: uch qatorda balandlik izlanadi, bittasida esa ASOS.",
    'Четыре обратные задачи: даны площадь и один размер, надо найти второй. Внимание: в трёх строках ищется высота, а в одной ОСНОВАНИЕ.',
    'Four inverse problems: the area and one measurement are given, the other must be found. Note: three rows look for the height, one for the BASE.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan noma'lum o'lchamni bosing.",
    'Нажми условие слева, потом искомый размер справа.',
    'Tap a condition on the left, then the unknown measurement on the right.'),
  correctText: L(
    "To'g'ri. Yuzaning formulasi ko'paytma, ya'ni noma'lumni bo'lish bilan topamiz: o'ttiz olti bo'lingan to'qqiz to'rt; qirq sakkiz bo'lingan olti sakkiz; qirq ikki bo'lingan yetti olti. Uchinchi qator boshqa: u yerda balandlik berilgan va ASOS izlanadi, lekin amal o'sha bo'lib qolaveradi — qirq besh bo'lingan besh to'qqiz. Buning sababi shundaki, ko'paytmada ikki ko'paytuvchi teng huquqli: qaysi biri noma'lum bo'lsa ham, uni yuzani ikkinchisiga bo'lib topamiz. Har javobni tekshirish oson — topilgan sonni berilganiga ko'paytiring, yuza chiqishi kerak.",
    'Верно. Формула площади — произведение, значит неизвестное находим делением: тридцать шесть делить на девять четыре; сорок восемь делить на шесть восемь; сорок два делить на семь шесть. Третья строка другая: там дана высота и ищется ОСНОВАНИЕ, но действие остаётся тем же — сорок пять делить на пять девять. Причина в том, что в произведении оба множителя равноправны: какой бы из них ни был неизвестен, его находят делением площади на второй. Каждый ответ легко проверить — умножь найденное на данное, должна получиться площадь.',
    'Correct. The area formula is a product, so the unknown is found by dividing: thirty-six divided by nine is four; forty-eight by six is eight; forty-two by seven is six. The third row is different: there the height is given and the BASE is sought, yet the operation stays the same — forty-five divided by five is nine. The reason is that in a product the two factors have equal standing: whichever is unknown, it is found by dividing the area by the other. Every answer is easy to check — multiply what you found by what was given and you should get the area.'),
  wrongs: [
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Uchinchi qatorda BALANDLIK berilgan va asos izlanadi — bu qolgan uchtasidan farq qiladi. Amal esa o'zgarmaydi: qirq beshni beshga bo'ling, to'qqiz chiqadi. Ko'paytmada ikki ko'paytuvchi bir xil huquqda: qaysi biri noma'lum bo'lsa, uni yuzani ikkinchisiga bo'lib topamiz. Shartni oxirigacha o'qing — u yerda h yozilgan, a emas.",
      'В третьей строке дана ВЫСОТА и ищется основание — этим она отличается от остальных трёх. Действие при этом не меняется: раздели сорок пять на пять, получится девять. В произведении оба множителя равноправны: какой бы ни был неизвестен, его находят делением площади на второй. Дочитай условие — там написано h, а не a.',
      'The third row gives the HEIGHT and looks for the base — that is what sets it apart from the other three. The operation is unchanged: divide forty-five by five and you get nine. In a product both factors have equal standing: whichever is unknown, it is found by dividing the area by the other. Read the condition to the end — it says h, not a.') },
    { when: (s) => s.pair.m1 === 't4' || s.pair.m4 === 't1', text: L(
      "Bu ikki javob almashib ketdi. Har birini bo'lib tekshiring: o'ttiz olti bo'lingan to'qqiz to'rt; qirq ikki bo'lingan yetti olti. Yoki teskari amal bilan: to'rt karra to'qqiz o'ttiz olti, olti karra yetti qirq ikki. Ko'paytirish har javobni bir sekundda tasdiqlaydi yoki rad etadi.",
      'Эти два ответа поменялись местами. Проверь каждый делением: тридцать шесть делить на девять четыре; сорок два делить на семь шесть. Или обратным действием: четырежды девять тридцать шесть, шестью семь сорок два. Умножение подтверждает или отвергает каждый ответ за секунду.',
      'These two answers were swapped. Check each by dividing: thirty-six by nine is four; forty-two by seven is six. Or by the inverse operation: four times nine is thirty-six, six times seven is forty-two. Multiplying confirms or rejects each answer in a second.') },
    { when: (s) => s.pair.m2 !== 't2', text: L(
      "Qirq sakkizni oltiga bo'ling — sakkiz chiqadi. Diqqat qiling: bu yerda javob berilgan asosdan KATTA, va bu g'alati emas. Asos kichik bo'lsa, o'sha yuzani berish uchun balandlik katta bo'lishi kerak. Tekshiring: sakkiz karra olti qirq sakkiz.",
      'Раздели сорок восемь на шесть — получится восемь. Обрати внимание: здесь ответ БОЛЬШЕ данного основания, и это не странно. Если основание маленькое, высота должна быть большой, чтобы дать ту же площадь. Проверь: восемью шесть сорок восемь.',
      'Divide forty-eight by six — you get eight. Note: here the answer is LARGER than the given base, and that is nothing odd. With a small base the height must be large to give the same area. Check: eight times six is forty-eight.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har qatorda ikki narsani aniqlang: nima berilgan (a yoki h) va nima izlanadi. Amal esa har doim bitta — yuzani berilgan o'lchamga bo'lish. Javobni ko'paytirib tekshiring.",
      'В каждой строке определи две вещи: что дано (a или h) и что ищется. Действие же всегда одно — разделить площадь на данный размер. Проверяй ответ умножением.',
      'In every row settle two things: what is given (a or h) and what is sought. The operation is always the same — divide the area by the given measurement. Check the answer by multiplying.') },
  ],
  wrongText: L(
    "Noma'lum o'lchamni yuzani berilganiga bo'lib toping. Asos ham, balandlik ham shu yo'l bilan topiladi — ular formulada teng huquqli.",
    'Находи неизвестный размер делением площади на данный. И основание, и высота находятся так же — в формуле они равноправны.',
    'Find the unknown measurement by dividing the area by the given one. Base and height alike are found this way — they have equal standing in the formula.'),
};

export default function D40_07(props) { return <MatchPairs data={DATA} {...props} />; }
