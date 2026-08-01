import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Tenglama yechimlari",
    "ru": "Практика к уроку 25. Модуль числа"
  },
  "prompt": {
    "uz": "Modulli tenglamani uning barcha yechimlari yozilgan javob bilan bog'lang.",
    "ru": "Соедините уравнение с модулем со всеми его решениями."
  },
  "left": [
    "|x| = 4",
    "|x| = 1,5",
    "|x| = 0"
  ],
  "right": [
    "x = 0",
    "x = −1,5 yoki x = 1,5",
    "x = −4 yoki x = 4"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "translationsRu": {
    "x = −1,5 yoki x = 1,5": "x = −1,5 или x = 1,5",
    "x = −4 yoki x = 4": "x = −4 или x = 4"
  },
  "explanation": {
    "uz": "|x| = 4 da x = ±4; |x| = 1,5 da x = ±1,5; |x| = 0 da x = 0.",
    "ru": "Все пары найдены правильно. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным."
  }
};

export default function D25_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={6}/>;
}
