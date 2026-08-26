// Dars48 · Amaliyot 06 — Figuralar · 🟡 🖼 · tag: diameter_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 6-pozitsiya)
//
// BIRINCHI AYLANALI CHIZMA. `fig.jsx` ga `circ` turi metodist ruxsati bilan
// qo'shildi (skelet §0a.2): «bu vatar diametrmi» degan savolni yozuv bilan
// berish (`O ∈ AB`) ta'rifni yodlatadi, chizma bilan berish esa KO'RSATADI.
//
// З102: diametr — MARKAZDAN O'TUVCHI vatar, «uzun vatar» emas. Rad
// etilganlarning bittasi markazga juda yaqin o'tadi (yetti-sakkiz piksel
// nariroq), ikkinchisi o'rtacha, uchinchisi esa qisqa vatar.
//
// CHIZMADA MARKAZ NUQTA BILAN KO'RSATILGAN, boshqa belgi yo'q: vatarning
// markazdan o'tishi faqat KO'Z bilan hukm qilinadi (skelet §2).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const CIRC = { fig: 'circ', w: 92, h: 78, r: 31 };

const DATA = {
  tag: 'diameter_marked', level: '🟡',
  col: 104, itemSize: 15,
  items: [
    // diametr: ikki uch burchagi 180 gradusga farq qiladi
    { id: 'i1', hit: true, tokens: [{ ...CIRC, chords: [{ a: 20, b: 200, names: ['A', 'B'] }] }] },
    // markazga yaqin o'tadi, lekin o'tmaydi (150 gradus)
    { id: 'i2', tokens: [{ ...CIRC, chords: [{ a: 40, b: 190, names: ['A', 'B'] }] }] },
    { id: 'i3', hit: true, tokens: [{ ...CIRC, chords: [{ a: 95, b: 275, names: ['A', 'B'] }] }] },
    // 130 gradus: markazdan sezilarli nariroq
    { id: 'i4', tokens: [{ ...CIRC, chords: [{ a: 120, b: 250, names: ['A', 'B'] }] }] },
    { id: 'i5', hit: true, tokens: [{ ...CIRC, chords: [{ a: 150, b: 330, names: ['A', 'B'] }] }] },
    // qisqa vatar
    { id: 'i6', tokens: [{ ...CIRC, chords: [{ a: 210, b: 300, names: ['A', 'B'] }] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Olti aylana chizilgan, har birida bitta vatar AB. Markaz O nuqta bilan ko'rsatilgan. Diametr — MARKAZDAN o'tuvchi vatar, ya'ni uzunlik emas, JOYLASHUV hal qiladi.",
    'Начерчены шесть окружностей, в каждой одна хорда AB. Центр показан точкой O. Диаметр — хорда, ПРОХОДЯЩАЯ ЧЕРЕЗ ЦЕНТР, то есть решает не длина, а расположение.',
    'Six circles are drawn, each with one chord AB. The centre is shown as the point O. A diameter is a chord PASSING THROUGH THE CENTRE — so position decides, not length.'),
  ask: L(
    "Vatar DIAMETR bo'lgan 3 ta aylanani belgilang.",
    'Отметь 3 окружности, где хорда является ДИАМЕТРОМ.',
    'Mark the 3 circles where the chord is a DIAMETER.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Belgilangan uchtasida vatar markazdan o'tadi: chiziq O nuqtaning ustidan yuradi, ya'ni u aylanani ikki teng yarmiga bo'ladi va uzunligi ikki radiusga teng. Rad etilganlar diqqat talab qiladi: bittasi markazga juda yaqin o'tadi va deyarli diametrga o'xshaydi, lekin markazni chetlab o'tadi — ta'rif esa «yaqin» degan so'zni bilmaydi. Ikkinchisi o'rtacha uzoqda, uchinchisi esa qisqa vatar. Diametr aylananing eng uzun vatari, lekin uni «uzunligi» bilan aniqlab bo'lmaydi: markazdan o'tishini KO'RISH kerak.",
    'Верно. У трёх отмеченных хорда проходит через центр: линия идёт по точке O, значит она делит окружность на две равные половины и её длина равна двум радиусам. Отвергнутые требуют внимания: одна проходит совсем близко к центру и почти похожа на диаметр, но центр обходит — а определение слова «почти» не знает. Вторая на среднем расстоянии, третья короткая хорда. Диаметр — самая длинная хорда окружности, но определить его по «длине» нельзя: надо УВИДЕТЬ, что он проходит через центр.',
    'Correct. In the three marked ones the chord passes through the centre: the line runs over the point O, so it splits the circle into two equal halves and its length equals two radii. The rejected ones need care: one passes very close to the centre and nearly looks like a diameter, but it misses the centre — and the definition does not know the word almost. The second is at middling distance, the third a short chord. A diameter is the longest chord of a circle, but it cannot be identified by length: you must SEE that it goes through the centre.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu vatar markazga juda yaqin o'tadi, lekin O nuqtaning ustidan o'tmaydi — chiziq bilan nuqta orasida kichik bo'shliq qoladi. Ta'rif qat'iy: diametr markazdan O'TISHI kerak, yaqin o'tishi kifoya emas. Bu vatar diametrdan bir oz qisqa ham bo'ladi.",
      'Эта хорда проходит совсем близко к центру, но не по точке O — между линией и точкой остаётся небольшой зазор. Определение строго: диаметр обязан ПРОХОДИТЬ через центр, близко пройти недостаточно. И длина этой хорды чуть меньше диаметра.',
      'This chord passes very close to the centre but not over the point O — a small gap remains between the line and the point. The definition is strict: a diameter must PASS THROUGH the centre; passing close is not enough. This chord is also a little shorter than a diameter.') },
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu vatar markazdan ancha nariroq o'tadi. Tekshirishning oson yo'li: vatarni ko'z bilan davom ettirmasdan, uning O nuqta ustidan o'tishini ko'rish. Qisqa vatar ham vatar bo'lib qoladi — u shunchaki diametr emas.",
      'Эта хорда проходит заметно в стороне от центра. Простой способ проверки: не продолжая хорду, посмотреть, идёт ли она по точке O. Короткая хорда остаётся хордой — просто она не диаметр.',
      'This chord passes well away from the centre. An easy way to check: without extending the chord, see whether it runs over the point O. A short chord is still a chord — it simply is not a diameter.') },
    { when: (s) => s.miss.length > 0 && s.extra.length === 0, text: L(
      "Belgilangan vatarlar to'g'ri, lekin ularning soni yetmaydi: uchta diametr bor. Diametrlar turli yo'nalishda chizilgan — bittasi deyarli gorizontal, bittasi tik, bittasi qiya. Yo'nalish hech narsani o'zgartirmaydi: markazdan o'tsa — diametr.",
      'Отмеченные хорды верны, но их не хватает: диаметров три. Диаметры начерчены в разных направлениях — один почти горизонтальный, один вертикальный, один наклонный. Направление ничего не меняет: проходит через центр — значит диаметр.',
      'The chords marked are right, but not enough of them: there are three diameters. They are drawn in different directions — one nearly horizontal, one vertical, one slanted. Direction changes nothing: through the centre means a diameter.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta aylana kerak. Har vatarga bitta savol bering: u O nuqtaning ustidan o'tadimi? Uzunligiga qaramang — markazdan o'tgan vatar allaqachon eng uzun bo'ladi.",
      'Нужно ровно три окружности. К каждой хорде задай один вопрос: проходит ли она по точке O? На длину не смотри — хорда через центр и так самая длинная.',
      'Exactly three circles are needed. Ask one question of every chord: does it run over the point O? Ignore length — a chord through the centre is the longest one anyway.') },
  ],
  wrongText: L(
    "Vatar O nuqtaning USTIDAN o'tishi kerak. Yaqin o'tgan vatar diametr emas.",
    'Хорда должна идти ПО точке O. Хорда, прошедшая рядом, диаметром не является.',
    'The chord must run OVER the point O. A chord that passes nearby is not a diameter.'),
};

export default function D48_06(props) { return <MarkAll data={DATA} {...props} />; }
