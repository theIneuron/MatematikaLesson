import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения"
  },
  "prompt": {
    "uz": "a = −3 bo‘lganda 5a − 2 qiymatini yozing.",
    "ru": "При a = −3 запишите значение 5a − 2."
  },
  "answer": "-17",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob -17 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ -17."
  }
};

export default function D31_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={2}/>;
}
