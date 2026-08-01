import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Fazoviy shakllar hajmi va o'lchov birliklari",
    "ru": "Объём пространственных фигур и единицы"
  },
  "prompt": {
    "uz": "Uzunligi 8 cm, eni 5 cm, hajmi 240 cm³ bo‘lgan qutining balandligini yozing.",
    "ru": "Длина коробки 8 см, ширина 5 см, объём 240 см³. Запишите высоту."
  },
  "answer": "6",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 6 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 6."
  }
};

export default function D44_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={44} task={8}/>;
}
