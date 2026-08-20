import Grade6Question from '../Grade6Question.jsx';

const ITEM = {
  "type": "choice",
  "topic": {
    "uz": "Ratsional sonlarni qo'shish",
    "ru": "Сложение рациональных чисел",
    "en": "Adding rational numbers"
  },
  "prompt": {
    "uz": "Harorat −3 °C edi va 8 °C ga ko‘tarildi. Yangi haroratni toping.",
    "ru": "Температура была −3 °C и повысилась на 8 °C. Найдите новую температуру.",
    "en": "The temperature was −3 °C and it rose by 8 °C. Find the new temperature."
  },
  "options": [
    "−11 °C",
    "−5 °C",
    "5 °C",
    "11 °C"
  ],
  "answer": "5 °C",
  "explanation": {
    "uz": "−3 + 8 = 5, shuning uchun yangi harorat 5 °C.",
    "ru": "−3 + 8 = 5, поэтому новая температура равна 5 °C.",
    "en": "−3 + 8 = 5, so the new temperature is 5 °C."
  }
};

export default function D27_04(props) {
  return <Grade6Question {...props} item={ITEM} lesson={27} task={4}/>;
}
