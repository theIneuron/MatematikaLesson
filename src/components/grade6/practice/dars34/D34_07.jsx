import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения"
  },
  "prompt": {
    "uz": "2(x + 3) = 18 tenglamaning ildizini toping.",
    "ru": "Найдите корень уравнения 2(x + 3) = 18."
  },
  "options": [
    "3",
    "6",
    "9",
    "12"
  ],
  "answer": "6",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 6 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 6."
  }
};

export default function D34_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={7}/>;
}
