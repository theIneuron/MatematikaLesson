import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "7 va 9 ning EKUKi",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "The LCM of 7 and 9"
  },
  "prompt": {
    "uz": "7 va 9 sonlarining EKUKini hisoblab yozing.",
    "ru": "Вычислите НОК чисел 7 и 9.",
    "en": "Work out the LCM of 7 and 9 and write the answer."
  },
  "answer": "63",
  "explanation": {
    "uz": "7 va 9 o'zaro tub: EKUK = 7 × 9 = 63.",
    "ru": "Правильный ответ: 63. НОК — наименьшее положительное общее кратное.",
    "en": "7 and 9 are coprime, so the LCM = 7 × 9 = 63."
  }
};

export default function D06_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={2}/>;
}
