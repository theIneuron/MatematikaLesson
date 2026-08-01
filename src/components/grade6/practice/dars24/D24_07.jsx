import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ikki bosqichli siljish",
    "ru": "Практика к уроку 24. Координатная прямая"
  },
  "prompt": {
    "uz": "P nuqta 4 koordinatada turibdi. U avval 7 birlik chapga, keyin 3 birlik o'ngga siljidi. Yakuniy koordinatani toping.",
    "ru": "Точка P(4) переместилась на 7 единиц влево, затем на 3 единицы вправо. Найдите итоговую координату."
  },
  "options": [
    "−6",
    "0",
    "2",
    "6"
  ],
  "answer": "0",
  "explanation": {
    "uz": "4 − 7 + 3 = 0.",
    "ru": "Правильный ответ: 0. Чем правее расположено число на координатной прямой, тем оно больше."
  }
};

export default function D24_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={24} task={7}/>;
}
