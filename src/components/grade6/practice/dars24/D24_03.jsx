import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Koordinata siljishi",
    "ru": "Практика к уроку 24. Координатная прямая",
    "en": "A move along the line"
  },
  "prompt": {
    "uz": "Har bir siljishni hosil bo'ladigan yangi koordinata bilan moslashtiring.",
    "ru": "Соедините каждое перемещение с новой координатой.",
    "en": "Match each move with the new coordinate it gives."
  },
  "left": [
    "−3 dan 5 birlik o‘ngga",
    "6 dan 9 birlik chapga",
    "−8 dan 2 birlik chapga"
  ],
  "right": [
    "−10",
    "−3",
    "2"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "−3 dan 5 birlik o‘ngga": "от −3 на 5 единиц вправо",
    "6 dan 9 birlik chapga": "от 6 на 9 единиц влево",
    "−8 dan 2 birlik chapga": "от −8 на 2 единицы влево"
  },
  "translationsEn": {
    "−3 dan 5 birlik o‘ngga": "5 units to the right from −3",
    "6 dan 9 birlik chapga": "9 units to the left from 6",
    "−8 dan 2 birlik chapga": "2 units to the left from −8"
  },
  "explanation": {
    "uz": "−3 + 5 = 2; 6 − 9 = −3; −8 − 2 = −10.",
    "ru": "Все пары найдены правильно. Чем правее расположено число на координатной прямой, тем оно больше.",
    "en": "−3 + 5 = 2; 6 − 9 = −3; −8 − 2 = −10."
  }
};

export default function D24_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={3}/>;
}
