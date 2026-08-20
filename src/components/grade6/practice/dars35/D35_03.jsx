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
    "x+8=25",
    "3x=42",
    "x−9=16"
  ],
  "right": [
    "17",
    "14",
    "25"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: x+8=25 ↔ 17; 3x=42 ↔ 14; x−9=16 ↔ 25.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: x+8=25 ↔ 17; 3x=42 ↔ 14; x−9=16 ↔ 25."
  }
};

export default function D35_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={3}/>;
}
