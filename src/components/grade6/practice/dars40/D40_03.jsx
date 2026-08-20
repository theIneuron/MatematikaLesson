import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "kvadrat",
    "to‘g‘ri to‘rtburchak",
    "turli tomonli uchburchak"
  ],
  "right": [
    "4",
    "2",
    "0"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "kvadrat": "квадрат",
    "to‘g‘ri to‘rtburchak": "прямоугольник",
    "turli tomonli uchburchak": "разносторонний треугольник"
  },
  "translationsEn": {
    "kvadrat": "a square",
    "to‘g‘ri to‘rtburchak": "a rectangle",
    "turli tomonli uchburchak": "a scalene triangle"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: kvadrat ↔ 4; to‘g‘ri to‘rtburchak ↔ 2; turli tomonli uchburchak ↔ 0.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: a square ↔ 4; a rectangle ↔ 2; a scalene triangle ↔ 0."
  }
};

export default function D40_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={3}/>;
}
