import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Harfli ifodalar",
    "ru": "Буквенные выражения"
  },
  "prompt": {
    "uz": "n = 6 bo‘lganda n² − 10 qiymatini yozing.",
    "ru": "При n = 6 запишите значение n² − 10."
  },
  "answer": "26",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 26 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 26."
  }
};

export default function D31_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={31} task={8}/>;
}
