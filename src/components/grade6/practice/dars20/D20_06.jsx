import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Masofalarni moslashtirish",
    "ru": "Практика к уроку 20. Масштаб",
    "en": "Matching distances"
  },
  "prompt": {
    "uz": "Xaritadagi masofa va masshtabdan foydalanib, haqiqiy masofalarni moslashtiring.",
    "ru": "По расстоянию на карте и масштабу найдите реальные расстояния.",
    "en": "Use the distance on the map and the scale to match the real distances."
  },
  "left": [
    "3 cm, 1 : 400 000",
    "5 cm, 1 : 20 000",
    "7 cm, 1 : 100 000"
  ],
  "right": [
    "1 km",
    "7 km",
    "12 km"
  ],
  "pairs": [
    2,
    0,
    1
  ],
  "translationsRu": {
    "3 cm, 1 : 400 000": "3 см, 1 : 400 000",
    "5 cm, 1 : 20 000": "5 см, 1 : 20 000",
    "7 cm, 1 : 100 000": "7 см, 1 : 100 000",
    "1 km": "1 км",
    "7 km": "7 км",
    "12 km": "12 км"
  },
  "explanation": {
    "uz": "3 cm = 12 km; 5 cm = 1 km; 7 cm = 7 km.",
    "ru": "Все пары найдены правильно. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности.",
    "en": "3 cm stand for 12 km; 5 cm for 1 km; 7 cm for 7 km."
  }
};

export default function D20_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={6}/>;
}
