// Dars38 · Amaliyot 08 — Ha yoki yo'q · 🔴 · tag: figure_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 8-pozitsiya)
//
// IKKALA DA'VO HAM ROST (skelet §0a.3), va ular ikki xil qiyinchilikni
// beradi:
//   «har kvadrat — romb»  — T3: figuralarning ichma-ich joylashuvi;
//   «diagonallari perpendikulyar parallelogramm — romb» — T2 ning
//   TESKARI teoremasi, ya'ni qoidani teskari tomondan o'qish.
// Ikkinchisi ko'proq rad etiladi: to'g'ri teorema «rombda diagonallar
// perpendikulyar» deydi, va uni teskari o'qish har doim ham to'g'ri
// bo'lavermaydi — bu yerda esa to'g'ri, va sababi razborda aytilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'figure_claims', level: '🔴',
  itemSize: 14,
  items: [
    { id: 's1', yes: true, tokens: ['□ → ◇'],
      claim: L('har kvadrat — romb', 'каждый квадрат — ромб', 'every square is a rhombus') },
    { id: 's2', yes: true, tokens: ['AC ⊥ BD → ◇'],
      claim: L("diagonallari perpendikulyar parallelogramm — romb", 'параллелограмм с перпендикулярными диагоналями — ромб', 'a parallelogram with perpendicular diagonals is a rhombus') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki da'vo figuralarning bir-biriga munosabati haqida. Birinchisi kvadrat bilan rombni, ikkinchisi esa diagonallarning xossasini rombning ta'rifi bilan bog'laydi.",
    'Два утверждения об отношении фигур друг к другу. Первое связывает квадрат и ромб, второе — свойство диагоналей с определением ромба.',
    'Two claims about how the figures relate to each other. The first links the square and the rhombus, the second links a property of the diagonals with the definition of the rhombus.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Birinchisi ta'rifdan bevosita chiqadi: romb — tomonlari teng parallelogramm; kvadrat esa parallelogramm va uning to'rt tomoni teng — demak u rombning hamma shartini bajaradi. Kvadrat rombning ichida turadi, xuddi kvadrat to'g'ri to'rtburchakning ichida turgani kabi. Ikkinchi da'vo esa TESKARI teorema: darsda «rombda diagonallar perpendikulyar» deyilgan, bu yerda esa aksincha o'qilyapti. U ham rost, va sababi bor: diagonallar perpendikulyar bo'lsa, ular parallelogrammni to'rtta to'g'ri burchakli uchburchakka ajratadi, va bu uchburchaklarning katetlari juft-juft teng — chunki diagonallar teng ikkiga bo'linadi. Demak gipotenuzalar ham teng, ya'ni to'rt tomon teng, ya'ni figura romb.",
    'Верно, оба утверждения истинны. Первое следует прямо из определения: ромб — параллелограмм с равными сторонами; квадрат же параллелограмм, и четыре его стороны равны — значит он выполняет все условия ромба. Квадрат лежит внутри ромба, как он лежит и внутри прямоугольника. Второе утверждение — ОБРАТНАЯ теорема: в уроке сказано «в ромбе диагонали перпендикулярны», а здесь читается наоборот. Оно тоже верно, и причина есть: если диагонали перпендикулярны, они разбивают параллелограмм на четыре прямоугольных треугольника, и катеты этих треугольников попарно равны — ведь диагонали делятся пополам. Значит равны и гипотенузы, то есть равны четыре стороны, то есть фигура ромб.',
    'Correct, both are true. The first follows straight from the definition: a rhombus is a parallelogram with equal sides; a square is a parallelogram and its four sides are equal — so it meets every condition of the rhombus. The square lies inside the rhombus, just as it lies inside the rectangle. The second claim is the CONVERSE theorem: the lesson says «in a rhombus the diagonals are perpendicular», and here it is read the other way. It is true as well, and for a reason: perpendicular diagonals cut the parallelogram into four right triangles whose legs are equal in pairs — because the diagonals bisect each other. So the hypotenuses are equal too, that is, the four sides are equal, that is, the figure is a rhombus.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala da'vo ham rost edi. Har birini alohida tekshiring: birinchisi uchun kvadratning to'rt tomonini sanang — ular teng, demak u romb. Ikkinchisi uchun diagonallar perpendikulyar bo'lgan parallelogrammni chizing va tomonlarini o'lchang — ular teng chiqadi.",
      'Оба утверждения были верны. Проверь каждое отдельно: для первого сосчитай четыре стороны квадрата — они равны, значит он ромб. Для второго начерти параллелограмм с перпендикулярными диагоналями и измерь стороны — они окажутся равными.',
      'Both claims were true. Check each on its own: for the first, count the four sides of a square — they are equal, so it is a rhombus. For the second, draw a parallelogram with perpendicular diagonals and measure the sides — they come out equal.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ROST, garchi u qoidani teskari tomondan o'qisa ham. Darsda «rombning diagonallari perpendikulyar» deyilgan; bu yerda esa parallelogrammning diagonallari perpendikulyar bo'lsa, u romb bo'lishi aytilyapti. Ikkalasi ham to'g'ri. Buni ko'rish uchun chizib ko'ring: perpendikulyar diagonallar parallelogrammni to'rtta to'g'ri burchakli uchburchakka ajratadi, ularning katetlari esa diagonallarning yarmi — ya'ni juft-juft teng. Demak to'rt tomon ham teng.",
      'Второе утверждение ВЕРНО, хотя и читает правило в обратную сторону. В уроке сказано «диагонали ромба перпендикулярны»; здесь же говорится, что если диагонали параллелограмма перпендикулярны, то он ромб. Верно и то, и другое. Чтобы это увидеть, начерти: перпендикулярные диагонали разбивают параллелограмм на четыре прямоугольных треугольника, а их катеты — половины диагоналей, то есть попарно равны. Значит равны и четыре стороны.',
      'The second claim is TRUE, though it reads the rule backwards. The lesson says «the diagonals of a rhombus are perpendicular»; here it says that if the diagonals of a parallelogram are perpendicular, it is a rhombus. Both are correct. To see it, draw the figure: perpendicular diagonals cut the parallelogram into four right triangles whose legs are halves of the diagonals, hence equal in pairs. So the four sides are equal too.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo ROST: har kvadrat romb. Rombning ta'rifi bitta shart qo'yadi — parallelogrammning tomonlari teng bo'lsin. Kvadratda bu shart bajariladi, ustiga burchaklari ham to'g'ri, lekin qo'shimcha xossa figurani oiladan chiqarib yubormaydi. Teskarisi esa noto'g'ri: har romb kvadrat emas, chunki rombning burchaklari to'g'ri bo'lishi shart emas.",
      'Первое утверждение ВЕРНО: каждый квадрат — ромб. Определение ромба ставит одно условие: чтобы у параллелограмма были равны стороны. У квадрата оно выполнено, да ещё углы прямые, но дополнительное свойство из семейства фигуру не выводит. А вот обратное неверно: не каждый ромб квадрат, ведь углы ромба прямыми быть не обязаны.',
      'The first claim is TRUE: every square is a rhombus. The definition of a rhombus sets one condition — that a parallelogram have equal sides. A square meets it, and has right angles besides, but an extra property does not push a figure out of the family. The converse is false: not every rhombus is a square, since the angles of a rhombus need not be right.') },
  ],
  wrongText: L(
    "Har da'voni ta'rifga solishtiring: rombning sharti faqat bitta — tomonlar teng. Kvadratda u bajariladi, perpendikulyar diagonallar esa uni keltirib chiqaradi.",
    'Сверяй каждое утверждение с определением: у ромба условие одно — равные стороны. В квадрате оно выполнено, а перпендикулярные диагонали к нему приводят.',
    'Match each claim against the definition: the rhombus has one condition — equal sides. A square meets it, and perpendicular diagonals lead to it.'),
};

export default function D38_08(props) { return <TrueFalse data={DATA} {...props} />; }
