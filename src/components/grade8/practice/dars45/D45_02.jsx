// Dars45 · Amaliyot 02 — Belgilash · 🟢 · tag: impossible_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 2-pozitsiya)
//
// T1: to'g'ri burchakli uchburchakda istalgan katet gipotenuzadan KICHIK.
// Shuning uchun uchta yozuv umuman mumkin emas: katet gipotenuzadan katta
// (ikki holat) yoki unga teng (bir holat).
//
// Chegara holati ATAYLAB kiritildi: `c=8, a=8`. Tenglik ham mumkin emas,
// chunki o'shanda ikkinchi katetning kvadrati nolga aylanadi va uchburchak
// yo'qoladi. Qabul qilinadigan uchtasining biri chegaraga juda yaqin:
// `c=25, a=24` — mumkin, va bu 7-24-25 uchligi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'impossible_marked', level: '🟢',
  col: 128, itemSize: 17,
  items: [
    { id: 'i1', hit: true, tokens: ['c=10, a=12'] },
    { id: 'i2', tokens: ['c=13, a=5'] },
    { id: 'i3', hit: true, tokens: ['c=8, a=8'] },
    { id: 'i4', tokens: ['c=17, a=15'] },
    { id: 'i5', hit: true, tokens: ['c=6, a=9'] },
    { id: 'i6', tokens: ['c=25, a=24'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Olti yozuv, har birida to'g'ri burchakli uchburchakning gipotenuzasi va bitta kateti berilgan. Ba'zi yozuvlar mumkin, ba'zilari esa umuman bo'lolmaydi.",
    'Шесть записей, в каждой даны гипотенуза и один катет прямоугольного треугольника. Некоторые записи возможны, а некоторых не может быть вовсе.',
    'Six records, each giving the hypotenuse and one leg of a right triangle. Some records are possible, others cannot exist at all.'),
  ask: L(
    "MUMKIN BO'LMAGAN 3 ta yozuvni belgilang.",
    'Отметь 3 записи, которых быть НЕ МОЖЕТ.',
    'Mark the 3 records that are IMPOSSIBLE.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Qoida bitta: katet gipotenuzadan har doim KICHIK bo'ladi. Nima uchun shunday: gipotenuzaning kvadrati ikki katetning kvadratlari yig'indisiga teng, ya'ni u har bir katetning kvadratidan katta — ikkinchi katetning kvadrati qo'shilib turadi va u noldan katta. Belgilanganlarning ikkitasida katet gipotenuzadan katta (o'n ikki o'ndan katta, to'qqiz oltidan katta), uchinchisida esa TENG — bu ham mumkin emas, chunki o'shanda ikkinchi katetning kvadrati nolga aylanadi va uchburchak kesmaga aylanib qoladi. Qabul qilinganlarning biri chegaraga juda yaqin: yigirma besh va yigirma to'rt, ikkinchi katet yetti — bu darslikdagi uchlik.",
    'Верно. Правило одно: катет всегда МЕНЬШЕ гипотенузы. Почему так: квадрат гипотенузы равен сумме квадратов катетов, то есть он больше квадрата каждого катета — к нему прибавляется квадрат второго катета, а он больше нуля. У двух отмеченных катет больше гипотенузы (двенадцать больше десяти, девять больше шести), у третьей он РАВЕН — этого тоже быть не может, ведь тогда квадрат второго катета обращается в нуль и треугольник превращается в отрезок. Одна из принятых записей совсем близко к границе: двадцать пять и двадцать четыре, второй катет семь — это тройка из учебника.',
    'Correct. There is one rule: a leg is always LESS than the hypotenuse. Why: the square of the hypotenuse equals the sum of the squares of the legs, so it exceeds the square of each leg — the square of the other leg is added on, and that is greater than zero. Two of the marked records have a leg longer than the hypotenuse (twelve over ten, nine over six); the third has them EQUAL — impossible too, since then the square of the other leg becomes zero and the triangle collapses into a segment. One accepted record sits very close to the line: twenty five and twenty four, the other leg seven — the triple from the textbook.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Tenglik holati chetlab o'tildi, lekin u ham mumkin emas. Agar katet gipotenuzaga teng bo'lsa, ikkinchi katetning kvadrati oltmish to'rt minus oltmish to'rt, ya'ni nol bo'ladi. Nol uzunlikdagi tomon esa yo'q: uchburchak yopilmaydi va kesmaga aylanadi.",
      'Случай равенства пропущен, а он тоже невозможен. Если катет равен гипотенузе, квадрат второго катета равен шестьдесят четыре минус шестьдесят четыре, то есть нулю. А стороны нулевой длины не бывает: треугольник не замыкается и становится отрезком.',
      'The case of equality was skipped, yet it is impossible too. If a leg equals the hypotenuse, the square of the other leg is sixty four minus sixty four, that is zero. A side of zero length does not exist: the triangle fails to close and becomes a segment.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yozuv chegaraga yaqin, lekin MUMKIN: yigirma to'rt yigirma beshdan kichik. Ikkinchi katetni hisoblang: olti yuz yigirma besh minus besh yuz yetmish olti qirq to'qqiz, ildizi yetti. Yetti, yigirma to'rt, yigirma besh — darslikda keltirilgan Pifagor uchligi.",
      'Эта запись близка к границе, но ВОЗМОЖНА: двадцать четыре меньше двадцати пяти. Посчитай второй катет: шестьсот двадцать пять минус пятьсот семьдесят шесть — сорок девять, корень семь. Семь, двадцать четыре, двадцать пять — пифагорова тройка из учебника.',
      'This record is close to the line but POSSIBLE: twenty four is less than twenty five. Compute the other leg: six hundred twenty five minus five hundred seventy six is forty nine, the root is seven. Seven, twenty four, twenty five — a Pythagorean triple from the textbook.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu yozuvlarda katet gipotenuzadan kichik, ya'ni ular mumkin. Ikkinchi katetni topish oson: bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki; ikki yuz sakson to'qqiz minus ikki yuz yigirma besh oltmish to'rt, ildizi sakkiz.",
      'В этих записях катет меньше гипотенузы, значит они возможны. Второй катет находится легко: сто шестьдесят девять минус двадцать пять — сто сорок четыре, корень двенадцать; двести восемьдесят девять минус двести двадцать пять — шестьдесят четыре, корень восемь.',
      'In these records the leg is less than the hypotenuse, so they are possible. The other leg is easy to find: one hundred sixty nine minus twenty five is one hundred forty four, root twelve; two hundred eighty nine minus two hundred twenty five is sixty four, root eight.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har biriga bitta savol bering: katet gipotenuzadan kichikmi? Kichik bo'lsa — mumkin; katta yoki teng bo'lsa — mumkin emas.",
      'Нужно ровно три записи. К каждой задай один вопрос: катет меньше гипотенузы? Меньше — возможно; больше или равен — невозможно.',
      'Exactly three records are needed. Ask one question of each: is the leg less than the hypotenuse? Less means possible; greater or equal means impossible.') },
  ],
  wrongText: L(
    "Katet gipotenuzadan KICHIK bo'lishi shart. Tenglik ham mumkin emas: o'shanda ikkinchi katet nolga aylanadi.",
    'Катет ОБЯЗАН быть меньше гипотенузы. Равенство тоже невозможно: тогда второй катет обращается в нуль.',
    'A leg MUST be less than the hypotenuse. Equality is impossible too: the other leg would become zero.'),
};

export default function D45_02(props) { return <MarkAll data={DATA} {...props} />; }
