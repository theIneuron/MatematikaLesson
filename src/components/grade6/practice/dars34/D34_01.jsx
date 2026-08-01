import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения"
  },
  "prompt": {
    "uz": "x + 9 = 17 tenglamaning ildizini toping.",
    "ru": "Найдите корень уравнения x + 9 = 17."
  },
  "options": [
    "6",
    "8",
    "9",
    "26"
  ],
  "answer": "8",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 8 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 8."
  }
};

export default function D34_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={1}/>;
}
