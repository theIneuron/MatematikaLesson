import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных"
  },
  "prompt": {
    "uz": "Radiusi 7 cm aylana uzunligini π=22/7 da toping.",
    "ru": "Найдите длину окружности радиуса 7 см при π=22/7."
  },
  "options": [
    "22 cm",
    "44 cm",
    "49 cm",
    "154 cm"
  ],
  "answer": "44 cm",
  "translationsRu": {
    "22 cm": "22 см",
    "44 cm": "44 см",
    "49 cm": "49 см",
    "154 cm": "154 см"
  },
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 44 cm hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 44 cm."
  }
};

export default function D46_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={1}/>;
}
