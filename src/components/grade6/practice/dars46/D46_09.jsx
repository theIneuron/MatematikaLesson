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
    "(3;4) y o‘qiga aks",
    "r=5,π=3 doira yuzi",
    "2 dm³"
  ],
  "right": [
    "(−3;4)",
    "75 cm²",
    "2000 cm³"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "translationsRu": {
    "(3;4) y o‘qiga aks": "(3;4) отражение относительно y",
    "r=5,π=3 doira yuzi": "площадь круга r=5, π=3",
    "2 dm³": "2 дм³",
    "75 cm²": "75 см²",
    "2000 cm³": "2000 см³"
  },
  "translationsEn": {
    "(3;4) y o‘qiga aks": "(3;4) reflected in the y axis",
    "r=5,π=3 doira yuzi": "the area of a disc with r=5, π=3"
  },
  "explanation": {
    "uz": "Har bir chap kartani alohida tekshirish orqali mosliklar topiladi: (3;4) y o‘qiga aks ↔ (−3;4); r=5,π=3 doira yuzi ↔ 75 cm²; 2 dm³ ↔ 2000 cm³.",
    "ru": "Каждая пара найдена по определению или вычислению, указанному в условии темы.",
    "en": "The matches are found by checking every card on the left on its own: (3;4) reflected in the y axis ↔ (−3;4); the area of a disc with r=5, π=3 ↔ 75 cm²; 2 dm³ ↔ 2000 cm³."
  }
};

export default function D46_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={9}/>;
}
