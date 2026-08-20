import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Xaritadagi masofa",
    "ru": "Практика к уроку 20. Масштаб",
    "en": "A distance on a map"
  },
  "prompt": {
    "uz": "Xarita masshtabi 1 : 100 000. Xaritadagi 4 santimetr haqiqiy masofada necha kilometrni bildiradi?",
    "ru": "Масштаб карты 1 : 100 000. Какое реальное расстояние изображают 4 сантиметра?",
    "en": "The scale of a map is 1 : 100 000. How many kilometres of real distance do 4 centimetres on the map stand for?"
  },
  "options": [
    "2 km",
    "4 km",
    "10 km",
    "40 km"
  ],
  "answer": "4 km",
  "translationsRu": {
    "2 km": "2 км",
    "4 km": "4 км",
    "10 km": "10 км",
    "40 km": "40 км"
  },
  "explanation": {
    "uz": "1 : 100 000 da 1 cm = 1 km. 4 cm = 4 km.",
    "ru": "Правильный ответ: 4 км. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности.",
    "en": "At 1 : 100 000 one cm stands for 1 km. So 4 cm = 4 km."
  }
};

export default function D20_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={1}/>;
}
