// Dars32 · Amaliyot 05 — Pazl · 🟡 · tag: op_to_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 5-pozitsiya)
//
// UCH YOZUVDA O'SHA IKKI SON — TO'RT VA UCH. Farq faqat AMALDA, va uchala
// xossa yonma-yon turadi:
//   a⁴·a³  -> qo'shiladi   -> a⁷
//   a⁴:a³  -> ayiriladi    -> a¹, ya'ni a
//   (a⁴)³  -> ko'paytiriladi -> a¹²
// Ikkinchi juftlik alohida: natija a birinchi darajasi, va u odatda
// shunchaki a deb yoziladi — buni razbor aytadi.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'op_to_result', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['a⁴·a³'] },
    { id: 'f2', side: 0, tokens: ['a⁴:a³'] },
    { id: 'f3', side: 0, tokens: ['(a⁴)³'] },
    { id: 'v1', side: 1, v: 'a⁷' },
    { id: 'v2', side: 1, v: 'a' },
    { id: 'v3', side: 1, v: 'a¹²' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda bir xil ikki son turibdi — to'rt va uch. Farq faqat amalda: ko'paytirish, bo'lish va darajaga ko'tarish. Har amalning o'z qoidasi bor.",
    'В трёх записях стоят одни и те же два числа — четыре и три. Различие только в действии: умножение, деление и возведение в степень. У каждого действия своё правило.',
    'The three records hold the same two numbers — four and three. They differ only in the operation: multiplication, division and raising to a power. Each operation has its own rule.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch amal — uch qoida. Ko'paytirishda ko'rsatkichlar qo'shiladi: to'rt qo'shuv uch yetti. Bo'lishda ayiriladi: to'rt minus uch bir, va a ning birinchi darajasi shunchaki a deb yoziladi. Darajaga ko'tarishda ko'paytiriladi: to'rt karra uch o'n ikki. Sonlar bir xil, natijalar esa yetti, bir va o'n ikki — ya'ni javobni sonlar emas, AMAL hal qiladi. a ikkiga teng bo'lsa tekshirish oson: o'n olti karra sakkiz yuz yigirma sakkiz, o'n olti bo'lingan sakkiz ikki, o'n oltining kubi esa to'rt ming to'qson olti.",
    'Верно. Три действия — три правила. При умножении показатели складываются: четыре плюс три семь. При делении вычитаются: четыре минус три один, а a в первой степени записывают просто как a. При возведении в степень перемножаются: четырежды три двенадцать. Числа одни и те же, а результаты семь, один и двенадцать — значит ответ решают не числа, а ДЕЙСТВИЕ. При a равном двум проверить легко: шестнадцать на восемь сто двадцать восемь, шестнадцать делить на восемь два, а шестнадцать в кубе четыре тысячи девяносто шесть.',
    'Correct. Three operations, three rules. Multiplication adds the exponents: four plus three is seven. Division subtracts: four minus three is one, and a to the first power is simply written as a. Raising to a power multiplies: four times three is twelve. The numbers are the same while the results are seven, one and twelve — so the answer is decided not by the numbers but by the OPERATION. At a equal to two the check is easy: sixteen times eight is one hundred twenty-eight, sixteen divided by eight is two, and sixteen cubed is four thousand ninety-six.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Bo'lishda ko'rsatkichlar ayiriladi: to'rt minus uch bir. Natija a ning BIRINCHI darajasi, va uni odatda ko'rsatkichsiz yozadilar — shunchaki a. Bir yozilmagani uni yo'q qilmaydi: har qanday son birinchi darajada o'zi bo'lib qolaveradi. Son bilan tekshiring: a ikkiga teng bo'lsa, o'n oltini sakkizga bo'lsangiz ikki chiqadi, ya'ni a ning o'zi.",
      'При делении показатели вычитаются: четыре минус три один. Результат — a в ПЕРВОЙ степени, и его обычно пишут без показателя, просто a. То, что единица не написана, её не отменяет: любое число в первой степени равно самому себе. Проверь числом: при a равном двум шестнадцать делить на восемь даёт два, то есть само a.',
      'Division subtracts the exponents: four minus three is one. The result is a to the FIRST power, and it is usually written without the exponent, simply as a. The unwritten one does not disappear: any number to the first power equals itself. Check with a number: at a equal to two, sixteen divided by eight is two, that is a itself.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Qavsli yozuvda daraja yana darajaga ko'tarilgan, va bu yerda ko'rsatkichlar KO'PAYTIRILADI: to'rt karra uch o'n ikki. Ochib yozing — a to'rtinchi darajasini uch marta ko'paytirish kerak, ya'ni a o'n ikki marta ko'paytuvchi bo'ladi. Qo'shsangiz yetti chiqardi, lekin yetti bu yerda birinchi yozuvning javobi.",
      'В записи со скобкой степень возведена ещё в степень, и здесь показатели ПЕРЕМНОЖАЮТСЯ: четырежды три двенадцать. Распиши — a в четвёртой надо взять три раза, то есть a будет множителем двенадцать раз. Если сложить, вышло бы семь, но семь — это ответ первой записи.',
      'In the bracketed record a power is raised to a power again, and there the exponents MULTIPLY: four times three is twelve. Unfold it — a to the fourth taken three times, so a is a factor twelve times. Adding would give seven, but seven is the answer to the first record.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi yozuvda oddiy ko'paytirish: ko'rsatkichlar qo'shiladi, to'rt qo'shuv uch yetti. Ochib yozsangiz to'rtta a va uchta a bo'ladi, ya'ni jami yettita ko'paytuvchi. Qavs bo'lmagani muhim: qavs bo'lganda ko'paytirish boshqa qoidaga o'tardi.",
      'В первой записи обычное умножение: показатели складываются, четыре плюс три семь. В раскрытом виде это четыре множителя a и три множителя a, то есть всего семь. Важно, что скобки нет: со скобкой умножение перешло бы под другое правило.',
      'The first record is a plain multiplication: the exponents add, four plus three is seven. Unfolded it is four factors of a and three factors of a, seven in all. It matters that there is no bracket: with one, the multiplication would fall under a different rule.') },
  ],
  wrongText: L(
    "Har yozuvda avval AMALNI toping: nuqta — qo'shish, ikki nuqta — ayirish, qavs — ko'paytirish. Sonlar uch joyda ham bir xil.",
    'В каждой записи сначала найди ДЕЙСТВИЕ: точка — складываем, двоеточие — вычитаем, скобка — перемножаем. Числа во всех трёх одинаковы.',
    'In every record first find the OPERATION: a dot means add, a colon means subtract, a bracket means multiply. The numbers are the same in all three.'),
};

export default function D32_05(props) { return <PairSlots data={DATA} {...props} />; }
