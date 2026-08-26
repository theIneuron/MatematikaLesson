// Dars52 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 8-pozitsiya)
//
// Uch tasdiq bitta gapga yig'ilgan. Bankdagi tuzoqlar:
//   ikki markazni ALMASHTIRISH  -> З110
//   «teng»                      -> З111 ning so'z bilan aytilgani
//   «balandliklar»              -> uchinchi yo'l
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Ichki aylananing markazi",
      'Центр вписанной окружности это точка пересечения',
      'The centre of the inscribed circle is where the') },
    { slot: 0 },
    { text: L(
      "kesishgan nuqta, tashqi aylananiki esa",
      ', а центр описанной это точка пересечения', 'meet, and the centre of the circumscribed circle is where the') },
    { slot: 1 },
    { text: L(
      "kesishgan nuqta. Ichki chizilgan to'rtburchakning qarama-qarshi burchaklari",
      '. А противоположные углы вписанного четырёхугольника', '. And the opposite angles of an inscribed quadrilateral') },
    { slot: 2 },
    { text: L("gradusni to'ldiradi.", 'градусов.', 'degrees.') },
  ],
  cards: [
    { id: 'w1', label: L('bissektrisalar', 'биссектрис', 'angle bisectors') },
    { id: 'w2', label: L("o'rta perpendikulyarlar", 'серединных перпендикуляров', 'perpendicular bisectors') },
    { id: 'w3', label: L('180', 'в сумме дают 180', 'add up to 180') },
    { id: 'w4', label: L('balandliklar', 'высот', 'altitudes') },
    { id: 'w5', label: L('medianalar', 'медиан', 'medians') },
    { id: 'w6', label: L('teng, ular 90', 'равны, они по 90', 'are equal, at 90') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uchala tasdig'i bitta gapga yig'ilgan, lekin uchta bo'lak tushib qolgan. Bankda oltita karta. Diqqat: birinchi ikki bo'shliq bir-biriga juda o'xshaydi, va ularni almashtirib qo'yish oson.",
    'Все три утверждения урока собраны в одно предложение, но три куска выпали. В банке шесть карточек. Внимание: первые два пропуска очень похожи, и поменять их местами легко.',
    'All three statements are gathered into one sentence, but three pieces have dropped out. The bank holds six cards, and the first two gaps are easy to swap.'),
  ask: L(
    "Bo'sh joyni bosing, keyin kartani bosing.",
    'Нажми пропуск, потом карточку.',
    'Tap a gap, then a card.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki markazni ajratish uchun bitta savol yetadi: aylana NIMAGA tegadi. Ichki aylana TOMONLARGA urinadi, demak markaz tomonlardan teng uzoqlikda bo'lishi kerak, va bunday nuqtalar bissektrisada yotadi. Tashqi aylana esa UCHLARDAN o'tadi, demak markaz uchlardan teng uzoqlikda, va bunday nuqtalar o'rta perpendikulyarda yotadi. Uchinchi bo'lak esa burchaklar haqida: ular teng emas, birga bir yuz saksonni to'ldiradi.",
    'Верно. Чтобы различить два центра, хватает одного вопроса: чего КАСАЕТСЯ окружность. Вписанная касается СТОРОН, значит центр равноудалён от сторон, а такие точки лежат на биссектрисе. Описанная проходит через ВЕРШИНЫ, значит центр равноудалён от вершин, а такие точки лежат на серединном перпендикуляре. Третий кусок про углы: они не равны, а вместе дают сто восемьдесят.',
    'Correct. One question is enough to tell the two centres apart: what does the circle TOUCH. The inscribed circle touches the SIDES, so the centre is equidistant from the sides, and such points lie on a bisector. The circumscribed circle passes through the VERTICES, so the centre is equidistant from the vertices, and such points lie on a perpendicular bisector. The third piece is about the angles: they are not equal, together they make a hundred and eighty.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Ikki markaz almashib ketdi, va bu darsning eng qimmat xatosi. Eslab qolish uchun bitta belgi: bissektrisa TOMONLARdan teng uzoqlikni beradi, o'rta perpendikulyar esa UCHLARdan. Ichki aylana tomonlarga tegadi — demak bissektrisa. Tashqi aylana uchlardan o'tadi — demak o'rta perpendikulyar.",
      'Два центра поменялись местами, и это самая дорогая ошибка урока. Запоминается по одному признаку: биссектриса даёт равное расстояние до СТОРОН, а серединный перпендикуляр — до ВЕРШИН. Вписанная окружность касается сторон — значит биссектриса. Описанная проходит через вершины — значит серединный перпендикуляр.',
      'The two centres swapped places, and this is the costliest error of the lesson. One mark makes it stick: a bisector gives equal distance to the SIDES, a perpendicular bisector to the VERTICES. The inscribed circle touches the sides — so a bisector. The circumscribed circle passes through the vertices — so a perpendicular bisector.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Uchinchi bo'lakda «teng» turibdi. Ichki chizilgan to'rtburchakda qarama-qarshi burchaklar teng emas, ular bir yuz saksongacha TO'LDIRADI. Tenglik parallelogrammda bo'ladi, va aynan shu ikki qoida bir-biriga chalkashtiriladi. Ular teng bo'ladigan holat bitta: ikkalasi ham to'g'ri burchak.",
      'В третьем куске стоит «равны». У вписанного четырёхугольника противоположные углы не равны, они ДОПОЛНЯЮТ друг друга до ста восьмидесяти. Равенство бывает у параллелограмма, и именно эти два правила путают. Равны они только в одном случае: если оба прямые.',
      'The third piece says «are equal». In an inscribed quadrilateral opposite angles are not equal, they COMPLETE each other to a hundred and eighty. Equality belongs to the parallelogram, and these two rules are exactly the ones that get confused. They are equal in one case only: when both are right angles.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1, text: L(
      "Balandliklar ham, medianalar ham bitta nuqtada kesishadi, lekin bu nuqtalar hech qanday aylananing markazi emas. Markazga kerak bo'lgan narsa bitta: uch tomondan yoki uch uchdan TENG UZOQLIK. Buni faqat bissektrisa va o'rta perpendikulyar beradi.",
      'Высоты и медианы тоже пересекаются в одной точке, но эти точки не центры никакой окружности. Центру нужно одно: РАВНОЕ РАССТОЯНИЕ до трёх сторон или до трёх вершин. Это дают только биссектриса и серединный перпендикуляр.',
      'Altitudes and medians also meet at a point, but those points are not the centre of any circle. A centre needs one thing: EQUAL DISTANCE to the three sides or to the three vertices. Only the bisector and the perpendicular bisector provide that.') },
  ],
  wrongText: L(
    "Bitta savol ajratadi: aylana tomonlarga tegadimi yoki uchlardan o'tadimi.",
    'Различает один вопрос: окружность касается сторон или проходит через вершины.',
    'One question tells them apart: does the circle touch the sides or pass through the vertices.'),
};

export default function D52_08(props) { return <ClozeBank data={DATA} {...props} />; }
