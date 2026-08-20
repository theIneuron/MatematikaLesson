import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "10 ga bo'linish belgisi",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10",
    "en": "The test for 10"
  },
  "prompt": {
    "uz": "10 ga bo'linadigan sonni toping.",
    "ru": "Найдите число, которое делится на 10.",
    "en": "Find the number that divides by 10."
  },
  "options": [
    "405",
    "430",
    "522",
    "615"
  ],
  "answer": "430",
  "explanation": {
    "uz": "430 ning oxirgi raqami 0, shuning uchun u 10 ga bo'linadi.",
    "ru": "Правильный ответ: 430. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру.",
    "en": "The last digit of 430 is 0, so the number divides by 10."
  }
};

export default function D02_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={4}/>;
}
