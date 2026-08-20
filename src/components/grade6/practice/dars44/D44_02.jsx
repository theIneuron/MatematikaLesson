import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы",
    "en": "The volume of solids and units of measure"
  },
  "prompt": {
    "uz": "Qirrasi 6 cm bo‘lgan kub hajmini yozing.",
    "ru": "Запишите объём куба с ребром 6 см.",
    "en": "Write the volume of a cube with the edge 6 cm."
  },
  "answer": "216",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 216 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 216.",
    "en": "Do the operations of the calculation in the right order and the answer is 216."
  }
};

export default function D44_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={2}/>;
}
