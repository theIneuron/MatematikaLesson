import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Proporsiyalarni moslashtirish",
    "ru": "Практика к уроку 18. Пропорция"
  },
  "prompt": {
    "uz": "Har bir proporsiyadagi noma'lum x qiymatini toping va mos javob bilan bog'lang.",
    "ru": "Найдите x в каждой пропорции и соедините с ответом."
  },
  "left": [
    "2 : 7 = 6 : x",
    "5 : 8 = x : 24",
    "x : 15 = 4 : 5"
  ],
  "right": [
    "12",
    "21",
    "15"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "explanation": {
    "uz": "2 : 7 = 6 : 21; 5 : 8 = 15 : 24; 12 : 15 = 4 : 5.",
    "ru": "Все пары найдены правильно. В пропорции произведение крайних членов равно произведению средних."
  }
};

export default function D18_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={3}/>;
}
