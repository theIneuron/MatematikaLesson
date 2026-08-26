// Dars32 · Amaliyot 07 — Ha yoki yo'q · 🟡 · tag: property_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 7-pozitsiya)
//
// JAVOB: YO'Q, HA (skelet §0a.3). Ikki yozuvda AYNAN o'sha uch belgi —
// uch, to'rt va o'n ikki, — farq esa faqat QAVSDA. Birinchisida qavs yo'q,
// ya'ni ko'rsatkichlar qo'shiladi va yetti chiqadi; ikkinchisida qavs bor,
// ya'ni ko'paytiriladi va o'n ikki chiqadi.
//
// Ya'ni o'n ikki soni ikkala yozuvda ham «tanish» ko'rinadi, lekin u faqat
// bittasiga to'g'ri keladi. З64 va З65 shu juftlikda birga tutiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'property_claims', level: '🟡',
  itemSize: 17,
  items: [
    { id: 's1', yes: false, tokens: ['a³ · a⁴ = a¹²'],
      claim: L('bu tenglik rost', 'это равенство верно', 'this equality is true') },
    { id: 's2', yes: true, tokens: ['(a³)⁴ = a¹²'],
      claim: L('bu tenglik rost', 'это равенство верно', 'this equality is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglikda aynan o'sha uch son turibdi: uch, to'rt va o'n ikki. Farq faqat bitta belgida — qavsda.",
    'В двух равенствах стоят одни и те же три числа: три, четыре и двенадцать. Различие в одном знаке — в скобке.',
    'The two equalities hold the very same three numbers: three, four and twelve. They differ by one mark — the bracket.'),
  ask: L(
    "Tenglik rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если равенство верно — «Да», если ложно — «Нет».',
    'If the equality is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchi yozuvda qavs yo'q: ikki daraja shunchaki ko'paytirilyapti, ya'ni ko'rsatkichlar QO'SHILADI — uch qo'shuv to'rt yetti, o'n ikki emas. Ikkinchi yozuvda qavs bor: a kubi to'rt marta ko'paytirilyapti, ya'ni ko'rsatkichlar KO'PAYTIRILADI — uch karra to'rt o'n ikki. a ikkiga teng bo'lsa tekshirish ochiq ko'rinadi: sakkiz karra o'n olti yuz yigirma sakkiz, ya'ni ikkining yettinchi darajasi; sakkizning to'rtinchi darajasi esa to'rt ming to'qson olti, ya'ni ikkining o'n ikkinchi darajasi. O'n ikki soni ikkala yozuvda ham tanish ko'rinadi, lekin u faqat qavsli yozuvga tegishli.",
    'Верно. В первой записи скобки нет: две степени просто перемножаются, значит показатели СКЛАДЫВАЮТСЯ — три плюс четыре семь, а не двенадцать. Во второй записи скобка есть: a в кубе берётся четыре раза, значит показатели ПЕРЕМНОЖАЮТСЯ — трижды четыре двенадцать. При a равном двум проверка видна открыто: восемь на шестнадцать сто двадцать восемь, то есть два в седьмой; а восемь в четвёртой четыре тысячи девяносто шесть, то есть два в двенадцатой. Число двенадцать выглядит знакомым в обеих записях, но относится только к записи со скобкой.',
    'Correct. The first record has no bracket: two powers are simply multiplied, so the exponents ADD — three plus four is seven, not twelve. The second record has a bracket: a cubed is taken four times, so the exponents MULTIPLY — three times four is twelve. At a equal to two the check is plain: eight times sixteen is one hundred twenty-eight, that is two to the seventh; and eight to the fourth is four thousand ninety-six, that is two to the twelfth. Twelve looks familiar in both records, yet it belongs only to the bracketed one.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala javob ham teskari. Ikki yozuvni yonma-yon qo'ying va faqat QAVSGA qarang: birinchisida u yo'q, ikkinchisida bor. Qavs yo'q bo'lsa ko'rsatkichlar qo'shiladi (yetti), qavs bor bo'lsa ko'paytiriladi (o'n ikki). Sonlar bir xil, qoida esa boshqa.",
      'Оба ответа перевёрнуты. Поставь записи рядом и смотри только на СКОБКУ: в первой её нет, во второй есть. Без скобки показатели складываются (семь), со скобкой перемножаются (двенадцать). Числа одинаковы, а правило разное.',
      'Both answers are inverted. Put the records side by side and look only at the BRACKET: the first has none, the second has one. Without a bracket the exponents add (seven), with one they multiply (twelve). The numbers are the same, the rule is not.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglik YOLG'ON. Qavs yo'q, ya'ni bu oddiy ko'paytirish va ko'rsatkichlar qo'shiladi: uch qo'shuv to'rt yetti. Ochib yozing — uchta a va to'rtta a, jami yettita ko'paytuvchi, o'n ikkita emas. Son bilan tekshiring: a ikkiga teng bo'lsa, sakkiz karra o'n olti yuz yigirma sakkiz, to'rt ming to'qson olti emas.",
      'Первое равенство ЛОЖНО. Скобки нет, значит это обычное умножение и показатели складываются: три плюс четыре семь. Распиши — три множителя a и четыре множителя a, всего семь, а не двенадцать. Проверь числом: при a равном двум восемь на шестнадцать сто двадцать восемь, а не четыре тысячи девяносто шесть.',
      'The first equality is FALSE. There is no bracket, so this is plain multiplication and the exponents add: three plus four is seven. Unfold it — three factors of a and four factors of a, seven in all, not twelve. Check with a number: at a equal to two, eight times sixteen is one hundred twenty-eight, not four thousand ninety-six.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglik ROST. Qavs bor, ya'ni a kubi to'rt marta ko'paytirilyapti: uchta a to'rt marta — jami o'n ikkita ko'paytuvchi. Ko'rsatkichlar ko'paytiriladi: uch karra to'rt o'n ikki. Qo'shsangiz yetti chiqardi, lekin yetti qavssiz yozuvning javobi.",
      'Второе равенство ВЕРНО. Скобка есть, значит a в кубе берётся четыре раза: три множителя a четырежды — всего двенадцать. Показатели перемножаются: трижды четыре двенадцать. При сложении вышло бы семь, но семь — ответ записи без скобки.',
      'The second equality is TRUE. There is a bracket, so a cubed is taken four times: three factors of a, four times over — twelve in all. The exponents multiply: three times four is twelve. Adding would give seven, but seven is the answer to the record without a bracket.') },
  ],
  wrongText: L(
    "Faqat qavsga qarang: qavs yo'q — ko'rsatkichlar qo'shiladi, qavs bor — ko'paytiriladi. Javobni a = 2 da tekshiring.",
    'Смотри только на скобку: скобки нет — показатели складываются, скобка есть — перемножаются. Проверь ответ при a = 2.',
    'Look only at the bracket: no bracket means the exponents add, a bracket means they multiply. Check the answer at a = 2.'),
};

export default function D32_07(props) { return <TrueFalse data={DATA} {...props} />; }
