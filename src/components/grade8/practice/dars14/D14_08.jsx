// Dars14 · Amaliyot 08 — Nechta · 🔴 · tag: count_finite
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 8-pozitsiya)
//
// TAYANCH — O'Z KURSIMIZ: 6-sinf, 15-dars «davriy onli kasrlar», belgisi
// «qisqarmas kasr maxrajida faqat ikki va besh bo'lsa yozuv chekli»
// (`Dars14.jsx` ning shapkasi). Bu yerda belgi olti marta ishlatiladi, ya'ni
// topshiriq bitta savol emas, olti savol — shu sababli 🔴.
//
// Chekli: 1/16 (ikki to'rtinchi darajada), 1/40 (sakkiz karra besh),
//         1/50 (ikki karra yigirma besh).
// Cheksiz: 1/6, 1/9, 1/15 — hammasida maxrajda UCH bor.
// Uchta xato javob uchta yo'l:
//   6 — belgi umuman qo'llanmadi, hammasi chekli deb olindi;
//   2 — 1/40 tashlab ketildi (qirq katta va «notekis» ko'rinadi);
//   4 — 1/15 qo'shib yuborildi (besh bor, lekin uch ham bor).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_finite', level: '🔴',
  target: 3, allowNeg: false,
  expr: [
    { n: '1', d: '16' }, { n: '1', d: '6' }, { n: '1', d: '9' },
    { n: '1', d: '40' }, { n: '1', d: '15' }, { n: '1', d: '50' },
  ], exprSize: 24,
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  // MATN QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — telefonda RU
  // razborining oxiri 55px panel ostida qolardi. Setup ham qisqartirildi.
  setup: L(
    "Oltita kasr. Belgi 6-sinfdan: qisqarmas kasr maxrajida faqat ikki va besh ko'paytuvchilari bo'lsa, onli yozuv tugaydi. Aks holda takrorlanadi.",
    'Шесть дробей. Признак из шестого класса: если в знаменателе несократимой дроби только множители два и пять, десятичная запись заканчивается. Иначе повторяется.',
    'Six fractions. The test from grade six: if the denominator of a reduced fraction holds only twos and fives, the decimal record ends. Otherwise it repeats.'),
  label: L('chekli yozuvlar soni', 'сколько записей конечны', 'how many records end'),
  ask: L(
    "Nechta kasrning onli yozuvi CHEKLI?",
    'У скольких дробей десятичная запись КОНЕЧНА?',
    'How many of the fractions have a decimal record that ENDS?'),
  correctText: L(
    "To'g'ri. Uchtasining maxrajida faqat ikki va besh bor: o'n olti, qirq, ellik. Ularning yozuvi tugaydi — nol butun nol olti ikki besh, nol butun nol ikki besh, nol butun nol ikki. Qolgan uchtasining maxrajida UCH bor: olti, to'qqiz, o'n besh — shu sababli yozuv takrorlanadi.",
    'Верно. У трёх в знаменателе только двойки и пятёрки: шестнадцать, сорок, пятьдесят. Их записи заканчиваются. У остальных трёх в знаменателе есть ТРОЙКА — шесть, девять, пятнадцать — и потому запись повторяется.',
    'Correct. Three of them hold only twos and fives in the denominator: sixteen, forty, fifty. Their records end. The other three have a THREE in the denominator — six, nine, fifteen — so their records repeat.'),
  wrongs: [
    { when: (s) => s.value === 6, text: L(
      "Oltita — bu hamma kasr deganidir, ya'ni belgi qo'llanmadi. Bir oltidan ni bo'lib ko'ring: nol butun bir olti olti olti, oltilar tugamaydi. Maxrajda uch bor bo'lsa yozuv chekli bo'lolmaydi, chunki o'ndan bir, yuzdan bir va shu kabilar uchga bo'linmaydi.",
      'Шесть — это все дроби, то есть признак не применён. Раздели один на шесть: нуль целых один шесть шесть шесть, шестёрки не заканчиваются. Если в знаменателе есть три, запись конечной быть не может: ни десятая, ни сотая на три не делятся.',
      'Six means all of them, so the test was not applied. Divide one by six: zero point one six six six, the sixes never stop. With a three in the denominator the record cannot end, because tenths, hundredths and the rest are not divisible by three.') },
    { when: (s) => s.value === 2, text: L(
      "Bitta chekli kasr tashlab ketilgan — bir qirqdan. Qirqni ko'paytuvchilarga ajratib ko'ring: qirq bu ikki karra ikki karra ikki karra besh, ya'ni faqat ikki va besh. Bo'lib tekshiring: bir bo'lingan qirq nol butun nol ikki besh, yozuv uch xonada tugaydi.",
      'Одна конечная дробь пропущена — одна сороковая. Разложи сорок на множители: сорок это два на два на два на пять, то есть только двойки и пятёрка. Проверь делением: один разделить на сорок это нуль целых двадцать пять тысячных, запись кончается на третьем знаке.',
      'One finite fraction was skipped — one fortieth. Factor forty: forty is two times two times two times five, only twos and a five. Check by dividing: one over forty is zero point zero two five, and the record ends at the third digit.') },
    { when: (s) => s.value === 4, text: L(
      "To'rtta — bu bitta ortiqcha. Ehtimol bir o'n beshdan qo'shildi: maxrajda besh bor, lekin uning yonida UCH ham turadi — o'n besh bu uch karra besh. Bitta uch ham yozuvni cheksiz qiladi: bir bo'lingan o'n besh nol butun nol olti olti olti.",
      'Четыре — это на одну больше. Возможно, добавилась одна пятнадцатая: в знаменателе есть пятёрка, но рядом с ней стоит ТРОЙКА — пятнадцать это три на пять. Одной тройки достаточно, чтобы запись стала бесконечной: один разделить на пятнадцать это нуль целых нуль шесть шесть шесть.',
      'Four is one too many. Likely one fifteenth was included: the denominator has a five, but a THREE stands beside it — fifteen is three times five. A single three is enough to make the record endless: one over fifteen is zero point zero six six six.') },
    { when: (s) => s.value === 0 || s.value === 1, text: L(
      "Chekli yozuv kamdan-kam narsa emas: maxrajda faqat ikki va besh bo'lsa yetadi. O'n olti, qirq va ellikni ko'paytuvchilarga ajratib ko'ring — ularning hech birida uch ham, yetti ham yo'q.",
      'Конечная запись — не редкость: достаточно, чтобы в знаменателе стояли только двойки и пятёрки. Разложи шестнадцать, сорок и пятьдесят на множители — ни в одном нет ни трёх, ни семи.',
      'A finite record is not a rarity: it is enough for the denominator to hold only twos and fives. Factor sixteen, forty and fifty — none of them contains a three or a seven.') },
  ],
  wrongText: L(
    "Har maxrajni ko'paytuvchilarga ajratib ko'ring. Faqat ikki va besh bo'lsa — yozuv tugaydi. Uch, yetti yoki boshqa ko'paytuvchi bo'lsa — takrorlanadi. Shubha bo'lsa bo'lib tekshiring.",
    'Разложи каждый знаменатель на множители. Только двойки и пятёрки — запись закончится. Есть три, семь или другой множитель — будет повторяться. При сомнении проверь делением.',
    'Factor every denominator. Only twos and fives — the record ends. A three, a seven or any other factor — it repeats. When in doubt, check by dividing.'),
};

export default function D14_08(props) { return <TypeValue data={DATA} {...props} />; }
