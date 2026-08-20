import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых",
    "en": "Collecting like terms"
  },
  "prompt": {
    "uz": "4y − 3 + 2y + 8 ifodada ozod hadni yozing.",
    "ru": "Запишите свободный член после упрощения 4y − 3 + 2y + 8.",
    "en": "Write the constant term of the expression 4y − 3 + 2y + 8."
  },
  "answer": "5",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 5 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 5.",
    "en": "Do the operations of the calculation in the right order and the answer is 5."
  }
};

export default function D33_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={8}/>;
}
