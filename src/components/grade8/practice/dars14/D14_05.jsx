// Dars14 · Amaliyot 05 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 5-pozitsiya)
//
// Darsning uch tasdig'i BITTA gapda: ratsional sonning ta'rifi, uning onli
// yozuvi, va irratsional sonning ta'rifi. Bankda uch tuzoq:
//   «butun»       — ta'rifni toraytiradi: kasr ham ratsional;
//   «yaqinlashadi» — З37, yaqinlashish aniq qiymat deb olinadi;
//   «cheksiz»     — З35, cheksizlikni irratsionallik belgisi deb olish.
// Oxirgi tuzoq eng qimmati: u gapga mukammal tushadi va faqat bir uchdan
// misoli bilan rad etiladi.
//
// MUHIM: kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR XIL
// shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Kasr ko'rinishida yozilishi mumkin bo'lgan son",
      'Число, которое можно записать дробью, называется',
      'A number that can be written as a fraction is called') },
    { slot: 0 },
    { text: L(
      "deyiladi. Uning onli yozuvi tugaydi yoki",
      '. Его десятичная запись заканчивается или',
      '. Its decimal record either ends or') },
    { slot: 1 },
    { text: L(
      ". Yozuvi tugamaydigan va takrorlanmaydigan son esa",
      '. А число, чья запись не заканчивается и не повторяется,',
      '. A number whose record neither ends nor repeats is') },
    { slot: 2 },
    { text: L('deyiladi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('ratsional', 'рациональным', 'rational') },
    { id: 'w2', label: L('takrorlanadi', 'повторяется', 'repeats') },
    { id: 'w3', label: L('irratsional', 'иррациональным', 'irrational') },
    { id: 'w4', label: L('butun', 'целым', 'whole') },
    { id: 'w5', label: L('cheksiz', 'бесконечна', 'endless') },
    { id: 'w6', label: L('yaqinlashadi', 'приближается', 'approximate') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Правило урока записано, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The rule of the lesson is written down, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch fakt bir gapda. Kasr ko'rinishida yozilgan son ratsional: uch bo'lingan sakkiz, yetti bo'lingan bir, minus besh bo'lingan ikki — hammasi shunday. Uning onli yozuvi ikki yo'ldan boradi va uchinchisi yo'q: tugaydi, masalan nol butun uch yetti besh, yoki takrorlanadi, masalan bir uchdanda uchlar aylanib turadi. Yozuvi na tugaydigan, na takrorlanadigan son esa irratsional — ikkidan ildiz shunday.",
    'Верно. Три факта в одном предложении. Число, записанное дробью, рационально: три восьмых, одна седьмая, минус пять вторых — все такие. Его десятичная запись идёт двумя путями, а третьего нет: заканчивается, например нуль целых триста семьдесят пять, или повторяется, как тройки в одной третьей. А число, чья запись ни заканчивается, ни повторяется, иррационально — таков корень из двух.',
    'Correct. Three facts in one sentence. A number written as a fraction is rational: three eighths, one seventh, minus five halves — all of them. Its decimal record takes one of two routes and there is no third: it ends, as in zero point three seven five, or it repeats, as the threes do in one third. A number whose record neither ends nor repeats is irrational — the root of two is such a number.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Butun» ta'rifni juda toraytiradi: u yerda faqat bir, ikki, uch va shu kabilar qoladi, kasrlar esa chiqib ketadi. Uch bo'lingan sakkiz butun emas, lekin u ham kasr ko'rinishida yozilgan va ratsional. Butun sonlar ratsional sonlarning bir qismi, hammasi emas.",
      '«Целым» слишком сужает определение: остаются только один, два, три и подобные, а дроби выпадают. Три восьмых не целое, но тоже записано дробью и рационально. Целые числа — часть рациональных, а не все они.',
      '«Whole» narrows the definition too far: only one, two, three and the like remain, while fractions drop out. Three eighths is not whole, yet it is written as a fraction and is rational. Whole numbers are a part of the rationals, not all of them.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "«Cheksiz» bu yerda hech narsani ajratmaydi: irratsional sonning yozuvi ham cheksiz. Bir uchdanni bo'lib ko'ring — nol butun uch uch uch, cheksiz, lekin son ratsional. Ajratadigan narsa TAKRORLANISH: ratsional sonning yozuvida aylanib turgan bo'lak bo'ladi.",
      '«Бесконечна» здесь ничего не различает: у иррационального числа запись тоже бесконечна. Раздели один на три — нуль целых три три три, бесконечно, но число рационально. Различает ПОВТОРЕНИЕ: у рационального числа в записи есть повторяющаяся часть.',
      '«Endless» distinguishes nothing here: an irrational number has an endless record too. Divide one by three — zero point three three three, endless, yet the number is rational. What distinguishes is REPETITION: a rational number has a repeating block in its record.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Yaqinlashadi» yozuv haqida emas, hisob haqida. Ikkidan ildizni bir butun qirq bir deb olish yaqinlashish, lekin bir butun qirq bir ning kvadrati bir butun to'qson to'qqiz sakson bir, ikki emas. Yaqinlashish sonning O'ZI emas, va ta'rifda unga joy yo'q.",
      '«Приближается» — про счёт, а не про запись. Взять корень из двух как один и сорок один это приближение, но один и сорок один в квадрате даёт один и девяносто девять восемьдесят один, а не два. Приближение — не САМО число, и в определении ему места нет.',
      '«Approximate» is about computing, not about the record. Taking the root of two as one point four one is an approximation, but one point four one squared is one point nine nine eight one, not two. An approximation is not the number ITSELF, and the definition has no place for it.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni bir uchdan va ikkidan ildiz misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примерах одной третьей и корня из двух.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on one third and the root of two.') },
  ],
  wrongText: L(
    "Har so'zni ikki misolda tekshiring: bir uchdan (ratsional, yozuvi cheksiz) va ikkidan ildiz (irratsional). To'g'ri so'z ikkisini ham ajratib turadi.",
    'Проверяй каждое слово на двух примерах: одна третья (рациональна, запись бесконечна) и корень из двух (иррационален). Верное слово различает их.',
    'Test every word on two examples: one third (rational, endless record) and the root of two (irrational). The right word tells them apart.'),
};

export default function D14_05(props) { return <ClozeBank data={DATA} {...props} />; }
