// Dars43 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: midline_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 3-pozitsiya)
//
// JAVOB: YO'Q, YO'Q (skelet §0a.1). Ikkala da'vo ham yolg'on va ular BITTA
// adashishning — З90 ning — ikki tomoni:
//   s1: yarim UMUMAN yo'q («o'rta chiziq tomonga teng»);
//   s2: yarim NOTO'G'RI tomonga qo'yilgan («tomon o'rta chiziqning yarmi»).
// To'g'ri munosabat ikkisining orasida: tomon o'rta chiziqning IKKI barobari.
// Razbor aniq son bilan yuradi: AC o'n bo'lsa, MN besh.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'midline_claims', level: '🟢',
  itemSize: 16,
  given: [['AM = MB'], ['BN = NC']],
  givenLabel: L("M va N — o'rtalar", 'M и N — середины', 'M and N are midpoints'),
  items: [
    { id: 's1', yes: false, tokens: ['MN = AC'],
      claim: L('har uchburchakda shunday', 'так в любом треугольнике', 'so in every triangle') },
    { id: 's2', yes: false, tokens: ['AC = ½ · MN'],
      claim: L('har uchburchakda shunday', 'так в любом треугольнике', 'so in every triangle') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "ABC uchburchagida M nuqta AB tomonining o'rtasi, N nuqta BC tomonining o'rtasi. Demak MN — o'rta chiziq, AC esa uchinchi tomon. Ikki da'vo ham shu ikki uzunlikni solishtiradi.",
    'В треугольнике ABC точка M — середина стороны AB, точка N — середина стороны BC. Значит MN средняя линия, а AC третья сторона. Оба утверждения сравнивают эти две длины.',
    'In the triangle ABC the point M is the midpoint of AB and N the midpoint of BC. So MN is the midline and AC the third side. Both claims compare those two lengths.'),
  ask: L(
    "Da'vo har uchburchakda bajarilsa «Ha», bajarilmasa «Yo'q».",
    'Если утверждение выполняется в любом треугольнике — «Да», если нет — «Нет».',
    'Tap «Yes» if the claim holds in every triangle, «No» if it does not.'),
  correctText: L(
    "To'g'ri, ikkalasi ham yolg'on. Aniq son bilan tekshiring: uchinchi tomon o'n bo'lsa, o'rta chiziq besh. Birinchi da'voda yarim umuman yo'q — u o'rta chiziqni tomonning o'ziga tenglashtiradi, ya'ni besh o'n ga teng bo'lib qoladi. Ikkinchi da'voda yarim BOR, lekin u noto'g'ri tomonga qo'yilgan: da'vo bo'yicha tomon o'n ikki yarim, ya'ni tomon besh emas, ikki yarim bo'lib chiqadi. To'g'ri munosabat ikkisining orasida: o'rta chiziq tomonning yarmi, tomon esa o'rta chiziqning IKKI barobari.",
    'Верно, оба ложны. Проверь на конкретных числах: если третья сторона десять, средняя линия пять. В первом утверждении половины нет вовсе — оно приравнивает среднюю линию к самой стороне, то есть пять становится равно десяти. Во втором половина ЕСТЬ, но приписана не туда: по утверждению сторона равна половине от пяти, то есть выходит не пять, а два с половиной. Верное соотношение между этими двумя: средняя линия — половина стороны, а сторона — ДВЕ средние линии.',
    'Correct, both are false. Check with concrete numbers: if the third side is ten, the midline is five. The first claim has no half at all — it makes the midline equal to the side itself, so five would equal ten. The second claim does have a half, but on the wrong side: by that claim the side would be half of five, that is two and a half instead of five. The true relation lies between the two: the midline is half the side, and the side is TWICE the midline.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'voda YARIM tushib qolgan. O'rta chiziq uchburchakning ichida yotadi va uchinchi tomondan qisqa: chizmaga qarasangiz ham bu ko'rinadi. Uchinchi tomon o'n bo'lsa, o'rta chiziq besh, ya'ni ular teng emas.",
      'В первом утверждении пропала ПОЛОВИНА. Средняя линия лежит внутри треугольника и короче третьей стороны: это видно и по чертежу. Если третья сторона десять, средняя линия пять, то есть они не равны.',
      'The first claim has lost the HALF. The midline lies inside the triangle and is shorter than the third side: the drawing shows it too. If the third side is ten, the midline is five, so they are not equal.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'voda yarim bor, lekin u NOTO'G'RI tomonda: kichik bo'lgan narsa o'rta chiziq, tomon emas. Ikkisining qaysi biri kichik ekanini chizmadan ko'rish mumkin. Tomonni topish uchun o'rta chiziqni IKKILANTIRISH kerak: besh karra ikki o'n.",
      'Во втором утверждении половина есть, но она НЕ НА ТОЙ стороне: меньше средняя линия, а не сторона. Какая из двух меньше, видно по чертежу. Чтобы найти сторону, среднюю линию надо УДВОИТЬ: пять на два — десять.',
      'The second claim has the half on the WRONG side: what is smaller is the midline, not the side. Which of the two is smaller can be seen from the drawing. To find the side the midline must be DOUBLED: five times two is ten.') },
  ],
  wrongText: L(
    "Uchinchi tomonni o'n deb oling va o'rta chiziqni hisoblang. Keyin har da'voni shu ikki son bilan tekshiring.",
    'Возьми третью сторону равной десяти и посчитай среднюю линию. Потом проверь каждое утверждение этими двумя числами.',
    'Take the third side as ten and compute the midline. Then test each claim with those two numbers.'),
};

export default function D43_03(props) { return <TrueFalse data={DATA} {...props} />; }
