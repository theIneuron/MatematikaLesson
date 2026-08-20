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
  "translationsEn": {
    "katakli 6×4 to‘rtburchak": "a 6×4 rectangle on the grid",
    "uning yarmi": "half of it",
    "undan 5 katak ayirildi": "5 squares taken off it"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: katakli 6×4 to‘rtburchak ↔ 24; uning yarmi ↔ 12; undan 5 katak ayirildi ↔ 19.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: a 6×4 rectangle on the grid ↔ 24; half of it ↔ 12; 5 squares taken off it ↔ 19."
  }
};

export default function D43_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={9}/>;
}
