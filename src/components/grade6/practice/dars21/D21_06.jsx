import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Foiz va kasr",
    "ru": "Практика к уроку 21. Проценты"
  },
  "prompt": {
    "uz": "Foiz, oddiy kasr va o'nli kasrning teng qiymatlarini juftlang.",
    "ru": "Соедините равные проценты, обыкновенные и десятичные дроби."
  },
  "left": [
    "1/5",
    "3/8",
    "7/10"
  ],
  "right": [
    "70%",
    "20%",
    "37,5%"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "explanation": {
    "uz": "1/5 = 20%; 3/8 = 37,5%; 7/10 = 70%.",
    "ru": "Все пары найдены правильно. Один процент равен одной сотой части целого."
  }
};

export default function D21_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={6}/>;
}
