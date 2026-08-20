import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Xarita uzunligi",
    "ru": "Практика к уроку 20. Масштаб",
    "en": "The length on the map"
  },
  "prompt": {
    "uz": "Haqiqiy masofa 18 kilometr, xarita masshtabi 1 : 300 000. Xaritadagi kesma uzunligini toping.",
    "ru": "Реальное расстояние равно 18 км, масштаб — 1 : 300 000. Найдите длину отрезка на карте.",
    "en": "The real distance is 18 kilometres and the scale of the map is 1 : 300 000. Find the length of the line segment on the map."
  },
  "options": [
    "3 cm",
    "6 cm",
    "9 cm",
    "12 cm"
  ],
  "answer": "6 cm",
  "translationsRu": {
    "3 cm": "3 см",
    "6 cm": "6 см",
    "9 cm": "9 см",
    "12 cm": "12 см"
  },
  "explanation": {
    "uz": "1 cm = 3 km. 18 : 3 = 6 cm.",
    "ru": "Правильный ответ: 6 см. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности.",
    "en": "1 cm stands for 3 km. And 18 : 3 = 6 cm."
  }
};

export default function D20_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={4}/>;
}
