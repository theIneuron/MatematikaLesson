import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Proporsiyalarni moslashtirish",
    "ru": "Практика к уроку 18. Пропорция",
    "en": "Matching proportions"
  },
  "prompt": {
    "uz": "Har bir proporsiyadagi noma'lum x qiymatini toping va mos javob bilan bog'lang.",
    "ru": "Найдите x в каждой пропорции и соедините с ответом.",
    "en": "Find the value of the unknown x in each proportion and connect it with the right answer."
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
    "ru": "Все пары найдены правильно. В пропорции произведение крайних членов равно произведению средних.",
    "en": "2 : 7 = 6 : 21; 5 : 8 = 15 : 24; 12 : 15 = 4 : 5."
  }
};

export default function D18_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={18} task={3}/>;
}
