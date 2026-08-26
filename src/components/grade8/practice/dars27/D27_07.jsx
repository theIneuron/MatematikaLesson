// Dars27 · Amaliyot 07 — Yozuv · 🟡 · tag: inequality_to_interval
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 7-pozitsiya)
//
// SOF З56: har belgi O'Z qavsini talab qiladi. Yozuvda chap belgi chiziqli
// (chegara kiradi -> kvadrat qavs), o'ng belgi qat'iy (chegara chiqadi ->
// dumaloq qavs). Ya'ni javob YARIM-INTERVAL.
//
// Uch xato variant: ikkala qavs almashgan; ikkalasi kvadrat; ikkalasi
// dumaloq. Har biri bitta yoki ikkita belgini noto'g'ri o'qishdan chiqadi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'inequality_to_interval', level: '🟡',
  correct: 0, optCols: 4, optSize: 18,
  expr: ['−1 ≤ x < 6'], exprSize: 30,
  eyebrow: L('Yozuv', 'Запись', 'Notation'),
  setup: L(
    "Qo'sh tengsizlikni oraliq bilan yozish kerak. Har chegara o'z belgisiga ega, va har belgi o'z qavsini talab qiladi.",
    'Двойное неравенство надо записать промежутком. У каждой границы свой знак, и каждый знак требует своей скобки.',
    'The double inequality must be written as a range. Each boundary has its own sign, and each sign demands its own bracket.'),
  ask: L(
    'Bu tengsizlik qaysi oraliqqa mos keladi?',
    'Какому промежутку соответствует это неравенство?',
    'Which range does this inequality correspond to?'),
  opts: [
    { label: ['[−1; 6)'] },
    { label: ['(−1; 6]'] },
    { label: ['[−1; 6]'] },
    { label: ['(−1; 6)'] },
  ],
  correctText: L(
    "To'g'ri. Chap belgi chiziqli — kvadrat qavs; o'ng belgi qat'iy — dumaloq qavs. Natijada yarim-interval chiqadi. Tekshirish: minus bir kiradi, olti esa kirmaydi.",
    'Верно. Левый знак с чертой — квадратная скобка; правый строгий — круглая. В итоге выходит полуинтервал. Проверка: минус один входит, а шесть нет.',
    'Correct. The left sign carries a line — a square bracket; the right is strict — a round one. The result is a half-interval. Check: minus one is in, six is out.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikkala qavs ALMASHGAN. Chap belgiga qarang — uning ostida chiziq bor, ya'ni minus bir KIRADI va u yerda kvadrat qavs turishi kerak. O'ng belgi esa chiziqsiz, ya'ni olti kirmaydi va u yerda dumaloq qavs. Qavslarni belgilar bilan bir-biriga moslashtiring: har qavs O'Z tomonidagi belgiga javob beradi.",
      'Обе скобки ПОМЕНЯНЫ местами. Посмотри на левый знак — под ним черта, значит минус один ВХОДИТ, и там должна стоять квадратная скобка. А правый знак без черты, значит шесть не входит, и там круглая. Сопоставляй скобки со знаками: каждая скобка отвечает за знак СВОЕЙ стороны.',
      'The two brackets are SWAPPED. Look at the left sign — it carries a line, so minus one is IN and a square bracket belongs there. The right sign has no line, so six is out and a round bracket belongs there. Match brackets to signs: each bracket answers for the sign on ITS OWN side.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu KESMA, ya'ni ikkala chegara ham kirgan to'plam. Lekin o'ng belgi chiziqsiz: x oltidan QAT'IY kichik. Oltini qo'yib tekshiring — olti oltidan kichik emas, u unga teng. Demak o'ng qavs dumaloq bo'lishi kerak.",
      'Это ОТРЕЗОК, то есть множество, куда входят обе границы. Но правый знак без черты: x СТРОГО меньше шести. Подставь шесть и проверь — шесть не меньше шести, оно ему равно. Значит правая скобка должна быть круглой.',
      'This is a SEGMENT, a set with both boundaries included. But the right sign has no line: x is STRICTLY less than six. Substitute six and check — six is not less than six, it equals it. So the right bracket must be round.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu INTERVAL, ya'ni ikkala chegara ham chiqarib tashlangan to'plam. Lekin chap belgining ostida chiziq bor: minus bir x dan kichik yoki TENG. Minus birni qo'ying — u shartni bajaradi, ya'ni to'plamga kiradi. Demak chap qavs kvadrat bo'lishi kerak.",
      'Это ИНТЕРВАЛ, то есть множество, где исключены обе границы. Но под левым знаком есть черта: минус один меньше или РАВЕН x. Подставь минус один — он условию удовлетворяет, значит в множество входит. Значит левая скобка должна быть квадратной.',
      'This is an INTERVAL, a set with both boundaries excluded. But the left sign carries a line: minus one is less than or EQUAL to x. Substitute minus one — it satisfies the condition, so it belongs to the set. Hence the left bracket must be square.') },
  ],
  wrongText: L(
    "Har belgiga alohida qarang va unga o'z qavsini tanlang: chiziqli belgi — kvadrat qavs, qat'iy belgi — dumaloq qavs. Chegaralarning o'zini qo'yib tekshiring.",
    'Смотри на каждый знак отдельно и подбирай ему свою скобку: знак с чертой — квадратная, строгий — круглая. Проверь подстановкой сами границы.',
    'Look at each sign separately and pick its own bracket: a sign with a line takes a square bracket, a strict sign a round one. Check by substituting the boundaries themselves.'),
};

export default function D27_07(props) { return <Choice data={DATA} {...props} />; }
