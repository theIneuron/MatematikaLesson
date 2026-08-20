import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Modulli ifodalar",
    "ru": "Практика к уроку 25. Модуль числа",
    "en": "Expressions with a modulus"
  },
  "prompt": {
    "uz": "Har bir modulli ifodani uning qiymati bilan moslashtiring.",
    "ru": "Соедините каждое выражение с модулем с его значением.",
    "en": "Match each expression with a modulus to its value."
  },
  "left": [
    "|−7|",
    "|4 − 10|",
    "|−3| + |5|"
  ],
  "right": [
    "6",
    "7",
    "8"
  ],
  "pairs": [
    1,
    0,
    2
  ],
  "explanation": {
    "uz": "|−7| = 7; |4 − 10| = 6; |−3| + |5| = 8.",
    "ru": "Все пары найдены правильно. Модуль числа — его расстояние от нуля, поэтому модуль не бывает отрицательным.",
    "en": "|−7| = 7; |4 − 10| = 6; |−3| + |5| = 8."
  }
};

export default function D25_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={25} task={3}/>;
}
