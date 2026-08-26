// Dars32 · Amaliyot 02 — Test · 🟢 · tag: product_exponent
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 2-pozitsiya)
//
// KO'PAYTIRISH, LEKIN IKKINCHI KO'RSATKICH MANFIY. Uch xato variant uch
// xil qoidani noto'g'ri qo'llaydi:
//   a⁸    — ko'rsatkichlar ayirildi: 3 − (−5) = 8  (З64)
//   a⁻¹⁵  — ko'rsatkichlar ko'paytirildi            (З65)
//   a²    — manfiy ko'rsatkichning ishorasi tashlab ketildi
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'product_exponent', level: '🟢',
  correct: 0, optCols: 4, optSize: 20,
  expr: ['a³ · a⁻⁵'], exprSize: 32,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Ikki daraja ko'paytirilyapti, asoslari bir xil. Ikkinchi ko'rsatkich manfiy, lekin bu qoidani o'zgartirmaydi — u faqat hisobni ehtiyot qilishni talab qiladi.",
    'Перемножаются две степени с одинаковым основанием. Второй показатель отрицательный, но правило от этого не меняется — оно лишь требует аккуратности в счёте.',
    'Two powers with the same base are multiplied. The second exponent is negative, but that does not change the rule — it only asks for care in the arithmetic.'),
  ask: L("Ko'paytma qaysi darajaga teng?", 'Какой степени равно произведение?', 'Which power does the product equal?'),
  opts: [
    { label: ['a⁻²'] },
    { label: ['a⁸'] },
    { label: ['a⁻¹⁵'] },
    { label: ['a²'] },
  ],
  correctText: L(
    "To'g'ri. Ko'paytirishda ko'rsatkichlar qo'shiladi: uch qo'shuv minus besh minus ikki. Ochib yozsangiz ham ko'rinadi: a kub — bu uchta a, a ning minus beshinchi darajasi — bu maxrajdagi beshta a. Uchta a qisqaradi, maxrajda ikkita a qoladi, ya'ni bir bo'lingan a kvadrat. Bu esa a ning minus ikkinchi darajasi. Son bilan tekshiring: a ikkiga teng bo'lsa, sakkiz karra bir o'ttiz ikkidan bir to'rtdan beradi, va bu ikkining minus ikkinchi darajasi.",
    'Верно. При умножении показатели складываются: три плюс минус пять минус два. Это видно и в раскрытом виде: a в кубе это три множителя a, a в минус пятой это пять множителей a в знаменателе. Три сокращаются, в знаменателе остаётся два, то есть единица делить на a в квадрате. А это и есть a в минус второй. Проверь числом: при a равном двум восемь, умноженное на одну тридцать вторую, даёт одну четвёртую, и это два в минус второй.',
    'Correct. Multiplication adds the exponents: three plus minus five is minus two. Unfolding shows it too: a cubed is three factors of a, a to the minus five is five factors of a in the denominator. Three cancel, two remain below, that is one divided by a squared. And that is a to the minus two. Check with a number: at a equal to two, eight times one thirty-second is one quarter, which is two to the minus two.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ko'rsatkichlar AYIRILDI: uch minus minus besh sakkiz. Lekin bu yerda amal ko'paytirish, ayirish esa BO'LISHGA tegishli. Belgiga qarang — nuqta turibdi, ikki nuqta emas. Ko'paytirishda ko'rsatkichlar qo'shiladi: uch qo'shuv minus besh minus ikki. Son bilan tekshiring: a ikkiga teng bo'lsa, sakkiz karra bir o'ttiz ikkidan bir to'rtdan, ikki yuz ellik olti emas.",
      'Показатели ВЫЧЛИ: три минус минус пять восемь. Но здесь действие умножение, а вычитание относится к ДЕЛЕНИЮ. Посмотри на знак — стоит точка, а не двоеточие. При умножении показатели складываются: три плюс минус пять минус два. Проверь числом: при a равном двум восемь на одну тридцать вторую это одна четвёртая, а не двести пятьдесят шесть.',
      'The exponents were SUBTRACTED: three minus minus five is eight. But the operation here is multiplication, and subtraction belongs to DIVISION. Look at the sign — a dot, not a colon. Multiplication adds the exponents: three plus minus five is minus two. Check with a number: at a equal to two, eight times one thirty-second is one quarter, not two hundred fifty-six.') },
    { when: (s) => s.picked === 2, text: L(
      "Ko'rsatkichlar KO'PAYTIRILDI: uch karra minus besh minus o'n besh. Ko'paytirish esa boshqa holga tegishli — daraja yana darajaga ko'tarilganda, ya'ni yozuvda QAVS turganda. Bu yerda qavs yo'q, ikki daraja shunchaki ko'paytirilyapti. Ochib yozing: uchta a va maxrajdagi beshta a. Qisqartirgandan keyin maxrajda ikkita a qoladi, o'n beshta emas.",
      'Показатели ПЕРЕМНОЖИЛИ: трижды минус пять минус пятнадцать. Но умножение относится к другому случаю — когда степень возводят в степень, то есть когда в записи есть СКОБКА. Здесь скобки нет, просто перемножаются две степени. Распиши: три множителя a и пять в знаменателе. После сокращения в знаменателе останется два, а не пятнадцать.',
      'The exponents were MULTIPLIED: three times minus five is minus fifteen. But multiplying belongs to another case — raising a power to a power, that is when the record has a BRACKET. There is no bracket here, just two powers being multiplied. Unfold it: three factors of a and five in the denominator. After cancelling, two remain below, not fifteen.') },
    { when: (s) => s.picked === 3, text: L(
      "Ko'rsatkichlarning kattaligi to'g'ri topildi, ishorasi esa yo'qoldi. Uch qo'shuv minus besh — bu manfiy son, chunki qo'shiladigan manfiy son kattaroq. Son o'qida ko'ring: uchdan chapga besh qadam yursangiz minus ikkiga tushasiz. Javob a ning MINUS ikkinchi darajasi, ya'ni maxrajda turgan daraja.",
      'Величина показателя найдена верно, а знак потерян. Три плюс минус пять — число отрицательное, потому что прибавляемое отрицательное больше по модулю. Посмотри на числовой оси: от трёх пять шагов влево приводят в минус два. Ответ a в МИНУС второй, то есть степень в знаменателе.',
      'The size of the exponent was found correctly, but the sign was lost. Three plus minus five is negative, because the negative being added is larger in size. See it on the number line: five steps left from three land on minus two. The answer is a to the MINUS two, that is a power in the denominator.') },
  ],
  wrongText: L(
    "Belgiga qarang: nuqta — ko'paytirish, ya'ni ko'rsatkichlar qo'shiladi. Qo'shishda manfiy sonni ehtiyot bo'lib qo'shing va javobni a = 2 da tekshiring.",
    'Смотри на знак: точка — умножение, значит показатели складываются. Складывай с отрицательным аккуратно и проверь ответ при a = 2.',
    'Look at the sign: a dot means multiplication, so the exponents add. Add the negative carefully and check the answer at a = 2.'),
};

export default function D32_02(props) { return <Choice data={DATA} {...props} />; }
