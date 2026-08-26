// Dars35 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: average_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 1-pozitsiya)
//
// IKKALA DA'VO HAM ROST (skelet §0a.3), va aynan shu З71 ni sindiradi:
// bitta qatorda moda to'rtga, o'rtacha esa beshga teng — ikkala javob ham
// to'g'ri, lekin ular TENG EMAS.
//
// Qator ataylab qisqa: uchta son, ikkitasi bir xil. O'rtachani og'zaki
// hisoblash mumkin (o'n besh bo'lingan uch), ya'ni hisob emas, ATAMALARNI
// ajratish tekshiriladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'average_claims', level: '🟢',
  itemSize: 17,
  given: [['4, 4, 7']],
  givenLabel: L('Qator', 'Ряд', 'The series'),
  items: [
    { id: 's1', yes: true, tokens: ['moda = 4'],
      claim: L('bu rost', 'это верно', 'this is true') },
    { id: 's2', yes: true, tokens: ["o'rtacha = 5"],
      claim: L('bu rost', 'это верно', 'this is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Uchta sondan iborat qator berilgan. Ikki da'vo bir xil qator haqida, lekin ular ikki xil kattalikni nomlaydi.",
    'Дан ряд из трёх чисел. Два утверждения об одном и том же ряде, но называют они две разные величины.',
    'A series of three numbers is given. Two claims speak about the same series, but they name two different quantities.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Moda — eng ko'p uchraydigan qiymat: qatorda to'rtlik ikki marta, yettilik esa bir marta turibdi, ya'ni moda to'rt. O'rtacha qiymat — yig'indini soniga bo'lish: to'rt qo'shuv to'rt qo'shuv yetti o'n besh, o'n besh bo'lingan uch besh. Ya'ni bitta qatorda moda to'rtga, o'rtacha esa beshga teng, va bu ziddiyat emas — ular boshqa savolga javob beradi. Moda «qaysi qiymat eng ko'p uchraydi» degan savolga javob beradi va u qatorda ALBATTA bor; o'rtacha esa «qanday teng taqsimlangan bo'lardi» degan savolga javob beradi va u qatorda umuman bo'lmasligi mumkin — bu yerda beshlik qatorda yo'q.",
    'Верно, оба утверждения истинны. Мода — самое частое значение: в ряду четвёрка стоит два раза, а семёрка один, значит мода четыре. Среднее значение — сумма, делённая на количество: четыре плюс четыре плюс семь пятнадцать, пятнадцать делить на три пять. То есть в одном ряду мода равна четырём, а среднее пяти, и это не противоречие — они отвечают на разные вопросы. Мода отвечает на вопрос «какое значение встречается чаще всего» и в ряду ОБЯЗАТЕЛЬНО присутствует; среднее отвечает на вопрос «как бы выглядело равное распределение» и в ряду может вовсе отсутствовать — здесь пятёрки в ряду нет.',
    'Correct, both are true. The mode is the most frequent value: the four stands twice in the series and the seven once, so the mode is four. The mean is the sum divided by the count: four plus four plus seven is fifteen, fifteen divided by three is five. So in one series the mode is four and the mean is five, and that is no contradiction — they answer different questions. The mode answers «which value occurs most often» and is ALWAYS present in the series; the mean answers «what an equal share would look like» and may be absent from the series altogether — here there is no five in the series.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala da'vo ham rost edi, va ikkalasi ham rad etildi. Har birini alohida hisoblang: modani sanash bilan (to'rtlik ikki marta, yettilik bir marta), o'rtachani bo'lish bilan (o'n besh bo'lingan uch). Ikki javobning teng chiqmagani xato emas — ular teng bo'lishi SHART emas.",
      'Оба утверждения были верны, и оба отвергнуты. Посчитай каждое отдельно: моду подсчётом (четвёрка два раза, семёрка один), среднее делением (пятнадцать делить на три). То, что два ответа не совпали, не ошибка — они и не ОБЯЗАНЫ совпадать.',
      'Both claims were true, and both were rejected. Compute each on its own: the mode by counting (the four twice, the seven once), the mean by dividing (fifteen by three). That the two answers differ is not an error — they are under no obligation to agree.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo rost: moda to'rt. Modani topish uchun hisoblash kerak emas, faqat SANASH kerak: qaysi qiymat eng ko'p uchraydi. To'rtlik ikki marta, yettilik bir marta — demak moda to'rt. Moda har doim qatorning o'z sonlaridan biri bo'ladi, chunki u qiymatni tanlaydi, yangisini yasamaydi.",
      'Первое утверждение верно: мода четыре. Чтобы найти моду, вычислять не нужно, нужно СЧИТАТЬ: какое значение встречается чаще. Четвёрка два раза, семёрка один — значит мода четыре. Мода всегда одно из чисел самого ряда, ведь она выбирает значение, а не создаёт новое.',
      'The first claim is true: the mode is four. Finding the mode requires no computing, only COUNTING: which value occurs most often. The four twice, the seven once — so the mode is four. The mode is always one of the numbers of the series itself, since it picks a value rather than making a new one.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ham rost: o'rtacha besh. Hisoblang — to'rt qo'shuv to'rt qo'shuv yetti o'n besh, o'n besh bo'lingan uch besh. Beshlik qatorda yo'q, va bu g'alati emas: o'rtacha qiymat qatordan tanlanmaydi, u HISOBLANADI. Uni shunday tasavvur qiling: agar o'n beshni uch kishiga teng bo'lsak, har biriga beshtadan tushadi.",
      'Второе утверждение тоже верно: среднее пять. Посчитай — четыре плюс четыре плюс семь пятнадцать, пятнадцать делить на три пять. Пятёрки в ряду нет, и это не странно: среднее значение не выбирается из ряда, оно ВЫЧИСЛЯЕТСЯ. Представь так: если разделить пятнадцать поровну между тремя, каждому достанется по пять.',
      'The second claim is true as well: the mean is five. Compute it — four plus four plus seven is fifteen, fifteen divided by three is five. There is no five in the series, and that is nothing strange: the mean is not chosen from the series, it is COMPUTED. Picture it this way: share fifteen equally among three and each gets five.') },
  ],
  wrongText: L(
    "Modani sanash bilan, o'rtachani bo'lish bilan toping. Ular teng bo'lishi shart emas, va bu qatorda ular teng emas.",
    'Моду находи подсчётом, среднее делением. Совпадать они не обязаны, и в этом ряду они не совпадают.',
    'Find the mode by counting and the mean by dividing. They need not agree, and in this series they do not.'),
};

export default function D35_01(props) { return <TrueFalse data={DATA} {...props} />; }
