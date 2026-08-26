// Dars45 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 10-pozitsiya)
//
// TESKARI TEOREMANING TO'LIQ BAYONI. Uchinchi bo'shliq — teoremaning eng
// ko'p tashlab ketiladigan yarmi: to'g'ri burchak QAYERDA turadi (З95).
//
// Kartalar SO'Z, ya'ni `L()` ICHIDA (skelet §0a.4). Bankdagi tuzoqlar:
// «eng kichik» (З94), «ko'paytmasiga», «yopishgan» (З95).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L('Agar uchburchakda', 'Если в треугольнике квадрат', 'If in a triangle the square of the') },
    { slot: 0 },
    { text: L("tomonning kvadrati qolgan ikki tomon kvadratlarining", 'стороны равен', 'side equals the') },
    { slot: 1 },
    { text: L("teng bo'lsa, uchburchak to'g'ri burchakli bo'ladi, va to'g'ri burchak shu tomonga", 'квадратов двух других, треугольник прямоугольный, и прямой угол лежит в вершине', 'of the squares of the other two, the triangle is right-angled, and the right angle sits at the vertex') },
    { slot: 2 },
    { text: L('uchda turadi.', 'этой стороны.', 'that side.') },
  ],
  cards: [
    { id: 'w1', label: L('eng katta', 'наибольшей', 'largest') },
    { id: 'w2', label: L("yig'indisiga", 'сумме', 'sum') },
    { id: 'w3', label: L('qarama-qarshi', 'против', 'opposite') },
    { id: 'w4', label: L('eng kichik', 'наименьшей', 'smallest') },
    { id: 'w5', label: L("ko'paytmasiga", 'произведению', 'product') },
    { id: 'w6', label: L('yopishgan', 'при', 'adjacent to') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Teskari teoremaning bayoni yozilgan, lekin uchta so'z tushib qolgan. Uchinchi bo'shliq alohida diqqat talab qiladi: u to'g'ri burchakning JOYINI aytadi.",
    'Записана формулировка обратной теоремы, но три слова выпали. Третий пропуск требует особого внимания: он говорит о МЕСТЕ прямого угла.',
    'The statement of the converse theorem is written down, but three words fell out. The third gap needs special care: it says WHERE the right angle sits.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Teorema uch narsani belgilaydi. Birinchisi — QAYSI tomon tekshiriladi: eng katta, chunki faqat u gipotenuza bo'lishi mumkin. Ikkinchisi — QANDAY amal: kvadratlarning yig'indisi. Uchinchisi — natijaning tafsiloti: to'g'ri burchak shu eng katta tomonga QARAMA-QARSHI uchda turadi. Uchinchi qism ko'pincha tashlab ketiladi, va o'shanda javob yarim bo'lib qoladi: uchburchak to'g'ri burchakli deb aytiladi, lekin burchak qayerda ekani ko'rsatilmaydi yoki noto'g'ri uchga qo'yiladi.",
    'Верно. Теорема задаёт три вещи. Первая — КАКАЯ сторона проверяется: наибольшая, ведь только она может быть гипотенузой. Вторая — КАКОЕ действие: сумма квадратов. Третья — уточнение результата: прямой угол лежит в вершине ПРОТИВ этой наибольшей стороны. Третью часть часто пропускают, и тогда ответ остаётся половинчатым: треугольник называют прямоугольным, но где угол, не указывают или ставят его не в ту вершину.',
    'Correct. The theorem settles three things. First, WHICH side is tested: the largest, since only it can be the hypotenuse. Second, WHICH operation: the sum of the squares. Third, the detail of the result: the right angle sits at the vertex OPPOSITE that largest side. The third part is often dropped, and then the answer stays half finished: the triangle is called right-angled but where the angle is goes unsaid, or it is placed at the wrong vertex.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«Eng kichik» tekshiruvni ishlamas holga keltiradi: eng kichik tomonning kvadrati qolgan ikkitasining yig'indisidan har doim kichik bo'ladi, ya'ni tenglik hech qachon chiqmaydi. Uch, to'rt, besh uchligida ko'ring: to'qqiz o'n olti qo'shuv yigirma beshdan ancha kichik.",
      '«Наименьшей» делает проверку неработающей: квадрат наименьшей стороны всегда меньше суммы квадратов двух других, то есть равенства не выйдет никогда. Посмотри на тройке три, четыре, пять: девять заметно меньше, чем шестнадцать плюс двадцать пять.',
      'Smallest makes the check useless: the square of the smallest side is always less than the sum of the squares of the other two, so equality never appears. Look at the triple three, four, five: nine is far less than sixteen plus twenty five.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Yopishgan» to'g'ri burchakni NOTO'G'RI uchga qo'yadi. Eng katta tomonga yopishgan ikki uchda o'tkir burchaklar turadi: ularning yig'indisi to'qsonga teng. To'g'ri burchak esa uchinchi uchda, ya'ni eng katta tomonning QARSHISIDA. Chizmada ko'ring: gipotenuzaning ikki uchida to'g'ri burchak bo'lolmaydi.",
      '«При» ставит прямой угол НЕ в ту вершину. В двух вершинах при наибольшей стороне стоят острые углы: их сумма равна девяноста. А прямой угол в третьей вершине, то есть ПРОТИВ наибольшей стороны. Посмотри на чертёж: в двух концах гипотенузы прямого угла быть не может.',
      'Adjacent puts the right angle at the WRONG vertex. The two vertices at the ends of the largest side carry the acute angles: they sum to ninety. The right angle is at the third vertex, OPPOSITE the largest side. Look at a drawing: the two ends of the hypotenuse cannot hold a right angle.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Ko'paytma teoremaning amali emas. Uch, to'rt, besh uchligida tekshiring: kvadratlarning ko'paytmasi to'qqiz karra o'n olti, ya'ni bir yuz qirq to'rt — bu yigirma beshga hech qanday aloqasi yo'q. Teorema kvadratlarni QO'SHADI.",
      'Произведение — не действие теоремы. Проверь на тройке три, четыре, пять: произведение квадратов девять на шестнадцать, то есть сто сорок четыре — к двадцати пяти это никакого отношения не имеет. Теорема квадраты СКЛАДЫВАЕТ.',
      'A product is not the operation of the theorem. Check on the triple three, four, five: the product of the squares is nine times sixteen, one hundred forty four — nothing to do with twenty five. The theorem ADDS the squares.') },
    { when: (s) => s.slots[0] === 'w4' && s.slots[2] === 'w6', text: L(
      "Ikki bo'shliq ham teskari tanlangan, va ikkalasi bir xil sababdan: gipotenuza eng katta tomon, va to'g'ri burchak unga qarshi turadi. Bu ikki fakt bir-biriga bog'langan — birinchisini buzsangiz, ikkinchisi ham buziladi.",
      'Оба пропуска выбраны наоборот, и по одной причине: гипотенуза — наибольшая сторона, и прямой угол лежит против неё. Эти два факта связаны — нарушив первый, нарушишь и второй.',
      'Both gaps were filled the wrong way round, and for one reason: the hypotenuse is the largest side and the right angle lies opposite it. The two facts are linked — break the first and the second breaks too.') },
  ],
  wrongText: L(
    "Uch bo'shliq: qaysi tomon tekshiriladi, qanday amal bajariladi, va to'g'ri burchak qayerda turadi.",
    'Три пропуска: какая сторона проверяется, какое действие выполняется и где стоит прямой угол.',
    'Three gaps: which side is tested, which operation is done, and where the right angle sits.'),
};

export default function D45_10(props) { return <ClozeBank data={DATA} {...props} />; }
