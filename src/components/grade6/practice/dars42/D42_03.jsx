import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "3,3,5",
    "4,5,6",
    "5,5,5"
  ],
  "right": [
    "teng yonli",
    "turli tomonli",
    "teng tomonli"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "teng yonli": "равнобедренный",
    "turli tomonli": "разносторонний",
    "teng tomonli": "равносторонний"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 3,3,5 ↔ teng yonli; 4,5,6 ↔ turli tomonli; 5,5,5 ↔ teng tomonli.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D42_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={3}/>;
}
