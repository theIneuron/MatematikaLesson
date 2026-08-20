import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "64 va 96 ning EKUBi",
    "ru": "Практика к уроку 5. Наибольший общий делитель",
    "en": "The GCD of 64 and 96"
  },
  "prompt": {
    "uz": "64 va 96 sonlarining EKUBini hisoblab yozing.",
    "ru": "Вычислите НОД чисел 64 и 96.",
    "en": "Work out the GCD of 64 and 96 and write the answer."
  },
  "answer": "32",
  "explanation": {
    "uz": "64 va 96 ning umumiy bo'luvchilari orasida eng kattasi 32.",
    "ru": "Правильный ответ: 32. НОД — наибольший из общих делителей.",
    "en": "The greatest of the common divisors of 64 and 96 is 32."
  }
};

export default function D05_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={8}/>;
}
