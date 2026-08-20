import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
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
    "diametr orqali": "через диаметр",
    "yarim yoy": "половина окружности"
  },
  "translationsEn": {
    "yarim yoy": "half the circle",
    "radius orqali": "through the radius",
    "diametr orqali": "through the diameter"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: C=2πr ↔ radius orqali; C=πd ↔ diametr orqali; yarim yoy ↔ πr.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: C=2πr ↔ through the radius; C=πd ↔ through the diameter; half the circle ↔ πr."
  }
};

export default function D38_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={6}/>;
}
