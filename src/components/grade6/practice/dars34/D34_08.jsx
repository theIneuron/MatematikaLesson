import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения",
    "en": "Linear equations"
  },
  "prompt": {
    "uz": "6x − 5 = 2x + 15 tenglamaning yechimini yozing.",
    "ru": "Запишите решение уравнения 6x − 5 = 2x + 15.",
    "en": "Write the solution of the equation 6x − 5 = 2x + 15."
  },
  "answer": "5",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 5 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 5.",
    "en": "Do the operations of the calculation in the right order and the answer is 5."
  }
};

export default function D34_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={8}/>;
}
