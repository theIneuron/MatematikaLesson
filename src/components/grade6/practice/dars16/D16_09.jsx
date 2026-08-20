import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Kasrlarni aylantirish",
    "ru": "Практика к уроку 16. Задачи с дробями и десятичными дробями",
    "en": "Turning fractions into decimals"
  },
  "prompt": {
    "uz": "Teng qiymatli oddiy va o'nli kasr yozuvlarini bir-biri bilan bog'lang.",
    "ru": "Соедините равные обыкновенные и десятичные дроби.",
    "en": "Connect the common fraction records and the decimal records of equal value."
  },
  "left": [
    "3/8",
    "7/20",
    "9/10"
  ],
  "right": [
    "0,35",
    "0,9",
    "0,375"
  ],
  "pairs": [
    2,
    0,
    1
  ],
  "explanation": {
    "uz": "3/8 = 0,375; 7/20 = 0,35; 9/10 = 0,9.",
    "ru": "Все пары найдены правильно. Сначала величины приводят к одному виду, затем выполняют нужное действие.",
    "en": "3/8 = 0,375; 7/20 = 0,35; 9/10 = 0,9."
  }
};

export default function D16_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={16} task={9}/>;
}
