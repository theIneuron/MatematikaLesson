import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Katta masshtabli masala",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "1 : 2 500 000 masshtabli xaritada temiryo'l uzunligi 7,2 santimetr. Haqiqiy uzunlikni toping.",
    "ru": "На карте масштаба 1 : 2 500 000 длина железной дороги равна 7,2 см. Найдите реальную длину."
  },
  "options": [
    "72 km",
    "144 km",
    "180 km",
    "250 km"
  ],
  "answer": "180 km",
  "translationsRu": {
    "72 km": "72 км",
    "144 km": "144 км",
    "180 km": "180 км",
    "250 km": "250 км"
  },
  "explanation": {
    "uz": "1 cm = 25 km; 7,2 × 25 = 180 km.",
    "ru": "Правильный ответ: 180 км. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={10}/>;
}
