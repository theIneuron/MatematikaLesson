import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "radius",
    "diametr",
    "vatar"
  ],
  "right": [
    "r",
    "2r",
    "ikki nuqtani tutashtiradi"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "radius": "радиус",
    "diametr": "диаметр",
    "vatar": "хорда"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: radius ↔ r; diametr ↔ 2r; vatar ↔ ikki nuqtani tutashtiradi.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D37_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={3}/>;
}
