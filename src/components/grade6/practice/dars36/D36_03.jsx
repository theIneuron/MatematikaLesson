import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "6·7000",
    "48000:8",
    "90000−65000"
  ],
  "right": [
    "42 000",
    "6 000",
    "25 000"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 6·7000 ↔ 42 000; 48000:8 ↔ 6 000; 90000−65000 ↔ 25 000.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D36_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={3}/>;
}
