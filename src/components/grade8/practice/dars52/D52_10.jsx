// Dars52 · Amaliyot 10 — Tartib · 🔴 🖼 · tag: inscribed_circle_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 10-pozitsiya)
//
// З110 QURILISHDA: markazni bissektrisasiz belgilash mumkin emas.
// Radiusni markazdan OLDIN o'lchash ham xato — o'lchanadigan joy hali
// yo'q. `expr` da tayyor natija turibdi: punktir bissektrisalar, markaz
// va unga urinuvchi aylana.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'inscribed_circle_steps', level: '🔴',
  expr: [{
    fig: 'circ', w: 108, h: 100, r: 18, cx: 54, cy: 50,
    tang: [80, 190, 320], vnames: ['A', 'B', 'C'], cev: true,
  }],
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['∠A,  ∠B'],
      label: L("ikki burchakning bissektrisasini o'tkazamiz", 'проводим биссектрисы двух углов', 'draw the bisectors of two angles') },
    { id: 'l2', tokens: ['O'],
      label: L('kesishgan nuqta markaz', 'точка пересечения это центр', 'the meeting point is the centre') },
    { id: 'l3', tokens: ['O → AB'],
      label: L('markazdan tomonga perpendikulyar tushiramiz', 'из центра опускаем перпендикуляр на сторону', 'drop a perpendicular from the centre to a side') },
    { id: 'l4', tokens: ['r'],
      label: L('uning uzunligi radius, aylana chiziladi', 'его длина это радиус, чертим окружность', 'its length is the radius, draw the circle') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Uchburchakka ichki aylanani to'rt qadamda quramiz, lekin qadamlar aralashib ketgan. Chizmada tayyor natija turibdi: punktir chiziqlar, markaz va aylana. Uchinchi bissektrisani o'tkazish shart emas — ikkitasi markazni allaqachon beradi.",
    'Вписанную в треугольник окружность строим в четыре шага, но шаги перепутаны. На рисунке готовый результат: пунктирные линии, центр и окружность. Третью биссектрису проводить не обязательно — двух уже достаточно для центра.',
    'We build the circle inscribed in a triangle in four steps, but the steps are mixed up. The drawing shows the finished result: the dashed lines, the centre and the circle. A third bisector is not needed — two already give the centre.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Zanjir uzilmaydi. Avval bissektrisalar o'tkaziladi, chunki markazni boshqa hech narsa bermaydi: aynan bissektrisadagi nuqtalar ikki tomondan teng uzoqlikda yotadi. Keyin ular kesishgan nuqta markaz deb olinadi. Endigina markazdan tomonga perpendikulyar tushirish mumkin bo'ladi, va uning uzunligi radius. Oxirida aylana chiziladi, va u uch tomonga ham urinadi — chunki markaz uchalasidan ham teng uzoqlikda.",
    'Верно. Цепочка не рвётся. Сначала проводятся биссектрисы, ведь центр больше ничем не получить: именно точки на биссектрисе равноудалены от двух сторон. Потом точка их пересечения берётся за центр. Только теперь можно опустить из центра перпендикуляр на сторону, и его длина это радиус. В конце чертится окружность, и она касается всех трёх сторон — ведь центр равноудалён от всех трёх.',
    'Correct. The chain does not break. First the bisectors are drawn, since nothing else gives the centre: it is points on a bisector that are equidistant from two sides. Then their meeting point is taken as the centre. Only now can a perpendicular be dropped from the centre to a side, and its length is the radius. Finally the circle is drawn, and it touches all three sides — because the centre is equidistant from all three.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l2', text: L(
      "Birinchi qadamda markaz turibdi, lekin uni qayerdan olganingiz aytilmagan. Markaz osmondan tushmaydi: u ikki bissektrisaning kesishuvi sifatida PAYDO BO'LADI. Aynan shu qadamni tashlab ketish xatoga olib keladi: o'quvchi markazni «shunchaki o'rtada» deb belgilaydi yoki o'rta perpendikulyarlardan izlaydi.",
      'На первом шаге стоит центр, но откуда он взят, не сказано. Центр не падает с неба: он ПОЯВЛЯЕТСЯ как пересечение двух биссектрис. Пропуск именно этого шага и приводит к ошибке: ученик ставит центр «просто посередине» или ищет его на серединных перпендикулярах.',
      'The first step holds the centre, but nothing says where it came from. The centre does not fall from the sky: it APPEARS as the intersection of two bisectors. Skipping exactly this step leads to the error — the student marks the centre «somewhere in the middle» or looks for it on the perpendicular bisectors.') },
    { when: (s) => s.seq.indexOf('l3') < s.seq.indexOf('l2'), text: L(
      "Perpendikulyar markazdan OLDIN tushirilyapti, ya'ni tushiriladigan nuqta hali yo'q. Perpendikulyar markazdan chiqadi, demak markaz allaqachon belgilangan bo'lishi kerak.",
      'Перпендикуляр опускается РАНЬШЕ центра, то есть точки, из которой опускать, ещё нет. Перпендикуляр выходит из центра, значит центр должен быть уже отмечен.',
      'The perpendicular is dropped BEFORE the centre exists, so there is no point to drop it from. The perpendicular leaves the centre, so the centre must already be marked.') },
    { when: (s) => s.seq.indexOf('l4') < s.seq.indexOf('l3'), text: L(
      "Aylana radius o'lchanmasdan chizilyapti. Ichki aylananing radiusi — markazdan TOMONGACHA bo'lgan masofa, ya'ni perpendikulyarning uzunligi. Uni markazdan uchgacha bo'lgan masofa bilan chalkashtirmaslik kerak: u tashqi aylananing radiusi bo'lardi.",
      'Окружность чертится, не измерив радиус. Радиус вписанной окружности это расстояние от центра до СТОРОНЫ, то есть длина перпендикуляра. Не путай его с расстоянием от центра до вершины: это был бы радиус описанной окружности.',
      'The circle is drawn before the radius is measured. The radius of the inscribed circle is the distance from the centre to a SIDE, that is, the length of the perpendicular. Do not confuse it with the distance from the centre to a vertex: that would be the radius of the circumscribed circle.') },
  ],
  wrongText: L(
    "Bissektrisalar, keyin markaz, keyin perpendikulyar, oxirida aylana.",
    'Биссектрисы, потом центр, потом перпендикуляр, в конце окружность.',
    'The bisectors, then the centre, then the perpendicular, and the circle at the end.'),
};

export default function D52_10(props) { return <SwapOrder data={DATA} {...props} />; }
