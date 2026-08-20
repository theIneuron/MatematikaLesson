import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур",
    "en": "The area of a triangle and of compound shapes"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "to‘rtburchak 8·5",
    "uchburchak 10·4:2",
    "kvadrat 7²"
  ],
  "right": [
    "40",
    "20",
    "49"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "to‘rtburchak 8·5": "прямоугольник 8·5",
    "uchburchak 10·4:2": "треугольник 10·4:2",
    "kvadrat 7²": "квадрат 7²"
  },
  "translationsEn": {
    "to‘rtburchak 8·5": "a rectangle 8·5",
    "uchburchak 10·4:2": "a triangle 10·4:2",
    "kvadrat 7²": "a square 7²"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: to‘rtburchak 8·5 ↔ 40; uchburchak 10·4:2 ↔ 20; kvadrat 7² ↔ 49.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: a rectangle 8·5 ↔ 40; a triangle 10·4:2 ↔ 20; a square 7² ↔ 49."
  }
};

export default function D43_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={6}/>;
}
