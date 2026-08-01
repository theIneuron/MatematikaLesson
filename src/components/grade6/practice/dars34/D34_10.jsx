import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Chiziqli tenglamalar",
    "ru": "Линейные уравнения"
  },
  "prompt": {
    "uz": "4(2x − 1) = 3x + 16 tenglamani yeching.",
    "ru": "Решите уравнение 4(2x − 1) = 3x + 16."
  },
  "options": [
    "2",
    "3",
    "4",
    "5"
  ],
  "answer": "4",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 4 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 4."
  }
};

export default function D34_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={34} task={10}/>;
}
