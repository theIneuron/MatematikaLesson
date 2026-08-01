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
    "3a+2b−a",
    "8x−x+4",
    "5m−2+2m−6"
  ],
  "right": [
    "2a+2b",
    "7x+4",
    "7m−8"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 3a+2b−a ↔ 2a+2b; 8x−x+4 ↔ 7x+4; 5m−2+2m−6 ↔ 7m−8.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D33_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={9}/>;
}
