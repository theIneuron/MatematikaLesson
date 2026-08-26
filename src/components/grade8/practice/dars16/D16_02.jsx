// Dars16 · Amaliyot 02 — Musbat ildiz · 🟢 · tag: positive_root · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 2-pozitsiya), §2
//
// BU OLTILIKNING YAGONA CHIZMASI (skelet §2). Son o'qida nolga simmetrik ikki
// `?` turadi: `t²` bir songa teng bo'lganda o'qda IKKI nuqta paydo bo'ladi.
// Savol esa bittasini so'raydi — З40 («faqat musbat javob yozildi») aynan shu
// farqda yashaydi: javob bitta, ildiz esa ikkita.
// `?` lar belgilangan bo'linmalar ORASIDA turadi (o'q −4 dan 4 gacha, qadam
// to'rt), ya'ni chizma javobni bermaydi.
//
// Uchta xato javob uchta yo'l:
//   4 — `t² = 4` da to'xtash, ildiz olinmadi;
//   6 — o'ttiz oltidan ildiz olindi, lekin to'qqizga bo'linmadi;
//   −2 — musbat ildiz so'ralgan, manfiysi yozildi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'positive_root', level: '🟢',
  target: 2, allowNeg: true,
  expr: ['9t² − 36 = 0'], exprSize: 28,
  given: [[{ fig: 'axis', from: -4, to: 4, step: 4, w: 150, h: 46, marks: [{ at: -2, q: true }, { at: 2, q: true }] }]],
  givenLabel: L("Ikki ildiz", 'Два корня', 'Two roots'),
  eyebrow: L('Musbat ildiz', 'Положительный', 'Positive root'),
  setup: L(
    "Bu tenglamada ikkinchi koeffitsiyent yo'q. O'qda ko'rinib turganidek, ildiz ikkita va ular noldan bir xil masofada. Savol musbatini so'raydi.",
    'В этом уравнении нет второго коэффициента. Как видно на оси, корней два и они на одинаковом расстоянии от нуля. Вопрос про положительный.',
    'This equation has no second coefficient. As the axis shows, there are two roots at equal distance from zero. The question asks for the positive one.'),
  label: L('musbat ildiz', 'положительный корень', 'the positive root'),
  ask: L(
    "Tenglamaning MUSBAT ildizi nimaga teng?",
    'Чему равен ПОЛОЖИТЕЛЬНЫЙ корень уравнения?',
    'What does the POSITIVE root of the equation equal?'),
  correctText: L(
    "To'g'ri. O'ttiz oltini o'ng tomonga o'tkazamiz: to'qqiz t kvadrat o'ttiz oltiga teng. To'qqizga bo'lamiz: t kvadrat to'rtga teng. Endi ildiz olamiz, va ikki javob chiqadi: t arti ikki yoki t minus ikki. Musbati — ikki.",
    'Верно. Переносим тридцать шесть вправо: девять t квадрат равно тридцати шести. Делим на девять: t квадрат равно четырём. Теперь извлекаем корень, и выходит два ответа: t плюс два или t минус два. Положительный — два.',
    'Correct. Move thirty six to the right: nine t squared equals thirty six. Divide by nine: t squared equals four. Now take the root, and two answers come out: t is plus two or t is minus two. The positive one is two.'),
  wrongs: [
    { when: (s) => s.value === 4, text: L(
      "To'rt — bu t KVADRATNING qiymati, t ning o'zi emas. Ildiz olish qadami qolib ketdi: kvadrati to'rtga teng son ikki. To'rtni qo'yib tekshiring: to'qqiz karra o'n olti bir yuz qirq to'rt, minus o'ttiz olti — nol emas.",
      'Четыре — это значение t КВАДРАТ, а не самого t. Пропущен шаг извлечения корня: число, чей квадрат равен четырём, это два. Подставь четыре и проверь: девять на шестнадцать сто сорок четыре, минус тридцать шесть — не нуль.',
      'Four is the value of t SQUARED, not of t itself. The root-taking step is missing: the number whose square is four is two. Substitute four and check: nine times sixteen is one hundred forty four, minus thirty six — not zero.') },
    { when: (s) => s.value === 6, text: L(
      "Olti — bu o'ttiz oltidan ildiz, lekin to'qqizga bo'lish qadami bajarilmagan. Avval koeffitsiyentdan xalos bo'lish kerak: t kvadrat o'ttiz olti bo'lingan to'qqiz, ya'ni to'rt. Oltini qo'yib tekshiring: to'qqiz karra o'ttiz olti uch yuz yigirma to'rt.",
      'Шесть — это корень из тридцати шести, но шаг деления на девять не сделан. Сначала надо избавиться от коэффициента: t квадрат равно тридцать шесть на девять, то есть четыре. Подставь шесть и проверь: девять на тридцать шесть — триста двадцать четыре.',
      'Six is the root of thirty six, but the division by nine was not done. First get rid of the coefficient: t squared is thirty six over nine, that is four. Substitute six and check: nine times thirty six is three hundred twenty four.') },
    { when: (s) => s.value === -2, text: L(
      "Minus ikki ham ildiz — o'qdagi chap `?` aynan shu. Lekin savol MUSBATini so'radi. Ikki ildizning kattaligi bir xil, ishorasi qarama-qarshi: minus ikki va arti ikki.",
      'Минус два тоже корень — это левый `?` на оси. Но вопрос был про ПОЛОЖИТЕЛЬНЫЙ. У двух корней одинаковая величина и противоположные знаки: минус два и плюс два.',
      'Minus two is a root as well — it is the left `?` on the axis. But the question asked for the POSITIVE one. The two roots have the same size and opposite signs: minus two and plus two.') },
    { when: (s) => s.value === 36 || s.value === 9, text: L(
      "Bu yozuvdan ko'chirilgan son, hisoblanmagan. Ikki qadam kerak: o'ttiz oltini o'ngga o'tkazib to'qqizga bo'lish, keyin ildiz olish. Javobni tenglamaga qo'yib tekshirish mumkin.",
      'Это число перенесено из записи, а не посчитано. Нужны два шага: перенести тридцать шесть вправо и разделить на девять, потом извлечь корень. Ответ можно проверить подстановкой.',
      'That number was carried over from the record instead of being computed. Two steps are needed: move thirty six right and divide by nine, then take the root. The answer can be checked by substitution.') },
  ],
  wrongText: L(
    "Avval t kvadratni yolg'iz qoldiring: o'ttiz oltini o'ngga o'tkazib to'qqizga bo'ling. Keyin ildiz oling — ikki javob chiqadi, musbatini yozing.",
    'Сначала оставь t квадрат в одиночестве: перенеси тридцать шесть вправо и раздели на девять. Потом извлеки корень — выйдут два ответа, запиши положительный.',
    'First leave t squared alone: move thirty six to the right and divide by nine. Then take the root — two answers come out, write the positive one.'),
};

export default function D16_02(props) { return <TypeValue data={DATA} {...props} />; }
