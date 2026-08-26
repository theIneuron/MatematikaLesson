// Dars55 · Amaliyot 10 — Guruhlar · 🔴 · tag: number_or_vector
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 10-pozitsiya)
//
// KURSNING OXIRGI TOPSHIRIG'I, va bu ataylab: butun yil davomida o'quvchi
// vektorni figura deb o'rgandi, oxirgi ekranda esa vektor amali SON
// berishi mumkinligini ajratadi (З117).
// Ikki belgi ajratadi: nuqta va modul chiziqlari SON beradi, qo'shish va
// songa ko'paytirish esa VEKTOR.
// Eng qiyini — |a+b|: ichida vektor amali turibdi, lekin natija son.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'number_or_vector', level: '🔴',
  zoneSize: 12, itemSize: 16, zoneLbl: 116,
  given: [[{
    fig: 'vec', w: 62, h: 56,
    grid: { x: [-1, 4], y: [-1, 4] },
    arrows: [
      { from: [0, 0], to: [3, 1], name: 'a' },
      { from: [0, 0], to: [1, 3], ref: true, name: 'b' },
    ],
  }]],
  givenLabel: L('Vektorlar', 'Векторы', 'The vectors'),
  zones: [
    { id: 'z1', label: L('NATIJA SON', 'РЕЗУЛЬТАТ ЧИСЛО', 'RESULT IS A NUMBER') },
    { id: 'z2', label: L('NATIJA VEKTOR', 'РЕЗУЛЬТАТ ВЕКТОР', 'RESULT IS A VECTOR') },
  ],
  items: [
    { id: 'i1', tokens: ['a · b'], zone: 'z1' },
    { id: 'i2', tokens: ['a + b'], zone: 'z2' },
    { id: 'i3', tokens: ['|a|'], zone: 'z1' },
    { id: 'i4', tokens: ['a − b'], zone: 'z2' },
    { id: 'i5', tokens: ['a · a'], zone: 'z1' },
    { id: 'i6', tokens: ['3a'], zone: 'z2' },
    { id: 'i7', tokens: ['|a + b|'], zone: 'z1' },
    { id: 'i8', tokens: ['a + 2b'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv, hammasi a va b vektorlari ustidagi amallar. Ba'zilarining natijasi SON, ba'zilariniki esa VEKTOR. Ikki belgi ajratadi: nuqta va modul chiziqlari sonni beradi, qo'shish, ayirish va songa ko'paytirish esa vektorni.",
    'Восемь записей, все это действия над векторами a и b. У одних результат ЧИСЛО, у других ВЕКТОР. Различают два признака: точка и знак модуля дают число, а сложение, вычитание и умножение на число дают вектор.',
    'Eight records, all operations on the vectors a and b. Some give a NUMBER as the result, others a VECTOR. Two marks tell them apart: the dot and the modulus bars give a number, while addition, subtraction and multiplication by a number give a vector.'),
  ask: L('Yozuvni bosing, keyin guruhini bosing.', 'Нажми запись, потом её группу.', 'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri, va bu kursning oxirgi topshirig'i. Belgi haqiqatan ham ikkita. Nuqta — skalyar ko'paytma: ikki ko'paytma qo'shiladi va bitta son qoladi. Modul chiziqlari — uzunlik, u ham son. Qolgan hamma amal koordinatalar ustida alohida bajariladi, ya'ni ikki koordinata chiqadi — bu vektor. Oxirgi yozuv eng qiyini: qavs ichida vektorlarning yig'indisi turibdi, ya'ni ichkarida vektor amali bajariladi, lekin modul chiziqlari uni SONGA aylantiradi. Belgini ichkaridan tashqariga qarab o'qing.",
    'Верно, и это последнее задание курса. Признаков действительно два. Точка это скалярное произведение: два произведения складываются и остаётся одно число. Знак модуля это длина, тоже число. Все остальные действия выполняются над координатами по отдельности, значит выходят две координаты — это вектор. Последняя запись самая трудная: внутри скобок сумма векторов, то есть внутри выполняется векторное действие, но знак модуля обращает его в ЧИСЛО. Читай запись изнутри наружу.',
    'Correct, and this is the last task of the course. There really are two marks. The dot is the dot product: two products are added and one number remains. The modulus bars mean length, also a number. Every other operation is done on the coordinates separately, so two coordinates come out — that is a vector. The last record is the hardest: inside the bars stands a sum of vectors, so a vector operation happens within, but the modulus bars turn it into a NUMBER. Read the record from the inside out.'),
  wrongs: [
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Modul chiziqlari ichidagi yig'indi chalkashtirdi. Yozuvni ichkaridan boshlab o'qing: avval a qo'shuv b hisoblanadi va vektor chiqadi, keyin esa modul olinadi — modul har doim UZUNLIKNI beradi, uzunlik esa son. Qavs ichida nima turishidan qat'i nazar, modul chiziqlari natijani songa aylantiradi.",
      'Смутила сумма внутри знака модуля. Читай запись изнутри: сначала считается a плюс b и выходит вектор, потом берётся модуль — а модуль всегда даёт ДЛИНУ, длина же число. Что бы ни стояло внутри, знак модуля обращает результат в число.',
      'The sum inside the modulus bars is confusing. Read the record from within: first a plus b is computed and a vector comes out, then the modulus is taken — and a modulus always gives a LENGTH, and a length is a number. Whatever stands inside, the modulus bars turn the result into a number.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i5 === 'z2', text: L(
      "Skalyar ko'paytma vektorlar guruhiga tushdi, va bu darsning eng qimmat xatosi. Kutish tushunarli: ikki vektordan yana vektor chiqishi kerakdek tuyuladi. Lekin hisobga qarang: mos koordinatalar ko'paytiriladi va natijalar QO'SHILADI — qo'shilgandan keyin bitta son qoladi. Nuqta belgisi shuni bildiradi.",
      'Скалярное произведение попало в группу векторов, и это самая дорогая ошибка урока. Ожидание понятно: кажется, что из двух векторов должен выйти вектор. Но посмотри на счёт: соответствующие координаты перемножаются, а результаты СКЛАДЫВАЮТСЯ — после сложения остаётся одно число. Знак точки означает именно это.',
      'The dot product landed in the vector group, and this is the costliest error of the lesson. The expectation is understandable: two vectors seem bound to give a vector. But look at the arithmetic: the matching coordinates are multiplied and the results are ADDED — after the addition one number remains. That is what the dot sign means.') },
    { when: (s) => s.place.i3 === 'z2', text: L(
      "Modul vektorlar guruhiga tushdi. Modul — vektorning UZUNLIGI, ya'ni u savolga «qancha» deb javob beradi, «qayerga» deb emas. Uzunlik esa har doim son.",
      'Модуль попал в группу векторов. Модуль это ДЛИНА вектора, то есть он отвечает на вопрос «сколько», а не «куда». А длина всегда число.',
      'The modulus landed in the vector group. A modulus is the LENGTH of a vector, so it answers the question «how much», not «where to». And a length is always a number.') },
    { when: () => true, text: L(
      "Har yozuvda ikki belgini qidiring: nuqta bormi va modul chiziqlari bormi. Ulardan bittasi bo'lsa natija son, bo'lmasa vektor.",
      'В каждой записи ищи два признака: есть ли точка и есть ли знак модуля. Если хоть один есть — результат число, если нет — вектор.',
      'In each record look for two marks: is there a dot and are there modulus bars. If either is present the result is a number, otherwise a vector.') },
  ],
  wrongText: L(
    "Nuqta va modul chiziqlari SON beradi, qolgan amallar VEKTOR.",
    'Точка и знак модуля дают ЧИСЛО, остальные действия ВЕКТОР.',
    'The dot and the modulus bars give a NUMBER, the other operations give a VECTOR.'),
};

export default function D55_10(props) { return <Zones data={DATA} {...props} />; }
