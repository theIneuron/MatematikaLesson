import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения",
    "en": "Linear equations"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "x−4=11",
    "2x=24",
    "x+7=3"
  ],
  "right": [
    "15",
    "12",
    "−4"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: x−4=11 ↔ 15; 2x=24 ↔ 12; x+7=3 ↔ −4.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: x−4=11 ↔ 15; 2x=24 ↔ 12; x+7=3 ↔ −4."
  }
};

export default function D34_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={3}/>;
}
