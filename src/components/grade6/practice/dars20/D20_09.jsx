import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Xarita va haqiqat",
    "ru": "Практика к уроку 20. Масштаб"
  },
  "prompt": {
    "uz": "Har bir haqiqiy masofani berilgan masshtabdagi xarita uzunligi bilan moslashtiring.",
    "ru": "Соедините реальные расстояния с длиной на карте при указанном масштабе."
  },
  "left": [
    "30 km, 1 : 500 000",
    "8 km, 1 : 200 000",
    "900 m, 1 : 30 000"
  ],
  "right": [
    "3 cm",
    "4 cm",
    "6 cm"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "30 km, 1 : 500 000": "30 км, 1 : 500 000",
    "8 km, 1 : 200 000": "8 км, 1 : 200 000",
    "900 m, 1 : 30 000": "900 м, 1 : 30 000",
    "3 cm": "3 см",
    "4 cm": "4 см",
    "6 cm": "6 см"
  },
  "explanation": {
    "uz": "30 km ga 6 cm, 8 km ga 4 cm, 900 m ga 3 cm mos keladi.",
    "ru": "Все пары найдены правильно. В масштабе 1 : n одному сантиметру на карте соответствуют n сантиметров на местности."
  }
};

export default function D20_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={20} task={9}/>;
}
