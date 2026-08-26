// Dars34 · Amaliyot 01 — Test · 🟢 · tag: which_variation_row
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 1-pozitsiya)
//
// DARSNING TANLANMASI AMALIYOTDA TAKRORLANMAYDI. Bu yerda o'z sahnasi:
// o'quvchilar bir haftada nechta kitob o'qigani — 2, 3, 2, 4, 2, 3, 5, 3,
// 2, 4 (hajm o'n). Bu tanlanma butun darsda ishlatiladi (01, 02, 03, 04).
//
// ENG QIMMAT XATO — VARIANTLAR RO'YXATI. «2, 3, 4, 5» chiroyli ko'rinadi va
// tartiblangan ham, lekin unda TAKRORLAR yo'q, ya'ni tanlanmaning hajmi
// o'ndan to'rtga tushib qoladi va butun statistika buziladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_variation_row', level: '🟢',
  correct: 0, optCols: 1, optSize: 16,
  expr: ['2, 3, 2, 4, 2, 3, 5, 3, 2, 4'], exprSize: 20,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "O'nta o'quvchidan bir haftada nechta kitob o'qigani so'raldi, javoblar kelgan tartibda yozildi. Endi ularni variatsion qatorga aylantirish kerak.",
    'У десяти учеников спросили, сколько книг они прочли за неделю, ответы записали в порядке поступления. Теперь их надо превратить в вариационный ряд.',
    'Ten students were asked how many books they read in a week, and the answers were written down in the order they came. Now they must be turned into a variation series.'),
  ask: L(
    'Qaysi qator bu tanlanmaning variatsion qatori?',
    'Какой ряд является вариационным рядом этой выборки?',
    'Which row is the variation series of this sample?'),
  opts: [
    { label: ['2, 2, 2, 2, 3, 3, 3, 4, 4, 5'] },
    { label: ['2, 3, 4, 5'] },
    { label: ['5, 4, 4, 3, 3, 3, 2, 2, 2, 2'] },
    { label: ['2, 3, 2, 4, 2, 3, 5, 3, 2, 4'] },
  ],
  correctText: L(
    "To'g'ri. Variatsion qator — tanlanmaning O'ZI, faqat o'sish tartibida yozilgani. Ikki narsa saqlanadi: hamma natija joyida qoladi va ularning soni o'zgarmaydi. Sanang — o'nta son, tanlanmada ham o'nta javob bor edi. Takrorlar ham qoladi: ikkilik to'rt marta, uchlik uch marta yozilgan. Shu ko'rinishdan keyin chastotalarni sanash oson bo'ladi.",
    'Верно. Вариационный ряд — это САМА выборка, только записанная по возрастанию. Сохраняются две вещи: все результаты остаются на месте и их количество не меняется. Сосчитай — десять чисел, и в выборке было десять ответов. Повторы тоже остаются: двойка написана четыре раза, тройка три. После такой записи легко сосчитать частоты.',
    'Correct. A variation series is the sample ITSELF, only written in increasing order. Two things are preserved: every result stays and their count does not change. Count them — ten numbers, and the sample had ten answers. The repeats stay too: the two appears four times, the three three times. Written this way the frequencies are easy to count.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu VARIANTLARNING ro'yxati, variatsion qator emas. Unda har qiymat bir martadan yozilgan, ya'ni takrorlar tashlab ketilgan. Sanang: bu ro'yxatda to'rtta son bor, tanlanmada esa o'nta javob bo'lgan — olti natija yo'qoldi. Variantlar ro'yxati ham kerak, lekin u chastota jadvalining birinchi ustuni bo'ladi, qatorning o'zi emas.",
      'Это список ВАРИАНТОВ, а не вариационный ряд. В нём каждое значение записано по одному разу, то есть повторы отброшены. Сосчитай: в этом списке четыре числа, а в выборке было десять ответов — шесть результатов пропали. Список вариантов тоже нужен, но он становится первым столбцом таблицы частот, а не самим рядом.',
      'This is a list of VARIANTS, not a variation series. Each value is written once, so the repeats were dropped. Count: this list has four numbers while the sample had ten answers — six results vanished. A list of variants is needed too, but it becomes the first column of the frequency table, not the series itself.') },
    { when: (s) => s.picked === 2, text: L(
      "Qator tartiblangan, lekin KAMAYISH tartibida. Variatsion qator o'sish tartibida yoziladi: eng kichik natija boshida, eng kattasi oxirida. Bu shunchaki kelishuv emas — mediana o'rtadagi son sifatida topiladi, va agar bir qator o'sish, ikkinchisi kamayish tartibida bo'lsa, taqqoslash ma'nosini yo'qotadi.",
      'Ряд упорядочен, но по УБЫВАНИЮ. Вариационный ряд записывают по возрастанию: наименьший результат в начале, наибольший в конце. Это не просто соглашение — медиана находится как средний элемент, и если один ряд по возрастанию, а другой по убыванию, сравнение теряет смысл.',
      'The row is ordered, but DESCENDING. A variation series is written in increasing order: the smallest result first, the largest last. This is not mere convention — the median is found as the middle term, and if one series ascends while another descends, comparison loses its meaning.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu tanlanmaning o'zi, ya'ni javoblar KELGAN tartibda. Variatsion qator esa aynan tartiblash bilan hosil bo'ladi. Kelgan tartib tasodifiy: agar o'quvchilar boshqa navbatda javob berganda edi, qator ham boshqacha bo'lardi. Tartiblangan qator esa tanlanma haqidagi FAKT bo'lib qoladi va u navbatga bog'liq emas.",
      'Это сама выборка, то есть ответы в том порядке, в каком они пришли. А вариационный ряд получается именно упорядочиванием. Порядок поступления случаен: ответь ученики в другой очерёдности, и ряд был бы другим. Упорядоченный же ряд — это ФАКТ о выборке, и от очерёдности он не зависит.',
      'This is the sample itself, that is, the answers in the order they arrived. A variation series is produced precisely by ordering them. The order of arrival is accidental: had the students answered in a different sequence, the row would differ. An ordered series, by contrast, is a FACT about the sample and does not depend on the sequence.') },
  ],
  wrongText: L(
    "Variatsion qatorda hamma natija saqlanadi va o'sish tartibida yoziladi. Sanang: qatordagi sonlar soni tanlanma hajmiga teng bo'lishi kerak.",
    'В вариационном ряду сохраняются все результаты и записываются по возрастанию. Сосчитай: количество чисел в ряду должно быть равно объёму выборки.',
    'A variation series keeps every result and writes them in increasing order. Count: the number of terms in the series must equal the sample size.'),
};

export default function D34_01(props) { return <Choice data={DATA} {...props} />; }
