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
    "kub qirrasi 4",
    "doira r=3,π=3",
    "qator 2,5,5,8"
  ],
  "right": [
    "V=64",
    "S=27",
    "moda=5"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "kub qirrasi 4": "ребро куба 4",
    "doira r=3,π=3": "круг r=3, π=3",
    "qator 2,5,5,8": "ряд 2, 5, 5, 8",
    "moda=5": "мода=5"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: kub qirrasi 4 ↔ V=64; doira r=3,π=3 ↔ S=27; qator 2,5,5,8 ↔ moda=5.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы."
  }
};

export default function D46_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={3}/>;
}
