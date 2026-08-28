// Dars08 · Amaliyot 02 — Nega ODZ · 🟢 · teg: begona-ildizni-qabul-qilish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// Savol MANTIQIY: hisob emas, SABAB so'raladi. Darsning eng qimmat gapi
// shu — maxrajlarga ko'paytirish tenglamani KENGAYTIRADI, ya'ni yangi
// ildizlar paydo bo'lishi mumkin, va ular begona bo'ladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'begona-ildizni-qabul-qilish', level: '🟢',
  correct: 1, optCols: 1,
  eyebrow: L('Nega ODZ', 'Зачем ОДЗ', 'Why the domain'),
  setup: L(
    "Kasr-ratsional tenglama maxrajlarga ko'paytirib yechiladi, oxirida esa javob ODZ bilan solishtiriladi.",
    'Дробно-рациональное уравнение решают умножением на знаменатели, а в конце ответ сверяют с ОДЗ.',
    'A fractional equation is solved by multiplying by the denominators, and at the end the answer is checked against the domain.'),
  ask: L(
    'Nega bu solishtirish kerak?',
    'Зачем нужна эта сверка?',
    'Why is that check needed?'),
  opts: [
    { label: L('Hisobda xato bo\'lishi mumkin.', 'В вычислениях может быть ошибка.', 'There may be a mistake in the arithmetic.') },
    { label: L("Maxrajlarga ko'paytirish yangi ildiz keltirib chiqarishi mumkin.", 'Умножение на знаменатели может добавить новый корень.', 'Multiplying by the denominators can bring in a new root.') },
    { label: L('ODZ javobni chiroyliroq qiladi.', 'ОДЗ делает ответ красивее.', 'The domain makes the answer look tidier.') },
    { label: L('Shunday qabul qilingan.', 'Так принято.', 'It is simply the custom.') },
  ],
  correctText: L(
    "To'g'ri. Maxrajga ko'paytirilganda tenglama KENGAYADI: yangi yozuv asl tenglamada umuman bo'lmagan sonlarda ham bajarilishi mumkin. Aynan shunday son begona ildiz deyiladi. Uni tutadigan yagona narsa — ODZ bilan solishtirish, chunki hisobda hech qanday xato bo'lmasligi ham mumkin.",
    'Верно. При умножении на знаменатель уравнение РАСШИРЯЕТСЯ: новая запись может выполняться и при числах, которых в исходном уравнении не было вовсе. Такое число и называют посторонним корнем. Поймать его может только сверка с ОДЗ — ведь ошибки в вычислениях может и не быть.',
    'Correct. Multiplying by a denominator WIDENS the equation: the new record may hold at numbers that were not in the original at all. Such a number is called an extraneous root. Only the check against the domain catches it — there may be no arithmetic mistake at all.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Hisob mutlaqo to'g'ri bo'lgan holda ham begona ildiz chiqishi mumkin — u xatodan emas, ko'paytirishning o'zidan paydo bo'ladi.",
      'Посторонний корень может появиться и при совершенно верных вычислениях — он берётся не из ошибки, а из самого умножения.',
      'An extraneous root can appear even when the arithmetic is perfectly right — it comes from the multiplication itself, not from a mistake.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu ko'rinish masalasi emas. ODZ dan chetga chiqqan son javob bo'lolmaydi: asl tenglamada u yerda bo'lish umuman ta'riflanmagan.",
      'Дело не во внешнем виде. Число вне ОДЗ не может быть ответом: в исходном уравнении деление там вообще не определено.',
      'This is not about looks. A number outside the domain cannot be an answer: in the original equation the division there is not defined at all.') },
    { when: (s) => s.picked === 3, text: L(
      "Buning aniq sababi bor. Maxrajga ko'paytirish tenglamani o'zgartiradi, va o'zgargan tenglamaning ildizi asl tenglamaniki bo'lmasligi mumkin.",
      'У этого есть точная причина. Умножение на знаменатель меняет уравнение, и корень изменённого уравнения может не быть корнем исходного.',
      'There is a precise reason. Multiplying by a denominator changes the equation, and a root of the changed equation may not be a root of the original one.') },
  ],
  wrongText: L(
    "Maxrajga ko'paytirilgandan keyin yozuvda maxraj qoladimi? Agar qolmasa, yangi yozuv qaysi sonlarda bajarilishi mumkin?",
    'Останется ли знаменатель в записи после умножения на него? Если нет, то при каких числах может выполняться новая запись?',
    'Does the denominator stay in the record after you multiply by it? If not, at which numbers can the new record hold?'),
};

export default function D08_02(props) { return <Choice data={DATA} {...props} />; }
