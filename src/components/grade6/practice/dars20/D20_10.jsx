import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Katta masshtabli masala",
    "ru": "Практика к уроку 20. Масштаб",
    "en": "A problem with a large scale"
  },
  "prompt": {
    "uz": "1 : 2 500 000 masshtabli xaritada temiryo'l uzunligi 7,2 santimetr. Haqiqiy uzunlikni toping.",
    "ru": "На карте масштаба 1 : 2 500 000 длина железной дороги равна 7,2 см. Найдите реальную длину.",
    "en": "On a map with the scale 1 : 2 500 000 the length of a railway is 7,2 centimetres. Find its real length."
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
    "ru": "Правильный ответ: 180 км. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности.",
    "en": "1 cm stands for 25 km; 7,2 × 25 = 180 km."
  }
};

export default function D20_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={10}/>;
}
