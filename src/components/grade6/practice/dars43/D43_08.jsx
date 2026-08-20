import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Uchburchak va murakkab shakllar yuzi",
    "ru": "Площадь треугольника и сложных фигур",
    "en": "The area of a triangle and of compound shapes"
  },
  "prompt": {
    "uz": "Yuzi 54 cm², balandligi 9 cm bo‘lgan uchburchak asosini yozing.",
    "ru": "Запишите основание треугольника площадью 54 см² и высотой 9 см.",
    "en": "Write the base of a triangle with the area 54 cm² and the height 9 cm."
  },
  "answer": "12",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 12 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 12.",
    "en": "Do the operations of the calculation in the right order and the answer is 12."
  }
};

export default function D43_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={43} task={8}/>;
}
