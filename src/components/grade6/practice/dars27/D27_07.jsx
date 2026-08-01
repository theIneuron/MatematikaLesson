import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел"
  },
  "prompt": {
    "uz": "−3/4 + 1/2 yig‘indini umumiy maxrajga keltirib hisoblang.",
    "ru": "Приведите к общему знаменателю и вычислите −3/4 + 1/2."
  },
  "options": [
    "−1/4",
    "1/4",
    "−5/4",
    "5/4"
  ],
  "answer": "−1/4",
  "explanation": {
    "uz": "1/2 = 2/4, demak −3/4 + 2/4 = −1/4.",
    "ru": "1/2 = 2/4, поэтому −3/4 + 2/4 = −1/4."
  }
};

export default function D27_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={7}/>;
}
