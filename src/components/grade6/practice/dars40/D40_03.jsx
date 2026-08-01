import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
    "to‘g‘ri to‘rtburchak": "to‘g‘ri прямоугольник",
    "turli tomonli uchburchak": "turli tomonli треугольник"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: kvadrat ↔ 4; to‘g‘ri to‘rtburchak ↔ 2; turli tomonli uchburchak ↔ 0.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D40_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={3}/>;
}
