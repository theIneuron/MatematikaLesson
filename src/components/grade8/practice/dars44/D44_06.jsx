// Dars44 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 6-pozitsiya)
//
// Kartalar SO'Z, ya'ni `L()` ICHIDA (skelet §0a.4). `parts` uch tilda bir xil
// TARTIBDA: gipotenuza, eng katta, kvadratlari.
//
// Eng qimmat tuzoq — «uzunliklarining»: u gapga bemalol tushadi va aynan
// З91 ni beradi (kvadratlar o'rniga uzunliklar qo'shiladi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L("To'g'ri burchakka qarama-qarshi turgan tomon", 'Сторона, лежащая против прямого угла, называется', 'The side lying opposite the right angle is called the') },
    { slot: 0 },
    { text: L('deyiladi va u uchburchakning', ', и это', ', and it is the') },
    { slot: 1 },
    { text: L("tomoni; uning kvadrati katetlar", 'сторона треугольника; её квадрат равен сумме', 'side of the triangle; its square equals the sum of the') },
    { slot: 2 },
    { text: L("yig'indisiga teng.", 'катетов.', 'of the legs.') },
  ],
  cards: [
    { id: 'w1', label: L('gipotenuza', 'гипотенузой', 'hypotenuse') },
    { id: 'w2', label: L('eng katta', 'наибольшая', 'longest') },
    { id: 'w3', label: L('kvadratlarining', 'квадратов', 'squares') },
    { id: 'w4', label: L('katet', 'катетом', 'leg') },
    { id: 'w5', label: L('eng kichik', 'наименьшая', 'shortest') },
    { id: 'w6', label: L('uzunliklarining', 'длин', 'lengths') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Pifagor teoremasining bayoni yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: hammasi gapga tili bo'yicha tushadi, farqni faqat ma'no beradi.",
    'Записана формулировка теоремы Пифагора, но три слова выпали. В банке шесть карточек: все по языку встают в предложение, различие даёт только смысл.',
    'The statement of the Pythagorean theorem is written down, but three words fell out. The bank holds six cards: all of them fit the sentence as language, only the meaning tells them apart.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch bo'shliq uch narsani aytadi. Birinchisi — NOM: to'g'ri burchakka qarshi turgan tomon gipotenuza deyiladi. Ikkinchisi — O'LCHOV: u eng katta tomon, chunki eng katta burchakka eng katta tomon qarshi turadi. Uchinchisi — AMAL: qo'shiladigan narsa katetlarning kvadratlari, uzunliklari emas. Uchinchi bo'shliq eng qimmat: uzunliklarni qo'shsangiz teorema butunlay boshqa narsani da'vo qiladi va u har doim yolg'on bo'ladi.",
    'Верно. Три пропуска говорят о трёх вещах. Первый — ИМЯ: сторона против прямого угла называется гипотенузой. Второй — РАЗМЕР: она наибольшая, потому что против наибольшего угла лежит наибольшая сторона. Третий — ДЕЙСТВИЕ: складываются квадраты катетов, а не их длины. Третий пропуск самый дорогой: сложив длины, теорема начинает утверждать совсем другое, и это утверждение всегда ложно.',
    'Correct. The three gaps say three things. The first is the NAME: the side opposite the right angle is called the hypotenuse. The second is SIZE: it is the longest, because the largest angle faces the largest side. The third is the OPERATION: what gets added is the squares of the legs, not their lengths. The third gap matters most: add the lengths and the theorem starts claiming something else entirely, and that claim is always false.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Uzunliklarining» gapga tushadi, lekin teoremani buzadi. Sonlarda tekshiring: katetlar olti va sakkiz bo'lsa, uzunliklarning yig'indisi o'n to'rt, gipotenuza esa o'n. Kvadratlarning yig'indisi yuz, va o'n kvadrat ham yuz — mana shu tenglik ishlaydi.",
      '«Длин» в предложение встаёт, но теорему ломает. Проверь на числах: при катетах шесть и восемь сумма длин четырнадцать, а гипотенуза десять. Сумма квадратов сто, и десять в квадрате сто — вот это равенство работает.',
      'Lengths fits the sentence but breaks the theorem. Check with numbers: with legs six and eight the sum of the lengths is fourteen while the hypotenuse is ten. The sum of the squares is one hundred, and ten squared is one hundred — that is the equality that works.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Gipotenuza eng KATTA tomon, eng kichik emas. Uchburchakda katta burchakka katta tomon qarshi turadi, to'g'ri burchak esa uchala burchakning eng kattasi. Misolda: katetlar olti va sakkiz, gipotenuza o'n.",
      'Гипотенуза — НАИБОЛЬШАЯ сторона, а не наименьшая. В треугольнике против большего угла лежит большая сторона, а прямой угол наибольший из трёх. На примере: катеты шесть и восемь, гипотенуза десять.',
      'The hypotenuse is the LONGEST side, not the shortest. In a triangle the larger angle faces the larger side, and the right angle is the largest of the three. On an example: legs six and eight, hypotenuse ten.') },
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "Katet — to'g'ri burchakni TASHKIL QILGAN tomon, ya'ni undan chiqadi. Gipotenuza esa burchakning qarshisida turadi. Bu ikki nom bir-birini almashtirmaydi: uchburchakda ikki katet va bitta gipotenuza bor.",
      'Катет — сторона, ОБРАЗУЮЩАЯ прямой угол, то есть выходящая из него. А гипотенуза стоит против угла. Эти два имени друг друга не заменяют: в треугольнике два катета и одна гипотенуза.',
      'A leg is a side FORMING the right angle, running out of it. The hypotenuse stands opposite the angle. The two names do not replace each other: a triangle has two legs and one hypotenuse.') },
    { when: (s) => s.slots[0] === 'w4' && s.slots[1] === 'w5', text: L(
      "Ikki so'z ham teskari tanlangan: bu tomon katet emas, gipotenuza, va u eng kichik emas, eng katta. Chizmaga qarang — to'g'ri burchakning qarshisidagi tomon har doim eng uzun bo'lib ko'rinadi.",
      'Оба слова выбраны наоборот: эта сторона не катет, а гипотенуза, и она не наименьшая, а наибольшая. Посмотри на чертёж — сторона против прямого угла всегда выглядит самой длинной.',
      'Both words were chosen the wrong way round: this side is not a leg but the hypotenuse, and it is not the shortest but the longest. Look at a drawing — the side opposite the right angle always looks the longest.') },
  ],
  wrongText: L(
    "Uch bo'shliq: tomonning nomi, uning o'lchovi, va qo'shiladigan narsa. Oxirgisini sonlarda tekshirib ko'ring.",
    'Три пропуска: имя стороны, её размер и то, что складывается. Последнее проверь на числах.',
    'Three gaps: the name of the side, its size, and what gets added. Check the last one with numbers.'),
};

export default function D44_06(props) { return <ClozeBank data={DATA} {...props} />; }
