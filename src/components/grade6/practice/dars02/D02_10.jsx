import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Noma'lum raqam",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10",
    "en": "The unknown digit"
  },
  "prompt": {
    "uz": "47□ soni 10 ga bo'linishi uchun katakka qaysi raqam yoziladi?",
    "ru": "Какую цифру нужно поставить вместо □ в числе 47□, чтобы оно делилось на 10?",
    "en": "Which digit goes in the box so that 47□ divides by 10?"
  },
  "options": [
    "0",
    "2",
    "5",
    "8"
  ],
  "answer": "0",
  "explanation": {
    "uz": "47□ soni 10 ga bo'linishi uchun oxirgi raqam 0 bo'lishi kerak.",
    "ru": "Правильный ответ: 0. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру.",
    "en": "For 47□ to divide by 10 its last digit has to be 0."
  }
};

export default function D02_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={10}/>;
}
