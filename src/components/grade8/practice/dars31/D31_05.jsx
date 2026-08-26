// Dars31 · Amaliyot 05 — Tartib · 🟡 · tag: neg_power_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 5-pozitsiya)
//
// TO'RT QADAM: ko'rsatkichni ko'ramiz -> teskari songa o'tamiz -> darajani
// hisoblaymiz -> o'nli kasr bilan yozamiz.
//
// З63 NING JOYI. Ro'yxatda «ishorani almashtiramiz» degan qadam UMUMAN
// YO'Q, va uni izlash xatoning o'zi. Xato tartibda esa darajani teskari
// songa o'tishdan OLDIN hisoblash turadi: o'shanda yigirma besh chiqadi va
// javob butun son bo'lib qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'neg_power_steps', level: '🟡',
  expr: ['5⁻²'], exprSize: 30,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['5⁻²'],
      label: L("manfiy ko'rsatkichni ko'ramiz", 'видим отрицательный показатель', 'we see the negative exponent') },
    { id: 'l2', tokens: [{ n: '1', d: '5²' }],
      label: L("teskari songa o'tamiz", 'переходим к обратному числу', 'move to the reciprocal') },
    { id: 'l3', tokens: [{ n: '1', d: '25' }],
      label: L('darajani hisoblaymiz', 'вычисляем степень', 'compute the power') },
    { id: 'l4', tokens: ['0,04'],
      label: L("o'nli kasr bilan yozamiz", 'записываем десятичной дробью', 'write it as a decimal') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Manfiy ko'rsatkichli darajani hisoblash to'rt qadamda boradi, lekin qadamlar aralashib ketgan. Ro'yxatda ishorani almashtiradigan qadam yo'q — bunday qadam umuman mavjud emas.",
    'Вычисление степени с отрицательным показателем идёт в четыре шага, но шаги перепутаны. В списке нет шага, меняющего знак, — такого шага вообще не существует.',
    'Computing a power with a negative exponent takes four steps, but the steps are mixed up. There is no step in the list that changes the sign — no such step exists at all.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval ko'rsatkichga qaraymiz va uning manfiy ekanini ko'ramiz — bu birinchi qadam, chunki keyingi hamma ish shundan chiqadi. Keyin teskari songa o'tamiz: asos maxrajga tushadi va ko'rsatkich musbat bo'lib qoladi, ya'ni bir bo'lingan beshning kvadrati. Undan keyin darajani hisoblaymiz: beshning kvadrati yigirma besh, natija bir bo'lingan yigirma besh. Va oxirida uni o'nli kasr bilan yozamiz: nol butun nol to'rt yuzdan. Darajani teskari songa o'tishdan OLDIN hisoblab bo'lmaydi — o'shanda hisoblanadigan narsa boshqa bo'lib qoladi.",
    'Верно. Сначала смотрим на показатель и видим, что он отрицательный — это первый шаг, потому что вся дальнейшая работа исходит из него. Потом переходим к обратному числу: основание уходит в знаменатель, а показатель становится положительным, то есть единица делить на пять в квадрате. Затем вычисляем степень: пять в квадрате двадцать пять, результат одна двадцать пятая. И в конце записываем десятичной дробью: нуль целых четыре сотых. Вычислить степень ДО перехода к обратному числу нельзя — тогда считалось бы совсем другое.',
    'Correct. First we look at the exponent and see that it is negative — that is the first step, because everything after it follows from that. Then we move to the reciprocal: the base goes into the denominator and the exponent turns positive, that is one divided by five squared. Then we compute the power: five squared is twenty-five, the result is one twenty-fifth. And at the end we write it as a decimal: zero point zero four. The power cannot be computed BEFORE moving to the reciprocal — that would compute something else entirely.'),
  wrongs: [
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Darajani hisoblash TESKARI SONGA O'TGANDAN keyin bo'ladi. Aks holda nima hisoblanayotgani noaniq: beshning kvadratimi yoki beshning minus ikkinchi darajasimi. Birinchisi yigirma besh, ikkinchisi bir yigirma beshdan — ular teskari sonlar, ya'ni bir-biridan juda uzoq. Manfiy ko'rsatkich avval yo'qotiladi, keyin hisob boshlanadi.",
      'Вычисление степени идёт ПОСЛЕ перехода к обратному числу. Иначе непонятно, что именно вычисляется: пять в квадрате или пять в минус второй. Первое двадцать пять, второе одна двадцать пятая — это взаимно обратные числа, то есть они очень далеки друг от друга. Сначала убирается отрицательный показатель, потом начинается счёт.',
      'Computing the power comes AFTER moving to the reciprocal. Otherwise it is unclear what is being computed: five squared or five to the minus two. The first is twenty-five, the second one twenty-fifth — reciprocals of each other, that is, very far apart. First the negative exponent is removed, then the arithmetic begins.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "O'nli kasr bilan yozish ENG OXIRGI qadam: yoziladigan kasr hali topilmagan. Oxirgi qadam yangi qaror qabul qilmaydi — u tayyor natijani boshqa shaklda ko'rsatadi. Bir bo'lingan yigirma beshni to'rtga ko'paytirib yuzdan kelib chiqaring: to'rt yuzdan, ya'ni nol butun nol to'rt.",
      'Запись десятичной дробью — САМЫЙ ПОСЛЕДНИЙ шаг: записывать пока нечего. Последний шаг не принимает нового решения — он показывает готовый результат в другой форме. Домножь одну двадцать пятую на четыре и приведи к сотым: четыре сотых, то есть нуль целых четыре сотых.',
      'Writing it as a decimal is the VERY LAST step: there is nothing to write yet. The last step makes no new decision — it shows the finished result in another form. Multiply one twenty-fifth by four to reach hundredths: four hundredths, that is zero point zero four.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Hisobdan yoki tayyor javobdan boshlab bo'lmaydi — ular ishning natijasi. Birinchi qadam eng sodda: yozuvga qarash va ko'rsatkich manfiy ekanini ko'rish. Aynan shu ko'rish keyingi qadamni belgilaydi.",
      'Начинать с вычисления или с готового ответа нельзя — они результат работы. Первый шаг самый простой: посмотреть на запись и увидеть, что показатель отрицательный. Именно это и определяет следующий шаг.',
      'You cannot start with the computation or the finished answer — they are the result of the work. The first step is the simplest: look at the record and see that the exponent is negative. That very observation sets the next step.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Teskari songa o'tish KO'RSATKICHGA QARAGANDAN keyin bo'ladi: o'tish sababini o'sha qadam beradi. Manfiy ko'rsatkich bo'lmaganda hech qanday ag'darish qilinmaydi — masalan beshning ikkinchi darajasida shunchaki yigirma besh yoziladi. Tartib shu sababli qat'iy: har qadam oldingisining natijasidan chiqadi.",
      'Переход к обратному числу идёт ПОСЛЕ взгляда на показатель: причину перехода даёт именно тот шаг. Если показатель не отрицательный, никакого переворота не делают — например, у пяти во второй степени просто пишут двадцать пять. Поэтому порядок строгий: каждый шаг вытекает из результата предыдущего.',
      'Moving to the reciprocal comes AFTER looking at the exponent: that step supplies the reason for the move. With a non-negative exponent no turning over is done — for five squared you simply write twenty-five. That is why the order is fixed: each step follows from the result of the one before.') },
  ],
  wrongText: L(
    "Ko'rsatkichga qarash birinchi, o'nli kasr oxirgi. Darajani faqat teskari songa o'tgandan keyin hisoblash mumkin, ishorani almashtiradigan qadam esa umuman yo'q.",
    'Взгляд на показатель первый, десятичная дробь последняя. Степень можно вычислять только после перехода к обратному числу, а шага со сменой знака не существует вовсе.',
    'Looking at the exponent comes first, the decimal last. The power can be computed only after moving to the reciprocal, and a step that changes the sign does not exist at all.'),
};

export default function D31_05(props) { return <SwapOrder data={DATA} {...props} />; }
