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
    "katakli 6×4 to‘rtburchak",
    "uning yarmi",
    "undan 5 katak ayirildi"
  ],
  "right": [
    "24",
    "12",
    "19"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "katakli 6×4 to‘rtburchak": "клетчатый 6×4 прямоугольник",
    "uning yarmi": "его половина",
    "undan 5 katak ayirildi": "из него вычли 5 клеток"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: katakli 6×4 to‘rtburchak ↔ 24; uning yarmi ↔ 12; undan 5 katak ayirildi ↔ 19.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D43_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={9}/>;
}
