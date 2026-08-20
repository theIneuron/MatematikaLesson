import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными",
    "en": "Working with data"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "3,7,8,12",
    "4,4,6,9",
    "2,5,8,11,14"
  ],
  "right": [
    "kenglik=9",
    "moda=4",
    "mediana=8"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "kenglik=9": "размах=9",
    "moda=4": "мода=4",
    "mediana=8": "медиана=8"
  },
  "translationsEn": {
    "kenglik=9": "range=9",
    "moda=4": "mode=4",
    "mediana=8": "median=8"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 3,7,8,12 ↔ kenglik=9; 4,4,6,9 ↔ moda=4; 2,5,8,11,14 ↔ mediana=8.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 3,7,8,12 ↔ range=9; 4,4,6,9 ↔ mode=4; 2,5,8,11,14 ↔ median=8."
  }
};

export default function D45_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={6}/>;
}
