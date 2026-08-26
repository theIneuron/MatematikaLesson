// Dars21 · Amaliyot 08 — Juftlash · 🔴 · tag: problem_to_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 8-pozitsiya)
//
// T1 TO'LIQ OCHILADI. To'rt shartda noma'lum bir xil belgilangan (x), farq
// esa IKKINCHI kattalikni x orqali qanday yozishda:
//   ketma-ket son          -> x + 1
//   ketma-ket juft son     -> x + 2
//   sonning kvadrati       -> x²
//   ketma-ket sonlarning kvadratlari -> x² va (x + 1)²
//
// Ellik olti ikki shartda uchraydi (birinchisi va uchinchisi) — songa qarab
// juftlash ishlamaydi, tuzilishga qarash kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'problem_to_equation', level: '🔴',
  connect: true,
  targetSize: 13,
  items: [
    { id: 'm1', label: L("ketma-ket ikki son, ko'paytmasi 56", 'два последовательных числа, произведение 56', 'two consecutive numbers, product 56') },
    { id: 'm2', label: L("ketma-ket ikki JUFT son, ko'paytmasi 48", 'два последовательных ЧЁТНЫХ числа, произведение 48', 'two consecutive EVEN numbers, product 48') },
    { id: 'm3', label: L("son va uning kvadrati, yig'indisi 56", 'число и его квадрат, сумма 56', 'a number and its square, sum 56') },
    { id: 'm4', label: L("ketma-ket ikki son, kvadratlari yig'indisi 85", 'два последовательных числа, сумма квадратов 85', 'two consecutive numbers, sum of squares 85') },
  ],
  targets: [
    { id: 't1', tokens: ['x(x + 1) = 56'] },
    { id: 't2', tokens: ['x(x + 2) = 48'] },
    { id: 't3', tokens: ['x + x² = 56'] },
    { id: 't4', tokens: ['x² + (x + 1)² = 85'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt shart va to'rt tenglama. Hamma joyda kichik son x, farq esa ikkinchi kattalikni x orqali qanday yozishda.",
    'Четыре условия и четыре уравнения. Везде меньшее число x, а различие в том, как через x записана вторая величина.',
    'Four conditions and four equations. Everywhere the smaller number is x; the difference is how the second quantity is written through x.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми условие слева, потом его уравнение справа.',
    'Tap a condition on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Ketma-ket sonlar bir birlik bilan farq qiladi, ya'ni x qo'shuv bir; ketma-ket juft sonlar esa ikki birlik bilan. Uchinchi shartda ikkinchi son yo'q — son va uning kvadrati. To'rtinchisida ikkala son ham kvadratga oshiriladi.",
    'Верно. Последовательные числа отличаются на единицу, то есть x плюс один; последовательные чётные — на два. В третьем условии второго числа нет: само число и его квадрат. В четвёртом оба числа возводятся в квадрат.',
    'Correct. Consecutive numbers differ by one, that is x plus one; consecutive even ones differ by two. The third condition has no second number: the number itself and its square. In the fourth both numbers are squared.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
        "Bu ikki shart bitta so'z bilan farq qiladi: JUFT. Ketma-ket sonlar bir birlik bilan farq qiladi (x qo'shuv bir), ketma-ket juft sonlar esa ikki birlik bilan.",
        'Эти условия отличаются одним словом: ЧЁТНЫХ. Последовательные отличаются на единицу (x плюс один), чётные — на два (x плюс два).',
        'These conditions differ by one word: EVEN. Consecutive numbers differ by one (x plus one), consecutive even ones by two (x plus two).') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Uchinchi shartda IKKI SON YO'Q: bitta son bor va uning kvadrati. Shuning uchun tenglamada ham ikki ko'paytuvchi emas, x qo'shuv x kvadrat turadi. Bu shartda ellik olti bor, lekin ellik olti birinchi shartda ham bor — songa qarab juftlash ishlamaydi.",
      'В третьем условии ДВУХ ЧИСЕЛ НЕТ: есть одно число и его квадрат. Поэтому и в уравнении не два множителя, а x плюс x квадрат. В этом условии есть пятьдесят шесть, но пятьдесят шесть есть и в первом — по числу пары не составишь.',
      'The third condition has NO TWO NUMBERS: there is one number and its square. So the equation has no two factors either, but x plus x squared. This condition contains fifty six, yet so does the first — matching by the number does not work.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "To'rtinchi shartda «kvadratlari yig'indisi» deyilgan, ya'ni AVVAL har son kvadratga oshiriladi, KEYIN qo'shiladi. Yozuvda ikki kvadrat turishi kerak: x kvadrat va x qo'shuv bir ning kvadrati. Tekshiring: o'ttiz olti qo'shuv qirq to'qqiz sakson besh.",
      'В четвёртом условии сказано «сумма квадратов», то есть СНАЧАЛА каждое число возводится в квадрат, а ПОТОМ они складываются. В записи должно стоять два квадрата: x квадрат и квадрат скобки x плюс один. Проверь: тридцать шесть плюс сорок девять восемьдесят пять.',
      'The fourth condition says «sum of squares», that is FIRST each number is squared and THEN they are added. The record must hold two squares: x squared and the square of the bracket x plus one. Check: thirty six plus forty nine is eighty five.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har shart bilan bitta ish qiling: kichik son x bo'lsa, ikkinchi kattalik x orqali qanday yoziladi degan savolga javob bering. Undan keyingina amalga qarang — ko'paytmami yoki yig'indi.",
      'С каждым условием делай одно: если меньшее число x, то как через x записывается вторая величина. И только потом смотри на действие — произведение или сумма.',
      'Do one thing with each condition: if the smaller number is x, how is the second quantity written through x. Only then look at the operation — product or sum.') },
  ],
  wrongText: L(
    "Avval ikkinchi kattalikni x orqali yozing: bir ortiq, ikki ortiq yoki kvadrat. Keyin amalni tanlang. Sonning o'ziga qarab juftlab bo'lmaydi — ellik olti ikki shartda bor.",
    'Сначала запиши вторую величину через x: на единицу больше, на два больше или квадрат. Потом выбери действие. По самому числу пары не составишь — пятьдесят шесть встречается в двух условиях.',
    'First write the second quantity through x: one greater, two greater, or a square. Then choose the operation. Matching by the number itself fails — fifty six appears in two conditions.'),
};

export default function D21_08(props) { return <MatchPairs data={DATA} {...props} />; }
