import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Qavslarni ochish",
    "ru": "Раскрытие скобок"
  },
  "prompt": {
    "uz": "−(x − 7) ifodaning qavssiz ko‘rinishini tanlang.",
    "ru": "Выберите выражение без скобок, равное −(x − 7)."
  },
  "options": [
    "−x−7",
    "−x+7",
    "x−7",
    "x+7"
  ],
  "answer": "−x+7",
  "explanation": {
    "uz": "Shartdagi qiymatlarga mavzu qoidasini ketma-ket qo‘llasak, −x+7 hosil bo‘ladi.",
    "ru": "После последовательного применения правила темы к данным условия получается −x+7."
  }
};

export default function D32_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={32} task={4}/>;
}
