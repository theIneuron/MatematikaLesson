// Dars09 · Amaliyot 01 — Birinchi qadam · 🟢 · tag: first_step_plan
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 2(x + 5) = 3x − 4. Tenglamada QAVS bor, ya'ni ko'chirishdan oldin uni
// ochish kerak: qavs ichidagi hadlar hali 2 ga ko'paytirilmagan.
// Xato variantlar: darhol ko'chirish (qavs ichidagi x ni ko'chirib bo'lmaydi)
// va darhol bo'lish (o'ng tomonda ikki had bor, ularni 2 ga bo'lish
// yechimni chalkashtiradi).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'first_step_plan', level: '🟢',
  eyebrow: L('Birinchi qadam', 'Первый шаг', 'The first step'),
  setup: L(
    "Chiziqli tenglama tartib bilan yechiladi: qavs ochiladi, hadlar ko'chiriladi, o'xshashlar yig'iladi, oxirida koeffitsiyentga bo'linadi.",
    'Линейное уравнение решается по порядку: раскрыть скобки, перенести слагаемые, привести подобные, в конце разделить на коэффициент.',
    'A linear equation is solved in order: open the brackets, move the terms, collect like terms, finally divide by the coefficient.'),
  expr: ['2', '·', '(', 'x', '+', '5', ')', '=', '3x', '−', '4'], exprSize: 28,
  ask: L('Bu tenglamada birinchi qadam qanday?', 'Каким будет первый шаг в этом уравнении?', 'What is the first step in this equation?'),
  opts: [
    { label: L('Qavsni ochish', 'Раскрыть скобку', 'Open the bracket') },
    { label: L('3x ni chapga ko\'chirish', 'Перенести 3x влево', 'Move 3x to the left') },
    { label: L('Ikki tomonni 2 ga bo\'lish', 'Разделить обе части на 2', 'Divide both sides by 2') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Qavs ichidagi hadlar hali 2 ga ko'paytirilmagan: 2 · x va 2 · 5. Ochilgandan keyin 2x + 10 = 3x − 4 chiqadi.",
    'Верно. Слагаемые в скобке ещё не умножены на 2: 2 · x и 2 · 5. После раскрытия получится 2x + 10 = 3x − 4.',
    'Correct. The terms in the bracket are not multiplied by 2 yet: 2 · x and 2 · 5. Opening it gives 2x + 10 = 3x − 4.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "3x ni ko'chirish mumkin, lekin chap tomonda x hali QAVS ICHIDA turibdi -- unga qo'shib bo'lmaydi. Avval qavs ochiladi.",
      'Перенести 3x можно, но слева x пока СТОИТ В СКОБКЕ — сложить с ним нельзя. Сначала раскрывают скобку.',
      'Moving 3x is possible, but on the left the x is still INSIDE THE BRACKET — nothing can be added to it. The bracket comes first.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki tomonni 2 ga bo'lish mumkin, lekin o'ng tomonda IKKI had bor: 3x va −4, ikkovini ham bo'lish kerak bo'ladi. Qavsni ochish qisqaroq.",
      'Разделить обе части на 2 можно, но справа ДВА слагаемых: 3x и −4, делить придётся оба. Раскрыть скобку короче.',
      'Dividing both sides by 2 is allowed, but the right side has TWO terms, 3x and −4, and both would need dividing. Opening the bracket is shorter.') },
  ],
  wrongText: L(
    "Yozuvga qarang: qavs bormi? Bo'lsa, birinchi qadam -- uni ochish.",
    'Посмотри на запись: есть скобка? Если есть, первый шаг — раскрыть её.',
    'Look at the record: is there a bracket? If so, the first step is to open it.'),
};

export default function D09_01(props) { return <Choice data={DATA} {...props} />; }
