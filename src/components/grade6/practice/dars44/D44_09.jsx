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
    "1 m³",
    "1 dm³",
    "1 cm³"
  ],
  "right": [
    "1 000 000 cm³",
    "1000 cm³",
    "1 cm³"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "1 m³": "1 м³",
    "1 dm³": "1 дм³",
    "1 cm³": "1 см³",
    "1 000 000 cm³": "1 000 000 см³",
    "1000 cm³": "1000 см³"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: 1 m³ ↔ 1 000 000 cm³; 1 dm³ ↔ 1000 cm³; 1 cm³ ↔ 1 cm³.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D44_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={9}/>;
}
