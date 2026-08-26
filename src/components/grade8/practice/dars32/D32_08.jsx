// Dars32 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 8-pozitsiya)
//
// UCH BO'SHLIQ — UCHALA XOSSA. Bankdagi tuzoqlar uchta amalning
// almashinuvidan tuzilgan: «ayiriladi» birinchi bo'shliqqa (З64),
// «qo'shiladi» ikkinchisiga (З64 ning teskarisi), «bo'linadi» uchinchisiga
// (З65 ning ko'rinishi). Uchinchi tuzoq — «o'zgarmaydi».
//
// Uch tuzoqdan uchtasi ham gapga TILI bo'yicha tushadi, ya'ni ularni faqat
// misol rad etadi. Razborlar shu sababli har birida a = 2 ni chaqiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "Bir xil asosli darajalar ko'paytirilganda ko'rsatkichlar",
      'При умножении степеней с одинаковым основанием показатели',
      'When powers with the same base are multiplied, the exponents') },
    { slot: 0 },
    { text: L(
      ", bo'linganda",
      ', при делении', ', when divided they') },
    { slot: 1 },
    { text: L(
      ", daraja darajaga ko'tarilganda esa",
      ', а при возведении степени в степень', ', and when a power is raised to a power they') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("qo'shiladi", 'складываются', 'add') },
    { id: 'w2', label: L('ayiriladi', 'вычитаются', 'subtract') },
    { id: 'w3', label: L("ko'paytiriladi", 'перемножаются', 'multiply') },
    { id: 'w4', label: L("bo'linadi", 'делятся', 'divide') },
    { id: 'w5', label: L("o'zgarmaydi", 'не меняются', 'stay the same') },
    { id: 'w6', label: L('taqqoslanadi', 'сравниваются', 'are compared') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uchala xossasi bitta gapga yig'ilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va uchtasi gapga tili bo'yicha bemalol tushadi.",
    'Все три свойства урока собраны в одно предложение, но три слова выпали. В банке шесть карточек, и три из них по языку встают в предложение совершенно спокойно.',
    'All three properties of the lesson are gathered into one sentence, but three words fell out. The bank holds six cards, and three of them slot into the sentence perfectly well as language.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch amal — uch qoida, va har birining sababi ochib yozishda ko'rinadi. Ko'paytirishda ko'paytuvchilar bir joyga yig'iladi, ya'ni ularning soni qo'shiladi. Bo'lishda suratdagi ko'paytuvchilar maxrajdagilari bilan qisqaradi, ya'ni ularning soni ayiriladi. Daraja darajaga ko'tarilganda esa butun bir guruh bir necha marta takrorlanadi, ya'ni ko'paytuvchilar soni ko'paytiriladi. Uchala qoida ham p va q istalgan BUTUN son bo'lganda ishlaydi — manfiy ko'rsatkich ularni buzmaydi.",
    'Верно. Три действия — три правила, и причина каждого видна в раскрытой записи. При умножении множители собираются в одно место, значит их количество складывается. При делении множители числителя сокращаются с множителями знаменателя, значит их количество вычитается. А при возведении степени в степень целая группа повторяется несколько раз, значит количество множителей перемножается. Все три правила работают при любых ЦЕЛЫХ p и q — отрицательный показатель их не ломает.',
    'Correct. Three operations, three rules, and the reason for each shows in the unfolded record. Multiplication brings the factors together, so their count adds. Division cancels the numerator factors against the denominator ones, so their count subtracts. And raising a power to a power repeats a whole group several times, so the count of factors multiplies. All three rules hold for any WHOLE p and q — a negative exponent does not break them.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w2' || s.slots[1] === 'w1', text: L(
      "Ko'paytirish va bo'lish almashib ketdi. Ularni ajratish oson: ko'paytirish natijani KATTALASHTIRADI, bo'lish esa kichraytiradi. a ikkiga teng bo'lsa: sakkiz karra o'n olti yuz yigirma sakkiz — ko'rsatkich uchdan yettiga o'sdi; o'n olti bo'lingan sakkiz ikki — ko'rsatkich to'rtdan birga tushdi. Demak ko'paytirishda qo'shiladi, bo'lishda ayiriladi.",
      'Умножение и деление поменялись местами. Различить их легко: умножение результат УВЕЛИЧИВАЕТ, а деление уменьшает. При a равном двум: восемь на шестнадцать сто двадцать восемь — показатель вырос с трёх до семи; шестнадцать делить на восемь два — показатель упал с четырёх до одного. Значит при умножении складываются, при делении вычитаются.',
      'Multiplication and division were swapped. They are easy to tell apart: multiplication makes the result LARGER, division makes it smaller. At a equal to two: eight times sixteen is one hundred twenty-eight — the exponent rose from three to seven; sixteen divided by eight is two — the exponent fell from four to one. So multiplication adds, division subtracts.') },
    { when: (s) => s.slots[2] === 'w4', text: L(
      "«Bo'linadi» degan qoida umuman yo'q. Daraja darajaga ko'tarilganda butun bir guruh ko'paytuvchi bir necha marta takrorlanadi: a kvadratni uch marta olsangiz, a olti marta ko'paytuvchi bo'ladi. Ya'ni ko'rsatkichlar KO'PAYTIRILADI. Son bilan tekshiring: to'rtning kubi oltmish to'rt, va bu ikkining oltinchi darajasi.",
      'Правила «делятся» не существует вовсе. При возведении степени в степень целая группа множителей повторяется несколько раз: возьми a в квадрате три раза, и a окажется множителем шесть раз. Значит показатели ПЕРЕМНОЖАЮТСЯ. Проверь числом: четыре в кубе шестьдесят четыре, а это два в шестой.',
      'There is no rule that says «divide». When a power is raised to a power, a whole group of factors repeats several times: take a squared three times and a becomes a factor six times. So the exponents MULTIPLY. Check with a number: four cubed is sixty-four, and that is two to the sixth.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "«O'zgarmaydi» hech bir bo'shliqqa tushmaydi: uch amalning uchtasida ham ko'rsatkich o'zgaradi. Agar o'zgarmaganda edi, a kubni a to'rtinchi darajasiga ko'paytirganda yana a kub chiqardi — sakkiz karra o'n olti sakkizga teng bo'lardi. Bu esa noto'g'ri.",
      '«Не меняются» не подходит ни к одному пропуску: во всех трёх действиях показатель меняется. Если бы он не менялся, то a в кубе, умноженное на a в четвёртой, снова давало бы a в кубе — восемь на шестнадцать равнялось бы восьми. А это неверно.',
      '«Stay the same» fits none of the gaps: in all three operations the exponent changes. If it did not, a cubed times a to the fourth would give a cubed again — eight times sixteen would equal eight. And that is false.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni a = 2 da tekshiring: sakkiz karra o'n olti, o'n olti bo'lingan sakkiz va to'rtning kubi — uch amal, uch natija.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово при a = 2: восемь на шестнадцать, шестнадцать делить на восемь и четыре в кубе — три действия, три результата.',
      'The three traps in the bank fit the language but not the mathematics. Test each word at a = 2: eight times sixteen, sixteen divided by eight, and four cubed — three operations, three results.') },
  ],
  wrongText: L(
    "Har bo'shliqni a = 2 da tekshiring. Ko'paytirish ko'rsatkichni oshiradi, bo'lish kamaytiradi, darajaga ko'tarish esa uni bir necha barobar kattalashtiradi.",
    'Проверяй каждый пропуск при a = 2. Умножение показатель увеличивает, деление уменьшает, а возведение в степень увеличивает его в несколько раз.',
    'Check every gap at a = 2. Multiplication raises the exponent, division lowers it, and raising to a power multiplies it several times over.'),
};

export default function D32_08(props) { return <ClozeBank data={DATA} {...props} />; }
