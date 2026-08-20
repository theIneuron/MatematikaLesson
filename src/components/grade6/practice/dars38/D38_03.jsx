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
    "r=4, π=3",
    "d=10, π=3,14",
    "r=7, π=22/7"
  ],
  "right": [
    "24",
    "31,4",
    "44"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: r=4, π=3 ↔ 24; d=10, π=3,14 ↔ 31,4; r=7, π=22/7 ↔ 44.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: r=4, π=3 ↔ 24; d=10, π=3,14 ↔ 31,4; r=7, π=22/7 ↔ 44."
  }
};

export default function D38_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={3}/>;
}
