import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Radiusi 5 cm bo‘lgan aylana uzunligini π=3,14 da toping.",
    "ru": "Найдите длину окружности радиуса 5 см при π=3,14.",
    "en": "Find the circumference of a circle with the radius 5 cm, taking π=3,14."
  },
  "options": [
    "15,7 cm",
    "31,4 cm",
    "62,8 cm",
    "78,5 cm"
  ],
  "answer": "31,4 cm",
  "translationsRu": {
    "15,7 cm": "15,7 см",
    "31,4 cm": "31,4 см",
    "62,8 cm": "62,8 см",
    "78,5 cm": "78,5 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 31,4 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 31,4 см.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 31,4 cm."
  }
};

export default function D38_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={1}/>;
}
