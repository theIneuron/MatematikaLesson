import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "O'xshash hadlarni ixchamlash",
    "ru": "Приведение подобных слагаемых"
  },
  "prompt": {
    "uz": "3(2x + 1) − 4x + 5 ni ixchamlang.",
    "ru": "Упростите 3(2x + 1) − 4x + 5."
  },
  "options": [
    "2x+8",
    "10x+8",
    "2x−2",
    "6x+4"
  ],
  "answer": "2x+8",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 2x+8 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 2x+8."
  }
};

export default function D33_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={33} task={10}/>;
}
