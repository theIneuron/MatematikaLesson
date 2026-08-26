// Dars21 · Amaliyot 09 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 9-pozitsiya)
//
// DARSNING UCH TASDIG'I BITTA GAPDA. Bankdagi tuzoqlar:
//   «son bilan»   — T1 ning teskarisi: noma'lumni son bilan belgilash
//                   degani uni allaqachon topilgan deb hisoblash;
//   «tengsizlik»  — 28-darsning ishi, 21-darsda tenglama tuziladi;
//   «kiritiladi»  — З47 aynan shu so'zda yashaydi.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Noma'lum kattalik",
      'Неизвестную величину обозначают',
      'The unknown quantity is denoted by') },
    { slot: 0 },
    { text: L(
      "belgilanadi, qolganlari shu harf orqali yoziladi. Masala shartidan",
      ', остальные выражают через неё. Из условия задачи составляют',
      ', and the rest are expressed through it. From the condition one builds') },
    { slot: 1 },
    { text: L(
      "tuziladi va yechiladi. Masala shartiga zid ildiz javobga",
      'и решают его. Корень, противоречащий условию задачи, в ответ',
      'and solves it. A root contradicting the condition is') },
    { slot: 2 },
    { text: L('.', '.', 'in the answer.') },
  ],
  cards: [
    { id: 'w1', label: L('harf bilan', 'буквой', 'a letter') },
    { id: 'w2', label: L('tenglama', 'уравнение', 'an equation') },
    { id: 'w3', label: L('kiritilmaydi', 'не включается', 'not included') },
    { id: 'w4', label: L('son bilan', 'числом', 'a number') },
    { id: 'w5', label: L('tengsizlik', 'неравенство', 'an inequality') },
    { id: 'w6', label: L('kiritiladi', 'включается', 'included') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три утверждения урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three statements of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Noma'lum kattalik harf bilan belgilanadi — aynan shu harf butun yechimni ushlab turadi, chunki qolgan kattaliklar ham u orqali yoziladi. Shartdan tenglama tuziladi: masala matni tenglikka aylantiriladi. Va oxirida solishtirish: shartga zid ildiz javobga kiritilmaydi. Uchinchi qadam eng ko'p tashlab ketiladigan qadam, chunki tenglama allaqachon yechilgan bo'ladi va ish tugagandek tuyuladi.",
    'Верно. Неизвестную величину обозначают буквой — именно эта буква держит всё решение, ведь остальные величины выражаются через неё. Из условия составляют уравнение: текст задачи превращается в равенство. И в конце сверка: корень, противоречащий условию, в ответ не включается. Третий шаг пропускают чаще всего, потому что уравнение уже решено и кажется, что работа окончена.',
    'Correct. The unknown quantity is denoted by a letter — that letter holds the whole solution together, since the other quantities are expressed through it. From the condition one builds an equation: the text of the problem turns into an equality. And at the end the comparison: a root contradicting the condition is not included in the answer. The third step is skipped most often, because the equation is already solved and the work seems finished.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Noma'lum SON bilan belgilanmaydi — u hali noma'lum, ya'ni qanday son ekani ma'lum emas. Aynan shuning uchun harf qo'yiladi: harf ustida amal bajarish mumkin, va oxirida u qanday songa teng ekani chiqadi. Sonni oldindan qo'yish degani javobni taxmin qilish.",
      'Неизвестное не обозначают ЧИСЛОМ — оно ведь и есть неизвестное, какое это число, пока не знают. Именно поэтому ставят букву: с буквой можно выполнять действия, и в конце выясняется, какому числу она равна. Поставить число заранее значит угадать ответ.',
      'The unknown is not denoted by a NUMBER — it is unknown, so which number it is remains to be found. That is exactly why a letter is used: operations can be carried out on a letter, and at the end it turns out which number it equals. Putting a number in advance means guessing the answer.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Bu darsda shartdan TENGLAMA tuziladi, tengsizlik emas. Farqi shartning o'zida: «ko'paytmasi 56 ga TENG» degan gap tenglik beradi. Tengsizlik «kamida», «ko'pi bilan», «dan ortiq» degan so'zlardan chiqadi — u 28-darsning ishi.",
      'В этом уроке из условия составляют УРАВНЕНИЕ, а не неравенство. Разница в самом условии: слова «произведение РАВНО 56» дают равенство. Неравенство выходит из слов «не менее», «не более», «больше чем» — это работа урока 28.',
      'In this lesson the condition yields an EQUATION, not an inequality. The difference is in the condition itself: «the product EQUALS 56» gives an equality. An inequality comes from words like «at least», «at most», «more than» — that is the work of lesson 28.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Teskarisi bo'lib qoldi. Masala shartiga zid ildiz javobga KIRITILMAYDI: minus sakkiz santimetrli tomon ham, minus ikki soatlik vaqt ham yo'q. Bunday ildiz tenglamani to'g'ri qiladi, lekin masalani emas — shuning uchun u rad etiladi.",
      'Вышло наоборот. Корень, противоречащий условию задачи, в ответ НЕ ВКЛЮЧАЕТСЯ: ни стороны в минус восемь сантиметров, ни времени в минус два часа не бывает. Такой корень обращает в верное уравнение, но не задачу — поэтому его отбрасывают.',
      'It came out backwards. A root contradicting the condition is NOT included in the answer: there is no side of minus eight centimetres and no time of minus two hours. Such a root satisfies the equation but not the problem — so it is rejected.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni bitta misolda tekshiring: ikki ketma-ket sonning ko'paytmasi ellik oltiga teng.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на одном примере: произведение двух последовательных чисел равно пятидесяти шести.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on one example: the product of two consecutive numbers is fifty six.') },
  ],
  wrongText: L(
    "Gapni tartib bilan o'qing: avval belgilash, keyin tenglama, oxirida rad etish. Har so'zni ikki ketma-ket sonning ko'paytmasi ellik olti degan misolda tekshiring.",
    'Читай предложение по порядку: сначала обозначение, потом уравнение, в конце отбрасывание. Проверяй каждое слово на примере: произведение двух последовательных чисел пятьдесят шесть.',
    'Read the sentence in order: first the notation, then the equation, at the end the rejection. Test every word on the example: the product of two consecutive numbers is fifty six.'),
};

export default function D21_09(props) { return <ClozeBank data={DATA} {...props} />; }
