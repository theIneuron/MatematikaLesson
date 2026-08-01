import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "match",
  "topic": {
    "uz": "Tenglamalarni moslashtirish",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "Har bir tenglamada noma'lum butun sonni toping va o'ng ustundagi javob bilan moslashtiring.",
    "ru": "Решите каждое уравнение и соедините с ответом."
  },
  "left": [
    "x × 4/7 = 20",
    "x × 5/12 = 25",
    "x × 7/10 = 49"
  ],
  "right": [
    "60",
    "70",
    "35"
  ],
  "pairs": [
    2,
    0,
    1
  ],
  "explanation": {
    "uz": "20 : 4 × 7 = 35, 25 : 5 × 12 = 60, 49 : 7 × 10 = 70.",
    "ru": "Все пары найдены правильно. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_09(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={9}/>;
}
