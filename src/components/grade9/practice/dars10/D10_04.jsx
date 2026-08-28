// Dars10 · Amaliyot 04 — Javobni kiritish · 🟡 · teg: nechta-kesishish-notogri
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: x + 1 = x² − 1 → x² − x − 2 = 0 → x = −1 va x = 2.
// Asosiy tuzoq — bitta ildiz yozish (manfiysi tushib qoladi).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'nechta-kesishish-notogri', level: '🟡',
  eyebrow: L('Abssissalar', 'Абсциссы', 'Abscissas'),
  setup: L(
    "Kesishish nuqtasida ikkala igrek ham bir xil. Demak o'ng qismlarni tenglashtirish mumkin.",
    'В точке пересечения оба игрека одинаковы. Значит, правые части можно приравнять.',
    'At a crossing point both y-values are the same. So the right-hand sides can be equated.'),
  ask: L(
    "Kesishish nuqtalarining BARCHA abssissalarini yozing.",
    'Запиши ВСЕ абсциссы точек пересечения.',
    'Write down ALL abscissas of the crossing points.'),
  hint: L(
    "Bir nechta bo'lsa, nuqta-vergul bilan ajrating.",
    'Если их несколько, раздели точкой с запятой.',
    'If there are several, separate them with a semicolon.'),
  placeholder: '0; 0',
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = x + 1'], ['y = x² − 1']],
  answer: [-1, 2],
  correctText: L(
    "To'g'ri: minus bir va ikki. Tenglashtirsak, iks qo'shuv bir iks kvadrat minus birga teng bo'ladi, hamma hadni chapga o'tkazsak iks kvadrat minus iks minus ikki nolga teng. Uning ildizlari minus bir va ikki — demak umumiy nuqta IKKITA. Kvadrat tenglamaning ikkinchi ildizini tashlab ketish grafikda bitta kesishishni ko'rmaslik bilan bir xil.",
    'Верно: минус один и два. Приравняв, получим икс плюс один равно икс в квадрате минус один; перенеся всё влево, получим икс в квадрате минус икс минус два равно нулю. Его корни — минус один и два, значит общих точек ДВЕ. Отбросить второй корень квадратного уравнения — то же самое, что не увидеть на графике одно пересечение.',
    'Correct: minus one and two. Equating gives x plus one equals x squared minus one; moving everything left gives x squared minus x minus two equals zero. Its roots are minus one and two, so there are TWO common points. Dropping the second root of a quadratic is the same as missing one crossing on the graph.'),
  wrongs: [
    { when: (s) => s.set && s.set.length === 1 && s.set[0] === 2, text: L(
      "Bitta ildiz topildi, ikkinchisi tushib qoldi. Kvadrat tenglamaning ikkita ildizi bor: ko'paytmasi minus ikki, yig'indisi bir bo'lgan ikkinchi sonni ham toping.",
      'Найден один корень, второй потерян. У квадратного уравнения два корня: найди и второе число, у которого произведение минус два, а сумма один.',
      'One root was found and the other lost. The quadratic has two roots: find the second number too, with product minus two and sum one.') },
    { when: (s) => s.set && s.set.length === 1 && s.set[0] === -1, text: L(
      "Bitta ildiz topildi, ikkinchisi tushib qoldi. Grafikda ikkita kesishish bor, demak ikkita abssissa bo'lishi kerak.",
      'Найден один корень, второй потерян. На графике два пересечения, значит и абсцисс должно быть две.',
      'One root was found and the other lost. There are two crossings on the graph, so there must be two abscissas.') },
    { when: (s) => s.set && s.set.length === 2 && s.set.indexOf(0) !== -1 && s.set.indexOf(3) !== -1, text: L(
      "Bular kesishishlarning ORDINATALARI. Savolda abssissa, ya'ni iks so'ralgan.",
      'Это ОРДИНАТЫ пересечений. В вопросе спрашивают абсциссу, то есть икс.',
      'Those are the ORDINATES of the crossings. The question asks for the abscissa, that is x.') },
    { when: (s) => s.set && s.set.indexOf(1) !== -1, text: L(
      "Hadlarni ko'chirishda ishora adashdi. O'ng qismdagi minus birni chapga o'tkazsangiz, u qo'shuv bir bo'ladi: iks kvadrat minus iks minus ikki nolga teng.",
      'При переносе слагаемых сбился знак. Перенеся минус один справа налево, получишь плюс один: икс в квадрате минус икс минус два равно нулю.',
      'A sign slipped while moving terms. Moving the minus one from the right gives plus one: x squared minus x minus two equals zero.') },
  ],
  wrongText: L(
    "Ikkala o'ng qismni tenglashtiring, hamma hadni bir tomonga o'tkazing va hosil bo'lgan kvadrat tenglamani yeching. Uning ildizlari nechta bo'lsa, kesishish ham shuncha.",
    'Приравняй обе правые части, перенеси все слагаемые в одну сторону и реши полученное квадратное уравнение. Сколько у него корней, столько и пересечений.',
    'Equate the two right-hand sides, move all terms to one side and solve the quadratic. It has as many roots as there are crossings.'),
};

export default function D10_04(props) { return <TypeSet data={DATA} {...props} />; }
