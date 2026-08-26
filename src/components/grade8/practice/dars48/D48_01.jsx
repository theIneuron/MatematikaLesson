// Dars48 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: arc_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 1-pozitsiya)
//
// JAVOB: HA, HA (skelet §0a.1). Ikkala da'vo ham rost va ular T2 ning ikki
// yarmi: kichik yoy markaziy burchakka TENG, katta yoy esa 360 dan ayirish
// bilan topiladi. O'quvchi ikkinchisini «bir yoy ikki xil o'lchovda
// bo'lolmaydi» deb rad etadi — razbor IKKI YOY borligini aytadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'arc_claims', level: '🟢',
  itemSize: 16,
  given: [['∠AOB = 70°']],
  givenLabel: L('Markaziy burchak', 'Центральный угол', 'The central angle'),
  items: [
    { id: 's1', yes: true, tokens: ['⌒AB = 70°'], at: '< 180°',
      claim: L("kichik yoyning gradus o'lchovi shunday", 'такова градусная мера малой дуги', 'such is the degree measure of the minor arc') },
    { id: 's2', yes: true, tokens: ['⌒AB = 290°'], at: '> 180°',
      claim: L("katta yoyning gradus o'lchovi shunday", 'такова градусная мера большой дуги', 'such is the degree measure of the major arc') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "A va B nuqtalari aylanani IKKI yoyga bo'ladi: bittasi kichik, bittasi katta. Markaziy burchak ∠AOB yetmish gradusga teng. Ikki da'vo shu ikki yoy haqida.",
    'Точки A и B делят окружность на ДВЕ дуги: одну малую, одну большую. Центральный угол ∠AOB равен семидесяти градусам. Два утверждения об этих двух дугах.',
    'The points A and B split the circle into TWO arcs: a minor one and a major one. The central angle ∠AOB is seventy degrees. The two claims are about those two arcs.'),
  ask: L(
    "Da'vo to'g'ri bo'lsa «Ha» ni, xato bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ошибочно — «Нет».',
    'Tap «Yes» if the claim is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost, va ular bir-biriga qarshi emas: A va B nuqtalari aylanada IKKI yoy hosil qiladi. Kichik yoy yarim aylanadan kichik, ya'ni uning gradus o'lchovi markaziy burchakka teng — yetmish gradus. Katta yoy esa aylananing qolgan qismi: uch yuz oltmish minus yetmish, ya'ni ikki yuz to'qson gradus. Tekshirish oson: ikki yoyning yig'indisi butun aylanani beradi — yetmish qo'shuv ikki yuz to'qson uch yuz oltmish. Diqqat qiladigan joy: bitta yozuv AB ikki xil yoyni bildirishi mumkin, shuning uchun qaysi yoy haqida gap borayotganini har doim aytish kerak.",
    'Верно, оба истинны, и они друг другу не противоречат: точки A и B образуют на окружности ДВЕ дуги. Малая дуга меньше полуокружности, значит её градусная мера равна центральному углу — семьдесят градусов. А большая дуга — остаток окружности: триста шестьдесят минус семьдесят, то есть двести девяносто градусов. Проверка простая: сумма двух дуг даёт всю окружность — семьдесят плюс двести девяносто равно трёмстам шестидесяти. На что стоит обратить внимание: одна запись AB может означать две разные дуги, поэтому всегда надо говорить, о какой из них речь.',
    'Correct, both are true and they do not contradict each other: the points A and B make TWO arcs on the circle. The minor arc is less than a semicircle, so its degree measure equals the central angle — seventy degrees. The major arc is the rest of the circle: three hundred sixty minus seventy, that is two hundred ninety degrees. An easy check: the two arcs add up to the whole circle — seventy plus two hundred ninety is three hundred sixty. Worth noticing: one record AB can mean two different arcs, so it must always be said which one is meant.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Kichik yoy uchun hech narsa hisoblanmaydi: uning gradus o'lchovi markaziy burchakning O'ZIGA teng. Bu ta'rifning bir qismi — yoy yarim aylanadan kichik yoki teng bo'lsa, o'lchovi burchakka teng. Yetmish gradus yarim aylanadan (bir yuz sakson) kichik, ya'ni bu holat aynan shu.",
      'Для малой дуги ничего не вычисляется: её градусная мера равна САМОМУ центральному углу. Это часть определения — если дуга меньше полуокружности или равна ей, её мера равна углу. Семьдесят градусов меньше полуокружности (ста восьмидесяти), значит это как раз тот случай.',
      'Nothing is computed for the minor arc: its degree measure equals the central angle ITSELF. That is part of the definition — if an arc is less than or equal to a semicircle, its measure equals the angle. Seventy degrees is less than a semicircle (one hundred eighty), so this is that case.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ham rost, chunki u BOSHQA yoy haqida. A va B nuqtalari aylanani ikki bo'lakka bo'ladi: qisqa yo'l va uzun yo'l. Qisqa yo'l yetmish gradus, uzun yo'l esa uch yuz oltmish minus yetmish, ya'ni ikki yuz to'qson. Ikki yoy bir vaqtda mavjud va ular bir-biriga xalaqit bermaydi.",
      'Второе утверждение тоже верно, потому что оно про ДРУГУЮ дугу. Точки A и B делят окружность на две части: короткий путь и длинный. Короткий — семьдесят градусов, длинный — триста шестьдесят минус семьдесят, то есть двести девяносто. Две дуги существуют одновременно и друг другу не мешают.',
      'The second claim is true as well, because it is about the OTHER arc. The points A and B split the circle into two parts: the short way round and the long way. The short one is seventy degrees, the long one three hundred sixty minus seventy, that is two hundred ninety. Both arcs exist at once and do not clash.') },
  ],
  wrongText: L(
    "Ikki nuqta aylanada IKKI yoy hosil qiladi. Kichigi burchakka teng, kattasi 360 dan ayirish bilan topiladi.",
    'Две точки образуют на окружности ДВЕ дуги. Малая равна углу, большая находится вычитанием из 360.',
    'Two points make TWO arcs on a circle. The minor equals the angle, the major comes from subtracting from 360.'),
};

export default function D48_01(props) { return <TrueFalse data={DATA} {...props} />; }
