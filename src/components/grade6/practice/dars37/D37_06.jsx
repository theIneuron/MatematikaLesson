import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг",
    "en": "The circle and the disc"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "r=5",
    "d=18",
    "r=12"
  ],
  "right": [
    "d=10",
    "r=9",
    "d=24"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: r=5 ↔ d=10; d=18 ↔ r=9; r=12 ↔ d=24.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: r=5 ↔ d=10; d=18 ↔ r=9; r=12 ↔ d=24."
  }
};

export default function D37_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={6}/>;
}
