import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Kasr qismli tenglama",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого",
    "en": "An equation with a fractional part"
  },
  "prompt": {
    "uz": "Noma'lum sonning 5/9 qismi 35 ga teng. Butun sonni hisoblab, javobni yozing.",
    "ru": "Пять девятых некоторого числа равны 35. Найдите целое число.",
    "en": "5/9 of an unknown number is equal to 35. Work out the whole number and write the answer."
  },
  "answer": "63",
  "explanation": {
    "uz": "Butun son 35 : 5 × 9 = 63 ga teng.",
    "ru": "Правильный ответ: 63. Произведение взаимно обратных чисел равно единице.",
    "en": "The whole number is 35 : 5 × 9 = 63."
  }
};

export default function D13_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={8}/>;
}
