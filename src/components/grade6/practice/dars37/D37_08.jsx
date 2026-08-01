import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Diametri 26 cm bo‘lgan doiraning radiusini yozing.",
    "ru": "Запишите радиус круга диаметром 26 см."
  },
  "answer": "13",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 13 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 13."
  }
};

export default function D37_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={8}/>;
}
