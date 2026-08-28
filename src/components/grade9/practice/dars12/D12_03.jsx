// Dars12 · Amaliyot 03 — Test · 🟢 · teg: qoshish-orqali-yoqotish-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): usulning SHARTI
// so'ralyapti, tayyor javobdan tanlash emas. To'rtala variant to'rtta
// boshqa shartni taklif qiladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'qoshish-orqali-yoqotish-notogri', level: '🟢',
  correct: 1, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Qo'shish usuli faqat bitta had yo'qolganda ish beradi. Lekin har qanday had yo'qolmaydi.",
    'Способ сложения работает только тогда, когда исчезает одно слагаемое. Но исчезает не всякое слагаемое.',
    'The addition method works only when one term vanishes. But not every term vanishes.'),
  ask: L(
    "Had qanday shartda qo'shishda yo'qoladi?",
    'При каком условии слагаемое исчезает при сложении?',
    'Under what condition does a term vanish when the equations are added?'),
  opts: [
    { label: L(
      "Hadlar ikkala tenglamada bir xil ishorada bo'lsa",
      'Если слагаемые в обоих уравнениях с одинаковым знаком',
      'If the terms have the same sign in both equations') },
    { label: L(
      "Hadlar qarama-qarshi ishorada va koeffitsientlari teng bo'lsa",
      'Если слагаемые с противоположными знаками и с равными коэффициентами',
      'If the terms have opposite signs and equal coefficients') },
    { label: L(
      "Hadlar bir xil harf bilan yozilgan bo'lsa",
      'Если слагаемые записаны одной и той же буквой',
      'If the terms are written with the same letter') },
    { label: L(
      "Had kvadratda turgan bo'lsa",
      'Если слагаемое стоит в квадрате',
      'If the term is squared') },
  ],
  correctText: L(
    "To'g'ri. Ikkita shart birga kerak. Ishoralar qarama-qarshi bo'lishi kerak, aks holda hadlar qo'shilib ketadi; va koeffitsientlar teng bo'lishi kerak, aks holda hadning bir qismi qoladi. Masalan uch igrek bilan minus uch igrek nol beradi, uch igrek bilan minus ikki igrek esa igrekni qoldiradi. Koeffitsientlar teng bo'lmasa, avval tenglamalar songa ko'paytiriladi.",
    'Верно. Нужны оба условия сразу. Знаки должны быть противоположными, иначе слагаемые сложатся; и коэффициенты должны быть равными, иначе часть слагаемого останется. Скажем, три игрека и минус три игрека дают нуль, а три игрека и минус два игрека оставляют игрек. Если коэффициенты не равны, уравнения сначала умножают на число.',
    'Correct. Both conditions are needed at once. The signs must be opposite, otherwise the terms add up; and the coefficients must be equal, otherwise part of the term is left. For instance three y and minus three y give zero, while three y and minus two y leave a y behind. If the coefficients are unequal, the equations are multiplied by a number first.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Bir xil ishorada turgan hadlar qo'shilganda yo'qolmaydi, ikkilanadi: iks qo'shuv iks ikki iks bo'ladi. Yo'qolish uchun ishoralar QARAMA-QARSHI bo'lishi kerak.",
      'Слагаемые с одинаковым знаком при сложении не исчезают, а удваиваются: икс плюс икс — два икса. Чтобы исчезнуть, знаки должны быть ПРОТИВОПОЛОЖНЫМИ.',
      'Terms with the same sign do not vanish when added, they double: x plus x is two x. To vanish, the signs must be OPPOSITE.') },
    { when: (s) => s.picked === 2, text: L(
      "Bir xil harf yetarli emas. Uch igrek bilan minus ikki igrekda ham harf bir xil, lekin qo'shganda igrek qoladi: koeffitsientlar teng emas.",
      'Одной буквы недостаточно. У трёх игреков и минус двух игреков буква одна, но при сложении игрек остаётся: коэффициенты не равны.',
      'The same letter is not enough. Three y and minus two y share the letter, but adding them leaves a y: the coefficients are unequal.') },
    { when: (s) => s.picked === 3, text: L(
      "Daraja bunga aloqasi yo'q. Iks kvadrat ham, oddiy iks ham, ko'paytma iks igrek ham — hammasi bir xil qoida bilan yo'qoladi: ishoralar qarama-qarshi, koeffitsientlar teng.",
      'Степень тут ни при чём. И икс в квадрате, и обычный икс, и произведение икс игрек исчезают по одному правилу: противоположные знаки, равные коэффициенты.',
      'The power has nothing to do with it. x squared, a plain x, or the product xy — all vanish by the same rule: opposite signs, equal coefficients.') },
  ],
  wrongText: L(
    "Ikkita hadni qo'shib ko'ring va nolga tenglashishini tekshiring. Buning uchun ularning ishorasi va koeffitsienti qanday bo'lishi kerak?",
    'Сложи два слагаемых и проверь, получится ли нуль. Какими для этого должны быть их знаки и коэффициенты?',
    'Add two terms together and check whether you get zero. What must their signs and coefficients be for that?'),
};

export default function D12_03(props) { return <Choice data={DATA} {...props} />; }
