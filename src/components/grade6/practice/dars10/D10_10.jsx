import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Uch kasrli ifoda",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "3/4 + 5/12 − 1/6 ifodaning qiymatini toping.",
    "ru": "Вычислите значение выражения 3/4 + 5/12 − 1/6."
  },
  "options": [
    "5/6",
    "11/12",
    "1",
    "7/6"
  ],
  "answer": "1",
  "explanation": {
    "uz": "3/4 + 5/12 − 1/6 = 9/12 + 5/12 − 2/12 = 12/12 = 1.",
    "ru": "Правильный ответ: 1. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={10}/>;
}
