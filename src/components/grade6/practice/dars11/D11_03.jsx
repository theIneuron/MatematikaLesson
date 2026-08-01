import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ko'paytmalarni moslashtirish",
    "ru": "Практика к уроку 11. Умножение обыкновенных дробей"
  },
  "prompt": {
    "uz": "Chap ustundagi har bir ko'paytmani hisoblang va uni o'ng ustundagi qisqarmas javobi bilan moslashtiring.",
    "ru": "Соедините каждое произведение с его сокращённым результатом."
  },
  "left": [
    "3/5 × 10/21",
    "4/9 × 3/8",
    "7/12 × 6/35"
  ],
  "right": [
    "1/10",
    "1/6",
    "2/7"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "3/5 × 10/21 = 2/7, 4/9 × 3/8 = 1/6, 7/12 × 6/35 = 1/10.",
    "ru": "Все пары найдены правильно. При умножении дробей перемножают числители и знаменатели, а результат сокращают."
  }
};

export default function D11_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={11} task={3}/>;
}
