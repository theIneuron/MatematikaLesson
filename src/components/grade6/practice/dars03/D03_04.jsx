import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "9 ga bo'linadigan son",
    "ru": "Практика к уроку 3. Признаки делимости на 3 и 9",
    "en": "Divisible by 9"
  },
  "prompt": {
    "uz": "9 ga bo'linadigan sonni toping.",
    "ru": "Найдите число, которое делится на 9.",
    "en": "Find the number that divides by 9."
  },
  "options": [
    "316",
    "423",
    "527",
    "614"
  ],
  "answer": "423",
  "explanation": {
    "uz": "4 + 2 + 3 = 9. Shu sabab 423 soni 9 ga bo'linadi.",
    "ru": "Правильный ответ: 423. Для делимости на 3 и 9 проверяют сумму цифр числа.",
    "en": "4 + 2 + 3 = 9. That is why 423 divides by 9."
  }
};

export default function D03_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={3} task={4}/>;
}
