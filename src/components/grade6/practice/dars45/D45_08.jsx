import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными",
    "en": "Working with data"
  },
  "prompt": {
    "uz": "14, 9, 17, 11, 20 qatorining o‘zgarish kengligini yozing.",
    "ru": "Запишите размах ряда 14, 9, 17, 11, 20.",
    "en": "Write the range of the list 14, 9, 17, 11, 20."
  },
  "answer": "11",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 11 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 11.",
    "en": "Do the operations of the calculation in the right order and the answer is 11."
  }
};

export default function D45_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={8}/>;
}
