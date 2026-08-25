// Dars02 · Amaliyot 03 — Xossa · 🟢 · tag: property_held
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 2-o'rinda
// turgan, endi 3-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi (skelet §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §03
//
// a/(a + 3) dan sakkizta yozuv. To'rttasida xossa bajarilgan, to'rttasida yo'q.
// Eng qimmat ikkitasi:
//   −a/(−(a + 3))  — o'quvchi minusni «buzilish» deb belgilaydi, holbuki bu
//                    minus birga ko'paytirish (З22 ning teskarisi);
//   (a · 0)/((a + 3) · 0) — nol ko'paytuvchi qonuniy ko'rinadi (З21).
// Harfli ko'paytuvchili ikkitasi (ab va a²) ham tuzoq: ular xossani BUZMAYDI,
// faqat yangi shart qo'shadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'property_held', level: '🟢',
  eyebrow: L('Xossa', 'Свойство', 'The property'),
  setup: L(
    "Chapdagi kasrdan sakkizta yozuv yasalgan. Ba'zilarida asosiy xossa bajarilgan, ba'zilarida buzilgan.",
    'Из левой дроби сделали восемь записей. В одних основное свойство выполнено, в других нарушено.',
    'Eight records were made from the fraction on the left. In some the basic property holds, in others it is broken.'),
  given: [[{ n: 'a', d: 'a + 3' }]],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  zones: [
    { id: 'held', label: L('XOSSA BAJARILDI', 'СВОЙСТВО ВЫПОЛНЕНО', 'PROPERTY HELD') },
    { id: 'broken', label: L('XOSSA BUZILDI', 'СВОЙСТВО НАРУШЕНО', 'PROPERTY BROKEN') },
  ],
  zoneLbl: 96, itemSize: 15,
  items: [
    { id: 'i1', tokens: [{ n: '3a', d: '3(a + 3)' }], zone: 'held' },
    { id: 'i2', tokens: [{ n: 'ab', d: '(a + 3)b' }], zone: 'held' },
    { id: 'i3', tokens: [{ n: '−a', d: '−(a + 3)' }], zone: 'held' },
    { id: 'i4', tokens: [{ n: 'a²', d: 'a(a + 3)' }], zone: 'held' },
    { id: 'i5', tokens: [{ n: 'a + 4', d: '(a + 3) + 4' }], zone: 'broken' },
    { id: 'i6', tokens: [{ n: '5a', d: 'a + 3' }], zone: 'broken' },
    { id: 'i7', tokens: [{ n: 'a · 0', d: '(a + 3) · 0' }], zone: 'broken' },
    { id: 'i8', tokens: [{ n: 'a − 1', d: '(a + 3) − 1' }], zone: 'broken' },
  ],
  ask: L(
    "Kartani bosing, keyin zonani bosing. Sakkizala yozuv ham joyini topishi kerak.",
    'Нажми карточку, потом зону. Все восемь записей обязаны найти место.',
    'Tap a card, then a zone. All eight records must find a place.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Xossa bitta narsani so'raydi: surat ham, maxraj ham BITTA va O'SHA ko'paytuvchiga ko'paytirilsin, va o'sha ko'paytuvchi nol bo'lmasin. Son, harf va minus bir — hammasi qonuniy ko'paytuvchi.",
    'Верно. Свойство требует одного: и числитель, и знаменатель умножены на ОДНО И ТО ЖЕ, и это одно и то же не нуль. Число, буква и минус один — всё это законные множители.',
    'Correct. The property asks for one thing: numerator and denominator multiplied by the SAME thing, and that same thing is not zero. A number, a letter and minus one are all legitimate factors.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'broken', text: L(
      "Minus ham ko'paytuvchi: u minus bir. Surat ham, maxraj ham unga ko'paytirilgan, demak xossa bajarilgan. Minus bir hech qachon nol emas, shuning uchun yangi shart ham qo'shilmaydi.",
      'Минус — тоже множитель: это минус один. И верх, и низ умножены на него, значит свойство выполнено. Минус один никогда не нуль, поэтому нового условия тоже нет.',
      'The minus is a factor too: it is minus one. Both top and bottom are multiplied by it, so the property holds. Minus one is never zero, so no new condition appears either.') },
    { when: (s) => s.place.i7 === 'held', text: L(
      "Nol ko'paytuvchi bo'la olmaydi. Unga ko'paytirsangiz suratda ham, maxrajda ham nol qoladi, va kasr butunlay yo'qoladi.",
      'Нуль множителем не бывает. После умножения на него и сверху, и снизу останется нуль, и дробь исчезнет совсем.',
      'Zero is never a factor. Multiply by it and zero is left both above and below, and the fraction disappears entirely.') },
    { when: (s) => s.place.i5 === 'held' || s.place.i8 === 'held', text: L(
      "Xossa KO'PAYTIRISH haqida. Bir xil sonni qo'shish yoki ayirish kasrni o'zgartiradi: a ni birga teng qo'ying va o'zingiz ko'ring.",
      'Свойство про УМНОЖЕНИЕ. Прибавить или отнять одно и то же — значит изменить дробь: подставь а равное одному и посмотри сам.',
      'The property is about MULTIPLYING. Adding or subtracting the same thing changes the fraction: put a equal to one and see for yourself.') },
    { when: (s) => s.place.i6 === 'held', text: L(
      "Bu yerda faqat surat ko'paytirilgan, maxraj tegilmagan. Xossa ikkalasini birga so'raydi.",
      'Здесь умножен только числитель, знаменатель не тронут. Свойство просит оба сразу.',
      'Here only the numerator is multiplied, the denominator is untouched. The property asks for both at once.') },
    { when: (s) => s.place.i2 === 'broken' || s.place.i4 === 'broken', text: L(
      "Harfli ko'paytuvchi ham ko'paytuvchi. U xossani buzmaydi, faqat yangi shart qo'shadi: harf nolga aylanadigan qiymat endi mumkin emas.",
      'Буквенный множитель — тоже множитель. Он не нарушает свойство, он добавляет условие: значение, при котором буква обращается в нуль, теперь недопустимо.',
      'A factor with a letter is still a factor. It does not break the property, it adds a condition: the value where the letter becomes zero is now not allowed.') },
  ],
  wrongText: L(
    "Har yozuvga bitta savol bering: surat va maxraj BITTA va O'SHA narsaga ko'paytirilganmi? Agar qo'shilgan yoki faqat bir tomoni tegilgan bo'lsa — buzilgan.",
    'К каждой записи один вопрос: числитель и знаменатель умножены на ОДНО И ТО ЖЕ? Если прибавили или тронули только одну сторону — нарушено.',
    'Ask one question of each record: are numerator and denominator multiplied by the SAME thing? If something was added, or only one side was touched, it is broken.'),
};

export default function D02_03(props) { return <Zones data={DATA} {...props} />; }
