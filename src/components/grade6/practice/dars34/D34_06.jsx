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
    "4x+3=19",
    "7−x=10",
    "3x−8=13"
  ],
  "right": [
    "4",
    "−3",
    "7"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 4x+3=19 ↔ 4; 7−x=10 ↔ −3; 3x−8=13 ↔ 7.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D34_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={6}/>;
}
