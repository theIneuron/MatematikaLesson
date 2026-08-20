import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Aylana uzunligi 62,8 cm, π=3,14. Diametrni toping.",
    "ru": "Длина окружности 62,8 см, π=3,14. Найдите диаметр.",
    "en": "The circumference is 62,8 cm and π=3,14. Find the diameter."
  },
  "options": [
    "10 cm",
    "20 cm",
    "30 cm",
    "40 cm"
  ],
  "answer": "20 cm",
  "translationsRu": {
    "10 cm": "10 см",
    "20 cm": "20 см",
    "30 cm": "30 см",
    "40 cm": "40 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 20 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 20 см.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 20 cm."
  }
};

export default function D38_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={4}/>;
}
