import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Foiz va o'nli kasr",
    "ru": "Практика к уроку 21. Проценты",
    "en": "A percentage and a decimal"
  },
  "prompt": {
    "uz": "Har bir foizni unga teng o'nli kasr bilan moslashtiring.",
    "ru": "Соедините каждый процент с равной десятичной дробью.",
    "en": "Match each percentage with the decimal equal to it."
  },
  "left": [
    "7%",
    "45%",
    "125%"
  ],
  "right": [
    "1,25",
    "0,07",
    "0,45"
  ],
  "pairs": [
    1,
    2,
    0
  ],
  "explanation": {
    "uz": "7% = 0,07; 45% = 0,45; 125% = 1,25.",
    "ru": "Все пары найдены правильно. Один процент равен одной сотой части целого.",
    "en": "7% = 0,07; 45% = 0,45; 125% = 1,25."
  }
};

export default function D21_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={21} task={3}/>;
}
