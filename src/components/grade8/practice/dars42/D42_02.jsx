// Dars42 · Amaliyot 02 — Yuza · 🟢 · tag: area_from_bases
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 2-pozitsiya)
//
// Formulaning to'g'ridan-to'g'ri qo'llanilishi: (7+5)/2 · 4 = 24.
// Razborlar uch xato javobni SON bilan rad etadi (З16): 140 — З87 (asoslar
// ko'paytirildi), 48 — yarim unutildi, 16 — hamma son qo'shildi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'area_from_bases', level: '🟢',
  target: 24, allowNeg: false,
  expr: ['a = 7,  b = 5,  h = 4'], exprSize: 20,
  eyebrow: L('Yuza', 'Площадь', 'Area'),
  setup: L(
    "Trapetsiyaning asoslari yetti va besh santimetr, balandligi to'rt santimetr. Yuza ikki qadamda topiladi: avval asoslar bilan ish, keyin balandlikka ko'paytirish.",
    'Основания трапеции семь и пять сантиметров, высота четыре сантиметра. Площадь находится в два шага: сначала работа с основаниями, потом умножение на высоту.',
    'The bases of a trapezoid are seven and five centimetres, its height four centimetres. The area comes in two steps: first the work with the bases, then the multiplication by the height.'),
  label: L('Yuza, sm²', 'Площадь, см²', 'The area, cm²'),
  ask: L(
    'Trapetsiyaning yuzi nechaga teng?',
    'Чему равна площадь трапеции?',
    'What is the area of the trapezoid?'),
  correctText: L(
    "To'g'ri. Yetti qo'shuv besh o'n ikki, yarmi olti — bu o'rta chiziqning uzunligi ham. Olti karra to'rt yigirma to'rt. Tekshirish oson: agar ikki asos teng bo'lganda, masalan ikkalasi olti bo'lganda, figura parallelogramm bo'lardi va yuzasi olti karra to'rt, ya'ni o'sha yigirma to'rt chiqardi. Trapetsiya bir asosini uzaytirib, ikkinchisini shuncha qisqartirgan parallelogrammga teng.",
    'Верно. Семь плюс пять — двенадцать, половина шесть — это и есть длина средней линии. Шесть на четыре — двадцать четыре. Проверка простая: если бы оба основания были равны, скажем по шесть, фигура была бы параллелограммом с площадью шесть на четыре, то есть те же двадцать четыре. Трапеция равна параллелограмму, у которого одно основание удлинили, а другое настолько же укоротили.',
    'Correct. Seven plus five is twelve, half is six — which is also the length of the midline. Six times four is twenty four. An easy check: if both bases were equal, say six each, the figure would be a parallelogram with area six times four, the same twenty four. A trapezoid equals a parallelogram with one base lengthened and the other shortened by as much.'),
  wrongs: [
    { when: (s) => s.value === 140, text: L(
      "Bir yuz qirq — asoslar KO'PAYTIRILGAN: yetti karra besh o'ttiz besh, keyin to'rtga. Lekin trapetsiya ikki asos orasida turadi va ularning ikkalasi ham uzunlik, ko'paytirilsa yuza chiqib ketadi. Ular QO'SHILADI, keyin yarmi olinadi.",
      'Сто сорок — основания ПЕРЕМНОЖЕНЫ: семь на пять — тридцать пять, потом на четыре. Но трапеция лежит между двумя основаниями, и оба они длины; если их перемножить, площадь взлетает. Их надо СЛОЖИТЬ и взять половину.',
      'One hundred forty means the bases were MULTIPLIED: seven times five is thirty five, then times four. But a trapezoid lies between its two bases, and both of them are lengths; multiplying them sends the area soaring. They are ADDED, then halved.') },
    { when: (s) => s.value === 48, text: L(
      "Qirq sakkiz — yig'indi to'g'ri, lekin yarim olinmagan: o'n ikki karra to'rt. Bu asosi o'n ikki bo'lgan parallelogrammning yuzi, trapetsiya esa uning yarmi. O'n ikkini ikkiga bo'ling, keyin to'rtga ko'paytiring.",
      'Сорок восемь — сумма верна, но не взята половина: двенадцать на четыре. Это площадь параллелограмма с основанием двенадцать, а трапеция его половина. Раздели двенадцать на два, потом умножь на четыре.',
      'Forty eight — the sum is right but the half was not taken: twelve times four. That is the area of a parallelogram with base twelve, and the trapezoid is half of it. Halve twelve, then multiply by four.') },
    { when: (s) => s.value === 16 || s.value === 12 || s.value === 6, text: L(
      "Bu son berilgan uzunliklarni qo'shishdan yoki yarim yo'lda to'xtashdan chiqqan. Yuza uchun ikki qadam kerak: yig'indining yarmi (olti) va uni balandlikka ko'paytirish (olti karra to'rt).",
      'Это число получено сложением данных длин или остановкой на полпути. Для площади нужны два шага: половина суммы (шесть) и умножение на высоту (шесть на четыре).',
      'This number came from adding the given lengths or from stopping halfway. The area needs two steps: half the sum (six) and multiplying it by the height (six times four).') },
  ],
  wrongText: L(
    "Asoslarni qo'shing, ikkiga bo'ling, keyin balandlikka ko'paytiring.",
    'Сложи основания, раздели на два, потом умножь на высоту.',
    'Add the bases, halve the sum, then multiply by the height.'),
};

export default function D42_02(props) { return <TypeValue data={DATA} {...props} />; }
