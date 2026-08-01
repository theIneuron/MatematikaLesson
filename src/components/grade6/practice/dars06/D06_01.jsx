import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "EKUKni hisoblash",
    "ru": "Практика к уроку 6. Наименьшее общее кратное"
  },
  "prompt": {
    "uz": "EKUK(4, 6) ni toping.",
    "ru": "Найдите НОК чисел 4 и 6."
  },
  "options": [
    "8",
    "10",
    "12",
    "24"
  ],
  "answer": "12",
  "explanation": {
    "uz": "4 ning karralilari 4, 8, 12...; 6 niki 6, 12... Birinchi umumiy karrali 12.",
    "ru": "Правильный ответ: 12. НОК — наименьшее положительное общее кратное."
  }
};

export default function D06_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={1}/>;
}
