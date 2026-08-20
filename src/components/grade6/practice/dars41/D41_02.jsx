import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "Markaziy simmetriya",
    "ru": "Центральная симметрия",
    "en": "Point symmetry"
  },
  "prompt": {
    "uz": "B(−6; 8) nuqtaning O markazga nisbatan aksi abssissasini yozing.",
    "ru": "Запишите абсциссу образа B(−6; 8) при симметрии относительно O.",
    "en": "Write the abscissa of the image of the point B(−6; 8) about the centre O."
  },
  "answer": "6",
  "explanation": {
    "uz": "Hisoblashdagi amallarni to‘g‘ri tartibda bajarsak, javob 6 bo‘ladi.",
    "ru": "Если выполнить действия в правильном порядке, получится ответ 6.",
    "en": "Do the operations of the calculation in the right order and the answer is 6."
  }
};

export default function D41_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={41} task={2}/>;
}
