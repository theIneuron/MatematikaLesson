// Dars13 · Amaliyot 07 — Kod · 🟡 · tag: code_coefficients
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 7-pozitsiya)
//
// Uch yozuvdan chiqarilgan KOEFFITSIYENTLAR kod bo'ladi: 5, 6, 12.
// Bankdagi tuzoqlar bu darsning eng tipik xatosi — CHIQARISH OXIRIGACHA
// BAJARILMAGAN holat:
//   3  — 108 = 9 · 12 deb ajratildi, 12 da yana to'rt qoldi (3√12);
//   2  — 288 = 4 · 72 deb ajratildi, 72 da yana 36 qoldi (2√72);
//   25 — 125 ni beshga bo'lish, ya'ni ildiz bilan umuman aloqasi yo'q yo'l.
// Har razbor tuzoqni SON bilan rad etadi: uch o'n ikkidan ildiz to'g'ri
// qiymatni beradi, lekin yozuv eng qisqa ko'rinishda emas — ildiz ostida
// hali to'liq kvadrat turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_coefficients', level: '🟡',
  // Uch yozuv nuqtali vergul bilan ajratiladi (12-darsning 10-topshirig'idagi
  // o'lchov): bo'sh joy tokeni yiqiladi va ildizlar qo'shilib ko'rinadi.
  expr: [{ r: '125' }, ';', { r: '108' }, ';', { r: '288' }], exprSize: 22,
  cards: ['2', '3', '5', '6', '12', '25'],
  answer: ['5', '6', '12'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch yozuvni eng qisqa ko'rinishga keltirish kerak: ildiz ostidan chiqqan koeffitsiyentlar kodni beradi.",
    'В комнате сейф, код трёхзначный. Три записи надо привести к самому короткому виду: коэффициенты, вышедшие из-под корня, и дают код.',
    'There is a safe in the room and its code has three places. Bring the three records to their shortest form: the coefficients that leave the root give the code.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Har yozuvdan to'liq kvadratni chiqaring va koeffitsiyentlarni o'sish tartibida kodga yozing.",
    'Вынеси из каждой записи полный квадрат и запиши коэффициенты в код по возрастанию.',
    'Take the perfect square out of each record and write the coefficients into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Yuz yigirma besh bu yigirma besh karra besh — koeffitsiyent besh. Yuz sakkiz bu o'ttiz olti karra uch — koeffitsiyent olti. Ikki yuz sakson sakkiz bu yuz qirq to'rt karra ikki — koeffitsiyent o'n ikki. O'sish tartibida besh, olti, o'n ikki. Har javob kvadratga oshirib tekshiriladi: koeffitsiyentning kvadrati karra ildiz osti dastlabki sonni beradi.",
    'Верно. Сто двадцать пять это двадцать пять на пять — коэффициент пять. Сто восемь это тридцать шесть на три — коэффициент шесть. Двести восемьдесят восемь это сто сорок четыре на два — коэффициент двенадцать. По возрастанию: пять, шесть, двенадцать. Каждый ответ проверяется возведением в квадрат: квадрат коэффициента на подкоренное даёт исходное число.',
    'Correct. One hundred twenty five is twenty five times five — coefficient five. One hundred eight is thirty six times three — coefficient six. Two hundred eighty eight is one hundred forty four times two — coefficient twelve. In increasing order: five, six, twelve. Every answer checks by squaring: the coefficient squared times the radicand gives the original number.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1, text: L(
      "Uchta to'xtash yuz sakkizni to'qqiz karra o'n ikki deb ajratishdan chiqadi. Qiymat buzilmaydi, lekin yozuv eng qisqa emas: o'n ikkining ichida yana to'rt bor. Chiqarishni davom ettiring — to'qqiz karra to'rt o'ttiz olti, demak koeffitsiyent olti, ildiz ostida esa uch qoladi.",
      'Три получается, если разложить сто восемь как девять на двенадцать. Значение не портится, но запись не самая короткая: внутри двенадцати сидит ещё четыре. Продолжи вынесение — девять на четыре тридцать шесть, значит коэффициент шесть, а под корнем остаётся три.',
      'Three comes from splitting one hundred eight as nine times twelve. The value is not spoiled, but the record is not the shortest: another four sits inside twelve. Keep going — nine times four is thirty six, so the coefficient is six and three stays under the root.') },
    { when: (s) => s.slots.indexOf('2') !== -1, text: L(
      "Ikkita ikki yuz sakson sakkizni to'rt karra yetmish ikki deb ajratishdan chiqadi. Yetmish ikkining ichida esa o'ttiz olti bor. Eng katta to'liq kvadratni izlang: yuz qirq to'rt karra ikki ikki yuz sakson sakkiz, demak koeffitsiyent o'n ikki.",
      'Двойка получается, если разложить двести восемьдесят восемь как четыре на семьдесят два. А внутри семидесяти двух сидит тридцать шесть. Ищи наибольший полный квадрат: сто сорок четыре на два двести восемьдесят восемь, значит коэффициент двенадцать.',
      'Two comes from splitting two hundred eighty eight as four times seventy two. And thirty six sits inside seventy two. Look for the largest perfect square: one hundred forty four times two is two hundred eighty eight, so the coefficient is twelve.') },
    { when: (s) => s.slots.indexOf('25') !== -1, text: L(
      "Yigirma besh — bu yuz yigirma beshni beshga bo'lish, ildiz bilan aloqasi yo'q. Chiqarishda son BO'LINMAYDI, u ko'paytuvchilarga ajratiladi: yuz yigirma besh bu yigirma besh karra besh, va ildiz ostidan yigirma beshning ildizi chiqadi — besh.",
      'Двадцать пять — это сто двадцать пять разделить на пять, к корню это отношения не имеет. При вынесении число не ДЕЛЯТ, его разбивают на множители: сто двадцать пять это двадцать пять на пять, и из-под корня выходит корень из двадцати пяти — пять.',
      'Twenty five is one hundred twenty five divided by five, which has nothing to do with the root. Taking out does not DIVIDE the number, it splits it into factors: one hundred twenty five is twenty five times five, and what leaves the root is the root of twenty five — five.') },
    { when: (s) => s.set, text: L(
      "Koeffitsiyentlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: besh, olti, o'n ikki.",
      'Коэффициенты найдены верно, а порядок нет. Возрастание начинается с наименьшего: пять, шесть, двенадцать.',
      'The coefficients are right, the order is not. Increasing starts from the smallest: five, six, twelve.') },
    { when: (s) => s.slots.indexOf('6') === -1, text: L(
      "Uch koeffitsiyentning biri tushib qolgan: yuz sakkizda eng katta to'liq kvadrat o'ttiz olti, uning ildizi olti. Uchala yozuvni ham oxirigacha chiqaring.",
      'Один из трёх коэффициентов потерялся: в ста восьми наибольший полный квадрат тридцать шесть, его корень шесть. Вынеси все три записи до конца.',
      'One of the three coefficients is missing: in one hundred eight the largest perfect square is thirty six, whose root is six. Take all three records out to the end.') },
  ],
  wrongText: L(
    "Har sondan ENG KATTA to'liq kvadratni chiqaring, aks holda ildiz ostida yana kvadrat qolib ketadi. Javobni kvadratga oshirib tekshiring: koeffitsiyentning kvadrati karra ildiz ostidagi son dastlabki songa teng bo'lishi kerak.",
    'Выноси из каждого числа НАИБОЛЬШИЙ полный квадрат, иначе под корнем останется ещё один. Проверяй возведением в квадрат: квадрат коэффициента на подкоренное должен дать исходное число.',
    'Take the LARGEST perfect square out of each number, otherwise another square stays under the root. Check by squaring: the coefficient squared times the radicand must give the original number.'),
};

export default function D13_07(props) { return <CodeLock data={DATA} {...props} />; }
