import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Aylana uzunligi",
    "ru": "Длина окружности"
  },
  "prompt": {
    "uz": "Diametri 12 cm bo‘lgan aylana uzunligini π=3 deb hisoblab yozing.",
    "ru": "Вычислите длину окружности диаметра 12 см при π=3."
  },
  "answer": "36",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 36 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 36."
  }
};

export default function D38_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={38} task={2}/>;
}
