import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Iqtisodiy va ishga oid masalalar",
    "ru": "Экономические задачи и задачи на работу",
    "en": "Money problems and work problems"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "A=12·8",
    "t=144:18",
    "r=175:7"
  ],
  "right": [
    "96",
    "8",
    "25"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: A=12·8 ↔ 96; t=144:18 ↔ 8; r=175:7 ↔ 25.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: A=12·8 ↔ 96; t=144:18 ↔ 8; r=175:7 ↔ 25."
  }
};

export default function D36_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={36} task={6}/>;
}
