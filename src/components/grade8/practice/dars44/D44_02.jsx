// Dars44 · Amaliyot 02 — Guruhlar · 🟢 · tag: equality_holds
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 2-pozitsiya)
//
// BU DARSDA FAQAT TENGLIK TEKSHIRILADI, XULOSA CHIQARILMAYDI (skelet §6):
// «tenglik bajarildi, demak uchburchak to'g'ri burchakli» degan yo'nalish
// TESKARI teorema, va u 45-dars. Shuning uchun zonalar `a² + b² = c²` va
// `a² + b² ≠ c²` deb yozilgan, «to'g'ri burchakli» deb emas.
//
// З91 shu jadvalda ko'rinadi: chiziqli qo'shish bilan yurgan o'quvchi
// birinchi kartani ham «teng emas» ga qo'yadi (uch qo'shuv to'rt yetti).
// Rad etilganlarning ikkitasi juda yaqin: 113 va 100, 85 va 81.
// Kartalarda faqat BELGI turadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'equality_holds', level: '🟢',
  zoneLbl: 116, zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'z1', tokens: ['a² + b² = c²'] },
    { id: 'z2', tokens: ['a² + b² ≠ c²'] },
  ],
  items: [
    { id: 'i1', tokens: ['3, 4, 5'], zone: 'z1' },
    { id: 'i2', tokens: ['4, 5, 6'], zone: 'z2' },
    { id: 'i3', tokens: ['6, 8, 10'], zone: 'z1' },
    { id: 'i4', tokens: ['5, 6, 8'], zone: 'z2' },
    { id: 'i5', tokens: ['5, 12, 13'], zone: 'z1' },
    { id: 'i6', tokens: ['7, 8, 10'], zone: 'z2' },
    { id: 'i7', tokens: ['8, 15, 17'], zone: 'z1' },
    { id: 'i8', tokens: ['6, 7, 9'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz uchlik berilgan, har birida uchinchi son eng katta. Bir qismida ikki kichik sonning kvadratlari yig'indisi kattasining kvadratiga teng, bir qismida esa teng emas.",
    'Даны восемь троек, в каждой третье число наибольшее. У части из них сумма квадратов двух меньших равна квадрату большего, у части не равна.',
    'Eight triples are given, the third number the largest in each. For some the sum of the squares of the two smaller ones equals the square of the largest, for others it does not.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Uchliklar', 'Тройки', 'Triples'),
  correctText: L(
    "To'g'ri. Har kartada ikki son chiqariladi va solishtiriladi. Uch, to'rt, besh: to'qqiz qo'shuv o'n olti yigirma besh, va besh kvadrat yigirma besh — teng. Olti, sakkiz, o'n: o'ttiz olti qo'shuv oltmish to'rt yuz, o'n kvadrat yuz — teng. Besh, o'n ikki, o'n uch: yigirma besh qo'shuv bir yuz qirq to'rt bir yuz oltmish to'qqiz, o'n uch kvadrat ham shu. Sakkiz, o'n besh, o'n yetti: oltmish to'rt qo'shuv ikki yuz yigirma besh ikki yuz sakson to'qqiz, o'n yetti kvadrat ham shu. Rad etilganlarning ikkitasi chegaraga juda yaqin: yetti, sakkiz, o'n da bir yuz o'n uch va yuz; olti, yetti, to'qqiz da sakson besh va sakson bir. Bunday kartani faqat aniq hisob ajratadi.",
    'Верно. В каждой карточке вычисляются и сравниваются два числа. Три, четыре, пять: девять плюс шестнадцать — двадцать пять, и пять в квадрате двадцать пять — равно. Шесть, восемь, десять: тридцать шесть плюс шестьдесят четыре — сто, десять в квадрате сто — равно. Пять, двенадцать, тринадцать: двадцать пять плюс сто сорок четыре — сто шестьдесят девять, и тринадцать в квадрате столько же. Восемь, пятнадцать, семнадцать: шестьдесят четыре плюс двести двадцать пять — двести восемьдесят девять, и семнадцать в квадрате столько же. Две отвергнутые совсем близко к границе: у семь, восемь, десять — сто тринадцать и сто; у шесть, семь, девять — восемьдесят пять и восемьдесят один. Такие карточки различает только точный счёт.',
    'Correct. Two numbers are computed and compared in every card. Three, four, five: nine plus sixteen is twenty five, and five squared is twenty five — equal. Six, eight, ten: thirty six plus sixty four is one hundred, ten squared is one hundred — equal. Five, twelve, thirteen: twenty five plus one hundred forty four is one hundred sixty nine, and thirteen squared is the same. Eight, fifteen, seventeen: sixty four plus two hundred twenty five is two hundred eighty nine, and seventeen squared is the same. Two of the rejected ones sit very close to the line: for seven, eight, ten it is one hundred thirteen against one hundred; for six, seven, nine, eighty five against eighty one. Only exact arithmetic separates such cards.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2', text: L(
      "Bu kartalar eng tanish uchliklar, va ularda tenglik bajariladi. Ehtimol uzunliklar qo'shilgan: uch qo'shuv to'rt yetti, olti qo'shuv sakkiz o'n to'rt. Teorema esa KVADRATLARNI qo'shadi: to'qqiz qo'shuv o'n olti yigirma besh.",
      'Это самые известные тройки, и в них равенство выполняется. Возможно, сложены длины: три плюс четыре — семь, шесть плюс восемь — четырнадцать. А теорема складывает КВАДРАТЫ: девять плюс шестнадцать — двадцать пять.',
      'These are the best known triples, and the equality does hold in them. Perhaps the lengths were added: three plus four is seven, six plus eight is fourteen. The theorem adds SQUARES: nine plus sixteen is twenty five.') },
    { when: (s) => s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu ikki uchlik chegaraga juda yaqin, lekin tenglik BAJARILMAYDI. Yetti, sakkiz, o'n: qirq to'qqiz qo'shuv oltmish to'rt bir yuz o'n uch, o'n kvadrat esa yuz. Olti, yetti, to'qqiz: o'ttiz olti qo'shuv qirq to'qqiz sakson besh, to'qqiz kvadrat esa sakson bir. Farq kichik bo'lgani ahamiyatsiz — tenglik yo bor, yo yo'q.",
      'Эти две тройки совсем близко к границе, но равенство НЕ выполняется. Семь, восемь, десять: сорок девять плюс шестьдесят четыре — сто тринадцать, а десять в квадрате сто. Шесть, семь, девять: тридцать шесть плюс сорок девять — восемьдесят пять, а девять в квадрате восемьдесят один. Малая разница ничего не меняет — равенство либо есть, либо нет.',
      'These two triples sit very close to the line, but the equality does NOT hold. Seven, eight, ten: forty nine plus sixty four is one hundred thirteen while ten squared is one hundred. Six, seven, nine: thirty six plus forty nine is eighty five while nine squared is eighty one. A small gap changes nothing — the equality either holds or it does not.') },
    { when: (s) => s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu uchliklarning sonlari kattaroq, lekin ish o'sha: kvadratlarni chiqarib qo'shish. Besh, o'n ikki, o'n uch: yigirma besh qo'shuv bir yuz qirq to'rt bir yuz oltmish to'qqiz — bu o'n uch kvadrat. Sakkiz, o'n besh, o'n yetti: oltmish to'rt qo'shuv ikki yuz yigirma besh ikki yuz sakson to'qqiz — bu o'n yetti kvadrat.",
      'В этих тройках числа больше, но работа та же: возвести в квадрат и сложить. Пять, двенадцать, тринадцать: двадцать пять плюс сто сорок четыре — сто шестьдесят девять, это тринадцать в квадрате. Восемь, пятнадцать, семнадцать: шестьдесят четыре плюс двести двадцать пять — двести восемьдесят девять, это семнадцать в квадрате.',
      'The numbers in these triples are larger, but the work is the same: square and add. Five, twelve, thirteen: twenty five plus one hundred forty four is one hundred sixty nine, which is thirteen squared. Eight, fifteen, seventeen: sixty four plus two hundred twenty five is two hundred eighty nine, which is seventeen squared.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada uch qadam: ikki kichik sonning kvadratlarini chiqarish, ularni qo'shish, keyin eng katta sonning kvadrati bilan solishtirish. Sonlarning kattaligiga yoki tanishligiga qarab hukm qilib bo'lmaydi.",
      'В каждой карточке три шага: возвести в квадрат два меньших числа, сложить их и сравнить с квадратом наибольшего. Судить по величине чисел или по их узнаваемости нельзя.',
      'Three steps in every card: square the two smaller numbers, add them, compare with the square of the largest. Neither the size of the numbers nor how familiar they look can decide.') },
  ],
  wrongText: L(
    "Ikki kichik sonning kvadratlarini qo'shing va eng kattasining kvadrati bilan solishtiring.",
    'Сложи квадраты двух меньших чисел и сравни с квадратом наибольшего.',
    'Add the squares of the two smaller numbers and compare with the square of the largest.'),
};

export default function D44_02(props) { return <Zones data={DATA} {...props} />; }
