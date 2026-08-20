import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "d=8,π=3",
    "r=10,π=3,14",
    "d=14,π=22/7"
  ],
  "right": [
    "24",
    "62,8",
    "44"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: d=8,π=3 ↔ 24; r=10,π=3,14 ↔ 62,8; d=14,π=22/7 ↔ 44.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: d=8, π=3 ↔ 24; r=10, π=3,14 ↔ 62,8; d=14, π=22/7 ↔ 44."
  }
};

export default function D38_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={9}/>;
}
