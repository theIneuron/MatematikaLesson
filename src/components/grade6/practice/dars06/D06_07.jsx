import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "18 va 24 ning EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное"
  },
  "prompt": {
    "uz": "18 va 24 ning eng kichik umumiy karralisini toping.",
    "ru": "Найдите НОК чисел 18 и 24."
  },
  "options": [
    "36",
    "48",
    "72",
    "96"
  ],
  "answer": "72",
  "explanation": {
    "uz": "18 va 24 ning eng kichik umumiy karralisi 72.",
    "ru": "Правильный ответ: 72. НОК — наименьшее положительное общее кратное."
  }
};

export default function D06_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={7}/>;
}
