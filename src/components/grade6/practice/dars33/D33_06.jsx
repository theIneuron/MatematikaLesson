import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D33_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={6}/>;
}
