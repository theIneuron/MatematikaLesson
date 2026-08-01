import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Kasrlarni qisqartirish",
    "ru": "Практика к уроку 7. Основное свойство дроби"
  },
  "prompt": {
    "uz": "Kasrlarni ularning qisqartirilgan ko'rinishi bilan bog'lang.",
    "ru": "Соедините дроби с их сокращённым видом."
  },
  "left": [
    "8/12",
    "15/25",
    "18/24"
  ],
  "right": [
    "2/3",
    "3/5",
    "3/4"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "8/12 = 2/3, 15/25 = 3/5, 18/24 = 3/4.",
    "ru": "Все пары найдены правильно. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется."
  }
};

export default function D07_06(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={6}/>;
}
