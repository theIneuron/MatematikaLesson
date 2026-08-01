import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Masshtab ma'nosi",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "Har bir masshtabda xaritadagi 1 santimetrga mos haqiqiy masofani topib, juftlang.",
    "ru": "Соедините каждый масштаб с реальным расстоянием, соответствующим 1 сантиметру."
  },
  "left": [
    "1 : 50 000",
    "1 : 200 000",
    "1 : 1 000 000"
  ],
  "right": [
    "10 km",
    "2 km",
    "0,5 km"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "10 km": "10 км",
    "2 km": "2 км",
    "0,5 km": "0,5 км"
  },
  "explanation": {
    "uz": "1 : 50 000 da 0,5 km; 1 : 200 000 da 2 km; 1 : 1 000 000 da 10 km.",
    "ru": "Все пары найдены правильно. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={3}/>;
}
