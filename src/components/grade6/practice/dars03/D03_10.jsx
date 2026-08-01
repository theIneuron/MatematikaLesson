import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Faqat 3 ga bo'linish",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9"
  },
  "prompt": {
    "uz": "3 ga bo'linadigan, lekin 9 ga bo'linmaydigan sonni toping.",
    "ru": "Найдите число, которое делится на 3, но не делится на 9."
  },
  "options": [
    "318",
    "441",
    "612",
    "729"
  ],
  "answer": "318",
  "explanation": {
    "uz": "3 + 1 + 8 = 12; u 3 ga bo'linadi, lekin 9 ga bo'linmaydi.",
    "ru": "Правильный ответ: 318. Для делимости на 3 и 9 проверяют сумму цифр числа."
  }
};

export default function D03_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={10}/>;
}
