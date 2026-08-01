import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Teng kasrlar",
    "ru": "Практика к уроку 7. Основное свойство дроби"
  },
  "prompt": {
    "uz": "Har bir kasrni unga teng kasr bilan moslashtiring.",
    "ru": "Соедините каждую дробь с равной ей дробью."
  },
  "left": [
    "1/3",
    "2/7",
    "4/5"
  ],
  "right": [
    "3/9",
    "6/21",
    "12/15"
  ],
  "pairs": [
    0,
    1,
    2
  ],
  "explanation": {
    "uz": "1/3 = 3/9, 2/7 = 6/21 va 4/5 = 12/15.",
    "ru": "Все пары найдены правильно. При умножении или делении числителя и знаменателя на одно число значение дроби не меняется."
  }
};

export default function D07_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={7} task={3}/>;
}
