import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "48 va 72 ning EKUBi",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "The GCD of 48 and 72"
  },
  "prompt": {
    "uz": "48 va 72 ning eng katta umumiy bo'luvchisini toping.",
    "ru": "Найдите НОД чисел 48 и 72.",
    "en": "Find the greatest common divisor of 48 and 72."
  },
  "options": [
    "8",
    "12",
    "18",
    "24"
  ],
  "answer": "24",
  "explanation": {
    "uz": "48 va 72 ning eng katta umumiy bo'luvchisi 24.",
    "ru": "Правильный ответ: 24. НОД — наибольший из общих делителей.",
    "en": "The greatest common divisor of 48 and 72 is 24."
  }
};

export default function D05_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={7}/>;
}
