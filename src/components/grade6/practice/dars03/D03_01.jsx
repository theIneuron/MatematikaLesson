import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "3 ga bo'linish",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9",
    "en": "Divisible by 3"
  },
  "prompt": {
    "uz": "3 ga bo'linadigan sonni toping.",
    "ru": "Найдите число, которое делится на 3.",
    "en": "Find the number that divides by 3."
  },
  "options": [
    "124",
    "231",
    "415",
    "502"
  ],
  "answer": "231",
  "explanation": {
    "uz": "231 raqamlari yig'indisi 2 + 3 + 1 = 6; 6 soni 3 ga bo'linadi.",
    "ru": "Правильный ответ: 231. Для делимости на 3 и 9 проверяют сумму цифр числа.",
    "en": "The digits of 231 add up to 2 + 3 + 1 = 6; and 6 divides by 3."
  }
};

export default function D03_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={1}/>;
}
