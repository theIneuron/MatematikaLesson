// Dars48 · Amaliyot 04 — Kod · 🟡 · tag: code_arcs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 4-pozitsiya)
//
// UCH SAVOL, UCH YO'NALISH:
//   ∠AOB = 40°     -> kichik yoy, 40    (tenglik, hisob yo'q)
//   katta yoy 260° -> markaziy burchak, 100   (360 dan ayirish)
//   bir yoy 250°   -> ikkinchi yoy, 110       (yoylarning yig'indisi 360, T3)
// Bankdagi tuzoqlar: 250 va 260 — shartdagi sonlar, 320 — kichik yoy uchun
// keraksiz ayirish (360 minus 40).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_arcs', level: '🟡',
  expr: ['∠AOB = 40°', '   ', '⌒ = 260°', '   ', '⌒ = 250°'], exprSize: 16,
  cards: ['40', '100', '110', '250', '260', '320'],
  answer: ['40', '100', '110'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch savol: markaziy burchak qirq gradus bo'lganda kichik yoy; katta yoy ikki yuz oltmish gradus bo'lganda markaziy burchak; bir yoy ikki yuz ellik gradus bo'lganda IKKINCHI yoy.",
    'В комнате сейф, код трёхзначный. Три вопроса: малая дуга при центральном угле сорок градусов; центральный угол при большой дуге двести шестьдесят градусов; ВТОРАЯ дуга, если одна дуга двести пятьдесят градусов.',
    'There is a safe in the room and its code has three places. Three questions: the minor arc when the central angle is forty degrees; the central angle when the major arc is two hundred sixty degrees; the SECOND arc when one arc is two hundred fifty degrees.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni toping va kodga o'sish tartibida yozing.",
    'Найди три ответа и запиши их в код по возрастанию.',
    'Find the three answers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi savolda hech narsa hisoblanmaydi: qirq gradus bir yuz sakksondan kichik, ya'ni kichik yoyning o'lchovi burchakka teng — qirq. Ikkinchi savolda katta yoy berilgan, ya'ni markaziy burchakni topish uchun ayirish kerak: uch yuz oltmish minus ikki yuz oltmish, ya'ni yuz. Uchinchi savol boshqa faktga tayanadi: ikki yoyning yig'indisi uch yuz oltmish gradus, demak ikkinchi yoy uch yuz oltmish minus ikki yuz ellik, ya'ni bir yuz o'n. O'sish tartibida: qirq, yuz, bir yuz o'n. Ikkinchi va uchinchi savolda bir xil amal — ayirish, — lekin ular BOSHQA narsani topadi: biri burchakni, ikkinchisi yoyni.",
    'Верно. В первом вопросе ничего не вычисляется: сорок градусов меньше ста восьмидесяти, значит мера малой дуги равна углу — сорок. Во втором дана большая дуга, значит для центрального угла нужно вычитание: триста шестьдесят минус двести шестьдесят, то есть сто. Третий вопрос опирается на другой факт: сумма двух дуг равна трёмстам шестидесяти градусам, значит вторая дуга — триста шестьдесят минус двести пятьдесят, то есть сто десять. По возрастанию: сорок, сто, сто десять. Во втором и третьем вопросе действие одинаковое — вычитание, — но находят они РАЗНОЕ: один угол, другой дугу.',
    'Correct. The first question computes nothing: forty degrees is less than one hundred eighty, so the measure of the minor arc equals the angle — forty. The second gives a major arc, so the central angle needs a subtraction: three hundred sixty minus two hundred sixty is one hundred. The third rests on another fact: the two arcs sum to three hundred sixty degrees, so the second arc is three hundred sixty minus two hundred fifty, that is one hundred ten. In increasing order: forty, one hundred, one hundred ten. The second and third questions use the same operation — subtraction — but they find DIFFERENT things: one an angle, the other an arc.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('320') !== -1, text: L(
      "Uch yuz yigirma — birinchi savolga keraksiz ayirish qo'llangan: uch yuz oltmish minus qirq. Lekin u yerda KICHIK yoy so'ralgan, va uning o'lchovi markaziy burchakning o'ziga teng. Uch yuz yigirma — bu KATTA yoyning o'lchovi, ya'ni boshqa savolning javobi.",
      'Триста двадцать — к первому вопросу применено лишнее вычитание: триста шестьдесят минус сорок. Но там спрашивают МАЛУЮ дугу, а её мера равна самому центральному углу. Триста двадцать — это мера БОЛЬШОЙ дуги, то есть ответ на другой вопрос.',
      'Three hundred twenty means an unnecessary subtraction in the first question: three hundred sixty minus forty. But there the MINOR arc is asked for, and its measure equals the central angle itself. Three hundred twenty is the measure of the MAJOR arc — the answer to a different question.') },
    { when: (s) => s.slots.indexOf('250') !== -1 || s.slots.indexOf('260') !== -1, text: L(
      "Bu sonlar shartning o'zidan ko'chirilgan. Ikkinchi savolda ikki yuz oltmish — KATTA YOY, so'ralgan narsa esa burchak: uch yuz oltmish minus ikki yuz oltmish yuz. Uchinchi savolda ikki yuz ellik — BIRINCHI yoy, so'ralgan narsa esa ikkinchisi: uch yuz oltmish minus ikki yuz ellik bir yuz o'n.",
      'Эти числа переписаны прямо из условия. Во втором вопросе двести шестьдесят — БОЛЬШАЯ ДУГА, а спрашивают угол: триста шестьдесят минус двести шестьдесят — сто. В третьем двести пятьдесят — ПЕРВАЯ дуга, а спрашивают вторую: триста шестьдесят минус двести пятьдесят — сто десять.',
      'These numbers were copied straight from the condition. In the second question two hundred sixty is the MAJOR ARC while the angle is asked for: three hundred sixty minus two hundred sixty is one hundred. In the third two hundred fifty is the FIRST arc while the second is asked for: three hundred sixty minus two hundred fifty is one hundred ten.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: qirq, yuz, bir yuz o'n.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: сорок, сто, сто десять.',
      'The three answers are right, the order is not. The code goes in increasing order: forty, one hundred, one hundred ten.') },
    { when: (s) => s.slots.indexOf('110') === -1, text: L(
      "Kodda bir yuz o'n yo'q, lekin uchinchi savolning javobi aynan shu. Ikki yoyning gradus o'lchovlari birga butun aylanani beradi: uch yuz oltmish minus ikki yuz ellik bir yuz o'n.",
      'В коде нет ста десяти, а ответ третьего вопроса именно такой. Градусные меры двух дуг вместе дают всю окружность: триста шестьдесят минус двести пятьдесят — сто десять.',
      'The code has no one hundred ten, yet that is the answer to the third question. The degree measures of the two arcs together make the whole circle: three hundred sixty minus two hundred fifty is one hundred ten.') },
  ],
  wrongText: L(
    "Har savolda nima berilganini va nima so'ralganini ajratib oling: burchakmi yoki yoy, kichigimi yoki kattasi.",
    'В каждом вопросе различай, что дано и что спрашивают: угол или дуга, малая или большая.',
    'In every question tell apart what is given and what is asked: an angle or an arc, minor or major.'),
};

export default function D48_04(props) { return <CodeLock data={DATA} {...props} />; }
