// Dars40 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: area_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 2-pozitsiya)
//
// JAVOB: HA, YO'Q (skelet §0a.3). Ikki formula bir-biriga juda o'xshaydi,
// farq esa bitta so'zda: BALANDLIK va TOMON.
//   S = a · h  -> rost
//   S = a · b  -> yolg'on (З83)
// Razbor rad etishni MISOL bilan qiladi: tomonlari o'sha, yuzasi boshqa
// bo'lgan ikki parallelogramm — buni yotqizib ko'rsatish oson.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'area_claims', level: '🟢',
  itemSize: 17,
  items: [
    { id: 's1', yes: true, tokens: ['S = a · h'],
      claim: L('bu formula rost', 'эта формула верна', 'this formula is true') },
    { id: 's2', yes: false, tokens: ['S = a · b'],
      claim: L('bu formula rost', 'эта формула верна', 'this formula is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Parallelogrammning yuzi uchun ikki formula berilgan. Bu yerda a — asos, h — unga mos balandlik, b esa qo'shni TOMON. Ikki yozuv bir-biriga o'xshaydi, lekin ular bir xil emas.",
    'Даны две формулы площади параллелограмма. Здесь a — основание, h — соответствующая высота, а b — соседняя СТОРОНА. Две записи похожи, но они не одно и то же.',
    'Two formulas for the area of a parallelogram are given. Here a is the base, h the matching height, and b the adjacent SIDE. The two records look alike, but they are not the same.'),
  ask: L(
    "Formula rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если формула верна — «Да», если ложна — «Нет».',
    'If the formula is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchi formula rost: yuza asos bilan unga MOS balandlikning ko'paytmasiga teng. Ikkinchisi esa yolg'on, va uni misol bilan rad etish oson. Tomonlari o'n va olti bo'lgan to'g'ri to'rtburchakni oling — uning yuzi oltmish. Endi uni yotqizib qiyalating: tomonlar o'zgarmaydi, ular baribir o'n va olti bo'lib qolaveradi, lekin figura yassilashadi va balandlik kamayadi — masalan to'rtga tushadi. O'shanda yuza qirq bo'ladi, oltmish emas. Ikki tomonning ko'paytmasi o'zgarmadi, yuza esa o'zgardi, demak u yuzani ko'rsatolmaydi. Yuza QIYALIKKA bog'liq, va qiyalikni faqat balandlik tashiydi.",
    'Верно. Первая формула верна: площадь равна произведению основания на СООТВЕТСТВУЮЩУЮ высоту. Вторая ложна, и опровергнуть её легко примером. Возьми прямоугольник со сторонами десять и шесть — его площадь шестьдесят. Теперь наклони его: стороны не изменятся, они так и останутся десять и шесть, но фигура сплющится и высота уменьшится — скажем, до четырёх. Тогда площадь станет сорок, а не шестьдесят. Произведение двух сторон не изменилось, а площадь изменилась, значит показать площадь оно не может. Площадь зависит от НАКЛОНА, а наклон несёт только высота.',
    'Correct. The first formula is true: the area equals the base times the MATCHING height. The second is false, and a single example refutes it. Take a rectangle with sides ten and six — its area is sixty. Now tilt it: the sides do not change, they stay ten and six, but the figure flattens and the height drops — to four, say. Then the area becomes forty, not sixty. The product of the two sides did not change while the area did, so it cannot show the area. Area depends on the TILT, and only the height carries the tilt.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi formula YOLG'ON, va u darsning eng qimmat xatosi. Ikki tomonning ko'paytmasi faqat TO'G'RI TO'RTBURCHAKDA yuzani beradi, chunki u yerda yon tomon aynan balandlikka teng. Qiya parallelogrammda esa yon tomon balandlikdan uzun bo'ladi. Misol: tomonlari o'n va olti bo'lgan figurani qiyalatib boring — tomonlar o'zgarmaydi, yuza esa kamayaveradi va nolga yaqinlashadi.",
      'Вторая формула ЛОЖНА, и это самая дорогая ошибка урока. Произведение двух сторон даёт площадь только у ПРЯМОУГОЛЬНИКА, потому что там боковая сторона в точности равна высоте. А у косого параллелограмма боковая сторона длиннее высоты. Пример: наклоняй фигуру со сторонами десять и шесть — стороны не меняются, а площадь всё уменьшается и стремится к нулю.',
      'The second formula is FALSE, and it is the costliest error of the lesson. The product of two sides gives the area only in a RECTANGLE, because there the side equals the height exactly. In a slanted parallelogram the side is longer than the height. An example: keep tilting a figure with sides ten and six — the sides stay put while the area keeps shrinking towards zero.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi formula ROST — bu darsning asosiy formulasi. Uni ko'rish uchun parallelogrammning bir chetidan uchburchakni kesib olib, ikkinchi chetiga qo'ying: figura to'g'ri to'rtburchakka aylanadi, uning tomonlari esa asos va balandlik bo'ladi. Yuza o'zgarmadi, chunki hech narsa qo'shilmadi va olib tashlanmadi. Demak yuza asos karra balandlikka teng.",
      'Первая формула ВЕРНА — это основная формула урока. Чтобы её увидеть, отрежь с одного края параллелограмма треугольник и приставь к другому: фигура превратится в прямоугольник, стороны которого — основание и высота. Площадь при этом не изменилась, ведь ничего не добавили и не убрали. Значит площадь равна основанию, умноженному на высоту.',
      'The first formula is TRUE — it is the main formula of the lesson. To see it, cut a triangle off one end of the parallelogram and set it against the other: the figure turns into a rectangle whose sides are the base and the height. The area did not change, since nothing was added or taken away. So the area equals the base times the height.') },
  ],
  wrongText: L(
    "Ikki yozuvni bitta harf ajratadi: h — balandlik, b — tomon. Tomonlari o'sha, yuzasi boshqa bo'lgan ikki figurani tasavvur qiling.",
    'Две записи различает одна буква: h — высота, b — сторона. Представь две фигуры с одинаковыми сторонами и разной площадью.',
    'One letter separates the two records: h is the height, b is a side. Picture two figures with the same sides and different areas.'),
};

export default function D40_02(props) { return <TrueFalse data={DATA} {...props} />; }
