// Dars37 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: parallelogram_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 1-pozitsiya)
//
// JAVOB: YO'Q, HA (skelet §0a.3). Ikki da'vo diagonallar haqida, va ular
// bir-biriga juda o'xshaydi:
//   «diagonallar teng»                    — YOLG'ON (З77)
//   «diagonallar teng ikkiga bo'linadi»   — ROST (T3)
// Farq bitta so'zda, ma'no esa butunlay boshqa: birinchisi IKKI diagonalni
// solishtiradi, ikkinchisi HAR diagonalning ichini aytadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'parallelogram_claims', level: '🟢',
  itemSize: 16,
  given: [['ABCD']],
  givenLabel: L('Parallelogramm', 'Параллелограмм', 'The parallelogram'),
  items: [
    { id: 's1', yes: false, tokens: ['AC = BD'],
      claim: L('har parallelogrammda shunday', 'так в любом параллелограмме', 'so in every parallelogram') },
    { id: 's2', yes: true, tokens: ['AO = OC,  BO = OD'],
      claim: L('har parallelogrammda shunday', 'так в любом параллелограмме', 'so in every parallelogram') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Parallelogrammning diagonallari AC va BD, ular O nuqtada kesishadi. Ikki da'vo ham diagonallar haqida, lekin ular boshqa narsani aytadi.",
    'Диагонали параллелограмма AC и BD пересекаются в точке O. Оба утверждения о диагоналях, но говорят они о разном.',
    'The diagonals of the parallelogram, AC and BD, meet at the point O. Both claims are about the diagonals, but they say different things.'),
  ask: L(
    "Da'vo har parallelogrammda bajarilsa «Ha», bajarilmasa «Yo'q».",
    'Если утверждение выполняется в любом параллелограмме — «Да», если нет — «Нет».',
    'If the claim holds in every parallelogram, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri. Birinchi da'vo IKKI diagonalni bir-biri bilan solishtiradi, va bu tenglik har parallelogrammda bajarilmaydi: cho'zilgan, qiya parallelogrammni tasavvur qiling — uning bir diagonali uzun, ikkinchisi qisqa bo'ladi. Diagonallar faqat to'g'ri to'rtburchakda teng bo'ladi, va bu 38-darsning mavzusi. Ikkinchi da'vo esa butunlay boshqa narsani aytadi: u ikki diagonalni solishtirmaydi, balki HAR diagonalning kesishish nuqtasi uni teng ikkiga bo'lishini aytadi. Ya'ni AC ning yarmi AO, BD ning yarmi BO — lekin AO va BO teng bo'lishi shart emas. Bu xossa esa har parallelogrammda bajariladi.",
    'Верно. Первое утверждение сравнивает ДВЕ диагонали друг с другом, и в любом параллелограмме это равенство не выполняется: представь вытянутый косой параллелограмм — одна его диагональ длинная, другая короткая. Диагонали равны только у прямоугольника, и это тема урока 38. Второе утверждение говорит совсем о другом: оно не сравнивает диагонали, а утверждает, что точка пересечения делит КАЖДУЮ диагональ пополам. То есть половина AC это AO, половина BD это BO — но AO и BO равными быть не обязаны. А это свойство выполняется в любом параллелограмме.',
    'Correct. The first claim compares the TWO diagonals with each other, and that equality does not hold in every parallelogram: picture a long, slanted parallelogram — one diagonal is long, the other short. The diagonals are equal only in a rectangle, which is the subject of lesson 38. The second claim says something quite different: it does not compare the diagonals, it states that the point of intersection halves EACH diagonal. Half of AC is AO, half of BD is BO — but AO and BO need not be equal. And that property does hold in every parallelogram.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala javob ham teskari. Ikki da'voni ajrating: birinchisida TENGLIK BELGISI ikki diagonal orasida turibdi, ikkinchisida esa har diagonalning ikki yarmi orasida. Birinchisi cho'zilgan parallelogrammda buziladi, ikkinchisi hech qachon buzilmaydi.",
      'Оба ответа перевёрнуты. Раздели два утверждения: в первом ЗНАК РАВЕНСТВА стоит между двумя диагоналями, во втором — между двумя половинами каждой диагонали. Первое ломается в вытянутом параллелограмме, второе не ломается никогда.',
      'Both answers are inverted. Separate the two claims: in the first the EQUALS SIGN stands between two diagonals, in the second between the two halves of each diagonal. The first breaks in a long parallelogram, the second never breaks.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo YOLG'ON: parallelogrammning diagonallari teng bo'lishi shart emas. Misol keltiring — juda qiya parallelogramm chizing: uning bir diagonali deyarli tomon uzunligicha cho'ziladi, ikkinchisi esa qisqaradi. Diagonallar teng bo'lishi qo'shimcha SHART, va u faqat to'g'ri to'rtburchakda bajariladi.",
      'Первое утверждение ЛОЖНО: диагонали параллелограмма равными быть не обязаны. Приведи пример — начерти сильно скошенный параллелограмм: одна его диагональ вытягивается почти во всю длину, а другая укорачивается. Равенство диагоналей — дополнительное УСЛОВИЕ, и выполняется оно только у прямоугольника.',
      'The first claim is FALSE: the diagonals of a parallelogram need not be equal. Give a counterexample — draw a strongly slanted parallelogram: one diagonal stretches almost to full length while the other shrinks. Equal diagonals is an extra CONDITION, and it holds only in a rectangle.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ROST, va u parallelogrammning uchinchi asosiy xossasi. Bu yerda diagonallar bir-biri bilan solishtirilmaydi: har diagonal O nuqta bilan teng ikki bo'lakka bo'linadi. AC o'n ikki, BD esa o'n bo'lishi mumkin — o'shanda AO olti, BO esa besh bo'ladi, va ikkala tenglik ham bajariladi.",
      'Второе утверждение ВЕРНО, и это третье основное свойство параллелограмма. Здесь диагонали друг с другом не сравниваются: каждая делится точкой O на две равные части. AC может быть двенадцать, а BD десять — тогда AO шесть, BO пять, и оба равенства выполняются.',
      'The second claim is TRUE, and it is the third basic property of the parallelogram. Here the diagonals are not compared with each other: each is split by the point O into two equal parts. AC may be twelve and BD ten — then AO is six and BO is five, and both equalities hold.') },
  ],
  wrongText: L(
    "Tenglik belgisining ikki tomoniga qarang: ikki diagonal solishtirilyaptimi yoki bitta diagonalning ikki yarmimi. Bu ikki boshqa da'vo.",
    'Смотри, что стоит по обе стороны знака равенства: сравниваются две диагонали или две половины одной диагонали. Это два разных утверждения.',
    'Look at what stands on either side of the equals sign: two diagonals being compared, or the two halves of one diagonal. These are two different claims.'),
};

export default function D37_01(props) { return <TrueFalse data={DATA} {...props} />; }
