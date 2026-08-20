import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений",
    "en": "Solving problems with equations"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "x+(x+4)=30",
    "2x+7=25",
    "5x−6=34"
  ],
  "right": [
    "13",
    "9",
    "8"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: x+(x+4)=30 ↔ 13; 2x+7=25 ↔ 9; 5x−6=34 ↔ 8.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: x+(x+4)=30 ↔ 13; 2x+7=25 ↔ 9; 5x−6=34 ↔ 8."
  }
};

export default function D35_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={6}/>;
}
