// Dars12 · Amaliyot 07 — Saralash · 🟡 · teg: qoshish-orqali-yoqotish-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: berilgan birinchi tenglamaga QO'SHILGANDA nima
// yo'qoladi. Birinchi tenglama `given` da turadi, kartochkalar esa faqat
// ikkinchi tenglamalar — shu bilan kartochka qisqa qoladi va telefonda
// ham sig'adi.
//
// TEKSHIRUV. x + 2y = 9 ga qo'shsak:
//   x − 2y = 1   -> 2x = 10, igrek yo'qoldi
//   3x − 2y = 5  -> 4x = 14, igrek yo'qoldi
//   −x + 4y = 3  -> 6y = 12, iks yo'qoldi
//   −x + y = 2   -> 3y = 11, iks yo'qoldi
//   2x + 3y = 8  -> 3x + 5y = 17, hech nima yo'qolmadi
//   x + 5y = 7   -> 2x + 7y = 16, hech nima yo'qolmadi
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'qoshish-orqali-yoqotish-notogri', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har bir yozuvni yuqoridagi tenglamaga QO'SHIB ko'ring: nima yo'qoladi?",
    'Прибавь каждую запись к уравнению сверху: что исчезнет?',
    'Add each record to the equation above: what vanishes?'),
  ask: L(
    'Yozuvni bosing, keyin guruhni bosing.',
    'Нажми запись, потом нажми группу.',
    'Tap a record, then tap a group.'),
  itemSize: 16,
  givenLabel: L('Birinchi tenglama', 'Первое уравнение', 'First equation'),
  given: [['x + 2y = 9']],
  zones: [
    { id: 'a', label: L("Igrek yo'qoladi", 'Игрек исчезает', 'y vanishes') },
    { id: 'b', label: L("Iks yo'qoladi", 'Икс исчезает', 'x vanishes') },
    { id: 'c', label: L("Hech nima yo'qolmaydi", 'Ничего не исчезает', 'Nothing vanishes') },
  ],
  items: [
    { id: 'i1', tokens: ['x − 2y = 1'], zone: 'a' },
    { id: 'i2', tokens: ['3x − 2y = 5'], zone: 'a' },
    { id: 'i3', tokens: ['−x + 4y = 3'], zone: 'b' },
    { id: 'i4', tokens: ['−x + y = 2'], zone: 'b' },
    { id: 'i5', tokens: ['2x + 3y = 8'], zone: 'c' },
    { id: 'i6', tokens: ['x + 5y = 7'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Birinchi guruhda igrekning koeffitsienti ikki, ishorasi esa qarama-qarshi — ikki igrek bilan minus ikki igrek nol beradi, iksning koeffitsienti esa ahamiyatsiz. Ikkinchi guruhda iks minus ishorada va koeffitsienti bir, ya'ni yuqoridagi iks bilan yo'qoladi. Uchinchi guruhda esa har ikkala o'zgaruvchi ham bir xil ishorada yoki koeffitsientlari teng emas, shuning uchun qo'shish soddalashtirmaydi — bunday sistemani avval songa ko'paytirish kerak.",
    'Верно. В первой группе коэффициент игрека равен двум, а знак противоположный — два игрека и минус два игрека дают нуль, коэффициент икса при этом не важен. Во второй группе икс стоит с минусом и коэффициентом один, то есть исчезает вместе с иксом сверху. А в третьей группе обе переменные либо с одинаковым знаком, либо с неравными коэффициентами, поэтому сложение не упрощает — такую систему сначала умножают на число.',
    'Correct. In the first group y has coefficient two with the opposite sign — two y and minus two y give zero, and the coefficient of x does not matter. In the second group x carries a minus with coefficient one, so it vanishes together with the x above. In the third group both variables either share a sign or have unequal coefficients, so adding does not simplify — such a system must first be multiplied by a number.'),
  wrongs: [
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu yozuvlarda hech nima yo'qolmaydi. Ikki iks qo'shuv uch igrekni yuqoridagi tenglamaga qo'shsangiz, uch iks qo'shuv besh igrek qoladi — ikkita o'zgaruvchi ham joyida.",
      'В этих записях ничего не исчезает. Прибавив два икса плюс три игрека к уравнению сверху, получишь три икса плюс пять игреков — обе переменные на месте.',
      'Nothing vanishes in these records. Adding two x plus three y to the equation above leaves three x plus five y — both variables are still there.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu yerda igrek emas, IKS yo'qoladi: minus iks bilan yuqoridagi qo'shuv iks nol beradi. Igreklarning ishorasi esa bir xil, ular qo'shiladi.",
      'Здесь исчезает не игрек, а ИКС: минус икс и плюс икс сверху дают нуль. А знаки игреков одинаковы, они складываются.',
      'It is not y but X that vanishes here: minus x and the plus x above give zero. The y-terms share a sign, so they add up.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Bu yerda iks yo'qolmaydi: ikkala tenglamada ham u qo'shuv ishorada. Yo'qoladigan narsa igrek — ikki igrek bilan minus ikki igrek.",
      'Здесь икс не исчезает: в обоих уравнениях он с плюсом. Исчезает игрек — два игрека и минус два игрека.',
      'x does not vanish here: it carries a plus in both equations. What vanishes is y — two y and minus two y.') },
    { when: (s) => s.place.i1 === 'c' || s.place.i2 === 'c' || s.place.i3 === 'c' || s.place.i4 === 'c', text: L(
      "Uchinchi guruhga faqat hech nima yo'qolmaydigan yozuvlar tushadi. Bu yozuvda esa bitta o'zgaruvchi qarama-qarshi ishorada va koeffitsienti teng — u yo'qoladi.",
      'В третью группу попадают только записи, где ничего не исчезает. А в этой записи одна переменная стоит с противоположным знаком и равным коэффициентом — она исчезнет.',
      'Only records where nothing vanishes belong to the third group. In this record one variable has the opposite sign and an equal coefficient — it will vanish.') },
  ],
  wrongText: L(
    "Har bir yozuvni yuqoridagi tenglamaga qo'shib, natijani yozib ko'ring. Qaysi o'zgaruvchi nolga aylandi?",
    'Прибавь каждую запись к уравнению сверху и выпиши результат. Какая переменная обратилась в нуль?',
    'Add each record to the equation above and write out the result. Which variable turned into zero?'),
};

export default function D12_07(props) { return <Zones data={DATA} {...props} />; }
