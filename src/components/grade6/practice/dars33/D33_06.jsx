import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых",
    "en": "Collecting like terms"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "6x−9x",
    "2a+7−a",
    "4m+3m−2m"
  ],
  "right": [
    "−3x",
    "a+7",
    "5m"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 6x−9x ↔ −3x; 2a+7−a ↔ a+7; 4m+3m−2m ↔ 5m.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 6x−9x ↔ −3x; 2a+7−a ↔ a+7; 4m+3m−2m ↔ 5m."
  }
};

export default function D33_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={6}/>;
}
