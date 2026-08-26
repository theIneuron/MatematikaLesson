// Dars39 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 7-pozitsiya)
//
// UCH BO'SHLIQ — TA'RIFNING IKKI YARMI VA T3. Bankdagi tuzoqlar:
//   «parallel» ikkinchi bo'shliqqa — З81: ta'rifning ikkinchi yarmini
//     birinchisiga o'xshatib qo'yish, ya'ni parallelogrammni yasash;
//   «teng» birinchisiga — tenglikni parallellik o'rniga qo'yish;
//   «yon tomonidagi» uchinchisiga — o'sha yon tomondagi burchaklar TENG
//     emas, ular 180 gacha to'ldiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Ikki tomoni",
      'Четырёхугольник, у которого две стороны',
      'A quadrilateral whose two sides are') },
    { slot: 0 },
    { text: L(
      ", qolgan ikki tomoni esa",
      ', а две другие', ', and whose other two are') },
    { slot: 1 },
    { text: L(
      "bo'lgan to'rtburchak trapetsiya deyiladi. Teng yonli trapetsiyaning",
      ', называется трапецией. У равнобедренной трапеции углы', ', is called a trapezoid. In an isosceles trapezoid the') },
    { slot: 2 },
    { text: L("burchaklari teng.", 'равны.', 'angles are equal.') },
  ],
  cards: [
    { id: 'w1', label: L('parallel', 'параллельны', 'parallel') },
    { id: 'w2', label: L('parallel emas', 'не параллельны', 'not parallel') },
    { id: 'w3', label: L('asosidagi', 'при основании', 'base') },
    { id: 'w4', label: L('teng', 'равны', 'equal') },
    { id: 'w5', label: L('yon tomonidagi', 'при боковой стороне', 'leg') },
    { id: 'w6', label: L('perpendikulyar', 'перпендикулярны', 'perpendicular') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Trapetsiyaning ta'rifi va teng yonli trapetsiyaning xossasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Определение трапеции и свойство равнобедренной трапеции собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'The definition of the trapezoid and a property of the isosceles trapezoid are gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ta'rif ikki yarimdan iborat, va ikkinchisi birinchisining INKORI: bir juft parallel, ikkinchisi esa parallel emas. Ikkinchi yarim bo'lmasa ta'rif parallelogrammni ham qamrab olardi, ya'ni u eng muhim so'zdir. Uchinchi bo'shliq esa teng yonli trapetsiyaning xossasi: ASOSIDAGI burchaklar teng, ya'ni bitta asosning ikki uchidagi burchaklar. Yon tomondagi burchaklar esa boshqa: ular teng emas, ular bir yuz sakson gradusgacha to'ldiradi, chunki asoslar parallel va yon tomon ularni kesib o'tadi. Ikki xossani ajratish uchun bitta savol yetadi: burchaklar qaysi tomonning ikki uchida turibdi.",
    'Верно. Определение состоит из двух половин, и вторая — ОТРИЦАНИЕ первой: одна пара параллельна, другая не параллельна. Без второй половины определение захватило бы и параллелограмм, то есть это самое важное слово. Третий пропуск — свойство равнобедренной трапеции: равны углы ПРИ ОСНОВАНИИ, то есть углы у двух концов одного основания. А углы при боковой стороне другие: они не равны, они дополняют друг друга до ста восьмидесяти, ведь основания параллельны и боковая сторона их пересекает. Чтобы различить два свойства, достаточно одного вопроса: у концов какой стороны стоят углы.',
    'Correct. The definition has two halves, and the second is the NEGATION of the first: one pair is parallel, the other is not. Without the second half the definition would catch the parallelogram too, so that is its most important word. The third gap is a property of the isosceles trapezoid: the BASE angles are equal, that is, the angles at the two ends of one base. The angles at a leg are different: they are not equal, they add to one hundred eighty, since the bases are parallel and the leg cuts across them. One question tells the two properties apart: at the ends of which side do the angles stand.'),
  wrongs: [
    { when: (s) => s.slots[1] === 'w1', text: L(
      "Ikkinchi bo'shliqqa «parallel» qo'yildi, va o'shanda ta'rif PARALLELOGRAMMNIKI bo'lib qoldi: ikki juft tomon ham parallel. Trapetsiyani ajratadigan narsa aynan INKOR — qolgan juft parallel bo'lmasligi. Bu so'zsiz ta'rif ikki figurani birdan qamrab oladi va hech narsani ajratmaydi.",
      'Во второй пропуск поставлено «параллельны», и определение стало определением ПАРАЛЛЕЛОГРАММА: обе пары сторон параллельны. Трапецию отличает именно ОТРИЦАНИЕ — другая пара не параллельна. Без этого слова определение захватывает сразу две фигуры и ничего не различает.',
      'The second gap was filled with «parallel», and the definition became that of the PARALLELOGRAM: both pairs of sides parallel. What sets the trapezoid apart is precisely the NEGATION — the other pair is not parallel. Without that word the definition catches two figures at once and distinguishes nothing.') },
    { when: (s) => s.slots[0] === 'w4' || s.slots[1] === 'w4', text: L(
      "«Teng» ta'rifga tushmaydi: trapetsiya PARALLELLIK bilan aniqlanadi, tenglik bilan emas. Yon tomonlarning tengligi faqat bitta turni — teng yonli trapetsiyani — beradi, asoslarning tengligi esa figurani parallelogrammga aylantiradi. Ikki xossani ajrating: parallellik ta'rifda, tenglik esa turlarda.",
      '«Равны» в определение не встаёт: трапеция определяется ПАРАЛЛЕЛЬНОСТЬЮ, а не равенством. Равенство боковых сторон даёт лишь один вид — равнобедренную трапецию, а равенство оснований превращает фигуру в параллелограмм. Раздели два свойства: параллельность в определении, равенство в видах.',
      '«Equal» does not fit the definition: a trapezoid is defined by PARALLELISM, not by equality. Equal legs give only one kind — the isosceles trapezoid — while equal bases turn the figure into a parallelogram. Separate the two properties: parallelism belongs to the definition, equality to the kinds.') },
    { when: (s) => s.slots[2] === 'w5', text: L(
      "«Yon tomonidagi» burchaklar TENG emas. Ular bir yuz sakson gradusgacha to'ldiradi, va bu har trapetsiyada shunday — teng yonlisida ham, boshqasida ham, — chunki asoslar parallel va yon tomon ularni kesuvchi bo'ladi. Teng yonli trapetsiyaning xossasi esa ASOSIDAGI burchaklar haqida: bitta asosning ikki uchidagi burchaklar teng.",
      'Углы «при боковой стороне» НЕ равны. Они дополняют друг друга до ста восьмидесяти, и так в любой трапеции — и в равнобедренной, и в другой, — потому что основания параллельны, а боковая сторона служит секущей. Свойство же равнобедренной трапеции про углы ПРИ ОСНОВАНИИ: равны углы у двух концов одного основания.',
      'The angles «at a leg» are NOT equal. They add to one hundred eighty, and so it is in every trapezoid — isosceles or not — because the bases are parallel and the leg acts as a transversal. The property of the isosceles trapezoid concerns the BASE angles: the angles at the two ends of one base are equal.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Perpendikulyar» ta'rifga tushmaydi. Yon tomonlar asosga perpendikulyar bo'lsa, IKKALASI ham perpendikulyar bo'lganda ular bir-biriga parallel bo'lib qoladi va figura to'g'ri to'rtburchakka aylanadi. Faqat bittasi perpendikulyar bo'lsa — bu to'g'ri burchakli trapetsiya, ya'ni yana bitta TUR, ta'rif emas.",
      '«Перпендикулярны» в определение не встаёт. Если боковые перпендикулярны основанию, то при ОБЕИХ перпендикулярных они окажутся параллельны друг другу и фигура станет прямоугольником. Если перпендикулярна лишь одна — это прямоугольная трапеция, то есть ещё один ВИД, а не определение.',
      '«Perpendicular» does not fit the definition. If the legs are perpendicular to the base, then with BOTH perpendicular they become parallel to each other and the figure turns into a rectangle. If only one is perpendicular — that is a right trapezoid, another KIND, not the definition.') },
  ],
  wrongText: L(
    "Ta'rifning ikkinchi yarmi INKOR: qolgan juft parallel emas. Teng yonli trapetsiyada asosidagi burchaklar teng, yon tomondagilar esa 180 gacha to'ldiradi.",
    'Вторая половина определения — ОТРИЦАНИЕ: другая пара не параллельна. В равнобедренной трапеции равны углы при основании, а при боковой стороне дополняют до 180.',
    'The second half of the definition is a NEGATION: the other pair is not parallel. In an isosceles trapezoid the base angles are equal, while those at a leg add to 180.'),
};

export default function D39_07(props) { return <ClozeBank data={DATA} {...props} />; }
