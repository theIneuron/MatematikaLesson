import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'q simmetriyasi",
    "ru": "Осевая симметрия"
  },
  "prompt": {
    "uz": "Kvadrat nechta simmetriya o‘qiga ega?",
    "ru": "Сколько осей симметрии у квадрата?"
  },
  "options": [
    "1",
    "2",
    "3",
    "4"
  ],
  "answer": "4",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 4 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 4."
  }
};

export default function D40_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={40} task={1}/>;
}
