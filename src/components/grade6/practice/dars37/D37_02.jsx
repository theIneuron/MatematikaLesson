import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Aylana va doira",
    "ru": "Окружность и круг"
  },
  "prompt": {
    "uz": "Radiusi 7 cm bo‘lgan aylananing diametrini yozing.",
    "ru": "Запишите диаметр окружности радиуса 7 см."
  },
  "answer": "14",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 14 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 14."
  }
};

export default function D37_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={37} task={2}/>;
}
