// Dars15 · Amaliyot 06 — Saralash · 🟡 · teg: har-safar-almashadi-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: ko'paytuvchi o'z ildizida ishorani almashtiradimi.
// Uchinchi zona — haqiqiy ildizi yo'q ko'paytuvchilar: ular ishoraga
// umuman ta'sir qilmaydi, chunki hech qachon nolga aylanmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'har-safar-almashadi-deb-oylash', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Har bir ko'paytuvchi o'z ildizida ishora bilan nima qiladi?",
    'Что делает со знаком каждый множитель в своём корне?',
    'What does each factor do to the sign at its own root?'),
  ask: L(
    "Ko'paytuvchini bosing, keyin guruhni bosing.",
    'Нажми множитель, потом нажми группу.',
    'Tap a factor, then tap a group.'),
  itemSize: 16,
  zones: [
    { id: 'a', label: L('Ishora almashadi', 'Знак меняется', 'The sign changes') },
    { id: 'b', label: L('Ishora saqlanadi', 'Знак сохраняется', 'The sign is kept') },
    { id: 'c', label: L("Haqiqiy ildizi yo'q", 'Действительных корней нет', 'No real roots') },
  ],
  items: [
    { id: 'i1', tokens: ['(x − 2)'], zone: 'a' },
    { id: 'i2', tokens: ['(x + 5)'], zone: 'a' },
    { id: 'i3', tokens: ['(x − 2)²'], zone: 'b' },
    { id: 'i4', tokens: ['(x + 5)²'], zone: 'b' },
    { id: 'i5', tokens: ['(x² + 1)'], zone: 'c' },
    { id: 'i6', tokens: ['(x² + 4)'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Birinchi darajali qavs o'z ildizidan o'tganda manfiydan musbatga o'tadi — ishora almashadi. Kvadratda turgan qavs ikki marta uchraydi, ikki marta almashish esa bir-birini bekor qiladi — ishora saqlanadi. Uchinchi guruhdagi yozuvlar hech qachon nolga aylanmaydi va har doim musbat, shuning uchun ular ishoraga umuman ta'sir qilmaydi: o'qqa qo'yiladigan nuqta ham bermaydi.",
    'Верно. Скобка первой степени при переходе через свой корень идёт из минуса в плюс — знак меняется. Скобка в квадрате встречается дважды, а двойная перемена взаимно уничтожается — знак сохраняется. А записи третьей группы никогда не обращаются в нуль и всегда положительны, поэтому на знак они не влияют вовсе: и точки на ось они не дают.',
    'Correct. A first-degree bracket goes from minus to plus across its root — the sign changes. A squared bracket occurs twice, and two flips cancel — the sign is kept. And the records of the third group never become zero and are always positive, so they do not affect the sign at all: they give no point to put on the axis either.'),
  wrongs: [
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu yozuvlar hech qachon nolga aylanmaydi: iks kvadrat manfiy bo'lmaydi, unga musbat son qo'shilsa natija har doim musbat. Ildizi yo'q ko'paytuvchi o'qqa nuqta ham qo'ymaydi.",
      'Эти записи никогда не обращаются в нуль: икс в квадрате не бывает отрицательным, а с прибавленным положительным числом результат всегда положителен. Множитель без корней не ставит на ось и точки.',
      'These records never become zero: x squared is never negative, and with a positive number added the result is always positive. A factor without roots puts no point on the axis either.') },
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu qavs KVADRATDA turibdi, ya'ni ko'paytmada ikki marta uchraydi. Ikki marta almashish ishorani joyiga qaytaradi.",
      'Эта скобка стоит в КВАДРАТЕ, то есть в произведении встречается дважды. Двойная перемена возвращает знак на место.',
      'This bracket is SQUARED, so it occurs twice in the product. Two flips put the sign back where it was.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Bu qavs birinchi darajada: u o'z ildizidan bir marta o'tadi va ishorani almashtiradi. Ikkiga yaqin sonlarni qo'yib ko'ring — birda manfiy, uchda musbat.",
      'Эта скобка первой степени: она проходит через свой корень один раз и меняет знак. Подставь числа около двух — при одном отрицательна, при трёх положительна.',
      'This bracket is of first degree: it passes its root once and flips the sign. Try numbers around two — at one it is negative, at three positive.') },
    { when: (s) => s.place.i1 === 'c' || s.place.i3 === 'c', text: L(
      "Uchinchi guruhga faqat haqiqiy ildizi yo'q yozuvlar tushadi. Bu qavs nolga aylanadi, ya'ni ildizi bor.",
      'В третью группу попадают только записи без действительных корней. Эта скобка обращается в нуль, значит корень у неё есть.',
      'Only records without real roots belong to the third group. This bracket does become zero, so it has a root.') },
  ],
  wrongText: L(
    "Har bir ko'paytuvchiga ikkita savol bering: uning ildizi bormi, va u ko'paytmada nechta marta uchraydi?",
    'Задай каждому множителю два вопроса: есть ли у него корень, и сколько раз он встречается в произведении?',
    'Ask each factor two questions: does it have a root, and how many times does it occur in the product?'),
};

export default function D15_06(props) { return <Zones data={DATA} {...props} />; }
