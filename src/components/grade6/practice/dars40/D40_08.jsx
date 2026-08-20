import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия",
    "en": "Reflection symmetry"
  },
  "prompt": {
    "uz": "B(−7; 4) nuqtaning x o‘qiga nisbatan aksi ordinatasini yozing.",
    "ru": "Запишите ординату отражения B(−7; 4) относительно оси x.",
    "en": "Write the ordinate of the reflection of the point B(−7; 4) in the x axis."
  },
  "answer": "-4",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob -4 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ -4.",
    "en": "Do the operations of the calculation in the right order and the answer is -4."
  }
};

export default function D40_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={8}/>;
}
