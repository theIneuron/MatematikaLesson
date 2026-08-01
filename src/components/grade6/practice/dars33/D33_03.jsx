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
    "2x+6x",
    "9a−4a",
    "3m+m"
  ],
  "right": [
    "8x",
    "5a",
    "4m"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "3m+m": "3m+м"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2x+6x ↔ 8x; 9a−4a ↔ 5a; 3m+m ↔ 4m.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D33_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={3}/>;
}
