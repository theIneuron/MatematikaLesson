// Dars30 · Amaliyot 01 — Birinchi amal · 🟢 · choice · tag: whole_first_step
// Mexanika: kit.jsx -> Choice. Raskladka: 30-dars, 1-o'rin (isinish).
// 3(x + 2) − (x − 4): birinchi amal -- qavslarni ochish. O'xshash hadlarni
// qo'shish faqat undan KEYIN mumkin.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_first_step', level: '🟢',
  eyebrow: L('Birinchi qadam', 'Первый шаг', 'The first step'),
  setup: L(
    "Butun ifodani ixchamlash tartibi bor: avval qavslar ochiladi, keyin o'xshash hadlar yig'iladi.",
    'У упрощения целого выражения есть порядок: сначала раскрываются скобки, потом приводятся подобные.',
    'Simplifying has an order: open the brackets first, then collect like terms.'),
  expr: ['3(x', '+', '2)', '−', '(x', '−', '4)'], exprSize: 26,
  ask: L('Birinchi qanday amal bajariladi?', 'Какое действие выполняется первым?', 'Which action comes first?'),
  opts: [
    { label: L('Qavslarni ochish', 'Раскрыть скобки', 'Open the brackets') },
    { label: L("O'xshash hadlarni qo'shish", 'Сложить подобные', 'Collect like terms') },
    { label: L('Qavslarni almashtirish', 'Поменять скобки местами', 'Swap the brackets') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Qavslar ochilgandan keyin 3x + 6 − x + 4 chiqadi, endi o'xshash hadlarni qo'shish mumkin: 2x + 10.",
    'Верно. После раскрытия выходит 3x + 6 − x + 4, и только теперь можно складывать подобные: 2x + 10.',
    'Correct. Opening gives 3x + 6 − x + 4, and only now can like terms be collected: 2x + 10.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Hozircha o'xshash had yo'q: x lar qavs ichida turibdi. Avval qavsni ochish kerak.",
      'Подобных пока нет: иксы стоят внутри скобок. Сначала надо раскрыть скобки.',
      'There are no like terms yet: the x are inside brackets. Open them first.') },
    { when: (s) => s.picked === 2, text: L(
      "Qavslarning o'rnini almashtirish hech narsa bermaydi: ular ochilishi kerak.",
      'Перестановка скобок ничего не даёт: их надо раскрыть.',
      'Swapping the brackets changes nothing: they must be opened.') },
  ],
  wrongText: L(
    "x lar hozir qayerda turibdi? Ular bilan ishlash uchun nima qilish kerak?",
    'Где сейчас стоят иксы? Что нужно сделать, чтобы с ними работать?',
    'Where are the x right now? What must happen before working with them?'),
};

export default function D30_01(props) { return <Choice data={DATA} {...props} />; }
