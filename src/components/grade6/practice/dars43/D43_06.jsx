import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: to‘rtburchak 8·5 ↔ 40; uchburchak 10·4:2 ↔ 20; kvadrat 7² ↔ 49.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D43_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={6}/>;
}
