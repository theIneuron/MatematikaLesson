import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных",
    "en": "Wrap-up of the geometry and data block"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием.",
    "en": "Connect each record with the answer or the description that fits it."
  },
  "left": [
    "C=2πr",
    "S=ah/2",
    "V=abc"
  ],
  "right": [
    "aylana uzunligi",
    "uchburchak yuzi",
    "parallelepiped hajmi"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "aylana uzunligi": "длина окружности",
    "uchburchak yuzi": "площадь треугольника",
    "parallelepiped hajmi": "объём параллелепипеда"
  },
  "translationsEn": {
    "aylana uzunligi": "the circumference of a circle",
    "uchburchak yuzi": "the area of a triangle",
    "parallelepiped hajmi": "the volume of a cuboid"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: C=2πr ↔ aylana uzunligi; S=ah/2 ↔ uchburchak yuzi; V=abc ↔ parallelepiped hajmi.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: C=2πr ↔ the circumference of a circle; S=ah/2 ↔ the area of a triangle; V=abc ↔ the volume of a cuboid."
  }
};

export default function D46_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={6}/>;
}
