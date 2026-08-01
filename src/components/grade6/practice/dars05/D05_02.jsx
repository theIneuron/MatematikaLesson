import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "21 va 49 ning EKUBi",
    "ru": "Практика к уроку 5. Наибольший общий делитель"
  },
  "prompt": {
    "uz": "21 va 49 sonlarining EKUBini hisoblab yozing.",
    "ru": "Вычислите НОД чисел 21 и 49."
  },
  "answer": "7",
  "explanation": {
    "uz": "21 va 49 ning umumiy bo'luvchilari 1 va 7; EKUB 7.",
    "ru": "Правильный ответ: 7. НОД — наибольший из общих делителей."
  }
};

export default function D05_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={5} task={2}/>;
}
