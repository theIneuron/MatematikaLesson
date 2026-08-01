import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности"
  },
  "prompt": {
    "uz": "Radiusi 6 cm bo‘lgan yarim doiraning perimetrini π=3 da toping.",
    "ru": "Найдите периметр полукруга радиуса 6 см при π=3."
  },
  "options": [
    "18 cm",
    "24 cm",
    "30 cm",
    "36 cm"
  ],
  "answer": "30 cm",
  "translationsRu": {
    "18 cm": "18 см",
    "24 cm": "24 см",
    "30 cm": "30 см",
    "36 cm": "36 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 30 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 30 cm."
  }
};

export default function D38_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={7}/>;
}
