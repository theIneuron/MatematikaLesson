import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "bool",
  "topic": {
    "uz": "Juft yoki toq son",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10",
    "en": "Even or odd"
  },
  "prompt": {
    "uz": "785 soni 2 ga bo'linadi.",
    "ru": "Верно ли, что число 785 делится на 2?",
    "en": "785 divides by 2."
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
  "translationsEn": {
    "Ha": "Yes",
    "Yo'q": "No"
  },
  "explanation": {
    "uz": "785 ning oxirgi raqami 5 — toq raqam. Shu sabab fikr noto'g'ri.",
    "ru": "Правильный ответ: Нет. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру.",
    "en": "The last digit of 785 is 5, and that is an odd digit. So the statement is false."
  }
};

export default function D02_05(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={5}/>;
}
