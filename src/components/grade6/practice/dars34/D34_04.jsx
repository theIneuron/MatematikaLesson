import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения"
  },
  "prompt": {
    "uz": "5x − 6 = 19 tenglamani yeching.",
    "ru": "Решите уравнение 5x − 6 = 19."
  },
  "options": [
    "3",
    "4",
    "5",
    "6"
  ],
  "answer": "5",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 5 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 5."
  }
};

export default function D34_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={4}/>;
}
