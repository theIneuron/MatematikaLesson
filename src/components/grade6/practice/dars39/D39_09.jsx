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
    "r=7,π=22/7",
    "r=10,π=3",
    "r=1,5,π=3"
  ],
  "right": [
    "154",
    "300",
    "6,75"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: r=7,π=22/7 ↔ 154; r=10,π=3 ↔ 300; r=1,5,π=3 ↔ 6,75.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D39_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={9}/>;
}
