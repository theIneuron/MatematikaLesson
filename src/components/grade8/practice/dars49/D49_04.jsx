// Dars49 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 4-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCH TASDIG'I: perpendikulyar diametr (T1), vatar
// diametrdan katta bo'lmaydi (T2), va masofa vatarning YARMI orqali topiladi
// (T3, З104).
//
// Ikkinchi bo'shliqning tuzog'i nozik: «kichik» so'zi gapga tushadi, lekin
// ma'noni buzadi — vatar diametrga TENG bo'lishi mumkin (o'zi diametr
// bo'lganda), shuning uchun «katta bo'lmaydi» deyiladi.
// Kartalar SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L('Vatarga', 'Диаметр,', 'A diameter') },
    { slot: 0 },
    { text: L("diametr uni va yoyni teng ikkiga bo'ladi. Vatar diametridan", 'хорде, делит её и стягиваемую дугу пополам. Хорда', 'to a chord halves it and its arc. A chord is') },
    { slot: 1 },
    { text: L(". Markazdan vatargacha masofa vatarning", 'диаметра. Расстояние от центра до хорды находится через', 'than the diameter. The distance from the centre to a chord is found through') },
    { slot: 2 },
    { text: L('orqali topiladi.', 'хорды.', 'of the chord.') },
  ],
  cards: [
    { id: 'w1', label: L('perpendikulyar', 'перпендикулярный', 'perpendicular') },
    { id: 'w2', label: L("katta bo'lmaydi", 'не больше', 'never greater') },
    { id: 'w3', label: L('yarmi', 'половину', 'half') },
    { id: 'w4', label: L('parallel', 'параллельный', 'parallel') },
    { id: 'w5', label: L("kichik bo'ladi", 'меньше', 'always smaller') },
    { id: 'w6', label: L("to'liq uzunligi", 'всю длину', 'the whole length') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va hammasi gapga tili bo'yicha tushadi.",
    'Три утверждения урока собраны в одно предложение, но три слова выпали. В банке шесть карточек, и все они по языку встают в предложение.',
    'The three statements of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards and all of them fit the sentence as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch tasdiq uch xil ishni qiladi. Birinchisi SHARTNI aytadi: faqat perpendikulyar diametr vatarni teng ikkiga bo'ladi — parallel diametr esa umuman bo'lolmaydi, chunki diametr markazdan o'tadi va vatarga parallel bo'lsa uni kesmaydi. Ikkinchisi CHEGARANI aytadi: vatar diametrdan katta bo'lmaydi, lekin unga TENG bo'lishi mumkin — o'zi diametr bo'lganda. Uchinchisi HISOBNI aytadi: Pifagor teoremasiga vatarning yarmi kiradi, chunki perpendikulyar vatarni teng ikkiga bo'ladi va katet aynan yarim bo'lib qoladi.",
    'Верно. Три утверждения делают три разных дела. Первое задаёт УСЛОВИЕ: пополам хорду делит только перпендикулярный диаметр — а параллельный вообще невозможен, ведь диаметр проходит через центр и, будучи параллельным хорде, её не пересечёт. Второе задаёт ГРАНИЦУ: хорда не бывает больше диаметра, но может быть ему РАВНА — когда сама является диаметром. Третье задаёт СЧЁТ: в теорему Пифагора входит половина хорды, ведь перпендикуляр делит хорду пополам и катетом оказывается именно половина.',
    'Correct. The three statements do three different jobs. The first sets the CONDITION: only a perpendicular diameter halves a chord — a parallel one is impossible anyway, since a diameter passes through the centre and, being parallel to the chord, would not cross it. The second sets the LIMIT: a chord is never greater than the diameter, but it may be EQUAL to it — when it is a diameter itself. The third sets the COMPUTATION: half the chord enters the Pythagorean theorem, since the perpendicular halves the chord and the leg is exactly that half.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«To'liq uzunligi» — bu darsning eng qimmat xatosi. Perpendikulyar vatarni teng ikkiga bo'ladi, ya'ni to'g'ri burchakli uchburchakning kateti YARIM vatar bo'ladi. Sonlar bilan ko'ring: radius o'n uch, vatar yigirma to'rt. Yarmini olsangiz: bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh, masofa besh. To'liq uzunlikni olsangiz: bir yuz oltmish to'qqiz minus besh yuz yetmish olti — ildiz ostida manfiy son, ya'ni javob yo'q.",
      '«Всю длину» — самая дорогая ошибка урока. Перпендикуляр делит хорду пополам, значит катетом прямоугольного треугольника оказывается ПОЛОВИНА хорды. Посмотри на числах: радиус тринадцать, хорда двадцать четыре. С половиной: сто шестьдесят девять минус сто сорок четыре — двадцать пять, расстояние пять. С полной длиной: сто шестьдесят девять минус пятьсот семьдесят шесть — под корнем отрицательное число, ответа нет.',
      'The whole length is the costliest error of the lesson. The perpendicular halves the chord, so the leg of the right triangle is HALF the chord. See it in numbers: radius thirteen, chord twenty four. With the half: one hundred sixty nine minus one hundred forty four is twenty five, the distance five. With the whole length: one hundred sixty nine minus five hundred seventy six — a negative under the root, so no answer at all.') },
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "Parallel diametr bo'lolmaydi: diametr markazdan o'tadi, va agar u vatarga parallel bo'lsa, ular umuman kesishmaydi — bo'lish haqida gap ham bo'lmaydi. Vatarni bo'lish uchun diametr uni KESIB o'tishi kerak, va teng ikkiga bo'lish uchun tik kesishi kerak.",
      'Параллельный диаметр невозможен: диаметр проходит через центр, и если он параллелен хорде, они вообще не пересекаются — о делении и речи нет. Чтобы делить хорду, диаметр должен её ПЕРЕСЕКАТЬ, а чтобы делить пополам — пересекать под прямым углом.',
      'A parallel diameter is impossible: a diameter passes through the centre, and if it were parallel to the chord they would never meet — there would be no dividing at all. To divide a chord a diameter must CROSS it, and to halve it it must cross at a right angle.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "«Kichik» chegarani bir holatda buzadi: vatar diametrga TENG bo'lishi mumkin — bu o'zi diametr bo'lgan vatar. Shuning uchun «katta bo'lmaydi» deyiladi, «kichik» emas. Aylanada eng uzun vatar aynan diametr, va u ham vatar bo'lib qoladi.",
      '«Меньше» ломает границу в одном случае: хорда может быть РАВНА диаметру — это хорда, которая сама диаметр. Поэтому говорят «не больше», а не «меньше». Самая длинная хорда окружности и есть диаметр, и он тоже остаётся хордой.',
      'Smaller breaks the limit in one case: a chord may be EQUAL to the diameter — namely a chord that is a diameter. That is why the rule says never greater, not smaller. The longest chord of a circle is the diameter, and it is still a chord.') },
    { when: (s) => s.slots[0] === 'w4' && s.slots[2] === 'w6', text: L(
      "Ikki bo'shliq ham teskari tanlangan. Birinchisida diametr vatarni KESIB o'tishi va tik turishi kerak; uchinchisida esa hisobga vatarning yarmi kiradi, chunki perpendikulyar vatarni teng ikkiga bo'ladi.",
      'Оба пропуска выбраны неверно. В первом диаметр должен ПЕРЕСЕКАТЬ хорду и стоять к ней прямо; в третьем в счёт входит половина хорды, ведь перпендикуляр делит хорду пополам.',
      'Both gaps were filled wrongly. In the first the diameter must CROSS the chord and stand square to it; in the third half the chord enters the computation, since the perpendicular halves it.') },
  ],
  wrongText: L(
    "Uch bo'shliq: diametrning sharti, vatarning chegarasi, va hisobga nima kirishi.",
    'Три пропуска: условие для диаметра, граница для хорды и то, что входит в счёт.',
    'Three gaps: the condition on the diameter, the limit on the chord, and what enters the computation.'),
};

export default function D49_04(props) { return <ClozeBank data={DATA} {...props} />; }
