// Dars33 · Amaliyot 03 — Guruhlar · 🟢 · tag: standard_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §5 (33-dars, 3-pozitsiya)
//
// SHART IKKI TOMONDAN CHEGARALANGAN, va rad etilgan kartalar uni uch xil
// buzadi:
//   36·10³   — mantissa o'ndan katta
//   0,36·10⁵ — mantissa birdan kichik
//   10·10²   — mantissa aynan O'NGA teng (chegara ichkariga kirmaydi)
//   0        — T3: nolni standart shaklda umuman yozib bo'lmaydi
//
// Qabul qilinganlar orasida `1·10⁻³` va `5·10⁰` chegaraga yaqin turadi:
// bir — pastki chegara va u KIRADI; nolinchi daraja ham standart yozuvni
// buzmaydi, chunki shart faqat mantissaga qo'yilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'standard_or_not', level: '🟢',
  zoneSize: 13, itemSize: 16, zoneLbl: 124,
  zones: [
    { id: 'z1', label: L('STANDART', 'СТАНДАРТНЫЙ', 'STANDARD') },
    { id: 'z2', label: L('STANDART EMAS', 'НЕ СТАНДАРТНЫЙ', 'NOT STANDARD') },
  ],
  items: [
    { id: 'i1', tokens: ['3,6 · 10⁴'], zone: 'z1' },
    { id: 'i2', tokens: ['36 · 10³'], zone: 'z2' },
    { id: 'i3', tokens: ['1 · 10⁻³'], zone: 'z1' },
    { id: 'i4', tokens: ['0,36 · 10⁵'], zone: 'z2' },
    { id: 'i5', tokens: ['9,99 · 10²'], zone: 'z1' },
    { id: 'i6', tokens: ['10 · 10²'], zone: 'z2' },
    { id: 'i7', tokens: ['5 · 10⁰'], zone: 'z1' },
    { id: 'i8', tokens: ['0'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv. Ularning bir qismi standart ko'rinishda, bir qismi esa yo'q. Shart bitta va u birinchi ko'paytuvchiga qo'yilgan: u birdan o'ngacha bo'lishi kerak.",
    'Восемь записей. Часть из них в стандартном виде, часть нет. Условие одно, и оно наложено на первый множитель: он должен быть от одного до десяти.',
    'Eight records. Some are in standard form, some are not. There is one condition and it applies to the first factor: it must be from one to ten.'),
  ask: L('Yozuvni bosing, keyin guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Shart ikki tomondan chegaralangan: mantissa birdan kichik bo'lmasin va o'nga YETMASIN. Uch butun olti o'ndan, bir, to'qqiz butun to'qson to'qqiz yuzdan va besh — hammasi shu oraliqda. Rad etilganlar to'rt xil sababdan: o'ttiz olti o'ndan katta; nol butun o'ttiz olti yuzdan birdan kichik; o'n esa aynan chegarada turadi, va chegaraning o'zi kirmaydi — o'n karra o'nning kvadrati aslida o'nning kubi. Nol esa alohida hol: uni standart shaklda umuman yozib bo'lmaydi, chunki mantissa hech qachon nol bo'lolmaydi, va o'nning istalgan darajasi nolga ko'paytirilsa yana nol chiqadi.",
    'Верно. Условие ограничено с двух сторон: мантисса не меньше единицы и НЕ ДОСТИГАЕТ десяти. Отвергнутые отпали по четырём причинам: тридцать шесть больше десяти; нуль целых тридцать шесть сотых меньше единицы; десятка стоит ровно на границе, а граница не входит — десять на десять в квадрате это десять в кубе. Нуль же особый случай: мантисса никогда не равна нулю, а степень десяти, умноженная на нуль, снова даёт нуль.',
    'Correct. The condition is bounded on both sides: the mantissa is not below one and does NOT REACH ten. Three point six, one, nine point nine nine and five all lie in that range. The rejected ones fail for four reasons: thirty-six exceeds ten; zero point three six is below one; ten sits exactly on the boundary, and the boundary itself is out — ten times ten squared is really ten cubed. Zero is a case of its own: it cannot be written in standard form at all, because the mantissa is never zero, and any power of ten times zero gives zero again.'),
  wrongs: [
    { when: (s) => s.place.i6 === 'z1', text: L(
      "O'n chegarada turibdi, va chegaraning O'ZI kirmaydi: mantissa o'ngacha bo'lishi kerak, o'nga yetmasligi kerak. Buni tekshirish oson — o'n karra o'nning kvadrati ming, ya'ni bu son o'nning kubi, va uning standart yozuvi bir karra o'nning kubi. Mantissa o'nga aylandi degani vergulni yana bir xona surish kerak degani.",
      'Десятка стоит на границе, и САМА граница не входит: мантисса должна быть до десяти, не достигая его. Проверить легко — десять на десять в квадрате это тысяча, то есть десять в кубе, и её стандартная запись один умножить на десять в кубе. Если мантисса стала десяткой, значит запятую надо сдвинуть ещё на разряд.',
      'Ten sits on the boundary, and the boundary ITSELF is out: the mantissa must go up to ten without reaching it. This is easy to check — ten times ten squared is a thousand, that is ten cubed, whose standard record is one times ten cubed. A mantissa that has become ten means the point must move one place further.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Nolni standart ko'rinishda yozib bo'lmaydi. Standart yozuvda mantissa kamida birga teng, ya'ni u hech qachon nol bo'lolmaydi; o'nning istalgan darajasi esa noldan farqli. Ikki noldan farqli sonning ko'paytmasi hech qachon nol bermaydi. Shuning uchun nol bu jadvaldan tashqarida qoladi — bu istisno emas, ta'rifning natijasi.",
      'Нуль нельзя записать в стандартном виде. В стандартной записи мантисса не меньше единицы, то есть нулём быть не может; а любая степень десяти отлична от нуля. Произведение двух ненулевых чисел никогда не даёт нуля. Поэтому нуль остаётся вне этой таблицы — это не исключение, а следствие определения.',
      'Zero cannot be written in standard form. In a standard record the mantissa is at least one, so it can never be zero; and every power of ten is non-zero. A product of two non-zero numbers is never zero. So zero stays outside this table — not as an exception but as a consequence of the definition.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1', text: L(
      "Bu yozuvlarda mantissa oraliqdan chiqib ketgan: bittasi o'ndan katta, ikkinchisi birdan kichik. Ikkalasini ham to'g'rilash mumkin, va son o'zgarmaydi — faqat vergul suriladi va ko'rsatkich unga mos tuzatiladi: o'ttiz olti karra o'nning kubi uch butun olti o'ndan karra o'nning to'rtinchi darajasiga aylanadi.",
      'В этих записях мантисса вышла за промежуток: одна больше десяти, другая меньше единицы. Обе можно исправить, и само число не изменится — сдвигается лишь запятая, а показатель поправляется: тридцать шесть на десять в кубе превращается в три целых шесть десятых на десять в четвёртой.',
      'In these records the mantissa has left the range: one is above ten, the other below one. Both can be corrected without changing the number — only the point moves and the exponent adjusts: thirty-six times ten cubed becomes three point six times ten to the fourth.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu yozuvlar standart. Bir — pastki chegara, va u KIRADI: shart «birdan kichik bo'lmasin» deydi. Beshning yonidagi nolinchi daraja ham hech narsani buzmaydi: shart faqat MANTISSAGA qo'yilgan, ko'rsatkichga emas. O'nning nolinchi darajasi birga teng, ya'ni bu yozuv shunchaki beshni bildiradi.",
      'Эти записи стандартны. Единица — нижняя граница, и она ВХОДИТ: условие говорит «не меньше единицы». Нулевая степень рядом с пятёркой тоже ничего не нарушает: условие наложено только на МАНТИССУ, а не на показатель. Десять в нулевой равно единице, значит эта запись означает просто пять.',
      'These records are standard. One is the lower boundary and it IS included: the condition says «not below one». The zero exponent beside the five breaks nothing either: the condition applies only to the MANTISSA, not to the exponent. Ten to the zero is one, so this record simply means five.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda faqat BIRINCHI ko'paytuvchiga qarang va ikki savol bering: u birdan kichikmi va u o'ndan kichikmi. Ko'rsatkich hech narsani hal qilmaydi — u musbat ham, manfiy ham, nol ham bo'lishi mumkin.",
      'В каждой записи смотри только на ПЕРВЫЙ множитель и задавай два вопроса: не меньше ли он единицы и меньше ли он десяти. Показатель ничего не решает — он может быть положительным, отрицательным и нулевым.',
      'In every record look only at the FIRST factor and ask two questions: is it at least one, and is it below ten. The exponent decides nothing — it may be positive, negative or zero.') },
  ],
  wrongText: L(
    "Faqat birinchi ko'paytuvchiga qarang: u birdan kichik bo'lmasin va o'nga yetmasin. Nol esa hech qanday standart yozuvga sig'maydi.",
    'Смотри только на первый множитель: он не меньше единицы и не достигает десяти. А нуль ни в какую стандартную запись не помещается.',
    'Look only at the first factor: not below one and not reaching ten. And zero fits no standard record at all.'),
};

export default function D33_03(props) { return <Zones data={DATA} {...props} />; }
