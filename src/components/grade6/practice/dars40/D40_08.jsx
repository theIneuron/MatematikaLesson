import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "B(−7; 4) nuqtaning x o‘qiga nisbatan aksi ordinatasini yozing.",
    "ru": "Запишите ординату отражения B(−7; 4) относительно оси x."
  },
  "answer": "-4",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob -4 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ -4."
  }
};

export default function D40_08(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={8}/>;
}
