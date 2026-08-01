import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Juft yoki toq son",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10"
  },
  "prompt": {
    "uz": "785 soni 2 ga bo'linadi.",
    "ru": "Верно ли, что число 785 делится на 2?"
  },
  "options": [
    "Ha",
    "Yo'q"
  ],
  "answer": "Yo'q",
  "translationsRu": {
    "Ha": "Да",
    "Yo'q": "Нет"
  },
  "explanation": {
    "uz": "785 ning oxirgi raqami 5 — toq raqam. Shu sabab fikr noto'g'ri.",
    "ru": "Правильный ответ: Нет. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру."
  }
};

export default function D02_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={5}/>;
}
