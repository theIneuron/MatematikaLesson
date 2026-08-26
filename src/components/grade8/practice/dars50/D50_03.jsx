// Dars50 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: tangent_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 3-pozitsiya)
//
// JAVOB: YO'Q, YO'Q (skelet §0a.1). Ikkala da'vo ham yolg'on va ular BITTA
// chegarani — З107 ni — ikki yoqdan buzadi:
//   s1: d = R da ikki umumiy nuqta bor   -> YO'Q (bu d < R ning holati)
//   s2: d = R da umumiy nuqta yo'q       -> YO'Q (bu d > R ning holati)
// To'g'ri javob ikkisining ORASIDA: aynan bitta nuqta.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'tangent_claims', level: '🟢',
  itemSize: 16,
  given: [['d = R = 6']],
  givenLabel: L('Masofa va radius', 'Расстояние и радиус', 'The distance and the radius'),
  items: [
    { id: 's1', yes: false, tokens: ['n = 2'],
      claim: L('umumiy nuqtalar soni shunday', 'таково число общих точек', 'such is the number of common points') },
    { id: 's2', yes: false, tokens: ['n = 0'],
      claim: L('umumiy nuqtalar soni shunday', 'таково число общих точек', 'such is the number of common points') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Aylananing radiusi olti, markazdan to'g'ri chiziqqacha masofa ham olti — ya'ni ular teng. Ikki da'vo umumiy nuqtalarning soni haqida: n harfi shu sonni bildiradi.",
    'Радиус окружности шесть, расстояние от центра до прямой тоже шесть — то есть они равны. Два утверждения о числе общих точек: буква n обозначает это число.',
    'The radius of a circle is six and the distance from the centre to a line is six as well — they are equal. Two claims about the number of common points: the letter n stands for that number.'),
  ask: L(
    "Da'vo to'g'ri bo'lsa «Ha» ni, xato bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ошибочно — «Нет».',
    'Tap «Yes» if the claim is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri, ikkalasi ham yolg'on, va ular bitta chegarani ikki yoqdan buzadi. Ikki umumiy nuqta masofa radiusdan KICHIK bo'lganda bo'ladi: chiziq aylananing ichiga kiradi. Umumiy nuqta yo'q bo'lishi esa masofa radiusdan KATTA bo'lganda: chiziq aylanaga yetib bormaydi. Masofa aynan radiusga teng bo'lgan holat ikkisining ORASIDA turadi, va u yerda umumiy nuqta bitta — chiziq aylanaga tegadi. Chizmada tasavvur qiling: chiziqni sekin aylanaga yaqinlashtirsangiz, u avval tegadi (bitta nuqta), keyingina kesib o'tadi (ikki nuqta). Tegish — o'sha bir lahzalik chegara.",
    'Верно, оба ложны, и они ломают одну границу с двух сторон. Две общие точки бывают, когда расстояние МЕНЬШЕ радиуса: прямая заходит внутрь окружности. А общих точек нет, когда расстояние БОЛЬШЕ радиуса: прямая до окружности не доходит. Случай, когда расстояние в точности равно радиусу, стоит МЕЖДУ ними, и там общая точка одна — прямая касается окружности. Представь на чертеже: если медленно приближать прямую к окружности, она сначала коснётся (одна точка), и только потом пересечёт (две). Касание — та самая мгновенная граница.',
    'Correct, both are false, and they break one boundary from both sides. Two common points occur when the distance is LESS than the radius: the line enters the circle. No common point occurs when the distance is GREATER: the line never reaches the circle. The case where the distance equals the radius stands BETWEEN them, and there the common point is one — the line touches the circle. Picture it: slide a line slowly towards a circle and it first touches (one point) and only then crosses (two). Touching is that momentary boundary.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Ikki umumiy nuqta masofa radiusdan KICHIK bo'lganda paydo bo'ladi. Bu yerda masofa aynan radiusga teng, ya'ni chiziq aylananing ichiga kirmaydi — u faqat tegadi. Vatarning uzunligini hisoblab ko'ring: ikki karra ildiz ostida o'ttiz olti minus o'ttiz olti, ya'ni nol — vatar yo'q, faqat bitta nuqta bor.",
      'Две общие точки появляются, когда расстояние МЕНЬШЕ радиуса. Здесь расстояние в точности равно радиусу, значит прямая внутрь окружности не заходит — она лишь касается. Посчитай длину хорды: дважды корень из тридцати шести минус тридцати шести, то есть нуль — хорды нет, есть одна точка.',
      'Two common points appear when the distance is LESS than the radius. Here the distance equals the radius exactly, so the line does not enter the circle — it only touches. Compute the chord: twice the root of thirty six minus thirty six, that is zero — there is no chord, only one point.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Umumiy nuqta YO'Q bo'lishi masofa radiusdan KATTA bo'lganda bo'ladi. Bu yerda esa masofa radiusga teng, ya'ni chiziq aylanaga aynan yetib boradi: uzoqroq ham emas, yaqinroq ham emas. Shunday holatda chiziq aylanaga tegadi, va umumiy nuqta bitta bo'ladi.",
      'Общих точек НЕТ, когда расстояние БОЛЬШЕ радиуса. А здесь расстояние равно радиусу, значит прямая доходит до окружности в точности: не дальше и не ближе. В таком случае прямая касается окружности, и общая точка одна.',
      'There is NO common point when the distance is GREATER than the radius. Here the distance equals the radius, so the line reaches the circle exactly: neither farther nor nearer. In that case the line touches the circle and there is one common point.') },
  ],
  wrongText: L(
    "Uch holatni yozib chiqing: masofa radiusdan katta, teng, kichik. Tenglik chegara, va u bitta nuqtani beradi.",
    'Выпиши три случая: расстояние больше радиуса, равно, меньше. Равенство — граница, и она даёт одну точку.',
    'Write out the three cases: distance greater than the radius, equal, less. Equality is the boundary and gives one point.'),
};

export default function D50_03(props) { return <TrueFalse data={DATA} {...props} />; }
