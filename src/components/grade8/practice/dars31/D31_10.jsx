// Dars31 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 10-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCHALA TASDIG'I. Bankdagi tuzoqlar:
//   «nolga»            — З62, nolinchi daraja nol deb o'qish;
//   «qarama-qarshi soni» — З63 ning so'z bilan aytilgani: teskari son emas,
//                        ishorasi almashgan son;
//   «birga teng»       — T3 ning o'rniga: nol asosda ham javob bor deb
//                        o'ylash.
// `ClozeBank` ning kartalari `L()` oladi — bu yagona mexanika bo'lib,
// unda SO'Z uch tilda ham to'g'ri chiqadi (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "a noldan farqli bo'lsa, a⁰",
      'Если a отлично от нуля, то a⁰ равно',
      'If a is not zero, then a⁰ equals') },
    { slot: 0 },
    { text: L(
      "teng, a⁻ⁿ esa aⁿ ning",
      ', а a⁻ⁿ это',
      ', and a⁻ⁿ is the') },
    { slot: 1 },
    // Uch tilda gap BOSHQACHA yig'iladi, shuning uchun uyalar orasidagi
    // matn ham boshqacha: o'zbekchada «...ning teskari soniGA teng», ruschada
    // «...это обратное число ОТ aⁿ». Uyalarning tartibi esa uch tilda bir xil.
    { text: L(
      "ga teng. a nolga teng bo'lsa, bu darajalar",
      'от aⁿ. Если же a равно нулю, эти степени',
      'of aⁿ. But if a equals zero, these powers are') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('birga', 'единице', 'one') },
    { id: 'w2', label: L('teskari soni', 'обратное число', 'reciprocal') },
    { id: 'w3', label: L('aniqlanmagan', 'не определены', 'undefined') },
    { id: 'w4', label: L('nolga', 'нулю', 'zero') },
    { id: 'w5', label: L('qarama-qarshi soni', 'противоположное число', 'opposite') },
    { id: 'w6', label: L('birga teng', 'равны единице', 'equal to one') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uchala qoidasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Все три правила урока собраны в одно предложение, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'All three rules of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the language but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Nolinchi daraja birga teng, va buni bo'lish beradi: bir xil darajani o'ziga bo'lsangiz bir chiqadi, ko'rsatkichlar esa ayirilib nol qoladi. Manfiy ko'rsatkichli daraja esa TESKARI sonni beradi — sonni ag'daradi, ishorasini emas: ikkining minus uchinchi darajasi bir sakkizdan, minus sakkiz emas. Va uchinchisi: asos nolga teng bo'lsa, ikkala qoida ham ishlamaydi, chunki ikkalasi ham nolga bo'lishga olib boradi. Shuning uchun qoidaning shartida «a noldan farqli» degan gap turadi, va u bezak emas.",
    'Верно. Нулевая степень равна единице, и это даёт деление: одинаковая степень, делённая сама на себя, даёт единицу, а показатели вычитаются в нуль. Степень с отрицательным показателем даёт ОБРАТНОЕ число — она переворачивает число, а не его знак: два в минус третьей это одна восьмая, а не минус восемь. И третье: если основание равно нулю, оба правила не работают, потому что оба приводят к делению на нуль. Поэтому в условии правила стоит «a отлично от нуля», и это не украшение.',
    'Correct. The zero power equals one, and division gives that: a power divided by itself gives one while the exponents subtract to zero. A power with a negative exponent gives the RECIPROCAL — it turns the number over, not its sign: two to the minus three is one eighth, not minus eight. And the third: if the base equals zero, neither rule works, because both lead to division by zero. That is why the condition of the rule says «a is not zero», and it is not decoration.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Nolga» — darsning eng qimmat xatosi. Ko'rsatkichdagi nol natijaning noli emas: u ko'paytuvchilar SONI. Bo'lish bilan tekshiring — yettining kubini yettining kubiga bo'lsangiz bir chiqadi, ko'rsatkichlar esa nol beradi. Ikki yo'l bitta javob berishi kerak, va u javob bir.",
      '«Нулю» — самая дорогая ошибка урока. Нуль в показателе не есть нуль результата: это КОЛИЧЕСТВО множителей. Проверь делением — семь в кубе делить на семь в кубе даёт единицу, а показатели дают нуль. Два пути обязаны дать один ответ, и этот ответ единица.',
      '«Zero» is the costliest error of the lesson. A zero in the exponent is not a zero in the result: it is the COUNT of factors. Check by division — seven cubed divided by seven cubed gives one, while the exponents give zero. Two routes must give one answer, and that answer is one.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "«Qarama-qarshi soni» — bu ishorasi almashgan son. Ikkining qarama-qarshisi minus ikki, teskarisi esa bir ikkidan — bular butunlay boshqa narsa. Manfiy ko'rsatkich sonni AG'DARADI: ikkining minus uchinchi darajasi bir sakkizdan. Farqni ko'paytirish bilan ajrating: son o'zining teskarisiga ko'paytirilsa bir chiqadi, qarama-qarshisiga ko'paytirilsa esa manfiy son.",
      '«Противоположное число» — это число с изменённым знаком. Противоположное к двум это минус два, а обратное — одна вторая; это совсем разные вещи. Отрицательный показатель ПЕРЕВОРАЧИВАЕТ число: два в минус третьей это одна восьмая. Различай умножением: число, умноженное на обратное, даёт единицу, а на противоположное — отрицательное число.',
      '«Opposite» means the number with its sign changed. The opposite of two is minus two, the reciprocal is one half — quite different things. A negative exponent TURNS the number over: two to the minus three is one eighth. Tell them apart by multiplying: a number times its reciprocal gives one, times its opposite gives a negative number.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "«Birga teng» uchinchi bo'shliqqa tushmaydi: gapning bu qismi asos NOLGA teng bo'lgan holni aytyapti. Nolning nolinchi darajasi ham, manfiy darajasi ham birga teng emas — ular umuman aniqlanmagan, chunki ikkala qoida ham nolga bo'lishga olib boradi. Bir faqat asos noldan farqli bo'lganda chiqadi, va bu gapning boshida allaqachon aytilgan.",
      '«Равны единице» в третий пропуск не подходит: эта часть предложения говорит о случае, когда основание РАВНО НУЛЮ. У нуля ни нулевая, ни отрицательная степень не равны единице — они вообще не определены, ведь оба правила приводят к делению на нуль. Единица получается только при основании, отличном от нуля, и это уже сказано в начале предложения.',
      '«Equal to one» does not fit the third gap: this part of the sentence speaks of the case where the base EQUALS ZERO. Neither the zero power of zero nor its negative powers equal one — they are undefined altogether, since both rules lead to division by zero. One appears only when the base is not zero, and that was already said at the start of the sentence.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni ikkilik misolida tekshiring: ikkining nolinchi darajasi, ikkining minus uchinchi darajasi va nolning nolinchi darajasi.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере двойки: два в нулевой, два в минус третьей и нуль в нулевой.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example of two: two to the zero, two to the minus three, and zero to the zero.') },
  ],
  wrongText: L(
    "Har bo'shliqni son bilan tekshiring. Nolinchi daraja bir beradi, manfiy ko'rsatkich teskari sonni beradi, nol asos esa umuman javob bermaydi.",
    'Проверяй каждый пропуск числом. Нулевая степень даёт единицу, отрицательный показатель даёт обратное число, а нулевое основание не даёт ответа вовсе.',
    'Check every gap with a number. The zero power gives one, a negative exponent gives the reciprocal, and a zero base gives no answer at all.'),
};

export default function D31_10(props) { return <ClozeBank data={DATA} {...props} />; }
