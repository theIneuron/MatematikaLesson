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
    "1,3,3,7,9",
    "2,4,6,8",
    "5,5,5"
  ],
  "right": [
    "moda=3",
    "mediana=5",
    "o‘rtacha=5"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "moda=3": "мода=3",
    "mediana=5": "медиана=5",
    "o‘rtacha=5": "среднее=5"
  },
  "translationsEn": {
    "moda=3": "mode=3",
    "mediana=5": "median=5",
    "o‘rtacha=5": "mean=5"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 1,3,3,7,9 ↔ moda=3; 2,4,6,8 ↔ mediana=5; 5,5,5 ↔ o‘rtacha=5.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: 1,3,3,7,9 ↔ mode=3; 2,4,6,8 ↔ median=5; 5,5,5 ↔ mean=5."
  }
};

export default function D45_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={9}/>;
}
