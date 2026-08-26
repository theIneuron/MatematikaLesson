// Dars16 · Amaliyot 04 — Kod · 🟡 · tag: code_largest_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 4-pozitsiya)
//
// З42 NI TO'G'RIDAN-TO'G'RI TEKSHIRADI. Birinchi tenglamaning ildizlari nol
// va minus sakkiz, ya'ni ENG KATTA ildiz — NOL. x ga bo'lib yuborgan o'quvchi
// nolni umuman ko'rmaydi va minus sakkizni yozadi, kod esa boshdan buziladi.
//
// Uch tenglama uch xil: birinchisida ikki ildiz manfiy tomonda, ikkinchisida
// musbat tomonda, uchinchisi esa `ax² + c = 0` turiga o'tadi va plyus-minus
// beradi (З40 shu yerda ham ishlaydi).
// Bankdagi tuzoqlar: −8 (birinchisining ikkinchi ildizi), 8 va 20
// (koeffitsiyentlarning o'zi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_largest_roots', level: '🟡',
  expr: ['t² + 8t = 0', ';', '5t² − 20t = 0', ';', 't² − 25 = 0'], exprSize: 17,
  cards: ['−8', '0', '4', '5', '8', '20'],
  answer: ['0', '4', '5'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tenglamaning har biri ikki ildizga ega. Kodga har tenglamaning ENG KATTA ildizi yoziladi.",
    'В комнате сейф, код трёхзначный. У каждого из трёх уравнений два корня. В код пишется НАИБОЛЬШИЙ корень каждого.',
    'There is a safe in the room and its code has three places. Each of the three equations has two roots. The code takes the LARGEST root of each.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Har tenglamaning eng katta ildizini toping va kodga o'sish tartibida yozing.",
    'Найди наибольший корень каждого уравнения и запиши их в код по возрастанию.',
    'Find the largest root of each equation and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: t karra t qo'shuv sakkiz nolga teng, ildizlari nol va minus sakkiz — eng kattasi NOL, chunki nol har qanday manfiy sondan katta. Ikkinchisi: besh t karra t minus to'rt, ildizlari nol va to'rt — eng kattasi to'rt. Uchinchisi: t kvadrat yigirma beshga teng, ildizlari minus besh va besh — eng kattasi besh. O'sish tartibida: nol, to'rt, besh.",
    'Верно. Первое: t на скобку t плюс восемь равно нулю, корни нуль и минус восемь — наибольший НУЛЬ, ведь нуль больше любого отрицательного. Второе: пять t на скобку t минус четыре, корни нуль и четыре — наибольший четыре. Третье: t квадрат равно двадцати пяти, корни минус пять и пять — наибольший пять. По возрастанию: нуль, четыре, пять.',
    'Correct. First: t times the bracket t plus eight equals zero, roots zero and minus eight — the largest is ZERO, since zero exceeds any negative number. Second: five t times the bracket t minus four, roots zero and four — the largest is four. Third: t squared equals twenty five, roots minus five and five — the largest is five. In increasing order: zero, four, five.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−8') !== -1, text: L(
      "Minus sakkiz birinchi tenglamaning ildizi, lekin u ENG KATTASI emas: nol undan katta. Nolni umuman ko'rmaslik ikki tomonni t ga bo'lishdan kelib chiqadi — o'sha qadam nol ildizni yo'qotadi. Nolni qo'yib tekshiring: nol qo'shuv nol nol.",
      'Минус восемь — корень первого уравнения, но он не НАИБОЛЬШИЙ: нуль больше. А не увидеть нуль можно, разделив обе части на t — этот шаг и теряет корень нуль. Подставь нуль: нуль плюс нуль нуль.',
      'Minus eight is a root of the first equation, but not the LARGEST: zero is bigger. Missing zero altogether comes from dividing both sides by t — that step loses the root zero. Substitute zero: zero plus zero is zero.') },
    { when: (s) => s.slots.indexOf('8') !== -1, text: L(
      "Sakkiz — yozuvdagi son, ildiz emas. Ikkinchi ko'paytuvchi t qo'shuv sakkiz, va uning noli MINUS sakkizda: t qo'shuv sakkiz nolga teng bo'lsa t minus sakkizga teng. Sakkizni qo'yib tekshiring: oltmish to'rt qo'shuv oltmish to'rt bir yuz yigirma sakkiz chiqadi.",
      'Восемь — число из записи, а не корень. Второй множитель t плюс восемь, и его нуль в МИНУС восьми: если t плюс восемь равно нулю, то t равно минус восьми. Подставь восемь и проверь: шестьдесят четыре плюс шестьдесят четыре даёт сто двадцать восемь.',
      'Eight is a number from the record, not a root. The second factor is t plus eight and its zero sits at MINUS eight: if t plus eight is zero then t is minus eight. Substitute eight and check: sixty four plus sixty four gives one hundred twenty eight.') },
    { when: (s) => s.slots.indexOf('20') !== -1, text: L(
      "Yigirma — ikkinchi tenglamaning koeffitsiyenti, ildiz emas. Umumiy ko'paytuvchini chiqaring: besh t karra t minus to'rt. Ildizlar nol va to'rt. Yigirmani qo'ysangiz besh karra to'rt yuz minus to'rt yuz — hisoblab ko'ring, nol chiqmaydi.",
      'Двадцать — коэффициент второго уравнения, а не корень. Вынеси общий множитель: пять t на скобку t минус четыре. Корни нуль и четыре. Подставь двадцать: пять на четыреста минус четыреста — посчитай, нуля не выйдет.',
      'Twenty is a coefficient of the second equation, not a root. Take out the common factor: five t times the bracket t minus four. The roots are zero and four. Substitute twenty: five times four hundred minus four hundred — compute it, zero does not come out.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: nol, to'rt, besh.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: нуль, четыре, пять.',
      'The numbers are right, the order is not. Increasing starts from the smallest: zero, four, five.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Kodda nol yo'q, lekin u kerak: birinchi ikki tenglamaning ikkalasida ham nol ildiz bor, va birinchisida u eng kattasi. Umumiy ko'paytuvchi t bo'lgan har tenglamada nol ildiz bo'ladi.",
      'В коде нет нуля, а он нужен: у первых двух уравнений нуль является корнем, и в первом он наибольший. В каждом уравнении с общим множителем t нуль будет корнем.',
      'The code has no zero, but it needs one: zero is a root of both of the first two equations, and in the first it is the largest. Every equation with t as a common factor has zero among its roots.') },
  ],
  wrongText: L(
    "Har tenglamani ko'paytuvchilarga ajratib yoki t kvadratni yolg'iz qoldirib yeching, IKKI ildizni ham yozib oling, keyin kattasini tanlang. Nol ham son va u manfiy sonlardan katta.",
    'Каждое уравнение реши через вынесение множителя или оставив t квадрат в одиночестве, выпиши ОБА корня, потом выбери больший. Нуль тоже число, и он больше отрицательных.',
    'Solve each equation by factoring or by leaving t squared alone, write down BOTH roots, then pick the larger. Zero is a number too, and it exceeds negatives.'),
};

export default function D16_04(props) { return <CodeLock data={DATA} {...props} />; }
