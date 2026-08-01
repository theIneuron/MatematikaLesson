import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур"
  },
  "prompt": {
    "uz": "Asosi 14 cm, balandligi 5 cm bo‘lgan uchburchak yuzini yozing.",
    "ru": "Запишите площадь треугольника с основанием 14 см и высотой 5 см."
  },
  "answer": "35",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 35 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 35."
  }
};

export default function D43_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={2}/>;
}
