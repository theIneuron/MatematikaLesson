import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Hadlar ko'paytmasi",
    "ru": "Практика к уроку 18. Пропорция"
  },
  "prompt": {
    "uz": "Proporsiyadagi ko'paytmalarni mos natija bilan bog'lang va tenglikning to'g'riligini tekshiring.",
    "ru": "Соедините произведения членов пропорции с их значениями."
  },
  "left": [
    "3 × 20",
    "8 × 15",
    "14 × 18"
  ],
  "right": [
    "252",
    "120",
    "60"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "3 × 20 = 60; 8 × 15 = 120; 14 × 18 = 252.",
    "ru": "Все пары найдены правильно. В пропорции произведение крайних членов равно произведению средних."
  }
};

export default function D18_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={6}/>;
}
