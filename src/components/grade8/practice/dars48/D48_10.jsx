// Dars48 · Amaliyot 10 — Test · 🔴 · tag: why_subtract
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 10-pozitsiya)
//
// SAVOL SABAB HAQIDA, qoida haqida emas: nima uchun katta yoy uchun ayirish
// kerak. To'g'ri javob markaziy burchakning CHEKLOVINI aytadi — u bir yuz
// saksondan katta bo'lolmaydi, aylana esa uch yuz oltmish gradus.
//
// Uch xato variant — З103 ning uch niqobi: birlik farqi, ishora farqi,
// radiusga bog'liqlik. Ularning hammasi «yoy va burchak boshqa narsa» degan
// to'g'ri kuzatishdan noto'g'ri sabab yasaydi.
// `Choice` ning variantlari SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'why_subtract', level: '🔴',
  correct: 0, optCols: 1, optSize: 14,
  given: [['⌒AB = 250°']],
  givenLabel: L('Katta yoy', 'Большая дуга', 'The major arc'),
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Yoy AB ning gradus o'lchovi ikki yuz ellik. Unga mos markaziy burchak esa yuz o'n gradus, ikki yuz ellik emas. Savol shu farqning SABABI haqida.",
    'Градусная мера дуги AB равна двумстам пятидесяти. А соответствующий ей центральный угол сто десять градусов, а не двести пятьдесят. Вопрос о ПРИЧИНЕ этого различия.',
    'The degree measure of the arc AB is two hundred fifty. The matching central angle is one hundred ten degrees, not two hundred fifty. The question is about the REASON for that difference.'),
  ask: L(
    "Nima uchun bu yoyning markaziy burchagi ikki yuz ellik gradus emas?",
    'Почему центральный угол этой дуги не равен двумстам пятидесяти градусам?',
    'Why is the central angle of this arc not two hundred fifty degrees?'),
  opts: [
    { label: L(
      "markaziy burchak 180° dan katta bo'lolmaydi, shuning uchun katta yoy uchun 360° dan ayiriladi",
      'центральный угол не бывает больше 180°, поэтому для большой дуги вычитают из 360°',
      'a central angle never exceeds 180°, so for a major arc you subtract from 360°') },
    { label: L(
      "yoy va burchak har xil birlikda o'lchanadi",
      'дуга и угол измеряются в разных единицах',
      'arcs and angles are measured in different units') },
    { label: L(
      "katta yoy burchakka teng, faqat ishorasi boshqa",
      'большая дуга равна углу, только знак другой',
      'a major arc equals the angle, only the sign differs') },
    { label: L(
      "yoyning o'lchovi aylananing radiusiga bog'liq",
      'мера дуги зависит от радиуса окружности',
      "an arc's measure depends on the radius of the circle") },
  ],
  correctText: L(
    "To'g'ri. Sabab burchakning o'zida: burchak ikki nurdan yasaladi, va ikki nur orasidagi eng katta yoyilish — to'g'ri chiziq, ya'ni bir yuz sakson gradus. Aylana esa uch yuz oltmish gradus, ya'ni burchak butun aylanani qamrab olishga qurbi yetmaydi. Shuning uchun katta yoyni ko'rsatish uchun burchak ikkinchi tomonga qaraydi va aylananing qolgan qismini oladi. Hisob esa shundan chiqadi: uch yuz oltmish minus ikki yuz ellik, ya'ni yuz o'n. Tekshirish: kichik yoy yuz o'n, katta yoy ikki yuz ellik, ikkisining yig'indisi uch yuz oltmish — butun aylana.",
    'Верно. Причина в самом угле: угол образован двумя лучами, а наибольшее раскрытие между двумя лучами — прямая линия, то есть сто восемьдесят градусов. Окружность же триста шестьдесят градусов, значит угла не хватает, чтобы охватить её целиком. Поэтому, показывая большую дугу, угол смотрит в другую сторону и берёт остаток окружности. Отсюда и счёт: триста шестьдесят минус двести пятьдесят, то есть сто десять. Проверка: малая дуга сто десять, большая двести пятьдесят, их сумма триста шестьдесят — вся окружность.',
    'Correct. The reason lies in the angle itself: an angle is made of two rays, and the widest opening between two rays is a straight line, one hundred eighty degrees. The circle is three hundred sixty degrees, so an angle cannot span it whole. To point at the major arc the angle therefore looks the other way and takes the rest of the circle. Hence the arithmetic: three hundred sixty minus two hundred fifty, that is one hundred ten. Check: the minor arc is one hundred ten, the major two hundred fifty, and together three hundred sixty — the whole circle.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Birlik bir xil: yoy ham, burchak ham GRADUSDA o'lchanadi, va aynan shuning uchun ularni bir-biri bilan solishtirish mumkin. Kichik yoyda ular hatto TENG bo'ladi: yetmish gradusli burchakka yetmish gradusli yoy mos keladi. Farq faqat katta yoyda paydo bo'ladi, va sabab birlikda emas — burchakning chegarasida.",
      'Единицы одинаковые: и дуга, и угол измеряются в ГРАДУСАХ, и именно поэтому их можно сравнивать. У малой дуги они даже РАВНЫ: углу семьдесят градусов соответствует дуга семьдесят градусов. Различие появляется только у большой дуги, и причина не в единицах, а в ограничении угла.',
      'The units are the same: both arcs and angles are measured in DEGREES, which is exactly why they can be compared. For a minor arc they are even EQUAL: an angle of seventy degrees matches an arc of seventy degrees. The difference appears only for a major arc, and the cause is not the units but the limit on angles.') },
    { when: (s) => s.picked === 2, text: L(
      "Ishora bu yerda hech qanday ish qilmaydi: burchak ham, yoy ham musbat son bilan o'lchanadi, manfiy burchak yo'q. Ikki son bir-biriga ishora bilan emas, YIG'INDI bilan bog'langan: kichik yoy qo'shuv katta yoy uch yuz oltmish. Shundan ayirish chiqadi.",
      'Знак здесь ни при чём: и угол, и дуга измеряются положительным числом, отрицательных углов нет. Два числа связаны не знаком, а СУММОЙ: малая дуга плюс большая дуга равно трёмстам шестидесяти. Отсюда и вычитание.',
      'The sign plays no part here: both angles and arcs are measured by positive numbers, and there are no negative angles. The two numbers are linked not by a sign but by a SUM: minor arc plus major arc is three hundred sixty. That is where the subtraction comes from.') },
    { when: (s) => s.picked === 3, text: L(
      "Radius yoyning GRADUS o'lchoviga umuman ta'sir qilmaydi. Kichik va katta aylanani olsangiz, bir xil markaziy burchak ikkisida ham bir xil gradusli yoyni ajratadi — faqat yoyning UZUNLIGI boshqa bo'ladi. Gradus o'lchovi burchakdan keladi, radiusdan emas.",
      'Радиус на ГРАДУСНУЮ меру дуги не влияет вовсе. Возьми маленькую и большую окружность: один и тот же центральный угол отсечёт в обеих дугу с одинаковой градусной мерой — разной будет только ДЛИНА дуги. Градусная мера идёт от угла, а не от радиуса.',
      'The radius has no effect on the DEGREE measure of an arc. Take a small circle and a large one: the same central angle cuts arcs of the same degree measure in both — only the LENGTH of the arc differs. The degree measure comes from the angle, not the radius.') },
  ],
  wrongText: L(
    "Bitta savol bering: markaziy burchak eng katta necha gradus bo'lishi mumkin, va aylana necha gradus?",
    'Задай один вопрос: каким самым большим может быть центральный угол и сколько градусов в окружности?',
    'Ask one question: how large can a central angle be at most, and how many degrees does a circle have?'),
};

export default function D48_10(props) { return <Choice data={DATA} {...props} />; }
