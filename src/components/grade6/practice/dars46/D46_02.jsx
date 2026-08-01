import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных"
  },
  "prompt": {
    "uz": "Asosi 16 cm, balandligi 9 cm uchburchak yuzini yozing.",
    "ru": "Запишите площадь треугольника с основанием 16 см и высотой 9 см."
  },
  "answer": "72",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 72 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 72."
  }
};

export default function D46_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={2}/>;
}
