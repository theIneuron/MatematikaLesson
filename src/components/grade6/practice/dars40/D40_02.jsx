import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "Teng yonli uchburchakning simmetriya o‘qlari sonini yozing.",
    "ru": "Запишите число осей симметрии равнобедренного треугольника."
  },
  "answer": "1",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 1 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 1."
  }
};

export default function D40_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={2}/>;
}
