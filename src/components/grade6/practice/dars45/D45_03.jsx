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
    "2,2,3,5",
    "1,4,7",
    "6,8,10,12"
  ],
  "right": [
    "moda=2",
    "mediana=4",
    "o‘rtacha=9"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "moda=2": "мода=2",
    "mediana=4": "медиана=4",
    "o‘rtacha=9": "среднее=9"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2,2,3,5 ↔ moda=2; 1,4,7 ↔ mediana=4; 6,8,10,12 ↔ o‘rtacha=9.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D45_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={3}/>;
}
