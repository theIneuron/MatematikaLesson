import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Geometriya va ma'lumotlar bo'limi yakuni",
    "ru": "Итог раздела геометрии и данных",
    "en": "Wrap-up of the geometry and data block"
  },
  "prompt": {
    "uz": "1, 4, 6, 8, 11 qatorining o‘rtacha qiymatini yozing.",
    "ru": "Запишите среднее ряда 1, 4, 6, 8, 11.",
    "en": "Write the mean value of the list 1, 4, 6, 8, 11."
  },
  "answer": "6",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 6 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 6.",
    "en": "Do the operations of the calculation in the right order and the answer is 6."
  }
};

export default function D46_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={46} task={8}/>;
}
