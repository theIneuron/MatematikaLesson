// Dars30 · Amaliyot 03 — Yaxlitlash · 🟢 · tag: round_direction
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 3-pozitsiya)
//
// З61 SOF HOLDA: yaxlitlash yo'nalishini KEYINGI raqam hal qiladi. Bu
// yerda u olti, ya'ni yuqoriga.
//
// Uch xato variant uch xil yo'l:
//   2,23 — keyingi raqamga qaramasdan kesib tashlash (З61);
//   2,2  — o'ndan birgacha yaxlitlangan, ya'ni boshqa xonaga;
//   2,3  — o'ndan birgacha va yana yuqoriga.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'round_direction', level: '🟢',
  correct: 0, optCols: 4, optSize: 20,
  expr: ['2,236…'], exprSize: 30,
  eyebrow: L('Yaxlitlash', 'Округление', 'Rounding'),
  setup: L(
    "Bu son cheksiz davom etadi, shuning uchun u taqribiy qiymat bilan almashtiriladi. Yuzdan birgacha yaxlitlash kerak: verguldan keyin ikki raqam qoladi.",
    'Это число продолжается бесконечно, поэтому его заменяют приближённым значением. Округлить надо до сотых: после запятой останутся две цифры.',
    'This number goes on forever, so it is replaced by an approximation. It must be rounded to hundredths: two digits remain after the comma.'),
  ask: L(
    'Bu sonni yuzdan birgacha yaxlitlang.',
    'Округли это число до сотых.',
    'Round this number to hundredths.'),
  opts: [
    { label: ['2,24'] },
    { label: ['2,23'] },
    { label: ['2,2'] },
    { label: ['2,3'] },
  ],
  correctText: L(
    "To'g'ri. Yuzdan birgacha yaxlitlash verguldan keyin ikki raqam qoldiradi, keyingi raqam esa olti — beshdan katta, demak oxirgi raqam oshadi. Javob ikki butun yigirma to'rt.",
    'Верно. Округление до сотых оставляет после запятой две цифры, а следующая цифра шесть — больше пяти, значит последняя увеличивается. Ответ два целых двадцать четыре.',
    'Correct. Rounding to hundredths keeps two digits after the comma, and the next digit is six — greater than five, so the last digit rises. The answer is two point two four.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu yerda son shunchaki KESIB TASHLANGAN, yaxlitlanmagan. Yaxlitlashda keyingi raqamga qarash shart: u olti, ya'ni beshdan katta, demak oxirgi raqam oshadi. Farqni tekshiring: ikki butun yigirma uchdan asl songacha nol butun nol nol olti, ikki butun yigirma to'rtgacha esa nol butun nol nol to'rt — ikkinchisi YAQINROQ.",
      'Здесь число просто ОТБРОШЕНО, а не округлено. При округлении смотреть на следующую цифру обязательно: она шесть, то есть больше пяти, значит последняя цифра увеличивается. Проверь разницу: от двух целых двадцати трёх до исходного числа ноль целых ноль ноль шесть, а до двух целых двадцати четырёх ноль целых ноль ноль четыре — второе БЛИЖЕ.',
      'Here the number was simply CUT, not rounded. When rounding you must look at the next digit: it is six, greater than five, so the last digit rises. Check the difference: from two point two three to the original is zero point zero zero six, and to two point two four is zero point zero zero four — the second is CLOSER.') },
    { when: (s) => s.picked === 2 || s.picked === 3, text: L(
      "Bu javobda verguldan keyin BITTA raqam qolgan, ya'ni son o'ndan birgacha yaxlitlangan. Savol esa yuzdan birgacha so'ragan — verguldan keyin ikki raqam qolishi kerak. Xona qanchalik kichik bo'lsa, taqribiy qiymat shunchalik aniq bo'ladi: yuzdan bir o'ndan birdan o'n barobar mayda.",
      'В этом ответе после запятой осталась ОДНА цифра, то есть число округлено до десятых. А спрашивали до сотых — после запятой должно остаться две цифры. Чем мельче разряд, тем точнее приближение: сотая в десять раз мельче десятой.',
      'This answer keeps ONE digit after the comma, so the number was rounded to tenths. But hundredths were asked for — two digits must remain after the comma. The finer the place, the more accurate the approximation: a hundredth is ten times finer than a tenth.') },
  ],
  wrongText: L(
    "Avval qaysi xonagacha yaxlitlash kerakligini aniqlang, keyin KEYINGI raqamga qarang: u beshdan katta bo'lsa, oxirgi qoladigan raqam bir birlikka oshadi.",
    'Сначала определи, до какого разряда округлять, потом посмотри на СЛЕДУЮЩУЮ цифру: если она больше пяти, последняя оставляемая цифра увеличивается на единицу.',
    'First decide which place to round to, then look at the NEXT digit: if it is greater than five, the last kept digit rises by one.'),
};

export default function D30_03(props) { return <Choice data={DATA} {...props} />; }
