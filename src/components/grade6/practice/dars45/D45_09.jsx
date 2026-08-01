import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 1,3,3,7,9 ↔ moda=3; 2,4,6,8 ↔ mediana=5; 5,5,5 ↔ o‘rtacha=5.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D45_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={9}/>;
}
