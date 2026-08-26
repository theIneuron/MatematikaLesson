// Dars45 · Amaliyot 04 — Juftlash · 🟡 · tag: triple_to_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 4-pozitsiya)
//
// TO'RT UCHLIK, HAR BIRIDA IKKI ISH: tenglik bajariladimi, va bajarilsa
// to'g'ri burchak qaysi tomonga qarshi turadi.
//   9, 12, 15   -> 15
//   7, 24, 25   -> 25
//   4, 5, 7     -> to'g'ri burchak YO'Q (16 + 25 = 41, 49 emas)
//   6, √85, 7   -> √85   (36 + 49 = 85; eng katta tomon ILDIZ bilan yozilgan
//                          va u O'RTADA turadi — З94)
// O'ng ustunda bitta variant SO'Z bilan (`targets[].label`), qolganlari
// belgi bilan — `MatchPairs` ikkisini ham qabul qiladi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'triple_to_side', level: '🟡',
  connect: true,
  targetSize: 18, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['9, 12, 15'] },
    { id: 'm2', tokens: ['7, 24, 25'] },
    { id: 'm3', tokens: ['4, 5, 7'] },
    // eng katta tomon O'RTADA turadi: birinchi ham emas, oxirgi ham emas (З94)
    { id: 'm4', tokens: ['6, ', { r: '85' }, ', 7'] },
  ],
  targets: [
    { id: 't1', tokens: ['15'] },
    { id: 't2', tokens: ['25'] },
    { id: 't3', label: L("to'g'ri burchak yo'q", 'прямого угла нет', 'no right angle') },
    { id: 't4', tokens: [{ r: '85' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt uchlik berilgan. Har birida tekshirish kerak: uchburchak to'g'ri burchaklimi, va agar shunday bo'lsa, to'g'ri burchak qaysi tomonga qarama-qarshi turadi. Bitta uchlikda to'g'ri burchak umuman yo'q.",
    'Даны четыре тройки. В каждой надо проверить: прямоугольный ли треугольник, и если да, против какой стороны лежит прямой угол. В одной тройке прямого угла нет вовсе.',
    'Four triples are given. In each you must check whether the triangle is right-angled, and if so, which side the right angle lies opposite. In one triple there is no right angle at all.'),
  ask: L(
    "Chapdan uchlikni bosing, keyin o'ngdan javobni bosing.",
    'Нажми тройку слева, потом ответ справа.',
    'Tap a triple on the left, then the answer on the right.'),
  correctText: L(
    "To'g'ri. Har uchlikda ish bir xil: eng katta tomonni topib, uning kvadratini qolgan ikkitasining kvadratlari yig'indisi bilan solishtirish. To'qqiz, o'n ikki, o'n besh: sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh — bu o'n besh kvadrat, tenglik bor. Yetti, yigirma to'rt, yigirma besh: qirq to'qqiz qo'shuv besh yuz yetmish olti olti yuz yigirma besh — bu yigirma besh kvadrat. To'rt, besh, yetti: o'n olti qo'shuv yigirma besh qirq bir, yetti kvadrat esa qirq to'qqiz — tenglik yo'q, ya'ni uchburchak to'g'ri burchakli emas. Oxirgi uchlikda esa eng katta tomon ILDIZ bilan yozilgan va u BIRINCHI turmaydi ham, oxirida ham: o'ttiz olti qo'shuv qirq to'qqiz sakson besh, va bu aynan ildiz ostidagi son.",
    'Верно. В каждой тройке работа одна: найти наибольшую сторону и сравнить её квадрат с суммой квадратов двух других. Девять, двенадцать, пятнадцать: восемьдесят один плюс сто сорок четыре — двести двадцать пять, это пятнадцать в квадрате, равенство есть. Семь, двадцать четыре, двадцать пять: сорок девять плюс пятьсот семьдесят шесть — шестьсот двадцать пять, это двадцать пять в квадрате. Четыре, пять, семь: шестнадцать плюс двадцать пять — сорок один, а семь в квадрате сорок девять — равенства нет, треугольник не прямоугольный. А в последней тройке наибольшая сторона записана КОРНЕМ, и стоит она не первой и не последней: тридцать шесть плюс сорок девять — восемьдесят пять, а это ровно число под корнем.',
    'Correct. The work is the same in every triple: find the largest side and compare its square with the sum of the squares of the other two. Nine, twelve, fifteen: eighty one plus one hundred forty four is two hundred twenty five, which is fifteen squared — the equality holds. Seven, twenty four, twenty five: forty nine plus five hundred seventy six is six hundred twenty five, which is twenty five squared. Four, five, seven: sixteen plus twenty five is forty one while seven squared is forty nine — no equality, so the triangle is not right-angled. In the last triple the largest side is written as a ROOT, and it stands neither first nor last: thirty six plus forty nine is eighty five, exactly the number under the root.'),
  wrongs: [
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "Oxirgi uchlikda eng katta tomon ILDIZ bilan yozilgan: ildiz ostida sakson besh to'qqizdan bir oz katta, ya'ni u yettidan ham, oltidan ham katta. Demak gipotenuza aynan shu. Tekshiring: o'ttiz olti qo'shuv qirq to'qqiz sakson besh — tenglik bajariladi, va to'g'ri burchak ildizli tomonga qarshi turadi. Sonning ko'rinishi (ildizli yoki butun) uning kattaligini yashiradi.",
      'В последней тройке наибольшая сторона записана КОРНЕМ: корень из восьмидесяти пяти чуть больше девяти, то есть больше и семи, и шести. Значит гипотенуза именно она. Проверь: тридцать шесть плюс сорок девять — восемьдесят пять, равенство выполняется, и прямой угол лежит против стороны с корнем. Вид числа (корень или целое) скрывает его величину.',
      'In the last triple the largest side is written as a ROOT: the root of eighty five is a little over nine, so it exceeds both seven and six. That is the hypotenuse. Check: thirty six plus forty nine is eighty five — the equality holds and the right angle lies opposite the side with the root. The look of a number (root or whole) hides its size.') },
    { when: (s) => s.pair.m3 && s.pair.m3 !== 't3', text: L(
      "Uchinchi uchlikda tenglik BAJARILMAYDI: o'n olti qo'shuv yigirma besh qirq bir, yetti kvadrat esa qirq to'qqiz. Farq sakkiz, ya'ni uchburchak to'g'ri burchakli emas va to'g'ri burchakka qarshi tomon degan narsa unda yo'q. Bu uchlik shunchaki oddiy uchburchak.",
      'В третьей тройке равенство НЕ выполняется: шестнадцать плюс двадцать пять — сорок один, а семь в квадрате сорок девять. Разница восемь, значит треугольник не прямоугольный, и стороны против прямого угла в нём нет. Эта тройка просто обычный треугольник.',
      'In the third triple the equality does NOT hold: sixteen plus twenty five is forty one while seven squared is forty nine. The gap is eight, so the triangle is not right-angled and it has no side opposite a right angle. That triple is simply an ordinary triangle.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Javob har doim o'sha uchlikning ENG KATTA soni bo'ladi: birinchisida o'n besh, ikkinchisida yigirma besh. Boshqa uchlikning soni javob bo'lolmaydi.",
      'Эти две пары поменялись местами. Ответ всегда НАИБОЛЬШЕЕ число той же тройки: в первой пятнадцать, во второй двадцать пять. Число из другой тройки ответом быть не может.',
      'These two pairs were swapped. The answer is always the LARGEST number of that same triple: fifteen in the first, twenty five in the second. A number from another triple cannot be the answer.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har uchlikda ikki qadam: eng katta sonni toping, keyin tenglikni tekshiring. Tenglik bajarilsa — javob o'sha eng katta son; bajarilmasa — to'g'ri burchak yo'q.",
      'В каждой тройке два шага: найди наибольшее число, потом проверь равенство. Равенство выполнено — ответ это наибольшее число; не выполнено — прямого угла нет.',
      'Two steps in every triple: find the largest number, then check the equality. If it holds, the answer is that largest number; if not, there is no right angle.') },
  ],
  wrongText: L(
    "Eng katta sonni toping — u ildiz bilan yozilgan bo'lishi ham mumkin, — keyin tenglikni tekshiring.",
    'Найди наибольшее число — оно может быть записано и корнем, — потом проверь равенство.',
    'Find the largest number — it may be written as a root — then check the equality.'),
};

export default function D45_04(props) { return <MatchPairs data={DATA} {...props} />; }
