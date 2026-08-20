import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "EKUBni hisoblash",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "Working out the GCD"
  },
  "prompt": {
    "uz": "EKUB(12, 18) ni toping.",
    "ru": "Найдите НОД чисел 12 и 18.",
    "en": "Find GCD(12, 18)."
  },
  "options": [
    "2",
    "3",
    "6",
    "9"
  ],
  "answer": "6",
  "explanation": {
    "uz": "12 va 18 ning umumiy bo'luvchilari 1, 2, 3, 6; eng kattasi 6.",
    "ru": "Правильный ответ: 6. НОД — наибольший из общих делителей.",
    "en": "The common divisors of 12 and 18 are 1, 2, 3 and 6; the greatest of them is 6."
  }
};

export default function D05_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={1}/>;
}
