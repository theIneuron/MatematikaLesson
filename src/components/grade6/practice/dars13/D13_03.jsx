import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'zaro teskari sonlar",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "Reciprocal numbers"
  },
  "prompt": {
    "uz": "Chap ustundagi har bir sonni ko'paytmasi 1 bo'ladigan o'zaro teskari son bilan moslashtiring.",
    "ru": "Соедините каждое число с обратным ему числом.",
    "en": "Match each number in the left column with the number whose product with it is 1."
  },
  "left": [
    "5/12",
    "8/3",
    "7"
  ],
  "right": [
    "1/7",
    "3/8",
    "12/5"
  ],
  "pairs": [
    2,
    1,
    0
  ],
  "explanation": {
    "uz": "5/12 ga 12/5, 8/3 ga 3/8, 7 ga esa 1/7 o'zaro teskari.",
    "ru": "Все пары найдены правильно. Произведение взаимно обратных чисел равно единице.",
    "en": "The reciprocal of 5/12 is 12/5, of 8/3 it is 3/8, and of 7 it is 1/7."
  }
};

export default function D13_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={3}/>;
}
