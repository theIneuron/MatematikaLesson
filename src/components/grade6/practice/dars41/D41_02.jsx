import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия"
  },
  "prompt": {
    "uz": "B(−6; 8) nuqtaning O markazga nisbatan aksi abssissasini yozing.",
    "ru": "Запишите абсциссу образа B(−6; 8) при симметрии относительно O."
  },
  "answer": "6",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 6 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 6."
  }
};

export default function D41_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={2}/>;
}
