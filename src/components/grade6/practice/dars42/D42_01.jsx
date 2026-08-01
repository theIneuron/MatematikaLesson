import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника"
  },
  "prompt": {
    "uz": "Tomonlari 5 cm, 7 cm va 8 cm bo‘lgan uchburchak perimetrini toping.",
    "ru": "Найдите периметр треугольника со сторонами 5, 7 и 8 см."
  },
  "options": [
    "18 cm",
    "20 cm",
    "21 cm",
    "28 cm"
  ],
  "answer": "20 cm",
  "translationsRu": {
    "18 cm": "18 см",
    "20 cm": "20 см",
    "21 cm": "21 см",
    "28 cm": "28 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 20 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 20 cm."
  }
};

export default function D42_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={1}/>;
}
