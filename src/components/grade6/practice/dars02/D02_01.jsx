import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Juft sonni aniqlash",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10",
    "en": "Spotting an even number"
  },
  "prompt": {
    "uz": "2 ga bo'linadigan sonni toping.",
    "ru": "Найдите число, которое делится на 2.",
    "en": "Find the number that divides by 2."
  },
  "options": [
    "315",
    "428",
    "537",
    "641"
  ],
  "answer": "428",
  "explanation": {
    "uz": "428 ning oxirgi raqami 8. Juft raqam bilan tugagan son 2 ga bo'linadi.",
    "ru": "Правильный ответ: 428. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру.",
    "en": "The last digit of 428 is 8. A number that ends in an even digit divides by 2."
  }
};

export default function D02_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={1}/>;
}
