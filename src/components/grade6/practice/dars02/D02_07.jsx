import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "2 va 5 ga bo'linish",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10",
    "en": "Divisible by 2 and by 5"
  },
  "prompt": {
    "uz": "Bir vaqtda 2 va 5 ga bo'linadigan sonni toping.",
    "ru": "Найдите число, которое одновременно делится на 2 и 5.",
    "en": "Find the number that divides by 2 and by 5 at the same time."
  },
  "options": [
    "340",
    "455",
    "612",
    "735"
  ],
  "answer": "340",
  "explanation": {
    "uz": "340 nol bilan tugaydi, demak u 2 va 5 ga bir vaqtda bo'linadi.",
    "ru": "Правильный ответ: 340. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру.",
    "en": "340 ends in zero, so it divides by 2 and by 5 at the same time."
  }
};

export default function D02_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={7}/>;
}
