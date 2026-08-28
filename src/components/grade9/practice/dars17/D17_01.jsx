// Dars17 · Amaliyot 01 — Jadval · 🟢 · teg: nollarni-toliq-belgilamaslik
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval kasrning IKKI xil maxsus nuqtasini sonlarda ko'rsatadi: minus
// uchda kasr nolga aylanadi (surat noli), birda esa umuman qiymat yo'q
// (maxraj noli) — shuning uchun birinchi ustunda nol turadi, birda esa
// jadvalda ustun ham yo'q.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'nollarni-toliq-belgilamaslik', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Kasrning surati va maxraji bor. Jadvalda birga teng iks yo'q: u yerda kasrning qiymati yo'q.",
    'У дроби есть числитель и знаменатель. В таблице нет икса, равного единице: там у дроби нет значения.',
    'The fraction has a numerator and a denominator. There is no x equal to one in the table: the fraction has no value there.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = (x + 3)/(x − 1)'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−3', y: '0' },
    { id: 'c2', x: '0', y: '−3' },
    { id: 'c3', x: '', y: '3', ans: 3, hole: 'x' },
    { id: 'c4', x: '5', y: '', ans: 2, hole: 'y' },
  ],
  correctText: L(
    "To'g'ri: igrek uchga teng bo'lganda iks ham uchga teng — olti bo'lingan ikki uch beradi; beshda esa sakkiz bo'lingan to'rt, ya'ni ikki. Endi jadvalning ikki muhim joyi: minus uchda kasr NOLGA teng, chunki surat nolga aylanadi; birda esa qiymat umuman yo'q, chunki maxraj nolga aylanadi. Ikkala nuqta ham keyin o'qda belgilanadi, lekin ikki xil qoida bilan.",
    'Верно: при игреке, равном трём, икс тоже равен трём — шесть делить на два даёт три; а при пяти восемь делить на четыре, то есть два. Теперь два важных места таблицы: при минус трёх дробь равна НУЛЮ, ведь числитель обращается в нуль; а при единице значения нет вовсе, ведь в нуль обращается знаменатель. Обе точки потом отмечают на оси, но по двум разным правилам.',
    'Correct: at y equal to three, x is three too — six over two gives three; and at five, eight over four, that is two. Now the two important places in the table: at minus three the fraction equals ZERO, since the numerator becomes zero; and at one there is no value at all, since the denominator becomes zero. Both points get marked on the axis later, but by two different rules.'),
  wrongs: [
    { when: (s) => s.vals.c3 === 1, text: L(
      "Birda kasrning qiymati umuman yo'q: maxraj nolga aylanadi, nolga bo'lish esa mumkin emas. Igrek uchga teng bo'ladigan iksni qidiring: surat maxrajdan uch marta katta bo'lishi kerak.",
      'При единице у дроби нет значения вовсе: знаменатель обращается в нуль, а на нуль делить нельзя. Ищи икс, при котором игрек равен трём: числитель должен быть в три раза больше знаменателя.',
      'At one the fraction has no value at all: the denominator becomes zero, and division by zero is impossible. Look for the x that makes y three: the numerator must be three times the denominator.') },
    { when: (s) => s.vals.c3 === 0 || s.vals.c3 === -3, text: L(
      "Bu ustunlar jadvalda allaqachon bor. Uchinchi ustunda igrek uchga teng: surat maxrajdan uch marta katta bo'ladigan iksni toping.",
      'Эти столбцы в таблице уже есть. В третьем столбце игрек равен трём: найди икс, при котором числитель в три раза больше знаменателя.',
      'Those columns are already in the table. In the third column y is three: find the x where the numerator is three times the denominator.') },
    { when: (s) => s.vals.c4 === 8, text: L(
      "Faqat surat hisoblangan: besh qo'shuv uch sakkiz. Lekin bu kasr, uni maxrajga bo'lish kerak: sakkiz bo'lingan to'rt.",
      'Посчитан только числитель: пять плюс три — восемь. Но это дробь, её надо разделить на знаменатель: восемь делить на четыре.',
      'Only the numerator was computed: five plus three is eight. But this is a fraction, and it must be divided by the denominator: eight over four.') },
    { when: (s) => s.vals.c4 === 4, text: L(
      "Faqat maxraj hisoblangan: besh minus bir to'rt. Kasrning qiymati esa surat bo'lingan maxraj: sakkiz bo'lingan to'rt, ya'ni ikki.",
      'Посчитан только знаменатель: пять минус один — четыре. А значение дроби это числитель делить на знаменатель: восемь делить на четыре, то есть два.',
      'Only the denominator was computed: five minus one is four. The value of a fraction is the numerator over the denominator: eight over four, that is two.') },
  ],
  wrongText: L(
    "Har katakda ikkita amalni alohida qiling: avval suratni, keyin maxrajni hisoblang, so'ng birinchisini ikkinchisiga bo'ling.",
    'В каждой клетке делай два действия по отдельности: сначала посчитай числитель, потом знаменатель, и раздели первое на второе.',
    'In each cell do two things separately: compute the numerator, then the denominator, then divide the first by the second.'),
};

export default function D17_01(props) { return <RowTable data={DATA} {...props} />; }
