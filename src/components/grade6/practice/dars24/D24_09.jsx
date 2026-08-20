import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Qarama-qarshi sonlar",
    "ru": "Практика к уроку 24. Координатная прямая",
    "en": "Opposite numbers"
  },
  "prompt": {
    "uz": "Har bir songa koordinata chizig'idagi qarama-qarshi sonini moslashtiring.",
    "ru": "Соедините каждое число с противоположным ему числом.",
    "en": "Match each number with its opposite number on the coordinate line."
  },
  "left": [
    "−11",
    "4",
    "−2,5"
  ],
  "right": [
    "2,5",
    "−4",
    "11"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "−11 ga 11, 4 ga −4, −2,5 ga 2,5 qarama-qarshi.",
    "ru": "Все пары найдены правильно. Чем правее расположено число на координатной прямой, тем оно больше.",
    "en": "The opposite of −11 is 11, of 4 it is −4, and of −2,5 it is 2,5."
  }
};

export default function D24_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={9}/>;
}
