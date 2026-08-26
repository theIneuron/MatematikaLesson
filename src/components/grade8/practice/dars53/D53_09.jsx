// Dars53 · Amaliyot 09 — Kod · 🔴 · tag: code_results
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 9-pozitsiya)
//
// KOD SONLARDAN EMAS, YOZUVLARDAN yig'iladi, va tartib ifodalarning
// tartibi bo'yicha (o'sish tartibi harflarga tegishli emas).
//   AB + BC = AC        OA − OB = BA        AB + BA = 0
// Bankdagi uch tuzoq — CA, AB, BC — hammasi harflari TESKARI yozilgan
// javob (З113).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_results', level: '🔴',
  expr: ['AB + BC', '   ', 'OA − OB', '   ', 'AB + BA'], exprSize: 16,
  cards: ['AC', 'BA', '0', 'CA', 'AB', 'BC'],
  answer: ['AC', 'BA', '0'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch belgili. Uch ifoda berilgan: birinchisi qo'shish, ikkinchisi ayirish, uchinchisi qarama-qarshi vektorlarning yig'indisi. Bu safar kod sonlardan emas, YOZUVLARDAN yig'iladi.",
    'В комнате сейф, код из трёх знаков. Даны три выражения: первое сложение, второе вычитание, третье сумма противоположных векторов. На этот раз код складывается не из чисел, а из ЗАПИСЕЙ.',
    'There is a safe in the room and its code has three signs. Three expressions are given: the first an addition, the second a subtraction, the third the sum of opposite vectors. This time the code is built not from numbers but from RECORDS.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch natijani ifodalar tartibida yozing.",
    'Запиши три результата в порядке выражений.',
    'Write the three results in the order of the expressions.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Uch ifoda uch xil ish talab qildi. Birinchisi uchburchak qoidasi: o'rtadagi B tushadi, AC qoladi. Ikkinchisi ayirma: strelka ayirilayotgan vektorning uchidan, ya'ni B dan boshlanadi va A da tugaydi — BA. Uchinchisida A dan chiqib A ga qaytdik, ya'ni surilish yo'q, natija nol vektor. Bankdagi CA, AB va BC uchtasi ham to'g'ri javobning harflari TESKARI yozilgani.",
    'Верно. Три выражения потребовали трёх разных действий. Первое правило треугольника: средняя B выпадает, остаётся AC. Второе разность: стрелка начинается в конце вычитаемого вектора, то есть в B, и кончается в A — BA. В третьем из A вышли и в A вернулись, перемещения нет, результат нулевой вектор. А CA, AB и BC в банке это те же верные ответы с ОБРАТНЫМ порядком букв.',
    'Correct. The three expressions called for three different actions. The first is the triangle rule: the middle B drops out and AC remains. The second is a difference: the arrow starts at the end of the subtracted vector, that is at B, and ends at A — BA. In the third we left A and returned to A, so there is no displacement and the result is the zero vector. The CA, AB and BC in the bank are the same correct answers with the letters REVERSED.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('CA') !== -1 || s.slots.indexOf('AB') !== -1, text: L(
      "Kodga harflari teskari yozilgan javob tushib qoldi. CA va AC bir kesmada yotadi, lekin ular BOSHQA vektor: biri C dan A ga, ikkinchisi A dan C ga qaraydi. Har javobni yozgandan keyin bitta savol bering: strelka QAYERDAN chiqadi va QAYERGA boradi.",
      'В код попал ответ с обратным порядком букв. CA и AC лежат на одном отрезке, но это РАЗНЫЕ векторы: один смотрит из C в A, другой из A в C. Записав каждый ответ, задай один вопрос: ОТКУДА выходит стрелка и КУДА идёт.',
      'An answer with reversed letters got into the code. CA and AC lie on the same segment, but they are DIFFERENT vectors: one points from C to A, the other from A to C. After writing each answer, ask one question: where does the arrow START and where does it GO.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Nol vektor tushib qoldi. AB qo'shuv BA da A dan chiqib B ga bordik, keyin B dan A ga qaytdik — boshlangan joyimizga keldik. Surilish yo'q, demak natija nol vektor. Uchburchak qoidasi ham buni beradi: o'rtadagi B tushadi va AA qoladi.",
      'Нулевой вектор выпал. В AB плюс BA из A пришли в B, потом из B вернулись в A — оказались там, откуда вышли. Перемещения нет, значит результат нулевой вектор. Правило треугольника даёт то же: средняя B выпадает и остаётся AA.',
      'The zero vector is missing. In AB plus BA we went from A to B, then back from B to A — we ended where we began. There is no displacement, so the result is the zero vector. The triangle rule gives the same: the middle B drops out and AA remains.') },
    { when: () => true, text: L(
      "Uch natijani ifodalar tartibida yozing. Qo'shishda zanjirning boshi va oxiri olinadi; ayirishda strelka ayirilayotgan vektorning uchidan boshlanadi.",
      'Запиши три результата в порядке выражений. При сложении берутся начало и конец цепочки; при вычитании стрелка начинается в конце вычитаемого вектора.',
      'Write the three results in the order of the expressions. In addition the start and end of the chain are taken; in subtraction the arrow starts at the end of the subtracted vector.') },
  ],
  wrongText: L(
    "Har javobda strelka qayerdan chiqib qayerga borishini tekshiring: AC va CA boshqa vektor.",
    'В каждом ответе проверь, откуда выходит стрелка и куда идёт: AC и CA это разные векторы.',
    'In each answer check where the arrow starts and where it goes: AC and CA are different vectors.'),
};

export default function D53_09(props) { return <CodeLock data={DATA} {...props} />; }
