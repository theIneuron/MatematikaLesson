import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Uchburchak elementlari, turlari va perimetri",
    "ru": "Элементы, виды и периметр треугольника"
  },
  "prompt": {
    "uz": "Teng tomonli uchburchak perimetri 36 cm. Bir tomoni uzunligini yozing.",
    "ru": "Периметр равностороннего треугольника 36 см. Запишите длину стороны."
  },
  "answer": "12",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 12 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 12."
  }
};

export default function D42_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={42} task={2}/>;
}
