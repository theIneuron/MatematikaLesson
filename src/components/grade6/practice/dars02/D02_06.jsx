import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Oxirgi raqam",
    "ru": "Практика к уроку 2. Признаки делимости на 2, 5 и 10"
  },
  "prompt": {
    "uz": "Sonlarni ularning oxirgi raqami bilan moslashtiring.",
    "ru": "Соедините каждое число с его последней цифрой."
  },
  "left": [
    "618",
    "745",
    "830"
  ],
  "right": [
    "0",
    "5",
    "8"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "618 ning oxirgi raqami 8, 745 niki 5, 830 niki 0.",
    "ru": "Все пары найдены правильно. Для делимости на 2, 5 и 10 достаточно проверить последнюю цифру."
  }
};

export default function D02_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={2} task={6}/>;
}
