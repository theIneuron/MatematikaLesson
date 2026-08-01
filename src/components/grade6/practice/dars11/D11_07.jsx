import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Oldindan qisqartirish",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей"
  },
  "prompt": {
    "uz": "9/14 × 7/15 ko'paytmada diagonal sonlarni oldindan qisqartiring va eng sodda natijani tanlang.",
    "ru": "Сократите множители и вычислите 9/14 × 7/15."
  },
  "options": [
    "3/10",
    "7/30",
    "9/22",
    "63/210"
  ],
  "answer": "3/10",
  "explanation": {
    "uz": "9/14 × 7/15 da 7 bilan 14, 9 bilan 15 qisqaradi. Qolgan ko'paytma 3/10.",
    "ru": "Правильный ответ: 3/10. При умножении дробей перемножают числители и знаменатели, а результат сокращают."
  }
};

export default function D11_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={7}/>;
}
