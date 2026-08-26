// Dars49 · Amaliyot 03 — Test · 🟢 · tag: when_bisects
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 3-pozitsiya)
//
// З105 SO'Z BILAN. Uchinchi xato variant ayniqsa qimmat: «vatar diametrga
// teng bo'lganda» — bu ROST, lekin u ALOHIDA hol, ya'ni umumiy javob
// bo'lolmaydi. Shart faqat bitta vatar uchun bajariladi, qolganlari uchun
// esa hech narsa aytmaydi.
// `Choice` ning variantlari SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'when_bisects', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Aylanada vatar chizilgan, va uni turli diametrlar kesib o'tishi mumkin. Ularning ba'zisi vatarni teng ikkiga bo'ladi, ba'zisi esa yo'q.",
    'В окружности проведена хорда, и её могут пересекать разные диаметры. Одни делят хорду пополам, другие нет.',
    'A chord is drawn in a circle and different diameters may cross it. Some halve the chord, others do not.'),
  ask: L(
    "Diametr vatarni qachon teng ikkiga bo'ladi?",
    'Когда диаметр делит хорду пополам?',
    'When does a diameter halve a chord?'),
  opts: [
    { label: L("vatarga perpendikulyar bo'lganda", 'когда он перпендикулярен хорде', 'when it is perpendicular to the chord') },
    { label: L('har qanday holda', 'в любом случае', 'in every case') },
    { label: L("vatar radiusga teng bo'lganda", 'когда хорда равна радиусу', 'when the chord equals the radius') },
    { label: L("vatar diametrga teng bo'lganda", 'когда хорда равна диаметру', 'when the chord equals the diameter') },
  ],
  correctText: L(
    "To'g'ri. Isbot teng yonli uchburchakka tayanadi: markazdan vatarning ikki uchiga radius chizsak, ikki tomoni teng uchburchak hosil bo'ladi. Teng yonli uchburchakda asosga tushirilgan balandlik bir vaqtda mediana ham bo'ladi, ya'ni asosni teng ikkiga bo'ladi. Diametr esa vatarga perpendikulyar bo'lganda aynan shu balandlik bo'lib qoladi. Perpendikulyarlik buzilishi bilan xulosa ham buziladi: qiya diametr vatarni teng bo'lmagan ikki bo'lakka bo'ladi.",
    'Верно. Доказательство опирается на равнобедренный треугольник: проведя радиусы из центра к концам хорды, получаем треугольник с двумя равными сторонами. В равнобедренном треугольнике высота к основанию является и медианой, то есть делит основание пополам. А диаметр становится этой самой высотой именно тогда, когда он перпендикулярен хорде. Стоит перпендикулярности исчезнуть — исчезает и вывод: наклонный диаметр делит хорду на две неравные части.',
    'Correct. The proof rests on an isosceles triangle: drawing radii from the centre to the ends of the chord gives a triangle with two equal sides. In an isosceles triangle the height to the base is also a median, so it halves the base. And the diameter becomes that very height exactly when it is perpendicular to the chord. Remove the perpendicularity and the conclusion goes with it: an oblique diameter splits the chord into two unequal pieces.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "«Har qanday holda» degan javob eng ko'p uchraydigan xato. Bitta vatarga cheksiz ko'p diametr keladi, va ularning faqat BITTASI unga perpendikulyar. Qolganlari vatarni kesadi, lekin bo'laklar teng bo'lmaydi: kesishish nuqtasi o'rtadan chetda qoladi.",
      'Ответ «в любом случае» — самая частая ошибка. К одной хорде подходит бесконечно много диаметров, и перпендикулярен ей только ОДИН. Остальные хорду пересекают, но части не равны: точка пересечения оказывается в стороне от середины.',
      'In every case is the commonest error. Infinitely many diameters meet a given chord, and only ONE of them is perpendicular to it. The rest cross the chord, but the pieces are unequal: the crossing point sits away from the midpoint.') },
    { when: (s) => s.picked === 2, text: L(
      "Vatarning uzunligi bu yerda hech narsani hal qilmaydi. Radiusga teng vatarni oling va unga qiya diametr o'tkazing: bo'laklar teng bo'lmaydi. Keyin o'sha vatarga perpendikulyar diametr o'tkazing: bo'laklar teng bo'ladi. Farqni uzunlik emas, YO'NALISH beradi.",
      'Длина хорды здесь ничего не решает. Возьми хорду, равную радиусу, и проведи через неё наклонный диаметр: части не равны. Потом проведи перпендикулярный: части равны. Различие даёт не длина, а НАПРАВЛЕНИЕ.',
      'The length of the chord decides nothing here. Take a chord equal to the radius and run an oblique diameter through it: the pieces are unequal. Then run a perpendicular one: the pieces are equal. What makes the difference is DIRECTION, not length.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu variant ROST, lekin u umumiy javob emas: vatar diametrga teng bo'lsa, u o'zi diametr bo'ladi va har qanday boshqa diametr uni markazda, ya'ni o'rtasida kesadi. Lekin bu ALOHIDA hol — aylanada bunday vatar cheksiz ko'p, lekin ularning har biri diametr, va qolgan hamma vatar haqida bu variant hech narsa aytmaydi. Umumiy shart esa boshqa: perpendikulyarlik.",
      'Этот вариант ВЕРЕН, но общим ответом он не является: если хорда равна диаметру, она сама и есть диаметр, и любой другой диаметр пересечёт её в центре, то есть в середине. Но это ЧАСТНЫЙ случай — таких хорд в окружности бесконечно много, однако каждая из них диаметр, а обо всех остальных хордах этот вариант не говорит ничего. Общее же условие другое: перпендикулярность.',
      'This option is TRUE, but it is not the general answer: if a chord equals the diameter it is itself a diameter, and any other diameter meets it at the centre, that is, at its midpoint. But that is a SPECIAL case — such chords are infinitely many, yet each of them is a diameter, and about all other chords this option says nothing. The general condition is different: perpendicularity.') },
  ],
  wrongText: L(
    "Shart vatarning uzunligida emas, diametrning YO'NALISHIDA: u vatarga tik turishi kerak.",
    'Условие не в длине хорды, а в НАПРАВЛЕНИИ диаметра: он должен стоять прямо к хорде.',
    'The condition is not the length of the chord but the DIRECTION of the diameter: it must stand square to the chord.'),
};

export default function D49_03(props) { return <Choice data={DATA} {...props} />; }
