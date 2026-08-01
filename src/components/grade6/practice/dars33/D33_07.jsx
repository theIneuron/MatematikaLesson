import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых"
  },
  "prompt": {
    "uz": "2x + 5 + 7x − 3 ifodani ixchamlang.",
    "ru": "Упростите выражение 2x + 5 + 7x − 3."
  },
  "options": [
    "9x+2",
    "9x+8",
    "5x+2",
    "14x+2"
  ],
  "answer": "9x+2",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 9x+2 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 9x+2."
  }
};

export default function D33_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={7}/>;
}
