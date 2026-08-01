import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых"
  },
  "prompt": {
    "uz": "3x + 5x ifodani ixchamlang.",
    "ru": "Приведите подобные слагаемые в выражении 3x + 5x."
  },
  "options": [
    "8",
    "8x",
    "15x",
    "2x"
  ],
  "answer": "8x",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 8x hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 8x."
  }
};

export default function D33_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={1}/>;
}
