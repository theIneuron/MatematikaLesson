import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "O'zaro teskari sonlar",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "Chap ustundagi har bir sonni ko'paytmasi 1 bo'ladigan o'zaro teskari son bilan moslashtiring.",
    "ru": "Соедините каждое число с обратным ему числом."
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
    "ru": "Все пары найдены правильно. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_03(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={3}/>;
}
