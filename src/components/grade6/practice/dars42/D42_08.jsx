import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника",
    "en": "Elements, kinds and perimeter of a triangle"
  },
  "prompt": {
    "uz": "Teng yonli uchburchak yon tomonlari 11 cm, asosi 8 cm. Perimetrini yozing.",
    "ru": "Боковые стороны равнобедренного треугольника 11 см, основание 8 см. Запишите периметр.",
    "en": "The equal sides of an isosceles triangle are 11 cm and its base is 8 cm. Write its perimeter."
  },
  "answer": "30",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 30 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 30.",
    "en": "Do the operations of the calculation in the right order and the answer is 30."
  }
};

export default function D42_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={8}/>;
}
