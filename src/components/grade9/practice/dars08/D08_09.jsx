// Dars08 · Amaliyot 09 — Tartib · 🔴 · teg: yechim-yoq-holati
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// ODZ BIRINCHI qadam, oxirgisi emas: u yechishdan oldin yoziladi va
// oxirida u bilan solishtiriladi. Zanjir shu ikki uchni bog'laydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'yechim-yoq-holati', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют одну цепочку решения.',
    'Five steps are shuffled. Together they make one chain of solution.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 15,
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [[{ n: '8', d: 'x − 1' }, '= 4']],
  lines: [
    { id: 'c1', label: L('ODZ:', 'ОДЗ:', 'Domain:'), tokens: ['x ≠ 1'] },
    { id: 'c2', label: L(
      "Ikkala tomonni x − 1 ga ko'paytiramiz",
      'Умножаем обе части на x − 1',
      'Multiply both sides by x − 1') },
    { id: 'c3', tokens: ['8 = 4(x − 1)'] },
    { id: 'c4', tokens: ['x = 3'] },
    { id: 'c5', label: L(
      "ODZ bilan solishtiramiz: 3 ≠ 1, ildiz mos",
      'Сверяем с ОДЗ: 3 ≠ 1, корень подходит',
      'Check against the domain: 3 ≠ 1, the root fits') },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. ODZ birinchi qadam: u yechishdan OLDIN yoziladi, chunki keyin maxraj yozuvdan yo'qoladi va taqiqni eslab qolish imkonsiz bo'lib qoladi. Oxirgi qadam esa o'sha ODZ ga qaytadi. Agar ildiz taqiqlangan songa tushib qolganida, javob «yechim yo'q» bo'lardi — bu ham to'liq javob.",
    'Верно. ОДЗ — первый шаг: его выписывают ДО решения, потому что потом знаменатель из записи исчезнет и запрет уже не вспомнишь. А последний шаг возвращается к этому же ОДЗ. Если бы корень совпал с запрещённым числом, ответом было бы «решений нет» — и это тоже полный ответ.',
    'Correct. The domain is the first step: it is written BEFORE solving, because afterwards the denominator disappears from the record and the ban can no longer be recalled. The last step returns to that same domain. Had the root fallen on the banned number, the answer would be "no solution" — and that is a complete answer too.'),
  wrongs: [
    { when: (s) => s.seq[0] !== 'c1', text: L(
      "ODZ yechishdan oldin yoziladi. Maxrajga ko'paytirgandan keyin u yozuvdan yo'qoladi — taqiqni keyin qayerdan eslaysiz?",
      'ОДЗ выписывают до решения. После умножения на знаменатель он исчезает из записи — откуда потом вспомнить запрет?',
      'The domain is written before solving. After multiplying by the denominator it vanishes from the record — where would you recall the ban from?') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Bu qator ko'paytirishning natijasi. Ko'paytirish e'lon qilinmasdan, maxrajsiz yozuv qayerdan chiqadi?",
      'Эта строка — результат умножения. Откуда возьмётся запись без знаменателя, если умножение ещё не объявлено?',
      'This line is the result of the multiplication. Where would a record without a denominator come from if the multiplication has not been announced?') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Ildiz maxrajsiz tenglamadan chiqadi. Uni yechmasdan iks uchga teng deb qayerdan aytasiz?",
      'Корень получается из уравнения без знаменателя. Откуда взять икс равно трём, не решив его?',
      'The root comes from the equation without a denominator. Where would x equals three come from without solving it?') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Solishtirish topilgan ildizni tekshiradi. Ildiz hali topilmagan bo'lsa, nimani solishtirasiz?",
      'Сверка проверяет найденный корень. Если корень ещё не найден, что сверять?',
      'The check tests the root that was found. If the root is not found yet, what would you compare?') },
  ],
  wrongText: L(
    "Zanjirning ikki uchiga qarang: ODZ eng boshida yoziladi va eng oxirida ishlatiladi. Orasidagi uch qadam esa oddiy yechish.",
    'Посмотри на два конца цепочки: ОДЗ выписывают в самом начале и используют в самом конце. А три шага между ними — обычное решение.',
    'Look at the two ends of the chain: the domain is written at the very start and used at the very end. The three steps between are ordinary solving.'),
};

export default function D08_09(props) { return <OrderLines data={DATA} {...props} />; }
