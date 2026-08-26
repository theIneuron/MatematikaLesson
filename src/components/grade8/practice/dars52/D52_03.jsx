// Dars52 · Amaliyot 03 — Ha yoki yo'q · 🟢 🖼 · tag: circle_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 3-pozitsiya)
//
// JAVOB: HA, HA (skelet §0a.1). Ikkala da'vo ham ROST, va aynan buni
// o'quvchi kutmaydi: «har qanday» degan so'z shubha uyg'otadi, ustiga
// ikki da'vo yonma-yon turgani «bittasi yolg'on» degan taxminni beradi.
// Chizmalar da'voni ko'rsatadi: birinchisida aylana uchburchak ICHIDA,
// ikkinchisida uchburchak aylana ichida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'circle_claims', level: '🟢',
  itemSize: 13,
  items: [
    // ICHKI aylana: uchburchak tashqarida, aylana uch tomonga urinadi
    { id: 's1', yes: true,
      tokens: [{ fig: 'circ', w: 76, h: 72, r: 13, cx: 38, cy: 36, tang: [80, 190, 320], vnames: ['A', 'B', 'C'] }],
      claim: L("har qanday uchburchakka ichki aylana chizish mumkin", 'в любой треугольник можно вписать окружность', 'a circle can be inscribed in any triangle') },
    // TASHQI aylana: uchburchakning uchlari aylanada
    { id: 's2', yes: true,
      tokens: [{ fig: 'circ', w: 76, h: 72, r: 27, cx: 38, cy: 36, verts: [70, 175, 320], vnames: ['A', 'B', 'C'] }],
      claim: L("har qanday uchburchakka tashqi aylana chizish mumkin", 'вокруг любого треугольника можно описать окружность', 'a circle can be circumscribed about any triangle') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki chizma. Birinchisida aylana uchburchakning ICHIDA turibdi va uch tomoniga ham urinadi. Ikkinchisida uchburchakning uchta uchi ham aylanada yotibdi. Savol shu ikki chizma HAR QANDAY uchburchak uchun chizilishi mumkinmi degani.",
    'Два рисунка. На первом окружность стоит ВНУТРИ треугольника и касается всех трёх сторон. На втором все три вершины треугольника лежат на окружности. Вопрос в том, можно ли построить такие рисунки для ЛЮБОГО треугольника.',
    'Two drawings. In the first the circle sits INSIDE the triangle and touches all three sides. In the second all three vertices of the triangle lie on the circle. The question is whether such drawings can be made for ANY triangle.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the statement is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Sabab bitta: kerakli markaz har doim topiladi. Ichki aylana uchun uch bissektrisa bitta nuqtada kesishadi, va o'sha nuqta uch tomondan ham teng uzoqlikda turadi — demak undan uchala tomonga ham urinadigan aylana chiziladi. Tashqi aylana uchun esa uch o'rta perpendikulyar bitta nuqtada kesishadi, va u uch UCHDAN teng uzoqlikda turadi. Uchburchak qanday cho'zilgan yoki qiya bo'lishidan qat'i nazar, ikkala nuqta ham mavjud.",
    'Верно, оба утверждения истинны. Причина одна: нужный центр находится всегда. Для вписанной окружности три биссектрисы пересекаются в одной точке, и она равноудалена от всех трёх сторон — значит из неё проводится окружность, касающаяся всех сторон. Для описанной три серединных перпендикуляра пересекаются в одной точке, и она равноудалена от трёх ВЕРШИН. Как бы треугольник ни был вытянут или наклонён, обе точки существуют.',
    'Correct, both are true. There is one reason: the needed centre always exists. For the inscribed circle the three angle bisectors meet at one point, and it is equidistant from all three sides — so a circle touching all the sides can be drawn from it. For the circumscribed circle the three perpendicular bisectors meet at one point, and it is equidistant from the three VERTICES. However stretched or slanted the triangle, both points exist.'),
  wrongs: [
    { when: (s) => s.bad.length === 2, text: L(
      "Ikkala da'vo ham ROST, va bu ekranning butun gapi shu. «Har qanday» degan so'z shubha uyg'otadi, lekin bu safar u o'rinli: geometriyada uch bissektrisaning bitta nuqtada kesishishi ham, uch o'rta perpendikulyarning kesishishi ham ISBOTLANGAN. Istisno yo'q, va shuning uchun har uchburchakka ikkala aylanani ham chizish mumkin.",
      'Оба утверждения ВЕРНЫ, и в этом весь смысл экрана. Слово «любой» вызывает подозрение, но на этот раз оно уместно: в геометрии ДОКАЗАНО и то, что три биссектрисы пересекаются в одной точке, и то, что пересекаются три серединных перпендикуляра. Исключений нет, поэтому в каждый треугольник можно вписать и вокруг каждого описать окружность.',
      'Both statements are TRUE, and that is the whole point of this screen. The word «any» invites doubt, but this time it is warranted: geometry PROVES both that the three bisectors meet at one point and that the three perpendicular bisectors meet at one point. There are no exceptions, so every triangle admits both circles.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo ROST. Ichki aylananing markazi bissektrisalar kesishgan nuqta, va u uchburchakning ichida yotadi — har doim, hatto juda o'tmas uchburchakda ham. Shu nuqtadan uch tomongacha bo'lgan masofa bir xil, va o'sha masofa radius bo'ladi.",
      'Первое утверждение ВЕРНО. Центр вписанной окружности это точка пересечения биссектрис, и она лежит внутри треугольника — всегда, даже у очень тупоугольного. Расстояния от неё до трёх сторон одинаковы, и это расстояние и есть радиус.',
      'The first statement is TRUE. The centre of the inscribed circle is where the bisectors meet, and it lies inside the triangle — always, even in a very obtuse one. Its distances to the three sides are equal, and that distance is the radius.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ROST. Tashqi aylananing markazi o'rta perpendikulyarlar kesishgan nuqta. U uchburchakning tashqarisiga chiqib qolishi mumkin — o'tmas uchburchakda shunday bo'ladi — lekin bu aylanani chizishga xalaqit bermaydi: markaz qayerda bo'lishidan qat'i nazar, u uch uchdan teng uzoqlikda turadi.",
      'Второе утверждение ВЕРНО. Центр описанной окружности это точка пересечения серединных перпендикуляров. Он может оказаться вне треугольника — так бывает у тупоугольного — но провести окружность это не мешает: где бы центр ни был, он равноудалён от трёх вершин.',
      'The second statement is TRUE. The centre of the circumscribed circle is where the perpendicular bisectors meet. It may fall outside the triangle — that happens for an obtuse one — but this does not prevent the circle: wherever the centre lies, it is equidistant from the three vertices.') },
  ],
  wrongText: L(
    "Ikkala holatda ham kerakli markaz har doim topiladi: bissektrisalar va o'rta perpendikulyarlar kesishadi.",
    'В обоих случаях нужный центр находится всегда: биссектрисы и серединные перпендикуляры пересекаются.',
    'In both cases the needed centre always exists: the bisectors meet and so do the perpendicular bisectors.'),
};

export default function D52_03(props) { return <TrueFalse data={DATA} {...props} />; }
