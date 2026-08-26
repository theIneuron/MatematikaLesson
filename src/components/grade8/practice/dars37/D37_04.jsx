// Dars37 · Amaliyot 04 — Juftlash · 🟡 · tag: angle_to_neighbour
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 4-pozitsiya)
//
// TO'RT PARALLELOGRAMM, HAR BIRIDA ∠A BERILGAN, ∠B TOPILADI:
//   50° -> 130° ; 60° -> 120° ; 90° -> 90° ; 110° -> 70°
// UCHINCHI JUFTLIK CHEGARA HOLATI: to'g'ri burchakda «qo'shni burchaklar
// 180 gacha to'ldiradi» va «qarama-qarshi burchaklar teng» degan ikki
// qoida BIR XIL javob beradi. Aynan shu chalkashlikni yashiradi (З76), va
// shuning uchun u qolgan uchtasi bilan yonma-yon turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'angle_to_neighbour', level: '🟡',
  connect: true,
  targetSize: 19, itemSize: 19,
  items: [
    { id: 'm1', tokens: ['50°'] },
    { id: 'm2', tokens: ['60°'] },
    { id: 'm3', tokens: ['90°'] },
    { id: 'm4', tokens: ['110°'] },
  ],
  targets: [
    { id: 't1', tokens: ['130°'] },
    { id: 't2', tokens: ['120°'] },
    { id: 't3', tokens: ['90°'] },
    { id: 't4', tokens: ['70°'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt xil parallelogramm ABCD berilgan. Chapda har birining ∠A burchagi, o'ngda esa unga QO'SHNI ∠B burchagi turibdi. A va B uchlari bitta tomonda yotadi.",
    'Даны четыре разных параллелограмма ABCD. Слева угол ∠A каждого, справа СОСЕДНИЙ с ним угол ∠B. Вершины A и B лежат на одной стороне.',
    'Four different parallelograms ABCD are given. On the left is the angle ∠A of each, on the right the ADJACENT angle ∠B. The vertices A and B lie on one side.'),
  ask: L(
    "Chapdan ∠A ni bosing, keyin o'ngdan ∠B ni bosing.",
    'Нажми ∠A слева, потом ∠B справа.',
    'Tap ∠A on the left, then ∠B on the right.'),
  correctText: L(
    "To'g'ri. A va B uchlari bitta tomonga yopishgan, ya'ni bu QO'SHNI burchaklar, va ularning yig'indisi bir yuz sakson gradusga teng. Shuning uchun har javob ayirish bilan topiladi: bir yuz sakson minus ellik bir yuz o'ttiz; minus oltmish yuz yigirma; minus yuz o'n yetmish. Uchinchi juftlik alohida: to'qson gradusning qo'shnisi ham to'qson, ya'ni bu yerda javob berilgan burchakka TENG chiqdi. Bu tasodif, va u xavfli: aynan shu holdan «qo'shni burchaklar teng» degan noto'g'ri xulosa tug'iladi. Qolgan uch juftlikka qarang — u yerda javob boshqa, va tenglik faqat to'g'ri burchakda ishlaydi.",
    'Верно. Вершины A и B прилежат к одной стороне, значит это СОСЕДНИЕ углы, и сумма их равна ста восьмидесяти градусам. Поэтому каждый ответ находится вычитанием: сто восемьдесят минус пятьдесят сто тридцать; минус шестьдесят сто двадцать; минус сто десять семьдесят. Третья пара особая: соседний к девяноста градусам тоже девяносто, то есть здесь ответ оказался РАВЕН данному углу. Это совпадение, и оно опасно: именно из этого случая рождается неверный вывод «соседние углы равны». Посмотри на остальные три пары — там ответ другой, и равенство работает только при прямом угле.',
    'Correct. The vertices A and B lie at one side, so these are ADJACENT angles and their sum is one hundred eighty degrees. Every answer therefore comes by subtraction: one hundred eighty minus fifty is one hundred thirty; minus sixty is one hundred twenty; minus one hundred ten is seventy. The third pair is special: the neighbour of ninety degrees is ninety too, so here the answer came out EQUAL to the given angle. That is a coincidence, and a dangerous one: it is precisely this case that breeds the false conclusion «adjacent angles are equal». Look at the other three pairs — there the answer differs, and equality works only at a right angle.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Har birini alohida hisoblang: bir yuz sakson minus ellik bir yuz o'ttiz, bir yuz sakson minus oltmish esa yuz yigirma. Berilgan burchak qanchalik kichik bo'lsa, qo'shnisi shunchalik katta — ular birga bir yuz sakson gradusni to'ldiradi.",
      'Эти две пары поменялись местами. Посчитай каждую отдельно: сто восемьдесят минус пятьдесят сто тридцать, а сто восемьдесят минус шестьдесят сто двадцать. Чем меньше данный угол, тем больше соседний — вместе они дополняют друг друга до ста восьмидесяти.',
      'These two pairs were swapped. Compute each on its own: one hundred eighty minus fifty is one hundred thirty, and one hundred eighty minus sixty is one hundred twenty. The smaller the given angle, the larger its neighbour — together they make one hundred eighty degrees.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "To'qson gradusning qo'shnisi ham to'qson: bir yuz sakson minus to'qson to'qson. Bu yagona hol bo'lib, unda qo'shni burchak berilganiga teng chiqadi, va bu tasodif — u faqat to'g'ri burchakda bo'ladi. Boshqa uch juftlikda javob boshqa son. Ya'ni to'qson gradusni «qoidadan istisno» deb emas, o'sha qoidaning alohida holi deb ko'rish kerak.",
      'Соседний к девяноста градусам тоже девяносто: сто восемьдесят минус девяносто девяносто. Это единственный случай, когда соседний угол равен данному, и это совпадение — оно бывает только при прямом угле. В остальных трёх парах ответ другой. То есть девяносто градусов надо видеть не как «исключение из правила», а как частный случай того же правила.',
      'The neighbour of ninety degrees is ninety too: one hundred eighty minus ninety is ninety. This is the only case where the adjacent angle equals the given one, and it is a coincidence — it happens only at a right angle. In the other three pairs the answer differs. So ninety degrees should be seen not as an «exception to the rule» but as a special case of the same rule.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Yuz o'n gradusning qo'shnisi yetmish: bir yuz sakson minus yuz o'n. Bu yagona juftlik bo'lib, unda berilgan burchak o'tmas, javob esa o'tkir. Tekshirish oson: parallelogrammning to'rt burchagining yig'indisi uch yuz oltmish, ya'ni ikki o'tmas va ikki o'tkir burchak bo'ladi.",
      'Соседний к ста десяти градусам семьдесят: сто восемьдесят минус сто десять. Это единственная пара, где данный угол тупой, а ответ острый. Проверить легко: сумма четырёх углов параллелограмма триста шестьдесят, то есть будет два тупых и два острых угла.',
      'The neighbour of one hundred ten degrees is seventy: one hundred eighty minus one hundred ten. This is the only pair where the given angle is obtuse and the answer acute. An easy check: the four angles of a parallelogram sum to three hundred sixty, so there are two obtuse and two acute angles.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har juftlikda bitta amal bajariladi: bir yuz saksondan berilgan burchakni ayirish. A va B uchlari bitta tomonda yotadi, ya'ni burchaklar qo'shni. Qarama-qarshi burchaklar boshqa juftlik bo'lardi — A va C, — va o'shanda javob berilganiga teng bo'lardi.",
      'В каждой паре выполняется одно действие: вычесть данный угол из ста восьмидесяти. Вершины A и B лежат на одной стороне, значит углы соседние. Противоположные углы были бы другой парой — A и C, — и тогда ответ равнялся бы данному.',
      'One operation is done in every pair: subtract the given angle from one hundred eighty. The vertices A and B lie at one side, so the angles are adjacent. Opposite angles would be a different pair — A and C — and then the answer would equal the given one.') },
  ],
  wrongText: L(
    "A va B qo'shni burchaklar: ularning yig'indisi 180 gradus. Har javobni ayirish bilan toping, to'qson gradusni ham shu qoida bo'yicha.",
    'A и B — соседние углы: их сумма 180 градусов. Находи каждый ответ вычитанием, включая случай девяноста градусов.',
    'A and B are adjacent angles: their sum is 180 degrees. Find every answer by subtraction, the ninety-degree case included.'),
};

export default function D37_04(props) { return <MatchPairs data={DATA} {...props} />; }
