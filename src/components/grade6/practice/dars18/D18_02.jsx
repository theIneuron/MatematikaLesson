import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Proporsiyani yechish",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "Solving a proportion"
  },
  "prompt": {
    "uz": "7 : 9 = x : 36 proporsiyada noma'lum hadni ko'paytmalar tengligi orqali hisoblang.",
    "ru": "Найдите x в пропорции 7 : 9 = x : 36.",
    "en": "Work out the unknown term in the proportion 7 : 9 = x : 36 through the equality of the products."
  },
  "answer": "28",
  "explanation": {
    "uz": "9x = 7 × 36 = 252; x = 28.",
    "ru": "Правильный ответ: 28. В пропорции произведение крайних членов равно произведению средних.",
    "en": "9x = 7 × 36 = 252; x = 28."
  }
};

export default function D18_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={2}/>;
}
