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
    "a=8,h=4",
    "a=9,h=6",
    "a=12,h=5"
  ],
  "right": [
    "16",
    "27",
    "30"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: a=8,h=4 ↔ 16; a=9,h=6 ↔ 27; a=12,h=5 ↔ 30.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D43_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={3}/>;
}
