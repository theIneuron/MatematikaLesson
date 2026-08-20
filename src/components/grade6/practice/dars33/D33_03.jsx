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
    "3m+m": "3m+m"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2x+6x ↔ 8x; 9a−4a ↔ 5a; 3m+m ↔ 4m.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 2x+6x ↔ 8x; 9a−4a ↔ 5a; 3m+m ↔ 4m."
  }
};

export default function D33_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={3}/>;
}
