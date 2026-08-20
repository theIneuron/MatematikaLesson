import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок",
    "en": "Opening brackets"
  },
  "prompt": {
    "uz": "x = −2 bo‘lganda −2(x + 5) qiymatini yozing.",
    "ru": "При x = −2 вычислите −2(x + 5).",
    "en": "Write the value of −2(x + 5) when x = −2."
  },
  "answer": "-6",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob -6 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ -6.",
    "en": "Do the operations of the calculation in the right order and the answer is -6."
  }
};

export default function D32_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={8}/>;
}
