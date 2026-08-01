import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Rejadagi uzunlik",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "Bog' rejasida 1 : 500 masshtab ishlatilgan. Rejadagi 8 santimetr haqiqiy uzunlikda necha metr bo'ladi?",
    "ru": "План сада выполнен в масштабе 1 : 500. Сколько метров изображают 8 сантиметров?"
  },
  "options": [
    "20 m",
    "40 m",
    "80 m",
    "400 m"
  ],
  "answer": "40 m",
  "translationsRu": {
    "20 m": "20 м",
    "40 m": "40 м",
    "80 m": "80 м",
    "400 m": "400 м"
  },
  "explanation": {
    "uz": "8 × 500 = 4 000 cm = 40 metr.",
    "ru": "Правильный ответ: 40 м. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={7}/>;
}
