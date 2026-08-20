import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Doira yuzi",
    "ru": "Площадь круга",
    "en": "The area of a disc"
  },
  "prompt": {
    "uz": "Radiusi 6 cm bo‘lgan doira yuzini π=3 deb hisoblab yozing.",
    "ru": "Вычислите площадь круга радиуса 6 см при π=3.",
    "en": "Work out the area of a disc with the radius 6 cm, taking π=3, and write it down."
  },
  "answer": "108",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 108 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 108.",
    "en": "Do the operations of the calculation in the right order and the answer is 108."
  }
};

export default function D39_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={39} task={2}/>;
}
