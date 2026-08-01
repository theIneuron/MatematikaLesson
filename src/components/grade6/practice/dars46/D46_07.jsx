import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных"
  },
  "prompt": {
    "uz": "Tomonlari 7, 10 va 12 cm uchburchak perimetrini toping.",
    "ru": "Найдите периметр треугольника со сторонами 7, 10 и 12 см."
  },
  "options": [
    "27 cm",
    "29 cm",
    "32 cm",
    "34 cm"
  ],
  "answer": "29 cm",
  "translationsRu": {
    "27 cm": "27 см",
    "29 cm": "29 см",
    "32 cm": "32 см",
    "34 cm": "34 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 29 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 29 cm."
  }
};

export default function D46_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={7}/>;
}
