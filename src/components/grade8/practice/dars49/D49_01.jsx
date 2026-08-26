// Dars49 · Amaliyot 01 — Figuralar · 🟢 🖼 · tag: perp_diameter_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 1-pozitsiya)
//
// З105 KO'Z BILAN: vatarni teng ikkiga bo'lish uchun diametr unga
// PERPENDIKULYAR bo'lishi kerak. Har aylanada vatar AB va uni kesib o'tuvchi
// CD diametri chizilgan.
//
// `circ` ning nuqtalari BURCHAK bilan beriladi, va shuning uchun
// perpendikulyarlikni hisoblash oson: vatarning uchlari a va b bo'lsa, unga
// perpendikulyar diametr (a+b)/2 burchagida turadi. Belgilanganlarda diametr
// aynan shu burchakda, rad etilganlarda esa yigirma-o'ttiz gradus qiya.
//
// PERPENDIKULYARLIK KVADRATCHASI QO'YILMAYDI (skelet §2): u aynan
// so'ralayotgan narsa, va belgi javobni ochib qo'yardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const CIRC = { fig: 'circ', w: 92, h: 78, r: 31 };

const DATA = {
  tag: 'perp_diameter_marked', level: '🟢',
  col: 104, itemSize: 15,
  items: [
    // vatar (30, 150) -> unga perpendikulyar diametr 90 burchagida
    { id: 'i1', hit: true, tokens: [{ ...CIRC, chords: [{ a: 30, b: 150, names: ['A', 'B'] }, { a: 90, b: 270, names: ['C', 'D'] }] }] },
    // o'sha vatar, lekin diametr qiya
    { id: 'i2', tokens: [{ ...CIRC, chords: [{ a: 30, b: 150, names: ['A', 'B'] }, { a: 50, b: 230, names: ['C', 'D'] }] }] },
    // vatar (200, 340) -> perpendikulyar diametr 270
    { id: 'i3', hit: true, tokens: [{ ...CIRC, chords: [{ a: 200, b: 340, names: ['A', 'B'] }, { a: 270, b: 90, names: ['C', 'D'] }] }] },
    { id: 'i4', tokens: [{ ...CIRC, chords: [{ a: 200, b: 340, names: ['A', 'B'] }, { a: 230, b: 50, names: ['C', 'D'] }] }] },
    // vatar (100, 200) -> perpendikulyar diametr 150
    { id: 'i5', hit: true, tokens: [{ ...CIRC, chords: [{ a: 100, b: 200, names: ['A', 'B'] }, { a: 150, b: 330, names: ['C', 'D'] }] }] },
    { id: 'i6', tokens: [{ ...CIRC, chords: [{ a: 100, b: 200, names: ['A', 'B'] }, { a: 120, b: 300, names: ['C', 'D'] }] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Olti aylana chizilgan. Har birida AB vatari va uni kesib o'tuvchi CD diametri bor. Diametr vatarni teng ikkiga bo'lishi uchun bitta shart bajarilishi kerak.",
    'Начерчены шесть окружностей. В каждой есть хорда AB и пересекающий её диаметр CD. Чтобы диаметр делил хорду пополам, должно выполняться одно условие.',
    'Six circles are drawn. Each has a chord AB and a diameter CD crossing it. For the diameter to halve the chord, one condition must hold.'),
  ask: L(
    "Diametr vatarni TENG IKKIGA bo'lgan 3 ta aylanani belgilang.",
    'Отметь 3 окружности, где диаметр делит хорду ПОПОЛАМ.',
    'Mark the 3 circles where the diameter halves the chord.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Belgilangan uchtasida diametr vatarga PERPENDIKULYAR turadi, va aynan shunda u vatarni teng ikkiga bo'ladi. Nima uchun: markazdan vatarning ikki uchiga radiuslar chizsak, teng yonli uchburchak hosil bo'ladi (ikki tomon ham radius), va teng yonli uchburchakda asosga tushirilgan balandlik mediana ham bo'ladi — ya'ni asosni teng ikkiga bo'ladi. Rad etilganlarda diametr vatarni kesadi, lekin QIYA kesadi: bo'laklar teng emas, biri ikkinchisidan uzun. Diametr bo'lishning o'zi yetmaydi — perpendikulyarlik kerak.",
    'Верно. У трёх отмеченных диаметр стоит ПЕРПЕНДИКУЛЯРНО хорде, и именно тогда он делит её пополам. Почему: если провести радиусы из центра к концам хорды, получится равнобедренный треугольник (обе стороны — радиусы), а в равнобедренном треугольнике высота к основанию является и медианой, то есть делит основание пополам. У отвергнутых диаметр хорду пересекает, но НАКЛОННО: части не равны, одна длиннее другой. Быть диаметром недостаточно — нужна перпендикулярность.',
    'Correct. In the three marked ones the diameter stands PERPENDICULAR to the chord, and only then does it halve it. Why: draw the radii from the centre to the ends of the chord and an isosceles triangle appears (both sides are radii), and in an isosceles triangle the height to the base is also a median, so it halves the base. In the rejected ones the diameter does cross the chord, but OBLIQUELY: the pieces are unequal, one longer than the other. Being a diameter is not enough — perpendicularity is needed.'),
  wrongs: [
    { when: (s) => s.extra.length > 0, text: L(
      "Bu aylanada CD haqiqatan diametr — u markazdan o'tadi, — lekin vatarga QIYA kesadi. Ko'z bilan tekshirish oson: kesishish nuqtasidan vatarning ikki uchigacha bo'lgan masofalar bir xilmi? Qiya kesganda ular boshqa bo'ladi. Ta'rif diametrni emas, PERPENDIKULYAR diametrni talab qiladi.",
      'В этой окружности CD действительно диаметр — он проходит через центр, — но хорду он пересекает НАКЛОННО. На глаз проверить легко: одинаковы ли расстояния от точки пересечения до двух концов хорды? При наклонном пересечении они разные. Определение требует не диаметра, а ПЕРПЕНДИКУЛЯРНОГО диаметра.',
      'In this circle CD really is a diameter — it passes through the centre — but it crosses the chord OBLIQUELY. An easy eye check: are the distances from the crossing point to the two ends of the chord the same? With an oblique crossing they differ. The rule demands not a diameter but a PERPENDICULAR diameter.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bu aylanada diametr vatarga tik turadi, ya'ni u vatarni teng ikkiga bo'ladi. Tekshirishning oson yo'li: ikki chiziq orasidagi burchakka qarash — u to'g'ri bo'lsa, kesishish nuqtasi vatarning O'RTASIDA bo'ladi. Bu teoremaning to'g'ridan-to'g'ri natijasi.",
      'В этой окружности диаметр стоит прямо к хорде, значит он делит её пополам. Простой способ проверки: посмотреть на угол между двумя линиями — если он прямой, точка пересечения окажется в СЕРЕДИНЕ хорды. Это прямое следствие теоремы.',
      'In this circle the diameter stands square to the chord, so it halves it. An easy way to check: look at the angle between the two lines — if it is right, the crossing point sits at the MIDPOINT of the chord. That is a direct consequence of the theorem.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta aylana kerak. Har figuraga bitta savol bering: diametr bilan vatar orasidagi burchak to'g'rimi? Faqat shu holatda vatar teng ikkiga bo'linadi.",
      'Нужно ровно три окружности. К каждой фигуре задай один вопрос: прямой ли угол между диаметром и хордой? Только тогда хорда делится пополам.',
      'Exactly three circles are needed. Ask one question of every figure: is the angle between the diameter and the chord right? Only then is the chord halved.') },
  ],
  wrongText: L(
    "Diametr bilan vatar orasidagi burchakka qarang: faqat to'g'ri burchakda vatar teng ikkiga bo'linadi.",
    'Смотри на угол между диаметром и хордой: только при прямом угле хорда делится пополам.',
    'Look at the angle between the diameter and the chord: only a right angle halves the chord.'),
};

export default function D49_01(props) { return <MarkAll data={DATA} {...props} />; }
