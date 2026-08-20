import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Bo'lish natijalari",
    "ru": "Практика к уроку 1. Делители и кратные",
    "en": "Results of division"
  },
  "prompt": {
    "uz": "Ifodalarni javoblari bilan moslashtiring.",
    "ru": "Соедините каждое выражение с его значением.",
    "en": "Match each expression with its value."
  },
  "left": [
    "12 : 3",
    "15 : 5",
    "14 : 7"
  ],
  "right": [
    "2",
    "3",
    "4"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "12 : 3 = 4, 15 : 5 = 3 va 14 : 7 = 2.",
    "ru": "Все пары найдены правильно. Делитель делит число без остатка, а кратное получается умножением на натуральное число.",
    "en": "12 : 3 = 4, 15 : 5 = 3 and 14 : 7 = 2."
  }
};

export default function D01_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={1} task={3}/>;
}
