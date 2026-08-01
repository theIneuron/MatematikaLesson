import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "2 dm³",
    "3500 cm³",
    "0,5 m³"
  ],
  "right": [
    "2000 cm³",
    "3,5 dm³",
    "500 dm³"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "2 dm³": "2 дм³",
    "3500 cm³": "3500 см³",
    "0,5 m³": "0,5 м³",
    "2000 cm³": "2000 см³",
    "3,5 dm³": "3,5 дм³",
    "500 dm³": "500 дм³"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 2 dm³ ↔ 2000 cm³; 3500 cm³ ↔ 3,5 dm³; 0,5 m³ ↔ 500 dm³.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D44_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={6}/>;
}
