import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Sonning kasr qismi",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей"
  },
  "prompt": {
    "uz": "Har bir sonning berilgan kasr qismini hisoblang va hosil bo'lgan natijalar bilan to'g'ri juftlang.",
    "ru": "Найдите указанную часть каждого числа и соедините с ответом."
  },
  "left": [
    "24 ning 5/8 qismi",
    "36 ning 7/9 qismi",
    "40 ning 3/5 qismi"
  ],
  "right": [
    "15",
    "24",
    "28"
  ],
  "pairs": [
    0,
    2,
    1
  ],
  "translationsRu": {
    "24 ning 5/8 qismi": "24  от  5/8 часть",
    "36 ning 7/9 qismi": "36  от  7/9 часть",
    "40 ning 3/5 qismi": "40  от  3/5 часть"
  },
  "explanation": {
    "uz": "24 × 5/8 = 15, 36 × 7/9 = 28 va 40 × 3/5 = 24.",
    "ru": "Все пары найдены правильно. При умножении дробей перемножают числители и знаменатели, а результат сокращают."
  }
};

export default function D11_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={6}/>;
}
