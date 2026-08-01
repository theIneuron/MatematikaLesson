import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок"
  },
  "prompt": {
    "uz": "4(x + 3) ifodani qavslarni ochib yozing.",
    "ru": "Раскройте скобки в выражении 4(x + 3)."
  },
  "options": [
    "4x+3",
    "4x+7",
    "4x+12",
    "x+12"
  ],
  "answer": "4x+12",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, 4x+12 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается 4x+12."
  }
};

export default function D32_01(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={1}/>;
}
