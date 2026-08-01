import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга"
  },
  "prompt": {
    "uz": "Diametri 10 cm bo‘lgan doira yuzini π=3,14 da yozing.",
    "ru": "Запишите площадь круга диаметром 10 см при π=3,14."
  },
  "answer": "78,5",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 78,5 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 78,5."
  }
};

export default function D39_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={8}/>;
}
