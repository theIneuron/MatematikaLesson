import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения"
  },
  "prompt": {
    "uz": "3x = 27 tenglamaning yechimini yozing.",
    "ru": "Запишите решение уравнения 3x = 27."
  },
  "answer": "9",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 9 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 9."
  }
};

export default function D34_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={2}/>;
}
