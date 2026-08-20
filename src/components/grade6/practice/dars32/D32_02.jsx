import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок",
    "en": "Opening brackets"
  },
  "prompt": {
    "uz": "x = 5 bo‘lganda 3(x − 2) qiymatini yozing.",
    "ru": "При x = 5 вычислите 3(x − 2).",
    "en": "Write the value of 3(x − 2) when x = 5."
  },
  "answer": "9",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 9 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 9.",
    "en": "Do the operations of the calculation in the right order and the answer is 9."
  }
};

export default function D32_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={2}/>;
}
