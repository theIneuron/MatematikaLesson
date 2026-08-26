// Dars36 · Amaliyot 08 — Test · 🔴 · tag: which_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 8-pozitsiya)
//
// UCH BOSQICH, VA UCH XATO VARIANT UCH XIL BUZILISH:
//   9  — hammasi qo'shildi (З74)
//   12 — uchinchi bosqich butunlay unutildi
//   14 — qoida YARIM qo'llanildi: ikki bosqich ko'paytirildi, uchinchisi
//        qo'shildi
// Oxirgisi eng qimmat: u qoidani biladi, lekin uni oxirigacha olib
// bormaydi, va bunday xato tekshiruvsiz sezilmasdan qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_count', level: '🔴',
  correct: 0, optCols: 4, optSize: 20,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Oshxonada uch xil birinchi taom, to'rt xil ikkinchi taom va ikki xil ichimlik bor. Tushlikka har biridan bittadan tanlanadi: bitta birinchi taom, bitta ikkinchi taom va bitta ichimlik.",
    'В столовой три первых блюда, четыре вторых и два напитка. На обед выбирается по одному из каждого: одно первое, одно второе и один напиток.',
    'The canteen offers three first courses, four second courses and two drinks. For lunch one of each is chosen: one first course, one second course and one drink.'),
  ask: L(
    'Nechta xil tushlik tuzish mumkin?',
    'Сколько различных обедов можно составить?',
    'How many different lunches can be assembled?'),
  opts: [
    { label: ['24'] },
    { label: ['9'] },
    { label: ['12'] },
    { label: ['14'] },
  ],
  correctText: L(
    "To'g'ri. Uch bosqich ketma-ket bajariladi: birinchi taom tanlanadi, keyin ikkinchisi, keyin ichimlik. Hech bir bosqich boshqasini bekor qilmaydi — tushlikda uchalasi ham bo'ladi. Demak ko'paytiramiz: uch karra to'rt o'n ikki, o'n ikki karra ikki yigirma to'rt. Bosqichma-bosqich o'ylash ham shu javobni beradi: har birinchi taomga to'rtta ikkinchi taom to'g'ri keladi, ya'ni o'n ikkita juftlik; har juftlikka esa ikkita ichimlik — yigirma to'rt. Ichimlik ikkitagina bo'lsa ham, u sanoqni IKKI BAROBAR oshiradi, chunki har tayyor juftlik ikki xil bo'lib ikkiga bo'linadi.",
    'Верно. Три шага выполняются подряд: выбирается первое блюдо, потом второе, потом напиток. Ни один шаг не отменяет другой — в обеде будут все три. Значит перемножаем: трижды четыре двенадцать, двенадцать на два двадцать четыре. Рассуждение по шагам даёт тот же ответ: каждому первому блюду отвечают четыре вторых, то есть двенадцать пар; каждой паре — два напитка, итого двадцать четыре. Напитков всего два, но они УДВАИВАЮТ счёт, ведь каждая готовая пара расходится на два варианта.',
    'Correct. Three steps run in sequence: a first course is chosen, then a second, then a drink. No step cancels another — the lunch will have all three. So we multiply: three times four is twelve, twelve times two is twenty-four. Step-by-step reasoning gives the same answer: each first course goes with four second courses, that is twelve pairs; each pair with two drinks — twenty-four. There are only two drinks, yet they DOUBLE the count, since every finished pair splits into two.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Hamma son QO'SHILDI: uch qo'shuv to'rt qo'shuv ikki to'qqiz. Qo'shish boshqa savolga javob beradi — «taomxonada jami nechta taom bor», ya'ni bitta narsa tanlansa. Bizda esa tushlik uchta narsadan yig'iladi: birinchi taom VA ikkinchi taom VA ichimlik. «Va» ko'paytiradi. Tekshiring: faqat birinchi ikki bosqichni olsangiz ham o'n ikkita juftlik chiqadi, to'qqiz esa undan kam.",
      'Все числа СЛОЖЕНЫ: три плюс четыре плюс два девять. Сложение отвечает на другой вопрос — «сколько всего блюд в столовой», то есть если выбирается одна вещь. А у нас обед собирается из трёх: первое И второе И напиток. «И» умножает. Проверь: даже по первым двум шагам выходит двенадцать пар, а девять меньше этого.',
      'All the numbers were ADDED: three plus four plus two is nine. Addition answers a different question — «how many dishes are there in the canteen altogether», that is, if one item is chosen. Here the lunch is assembled from three: a first course AND a second AND a drink. «And» multiplies. Check: even the first two steps alone give twelve pairs, and nine is less than that.') },
    { when: (s) => s.picked === 2, text: L(
      "Uchinchi bosqich unutildi: o'n ikki — bu faqat birinchi va ikkinchi taomlarning juftliklari soni. Ichimlik ham tanlanadi, ya'ni har juftlik ikki xil tushlik beradi. O'n ikki karra ikki yigirma to'rt. Sanoqda hamma bosqichni sanash uchun shartni qayta o'qing va tanlanadigan narsalarni sanang — ular uchta.",
      'Третий шаг забыт: двенадцать — это только количество пар из первого и второго блюда. Напиток тоже выбирается, значит каждая пара даёт два разных обеда. Двенадцать на два двадцать четыре. Чтобы не потерять шаг, перечитай условие и сосчитай выбираемые вещи — их три.',
      'The third step was forgotten: twelve is only the number of pairs of first and second courses. A drink is chosen too, so each pair gives two different lunches. Twelve times two is twenty-four. To keep every step, re-read the condition and count the items being chosen — there are three.') },
    { when: (s) => s.picked === 3, text: L(
      "Qoida YARIM qo'llanildi: birinchi ikki bosqich ko'paytirildi (o'n ikki), uchinchisi esa qo'shildi (o'n to'rt). Lekin ichimlik ham xuddi shunday ketma-ket bosqich: u tushlikning uchinchi qismi, alohida variant emas. Qo'shish faqat «buni YOKI uni» degan holatlarda ishlatiladi. Bu yerda esa uchalasi ham birga olinadi, ya'ni uchinchi bosqich ham ko'paytiriladi: o'n ikki karra ikki yigirma to'rt.",
      'Правило применено НАПОЛОВИНУ: первые два шага перемножены (двенадцать), а третий прибавлен (четырнадцать). Но напиток — такой же последовательный шаг: он третья часть обеда, а не отдельный вариант. Сложение применяется только в случаях «то ИЛИ другое». Здесь же берутся все три, значит и третий шаг умножается: двенадцать на два двадцать четыре.',
      'The rule was applied by HALVES: the first two steps were multiplied (twelve) and the third added (fourteen). But the drink is a sequential step just the same: it is the third part of the lunch, not a separate option. Addition applies only in «this OR that» cases. Here all three are taken together, so the third step multiplies as well: twelve times two is twenty-four.') },
  ],
  wrongText: L(
    "Tanlanadigan narsalarni sanang — uchta, va uchalasi ham tushlikka kiradi. Ketma-ket bosqichlar ko'paytiriladi, hammasi.",
    'Сосчитай выбираемые вещи — их три, и все три входят в обед. Последовательные шаги перемножаются, все до одного.',
    'Count the items being chosen — three, and all three go into the lunch. Sequential steps are multiplied, every one of them.'),
};

export default function D36_08(props) { return <Choice data={DATA} {...props} />; }
