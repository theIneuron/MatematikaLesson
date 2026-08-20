import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "EKUKni hisoblash",
    "ru": "Практика к уроку 6. Наименьшее общее кратное",
    "en": "Working out the LCM"
  },
  "prompt": {
    "uz": "EKUK(4, 6) ni toping.",
    "ru": "Найдите НОК чисел 4 и 6.",
    "en": "Find LCM(4, 6)."
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
    "ru": "Правильный ответ: 12. НОК — наименьшее положительное общее кратное.",
    "en": "The multiples of 4 are 4, 8, 12...; the multiples of 6 are 6, 12... The first common multiple is 12."
  }
};

export default function D06_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={6} task={1}/>;
}
