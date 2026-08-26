// Dars48 · Amaliyot 07 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 7-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCH TASDIG'I: diametrning ta'rifi (T1), kichik
// yoyning o'lchovi (T2) va katta yoy uchun ayirish (T2 ning ikkinchi yarmi).
//
// Kartalar SO'Z, ya'ni `L()` ICHIDA (skelet §0a.4). Bankdagi tuzoqlar:
// «radius» (vatar bilan chalkashtirish, З102), «yoyga» (burchak yoyga
// tenglashtiriladi, lekin gap teskari yo'nalishda), «180°» (yarim aylananing
// soni ayirishga ishlatiladi — З103).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L("Markazdan o'tuvchi vatar", 'Хорда, проходящая через центр, называется', 'A chord passing through the centre is called a') },
    { slot: 0 },
    { text: L("deyiladi. Yoy yarim aylanadan kichik bo'lsa, uning gradus o'lchovi", '. Если дуга меньше полуокружности, её градусная мера равна', '. If an arc is less than a semicircle, its degree measure equals the') },
    { slot: 1 },
    { text: L("teng; katta bo'lsa,", '; если больше, из', '; if greater, the central angle is subtracted from') },
    { slot: 2 },
    { text: L('dan markaziy burchak ayiriladi.', 'вычитается центральный угол.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('diametr', 'диаметром', 'diameter') },
    { id: 'w2', label: L('markaziy burchakka', 'центральному углу', 'central angle') },
    { id: 'w3', label: L('360°', '360°', '360°') },
    { id: 'w4', label: L('radius', 'радиусом', 'radius') },
    { id: 'w5', label: L('yoyga', 'дуге', 'arc') },
    { id: 'w6', label: L('180°', '180°', '180°') },
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
    "To'g'ri. Uch bo'shliq uch narsani belgilaydi. Birinchisi — NOM: markazdan o'tuvchi vatar diametr deyiladi; markazdan o'tmagani esa oddiy vatar bo'lib qoladi. Ikkinchisi — kichik yoyning o'lchovi: u markaziy burchakka teng, ya'ni hech narsa hisoblanmaydi. Uchinchisi — katta yoy uchun ayirish: u uch yuz oltmishdan bajariladi, chunki butun aylana uch yuz oltmish gradus. Bir yuz sakson bu yerda ishlamaydi: u faqat yarim aylana, va u chegara sifatida ishlatiladi — qaysi qoidani tanlash kerakligini aytadi.",
    'Верно. Три пропуска задают три вещи. Первое — ИМЯ: хорда через центр называется диаметром; не проходящая через центр остаётся просто хордой. Второе — мера малой дуги: она равна центральному углу, то есть ничего не вычисляется. Третье — вычитание для большой дуги: оно делается из трёхсот шестидесяти, ведь вся окружность триста шестьдесят градусов. Сто восемьдесят здесь не работает: это лишь полуокружность, и она служит границей — говорит, какое правило выбрать.',
    'Correct. The three gaps settle three things. The first is the NAME: a chord through the centre is a diameter; one that misses the centre stays an ordinary chord. The second is the measure of the minor arc: it equals the central angle, so nothing is computed. The third is the subtraction for the major arc: it is done from three hundred sixty, since the whole circle is three hundred sixty degrees. One hundred eighty does not work here: it is only the semicircle, and it serves as the boundary — it tells which rule to choose.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "Radius va vatar boshqa narsalar. Radius markazni aylananing NUQTASI bilan tutashtiradi, vatar esa aylananing IKKI nuqtasini tutashtiradi. Diametr — vatar, va u ikki radiusdan yig'ilgan: uzunligi ikki radiusga teng.",
      'Радиус и хорда — разные вещи. Радиус соединяет центр с ТОЧКОЙ окружности, а хорда соединяет ДВЕ точки окружности. Диаметр — это хорда, и он складывается из двух радиусов: его длина равна двум радиусам.',
      'A radius and a chord are different things. A radius joins the centre to a POINT of the circle, while a chord joins TWO points of the circle. A diameter is a chord, and it is made of two radii: its length equals two radii.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "Bir yuz sakson ayirish uchun ishlatilmaydi. Aylana uch yuz oltmish gradus, ya'ni katta yoyni topish uchun undan ayirish kerak. Bir yuz sakson boshqa ish qiladi: u CHEGARA — yoy undan kichik bo'lsa bir qoida, katta bo'lsa boshqa qoida ishlaydi. Tekshirish: burchak yetmish bo'lsa, katta yoy ikki yuz to'qson; agar bir yuz saksondan ayirilsa, yuz o'n chiqardi — bu esa yarim aylanadan ham kichik.",
      'Сто восемьдесят для вычитания не используется. Окружность триста шестьдесят градусов, значит большую дугу находят вычитанием из них. Сто восемьдесят делает другое: это ГРАНИЦА — если дуга меньше её, работает одно правило, если больше, другое. Проверка: при угле семьдесят большая дуга двести девяносто; а если вычесть из ста восьмидесяти, вышло бы сто десять — это меньше полуокружности.',
      'One hundred eighty is not used for the subtraction. The circle is three hundred sixty degrees, so the major arc comes from subtracting from that. One hundred eighty does something else: it is the BOUNDARY — below it one rule applies, above it another. A check: with an angle of seventy the major arc is two hundred ninety; subtracting from one hundred eighty would give one hundred ten, which is less than a semicircle.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "«Yoyga teng» degan yozuv aylanma bo'lib qoladi: yoyning o'lchovi yoyga teng deb aytish hech narsani bermaydi. Gap shundaki, yoy BURCHAK bilan o'lchanadi — markaziy burchak yoyning o'lchovini beradi, va shu bilan yoy graduslarda ifodalanadi.",
      'Запись «равна дуге» замыкается сама на себя: сказать, что мера дуги равна дуге, значит не сказать ничего. Смысл в том, что дуга измеряется УГЛОМ — центральный угол задаёт меру дуги, и через это дуга выражается в градусах.',
      'Saying it equals the arc is circular: to say the measure of an arc equals the arc says nothing. The point is that an arc is measured by an ANGLE — the central angle gives the arc its measure, and that is how an arc is expressed in degrees.') },
    { when: (s) => s.slots[0] === 'w4' && s.slots[2] === 'w6', text: L(
      "Ikki bo'shliq ham teskari tanlangan. Birinchisida ikki so'zni ajratish kerak: radius markazdan chiqadi, vatar esa aylananing ikki nuqtasini tutashtiradi. Uchinchisida esa butun aylananing soni kerak, yarmining soni emas.",
      'Оба пропуска выбраны неверно. В первом надо различить два слова: радиус выходит из центра, а хорда соединяет две точки окружности. А в третьем нужно число всей окружности, а не её половины.',
      'Both gaps were filled wrongly. The first needs two words told apart: a radius runs from the centre, a chord joins two points of the circle. The third needs the number of the whole circle, not of its half.') },
  ],
  wrongText: L(
    "Uch bo'shliq: vatarning nomi, kichik yoyning o'lchovi, va ayirish qaysi sondan bajarilishi.",
    'Три пропуска: имя хорды, мера малой дуги и то, из какого числа делается вычитание.',
    'Three gaps: the name of the chord, the measure of the minor arc, and the number the subtraction is done from.'),
};

export default function D48_07(props) { return <ClozeBank data={DATA} {...props} />; }
