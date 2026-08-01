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
    "chegara va ichki qism": "chegara и ichki qism",
    "aylana bo‘lagi": "часть окружности",
    "aylana": "окружность",
    "doira": "круг",
    "yoy": "дуга"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: faqat chegara ↔ aylana; chegara va ichki qism ↔ doira; aylana bo‘lagi ↔ yoy.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D37_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={9}/>;
}
