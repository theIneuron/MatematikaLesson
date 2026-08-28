// Dars07 · Amaliyot 10 — So'zlar · 🔴 · teg: had-kochirish-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Darsning uchala tasdig'i bir gapda: qavs ochish, had ko'chirish va
// tekshirish. Uchta tuzoq uchta adashishga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'had-kochirish-ishorasi', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      "Qavs oldida minus turganda, qavs ochilganda har bir hadning ishorasi",
      'Когда перед скобкой стоит минус, при её раскрытии знак каждого слагаемого',
      'When a minus stands in front of a bracket, on opening it the sign of every term') },
    { slot: 0 },
    { text: L(
      'aylanadi. Had tenglamaning ikkinchi tomoniga ko\'chirilganda ham uning ishorasi',
      '. При переносе слагаемого в другую часть уравнения его знак тоже',
      '. When a term moves to the other side of the equation its sign also') },
    { slot: 1 },
    { text: L(
      'Topilgan ildiz',
      '. Найденный корень подставляют в',
      '. The root that is found is checked in the') },
    { slot: 2 },
    { text: L(
      "tenglamaga qo'yib tekshiriladi.",
      'уравнение для проверки.',
      'equation.') },
  ],
  cards: [
    { id: 'w1', label: L('teskariga', 'меняется на противоположный', 'flips') },
    { id: 'w2', label: L('almashadi', 'меняется', 'changes') },
    { id: 'w3', label: L('asl', 'исходное', 'original') },
    { id: 'w4', label: L("o'zgarmasdan qoladi", 'остаётся прежним', 'stays the same') },
    { id: 'w5', label: L('saqlanadi', 'сохраняется', 'is kept') },
    { id: 'w6', label: L('soddalashtirilgan', 'упрощённое', 'simplified') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidada uchta joy bor, va uchalasida ham ishora yoki tenglik saqlanishi haqida gap boradi: qavs ochilganda ishora almashadi, had ko'chirilganda ham, va oxirida ildiz ASL tenglamaga qo'yiladi — chunki soddalashtirish paytida xato ketgan bo'lishi mumkin.",
    'Верно, все три слова на месте. В правиле три места, и во всех трёх речь о знаке или о сохранении равенства: при раскрытии скобки знак меняется, при переносе тоже, а в конце корень подставляют в ИСХОДНОЕ уравнение — ведь ошибка могла произойти при упрощении.',
    'Correct, all three words are in place. The rule has three places, and all three are about signs or keeping the equality: opening a bracket flips the sign, moving a term flips it too, and at the end the root goes into the ORIGINAL equation — because a mistake could have crept in while simplifying.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Sonlarda sinang: besh minus qavs ochiluv ikki qo'shuv bir qavs yopiluv ikkiga teng. Agar ishoralar o'zgarmasa, natija boshqa chiqardi.",
      'Проверь на числах: пять минус скобка два плюс один равно двум. Если бы знаки не менялись, результат вышел бы другим.',
      'Test it on numbers: five minus the bracket two plus one is two. If the signs did not change, the result would be different.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ikki iks qo'shuv uch yettiga teng bo'lsin. Uchni o'ng tomonga o'tkazing: agar u o'z ishorasida qolsa, ikki iks o'nga teng bo'lardi — bu esa noto'g'ri.",
      'Пусть два икс плюс три равно семи. Перенеси тройку вправо: если она сохранит знак, выйдет два икс равно десяти — а это неверно.',
      'Let two x plus three equal seven. Move the three to the right: if it kept its sign, you would get two x equals ten — which is wrong.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Soddalashtirilgan tenglamada xato allaqachon bo'lishi mumkin — unga qo'yish o'sha xatoni ko'rsatmaydi. Shuning uchun tekshiruv har doim ASL yozuvga qaytadi.",
      'В упрощённом уравнении ошибка уже могла быть — подстановка в него эту ошибку не покажет. Поэтому проверка всегда возвращается к ИСХОДНОЙ записи.',
      'The simplified equation may already contain the mistake — substituting into it would not reveal it. That is why the check always goes back to the ORIGINAL record.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi qavs haqida, ikkinchisi ko'chirish haqida, uchinchisi esa tekshiruv qaysi yozuvda o'tkazilishi haqida.",
    'Проверяй каждую клетку самим предложением: первое про скобку, второе про перенос, третье про то, в какой записи делают проверку.',
    'Check each blank against the sentence itself: the first is about the bracket, the second about moving a term, the third about which record the check is done in.'),
};

export default function D07_10(props) { return <ClozeBank data={DATA} {...props} />; }
