// Dars37 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 5-pozitsiya)
//
// UCH BO'SHLIQ — TA'RIF VA IKKI XOSSA. Bankdagi tuzoqlar:
//   «teng»  birinchi bo'shliqqa — З75: ta'rifda parallellik o'rniga
//           tomonlar tengligi;
//   «180°»  ikkinchi bo'shliqqa — З76: qo'shni burchaklar qoidasini
//           qarama-qarshi burchaklarga qo'llash;
//   «90°»   — hech qayerga tushmaydigan, lekin tanish ko'ringan son.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Qarama-qarshi tomonlari",
      'Четырёхугольник, у которого противоположные стороны',
      'A quadrilateral whose opposite sides are') },
    { slot: 0 },
    { text: L(
      "bo'lgan to'rtburchak parallelogramm deyiladi. Uning qarama-qarshi burchaklari",
      ', называется параллелограммом. Его противоположные углы', ', is called a parallelogram. Its opposite angles are') },
    { slot: 1 },
    { text: L(
      ", bir tomoniga yopishgan burchaklari yig'indisi esa",
      ', а сумма углов, прилежащих к одной стороне,', ', and the sum of the angles at one side is') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('parallel', 'параллельны', 'parallel') },
    { id: 'w2', label: L('teng', 'равны', 'equal') },
    { id: 'w3', label: L('180°', '180°', '180°') },
    { id: 'w4', label: L('perpendikulyar', 'перпендикулярны', 'perpendicular') },
    { id: 'w5', label: L('90°', '90°', '90°') },
    { id: 'w6', label: L('360°', '360°', '360°') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Parallelogrammning ta'rifi va ikki xossasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Определение параллелограмма и два его свойства собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'The definition of the parallelogram and two of its properties are gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ta'rif PARALLELLIKKA tayanadi, tenglikka emas: bu farq muhim, chunki tomonlari teng bo'lgan, lekin parallel bo'lmagan to'rtburchak bor — deltoid. Tomonlarning tengligi esa ta'rifdan CHIQADI, ya'ni u xossa, shart emas: bu ikkisini almashtirish butun mantiqni teskari aylantiradi. Burchaklar haqida ikki boshqa fakt bor va ularni chalkashtirmaslik kerak: qarama-qarshi burchaklar TENG, bir tomonga yopishgan burchaklar esa bir yuz sakson gradusgacha to'ldiradi. Ikkalasi bir vaqtda to'g'ri, lekin ular boshqa juftliklar haqida.",
    'Верно. Определение опирается на ПАРАЛЛЕЛЬНОСТЬ, а не на равенство: различие важно, ведь существует четырёхугольник с равными сторонами, но без параллельности — дельтоид. А равенство сторон СЛЕДУЕТ из определения, то есть это свойство, а не условие: поменять их местами значит перевернуть всю логику. Про углы есть два разных факта, и путать их нельзя: противоположные углы РАВНЫ, а прилежащие к одной стороне дополняют друг друга до ста восьмидесяти градусов. Оба верны одновременно, но говорят о разных парах.',
    'Correct. The definition rests on PARALLELISM, not on equality: the difference matters, since there is a quadrilateral with equal sides and no parallelism — the kite. Equality of sides FOLLOWS from the definition, that is, it is a property, not a condition: swapping the two turns the whole logic upside down. About the angles there are two different facts and they must not be confused: opposite angles are EQUAL, while the angles at one side add to one hundred eighty degrees. Both are true at once, but they speak of different pairs.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2', text: L(
      "Birinchi bo'shliqqa «teng» qo'yildi, va bu ta'rifni buzadi. Tomonlari teng bo'lgan, lekin parallelogramm bo'lmagan to'rtburchak bor — deltoid: unda ikki juft QO'SHNI tomon teng. Ta'rif parallellikni talab qiladi, tomonlarning tengligi esa undan chiqadigan XOSSA. Shart bilan xossani almashtirsangiz, ta'rif boshqa figuralarni ham qamrab oladi.",
      'В первый пропуск поставлено «равны», и это ломает определение. Существует четырёхугольник с равными сторонами, но не параллелограмм — дельтоид: у него равны две пары СОСЕДНИХ сторон. Определение требует параллельности, а равенство сторон — СВОЙСТВО, из него вытекающее. Если поменять условие и свойство местами, определение начнёт захватывать и другие фигуры.',
      'The first gap was filled with «equal», and that breaks the definition. There is a quadrilateral with equal sides that is not a parallelogram — the kite: it has two pairs of equal ADJACENT sides. The definition demands parallelism, while equality of sides is a PROPERTY that follows from it. Swap the condition and the property and the definition starts catching other figures too.') },
    { when: (s) => s.slots[1] === 'w3' || s.slots[2] === 'w2', text: L(
      "Ikki fakt o'rin almashdi. Qarama-qarshi burchaklar TENG — ular bir-biriga qaragan uchlarda turadi. Bir tomonga yopishgan burchaklar esa bir yuz sakson gradusgacha to'ldiradi — ular bitta tomonning ikki uchida turadi. Misolda tekshiring: ∠A oltmish bo'lsa, ∠C ham oltmish, ∠B esa yuz yigirma.",
      'Два факта поменялись местами. Противоположные углы РАВНЫ — они стоят в вершинах, глядящих друг на друга. А углы при одной стороне дополняют друг друга до ста восьмидесяти — они стоят в двух концах одной стороны. Проверь на примере: если ∠A шестьдесят, то ∠C тоже шестьдесят, а ∠B сто двадцать.',
      'The two facts changed places. Opposite angles are EQUAL — they sit at vertices facing each other. The angles at one side add to one hundred eighty — they sit at the two ends of one side. Check on an example: if ∠A is sixty, then ∠C is sixty too and ∠B is one hundred twenty.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "To'qson gradus hech bir bo'shliqqa tushmaydi. Parallelogrammning burchaklari to'g'ri bo'lishi SHART emas — o'shanda u to'g'ri to'rtburchakka aylanadi, va bu boshqa figura. Bir tomonga yopishgan ikki burchak esa birga bir yuz saksonni beradi, to'qsonni emas: to'qson faqat har biri alohida to'g'ri burchak bo'lganda chiqadi.",
      'Девяносто градусов не подходит ни к одному пропуску. Углы параллелограмма прямыми быть НЕ обязаны — тогда он превратится в прямоугольник, а это другая фигура. А два угла при одной стороне дают вместе сто восемьдесят, а не девяносто: девяносто получается, лишь когда каждый из них прямой.',
      'Ninety degrees fits no gap. The angles of a parallelogram need NOT be right — then it becomes a rectangle, which is another figure. And two angles at one side give one hundred eighty together, not ninety: ninety comes only when each of them separately is right.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "«Perpendikulyar» va «uch yuz oltmish» gapga tushadi, lekin ta'rifga to'g'ri kelmaydi. Perpendikulyar tomonlar to'rtburchakni umuman yopolmaydi — qarama-qarshi tomonlar bir-biriga perpendikulyar bo'lolmaydi. Uch yuz oltmish esa TO'RT burchakning yig'indisi, ikkitasiniki emas.",
      '«Перпендикулярны» и «триста шестьдесят» в предложение встают, но определению не отвечают. Перпендикулярные стороны четырёхугольник вообще не замкнут — противоположные стороны не могут быть перпендикулярны друг другу. А триста шестьдесят — это сумма ЧЕТЫРЁХ углов, а не двух.',
      '«Perpendicular» and «three hundred sixty» fit the sentence but not the definition. Perpendicular sides would not close a quadrilateral at all — opposite sides cannot be perpendicular to each other. And three hundred sixty is the sum of FOUR angles, not two.') },
  ],
  wrongText: L(
    "Ta'rif parallellikka tayanadi, tenglik esa undan chiqadi. Qarama-qarshi burchaklar teng, qo'shnilari 180 gacha to'ldiradi.",
    'Определение опирается на параллельность, а равенство из него следует. Противоположные углы равны, соседние дополняют до 180.',
    'The definition rests on parallelism; equality follows from it. Opposite angles are equal, adjacent ones add up to 180.'),
};

export default function D37_05(props) { return <ClozeBank data={DATA} {...props} />; }
