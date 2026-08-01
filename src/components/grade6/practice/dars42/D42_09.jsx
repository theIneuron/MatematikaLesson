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
    "uch",
    "tomon",
    "burchak"
  ],
  "right": [
    "A,B,C",
    "AB,BC,CA",
    "∠A,∠B,∠C"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "uch": "вершина",
    "tomon": "сторона",
    "burchak": "угол"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: uch ↔ A,B,C; tomon ↔ AB,BC,CA; burchak ↔ ∠A,∠B,∠C.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D42_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={9}/>;
}
