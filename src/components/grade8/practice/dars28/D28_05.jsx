// Dars28 · Amaliyot 05 — Eng ko'pi · 🟡 · tag: max_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 5-pozitsiya)
//
// T2 va T3 BIRGA. Tengsizlik: ikki ming besh yuz x o'n yetti mingdan katta
// emas, ya'ni x olti butun sakkizdan kichik yoki teng. Javob esa BUTUN
// bo'lishi kerak, va yuqoriga yaxlitlab bo'lmaydi — pul yetmaydi.
//
// Eng ko'p uchraydigan xato — yetti: kasrni «yaqinroq» butun songa
// yaxlitlash. Bu yerda yaxlitlash yo'nalishini masala hal qiladi, matematik
// odat emas (З57).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'max_count', level: '🟡',
  target: 6, allowNeg: false,
  expr: ['2500x ≤ 17000'], exprSize: 26,
  eyebrow: L("Eng ko'pi", 'Не больше чем', 'At most'),
  setup: L(
    "Bitta qalam 2500 so'm turadi, Nodirada 17000 so'm bor. Shartdan tengsizlik tuzilgan. Javob qalamlar soni bo'ladi.",
    'Одна ручка стоит 2500 сумов, у Нодиры 17000 сумов. По условию составлено неравенство. Ответом будет число ручек.',
    'One pen costs 2500 soums and Nodira has 17000 soums. The inequality follows from the condition. The answer will be a count of pens.'),
  label: L("Qalamlar soni", 'Число ручек', 'The number of pens'),
  ask: L("Eng ko'pi bilan nechta qalam oladi?", 'Сколько ручек она купит самое большее?', 'At most how many pens can she buy?'),
  correctText: L(
    "To'g'ri. Ikkala qismni ikki ming besh yuzga bo'lamiz: x olti butun sakkizdan kichik yoki teng. Qalamlarning soni butun bo'lishi kerak, demak eng kattasi olti. Tekshirish: olti qalam o'n besh ming — yetadi; yetti qalam o'n yetti ming besh yuz — yetmaydi.",
    'Верно. Делим обе части на две тысячи пятьсот: x меньше или равен шести целым восьми десятым. Число ручек должно быть целым, значит наибольшее это шесть. Проверка: шесть ручек пятнадцать тысяч — хватает; семь ручек семнадцать тысяч пятьсот — не хватает.',
    'Correct. Divide both sides by two thousand five hundred: x is less than or equal to six point eight. The count of pens must be whole, so the largest is six. Check: six pens cost fifteen thousand — enough; seven cost seventeen thousand five hundred — not enough.'),
  wrongs: [
    { when: (s) => s.value === 7, text: L(
      "Yetti — olti butun sakkizga yaqinroq son, lekin u tengsizlikni BUZADI. Yaxlitlashning yo'nalishini bu yerda odat emas, masala hal qiladi: yetti qalamning narxi o'n yetti ming besh yuz so'm, Nodirada esa o'n yetti ming bor. Besh yuz so'm yetishmaydi. Shuning uchun javob yuqoriga emas, PASTGA yaxlitlanadi.",
      'Семь — число, которое ближе к шести целым восьми десятым, но оно НАРУШАЕТ неравенство. Направление округления здесь решает не привычка, а задача: семь ручек стоят семнадцать тысяч пятьсот сумов, а у Нодиры семнадцать тысяч. Пятисот сумов не хватает. Поэтому ответ округляют не вверх, а ВНИЗ.',
      'Seven is the number nearer to six point eight, but it BREAKS the inequality. The direction of rounding here is decided not by habit but by the problem: seven pens cost seventeen thousand five hundred soums while Nodira has seventeen thousand. Five hundred soums short. So the answer is rounded DOWN, not up.') },
    { when: (s) => s.value === 8, text: L(
      "Bu son yechimdan chiqmaydi. Ikkala qismni ikki ming besh yuzga bo'ling: o'n yetti ming bo'lingan ikki ming besh yuz olti butun sakkizga teng. Sakkiz esa undan katta, ya'ni sakkiz qalamning narxi yigirma ming so'm — Nodiraning pulidan ancha ko'p.",
      'Это число из решения не выходит. Раздели обе части на две тысячи пятьсот: семнадцать тысяч делить на две тысячи пятьсот это шесть целых восемь десятых. А восемь больше, то есть восемь ручек стоят двадцать тысяч сумов — намного больше денег Нодиры.',
      'That number does not come out of the solution. Divide both sides by two thousand five hundred: seventeen thousand over two thousand five hundred is six point eight. Eight is larger than that, so eight pens cost twenty thousand soums — far more than Nodira has.') },
    { when: (s) => s.value === 5 || s.value === 4, text: L(
      "Bu javob ishlaydi, lekin u ENG KATTASI emas. Savol eng ko'pi bilan nechta qalam olishini so'rayapti. Beshta qalam o'n ikki ming besh yuz so'm — pul ortib qoladi, ya'ni yana bitta qalam olish mumkin. Oltitasi o'n besh ming so'm, va bu hali ham yetadi.",
      'Этот ответ работает, но он не НАИБОЛЬШИЙ. Спрашивают, сколько ручек она купит самое большее. Пять ручек это двенадцать тысяч пятьсот сумов — деньги остаются, значит можно взять ещё одну. Шесть ручек это пятнадцать тысяч, и денег всё ещё хватает.',
      'That answer works, but it is not the LARGEST. The question asks at most how many pens she can buy. Five pens cost twelve thousand five hundred soums — money is left over, so one more can be taken. Six pens cost fifteen thousand, and the money still suffices.') },
  ],
  wrongText: L(
    "Tengsizlikni yeching va x ning eng katta qiymatini toping. Keyin javobni butun songa keltiring: pul yetadigan tomonga, ya'ni PASTGA. Javobni narx bilan tekshiring.",
    'Реши неравенство и найди наибольшее значение x. Потом приведи ответ к целому — в ту сторону, где денег хватает, то есть ВНИЗ. Проверь ответ по стоимости.',
    'Solve the inequality and find the largest value of x. Then bring the answer to a whole number — towards the side where the money suffices, that is DOWN. Check your answer against the cost.'),
};

export default function D28_05(props) { return <TypeValue data={DATA} {...props} />; }
