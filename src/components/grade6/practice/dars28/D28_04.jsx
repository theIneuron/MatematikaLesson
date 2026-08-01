import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni ayirish",
    "ru": "Вычитание рациональных чисел"
  },
  "prompt": {
    "uz": "Ertalab 6 °C, kechasi −2 °C bo‘ldi. Harorat necha darajaga pasaydi?",
    "ru": "Утром было 6 °C, ночью стало −2 °C. На сколько градусов понизилась температура?"
  },
  "options": [
    "4 °C",
    "6 °C",
    "8 °C",
    "10 °C"
  ],
  "answer": "8 °C",
  "explanation": {
    "uz": "Pasayish miqdori 6 − (−2) = 8 °C.",
    "ru": "Величина понижения: 6 − (−2) = 8 °C."
  }
};

export default function D28_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={28} task={4}/>;
}
