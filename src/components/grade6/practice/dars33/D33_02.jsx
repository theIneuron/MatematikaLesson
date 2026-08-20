import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых",
    "en": "Collecting like terms"
  },
  "prompt": {
    "uz": "7a − 12a ifodadagi koeffitsiyentni yozing.",
    "ru": "Запишите коэффициент выражения 7a − 12a.",
    "en": "Write the coefficient of the expression 7a − 12a."
  },
  "answer": "-5",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob -5 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ -5.",
    "en": "Do the operations of the calculation in the right order and the answer is -5."
  }
};

export default function D33_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={2}/>;
}
