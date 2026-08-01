import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых"
  },
  "prompt": {
    "uz": "4x + 3y − x ifodani soddalashtiring.",
    "ru": "Упростите выражение 4x + 3y − x."
  },
  "options": [
    "3x+3y",
    "6xy",
    "3x",
    "4x+2y"
  ],
  "answer": "3x+3y",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 3x+3y hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 3x+3y."
  }
};

export default function D33_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={4}/>;
}
