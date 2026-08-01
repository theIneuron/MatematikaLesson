import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "O nuqta markaz, OA=9 cm. AB diametr bo‘lsa, AB uzunligini toping.",
    "ru": "O — центр, OA=9 см. Если AB — диаметр, найдите AB."
  },
  "options": [
    "9 cm",
    "18 cm",
    "27 cm",
    "81 cm"
  ],
  "answer": "18 cm",
  "translationsRu": {
    "9 cm": "9 см",
    "18 cm": "18 см",
    "27 cm": "27 см",
    "81 cm": "81 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 18 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 18 cm."
  }
};

export default function D37_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={10}/>;
}
