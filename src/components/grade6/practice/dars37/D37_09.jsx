import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг",
    "en": "The circle and the disc"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "faqat chegara",
    "chegara va ichki qism",
    "aylana bo‘lagi"
  ],
  "right": [
    "aylana",
    "doira",
    "yoy"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "faqat chegara": "только граница",
    "chegara va ichki qism": "граница и внутренняя часть",
    "aylana bo‘lagi": "часть окружности",
    "aylana": "окружность",
    "doira": "круг",
    "yoy": "дуга"
  },
  "translationsEn": {
    "faqat chegara": "only the boundary",
    "chegara va ichki qism": "the boundary and the inside",
    "aylana bo‘lagi": "a piece of the circle",
    "aylana": "circle",
    "doira": "disc",
    "yoy": "arc"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: faqat chegara ↔ aylana; chegara va ichki qism ↔ doira; aylana bo‘lagi ↔ yoy.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: only the boundary ↔ circle; the boundary and the inside ↔ disc; a piece of the circle ↔ arc."
  }
};

export default function D37_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={9}/>;
}
