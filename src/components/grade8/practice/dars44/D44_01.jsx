// Dars44 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: pythagoras_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 1-pozitsiya)
//
// JAVOB: HA, YO'Q (skelet §0a.1). Ikki da'vo BIR uchburchak haqida —
// 6, 8, 10, — ya'ni farqni faqat AMAL beradi:
//   s1: kvadratlar qo'shiladi (T2)          -> rost
//   s2: uzunliklar qo'shiladi (З91)         -> yolg'on
// Razbor ikkisini o'sha sonlarda yonma-yon hisoblaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'pythagoras_claims', level: '🟢',
  itemSize: 16,
  given: [['a = 6, b = 8'], ['c = 10']],
  givenLabel: L('Katetlar va gipotenuza', 'Катеты и гипотенуза', 'The legs and the hypotenuse'),
  items: [
    { id: 's1', yes: true, tokens: ['c² = a² + b²'],
      claim: L('shu uchburchakda bajariladi', 'выполняется в этом треугольнике', 'holds in this triangle') },
    { id: 's2', yes: false, tokens: ['c = a + b'],
      claim: L('shu uchburchakda bajariladi', 'выполняется в этом треугольнике', 'holds in this triangle') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "To'g'ri burchakli uchburchakning katetlari olti va sakkiz, gipotenuzasi o'n. Ikki da'vo ham shu uchala sonni bog'laydi, lekin ular boshqa amalni ishlatadi.",
    'Катеты прямоугольного треугольника шесть и восемь, гипотенуза десять. Оба утверждения связывают эти три числа, но действие в них разное.',
    'The legs of a right triangle are six and eight, its hypotenuse ten. Both claims connect those three numbers, but the operation differs.'),
  ask: L(
    "Da'vo bajarilsa «Ha» ni, bajarilmasa «Yo'q» ni bosing.",
    'Если утверждение выполняется — нажми «Да», если нет — «Нет».',
    'Tap «Yes» if the claim holds, «No» if it does not.'),
  correctText: L(
    "To'g'ri. Ikki da'vo bir xil uchala sonni oladi, lekin farq amalda. Kvadratlar bilan: olti kvadrat o'ttiz olti, sakkiz kvadrat oltmish to'rt, yig'indi yuz; o'n kvadrat ham yuz — tenglik bajarildi. Uzunliklar bilan: olti qo'shuv sakkiz o'n to'rt, gipotenuza esa o'n — teng emas. Nima uchun shunday: gipotenuza uchburchakning eng uzun tomoni, lekin u ikki katetning yig'indisidan har doim KICHIK bo'ladi — aks holda uchburchak umuman yopilmaydi, uch nuqta bir chiziqda yotib qoladi.",
    'Верно. Оба утверждения берут одни и те же три числа, но различие в действии. С квадратами: шесть в квадрате — тридцать шесть, восемь в квадрате — шестьдесят четыре, сумма сто; десять в квадрате тоже сто — равенство выполнено. С длинами: шесть плюс восемь — четырнадцать, а гипотенуза десять — не равно. Почему так: гипотенуза самая длинная сторона треугольника, но она всегда МЕНЬШЕ суммы двух катетов — иначе треугольник вообще не замкнётся, три точки лягут на одну прямую.',
    'Correct. Both claims take the same three numbers, but the operation differs. With squares: six squared is thirty six, eight squared is sixty four, the sum is one hundred; ten squared is one hundred too — the equality holds. With lengths: six plus eight is fourteen while the hypotenuse is ten — not equal. Why: the hypotenuse is the longest side of the triangle, but it is always LESS than the sum of the two legs — otherwise the triangle would not close at all and the three points would lie on one line.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'voni sonlar bilan tekshiring: olti kvadrat o'ttiz olti, sakkiz kvadrat oltmish to'rt, ularning yig'indisi yuz. O'n kvadrat ham yuz. Tenglik bajariladi, va bu tasodif emas — Pifagor teoremasi har to'g'ri burchakli uchburchakda shunday deydi.",
      'Проверь первое утверждение числами: шесть в квадрате — тридцать шесть, восемь в квадрате — шестьдесят четыре, их сумма сто. Десять в квадрате тоже сто. Равенство выполняется, и это не совпадение — теорема Пифагора говорит так о любом прямоугольном треугольнике.',
      'Check the first claim with numbers: six squared is thirty six, eight squared is sixty four, their sum is one hundred. Ten squared is one hundred too. The equality holds, and it is no coincidence — the Pythagorean theorem says so of every right triangle.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'voda kvadratlar YO'Q, oddiy qo'shish turadi. Sonlarni qo'ying: olti qo'shuv sakkiz o'n to'rt, gipotenuza esa o'n. Teorema uzunliklarni emas, KVADRATLARNI qo'shadi — va bu ikki narsa hech qachon bir xil natija bermaydi.",
      'Во втором утверждении квадратов НЕТ, стоит обычное сложение. Подставь числа: шесть плюс восемь — четырнадцать, а гипотенуза десять. Теорема складывает не длины, а КВАДРАТЫ — и эти две вещи никогда не дают одинаковый результат.',
      'The second claim has NO squares, just plain addition. Substitute the numbers: six plus eight is fourteen while the hypotenuse is ten. The theorem adds not the lengths but the SQUARES — and those two never give the same result.') },
  ],
  wrongText: L(
    "Har da'voga berilgan uchala sonni qo'ying va hisoblang. Bittasida kvadratlar, ikkinchisida uzunliklar qo'shiladi.",
    'Подставь в каждое утверждение все три данных числа и посчитай. В одном складываются квадраты, в другом длины.',
    'Substitute all three given numbers into each claim and compute. One adds squares, the other lengths.'),
};

export default function D44_01(props) { return <TrueFalse data={DATA} {...props} />; }
