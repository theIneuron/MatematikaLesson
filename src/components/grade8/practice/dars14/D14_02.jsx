// Dars14 · Amaliyot 02 — Qaysi son · 🟢 · tag: which_irrational
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 2-pozitsiya)
//
// TO'RT VARIANTDA IKKI ILDIZ TURADI — bu ataylab: «ildiz — demak irratsional»
// degan o'quvchi (З36) ikkisini ham tanlashi kerak bo'lardi va shu yerda
// to'xtaydi. Sakkiz to'liq kvadrat emas, sakson bir esa to'liq kvadrat.
// Qolgan ikki variant ratsionallikning ikki ochiq shakli: onli kasr va
// oddiy kasr.
//
// Bu topshiriq 01 dan farq qiladi: u yerda RATSIONAL sonlar belgilangan,
// bu yerda esa bittasi irratsional. Savolning tomoni almashgani muhim —
// ta'rifni bir tomondan yodlab qo'ygan o'quvchi ikkinchi tomonda adashadi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari esa ASL
// raqamda qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_irrational', level: '🟢',
  correct: 0, optCols: 2, optSize: 24,
  eyebrow: L('Qaysi son', 'Какое число', 'Which number'),
  setup: L(
    "To'rt son. Irratsional son — onli yozuvi tugamaydigan va takrorlanmaydigan son, ya'ni uni kasr ko'rinishida yozib bo'lmaydi.",
    'Четыре числа. Иррациональное число — то, чья десятичная запись не заканчивается и не повторяется, то есть дробью его не записать.',
    'Four numbers. An irrational number is one whose decimal record neither ends nor repeats, that is, it cannot be written as a fraction.'),
  ask: L('Qaysi son irratsional?', 'Какое число иррационально?', 'Which number is irrational?'),
  opts: [
    { label: [{ r: '8' }] },
    { label: [{ r: '81' }] },
    { label: ['2,5'] },
    { label: [{ n: '4', d: '9' }] },
  ],
  correctText: L(
    "To'g'ri. Sakkiz to'liq kvadrat emas: ikkining kvadrati to'rt, uchning kvadrati to'qqiz, ya'ni sakkizdan ildiz ikki va uch orasida turadi. Uning onli yozuvi ikki butun sakkiz ikki sakkizdan boshlanadi va tugamaydi, takrorlanuvchi bo'lagi ham yo'q. Boshqa uchtasi ratsional: sakson birdan ildiz to'qqiz, ikki butun besh bu besh bo'lingan ikki, to'rt bo'lingan to'qqiz esa allaqachon kasr.",
    'Верно. Восемь не полный квадрат: два в квадрате четыре, три в квадрате девять, значит корень из восьми лежит между двумя и тремя. Его десятичная запись начинается с двух целых восьми двух восьми и не заканчивается, повторяющейся части тоже нет. Остальные три рациональны: корень из восьмидесяти одного девять, два с половиной это пять вторых, а четыре девятых уже дробь.',
    'Correct. Eight is not a perfect square: two squared is four, three squared is nine, so the root of eight lies between two and three. Its decimal record starts two point eight two eight and never ends, with no repeating part. The other three are rational: the root of eighty one is nine, two point five is five halves, and four ninths is already a fraction.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Sakson bir to'liq kvadrat: to'qqiz karra to'qqiz sakson bir, ya'ni ildizning qiymati to'qqiz. To'qqiz esa butun son va u to'qqiz bo'lingan bir kasri. Ildiz belgisi turgani sonni irratsional qilmaydi — ildiz OSTIDAGI son to'liq kvadratmi, savol shunda.",
      'Восемьдесят один — полный квадрат: девять на девять восемьдесят один, значит значение корня девять. Девять — целое число, дробь девять на один. Знак корня иррациональным число не делает — вопрос в том, полный ли квадрат ПОД корнем.',
      'Eighty one is a perfect square: nine times nine is eighty one, so the value of the root is nine. Nine is a whole number, the fraction nine over one. A root sign does not make a number irrational — the question is whether the radicand is a perfect square.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki butun besh ning yozuvi TUGAYDI: vergulddan keyin bitta raqam bor va tamom. Bunday sonni har doim kasr qilib yozish mumkin: ikki butun besh bu yigirma besh bo'lingan o'n, qisqartirsangiz besh bo'lingan ikki. Demak u ratsional.",
      'Запись два с половиной ЗАКАНЧИВАЕТСЯ: после запятой одна цифра и всё. Такое число всегда можно записать дробью: два и пять десятых это двадцать пять на десять, после сокращения пять на два. Значит оно рационально.',
      'The record two point five ENDS: one digit after the point and that is all. Such a number can always be written as a fraction: two and five tenths is twenty five over ten, which reduces to five over two. So it is rational.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu allaqachon kasr ko'rinishida yozilgan, ya'ni ta'rif bo'yicha ratsional. Uning onli yozuvi nol butun to'rt to'rt to'rt, ya'ni cheksiz — lekin cheksizlik irratsionallik belgisi emas: to'rtlar TAKRORLANADI.",
      'Оно уже записано дробью, то есть рационально по определению. Его десятичная запись нуль целых четыре четыре четыре, то есть бесконечна — но бесконечность не признак иррациональности: четвёрки ПОВТОРЯЮТСЯ.',
      'It is already written as a fraction, so it is rational by definition. Its decimal record is zero point four four four, endless — but endlessness is not the mark of irrationality: the fours REPEAT.') },
  ],
  wrongText: L(
    "Har sonni kasr qilib yozishga urinib ko'ring. Ildizda esa bitta savol: ildiz ostidagi son to'liq kvadratmi? To'liq kvadrat bo'lsa ildiz butun chiqadi.",
    'Попробуй записать каждое число дробью. А у корня один вопрос: полный ли квадрат под корнем? Если полный — корень выйдет целым.',
    'Try writing each number as a fraction. For a root there is one question: is the radicand a perfect square? If it is, the root comes out whole.'),
};

export default function D14_02(props) { return <Choice data={DATA} {...props} />; }
