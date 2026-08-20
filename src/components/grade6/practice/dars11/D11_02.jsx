import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Natijaning surati",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей",
    "en": "The numerator of the result"
  },
  "prompt": {
    "uz": "7/10 × 5/14 ko'paytmani oldindan qisqartirib hisoblang. Hosil bo'lgan qisqarmas kasrning suratini yozing.",
    "ru": "Вычислите 7/10 × 5/14 и запишите числитель несократимой дроби.",
    "en": "Work out the product 7/10 × 5/14 by cancelling first. Write the numerator of the fraction you get in its simplest form."
  },
  "answer": "1",
  "explanation": {
    "uz": "7/10 × 5/14 da 7 bilan 14, 5 bilan 10 qisqaradi. Natija 1/4, uning surati 1.",
    "ru": "Правильный ответ: 1. При умножении дробей перемножают числители и знаменатели, а результат сокращают.",
    "en": "In 7/10 × 5/14 the 7 cancels with the 14 and the 5 with the 10. The result is 1/4, and its numerator is 1."
  }
};

export default function D11_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={2}/>;
}
