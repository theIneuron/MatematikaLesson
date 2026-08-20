import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника",
    "en": "Elements, kinds and perimeter of a triangle"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
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
  "translationsEn": {
    "uch": "the vertices",
    "tomon": "the sides",
    "burchak": "the angles"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: uch ↔ A,B,C; tomon ↔ AB,BC,CA; burchak ↔ ∠A,∠B,∠C.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: the vertices ↔ A,B,C; the sides ↔ AB,BC,CA; the angles ↔ ∠A,∠B,∠C."
  }
};

export default function D42_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={9}/>;
}
