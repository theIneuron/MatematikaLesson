import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "7 va 9 ning EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное"
  },
  "prompt": {
    "uz": "7 va 9 sonlarining EKUKini hisoblab yozing.",
    "ru": "Вычислите НОК чисел 7 и 9."
  },
  "answer": "63",
  "explanation": {
    "uz": "7 va 9 o'zaro tub: EKUK = 7 × 9 = 63.",
    "ru": "Правильный ответ: 63. НОК — наименьшее положительное общее кратное."
  }
};

export default function D06_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={2}/>;
}
