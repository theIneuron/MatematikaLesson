import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности",
    "en": "The circumference of a circle"
  },
  "prompt": {
    "uz": "Diametri 12 cm bo‘lgan aylana uzunligini π=3 deb hisoblab yozing.",
    "ru": "Вычислите длину окружности диаметра 12 см при π=3.",
    "en": "Work out the circumference of a circle with the diameter 12 cm, taking π=3, and write it down."
  },
  "answer": "36",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 36 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 36.",
    "en": "Do the operations of the calculation in the right order and the answer is 36."
  }
};

export default function D38_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={2}/>;
}
