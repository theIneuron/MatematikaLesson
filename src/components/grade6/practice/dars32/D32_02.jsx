import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок"
  },
  "prompt": {
    "uz": "x = 5 bo‘lganda 3(x − 2) qiymatini yozing.",
    "ru": "При x = 5 вычислите 3(x − 2)."
  },
  "answer": "9",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 9 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 9."
  }
};

export default function D32_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={2}/>;
}
