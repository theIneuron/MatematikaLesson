import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы"
  },
  "prompt": {
    "uz": "Qirrasi 6 cm bo‘lgan kub hajmini yozing.",
    "ru": "Запишите объём куба с ребром 6 см."
  },
  "answer": "216",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 216 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 216."
  }
};

export default function D44_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={2}/>;
}
