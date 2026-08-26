// Dars49 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: chord_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 2-pozitsiya)
//
// JAVOB: HA, YO'Q (skelet §0a.1).
//   s1: R = 13, vatar 24 -> markazdan masofa 5     -> ROST (T3, hisob bilan)
//   s2: istalgan diametr vatarni teng ikkiga bo'ladi -> YOLG'ON (З105)
// Ikki da'vo darsning ikki qoq masalasiga tegadi: hisob va shart.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'chord_claims', level: '🟢',
  itemSize: 15,
  given: [['R = 13'], ['AB = 24']],
  givenLabel: L('Radius va vatar', 'Радиус и хорда', 'The radius and the chord'),
  items: [
    { id: 's1', yes: true, tokens: ['d = 5'],
      claim: L("markazdan vatargacha masofa shunday", 'таково расстояние от центра до хорды', 'such is the distance from the centre to the chord') },
    { id: 's2', yes: false, tokens: ['CD → AB : 2'],
      claim: L("istalgan CD diametri AB ni teng ikkiga bo'ladi", 'любой диаметр CD делит AB пополам', 'any diameter CD halves AB') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Aylananing radiusi o'n uch, unda AB vatari chizilgan va uning uzunligi yigirma to'rt. Birinchi da'vo hisob haqida, ikkinchisi esa diametrning vatarni bo'lishi haqida.",
    'Радиус окружности тринадцать, в ней проведена хорда AB длиной двадцать четыре. Первое утверждение о вычислении, второе о том, как диаметр делит хорду.',
    'The radius of a circle is thirteen and a chord AB of length twenty four is drawn in it. The first claim is about a computation, the second about how a diameter divides a chord.'),
  ask: L(
    "Da'vo to'g'ri bo'lsa «Ha» ni, xato bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ошибочно — «Нет».',
    'Tap «Yes» if the claim is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri. Birinchi da'vo rost, va uni hisob tasdiqlaydi: markazdan vatarga perpendikulyar tushirsak, u vatarni teng ikkiga bo'ladi, ya'ni katet vatarning YARMI — o'n ikki. Gipotenuza radius, ya'ni o'n uch. Bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh, ildizi besh. Ikkinchi da'vo esa yolg'on: faqat vatarga PERPENDIKULYAR diametr uni teng ikkiga bo'ladi. Qiya diametr ham vatarni kesadi, lekin bo'laklar teng bo'lmaydi. Bitta istisno bor: agar vatar o'zi diametr bo'lsa, uni har qanday diametr markazda kesadi — lekin bu «istalgan vatar» degan da'voni qutqarmaydi.",
    'Верно. Первое утверждение истинно, и счёт это подтверждает: если опустить из центра перпендикуляр на хорду, он делит её пополам, значит катет — ПОЛОВИНА хорды, двенадцать. Гипотенуза — радиус, тринадцать. Сто шестьдесят девять минус сто сорок четыре — двадцать пять, корень пять. А второе утверждение ложно: пополам хорду делит только ПЕРПЕНДИКУЛЯРНЫЙ ей диаметр. Наклонный диаметр хорду тоже пересекает, но части выходят не равными. Есть одно исключение: если хорда сама диаметр, её любой диаметр пересечёт в центре — но утверждение «любая хорда» это не спасает.',
    'Correct. The first claim is true and the arithmetic confirms it: dropping a perpendicular from the centre to the chord halves it, so the leg is HALF the chord, twelve. The hypotenuse is the radius, thirteen. One hundred sixty nine minus one hundred forty four is twenty five, the root five. The second claim is false: only a diameter PERPENDICULAR to the chord halves it. An oblique diameter crosses the chord too, but the pieces come out unequal. There is one exception: if the chord is itself a diameter, any diameter meets it at the centre — but that does not save the claim about any chord.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'voni hisoblab tekshiring. Markazdan vatarga perpendikulyar tushiriladi, va u vatarni teng ikkiga bo'ladi: katet o'n ikki, gipotenuza esa radius o'n uch. Bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh, ildizi besh. Vatarning to'liq uzunligini olsangiz, ildiz ostida manfiy son chiqadi — bu xatoni darhol ko'rsatadi.",
      'Проверь первое утверждение счётом. Из центра на хорду опускается перпендикуляр, и он делит хорду пополам: катет двенадцать, гипотенуза — радиус тринадцать. Сто шестьдесят девять минус сто сорок четыре — двадцать пять, корень пять. Если взять всю длину хорды, под корнем выйдет отрицательное число — ошибка видна сразу.',
      'Check the first claim by computing. A perpendicular is dropped from the centre onto the chord and halves it: the leg is twelve, the hypotenuse the radius thirteen. One hundred sixty nine minus one hundred forty four is twenty five, the root five. Take the whole chord length and the root turns negative — the error shows at once.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo yolg'on: «istalgan» degan so'z uni buzadi. Vatarni teng ikkiga bo'lish uchun diametr unga PERPENDIKULYAR bo'lishi kerak. Qiya diametrni tasavvur qiling: u vatarni kesadi, lekin kesishish nuqtasi o'rtadan chetda bo'ladi va bo'laklar teng bo'lmaydi. Aylanada bitta vatarga cheksiz ko'p diametr keladi, lekin faqat bittasi unga perpendikulyar.",
      'Второе утверждение ложно: его ломает слово «любой». Чтобы делить хорду пополам, диаметр должен быть ей ПЕРПЕНДИКУЛЯРЕН. Представь наклонный диаметр: он пересекает хорду, но точка пересечения оказывается в стороне от середины, и части не равны. К одной хорде подходит бесконечно много диаметров, но перпендикулярен ей только один.',
      'The second claim is false: the word any breaks it. To halve a chord a diameter must be PERPENDICULAR to it. Picture an oblique diameter: it crosses the chord, but the crossing point sits away from the midpoint and the pieces are unequal. Infinitely many diameters meet a given chord, but only one is perpendicular to it.') },
  ],
  wrongText: L(
    "Birinchi da'voni hisoblab tekshiring, ikkinchisida esa «istalgan» degan so'zga diqqat qiling.",
    'Первое утверждение проверь счётом, а во втором обрати внимание на слово «любой».',
    'Check the first claim by computing; in the second look closely at the word any.'),
};

export default function D49_02(props) { return <TrueFalse data={DATA} {...props} />; }
