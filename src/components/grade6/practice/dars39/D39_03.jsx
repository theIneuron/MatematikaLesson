import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "r=2,π=3",
    "r=5,π=3,14",
    "d=8,π=3"
  ],
  "right": [
    "12",
    "78,5",
    "48"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: r=2,π=3 ↔ 12; r=5,π=3,14 ↔ 78,5; d=8,π=3 ↔ 48.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D39_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={3}/>;
}
