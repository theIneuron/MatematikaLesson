import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "21 va 49 ning EKUBi",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "The GCD of 21 and 49"
  },
  "prompt": {
    "uz": "21 va 49 sonlarining EKUBini hisoblab yozing.",
    "ru": "Вычислите НОД чисел 21 и 49.",
    "en": "Work out the GCD of 21 and 49 and write the answer."
  },
  "answer": "7",
  "explanation": {
    "uz": "21 va 49 ning umumiy bo'luvchilari 1 va 7; EKUB 7.",
    "ru": "Правильный ответ: 7. НОД — наибольший из общих делителей.",
    "en": "The common divisors of 21 and 49 are 1 and 7; the GCD is 7."
  }
};

export default function D05_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={2}/>;
}
