import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Kasrlarni qo'shish",
    "ru": "Практика к уроку 10. Сложение и вычитание дробей"
  },
  "prompt": {
    "uz": "1/3 + 1/4 yig'indini hisoblab, qisqarmas javobni toping.",
    "ru": "Вычислите 1/3 + 1/4 и выберите несократимый ответ."
  },
  "options": [
    "2/7",
    "5/12",
    "7/12",
    "8/12"
  ],
  "answer": "7/12",
  "explanation": {
    "uz": "1/3 = 4/12 va 1/4 = 3/12; 4/12 + 3/12 = 7/12.",
    "ru": "Правильный ответ: 7/12. Сначала дроби приводят к общему знаменателю, затем выполняют действие с числителями."
  }
};

export default function D10_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={10} task={1}/>;
}
