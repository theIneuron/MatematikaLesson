import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок",
    "en": "Opening brackets"
  },
  "prompt": {
    "uz": "5(2x − 3) − 2(x + 4) ni soddalashtiring.",
    "ru": "Упростите 5(2x − 3) − 2(x + 4).",
    "en": "Simplify 5(2x − 3) − 2(x + 4)."
  },
  "options": [
    "8x−23",
    "8x−7",
    "12x−23",
    "12x−7"
  ],
  "answer": "8x−23",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 8x−23 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 8x−23.",
    "en": "Apply the rule of the topic to the values in the problem step by step and you get 8x−23."
  }
};

export default function D32_10(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={10}/>;
}
