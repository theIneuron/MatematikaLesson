import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Tenglama yordamida masalalar yechish",
    "ru": "Решение задач с помощью уравнений"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "x+x+6=40",
    "4x−5=47",
    "x/3+7=12"
  ],
  "right": [
    "17",
    "13",
    "15"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: x+x+6=40 ↔ 17; 4x−5=47 ↔ 13; x/3+7=12 ↔ 15.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D35_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={35} task={9}/>;
}
