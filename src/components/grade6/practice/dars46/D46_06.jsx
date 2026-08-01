import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных"
  },
  "prompt": {
    "uz": "Har bir yozuvni unga mos javob yoki tavsif bilan bog‘lang.",
    "ru": "Соедините каждую запись с подходящим ответом или описанием."
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
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: C=2πr ↔ aylana uzunligi; S=ah/2 ↔ uchburchak yuzi; V=abc ↔ parallelepiped hajmi.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D46_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={6}/>;
}
