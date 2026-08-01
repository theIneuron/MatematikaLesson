import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Ma'lumotlar bilan ishlash",
    "ru": "Работа с данными"
  },
  "prompt": {
    "uz": "3, 6, 8, 10, 12 qatorining medianasini yozing.",
    "ru": "Запишите медиану ряда 3, 6, 8, 10, 12."
  },
  "answer": "8",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 8 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 8."
  }
};

export default function D45_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={45} task={2}/>;
}
