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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 3,7,8,12 ↔ kenglik=9; 4,4,6,9 ↔ moda=4; 2,5,8,11,14 ↔ mediana=8.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D45_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={6}/>;
}
