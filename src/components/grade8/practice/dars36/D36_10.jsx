// Dars36 · Amaliyot 10 — Tartib · 🔴 · tag: count_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 10-pozitsiya)
//
// TO'RT QADAM: har xona uchun tanlovni sanash, keyin ko'paytirish.
// Xonalar KETMA-KET sanaladi, va har qadamda tanlov BITTAGA kamayadi —
// bu takrorlanish taqiqidan chiqadi (З73).
//
// Ko'paytirishni oldinga qo'yish — asosiy xato: ko'paytiriladigan sonlar
// hali topilmagan, va o'shanda ular taxmin bilan olinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'count_steps', level: '🔴',
  expr: ['1, 2, 3, 4'], exprSize: 26,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['4'],
      label: L('birinchi xonaga nechta raqam mumkin', 'сколько цифр годится в первый разряд', 'how many digits fit the first place') },
    { id: 'l2', tokens: ['3'],
      label: L('ikkinchi xonaga nechtasi qoladi', 'сколько остаётся во второй разряд', 'how many remain for the second place') },
    { id: 'l3', tokens: ['2'],
      label: L('uchinchi xonaga nechtasi qoladi', 'сколько остаётся в третий разряд', 'how many remain for the third place') },
    { id: 'l4', tokens: ['4 · 3 · 2 = 24'],
      label: L("bosqichlarni ko'paytiramiz", 'перемножаем шаги', 'multiply the steps') },
  ],
  start: ['l4', 'l2', 'l3', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Bir, ikki, uch, to'rt raqamlaridan raqamlari takrorlanmaydigan uch xonali sonlar tuziladi. Nechta son chiqishini to'rt qadamda sanaymiz, lekin qadamlar aralashib ketgan.",
    'Из цифр один, два, три, четыре составляются трёхзначные числа без повтора цифр. Сколько их получится, считаем в четыре шага, но шаги перепутаны.',
    'Three-digit numbers without repeated digits are built from the digits one, two, three, four. How many there are is counted in four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Xonalarni chapdan o'ngga to'ldiramiz. Birinchi xonaga to'rtta raqamdan istalganini qo'yish mumkin. Ikkinchi xonaga uchtasi qoladi, chunki bittasi allaqachon ishlatilgan va takrorlanish taqiqlangan. Uchinchi xonaga ikkitasi qoladi. Va oxirida bosqichlarni ko'paytiramiz: to'rt karra uch o'n ikki, o'n ikki karra ikki yigirma to'rt. Tanlovning har qadamda KAMAYISHI — taqiqning bevosita natijasi: takrorlanishga ruxsat berilganda har xonaga to'rttadan qolardi va javob oltmish to'rt bo'lardi. Ko'paytirishni oldinga qo'yib bo'lmaydi: ko'paytiriladigan sonlar hali sanalmagan.",
    'Верно. Разряды заполняем слева направо. В первый разряд можно поставить любую из четырёх цифр. Во второй остаются три, ведь одна уже использована, а повтор запрещён. В третий остаются две. И в конце перемножаем шаги: четырежды три двенадцать, двенадцать на два двадцать четыре. УБЫВАНИЕ выбора на каждом шаге — прямое следствие запрета: будь повтор разрешён, в каждом разряде оставалось бы по четыре и ответ был бы шестьдесят четыре. Умножение вперёд ставить нельзя: перемножаемые числа ещё не сосчитаны.',
    'Correct. We fill the places from left to right. Any of the four digits may go into the first place. Three remain for the second, since one is already used and repetition is forbidden. Two remain for the third. And at the end we multiply the steps: four times three is twelve, twelve times two is twenty-four. The SHRINKING of the choice at each step is a direct consequence of the ban: with repetition allowed, four would remain for every place and the answer would be sixty-four. Multiplication cannot be put first: the numbers to be multiplied have not been counted yet.'),
  wrongs: [
    { when: (s) => s.pos.l4 !== 4, text: L(
      "Ko'paytirish ENG OXIRGI qadam: ko'paytiriladigan uchta son hali topilmagan. Uni oldinga surish sonlarni taxmin bilan olishga majbur qiladi, va o'shanda ko'pincha har xonaga to'rttadan qo'yiladi — bu esa takrorlanish taqiqini unutish demak. Avval har xonani alohida sanang, keyin ko'paytiring.",
      'Умножение — САМЫЙ ПОСЛЕДНИЙ шаг: три перемножаемых числа ещё не найдены. Сдвинув его вперёд, приходится брать числа наугад, и тогда чаще всего в каждый разряд ставят по четыре — то есть забывают запрет повтора. Сначала сосчитай каждый разряд отдельно, потом перемножай.',
      'Multiplication is the VERY LAST step: the three numbers to be multiplied have not been found yet. Moving it forward forces the numbers to be guessed, and then four is usually put into every place — which means forgetting the ban on repetition. Count each place separately first, then multiply.') },
    { when: (s) => s.pos.l2 < s.pos.l1 || s.pos.l3 < s.pos.l2, text: L(
      "Xonalar tartibi buzilgan. Ular ketma-ket to'ldiriladi, va har qadam oldingisining natijasiga bog'liq: ikkinchi xonada uchta raqam qolgani birinchi xonada bittasi ishlatilganidan chiqadi, uchinchisida ikkitasi qolgani esa ikkitasi ishlatilganidan. Tartibni buzsangiz, nima uchun tanlov kamayishini tushuntirib bo'lmaydi.",
      'Порядок разрядов нарушен. Они заполняются подряд, и каждый шаг зависит от результата предыдущего: три цифры во втором разряде остаются оттого, что одна занята в первом, а две в третьем — оттого, что заняты две. При нарушенном порядке объяснить убывание выбора невозможно.',
      'The order of the places is broken. They are filled one after another, and each step depends on the result of the previous: three digits remain for the second place because one was used in the first, and two remain for the third because two were used. With the order broken there is no way to explain why the choice shrinks.') },
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Tayyor hisobdan boshlab bo'lmaydi — u ishning natijasi. Birinchi qadam eng sodda: birinchi xonaga nechta raqam mumkinligini aytish. Hech biri hali ishlatilmagan, ya'ni to'rttasi ham mumkin.",
      'Начинать с готового вычисления нельзя — оно результат работы. Первый шаг самый простой: сказать, сколько цифр годится в первый разряд. Ни одна ещё не использована, значит годятся все четыре.',
      'You cannot start with the finished computation — it is the result of the work. The first step is the simplest: say how many digits fit the first place. None has been used yet, so all four fit.') },
  ],
  wrongText: L(
    "Xonalarni chapdan o'ngga sanang, keyin ko'paytiring. Har qadamda tanlov bittaga kamayadi, chunki ishlatilgan raqam chiqib ketadi.",
    'Считай разряды слева направо, потом перемножай. На каждом шаге выбор уменьшается на единицу, ведь использованная цифра выбывает.',
    'Count the places from left to right, then multiply. At each step the choice shrinks by one, since the used digit drops out.'),
};

export default function D36_10(props) { return <SwapOrder data={DATA} {...props} />; }
