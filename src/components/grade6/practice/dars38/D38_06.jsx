import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
  },
  "left": [
    "C=2πr",
    "C=πd",
    "yarim yoy"
  ],
  "right": [
    "radius orqali",
    "diametr orqali",
    "πr"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "radius orqali": "через радиус",
    "diametr orqali": "через диаметр"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: C=2πr ↔ radius orqali; C=πd ↔ diametr orqali; yarim yoy ↔ πr.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D38_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={6}/>;
}
