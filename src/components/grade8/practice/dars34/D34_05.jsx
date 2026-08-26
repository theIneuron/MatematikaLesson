// Dars34 · Amaliyot 05 — Juftlash · 🟡 · tag: frequency_to_relative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 5-pozitsiya)
//
// TANLANMA HAJMI YIGIRMA, ya'ni bo'linadigan son har juftlikda BIR XIL.
// Shu sababli chastota va ulush o'rtasidagi bog'liqlik chiziqli bo'lib
// ko'rinadi: chastota bir birlikka ortsa, ulush nol butun nol besh yuzdan
// ga ortadi. `4 ↔ 0,2` va `5 ↔ 0,25` yonma-yon turgani ataylab.
//
// `MatchPairs` `given` ni chizmaydi (`kit.jsx`), shuning uchun hajm
// shartning MATNIDA turadi — u uch tilda ham chiqadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'frequency_to_relative', level: '🟡',
  connect: true,
  targetSize: 19, itemSize: 19,
  items: [
    { id: 'm1', tokens: ['5'] },
    { id: 'm2', tokens: ['4'] },
    { id: 'm3', tokens: ['10'] },
    { id: 'm4', tokens: ['1'] },
  ],
  targets: [
    { id: 't1', tokens: ['0,25'] },
    { id: 't2', tokens: ['0,2'] },
    { id: 't3', tokens: ['0,5'] },
    { id: 't4', tokens: ['0,05'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "Tanlanmada yigirmata natija bor. Chapda to'rt variantning chastotasi, o'ngda esa ularning nisbiy chastotasi. Bo'linadigan son to'rt joyda ham bir xil — yigirma.",
    'В выборке двадцать результатов. Слева частоты четырёх вариантов, справа их относительные частоты. Делитель во всех четырёх один и тот же — двадцать.',
    'The sample holds twenty results. On the left, the frequencies of four variants; on the right, their relative frequencies. The divisor is the same in all four — twenty.'),
  ask: L(
    "Chapdan chastotani bosing, keyin o'ngdan uning ulushini bosing.",
    'Нажми частоту слева, потом её долю справа.',
    'Tap a frequency on the left, then its share on the right.'),
  correctText: L(
    "To'g'ri. Har ulush chastotani yigirmaga bo'lishdan chiqadi: besh bo'lingan yigirma nol butun yigirma besh yuzdan; to'rt bo'lingan yigirma nol butun ikki o'ndan; o'n bo'lingan yigirma nol butun besh o'ndan; bir bo'lingan yigirma nol butun nol besh yuzdan. Bo'linadigan son o'zgarmagani uchun tartib ham saqlanadi: chastota qanchalik katta bo'lsa, ulush ham shunchalik katta. Va yana bir narsa ko'rinadi: chastota bir birlikka ortganda ulush nol butun nol besh yuzdan ga ortadi — to'rt va besh juftliklarini solishtiring. Tanlanmaning YARMI o'n natija, va uning ulushi nol butun besh o'ndan.",
    'Верно. Каждая доля получается делением частоты на двадцать: пять делить на двадцать нуль целых двадцать пять сотых; четыре делить на двадцать нуль целых две десятых; десять делить на двадцать нуль целых пять десятых; один делить на двадцать нуль целых пять сотых. Делитель не меняется, поэтому сохраняется и порядок: чем больше частота, тем больше доля. Видно и другое: при росте частоты на единицу доля растёт на нуль целых пять сотых — сравни пары четыре и пять. ПОЛОВИНА выборки это десять результатов, и её доля нуль целых пять десятых.',
    'Correct. Each share comes from dividing the frequency by twenty: five divided by twenty is zero point two five; four divided by twenty is zero point two; ten divided by twenty is zero point five; one divided by twenty is zero point zero five. The divisor does not change, so the order is preserved: the larger the frequency, the larger the share. Something else shows too: a rise of one in the frequency raises the share by zero point zero five — compare the pairs four and five. HALF the sample is ten results, and its share is zero point five.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Chastotalar bir birlikka farq qiladi — to'rt va besh, — ya'ni ulushlar ham bir qadamga farq qiladi. Bir qadam nol butun nol besh yuzdan ga teng, chunki bir bo'lingan yigirma shunga teng. To'rt uchun nol butun ikki o'ndan, besh uchun nol butun yigirma besh yuzdan: kattaroq chastotaga kattaroq ulush.",
      'Эти две пары поменялись местами. Частоты отличаются на единицу — четыре и пять, — значит и доли отличаются на один шаг. Шаг равен нулю целых пяти сотым, ведь один делить на двадцать даёт именно это. Для четырёх нуль целых две десятых, для пяти нуль целых двадцать пять сотых: большей частоте большая доля.',
      'These two pairs were swapped. The frequencies differ by one — four and five — so the shares differ by one step. A step is zero point zero five, since one divided by twenty is exactly that. For four the share is zero point two, for five zero point two five: the larger frequency takes the larger share.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "O'n — tanlanmaning YARMI, chunki hajm yigirma. Yarmining ulushi nol butun besh o'ndan, ya'ni yarim. Buni bo'lmasdan ham aytish mumkin: agar variant natijalarning yarmida uchrasa, uning ulushi ham yarim bo'ladi. Bu eng oson tekshiruv nuqtasi.",
      'Десять — это ПОЛОВИНА выборки, ведь объём двадцать. Доля половины равна нулю целых пяти десятым, то есть половине. Это можно сказать и без деления: если вариант встретился в половине наблюдений, его доля тоже половина. Самая простая точка проверки.',
      'Ten is HALF the sample, since the size is twenty. The share of a half is zero point five, that is, a half. This can be said without dividing: if a variant occurs in half the observations, its share is half as well. The easiest checkpoint.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Chastota bir — eng kichigi, ya'ni ulush ham eng kichik bo'lishi kerak: bir bo'lingan yigirma nol butun nol besh yuzdan. Bu son nol butun besh o'ndan bilan chalkashtiriladi, chunki ikkalasida ham besh eshitiladi. Ular esa o'n baravar farq qiladi: nol butun nol besh yuzdan — bu yuzdan besh, nol butun besh o'ndan — bu yarim.",
      'Частота один — наименьшая, значит и доля должна быть наименьшей: один делить на двадцать нуль целых пять сотых. Это число путают с нулём целых пятью десятыми, ведь в обоих слышится «пять». А отличаются они в десять раз: нуль целых пять сотых — это пять сотых, а нуль целых пять десятых — половина.',
      'A frequency of one is the smallest, so the share must be smallest too: one divided by twenty is zero point zero five. This number gets confused with zero point five, since «five» sounds in both. Yet they differ tenfold: zero point zero five is five hundredths, zero point five is a half.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har chastotani yigirmaga bo'ling, taxmin qilmang. Tekshirish uchun tartibga qarang: eng katta chastotaga eng katta ulush to'g'ri keladi, chunki bo'linadigan son to'rt joyda ham bir xil.",
      'Дели каждую частоту на двадцать, не угадывай. Для проверки смотри на порядок: наибольшей частоте отвечает наибольшая доля, ведь делитель во всех четырёх один.',
      'Divide each frequency by twenty, do not guess. To check, look at the order: the largest frequency takes the largest share, since the divisor is the same in all four.') },
  ],
  wrongText: L(
    "Har chastotani tanlanma hajmiga — yigirmaga — bo'ling. Tartib saqlanadi: katta chastota katta ulushni beradi.",
    'Дели каждую частоту на объём выборки — на двадцать. Порядок сохраняется: большая частота даёт большую долю.',
    'Divide each frequency by the sample size — twenty. The order is preserved: a larger frequency gives a larger share.'),
};

export default function D34_05(props) { return <MatchPairs data={DATA} {...props} />; }
