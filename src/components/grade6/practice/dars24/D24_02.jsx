import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "input",
  "topic": {
    "uz": "O'ngga siljish",
    "ru": "Практика к уроку 24. Координатная прямая"
  },
  "prompt": {
    "uz": "Nuqta −7 koordinatadan o'ngga 11 birlik siljidi. Uning yangi koordinatasini yozing.",
    "ru": "Точка переместилась от −7 на 11 единиц вправо. Запишите новую координату."
  },
  "answer": "4",
  "explanation": {
    "uz": "−7 + 11 = 4.",
    "ru": "Правильный ответ: 4. Чем правее расположено число на координатной прямой, тем оно больше."
  }
};

export default function D24_02(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={2}/>;
}
