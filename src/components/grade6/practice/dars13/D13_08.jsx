import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Kasr qismli tenglama",
    "ru": "Практика к уроку 13. Взаимно обратные числа и нахождение целого"
  },
  "prompt": {
    "uz": "Noma'lum sonning 5/9 qismi 35 ga teng. Butun sonni hisoblab, javobni yozing.",
    "ru": "Пять девятых некоторого числа равны 35. Найдите целое число."
  },
  "answer": "63",
  "explanation": {
    "uz": "Butun son 35 : 5 × 9 = 63 ga teng.",
    "ru": "Правильный ответ: 63. Произведение взаимно обратных чисел равно единице."
  }
};

export default function D13_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={13} task={8}/>;
}
