import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Amallarni moslashtirish",
    "ru": "Практика к уроку 14. Умножение и деление десятичных дробей",
    "en": "Matching operations"
  },
  "prompt": {
    "uz": "Chap ustundagi o'nli kasrlar bilan bajarilgan amallarni hisoblang va mos natija bilan bog'lang.",
    "ru": "Соедините действия с десятичными дробями с результатами.",
    "en": "Work out the operations with decimals in the left column and connect each one with its result."
  },
  "left": [
    "1,25 × 0,8",
    "4,2 : 1,4",
    "0,36 × 2,5"
  ],
  "right": [
    "0,9",
    "1",
    "3"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "explanation": {
    "uz": "1,25 × 0,8 = 1; 4,2 : 1,4 = 3; 0,36 × 2,5 = 0,9.",
    "ru": "Все пары найдены правильно. При действиях с десятичными дробями важно правильно определить место запятой.",
    "en": "1,25 × 0,8 = 1; 4,2 : 1,4 = 3; 0,36 × 2,5 = 0,9."
  }
};

export default function D14_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={14} task={3}/>;
}
