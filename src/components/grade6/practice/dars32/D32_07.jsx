import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок"
  },
  "prompt": {
    "uz": "2(3x + 4) − x ifodani soddalashtiring.",
    "ru": "Упростите выражение 2(3x + 4) − x."
  },
  "options": [
    "5x+8",
    "6x+3",
    "7x+8",
    "5x+4"
  ],
  "answer": "5x+8",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 5x+8 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 5x+8."
  }
};

export default function D32_07(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={7}/>;
}
