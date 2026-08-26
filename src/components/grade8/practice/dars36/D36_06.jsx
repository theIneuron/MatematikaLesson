// Dars36 · Amaliyot 06 — Juftlash · 🟡 · tag: digits_to_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 6-pozitsiya)
//
// TO'RT TO'PLAM, TO'RT SANOQ. Har safar raqamlar takrorlanmaydigan ikki
// xonali sonlar sanaladi, ya'ni n karra n minus bir:
//   {1,2}         -> 2 · 1 = 2
//   {1,2,3}       -> 3 · 2 = 6
//   {1,2,3,4}     -> 4 · 3 = 12
//   {1,2,3,4,5}   -> 5 · 4 = 20
// BIRINCHI JUFTLIK ATAYLAB CHALG'ITADI: to'plamda ikkita raqam bor va
// javob ham ikki. Bu tasodif keyingi juftlikda darhol buziladi.
//
// `MatchPairs` `given` ni chizmaydi, shuning uchun shart matnda turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'digits_to_count', level: '🟡',
  connect: true,
  targetSize: 20, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['1, 2'] },
    { id: 'm2', tokens: ['1, 2, 3'] },
    { id: 'm3', tokens: ['1, 2, 3, 4'] },
    { id: 'm4', tokens: ['1, 2, 3, 4, 5'] },
  ],
  targets: [
    { id: 't1', tokens: ['2'] },
    { id: 't2', tokens: ['6'] },
    { id: 't3', tokens: ['12'] },
    { id: 't4', tokens: ['20'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "Chapda to'rt raqam to'plami. Har to'plamdan raqamlari takrorlanmaydigan ikki xonali sonlar tuziladi, va o'ngda ularning soni turibdi.",
    'Слева четыре набора цифр. Из каждого набора составляются двузначные числа без повтора цифр, а справа стоит их количество.',
    'On the left, four sets of digits. From each set, two-digit numbers without repeated digits are built, and their count stands on the right.'),
  ask: L(
    "Chapdan to'plamni bosing, keyin o'ngdan sonlar sonini bosing.",
    'Нажми набор слева, потом количество чисел справа.',
    'Tap a set on the left, then the count of numbers on the right.'),
  correctText: L(
    "To'g'ri. Har to'plamda bir xil hisob ishlaydi: birinchi xonaga to'plamdagi istalgan raqamni qo'yish mumkin, ikkinchi xonaga esa bittasi kam qoladi, chunki takrorlanish taqiqlangan. Ikki raqamda: ikki karra bir ikki. Uchta raqamda: uch karra ikki olti. To'rttada: to'rt karra uch o'n ikki. Beshtada: besh karra to'rt yigirma. Diqqat qiling: birinchi to'plamda raqamlar soni ham, javob ham ikkiga teng — bu TASODIF, va keyingi to'plamda u darhol buziladi: uchta raqamdan uchta emas, oltita son chiqadi. Sanoq raqamlar sonidan ancha tez o'sadi.",
    'Верно. В каждом наборе работает один и тот же счёт: в первый разряд можно поставить любую цифру набора, а во второй остаётся на одну меньше, ведь повтор запрещён. При двух цифрах: дважды один два. При трёх: трижды два шесть. При четырёх: четырежды три двенадцать. При пяти: пятью четыре двадцать. Обрати внимание: в первом наборе количество цифр и ответ совпали — это СОВПАДЕНИЕ, и в следующем наборе оно сразу рушится: из трёх цифр получается не три, а шесть чисел. Счёт растёт заметно быстрее количества цифр.',
    'Correct. The same count works for every set: any digit of the set may go into the first place, and one fewer remains for the second, since repetition is forbidden. With two digits: two times one is two. With three: three times two is six. With four: four times three is twelve. With five: five times four is twenty. Note: in the first set the number of digits and the answer coincide — a COINCIDENCE, and it breaks at once in the next set: three digits give not three but six numbers. The count grows much faster than the number of digits.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't1' || s.pair.m1 === 't2', text: L(
      "Birinchi to'plamda raqamlar soni ham, javob ham ikkiga teng, va bu chalg'itadi: «nechta raqam bo'lsa, shuncha son» degan qoida yo'q. Uchta raqamdan oltita son chiqadi: o'n ikki, o'n uch, yigirma bir, yigirma uch, o'ttiz bir, o'ttiz ikki. Sanab ko'ring — oltita. Sanoq ikki bosqichdan yig'iladi, va shuning uchun u raqamlar sonidan tez o'sadi.",
      'В первом наборе количество цифр и ответ равны двум, и это сбивает: правила «сколько цифр, столько и чисел» не существует. Из трёх цифр получается шесть чисел: двенадцать, тринадцать, двадцать один, двадцать три, тридцать один, тридцать два. Перечисли — шесть. Счёт складывается из двух шагов, поэтому он растёт быстрее количества цифр.',
      'In the first set the number of digits and the answer are both two, and that misleads: there is no rule saying «as many digits, as many numbers». Three digits give six numbers: twelve, thirteen, twenty-one, twenty-three, thirty-one, thirty-two. List them — six. The count is built from two steps, which is why it grows faster than the number of digits.') },
    { when: (s) => s.pair.m3 !== 't3' || s.pair.m4 !== 't4', text: L(
      "Bu to'plamda hisobni bosqichma-bosqich yozing. Birinchi xonaga to'plamdagi hamma raqam mumkin: to'rtta yoki beshta. Ikkinchi xonaga esa bittasi kam qoladi — takrorlanish taqiqlangani birinchi xonada ishlatilgan raqamni chiqarib tashlaydi. To'rt karra uch o'n ikki; besh karra to'rt yigirma. Ikkinchi ko'paytuvchi har doim birinchisidan bittaga kichik.",
      'В этом наборе распиши счёт по шагам. В первый разряд годится любая цифра набора: четыре или пять. Во второй остаётся на одну меньше — запрет повтора убирает цифру, занятую в первом разряде. Четырежды три двенадцать; пятью четыре двадцать. Второй множитель всегда на единицу меньше первого.',
      'For this set write the count step by step. Any digit of the set fits the first place: four or five of them. One fewer remains for the second — the ban on repetition removes the digit taken in the first place. Four times three is twelve; five times four is twenty. The second factor is always one less than the first.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har to'plamda ikki bosqichni yozing: birinchi xonaga nechta raqam mumkin va ikkinchi xonaga nechtasi qoladi. Ikkinchi son har doim birinchisidan bittaga kichik, chunki bitta raqam allaqachon ishlatilgan. Keyin ularni ko'paytiring.",
      'В каждом наборе распиши два шага: сколько цифр годится в первый разряд и сколько остаётся во второй. Второе число всегда на единицу меньше первого, ведь одна цифра уже использована. Потом перемножь их.',
      'For every set write out the two steps: how many digits fit the first place and how many remain for the second. The second number is always one less, since one digit is already used. Then multiply them.') },
  ],
  wrongText: L(
    "Ikki bosqichni yozing va ko'paytiring: birinchi xonaga hamma raqam, ikkinchi xonaga bittasi kam. Raqamlar soni javobga teng emas.",
    'Распиши два шага и перемножь: в первый разряд все цифры, во второй на одну меньше. Количество цифр ответу не равно.',
    'Write the two steps and multiply: all digits for the first place, one fewer for the second. The number of digits does not equal the answer.'),
};

export default function D36_06(props) { return <MatchPairs data={DATA} {...props} />; }
