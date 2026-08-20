import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга",
    "en": "The area of a disc"
  },
  "prompt": {
    "uz": "Doira yuzi 75 cm², π=3. Radiusini toping.",
    "ru": "Площадь круга 75 см², π=3. Найдите радиус.",
    "en": "The area of a disc is 75 cm² and π=3. Find its radius."
  },
  "options": [
    "3 cm",
    "4 cm",
    "5 cm",
    "25 cm"
  ],
  "answer": "5 cm",
  "translationsRu": {
    "3 cm": "3 см",
    "4 cm": "4 см",
    "5 cm": "5 см",
    "25 cm": "25 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 5 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 5 см.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 5 cm."
  }
};

export default function D39_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={4}/>;
}
