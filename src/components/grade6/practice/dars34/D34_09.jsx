import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "5x−2=3x+12",
    "3(x−1)=15",
    "8−2x=14"
  ],
  "right": [
    "7",
    "6",
    "−3"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 5x−2=3x+12 ↔ 7; 3(x−1)=15 ↔ 6; 8−2x=14 ↔ −3.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D34_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={9}/>;
}
