// Dars45 · Amaliyot 06 — Ha yoki yo'q · 🟡 · tag: converse_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 6-pozitsiya)
//
// JAVOB: HA, HA (skelet §0a.1). Ikkinchi da'vo birinchisining DAVOMI: teskari
// teorema faqat «to'g'ri burchakli» demaydi, burchakning JOYINI ham aytadi
// (З95). O'quvchi ikkinchisini «ortiqcha da'vo» deb rad etadi.
//
// Misol darslikdan (99-bet): 6, 7, ildiz ostida 85. Eng katta tomon ildizli,
// va shu sababli u ko'zga darhol tashlanmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'converse_claims', level: '🟡',
  itemSize: 16,
  given: [['6, ', { r: '85' }, ', 7']],
  givenLabel: L('Uchburchakning tomonlari', 'Стороны треугольника', 'The sides of the triangle'),
  items: [
    { id: 's1', yes: true, tokens: ['6² + 7² = 85'],
      claim: L("shuning uchun uchburchak to'g'ri burchakli", 'поэтому треугольник прямоугольный', 'so the triangle is right-angled') },
    { id: 's2', yes: true, tokens: ['90° ↔ ', { r: '85' }],
      claim: L("to'g'ri burchak shu tomonga qarama-qarshi", 'прямой угол лежит против этой стороны', 'the right angle lies opposite this side') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Uchburchakning tomonlari olti, ildiz ostida sakson besh va yetti. Ikki da'vo ketma-ket keladi: birinchisi uchburchakning turi haqida, ikkinchisi to'g'ri burchakning joyi haqida.",
    'Стороны треугольника шесть, корень из восьмидесяти пяти и семь. Два утверждения идут друг за другом: первое о виде треугольника, второе о месте прямого угла.',
    'The sides of a triangle are six, the root of eighty five and seven. Two claims come one after the other: the first about the kind of triangle, the second about where the right angle sits.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Birinchisi: o'ttiz olti qo'shuv qirq to'qqiz sakson besh, va ildiz ostida sakson beshning kvadrati aynan sakson besh — tenglik bajariladi, demak teskari teorema bo'yicha uchburchak to'g'ri burchakli. Ikkinchisi shu teoremaning IKKINCHI YARMI: teorema burchak borligini aytish bilan to'xtamaydi, uning joyini ham aytadi — to'g'ri burchak eng katta tomonga qarama-qarshi uchda turadi. Bu yerda eng katta tomon ildiz ostida sakson besh, ya'ni to'qqizdan bir oz katta: u yettidan ham, oltidan ham katta. Ikki da'vo bir-birini almashtirmaydi: birinchisi TURNI, ikkinchisi JOYNI aytadi.",
    'Верно, оба истинны. Первое: тридцать шесть плюс сорок девять — восемьдесят пять, а квадрат корня из восьмидесяти пяти ровно восемьдесят пять — равенство выполняется, значит по обратной теореме треугольник прямоугольный. Второе — это ВТОРАЯ ПОЛОВИНА той же теоремы: она не останавливается на том, что угол есть, но говорит и где он — прямой угол лежит против наибольшей стороны. Здесь наибольшая сторона корень из восьмидесяти пяти, то есть чуть больше девяти: она больше и семи, и шести. Два утверждения не заменяют друг друга: первое про ВИД, второе про МЕСТО.',
    'Correct, both are true. The first: thirty six plus forty nine is eighty five, and the square of the root of eighty five is exactly eighty five — the equality holds, so by the converse theorem the triangle is right-angled. The second is the SECOND HALF of that same theorem: it does not stop at saying the angle exists, it also says where — the right angle lies opposite the largest side. Here the largest side is the root of eighty five, a little over nine: greater than seven and greater than six. The two claims do not replace each other: the first is about the KIND, the second about the PLACE.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'voni hisoblab tekshiring: o'ttiz olti qo'shuv qirq to'qqiz sakson besh. Ildiz ostida sakson beshning kvadrati esa sakson beshning o'zi — ildiz va kvadrat bir-birini yo'qotadi. Tenglik bajarildi, va teskari teorema aynan shu holatda uchburchakni to'g'ri burchakli deb ataydi.",
      'Проверь первое утверждение счётом: тридцать шесть плюс сорок девять — восемьдесят пять. А квадрат корня из восьмидесяти пяти — это само восемьдесят пять: корень и квадрат уничтожают друг друга. Равенство выполнено, и обратная теорема как раз в этом случае называет треугольник прямоугольным.',
      'Check the first claim by computing: thirty six plus forty nine is eighty five. And the square of the root of eighty five is eighty five itself — the root and the square cancel. The equality holds, and the converse theorem calls the triangle right-angled in exactly that case.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ortiqcha emas — u teoremaning bir qismi. Teorema shunday deydi: tenglik bajarilsa, uchburchak to'g'ri burchakli, VA to'g'ri burchak aynan shu eng katta tomonga qarama-qarshi turadi. Ikkinchi qism bo'lmasa, burchakni istalgan uchga qo'yish mumkin bo'lardi, bu esa xato bo'lardi. Ildiz ostida sakson besh eng katta tomon, ya'ni to'g'ri burchak unga qarshi.",
      'Второе утверждение не лишнее — это часть теоремы. Теорема говорит так: если равенство выполнено, треугольник прямоугольный, И прямой угол лежит именно против этой наибольшей стороны. Без второй части угол можно было бы поставить в любую вершину, и это было бы ошибкой. Корень из восьмидесяти пяти — наибольшая сторона, значит прямой угол против неё.',
      'The second claim is not superfluous — it is part of the theorem. The theorem says: if the equality holds the triangle is right-angled, AND the right angle lies opposite that largest side. Without the second half the angle could be put at any vertex, which would be wrong. The root of eighty five is the largest side, so the right angle faces it.') },
  ],
  wrongText: L(
    "Ikki da'vo ikki savolga javob beradi: uchburchak qanday turdagi, va to'g'ri burchak qayerda.",
    'Два утверждения отвечают на два вопроса: какого вида треугольник и где прямой угол.',
    'The two claims answer two questions: what kind of triangle it is, and where the right angle sits.'),
};

export default function D45_06(props) { return <TrueFalse data={DATA} {...props} />; }
