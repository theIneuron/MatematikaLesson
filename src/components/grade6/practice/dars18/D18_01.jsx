import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Noma'lum had",
    "ru": "Практика к уроку 18. Пропорция"
  },
  "prompt": {
    "uz": "3 : 5 = 12 : x proporsiyada chetki va o'rta hadlar ko'paytmasidan foydalanib, noma'lum hadni toping.",
    "ru": "Найдите неизвестный член пропорции 3 : 5 = 12 : x."
  },
  "options": [
    "15",
    "18",
    "20",
    "24"
  ],
  "answer": "20",
  "explanation": {
    "uz": "3x = 5 × 12 = 60, shuning uchun x = 20.",
    "ru": "Правильный ответ: 20. В пропорции произведение крайних членов равно произведению средних."
  }
};

export default function D18_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={1}/>;
}
