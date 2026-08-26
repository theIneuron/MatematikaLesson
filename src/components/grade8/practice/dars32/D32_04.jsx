// Dars32 · Amaliyot 04 — Tartib · 🟡 · tag: simplify_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 4-pozitsiya)
//
// IKKI XOSSA KETMA-KET, VA ULAR BIR-BIRIGA O'XSHAMAYDI:
//   qavs -> ko'rsatkichlar KO'PAYTIRILADI (T3, З65 ning joyi)
//   ko'paytma -> ko'rsatkichlar QO'SHILADI (T1, З64 ning joyi)
// Ikkovi bitta ifodada turgani ataylab: o'quvchi ikkalasini bir xil qoida
// deb o'ylaydi va aynan shu yerda adashadi.
//
// To'rtinchi qadam — SON bilan tekshirish (З16). U isbot emas, nazorat:
// a = 2 da 64 : 16 = 4, va a² ham to'rtga teng.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'simplify_steps', level: '🟡',
  expr: ['(a²)³ · a⁻⁴'], exprSize: 26,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['a⁶ · a⁻⁴'],
      label: L("qavsni ochamiz, ko'rsatkichlarni ko'paytiramiz", 'раскрываем скобку, показатели перемножаем', 'open the bracket, multiply the exponents') },
    { id: 'l2', tokens: ['a⁶⁺⁽⁻⁴⁾'],
      label: L("ko'paytmada ko'rsatkichlarni qo'shamiz", 'в произведении показатели складываем', 'in the product, add the exponents') },
    { id: 'l3', tokens: ['a²'],
      label: L('natijani yozamiz', 'записываем результат', 'write the result') },
    { id: 'l4', tokens: ['64 : 16 = 4'],
      label: L('a = 2 da tekshiramiz', 'проверяем при a = 2', 'check at a = 2') },
  ],
  start: ['l2', 'l4', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Ifodada ikki xossa ketma-ket ishlatiladi, va ular bir xil emas: bittasi ko'rsatkichlarni ko'paytiradi, ikkinchisi qo'shadi. Qadamlar aralashib ketgan.",
    'В выражении подряд работают два свойства, и они не одинаковы: одно перемножает показатели, другое складывает. Шаги перепутаны.',
    'Two properties work one after another in this expression, and they are not the same: one multiplies the exponents, the other adds them. The steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval qavs ochiladi: daraja darajaga ko'tarilgan, ya'ni ko'rsatkichlar KO'PAYTIRILADI — ikki karra uch olti. Endi ifodada ikki daraja ko'paytirilyapti, va bu yerda qoida boshqa: ko'rsatkichlar QO'SHILADI — olti qo'shuv minus to'rt. Natija a kvadrat. Oxirida son bilan tekshiramiz: a ikkiga teng bo'lsa, dastlabki ifoda to'rtning kubini o'n oltiga bo'lishga aylanadi, ya'ni oltmish to'rt bo'lingan o'n olti — to'rt. a kvadrat ham to'rtga teng. Ikki xossa yonma-yon turganda ularni ajratish shart: bittasi ko'paytiradi, ikkinchisi qo'shadi.",
    'Верно. Сначала раскрывается скобка: степень возведена в степень, значит показатели ПЕРЕМНОЖАЮТСЯ — дважды три шесть. Теперь в выражении перемножаются две степени, и здесь правило другое: показатели СКЛАДЫВАЮТСЯ — шесть плюс минус четыре. Результат a в квадрате. В конце проверяем числом: при a равном двум исходное выражение превращается в четыре в кубе делить на шестнадцать, то есть шестьдесят четыре делить на шестнадцать — четыре. И a в квадрате тоже четыре. Когда два свойства стоят рядом, их обязательно надо различать: одно перемножает, другое складывает.',
    'Correct. First the bracket opens: a power raised to a power, so the exponents MULTIPLY — two times three is six. Now two powers are being multiplied, and there the rule differs: the exponents ADD — six plus minus four. The result is a squared. At the end we check with a number: at a equal to two the original expression becomes four cubed divided by sixteen, that is sixty-four divided by sixteen — four. And a squared is four as well. When two properties stand side by side they must be told apart: one multiplies, the other adds.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ko'rsatkichlarni qo'shish QAVS OCHILGANDAN keyin bo'ladi. Qavs ochilmagunicha qo'shiladigan ko'rsatkichlar hali yo'q: yozuvda ikki, uch va minus to'rt turibdi, ulardan qaysi ikkitasini qo'shish kerakligi noaniq. Qavs ochilgandan keyin esa aniq: olti va minus to'rt.",
      'Сложение показателей идёт ПОСЛЕ раскрытия скобки. Пока скобка не раскрыта, складывать нечего: в записи стоят два, три и минус четыре, и неясно, какие два из них складывать. После раскрытия ясно: шесть и минус четыре.',
      'Adding the exponents comes AFTER the bracket is opened. Until then there is nothing to add: the record holds two, three and minus four, and it is unclear which two to add. After opening it is clear: six and minus four.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Son bilan tekshirish ENG OXIRGI qadam: tekshiriladigan natija hali topilmagan. Tekshiruv yangi ish qilmaydi — u tayyor javobni dastlabki ifoda bilan solishtiradi. Natija a kvadrat, va uni oltmish to'rt bo'lingan o'n olti bilan taqqoslash kerak.",
      'Проверка числом — САМЫЙ ПОСЛЕДНИЙ шаг: проверять пока нечего, результат ещё не найден. Проверка не делает новой работы — она сравнивает готовый ответ с исходным выражением. Результат a в квадрате, и его надо сравнить с шестьюдесятью четырьмя, делёнными на шестнадцать.',
      'Checking with a number is the VERY LAST step: there is nothing to check yet, the result has not been found. The check does no new work — it compares the finished answer with the original expression. The result is a squared, to be compared with sixty-four divided by sixteen.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Tekshiruvdan yoki tayyor javobdan boshlab bo'lmaydi — ular ishning natijasi. Birinchi qadam yozuvning eng tashqi qismini ochadi: qavs ichida daraja turibdi, va u yana darajaga ko'tarilgan.",
      'Начинать с проверки или с готового ответа нельзя — они результат работы. Первый шаг раскрывает самую внешнюю часть записи: в скобке степень, и она возведена ещё в степень.',
      'You cannot start with the check or the finished answer — they are the result of the work. The first step opens the outermost part of the record: a power inside a bracket, raised to a power again.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Natijani yozish QO'SHISHDAN keyin bo'ladi: a kvadrat oltiga minus to'rt qo'shilgandan chiqadi. Undan oldin natija hali yig'ilmagan — yozuvda ko'paytma turibdi, bitta daraja emas.",
      'Запись результата идёт ПОСЛЕ сложения: a в квадрате получается из шести плюс минус четыре. До этого результат ещё не собран — в записи стоит произведение, а не одна степень.',
      'Writing the result comes AFTER the addition: a squared comes from six plus minus four. Before that the result is not assembled — the record holds a product, not a single power.') },
  ],
  wrongText: L(
    "Qavs birinchi, tekshiruv oxirgi. Qavsda ko'rsatkichlar ko'paytiriladi, ko'paytmada esa qo'shiladi — bu ikki boshqa qoida.",
    'Скобка первой, проверка последней. В скобке показатели перемножаются, а в произведении складываются — это два разных правила.',
    'The bracket first, the check last. Inside a bracket the exponents multiply, in a product they add — two different rules.'),
};

export default function D32_04(props) { return <SwapOrder data={DATA} {...props} />; }
